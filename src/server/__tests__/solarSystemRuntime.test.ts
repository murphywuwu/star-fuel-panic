import assert from "node:assert/strict";
import test from "node:test";

import { getSolarSystemDetailById, getSolarSystemStats, querySolarSystems, syncSolarSystemsOnce } from "../solarSystemRuntime.ts";

const originalFetch = global.fetch;

function createResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    async text() {
      return JSON.stringify(body);
    },
    async json() {
      return body;
    }
  } as Response;
}

test("syncSolarSystemsOnce fetches all world-api pages and maps fields", async () => {
  const calls: string[] = [];

  global.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push(url);

    if (url.includes("offset=0")) {
      return createResponse({
        data: [
          {
            id: 30000141,
            name: "Kisogo",
            constellationId: 20000020,
            regionId: 10000002,
            location: { x: 1, y: 2, z: 3 }
          }
        ],
        metadata: {
          limit: 1,
          offset: 0,
          total: 2
        }
      });
    }

    return createResponse({
      data: [
        {
          id: 30000142,
          name: "Jita",
          constellationId: 20000020,
          regionId: 10000002,
          location: { x: 4, y: 5, z: 6 }
        }
      ],
      metadata: {
        limit: 1,
        offset: 1,
        total: 2
      }
    });
  }) as typeof fetch;

  process.env.EVE_FRONTIER_WORLD_API_PAGE_SIZE = "1";

  const snapshot = await syncSolarSystemsOnce();

  assert.equal(snapshot.systems.length, 2);
  assert.deepEqual(
    snapshot.systems.map((system) => system.systemName),
    ["Jita", "Kisogo"]
  );
  assert.equal(snapshot.stats.totalSystems, 2);
  assert.equal(calls.length, 2);
  assert.equal(snapshot.systems[0]?.location.x, "4");
  assert.equal(snapshot.systems[1]?.location.z, "3");
});

test("querySolarSystems supports systemId, namePattern, limit and offset", async () => {
  const calls: string[] = [];

  global.fetch = (async (input: RequestInfo | URL) => {
    calls.push(String(input));
    return createResponse({
      data: [
        {
          id: 30000141,
          name: "Kisogo",
          constellationId: 1,
          regionId: 2,
          location: { x: 1, y: 2, z: 3 }
        },
        {
          id: 30000142,
          name: "Jita",
          constellationId: 1,
          regionId: 2,
          location: { x: 4, y: 5, z: 6 }
        },
        {
          id: 30000143,
          name: "Amarr",
          constellationId: 1,
          regionId: 3,
          location: { x: 7, y: 8, z: 9 }
        }
      ],
      metadata: {
        limit: 500,
        offset: 0,
        total: 3
      }
    });
  }) as typeof fetch;

  process.env.EVE_FRONTIER_WORLD_API_PAGE_SIZE = "500";
  await syncSolarSystemsOnce();

  const byId = await querySolarSystems({ systemId: 30000142 });
  assert.equal(byId.length, 1);
  assert.equal(byId[0]?.systemName, "Jita");

  const byName = await querySolarSystems({ namePattern: "go" });
  assert.equal(byName.length, 1);
  assert.equal(byName[0]?.systemName, "Kisogo");

  const paged = await querySolarSystems({ offset: 1, limit: 1 });
  assert.equal(paged.length, 1);
  assert.equal(paged[0]?.systemName, "Jita");

  const stats = await getSolarSystemStats();
  assert.equal(stats.totalSystems, 3);
  assert.equal(stats.returnedSystems, 3);
  assert.equal(calls.length, 1);
});

test("getSolarSystemDetailById returns gate links from detail endpoint", async () => {
  global.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.includes("/v2/solarsystems?")) {
      return createResponse({
        data: [
          {
            id: 30000141,
            name: "Kisogo",
            constellationId: 1,
            regionId: 2,
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

    return createResponse({
      id: 30000141,
      name: "Kisogo",
      constellationId: 1,
      regionId: 2,
      location: { x: 1, y: 2, z: 3 },
      gateLinks: [
        {
          id: 9001,
          name: "Stargate Alpha",
          location: { x: 10, y: 20, z: 30 },
          destination: {
            id: 30000142,
            name: "Jita",
            constellationId: 2,
            regionId: 3,
            location: { x: 40, y: 50, z: 60 }
          }
        }
      ]
    });
  }) as typeof fetch;

  await syncSolarSystemsOnce();
  const detail = await getSolarSystemDetailById(30000141);

  assert.ok(detail);
  assert.equal(detail?.systemName, "Kisogo");
  assert.equal(detail?.gateLinks.length, 1);
  assert.equal(detail?.gateLinks[0]?.destination.systemName, "Jita");
  assert.equal(detail?.location.x, "1");
  assert.equal(detail?.gateLinks[0]?.location.z, "30");
  assert.equal(detail?.gateLinks[0]?.destination.location.y, "50");
});

test.after(() => {
  global.fetch = originalFetch;
  delete process.env.EVE_FRONTIER_WORLD_API_PAGE_SIZE;
});
