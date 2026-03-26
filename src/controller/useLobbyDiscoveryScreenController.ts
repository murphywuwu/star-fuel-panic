"use client";

import { useEffect, useMemo, useState } from "react";
import { useLobbyController } from "@/controller/useLobbyController";
import { useLocationController } from "@/controller/useLocationController";
import type { ConstellationSummary, RegionSummary, SearchHit, SolarSystemSummary } from "@/types/solarSystem";

function sortConstellations(constellations: ConstellationSummary[]) {
  return [...constellations].sort(
    (left, right) => right.sortScore - left.sortScore || left.constellationId - right.constellationId
  );
}

export function useLobbyDiscoveryScreenController() {
  const location = useLocationController();
  const lobby = useLobbyController({
    currentSystemId: location.location?.systemId ?? null,
    currentConstellationId: location.location?.constellationId ?? null
  });
  const selectedMatch = lobby.selectedMatch;

  const [createMatchOpen, setCreateMatchOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expandedRegionId, setExpandedRegionId] = useState<number | null>(null);
  const [expandedConstellationId, setExpandedConstellationId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const selectedMatchId = selectedMatch?.match.id;
    if (!selectedMatchId || selectedMatch.match.mode !== "free" || !location.location) {
      return;
    }

    if (lobby.recommendations.length > 0 || lobby.loadingRecommendationsFor === selectedMatchId) {
      return;
    }

    void lobby.actions.loadRecommendations(selectedMatchId);
  }, [
    lobby.actions,
    lobby.loadingRecommendationsFor,
    lobby.recommendations.length,
    location.location,
    selectedMatch
  ]);

  useEffect(() => {
    if (!pickerOpen) {
      return;
    }

    if (
      location.loadingBootstrap ||
      (location.regions.length > 0 && location.recommendedSystems.length > 0)
    ) {
      return;
    }

    void location.loadPickerBootstrap();
  }, [
    location.loadingBootstrap,
    location.regions.length,
    location.recommendedSystems.length,
    location.loadPickerBootstrap,
    pickerOpen
  ]);

  const regionSummaries = useMemo(
    () => [...location.regions].sort((left, right) => right.sortScore - left.sortScore || left.regionId - right.regionId),
    [location.regions]
  );

  const handleSystemSelect = async (system: SolarSystemSummary) => {
    location.setLocation(system);
    setPickerOpen(false);
  };

  const handleSearchChange = async (nextValue: string) => {
    setSearchQuery(nextValue);
    await location.search(nextValue);
  };

  const handleSearchSelect = async (hit: SearchHit) => {
    if (hit.type === "system") {
      await location.selectSystemById(hit.id);
      setPickerOpen(false);
      return;
    }

    if (typeof hit.regionId === "number") {
      setExpandedRegionId(hit.regionId);
      await location.loadRegionConstellations(hit.regionId);
    }
    setExpandedConstellationId(hit.id);
    await location.loadConstellationSystems(hit.id);
  };

  const toggleRegion = async (region: RegionSummary) => {
    if (expandedRegionId === region.regionId) {
      setExpandedRegionId(null);
      setExpandedConstellationId(null);
      return;
    }

    setExpandedRegionId(region.regionId);
    await location.loadRegionConstellations(region.regionId);
  };

  const toggleConstellation = async (constellationId: number) => {
    if (expandedConstellationId === constellationId) {
      setExpandedConstellationId(null);
      return;
    }

    setExpandedConstellationId(constellationId);
    await location.loadConstellationSystems(constellationId);
  };

  const handleMatchPublished = async (matchId: string) => {
    setCreateMatchOpen(false);
    await lobby.actions.loadMatches();
    await lobby.actions.openMatch(matchId);
  };

  return {
    location,
    lobby,
    selectedMatch,
    ui: {
      createMatchOpen,
      pickerOpen,
      expandedRegionId,
      expandedConstellationId,
      searchQuery,
      regionSummaries,
      sortConstellations
    },
    actions: {
      openCreateMatch: () => setCreateMatchOpen(true),
      closeCreateMatch: () => setCreateMatchOpen(false),
      openPicker: () => setPickerOpen(true),
      closePicker: () => setPickerOpen(false),
      clearLocation: () => location.clearLocation(),
      handleSystemSelect,
      handleSearchChange,
      handleSearchSelect,
      toggleRegion,
      toggleConstellation,
      handleMatchPublished
    }
  };
}
