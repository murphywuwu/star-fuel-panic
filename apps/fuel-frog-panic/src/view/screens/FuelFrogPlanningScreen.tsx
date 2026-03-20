"use client";

import { useFuelMissionController } from "@/controller/useFuelMissionController";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { RoleLockPanel } from "@/view/components/RoleLockPanel";

export function FuelFrogPlanningScreen() {
  const { state, actions } = useFuelMissionController();

  return (
    <FuelMissionShell
      title="Planning / Role Lock"
      subtitle="Assign Collector, Hauler, Escort, Dispatcher and start match execution."
      activeRoute="/planning"
      phase={state.phase}
      countdownSec={state.countdownSec}
      roomId={state.room?.roomId}
      staleSnapshot={state.staleSnapshot}
    >
      <RoleLockPanel
        teams={state.teams}
        phase={state.phase}
        planningCountdown={state.countdownSec}
        rolesLocked={state.room?.rolesLocked ?? false}
        onEnterPlanning={actions.onEnterPlanning}
        onLockRole={actions.onLockRole}
        onStartMatch={actions.onStartMatch}
      />
    </FuelMissionShell>
  );
}
