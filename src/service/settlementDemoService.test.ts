import assert from "node:assert/strict";
import test from "node:test";

import { settlementDemoService } from "./settlementDemoService.ts";

test.beforeEach(() => {
  settlementDemoService.reset();
});

test.after(() => {
  settlementDemoService.reset();
});

test("settlementDemoService jumpToReport moves the frame into report mode", () => {
  settlementDemoService.jumpToReport();

  const state = settlementDemoService.getSnapshot();
  assert.equal(Math.floor(state.playbackSec), 7);
  assert.equal(state.frame.phase, "report");
  assert.equal(state.frame.progress, 100);
  assert.equal(state.frame.hero.championTeamName, "IRON FROGS");
});

test("settlementDemoService replay resets playback to the settling opening frame", () => {
  settlementDemoService.jumpToReport();
  settlementDemoService.replay();
  settlementDemoService.pause();

  const state = settlementDemoService.getSnapshot();
  assert.equal(state.playbackSec, 0);
  assert.equal(state.frame.phase, "settling");
  assert.equal(state.frame.progress, 18);
  assert.equal(state.frame.statusTitle, "SIMULATED SETTLING");
});
