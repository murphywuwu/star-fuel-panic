import type { ChainFuelEvent, FilterRejectReason, MatchWindow, ScoreEvent, ScoreRejectAuditLog } from "../types/fuelMission";
import type { FuelGradeInfo, FuelGrade } from "@/types/fuelGrade";
import type { ChallengeMode, PrimaryFuelGrade } from "@/types/match";
import { resolveFuelGradeInfo } from "@/utils/fuelGrade";

export const PRIMARY_GRADE_MULTIPLIER = 2.0;
export const ALL_GRADES_BONUS = 1.2;

export interface ChainSyncContext {
  matchId: string;
  whitelist: Set<string>;
  targetAssemblies: Set<string>;
  window: MatchWindow;
  memberTeamMap: Map<string, string>;
  resolveFuelGradeInfo?: (fuelTypeId: number, event: ChainFuelEvent) => FuelGradeInfo;
  challengeMode?: ChallengeMode;
  primaryFuelGrade?: PrimaryFuelGrade;
}

export interface ChainSyncTables {
  scoreEvents: ScoreEvent[];
  auditLogs: ScoreRejectAuditLog[];
  txIndexByMatch: Map<string, Set<string>>;
  gradeCollectionByMatch: Map<string, Map<string, Set<FuelGrade>>>;
}

export type ChainSyncResult =
  | { accepted: true; scoreEvent: ScoreEvent }
  | { accepted: false; audit: ScoreRejectAuditLog };

function now() {
  return Date.now();
}

function mkId(prefix: string) {
  return `${prefix}_${now()}_${Math.floor(Math.random() * 10_000)}`;
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

function computePrimaryGradeMultiplier(
  context: ChainSyncContext,
  fuelGrade: FuelGrade
): number {
  if (context.challengeMode !== "fuel_grade_challenge") {
    return 1.0;
  }
  if (!context.primaryFuelGrade) {
    return 1.0;
  }
  return fuelGrade === context.primaryFuelGrade ? PRIMARY_GRADE_MULTIPLIER : 1.0;
}

function getTxIndex(tables: ChainSyncTables, matchId: string) {
  const existing = tables.txIndexByMatch.get(matchId);
  if (existing) {
    return existing;
  }

  const next = new Set<string>();
  tables.txIndexByMatch.set(matchId, next);
  return next;
}

function appendRejectAudit(
  tables: ChainSyncTables,
  context: ChainSyncContext,
  event: ChainFuelEvent,
  reason: FilterRejectReason
) {
  const audit: ScoreRejectAuditLog = {
    id: mkId("audit"),
    matchId: context.matchId,
    txDigest: event.txDigest,
    senderWallet: event.senderWallet,
    assemblyId: event.assemblyId,
    reason,
    chainTs: event.chainTs,
    createdAt: now()
  };

  tables.auditLogs.push(audit);
  return audit;
}

export function createChainSyncTables(): ChainSyncTables {
  return {
    scoreEvents: [],
    auditLogs: [],
    txIndexByMatch: new Map(),
    gradeCollectionByMatch: new Map()
  };
}

export function clearChainSyncTables(tables: ChainSyncTables, matchId?: string) {
  if (!matchId) {
    tables.scoreEvents.splice(0, tables.scoreEvents.length);
    tables.auditLogs.splice(0, tables.auditLogs.length);
    tables.txIndexByMatch.clear();
    tables.gradeCollectionByMatch.clear();
    return;
  }

  const remainingScoreEvents = tables.scoreEvents.filter((row) => row.matchId !== matchId);
  const remainingAudits = tables.auditLogs.filter((row) => row.matchId !== matchId);

  tables.scoreEvents.splice(0, tables.scoreEvents.length, ...remainingScoreEvents);
  tables.auditLogs.splice(0, tables.auditLogs.length, ...remainingAudits);
  tables.txIndexByMatch.delete(matchId);
  tables.gradeCollectionByMatch.delete(matchId);
}

export function listScoreEventsForMatch(tables: ChainSyncTables, matchId: string) {
  return tables.scoreEvents
    .filter((row) => row.matchId === matchId)
    .sort((a, b) => b.chainTs - a.chainTs);
}

export function listRejectAuditsForMatch(tables: ChainSyncTables, matchId: string) {
  return tables.auditLogs
    .filter((row) => row.matchId === matchId)
    .sort((a, b) => b.chainTs - a.chainTs);
}

export function processFuelEvent(
  tables: ChainSyncTables,
  context: ChainSyncContext,
  event: ChainFuelEvent
): ChainSyncResult {
  if (!context.whitelist.has(event.senderWallet)) {
    return {
      accepted: false,
      audit: appendRejectAudit(tables, context, event, "NOT_IN_MATCH_WHITELIST")
    };
  }

  if (!context.targetAssemblies.has(event.assemblyId)) {
    return {
      accepted: false,
      audit: appendRejectAudit(tables, context, event, "TARGET_NODE_MISMATCH")
    };
  }

  if (event.chainTs < context.window.startTs || event.chainTs > context.window.endTs) {
    return {
      accepted: false,
      audit: appendRejectAudit(tables, context, event, "EVENT_OUTSIDE_MATCH_WINDOW")
    };
  }

  const txIndex = getTxIndex(tables, context.matchId);
  if (txIndex.has(event.txDigest)) {
    return {
      accepted: false,
      audit: appendRejectAudit(tables, context, event, "DUPLICATE_EVENT_ID")
    };
  }

  const fuelDelta = event.newQuantity - event.oldQuantity;
  if (fuelDelta <= 0) {
    return {
      accepted: false,
      audit: appendRejectAudit(tables, context, event, "INVALID_FUEL_DELTA")
    };
  }

  const fillRatioAt = Math.max(0, Math.min(1, event.oldQuantity / Math.max(1, event.maxCapacity)));
  const urgencyWeight = computeUrgencyWeight(fillRatioAt);
  const panicMultiplier = event.chainTs >= context.window.panicTs ? 1.5 : 1.0;
  const fuelGrade =
    context.resolveFuelGradeInfo?.(event.fuelTypeId, event) ??
    resolveFuelGradeInfo(event.fuelTypeId, event.fuelEfficiency);
  const fuelGradeBonus = fuelGrade.bonus;
  const primaryGradeMultiplier = computePrimaryGradeMultiplier(context, fuelGrade.grade);
  const score = Number((fuelDelta * urgencyWeight * panicMultiplier * fuelGradeBonus * primaryGradeMultiplier).toFixed(2));
  const teamId = context.memberTeamMap.get(event.senderWallet) ?? "unknown-team";

  const scoreEvent: ScoreEvent = {
    id: mkId("score"),
    matchId: context.matchId,
    teamId,
    memberWallet: event.senderWallet,
    memberName: event.playerName,
    txDigest: event.txDigest,
    assemblyId: event.assemblyId,
    oldQuantity: event.oldQuantity,
    newQuantity: event.newQuantity,
    maxCapacity: event.maxCapacity,
    fuelDelta,
    fuelTypeId: event.fuelTypeId,
    fuelGrade,
    fillRatioAt: Number(fillRatioAt.toFixed(4)),
    urgencyWeight,
    panicMultiplier,
    fuelGradeBonus,
    primaryGradeMultiplier,
    score,
    chainTs: event.chainTs,
    createdAt: now()
  };

  tables.scoreEvents.push(scoreEvent);
  txIndex.add(event.txDigest);

  // Track grade collection for fuel grade challenge mode
  if (context.challengeMode === "fuel_grade_challenge") {
    trackGradeCollection(tables, context.matchId, event.senderWallet, fuelGrade.grade);
  }

  return {
    accepted: true,
    scoreEvent
  };
}

function getGradeCollectionMap(tables: ChainSyncTables, matchId: string) {
  const existing = tables.gradeCollectionByMatch.get(matchId);
  if (existing) {
    return existing;
  }
  const next = new Map<string, Set<FuelGrade>>();
  tables.gradeCollectionByMatch.set(matchId, next);
  return next;
}

function trackGradeCollection(
  tables: ChainSyncTables,
  matchId: string,
  memberWallet: string,
  grade: FuelGrade
) {
  const matchGrades = getGradeCollectionMap(tables, matchId);
  const playerGrades = matchGrades.get(memberWallet);
  if (playerGrades) {
    playerGrades.add(grade);
  } else {
    matchGrades.set(memberWallet, new Set([grade]));
  }
}

export function getPlayerGradeCollection(
  tables: ChainSyncTables,
  matchId: string,
  memberWallet: string
): { collectedGrades: FuelGrade[]; hasAllGrades: boolean } {
  const matchGrades = tables.gradeCollectionByMatch.get(matchId);
  if (!matchGrades) {
    return { collectedGrades: [], hasAllGrades: false };
  }
  const playerGrades = matchGrades.get(memberWallet);
  if (!playerGrades) {
    return { collectedGrades: [], hasAllGrades: false };
  }
  const collectedGrades = Array.from(playerGrades);
  const hasAllGrades = playerGrades.has("standard") && playerGrades.has("premium") && playerGrades.has("refined");
  return { collectedGrades, hasAllGrades };
}

export function getAllPlayerGradeCollections(
  tables: ChainSyncTables,
  matchId: string
): Map<string, { collectedGrades: FuelGrade[]; hasAllGrades: boolean }> {
  const result = new Map<string, { collectedGrades: FuelGrade[]; hasAllGrades: boolean }>();
  const matchGrades = tables.gradeCollectionByMatch.get(matchId);
  if (!matchGrades) {
    return result;
  }
  for (const [wallet, grades] of matchGrades) {
    const collectedGrades = Array.from(grades);
    const hasAllGrades = grades.has("standard") && grades.has("premium") && grades.has("refined");
    result.set(wallet, { collectedGrades, hasAllGrades });
  }
  return result;
}
