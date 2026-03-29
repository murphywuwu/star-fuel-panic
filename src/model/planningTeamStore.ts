import { createStore } from "zustand/vanilla";
import type { PlanningTeam } from "@/types/planningTeam";

export interface PlanningTeamState {
  teams: PlanningTeam[];
  totalTeams: number;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

interface PlanningTeamActions {
  setSnapshot: (snapshot: { teams: PlanningTeam[]; totalTeams: number }) => void;
  upsertTeam: (team: PlanningTeam) => void;
  setLoading: (isLoading: boolean) => void;
  setMutating: (isMutating: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type PlanningTeamStore = PlanningTeamState & PlanningTeamActions;

const initialState: PlanningTeamState = {
  teams: [],
  totalTeams: 0,
  isLoading: false,
  isMutating: false,
  error: null
};

export const planningTeamStore = createStore<PlanningTeamStore>()((set) => ({
  ...initialState,
  setSnapshot: ({ teams, totalTeams }) =>
    set({
      teams,
      totalTeams
    }),
  upsertTeam: (team) =>
    set((state) => {
      const teams = [team, ...state.teams.filter((item) => item.id !== team.id)].sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt)
      );
      return {
        teams,
        totalTeams: teams.length
      };
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setMutating: (isMutating) => set({ isMutating }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState })
}));

export function selectPlanningTeamCount(state: PlanningTeamState) {
  return state.totalTeams;
}

export function selectLatestPlanningTeams(state: PlanningTeamState, limit = 5) {
  return state.teams.slice(0, Math.max(0, limit));
}
