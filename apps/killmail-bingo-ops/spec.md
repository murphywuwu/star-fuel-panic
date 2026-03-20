# SPEC: Killmail Bingo Ops (Per Project)

## 0. One-Screen Implementation Summary (Problem / Why / How)

- Problem being implemented: 将 killmail 事件驱动的 3x3 Bingo 对局做成可运行、可核验、可结算的前端实现方案。
- Why this scope now: 该玩法已在 PRD 定义为 P0 核心功能，需要进入编码与联调阶段。
- How architecture solves it (3-step mechanism):
  1. View 层只负责展示卡面/进度/结算与事件输入。
  2. Controller 层编排开局、事件提交、核验回写、结算流程。
  3. Service 层执行业务规则并通过 Zustand Model 维护唯一前端状态源。
- Expected implementation outcome: 形成可直接编码的接口契约、状态迁移规则、错误合同与 TODO 映射。

## 0.1 PRD Alignment Snapshot

| PRD Feature | User Value | Implementation Strategy |
|---|---|---|
| F-006 | 玩家与小队可围绕 Bingo 目标协作并实时获得反馈 | 实现卡面生成、格子 Pending/Confirmed 迁移、连线/全图结算 |
| F-012 | 房间收费与结算可追踪且可复核 | 固化费用参数、按账单顺序输出 `gross/platform/host/payout` |
| F-013 | 实网事件可用于评分与战报 | 接入 killmail 查询与注册核验，保留审计链路 |
| F-014 | 降低刷分与重复事件风险 | 实施 `killmail_id` 去重、异常回滚与风险降权 |

## 1. Document Control

- Project/App: `apps/killmail-bingo-ops`
- Related PRD: `docs/prd/killmail-bingo-ops/prd.md`
- Version: v1.3
- Status: Draft
- Owner (PM Agent / Architect): Codex
- Last Updated: 2026-03-20
- Related TODO: `apps/killmail-bingo-ops/todo.md`
- Related Test Plan: `apps/killmail-bingo-ops/test-results/2026-03-20-regression.md`

## 2. Scope and Traceability

- Scope summary: 定义 Killmail Bingo Ops 前端分层实现契约，覆盖对局核心、结算账单、事件核验与反滥用。
- PRD features covered:
  - F-006: 卡面生成、事件映射、状态迁移、奖励计算。
  - F-012: buy-in/rake/revshare/payout 结算账单。
  - F-013: killmail 查询与核验回写。
  - F-014: 去重、防刷、异常事件处理。
- Out of scope:
  - P1 赛季卡池运营后台。
  - 社区模板提案审核系统。
  - 完整电竞观战回放。
- Non-functional targets:
  - Performance: 2s UI 刷新节拍；事件确认链路 p95 小于 10s（索引侧可用时）。
  - Reliability: 单局关键状态迁移无重复结算；前端重连后状态可恢复。
  - Security: 禁止非法状态迁移、重复 killmail 命中多格、重复领奖。

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
  - 渲染房间大厅、Bingo 卡、Pending/Confirmed 状态、连线提示、结算账单。
  - 接收用户动作（创建房间、开始对局、上报 killmail、领取奖励、分享战报）。
- Inputs (props/state):
  - `roomViewState`, `bingoBoardViewState`, `settlementViewState`, `riskFlagViewState`。
- Outputs (events/callbacks):
  - `onCreateRoom`, `onStartMatch`, `onSubmitKillmail`, `onClaimReward`, `onShareReport`。
- Allowed imports:
  - `controller/killmailBingoController`。
- Forbidden imports:
  - `service/*`, `model/*`。

### 4.2 Controller Layer

- Responsibilities:
  - 将 UI 事件转化为 use-case 调用序列。
  - 管控请求节流、并发提交保护、页面离开/重连恢复触发。
- Public handlers/use-cases:
  - `createRoom(input)`
  - `startMatch(roomId)`
  - `submitKillmailEvent(matchId, killmailRef)`
  - `claimSettlement(pilotId)`
  - `refreshMatchState(matchId)`
- Input contracts:
  - `createRoom`: `entryFee`, `templatePoolId`, `difficulty`, `partyMembers`。
  - `submitKillmailEvent`: `killmailId`, `actorId`, `slotHint?`, `occurredAt`。
- Output contracts:
  - `Result<OkPayload, DomainError>`，统一映射 UI 状态与 toast 错误码。
- Orchestration sequence:
  1. 校验 UI 输入（空值、重复点击、状态前置条件）。
  2. 调用 Service 执行核心逻辑。
  3. 基于返回结果更新 UI 路由与交互状态。
- Allowed imports:
  - `service/killmailBingoService`。
- Forbidden imports:
  - `model/*`。

### 4.3 Service Layer

- Responsibilities:
  - 业务规则与副作用唯一所有者。
  - 通过 `kboContractGateway` 接入链上状态机语义并完成数据归一化。
- Service APIs:
  - `initializeMatch(roomConfig): Promise<MatchSnapshot>`
  - `ingestKillmail(event): Promise<SlotUpdateResult>`
  - `refreshMatchState(): MatchSnapshot`
  - `finalizeSettlement(matchId): Promise<SettlementBill>`
  - `claimSettlement(pilotId): Promise<ClaimResult>`
  - `loadReport(matchId): Promise<BattleReport>`
- Business rules:
  - 同一 `killmail_id` 仅允许命中一个 `slot_id`。
  - 仅允许 `Pending -> Confirmed` 正向迁移；冲突事件触发回滚记录。
  - 结算前必须收敛 `GraceWindow` 内待确认事件。
  - 风险评分超阈值时触发 `riskFlag`，并取消高倍率 bonus。
- Side-effects (network/chain):
  - 查询 killmail 索引数据。
  - 调用 `kbo_registry` 适配层接口（`create/start/submit/grace/settle/claim/snapshot`）。
  - 拉取/提交结算结果（含账单拆分字段）。
- Idempotency/retry policy:
  - `ingestKillmail` 以 `killmail_id` 作为幂等键，重复提交返回已处理结果。
  - 网络失败按 `exponential backoff (max 3)` 重试；超过阈值写入 `retry_exhausted` 错误。
  - `finalizeSettlement` 使用 `matchId + settlementEpoch` 防重入。
- Allowed imports:
  - `model/killmailBingoStore`。
- Forbidden imports:
  - `view/*`, `controller/*`。

### 4.4 Model Layer (Zustand)

- Store slices:
  - `roomSlice`, `boardSlice`, `eventSlice`, `settlementSlice`, `riskSlice`。
- State schema:
  - `matchPhase: LobbyReady | CardDrafted | MatchRunning | GraceWindow | Settled`
  - `boardSlots: Array<{ slotId, status, weight, verificationRuleId, confirmedKillmailId? }>`
  - `pendingEvents`, `confirmedEvents`, `rejectedEvents`
  - `billing: { grossPool, platformFee, hostFee, payoutPool, rankPayouts }`
- Actions/mutations:
  - `setMatchPhase`, `upsertPendingEvent`, `confirmSlot`, `rejectEvent`, `setSettlementBill`, `setRiskFlag`。
- Selectors:
  - `selectLineCount`, `selectBlackout`, `selectTeamScore`, `selectPendingAging`, `selectSettlementReady`。
- Persistence/cache strategy:
  - 进行中对局使用 session 级本地缓存（key: `matchId`），页面刷新后恢复。
- State transition rules:
  - 仅允许定义内迁移；非法迁移记录 `invalid_transition` 并拒绝变更。

### 4.5 Contract Layer (Sui Move)

- Package path:
  - `apps/killmail-bingo-ops/contracts`
- Module:
  - `killmail_bingo_ops::kbo_registry`
- On-chain responsibilities:
  - 对局状态机：`LobbyReady -> MatchRunning -> GraceWindow -> Settled`
  - 费用账本：`gross_pool / platform_fee / host_fee / payout_pool`
  - 反滥用：`killmail_id` 去重、重复 `claim` 防重放、风险降权入口
- Core contract APIs:
  - `create_match`
  - `start_match`
  - `submit_killmail`
  - `open_grace_window`
  - `apply_risk_penalty`
  - `settle_match`
  - `claim_settlement`
- Contract test coverage:
  - happy path
  - duplicate killmail expected failure
  - claim replay expected failure
  - risk penalty bonus disable path

## 5. Data and Error Contracts

- DTO/Type definitions:
  - `KillmailEventDTO`, `SlotVerificationResultDTO`, `SettlementBillDTO`, `RiskAssessmentDTO`。
- Validation rules:
  - `killmailId` 非空且符合链上事件 ID 格式。
  - `entryFee > 0` 且费用参数满足 PRD 安全边界。
  - `slotId` 必须属于当前 `card_hash` 对应卡面。
- Error taxonomy:
  - `E_INVALID_INPUT`
  - `E_DUPLICATE_KILLMAIL`
  - `E_VERIFICATION_TIMEOUT`
  - `E_INVALID_STATE_TRANSITION`
  - `E_SETTLEMENT_REPLAY`
  - `E_PERMISSION_DENIED`
  - `E_MATCH_NOT_FOUND`
  - `E_CHAIN_UNAVAILABLE`
- Retry/fallback behavior:
  - 索引读取失败回退到延迟重试并显示 Pending。
  - 核验超时时事件留在 Pending 区，不计入结算。
- Contract versioning policy:
  - DTO 增量字段采用向后兼容策略；破坏性修改需 bump `spec_contract_version`。

## 5.1 Runtime Flow and State Machines

- Key use-cases sequence (request -> processing -> response):
  1. `createRoom` -> 固化费率/模板池 -> 返回 `LobbyReady`。
  2. `startMatch` -> 生成并锁定 `card_hash` -> 切到 `CardDrafted/MatchRunning`。
  3. `submitKillmailEvent` -> 去重校验 -> 进入 Pending -> 核验通过后点亮。
  4. 进入 `GraceWindow` 收敛未确认事件 -> `finalizeSettlement` -> `Settled`。
- State machine definitions:
  - Entity: `MatchSession`
  - Valid transitions:
    - `LobbyReady -> CardDrafted`
    - `CardDrafted -> MatchRunning`
    - `MatchRunning -> GraceWindow`
    - `GraceWindow -> Settled`
  - Invalid transitions handling:
    - 非法跳转直接拒绝并落审计日志，不改变 Model 状态。

## 6. UI and Interaction Constraints

- Must follow `docs/eve-frontier-ui-style-guide.md`
- Key component states:
  - 卡格状态：`Idle | Pending | Confirmed | Rejected`
  - 对局状态：`Waiting | Running | GraceWindow | Settled`
- Motion/feedback rules:
  - Pending -> Confirmed 采用短时高亮反馈；拒绝事件给予可解释错误提示。
- Empty/loading/error states:
  - 空数据：引导创建/加入房间。
  - 加载中：展示核验队列与预计等待。
  - 错误：错误码 + 重试入口。
- Accessibility checks:
  - 关键状态不只依赖颜色表达；为状态标签提供文字与图标双通道。

### 6.1 Implemented Screen Contracts (S-001 ~ S-004)

- S-001 Tactical Lobby & Match Briefing:
  - 模块：Mission Card Preview / Fee Breakdown / Squad Readiness Matrix。
  - 关键动作：`onCreateRoom`、`onStartMatch`、`onRefreshMatchState`。
- S-002 Bingo Combat Command Deck:
  - 模块：3x3 卡面、事件流、对局控制面板。
  - 关键动作：`onSubmitKillmail`、`onOpenGraceWindow`、`onFinalizeSettlement`。
- S-003 Event Verification Console:
  - 模块：Pending 队列、事件详情、重查入口。
  - 关键动作：`onRefreshMatchState`（重查），Confirm/Reject 由 registry 自动裁决。
- S-004 Settlement & Battle Report:
  - 模块：账单账本、贡献榜、战报列表、领奖与再开局 CTA。
  - 关键动作：`onClaimSettlement`、`onCreateRoom`（Re-Queue）、`onShareReport`。
- Runtime selector stability:
  - `useKillmailBingoViewState` 必须使用 shallow 缓存 selector 输出，避免 `getServerSnapshot` 循环告警。

## 7. Test Plan

### Frontend

- Unit tests:
  - Service 去重、状态迁移、结算公式与边界费率。
- Integration tests:
  - Controller 到 Service 的完整开局->上报->结算链路。
- Manual verification checklist:
  - 多成员并发提交同一 killmail 的处理一致性。
  - GraceWindow 到 Settled 的收敛行为。
- Critical-path regression checklist:
  - 费用拆分正确性。
  - 非法状态迁移拦截。

### Contract (If Applicable)

- Must follow `docs/sui-devnet-testing-standard.md`
- Local test commands:
  - `cd apps/killmail-bingo-ops/contracts`
  - `sui move test -e testnet`
- Devnet verification commands:
  - `sui client envs`
  - `sui client switch --env devnet`
  - `sui client active-address`
  - `sui client gas`
  - `sui client test-publish --build-env devnet --gas-budget 100000000`
- Expected outcomes:
  - 单测通过（重复 killmail / 重复 claim 拦截生效）。
  - devnet 环境查询与切换命令成功。
  - publish 若失败需记录具体网络或资金前置条件。
- Security test cases:
  - Replay / duplicate settlement
  - Permission bypass
  - Boundary value checks

## 8. TODO Mapping

- Every interface/feature in this SPEC must map to an actionable item in project `todo.md`.

| TODO ID | Linked Layer | Linked Feature | Linked PRD AC | Description | Status |
|---|---|---|---|---|---|
| T-001 | Model | F-006 | AC-001 | 建立 Zustand `MatchSession`/`Board`/`Event`/`Settlement` 状态与迁移动作 | Done |
| T-002 | Service | F-006 | AC-003 | 实现 `ingestKillmail` 去重、Pending/Confirmed 迁移与核验结果落库 | Done |
| T-003 | Service | F-012 | AC-002 | 实现结算账单拆分与 `SettlementBillDTO` 输出 | Done |
| T-004 | Controller | F-006 | AC-001 | 实现开局、事件提交、结算触发用例编排 | Done |
| T-005 | View | F-006 | AC-001 | 实现 Bingo 卡面、状态反馈、连线提示组件 | Done |
| T-006 | View | F-012 | AC-002 | 实现战报页与奖励明细展示、分享入口 | Done |
| T-007 | Service | F-013 | AC-003 | 接入 killmail 索引查询 + registry 核验回写 | Done (gateway-backed verification path) |
| T-008 | Service | F-014 | AC-004 | 实现反滥用规则：重复事件拦截与风险标记 | Done |
| T-009 | Controller | F-014 | AC-004 | 实现异常态 UI 映射与回滚触发 | Done |
| T-010 | Test | F-006/F-012/F-013/F-014 | AC-001/2/3/4 | 建立关键路径测试与 devnet 验证清单 | Done |
| T-016 | Contract | F-013 | AC-003 | 创建 Move 包与 `Move.toml` | Done |
| T-017 | Contract | F-006/F-012 | AC-001/2 | 实现 `kbo_registry` 状态机与账本 | Done |
| T-018 | Contract | F-013/F-014 | AC-003/4 | 实现去重与防重放 | Done |
| T-019 | Contract Test | F-013 | AC-003/4 | `sui move test -e testnet`（4 tests） | Done |
| T-020 | Contract Devnet | F-013 | AC-003 | 执行 `verify-devnet.sh` 并记录 test-publish 成功结果（digest/package） | Done |
| T-021 | Service/Contract | F-013 | AC-003 | 新增 `kboContractGateway`，对齐合约状态机与错误合同 | Done |
| T-022 | Service/Model | F-006/F-012/F-013 | AC-001/2/3 | 重构 Service 接入网关并同步 `matchId/phase/settlement` | Done |
| T-023 | Test | F-013/F-014 | AC-003/4 | 新增网关测试覆盖重复 killmail 与重复 claim | Done |
| T-024 | Test/Docs | F-006/F-012/F-013/F-014 | AC-001/2/3/4 | 执行 typecheck/test 并同步回归证据 | Done |
| T-025 | View | F-006 | AC-001 | 实现 S-001 大厅三栏布局与就绪门禁开局 | Done |
| T-026 | View | F-006/F-014 | AC-001/4 | 实现 S-002/S-003 战斗面板、事件流与核验控制台 | Done |
| T-027 | View | F-012 | AC-002 | 实现 S-004 结算账单、贡献榜、战报与再开局 CTA | Done |
| T-028 | Service/Model | F-006/F-014 | AC-001/4 | 落地格子 `Pending/Rejected` 状态写入与视图聚合字段 | Done |
| T-029 | Test/Docs | F-006/F-012/F-014 | AC-001/2/4 | 执行 `pnpm run typecheck` + `pnpm run test` 并同步文档 | Done |
| T-030 | Model/Service | F-006 | AC-001 | 修复 view selector 快照稳定性（`useShallow`）避免 SSR 循环告警 | Done |

## 9. Delivery Readiness Checklist

- [x] All PRD features in scope mapped to interfaces.
- [x] All interfaces mapped to TODO tasks.
- [x] All TODO tasks have acceptance signals.
- [x] Risky flows covered by test cases.
