# SPEC: Fuel Frog Panic — 接口契约与实现规格

Version: v4.0
Last Updated: 2026-03-21
Source PRD: `docs/PRD.md` v2.0
Source Architecture: `docs/architecture.md` v4.0

---

## 0. 实现目标

将 PRD 中的 **10 分钟限时对局闭环**（任务发现 → 组队 → 比赛 → 结算）落地为：
1. 前端 `View → Controller → Service → Model` 四层精确接口
2. 后端 Supabase（PostgreSQL + Realtime + Edge Functions）完整 API 契约
3. Sui 合约交互接口
4. 共享 DTO / 错误码 / 状态机定义

---

## 1. 共享类型定义（`types/`）

### 1.1 通用类型 (`types/common.ts`)

```typescript
type ControllerResult<T> = {
  ok: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
  };
};

type ErrorCode =
  | 'WALLET_NOT_CONNECTED'
  | 'INSUFFICIENT_BALANCE'
  | 'INVALID_INPUT'
  | 'ROOM_NOT_JOINABLE'
  | 'ROLE_ALREADY_TAKEN'
  | 'TEAM_NOT_LOCKED'
  | 'TEAM_ALREADY_PAID'
  | 'MATCH_NOT_STARTABLE'
  | 'MATCH_ALREADY_ENDED'
  | 'SETTLEMENT_IN_PROGRESS'
  | 'SETTLEMENT_FAILED'
  | 'CHAIN_SYNC_ERROR'
  | 'TX_REJECTED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

type UrgencyLevel = 'critical' | 'warning' | 'safe';
type MatchStatus = 'lobby' | 'pre_start' | 'running' | 'panic' | 'settling' | 'settled';
type TeamStatus = 'forming' | 'locked' | 'paid' | 'ready';
type PlayerRole = 'collector' | 'hauler' | 'escort';
```

### 1.2 任务类型 (`types/mission.ts`)

```typescript
type Mission = {
  id: string;
  assemblyId: string;
  nodeName: string;
  fillRatio: number;          // 0.0 ~ 1.0
  urgency: UrgencyLevel;
  prizePool: number;          // LUX
  entryFee: number;           // LUX per person
  minTeams: number;           // 开赛至少需要的战队数（通常 ≥1）
  maxTeams: number;           // 本局战队上限：每局可配置（如 4/10/16+），非 PRD 写死 4
  minPlayers: number;
  status: 'open' | 'in_progress' | 'settled' | 'expired';
  createdAt: string;
};

type MissionSortBy = 'urgency' | 'prize_pool' | 'created_at';

type MissionFilters = {
  sortBy?: MissionSortBy;
  urgency?: UrgencyLevel;
  status?: Mission['status'];
  limit?: number;
};
```

### 1.3 大厅类型 (`types/lobby.ts`)

```typescript
type Match = {
  id: string;
  missionId: string;
  status: MatchStatus;
  startAt: string | null;
  endAt: string | null;
  panicAt: string | null;
  startTx: string | null;
  endTx: string | null;
  createdAt: string;
};

type Team = {
  id: string;
  matchId: string;
  captainWallet: string;
  teamName: string;
  maxSize: number;
  status: TeamStatus;
  totalScore: number;
  rank: number | null;
  prizeAmount: number | null;
  createdAt: string;
};

type TeamMember = {
  id: string;
  teamId: string;
  walletAddress: string;
  role: PlayerRole;
  personalScore: number;
  prizeAmount: number | null;
  joinedAt: string;
};

type CreateTeamInput = {
  matchId: string;
  teamName: string;
  maxSize: number;               // 3 ~ 8
  roleSlots: PlayerRole[];       // 预设角色配置
};

type JoinTeamInput = {
  teamId: string;
  walletAddress: string;
  role: PlayerRole;
};

type LockTeamInput = {
  teamId: string;
  captainWallet: string;         // 校验队长身份
};

type PayEntryInput = {
  matchId: string;
  teamId: string;
  captainWallet: string;
  txDigest: string;              // 队长付款的链上 tx digest
  memberAddresses: string[];     // 全队钱包地址（写入白名单）
};
```

### 1.4 计分类型 (`types/score.ts`)

```typescript
type ScoreEvent = {
  id: string;
  matchId: string;
  teamId: string;
  memberWallet: string;
  txDigest: string;
  assemblyId: string;
  oldQuantity: number;
  newQuantity: number;
  fuelDelta: number;
  fillRatioAt: number;           // 注入时刻的 fill_ratio
  urgencyWeight: number;         // 3.0 / 1.5 / 1.0
  panicMultiplier: number;       // 1.0 / 1.5
  score: number;                 // 最终得分
  chainTs: string;
  createdAt: string;
};

type ScoreBoard = {
  matchId: string;
  teams: TeamScore[];
  lastUpdated: string;
};

type TeamScore = {
  teamId: string;
  teamName: string;
  totalScore: number;
  members: MemberScore[];
};

type MemberScore = {
  walletAddress: string;
  role: PlayerRole;
  personalScore: number;
  contributionRatio: number;     // 个人得分 / 队伍总分
};
```

### 1.5 结算类型 (`types/settlement.ts`)

```typescript
type SettlementBill = {
  matchId: string;
  grossPool: number;
  platformFee: number;
  payoutPool: number;
  resultHash: string;
  commitmentTx: string | null;
  settlementTx: string | null;
  status: 'pending' | 'committed' | 'settled' | 'failed';
  teamBreakdown: TeamPayout[];
  mvp: MvpInfo | null;
};

type TeamPayout = {
  teamId: string;
  teamName: string;
  rank: number;
  totalScore: number;
  prizeRatio: number;            // e.g. 0.70
  prizeAmount: number;
  members: MemberPayout[];
};

type MemberPayout = {
  walletAddress: string;
  role: PlayerRole;
  personalScore: number;
  contributionRatio: number;
  prizeAmount: number;
};

type MvpInfo = {
  walletAddress: string;
  role: PlayerRole;
  totalScore: number;
  teamName: string;
};

// PRD 4.4.3 分配比例
const PAYOUT_RATIOS: Record<number, number[]> = {
  1: [1.0],                      // 单队挑战赛（达标时）
  2: [0.70, 0.30],
  3: [0.60, 0.30, 0.10],
};
// ≥4 队同样使用 3 队比例，仅前 3 名参与分配
```

### 1.6 防作弊与可观测性类型 (`types/antiCheat.ts`)

```typescript
type FilterRejectionReason =
  | 'NOT_IN_MATCH_WHITELIST'
  | 'TARGET_NODE_MISMATCH'
  | 'EVENT_OUTSIDE_MATCH_WINDOW'
  | 'DUPLICATE_EVENT_ID'
  | 'INVALID_PHASE'
  | 'INVALID_EVENT_PAYLOAD'
  | 'INVALID_FUEL_DELTA';

type SettlementFailureCode =
  | 'SETTLEMENT_RPC_TIMEOUT'
  | 'SETTLEMENT_TX_REJECTED'
  | 'SETTLEMENT_IDEMPOTENCY_CONFLICT'
  | 'SETTLEMENT_INVALID_STATE'
  | 'SETTLEMENT_UNKNOWN';

type AlertSeverity = 'info' | 'warning' | 'critical';

type ObservabilityMetrics = {
  eventLagMs: { latest: number; avg: number; p95: number; sampleCount: number };
  wsLatencyMs: { latest: number; avg: number; p95: number; sampleCount: number };
  settlementSuccess: { attempts: number; successes: number; rate: number };
};

type AuditLog = {
  id: string;
  action: string;
  detail: string;
  timestamp: number;
  eventType?: string;
  reasonCode?: FilterRejectionReason | SettlementFailureCode | 'INVALID_STATE_TRANSITION';
  severity?: AlertSeverity;
};
```

---

## 2. 前端四层接口契约

### 2.1 Model Layer（Zustand Stores）

#### `model/authStore.ts`

```typescript
type AuthState = {
  walletAddress: string | null;
  luxBalance: number;
  isConnected: boolean;
};

type AuthActions = {
  setWallet: (address: string, balance: number) => void;
  disconnect: () => void;
  updateBalance: (balance: number) => void;
};

// selectors
selectIsConnected: (state) => state.isConnected;
selectWalletShort: (state) => `${addr.slice(0,6)}...${addr.slice(-4)}`;
```

#### `model/missionStore.ts`

```typescript
type MissionState = {
  missions: Mission[];
  loading: boolean;
  selectedMissionId: string | null;
};

type MissionActions = {
  setMissions: (missions: Mission[]) => void;
  setLoading: (v: boolean) => void;
  selectMission: (id: string) => void;
};

// selectors
selectSortedMissions: (state) => Mission[];   // 按 urgency × prizePool 排序
selectSelectedMission: (state) => Mission | null;
```

#### `model/lobbyStore.ts`

```typescript
type LobbyState = {
  currentMatch: Match | null;
  teams: Team[];
  members: TeamMember[];         // 当前 match 下所有成员
  myTeamId: string | null;
};

type LobbyActions = {
  setMatch: (match: Match) => void;
  setTeams: (teams: Team[]) => void;
  setMembers: (members: TeamMember[]) => void;
  setMyTeam: (teamId: string) => void;
  updateTeamStatus: (teamId: string, status: TeamStatus) => void;
  addMember: (member: TeamMember) => void;
  reset: () => void;
};

// selectors
selectMyTeam: (state) => Team | null;
selectMyRole: (state) => PlayerRole | null;
selectTeamSlots: (teamId: string) => { role: PlayerRole; filled: boolean; member?: TeamMember }[];
selectIsTeamReady: (teamId: string) => boolean;
```

#### `model/matchStore.ts`

```typescript
type MatchState = {
  status: MatchStatus;
  remainingSec: number;
  isPanic: boolean;
};

type MatchActions = {
  setStatus: (status: MatchStatus) => void;
  setRemaining: (sec: number) => void;
  setPanic: (v: boolean) => void;
};
```

#### `model/scoreStore.ts`

```typescript
type ScoreState = {
  scoreBoard: ScoreBoard | null;
  eventFeed: ScoreEvent[];       // 最近 N 条弹幕
};

type ScoreActions = {
  setScoreBoard: (board: ScoreBoard) => void;
  appendEvent: (event: ScoreEvent) => void;
  clearFeed: () => void;
};

// selectors
selectTeamScores: (state) => TeamScore[];
selectMyScore: (state) => MemberScore | null;
selectRecentEvents: (state, limit: number) => ScoreEvent[];
```

#### `model/settlementStore.ts`

```typescript
type SettlementState = {
  bill: SettlementBill | null;
  loading: boolean;
};

type SettlementActions = {
  setBill: (bill: SettlementBill) => void;
  setLoading: (v: boolean) => void;
};

// selectors
selectMyPayout: (state) => MemberPayout | null;
selectMvp: (state) => MvpInfo | null;
```

---

### 2.2 Service Layer

#### `service/walletService.ts`

```typescript
connectWallet(): Promise<{ address: string; balance: number }>;
disconnectWallet(): Promise<void>;
signTransaction(txBytes: Uint8Array): Promise<{ signature: string; txDigest: string }>;
signAndExecuteEntryPayment(input: { recipient: string; amountBaseUnits: bigint; coinType: string }): Promise<{ txDigest: string }>;
getBalance(address: string): Promise<number>;
```

- 实现约束：
  - 前端必须通过 Sui Wallet Standard（`@mysten/dapp-kit-react`）接入钱包，不允许随机地址/随机签名 fallback。
  - `connectWallet` 必须执行一次 `signPersonalMessage` 身份挑战，并校验签名与连接地址一致。
  - 当前客户端支付实现基于 `tx.gas` 拆分，默认支持 `0x2::sui::SUI`；如需非 SUI 代币支付需补充 coin object 选择与合并逻辑。

#### `service/missionService.ts`

```typescript
fetchMissions(filters: MissionFilters): Promise<Mission[]>;
subscribeMissionUpdates(callback: (mission: Mission) => void): () => void;
```

#### `service/lobbyService.ts`

```typescript
fetchMatch(matchId: string): Promise<Match>;
fetchTeams(matchId: string): Promise<Team[]>;
fetchMembers(matchId: string): Promise<TeamMember[]>;

createTeam(input: CreateTeamInput): Promise<Team>;
joinTeam(input: JoinTeamInput): Promise<TeamMember>;
lockTeam(input: LockTeamInput): Promise<Team>;
payEntry(input: PayEntryInput): Promise<{ whitelistCount: number }>;

subscribeLobbyUpdates(matchId: string, callbacks: {
  onTeamChange: (team: Team) => void;
  onMemberChange: (member: TeamMember) => void;
  onMatchChange: (match: Match) => void;
}): () => void;
```

#### `service/matchService.ts`

```typescript
subscribeMatchStream(matchId: string, callbacks: {
  onStatusChange: (status: MatchStatus) => void;
  onScoreUpdate: (board: ScoreBoard) => void;
  onScoreEvent: (event: ScoreEvent) => void;
  onPanicMode: () => void;
  onSettlementStart: () => void;
}): () => void;

unsubscribeMatchStream(matchId: string): void;
```

#### `service/settlementService.ts`

```typescript
fetchSettlementBill(matchId: string): Promise<SettlementBill>;
```

---

### 2.3 Controller Layer（React Hooks）

#### `controller/useMissionController.ts`

```typescript
useMissionController(): {
  missions: Mission[];
  loading: boolean;
  selectedMission: Mission | null;
  loadMissions: (filters?: MissionFilters) => Promise<ControllerResult<void>>;
  selectMission: (missionId: string) => void;
};
```

#### `controller/useLobbyController.ts`

```typescript
useLobbyController(): {
  match: Match | null;
  teams: Team[];
  myTeam: Team | null;
  myRole: PlayerRole | null;
  teamSlots: (teamId: string) => TeamSlot[];
  isTeamReady: boolean;

  enterMatch: (matchId: string) => Promise<ControllerResult<void>>;
  createTeam: (input: CreateTeamInput) => Promise<ControllerResult<Team>>;
  joinTeam: (input: JoinTeamInput) => Promise<ControllerResult<TeamMember>>;
  lockTeam: () => Promise<ControllerResult<void>>;
  payEntry: () => Promise<ControllerResult<void>>;
  leaveLobby: () => void;
};
```

**payEntry 编排逻辑**：
1. 检查 `authStore.isConnected` → 否则 `WALLET_NOT_CONNECTED`
2. 检查 `authStore.luxBalance >= entryFee × memberCount` → 否则 `INSUFFICIENT_BALANCE`
3. 检查 `myTeam.status === 'locked'` → 否则 `TEAM_NOT_LOCKED`
4. 调用 `walletService.signAndExecuteEntryPayment()` 执行链上转账并获取真实 tx digest
5. 调用 `lobbyService.payEntry()` 提交 tx digest，后端注册白名单
6. 更新 `lobbyStore.updateTeamStatus(teamId, 'paid')`

#### `controller/useMatchController.ts`

```typescript
useMatchController(): {
  status: MatchStatus;
  remainingSec: number;
  isPanic: boolean;
  scoreBoard: ScoreBoard | null;
  eventFeed: ScoreEvent[];

  startWatching: (matchId: string) => void;
  stopWatching: () => void;
};
```

**startWatching 编排逻辑**：
1. 调用 `matchService.subscribeMatchStream(matchId, callbacks)`
2. 各 callback 将数据写入对应 Store:
   - `onStatusChange` → `matchStore.setStatus()`
   - `onScoreUpdate` → `scoreStore.setScoreBoard()`
   - `onScoreEvent` → `scoreStore.appendEvent()`
   - `onPanicMode` → `matchStore.setPanic(true)`
   - `onSettlementStart` → `matchStore.setStatus('settling')`

#### `controller/useSettlementController.ts`

```typescript
useSettlementController(): {
  bill: SettlementBill | null;
  loading: boolean;
  myPayout: MemberPayout | null;
  mvp: MvpInfo | null;

  loadBill: (matchId: string) => Promise<ControllerResult<void>>;
};
```

---

### 2.4 View Layer（组件接口）

View 只 import Controller hooks，通过 hooks 获取状态和操作方法：

| 组件 | 使用的 Controller | 关键交互 |
|---|---|---|
| `HeatmapScreen` | `useMissionController` | 加载/筛选任务、点击站点进入组队 |
| `NodeMap` | `useMissionController` | 渲染站点颜色 + 金色光圈 |
| `MatchCard` | `useMissionController` | 展示比赛卡片、点击进入 Lobby |
| `LobbyScreen` | `useLobbyController` | 创建/加入战队、选角色、锁定、支付 |
| `TeamSlotPanel` | `useLobbyController` | 渲染角色槽位三态 |
| `MatchScreen` | `useMatchController` | 倒计时、得分板、弹幕、Panic 视觉 |
| `ScoreBoard` | `useMatchController` | 双队得分进度条 |
| `EventFeed` | `useMatchController` | 弹幕滚动 |
| `PanicOverlay` | `useMatchController` | 橙红脉冲 + ×1.5 横幅 |
| `SettlementScreen` | `useSettlementController` | 战报 + 分账表 + MVP |
| `SettlementBill` | `useSettlementController` | 渲染二层分配明细 |
| `WalletStatus` | `useAuthStore` (仅读取) | 钱包地址 + 余额 + 断开 |

---

## 3. 后端接口契约（Supabase）

### 3.1 数据库读操作（Supabase Client 直读）

前端 Service 通过 Supabase JS Client 直接查询：

```typescript
// missionService.fetchMissions
supabase
  .from('missions')
  .select('*')
  .eq('status', 'open')
  .order('fill_ratio', { ascending: true })
  .limit(filters.limit ?? 20);

// lobbyService.fetchTeams
supabase
  .from('teams')
  .select('*, team_members(*)')
  .eq('match_id', matchId);
```

Row Level Security 策略：
- `missions`: 所有人可读
- `matches`, `teams`, `team_members`: 所有已连接钱包用户可读
- `score_events`: 同一 match 参与者可读
- `settlements`: 同一 match 参与者可读
- 写操作: 仅通过 Edge Functions（service_role）

### 3.2 Edge Function API

#### `POST /functions/v1/create-team`

```typescript
// Request
{ matchId: string; teamName: string; maxSize: number; roleSlots: PlayerRole[]; captainWallet: string }

// Response 200
{ team: Team }

// Errors
400: INVALID_INPUT (maxSize 不在 3-8 范围)
404: match 不存在或非 lobby 状态
409: 该钱包已在本场比赛中
```

#### `POST /functions/v1/join-team`

```typescript
// Request
{ teamId: string; walletAddress: string; role: PlayerRole }

// Response 200
{ member: TeamMember }

// Errors
400: INVALID_INPUT
404: team 不存在
409: ROLE_ALREADY_TAKEN / 队伍已满 / 该钱包已在队中
```

#### `POST /functions/v1/lock-team`

```typescript
// Request
{ teamId: string; captainWallet: string }

// Response 200
{ team: Team }

// Errors
403: 非队长操作
409: 角色槽未满 / 已锁定
```

#### `POST /functions/v1/pay-entry`

```typescript
// Request
{ matchId: string; teamId: string; captainWallet: string; txDigest: string; memberAddresses: string[] }

// Response 200
{ whitelistCount: number; teamStatus: 'paid' }

// 内部逻辑
1. 验证 txDigest 对应的链上 tx：sender 匹配、金额正确
2. 向 match_whitelist 批量插入 memberAddresses
3. 调用合约 register_whitelist(matchId, addresses)
4. 更新 teams.status = 'paid'

// Errors
400: tx 验证失败 / 金额不足
403: 非队长
409: TEAM_ALREADY_PAID
```

#### `GET /functions/v1/get-settlement-bill?matchId=xxx`

```typescript
// Response 200
{ bill: SettlementBill }

// Alias (兼容旧调用)
GET /functions/v1/settlement-bill?matchId=xxx

// Errors
404: match 不存在
409: 比赛尚未结算完成
```

### 3.3 Supabase Realtime 订阅契约

#### Lobby 实时同步

```typescript
// 订阅 teams 表变更
supabase
  .channel(`lobby:${matchId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'teams',
    filter: `match_id=eq.${matchId}`,
  }, (payload) => callbacks.onTeamChange(payload.new as Team))
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'team_members',
    filter: `team_id=in.(${teamIds.join(',')})`,
  }, (payload) => callbacks.onMemberChange(payload.new as TeamMember))
  .subscribe();
```

#### Match 实时计分流

```typescript
// 订阅比赛状态 + 计分事件
supabase
  .channel(`match:${matchId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'matches',
    filter: `id=eq.${matchId}`,
  }, (payload) => {
    const match = payload.new as Match;
    callbacks.onStatusChange(match.status);
  })
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'teams',
    filter: `match_id=eq.${matchId}`,
  }, (payload) => {
    // 重新构建 ScoreBoard
  })
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'score_events',
    filter: `match_id=eq.${matchId}`,
  }, (payload) => callbacks.onScoreEvent(payload.new as ScoreEvent))
  .on('broadcast', { event: 'panic_mode' }, () => callbacks.onPanicMode())
  .subscribe();
```

---

## 4. 合约交互契约

### 4.1 外部合约（EVE Frontier，只读）

```typescript
// 读取 NetworkNode 状态
sui.getObject(assemblyId): {
  fuel_quantity: number;
  fuel_max_capacity: number;
}

// 查询 FuelEvent(DEPOSITED)
sui.queryEvents({
  MoveEventType: 'world::fuel::FuelEvent',
  startTime, endTime
}): FuelEvent[]

// 通过 tx 获取 sender
sui.getTransactionBlock(txDigest): {
  sender: string;
  timestampMs: number;
}
```

### 4.2 自研合约（fuel_frog_panic::match）

| 函数 | 调用方 | 参数 | 链上效果 |
|---|---|---|---|
| `create_match` | node-scanner | assemblyIds, entryFee, subsidy | 创建 Match Object + FeePool |
| `register_whitelist` | pay-entry | matchObj, addresses | 向白名单追加地址 |
| `start_match` | match-tick | matchObj | 记录 start_timestamp |
| `end_match_and_settle` | trigger-settlement | matchObj, resultHash, payoutAddrs, payoutAmts | 执行 LUX 分发、冻结 Match |

---

## 5. 比赛状态机（精确定义）

```
lobby ──→ pre_start ──→ running ──→ panic ──→ settling ──→ settled
```

| 当前状态 | 触发条件 | 目标状态 | 副作用 |
|---|---|---|---|
| `lobby` | 满员 OR 最低人数倒计时归零 | `pre_start` | 开始 30s 准备倒计时 |
| `pre_start` | 30s 倒计时归零 | `running` | 调用 `start_match()` 上链 |
| `running` | 剩余 ≤ 90s | `panic` | 广播 panic_mode，得分 ×1.5 |
| `panic` | 0s 倒计时归零 | `settling` | 调用 `end_match_and_settle()` |
| `settling` | 链上 tx 确认 | `settled` | 更新 settlements.status |

非法迁移处理：返回错误码 `MATCH_NOT_STARTABLE` 或 `INVALID_INPUT`，写入 `audit_logs`。

---

## 6. 计分规则（PRD 第 5/7 章精确映射）

```
score = fuel_delta × urgency_weight × panic_multiplier
```

| 变量 | 来源 | 取值规则 |
|---|---|---|
| `fuel_delta` | `FuelEvent.new_quantity - old_quantity` | 正整数 |
| `urgency_weight` | 注入时刻 `fill_ratio_at` | < 0.20 → 3.0; < 0.50 → 1.5; ≥ 0.50 → 1.0 |
| `panic_multiplier` | `match.status` | `panic` → 1.5; 其他 → 1.0 |

最高单次系数：3.0 × 1.5 = **4.5x**

归因三重过滤（PRD 7.2）：
1. **白名单校验**：`sender ∈ match_whitelist` → 否则丢弃
2. **站点校验**：`assembly_id ∈ match_targets` → 否则丢弃
3. **时间窗口**：`chain_ts ∈ [match.start_at, match.end_at]` → 否则丢弃

Filter rejection 统一 reason code（写入 `audit_logs.reason_code`）：

| 过滤场景 | reason code |
|---|---|
| 钱包未入本局白名单 | `NOT_IN_MATCH_WHITELIST` |
| 事件站点不在本局目标列表 | `TARGET_NODE_MISMATCH` |
| 事件时间戳不在比赛窗口 | `EVENT_OUTSIDE_MATCH_WINDOW` |
| 同一 event/tx 重复进入 | `DUPLICATE_EVENT_ID` |
| 比赛状态非法（非 running/panic） | `INVALID_PHASE` |
| 事件载荷缺字段或数值非法 | `INVALID_EVENT_PAYLOAD` |
| 链上事件油量变化无效（`new <= old`） | `INVALID_FUEL_DELTA` |

可观测性指标输出（F-006）：

| 指标 | 口径 |
|---|---|
| `event_lag_ms` | `now - chain_timestamp_ms` |
| `ws_latency_ms` | `now - ws_published_at_ms` |
| `settlement_success_rate` | `successes / attempts`（失败重试也计入 attempts） |

---

## 7. 结算分配规则（PRD 4.4 精确映射）

### 7.1 第一层：队伍级分配

| 参赛队数 | 冠军 | 亚军 | 季军 | 第 4+ |
|---|---|---|---|---|
| 1 | 100%（达标时） | — | — | — |
| 2 | 70% | 30% | — | — |
| 3 | 60% | 30% | 10% | — |
| ≥ 4 | 60% | 30% | 10% | 0% |

单队挑战赛：10 分钟内 `fill_ratio` 提升至 ≥ 80% 为达标。

### 7.2 第二层：个人级分配

```
member_prize = team_prize × (member_score / team_total_score)
```

得分为 0 的成员，奖励为 0（杜绝挂机蹭分）。

### 7.3 退款规则

| 时间节点 | 政策 |
|---|---|
| 队长锁定前 | 可退全额（未付款无需退） |
| 锁定后 30 秒准备期内 | 不可退款 |
| 比赛进行中 | 不可退款 |
| 比赛结算后 | 奖励自动发放 |

### 7.4 结算失败分类与告警分级（F-006）

| failure code | 触发场景 | severity | 错误码映射 |
|---|---|---|---|
| `SETTLEMENT_RPC_TIMEOUT` | 结算调用链超时 | `critical` | `E_SETTLEMENT_RPC_TIMEOUT` |
| `SETTLEMENT_TX_REJECTED` | 链上 tx 被拒绝或回滚 | `critical` | `E_SETTLEMENT_TX_REJECTED` |
| `SETTLEMENT_IDEMPOTENCY_CONFLICT` | 结算幂等状态异常 | `warning` | `E_SETTLEMENT_IDEMPOTENCY_CONFLICT` |
| `SETTLEMENT_INVALID_STATE` | 非法状态触发结算 | `warning` | `E_SETTLEMENT_INVALID_STATE` |
| `SETTLEMENT_UNKNOWN` | 未知异常 | `critical` | `E_SETTLEMENT_UNKNOWN` |

约束：
- 每次失败都写一条 `audit_logs`，`event_type = settlement_failed`。
- 告警写入 `settlement_alerts`（或等价内存模型）并保留最近 N 条。
- `settlement_success_rate` 必须包含失败样本（不能只统计成功）。

---

## 8. 测试计划

### 8.1 前端单元测试

| 测试目标 | 覆盖范围 |
|---|---|
| Model: 状态机迁移 | 合法/非法 MatchStatus 迁移 |
| Model: selectors | sortedMissions, teamSlots, contributionRatio |
| Service: 计分投影 | urgencyWeight + panicMultiplier 组合 |
| Controller: payEntry 编排 | 余额不足、未锁定、重复支付等边界 |

### 8.2 集成测试

| 测试链路 | 验收信号 |
|---|---|
| Lobby → Lock → Pay → Match Start | match.status 从 lobby 到 running |
| ScoreEvent 写入 → Realtime → 前端弹幕 | < 3s 端到端延迟 |
| Match End → Settlement → Bill 查询 | bill.status = settled + 金额校验 |
| 异常演练：RPC 超时 / 重复结算 / 非法状态迁移 | 命中预期错误码并写入对应 audit reason code |

### 8.3 合约测试

- `sui move test` 本地单元测试
- devnet: `sui client call` 验证 create/start/settle 流程
- devnet: `sui client query-events` 验证 FuelEvent 可查

---

## 9. TODO Mapping

| TODO ID | Layer | Feature | Interface | Description | Status |
|---|---|---|---|---|---|
| T-001 | Backend | F-001 | node-scanner + missions 表 | 站点扫描与紧急比赛自动生成 | Todo |
| T-002 | Frontend | F-001 | useMissionController + HeatmapScreen | 任务发现 + 热力图交互 | Todo |
| T-003 | Backend | F-002 | create-team / join-team / lock-team / pay-entry | 组队全流程后端接口 | Todo |
| T-004 | Frontend | F-002 | useLobbyController + LobbyScreen | 组队全流程前端交互 | Todo |
| T-005 | Backend | F-003 | chain-sync Edge Function | FuelEvent 三重过滤归因管道 | Todo |
| T-006 | Backend | F-004 | match-tick + Realtime broadcast | 比赛状态机驱动 + 实时推送 | Todo |
| T-007 | Frontend | F-003/F-004 | useMatchController + MatchScreen | 比赛实时反馈（得分板 + 弹幕 + Panic） | Todo |
| T-008 | Backend + Sui | F-005 | trigger-settlement + 合约 | 结算计算 + 链上发放 | Todo |
| T-009 | Frontend | F-005 | useSettlementController + SettlementScreen | 结算战报展示 | Todo |
| T-010 | Sui | All | fuel_frog_panic::match | 自研合约模块开发与 devnet 部署 | Todo |
| T-011 | Frontend | F-000 | walletService + authStore | 钱包连接流程 | Todo |
| T-012 | Testing | All | 单元 + 集成 + 合约 | 全链路测试覆盖 | Todo |
