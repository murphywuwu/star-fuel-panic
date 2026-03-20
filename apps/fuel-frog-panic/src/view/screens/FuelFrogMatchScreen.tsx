"use client";

import { useFuelMissionController } from "@/controller/useFuelMissionController";
import { ContributionBoard } from "@/view/components/ContributionBoard";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { NodeMapPanel } from "@/view/components/NodeMapPanel";
import { RiskHeatPanel } from "@/view/components/RiskHeatPanel";

export function FuelFrogMatchScreen() {
  const { state, actions } = useFuelMissionController();

  return (
    <FuelMissionShell
      title="Tactical Command Map"
      subtitle="Execute supply loops, track node fill ratio, and react to risk heat in real time."
      activeRoute="/match"
      phase={state.phase}
      countdownSec={state.countdownSec}
      roomId={state.room?.roomId}
      staleSnapshot={state.staleSnapshot}
      bannerMessage={state.staleSnapshot ? "STALE SNAPSHOT // RETRY REFRESH FROM TELEMETRY PANEL" : undefined}
    >
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
      <section className="grid gap-4 lg:grid-cols-2">
        <ContributionBoard contributions={state.contributions} teams={state.teams} teamScore={state.teamScore} />
        <RiskHeatPanel riskMarkers={state.riskMarkers} />
      </section>
    </FuelMissionShell>
  );
}
