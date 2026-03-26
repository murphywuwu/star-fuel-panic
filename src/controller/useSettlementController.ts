"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { fuelMissionStore } from "@/model/fuelMissionStore";
import { authStore } from "@/model/authStore";
import {
  selectMvp,
  selectMyPayout,
  settlementStore
} from "@/model/settlementStore";
import { settlementService } from "@/service/settlementService";
import type { ControllerResult } from "@/types/common";
import type { MemberPayout, MvpInfo, SettlementBill, SettlementStatus } from "@/types/settlement";

interface SettlementControllerState {
  status: SettlementStatus | null;
  bill: SettlementBill | null;
  loading: boolean;
  error: string | null;
  myPayout: MemberPayout | null;
  mvp: MvpInfo | null;
  loadStatus: (matchId: string) => Promise<ControllerResult<void>>;
  loadBill: (matchId: string) => Promise<ControllerResult<void>>;
}

export function useSettlementController(): SettlementControllerState {
  const settlementState = useSyncExternalStore(
    settlementStore.subscribe,
    settlementStore.getState,
    settlementStore.getState
  );
  const authState = useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    authStore.getState
  );
  const missionState = useSyncExternalStore(
    fuelMissionStore.subscribe,
    fuelMissionStore.getState,
    fuelMissionStore.getState
  );

  const resolvedWallet =
    authState.walletAddress ?? missionState.contributions[0]?.playerId ?? null;

  const myPayout = useMemo(
    () => selectMyPayout(settlementState, resolvedWallet),
    [settlementState, resolvedWallet]
  );
  const mvp = useMemo(() => selectMvp(settlementState), [settlementState]);

  const loadStatus = useCallback(async (matchId: string): Promise<ControllerResult<void>> => {
    settlementStore.getState().setLoading(true);
    settlementStore.getState().setError(null);
    try {
      const status = await settlementService.getSettlementStatus(matchId);
      settlementStore.getState().setStatus(status);
      return {
        ok: true,
        message: "SETTLEMENT_STATUS_LOADED"
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "SETTLEMENT_STATUS_LOAD_FAILED";
      settlementStore.getState().setError(message);
      return {
        ok: false,
        errorCode: "SETTLEMENT_STATUS_LOAD_FAILED",
        message
      };
    } finally {
      settlementStore.getState().setLoading(false);
    }
  }, []);

  const loadBill = useCallback(async (matchId: string): Promise<ControllerResult<void>> => {
    settlementStore.getState().setLoading(true);
    settlementStore.getState().setError(null);
    try {
      const bill = await settlementService.getSettlementBill(matchId);
      settlementStore.getState().setBill(bill);
      return {
        ok: true,
        message: "SETTLEMENT_BILL_LOADED"
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "SETTLEMENT_BILL_LOAD_FAILED";
      settlementStore.getState().setError(message);
      return {
        ok: false,
        errorCode: "SETTLEMENT_BILL_LOAD_FAILED",
        message
      };
    } finally {
      settlementStore.getState().setLoading(false);
    }
  }, []);

  return {
    status: settlementState.status,
    bill: settlementState.bill,
    loading: settlementState.loading,
    error: settlementState.error,
    myPayout,
    mvp,
    loadStatus,
    loadBill
  };
}
