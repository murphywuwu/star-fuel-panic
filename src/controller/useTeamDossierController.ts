"use client";

import { useMemo, useSyncExternalStore } from "react";
import { teamDossierService } from "@/service/teamDossierService";

export function useTeamDossierController() {
  const state = useSyncExternalStore(
    teamDossierService.subscribe,
    teamDossierService.getSnapshot,
    teamDossierService.getSnapshot
  );

  const selectors = useMemo(
    () => ({
      currentDeployment: state.dossier?.currentDeployment ?? null,
      participationHistory: state.dossier?.participations ?? [],
      latestParticipation: state.dossier?.participations[0] ?? null
    }),
    [state.dossier]
  );

  const actions = useMemo(
    () => ({
      load: teamDossierService.load.bind(teamDossierService),
      clear: teamDossierService.clear.bind(teamDossierService)
    }),
    []
  );

  return {
    state,
    selectors,
    actions
  };
}
