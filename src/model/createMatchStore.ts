import { createStore } from "zustand/vanilla";

type Mode = "free" | "precision";

export type CreateMatchState = {
  mode: Mode;
  solarSystemId: number | null;
  targetNodeIds: string[];
  sponsorshipFee: number;
  maxTeams: number;
  entryFee: number;
  durationHours: number;
  loading: boolean;
  error: string | null;
  draftId: string | null;
};

type CreateMatchActions = {
  setField: <K extends keyof Omit<CreateMatchState, "loading" | "error" | "draftId">>(
    key: K,
    value: CreateMatchState[K]
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDraftId: (id: string | null) => void;
  reset: () => void;
};

const initialState: CreateMatchState = {
  mode: "free",
  solarSystemId: null,
  targetNodeIds: [],
  sponsorshipFee: 500,
  maxTeams: 8,
  entryFee: 50,
  durationHours: 2,
  loading: false,
  error: null,
  draftId: null
};

export const createMatchStore = createStore<CreateMatchState & CreateMatchActions>()((set) => ({
  ...initialState,
  setField: (key, value) => set({ [key]: value } as Partial<CreateMatchState>),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setDraftId: (draftId) => set({ draftId }),
  reset: () => set(initialState)
}));
