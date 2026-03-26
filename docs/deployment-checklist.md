# Fuel Frog Panic Deployment Checklist

Last Updated: 2026-03-21
Related Docs: `docs/PRD.md`, `docs/SPEC.md`, `docs/architecture.md`, `docs/TODO.md`

## 1. Frontend Env (Vercel)

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUI_NETWORK`
- `NEXT_PUBLIC_SUI_RPC_URL`
- `NEXT_PUBLIC_LUX_COIN_TYPE`
- `NEXT_PUBLIC_LUX_DECIMALS`
- `NEXT_PUBLIC_ENTRY_PAYMENT_RECIPIENT`
- `SUI_RPC_URL`

Notes:

- 当前前端余额查询与入场费交易都走 `NEXT_PUBLIC_LUX_COIN_TYPE` 配置；发布前必须确认该值与目标网络上的真实 LUX coin type 一致。

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
4. `scripts/sql/20260321_f006_audit_logs_indexes.sql`

Recommended command:

```bash
supabase db push
```

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
