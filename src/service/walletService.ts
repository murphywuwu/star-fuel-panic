import { fromBase64 } from "@mysten/sui/utils";
import { verifyPersonalMessageSignature, verifyTransactionSignature } from "@mysten/sui/verify";
import { Transaction } from "@mysten/sui/transactions";
import type { FuelMissionErrorCode } from "@/types/fuelMission";

const STORAGE_ADDRESS_KEY = "ffp.wallet.address";
const STORAGE_BALANCE_KEY = "ffp.wallet.balance";
const STORAGE_IDENTITY_PROOF_KEY = "ffp.wallet.identity_proof";

interface SignedPayload {
  bytes: string;
  signature: string;
}

export interface WalletRuntimeBridge {
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
  currentAddress: () => string | null;
  signTransaction: (txBytes: Uint8Array) => Promise<SignedPayload>;
  signAndExecuteTransaction: (transaction: Transaction) => Promise<{ txDigest: string }>;
  signPersonalMessage: (message: Uint8Array) => Promise<SignedPayload>;
  getBalance: (address: string) => Promise<number>;
}

let runtimeBridge: WalletRuntimeBridge | null = null;

export function setWalletRuntimeBridge(next: WalletRuntimeBridge | null) {
  runtimeBridge = next;
}

export class WalletServiceError extends Error {
  code: FuelMissionErrorCode;

  constructor(code: FuelMissionErrorCode, message: string) {
    super(message);
    this.name = "WalletServiceError";
    this.code = code;
  }
}

function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
}

function sameAddress(left: string | null | undefined, right: string | null | undefined) {
  if (!left || !right) {
    return false;
  }
  return normalizeAddress(left) === normalizeAddress(right);
}

function parseErrorCode(error: unknown, fallback: FuelMissionErrorCode): FuelMissionErrorCode {
  const rawCode = (error as { code?: string })?.code ?? "";
  const rawMessage = (error as Error)?.message ?? "";
  const raw = `${rawCode} ${rawMessage}`.toLowerCase();

  if (
    raw.includes("unavailable") ||
    raw.includes("wallet not found") ||
    raw.includes("no compatible wallet") ||
    raw.includes("no wallet") ||
    raw.includes("wallet api unavailable")
  ) {
    return "E_WALLET_UNAVAILABLE";
  }

  if (raw.includes("not connected")) {
    return "E_WALLET_NOT_CONNECTED";
  }

  if (raw.includes("reject") || raw.includes("denied") || raw.includes("cancel")) {
    return fallback === "E_WALLET_SIGN_REJECTED" ? "E_WALLET_SIGN_REJECTED" : "E_WALLET_CONNECT_REJECTED";
  }

  if (raw.includes("network") || raw.includes("rpc") || raw.includes("timeout")) {
    return "E_WALLET_NETWORK";
  }

  if (raw.includes("insufficient") || raw.includes("not enough") || raw.includes("balance")) {
    return "E_INSUFFICIENT_BALANCE";
  }

  if (raw.includes("sign")) {
    return "E_WALLET_SIGN_REJECTED";
  }

  return fallback;
}

function getStoredBalance() {
  if (typeof window === "undefined") {
    return 0;
  }
  const raw = window.localStorage.getItem(STORAGE_BALANCE_KEY);
  const parsed = raw ? Number(raw) : NaN;
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

function saveWalletSession(address: string, balance: number) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_ADDRESS_KEY, address);
  window.localStorage.setItem(STORAGE_BALANCE_KEY, String(balance));
}

function saveIdentityProof(address: string, challenge: string, signature: string) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(
    STORAGE_IDENTITY_PROOF_KEY,
    JSON.stringify({
      address,
      challenge,
      signature,
      createdAt: new Date().toISOString()
    })
  );
}

function clearWalletSession() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_ADDRESS_KEY);
  window.localStorage.removeItem(STORAGE_BALANCE_KEY);
  window.localStorage.removeItem(STORAGE_IDENTITY_PROOF_KEY);
}

function shortDelay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function randomNonce() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.floor(Math.random() * 1_000_000_000)}`;
}

function ensureRuntime(): WalletRuntimeBridge {
  if (!runtimeBridge) {
    throw new WalletServiceError("E_WALLET_UNAVAILABLE", "wallet runtime unavailable");
  }
  return runtimeBridge;
}

function buildIdentityChallenge(address: string) {
  const origin = typeof window === "undefined" ? "server" : window.location.origin;
  return [
    "Fuel Frog Panic Wallet Identity", 
    `address=${address}`,
    `origin=${origin}`,
    `nonce=${randomNonce()}`,
    `issuedAt=${new Date().toISOString()}`
  ].join("\n");
}

async function verifyWalletIdentity(address: string, runtime: WalletRuntimeBridge) {
  const challenge = buildIdentityChallenge(address);
  const challengeBytes = new TextEncoder().encode(challenge);
  const signed = await runtime.signPersonalMessage(challengeBytes);

  await verifyPersonalMessageSignature(fromBase64(signed.bytes), signed.signature, {
    address
  });

  saveIdentityProof(address, challenge, signed.signature);
}

function concatBytes(left: Uint8Array, right: Uint8Array) {
  const merged = new Uint8Array(left.length + right.length);
  merged.set(left, 0);
  merged.set(right, left.length);
  return merged;
}

async function digestHex(bytes: Uint8Array) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash))
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");
  }

  let fallback = "";
  for (const value of bytes.slice(0, 20)) {
    fallback += value.toString(16).padStart(2, "0");
  }
  return fallback.padEnd(40, "0");
}

function extractTxDigest(result: unknown) {
  const bridgeDigest = (result as { txDigest?: string })?.txDigest;
  if (typeof bridgeDigest === "string" && bridgeDigest.length > 0) {
    return bridgeDigest;
  }

  const directDigest = (result as { digest?: string })?.digest;
  if (typeof directDigest === "string" && directDigest.length > 0) {
    return directDigest;
  }

  const nestedDigest = (result as { Transaction?: { digest?: string } })?.Transaction?.digest;
  if (typeof nestedDigest === "string" && nestedDigest.length > 0) {
    return nestedDigest;
  }

  return null;
}

export const walletService = {
  getStoredAddress() {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem(STORAGE_ADDRESS_KEY);
  },

  getStoredBalance() {
    return getStoredBalance();
  },

  getActiveAddress() {
    return runtimeBridge?.currentAddress() ?? null;
  },

  async connectWallet(): Promise<{ address: string; balance: number }> {
    if (typeof window === "undefined") {
      throw new WalletServiceError("E_WALLET_UNAVAILABLE", "wallet API unavailable in server context");
    }

    const runtime = ensureRuntime();

    try {
      const connectedAddress = runtime.currentAddress() ?? (await runtime.connect());
      if (!connectedAddress) {
        throw new WalletServiceError("E_WALLET_UNAVAILABLE", "wallet returned no active account");
      }

      await verifyWalletIdentity(connectedAddress, runtime);
      const balance = await runtime.getBalance(connectedAddress);
      saveWalletSession(connectedAddress, balance);

      return { address: connectedAddress, balance };
    } catch (error) {
      throw new WalletServiceError(parseErrorCode(error, "E_WALLET_CONNECT_REJECTED"), "wallet connect failed");
    }
  },

  async disconnectWallet(): Promise<void> {
    try {
      const runtime = runtimeBridge;
      if (runtime) {
        await runtime.disconnect();
      }
    } finally {
      clearWalletSession();
    }
  },

  async signTransaction(txBytes: Uint8Array): Promise<{ signature: string; txDigest: string }> {
    const runtime = ensureRuntime();
    const address = runtime.currentAddress();

    if (!address) {
      throw new WalletServiceError("E_WALLET_NOT_CONNECTED", "wallet not connected");
    }

    let lastError: unknown;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const signed = await runtime.signTransaction(txBytes);
        await verifyTransactionSignature(fromBase64(signed.bytes), signed.signature, {
          address
        });

        const txDigest = await digestHex(concatBytes(fromBase64(signed.bytes), fromBase64(signed.signature)));
        return {
          signature: signed.signature,
          txDigest: `local_${txDigest.slice(0, 40)}`
        };
      } catch (error) {
        lastError = error;
        if (attempt < 2) {
          await shortDelay(250);
        }
      }
    }

    throw new WalletServiceError(parseErrorCode(lastError, "E_WALLET_SIGN_REJECTED"), "wallet sign transaction failed");
  },

  async signAndExecuteEntryPayment(input: {
    recipient: string;
    amountBaseUnits: bigint;
    coinType: string;
  }): Promise<{ txDigest: string }> {
    const runtime = ensureRuntime();
    const address = runtime.currentAddress();

    if (!address) {
      throw new WalletServiceError("E_WALLET_NOT_CONNECTED", "wallet not connected");
    }

    if (input.coinType !== "0x2::sui::SUI") {
      throw new WalletServiceError(
        "E_WALLET_UNAVAILABLE",
        `unsupported coin type for client transfer: ${input.coinType}`
      );
    }

    if (input.amountBaseUnits <= 0n) {
      throw new WalletServiceError("E_INSUFFICIENT_BALANCE", "invalid payment amount");
    }

    const tx = new Transaction();
    const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(input.amountBaseUnits)]);
    tx.transferObjects([paymentCoin], input.recipient);

    let lastError: unknown;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const execution = await runtime.signAndExecuteTransaction(tx);
        const txDigest = extractTxDigest(execution);
        if (!txDigest) {
          throw new WalletServiceError("E_WALLET_NETWORK", "wallet execution returned no tx digest");
        }
        return { txDigest };
      } catch (error) {
        lastError = error;
        if (attempt < 2) {
          await shortDelay(250);
        }
      }
    }

    throw new WalletServiceError(parseErrorCode(lastError, "E_WALLET_NETWORK"), "wallet pay entry transaction failed");
  },

  async getBalance(address: string): Promise<number> {
    const runtime = ensureRuntime();

    if (!sameAddress(address, runtime.currentAddress())) {
      throw new WalletServiceError("E_WALLET_NOT_CONNECTED", "wallet not connected");
    }

    try {
      const balance = await runtime.getBalance(address);
      saveWalletSession(address, balance);
      return balance;
    } catch (error) {
      throw new WalletServiceError(parseErrorCode(error, "E_WALLET_NETWORK"), "wallet balance query failed");
    }
  }
};
