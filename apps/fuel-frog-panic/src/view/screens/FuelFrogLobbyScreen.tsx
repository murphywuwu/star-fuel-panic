"use client";

import { useFuelMissionController } from "@/controller/useFuelMissionController";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { MissionLobbyPanel } from "@/view/components/MissionLobbyPanel";

export function FuelFrogLobbyScreen() {
  const { state, actions } = useFuelMissionController();

  return (
    <FuelMissionShell
      title="Mission Lobby / Buy-in"
      subtitle="Review node deficits, confirm buy-in, and lock entry within 30 seconds."
      activeRoute="/lobby"
      phase={state.phase}
      countdownSec={state.countdownSec}
      roomId={state.room?.roomId}
      staleSnapshot={state.staleSnapshot}
    >
      <MissionLobbyPanel
        room={state.room}
        funding={state.funding}
        nodes={state.nodes}
        teams={state.teams}
        onInitMission={actions.onInitMission}
        onCreateRoom={actions.onCreateRoom}
        onJoinRoom={actions.onJoinRoom}
      />
    </FuelMissionShell>
  );
}
