"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { missionService } from "@/service/missionService";
import type { ControllerResult } from "@/types/common";
import type { MissionFilters, MissionSortBy } from "@/types/mission";

export function useMissionController(defaultSortBy: MissionSortBy = "weighted") {
  const state = useSyncExternalStore(
    missionService.subscribe,
    missionService.getSnapshot,
    missionService.getSnapshot
  );

  const missions = useMemo(() => missionService.getSortedMissions(defaultSortBy), [defaultSortBy, state]);
  const selectedMission = useMemo(() => missionService.getSelectedMission(), [state]);

  useEffect(() => {
    const stopRealtimeSync = missionService.startRealtimeSync({
      sortBy: defaultSortBy,
      status: "open",
      limit: 20
    });
    return stopRealtimeSync;
  }, [defaultSortBy]);

  const loadMissions = useCallback(
    async (filters?: MissionFilters): Promise<ControllerResult<void>> => {
      return missionService.loadMissions({
        sortBy: defaultSortBy,
        ...filters
      });
    },
    [defaultSortBy]
  );

  const selectMission = useCallback((missionId: string) => {
    missionService.selectMission(missionId);
  }, []);

  return {
    missions,
    loading: state.loading,
    selectedMission,
    loadMissions,
    selectMission
  };
}
