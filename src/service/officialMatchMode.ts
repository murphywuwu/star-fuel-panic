export type OfficialMatchStatus = "lobby" | "prestart" | "running" | "panic" | "settling" | "settled";
export type MatchCreationMode = "free" | "precision";
export type TriggerMode = "dynamic" | "min_threshold";
export type ScoringMode = "weighted" | "volume";

export interface OfficialNodeSnapshot {
  id: string;
  name: string;
  fillRatio: number;
  isPublic: boolean;
}

export interface OfficialMatchConfig {
  entryFee: number;
  platformSubsidy: number;
  minTeams: number;
  maxTeams: number;
  durationMinutes: number;
}

export interface OfficialMatchRecord {
  id: string;
  status: OfficialMatchStatus;
  creationMode: MatchCreationMode;
  prizePool: number;
  entryFee: number;
  platformSubsidy: number;
  targetNodeIds: string[];
  scoringMode: ScoringMode;
  hostAddress: string | null;
  triggerNodeId: string;
  triggerNodeName: string;
  durationMinutes: number;
  minTeams: number;
  maxTeams: number;
  paidTeams: number;
  paidEntryFees: number;
}

export interface AutoCreateDecision {
  shouldCreate: boolean;
  reason:
    | "TRIGGERED"
    | "NODE_NOT_PUBLIC"
    | "FILL_RATIO_NOT_CRITICAL"
    | "LOBBY_MATCH_ALREADY_EXISTS";
}

export interface TriggerEvaluationInput {
  status: OfficialMatchStatus;
  minTeams: number;
  maxTeams: number;
  paidTeams: number;
  remainingRecruitmentSec?: number;
  singleTeamElapsedSec?: number;
  maxSingleTeamWaitSec?: number;
}

export interface TriggerEvaluationResult {
  nextStatus: OfficialMatchStatus;
  triggerMode: TriggerMode | null;
  countdownSec: number | null;
  allowJoinDuringCountdown: boolean;
  soloChallengeMode?: boolean;
}

export interface SoloChallengeResult {
  mode: "solo_challenge";
  targetFillRatio: number;
  success: boolean;
  payout: number;
  bonusSubsidyAwarded: number;
  entryFeeRefunded: boolean;
  reclaimedPlatformSubsidy: number;
}

export const OFFICIAL_MATCH_DEFAULTS: OfficialMatchConfig = {
  entryFee: 100,
  platformSubsidy: 200,
  minTeams: 2,
  maxTeams: 8,
  durationMinutes: 10
};

export const OFFICIAL_MATCH_CREATE_ERROR = "OFFICIAL_MATCH_CANNOT_BE_CREATED_MANUALLY";
export const OFFICIAL_MATCH_CANCEL_ERROR = "OFFICIAL_MATCH_CANNOT_BE_CANCELLED";

function clampNonNegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function computeOfficialPrizePool(input: { platformSubsidy: number; paidEntryFees: number }) {
  return clampNonNegative(input.platformSubsidy) + clampNonNegative(input.paidEntryFees);
}

export function filterOfficialFreeTargetMatches(matches: OfficialMatchRecord[]) {
  return matches.filter((match) => match.creationMode === "free");
}

export function buildOfficialFreeTargetMatch(
  triggerNode: OfficialNodeSnapshot,
  overrides: Partial<OfficialMatchConfig> = {}
): OfficialMatchRecord {
  const config = {
    ...OFFICIAL_MATCH_DEFAULTS,
    ...overrides
  };

  return {
    id: `official-${triggerNode.id}`,
    status: "lobby",
    creationMode: "free",
    prizePool: computeOfficialPrizePool({
      platformSubsidy: config.platformSubsidy,
      paidEntryFees: 0
    }),
    entryFee: config.entryFee,
    platformSubsidy: config.platformSubsidy,
    targetNodeIds: [],
    scoringMode: "weighted",
    hostAddress: null,
    triggerNodeId: triggerNode.id,
    triggerNodeName: triggerNode.name,
    durationMinutes: config.durationMinutes,
    minTeams: config.minTeams,
    maxTeams: config.maxTeams,
    paidTeams: 0,
    paidEntryFees: 0
  };
}

export function canAutoCreateOfficialMatch(input: {
  node: OfficialNodeSnapshot;
  existingMatches: OfficialMatchRecord[];
}): AutoCreateDecision {
  if (!input.node.isPublic) {
    return { shouldCreate: false, reason: "NODE_NOT_PUBLIC" };
  }

  if (input.node.fillRatio >= 0.2) {
    return { shouldCreate: false, reason: "FILL_RATIO_NOT_CRITICAL" };
  }

  const hasExistingLobby = input.existingMatches.some(
    (match) =>
      match.creationMode === "free" &&
      match.status === "lobby" &&
      match.triggerNodeId === input.node.id
  );

  if (hasExistingLobby) {
    return { shouldCreate: false, reason: "LOBBY_MATCH_ALREADY_EXISTS" };
  }

  return { shouldCreate: true, reason: "TRIGGERED" };
}

export function evaluateOfficialTrigger(input: TriggerEvaluationInput): TriggerEvaluationResult {
  if (input.status !== "lobby") {
    return {
      nextStatus: input.status,
      triggerMode: null,
      countdownSec: null,
      allowJoinDuringCountdown: false,
      soloChallengeMode: false
    };
  }

  if (input.paidTeams >= input.maxTeams) {
    return {
      nextStatus: "prestart",
      triggerMode: "dynamic",
      countdownSec: 30,
      allowJoinDuringCountdown: false,
      soloChallengeMode: false
    };
  }

  if (input.paidTeams >= input.minTeams) {
    const remainingRecruitmentSec = input.remainingRecruitmentSec ?? 180;
    if (remainingRecruitmentSec <= 0) {
      return {
        nextStatus: "prestart",
        triggerMode: "min_threshold",
        countdownSec: 30,
        allowJoinDuringCountdown: false,
        soloChallengeMode: false
      };
    }

    return {
      nextStatus: "lobby",
      triggerMode: "min_threshold",
      countdownSec: remainingRecruitmentSec,
      allowJoinDuringCountdown: true,
      soloChallengeMode: false
    };
  }

  if (input.paidTeams === 1) {
    const maxSingleTeamWaitSec = input.maxSingleTeamWaitSec ?? 300;
    const singleTeamElapsedSec = input.singleTeamElapsedSec ?? 0;
    const remainingSoloWaitSec = Math.max(0, maxSingleTeamWaitSec - singleTeamElapsedSec);

    if (remainingSoloWaitSec <= 0) {
      return {
        nextStatus: "prestart",
        triggerMode: "min_threshold",
        countdownSec: 30,
        allowJoinDuringCountdown: false,
        soloChallengeMode: true
      };
    }

    return {
      nextStatus: "lobby",
      triggerMode: null,
      countdownSec: remainingSoloWaitSec,
      allowJoinDuringCountdown: true,
      soloChallengeMode: false
    };
  }

  return {
    nextStatus: "lobby",
    triggerMode: null,
    countdownSec: null,
    allowJoinDuringCountdown: true,
    soloChallengeMode: false
  };
}

export function evaluateSoloChallenge(input: {
  finalFillRatio: number;
  prizePool: number;
  platformSubsidy: number;
}): SoloChallengeResult {
  const success = input.finalFillRatio >= 0.8;
  const bonusSubsidyAwarded = success ? clampNonNegative(input.platformSubsidy) * 0.1 : 0;

  return {
    mode: "solo_challenge",
    targetFillRatio: 0.8,
    success,
    payout: success ? clampNonNegative(input.prizePool) + bonusSubsidyAwarded : clampNonNegative(input.prizePool),
    bonusSubsidyAwarded,
    entryFeeRefunded: false,
    reclaimedPlatformSubsidy: success ? 0 : clampNonNegative(input.platformSubsidy)
  };
}

export function validateOfficialMatchManualCreate(creationMode: MatchCreationMode) {
  if (creationMode === "free") {
    return {
      ok: false,
      status: 400,
      errorCode: OFFICIAL_MATCH_CREATE_ERROR
    } as const;
  }

  return {
    ok: true,
    status: 200
  } as const;
}

export function validateOfficialMatchDeletion(match: Pick<OfficialMatchRecord, "creationMode" | "status">) {
  if (match.creationMode === "free") {
    return {
      ok: false,
      status: 403,
      errorCode: OFFICIAL_MATCH_CANCEL_ERROR
    } as const;
  }

  return {
    ok: true,
    status: 200
  } as const;
}
