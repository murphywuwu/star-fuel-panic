export type MatchPhase =
  | "LobbyReady"
  | "CardDrafted"
  | "MatchRunning"
  | "GraceWindow"
  | "Settled";

export type SlotStatus = "Idle" | "Pending" | "Confirmed" | "Rejected";

export type DomainErrorCode =
  | "E_INVALID_INPUT"
  | "E_DUPLICATE_KILLMAIL"
  | "E_VERIFICATION_TIMEOUT"
  | "E_INVALID_STATE_TRANSITION"
  | "E_SETTLEMENT_REPLAY"
  | "E_PERMISSION_DENIED"
  | "E_MATCH_NOT_FOUND"
  | "E_CHAIN_UNAVAILABLE";

export interface DomainError {
  code: DomainErrorCode;
  message: string;
}

export interface KillmailRef {
  killmailId: string;
  actorId: string;
  occurredAt: string;
}

export interface BoardSlot {
  slotId: string;
  label: string;
  weight: number;
  verificationRuleId: string;
  status: SlotStatus;
  confirmedKillmailId?: string;
}

export interface SettlementBill {
  settlementId: string;
  grossPool: number;
  platformFee: number;
  hostFee: number;
  payoutPool: number;
}

export interface BattleReportEntry {
  killmailId: string;
  slotId: string;
  status: "Confirmed" | "Rejected";
  settlementId?: string;
}

export interface MatchSnapshot {
  matchId: string;
  phase: MatchPhase;
  lastSyncedAt: string;
}

export interface ContractMatchSnapshot {
  matchId: string;
  phase: Exclude<MatchPhase, "CardDrafted">;
  confirmedSlots: number;
  rejectedSlots: number;
  settlement: SettlementBill;
  settled: boolean;
  claimed: boolean;
  claimedBy: string | null;
  riskPenalized: boolean;
}
