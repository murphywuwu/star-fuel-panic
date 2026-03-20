# Test Plan: Fuel Frog Panic (Contract)

## 1. Document Control

- Project/App: `apps/fuel-frog-panic`
- Related PRD: `docs/prd/fuel-frog-panic/prd.md`
- Related SPEC: `apps/fuel-frog-panic/spec.md`
- Related TODO: `apps/fuel-frog-panic/todo.md`
- Version: v1.1
- Status: Blocked
- Owner (Testing Agent): Codex
- Last Updated: 2026-03-20

## 2. Scope

- Features in scope:
  - F-002 core contract game loop validation (join/lock/start/supply/finalize)
  - F-012 settlement formula and idempotent settlement behavior
  - F-014 anti-abuse checks (duplicate supply event / invalid team id)
  - F-013 contract CLI/devnet verification flow
- Out of scope:
  - Real devnet package success publish (requires funded gas coin)
  - Frontend UI behavior tests
- Test environment assumptions:
  - Sui CLI available (`sui 1.68.0-16bf4d124ac5`)
  - Active wallet currently has no sufficient gas coin for publish

## 3. Traceability

| Test ID | Linked Feature (PRD) | Linked Interface (SPEC) | Linked TODO ID | Priority |
|---|---|---|---|---|
| TC-001 | F-002 | Contract: create/join/lock/start/supply/finalize | T-022 | P0 |
| TC-002 | F-014 | Contract: duplicate event guard | T-022 | P0 |
| TC-003 | F-002 | Contract: room capacity boundary | T-022 | P1 |
| TC-004 | F-014 | Contract: invalid team id rejection | T-022 | P0 |
| TC-005 | F-012 | Contract: settlement formula | T-020 | P0 |
| TC-006 | F-012 | Contract: settlement idempotency | T-020 | P0 |
| TC-007 | F-013 | Contract ops: devnet command chain | T-024 | P0 |

## 4. Test Strategy

### Functional

- Main flow validation:
  - Use `test_scenario` to cover room create -> 3 players join -> lock/start -> supply events -> finalize -> idempotent finalize.
- Error flow validation:
  - `#[expected_failure]` for duplicate event, room full, invalid team id.
- Edge/boundary validation:
  - Node fill clamps at 10000 and completion flag set.
  - Settlement integer division path verified via formula tests.

### Architecture Compliance

- Contract scope only; frontend layer constraints not applicable in this run.

### Contract Validation (Required)

- Must follow `docs/sui-devnet-testing-standard.md`.
- Local Move unit tests:
```bash
cd apps/fuel-frog-panic/contracts
sui move test -e testnet
```
- Devnet integration checks:
```bash
cd apps/fuel-frog-panic
bash ./scripts/devnet-verify.sh
```

## 5. Test Cases

### TC-001 Main Flow: Scenario Settlement Trace

- Preconditions:
  - Contract package compiled.
- Steps:
1. Host creates room with fee/rake config.
2. 3 players join; host locks roles and starts match.
3. Two supply events submitted on same node.
4. Host finalizes settlement twice.
- Expected Result:
  - Phase reaches Settled.
  - Settlement id remains unchanged on second finalize.
  - Gross/platform/host/payout fields match formula.
- Actual Result:
  - Pass (assertions all satisfied).
- Status: Pass
- Evidence:
  - Move test `test_room_happy_path_with_settlement_and_contribution_trace`.

### TC-002 Error Flow: Duplicate Supply Event

- Steps:
1. Start match.
2. Submit same `event_key` twice.
- Expected Result:
  - Second submit aborts (duplicate guard).
- Actual Result:
  - Pass (`#[expected_failure]` triggered).
- Status: Pass
- Evidence:
  - Move test `test_duplicate_supply_event_rejected`.

### TC-003 Edge: Room Full Capacity

- Steps:
1. Create room with `player_limit = 3`.
2. Join 4th player.
- Expected Result:
  - 4th join aborts.
- Actual Result:
  - Pass (`#[expected_failure]` triggered).
- Status: Pass
- Evidence:
  - Move test `test_room_full_rejected`.

### TC-004 Error Flow: Invalid Team ID

- Steps:
1. Start match.
2. Submit supply event with `team_id = 9`.
- Expected Result:
  - Abort with invalid team path.
- Actual Result:
  - Pass (`#[expected_failure]` triggered).
- Status: Pass
- Evidence:
  - Move test `test_invalid_team_id_rejected`.

### TC-005 Formula Validation

- Steps:
1. Run settlement formula unit test.
- Expected Result:
  - Output values align with gross -> platform -> host -> payout.
- Actual Result:
  - Pass.
- Status: Pass
- Evidence:
  - Move test `test_settlement_formula`.

### TC-006 Idempotency Validation

- Steps:
1. Apply settlement snapshot twice.
- Expected Result:
  - Second write rejected, first settlement values preserved.
- Actual Result:
  - Pass.
- Status: Pass
- Evidence:
  - Move test `test_settlement_idempotent_helper`.

### TC-007 Devnet Integration Command Chain

- Steps:
1. `sui client envs`
2. `sui client switch --env devnet`
3. `sui move test -e testnet`
4. `sui client test-publish --gas-budget 100000000 -e testnet`
- Expected Result:
  - Command chain executes; publish step succeeds with package id.
- Actual Result:
  - Command chain executed, publish blocked due insufficient gas coin.
- Status: Blocked
- Evidence:
  - CLI output: `Cannot find gas coin ... sufficient for the required gas budget`.

## 6. Defect Management

- Defects found in this round:
  - None in contract logic path.
- Non-code blocker:
  - Devnet publish blocked by wallet gas availability.
- TODO updates:
  - Added `T-022` / `T-023` as Done.
  - Added `T-024` as Blocked.

## 7. Exit Criteria

- P0 contract test cases: Passed (except external devnet funding blocker).
- Linked TODO bugfix items: N/A (no logic defect found).
- Critical-path blockers:
  - `T-024` (wallet gas coin not enough for publish).
- Final verification summary:
  - Local contract suite passed: 8/8.
  - Devnet integration command chain executed but publish remains blocked by external funding prerequisite.
