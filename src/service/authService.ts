import { authStore, type AuthStore } from "@/model/authStore";
import { WalletServiceError, walletService } from "@/service/walletService";
import type { ControllerResult, FuelMissionErrorCode } from "@/types/fuelMission";

const PAYMENT_RECIPIENT = process.env.NEXT_PUBLIC_ENTRY_PAYMENT_RECIPIENT?.trim() ?? "";
const LUX_COIN_TYPE = process.env.NEXT_PUBLIC_LUX_COIN_TYPE?.trim() || "0x2::sui::SUI";
const LUX_DECIMALS = Number(process.env.NEXT_PUBLIC_LUX_DECIMALS ?? Number.NaN);

function result<T>(ok: boolean, message: string, payload?: T, errorCode?: FuelMissionErrorCode): ControllerResult<T> {
  return { ok, message, payload, errorCode };
}

function resolveWalletError(error: unknown, fallbackCode: FuelMissionErrorCode, fallbackMessage: string) {
  if (error instanceof WalletServiceError) {
    return result(false, error.message, undefined, error.code);
  }
  return result(false, fallbackMessage, undefined, fallbackCode);
}

function normalizeAddress(address: string | null | undefined) {
  return address?.trim().toLowerCase() ?? null;
}

function toBaseUnits(amount: number, decimals: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return 0n;
  }

  const safeDecimals = Number.isFinite(decimals) && decimals >= 0 ? Math.floor(decimals) : 9;
  const fixed = amount.toFixed(safeDecimals);
  const [wholePart, fractionPart = ""] = fixed.split(".");
  const combined = `${wholePart}${fractionPart.padEnd(safeDecimals, "0")}`.replace(/^0+/, "") || "0";
  return BigInt(combined);
}

export const authService = {
  subscribe(listener: () => void) {
    return authStore.subscribe(listener);
  },

  getSnapshot(): AuthStore {
    return authStore.getState();
  },

  hydrateFromStorage() {
    const activeAddress = walletService.getActiveAddress();
    if (!activeAddress) {
      return result(true, "no active wallet");
    }

    const storedAddress = walletService.getStoredAddress();
    if (!storedAddress || normalizeAddress(storedAddress) !== normalizeAddress(activeAddress)) {
      authStore.getState().disconnect();
      return result(true, "wallet cache mismatch");
    }

    const balance = walletService.getStoredBalance();
    authStore.getState().setWallet(activeAddress, Number.isNaN(balance) ? 0 : balance);
    return result(true, "wallet restored", {
      walletAddress: activeAddress,
      luxBalance: Number.isNaN(balance) ? 0 : balance
    });
  },

  async syncFromWalletProvider(walletAddress: string) {
    if (!walletAddress) {
      return result(false, "wallet address missing", undefined, "E_WALLET_UNAVAILABLE");
    }

    try {
      const balance = await walletService.getBalance(walletAddress);
      authStore.getState().setWallet(walletAddress, balance);
      return result(true, "wallet synchronized", {
        walletAddress,
        luxBalance: balance
      });
    } catch (error) {
      const previousState = authStore.getState();
      const fallbackBalance =
        normalizeAddress(previousState.walletAddress) === normalizeAddress(walletAddress) ? previousState.luxBalance : 0;
      authStore.getState().setWallet(walletAddress, fallbackBalance);
      return resolveWalletError(error, "E_WALLET_NETWORK", "wallet sync failed");
    }
  },

  syncWalletDisconnected() {
    authStore.getState().disconnect();
    return result(true, "wallet disconnected");
  },

  async connectWallet() {
    authStore.getState().setConnecting(true);
    try {
      const connected = await walletService.connectWallet();
      authStore.getState().setWallet(connected.address, connected.balance);
      return result(true, "wallet connected", {
        walletAddress: connected.address,
        luxBalance: connected.balance
      });
    } catch (error) {
      authStore.getState().setConnecting(false);
      return resolveWalletError(error, "E_WALLET_CONNECT_REJECTED", "wallet connect failed");
    }
  },

  async disconnectWallet() {
    try {
      await walletService.disconnectWallet();
      authStore.getState().disconnect();
      return result(true, "wallet disconnected");
    } catch (error) {
      return resolveWalletError(error, "E_WALLET_NETWORK", "wallet disconnect failed");
    }
  },

  async refreshBalance() {
    const state = authStore.getState();
    if (!state.walletAddress || !state.isConnected) {
      return result(false, "wallet not connected", undefined, "E_WALLET_NOT_CONNECTED");
    }

    try {
      const balance = await walletService.getBalance(state.walletAddress);
      authStore.getState().updateBalance(balance);
      return result(true, "balance refreshed", { luxBalance: balance });
    } catch (error) {
      return resolveWalletError(error, "E_WALLET_NETWORK", "wallet balance refresh failed");
    }
  },

  async signTransaction(txBytes: Uint8Array) {
    const state = authStore.getState();
    if (!state.walletAddress || !state.isConnected) {
      return result(false, "wallet not connected", undefined, "E_WALLET_NOT_CONNECTED");
    }

    try {
      const signed = await walletService.signTransaction(txBytes);
      return result(true, "transaction signed", signed);
    } catch (error) {
      return resolveWalletError(error, "E_WALLET_SIGN_REJECTED", "wallet sign failed");
    }
  },

  async executeEntryPayment(amountLux: number) {
    const state = authStore.getState();
    if (!state.walletAddress || !state.isConnected) {
      return result(false, "wallet not connected", undefined, "E_WALLET_NOT_CONNECTED");
    }

    if (!PAYMENT_RECIPIENT) {
      return result(false, "entry payment recipient is not configured", undefined, "E_WALLET_UNAVAILABLE");
    }

    const amountBaseUnits = toBaseUnits(amountLux, LUX_DECIMALS);
    if (amountBaseUnits <= 0n) {
      return result(false, "invalid entry fee amount", undefined, "E_INSUFFICIENT_BALANCE");
    }

    try {
      const payment = await walletService.signAndExecuteEntryPayment({
        recipient: PAYMENT_RECIPIENT,
        amountBaseUnits,
        coinType: LUX_COIN_TYPE
      });

      const balance = await walletService.getBalance(state.walletAddress);
      authStore.getState().updateBalance(balance);

      return result(true, "entry payment executed", {
        txDigest: payment.txDigest,
        recipient: PAYMENT_RECIPIENT,
        luxBalance: balance
      });
    } catch (error) {
      return resolveWalletError(error, "E_WALLET_NETWORK", "entry payment transaction failed");
    }
  }
};
