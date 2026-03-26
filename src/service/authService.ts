import { authStore, type AuthStore } from "@/model/authStore";
import { WalletServiceError, walletService, type WalletService } from "@/service/walletService";
import type { ControllerResult, FuelMissionErrorCode } from "@/types/fuelMission";

const PAYMENT_RECIPIENT = process.env.NEXT_PUBLIC_ENTRY_PAYMENT_RECIPIENT?.trim() ?? "";
const LUX_COIN_TYPE = process.env.NEXT_PUBLIC_LUX_COIN_TYPE?.trim() || "0x2::sui::SUI";
const LUX_DECIMALS = Number(process.env.NEXT_PUBLIC_LUX_DECIMALS ?? Number.NaN);

/**
 * AuthService - 钱包认证服务
 *
 * 职责：
 * - 管理钱包连接/断开生命周期
 * - 同步钱包状态到 authStore
 * - 封装余额查询和交易签名
 */
class AuthService {
  // ============ Private Fields ============
  // 使用懒加载避免循环依赖问题
  private _store: typeof authStore | null = null;
  private _wallet: WalletService | null = null;

  // ============ Lazy Getters ============
  private get store(): typeof authStore {
    if (!this._store) {
      this._store = authStore;
    }
    return this._store;
  }

  private get wallet(): WalletService {
    if (!this._wallet) {
      this._wallet = walletService;
    }
    return this._wallet;
  }

  // ============ Testing Support ============
  /**
   * 注入依赖（仅用于测试）
   */
  _injectDependencies(store: typeof authStore, wallet: WalletService): void {
    this._store = store;
    this._wallet = wallet;
  }

  // ============ Lifecycle ============

  /**
   * 订阅状态变化（供 useSyncExternalStore 使用）
   */
  subscribe = (listener: () => void): () => void => {
    return this.store.subscribe(listener);
  };

  /**
   * 获取当前状态快照
   */
  getSnapshot = (): AuthStore => {
    return this.store.getState();
  };

  // ============ Public Methods ============

  /**
   * 同步钱包连接中状态
   */
  syncWalletConnecting(isConnecting: boolean): ControllerResult<void> {
    if (this.store.getState().isConnecting === isConnecting) {
      return this.result(true, "wallet connecting state unchanged");
    }
    this.store.getState().setConnecting(isConnecting);
    return this.result(true, isConnecting ? "wallet connecting" : "wallet idle");
  }

  /**
   * 从钱包提供者同步状态
   */
  async syncFromWalletProvider(walletAddress: string): Promise<ControllerResult<{
    walletAddress: string;
    luxBalance: number;
  } | undefined>> {
    if (!walletAddress) {
      return this.result(false, "wallet address missing", undefined, "E_WALLET_UNAVAILABLE");
    }

    try {
      const balance = await this.wallet.getBalance(walletAddress);
      this.store.getState().setWallet(walletAddress, balance);
      return this.result(true, "wallet synchronized", {
        walletAddress,
        luxBalance: balance
      });
    } catch (error) {
      console.error("[wallet] syncFromWalletProvider failed", {
        walletAddress,
        error
      });
      const previousState = this.store.getState();
      const fallbackBalance =
        this.normalizeAddress(previousState.walletAddress) === this.normalizeAddress(walletAddress)
          ? previousState.luxBalance
          : 0;
      this.store.getState().setWallet(walletAddress, fallbackBalance);
      return this.resolveWalletError(error, "E_WALLET_NETWORK", "wallet sync failed");
    }
  }

  /**
   * 同步钱包断开状态
   */
  syncWalletDisconnected(): ControllerResult<void> {
    this.store.getState().disconnect();
    return this.result(true, "wallet disconnected");
  }

  /**
   * 连接钱包
   */
  async connectWallet(): Promise<ControllerResult<{
    walletAddress: string;
    luxBalance: number;
  } | undefined>> {
    this.store.getState().setConnecting(true);
    try {
      const connected = await this.wallet.connectWallet();
      return this.result(true, "wallet connected", {
        walletAddress: connected.address,
        luxBalance: connected.balance
      });
    } catch (error) {
      this.store.getState().setConnecting(false);
      return this.resolveWalletError(error, "E_WALLET_CONNECT_REJECTED", "wallet connect failed");
    }
  }

  /**
   * 断开钱包
   */
  async disconnectWallet(): Promise<ControllerResult<void>> {
    try {
      await this.wallet.disconnectWallet();
      this.store.getState().disconnect();
      return this.result(true, "wallet disconnected");
    } catch (error) {
      return this.resolveWalletError(error, "E_WALLET_NETWORK", "wallet disconnect failed");
    }
  }

  /**
   * 刷新余额
   */
  async refreshBalance(): Promise<ControllerResult<{ luxBalance: number } | undefined>> {
    const state = this.store.getState();
    if (!state.walletAddress || !state.isConnected) {
      return this.result(false, "wallet not connected", undefined, "E_WALLET_NOT_CONNECTED");
    }

    try {
      const balance = await this.wallet.getBalance(state.walletAddress);
      this.store.getState().updateBalance(balance);
      return this.result(true, "balance refreshed", { luxBalance: balance });
    } catch (error) {
      console.error("[wallet] refreshBalance failed", {
        walletAddress: state.walletAddress,
        error
      });
      return this.resolveWalletError(error, "E_WALLET_NETWORK", "wallet balance refresh failed");
    }
  }

  /**
   * 签名交易
   */
  async signTransaction(txBytes: Uint8Array): Promise<ControllerResult<{
    signature: string;
    txDigest: string;
  } | undefined>> {
    const state = this.store.getState();
    if (!state.walletAddress || !state.isConnected) {
      return this.result(false, "wallet not connected", undefined, "E_WALLET_NOT_CONNECTED");
    }

    try {
      const signed = await this.wallet.signTransaction(txBytes);
      return this.result(true, "transaction signed", signed);
    } catch (error) {
      return this.resolveWalletError(error, "E_WALLET_SIGN_REJECTED", "wallet sign failed");
    }
  }

  /**
   * 执行入场费支付
   */
  async executeEntryPayment(amountLux: number): Promise<ControllerResult<{
    txDigest: string;
    recipient: string;
    luxBalance: number;
  } | undefined>> {
    const state = this.store.getState();
    if (!state.walletAddress || !state.isConnected) {
      return this.result(false, "wallet not connected", undefined, "E_WALLET_NOT_CONNECTED");
    }

    if (!PAYMENT_RECIPIENT) {
      return this.result(false, "entry payment recipient is not configured", undefined, "E_WALLET_UNAVAILABLE");
    }

    const amountBaseUnits = this.toBaseUnits(amountLux, LUX_DECIMALS);
    if (amountBaseUnits <= 0n) {
      return this.result(false, "invalid entry fee amount", undefined, "E_INSUFFICIENT_BALANCE");
    }

    try {
      const payment = await this.wallet.signAndExecuteEntryPayment({
        recipient: PAYMENT_RECIPIENT,
        amountBaseUnits,
        coinType: LUX_COIN_TYPE
      });

      const balance = await this.wallet.getBalance(state.walletAddress);
      this.store.getState().updateBalance(balance);

      return this.result(true, "entry payment executed", {
        txDigest: payment.txDigest,
        recipient: PAYMENT_RECIPIENT,
        luxBalance: balance
      });
    } catch (error) {
      return this.resolveWalletError(error, "E_WALLET_NETWORK", "entry payment transaction failed");
    }
  }

  // ============ Private Helpers ============

  private result<T>(
    ok: boolean,
    message: string,
    payload?: T,
    errorCode?: FuelMissionErrorCode
  ): ControllerResult<T | undefined> {
    return { ok, message, payload, errorCode };
  }

  private resolveWalletError<T>(
    error: unknown,
    fallbackCode: FuelMissionErrorCode,
    fallbackMessage: string
  ): ControllerResult<T | undefined> {
    if (error instanceof WalletServiceError) {
      return this.result(false, error.message, undefined, error.code);
    }
    return this.result(false, fallbackMessage, undefined, fallbackCode);
  }

  private normalizeAddress(address: string | null | undefined): string | null {
    return address?.trim().toLowerCase() ?? null;
  }

  private toBaseUnits(amount: number, decimals: number): bigint {
    if (!Number.isFinite(amount) || amount <= 0) {
      return 0n;
    }

    const safeDecimals = Number.isFinite(decimals) && decimals >= 0 ? Math.floor(decimals) : 9;
    const fixed = amount.toFixed(safeDecimals);
    const [wholePart, fractionPart = ""] = fixed.split(".");
    const combined = `${wholePart}${fractionPart.padEnd(safeDecimals, "0")}`.replace(/^0+/, "") || "0";
    return BigInt(combined);
  }
}

// 导出单例实例
export const authService = new AuthService();

// 导出类（用于测试 mock）
export { AuthService };
