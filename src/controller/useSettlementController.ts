"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { authService } from "@/service/authService";
import { fuelMissionService } from "@/service/fuelMissionService";
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

function selectMyPayout(bill: SettlementBill | null, walletAddress: string | null): MemberPayout | null {
  if (!bill || !walletAddress) {
    return null;
  }

  for (const team of bill.teamBreakdown) {
    const found = team.members.find((member) => member.walletAddress === walletAddress);
    if (found) {
      return found;
    }
  }

  return null;
}

function selectMvp(bill: SettlementBill | null): MvpInfo | null {
  return bill?.mvp ?? null;
}

export function useSettlementController(): SettlementControllerState {
  const settlementState = useSyncExternalStore(
    settlementService.subscribe.bind(settlementService),
    settlementService.getSnapshot.bind(settlementService),
    settlementService.getSnapshot.bind(settlementService)
  );
  const authState = useSyncExternalStore(
    authService.subscribe,
    authService.getSnapshot,
    authService.getSnapshot
  );
  const missionState = useSyncExternalStore(
    fuelMissionService.subscribe.bind(fuelMissionService),
    fuelMissionService.getSnapshot.bind(fuelMissionService),
    fuelMissionService.getSnapshot.bind(fuelMissionService)
  );

  const resolvedWallet =
    authState.walletAddress ?? missionState.contributions[0]?.playerId ?? null;

  const myPayout = useMemo(
    () => selectMyPayout(settlementState.bill, resolvedWallet),
    [settlementState.bill, resolvedWallet]
  );
  const mvp = useMemo(() => selectMvp(settlementState.bill), [settlementState.bill]);

  const loadStatus = useCallback(async (matchId: string): Promise<ControllerResult<void>> => {
    settlementService.getSnapshot().setLoading(true);
    settlementService.getSnapshot().setError(null);
    try {
      const status = await settlementService.getSettlementStatus(matchId);
      settlementService.getSnapshot().setStatus(status);
      return {
        ok: true,
        message: "SETTLEMENT_STATUS_LOADED"
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "SETTLEMENT_STATUS_LOAD_FAILED";
      settlementService.getSnapshot().setError(message);
      return {
        ok: false,
        errorCode: "SETTLEMENT_STATUS_LOAD_FAILED",
        message
      };
    } finally {
      settlementService.getSnapshot().setLoading(false);
    }
  }, []);

  const loadBill = useCallback(async (matchId: string): Promise<ControllerResult<void>> => {
    settlementService.getSnapshot().setLoading(true);
    settlementService.getSnapshot().setError(null);
    try {
      const bill = await settlementService.getSettlementBill(matchId);
      settlementService.getSnapshot().setBill(bill);
      return {
        ok: true,
        message: "SETTLEMENT_BILL_LOADED"
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "SETTLEMENT_BILL_LOAD_FAILED";
      settlementService.getSnapshot().setError(message);
      return {
        ok: false,
        errorCode: "SETTLEMENT_BILL_LOAD_FAILED",
        message
      };
    } finally {
      settlementService.getSnapshot().setLoading(false);
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
