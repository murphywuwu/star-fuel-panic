"use client";

import { useCurrentAccount, useCurrentClient, useDAppKit, useWalletConnection, useWallets, type UiWallet } from "@mysten/dapp-kit-react";
import { normalizeStructTag, toBase64 } from "@mysten/sui/utils";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { authService } from "@/service/authService";
import type { TeamEntryEscrowPaymentInput } from "@/service/authService";
import { setWalletRuntimeBridge } from "@/service/walletService";
import type { FuelMissionErrorCode } from "@/types/fuelMission";
import { PAYMENT_TOKEN_LABEL } from "@/utils/paymentToken";
import { balanceToDisplayUnits, normalizeWalletDecimals } from "@/utils/walletBalance";

const WALLET_ERROR_LABEL: Partial<Record<FuelMissionErrorCode, string>> = {
  E_WALLET_NOT_CONNECTED: "WALLET NOT CONNECTED",
  E_WALLET_UNAVAILABLE: "WALLET BRIDGE UNAVAILABLE",
  E_WALLET_CONNECT_REJECTED: "WALLET AUTH REJECTED",
  E_WALLET_SIGN_REJECTED: "SIGNATURE REJECTED",
  E_WALLET_NETWORK: "WALLET NETWORK ERROR",
  E_INSUFFICIENT_BALANCE: `INSUFFICIENT ${PAYMENT_TOKEN_LABEL} BALANCE`,
  E_INSUFFICIENT_GAS: "INSUFFICIENT SUI GAS"
};

const DEFAULT_COIN_TYPE = process.env.NEXT_PUBLIC_LUX_COIN_TYPE?.trim() || "0x2::sui::SUI";
const DEFAULT_DECIMALS = Number(process.env.NEXT_PUBLIC_LUX_DECIMALS ?? Number.NaN);
const CONFIGURED_DECIMALS = Number.isFinite(DEFAULT_DECIMALS) ? Math.floor(DEFAULT_DECIMALS) : null;
const NORMALIZED_COIN_TYPE = normalizeStructTag(DEFAULT_COIN_TYPE);

function normalizeAddress(address: string | null | undefined) {
  return address?.trim().toLowerCase() ?? null;
}

function pickPreferredWallet(wallets: UiWallet[]) {
  const eveWallet = wallets.find((wallet) => wallet.name.toLowerCase().includes("eve"));
  return eveWallet ?? wallets[0] ?? null;
}

function selectWalletShort(walletAddress: string | null) {
  if (!walletAddress) {
    return "NOT CONNECTED";
  }
  if (walletAddress.length <= 12) {
    return walletAddress;
  }
  return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
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
  const walletConnection = useWalletConnection();
  const client = useCurrentClient();
  const decimalsRef = useRef<number | null>(null);
  const decimalsPromiseRef = useRef<Promise<number> | null>(null);
  const [connectOpenSignal, setConnectOpenSignal] = useState(0);

  const state = useSyncExternalStore(
    authService.subscribe,
    authService.getSnapshot,
    authService.getSnapshot
  );

  useEffect(() => {
    decimalsRef.current = null;
    decimalsPromiseRef.current = null;
  }, [client]);

  useEffect(() => {
    const resolveCoinDecimals = async () => {
      if (decimalsRef.current !== null) {
        return decimalsRef.current;
      }

      if (!decimalsPromiseRef.current) {
        decimalsPromiseRef.current = client.core
          .getCoinMetadata({
            coinType: DEFAULT_COIN_TYPE
          })
          .then((response) => normalizeWalletDecimals(response.coinMetadata?.decimals, CONFIGURED_DECIMALS))
          .catch(() => normalizeWalletDecimals(undefined, CONFIGURED_DECIMALS))
          .then((decimals) => {
            decimalsRef.current = decimals;
            return decimals;
          });
      }

      return decimalsPromiseRef.current;
    };

    const resolveBalanceFromClient = async (address: string) => {
      const decimals = await resolveCoinDecimals();

      try {
        const response = await client.core.getBalance({
          owner: address,
          coinType: DEFAULT_COIN_TYPE
        });

        const primaryBalance = response.balance.balance;
        if (primaryBalance !== "0") {
          return balanceToDisplayUnits(primaryBalance, decimals);
        }
      } catch (error) {
        console.error("[wallet] getBalance failed, falling back to listBalances", {
          address,
          coinType: DEFAULT_COIN_TYPE,
          error
        });
      }

      const balances = await client.core.listBalances({
        owner: address,
        limit: 100
      });

      const matched = balances.balances.find((entry) => normalizeStructTag(entry.coinType) === NORMALIZED_COIN_TYPE);
      return balanceToDisplayUnits(matched?.balance ?? "0", decimals);
    };

    setWalletRuntimeBridge({
      connect: async () => {
        const preferredWallet = pickPreferredWallet(wallets);
        if (!preferredWallet) {
          throw new Error("no compatible wallet found");
        }

        if (walletConnection.status !== "disconnected") {
          try {
            await dAppKit.disconnectWallet();
          } catch {
            // Best-effort cleanup only. EVE Vault may already be deauthorized.
          }
        }

        const connected = await dAppKit.connectWallet({ wallet: preferredWallet });
        const selectedAddress = connected.accounts[0]?.address ?? null;
        if (!selectedAddress) {
          throw new Error(`wallet returned no authorized account: ${preferredWallet.name}`);
        }
        return selectedAddress;
      },
      disconnect: async () => {
        await dAppKit.disconnectWallet();
      },
      currentAddress: () => (walletConnection.status === "connected" ? account?.address ?? null : null),
      isWalletReady: () => walletConnection.status === "connected" && Boolean(account?.address),
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
      getBalance: async (address: string) => {
        return resolveBalanceFromClient(address);
      },
      objectExists: async (objectId: string) => {
        if (!objectId.trim()) {
          return false;
        }

        try {
          const response = await client.core.getObject({
            objectId,
            include: {
              content: false
            }
          });

          return Boolean(response.object?.objectId);
        } catch (error) {
          if (error instanceof Error && /not found/i.test(error.message)) {
            return false;
          }
          throw error;
        }
      }
    });
  }, [account?.address, client, dAppKit, walletConnection.status, wallets]);

  useEffect(() => {
    const providerConnecting = walletConnection.status === "connecting" || walletConnection.status === "reconnecting";
    authService.syncWalletConnecting(providerConnecting);
  }, [walletConnection.status]);

  useEffect(() => {
    const providerAddress = walletConnection.status === "connected" ? account?.address ?? null : null;
    if (!providerAddress) {
      if (state.isConnected && walletConnection.status === "disconnected") {
        authService.syncWalletDisconnected();
      }
      return;
    }

    if (!state.isConnected || normalizeAddress(state.walletAddress) !== normalizeAddress(providerAddress)) {
      void authService.syncFromWalletProvider(providerAddress);
    }
  }, [account?.address, state.isConnected, state.walletAddress, walletConnection.status]);

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
    ui: {
      connectOpenSignal
    },
    selectors: {
      walletShort: selectWalletShort(state.walletAddress)
    },
    actions: {
      onConnectWallet: async () => {
        setConnectOpenSignal((prev) => prev + 1);
        return {
          ok: true,
          message: "wallet connect modal opened"
        };
      },
      onDisconnectWallet: () => authService.disconnectWallet(),
      onRefreshBalance: () => authService.refreshBalance(),
      onSignTransaction: (txBytes: Uint8Array) => authService.signTransaction(txBytes),
      onExecuteEntryPayment: (input: number | TeamEntryEscrowPaymentInput) => authService.executeEntryPayment(input),
      onExecuteSponsorshipPayment: (amountLux: number) => authService.executeSponsorshipPayment(amountLux)
    }
  };
}
