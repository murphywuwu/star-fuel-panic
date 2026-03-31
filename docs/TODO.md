# TODO: Fuel Frog Panic Active Backlog

Version: v2.7.0
Last Updated: 2026-03-31
Source Docs: `docs/PRD.md` v2.7.0, `docs/architecture.md` v6.3, `docs/SPEC.md` v6.5
Maintainer: Todo Agent

---

## 0. One-Screen Execution Summary (Problem / Why / How)

- Problem this execution batch solves:
  当前 `docs/TODO.md` 仍停留在 `PRD v2.6.1 / architecture v6.2 / SPEC v6.4` 基线，且主要内容是已完成历史任务，尚未覆盖 `v2.7` 新增的燃料品级计分链路。
- Why these tasks now:
  最新 PRD / SPEC / architecture 已把 `FuelConfig -> fuel grade bonus -> score_update / overlay barrage` 定义为正式基线；如果 TODO 不同步，实施将缺少明确的依赖顺序、验收口径和测试闭环。
- How we solve it (critical 3-step execution path):
  1. 先补齐 `fuelConfigRuntime`、`fuel_events` 持久化字段和 `chainSyncEngine` 新计分公式。
  2. 再把新版 `FuelDepositEvent / MatchStreamEvent` 契约推到 `matchStreamService -> matchRuntimeStore -> /match` 视图链路，并让 demo/live 口径一致。
  3. 最后执行回归与 devnet 验证，回填测试证据并关闭 `v2.7` 增量 backlog。
- Expected delivery outcome:
  `docs/TODO.md` 重新成为当前活跃执行源，只跟踪 `v2.7` 尚未落地的燃料品级增量，而不是继续混杂已完成的 `v2.6` 历史任务。

## 0.1 Before vs After (Execution Value)

| Dimension | Before | After |
|---|---|---|
| Delivery clarity | TODO 混有大量 `v2.6` 已完成任务，活跃缺口不明显 | 活跃待办只跟踪 `v2.7` 燃料品级增量 |
| Delivery speed | 很难判断下一步先改 runtime、API 还是前端 | 关键路径按 `Runtime -> API -> Frontend -> QA` 排序 |
| Delivery confidence | `FuelConfig` 缓存降级、品级计分、弹幕展示都没有明确验收项 | 每个增量任务都带依赖、验收信号和验证命令 |

## 1. Document Control

- Project/App: `Fuel Frog Panic`
- Related PRD: `docs/PRD.md`
- Related SPEC: `docs/SPEC.md`
- Related Architecture: `docs/architecture.md`
- Template Used: `docs/templates/todo-template.md`
- Planning Scope: `PRD v2.7.0` 增量执行任务
- Notes:
  当前 TODO 只保留活跃 backlog。`v2.6` 主链路的已完成详细任务不再继续占据活动板面，但仍可从 git 历史中追溯。

## 1.1 Implementation Reality Snapshot

- 已视为交付基线的能力：
  - Entry / wallet / auth
  - Match create / publish
  - Lobby discovery / planning team registry
  - Team lobby / pay / whitelist
  - Match runtime / settlement / persisted stream facts
  - Supabase-backed lifecycle persistence
  - Frontend architecture guardrails
- 2026-03-31 已落地的 `v2.7` 增量：
  - `fuelConfigRuntime` 与 `FuelGrade / FuelGradeInfo` 共享类型
  - `chainSyncEngine` 的 `fuelGradeBonus` 新计分公式
  - `FuelDepositEvent / MatchStreamEvent` 契约与 persisted stream hydration
  - `matchRuntimeStore.applyStreamEvent` 与 live score feed 品级读模型
  - `/match` live / demo 双模式的品级图标与乘数明细展示
- 当前剩余活跃缺口：
  - 无。当前 backlog 中已确认的问题都已闭环，后续只保留新的变更请求或新的线上缺陷。

## 2. Task Board

### F-008 Fuel Grade Runtime & Projection

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-0800 | F-008 | 5.7 | Runtime / Chain | Runtime only | 实现 `fuelConfigRuntime`：读取链上 `FuelConfig` 共享对象，缓存 `fuel_efficiency` 映射表，按 5 分钟刷新，并在读取失败时保留上次有效缓存且标记 `stale=true` | 这是 `v2.7` 品级计分的信任根，没有它后续得分和弹幕都无从谈起 | - | `src/server/fuelConfigRuntime.test.ts` 已覆盖表读取、stale fallback 与缺失 config 降级 | Done |
| T-0801 | F-008 | 5.8, Architecture 6 | Runtime / Data | Runtime + Data | 扩展 `fuel_events` 规范事实与持久化结构，新增 `fuel_type_id`、`fuel_grade`、`fuel_grade_bonus` 字段，并为旧记录定义兼容缺省值 | 没有规范持久层就无法审计品级计分，也无法稳定驱动弹幕与回放 | T-0800 | `src/server/runtimeProjectionStore.fuelEvents.test.ts` 与 `src/app/api/__tests__/fuel-events-route.test.ts` 已覆盖写入、旧快照兼容和 route 落盘 | Done |
| T-0802 | F-008 | 2.6, 5.8, Architecture 7.4 | Runtime / Scoring | Runtime only | 更新 `chainSyncEngine` 的计分逻辑：从 `FuelEvent.type_id` 查询品级，按 `fuelAdded × urgencyWeight × panicMultiplier × fuelGradeBonus` 计算 `scoreDelta`，并写入 `match_scores / match_stream_events` | 这是 PRD v2.7 的核心玩法变化，直接决定比赛胜负和收益分配 | T-0800 | `src/service/chainSyncEngine.test.ts` 已覆盖标准/精炼燃料与 panic 乘数；未知类型默认回退 Tier 1 | Done |
| T-0803 | F-008 | 2.3, 2.5, 4.2 | Runtime / API / Type | API only | 对齐 `FuelDepositEvent`、`MatchStreamEvent` 和 `GET /api/matches/{id}/stream` 契约，让流事件显式返回 `fuelTypeId`、`fuelGrade` 和乘数明细 | 前端不应在 View 侧推断品级，必须由规范事件源直接提供 | T-0802 | `src/types/match.ts`、`src/server/matchRuntime.ts` 与 `src/server/matchRuntime.stream.test.ts` 已支持 `fuelDeposit` payload 的 typed hydration 与 frame 复用 | Done |

### F-009 Match Runtime / Overlay Presentation

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-0900 | F-009 | 3.4 | Service / Model | Service + Model | 更新 public stream -> runtime 读模型：补齐 `matchRuntimeStore.applyStreamEvent`、live feed ingestion 与去重逻辑，统一承接 `fuelGrade` 信息 | 浏览器比赛页和游戏内浮窗必须共享同一份读模型，不能在 View 层二次拼业务 | T-0803 | `src/model/fuelMissionStore.ts` 与 `src/controller/useMatchController.ts` 已能消费 `fuelDeposit`，并写入统一 live score feed | Done |
| T-0901 | F-009 | 3.4, Architecture 4.4 | View / Controller | View + Controller | 更新 `/match` 的 live event feed / overlay 弹幕表现，显示品级图标（⚪/🟡/🟣）、品级名和乘数明细，同时保持 Panic 与得分板编排不破层 | PRD 已把“带品级图标的弹幕”定义为玩家可见的新反馈，不应只停留在后端字段 | T-0900 | `/match` live feed 现在显示品级 badge 与 `U × P × G` 乘数明细；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 已通过 | Done |
| T-0902 | F-009 | 3.4 | Service / Model | Service + Model | 扩展 `matchDemoReplayService` 的脚本化 feed，让默认 demo 模式也输出三档燃料品级样例，避免 live 与 demo 契约分裂 | `/match` 默认进入 demo；如果 demo 不展示品级，路演体验会和正式产品基线脱节 | T-0900 | `src/service/matchDemoReplayService.test.ts` 已验证 demo score bursts 覆盖 Tier 1/2/3 文案 | Done |

### F-010 Verification / Governance

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-1000 | F-010 | 2.6, 5.7, 5.8, 6.1 | QA | QA only | 补齐燃料品级回归：效率区间映射、未知 `fuelTypeId`、`FuelConfig` stale fallback、计分公式和 `score_update` payload | `v2.7` 新逻辑全部落在高风险实时链路中，没有回归就无法放行 | T-0802, T-0803, T-0902 | `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/service/chainSyncEngine.test.ts src/server/fuelConfigRuntime.test.ts src/service/matchDemoReplayService.test.ts src/server/matchRuntime.stream.test.ts` 通过 | Done |
| T-1001 | F-010 | Contract / Devnet | Contract / Devnet | QA only | 按 `docs/sui-devnet-testing-standard.md` 执行 CLI-first devnet 验证：读取真实 `FuelConfig`，校验 `FuelEvent.type_id` 的品级映射与至少一个计分样例 | 最新文档已明确 `FuelConfig` 是链上信任根，必须做真链验证而不是只靠 mock | T-0800, T-0802 | 已记录 `sui client envs / active-env / active-address`、devnet `object not found` 结果，以及 testnet fallback 下的真实 `FuelConfig` object id、6 条 efficiency 映射与 `DEPOSITED` 样例计算 | Done |
| T-1002 | F-010 | Architecture 4.4, 6.1 | Governance / Docs | Docs only | 在实现完成后回填 `docs/TODO.md`、测试记录与 change log，关闭 `v2.7` 活跃 backlog | TODO 必须反映实现现实，不能长期停留在“已规划未验证”状态 | T-1000, T-1001 | `docs/TODO.md`、`docs/test-plan.md`、`docs/devnet-verification-latest.md` 已回填；`v2.7` backlog 关闭 | Done |

### F-011 Planning Team Backend Persistence

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-1100 | F-011 | 3.3, 5.10 | Runtime / Data / API | Runtime + Data | 将独立战队 registry 从“仅本地 `runtimeProjectionStore.planningTeams`”扩展为“后端 `planning_teams / planning_team_members` + 冷启动 hydrate”，并让 `/api/planning-teams` GET/POST/JOIN 在读写前后同步 backend mirror | 否则服务重启后 `/planning` 会丢失已创建战队，`Current Team Count` 回到 `0` | - | 已新增 backend mirror、GET/POST/JOIN hydrate/persist，并完成本地 Supabase migration | Done |
| T-1101 | F-011 | 3.3, 5.10, 6.1 | QA | QA only | 为独立战队 backend mirror 补 runtime/API 回归，并执行 `pnpm build` 与 `node ./scripts/check-layer-imports.mjs` | 这是重启后数据丢失问题，必须有冷启动回归而不是只测单次创建成功 | T-1100 | `src/server/planningTeamBackendStore.test.ts`、`src/app/api/__tests__/planning-teams-route.test.ts`、`pnpm typecheck`、`pnpm build`、`node ./scripts/check-layer-imports.mjs` 通过 | Done |

### F-012 Planning Team Lifecycle Controls

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-1200 | F-012 | 3.3, 4.5, 5.10 | Runtime / Data / API | Runtime + Data | 将独立战队加入改为申请制：新增 `planning_team_applications` 事实层，并实现 `POST /api/planning-teams/{id}/join` 返回 pending、队长 `approve/reject` 后才真正入队 | 用户要求独立战队也遵守“队长审核”规则，当前直接加入会破坏队长控制权 | T-1100 | 已新增 `planning_team_applications` migration、runtime/backend mirror 和 `approve/reject` routes；申请提交后不会直接入队 | Done |
| T-1201 | F-012 | 3.3, 4.5, 5.10 | Runtime / API | Runtime + Data | 为独立战队补 `leave` 与 `disband`：普通成员可退出，队长可解散整队；同时保持 backend mirror 与冷启动 hydrate 一致 | 用户需要在 `/planning` 自主维护队伍生命周期，否则当前一旦加入就无法撤销 | T-1200 | `leave/disband` routes 与 runtime 已落地；member leave 后 roster 收缩，captain disband 后 team board 删除 | Done |
| T-1202 | F-012 | 3.3, Architecture 4.4 | Service + Model | Service + Model | 扩展 planning team store/service/controller，支持 pending applications、approve/reject、leave、disband，并提供队长/成员态选择器 | 如果只改 runtime/API，不改 controller/store，`/planning` 仍无法正确表达申请态和队长操作 | T-1200, T-1201 | `planningTeamService`、`usePlanningTeamController`、`usePlanningTeamScreenController` 已承接审批和生命周期动作 | Done |
| T-1203 | F-012 | 3.3 | View + Controller | View + Controller | 重绘 `/planning` team board 交互：加入按钮改为申请，队长看到待审批队列与 approve/reject，成员看到 leave，队长看到 disband | 当前 UI 只支持 create/join，无法承载新的生命周期控制 | T-1202 | `/planning` 已显示 pending 申请态、审批区、leave/disband 按钮与对应文案 | Done |
| T-1204 | F-012 | 3.3, 5.10, 6.1 | QA | QA only | 为 planning team 审批/退出/解散补 runtime/API/UI 回归，并执行 `pnpm build` 与 `node ./scripts/check-layer-imports.mjs` | 这是新的主路径，必须覆盖 create -> apply -> approve/reject -> leave/disband -> restart/hydrate | T-1203 | 定向测试、`pnpm typecheck`、`pnpm build`、`node ./scripts/check-layer-imports.mjs` 通过 | Done |

### F-013 Match Local Simulation Harness

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-1300 | F-013 | 3.4, 5.5, 5.8 | Runtime / API | Runtime + API | 为运行中的本地服务增加模拟 FuelEvent 注入能力，支持更新 live match scoreboard、fuel event fact 和 stream feed | 用户当前无法在 EVE 客户端内真实操作，需要一条不依赖游戏客户端的 live match 测试路径 | - | 已新增 `src/server/matchSimulationRuntime.ts` 与 `/api/matches/{id}/simulate-fuel`，注入后可更新 scoreboard 与 `fuel_events` 事实 | Done |
| T-1301 | F-013 | 3.4 | Tooling | Tooling only | 提供一键脚本 `scripts/test-match-live.mjs`，自动驱动 standard / premium / refined / panic 组合场景并打印每步 scoreboard | 仅有模拟 API 不足以让开发者快速验证 `/match`，需要一个可重复的一键脚本 | T-1300 | `scripts/test-match-live.mjs --match-id <id>` 可运行场景；真实本地 API 已验证 create-less live flow | Done |

## 3. Ordered Execution Plan (Critical Path)

1. [x] `T-0800` - 先建立 `fuelConfigRuntime`，锁定品级来源和降级策略。
2. [x] `T-0801` - 扩展 `fuel_events` 规范事实，给新版审计字段落盘。
3. [x] `T-0802` - 在 `chainSyncEngine` 接入品级加成的新计分公式。
4. [x] `T-0803` - 把新版 `FuelDepositEvent / MatchStreamEvent` 契约推到公开流接口。
5. [x] `T-0900` - 让 `matchStreamService -> matchRuntimeStore` 接住品级数据。
6. [x] `T-0902` - 让 demo 模式先与 live 契约对齐，避免默认演示链路掉队。
7. [x] `T-0901` - 最后重绘 `/match` 事件 feed / overlay 弹幕，接通真实展示。
8. [x] `T-1000` - 跑完单测、集成测试和回归。
9. [x] `T-1001` - 执行 devnet CLI-first 验证并记录命令与结果。
10. [x] `T-1002` - 回填 TODO/Test 记录并关闭 `v2.7` backlog。
11. [x] `T-1100` - 给独立战队 registry 增加 backend mirror 与冷启动 hydrate。
12. [x] `T-1101` - 为 `/planning` 重启后 team count 恢复补回归与门禁验证。
13. [x] `T-1200` - 将独立战队加入改为申请制，并补 planning team applications 事实层。
14. [x] `T-1201` - 支持独立战队成员退出和队长解散。
15. [x] `T-1202` - 扩展 planning team store/service/controller 以承接审批和生命周期控制。
16. [x] `T-1203` - 重绘 `/planning` 交互，接入 approve/reject/leave/disband。
17. [x] `T-1204` - 为 planning team 审批/退出/解散补回归和门禁验证。
18. [x] `T-1300` - 给运行中的本地服务增加模拟 FuelEvent 注入能力。
19. [x] `T-1301` - 提供一键 `/match` live 场景脚本。

## 4. Definition of Done

- Every `Done` item must have:
  - Linked `Feature ID / SPEC Section / Layer / Layer Scope`.
  - Clear acceptance evidence such as tests, logs, or executed commands.
  - No unresolved blocker from dependencies.
- Every frontend task must:
  - Respect `View -> Controller -> Service -> Model`.
  - Use the narrowest possible `Layer Scope`.
  - Pass `pnpm build` and `node ./scripts/check-layer-imports.mjs` before closing.
- Every runtime scoring task must:
  - Keep free / precision mode filtering semantics unchanged.
  - Treat unknown `fuelTypeId` and stale `FuelConfig` as auditable fallback paths rather than silent failures.
- Every contract-facing verification task must:
  - Follow `docs/sui-devnet-testing-standard.md`.
  - Record actual CLI commands, key outputs, and the final verification conclusion.

## 5. Change Log

- 2026-03-31: 按 `docs/PRD.md` v2.7.0、`docs/architecture.md` v6.3、`docs/SPEC.md` v6.5 重建 TODO 活跃基线。
- 2026-03-31: 将旧的 `v2.6` 已完成执行流水账移出活动板面，改为“已交付基线 + v2.7 活跃增量”结构。
- 2026-03-31: 新增 `F-008 / F-009 / F-010` 三组任务，覆盖 `fuelConfigRuntime`、燃料品级计分、流事件契约、overlay 弹幕展示与验证闭环。
- 2026-03-31: 完成 `T-0800 / T-0801 / T-0802 / T-0803 / T-0900 / T-0901 / T-0902 / T-1000`。新增 `src/server/fuelConfigRuntime.ts`、共享 fuel-grade 类型/映射、`fuel_events` runtime projection fact 与 `/api/matches/[id]/fuel-events` 内部落盘 route、`chainSyncEngine` 新公式、stream `fuelDeposit` hydration、`matchRuntimeStore.applyStreamEvent`、live/demo 品级弹幕展示，并验证定向测试、`pnpm typecheck`、`pnpm build`、`node ./scripts/check-layer-imports.mjs` 全部通过。
- 2026-03-31: 完成 `T-1001 / T-1002`。记录了 `devnet` 上 `EVE_FRONTIER_PACKAGE_ID` 不存在的只读验证结果，并以 `testnet` 只读 fallback 成功定位真实 `FuelConfig` object `0x0f354c803af170ac0d1ac9068625c6321996b3013dc67bdaf14d06f93fa1671f`，读取到 6 条真实 `fuel_efficiency` 映射（2 条 Tier 3、4 条 Tier 1、0 条 Tier 2），并基于真实 `DEPOSITED` 事件完成样例计分说明；同时将该 object id 回填到 `.env` 与 `.env.example`。
- 2026-03-31: 新增 `T-1100 / T-1101`，修复独立战队 registry 未落后端导致服务重启后 `/planning` team count 归零的问题。
- 2026-03-31: 完成 `T-1100 / T-1101`。新增 `planning_teams / planning_team_members` backend mirror、route hydration/persistence、缺表明确报错，以及本地 Supabase migration 应用，重启后 `/planning` team count 可恢复。
- 2026-03-31: 新增 `T-1200 / T-1201 / T-1202 / T-1203 / T-1204`，将独立战队加入升级为申请制，并补队长审批、成员退出、队长解散。
- 2026-03-31: 完成 `T-1200 / T-1201 / T-1202 / T-1203 / T-1204`。独立战队已支持 apply -> approve/reject、member leave、captain disband，并新增 `planning_team_applications` backend mirror、API routes、UI controls 与定向回归。
- 2026-03-31: 完成 `T-1300 / T-1301`。新增本地 match 模拟注入 runtime、`/api/matches/[id]/simulate-fuel` 和 `scripts/test-match-live.mjs`，支持在不进入 EVE 客户端的情况下驱动 `/match` live scoreboard / stream / fuel event 展示。
