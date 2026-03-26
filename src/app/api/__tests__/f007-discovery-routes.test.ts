import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { GET as getConstellations } from "../constellations/route.ts";
import { GET as getConstellationDetail } from "../constellations/[id]/route.ts";
import { GET as getSearch } from "../search/route.ts";
import { GET as getSolarSystemRecommendations } from "../solar-systems/recommendations/route.ts";
import { GET as getNodeRecommendations } from "../network-nodes/recommendations/route.ts";
import { __resetSolarSystemRuntimeForTests } from "../../../server/solarSystemRuntime.ts";
import {
  createEmptyProjectionState,
  writeRuntimeProjectionState
} from "../../../server/runtimeProjectionStore.ts";

const originalFetch = global.fetch;
const originalNodeIndexStorePath = process.env.NODE_INDEX_STORE_PATH;
const originalProjectionStorePath = process.env.RUNTIME_PROJECTION_STORE_PATH;
const originalCacheTtl = process.env.EVE_FRONTIER_WORLD_API_CACHE_TTL_MS;

function createResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async text() {
      return JSON.stringify(body);
    },
    async json() {
      return body;
    }
  } as Response;
}

function createNodeIndexSnapshot() {
  const now = "2026-03-26T12:00:00.000Z";
  return {
    version: 1 as const,
    lastSyncAt: now,
    cursor: null,
    nodes: [
      {
        id: "node-jita-critical",
        objectId: "node-jita-critical",
        name: "Jita Critical Gate",
        typeId: 101,
        ownerAddress: "shared",
        ownerCapId: null,
        isPublic: true,
        coordX: 1,
        coordY: 2,
        coordZ: 3,
        solarSystem: 30000142,
        fuelQuantity: 10,
        fuelMaxCapacity: 100,
        fuelTypeId: 1,
        fuelBurnRate: 1,
        isBurning: true,
        fillRatio: 0.1,
        urgency: "critical" as const,
        maxEnergyProduction: 100,
        currentEnergyProduction: 60,
        isOnline: true,
        connectedAssemblyIds: [],
        description: "Critical node in Jita",
        imageUrl: null,
        lastUpdatedOnChain: now,
        updatedAt: now
      },
      {
        id: "node-kisogo-warning",
        objectId: "node-kisogo-warning",
        name: "Kisogo Relay",
        typeId: 102,
        ownerAddress: "shared",
        ownerCapId: null,
        isPublic: true,
        coordX: 4,
        coordY: 5,
        coordZ: 6,
        solarSystem: 30000141,
        fuelQuantity: 30,
        fuelMaxCapacity: 100,
        fuelTypeId: 1,
        fuelBurnRate: 1,
        isBurning: false,
        fillRatio: 0.3,
        urgency: "warning" as const,
        maxEnergyProduction: 100,
        currentEnergyProduction: 40,
        isOnline: true,
        connectedAssemblyIds: [],
        description: "Warning node in Kisogo",
        imageUrl: null,
        lastUpdatedOnChain: now,
        updatedAt: now
      },
      {
        id: "node-perimeter-hidden",
        objectId: "node-perimeter-hidden",
        name: "Perimeter Hidden",
        typeId: 103,
        ownerAddress: "shared",
        ownerCapId: null,
        isPublic: false,
        coordX: 7,
        coordY: 8,
        coordZ: 9,
        solarSystem: 30000143,
        fuelQuantity: 80,
        fuelMaxCapacity: 100,
        fuelTypeId: 1,
        fuelBurnRate: 1,
        isBurning: false,
        fillRatio: 0.8,
        urgency: "safe" as const,
        maxEnergyProduction: 100,
        currentEnergyProduction: 80,
        isOnline: false,
        connectedAssemblyIds: [],
        description: "Hidden node in Perimeter",
        imageUrl: null,
        lastUpdatedOnChain: now,
        updatedAt: now
      }
    ]
  };
}

function installWorldApiSuccessStub() {
  global.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/v2/solarsystems?")) {
      return createResponse({
        data: [
          {
            id: 30000141,
            name: "Kisogo",
            constellationId: 20000020,
            regionId: 10000002,
            location: { x: 1, y: 2, z: 3 }
          },
          {
            id: 30000142,
            name: "Jita",
            constellationId: 20000020,
            regionId: 10000002,
            location: { x: 4, y: 5, z: 6 }
          },
          {
            id: 30000143,
            name: "Perimeter",
            constellationId: 20000021,
            regionId: 10000002,
            location: { x: 7, y: 8, z: 9 }
          }
        ],
        metadata: {
          limit: 50,
          offset: 0,
          total: 3
        }
      });
    }

    throw new Error(`Unexpected fetch url: ${url}`);
  }) as typeof fetch;
}

function installWorldApiFailureStub() {
  global.fetch = (async () => createResponse({ message: "upstream unavailable" }, 503)) as typeof fetch;
}

function buildTempPaths() {
  const root = mkdtempSync(path.join(os.tmpdir(), "f007-discovery-"));
  return {
    root,
    nodeIndexPath: path.join(root, "node-index.json"),
    projectionPath: path.join(root, "projection.json")
  };
}

test.beforeEach(() => {
  const paths = buildTempPaths();
  process.env.NODE_INDEX_STORE_PATH = paths.nodeIndexPath;
  process.env.RUNTIME_PROJECTION_STORE_PATH = paths.projectionPath;
  process.env.EVE_FRONTIER_WORLD_API_CACHE_TTL_MS = "60000";
  writeFileSync(paths.nodeIndexPath, JSON.stringify(createNodeIndexSnapshot(), null, 2), "utf8");
  writeRuntimeProjectionState(createEmptyProjectionState());
  __resetSolarSystemRuntimeForTests();
  installWorldApiSuccessStub();
  (globalThis as typeof globalThis & { __f007DiscoveryTmpRoot?: string }).__f007DiscoveryTmpRoot = paths.root;
});

test.afterEach(() => {
  const root = (globalThis as typeof globalThis & { __f007DiscoveryTmpRoot?: string }).__f007DiscoveryTmpRoot;
  if (root) {
    rmSync(root, { recursive: true, force: true });
  }
  delete (globalThis as typeof globalThis & { __f007DiscoveryTmpRoot?: string }).__f007DiscoveryTmpRoot;
  global.fetch = originalFetch;
  process.env.NODE_INDEX_STORE_PATH = originalNodeIndexStorePath;
  process.env.RUNTIME_PROJECTION_STORE_PATH = originalProjectionStorePath;
  process.env.EVE_FRONTIER_WORLD_API_CACHE_TTL_MS = originalCacheTtl;
  __resetSolarSystemRuntimeForTests();
});

test("F-007 T-0702 discovery APIs cover constellations, search, system recommendations, and node recommendations", async () => {
  const constellationResponse = await getConstellations(new Request("http://localhost/api/constellations"));
  assert.equal(constellationResponse.status, 200);
  const constellationJson = await constellationResponse.json();
  assert.equal(constellationJson.constellations.length, 2);
  assert.equal(constellationJson.constellations[0].constellationId, 20000020);

  const constellationDetailResponse = await getConstellationDetail(new Request("http://localhost/api/constellations/20000020"), {
    params: Promise.resolve({ id: "20000020" })
  });
  assert.equal(constellationDetailResponse.status, 200);
  const constellationDetailJson = await constellationDetailResponse.json();
  assert.equal(constellationDetailJson.constellation.constellationId, 20000020);
  assert.equal(constellationDetailJson.systems.length, 2);
  assert.equal(constellationDetailJson.systems[0].selectableState, "selectable");

  const searchResponse = await getSearch(new Request("http://localhost/api/search?q=jita"));
  assert.equal(searchResponse.status, 200);
  const searchJson = await searchResponse.json();
  assert.equal(searchJson.q, "jita");
  assert.equal(searchJson.hits[0].type, "system");
  assert.match(searchJson.hits[0].label, /Jita/);

  const recommendationsResponse = await getSolarSystemRecommendations();
  assert.equal(recommendationsResponse.status, 200);
  const recommendationsJson = await recommendationsResponse.json();
  assert.equal(recommendationsJson.recommendations.length, 3);
  assert.equal(recommendationsJson.recommendations[0].system.systemId, 30000142);

  const nodeRecommendationsResponse = await getNodeRecommendations(
    new Request("http://localhost/api/network-nodes/recommendations?currentSystem=30000142&limit=2")
  );
  assert.equal(nodeRecommendationsResponse.status, 200);
  const nodeRecommendationsJson = await nodeRecommendationsResponse.json();
  assert.equal(nodeRecommendationsJson.meta.topologyAvailable, false);
  assert.equal(nodeRecommendationsJson.recommendations.length, 1);
  assert.equal(nodeRecommendationsJson.recommendations[0].node.id, "node-jita-critical");
  assert.equal(nodeRecommendationsJson.recommendations[0].distanceHops, 0);
});

test("F-007 T-0705 search falls back to cached world data and marks stale when refresh fails", async () => {
  const firstResponse = await getSearch(new Request("http://localhost/api/search?q=kisogo"));
  assert.equal(firstResponse.status, 200);
  const firstJson = await firstResponse.json();
  assert.equal(firstJson.stale, undefined);
  assert.equal(firstJson.hits[0].label, "Kisogo (30000141)");

  await new Promise((resolve) => setTimeout(resolve, 5));
  process.env.EVE_FRONTIER_WORLD_API_CACHE_TTL_MS = "0";
  installWorldApiFailureStub();

  const staleResponse = await getSearch(new Request("http://localhost/api/search?q=kisogo"));
  assert.equal(staleResponse.status, 200);
  const staleJson = await staleResponse.json();
  assert.equal(staleJson.stale, true);
  assert.equal(staleJson.hits[0].label, "Kisogo (30000141)");
});
