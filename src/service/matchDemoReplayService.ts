import { matchDemoReplayStore } from "@/model/matchDemoReplayStore";
import type { MatchDemoReplayStore } from "@/model/matchDemoReplayStore";
import { buildDemoReplayFrame } from "@/utils/matchDemoReplayScenario";

const TICK_MS = 250;
const PANIC_JUMP_SEC = 40;

function roundPlaybackSec(value: number) {
  return Math.round(value * 100) / 100;
}

class MatchDemoReplayServiceImpl {
  private timer: ReturnType<typeof setInterval> | null = null;

  subscribe(listener: () => void) {
    return matchDemoReplayStore.subscribe(listener);
  }

  getSnapshot(): MatchDemoReplayStore {
    return matchDemoReplayStore.getState();
  }

  start() {
    const state = matchDemoReplayStore.getState();
    if (this.timer) {
      state.setPlaying(true);
      return;
    }

    state.setPlaying(true);
    this.timer = setInterval(() => {
      this.advance(TICK_MS / 1000);
    }, TICK_MS);
  }

  pause() {
    const state = matchDemoReplayStore.getState();
    state.setPlaying(false);

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  stop() {
    this.pause();
  }

  replay() {
    const state = matchDemoReplayStore.getState();
    state.setPlaybackSec(0);
    state.setFrame(buildDemoReplayFrame(state.scenario, 0));
    this.start();
  }

  jumpToPanic() {
    const state = matchDemoReplayStore.getState();
    const clampedPanicSec = Math.min(PANIC_JUMP_SEC, state.loopSec);
    state.setPlaybackSec(clampedPanicSec);
    state.setFrame(buildDemoReplayFrame(state.scenario, clampedPanicSec));
  }

  reset() {
    this.pause();
    matchDemoReplayStore.getState().reset();
  }

  private advance(stepSec: number) {
    const state = matchDemoReplayStore.getState();
    const cycleSec = state.loopSec + state.settleHoldSec;
    const rawNextSec = state.playbackSec + stepSec;
    const nextPlaybackSec = rawNextSec >= cycleSec ? 0 : roundPlaybackSec(rawNextSec);
    const displaySec = Math.min(nextPlaybackSec, state.loopSec);

    state.setPlaybackSec(nextPlaybackSec);
    state.setFrame(buildDemoReplayFrame(state.scenario, displaySec));
  }
}

export const matchDemoReplayService = new MatchDemoReplayServiceImpl();
