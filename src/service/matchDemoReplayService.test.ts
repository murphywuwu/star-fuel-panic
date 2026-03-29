import assert from "node:assert/strict";
import test from "node:test";

import { matchDemoReplayService } from "./matchDemoReplayService.ts";

test.beforeEach(() => {
  matchDemoReplayService.reset();
});

test.after(() => {
  matchDemoReplayService.reset();
});

test("matchDemoReplayService jumpToPanic moves the frame into panic mode", () => {
  matchDemoReplayService.jumpToPanic();

  const state = matchDemoReplayService.getSnapshot();
  assert.equal(Math.floor(state.playbackSec), 40);
  assert.equal(state.frame.status, "panic");
  assert.equal(state.frame.isPanic, true);
  assert.equal(state.frame.feed[0]?.kind, "panic");
});

test("matchDemoReplayService replay resets playback to the scripted opening frame", () => {
  matchDemoReplayService.jumpToPanic();
  matchDemoReplayService.replay();
  matchDemoReplayService.pause();

  const state = matchDemoReplayService.getSnapshot();
  assert.equal(state.playbackSec, 0);
  assert.equal(state.frame.status, "running");
  assert.equal(state.frame.teams[0]?.teamName, "IRON FROGS");
  assert.equal(state.frame.teams[0]?.score, 1180);
});
