import assert from "node:assert/strict";
import test from "node:test";
import {
  __setMatchDetailForTests,
  buildMatchStreamFrame,
  createTestMatchSignature,
  createMatchDraft,
  getMatchScoreboardSnapshot,
  listMaterializedMatchStreamEvents,
  resetMatchRuntime,
  type MatchDetail
} from "@/server/matchRuntime.ts";
import {
  appendPersistedMatchStreamEvents,
  createEmptyProjectionState,
  readRuntimeProjectionState,
  writeRuntimeProjectionState
} from "@/server/runtimeProjectionStore.ts";

function nowIso() {
  return new Date().toISOString();
}

function buildMessage(scope: string, walletAddress: string) {
  return `${scope}\nwallet=${walletAddress}\nts=2026-03-26T00:00:00.000Z`;
}

test.beforeEach(() => {
  resetMatchRuntime();
  writeRuntimeProjectionState(createEmptyProjectionState());
});

test("scoreboard snapshot exposes target node contract for runtime API", async () => {
  const walletAddress = "0xhostalpha";
  const message = buildMessage("FuelFrogPanic:create-match-draft:hosted", walletAddress);
  const created = createMatchDraft({
    mode: "precision",
    solarSystemId: 30000142,
    targetNodeIds: ["0xtargetalpha"],
    sponsorshipFee: 900,
    entryFee: 75,
    maxTeams: 4,
    teamSize: 3,
    durationHours: 1,
    walletAddress,
    signature: createTestMatchSignature(walletAddress, message),
    message
  });

  assert.equal(created.ok, true);
  if (!created.ok) {
    return;
  }

  const snapshot = await getMatchScoreboardSnapshot(created.data.match.id);

  assert.ok(snapshot);
  if (!snapshot) {
    return;
  }

  assert.equal(snapshot.matchId, created.data.match.id);
  assert.equal(snapshot.status, "draft");
  assert.equal(snapshot.targetNodes.length, 1);
  assert.equal(snapshot.targetNodes[0]?.objectId, "0xtargetalpha");
  assert.equal(snapshot.targetNodes[0]?.isOnline, false);
  assert.deepEqual(snapshot.teams, []);
});

test("stream frame emits score_update + panic_mode + heartbeat for panic matches", async () => {
  const matchId = `panic-${Date.now()}`;
  const detail: MatchDetail = {
    match: {
      id: matchId,
      onChainId: "0xpanicnode",
      status: "panic",
      creationMode: "precision",
      solarSystemId: 30000142,
      targetNodeIds: ["0xpanicnode"],
      prizePool: 1800,
      hostPrizePool: 1200,
      sponsorshipFee: 1200,
      entryFee: 100,
      minTeams: 2,
      maxTeams: 4,
      durationMinutes: 10,
      scoringMode: "weighted",
      challengeMode: "normal",
      triggerMode: "min_threshold",
      startedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      endedAt: null,
      createdBy: "0xhostpanic",
      hostAddress: "0xhostpanic",
      publishedAt: nowIso(),
      publishIdempotencyKey: "panic-key",
      createdAt: nowIso()
    },
    teams: [
      {
        id: `${matchId}-team-a`,
        matchId,
        name: "Aster",
        captainAddress: "0xteam-a",
        maxSize: 3,
        isLocked: true,
        hasPaid: true,
        payTxDigest: "tx_team_a",
        totalScore: 420,
        rank: 1,
        prizeAmount: null,
        status: "paid",
        createdAt: nowIso()
      },
      {
        id: `${matchId}-team-b`,
        matchId,
        name: "Borealis",
        captainAddress: "0xteam-b",
        maxSize: 3,
        isLocked: true,
        hasPaid: true,
        payTxDigest: "tx_team_b",
        totalScore: 300,
        rank: 2,
        prizeAmount: null,
        status: "paid",
        createdAt: nowIso()
      }
    ],
    members: []
  };

  __setMatchDetailForTests(detail);

  const frame = await buildMatchStreamFrame(matchId);

  assert.ok(frame);
  if (!frame) {
    return;
  }

  assert.equal(frame.length, 4);
  assert.equal(frame[0]?.type, "score_update");
  assert.equal(frame[1]?.type, "node_status");
  assert.equal(frame[2]?.type, "panic_mode");
  assert.equal(frame[3]?.type, "heartbeat");

  const scoreEvent = frame[0];
  if (scoreEvent.type !== "score_update") {
    assert.fail("expected score_update frame");
  }

  assert.equal(scoreEvent.scoreboard.matchId, matchId);
  assert.equal(scoreEvent.scoreboard.targetNodes[0]?.objectId, "0xpanicnode");
  assert.equal(scoreEvent.scoreboard.teams[0]?.teamName, "Aster");
  assert.equal(scoreEvent.scoreboard.teams[0]?.rank, 1);

  const projection = readRuntimeProjectionState();
  const eventTypes = projection.matchStreamEvents
    .filter((event) => event.matchId === matchId)
    .map((event) => event.eventType);
  assert.deepEqual(eventTypes, ["score_update", "node_status", "panic_mode"]);
});

test("stream frame emits node_status and settlement_start during settling phase", async () => {
  const matchId = `settling-${Date.now()}`;
  const detail: MatchDetail = {
    match: {
      id: matchId,
      onChainId: "0xsettlenode",
      status: "settling",
      creationMode: "precision",
      solarSystemId: 30000142,
      targetNodeIds: ["0xsettlenode"],
      prizePool: 2000,
      hostPrizePool: 1200,
      sponsorshipFee: 1200,
      entryFee: 100,
      minTeams: 2,
      maxTeams: 4,
      durationMinutes: 10,
      scoringMode: "weighted",
      challengeMode: "normal",
      triggerMode: "min_threshold",
      startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      endedAt: nowIso(),
      createdBy: "0xhostsettle",
      hostAddress: "0xhostsettle",
      publishedAt: nowIso(),
      publishIdempotencyKey: "settling-key",
      createdAt: nowIso()
    },
    teams: [],
    members: []
  };

  __setMatchDetailForTests(detail);

  const frame = await buildMatchStreamFrame(matchId);

  assert.ok(frame);
  if (!frame) {
    return;
  }

  assert.equal(frame[0]?.type, "score_update");
  assert.equal(frame[1]?.type, "node_status");
  assert.equal(frame[2]?.type, "phase_change");
  assert.equal(frame[3]?.type, "heartbeat");
  assert.equal(frame[4]?.type, "settlement_start");

  const nodeStatus = frame[1];
  if (nodeStatus.type !== "node_status") {
    assert.fail("expected node_status frame");
  }
  assert.equal(nodeStatus.targetNodes[0]?.objectId, "0xsettlenode");

  const settlementStart = frame[4];
  if (settlementStart.type !== "settlement_start") {
    assert.fail("expected settlement_start frame");
  }
  assert.equal(settlementStart.progress, 75);

  const projection = readRuntimeProjectionState();
  assert.equal(projection.settlements.length, 1);
  assert.equal(projection.settlements[0]?.status, "running");
  const events = projection.matchStreamEvents.filter((event) => event.matchId === matchId);
  assert.equal(events.length, 4);
  assert.deepEqual(events.map((event) => event.eventType).sort(), [
    "node_status",
    "phase_change",
    "score_update",
    "settlement_start"
  ]);
});

test("stream frame emits settlement_complete during settled phase and persists completion event", async () => {
  const matchId = `settled-${Date.now()}`;
  const settlingDetail: MatchDetail = {
    match: {
      id: matchId,
      onChainId: "0xsettlednode",
      status: "settling",
      creationMode: "precision",
      solarSystemId: 30000142,
      targetNodeIds: ["0xsettlednode"],
      prizePool: 2000,
      hostPrizePool: 1200,
      sponsorshipFee: 1200,
      entryFee: 100,
      minTeams: 2,
      maxTeams: 4,
      durationMinutes: 10,
      scoringMode: "weighted",
      challengeMode: "normal",
      triggerMode: "min_threshold",
      startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      endedAt: nowIso(),
      createdBy: "0xhostsettled",
      hostAddress: "0xhostsettled",
      publishedAt: nowIso(),
      publishIdempotencyKey: "settled-key",
      createdAt: nowIso()
    },
    teams: [],
    members: []
  };

  __setMatchDetailForTests(settlingDetail);

  __setMatchDetailForTests({
    ...settlingDetail,
    match: {
      ...settlingDetail.match,
      status: "settled"
    }
  });

  const frame = await buildMatchStreamFrame(matchId);

  assert.ok(frame);
  if (!frame) {
    return;
  }

  assert.equal(frame[4]?.type, "settlement_complete");
  const completion = frame[4];
  if (completion.type !== "settlement_complete") {
    assert.fail("expected settlement_complete frame");
  }
  assert.equal(completion.result.matchId, matchId);

  const projection = readRuntimeProjectionState();
  assert.equal(projection.settlements.length, 1);
  assert.equal(projection.settlements[0]?.status, "succeeded");
  const events = projection.matchStreamEvents
    .filter((event) => event.matchId === matchId)
    .map((event) => event.eventType);
  assert.deepEqual(events.sort(), [
    "node_status",
    "phase_change",
    "score_update",
    "settlement_complete",
    "settlement_start"
  ]);
});

test("rebuilding the same frame does not duplicate persisted live snapshot events", async () => {
  const matchId = `stable-${Date.now()}`;
  const detail: MatchDetail = {
    match: {
      id: matchId,
      onChainId: "0xstablestream",
      status: "panic",
      creationMode: "precision",
      solarSystemId: 30000142,
      targetNodeIds: ["0xstablestream"],
      prizePool: 1800,
      hostPrizePool: 1200,
      sponsorshipFee: 1200,
      entryFee: 100,
      minTeams: 2,
      maxTeams: 4,
      durationMinutes: 10,
      scoringMode: "weighted",
      challengeMode: "normal",
      triggerMode: "min_threshold",
      startedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      endedAt: null,
      createdBy: "0xhoststable",
      hostAddress: "0xhoststable",
      publishedAt: nowIso(),
      publishIdempotencyKey: "stable-key",
      createdAt: nowIso()
    },
    teams: [
      {
        id: `${matchId}-team-a`,
        matchId,
        name: "Stable A",
        captainAddress: "0xstable-a",
        maxSize: 3,
        isLocked: true,
        hasPaid: true,
        payTxDigest: "tx_stable_a",
        totalScore: 500,
        rank: 1,
        prizeAmount: null,
        status: "paid",
        createdAt: nowIso()
      }
    ],
    members: []
  };

  __setMatchDetailForTests(detail);
  await buildMatchStreamFrame(matchId);
  await buildMatchStreamFrame(matchId);

  const projection = readRuntimeProjectionState();
  const eventTypes = projection.matchStreamEvents
    .filter((event) => event.matchId === matchId)
    .map((event) => event.eventType);
  assert.deepEqual(eventTypes, ["score_update", "node_status", "panic_mode"]);
});

test("materialized stream events preserve fuelDeposit payload on score_update", () => {
  const matchId = `fuel-deposit-${Date.now()}`;

  appendPersistedMatchStreamEvents([
    {
      matchId,
      eventType: "score_update",
      createdAt: nowIso(),
      payload: {
        scoreboard: {
          matchId,
          status: "running",
          remainingSeconds: 120,
          panicMode: false,
          teams: [],
          targetNodes: [],
          updatedAt: nowIso()
        },
        fuelDeposit: {
          txDigest: "tx-fuel-grade",
          sender: "0xpilot",
          teamId: "team-alpha",
          nodeId: "0xnode",
          nodeName: "Gate-Alpha",
          fuelAdded: 100,
          fuelTypeId: 33,
          fuelGrade: {
            typeId: 33,
            efficiency: 85,
            tier: 3,
            grade: "refined",
            bonus: 1.5,
            label: "Refined",
            icon: "🟣"
          },
          urgencyWeight: 3,
          panicMultiplier: 1.5,
          scoreDelta: 675,
          timestamp: nowIso()
        }
      }
    }
  ]);

  const events = listMaterializedMatchStreamEvents(matchId);
  assert.equal(events.length, 1);

  const scoreUpdate = events[0];
  if (!scoreUpdate || scoreUpdate.type !== "score_update") {
    assert.fail("expected score_update event");
  }

  assert.equal(scoreUpdate.fuelDeposit?.fuelTypeId, 33);
  assert.equal(scoreUpdate.fuelDeposit?.fuelGrade.grade, "refined");
  assert.equal(scoreUpdate.fuelDeposit?.fuelGrade.bonus, 1.5);
});
