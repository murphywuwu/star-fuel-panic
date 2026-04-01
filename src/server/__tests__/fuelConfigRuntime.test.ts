import assert from "node:assert/strict";
import test from "node:test";

import {
  __resetFuelConfigRuntimeForTests,
  __setFuelConfigCacheForTests,
  __setFuelConfigClientForTests,
  getFuelConfigCache,
  getFuelGradeInfo,
  refreshFuelConfigCache
} from "@/server/fuelConfigRuntime.ts";

const ORIGINAL_FUEL_CONFIG_ID = process.env.EVE_FRONTIER_FUEL_CONFIG_ID;

function buildMockClient() {
  return {
    async getObject(input: { id: string }) {
      if (input.id === "0xfuel-config") {
        return {
          data: {
            content: {
              fields: {
                fuel_efficiency: {
                  id: {
                    id: "0xfuel-table"
                  }
                }
              }
            }
          }
        };
      }

      if (input.id === "0xentry-standard") {
        return {
          data: {
            content: {
              fields: {
                name: "11",
                value: "25"
              }
            }
          }
        };
      }

      if (input.id === "0xentry-premium") {
        return {
          data: {
            content: {
              fields: {
                name: "22",
                value: "55"
              }
            }
          }
        };
      }

      if (input.id === "0xentry-refined") {
        return {
          data: {
            content: {
              fields: {
                name: "33",
                value: "85"
              }
            }
          }
        };
      }

      throw new Error(`Unexpected object lookup: ${input.id}`);
    },
    async getDynamicFields() {
      return {
        data: [
          { objectId: "0xentry-standard" },
          { objectId: "0xentry-premium" },
          { objectId: "0xentry-refined" }
        ],
        hasNextPage: false,
        nextCursor: null
      };
    }
  };
}

test.beforeEach(() => {
  __resetFuelConfigRuntimeForTests();
  delete process.env.EVE_FRONTIER_FUEL_CONFIG_ID;
});

test.after(() => {
  if (ORIGINAL_FUEL_CONFIG_ID) {
    process.env.EVE_FRONTIER_FUEL_CONFIG_ID = ORIGINAL_FUEL_CONFIG_ID;
  } else {
    delete process.env.EVE_FRONTIER_FUEL_CONFIG_ID;
  }
});

test("refreshFuelConfigCache loads efficiency map and grade info from FuelConfig table", async () => {
  process.env.EVE_FRONTIER_FUEL_CONFIG_ID = "0xfuel-config";
  __setFuelConfigClientForTests(buildMockClient());

  const cache = await refreshFuelConfigCache({ force: true });

  assert.equal(cache.stale, false);
  assert.deepEqual(cache.efficiencyMap, {
    11: 25,
    22: 55,
    33: 85
  });

  assert.equal(getFuelGradeInfo(11).grade, "standard");
  assert.equal(getFuelGradeInfo(22).grade, "premium");
  assert.equal(getFuelGradeInfo(33).grade, "refined");
});

test("refreshFuelConfigCache falls back to stale cache when FuelConfig lookup fails", async () => {
  process.env.EVE_FRONTIER_FUEL_CONFIG_ID = "0xfuel-config";
  __setFuelConfigCacheForTests({
    lastUpdatedAt: "2026-03-31T10:00:00.000Z",
    efficiencyMap: {
      22: 55
    },
    stale: false
  });
  __setFuelConfigClientForTests({
    async getObject() {
      throw new Error("rpc unavailable");
    },
    async getDynamicFields() {
      throw new Error("rpc unavailable");
    }
  });

  const cache = await refreshFuelConfigCache({ force: true });

  assert.equal(cache.stale, true);
  assert.deepEqual(cache.efficiencyMap, {
    22: 55
  });
  assert.equal(getFuelGradeInfo(22).bonus, 1.25);
});

test("missing FuelConfig id keeps runtime in stale default mode", async () => {
  const cache = await refreshFuelConfigCache({ force: true });

  assert.equal(cache.stale, true);
  assert.deepEqual(cache.efficiencyMap, {});
  assert.equal(getFuelConfigCache().stale, true);
  assert.equal(getFuelGradeInfo(999).grade, "standard");
  assert.equal(getFuelGradeInfo(999).bonus, 1.0);
});
