"use client";

import { useMemo, useSyncExternalStore } from "react";
import { planningTeamService } from "@/service/planningTeamService";

export function usePlanningTeamController() {
  const state = useSyncExternalStore(
    planningTeamService.subscribe,
    planningTeamService.getSnapshot,
    planningTeamService.getSnapshot
  );

  const selectors = useMemo(
    () => ({
      latestTeams: (limit = 5) => state.teams.slice(0, Math.max(0, limit)),
      currentPlayerTeam: (walletAddress: string | null) => {
        const normalized = walletAddress?.trim().toLowerCase();
        if (!normalized) {
          return null;
        }

        return (
          state.teams.find((team) =>
            team.members.some((member) => member.walletAddress.trim().toLowerCase() === normalized)
          ) ?? null
        );
      }
    }),
    [state]
  );

  const actions = useMemo(
    () => ({
      load: planningTeamService.load.bind(planningTeamService),
      createTeam: planningTeamService.createTeam.bind(planningTeamService),
      joinTeam: planningTeamService.joinTeam.bind(planningTeamService),
      approveApplication: planningTeamService.approveApplication.bind(planningTeamService),
      rejectApplication: planningTeamService.rejectApplication.bind(planningTeamService),
      leaveTeam: planningTeamService.leaveTeam.bind(planningTeamService),
      disbandTeam: planningTeamService.disbandTeam.bind(planningTeamService)
    }),
    []
  );

  return {
    state,
    selectors,
    actions
  };
}
