import { createStore } from "zustand/vanilla";
import { buildSettlementDemoFrame, DEFAULT_SETTLEMENT_DEMO_SCENARIO } from "@/utils/settlementDemoScenario";
import type { SettlementDemoFrame, SettlementDemoScenario } from "@/types/settlementDemo";

interface SettlementDemoState {
  scenario: SettlementDemoScenario;
  playbackSec: number;
  isPlaying: boolean;
  frame: SettlementDemoFrame;
}

interface SettlementDemoActions {
  setPlaybackSec: (playbackSec: number) => void;
  setPlaying: (isPlaying: boolean) => void;
  setFrame: (frame: SettlementDemoFrame) => void;
  reset: () => void;
}

export type SettlementDemoStore = SettlementDemoState & SettlementDemoActions;

const initialScenario = DEFAULT_SETTLEMENT_DEMO_SCENARIO;
const initialFrame = buildSettlementDemoFrame(initialScenario, 0);

const initialState: SettlementDemoState = {
  scenario: initialScenario,
  playbackSec: 0,
  isPlaying: false,
  frame: initialFrame
};

export const settlementDemoStore = createStore<SettlementDemoStore>()((set) => ({
  ...initialState,
  setPlaybackSec: (playbackSec) => set({ playbackSec }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setFrame: (frame) => set({ frame }),
  reset: () => set({ ...initialState })
}));
