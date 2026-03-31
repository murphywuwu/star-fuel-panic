# Fuel Frog Panic — Architecture Baseline

Version: v6.3
Last Updated: 2026-03-31
Source: `docs/PRD.md` v2.7.0

---

## 1. v2.7 Baseline Changes

本次架构基线以 PRD v2.7.0 为准，在 v2.6 基础上新增燃料品级计分加成机制：

### 1.1 v2.7 新增：燃料品级计分加成

- **燃料品级体系**：基于链上 `FuelConfig.fuel_efficiency` 表，将燃料划分为三个品级（Tier 1/2/3），分别给予 1.0x / 1.25x / 1.5x 的计分加成。
- **新增 `fuelConfigRuntime`**：负责缓存链上燃料效率配置，5 分钟刷新周期，为计分引擎提供品级查询服务。
- **计分公式更新**：`score = fuelAdded × urgencyWeight × panicMultiplier × fuelGradeBonus`，最高系数从 4.5x 提升到 **6.75x**。
- **`fuel_events` 表扩展**：新增 `fuel_type_id`、`fuel_grade`、`fuel_grade_bonus` 字段，支持品级审计和弹幕展示。
- **浮窗弹幕增强**：每条加油弹幕展示燃料品级图标（⚪/🟡/🟣）和乘数明细。

### 1.2 v2.6 基线（保留）

- 比赛模式以 `free`（自由模式）和 `precision`（精准模式）为唯一对外模式，不再以"主办方定制赛 / official match / host prize pool"作为主模型。
- 创建比赛时，`solarSystemId` 必填；`sponsorshipFee >= 50 LUX` 必填；`targetNodeIds` 仅在精准模式下必填，数量为 1-5。
- 星系选择成为前置流程，系统可选性由 `isOnline && isPublic` 的节点存在性决定。
- Lobby 是任务发现主入口；位置设置、比赛筛选、推荐节点都收敛到 Lobby，不再以独立节点地图页作为默认入口。
- `/planning` 默认改为独立战队注册页：不再要求 `matchId`，首屏只负责显示当前战队总数与创建战队入口。
- 结算口径更新为：`grossPool = sponsorshipFee + entryFeeTotal + platformSubsidy`，平台统一抽成 5%，剩余 95% 进入玩家奖池。
- PRD 的旧术语 `mission`、`nodes` 可保留为兼容实现名，但文档与新接口统一采用 `match`、`network-node` 口径。

---

## 2. Architecture Principles

| 原则 | 约束 |
|---|---|
| 前端单向分层 | 必须严格执行 `View -> Controller -> Service -> Model`，View 不能直接读写 Zustand 或请求 BFF。 |
| 链上事实优先 | 计分、燃料状态、白名单、支付、开赛/结算时间窗口的信任根来自 Sui 链上对象与事件。 |
| 链下投影负责体验 | 星系列表、比赛大厅、实时得分板、弹幕、房间状态、推荐节点由后端投影和缓存提供，不能反向篡改链上事实。 |
| 读写分离 | 读接口返回投影读模型；写接口只接收命令并触发运行时处理，禁止在 View 中拼装业务规则。 |
| 幂等优先 | 所有会创建资产锁定、支付确认、开赛、结算的写操作都必须具备幂等键和状态去重。 |
| 实时链路独立 | 链上事件监听、得分计算、房态流转和结算处理不依赖前端在线状态，前端只消费结果。 |
| 兼容当前仓库 | 当前代码中的 `mission*`、`/api/nodes`、`/api/missions` 可作为兼容层存在，但不应继续扩散到新设计。 |

---

## 3. System Context

```text
Players
  ├─ Web Dashboard (browser)
  └─ In-game Overlay (EVE WebView)
          │
          ▼
Frontend (Next.js App Router)
  ├─ View Layer
  ├─ Controller Layer
  ├─ Service Layer
  └─ Model Layer (Zustand only)
          │
          ▼
BFF / Runtime Layer
  ├─ Route Handlers
  ├─ solarSystemRuntime
  ├─ constellationRuntime
  ├─ nodeRuntime
  ├─ nodeRecommendationRuntime
  ├─ matchRuntime
  ├─ teamRuntime
  ├─ chainSyncEngine
  └─ settlementRuntime
          │
          ├─ Supabase / PostgreSQL / Realtime
          ├─ Sui RPC + Event Stream
          └─ EVE Frontier world metadata API
```

### 3.1 Product Technical Architecture Diagram

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                  View Layer                                 │
│ React / Next.js UI rendering and user interaction                           │
│ (Lobby, Planning, Match Runtime, Settlement, In-game Overlay, Wallet Entry) │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │ User actions / state display
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                               Controller Layer                              │
│ Custom hooks orchestrating use-cases and UI workflows                       │
│ (useLobbyController, useCreateMatchController, useTeamLobbyController,      │
│  useMatchRuntimeController, useSettlementController, useAuthController)     │
└───────────────────┬──────────────────────────────────┬───────────────────────┘
                    │ Coordinate business calls         │ Read / update state
                    ▼                                   ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────────┐
│            Service Layer             │  │            Model Layer            │
│ API clients + stream adapters        │  │ Zustand stores by domain          │
│ (match/team/solarSystem/recommend/   │  │ (auth/create/lobby/location/team │
│  stream/settlement services)         │  │  Lobby/matchRuntime/settlement)  │
└───────────────────┬──────────────────┘  └───────────────────────────────────┘
                    │ HTTP / WS calls
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         BFF / Runtime Layer (Next API)                      │
│ Route handlers + domain runtimes                                            │
│ (matchRuntime, teamRuntime, solarSystemRuntime, constellationRuntime,       │
│  nodeRuntime, nodeRecommendationRuntime, chainSyncEngine, settlementRuntime)│
└──────────────────────────┬──────────────────────────────┬────────────────────┘
                           │ Read/write projections        │ Chain/world reads
                           ▼                               ▼
┌───────────────────────────────────────────┐   ┌──────────────────────────────┐
│     Supabase / PostgreSQL / Realtime     │   │      On-chain / External      │
│ matches, teams, team_members,            │   │ Sui RPC + Event Stream        │
│ team_join_applications, team_payments,   │   │ EVE World Metadata API        │
│ match_whitelists, network_nodes,         │   │                                │
│ match_scores, match_stream_events,       │   │                                │
│ settlements, solar_systems_cache,        │   │                                │
│ constellation_summaries                  │   │                                │
└───────────────────────────────────────────┘   └──────────────────────────────┘
```

---

## 4. Frontend Architecture

### 4.1 Route Baseline

当前仓库中，前端入口建议按以下边界解释：

| Route | 责任 |
|---|---|
| `/` | 钱包接入、玩家身份建立、进入 Lobby 的前置引导。 |
| `/lobby` | 比赛发现主入口；比赛列表、筛选、比赛详情预览、位置设置，以及创建比赛快捷入口（modal）。 |
| `/planning` | 独立战队注册页；显示当前战队总数并支持创建战队，同时保留创建比赛的 fallback / deep-link 入口。 |
| `/match` | 比赛进行中主视图；浏览器模式与游戏内浮窗共用同一领域状态。 |
| `/settlement` | 结算等待页与战报页。 |
| `/nodes-map` | 仅作为精准模式选点的内部视图或兼容入口，不再作为独立任务发现入口。 |

### 4.2 Domain Module Ownership

| Domain | View | Controller | Service | Model |
|---|---|---|---|---|
| Entry / Auth | 钱包接入、身份状态条 | `useAuthController` | `authService`, `walletService` | `authStore` |
| Match Creation | 模式切换、星系选择器、精准模式节点地图、奖池预览 | `useCreateMatchController` | `matchService`, `solarSystemService`, `networkNodeService` | `createMatchStore` |
| Lobby Discovery | 比赛卡片、筛选器、比赛详情预览、位置选择器 | `useLobbyController`, `useLocationController` | `matchService`, `solarSystemService`, `nodeRecommendationService` | `lobbyStore`, `locationStore` |
| Planning Team Registry | 总战队数、创建战队 modal、申请加入、队长审批、成员退出、队长解散 | `usePlanningTeamController` | `planningTeamService` | `planningTeamStore` |
| Match Team Lobby | 比赛内战队列表、角色槽、锁队、付费 | `useTeamLobbyController` | `teamService` | `teamLobbyStore` |
| Match Runtime / Overlay | 倒计时、得分板、目标节点面板、弹幕、Panic 横幅，以及 hackathon demo replay 编排 | `useMatchRuntimeController`, `useFuelFrogMatchScreenController` | `matchStreamService`, `scoreService`, `matchDemoReplayService` | `matchRuntimeStore`, `matchDemoReplayStore` |
| Settlement | 结算等待页、队伍分账、个人分账、MVP，以及 hackathon settlement demo 编排 | `useSettlementController`, `useFuelFrogSettlementScreenController` | `settlementService`, `settlementDemoService` | `settlementStore`, `settlementDemoStore` |

### 4.3 State Ownership

| Store | 所有权 | 持久化 | 说明 |
|---|---|---|---|
| `authStore` | 当前钱包地址、连接状态、玩家基础资料 | Session | 钱包断开时必须清空依赖状态。 |
| `createMatchStore` | 创建比赛草稿、选中星系、选中节点、校验错误 | Memory | 仅服务创建流程；发布成功后重置。 |
| `lobbyStore` | 比赛列表、筛选条件、选中比赛、分页状态 | Memory | 所有比赛发现逻辑的唯一前端状态源。 |
| `locationStore` | 玩家当前位置、位置选择器状态、距离缓存 | Local + Memory | 仅保存玩家主动设置的位置，不保存链上位置推断。 |
| `planningTeamStore` | 独立战队列表、总数、申请列表、创建/审批/退出中状态 | Memory | 仅服务 `/planning` 首屏；不绑定比赛上下文。 |
| `teamLobbyStore` | 战队列表、成员槽位、锁定状态、支付状态 | Memory | 和比赛详情解耦，避免跨页面脏状态。 |
| `matchRuntimeStore` | 当前阶段、剩余时间、得分板、目标节点状态、弹幕、流健康度 | Memory | 只来自 `/status` 快照和 WS/Realtime 事件。 |
| `matchDemoReplayStore` | demo replay 当前秒数、播放状态、脚本帧快照 | Memory | 仅用于 `/match` 路演演示模式；不写后端，不反向覆盖真实比赛状态。 |
| `settlementStore` | 结算状态、账单、MVP、分享数据 | Memory | 结算完成后只读。 |
| `settlementDemoStore` | settlement demo 当前秒数、播放状态、脚本帧快照 | Memory | 仅用于 `/settlement` 路演演示模式；不写后端，不触发真实 claim。 |

### 4.4 Frontend Dependency Rules

- View 只能调用 Controller 暴露的状态和动作。
- Controller 只做参数整形、错误态映射、页面编排，不直接请求数据库、不直接操作 store。
- Service 负责调用 BFF、订阅实时流、写入 Zustand actions。
- Model 只能承载状态、actions、selectors，不能发请求、不能依赖 DOM。
- View 不得保有业务流程级 `useState/useEffect/useMemo`：表单草稿、modal 开关、search debounce、URL sync、异步 bootstrap、消息提示、数据拉取生命周期都必须进入 controller。
- View 允许保留的唯一局部状态是 hover/focus/animation 这类纯呈现微状态，且不能触发 service/model side effect。
- 精准模式的节点地图只是一种 View 组件，不构成新的领域边界；它仍属于 Match Creation 域。
- 浏览器比赛页和游戏内浮窗必须共享同一份 `matchRuntimeStore` 读模型，避免两套计分语义。

### 4.5 Screen Orchestration Controllers

| View | Orchestration Controller | Ownership |
|---|---|---|
| `LobbyDiscoveryScreen` | `useLobbyDiscoveryScreenController` | 管理 create-match modal、location picker、search/browse 展开态和推荐加载编排。 |
| `CreateMatchScreen` | `useCreateMatchScreenController` | 管理 economics-first create flow、system search debounce、统一 target-system node grid 展示、precision-only target locking、publish feedback 和关闭重置流程。 |
| `PlanningTeamScreen` | `usePlanningTeamScreenController` | 管理独立战队总数加载、创建 modal、申请加入、队长审批、成员退出、队长解散和页面级 mutation message。 |
| `TeamLobbyScreen` | `useTeamLobbyScreenController` | 管理创建战队 modal、审批/拒绝输入、支付提示和页面级 mutation message。 |
| `FuelFrogMatchScreen` | `useFuelFrogMatchScreenController` | 管理 live/demo 模式切换、stream boot、replay playback、排行榜派生、目标节点视图模型和 event feed 裁剪。 |
| `FuelFrogSettlementScreen` | `useFuelFrogSettlementScreenController` | 管理 live/demo 模式切换、settlement demo playback、MVP/收益 hero 派生、真实结算 fallback 和页面级 message。 |
| `FuelFrogLobbyScreen` | `useFuelFrogLobbyScreenController` | 管理 legacy squad lobby 表单、队伍选择和支付/锁队 blocker 文案。 |
| `NodeMap3D` | `useNodeMapViewController` | 管理 URL query 同步、overview bootstrap、breadcrumb 和 scene projection。 |
| `WalletConnectBridge` / `TargetNodePanel` / `SettlementBillPanel` | `useWalletConnectBridgeController` / `useTargetNodePanelController` / `useSettlementBillPanelController` | 管理 modal 生命周期、节点详情拉取、结算面板 message，不再由 View 自行编排。 |

---

## 5. Backend Runtime Ownership

### 5.1 Runtime Matrix

| Runtime | 职责 | 读取 | 写入 | 侧效归属 |
|---|---|---|---|---|
| `solarSystemRuntime` | 同步星系元数据、单星系详情、gateLinks、搜索基础数据 | world metadata API | `solar_systems_cache` | 外部 world API 拉取、缓存刷新 |
| `constellationRuntime` | 维护星座视图、推荐星系、系统可选性聚合 | `solar_systems_cache`, `network_nodes` | `constellation_summaries` | 聚合刷新，无链上写入 |
| `nodeRuntime` | 维护 `NetworkNode` 读模型、5 秒刷新燃料比和紧急度，并在节点自身无位置时回退到 connected assembly 的公开位置 | Sui objects + events | `network_nodes` | 批量 RPC 轮询、节点投影 |
| `nodeRecommendationRuntime` | 基于位置和拓扑计算推荐节点 | `network_nodes`, `solar_systems_cache`, `matches` | 无持久写入或可选缓存 | 推荐算法执行 |
| `planningTeamRuntime` | 维护独立战队注册表、申请队列与总数 | `planning_teams`, `planning_team_applications` projection | `planning_teams`, `planning_team_members`, `planning_team_applications` projection | 独立建队校验、队长钱包归属、申请审批、退出/解散编排、计数统计 |
| `matchRuntime` | 创建草稿、发布比赛、比赛列表、状态机、开赛条件校验 | `matches`, `teams`, `team_payments`, `network_nodes` | `matches`, `match_target_nodes`, `match_stream_events` | 比赛状态迁移、发布幂等；进入 `settling/settled` 时负责触发 settlement fact materialization 与对应流事件；核心 live frame 事件按变更快照写入 `match_stream_events` |
| `teamRuntime` | 创建战队、入队申请、队长审批、锁队、报名支付确认、白名单快照写入 | `matches`, `teams`, `team_members`, `team_join_applications` | `teams`, `team_members`, `team_join_applications`, `team_payments`, `match_whitelists` | 申请审批编排、钱包支付校验、白名单编排；队伍报名费必须进入 publish 阶段创建的 `MatchEscrow`，并以 `TeamEntryLocked` commitment 驱动 `team_payments / match_whitelists` 规范事实 |
| `fuelConfigRuntime` | 缓存链上 `FuelConfig.fuel_efficiency` 表，提供燃料品级查询服务 | Sui RPC (`FuelConfig` object) | `fuel_config_cache` (内存) | 5 分钟刷新周期，降级时全部返回 Tier 1 |
| `chainSyncEngine` | 监听 `FuelEvent(DEPOSITED)`、交易溯源、三重过滤、**燃料品级加成计算**、记分广播 | Sui event stream, tx blocks, `match_whitelists`, `matches`, `fuelConfigRuntime` | `fuel_events`, `match_scores`, `match_stream_events` | 链上订阅、事件去重、品级加成 |
| `settlementRuntime` | 冻结分数、计算平台费与分账、执行链上发奖、生成账单 | `match_scores`, `team_payments`, `matches`, `teams` | `settlements`, `matches`, `match_stream_events` | 结算单飞锁、链上转账；`settlements` 是 running/succeeded 结算事实的规范持久层 |

### 5.2 Route Handler Ownership

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Discovery Module                                                             │
│ Owner Runtime: solarSystemRuntime + constellationRuntime                     │
│ Routes:                                                                       │
│ - GET /api/solar-systems                                                     │
│ - GET /api/solar-systems/[id]                                                │
│ - GET /api/constellations                                                    │
│ - GET /api/search                                                            │
│ - GET /api/solar-systems/recommendations                                     │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Node Module                                                                  │
│ Owner Runtime: nodeRuntime + nodeRecommendationRuntime                       │
│ Routes:                                                                       │
│ - GET /api/network-nodes                                                     │
│ - GET /api/network-nodes/recommendations                                     │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Match Module                                                                 │
│ Owner Runtime: matchRuntime                                                  │
│ Routes:                                                                       │
│ - GET /api/matches                                                           │
│ - GET /api/matches/[id]                                                      │
│ - GET /api/matches/[id]/status                                               │
│ - GET /api/matches/[id]/scoreboard                                           │
│ - POST /api/matches/[id]/publish                                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Planning Team Module                                                         │
│ Owner Runtime: planningTeamRuntime                                           │
│ Routes:                                                                       │
│ - GET /api/planning-teams                                                    │
│ - POST /api/planning-teams                                                   │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Team Module                                                                  │
│ Owner Runtime: teamRuntime                                                   │
│ Routes:                                                                       │
│ - GET /api/matches/[id]/teams                                                │
│ - POST /api/teams                                                            │
│ - POST /api/teams/[id]/join                                                  │
│ - POST /api/teams/[id]/applications/[applicationId]/approve                 │
│ - POST /api/teams/[id]/applications/[applicationId]/reject                  │
│ - POST /api/teams/[id]/leave                                                 │
│ - POST /api/teams/[id]/lock                                                  │
│ - POST /api/teams/[id]/pay                                                   │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Settlement Module                                                            │
│ Owner Runtime: settlementRuntime                                             │
│ Routes:                                                                       │
│ - GET /api/matches/[id]/result                                               │
│ - GET /api/matches/[id]/settlement                                           │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Realtime Stream Module                                                       │
│ Owner Runtime: matchRuntime + chainSyncEngine + settlementRuntime            │
│ Routes:                                                                       │
│ - GET /api/matches/[id]/stream (SSE)                                         │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Runtime Ops                                                                  │
│ Owner Runtime: runtimeSupervisor + workerHealth                              │
│ Routes:                                                                       │
│ - GET /api/runtime/health                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Data Ownership and Storage

### 6.1 On-chain vs Off-chain Boundary

| 数据 | 信任根 | 说明 |
|---|---|---|
| `FuelEvent(DEPOSITED)` | On-chain | 唯一计分事件源。 |
| `NetworkNode.fuel_quantity / fuel_max_capacity / status / location` | On-chain | 节点油量、在线状态、位置公开事实。 |
| 赞助费锁定 / 入场费支付 | On-chain | 所有资产出入都必须有 tx digest。 |
| 白名单注册 | On-chain or signed immutable off-chain snapshot referenced by tx | 作为三重过滤第一层信任根。 |
| 比赛开始 / 结束窗口 | On-chain timestamp or tx confirmation + off-chain mirrored status | 对记分时间窗可审计。 |
| 比赛列表、筛选、星系可选性、推荐节点、实时得分板、弹幕 | Off-chain projection | 基于链上事实派生，服务体验层。 |
| 结算账单展示、MVP、排名页 | Off-chain projection + on-chain payout result | 展示层以投影为主，金额和转账以链上结果校验。 |

### 6.2 Canonical Supabase Tables

| Table | Owner | 关键字段 |
|---|---|---|
| `solar_systems_cache` | `solarSystemRuntime` | `system_id`, `system_name`, `constellation_id`, `region_id`, `gate_links`, `updated_at` |
| `constellation_summaries` | `constellationRuntime` | `constellation_id`, `system_count`, `urgent_node_count`, `selectable_system_count`, `updated_at` |
| `network_nodes` | `nodeRuntime` | `object_id`, `solar_system_id`, `fill_ratio`, `urgency`, `is_online`, `is_public`, `active_match_id`（UI 主展示投影） |
| `matches` | `matchRuntime` | `id`, `mode`, `status`, `solar_system_id`, `sponsorship_fee`, `entry_fee`, `max_teams`, `duration_hours`, `publish_tx_digest` |
| `match_target_nodes` | `matchRuntime` | `match_id`, `node_object_id`, `captured_fill_ratio`, `captured_urgency` |
| `teams` | `teamRuntime` | `id`, `match_id`, `captain_address`, `status`, `member_count`, `is_locked`, `payment_status` |
| `team_members` | `teamRuntime` | `team_id`, `wallet_address`, `role`, `joined_at` |
| `team_join_applications` | `teamRuntime` | `id`, `team_id`, `applicant_address`, `role`, `status(pending/approved/rejected)`, `reason`, `reviewed_at`, `reviewed_by` |
| `team_payments` | `teamRuntime` | `team_id`, `tx_digest`, `amount`, `confirmed_at` |
| `match_whitelists` | `teamRuntime` | `match_id`, `wallet_address`, `team_id`, `source_payment_tx` |
| `fuel_events` | `chainSyncEngine` | `tx_digest`, `event_seq`, `match_id`, `sender`, `assembly_id`, `fuel_added`, `fuel_type_id`, `fuel_grade`, `fuel_grade_bonus`, `score_delta` |
| `match_scores` | `chainSyncEngine` | `match_id`, `team_id`, `wallet_address`, `total_score`, `last_event_at` |
| `settlements` | `settlementRuntime` | `match_id`, `status`, `bill`, `payout_tx_digest`, `updated_at` |
| `match_stream_events` | `matchRuntime` family | `match_id`, `event_type`, `payload`, `created_at` |
| `idempotency_keys` | write route middleware | `scope`, `key`, `request_hash`, `status`, `created_at` |
| `worker_health` | runtimeSupervisor | `worker`, `status`, `heartbeat_at`, `restart_count`, `last_error` |

---

## 7. Critical Flows

### 7.1 Create Match and Publish

1. View 按 `mode -> economics -> target system -> target nodes(if precision)` 顺序填写创建草稿，Controller 调用 `matchService.createDraft`；`target system` 搜索层在 focus 空态优先展示 `Ready Systems` 候选，在有 query 时保留所有文本命中系统，但将 `selectable` 系统前置，`no_nodes / offline_only / not_public` 系统下沉并保留原因标签。`Target System` 区块在 `free / precision` 两种模式下都展示统一的系统详情 + 战术节点网格结构；其中 `free` 只读展示系统内 online nodes，`precision` 才允许锁定 1-5 个目标节点。
2. `POST /api/matches` 只做业务校验和草稿创建，返回 `matchId`.
3. 客户端调用 `fuel_frog_panic::publish_match_with_sponsorship<T>`，将真实赞助费（测试阶段可使用 EVE test token 代替 LUX）锁入链上 escrow，并获得 `publishTxDigest`.
4. `POST /api/matches/{id}/publish` 校验：
    - 比赛仍为 `draft`
   - `sponsorshipFee >= 50`
   - `publishTxDigest` 对应链上交易真实存在
   - 交易必须包含 `MatchPublished` 事件
   - 付款钱包的实际扣款币种、金额与赞助费规则完全匹配
   - `solarSystemId` 对应的目标星系满足 selectable 规则
   - 精准模式下 `targetNodeIds.length` 在 1-5 之间，且节点属于目标星系
5. `matchRuntime` 将比赛状态切为 `lobby`，刷新 `match_target_nodes` 与节点展示投影；`network_nodes.active_match_id` 仅作为 UI 主展示引用，不作为唯一占用键。
6. Lobby 读模型可见该比赛。

### 7.2 Lobby Discovery and Location Recommendation

1. Lobby 首屏拉取 `GET /api/matches?status=lobby`.
2. 位置选择器读取 `GET /api/solar-systems` 和 `GET /api/search`.
3. 选定当前位置后，`locationStore` 记录 `systemId`.
4. 自由模式卡片可调用 `GET /api/network-nodes/recommendations` 获取推荐节点。
5. 距离显示由 `solarSystemRuntime` 的 gateLinks 拓扑计算，结果写入读模型，不在前端做路径搜索。

### 7.3 Planning Team Registry and Match Enrollment

1. 玩家进入 `/planning`，读取独立战队总数与已创建战队列表。
2. 队长通过 `POST /api/planning-teams` 创建独立战队；此时不要求 `matchId`。
3. 后续当玩家进入具体比赛报名阶段时，才通过 `teamRuntime` 的 `POST /api/teams`、`/join`、`/approve`、`/reject` 处理比赛内阵容。
4. 队长执行锁队，锁队后成员名单冻结，拒绝新申请和离队。
5. 队长发起链上入场费支付，前端调用 `fuel_frog_panic::lock_team_entry_with_escrow<T>`，将 `entryFee * memberCount` 直接锁入比赛发布时创建的 `MatchEscrow`。
6. `POST /api/teams/{id}/pay` 校验支付交易：必须包含 `TeamEntryLocked` 事件，且付款钱包 exact debit 与 `room/escrow/team_ref/member_count/quoted_amount_lux/locked_amount` 全匹配，然后写入 `team_payments`。
7. `teamRuntime` 同步白名单快照，比赛可进入开赛条件判断。

### 7.4 Live Scoring

1. `chainSyncEngine` 订阅 `FuelEvent(DEPOSITED)`.
2. 对每个事件执行交易溯源，获取 `sender`、`timestamp` 与 `fuel_type_id`.
3. 执行三重过滤：
   - `sender` 在本局白名单
   - 自由模式下节点属于目标星系；精准模式下节点在目标节点集
   - 时间戳位于 `[startedAt, endedAt]`
4. **查询燃料品级**：通过 `fuelConfigRuntime` 获取 `fuel_type_id` 对应的 `efficiency`，映射为品级加成：
   - Tier 1 (efficiency 10-40%): `fuelGradeBonus = 1.0`
   - Tier 2 (efficiency 41-70%): `fuelGradeBonus = 1.25`
   - Tier 3 (efficiency 71-100%): `fuelGradeBonus = 1.5`
   - 未知燃料类型：降级为 `fuelGradeBonus = 1.0`，记录告警日志
5. 计算 `fuelAdded * urgencyWeight * panicMultiplier * fuelGradeBonus`.
6. 更新 `match_scores`，并通过 `match_stream_events` 广播 `score_update`（含品级信息）.
7. 前端只消费流，不自行计算最终得分。

### 7.5 Settlement

1. `matchRuntime` 将比赛从 `running/panic` 切换到 `settling`.
2. `settlementRuntime` 获取最终得分快照，计算 `grossPool`, `platformFee`, `payoutPool`.
3. 按 PRD 排名比例计算队伍奖金，再按个人贡献占比分配到个人。
4. 发起链上奖励转账，保存 `payoutTxDigest`.
5. 结算成功后将比赛标记为 `settled`，生成结果账单。
6. `/settlement` 页面读取只读账单和链上结果引用。

---

## 8. Side-effects, Retry, and Idempotency

- 所有写接口必须接受 `X-Idempotency-Key`。
- `POST /api/matches` 以 `creatorAddress + idempotencyKey` 幂等。
- `POST /api/matches/{id}/publish` 以 `matchId + publishTxDigest` 幂等。
- `POST /api/teams/{id}/join` 以 `teamId + applicantAddress + role` 幂等（pending 期间重复提交回放同一申请）。
- `POST /api/teams/{id}/applications/{applicationId}/approve|reject` 以 `applicationId + action` 幂等。
- `POST /api/teams/{id}/pay` 以 `teamId + payTxDigest` 幂等，重复请求只能回放同一确认结果。
- `chainSyncEngine` 以 `txDigest + eventSeq` 去重，允许事件流至少一次投递。
- `matchRuntime` 的状态迁移必须做 compare-and-set，禁止双 worker 重复推进。
- `settlementRuntime` 采用单飞锁，保证每场比赛最多一次有效结算。
- 读取 world metadata API 失败时允许返回缓存，但必须在响应中携带 `stale=true` 标记。

---

## 9. Error Contract and Observability

### 9.1 Error Contract

| 层 | 错误类型 | 处理方式 |
|---|---|---|
| View | 表单校验错误 | 仅展示可纠正提示，不做重试。 |
| Controller | 业务态错误映射 | 统一映射为用户可读文案和 CTA。 |
| Service | 网络 / 超时 / 冲突 | 透传错误码，标记是否可重试。 |
| Runtime | 链上校验失败 / 状态冲突 / 外部依赖失败 | 记录结构化日志，返回统一 `ApiError`。 |

### 9.2 Required Telemetry

| 指标 | 目标 |
|---|---|
| `score_delivery_latency_ms` | < 1000ms |
| `danmaku_latency_ms` | < 500ms |
| `node_snapshot_age_seconds` | <= 5s |
| `match_publish_latency_ms` | < 3000ms（不含钱包签名等待） |
| `settlement_duration_seconds` | 10-30s |
| `world_cache_staleness_seconds` | 可观测，超阈值报警 |

所有结构化日志必须至少包含：

- `requestId`
- `matchId`（如有）
- `teamId`（如有）
- `walletAddress`（如有）
- `txDigest`（如有）
- `runtime`
- `errorCode`（失败时）

---

## 10. PRD Traceability

| PRD 章节 | 架构落点 |
|---|---|
| 4.1 创建 & 发布比赛 | 第 4.2 节 Match Creation 域、第 5 节 `solarSystemRuntime/constellationRuntime/matchRuntime`、第 7.1 流程 |
| 4.2 创建战队 | 第 4.2 节 Planning Team Registry / Match Team Lobby 域、第 5 节 `planningTeamRuntime/teamRuntime`、第 7.3 流程 |
| 4.3 发现 & 参加比赛 | 第 4.2 节 Lobby Discovery 域、第 7.2 流程 |
| 4.4 启动比赛 | 第 5 节 `matchRuntime/chainSyncEngine`、第 7.4 流程 |
| 4.5 自动分账 | 第 5 节 `settlementRuntime`、第 7.5 流程 |
| 5 技术架构要点 | 第 3-9 节整体实现 |
| 8 链上 / 链下边界 | 第 6 节数据所有权边界 |

---

## 11. Architecture Decision Notes

- 兼容层可以保留旧路由与旧服务名，但新增实现必须以本文件中的领域边界和接口命名为准。
- `draft` 与 `cancelled` 为内部状态，用于支撑“先创建草稿后发布”和“未开赛退款”两类流程；公开大厅默认不返回这两类状态。
- 自由模式的记分边界以目标星系为准；精准模式的记分边界以发布时冻结的 `targetNodeIds` 为准。
- `activeMatchId` 不是节点与比赛的一对一强约束字段；节点与比赛的规范关系以 `matches.solar_system_id` 和 `match_target_nodes` 为准。
