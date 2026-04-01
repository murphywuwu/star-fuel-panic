import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { writeNodeIndexSnapshot } from "../nodeIndexStore.ts";
import { listNodes } from "../nodeRuntime.ts";
import { createEmptyProjectionState, writeRuntimeProjectionState } from "../runtimeProjectionStore.ts";

const originalFetch = global.fetch;
const originalNodeIndexPath = process.env.NODE_INDEX_STORE_PATH;
const originalProjectionPath = process.env.RUNTIME_PROJECTION_STORE_PATH;
const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

test.afterEach(() => {
  const nodeIndexPath = process.env.NODE_INDEX_STORE_PATH;
  if (nodeIndexPath) {
    rmSync(path.dirname(nodeIndexPath), { recursive: true, force: true });
  }

  global.fetch = originalFetch;

  if (originalNodeIndexPath === undefined) {
    delete process.env.NODE_INDEX_STORE_PATH;
  } else {
    process.env.NODE_INDEX_STORE_PATH = originalNodeIndexPath;
  }

  if (originalProjectionPath === undefined) {
    delete process.env.RUNTIME_PROJECTION_STORE_PATH;
  } else {
    process.env.RUNTIME_PROJECTION_STORE_PATH = originalProjectionPath;
  }

  if (originalSupabaseUrl === undefined) {
    delete process.env.SUPABASE_URL;
  } else {
    process.env.SUPABASE_URL = originalSupabaseUrl;
  }

  if (originalServiceRole === undefined) {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  } else {
    process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceRole;
  }
});

test("listNodes keeps passive reads side-effect free even when Supabase is configured", async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "ffp-node-runtime-read-"));
  process.env.NODE_INDEX_STORE_PATH = path.join(root, "node-index.json");
  process.env.RUNTIME_PROJECTION_STORE_PATH = path.join(root, "runtime-projections.json");
  process.env.SUPABASE_URL = "https://supabase.example.com";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

  writeRuntimeProjectionState(createEmptyProjectionState());
  await writeNodeIndexSnapshot({
    version: 3,
    lastSyncAt: "2026-04-02T08:00:00.000Z",
    discoveryCursor: null,
    locationCursor: null,
    nodes: [
      {
        id: "node-read-only-1",
        objectId: "node-read-only-1",
        name: "Read Only Relay",
        typeId: 88092,
        ownerAddress: "shared",
        ownerCapId: "cap-read-only-1",
        isPublic: true,
        coordX: 10,
        coordY: 20,
        coordZ: 30,
        solarSystem: 30000142,
        fuelQuantity: 100,
        fuelMaxCapacity: 1000,
        fuelTypeId: 1,
        fuelBurnRate: 60000,
        isBurning: false,
        fillRatio: 0.1,
        urgency: "critical",
        maxEnergyProduction: 100,
        currentEnergyProduction: 0,
        isOnline: true,
        connectedAssemblyIds: [],
        description: null,
        imageUrl: null,
        lastUpdatedOnChain: "2026-04-02T08:00:00.000Z",
        updatedAt: "2026-04-02T08:00:00.000Z"
      }
    ]
  });

  const calls: Array<{ url: string; method: string }> = [];
  global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({
      url: String(input),
      method: init?.method ?? "GET"
    });

    return {
      ok: true,
      status: 200,
      async json() {
        return [];
      },
      async text() {
        return "[]";
      }
    } as Response;
  }) as typeof fetch;

  const nodes = await listNodes({});

  assert.equal(nodes.length, 1);
  assert.equal(nodes[0]?.objectId, "node-read-only-1");
  assert.deepEqual(calls, []);
});
