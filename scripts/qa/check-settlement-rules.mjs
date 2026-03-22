#!/usr/bin/env node
import assert from "node:assert/strict";

const ratios = {
  1: [1.0],
  2: [0.7, 0.3],
  3: [0.6, 0.3, 0.1]
};

function getTeamRatios(teamCount) {
  if (teamCount <= 0) return [];
  if (teamCount === 1) return ratios[1];
  if (teamCount === 2) return ratios[2];
  return ratios[3];
}

function allocateByRatios(total, ratioList, length) {
  const payouts = new Array(length).fill(0);
  let allocated = 0;

  for (let i = 0; i < ratioList.length && i < length; i += 1) {
    const isLastRatio = i === ratioList.length - 1;
    const amount = isLastRatio ? Number((total - allocated).toFixed(2)) : Number((total * ratioList[i]).toFixed(2));
    payouts[i] = Math.max(0, amount);
    allocated = Number((allocated + payouts[i]).toFixed(2));
  }

  return payouts;
}

function allocateMembers(teamPrize, scores) {
  const total = scores.reduce((sum, item) => sum + item, 0);
  if (total <= 0) {
    return scores.map(() => 0);
  }

  const payouts = [];
  let allocated = 0;
  for (let i = 0; i < scores.length; i += 1) {
    const score = scores[i];
    if (score <= 0) {
      payouts.push(0);
      continue;
    }

    const isLast = i === scores.length - 1;
    const ratio = score / total;
    const amount = isLast ? Number((teamPrize - allocated).toFixed(2)) : Number((teamPrize * ratio).toFixed(2));
    const safe = Math.max(0, amount);
    payouts.push(safe);
    allocated = Number((allocated + safe).toFixed(2));
  }

  return payouts;
}

assert.deepEqual(getTeamRatios(1), [1]);
assert.deepEqual(getTeamRatios(2), [0.7, 0.3]);
assert.deepEqual(getTeamRatios(3), [0.6, 0.3, 0.1]);
assert.deepEqual(getTeamRatios(4), [0.6, 0.3, 0.1]);

assert.deepEqual(allocateByRatios(1000, getTeamRatios(1), 1), [1000]);
assert.deepEqual(allocateByRatios(1000, getTeamRatios(2), 2), [700, 300]);
assert.deepEqual(allocateByRatios(1000, getTeamRatios(3), 3), [600, 300, 100]);
assert.deepEqual(allocateByRatios(1000, getTeamRatios(4), 4), [600, 300, 100, 0]);

const memberPayout = allocateMembers(600, [60, 40, 0]);
assert.deepEqual(memberPayout, [360, 240, 0]);

console.log("[qa] pass: team ratio split (1/2/3/4+) and zero-score member payout validated.");
