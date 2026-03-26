import { createStore } from "zustand/vanilla";
import type { MatchDiscoveryDetail, MatchDiscoveryItem, MatchDiscoveryMode } from "@/types/match";
import type { NodeRecommendation } from "@/types/node";

export type LobbyDistanceFilter = "all" | "same_system" | "same_constellation" | "within_2";

export type LobbyFilters = {
  mode: "all" | MatchDiscoveryMode;
  status: "lobby" | "prestart" | "running" | "settled";
  distance: LobbyDistanceFilter;
};

type LobbyState = {
  matches: MatchDiscoveryItem[];
  selectedMatchId: string | null;
  selectedMatchDetail: MatchDiscoveryDetail | null;
  recommendationsByMatch: Record<string, NodeRecommendation[]>;
  loadingMatches: boolean;
  loadingDetail: boolean;
  loadingRecommendationsFor: string | null;
  error: string | null;
  filters: LobbyFilters;
};

type LobbyActions = {
  setMatches: (matches: MatchDiscoveryItem[]) => void;
  setSelectedMatchId: (selectedMatchId: string | null) => void;
  setSelectedMatchDetail: (selectedMatchDetail: MatchDiscoveryDetail | null) => void;
  setRecommendations: (matchId: string, recommendations: NodeRecommendation[]) => void;
  setLoadingMatches: (loadingMatches: boolean) => void;
  setLoadingDetail: (loadingDetail: boolean) => void;
  setLoadingRecommendationsFor: (loadingRecommendationsFor: string | null) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<LobbyFilters>) => void;
  reset: () => void;
};

export type LobbyStore = LobbyState & LobbyActions;

const initialFilters: LobbyFilters = {
  mode: "all",
  status: "lobby",
  distance: "all"
};

const initialState: LobbyState = {
  matches: [],
  selectedMatchId: null,
  selectedMatchDetail: null,
  recommendationsByMatch: {},
  loadingMatches: false,
  loadingDetail: false,
  loadingRecommendationsFor: null,
  error: null,
  filters: initialFilters
};

export const lobbyStore = createStore<LobbyStore>()((set) => ({
  ...initialState,
  setMatches: (matches) =>
    set((state) => ({
      matches,
      selectedMatchId: state.selectedMatchId && matches.some((match) => match.id === state.selectedMatchId) ? state.selectedMatchId : matches[0]?.id ?? null
    })),
  setSelectedMatchId: (selectedMatchId) => set({ selectedMatchId }),
  setSelectedMatchDetail: (selectedMatchDetail) => set({ selectedMatchDetail }),
  setRecommendations: (matchId, recommendations) =>
    set((state) => ({
      recommendationsByMatch: {
        ...state.recommendationsByMatch,
        [matchId]: recommendations
      }
    })),
  setLoadingMatches: (loadingMatches) => set({ loadingMatches }),
  setLoadingDetail: (loadingDetail) => set({ loadingDetail }),
  setLoadingRecommendationsFor: (loadingRecommendationsFor) => set({ loadingRecommendationsFor }),
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters
      }
    })),
  reset: () => set({ ...initialState })
}));
