# Fuel Frog Panic Test Plan

## 1. Document Control

- Project/App: `Fuel Frog Panic`
- Related PRD: `docs/PRD.md` v2.7.0
- Related SPEC: `docs/SPEC.md` v6.5
- Related TODO: `docs/TODO.md` v2.7.0
- Version: v1.11
- Status: In Progress
- Owner (Testing Agent): Codex
- Last Updated: 2026-04-01

## 2. Scope

- Features in scope:
  - F-013 `T-1300`: local simulated FuelEvent injection updates live match scoreboard and stream without game client
  - F-013 `T-1301`: one-shot script drives a reusable `/match` live verification scenario
  - F-011 `T-1100`: planning team registry persists into backend `planning_teams / planning_team_members` and hydrates after restart
  - F-011 `T-1101`: create -> reset local projection -> GET `/api/planning-teams` recovers correct team count through backend hydrate
  - F-012 `T-1200`: planning team join becomes captain-approved application flow
  - F-012 `T-1201`: planning team member leave and captain disband are available
  - F-012 `T-1202`: planning team controller/service/store own approval and lifecycle actions
  - F-012 `T-1203`: `/planning` UI shows pending requests, captain review, leave, and disband controls
  - F-012 `T-1204`: planning team lifecycle path passes runtime/API/UI regression plus build/layer checks
  - F-000 `T-0005`: wallet connect modal auto-dismiss after provider login
  - F-000 `T-0006`: wallet balance decimals resolution and non-zero balance formatting
  - F-000 `T-0007`: correct LUX coin type for StateService/GetBalance and entry payment
  - F-000 `T-0008`: second connect after explicit disconnect must not hang in awaiting state
  - F-000 `T-0009`: fallback from `getBalance` to `listBalances` for LUX balance resolution
  - F-001 `T-0107`: create-match publish requires a real sponsorship payment before publish
  - F-001 `T-0108`: publish route verifies tx digest against coin type, recipient, and exact sponsorship amount
  - F-003 `T-0308`: team payment route verifies tx digest against coin type, recipient, and exact team entry amount
  - F-003 `T-0307`: planning page create-team flow uses modal instead of inline form
  - F-003 `T-0318`: planning team registry APIs return full team board payload and support direct join
  - F-003 `T-0319`: planning team store/service/controller support team board plus join mutation
  - F-003 `T-0320`: `/planning` page renders all registered teams with role-slot-based join actions
  - F-003 `T-0321`: planning registry board passes targeted runtime/API/build/layer verification
  - F-003 `T-0312`: player team dossier runtime/API returns current deployment plus participation history
  - F-003 `T-0313`: `/team` page reads through dedicated `teamDossierStore -> teamDossierService` chain
  - F-003 `T-0314`: shell navigation exposes a dedicated team dossier page with active squad + deployment log
  - F-003 `T-0315`: team dossier path passes targeted runtime tests, build, and layer import verification
  - F-007 `T-0716`: active view orchestration moved into controller hooks, leaving view as render-only
  - F-007 `T-0718`: architecture guardrail is enforced without controller->model exceptions
  - F-007 `T-0719`: create-match economics fields accept direct numeric input and pool projection is visually emphasized
  - F-007 `T-0728`: investigate create-match `0 nodes` systems and validate node projection coverage
  - F-007 `T-0729`: upgrade old node-index snapshots and backfill `solarSystem` from connected assemblies when direct node location is absent
  - F-007 `T-0730`: create-match system search supports canonical/legacy aliases when live world-api system names are coded
  - F-007 `T-0734`: mirror match/team lifecycle data into backend tables and hydrate local runtime projection from backend on restart
  - F-019 `T-1900`: create-match flow persists fixed `teamSize` through store, API, runtime, and discovery DTOs
  - F-019 `T-1901`: match-specific Team Lobby inherits match `teamSize`, enforces fixed role-slot total, and charges `entryFee × teamSize`
  - F-019 `T-1902`: `/planning?matchId=` routes into Team Lobby and surfaces fixed roster + team entry fee
  - F-019 `T-1903`: fixed team-size pricing model passes targeted runtime/API/build/layer verification
  - F-022 `T-2200`: `POST /api/matches` no longer performs full backend hydrate before persisting a new draft
  - F-022 `T-2201`: create-draft route regression covers the Vercel timeout path and verifies no `GET /rest/v1/matches?select=*` prefetch
  - F-008 `T-0800`: `fuelConfigRuntime` loads `FuelConfig.fuel_efficiency` and keeps stale fallback on failure
  - F-008 `T-0801`: accepted score events persist into `fuel_events` runtime fact with v2.7 grade fields and legacy fallback
  - F-008 `T-0802`: `chainSyncEngine` applies `fuelGradeBonus` in the score formula
  - F-008 `T-0803`: public `FuelDepositEvent / MatchStreamEvent` contracts carry fuel-grade payload
  - F-009 `T-0900`: public stream events hydrate into a shared runtime/feed model with grade-aware dedupe
  - F-009 `T-0901`: `/match` live overlay feed renders fuel-grade badge plus multiplier breakdown
  - F-009 `T-0902`: demo replay feed includes Tier 1/2/3 scripted fuel-grade callouts
  - F-010 `T-1000`: fuel-grade regression batch covers cache fallback, scoring formula, stream payload, and demo feed copy
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
| TC-1100-PLANNING-BACKEND | 4.2 | 3.3, 5.10 | T-1100 | P0 |
| TC-1101-PLANNING-HYDRATE | 4.2 | 3.3, 5.10, 6.1 | T-1101 | P0 |
| TC-1200-PLANNING-APPLY | 4.2 | 3.3, 4.5, 5.10 | T-1200 | P0 |
| TC-1201-PLANNING-LIFECYCLE | 4.2 | 3.3, 5.10 | T-1201 | P0 |
| TC-1300-MATCH-SIM | 4.4 | 3.4, 5.5, 5.8 | T-1300 / T-1301 | P1 |
| TC-0107-SPONSOR | 4.1 | 3.1, 4.2 | T-0107 | P0 |
| TC-0108-PUBLISH | 4.1 | 4.2, 6.1 | T-0108 | P0 |
| TC-0308-TEAMPAY | 4.3 | 4.3, 6.1 | T-0308 | P0 |
| TC-0307-MODAL | 4.2 | 3.3 | T-0307 | P1 |
| TC-0318-PLANNING-API | 4.2 | 4.5, 5.9 | T-0318 | P0 |
| TC-0320-PLANNING-VIEW | 4.2 | 3.3 | T-0319 / T-0320 | P0 |
| TC-0321-PLANNING-BUILD | 4.2 | 3.3, 4.5 | T-0321 | P0 |
| TC-0312-DOSSIER-RUNTIME | 4.2 | 2.4, 3.3, 4.3 | T-0312 | P0 |
| TC-0314-DOSSIER-PAGE | 4.2 | 3.3 | T-0313 / T-0314 | P0 |
| TC-0315-DOSSIER-BUILD | 4.2 | 3.3, 4.3 | T-0315 | P0 |
| TC-0716-VIEW | Architecture 4.4 | 3.6 | T-0716 | P0 |
| TC-0718-ARCH | Architecture 2 / 4.4 | Governance | T-0718 | P0 |
| TC-0719-CREATE-UX | 4.1 | 3.1 | T-0719 | P1 |
| TC-0728-NODE-INDEX | 4.1 | 3.1, 5.2, 5.3 | T-0728 | P0 |
| TC-0729-NODE-BACKFILL | 4.1 | 5.3 | T-0729 | P0 |
| TC-0730-SEARCH-ALIAS | 4.1 | 3.1, 4.1 | T-0730 | P0 |
| TC-0734-BACKEND-PERSIST | 4.1 / 4.2 / 4.5 | 5.5, 6.2, 7.1 | T-0734 | P0 |
| TC-0800-FUELCONFIG | 0.8 / 4.4 | 2.6, 5.7 | T-0800 | P0 |
| TC-0801-FUEL-FACT | 4.4 | 5.8, Architecture 6 | T-0801 | P0 |
| TC-0802-GRADE-SCORE | 4.4 | 2.6, 5.8 | T-0802 | P0 |
| TC-0803-STREAM-PAYLOAD | 4.4 | 2.3, 4.2 | T-0803 | P0 |
| TC-0901-LIVE-GRADE-FEED | 4.4 | 3.4 | T-0900 / T-0901 | P1 |
| TC-0902-DEMO-GRADE-FEED | 4.4 | 3.4 | T-0902 | P1 |
| TC-0702-API | 4.1 / 4.3 | 2.3, 4.1, 4.2 | T-0702 | P0 |
| TC-0702-LOC | 4.3 | 3.2 | T-0702 | P1 |
| TC-0703-E2E | 4.1 / 4.2 / 4.4 / 4.5 | 3.1, 3.3, 4.2, 4.3, 4.4 | T-0703 | P0 |
| TC-0704-DEVNET | 4.4 / 4.5 | Contract / Devnet | T-0704 | P0 |
| TC-0705-ERR | 4.1 / 4.3 / 4.5 | 6.1, 6.2 | T-0705 | P0 |
| TC-0708-TOOL | 4.x / 6.1 | QA / Tooling | T-0708 | P1 |
| TC-1900-MATCH-TEAMSIZE | 4.1 / 4.3 | 2.4, 3.1, 7.1 | T-1900 / T-1901 | P0 |
| TC-1902-TEAMLOBBY-ROUTE | 4.3 | 3.3, Architecture 4.1, 7.3 | T-1902 | P0 |
| TC-2200-CREATE-TIMEOUT | 4.1 | 4.2, 5.5, 6.1 | T-2200 / T-2201 | P0 |

## 4. Test Strategy

### Functional

- Main flow validation:
  - Local simulated FuelEvent injection can drive live `/match` scoreboard and feed without EVE client input
  - Standalone planning teams are mirrored to backend `planning_teams / planning_team_members` instead of remaining local-only
  - After local projection reset or process restart, `GET /api/planning-teams` hydrates the correct `items/totalTeams` from backend
  - Standalone planning team join creates a pending application instead of immediately writing a member
  - Captains can approve or reject pending standalone planning team applications
  - Non-captain members can leave standalone planning teams
  - Captains can disband standalone planning teams
  - `fuelConfigRuntime` can read `FuelConfig` table entries, preserve stale cache on RPC failure, and degrade to Tier 1 when config is missing
  - Accepted score events persist into `fuel_events` runtime facts with `fuelTypeId / fuelGrade / fuelGradeBonus`, and legacy rows remain readable with Tier 1 defaults
  - `chainSyncEngine` score formula includes `fuelGradeBonus` from `FuelEvent.type_id`
  - Persisted/public stream `score_update` payload can carry `fuelDeposit.fuelGrade`
  - `/match` live overlay feed renders grade badge plus `urgency × panic × grade` breakdown from shared score events
  - Demo replay feed contains visible Tier 1 / Tier 2 / Tier 3 scripted grade callouts
  - Wallet connect modal closes as soon as provider/auth state reaches connected
  - Wallet balance formatting preserves correct value for both integer-decimal and fractional coin scenarios
  - Wallet entry payment transaction accepts the configured LUX coin type instead of rejecting all non-SUI coins
  - Wallet config uses the actual LUX coin Move type instead of `coin_registry::Currency<...>`
  - Wallet reconnect after explicit disconnect starts from a fresh modal/provider state
  - Wallet balance query falls back to `listBalances` when the single-coin query returns an unusable zero/error
  - Create-match publish only proceeds after a real sponsorship payment has produced a tx digest
  - Publish route validates sponsorship digest coin type, recipient, and amount against the draft
  - Team payment route validates `TeamEntryLocked` escrow commitment plus exact debit against the team payment quote
  - Planning page keeps Team Lobby information primary and moves create-team form into an on-demand modal
  - Planning registry APIs expose a full team board and allow direct join before any match binding
  - Planning page lists every registered team and shows open role slots instead of only a registry count
  - Player team dossier returns current squad composition plus reverse-chronological deployment history from a single read path
  - `/team` reads through a dedicated `teamDossier` store/service/controller chain and stays within layer boundaries
  - Shell navigation exposes a separate squad dossier destination without regressing build output or route generation
  - Active view files no longer own workflow hooks; controller hooks now own modal/form/search/URL/data-fetch orchestration
  - Architecture verification runs without controller->model allowlists
  - Create-match economics fields support direct numeric entry and publish summary highlights pool economics more clearly
  - Create-match system selection is validated against actual node projection coverage, not only UI ordering assumptions
  - Node index upgrade path and connected-assembly location fallback preserve system-scoped node queries after the runtime fix
  - Create-match system search remains usable when live world-api names differ from the canonical EVE system names users type
  - Match/team lifecycle state can be mirrored into backend tables and re-hydrated into local projection on cold start
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

### 2026-03-31 Fuel Grade Regression Batch

- Executed:
```bash
node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/service/chainSyncEngine.test.ts src/server/fuelConfigRuntime.test.ts src/service/matchDemoReplayService.test.ts src/server/matchRuntime.stream.test.ts
node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/runtimeProjectionStore.fuelEvents.test.ts src/app/api/__tests__/fuel-events-route.test.ts
pnpm typecheck
node ./scripts/check-layer-imports.mjs
pnpm build
```
- Result:
  - Pass
  - `FuelConfig` cache read, `fuel_events` fact persistence, stale fallback, grade-aware scoring, persisted stream hydration, demo feed grade callouts, architecture lint, typecheck, and production build all passed on 2026-03-31.

### 2026-03-31 FuelConfig Chain Verification

- Executed:
```bash
sui client envs
sui client active-env
sui client active-address
sui client --client.env devnet object 0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75 --json
curl "$SUI_RPC_URL" ... sui_getObject(package) on testnet
curl "$SUI_RPC_URL" ... sui_getTransactionBlock(AzBhmMFd9UTbr4m4hnSjSbBLkmVW3VESUDG15DGnCT8)
curl "$SUI_RPC_URL" ... sui_getObject(0x0f354c803af170ac0d1ac9068625c6321996b3013dc67bdaf14d06f93fa1671f)
curl "$SUI_RPC_URL" ... suix_getDynamicFields(0x1beb08d47745a0925bce48175b69b6d683f663371f51413072f6ff3bd9f72167)
curl "$SUI_RPC_URL" ... sui_getObject(<dynamic-field-object>)
curl "$SUI_RPC_URL" ... suix_queryEvents(MoveEventType(::fuel::FuelEvent))
curl "$SUI_RPC_URL" ... sui_getObject(0x722286493f1fdf9f70a8f55352bb64a7370ec231f6d5ee393493257b04cf7a8b)
```
- Result:
  - Pass with justified network fallback
  - `devnet` query returned `Object ... not found` for configured `EVE_FRONTIER_PACKAGE_ID`, so the package required for `FuelConfig` verification is not deployed there.
  - `testnet` read-only fallback succeeded and located:
    - `EVE_FRONTIER_PACKAGE_ID`: `0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75`
    - `FuelConfig` object id: `0x0f354c803af170ac0d1ac9068625c6321996b3013dc67bdaf14d06f93fa1671f`
    - `fuel_efficiency` table id: `0x1beb08d47745a0925bce48175b69b6d683f663371f51413072f6ff3bd9f72167`
  - Real on-chain mapping extracted from the table:
    - `78437 -> 90` (`Tier 3 / Refined / 1.5x`)
    - `78515 -> 80` (`Tier 3 / Refined / 1.5x`)
    - `78516 -> 40` (`Tier 1 / Standard / 1.0x`)
    - `84868 -> 40` (`Tier 1 / Standard / 1.0x`)
    - `88319 -> 15` (`Tier 1 / Standard / 1.0x`)
    - `88335 -> 10` (`Tier 1 / Standard / 1.0x`)
  - Real `DEPOSITED` sample used for score verification:
    - tx digest: `9EofS8iLTFF2rZ8ZueiX5C7Ty1c5eKzA1FzdzdjJTeJo`
    - node id: `0x722286493f1fdf9f70a8f55352bb64a7370ec231f6d5ee393493257b04cf7a8b`
    - `old_quantity=0`, `new_quantity=100`, `fuel_added=100`, `type_id=88335`
    - node `max_capacity=100000`, so `fillRatioAt=0/100000=0`, `urgencyWeight=3.0`
    - `type_id=88335 -> efficiency 10 -> Tier 1 -> fuelGradeBonus=1.0`
    - Normal-mode sample score: `100 × 3.0 × 1.0 × 1.0 = 300`
  - `.env` and `.env.example` were updated with `EVE_FRONTIER_FUEL_CONFIG_ID=0x0f354c803af170ac0d1ac9068625c6321996b3013dc67bdaf14d06f93fa1671f`

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

### TC-0107-SPONSOR Create Match Sponsorship Payment Gate

- Preconditions:
  - `NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID` is configured
  - Wallet is connected and has sufficient EVE test token / LUX balance
- Steps:
1. Create a draft from the create-match modal
2. Trigger publish from the modal
3. Confirm wallet approval UI appears for `publish_match_with_sponsorship<T>` before the publish API request is sent
4. Confirm controller reuses an already paid sponsorship tx digest when publish retry is needed
- Expected Result:
  - Publish no longer fabricates a local tx digest
  - Sponsorship payment is locked into escrow via `publish_match_with_sponsorship<T>` before `POST /api/matches/{id}/publish`
  - Publish retry reuses the same paid tx digest instead of charging the user again
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/controller/useCreateMatchScreenController.ts`
  - `src/service/authService.ts`
  - `src/service/createMatchService.ts`

### TC-0108-PUBLISH Publish Route Chain Verification

- Preconditions:
  - Server runs with `FUEL_FROG_CHAIN_MODE=verify`
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/devnetChainRuntime.test.ts`
2. Inspect `/api/matches/{id}/publish` route to confirm it requires a `MatchPublished` event and validates the publisher debit against the draft
3. Run `pnpm typecheck`
4. Run `pnpm build`
- Expected Result:
  - Publish route rejects tx digests that do not contain a `MatchPublished` event
  - Publish route rejects tx digests whose sender debit or amount do not match sponsorship rules
  - Publish route no longer silently downgrades to digest-exists-only validation when escrow publish metadata is missing
  - Build and typecheck remain green with verify-mode support enabled
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/server/devnetChainRuntime.test.ts`
  - `src/app/api/matches/[id]/publish/route.ts`
  - `src/server/devnetChainRuntime.ts`
  - `pnpm typecheck`
  - `pnpm build`

### TC-0308-TEAMPAY Team Payment Route Chain Verification

- Preconditions:
  - `NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID` is configured
  - Server runs with `FUEL_FROG_CHAIN_MODE=verify`
- Steps:
1. Inspect `/api/teams/{id}/pay` route to confirm it resolves the expected team payment amount before tx verification
2. Confirm route passes `coinType + sender + exactAmountBaseUnits` expectation into `verifySubmittedTxDigest`
3. Confirm route requires a `TeamEntryLocked` event and checks `room_id + escrow_id + team_ref + member_count + quoted_amount_lux + locked_amount`
4. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/devnetChainRuntime.test.ts`
5. Run `pnpm typecheck`
6. Run `pnpm build`
- Expected Result:
  - Team payment route no longer accepts a digest merely because it exists on chain
  - Entry payment tx must lock funds into `MatchEscrow` instead of transferring to an external recipient
  - Entry payment tx must match `TeamEntryLocked` commitment fields, coin type, and exact debit amount
  - Typecheck/build remain green after the stricter validation
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/app/api/teams/[id]/pay/route.ts`
  - `src/server/teamRuntime.ts`
  - `src/server/devnetChainRuntime.ts`
  - `src/server/devnetChainRuntime.test.ts`
  - `pnpm typecheck`
  - `pnpm build`

### TC-0307-MODAL Planning Page Create Team Modal

- Preconditions:
  - `/planning` resolves to `PlanningTeamScreen`
- Steps:
1. Inspect `PlanningTeamScreen` to confirm the create-team form is rendered only inside the modal
2. Verify page-level CTA opens a dedicated modal for team creation
3. Verify modal submit path calls the planning-team `createTeam` controller flow and auto-closes on success
4. Run `pnpm build`
5. Run `pnpm typecheck`
- Expected Result:
  - `/planning` primary layout keeps create-team input out of the default page body
  - Create-team interaction is available through a button-triggered modal
  - Existing business logic and controller/service contracts remain unchanged
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/view/screens/PlanningTeamScreen.tsx`
  - `pnpm build`
  - `pnpm typecheck`

### TC-0318-PLANNING-API Planning Team Registry Board APIs

- Preconditions:
  - Temporary runtime projection store is reset to an empty fixture
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/planningTeamRuntime.test.ts src/app/api/__tests__/planning-teams-route.test.ts`
2. Verify `createPlanningTeam()` stores captain membership in `members[]`
3. Verify `POST /api/planning-teams/{id}/join` appends a new member and returns the updated team snapshot
- Expected Result:
  - `GET /api/planning-teams` returns complete team board data, not just a count
  - Join route enforces one-wallet-one-team and role-slot capacity
  - Route/runtime tests remain deterministic with a temp projection store
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/server/planningTeamRuntime.test.ts`
  - `src/app/api/__tests__/planning-teams-route.test.ts`
  - `src/app/api/planning-teams/[id]/join/route.ts`
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/planningTeamRuntime.test.ts src/app/api/__tests__/planning-teams-route.test.ts`

### TC-0320-PLANNING-VIEW Planning Team Board UI

- Preconditions:
  - `/planning` is backed by `planningTeamStore -> planningTeamService -> usePlanningTeamController`
- Steps:
1. Inspect `src/view/screens/PlanningTeamScreen.tsx`
2. Confirm page renders `state.teams.map(...)` as a team board with members, slot counts, and join controls
3. Confirm `usePlanningTeamScreenController` owns join role selection and mutation dispatch
- Expected Result:
  - `/planning` no longer hides existing teams behind a single aggregate count
  - Join controls are driven by open role slots and current wallet membership
  - View remains render-only relative to the new join workflow
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/view/screens/PlanningTeamScreen.tsx`
  - `src/controller/usePlanningTeamScreenController.ts`
  - `src/service/planningTeamService.ts`

### TC-0321-PLANNING-BUILD Planning Registry Build and Layer Verification

- Preconditions:
  - `/planning` and `/api/planning-teams/[id]/join` are part of the app router
- Steps:
1. Run `node ./scripts/check-layer-imports.mjs`
2. Run `pnpm build`
3. Confirm build output includes `/planning` and `/api/planning-teams/[id]/join`
- Expected Result:
  - Layer lint passes after the new planning join path is added
  - Production build remains green
  - Build manifest shows the new join route
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node ./scripts/check-layer-imports.mjs`
  - `pnpm build`

### TC-0312-DOSSIER-RUNTIME Player Team Dossier Runtime Aggregation

- Preconditions:
  - Runtime projection store is reset to an empty deterministic fixture
  - Custom settled/running match details are seeded for `0xtest-pilot-alpha`
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/app/api/__tests__/players.test.ts`
2. Verify `getPlayerProfile()` counts only settled earnings while still including active participation in match count
3. Verify `getPlayerTeamDossier()` returns `currentDeployment`, `summary`, and reverse-chronological `participations`
- Expected Result:
  - Runtime aggregation is deterministic and no longer depends on whatever local projection data happened to exist
  - Active deployment resolves to the newest non-settled team entry
  - Settled entries carry payout values while active entries keep `payout=0`
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/app/api/__tests__/players.test.ts`
  - `src/server/playerRuntime.ts`
  - `src/app/api/players/[address]/team-dossier/route.ts`
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/app/api/__tests__/players.test.ts`

### TC-0314-DOSSIER-PAGE Team Dossier Page Layer Contract

- Preconditions:
  - `/team` page is wired into `FuelMissionShell`
- Steps:
1. Inspect `src/model/teamDossierStore.ts`, `src/service/teamDossierService.ts`, `src/controller/useTeamDossierController.ts`, `src/controller/useTeamDossierScreenController.ts`, and `src/view/screens/TeamDossierScreen.tsx`
2. Verify View imports Controller only, Controller imports Service only, and Service imports Model only
3. Confirm top-level shell navigation now includes `/team`
- Expected Result:
  - Team dossier page uses a dedicated team domain instead of reusing Team Lobby state
  - The new `/team` route does not introduce controller -> model violations
  - Navigation exposes squad dossier as a first-class destination
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `src/model/teamDossierStore.ts`
  - `src/service/teamDossierService.ts`
  - `src/controller/useTeamDossierController.ts`
  - `src/controller/useTeamDossierScreenController.ts`
  - `src/view/screens/TeamDossierScreen.tsx`
  - `src/view/components/FuelMissionShell.tsx`

### TC-0315-DOSSIER-BUILD Team Dossier Build and Route Verification

- Preconditions:
  - Next.js app router includes `/team` and `/api/players/[address]/team-dossier`
- Steps:
1. Run `node ./scripts/check-layer-imports.mjs`
2. Run `pnpm build`
3. Confirm build output includes `/team` and `/api/players/[address]/team-dossier`
- Expected Result:
  - Layer lint passes
  - Production build remains green after adding the new page and API route
  - Build manifest shows both the dossier page and dossier API route
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node ./scripts/check-layer-imports.mjs`
  - `pnpm build`

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

### TC-0728-NODE-INDEX Create-Match `0 Nodes` Root Cause Investigation

- Preconditions:
  - Existing local projection snapshots in `data/runtime-projections.json` and `data/node-index.json`
  - Current create-match flow uses `/api/search` for system hits and `/api/network-nodes?solarSystem={id}&isOnline=true` for node loading
- Steps:
1. Quantify total solar systems, total indexed nodes, and unique `solarSystem` coverage in local projection snapshots
2. Inspect `src/server/nodeRuntime.ts`, `src/app/api/nodes/route.ts`, and `src/server/nodeIndexerRuntime.ts`
3. Compare the location event contract in `docs/all_contracts.move.txt` with the node indexer's parsing and hydration flow
4. Quantify how many indexed nodes remain at `solarSystem=0` and how many of those nodes are still online / connected
- Expected Result:
  - If create-match only has a search ordering problem, indexed nodes should already cover a meaningful number of systems
  - If node projection coverage is the main issue, most indexed nodes will remain at `solarSystem=0`, and many system-scoped node queries will legitimately return `0 nodes`
- Actual Result:
  - Fail
  - `solarSystemsCache=24502`, but only `127` indexed nodes exist
  - `121 / 127` indexed nodes remain at `solarSystem=0`
  - Only `6` solar systems have any mapped nodes; only `3` are currently selectable
  - `67` online nodes still remain at `solarSystem=0`
  - `103 / 121` zero-system nodes still have `connectedAssemblyIds`
- Status: Fail
- Evidence (logs/screenshots/tx id):
  - `jq '.networkNodes | length' data/runtime-projections.json`
  - `jq '.solarSystemsCache | length' data/runtime-projections.json`
  - `jq '[.networkNodes[] | select(.solarSystem > 0) | .solarSystem] | unique | length' data/runtime-projections.json`
  - `jq '[.networkNodes[] | select(.solarSystem == 0)] | length' data/runtime-projections.json`
  - `src/server/nodeIndexerRuntime.ts`
  - `src/server/nodeRuntime.ts`
  - `docs/all_contracts.move.txt`

### TC-0729-NODE-BACKFILL Node Index Snapshot Upgrade + Connected Assembly Location Fallback

- Preconditions:
  - Runtime code includes snapshot version upgrade logic and connected-assembly fallback
  - Unit test environment can run `nodeIndexerRuntime` helper tests without live RPC
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/__tests__/nodeIndexerRuntime.test.ts src/server/nodeRecommendationRuntime.test.ts`
2. Verify `shouldReplayFullLocationHistory` returns `true` for `v2` snapshots and `false` for `v3`
3. Verify `resolveNodeLocationForHydration` uses a connected assembly location when the node's direct location has `solarSystem=0`
4. Run `pnpm build`
5. Attempt one live `syncNodeIndexOnce()` verification against devnet
- Expected Result:
  - Old `v2` snapshots are treated as upgrade candidates
  - Nodes can inherit non-zero `solarSystem` from connected assemblies during hydration
  - Runtime and app build remain type-safe
  - Live devnet sync completes and reports reduced `solarSystem=0` coverage
- Actual Result:
  - Pass
  - Local helper/runtime regression passed
  - `pnpm build` passed
  - Real testnet sync completed against `https://fullnode.testnet.sui.io:443`
  - Live snapshot stats: `totalNodes=134`, `zeroSystemNodes=120`, `mappedSystems=10`, `selectableSystems=8`
  - Compared with the prior local snapshot, mapped systems increased from `6` to `10`, and selectable systems increased from `3` to `8`
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/__tests__/nodeIndexerRuntime.test.ts src/server/nodeRecommendationRuntime.test.ts`
  - `pnpm build`
  - `set -a; source .env; set +a; NODE_INDEX_STORE_PATH=/tmp/ffp-node-index-testnet.json node --experimental-strip-types -e "import { syncNodeIndexOnce } from './src/server/nodeIndexerRuntime.ts'; ..."`

### TC-0730-SEARCH-ALIAS Create-Match Search Supports Canonical System Names

- Preconditions:
  - Search runtime can read `data/solar-systems.json` or test alias fixture
  - Live world-api names may differ from canonical names users type
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/app/api/__tests__/f007-discovery-routes.test.ts`
2. Verify `/api/search?q=jita` still returns the Jita system even when the live stubbed world-api name is `EHK-KH7`
3. Verify result label includes both names when they differ
- Expected Result:
  - Search matches alias name, current name, and systemId
  - Returned system id remains stable
  - Label is `Jita // EHK-KH7 (30000142)` when alias/current names differ
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/app/api/__tests__/f007-discovery-routes.test.ts`

### TC-0734-BACKEND-PERSIST Match Lifecycle Backend Mirror + Hydration

- Preconditions:
  - Backend table adapter is configured with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
  - Local runtime projection file path is isolated for the test process
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/matchBackendStore.test.ts`
2. Verify local persisted match detail emits backend REST writes for `matches`, `match_targets`, `teams`, and `team_members`
3. Verify backend rows can hydrate local runtime projection when local `matches` cache is empty
4. Run `pnpm build`
- Expected Result:
  - Backend adapter mirrors current match/team payload into tables
  - Cold-start hydration restores match/team data from backend rows
  - App routes still compile with backend hydration hooks enabled
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/matchBackendStore.test.ts`
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --env-file=.env ./scripts/supabase/verify-local-backend.mjs`
  - `pnpm build`

### TC-1100-PLANNING-BACKEND Standalone Planning Team Backend Mirror

- Preconditions:
  - Backend adapter is configured with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
  - `planning_teams / planning_team_members` tables exist
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/planningTeamBackendStore.test.ts`
2. Verify persisting one standalone planning team issues backend writes for `planning_teams` and `planning_team_members`
3. Verify backend rows can hydrate local `runtimeProjectionStore.planningTeams`
- Expected Result:
  - Standalone planning teams no longer remain local-only
  - Cold-start hydration can reconstruct independent team registry state from backend tables
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/planningTeamBackendStore.test.ts`

### TC-1101-PLANNING-HYDRATE Planning Page Team Count Recovery After Reset

- Preconditions:
  - Planning team backend mirror is enabled
  - Local projection file path is isolated for the test process
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/app/api/__tests__/planning-teams-route.test.ts`
2. Create a standalone planning team through `POST /api/planning-teams`
3. Reset local projection to empty
4. Call `GET /api/planning-teams`
- Expected Result:
  - API rehydrates standalone team data from backend
  - `totalTeams` remains correct after reset/restart
  - Returned `items[0].name` matches the created team
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/app/api/__tests__/planning-teams-route.test.ts`

### TC-1200-PLANNING-APPLY Standalone Planning Team Apply + Captain Review

- Preconditions:
  - Planning team registry backend mirror is available
  - Captain and applicant wallets can sign planning-team commands
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/planningTeamRuntime.test.ts src/app/api/__tests__/planning-teams-route.test.ts`
2. Create a planning team
3. Submit `POST /api/planning-teams/{teamId}/join` as a non-member wallet
4. Verify response is `pending` and member count does not immediately increase
5. Approve and reject separate requests through captain-only routes
- Expected Result:
  - Join creates a `pending` application instead of directly adding a member
  - Captain approval adds the member
  - Captain rejection keeps the applicant out of the roster
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/planningTeamRuntime.test.ts src/app/api/__tests__/planning-teams-route.test.ts`

### TC-1201-PLANNING-LIFECYCLE Standalone Member Leave + Captain Disband

- Preconditions:
  - Planning team registry backend mirror is available
  - Team has at least one approved non-captain member
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/planningTeamRuntime.test.ts src/app/api/__tests__/planning-teams-route.test.ts`
2. Create a planning team and approve one applicant
3. Call `POST /api/planning-teams/{teamId}/leave` as the approved non-captain member
4. Call `POST /api/planning-teams/{teamId}/disband` as captain
- Expected Result:
  - Member leave removes only that member from roster
  - Captain disband removes the entire team from registry
  - Registry count and item list stay correct after the operations
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/planningTeamRuntime.test.ts src/app/api/__tests__/planning-teams-route.test.ts`

### TC-1300-MATCH-SIM Local Match Live Simulation Without Game Client

- Preconditions:
  - Running local app is reachable
  - `ENABLE_LOCAL_MATCH_SIMULATION=true`
  - Match has at least 2 teams and at least 1 member in each team
- Steps:
1. Run `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/matchSimulationRuntime.test.ts`
2. Execute `scripts/test-match-live.mjs --match-id <matchId>` against the running app
3. Verify score updates, fuel-grade badges, and live feed changes after each injected step
- Expected Result:
  - Simulated fuel events can update live match scores without the EVE client
  - Scenario includes standard, premium, refined, and panic-weighted steps
  - `/api/matches/{id}/simulate-fuel` updates persisted fuel events and stream payloads
- Actual Result:
  - Pass
- Status: Pass
- Evidence (logs/screenshots/tx id):
  - `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/matchSimulationRuntime.test.ts`
  - Real local API lifecycle run on `http://127.0.0.1:3010/api/matches/{id}/simulate-fuel`

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

- 已记录并关闭 `T-0005 / T-0006`
- `T-0728` 已完成根因调查
- `T-0729` 已完成本地修复、回归与 live testnet 验证
  - 症状：create-match 选中大量系统后返回 `0 nodes`
  - 当前结论：主因不是搜索排序，而是 node projection 中绝大多数节点没有有效 `solarSystem`
  - 当前状态：本地 fix 已落地；真实 testnet 回放验证完成，但 testnet 公开位置事件覆盖仍偏低
- `T-0734` 已完成代码实现与本地回归
  - 症状：创建/发布过的比赛只落本地 `runtime-projections.json`，不是后端规范表事实
  - 当前结论：在配置 Supabase service-role 后，当前代码可将 match/team 主数据镜像到后端表，并在冷启动时回填本地投影；本地 Supabase 实例已完成真实写表与 hydrate 验证
  - 当前状态：代码、迁移、真实本地联调与编译回归已完成；剩余仅为远程环境发布/部署验证
- `T-1100 / T-1101` 已完成
  - 症状：独立战队在创建后重启服务，再进入 `/planning` 时 `Current Team Count = 0`
  - 根因：独立战队 registry 只写本地 `runtimeProjectionStore.planningTeams`，没有镜像到后端，也没有冷启动 hydrate
  - 当前结论：独立战队应使用独立的 `planning_teams / planning_team_members` backend mirror，而不是复用比赛内 `teams` 表
  - 当前状态：后端镜像、冷启动 hydrate、migration 与 route/runtime 回归均已完成
- `T-1200 / T-1201 / T-1202 / T-1203 / T-1204` 已完成
  - 症状：独立战队只能直接加入，不支持队长审批、成员退出和队长解散
  - 根因：planning team registry 只有 create/join 两个动作，没有独立申请事实层，也没有对应 API/UI 控制
  - 当前结论：独立战队需要独立的 `planning_team_applications` 事实层，并在 `/planning` 首屏直接提供 captain approval / member leave / captain disband
  - 当前状态：runtime、backend mirror、API、UI 和定向回归均已完成
- `T-2200 / T-2201` 已完成
  - 症状：线上 `POST /api/matches` 在 Vercel 返回 `FUNCTION_INVOCATION_TIMEOUT`
  - 根因：创建草稿前会无条件执行一次全量 backend hydrate，额外扫 `matches / teams / team_members / match_targets / settlements`；随后 draft 持久化又继续串行请求后端
  - 当前结论：创建草稿不需要在请求前把整份 backend projection 回填到本地 runtime；保留直接持久化新 draft 即可
  - 当前状态：已移除 create route 的前置全量 hydrate，给 backend REST 请求加 5s timeout，并补了 route 回归验证“不再请求 `GET /rest/v1/matches?select=*`”；`pnpm build` 已通过

## 7. Exit Criteria

- All linked F-000 wallet regression tasks under test scope passed.
- All linked F-007 pending tasks under test scope passed, including `T-0728` and `T-0729`.
- All linked F-007 pending tasks under test scope passed, including `T-0734`.
- Devnet CLI verification completed and report refreshed.
- No unresolved F-007 blocker remains for the implemented runtime fix; residual product limitation is live-chain location coverage.
- Final verification summary delivered.
