import assert from "node:assert/strict";
import test from "node:test";
import { getMissionById, resetMissionRuntime, upsertMission } from "./missionRuntime.ts";
import {
  createMatchDraft,
  createTestMatchSignature,
  getMatchDetail,
  listMatches,
  publishMatch,
  resetMatchRuntime
} from "./matchRuntime.ts";
import {
  approveJoinApplication,
  createTeam,
  createTestTeamSignature,
  getMatchTeamsSnapshot,
  joinTeam,
  lockTeam,
  payTeamEntry,
  rejectJoinApplication,
  resetTeamRuntime
} from "./teamRuntime.ts";
import { createEmptyProjectionState, readRuntimeProjectionState, writeRuntimeProjectionState } from "./runtimeProjectionStore.ts";
import type { JoinTeamResponse, RoleSlots } from "../types/team.ts";

function buildMessage(scope: string, walletAddress: string) {
  return `${scope}\nwallet=${walletAddress}\nts=2026-03-23T00:00:00.000Z`;
}

function resetRuntime() {
  resetMissionRuntime();
  resetMatchRuntime();
  resetTeamRuntime();
  writeRuntimeProjectionState(createEmptyProjectionState());
}

const DEFAULT_ROLE_SLOTS: RoleSlots = {
  collector: 1,
  hauler: 1,
  escort: 1
};

function expectSuccessBody<T extends object>(result: {
  status: number;
  body: T | { ok: false; error: { code: string; message: string } };
}) {
  assert.equal(result.status, 200);
  assert.ok(!("ok" in result.body));
  return result.body as T;
}

function expectFailureBody(
  result: { status: number; body: { ok: false; error: { code: string; message: string } } | Record<string, unknown> },
  expectedStatus: number
) {
  assert.equal(result.status, expectedStatus);
  assert.ok("ok" in result.body && result.body.ok === false);
  return result.body as { ok: false; error: { code: string; message: string } };
}

test.beforeEach(() => {
  resetRuntime();
});

test("lists seeded matches and resolves match detail", () => {
  const matches = listMatches({ limit: 2 });
  assert.equal(matches.length, 2);
  assert.equal(matches[0]?.creationMode, "free");
  assert.equal(typeof matches[0]?.prizePool, "number");
  assert.equal(typeof matches[0]?.entryFee, "number");

  const detail = getMatchDetail("mission-ssu-7");
  assert.ok(detail);
  assert.equal(detail?.match.id, "mission-ssu-7");
  assert.equal(detail?.match.targetNodeIds.length, 0);
  assert.equal(detail?.match.scoringMode, "weighted");
  assert.equal(detail?.match.triggerMode, "dynamic");
  assert.ok((detail?.teams.length ?? 0) > 0);
  assert.ok((detail?.members.length ?? 0) > 0);
});

test("sorts matches by prize pool descending", () => {
  const matches = listMatches({ sortBy: "prize_pool", limit: 4 });

  assert.equal(matches.length, 4);
  assert.ok((matches[0]?.prizePool ?? 0) >= (matches[1]?.prizePool ?? 0));
  assert.ok((matches[1]?.prizePool ?? 0) >= (matches[2]?.prizePool ?? 0));
});

test("creates a new team in lobby matches", async () => {
  const walletAddress = "0xalpha001";
  const message = buildMessage("FuelFrogPanic:create-team:mission-ssu-7", walletAddress);
  const result = await createTeam({
    matchId: "mission-ssu-7",
    teamName: "Nebula Dash",
    maxSize: 3,
    roleSlots: DEFAULT_ROLE_SLOTS,
    walletAddress,
    signature: createTestTeamSignature(walletAddress, message),
    message
  });

  const body = expectSuccessBody<{ team: { name: string }; member: { role: string } }>(result);
  assert.equal(body.team.name, "Nebula Dash");
  assert.equal(body.member.role, "collector");
});

test("creates pending application then rejects duplicate pending request", async () => {
  const captainWallet = "0xcaptain001";
  const createMessage = buildMessage("FuelFrogPanic:create-team:mission-gate-12", captainWallet);
  const created = await createTeam({
    matchId: "mission-gate-12",
    teamName: "Delta Haulers",
    maxSize: 3,
    roleSlots: DEFAULT_ROLE_SLOTS,
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, createMessage),
    message: createMessage
  });
  const createdBody = expectSuccessBody<{ team: { id: string } }>(created);

  const firstJoinWallet = "0xjoin001";
  const firstJoinMessage = buildMessage(`FuelFrogPanic:join-team:${createdBody.team.id}`, firstJoinWallet);
  const firstJoin = await joinTeam({
    teamId: createdBody.team.id,
    role: "hauler",
    walletAddress: firstJoinWallet,
    signature: createTestTeamSignature(firstJoinWallet, firstJoinMessage),
    message: firstJoinMessage
  });
  const firstJoinBody = expectSuccessBody<JoinTeamResponse>(firstJoin);
  assert.equal(firstJoinBody.status, "pending");

  const secondJoinWallet = "0xjoin002";
  const secondJoinMessage = buildMessage(`FuelFrogPanic:join-team:${createdBody.team.id}`, secondJoinWallet);
  const secondJoin = await joinTeam({
    teamId: createdBody.team.id,
    role: "hauler",
    walletAddress: secondJoinWallet,
    signature: createTestTeamSignature(secondJoinWallet, secondJoinMessage),
    message: secondJoinMessage
  });
  const secondJoinBody = expectSuccessBody<JoinTeamResponse>(secondJoin);
  assert.equal(secondJoinBody.status, "pending");

  const duplicatePending = await joinTeam({
    teamId: createdBody.team.id,
    role: "escort",
    walletAddress: secondJoinWallet,
    signature: createTestTeamSignature(secondJoinWallet, secondJoinMessage),
    message: secondJoinMessage
  });
  const duplicateFailure = expectFailureBody(duplicatePending, 409);
  assert.equal(duplicateFailure.error.code, "CONFLICT");
});

test("locks then pays a complete team", async () => {
  const captainWallet = "0xcaptain002";
  const createMessage = buildMessage("FuelFrogPanic:create-team:mission-kite-2", captainWallet);
  const created = await createTeam({
    matchId: "mission-kite-2",
    teamName: "Lockstep",
    maxSize: 3,
    roleSlots: DEFAULT_ROLE_SLOTS,
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, createMessage),
    message: createMessage
  });
  const createdBody = expectSuccessBody<{ team: { id: string } }>(created);

  for (const payload of [
    { walletAddress: "0xjoin101", role: "hauler" as const },
    { walletAddress: "0xjoin102", role: "escort" as const }
  ]) {
    const joinMessage = buildMessage(`FuelFrogPanic:join-team:${createdBody.team.id}`, payload.walletAddress);
    const joined = await joinTeam({
      teamId: createdBody.team.id,
      role: payload.role,
      walletAddress: payload.walletAddress,
      signature: createTestTeamSignature(payload.walletAddress, joinMessage),
      message: joinMessage
    });
    const joinedBody = expectSuccessBody<JoinTeamResponse>(joined);
    const approveMessage = buildMessage(
      `FuelFrogPanic:approve-application:${createdBody.team.id}:${joinedBody.applicationId}`,
      captainWallet
    );
    const approved = await approveJoinApplication({
      teamId: createdBody.team.id,
      applicationId: joinedBody.applicationId,
      walletAddress: captainWallet,
      signature: createTestTeamSignature(captainWallet, approveMessage),
      message: approveMessage
    });
    assert.equal(approved.status, 200);
  }

  const lockMessage = buildMessage(`FuelFrogPanic:lock-team:${createdBody.team.id}`, captainWallet);
  const locked = await lockTeam({
    teamId: createdBody.team.id,
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, lockMessage),
    message: lockMessage
  });
  const lockedBody = expectSuccessBody<{ team: { status: string } }>(locked);
  assert.equal(lockedBody.team.status, "locked");

  const payMessage = buildMessage(`FuelFrogPanic:pay-team:${createdBody.team.id}`, captainWallet);
  const paid = await payTeamEntry({
    teamId: createdBody.team.id,
    txDigest: "tx_paid_001",
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, payMessage),
    message: payMessage
  });
  const paidBody = expectSuccessBody<{ team: { status: string }; whitelistCount: number }>(paid);
  assert.equal(paidBody.team.status, "paid");
  assert.equal(paidBody.whitelistCount, 3);
});

test("rehydrates paid teams from persisted payment and whitelist facts", async () => {
  const hostWallet = "0xfacthost001";
  const createDraftMessage = buildMessage("FuelFrogPanic:create-match-draft:hosted", hostWallet);
  const draft = createMatchDraft({
    mode: "free",
    solarSystemId: 30000149,
    targetNodeIds: [],
    sponsorshipFee: 600,
    entryFee: 50,
    maxTeams: 8,
    durationHours: 2,
    walletAddress: hostWallet,
    signature: createTestMatchSignature(hostWallet, createDraftMessage),
    message: createDraftMessage
  });
  assert.equal(draft.ok, true);
  if (!draft.ok) {
    return;
  }

  const publishMessage = buildMessage(`FuelFrogPanic:publish-match:${draft.data.match.id}`, hostWallet);
  const published = await publishMatch({
    matchId: draft.data.match.id,
    publishTxDigest: "tx_fact_publish_001",
    idempotencyKey: "fact-publish-1",
    walletAddress: hostWallet,
    signature: createTestMatchSignature(hostWallet, publishMessage),
    message: publishMessage
  });
  assert.equal(published.ok, true);
  if (!published.ok) {
    return;
  }

  const captainWallet = "0xfactcaptain001";
  const createTeamMessage = buildMessage(`FuelFrogPanic:create-team:${draft.data.match.id}`, captainWallet);
  const created = await createTeam({
    matchId: draft.data.match.id,
    teamName: "Fact Hydration",
    maxSize: 3,
    roleSlots: DEFAULT_ROLE_SLOTS,
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, createTeamMessage),
    message: createTeamMessage
  });
  const createdBody = expectSuccessBody<{ team: { id: string } }>(created);

  for (const payload of [
    { walletAddress: "0xfactjoin001", role: "hauler" as const },
    { walletAddress: "0xfactjoin002", role: "escort" as const }
  ]) {
    const joinMessage = buildMessage(`FuelFrogPanic:join-team:${createdBody.team.id}`, payload.walletAddress);
    const joined = await joinTeam({
      teamId: createdBody.team.id,
      role: payload.role,
      walletAddress: payload.walletAddress,
      signature: createTestTeamSignature(payload.walletAddress, joinMessage),
      message: joinMessage
    });
    const joinedBody = expectSuccessBody<JoinTeamResponse>(joined);

    const approveMessage = buildMessage(
      `FuelFrogPanic:approve-application:${createdBody.team.id}:${joinedBody.applicationId}`,
      captainWallet
    );
    const approved = await approveJoinApplication({
      teamId: createdBody.team.id,
      applicationId: joinedBody.applicationId,
      walletAddress: captainWallet,
      signature: createTestTeamSignature(captainWallet, approveMessage),
      message: approveMessage
    });
    assert.equal(approved.status, 200);
  }

  const lockMessage = buildMessage(`FuelFrogPanic:lock-team:${createdBody.team.id}`, captainWallet);
  const locked = await lockTeam({
    teamId: createdBody.team.id,
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, lockMessage),
    message: lockMessage
  });
  assert.equal(locked.status, 200);

  const payMessage = buildMessage(`FuelFrogPanic:pay-team:${createdBody.team.id}`, captainWallet);
  const paid = await payTeamEntry({
    teamId: createdBody.team.id,
    txDigest: "tx_fact_pay_001",
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, payMessage),
    message: payMessage
  });
  assert.equal(paid.status, 200);

  const projection = readRuntimeProjectionState();
  const paymentRows = projection.teamPayments.filter((row) => row.teamId === createdBody.team.id);
  assert.equal(paymentRows.length, 1);
  assert.equal(paymentRows[0]?.amount, 150);
  assert.deepEqual(
    [...(paymentRows[0]?.memberAddresses ?? [])].sort(),
    ["0xfactcaptain001", "0xfactjoin001", "0xfactjoin002"].sort()
  );

  const whitelistRows = projection.matchWhitelists.filter((row) => row.teamId === createdBody.team.id);
  assert.equal(whitelistRows.length, 3);
  assert.ok(whitelistRows.every((row) => row.sourcePaymentTx === "tx_fact_pay_001"));

  projection.teams = projection.teams.map((team) =>
    team.id === createdBody.team.id
      ? {
          ...team,
          hasPaid: false,
          payTxDigest: null,
          status: "locked",
          whitelistCount: 0
        }
      : team
  );
  writeRuntimeProjectionState(projection);

  resetTeamRuntime();

  const restored = getMatchTeamsSnapshot(draft.data.match.id);
  assert.ok(restored);
  const restoredTeam = restored?.items.find((team) => team.id === createdBody.team.id);
  assert.ok(restoredTeam);
  assert.equal(restoredTeam?.status, "paid");
  assert.equal(restoredTeam?.hasPaid, true);
  assert.equal(restoredTeam?.payTxDigest, "tx_fact_pay_001");
  assert.equal(restoredTeam?.paymentTxDigest, "tx_fact_pay_001");
  assert.equal(restoredTeam?.whitelistCount, 3);
});

test("captain can reject pending application", async () => {
  const captainWallet = "0xcaptain004";
  const createMessage = buildMessage("FuelFrogPanic:create-team:mission-ssu-7", captainWallet);
  const created = await createTeam({
    matchId: "mission-ssu-7",
    teamName: "RejectFlow",
    maxSize: 3,
    roleSlots: DEFAULT_ROLE_SLOTS,
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, createMessage),
    message: createMessage
  });
  const createdBody = expectSuccessBody<{ team: { id: string } }>(created);

  const applyWallet = "0xjoin201";
  const applyMessage = buildMessage(`FuelFrogPanic:join-team:${createdBody.team.id}`, applyWallet);
  const applied = await joinTeam({
    teamId: createdBody.team.id,
    role: "hauler",
    walletAddress: applyWallet,
    signature: createTestTeamSignature(applyWallet, applyMessage),
    message: applyMessage
  });
  const appliedBody = expectSuccessBody<JoinTeamResponse>(applied);

  const rejectMessage = buildMessage(
    `FuelFrogPanic:reject-application:${createdBody.team.id}:${appliedBody.applicationId}`,
    captainWallet
  );
  const rejected = await rejectJoinApplication({
    teamId: createdBody.team.id,
    applicationId: appliedBody.applicationId,
    reason: "role already assigned",
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, rejectMessage),
    message: rejectMessage
  });
  const rejectedBody = expectSuccessBody<{ application: { status: string; reason?: string } }>(rejected);
  assert.equal(rejectedBody.application.status, "rejected");
  assert.equal(rejectedBody.application.reason, "role already assigned");
});

test("rejects payment before team is locked", async () => {
  const captainWallet = "0xcaptain003";
  const createMessage = buildMessage("FuelFrogPanic:create-team:mission-kite-2", captainWallet);
  const created = await createTeam({
    matchId: "mission-kite-2",
    teamName: "Premature Pay",
    maxSize: 3,
    roleSlots: DEFAULT_ROLE_SLOTS,
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, createMessage),
    message: createMessage
  });
  const createdBody = expectSuccessBody<{ team: { id: string } }>(created);

  const payMessage = buildMessage(`FuelFrogPanic:pay-team:${createdBody.team.id}`, captainWallet);
  const paid = await payTeamEntry({
    teamId: createdBody.team.id,
    txDigest: "tx_paid_early",
    walletAddress: captainWallet,
    signature: createTestTeamSignature(captainWallet, payMessage),
    message: payMessage
  });

  const payFailure = expectFailureBody(paid, 409);
  assert.equal(payFailure.error.code, "TEAM_NOT_LOCKED");
});

test("settled missions are reflected in match detail", () => {
  const mission = getMissionById("mission-orbit-9");
  assert.ok(mission);
  if (!mission) {
    return;
  }

  upsertMission({
    ...mission,
    status: "settled",
    countdownSec: 0
  });

  const detail = getMatchDetail("mission-orbit-9");
  assert.equal(detail?.match.status, "settled");
});

test("creates draft then publishes precision match", async () => {
  const walletAddress = "0xhost001";
  const createMessage = buildMessage("FuelFrogPanic:create-match-draft:hosted", walletAddress);

  const lowFeeDraft = createMatchDraft({
    mode: "precision",
    solarSystemId: 30000149,
    targetNodeIds: ["0x9e24fb2d333f392590f430f70ab8d69150d5dc12f2f8d06fa16480348ace4c0f"],
    sponsorshipFee: 49,
    entryFee: 10,
    maxTeams: 8,
    durationHours: 2,
    walletAddress,
    signature: createTestMatchSignature(walletAddress, createMessage),
    message: createMessage
  });
  assert.equal(lowFeeDraft.ok, true);
  if (!lowFeeDraft.ok) return;

  const lowFeePublishMessage = buildMessage(`FuelFrogPanic:publish-match:${lowFeeDraft.data.match.id}`, walletAddress);
  const lowFeePublish = await publishMatch({
    matchId: lowFeeDraft.data.match.id,
    walletAddress,
    publishTxDigest: "tx_low_fee_publish",
    idempotencyKey: "idem-1",
    signature: createTestMatchSignature(walletAddress, lowFeePublishMessage),
    message: lowFeePublishMessage
  });
  assert.equal(lowFeePublish.ok, false);
  if (!lowFeePublish.ok) {
    assert.equal(lowFeePublish.error.code, "SPONSORSHIP_TOO_LOW");
  }

  const publishableDraft = createMatchDraft({
    mode: "precision",
    solarSystemId: 30000149,
    targetNodeIds: ["0x9e24fb2d333f392590f430f70ab8d69150d5dc12f2f8d06fa16480348ace4c0f"],
    sponsorshipFee: 50,
    entryFee: 10,
    maxTeams: 8,
    durationHours: 2,
    walletAddress,
    signature: createTestMatchSignature(walletAddress, createMessage),
    message: createMessage
  });
  assert.equal(publishableDraft.ok, true);
  if (!publishableDraft.ok) return;

  const publishMessage = buildMessage(`FuelFrogPanic:publish-match:${publishableDraft.data.match.id}`, walletAddress);
  const published = await publishMatch({
    matchId: publishableDraft.data.match.id,
    walletAddress,
    publishTxDigest: "tx_publish_success",
    idempotencyKey: "idem-2",
    signature: createTestMatchSignature(walletAddress, publishMessage),
    message: publishMessage
  });
  assert.equal(published.ok, true);
  if (!published.ok) return;
  assert.equal(published.data.match.status, "lobby");
  assert.equal(published.data.match.onChainId, "draft_tx_publish_success");

  const detail = getMatchDetail(publishableDraft.data.match.id);
  assert.ok(detail);
  assert.equal(detail?.match.status, "lobby");
});
