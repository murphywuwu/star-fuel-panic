# Fuel Frog Panic Deployment Checklist

Last Updated: 2026-03-28
Related Docs: `docs/PRD.md`, `docs/SPEC.md`, `docs/architecture.md`, `docs/TODO.md`

## 1. Frontend Env (Vercel)

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUI_NETWORK`
- `NEXT_PUBLIC_SUI_RPC_URL`
- `NEXT_PUBLIC_LUX_COIN_TYPE`
- `NEXT_PUBLIC_LUX_DECIMALS`
- `NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID`
- `SUI_RPC_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FUEL_FROG_CHAIN_MODE`

Notes:

- 当前前端余额查询与入场费交易都走 `NEXT_PUBLIC_LUX_COIN_TYPE` 配置；发布前必须确认该值与目标网络上的真实 LUX coin type 一致。
- 创建比赛的 sponsorship payment 与 `pay-team` 现在都走 `fuel_frog_panic` escrow 合约入口；必须配置 `NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID` 指向已发布包地址。
- `NEXT_PUBLIC_MATCH_SPONSORSHIP_RECIPIENT` 与 `NEXT_PUBLIC_ENTRY_PAYMENT_RECIPIENT` 对当前 escrow 主路径都不再是必需项；它们只在旧的地址收款兼容路径下有意义。
- 本地/测试链若希望真正校验 `publishTxDigest`，`FUEL_FROG_CHAIN_MODE` 不应保持 `mock`。

Optional variables:

- `CHAIN_GATEWAY_URL`
- `CHAIN_GATEWAY_API_KEY`
- `PAYMENT_TX_VERIFIER_URL`
- `SETTLEMENT_CHAIN_SUBMITTER_URL`

## 2. Supabase DB Migration

Run in order:

1. `supabase/migrations/20260321_f001_missions.sql`
2. `supabase/migrations/202603210002_f002_lobby_match_tables.sql`
3. `supabase/migrations/202603210001_f005_settlements.sql`
4. `supabase/migrations/202603280002_f007_match_runtime_backend.sql`
5. `supabase/migrations/202603280003_f007_reconcile_base_foreign_keys.sql`
6. `scripts/sql/20260321_f006_audit_logs_indexes.sql`

Recommended command:

```bash
supabase db push
```

Notes:

- 由于早期迁移文件名与依赖顺序不一致，当前仓库通过 `202603280003_f007_reconcile_base_foreign_keys.sql` 在所有基础表创建后统一补 `matches -> missions` 与 `settlements -> matches` 外键；全新本地 `supabase start` 已验证可正常初始化。

## 3. Deploy Edge Functions

Deploy required functions:

- `node-scanner`
- `create-team`
- `join-team`
- `lock-team`
- `pay-entry`
- `match-tick`
- `trigger-settlement`
- `get-settlement-bill`

Example:

```bash
supabase functions deploy create-team
supabase functions deploy join-team
supabase functions deploy lock-team
supabase functions deploy pay-entry
supabase functions deploy match-tick
supabase functions deploy node-scanner
supabase functions deploy trigger-settlement
supabase functions deploy get-settlement-bill
```

## 4. Configure Edge Secrets

Use either `supabase secrets set ...` manually or run:

```bash
source .env.local
bash scripts/supabase/set-edge-secrets.sh
```

Must-have secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Notes:

- Next.js 后端路由现在也会使用 `SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY` 将比赛/战队主数据镜像到后端表，并在冷启动时从表 hydrate 本地 runtime projection。
- 若未配置这两个变量，代码会继续退回本地 `runtime-projections.json` 缓存模式，无法满足跨进程/跨实例恢复比赛状态的要求。

Optional integration secrets:

- `CHAIN_GATEWAY_URL`
- `CHAIN_GATEWAY_API_KEY`
- `PAYMENT_TX_VERIFIER_URL`
- `SETTLEMENT_CHAIN_SUBMITTER_URL`

## 5. Pre-Release Checks

Run before release:

```bash
pnpm typecheck
pnpm lint:imports
pnpm qa:all
sui move test
bash scripts/devnet-verify.sh
```

## 6. Runtime Smoke

1. Open heatmap and verify mission card + node detail + lobby rule summaries一致。
2. Complete one flow: `create-team -> join-team -> lock-team -> pay-entry`.
3. Confirm `match_whitelist` contains all member addresses.
4. Confirm `match-tick` can advance `lobby -> pre_start -> running -> panic -> settling -> settled`.
5. Confirm settlement bill includes `sponsorshipFee`, `entryFeeTotal`, `platformSubsidy`, `platformFee`, `payoutPool`, and `payoutTxDigest`.
