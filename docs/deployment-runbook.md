# Fuel Frog Panic Deployment Runbook

Last Updated: 2026-04-01

## 1. Target Shape

Production consists of:

- 1 Railway `web` service
- 1 Railway `runtime-workers` service
- 1 Railway `node-indexer` service
- 1 hosted Supabase project

The same layout should exist in `staging`.

## 2. Branch Strategy

- `staging` branch -> staging deploy workflow
- `main` branch -> production deploy workflow

If your repo uses different branch names, update:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-production.yml`

## 3. First-time Setup

### Supabase

1. Create a hosted project.
2. Copy:
   - Project ref
   - Database connection string
   - Service role key
   - Anon key
3. Add project-specific auth redirect URLs for your final frontend domain.

### Railway

Create three services from the same repo:

1. `web`
   - Dockerfile path: `/Dockerfile`
2. `runtime-workers`
   - Dockerfile path: `/workers/Dockerfile`
   - `WORKER_ENTRY=workers/runtimeSupervisor.ts`
3. `node-indexer`
   - Dockerfile path: `/workers/Dockerfile`
   - `WORKER_ENTRY=workers/nodeIndexer.ts`

For each service, create a deploy hook.

### GitHub

Add repository secrets listed in [`docs/deployment-checklist.md`](/Users/Murphywuwu/Documents/star-fuel-panic/docs/deployment-checklist.md).

## 4. Staging Rollout

1. Merge target commit into `staging`.
2. Wait for GitHub Actions:
   - `ci`
   - `deploy-staging`
3. Check GitHub Actions logs:
   - `pnpm build`
   - layer import check
   - targeted regression
   - `supabase db push`
   - Edge Functions deploy
   - three Railway deploy hook calls
4. Verify Railway services are healthy:
   - `web` up
   - `runtime-workers` running
   - `node-indexer` running
5. Run smoke checks:
   - `/`
   - `/lobby`
   - `/planning`
   - `/planning?matchId=<known-match-id>`
   - `/api/runtime/health`
6. Create and publish a test match in staging.

## 5. Production Rollout

1. Confirm staging passed smoke.
2. Merge same commit into `main`.
3. Wait for `deploy-production`.
4. Re-run production smoke:
   - homepage
   - wallet connect
   - match create draft
   - publish
   - team create / join / lock / pay
   - settlement route fetch

## 6. Rollback

### Web / Workers

- Re-trigger the previous Railway deployment from the Railway dashboard, or re-run the deploy hook against the previous commit if your Railway setup pins source revisions.

### Supabase Schema

- Do not hot-edit production tables in Studio.
- If a migration is bad:
  - create a forward fix migration
  - apply via `supabase db push`

## 7. Operational Notes

- `runtime-projections.json` and `node-index.json` should be treated as ephemeral container cache only.
- Do not scale `runtime-workers` horizontally until match state progression and settlement locking have been hardened for multi-writer concurrency.
- Do not scale `node-indexer` horizontally unless indexer dedupe / cursor ownership is made explicit.
- Keep `web` single-instance for first release unless you verify that all request-time behavior is fully backed by Supabase and not local disk.

## 8. Manual Commands

Local release verification:

```bash
pnpm install --frozen-lockfile
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

Manual Supabase rollout:

```bash
supabase db push --db-url "$SUPABASE_DB_URL"

for fn in create-team get-settlement-bill join-team lock-team match-tick node-scanner pay-entry trigger-settlement; do
  supabase functions deploy "$fn" --project-ref "$SUPABASE_PROJECT_ID"
done
```

Manual Railway rollout via deploy hooks:

```bash
curl -fsSL -X POST "$RAILWAY_WEB_DEPLOY_HOOK_URL"
curl -fsSL -X POST "$RAILWAY_RUNTIME_WORKERS_DEPLOY_HOOK_URL"
curl -fsSL -X POST "$RAILWAY_NODE_INDEXER_DEPLOY_HOOK_URL"
```
