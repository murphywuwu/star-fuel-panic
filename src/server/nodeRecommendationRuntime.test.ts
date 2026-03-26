import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { getNodeRecommendations } from "./nodeRecommendationRuntime.ts";

const originalNodeIndexPath = process.env.NODE_INDEX_STORE_PATH;

test("getNodeRecommendations falls back to same-system nodes when topology is unavailable", async () => {
  const tempDir = mkdtempSync(path.join(tmpdir(), "ffp-node-rec-"));
  const snapshotPath = path.join(tempDir, "node-index.json");
  process.env.NODE_INDEX_STORE_PATH = snapshotPath;

  writeFileSync(
    snapshotPath,
    JSON.stringify(
      {
        version: 2,
        lastSyncAt: "2026-03-26T00:00:00.000Z",
        discoveryCursor: null,
        locationCursor: null,
        nodes: [
          {
            id: "node-jita-1",
            objectId: "node-jita-1",
            name: "Jita Relay",
            typeId: 88092,
            ownerAddress: "shared",
            ownerCapId: "cap-jita-1",
            isPublic: true,
            coordX: 10,
            coordY: 20,
            coordZ: 30,
            solarSystem: 30000142,
            fuelQuantity: 10,
            fuelMaxCapacity: 1000,
            fuelTypeId: 1,
            fuelBurnRate: 60000,
            isBurning: false,
            fillRatio: 0.01,
            urgency: "critical",
            maxEnergyProduction: 100,
            currentEnergyProduction: 0,
            isOnline: true,
            connectedAssemblyIds: [],
            description: null,
            imageUrl: null,
            lastUpdatedOnChain: "2026-03-26T00:00:00.000Z",
            updatedAt: "2026-03-26T00:00:00.000Z"
          }
        ]
      },
      null,
      2
    )
  );

  const result = await getNodeRecommendations(30000142, { limit: 5 }, { forceRefresh: true });

  assert.equal(result.meta.topologyAvailable, false);
  assert.equal(result.recommendations.length, 1);
  assert.equal(result.recommendations[0]?.distance, 0);
  assert.equal(result.recommendations[0]?.node.name, "Jita Relay");

  rmSync(tempDir, { recursive: true, force: true });
});

test("getNodeRecommendations returns empty recommendations when no same-system nodes exist", async () => {
  const tempDir = mkdtempSync(path.join(tmpdir(), "ffp-node-rec-empty-"));
  const snapshotPath = path.join(tempDir, "node-index.json");
  process.env.NODE_INDEX_STORE_PATH = snapshotPath;

  writeFileSync(
    snapshotPath,
    JSON.stringify(
      {
        version: 2,
        lastSyncAt: "2026-03-26T00:00:00.000Z",
        discoveryCursor: null,
        locationCursor: null,
        nodes: [
          {
            id: "node-jita-1",
            objectId: "node-jita-1",
            name: "Jita Relay",
            typeId: 88092,
            ownerAddress: "shared",
            ownerCapId: "cap-jita-1",
            isPublic: true,
            coordX: 10,
            coordY: 20,
            coordZ: 30,
            solarSystem: 30000142,
            fuelQuantity: 10,
            fuelMaxCapacity: 1000,
            fuelTypeId: 1,
            fuelBurnRate: 60000,
            isBurning: false,
            fillRatio: 0.01,
            urgency: "critical",
            maxEnergyProduction: 100,
            currentEnergyProduction: 0,
            isOnline: true,
            connectedAssemblyIds: [],
            description: null,
            imageUrl: null,
            lastUpdatedOnChain: "2026-03-26T00:00:00.000Z",
            updatedAt: "2026-03-26T00:00:00.000Z"
          }
        ]
      },
      null,
      2
    )
  );

  const result = await getNodeRecommendations(30009999, { limit: 5 }, { forceRefresh: true });

  assert.equal(result.meta.topologyAvailable, false);
  assert.equal(result.recommendations.length, 0);

  rmSync(tempDir, { recursive: true, force: true });
});

test.after(() => {
  if (originalNodeIndexPath === undefined) {
    delete process.env.NODE_INDEX_STORE_PATH;
    return;
  }

  process.env.NODE_INDEX_STORE_PATH = originalNodeIndexPath;
});
