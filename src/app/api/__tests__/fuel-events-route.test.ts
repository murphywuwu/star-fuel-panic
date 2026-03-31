import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { POST } from "../matches/[id]/fuel-events/route.ts";
import { createEmptyProjectionState, listPersistedFuelEvents, writeRuntimeProjectionState } from "../../../server/runtimeProjectionStore.ts";

const originalProjectionStorePath = process.env.RUNTIME_PROJECTION_STORE_PATH;

function installTempProjection() {
  const root = mkdtempSync(path.join(os.tmpdir(), "fuel-events-route-"));
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

test("fuel-events route persists accepted score events into runtime projection", async () => {
  const response = await POST(
    new Request("http://localhost/api/matches/match-001/fuel-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        scoreEvent: {
          id: "score-evt-001",
          matchId: "match-001",
          teamId: "team-alpha",
          memberWallet: "0xpilot",
          memberName: "Pilot Alpha",
          txDigest: "tx-001",
          assemblyId: "0xnode",
          oldQuantity: 100,
          newQuantity: 200,
          maxCapacity: 1000,
          fuelDelta: 100,
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
          fillRatioAt: 0.1,
          urgencyWeight: 3,
          panicMultiplier: 1.5,
          fuelGradeBonus: 1.5,
          score: 675,
          chainTs: 1234,
          createdAt: 1234
        }
      })
    }),
    {
      params: Promise.resolve({
        id: "match-001"
      })
    }
  );

  assert.equal(response.status, 202);
  const payload = await response.json();
  assert.equal(payload.ok, true);

  const fuelEvents = listPersistedFuelEvents("match-001");
  assert.equal(fuelEvents.length, 1);
  assert.equal(fuelEvents[0]?.fuelTypeId, 33);
  assert.equal(fuelEvents[0]?.fuelGrade, "refined");
  assert.equal(fuelEvents[0]?.fuelGradeBonus, 1.5);
});
