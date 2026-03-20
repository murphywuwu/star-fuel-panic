import { useMemo, useState } from "react";
import type { ControllerResult, MissionPhase } from "@/types/fuelMission";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

interface FinalSprintAlertLayerProps {
  phase: MissionPhase;
  remainingSec: number;
  onSubmitSupplyRun: (
    nodeId: string,
    playerId: string,
    playerName: string,
    contributionDelta?: number,
    fillDelta?: number
  ) => ControllerResult<{ criticalNodes: string[] }>;
  onTick: () => ControllerResult<{ countdownSec: number }>;
}

const SPRINT_TASKS = [
  { id: "task-aurora", title: "Aurora Corridor Relay", multiplier: "x1.8", nodeId: "n3" },
  { id: "task-kite", title: "Kite Gate Emergency Fuel", multiplier: "x1.5", nodeId: "n2" }
];

export function FinalSprintAlertLayer({ phase, remainingSec, onSubmitSupplyRun, onTick }: FinalSprintAlertLayerProps) {
  const [message, setMessage] = useState("FINAL SPRINT LAYER STANDBY");

  const isFinalSprint = phase === "FinalSprint" || remainingSec <= 90;
  const statusLabel = useMemo(
    () => (isFinalSprint ? "FINAL SPRINT ACTIVE" : "WAITING FOR FINAL SPRINT WINDOW"),
    [isFinalSprint]
  );

  const handleCommitSprint = (nodeId: string) => {
    const result = onSubmitSupplyRun(nodeId, "pilot-alpha", "Pilot Alpha", 60, 0.25);
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${result.message}`);
      return;
    }
    setMessage(`SPRINT ROUTE COMMITTED // ${nodeId.toUpperCase()} // MULTIPLIER TASK`);
  };

  const handleSafeRoute = () => {
    const result = onSubmitSupplyRun("n1", "pilot-alpha", "Pilot Alpha", 30, 0.14);
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${result.message}`);
      return;
    }
    setMessage("SAFE ROUTE COMMITTED // LOWER RISK PROFILE");
  };

  const handleTick = () => {
    const result = onTick();
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${result.message}`);
      return;
    }
    setMessage(`COUNTDOWN ADVANCED // ${result.payload?.countdownSec ?? remainingSec}s`);
  };

  return (
    <TacticalPanel title="Final Sprint Alert Layer" eyebrow="S-004 / IA-004">
      <div className="border border-eve-red bg-eve-red/20 px-3 py-3">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-eve-offwhite">FINAL SPRINT</p>
        <p className="mt-1 text-sm text-eve-offwhite/90">{statusLabel}</p>
        <p className="mt-2 font-mono text-lg text-eve-yellow">T-{remainingSec}s</p>
      </div>

      <ul className="mt-4 grid gap-2 md:grid-cols-2">
        {SPRINT_TASKS.map((task) => (
          <li key={task.id} className="border border-eve-yellow/40 bg-eve-black/70 p-3 text-xs text-eve-offwhite/90">
            <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">{task.title}</p>
            <p className="mt-1">Multiplier: {task.multiplier}</p>
            <TacticalButton className="mt-3" onClick={() => handleCommitSprint(task.nodeId)}>
              Commit Sprint Route
            </TacticalButton>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <TacticalButton tone="ghost" onClick={handleSafeRoute}>
          Fallback Safe Route
        </TacticalButton>
        <TacticalButton tone="ghost" onClick={handleTick}>
          Tick +10s
        </TacticalButton>
      </div>

      <p className="mt-4 border border-eve-yellow/40 bg-eve-black/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em]">
        {message}
      </p>
    </TacticalPanel>
  );
}
