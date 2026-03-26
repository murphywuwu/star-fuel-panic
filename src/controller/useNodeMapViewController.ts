"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useNodeMapController } from "@/controller/useNodeMapController";
import type { NetworkNode } from "@/types/node";
import type { SolarSystemMapLevel, SolarSystemMapPoint } from "@/types/solarSystem";

type PositionedOverviewPoint = SolarSystemMapPoint & {
  plotLeft: number;
  plotTop: number;
};

type PositionedNode = NetworkNode & {
  isVirtual: boolean;
  sceneX: number;
  sceneY: number;
  sceneZ: number;
};

function titleForLevel(level: SolarSystemMapLevel) {
  if (level === "region") {
    return "Region Overview";
  }
  if (level === "constellation") {
    return "Constellation Overview";
  }
  return "System Overview";
}

function subtitleForLevel(level: SolarSystemMapLevel) {
  if (level === "region") {
    return "Universe ingress layer";
  }
  if (level === "constellation") {
    return "Regional constellation spread";
  }
  return "System navigation layer";
}

function buildOverviewPlot(points: SolarSystemMapPoint[]) {
  if (points.length === 0) {
    return [] as PositionedOverviewPoint[];
  }

  const xs = points.map((point) => point.point.x);
  const zs = points.map((point) => point.point.z);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);

  return points.map((point) => {
    const left = maxX === minX ? 50 : 10 + ((point.point.x - minX) / (maxX - minX)) * 80;
    const top = maxZ === minZ ? 50 : 12 + ((point.point.z - minZ) / (maxZ - minZ)) * 76;

    return {
      ...point,
      plotLeft: Number(left.toFixed(2)),
      plotTop: Number(top.toFixed(2))
    };
  });
}

function buildNodeSceneLayout(nodes: NetworkNode[]): PositionedNode[] {
  if (nodes.length === 0) {
    return [];
  }

  const withCoords = nodes.filter((node) => node.coordX !== 0 || node.coordY !== 0 || node.coordZ !== 0);
  const withoutCoords = nodes.filter((node) => node.coordX === 0 && node.coordY === 0 && node.coordZ === 0);

  let normalizedRealNodes: PositionedNode[] = [];
  if (withCoords.length > 0) {
    const xs = withCoords.map((node) => node.coordX);
    const zs = withCoords.map((node) => node.coordZ);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;
    const spread = Math.max(
      1,
      ...withCoords.map((node) => Math.max(Math.abs(node.coordX - centerX), Math.abs(node.coordZ - centerZ)))
    );

    normalizedRealNodes = withCoords.map((node) => ({
      ...node,
      isVirtual: false,
      sceneX: Number((((node.coordX - centerX) / spread) * 22).toFixed(3)),
      sceneY: 0,
      sceneZ: Number((((node.coordZ - centerZ) / spread) * 22).toFixed(3))
    }));
  }

  const virtualRadius = Math.max(16, Math.min(30, withoutCoords.length * 2.2));
  const angleStep = withoutCoords.length > 0 ? (Math.PI * 2) / withoutCoords.length : 0;
  const virtualNodes = withoutCoords.map((node, index) => {
    const angle = angleStep * index;
    return {
      ...node,
      isVirtual: true,
      sceneX: Number((Math.cos(angle) * virtualRadius).toFixed(3)),
      sceneY: 0,
      sceneZ: Number((Math.sin(angle) * virtualRadius).toFixed(3))
    };
  });

  return [...normalizedRealNodes, ...virtualNodes];
}

function buildSystemPointFromQuery(
  systemId: number,
  regionId: number | null,
  constellationId: number | null
): SolarSystemMapPoint {
  return {
    id: systemId,
    kind: "system",
    label: `System ${systemId}`,
    regionId,
    constellationId,
    systemId,
    childCount: 0,
    point: { x: 0, y: 0, z: 0 },
    nodeCount: 0,
    criticalCount: 0,
    warningCount: 0,
    safeCount: 0,
    activeMatchCount: 0
  };
}

export function useNodeMapViewController() {
  const nodeMapController = useNodeMapController();
  const {
    layer,
    renderMode,
    overviewLevel,
    selectedRegionId,
    selectedConstellationId,
    selectedSystemId,
    selectedNodeId,
    selectedNode,
    overviewPoints,
    systemNodes,
    quality,
    filters,
    loadingOverview,
    loadingSystem,
    loadingNode,
    error,
    nextCursor,
    loadOverviewPoints,
    handleOverviewPointClick,
    loadSystemNodes,
    goBack,
    toggleRenderMode,
    selectNode,
    applyFilters
  } = nodeMapController;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);

  const positionedPoints = useMemo(() => buildOverviewPlot(overviewPoints), [overviewPoints]);
  const sceneNodes = useMemo(() => buildNodeSceneLayout(systemNodes), [systemNodes]);

  const unknownSystemPoint = useMemo(() => {
    if (!filters.showUnknownSystem || quality.unlocatedNodes <= 0) {
      return null;
    }

    return {
      id: 0,
      label: "Unknown System",
      nodeCount: quality.unlocatedNodes
    };
  }, [filters.showUnknownSystem, quality.unlocatedNodes]);

  const breadcrumbs = useMemo(() => {
    const items = [{ label: "Region", active: overviewLevel === "region" && layer === "overview" }];

    if (selectedRegionId !== null) {
      items.push({
        label: `Region ${selectedRegionId}`,
        active: overviewLevel === "constellation" && layer === "overview"
      });
    }

    if (selectedConstellationId !== null) {
      items.push({
        label: `Constellation ${selectedConstellationId}`,
        active: overviewLevel === "system" && layer === "overview"
      });
    }

    if (selectedSystemId !== null) {
      const systemLabel =
        overviewPoints.find((point) => point.systemId === selectedSystemId)?.label ??
        systemNodes[0]?.name ??
        `System ${selectedSystemId}`;
      items.push({
        label: systemLabel,
        active: layer !== "overview"
      });
    }

    return items;
  }, [
    layer,
    overviewLevel,
    overviewPoints,
    selectedConstellationId,
    selectedRegionId,
    selectedSystemId,
    systemNodes
  ]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const fromRegion = searchParams.get("region");
      const fromConstellation = searchParams.get("constellation");
      const fromSystem = searchParams.get("system");
      const fromNode = searchParams.get("node");
      const fromMode = searchParams.get("mode");

      if (fromSystem) {
        const regionId = Number(fromRegion);
        const constellationId = Number(fromConstellation);
        if (Number.isFinite(constellationId) && constellationId >= 0) {
          await loadOverviewPoints({
            level: "system",
            regionId: Number.isFinite(regionId) && regionId >= 0 ? regionId : undefined,
            constellationId
          });
        } else {
          await loadOverviewPoints();
        }

        const systemId = Number(fromSystem);
        if (Number.isFinite(systemId) && systemId >= 0) {
          await handleOverviewPointClick(
            buildSystemPointFromQuery(
              systemId,
              Number.isFinite(regionId) && regionId >= 0 ? regionId : null,
              Number.isFinite(constellationId) && constellationId >= 0 ? constellationId : null
            ),
            { forceRefresh: true }
          );
          if (fromNode) {
            selectNode(fromNode);
          }
        }
      } else if (fromConstellation) {
        const regionId = Number(fromRegion);
        const constellationId = Number(fromConstellation);
        if (Number.isFinite(constellationId) && constellationId >= 0) {
          await loadOverviewPoints({
            level: "system",
            regionId: Number.isFinite(regionId) && regionId >= 0 ? regionId : undefined,
            constellationId
          });
          if (fromMode === "3d") {
            toggleRenderMode("3d");
          }
        } else {
          await loadOverviewPoints();
        }
      } else if (fromRegion) {
        const regionId = Number(fromRegion);
        if (Number.isFinite(regionId) && regionId >= 0) {
          await loadOverviewPoints({
            level: "constellation",
            regionId
          });
        } else {
          await loadOverviewPoints();
        }
      } else {
        await loadOverviewPoints();
      }

      if (active) {
        setInitialized(true);
      }
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, [handleOverviewPointClick, loadOverviewPoints, searchParams, selectNode, toggleRenderMode]);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    const next = new URLSearchParams();

    if (selectedRegionId !== null) {
      next.set("region", String(selectedRegionId));
    }
    if (selectedConstellationId !== null) {
      next.set("constellation", String(selectedConstellationId));
    }

    if (layer === "overview") {
      if (overviewLevel !== "region") {
        next.set("level", overviewLevel);
      }
      if (overviewLevel === "system" && renderMode === "3d") {
        next.set("mode", "3d");
      }
    }

    if (selectedSystemId !== null) {
      next.set("system", String(selectedSystemId));
    }
    if (selectedNodeId) {
      next.set("node", selectedNodeId);
    }

    const nextQuery = next.toString();
    const currentQuery = searchParams.toString();
    if (nextQuery !== currentQuery) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }
  }, [
    initialized,
    layer,
    overviewLevel,
    pathname,
    renderMode,
    router,
    searchParams,
    selectedConstellationId,
    selectedNodeId,
    selectedRegionId,
    selectedSystemId
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (selectedNodeId) {
        selectNode(null);
        return;
      }

      void goBack();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goBack, selectNode, selectedNodeId]);

  return {
    nodeMap: {
      layer,
      renderMode,
      overviewLevel,
      selectedRegionId,
      selectedConstellationId,
      selectedSystemId,
      selectedNodeId,
      selectedNode,
      overviewPoints,
      systemNodes,
      quality,
      filters,
      loadingOverview,
      loadingSystem,
      loadingNode,
      error,
      nextCursor,
      loadOverviewPoints,
      handleOverviewPointClick,
      loadSystemNodes,
      goBack,
      toggleRenderMode,
      selectNode,
      applyFilters
    },
    view: {
      initialized,
      positionedPoints,
      sceneNodes,
      unknownSystemPoint,
      breadcrumbs,
      currentTitle: layer === "overview" ? titleForLevel(overviewLevel) : "Node Scene",
      currentSubtitle:
        layer === "overview" ? subtitleForLevel(overviewLevel) : `Selected system // ${selectedSystemId ?? "unknown"}`
    }
  };
}
