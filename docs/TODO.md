# TODO: Fuel Frog Panic Execution Backlog

Version: v2.6.8
Last Updated: 2026-03-28
Source Docs: `docs/PRD.md` v2.6.1, `docs/architecture.md` v6.2, `docs/SPEC.md` v6.4
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
| [x] | T-0010 | F-000 | 3.1 | Service / Controller | 将“有 EVE test token 但无 SUI gas”识别为独立钱包错误，并明确提示交易费仍需 SUI 支付 | 当前钱包直接抛出 `insufficient SUI balance`，用户容易误以为业务币 EVE test token 不能用于支付金额 | T-0006, T-0009 | 创建比赛/战队支付时，若缺 SUI gas，前端提示 `EVE TEST TOKEN covers the payment amount only; gas must still be paid in SUI` |
| [x] | T-0011 | F-000 | 3.1 | View / Controller | 将钱包余额和主要金额文案从 `LUX` 改为 `EVE TEST TOKEN / EVE`，与当前测试币口径保持一致 | 当前 UI 仍显示 `LUX`，和实际配置的 `0xf044...::EVE::EVE` 不一致，容易误导演示 | T-0006, T-0007 | 连接钱包后的余额、创建比赛、组队支付和结算主界面统一显示 `EVE TEST TOKEN / EVE` |

### F-001 Match Creation & Publish

| Done | TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal |
|---|---|---|---|---|---|---|---|---|
| [x] | T-0100 | F-001 | 4.1, 5.1 | Runtime / API | 保持 `GET /api/solar-systems`、`GET /api/solar-systems/[id]`、`GET /api/solar-systems/map` 作为星系基础查询底座 | v2.6 的星系选择器依赖真实星系与 gate 数据 | - | 路由返回 `systemId/systemName/constellationId/regionId/gateLinks` |
| [x] | T-0101 | F-001 | 4.1, 5.1, 5.2 | Runtime / API | 新增 `GET /api/constellations`、`GET /api/constellations/{id}`、`GET /api/search`、`GET /api/solar-systems/recommendations` | PRD v2.6 要求搜索优先 + 推荐 + 星座浏览辅助 | T-0100 | 可按紧急节点、名称、可选性返回星座/星系列表和推荐结果 |
| [x] | T-0102 | F-001 | 3.1 | View / Controller / Model | 实现 `createMatchStore`、`useCreateMatchController` 和创建页 UI，支持 `free / precision`、星系选择、精准模式选点、奖池预览 | 当前创建流程仍偏旧模式，无法完整覆盖 v2.6 | T-0100, T-0101 | 创建页可完整填写 `solarSystemId/targetNodeIds/sponsorshipFee/maxTeams/entryFee/durationHours` |
| [x] | T-0103 | F-001 | 2.2, 2.4, 4.2, 5.5 | Runtime / API / Type | 将 `official_free_target / host_created` 契约迁移为 `free / precision`，统一 DTO、类型与过滤参数 | 避免旧术语继续扩散到前后端接口 | - | `GET/POST /api/matches` 与共享类型只暴露 `free / precision` |
| [x] | T-0104 | F-001 | 4.2, 5.5, 6.1 | Runtime / API | 拆分创建与发布：`POST /api/matches` 生成 draft，`POST /api/matches/{id}/publish` 完成赞助费锁定确认 | 对齐 PRD v2.6 的“创建与发布分离” | T-0102, T-0103 | draft 创建成功后必须通过 publish 才进入 `lobby` |
| [x] | T-0105 | F-001 | 2.6, 5.5, 6.2 | Runtime / Data | 在 publish 阶段校验 `sponsorshipFee >= 50`、星系可选性、精准模式 `1-5` 目标节点，并写入 `match_target_nodes` 快照与幂等键 | 这是创建比赛最核心的业务规则 | T-0104 | 非法参数返回规范错误码；重复 publish 返回同一结果 |
| [x] | T-0107 | F-001 | 3.1, 4.2, 6.1 | Controller / Service / Runtime | 将创建比赛发布链路改为 `createDraft -> sponsorship payment -> publish(real txDigest)`，并要求 sponsorship payment 使用真实 LUX / EVE test token 转账 | 当前发布流程仍生成本地假 digest，无法阻止不付费创建比赛 | T-0104, T-0105 | 前端 publish 前必须先拿到真钱包 tx digest；未支付或支付失败时不得进入 `lobby` |
| [x] | T-0108 | F-001 | 4.2, 6.1, 6.2 | Runtime / Chain Verification | 在 `/api/matches/{id}/publish` 校验 `publishTxDigest` 的链上事实：交易存在、包含 `MatchPublished` 事件、coinType 匹配，且发布钱包的实际扣款金额精确等于 `sponsorshipFee` | 仅验证 digest 存在不足以保证 sponsorship 真实到账，也无法证明 tx 确实对应本合约发布动作 | T-0107 | fake/local digest 不再被本地 app 默认放行；缺失 `MatchPublished` 事件或扣款金额不匹配会被 publish 接口拒绝 |
| [x] | T-0109 | F-001 | 3.1, 6.1 | Controller / Wallet UX | 在 `lock sponsorship & publish` 前增加 escrow package existence 预检，并把钱包返回的 `Object <package-id> not found` 收口成明确的 network/package mismatch 错误 | 当前 package/network 不一致时，用户只能看到底层对象缺失报错，无法判断是钱包网络还是包地址问题 | T-0107, T-0108 | publish 前若当前 RPC 上不存在 `NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID`，前端直接提示检查 `NEXT_PUBLIC_SUI_NETWORK / NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID / 钱包网络`，不再暴露裸 `Object not found` |
| [x] | T-0110 | F-001 | 3.1, 6.1 | Controller / Wallet UX | 修复 escrow package existence 预检的误判：确认 package object 的真实读取方式，并避免把已部署 package 错误标成 unavailable | 当前 publish 前预检已经拦住了低层 `Object not found`，但用户在 testnet 上也被误报 unavailable，说明 package lookup 逻辑仍不稳 | T-0109 | 已部署 package 在当前 RPC 上可通过预检；只有真实 network/package mismatch 才会被拦截；若 package 实际部署在其他公网网络，提示需明确指出该网络 |
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
| [x] | T-0308 | F-003 | 4.3, 6.1 | Runtime / Chain Verification | 将 `pay-team` 升级到和 sponsorship publish 一样的链上事实校验：team pay tx 必须匹配 entry coin type、recipient 和 exact amount | 当前 team payment route 只验证 digest 是否存在，不足以证明真实到账 | T-0300, T-0304 | `/api/teams/{id}/pay` 对 fake/local digest 或错误 recipient/amount 不再默认放行 |
| [x] | T-0309 | F-003 | 4.3, 5.6, 6.1 | Runtime / Contract / View | 将 `pay-team` 从地址收款迁移为统一 `MatchEscrow` 合约收款：前端改为 Move call，后端校验 `TeamEntryLocked` 事件和 exact debit，并在比赛发布后持久化 `escrowId` | 当前 team pay 虽然已做 recipient/amount 校验，但资金仍先进入普通地址，和 sponsorship escrow 的托管模型不统一 | T-0108, T-0308 | `/planning` 的 pay team 走链上 escrow；`/api/teams/{id}/pay` 仅接受包含 `TeamEntryLocked` 且 `room/escrow/team_ref/member_count/quoted_amount_lux/locked_amount` 全匹配的 tx；不再依赖 `NEXT_PUBLIC_ENTRY_PAYMENT_RECIPIENT` |
| [x] | T-0307 | F-003 | 3.3 | View | 将 `/planning` 页的创建战队表单从页面直出改为按钮触发 modal，保留现有 `createTeam` controller/service 链路不变 | 当前 Team Lobby 首屏被大表单占据，弱化了战队列表和审批主视图 | T-0303, T-0306 | `/planning` 首屏只显示创建入口按钮；点击后弹出创建战队 modal，提交成功后自动关闭并刷新消息 |
| [x] | T-0305 | F-003 | 3.3, 4.3 | QA | 在 `draft -> publish -> apply -> approve/reject -> lock -> pay` 新链路下重跑 Team Lobby 回归 | 入队申请审批上线后，旧回归结论不再充分 | T-0104, T-0303, T-0306 | `node --import ./scripts/register-test-loader.mjs --experimental-strip-types --test src/app/api/__tests__/f007-match-flow.test.ts` 通过，覆盖 apply / approve / reject / lock / pay 主链路 |
| [x] | T-0310 | F-003 | 4.5, 5.9 | Runtime / API / Service / Model | 新增独立 `planning team` registry：提供总战队数与无比赛绑定的创建接口，并写入 runtime projection | `/planning` 不再依赖 `matchId`，需要一条独立于比赛报名链路的数据源 | T-0300 | `GET/POST /api/planning-teams` 可读写独立战队；刷新页面后总数可从 projection 恢复 |
| [x] | T-0311 | F-003 | 3.7 | View + Controller | 将 `/planning` 改成独立战队页，只显示当前战队总数与创建入口，移除默认的 match snapshot / join / lock / pay 首屏职责 | 当前 `/planning` 默认仍是比赛内 Team Lobby，和最新产品决策冲突 | T-0310 | `/planning` 首屏展示总战队数与 `Create Team` CTA；从 `/lobby` 跳转进入时不再要求 `matchId` |
| [x] | T-0312 | F-003 | 2.4, 3.3, 4.3 | Runtime / API / Type | 新增 `GET /api/players/{address}/team-dossier` 聚合读接口，统一返回当前战队 deployment 与按时间倒序的参赛记录 | 新页面需要稳定的 wallet -> team/match 读模型，不能让 View 自己拼多个接口 | T-0303 | 接口可返回当前战队、个人角色、胜场、总分、收益和参赛记录列表 |
| [x] | T-0313 | F-003 | 3.3 | Service + Model | 新增 `teamDossierStore` 与 `teamDossierService`，将 `/team` 页面读链路收口为独立 team dossier 域 | 避免复用 Team Lobby store 或让 View 直接拉 API | T-0312 | `teamDossierStore -> teamDossierService -> useTeamDossierController` 成为唯一读链路 |
| [x] | T-0314 | F-003 | 3.3 | View + Controller | 新增 `/team` 战队档案页和 shell 导航入口，展示当前战队编制、成员角色、参赛记录和快捷跳转 | 用户需要单独查看“我在哪支队、打过哪些加油赛” | T-0313 | 已连接钱包可进入 `/team` 查看 current deployment 和 deployment log；未连接时有明确空态引导 |
| [x] | T-0315 | F-003 | 3.3, 4.3 | QA | 补齐 player team dossier runtime/API 回归，并执行 build + layer import 验证 | 新页依赖新聚合读模型与新导航，必须补齐回归 | T-0312, T-0314 | 定向测试、`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0316 | F-003 | 3.3 | View only | 澄清 `/team` 页的信息架构：把 `Current Deployment / Deployment Log` 改成更直白的区块标题与说明，减少用户对“deployment”语义的困惑 | 当前术语偏战术化，用户难以立刻理解“当前战队”和“历史参赛记录”的边界 | T-0314 | `/team` 页首屏能直接看懂“现在在哪支队 / 以前打过哪些比赛” |
| [x] | T-0317 | F-003 | 3.3 | View only | 精简 `/planning` 创建战队弹窗中的只读冗余信息，移除 `CAPTAIN` 与 `REGISTRY COUNT` 文案，仅保留会影响填写决策的表单反馈 | 当前两段信息对创建动作没有帮助，反而像调试信息 | T-0311 | 创建战队弹窗不再显示钱包长地址和 registry count，只保留必要字段与校验提示 |
| [x] | T-0318 | F-003 | 4.5, 5.9 | Runtime / API / Type | 扩展独立战队注册表数据结构与接口：`GET /api/planning-teams` 返回完整 team board，新增 `POST /api/planning-teams/{id}/join` 直接加入链路 | 现在 `/planning` 只有总数和创建，玩家看不到已有战队也无法加入 | T-0310 | 独立战队接口能返回成员、空槽和加入后的最新 team 快照 |
| [x] | T-0319 | F-003 | 3.3 | Service + Model | 扩展 `planningTeamStore / planningTeamService / usePlanningTeamController`，支持 team board 列表和 join mutation | 前端需要独立 registry 域自己的 join 状态，不应复用 match-specific team 域 | T-0318 | controller 可直接提供全部独立战队与 join 动作 |
| [x] | T-0320 | F-003 | 3.3 | View + Controller | 重绘 `/planning` 首屏为 team board + create entry：显示全部已创建战队、成员/空槽、角色选择与加入按钮 | 玩家需要在 planning 页直接发现并加入队伍，而不是只看到一个总数 | T-0319 | `/planning` 首屏可浏览全部独立战队并直接加入 |
| [x] | T-0321 | F-003 | 3.3, 4.5 | QA | 为独立战队列表和加入链路补齐 runtime/API 回归，并执行 build + layer import 验证 | 新 registry board 是新的用户主路径，必须补齐回归 | T-0318, T-0320 | 定向测试、`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0322 | F-003 | 3.3 | View only | 移除 `/planning` 首屏独立 `Create Team` 面板，只保留 `Open Create Team` CTA 并并入 `Current Team Count` 模块 | 当前创建 CTA 信息重复，占用首屏空间；用户已明确希望把 CTA 收口进总数模块 | T-0320 | `/planning` 首屏不再出现单独 `Create Team` 面板；`Open Create Team` 按钮和其禁用提示都位于 `Current Team Count` 内 |
| [x] | T-0323 | F-003 | 3.3 | View only | 重绘 `/planning` 的独立战队卡片：强化队伍概况、角色空槽和加入操作台，让未满员战队的 `Join Team` 成为明确主 CTA | 当前 team board 虽然可用，但视觉层级弱，加入入口不够醒目 | T-0320 | team card 首屏可快速判断是否满员、缺什么角色、在哪里点击加入 |
| [x] | T-0324 | F-003 | 3.3 | View only | 将 `/planning` 战队卡继续重绘为更强的战术编组卡：补齐编队编号、状态条、空槽警报和更具游戏感的 join 控制台 | 当前卡片已可用，但还不够像“游戏内 squad board” | T-0323 | team card 具备更强的编队识别和战术面板气质，未满员队伍的加入区第一眼即可识别 |
| [x] | T-0325 | F-003 | 3.3 | View only | 修正 `/planning` 的 join CTA 可见性：只要战队未满且仍有空槽，就始终显示 `Join Team` 按钮；未满足钱包/归队条件时改为 disabled 态而不是直接隐藏 | 当前 join 行为被显示条件吞掉，用户会误以为根本没有加入入口 | T-0324 | 非满员战队始终能看到 `Join Team` 按钮，无法加入时也有明确禁用原因 |
| [x] | T-0326 | F-003 | 3.3 | View only | 修正 `/planning` 战队卡头部摘要区的版式混乱问题，重排队名、队长、roster 和 vacancy 指标，避免标题与数值块互相挤压 | 当前 `Alpha Squad / Captain / Seats / 1` 区域的阅读顺序混乱，破坏首屏扫读 | T-0324 | 战队卡头部摘要能稳定显示队名、队长、成员数和空位数，不再出现凌乱断行 |
| [x] | T-0327 | F-003 | 3.3 | View only | 再次收紧 `/planning` 战队卡布局与 join CTA 固定占位：队名与指标彻底拆成上下两层，`Join Team` 按钮无论可用与否都保持可见 | 用户反馈上一轮修复后仍存在队名/roster 挤压和按钮不可见问题 | T-0326 | 头部摘要不再重叠，join 按钮始终可见且禁用原因明确 |

### F-004 Match Runtime / Scoring / Overlay

| Done | TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal |
|---|---|---|---|---|---|---|---|---|
| [x] | T-0400 | F-004 | 5.5, 5.7 | Runtime | 保持比赛状态机、`match-tick`、Panic 广播、非法迁移审计逻辑 | `Lobby -> PreStart -> Running -> Panic -> Settling` 是核心玩法主线 | - | 状态迁移符合 PRD，最后 90 秒准确进入 Panic |
| [x] | T-0401 | F-004 | 5.7 | Runtime / Data | 保持 `chainSyncEngine` 的三重过滤、得分公式、去重和审计日志 | 计分可信度直接决定比赛有效性 | T-0302 | 非白名单/非目标节点/窗口外事件均不计分 |
| [x] | T-0402 | F-004 | 3.4 | View / Controller / Model | 保持 `/match` 页倒计时、实时分数板、弹幕、Panic 视觉效果 | 前端比赛体验已经具备基础实现，应继续稳定 | T-0400, T-0401 | `/match` 页面能展示状态、剩余时间、得分和事件流 |
| [x] | T-0403 | F-004 | 4.2, 6.1 | Runtime / API | 补齐 `GET /api/matches/{id}/scoreboard` 与 `GET /api/matches/{id}/stream`（SSE）的公开契约 | SPEC v6.0 已将状态快照与流接口正式化 | T-0401 | 前端不依赖隐式内部订阅，也能按公开接口取数 |
| [x] | T-0404 | F-004 | 3.4, 4.5 | Codebase Cleanup | 清理前端/服务层残留的 `mission`、`fuelMission` 命名，保留必要兼容层但停止扩散 | 否则新 PRD 术语无法在代码中稳定落地 | T-0103, T-0205 | 新增代码不再引入 `mission` 命名；旧接口集中在兼容层 |
| [x] | T-0405 | F-004 | 3.4, 5.7 | QA | 维持主流程回归：`Lobby -> Lock -> Pay -> Running -> Panic -> Settling` | 当前已存在的主链路回归仍需保留 | T-0400, T-0401, T-0402 | 关键路径在本地/测试环境可稳定跑通 |
| [x] | T-0406 | F-004 | 3.4, Architecture 4.4 | Service + Model | 为 `/match` 新增 `Demo Replay Mode` 数据源：实现脚本化 telemetry 场景、播放状态 store、时间推进、Pause / Replay / Jump to Panic 控制，并保持输出结构可映射到现有 scoreboard / node status / event feed 视图 | 黑客松现场缺少稳定的真实 live 演示链路，需要一个可重复、可控、不会空榜的比赛回放源 | T-0402 | `match` demo 数据源可在 60 秒内稳定循环，且不会在 View 中直接写定时器或随机数 |
| [x] | T-0407 | F-004 | 3.4, Architecture 4.4 | Controller + Service | 扩展 `useFuelFrogMatchScreenController`，支持 `demo-replay / live` 双模式编排，默认进入 demo，并把播放控制、模式切换和 live stream 启停收口到 controller | 页面应共用同一套 match 骨架，只切换数据源，不能复制第二套页面或把 mode 状态下沉到 View | T-0406 | `FuelFrogMatchScreen` 仅消费 controller 输出；demo 默认可播，切回 live 时仍能连接现有 stream |
| [x] | T-0408 | F-004 | 3.4 | View only | 重绘 `/match` 页得分板为 mascot 战队榜，并补齐 `SIMULATION MODE` 标签、演示控制按钮、脚本化事件流样式和 Panic 戏剧化视觉 | 评委需要在 10 秒内看懂多队实时竞争，且每支队伍要有强识别度 | T-0407 | 左侧得分板每队具备 mascot / 队名 / 分数 / 进度条 / 最近动作；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0409 | F-004 | 3.4, Architecture 4.4 | Controller + Service | 为 demo/live 战队卡补充统一的战术元数据与派生读数：战队编号、单位标签、领跑差值、阵营状态文案，并由 controller 输出可直接渲染的 warboard 卡片模型 | 当前 mascot 已有，但卡片还缺少“工业战队徽章”应有的编号感和强扫读读数 | T-0408 | controller 可稳定输出 `unitTag / stanceLabel / deltaFromLeader / leaderState` 等字段，View 无需再临时拼业务展示文案 |
| [x] | T-0410 | F-004 | 3.4 | View only | 继续强化 `/match` mascot 战队榜的工业质感：加入 stencil 编号条、领跑/追击标签、进度条刻度、战术摘要条和更强的队卡层次 | 让评委在投屏距离下更快区分领跑队、追击队和每支战队身份 | T-0409 | 队卡具备编号条、状态标签、分差提示与更清晰的战术徽章层次；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0411 | F-004 | 3.4 | View only | 抽取共享 `TeamMascotBadge` 组件，用统一的硬边徽章框、扫描纹理、战术标签和编号槽位包裹 demo/live mascot 头像 | 当前队卡里的 mascot 外框仍是内联样式，后续替换正式 mascot 资产时难以保持视觉统一 | T-0410 | `/match` 的所有战队头像都通过同一个 badge 组件渲染，替换图源后仍保持同系列徽章语言 |
| [x] | T-0412 | F-004 | Architecture 4.1, 4.4 | View only | 修复主壳层左侧 sidebar 在低垂直高度下挤压导航的问题：让中部导航区可独立滚动，并保证 `SETTLEMENT LEDGER` 等底部 tab 不会被遮住 | 当前 settlement 页面已暴露出 sidebar 垂直空间不足时最后一个 tab 被裁切，影响主导航可达性 | T-0411 | 在较矮视口下 sidebar 仍可完整访问所有导航项，`SETTLEMENT LEDGER` 不再被遮挡；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |

### F-005 Settlement / Revenue Split

| Done | TODO ID | Feature ID | SPEC Section | Layer | Task | Why (value) | Dependency | Acceptance Signal |
|---|---|---|---|---|---|---|---|---|
| [x] | T-0500 | F-005 | 3.5, 5.8 | View / Controller / Model | 保持结算页、账单加载、个人分账与 MVP 展示能力 | 用户最终感知价值集中在结算页 | - | `/settlement` 可展示奖池、队伍分配、个人分配、MVP |
| [x] | T-0501 | F-005 | 2.5, 4.4, 5.8 | Runtime / API / Type | 将结算账单口径更新为 `sponsorshipFee + entryFeeTotal + platformSubsidy`，并统一 5% 平台抽成字段 | 当前部分实现仍带旧 `hostPrizePool` 语义 | T-0103, T-0105 | `SettlementBill` 与 PRD/SPEC 字段完全一致，示例计算正确 |
| [x] | T-0502 | F-005 | 5.8, 6.2 | Runtime / Contract | 保持幂等结算、链上发奖与重复请求回放逻辑 | 结算是高风险资金动作 | T-0401 | 重复结算不会重复出账，能返回同一 payout 结果 |
| [x] | T-0503 | F-005 | 4.4 | Runtime / API | 保持 `GET /api/matches/{id}/result` 账单接口可用 | 战报页和链上追溯依赖该接口 | T-0500 | 账单接口返回队伍/成员分配细项和 tx 关联信息 |
| [x] | T-0504 | F-005 | 5.8 | QA | 持续验证 2 队 / 3 队 / 4+ 队比例，以及 0 分成员奖金为 0 | 奖金规则需要稳定可信 | T-0501, T-0502 | 回归覆盖排名比例、贡献占比、MVP 生成 |
| [x] | T-0505 | F-005 | 4.4, 5.8 | Runtime / API | 新增 `GET /api/matches/{id}/settlement` 状态接口，并和 `result` 读模型分离 | 对齐 PRD 的 `Settling` 等待页与结果页双态 | T-0501 | 结算中与已结算状态可分别查询并驱动不同页面 UI |
| [x] | T-0506 | F-005 | 3.5, Architecture 4.4 | Service + Model | 为 `/settlement` 新增 `Settlement Demo Mode` 数据源：实现脚本化 `settling -> report` 流程、播放状态 store、时间推进、Pause / Replay / Jump to Report 控制，并保持输出结构可映射到现有 settlement status/bill 消费口径 | 黑客松现场不适合等待真实结算链路，需要一个可控、可重复、可直接展示分账价值的结算演示源 | T-0500 | settlement demo 数据源可稳定展示等待态和战报态，且不在 View 中直接写定时器 |
| [x] | T-0507 | F-005 | 3.5, Architecture 4.4 | Controller + Service | 扩展 `useFuelFrogSettlementScreenController`，支持 `demo-report / live` 双模式编排，默认进入 demo，并把播放控制、模式切换和真实结算 fallback 收口到 controller | 页面应共用同一套 settlement 骨架，只切数据源，不复制第二套页面 | T-0506 | `FuelFrogSettlementScreen` 仅消费 controller 输出；demo 默认可播，切回 live 时仍可读取真实 status/bill |
| [x] | T-0508 | F-005 | 3.5 | View only | 重绘 `/settlement` 页为更适合路演的 `Settling + Match Report` 双态：突出总奖池、平台抽成、实发奖池、冠军、MVP、我的收益和继续操作 | 评委需要在短时间内理解平台如何从比赛结果推导出最终收益分配 | T-0507 | `/settlement` demo 具备 `settling` 进度态和 `report` 战报态，且 `pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0509 | F-005 | 3.5, Architecture 4.4 | Service + Model | 将 `/settlement` demo 的队伍排名、奖池拆分和 hero 读数收口到与 `/match` demo 同一份最终结果事实，避免跨页面各自维护一套 demo 数字 | 如果 `match` 与 `settlement` 的最终名次、分差和 payout 不一致，评委会立即感知到演示链路是拼接的 | T-0508 | `/settlement` demo 的冠军、亚军、季军、队伍得分和奖池比例与 `/match` demo 最终排行榜一致，且后续修改只需改一处共享 outcome 数据 |

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
| [x] | T-0608 | F-006 | PRD 4.1, 4.4, 4.5 | Contract / Devnet | 按最新 PRD 复核并修正本地 Move demo 合约的经济与状态约束，至少对齐免费入场、赞助费门槛、固定 5% 平台抽成和多队基础能力 | 当前 `contracts/sources/fuel_frog_panic.move` 仍是旧 `FuelRoom / 双队 / host fee` 模型，与 PRD v2.6 的比赛创建和结算规则存在明显偏差 | T-0501, T-0606 | `sui move test` 通过，devnet 验证脚本使用的新参数和账单口径与 PRD v2.6 一致 |
| [x] | T-0609 | F-006 | 5.5, 6.1 | Runtime / Contract | 让后端 runtime 在拿到真实链上 `publish_match` tx digest 时解析 `MatchPublished` 事件，并把链上 `room_id` 收口为统一 `onChainId` 事实 | 当前 `matchRuntime.publishMatch` 在大多数路径仍用本地拼装 `draft_${digest}` 作为链上引用，占位语义过重 | T-0608 | `publish` 路径在 verify/strict 场景能消费真实 `MatchPublished` 事件，并优先持久化链上 `room_id` |
| [x] | T-0610 | F-006 | 5.6, 5.8 | Runtime / Settlement | 继续统一链上/链下事实模型：让 settlement 读模型优先消费明确的 settlement fact，而不是回退到首条 team payment tx 作为 payout trace | 当前 `settlementRuntime` 仍用首条 team payment tx 充当 payout trace，占位语义过重，和 `payment fact / whitelist commitment / settlement commitment` 目标不一致 | T-0608, T-0609 | settlement 账单优先读取显式 settlement fact，payout trace 不再默认复用 team payment tx |
| [x] | T-0611 | F-006 | 5.6, 6.1 | Runtime / Projection | 将 `teamRuntime` 的支付与白名单链路收口为显式 persisted fact，并在 runtime 重建时优先从 `team_payments / match_whitelists` 恢复，而不是从 `team.hasPaid / whitelistCount` 反推 | 当前 `persistMatchState()` 仍会从内存队伍状态反推 payment/whitelist 行，事实优先模型还不彻底 | T-0609, T-0610 | `teamRuntime` 支付后会写入规范化 payment/whitelist fact，重启 runtime 后仍按事实恢复 paid/whitelist 状态 |
| [x] | T-0612 | F-006 | 5.8, 6.1 | Runtime / Settlement | 给 `settlementRuntime` 增加显式 settlement fact materialization 路径：在 `settling/settled` 阶段直接写入规范化 `settlements` 记录，并让结果页只在 `status=succeeded` 时读取账单 | 当前 settlement 仍主要依赖读时临时 `buildSettlementBill(detail)`，写路径没有显式 commitment，`settlements` 还不是完整规范事实 | T-0610, T-0611 | `settlementRuntime` 可产出 running/succeeded settlement fact，`/api/matches/{id}/settlement` 与 `/result` 优先消费 persisted settlement 记录 |
| [x] | T-0613 | F-006 | 5.5, 5.8, 6.1 | Runtime / Stream | 将 settlement fact materialization 从读接口懒触发收口为显式状态迁移侧效：当比赛状态进入 `settling/settled` 时立即写入 `settlements` 和对应 `match_stream_events` | 当前 settlement fact 主要由 `/settlement` 或 `/result` 首次读取时触发，状态推进和事件流之间仍不够一致 | T-0612 | `matchRuntime` 状态切换到 `settling/settled` 时会同步写 settlement fact，并持久化 `settlement_start / settlement_complete` 事件且避免重复写入 |
| [x] | T-0614 | F-006 | 5.5, 6.1 | Runtime / API / Stream | 将 `/api/matches/{id}/stream` 接到 persisted `match_stream_events`，让 SSE 在 live frame 之外也能消费规范化事件流，并对 settlement 事件做去重 | 当前 stream route 只按 3 秒轮询现算 frame，已经持久化的 `match_stream_events` 并未真正成为事件源 | T-0613 | SSE 首包会先发 persisted stream events，再补 live frame；`settlement_complete` 可通过 stream 实时送达，且不会和 frame 重复发送 |
| [x] | T-0615 | F-006 | 5.5, 6.1 | Runtime / Stream | 将 `score_update / phase_change / node_status` 也收口为 persisted `match_stream_events` 快照，按变更增量写入，并让 `/stream` 按事件签名对 live frame 做统一去重 | 当前 persisted stream 主要只覆盖 settlement 相关事件，live frame 仍承担多数主事件输出，统一事件源还不彻底 | T-0614 | `buildMatchStreamFrame()` 会为核心事件做“仅变化时落盘”，SSE 不再重复发送与 persisted snapshot 完全相同的 live 事件 |

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
| [x] | T-0720 | F-007 | 3.1 | View | 优化创建比赛弹窗的系统选择 loading 反馈，在请求目标星系详情与 network nodes 时显示明确的加载状态，并在等待期间冻结易误触控件 | 当前点击选择星系后会有短暂无反馈卡顿，用户不知道 network nodes 正在加载 | T-0717 | 选定星系后可见 loading 覆层/状态提示，等待期间搜索与发布入口不会误触，`pnpm build` 通过 |
| [x] | T-0719 | F-007 | 3.1, 3.2 | View / Controller | 优化创建比赛弹窗的 Economics 与 Publish Summary：`maxTeams` / `durationHours` 改为可直接输入数字，缩短说明文案，并强化 `Pool Projection` 的视觉层级 | 当前 Economics 仍混用下拉选择与过长说明，`Pool Projection` 视觉重点不足，不利于用户快速决策 | T-0715, T-0717 | Match Economics 全部支持直接数字输入，说明文案更短；Publish Summary 的 Pool Projection 具备明显的数值主次和更醒目的奖池展示 |
| [x] | T-0722 | F-007 | 3.1 | Controller / View | 修复创建比赛弹窗里赞助费与入场费的直接输入体验：允许用户先自由编辑数字，再在 blur/提交时完成约束收敛 | 当前 `sponsorshipFee` / `entryFee` 在 onChange 阶段就立即钳制，用户删除数字时会被强制回填，实际无法自然输入 | T-0719 | Sponsorship 与 Entry Fee 支持删除、重输、再提交；非法中间态不会立刻把输入框重置回旧值 |
| [x] | T-0723 | F-007 | 3.1, 3.2 | View | 重绘创建比赛弹窗 `Pool Projection` 的视觉层级，使其成为更醒目、更具战术海报感的奖池摘要模块 | 当前 `Pool Projection` 虽已可读，但视觉冲击力仍不足，无法承担创建弹窗中的核心决策读数 | T-0719, T-0722 | `Pool Projection` 以大号奖池读数、分块金额卡和更强的色彩/边框/光晕层次呈现，首屏可快速读出 full pool / guaranteed / payout |
| [x] | T-0724 | F-007 | 3.1, 3.2 | View | 将创建比赛弹窗 `Pool Projection` 继续强化为“奖金海报”风格，加入奖池主标题、奖金额梯和冠军主奖强调区 | 当前奖池摘要已经更醒目，但还不够像赛事奖金海报，缺少“冠军奖金”与排名分配的视觉冲击 | T-0723 | `Pool Projection` 可直接读出 projected full pool、projected payout，以及前 2/3 名奖金梯度，整体风格更接近赛事奖金海报 |
| [x] | T-0728 | F-007 | 3.1, 5.2, 5.3 | Runtime / API / QA | 调查 create-match 星系搜索与 system selection 中大量 `0 nodes` 的根因，区分“系统本身无 indexed nodes”与“node 索引/solarSystem 归属映射异常”，并为修复方案补充验收口径 | 当前用户在创建比赛时频繁选到返回 `0 nodes` 的星系，影响匹配效率；如果根因是索引缺口，仅靠搜索排序无法真正修复 | T-0601, T-0725 | 形成可复现的根因说明，明确受影响链路（`/api/search`、`/api/solar-systems/{id}`、`/api/network-nodes`、node projection），并在 TODO / test-plan 中记录后续修复验收点 |
| [x] | T-0729 | F-007 | 5.2, 5.3 | Runtime / Data / QA | 修复 `network_nodes -> solarSystem` 位置回填：为旧 `node-index` 快照触发一次 location replay，并在 `NetworkNode` 自身无位置时尝试继承 `connectedAssemblyIds` 对应设施的公开位置 | 当前 `node-index` 中 `121 / 127` 个节点停留在 `solarSystem=0`，create-match 按系统加载节点时会大面积返回 `0 nodes`；调查已确认主因是 location coverage 缺口 | T-0728 | 旧 `v2` 快照在新运行时下会自动升级并重建位置；自身无位置但连接设施有位置的节点可获得非零 `solarSystem`；create-match 对系统查节点不再只剩极少数系统可用 |
| [x] | T-0730 | F-007 | 3.1, 5.2 | Runtime / API / View | 修复 create-match 星系搜索对“旧 EVE 系统名”无结果的问题：在保留当前 world API 系统名的同时，引入 `data/solar-systems.json` 中的 canonical/legacy 名称作为搜索别名，并在搜索结果里同时展示别名与当前链上名 | 当前 live `solarSystemsCache` 已切到编码名（例如 `EHK-KH7`），导致用户按旧名如 `Jita` 搜索时返回空；搜索链路本身正常，但名称口径不兼容 | T-0725 | create-match 搜索 `Jita / Amarr / Kisogo` 等旧名时能返回对应 systemId；结果文案可同时读到旧名和当前链上名；`pnpm build` 与定向搜索回归通过 |
| [x] | T-0734 | F-007 | 5.5, 6.2, 7.1 | Runtime / Data | 将 create/publish/team/settlement 的比赛生命周期数据从本地 `runtime-projections.json` 迁移到后端规范数据表（优先 Supabase/PostgreSQL），使重启、换进程和多实例部署后仍能恢复比赛状态 | 当前 `matchRuntime` 仍把 `matches / teams / payments / settlements` 写进本地投影文件，导致虽然单机重启可尝试恢复，但它不是规范后端持久层，也无法满足多实例/远程部署需求；而架构基线已经明确这些数据的规范事实应落在后端表 | T-0104, T-0602, T-0611, T-0613 | `POST /api/matches`、`publish`、team 变更、payment、settlement 都写入后端表；本地投影文件仅作为缓存/回退，不再是唯一事实源；重启进程后比赛仍可从后端表恢复 |
| [x] | T-0737 | F-007 | 5.5, 6.2, 7.1 | Runtime / QA / Infra | 拉起本地 Supabase 并完成后端镜像联调：本地容器、迁移、env、runtime REST 写表与冷启动 hydrate 全链路验证 | `T-0734` 已完成代码接线，但当前仓库尚未完成“真实本地 Supabase 实例 + 当前 Next runtime”闭环验证；若不跑通这一步，后端规范持久层仍只停留在代码和单测层 | T-0734 | 本地 `supabase start` / migration 成功；`.env` 指向本地 Supabase；`matchBackendStore` 能真实写入 `matches / teams / team_members / settlements`；清空本地投影后仍可从后端表 hydrate 恢复 |
| [x] | T-0732 | F-007 | 3.1, Architecture 4.5 | View / Controller | 统一 create-match 的 `Target System` 展示结构：`free / precision` 都使用同一套战术节点面板布局；`free` 只读展示系统内 online nodes，`precision` 继续支持 1-5 个 target node 锁定 | 当前 free mode 与 precision mode 的 `Target System` 区块视觉结构不同，用户需要在两套心智模型之间切换，影响扫读与操作一致性 | T-0725, T-0730 | 两种模式都展示相同的系统详情 + 战术节点网格布局；free mode 不再退化为简版块；precision mode 的锁点规则与发布校验保持不变；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0733 | F-007 | 3.1 | Controller / Service | 修复 create-match 在 Target System 选中后搜索结果列表残留的问题：选中系统时立即清空 `searchHits`，并屏蔽已过期的异步搜索响应回写 | 当前用户在选中星系后，旧的搜索结果列表仍可能停留在界面上；根因是系统搜索缺少请求代次/取消保护，旧响应会在选中后回写 store | T-0730, T-0732 | 选中 Target System 后搜索结果列表立即消失；已过期搜索请求不会在选中后重新刷出旧列表；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0734 | F-007 | 3.1 | View + Controller | 为 create-match 的 `Target System & Network Nodes` 战术节点网格补充 hover/focus tooltip：显示节点名，以及当前燃料、满载容量和补满缺口 | 当前 Tactical Node Grid 只有点阵与原生 `title`，用户无法在不离开网格的情况下快速读出单个节点的燃料缺口 | T-0732 | hover 或 focus 任一 tactical node 时，会显示节点名与 `remaining / capacity / deficit` 三项燃料读数；Precision/Free 两种模式都可用；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0735 | F-007 | 3.1 | View only | 将 create-match 的 tactical node tooltip 升级为带 fuel gauge 的战术读数卡，用图形化进度条直观展示节点载油占比与缺口段 | 当前 tooltip 虽然已有数值，但用户仍需要先读数字再脑补油量状态，不够直观 | T-0734 | hover 或 focus 节点时，tooltip 除数值外还显示 fuel gauge / load percent，并能直观看出已加载与缺口区段；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0736 | F-007 | 3.2 | View only | 将 `/lobby` 主标题从 `MISSION LOBBY / DISCOVERY GRID` 收口为更直接的 `MATCH LOBBY`，减少概念噪音并对齐“比赛大厅”语义 | 当前标题把 mission / discovery 两层概念叠在一起，不如直接用 match lobby 清晰 | T-0731 | `/lobby` 主标题显示 `MATCH LOBBY`，其余筛选、详情和 CTA 行为保持不变；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0738 | F-007 | 3.2 | View only | 收紧 `/planning` 默认 Team Registry 页的首屏说明文案，减少过长句子对卡片与按钮区的视觉挤压 | 当前 `/planning` 首屏的 subtitle 与 Create Team 说明过长，影响扫读效率，也削弱了主 CTA 的聚焦效果 | T-0736 | `/planning` 页头与 Create Team 卡片首屏说明改为更短句式，仍保留“先注册战队，后在比赛内完成报名/锁队/支付”的核心语义；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0731 | F-007 | 3.2 | View only | 收紧 `/lobby` 的比赛卡片与详情面板信息层级，减少整段文字堆叠，改为更易扫读的指标卡、状态条和战术摘要布局 | 当前 lobby 列表卡片和详情面板同时展示过多平铺文本，用户很难在 2-3 秒内读出模式、奖池、系统和距离等关键信息 | T-0204 | `/lobby` 比赛卡片首屏可快速读出模式 / 奖池 / 入场费 / 队伍进度 / 距离；详情面板不再重复堆叠长句，核心信息按模块分组展示；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0733 | F-007 | 3.2 | View only | 移除 `/lobby` 比赛详情摘要中的 `DISTANCE` 指标卡，避免右侧详情与左侧列表重复展示同类位置信息 | 当前详情面板已通过系统摘要与列表跳数标签表达定位信息，额外 `DISTANCE` 卡会拉高信息密度而不增加决策价值 | T-0731 | 选中比赛后，右侧详情摘要不再显示 `DISTANCE`；列表卡跳数标签、距离筛选与推荐逻辑保持不变；`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
| [x] | T-0726 | F-007 | 3.1, 3.2 | View | 简化 `Publish Summary`：移除左侧 `What Players Are Joining`，并把 `Target System` / `Duration` 整合进右侧奖池海报 | 当前左侧信息区仍有重复字段，视觉重点分散，不如把核心上下文并入奖池主板 | T-0724 | `Publish Summary` 左侧仅保留 checklist；右侧奖池海报直接展示 `Target System` 与 `Duration` |
| [x] | T-0727 | F-007 | 3.1, 3.2 | View | 将 `Publish Summary` 继续收拢为单块全宽奖池海报，把 `Publish Checklist` 一并整合进右侧海报主板 | 当前左右分栏仍在分散视觉注意力，用户希望奖池海报占满整块摘要区域 | T-0726 | `Publish Summary` 不再分左右两块；`Publish Checklist`、`Target System`、`Duration` 全部并入一个全宽奖池海报模块 |
| [x] | T-0725 | F-007 | 3.1, Architecture 4.5 | Controller / View | 调整创建比赛弹窗的主流程顺序为 `Match Mode -> Match Economics -> Target System`，并仅在 `Precision Mode` 展示 network node targeting 面板 | 当前创建流程先要求选系统/节点再填经济参数，决策顺序不自然；free mode 也暴露了不需要的 node targeting UI，增加认知负担 | T-0719, T-0724 | 创建弹窗按 `Mode -> Economics -> Target System` 顺序渲染；free mode 仅要求选择 target system，不显示 node targeting 面板；precision mode 仍支持系统内 1-5 个 target nodes 点选 |
| [x] | T-0721 | F-007 | Architecture 4.1, 4.4 | View only | 调整主壳层左上角品牌区：将 `FUEL_FROG_PANIC` 改为 `Star Fuel Panic`，并在文字旁接入 `public/mascot-hero-waving.png` mascot 图 | 当前品牌文案仍是旧命名，且主导航缺少更明确的视觉识别锚点 | T-0713 | 所有主路由左上角统一显示 `Star Fuel Panic` + mascot 图，`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过 |
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
- 2026-03-28: 完成 `T-0308`，将 `/api/teams/{id}/pay` 接入真实链上转账事实校验：team payment tx 现在必须匹配 entry payment recipient、coin type 和 exact amount。
- 2026-03-28: 完成 `T-0309`，将 `pay-team` 从地址收款切到统一 `MatchEscrow`：`publish` 路径会持久化 `escrowId`，`/planning` 的队伍支付改为调用 `fuel_frog_panic::lock_team_entry_with_escrow<T>`，`/api/teams/{id}/pay` 则验证 `TeamEntryLocked` 的 `room/escrow/team_ref/member_count/quoted_amount_lux/locked_amount` 与 exact debit；`pnpm build`、`node ./scripts/check-layer-imports.mjs`、`node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/service/walletService.test.ts src/server/devnetChainRuntime.test.ts src/server/matchRuntime.test.ts src/app/api/__tests__/f007-match-flow.test.ts` 与 `sui move test -e testnet` 已通过。
- 2026-03-28: 完成 `T-0310 / T-0311`，将 `/planning` 改成独立战队注册页：新增 `planningTeamRuntime / planningTeamStore / planningTeamService / usePlanningTeamScreenController`，接入 `GET/POST /api/planning-teams`，页面首屏现在只显示当前战队总数与创建入口；`/lobby` 进入 `/planning` 时不再绑定 `matchId`。验证 `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/planningTeamRuntime.test.ts src/app/api/__tests__/planning-teams-route.test.ts`、`pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过。
- 2026-03-28: 完成 `T-0406 / T-0407 / T-0408`，为 `/match` 新增 hackathon `Demo Replay Mode`：增加 `matchDemoReplayStore / matchDemoReplayService / useMatchDemoReplayController`，并让 `useFuelFrogMatchScreenController` 统一编排 `demo-replay / live` 双模式；`FuelFrogMatchScreen` 已重绘为 mascot 战队榜 + 脚本化事件流 + `Replay / Pause / Panic Jump` 控制。验证 `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/service/matchDemoReplayService.test.ts`、`pnpm typecheck`、`node ./scripts/check-layer-imports.mjs`、`pnpm build` 全部通过。
- 2026-03-28: 完成 `T-0409 / T-0410`，继续强化 `/match` 演示层的工业战队徽章感：为 demo/live 队卡补充 `unitTag / callsign / specialty / deltaFromLeader / leaderState / statusStrip` 派生读数，并将 View 重绘为带 stencil 编号条、领跑差值、阵营状态标签和刻度进度条的 warboard 卡片。验证 `pnpm typecheck`、`node ./scripts/check-layer-imports.mjs`、`node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/service/matchDemoReplayService.test.ts` 与 `pnpm build` 通过。
- 2026-03-28: 完成 `T-0411`，抽取共享 `TeamMascotBadge` 组件，将 demo/live 队卡中的 mascot 统一收进同一套硬边徽章框、扫描纹理、code chip 和 `unitTag` 槽位；后续替换正式 mascot PNG 时无需再修改 `/match` 卡片结构。验证 `pnpm typecheck`、`node ./scripts/check-layer-imports.mjs` 与 `pnpm build` 通过。
- 2026-03-28: 完成 `T-0412`，修复主壳层 sidebar 的低高度裁切问题：为 `FuelMissionShell` 的左侧 aside 增加 `overflow-hidden`，并把中部导航区改为 `min-h-0 + overflow-y-auto`，同时固定顶部钱包区和底部按钮不压缩。这样在较矮视口下 `SETTLEMENT LEDGER` 等底部 tab 会进入可滚动区域，不再被遮挡。验证 `node ./scripts/check-layer-imports.mjs` 与 `pnpm build` 通过。
- 2026-03-26: 完成 `F-005` 的 `T-0501 / T-0505`，结算账单切换到 `sponsorshipFee + entryFeeTotal + platformSubsidy` 口径，并新增独立 `GET /api/matches/{id}/settlement` 状态接口。
- 2026-03-28: 完成 `T-0506 / T-0507 / T-0508`，为 `/settlement` 新增 hackathon `Settlement Demo Mode`：增加 `settlementDemoStore / settlementDemoService / useSettlementDemoController`，并让 `useFuelFrogSettlementScreenController` 统一编排 `demo-report / live` 双模式；`FuelFrogSettlementScreen` 已重绘为 `Settling -> Match Report` 双态，突出总奖池、平台抽成、实发奖池、冠军、MVP、我的收益和继续操作。验证 `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/service/settlementDemoService.test.ts`、`pnpm typecheck`、`node ./scripts/check-layer-imports.mjs`、`pnpm build` 全部通过。
- 2026-03-28: 完成 `T-0509`，将 `/settlement` demo 的最终名次和账单生成收口到 `/match` demo 的共享 outcome：`settlementDemoScenario` 现在直接消费 `listMatchDemoOutcomeTeams()` 产出的最终队伍排序与分数，再按统一奖池比例推导 team/member payout，因此冠军、亚军、季军和 payout timeline 已与 `match` 最终排行榜一致。验证 `pnpm typecheck`、`node ./scripts/check-layer-imports.mjs`、`node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/service/settlementDemoService.test.ts` 与 `pnpm build` 通过。
- 2026-03-26: 完成 `F-004` 的公开运行时收口，`/match` 页接入 `GET /api/matches/{id}/scoreboard` 与 `GET /api/matches/{id}/stream`（SSE），并将比赛运行链路的新命名收敛到 `matchRuntime` 兼容层。
- 2026-03-26: 完成 critical path 剩余收口，校正 draft/publish 规则、确认 projection runtime 作为默认读模型，并补齐 `Connect -> Create Draft -> Publish -> Join Team -> Pay -> Run -> Settle` 端到端测试基线。
- 2026-03-28: 完成 `T-0107 / T-0108`，将创建比赛发布链路改为 `createDraft -> publish_match_with_sponsorship<T> -> publish(real txDigest)`，新增 `NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID` 配置，并让 `/api/matches/{id}/publish` 在 verify 模式下校验 `MatchPublished` 事件、coin type 与发布钱包的 exact sponsorship debit；本地验证 `src/server/devnetChainRuntime.test.ts`、`pnpm typecheck`、`pnpm build`、`node ./scripts/check-layer-imports.mjs` 与 `sui move test -e testnet` 已通过。
- 2026-03-28: 完成 `T-0109`，为 publish/team escrow 支付增加 package existence 预检：当前 RPC 上若不存在 `NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID`，前端会在发起交易前直接提示检查 `NEXT_PUBLIC_SUI_NETWORK / NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID / 钱包网络`，不再把原始 `Object <package-id> not found` 暴露给用户；定向回归 `src/service/createMatchService.test.ts` 已通过。
- 2026-03-28: 完成 `T-0110`，确认当前 `0x21ef98e4df778530b6d56222de2ecf3755114839fe8f8d13bcd307eaa3ee91d4` 在 `devnet` 存在、在 `testnet` 不存在；前端现在会在 package 预检失败时补做跨公网网络探测，并把提示升级为 `available on devnet, not testnet` 这类可执行结论；定向回归 `src/utils/suiPackageProbe.test.ts src/service/createMatchService.test.ts src/service/walletService.test.ts` 已通过。
- 2026-03-28: 使用 `sui client test-publish -e testnet --pubfile-path /tmp/fuel_frog_testnet_publish.toml --gas-budget 300000000 --json` 成功将最新 `fuel_frog_panic` 发布到 Sui `testnet`，transaction digest=`DtVLdEiMXrLUGQemLHiBj8Ti9gmDVJza3f6XrrSTMYvC`，package id=`0xe4224e0a7bedb4ea8c0872e922051ef432cc215310bc129d39a75eef1eee86e2`，upgrade capability=`0xab9a80d2db5dbc7cf9ca025662a14d26010e698ea48aa37213cf2590be66a46e`；`.env`、`.env.example` 与 `contracts/Published.toml` 已同步到新 testnet 包地址。
- 2026-03-28: 完成 `T-0010 / T-0011`，将“EVE test token 余额充足但缺 SUI gas”的钱包错误单独识别为 `E_INSUFFICIENT_GAS`，并明确提示 `EVE TEST TOKEN covers the payment amount only; Sui gas must still be paid in SUI`；同时把主界面余额与主要金额文案从 `LUX` 切到 `EVE TEST TOKEN / EVE`，`.env` 与 `.env.example` 已新增 `NEXT_PUBLIC_PAYMENT_TOKEN_LABEL / NEXT_PUBLIC_PAYMENT_TOKEN_SYMBOL`。定向回归 `src/service/walletService.test.ts src/utils/walletBalance.test.ts` 已通过。
- 2026-03-28: 发布最新 escrow 合约到 Sui testnet，transaction digest=`GhZALPKC4atRWGmLozUMxgSjUFKKX54kUQFvz3psiwDL`，package id=`0x21ef98e4df778530b6d56222de2ecf3755114839fe8f8d13bcd307eaa3ee91d4`；`.env` 与 `.env.example` 已同步到该包地址。
- 2026-03-26: 完成 `T-0707`，修复 `nodeRecommendationRuntime`、server relative import 和 `locationService.test` 的类型问题，`pnpm typecheck` 已恢复通过。
- 2026-03-26: 完成 `T-0706 / T-0708`，将 create/lobby/match controller 的 store 访问收回 service 层，恢复 `pnpm lint:imports` 通过，并让 test loader 支持相对无扩展名 import。
- 2026-03-26: 完成 `F-002` 的 `T-0204 / T-0206`，`/lobby` 已切到新 Match Lobby 入口，并补齐位置设置、距离提示、详情预览、自由模式推荐与异常态定向回归。
- 2026-03-26: 完成 `F-006` 的 `T-0601 / T-0603 / T-0604 / T-0605 / T-0606 / T-0607`，新增双 cursor 节点坐标增量同步、投影存储、`constellationRuntime`、runtime worker + `/api/runtime/health`、写接口幂等/签名中间件，并刷新 `docs/devnet-verification-latest.md` 记录最新 devnet 调用结果。
- 2026-03-27: 完成 `T-0608`，将本地 Move demo 合约继续对齐到 PRD v2.6：允许免费入场、强制赞助费下限 50 LUX、固定 5% 平台抽成、禁用旧 host fee / host seed 口径，并将双队分数改为 team score 向量；进一步新增 `create_match_draft / publish_match` 新链路、真实 `target_node_object_ids`（`vector<address>`）和最小 team/apply/approve/lock/pay/whitelist 模型；`sui move test -e testnet` 与 `bash ./scripts/devnet-verify.sh` 已通过，最新 devnet 报告已刷新。
- 2026-03-27: 完成 `T-0609`，新增 `devnetChainRuntime.readMatchPublishedCommitment()`，让 `/api/matches/{id}/publish` 在 verify/strict 场景下可解析链上 `MatchPublished` 事件，并将真实 `room_id` 优先收口到 `match.onChainId`；本地 route-level 回归与前端构建已通过。
- 2026-03-27: 完成 `T-0610`，让 `settlementRuntime` 在读取账单和状态时优先消费显式 `PersistedSettlement` 事实，仅在缺失时才回退到旧的 detail 推导；同时保留 `payoutTxDigest` 的 legacy fallback，避免当前运行路径断裂。
- 2026-03-27: 完成 `T-0611`，将 `teamRuntime` 的 payment/whitelist 持久化收口为显式事实：`persistMatchState()` 不再从队伍内存态临时拼装 `team_payments / match_whitelists`，而是优先维护规范化 fact 并在 runtime 重建时按 fact 恢复 paid/whitelist 状态；同时修复 `runtimeProjectionStore` 的固定 `.tmp` 写文件竞争，并把 F-007 publish route 测试夹具升级到 node-index `version: 3`，相关 route/runtime 回归与 `pnpm build`、`pnpm lint:imports` 已通过。
- 2026-03-27: 完成 `T-0612`，为 `settlementRuntime` 增加显式 settlement fact materialization：`settling` 会落 `running` settlement fact，`settled` 会落 `succeeded` settlement fact；`GET /api/matches/{id}/result` 只在 `succeeded` 时通过 persisted settlement 账单返回结果，不再直接绕过事实层临时出账单。同时将 `PersistedSettlement` 时间字段统一为 `updatedAt`（兼容旧 `settledAt` 读法），并补充 settlement/runtime/route 回归与 `pnpm build`、`pnpm lint:imports` 验证通过。
- 2026-03-28: 完成 `T-0613`，将 settlement materialization 从读接口懒触发推进到显式状态迁移侧效：`matchRuntime.persist()` 在状态切入 `settling/settled` 时会同步触发 settlement fact 写入，并持久化 `settlement_start / settlement_complete` 到 `match_stream_events`；同时补齐 `MatchStreamEvent` 的 `settlement_complete` 契约、SSE 订阅事件白名单和对应 runtime/route 回归。`pnpm build` 首次命中过期 `.next/pages-manifest` 抖动，第二次重跑已通过，`pnpm lint:imports` 通过。
- 2026-03-28: 完成 `T-0614`，将 `/api/matches/{id}/stream` 正式接到 persisted `match_stream_events`：route 会先发送尚未消费的 persisted events，再补 live frame，并对 `settlement_start / settlement_complete` 做去重；同时补充 `matchRuntime` 对 persisted event 的 hydration helper 和 route-level SSE 回归，验证 `settlement_complete` 不再只存在于投影里，而是能通过 stream 实时下发。
- 2026-03-28: 完成 `T-0615`，将 `score_update / phase_change / panic_mode / node_status` 也按“仅在业务载荷变化时”物化到 persisted `match_stream_events`，并让 `/api/matches/{id}/stream` 用归一化事件签名统一去重 live frame；同时将 `devnetChainRuntime` 的支付校验配置改为运行时读取 env，并在 route-level 测试夹具中显式注入 mock chain 配置。为解决 Next 15 构建产物残缺抖动，本轮在验证前将损坏的 `.next` 移到 `/tmp` 后重建，最终 `pnpm build` 与 `pnpm lint:imports` 通过。
- 2026-03-27: 根据最新 PM 决策，将创建比赛的最低赞助费从 `500 LUX` 调整为 `50 LUX` 以便测试；已同步更新 `docs/PRD.md`、`docs/SPEC.md`、`docs/architecture.md`、前端创建表单默认值/阈值、Move 合约常量与 devnet 验证脚本，并重新验证 `sui move test -e testnet` 与 `bash ./scripts/devnet-verify.sh` 通过。
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
- 2026-03-27: 完成 `T-0720`，为创建比赛弹窗补充系统选择 loading 反馈：选定星系后显示黄色状态条与战术地图覆层，并在 `loadingSystem` 期间冻结搜索输入、系统选择、目标点选与发布按钮，避免用户误以为页面卡死。
- 2026-03-27: 完成 `T-0719`，将创建比赛弹窗中的 `Team Cap` 与 `Match Duration` 改为可直接输入数字，压缩 `Match Economics` 说明文案，并重绘 `Pool Projection` 为更亮眼的奖池读数卡片。
- 2026-03-27: 完成 `T-0718`，清除 `scripts/check-layer-imports.mjs` 的 controller->model 白名单，收回现存 controller 越层 import，并新增 `pnpm verify:arch` 作为统一架构门禁；同时更新 `AGENTS.md` 与 TODO 模板，要求前端任务声明 `Layer Scope`。
- 2026-03-27: 完成 `T-0716`，新增 screen/component orchestration controllers，把 `LobbyDiscoveryScreen`、`CreateMatchScreen`、`TeamLobbyScreen`、`FuelFrogMatchScreen`、`FuelFrogSettlementScreen`、`FuelFrogLobbyScreen`、`HeatmapScreen`、`NodeMap3D`、`WalletConnectBridge`、`TargetNodePanel`、`SettlementBillPanel` 的页面编排、副作用和数据拉取从 View 收回 Controller；本地验证 `node ./scripts/check-layer-imports.mjs`、`pnpm typecheck`、`pnpm build` 全部通过。
- 2026-03-27: 完成 `T-0307`，将 `TeamLobbyScreen` 的创建战队表单改为按钮触发 modal，`/planning` 首屏回到 Team Board / Match Snapshot 主视图，现有 `useTeamLobbyController.createTeam` 链路保持不变。
- 2026-03-27: 完成 `T-0005 / T-0006`，将钱包连接弹窗改为受控 `open` 模式并在 provider 进入 `connected` 时立即关闭；同时把余额换算抽到共享工具，优先读取链上 coin metadata decimals，并将 `NEXT_PUBLIC_LUX_COIN_TYPE` 切到真实 LUX coin type 后的读取与支付链路一并打通。
- 2026-03-27: 完成 `T-0007`，确认 `StateService/GetBalance` 需要的 `coinType` 是实际 coin 的 Move type，而不是 `coin_registry::Currency<...>` 包装类型；已将前端配置和回归测试统一更正为 `0xf044...::EVE::EVE`。
- 2026-03-27: 完成 `T-0008`，为每次连接尝试重建新的 `ConnectModal` 实例，并在发起连接前预清理 dApp Kit 的残留连接状态，避免 `EXIT` 后第二次连接卡在 `Awaiting connection...`。
- 2026-03-27: 完成 `T-0009`，将钱包余额读取改为 `getBalance` 优先、`listBalances` 精确回退的双路径策略，并在查询失败时输出明确日志，避免用户只看到 `0 LUX` 而看不到真实错误。
- 2026-03-27: 完成 `T-0721`，将主壳层左上角品牌从 `FUEL_FROG_PANIC` 调整为 `Star Fuel Panic`，并接入 `public/mascot-hero-waving.png` 作为导航 mascot；同时同步更新站点 metadata 标题，验证 `node ./scripts/check-layer-imports.mjs` 与 `pnpm build`。
- 2026-03-27: 完成 `T-0725`，将创建比赛弹窗重排为 `Match Mode -> Match Economics -> Target System`，并将 network node targeting 收敛为 precision-only 步骤；同时把 `CreateMatchScreen` 接到 `useCreateMatchScreenController`，同步更新 `docs/SPEC.md` 与 `docs/architecture.md` 的交互契约描述，并验证 `node ./scripts/check-layer-imports.mjs` 与 `pnpm build`。
- 2026-03-27: 完成 `T-0722`，将创建比赛弹窗中的 `Sponsorship Stake` 与 `Entry Fee` 切到字符串输入缓冲 + blur 提交模式，避免 onChange 阶段的即时钳制破坏自然输入体验。
- 2026-03-27: 完成 `T-0723`，将创建比赛弹窗 `Pool Projection` 改为更高对比度的奖池摘要卡，强化 `Projected Full Pool / Guaranteed Stake / Entry Flow / Payout Pool` 的视觉主次。
- 2026-03-27: 完成 `T-0724`，将创建比赛弹窗 `Pool Projection` 继续重做为奖金海报风格，加入冠军主奖、排名奖金额梯和更强的赛事感标题层次。
- 2026-03-27: 完成 `T-0726`，移除 `Publish Summary` 左侧 `What Players Are Joining` 区块，并把 `Target System` 与 `Duration` 并入右侧奖池海报，减少重复信息与视觉分散。
- 2026-03-27: 完成 `T-0727`，把 `Publish Checklist` 也并入奖池海报主板，使 `Publish Summary` 彻底收拢成单块全宽海报模块。
- 2026-03-28: 完成 `T-0733`，移除 `/lobby` 比赛详情摘要中的 `DISTANCE` 指标卡，保留列表卡跳数标签、距离筛选与推荐逻辑不变，进一步收紧详情面板信息密度。
- 2026-03-28: 完成 `T-0734`，为 create-match 的 `Tactical Node Grid` 增加 hover/focus tooltip，节点悬停时可直接读取名称、当前燃料、满载容量和缺口，不再依赖原生 `title` 提示。
- 2026-03-28: 完成 `T-0735`，将 create-match 的 tactical node tooltip 升级为带 fuel gauge 的战术读数卡，用图形化载油条直接表达当前载油比例与缺口段，降低用户解读数字的成本。
- 2026-03-28: 完成 `T-0736`，将 `/lobby` 主标题从 `MISSION LOBBY / DISCOVERY GRID` 精简为 `MATCH LOBBY`，让比赛大厅语义更直接。
- 2026-03-27: 新增 `T-0728` 调查缺陷：create-match 大量系统返回 `0 nodes`。本地投影显示 `24502` 个系统里只有 `127` 个 indexed nodes，且 `121` 个节点仍停留在 `solarSystem=0`；当前已确认问题主因不是纯搜索排序，而是 node projection / location coverage 缺口。
- 2026-03-27: 完成 `T-0729`，将 `node-index` 快照版本提升到 `v3`，让旧 `v2` 快照自动触发一次全量 `LocationRevealedEvent` 回放；同时在 `NetworkNode` 自身无位置时改为尝试继承 `connectedAssemblyIds` 对应设施的公开位置。`nodeIndexerRuntime` / `nodeRecommendationRuntime` 定向测试与 `pnpm build` 已通过；真实 devnet 同步验证因 RPC timeout 未完成。
- 2026-03-27: 对 `T-0729` 补充真实 testnet 验证：按 `.env` 中的 `testnet + EVE_FRONTIER_PACKAGE_ID` 全量回放后，live snapshot 结果为 `totalNodes=134 / zeroSystemNodes=120 / mappedSystems=10 / selectableSystems=8`。修复已把可映射系统从旧快照的 `6` 提升到 `10`、可选系统从 `3` 提升到 `8`，但 testnet 公开位置事件覆盖仍明显不足。
- 2026-03-28: 完成 `T-0730`，为 create-match 搜索接入 `data/solar-systems.json` 的 canonical/legacy 系统名别名；用户输入 `Jita` 时即使 live world API 当前名称为 `EHK-KH7` 也能命中同一 `systemId`，搜索结果文案会显示 `Jita // EHK-KH7 (30000142)`。同时顺手修复 `/api/constellations` 在未传 `regionId` 时被 `Number(null)` 误判为 `0` 的默认过滤 bug。
- 2026-03-28: 完成 `T-0734`，新增 `matchBackendStore`，让 `/api/matches`、publish、team 变更及多条读接口在配置 `SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY` 后可将比赛/战队主数据镜像到 Supabase 表，并在进程重启后从表 hydrate 回本地投影缓存；同时新增 `supabase/migrations/202603280002_f007_match_runtime_backend.sql` 扩展旧表以承载当前 runtime payload。定向后端镜像测试、discovery route 回归、`node ./scripts/check-layer-imports.mjs`、`pnpm build` 均通过。
- 2026-03-28: 完成 `T-0737`，真实本地 `supabase start` 首次启动暴露出两处闭环问题：旧迁移文件名按字典序执行会打乱 `missions -> matches -> settlements` 依赖顺序，以及 `matchBackendStore.supabaseRequest()` 未兼容 PostgREST `Prefer: return=minimal` 的空响应体。现已将早期迁移调整为“先建表、后补 FK”，新增 `supabase/migrations/202603280003_f007_reconcile_base_foreign_keys.sql` 统一补外键；同时修复空 body 解析并补充 `src/server/matchBackendStore.test.ts` 回归。当前本地 Supabase 已成功启动，`.env` 已接到 `http://localhost:54321`，真实联调脚本 `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --env-file=.env ./scripts/supabase/verify-local-backend.mjs` 已验证 `matches / match_targets / teams / team_members / settlements` 写入与冷启动 hydrate 全部通过，`pnpm typecheck`、`node ./scripts/check-layer-imports.mjs`、`pnpm build` 也已通过。
- 2026-03-28: 完成 `T-0732`，将 create-match 的 `Target System` 区块统一为同一套系统详情 + 战术节点面板结构；free mode 也显示节点战术网格与节点卡片，但仅作为只读的 scoring 范围预览，precision mode 仍保留 1-5 个 target nodes 锁定与发布校验。验证 `pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过。
- 2026-03-28: 完成 `T-0733`，为 create-match 系统搜索补上请求取消与代次保护；选中 `Target System` 时会立即清空 `searchHits` 并 abort 未完成搜索，避免旧搜索响应在选中后重新把结果列表刷回界面。补充 `src/service/createMatchService.test.ts` 定向覆盖，并验证 `pnpm build` 与 `node ./scripts/check-layer-imports.mjs` 通过。
- 2026-03-28: 完成 `T-0731`，重做 `/lobby` 的比赛卡片与详情面板信息层级：卡片改为模式/状态/距离标签 + 奖池主读数 + 关键指标三栏，详情面板改为头部摘要 + 指标卡 + 战场简报，移除大段重复文本。验证 `node ./scripts/check-layer-imports.mjs` 与 `pnpm build` 通过。
- 2026-03-28: 完成 `T-0312 / T-0313 / T-0314 / T-0315`，新增 `/api/players/{address}/team-dossier` 聚合读接口与 `teamDossierStore -> teamDossierService -> useTeamDossierController -> TeamDossierScreen` 新链路，并把 `/team` 接入主导航，用于展示当前战队编制和 deployment log。验证 `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/app/api/__tests__/players.test.ts`、`node ./scripts/check-layer-imports.mjs` 与 `pnpm build` 通过。
- 2026-03-28: 完成 `T-0316`，将 `/team` 页的 `Current Deployment / Deployment Log` 重写为更直白的信息结构：标题调整为 `My Team / Match History`，区块改为 `Current Team / Match History`，并补充解释文案、重命名歧义指标、移除无意义的自引用 `Dossier Sync` 按钮。验证 `node ./scripts/check-layer-imports.mjs` 与 `pnpm build` 通过。
- 2026-03-28: 完成 `T-0318 / T-0319 / T-0320 / T-0321`，将 `/planning` 从“只显示总数”升级为独立战队注册板：`GET /api/planning-teams` 现在返回完整 team board，新增 `POST /api/planning-teams/{id}/join`，并让 `PlanningTeamScreen` 直接展示全部已创建战队、成员/空槽、角色选择与加入按钮。验证 `node --experimental-strip-types --import ./scripts/register-test-loader.mjs --test src/server/planningTeamRuntime.test.ts src/app/api/__tests__/planning-teams-route.test.ts`、`node ./scripts/check-layer-imports.mjs` 与 `pnpm build` 通过。
- 2026-03-28: 完成 `T-0323`，重绘 `/planning` 的独立战队卡片：增加更强的头部身份区、roster 占用进度条、角色槽位仪表、crew roster 和独立 `Join Console` 操作区，让未满员战队的 `Join Team` 成为明确主 CTA。验证 `node ./scripts/check-layer-imports.mjs` 与 `pnpm build` 通过。
- 2026-03-28: 完成 `T-0324`，继续把 `/planning` 战队卡推向更强的游戏内战术编组风格：增加 `UNIT` 编队编号、`RECRUITING / ALMOST READY / FULL` 状态条、vacancy 提示、角色 chip 选择器，以及更突出的 `Join Team As ...` 主按钮；未满员战队的加入区现在在视觉上成为卡片第一层操作。验证 `node ./scripts/check-layer-imports.mjs` 与 `pnpm build` 通过。
- 2026-03-28: 完成 `T-0325 / T-0326`，修正 `/planning` 的 join CTA 可见性与战队卡头部摘要区版式：非满员战队现在始终可见 `Join Team` 按钮（不满足条件时为 disabled 态），同时把 `队名 / 队长 / 当前人数 / 空位数` 收敛到稳定的两栏摘要，不再出现 `Alpha Squad / Captain / Seats / 1` 这种碎裂显示。验证 `node ./scripts/check-layer-imports.mjs` 与 `pnpm build` 通过。
- 2026-03-28: 完成 `T-0327`，再次收紧 `/planning` 战队卡布局：将 `队名 / 队长` 与 `Roster / Open` 彻底拆成上下两层块，避免摘要区继续打架；同时 `Join Team` 改为永远固定占位，非满员战队即使当前不可加入也会显示 disabled 主按钮和原因文案。验证 `node ./scripts/check-layer-imports.mjs` 与 `pnpm build` 通过。
- 2026-03-28: 完成 `T-0322`，移除 `/planning` 首屏独立 `Create Team` 面板，将 `Open Create Team` CTA 与禁用提示并入 `Current Team Count` 模块；team board 和创建 modal 逻辑保持不变。验证 `node ./scripts/check-layer-imports.mjs` 与 `pnpm build` 通过。
