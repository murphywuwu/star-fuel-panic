import {
  deriveCriticalNodes,
  deriveTopContributors,
  fuelMissionStore,
  selectIsTeamReady,
  selectTeamSlots,
  type FuelMissionStore
} from "@/model/fuelMissionStore";
import { authStore } from "@/model/authStore";
import { missionEventGateway } from "@/service/missionEventGateway";
import type {
  AlertSeverity,
  AnomalyDrillReport,
  AuditLog,
  ControllerResult,
  FilterRejectionReason,
  FuelMissionErrorCode,
  FundingSources,
  MatchStatus,
  MatchStreamCallbacks,
  NodeDeficitSnapshot,
  RecordSupplyEventInput,
  RescueCandidate,
  RiskMarker,
  RoomState,
  SettlementFailureAlert,
  SettlementFailureCode,
  TeamLifecycleStatus,
  TeamRole,
  TeamState,
  UrgencyActionTag,
  UrgencyFeedItem
} from "@/types/fuelMission";

const VALID_TRANSITIONS: Record<MatchStatus, MatchStatus[]> = {
  lobby: ["pre_start"],
  pre_start: ["running"],
  running: ["panic", "settling"],
  panic: ["settling"],
  settling: ["settled"],
  settled: []
};

const PRE_START_SEC = 30;
const RUNNING_SEC = 600;
const SETTLING_SEC = 15;
const PANIC_THRESHOLD_SEC = 90;

const URGENCY_WINDOW_SEC = 600;
const URGENCY_TREND_WINDOW_SEC = 30;
const URGENCY_HISTORY_CAP = 10;
const LOW_CONFIDENCE_THRESHOLD = 0.6;
const NODE_MAX_CAPACITY = 1_000;
const SIMULATED_FUEL_PROFILES = [
  { fuelTypeId: 11, fuelEfficiency: 25 },
  { fuelTypeId: 22, fuelEfficiency: 55 },
  { fuelTypeId: 33, fuelEfficiency: 85 }
] as const;

function selectSimulatedFuelProfile(seed: string) {
  const hash = [...seed].reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
  return SIMULATED_FUEL_PROFILES[hash % SIMULATED_FUEL_PROFILES.length] ?? SIMULATED_FUEL_PROFILES[0];
}

const FILTER_REJECTION_SEVERITY: Record<FilterRejectionReason, AlertSeverity> = {
  INVALID_PHASE: "warning",
  INVALID_EVENT_PAYLOAD: "critical",
  DUPLICATE_EVENT_ID: "info",
  NOT_IN_MATCH_WHITELIST: "warning",
  TARGET_NODE_MISMATCH: "warning",
  EVENT_OUTSIDE_MATCH_WINDOW: "warning",
  INVALID_FUEL_DELTA: "critical"
};

const SETTLEMENT_FAILURE_POLICY: Record<
  SettlementFailureCode,
  { severity: AlertSeverity; errorCode: FuelMissionErrorCode }
> = {
  SETTLEMENT_RPC_TIMEOUT: {
    severity: "critical",
    errorCode: "E_SETTLEMENT_RPC_TIMEOUT"
  },
  SETTLEMENT_TX_REJECTED: {
    severity: "critical",
    errorCode: "E_SETTLEMENT_TX_REJECTED"
  },
  SETTLEMENT_IDEMPOTENCY_CONFLICT: {
    severity: "warning",
    errorCode: "E_SETTLEMENT_IDEMPOTENCY_CONFLICT"
  },
  SETTLEMENT_INVALID_STATE: {
    severity: "warning",
    errorCode: "E_SETTLEMENT_INVALID_STATE"
  },
  SETTLEMENT_UNKNOWN: {
    severity: "critical",
    errorCode: "E_SETTLEMENT_UNKNOWN"
  }
};

let streamTicker: ReturnType<typeof setInterval> | null = null;
let streamSubscriberCount = 0;

function now() {
  return Date.now();
}

function mkId(prefix: string) {
  return `${prefix}_${now()}_${Math.floor(Math.random() * 10_000)}`;
}

function hashRoomConfig(hostId: string, funding: FundingSources) {
  const raw = `${hostId}:${JSON.stringify(funding)}`;
  let h = 0;
  for (let i = 0; i < raw.length; i += 1) {
    h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  }
  return `lock_${h.toString(16)}`;
}

function result<T>(ok: boolean, message: string, payload?: T, errorCode?: FuelMissionErrorCode): ControllerResult<T> {
  return { ok, message, payload, errorCode };
}

function logAudit(
  action: string,
  detail: string,
  metadata?: Pick<AuditLog, "eventType" | "reasonCode" | "severity">
): AuditLog {
  return {
    id: mkId("audit"),
    action,
    detail,
    timestamp: now(),
    ...metadata
  };
}

function markRisk(reason: string, severity: RiskMarker["severity"]): RiskMarker {
  return {
    id: mkId("risk"),
    reason,
    severity,
    createdAt: now()
  };
}

function toRiskSeverity(alertSeverity: AlertSeverity): RiskMarker["severity"] {
  if (alertSeverity === "critical") {
    return "high";
  }
  if (alertSeverity === "warning") {
    return "medium";
  }
  return "low";
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function normalizeRiskWeight(weight: number) {
  return clamp01((weight - 1) / 1.2);
}

function buildPriorityReason(
  item: Pick<UrgencyFeedItem, "deficitRatio" | "timePressure" | "riskWeight">,
  remainingSec: number
) {
  const deficitPct = Math.round(item.deficitRatio * 100);
  const pressurePct = Math.round(item.timePressure * 100);
  const countdownTag = remainingSec <= PANIC_THRESHOLD_SEC ? "PANIC WINDOW" : `T-${remainingSec}s`;

  if (item.deficitRatio >= 0.75) {
    return `DEFICIT CRITICAL ${deficitPct}% // ${countdownTag}`;
  }
  if (item.timePressure >= 0.7) {
    return `TIME PRESSURE ${pressurePct}% // ${countdownTag}`;
  }
  if (item.riskWeight >= 1.7) {
    return `RISK WEIGHT ${item.riskWeight.toFixed(2)} // ESCORT ADVISED`;
  }
  return `BALANCED LOAD // DEFICIT ${deficitPct}% // PRESSURE ${pressurePct}%`;
}

function chooseRecommendedAction(item: UrgencyFeedItem, confidenceScore: number): UrgencyActionTag {
  if (confidenceScore < LOW_CONFIDENCE_THRESHOLD) {
    return "HOLD_AND_SCAN";
  }
  if (item.riskWeight >= 1.7 && item.deficitRatio >= 0.6) {
    return "ESCORT_FIRST";
  }
  if (item.priorityIndex >= 0.5 || item.priorityDelta30s > 0.06) {
    return "HAUL_NOW";
  }
  return "HOLD_AND_SCAN";
}

function isTickableStatus(status: MatchStatus) {
  return status === "pre_start" || status === "running" || status === "panic" || status === "settling";
}

const REQUIRED_TEAM_ROLES: TeamRole[] = ["Collector", "Hauler", "Escort"];

function normalizeWallet(wallet: string) {
  return wallet.trim().toLowerCase();
}

function activeWalletAddress() {
  const auth = authStore.getState();
  if (!auth.isConnected || !auth.walletAddress) {
    return null;
  }
  return auth.walletAddress;
}

function ensureWalletConnected(action: string): ControllerResult<undefined> | null {
  const walletAddress = activeWalletAddress();
  if (walletAddress) {
    return null;
  }

  fuelMissionStore
    .getState()
    .addAuditLog(
      logAudit("wallet_guard_blocked", `${action}:wallet_not_connected`, {
        eventType: "domain_event",
        reasonCode: "E_WALLET_NOT_CONNECTED",
        severity: "warning"
      })
    );
  return result(false, "wallet not connected", undefined, "E_WALLET_NOT_CONNECTED");
}

function normalizeTeamStatus(status?: TeamLifecycleStatus): TeamLifecycleStatus {
  return status ?? "forming";
}

function buildRoleSlots(maxSize: number, roleSlots?: TeamRole[]) {
  const limit = Math.max(3, Math.min(8, maxSize));
  const base = roleSlots && roleSlots.length > 0 ? roleSlots.slice(0, limit) : REQUIRED_TEAM_ROLES;
  const merged = [...base];

  for (const requiredRole of REQUIRED_TEAM_ROLES) {
    if (!merged.includes(requiredRole)) {
      merged.push(requiredRole);
    }
  }

  return merged.slice(0, limit);
}

function hasWalletInAnyTeam(teams: TeamState[], walletAddress: string) {
  const normalizedWallet = normalizeWallet(walletAddress);
  return teams.some((team) =>
    team.players.some((player) => normalizeWallet(player.walletAddress ?? player.playerId) === normalizedWallet)
  );
}

function roleCapacity(team: TeamState, role: TeamRole) {
  const slots = team.roleSlots && team.roleSlots.length > 0 ? team.roleSlots : REQUIRED_TEAM_ROLES;
  return slots.filter((item) => item === role).length;
}

function roleFilled(team: TeamState, role: TeamRole) {
  return team.players.filter((player) => (player.role ?? null) === role).length;
}

function buildRoleMapFromPlayers(players: TeamState["players"]) {
  return players.reduce<Partial<Record<TeamRole, string>>>((acc, player) => {
    if (player.role && !acc[player.role]) {
      acc[player.role] = player.playerId;
    }
    return acc;
  }, {});
}

function getPaidTeamCount(teams: TeamState[]) {
  return teams.filter((team) => normalizeTeamStatus(team.status) === "paid").length;
}

function emitFilterRejection(reason: FilterRejectionReason, detail: string) {
  const severity = FILTER_REJECTION_SEVERITY[reason] ?? "warning";
  const store = fuelMissionStore.getState();
  store.addAuditLog(
    logAudit("filter_rejected", detail, {
      eventType: "filter_rejected",
      reasonCode: reason,
      severity
    })
  );
  store.addRiskMarker(markRisk(`filter rejected: ${reason}`, toRiskSeverity(severity)));
}

function emitSettlementFailure(code: SettlementFailureCode, detail: string): SettlementFailureAlert {
  const policy = SETTLEMENT_FAILURE_POLICY[code] ?? SETTLEMENT_FAILURE_POLICY.SETTLEMENT_UNKNOWN;
  const alert: SettlementFailureAlert = {
    id: mkId("settlement_alert"),
    code,
    severity: policy.severity,
    message: detail,
    createdAt: now()
  };

  const store = fuelMissionStore.getState();
  store.addSettlementAlert(alert);
  store.addAuditLog(
    logAudit("settlement_failed", detail, {
      eventType: "settlement_failed",
      reasonCode: code,
      severity: policy.severity
    })
  );
  store.addRiskMarker(markRisk(`settlement failure: ${code}`, toRiskSeverity(policy.severity)));
  store.markSettlementAttempt(false);
  return alert;
}

export const fuelMissionService = {
  subscribe(listener: () => void) {
    return fuelMissionStore.subscribe(listener);
  },

  getSnapshot(): FuelMissionStore {
    return fuelMissionStore.getState();
  },

  resetForTest() {
    fuelMissionStore.getState().resetAll();
    this.syncUrgencyFeed();
  },

  computeUrgencyFeed(nodes: NodeDeficitSnapshot[], remainingSec: number): UrgencyFeedItem[] {
    const countdownFactor = clamp01((URGENCY_WINDOW_SEC - remainingSec) / URGENCY_WINDOW_SEC);

    return [...nodes]
      .map((node) => {
        const deficitRatio = clamp01(1 - node.fillRatio);
        const timePressure = clamp01(deficitRatio * 0.65 + countdownFactor * 0.35);
        const riskFactor = normalizeRiskWeight(node.riskWeight);
        const priorityIndex = clamp01(deficitRatio * 0.55 + timePressure * 0.25 + riskFactor * 0.2);

        const baseItem = {
          nodeId: node.nodeId,
          name: node.name,
          fillRatio: node.fillRatio,
          riskWeight: node.riskWeight,
          deficitRatio,
          timePressure,
          priorityIndex
        };

        return {
          ...baseItem,
          priorityDelta30s: 0,
          recommendedActionTag: "HOLD_AND_SCAN" as UrgencyActionTag,
          priorityReason: buildPriorityReason(baseItem, remainingSec)
        };
      })
      .sort((a, b) => b.priorityIndex - a.priorityIndex);
  },

  computeUrgencyTrend(feedHistory: Record<string, number[]>, windowSec: number) {
    const windowSamples = Math.max(2, Math.min(URGENCY_HISTORY_CAP, Math.round(windowSec / 3)));
    const trendMap: Record<string, number> = {};

    for (const [nodeId, history] of Object.entries(feedHistory)) {
      const sample = history.slice(-windowSamples);
      const start = sample[0] ?? history[0] ?? 0;
      const end = sample[sample.length - 1] ?? start;
      trendMap[nodeId] = Number((end - start).toFixed(2));
    }

    return trendMap;
  },

  computeUrgencyConfidence(trendMap: Record<string, number>, staleSnapshot: boolean) {
    if (staleSnapshot) {
      return 0.45;
    }

    const trendValues = Object.values(trendMap);
    if (trendValues.length === 0) {
      return 0.9;
    }

    const avgVolatility =
      trendValues.reduce((sum, value) => sum + Math.abs(value), 0) / trendValues.length;
    return Number(clamp01(0.92 - avgVolatility * 2.4).toFixed(2));
  },

  buildUrgencyRecommendation(feed: UrgencyFeedItem[], confidenceScore: number) {
    return feed.map((item) => {
      const recommendedActionTag = chooseRecommendedAction(item, confidenceScore);
      const confidenceHint =
        confidenceScore < LOW_CONFIDENCE_THRESHOLD
          ? " // LOW CONFIDENCE - VERIFY"
          : "";
      const normalizedReason = item.priorityReason.replace(/ \/\/ LOW CONFIDENCE - VERIFY$/, "");

      return {
        ...item,
        recommendedActionTag,
        priorityReason: `${normalizedReason}${confidenceHint}`
      };
    });
  },

  buildRescueCandidates(nodes: NodeDeficitSnapshot[], urgencyFeed: UrgencyFeedItem[]): RescueCandidate[] {
    const nodeMap = new Map(nodes.map((node) => [node.nodeId, node]));

    return urgencyFeed.map((item) => {
      const node = nodeMap.get(item.nodeId);
      const completed = node?.completed ?? false;
      const canRescue = !completed && item.deficitRatio > 0.08;

      let rescueBlockReason: string | null = null;
      if (completed) {
        rescueBlockReason = "NODE_STABILIZED";
      } else if (!canRescue) {
        rescueBlockReason = "DEFICIT_TOO_LOW";
      }

      return {
        nodeId: item.nodeId,
        name: item.name,
        canRescue,
        rescueBlockReason,
        fillRatio: item.fillRatio,
        deficitRatio: item.deficitRatio,
        riskWeight: item.riskWeight,
        timePressure: item.timePressure,
        priorityIndex: item.priorityIndex,
        recommendedActionTag: item.recommendedActionTag
      };
    });
  },

  syncUrgencyFeed(options?: { freezeWhenStale?: boolean }) {
    const state = fuelMissionStore.getState();
    if (options?.freezeWhenStale && state.staleSnapshot && state.urgencyFeed.length > 0) {
      const confidenceScore = 0.45;
      const degraded = this.buildUrgencyRecommendation(state.urgencyFeed, confidenceScore);
      const rescueCandidates = this.buildRescueCandidates(state.nodes, degraded);
      const fallbackNodeId = rescueCandidates.find((candidate) => candidate.canRescue)?.nodeId ?? degraded[0]?.nodeId ?? null;
      const selectedNodeId = state.selectedUrgencyNodeId;
      const keepSelected = selectedNodeId ? degraded.some((item) => item.nodeId === selectedNodeId) : false;

      fuelMissionStore.getState().setUrgencyFeed(degraded);
      fuelMissionStore.getState().setUrgencyConfidenceScore(confidenceScore);
      fuelMissionStore.getState().setRescueCandidates(rescueCandidates);
      fuelMissionStore.getState().setSelectedUrgencyNodeId(keepSelected ? selectedNodeId : fallbackNodeId);
      return degraded;
    }

    const baseFeed = this.computeUrgencyFeed(state.nodes, state.remainingSec);
    const feedHistory: Record<string, number[]> = {};

    for (const item of baseFeed) {
      const previous = state.urgencyIndexHistory[item.nodeId] ?? [];
      feedHistory[item.nodeId] = [...previous, item.priorityIndex].slice(-URGENCY_HISTORY_CAP);
    }

    const trendMap = this.computeUrgencyTrend(feedHistory, URGENCY_TREND_WINDOW_SEC);
    const feedWithTrend = baseFeed.map((item) => ({
      ...item,
      priorityDelta30s: trendMap[item.nodeId] ?? 0
    }));
    const confidenceScore = this.computeUrgencyConfidence(trendMap, state.staleSnapshot);
    const feed = this
      .buildUrgencyRecommendation(feedWithTrend, confidenceScore)
      .sort((a, b) => b.priorityIndex - a.priorityIndex || b.riskWeight - a.riskWeight);
    const rescueCandidates = this.buildRescueCandidates(state.nodes, feed);
    const fallbackNodeId = rescueCandidates.find((candidate) => candidate.canRescue)?.nodeId ?? feed[0]?.nodeId ?? null;

    const selectedNodeId = state.selectedUrgencyNodeId;
    const keepSelected = selectedNodeId ? feed.some((item) => item.nodeId === selectedNodeId) : false;

    fuelMissionStore.getState().setUrgencyIndexHistory(feedHistory);
    fuelMissionStore.getState().setUrgencyConfidenceScore(confidenceScore);
    fuelMissionStore.getState().setUrgencyFeed(feed);
    fuelMissionStore.getState().setRescueCandidates(rescueCandidates);
    fuelMissionStore.getState().setSelectedUrgencyNodeId(keepSelected ? selectedNodeId : fallbackNodeId);
    return feed;
  },

  selectUrgencyNode(nodeId: string) {
    const state = fuelMissionStore.getState();
    if (!state.urgencyFeed.some((item) => item.nodeId === nodeId)) {
      return result(false, "urgency node not found", undefined, "E_SCORE_EVENT_INVALID");
    }

    fuelMissionStore.getState().setSelectedUrgencyNodeId(nodeId);
    fuelMissionStore.getState().addAuditLog(logAudit("urgency_select", `node=${nodeId}`));
    return result(true, "urgency node selected", { selectedNodeId: nodeId });
  },

  executeUrgencyRecommendation() {
    const state = fuelMissionStore.getState();
    const topNode = state.urgencyFeed[0];
    if (!topNode) {
      return result(false, "urgency recommendation unavailable", undefined, "E_SCORE_EVENT_INVALID");
    }

    fuelMissionStore.getState().setSelectedUrgencyNodeId(topNode.nodeId);
    fuelMissionStore
      .getState()
      .addAuditLog(
        logAudit(
          "urgency_execute",
          `node=${topNode.nodeId}:action=${topNode.recommendedActionTag}:confidence=${state.urgencyConfidenceScore.toFixed(2)}`
        )
      );

    return result(true, "urgency recommendation executed", {
      selectedNodeId: topNode.nodeId,
      recommendedActionTag: topNode.recommendedActionTag,
      confidenceScore: state.urgencyConfidenceScore
    });
  },

  toggleAdvancedIntel(nextExpanded?: boolean) {
    const state = fuelMissionStore.getState();
    const isIntelExpanded = typeof nextExpanded === "boolean" ? nextExpanded : !state.isIntelExpanded;

    fuelMissionStore.getState().setIntelExpanded(isIntelExpanded);
    fuelMissionStore
      .getState()
      .addAuditLog(logAudit("intel_toggle", `expanded=${isIntelExpanded ? "true" : "false"}`));

    return result(true, "advanced intel toggled", { isIntelExpanded });
  },

  initMissionState(nodes?: NodeDeficitSnapshot[]) {
    const missionNodes = nodes && nodes.length > 0 ? nodes : fuelMissionStore.getState().nodes;
    fuelMissionStore.getState().setNodes(missionNodes);
    fuelMissionStore.getState().setIntelExpanded(false);
    this.syncUrgencyFeed();
    fuelMissionStore.getState().addAuditLog(logAudit("init_mission", `nodes=${missionNodes.length}`));
    return result(true, "mission initialized", missionNodes);
  },

  createFuelRoom(input: {
    hostId: string;
    hostName: string;
    funding?: Partial<FundingSources>;
  }) {
    const walletGuard = ensureWalletConnected("create_room");
    if (walletGuard) {
      return walletGuard;
    }

    const current = fuelMissionStore.getState();
    if (current.room && current.status !== "settled") {
      fuelMissionStore.getState().addAuditLog(logAudit("create_room_blocked", "room config already locked"));
      return result(false, "room config already locked", undefined, "E_ROOM_CONFIG_LOCKED");
    }

    const mergedFunding: FundingSources = {
      ...current.funding,
      ...input.funding,
      minTeams: input.funding?.minTeams ?? current.funding.minTeams ?? 1,
      maxTeams: input.funding?.maxTeams ?? current.funding.maxTeams ?? 10,
      minPlayersPerTeam: input.funding?.minPlayersPerTeam ?? current.funding.minPlayersPerTeam ?? 3,
      startRuleSummary:
        input.funding?.startRuleSummary ??
        current.funding.startRuleSummary ??
        "满 N 支战队且均已付费即开；未满员时至少 1 支 3 人队伍倒计时 3 分钟开赛"
    };
    const roomId = mkId("room");
    const room: RoomState = {
      roomId,
      hostId: input.hostId,
      hostName: input.hostName,
      configLockHash: hashRoomConfig(input.hostId, mergedFunding),
      rolesLocked: false,
      whitelistWallets: []
    };

    fuelMissionStore.getState().setTeams([]);
    fuelMissionStore.getState().setMyTeamId(null);
    fuelMissionStore.getState().setRoom(room);
    fuelMissionStore.getState().setFunding(mergedFunding);
    fuelMissionStore.getState().setStatus("lobby");
    fuelMissionStore.getState().setRemaining(PRE_START_SEC);
    fuelMissionStore.getState().setPanic(false);
    fuelMissionStore.getState().clearMatchWindow();
    fuelMissionStore.getState().setIntelExpanded(false);
    this.syncUrgencyFeed();
    fuelMissionStore.getState().addAuditLog(logAudit("create_room", `room=${roomId}`));

    return result(true, "room created", {
      roomId,
      configLockHash: room.configLockHash
    });
  },

  createTeam(input: {
    teamName: string;
    maxSize: number;
    captainWallet: string;
    captainName: string;
    captainRole?: TeamRole;
    roleSlots?: TeamRole[];
  }) {
    const walletGuard = ensureWalletConnected("create_team");
    if (walletGuard) {
      return walletGuard;
    }
    const connectedWallet = activeWalletAddress() ?? "";
    if (normalizeWallet(input.captainWallet) !== normalizeWallet(connectedWallet)) {
      return result(false, "captain wallet mismatch", undefined, "E_FORBIDDEN");
    }

    const state = fuelMissionStore.getState();
    if (!state.room) {
      return result(false, "room not ready", undefined, "E_ROOM_NOT_READY");
    }

    const teamName = input.teamName.trim();
    if (!teamName) {
      return result(false, "team name required", undefined, "E_INVALID_INPUT");
    }
    if (input.maxSize < 3 || input.maxSize > 8) {
      return result(false, "max size must be within 3-8", undefined, "E_INVALID_INPUT");
    }
    if (state.funding.maxTeams && state.teams.length >= state.funding.maxTeams) {
      return result(false, "team cap reached", undefined, "E_TEAM_FULL");
    }
    if (hasWalletInAnyTeam(state.teams, input.captainWallet)) {
      return result(false, "captain already in another team", undefined, "E_ALREADY_IN_TEAM");
    }

    const captainRole = input.captainRole ?? "Collector";
    const roleSlots = buildRoleSlots(input.maxSize, input.roleSlots);
    if (!roleSlots.includes(captainRole)) {
      roleSlots[0] = captainRole;
    }

    const playerId = `pilot_${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
    const captainPlayer = {
      playerId,
      name: input.captainName.trim() || "Captain",
      walletAddress: input.captainWallet,
      role: captainRole,
      joinedAt: now()
    };

    const team: TeamState = {
      teamId: `team_${Date.now()}_${Math.floor(Math.random() * 10_000)}`,
      name: teamName,
      players: [captainPlayer],
      roles: { [captainRole]: playerId },
      captainWallet: normalizeWallet(input.captainWallet),
      maxSize: input.maxSize,
      roleSlots,
      status: "forming"
    };

    const nextTeams = [...state.teams, team];
    fuelMissionStore.getState().setTeams(nextTeams);
    fuelMissionStore.getState().setMyTeamId(team.teamId);
    fuelMissionStore
      .getState()
      .addAuditLog(logAudit("create_team", `team=${team.teamId}:captain=${team.captainWallet}`));

    return result(true, "team created", { team });
  },

  joinTeam(input: { teamId: string; walletAddress: string; name: string; role: TeamRole }) {
    const walletGuard = ensureWalletConnected("join_team");
    if (walletGuard) {
      return walletGuard;
    }
    const connectedWallet = activeWalletAddress() ?? "";
    if (normalizeWallet(input.walletAddress) !== normalizeWallet(connectedWallet)) {
      return result(false, "wallet mismatch", undefined, "E_FORBIDDEN");
    }

    const state = fuelMissionStore.getState();
    if (!state.room) {
      return result(false, "room not ready", undefined, "E_ROOM_NOT_READY");
    }

    const team = state.teams.find((item) => item.teamId === input.teamId);
    if (!team) {
      return result(false, "team not found", undefined, "E_TEAM_NOT_FOUND");
    }

    if (normalizeTeamStatus(team.status) !== "forming") {
      return result(false, "team already locked", undefined, "E_ROLE_LOCKED");
    }
    if ((team.maxSize ?? 8) <= team.players.length) {
      return result(false, "team full", undefined, "E_TEAM_FULL");
    }
    if (hasWalletInAnyTeam(state.teams, input.walletAddress)) {
      return result(false, "wallet already in team", undefined, "E_ALREADY_IN_TEAM");
    }

    const cap = roleCapacity(team, input.role);
    if (cap > 0 && roleFilled(team, input.role) >= cap) {
      return result(false, "role slot already taken", undefined, "E_ROLE_SLOT_TAKEN");
    }

    const member = {
      playerId: `pilot_${Date.now()}_${Math.floor(Math.random() * 10_000)}`,
      name: input.name.trim() || "Pilot",
      walletAddress: input.walletAddress,
      role: input.role,
      joinedAt: now()
    };

    const nextTeams = state.teams.map((item) => {
      if (item.teamId !== input.teamId) {
        return item;
      }

      const nextPlayers = [...item.players, member];
      const nextRoles = item.roles[input.role] ? item.roles : { ...item.roles, [input.role]: member.playerId };
      return {
        ...item,
        players: nextPlayers,
        roles: nextRoles
      };
    });

    fuelMissionStore.getState().setTeams(nextTeams);
    fuelMissionStore.getState().setMyTeamId(input.teamId);
    fuelMissionStore.getState().addAuditLog(logAudit("join_team", `team=${input.teamId}:wallet=${input.walletAddress}`));

    return result(true, "joined team", {
      member,
      teamId: input.teamId,
      playerCount: team.players.length + 1
    });
  },

  lockTeam(input: { teamId: string; captainWallet: string }) {
    const walletGuard = ensureWalletConnected("lock_team");
    if (walletGuard) {
      return walletGuard;
    }
    const connectedWallet = activeWalletAddress() ?? "";
    if (normalizeWallet(input.captainWallet) !== normalizeWallet(connectedWallet)) {
      return result(false, "captain wallet mismatch", undefined, "E_FORBIDDEN");
    }

    const state = fuelMissionStore.getState();
    const team = state.teams.find((item) => item.teamId === input.teamId);
    if (!team) {
      return result(false, "team not found", undefined, "E_TEAM_NOT_FOUND");
    }

    if (normalizeWallet(input.captainWallet) !== normalizeWallet(team.captainWallet ?? "")) {
      return result(false, "captain required", undefined, "E_FORBIDDEN");
    }
    if (normalizeTeamStatus(team.status) !== "forming") {
      return result(false, "team already locked", undefined, "E_ROLE_LOCKED");
    }
    if (!selectIsTeamReady(team)) {
      return result(false, "team role slots are not full", undefined, "E_TEAM_NOT_READY");
    }
    if ((state.funding.minPlayersPerTeam ?? 3) > team.players.length) {
      return result(false, "team does not reach minimum player requirement", undefined, "E_TEAM_NOT_READY");
    }

    const nextTeams = state.teams.map((item) =>
      item.teamId === input.teamId ? { ...item, status: "locked" as TeamLifecycleStatus } : item
    );
    fuelMissionStore.getState().setTeams(nextTeams);
    if (state.room) {
      fuelMissionStore.getState().setRoom({ ...state.room, rolesLocked: true });
    }
    fuelMissionStore.getState().addAuditLog(logAudit("lock_team", `team=${input.teamId}`));

    return result(true, "team locked", {
      teamId: input.teamId
    });
  },

  payEntry(input: { teamId: string; captainWallet: string; txDigest?: string; memberAddresses?: string[] }) {
    const walletGuard = ensureWalletConnected("pay_entry");
    if (walletGuard) {
      return walletGuard;
    }
    const connectedWallet = activeWalletAddress() ?? "";
    if (normalizeWallet(input.captainWallet) !== normalizeWallet(connectedWallet)) {
      return result(false, "captain wallet mismatch", undefined, "E_FORBIDDEN");
    }

    const state = fuelMissionStore.getState();
    const team = state.teams.find((item) => item.teamId === input.teamId);
    if (!team) {
      return result(false, "team not found", undefined, "E_TEAM_NOT_FOUND");
    }
    if (normalizeWallet(input.captainWallet) !== normalizeWallet(team.captainWallet ?? "")) {
      return result(false, "captain required", undefined, "E_FORBIDDEN");
    }

    const teamStatus = normalizeTeamStatus(team.status);
    if (teamStatus === "paid") {
      return result(false, "team already paid", undefined, "E_TEAM_ALREADY_PAID");
    }
    if (teamStatus !== "locked") {
      return result(false, "team not locked", undefined, "E_TEAM_NOT_LOCKED");
    }
    if (!selectIsTeamReady(team)) {
      return result(false, "team role slots are not full", undefined, "E_TEAM_NOT_READY");
    }
    if ((state.funding.minPlayersPerTeam ?? 3) > team.players.length) {
      return result(false, "team does not reach minimum player requirement", undefined, "E_TEAM_NOT_READY");
    }
    if (roleFilled(team, "Hauler") < 1) {
      return result(false, "team requires at least one hauler", undefined, "E_TEAM_NOT_READY");
    }

    const addresses =
      input.memberAddresses && input.memberAddresses.length > 0
        ? input.memberAddresses
        : team.players.map((player) => player.walletAddress ?? player.playerId);

    if (addresses.length !== team.players.length) {
      return result(false, "member addresses mismatch", undefined, "E_INVALID_INPUT");
    }

    const txDigest = input.txDigest ?? `tx_${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
    const nextTeams = state.teams.map((item) =>
      item.teamId === input.teamId
        ? {
            ...item,
            status: "paid" as TeamLifecycleStatus,
            paidTxDigest: txDigest,
            paidAt: now()
          }
        : item
    );

    const room = state.room;
    if (room) {
      const whitelist = new Set(room.whitelistWallets ?? []);
      for (const address of addresses) {
        whitelist.add(normalizeWallet(address));
      }
      fuelMissionStore.getState().setRoom({ ...room, whitelistWallets: [...whitelist] });
    }

    fuelMissionStore.getState().setTeams(nextTeams);
    fuelMissionStore
      .getState()
      .addAuditLog(logAudit("pay_entry", `team=${input.teamId}:tx=${txDigest}:members=${addresses.length}`));

    const minTeams = state.funding.minTeams ?? 1;
    if (state.status === "lobby" && getPaidTeamCount(nextTeams) >= minTeams) {
      this.transitionPhase("pre_start");
    }

    return result(true, "entry paid", {
      whitelistCount: addresses.length,
      teamStatus: "paid" as TeamLifecycleStatus,
      txDigest
    });
  },

  subscribeLobbyUpdates(callbacks: {
    onTeamChange?: (team: TeamState) => void;
    onMemberChange?: (member: TeamState["players"][number]) => void;
    onRoomChange?: (room: RoomState) => void;
  }) {
    let previous = fuelMissionStore.getState();

    return fuelMissionStore.subscribe((snapshot) => {
      if (snapshot.room !== previous.room && snapshot.room) {
        callbacks.onRoomChange?.(snapshot.room);
      }

      if (snapshot.teams !== previous.teams) {
        for (const team of snapshot.teams) {
          callbacks.onTeamChange?.(team);
          for (const slot of selectTeamSlots(team)) {
            if (slot.member) {
              callbacks.onMemberChange?.(slot.member);
            }
          }
        }
      }

      previous = snapshot;
    });
  },

  joinFuelRoom(input: { teamId: string; playerId: string; name: string }) {
    const walletGuard = ensureWalletConnected("join_room");
    if (walletGuard) {
      return walletGuard;
    }

    const walletAddress = activeWalletAddress() ?? "";
    const state = fuelMissionStore.getState();
    if (authStore.getState().luxBalance < state.funding.entryFeeLux) {
      fuelMissionStore
        .getState()
        .addAuditLog(logAudit("join_room_blocked", `insufficient_balance:need=${state.funding.entryFeeLux}`));
      return result(false, "insufficient LUX balance", undefined, "E_INSUFFICIENT_BALANCE");
    }

    const target = state.teams.find((team) => team.teamId === input.teamId);
    if (!target) {
      const createResult = this.createTeam({
        teamName: input.teamId === "team-beta" ? "Team Beta" : "Team Alpha",
        maxSize: 6,
        captainWallet: walletAddress,
        captainName: input.name,
        captainRole: "Collector"
      });
      if (!createResult.ok) {
        return createResult;
      }

      const remainingLux = Math.max(0, authStore.getState().luxBalance - state.funding.entryFeeLux);
      authStore.getState().updateBalance(remainingLux);
      return result(true, "joined room", {
        teamId: createResult.payload?.team.teamId ?? input.teamId,
        playerCount: 1,
        remainingLux
      });
    }

    const candidateRoles: TeamRole[] = ["Collector", "Hauler", "Escort", "Dispatcher"];
    const role =
      candidateRoles.find((item) => {
        const cap = roleCapacity(target, item);
        return cap === 0 || roleFilled(target, item) < cap;
      }) ?? "Hauler";

    const joinResult = this.joinTeam({
      teamId: target.teamId,
      walletAddress,
      name: input.name,
      role
    });
    if (!joinResult.ok) {
      return joinResult;
    }

    const remainingLux = Math.max(0, authStore.getState().luxBalance - state.funding.entryFeeLux);
    authStore.getState().updateBalance(remainingLux);
    return result(true, "joined room", {
      teamId: target.teamId,
      playerCount: joinResult.payload?.playerCount ?? target.players.length,
      remainingLux
    });
  },

  lockTeamRoles(input: { teamId: string; assignments: Partial<Record<TeamRole, string>> }) {
    const walletGuard = ensureWalletConnected("lock_team_roles");
    if (walletGuard) {
      return walletGuard;
    }

    const state = fuelMissionStore.getState();
    const team = state.teams.find((item) => item.teamId === input.teamId);
    if (!team) {
      return result(false, "team not found", undefined, "E_TEAM_NOT_FOUND");
    }

    const nextPlayers = team.players.map((player) => {
      const mappedRole = (Object.entries(input.assignments).find(([, playerId]) => playerId === player.playerId)?.[0] ??
        player.role) as TeamRole | undefined;

      return {
        ...player,
        role: mappedRole
      };
    });

    const nextTeam = {
      ...team,
      players: nextPlayers,
      roles: {
        ...buildRoleMapFromPlayers(nextPlayers),
        ...input.assignments
      }
    };
    const nextTeams = state.teams.map((item) => (item.teamId === input.teamId ? nextTeam : item));
    fuelMissionStore.getState().setTeams(nextTeams);

    const lockResult = this.lockTeam({
      teamId: input.teamId,
      captainWallet: team.captainWallet ?? team.players[0]?.walletAddress ?? team.players[0]?.playerId ?? ""
    });
    if (!lockResult.ok) {
      return lockResult;
    }
    if (state.status === "lobby") {
      this.transitionPhase("pre_start");
    }

    return result(true, "roles locked", { teamId: input.teamId });
  },

  transitionPhase(next: MatchStatus) {
    const curr = fuelMissionStore.getState().status;
    if (!VALID_TRANSITIONS[curr].includes(next)) {
      fuelMissionStore
        .getState()
        .addAuditLog(
          logAudit("invalid_transition", `${curr}->${next}`, {
            eventType: "state_transition_rejected",
            reasonCode: "INVALID_STATE_TRANSITION",
            severity: "warning"
          })
        );
      return result(false, "invalid state transition", undefined, "E_INVALID_STATE_TRANSITION");
    }

    fuelMissionStore.getState().setStatus(next);

    if (next === "pre_start") {
      fuelMissionStore.getState().setRemaining(PRE_START_SEC);
      fuelMissionStore.getState().setPanic(false);
      fuelMissionStore.getState().clearMatchWindow();
    }

    if (next === "running") {
      const startMs = now();
      const endMs = startMs + RUNNING_SEC * 1_000;
      fuelMissionStore.getState().setRemaining(RUNNING_SEC);
      fuelMissionStore.getState().setPanic(false);
      fuelMissionStore.getState().setMatchWindow(startMs, endMs);
      fuelMissionStore.getState().addAuditLog(logAudit("start_match_tx", "mock_start_match_tx_submitted"));
    }

    if (next === "panic") {
      fuelMissionStore.getState().setPanic(true);
      fuelMissionStore.getState().addAuditLog(logAudit("panic_mode", "broadcast panic_mode"));
    }

    if (next === "settling") {
      fuelMissionStore.getState().setRemaining(SETTLING_SEC);
      fuelMissionStore.getState().setPanic(false);
      fuelMissionStore.getState().addAuditLog(logAudit("settlement_start", "settlement pipeline started"));
    }

    if (next === "settled") {
      fuelMissionStore.getState().setRemaining(0);
      fuelMissionStore.getState().setPanic(false);
    }

    fuelMissionStore.getState().addAuditLog(logAudit("transition", `${curr}->${next}`));
    return result(true, "phase moved", { from: curr, to: next });
  },

  recordSupplyEvent(event: RecordSupplyEventInput) {
    const walletGuard = ensureWalletConnected("record_supply_event");
    if (walletGuard) {
      return walletGuard;
    }

    const state = fuelMissionStore.getState();
    if (state.status !== "running" && state.status !== "panic") {
      emitFilterRejection("INVALID_PHASE", `status=${state.status}`);
      return result(false, "invalid phase for supply event", undefined, "E_FILTER_REJECTED");
    }
    if (state.acceptedEventIds.includes(event.eventId)) {
      emitFilterRejection("DUPLICATE_EVENT_ID", `event=${event.eventId}`);
      return result(false, "duplicate supply event", undefined, "E_FILTER_REJECTED");
    }

    if (
      !event.eventId.trim() ||
      !event.nodeId.trim() ||
      !event.playerId.trim() ||
      !event.playerName.trim() ||
      !Number.isFinite(event.fillDelta) ||
      !Number.isFinite(event.contributionDelta) ||
      event.fillDelta <= 0 ||
      event.contributionDelta <= 0
    ) {
      emitFilterRejection("INVALID_EVENT_PAYLOAD", `event=${event.eventId}`);
      return result(false, "invalid event payload", undefined, "E_FILTER_REJECTED");
    }

    const targetNode = state.nodes.find((node) => node.nodeId === event.nodeId);
    if (!targetNode) {
      emitFilterRejection("TARGET_NODE_MISMATCH", `event=${event.eventId};node=${event.nodeId}`);
      return result(false, "target node not found", undefined, "E_FILTER_REJECTED");
    }

    const oldQuantity = Math.round(targetNode.fillRatio * NODE_MAX_CAPACITY);
    const normalizedFillDelta = Math.max(0, event.fillDelta);
    const nextQuantity = Math.min(
      NODE_MAX_CAPACITY,
      oldQuantity + Math.max(1, Math.round(normalizedFillDelta * NODE_MAX_CAPACITY))
    );
    const txDigest = `tx_${event.eventId}`;
    const chainTs = event.chainTimestampMs ?? now();
    const fuelProfile = selectSimulatedFuelProfile(event.eventId);
    const window = state.matchWindowStartMs != null && state.matchWindowEndMs != null
      ? { startTs: state.matchWindowStartMs, endTs: state.matchWindowEndMs }
      : null;
    if (window && (chainTs < window.startTs || chainTs > window.endTs)) {
      emitFilterRejection(
        "EVENT_OUTSIDE_MATCH_WINDOW",
        `event=${event.eventId};ts=${chainTs};window=${window.startTs}-${window.endTs}`
      );
      return result(false, "event outside match window", undefined, "E_FILTER_REJECTED");
    }

    if (state.teams.length > 0 && !hasWalletInAnyTeam(state.teams, event.playerId)) {
      emitFilterRejection("NOT_IN_MATCH_WHITELIST", `event=${event.eventId};wallet=${event.playerId}`);
      return result(false, "wallet not in match whitelist", undefined, "E_FILTER_REJECTED");
    }
    const matchId = state.room?.roomId ?? "match-local";

    missionEventGateway.enqueueFuelEvent({
      eventId: event.eventId,
      matchId,
      senderWallet: event.playerId,
      playerName: event.playerName,
      txDigest,
      assemblyId: event.nodeId,
      fuelTypeId: fuelProfile.fuelTypeId,
      fuelEfficiency: fuelProfile.fuelEfficiency,
      oldQuantity,
      newQuantity: nextQuantity,
      maxCapacity: NODE_MAX_CAPACITY,
      chainTs
    });

    fuelMissionStore.getState().addAcceptedEventId(event.eventId);
    fuelMissionStore.getState().addEventLagSample(Math.max(0, Date.now() - chainTs));
    if (event.wsPublishedAtMs) {
      fuelMissionStore.getState().addWsLatencySample(Math.max(0, Date.now() - event.wsPublishedAtMs));
    }
    fuelMissionStore
      .getState()
      .addAuditLog(
        logAudit("chain_event_queued", `${event.eventId}:${event.nodeId}:${event.playerId}:tx=${txDigest}`, {
          eventType: "score_event_buffered",
          severity: "info"
        })
      );

    return result(true, "supply event queued", {
      txDigest,
      chainTs,
      nodeId: event.nodeId
    });
  },

  tickMatch(stepSec = 1, options?: { silent?: boolean }) {
    const state = fuelMissionStore.getState();
    if (!isTickableStatus(state.status)) {
      if (options?.silent) {
        return result(true, "tick ignored", {
          countdownSec: state.remainingSec,
          remainingSec: state.remainingSec,
          status: state.status,
          isPanic: state.isPanic
        });
      }

      fuelMissionStore.getState().addAuditLog(logAudit("tick_blocked", `status=${state.status}`));
      return result(false, "tick ignored", undefined, "E_INVALID_STATE_TRANSITION");
    }

    fuelMissionStore.getState().tickDown(stepSec);

    let next = fuelMissionStore.getState();
    if (next.status === "pre_start" && next.remainingSec === 0) {
      this.transitionPhase("running");
    }

    next = fuelMissionStore.getState();
    if (next.status === "running" && next.remainingSec <= PANIC_THRESHOLD_SEC) {
      this.transitionPhase("panic");
    }

    next = fuelMissionStore.getState();
    if ((next.status === "running" || next.status === "panic") && next.remainingSec === 0) {
      this.transitionPhase("settling");
    }

    next = fuelMissionStore.getState();
    if (next.status === "settling" && next.remainingSec === 0) {
      this.finalizeSettlement({ requireWallet: false });
    }

    this.syncUrgencyFeed({ freezeWhenStale: true });

    const finalState = fuelMissionStore.getState();
    return result(true, "tick updated", {
      countdownSec: finalState.remainingSec,
      remainingSec: finalState.remainingSec,
      status: finalState.status,
      isPanic: finalState.isPanic
    });
  },

  ensureStreamTicker() {
    if (streamTicker) {
      return;
    }

    streamTicker = setInterval(() => {
      this.tickMatch(1, { silent: true });
    }, 1000);
  },

  stopMatchStream() {
    if (streamTicker) {
      clearInterval(streamTicker);
      streamTicker = null;
    }
  },

  subscribeMatchStream(callbacks: MatchStreamCallbacks = {}) {
    let previous = fuelMissionStore.getState();

    callbacks.onStatusChange?.(previous.status);
    callbacks.onRemainingChange?.(previous.remainingSec);
    if (previous.status === "panic") {
      callbacks.onPanicMode?.();
    }

    const unsubscribeStore = fuelMissionStore.subscribe((snapshot) => {
      if (snapshot.status !== previous.status) {
        callbacks.onStatusChange?.(snapshot.status);

        if (snapshot.status === "panic" && previous.status !== "panic") {
          callbacks.onPanicMode?.();
        }

        if (snapshot.status === "settling" && previous.status !== "settling") {
          callbacks.onSettlementStart?.();
        }
      }

      if (snapshot.remainingSec !== previous.remainingSec) {
        callbacks.onRemainingChange?.(snapshot.remainingSec);
      }

      previous = snapshot;
    });

    streamSubscriberCount += 1;
    this.ensureStreamTicker();

    return () => {
      unsubscribeStore();
      streamSubscriberCount = Math.max(0, streamSubscriberCount - 1);
      if (streamSubscriberCount === 0) {
        this.stopMatchStream();
      }
    };
  },

  getObservabilityMetrics() {
    return fuelMissionStore.getState().observability;
  },

  runAnomalyDrill(): ControllerResult<AnomalyDrillReport> {
    const baselineState = JSON.parse(JSON.stringify(fuelMissionStore.getState())) as Partial<FuelMissionStore>;
    const cases: AnomalyDrillReport["cases"] = [];

    try {
      fuelMissionStore.getState().resetAll();
      fuelMissionStore.getState().setStatus("running");
      fuelMissionStore.getState().setMatchWindow(Date.now() - 5_000, Date.now() + 20_000);
      fuelMissionStore.getState().setTeams([
        {
          teamId: "team-alpha",
          name: "Team Alpha",
          players: [{ playerId: "pilot-alpha", name: "Pilot Alpha", walletAddress: "pilot-alpha" }],
          roles: {}
        }
      ]);

      const rpcTimeout = this.finalizeSettlement({ requireWallet: false, simulateFailure: "rpc_timeout" });
      cases.push({
        scenario: "rpc_timeout",
        passed: !rpcTimeout.ok && rpcTimeout.errorCode === "E_SETTLEMENT_RPC_TIMEOUT",
        expected: "E_SETTLEMENT_RPC_TIMEOUT",
        observedCode: rpcTimeout.errorCode,
        message: rpcTimeout.message
      });

      fuelMissionStore.getState().setStatus("settling");
      const firstSettlement = this.finalizeSettlement({ requireWallet: false });
      const duplicateSettlement = this.finalizeSettlement({ requireWallet: false });
      cases.push({
        scenario: "duplicate_settlement",
        passed: firstSettlement.ok && duplicateSettlement.ok && duplicateSettlement.message.includes("idempotent"),
        expected: "idempotent settlement",
        observedCode: duplicateSettlement.errorCode,
        message: duplicateSettlement.message
      });

      fuelMissionStore.getState().setStatus("lobby");
      const illegalTransition = this.transitionPhase("settled");
      cases.push({
        scenario: "illegal_state_transition",
        passed: !illegalTransition.ok && illegalTransition.errorCode === "E_INVALID_STATE_TRANSITION",
        expected: "E_INVALID_STATE_TRANSITION",
        observedCode: illegalTransition.errorCode,
        message: illegalTransition.message
      });

      return result(true, "anomaly drill completed", {
        executedAt: Date.now(),
        cases
      });
    } finally {
      fuelMissionStore.setState(baselineState);
    }
  },

  finalizeSettlement(options?: {
    requireWallet?: boolean;
    simulateFailure?: "rpc_timeout" | "tx_rejected" | "idempotency_conflict";
  }) {
    if (options?.requireWallet !== false) {
      const walletGuard = ensureWalletConnected("finalize_settlement");
      if (walletGuard) {
        return walletGuard;
      }
    }

    const state = fuelMissionStore.getState();

    if (state.status === "settled" && state.settlement.settlementId) {
      return result(true, "idempotent settlement", state.settlement);
    }

    if (state.status !== "settling" && state.status !== "panic" && state.status !== "running") {
      const alert = emitSettlementFailure("SETTLEMENT_INVALID_STATE", `status=${state.status}`);
      return result(false, alert.message, undefined, SETTLEMENT_FAILURE_POLICY[alert.code].errorCode);
    }

    if (options?.simulateFailure) {
      const simulatedCode: SettlementFailureCode =
        options.simulateFailure === "rpc_timeout"
          ? "SETTLEMENT_RPC_TIMEOUT"
          : options.simulateFailure === "tx_rejected"
            ? "SETTLEMENT_TX_REJECTED"
            : "SETTLEMENT_IDEMPOTENCY_CONFLICT";
      const alert = emitSettlementFailure(simulatedCode, `simulated failure=${options.simulateFailure}`);
      return result(false, alert.message, undefined, SETTLEMENT_FAILURE_POLICY[alert.code].errorCode);
    }

    try {
      const paidPlayerCount = state.teams
        .filter((team) => normalizeTeamStatus(team.status) === "paid")
        .reduce((sum, team) => sum + team.players.length, 0);
      const playerBuyinPool = paidPlayerCount * state.funding.entryFeeLux;
      const grossPool =
        playerBuyinPool +
        state.funding.hostSeedPool +
        state.funding.platformSubsidyPool +
        state.funding.sponsorPool;

      const platformFee = Math.round((grossPool * state.funding.platformRakeBps) / 10_000);
      const hostFee = Math.round((platformFee * state.funding.hostRevshareBps) / 10_000);
      const payoutPool = grossPool - platformFee;

      const ranked = [...state.contributions].sort((a, b) => b.score - a.score);
      const totalContribution = ranked.reduce((acc, it) => acc + it.score, 0) || 1;
      const memberPayouts = ranked.map((p) => ({
        playerId: p.playerId,
        amount: Number(((p.score / totalContribution) * payoutPool).toFixed(2))
      }));

      const bill = {
        playerBuyinPool,
        grossPool,
        platformFee,
        hostFee,
        payoutPool,
        memberPayouts,
        settlementId: state.settlement.settlementId ?? mkId("settlement")
      };

      fuelMissionStore.getState().setSettlement(bill);
      fuelMissionStore.getState().setStatus("settled");
      fuelMissionStore.getState().setRemaining(0);
      fuelMissionStore.getState().setPanic(false);
      fuelMissionStore.getState().clearSettlementAlerts();
      fuelMissionStore.getState().markSettlementAttempt(true);
      fuelMissionStore
        .getState()
        .addAuditLog(
          logAudit("settlement", `id=${bill.settlementId}`, {
            eventType: "settlement_succeeded",
            severity: "info"
          })
        );

      if (state.riskMarkers.length > 0) {
        fuelMissionStore.getState().addAuditLog(logAudit("risk_at_settlement", `count=${state.riskMarkers.length}`));
      }

      return result(true, "settlement finalized", bill);
    } catch (error) {
      const alert = emitSettlementFailure(
        "SETTLEMENT_UNKNOWN",
        `unexpected settlement failure: ${(error as Error)?.message ?? "unknown"}`
      );
      return result(false, alert.message, undefined, SETTLEMENT_FAILURE_POLICY[alert.code].errorCode);
    }
  },

  async refreshMissionState() {
    const requestTs = Date.now();
    const pull = await missionEventGateway.pullLatestSnapshot(fuelMissionStore.getState().nodes);
    fuelMissionStore.getState().addWsLatencySample(Math.max(0, Date.now() - requestTs));
    fuelMissionStore.getState().setNodes(pull.nodes);
    fuelMissionStore.getState().setStaleSnapshot(pull.stale);
    this.syncUrgencyFeed({ freezeWhenStale: pull.stale });
    fuelMissionStore
      .getState()
      .addAuditLog(logAudit("refresh_snapshot", `source=${pull.source}:stale=${pull.stale}`));

    return result(true, "snapshot refreshed", pull);
  }
};

fuelMissionService.syncUrgencyFeed();
