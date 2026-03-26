import { createStore } from "zustand/vanilla";
import type { Match } from "@/types/match";
import type { TeamDetail } from "@/types/team";

export interface TeamLobbyState {
  matchId: string | null;
  match: Match | null;
  teams: TeamDetail[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

interface TeamLobbyActions {
  setMatchId: (matchId: string | null) => void;
  setMatch: (match: Match | null) => void;
  setTeams: (teams: TeamDetail[]) => void;
  upsertTeam: (team: TeamDetail) => void;
  removeTeam: (teamId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setMutating: (isMutating: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type TeamLobbyStore = TeamLobbyState & TeamLobbyActions;

const initialState: TeamLobbyState = {
  matchId: null,
  match: null,
  teams: [],
  isLoading: false,
  isMutating: false,
  error: null
};

export const teamLobbyStore = createStore<TeamLobbyStore>()((set) => ({
  ...initialState,
  setMatchId: (matchId) => set({ matchId }),
  setMatch: (match) => set({ match }),
  setTeams: (teams) => set({ teams }),
  upsertTeam: (team) =>
    set((state) => ({
      teams: state.teams.some((item) => item.id === team.id)
        ? state.teams.map((item) => (item.id === team.id ? team : item))
        : [...state.teams, team]
    })),
  removeTeam: (teamId) => set((state) => ({ teams: state.teams.filter((item) => item.id !== teamId) })),
  setLoading: (isLoading) => set({ isLoading }),
  setMutating: (isMutating) => set({ isMutating }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState })
}));

export function selectOpenTeams(state: TeamLobbyState) {
  return state.teams.filter((team) => team.status === "forming");
}

export function selectCurrentPlayerTeam(state: TeamLobbyState, walletAddress: string | null) {
  if (!walletAddress) {
    return null;
  }

  const normalized = walletAddress.trim().toLowerCase();
  return (
    state.teams.find((team) =>
      team.members.some((member) => member.walletAddress.trim().toLowerCase() === normalized)
    ) ?? null
  );
}

export function selectPaymentAmount(state: TeamLobbyState, teamId: string) {
  const team = state.teams.find((item) => item.id === teamId);
  if (!team) {
    return 0;
  }

  const parsed = Number(team.paymentAmount);
  return Number.isFinite(parsed) ? parsed : 0;
}
