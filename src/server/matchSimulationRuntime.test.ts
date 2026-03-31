import assert from "node:assert/strict";
import test from "node:test";

import { injectSimulatedFuelDeposit } from "./matchSimulationRuntime.ts";
import { __setMatchDetailForTests, getMatchDetail, resetMatchRuntime, type MatchDetail } from "./matchRuntime.ts";
import { createEmptyProjectionState, listPersistedFuelEvents, listPersistedMatchStreamEvents, writeRuntimeProjectionState } from "./runtimeProjectionStore.ts";

function nowIso() {
  return new Date().toISOString();
}

function buildDetail(): MatchDetail {
  const matchId = "sim-match-001";
  return {
    match: {
      id: matchId,
      onChainId: "0xnodealpha",
      status: "running",
      creationMode: "precision",
      solarSystemId: 30000142,
      targetNodeIds: ["0xnodealpha"],
      prizePool: 1000,
      hostPrizePool: 500,
      entryFee: 50,
      minTeams: 2,
      maxTeams: 4,
      durationMinutes: 60,
      scoringMode: "weighted",
      challengeMode: "normal",
      triggerMode: "min_threshold",
      startedAt: nowIso(),
      endedAt: null,
      createdBy: "0xhost",
      hostAddress: "0xhost",
      sponsorshipFee: 500,
      createdAt: nowIso()
    },
    teams: [
      {
        id: "team-a",
        matchId,
        name: "Alpha",
        captainAddress: "0xalpha",
        maxSize: 3,
        isLocked: true,
        hasPaid: true,
        payTxDigest: "tx_a",
        totalScore: 0,
        rank: 1,
        prizeAmount: null,
        status: "paid",
        createdAt: nowIso()
      },
      {
        id: "team-b",
        matchId,
        name: "Beta",
        captainAddress: "0xbeta",
        maxSize: 3,
        isLocked: true,
        hasPaid: true,
        payTxDigest: "tx_b",
        totalScore: 0,
        rank: 2,
        prizeAmount: null,
        status: "paid",
        createdAt: nowIso()
      }
    ],
    members: [
      {
        id: "member-a",
        teamId: "team-a",
        walletAddress: "0xmembera",
        role: "collector",
        slotStatus: "locked",
        personalScore: 0,
        prizeAmount: null,
        joinedAt: nowIso()
      },
      {
        id: "member-b",
        teamId: "team-b",
        walletAddress: "0xmemberb",
        role: "hauler",
        slotStatus: "locked",
        personalScore: 0,
        prizeAmount: null,
        joinedAt: nowIso()
      }
    ],
    scores: [
      {
        matchId,
        teamId: "team-a",
        walletAddress: "0xmembera",
        totalScore: 0,
        fuelDeposited: 0,
        updatedAt: nowIso()
      },
      {
        matchId,
        teamId: "team-b",
        walletAddress: "0xmemberb",
        totalScore: 0,
        fuelDeposited: 0,
        updatedAt: nowIso()
      }
    ]
  };
}

test.beforeEach(() => {
  resetMatchRuntime();
  writeRuntimeProjectionState(createEmptyProjectionState());
  __setMatchDetailForTests(buildDetail());
});

test("injectSimulatedFuelDeposit updates match scores and appends fuel events", async () => {
  const result = await injectSimulatedFuelDeposit({
    matchId: "sim-match-001",
    walletAddress: "0xmembera",
    assemblyId: "0xnodealpha",
    fuelAdded: 100,
    fuelTypeId: 78515,
    fuelEfficiency: 80,
    oldQuantity: 0,
    maxCapacity: 100000,
    nodeName: "Node Alpha"
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  assert.equal(result.fuelDeposit.fuelGrade.grade, "refined");
  assert.equal(result.scoreDelta, 450);

  const detail = getMatchDetail("sim-match-001");
  assert.ok(detail);
  assert.equal(detail?.teams.find((team) => team.id === "team-a")?.totalScore, 450);
  assert.equal(detail?.members.find((member) => member.walletAddress === "0xmembera")?.personalScore, 450);

  const fuelEvents = listPersistedFuelEvents("sim-match-001");
  assert.equal(fuelEvents.length, 1);
  assert.equal(fuelEvents[0]?.fuelGrade, "refined");

  const streamEvents = listPersistedMatchStreamEvents("sim-match-001");
  assert.equal(streamEvents.length, 1);
  assert.equal(streamEvents[0]?.eventType, "score_update");
});
