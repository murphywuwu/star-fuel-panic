import type {
  ConstellationSummary,
  RegionSummary,
  SearchHit,
  SolarSystemRecommendation,
  SolarSystemSummary
} from "./solarSystem.ts";

export type UserLocation = {
  regionId: number;
  constellationId: number;
  systemId: number;
  regionName?: string;
  constellationName?: string;
  systemName?: string;
  updatedAt: string;
};

export type LocationSelectionOptions = {
  regionId?: number;
  constellationId?: number;
  systemId?: number;
  regionName?: string;
  constellationName?: string;
  systemName?: string;
};

export type LocationPickerState = {
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
};
