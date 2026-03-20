# SPEC: Fuel Frog Panic (Per Project)

## 0. One-Screen Implementation Summary (Problem / Why / How)

- Problem being implemented:
  - 需要将 Fuel Frog Panic 的“多节点补给协作”做成可执行、可结算、可追溯的项目实现方案。
- Why this scope now:
  - 该玩法是当前 P0 优先项，且已具备明确 PRD 规则（角色分工、奖池来源、结算逻辑、反滥用约束）。
- How architecture solves it (3-step mechanism):
  1. View 仅负责展示房间/节点/贡献状态并采集用户操作。
  2. Controller 编排“建房 -> 入场 -> 对局 -> 结算”与角色行为流程。
  3. Service 落实业务规则并读写 Zustand Model，统一状态与结算结果。
- Expected implementation outcome:
  - 交付 P0 可运行闭环：房间创建、入队与角色锁定、节点补给推进、终局分账、战报可追溯。

## 0.1 PRD Alignment Snapshot

| PRD Feature | User Value | Implementation Strategy |
|---|---|---|
| F-002 | 10-15 分钟内完成可协作补给局 | 以 MissionState + NodeDeficit + ContributionLedger 构建主循环 |
| F-012 | 平台/主办方/玩家分账透明 | SettlementService + Bill DTO + 审计字段输出 |
| F-013 | 实网事件可接入 | Service 预留链上/索引订阅适配层 |
| F-014 | 防刷与公平性 | 规则校验 + 风险标记 + 结算前一致性校验 |

## 1. Document Control

- Project/App: `apps/fuel-frog-panic`
- Related PRD: `docs/prd/fuel-frog-panic/prd.md`
- Version: v1.1
- Status: Draft
- Owner (PM Agent / Architect): Codex
- Last Updated: 2026-03-20
- Related TODO: `apps/fuel-frog-panic/todo.md`
- Related Test Plan: `docs/test-plan/fuel-frog-panic/test-plan.md`

## 2. Scope and Traceability

- Scope summary:
  - 实现 Fuel Frog Panic 的 P0 业务闭环与架构分层接口。
- PRD features covered:
  - F-002: Fuel Frog Panic Core Gameplay
  - F-012: Monetization Engine Integration
  - F-013: Live Frontier Integration (P0 adapter-ready)
  - F-014: Reputation & Anti-abuse Integration (P0 minimal controls)
- Out of scope:
  - P1 动态天气/敌对干扰复杂系统
  - 完整赛季化训练报告中心
- Non-functional targets:
  - Performance: 主循环状态刷新支持 3s UI 刷新节拍
  - Reliability: 关键流程状态迁移可恢复、可重放
  - Security: 参数锁定、重复结算拦截、账单可审计

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
  - 房间大厅、队伍编组、节点地图、角色贡献榜、结算账单展示。
- Inputs (props/state):
  - `roomSummary`, `nodeStatusList`, `teamRoleMap`, `countdown`, `payoutBill`。
- Outputs (events/callbacks):
  - `onCreateRoom`, `onJoinRoom`, `onLockRole`, `onSubmitSupplyRun`, `onSettleRequest`。
- Allowed imports:
  - `controller/*`
- Forbidden imports:
  - `service/*`, `model/*`

### 4.1.1 Screen Contracts (From PRD Section 6.8)

| Screen ID | Route | Required View Module | Required Controller Handler | Acceptance Contract |
|---|---|---|---|---|
| S-001 | `/lobby` | `MissionLobbyPanel` | `onCreateRoom` / `onJoinRoom` | IA-001 |
| S-002 | `/planning` | `RoleLockPanel` | `onLockRole` / `onStartMatch` | IA-002 |
| S-003 | `/match` | `NodeMapPanel` + `ContributionBoard` + `RiskHeatPanel` | `onSubmitSupplyRun` / `onRefresh` | IA-003 / IA-006 |
| S-004 | `/final` | `FinalSprintAlertLayer` | `onSubmitSupplyRun` | IA-004 |
| S-005 | `/settlement` | `SettlementBillPanel` | `onSettle` | IA-005 |

### 4.2 Controller Layer

- Responsibilities:
  - 编排“建房 -> 入队 -> 角色锁定 -> 补给提交 -> 结算触发”流程。
- Public handlers/use-cases:
  - `createFuelRoom(input)`
  - `joinFuelRoom(input)`
  - `lockTeamRoles(input)`
  - `submitSupplyRun(input)`
  - `requestSettlement(input)`
  - `refreshMissionState(input)`
- Input contracts:
  - `CreateRoomInput`, `JoinRoomInput`, `RoleLockInput`, `SupplyRunInput`, `SettleInput`。
- Output contracts:
  - `ControllerResult<T>`（`ok`, `errorCode`, `message`, `payload`）。
- Orchestration sequence:
  - View event -> Controller validate -> Service execute -> Service update Model -> View re-render。
- Allowed imports:
  - `service/*`
- Forbidden imports:
  - `model/*`

### 4.3 Service Layer

- Responsibilities:
  - 业务规则、状态迁移、结算计算、反滥用校验、外部数据适配。
- Service APIs:
  - `initMissionState(roomConfig)`
  - `assignTeamAndRoles(roomState, assignment)`
  - `recordSupplyEvent(event)`
  - `computeNodeScore(nodeSnapshot)`
  - `computeContributionScore(events)`
  - `finalizeSettlement(settleInput)`
  - `buildAuditBill(settlement)`
- Business rules:
  - 开局锁定：`platform_rake_bps`, `host_revshare_bps`, `payout_rule_id`, pool sources。
  - 节点状态不可回退，重复结算与重复领奖拒绝。
  - 分账顺序固定：`gross_pool -> platform_fee -> host_fee -> payout_pool -> member_payouts`。
- Side-effects (network/chain):
  - 预留 `MissionEventGateway` 接入索引/链上事件订阅。
- Idempotency/retry policy:
  - `settlement_id` 幂等；重复提交返回已结算结果。
- Allowed imports:
  - `model/*`
- Forbidden imports:
  - `view/*`, `controller/*`

### 4.4 Model Layer (Zustand)

- Store slices:
  - `roomSlice`, `missionSlice`, `teamSlice`, `scoreSlice`, `settlementSlice`, `riskSlice`
- State schema:
  - `room`: `roomId`, `host`, `status`, `configLockHash`
  - `mission`: `nodeDeficitSnapshot[]`, `countdown`, `phase`
  - `team`: `teams[]`, `rolesLocked`
  - `score`: `teamScore`, `playerContribution`, `nodeScore`
  - `settlement`: `grossPool`, `platformFee`, `hostFee`, `payoutPool`, `memberPayouts`
- Actions/mutations:
  - `setRoom`, `setMissionSnapshot`, `lockRoles`, `appendSupplyEvent`, `setScores`, `setSettlement`
- Selectors:
  - `selectCriticalNodes`, `selectTopContributors`, `selectSettlementBill`
- Persistence/cache strategy:
  - 本地仅缓存非敏感 UI 状态，关键结算结果以服务端/链上为准。
- State transition rules:
  - `LobbyReady -> Planning -> MatchRunning -> FinalSprint -> Settled`

### 4.5 Contract Layer (Sui Move)

- Package path:
  - `apps/fuel-frog-panic/contracts`
- Module:
  - `fuel_frog_panic::fuel_frog_panic`
- On-chain state object:
  - `FuelRoom`（共享对象，包含 phase、funding pools、player contributions、node progress、settlement snapshot）
- Public functions:
  - `create_room(...)`
  - `join_room(room, ctx)`
  - `lock_roles(room, ctx)`
  - `start_match(room, ctx)`
  - `enter_final_sprint(room, ctx)`
  - `submit_supply_event(room, event_key, node_id, contribution_delta, fill_delta_bps, team_id, ctx)`
  - `finalize_settlement(room, ctx)`
  - `update_room_config(room, new_hash, ctx)`（配置锁定后拒绝更新）
- Contract rule mapping:
  - 状态机迁移由 `is_valid_transition` 限制。
  - 事件防重放由 `processed_events` + `E_DUP_SUPPLY_EVENT` 实现。
  - 结算幂等由 `apply_settlement_snapshot` 实现，重复调用不重复记账。
  - 分账公式与 PRD 对齐：`gross -> platform_fee -> host_fee -> payout_pool`。
- Emitted events:
  - `RoomCreated`
  - `PlayerJoined`
  - `RolesLocked`
  - `SupplyRecorded`
  - `SettlementFinalized`

## 5. Data and Error Contracts

- DTO/Type definitions:
  - `NodeDeficitSnapshotDTO`
  - `SupplyEventDTO`
  - `ContributionDTO`
  - `SettlementBillDTO`
- Validation rules:
  - 参数锁定后不可改。
  - `entry_fee_lux > 0`, `player_count` 在 3~8。
  - Pool sources 合计与账单字段一致。
- Error taxonomy:
  - `E_INVALID_STATE_TRANSITION`
  - `E_DUP_SETTLEMENT`
  - `E_DUP_REWARD_CLAIM`
  - `E_ROOM_CONFIG_LOCKED`
  - `E_SCORE_EVENT_INVALID`
- Retry/fallback behavior:
  - 事件拉取失败时保留最近快照，标记 `stale` 并重试。
- Contract versioning policy:
  - DTO 增量字段向后兼容；重大变更通过 `schema_version` 管理。

## 5.1 Runtime Flow and State Machines

- Key use-cases sequence (request -> processing -> response):
  1. CreateRoom -> lock funding params -> room ready
  2. Join/RoleLock -> assignment commit -> planning done
  3. SupplyRun submit -> node/contribution update -> live ranking
  4. Settle -> payout compute -> audit bill publish
- State machine definitions:
  - Entity: `MissionRoomState`
  - Valid transitions:
    - `LobbyReady -> Planning`
    - `Planning -> MatchRunning`
    - `MatchRunning -> FinalSprint`
    - `FinalSprint -> Settled`
  - Invalid transitions handling:
    - 拒绝并记录审计日志，返回错误码与当前状态。

## 6. UI and Interaction Constraints

- Must follow `docs/eve-frontier-ui-style-guide.md`
- Key component states:
  - Lobby, Planning, MatchRunning, FinalSprint, Settled
- Motion/feedback rules:
  - 节点达标、关键路段中断、结算完成需要明显反馈。
- Empty/loading/error states:
  - 数据加载占位、事件延迟提示、结算失败重试提示。
- Accessibility checks:
  - 高对比文本、关键操作键盘可达、倒计时信息可读。

## 7. Test Plan

### Frontend

- Unit tests:
  - Score/settlement 纯函数
  - 状态迁移 reducer/actions
- Integration tests:
  - 建房到结算主流程
  - 异常流程：重复结算、参数锁定后修改、事件延迟
- Manual verification checklist:
  - 角色锁定是否在开局后生效
  - 账单字段是否完整可读
- Critical-path regression checklist:
  - 资金流顺序、节点进度、最终分账一致性

### Contract (If Applicable)

- Must follow `docs/sui-devnet-testing-standard.md`
- Local test commands:
  - `cd apps/fuel-frog-panic/contracts`
  - `sui move test -e testnet`
- Devnet verification commands:
  - `cd apps/fuel-frog-panic`
  - `bash ./scripts/devnet-verify.sh`
- Expected outcomes:
  - 关键结算字段与事件链路可对账
- Security test cases:
  - Replay / duplicate settlement
  - Permission bypass
  - Boundary value checks

## 8. TODO Mapping

- Every interface/feature in this SPEC must map to an actionable item in project `todo.md`.

| TODO ID | Linked Layer | Linked Feature | Linked PRD AC | Description | Status |
|---|---|---|---|---|---|
| T-001 | View | F-002 | AC-001 | Fuel Frog 页面骨架与阶段 UI | Done |
| T-002 | Controller | F-002 | AC-001 | 建房/入队/锁角色控制器 | Done |
| T-003 | Service | F-002 | AC-001 | Mission 初始化与主循环规则 | Done |
| T-004 | Model | F-002 | AC-001 | Zustand slices 与 selectors | Done |
| T-005 | Service | F-002 | AC-003 | 节点评分与贡献计算 | Done |
| T-006 | Service | F-012 | AC-003 | 分账计算与账单生成 | Done |
| T-007 | Controller | F-012 | AC-003 | 结算触发与幂等控制 | Done |
| T-008 | Service | F-013 | AC-002 | 事件网关适配层（stub） | Done |
| T-009 | Service | F-014 | AC-002 | 异常行为风控标记 | Done |
| T-010 | View | F-002/F-012 | AC-002 | 结算页与可解释分账 UI | Done |
| T-016 | Contract | F-013 | AC-002 | Move package scaffold | Done |
| T-017 | Contract | F-002 | AC-001 | FuelRoom 状态机与阶段迁移 | Done |
| T-018 | Contract | F-002/F-014 | AC-002 | 入队、补给提交、防重复事件 | Done |
| T-019 | Contract | F-012 | AC-003 | 分账公式与结算幂等 | Done |
| T-020 | Contract Test | F-002/F-012 | AC-003 | Move unit tests | Done |
| T-021 | Contract Ops | F-013 | AC-002 | devnet 校验脚本 | Done |
| T-025 | View | F-002 | AC-001 | 新增路由与页面壳：lobby/planning/match/final/settlement | Done |
| T-026 | View/Controller | F-002/F-012 | AC-001/003 | 实现 6.8 定义的 UI 组件拆分与 handler 对接 | Done |
| T-027 | Testing | F-002/F-012/F-013 | AC-001/002/003 | 按 IA-001~IA-006 执行前端交互验收 | Todo |
| T-028 | View | F-002 | AC-001 | 路由去前缀并保留兼容跳转 | Done |
| T-029 | View | F-002 | AC-002 | 修复样式链路并校验 token 生效 | Done |

## 9. Delivery Readiness Checklist

- [ ] All PRD features in scope mapped to interfaces.
- [ ] All interfaces mapped to TODO tasks.
- [ ] All TODO tasks have acceptance signals.
- [ ] Risky flows covered by test cases.
