export type PlayerRole = "collector" | "hauler" | "escort" | "dispatcher";

export type SettlementState = "pending" | "running" | "succeeded" | "failed";

export interface SettlementBill {
  matchId: string;
  sponsorshipFee: string;
  entryFeeTotal: string;
  platformSubsidy: string;
  grossPool: string;
  platformFeeRate: 0.05;
  platformFee: string;
  payoutPool: string;
  payoutTxDigest: string | null;
  teamBreakdown: TeamPayout[];
  mvp: MvpInfo | null;
}

export interface SettlementStatus {
  matchId: string;
  status: SettlementState;
  progress: number;
  payoutTxDigest: string | null;
  updatedAt: string;
}

export interface TeamPayout {
  teamId: string;
  teamName: string;
  rank: number;
  totalScore: number;
  prizeRatio: number;
  prizeAmount: string;
  members: MemberPayout[];
}

export interface MemberPayout {
  walletAddress: string;
  role: PlayerRole;
  personalScore: number;
  contributionRatio: number;
  prizeAmount: string;
}

export interface MvpInfo {
  walletAddress: string;
  teamId: string;
  role: PlayerRole;
  score: number;
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
