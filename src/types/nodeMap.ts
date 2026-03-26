import type { NetworkNode } from "./node.ts";
import type { SolarSystemMapLevel, SolarSystemMapPoint } from "./solarSystem.ts";

export type NodeMapLayer = "overview" | "system" | "node";
export type NodeMapRenderMode = "2d" | "3d";

export type NodeMapFilters = {
  riskLevel?: "critical" | "warning" | "all";
  minNodeCount?: number;
  hasActiveMatch?: boolean;
  showUnknownSystem?: boolean;
};

export type SystemAggregation = {
  systemId: number;
  systemName: string;
  nodeCount: number;
  criticalCount: number;
  warningCount: number;
  safeCount: number;
  avgFillRatio: number;
  activeMatchCount: number;
};

export type NodeLocationQuality = {
  totalNodes: number;
  locatedNodes: number;
  unlocatedNodes: number;
  locatedSystems: number;
};

export type NodeMapOverviewResponse = {
  level: SolarSystemMapLevel;
  points: SolarSystemMapPoint[];
  quality: NodeLocationQuality;
  nextCursor: string | null;
};

export type NodeMapState = {
  layer: NodeMapLayer;
  renderMode: NodeMapRenderMode;
  overviewLevel: SolarSystemMapLevel;
  selectedRegionId: number | null;
  selectedConstellationId: number | null;
  selectedSystemId: number | null;
  selectedNodeId: string | null;
  overviewPoints: SolarSystemMapPoint[];
  systemNodes: NetworkNode[];
  quality: NodeLocationQuality;
  filters: NodeMapFilters;
  loadingOverview: boolean;
  loadingSystem: boolean;
  loadingNode: boolean;
  error: string | null;
  nextCursor: string | null;
};
