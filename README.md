# Fuel Frog Panic

> **Turn Boring Logistics into Thrilling Battles.**
>
> Transform EVE Frontier's mundane fuel delivery into competitive real-time matches with transparent on-chain rewards.

---

## The Problem

In EVE Frontier, critical infrastructure (stargates, SSUs, turrets) depends on fuel. But traditional fuel hauling is:

- **Low feedback** - No recognition for risky supply runs
- **Unclear priorities** - Which node needs rescue first?
- **Opaque rewards** - Who contributed how much?
- **Solo grind** - No team coordination incentive

**Result:** Essential gameplay feels like a chore. Players avoid it.

---

## Our Solution

**Fuel Frog Panic** gamifies fuel delivery into short, competitive matches:

```
Discovery -> Team Up -> Race -> Auto-Settlement
   |            |         |           |
   v            v         v           v
 Browse     Form squad   Real-time   Transparent
 matches    + pay entry  scoring     on-chain payout
```

### Core Loop (10-minute match)

1. **Discover** - Browse active matches in Lobby, see prize pools
2. **Team Up** - Create/join a squad, lock roster, pay entry fee
3. **Race** - Deliver fuel to target nodes, earn points in real-time
4. **Win** - Top teams split the prize pool automatically

### What Makes It Fun

| Feature | Impact |
|---------|--------|
| **Urgency Scoring** | Critical nodes = 3x points |
| **Panic Mode** | Last 90 seconds = 1.5x multiplier |
| **Fuel Grade Bonus** | Premium fuel = up to 1.5x bonus |
| **Live Leaderboard** | See your rank update instantly |
| **Auto Settlement** | No manual claims, instant payout |

**Max multiplier: 6.75x** (3.0 urgency x 1.5 panic x 1.5 fuel grade)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  Next.js 15 + React 19 + Zustand + Tailwind                    │
│  View -> Controller -> Service -> Model (strict layers)        │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP / SSE
                             v
┌─────────────────────────────────────────────────────────────────┐
│                      BFF / RUNTIME LAYER                        │
│  matchRuntime | teamRuntime | chainSyncEngine | settlementRuntime│
│  nodeRuntime | solarSystemRuntime | fuelConfigRuntime           │
└──────────┬─────────────────────────────────┬────────────────────┘
           │                                 │
           v                                 v
┌─────────────────────────┐    ┌─────────────────────────────────┐
│    Supabase/PostgreSQL  │    │         Sui Blockchain          │
│    - matches            │    │  - FuelEvent(DEPOSITED)         │
│    - teams              │    │  - MatchEscrow                  │
│    - scores             │    │  - Settlement payouts           │
│    - settlements        │    │  - FuelConfig (efficiency)      │
└─────────────────────────┘    └─────────────────────────────────┘
```

### Match Flow (On-Chain Trust)

```
Host publishes match          Players deposit fuel           System settles
        │                            │                            │
        v                            v                            v
┌───────────────┐           ┌────────────────┐           ┌────────────────┐
│ MatchEscrow   │           │ FuelEvent      │           │ Payout TX      │
│ (sponsorship  │──────────>│ (DEPOSITED)    │──────────>│ (auto-split)   │
│  + entry fees)│           │ -> Score calc  │           │ -> Winners get │
└───────────────┘           └────────────────┘           └────────────────┘
       ^                           ^                            ^
       │                           │                            │
   On-chain                   On-chain                     On-chain
   escrow lock               event source                  settlement
```

**Key Trust Model:**
- Scoring source: On-chain `FuelEvent` only
- Payment: All funds flow through `MatchEscrow` smart contract
- Settlement: Automated on-chain payout, no manual claims

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind |
| State | Zustand |
| Blockchain | Sui Move, Sui dApp Kit |
| Backend | Next.js Route Handlers + Domain Runtimes |
| Database | Supabase (PostgreSQL + Realtime) |
| 3D Visuals | Three.js, React Three Fiber |

---

## Product-Market Fit

### The Pain Point

EVE Frontier's economy needs active logistics. But players avoid it because:
- It's boring
- No immediate reward
- No recognition

**Fuel Frog Panic turns cost-center behavior into profit-center gameplay.**

### Target Users

| Segment | Value Proposition |
|---------|-------------------|
| **Casual Players** | Quick matches, clear objectives, instant rewards |
| **Guilds/Corps** | Coordinate logistics training as fun competition |
| **Sponsors/DAOs** | Host branded tournaments, distribute prizes |
| **Infrastructure Owners** | Incentivize fuel delivery to your nodes |

### Business Model

```
Prize Pool = Sponsorship + Entry Fees + Platform Subsidy
                    │
                    v
            Platform takes 5%
                    │
                    v
         Winners split 95%
         (60/30/10 for 3+ teams)
```

---

## Go-to-Market

### Phase 1: EVE Frontier Community (Current)
- Launch on EVE Frontier devnet
- Partner with existing guilds for pilot tournaments
- Gather feedback on match duration, scoring balance

### Phase 2: Expand Match Types
- Fuel Grade Challenge Mode (done)
- Solo Challenge Mode (done)
- Guild Leaderboards

### Phase 3: Cross-Game Potential
- Core engine is chain-agnostic (supply -> score -> settle)
- Applicable to any game with logistics/delivery mechanics

---

## Quick Start

```bash
# Install
pnpm install

# Configure
cp .env.example .env
# Edit .env with your Sui/Supabase credentials

# Run
pnpm dev
# Open http://localhost:3010
```

### Key Commands

```bash
pnpm build              # Production build
pnpm test               # Run tests
pnpm verify:contract:devnet  # Verify on-chain contracts
```

---

## Demo Highlights

The `/match` page includes a **demo replay mode** that simulates a full match cycle:
- Real-time score updates
- Panic mode countdown
- Fuel grade bonuses displayed
- Settlement report generation

Perfect for hackathon presentation without needing live chain transactions.

---

## Documentation

| Document | Purpose |
|----------|---------|
| `docs/PRD.md` | Product requirements, game rules |
| `docs/architecture.md` | System design, runtime responsibilities |
| `docs/SPEC.md` | API contracts, data types |
| `docs/test-plan.md` | Test coverage status |

---

## Why This Wins

1. **Real Problem** - Logistics in blockchain games is universally boring
2. **Working Product** - Full loop from discovery to settlement
3. **On-Chain Trust** - Scoring and payouts are verifiable
4. **Extensible** - Core engine works for any supply-chain gamification

---

**Built for EVE Frontier Hackathon 2026**

*Making supply runs fun again.*
