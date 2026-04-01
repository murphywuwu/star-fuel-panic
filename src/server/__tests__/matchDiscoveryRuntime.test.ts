import assert from "node:assert/strict";
import test from "node:test";

import { getMatchDiscoveryDetail, listMatchDiscoveryItems } from "@/server/matchDiscoveryRuntime.ts";
import { resetMatchRuntime } from "@/server/matchRuntime.ts";
import { resetMissionRuntime } from "@/server/missionRuntime.ts";

const originalFetch = global.fetch;

function createResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    async text() {
      return JSON.stringify(body);
    }
  } as Response;
}

test.beforeEach(() => {
  resetMissionRuntime();
  resetMatchRuntime();
});

test("listMatchDiscoveryItems returns lobby-ready card fields", async () => {
  global.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.includes("/v2/solarsystems?")) {
      return createResponse({
        data: [
          {
            id: 30000142,
            name: "Jita",
            constellationId: 20000020,
            regionId: 10000002,
            location: { x: 1, y: 2, z: 3 }
          }
        ],
        metadata: {
          limit: 500,
          offset: 0,
          total: 1
        }
      });
    }

    throw new Error(`Unexpected fetch: ${url}`);
  }) as typeof fetch;

  const items = await listMatchDiscoveryItems({
    filters: { status: "lobby", limit: 1 },
    currentSystemId: 30000142
  });

  assert.equal(items.length, 1);
  assert.equal(items[0]?.mode, "free");
  assert.equal(items[0]?.targetSolarSystem.systemName, "Jita");
  assert.ok((items[0]?.teamProgress.registeredTeams ?? 0) > 0);
  assert.equal(items[0]?.distanceHops, 0);
  assert.equal(items[0]?.distanceHint, "同星系");
});

test("getMatchDiscoveryDetail returns detail payload for lobby preview", async () => {
  global.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.includes("/v2/solarsystems?")) {
      return createResponse({
        data: [
          {
            id: 30000142,
            name: "Jita",
            constellationId: 20000020,
            regionId: 10000002,
            location: { x: 1, y: 2, z: 3 }
          }
        ],
        metadata: {
          limit: 500,
          offset: 0,
          total: 1
        }
      });
    }

    throw new Error(`Unexpected fetch: ${url}`);
  }) as typeof fetch;

  const detail = await getMatchDiscoveryDetail("mission-ssu-7", 30000142);

  assert.ok(detail);
  assert.equal(detail?.match.targetSolarSystem.systemName, "Jita");
  assert.equal(detail?.match.modeLabel, "自由模式");
  assert.ok((detail?.teams.length ?? 0) > 0);
  assert.ok(detail?.match.grossPool && detail.match.grossPool > 0);
});

test("listMatchDiscoveryItems returns unknown distance when current location is missing", async () => {
  global.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.includes("/v2/solarsystems?")) {
      return createResponse({
        data: [
          {
            id: 30000142,
            name: "Jita",
            constellationId: 20000020,
            regionId: 10000002,
            location: { x: 1, y: 2, z: 3 }
          }
        ],
        metadata: {
          limit: 500,
          offset: 0,
          total: 1
        }
      });
    }

    throw new Error(`Unexpected fetch: ${url}`);
  }) as typeof fetch;

  const items = await listMatchDiscoveryItems({
    filters: { status: "lobby", limit: 1 },
    currentSystemId: null
  });

  assert.equal(items[0]?.distanceHops, null);
  assert.equal(items[0]?.distanceHint, "距离未知");
});

test.after(() => {
  global.fetch = originalFetch;
});
