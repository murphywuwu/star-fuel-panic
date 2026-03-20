export type MissionPhase = "LobbyReady" | "Planning" | "MatchRunning" | "FinalSprint" | "Settled";

export type TeamRole = "Collector" | "Hauler" | "Escort" | "Dispatcher";

export type FuelMissionErrorCode =
  | "E_INVALID_STATE_TRANSITION"
  | "E_DUP_SETTLEMENT"
  | "E_DUP_REWARD_CLAIM"
  | "E_ROOM_CONFIG_LOCKED"
  | "E_SCORE_EVENT_INVALID"
  | "E_ROOM_NOT_READY"
  | "E_ROLE_LOCKED";

export interface ControllerResult<T> {
  ok: boolean;
  errorCode?: FuelMissionErrorCode;
  message: string;
  payload?: T;
}

export interface NodeDeficitSnapshot {
  nodeId: string;
  name: string;
  fillRatio: number;
  riskWeight: number;
  completed: boolean;
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
  players: Array<{ playerId: string; name: string }>;
  roles: Partial<Record<TeamRole, string>>;
}

export interface RoomState {
  roomId: string;
  hostId: string;
  hostName: string;
  configLockHash: string;
  rolesLocked: boolean;
}

export interface MissionEvent {
  eventId: string;
  nodeId: string;
  playerId: string;
  playerName: string;
  contributionDelta: number;
  fillDelta: number;
  createdAt: number;
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
}

export interface MissionSnapshotPullResult {
  stale: boolean;
  nodes: NodeDeficitSnapshot[];
  source: "stub" | "fallback";
}
