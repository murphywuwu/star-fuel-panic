import { locationStore, selectLocationPickerState } from "../model/locationStore.ts";
import type { ControllerResult } from "../types/common.ts";
import type { LocationPickerState, LocationSelectionOptions, UserLocation } from "../types/location.ts";
import type {
  ConstellationSummary,
  RegionSummary,
  SearchHit,
  SolarSystemDetail,
  SolarSystemRecommendation,
  SolarSystemSummary
} from "../types/solarSystem.ts";

const LOCATION_STORAGE_KEY = "fuel-frog-panic.location";
let pickerBootstrapRequest: Promise<ControllerResult<void>> | null = null;

function success<T>(payload: T): ControllerResult<T> {
  return { ok: true, message: "ok", payload };
}

function failure<T>(message: string): ControllerResult<T> {
  return { ok: false, message, errorCode: "INVALID_INPUT" };
}

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(raw: unknown): T | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  return raw as T;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as
    | T
    | {
        ok?: false;
        error?: {
          message?: string;
        };
      };

  if (!response.ok || (typeof payload === "object" && payload !== null && "ok" in payload && payload.ok === false)) {
    const errorMessage =
      typeof payload === "object" && payload !== null && "error" in payload ? payload.error?.message ?? "Request failed" : "Request failed";
    throw new Error(errorMessage);
  }

  return payload as T;
}

function normalizeConstellationName(constellationId: number, constellationName?: string) {
  return constellationName?.trim() || `Constellation ${constellationId}`;
}

function mapSystemSummaryFromDetail(system: SolarSystemDetail): SolarSystemSummary {
  return {
    ...system,
    constellationName: normalizeConstellationName(system.constellationId),
    nodeCount: 0,
    urgentNodeCount: 0,
    warningNodeCount: 0,
    selectableState: "selectable"
  };
}

function persistLocation(location: UserLocation | null) {
  if (!isBrowser()) {
    return;
  }

  if (!location) {
    window.localStorage.removeItem(LOCATION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
}

function readPersistedLocation() {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as UserLocation;
    if (
      typeof parsed?.regionId === "number" &&
      typeof parsed?.constellationId === "number" &&
      typeof parsed?.systemId === "number" &&
      typeof parsed?.updatedAt === "string"
    ) {
      return parsed;
    }
  } catch {
    window.localStorage.removeItem(LOCATION_STORAGE_KEY);
  }

  return null;
}

export const locationService = {
  subscribe(listener: () => void) {
    return locationStore.subscribe(listener);
  },

  getSnapshot() {
    return locationStore.getState();
  },

  getPickerState(): LocationPickerState {
    return selectLocationPickerState(locationStore.getState());
  },

  hydrateFromStorage(): ControllerResult<UserLocation | null> {
    const state = locationStore.getState();
    if (state.hydrated) {
      return success(state.current);
    }

    const persisted = readPersistedLocation();
    if (persisted) {
      state.setLocation(persisted);
    }
    state.setHydrated(true);
    return success(persisted);
  },

  async loadPickerBootstrap(): Promise<ControllerResult<void>> {
    const state = locationStore.getState();
    if (state.regions.length > 0 && state.recommendedSystems.length > 0) {
      return success(undefined);
    }

    if (pickerBootstrapRequest) {
      return pickerBootstrapRequest;
    }

    pickerBootstrapRequest = (async () => {
      state.setLoadingBootstrap(true);
      state.setError(null);

      try {
        const [regionPayload, recommendationPayload] = await Promise.all([
          parseResponse<{ regions: RegionSummary[] }>(await fetch("/api/constellations?view=regions", { cache: "no-store" })),
          parseResponse<{ recommendations: SolarSystemRecommendation[] }>(
            await fetch("/api/solar-systems/recommendations", { cache: "no-store" })
          )
        ]);

        state.setRegions(regionPayload.regions);
        state.setRecommendedSystems(recommendationPayload.recommendations);
        return success(undefined);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load location picker";
        state.setError(message);
        return failure(message);
      } finally {
        state.setLoadingBootstrap(false);
        pickerBootstrapRequest = null;
      }
    })();

    return pickerBootstrapRequest;
  },

  async loadRegionConstellations(regionId: number): Promise<ControllerResult<ConstellationSummary[]>> {
    const state = locationStore.getState();
    const cached = state.constellationsByRegion[regionId];
    if (cached) {
      return success(cached);
    }

    state.setLoadingConstellationsForRegion(regionId);
    state.setError(null);

    try {
      const payload = await parseResponse<{
        constellations: ConstellationSummary[];
      }>(await fetch(`/api/constellations?regionId=${regionId}`, { cache: "no-store" }));

      state.setConstellationsForRegion(regionId, payload.constellations);
      return success(payload.constellations);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load constellations";
      state.setError(message);
      return failure(message);
    } finally {
      state.setLoadingConstellationsForRegion(null);
    }
  },

  async loadConstellationSystems(constellationId: number): Promise<ControllerResult<SolarSystemSummary[]>> {
    const state = locationStore.getState();
    const cached = state.systemsByConstellation[constellationId];
    if (cached) {
      return success(cached);
    }

    state.setLoadingSystems(true);
    state.setError(null);

    try {
      const payload = await parseResponse<{
        constellation: ConstellationSummary;
        systems: SolarSystemSummary[];
      }>(await fetch(`/api/constellations/${constellationId}`, { cache: "no-store" }));

      state.setSystemsForConstellation(constellationId, payload.systems);
      return success(payload.systems);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load constellation systems";
      state.setError(message);
      return failure(message);
    } finally {
      state.setLoadingSystems(false);
    }
  },

  async search(query: string): Promise<ControllerResult<SearchHit[]>> {
    const state = locationStore.getState();
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      state.setSearchHits([]);
      return success([]);
    }

    state.setSearching(true);
    state.setError(null);

    try {
      const payload = await parseResponse<{ hits: SearchHit[] }>(
        await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { cache: "no-store" })
      );

      state.setSearchHits(payload.hits);
      return success(payload.hits);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to search systems";
      state.setError(message);
      return failure(message);
    } finally {
      state.setSearching(false);
    }
  },

  async selectSystemById(systemId: number): Promise<ControllerResult<UserLocation>> {
    const state = locationStore.getState();
    state.setLoading(true);
    state.setError(null);

    try {
      const payload = await parseResponse<{ system: SolarSystemDetail }>(
        await fetch(`/api/solar-systems/${systemId}`, { cache: "no-store" })
      );
      const summary =
        readJson<SolarSystemSummary>(
          Object.values(state.systemsByConstellation)
            .flat()
            .find((candidate) => candidate.systemId === systemId)
        ) ?? mapSystemSummaryFromDetail(payload.system);

      return this.setLocation(summary);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to resolve solar system";
      state.setError(message);
      return failure(message);
    } finally {
      state.setLoading(false);
    }
  },

  setLocation(input: LocationSelectionOptions | SolarSystemSummary): ControllerResult<UserLocation> {
    if (
      !Number.isFinite(input.regionId) ||
      !Number.isFinite(input.constellationId) ||
      !Number.isFinite(input.systemId)
    ) {
      return failure("regionId / constellationId / systemId are required");
    }

    const regionId = Number(input.regionId);
    const constellationId = Number(input.constellationId);
    const systemId = Number(input.systemId);
    const regionName = "regionName" in input ? input.regionName : undefined;
    const systemName = "systemName" in input ? input.systemName : undefined;
    const constellationName = "constellationName" in input ? input.constellationName : undefined;

    const next: UserLocation = {
      regionId,
      constellationId,
      systemId,
      regionName,
      constellationName: constellationName ?? normalizeConstellationName(constellationId),
      systemName,
      updatedAt: new Date().toISOString()
    };

    locationStore.getState().setLocation(next);
    persistLocation(next);
    return success(next);
  },

  clearLocation(): ControllerResult<void> {
    persistLocation(null);
    locationStore.getState().reset();
    return success(undefined);
  }
};
