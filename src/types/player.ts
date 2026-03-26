export interface PlayerRecentMatch {
  matchId: string;
  rank: number;
  score: number;
  earnings: number;
  createdAt: string;
}

export interface PlayerProfile {
  address: string;
  totalMatches: number;
  wins: number;
  totalScore: number;
  totalEarnings: number;
  reputationScore: number;
  recentMatches: PlayerRecentMatch[];
}
