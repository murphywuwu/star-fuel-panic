# SPEC: Fuel Frog Panic — Interface Contracts

Version: v6.0
Last Updated: 2026-03-27
Source PRD: `docs/PRD.md` v2.6
Source Architecture: `docs/architecture.md` v6.0

---

## 0. Scope

本 SPEC 只覆盖 PRD v2.6 已批准范围内的实现契约：

- 比赛创建：自由模式、精准模式、星系选择、赞助费锁定、发布。
- 比赛发现：Lobby 列表、筛选、位置设置、距离提示、推荐节点。
- 组队：创建、加入、离开、锁队、报名付费。
- 比赛运行：状态机、实时流、计分、Panic Mode。
- 结算：平台抽成、队伍奖金、个人奖金、账单与结果查询。

兼容说明：

- 新的规范名称统一使用 `match`、`network-node`、`solar-system`。
- 旧实现中的 `mission`、`nodes` 命名可以保留为兼容层，但不再作为新增接口的规范命名。

---

## 1. PRD Acceptance Mapping

| PRD 章节 | 验收点 | SPEC 落点 |
|---|---|---|
| 4.1 创建 & 发布比赛 | 两种模式、星系选择、赞助费 >= 500、精准模式选点、创建与发布分离 | 第 2.4 节、第 3.1 节、第 4.2 节 `POST /api/matches` 和 `POST /api/matches/{id}/publish` |
| 4.2 创建战队 | 创建/加入/离开战队、角色槽、锁队 | 第 2.4 节、第 3.3 节、第 4.3 节 |
| 4.3 发现 & 参加比赛 | Lobby 列表、位置选择、距离、推荐节点、比赛详情 | 第 2.3 节、第 3.2 节、第 4.1 节和第 4.2 节读接口 |
| 4.4 启动比赛 | 状态机、得分板、流事件、三重过滤、Panic Mode | 第 2.5 节、第 3.4 节、第 4.2 节 `status/scoreboard/stream`、第 5.7 节 |
| 4.5 自动分账 | 5% 平台抽成、95% 玩家奖池、排名分配、个人贡献占比 | 第 2.5 节、第 3.5 节、第 4.4 节、第 5.8 节 |
| 8 链上 / 链下边界 | 上链事实、链下读模型 | 第 5 节运行时契约、第 6 节错误/幂等/观测契约 |

---

## 2. Shared Contract Types

### 2.1 Common Envelope

```ts
type ApiResult<T> =
  | {
      ok: true;
      data: T;
      requestId: string;
      stale?: boolean;
    }
  | {
      ok: false;
      error: ApiError;
      requestId: string;
      stale?: boolean;
    };

type ApiError = {
  code: ErrorCode;
  message: string;
  retryable: boolean;
  details?: Record<string, string | number | boolean>;
};

type ErrorCode =
  | 'INVALID_INPUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'SYSTEM_NOT_SELECTABLE'
  | 'SYSTEM_NOT_FOUND'
  | 'NODE_NOT_FOUND'
  | 'NODE_NOT_IN_SYSTEM'
  | 'TARGET_NODE_REQUIRED'
  | 'TARGET_NODE_LIMIT_EXCEEDED'
  | 'SPONSORSHIP_TOO_LOW'
  | 'ENTRY_FEE_OUT_OF_RANGE'
  | 'DURATION_OUT_OF_RANGE'
  | 'MATCH_NOT_PUBLISHABLE'
  | 'MATCH_NOT_JOINABLE'
  | 'MATCH_NOT_RUNNING'
  | 'MATCH_NOT_SETTLABLE'
  | 'TEAM_FULL'
  | 'TEAM_LOCKED'
  | 'TEAM_NOT_LOCKED'
  | 'ROLE_SLOT_FULL'
  | 'PAYMENT_MISMATCH'
  | 'PAYMENT_ALREADY_CONFIRMED'
  | 'CHAIN_SYNC_ERROR'
  | 'STREAM_UNAVAILABLE'
  | 'UNKNOWN';
```

### 2.2 Enums

```ts
type MatchMode = 'free' | 'precision';

type MatchStatus =
  | 'draft'
  | 'lobby'
  | 'prestart'
  | 'running'
  | 'panic'
  | 'settling'
  | 'settled'
  | 'cancelled';

type TeamStatus = 'forming' | 'locked' | 'paid' | 'ready';

type PlayerRole = 'collector' | 'hauler' | 'escort';

type TeamApplicationStatus = 'pending' | 'approved' | 'rejected';

type NodeUrgency = 'critical' | 'warning' | 'safe';

type SelectableState = 'selectable' | 'no_nodes' | 'offline_only' | 'not_public';

type SearchResultType = 'constellation' | 'system';

type MatchStreamEventType =
  | 'score_update'
  | 'phase_change'
  | 'panic_mode'
  | 'node_status'
  | 'settlement_start'
  | 'settlement_complete'
  | 'heartbeat';
```

### 2.3 Discovery DTOs

```ts
type ConstellationSummary = {
  constellationId: number;
  constellationName: string;
  regionId: number;
  systemCount: number;
  selectableSystemCount: number;
  urgentNodeCount: number;
  warningNodeCount: number;
  sortScore: number;
};

type RegionSummary = {
  regionId: number;
  constellationCount: number;
  selectableSystemCount: number;
  urgentNodeCount: number;
  warningNodeCount: number;
  sortScore: number;
};

type SolarSystemSummary = {
  systemId: number;
  systemName: string;
  constellationId: number;
  constellationName: string;
  regionId: number;
  nodeCount: number;
  urgentNodeCount: number;
  warningNodeCount: number;
  selectableState: SelectableState;
};

type SolarSystemDetail = SolarSystemSummary & {
  gateLinks: Array<{
    destinationSystemId: number;
    destinationSystemName: string;
  }>;
};

type SolarSystemRecommendation = {
  system: SolarSystemSummary;
  topUrgency: NodeUrgency;
  summary: string;
};

type SearchHit = {
  type: SearchResultType;
  id: number;
  label: string;
  regionId?: number;
  constellationId?: number;
  constellationName?: string;
  selectableState?: SelectableState;
};

type UserLocation = {
  systemId: number;
  systemName: string;
  constellationId: number;
  regionId: number;
  updatedAt: string;
};

type NetworkNode = {
  id: string;
  objectId: string;
  name: string;
  typeId: number;
  ownerAddress: string;
  ownerCapId: string | null;
  isPublic: boolean;
  coordX: number | null;
  coordY: number | null;
  coordZ: number | null;
  solarSystem: number;
  fuelQuantity: string;
  fuelMaxCapacity: string;
  fuelTypeId: number | null;
  fuelBurnRate: string | null;
  isBurning: boolean;
  fillRatio: number;
  urgency: NodeUrgency;
  maxEnergyProduction: string | null;
  currentEnergyProduction: string | null;
  isOnline: boolean;
  connectedAssemblyIds: string[];
  description: string | null;
  imageUrl: string | null;
  lastUpdatedOnChain: string;
  updatedAt: string;
  activeMatchId: string | null;
};

type NodeRecommendation = {
  node: NetworkNode;
  distanceHops: number;
  urgencyWeight: number;
  score: number;
  reason: string;
};
```

### 2.4 Match and Team DTOs

```ts
type MatchSummary = {
  id: string;
  name: string;
  mode: MatchMode;
  status: Exclude<MatchStatus, 'draft' | 'cancelled'>;
  solarSystemId: number;
  solarSystemName: string;
  constellationId: number;
  constellationName: string;
  targetNodeCount: number;
  sponsorshipFee: string;
  entryFee: string;
  grossPool: string;
  platformFeeRate: 0.05;
  minTeams: 2;
  maxTeams: number;
  registeredTeams: number;
  durationHours: number;
  distanceHops: number | null;
  startsAt: string | null;
  createdAt: string;
};

type TargetNodeSnapshot = {
  objectId: string;
  name: string;
  fillRatio: number;
  urgency: NodeUrgency;
  isOnline: boolean;
};

type MatchDetail = MatchSummary & {
  description?: string | null;
  targetNodes: TargetNodeSnapshot[];
  entryFeeRequired: boolean;
  publishTxDigest: string | null;
  countdownEndsAt: string | null;
  createdBy: string;
};

type RoleSlots = {
  collector: number;
  hauler: number;
  escort: number;
};

type TeamMember = {
  walletAddress: string;
  role: PlayerRole;
  joinedAt: string;
  personalScore: number;
  prizeAmount: string | null;
};

type TeamDetail = {
  id: string;
  matchId: string;
  name: string;
  captainAddress: string;
  status: TeamStatus;
  maxMembers: number;
  memberCount: number;
  roleSlots: RoleSlots;
  members: TeamMember[];
  paymentAmount: string;
  paymentTxDigest: string | null;
  createdAt: string;
};

type TeamJoinApplication = {
  applicationId: string;
  teamId: string;
  applicantAddress: string;
  role: PlayerRole;
  status: TeamApplicationStatus;
  reason?: string;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
};

type CreateMatchRequest = {
  name?: string;
  mode: MatchMode;
  solarSystemId: number;
  targetNodeIds?: string[];
  sponsorshipFee: number;
  maxTeams: number;
  entryFee: number;
  durationHours: number;
};

type PublishMatchRequest = {
  publishTxDigest: string;
};

type CreateTeamRequest = {
  matchId: string;
  name: string;
  maxMembers: number;
  roleSlots: RoleSlots;
};

type JoinTeamRequest = {
  role: PlayerRole;
};

type JoinTeamResponse = {
  applicationId: string;
  status: TeamApplicationStatus;
};

type PayTeamRequest = {
  matchId: string;
  payTxDigest: string;
};
```

### 2.5 Runtime and Settlement DTOs

```ts
type MatchStatusSnapshot = {
  matchId: string;
  status: Exclude<MatchStatus, 'draft' | 'cancelled'>;
  remainingSeconds: number;
  publicCountdownSeconds: number | null;
  registeredTeams: number;
  maxTeams: number;
  panicStartsAt: string | null;
  startedAt: string | null;
  endsAt: string | null;
  serverTime: string;
};

type ScoreboardSnapshot = {
  matchId: string;
  status: MatchStatusSnapshot['status'];
  remainingSeconds: number;
  panicMode: boolean;
  teams: Array<{
    teamId: string;
    teamName: string;
    score: number;
    rank: number;
  }>;
  targetNodes: Array<{
    objectId: string;
    name: string;
    fillRatio: number;
    urgency: NodeUrgency;
    isOnline: boolean;
  }>;
  updatedAt: string;
};

type MvpInfo = {
  walletAddress: string;
  teamId: string;
  score: number;
  role: PlayerRole;
};

type SettlementBill = {
  matchId: string;
  sponsorshipFee: string;
  entryFeeTotal: string;
  platformSubsidy: string;
  grossPool: string;
  platformFeeRate: 0.05;
  platformFee: string;
  payoutPool: string;
  payoutTxDigest: string | null;
  teamBreakdown: Array<{
    teamId: string;
    teamName: string;
    rank: number;
    totalScore: number;
    prizeRatio: number;
    prizeAmount: string;
    members: Array<{
      walletAddress: string;
      role: PlayerRole;
      personalScore: number;
      contributionRatio: number;
      prizeAmount: string;
    }>;
  }>;
  mvp: MvpInfo | null;
};

type SettlementStatus = {
  matchId: string;
  status: 'pending' | 'running' | 'succeeded' | 'failed';
  progress: number;
  payoutTxDigest: string | null;
  updatedAt: string;
};

type MatchStreamEvent =
  | {
      type: 'score_update';
      matchId: string;
      scoreboard: ScoreboardSnapshot;
    }
  | {
      type: 'phase_change' | 'panic_mode';
      matchId: string;
      status: MatchStatusSnapshot;
    }
  | {
      type: 'node_status';
      matchId: string;
      targetNodes: ScoreboardSnapshot['targetNodes'];
    }
  | {
      type: 'settlement_start';
      matchId: string;
      progress: number;
    }
  | {
      type: 'settlement_complete';
      matchId: string;
      result: SettlementBill;
    }
  | {
      type: 'heartbeat';
      matchId: string;
      serverTime: string;
    };
```

### 2.6 Derived Rules

- `fillRatio = fuelQuantity / fuelMaxCapacity`
- `urgency = critical` when `fillRatio < 0.2`
- `urgency = warning` when `0.2 <= fillRatio < 0.5`
- `urgency = safe` when `fillRatio >= 0.5`
- `grossPool = sponsorshipFee + entryFeeTotal + platformSubsidy`
- `platformFee = floor(grossPool * 0.05)`
- `payoutPool = grossPool - platformFee`
- 队伍奖金比例：
  - 2 队：`[0.7, 0.3]`
  - 3 队或以上：`[0.6, 0.3, 0.1]`
- 个人奖金：`teamPrize * personalScore / teamTotalScore`，最后一名成员吸收舍入余数。
- 自由模式的 `eligibleNodeSet` 以目标星系内节点为准。
- 精准模式的 `eligibleNodeSet` 以发布时冻结的 `targetNodeIds` 为准。
- Panic Mode 固定为比赛结束前最后 90 秒，乘数为 `1.5x`。

---

## 3. Frontend Layer Contracts

### 3.1 Match Creation

Create Match can render either as a dedicated planning surface or as a modal launched from Lobby. The controller/store/service contract is shared between both surfaces.

View 事件：

- `onOpenCreateMatch()`
- `onCloseCreateMatch()`
- `onModeChange(mode)`
- `onOpenSystemPicker()`
- `onSystemSelect(systemId)`
- `onTargetNodeToggle(objectId)`
- `onFieldChange(key, value)`
- `onCreateDraft()`
- `onPublish(publishTxDigest)`

```ts
type CreateMatchDraft = {
  name: string;
  mode: MatchMode;
  solarSystemId: number | null;
  targetNodeIds: string[];
  sponsorshipFee: number;
  maxTeams: number;
  entryFee: number;
  durationHours: number;
};

interface CreateMatchController {
  draft: CreateMatchDraft;
  selectableSystems: SolarSystemSummary[];
  recommendedSystems: SolarSystemRecommendation[];
  selectedSystem: SolarSystemDetail | null;
  systemNodes: NetworkNode[];
  validation: Partial<Record<keyof CreateMatchDraft | 'form', string>>;
  isSubmitting: boolean;
  actions: {
    setMode(mode: MatchMode): void;
    searchSystems(query: string): Promise<void>;
    selectSystem(systemId: number): Promise<void>;
    toggleTargetNode(objectId: string): void;
    setField<K extends keyof CreateMatchDraft>(key: K, value: CreateMatchDraft[K]): void;
    createDraft(): Promise<{ matchId: string }>;
    publish(matchId: string, publishTxDigest: string): Promise<MatchDetail>;
    reset(): void;
  };
}

interface MatchService {
  listMatches(query: ListMatchesQuery): Promise<MatchSummary[]>;
  getMatch(matchId: string): Promise<MatchDetail>;
  createDraft(input: CreateMatchRequest): Promise<{ matchId: string }>;
  publishMatch(matchId: string, input: PublishMatchRequest): Promise<MatchDetail>;
}

interface CreateMatchStoreState {
  draft: CreateMatchDraft;
  selectedSystem: SolarSystemDetail | null;
  selectableSystems: SolarSystemSummary[];
  recommendedSystems: SolarSystemRecommendation[];
  systemNodes: NetworkNode[];
  validation: Partial<Record<string, string>>;
  isSubmitting: boolean;
  setDraft(patch: Partial<CreateMatchDraft>): void;
  setSelectedSystem(system: SolarSystemDetail | null): void;
  setSystemNodes(nodes: NetworkNode[]): void;
  setValidation(errors: Partial<Record<string, string>>): void;
  reset(): void;
}
```

Selectors:

- `selectCanCreateMatch`
- `selectRequiresTargetNodes`
- `selectPrizePreview`

### 3.2 Lobby Discovery and Location

View 事件：

- `onFilterChange(filters)`
- `onOpenMatch(matchId)`
- `onOpenCreateMatch()`
- `onOpenLocationPicker()`
- `onLocationSelect(systemId)`
- `onRequestRecommendations(matchId)`

```ts
type ListMatchesQuery = {
  status?: 'lobby' | 'prestart' | 'running' | 'settled';
  mode?: 'all' | MatchMode;
  limit?: number;
  offset?: number;
  currentSystemId?: number;
};

type LobbyFilters = {
  mode: 'all' | MatchMode;
  status: 'lobby' | 'prestart' | 'running' | 'settled';
  maxDistanceHops?: number;
};

interface LobbyController {
  filters: LobbyFilters;
  matches: MatchSummary[];
  selectedMatch: MatchDetail | null;
  location: UserLocation | null;
  recommendations: Record<string, NodeRecommendation[]>;
  isLoading: boolean;
  actions: {
    load(): Promise<void>;
    setFilters(filters: Partial<LobbyFilters>): Promise<void>;
    openMatch(matchId: string): Promise<void>;
    setLocation(system: SolarSystemSummary): void;
    loadRecommendations(matchId: string): Promise<void>;
  };
}

interface SolarSystemService {
  listConstellations(query: ListConstellationsQuery): Promise<ConstellationSummary[]>;
  getConstellation(constellationId: number): Promise<{
    constellation: ConstellationSummary;
    systems: SolarSystemSummary[];
  }>;
  search(query: SearchQuery): Promise<SearchHit[]>;
  listSystems(query: ListSolarSystemsQuery): Promise<SolarSystemSummary[]>;
  getSystem(systemId: number): Promise<SolarSystemDetail>;
  listRecommendedSystems(limit?: number): Promise<SolarSystemRecommendation[]>;
}

interface NodeRecommendationService {
  getRecommendations(input: GetNodeRecommendationsQuery): Promise<NodeRecommendation[]>;
}

interface LobbyStoreState {
  filters: LobbyFilters;
  matches: MatchSummary[];
  selectedMatch: MatchDetail | null;
  isLoading: boolean;
  setFilters(filters: Partial<LobbyFilters>): void;
  setMatches(matches: MatchSummary[]): void;
  setSelectedMatch(match: MatchDetail | null): void;
}

interface LocationStoreState {
  location: UserLocation | null;
  pickerResults: SolarSystemSummary[];
  setLocation(system: SolarSystemSummary): void;
  clearLocation(): void;
  setPickerResults(systems: SolarSystemSummary[]): void;
}
```

Selectors:

- `selectVisibleMatches`
- `selectDistanceLabel(matchId)`
- `selectHasLocation`

### 3.3 Team Lobby

View 事件：

- `onCreateTeam(payload)`
- `onJoinTeam(teamId, role)`
- `onApproveJoinApplication(teamId, applicationId)`
- `onRejectJoinApplication(teamId, applicationId, reason?)`
- `onLeaveTeam(teamId)`
- `onLockTeam(teamId)`
- `onPayTeam(teamId, payTxDigest)`

```ts
interface TeamLobbyController {
  match: MatchDetail | null;
  teams: TeamDetail[];
  currentWalletAddress: string | null;
  actions: {
    load(matchId: string): Promise<void>;
    createTeam(input: CreateTeamRequest): Promise<TeamDetail>;
    joinTeam(teamId: string, input: JoinTeamRequest): Promise<JoinTeamResponse>;
    approveJoinApplication(teamId: string, applicationId: string): Promise<TeamDetail>;
    rejectJoinApplication(teamId: string, applicationId: string, reason?: string): Promise<TeamDetail>;
    leaveTeam(teamId: string): Promise<TeamDetail>;
    lockTeam(teamId: string): Promise<TeamDetail>;
    payTeam(teamId: string, input: PayTeamRequest): Promise<TeamDetail>;
  };
}

interface TeamService {
  listTeams(matchId: string): Promise<TeamDetail[]>;
  createTeam(input: CreateTeamRequest): Promise<TeamDetail>;
  joinTeam(teamId: string, input: JoinTeamRequest): Promise<JoinTeamResponse>;
  approveJoinApplication(teamId: string, applicationId: string): Promise<TeamDetail>;
  rejectJoinApplication(teamId: string, applicationId: string, reason?: string): Promise<TeamDetail>;
  leaveTeam(teamId: string): Promise<TeamDetail>;
  lockTeam(teamId: string): Promise<TeamDetail>;
  payTeam(teamId: string, input: PayTeamRequest): Promise<TeamDetail>;
}

interface TeamLobbyStoreState {
  matchId: string | null;
  teams: TeamDetail[];
  isMutating: boolean;
  setMatchId(matchId: string | null): void;
  setTeams(teams: TeamDetail[]): void;
  upsertTeam(team: TeamDetail): void;
}
```

Selectors:

- `selectOpenTeams`
- `selectCurrentPlayerTeam`
- `selectPaymentAmount(teamId)`

### 3.4 Match Runtime and Overlay

View 事件：

- `onConnectStream(matchId)`
- `onReconnect()`
- `onRefreshStatus()`

```ts
interface MatchRuntimeController {
  status: MatchStatusSnapshot | null;
  scoreboard: ScoreboardSnapshot | null;
  streamHealth: 'connecting' | 'healthy' | 'stale' | 'disconnected';
  actions: {
    loadStatus(matchId: string): Promise<void>;
    loadScoreboard(matchId: string): Promise<void>;
    connect(matchId: string): Promise<() => void>;
  };
}

interface MatchStreamService {
  getStatus(matchId: string): Promise<MatchStatusSnapshot>;
  getScoreboard(matchId: string): Promise<ScoreboardSnapshot>;
  subscribe(matchId: string, onEvent: (event: MatchStreamEvent) => void): Promise<() => void>;
}

interface MatchRuntimeStoreState {
  status: MatchStatusSnapshot | null;
  scoreboard: ScoreboardSnapshot | null;
  streamHealth: 'connecting' | 'healthy' | 'stale' | 'disconnected';
  lastEventAt: string | null;
  setStatus(status: MatchStatusSnapshot): void;
  setScoreboard(scoreboard: ScoreboardSnapshot): void;
  applyStreamEvent(event: MatchStreamEvent): void;
  setStreamHealth(health: MatchRuntimeStoreState['streamHealth']): void;
}
```

Selectors:

- `selectPanicMode`
- `selectRemainingLabel`
- `selectLeadingTeam`

### 3.5 Settlement

View 事件：

- `onLoadResult(matchId)`
- `onRefreshSettlement(matchId)`

```ts
interface SettlementController {
  status: SettlementStatus | null;
  bill: SettlementBill | null;
  actions: {
    loadStatus(matchId: string): Promise<void>;
    loadBill(matchId: string): Promise<void>;
  };
}

interface SettlementService {
  getSettlementStatus(matchId: string): Promise<SettlementStatus>;
  getSettlementBill(matchId: string): Promise<SettlementBill>;
}

interface SettlementStoreState {
  status: SettlementStatus | null;
  bill: SettlementBill | null;
  setStatus(status: SettlementStatus): void;
  setBill(bill: SettlementBill): void;
  reset(): void;
}
```

Selectors:

- `selectWinningTeam`
- `selectMvp`
- `selectTotalPlayerPayout`

### 3.6 Screen / Component Orchestration Contract

- View 层只能消费 domain controller 或 screen/component orchestration controller 的输出。
- Orchestration controller 可以组合多个 domain controller，并拥有以下职责：
  - modal / form / picker / search query 等页面级局部状态
  - debounce、async bootstrap、URL sync、message banner、publish/settle feedback
  - 给 View 的派生展示模型，例如 node plot、ranked teams、payout hero、breadcrumb
- View 层禁止直接承担以下职责：
  - 直接 `fetch` / stream subscribe / query-string 编排
  - 业务流程级 `useState/useEffect/useMemo`
  - mutation 成功/失败 message 状态机
- 当前实现要求以下 orchestration controllers 持续存在并作为 View 唯一入口：
  - `useLobbyDiscoveryScreenController`
  - `useCreateMatchScreenController`
  - `useTeamLobbyScreenController`
  - `useFuelFrogMatchScreenController`
  - `useFuelFrogSettlementScreenController`
  - `useFuelFrogLobbyScreenController`
  - `useHeatmapScreenController`
  - `useNodeMapViewController`
  - `useWalletConnectBridgeController`
  - `useTargetNodePanelController`
  - `useSettlementBillPanelController`
- 例外：hover/focus/animation 这类纯呈现微状态可继续留在 View，但不能访问 service/model，也不能发起副作用。

---

## 4. HTTP and Stream Contracts

### 4.1 Discovery APIs

#### `GET /api/constellations`

```ts
type ListConstellationsQuery = {
  view?: 'regions';
  regionId?: number;
};
```

Responses:

```ts
type ListConstellationRegionsResponse = {
  regions: RegionSummary[];
  stale?: boolean;
};

type ListConstellationsResponse = {
  constellations: ConstellationSummary[];
  stale?: boolean;
};
```

- `view=regions`
  - 返回 region 摘要列表，供位置选择器先展示第一层。
- `regionId=<number>`
  - 只返回该 region 下的 `constellations`，供第二层按需展开。
- 默认
  - 返回全部 `constellations`，保留兼容读取方式。

#### `GET /api/constellations/{constellationId}`

Response:

```ts
ApiResult<{
  constellation: ConstellationSummary;
  systems: SolarSystemSummary[];
}>
```

#### `GET /api/search`

```ts
type SearchQuery = {
  q: string;
  type?: 'all' | 'constellation' | 'system';
};
```

Response: `ApiResult<{ items: SearchHit[] }>`

- `SearchHit.regionId`
  - constellation/system 命中都应带上 `regionId`，便于前端直接展开对应 region。

#### `GET /api/solar-systems/recommendations`

Query: `limit?: number`

Response: `ApiResult<{ items: SolarSystemRecommendation[] }>`

#### `GET /api/solar-systems`

```ts
type ListSolarSystemsQuery = {
  constellationId?: number;
  q?: string;
  limit?: number;
  offset?: number;
};
```

Response: `ApiResult<{ items: SolarSystemSummary[]; nextOffset: number | null }>`

#### `GET /api/solar-systems/{systemId}`

Response:

```ts
ApiResult<{
  system: SolarSystemDetail;
  nodes: NetworkNode[];
}>
```

#### `GET /api/network-nodes`

Query:

```ts
type ListNetworkNodesQuery = {
  solarSystem: number;
};
```

Response: `ApiResult<{ items: NetworkNode[] }>`

#### `GET /api/network-nodes/recommendations`

```ts
type GetNodeRecommendationsQuery = {
  currentSystem: number;
  targetMatchId?: string;
  maxJumps?: number;
  urgency?: Array<NodeUrgency>;
  limit?: number;
};
```

Response: `ApiResult<{ items: NodeRecommendation[] }>`

### 4.2 Match APIs

#### `GET /api/matches`

Response: `ApiResult<{ items: MatchSummary[]; nextOffset: number | null }>`

Rules:

- 公开列表不返回 `draft` 和 `cancelled`。
- 如果 `currentSystemId` 存在，服务端负责填充 `distanceHops`。

#### `GET /api/matches/{matchId}`

Response: `ApiResult<MatchDetail>`

#### `POST /api/matches`

Headers:

- `X-Idempotency-Key: string`

Request: `CreateMatchRequest`

Response:

```ts
ApiResult<{
  matchId: string;
  status: 'draft';
}>
```

校验规则：

- `name` 可缺省；缺省时由服务端按模式和目标星系生成默认名称
- `sponsorshipFee >= 500`
- `2 <= maxTeams <= 16`
- `0 <= entryFee <= 1000`
- `1 <= durationHours <= 72`
- `solarSystemId` 对应的目标星系必须满足 selectable 规则
- 精准模式必须有 `1-5` 个 `targetNodeIds`

#### `POST /api/matches/{matchId}/publish`

Headers:

- `X-Idempotency-Key: string`

Request: `PublishMatchRequest`

Response: `ApiResult<MatchDetail>`

校验规则：

- 比赛必须仍为 `draft`
- `publishTxDigest` 必须可验证，且金额等于 `sponsorshipFee`
- 精准模式目标节点必须全部属于目标星系

#### `GET /api/matches/{matchId}/status`

Response: `ApiResult<MatchStatusSnapshot>`

#### `GET /api/matches/{matchId}/scoreboard`

Response: `ApiResult<ScoreboardSnapshot>`

#### `GET /api/matches/{matchId}/stream`（SSE）

Payload: `MatchStreamEvent`

传输说明：

- 使用 `text/event-stream`
- 前端通过 `EventSource` 订阅同一路径
- 每条 SSE `data` 负载仍然遵循 `MatchStreamEvent`

最低必须推送：

- `score_update`
- `phase_change`
- `panic_mode`
- `settlement_start`

### 4.3 Team APIs

#### `GET /api/matches/{matchId}/teams`

Response: `ApiResult<{ items: TeamDetail[] }>`

#### `POST /api/teams`

Headers:

- `X-Idempotency-Key: string`

Request: `CreateTeamRequest`

Response: `ApiResult<TeamDetail>`

校验规则：

- `3 <= maxMembers <= 8`
- `roleSlots.collector + roleSlots.hauler + roleSlots.escort = maxMembers`
- 比赛必须处于 `lobby`

#### `POST /api/teams/{teamId}/join`

Request: `JoinTeamRequest`

Response: `ApiResult<JoinTeamResponse>`

规则：

- 创建入队申请后，默认返回 `status = pending`。
- 申请通过前不占用正式成员槽位，不计入 `memberCount`。
- 同一钱包地址在同一战队仅允许 1 条 `pending` 申请。

#### `POST /api/teams/{teamId}/applications/{applicationId}/approve`

Response: `ApiResult<TeamDetail>`

规则：

- 仅队长可调用。
- 仅 `pending` 申请可批准。
- 批准后申请状态改为 `approved`，并占用目标角色槽位。

#### `POST /api/teams/{teamId}/applications/{applicationId}/reject`

Request:

```ts
{
  reason?: string;
}
```

Response: `ApiResult<TeamDetail>`

规则：

- 仅队长可调用。
- 仅 `pending` 申请可拒绝。
- 拒绝后申请状态改为 `rejected`，且不占用角色槽位。

#### `POST /api/teams/{teamId}/leave`

Response: `ApiResult<TeamDetail>`

规则：

- 已锁队或已付费的战队不可离开。
- 队长离开时若仍有成员，必须先转移队长或解散；v2.6 默认返回 `CONFLICT`。

#### `POST /api/teams/{teamId}/lock`

Response: `ApiResult<TeamDetail>`

规则：

- 仅队长可锁队。
- 成员数必须等于 `maxMembers`。
- 锁队后不允许继续加入或离开。

#### `POST /api/teams/{teamId}/pay`

Headers:

- `X-Idempotency-Key: string`

Request: `PayTeamRequest`

Response: `ApiResult<TeamDetail>`

规则：

- 仅队长可调用。
- `payTxDigest` 对应支付金额必须等于 `entryFee * memberCount`。
- 成功后写入白名单快照。

### 4.4 Settlement APIs

#### `GET /api/matches/{matchId}/result`

Response: `ApiResult<SettlementBill>`

#### `GET /api/matches/{matchId}/settlement`

Response: `ApiResult<SettlementStatus>`

### 4.5 Legacy Alias Policy

- 若保留 `/api/nodes`，其响应必须与 `/api/network-nodes` 完全同构。
- 若保留 `/api/missions`，其返回结构必须与 `/api/matches` 完全同构。
- 新代码不得继续依赖旧别名。

---

## 5. Runtime Contracts

### 5.1 `solarSystemRuntime`

- 输入：world metadata API、缓存刷新指令。
- 输出：`solar_systems_cache`、单星系详情、gateLinks。
- 失败策略：外部 API 失败时可回退到最近缓存，并在响应中设置 `stale=true`。

### 5.2 `constellationRuntime`

- 输入：`solar_systems_cache`、`network_nodes`。
- 输出：`constellation_summaries`、推荐星系、搜索结果。
- 规则：
  - 星系 `selectable` 的判断来自该星系是否存在 `isOnline && isPublic` 的节点。
  - 推荐星系按紧急节点优先，再按可选系统数和名称排序。

### 5.3 `nodeRuntime`

- 输入：Sui `NetworkNode` 对象和相关位置/状态事件。
- 输出：`network_nodes` 读模型。
- 刷新频率：5 秒。
- 规则：
  - 必须输出 PRD 0.6 定义的 `/api/network-nodes` 统一字段口径。
  - `activeMatchId` 只来自平台比赛展示投影，不是链上原生字段，也不代表节点只能被单个比赛引用。

### 5.4 `nodeRecommendationRuntime`

- 输入：`network_nodes`、`solar_systems_cache`、当前位置、可选比赛。
- 输出：推荐节点列表。
- 规则：
  - 仅对自由模式提供推荐。
  - 距离采用 gateLinks 跳数。
  - 分数可按 `urgencyWeight * distanceWeight` 计算，但前端只消费结果，不复算。

### 5.5 `matchRuntime`

- 输入：创建命令、发布命令、比赛列表查询、定时器 tick。
- 输出：`matches`、`match_target_nodes`、`match_stream_events`。
- 规则：
  - `minTeams` 固定为 `2`。
  - 大厅等待期支持“满员即刻开赛”和“最低人数公开倒计时开赛”两类触发。
  - `draft -> lobby` 只能通过 publish 进入。
  - `running -> panic` 在最后 90 秒触发。
  - 状态迁移必须 CAS，防止重复推进。

### 5.6 `teamRuntime`

- 输入：创建/加入/离开/锁队/支付命令。
- 输出：`teams`、`team_members`、`team_payments`、`match_whitelists`。
- 规则：
  - 角色槽必须遵守 `roleSlots` 上限。
  - 锁队后成员名单冻结。
  - 支付确认成功后，整队地址一次性写入白名单快照。

### 5.7 `chainSyncEngine`

- 输入：Sui `FuelEvent(DEPOSITED)`、交易块详情、比赛白名单、比赛状态。
- 输出：`fuel_events`、`match_scores`、`match_stream_events`。
- 去重键：`txDigest + eventSeq`。
- 三重过滤：
  - `sender` 在白名单内
  - 自由模式节点在目标星系内；精准模式节点在冻结目标节点集内
  - `timestamp` 位于比赛时间窗口内
- 计分公式：
  - `fuelAdded * urgencyWeight * panicMultiplier`
  - `urgencyWeight` 以注入时刻的 `fillRatio` 计算

### 5.8 `settlementRuntime`

- 输入：`match_scores` 最终快照、`team_payments`、比赛配置、平台补贴。
- 输出：`settlements`、`matches.status = settled`、`match_stream_events`.
- 规则：
  - 每场比赛只允许一个有效结算实例。
  - `platformFeeRate = 0.05`
  - 两队分配 `[0.7, 0.3]`；三队及以上 `[0.6, 0.3, 0.1]`
  - 个人奖金按个人得分占比分配
  - 链上发奖成功后才能标记 `settled`

---

## 6. Error, Idempotency, and Observability Contracts

### 6.1 Response and Header Rules

- 所有响应必须带 `requestId`。
- 所有写接口必须要求 `X-Idempotency-Key`。
- 所有写接口必须先通过 route-level 钱包签名中间件，校验 `walletAddress + message + signature` 与 `scope:targetId` 绑定关系。
- 命中相同 `scope + X-Idempotency-Key + requestHash` 时必须返回同一结果；同 key 不同 payload 必须返回 `CONFLICT`。
- 读取缓存但已过期时，响应必须显式返回 `stale=true`。

### 6.2 Retry Rules

- `INVALID_INPUT`、`FORBIDDEN`、`SYSTEM_NOT_SELECTABLE` 不可重试。
- `CHAIN_SYNC_ERROR`、`STREAM_UNAVAILABLE`、外部依赖超时可重试。
- `CONFLICT` 由客户端先刷新最新状态，再决定是否重试。

### 6.3 Required Structured Log Fields

- `requestId`
- `runtime`
- `matchId`
- `teamId`
- `walletAddress`
- `txDigest`
- `errorCode`

### 6.4 Runtime Health Endpoint

- `GET /api/runtime/health` 必须返回 worker 心跳与投影新鲜度摘要。
- 至少包含：`nodeRuntime`, `constellationRuntime`, `matchRuntime`, `chainSyncEngine`, `settlementRuntime`。

### 6.5 Required Metrics

- `match_create_conflict_total`
- `match_publish_success_total`
- `team_payment_verify_latency_ms`
- `score_delivery_latency_ms`
- `stream_disconnect_total`
- `settlement_duration_seconds`
