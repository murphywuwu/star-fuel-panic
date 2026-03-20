"use client";

import { useFuelMissionController } from "@/controller/useFuelMissionController";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { SettlementBillPanel } from "@/view/components/SettlementBillPanel";

export function FuelFrogSettlementScreen() {
  const { state, actions } = useFuelMissionController();

  return (
    <FuelMissionShell
      title="Settlement Bill"
      subtitle="Trace gross pool, platform fee, host share, and member payouts with idempotent settlement."
      activeRoute="/settlement"
      phase={state.phase}
      countdownSec={state.countdownSec}
      roomId={state.room?.roomId}
      staleSnapshot={state.staleSnapshot}
    >
      <SettlementBillPanel
        settlementBill={state.settlement}
        memberContributions={state.contributions}
        onSettle={actions.onSettle}
      />
    </FuelMissionShell>
  );
}
