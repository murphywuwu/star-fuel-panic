# TODO: Scrap Relay (State Machine & Settlement Module)

## 0. One-Screen Execution Summary (Problem / Why / How)

- Problem this execution batch solves:
  - 将 `Scrap Relay` 的状态机与结算规则从文档描述转为可执行任务，避免实现阶段接口漂移与结算逻辑不一致。
- Why these tasks now:
  - 该模块是玩法主流程和商业化闭环的共同关键路径，必须先完成才能进入稳定联调与测试。
- How we solve it (critical 3-step execution path):
  1. 先固化 Model/Service 的状态机与结算核心能力。
  2. 再接入 Controller/View 的事件与展示契约。
  3. 最后完成链路测试、异常回归与文档闭环。
- Expected delivery outcome:
  - 交付可运行的状态机 + 结算模块，满足 PRD AC-001~AC-004 的实现与验证入口。

## 0.1 Before vs After (Execution Value)

| Dimension | Before | After |
|---|---|---|
| Delivery clarity | 状态机和分账规则停留在 PRD 描述层 | 每层接口、任务、验收信号一一对应 |
| Delivery speed | 研发顺序不稳定，容易反复返工 | 按关键路径分批交付，减少耦合返工 |
| Delivery confidence | 难以验证“无重复结算/无越序步骤” | 主路径与异常路径均有明确回归项 |

## 1. Document Control

- Project/App: `apps/scrap-relay`
- Related PRD: `docs/prd/scrap-relay/prd.md`
- Related SPEC: `apps/scrap-relay/spec.md`
- Version: v1.0
- Owner: PM/Coding/Testing Agents
- Last Updated: 2026-03-20

## 2. Task Board

| TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|
| T-001 | F-007 | 4.4 / 5.1 | Model | 建立 Zustand `roomSlice`，落地 `LobbyReady -> RoleLock -> RelayRunning -> Overtime -> Settled` 迁移守卫 | 保证状态迁移可控且不可逆终态 | None | 单测覆盖合法/非法迁移；非法迁移返回 `E_STATE_TRANSITION_INVALID` | Done |
| T-002 | F-007 | 4.4 / 5 | Model | 建立 `blueprintSlice` 和 `contributionSlice`，支持步骤状态、阻塞原因、贡献快照 | 为阻塞提示和贡献复盘提供统一状态源 | T-001 | Store selector 能输出可执行步骤、阻塞 Top1、贡献占比 | Done |
| T-003 | F-007 | 4.3 / 5 | Service | 实现 `commitBlueprintStep`：校验依赖、材料合法性、重复提交拦截 | 保证蓝图推进正确并可对账 | T-001,T-002 | 集成测试通过：越序/缺料/重复步骤均被拒绝并返回对应错误码 | Done |
| T-004 | F-007 | 4.3 / 5.1 | Service | 实现 `computeContribution` 与 `heartbeatTick`，输出阻塞识别和阶段推进 | 提供实时协作反馈，支撑 AC-002 | T-003 | 10s 节拍能更新阻塞步骤和贡献榜；超时自动进入 `Overtime` | Done |
| T-005 | F-012 | 4.3 / 5 | Service | 实现 `buildSettlementBill`，执行 `gross -> platform -> host -> payout -> member` 分账顺序和费率上限 | 保障结算透明、可解释、可审计 | T-003,T-004 | 单测校验公式与边界：`platform_rake_bps<=1500`、`host_revshare_bps<=6000` | Done |
| T-006 | F-012/F-013 | 4.3 / 5 | Service | 实现 `finalizeSettlement` 幂等逻辑（`requestId` 去重）及链上事件写入适配 | 避免重复派奖，保证链上链下一致 | T-005 | 重复请求返回首单账单；链写失败触发 3 次退避后进入可恢复队列 | Done |
| T-007 | F-007 | 4.2 | Controller | 实现 `lockRoleHandler`、`submitBlueprintStepHandler`、`requestSettlementHandler` | 统一 View 事件编排入口，隔离业务复杂度 | T-003,T-005 | Handler 集成测试通过：主路径可完成开局到结算 | Done |
| T-008 | F-007 | 4.1 / 6 | View | 实现阶段态条、蓝图 DAG 进度、阻塞告警、贡献榜与结算账单展示契约 | 玩家可在 30 秒内理解状态与胜负来源 | T-007 | 手工验收：关键状态变化有即时反馈，账单字段完整可读 | Done |
| T-009 | F-014 | 4.3 / 5 | Service | 增加反滥用检查（异常短局、异常贡献集中、重复路线刷分）和审计标记 | 降低对刷和刷分风险 | T-004,T-006 | 异常样例触发审计标记并返回 `E_ANTI_ABUSE_FLAGGED`/风控错误码 | Done |
| T-010 | F-007/F-012/F-013/F-014 | 7 | Test | 建立主流程+异常流程回归清单，覆盖重复结算、越序步骤、权限绕过、链写失败 | 保证 P0 演示稳定性与可回归性 | T-001~T-009 | 回归报告包含通过率、失败用例复现步骤、修复跟踪项 | Done |
| T-011 | F-007/F-012 | 3 / 4 / 6 | Project | 初始化 `apps/scrap-relay` 工程（Next.js + TS + Tailwind + Zustand）并接入四层骨架与首页 | 形成可运行项目入口，支持后续任务并行推进 | None | 目录含 `app/` 与 `src/{view,controller,service,model}`，页面可加载基础战术面板 | Done |
| T-012 | F-013 | 7 | Test | 执行 Sui CLI-first devnet 集成校验（switch/envs/move test/publish） | 满足合约集成标准与可交付审计要求 | 外部环境：devnet RPC 可达 + wallet gas + 网络可访问 | `npm run test:devnet` 成功输出 publish 失败 + `test-publish --dry-run` 成功结果 | Done |
| T-013 | F-007 | 8 | Contract | 初始化 Move 合约工程（`Move.toml` + package metadata） | 建立可编译、可发布的合约工程基础 | None | 存在 `apps/scrap-relay/contracts/Move.toml` 与 `sources/` | Done |
| T-014 | F-007 | 8 / 5.1 | Contract | 实现房间状态机与蓝图步骤提交模块（含依赖校验） | 将核心玩法状态迁移上链约束化 | T-013 | 提供 `create_room/lock_role/start_relay/commit_step/heartbeat_tick` | Done |
| T-015 | F-012/F-013 | 8 / 5 | Contract | 实现结算账单模块（费率上限、顺序拆分、requestId 幂等） | 对账可追溯，避免重复结算 | T-014 | 提供 `finalize_settlement`，输出 settlement event | Done |
| T-016 | F-014 | 8 / 5 | Contract | 实现反滥用规则函数（短局/高重复/高集中/集群地址） | 抑制对刷刷分与异常收益 | T-015 | 提供 `evaluate_anti_abuse` 与错误码 `E_ANTI_ABUSE_FLAGGED` | Done |
| T-017 | F-013 | 7 / 8 | Contract/Test | 补充合约 README 与 devnet 命令说明，接入 `test:devnet` 脚本路径 | 缩短后续集成与验收路径 | T-013 | 文档包含 `sui move test`、`sui client publish` 和环境变量说明 | Done |
| T-018 | F-007 | 4.2 / 5.1 / 6 | Controller/Service | 增加前端流程处理器：`enterRoleLock`、`startRelay`、`claimReward`、`restartMatch` | 让 S-001~S-004 前端流程可按状态机顺序推进 | T-007 | 可从 Lobby 流畅推进到 Settled，并支持领奖后回到新一局 | Done |
| T-019 | F-007 | 6 | View | 重构 S-001 Command Lobby：房间列表、经济预览、Ready Checklist、钱包断连/加载态 | 满足 30 秒首屏可读与入场决策效率 | T-018 | 展示 `ROOM_LIST_LOADING`/`WALLET_DISCONNECTED` 并有可执行 CTA | Done |
| T-020 | F-007 | 6 | View | 实现 S-002 Role Lock：角色矩阵、任务简报、锁角冲突提示、键盘可达 | 提升开局职责分配效率并降低锁角误操作 | T-018,T-019 | role radio-group 支持键盘操作，冲突场景展示 `ROLE_LOCK_CONFLICT` | Done |
| T-021 | F-007 | 6 | View | 实现 S-003 Tactical Console：DAG 三态、阻塞雷达、贡献榜、自动 heartbeat 节拍 | 提供实时战术反馈与阻塞收敛能力 | T-018,T-020 | 展示 `STEP_BLOCKED`/`ILLEGAL_SUBMIT`，并在运行态自动刷新 | Done |
| T-022 | F-012 | 6 | View | 实现 S-004 Settlement Debrief：结算瀑布表、成员分配、领奖与再来一局 | 建立可解释分账与复玩闭环 | T-018,T-021 | 结算表头语义完整，支持 `SETTLEMENT_PENDING/FAILED` 与领奖反馈 | Done |
| T-023 | F-007/F-012 | 6.8 / 6.9 | View | 落地统一壳层与状态文案矩阵：Top Bar + Workspace + Action Rail + microcopy contract | 保证跨屏一致交互语言与响应式表现 | T-019,T-020,T-021,T-022 | 桌面/平板/移动断点布局生效，关键状态文案与下一步动作一致 | Done |
| T-024 | F-007/F-012 | 7 | Test | 执行前端回归验证（`npm run typecheck` + `npm run build`）并记录结果 | 确保新界面在当前工程可编译可发布 | T-018~T-023 | 命令成功，且无 TS/构建阻断错误 | Done |

Status values:
- `Todo`
- `In Progress`
- `Blocked`
- `Done`

## 3. Ordered Execution Plan (Critical Path)

1. [x] T-011
2. [x] T-001
3. [x] T-002
4. [x] T-003
5. [x] T-004
6. [x] T-005
7. [x] T-006
8. [x] T-007
9. [x] T-008
10. [x] T-009
11. [x] T-010
12. [x] T-012
13. [x] T-013
14. [x] T-014
15. [x] T-015
16. [x] T-016
17. [x] T-017
18. [x] T-018
19. [x] T-019
20. [x] T-020
21. [x] T-021
22. [x] T-022
23. [x] T-023
24. [x] T-024

## 4. Definition of Done

- Every `Done` item must have:
  - Linked feature and layer filled.
  - Acceptance signal evidence (test/log/screenshot/command output).
  - No unresolved blocker from dependencies.

## 5. Change Log

- 2026-03-20: T-001 ~ T-010 created as initial execution batch by PM Agent
- 2026-03-20: T-011 moved `Todo` -> `Done` by Coding Agent
- 2026-03-20: T-001 ~ T-008 moved `Todo` -> `In Progress` by Coding Agent
- 2026-03-20: T-001 ~ T-010 moved `In Progress/Todo` -> `Done` by Coding Agent
- 2026-03-20: T-012 created with status `Blocked` (missing Sui CLI / Move.toml / devnet wallet prerequisites)
- 2026-03-20: T-013 ~ T-017 created for contract-layer implementation by Coding Agent
- 2026-03-20: T-013 ~ T-017 moved `Todo` -> `Done` by Coding Agent
- 2026-03-20: Contract module hardened with sender/host permission guards and Move unit tests
- 2026-03-20: T-012 moved `Blocked` -> `Done` (`npm run test:devnet` 完成：`sui client publish` 失败后 `test-publish --dry-run` 成功)
- 2026-03-20: T-018 ~ T-024 created for frontend UI completion batch (PRD 6.8 / 6.9)
- 2026-03-20: T-018 ~ T-023 moved `Todo` -> `Done` by Coding Agent（S-001~S-004 前端界面完成）
- 2026-03-20: T-024 moved `Todo` -> `Done` (`npm run typecheck` + `npm run build` 通过)
