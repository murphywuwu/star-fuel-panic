import { appendPersistedFuelEvents, appendPersistedMatchStreamEvents, type PersistedFuelEvent } from "@/server/runtimeProjectionStore";
import { getFuelGradeInfo, refreshFuelConfigCache } from "@/server/fuelConfigRuntime";
import { __setMatchDetailForTests, getMatchDetail, getMatchScoreboardSnapshot, type MatchDetail } from "@/server/matchRuntime";
import { resolveFuelGradeInfo } from "@/utils/fuelGrade";
import type { FuelDepositEvent, MatchStatus } from "@/types/match";

export type SimulatedFuelDepositInput = {
  matchId: string;
  walletAddress: string;
  assemblyId: string;
  fuelAdded: number;
  fuelTypeId: number;
  oldQuantity: number;
  maxCapacity: number;
  fuelEfficiency?: number | null;
  forcePanic?: boolean;
  timestamp?: string | number | null;
  nodeName?: string | null;
};

type SimulationResult =
  | {
      ok: true;
      scoreDelta: number;
      fuelDeposit: FuelDepositEvent;
      matchStatus: MatchStatus;
      teamId: string;
      memberWallet: string;
    }
  | {
      ok: false;
      code: "INVALID_INPUT" | "NOT_FOUND" | "CONFLICT";
      message: string;
    };

function nowIso() {
  return new Date().toISOString();
}

function nowMs() {
  return Date.now();
}

function normalizeWallet(walletAddress: string) {
  return walletAddress.trim().toLowerCase();
}

function computeUrgencyWeight(fillRatioAt: number) {
  if (fillRatioAt < 0.2) {
    return 3.0;
  }
  if (fillRatioAt < 0.5) {
    return 1.5;
  }
  return 1.0;
}

function pickLiveStatus(status: MatchStatus, forcePanic: boolean | undefined): MatchStatus {
  if (forcePanic) {
    return "panic";
  }

  if (status === "draft" || status === "lobby" || status === "prestart") {
    return "running";
  }

  return status;
}

function sortAndRankTeams(detail: MatchDetail) {
  const totalsByTeamId = new Map<string, number>();
  for (const score of detail.scores ?? []) {
    totalsByTeamId.set(score.teamId, (totalsByTeamId.get(score.teamId) ?? 0) + score.totalScore);
  }

  const nextTeams = detail.teams.map((team) => ({
    ...team,
    totalScore: totalsByTeamId.get(team.id) ?? 0
  }));

  const ranked = [...nextTeams].sort((left, right) => right.totalScore - left.totalScore);
  const rankByTeamId = new Map(ranked.map((team, index) => [team.id, index + 1]));

  return nextTeams.map((team) => ({
    ...team,
    rank: rankByTeamId.get(team.id) ?? null
  }));
}

function buildFuelDepositEvent(input: {
  matchId: string;
  teamId: string;
  walletAddress: string;
  assemblyId: string;
  nodeName: string;
  fuelAdded: number;
  fuelTypeId: number;
  fuelGrade: ReturnType<typeof resolveFuelGradeInfo>;
  urgencyWeight: number;
  panicMultiplier: number;
  scoreDelta: number;
  timestamp: string;
  txDigest: string;
}): FuelDepositEvent {
  return {
    txDigest: input.txDigest,
    sender: input.walletAddress,
    teamId: input.teamId,
    nodeId: input.assemblyId,
    nodeName: input.nodeName,
    fuelAdded: input.fuelAdded,
    fuelTypeId: input.fuelTypeId,
    fuelGrade: input.fuelGrade,
    urgencyWeight: input.urgencyWeight,
    panicMultiplier: input.panicMultiplier,
    scoreDelta: input.scoreDelta,
    timestamp: input.timestamp
  };
}

function toPersistedFuelEvent(matchId: string, fuelDeposit: FuelDepositEvent): PersistedFuelEvent {
  return {
    matchId,
    eventId: `${fuelDeposit.txDigest}:0`,
    txDigest: fuelDeposit.txDigest,
    senderWallet: fuelDeposit.sender,
    teamId: fuelDeposit.teamId,
    assemblyId: fuelDeposit.nodeId,
    fuelAdded: fuelDeposit.fuelAdded,
    fuelTypeId: fuelDeposit.fuelTypeId,
    fuelGrade: fuelDeposit.fuelGrade.grade,
    fuelGradeBonus: fuelDeposit.fuelGrade.bonus,
    urgencyWeight: fuelDeposit.urgencyWeight,
    panicMultiplier: fuelDeposit.panicMultiplier,
    scoreDelta: fuelDeposit.scoreDelta,
    chainTs: Date.parse(fuelDeposit.timestamp) || nowMs(),
    createdAt: fuelDeposit.timestamp
  };
}

export async function injectSimulatedFuelDeposit(input: SimulatedFuelDepositInput): Promise<SimulationResult> {
  const matchId = input.matchId.trim();
  const walletAddress = normalizeWallet(input.walletAddress);
  const assemblyId = input.assemblyId.trim();
  const fuelAdded = Math.max(0, Math.floor(input.fuelAdded));
  const fuelTypeId = Math.floor(input.fuelTypeId);
  const oldQuantity = Math.max(0, Math.floor(input.oldQuantity));
  const maxCapacity = Math.max(1, Math.floor(input.maxCapacity));

  if (!matchId || !walletAddress || !assemblyId || fuelAdded <= 0 || !Number.isFinite(fuelTypeId)) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Simulated fuel payload is invalid"
    };
  }

  const detail = getMatchDetail(matchId);
  if (!detail) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "Match not found"
    };
  }

  if (detail.match.status === "settling" || detail.match.status === "settled") {
    return {
      ok: false,
      code: "CONFLICT",
      message: "Cannot inject live fuel into a settled match"
    };
  }

  const member = detail.members.find((candidate) => normalizeWallet(candidate.walletAddress) === walletAddress);
  if (!member) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "Wallet is not a registered match member"
    };
  }

  const nextStatus = pickLiveStatus(detail.match.status, input.forcePanic);
  const timestamp =
    typeof input.timestamp === "string"
      ? input.timestamp
      : typeof input.timestamp === "number"
        ? new Date(input.timestamp).toISOString()
        : nowIso();

  if (input.fuelEfficiency == null) {
    await refreshFuelConfigCache();
  }

  const fuelGrade =
    input.fuelEfficiency != null
      ? resolveFuelGradeInfo(fuelTypeId, input.fuelEfficiency)
      : getFuelGradeInfo(fuelTypeId);
  const fillRatioAt = Math.max(0, Math.min(1, oldQuantity / maxCapacity));
  const urgencyWeight = computeUrgencyWeight(fillRatioAt);
  const panicMultiplier = nextStatus === "panic" ? 1.5 : 1.0;
  const scoreDelta = Number((fuelAdded * urgencyWeight * panicMultiplier * fuelGrade.bonus).toFixed(2));
  const txDigest = `sim_${matchId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const nextScores = [...(detail.scores ?? [])];
  const scoreIndex = nextScores.findIndex(
    (score) => score.matchId === matchId && score.teamId === member.teamId && normalizeWallet(score.walletAddress) === walletAddress
  );
  if (scoreIndex >= 0) {
    nextScores[scoreIndex] = {
      ...nextScores[scoreIndex],
      totalScore: nextScores[scoreIndex].totalScore + scoreDelta,
      fuelDeposited: nextScores[scoreIndex].fuelDeposited + fuelAdded,
      updatedAt: timestamp
    };
  } else {
    nextScores.push({
      matchId,
      teamId: member.teamId,
      walletAddress,
      totalScore: scoreDelta,
      fuelDeposited: fuelAdded,
      updatedAt: timestamp
    });
  }

  const nextMembers = detail.members.map((candidate) =>
    normalizeWallet(candidate.walletAddress) === walletAddress
      ? {
          ...candidate,
          personalScore: candidate.personalScore + scoreDelta
        }
      : candidate
  );

  const nextDetail: MatchDetail = {
    ...detail,
    match: {
      ...detail.match,
      status: nextStatus,
      startedAt: detail.match.startedAt ?? timestamp,
      endedAt: null
    },
    members: nextMembers,
    scores: nextScores
  };
  nextDetail.teams = sortAndRankTeams(nextDetail);

  __setMatchDetailForTests(nextDetail);

  const fuelDeposit = buildFuelDepositEvent({
    matchId,
    teamId: member.teamId,
    walletAddress,
    assemblyId,
    nodeName: input.nodeName?.trim() || `Node ${assemblyId.slice(0, 8)}`,
    fuelAdded,
    fuelTypeId,
    fuelGrade,
    urgencyWeight,
    panicMultiplier,
    scoreDelta,
    timestamp,
    txDigest
  });
  appendPersistedFuelEvents([toPersistedFuelEvent(matchId, fuelDeposit)]);

  const scoreboard = await getMatchScoreboardSnapshot(matchId);
  if (scoreboard) {
    appendPersistedMatchStreamEvents([
      {
        matchId,
        eventType: "score_update",
        payload: {
          type: "score_update",
          matchId,
          scoreboard,
          fuelDeposit
        },
        createdAt: timestamp
      }
    ]);
  }

  return {
    ok: true,
    scoreDelta,
    fuelDeposit,
    matchStatus: nextStatus,
    teamId: member.teamId,
    memberWallet: walletAddress
  };
}
