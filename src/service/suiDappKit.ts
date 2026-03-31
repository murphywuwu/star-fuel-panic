import { createDAppKit } from "@mysten/dapp-kit-react";
import type { SuiClientTypes } from "@mysten/sui/client";
import { SuiGrpcClient } from "@mysten/sui/grpc";

const DEFAULT_RPC_BY_NETWORK: Record<string, string> = {
  devnet: "https://fullnode.devnet.sui.io:443",
  testnet: "https://fullnode.testnet.sui.io:443",
  mainnet: "https://fullnode.mainnet.sui.io:443",
  localnet: "http://127.0.0.1:9000"
};

function resolveNetwork(): SuiClientTypes.Network {
  const configured = process.env.NEXT_PUBLIC_SUI_NETWORK?.trim();
  if (!configured) {
    return "devnet";
  }
  return configured as SuiClientTypes.Network;
}

function resolveRpcUrl(network: SuiClientTypes.Network) {
  const configured = process.env.NEXT_PUBLIC_SUI_RPC_URL?.trim();
  if (configured) {
    return configured;
  }
  return DEFAULT_RPC_BY_NETWORK[network] ?? DEFAULT_RPC_BY_NETWORK.devnet;
}

const defaultNetwork = resolveNetwork();
export const DAPP_KIT_WALLET_CONNECTION_STORAGE_KEY = "sui:dapp-kit:wallet-connection-info";

export function buildRuntimeDAppKitConfig(storage = typeof window !== "undefined" ? window.localStorage : undefined) {
  return {
    networks: [defaultNetwork],
    defaultNetwork,
    // Keep the last approved wallet session across page reloads.
    autoConnect: true,
    slushWalletConfig: null,
    createClient: (network: SuiClientTypes.Network) =>
      new SuiGrpcClient({
        network,
        baseUrl: resolveRpcUrl(network)
      }),
    storage,
    storageKey: DAPP_KIT_WALLET_CONNECTION_STORAGE_KEY
  };
}

export function createRuntimeDAppKit() {
  return createDAppKit(buildRuntimeDAppKitConfig());
}
