import { missionStore, selectSelectedMission, sortMissions, type MissionStore } from "@/model/missionStore";
import type { ControllerResult } from "@/types/common";
import type { Mission, MissionFilters, MissionSortBy } from "@/types/mission";

type MissionResponse = {
  missions: Mission[];
};

type MissionRow = {
  id: string;
  assembly_id: string;
  node_name: string;
  fill_ratio: number;
  urgency: Mission["urgency"];
  prize_pool: number;
  entry_fee: number;
  min_teams: number;
  max_teams: number;
  min_players: number;
  registered_teams: number;
  paid_teams: number;
  participating_teams: string[] | null;
  countdown_sec: number | null;
  start_rule_mode: Mission["startRuleMode"];
  force_start_sec: number | null;
  status: Mission["status"];
  created_at: string;
};

const DEFAULT_FILTERS: MissionFilters = {
  sortBy: "weighted",
  status: "open",
  limit: 20
};

const POLL_INTERVAL_MS = 5000;

let realtimeUnsubscribe: (() => void) | null = null;
let realtimeRefCount = 0;

function success<T>(payload: T): ControllerResult<T> {
  return { ok: true, message: "ok", payload };
}

function failure<T>(code: string, message: string): ControllerResult<T> {
  return {
    ok: false,
    message,
    errorCode: code
  };
}

function normalizeFilters(filters?: MissionFilters): MissionFilters {
  return {
    ...DEFAULT_FILTERS,
    ...filters
  };
}

function mapSortToPostgrest(sortBy: MissionSortBy) {
  if (sortBy === "created_at") {
    return "created_at.desc";
  }
  if (sortBy === "prize_pool") {
    return "prize_pool.desc";
  }
  if (sortBy === "urgency") {
    return "urgency.asc,prize_pool.desc";
  }
  return "prize_pool.desc";
}

function mapRowToMission(row: MissionRow): Mission {
  return {
    id: row.id,
    assemblyId: row.assembly_id,
    nodeName: row.node_name,
    fillRatio: row.fill_ratio,
    urgency: row.urgency,
    prizePool: row.prize_pool,
    entryFee: row.entry_fee,
    minTeams: row.min_teams,
    maxTeams: row.max_teams,
    minPlayers: row.min_players,
    registeredTeams: row.registered_teams,
    paidTeams: row.paid_teams,
    participatingTeams: row.participating_teams ?? [],
    countdownSec: row.countdown_sec,
    startRuleMode: row.start_rule_mode,
    forceStartSec: row.force_start_sec ?? 180,
    status: row.status,
    createdAt: row.created_at
  };
}

function missionFingerprint(mission: Mission) {
  return [
    mission.id,
    mission.prizePool,
    mission.entryFee,
    mission.registeredTeams,
    mission.paidTeams,
    mission.countdownSec,
    mission.status
  ].join("|");
}

async function fetchFromSupabase(filters: MissionFilters): Promise<Mission[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!baseUrl || !anonKey) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  const url = new URL(`${baseUrl.replace(/\/$/, "")}/rest/v1/missions`);
  url.searchParams.set(
    "select",
    [
      "id",
      "assembly_id",
      "node_name",
      "fill_ratio",
      "urgency",
      "prize_pool",
      "entry_fee",
      "min_teams",
      "max_teams",
      "min_players",
      "registered_teams",
      "paid_teams",
      "participating_teams",
      "countdown_sec",
      "start_rule_mode",
      "force_start_sec",
      "status",
      "created_at"
    ].join(",")
  );

  if (filters.status) {
    url.searchParams.set("status", `eq.${filters.status}`);
  }
  if (filters.urgency) {
    url.searchParams.set("urgency", `eq.${filters.urgency}`);
  }
  if (filters.limit) {
    url.searchParams.set("limit", String(filters.limit));
  }
  url.searchParams.set("order", mapSortToPostgrest(filters.sortBy ?? "weighted"));

  const response = await fetch(url.toString(), {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`SUPABASE_FETCH_FAILED_${response.status}`);
  }

  const rows = (await response.json()) as MissionRow[];
  return rows.map(mapRowToMission);
}

async function fetchFromLocalApi(filters: MissionFilters): Promise<Mission[]> {
  const params = new URLSearchParams();
  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy);
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.urgency) {
    params.set("urgency", filters.urgency);
  }
  if (filters.limit) {
    params.set("limit", String(filters.limit));
  }

  const response = await fetch(`/api/missions?${params.toString()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`LOCAL_API_FETCH_FAILED_${response.status}`);
  }

  const data = (await response.json()) as MissionResponse;
  return data.missions;
}

export const missionService = {
  subscribe(listener: () => void) {
    return missionStore.subscribe(listener);
  },

  getSnapshot(): MissionStore {
    return missionStore.getState();
  },

  getSelectedMission() {
    return selectSelectedMission(missionStore.getState());
  },

  getSortedMissions(sortBy: MissionSortBy = "weighted") {
    return sortMissions(missionStore.getState().missions, sortBy);
  },

  selectMission(missionId: string) {
    missionStore.getState().selectMission(missionId);
  },

  async fetchMissions(filters?: MissionFilters): Promise<Mission[]> {
    const normalized = normalizeFilters(filters);
    try {
      const missions = await fetchFromSupabase(normalized);
      return sortMissions(missions, normalized.sortBy ?? "weighted");
    } catch {
      const missions = await fetchFromLocalApi(normalized);
      return sortMissions(missions, normalized.sortBy ?? "weighted");
    }
  },

  async loadMissions(filters?: MissionFilters): Promise<ControllerResult<void>> {
    const normalized = normalizeFilters(filters);
    missionStore.getState().setLoading(true);

    try {
      const missions = await this.fetchMissions(normalized);
      missionStore.getState().setMissions(missions);
      return success(undefined);
    } catch (error) {
      return failure("NETWORK_ERROR", error instanceof Error ? error.message : "load missions failed");
    } finally {
      missionStore.getState().setLoading(false);
    }
  },

  subscribeMissionUpdates(callback: (mission: Mission) => void, filters?: MissionFilters): () => void {
    const normalized = normalizeFilters(filters);
    let active = true;
    const prev = new Map<string, string>();

    const poll = async () => {
      if (!active) {
        return;
      }

      try {
        const missions = await this.fetchMissions(normalized);
        for (const mission of missions) {
          const nextFingerprint = missionFingerprint(mission);
          const lastFingerprint = prev.get(mission.id);
          if (lastFingerprint !== nextFingerprint) {
            prev.set(mission.id, nextFingerprint);
            callback(mission);
          }
        }
      } catch {
        // Realtime polling failures should not interrupt UI interaction.
      }
    };

    void poll();
    const timer = globalThis.setInterval(() => {
      void poll();
    }, POLL_INTERVAL_MS);

    return () => {
      active = false;
      globalThis.clearInterval(timer);
    };
  },

  startRealtimeSync(filters?: MissionFilters): () => void {
    realtimeRefCount += 1;

    if (!realtimeUnsubscribe) {
      realtimeUnsubscribe = this.subscribeMissionUpdates(
        (mission) => missionStore.getState().upsertMission(mission),
        filters
      );
    }

    return () => {
      realtimeRefCount -= 1;
      if (realtimeRefCount <= 0 && realtimeUnsubscribe) {
        realtimeUnsubscribe();
        realtimeUnsubscribe = null;
        realtimeRefCount = 0;
      }
    };
  }
};
