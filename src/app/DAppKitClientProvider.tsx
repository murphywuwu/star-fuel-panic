"use client";

import { DAppKitProvider } from "@mysten/dapp-kit-react";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { createRuntimeDAppKit } from "@/service/suiDappKit";

export function DAppKitClientProvider({ children }: { children: ReactNode }) {
  const dAppKit = useMemo(() => createRuntimeDAppKit(), []);
  return <DAppKitProvider dAppKit={dAppKit}>{children}</DAppKitProvider>;
}
