import assert from "node:assert/strict";
import test from "node:test";
import { getPlayerProfile } from "../../../server/playerRuntime.ts";

test("aggregates player profile stats across recent matches", () => {
  const profile = getPlayerProfile("0xpilot-alpha");

  assert.equal(profile.address, "0xpilot-alpha");
  assert.equal(profile.totalMatches, 5);
  assert.equal(profile.wins, 5);
  assert.equal(profile.totalScore, 384);
  assert.equal(profile.totalEarnings, 883.25);
  assert.equal(profile.reputationScore, 88);
  assert.deepEqual(
    profile.recentMatches.map((match) => ({
      matchId: match.matchId,
      rank: match.rank,
      score: match.score,
      earnings: match.earnings
    })),
    [
      { matchId: "mission-orbit-9", rank: 1, score: 36, earnings: 132.24 },
      { matchId: "mission-gate-12", rank: 1, score: 78, earnings: 190.13 },
      { matchId: "mission-ssu-7", rank: 1, score: 120, earnings: 246.86 },
      { matchId: "mission-kite-2", rank: 1, score: 52, earnings: 111.12 },
      { matchId: "mission-peri-4", rank: 1, score: 98, earnings: 202.9 }
    ]
  );
});

test("returns zeroed stats for unknown players", () => {
  const profile = getPlayerProfile("0xunknown-pilot");

  assert.equal(profile.totalMatches, 0);
  assert.equal(profile.wins, 0);
  assert.equal(profile.totalScore, 0);
  assert.equal(profile.totalEarnings, 0);
  assert.equal(profile.reputationScore, 0);
  assert.deepEqual(profile.recentMatches, []);
});
