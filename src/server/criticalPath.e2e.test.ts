import assert from "node:assert/strict";
import test from "node:test";
import {
  __setMatchDetailForTests,
  createMatchDraft,
  createTestMatchSignature,
  getMatchDetail,
  publishMatch,
  resetMatchRuntime
} from "./matchRuntime.ts";
import { buildSettlementBill } from "./settlementRuntime.ts";
import {
  approveJoinApplication,
  createTeam,
  createTestTeamSignature,
  joinTeam,
  lockTeam,
  payTeamEntry,
  resetTeamRuntime
} from "./teamRuntime.ts";
import { createEmptyProjectionState, writeRuntimeProjectionState } from "./runtimeProjectionStore.ts";
import type { JoinTeamResponse, Team, TeamMember } from "../types/team.ts";

function buildMessage(scope: string, walletAddress: string) {
  return `${scope}\nwallet=${walletAddress}\nts=2026-03-26T00:00:00.000Z`;
}

function expectSuccessBody<T extends object>(body: T | { ok: false; error: { code: string; message: string } }) {
  if ("ok" in body && body.ok === false) {
    assert.fail(body.error.message);
  }

  return body as T;
}

test.beforeEach(() => {
  resetMatchRuntime();
  resetTeamRuntime();
  writeRuntimeProjectionState(createEmptyProjectionState());
});

test("critical path e2e covers draft publish join pay and settlement", async () => {
  const hostWallet = "0xe2ehost";
  const createDraftMessage = buildMessage("FuelFrogPanic:create-match-draft:hosted", hostWallet);

  const draft = createMatchDraft({
    mode: "free",
    solarSystemId: 30000149,
    targetNodeIds: [],
    sponsorshipFee: 600,
    entryFee: 50,
    maxTeams: 8,
    teamSize: 3,
    durationHours: 2,
    walletAddress: hostWallet,
    signature: createTestMatchSignature(hostWallet, createDraftMessage),
    message: createDraftMessage
  });

  assert.equal(draft.ok, true);
  if (!draft.ok) return;

  const publishMessage = buildMessage(`FuelFrogPanic:publish-match:${draft.data.match.id}`, hostWallet);
  const published = await publishMatch({
    matchId: draft.data.match.id,
    publishTxDigest: "tx_e2e_publish_001",
    idempotencyKey: "e2e-publish-1",
    walletAddress: hostWallet,
    signature: createTestMatchSignature(hostWallet, publishMessage),
    message: publishMessage
  });

  assert.equal(published.ok, true);
  if (!published.ok) return;
  assert.equal(published.data.match.status, "lobby");

  const captainWallet = "0xe2ecaptain";
  const createTeamMessage = buildMessage(`FuelFrogPanic:create-team:${draft.data.match.id}`, captainWallet);
  const created = await createTeam({
    matchId: draft.data.match.id,
    teamName: "E2E Squad",
    roleSlots: {
      collector: 1,
      hauler: 1,
      escort: 1
    },
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, createTeamMessage),
    message: createTeamMessage
  });

  assert.equal(created.status, 200);
  const createdBody = expectSuccessBody<{ team: Team; member: TeamMember }>(created.body);
  const teamId = createdBody.team.id;

  for (const payload of [
    { walletAddress: "0xe2ehauler", role: "hauler" as const },
    { walletAddress: "0xe2eescort", role: "escort" as const }
  ]) {
    const joinMessage = buildMessage(`FuelFrogPanic:join-team:${teamId}`, payload.walletAddress);
    const joined = await joinTeam({
      teamId,
      role: payload.role,
      walletAddress: payload.walletAddress,
      signature: createTestTeamSignature(payload.walletAddress, joinMessage),
      message: joinMessage
    });

    assert.equal(joined.status, 200);
    const joinedBody = expectSuccessBody<JoinTeamResponse>(joined.body);

    const approveMessage = buildMessage(
      `FuelFrogPanic:approve-application:${teamId}:${joinedBody.applicationId}`,
      captainWallet
    );
    const approved = await approveJoinApplication({
      teamId,
      applicationId: joinedBody.applicationId,
      walletAddress: captainWallet,
      signature: createTestTeamSignature(captainWallet, approveMessage),
      message: approveMessage
    });

    assert.equal(approved.status, 200);
  }

  const lockMessage = buildMessage(`FuelFrogPanic:lock-team:${teamId}`, captainWallet);
  const locked = await lockTeam({
    teamId,
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, lockMessage),
    message: lockMessage
  });
  assert.equal(locked.status, 200);

  const payMessage = buildMessage(`FuelFrogPanic:pay-team:${teamId}`, captainWallet);
  const paid = await payTeamEntry({
    teamId,
    txDigest: "tx_e2e_pay_001",
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, payMessage),
    message: payMessage
  });
  assert.equal(paid.status, 200);

  const detail = getMatchDetail(draft.data.match.id);
  assert.ok(detail);
  if (!detail) return;
  assert.equal(detail.match.status, "lobby");
  assert.equal(detail.teams.length, 1);
  assert.equal(detail.teams[0]?.status, "paid");

  const settledDetail = {
    ...detail,
    match: {
      ...detail.match,
      status: "settled" as const,
      endedAt: "2026-03-26T00:10:00.000Z"
    },
    members: detail.members.map((member, index) => ({
      ...member,
      personalScore: [120, 80, 40][index] ?? 0
    })),
    scores: detail.members.map((member, index) => ({
      matchId: detail.match.id,
      teamId: member.teamId,
      walletAddress: member.walletAddress,
      totalScore: [120, 80, 40][index] ?? 0,
      fuelDeposited: [12, 8, 4][index] ?? 0,
      updatedAt: "2026-03-26T00:10:00.000Z"
    }))
  };

  __setMatchDetailForTests(settledDetail);
  const bill = buildSettlementBill(settledDetail);

  assert.equal(bill.matchId, draft.data.match.id);
  assert.equal(bill.sponsorshipFee, "600");
  assert.equal(bill.entryFeeTotal, "150");
  assert.equal(bill.grossPool, "750");
  assert.equal(bill.platformFee, "37");
  assert.equal(bill.payoutPool, "713");
  assert.equal(bill.teamBreakdown.length, 1);
});
