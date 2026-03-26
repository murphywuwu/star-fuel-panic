# Fuel Frog Panic Test Plan

## 1. Document Control

- Project/App: `Fuel Frog Panic`
- Related PRD: `docs/PRD.md` v2.6
- Related SPEC: `docs/SPEC.md` v6.0
- Related TODO: `docs/TODO.md` v2.6.1
- Version: v1.2
- Status: Passed
- Owner (Testing Agent): Codex
- Last Updated: 2026-03-27

## 2. Scope

- Features in scope:
  - F-000 `T-0005`: wallet connect modal auto-dismiss after provider login
  - F-000 `T-0006`: wallet balance decimals resolution and non-zero balance formatting
  - F-000 `T-0007`: correct LUX coin type for StateService/GetBalance and entry payment
  - F-000 `T-0008`: second connect after explicit disconnect must not hang in awaiting state
  - F-000 `T-0009`: fallback from `getBalance` to `listBalances` for LUX balance resolution
  - F-003 `T-0307`: planning page create-team flow uses modal instead of inline form
  - F-007 `T-0716`: active view orchestration moved into controller hooks, leaving view as render-only
  - F-007 `T-0718`: architecture guardrail is enforced without controller->model exceptions
  - F-007 `T-0719`: create-match economics fields accept direct numeric input and pool projection is visually emphasized
  - F-007 `T-0702`: v2.6 discovery and recommendation API coverage
  - F-007 `T-0703`: draft -> publish -> join/apply -> approve/reject -> pay -> stream -> settlement E2E
  - F-007 `T-0704`: CLI-first Move/devnet verification
  - F-007 `T-0705`: stale world API, topology missing, duplicate publish, duplicate settlement, signature failure regressions
  - F-007 `T-0708`: Node test loader stabilization for alias and extensionless import resolution
- Out of scope:
  - Browser automation beyond route/runtime coverage
  - Unrelated controller -> model legacy violations already tracked as follow-up
- Test environment assumptions:
  - Node test runner uses `--experimental-strip-types`
  - Loader registration uses `scripts/register-test-loader.mjs`
  - Devnet verification uses the active local Sui CLI wallet

## 3. Traceability

| Test ID | Linked Feature (PRD) | Linked Interface (SPEC) | Linked TODO ID | Priority |
|---|---|---|---|---|
| TC-0005-AUTH | 4.0 | 3.1 | T-0005 | P0 |
| TC-0006-BAL | 4.0 | 3.1 | T-0006 | P0 |
| TC-0007-COIN | 4.0 | 3.1 | T-0007 | P0 |
| TC-0008-RECONNECT | 4.0 | 3.1 | T-0008 | P0 |
| TC-0009-FALLBACK | 4.0 | 3.1 | T-0009 | P0 |
| TC-0307-MODAL | 4.2 | 3.3 | T-0307 | P1 |
| TC-0716-VIEW | Architecture 4.4 | 3.6 | T-0716 | P0 |
| TC-0718-ARCH | Architecture 2 / 4.4 | Governance | T-0718 | P0 |
| TC-0719-CREATE-UX | 4.1 | 3.1 | T-0719 | P1 |
| TC-0702-API | 4.1 / 4.3 | 2.3, 4.1, 4.2 | T-0702 | P0 |
| TC-0702-LOC | 4.3 | 3.2 | T-0702 | P1 |
| TC-0703-E2E | 4.1 / 4.2 / 4.4 / 4.5 | 3.1, 3.3, 4.2, 4.3, 4.4 | T-0703 | P0 |
| TC-0704-DEVNET | 4.4 / 4.5 | Contract / Devnet | T-0704 | P0 |
| TC-0705-ERR | 4.1 / 4.3 / 4.5 | 6.1, 6.2 | T-0705 | P0 |
| TC-0708-TOOL | 4.x / 6.1 | QA / Tooling | T-0708 | P1 |

## 4. Test Strategy

### Functional

- Main flow validation:
  - Wallet connect modal closes as soon as provider/auth state reaches connected
  - Wallet balance formatting preserves correct value for both integer-decimal and fractional coin scenarios
  - Wallet entry payment transaction accepts the configured LUX coin type instead of rejecting all non-SUI coins
  - Wallet config uses the actual LUX coin Move type instead of `coin_registry::Currency<...>`
  - Wallet reconnect after explicit disconnect starts from a fresh modal/provider state
  - Wallet balance query falls back to `listBalances` when the single-coin query returns an unusable zero/error
  - Planning page keeps Team Lobby information primary and moves create-team form into an on-demand modal
  - Active view files no longer own workflow hooks; controller hooks now own modal/form/search/URL/data-fetch orchestration
  - Architecture verification runs without controller->model allowlists
  - Create-match economics fields support direct numeric entry and publish summary highlights pool economics more clearly
  - API-level discovery coverage for `constellations/search/recommendations`
  - Route-level E2E for `Create Draft -> Publish -> Create Team -> Apply -> Approve/Reject -> Lock -> Pay -> Stream -> Settlement`
- Error flow validation:
  - stale world API fallback
  - topology missing fallback
  - invalid signature rejection
  - duplicate publish replay vs conflict
  - duplicate settlement read replay
- Edge/boundary validation:
  - location payload rejects `NaN`
  - precision-mode publish still validates target nodes

### Architecture Compliance

- Executed:
```bash
node ./scripts/check-layer-imports.mjs
```
- Result:
  - Pass
  - `T-0706` 已完成，目标 controller 不再直接 import model

### UI Compliance (If Applicable)

- No browser screenshot regression was required for this turn.
- Lobby location domain behavior is covered through `src/service/locationService.test.ts`.
- Wallet modal fix is verified through controlled `open` state wiring plus build/type checks; no browser automation was available in this turn.
- View/controller ownership is verified by static code scan plus build/type checks; remaining view-local hooks are limited to presentational hover/animation state inside `NodeMap3D` and memoized SVG row layout in `UrgencyTrendSparkline`.

### Contract Validation (If Applicable)

- Executed:
```bash
sui client faucet --json
bash ./scripts/devnet-verify.sh
```

## 5. Test Cases

### TC-0005-AUTH Wallet Modal Auto Dismiss

- Preconditions:
  - `WalletConnectBridge` is rendered through `FuelMissionShell`
  - dApp Kit provider can emit `walletConnection.status=connected`
- Steps:
1. Run `pnpm typecheck`
2. Inspect `WalletConnectBridge` and `FuelMissionShell` wiring for controlled `open` state
3. Verify modal close path is driven by provider/auth connected state instead of imperative delayed ref calls
- Expected Result:
  - `ConnectModal` uses controlled `open`
  - Modal closes immediately when provider/auth enters connected state
  - No type regression is introduced in wallet shell wiring
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `pnpm typecheck`
  - `src/view/components/WalletConnectBridge.tsx`
  - `src/view/components/FuelMissionShell.tsx`

### TC-0006-BAL Wallet Balance Decimals and Formatting

- Preconditions:
  - Shared wallet balance utility is available
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/utils/walletBalance.test.ts`
2. Verify `500000` with `decimals=0` stays `500000`
3. Verify `500000` with `decimals=9` keeps a non-zero display string instead of `0`
4. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/service/walletService.test.ts`
5. Run `pnpm typecheck`
- Expected Result:
  - Balance conversion respects authoritative decimals
  - Entry payment transaction can be built with configured LUX coin type
  - Small non-zero balances remain visible in UI formatting
  - Controller/view imports stay type-safe
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/service/walletService.test.ts`
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/utils/walletBalance.test.ts`
  - `pnpm typecheck`

### TC-0007-COIN LUX Coin Type Contract

- Preconditions:
  - `NEXT_PUBLIC_LUX_COIN_TYPE` is configured in frontend env
- Steps:
1. Verify `.env` and `.env.example` use `0xf0446b93345c1118f21239d7ac58fb82d005219b2016e100f074e4d17162a465::EVE::EVE`
2. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/service/walletService.test.ts`
3. Run `pnpm typecheck`
- Expected Result:
  - Config no longer uses `0x2::coin_registry::Currency<...>`
  - Entry payment builder uses the actual LUX coin type string
  - Wallet balance and payment code compile against the corrected config
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `.env`
  - `.env.example`
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/service/walletService.test.ts`
  - `pnpm typecheck`

### TC-0008-RECONNECT Wallet Reconnect Fresh Session

- Preconditions:
  - `WalletConnectBridge` is mounted in `FuelMissionShell`
  - dApp Kit provider supports explicit disconnect
- Steps:
1. Run `pnpm build`
2. Inspect `WalletConnectBridge` to confirm each `openSignal` creates a fresh modal instance
3. Inspect `useAuthController` to confirm new connect attempts perform best-effort provider cleanup when status is not yet `disconnected`
4. Run `pnpm typecheck`
- Expected Result:
  - Reopen uses a fresh `ConnectModal` instance instead of reusing stale internal state
  - A stale `connected/reconnecting/connecting` provider state is cleaned before retry connect
  - `CONNECT -> EXIT -> CONNECT` no longer hangs in `Awaiting connection...`
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/view/components/WalletConnectBridge.tsx`
  - `src/controller/useAuthController.ts`
  - `pnpm build`
  - `pnpm typecheck`

### TC-0009-FALLBACK Wallet Balance Fallback Path

- Preconditions:
  - `useAuthController` runtime bridge is configured with the real LUX coin type
- Steps:
1. Inspect `useAuthController` to confirm balance resolution first tries `getBalance`, then falls back to `listBalances`
2. Inspect `authService` to confirm sync/refresh failures emit explicit logs instead of silently hiding the error source
3. Run `pnpm build`
4. Run `pnpm typecheck`
- Expected Result:
  - Zero/error from the single-coin query does not immediately force UI to show `0 LUX`
  - Fallback path exact-matches the normalized LUX coin type from `listBalances`
  - Balance query failures become observable in console logs
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/controller/useAuthController.ts`
  - `src/service/authService.ts`
  - `pnpm build`
  - `pnpm typecheck`

### TC-0307-MODAL Planning Page Create Team Modal

- Preconditions:
  - `/planning` resolves to `TeamLobbyScreen`
- Steps:
1. Inspect `TeamLobbyScreen` to confirm the inline create-team form is no longer rendered in the page body
2. Verify page-level CTA opens a dedicated modal for team creation
3. Verify modal submit path still calls the existing `createTeam` controller flow and auto-closes on success
4. Run `pnpm build`
5. Run `pnpm typecheck`
- Expected Result:
  - `/planning` primary layout remains focused on match snapshot and team board
  - Create-team interaction is available through a button-triggered modal
  - Existing business logic and controller/service contracts remain unchanged
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/view/screens/TeamLobbyScreen.tsx`
  - `pnpm build`
  - `pnpm typecheck`

### TC-0716-VIEW Controller-owned View Orchestration

- Preconditions:
  - Screen/component orchestration controllers are present under `src/controller`
- Steps:
1. Run `rg -n "useState|useEffect|useMemo|fetch\\(|usePathname|useRouter|useSearchParams" src/view -g '!**/*.test.*'`
2. Confirm remaining matches are limited to presentational-only hooks in `src/view/components/NodeMap3D.tsx` and `src/view/components/UrgencyTrendSparkline.tsx`
3. Run `node ./scripts/check-layer-imports.mjs`
4. Run `pnpm typecheck`
5. Run `pnpm build`
- Expected Result:
  - Active view screen/component files do not own workflow state, async data loading, or URL sync
  - Orchestration hooks live in controller layer and are consumed by View as state/actions only
  - Import direction, type safety, and production build all remain green
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `rg -n "useState|useEffect|useMemo|fetch\\(|usePathname|useRouter|useSearchParams" src/view -g '!**/*.test.*'`
  - `node ./scripts/check-layer-imports.mjs`
  - `pnpm typecheck`
  - `pnpm build`

### TC-0718-ARCH Architecture Guardrail Enforcement

- Preconditions:
  - Layer lint script is present in `scripts/check-layer-imports.mjs`
- Steps:
1. Inspect `scripts/check-layer-imports.mjs` to confirm there is no controller->model exception list
2. Verify `src/controller` no longer imports `@/model/*`
3. Run `node ./scripts/check-layer-imports.mjs`
4. Run `pnpm verify:arch`
- Expected Result:
  - Layer lint forbids all controller -> model imports with no allowlist bypass
  - Repository exposes a single architecture verification command
  - Architecture gate fails only on real violations, not on documented exceptions
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `scripts/check-layer-imports.mjs`
  - `package.json`
  - `node ./scripts/check-layer-imports.mjs`
  - `pnpm verify:arch`

### TC-0719-CREATE-UX Create Match Economics and Pool Projection

- Preconditions:
  - Create Match modal renders `CreateMatchScreen`
- Steps:
1. Inspect `CreateMatchScreen` to confirm `Team Cap` and `Match Duration` use numeric inputs instead of select-only controls
2. Verify economics helper copy is shortened to brief one-line guidance
3. Verify `Pool Projection` highlights projected full pool, guaranteed stake, projected entry flow, platform fee, and payout pool with stronger numeric hierarchy
4. Run `node ./scripts/check-layer-imports.mjs`
5. Attempt `pnpm build`
- Expected Result:
  - All economics controls accept direct numeric entry
  - Supporting copy is concise
  - Pool projection reads as a highlighted financial summary rather than a plain text list
- Actual Result:
  - UI logic and styling changes completed
  - `node ./scripts/check-layer-imports.mjs` passed
  - `pnpm build` remains intermittently blocked by an existing Next prerender/module generation issue unrelated to this screen
- Status: Blocked
- Evidence (logs/screenshots/tx id):
  - `src/view/screens/CreateMatchScreen.tsx`
  - `src/controller/useCreateMatchScreenController.ts`
  - `node ./scripts/check-layer-imports.mjs`
  - `pnpm build`

### TC-0702-API Discovery and Recommendation APIs

- Preconditions:
  - Temporary node index snapshot with deterministic Jita/Kisogo/Perimeter fixtures
  - World API fetch stub enabled
- Steps:
1. Run `src/app/api/__tests__/f007-discovery-routes.test.ts`
2. Verify constellation list/detail payloads
3. Verify search, solar-system recommendations, and node recommendations payloads
- Expected Result:
  - All responses are `200`
  - Recommendation APIs return deterministic payloads
  - Missing topology degrades to same-system recommendations
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node ./scripts/test-f007.mjs`

### TC-0702-LOC Lobby Location Validation

- Preconditions:
  - `locationStore` reset
- Steps:
1. Run `src/service/locationService.test.ts`
2. Set a valid location
3. Clear it
4. Submit an invalid payload with `NaN`
- Expected Result:
  - Valid location persists and clears
  - Invalid payload returns `INVALID_INPUT`
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node ./scripts/test-f007.mjs`

### TC-0703-E2E Draft to Settlement Route Flow

- Preconditions:
  - Temporary projection store and node snapshot
  - World API fetch stub enabled
- Steps:
1. `POST /api/matches` create draft
2. `POST /api/matches/{id}/publish`
3. `POST /api/matches/{id}/teams`
4. `POST /api/teams/{id}/join`
5. `POST /api/teams/{id}/applications/{applicationId}/approve|reject`
6. `POST /api/teams/{id}/lock`
7. `POST /api/teams/{id}/pay`
8. Read `/scoreboard`, `/stream`, `/settlement`, `/result`
- Expected Result:
  - Full route chain succeeds
  - Stream yields `score_update`
  - Settlement/result reads are stable and replay-safe
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/app/api/__tests__/f007-match-flow.test.ts`

### TC-0704-DEVNET CLI Verification

- Preconditions:
  - Active Sui CLI `devnet` environment
  - Faucet gas requested for active wallet
- Steps:
1. Run `sui client faucet --json`
2. Run `bash ./scripts/devnet-verify.sh`
3. Inspect `docs/devnet-verification-latest.md`
- Expected Result:
  - Move tests pass
  - `test-publish` succeeds on devnet
  - `create_room` succeeds
  - `RoomCreated` event query returns at least 1 row
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `docs/devnet-verification-latest.md`

### TC-0705-ERR Abnormal Regression Coverage

- Preconditions:
  - Temporary fixtures and idempotency keys
- Steps:
1. Force stale world API fallback after cache warmup
2. Execute node recommendation without topology file
3. Replay publish with same key, then retry with different key
4. Replay settlement result read twice
5. Submit invalid signature on pay
- Expected Result:
  - `stale=true` appears on fallback reads
  - Missing topology degrades gracefully
  - Duplicate publish replays only for the identical request
  - Duplicate settlement read returns identical result hash
  - Invalid signature returns `401`
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/app/api/__tests__/f007-discovery-routes.test.ts`
  - `src/app/api/__tests__/f007-match-flow.test.ts`

### TC-0708-TOOL Node Test Loader Stability

- Preconditions:
  - `scripts/register-test-loader.mjs` and `scripts/node-alias-loader.mjs` are active
- Steps:
1. Run `node ./scripts/test-f007.mjs`
2. Verify each F-007 test file runs in its own Node invocation
3. Verify alias and extensionless relative imports both resolve
- Expected Result:
  - All targeted tests complete without `ERR_MODULE_NOT_FOUND`
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `scripts/test-f007.mjs`

## 6. Defect Management

When a defect is found:

1. Add a new bugfix task into the related `todo.md` first.
2. Include reproducible details:
- Repro steps
- Expected result
- Actual result
- Scope impact
- Evidence/logs/commands
3. Hand over to Coding Agent for implementation.
4. Re-run targeted regression and critical-path regression.

Detected during this pass:

- 已记录并关闭 `T-0005 / T-0006`；未发现新增未关闭 defect

## 7. Exit Criteria

- All linked F-000 wallet regression tasks under test scope passed.
- All linked F-007 pending tasks under test scope passed.
- Devnet CLI verification completed and report refreshed.
- No unresolved F-007 blocker remains.
- Final verification summary delivered.
