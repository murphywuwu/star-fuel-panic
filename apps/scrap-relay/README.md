# Scrap Relay

Next.js + TypeScript + Tailwind + Zustand project bootstrap for Scrap Relay.

## Run

```bash
cd apps/scrap-relay
npm install
npm run dev
npm run typecheck
npm run test
```

## Architecture

- `src/view`: View layer (UI only, imports Controller only)
- `src/controller`: Controller layer (orchestration)
- `src/service`: Service layer (business rules + side-effects)
- `src/model`: Model layer (Zustand state)

Dependency direction:

`View -> Controller -> Service -> Model`
