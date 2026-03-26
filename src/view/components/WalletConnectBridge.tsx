"use client";

import { useEffect, useRef, useState, type ComponentRef } from "react";
import type { UiWallet } from "@mysten/dapp-kit-react";
import { ConnectModal } from "@mysten/dapp-kit-react/ui";

interface WalletConnectBridgeProps {
  openSignal: number;
  shouldClose: boolean;
}

function isEveWallet(wallet: UiWallet) {
  return wallet.name.toLowerCase().includes("eve");
}

export function WalletConnectBridge({ openSignal, shouldClose }: WalletConnectBridgeProps) {
  const connectModalRef = useRef<ComponentRef<typeof ConnectModal> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const modal = connectModalRef.current as (EventTarget & {
      addEventListener?: (type: string, listener: EventListener) => void;
      removeEventListener?: (type: string, listener: EventListener) => void;
    }) | null;

    if (!modal?.addEventListener || !modal?.removeEventListener) {
      return undefined;
    }

    const handleClosed = () => {
      setIsOpen(false);
    };

    modal.addEventListener("closed", handleClosed);
    return () => {
      modal.removeEventListener("closed", handleClosed);
    };
  }, []);

  useEffect(() => {
    if (openSignal <= 0) {
      return;
    }

    setIsOpen(true);
  }, [openSignal]);

  useEffect(() => {
    if (!shouldClose) {
      return;
    }

    setIsOpen(false);
  }, [shouldClose]);

  return <ConnectModal open={isOpen} ref={connectModalRef} filterFn={isEveWallet} />;
}
