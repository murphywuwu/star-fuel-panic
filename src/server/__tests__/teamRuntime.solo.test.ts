import assert from "node:assert/strict";
import test from "node:test";

import { __setMatchDetailForTests, resetMatchRuntime, type MatchDetail } from "@/server/matchRuntime.ts";
import { createEmptyProjectionState, writeRuntimeProjectionState } from "@/server/runtimeProjectionStore.ts";
import { getSettlementBill, getSettlementStatus } from "@/server/settlementRuntime.ts";
import {
  __resetTeamRuntime,
  createTeam,
  createTestTeamSignature,
  fillSoloVerificationTeam,
  lockTeam,
  payTeamEntry,
  seedSoloVerificationRivalTeam,
  startSoloVerificationMatch,
  settleSoloVerificationMatch
} from "@/server/teamRuntime.ts";

function buildMessage(scope: string, targetId: string, walletAddress: string) {
  return `${scope}:${targetId}\nwallet=${walletAddress}\nts=2026-03-31T00:00:00.000Z`;
}

function buildLobbyDetail(matchId: string, walletAddress: string): MatchDetail {
  return {
    match: {
      id: matchId,
      onChainId: `room_${matchId}`,
      escrowId: `escrow_${matchId}`,
      status: "lobby",
      creationMode: "free",
      solarSystemId: 30000142,
      targetNodeIds: [],
      prizePool: 120,
      hostPrizePool: 120,
      entryFee: 50,
      minTeams: 2,
      maxTeams: 4,
      durationMinutes: 60,
      scoringMode: "weighted",
      challengeMode: "normal",
      triggerMode: "min_threshold",
      startedAt: null,
      endedAt: null,
      createdBy: walletAddress,
      hostAddress: walletAddress,
      sponsorshipFee: 120,
      publishedAt: "2026-03-31T00:00:00.000Z",
      publishIdempotencyKey: "solo-test",
      createdAt: "2026-03-31T00:00:00.000Z"
    },
    teams: [],
    members: []
  };
}

function expectSuccess<T extends { status: number; body: unknown }>(
  result: T
): Exclude<T["body"], { ok: false; error: { code: string; message: string } }> {
  if (typeof result.body === "object" && result.body !== null && "error" in result.body) {
    assert.fail(JSON.stringify(result.body));
  }

  assert.equal(result.status >= 200 && result.status < 300, true);
  return result.body as Exclude<T["body"], { ok: false; error: { code: string; message: string } }>;
}

test.beforeEach(() => {
  resetMatchRuntime();
  __resetTeamRuntime();
  writeRuntimeProjectionState(createEmptyProjectionState());
});

test("solo verification helpers drive a single-account hosted match from team fill to settlement", async () => {
  const matchId = "solo-flow-match";
  const captainWallet = "0xcaptainsolo001";
  __setMatchDetailForTests(buildLobbyDetail(matchId, captainWallet));

  const createTeamMessage = buildMessage("FuelFrogPanic:create-team", matchId, captainWallet);
  const created = await createTeam({
    matchId,
    teamName: "Solo Alpha",
    roleSlots: {
      collector: 1,
      hauler: 1,
      escort: 1
    },
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, createTeamMessage),
    message: createTeamMessage
  });
  const createdBody = expectSuccess(created);
  const teamId = createdBody.team.id;

  const filled = await fillSoloVerificationTeam({
    teamId,
    walletAddress: captainWallet
  });
  const filledBody = expectSuccess(filled);
  assert.equal(filledBody.addedMembers, 2);
  assert.equal(filledBody.team.memberCount, 3);

  const lockMessage = buildMessage("FuelFrogPanic:lock-team", teamId, captainWallet);
  const locked = await lockTeam({
    teamId,
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, lockMessage),
    message: lockMessage
  });
  expectSuccess(locked);

  const payMessage = buildMessage("FuelFrogPanic:pay-team", teamId, captainWallet);
  const paid = await payTeamEntry({
    teamId,
    txDigest: "tx_solo_team_paid_001",
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, payMessage),
    message: payMessage
  });
  const paidBody = expectSuccess(paid);
  assert.equal(paidBody.team.status, "paid");

  const rival = await seedSoloVerificationRivalTeam({
    matchId,
    walletAddress: captainWallet
  });
  const rivalBody = expectSuccess(rival);
  assert.equal(rivalBody.team.status, "paid");
  assert.equal(rivalBody.matchStatus, "prestart");

  const started = await startSoloVerificationMatch({
    matchId,
    walletAddress: captainWallet
  });
  const startedBody = expectSuccess(started);
  assert.equal(startedBody.status, "running");
  assert.ok(startedBody.startedAt);

  const settled = await settleSoloVerificationMatch({
    matchId,
    walletAddress: captainWallet
  });
  const settledBody = expectSuccess(settled);
  assert.equal(settledBody.status, "settled");
  assert.ok(settledBody.settledAt);

  const settlementStatus = getSettlementStatus(matchId);
  assert.ok(settlementStatus);
  assert.equal(settlementStatus?.status, "succeeded");

  const settlementBill = getSettlementBill(matchId);
  assert.equal(settlementBill.ok, true);
  if (!settlementBill.ok) {
    return;
  }

  assert.equal(settlementBill.bill.teamBreakdown.length >= 2, true);
  assert.equal(settlementBill.bill.teamBreakdown[0]?.teamName, "Solo Alpha");
  assert.equal(Number(settlementBill.bill.payoutPool) > 0, true);
});
