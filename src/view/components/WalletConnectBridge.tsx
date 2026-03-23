"use client";

import { useEffect, useRef, useState, type ComponentRef } from "react";
import type { UiWallet } from "@mysten/dapp-kit-react";
import { ConnectModal } from "@mysten/dapp-kit-react/ui";

interface WalletConnectBridgeProps {
  openSignal: number;
  isConnected: boolean;
}

function isEveWallet(wallet: UiWallet) {
  return wallet.name.toLowerCase().includes("eve");
}

export function WalletConnectBridge({ openSignal, isConnected }: WalletConnectBridgeProps) {
  const connectModalRef = useRef<ComponentRef<typeof ConnectModal> | null>(null);
  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    if (isConnected) {
      void connectModalRef.current?.hide?.();
    }
  }, [isConnected]);

  useEffect(() => {
    if (openSignal <= 0) {
      return;
    }

    setModalKey((prev) => prev + 1);

    const timer = setTimeout(() => {
      void connectModalRef.current?.show?.();
    }, 100);

    return () => clearTimeout(timer);
  }, [openSignal]);

  return <ConnectModal key={modalKey} ref={connectModalRef} filterFn={isEveWallet} />;
}
