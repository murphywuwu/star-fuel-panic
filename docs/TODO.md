# TODO: Fuel Frog Panic Execution Backlog

Version: v2.6.1
Last Updated: 2026-03-27
Source Docs: `docs/PRD.md` v2.6, `docs/architecture.md` v6.0, `docs/SPEC.md` v6.0
Maintainer: Todo Agent

---

## 0. One-Screen Execution Summary (Problem / Why / How)

- Problem this execution batch solves:
  当前 TODO 仍带有 `PRD v2.3 / mission / host_created / official_free_target` 时代的分组与术语，已经无法作为 `PRD v2.6` 的执行源。
- Why these tasks now:
  `PRD v2.6` 新增并固化了星系选择规则、`free / precision` 双模式、创建与发布拆分、Lobby 位置推荐、以及 5% 平台抽成；这些都要求 TODO 重新排布关键路径。
- How we solve it (critical 3-step execution path):
  1. 先把比赛创建、发布、发现三条 API/前端链路切到 `match / solar-system / network-node` 新口径。
  2. 再补齐 Team Lobby、Match Runtime、Settlement 对新奖池和新状态机的接口收口。
  3. 最后完成 projection runtime、worker、devnet 集成和回归测试，收敛遗留 `mission` 兼容层。
- Expected delivery outcome:
  `docs/TODO.md` 成为当前唯一可执行待办基线，明确哪些能力已落地，哪些仍需按 PRD v2.6 补齐。

## 0.1 Before vs After (Execution Value)

| Dimension | Before | After |
|---|---|---|
| Delivery clarity | TODO 仍引用旧 PRD 和旧模式命名 | TODO 与 PRD v2.6 / SPEC v6.0 对齐 |
| Delivery speed | 新需求混在旧 backlog 中，难以排关键路径 | 未完成项按依赖顺序收敛到可执行主线 |
| Delivery confidence | 很难判断哪些是已做能力，哪些是文档欠账 | 每个任务都带状态、依赖、验收信号 |

## 1. Document Control

- Project/App: `Fuel Frog Panic`
- Related PRD: `docs/PRD.md`
- Related SPEC: `docs/SPEC.md`
- Related Architecture: `docs/architecture.md`
- Template Used: `docs/templates/todo-template.md`
- Notes:
  当前文档将旧版细粒度 TODO 聚合为 v2.6 基线任务；任务完成态统一使用表格首列 `Done` 的 `[x]/[ ]` 标记，并结合当前路由/runtime 结构做了最小核对。

## 2. Task Board

### F-000 Entry / Wallet / Auth

| Done | TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal |
|---|---|---|---|---|---|---|---|---|
| [x] | T-0001 | F-000 | 3.1 | View / Controller | 保持钱包连接引导、地址栏、余额刷新、断开重连链路可用 | 所有比赛/付费行为的前置入口 | - | 首页与侧栏能正确显示 `Connect / Address / Balance / Exit` |
| [x] | T-0002 | F-000 | 3.1 | Service / Model | 维持 `authService`、`walletService`、`authStore` 与 dApp Kit provider 的真实连接态同步 | 避免假连接和错误余额口径 | T-0001 | 连接后 `authStore.walletAddress/isConnected` 与 UI 一致 |
| [x] | T-0003 | F-000 | 3.1, 6.1 | Service / API | 保持身份挑战签名与真实支付 digest 回填能力 | 为写接口鉴权和链上归因提供可信身份 | T-0002 | 支付后可拿到真实 tx digest，错误码可透传展示 |
| [x] | T-0004 | F-000 | 6.2 | QA | 持续回归 `EXIT -> refresh -> CONNECT`、余额显示、连接失败态 | 钱包链路是所有主流程的单点风险 | T-0001 | 回归用例覆盖连接成功、拒签、余额异常、刷新重连 |
| [x] | T-0005 | F-000 | 3.1 | View / Controller | 将 EVE Vault 连接弹窗改为受控开关，并在 provider 已连接时立即关闭，不再依赖用户手动再点一次 | 当前 connect modal 在登录成功后仍残留，破坏首个主入口体验 | T-0001, T-0002 | 登录成功后 `walletConnection.status=connected` 或 `authStore.isConnected=true` 时弹窗自动消失 |
| [x] | T-0006 | F-000 | 3.1 | Controller / Service / View | 修复钱包 LUX coin 配置在读取与支付两条链路中的一致性：优先使用链上 coin metadata decimals，避免小额非零余额被格式化成 `0`，并让入场费支付支持真实 LUX coin type | 当前 balance 口径受默认 decimals 和 UI 格式化双重影响；若切到真实 LUX coin type，旧支付实现又只支持 `SUI` | T-0002, T-0004 | 钱包余额在 `decimals=0` 时保持 `500000`，在 `decimals=9` 且原始值为 `500000` 时显示非零值而非 `0`；入场费支付不再因非 `SUI` coin type 被直接拒绝 |
| [x] | T-0007 | F-000 | 3.1 | Config / Service | 将 `NEXT_PUBLIC_LUX_COIN_TYPE` 从 `coin_registry::Currency<...>` 更正为实际 coin type `0xf044...::EVE::EVE`，使 `StateService/GetBalance` 与支付构币都命中真实 LUX 对象 | `GetBalance` 需要的是 coin 的实际 Move type；传注册表包装类型会命中 `Coin<Currency<...>>`，返回 0 | T-0006 | 使用 `GetBalance` 查询真实钱包时，不再因错误的 `coinType` 字符串稳定返回 `0` |
| [x] | T-0008 | F-000 | 3.1 | View / Controller | 修复 `disconnect -> reconnect` 第二次连接卡在 `Awaiting connection...`：每次重新打开钱包弹窗都创建全新 modal 实例，并在发起新连接前先清理潜在残留 session | 当前 EVE Vault 在断开后第二次连接会卡死在等待态，说明 modal 或 provider 残留了上一轮连接状态 | T-0002, T-0005 | 执行 `CONNECT -> EXIT -> CONNECT` 时，第二次连接不会卡在 `Awaiting connection...` |
| [x] | T-0009 | F-000 | 3.1 | Controller / Service | 为 LUX 余额读取增加 `listBalances` 回退和可观测错误输出，避免 `GetBalance` 异常或零值误判时前端继续显示 `0 LUX` | 当前前端在单币余额查询异常时会静默写入 `0`，用户只能看到错误结果，看不到失败原因 | T-0006, T-0007 | 当 `getBalance` 返回 0 或抛错时，前端会尝试从 `listBalances` 精确匹配目标 coin type；查询失败会输出明确错误，不再静默吞掉 |

### F-001 Match Creation & Publish

| Done | TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal |
|---|---|---|---|---|---|---|---|---|
| [x] | T-0100 | F-001 | 4.1, 5.1 | Runtime / API | 保持 `GET /api/solar-systems`、`GET /api/solar-systems/[id]`、`GET /api/solar-systems/map` 作为星系基础查询底座 | v2.6 的星系选择器依赖真实星系与 gate 数据 | - | 路由返回 `systemId/systemName/constellationId/regionId/gateLinks` |
| [x] | T-0101 | F-001 | 4.1, 5.1, 5.2 | Runtime / API | 新增 `GET /api/constellations`、`GET /api/constellations/{id}`、`GET /api/search`、`GET /api/solar-systems/recommendations` | PRD v2.6 要求搜索优先 + 推荐 + 星座浏览辅助 | T-0100 | 可按紧急节点、名称、可选性返回星座/星系列表和推荐结果 |
| [x] | T-0102 | F-001 | 3.1 | View / Controller / Model | 实现 `createMatchStore`、`useCreateMatchController` 和创建页 UI，支持 `free / precision`、星系选择、精准模式选点、奖池预览 | 当前创建流程仍偏旧模式，无法完整覆盖 v2.6 | T-0100, T-0101 | 创建页可完整填写 `solarSystemId/targetNodeIds/sponsorshipFee/maxTeams/entryFee/durationHours` |
| [x] | T-0103 | F-001 | 2.2, 2.4, 4.2, 5.5 | Runtime / API / Type | 将 `official_free_target / host_created` 契约迁移为 `free / precision`，统一 DTO、类型与过滤参数 | 避免旧术语继续扩散到前后端接口 | - | `GET/POST /api/matches` 与共享类型只暴露 `free / precision` |
| [x] | T-0104 | F-001 | 4.2, 5.5, 6.1 | Runtime / API | 拆分创建与发布：`POST /api/matches` 生成 draft，`POST /api/matches/{id}/publish` 完成赞助费锁定确认 | 对齐 PRD v2.6 的“创建与发布分离” | T-0102, T-0103 | draft 创建成功后必须通过 publish 才进入 `lobby` |
| [x] | T-0105 | F-001 | 2.6, 5.5, 6.2 | Runtime / Data | 在 publish 阶段校验 `sponsorshipFee >= 500`、星系可选性、精准模式 `1-5` 目标节点，并写入 `match_target_nodes` 快照与幂等键 | 这是创建比赛最核心的业务规则 | T-0104 | 非法参数返回规范错误码；重复 publish 返回同一结果 |
| [x] | T-0106 | F-001 | 3.1, 4.2 | QA | 补齐自由模式/精准模式创建与发布回归用例 | 新模式与旧接口切换风险高 | T-0104, T-0105 | 覆盖 free/precision、不可选星系、赞助费不足、目标节点越界 |

### F-002 Lobby Discovery & Participation

| Done | TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal |
|---|---|---|---|---|---|---|---|---|
| [x] | T-0200 | F-002 | 4.1, 4.2 | Runtime / API | 保持 `GET /api/matches`、`GET /api/matches/[id]` 作为比赛大厅的基础读接口 | Lobby 是 PRD v2.6 的主入口 | - | 路由能返回 lobby 比赛列表和详情 |
| [x] | T-0201 | F-002 | 2.3, 2.4, 4.1, 4.2 | Runtime / API / Type | 对齐 Lobby DTO：强制包含模式标签、目标星系、目标节点说明、总奖池、入场费、战队进度、距离提示 | 当前比赛卡片字段口径仍不完整 | T-0103 | `GET /api/matches` 返回字段可直接驱动 PRD 卡片与详情页 |
| [x] | T-0202 | F-002 | 3.2 | Model / Service / Controller | 实现 `locationStore`、`useLocationController` 与“我的位置”设置流程 | 距离排序和推荐节点依赖用户当前位置 | T-0100 | 用户可以按 Region -> Constellation -> System 选择当前位置 |
| [x] | T-0203 | F-002 | 4.1, 5.4 | Runtime / API | 对外暴露 `GET /api/network-nodes/recommendations`，复用现有 `nodeRecommendationRuntime` | 自由模式需要按跳数和紧急度推荐目标节点 | T-0202 | 可按 `currentSystem/maxJumps/urgency/limit` 返回排序后的推荐节点 |
| [x] | T-0204 | F-002 | 3.2, 4.1 | View / Controller | 在 Lobby 接入模式/距离/状态筛选、比赛详情预览和距离展示 | 完成“发现并参加比赛”的主链路 | T-0201, T-0202, T-0203 | Lobby 可展示筛选结果、详情弹窗和基于 gateLinks 的跳数 |
| [x] | T-0205 | F-002 | 4.5 | View / API | 将旧 `/missions` 叙事和独立节点地图入口降级为兼容层，不再作为主发现入口 | PM 已明确主入口统一为 Lobby | T-0204 | 默认导航和主 CTA 全部进入 Lobby/Planning 新链路 |
| [x] | T-0206 | F-002 | 3.2, 4.1 | QA | 补齐“设置位置 -> 浏览列表 -> 查看详情 -> 进入组队大厅”回归 | 新的发现入口需要完整可测 | T-0204, T-0205 | `node --experimental-strip-types --test src/server/matchDiscoveryRuntime.test.ts src/service/locationService.test.ts src/server/nodeRecommendationRuntime.test.ts` 通过，覆盖无位置、无推荐、拓扑缺失、接口错误态 |

### F-003 Team Lobby / Join / Lock / Pay

| Done | TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal |
|---|---|---|---|---|---|---|---|---|
| [x] | T-0300 | F-003 | 4.3, 5.6 | Runtime / API | 保持 `POST /api/teams`、`/join`、`/leave`、`/lock`、`/pay`、`/refund` 基础链路可用 | 组队与支付是从 Lobby 进入比赛的刚需步骤 | - | 创建、加入、离开、锁队、付款、退款路由全部可调用 |
| [x] | T-0301 | F-003 | 3.3 | View / Controller / Model | 保持现有组队页、角色槽位、队长操作和支付编排能力 | 现有 `/planning` 已承载大部分队伍流程 | T-0300 | UI 可展示队伍列表、槽位状态、锁队按钮和支付入口 |
| [x] | T-0302 | F-003 | 5.6 | Runtime / Contract | 保持付款后写入白名单、记录 tx digest、支持锁定前退款规则 | 白名单是链上计分过滤第一道门 | T-0300 | 付款后整队地址进入白名单；锁定前可退，比赛中不可退 |
| [x] | T-0303 | F-003 | 3.3, 4.3 | Model / Controller / Type | 按 architecture v6.0 收口 `teamLobbyStore` 与 `useTeamLobbyController`，避免继续复用过宽的 `lobbyStore` | 当前前端域边界仍有旧状态混用风险 | T-0204, T-0301 | `/planning` 已切回 Team Lobby，`teamLobbyStore -> teamLobbyService -> useTeamLobbyController` 成为独立 team 域链路，且新 controller 不再直接读 model |
| [x] | T-0304 | F-003 | 2.1, 2.4, 4.3 | Runtime / API | 对齐错误码和校验：`TEAM_FULL / TEAM_LOCKED / ROLE_SLOT_FULL / PAYMENT_MISMATCH` 等 | 与 SPEC v6.0 保持一致，便于前端直出用户提示 | T-0300 | 典型失败场景返回规范错误码与 retryable 语义 |
| [x] | T-0306 | F-003 | 2.2, 2.4, 3.3, 4.3 | Runtime / API / View / Controller | 将入队流程改为“申请制”：`POST /join` 返回 `pending`，队长通过 `approve/reject` 审批，前端展示待审批与审批动作 | PRD 已明确加入战队需队长同意/拒绝，当前链路仍是直加入 | T-0303, T-0304 | `teamRuntime`、审批端点与 `TeamLobbyScreen` 已接通 pending / approve / reject / lock / pay 全链路 |
| [x] | T-0307 | F-003 | 3.3 | View | 将 `/planning` 页的创建战队表单从页面直出改为按钮触发 modal，保留现有 `createTeam` controller/service 链路不变 | 当前 Team Lobby 首屏被大表单占据，弱化了战队列表和审批主视图 | T-0303, T-0306 | `/planning` 首屏只显示创建入口按钮；点击后弹出创建战队 modal，提交成功后自动关闭并刷新消息 |
| [x] | T-0305 | F-003 | 3.3, 4.3 | QA | 在 `draft -> publish -> apply -> approve/reject -> lock -> pay` 新链路下重跑 Team Lobby 回归 | 入队申请审批上线后，旧回归结论不再充分 | T-0104, T-0303, T-0306 | `node --import ./scripts/register-test-loader.mjs --experimental-strip-types --test src/app/api/__tests__/f007-match-flow.test.ts` 通过，覆盖 apply / approve / reject / lock / pay 主链路 |

### F-004 Match Runtime / Scoring / Overlay

| Done | TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal |
|---|---|---|---|---|---|---|---|---|
| [x] | T-0400 | F-004 | 5.5, 5.7 | Runtime | 保持比赛状态机、`match-tick`、Panic 广播、非法迁移审计逻辑 | `Lobby -> PreStart -> Running -> Panic -> Settling` 是核心玩法主线 | - | 状态迁移符合 PRD，最后 90 秒准确进入 Panic |
| [x] | T-0401 | F-004 | 5.7 | Runtime / Data | 保持 `chainSyncEngine` 的三重过滤、得分公式、去重和审计日志 | 计分可信度直接决定比赛有效性 | T-0302 | 非白名单/非目标节点/窗口外事件均不计分 |
| [x] | T-0402 | F-004 | 3.4 | View / Controller / Model | 保持 `/match` 页倒计时、实时分数板、弹幕、Panic 视觉效果 | 前端比赛体验已经具备基础实现，应继续稳定 | T-0400, T-0401 | `/match` 页面能展示状态、剩余时间、得分和事件流 |
| [x] | T-0403 | F-004 | 4.2, 6.1 | Runtime / API | 补齐 `GET /api/matches/{id}/scoreboard` 与 `GET /api/matches/{id}/stream`（SSE）的公开契约 | SPEC v6.0 已将状态快照与流接口正式化 | T-0401 | 前端不依赖隐式内部订阅，也能按公开接口取数 |
| [x] | T-0404 | F-004 | 3.4, 4.5 | Codebase Cleanup | 清理前端/服务层残留的 `mission`、`fuelMission` 命名，保留必要兼容层但停止扩散 | 否则新 PRD 术语无法在代码中稳定落地 | T-0103, T-0205 | 新增代码不再引入 `mission` 命名；旧接口集中在兼容层 |
| [x] | T-0405 | F-004 | 3.4, 5.7 | QA | 维持主流程回归：`Lobby -> Lock -> Pay -> Running -> Panic -> Settling` | 当前已存在的主链路回归仍需保留 | T-0400, T-0401, T-0402 | 关键路径在本地/测试环境可稳定跑通 |

### F-005 Settlement / Revenue Split

| Done | TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal |
|---|---|---|---|---|---|---|---|---|
| [x] | T-0500 | F-005 | 3.5, 5.8 | View / Controller / Model | 保持结算页、账单加载、个人分账与 MVP 展示能力 | 用户最终感知价值集中在结算页 | - | `/settlement` 可展示奖池、队伍分配、个人分配、MVP |
| [x] | T-0501 | F-005 | 2.5, 4.4, 5.8 | Runtime / API / Type | 将结算账单口径更新为 `sponsorshipFee + entryFeeTotal + platformSubsidy`，并统一 5% 平台抽成字段 | 当前部分实现仍带旧 `hostPrizePool` 语义 | T-0103, T-0105 | `SettlementBill` 与 PRD/SPEC 字段完全一致，示例计算正确 |
| [x] | T-0502 | F-005 | 5.8, 6.2 | Runtime / Contract | 保持幂等结算、链上发奖与重复请求回放逻辑 | 结算是高风险资金动作 | T-0401 | 重复结算不会重复出账，能返回同一 payout 结果 |
| [x] | T-0503 | F-005 | 4.4 | Runtime / API | 保持 `GET /api/matches/{id}/result` 账单接口可用 | 战报页和链上追溯依赖该接口 | T-0500 | 账单接口返回队伍/成员分配细项和 tx 关联信息 |
| [x] | T-0504 | F-005 | 5.8 | QA | 持续验证 2 队 / 3 队 / 4+ 队比例，以及 0 分成员奖金为 0 | 奖金规则需要稳定可信 | T-0501, T-0502 | 回归覆盖排名比例、贡献占比、MVP 生成 |
| [x] | T-0505 | F-005 | 4.4, 5.8 | Runtime / API | 新增 `GET /api/matches/{id}/settlement` 状态接口，并和 `result` 读模型分离 | 对齐 PRD 的 `Settling` 等待页与结果页双态 | T-0501 | 结算中与已结算状态可分别查询并驱动不同页面 UI |

### F-006 Projection Runtime / Data / Worker Hardening

| Done | TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal |
|---|---|---|---|---|---|---|---|---|
| [x] | T-0600 | F-006 | 5.3 | Runtime / API | 保持 `nodeIndexer`、`GET /api/nodes`、`GET /api/nodes/[id]`、过滤统计接口可用 | `network-node` 读模型是 PRD v2.6 的底座数据 | - | 节点列表可按 `urgency/hasMatch/isOnline/typeId/solarSystem` 读取 |
| [x] | T-0601 | F-006 | 2.3, 5.3 | Runtime / Data | 完成 `LocationRevealedEvent -> coordX/coordY/coordZ/solarSystem` 解析和双 cursor 增量同步，确保星系可选性判断可信 | 星系选择与节点推荐都依赖准确坐标 | T-0600 | `/api/nodes` 坐标和星系字段与链上/索引结果一致 |
| [x] | T-0602 | F-006 | 6.2 | Data / Runtime | 将剩余本地 mock / 内存读模型迁移到 architecture 规定的投影表：`solar_systems_cache`、`constellation_summaries`、`network_nodes`、`matches`、`match_target_nodes`、`match_stream_events` 等 | 为多 worker 和 Realtime 做准备 | T-0105, T-0201, T-0601 | 关键运行时不再依赖本地静态数据或临时内存对象 |
| [x] | T-0603 | F-006 | 5.1 | Runtime / Deployment | 抽离并部署 `nodeRuntime`、`matchRuntime`、`chainSyncEngine`、`settlementRuntime` worker，补健康检查和重启策略 | 长连接和状态机不应依赖前端进程存活 | T-0602 | worker 可独立运行并报告健康状态 |
| [x] | T-0604 | F-006 | 5.1, 5.2 | Runtime / API | 实现 `constellationRuntime` 和对应聚合刷新，为星座浏览与推荐接口提供读模型 | PRD v2.6 新增了星座级交互入口 | T-0602 | 星座列表能返回 `urgentNodeCount/selectableSystemCount/sortScore` |
| [x] | T-0605 | F-006 | 6.1, 6.2 | API / Platform | 在写接口统一支持 `X-Idempotency-Key`、结构化错误和 `stale=true` 返回规则 | 对齐 SPEC v6.0 的平台契约 | T-0104, T-0505 | 创建、发布、支付、结算接口都支持幂等和统一错误体 |
| [x] | T-0606 | F-006 | 5.5, 5.6, 5.8 | Contract / Devnet | 用真实 devnet 链路接入赞助费锁定、白名单注册、开赛、结算发奖，替换剩余模拟链路 | 资金与积分动作最终必须落到真实链上 | T-0105, T-0302, T-0501 | 可执行端到端 devnet 调用并记录 tx digest/事件结果 |
| [x] | T-0607 | F-006 | 6.1 | API / Security | 补齐写接口钱包签名验证中间件 | 避免匿名伪造创建/支付/锁队请求 | T-0003 | 写接口全部要求合法地址、消息和签名组合 |

### F-007 Testing / Observability / Governance

| Done | TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal |
|---|---|---|---|---|---|---|---|---|
| [x] | T-0700 | F-007 | Architecture 4.4 | Governance | 保持 import lint 和分层规则，继续强制 `View -> Controller -> Service -> Model` | 防止前端在重构中再次破层 | - | lint 能阻止 View 直连 Service/Model/DB |
| [x] | T-0701 | F-007 | 6.3, 6.4 | Runtime / Observability | 维持 `event lag / ws latency / settlement success` 等关键指标与审计原因码 | 便于排查链上和流处理问题 | T-0401, T-0502 | 运行时可输出结构化日志和关键指标 |
| [x] | T-0702 | F-007 | 4.1, 4.2, 4.3 | QA | 为 v2.6 新接口补单测/集成测试：星座搜索、比赛发布、Lobby 位置、推荐节点 | 文档变更最大的一批能力需要回归护栏 | T-0101, T-0104, T-0203 | 新增 API 均有最小测试覆盖 |
| [x] | T-0703 | F-007 | 3.x, 4.x, 5.x | E2E | 构建全链路 E2E：`Connect -> Create Draft -> Publish -> Join Team -> Pay -> Run -> Settle` | 这是当前最重要的业务闭环 | T-0104, T-0305, T-0505 | 单条 E2E 可覆盖端到端核心路径 |
| [x] | T-0704 | F-007 | Contract / Devnet | QA | 执行 CLI-first devnet 验证，覆盖 publish / whitelist / start / score / settle | 合约交付必须符合仓库 testing standard | T-0606 | 记录实际命令、关键输出和验证结果 |
| [x] | T-0705 | F-007 | 6.1, 6.2 | QA | 增补异常流回归：world API stale、拓扑缺失、重复 publish、重复结算、签名失败 | 当前异常路径仍缺系统化回归 | T-0605, T-0607 | 异常流都有明确错误码、重试策略和日志 |
| [x] | T-0706 | F-007 | Architecture 4.4 | Governance / Refactor | 修复 `useCreateMatchController`、`useLobbyController`、`useMatchController` 的 `controller -> model` 违规，恢复 import lint 通过 | 当前 lint 失败阻塞工程质量基线 | T-0700 | `pnpm lint:imports` 已通过，controller 不再直接 import model |
| [x] | T-0707 | F-007 | 6.1, 6.2 | Runtime / Type | 修复 `nodeIndexerRuntime`、`nodeRecommendationRuntime`、`locationService.test` 的类型错误，恢复 `pnpm typecheck` | 当前 typecheck 失败阻塞合并与回归 | T-0601, T-0602 | `pnpm typecheck` 已通过 |
| [x] | T-0708 | F-007 | 4.x, 6.1 | QA / Tooling | 用 test loader 跑通关键 route/runtime 回归，并修复 loader 对相对无扩展名 import 的解析问题 | 当前 node test 环境对 alias/相对路径解析不稳 | T-0703 | `node --import ./scripts/register-test-loader.mjs --experimental-strip-types --test src/app/api/__tests__/f007-match-flow.test.ts` 已通过 |
| [x] | T-0709 | F-007 | Architecture 4.1, 4.4 | View / Controller | 修复主导航 tab 切换迟滞，并移除比赛页预渲染阶段的 `window is not defined` 风险 | 当前 mission shell 在所有主路由中都挂载钱包弹窗 UI，导致 SSR 不安全且增加路由切换开销 | T-0700 | `pnpm build` 通过，`/lobby -> /planning -> /match -> /settlement` 切换不再被钱包 UI 阻塞 |
| [x] | T-0710 | F-007 | Architecture 3, 4.4 | View / Controller / Runtime | 优化首页首屏性能，避免 `/lobby` 初始化时同步拉取重型位置数据，并减少 discovery 接口对 8MB 投影文件的重复解析 | 当前页面首屏会预取位置选择器数据，且 runtime 每次请求都同步读取大投影文件，导致页面“出不来”且明显卡顿 | T-0700 | 首屏不再在 picker 关闭时请求 `constellations/recommendations`，`pnpm build` 通过，discovery 接口首字节时间明显下降 |
| [x] | T-0711 | F-007 | 4.1, 6.1 | View / Controller / Runtime / API | 继续优化位置选择器性能，将 `constellations` 浏览链改为 `region -> constellations -> systems` 分段加载，避免初始返回 500KB 星座列表 | 当前 picker 首次打开仍会下载 2214 条星座摘要，数据量和渲染量都偏大 | T-0710 | picker 初始只请求 region 摘要，展开 region 后再加载 constellations，`/api/constellations` 首包体积显著下降 |
| [x] | T-0712 | F-007 | 3.2, 4.1 | View / Runtime | 将应用页面中的中文文案统一切换为英文，确保大厅、列表标签、按钮和动态比赛文案都使用英文 | 当前 `/lobby` 及其 discovery runtime 仍混有中文显示文本，不符合项目 UI 语言要求 | T-0711 | 页面中不再出现中文可见文案，`pnpm build` 通过 |
| [x] | T-0713 | F-007 | Architecture 4.4 | Controller / View | 将 `FuelMissionShell` 中的钱包编排、路由预取和交互状态从 View 收回到 Controller，恢复 `View -> Controller -> Service -> Model` | 当前 shell 组件直接使用钱包/路由 hook 和本地编排状态，超出 view 纯渲染职责 | T-0700 | `FuelMissionShell` 只消费 shell controller 输出，`pnpm lint:imports` 与 `pnpm build` 通过 |
| [x] | T-0714 | F-007 | Architecture 4.1, 4.4 | View / Page | 恢复从 `/lobby` 进入“创建加油比赛”主链路，补齐 CTA 和 `/planning` 下的创建比赛视图分发 | 当前 `CreateMatchScreen` 已存在但未挂到任何路由，也没有从 lobby 暴露入口，导致创建比赛链路断开 | T-0700 | `/lobby` 有 `CREATE MATCH` 按钮，点击后进入 `/planning` 的创建比赛视图，`pnpm build` 通过 |
| [x] | T-0715 | F-007 | 3.1, 3.2, Architecture 4.4 | Controller / View | 将创建比赛改为 lobby 内 modal，并重做创建表单的主题、字段语义与精准模式节点选择体验 | 当前 CTA 虽已恢复，但仍是跳页链路，且旧表单样式和字段语义都不符合 Lobby 主界面质量标准 | T-0714 | `CREATE MATCH` 在 lobby 内打开 modal，按钮尺寸与 `CHANGE LOCATION` 一致，表单字段具备玩家可理解文案和分区说明，精准模式可直接点选目标节点 |
| [x] | T-0717 | F-007 | 3.1, 3.2 | View | 继续优化创建比赛弹窗的信息架构和节点展示：移除编号标题、将 Match Readout 合并进 Publish Summary，并把系统节点改成闪烁点阵图交互 | 当前弹窗虽然已可用，但分区命名仍偏表单化，节点展示仍是列表，不符合更直观的战术操作预期 | T-0715 | 创建比赛弹窗无编号标题，Publish Summary 包含玩家可理解的读数摘要，系统节点以闪烁点阵图展示并支持 Precision 模式点选 |
| [x] | T-0719 | F-007 | 3.1, 3.2 | View / Controller | 优化创建比赛弹窗的 Economics 与 Publish Summary：`maxTeams` / `durationHours` 改为可直接输入数字，缩短说明文案，并强化 `Pool Projection` 的视觉层级 | 当前 Economics 仍混用下拉选择与过长说明，`Pool Projection` 视觉重点不足，不利于用户快速决策 | T-0715, T-0717 | Match Economics 全部支持直接数字输入，说明文案更短；Publish Summary 的 Pool Projection 具备明显的数值主次和更醒目的奖池展示 |
| [x] | T-0718 | F-007 | Architecture 2, 4.4 | Governance / Refactor | 移除 `check-layer-imports` 中的 controller->model 白名单，清理现存越层 controller import，并新增 `pnpm verify:arch` 作为统一架构门禁 | 仅靠文档和手动提醒无法稳定执行架构规范，必须把规则变成无例外硬约束 | T-0700, T-0713 | `src/controller` 不再 import `@/model/*`；`pnpm lint:imports` 和 `pnpm verify:arch` 可作为稳定门禁执行 |
| [x] | T-0716 | F-007 | Architecture 4.4 | Controller / View | 回扫活跃 `src/view` screen/component，将页面编排状态、数据拉取、副作用与 URL/Modal/Form 逻辑迁入 controller，收敛 View 为纯渲染层 | 当前 `LobbyDiscoveryScreen`、`CreateMatchScreen`、`TeamLobbyScreen`、`NodeMap3D`、`TargetNodePanel`、`SettlementBillPanel`、`WalletConnectBridge` 等仍保留 view 侧逻辑，和新的分层要求不一致 | T-0713, T-0715 | 活跃 view 不再直接持有业务编排副作用或数据获取逻辑；`pnpm lint:imports`、`pnpm typecheck`、`pnpm build` 通过 |

## 3. Ordered Execution Plan (Critical Path)

- [x] `T-0103` - 先统一 `free / precision` 契约，停止旧模式命名继续扩散。
- [x] `T-0104` - 拆分 draft 与 publish，建立 v2.6 创建主链路。
- [x] `T-0105` - 落实赞助费门槛、星系可选性、精准模式目标节点校验。
- [x] `T-0101` - 补齐星座/搜索/推荐接口，支撑创建与发现两端。
- [x] `T-0201` - 对齐 Lobby 列表与详情 DTO。
- [x] `T-0202` - 建立位置状态与选择器。
- [x] `T-0203` - 暴露推荐节点 API，接通自由模式策略辅助。
- [x] `T-0303` - 把 Team Lobby 状态从宽泛 Lobby 状态中拆出。
- [x] `T-0306` - 将入队流程改为申请制并补齐队长审批动作。
- [x] `T-0305` - 回归 `draft -> publish -> apply -> approve/reject -> lock -> pay` 新链路。
- [x] `T-0501` - 用新奖池与 5% 抽成口径重写账单模型。
- [x] `T-0505` - 分离 `settlement` 状态接口与 `result` 账单接口。
- [x] `T-0601` - 收口节点坐标与星系解析，保证选择器判断可信。
- [x] `T-0602` - 迁移到规范投影表，为 worker 和 Realtime 清路。
- [x] `T-0603` - 抽离 runtime worker、健康检查和 supervisor。
- [x] `T-0604` - 完成星座聚合读模型与接口。
- [x] `T-0605` - 写接口统一支持幂等键、结构化错误与 stale 标记。
- [x] `T-0606` - 接通 devnet 真链路。
- [x] `T-0607` - 写接口签名验证中间件完成闭环。
- [x] `T-0703` - 最后用全链路 E2E 锁定主流程。

## 4. Definition of Done

- 每个标记为 `[x]` 的任务必须满足：
  - 已标注 `Feature ID / SPEC Section / Layer / Acceptance Signal`。
  - 如为前端任务，已声明并遵守 `Layer Scope`。
  - 不再依赖未关闭的前置阻塞项。
  - 如涉及公开接口，`docs/SPEC.md` 与实现口径一致。
  - 如为前端任务，至少通过 `node ./scripts/check-layer-imports.mjs`；推荐通过 `pnpm verify:arch`。
- 每个标记为 `[ ]` 的任务在完成时必须：
  - 同步更新本文件状态。
  - 如变更业务逻辑或接口，联动更新 `docs/PRD.md` 或 `docs/SPEC.md`。
  - 如涉及链上能力，补 devnet 验证记录。

## 5. Change Log

- 2026-03-26: 按 `docs/PRD.md` v2.6、`docs/architecture.md` v6.0、`docs/SPEC.md` v6.0 重建 TODO 基线。
- 2026-03-26: 将旧版以 `mission` 为中心的长清单收敛为当前 feature board，保留已完成能力的 `Done` 状态信号。
- 2026-03-26: 将节点坐标解析与增量同步任务 `T-0601` 设为 `In Progress`，其余 v2.6 差异项按关键路径重排。
- 2026-03-26: 根据 PRD 新决策新增 `T-0306`，将 Team Lobby 入队链路调整为申请 + 队长审批模型。
- 2026-03-26: 完成 `F-003` 的 `T-0303 / T-0305 / T-0306`，`/planning` 已切回 Team Lobby 入口，并以 `teamLobbyStore -> teamLobbyService -> useTeamLobbyController` 收口组队域；审批制入队的 route-level 回归已通过。
- 2026-03-26: 完成 `F-005` 的 `T-0501 / T-0505`，结算账单切换到 `sponsorshipFee + entryFeeTotal + platformSubsidy` 口径，并新增独立 `GET /api/matches/{id}/settlement` 状态接口。
- 2026-03-26: 完成 `F-004` 的公开运行时收口，`/match` 页接入 `GET /api/matches/{id}/scoreboard` 与 `GET /api/matches/{id}/stream`（SSE），并将比赛运行链路的新命名收敛到 `matchRuntime` 兼容层。
- 2026-03-26: 完成 critical path 剩余收口，校正 draft/publish 规则、确认 projection runtime 作为默认读模型，并补齐 `Connect -> Create Draft -> Publish -> Join Team -> Pay -> Run -> Settle` 端到端测试基线。
- 2026-03-26: 完成 `T-0707`，修复 `nodeRecommendationRuntime`、server relative import 和 `locationService.test` 的类型问题，`pnpm typecheck` 已恢复通过。
- 2026-03-26: 完成 `T-0706 / T-0708`，将 create/lobby/match controller 的 store 访问收回 service 层，恢复 `pnpm lint:imports` 通过，并让 test loader 支持相对无扩展名 import。
- 2026-03-26: 完成 `F-002` 的 `T-0204 / T-0206`，`/lobby` 已切到新 Match Lobby 入口，并补齐位置设置、距离提示、详情预览、自由模式推荐与异常态定向回归。
- 2026-03-26: 完成 `F-006` 的 `T-0601 / T-0603 / T-0604 / T-0605 / T-0606 / T-0607`，新增双 cursor 节点坐标增量同步、投影存储、`constellationRuntime`、runtime worker + `/api/runtime/health`、写接口幂等/签名中间件，并刷新 `docs/devnet-verification-latest.md` 记录最新 devnet 调用结果。
- 2026-03-26: 完成 `T-0702 / T-0704 / T-0705`，新增 F-007 测试计划、顺序化 F-007 测试脚本，并补齐 stale world API、拓扑缺失、重复 publish、重复 settlement 与签名失败回归。
- 2026-03-27: 完成 `T-0706`，清理 `useMatchController` 的残留 model 直连后，`node ./scripts/check-layer-imports.mjs` 已重新通过。
- 2026-03-27: 完成 `T-0709`，将 `WalletConnectBridge` 改为 `ssr: false` 按需加载，并在 `FuelMissionShell` 主导航中加入路由预取；同时为 `/planning` 页补充 `Suspense` 包装，`pnpm build` 已恢复通过。
- 2026-03-27: 完成 `T-0710`，将 `/lobby` 的位置选择器 bootstrap 改为按需加载，稳定 `useLobbyController` / `useTeamLobbyController` 的 action 引用并为 lobby/team load 加入去重，同时为 `runtimeProjectionStore` 和 `solarSystemRuntime` 增加缓存优先读取策略；本地验证显示 `/lobby`、`/api/matches`、`/api/network-nodes`、`/api/solar-systems/recommendations` 首字节时间均明显下降。
- 2026-03-27: 完成 `T-0711`，将位置选择器改为 region-first 浏览：`/api/constellations?view=regions` 先返回 region 摘要，展开 region 后再请求对应 constellations，同时 search hit 补充 `regionId` 以直接展开层级；本地验证显示 picker 初始 constellations 首包从约 510KB 降到约 35KB。
- 2026-03-27: 完成 `T-0712`，将 `/lobby` 页面及 `matchDiscoveryRuntime` 的中文可见文案统一切换为英文，并回扫当前页面路由与 discovery 输出，确认不再存在中文显示文本。
- 2026-03-27: 完成 `T-0713`，新增 `useFuelMissionShellController` 承接 `FuelMissionShell` 的钱包状态编排、路由预取和交互 notice；`FuelMissionShell` 已收敛为纯渲染组件，只消费 controller 输出，`pnpm lint:imports` 与 `pnpm build` 均通过。
- 2026-03-27: 完成 `T-0714`，补齐 `/lobby -> /planning?view=create-match` 的创建比赛入口，恢复 `CreateMatchScreen` 的路由可达性，并将 `/planning` 改为按 query 分发“创建比赛 / Team Lobby”视图。
- 2026-03-27: 完成 `T-0715`，将 `CREATE MATCH` 改为 lobby 内 modal，按钮尺寸与 `CHANGE LOCATION` 对齐；创建表单已重做为战术面板风格，并补齐模式说明、系统搜索/选择、经济参数释义与精准模式节点点选交互，同时同步更新 `docs/architecture.md` 与 `docs/SPEC.md` 的入口/事件契约。
- 2026-03-27: 完成 `T-0717`，将创建比赛弹窗的编号标题移除，把原 `Match Readout` 信息收进 `Publish Summary`，并把系统节点展示改成可闪烁的战术点阵图；Precision 模式下已支持直接点选节点，不再依赖列表式目标选择。
- 2026-03-27: 完成 `T-0719`，将创建比赛弹窗中的 `Team Cap` 与 `Match Duration` 改为可直接输入数字，压缩 `Match Economics` 说明文案，并重绘 `Pool Projection` 为更亮眼的奖池读数卡片。
- 2026-03-27: 完成 `T-0718`，清除 `scripts/check-layer-imports.mjs` 的 controller->model 白名单，收回现存 controller 越层 import，并新增 `pnpm verify:arch` 作为统一架构门禁；同时更新 `AGENTS.md` 与 TODO 模板，要求前端任务声明 `Layer Scope`。
- 2026-03-27: 完成 `T-0716`，新增 screen/component orchestration controllers，把 `LobbyDiscoveryScreen`、`CreateMatchScreen`、`TeamLobbyScreen`、`FuelFrogMatchScreen`、`FuelFrogSettlementScreen`、`FuelFrogLobbyScreen`、`HeatmapScreen`、`NodeMap3D`、`WalletConnectBridge`、`TargetNodePanel`、`SettlementBillPanel` 的页面编排、副作用和数据拉取从 View 收回 Controller；本地验证 `node ./scripts/check-layer-imports.mjs`、`pnpm typecheck`、`pnpm build` 全部通过。
- 2026-03-27: 完成 `T-0307`，将 `TeamLobbyScreen` 的创建战队表单改为按钮触发 modal，`/planning` 首屏回到 Team Board / Match Snapshot 主视图，现有 `useTeamLobbyController.createTeam` 链路保持不变。
- 2026-03-27: 完成 `T-0005 / T-0006`，将钱包连接弹窗改为受控 `open` 模式并在 provider 进入 `connected` 时立即关闭；同时把余额换算抽到共享工具，优先读取链上 coin metadata decimals，并将 `NEXT_PUBLIC_LUX_COIN_TYPE` 切到真实 LUX coin type 后的读取与支付链路一并打通。
- 2026-03-27: 完成 `T-0007`，确认 `StateService/GetBalance` 需要的 `coinType` 是实际 coin 的 Move type，而不是 `coin_registry::Currency<...>` 包装类型；已将前端配置和回归测试统一更正为 `0xf044...::EVE::EVE`。
- 2026-03-27: 完成 `T-0008`，为每次连接尝试重建新的 `ConnectModal` 实例，并在发起连接前预清理 dApp Kit 的残留连接状态，避免 `EXIT` 后第二次连接卡在 `Awaiting connection...`。
- 2026-03-27: 完成 `T-0009`，将钱包余额读取改为 `getBalance` 优先、`listBalances` 精确回退的双路径策略，并在查询失败时输出明确日志，避免用户只看到 `0 LUX` 而看不到真实错误。
