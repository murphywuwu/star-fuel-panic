import {
  deriveCriticalNodes,
  deriveTopContributors,
  fuelMissionStore,
  type FuelMissionStore
} from "@/model/fuelMissionStore";
import { missionEventGateway } from "@/service/missionEventGateway";
import type {
  AuditLog,
  ControllerResult,
  FundingSources,
  FuelMissionErrorCode,
  MissionEvent,
  MissionPhase,
  NodeDeficitSnapshot,
  RiskMarker,
  RoomState,
  TeamRole,
  TeamState
} from "@/types/fuelMission";

const VALID_TRANSITIONS: Record<MissionPhase, MissionPhase[]> = {
  LobbyReady: ["Planning"],
  Planning: ["MatchRunning"],
  MatchRunning: ["FinalSprint", "Settled"],
  FinalSprint: ["Settled"],
  Settled: []
};

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

function logAudit(action: string, detail: string): AuditLog {
  return {
    id: mkId("audit"),
    action,
    detail,
    timestamp: now()
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

export const fuelMissionService = {
  subscribe(listener: () => void) {
    return fuelMissionStore.subscribe(listener);
  },
  getSnapshot(): FuelMissionStore {
    return fuelMissionStore.getState();
  },
  resetForTest() {
    fuelMissionStore.getState().resetAll();
  },

  initMissionState(nodes?: NodeDeficitSnapshot[]) {
    const missionNodes = nodes && nodes.length > 0 ? nodes : fuelMissionStore.getState().nodes;
    fuelMissionStore.getState().setNodes(missionNodes);
    fuelMissionStore.getState().addAuditLog(logAudit("init_mission", `nodes=${missionNodes.length}`));
    return result(true, "mission initialized", missionNodes);
  },

  createFuelRoom(input: {
    hostId: string;
    hostName: string;
    funding?: Partial<FundingSources>;
  }) {
    const state = fuelMissionStore.getState();
    if (state.room && state.phase !== "Settled") {
      fuelMissionStore.getState().addAuditLog(logAudit("create_room_blocked", "room config already locked"));
      return result(false, "room config already locked", undefined, "E_ROOM_CONFIG_LOCKED");
    }

    const mergedFunding: FundingSources = {
      ...state.funding,
      ...input.funding
    };
    const roomId = mkId("room");
    const room: RoomState = {
      roomId,
      hostId: input.hostId,
      hostName: input.hostName,
      configLockHash: hashRoomConfig(input.hostId, mergedFunding),
      rolesLocked: false
    };

    fuelMissionStore.getState().setRoom(room);
    fuelMissionStore.getState().setFunding(mergedFunding);
    fuelMissionStore.getState().setPhase("LobbyReady");
    fuelMissionStore.getState().addAuditLog(logAudit("create_room", `room=${roomId}`));

    return result(true, "room created", {
      roomId,
      configLockHash: room.configLockHash
    });
  },

  joinFuelRoom(input: { teamId: string; playerId: string; name: string }) {
    const state = fuelMissionStore.getState();
    if (!state.room) {
      fuelMissionStore.getState().addAuditLog(logAudit("join_room_blocked", "room not ready"));
      return result(false, "room not ready", undefined, "E_ROOM_NOT_READY");
    }
    const nextTeams: TeamState[] = state.teams.length
      ? state.teams.map((t) => ({ ...t, players: [...t.players], roles: { ...t.roles } }))
      : [
          { teamId: "team-alpha", name: "Team Alpha", players: [], roles: {} },
          { teamId: "team-beta", name: "Team Beta", players: [], roles: {} }
        ];

    const target = nextTeams.find((t) => t.teamId === input.teamId) ?? nextTeams[0];
    if (!target.players.some((p) => p.playerId === input.playerId)) {
      target.players.push({ playerId: input.playerId, name: input.name });
    }

    fuelMissionStore.getState().setTeams(nextTeams);
    fuelMissionStore.getState().addAuditLog(logAudit("join_room", `${input.playerId}->${target.teamId}`));
    return result(true, "joined room", { teamId: target.teamId, playerCount: target.players.length });
  },

  lockTeamRoles(input: { teamId: string; assignments: Partial<Record<TeamRole, string>> }) {
    const state = fuelMissionStore.getState();
    if (state.phase !== "LobbyReady" && state.phase !== "Planning") {
      fuelMissionStore.getState().addAuditLog(logAudit("lock_roles_blocked", `phase=${state.phase}`));
      return result(false, "role lock window closed", undefined, "E_ROLE_LOCKED");
    }

    const nextTeams = state.teams.map((team) =>
      team.teamId === input.teamId ? { ...team, roles: { ...team.roles, ...input.assignments } } : team
    );

    fuelMissionStore.getState().setTeams(nextTeams);
    if (state.room) {
      fuelMissionStore.getState().setRoom({ ...state.room, rolesLocked: true });
    }
    if (state.phase === "LobbyReady") {
      this.transitionPhase("Planning");
    }
    fuelMissionStore.getState().addAuditLog(logAudit("lock_roles", `team=${input.teamId}`));
    return result(true, "roles locked", { teamId: input.teamId });
  },

  transitionPhase(next: MissionPhase) {
    const curr = fuelMissionStore.getState().phase;
    if (!VALID_TRANSITIONS[curr].includes(next)) {
      fuelMissionStore
        .getState()
        .addAuditLog(logAudit("invalid_transition", `${curr}->${next}`));
      return result(false, "invalid state transition", undefined, "E_INVALID_STATE_TRANSITION");
    }

    fuelMissionStore.getState().setPhase(next);
    fuelMissionStore.getState().addAuditLog(logAudit("transition", `${curr}->${next}`));
    return result(true, "phase moved", { from: curr, to: next });
  },

  recordSupplyEvent(event: Omit<MissionEvent, "createdAt">) {
    const state = fuelMissionStore.getState();
    if (state.phase !== "MatchRunning" && state.phase !== "FinalSprint") {
      fuelMissionStore.getState().addAuditLog(logAudit("supply_event_blocked", `phase=${state.phase}`));
      return result(false, "invalid phase for supply event", undefined, "E_SCORE_EVENT_INVALID");
    }
    if (state.acceptedEventIds.includes(event.eventId)) {
      fuelMissionStore.getState().addAuditLog(logAudit("supply_event_duplicate", `event=${event.eventId}`));
      return result(false, "duplicate supply event", undefined, "E_SCORE_EVENT_INVALID");
    }

    fuelMissionStore.getState().addAcceptedEventId(event.eventId);
    fuelMissionStore.getState().updateNodeFill(event.nodeId, event.fillDelta);
    fuelMissionStore.getState().addContribution(event.playerId, event.playerName, event.contributionDelta);

    const teamId = state.teams.find((t) => t.players.some((p) => p.playerId === event.playerId))?.teamId;
    if (teamId) {
      fuelMissionStore.getState().addTeamScore(teamId, event.contributionDelta);
    }

    fuelMissionStore
      .getState()
      .addAuditLog(logAudit("supply_event", `${event.eventId}:${event.nodeId}:${event.playerId}`));

    const updated = fuelMissionStore.getState();
    const top = deriveTopContributors(updated.contributions, 1)[0];
    if (top && top.score >= 80) {
      fuelMissionStore.getState().addRiskMarker(markRisk("contribution concentration high", "medium"));
    }
    if (event.fillDelta > 0.35 || event.contributionDelta > 120) {
      fuelMissionStore.getState().addRiskMarker(markRisk("abnormal single event impact", "high"));
    }
    const totalContribution = updated.contributions.reduce((acc, p) => acc + p.score, 0) || 1;
    if (top && top.score / totalContribution > 0.65 && updated.contributions.length >= 3) {
      fuelMissionStore.getState().addRiskMarker(markRisk("single player dominates contribution share", "high"));
    }

    return result(true, "supply recorded", {
      criticalNodes: deriveCriticalNodes(updated.nodes),
      topContributors: deriveTopContributors(updated.contributions)
    });
  },

  tickMatch() {
    const state = fuelMissionStore.getState();
    if (state.phase !== "MatchRunning" && state.phase !== "FinalSprint") {
      fuelMissionStore.getState().addAuditLog(logAudit("tick_blocked", `phase=${state.phase}`));
      return result(false, "tick ignored", undefined, "E_INVALID_STATE_TRANSITION");
    }

    fuelMissionStore.getState().tickDown(10);
    const next = fuelMissionStore.getState();

    if (next.countdownSec <= 90 && next.phase === "MatchRunning") {
      this.transitionPhase("FinalSprint");
    }
    if (next.countdownSec === 0) {
      this.finalizeSettlement();
    }

    return result(true, "tick updated", { countdownSec: fuelMissionStore.getState().countdownSec });
  },

  finalizeSettlement() {
    const state = fuelMissionStore.getState();

    if (state.phase === "Settled" && state.settlement.settlementId) {
      return result(true, "idempotent settlement", state.settlement);
    }

    const playerBuyinPool = state.funding.playerCount * state.funding.entryFeeLux;
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
    fuelMissionStore.getState().setPhase("Settled");
    fuelMissionStore.getState().addAuditLog(logAudit("settlement", `id=${bill.settlementId}`));

    if (state.riskMarkers.length > 0) {
      fuelMissionStore.getState().addAuditLog(logAudit("risk_at_settlement", `count=${state.riskMarkers.length}`));
    }

    return result(true, "settlement finalized", bill);
  },

  async refreshMissionState() {
    const pull = await missionEventGateway.pullLatestSnapshot(fuelMissionStore.getState().nodes);
    fuelMissionStore.getState().setNodes(pull.nodes);
    fuelMissionStore.getState().setStaleSnapshot(pull.stale);
    fuelMissionStore
      .getState()
      .addAuditLog(logAudit("refresh_snapshot", `source=${pull.source}:stale=${pull.stale}`));

    return result(true, "snapshot refreshed", pull);
  }
};
