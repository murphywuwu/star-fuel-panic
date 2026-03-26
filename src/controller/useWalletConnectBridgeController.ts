"use client";

import { useEffect, useRef, useState, type ComponentRef } from "react";
import type { UiWallet } from "@mysten/dapp-kit-react";
import { ConnectModal } from "@mysten/dapp-kit-react/ui";

interface WalletConnectBridgeControllerInput {
  openSignal: number;
  shouldClose: boolean;
}

function isEveWallet(wallet: UiWallet) {
  return wallet.name.toLowerCase().includes("eve");
}

export function useWalletConnectBridgeController({
  openSignal,
  shouldClose
}: WalletConnectBridgeControllerInput) {
  const connectModalRef = useRef<ComponentRef<typeof ConnectModal> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

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
  }, [modalKey]);

  useEffect(() => {
    if (openSignal <= 0) {
      return;
    }

    setModalKey((previous) => previous + 1);
    setIsOpen(true);
  }, [openSignal]);

  useEffect(() => {
    if (!shouldClose) {
      return;
    }

    setIsOpen(false);
  }, [shouldClose]);

  return {
    connectModalRef,
    modalKey,
    isOpen,
    filterWallet: isEveWallet
  };
}
