"use client";

import { useCurrentAccount, useCurrentClient, useDAppKit, useWallets, type UiWallet } from "@mysten/dapp-kit-react";
import { toBase64 } from "@mysten/sui/utils";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { selectWalletShort } from "@/model/authStore";
import { authService } from "@/service/authService";
import { setWalletRuntimeBridge } from "@/service/walletService";
import type { FuelMissionErrorCode } from "@/types/fuelMission";

const WALLET_ERROR_LABEL: Partial<Record<FuelMissionErrorCode, string>> = {
  E_WALLET_NOT_CONNECTED: "WALLET NOT CONNECTED",
  E_WALLET_UNAVAILABLE: "WALLET BRIDGE UNAVAILABLE",
  E_WALLET_CONNECT_REJECTED: "WALLET AUTH REJECTED",
  E_WALLET_SIGN_REJECTED: "SIGNATURE REJECTED",
  E_WALLET_NETWORK: "WALLET NETWORK ERROR",
  E_INSUFFICIENT_BALANCE: "INSUFFICIENT LUX BALANCE"
};

const DEFAULT_COIN_TYPE = process.env.NEXT_PUBLIC_LUX_COIN_TYPE?.trim() || "0x2::sui::SUI";
const DEFAULT_DECIMALS = Number(process.env.NEXT_PUBLIC_LUX_DECIMALS ?? Number.NaN);

function normalizeAddress(address: string | null | undefined) {
  return address?.trim().toLowerCase() ?? null;
}

function pickPreferredWallet(wallets: UiWallet[]) {
  const eveWallet = wallets.find((wallet) => wallet.name.toLowerCase().includes("eve"));
  return eveWallet ?? wallets[0] ?? null;
}

function balanceToDisplayUnits(rawBalance: string, decimals: number) {
  const safeDecimals = Number.isFinite(decimals) && decimals >= 0 ? Math.floor(decimals) : 9;
  try {
    const amount = BigInt(rawBalance);
    const divisor = 10n ** BigInt(safeDecimals);
    const whole = amount / divisor;
    const fraction = amount % divisor;
    const fractionText = safeDecimals === 0 ? "" : fraction.toString().padStart(safeDecimals, "0").slice(0, 6);
    const asNumber = Number(fractionText.length > 0 ? `${whole.toString()}.${fractionText}` : whole.toString());
    return Number.isFinite(asNumber) ? asNumber : 0;
  } catch {
    const parsed = Number(rawBalance);
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    return parsed / 10 ** safeDecimals;
  }
}

export function walletErrorMessage(errorCode?: FuelMissionErrorCode | string, fallbackMessage?: string) {
  if (!errorCode) {
    return fallbackMessage ?? "UNKNOWN ERROR";
  }
  return WALLET_ERROR_LABEL[errorCode as FuelMissionErrorCode] ?? fallbackMessage ?? errorCode;
}

export function useAuthController() {
  const dAppKit = useDAppKit();
  const wallets = useWallets();
  const account = useCurrentAccount();
  const client = useCurrentClient();
  const decimalsRef = useRef<number | null>(Number.isFinite(DEFAULT_DECIMALS) ? DEFAULT_DECIMALS : null);

  const state = useSyncExternalStore(
    authService.subscribe,
    authService.getSnapshot,
    authService.getSnapshot
  );

  useEffect(() => {
    setWalletRuntimeBridge({
      connect: async () => {
        if (account?.address) {
          return account.address;
        }

        const preferredWallet = pickPreferredWallet(wallets);
        if (!preferredWallet) {
          throw new Error("no compatible wallet found");
        }

        const connected = await dAppKit.connectWallet({ wallet: preferredWallet });
        const selectedAddress = connected.accounts[0]?.address ?? preferredWallet.accounts[0]?.address ?? null;
        if (!selectedAddress) {
          throw new Error("wallet returned no account");
        }
        return selectedAddress;
      },
      disconnect: async () => {
        await dAppKit.disconnectWallet();
      },
      currentAddress: () => account?.address ?? null,
      signTransaction: (txBytes: Uint8Array) =>
        dAppKit.signTransaction({
          transaction: toBase64(txBytes)
        }),
      signAndExecuteTransaction: async (transaction: Transaction) => {
        const execution = await dAppKit.signAndExecuteTransaction({ transaction });
        const directDigest = (execution as { digest?: string })?.digest;
        if (typeof directDigest === "string" && directDigest.length > 0) {
          return { txDigest: directDigest };
        }

        const nestedDigest = (execution as { Transaction?: { digest?: string } })?.Transaction?.digest;
        if (typeof nestedDigest === "string" && nestedDigest.length > 0) {
          return { txDigest: nestedDigest };
        }

        throw new Error("wallet execution returned no digest");
      },
      signPersonalMessage: (message: Uint8Array) =>
        dAppKit.signPersonalMessage({
          message
        }),
      getBalance: async (address: string) => {
        if (decimalsRef.current === null) {
          decimalsRef.current = 9;
        }

        const response = await client.core.getBalance({
          owner: address,
          coinType: DEFAULT_COIN_TYPE
        });
        return balanceToDisplayUnits(response.balance.balance, decimalsRef.current ?? 9);
      }
    });
  }, [account?.address, client, dAppKit, wallets]);

  useEffect(() => {
    authService.hydrateFromStorage();
  }, []);

  useEffect(() => {
    const providerAddress = account?.address ?? null;
    if (!providerAddress) {
      if (state.isConnected) {
        authService.syncWalletDisconnected();
      }
      return;
    }

    if (!state.isConnected || normalizeAddress(state.walletAddress) !== normalizeAddress(providerAddress)) {
      void authService.syncFromWalletProvider(providerAddress);
    }
  }, [account?.address, state.isConnected, state.walletAddress]);

  useEffect(() => {
    if (!state.isConnected || !state.walletAddress) {
      return undefined;
    }

    const timer = setInterval(() => {
      void authService.refreshBalance();
    }, 30_000);

    return () => {
      clearInterval(timer);
    };
  }, [state.isConnected, state.walletAddress]);

  return {
    state,
    selectors: {
      walletShort: selectWalletShort(state)
    },
    actions: {
      onConnectWallet: () => authService.connectWallet(),
      onDisconnectWallet: () => authService.disconnectWallet(),
      onRefreshBalance: () => authService.refreshBalance(),
      onSignTransaction: (txBytes: Uint8Array) => authService.signTransaction(txBytes),
      onExecuteEntryPayment: (amountLux: number) => authService.executeEntryPayment(amountLux)
    }
  };
}
