const PUBLIC_RPC_BY_NETWORK: Record<string, string> = {
  devnet: "https://fullnode.devnet.sui.io:443",
  testnet: "https://fullnode.testnet.sui.io:443",
  mainnet: "https://fullnode.mainnet.sui.io:443"
};

type ProbeResult = "exists" | "missing" | "unknown";

async function probePackageOnNetwork(packageId: string, network: string): Promise<ProbeResult> {
  const rpcUrl = PUBLIC_RPC_BY_NETWORK[network];
  if (!rpcUrl || !packageId.trim()) {
    return "unknown";
  }

  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "sui_getObject",
        params: [packageId, { showType: true }]
      }),
      cache: "no-store"
    });
    if (!response.ok) {
      return "unknown";
    }

    const payload = (await response.json()) as {
      result?: {
        data?: {
          type?: string;
        };
        error?: {
          code?: string;
        };
      };
    };

    if (payload.result?.data?.type === "package") {
      return "exists";
    }
    if (payload.result?.error?.code === "notExists") {
      return "missing";
    }

    return "unknown";
  } catch {
    return "unknown";
  }
}

export async function describePackageAvailabilityMismatch(packageId: string, configuredNetwork: string) {
  const normalizedNetwork = configuredNetwork.trim().toLowerCase();

  for (const network of Object.keys(PUBLIC_RPC_BY_NETWORK)) {
    if (network === normalizedNetwork) {
      continue;
    }

    const probe = await probePackageOnNetwork(packageId, network);
    if (probe === "exists") {
      return `escrow package ${packageId} is available on ${network}, not ${normalizedNetwork}; switch wallet/RPC to ${network} or publish this package to ${normalizedNetwork}`;
    }
  }

  return `escrow package ${packageId} is not available on ${normalizedNetwork}; check wallet network and NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID`;
}
