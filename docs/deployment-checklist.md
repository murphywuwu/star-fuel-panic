# Fuel Frog Panic Deployment Checklist

Last Updated: 2026-04-01  
Related Docs: `docs/PRD.md`, `docs/SPEC.md`, `docs/architecture.md`, `docs/TODO.md`, `docs/test-plan.md`

## 1. Recommended Topology

Deploy four components:

1. `web`
   Next.js frontend + App Router BFF (`src/app/**`, `src/app/api/**`)
2. `runtime-workers`
   Long-running worker container using `workers/runtimeSupervisor.ts`
3. `node-indexer`
   Long-running worker container using `workers/nodeIndexer.ts`
4. `supabase`
   Hosted Postgres + Realtime + migrations + optional Edge Functions

Do not treat this repo as pure serverless. The current production baseline requires persistent workers.

## 2. One-time Platform Setup

### Railway

Create three services per environment:

- `web`
- `runtime-workers`
- `node-indexer`

Recommended Railway configuration:

- `web`
  - Builder: Dockerfile from repo root (`/Dockerfile`)
  - Start command: default Docker CMD
- `runtime-workers`
  - Builder: `workers/Dockerfile`
  - Env var: `WORKER_ENTRY=workers/runtimeSupervisor.ts`
- `node-indexer`
  - Builder: `workers/Dockerfile`
  - Env var: `WORKER_ENTRY=workers/nodeIndexer.ts`

Create one deploy hook per Railway service and environment:

- `RAILWAY_WEB_DEPLOY_HOOK_URL_STAGING`
- `RAILWAY_RUNTIME_WORKERS_DEPLOY_HOOK_URL_STAGING`
- `RAILWAY_NODE_INDEXER_DEPLOY_HOOK_URL_STAGING`
- `RAILWAY_WEB_DEPLOY_HOOK_URL_PRODUCTION`
- `RAILWAY_RUNTIME_WORKERS_DEPLOY_HOOK_URL_PRODUCTION`
- `RAILWAY_NODE_INDEXER_DEPLOY_HOOK_URL_PRODUCTION`

### Supabase

Create two hosted projects:

- `staging`
- `production`

For GitHub Actions, prepare:

- `SUPABASE_ACCESS_TOKEN_STAGING`
- `SUPABASE_PROJECT_ID_STAGING`
- `SUPABASE_DB_URL_STAGING`
- `SUPABASE_ACCESS_TOKEN_PRODUCTION`
- `SUPABASE_PROJECT_ID_PRODUCTION`
- `SUPABASE_DB_URL_PRODUCTION`

## 3. Environment Variable Matrix

Use these templates as the starting point:

- `.env.staging.example`
- `.env.production.example`

### 3.1 Web

Public runtime vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUI_NETWORK`
- `NEXT_PUBLIC_SUI_RPC_URL`
- `NEXT_PUBLIC_LUX_COIN_TYPE`
- `NEXT_PUBLIC_LUX_DECIMALS`
- `NEXT_PUBLIC_PAYMENT_TOKEN_LABEL`
- `NEXT_PUBLIC_PAYMENT_TOKEN_SYMBOL`
- `NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID`

Server-side vars:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUI_RPC_URL`
- `FUEL_FROG_CHAIN_MODE`
- `EVE_FRONTIER_FUEL_CONFIG_ID`
- `CHAIN_GATEWAY_URL`
- `CHAIN_GATEWAY_API_KEY`
- `PAYMENT_TX_VERIFIER_URL`
- `SETTLEMENT_CHAIN_SUBMITTER_URL`
- `EVE_FRONTIER_WORLD_API_BASE_URL`
- `RUNTIME_PROJECTION_STORE_PATH=/tmp/runtime-projections.json`

Recommended optional vars:

- `ENABLE_LOCAL_MATCH_SIMULATION=`
- `SETTLEMENT_PLATFORM_FEE_BPS=1000`
- `DEFAULT_MAX_TEAMS=10`
- `FORCE_START_SEC=180`

### 3.2 Runtime Workers

Required:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUI_RPC_URL`
- `NEXT_PUBLIC_LUX_COIN_TYPE`
- `NEXT_PUBLIC_LUX_DECIMALS`
- `FUEL_FROG_CHAIN_MODE`
- `EVE_FRONTIER_FUEL_CONFIG_ID`
- `EVE_FRONTIER_WORLD_API_BASE_URL`
- `RUNTIME_PROJECTION_STORE_PATH=/tmp/runtime-projections.json`

Runtime loop tuning:

- `NODE_RUNTIME_INTERVAL_MS`
- `MATCH_RUNTIME_INTERVAL_MS`
- `CHAIN_SYNC_ENGINE_INTERVAL_MS`
- `RUNTIME_SUPERVISOR_RESTART_DELAY_MS`

### 3.3 Node Indexer

Required:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUI_RPC_URL`
- `EVE_FRONTIER_WORLD_API_BASE_URL`
- `NODE_INDEX_STORE_PATH=/tmp/node-index.json`

Indexer tuning:

- `NODE_INDEXER_INTERVAL_MS`
- `NODE_INDEXER_MAX_EVENT_PAGES`

### 3.4 Supabase Edge Functions

If you still deploy `supabase/functions`, set at least:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

And only add integration secrets actually used by those functions:

- `CHAIN_GATEWAY_URL`
- `CHAIN_GATEWAY_API_KEY`
- `PAYMENT_TX_VERIFIER_URL`
- `SETTLEMENT_CHAIN_SUBMITTER_URL`

## 4. Database and Function Rollout

Apply remote schema:

```bash
supabase db push --db-url "$SUPABASE_DB_URL"
```

Deploy Edge Functions:

```bash
supabase functions deploy create-team --project-ref "$SUPABASE_PROJECT_ID"
supabase functions deploy get-settlement-bill --project-ref "$SUPABASE_PROJECT_ID"
supabase functions deploy join-team --project-ref "$SUPABASE_PROJECT_ID"
supabase functions deploy lock-team --project-ref "$SUPABASE_PROJECT_ID"
supabase functions deploy match-tick --project-ref "$SUPABASE_PROJECT_ID"
supabase functions deploy node-scanner --project-ref "$SUPABASE_PROJECT_ID"
supabase functions deploy pay-entry --project-ref "$SUPABASE_PROJECT_ID"
supabase functions deploy trigger-settlement --project-ref "$SUPABASE_PROJECT_ID"
```

## 5. GitHub Actions Secrets

Staging:

- `SUPABASE_ACCESS_TOKEN_STAGING`
- `SUPABASE_PROJECT_ID_STAGING`
- `SUPABASE_DB_URL_STAGING`
- `RAILWAY_WEB_DEPLOY_HOOK_URL_STAGING`
- `RAILWAY_RUNTIME_WORKERS_DEPLOY_HOOK_URL_STAGING`
- `RAILWAY_NODE_INDEXER_DEPLOY_HOOK_URL_STAGING`

Production:

- `SUPABASE_ACCESS_TOKEN_PRODUCTION`
- `SUPABASE_PROJECT_ID_PRODUCTION`
- `SUPABASE_DB_URL_PRODUCTION`
- `RAILWAY_WEB_DEPLOY_HOOK_URL_PRODUCTION`
- `RAILWAY_RUNTIME_WORKERS_DEPLOY_HOOK_URL_PRODUCTION`
- `RAILWAY_NODE_INDEXER_DEPLOY_HOOK_URL_PRODUCTION`

## 6. Local Preflight Helpers

Before wiring secrets into a platform, you can validate required variables locally:

```bash
pnpm deploy:check:web
pnpm deploy:check:workers
pnpm deploy:check:indexer
pnpm deploy:check:github:staging
pnpm deploy:check:github:production
```

To manually trigger Railway deploy hooks from your shell:

```bash
pnpm deploy:staging:railway
pnpm deploy:production:railway
```

## 7. Pre-release Verification

Run before any manual or automated deploy:

```bash
pnpm build
node ./scripts/check-layer-imports.mjs
node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test \
  src/server/matchRuntime.test.ts \
  src/server/criticalPath.e2e.test.ts \
  src/server/teamRuntime.solo.test.ts \
  src/server/matchRuntime.stream.test.ts \
  src/app/api/__tests__/f007-match-flow.test.ts \
  src/service/createMatchService.test.ts
```

## 8. Post-deploy Smoke Checks

1. Open `/lobby` and verify match cards load.
2. Open `/planning?matchId=<id>` and verify Team Lobby loads.
3. Hit `/api/runtime/health` and confirm worker heartbeat payload is non-empty.
4. Create one draft match and publish it.
5. Create a team, approve joins, lock, and pay.
6. Confirm Supabase receives mirrored `matches`, `teams`, `team_members`, `team_payments`.
7. Confirm worker services remain healthy after at least one loop interval.
