import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  appendPersistedFuelEvents,
  createEmptyProjectionState,
  listPersistedFuelEvents,
  readRuntimeProjectionState,
  resolveRuntimeProjectionPath,
  writeRuntimeProjectionState
} from "./runtimeProjectionStore.ts";

const originalProjectionStorePath = process.env.RUNTIME_PROJECTION_STORE_PATH;

function installTempProjection() {
  const root = mkdtempSync(path.join(os.tmpdir(), "fuel-events-projection-"));
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

test("appendPersistedFuelEvents stores grade-aware fuel event facts", () => {
  appendPersistedFuelEvents([
    {
      matchId: "match-001",
      eventId: "evt-001",
      txDigest: "tx-001",
      senderWallet: "0xpilot",
      teamId: "team-alpha",
      assemblyId: "0xnode",
      fuelAdded: 100,
      fuelTypeId: 33,
      fuelGrade: "refined",
      fuelGradeBonus: 1.5,
      urgencyWeight: 3,
      panicMultiplier: 1.5,
      scoreDelta: 675,
      chainTs: 1_234,
      createdAt: "2026-03-31T12:00:00.000Z"
    }
  ]);

  const events = listPersistedFuelEvents("match-001");
  assert.equal(events.length, 1);
  assert.equal(events[0]?.fuelTypeId, 33);
  assert.equal(events[0]?.fuelGrade, "refined");
  assert.equal(events[0]?.fuelGradeBonus, 1.5);
});

test("legacy fuel events missing v2.7 fields are sanitized with standard-grade defaults", () => {
  const filePath = resolveRuntimeProjectionPath();
  const legacyState = createEmptyProjectionState() as unknown as Record<string, unknown>;
  legacyState.version = 1;
  legacyState.fuelEvents = [
    {
      matchId: "legacy-match",
      eventId: "legacy-evt",
      txDigest: "legacy-tx",
      senderWallet: "0xlegacy",
      teamId: "legacy-team",
      assemblyId: "0xlegacy-node",
      fuelAdded: 80,
      urgencyWeight: 1.5,
      panicMultiplier: 1,
      scoreDelta: 120,
      chainTs: 999,
      createdAt: "2026-03-31T11:00:00.000Z"
    }
  ];

  writeFileSync(filePath, JSON.stringify(legacyState, null, 2), "utf8");

  const state = readRuntimeProjectionState();
  assert.equal(state.fuelEvents.length, 1);
  assert.equal(state.fuelEvents[0]?.fuelTypeId, 0);
  assert.equal(state.fuelEvents[0]?.fuelGrade, "standard");
  assert.equal(state.fuelEvents[0]?.fuelGradeBonus, 1.0);
});
