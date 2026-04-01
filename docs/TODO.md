# TODO: Fuel Frog Panic Active Backlog

Version: v2.7.0
Last Updated: 2026-04-02
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

### F-014 Lobby Entry Cleanup

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-1400 | F-014 | 3.2, Architecture 1.2 | View | View only | 删除 `/lobby` 页面上的 `NODE MAP` 入口按钮，避免继续暴露与“Lobby 为任务发现主入口”相冲突的旧入口 | 文档基线已要求节点地图不再作为默认入口；保留按钮会制造错误导航心智 | - | `LobbyDiscoveryScreen` 不再渲染 `NODE MAP` CTA，且 `pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 | Done |

### F-015 Build Gate Recovery

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-1401 | F-015 | Architecture 4.4, 6.1 | View Shell | View only | 修复 `/match` page 缺少 `Suspense` 边界导致的 Next.js prerender 构建失败，恢复前端门禁可执行性 | 当前 `pnpm build` 无法通过，导致任何前端变更都无法完成正式验证收口 | T-1400 | `src/app/match/page.tsx` 为 `FuelFrogMatchScreen` 提供 `Suspense` 边界，且 `pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 | Done |

### F-016 Wallet Session Persistence

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-1600 | F-016 | Architecture 4.2, 4.4 | Entry / Auth | Controller + Service | 修复钱包连接后刷新页面即断开的缺陷：恢复 dAppKit provider 的自动重连，并避免非用户主动断开时清空 provider 持久化连接信息 | 钱包刷新即断开会打断 `/` 到 Lobby 的主链路，用户每次刷新都要重新授权，无法满足入口体验基线 | - | `buildRuntimeDAppKitConfig` 已锁定 `autoConnect=true` + persisted storage；`pnpm test src/service/suiDappKit.test.ts src/service/walletService.test.ts src/app/api/__tests__/players.test.ts src/server/matchBackendStore.test.ts src/server/matchRuntime.refund.test.ts src/server/matchRuntime.stream.test.ts src/server/matchSimulationRuntime.test.ts src/server/settlementRuntime.test.ts`、`pnpm typecheck`、`pnpm build`、`node ./scripts/check-layer-imports.mjs` 通过 | Done |

### F-017 Lobby Match Backend Hydration

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-1700 | F-017 | 3.2, 5.5, 6.1 | Runtime / Data / API | Runtime + Data | 修复 `/api/matches -> matchDiscoveryRuntime -> matchBackendStore` 的冷启动 hydrate：即使本地已有历史/测试 `matches` projection，也必须继续从 backend merge 新的真实比赛，避免 Lobby 漏掉已创建/已发布比赛 | 当前本地 projection 只要非空就会短路 hydrate，导致 backend 中真实存在的 lobby match 无法进入 Discovery 列表 | - | `src/server/matchBackendStore.test.ts` 已新增“已有本地 projection 时仍能 merge backend matches”回归，并通过 `pnpm test src/server/matchBackendStore.test.ts`、`pnpm typecheck`、`pnpm build`、`node ./scripts/check-layer-imports.mjs` | Done |

### F-018 Solo Lifecycle Verification

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-1800 | F-018 | Architecture 4.1, 4.5 | Frontend Route | View + Controller | 补通 `/planning?matchId=` 到 match-specific `TeamLobbyScreen`，让 Lobby 的 `JOIN MATCH` deep-link 进入真正的比赛战队页而不是继续停留在独立 registry | 当前完整 hosted match 流程少了“比赛战队页”这一段，创建比赛后无法在 UI 内继续完成组队、锁队、支付 | - | `/planning?matchId=<id>` 已渲染比赛战队页，并保持独立 `/planning` registry 默认路径不变 | Done |
| T-1801 | F-018 | 3.3, 5.5, 6.1 | Runtime / API | Runtime + Data | 为单账号本地验证补 `solo verification` helper：自动补齐本队 bot 成员、注入对手队、推进 `running` 与 `settled`，避免 hosted match 验证被多账号/多队规则卡死 | 当前 hosted match 真实规则要求 `minTeams=2` 且 `maxSize>=3`，单账号无法完成完整生命周期验证 | T-1800 | 已新增 solo-fill / solo-seed-rival / solo-start / solo-settle runtime+API，`src/server/teamRuntime.solo.test.ts` 覆盖 auto-fill / rival seeding / start / settle / settlement bill | Done |
| T-1802 | F-018 | Architecture 4.4 | View / Controller / Service | View + Controller | 在比赛战队页接入 local-only solo verification 操作入口，并复用 service/controller 刷新快照，保证不破坏正式 team pay / lock 流程 | 只有 runtime helper 还不够，用户需要在当前 UI 里直接触发这些本地验证动作 | T-1801 | 比赛战队页已显示 local-only helper，并通过 `pnpm test src/server/teamRuntime.solo.test.ts src/server/matchBackendStore.test.ts`、`pnpm typecheck`、`pnpm build`、`node ./scripts/check-layer-imports.mjs` | Done |

### F-018 Lobby Join CTA Visibility

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-1800 | F-018 | 3.2, 3.3, Architecture 4.4 | View / Controller | View + Controller | 修复 `/lobby` 比赛列表与详情的 `JOIN MATCH` CTA：按钮必须始终可见；当当前钱包未建队、队伍不在该比赛、或当前队伍人数不足/未编满时，按钮显示为禁用态并明确提示 blocker，而不是直接不展示 | 当前 Lobby 缺少稳定的 join CTA，玩家在队伍尚未满足参赛条件时看不到入口和失败原因，导致“为什么不能加入”不可解释 | - | `/lobby` 每个比赛卡片和详情侧栏都渲染 `JOIN MATCH` CTA；不满足条件时展示 disabled + blocker 文案；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 | Done |
| T-1801 | F-018 | 3.2, 3.3, Architecture 4.4 | View | View only | 修复 `/lobby` 交互回归：比赛卡片本体必须可选中；disabled `JOIN MATCH` 的 blocker 改为 hover/focus tooltip 提示，避免常驻挤占卡片空间 | 当前版本把卡片选择入口收窄成 `VIEW DETAIL`，且 blocker 常驻展示，导致比赛难以选中、禁用原因呈现过重 | T-1800 | 点击或键盘聚焦比赛卡片即可选中；disabled `JOIN MATCH` 在 hover/focus 时显示 blocker tooltip；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 | Done |
| T-1802 | F-018 | 3.2, Architecture 4.4 | View | View only | 修复 `/lobby` 奖池读数口径：比赛卡片 `Prize Pool` 与详情 `Gross Pool` 统一改为与创建页相同的“满编 projected full pool”显示，而不是直接回显当前已入账 `grossPool` | 当前 Lobby 显示的奖池值与 Create Match 的 prize poster 口径不一致，用户会认为比赛奖池显示错误 | T-1801 | `/lobby` 卡片与详情都显示 `sponsorshipFee + entryFee × maxTeams × 3` 的 projected pool，且 `pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 | Done |
| T-1803 | F-018 | 3.2, Architecture 4.4 | View | View only | 删除 `/lobby` 比赛卡片里的 `VIEW DETAIL` 按钮，保留整卡 click / Enter / Space 选中行为，避免重复 CTA | 当前卡片本体已经可选中，继续保留 `VIEW DETAIL` 只会增加视觉噪音和重复操作 | T-1801 | `MatchCard` 不再渲染 `VIEW DETAIL` 按钮，且 `pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 | Done |

### F-019 Fixed Match Team Size

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-1900 | F-019 | 2.4, 3.1, Architecture 7.1 | View / Controller / Service / Runtime | View + Controller + Service + Runtime | 为比赛创建链路新增 `teamSize`：create-match store、controller、service、`POST /api/matches`、`Match` DTO、runtime/backend projection 都必须持久化固定编制，并让 Lobby/Team Dossier/Team Lobby 读模型返回该字段 | 如果比赛没有固定编制，`entryFee / 人` 无法在创建时推导单队成本与满编奖池，也无法在 Team Lobby 做确定性校验 | - | 创建比赛必须填写 `teamSize`，match DTO 含 `teamSize`，`pnpm build` 与相关测试通过 | Done |
| T-1901 | F-019 | 3.3, 4.3, Architecture 7.3 | View / Controller / Service / Runtime | View + Controller + Service + Runtime | 将 match-specific Team Lobby 改为继承比赛 `teamSize`：创建战队不再自定义 `maxMembers`，只允许配置 `roleSlots` 且总和必须等于 `teamSize`；锁队与支付都按 `teamSize` 校验 | 固定编制如果只存在于 create-match 而不收口到 Team Lobby，规则会在真实报名阶段失效 | T-1900 | `POST /api/teams` / `/api/matches/{id}/teams` 创建战队继承 `teamSize`；锁队要求成员数等于 `teamSize`；支付金额等于 `entryFee × teamSize` | Done |
| T-1902 | F-019 | 3.3, Architecture 4.1, 7.3 | View / Routing | View + Controller | 让 `/planning?matchId=<id>` 实际渲染 `TeamLobbyScreen`，并在页面上明确显示该比赛固定编制与单队报名费，保证 Lobby 的 `JOIN MATCH` deep-link 真正进入 match-specific Team Lobby | 当前 `/planning` 默认只显示独立战队注册页，无法承接比赛固定编制与报名支付规则 | T-1901 | `/planning?matchId=...` 打开 Team Lobby；页面显示 `teamSize` 和固定 `teamEntryFee`；独立 `/planning` 行为不变 | Done |
| T-1903 | F-019 | 6.1 | QA | QA only | 为固定编制收费模型补测试与门禁：create-match 请求包含 `teamSize`、Team Lobby 创建/锁队/支付校验、`/planning?matchId=` 路由切换、build/layer check | 这是业务规则变更，必须有契约回归，否则极易出现 UI/运行时收费口径分裂 | T-1900, T-1901, T-1902 | 定向测试、`pnpm build`、`node ./scripts/check-layer-imports.mjs` 通过，并回填 `docs/test-plan.md` | Done |

### F-020 Deployment Readiness

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-2000 | F-020 | Architecture 12 | Web / Deploy | Service only | 让 Next.js web 服务具备生产部署入口：补 `start-web` 启动脚本、修复固定 `3010` 端口问题、提供 root `Dockerfile` | 当前前端+BFF 无法直接部署到 Railway/容器平台，`start` 写死端口会导致生产平台 healthcheck/ingress 失败 | - | `package.json` 使用动态 `PORT`，root `Dockerfile` 可构建 web，`pnpm build` 通过 | Done |
| T-2001 | F-020 | Architecture 12 | Worker / Deploy | Service only | 参数化 worker 容器入口，允许同一 `workers/Dockerfile` 复用于 `runtime-workers` 与 `node-indexer` 两个 Railway 服务 | 线上至少需要两个长期运行服务；如果 worker 镜像入口写死，部署与运维会反复分叉 | T-2000 | `workers/Dockerfile` 支持通过 `WORKER_ENTRY` 选择 supervisor 或 nodeIndexer 入口 | Done |
| T-2002 | F-020 | Architecture 12 | CI/CD | Docs + Tooling | 提供 GitHub Actions：`ci`、`deploy-staging`、`deploy-production`，串联 build/layer checks、Supabase migrations / functions deploy、Railway service deploy | 没有自动化部署，web、workers、Supabase 三层很容易版本漂移 | T-2000, T-2001 | `.github/workflows/*` 已落地，并包含所需 secrets / vars 约定 | Done |
| T-2003 | F-020 | Architecture 12 | Docs | Docs only | 更新部署文档：环境变量矩阵、Railway/Supabase 服务拆分、手动 Runbook、上线前检查项 | 用户要求前端、BFF、Supabase 全部上线；没有环境矩阵和 Runbook，很难稳定执行 | T-2000, T-2001, T-2002 | `docs/deployment-checklist.md` 与 `docs/deployment-runbook.md` 已回填当前拓扑 | Done |

### F-021 Shell Navigation Density Cleanup

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-2100 | F-021 | Architecture 4.4 | View | View only | 重构共享 `FuelMissionShell` 导航栏：桌面端移除顶部重复的全量路由导航，改为当前路由摘要；移动端补紧凑横向导航条，缓解品牌、路由与主操作同屏拥挤 | 目前 `lg` 以上同时显示顶部全量导航和左侧全量导航，信息重复且按钮文案过长，导致共享壳层第一屏过于拥挤 | - | `FuelMissionShell` 桌面 top bar 不再重复渲染全量路由；移动端可横向切换主路由；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 | Done |

### F-022 Vercel Match Create Timeout Hardening

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-2200 | F-022 | 4.2, 5.5, 6.1 | Runtime / API | Runtime + API | 修复 `POST /api/matches` 在线上创建草稿时的超时：移除创建前不必要的全量 backend hydrate，并压缩 draft 持久化链路，避免每次写请求都扫全量 `matches/teams/team_members/...` | 当前 Vercel `POST /api/matches` 命中 `FUNCTION_INVOCATION_TIMEOUT`，会直接阻断主办方建赛主链路 | - | `POST /api/matches` 不再在创建前触发全量 hydrate；定向 route 回归证明不会请求 `GET /rest/v1/matches?select=*` | Done |
| T-2201 | F-022 | 6.1 | QA | QA only | 为创建草稿链路补线上超时回归：覆盖“Supabase 已配置时 create route 不做全量 hydrate”的路径，并执行定向测试验证 | 这是生产缺陷修复，没有回归很容易在后续路由重构时被带回去 | T-2200 | 新增路由级测试通过，且 `pnpm build` 不回归 | Done |

### F-023 Lobby Match Detail Modal

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-2300 | F-023 | 3.2, Architecture 4.4 | View / Controller | View + Controller | 将 `/lobby` 的比赛详情入口从右侧固定详情栏改为“选中比赛卡片即打开详情弹窗”，并保持现有 `selectedMatchDetail` 读模型与 join CTA 逻辑复用 | 当前右侧详情栏会挤占 Lobby 主视图区；需求改为更聚焦的详情弹窗交互 | - | `/lobby` 不再显示右侧详情边栏；点击比赛卡片后直接弹出详情 modal；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 | Done |
| T-2301 | F-023 | 6.1 | QA | QA only | 为 Lobby 详情弹窗补回归，验证卡片选中后打开 modal、close 后列表仍保持可用，且不破坏 join CTA | 这是交互路径变更，没有回归容易把旧 sidebar 状态残留带回去 | T-2300 | `pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过；未额外新增自动化 UI 测试 | Done |

### F-024 Match Detail Runtime Read-Path Hardening

| TODO ID | Feature ID | SPEC Section | Layer | Layer Scope | Task | Why (value) | Dependency | Acceptance Signal | Status |
|---|---|---|---|---|---|---|---|---|---|
| T-2400 | F-024 | 5.1, 5.2, Architecture 2 | Runtime / API | Runtime only | 收紧 `nodeRuntime` 的 Supabase 回写时机：普通 `GET /api/matches/[id]` / Lobby 详情读取只消费节点快照，不再在被动读路径里触发 `network_nodes` upsert | 当前打开比赛详情会触发非必要的 runtime projection 回写；当 Supabase 未应用 `network_nodes` migration 时会产生误导性控制台报错 | - | 打开比赛详情不再触发被动 `network_nodes` upsert；`src/server/nodeRuntime.ts` 仅在显式刷新/worker 同步路径回写 Supabase | Done |
| T-2401 | F-024 | 6.1 | QA | QA only | 为 `nodeRuntime` 增加回归，验证“已有本地 node index 快照时，普通读取不会请求 Supabase upsert” | 这是线上噪音缺陷修复；如果没有回归，后续 runtime 重构很容易把读路径副作用带回来 | T-2400 | `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/__tests__/nodeRuntime.read-path.test.ts` 通过 | Done |

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
20. [x] `T-1400` - 删除 `/lobby` 页 `NODE MAP` 入口，收口任务发现主入口。
21. [x] `T-1401` - 修复 `/match` page 的 `Suspense` 缺失，恢复 `pnpm build` 门禁。
22. [x] `T-1600` - 恢复钱包 provider persisted session 的自动重连，避免刷新后掉线。
23. [x] `T-1700` - 修复 Lobby match backend hydrate 在本地 projection 非空时被短路的问题。
24. [x] `T-1800` - 补通 `/planning?matchId=` 到真正的比赛战队页。
25. [x] `T-1801` - 为 hosted match 增加单账号本地生命周期 helper。
26. [x] `T-1802` - 在比赛战队页接入 local-only solo verification 操作。
24. [x] `T-1800` - 修复 `/lobby` 的 `JOIN MATCH` CTA 可见性与 blocker 提示。
25. [x] `T-1801` - 修复 `/lobby` 比赛卡片选择交互与 disabled `JOIN MATCH` tooltip。
26. [x] `T-1802` - 统一 `/lobby` 奖池显示为 projected full pool 口径。
27. [x] `T-1803` - 删除 `/lobby` 比赛卡片里的 `VIEW DETAIL` 按钮。
28. [x] `T-1900` - 为比赛创建链路新增固定 `teamSize` 并同步读模型。
29. [x] `T-1901` - 让 match-specific Team Lobby 继承比赛固定编制与固定单队报名费。
30. [x] `T-1902` - 让 `/planning?matchId=` 实际进入 Team Lobby。
31. [x] `T-1903` - 为固定编制收费模型补测试与门禁。
32. [x] `T-2000` - 为 web 服务补动态端口启动与容器入口。
33. [x] `T-2001` - 让 worker 容器支持 supervisor / nodeIndexer 双入口。
34. [x] `T-2002` - 增加 CI、staging、production GitHub Actions。
35. [x] `T-2003` - 补部署环境矩阵与手动 Runbook。
36. [x] `T-2100` - 压缩共享壳导航密度，去掉桌面重复导航并补移动端紧凑导航条。
37. [x] `T-2200` - 修复 `POST /api/matches` 的 Vercel 超时，去掉创建前全量 hydrate 并压缩 draft 持久化请求。
38. [x] `T-2201` - 为创建草稿链路补“不做全量 hydrate”的定向回归。
39. [x] `T-2300` - 将 `/lobby` 的比赛详情从右侧边栏改为卡片选中即弹出 modal。
40. [x] `T-2301` - 为 Lobby 详情弹窗交互补回归与构建验证。
41. [x] `T-2400` - 收紧比赛详情节点读取的 Supabase 回写时机，去掉被动读路径的 `network_nodes` upsert。
42. [x] `T-2401` - 为 nodeRuntime 补“读路径不写”的定向回归。

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
- 2026-03-31: 新增 `T-1400`，删除 `/lobby` 页面遗留的 `NODE MAP` 入口按钮，保持 Lobby 作为任务发现唯一主入口。
- 2026-03-31: 新增 `T-1401`，修复验证阶段暴露的 `/match` page `useSearchParams()` 缺少 `Suspense` 边界问题，恢复 Next.js 构建门禁。
- 2026-03-31: 完成 `T-1400 / T-1401`。`/lobby` 已移除 `NODE MAP` CTA；`/match` page 新增 `Suspense` 页壳 fallback 以满足 Next.js 15 prerender 约束；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 均通过。
- 2026-03-31: 新增 `T-1600`，修复钱包连接后刷新页面会丢失 dAppKit provider session 的问题，范围限定在 `Entry / Auth` 的 `Controller + Service`。
- 2026-03-31: 完成 `T-1600`。`src/service/suiDappKit.ts` 已启用 persisted wallet session 的 `autoConnect`，`src/controller/useAuthController.ts` 不再手动清空 dAppKit 的连接存储；新增 `src/service/suiDappKit.test.ts`，并通过定向测试、`pnpm typecheck`、`pnpm build` 与 `node ./scripts/check-layer-imports.mjs`。
- 2026-03-31: 新增 `T-1700`，修复 Lobby 发现链路在本地已有历史/测试 match projection 时无法继续从 backend merge 真实比赛的问题。
- 2026-03-31: 完成 `T-1700`。`src/server/matchBackendStore.ts` 不再因本地 `matches` 非空而整体跳过 backend hydrate，`/api/matches` 可继续 merge 真实 lobby match；新增 `src/server/matchBackendStore.test.ts` 回归并通过 `pnpm typecheck`、`pnpm build`、`node ./scripts/check-layer-imports.mjs`。
- 2026-03-31: 新增 `T-1800 / T-1801 / T-1802`，补通 `/planning?matchId=` 到比赛战队页，并为 hosted match 增加单账号本地生命周期验证 helper。
- 2026-03-31: 完成 `T-1800 / T-1801 / T-1802`。`/planning?matchId=` 已切到 `TeamLobbyScreen`；新增 local-only solo verification API/runtime (`solo-fill / solo-seed-rival / solo-start / solo-settle`) 与页面操作入口，单账号可完成 hosted match 的建队、补位、锁队、支付、开赛、结算验证；并通过定向测试、`pnpm typecheck`、`pnpm build` 与 `node ./scripts/check-layer-imports.mjs`。
- 2026-03-31: 新增 `T-1800`，修复 `/lobby` 比赛卡片和详情侧栏缺少稳定 `JOIN MATCH` CTA 的问题，并要求在队伍未就绪时显示禁用态与 blocker 原因。
- 2026-03-31: 完成 `T-1800`。`/lobby` 比赛卡片新增显式 `VIEW DETAIL + JOIN MATCH` 操作区；详情侧栏补齐同一套 `JOIN MATCH` CTA；按钮会基于当前钱包的 active squad 状态显示 disabled blocker（未连钱包、未建队、队伍属于其他比赛、队伍未编满）；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过。
- 2026-03-31: 新增 `T-1801`，修复 `/lobby` 比赛卡片无法直接选中，以及 disabled `JOIN MATCH` blocker 常驻展示过重的问题，改为 hover/focus tooltip 呈现。
- 2026-03-31: 完成 `T-1801`。比赛卡片本体已恢复 click / Enter / Space 选中；disabled `JOIN MATCH` 改为 wrapper tooltip，在 hover 或 focus 时显示 blocker；详情侧栏同步改为提示用户 hover disabled 按钮查看原因；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过。
- 2026-03-31: 新增 `T-1802`，修复 `/lobby` 的 `Prize Pool / Gross Pool` 与 Create Match prize poster 口径不一致的问题，统一按满编 projected pool 显示。
- 2026-03-31: 完成 `T-1802`。`/lobby` 比赛卡片 `Prize Pool` 与详情 `Gross Pool` 改为使用 `sponsorshipFee + entryFee × maxTeams × 3` 的 projected full pool，并对已入账 `grossPool` 取上限保护；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过。
- 2026-04-01: 新增 `T-1803`，删除 `/lobby` 比赛卡片中重复的 `VIEW DETAIL` 按钮，保留整卡可选中交互。
- 2026-04-01: 完成 `T-1803`。`/lobby` 比赛卡片已移除重复的 `VIEW DETAIL` 按钮；整卡 click / Enter / Space 选中交互保持不变；清理 `.next` 后重新执行 `pnpm build` 与 `node ./scripts/check-layer-imports.mjs`，均通过。
- 2026-03-31: 新增 `T-1900 / T-1901 / T-1902 / T-1903`，将“报名费按人收”正式收口为“比赛创建时必须定义固定 `teamSize`”，并要求 Team Lobby、支付金额、deep-link 路由与测试门禁同步升级。
- 2026-03-31: 完成 `T-1900 / T-1901 / T-1902 / T-1903`。create-match 已新增固定 `teamSize` 字段并驱动 projected pool；`/api/matches`、`matchRuntime`、backend projection 与 discovery DTO 已持久化 `teamSize`；match-specific Team Lobby 创建战队改为继承比赛编制、支付金额改为 `entryFee × teamSize`；`/planning?matchId=` 已实际切换到 `TeamLobbyScreen`；定向测试、`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过。
- 2026-04-01: 新增 `T-2000 / T-2001 / T-2002 / T-2003`，为 Railway + Supabase 生产部署补齐 web 入口、worker 容器参数化、GitHub Actions 和手动 Runbook。
- 2026-04-01: 完成 `T-2000 / T-2001 / T-2002 / T-2003`。新增 `scripts/start-web.mjs`、root `Dockerfile`、`.dockerignore`，将 `package.json` 的 web 启动改为动态 `PORT`；`workers/Dockerfile` 现可通过 `WORKER_ENTRY` 复用为 `runtime-workers` 与 `node-indexer`；新增 `.github/workflows/ci.yml`、`deploy-staging.yml`、`deploy-production.yml`；重写 `docs/deployment-checklist.md` 并新增 `docs/deployment-runbook.md`；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过。
- 2026-04-01: 新增 `T-2100`，收紧共享 `FuelMissionShell` 的导航密度，解决桌面端顶部导航与左侧导航重复导致的第一屏拥挤问题。
- 2026-04-01: 完成 `T-2100`。`src/view/components/FuelMissionShell.tsx` 的 desktop top bar 已改为品牌 + 当前路由摘要 + 主操作，移除重复的顶部全量路由按钮；移动端新增横向滚动紧凑导航条；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过。
- 2026-04-01: 新增 `T-2200 / T-2201`，修复 `POST /api/matches` 在线上 Vercel 部署中的 `FUNCTION_INVOCATION_TIMEOUT`，重点收口创建前全量 backend hydrate 与 draft 持久化请求链路。
- 2026-04-01: 完成 `T-2200 / T-2201`。`src/app/api/matches/route.ts` 已移除 create draft 前的全量 `hydrateRuntimeProjectionFromBackendIfNeeded()`；`src/server/matchBackendStore.ts` 为 Supabase REST 请求增加 5 秒 timeout，并在空队伍 draft 持久化时跳过无意义的 team delete；新增 `src/app/api/__tests__/f007-match-flow.test.ts` 回归，验证 `POST /api/matches` 不再请求 `GET /rest/v1/matches?select=*`；`pnpm build` 通过。
- 2026-04-01: 新增 `T-2300 / T-2301`，将 `/lobby` 的比赛详情交互从右侧固定边栏改为卡片选中即打开详情弹窗。
- 2026-04-01: 完成 `T-2300 / T-2301`。`src/controller/useLobbyDiscoveryScreenController.ts` 新增 detail modal 生命周期与 `Escape` 关闭；`src/view/screens/LobbyDiscoveryScreen.tsx` 移除了右侧 `Match Detail` 固定栏，改为单列 Lobby 列表 + `MatchDetailModal` 弹窗，继续复用现有 `selectedMatchDetail`、join CTA 与 free-mode recommendations；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过。
- 2026-04-02: 新增 `T-2400 / T-2401`，修复打开比赛详情时 `nodeRuntime` 在被动读路径中误触发 `network_nodes` Supabase upsert 的控制台噪音。
- 2026-04-02: 完成 `T-2400 / T-2401`。`src/server/nodeRuntime.ts` 现在只在显式刷新路径回写 `network_nodes` 到 Supabase，普通比赛详情读取保持只读；新增 `src/server/__tests__/nodeRuntime.read-path.test.ts` 回归，并通过定向测试与 `pnpm build`。
