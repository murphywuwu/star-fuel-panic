import { createStore } from "zustand/vanilla";
import type { PlayerTeamDossier } from "@/types/player";

export interface TeamDossierState {
  loadedAddress: string | null;
  dossier: PlayerTeamDossier | null;
  isLoading: boolean;
  error: string | null;
}

interface TeamDossierActions {
  setLoadedAddress: (loadedAddress: string | null) => void;
  setDossier: (dossier: PlayerTeamDossier | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type TeamDossierStore = TeamDossierState & TeamDossierActions;

const initialState: TeamDossierState = {
  loadedAddress: null,
  dossier: null,
  isLoading: false,
  error: null
};

export const teamDossierStore = createStore<TeamDossierStore>()((set) => ({
  ...initialState,
  setLoadedAddress: (loadedAddress) => set({ loadedAddress }),
  setDossier: (dossier) => set({ dossier }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState })
}));
