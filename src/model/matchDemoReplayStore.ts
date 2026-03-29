import { createStore } from "zustand/vanilla";
import type { DemoReplayFrame, DemoReplayScenario } from "@/types/matchDemoReplay";
import { buildDemoReplayFrame, DEFAULT_MATCH_DEMO_REPLAY_SCENARIO } from "@/utils/matchDemoReplayScenario";

interface MatchDemoReplayState {
  scenario: DemoReplayScenario;
  playbackSec: number;
  loopSec: number;
  settleHoldSec: number;
  isPlaying: boolean;
  frame: DemoReplayFrame;
}

interface MatchDemoReplayActions {
  setPlaybackSec: (playbackSec: number) => void;
  setPlaying: (isPlaying: boolean) => void;
  setFrame: (frame: DemoReplayFrame) => void;
  reset: () => void;
}

export type MatchDemoReplayStore = MatchDemoReplayState & MatchDemoReplayActions;

const initialScenario = DEFAULT_MATCH_DEMO_REPLAY_SCENARIO;
const initialFrame = buildDemoReplayFrame(initialScenario, 0);

const initialState: MatchDemoReplayState = {
  scenario: initialScenario,
  playbackSec: 0,
  loopSec: initialScenario.loopSec,
  settleHoldSec: initialScenario.settleHoldSec,
  isPlaying: false,
  frame: initialFrame
};

export const matchDemoReplayStore = createStore<MatchDemoReplayStore>()((set) => ({
  ...initialState,
  setPlaybackSec: (playbackSec) => set({ playbackSec }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setFrame: (frame) => set({ frame }),
  reset: () => set({ ...initialState })
}));
