import { listNodes } from "@/server/nodeRuntime";
import { getSolarSystems } from "@/server/solarSystemRuntime";
import {
  readPersistedConstellationSummaries,
  updateProjectionRuntimeMeta,
  writePersistedConstellationSummaries,
  type ConstellationProjectionSummary
} from "@/server/runtimeProjectionStore";
import type { NetworkNode } from "@/types/node";
import type { SolarSystem } from "@/types/solarSystem";

type RuntimeOptions = {
  forceRefresh?: boolean;
};

type SelectableState = "selectable" | "no_nodes" | "offline_only" | "not_public";

type SolarSystemRecommendation = {
  system: SolarSystem & {
    nodeCount: number;
    urgentNodeCount: number;
    warningNodeCount: number;
    selectableState: SelectableState;
  };
  topUrgency: "critical" | "warning" | "safe";
  summary: string;
};

function nowIso() {
  return new Date().toISOString();
}

function constellationName(constellationId: number) {
  return `Constellation ${constellationId}`;
}

function deriveSelectableState(nodes: NetworkNode[]): SelectableState {
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

function groupNodesBySystem(nodes: NetworkNode[]) {
  const bySystem = new Map<number, NetworkNode[]>();

  for (const node of nodes) {
    if (node.solarSystem <= 0) {
      continue;
    }

    const list = bySystem.get(node.solarSystem) ?? [];
    list.push(node);
    bySystem.set(node.solarSystem, list);
  }

  return bySystem;
}

export async function syncConstellationSummaries(options: RuntimeOptions = {}) {
  try {
    const [systems, nodes] = await Promise.all([getSolarSystems(options), listNodes({}, options)]);
    const nodesBySystem = groupNodesBySystem(nodes);
    const grouped = new Map<number, ConstellationProjectionSummary>();
    const updatedAt = nowIso();

    for (const system of systems) {
      const systemNodes = nodesBySystem.get(system.systemId) ?? [];
      const summary = grouped.get(system.constellationId) ?? {
        constellationId: system.constellationId,
        constellationName: constellationName(system.constellationId),
        regionId: system.regionId,
        systemCount: 0,
        selectableSystemCount: 0,
        urgentNodeCount: 0,
        warningNodeCount: 0,
        sortScore: 0,
        updatedAt
      };

      summary.systemCount += 1;
      if (deriveSelectableState(systemNodes) === "selectable") {
        summary.selectableSystemCount += 1;
      }
      summary.urgentNodeCount += systemNodes.filter((node) => node.urgency === "critical").length;
      summary.warningNodeCount += systemNodes.filter((node) => node.urgency === "warning").length;
      summary.sortScore =
        summary.urgentNodeCount * 3 + summary.warningNodeCount * 2 + summary.selectableSystemCount;
      grouped.set(system.constellationId, summary);
    }

    const summaries = [...grouped.values()].sort(
      (left, right) => right.sortScore - left.sortScore || left.constellationId - right.constellationId
    );

    writePersistedConstellationSummaries(summaries);
    updateProjectionRuntimeMeta("constellations", {
      lastSyncAt: updatedAt,
      stale: false,
      reason: null
    });

    return summaries;
  } catch (error) {
    const cached = readPersistedConstellationSummaries();
    updateProjectionRuntimeMeta("constellations", {
      stale: true,
      reason: error instanceof Error ? error.message : "CONSTELLATION_SYNC_FAILED"
    });
    return cached;
  }
}

export async function listConstellations(options: RuntimeOptions = {}) {
  if (!options.forceRefresh) {
    const cached = readPersistedConstellationSummaries();
    if (cached.length > 0) {
      return cached;
    }
  }

  return syncConstellationSummaries(options);
}

export async function getConstellationById(constellationId: number, options: RuntimeOptions = {}) {
  const [systems, nodes, summaries] = await Promise.all([
    getSolarSystems(options),
    listNodes({}, options),
    listConstellations(options)
  ]);

  const constellation = summaries.find((item) => item.constellationId === constellationId) ?? null;
  const filteredSystems = systems.filter((system) => system.constellationId === constellationId);
  if (!constellation || filteredSystems.length === 0) {
    return null;
  }

  const nodesBySystem = groupNodesBySystem(nodes);

  return {
    constellation,
    systems: filteredSystems
      .map((system) => {
        const systemNodes = nodesBySystem.get(system.systemId) ?? [];
        return {
          ...system,
          nodeCount: systemNodes.length,
          urgentNodeCount: systemNodes.filter((node) => node.urgency === "critical").length,
          warningNodeCount: systemNodes.filter((node) => node.urgency === "warning").length,
          selectableState: deriveSelectableState(systemNodes)
        };
      })
      .sort((left, right) => right.urgentNodeCount - left.urgentNodeCount || left.systemName.localeCompare(right.systemName))
  };
}

export async function searchSolarSystemsAndConstellations(query: string, options: RuntimeOptions = {}) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return [];
  }

  const [systems, constellations, nodes] = await Promise.all([
    getSolarSystems(options),
    listConstellations(options),
    listNodes({}, options)
  ]);
  const nodesBySystem = groupNodesBySystem(nodes);

  const constellationHits = constellations
    .filter(
      (item) =>
        item.constellationName.toLowerCase().includes(trimmed) || String(item.constellationId).includes(trimmed)
    )
    .map((item) => ({
      type: "constellation" as const,
      id: item.constellationId,
      regionId: item.regionId,
      label: `${item.constellationName} (${item.constellationId})`
    }));

  const systemHits = systems
    .filter(
      (item) => item.systemName.toLowerCase().includes(trimmed) || String(item.systemId).includes(trimmed)
    )
    .map((item) => ({
      type: "system" as const,
      id: item.systemId,
      label: `${item.systemName} (${item.systemId})`,
      regionId: item.regionId,
      constellationId: item.constellationId,
      constellationName: constellationName(item.constellationId),
      selectableState: deriveSelectableState(nodesBySystem.get(item.systemId) ?? [])
    }));

  return [...constellationHits, ...systemHits].slice(0, 30);
}

export async function getSolarSystemRecommendations(
  options: RuntimeOptions = {}
): Promise<SolarSystemRecommendation[]> {
  const [systems, nodes] = await Promise.all([getSolarSystems(options), listNodes({}, options)]);
  const nodesBySystem = groupNodesBySystem(nodes);

  return systems
    .map((system) => {
      const systemNodes = nodesBySystem.get(system.systemId) ?? [];
      const urgentNodeCount = systemNodes.filter((node) => node.urgency === "critical").length;
      const warningNodeCount = systemNodes.filter((node) => node.urgency === "warning").length;
      const selectableState = deriveSelectableState(systemNodes);
      const topUrgency: "critical" | "warning" | "safe" =
        urgentNodeCount > 0 ? "critical" : warningNodeCount > 0 ? "warning" : "safe";

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
    })
    .sort((left, right) => {
      const leftScore =
        left.system.urgentNodeCount * 3 +
        left.system.warningNodeCount * 2 +
        (left.system.selectableState === "selectable" ? 1 : 0);
      const rightScore =
        right.system.urgentNodeCount * 3 +
        right.system.warningNodeCount * 2 +
        (right.system.selectableState === "selectable" ? 1 : 0);
      return rightScore - leftScore || left.system.systemName.localeCompare(right.system.systemName);
    })
    .slice(0, 20);
}
