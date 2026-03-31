import { getServerSuiClient } from "@/server/suiClient";
import type { FuelConfigCache, FuelGradeInfo } from "@/types/fuelGrade";
import { createEmptyFuelConfigCache, FUEL_CONFIG_REFRESH_MS, resolveFuelGradeInfo } from "@/utils/fuelGrade";

type DynamicFieldPage = {
  data?: Array<Record<string, unknown>>;
  nextCursor?: string | null;
  hasNextPage?: boolean;
};

type SuiClientLike = {
  getObject: (input: {
    id: string;
    options?: {
      showContent?: boolean;
    };
  }) => Promise<unknown>;
  getDynamicFields: (input: {
    parentId: string;
    cursor?: string | null;
    limit?: number;
  }) => Promise<DynamicFieldPage>;
};

let cachedFuelConfig = createEmptyFuelConfigCache();
let lastRefreshStartedAt = 0;
let clientOverride: SuiClientLike | null = null;

function nowIso() {
  return new Date().toISOString();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readObjectFields(value: unknown): Record<string, unknown> | null {
  const root = asRecord(value);
  const data = asRecord(root?.data);
  const content = asRecord(data?.content);
  return asRecord(content?.fields);
}

function parseInteger(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
  }

  return null;
}

function readFuelEfficiencyTableId(fields: Record<string, unknown> | null): string | null {
  const tableRecord = asRecord(fields?.fuel_efficiency);
  if (!tableRecord) {
    return null;
  }

  const directId = typeof tableRecord.id === "string" ? tableRecord.id : null;
  if (directId) {
    return directId;
  }

  const nestedId = asRecord(tableRecord.id);
  return typeof nestedId?.id === "string" ? nestedId.id : null;
}

function readDynamicFieldObjectId(entry: Record<string, unknown>) {
  return typeof entry.objectId === "string" && entry.objectId.trim() ? entry.objectId : null;
}

function readTableEntry(entryFields: Record<string, unknown> | null) {
  if (!entryFields) {
    return null;
  }

  const key = parseInteger(entryFields.name ?? entryFields.key);
  const value = parseInteger(entryFields.value);
  if (key == null || value == null) {
    return null;
  }

  return {
    fuelTypeId: key,
    efficiency: value
  };
}

function getFuelConfigId() {
  return (
    process.env.EVE_FRONTIER_FUEL_CONFIG_ID?.trim() ??
    process.env.NEXT_PUBLIC_EVE_FRONTIER_FUEL_CONFIG_ID?.trim() ??
    null
  );
}

function getClient(): SuiClientLike {
  return clientOverride ?? (getServerSuiClient() as unknown as SuiClientLike);
}

async function listDynamicFieldObjectIds(client: SuiClientLike, parentId: string) {
  const objectIds: string[] = [];
  let cursor: string | null = null;

  do {
    const page = await client.getDynamicFields({
      parentId,
      cursor,
      limit: 50
    });

    for (const entry of page.data ?? []) {
      const objectId = readDynamicFieldObjectId(entry);
      if (objectId) {
        objectIds.push(objectId);
      }
    }

    cursor = page.hasNextPage ? (page.nextCursor ?? null) : null;
  } while (cursor);

  return objectIds;
}

async function loadFuelEfficiencyMap(client: SuiClientLike, fuelConfigId: string) {
  const fuelConfigObject = await client.getObject({
    id: fuelConfigId,
    options: {
      showContent: true
    }
  });
  const fields = readObjectFields(fuelConfigObject);
  const tableId = readFuelEfficiencyTableId(fields);
  if (!tableId) {
    return {};
  }

  const objectIds = await listDynamicFieldObjectIds(client, tableId);
  const efficiencyMap: Record<number, number> = {};

  for (const objectId of objectIds) {
    const object = await client.getObject({
      id: objectId,
      options: {
        showContent: true
      }
    });
    const entry = readTableEntry(readObjectFields(object));
    if (!entry) {
      continue;
    }

    efficiencyMap[entry.fuelTypeId] = entry.efficiency;
  }

  return efficiencyMap;
}

export function getFuelConfigCache() {
  return structuredClone(cachedFuelConfig);
}

export function getFuelGradeInfo(fuelTypeId: number): FuelGradeInfo {
  return resolveFuelGradeInfo(fuelTypeId, cachedFuelConfig.efficiencyMap);
}

export async function refreshFuelConfigCache(options: { force?: boolean } = {}) {
  const startedAt = Date.now();
  if (
    !options.force &&
    cachedFuelConfig.lastUpdatedAt &&
    startedAt - lastRefreshStartedAt < FUEL_CONFIG_REFRESH_MS
  ) {
    return getFuelConfigCache();
  }

  lastRefreshStartedAt = startedAt;
  const fuelConfigId = getFuelConfigId();
  if (!fuelConfigId) {
    cachedFuelConfig = {
      ...cachedFuelConfig,
      stale: true
    };
    return getFuelConfigCache();
  }

  try {
    const efficiencyMap = await loadFuelEfficiencyMap(getClient(), fuelConfigId);
    cachedFuelConfig = {
      lastUpdatedAt: nowIso(),
      efficiencyMap,
      stale: false
    };
  } catch {
    cachedFuelConfig = {
      ...cachedFuelConfig,
      stale: true
    };
  }

  return getFuelConfigCache();
}

export function __setFuelConfigClientForTests(client: SuiClientLike | null) {
  clientOverride = client;
}

export function __setFuelConfigCacheForTests(cache: FuelConfigCache) {
  cachedFuelConfig = structuredClone(cache);
}

export function __resetFuelConfigRuntimeForTests() {
  clientOverride = null;
  cachedFuelConfig = createEmptyFuelConfigCache();
  lastRefreshStartedAt = 0;
}
