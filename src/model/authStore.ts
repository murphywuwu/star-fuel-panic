import { createStore } from "zustand/vanilla";

export interface AuthState {
  walletAddress: string | null;
  luxBalance: number;
  isConnected: boolean;
  isConnecting: boolean;
  lastSyncAt: number | null;
}

interface AuthActions {
  setWallet: (address: string, balance: number) => void;
  disconnect: () => void;
  updateBalance: (balance: number) => void;
  setConnecting: (connecting: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  walletAddress: null,
  luxBalance: 0,
  isConnected: false,
  isConnecting: false,
  lastSyncAt: null
};

export const authStore = createStore<AuthStore>()((set) => ({
  ...initialState,
  setWallet: (walletAddress, luxBalance) =>
    set({
      walletAddress,
      luxBalance,
      isConnected: true,
      isConnecting: false,
      lastSyncAt: Date.now()
    }),
  disconnect: () => set({ ...initialState }),
  updateBalance: (luxBalance) => set({ luxBalance, lastSyncAt: Date.now() }),
  setConnecting: (isConnecting) => set({ isConnecting })
}));

export function selectIsConnected(state: AuthState) {
  return state.isConnected;
}

export function selectWalletShort(state: AuthState) {
  if (!state.walletAddress) {
    return "NOT CONNECTED";
  }
  const address = state.walletAddress;
  if (address.length <= 12) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
