"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useNodeMapController } from "@/controller/useNodeMapController";
import type { NetworkNode } from "@/types/node";
import type { SolarSystemMapLevel, SolarSystemMapPoint } from "@/types/solarSystem";

type NodeMap3DProps = {
  className?: string;
  onNodeClick?: (node: NetworkNode) => void;
};

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

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function pointColor(point: Pick<SolarSystemMapPoint, "nodeCount" | "criticalCount" | "warningCount">) {
  if (point.nodeCount <= 0) {
    return "#e0e0e0";
  }

  const criticalRatio = point.criticalCount / point.nodeCount;
  if (criticalRatio >= 0.75) {
    return "#cc3300";
  }
  if (criticalRatio >= 0.35) {
    return "#e5b32b";
  }
  if (point.warningCount > 0) {
    return "#e5b32b";
  }
  return "#8fb08f";
}

function urgencyColor(urgency: NetworkNode["urgency"]) {
  if (urgency === "critical") return "#cc3300";
  if (urgency === "warning") return "#e5b32b";
  return "#7fb069";
}

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

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
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

function OverviewPointMesh({
  point,
  onSelect
}: {
  point: SolarSystemMapPoint;
  onSelect: (point: SolarSystemMapPoint) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const size = Math.max(1.4, Math.min(4.5, 1 + point.nodeCount / 6));
  const color = pointColor(point);

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }
    const targetScale = hovered ? 1.18 : 1;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.14);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.14);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.14);
  });

  return (
    <mesh
      ref={meshRef}
      position={[point.point.x, point.point.y * 0.18, point.point.z]}
      onClick={() => onSelect(point)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[size, 18, 18]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.45 : 0.18} />
      {hovered ? (
        <Html center distanceFactor={10}>
          <div className="border border-[#e5b32b]/40 bg-[#080808]/95 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#e0e0e0]">
            {point.label}
          </div>
        </Html>
      ) : null}
    </mesh>
  );
}

function Overview3DScene({
  points,
  onSelect
}: {
  points: SolarSystemMapPoint[];
  onSelect: (point: SolarSystemMapPoint) => void;
}) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 48, 52]} fov={56} />
      <OrbitControls enableDamping dampingFactor={0.06} minDistance={16} maxDistance={110} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[18, 28, 12]} intensity={1.1} />
      <pointLight position={[-12, 14, -18]} color="#e5b32b" intensity={0.55} />
      <gridHelper args={[110, 24, "#444444", "#1a1a1a"]} />
      {points.map((point) => (
        <OverviewPointMesh key={`${point.kind}-${point.id}`} point={point} onSelect={onSelect} />
      ))}
    </Canvas>
  );
}

function NodeCylinder({
  node,
  onClick
}: {
  node: PositionedNode;
  onClick: (node: NetworkNode) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = urgencyColor(node.urgency);
  const height = Math.max(2.2, 2.2 + node.fillRatio * 13);

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }
    const targetScale = hovered ? 1.16 : 1;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.12);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.12);
  });

  return (
    <mesh
      ref={meshRef}
      position={[node.sceneX, height / 2, node.sceneZ]}
      onClick={() => onClick(node)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      frustumCulled
    >
      <cylinderGeometry args={[0.8, 0.8, height, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.5 : node.isOnline ? 0.24 : 0.12}
        opacity={node.isVirtual ? 0.72 : 1}
        transparent
      />
      {hovered ? (
        <Html center position={[0, height / 2 + 1, 0]}>
          <div className="border border-[#e5b32b]/40 bg-[#080808]/95 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#e0e0e0]">
            {node.name}
          </div>
        </Html>
      ) : null}
    </mesh>
  );
}

function NodeScene({
  nodes,
  onNodeClick
}: {
  nodes: PositionedNode[];
  onNodeClick: (node: NetworkNode) => void;
}) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[34, 34, 34]} fov={58} />
      <OrbitControls enableDamping dampingFactor={0.06} minDistance={10} maxDistance={120} maxPolarAngle={Math.PI / 2} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[20, 26, 14]} intensity={1.1} />
      <pointLight position={[-16, 16, -18]} color="#e5b32b" intensity={0.35} />
      <gridHelper args={[96, 28, "#444444", "#1a1a1a"]} />
      {nodes.map((node) => (
        <NodeCylinder key={node.id} node={node} onClick={onNodeClick} />
      ))}
    </Canvas>
  );
}

export function NodeMap3D({ className = "", onNodeClick }: NodeMap3DProps) {
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
    error,
    loadOverviewPoints,
    handleOverviewPointClick,
    goBack,
    toggleRenderMode,
    selectNode,
    applyFilters
  } = useNodeMapController();

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
  }, [layer, overviewLevel, overviewPoints, selectedConstellationId, selectedRegionId, selectedSystemId, systemNodes]);

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
            {
              id: systemId,
              kind: "system",
              label: `System ${systemId}`,
              regionId: Number.isFinite(regionId) && regionId >= 0 ? regionId : null,
              constellationId: Number.isFinite(constellationId) && constellationId >= 0 ? constellationId : null,
              systemId,
              childCount: 0,
              point: { x: 0, y: 0, z: 0 },
              nodeCount: 0,
              criticalCount: 0,
              warningCount: 0,
              safeCount: 0,
              activeMatchCount: 0
            },
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

  const currentTitle = layer === "overview" ? titleForLevel(overviewLevel) : "Node Scene";
  const currentSubtitle =
    layer === "overview" ? subtitleForLevel(overviewLevel) : `Selected system // ${selectedSystemId ?? "unknown"}`;

  if (!initialized && loadingOverview && overviewPoints.length === 0) {
    return (
      <div className={cn("flex h-full items-center justify-center bg-[#080808] text-[#e0e0e0]", className)}>
        <div className="border border-[#e5b32b]/30 bg-[#080808]/95 px-5 py-4 text-xs uppercase tracking-[0.28em]">
          Booting node cartography...
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative grid h-full w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(229,179,43,0.08),transparent_30%),linear-gradient(rgba(224,224,224,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(224,224,224,0.03)_1px,transparent_1px)] bg-[#080808] bg-[length:100%_100%,16px_16px,16px_16px] text-[#e0e0e0] lg:grid-cols-[320px_minmax(0,1fr)]",
        className
      )}
    >
      <aside className="z-20 border-b border-[#333333] bg-[#080808]/92 p-4 backdrop-blur md:border-r lg:border-b-0">
        <div className="mb-5 border border-[#333333] bg-[#1a1a1a]/92 p-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#e5b32b]">node map // frontier protocol</p>
          <h2 className="mt-2 font-mono text-2xl uppercase tracking-[0.08em]">{currentTitle}</h2>
          <p className="mt-2 text-sm text-[#e0e0e0]/72">{currentSubtitle}</p>
        </div>

        <div className="mb-5 border border-[#333333] bg-[#1a1a1a]/88 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#e5b32b]">navigation</p>
            <button
              type="button"
              onClick={() => void loadOverviewPoints({ forceRefresh: true })}
              className="border border-[#e5b32b]/45 bg-[#080808] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#e5b32b] hover:bg-[#1a1a1a]"
            >
              refresh
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
            {breadcrumbs.map((crumb, index) => (
              <span
                key={`${crumb.label}-${index}`}
                className={cn(
                  "border px-2 py-1",
                  crumb.active ? "border-[#e5b32b] text-[#e5b32b]" : "border-[#333333] text-[#e0e0e0]/65"
                )}
              >
                {crumb.label}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void goBack()}
              className="border border-[#333333] bg-[#080808] px-3 py-2 text-[10px] uppercase tracking-[0.22em] hover:border-[#e5b32b]/55 hover:text-[#e5b32b]"
            >
              back
            </button>
            {layer === "overview" && overviewLevel === "system" ? (
              <button
                type="button"
                onClick={() => toggleRenderMode()}
                className="border border-[#333333] bg-[#080808] px-3 py-2 text-[10px] uppercase tracking-[0.22em] hover:border-[#e5b32b]/55 hover:text-[#e5b32b]"
              >
                {renderMode === "2d" ? "3d inspect" : "2d tactical"}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mb-5 border border-[#333333] bg-[#1a1a1a]/88 p-4">
          <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#e5b32b]">telemetry</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="border border-[#333333] bg-[#080808] p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#e0e0e0]/55">located systems</p>
              <p className="mt-1 font-mono text-xl">{quality.locatedSystems}</p>
            </div>
            <div className="border border-[#333333] bg-[#080808] p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#e0e0e0]/55">unlocated nodes</p>
              <p className="mt-1 font-mono text-xl">{quality.unlocatedNodes}</p>
            </div>
            <div className="border border-[#333333] bg-[#080808] p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#e0e0e0]/55">visible points</p>
              <p className="mt-1 font-mono text-xl">{overviewPoints.length}</p>
            </div>
            <div className="border border-[#333333] bg-[#080808] p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#e0e0e0]/55">scene nodes</p>
              <p className="mt-1 font-mono text-xl">{systemNodes.length}</p>
            </div>
          </div>
        </div>

        <div className="border border-[#333333] bg-[#1a1a1a]/88 p-4">
          <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#e5b32b]">filters</p>
          <div className="space-y-3 text-xs">
            <label className="block">
              <span className="mb-1 block uppercase tracking-[0.18em] text-[#e0e0e0]/55">risk level</span>
              <select
                value={filters.riskLevel ?? "all"}
                onChange={(event) => applyFilters({ riskLevel: event.target.value as "critical" | "warning" | "all" })}
                className="w-full border border-[#333333] bg-[#080808] px-2 py-2 text-sm text-[#e0e0e0]"
              >
                <option value="all">All bands</option>
                <option value="critical">Critical only</option>
                <option value="warning">Warning+</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block uppercase tracking-[0.18em] text-[#e0e0e0]/55">min node count</span>
              <input
                type="number"
                min={0}
                value={filters.minNodeCount ?? 0}
                onChange={(event) => applyFilters({ minNodeCount: Number(event.target.value) || 0 })}
                className="w-full border border-[#333333] bg-[#080808] px-2 py-2 text-sm text-[#e0e0e0]"
              />
            </label>

            <label className="flex items-center gap-2 uppercase tracking-[0.14em] text-[#e0e0e0]/72">
              <input
                type="checkbox"
                checked={Boolean(filters.hasActiveMatch)}
                onChange={(event) => applyFilters({ hasActiveMatch: event.target.checked })}
              />
              active match only
            </label>

            <label className="flex items-center gap-2 uppercase tracking-[0.14em] text-[#e0e0e0]/72">
              <input
                type="checkbox"
                checked={Boolean(filters.showUnknownSystem)}
                onChange={(event) => applyFilters({ showUnknownSystem: event.target.checked })}
              />
              show unknown system access
            </label>
          </div>
        </div>
      </aside>

      <section className="relative min-h-[520px]">
        {error ? (
          <div className="absolute left-4 top-4 z-30 border border-[#cc3300]/55 bg-[#080808]/96 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[#e0e0e0]">
            {error}
          </div>
        ) : null}

        {loadingOverview || loadingSystem ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#080808]/55 backdrop-blur-[2px]">
            <div className="border border-[#e5b32b]/40 bg-[#080808]/96 px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-[#e5b32b]">
              {loadingSystem ? "Loading node scene..." : "Loading overview grid..."}
            </div>
          </div>
        ) : null}

        {layer === "overview" ? (
          renderMode === "3d" && overviewLevel === "system" ? (
            <div className="h-full">
              <Overview3DScene points={overviewPoints} onSelect={(point) => void handleOverviewPointClick(point)} />
            </div>
          ) : (
            <div className="grid h-full grid-rows-[1fr_auto]">
              <div className="relative min-h-[420px] overflow-hidden border-b border-[#333333] bg-[radial-gradient(circle_at_center,rgba(229,179,43,0.06),transparent_42%)]">
                {positionedPoints.map((point) => {
                  const size = Math.max(18, Math.min(68, 16 + point.nodeCount * 1.4));
                  const color = pointColor(point);

                  return (
                    <button
                      key={`${point.kind}-${point.id}`}
                      type="button"
                      onClick={() => void handleOverviewPointClick(point)}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 text-left"
                      style={{ left: `${point.plotLeft}%`, top: `${point.plotTop}%` }}
                    >
                      <span
                        className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 border opacity-45 transition group-hover:opacity-80"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          borderColor: color
                        }}
                      />
                      <span
                        className="block border border-[#080808] shadow-[0_0_0_1px_rgba(229,179,43,0.22)] transition group-hover:scale-110"
                        style={{
                          width: `${Math.max(10, Math.min(20, 8 + point.nodeCount * 0.35))}px`,
                          height: `${Math.max(10, Math.min(20, 8 + point.nodeCount * 0.35))}px`,
                          backgroundColor: color
                        }}
                      />
                      <span className="mt-2 block max-w-[140px] border border-[#333333] bg-[#080808]/95 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#e0e0e0] opacity-0 transition group-hover:opacity-100">
                        {point.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
                {positionedPoints.map((point) => (
                  <button
                    key={`card-${point.kind}-${point.id}`}
                    type="button"
                    onClick={() => void handleOverviewPointClick(point)}
                    className="border border-[#333333] bg-[#1a1a1a]/88 p-4 text-left transition hover:border-[#e5b32b]/55 hover:bg-[#1a1a1a]"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="font-mono text-sm uppercase tracking-[0.08em]">{point.label}</p>
                      <span
                        className="h-3 w-3 border border-[#080808]"
                        style={{ backgroundColor: pointColor(point) }}
                      />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#e0e0e0]/55">
                      {point.kind} // child {point.childCount}
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="border border-[#333333] bg-[#080808] p-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#e0e0e0]/55">nodes</p>
                        <p className="mt-1 font-mono text-lg">{point.nodeCount}</p>
                      </div>
                      <div className="border border-[#333333] bg-[#080808] p-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#e0e0e0]/55">critical</p>
                        <p className="mt-1 font-mono text-lg">{point.criticalCount}</p>
                      </div>
                      <div className="border border-[#333333] bg-[#080808] p-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#e0e0e0]/55">warning</p>
                        <p className="mt-1 font-mono text-lg">{point.warningCount}</p>
                      </div>
                      <div className="border border-[#333333] bg-[#080808] p-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#e0e0e0]/55">matches</p>
                        <p className="mt-1 font-mono text-lg">{point.activeMatchCount}</p>
                      </div>
                    </div>
                  </button>
                ))}

                {unknownSystemPoint ? (
                  <button
                    type="button"
                    onClick={() =>
                      void handleOverviewPointClick({
                        id: 0,
                        kind: "system",
                        label: "Unknown System",
                        regionId: null,
                        constellationId: null,
                        systemId: 0,
                        childCount: 0,
                        point: { x: 0, y: 0, z: 0 },
                        nodeCount: unknownSystemPoint.nodeCount,
                        criticalCount: 0,
                        warningCount: 0,
                        safeCount: 0,
                        activeMatchCount: 0
                      })
                    }
                    className="border border-dashed border-[#e5b32b]/45 bg-[#080808]/92 p-4 text-left hover:bg-[#1a1a1a]"
                  >
                    <p className="font-mono text-sm uppercase tracking-[0.08em]">Unknown System</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#e0e0e0]/65">
                      Access nodes with unresolved coordinates
                    </p>
                    <p className="mt-3 font-mono text-2xl text-[#e5b32b]">{unknownSystemPoint.nodeCount}</p>
                  </button>
                ) : null}
              </div>
            </div>
          )
        ) : (
          <div className="h-full">
            <NodeScene nodes={sceneNodes} onNodeClick={(node) => {
              selectNode(node.id);
              onNodeClick?.(node);
            }} />
            <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2">
              <div className="border border-[#333333] bg-[#080808]/92 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#e0e0e0]/72">
                nodes {sceneNodes.length}
              </div>
              <div className="border border-[#333333] bg-[#080808]/92 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#e0e0e0]/72">
                real coords {sceneNodes.filter((node) => !node.isVirtual).length}
              </div>
              <div className="border border-[#333333] bg-[#080808]/92 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#e0e0e0]/72">
                virtual fallback {sceneNodes.filter((node) => node.isVirtual).length}
              </div>
            </div>
          </div>
        )}
      </section>

      {selectedNode ? (
        <>
          <button
            type="button"
            aria-label="Close node details"
            onClick={() => selectNode(null)}
            className="absolute inset-0 z-30 bg-black/30"
          />
          <aside className="absolute right-0 top-0 z-40 h-full w-full max-w-md overflow-auto border-l border-[#333333] bg-[#080808]/98 p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#e5b32b]">node drawer</p>
                <h3 className="mt-2 font-mono text-xl uppercase tracking-[0.06em]">{selectedNode.name}</h3>
                <p className="mt-1 break-all text-xs text-[#e0e0e0]/55">{selectedNode.objectId}</p>
              </div>
              <button
                type="button"
                onClick={() => selectNode(null)}
                className="border border-[#333333] bg-[#1a1a1a] px-3 py-2 text-[10px] uppercase tracking-[0.22em] hover:border-[#e5b32b]/55 hover:text-[#e5b32b]"
              >
                close
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <section className="border border-[#333333] bg-[#1a1a1a]/88 p-4">
                <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#e5b32b]">location</p>
                <p>System: {selectedNode.solarSystem === 0 ? "Unknown System" : `System ${selectedNode.solarSystem}`}</p>
                <p className="mt-1 text-xs text-[#e0e0e0]/55">
                  ({selectedNode.coordX}, {selectedNode.coordY}, {selectedNode.coordZ})
                </p>
              </section>

              <section className="border border-[#333333] bg-[#1a1a1a]/88 p-4">
                <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#e5b32b]">fuel status</p>
                <div className="mb-3 h-2 overflow-hidden bg-[#080808]">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, selectedNode.fillRatio * 100))}%`,
                      backgroundColor: urgencyColor(selectedNode.urgency)
                    }}
                  />
                </div>
                <p className="font-mono">{selectedNode.fuelQuantity.toLocaleString()} / {selectedNode.fuelMaxCapacity.toLocaleString()}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#e0e0e0]/55">
                  fill {formatPercent(selectedNode.fillRatio)} // {selectedNode.urgency}
                </p>
              </section>

              <section className="border border-[#333333] bg-[#1a1a1a]/88 p-4">
                <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#e5b32b]">energy</p>
                <p>Current: {selectedNode.currentEnergyProduction}</p>
                <p>Max: {selectedNode.maxEnergyProduction}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#e0e0e0]/55">
                  {selectedNode.isOnline ? "online" : "offline"}
                </p>
              </section>

              <section className="border border-[#333333] bg-[#1a1a1a]/88 p-4">
                <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#e5b32b]">connections</p>
                {selectedNode.connectedAssemblyIds.length === 0 ? (
                  <p className="text-xs text-[#e0e0e0]/55">No connected assemblies</p>
                ) : (
                  <ul className="space-y-1 text-xs text-[#e0e0e0]/72">
                    {selectedNode.connectedAssemblyIds.map((id) => (
                      <li key={id} className="break-all border border-[#333333] bg-[#080808] px-2 py-1 font-mono">
                        {id}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="border border-[#333333] bg-[#1a1a1a]/88 p-4">
                <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#e5b32b]">platform state</p>
                <p>Active Match: {selectedNode.activeMatchId ?? "none"}</p>
                <p className="mt-1 text-xs text-[#e0e0e0]/55">Updated: {selectedNode.updatedAt}</p>
              </section>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
