import type { SuiClientTypes } from "@mysten/sui/client";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";

const DEFAULT_RPC_BY_NETWORK: Record<string, string> = {
  devnet: "https://fullnode.devnet.sui.io:443",
  testnet: "https://fullnode.testnet.sui.io:443",
  mainnet: "https://fullnode.mainnet.sui.io:443",
  localnet: "http://127.0.0.1:9000"
};

let client: SuiJsonRpcClient | null = null;

function resolveNetwork(): SuiClientTypes.Network {
  const configured =
    process.env.SUI_NETWORK?.trim() ?? process.env.NEXT_PUBLIC_SUI_NETWORK?.trim();

  if (!configured) {
    return "devnet";
  }

  return configured as SuiClientTypes.Network;
}

function resolveRpcUrl(network: SuiClientTypes.Network) {
  const configured =
    process.env.SUI_RPC_URL?.trim() ?? process.env.NEXT_PUBLIC_SUI_RPC_URL?.trim();

  if (configured) {
    return configured;
  }

  return DEFAULT_RPC_BY_NETWORK[network] ?? DEFAULT_RPC_BY_NETWORK.devnet;
}

export function getServerSuiClient() {
  if (client) {
    return client;
  }

  const network = resolveNetwork();
  client = new SuiJsonRpcClient({
    network,
    url: resolveRpcUrl(network)
  });

  return client;
}
