import { matchRuntimeStore } from "@/model/matchRuntimeStore";
import { scoreStore } from "@/model/scoreStore";
import {
  clearChainSyncTables,
  createChainSyncTables,
  listScoreEventsForMatch,
  processFuelEvent,
  type ChainSyncContext,
  type ChainSyncTables
} from "@/service/chainSyncEngine";
import { matchEventGateway } from "@/service/matchEventGateway";
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
import type { MatchDiscoveryDetail, MatchDiscoveryItem, MatchStatus } from "@/types/match";

const POLL_INTERVAL_MS = 1000;

async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as
    | T
    | {
        ok?: false;
        error?: {
          message?: string;
        };
      };

  if (!response.ok || (typeof payload === "object" && payload !== null && "ok" in payload && payload.ok === false)) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload ? payload.error?.message ?? "Request failed" : "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

interface MatchStreamCallbacks {
  onStatusChange: (status: MissionPhase) => void;
  onRemainingChange?: (remainingSec: number) => void;
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
  lastRemainingSec: number | null;
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

/**
 * MatchService - 比赛流订阅服务
 *
 * 职责：
 * - 管理比赛实时状态订阅
 * - 处理链上事件归因和计分
 * - 广播得分更新和状态变化
 */
class MatchServiceImpl {
  subscribeMatchRuntime = (listener: () => void): (() => void) => {
    return matchRuntimeStore.subscribe(listener);
  };

  getMatchRuntimeSnapshot = () => {
    return matchRuntimeStore.getState();
  };

  subscribeScore = (listener: () => void): (() => void) => {
    return scoreStore.subscribe(listener);
  };

  getScoreSnapshot = () => {
    return scoreStore.getState();
  };

  // ============ Private Fields ============
  private readonly chainSyncTables: ChainSyncTables = createChainSyncTables();
  private readonly channels = new Map<string, MatchChannel>();

  // ============ Public Methods ============

  /**
   * 订阅比赛事件流
   * @returns 取消订阅函数
   */
  subscribeMatchStream(matchId: string, callbacks: MatchStreamCallbacks): () => void {
    const channel = this.ensureChannel(matchId);
    channel.callbacks.add(callbacks);

    if (!channel.timer) {
      channel.timer = setInterval(() => this.pollMatch(matchId, channel), POLL_INTERVAL_MS);
    }

    const scoreBoard = this.rebuildScoreBoard(matchId);
    callbacks.onStatusChange(matchRuntimeStore.getState().phase);
    callbacks.onRemainingChange?.(matchRuntimeStore.getState().remainingSec);
    callbacks.onScoreUpdate(scoreBoard);

    for (const event of listScoreEventsForMatch(this.chainSyncTables, matchId).slice(0, 10).reverse()) {
      callbacks.onScoreEvent(event);
    }

    this.pollMatch(matchId, channel);

    return () => {
      const target = this.channels.get(matchId);
      if (!target) {
        return;
      }

      target.callbacks.delete(callbacks);
      if (target.callbacks.size === 0) {
        if (target.timer) {
          clearInterval(target.timer);
        }
        this.channels.delete(matchId);
      }
    };
  }

  /**
   * 取消订阅比赛事件流
   */
  unsubscribeMatchStream(matchId: string): void {
    const channel = this.channels.get(matchId);
    if (!channel) {
      return;
    }

    if (channel.timer) {
      clearInterval(channel.timer);
    }
    this.channels.delete(matchId);
  }

  /**
   * 重置比赛数据（用于清理本地缓存）
   */
  resetMatchData(matchId: string): void {
    clearChainSyncTables(this.chainSyncTables, matchId);
    scoreStore.getState().resetAll();
    matchEventGateway.clearFuelEvents(matchId);
  }

  async listLobbyMatches(input: {
    status?: MatchStatus;
    mode?: "all" | "free" | "precision";
    currentSystemId?: number | null;
    limit?: number;
  }): Promise<MatchDiscoveryItem[]> {
    const params = new URLSearchParams();

    if (input.status) {
      params.set("status", input.status);
    }
    if (input.mode && input.mode !== "all") {
      params.set("creationMode", input.mode);
    }
    if (typeof input.currentSystemId === "number" && input.currentSystemId > 0) {
      params.set("currentSystem", String(input.currentSystemId));
    }
    if (typeof input.limit === "number" && input.limit > 0) {
      params.set("limit", String(input.limit));
    }

    const payload = await parseJson<{ matches: MatchDiscoveryItem[] }>(
      await fetch(`/api/matches?${params.toString()}`, {
        cache: "no-store"
      })
    );

    return payload.matches;
  }

  async getLobbyMatchDetail(matchId: string, currentSystemId?: number | null): Promise<MatchDiscoveryDetail> {
    const params = new URLSearchParams();
    if (typeof currentSystemId === "number" && currentSystemId > 0) {
      params.set("currentSystem", String(currentSystemId));
    }

    const suffix = params.size > 0 ? `?${params.toString()}` : "";
    return parseJson<MatchDiscoveryDetail>(
      await fetch(`/api/matches/${encodeURIComponent(matchId)}${suffix}`, {
        cache: "no-store"
      })
    );
  }

  // ============ Private Methods ============

  private ensureChannel(matchId: string): MatchChannel {
    const existing = this.channels.get(matchId);
    if (existing) {
      return existing;
    }

    const next: MatchChannel = {
      callbacks: new Set(),
      timer: null,
      lastStatus: null,
      lastRemainingSec: null
    };
    this.channels.set(matchId, next);
    return next;
  }

  private pollMatch(matchId: string, channel: MatchChannel): void {
    const state = matchRuntimeStore.getState();
    const currentStatus = state.phase;
    const currentRemainingSec = state.remainingSec;

    if (channel.lastStatus !== currentStatus) {
      channel.lastStatus = currentStatus;
      this.broadcastStatus(channel, currentStatus);

      if (currentStatus === "panic") {
        this.broadcastPanic(channel);
      }
      if (currentStatus === "settling") {
        this.broadcastSettlementStart(channel);
      }
    }

    if (channel.lastRemainingSec !== currentRemainingSec) {
      channel.lastRemainingSec = currentRemainingSec;
      this.broadcastRemaining(channel, currentRemainingSec);
    }

    const context = this.buildChainSyncContext(matchId);
    if (!context) {
      return;
    }

    const events = matchEventGateway.pollFuelEvents(matchId);
    if (events.length === 0) {
      return;
    }

    let hasAcceptedEvent = false;

    for (const event of events) {
      const result = processFuelEvent(this.chainSyncTables, context, event);
      if (result.accepted) {
        hasAcceptedEvent = true;
        this.applyAcceptedScoreEvent(result.scoreEvent);
        this.broadcastScoreEvent(channel, result.scoreEvent);
        continue;
      }

      const auditLog = this.toAuditLog(result.audit);
      matchRuntimeStore.getState().addAuditLog(auditLog);
      matchRuntimeStore.getState().addRiskMarker({
        id: this.mkId("risk"),
        reason: `filter rejected: ${result.audit.reason}`,
        severity: auditLog.severity === "critical" ? "high" : "medium",
        createdAt: Date.now()
      });
      this.broadcastFilterRejected(channel, result.audit);
    }

    if (hasAcceptedEvent) {
      const board = this.rebuildScoreBoard(matchId);
      this.broadcastScoreUpdate(channel, board);
    }
  }

  private buildChainSyncContext(matchId: string): ChainSyncContext | null {
    const state = matchRuntimeStore.getState();
    const window = this.resolveWindow(state);
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

  private resolveWindow(state: ReturnType<typeof matchRuntimeStore.getState>): MatchWindow | null {
    if (state.matchWindowStartMs == null || state.matchWindowEndMs == null) {
      return null;
    }

    return {
      startTs: state.matchWindowStartMs,
      endTs: state.matchWindowEndMs,
      panicTs: Math.max(state.matchWindowStartMs, state.matchWindowEndMs - 90_000)
    };
  }

  private rebuildScoreBoard(matchId: string): ScoreBoard {
    const events = listScoreEventsForMatch(this.chainSyncTables, matchId);
    return scoringService.buildScoreBoard(matchId, matchRuntimeStore.getState().teams, events);
  }

  private applyAcceptedScoreEvent(scoreEvent: ScoreEvent): void {
    const state = matchRuntimeStore.getState();
    const fillDelta = scoreEvent.fuelDelta / Math.max(1, scoreEvent.maxCapacity);

    state.updateNodeFill(scoreEvent.assemblyId, fillDelta);
    state.addContribution(scoreEvent.memberWallet, scoreEvent.memberName, scoreEvent.score);
    state.addTeamScore(scoreEvent.teamId, scoreEvent.score);
    state.addEventLagSample(Math.max(0, Date.now() - scoreEvent.chainTs));
    state.addAuditLog({
      id: this.mkId("audit"),
      action: "score_event",
      detail: `tx=${scoreEvent.txDigest};wallet=${scoreEvent.memberWallet};score=${scoreEvent.score.toFixed(2)};fuelType=${scoreEvent.fuelTypeId};grade=${scoreEvent.fuelGrade.grade}`,
      timestamp: Date.now()
    });

    void this.persistAcceptedFuelEvent(scoreEvent);
  }

  private toAuditLog(rejectAudit: ScoreRejectAuditLog): AuditLog {
    const severity = FILTER_REJECTION_SEVERITY[rejectAudit.reason] ?? "warning";
    return {
      id: this.mkId("audit"),
      action: "filter_rejected",
      detail: `reason=${rejectAudit.reason};tx=${rejectAudit.txDigest};wallet=${rejectAudit.senderWallet};node=${rejectAudit.assemblyId}`,
      timestamp: Date.now(),
      eventType: "filter_rejected",
      reasonCode: rejectAudit.reason,
      severity
    };
  }

  // ============ Broadcast Methods ============

  private broadcastStatus(channel: MatchChannel, status: MissionPhase): void {
    for (const callback of channel.callbacks) {
      callback.onStatusChange(status);
    }
  }

  private broadcastRemaining(channel: MatchChannel, remainingSec: number): void {
    for (const callback of channel.callbacks) {
      callback.onRemainingChange?.(remainingSec);
    }
  }

  private broadcastPanic(channel: MatchChannel): void {
    for (const callback of channel.callbacks) {
      callback.onPanicMode();
    }
  }

  private broadcastSettlementStart(channel: MatchChannel): void {
    for (const callback of channel.callbacks) {
      callback.onSettlementStart();
    }
  }

  private broadcastScoreUpdate(channel: MatchChannel, board: ScoreBoard): void {
    for (const callback of channel.callbacks) {
      callback.onScoreUpdate(board);
    }
  }

  private broadcastScoreEvent(channel: MatchChannel, event: ScoreEvent): void {
    const startedAt = Date.now();
    for (const callback of channel.callbacks) {
      callback.onScoreEvent(event);
    }
    matchRuntimeStore.getState().addWsLatencySample(Math.max(0, Date.now() - startedAt));
  }

  private broadcastFilterRejected(channel: MatchChannel, audit: ScoreRejectAuditLog): void {
    for (const callback of channel.callbacks) {
      callback.onFilterRejected?.(audit);
    }
  }

  // ============ Utility Methods ============

  private mkId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
  }

  private async persistAcceptedFuelEvent(scoreEvent: ScoreEvent) {
    try {
      await fetch(`/api/matches/${encodeURIComponent(scoreEvent.matchId)}/fuel-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          scoreEvent
        })
      });
    } catch {
      // Keep live scoring independent from projection persistence.
    }
  }
}

// 导出单例实例
export const matchService = new MatchServiceImpl();

// 导出类型接口（用于依赖注入）
export type MatchService = MatchServiceImpl;
