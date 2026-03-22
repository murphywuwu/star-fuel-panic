// @ts-nocheck

const PAYOUT_RATIOS: Record<number, number[]> = {
  1: [1.0],
  2: [0.7, 0.3],
  3: [0.6, 0.3, 0.1]
};

function round2(value: number) {
  return Number(value.toFixed(2));
}

function normalizeRole(role?: string) {
  const value = (role ?? "").toLowerCase();
  if (value === "collector" || value === "hauler" || value === "escort" || value === "dispatcher") {
    return value;
  }
  return "dispatcher";
}

function getPayoutRatios(teamCount: number) {
  if (teamCount <= 0) return [];
  if (teamCount === 1) return PAYOUT_RATIOS[1];
  if (teamCount === 2) return PAYOUT_RATIOS[2];
  return PAYOUT_RATIOS[3];
}

function allocateByRatios(total: number, ratios: number[], length: number) {
  const payouts = new Array<number>(length).fill(0);
  const payoutIndexes: number[] = [];

  for (let index = 0; index < length; index += 1) {
    if ((ratios[index] ?? 0) > 0) {
      payoutIndexes.push(index);
    }
  }

  let allocated = 0;
  for (let i = 0; i < payoutIndexes.length; i += 1) {
    const targetIndex = payoutIndexes[i];
    const ratio = ratios[targetIndex] ?? 0;
    const isLast = i === payoutIndexes.length - 1;
    const amount = isLast ? round2(total - allocated) : round2(total * ratio);
    payouts[targetIndex] = Math.max(0, amount);
    allocated = round2(allocated + payouts[targetIndex]);
  }

  return payouts;
}

function buildMemberPayouts(teamPrizeAmount: number, members: Array<{ walletAddress: string; role?: string; personalScore: number }>) {
  const totalScore = members.reduce((sum, member) => sum + Number(member.personalScore ?? 0), 0);
  if (totalScore <= 0) {
    return members.map((member) => ({
      walletAddress: member.walletAddress,
      role: normalizeRole(member.role),
      personalScore: Number(member.personalScore ?? 0),
      contributionRatio: 0,
      prizeAmount: 0
    }));
  }

  let allocated = 0;
  return members.map((member, index) => {
    const personalScore = Number(member.personalScore ?? 0);
    const contributionRatio = personalScore <= 0 ? 0 : personalScore / totalScore;
    const isLast = index === members.length - 1;
    const rawPrize = personalScore <= 0
      ? 0
      : isLast
        ? round2(teamPrizeAmount - allocated)
        : round2(teamPrizeAmount * contributionRatio);
    const prizeAmount = Math.max(0, rawPrize);
    allocated = round2(allocated + prizeAmount);

    return {
      walletAddress: member.walletAddress,
      role: normalizeRole(member.role),
      personalScore,
      contributionRatio: round2(contributionRatio),
      prizeAmount
    };
  });
}

function rankTeams(teams) {
  return [...teams].sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return String(a.teamId).localeCompare(String(b.teamId));
  });
}

export function buildTeamBreakdown(teams, payoutPool: number) {
  const ranked = rankTeams(teams);
  const ratios = getPayoutRatios(ranked.length);
  const teamPayouts = allocateByRatios(payoutPool, ratios, ranked.length);

  return ranked.map((team, index) => {
    const prizeAmount = teamPayouts[index] ?? 0;
    const members = buildMemberPayouts(prizeAmount, team.members ?? []);

    return {
      teamId: team.teamId,
      teamName: team.teamName,
      rank: index + 1,
      totalScore: Number(team.totalScore ?? 0),
      prizeRatio: ratios[index] ?? 0,
      prizeAmount,
      members
    };
  });
}

export function deriveMvp(teamBreakdown) {
  const candidate = [...teamBreakdown]
    .flatMap((team) => (team.members ?? []).map((member) => ({ teamName: team.teamName, member })))
    .sort((a, b) => b.member.personalScore - a.member.personalScore)[0];

  if (!candidate) {
    return null;
  }

  return {
    walletAddress: candidate.member.walletAddress,
    role: candidate.member.role,
    totalScore: candidate.member.personalScore,
    teamName: candidate.teamName
  };
}

export async function sha256Hex(input: string) {
  const bytes = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  const digest = [...new Uint8Array(hash)].map((item) => item.toString(16).padStart(2, "0")).join("");
  return `0x${digest}`;
}

export async function buildSettlementBill(input: {
  matchId: string;
  grossPool: number;
  platformFee: number;
  payoutPool: number;
  status: "pending" | "committed" | "settled" | "failed";
  commitmentTx?: string | null;
  settlementTx?: string | null;
  teams: Array<{
    teamId: string;
    teamName: string;
    totalScore: number;
    members: Array<{ walletAddress: string; role?: string; personalScore: number }>;
  }>;
}) {
  const teamBreakdown = buildTeamBreakdown(input.teams, input.payoutPool);
  const mvp = deriveMvp(teamBreakdown);
  const payloadForHash = JSON.stringify({
    matchId: input.matchId,
    grossPool: input.grossPool,
    platformFee: input.platformFee,
    payoutPool: input.payoutPool,
    teamBreakdown
  });
  const resultHash = await sha256Hex(payloadForHash);

  return {
    matchId: input.matchId,
    grossPool: round2(input.grossPool),
    platformFee: round2(input.platformFee),
    payoutPool: round2(input.payoutPool),
    resultHash,
    commitmentTx: input.commitmentTx ?? null,
    settlementTx: input.settlementTx ?? null,
    status: input.status,
    teamBreakdown,
    mvp
  };
}

export function parseNumeric(value: unknown, fallback = 0) {
  const numberValue = typeof value === "string" ? Number(value) : Number(value ?? fallback);
  if (!Number.isFinite(numberValue)) {
    return fallback;
  }
  return numberValue;
}

export function roundPoolValues(grossPool: number, platformFeeBps: number) {
  const normalizedGross = round2(grossPool);
  const platformFee = round2((normalizedGross * platformFeeBps) / 10_000);
  const payoutPool = round2(normalizedGross - platformFee);
  return {
    grossPool: normalizedGross,
    platformFee,
    payoutPool
  };
}

export function mapTeamsWithMembers(rows: any[]) {
  return (rows ?? []).map((team) => ({
    teamId: team.id,
    teamName: team.team_name ?? `Team-${team.id?.slice?.(0, 6) ?? "UNK"}`,
    totalScore: parseNumeric(team.total_score, 0),
    members: (team.team_members ?? []).map((member) => ({
      walletAddress: member.wallet_address,
      role: member.role,
      personalScore: parseNumeric(member.personal_score, 0)
    }))
  }));
}
