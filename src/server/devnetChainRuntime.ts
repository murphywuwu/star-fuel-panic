import { getServerSuiClient } from "@/server/suiClient";

export type ChainMode = "mock" | "verify" | "strict";

type VerificationResult =
  | {
      ok: true;
      mode: ChainMode;
      txDigest: string;
      verified: boolean;
    }
  | {
      ok: false;
      mode: ChainMode;
      code: "TX_REJECTED" | "CHAIN_SYNC_ERROR";
      message: string;
    };

const TX_DIGEST_PATTERN = /^(0x[a-f0-9]{16,}|[1-9A-HJ-NP-Za-km-z]{20,}|tx_[A-Za-z0-9_-]{4,}|local_[A-Za-z0-9]{10,})$/;

export function resolveChainMode(): ChainMode {
  const configured = (process.env.FUEL_FROG_CHAIN_MODE ?? "").trim().toLowerCase();
  if (configured === "mock" || configured === "verify" || configured === "strict") {
    return configured;
  }

  return "mock";
}

export async function verifySubmittedTxDigest(
  txDigest: string,
  options: {
    operation: string;
  }
): Promise<VerificationResult> {
  const mode = resolveChainMode();
  const normalized = txDigest.trim();

  if (!TX_DIGEST_PATTERN.test(normalized)) {
    return {
      ok: false,
      mode,
      code: "TX_REJECTED",
      message: `${options.operation} transaction digest is invalid`
    };
  }

  if (mode === "mock") {
    return {
      ok: true,
      mode,
      txDigest: normalized,
      verified: false
    };
  }

  try {
    const client = getServerSuiClient() as {
      getTransactionBlock: (input: {
        digest: string;
        options?: {
          showEffects?: boolean;
          showEvents?: boolean;
          showBalanceChanges?: boolean;
        };
      }) => Promise<unknown>;
    };

    await client.getTransactionBlock({
      digest: normalized,
      options: {
        showEffects: true,
        showEvents: true,
        showBalanceChanges: true
      }
    });

    return {
      ok: true,
      mode,
      txDigest: normalized,
      verified: true
    };
  } catch (error) {
    return {
      ok: false,
      mode,
      code: "CHAIN_SYNC_ERROR",
      message:
        error instanceof Error
          ? error.message
          : `Unable to verify ${options.operation} transaction on configured chain`
    };
  }
}
