import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  approvePlanningTeamApplication,
  createPlanningTeam,
  disbandPlanningTeam,
  getPlanningTeamsSnapshot,
  joinPlanningTeam,
  leavePlanningTeam,
  rejectPlanningTeamApplication
} from "@/server/planningTeamRuntime.ts";
import { createEmptyProjectionState, writeRuntimeProjectionState } from "@/server/runtimeProjectionStore.ts";

const originalProjectionStorePath = process.env.RUNTIME_PROJECTION_STORE_PATH;

function installTempProjection() {
  const root = mkdtempSync(path.join(os.tmpdir(), "planning-team-runtime-"));
  process.env.RUNTIME_PROJECTION_STORE_PATH = path.join(root, "projection.json");
  writeRuntimeProjectionState(createEmptyProjectionState());
  return root;
}

function restoreProjectionPath() {
  if (originalProjectionStorePath) {
    process.env.RUNTIME_PROJECTION_STORE_PATH = originalProjectionStorePath;
    return;
  }

  delete process.env.RUNTIME_PROJECTION_STORE_PATH;
}

let tempRoot = "";

test.beforeEach(() => {
  tempRoot = installTempProjection();
});

test.afterEach(() => {
  rmSync(tempRoot, { recursive: true, force: true });
  restoreProjectionPath();
});

test("createPlanningTeam persists a standalone team and updates total count", () => {
  const created = createPlanningTeam({
    teamName: "Alpha Squad",
    maxMembers: 3,
    roleSlots: {
      collector: 1,
      hauler: 1,
      escort: 1
    },
    walletAddress: "0xCaptain001"
  });

  assert.equal(created.status, 201);
  assert.ok(!("ok" in created.body));
  assert.equal(created.body.team.name, "Alpha Squad");
  assert.equal(created.body.team.captainAddress, "0xcaptain001");
  assert.equal(created.body.totalTeams, 1);
  assert.equal(created.body.team.members.length, 1);
  assert.equal(created.body.team.applications.length, 0);
  assert.equal(created.body.team.members[0]?.walletAddress, "0xcaptain001");

  const snapshot = getPlanningTeamsSnapshot();
  assert.equal(snapshot.totalTeams, 1);
  assert.equal(snapshot.items[0]?.name, "Alpha Squad");
  assert.equal(snapshot.items[0]?.members.length, 1);
});

test("createPlanningTeam rejects invalid role slot totals", () => {
  const created = createPlanningTeam({
    teamName: "Broken Slots",
    maxMembers: 4,
    roleSlots: {
      collector: 1,
      hauler: 1,
      escort: 1
    },
    walletAddress: "0xCaptain002"
  });

  assert.equal(created.status, 400);
  assert.ok("ok" in created.body && created.body.ok === false);
  assert.equal(created.body.error.code, "INVALID_INPUT");
});

test("joinPlanningTeam creates a pending application instead of directly appending a member", () => {
  const created = createPlanningTeam({
    teamName: "Open Slots",
    maxMembers: 3,
    roleSlots: {
      collector: 1,
      hauler: 1,
      escort: 1
    },
    walletAddress: "0xCaptain003"
  });

  assert.equal(created.status, 201);
  assert.ok(!("ok" in created.body));

  const joined = joinPlanningTeam({
    teamId: created.body.team.id,
    role: "hauler",
    walletAddress: "0xJoin001"
  });

  assert.equal(joined.status, 202);
  assert.ok(!("ok" in joined.body));
  assert.equal(joined.body.team.memberCount, 1);
  assert.equal(joined.body.application.status, "pending");
  assert.equal(joined.body.team.applications[0]?.applicantWalletAddress, "0xjoin001");
  assert.equal(joined.body.team.applications[0]?.role, "hauler");
});

test("joinPlanningTeam rejects wallets that already belong to another planning team", () => {
  const created = createPlanningTeam({
    teamName: "First Team",
    maxMembers: 3,
    roleSlots: {
      collector: 1,
      hauler: 1,
      escort: 1
    },
    walletAddress: "0xCaptain004"
  });

  assert.equal(created.status, 201);
  assert.ok(!("ok" in created.body));

  const duplicateCreate = createPlanningTeam({
    teamName: "Second Team",
    maxMembers: 3,
    roleSlots: {
      collector: 1,
      hauler: 1,
      escort: 1
    },
    walletAddress: "0xCaptain004"
  });

  assert.equal(duplicateCreate.status, 409);
  assert.ok("ok" in duplicateCreate.body && duplicateCreate.body.ok === false);
  assert.equal(duplicateCreate.body.error.code, "CONFLICT");
});

test("captain can approve and reject planning team applications", () => {
  const created = createPlanningTeam({
    teamName: "Approval Squad",
    maxMembers: 3,
    roleSlots: {
      collector: 1,
      hauler: 1,
      escort: 1
    },
    walletAddress: "0xCaptain005"
  });
  assert.equal(created.status, 201);
  assert.ok(!("ok" in created.body));

  const joined = joinPlanningTeam({
    teamId: created.body.team.id,
    role: "hauler",
    walletAddress: "0xJoinApprove"
  });
  assert.equal(joined.status, 202);
  assert.ok(!("ok" in joined.body));

  const approved = approvePlanningTeamApplication({
    teamId: created.body.team.id,
    applicationId: joined.body.application.id,
    walletAddress: "0xCaptain005"
  });

  assert.equal(approved.status, 200);
  assert.ok(!("ok" in approved.body));
  assert.equal(approved.body.team.memberCount, 2);
  assert.equal(approved.body.team.members[1]?.walletAddress, "0xjoinapprove");
  assert.equal(approved.body.team.applications[0]?.status, "approved");

  const joinedReject = joinPlanningTeam({
    teamId: created.body.team.id,
    role: "escort",
    walletAddress: "0xJoinReject"
  });
  assert.equal(joinedReject.status, 202);
  assert.ok(!("ok" in joinedReject.body));
  const joinedRejectBody = joinedReject.body;

  const rejected = rejectPlanningTeamApplication({
    teamId: created.body.team.id,
    applicationId: joinedRejectBody.application.id,
    walletAddress: "0xCaptain005",
    reason: "Role not needed"
  });

  assert.equal(rejected.status, 200);
  assert.ok(!("ok" in rejected.body));
  assert.equal(rejected.body.team.applications.find((item) => item.id === joinedRejectBody.application.id)?.status, "rejected");
});

test("member can leave and captain can disband planning team", () => {
  const created = createPlanningTeam({
    teamName: "Lifecycle Squad",
    maxMembers: 3,
    roleSlots: {
      collector: 1,
      hauler: 1,
      escort: 1
    },
    walletAddress: "0xCaptain006"
  });
  assert.equal(created.status, 201);
  assert.ok(!("ok" in created.body));

  const joined = joinPlanningTeam({
    teamId: created.body.team.id,
    role: "hauler",
    walletAddress: "0xJoinLeave"
  });
  assert.equal(joined.status, 202);
  assert.ok(!("ok" in joined.body));

  const approved = approvePlanningTeamApplication({
    teamId: created.body.team.id,
    applicationId: joined.body.application.id,
    walletAddress: "0xCaptain006"
  });
  assert.equal(approved.status, 200);
  assert.ok(!("ok" in approved.body));

  const left = leavePlanningTeam({
    teamId: created.body.team.id,
    walletAddress: "0xJoinLeave"
  });
  assert.equal(left.status, 200);
  assert.ok(!("ok" in left.body));
  assert.equal(left.body.team?.memberCount, 1);

  const disbanded = disbandPlanningTeam({
    teamId: created.body.team.id,
    walletAddress: "0xCaptain006"
  });
  assert.equal(disbanded.status, 200);
  assert.ok(!("ok" in disbanded.body));
  assert.equal(disbanded.body.totalTeams, 0);
});
