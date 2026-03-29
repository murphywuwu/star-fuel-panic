import { settlementDemoStore } from "@/model/settlementDemoStore";
import type { SettlementDemoStore } from "@/model/settlementDemoStore";
import { buildSettlementDemoFrame } from "@/utils/settlementDemoScenario";

const TICK_MS = 250;

function roundPlaybackSec(value: number) {
  return Math.round(value * 100) / 100;
}

class SettlementDemoServiceImpl {
  private timer: ReturnType<typeof setInterval> | null = null;

  subscribe(listener: () => void) {
    return settlementDemoStore.subscribe(listener);
  }

  getSnapshot(): SettlementDemoStore {
    return settlementDemoStore.getState();
  }

  start() {
    const state = settlementDemoStore.getState();
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
    const state = settlementDemoStore.getState();
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
    const state = settlementDemoStore.getState();
    state.setPlaybackSec(0);
    state.setFrame(buildSettlementDemoFrame(state.scenario, 0));
    this.start();
  }

  jumpToReport() {
    const state = settlementDemoStore.getState();
    const targetSec = state.scenario.reportStartSec;
    state.setPlaybackSec(targetSec);
    state.setFrame(buildSettlementDemoFrame(state.scenario, targetSec));
  }

  reset() {
    this.pause();
    settlementDemoStore.getState().reset();
  }

  private advance(stepSec: number) {
    const state = settlementDemoStore.getState();
    const rawNextSec = state.playbackSec + stepSec;
    const nextPlaybackSec = rawNextSec >= state.scenario.loopSec ? 0 : roundPlaybackSec(rawNextSec);

    state.setPlaybackSec(nextPlaybackSec);
    state.setFrame(buildSettlementDemoFrame(state.scenario, nextPlaybackSec));
  }
}

export const settlementDemoService = new SettlementDemoServiceImpl();
