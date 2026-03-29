import type { MatchCreationMode, MatchStatus } from "./match.ts";
import type { PlayerRole, TeamDetail, TeamStatus } from "./team.ts";

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

export interface TeamDossierMatchSummary {
  matchId: string;
  matchName: string;
  matchStatus: MatchStatus;
  mode: MatchCreationMode;
  modeLabel: string;
  solarSystemId: number | null;
  solarSystemName: string;
  entryFee: number;
  grossPool: number;
  createdAt: string;
}

export interface TeamParticipation {
  teamId: string;
  teamName: string;
  captainAddress: string;
  teamStatus: TeamStatus;
  memberCount: number;
  maxSize: number;
  role: PlayerRole;
  isCaptain: boolean;
  totalScore: number;
  personalScore: number;
  payout: number;
  rank: number | null;
  joinedAt: string;
  createdAt: string;
  match: TeamDossierMatchSummary;
}

export interface ActiveTeamDeployment {
  team: TeamDetail;
  match: TeamDossierMatchSummary;
  myRole: PlayerRole;
  isCaptain: boolean;
}

export interface TeamDossierSummary {
  totalMatches: number;
  totalTeams: number;
  wins: number;
  totalScore: number;
  totalEarnings: number;
  activeDeployments: number;
}

export interface PlayerTeamDossier {
  address: string;
  summary: TeamDossierSummary;
  currentDeployment: ActiveTeamDeployment | null;
  participations: TeamParticipation[];
}
