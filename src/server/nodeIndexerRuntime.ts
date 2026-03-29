import type { EventId, SuiEvent, SuiObjectResponse } from "@mysten/sui/jsonRpc";

import { getServerSuiClient } from "./suiClient.ts";
import {
  CURRENT_NODE_INDEX_VERSION,
  readNodeIndexSnapshot,
  writeNodeIndexSnapshot,
  type IndexedNodeSnapshot,
  type NodeIndexSnapshot
} from "./nodeIndexStore.ts";
import type { UrgencyLevel } from "../types/mission.ts";

// EVE Frontier Package ID (from env or default testnet package)
const EVE_FRONTIER_PACKAGE_ID =
  process.env.EVE_FRONTIER_PACKAGE_ID?.trim() ||
  "0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75";

const NETWORK_NODE_TYPE_SUFFIX = "::network_node::NetworkNode";
const NETWORK_NODE_CREATED_EVENT_SUFFIX = "::network_node::NetworkNodeCreatedEvent";
const LOCATION_REVEALED_EVENT_SUFFIX = "::location::LocationRevealedEvent";
const DEFAULT_BATCH_LIMIT = 50;
const DEFAULT_MAX_EVENT_PAGES = 0;

type ChainObjectJson = Record<string, unknown>;
export type NodeLocation = { x: number; y: number; z: number; solarSystem: number };

function resolveMaxEventPages() {
  const raw = Number(process.env.NODE_INDEXER_MAX_EVENT_PAGES ?? DEFAULT_MAX_EVENT_PAGES);
  if (Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }

  return Number.POSITIVE_INFINITY;
}

function formatEventCursor(cursor: EventId | null) {
  if (!cursor) {
    return "START";
  }

  return `${cursor.txDigest}:${cursor.eventSeq}`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function unwrapMoveOption(value: unknown): unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  const record = asRecord(value);
  if (!record) {
    return value;
  }

  if (Array.isArray(record.vec)) {
    return record.vec[0] ?? null;
  }

  if (Array.isArray(record.fields)) {
    return record.fields[0] ?? null;
  }

  if ("value" in record) {
    return record.value ?? null;
  }

  return value;
}

function readString(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  const record = asRecord(value);
  if (!record) {
    return null;
  }

  if (typeof record.id === "string") {
    return record.id;
  }

  if (typeof record.bytes === "string") {
    return record.bytes;
  }

  return null;
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function readNestedNumber(record: Record<string, unknown> | null, path: string[]) {
  let current: unknown = record;

  for (const part of path) {
    const nextRecord = asRecord(current);
    if (!nextRecord) {
      return null;
    }
    current = nextRecord[part];
  }

  return readNumber(current);
}

function readNestedString(record: Record<string, unknown> | null, path: string[]) {
  let current: unknown = record;

  for (const part of path) {
    const nextRecord = asRecord(current);
    if (!nextRecord) {
      return null;
    }
    current = nextRecord[part];
  }

  return readString(current);
}

function readFuelQuantity(json: ChainObjectJson) {
  const fuelRecord = asRecord(json.fuel);
  const fuelFields = fuelRecord ? asRecord(fuelRecord.fields) : null;
  if (!fuelFields) return 0;
  return readNumber(fuelFields.quantity) ?? 0;
}

function readFuelMaxCapacity(json: ChainObjectJson) {
  const fuelRecord = asRecord(json.fuel);
  const fuelFields = fuelRecord ? asRecord(fuelRecord.fields) : null;
  if (!fuelFields) return 0;
  return readNumber(fuelFields.max_capacity) ?? 0;
}

function readFuelTypeId(json: ChainObjectJson): number | null {
  const fuelRecord = asRecord(json.fuel);
  const fuelFields = fuelRecord ? asRecord(fuelRecord.fields) : null;
  if (!fuelFields) return null;
  return readNumber(fuelFields.type_id);
}

function readFuelBurnRate(json: ChainObjectJson) {
  const fuelRecord = asRecord(json.fuel);
  const fuelFields = fuelRecord ? asRecord(fuelRecord.fields) : null;
  if (!fuelFields) return 0;
  return readNumber(fuelFields.burn_rate_in_ms) ?? 0;
}

function readIsBurning(json: ChainObjectJson): boolean {
  const fuelRecord = asRecord(json.fuel);
  const fuelFields = fuelRecord ? asRecord(fuelRecord.fields) : null;
  if (!fuelFields) return false;
  return Boolean(fuelFields.is_burning);
}

function readMaxEnergyProduction(json: ChainObjectJson) {
  const energyRecord = asRecord(json.energy_source);
  const energyFields = energyRecord ? asRecord(energyRecord.fields) : null;
  if (!energyFields) return 0;
  return readNumber(energyFields.max_energy_production) ?? 0;
}

function readCurrentEnergyProduction(json: ChainObjectJson) {
  const energyRecord = asRecord(json.energy_source);
  const energyFields = energyRecord ? asRecord(energyRecord.fields) : null;
  if (!energyFields) return 0;
  return readNumber(energyFields.current_energy_production) ?? 0;
}

function readIsOnline(json: ChainObjectJson): boolean {
  const statusRecord = asRecord(json.status);
  const statusFields = statusRecord ? asRecord(statusRecord.fields) : null;
  if (!statusFields) return false;

  const statusInner = asRecord(statusFields.status);
  if (!statusInner) return false;

  // ONLINE = 在线, OFFLINE = 离线
  const variant = statusInner.variant;
  return variant === "ONLINE";
}

function readTypeId(json: ChainObjectJson): number {
  return readNestedNumber(json, ["type_id"]) ?? 0;
}

function readOwnerCapId(json: ChainObjectJson): string | null {
  return readNestedString(json, ["owner_cap_id", "id"]) ?? readNestedString(json, ["owner_cap_id"]) ?? null;
}

function readConnectedAssemblyIds(json: ChainObjectJson): string[] {
  const ids = json.connected_assembly_ids;
  if (!Array.isArray(ids)) {
    return [];
  }

  return ids
    .map(id => readString(id))
    .filter((id): id is string => typeof id === "string");
}

function readMetadataName(json: ChainObjectJson, fallbackName: string) {
  const metadata = asRecord(unwrapMoveOption(json.metadata)) ?? asRecord(json.metadata) ?? null;
  return readNestedString(metadata, ["name"]) ?? fallbackName;
}

function readMetadataDescription(json: ChainObjectJson): string | null {
  const metadata = asRecord(unwrapMoveOption(json.metadata)) ?? asRecord(json.metadata) ?? null;
  return readNestedString(metadata, ["description"]) ?? null;
}

function readMetadataUrl(json: ChainObjectJson): string | null {
  const metadata = asRecord(unwrapMoveOption(json.metadata)) ?? asRecord(json.metadata) ?? null;
  return readNestedString(metadata, ["url"]) ?? null;
}

function readOwnerAddress(owner: unknown) {
  const record = asRecord(owner);
  if (!record) {
    return "shared";
  }

  if (typeof record.AddressOwner === "string") {
    return record.AddressOwner;
  }

  if (typeof record.ObjectOwner === "string") {
    return record.ObjectOwner;
  }

  const consensus = asRecord(record.ConsensusAddressOwner);
  if (consensus && typeof consensus.owner === "string") {
    return consensus.owner;
  }

  if ("Shared" in record) {
    return "shared";
  }

  return "unknown";
}

function readIsSharedOwner(owner: unknown) {
  const record = asRecord(owner);
  return Boolean(record && "Shared" in record);
}

function clampFillRatio(fuelQuantity: number, fuelMaxCapacity: number) {
  if (fuelMaxCapacity <= 0) {
    return 0;
  }

  return Number(Math.max(0, Math.min(1, fuelQuantity / fuelMaxCapacity)).toFixed(4));
}

function deriveUrgency(fillRatio: number): UrgencyLevel {
  if (fillRatio < 0.2) {
    return "critical";
  }

  if (fillRatio < 0.5) {
    return "warning";
  }

  return "safe";
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function hasResolvedSolarSystem(location?: NodeLocation | null) {
  return Boolean(location && location.solarSystem > 0);
}

export function shouldReplayFullLocationHistory(snapshot: NodeIndexSnapshot) {
  return snapshot.version < CURRENT_NODE_INDEX_VERSION;
}

export function resolveNodeLocationForHydration(
  location: NodeLocation | undefined,
  connectedAssemblyIds: string[],
  locations: Map<string, NodeLocation>
) {
  if (hasResolvedSolarSystem(location)) {
    return location;
  }

  for (const assemblyId of connectedAssemblyIds) {
    const candidate = locations.get(assemblyId);
    if (hasResolvedSolarSystem(candidate)) {
      return candidate;
    }
  }

  return location;
}

function parseNodeObject(
  response: SuiObjectResponse,
  location: NodeLocation | undefined,
  locations: Map<string, NodeLocation>
): IndexedNodeSnapshot | null {
  const data = response.data;
  const nodeType = data?.type;
  if (!nodeType) {
    return null;
  }

  // Check if type matches EVE Frontier NetworkNode (full match or suffix match for flexibility)
  const isNetworkNode =
    nodeType === `${EVE_FRONTIER_PACKAGE_ID}${NETWORK_NODE_TYPE_SUFFIX}` ||
    nodeType.endsWith(NETWORK_NODE_TYPE_SUFFIX);

  if (!isNetworkNode) {
    return null;
  }

  const fields = asRecord(data.content && "fields" in data.content ? data.content.fields : null);
  if (!fields) {
    return null;
  }

  const objectId = data.objectId;
  const fallbackName = `NetworkNode-${objectId.slice(-6)}`;

  // === 读取燃料数据 ===
  const fuelQuantity = readFuelQuantity(fields);
  const fuelMaxCapacity = readFuelMaxCapacity(fields);
  const fuelTypeId = readFuelTypeId(fields);
  const fuelBurnRate = readFuelBurnRate(fields);
  const isBurning = readIsBurning(fields);
  const fillRatio = clampFillRatio(fuelQuantity, fuelMaxCapacity);

  // === 读取能量数据 ===
  const maxEnergyProduction = readMaxEnergyProduction(fields);
  const currentEnergyProduction = readCurrentEnergyProduction(fields);

  // === 读取状态与配置 ===
  const isOnline = readIsOnline(fields);
  const typeId = readTypeId(fields);
  const ownerCapId = readOwnerCapId(fields);
  const connectedAssemblyIds = readConnectedAssemblyIds(fields);
  const resolvedLocation = resolveNodeLocationForHydration(location, connectedAssemblyIds, locations);

  // === 读取元数据 ===
  const name = data.display?.data?.name ?? readMetadataName(fields, fallbackName);
  const description = readMetadataDescription(fields);
  const imageUrl = readMetadataUrl(fields);

  return {
    // === 基础标识 ===
    id: objectId,
    objectId,
    name,
    typeId,

    // === 所有权信息 ===
    ownerAddress: readOwnerAddress(data.owner),
    ownerCapId,
    isPublic: readIsSharedOwner(data.owner),

    // === 位置信息 ===
    coordX: resolvedLocation?.x ?? 0,
    coordY: resolvedLocation?.y ?? 0,
    coordZ: resolvedLocation?.z ?? 0,
    solarSystem: resolvedLocation?.solarSystem ?? 0,

    // === 燃料数据 ===
    fuelQuantity,
    fuelMaxCapacity,
    fuelTypeId,
    fuelBurnRate,
    isBurning,
    fillRatio,
    urgency: deriveUrgency(fillRatio),

    // === 能量数据 ===
    maxEnergyProduction,
    currentEnergyProduction,

    // === 状态信息 ===
    isOnline,
    connectedAssemblyIds,

    // === 元数据 ===
    description,
    imageUrl,

    // === 时间戳 ===
    lastUpdatedOnChain: new Date().toISOString(), // TODO: 从链上版本或事件推导
    updatedAt: new Date().toISOString()
  };
}

function mergeEventPage(snapshot: NodeIndexSnapshot, events: SuiEvent[]) {
  const knownNodeIds = new Set(snapshot.nodes.map((node) => node.objectId));
  const locations = new Map(
    snapshot.nodes.map((node) => [
      node.objectId,
      { x: node.coordX, y: node.coordY, z: node.coordZ, solarSystem: node.solarSystem }
    ])
  );
  let hasDiscoveryChange = false;

  for (const event of events) {
    const parsed = asRecord(event.parsedJson);
    if (!parsed) {
      continue;
    }

    if (event.type.endsWith(NETWORK_NODE_CREATED_EVENT_SUFFIX)) {
      const objectId = readString(parsed.network_node_id);
      if (objectId && !knownNodeIds.has(objectId)) {
        knownNodeIds.add(objectId);
        hasDiscoveryChange = true;
      }
      continue;
    }

    if (event.type.endsWith(LOCATION_REVEALED_EVENT_SUFFIX)) {
      const assemblyId = readString(parsed.assembly_id);
      if (!assemblyId) {
        continue;
      }

      const currentLocation = locations.get(assemblyId);
      const nextLocation: NodeLocation = {
        x: readNumber(parsed.x) ?? currentLocation?.x ?? 0,
        y: readNumber(parsed.y) ?? currentLocation?.y ?? 0,
        z: readNumber(parsed.z) ?? currentLocation?.z ?? 0,
        solarSystem:
          readNumber(parsed.solarsystem) ??
          readNumber(parsed.solar_system) ??
          readNumber(parsed.solarSystem) ??
          currentLocation?.solarSystem ??
          0
      };
      locations.set(assemblyId, nextLocation);
      hasDiscoveryChange = true;
    }
  }

  return {
    knownNodeIds: [...knownNodeIds],
    locations,
    hasDiscoveryChange
  };
}

type EventQueryResult = {
  events: SuiEvent[];
  cursor: EventId | null;
};

async function fetchEventPages(
  moveEventType: string,
  label: string,
  initialCursor: EventId | null
): Promise<EventQueryResult> {
  const client = getServerSuiClient();
  const events: SuiEvent[] = [];
  const maxEventPages = resolveMaxEventPages();

  console.log(`[nodeIndexer] Querying ${label} from cursor ${formatEventCursor(initialCursor)}`);
  let hasMore = true;
  let cursor: EventId | null = initialCursor;
  let pageCount = 0;
  const seenCursors = new Set<string>();
  let latestCursor = initialCursor;

  while (hasMore) {
    const cursorKey = formatEventCursor(cursor);
    if (seenCursors.has(cursorKey)) {
      console.warn(`[nodeIndexer] Duplicate cursor detected for ${label}: ${cursorKey}. Stop paging.`);
      break;
    }
    seenCursors.add(cursorKey);

    const page = await client.queryEvents({
      query: {
        MoveEventType: moveEventType
      },
      cursor: cursor ?? undefined,
      order: "ascending",
      limit: DEFAULT_BATCH_LIMIT
    });

    console.log(`[nodeIndexer] ${label} page ${pageCount + 1}: ${page.data.length} events`);
    events.push(...page.data);
    pageCount++;

    const nextCursor = page.nextCursor ?? null;
    if (page.data.length > 0) {
      latestCursor = page.data[page.data.length - 1]?.id ?? latestCursor;
    }
    hasMore = page.hasNextPage && nextCursor != null;

    if (!hasMore) {
      break;
    }

    if (pageCount >= maxEventPages) {
      console.warn(`[nodeIndexer] Reached ${label} page ceiling (${pageCount}). Stop paging.`);
      break;
    }

    if (nextCursor && formatEventCursor(nextCursor) === cursorKey) {
      console.warn(`[nodeIndexer] Non-advancing cursor detected for ${label}: ${cursorKey}. Stop paging.`);
      break;
    }

    cursor = nextCursor;
  }

  return {
    events,
    cursor: latestCursor
  };
}

async function hydrateIndexedNodes(objectIds: string[], locations: Map<string, NodeLocation>) {
  if (objectIds.length === 0) {
    return [];
  }

  const client = getServerSuiClient();
  const nodes: IndexedNodeSnapshot[] = [];

  for (const batch of chunk(objectIds, DEFAULT_BATCH_LIMIT)) {
    const responses = await client.multiGetObjects({
      ids: batch,
      options: {
        showContent: true,
        showDisplay: true,
        showOwner: true,
        showType: true
      }
    });

    for (const response of responses) {
      const objectId = response.data?.objectId;
      const node = parseNodeObject(response, objectId ? locations.get(objectId) : undefined, locations);
      if (node) {
        nodes.push(node);
      }
    }
  }

  return nodes;
}

function normalizeCursor(cursor: EventId | null): EventId | null {
  if (!cursor) {
    return null;
  }

  return {
    eventSeq: cursor.eventSeq,
    txDigest: cursor.txDigest
  };
}

export async function syncNodeIndexOnce() {
  const snapshot = await readNodeIndexSnapshot();
  const replayFullLocationHistory = shouldReplayFullLocationHistory(snapshot);

  const [discoveryResult, locationResult] = await Promise.all([
    fetchEventPages(
      `${EVE_FRONTIER_PACKAGE_ID}::network_node::NetworkNodeCreatedEvent`,
      "NetworkNodeCreatedEvent",
      snapshot.discoveryCursor
    ),
    fetchEventPages(
      `${EVE_FRONTIER_PACKAGE_ID}::location::LocationRevealedEvent`,
      "LocationRevealedEvent",
      replayFullLocationHistory ? null : snapshot.locationCursor
    )
  ]);

  const merged = mergeEventPage(snapshot, [...discoveryResult.events, ...locationResult.events]);

  const nextSnapshot: NodeIndexSnapshot = {
    version: CURRENT_NODE_INDEX_VERSION,
    lastSyncAt: new Date().toISOString(),
    discoveryCursor: discoveryResult.cursor,
    locationCursor: locationResult.cursor,
    nodes: await hydrateIndexedNodes(merged.knownNodeIds, merged.locations)
  };

  await writeNodeIndexSnapshot(nextSnapshot);
  return nextSnapshot;
}

export async function readIndexedNodes() {
  const snapshot = await readNodeIndexSnapshot();
  if (snapshot.nodes.length > 0 && !shouldReplayFullLocationHistory(snapshot)) {
    return snapshot;
  }

  return syncNodeIndexOnce();
}

export async function bootstrapNodeIndex() {
  const snapshot = await readNodeIndexSnapshot();
  if (snapshot.lastSyncAt && !shouldReplayFullLocationHistory(snapshot)) {
    return snapshot;
  }

  return syncNodeIndexOnce();
}

export function createNodeIndexerIntervalMs() {
  const raw = Number(process.env.NODE_INDEXER_INTERVAL_MS ?? 5000);
  if (Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }

  return 5000;
}
