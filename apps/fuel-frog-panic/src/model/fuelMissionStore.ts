import { createStore } from "zustand/vanilla";
import type {
  AuditLog,
  FundingSources,
  MissionPhase,
  NodeDeficitSnapshot,
  PlayerContribution,
  RiskMarker,
  RoomState,
  SettlementBill,
  TeamState
} from "@/types/fuelMission";

export interface FuelMissionState {
  phase: MissionPhase;
  countdownSec: number;
  room: RoomState | null;
  teams: TeamState[];
  funding: FundingSources;
  nodes: NodeDeficitSnapshot[];
  contributions: PlayerContribution[];
  teamScore: Record<string, number>;
  settlement: SettlementBill;
  riskMarkers: RiskMarker[];
  auditLogs: AuditLog[];
  acceptedEventIds: string[];
  staleSnapshot: boolean;
}

interface FuelMissionActions {
  resetAll: () => void;
  setPhase: (phase: MissionPhase) => void;
  tickDown: (sec: number) => void;
  setRoom: (room: RoomState) => void;
  setTeams: (teams: TeamState[]) => void;
  setFunding: (funding: FundingSources) => void;
  setNodes: (nodes: NodeDeficitSnapshot[]) => void;
  updateNodeFill: (nodeId: string, delta: number) => void;
  setCountdown: (sec: number) => void;
  addContribution: (playerId: string, name: string, delta: number) => void;
  addTeamScore: (teamId: string, delta: number) => void;
  setSettlement: (bill: SettlementBill) => void;
  addRiskMarker: (marker: RiskMarker) => void;
  addAuditLog: (log: AuditLog) => void;
  addAcceptedEventId: (eventId: string) => void;
  setStaleSnapshot: (stale: boolean) => void;
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

const initialState: FuelMissionState = {
  phase: "LobbyReady",
  countdownSec: 720,
  room: null,
  teams: [],
  funding: initialFunding,
  nodes: initialNodes,
  contributions: [],
  teamScore: {},
  settlement: {
    grossPool: 0,
    platformFee: 0,
    hostFee: 0,
    payoutPool: 0,
    playerBuyinPool: 0,
    memberPayouts: []
  },
  riskMarkers: [],
  auditLogs: [],
  acceptedEventIds: [],
  staleSnapshot: false
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

export const fuelMissionStore = createStore<FuelMissionStore>()((set) => ({
  ...initialState,
  resetAll: () => set({ ...initialState }),
  setPhase: (phase) => set({ phase }),
  tickDown: (sec) => set((state) => ({ countdownSec: Math.max(0, state.countdownSec - sec) })),
  setRoom: (room) => set({ room }),
  setTeams: (teams) => set({ teams }),
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
  setCountdown: (sec) => set({ countdownSec: sec }),
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
  setSettlement: (settlement) => set({ settlement }),
  addRiskMarker: (marker) => set((state) => ({ riskMarkers: [marker, ...state.riskMarkers].slice(0, 20) })),
  addAuditLog: (log) => set((state) => ({ auditLogs: [log, ...state.auditLogs].slice(0, 200) })),
  addAcceptedEventId: (eventId) =>
    set((state) => ({
      acceptedEventIds: state.acceptedEventIds.includes(eventId) ? state.acceptedEventIds : [...state.acceptedEventIds, eventId]
    })),
  setStaleSnapshot: (stale) => set({ staleSnapshot: stale })
}));
