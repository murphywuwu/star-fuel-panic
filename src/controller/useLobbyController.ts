"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { lobbyService } from "@/service/lobbyService";

export function useLobbyController(input: {
  currentSystemId?: number | null;
  currentConstellationId?: number | null;
}) {
  const state = useSyncExternalStore(
    lobbyService.subscribe,
    lobbyService.getSnapshot,
    lobbyService.getSnapshot
  );

  useEffect(() => {
    lobbyService.setContext(input);
    void lobbyService.loadMatches();
  }, [input.currentConstellationId, input.currentSystemId]);

  const visibleMatches = useMemo(
    () => lobbyService.getVisibleMatches(input.currentConstellationId),
    [input.currentConstellationId, state.matches, state.filters.distance]
  );

  const selectedMatch = useMemo(
    () => lobbyService.getSelectedMatch(),
    [state.selectedMatchDetail, state.selectedMatchId]
  );

  const actions = useMemo(
    () => ({
      loadMatches: lobbyService.loadMatches.bind(lobbyService),
      openMatch: lobbyService.openMatch.bind(lobbyService),
      loadRecommendations: lobbyService.loadRecommendations.bind(lobbyService),
      setFilters: lobbyService.setFilters.bind(lobbyService)
    }),
    []
  );

  return {
    filters: state.filters,
    matches: visibleMatches,
    selectedMatch,
    selectedMatchId: state.selectedMatchId,
    loadingMatches: state.loadingMatches,
    loadingDetail: state.loadingDetail,
    loadingRecommendationsFor: state.loadingRecommendationsFor,
    recommendations: state.selectedMatchId ? state.recommendationsByMatch[state.selectedMatchId] ?? [] : [],
    error: state.error,
    actions
  };
}
