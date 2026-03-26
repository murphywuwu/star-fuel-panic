import { listMatchDetails } from "./matchRuntime.ts";
import { buildSettlementBill } from "./settlementRuntime.ts";
import type { MatchDetail } from "./matchRuntime.ts";
import type { PlayerProfile, PlayerRecentMatch } from "../types/player.ts";
import type { Team, TeamMember } from "../types/team.ts";

function round2(value: number) {
  return Number(value.toFixed(2));
}

function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
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

export function getPlayerProfile(address: string): PlayerProfile {
  const normalizedAddress = normalizeAddress(address);
  const recentMatches = listMatchDetails()
    .flatMap((detail) => {
      const memberEarningsMap = buildMemberEarningsMap(detail);

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
