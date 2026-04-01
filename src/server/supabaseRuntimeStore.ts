/**
 * Supabase-backed runtime projection store.
 * Replaces file-based runtimeProjectionStore for production deployment.
 *
 * This module provides the same API as runtimeProjectionStore but uses Supabase
 * as the storage backend, enabling state sharing between Vercel (Web) and Railway (Workers).
 */

import {
  isSupabaseConfigured,
  supabaseDelete,
  supabaseSelect,
  supabaseSelectOne,
  supabaseUpsert
} from "./supabaseClient.ts";
import type { FuelGrade } from "../types/fuelGrade.ts";
import type { Match } from "../types/match.ts";
import type { NetworkNode } from "../types/node.ts";
import type { PlanningTeam, PlanningTeamApplication } from "../types/planningTeam.ts";
import type { SolarSystem } from "../types/solarSystem.ts";
import type { PlayerRole, Team, TeamApplication, TeamMember } from "../types/team.ts";
import type { SettlementBill, SettlementStatus } from "../types/settlement.ts";

// Re-export types from runtimeProjectionStore for compatibility
export type {
  ConstellationProjectionSummary,
  PersistedTeam,
  PersistedMatchScore,
  PersistedFuelEvent,
  PersistedMatchTargetNode,
  PersistedMatchStreamEvent,
  PersistedTeamPayment,
  PersistedMatchWhitelist,
  PersistedSettlement,
  PersistedIdempotencyRecord,
  WorkerHealthRecord,
  ProjectionRuntimeMeta
} from "./runtimeProjectionStore.ts";

import type {
  ConstellationProjectionSummary,
  PersistedTeam,
  PersistedMatchScore,
  PersistedFuelEvent,
  PersistedMatchTargetNode,
  PersistedMatchStreamEvent,
  PersistedTeamPayment,
  PersistedMatchWhitelist,
  PersistedSettlement,
  PersistedIdempotencyRecord,
  WorkerHealthRecord,
  ProjectionRuntimeMeta
} from "./runtimeProjectionStore.ts";

// DB row types
type NetworkNodeRow = {
  object_id: string;
  solar_system_id: number | null;
  solar_system_name: string | null;
  name: string;
  node_type: string | null;
  fill_ratio: number;
  fuel_quantity: number;
  fuel_max_capacity: number;
  urgency: string;
  is_online: boolean;
  is_public: boolean;
  owner_address: string | null;
  location_x: number | null;
  location_y: number | null;
  location_z: number | null;
  connected_gate_id: string | null;
  runtime_payload: Omit<NetworkNode, "activeMatchId"> | null;
  updated_at: string;
};

type SolarSystemRow = {
  system_id: number;
  system_name: string;
  constellation_id: number | null;
  constellation_name: string | null;
  region_id: number | null;
  region_name: string | null;
  security_status: number | null;
  gate_links: unknown;
  node_count: number;
  online_node_count: number;
  urgent_node_count: number;
  is_selectable: boolean;
  selectability_reason: string | null;
  runtime_payload: SolarSystem | null;
  updated_at: string;
};

type ConstellationRow = {
  constellation_id: number;
  constellation_name: string;
  region_id: number | null;
  system_count: number;
  selectable_system_count: number;
  urgent_node_count: number;
  warning_node_count: number;
  sort_score: number;
  runtime_payload: ConstellationProjectionSummary | null;
  updated_at: string;
};

type WorkerHealthRow = {
  worker: string;
  status: string;
  heartbeat_at: string;
  pid: number | null;
  restart_count: number;
  detail: string | null;
  last_error: string | null;
};

type RuntimeMetaRow = {
  key: string;
  last_sync_at: string | null;
  stale: boolean;
  reason: string | null;
  extra: unknown;
  updated_at: string;
};

type MatchScoreRow = {
  id: string;
  match_id: string;
  team_id: string;
  wallet_address: string;
  total_score: number;
  fuel_deposited: number;
  event_count: number;
  runtime_payload: PersistedMatchScore | null;
  updated_at: string;
};

type FuelEventRow = {
  id: string;
  match_id: string;
  event_id: string;
  tx_digest: string;
  sender_wallet: string;
  team_id: string | null;
  assembly_id: string;
  fuel_added: number;
  fuel_type_id: number;
  fuel_grade: string;
  fuel_grade_bonus: number;
  urgency_weight: number;
  panic_multiplier: number;
  score_delta: number;
  chain_ts: number;
  runtime_payload: PersistedFuelEvent | null;
  created_at: string;
};

type MatchStreamEventRow = {
  id: string;
  match_id: string;
  event_type: string;
  payload: unknown;
  created_at: string;
};

type IdempotencyKeyRow = {
  id: string;
  scope: string;
  key: string;
  request_hash: string;
  status: number;
  body: unknown;
  headers: Record<string, string>;
  created_at: string;
};

// Conversion functions
function nodeRowToModel(row: NetworkNodeRow): Omit<NetworkNode, "activeMatchId"> {
  if (row.runtime_payload) {
    return row.runtime_payload;
  }

  // Build a minimal NetworkNode from DB row
  // Most fields come from runtime_payload, this is just fallback
  return {
    id: row.object_id,
    objectId: row.object_id,
    name: row.name,
    typeId: 0,
    ownerAddress: row.owner_address ?? "",
    ownerCapId: null,
    isPublic: row.is_public,
    coordX: row.location_x ?? 0,
    coordY: row.location_y ?? 0,
    coordZ: row.location_z ?? 0,
    solarSystem: row.solar_system_id ?? 0,
    fuelQuantity: row.fuel_quantity,
    fuelMaxCapacity: row.fuel_max_capacity,
    fuelTypeId: null,
    fuelBurnRate: 0,
    isBurning: false,
    fillRatio: row.fill_ratio,
    urgency: row.urgency as NetworkNode["urgency"],
    maxEnergyProduction: 0,
    currentEnergyProduction: 0,
    isOnline: row.is_online,
    connectedAssemblyIds: row.connected_gate_id ? [row.connected_gate_id] : [],
    description: null,
    imageUrl: null,
    lastUpdatedOnChain: row.updated_at,
    updatedAt: row.updated_at
  };
}

function nodeModelToRow(node: Omit<NetworkNode, "activeMatchId">): Record<string, unknown> {
  return {
    object_id: node.objectId,
    solar_system_id: node.solarSystem || null,
    solar_system_name: null,
    name: node.name,
    node_type: "unknown",
    fill_ratio: node.fillRatio,
    fuel_quantity: node.fuelQuantity,
    fuel_max_capacity: node.fuelMaxCapacity,
    urgency: node.urgency,
    is_online: node.isOnline,
    is_public: node.isPublic,
    owner_address: node.ownerAddress || null,
    location_x: node.coordX || null,
    location_y: node.coordY || null,
    location_z: node.coordZ || null,
    connected_gate_id: node.connectedAssemblyIds?.[0] ?? null,
    runtime_payload: node
  };
}

function solarSystemRowToModel(row: SolarSystemRow): SolarSystem {
  if (row.runtime_payload) {
    return row.runtime_payload;
  }

  return {
    systemId: row.system_id,
    systemName: row.system_name,
    constellationId: row.constellation_id ?? 0,
    regionId: row.region_id ?? 0,
    location: { x: "0", y: "0", z: "0" },
    updatedAt: row.updated_at
  };
}

function solarSystemModelToRow(system: SolarSystem): Record<string, unknown> {
  return {
    system_id: system.systemId,
    system_name: system.systemName,
    constellation_id: system.constellationId,
    constellation_name: null,
    region_id: system.regionId,
    region_name: null,
    security_status: null,
    gate_links: [],
    node_count: 0,
    online_node_count: 0,
    urgent_node_count: 0,
    is_selectable: false,
    selectability_reason: null,
    runtime_payload: system
  };
}

function constellationRowToModel(row: ConstellationRow): ConstellationProjectionSummary {
  if (row.runtime_payload) {
    return row.runtime_payload;
  }

  return {
    constellationId: row.constellation_id,
    constellationName: row.constellation_name,
    regionId: row.region_id ?? 0,
    systemCount: row.system_count,
    selectableSystemCount: row.selectable_system_count,
    urgentNodeCount: row.urgent_node_count,
    warningNodeCount: row.warning_node_count,
    sortScore: row.sort_score,
    updatedAt: row.updated_at
  };
}

function constellationModelToRow(summary: ConstellationProjectionSummary): Record<string, unknown> {
  return {
    constellation_id: summary.constellationId,
    constellation_name: summary.constellationName,
    region_id: summary.regionId,
    system_count: summary.systemCount,
    selectable_system_count: summary.selectableSystemCount,
    urgent_node_count: summary.urgentNodeCount,
    warning_node_count: summary.warningNodeCount,
    sort_score: summary.sortScore,
    runtime_payload: summary
  };
}

function workerHealthRowToModel(row: WorkerHealthRow): WorkerHealthRecord {
  return {
    worker: row.worker,
    status: row.status as WorkerHealthRecord["status"],
    heartbeatAt: row.heartbeat_at,
    pid: row.pid,
    restartCount: row.restart_count,
    detail: row.detail,
    lastError: row.last_error
  };
}

function workerHealthModelToRow(record: WorkerHealthRecord): Record<string, unknown> {
  return {
    worker: record.worker,
    status: record.status,
    heartbeat_at: record.heartbeatAt,
    pid: record.pid,
    restart_count: record.restartCount,
    detail: record.detail,
    last_error: record.lastError
  };
}

function matchScoreRowToModel(row: MatchScoreRow): PersistedMatchScore {
  if (row.runtime_payload) {
    return row.runtime_payload;
  }

  return {
    matchId: row.match_id,
    teamId: row.team_id,
    walletAddress: row.wallet_address,
    totalScore: row.total_score,
    fuelDeposited: row.fuel_deposited,
    updatedAt: row.updated_at
  };
}

function matchScoreModelToRow(score: PersistedMatchScore): Record<string, unknown> {
  return {
    match_id: score.matchId,
    team_id: score.teamId,
    wallet_address: score.walletAddress,
    total_score: score.totalScore,
    fuel_deposited: score.fuelDeposited,
    runtime_payload: score
  };
}

function fuelEventRowToModel(row: FuelEventRow): PersistedFuelEvent {
  if (row.runtime_payload) {
    return row.runtime_payload;
  }

  return {
    matchId: row.match_id,
    eventId: row.event_id,
    txDigest: row.tx_digest,
    senderWallet: row.sender_wallet,
    teamId: row.team_id ?? "",
    assemblyId: row.assembly_id,
    fuelAdded: row.fuel_added,
    fuelTypeId: row.fuel_type_id,
    fuelGrade: row.fuel_grade as FuelGrade,
    fuelGradeBonus: row.fuel_grade_bonus,
    urgencyWeight: row.urgency_weight,
    panicMultiplier: row.panic_multiplier,
    scoreDelta: row.score_delta,
    chainTs: row.chain_ts,
    createdAt: row.created_at
  };
}

function fuelEventModelToRow(event: PersistedFuelEvent): Record<string, unknown> {
  return {
    match_id: event.matchId,
    event_id: event.eventId,
    tx_digest: event.txDigest,
    sender_wallet: event.senderWallet,
    team_id: event.teamId || null,
    assembly_id: event.assemblyId,
    fuel_added: event.fuelAdded,
    fuel_type_id: event.fuelTypeId,
    fuel_grade: event.fuelGrade,
    fuel_grade_bonus: event.fuelGradeBonus,
    urgency_weight: event.urgencyWeight,
    panic_multiplier: event.panicMultiplier,
    score_delta: event.scoreDelta,
    chain_ts: event.chainTs,
    runtime_payload: event
  };
}

function streamEventRowToModel(row: MatchStreamEventRow): PersistedMatchStreamEvent {
  return {
    matchId: row.match_id,
    eventType: row.event_type,
    payload: row.payload,
    createdAt: row.created_at
  };
}

function streamEventModelToRow(event: PersistedMatchStreamEvent): Record<string, unknown> {
  return {
    match_id: event.matchId,
    event_type: event.eventType,
    payload: event.payload
  };
}

function idempotencyRowToModel(row: IdempotencyKeyRow): PersistedIdempotencyRecord {
  return {
    scope: row.scope,
    key: row.key,
    requestHash: row.request_hash,
    status: row.status,
    body: row.body,
    headers: row.headers,
    createdAt: row.created_at
  };
}

function idempotencyModelToRow(record: PersistedIdempotencyRecord): Record<string, unknown> {
  return {
    scope: record.scope,
    key: record.key,
    request_hash: record.requestHash,
    status: record.status,
    body: record.body,
    headers: record.headers
  };
}

// Public API - Network Nodes
export async function readNetworkNodesFromSupabase(): Promise<Array<Omit<NetworkNode, "activeMatchId">>> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const rows = await supabaseSelect<NetworkNodeRow>("network_nodes", {
    select: "*",
    order: "urgency.desc,fill_ratio.asc"
  });

  return rows.map(nodeRowToModel);
}

export async function writeNetworkNodesToSupabase(nodes: Array<Omit<NetworkNode, "activeMatchId">>): Promise<void> {
  if (!isSupabaseConfigured() || nodes.length === 0) {
    return;
  }

  await supabaseUpsert("network_nodes", nodes.map(nodeModelToRow), {
    onConflict: "object_id",
    returning: "minimal"
  });
}

// Public API - Solar Systems
export async function readSolarSystemsFromSupabase(): Promise<SolarSystem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const rows = await supabaseSelect<SolarSystemRow>("solar_systems_cache", {
    select: "*",
    order: "system_name.asc"
  });

  return rows.map(solarSystemRowToModel);
}

export async function writeSolarSystemsToSupabase(systems: SolarSystem[]): Promise<void> {
  if (!isSupabaseConfigured() || systems.length === 0) {
    return;
  }

  await supabaseUpsert("solar_systems_cache", systems.map(solarSystemModelToRow), {
    onConflict: "system_id",
    returning: "minimal"
  });
}

// Public API - Constellations
export async function readConstellationsFromSupabase(): Promise<ConstellationProjectionSummary[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const rows = await supabaseSelect<ConstellationRow>("constellation_summaries", {
    select: "*",
    order: "sort_score.desc"
  });

  return rows.map(constellationRowToModel);
}

export async function writeConstellationsToSupabase(summaries: ConstellationProjectionSummary[]): Promise<void> {
  if (!isSupabaseConfigured() || summaries.length === 0) {
    return;
  }

  await supabaseUpsert("constellation_summaries", summaries.map(constellationModelToRow), {
    onConflict: "constellation_id",
    returning: "minimal"
  });
}

// Public API - Worker Health
export async function readWorkerHealthFromSupabase(): Promise<WorkerHealthRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const rows = await supabaseSelect<WorkerHealthRow>("worker_health", {
    select: "*",
    order: "worker.asc"
  });

  return rows.map(workerHealthRowToModel);
}

export async function upsertWorkerHealthToSupabase(record: WorkerHealthRecord): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  await supabaseUpsert("worker_health", [workerHealthModelToRow(record)], {
    onConflict: "worker",
    returning: "minimal"
  });
}

// Public API - Runtime Meta
export async function readRuntimeMetaFromSupabase(): Promise<ProjectionRuntimeMeta> {
  const defaultMeta: ProjectionRuntimeMeta = {
    nodes: { lastSyncAt: null, stale: false, reason: null },
    solarSystems: { lastSyncAt: null, stale: false, reason: null },
    constellations: { lastSyncAt: null, stale: false, reason: null }
  };

  if (!isSupabaseConfigured()) {
    return defaultMeta;
  }

  const rows = await supabaseSelect<RuntimeMetaRow>("runtime_meta", { select: "*" });

  for (const row of rows) {
    if (row.key === "nodes") {
      defaultMeta.nodes = {
        lastSyncAt: row.last_sync_at,
        stale: row.stale,
        reason: row.reason
      };
    } else if (row.key === "solarSystems") {
      defaultMeta.solarSystems = {
        lastSyncAt: row.last_sync_at,
        stale: row.stale,
        reason: row.reason
      };
    } else if (row.key === "constellations") {
      defaultMeta.constellations = {
        lastSyncAt: row.last_sync_at,
        stale: row.stale,
        reason: row.reason
      };
    }
  }

  return defaultMeta;
}

export async function updateRuntimeMetaInSupabase(
  key: keyof ProjectionRuntimeMeta,
  patch: Partial<ProjectionRuntimeMeta[keyof ProjectionRuntimeMeta]>
): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  await supabaseUpsert("runtime_meta", [{
    key,
    last_sync_at: patch.lastSyncAt ?? null,
    stale: patch.stale ?? false,
    reason: patch.reason ?? null
  }], {
    onConflict: "key",
    returning: "minimal"
  });
}

// Public API - Match Scores
export async function readMatchScoresFromSupabase(matchId?: string): Promise<PersistedMatchScore[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const filter = matchId ? `match_id=eq.${matchId}` : undefined;
  const rows = await supabaseSelect<MatchScoreRow>("match_scores", {
    select: "*",
    filter,
    order: "total_score.desc"
  });

  return rows.map(matchScoreRowToModel);
}

export async function upsertMatchScoresToSupabase(scores: PersistedMatchScore[]): Promise<void> {
  if (!isSupabaseConfigured() || scores.length === 0) {
    return;
  }

  await supabaseUpsert("match_scores", scores.map(matchScoreModelToRow), {
    onConflict: "match_id,wallet_address",
    returning: "minimal"
  });
}

// Public API - Fuel Events
export async function readFuelEventsFromSupabase(matchId?: string): Promise<PersistedFuelEvent[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const filter = matchId ? `match_id=eq.${matchId}` : undefined;
  const rows = await supabaseSelect<FuelEventRow>("fuel_events", {
    select: "*",
    filter,
    order: "chain_ts.desc"
  });

  return rows.map(fuelEventRowToModel);
}

export async function appendFuelEventsToSupabase(events: PersistedFuelEvent[]): Promise<void> {
  if (!isSupabaseConfigured() || events.length === 0) {
    return;
  }

  // Use upsert with ignore duplicates behavior
  await supabaseUpsert("fuel_events", events.map(fuelEventModelToRow), {
    onConflict: "match_id,tx_digest,event_id",
    returning: "minimal"
  });
}

// Public API - Match Stream Events
export async function readMatchStreamEventsFromSupabase(matchId?: string): Promise<PersistedMatchStreamEvent[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const filter = matchId ? `match_id=eq.${matchId}` : undefined;
  const rows = await supabaseSelect<MatchStreamEventRow>("match_stream_events", {
    select: "*",
    filter,
    order: "created_at.desc"
  });

  return rows.map(streamEventRowToModel);
}

export async function appendMatchStreamEventsToSupabase(events: PersistedMatchStreamEvent[]): Promise<void> {
  if (!isSupabaseConfigured() || events.length === 0) {
    return;
  }

  // Stream events are append-only, no upsert needed
  for (const event of events) {
    await supabaseUpsert("match_stream_events", [streamEventModelToRow(event)], {
      returning: "minimal"
    });
  }
}

// Public API - Idempotency Keys
export async function getIdempotencyKeyFromSupabase(scope: string, key: string): Promise<PersistedIdempotencyRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const row = await supabaseSelectOne<IdempotencyKeyRow>(
    "idempotency_keys",
    `scope=eq.${encodeURIComponent(scope)}&key=eq.${encodeURIComponent(key)}`
  );

  return row ? idempotencyRowToModel(row) : null;
}

export async function putIdempotencyKeyToSupabase(record: PersistedIdempotencyRecord): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  await supabaseUpsert("idempotency_keys", [idempotencyModelToRow(record)], {
    onConflict: "scope,key",
    returning: "minimal"
  });
}

// Utility: Check if Supabase is available
export function isSupabaseRuntimeStoreAvailable(): boolean {
  return isSupabaseConfigured();
}
