import { createStore } from "zustand/vanilla";
import type { NetworkNode } from "@/types/node";
import type { SearchHit, SolarSystemDetail } from "@/types/solarSystem";

type Mode = "free" | "precision";

type EditableCreateMatchField =
  | "mode"
  | "solarSystemId"
  | "targetNodeIds"
  | "sponsorshipFee"
  | "maxTeams"
  | "entryFee"
  | "durationHours";

export type CreateMatchState = {
  mode: Mode;
  solarSystemId: number | null;
  targetNodeIds: string[];
  sponsorshipFee: number;
  maxTeams: number;
  entryFee: number;
  durationHours: number;
  searchHits: SearchHit[];
  selectedSystem: SolarSystemDetail | null;
  systemNodes: NetworkNode[];
  searching: boolean;
  loadingSystem: boolean;
  loading: boolean;
  error: string | null;
  draftId: string | null;
};

type CreateMatchActions = {
  setField: <K extends EditableCreateMatchField>(
    key: K,
    value: CreateMatchState[K]
  ) => void;
  setSearchHits: (searchHits: SearchHit[]) => void;
  setSelectedSystem: (selectedSystem: SolarSystemDetail | null) => void;
  setSystemNodes: (systemNodes: NetworkNode[]) => void;
  setSearching: (searching: boolean) => void;
  setLoadingSystem: (loadingSystem: boolean) => void;
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
  searchHits: [],
  selectedSystem: null,
  systemNodes: [],
  searching: false,
  loadingSystem: false,
  loading: false,
  error: null,
  draftId: null
};

export const createMatchStore = createStore<CreateMatchState & CreateMatchActions>()((set) => ({
  ...initialState,
  setField: (key, value) =>
    set({
      [key]: value,
      draftId: null,
      error: null
    } as Partial<CreateMatchState>),
  setSearchHits: (searchHits) => set({ searchHits }),
  setSelectedSystem: (selectedSystem) => set({ selectedSystem }),
  setSystemNodes: (systemNodes) => set({ systemNodes }),
  setSearching: (searching) => set({ searching }),
  setLoadingSystem: (loadingSystem) => set({ loadingSystem }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setDraftId: (draftId) => set({ draftId }),
  reset: () => set(initialState)
}));
