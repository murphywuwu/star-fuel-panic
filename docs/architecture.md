# Fuel Frog Panic — 技术架构设计

Version: v4.0
Last Updated: 2026-03-21
Source: `docs/PRD.md` v2.0

---

## 1. 技术栈总览

| 层 | 技术选型 | 选型理由 |
|---|---|---|
| 前端 | Next.js 14 (App Router) + React 18 + Zustand + Tailwind CSS | SSR/SSG 支持、TypeScript 全栈统一、轻量状态管理 |
| 后端 | Supabase (PostgreSQL + Realtime + Edge Functions + Auth) | 零运维、内置 WS 实时订阅、Row Level Security、与前端同构 TS |
| 缓存 | Supabase Edge + 前端 Zustand 缓存 | Supabase Realtime 已提供 pub/sub 能力，无需独立 Redis |
| 合约 | Sui Move | EVE Frontier 原生链、SharedObject 可公开读取 |
| 部署 | Vercel (前端) + Supabase Cloud (后端) | Hackathon 快速交付，免运维 |

### 1.1 为什么选 Supabase 而不是自建 NestJS

本项目是 **Hackathon Demo**，核心约束是交付速度。Supabase 提供：

- **PostgreSQL 开箱即用**：表、索引、RLS 权限策略直接在 Dashboard 管理
- **Realtime 内置**：`supabase.channel()` 直接订阅表变更和自定义广播，替代手写 WebSocket 服务
- **Edge Functions**：TypeScript 无服务器函数，处理链上事件归因、结算触发等后端逻辑
- **Auth**：可对接自定义钱包签名验证，无需自建 session 管理

对于后续生产化，可平滑迁移至 NestJS + 独立 PostgreSQL + Redis。

---

## 2. 系统架构总图

```
┌─────────────────────────────────────────────────────────────────┐
│                        Players                                   │
│  EVE Frontier WebView (浮窗)  ←→  Web Dashboard (浏览器)         │
└──────────────┬──────────────────────────┬───────────────────────┘
               │  HTTPS + WSS             │
┌──────────────▼──────────────────────────▼───────────────────────┐
│                    Next.js Frontend (Vercel)                      │
│                                                                   │
│  ┌─────────┐  ┌────────────┐  ┌───────────┐  ┌───────────────┐ │
│  │  View   │→ │ Controller │→ │  Service  │→ │ Model(Zustand)│ │
│  │ (pages/ │  │ (hooks)    │  │ (api/ws)  │  │ (store)       │ │
│  │  comps) │  │            │  │           │  │               │ │
│  └─────────┘  └────────────┘  └─────┬─────┘  └───────────────┘ │
│                                     │ REST + Realtime subscribe  │
└─────────────────────────────────────┼───────────────────────────┘
                                      │
┌─────────────────────────────────────▼───────────────────────────┐
│                     Supabase Cloud                                │
│                                                                   │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │  PostgreSQL     │  │  Realtime Engine │  │  Edge Functions │ │
│  │                │  │                  │  │                 │ │
│  │  · missions    │  │  · table changes │  │  · chain-sync   │ │
│  │  · rooms       │  │  · broadcast     │  │  · attribution  │ │
│  │  · teams       │  │    channels      │  │  · settlement   │ │
│  │  · matches     │  │                  │  │  · node-scanner │ │
│  │  · scores      │  └──────────────────┘  └────────┬────────┘ │
│  │  · settlements │                                  │          │
│  │  · audit_logs  │                                  │          │
│  └────────────────┘                                  │          │
│                                                      │          │
└──────────────────────────────────────────────────────┼──────────┘
                                                       │ Sui RPC
┌──────────────────────────────────────────────────────▼──────────┐
│                       Sui Blockchain                              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  EVE Frontier Contracts (world::fuel)                     │   │
│  │  · deposit_fuel() → FuelEvent(DEPOSITED)                  │   │
│  │  · NetworkNode SharedObject (fuel_quantity, capacity)      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Fuel Frog Panic Contracts (自研)                         │   │
│  │  · create_match() / start_match() / end_match()          │   │
│  │  · register_whitelist(match_id, addresses[])              │   │
│  │  · deposit_entry_fee(match_id, amount)                    │   │
│  │  · settle_and_payout(match_id, payout_plan)               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 前端分层架构（强制）

### 3.1 四层单向依赖

```
View  ──→  Controller  ──→  Service  ──→  Model
(渲染)     (编排)          (副作用)      (状态)
```

**硬规则**：
- View 只能 import Controller
- Controller 只能 import Service
- Service 只能 import Model
- Model 不依赖任何上层
- 禁止跨层调用、禁止循环依赖

### 3.2 各层职责

| 层 | 职责 | 典型文件 | 允许做 | 禁止做 |
|---|---|---|---|---|
| **View** | 渲染 UI、捕获用户交互 | `view/screens/*.tsx`, `view/components/*.tsx` | 读 Controller 暴露的 hooks、调用 Controller handler | 直接调用 API、直接读写 Zustand、包含业务逻辑 |
| **Controller** | 编排用例、校验输入、映射错误 | `controller/use*.ts` | 调用 Service 方法、组合多个 Service 调用 | 直接操作 Model、直接发起网络请求 |
| **Service** | 封装所有副作用（REST/WS/链上查询）、执行业务策略 | `service/*Service.ts`, `service/*Gateway.ts` | 调用后端 API、订阅 WS、读写 Zustand Store | 直接渲染 UI、被 View 直接调用 |
| **Model** | Zustand Store，单一前端状态源 | `model/*Store.ts` | 定义 state/actions/selectors | 依赖 View/Controller/Service |

### 3.3 目录结构

```
src/
├── app/                          # Next.js App Router 路由
│   ├── page.tsx                  # 首页 → 钱包连接引导
│   ├── lobby/page.tsx            # 组队大厅
│   ├── match/page.tsx            # 比赛进行（浮窗）
│   ├── settlement/page.tsx       # 结算战报
│   └── layout.tsx                # 全局 Layout + Provider
│
├── view/
│   ├── screens/                  # 页面级组件
│   │   ├── HeatmapScreen.tsx     # 星系热力图 + 比赛大厅
│   │   ├── LobbyScreen.tsx       # 组队大厅
│   │   ├── MatchScreen.tsx       # 比赛浮窗
│   │   └── SettlementScreen.tsx  # 结算战报
│   └── components/               # 可复用组件
│       ├── NodeMap.tsx           # 星系地图（Canvas/SVG）
│       ├── MatchCard.tsx         # 比赛卡片
│       ├── TeamSlotPanel.tsx     # 组队角色槽
│       ├── ScoreBoard.tsx        # 实时得分板
│       ├── EventFeed.tsx         # 弹幕区
│       ├── CountdownBar.tsx      # 倒计时
│       ├── PanicOverlay.tsx      # Panic 模式视觉覆盖
│       ├── SettlementBill.tsx    # 分账表
│       └── WalletStatus.tsx      # 钱包状态栏
│
├── controller/
│   ├── useMissionController.ts   # 任务发现用例
│   ├── useLobbyController.ts     # 组队流程用例
│   ├── useMatchController.ts     # 比赛进行用例
│   └── useSettlementController.ts # 结算用例
│
├── service/
│   ├── missionService.ts         # 任务查询 + 排序
│   ├── lobbyService.ts           # 房间/战队/角色 CRUD
│   ├── matchService.ts           # 比赛状态 + WS 订阅
│   ├── scoringService.ts         # 得分投影 + 弹幕
│   ├── settlementService.ts      # 结算请求 + 账单加载
│   ├── walletService.ts          # 钱包连接 + 签名
│   └── supabaseClient.ts         # Supabase 客户端实例
│
├── model/
│   ├── authStore.ts              # 钱包连接状态
│   ├── missionStore.ts           # 任务列表
│   ├── lobbyStore.ts             # 房间 + 战队 + 角色
│   ├── matchStore.ts             # 比赛状态机 + 倒计时
│   ├── scoreStore.ts             # 实时得分 + 弹幕 feed
│   └── settlementStore.ts        # 结算账单
│
└── types/
    ├── mission.ts                # 任务相关类型
    ├── lobby.ts                  # 房间/战队/角色类型
    ├── match.ts                  # 比赛状态机类型
    ├── score.ts                  # 计分相关类型
    ├── settlement.ts             # 结算相关类型
    └── common.ts                 # 通用类型（ControllerResult 等）
```

### 3.4 典型请求流（以"队长支付入场费"为例）

```
View: PayButton.onClick()
  → Controller: useLobbyController().onPayEntry({ matchId, teamId })
    → 校验：钱包已连接？余额足够？队伍已锁定？
    → Service: lobbyService.payEntry({ matchId, teamId, walletAddress })
      → 调用钱包签名 LUX 转账 tx
      → 调用 Supabase Edge Function 注册白名单
      → 写入 Model: lobbyStore.setTeamStatus(teamId, 'paid')
    → 返回 ControllerResult<PayEntryResult>
  → View: 显示支付成功 / 错误提示
```

---

## 4. 后端架构（Supabase）

### 4.1 数据库表设计

```sql
-- 任务（由 node-scanner 自动生成）
missions
  id            UUID PK
  assembly_id   TEXT NOT NULL          -- Sui NetworkNode ObjectID
  node_name     TEXT
  fill_ratio    DECIMAL(5,4)           -- 0.0000 ~ 1.0000
  urgency       TEXT CHECK (urgency IN ('critical','warning','safe'))
  prize_pool    BIGINT DEFAULT 0       -- 总奖池（lamports）
  entry_fee     BIGINT NOT NULL        -- 每人入场费
  min_teams     INT NOT NULL DEFAULT 1 -- 开赛至少需要的战队数（与 PRD 开赛规则一致）
  max_teams     INT NOT NULL         -- 每局可配置战队上限（如 4/10/16+），非固定 4；可另设平台 global cap
  min_players   INT DEFAULT 3
  status        TEXT DEFAULT 'open'    -- open / in_progress / settled / expired
  created_at    TIMESTAMPTZ DEFAULT now()

-- 房间（一场比赛 = 一个房间）
matches
  id            UUID PK
  mission_id    UUID FK → missions.id
  status        TEXT DEFAULT 'lobby'   -- lobby / pre_start / running / panic / settling / settled
  start_at      TIMESTAMPTZ            -- 比赛开始时间
  end_at        TIMESTAMPTZ            -- 比赛结束时间
  panic_at      TIMESTAMPTZ            -- 进入 Panic 的时间
  start_tx      TEXT                   -- start_match() tx digest
  end_tx        TEXT                   -- end_match() tx digest
  created_at    TIMESTAMPTZ DEFAULT now()

-- 战队
teams
  id            UUID PK
  match_id      UUID FK → matches.id
  captain_wallet TEXT NOT NULL
  team_name     TEXT
  max_size      INT DEFAULT 8
  status        TEXT DEFAULT 'forming' -- forming / locked / paid / ready
  total_score   BIGINT DEFAULT 0
  rank          INT                    -- 结算后写入
  prize_amount  BIGINT                 -- 结算后写入
  created_at    TIMESTAMPTZ DEFAULT now()

-- 队员
team_members
  id            UUID PK
  team_id       UUID FK → teams.id
  wallet_address TEXT NOT NULL
  role          TEXT CHECK (role IN ('collector','hauler','escort'))
  personal_score BIGINT DEFAULT 0
  prize_amount   BIGINT                -- 结算后写入
  joined_at     TIMESTAMPTZ DEFAULT now()
  UNIQUE(team_id, wallet_address)

-- 白名单（队长付费后写入，归因三重过滤 Filter 1 数据源）
match_whitelist
  match_id      UUID FK → matches.id
  wallet_address TEXT NOT NULL
  registered_at TIMESTAMPTZ DEFAULT now()
  PRIMARY KEY (match_id, wallet_address)

-- 比赛目标站点（归因三重过滤 Filter 2 数据源）
match_targets
  match_id      UUID FK → matches.id
  assembly_id   TEXT NOT NULL
  PRIMARY KEY (match_id, assembly_id)

-- 归因计分事件（通过三重过滤后持久化）
score_events
  id            UUID PK
  match_id      UUID FK → matches.id
  team_id       UUID FK → teams.id
  member_wallet TEXT NOT NULL
  tx_digest     TEXT NOT NULL
  assembly_id   TEXT NOT NULL
  old_quantity  BIGINT
  new_quantity  BIGINT
  fuel_delta    BIGINT                 -- new - old
  fill_ratio_at DECIMAL(5,4)           -- 注入时刻的 fill_ratio
  urgency_weight DECIMAL(3,1)          -- 3.0 / 1.5 / 1.0
  panic_multiplier DECIMAL(3,1)        -- 1.0 / 1.5
  score         BIGINT                 -- 最终得分
  chain_ts      TIMESTAMPTZ            -- 链上时间戳
  created_at    TIMESTAMPTZ DEFAULT now()
  UNIQUE(match_id, tx_digest)

-- 结算记录
settlements
  id            UUID PK
  match_id      UUID FK → matches.id  UNIQUE
  gross_pool    BIGINT
  platform_fee  BIGINT DEFAULT 0
  payout_pool   BIGINT
  result_hash   TEXT                   -- 结算数据的确定性哈希
  commitment_tx TEXT                   -- 链上 commitment tx digest
  settlement_tx TEXT                   -- 链上 settlement tx digest
  status        TEXT DEFAULT 'pending' -- pending / committed / settled / failed
  created_at    TIMESTAMPTZ DEFAULT now()

-- 审计日志
audit_logs
  id            UUID PK
  match_id      UUID
  event_type    TEXT                   -- filter_rejected / settlement_triggered / ...
  detail        JSONB
  created_at    TIMESTAMPTZ DEFAULT now()
```

### 4.2 Supabase Realtime 通道设计

前端通过 Supabase Realtime 订阅以下数据变更，无需自建 WebSocket：

| 订阅方式 | 目标 | 前端用途 |
|---|---|---|
| **Table Changes** on `matches` | 比赛状态变更 | 状态机切换（lobby → running → settled） |
| **Table Changes** on `teams` | 战队状态/得分变更 | 得分板更新、队伍锁定状态 |
| **Table Changes** on `team_members` | 成员入队/得分变更 | 角色槽位实时同步 |
| **Table Changes** on `score_events` INSERT | 新计分事件 | 弹幕 feed + 得分跳动 |
| **Broadcast** channel `match:{matchId}` | 自定义消息 | Panic 模式切换、倒计时同步、结算进度 |

### 4.3 Edge Functions（后端逻辑）

| 函数名 | 触发方式 | 职责 |
|---|---|---|
| `node-scanner` | Cron (每 5 秒) | 轮询 Sui RPC 获取 NetworkNode 状态，更新 missions 表，自动创建紧急比赛 |
| `chain-sync` | Cron (每 2 秒) | 订阅 FuelEvent(DEPOSITED)，执行三重过滤归因，写入 score_events |
| `match-tick` | Cron (每 1 秒) | 检查所有 running 状态比赛，处理倒计时、Panic 切换、到时结束 |
| `pay-entry` | HTTP (前端调用) | 验证钱包签名和付款 tx，写入白名单，更新 teams 状态 |
| `trigger-settlement` | 内部调用 (match-tick) | 比赛结束后执行：汇总得分 → 计算排名 → 计算分账 → 提交链上结算 |
| `get-settlement-bill` | HTTP (前端调用) | 查询完整分账明细返回给前端 |

---

## 5. 合约架构（Sui Move）

### 5.1 链上职责边界

**必须上链**（PRD 第 11 章定义）：

| 数据 | 链上形式 | 原因 |
|---|---|---|
| 玩家送油动作 | `deposit_fuel()` → `FuelEvent(DEPOSITED)` | 唯一计分数据源，不可伪造 |
| 站点燃料状态 | `NetworkNode` SharedObject | EVE 原生链上数据 |
| 入场费支付 | LUX 转账 tx | 涉及资产 |
| 参赛白名单 | Match Object 内的地址列表 | 归因信任根 |
| 比赛开始/结束 | `start_match()` / `end_match()` tx | 锁定计分时间窗口 |
| 奖励发放 | LUX 转账 | 涉及资产出账 |

**链下存储**（见上方 §4.1 数据库表）：

比赛房间元信息、战队组成、角色分配、实时得分累加、弹幕消息、fill_ratio 缓存、Optimistic UI 状态。

### 5.2 自研合约模块接口

```
module fuel_frog_panic::match {
  // 创建比赛，锁定目标站点和费率
  public entry fun create_match(
    mission_assembly_ids: vector<address>,
    entry_fee_per_person: u64,
    platform_subsidy: u64,
    ctx: &mut TxContext
  )

  // 白名单注册（队长付费后由后端调用）
  public entry fun register_whitelist(
    match_obj: &mut Match,
    addresses: vector<address>,
    ctx: &mut TxContext
  )

  // 开赛锚定（后端在倒计时归零后调用）
  public entry fun start_match(
    match_obj: &mut Match,
    ctx: &mut TxContext
  )

  // 结束比赛 + 发放奖励（后端结算后调用）
  public entry fun end_match_and_settle(
    match_obj: &mut Match,
    result_hash: vector<u8>,
    payout_addresses: vector<address>,
    payout_amounts: vector<u64>,
    ctx: &mut TxContext
  )
}
```

### 5.3 数据流总览

```
EVE Frontier (Sui)
│
├─ NetworkNode.fuel_quantity         ──读取──▶  Edge: node-scanner → missions 表
├─ FuelEvent(DEPOSITED)              ──监听──▶  Edge: chain-sync → 三重过滤 → score_events 表
├─ deposit_fuel() tx.sender          ──查询──▶  Edge: chain-sync → 白名单比对
│
├─ create_match()                    ◀──写入──  Edge: node-scanner（自动创建紧急比赛）
├─ register_whitelist()              ◀──写入──  Edge: pay-entry（队长付费时）
├─ start_match()                     ◀──写入──  Edge: match-tick（倒计时归零时）
├─ end_match_and_settle()            ◀──写入──  Edge: trigger-settlement（比赛结束时）
│
Supabase (Off-chain)
├─ missions, matches, teams          ←→ 前端 REST + Realtime
├─ score_events                      → 前端 Realtime（弹幕 + 得分）
├─ settlements                       → 前端 REST（结算账单）
└─ audit_logs                        → 内部审计
```

---

## 6. 比赛状态机

PRD 4.3.6 定义的状态机，后端 `match-tick` 函数负责驱动：

```
┌──────────┐
│  Lobby   │  等待战队报名
└────┬─────┘
     │ 满员 or 最低人数倒计时归零
     ▼
┌──────────┐
│ PreStart │  30 秒准备倒计时
└────┬─────┘
     │ 倒计时归零 → 调用 start_match()
     ▼
┌──────────┐
│ Running  │  10 分钟竞技（前 8.5 分钟 Normal Mode）
└────┬─────┘
     │ 剩余 ≤ 90 秒
     ▼
┌──────────┐
│  Panic   │  最后 90 秒（得分 ×1.5）
└────┬─────┘
     │ 倒计时归零 → 调用 end_match_and_settle()
     ▼
┌──────────┐
│ Settling │  链上结算处理中（10–30 秒）
└────┬─────┘
     │ 链上 tx 确认
     ▼
┌──────────┐
│ Settled  │  结算完成，可查看战报
└──────────┘
```

非法状态迁移返回错误并写入 `audit_logs`。

---

## 7. 归因计分管道（核心链路）

PRD 第 7 章三重过滤，在 `chain-sync` Edge Function 中执行：

```
FuelEvent(DEPOSITED) 到达
  │
  ├─ Filter 1: sender ∈ match_whitelist?
  │   └─ 否 → 丢弃 + 记录 audit_log(filter_rejected, reason=not_whitelisted)
  │
  ├─ Filter 2: assembly_id ∈ match_targets?
  │   └─ 否 → 丢弃 + 记录 audit_log(filter_rejected, reason=wrong_target)
  │
  ├─ Filter 3: chain_timestamp ∈ [match.start_at, match.end_at]?
  │   └─ 否 → 丢弃 + 记录 audit_log(filter_rejected, reason=out_of_window)
  │
  ▼ 全部通过
  计算得分:
    fuel_delta = new_quantity - old_quantity
    fill_ratio_at = old_quantity / max_capacity  (注入时刻)
    urgency_weight = fill_ratio_at < 0.20 ? 3.0 : fill_ratio_at < 0.50 ? 1.5 : 1.0
    panic_multiplier = match.status == 'panic' ? 1.5 : 1.0
    score = fuel_delta × urgency_weight × panic_multiplier
  │
  ▼
  写入 score_events 表（UNIQUE on match_id + tx_digest 防重）
  更新 team_members.personal_score += score
  更新 teams.total_score += score
  │
  ▼
  Supabase Realtime 自动广播变更 → 前端收到更新
```

---

## 8. 结算流程

PRD 4.4 定义的二层分配机制：

```
match-tick 检测到比赛时间归零
  │
  ▼
matches.status → 'settling'
  │
  ▼
trigger-settlement Edge Function 执行:
  │
  ├─ 1. 汇总: 查询所有 teams (按 total_score DESC 排名)
  │
  ├─ 2. 第一层分配 (队伍级):
  │     按参赛队数决定比例 → PRD 4.4.3
  │     1队: 100%(达标) | 2队: 70/30 | 3+队: 60/30/10
  │
  ├─ 3. 第二层分配 (个人级):
  │     team_prize × (member_score / team_total_score) → PRD 4.4.4
  │
  ├─ 4. 写入 settlements 表
  │
  ├─ 5. 调用 end_match_and_settle() 链上发放 LUX
  │
  ├─ 6. 确认 tx 成功 → settlements.status = 'settled'
  │     matches.status → 'settled'
  │
  └─ 失败 → settlements.status = 'failed' + audit_log
```

### 8.1 幂等保障

- `settlements` 表 `match_id` UNIQUE 约束，同一场比赛只能结算一次
- `score_events` 表 `(match_id, tx_digest)` UNIQUE，同一笔链上交易不会重复计分

---

## 9. 安全与防作弊

| 威胁 | 对策 | 架构实现点 |
|---|---|---|
| 非参赛者链上送油被计分 | Filter 1 白名单校验 | chain-sync → match_whitelist |
| 给非目标站送油刷分 | Filter 2 站点校验 | chain-sync → match_targets |
| 比赛时间窗口外提交 | Filter 3 时间窗口 | chain-sync → matches.start_at/end_at |
| 少量多次维持红色刷高分 | 权重以注入时刻 fill_ratio 计算 | score_events.fill_ratio_at |
| 重复提交同一 tx | tx_digest UNIQUE 约束 | score_events UNIQUE(match_id, tx_digest) |
| 重复触发结算 | match_id UNIQUE + 状态检查 | settlements UNIQUE(match_id) |
| 身份伪造 | 钱包签名验证 | pay-entry Edge Function |

---

## 10. 性能指标（NFRs）

| 指标 | 目标 | 实现策略 |
|---|---|---|
| 弹幕延迟（链上事件 → 前端展示）| < 3s | chain-sync 2s 轮询 + Realtime 即时推送 |
| 得分更新延迟 | < 3s | score_events INSERT → Realtime 自动广播 |
| 站点油量刷新 | 5s | node-scanner Cron 周期 |
| 同时进行比赛数 | ≥ 20 | Supabase 连接池 + Edge Function 并发 |
| Optimistic UI 回退 | < 5s | 前端超时检测 + 状态回滚 |
