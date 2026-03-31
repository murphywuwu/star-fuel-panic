# Fuel Frog Panic

> **10 minutes. One goal. Who refuels fastest wins.**

---

## One-Liner

Turn boring supply runs into adrenaline-pumping races — on-chain scoring, auto-settlement, instant payouts.

---

## The Problem We Solve

EVE Frontier's economy depends on players refueling infrastructure (stargates, SSUs, turrets). But the reality is:

| Pain Point | Result |
|------------|--------|
| **No feedback** | You hauled fuel across the galaxy, nobody knows |
| **No priority** | Which station needs rescue first? |
| **No incentive** | Contributions are opaque, rewards unclear |
| **No coordination** | Everyone works alone, inefficient |

**Consequence: Essential gameplay becomes a chore. Players avoid it.**

---

## Our Solution

```
┌─────────────────────────────────────────────────────────┐
│                    10-MINUTE MATCH                       │
│                                                          │
│  🎯 Target Node     →  📊 Real-time Score  →  💰 Auto Pay │
│  (Low fuel alert)      (On-chain events)      (Winners)  │
│                                                          │
│  Urgency 3x  ×  Panic 1.5x  ×  Fuel Grade 1.5x  =  6.75x │
└─────────────────────────────────────────────────────────┘
```

**Core Loop:**
1. **Discover** — Browse urgent stations, pick a match
2. **Team Up** — Create/join a squad, pay entry fee
3. **Race** — Refuel target nodes, earn points in real-time
4. **Settle** — Match ends, on-chain auto-payout

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                  View Layer                                  │
│  React / Next.js UI rendering and user interaction                           │
│  (Lobby, Planning, Match Runtime, Settlement, In-game Overlay, Wallet Entry) │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │ User actions / state display
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                               Controller Layer                               │
│  Custom hooks orchestrating use-cases and UI workflows                       │
│  (useLobbyController, useMatchRuntimeController, useSettlementController)    │
└───────────────────┬──────────────────────────────────┬───────────────────────┘
                    │ Coordinate business calls         │ Read / update state
                    ▼                                   ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────────┐
│            Service Layer             │  │            Model Layer            │
│  API clients + stream adapters       │  │  Zustand stores by domain         │
│  (match/team/stream/settlement)      │  │  (auth/lobby/matchRuntime/settle) │
└───────────────────┬──────────────────┘  └───────────────────────────────────┘
                    │ HTTP / SSE / WebSocket
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         BFF / Runtime Layer (Next API)                       │
│  Route handlers + domain runtimes                                            │
│  (matchRuntime, teamRuntime, chainSyncEngine, settlementRuntime, etc.)       │
└──────────────────────────┬──────────────────────────────┬────────────────────┘
                           │ Read/write projections        │ Chain/world reads
                           ▼                               ▼
┌───────────────────────────────────────────┐   ┌──────────────────────────────┐
│     Supabase / PostgreSQL / Realtime      │   │      On-chain / External     │
│  matches, teams, scores, settlements,     │   │  Sui RPC + Event Stream      │
│  network_nodes, fuel_events               │   │  EVE World Metadata API      │
└───────────────────────────────────────────┘   └──────────────────────────────┘
```

### Runtime Layer (BFF) — The Backend Brain

The **Runtime Layer** is the core backend that bridges frontend, database, and blockchain. It consists of domain-specific "runtimes" — long-running or request-scoped modules that own specific business logic.

| Runtime | Responsibility | Data Source | Data Sink |
|---------|----------------|-------------|-----------|
| `solarSystemRuntime` | Sync solar system metadata, gate links, search | EVE World API | `solar_systems_cache` |
| `constellationRuntime` | Aggregate constellation views, system selectability | Cache + DB | `constellation_summaries` |
| `nodeRuntime` | Maintain NetworkNode state, 5s fuel refresh | Sui RPC | `network_nodes` |
| `nodeRecommendationRuntime` | Calculate recommended nodes by location/topology | DB projections | (in-memory) |
| `matchRuntime` | Match lifecycle: draft → lobby → running → settled | DB + Chain | `matches`, `match_stream_events` |
| `teamRuntime` | Team creation, join requests, approval, payment | DB + Chain | `teams`, `team_members`, `team_payments` |
| `fuelConfigRuntime` | Cache on-chain fuel efficiency config (5min TTL) | Sui RPC | (in-memory) |
| `chainSyncEngine` | Listen to `FuelEvent`, triple-filter, score calculation | Sui Event Stream | `fuel_events`, `match_scores` |
| `settlementRuntime` | Freeze scores, calculate splits, execute on-chain payout | DB + Chain | `settlements` |

### Deployment Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCTION DEPLOYMENT                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐  │
│  │    Vercel (Web)     │    │  Railway (Workers)  │    │    Supabase     │  │
│  │                     │    │                     │    │                 │  │
│  │  • Next.js SSR/SSG  │    │  • chainSyncEngine  │    │  • PostgreSQL   │  │
│  │  • API Routes (BFF) │    │  • nodeRuntime      │    │  • Realtime     │  │
│  │  • Short-lived req  │    │  • matchRuntime     │    │  • Auth         │  │
│  │                     │    │  • settlementRuntime│    │  • Storage      │  │
│  └─────────┬───────────┘    │  • nodeIndexer      │    └────────┬────────┘  │
│            │                └──────────┬──────────┘             │           │
│            │                           │                        │           │
│            └───────────────────────────┼────────────────────────┘           │
│                                        │                                    │
│                                        ▼                                    │
│                            ┌─────────────────────┐                          │
│                            │   Sui Blockchain    │                          │
│                            │  • FuelEvent stream │                          │
│                            │  • NetworkNode RPC  │                          │
│                            │  • MatchEscrow      │                          │
│                            └─────────────────────┘                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why this split?**

| Component | Platform | Reason |
|-----------|----------|--------|
| Frontend + BFF Routes | Vercel | Serverless, auto-scaling, edge CDN |
| Runtime Workers | Railway/Fly.io | Long-running processes, persistent connections to chain |
| Node Indexer | Railway/Fly.io | Dedicated chain indexing, separate scaling |
| Database | Supabase | Managed Postgres, built-in Realtime pub/sub |

**Critical**: Vercel is serverless — it cannot run persistent event listeners or polling loops. The `chainSyncEngine` (which listens to Sui events) and `nodeRuntime` (which polls every 5s) **must** run on a container platform like Railway.

### On-Chain Trust Model

```
Player refuels station       On-chain event fires        System auto-settles
      │                            │                            │
      ▼                            ▼                            ▼
┌──────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ world::fuel  │ ───▶ │ FuelEvent       │ ───▶ │ Payout TX       │
│ deposit_fuel │      │ (DEPOSITED)     │      │ (auto-split)    │
│              │      │ → chainSyncEngine│      │ → 60/30/10 dist │
└──────────────┘      └─────────────────┘      └─────────────────┘
        ▲                     ▲                        ▲
        │                     │                        │
   Player action         Sole scoring source      Zero manual work
```

### Data Flow: Scoring Pipeline

```
1. Player deposits fuel into NetworkNode (in-game action)
                    │
                    ▼
2. Sui emits FuelEvent(DEPOSITED) with tx_digest, sender, assembly_id, fuel_amount
                    │
                    ▼
3. chainSyncEngine receives event, performs triple-filter:
   ├─ Is sender in match whitelist?
   ├─ Is target node in match scope (system or specific nodes)?
   └─ Is timestamp within match window [startedAt, endedAt]?
                    │
                    ▼
4. If valid, calculate score:
   score = fuelAdded × urgencyWeight(1-3x) × panicMultiplier(1-1.5x) × fuelGradeBonus(1-1.5x)
   Max possible: 6.75x
                    │
                    ▼
5. Update match_scores table, broadcast via match_stream_events
                    │
                    ▼
6. Frontend receives SSE/Realtime update, renders live leaderboard
```

**Key Principles:**
- ✅ **Chain as truth**: Only on-chain `FuelEvent(DEPOSITED)` events count for scoring
- ✅ **Off-chain for UX**: Database projections power fast queries, leaderboards, history
- ✅ **Idempotent writes**: All mutations use idempotency keys to prevent double-counting
- ✅ **Auto-settlement**: Match ends → scores frozen → on-chain payout → no manual claims

---

## What Makes It Fun

| Mechanic | Effect |
|----------|--------|
| **Urgency Weight** | Near-empty stations = 3x points |
| **Panic Mode** | Last 90 seconds = 1.5x global multiplier |
| **Fuel Grade** | Premium/Refined = up to 1.5x bonus |
| **Live Leaderboard** | Every deposit instantly updates rankings |
| **Auto Settlement** | Match ends, rewards arrive in seconds |

**Max theoretical multiplier: 6.75x** = 3.0 × 1.5 × 1.5

---

## Current Scope & Limitations

### ✅ This Version: NetworkNode Refueling Races

Built on EVE Frontier's `world::fuel` module `FuelEvent(DEPOSITED)` events:
- Listen to players refueling **NetworkNodes** (stargates/SSUs/turrets)
- Triple attribution via `assembly_id` + `sender` + `timestamp`
- Support for multiple fuel grades (Standard / Premium / Refined)

### ⚠️ Current On-Chain Data Limitations

EVE Frontier has another major fuel consumption scenario: **player ships**.

> The game has many fuel types (similar to #92 / #95 gasoline in real life), and active players mainly consume fuel on their ships.

**However**: The current EVE Frontier on-chain data structure lacks complete attribution data for ship refueling events. We cannot:
- Accurately identify "who refueled whose ship"
- Distinguish ship refueling vs. station refueling

**Therefore, this version focuses on NetworkNode refueling races. Ship refueling races can be added once on-chain data becomes available.**

---

## Product-Market Fit

### Pain Point → Fun Point Transformation

| Before | After |
|--------|-------|
| Supply runs are a chore | Supply runs are an arena |
| Nobody sees your contribution | Real-time leaderboard showcase |
| Rewards are vague | On-chain auto-settlement |
| Working alone | Team coordination |

### Target Users

| Segment | Value Proposition |
|---------|-------------------|
| **Casual Players** | 10-min fast pace, clear goals, instant rewards |
| **Guilds/Corps** | Turn logistics training into competitive events |
| **Sponsors/DAOs** | Host branded tournaments, distribute prizes |
| **Station Owners** | Incentivize players to prioritize your stations |

### Business Model

```
Prize Pool = Sponsorship + Entry Fees
                │
                ▼
         Platform takes 5%
                │
                ▼
         Winners split 95%
        (3+ teams: 60/30/10)
```

---

## Go-to-Market

### Phase 1: EVE Frontier Community Validation ✅ (Current)
- Devnet deployment complete
- Demo replay mode available
- Core loop working: Discover → Team Up → Race → Settle

### Phase 2: Gameplay Expansion
- Fuel Grade Challenge Mode ✅ Implemented
- Solo Challenge Mode ✅ Implemented
- Guild Leaderboards

### Phase 3: Data Expansion (Depends on chain data availability)
- Ship refueling races (pending EVE Frontier ship refueling attribution data)
- Cross-system logistics races
- More fuel type support

---

## Quick Start

```bash
# Install
pnpm install

# Configure
cp .env.example .env
# Edit .env with Sui/Supabase credentials

# Run
pnpm dev
# Open http://localhost:3010
```

### Demo Mode

Visit the `/match` page to experience the full **Demo Replay Mode**:
- Simulated real-time score updates
- Panic Mode countdown
- Fuel grade bonus display
- Settlement report generation

**No on-chain transactions required — perfect for live demos.**

---

## Deployment

Production deployment for this repo is **not** just static frontend hosting.

Recommended topology:

- 1 `web` service for Next.js frontend + App Router BFF
- 1 `runtime-workers` service for long-running loops
- 1 `node-indexer` service for chain/node indexing
- 1 hosted Supabase project for Postgres + Realtime

Deployment assets in this repo:

- Root web container: [`Dockerfile`](/Users/Murphywuwu/Documents/star-fuel-panic/Dockerfile)
- Worker container: [`workers/Dockerfile`](/Users/Murphywuwu/Documents/star-fuel-panic/workers/Dockerfile)
- Dynamic web start script: [`scripts/start-web.mjs`](/Users/Murphywuwu/Documents/star-fuel-panic/scripts/start-web.mjs)
- Staging env template: [`.env.staging.example`](/Users/Murphywuwu/Documents/star-fuel-panic/.env.staging.example)
- Production env template: [`.env.production.example`](/Users/Murphywuwu/Documents/star-fuel-panic/.env.production.example)
- CI workflow: [`.github/workflows/ci.yml`](/Users/Murphywuwu/Documents/star-fuel-panic/.github/workflows/ci.yml)
- Staging deploy workflow: [`.github/workflows/deploy-staging.yml`](/Users/Murphywuwu/Documents/star-fuel-panic/.github/workflows/deploy-staging.yml)
- Production deploy workflow: [`.github/workflows/deploy-production.yml`](/Users/Murphywuwu/Documents/star-fuel-panic/.github/workflows/deploy-production.yml)
- Checklist: [`docs/deployment-checklist.md`](/Users/Murphywuwu/Documents/star-fuel-panic/docs/deployment-checklist.md)
- Runbook: [`docs/deployment-runbook.md`](/Users/Murphywuwu/Documents/star-fuel-panic/docs/deployment-runbook.md)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind |
| State | Zustand |
| Blockchain | Sui Move, Sui dApp Kit |
| Backend | Next.js Route Handlers + Domain Runtimes |
| Database | Supabase (PostgreSQL + Realtime) |
| 3D | Three.js, React Three Fiber |

---

## Why This Wins

1. **Real Problem** — Logistics in blockchain games is universally boring. We make it fun.
2. **Working Product** — Complete loop: Discover → Race → Settle
3. **On-Chain Trust** — Scoring and payouts are fully on-chain, transparent and verifiable
4. **Honest Boundaries** — We clearly state what we can and cannot do. No overpromising.

---

**Built for EVE Frontier Hackathon 2026**

*Making supply runs fun again.*
