export type RoomState = "LobbyReady" | "RoleLock" | "RelayRunning" | "Overtime" | "Settled";

export type Role = "Miner" | "Runner" | "Assembler" | "Guard";

export type DomainErrorCode =
  | "E_STATE_TRANSITION_INVALID"
  | "E_BLUEPRINT_DEPENDENCY_UNMET"
  | "E_MATERIAL_NOT_ALLOWED"
  | "E_SETTLEMENT_DUPLICATED"
  | "E_PERMISSION_DENIED"
  | "E_CHAIN_WRITE_FAILED"
  | "E_ANTI_ABUSE_FLAGGED";

export interface DomainError {
  code: DomainErrorCode;
  message: string;
}

export interface BlueprintStep {
  stepId: string;
  requiredTypeId: string;
  requiredQty: number;
  dependencySteps: string[];
  completed: boolean;
}

export interface MaterialCommitPayload {
  typeId: string;
  qty: number;
  sourceRef: string;
}

export interface ContributionSnapshot {
  miningPoints: number;
  haulingPoints: number;
  assemblyPoints: number;
  guardPoints: number;
}

export interface TeamPayout {
  teamId: string;
  amount: number;
}

export interface MemberPayout {
  playerId: string;
  amount: number;
}

export interface SettlementBill {
  grossPool: number;
  platformFee: number;
  hostFee: number;
  payoutPool: number;
  teamPayouts: TeamPayout[];
  memberPayouts: MemberPayout[];
}

export interface ControllerResult<T> {
  ok: boolean;
  data?: T;
  error?: DomainError;
}

export interface AntiAbuseInput {
  matchDurationSec: number;
  repeatedRouteCount: number;
  maxPlayerContributionRatio: number;
  sameAddressClusterCount: number;
}

export interface AntiAbuseResult {
  flagged: boolean;
  flags: string[];
}
