"use client";

import { useMemo, useState } from "react";
import { useAuthController, walletErrorMessage } from "@/controller/useAuthController";
import { useFuelMissionController } from "@/controller/useFuelMissionController";

export function useFuelFrogSettlementScreenController() {
  const mission = useFuelMissionController();
  const auth = useAuthController();
  const [message, setMessage] = useState("READY // CONNECT WALLET TO CLAIM & FINALIZE");

  const pilotEarnings = useMemo(() => {
    const topContribution = mission.state.contributions[0];
    if (!topContribution) {
      return { pilotName: "Pilot Alpha", payoutAmount: 0 };
    }

    const payout =
      mission.state.settlement.memberPayouts.find((item) => item.playerId === topContribution.playerId)?.amount ?? 0;
    return { pilotName: topContribution.name, payoutAmount: payout };
  }, [mission.state.contributions, mission.state.settlement.memberPayouts]);

  const handleSettle = () => {
    if (!auth.state.isConnected) {
      setMessage("WALLET NOT CONNECTED // SETTLEMENT ACTION LOCKED");
      return;
    }

    const result = mission.actions.onSettle();
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${walletErrorMessage(result.errorCode, result.message)}`);
      return;
    }

    setMessage(`SETTLEMENT READY // ${result.payload?.settlementId ?? "N/A"}`);
  };

  return {
    mission,
    auth,
    view: {
      message,
      pilotEarnings
    },
    actions: {
      handleSettle,
      showAuditLog: () => setMessage("AUDIT LOG AVAILABLE IN EVENT FEED")
    }
  };
}
