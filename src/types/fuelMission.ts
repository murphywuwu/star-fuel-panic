import type { FuelGradeInfo } from "@/types/fuelGrade";

export type MatchStatus = "lobby" | "pre_start" | "running" | "panic" | "settling" | "settled";

export type MissionPhase =
  | MatchStatus
  | "LobbyReady"
  | "Planning"
  | "MatchRunning"
  | "FinalSprint"
  | "Settled";

export type TeamRole = "Collector" | "Hauler" | "Escort" | "Dispatcher";
export type TeamLifecycleStatus = "forming" | "locked" | "paid" | "ready";

export type FuelMissionErrorCode =
  | "E_INVALID_STATE_TRANSITION"
  | "E_DUP_SETTLEMENT"
  | "E_DUP_REWARD_CLAIM"
  | "E_ROOM_CONFIG_LOCKED"
  | "E_SCORE_EVENT_INVALID"
  | "E_FILTER_REJECTED"
  | "E_ROOM_NOT_READY"
  | "E_ROLE_LOCKED"
  | "E_WALLET_NOT_CONNECTED"
  | "E_WALLET_UNAVAILABLE"
  | "E_WALLET_CONNECT_REJECTED"
  | "E_WALLET_SIGN_REJECTED"
  | "E_WALLET_NETWORK"
  | "E_INSUFFICIENT_BALANCE"
  | "E_INSUFFICIENT_GAS"
  | "E_SETTLEMENT_RPC_TIMEOUT"
  | "E_SETTLEMENT_TX_REJECTED"
  | "E_SETTLEMENT_IDEMPOTENCY_CONFLICT"
  | "E_SETTLEMENT_INVALID_STATE"
  | "E_SETTLEMENT_UNKNOWN"
  | string;

export interface ControllerResult<T> {
  ok: boolean;
  errorCode?: FuelMissionErrorCode;
  message: string;
  payload?: T;
}

export interface MatchStreamCallbacks {
  onStatusChange?: (status: MatchStatus) => void;
  onRemainingChange?: (remainingSec: number) => void;
  onPanicMode?: () => void;
  onSettlementStart?: () => void;
}

export interface NodeDeficitSnapshot {
  nodeId: string;
  name: string;
  fillRatio: number;
  riskWeight: number;
  completed: boolean;
}

export type UrgencyActionTag = "HAUL_NOW" | "ESCORT_FIRST" | "HOLD_AND_SCAN";

export interface UrgencyFeedItem {
  nodeId: string;
  name: string;
  fillRatio: number;
  riskWeight: number;
  deficitRatio: number;
  timePressure: number;
  priorityIndex: number;
  priorityDelta30s: number;
  recommendedActionTag: UrgencyActionTag;
  priorityReason: string;
}

export interface MissionValueIntro {
  gameWhatText: string;
  gameWhyText: string;
}

export interface RescueCandidate {
  nodeId: string;
  name: string;
  canRescue: boolean;
  rescueBlockReason: string | null;
  fillRatio: number;
  deficitRatio: number;
  riskWeight: number;
  timePressure: number;
  priorityIndex: number;
  recommendedActionTag: UrgencyActionTag;
}

export interface PlayerContribution {
  playerId: string;
  name: string;
  score: number;
}

export interface FundingSources {
  entryFeeLux: number;
  playerCount: number;
  hostSeedPool: number;
  platformSubsidyPool: number;
  sponsorPool: number;
  platformRakeBps: number;
  hostRevshareBps: number;
  minTeams?: number;
  maxTeams?: number;
  minPlayersPerTeam?: number;
  startRuleSummary?: string;
}

export interface SettlementBill {
  grossPool: number;
  platformFee: number;
  hostFee: number;
  payoutPool: number;
  playerBuyinPool: number;
  memberPayouts: Array<{ playerId: string; amount: number }>;
  settlementId?: string;
}

export interface TeamState {
  teamId: string;
  name: string;
  players: Array<{
    playerId: string;
    name: string;
    walletAddress?: string;
    role?: TeamRole;
    joinedAt?: number;
  }>;
  roles: Partial<Record<TeamRole, string>>;
  captainWallet?: string;
  maxSize?: number;
  roleSlots?: TeamRole[];
  status?: TeamLifecycleStatus;
  paidTxDigest?: string;
  paidAt?: number;
}

export interface RoomState {
  roomId: string;
  hostId: string;
  hostName: string;
  configLockHash: string;
  rolesLocked: boolean;
  whitelistWallets?: string[];
}

export interface MissionEvent {
  eventId: string;
  nodeId: string;
  playerId: string;
  playerName: string;
  contributionDelta: number;
  fillDelta: number;
  chainTimestampMs?: number;
  wsPublishedAtMs?: number;
  createdAt: number;
}

export interface RecordSupplyEventInput {
  eventId: string;
  nodeId: string;
  playerId: string;
  playerName: string;
  contributionDelta: number;
  fillDelta: number;
  chainTimestampMs?: number;
  wsPublishedAtMs?: number;
}

export interface RiskMarker {
  id: string;
  severity: "low" | "medium" | "high";
  reason: string;
  createdAt: number;
}

export interface AuditLog {
  id: string;
  action: string;
  detail: string;
  timestamp: number;
  eventType?: string;
  reasonCode?: string;
  severity?: AlertSeverity;
}

export interface MissionSnapshotPullResult {
  stale: boolean;
  nodes: NodeDeficitSnapshot[];
  source: "stub" | "fallback";
}

export type AlertSeverity = "info" | "warning" | "critical";

export type FilterRejectionReason =
  | "INVALID_PHASE"
  | "INVALID_EVENT_PAYLOAD"
  | "DUPLICATE_EVENT_ID"
  | "NOT_IN_MATCH_WHITELIST"
  | "TARGET_NODE_MISMATCH"
  | "EVENT_OUTSIDE_MATCH_WINDOW"
  | "INVALID_FUEL_DELTA";

export type SettlementFailureCode =
  | "SETTLEMENT_RPC_TIMEOUT"
  | "SETTLEMENT_TX_REJECTED"
  | "SETTLEMENT_IDEMPOTENCY_CONFLICT"
  | "SETTLEMENT_INVALID_STATE"
  | "SETTLEMENT_UNKNOWN";

export interface SettlementFailureAlert {
  id: string;
  code: SettlementFailureCode;
  severity: AlertSeverity;
  message: string;
  createdAt: number;
}

export interface MetricSummary {
  latest: number;
  avg: number;
  p95: number;
  sampleCount: number;
}

export interface ObservabilityMetrics {
  eventLagMs: MetricSummary;
  wsLatencyMs: MetricSummary;
  settlementSuccess: {
    attempts: number;
    successes: number;
    rate: number;
  };
}

export interface AnomalyDrillReport {
  executedAt: number;
  cases: Array<{
    scenario: "rpc_timeout" | "duplicate_settlement" | "illegal_state_transition";
    passed: boolean;
    expected: string;
    observedCode?: FuelMissionErrorCode;
    message: string;
  }>;
}

export type FilterRejectReason = FilterRejectionReason;

export interface MatchWindow {
  startTs: number;
  endTs: number;
  panicTs: number;
}

export interface ChainFuelEvent {
  eventId?: string;
  matchId: string;
  senderWallet: string;
  playerName: string;
  txDigest: string;
  assemblyId: string;
  fuelTypeId: number;
  fuelEfficiency?: number | null;
  oldQuantity: number;
  newQuantity: number;
  maxCapacity: number;
  chainTs: number;
}

export interface ScoreEvent {
  id: string;
  matchId: string;
  teamId: string;
  memberWallet: string;
  memberName: string;
  txDigest: string;
  assemblyId: string;
  oldQuantity: number;
  newQuantity: number;
  maxCapacity: number;
  fuelDelta: number;
  fuelTypeId: number;
  fuelGrade: FuelGradeInfo;
  fillRatioAt: number;
  urgencyWeight: number;
  panicMultiplier: number;
  fuelGradeBonus: number;
  primaryGradeMultiplier: number;
  score: number;
  chainTs: number;
  createdAt: number;
}

export interface ScoreRejectAuditLog {
  id: string;
  matchId: string;
  txDigest: string;
  senderWallet: string;
  assemblyId: string;
  reason: FilterRejectReason;
  chainTs: number;
  createdAt: number;
}

export interface MemberScoreLine {
  walletAddress: string;
  name: string;
  role: TeamRole | "Unassigned";
  personalScore: number;
  contributionRatio: number;
}

export interface TeamScoreLine {
  teamId: string;
  teamName: string;
  totalScore: number;
  members: MemberScoreLine[];
}

export interface ScoreBoard {
  matchId: string;
  teams: TeamScoreLine[];
  lastUpdated: number;
}

export interface PlayerGradeCollection {
  matchId: string;
  memberWallet: string;
  collectedGrades: ("standard" | "premium" | "refined")[];
  hasAllGrades: boolean;
}

export interface FuelGradeChallengeBonus {
  primaryGradeMultiplier: number;
  allGradesBonus: number;
}
