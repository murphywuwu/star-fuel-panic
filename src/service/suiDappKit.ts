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
export function createRuntimeDAppKit() {
  return createDAppKit({
    networks: [defaultNetwork],
    defaultNetwork,
    autoConnect: true,
    createClient: (network) =>
      new SuiGrpcClient({
        network,
        baseUrl: resolveRpcUrl(network)
      })
  });
}
