import { createStore } from "zustand/vanilla";
import type { NetworkNode } from "@/types/node";
import type {
  NodeLocationQuality,
  NodeMapFilters,
  NodeMapLayer,
  NodeMapRenderMode,
  NodeMapState
} from "@/types/nodeMap";
import type { SolarSystemMapLevel, SolarSystemMapPoint } from "@/types/solarSystem";

type NodeMapActions = {
  setError: (message: string | null) => void;
  setFilters: (filters: Partial<NodeMapFilters>) => void;
  setLayer: (layer: NodeMapLayer) => void;
  setLoadingNode: (loading: boolean) => void;
  setLoadingOverview: (loading: boolean) => void;
  setLoadingSystem: (loading: boolean) => void;
  setNextCursor: (cursor: string | null) => void;
  setOverviewLevel: (level: SolarSystemMapLevel) => void;
  setOverviewPoints: (points: SolarSystemMapPoint[]) => void;
  setQuality: (quality: NodeLocationQuality) => void;
  setRenderMode: (mode: NodeMapRenderMode) => void;
  setSelectedConstellation: (constellationId: number | null) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedRegion: (regionId: number | null) => void;
  setSelectedSystem: (systemId: number | null) => void;
  setSystemNodes: (nodes: NetworkNode[]) => void;
  reset: () => void;
};

export type NodeMapStore = NodeMapState & NodeMapActions;

const initialQuality: NodeLocationQuality = {
  totalNodes: 0,
  locatedNodes: 0,
  unlocatedNodes: 0,
  locatedSystems: 0
};

const initialFilters: NodeMapFilters = {
  riskLevel: "all",
  minNodeCount: 0,
  hasActiveMatch: false,
  showUnknownSystem: false
};

const initialState: NodeMapState = {
  layer: "overview",
  renderMode: "2d",
  overviewLevel: "region",
  selectedRegionId: null,
  selectedConstellationId: null,
  selectedSystemId: null,
  selectedNodeId: null,
  overviewPoints: [],
  systemNodes: [],
  quality: initialQuality,
  filters: initialFilters,
  loadingOverview: false,
  loadingSystem: false,
  loadingNode: false,
  error: null,
  nextCursor: null
};

export const nodeMapStore = createStore<NodeMapStore>()((set) => ({
  ...initialState,
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters
      }
    })),
  setLayer: (layer) => set({ layer }),
  setLoadingNode: (loadingNode) => set({ loadingNode }),
  setLoadingOverview: (loadingOverview) => set({ loadingOverview }),
  setLoadingSystem: (loadingSystem) => set({ loadingSystem }),
  setNextCursor: (nextCursor) => set({ nextCursor }),
  setOverviewLevel: (overviewLevel) => set({ overviewLevel }),
  setOverviewPoints: (overviewPoints) => set({ overviewPoints }),
  setQuality: (quality) => set({ quality }),
  setRenderMode: (renderMode) => set({ renderMode }),
  setSelectedConstellation: (selectedConstellationId) => set({ selectedConstellationId }),
  setSelectedNode: (selectedNodeId) => set({ selectedNodeId }),
  setSelectedRegion: (selectedRegionId) => set({ selectedRegionId }),
  setSelectedSystem: (selectedSystemId) => set({ selectedSystemId }),
  setSystemNodes: (systemNodes) => set({ systemNodes }),
  reset: () => set({ ...initialState })
}));
