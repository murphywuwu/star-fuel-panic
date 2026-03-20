# Killmail Bingo Ops

Next.js + TypeScript + Tailwind + Zustand initialization for the `Killmail Bingo Ops` mini-game.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand

## Architecture

This project follows the mandatory layered architecture:

- `src/view` -> UI only
- `src/controller` -> interaction orchestration
- `src/service` -> business logic and side effects
- `src/model` -> Zustand runtime state

Dependency direction is one-way only:

`View -> Controller -> Service -> Model`

## Run

```bash
cd apps/killmail-bingo-ops
npm install
npm run dev
```

## Verification

```bash
pnpm run typecheck
pnpm run test
./scripts/devnet-verify.sh
```

- Latest execution log: `test-results/2026-03-20-regression.md`
- Contract package: `contracts/` (see `contracts/README.md`)
