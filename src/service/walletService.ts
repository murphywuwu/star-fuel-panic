import { fromBase64 } from "@mysten/sui/utils";
import { verifyTransactionSignature } from "@mysten/sui/verify";
import { Transaction } from "@mysten/sui/transactions";
import type { FuelMissionErrorCode } from "@/types/fuelMission";

const LEGACY_STORAGE_IDENTITY_PROOF_KEY = "ffp.wallet.identity_proof";

interface SignedPayload {
  bytes: string;
  signature: string;
}

export interface WalletRuntimeBridge {
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
  currentAddress: () => string | null;
  isWalletReady?: () => boolean;
  signTransaction: (txBytes: Uint8Array) => Promise<SignedPayload>;
  signAndExecuteTransaction: (transaction: Transaction) => Promise<{ txDigest: string }>;
  getBalance: (address: string) => Promise<number>;
}

export class WalletServiceError extends Error {
  code: FuelMissionErrorCode;

  constructor(code: FuelMissionErrorCode, message: string) {
    super(message);
    this.name = "WalletServiceError";
    this.code = code;
  }
}

/**
 * WalletService - 钱包底层操作服务
 *
 * 职责：
 * - Sui 钱包连接/断开
 * - 交易签名和执行
 * - 余额查询
 *
 * 注意：此服务不依赖任何 Store，是最底层的钱包操作封装
 */
class WalletServiceImpl {
  // ============ Private Fields ============
  private runtimeBridge: WalletRuntimeBridge | null = null;

  // ============ Runtime Bridge Management ============

  /**
   * 设置钱包运行时桥接（由 useAuthController 在 useEffect 中调用）
   */
  setRuntimeBridge(bridge: WalletRuntimeBridge | null): void {
    this.runtimeBridge = bridge;
  }

  // ============ Public Methods ============

  /**
   * 获取当前活跃地址
   */
  getActiveAddress(): string | null {
    if (!this.runtimeBridge) {
      return null;
    }
    if (this.runtimeBridge.isWalletReady && !this.runtimeBridge.isWalletReady()) {
      return null;
    }
    return this.runtimeBridge.currentAddress();
  }

  /**
   * 连接钱包
   */
  async connectWallet(): Promise<{ address: string; balance: number }> {
    if (typeof window === "undefined") {
      throw new WalletServiceError("E_WALLET_UNAVAILABLE", "wallet API unavailable in server context");
    }

    const runtime = this.ensureRuntime();

    try {
      const connectedAddress = await runtime.connect();
      if (!connectedAddress) {
        throw new WalletServiceError("E_WALLET_UNAVAILABLE", "wallet returned no active account");
      }

      const balance = await runtime.getBalance(connectedAddress);
      return { address: connectedAddress, balance };
    } catch (error) {
      throw new WalletServiceError(
        this.parseErrorCode(error, "E_WALLET_CONNECT_REJECTED"),
        this.resolveErrorMessage(error, "wallet connect failed")
      );
    }
  }

  /**
   * 断开钱包
   */
  async disconnectWallet(): Promise<void> {
    try {
      const runtime = this.runtimeBridge;
      if (runtime) {
        await runtime.disconnect();
      }
    } finally {
      this.clearWalletArtifacts();
    }
  }

  /**
   * 签名交易
   */
  async signTransaction(txBytes: Uint8Array): Promise<{ signature: string; txDigest: string }> {
    const runtime = this.ensureRuntime();
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

        const txDigest = await this.digestHex(this.concatBytes(fromBase64(signed.bytes), fromBase64(signed.signature)));
        return {
          signature: signed.signature,
          txDigest: `local_${txDigest.slice(0, 40)}`
        };
      } catch (error) {
        lastError = error;
        if (attempt < 2) {
          await this.shortDelay(250);
        }
      }
    }

    throw new WalletServiceError(
      this.parseErrorCode(lastError, "E_WALLET_SIGN_REJECTED"),
      this.resolveErrorMessage(lastError, "wallet sign transaction failed")
    );
  }

  /**
   * 签名并执行入场费支付
   */
  async signAndExecuteEntryPayment(input: {
    recipient: string;
    amountBaseUnits: bigint;
    coinType: string;
  }): Promise<{ txDigest: string }> {
    const runtime = this.ensureRuntime();
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
        const txDigest = this.extractTxDigest(execution);
        if (!txDigest) {
          throw new WalletServiceError("E_WALLET_NETWORK", "wallet execution returned no tx digest");
        }
        return { txDigest };
      } catch (error) {
        lastError = error;
        if (attempt < 2) {
          await this.shortDelay(250);
        }
      }
    }

    throw new WalletServiceError(
      this.parseErrorCode(lastError, "E_WALLET_NETWORK"),
      this.resolveErrorMessage(lastError, "wallet pay entry transaction failed")
    );
  }

  /**
   * 获取余额
   */
  async getBalance(address: string): Promise<number> {
    const runtime = this.ensureRuntime();

    if (!this.sameAddress(address, runtime.currentAddress())) {
      throw new WalletServiceError("E_WALLET_NOT_CONNECTED", "wallet not connected");
    }

    try {
      return await runtime.getBalance(address);
    } catch (error) {
      throw new WalletServiceError(
        this.parseErrorCode(error, "E_WALLET_NETWORK"),
        this.resolveErrorMessage(error, "wallet balance query failed")
      );
    }
  }

  // ============ Private Helpers ============

  private ensureRuntime(): WalletRuntimeBridge {
    if (!this.runtimeBridge) {
      throw new WalletServiceError("E_WALLET_UNAVAILABLE", "wallet runtime unavailable");
    }
    return this.runtimeBridge;
  }

  private normalizeAddress(address: string): string {
    return address.trim().toLowerCase();
  }

  private sameAddress(left: string | null | undefined, right: string | null | undefined): boolean {
    if (!left || !right) {
      return false;
    }
    return this.normalizeAddress(left) === this.normalizeAddress(right);
  }

  private parseErrorCode(error: unknown, fallback: FuelMissionErrorCode): FuelMissionErrorCode {
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

    if (
      raw.includes("autherror") ||
      raw.includes("auth error") ||
      raw.includes("login") ||
      raw.includes("jwt") ||
      raw.includes("nonce")
    ) {
      return "E_WALLET_CONNECT_REJECTED";
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

  private resolveErrorMessage(error: unknown, fallback: string): string {
    const rawCode = (error as { code?: string })?.code;
    const rawMessage = (error as { message?: string })?.message;
    const pieces = [rawCode, rawMessage].filter((value): value is string => typeof value === "string" && value.trim().length > 0);
    if (pieces.length === 0) {
      return fallback;
    }

    const combined = pieces.join(": ");
    const lower = combined.toLowerCase();
    if (lower === "unknown error" || lower.endsWith(": unknown error")) {
      return fallback;
    }

    return combined;
  }

  private clearWalletArtifacts(): void {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.removeItem(LEGACY_STORAGE_IDENTITY_PROOF_KEY);
  }

  private shortDelay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private concatBytes(left: Uint8Array, right: Uint8Array): Uint8Array {
    const merged = new Uint8Array(left.length + right.length);
    merged.set(left, 0);
    merged.set(right, left.length);
    return merged;
  }

  private async digestHex(bytes: Uint8Array): Promise<string> {
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

  private extractTxDigest(result: unknown): string | null {
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
}

// 导出单例实例
export const walletService = new WalletServiceImpl();

// 导出类型接口（用于依赖注入）
export type WalletService = WalletServiceImpl;

// 兼容旧版 API：setWalletRuntimeBridge
export function setWalletRuntimeBridge(bridge: WalletRuntimeBridge | null): void {
  walletService.setRuntimeBridge(bridge);
}
