import { createStore } from "zustand/vanilla";
import type {
  AuditLog,
  FundingSources,
  MatchStatus,
  MissionValueIntro,
  MissionPhase,
  NodeDeficitSnapshot,
  ObservabilityMetrics,
  PlayerContribution,
  RescueCandidate,
  RiskMarker,
  RoomState,
  SettlementFailureAlert,
  SettlementBill,
  TeamRole,
  TeamState,
  UrgencyFeedItem
} from "@/types/fuelMission";

export interface FuelMissionState {
  // Legacy aliases kept for compatibility with existing views.
  phase: MissionPhase;
  countdownSec: number;

  // Canonical F-004 match state.
  status: MatchStatus;
  remainingSec: number;
  isPanic: boolean;

  missionValueIntro: MissionValueIntro;
  room: RoomState | null;
  teams: TeamState[];
  myTeamId: string | null;
  funding: FundingSources;
  nodes: NodeDeficitSnapshot[];
  contributions: PlayerContribution[];
  teamScore: Record<string, number>;
  urgencyFeed: UrgencyFeedItem[];
  urgencyIndexHistory: Record<string, number[]>;
  urgencyConfidenceScore: number;
  selectedUrgencyNodeId: string | null;
  rescueCandidates: RescueCandidate[];
  isIntelExpanded: boolean;
  matchWindowStartMs: number | null;
  matchWindowEndMs: number | null;
  settlement: SettlementBill;
  riskMarkers: RiskMarker[];
  settlementAlerts: SettlementFailureAlert[];
  auditLogs: AuditLog[];
  acceptedEventIds: string[];
  staleSnapshot: boolean;
  observability: ObservabilityMetrics;
  eventLagSamples: number[];
  wsLatencySamples: number[];
}

interface FuelMissionActions {
  resetAll: () => void;
  setPhase: (phase: MissionPhase) => void;
  setStatus: (status: MatchStatus) => void;
  tickDown: (sec: number) => void;
  setRoom: (room: RoomState) => void;
  setTeams: (teams: TeamState[]) => void;
  setMyTeamId: (teamId: string | null) => void;
  setFunding: (funding: FundingSources) => void;
  setNodes: (nodes: NodeDeficitSnapshot[]) => void;
  updateNodeFill: (nodeId: string, delta: number) => void;
  setCountdown: (sec: number) => void;
  setRemaining: (sec: number) => void;
  setPanic: (panic: boolean) => void;
  addContribution: (playerId: string, name: string, delta: number) => void;
  addTeamScore: (teamId: string, delta: number) => void;
  setUrgencyFeed: (feed: UrgencyFeedItem[]) => void;
  setUrgencyIndexHistory: (history: Record<string, number[]>) => void;
  setUrgencyConfidenceScore: (score: number) => void;
  setSelectedUrgencyNodeId: (nodeId: string | null) => void;
  setRescueCandidates: (candidates: RescueCandidate[]) => void;
  setIntelExpanded: (expanded: boolean) => void;
  setMatchWindow: (startMs: number, endMs: number) => void;
  clearMatchWindow: () => void;
  setSettlement: (bill: SettlementBill) => void;
  addRiskMarker: (marker: RiskMarker) => void;
  addSettlementAlert: (alert: SettlementFailureAlert) => void;
  clearSettlementAlerts: () => void;
  addAuditLog: (log: AuditLog) => void;
  addAcceptedEventId: (eventId: string) => void;
  setStaleSnapshot: (stale: boolean) => void;
  addEventLagSample: (ms: number) => void;
  addWsLatencySample: (ms: number) => void;
  markSettlementAttempt: (success: boolean) => void;
  setObservability: (metrics: ObservabilityMetrics) => void;
}

export type FuelMissionStore = FuelMissionState & FuelMissionActions;

const initialFunding: FundingSources = {
  entryFeeLux: 100,
  playerCount: 6,
  hostSeedPool: 0,
  platformSubsidyPool: 0,
  sponsorPool: 0,
  platformRakeBps: 1000,
  hostRevshareBps: 4000
};

const initialNodes: NodeDeficitSnapshot[] = [
  { nodeId: "n1", name: "Aster Relay", fillRatio: 0.3, riskWeight: 1.2, completed: false },
  { nodeId: "n2", name: "Kite Gate", fillRatio: 0.55, riskWeight: 1.5, completed: false },
  { nodeId: "n3", name: "Vega Corridor", fillRatio: 0.2, riskWeight: 1.8, completed: false }
];

const initialMissionValueIntro: MissionValueIntro = {
  gameWhatText: "10-15m tactical fuel rescue operation across critical relay nodes.",
  gameWhyText: "Convert logistics chaos into clear actions, then split rewards by result + contribution."
};

const initialObservability: ObservabilityMetrics = {
  eventLagMs: {
    latest: 0,
    avg: 0,
    p95: 0,
    sampleCount: 0
  },
  wsLatencyMs: {
    latest: 0,
    avg: 0,
    p95: 0,
    sampleCount: 0
  },
  settlementSuccess: {
    attempts: 0,
    successes: 0,
    rate: 0
  }
};

const METRIC_SAMPLE_CAP = 120;

function buildMetricSummary(samples: number[]) {
  if (samples.length === 0) {
    return {
      latest: 0,
      avg: 0,
      p95: 0,
      sampleCount: 0
    };
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const p95Index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * 0.95) - 1));
  const avg = samples.reduce((sum, value) => sum + value, 0) / samples.length;

  return {
    latest: samples[samples.length - 1] ?? 0,
    avg: Number(avg.toFixed(2)),
    p95: Number((sorted[p95Index] ?? 0).toFixed(2)),
    sampleCount: samples.length
  };
}

const initialState: FuelMissionState = {
  phase: "lobby",
  countdownSec: 30,
  status: "lobby",
  remainingSec: 30,
  isPanic: false,
  missionValueIntro: initialMissionValueIntro,
  room: null,
  teams: [],
  myTeamId: null,
  funding: initialFunding,
  nodes: initialNodes,
  contributions: [],
  teamScore: {},
  urgencyFeed: [],
  urgencyIndexHistory: {},
  urgencyConfidenceScore: 1,
  selectedUrgencyNodeId: null,
  rescueCandidates: [],
  isIntelExpanded: false,
  matchWindowStartMs: null,
  matchWindowEndMs: null,
  settlement: {
    grossPool: 0,
    platformFee: 0,
    hostFee: 0,
    payoutPool: 0,
    playerBuyinPool: 0,
    memberPayouts: []
  },
  riskMarkers: [],
  settlementAlerts: [],
  auditLogs: [],
  acceptedEventIds: [],
  staleSnapshot: false,
  observability: initialObservability,
  eventLagSamples: [],
  wsLatencySamples: []
};

export function deriveTopContributors(contributions: PlayerContribution[], limit = 3) {
  return [...contributions].sort((a, b) => b.score - a.score).slice(0, limit);
}

export function deriveCriticalNodes(nodes: NodeDeficitSnapshot[]) {
  return [...nodes]
    .sort((a, b) => a.fillRatio - b.fillRatio)
    .slice(0, 2)
    .map((n) => n.nodeId);
}

export interface TeamSlotView {
  slotId: string;
  role: TeamRole;
  filled: boolean;
  member?: TeamState["players"][number];
}

const DEFAULT_ROLE_SLOTS: TeamRole[] = ["Collector", "Hauler", "Escort"];

export function selectMyTeam(teams: TeamState[], myTeamId: string | null): TeamState | null {
  if (!myTeamId) {
    return null;
  }
  return teams.find((team) => team.teamId === myTeamId) ?? null;
}

export function selectMyRole(teams: TeamState[], myTeamId: string | null): TeamRole | null {
  const myTeam = selectMyTeam(teams, myTeamId);
  if (!myTeam) {
    return null;
  }

  const firstAssigned = Object.entries(myTeam.roles).find(([, playerId]) =>
    myTeam.players.some((player) => player.playerId === playerId)
  );

  return (firstAssigned?.[0] as TeamRole | undefined) ?? null;
}

export function selectTeamSlots(team: TeamState): TeamSlotView[] {
  const slots =
    team.roleSlots && team.roleSlots.length > 0
      ? team.roleSlots
      : (Object.keys(team.roles) as TeamRole[]).length > 0
        ? (Object.keys(team.roles) as TeamRole[])
        : DEFAULT_ROLE_SLOTS;

  const usedPlayerIds = new Set<string>();

  return slots.map((role, index) => {
    const mappedPlayerId = team.roles[role];
    let member = mappedPlayerId ? team.players.find((player) => player.playerId === mappedPlayerId) : undefined;

    if (member && usedPlayerIds.has(member.playerId)) {
      member = undefined;
    }
    if (!member) {
      member = team.players.find((player) => player.role === role && !usedPlayerIds.has(player.playerId));
    }

    if (member) {
      usedPlayerIds.add(member.playerId);
    }

    return {
      slotId: `${team.teamId}:${role}:${index}`,
      role,
      filled: Boolean(member),
      member
    };
  });
}

export function selectIsTeamReady(team: TeamState): boolean {
  return selectTeamSlots(team).every((slot) => slot.filled);
}

function toCanonicalStatus(status: MissionPhase): MatchStatus {
  if (status === "lobby" || status === "LobbyReady") return "lobby";
  if (status === "pre_start" || status === "Planning") return "pre_start";
  if (status === "running" || status === "MatchRunning") return "running";
  if (status === "panic" || status === "FinalSprint") return "panic";
  if (status === "settling") return "settling";
  return "settled";
}

function normalizeStatus(status: MissionPhase) {
  const canonical = toCanonicalStatus(status);
  return {
    phase: canonical,
    status: canonical,
    isPanic: canonical === "panic"
  };
}

export const fuelMissionStore = createStore<FuelMissionStore>()((set) => ({
  ...initialState,
  resetAll: () => set({ ...initialState }),
  setPhase: (phase) =>
    set(() => ({
      ...normalizeStatus(phase)
    })),
  setStatus: (status) =>
    set(() => ({
      ...normalizeStatus(status)
    })),
  tickDown: (sec) =>
    set((state) => {
      const remainingSec = Math.max(0, state.remainingSec - sec);
      return {
        remainingSec,
        countdownSec: remainingSec
      };
    }),
  setRoom: (room) => set({ room }),
  setTeams: (teams) =>
    set((state) => ({
      teams,
      myTeamId: teams.some((team) => team.teamId === state.myTeamId) ? state.myTeamId : null
    })),
  setMyTeamId: (myTeamId) => set({ myTeamId }),
  setFunding: (funding) => set({ funding }),
  setNodes: (nodes) => set({ nodes }),
  updateNodeFill: (nodeId, delta) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.nodeId !== nodeId) return node;
        const fillRatio = Math.max(0, Math.min(1, node.fillRatio + delta));
        return {
          ...node,
          fillRatio,
          completed: fillRatio >= 1
        };
      })
    })),
  setCountdown: (sec) =>
    set(() => ({
      countdownSec: Math.max(0, sec),
      remainingSec: Math.max(0, sec)
    })),
  setRemaining: (sec) =>
    set(() => ({
      remainingSec: Math.max(0, sec),
      countdownSec: Math.max(0, sec)
    })),
  setPanic: (panic) => set({ isPanic: panic }),
  addContribution: (playerId, name, delta) =>
    set((state) => {
      const next = [...state.contributions];
      const idx = next.findIndex((p) => p.playerId === playerId);
      if (idx >= 0) {
        next[idx] = { ...next[idx], score: next[idx].score + delta };
      } else {
        next.push({ playerId, name, score: delta });
      }
      next.sort((a, b) => b.score - a.score);
      return { contributions: next };
    }),
  addTeamScore: (teamId, delta) =>
    set((state) => ({
      teamScore: {
        ...state.teamScore,
        [teamId]: (state.teamScore[teamId] ?? 0) + delta
      }
    })),
  setUrgencyFeed: (urgencyFeed) => set({ urgencyFeed }),
  setUrgencyIndexHistory: (urgencyIndexHistory) => set({ urgencyIndexHistory }),
  setUrgencyConfidenceScore: (urgencyConfidenceScore) => set({ urgencyConfidenceScore }),
  setSelectedUrgencyNodeId: (selectedUrgencyNodeId) => set({ selectedUrgencyNodeId }),
  setRescueCandidates: (rescueCandidates) => set({ rescueCandidates }),
  setIntelExpanded: (isIntelExpanded) => set({ isIntelExpanded }),
  setMatchWindow: (startMs, endMs) => set({ matchWindowStartMs: startMs, matchWindowEndMs: endMs }),
  clearMatchWindow: () => set({ matchWindowStartMs: null, matchWindowEndMs: null }),
  setSettlement: (settlement) => set({ settlement }),
  addRiskMarker: (marker) => set((state) => ({ riskMarkers: [marker, ...state.riskMarkers].slice(0, 20) })),
  addSettlementAlert: (alert) =>
    set((state) => ({ settlementAlerts: [alert, ...state.settlementAlerts].slice(0, 20) })),
  clearSettlementAlerts: () => set({ settlementAlerts: [] }),
  addAuditLog: (log) => set((state) => ({ auditLogs: [log, ...state.auditLogs].slice(0, 200) })),
  addAcceptedEventId: (eventId) =>
    set((state) => ({
      acceptedEventIds: state.acceptedEventIds.includes(eventId) ? state.acceptedEventIds : [...state.acceptedEventIds, eventId]
    })),
  setStaleSnapshot: (stale) => set({ staleSnapshot: stale }),
  addEventLagSample: (ms) =>
    set((state) => {
      const eventLagSamples = [...state.eventLagSamples, Math.max(0, ms)].slice(-METRIC_SAMPLE_CAP);
      return {
        eventLagSamples,
        observability: {
          ...state.observability,
          eventLagMs: buildMetricSummary(eventLagSamples)
        }
      };
    }),
  addWsLatencySample: (ms) =>
    set((state) => {
      const wsLatencySamples = [...state.wsLatencySamples, Math.max(0, ms)].slice(-METRIC_SAMPLE_CAP);
      return {
        wsLatencySamples,
        observability: {
          ...state.observability,
          wsLatencyMs: buildMetricSummary(wsLatencySamples)
        }
      };
    }),
  markSettlementAttempt: (success) =>
    set((state) => {
      const attempts = state.observability.settlementSuccess.attempts + 1;
      const successes = state.observability.settlementSuccess.successes + (success ? 1 : 0);
      return {
        observability: {
          ...state.observability,
          settlementSuccess: {
            attempts,
            successes,
            rate: Number((successes / Math.max(1, attempts)).toFixed(4))
          }
        }
      };
    }),
  setObservability: (observability) => set({ observability })
}));
