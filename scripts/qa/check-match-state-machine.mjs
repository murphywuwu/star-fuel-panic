#!/usr/bin/env node
import assert from "node:assert/strict";

const transitions = {
  lobby: ["pre_start"],
  pre_start: ["running"],
  running: ["panic", "settling"],
  panic: ["settling"],
  settling: ["settled"],
  settled: []
};

function canTransition(from, to) {
  return transitions[from]?.includes(to) ?? false;
}

assert.equal(canTransition("lobby", "pre_start"), true);
assert.equal(canTransition("pre_start", "running"), true);
assert.equal(canTransition("running", "panic"), true);
assert.equal(canTransition("panic", "settling"), true);
assert.equal(canTransition("settling", "settled"), true);

assert.equal(canTransition("lobby", "running"), false);
assert.equal(canTransition("panic", "running"), false);
assert.equal(canTransition("settled", "running"), false);

function deriveRunningStatus(remainingSec) {
  if (remainingSec <= 0) {
    return "settling";
  }
  if (remainingSec <= 90) {
    return "panic";
  }
  return "running";
}

assert.equal(deriveRunningStatus(91), "running");
assert.equal(deriveRunningStatus(90), "panic");
assert.equal(deriveRunningStatus(1), "panic");
assert.equal(deriveRunningStatus(0), "settling");

console.log("[qa] pass: state transition path and 90s panic threshold validated.");
