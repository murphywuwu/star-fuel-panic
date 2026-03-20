# SPEC: Scrap Relay (State Machine & Settlement Module)

## 0. One-Screen Implementation Summary (Problem / Why / How)

- Problem being implemented:
  - 需要把 `Scrap Relay` 的状态机与结算链路落成可实现、可测试、可审计的工程契约，避免“规则写在 PRD 里但实现边界不清”。
- Why this scope now:
  - 状态迁移合法性、结算顺序、贡献分配是 P0 演示与后续扩展的关键风险点，必须优先收敛接口与错误契约。
- How architecture solves it (3-step mechanism):
  1. View 只做状态展示和交互事件采集。
  2. Controller 编排“状态迁移请求 -> 结算请求”用例。
  3. Service 执行业务校验并写入 Zustand Model，统一输出账单与错误码。
- Expected implementation outcome:
  - 形成一条可复用的对局状态机与结算模块实现蓝图，支持前端一致渲染、合约集成、测试回归。

## 0.1 PRD Alignment Snapshot

| PRD Feature | User Value | Implementation Strategy |
|---|---|---|
| F-007 Scrap Relay Core Gameplay | 团队在 15 分钟内形成可复盘胜负 | 实现对局状态机、蓝图步骤推进、阻塞识别、进度与贡献累计 |
| F-012 Monetization Engine Integration | 费用和分账透明、可解释 | 实现统一结算服务，按 `gross -> platform -> host -> payout -> member` 顺序输出账单 |
| F-013 Live Frontier Integration | 关键结果可查、可验证 | 约束关键事件写链与链下状态一致性校验接口 |
| F-014 Reputation & Anti-abuse Integration | 抑制刷分与异常对局 | 预留风控标记和信誉评分写入接口，定义异常拦截错误码 |

## 1. Document Control

- Project/App: `apps/scrap-relay`
- Related PRD: `docs/prd/scrap-relay/prd.md`
- Version: v1.0
- Status: Draft
- Owner (PM Agent / Architect): Codex
- Last Updated: 2026-03-20
- Related TODO: `apps/scrap-relay/todo.md`
- Related Test Plan: `docs/test-plan/scrap-relay/test-plan.md`

## 2. Scope and Traceability

- Scope summary:
  - 交付 `Scrap Relay` P0 所需状态机与结算模块规格：状态定义、迁移规则、接口契约、错误契约、重试/幂等策略、验收映射。
  - 交付合约层 Move 包（房间状态机、结算、反滥用）的可实现接口与目录规范。
- PRD features covered:
  - F-007: 状态机、步骤推进、贡献记录、超时分段结算
  - F-012: buy-in 与分账链路、账单字段、上限约束
  - F-013: 关键事件落链接口与一致性校验
  - F-014: 异常行为标记与反滥用拦截位
- Out of scope:
  - P1 的替代蓝图复杂分支策略优化
  - 跨玩法统一赛季排行与电竞回放
- Non-functional targets:
  - Performance: 前端状态刷新节奏 3s；服务层结算计算在单房间 < 300ms（不含链确认）
  - Reliability: 结算请求至少一次投递 + 幂等去重；重复提交不产生重复派奖
  - Security: 禁止非法状态迁移、越序步骤提交、越权结算

## 3. Architecture Compliance

- Must follow `docs/architecture.md`
- Mandatory dependency flow: `View -> Controller -> Service -> Model`
- Model implementation: Zustand only
- Boundary checks:
  - View must not import Service/Model directly
  - Controller must not import Model directly
  - Service must be side-effect owner

## 4. Layer Interface Contracts

### 4.1 View Layer

- Responsibilities:
  - 展示房间阶段、蓝图 DAG 进度、阻塞步骤、角色贡献、账单明细。
  - 上报用户意图：锁定角色、提交步骤、触发结算确认。
- Inputs (props/state):
  - `roomState`, `blueprintState`, `contributionBoard`, `settlementPreview`, `errorBanner`
- Outputs (events/callbacks):
  - `onLockRole(role)`, `onSubmitStep(stepId, materialPayload)`, `onRequestSettle()`
- Allowed imports:
  - `controller/scrapRelayController`
- Forbidden imports:
  - `service/*`, `model/*`

### 4.2 Controller Layer

- Responsibilities:
  - 接收 View 事件并编排业务调用顺序。
  - 将服务层领域错误映射为 UI 可读状态。
- Public handlers/use-cases:
  - `enterRoleLockHandler()`
  - `lockRoleHandler(input)`
  - `startRelayHandler()`
  - `submitBlueprintStepHandler(input)`
  - `heartbeatTickHandler()`
  - `requestSettlementHandler(input)`
  - `claimRewardHandler(input)`
  - `restartMatchHandler()`
- Input contracts:
  - `EnterRoleLockInput { roomId, requestId }`
  - `LockRoleInput { roomId, playerId, role, requestId }`
  - `StartRelayInput { roomId, requestId }`
  - `SubmitStepInput { roomId, playerId, stepId, materials, requestId }`
  - `SettleInput { roomId, requestId }`
  - `ClaimRewardInput { roomId, playerId, requestId }`
- Output contracts:
  - `ControllerResult<T> = { ok: boolean, data?: T, error?: DomainError }`
- Orchestration sequence:
  1. 校验输入参数完整性。
  2. 调用 Service 进行领域校验和状态迁移。
  3. 接收结果并派发 `viewState` 更新。
- Allowed imports:
  - `service/scrapRelayService`
- Forbidden imports:
  - `model/*`

### 4.3 Service Layer

- Responsibilities:
  - 持有状态机迁移规则、蓝图步骤合法性校验、贡献计分和结算计算。
  - 作为链上写入和外部依赖调用唯一入口。
- Service APIs:
  - `transitionRoomState(input): TransitionResult`
  - `commitBlueprintStep(input): StepCommitResult`
  - `computeContribution(roomId): ContributionSnapshot`
  - `evaluateAntiAbuse(input): AntiAbuseResult`
  - `buildSettlementBill(roomId): SettlementBill`
  - `finalizeSettlement(input): SettlementResult`
  - `claimReward(input): ClaimRewardResult`
  - `restartMatch(): void`
- Business rules:
  - 只允许合法迁移：`LobbyReady -> RoleLock -> RelayRunning -> Overtime -> Settled`。
  - `Settled` 为终态，禁止回迁。
  - 越序提交、缺料提交、重复步骤提交均拒绝。
  - 结算顺序强制为：`gross_pool -> platform_fee -> host_fee -> payout_pool -> member_payouts`。
  - 费用上限：`platform_rake_bps <= 1500`；`host_revshare_bps <= 6000`。
- Side-effects (network/chain):
  - 写链：关键步骤提交事件、终局结算摘要。
  - 读链/索引：房间账本一致性校验。
- Idempotency/retry policy:
  - 所有写入 API 要求 `requestId`；重复 `requestId` 返回首次结果。
  - 链写失败按指数退避重试最多 3 次；超过上限落入 `SettlementPending`（可恢复）队列。
- Allowed imports:
  - `model/scrapRelayStore`
- Forbidden imports:
  - `view/*`, `controller/*`

### 4.4 Model Layer (Zustand)

- Store slices:
  - `roomSlice`: 房间阶段与时间轴
  - `blueprintSlice`: DAG 步骤状态与阻塞原因
  - `contributionSlice`: 玩家贡献积分与占比
  - `settlementSlice`: 账单明细与领奖状态
- State schema:
  - `roomState: LobbyReady | RoleLock | RelayRunning | Overtime | Settled`
  - `timers: { roleLockDeadline, relayDeadline, overtimeDeadline }`
  - `bill: { grossPool, platformFee, hostFee, payoutPool, rankPayouts, memberPayouts }`
- Actions/mutations:
  - `setRoomState`, `applyStepCommit`, `setBlockedSteps`, `setContributionSnapshot`, `setSettlementBill`, `markRewardClaimed`
- Selectors:
  - `selectCurrentExecutableSteps`
  - `selectTopBlockedStep`
  - `selectPlayerContributionRatio(playerId)`
  - `selectSettlementExplainableRows`
- Persistence/cache strategy:
  - 房间内存态 + 关键结算快照本地持久化（session）。
- State transition rules:
  - 所有状态迁移仅允许通过 Service action 触发。
  - `markRewardClaimed` 仅在 `Settled` 且对应成员未领取时可执行。

## 5. Data and Error Contracts

- DTO/Type definitions:
  - `BlueprintStep { stepId, requiredTypeId, requiredQty, dependencySteps[] }`
  - `MaterialCommitPayload { typeId, qty, sourceRef }[]`
  - `SettlementBill { grossPool, platformFee, hostFee, payoutPool, teamPayouts[], memberPayouts[] }`
- Validation rules:
  - 材料数量必须 > 0 且在房间材料池映射内。
  - 步骤提交前，所有 `dependencySteps` 必须 `completed`。
  - 结算前要求 `roomState in {RelayRunning, Overtime}` 且满足终局条件。
- Error taxonomy:
  - `E_STATE_TRANSITION_INVALID`
  - `E_BLUEPRINT_DEPENDENCY_UNMET`
  - `E_MATERIAL_NOT_ALLOWED`
  - `E_SETTLEMENT_DUPLICATED`
  - `E_PERMISSION_DENIED`
  - `E_CHAIN_WRITE_FAILED`
  - `E_ANTI_ABUSE_FLAGGED`
- Retry/fallback behavior:
  - `E_CHAIN_WRITE_FAILED` 触发可恢复重试队列。
  - `E_SETTLEMENT_DUPLICATED` 返回首次账单，不重复发奖。
- Contract versioning policy:
  - 采用 `semver`：破坏性字段变更提升主版本号。

## 5.1 Runtime Flow and State Machines

- Key use-cases sequence (request -> processing -> response):
  1. `enterRoleLock`：从 Lobby 进入 RoleLock 阶段，锁定前置房间参数。
  2. `lockRole`：请求锁角 -> 校验房间与角色配额 -> 更新 `roomSlice`。
  3. `startRelay`：将状态从 `RoleLock` 推进到 `RelayRunning`。
  4. `submitStep`：请求提交步骤 -> 校验依赖与材料 -> 更新进度与贡献。
  5. `heartbeatTick`：周期节拍 -> 识别阻塞与超时 -> 推进 `RelayRunning/Overtime`。
  6. `requestSettlement`：触发结算 -> 计算账单与分配 -> 写链并固化 `Settled`。
  7. `claimReward`：结算后按玩家身份更新领取状态；已领取或无奖励时拒绝重复操作。
  8. `restartMatch`：清理运行态快照并回到 LobbyReady 开始新一局。
- State machine definitions:
  - Entity: `ScrapRelayRoom`
  - Valid transitions:
    - `LobbyReady -> RoleLock`
    - `RoleLock -> RelayRunning`
    - `RelayRunning -> Overtime`
    - `RelayRunning -> Settled`（提前完工）
    - `Overtime -> Settled`
  - Invalid transitions handling:
    - 非法迁移返回 `E_STATE_TRANSITION_INVALID`，记录审计日志并拒绝写链。

## 6. UI and Interaction Constraints

- Must follow `docs/eve-frontier-ui-style-guide.md`
- Key component states:
  - 房间阶段条、蓝图 DAG 卡片、阻塞告警条、贡献排行榜、结算账单弹层
- Motion/feedback rules:
  - 阶段切换时必须有明确状态跳变反馈；阻塞解除时即时反馈
- Empty/loading/error states:
  - 无步骤可执行、链写中、结算失败重试中需有独立可视态
- State microcopy contract:
  - 必须覆盖 `ROOM_LIST_LOADING`、`WALLET_DISCONNECTED`、`ROLE_LOCK_CONFLICT`、`STEP_BLOCKED`、`ILLEGAL_SUBMIT`、`SETTLEMENT_PENDING`、`SETTLEMENT_FAILED`
- Layout contract:
  - 全局 UI 采用 `Top Command Bar + Main Tactical Workspace + Bottom Action Rail`
- Accessibility checks:
  - 关键状态文本对比度可读，结算表格支持键盘聚焦浏览

## 7. Test Plan

### Frontend

- Unit tests:
  - 状态机迁移校验、结算公式、贡献分配权重边界
- Integration tests:
  - `lockRole -> submitStep -> settle` 主路径
  - 越序步骤、重复结算、链写失败重试路径
- Manual verification checklist:
  - 15 分钟内可完成完整一局并看到贡献占比与账单明细
- Critical-path regression checklist:
  - 终态不可回迁
  - 同 `requestId` 不重复派奖

### Contract (If Applicable)

- Must follow `docs/sui-devnet-testing-standard.md`
- Local test commands:
  - `sui move test -e testnet`（避免受 active devnet publish 环境映射校验影响）
- Devnet verification commands:
  - `sui client publish --gas-budget <budget>`
  - `sui client test-publish --gas-budget <budget> --dry-run --build-env devnet`（publish 不可用时的兜底）
  - `sui client call --package <package_id> ...`
  - `npm run test:devnet`（封装 `switch/envs/move test/publish + fallback`）
- Expected outcomes:
  - 步骤提交和结算事件可查询，账单字段与前端一致
- Security test cases:
  - Replay / duplicate settlement
  - Permission bypass
  - Boundary value checks

### Contract Module Design (Implemented)

- Package path:
  - `apps/scrap-relay/contracts/Move.toml`
  - `apps/scrap-relay/contracts/sources/relay.move`
- Module:
  - `scrap_relay::relay`
- Implemented entry functions:
  - `create_room`
  - `lock_role`
  - `start_relay`
  - `commit_step`
  - `heartbeat_tick`
  - `finalize_settlement`
- Implemented contract rules:
  - state machine guard (`LobbyReady -> RoleLock -> RelayRunning -> Overtime -> Settled`)
  - sender/host permission guard（`lock_role`/`commit_step` 绑定 sender，`start_relay`/`finalize_settlement` 限 host）
  - blueprint dependency/material checks
  - settlement fee order and caps
  - requestId idempotency
  - anti-abuse evaluation and flag/error path
  - local Move unit tests for anti-abuse and blueprint dependency template

## 8. TODO Mapping

- Every interface/feature in this SPEC must map to an actionable item in project `todo.md`.

| TODO ID | Linked Layer | Linked Feature | Linked PRD AC | Description | Status |
|---|---|---|---|---|---|
| T-001 | Model | F-007 | AC-001 | 定义房间状态机与迁移守卫（Zustand） | Done |
| T-002 | Service | F-007 | AC-003 | 实现蓝图依赖与材料校验服务 | Done |
| T-003 | Service | F-007 | AC-002 | 实现贡献计分与阻塞识别快照 | Done |
| T-004 | Service | F-012 | AC-003 | 实现结算账单计算与分账顺序 | Done |
| T-005 | Controller | F-007 | AC-001 | 编排锁角/提交步骤/结算请求处理器 | Done |
| T-006 | View | F-007 | AC-002 | 实现阶段态、阻塞态、贡献看板 UI 契约 | Done |
| T-007 | Service | F-013 | AC-003 | 对接链上步骤/结算事件写入与校验接口 | Done |
| T-008 | Service | F-014 | AC-004 | 增加反滥用校验与审计错误码 | Done |
| T-009 | Test | F-007/F-012 | AC-001~AC-004 | 覆盖主路径与异常路径的测试与回归清单 | Done |
| T-013 | Contract | F-007 | AC-001/AC-003 | 初始化 Move 合约工程（Move.toml + sources） | Done |
| T-014 | Contract | F-007 | AC-001/AC-003 | 实现房间状态机与蓝图提交（依赖校验） | Done |
| T-015 | Contract | F-012/F-013 | AC-003 | 实现结算账单与 requestId 幂等 | Done |
| T-016 | Contract | F-014 | AC-004 | 实现反滥用规则与错误码 | Done |
| T-017 | Contract/Test | F-013 | AC-003 | 补充合约 README 与 devnet 命令说明 | Done |
| T-018 | Controller/Service | F-007 | AC-001/AC-002 | 增加前端流程处理器（enter/start/claim/restart） | Done |
| T-019 | View | F-007 | AC-001 | 实现 S-001 Command Lobby 与加载/断连状态 | Done |
| T-020 | View | F-007 | AC-001/AC-002 | 实现 S-002 Role Lock（可访问性与冲突提示） | Done |
| T-021 | View | F-007 | AC-002 | 实现 S-003 Tactical Console 与阻塞/非法提交状态 | Done |
| T-022 | View | F-012 | AC-003 | 实现 S-004 Settlement Debrief 与领奖闭环 | Done |
| T-023 | View | F-007/F-012 | AC-001~AC-003 | 落地统一壳层与状态文案矩阵（PRD 6.8/6.9） | Done |
| T-024 | Test | F-007/F-012 | AC-001~AC-003 | 执行前端 typecheck/build 回归 | Done |

## 9. Delivery Readiness Checklist

- [x] All PRD features in scope mapped to interfaces.
- [x] All interfaces mapped to TODO tasks.
- [x] All TODO tasks have acceptance signals.
- [x] Risky flows covered by test cases.
