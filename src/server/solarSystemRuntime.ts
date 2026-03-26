import { listNodes } from "./nodeRuntime.ts";
import {
  readPersistedSolarSystems,
  updateProjectionRuntimeMeta,
  writePersistedSolarSystems
} from "./runtimeProjectionStore.ts";
import type { NetworkNode } from "../types/node.ts";
import type {
  PlotPoint3D,
  SolarSystem,
  SolarSystemDetail,
  SolarSystemFilters,
  SolarSystemGateLink,
  SolarSystemMapLevel,
  SolarSystemMapPoint,
  SolarSystemStats
} from "../types/solarSystem.ts";
import type { NodeLocationQuality } from "../types/nodeMap.ts";

type SolarSystemSnapshot = {
  systems: SolarSystem[];
  stats: SolarSystemStats;
  lastSyncAt: string;
};

type SolarSystemApiRecord = {
  constellationId?: number;
  id?: number;
  location?: {
    x?: string | number;
    y?: string | number;
    z?: string | number;
  };
  name?: string;
  regionId?: number;
};

type SolarSystemDetailApiRecord = SolarSystemApiRecord & {
  gateLinks?: Array<{
    id?: number;
    name?: string;
    location?: {
      x?: string | number;
      y?: string | number;
      z?: string | number;
    };
    destination?: SolarSystemApiRecord;
  }>;
};

type SolarSystemApiPage = {
  data?: SolarSystemApiRecord[];
  metadata?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
};

type RuntimeOptions = {
  forceRefresh?: boolean;
};

type SolarSystemMapOptions = {
  level?: SolarSystemMapLevel;
  regionId?: number;
  constellationId?: number;
  limit?: number;
  cursor?: string | null;
};

type RawMapPoint = Omit<SolarSystemMapPoint, "point"> & {
  point: PlotPoint3D;
};

type AggregatedNodeStats = {
  activeMatchCount: number;
  criticalCount: number;
  nodeCount: number;
  safeCount: number;
  warningCount: number;
};

type ConstellationSummary = {
  constellationId: number;
  constellationName: string;
  regionId: number;
  systemCount: number;
  selectableSystemCount: number;
  urgentNodeCount: number;
  warningNodeCount: number;
  sortScore: number;
};

type SolarSystemRecommendation = {
  system: SolarSystem & {
    nodeCount: number;
    urgentNodeCount: number;
    warningNodeCount: number;
    selectableState: "selectable" | "no_nodes" | "offline_only" | "not_public";
  };
  topUrgency: "critical" | "warning" | "safe";
  summary: string;
};

const DEFAULT_WORLD_API_BASE_URL = "https://world-api-utopia.uat.pub.evefrontier.com";
const DEFAULT_PAGE_SIZE = 500;
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;
const MAP_POINT_SCALE = 42;

let cachedSnapshot: SolarSystemSnapshot | null = null;

function readNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function readString(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
}

function normalizeCoordinateJson(payload: string) {
  return payload.replace(/"([xyz])"\s*:\s*(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, '"$1":"$2"');
}

async function readJsonPreservingCoordinates<T>(response: Response): Promise<T> {
  const text = await response.text();
  return JSON.parse(normalizeCoordinateJson(text)) as T;
}

function resolveWorldApiBaseUrl() {
  return (
    process.env.EVE_FRONTIER_WORLD_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_EVE_FRONTIER_WORLD_API_BASE_URL?.trim() ||
    DEFAULT_WORLD_API_BASE_URL
  ).replace(/\/+$/, "");
}

function resolveWorldApiPageSize() {
  const raw = Number(process.env.EVE_FRONTIER_WORLD_API_PAGE_SIZE ?? DEFAULT_PAGE_SIZE);
  if (Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }

  return DEFAULT_PAGE_SIZE;
}

function resolveWorldApiCacheTtlMs() {
  const raw = Number(process.env.EVE_FRONTIER_WORLD_API_CACHE_TTL_MS ?? DEFAULT_CACHE_TTL_MS);
  if (Number.isFinite(raw) && raw >= 0) {
    return Math.floor(raw);
  }

  return DEFAULT_CACHE_TTL_MS;
}

function mapSolarSystem(record: SolarSystemApiRecord, fetchedAt: string): SolarSystem {
  const systemId = readNumber(record.id);

  return {
    systemId,
    systemName: readString(record.name, `System ${systemId}`),
    constellationId: readNumber(record.constellationId),
    regionId: readNumber(record.regionId),
    location: {
      x: readString(record.location?.x, "0"),
      y: readString(record.location?.y, "0"),
      z: readString(record.location?.z, "0")
    },
    updatedAt: fetchedAt
  };
}

function mapSolarSystemGateLink(record: NonNullable<SolarSystemDetailApiRecord["gateLinks"]>[number]): SolarSystemGateLink {
  return {
    id: readNumber(record.id),
    name: readString(record.name),
    location: {
      x: readString(record.location?.x, "0"),
      y: readString(record.location?.y, "0"),
      z: readString(record.location?.z, "0")
    },
    destination: {
      systemId: readNumber(record.destination?.id),
      systemName: readString(record.destination?.name, `System ${readNumber(record.destination?.id)}`),
      constellationId: readNumber(record.destination?.constellationId),
      regionId: readNumber(record.destination?.regionId),
      location: {
        x: readString(record.destination?.location?.x, "0"),
        y: readString(record.destination?.location?.y, "0"),
        z: readString(record.destination?.location?.z, "0")
      }
    }
  };
}

function mapSolarSystemDetail(record: SolarSystemDetailApiRecord, fetchedAt: string): SolarSystemDetail {
  return {
    ...mapSolarSystem(record, fetchedAt),
    gateLinks: Array.isArray(record.gateLinks) ? record.gateLinks.map(mapSolarSystemGateLink) : []
  };
}

async function fetchSolarSystemPage(limit: number, offset: number): Promise<SolarSystemApiPage> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset)
  });

  const response = await fetch(`${resolveWorldApiBaseUrl()}/v2/solarsystems?${params.toString()}`, {
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`WORLD_API_SOLAR_SYSTEMS_FAILED_${response.status}`);
  }

  return readJsonPreservingCoordinates<SolarSystemApiPage>(response);
}

async function fetchSolarSystemDetailFromWorldApi(systemId: number): Promise<SolarSystemDetail> {
  const response = await fetch(`${resolveWorldApiBaseUrl()}/v2/solarsystems/${systemId}?format=json`, {
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (response.status === 404) {
    throw new Error("WORLD_API_SOLAR_SYSTEM_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error(`WORLD_API_SOLAR_SYSTEM_DETAIL_FAILED_${response.status}`);
  }

  const body = await readJsonPreservingCoordinates<SolarSystemDetailApiRecord>(response);
  return mapSolarSystemDetail(body, new Date().toISOString());
}

async function fetchAllSolarSystemsFromWorldApi(): Promise<SolarSystemSnapshot> {
  const fetchedAt = new Date().toISOString();
  const pageSize = resolveWorldApiPageSize();
  const systems: SolarSystem[] = [];
  let offset = 0;
  let total = 0;

  while (true) {
    const page = await fetchSolarSystemPage(pageSize, offset);
    const records = Array.isArray(page.data) ? page.data : [];
    const pageSystems = records.map((record) => mapSolarSystem(record, fetchedAt));
    systems.push(...pageSystems);

    const metadataTotal = readNumber(page.metadata?.total, systems.length);
    total = Math.max(total, metadataTotal);

    if (records.length < pageSize || systems.length >= metadataTotal) {
      break;
    }

    offset += records.length;
  }

  systems.sort((a, b) => {
    if (a.systemName !== b.systemName) {
      return a.systemName.localeCompare(b.systemName);
    }
    return a.systemId - b.systemId;
  });

  return {
    systems,
    stats: {
      totalSystems: total || systems.length,
      returnedSystems: systems.length,
      pageSize,
      offset: 0
    },
    lastSyncAt: fetchedAt
  };
}

function isSnapshotFresh(snapshot: SolarSystemSnapshot | null) {
  if (!snapshot) {
    return false;
  }

  const ageMs = Date.now() - new Date(snapshot.lastSyncAt).getTime();
  return ageMs <= resolveWorldApiCacheTtlMs();
}

function buildPersistedSnapshot(systems: SolarSystem[]): SolarSystemSnapshot {
  return {
    systems,
    stats: {
      totalSystems: systems.length,
      returnedSystems: systems.length,
      pageSize: systems.length,
      offset: 0
    },
    lastSyncAt: systems[0]?.updatedAt ?? new Date(0).toISOString()
  };
}

async function getSolarSystemSnapshot(options: RuntimeOptions = {}) {
  if (!options.forceRefresh && isSnapshotFresh(cachedSnapshot)) {
    return cachedSnapshot as SolarSystemSnapshot;
  }

  if (!options.forceRefresh) {
    const persistedSystems = readPersistedSolarSystems();
    if (persistedSystems.length > 0) {
      const persistedSnapshot = buildPersistedSnapshot(persistedSystems);
      cachedSnapshot = persistedSnapshot;
      updateProjectionRuntimeMeta("solarSystems", {
        lastSyncAt: persistedSnapshot.lastSyncAt,
        stale: !isSnapshotFresh(persistedSnapshot),
        reason: null
      });
      return persistedSnapshot;
    }
  }

  try {
    const snapshot = await fetchAllSolarSystemsFromWorldApi();
    cachedSnapshot = snapshot;
    writePersistedSolarSystems(snapshot.systems);
    updateProjectionRuntimeMeta("solarSystems", {
      lastSyncAt: snapshot.lastSyncAt,
      stale: false,
      reason: null
    });
    return snapshot;
  } catch (error) {
    const persistedSystems = readPersistedSolarSystems();
    if (persistedSystems.length > 0) {
      const fallbackSnapshot = buildPersistedSnapshot(persistedSystems);

      cachedSnapshot = fallbackSnapshot;
      updateProjectionRuntimeMeta("solarSystems", {
        lastSyncAt: fallbackSnapshot.lastSyncAt,
        stale: true,
        reason: error instanceof Error ? error.message : "WORLD_API_FALLBACK"
      });
      return fallbackSnapshot;
    }

    throw error;
  }
}

function isNodeLocated(node: NetworkNode) {
  return node.coordX !== 0 || node.coordY !== 0 || node.coordZ !== 0;
}

function buildLocationQuality(nodes: NetworkNode[]): NodeLocationQuality {
  const systems = new Set<number>();
  let locatedNodes = 0;

  for (const node of nodes) {
    if (!isNodeLocated(node)) {
      continue;
    }
    locatedNodes += 1;
    if (node.solarSystem > 0) {
      systems.add(node.solarSystem);
    }
  }

  return {
    totalNodes: nodes.length,
    locatedNodes,
    unlocatedNodes: nodes.length - locatedNodes,
    locatedSystems: systems.size
  };
}

function aggregateNodeStats(nodes: NetworkNode[]) {
  const bySystem = new Map<number, AggregatedNodeStats>();

  for (const node of nodes) {
    const systemId = node.solarSystem;
    if (systemId <= 0) {
      continue;
    }

    const current = bySystem.get(systemId) ?? {
      activeMatchCount: 0,
      criticalCount: 0,
      nodeCount: 0,
      safeCount: 0,
      warningCount: 0
    };

    current.nodeCount += 1;
    if (node.activeMatchId) {
      current.activeMatchCount += 1;
    }

    if (node.urgency === "critical") {
      current.criticalCount += 1;
    } else if (node.urgency === "warning") {
      current.warningCount += 1;
    } else {
      current.safeCount += 1;
    }

    bySystem.set(systemId, current);
  }

  return bySystem;
}

function constellationName(constellationId: number) {
  return `Constellation ${constellationId}`;
}

function deriveSelectableState(nodes: NetworkNode[]): "selectable" | "no_nodes" | "offline_only" | "not_public" {
  if (nodes.length === 0) {
    return "no_nodes";
  }
  if (nodes.some((node) => node.isOnline && node.isPublic)) {
    return "selectable";
  }
  if (nodes.some((node) => node.isPublic)) {
    return "offline_only";
  }
  return "not_public";
}

function getCoordinateNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toNormalizedPoints(points: RawMapPoint[]) {
  if (points.length === 0) {
    return points;
  }

  const xs = points.map((point) => point.point.x);
  const ys = points.map((point) => point.point.y);
  const zs = points.map((point) => point.point.z);

  const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;
  const centerZ = (Math.min(...zs) + Math.max(...zs)) / 2;
  const maxDelta = Math.max(
    1,
    ...points.map((point) =>
      Math.max(
        Math.abs(point.point.x - centerX),
        Math.abs(point.point.y - centerY),
        Math.abs(point.point.z - centerZ)
      )
    )
  );

  return points.map((point) => ({
    ...point,
    point: {
      x: Number((((point.point.x - centerX) / maxDelta) * MAP_POINT_SCALE).toFixed(4)),
      y: Number((((point.point.y - centerY) / maxDelta) * MAP_POINT_SCALE).toFixed(4)),
      z: Number((((point.point.z - centerZ) / maxDelta) * MAP_POINT_SCALE).toFixed(4))
    }
  }));
}

function paginateMapPoints<T>(entries: T[], limit?: number, cursor?: string | null) {
  const safeOffset = cursor ? Math.max(0, Math.floor(Number(cursor) || 0)) : 0;
  const safeLimit = typeof limit === "number" && limit > 0 ? Math.floor(limit) : entries.length;
  const paged = entries.slice(safeOffset, safeOffset + safeLimit);
  const nextCursor = safeOffset + safeLimit < entries.length ? String(safeOffset + safeLimit) : null;

  return {
    paged,
    nextCursor
  };
}

function sortMapPoints(points: RawMapPoint[]) {
  return [...points].sort((a, b) => {
    if (b.nodeCount !== a.nodeCount) {
      return b.nodeCount - a.nodeCount;
    }
    if (b.criticalCount !== a.criticalCount) {
      return b.criticalCount - a.criticalCount;
    }
    return a.label.localeCompare(b.label);
  });
}

function buildRegionMapPoints(systems: SolarSystem[], nodeStats: Map<number, AggregatedNodeStats>) {
  const groups = new Map<
    number,
    {
      constellations: Set<number>;
      stats: AggregatedNodeStats;
      systems: SolarSystem[];
    }
  >();

  for (const system of systems) {
    const stats = nodeStats.get(system.systemId);
    if (!stats) {
      continue;
    }

    const current = groups.get(system.regionId) ?? {
      constellations: new Set<number>(),
      stats: { activeMatchCount: 0, criticalCount: 0, nodeCount: 0, safeCount: 0, warningCount: 0 },
      systems: []
    };

    current.constellations.add(system.constellationId);
    current.systems.push(system);
    current.stats.activeMatchCount += stats.activeMatchCount;
    current.stats.criticalCount += stats.criticalCount;
    current.stats.warningCount += stats.warningCount;
    current.stats.safeCount += stats.safeCount;
    current.stats.nodeCount += stats.nodeCount;
    groups.set(system.regionId, current);
  }

  return sortMapPoints(
    [...groups.entries()].map(([regionId, group]) => {
      const anchor = group.systems[Math.floor(group.systems.length / 2)] ?? group.systems[0];

      return {
        id: regionId,
        kind: "region" as const,
        label: `Region ${regionId}`,
        regionId,
        constellationId: null,
        systemId: null,
        childCount: group.constellations.size,
        point: {
          x: getCoordinateNumber(anchor?.location.x ?? "0"),
          y: getCoordinateNumber(anchor?.location.y ?? "0"),
          z: getCoordinateNumber(anchor?.location.z ?? "0")
        },
        ...group.stats
      };
    })
  );
}

function buildConstellationMapPoints(
  systems: SolarSystem[],
  nodeStats: Map<number, AggregatedNodeStats>,
  regionId: number
) {
  const groups = new Map<
    number,
    {
      stats: AggregatedNodeStats;
      systems: SolarSystem[];
    }
  >();

  for (const system of systems) {
    if (system.regionId !== regionId) {
      continue;
    }

    const stats = nodeStats.get(system.systemId);
    if (!stats) {
      continue;
    }

    const current = groups.get(system.constellationId) ?? {
      stats: { activeMatchCount: 0, criticalCount: 0, nodeCount: 0, safeCount: 0, warningCount: 0 },
      systems: []
    };

    current.systems.push(system);
    current.stats.activeMatchCount += stats.activeMatchCount;
    current.stats.criticalCount += stats.criticalCount;
    current.stats.warningCount += stats.warningCount;
    current.stats.safeCount += stats.safeCount;
    current.stats.nodeCount += stats.nodeCount;
    groups.set(system.constellationId, current);
  }

  return sortMapPoints(
    [...groups.entries()].map(([constellationId, group]) => {
      const anchor = group.systems[Math.floor(group.systems.length / 2)] ?? group.systems[0];

      return {
        id: constellationId,
        kind: "constellation" as const,
        label: `Constellation ${constellationId}`,
        regionId,
        constellationId,
        systemId: null,
        childCount: group.systems.length,
        point: {
          x: getCoordinateNumber(anchor?.location.x ?? "0"),
          y: getCoordinateNumber(anchor?.location.y ?? "0"),
          z: getCoordinateNumber(anchor?.location.z ?? "0")
        },
        ...group.stats
      };
    })
  );
}

function buildSystemMapPoints(
  systems: SolarSystem[],
  nodeStats: Map<number, AggregatedNodeStats>,
  constellationId: number
) {
  const points: RawMapPoint[] = [];

  for (const system of systems) {
    if (system.constellationId !== constellationId) {
      continue;
    }

    const stats = nodeStats.get(system.systemId);
    if (!stats) {
      continue;
    }

    points.push({
      id: system.systemId,
      kind: "system",
      label: system.systemName,
      regionId: system.regionId,
      constellationId,
      systemId: system.systemId,
      childCount: 0,
      point: {
        x: getCoordinateNumber(system.location.x),
        y: getCoordinateNumber(system.location.y),
        z: getCoordinateNumber(system.location.z)
      },
      ...stats
    });
  }

  return sortMapPoints(points);
}

export async function syncSolarSystemsOnce(): Promise<SolarSystemSnapshot> {
  return getSolarSystemSnapshot({ forceRefresh: true });
}

export async function getSolarSystems(options: RuntimeOptions = {}): Promise<SolarSystem[]> {
  const snapshot = await getSolarSystemSnapshot(options);
  return snapshot.systems;
}

export async function getSolarSystemById(systemId: number, options: RuntimeOptions = {}): Promise<SolarSystem | null> {
  const systems = await getSolarSystems(options);
  return systems.find((system) => system.systemId === systemId) ?? null;
}

export async function getSolarSystemDetailById(
  systemId: number,
  options: RuntimeOptions = {}
): Promise<SolarSystemDetail | null> {
  if (!options.forceRefresh) {
    const cached = await getSolarSystemById(systemId, options);
    if (!cached) {
      return null;
    }
  }

  try {
    return await fetchSolarSystemDetailFromWorldApi(systemId);
  } catch (error) {
    if (error instanceof Error && error.message === "WORLD_API_SOLAR_SYSTEM_NOT_FOUND") {
      return null;
    }
    throw error;
  }
}

export async function querySolarSystems(
  filters: SolarSystemFilters = {},
  options: RuntimeOptions = {}
): Promise<SolarSystem[]> {
  let systems = await getSolarSystems(options);

  if (typeof filters.systemId === "number") {
    systems = systems.filter((system) => system.systemId === filters.systemId);
  }

  if (filters.namePattern) {
    const pattern = filters.namePattern.toLowerCase();
    systems = systems.filter((system) => system.systemName.toLowerCase().includes(pattern));
  }

  const offset = typeof filters.offset === "number" && filters.offset > 0 ? Math.floor(filters.offset) : 0;
  if (offset > 0) {
    systems = systems.slice(offset);
  }

  if (typeof filters.limit === "number" && filters.limit > 0) {
    systems = systems.slice(0, Math.floor(filters.limit));
  }

  return systems;
}

export async function getSolarSystemStats(options: RuntimeOptions = {}): Promise<SolarSystemStats> {
  const snapshot = await getSolarSystemSnapshot(options);
  return {
    totalSystems: snapshot.stats.totalSystems,
    returnedSystems: snapshot.systems.length,
    pageSize: snapshot.stats.pageSize,
    offset: 0
  };
}

export async function getSolarSystemMapPoints(
  options: SolarSystemMapOptions = {},
  runtimeOptions: RuntimeOptions = {}
): Promise<{
  level: SolarSystemMapLevel;
  points: SolarSystemMapPoint[];
  quality: NodeLocationQuality;
  nextCursor: string | null;
}> {
  const level = options.level ?? "region";
  const [systems, nodes] = await Promise.all([getSolarSystems(runtimeOptions), listNodes({}, runtimeOptions)]);
  const quality = buildLocationQuality(nodes);
  const nodeStats = aggregateNodeStats(nodes);

  let rawPoints: RawMapPoint[];
  if (level === "constellation") {
    if (typeof options.regionId !== "number") {
      throw new Error("SOLAR_SYSTEM_MAP_REGION_REQUIRED");
    }
    rawPoints = buildConstellationMapPoints(systems, nodeStats, options.regionId);
  } else if (level === "system") {
    if (typeof options.constellationId !== "number") {
      throw new Error("SOLAR_SYSTEM_MAP_CONSTELLATION_REQUIRED");
    }
    rawPoints = buildSystemMapPoints(systems, nodeStats, options.constellationId);
  } else {
    rawPoints = buildRegionMapPoints(systems, nodeStats);
  }

  const { paged, nextCursor } = paginateMapPoints(rawPoints, options.limit, options.cursor);

  return {
    level,
    points: toNormalizedPoints(paged),
    quality,
    nextCursor
  };
}

export async function listConstellations(options: RuntimeOptions = {}): Promise<ConstellationSummary[]> {
  const [systems, nodes] = await Promise.all([getSolarSystems(options), listNodes({}, options)]);
  const nodesBySystem = new Map<number, NetworkNode[]>();

  for (const node of nodes) {
    if (node.solarSystem <= 0) continue;
    const list = nodesBySystem.get(node.solarSystem) ?? [];
    list.push(node);
    nodesBySystem.set(node.solarSystem, list);
  }

  const grouped = new Map<number, ConstellationSummary>();
  for (const system of systems) {
    const systemNodes = nodesBySystem.get(system.systemId) ?? [];
    const selectableState = deriveSelectableState(systemNodes);
    const current = grouped.get(system.constellationId) ?? {
      constellationId: system.constellationId,
      constellationName: constellationName(system.constellationId),
      regionId: system.regionId,
      systemCount: 0,
      selectableSystemCount: 0,
      urgentNodeCount: 0,
      warningNodeCount: 0,
      sortScore: 0
    };
    current.systemCount += 1;
    if (selectableState === "selectable") current.selectableSystemCount += 1;
    current.urgentNodeCount += systemNodes.filter((node) => node.urgency === "critical").length;
    current.warningNodeCount += systemNodes.filter((node) => node.urgency === "warning").length;
    current.sortScore = current.urgentNodeCount * 3 + current.warningNodeCount * 2 + current.selectableSystemCount;
    grouped.set(system.constellationId, current);
  }

  return [...grouped.values()].sort((a, b) => b.sortScore - a.sortScore || a.constellationId - b.constellationId);
}

export async function getConstellationById(
  constellationId: number,
  options: RuntimeOptions = {}
): Promise<{
  constellation: ConstellationSummary;
  systems: Array<
    SolarSystem & {
      nodeCount: number;
      urgentNodeCount: number;
      warningNodeCount: number;
      selectableState: "selectable" | "no_nodes" | "offline_only" | "not_public";
    }
  >;
} | null> {
  const [systems, nodes] = await Promise.all([getSolarSystems(options), listNodes({}, options)]);
  const filteredSystems = systems.filter((system) => system.constellationId === constellationId);
  if (filteredSystems.length === 0) return null;

  const nodesBySystem = new Map<number, NetworkNode[]>();
  for (const node of nodes) {
    const list = nodesBySystem.get(node.solarSystem) ?? [];
    list.push(node);
    nodesBySystem.set(node.solarSystem, list);
  }

  const mappedSystems = filteredSystems.map((system) => {
    const systemNodes = nodesBySystem.get(system.systemId) ?? [];
    return {
      ...system,
      nodeCount: systemNodes.length,
      urgentNodeCount: systemNodes.filter((node) => node.urgency === "critical").length,
      warningNodeCount: systemNodes.filter((node) => node.urgency === "warning").length,
      selectableState: deriveSelectableState(systemNodes)
    };
  });

  const first = filteredSystems[0];
  const constellation: ConstellationSummary = {
    constellationId,
    constellationName: constellationName(constellationId),
    regionId: first?.regionId ?? 0,
    systemCount: mappedSystems.length,
    selectableSystemCount: mappedSystems.filter((system) => system.selectableState === "selectable").length,
    urgentNodeCount: mappedSystems.reduce((sum, system) => sum + system.urgentNodeCount, 0),
    warningNodeCount: mappedSystems.reduce((sum, system) => sum + system.warningNodeCount, 0),
    sortScore: 0
  };
  constellation.sortScore = constellation.urgentNodeCount * 3 + constellation.warningNodeCount * 2 + constellation.selectableSystemCount;

  return {
    constellation,
    systems: mappedSystems.sort((a, b) => b.urgentNodeCount - a.urgentNodeCount || a.systemName.localeCompare(b.systemName))
  };
}

export async function searchSolarSystemsAndConstellations(
  query: string,
  options: RuntimeOptions = {}
): Promise<Array<{ type: "constellation" | "system"; id: number; label: string; constellationId?: number; constellationName?: string; selectableState?: "selectable" | "no_nodes" | "offline_only" | "not_public" }>> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];
  const [systems, constellations, nodes] = await Promise.all([
    getSolarSystems(options),
    listConstellations(options),
    listNodes({}, options)
  ]);

  const nodesBySystem = new Map<number, NetworkNode[]>();
  for (const node of nodes) {
    const list = nodesBySystem.get(node.solarSystem) ?? [];
    list.push(node);
    nodesBySystem.set(node.solarSystem, list);
  }

  const systemHits = systems
    .filter((system) => system.systemName.toLowerCase().includes(trimmed) || String(system.systemId).includes(trimmed))
    .map((system) => ({
      type: "system" as const,
      id: system.systemId,
      label: `${system.systemName} (${system.systemId})`,
      constellationId: system.constellationId,
      constellationName: constellationName(system.constellationId),
      selectableState: deriveSelectableState(nodesBySystem.get(system.systemId) ?? [])
    }));

  const constellationHits = constellations
    .filter(
      (constellation) =>
        constellation.constellationName.toLowerCase().includes(trimmed) || String(constellation.constellationId).includes(trimmed)
    )
    .map((constellation) => ({
      type: "constellation" as const,
      id: constellation.constellationId,
      label: `${constellation.constellationName} (${constellation.constellationId})`,
      selectableState: undefined
    }));

  return [...constellationHits, ...systemHits].slice(0, 30);
}

export async function getSolarSystemRecommendations(
  options: RuntimeOptions = {}
): Promise<SolarSystemRecommendation[]> {
  const [systems, nodes] = await Promise.all([getSolarSystems(options), listNodes({}, options)]);
  const nodesBySystem = new Map<number, NetworkNode[]>();
  for (const node of nodes) {
    const list = nodesBySystem.get(node.solarSystem) ?? [];
    list.push(node);
    nodesBySystem.set(node.solarSystem, list);
  }

  const recommendations = systems.map((system) => {
    const systemNodes = nodesBySystem.get(system.systemId) ?? [];
    const urgentNodeCount = systemNodes.filter((node) => node.urgency === "critical").length;
    const warningNodeCount = systemNodes.filter((node) => node.urgency === "warning").length;
    const selectableState = deriveSelectableState(systemNodes);
    const topUrgency: "critical" | "warning" | "safe" = urgentNodeCount > 0 ? "critical" : warningNodeCount > 0 ? "warning" : "safe";
    return {
      system: {
        ...system,
        nodeCount: systemNodes.length,
        urgentNodeCount,
        warningNodeCount,
        selectableState
      },
      topUrgency,
      summary: `${system.systemName}: urgent=${urgentNodeCount}, warning=${warningNodeCount}, selectable=${selectableState}`
    };
  });

  return recommendations
    .sort((a, b) => {
      const aScore = a.system.urgentNodeCount * 3 + a.system.warningNodeCount * 2 + (a.system.selectableState === "selectable" ? 1 : 0);
      const bScore = b.system.urgentNodeCount * 3 + b.system.warningNodeCount * 2 + (b.system.selectableState === "selectable" ? 1 : 0);
      return bScore - aScore || a.system.systemName.localeCompare(b.system.systemName);
    })
    .slice(0, 20);
}

export function __resetSolarSystemRuntimeForTests() {
  cachedSnapshot = null;
}
