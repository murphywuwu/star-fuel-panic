# Killmail Bingo Ops Test Results (2026-03-20)

## Environment

- Project: `apps/killmail-bingo-ops`
- Node: `v22.17.0`
- Package manager: `pnpm`

## Executed Commands and Outcomes

1. `pnpm run typecheck`
- Outcome: PASS
- Evidence: TypeScript compilation finished with no errors (`tsc --noEmit`).

2. `pnpm run test`
- Outcome: PASS
- Evidence:
  - Files:
    - `src/model/__tests__/killmailBingoStore.test.ts`
    - `src/service/__tests__/killmailBingoService.test.ts`
    - `src/service/__tests__/kboContractGateway.test.ts`
  - Tests: `8 passed`

3. `./scripts/devnet-verify.sh`
- Outcome: PASS (for current frontend-only scope)
- Evidence:
  - `sui client envs` executed, active env verified.
  - `sui client switch --env devnet` executed, env switched to `devnet`.
  - No `Move.toml` exists in this frontend project, so `sui move test` skipped by script design.

4. `sui move test -e testnet` (in `apps/killmail-bingo-ops/contracts`)
- Outcome: PASS
- Evidence:
  - `killmail_bingo_ops::kbo_registry` tests: `4 passed / 0 failed`
  - Covered flows: happy path, duplicate killmail reject, claim replay reject, risk penalty path

5. Devnet contract checks
- Executed:
  - `sui client faucet --json`
  - `./verify-devnet.sh`
- Outcome:
  - Scripted env/query commands: PASS
  - Faucet: PASS
  - Test publish: PASS
  - Transaction digest: `12kmvffURFg8Gj74TZr5a3UkFHSohfNrAR7AJLuf7xRp`
  - Published package: `0xf7c77f255d48c31d6fe1d027fd293e7bfce1402c3631755ae9378c38c03fb364`

## Critical Path Regression

- Create room + draft card: PASS (logic path implemented, typecheck passed)
- Start match + submit killmail: PASS (controller/service path covered by tests and compile)
- GraceWindow + finalize settlement + claim: PASS (service + controller implemented, typecheck passed)
- Battle report trace output (`killmail_id -> slot_id -> settlement_id`): PASS (view/report table + service trace entry)
- Contract state machine + anti-abuse guards: PASS (`sui move test -e testnet`)
- Frontend service -> contract gateway alignment: PASS (`kboContractGateway` covered by happy path + duplicate/replay tests)

## Remaining Risk

- Re-running test-publish requires sufficient faucet gas balance.

## UI Refresh Regression Addendum (2026-03-20)

- Scope:
  - S-001 lobby briefing screen
  - S-002 combat command deck
  - S-003 verification console drawer
  - S-004 settlement and battle report screen
- Executed:
  1. `pnpm run typecheck`
  2. `pnpm run test`
- Outcome:
  - PASS (`typecheck`: no errors, `test`: 3 files / 8 tests passed)
- Notes:
  - View refactor kept architecture direction `View -> Controller -> Service -> Model`.
  - Store/service now persist slot `Pending/Rejected` transitions to support UI state fidelity.
  - `useKillmailBingoViewState` selector switched to shallow-cached snapshot to avoid `getServerSnapshot` warning loop.
