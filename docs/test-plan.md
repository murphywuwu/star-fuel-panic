# Fuel Frog Panic Test Plan

## 1. Document Control

- Project/App: Fuel Frog Panic
- Related PRD: `docs/PRD.md`
- Related SPEC: `docs/SPEC.md`
- Related TODO: `docs/TODO.md`
- Version: v1.0
- Status: Passed
- Owner (Testing Agent): Codex
- Last Updated: 2026-03-21

## 2. Scope

- Features in scope:
  - F-002 backend lobby/pay pipeline (`create-team/join-team/lock-team/pay-entry`)
  - F-004 match state machine driver (`match-tick` + panic broadcast trigger)
  - F-005 payout rule verification (team and member split)
  - Cross-feature: import layer lint, env/deployment readiness, settlement traceability
- Out of scope:
  - UI pixel-level visual QA
  - Production mainnet validation
- Test environment assumptions:
  - Local Node.js and Sui CLI available
  - Supabase runtime not fully bootstrapped locally (static + logic checks used)

## 3. Traceability

| Test ID | Linked Feature (PRD) | Linked Interface (SPEC) | Linked TODO ID | Priority |
|---|---|---|---|---|
| TC-001 | F-002 | `pay-entry` white-list contract | T-0043 | P0 |
| TC-002 | F-004 | Match state transitions + panic threshold | T-0070, T-0071 | P0 |
| TC-003 | F-005 | Team payout ratios | T-0082 | P0 |
| TC-004 | F-005 | Member payout by contribution + zero-score | T-0083 | P0 |
| TC-005 | Cross-feature | Layer import constraints | T-0089, T-0090 | P1 |
| TC-006 | Cross-feature | Lobby->Lock->Pay->Running->Settled regression chain | T-0094 | P0 |
| TC-007 | Contract | `sui move test` | T-0095 | P0 |
| TC-008 | Contract | devnet publish/call/query-events | T-0096 | P0 |
| TC-009 | UI consistency | Match card/detail/lobby team rule consistency | T-0097 | P1 |
| TC-010 | Settlement traceability | Bill -> chain tx fields | T-0098 | P1 |

## 4. Test Strategy

### Functional

- Main flow validation:
  - Scripted checks over edge function code-paths and transitions.
- Error flow validation:
  - Validate missing/illegal transitions and whitelist logic gates exist.
- Edge/boundary validation:
  - Panic threshold at exactly 90s.
  - ≥4 team payout fallback to top-3 split.

### Architecture Compliance

- Validate import direction via `scripts/check-layer-imports.mjs`.

### Contract Validation

- Use CLI-first commands per `docs/sui-devnet-testing-standard.md`.

## 5. Test Cases

### TC-001 White-list Registration Completeness

- Preconditions:
  - `supabase/functions/pay-entry/index.ts` present.
- Steps:
1. Run `node scripts/qa/check-whitelist-after-pay.mjs`.
- Expected Result:
  - pay-entry contains team member query, whitelist upsert, and paid state update.

### TC-002 Match State Transition + Panic Threshold

- Steps:
1. Run `node scripts/qa/check-match-state-machine.mjs`.
- Expected Result:
  - legal path `lobby->pre_start->running->panic->settling->settled` valid.
  - panic triggers when remaining time <= 90 seconds.

### TC-003/TC-004 Settlement Split Rules

- Steps:
1. Run `node scripts/qa/check-settlement-rules.mjs`.
- Expected Result:
  - ratios for 1/2/3/4+ teams satisfy PRD.
  - zero-score member payout equals 0.

### TC-005 Layer Constraints

- Steps:
1. Run `node scripts/check-layer-imports.mjs`.
- Expected Result:
  - no forbidden import directions.

### TC-006 Integration Chain Presence

- Steps:
1. Run `node scripts/qa/check-integration-lobby-lock-pay-running-settled.mjs`.
- Expected Result:
  - create/lock/pay/status transitions and match-tick chain are present.

### TC-007/TC-008 Sui CLI Validation

- Steps:
1. Run `sui move test`.
2. Run `bash scripts/devnet-verify.sh`.
- Expected Result:
  - local tests pass.
  - devnet publish/call/query-events commands execute and output recorded.

### TC-009 UI Team Rule Consistency

- Steps:
1. Run `node scripts/qa/check-ui-team-rules-consistency.mjs`.
- Expected Result:
  - card/detail/lobby use shared team-rule summary fields.

### TC-010 Settlement Bill Traceability

- Steps:
1. Run `node scripts/qa/check-settlement-chain-trace.mjs`.
- Expected Result:
  - settlement bill keeps `settlementTx` and hash fields.

## 6. Defect Management

When defect is found:

1. Add bugfix item into `docs/TODO.md`.
2. Capture repro and expected/actual.
3. Implement fix.
4. Re-run targeted checks and critical regression.

## 7. Exit Criteria

- All P0 checks pass or are explicitly blocked with reasons.
- Contract commands executed and logged.
- TODO statuses synchronized.

## 8. Execution Results (2026-03-21)

- `pnpm typecheck`：Passed
- `pnpm lint:imports`：Passed
- `pnpm qa:all`：Passed（TC-001/002/003/004/006/009/010）
- `sui move test -e testnet`：Passed（9/9 tests）
- `bash scripts/devnet-verify.sh`：Passed（完成 devnet test-publish + create_room call + suix_queryEvents，见 `docs/devnet-verification-latest.md`）
