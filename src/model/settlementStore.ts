import { createStore } from "zustand/vanilla";
import type { MemberPayout, MvpInfo, SettlementBill } from "@/types/settlement";

export interface SettlementState {
  bill: SettlementBill | null;
  loading: boolean;
  error: string | null;
}

interface SettlementActions {
  setBill: (bill: SettlementBill | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type SettlementStore = SettlementState & SettlementActions;

const initialState: SettlementState = {
  bill: null,
  loading: false,
  error: null
};

export const settlementStore = createStore<SettlementStore>()((set) => ({
  ...initialState,
  setBill: (bill) => set({ bill }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState })
}));

export function selectMyPayout(state: SettlementState, walletAddress: string | null): MemberPayout | null {
  if (!state.bill || !walletAddress) {
    return null;
  }

  for (const team of state.bill.teamBreakdown) {
    const found = team.members.find((member) => member.walletAddress === walletAddress);
    if (found) {
      return found;
    }
  }

  return null;
}

export function selectMvp(state: SettlementState): MvpInfo | null {
  return state.bill?.mvp ?? null;
}
