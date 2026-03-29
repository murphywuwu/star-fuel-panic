"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWalletConnection, useWallets } from "@mysten/dapp-kit-react";
import { useAuthController, walletErrorMessage } from "@/controller/useAuthController";
import { PAYMENT_TOKEN_LABEL } from "@/utils/paymentToken";
import { formatWalletBalance } from "@/utils/walletBalance";

const SHELL_PREFETCH_ROUTES = ["/lobby", "/planning", "/team", "/match", "/settlement"];

function hasCompatibleEveWallet(wallets: ReturnType<typeof useWallets>) {
  return wallets.some((wallet) => wallet.name.toLowerCase().includes("eve"));
}

export function useFuelMissionShellController() {
  const { state: authState, ui, selectors, actions: authActions } = useAuthController();
  const wallets = useWallets();
  const walletConnection = useWalletConnection();
  const router = useRouter();
  const [walletNotice, setWalletNotice] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    for (const href of SHELL_PREFETCH_ROUTES) {
      router.prefetch(href);
    }
  }, [router]);

  useEffect(() => {
    if (!isMounted || !authState.isConnected) {
      return;
    }
    setWalletNotice("WALLET CONNECTED");
  }, [authState.isConnected, isMounted]);

  const hasEveWallet = useMemo(() => hasCompatibleEveWallet(wallets), [wallets]);
  const providerNames = useMemo(() => wallets.map((wallet) => wallet.name).join(" / "), [wallets]);

  const handleConnectWallet = useCallback(async () => {
    if (!hasEveWallet) {
      setWalletNotice("EVE WALLET PROVIDER NOT DETECTED");
      return;
    }

    await authActions.onConnectWallet();
    setWalletNotice("SELECT EVE WALLET");
  }, [authActions, hasEveWallet]);

  const handleDisconnectWallet = useCallback(async () => {
    const disconnected = await authActions.onDisconnectWallet();
    if (!disconnected.ok) {
      setWalletNotice(walletErrorMessage(disconnected.errorCode, disconnected.message));
      return;
    }
    setWalletNotice("WALLET DISCONNECTED");
  }, [authActions]);

  const handleRefreshBalance = useCallback(async () => {
    const refreshed = await authActions.onRefreshBalance();
    if (!refreshed.ok) {
      setWalletNotice(walletErrorMessage(refreshed.errorCode, refreshed.message));
      return;
    }
    setWalletNotice(
      `BALANCE REFRESHED // ${formatWalletBalance(refreshed.payload?.luxBalance ?? authState.luxBalance)} ${PAYMENT_TOKEN_LABEL}`
    );
  }, [authActions, authState.luxBalance]);

  return {
    authState,
    wallet: {
      notice: walletNotice,
      hasEveWallet,
      providerNames,
      shortAddress: isMounted ? selectors.walletShort : "NOT CONNECTED",
      balanceLabel: isMounted ? `${formatWalletBalance(authState.luxBalance)} ${PAYMENT_TOKEN_LABEL}` : `0 ${PAYMENT_TOKEN_LABEL}`,
      isBalanceLow: isMounted && authState.luxBalance < 100,
      showProviderList: isMounted && !authState.isConnected && wallets.length > 0 && walletConnection.status === "disconnected"
    },
    walletBridge: {
      shouldRender: ui.connectOpenSignal > 0,
      openSignal: ui.connectOpenSignal,
      shouldClose: walletConnection.status === "connected" || authState.isConnected
    },
    viewState: {
      isMounted
    },
    actions: {
      connectWallet: handleConnectWallet,
      disconnectWallet: handleDisconnectWallet,
      refreshBalance: handleRefreshBalance
    }
  };
}
