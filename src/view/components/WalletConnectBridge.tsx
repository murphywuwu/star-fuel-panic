"use client";

import { useWalletConnectBridgeController } from "@/controller/useWalletConnectBridgeController";
import { ConnectModal } from "@mysten/dapp-kit-react/ui";

interface WalletConnectBridgeProps {
  openSignal: number;
  shouldClose: boolean;
}

export function WalletConnectBridge({ openSignal, shouldClose }: WalletConnectBridgeProps) {
  const controller = useWalletConnectBridgeController({ openSignal, shouldClose });
  return (
    <ConnectModal
      key={controller.modalKey}
      open={controller.isOpen}
      ref={controller.connectModalRef}
      filterFn={controller.filterWallet}
    />
  );
}
