export type PlayerRole = "collector" | "hauler" | "escort" | "dispatcher";

export type SettlementStatus = "pending" | "committed" | "settled" | "failed";

export interface SettlementBill {
  matchId: string;
  grossPool: number;
  platformFee: number;
  payoutPool: number;
  resultHash: string;
  commitmentTx: string | null;
  settlementTx: string | null;
  status: SettlementStatus;
  teamBreakdown: TeamPayout[];
  mvp: MvpInfo | null;
}

export interface TeamPayout {
  teamId: string;
  teamName: string;
  rank: number;
  totalScore: number;
  prizeRatio: number;
  prizeAmount: number;
  members: MemberPayout[];
}

export interface MemberPayout {
  walletAddress: string;
  role: PlayerRole;
  personalScore: number;
  contributionRatio: number;
  prizeAmount: number;
}

export interface MvpInfo {
  walletAddress: string;
  role: PlayerRole;
  totalScore: number;
  teamName: string;
}

export const PAYOUT_RATIOS: Record<number, number[]> = {
  1: [1.0],
  2: [0.7, 0.3],
  3: [0.6, 0.3, 0.1]
};

export function getTeamPayoutRatios(teamCount: number): number[] {
  if (teamCount <= 0) {
    return [];
  }
  if (teamCount === 1) {
    return PAYOUT_RATIOS[1];
  }
  if (teamCount === 2) {
    return PAYOUT_RATIOS[2];
  }
  return PAYOUT_RATIOS[3];
}
