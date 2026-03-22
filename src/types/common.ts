export type ErrorCode =
  | "WALLET_NOT_CONNECTED"
  | "INSUFFICIENT_BALANCE"
  | "INVALID_INPUT"
  | "ROOM_NOT_JOINABLE"
  | "ROLE_ALREADY_TAKEN"
  | "TEAM_NOT_LOCKED"
  | "TEAM_ALREADY_PAID"
  | "MATCH_NOT_STARTABLE"
  | "MATCH_ALREADY_ENDED"
  | "SETTLEMENT_IN_PROGRESS"
  | "SETTLEMENT_FAILED"
  | "CHAIN_SYNC_ERROR"
  | "TX_REJECTED"
  | "NETWORK_ERROR"
  | "UNKNOWN"
  | string;

export interface ControllerResult<T> {
  ok: boolean;
  message: string;
  errorCode?: ErrorCode;
  payload?: T;
}
