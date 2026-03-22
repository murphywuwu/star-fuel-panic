import { fuelMissionStore } from "@/model/fuelMissionStore";
import { scoreStore } from "@/model/scoreStore";
import {
  clearChainSyncTables,
  createChainSyncTables,
  listScoreEventsForMatch,
  processFuelEvent,
  type ChainSyncContext,
  type ChainSyncTables
} from "@/service/chainSyncEngine";
import { missionEventGateway } from "@/service/missionEventGateway";
import { scoringService } from "@/service/scoringService";
import type {
  AlertSeverity,
  AuditLog,
  FilterRejectReason,
  MatchWindow,
  MissionPhase,
  ScoreBoard,
  ScoreEvent,
  ScoreRejectAuditLog
} from "@/types/fuelMission";

const POLL_INTERVAL_MS = 2000;

interface MatchStreamCallbacks {
  onStatusChange: (status: MissionPhase) => void;
  onScoreUpdate: (board: ScoreBoard) => void;
  onScoreEvent: (event: ScoreEvent) => void;
  onPanicMode: () => void;
  onSettlementStart: () => void;
  onFilterRejected?: (audit: ScoreRejectAuditLog) => void;
}

interface MatchChannel {
  callbacks: Set<MatchStreamCallbacks>;
  timer: ReturnType<typeof setInterval> | null;
  lastStatus: MissionPhase | null;
}

const chainSyncTables: ChainSyncTables = createChainSyncTables();
const channels = new Map<string, MatchChannel>();

function mkId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
}

const FILTER_REJECTION_SEVERITY: Partial<Record<FilterRejectReason, AlertSeverity>> = {
  NOT_IN_MATCH_WHITELIST: "warning",
  TARGET_NODE_MISMATCH: "warning",
  EVENT_OUTSIDE_MATCH_WINDOW: "warning",
  DUPLICATE_EVENT_ID: "info",
  INVALID_EVENT_PAYLOAD: "critical",
  INVALID_PHASE: "warning",
  INVALID_FUEL_DELTA: "critical"
};

function toAuditLog(rejectAudit: ScoreRejectAuditLog): AuditLog {
  const severity = FILTER_REJECTION_SEVERITY[rejectAudit.reason] ?? "warning";
  return {
    id: mkId("audit"),
    action: "filter_rejected",
    detail: `reason=${rejectAudit.reason};tx=${rejectAudit.txDigest};wallet=${rejectAudit.senderWallet};node=${rejectAudit.assemblyId}`,
    timestamp: Date.now(),
    eventType: "filter_rejected",
    reasonCode: rejectAudit.reason,
    severity
  };
}

function resolveWindow(state: ReturnType<typeof fuelMissionStore.getState>): MatchWindow | null {
  if (state.matchWindowStartMs == null || state.matchWindowEndMs == null) {
    return null;
  }

  return {
    startTs: state.matchWindowStartMs,
    endTs: state.matchWindowEndMs,
    panicTs: Math.max(state.matchWindowStartMs, state.matchWindowEndMs - 90_000)
  };
}

function buildChainSyncContext(matchId: string): ChainSyncContext | null {
  const state = fuelMissionStore.getState();
  const window = resolveWindow(state);
  if (!window) {
    return null;
  }

  const whitelist = new Set<string>();
  const memberTeamMap = new Map<string, string>();

  for (const team of state.teams) {
    for (const player of team.players) {
      whitelist.add(player.playerId);
      memberTeamMap.set(player.playerId, team.teamId);
    }
  }

  return {
    matchId,
    whitelist,
    targetAssemblies: new Set(state.nodes.map((node) => node.nodeId)),
    window,
    memberTeamMap
  };
}

function broadcastStatus(channel: MatchChannel, status: MissionPhase) {
  for (const callback of channel.callbacks) {
    callback.onStatusChange(status);
  }
}

function broadcastPanic(channel: MatchChannel) {
  for (const callback of channel.callbacks) {
    callback.onPanicMode();
  }
}

function broadcastSettlementStart(channel: MatchChannel) {
  for (const callback of channel.callbacks) {
    callback.onSettlementStart();
  }
}

function broadcastScoreUpdate(channel: MatchChannel, board: ScoreBoard) {
  for (const callback of channel.callbacks) {
    callback.onScoreUpdate(board);
  }
}

function broadcastScoreEvent(channel: MatchChannel, event: ScoreEvent) {
  const startedAt = Date.now();
  for (const callback of channel.callbacks) {
    callback.onScoreEvent(event);
  }
  fuelMissionStore.getState().addWsLatencySample(Math.max(0, Date.now() - startedAt));
}

function broadcastFilterRejected(channel: MatchChannel, audit: ScoreRejectAuditLog) {
  for (const callback of channel.callbacks) {
    callback.onFilterRejected?.(audit);
  }
}

function applyAcceptedScoreEvent(scoreEvent: ScoreEvent) {
  const state = fuelMissionStore.getState();
  const fillDelta = scoreEvent.fuelDelta / Math.max(1, scoreEvent.maxCapacity);

  state.updateNodeFill(scoreEvent.assemblyId, fillDelta);
  state.addContribution(scoreEvent.memberWallet, scoreEvent.memberName, scoreEvent.score);
  state.addTeamScore(scoreEvent.teamId, scoreEvent.score);
  state.addEventLagSample(Math.max(0, Date.now() - scoreEvent.chainTs));
  state.addAuditLog({
    id: mkId("audit"),
    action: "score_event",
    detail: `tx=${scoreEvent.txDigest};wallet=${scoreEvent.memberWallet};score=${scoreEvent.score.toFixed(2)}`,
    timestamp: Date.now()
  });
}

function rebuildScoreBoard(matchId: string) {
  const events = listScoreEventsForMatch(chainSyncTables, matchId);
  return scoringService.buildScoreBoard(matchId, fuelMissionStore.getState().teams, events);
}

function pollMatch(matchId: string, channel: MatchChannel) {
  const state = fuelMissionStore.getState();
  const currentStatus = state.phase;

  if (channel.lastStatus !== currentStatus) {
    channel.lastStatus = currentStatus;
    broadcastStatus(channel, currentStatus);

    if (currentStatus === "panic") {
      broadcastPanic(channel);
    }
    if (currentStatus === "settling") {
      broadcastSettlementStart(channel);
    }
  }

  const context = buildChainSyncContext(matchId);
  if (!context) {
    return;
  }

  const events = missionEventGateway.pollFuelEvents(matchId);
  if (events.length === 0) {
    return;
  }

  let hasAcceptedEvent = false;

  for (const event of events) {
    const result = processFuelEvent(chainSyncTables, context, event);
    if (result.accepted) {
      hasAcceptedEvent = true;
      applyAcceptedScoreEvent(result.scoreEvent);
      broadcastScoreEvent(channel, result.scoreEvent);
      continue;
    }

    const auditLog = toAuditLog(result.audit);
    fuelMissionStore.getState().addAuditLog(auditLog);
    fuelMissionStore.getState().addRiskMarker({
      id: mkId("risk"),
      reason: `filter rejected: ${result.audit.reason}`,
      severity: auditLog.severity === "critical" ? "high" : "medium",
      createdAt: Date.now()
    });
    broadcastFilterRejected(channel, result.audit);
  }

  if (hasAcceptedEvent) {
    const board = rebuildScoreBoard(matchId);
    broadcastScoreUpdate(channel, board);
  }
}

function ensureChannel(matchId: string) {
  const existing = channels.get(matchId);
  if (existing) {
    return existing;
  }

  const next: MatchChannel = {
    callbacks: new Set(),
    timer: null,
    lastStatus: null
  };
  channels.set(matchId, next);
  return next;
}

export const matchService = {
  subscribeMatchStream(matchId: string, callbacks: MatchStreamCallbacks) {
    const channel = ensureChannel(matchId);
    channel.callbacks.add(callbacks);

    if (!channel.timer) {
      channel.timer = setInterval(() => pollMatch(matchId, channel), POLL_INTERVAL_MS);
    }

    const scoreBoard = rebuildScoreBoard(matchId);
    callbacks.onStatusChange(fuelMissionStore.getState().phase);
    callbacks.onScoreUpdate(scoreBoard);

    for (const event of listScoreEventsForMatch(chainSyncTables, matchId).slice(0, 10).reverse()) {
      callbacks.onScoreEvent(event);
    }

    pollMatch(matchId, channel);

    return () => {
      const target = channels.get(matchId);
      if (!target) {
        return;
      }

      target.callbacks.delete(callbacks);
      if (target.callbacks.size === 0) {
        if (target.timer) {
          clearInterval(target.timer);
        }
        channels.delete(matchId);
      }
    };
  },

  unsubscribeMatchStream(matchId: string) {
    const channel = channels.get(matchId);
    if (!channel) {
      return;
    }

    if (channel.timer) {
      clearInterval(channel.timer);
    }
    channels.delete(matchId);
  },

  resetMatchData(matchId: string) {
    clearChainSyncTables(chainSyncTables, matchId);
    scoreStore.getState().resetAll();
    missionEventGateway.clearFuelEvents(matchId);
  }
};
