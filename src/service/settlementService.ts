import { fuelMissionStore } from "@/model/fuelMissionStore";
import type { TeamRole } from "@/types/fuelMission";
import {
  getTeamPayoutRatios,
  type MemberPayout,
  type MvpInfo,
  type PlayerRole,
  type SettlementBill,
  type TeamPayout
} from "@/types/settlement";

const EDGE_BILL_ENDPOINTS = [
  "/functions/v1/get-settlement-bill",
  "/functions/v1/settlement-bill"
];

function round2(value: number) {
  return Number(value.toFixed(2));
}

function toPlayerRole(role: TeamRole | undefined): PlayerRole {
  if (role === "Collector") return "collector";
  if (role === "Hauler") return "hauler";
  if (role === "Escort") return "escort";
  return "dispatcher";
}

function hashText(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `local_${(hash >>> 0).toString(16)}`;
}

function allocateByRatio(total: number, ratios: number[], length: number): number[] {
  const payouts = new Array<number>(length).fill(0);
  const payoutIndexes: number[] = [];

  for (let index = 0; index < length; index += 1) {
    if ((ratios[index] ?? 0) > 0) {
      payoutIndexes.push(index);
    }
  }

  let allocated = 0;
  for (let i = 0; i < payoutIndexes.length; i += 1) {
    const index = payoutIndexes[i];
    const ratio = ratios[index] ?? 0;
    const isLast = i === payoutIndexes.length - 1;
    const amount = isLast ? round2(total - allocated) : round2(total * ratio);
    payouts[index] = Math.max(0, amount);
    allocated = round2(allocated + payouts[index]);
  }

  return payouts;
}

function buildMemberPayouts(
  teamPrize: number,
  members: Array<{ walletAddress: string; role: PlayerRole; personalScore: number }>
): MemberPayout[] {
  const totalScore = members.reduce((sum, member) => sum + member.personalScore, 0);
  if (totalScore <= 0) {
    return members.map((member) => ({
      walletAddress: member.walletAddress,
      role: member.role,
      personalScore: member.personalScore,
      contributionRatio: 0,
      prizeAmount: 0
    }));
  }

  const payouts: MemberPayout[] = [];
  let allocated = 0;

  for (let i = 0; i < members.length; i += 1) {
    const member = members[i];
    const contributionRatio = member.personalScore <= 0 ? 0 : member.personalScore / totalScore;
    const isLast = i === members.length - 1;
    const prizeAmount = member.personalScore <= 0
      ? 0
      : isLast
        ? round2(teamPrize - allocated)
        : round2(teamPrize * contributionRatio);

    const safePrizeAmount = Math.max(0, prizeAmount);

    payouts.push({
      walletAddress: member.walletAddress,
      role: member.role,
      personalScore: member.personalScore,
      contributionRatio: round2(contributionRatio),
      prizeAmount: safePrizeAmount
    });

    allocated = round2(allocated + safePrizeAmount);
  }

  return payouts;
}

function parseBillFromPayload(payload: unknown): SettlementBill | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const asObject = payload as Record<string, unknown>;
  const candidate = (asObject.bill ?? asObject) as Record<string, unknown>;

  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  if (typeof candidate.matchId !== "string") {
    return null;
  }

  if (!Array.isArray(candidate.teamBreakdown)) {
    return null;
  }

  return candidate as unknown as SettlementBill;
}

function buildLocalSettlementBill(matchId: string): SettlementBill {
  const state = fuelMissionStore.getState();
  const contributionMap = new Map(state.contributions.map((item) => [item.playerId, item.score]));
  const roleMapByTeam = state.teams.map((team) => {
    const roleMap = new Map<string, PlayerRole>();
    for (const [role, playerId] of Object.entries(team.roles)) {
      if (playerId) {
        roleMap.set(playerId, toPlayerRole(role as TeamRole));
      }
    }
    return { teamId: team.teamId, roleMap };
  });

  const playerBuyinPool = state.funding.playerCount * state.funding.entryFeeLux;
  const grossPool = round2(
    playerBuyinPool +
      state.funding.hostSeedPool +
      state.funding.platformSubsidyPool +
      state.funding.sponsorPool
  );
  const platformFee = round2((grossPool * state.funding.platformRakeBps) / 10_000);
  const payoutPool = round2(grossPool - platformFee);

  const teamMetrics = state.teams.map((team) => {
    const teamMemberScore = team.players.reduce(
      (sum, player) => sum + (contributionMap.get(player.playerId) ?? 0),
      0
    );
    const teamTotalScore = state.teamScore[team.teamId] ?? teamMemberScore;
    return {
      team,
      teamTotalScore: Math.max(teamTotalScore, teamMemberScore)
    };
  });

  const rankedTeams = [...teamMetrics].sort((a, b) => {
    if (b.teamTotalScore !== a.teamTotalScore) {
      return b.teamTotalScore - a.teamTotalScore;
    }
    return a.team.teamId.localeCompare(b.team.teamId);
  });

  const ratios = getTeamPayoutRatios(rankedTeams.length);
  const teamPrizeAmounts = allocateByRatio(payoutPool, ratios, rankedTeams.length);

  const teamBreakdown: TeamPayout[] = rankedTeams.map((item, index) => {
    const roleMap = roleMapByTeam.find((entry) => entry.teamId === item.team.teamId)?.roleMap;
    const memberPayload = item.team.players.map((player) => ({
      walletAddress: player.playerId,
      role: roleMap?.get(player.playerId) ?? "dispatcher",
      personalScore: contributionMap.get(player.playerId) ?? 0
    }));

    return {
      teamId: item.team.teamId,
      teamName: item.team.name,
      rank: index + 1,
      totalScore: item.teamTotalScore,
      prizeRatio: ratios[index] ?? 0,
      prizeAmount: teamPrizeAmounts[index] ?? 0,
      members: buildMemberPayouts(teamPrizeAmounts[index] ?? 0, memberPayload)
    };
  });

  const mvpCandidate = teamBreakdown
    .flatMap((team) => team.members.map((member) => ({ teamName: team.teamName, member })))
    .sort((a, b) => b.member.personalScore - a.member.personalScore)[0];

  const mvp: MvpInfo | null = mvpCandidate
    ? {
        walletAddress: mvpCandidate.member.walletAddress,
        role: mvpCandidate.member.role,
        totalScore: mvpCandidate.member.personalScore,
        teamName: mvpCandidate.teamName
      }
    : null;

  const resultHash = hashText(
    JSON.stringify({
      matchId,
      grossPool,
      platformFee,
      payoutPool,
      teamBreakdown
    })
  );

  return {
    matchId,
    grossPool,
    platformFee,
    payoutPool,
    resultHash,
    commitmentTx: null,
    settlementTx: state.settlement.settlementId ?? null,
    status: state.phase === "settled" ? "settled" : "pending",
    teamBreakdown,
    mvp
  };
}

async function tryFetchFromEdge(matchId: string): Promise<SettlementBill | null> {
  for (const endpoint of EDGE_BILL_ENDPOINTS) {
    const url = `${endpoint}?matchId=${encodeURIComponent(matchId)}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      if (!response.ok) {
        continue;
      }
      const data = (await response.json()) as unknown;
      const parsed = parseBillFromPayload(data);
      if (parsed) {
        return parsed;
      }
    } catch {
      continue;
    }
  }
  return null;
}

export const settlementService = {
  async fetchSettlementBill(matchId: string): Promise<SettlementBill> {
    const normalized = matchId.trim();
    if (!normalized) {
      throw new Error("INVALID_MATCH_ID");
    }

    const edgeBill = await tryFetchFromEdge(normalized);
    if (edgeBill) {
      return edgeBill;
    }

    return buildLocalSettlementBill(normalized);
  }
};
