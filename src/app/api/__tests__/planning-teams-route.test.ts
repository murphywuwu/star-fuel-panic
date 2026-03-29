import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { GET, POST } from "../planning-teams/route.ts";
import { POST as POST_JOIN } from "../planning-teams/[id]/join/route.ts";
import { createEmptyProjectionState, writeRuntimeProjectionState } from "../../../server/runtimeProjectionStore.ts";
import { buildDevWalletSignature } from "../../../server/walletSignature.ts";

const originalProjectionStorePath = process.env.RUNTIME_PROJECTION_STORE_PATH;

function installTempProjection() {
  const root = mkdtempSync(path.join(os.tmpdir(), "planning-team-route-"));
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

test("planning teams route creates and lists standalone teams", async () => {
  const walletAddress = "0xCaptain010";
  const message = `FuelFrogPanic:create-planning-team:planning-registry\nwallet=${walletAddress.toLowerCase()}\nts=2026-03-28T12:00:00.000Z`;
  const signature = buildDevWalletSignature(walletAddress, message);

  const createdResponse = await POST(
    new Request("http://localhost/api/planning-teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-create-1"
      },
      body: JSON.stringify({
        name: "Frontier Wolves",
        maxMembers: 3,
        roleSlots: {
          collector: 1,
          hauler: 1,
          escort: 1
        },
        walletAddress,
        signature,
        message
      })
    })
  );

  assert.equal(createdResponse.status, 201);
  const createdJson = await createdResponse.json();
  assert.equal(createdJson.ok, true);
  assert.equal(createdJson.data.team.name, "Frontier Wolves");
  assert.equal(createdJson.data.totalTeams, 1);
  assert.equal(createdJson.data.team.members.length, 1);

  const listedResponse = await GET();
  assert.equal(listedResponse.status, 200);
  const listedJson = await listedResponse.json();
  assert.equal(listedJson.ok, true);
  assert.equal(listedJson.data.totalTeams, 1);
  assert.equal(listedJson.data.items[0]?.name, "Frontier Wolves");
  assert.equal(listedJson.data.items[0]?.members.length, 1);

  const joinWalletAddress = "0xJoin020";
  const joinMessage = `FuelFrogPanic:join-planning-team:${createdJson.data.team.id}\nwallet=${joinWalletAddress.toLowerCase()}\nts=2026-03-28T12:01:00.000Z`;
  const joinSignature = buildDevWalletSignature(joinWalletAddress, joinMessage);

  const joinedResponse = await POST_JOIN(
    new Request(`http://localhost/api/planning-teams/${createdJson.data.team.id}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-join-1"
      },
      body: JSON.stringify({
        role: "hauler",
        walletAddress: joinWalletAddress,
        signature: joinSignature,
        message: joinMessage
      })
    }),
    {
      params: Promise.resolve({
        id: createdJson.data.team.id
      })
    }
  );

  assert.equal(joinedResponse.status, 200);
  const joinedJson = await joinedResponse.json();
  assert.equal(joinedJson.ok, true);
  assert.equal(joinedJson.data.team.memberCount, 2);
  assert.equal(joinedJson.data.team.members[1]?.walletAddress, "0xjoin020");
});
