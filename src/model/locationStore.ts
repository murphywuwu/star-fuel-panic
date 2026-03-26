import { createStore } from "zustand/vanilla";
import type { LocationPickerState, UserLocation } from "../types/location.ts";
import type {
  ConstellationSummary,
  RegionSummary,
  SearchHit,
  SolarSystemRecommendation,
  SolarSystemSummary
} from "../types/solarSystem.ts";

type LocationState = {
  current: UserLocation | null;
  regions: RegionSummary[];
  constellationsByRegion: Record<number, ConstellationSummary[]>;
  systemsByConstellation: Record<number, SolarSystemSummary[]>;
  recommendedSystems: SolarSystemRecommendation[];
  searchHits: SearchHit[];
  loadingBootstrap: boolean;
  loadingConstellationsForRegion: number | null;
  loadingSystems: boolean;
  searching: boolean;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
};

type LocationActions = {
  setLocation: (location: UserLocation) => void;
  setRegions: (regions: RegionSummary[]) => void;
  setConstellationsForRegion: (regionId: number, constellations: ConstellationSummary[]) => void;
  setRecommendedSystems: (recommendedSystems: SolarSystemRecommendation[]) => void;
  setSearchHits: (searchHits: SearchHit[]) => void;
  setSystemsForConstellation: (constellationId: number, systems: SolarSystemSummary[]) => void;
  setHydrated: (hydrated: boolean) => void;
  setLoadingBootstrap: (loadingBootstrap: boolean) => void;
  setLoadingConstellationsForRegion: (regionId: number | null) => void;
  setLoadingSystems: (loadingSystems: boolean) => void;
  setSearching: (searching: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export type LocationStore = LocationState & LocationActions;

const initialState: LocationState = {
  current: null,
  regions: [],
  constellationsByRegion: {},
  systemsByConstellation: {},
  recommendedSystems: [],
  searchHits: [],
  loadingBootstrap: false,
  loadingConstellationsForRegion: null,
  loadingSystems: false,
  searching: false,
  hydrated: false,
  loading: false,
  error: null
};

export const locationStore = createStore<LocationStore>()((set) => ({
  ...initialState,
  setLocation: (current) => set({ current, error: null }),
  setRegions: (regions) => set({ regions }),
  setConstellationsForRegion: (regionId, constellations) =>
    set((state) => ({
      constellationsByRegion: {
        ...state.constellationsByRegion,
        [regionId]: constellations
      }
    })),
  setRecommendedSystems: (recommendedSystems) => set({ recommendedSystems }),
  setSearchHits: (searchHits) => set({ searchHits }),
  setSystemsForConstellation: (constellationId, systems) =>
    set((state) => ({
      systemsByConstellation: {
        ...state.systemsByConstellation,
        [constellationId]: systems
      }
    })),
  setHydrated: (hydrated) => set({ hydrated }),
  setLoadingBootstrap: (loadingBootstrap) => set({ loadingBootstrap }),
  setLoadingConstellationsForRegion: (loadingConstellationsForRegion) => set({ loadingConstellationsForRegion }),
  setLoadingSystems: (loadingSystems) => set({ loadingSystems }),
  setSearching: (searching) => set({ searching }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () =>
    set((state) => ({
      ...initialState,
      regions: state.regions,
      constellationsByRegion: state.constellationsByRegion,
      systemsByConstellation: state.systemsByConstellation,
      recommendedSystems: state.recommendedSystems,
      hydrated: true
    }))
}));

export function selectLocationPickerState(state: LocationState): LocationPickerState {
  return {
    regions: state.regions,
    constellationsByRegion: state.constellationsByRegion,
    systemsByConstellation: state.systemsByConstellation,
    recommendedSystems: state.recommendedSystems,
    searchHits: state.searchHits,
    loadingBootstrap: state.loadingBootstrap,
    loadingConstellationsForRegion: state.loadingConstellationsForRegion,
    loadingSystems: state.loadingSystems,
    searching: state.searching,
    hydrated: state.hydrated
  };
}
