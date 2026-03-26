import { lobbyStore, type LobbyDistanceFilter, type LobbyFilters, type LobbyStore } from "@/model/lobbyStore";
import { matchService } from "@/service/matchService";
import { nodeRecommendationService } from "@/service/nodeRecommendationService";
import type { MatchDiscoveryDetail } from "@/types/match";
import type { NodeRecommendation } from "@/types/node";

type LobbyContext = {
  currentSystemId?: number | null;
  currentConstellationId?: number | null;
};

class LobbyService {
  private context: LobbyContext = {};
  private activeLoadMatchesRequest: Promise<void> | null = null;
  private activeLoadMatchesKey: string | null = null;
  private activeRecommendationRequests = new Map<string, Promise<NodeRecommendation[]>>();

  private get store(): typeof lobbyStore {
    return lobbyStore;
  }

  subscribe = (listener: () => void): (() => void) => this.store.subscribe(listener);

  getSnapshot = (): LobbyStore => this.store.getState();

  setContext(context: LobbyContext) {
    this.context = context;
  }

  async loadMatches() {
    const requestKey = this.buildLoadMatchesKey();
    if (this.activeLoadMatchesRequest && this.activeLoadMatchesKey === requestKey) {
      return this.activeLoadMatchesRequest;
    }

    const request = this.loadMatchesInternal();
    this.activeLoadMatchesRequest = request;
    this.activeLoadMatchesKey = requestKey;

    try {
      await request;
    } finally {
      if (this.activeLoadMatchesRequest === request) {
        this.activeLoadMatchesRequest = null;
        this.activeLoadMatchesKey = null;
      }
    }
  }

  private async loadMatchesInternal() {
    const snapshot = this.store.getState();
    snapshot.setLoadingMatches(true);
    snapshot.setError(null);

    try {
      const matches = await matchService.listLobbyMatches({
        status: snapshot.filters.status,
        mode: snapshot.filters.mode,
        currentSystemId: this.context.currentSystemId ?? null,
        limit: 24
      });

      snapshot.setMatches(matches);
      const nextSelectedId = snapshot.selectedMatchId ?? matches[0]?.id ?? null;
      snapshot.setSelectedMatchId(nextSelectedId);

      if (nextSelectedId) {
        const detail = await matchService.getLobbyMatchDetail(
          nextSelectedId,
          this.context.currentSystemId ?? null
        );
        snapshot.setSelectedMatchDetail(detail);
      } else {
        snapshot.setSelectedMatchDetail(null);
      }
    } catch (error) {
      snapshot.setError(error instanceof Error ? error.message : "Failed to load lobby matches");
    } finally {
      snapshot.setLoadingMatches(false);
    }
  }

  async openMatch(matchId: string) {
    const snapshot = this.store.getState();
    snapshot.setSelectedMatchId(matchId);
    snapshot.setLoadingDetail(true);
    snapshot.setError(null);

    try {
      const detail = await matchService.getLobbyMatchDetail(
        matchId,
        this.context.currentSystemId ?? null
      );
      snapshot.setSelectedMatchDetail(detail);
    } catch (error) {
      snapshot.setError(error instanceof Error ? error.message : "Failed to load match detail");
    } finally {
      snapshot.setLoadingDetail(false);
    }
  }

  async loadRecommendations(matchId: string): Promise<NodeRecommendation[]> {
    const currentSystemId = this.context.currentSystemId;
    if (!currentSystemId) {
      this.store.getState().setRecommendations(matchId, []);
      return [];
    }

    const activeRequest = this.activeRecommendationRequests.get(matchId);
    if (activeRequest) {
      return activeRequest;
    }

    const snapshot = this.store.getState();
    snapshot.setLoadingRecommendationsFor(matchId);
    snapshot.setError(null);

    let request: Promise<NodeRecommendation[]>;
    request = nodeRecommendationService
      .getRecommendations({
        currentSystemId,
        maxJumps: 5,
        limit: 6
      })
      .then((recommendations) => {
        snapshot.setRecommendations(matchId, recommendations);
        return recommendations;
      })
      .catch((error) => {
        snapshot.setError(error instanceof Error ? error.message : "Failed to load recommendations");
        snapshot.setRecommendations(matchId, []);
        return [];
      })
      .finally(() => {
        snapshot.setLoadingRecommendationsFor(null);
        if (this.activeRecommendationRequests.get(matchId) === request) {
          this.activeRecommendationRequests.delete(matchId);
        }
      });

    this.activeRecommendationRequests.set(matchId, request);
    return request;
  }

  async setFilters(patch: Partial<LobbyFilters>) {
    this.store.getState().setFilters(patch);
    if (patch.mode !== undefined || patch.status !== undefined) {
      await this.loadMatches();
    }
  }

  getVisibleMatches(currentConstellationId?: number | null) {
    const state = this.store.getState();
    return state.matches.filter((match) =>
      this.matchesDistanceFilter(match, state.filters.distance, currentConstellationId)
    );
  }

  getSelectedMatch(): MatchDiscoveryDetail | null {
    const state = this.store.getState();
    return state.selectedMatchDetail?.match.id === state.selectedMatchId
      ? state.selectedMatchDetail
      : null;
  }

  private sameConstellation(
    match: LobbyStore["matches"][number],
    currentConstellationId?: number | null
  ) {
    return (
      typeof currentConstellationId === "number" &&
      currentConstellationId > 0 &&
      match.targetSolarSystem.constellationId === currentConstellationId
    );
  }

  private matchesDistanceFilter(
    match: LobbyStore["matches"][number],
    distance: LobbyDistanceFilter,
    currentConstellationId?: number | null
  ) {
    if (distance === "all") {
      return true;
    }

    if (distance === "same_system") {
      return match.distanceHops === 0;
    }

    if (distance === "same_constellation") {
      return this.sameConstellation(match, currentConstellationId);
    }

    if (match.distanceHops === null) {
      return false;
    }

    return match.distanceHops <= 2;
  }

  private buildLoadMatchesKey() {
    const { filters } = this.store.getState();
    return JSON.stringify({
      status: filters.status,
      mode: filters.mode,
      currentSystemId: this.context.currentSystemId ?? null
    });
  }
}

export const lobbyService = new LobbyService();
