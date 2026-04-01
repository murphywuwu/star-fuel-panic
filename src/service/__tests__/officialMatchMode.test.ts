import assert from "node:assert/strict";
import test from "node:test";
import {
  OFFICIAL_MATCH_CANCEL_ERROR,
  OFFICIAL_MATCH_CREATE_ERROR,
  OFFICIAL_MATCH_DEFAULTS,
  buildOfficialFreeTargetMatch,
  canAutoCreateOfficialMatch,
  computeOfficialPrizePool,
  evaluateOfficialTrigger,
  evaluateSoloChallenge,
  filterOfficialFreeTargetMatches,
  validateOfficialMatchDeletion,
  validateOfficialMatchManualCreate,
  type OfficialMatchRecord,
  type OfficialNodeSnapshot
} from "@/service/officialMatchMode.ts";

function buildNode(overrides: Partial<OfficialNodeSnapshot> = {}): OfficialNodeSnapshot {
  return {
    id: "node-critical-7",
    name: "SSU-Frontier-7",
    fillRatio: 0.12,
    isPublic: true,
    ...overrides
  };
}

function buildOfficialMatch(overrides: Partial<OfficialMatchRecord> = {}): OfficialMatchRecord {
  return {
    id: "official-node-critical-7",
    status: "lobby",
    creationMode: "free",
    prizePool: 500,
    entryFee: 100,
    platformSubsidy: 200,
    targetNodeIds: [],
    scoringMode: "weighted",
    hostAddress: null,
    triggerNodeId: "node-critical-7",
    triggerNodeName: "SSU-Frontier-7",
    durationMinutes: 10,
    minTeams: 2,
    maxTeams: 8,
    paidTeams: 0,
    paidEntryFees: 0,
    ...overrides
  };
}

test("API-005 filters official free target matches and preserves Mode 1 fields", () => {
  const official = buildOfficialMatch();
  const hosted = buildOfficialMatch({
    id: "hosted-1",
    creationMode: "precision",
    scoringMode: "volume",
    hostAddress: "0xhost",
    targetNodeIds: ["node-critical-7"]
  });

  const filtered = filterOfficialFreeTargetMatches([official, hosted]);

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, official.id);
  assert.equal(filtered[0]?.targetNodeIds.length, 0);
  assert.equal(filtered[0]?.scoringMode, "weighted");
  assert.equal(filtered[0]?.hostAddress, null);
  assert.equal(filtered[0]?.platformSubsidy, 200);
});

test("API-006 builds Mode 1 details from trigger node and prize pool formula", () => {
  const match = buildOfficialFreeTargetMatch(buildNode(), {
    platformSubsidy: 240,
    entryFee: 120
  });
  const prizePool = computeOfficialPrizePool({
    platformSubsidy: 240,
    paidEntryFees: 360
  });

  assert.equal(match.creationMode, "free");
  assert.equal(match.triggerNodeId, "node-critical-7");
  assert.equal(match.targetNodeIds.length, 0);
  assert.equal(match.durationMinutes, OFFICIAL_MATCH_DEFAULTS.durationMinutes);
  assert.equal(match.minTeams, OFFICIAL_MATCH_DEFAULTS.minTeams);
  assert.equal(match.maxTeams, OFFICIAL_MATCH_DEFAULTS.maxTeams);
  assert.equal(prizePool, 600);
});

test("API-007 auto-creates Mode 1 only for public critical nodes without active official lobby", () => {
  assert.deepEqual(canAutoCreateOfficialMatch({ node: buildNode(), existingMatches: [] }), {
    shouldCreate: true,
    reason: "TRIGGERED"
  });

  assert.deepEqual(
    canAutoCreateOfficialMatch({
      node: buildNode({ fillRatio: 0.24 }),
      existingMatches: []
    }),
    {
      shouldCreate: false,
      reason: "FILL_RATIO_NOT_CRITICAL"
    }
  );

  assert.deepEqual(
    canAutoCreateOfficialMatch({
      node: buildNode(),
      existingMatches: [buildOfficialMatch()]
    }),
    {
      shouldCreate: false,
      reason: "LOBBY_MATCH_ALREADY_EXISTS"
    }
  );
});

test("API-008 applies Mode 1 default configuration", () => {
  const match = buildOfficialFreeTargetMatch(buildNode());

  assert.equal(match.entryFee, 100);
  assert.equal(match.minTeams, 2);
  assert.equal(match.maxTeams, 8);
  assert.equal(match.durationMinutes, 10);
  assert.equal(match.scoringMode, "weighted");
  assert.deepEqual(match.targetNodeIds, []);
});

test("API-009 dynamic trigger moves lobby to prestart when paid teams reach max", () => {
  const result = evaluateOfficialTrigger({
    status: "lobby",
    minTeams: 2,
    maxTeams: 8,
    paidTeams: 8
  });

  assert.deepEqual(result, {
    nextStatus: "prestart",
    triggerMode: "dynamic",
    countdownSec: 30,
    allowJoinDuringCountdown: false
  });
});

test("API-010 minimum threshold trigger keeps lobby open during recruitment and upgrades at timeout/full cap", () => {
  const recruiting = evaluateOfficialTrigger({
    status: "lobby",
    minTeams: 2,
    maxTeams: 8,
    paidTeams: 2,
    remainingRecruitmentSec: 180
  });

  assert.deepEqual(recruiting, {
    nextStatus: "lobby",
    triggerMode: "min_threshold",
    countdownSec: 180,
    allowJoinDuringCountdown: true
  });

  const timedOut = evaluateOfficialTrigger({
    status: "lobby",
    minTeams: 2,
    maxTeams: 8,
    paidTeams: 2,
    remainingRecruitmentSec: 0
  });

  assert.deepEqual(timedOut, {
    nextStatus: "prestart",
    triggerMode: "min_threshold",
    countdownSec: 30,
    allowJoinDuringCountdown: false
  });

  const fullDuringRecruitment = evaluateOfficialTrigger({
    status: "lobby",
    minTeams: 2,
    maxTeams: 8,
    paidTeams: 8,
    remainingRecruitmentSec: 120
  });

  assert.equal(fullDuringRecruitment.triggerMode, "dynamic");
  assert.equal(fullDuringRecruitment.nextStatus, "prestart");
});

test("API-030 single-team wait stays in lobby first and then upgrades to solo challenge prestart", () => {
  const waiting = evaluateOfficialTrigger({
    status: "lobby",
    minTeams: 2,
    maxTeams: 8,
    paidTeams: 1,
    singleTeamElapsedSec: 120,
    maxSingleTeamWaitSec: 300
  });

  assert.deepEqual(waiting, {
    nextStatus: "lobby",
    triggerMode: null,
    countdownSec: 180,
    allowJoinDuringCountdown: true,
    soloChallengeMode: false
  });

  const soloChallenge = evaluateOfficialTrigger({
    status: "lobby",
    minTeams: 2,
    maxTeams: 8,
    paidTeams: 1,
    singleTeamElapsedSec: 300,
    maxSingleTeamWaitSec: 300
  });

  assert.deepEqual(soloChallenge, {
    nextStatus: "prestart",
    triggerMode: "min_threshold",
    countdownSec: 30,
    allowJoinDuringCountdown: false,
    soloChallengeMode: true
  });
});

test("API-011 solo challenge mode requires 80% fill ratio and awards extra 10% subsidy on success", () => {
  const success = evaluateSoloChallenge({
    finalFillRatio: 0.81,
    prizePool: 500,
    platformSubsidy: 200
  });

  assert.equal(success.mode, "solo_challenge");
  assert.equal(success.targetFillRatio, 0.8);
  assert.equal(success.success, true);
  assert.equal(success.bonusSubsidyAwarded, 20);
  assert.equal(success.payout, 520);
  assert.equal(success.entryFeeRefunded, false);
  assert.equal(success.reclaimedPlatformSubsidy, 0);

  const failed = evaluateSoloChallenge({
    finalFillRatio: 0.62,
    prizePool: 500,
    platformSubsidy: 200
  });

  assert.equal(failed.success, false);
  assert.equal(failed.payout, 500);
  assert.equal(failed.entryFeeRefunded, false);
  assert.equal(failed.reclaimedPlatformSubsidy, 200);
});

test("API-012 rejects manual creation of official free target matches", () => {
  const result = validateOfficialMatchManualCreate("free");

  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.equal(result.errorCode, OFFICIAL_MATCH_CREATE_ERROR);
});

test("API-013 rejects deletion of official free target matches even in lobby", () => {
  const result = validateOfficialMatchDeletion({
    creationMode: "free",
    status: "lobby"
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 403);
  assert.equal(result.errorCode, OFFICIAL_MATCH_CANCEL_ERROR);
});
