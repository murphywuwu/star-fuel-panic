"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { locationService } from "@/service/locationService";
import type { ControllerResult } from "@/types/common";
import type { SearchHit, SolarSystemSummary } from "@/types/solarSystem";
import type { UserLocation } from "@/types/location";

export function useLocationController() {
  const state = useSyncExternalStore(
    locationService.subscribe,
    locationService.getSnapshot,
    locationService.getSnapshot
  );

  useEffect(() => {
    locationService.hydrateFromStorage();
  }, []);

  const setLocation = useCallback((system: SolarSystemSummary): ControllerResult<UserLocation> => {
    return locationService.setLocation(system);
  }, []);

  const clearLocation = useCallback((): ControllerResult<void> => {
    return locationService.clearLocation();
  }, []);

  const loadConstellationSystems = useCallback(async (constellationId: number) => {
    return locationService.loadConstellationSystems(constellationId);
  }, []);

  const loadRegionConstellations = useCallback(async (regionId: number) => {
    return locationService.loadRegionConstellations(regionId);
  }, []);

  const search = useCallback(async (query: string): Promise<ControllerResult<SearchHit[]>> => {
    return locationService.search(query);
  }, []);

  const selectSystemById = useCallback(async (systemId: number): Promise<ControllerResult<UserLocation>> => {
    return locationService.selectSystemById(systemId);
  }, []);

  const loadPickerBootstrap = useCallback(async (): Promise<ControllerResult<void>> => {
    return locationService.loadPickerBootstrap();
  }, []);

  return {
    location: state.current,
    regions: state.regions,
    constellationsByRegion: state.constellationsByRegion,
    systemsByConstellation: state.systemsByConstellation,
    recommendedSystems: state.recommendedSystems,
    searchHits: state.searchHits,
    loadingBootstrap: state.loadingBootstrap,
    loadingConstellationsForRegion: state.loadingConstellationsForRegion,
    loadingSystems: state.loadingSystems,
    searching: state.searching,
    loading: state.loading,
    hydrated: state.hydrated,
    error: state.error,
    setLocation,
    clearLocation,
    loadPickerBootstrap,
    loadRegionConstellations,
    loadConstellationSystems,
    search,
    selectSystemById
  };
}
