import assert from "node:assert/strict";
import test from "node:test";
import type { Match } from "@/types/match.ts";
import type { Team, TeamMember } from "@/types/team.ts";
import {
  buildSettlementBill,
  getSettlementStatus,
  materializeSettlementFact,
  resolveSettlementBill
} from "@/server/settlementRuntime.ts";
import { __setMatchDetailForTests, resetMatchRuntime } from "@/server/matchRuntime.ts";
import { createEmptyProjectionState, readRuntimeProjectionState, writeRuntimeProjectionState } from "@/server/runtimeProjectionStore.ts";

function buildMatch(status: Match["status"] = "settled", prizePool = 1200): Match {
  return {
    id: "match-001",
    onChainId: "chain-001",
    status,
    creationMode: "free",
    targetNodeIds: ["node-001"],
    prizePool,
    hostPrizePool: 0,
    entryFee: 100,
    minTeams: 1,
    maxTeams: 4,
    durationMinutes: 10,
    scoringMode: "weighted",
    challengeMode: "normal",
    triggerMode: "dynamic",
    startedAt: "2026-03-23T00:00:00.000Z",
    endedAt: "2026-03-23T00:10:00.000Z",
    createdBy: "system",
    hostAddress: null,
    createdAt: "2026-03-23T00:00:00.000Z"
  };
}

function buildTeam(index: number, totalScore: number): Team {
  return {
    id: `team-${index}`,
    matchId: "match-001",
    name: `Team ${index}`,
    captainAddress: `0xcaptain${index}`,
    maxSize: 3,
    isLocked: true,
    hasPaid: true,
    payTxDigest: `tx-team-${index}`,
    totalScore,
    rank: index,
    prizeAmount: null,
    status: "paid",
    createdAt: `2026-03-23T00:0${index}:00.000Z`
  };
}

function buildMember(teamId: string, index: number, score: number): TeamMember {
  const roles: TeamMember["role"][] = ["collector", "hauler", "escort"];
  return {
    id: `${teamId}-member-${index}`,
    teamId,
    walletAddress: `${teamId}-wallet-${index}`,
    role: roles[(index - 1) % roles.length],
    slotStatus: "locked",
    personalScore: score,
    prizeAmount: null,
    joinedAt: `2026-03-23T00:00:0${index}.000Z`
  };
}

function buildDetail(teamScores: number[], status: Match["status"] = "settled", prizePool = 1200) {
  const teams = teamScores.map((score, index) => buildTeam(index + 1, score));
  const members = teams.flatMap((team, index) => {
    const top = Math.max(0, teamScores[index] - 50);
    const tail = 50;
    const third = Math.max(0, teamScores[index] - top - tail);
    return [buildMember(team.id, 1, top), buildMember(team.id, 2, tail), buildMember(team.id, 3, third)];
  });

  return {
    match: buildMatch(status, prizePool),
    teams,
    members
  };
}

test("distributes 70/30 for two-team matches", () => {
  const bill = buildSettlementBill(buildDetail([900, 600]));

  assert.equal(bill.teamBreakdown.length, 2);
  assert.equal(bill.sponsorshipFee, "600");
  assert.equal(bill.entryFeeTotal, "600");
  assert.equal(bill.platformSubsidy, "0");
  assert.equal(bill.grossPool, "1200");
  assert.equal(bill.platformFee, "60");
  assert.equal(bill.payoutPool, "1140");
  assert.equal(bill.teamBreakdown[0]?.prizeAmount, "798");
  assert.equal(bill.teamBreakdown[1]?.prizeAmount, "342");
  assert.equal(
    bill.teamBreakdown[0]?.members.reduce((sum, member) => sum + Number(member.prizeAmount), 0),
    798
  );
  assert.equal(
    bill.teamBreakdown[1]?.members.reduce((sum, member) => sum + Number(member.prizeAmount), 0),
    342
  );
});

test("distributes 60/30/10 for three-team matches", () => {
  const bill = buildSettlementBill(buildDetail([900, 600, 300]));

  assert.deepEqual(
    bill.teamBreakdown.map((team) => team.prizeAmount),
    ["684", "342", "114"]
  );
});

test("only top three teams receive payout when four or more teams join", () => {
  const bill = buildSettlementBill(buildDetail([900, 600, 300, 200], "settled", 2000));

  assert.deepEqual(
    bill.teamBreakdown.map((team) => team.prizeAmount),
    ["1140", "570", "190", "0"]
  );
});

test("zero-score members receive zero payout", () => {
  const detail = buildDetail([500, 100], "settled", 1000);
  detail.members = [
    buildMember("team-1", 1, 500),
    buildMember("team-1", 2, 0),
    buildMember("team-1", 3, 0),
    buildMember("team-2", 1, 100),
    buildMember("team-2", 2, 0),
    buildMember("team-2", 3, 0)
  ];

  const bill = buildSettlementBill(detail);
  const zeroScoreMembers = bill.teamBreakdown.flatMap((team) => team.members).filter((member) => member.personalScore === 0);

  assert.ok(zeroScoreMembers.length > 0);
  assert.ok(zeroScoreMembers.every((member) => member.prizeAmount === "0"));
});

test("marks unsettled matches as not ready for the result API", () => {
  const resolved = resolveSettlementBill(buildDetail([500, 300], "settling"));

  assert.equal(resolved.ok, false);
  if (!resolved.ok) {
    assert.equal(resolved.reason, "not_ready");
  }
});

test("exposes pending, running, and succeeded settlement status snapshots", () => {
  resetMatchRuntime();
  writeRuntimeProjectionState(createEmptyProjectionState());
  assert.equal(getSettlementStatus("missing-match"), null);

  const runningDetail = buildDetail([500, 300], "settling");
  __setMatchDetailForTests(runningDetail);
  const runningStatus = getSettlementStatus(runningDetail.match.id);
  const runningProjection = readRuntimeProjectionState();

  assert.ok(runningStatus);
  assert.equal(runningStatus?.status, "running");
  assert.equal(runningStatus?.progress, 75);
  assert.equal(runningStatus?.payoutTxDigest, null);
  assert.equal(runningProjection.settlements.length, 1);
  assert.equal(runningProjection.settlements[0]?.status, "running");
  assert.equal(runningProjection.settlements[0]?.bill.payoutTxDigest, null);

  const succeededDetail = buildDetail([500, 300], "settled");
  __setMatchDetailForTests(succeededDetail);
  const succeededStatus = getSettlementStatus(succeededDetail.match.id);
  const succeededProjection = readRuntimeProjectionState();

  assert.ok(succeededStatus);
  assert.equal(succeededStatus?.status, "succeeded");
  assert.equal(succeededStatus?.progress, 100);
  assert.equal(succeededStatus?.payoutTxDigest, "tx-team-1");
  assert.equal(succeededProjection.settlements.length, 1);
  assert.equal(succeededProjection.settlements[0]?.status, "succeeded");
  assert.equal(succeededProjection.settlements[0]?.payoutTxDigest, "tx-team-1");
});

test("materialized running settlement fact does not unlock result bill early", () => {
  resetMatchRuntime();
  writeRuntimeProjectionState(createEmptyProjectionState());

  const settlingDetail = buildDetail([500, 300], "settling");
  __setMatchDetailForTests(settlingDetail);

  const materialized = materializeSettlementFact(settlingDetail.match.id);
  assert.ok(materialized);
  assert.equal(materialized?.status, "running");

  const resolved = resolveSettlementBill(settlingDetail);
  assert.equal(resolved.ok, false);
  if (!resolved.ok) {
    assert.equal(resolved.reason, "not_ready");
  }
});
