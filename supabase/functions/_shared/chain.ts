// @ts-nocheck

type ChainCallResult = {
  txDigest: string;
  mode: "stub" | "gateway";
};

async function digestHex(input: string) {
  const bytes = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((item) => item.toString(16).padStart(2, "0")).join("");
}

async function makeStubDigest(prefix: string, seed: string) {
  const digest = await digestHex(`${prefix}:${seed}`);
  return `stub_${prefix}_${digest.slice(0, 32)}`;
}

async function callChainGateway(
  endpoint: string,
  payload: Record<string, unknown>,
  fallbackSeed: string,
  fallbackPrefix: string
): Promise<ChainCallResult> {
  const gatewayBase = Deno.env.get("CHAIN_GATEWAY_URL");
  if (!gatewayBase) {
    return {
      txDigest: await makeStubDigest(fallbackPrefix, fallbackSeed),
      mode: "stub"
    };
  }

  const url = `${gatewayBase.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  const apiKey = Deno.env.get("CHAIN_GATEWAY_API_KEY");

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`CHAIN_GATEWAY_${endpoint.toUpperCase()}_${response.status}`);
  }

  const data = await response.json();
  const txDigest = data.txDigest ?? data.digest ?? data.tx ?? data.settlementTx;
  if (!txDigest || typeof txDigest !== "string") {
    throw new Error(`CHAIN_GATEWAY_${endpoint.toUpperCase()}_MISSING_TX`);
  }

  return {
    txDigest,
    mode: "gateway"
  };
}

export async function registerWhitelistOnChain(input: {
  matchId: string;
  captainWallet: string;
  paymentTxDigest: string;
  addresses: string[];
}) {
  return callChainGateway(
    "register-whitelist",
    {
      matchId: input.matchId,
      captainWallet: input.captainWallet,
      paymentTxDigest: input.paymentTxDigest,
      addresses: input.addresses
    },
    `${input.matchId}:${input.paymentTxDigest}:${input.addresses.join(",")}`,
    "register_whitelist"
  );
}

export async function startMatchOnChain(input: {
  matchId: string;
  startedAt: string;
}) {
  return callChainGateway(
    "start-match",
    {
      matchId: input.matchId,
      startedAt: input.startedAt
    },
    `${input.matchId}:${input.startedAt}`,
    "start_match"
  );
}
