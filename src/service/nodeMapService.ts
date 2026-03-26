import { nodeMapStore, type NodeMapStore } from "@/model/nodeMapStore";
import type { ControllerResult } from "@/types/common";
import type { NetworkNode } from "@/types/node";
import type { NodeMapFilters, NodeMapOverviewResponse } from "@/types/nodeMap";
import type { SolarSystemMapLevel, SolarSystemMapPoint } from "@/types/solarSystem";

function success<T>(payload: T): ControllerResult<T> {
  return {
    ok: true,
    message: "ok",
    payload
  };
}

function failure<T>(code: string, message: string): ControllerResult<T> {
  return {
    ok: false,
    message,
    errorCode: code
  };
}

function normalizeFilters(filters: NodeMapFilters) {
  return {
    riskLevel: filters.riskLevel ?? "all",
    minNodeCount: filters.minNodeCount ?? 0,
    hasActiveMatch: filters.hasActiveMatch ?? false
  };
}

async function fetchOverviewPoints(options: {
  constellationId?: number;
  cursor?: string | null;
  forceRefresh?: boolean;
  level?: SolarSystemMapLevel;
  limit?: number;
  regionId?: number;
}): Promise<NodeMapOverviewResponse> {
  const params = new URLSearchParams();
  params.set("level", options.level ?? "region");

  if (typeof options.regionId === "number") {
    params.set("regionId", String(options.regionId));
  }
  if (typeof options.constellationId === "number") {
    params.set("constellationId", String(options.constellationId));
  }
  if (typeof options.limit === "number" && options.limit > 0) {
    params.set("limit", String(options.limit));
  }
  if (options.cursor) {
    params.set("cursor", options.cursor);
  }
  if (options.forceRefresh) {
    params.set("refresh", "true");
  }

  const response = await fetch(`/api/solar-systems/map?${params.toString()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`LOAD_SOLAR_SYSTEM_MAP_FAILED_${response.status}`);
  }

  return (await response.json()) as NodeMapOverviewResponse;
}

async function fetchSystemNodes(systemId: number, forceRefresh = false): Promise<NetworkNode[]> {
  const params = new URLSearchParams();
  params.set("solarSystem", String(systemId));
  if (forceRefresh) {
    params.set("refresh", "true");
  }

  const response = await fetch(`/api/nodes?${params.toString()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`LOAD_SYSTEM_NODES_FAILED_${response.status}`);
  }

  const payload = (await response.json()) as { nodes?: NetworkNode[] };
  return payload.nodes ?? [];
}

function filterOverviewPoints(points: SolarSystemMapPoint[], filters: NodeMapFilters) {
  const normalized = normalizeFilters(filters);

  return points.filter((point) => {
    if ((normalized.minNodeCount ?? 0) > 0 && point.nodeCount < (normalized.minNodeCount ?? 0)) {
      return false;
    }
    if (normalized.hasActiveMatch && point.activeMatchCount <= 0) {
      return false;
    }
    if (normalized.riskLevel === "critical" && point.criticalCount <= 0) {
      return false;
    }
    if (normalized.riskLevel === "warning" && point.warningCount <= 0 && point.criticalCount <= 0) {
      return false;
    }
    return true;
  });
}

function applyOverviewContext(
  state: NodeMapStore,
  options: {
    constellationId?: number;
    level: SolarSystemMapLevel;
    regionId?: number;
  }
) {
  state.setOverviewLevel(options.level);
  state.setLayer("overview");
  state.setSelectedNode(null);
  state.setSelectedSystem(null);

  if (options.level === "region") {
    state.setSelectedRegion(null);
    state.setSelectedConstellation(null);
    return;
  }

  if (typeof options.regionId === "number") {
    state.setSelectedRegion(options.regionId);
  }

  if (options.level === "constellation") {
    state.setSelectedConstellation(null);
    return;
  }

  if (typeof options.constellationId === "number") {
    state.setSelectedConstellation(options.constellationId);
  }
}

export const nodeMapService = {
  subscribe(listener: () => void) {
    return nodeMapStore.subscribe(listener);
  },

  getSnapshot(): NodeMapStore {
    return nodeMapStore.getState();
  },

  getSelectedNode() {
    const state = nodeMapStore.getState();
    if (!state.selectedNodeId) {
      return null;
    }

    return state.systemNodes.find((node) => node.id === state.selectedNodeId || node.objectId === state.selectedNodeId) ?? null;
  },

  getFilteredOverviewPoints() {
    const state = nodeMapStore.getState();
    return filterOverviewPoints(state.overviewPoints, state.filters);
  },

  async loadOverviewPoints(
    options: {
      constellationId?: number;
      cursor?: string | null;
      forceRefresh?: boolean;
      level?: SolarSystemMapLevel;
      limit?: number;
      regionId?: number;
    } = {}
  ): Promise<ControllerResult<void>> {
    const state = nodeMapStore.getState();
    const level = options.level ?? "region";

    state.setLoadingOverview(true);
    state.setError(null);

    try {
      const overview = await fetchOverviewPoints({
        level,
        regionId: options.regionId,
        constellationId: options.constellationId,
        limit: options.limit,
        cursor: options.cursor,
        forceRefresh: options.forceRefresh
      });

      applyOverviewContext(state, {
        level,
        regionId: options.regionId,
        constellationId: options.constellationId
      });
      state.setRenderMode("2d");
      state.setOverviewPoints(overview.points);
      state.setQuality(overview.quality);
      state.setNextCursor(overview.nextCursor);
      return success(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : "load overview points failed";
      state.setError(message);
      return failure("NETWORK_ERROR", message);
    } finally {
      state.setLoadingOverview(false);
    }
  },

  async drillDownOverview(point: SolarSystemMapPoint, options: { forceRefresh?: boolean } = {}): Promise<ControllerResult<void>> {
    if (point.kind === "region") {
      return nodeMapService.loadOverviewPoints({
        level: "constellation",
        regionId: point.regionId ?? point.id,
        forceRefresh: options.forceRefresh
      });
    }

    if (point.kind === "constellation") {
      return nodeMapService.loadOverviewPoints({
        level: "system",
        regionId: point.regionId ?? undefined,
        constellationId: point.constellationId ?? point.id,
        forceRefresh: options.forceRefresh
      });
    }

    return nodeMapService.loadSystemNodes(point.systemId ?? point.id, options);
  },

  async loadSystemNodes(systemId: number, options: { forceRefresh?: boolean } = {}): Promise<ControllerResult<void>> {
    const state = nodeMapStore.getState();
    state.setLoadingSystem(true);
    state.setError(null);

    try {
      const nodes = await fetchSystemNodes(systemId, options.forceRefresh ?? false);
      state.setSystemNodes(nodes);
      state.setSelectedSystem(systemId);
      state.setSelectedNode(null);
      state.setLayer("system");
      state.setRenderMode("3d");
      return success(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : "load system nodes failed";
      state.setError(message);
      return failure("NETWORK_ERROR", message);
    } finally {
      state.setLoadingSystem(false);
    }
  },

  async goBack(options: { forceRefresh?: boolean } = {}): Promise<ControllerResult<void>> {
    const state = nodeMapStore.getState();

    if (state.selectedNodeId) {
      state.setSelectedNode(null);
      state.setLayer("system");
      return success(undefined);
    }

    if (state.layer === "system") {
      state.setSelectedSystem(null);
      state.setLayer("overview");
      state.setRenderMode("2d");
      return success(undefined);
    }

    if (state.overviewLevel === "system" && typeof state.selectedRegionId === "number") {
      return nodeMapService.loadOverviewPoints({
        level: "constellation",
        regionId: state.selectedRegionId,
        forceRefresh: options.forceRefresh
      });
    }

    if (state.overviewLevel === "constellation") {
      return nodeMapService.loadOverviewPoints({
        level: "region",
        forceRefresh: options.forceRefresh
      });
    }

    return success(undefined);
  },

  toggleRenderMode(mode?: "2d" | "3d") {
    const state = nodeMapStore.getState();
    const nextMode = mode ?? (state.renderMode === "2d" ? "3d" : "2d");
    state.setRenderMode(nextMode);
  },

  selectNode(nodeId: string | null) {
    const state = nodeMapStore.getState();
    state.setSelectedNode(nodeId);
    state.setLayer(nodeId ? "node" : "system");
  },

  applyFilters(filters: Partial<NodeMapFilters>) {
    const state = nodeMapStore.getState();
    state.setFilters(filters);
  }
};
