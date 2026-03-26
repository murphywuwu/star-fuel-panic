"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { nodeMapService } from "@/service/nodeMapService";
import type { ControllerResult } from "@/types/common";
import type { NodeMapFilters } from "@/types/nodeMap";
import type { SolarSystemMapLevel, SolarSystemMapPoint } from "@/types/solarSystem";

export function useNodeMapController() {
  const state = useSyncExternalStore(
    nodeMapService.subscribe,
    nodeMapService.getSnapshot,
    nodeMapService.getSnapshot
  );

  const overviewPoints = useMemo(() => nodeMapService.getFilteredOverviewPoints(), [state]);
  const selectedNode = useMemo(() => nodeMapService.getSelectedNode(), [state]);

  const loadOverviewPoints = useCallback(
    async (options?: {
      constellationId?: number;
      cursor?: string | null;
      forceRefresh?: boolean;
      level?: SolarSystemMapLevel;
      limit?: number;
      regionId?: number;
    }): Promise<ControllerResult<void>> => {
      return nodeMapService.loadOverviewPoints(options);
    },
    []
  );

  const handleOverviewPointClick = useCallback(
    async (point: SolarSystemMapPoint, options?: { forceRefresh?: boolean }): Promise<ControllerResult<void>> => {
      return nodeMapService.drillDownOverview(point, options);
    },
    []
  );

  const loadSystemNodes = useCallback(
    async (systemId: number, options?: { forceRefresh?: boolean }): Promise<ControllerResult<void>> => {
      return nodeMapService.loadSystemNodes(systemId, options);
    },
    []
  );

  const goBack = useCallback(async (options?: { forceRefresh?: boolean }): Promise<ControllerResult<void>> => {
    return nodeMapService.goBack(options);
  }, []);

  const toggleRenderMode = useCallback((mode?: "2d" | "3d") => {
    nodeMapService.toggleRenderMode(mode);
  }, []);

  const selectNode = useCallback((nodeId: string | null) => {
    nodeMapService.selectNode(nodeId);
  }, []);

  const applyFilters = useCallback((filters: Partial<NodeMapFilters>) => {
    nodeMapService.applyFilters(filters);
  }, []);

  return {
    layer: state.layer,
    renderMode: state.renderMode,
    overviewLevel: state.overviewLevel,
    selectedRegionId: state.selectedRegionId,
    selectedConstellationId: state.selectedConstellationId,
    selectedSystemId: state.selectedSystemId,
    selectedNodeId: state.selectedNodeId,
    selectedNode,
    overviewPoints,
    systemNodes: state.systemNodes,
    quality: state.quality,
    filters: state.filters,
    loadingOverview: state.loadingOverview,
    loadingSystem: state.loadingSystem,
    loadingNode: state.loadingNode,
    error: state.error,
    nextCursor: state.nextCursor,
    loadOverviewPoints,
    handleOverviewPointClick,
    loadSystemNodes,
    goBack,
    toggleRenderMode,
    selectNode,
    applyFilters
  };
}
