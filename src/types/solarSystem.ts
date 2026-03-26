export type RawPoint3D = {
  x: string;
  y: string;
  z: string;
};

export type PlotPoint3D = {
  x: number;
  y: number;
  z: number;
};

export type SolarSystem = {
  systemId: number;
  systemName: string;
  constellationId: number;
  regionId: number;
  location: RawPoint3D;
  updatedAt: string;
};

export type SolarSystemGateLink = {
  id: number;
  name: string;
  location: RawPoint3D;
  destination: {
    systemId: number;
    systemName: string;
    constellationId: number;
    regionId: number;
    location: RawPoint3D;
  };
};

export type SolarSystemDetail = SolarSystem & {
  gateLinks: SolarSystemGateLink[];
};

export type SelectableState = "selectable" | "no_nodes" | "offline_only" | "not_public";

export type ConstellationSummary = {
  constellationId: number;
  constellationName: string;
  regionId: number;
  systemCount: number;
  selectableSystemCount: number;
  urgentNodeCount: number;
  warningNodeCount: number;
  sortScore: number;
};

export type RegionSummary = {
  regionId: number;
  constellationCount: number;
  selectableSystemCount: number;
  urgentNodeCount: number;
  warningNodeCount: number;
  sortScore: number;
};

export type SolarSystemSummary = SolarSystem & {
  constellationName: string;
  nodeCount: number;
  urgentNodeCount: number;
  warningNodeCount: number;
  selectableState: SelectableState;
};

export type SolarSystemRecommendation = {
  system: SolarSystemSummary;
  topUrgency: "critical" | "warning" | "safe";
  summary: string;
};

export type SearchHit = {
  type: "constellation" | "system";
  id: number;
  label: string;
  regionId?: number;
  constellationId?: number;
  constellationName?: string;
  selectableState?: SelectableState;
};

export type SolarSystemFilters = {
  systemId?: number;
  namePattern?: string;
  limit?: number;
  offset?: number;
};

export type SolarSystemStats = {
  totalSystems: number;
  returnedSystems: number;
  pageSize: number;
  offset: number;
};

export type SolarSystemMapLevel = "region" | "constellation" | "system";

export type SolarSystemMapPoint = {
  id: number;
  kind: SolarSystemMapLevel;
  label: string;
  regionId: number | null;
  constellationId: number | null;
  systemId: number | null;
  childCount: number;
  point: PlotPoint3D;
  nodeCount: number;
  criticalCount: number;
  warningCount: number;
  safeCount: number;
  activeMatchCount: number;
};
