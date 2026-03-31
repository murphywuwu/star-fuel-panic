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
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│           Next.js 15 + React 19 + Zustand + Tailwind         │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP / SSE
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      BFF / RUNTIME LAYER                     │
│  matchRuntime │ chainSyncEngine │ settlementRuntime          │
│  nodeRuntime  │ solarSystemRuntime │ fuelConfigRuntime       │
└──────────┬──────────────────────────────────┬───────────────┘
           │                                  │
           ▼                                  ▼
┌────────────────────────┐     ┌──────────────────────────────┐
│   Supabase/PostgreSQL  │     │       Sui Blockchain          │
│   - matches            │     │  - FuelEvent(DEPOSITED) ← sole scoring source
│   - teams              │     │  - NetworkNode (station fuel) │
│   - scores             │     │  - MatchEscrow (prize pool)   │
└────────────────────────┘     └──────────────────────────────┘
```

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

**Key Points:**
- ✅ Scoring source: Only on-chain `FuelEvent(DEPOSITED)` events
- ✅ Prize pool: Managed by `MatchEscrow` smart contract
- ✅ Settlement: Automated on-chain execution, no manual claims

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
