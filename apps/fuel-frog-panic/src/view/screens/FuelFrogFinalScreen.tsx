"use client";

import { useFuelMissionController } from "@/controller/useFuelMissionController";
import { FinalSprintAlertLayer } from "@/view/components/FinalSprintAlertLayer";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { NodeMapPanel } from "@/view/components/NodeMapPanel";

export function FuelFrogFinalScreen() {
  const { state, actions } = useFuelMissionController();

  return (
    <FuelMissionShell
      title="Final Sprint Alert Layer"
      subtitle="High-risk multiplier routes open in the last 90 seconds. Commit or fallback."
      activeRoute="/final"
      phase={state.phase}
      countdownSec={state.countdownSec}
      roomId={state.room?.roomId}
      staleSnapshot={state.staleSnapshot}
      bannerMessage={state.phase !== "FinalSprint" ? "FINAL SPRINT NOT ACTIVE YET // USE TICK TO ADVANCE COUNTDOWN" : undefined}
      bannerTone={state.phase !== "FinalSprint" ? "warning" : undefined}
    >
      <FinalSprintAlertLayer
        phase={state.phase}
        remainingSec={state.countdownSec}
        onSubmitSupplyRun={actions.onSubmitSupplyRun}
        onTick={actions.onTick}
      />
      <NodeMapPanel
        nodes={state.nodes}
        countdownSec={state.countdownSec}
        phase={state.phase}
        staleSnapshot={state.staleSnapshot}
        auditLogs={state.auditLogs}
        onSubmitSupplyRun={actions.onSubmitSupplyRun}
        onRefresh={actions.onRefresh}
        onTick={actions.onTick}
      />
    </FuelMissionShell>
  );
}
