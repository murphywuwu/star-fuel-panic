import { getMatchDetail, type MatchDetail } from "./matchRuntime.ts";
import {
  getTeamPayoutRatios,
  type MemberPayout,
  type MvpInfo,
  type SettlementBill,
  type SettlementStatus,
  type TeamPayout
} from "../types/settlement.ts";

type SettlementResolution =
  | { ok: true; bill: SettlementBill }
  | { ok: false; reason: "not_found" | "not_ready" };

const PLATFORM_FEE_RATE = 0.05 as const;

function round2(value: number) {
  return Number(value.toFixed(2));
}

function toMoneyString(value: number) {
  const normalized = round2(value);
  return normalized.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function calculatePlatformFee(grossPool: number) {
  return Math.floor(grossPool * PLATFORM_FEE_RATE);
}

function getPaidParticipantCount(detail: MatchDetail) {
  return detail.teams
    .filter((team) => team.hasPaid)
    .reduce((sum, team) => sum + detail.members.filter((member) => member.teamId === team.id).length, 0);
}

function resolveFundingBreakdown(detail: MatchDetail) {
  const grossPool = round2(detail.match.prizePool);
  const entryFeeTotal = round2(getPaidParticipantCount(detail) * detail.match.entryFee);
  const explicitPlatformSubsidy = round2(detail.match.platformSubsidy ?? 0);
  const explicitSponsorshipFee = round2(detail.match.sponsorshipFee ?? detail.match.hostPrizePool ?? 0);

  const sponsorshipFee =
    explicitSponsorshipFee > 0
      ? explicitSponsorshipFee
      : round2(Math.max(0, grossPool - entryFeeTotal - explicitPlatformSubsidy));

  const platformSubsidy = round2(Math.max(explicitPlatformSubsidy, grossPool - sponsorshipFee - entryFeeTotal));

  return {
    sponsorshipFee,
    entryFeeTotal,
    platformSubsidy,
    grossPool
  };
}

function getPayoutTraceDigest(detail: MatchDetail) {
  // Mock runtime still reuses the first paid team tx as payout trace until devnet settlement tx is wired in.
  return detail.teams.find((team) => Boolean(team.payTxDigest))?.payTxDigest ?? null;
}

function allocateByRatio(total: number, ratios: number[], length: number): number[] {
  const payouts = new Array<number>(length).fill(0);
  const rankedIndexes = ratios
    .map((ratio, index) => ({ ratio, index }))
    .filter((item) => item.ratio > 0)
    .map((item) => item.index);

  let allocated = 0;
  for (let pointer = 0; pointer < rankedIndexes.length; pointer += 1) {
    const index = rankedIndexes[pointer];
    const isLastPaidRank = pointer === rankedIndexes.length - 1;
    const amount = isLastPaidRank ? round2(total - allocated) : round2(total * (ratios[index] ?? 0));
    payouts[index] = Math.max(0, amount);
    allocated = round2(allocated + payouts[index]);
  }

  return payouts;
}

function buildMemberPayouts(
  teamPrize: number,
  members: Array<{ walletAddress: string; role: MemberPayout["role"]; personalScore: number }>
): MemberPayout[] {
  const totalScore = members.reduce((sum, member) => sum + member.personalScore, 0);
  if (totalScore <= 0) {
    return members.map((member) => ({
      walletAddress: member.walletAddress,
      role: member.role,
      personalScore: member.personalScore,
      contributionRatio: 0,
      prizeAmount: toMoneyString(0)
    }));
  }

  let allocated = 0;
  return members.map((member, index) => {
    const contributionRatio = member.personalScore > 0 ? member.personalScore / totalScore : 0;
    const isLastMember = index === members.length - 1;
    const prizeAmount =
      member.personalScore <= 0 ? 0 : isLastMember ? round2(teamPrize - allocated) : round2(teamPrize * contributionRatio);
    const safePrizeAmount = Math.max(0, prizeAmount);
    allocated = round2(allocated + safePrizeAmount);

    return {
      walletAddress: member.walletAddress,
      role: member.role,
      personalScore: member.personalScore,
      contributionRatio: round2(contributionRatio),
      prizeAmount: toMoneyString(safePrizeAmount)
    };
  });
}

export function buildSettlementBill(detail: MatchDetail): SettlementBill {
  const scoreByWallet = new Map<string, number>();
  for (const score of detail.scores ?? []) {
    scoreByWallet.set(score.walletAddress, score.totalScore);
  }

  const membersByTeam = new Map<string, MatchDetail["members"]>();
  for (const member of detail.members) {
    const current = membersByTeam.get(member.teamId) ?? [];
    current.push(member);
    membersByTeam.set(member.teamId, current);
  }

  const rankedTeams = [...detail.teams]
    .map((team) => {
      const members = membersByTeam.get(team.id) ?? [];
      const memberScore = members.reduce<number>(
        (sum, member) => sum + (scoreByWallet.get(member.walletAddress) ?? member.personalScore),
        0
      );
      const totalScore = Math.max(team.totalScore, memberScore);
      return { team, members, totalScore };
    })
    .sort((left, right) => {
      if (right.totalScore !== left.totalScore) {
        return right.totalScore - left.totalScore;
      }
      return left.team.id.localeCompare(right.team.id);
    });

  const { sponsorshipFee, entryFeeTotal, platformSubsidy, grossPool } = resolveFundingBreakdown(detail);
  const platformFee = calculatePlatformFee(grossPool);
  const payoutPool = round2(grossPool - platformFee);
  const ratios = getTeamPayoutRatios(rankedTeams.length);
  const teamPrizeAmounts = allocateByRatio(payoutPool, ratios, rankedTeams.length);

  const teamBreakdown: TeamPayout[] = rankedTeams.map((entry, index) => {
    const members = entry.members.map((member) => ({
      walletAddress: member.walletAddress,
      role: member.role,
      personalScore: scoreByWallet.get(member.walletAddress) ?? member.personalScore
    }));

    return {
      teamId: entry.team.id,
      teamName: entry.team.name,
      rank: index + 1,
      totalScore: entry.totalScore,
      prizeRatio: ratios[index] ?? 0,
      prizeAmount: toMoneyString(teamPrizeAmounts[index] ?? 0),
      members: buildMemberPayouts(teamPrizeAmounts[index] ?? 0, members)
    };
  });

  const mvpEntry = teamBreakdown
    .flatMap((team) => team.members.map((member) => ({ teamId: team.teamId, member })))
    .sort((left, right) => {
      if (right.member.personalScore !== left.member.personalScore) {
        return right.member.personalScore - left.member.personalScore;
      }
      return left.member.walletAddress.localeCompare(right.member.walletAddress);
    })[0];

  const mvp: MvpInfo | null = mvpEntry
    ? {
        walletAddress: mvpEntry.member.walletAddress,
        teamId: mvpEntry.teamId,
        role: mvpEntry.member.role,
        score: mvpEntry.member.personalScore
      }
    : null;

  return {
    matchId: detail.match.id,
    sponsorshipFee: toMoneyString(sponsorshipFee),
    entryFeeTotal: toMoneyString(entryFeeTotal),
    platformSubsidy: toMoneyString(platformSubsidy),
    grossPool: toMoneyString(grossPool),
    platformFeeRate: PLATFORM_FEE_RATE,
    platformFee: toMoneyString(platformFee),
    payoutPool: toMoneyString(payoutPool),
    payoutTxDigest: getPayoutTraceDigest(detail),
    teamBreakdown,
    mvp
  };
}

export function resolveSettlementBill(detail: MatchDetail | null): SettlementResolution {
  if (!detail) {
    return { ok: false, reason: "not_found" };
  }

  if (detail.match.status !== "settled") {
    return { ok: false, reason: "not_ready" };
  }

  return {
    ok: true,
    bill: buildSettlementBill(detail)
  };
}

export function getSettlementBill(matchId: string): SettlementResolution {
  return resolveSettlementBill(getMatchDetail(matchId));
}

export function getSettlementStatus(matchId: string): SettlementStatus | null {
  const detail = getMatchDetail(matchId);
  if (!detail) {
    return null;
  }

  const updatedAt = detail.match.endedAt ?? detail.match.startedAt ?? detail.match.publishedAt ?? detail.match.createdAt;
  if (detail.match.status === "settled") {
    return {
      matchId,
      status: "succeeded",
      progress: 100,
      payoutTxDigest: getPayoutTraceDigest(detail),
      updatedAt
    };
  }

  if (detail.match.status === "settling") {
    return {
      matchId,
      status: "running",
      progress: 75,
      payoutTxDigest: null,
      updatedAt
    };
  }

  return {
    matchId,
    status: "pending",
    progress: 0,
    payoutTxDigest: null,
    updatedAt
  };
}
