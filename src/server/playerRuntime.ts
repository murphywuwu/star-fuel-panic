import { listMatchDiscoveryItems } from "./matchDiscoveryRuntime.ts";
import { listMatchDetails } from "./matchRuntime.ts";
import { buildSettlementBill } from "./settlementRuntime.ts";
import { getMatchTeamsSnapshot } from "./teamRuntime.ts";
import type { MatchDetail } from "./matchRuntime.ts";
import type {
  ActiveTeamDeployment,
  PlayerProfile,
  PlayerRecentMatch,
  PlayerTeamDossier,
  TeamDossierMatchSummary,
  TeamParticipation
} from "../types/player.ts";
import type { MatchCreationMode, MatchDiscoveryItem } from "../types/match.ts";
import type { Team, TeamMember } from "../types/team.ts";

function round2(value: number) {
  return Number(value.toFixed(2));
}

function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
}

function modeLabel(mode: MatchCreationMode) {
  return mode === "precision" ? "Precision Mode" : "Free Mode";
}

function fallbackMatchName(matchId: string, mode: MatchCreationMode, solarSystemName: string) {
  if (mode === "precision") {
    return `${solarSystemName} Precision Supply Run`;
  }

  if (solarSystemName === "Unknown System") {
    return `Free Match ${matchId.slice(0, 8)}`;
  }

  return `${solarSystemName} System Exploration Match`;
}

function buildMemberEarningsMap(detail: MatchDetail) {
  const memberEarnings = new Map<string, number>();

  const settlementBill = buildSettlementBill(detail);
  const memberIdByWallet = new Map(detail.members.map((member) => [normalizeAddress(member.walletAddress), member.id]));

  for (const team of settlementBill.teamBreakdown) {
    for (const member of team.members) {
      const memberId = memberIdByWallet.get(normalizeAddress(member.walletAddress));
      if (!memberId) {
        continue;
      }
      memberEarnings.set(memberId, round2(Number(member.prizeAmount)));
    }
  }

  return memberEarnings;
}

function toRecentMatch(detail: MatchDetail, team: Team, member: TeamMember, earnings: number): PlayerRecentMatch {
  return {
    matchId: detail.match.id,
    rank: team.rank ?? 0,
    score: member.personalScore,
    earnings,
    createdAt: detail.match.createdAt
  };
}

function calculateReputation(totalMatches: number, wins: number, totalScore: number, totalEarnings: number) {
  if (totalMatches <= 0) {
    return 0;
  }

  const participationScore = Math.min(25, totalMatches * 5);
  const winScore = Math.round((wins / totalMatches) * 35);
  const performanceScore = Math.min(25, Math.round(totalScore / 20));
  const earningsScore = Math.min(15, Math.round(totalEarnings / 100));

  return Math.min(100, participationScore + winScore + performanceScore + earningsScore);
}

function toDossierMatch(detail: MatchDetail, discovery: MatchDiscoveryItem | undefined): TeamDossierMatchSummary {
  const solarSystemId =
    discovery?.targetSolarSystem.systemId ??
    (typeof detail.match.solarSystemId === "number" && detail.match.solarSystemId > 0 ? detail.match.solarSystemId : null);
  const solarSystemName =
    discovery?.targetSolarSystem.systemName ??
    (solarSystemId ? `System ${solarSystemId}` : "Unknown System");
  const mode = detail.match.creationMode;

  return {
    matchId: detail.match.id,
    matchName: discovery?.name ?? fallbackMatchName(detail.match.id, mode, solarSystemName),
    matchStatus: detail.match.status,
    mode,
    modeLabel: discovery?.modeLabel ?? modeLabel(mode),
    solarSystemId,
    solarSystemName,
    entryFee: discovery?.entryFee ?? detail.match.entryFee,
    grossPool: discovery?.grossPool ?? detail.match.prizePool,
    createdAt: detail.match.createdAt
  };
}

export function getPlayerProfile(address: string): PlayerProfile {
  const normalizedAddress = normalizeAddress(address);
  const recentMatches = listMatchDetails()
    .flatMap((detail) => {
      const memberEarningsMap = detail.match.status === "settled" ? buildMemberEarningsMap(detail) : new Map<string, number>();

      return detail.members.flatMap((member) => {
        if (normalizeAddress(member.walletAddress) !== normalizedAddress) {
          return [];
        }

        const team = detail.teams.find((item) => item.id === member.teamId);
        if (!team) {
          return [];
        }

        return [toRecentMatch(detail, team, member, memberEarningsMap.get(member.id) ?? 0)];
      });
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  const totalMatches = recentMatches.length;
  const wins = recentMatches.filter((match) => match.rank === 1).length;
  const totalScore = recentMatches.reduce((sum, match) => sum + match.score, 0);
  const totalEarnings = round2(recentMatches.reduce((sum, match) => sum + match.earnings, 0));

  return {
    address: address.trim(),
    totalMatches,
    wins,
    totalScore,
    totalEarnings,
    reputationScore: calculateReputation(totalMatches, wins, totalScore, totalEarnings),
    recentMatches
  };
}

export async function getPlayerTeamDossier(address: string): Promise<PlayerTeamDossier> {
  const normalizedAddress = normalizeAddress(address);
  const profile = getPlayerProfile(address);
  const discoveryItems = await listMatchDiscoveryItems({});
  const discoveryByMatchId = new Map(discoveryItems.map((item) => [item.id, item]));
  const participationRecords = listMatchDetails()
    .flatMap((detail) => {
      const teamSnapshot = getMatchTeamsSnapshot(detail.match.id);
      const team =
        teamSnapshot?.items.find((item) =>
          item.members.some((member) => normalizeAddress(member.walletAddress) === normalizedAddress)
        ) ?? null;

      if (!team) {
        return [];
      }

      const member = team.members.find((item) => normalizeAddress(item.walletAddress) === normalizedAddress);
      if (!member) {
        return [];
      }

      const memberEarningsMap = buildMemberEarningsMap(detail);
      const payout = detail.match.status === "settled" ? memberEarningsMap.get(member.id) ?? 0 : 0;
      const match = toDossierMatch(detail, discoveryByMatchId.get(detail.match.id));
      const participation: TeamParticipation = {
        teamId: team.id,
        teamName: team.name,
        captainAddress: team.captainAddress,
        teamStatus: team.status,
        memberCount: team.memberCount,
        maxSize: team.maxSize,
        role: member.role,
        isCaptain: normalizeAddress(team.captainAddress) === normalizedAddress,
        totalScore: team.totalScore,
        personalScore: member.personalScore,
        payout,
        rank: team.rank,
        joinedAt: member.joinedAt,
        createdAt: detail.match.createdAt,
        match
      };

      return [
        {
          team,
          participation
        }
      ];
    })
    .sort((left, right) => Date.parse(right.participation.createdAt) - Date.parse(left.participation.createdAt));

  const currentDeploymentRecord =
    participationRecords.find((record) => record.participation.match.matchStatus !== "settled") ?? null;

  const currentDeployment: ActiveTeamDeployment | null = currentDeploymentRecord
    ? {
        team: currentDeploymentRecord.team,
        match: currentDeploymentRecord.participation.match,
        myRole: currentDeploymentRecord.participation.role,
        isCaptain: currentDeploymentRecord.participation.isCaptain
      }
    : null;

  return {
    address: address.trim(),
    summary: {
      totalMatches: profile.totalMatches,
      totalTeams: new Set(participationRecords.map((record) => record.participation.teamId)).size,
      wins: profile.wins,
      totalScore: profile.totalScore,
      totalEarnings: profile.totalEarnings,
      activeDeployments: participationRecords.filter((record) => record.participation.match.matchStatus !== "settled").length
    },
    currentDeployment,
    participations: participationRecords.map((record) => record.participation)
  };
}
