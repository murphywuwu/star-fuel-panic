"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthController } from "@/controller/useAuthController";
import { useLobbyController } from "@/controller/useLobbyController";
import { useLocationController } from "@/controller/useLocationController";
import { useTeamDossierController } from "@/controller/useTeamDossierController";
import type { MatchDiscoveryItem } from "@/types/match";
import type { ActiveTeamDeployment } from "@/types/player";
import type { ConstellationSummary, RegionSummary, SearchHit, SolarSystemSummary } from "@/types/solarSystem";

type LobbyJoinCta = {
  href: string;
  label: string;
  disabled: boolean;
  blocker: string | null;
};

function sortConstellations(constellations: ConstellationSummary[]) {
  return [...constellations].sort(
    (left, right) => right.sortScore - left.sortScore || left.constellationId - right.constellationId
  );
}

function buildPlanningHref(matchId: string) {
  return `/planning?matchId=${encodeURIComponent(matchId)}`;
}

function buildJoinBlocker(input: {
  match: MatchDiscoveryItem;
  isWalletConnected: boolean;
  dossierLoading: boolean;
  dossierError: string | null;
  currentDeployment: ActiveTeamDeployment | null;
}) {
  if (!input.isWalletConnected) {
    return "Connect wallet before joining";
  }

  if (input.dossierLoading) {
    return "Syncing current squad status";
  }

  if (input.dossierError) {
    return "Unable to verify current squad status";
  }

  if (input.match.status !== "lobby" && input.match.status !== "prestart") {
    return "Match is not accepting squads right now";
  }

  if (!input.currentDeployment) {
    return "Create or join a squad in Team Registry first";
  }

  if (input.currentDeployment.match.matchId !== input.match.id) {
    return "Current squad is assigned to another match";
  }

  if (input.currentDeployment.team.memberCount < input.currentDeployment.team.maxSize) {
    return `Current squad is incomplete (${input.currentDeployment.team.memberCount}/${input.currentDeployment.team.maxSize} pilots)`;
  }

  return null;
}

export function useLobbyDiscoveryScreenController() {
  const auth = useAuthController();
  const teamDossier = useTeamDossierController();
  const location = useLocationController();
  const lobby = useLobbyController({
    currentSystemId: location.location?.systemId ?? null,
    currentConstellationId: location.location?.constellationId ?? null
  });
  const selectedMatch = lobby.selectedMatch;

  const [createMatchOpen, setCreateMatchOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
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
    if (!auth.state.isConnected || !auth.state.walletAddress) {
      teamDossier.actions.clear();
      return;
    }

    void teamDossier.actions.load(auth.state.walletAddress);
  }, [auth.state.isConnected, auth.state.walletAddress, teamDossier.actions]);

  useEffect(() => {
    if (!detailOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDetailOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [detailOpen]);

  useEffect(() => {
    if (detailOpen && !lobby.selectedMatchId) {
      setDetailOpen(false);
    }
  }, [detailOpen, lobby.selectedMatchId]);

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
  const currentDeployment = teamDossier.selectors.currentDeployment;

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

  const openMatchDetail = async (matchId: string) => {
    setDetailOpen(true);
    await lobby.actions.openMatch(matchId);
  };

  return {
    location,
    lobby,
    selectedMatch,
    ui: {
      createMatchOpen,
      pickerOpen,
      detailOpen,
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
      openMatchDetail,
      closeMatchDetail: () => setDetailOpen(false),
      clearLocation: () => location.clearLocation(),
      handleSystemSelect,
      handleSearchChange,
      handleSearchSelect,
      toggleRegion,
      toggleConstellation,
      handleMatchPublished
    },
    helpers: {
      getJoinCta: (match: MatchDiscoveryItem): LobbyJoinCta => {
        const blocker = buildJoinBlocker({
          match,
          isWalletConnected: auth.state.isConnected,
          dossierLoading: teamDossier.state.isLoading,
          dossierError: teamDossier.state.error,
          currentDeployment
        });

        return {
          href: buildPlanningHref(match.id),
          label: "JOIN MATCH",
          disabled: Boolean(blocker),
          blocker
        };
      }
    }
  };
}
