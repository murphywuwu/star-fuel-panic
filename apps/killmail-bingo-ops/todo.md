# TODO: Killmail Bingo Ops (Per Project)

## 0. One-Screen Execution Summary (Problem / Why / How)

- Problem this execution batch solves: 当前缺少可直接落地的实现任务拆解，无法进入稳定开发节奏。
- Why these tasks now: SPEC 已定义接口与边界，需要将其转成可勾选、可验证的执行清单。
- How we solve it (critical 3-step execution path):
  1. 先打通 Model + Service 核心状态与业务规则。
  2. 再接 Controller + View 完成玩家主流程。
  3. 最后补测试与回归，固化交付证据。
- Expected delivery outcome: 形成可按关键路径执行的 P0 开发任务板，支持编码与测试协同。

## 0.1 Before vs After (Execution Value)

| Dimension | Before | After |
|---|---|---|
| Delivery clarity | 功能需求存在但任务粒度不足 | 每个任务绑定 Feature/Layer/AC 与验收信号 |
| Delivery speed | 开发顺序不明确 | 关键路径先行，依赖关系清晰 |
| Delivery confidence | 测试与回归范围模糊 | 任务内置测试/命令/状态验收标准 |

## 1. Document Control

- Project/App: `apps/killmail-bingo-ops`
- Related PRD: `docs/prd/killmail-bingo-ops/prd.md`
- Related SPEC: `apps/killmail-bingo-ops/spec.md`
- Version: v1.0
- Owner: Codex
- Last Updated: 2026-03-20

## 2. Task Board

| TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|
| T-001 | F-006 | 4.4 | Model | 建立 Zustand `room/board/event/settlement/risk` 五个 slice 与 typed selectors | 确保状态单一来源与后续接口稳定 | - | Store 类型检查通过；可驱动基础状态切换 Demo | Done |
| T-002 | F-006 | 5.1 | Model | 实现 `MatchSession` 状态机迁移守卫（含非法迁移拒绝） | 防止流程跳步导致结算错误 | T-001 | 非法迁移触发 `E_INVALID_STATE_TRANSITION` 并记录日志 | Done |
| T-003 | F-006 | 4.3 | Service | 实现 `initializeMatch`：锁定模板、生成 `card_hash`、写入初始账本 | 完成开局关键前置 | T-001 | 返回 `LobbyReady/CardDrafted` 快照且字段完整 | Done |
| T-004 | F-006/F-013 | 4.3,5 | Service | 实现 `ingestKillmail` 去重与 Pending->Confirmed 核验流 | 保证点亮逻辑可追溯且防重复刷分 | T-001,T-002 | 同一 `killmail_id` 二次提交返回幂等结果；核验通过点亮单格 | Done |
| T-005 | F-012 | 4.3,5 | Service | 实现 `finalizeSettlement` 与账单拆分（gross/platform/host/payout） | 确保商业化结算链路可复核 | T-003,T-004 | 输出 `SettlementBillDTO`，且总额守恒校验通过 | Done |
| T-006 | F-014 | 4.3,5 | Service | 实现风险评分与异常事件降权策略 | 控制对刷/刷分风险 | T-004 | 命中风险规则后写入 `riskFlag` 且不进入高倍率池 | Done |
| T-007 | F-006 | 4.2 | Controller | 实现 `createRoom/startMatch` handler 与输入校验 | 连接 UI 与核心服务开局链路 | T-003 | UI 触发后状态正确进入 `MatchRunning` | Done |
| T-008 | F-006/F-014 | 4.2 | Controller | 实现 `submitKillmailEvent/refreshMatchState` 编排与错误映射 | 保证并发提交下的交互可用性 | T-004,T-006 | 重复点击节流生效；错误码映射到可读提示 | Done |
| T-009 | F-012 | 4.2 | Controller | 实现 `claimSettlement` 与重放保护流程 | 防止重复领奖与账单不一致 | T-005 | 重复领取返回 `E_SETTLEMENT_REPLAY` | Done |
| T-010 | F-006 | 4.1,6 | View | 开发 Bingo 卡面、格子状态、连线反馈组件 | 提供核心玩法视觉与操作入口 | T-007,T-008 | UI 显示 Idle/Pending/Confirmed/Rejected 四态 | Done |
| T-011 | F-012 | 4.1,6 | View | 开发结算页：贡献分、账单拆分、奖励明细 | 完成结果呈现与用户理解闭环 | T-005,T-009 | 账单四段金额与 Service 输出一致 | Done |
| T-012 | F-006/F-013 | 4.1,6 | View | 开发战报页与分享入口（含未确认事件区） | 支撑传播与复盘场景 | T-004,T-011 | 可展示 `killmail_id -> slot_id -> settlement_id` 追踪链 | Done |
| T-013 | F-006/F-012/F-014 | 7 | Test | 补单元测试：去重、状态机、结算公式、费率边界 | 提前发现关键逻辑回归 | T-002,T-004,T-005,T-006 | `pnpm run test` 通过（3 tests） | Done |
| T-014 | F-013 | 7 | Test | 建立联调脚本：索引查询 + registry 核验 + devnet 命令清单 | 提供实网可验证证据 | T-004 | `scripts/devnet-verify.sh` 执行通过；`devnet` 环境切换成功（无 Move.toml 时跳过 `sui move test`） | Done |
| T-015 | F-006/F-012/F-013/F-014 | 7 | Test | 执行关键路径回归：开局->点亮->GraceWindow->结算->领奖 | 验证端到端交付质量 | T-010,T-011,T-012,T-013,T-014 | 回归记录见 `test-results/2026-03-20-regression.md` | Done |
| T-016 | F-013 | 4.3,7 | Contract | 创建 `contracts/` Move 包与 `Move.toml`，定义包地址与 Sui 依赖 | 建立可编译的链上实现基础 | - | `sui move test -e testnet` 能识别包并编译 | Done |
| T-017 | F-006/F-012 | 4.3,5.1 | Contract | 实现 `kbo_registry`：对局创建、阶段迁移、费用账本、结算状态 | 将玩法核心流程上链并可审计 | T-016 | 能完成 `create -> start -> grace -> settle` 状态流 | Done |
| T-018 | F-013/F-014 | 4.3,5 | Contract | 实现 killmail 去重、结算领取防重放、风控降权入口 | 满足可追踪和反滥用最小闭环 | T-017 | 重复 killmail / 重复 claim 会 abort | Done |
| T-019 | F-013 | 7 | Contract Test | 为合约补 `#[test]`：主流程、重复 killmail、重复 claim | 防止关键链路回归 | T-018 | `sui move test -e testnet` 4/4 通过 | Done |
| T-020 | F-013 | 7 | Contract Devnet | 执行 CLI-first 合约验证（local test + devnet env check）并记录结果 | 满足交付标准中的链上验证证据 | T-019 | `verify-devnet.sh` 全链路通过；`test-publish` 成功（digest `12kmvf...7xRp`，package `0xf7c77f...b364`） | Done |
| T-021 | F-013 | 4.3,4.5 | Service/Contract | 新增 `kboContractGateway` 契约适配层（状态机、去重、防重放、错误映射） | 让前端 Service 消费合约语义而不是本地硬编码 | T-020 | 网关可完成 `create/start/submit/grace/settle/claim/snapshot`，并返回可预测错误 | Done |
| T-022 | F-006/F-012/F-013 | 4.3,4.4,5.1 | Service/Model | 重构 `killmailBingoService`：接入网关并同步 `matchId/phase/settlement` 到 Zustand | 打通“业务编排 -> 合约状态 -> 视图状态”闭环 | T-021 | 开局到领奖链路全部走网关，UI 行为与现有流程一致 | Done |
| T-023 | F-013/F-014 | 7 | Test | 新增网关与服务回归测试（重复 killmail、非法阶段、重复 claim） | 防止合约语义接入后的回归 | T-021,T-022 | `pnpm run test` 包含新测试并通过（2 files / 6 tests） | Done |
| T-024 | F-006/F-012/F-013/F-014 | 7 | Test/Docs | 执行 typecheck/test 并更新 SPEC/TODO/回归记录 | 保证实现与文档一致可追踪 | T-023 | `pnpm run typecheck` + `pnpm run test` 通过，文档已同步 | Done |
| T-025 | F-006 | 4.1,6 | View | 重构 S-001 大厅界面：任务预览、费用账本、队伍就绪矩阵、开局门禁 | 让玩家在 30 秒内完成“看规则-就绪-开局” | T-024 | 大厅含 `Initiate Match/Ready` 流程，按钮状态与房间条件一致 | Done |
| T-026 | F-006/F-014 | 4.1,6 | View | 重构 S-002/S-003：战斗指挥面板、实时事件流、核验控制台抽屉 | 提供对局中高密度决策信息与异常处理入口 | T-024 | 展示 Pending/Confirmed/Rejected 事件与核验详情，支持刷新重查 | Done |
| T-027 | F-012 | 4.1,6 | View | 重构 S-004 结算与战报：账单拆分、贡献排行、分享与再开局 CTA | 闭环“为何赢/钱怎么分/下一局”核心反馈 | T-024 | 结算面板显示四段账单和贡献明细；支持分享与再开局 | Done |
| T-028 | F-006/F-014 | 4.3,4.4,6 | Service/Model | 补充格子 Pending/Rejected 状态写入与视图聚合字段 | 确保前端界面状态与业务状态一致可解释 | T-024 | 提交事件后格子先 Pending，再 Confirmed/Rejected；视图可读状态来源统一 | Done |
| T-029 | F-006/F-012/F-014 | 7 | Test/Docs | 执行 typecheck/test 并回填 TODO/SPEC 同步结果 | 确认新界面改动未破坏既有逻辑 | T-025,T-026,T-027,T-028 | `pnpm run typecheck` + `pnpm run test` 通过（3 files / 8 tests），任务状态与文档同步 | Done |
| T-030 | F-006 | 4.4,6 | Model/Service | 修复 `useKillmailBingoViewState` selector 快照不稳定导致的 `getServerSnapshot` 循环告警 | 消除 SSR hydration 快照循环风险，保证页面稳定渲染 | T-029 | 使用 `useShallow` 包裹稳定 selector；`pnpm run typecheck` + `pnpm run test` 通过 | Done |

Status values:
- `Todo`
- `In Progress`
- `Blocked`
- `Done`

## 3. Ordered Execution Plan (Critical Path)

1. [x] T-001
2. [x] T-002
3. [x] T-003
4. [x] T-004
5. [x] T-005
6. [x] T-007
7. [x] T-008
8. [x] T-010
9. [x] T-011
10. [x] T-012
11. [x] T-013
12. [x] T-014
13. [x] T-015
14. [x] T-016
15. [x] T-017
16. [x] T-018
17. [x] T-019
18. [x] T-020
19. [x] T-021
20. [x] T-022
21. [x] T-023
22. [x] T-024
23. [x] T-028
24. [x] T-025
25. [x] T-026
26. [x] T-027
27. [x] T-029
28. [x] T-030

## 4. Definition of Done

- Every `Done` item must have:
  - Linked feature and layer filled.
  - Acceptance signal evidence (test/log/screenshot/command output).
  - No unresolved blocker from dependencies.
- Additional project DoD:
  - PRD AC traceability maintained (`AC-001/002/003/004`)。
  - 对局账单满足金额守恒：`gross_pool = platform_fee + payout_pool`。
  - 领奖流程满足幂等保护，不允许重复领取。

## 5. Change Log

- 2026-03-20: 初始化 `todo.md`，创建 T-001 ~ T-015（Todo） by Codex
- 2026-03-20: 项目初始化完成，T-001/T-002/T-003/T-004/T-005/T-007/T-010/T-011 moved `Todo` -> `Done` by Codex
- 2026-03-20: 完成 T-006/T-008/T-009/T-012/T-013；T-014/T-015 受 `sui` CLI 缺失影响标记 `Blocked` by Codex
- 2026-03-20: 安装 `sui` CLI 并完成 T-014/T-015；devnet 命令通过，前端项目无 Move 包按规则跳过 `sui move test` by Codex
- 2026-03-20: 新增合约层实现任务 T-016~T-020（Todo）by Codex
- 2026-03-20: 完成合约层 T-016~T-020；Move 单测通过，devnet 命令已执行并记录 `test-publish` 无 gas 失败路径 by Codex
- 2026-03-20: 通过 faucet 获取 gas 后，`test-publish` 成功（digest/package 已记录）by Codex
- 2026-03-20: 修复 `verify-devnet.sh` 重复执行问题（临时 pubfile），脚本端到端验证成功 by Codex
- 2026-03-20: 新增前端合约网关接入任务 T-021~T-024（Todo）by Codex
- 2026-03-20: 完成 T-021~T-024；Service 接入 `kboContractGateway`，新增网关测试，`pnpm run typecheck` 与 `pnpm run test` 通过 by Codex
- 2026-03-20: 新增前端界面完善任务 T-025~T-029（Todo）by Codex
- 2026-03-20: 完成 T-025~T-029；重构 S-001~S-004 界面、补齐 Pending/Rejected 状态写入，新增 store 单测，`pnpm run typecheck` 与 `pnpm run test` 通过（3 files / 8 tests）by Codex
- 2026-03-20: 新增运行时告警修复任务 T-030（Todo）by Codex
- 2026-03-20: 完成 T-030；`useKillmailBingoViewState` 改为 `useShallow` 缓存 selector 快照，`pnpm run typecheck` 与 `pnpm run test` 通过（3 files / 8 tests）by Codex
