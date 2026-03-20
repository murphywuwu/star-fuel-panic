# TODO: Fuel Frog Panic

## 0. One-Screen Execution Summary (Problem / Why / How)

- Problem this execution batch solves:
  - 把 Fuel Frog Panic 从 PRD/SPEC 转成可实现任务清单，覆盖建房、主循环、结算与可追溯账单。
- Why these tasks now:
  - 该玩法是 P0 优先项目，需要先形成稳定可执行路径供 Coding Agent 实施。
- How we solve it (critical 3-step execution path):
  1. 先建四层架构骨架与核心状态模型。
  2. 实现主循环规则（节点进度、贡献、状态迁移）。
  3. 完成结算、审计账单和异常拦截闭环。
- Expected delivery outcome:
  - 得到可直接进入编码阶段的原子任务板，且每项任务可验收、可追踪。

## 0.1 Before vs After (Execution Value)

| Dimension | Before | After |
|---|---|---|
| Delivery clarity | 需求完整但未拆解到实现层 | 任务按层拆分并与 AC 映射 |
| Delivery speed | 开发前需要二次澄清 | 开发可按依赖顺序直接推进 |
| Delivery confidence | 风险点分散 | 风险点已转化为明确验收信号 |

## 1. Document Control

- Project/App: `apps/fuel-frog-panic`
- Related PRD: `docs/prd/fuel-frog-panic/prd.md`
- Related SPEC: `apps/fuel-frog-panic/spec.md`
- Version: v1.1
- Owner: PM Agent
- Last Updated: 2026-03-20

## 2. Task Board

| TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|
| T-001 | F-002 | 4.4 | Model | 建立 Zustand `room/mission/team/score/settlement/risk` slices | 奠定状态单一事实源 | None | store 类型、actions、selectors 可编译并通过单测 | Done |
| T-002 | F-002 | 4.3 | Service | 实现 `initMissionState` 与 `NodeDeficitSnapshot` 装载逻辑 | 保障开局状态一致 | T-001 | 能生成合法初始任务快照并写入 model | Done |
| T-003 | F-002 | 4.2 | Controller | 实现 `createFuelRoom` 与参数锁定流程 | 完成开局入口与防改配置 | T-001,T-002 | 建房后返回 lock hash，重复修改被拒绝 | Done |
| T-004 | F-002 | 4.2 | Controller | 实现 `joinFuelRoom` / `lockTeamRoles` | 支持入队与开局前分工 | T-003 | 角色在开局后不可改，错误码正确 | Done |
| T-005 | F-002 | 4.3 | Service | 实现 `recordSupplyEvent` 与节点推进规则 | 驱动主循环核心得分 | T-002,T-004 | fill_ratio 递增、节点达标事件可追踪 | Done |
| T-006 | F-002 | 5.1 | Service | 实现状态机迁移（LobbyReady->Planning->MatchRunning->FinalSprint->Settled） | 保证流程可控可测 | T-002 | 非法迁移返回 `E_INVALID_STATE_TRANSITION` | Done |
| T-007 | F-002 | 4.1 | View | 实现大厅/Planning/对局面板 UI（只调 Controller） | 建立可操作前端入口 | T-003,T-004,T-006 | View 无 service/model 直连，关键状态可视化 | Done |
| T-008 | F-002 | 4.1 | View | 实现节点地图、风险热度、贡献榜 UI | 提升局内反馈质量 | T-005,T-007 | 实时展示 fill_ratio、Top3 贡献 | Done |
| T-009 | F-012 | 4.3 | Service | 实现 `finalizeSettlement` 分账逻辑（含 seed/subsidy/sponsor） | 完成商业化核心闭环 | T-005,T-006 | 账单字段完整，公式与 PRD 一致 | Done |
| T-010 | F-012 | 4.2 | Controller | 实现 `requestSettlement` 幂等与重复结算拦截 | 防止结算资金风险 | T-009 | 重复请求返回同 settlement_id，不重复扣/发 | Done |
| T-011 | F-012 | 4.1 | View | 实现可解释结算页（gross/platform/host/payout/member） | 建立玩家信任与转化 | T-009,T-010 | 账单字段齐全且可读，数值对账通过 | Done |
| T-012 | F-013 | 4.3 | Service | 搭建 MissionEventGateway 适配层（stub + retry） | 为实网集成预留稳定接口 | T-005 | 网关失败时 fallback 到最近快照并标 stale | Done |
| T-013 | F-014 | 4.3 | Service | 实现异常行为检测标记（对冲、异常贡献集中） | 控制刷分与作弊风险 | T-005,T-009 | 风险标记可写入 risk slice 并影响结算等级 | Done |
| T-014 | F-014 | 5 | Service | 实现错误码与审计日志规范化输出 | 提升可观测与排障效率 | T-006,T-010,T-013 | 关键错误码覆盖并有审计字段 | Done |
| T-015 | F-002/F-012 | 7 | Cross-layer | 编写单测与集成测试用例（主流程+异常流程） | 保障回归稳定性 | T-001~T-014 | 主流程手工回归通过，`npm run build` 与 `npm run typecheck` 通过 | Done |
| T-016 | F-013 | Contract | Move | 新建 `contracts/` Move 包骨架（Move.toml + module） | 形成链上实现落点 | None | `Move.toml` 可解析，模块可编译 | Done |
| T-017 | F-002 | Contract | Move | 实现房间模型与状态机（Lobby/Planning/Match/Final/Settled） | 链上流程可控并可验证 | T-016 | 非法状态迁移触发错误码 | Done |
| T-018 | F-002/F-014 | Contract | Move | 实现入队、补给事件提交、重复事件拦截 | 链上贡献与反刷分闭环 | T-017 | 重复事件被拒绝，贡献可累计 | Done |
| T-019 | F-012 | Contract | Move | 实现结算分账与幂等结算（gross/platform/host/payout） | 链上结算与经济逻辑落地 | T-018 | 重复结算返回同账单状态，不重复记账 | Done |
| T-020 | F-002/F-012 | Contract Test | Move Test | 编写 Move 单元测试（分账公式/幂等/防重放） | 防回归并满足合约测试基线 | T-019 | `sui move test -e testnet` 通过核心用例 | Done |
| T-021 | F-013 | Contract Ops | CLI Script | 新增 devnet 校验脚本并记录执行命令 | 满足 devnet 交付标准 | T-016,T-020 | 脚本执行 `env switch + test + publish(test-publish)` 命令链 | Done |
| T-022 | F-002/F-012/F-014 | Contract Test | Move Scenario Test | 补充 `test_scenario` 主流程/错误流/边界测试（重复事件、满员、非法 team id） | 提升合约回归覆盖和缺陷发现率 | T-020 | `sui move test -e testnet` 8/8 通过 | Done |
| T-023 | F-013 | Testing Doc | Test Plan | 新建并维护 Fuel Frog Panic 合约测试计划文档 | 提升测试可追踪性与交付可审计性 | T-022 | `docs/test-plan/fuel-frog-panic/test-plan.md` 已更新 | Done |
| T-024 | F-013 | Contract Ops | Devnet Integration | 完成 devnet 发布级验证（需可用 gas coin） | 满足发布前链上集成验收 | T-021,T-022 | `sui client test-publish` 成功并输出 package id | Blocked |
| T-025 | F-002 | View | 设计交付落地路由壳：`lobby/planning/match/final/settlement` | 将 PRD 设计稿转为可执行页面结构 | T-007,T-008 | 路由与页面壳可访问且状态切换正确 | Done |
| T-026 | F-002/F-012 | View/Controller | 按 PRD 6.8 实现组件拆分与 handler 对接 | 减少页面耦合并提升迭代速度 | T-025 | `MissionLobbyPanel/RoleLockPanel/NodeMapPanel/SettlementBillPanel` 完成对接 | Done |
| T-027 | F-002/F-012/F-013 | Testing | 执行 IA-001~IA-006 交互验收并记录证据 | 确保设计稿与实现行为一致 | T-026 | IA 合同通过并更新 test-plan 结果 | Todo |
| T-028 | F-002 | View | 修正路由为无项目前缀：`/lobby,/planning,/match,/final,/settlement` | 与项目运行约定保持一致，避免 404 误导 | T-025 | 无前缀路由可访问，旧前缀路由可兼容跳转 | Done |
| T-029 | F-002 | View | 修复前端样式缺失问题（确保全路由加载 Tailwind/EVE token） | 恢复战术化 UI 可读性与交互反馈 | T-028 | 关键页面显示边框/配色/排版，`typecheck`+`build` 通过 | Done |

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
6. [x] T-006
7. [x] T-009
8. [x] T-010
9. [x] T-007
10. [x] T-008
11. [x] T-011
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
24. [ ] T-024
25. [x] T-025
26. [x] T-026
27. [ ] T-027
28. [x] T-028
29. [x] T-029

## 4. Definition of Done

- Every `Done` item must have:
  - Linked feature and layer filled.
  - Acceptance signal evidence (test/log/screenshot/command output).
  - No unresolved blocker from dependencies.
- Project-level DoD:
  - AC-001: 单局 10-15 分钟主流程可跑通。
  - AC-002: 贡献与战报可追溯。
  - AC-003: 结算账单可对账且幂等。

## 5. Change Log

- 2026-03-20: Initial TODO created by PM Agent.
- 2026-03-20: Coding Agent completed T-001~T-015, added service/controller/view implementation and local verification baseline.
- 2026-03-20: Local verification executed: `npm run build` (pass), `npm run typecheck` (pass).
- 2026-03-20: Added contract-layer tasks T-016~T-021 for Move implementation and devnet verification flow.
- 2026-03-20: Completed T-016~T-021. `sui move test -e testnet` passed (4/4). Devnet `test-publish` command executed but blocked by insufficient gas coin in current wallet.
- 2026-03-20: Added and completed T-022/T-023. Move tests expanded to 8 cases (main/error/edge) and all passed.
- 2026-03-20: Added T-024 as Blocked (devnet `test-publish` lacks sufficient gas coin in active wallet).
- 2026-03-20: Added T-025~T-027 from PRD 6.8 design handoff pack for UI execution and interaction acceptance.
- 2026-03-20: Completed T-025/T-026. Added `/fuel-frog-panic/{lobby,planning,match,final,settlement}` routes, split View components per PRD 6.8, and passed `pnpm run typecheck` + `pnpm run build`.
- 2026-03-20: Completed T-028/T-029. Switched primary routes to `/lobby,/planning,/match,/final,/settlement`, kept legacy prefixed routes as redirects, and re-validated style tokens through Tailwind output with `pnpm run typecheck` + `pnpm run build`.
