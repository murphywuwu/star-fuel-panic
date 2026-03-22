import { createStore } from "zustand/vanilla";
import type { MemberScoreLine, ScoreBoard, ScoreEvent, ScoreRejectAuditLog, TeamScoreLine } from "@/types/fuelMission";

const EVENT_FEED_CAP = 40;
const REJECTION_FEED_CAP = 80;

interface ScoreState {
  scoreBoard: ScoreBoard | null;
  eventFeed: ScoreEvent[];
  rejectionFeed: ScoreRejectAuditLog[];
}

interface ScoreActions {
  setScoreBoard: (board: ScoreBoard) => void;
  appendEvent: (event: ScoreEvent) => void;
  appendRejection: (audit: ScoreRejectAuditLog) => void;
  clearFeed: () => void;
  resetAll: () => void;
}

export type ScoreStore = ScoreState & ScoreActions;

const initialState: ScoreState = {
  scoreBoard: null,
  eventFeed: [],
  rejectionFeed: []
};

export const scoreStore = createStore<ScoreStore>()((set) => ({
  ...initialState,
  setScoreBoard: (scoreBoard) => set({ scoreBoard }),
  appendEvent: (event) =>
    set((state) => ({
      eventFeed: [event, ...state.eventFeed].slice(0, EVENT_FEED_CAP)
    })),
  appendRejection: (audit) =>
    set((state) => ({
      rejectionFeed: [audit, ...state.rejectionFeed].slice(0, REJECTION_FEED_CAP)
    })),
  clearFeed: () => set((state) => ({ ...state, eventFeed: [], rejectionFeed: [] })),
  resetAll: () => set({ ...initialState })
}));

export function selectLiveScore(state: ScoreState): TeamScoreLine[] {
  return state.scoreBoard?.teams ?? [];
}

export function selectMyScore(state: ScoreState, walletAddress: string): MemberScoreLine | null {
  if (!state.scoreBoard) {
    return null;
  }

  for (const team of state.scoreBoard.teams) {
    const member = team.members.find((item) => item.walletAddress === walletAddress);
    if (member) {
      return member;
    }
  }

  return null;
}

export function selectRecentEvents(state: ScoreState, limit = 10): ScoreEvent[] {
  return state.eventFeed.slice(0, Math.max(1, limit));
}
