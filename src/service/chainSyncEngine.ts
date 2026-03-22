import type { ChainFuelEvent, FilterRejectReason, MatchWindow, ScoreEvent, ScoreRejectAuditLog } from "../types/fuelMission";

export interface ChainSyncContext {
  matchId: string;
  whitelist: Set<string>;
  targetAssemblies: Set<string>;
  window: MatchWindow;
  memberTeamMap: Map<string, string>;
}

export interface ChainSyncTables {
  scoreEvents: ScoreEvent[];
  auditLogs: ScoreRejectAuditLog[];
  txIndexByMatch: Map<string, Set<string>>;
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
    txIndexByMatch: new Map()
  };
}

export function clearChainSyncTables(tables: ChainSyncTables, matchId?: string) {
  if (!matchId) {
    tables.scoreEvents.splice(0, tables.scoreEvents.length);
    tables.auditLogs.splice(0, tables.auditLogs.length);
    tables.txIndexByMatch.clear();
    return;
  }

  const remainingScoreEvents = tables.scoreEvents.filter((row) => row.matchId !== matchId);
  const remainingAudits = tables.auditLogs.filter((row) => row.matchId !== matchId);

  tables.scoreEvents.splice(0, tables.scoreEvents.length, ...remainingScoreEvents);
  tables.auditLogs.splice(0, tables.auditLogs.length, ...remainingAudits);
  tables.txIndexByMatch.delete(matchId);
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
  const score = Number((fuelDelta * urgencyWeight * panicMultiplier).toFixed(2));
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
    fillRatioAt: Number(fillRatioAt.toFixed(4)),
    urgencyWeight,
    panicMultiplier,
    score,
    chainTs: event.chainTs,
    createdAt: now()
  };

  tables.scoreEvents.push(scoreEvent);
  txIndex.add(event.txDigest);

  return {
    accepted: true,
    scoreEvent
  };
}
