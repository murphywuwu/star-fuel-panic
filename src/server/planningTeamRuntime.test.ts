import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { createPlanningTeam, getPlanningTeamsSnapshot, joinPlanningTeam } from "./planningTeamRuntime.ts";
import { createEmptyProjectionState, writeRuntimeProjectionState } from "./runtimeProjectionStore.ts";

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

test("joinPlanningTeam appends a member when role slot is open", () => {
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

  assert.equal(joined.status, 200);
  assert.ok(!("ok" in joined.body));
  assert.equal(joined.body.team.memberCount, 2);
  assert.equal(joined.body.team.members[1]?.walletAddress, "0xjoin001");
  assert.equal(joined.body.team.members[1]?.role, "hauler");
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
