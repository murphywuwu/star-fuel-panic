import assert from "node:assert/strict";
import test from "node:test";
import {
  __setMatchDetailForTests,
  buildMatchStreamFrame,
  createTestMatchSignature,
  createMatchDraft,
  getMatchScoreboardSnapshot,
  resetMatchRuntime,
  type MatchDetail
} from "./matchRuntime.ts";

function nowIso() {
  return new Date().toISOString();
}

function buildMessage(scope: string, walletAddress: string) {
  return `${scope}\nwallet=${walletAddress}\nts=2026-03-26T00:00:00.000Z`;
}

test.beforeEach(() => {
  resetMatchRuntime();
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
});
