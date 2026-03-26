"use client";

import { useMemo, useState } from "react";
import type { ControllerResult, PlayerContribution, SettlementBill } from "@/types/fuelMission";

interface SettlementBillPanelControllerInput {
  settlementBill: SettlementBill;
  memberContributions: PlayerContribution[];
  onSettle: () => ControllerResult<SettlementBill>;
}

function money(value: number) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value)} LUX`;
}

export function useSettlementBillPanelController({
  settlementBill,
  memberContributions,
  onSettle
}: SettlementBillPanelControllerInput) {
  const [message, setMessage] = useState("SETTLEMENT PIPELINE IDLE");

  const contributionNameMap = useMemo(
    () => new Map(memberContributions.map((item) => [item.playerId, item.name])),
    [memberContributions]
  );

  const rows = useMemo(
    () => [
      { label: "Player Buy-in Pool", value: settlementBill.playerBuyinPool },
      { label: "Gross Pool", value: settlementBill.grossPool },
      { label: "Platform Fee", value: settlementBill.platformFee },
      { label: "Host Fee", value: settlementBill.hostFee },
      { label: "Payout Pool", value: settlementBill.payoutPool }
    ],
    [settlementBill]
  );

  const memberRows = useMemo(
    () =>
      settlementBill.memberPayouts.map((member) => ({
        ...member,
        displayName: contributionNameMap.get(member.playerId) ?? member.playerId,
        displayAmount: money(member.amount)
      })),
    [contributionNameMap, settlementBill.memberPayouts]
  );

  const handleSettle = () => {
    const result = onSettle();
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`SETTLEMENT CONFIRMED // ${result.payload?.settlementId ?? "N/A"}`);
  };

  return {
    settlementBill,
    view: {
      message,
      rows,
      memberRows,
      money
    },
    actions: {
      handleSettle,
      showAuditLog: () => setMessage(`AUDIT LOG READY // ${settlementBill.settlementId ?? "NO SETTLEMENT ID"}`),
      reportIssue: () => setMessage("ISSUE FLAGGED // REVIEW REQUEST SUBMITTED")
    }
  };
}
