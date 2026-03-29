import { authStore, type AuthStore } from "@/model/authStore";
import { WalletServiceError, walletService, type WalletService } from "@/service/walletService";
import type { ControllerResult, FuelMissionErrorCode } from "@/types/fuelMission";
import { describePackageAvailabilityMismatch } from "@/utils/suiPackageProbe";
import { toBaseUnits } from "@/utils/tokenAmount";

const PAYMENT_RECIPIENT = process.env.NEXT_PUBLIC_ENTRY_PAYMENT_RECIPIENT?.trim() ?? "";
const FUEL_FROG_PACKAGE_ID =
  process.env.NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID?.trim() ??
  process.env.NEXT_PUBLIC_FUEL_FROG_CONTRACT_PACKAGE_ID?.trim() ??
  "";
const MATCH_SPONSORSHIP_RECIPIENT =
  process.env.NEXT_PUBLIC_MATCH_SPONSORSHIP_RECIPIENT?.trim() ??
  process.env.NEXT_PUBLIC_ENTRY_PAYMENT_RECIPIENT?.trim() ??
  "";
const LUX_COIN_TYPE = process.env.NEXT_PUBLIC_LUX_COIN_TYPE?.trim() || "0x2::sui::SUI";
const LUX_DECIMALS = Number(process.env.NEXT_PUBLIC_LUX_DECIMALS ?? Number.NaN);
const SUI_NETWORK_LABEL = process.env.NEXT_PUBLIC_SUI_NETWORK?.trim() || "configured";

export type TeamEntryEscrowPaymentInput = {
  roomId: string;
  escrowId: string;
  teamRef: string;
  memberCount: number;
  amountLux: number;
};

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
  async executeEntryPayment(input: number | TeamEntryEscrowPaymentInput): Promise<ControllerResult<{
    txDigest: string;
    recipient: string;
    luxBalance: number;
  } | undefined>> {
    if (typeof input === "number") {
      return this.executeLuxTransfer(
        input,
        PAYMENT_RECIPIENT,
        "entry payment recipient is not configured",
        "entry payment executed"
      );
    }

    return this.executeTeamEntryEscrowPayment(input);
  }

  async executeSponsorshipPayment(amountLux: number): Promise<ControllerResult<{
    txDigest: string;
    recipient: string;
    luxBalance: number;
  } | undefined>> {
    return this.executeLuxTransfer(
      amountLux,
      MATCH_SPONSORSHIP_RECIPIENT,
      "match sponsorship recipient is not configured",
      "match sponsorship payment executed"
    );
  }

  // ============ Private Helpers ============

  private async executeLuxTransfer(
    amountLux: number,
    recipient: string,
    missingRecipientMessage: string,
    successMessage: string
  ): Promise<ControllerResult<{
    txDigest: string;
    recipient: string;
    luxBalance: number;
  } | undefined>> {
    const state = this.store.getState();
    if (!state.walletAddress || !state.isConnected) {
      return this.result(false, "wallet not connected", undefined, "E_WALLET_NOT_CONNECTED");
    }

    if (!recipient) {
      return this.result(false, missingRecipientMessage, undefined, "E_WALLET_UNAVAILABLE");
    }

    const amountBaseUnits = toBaseUnits(amountLux, LUX_DECIMALS);
    if (amountBaseUnits <= 0n) {
      return this.result(false, "invalid entry fee amount", undefined, "E_INSUFFICIENT_BALANCE");
    }

    try {
      const payment = await this.wallet.signAndExecuteEntryPayment({
        recipient,
        amountBaseUnits,
        coinType: LUX_COIN_TYPE
      });

      const balance = await this.wallet.getBalance(state.walletAddress);
      this.store.getState().updateBalance(balance);

      return this.result(true, successMessage, {
        txDigest: payment.txDigest,
        recipient,
        luxBalance: balance
      });
    } catch (error) {
      return this.resolveWalletError(error, "E_WALLET_NETWORK", "entry payment transaction failed");
    }
  }

  private async executeTeamEntryEscrowPayment(
    input: TeamEntryEscrowPaymentInput
  ): Promise<ControllerResult<{
    txDigest: string;
    recipient: string;
    luxBalance: number;
  } | undefined>> {
    const state = this.store.getState();
    if (!state.walletAddress || !state.isConnected) {
      return this.result(false, "wallet not connected", undefined, "E_WALLET_NOT_CONNECTED");
    }

    if (!FUEL_FROG_PACKAGE_ID) {
      return this.result(false, "fuel frog package id is not configured", undefined, "E_WALLET_UNAVAILABLE");
    }
    if (!input.roomId.trim() || !input.escrowId.trim()) {
      return this.result(false, "match escrow is not ready", undefined, "E_WALLET_UNAVAILABLE");
    }

    const amountBaseUnits = toBaseUnits(input.amountLux, LUX_DECIMALS);
    if (amountBaseUnits <= 0n) {
      return this.result(false, "invalid entry fee amount", undefined, "E_INSUFFICIENT_BALANCE");
    }

    try {
      const packageExists = await this.wallet.objectExists(FUEL_FROG_PACKAGE_ID);
      if (!packageExists) {
        const hint = await describePackageAvailabilityMismatch(FUEL_FROG_PACKAGE_ID, SUI_NETWORK_LABEL);
        return this.result(
          false,
          hint,
          undefined,
          "E_WALLET_UNAVAILABLE"
        );
      }

      const payment = await this.wallet.signAndExecuteTeamEntryEscrowPayment({
        packageId: FUEL_FROG_PACKAGE_ID,
        roomId: input.roomId,
        escrowId: input.escrowId,
        teamRef: input.teamRef,
        memberCount: input.memberCount,
        quotedAmountLux: input.amountLux,
        amountBaseUnits,
        coinType: LUX_COIN_TYPE
      });

      const balance = await this.wallet.getBalance(state.walletAddress);
      this.store.getState().updateBalance(balance);

      return this.result(true, "entry payment locked into match escrow", {
        txDigest: payment.txDigest,
        recipient: input.escrowId,
        luxBalance: balance
      });
    } catch (error) {
      if (error instanceof WalletServiceError && error.message.includes(FUEL_FROG_PACKAGE_ID) && /object .*not found/i.test(error.message)) {
        return this.result(
          false,
          `escrow package ${FUEL_FROG_PACKAGE_ID} is not available on ${SUI_NETWORK_LABEL}; check wallet network and NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID`,
          undefined,
          "E_WALLET_UNAVAILABLE"
        );
      }
      return this.resolveWalletError(error, "E_WALLET_NETWORK", "team escrow payment transaction failed");
    }
  }

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
}

// 导出单例实例
export const authService = new AuthService();

// 导出类（用于测试 mock）
export { AuthService };
