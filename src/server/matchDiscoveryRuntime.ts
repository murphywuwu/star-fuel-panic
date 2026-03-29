import { calculateJumps } from "./gateTopologyRuntime.ts";
import { hydrateRuntimeProjectionFromBackendIfNeeded } from "./matchBackendStore.ts";
import { getMatchDetail, listMatches } from "./matchRuntime.ts";
import { listNodes } from "./nodeRuntime.ts";
import { getSolarSystemById } from "./solarSystemRuntime.ts";
import type {
  Match,
  MatchDiscoveryDetail,
  MatchDiscoveryItem,
  MatchFilters,
  MatchTargetNodeSnapshot
} from "../types/match.ts";
import type { NetworkNode } from "../types/node.ts";

const SEEDED_MATCH_SYSTEM_IDS: Record<string, number> = {
  "mission-ssu-7": 30000142,
  "mission-gate-12": 30000143,
  "mission-peri-4": 30000144,
  "mission-orbit-9": 30000145,
  "mission-kite-2": 30000146
};

function normalizeMode(match: Match): "free" | "precision" {
  return match.creationMode === "precision" ? "precision" : "free";
}

function distanceHint(distanceHops: number | null) {
  if (distanceHops === null || distanceHops < 0) {
    return "Distance Unknown";
  }
  if (distanceHops === 0) {
    return "Same System";
  }
  return `${distanceHops} jumps`;
}

function buildMatchName(match: Match, mode: "free" | "precision", solarSystemName: string, targetNodes: MatchTargetNodeSnapshot[]) {
  if (mode === "precision" && targetNodes[0]) {
    return `${targetNodes[0].name} Precision Rescue`;
  }
  if (solarSystemName && !solarSystemName.startsWith("System ")) {
    return mode === "precision" ? `${solarSystemName} Precision Supply Run` : `${solarSystemName} System Exploration Match`;
  }
  return mode === "precision" ? `Precision Match ${match.id.slice(0, 8)}` : `Free Match ${match.id.slice(0, 8)}`;
}

function buildTargetNodeSummary(mode: "free" | "precision", targetNodes: MatchTargetNodeSnapshot[]) {
  if (mode === "precision") {
    return `${targetNodes.length} designated target nodes`;
  }
  return "Any online node in the system";
}

async function safeGetSolarSystemById(systemId: number) {
  if (systemId <= 0) {
    return null;
  }

  try {
    return await getSolarSystemById(systemId);
  } catch {
    return null;
  }
}

function createNodeLookup(nodes: NetworkNode[]) {
  const byId = new Map<string, NetworkNode>();

  for (const node of nodes) {
    byId.set(node.id, node);
    byId.set(node.objectId, node);
  }

  return byId;
}

function getSolarSystemId(match: Match, nodeById: Map<string, NetworkNode>) {
  if (typeof match.solarSystemId === "number" && match.solarSystemId > 0) {
    return match.solarSystemId;
  }

  const seededSystemId = SEEDED_MATCH_SYSTEM_IDS[match.id];
  if (typeof seededSystemId === "number" && seededSystemId > 0) {
    return seededSystemId;
  }

  const firstTargetNodeId = match.targetNodeIds[0] ?? match.onChainId ?? null;
  if (!firstTargetNodeId) {
    return 0;
  }

  return nodeById.get(firstTargetNodeId)?.solarSystem ?? 0;
}

function getTargetNodes(match: Match, mode: "free" | "precision", nodeById: Map<string, NetworkNode>): MatchTargetNodeSnapshot[] {
  if (mode !== "precision") {
    return [];
  }

  return match.targetNodeIds
    .map((nodeId) => nodeById.get(nodeId))
    .filter((node): node is NetworkNode => Boolean(node))
    .map((node) => ({
      objectId: node.objectId,
      name: node.name,
      fillRatio: node.fillRatio,
      urgency: node.urgency,
      isOnline: node.isOnline
    }));
}

async function buildMatchDiscoveryItem(
  match: Match,
  currentSystemId: number | null,
  nodeById: Map<string, NetworkNode>
): Promise<MatchDiscoveryItem> {
  const detail = getMatchDetail(match.id);
  const mode = normalizeMode(match);
  const targetNodes = getTargetNodes(match, mode, nodeById);
  const solarSystemId = getSolarSystemId(match, nodeById);
  const system = await safeGetSolarSystemById(solarSystemId);
  const registeredTeams = detail?.teams.length ?? match.registeredTeams ?? 0;
  const distanceHops =
    currentSystemId && solarSystemId > 0
      ? await calculateJumps(currentSystemId, solarSystemId).then((value) => (value >= 0 ? value : null))
      : null;
  const solarSystemName = system?.systemName ?? `System ${solarSystemId || 0}`;
  const constellationId = system?.constellationId ?? 0;
  const constellationName = `Constellation ${constellationId}`;

  return {
    id: match.id,
    mode,
    modeLabel: mode === "precision" ? "Precision Mode" : "Free Mode",
    name: buildMatchName(match, mode, solarSystemName, targetNodes),
    status: match.status,
    targetSolarSystem: {
      systemId: solarSystemId,
      systemName: solarSystemName,
      constellationId,
      constellationName
    },
    targetNodeCount: targetNodes.length,
    targetNodeSummary: buildTargetNodeSummary(mode, targetNodes),
    grossPool: match.prizePool,
    entryFee: match.entryFee,
    sponsorshipFee: match.sponsorshipFee ?? match.hostPrizePool,
    platformFeeRate: 0.05,
    teamProgress: {
      registeredTeams,
      maxTeams: match.maxTeams
    },
    durationHours: Number((match.durationMinutes / 60).toFixed(2)),
    distanceHops,
    distanceHint: distanceHint(distanceHops),
    createdAt: match.createdAt
  };
}

export async function listMatchDiscoveryItems(options: {
  filters?: MatchFilters;
  currentSystemId?: number | null;
}) {
  await hydrateRuntimeProjectionFromBackendIfNeeded();
  const [matches, nodes] = await Promise.all([Promise.resolve(listMatches(options.filters)), listNodes({})]);
  const nodeById = createNodeLookup(nodes);

  return Promise.all(matches.map((match) => buildMatchDiscoveryItem(match, options.currentSystemId ?? null, nodeById)));
}

export async function getMatchDiscoveryDetail(matchId: string, currentSystemId?: number | null): Promise<MatchDiscoveryDetail | null> {
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId });
  const [detail, nodes] = await Promise.all([Promise.resolve(getMatchDetail(matchId)), listNodes({})]);

  if (!detail) {
    return null;
  }

  const nodeById = createNodeLookup(nodes);
  const match = await buildMatchDiscoveryItem(detail.match, currentSystemId ?? null, nodeById);
  const targetNodes = getTargetNodes(detail.match, normalizeMode(detail.match), nodeById);

  return {
    match: {
      ...match,
      targetNodes
    },
    teams: detail.teams,
    members: detail.members
  };
}
