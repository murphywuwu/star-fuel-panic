import { useMemo, useState } from "react";
import type {
  AuditLog,
  ControllerResult,
  MissionPhase,
  NodeDeficitSnapshot,
  RiskMarker
} from "@/types/fuelMission";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

interface NodeMapPanelProps {
  nodes: NodeDeficitSnapshot[];
  countdownSec: number;
  phase: MissionPhase;
  staleSnapshot: boolean;
  auditLogs: AuditLog[];
  onSubmitSupplyRun: (
    nodeId: string,
    playerId: string,
    playerName: string,
    contributionDelta?: number,
    fillDelta?: number
  ) => ControllerResult<{ criticalNodes: string[] }>;
  onRefresh: () => Promise<ControllerResult<{ stale: boolean; source: string }>>;
  onTick: () => ControllerResult<{ countdownSec: number }>;
}

function riskTone(weight: number): RiskMarker["severity"] {
  if (weight >= 1.7) {
    return "high";
  }
  if (weight >= 1.3) {
    return "medium";
  }
  return "low";
}

function toneClass(severity: RiskMarker["severity"]) {
  if (severity === "high") {
    return "text-eve-red";
  }
  if (severity === "medium") {
    return "text-eve-yellow";
  }
  return "text-eve-offwhite/90";
}

export function NodeMapPanel({
  nodes,
  countdownSec,
  phase,
  staleSnapshot,
  auditLogs,
  onSubmitSupplyRun,
  onRefresh,
  onTick
}: NodeMapPanelProps) {
  const [eventMessage, setEventMessage] = useState("TACTICAL GRID ONLINE");
  const [refreshing, setRefreshing] = useState(false);

  const eventFeed = useMemo(
    () => auditLogs.filter((log) => log.action.includes("supply") || log.action.includes("transition")).slice(0, 8),
    [auditLogs]
  );

  const handleSubmit = (nodeId: string, boost = false) => {
    const result = onSubmitSupplyRun(nodeId, "pilot-alpha", "Pilot Alpha", boost ? 35 : 20, boost ? 0.18 : 0.1);
    if (!result.ok) {
      setEventMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${result.message}`);
      return;
    }
    setEventMessage(`SUPPLY RUN COMMITTED // ${nodeId.toUpperCase()}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await onRefresh();
    setRefreshing(false);

    if (!result.ok) {
      setEventMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${result.message}`);
      return;
    }

    setEventMessage(`SNAPSHOT REFRESHED // SOURCE=${result.payload?.source ?? "N/A"}`);
  };

  const handleTick = () => {
    const result = onTick();
    if (!result.ok) {
      setEventMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${result.message}`);
      return;
    }
    setEventMessage(`COUNTDOWN TICK // ${result.payload?.countdownSec ?? countdownSec}s`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <TacticalPanel title="Node Map Panel" eyebrow="S-003" className="lg:col-span-2">
        {nodes.length === 0 ? (
          <p className="border border-eve-yellow/40 bg-eve-black/70 px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-eve-offwhite">
            STANDBY // NO NEW LOGS
          </p>
        ) : null}
        <ul className="space-y-3">
          {nodes.map((node) => {
            const fillPct = Math.round(node.fillRatio * 100);
            const severity = riskTone(node.riskWeight);

            return (
              <li key={node.nodeId} className="border border-eve-yellow/30 bg-eve-black/70 px-3 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">{node.name}</p>
                  <p className={`text-xs font-mono uppercase tracking-[0.12em] ${toneClass(severity)}`}>
                    Risk: {severity.toUpperCase()} ({node.riskWeight.toFixed(2)})
                  </p>
                </div>

                <div className="mt-2 border border-eve-yellow/40 bg-eve-grey/80 p-1">
                  <div className="h-2 bg-eve-yellow transition-all" style={{ width: `${fillPct}%` }} />
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-eve-offwhite/85">
                  <p>FILL RATIO: {fillPct}%</p>
                  <p>STATUS: {node.completed ? "COMPLETED" : "IN PROGRESS"}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <TacticalButton onClick={() => handleSubmit(node.nodeId)}>Submit Supply Run</TacticalButton>
                  <TacticalButton tone="ghost" onClick={() => handleSubmit(node.nodeId, true)}>
                    Request Escort
                  </TacticalButton>
                </div>
              </li>
            );
          })}
        </ul>
      </TacticalPanel>

      <TacticalPanel title="Ops Telemetry" eyebrow="IA-003 / IA-006">
        <ul className="space-y-2 text-xs text-eve-offwhite/85">
          <li>Phase: {phase}</li>
          <li>Countdown: {countdownSec}s</li>
          <li className={staleSnapshot ? "text-eve-red" : "text-eve-offwhite/85"}>
            Snapshot: {staleSnapshot ? "STALE SNAPSHOT" : "LIVE FEED"}
          </li>
        </ul>

        <div className="mt-3 flex flex-wrap gap-2">
          <TacticalButton tone="ghost" disabled={refreshing} onClick={handleRefresh}>
            {refreshing ? "SYNCING..." : "Refresh Snapshot"}
          </TacticalButton>
          <TacticalButton tone="ghost" onClick={handleTick}>
            Tick +10s
          </TacticalButton>
        </div>

        <p className="mt-3 border border-eve-yellow/40 bg-eve-black/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em]">
          {eventMessage}
        </p>

        <div className="mt-4 border border-eve-yellow/30 bg-eve-black/70 px-3 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-eve-yellow">Event Stream</p>
          <ul className="mt-2 max-h-48 space-y-2 overflow-auto text-xs text-eve-offwhite/85">
            {eventFeed.length === 0 ? <li>STANDBY // NO NEW LOGS</li> : null}
            {eventFeed.map((event) => (
              <li key={event.id}>
                <span className="font-mono text-eve-yellow">{event.action}</span>
                <span className="ml-2 text-eve-offwhite/80">{event.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </TacticalPanel>
    </div>
  );
}
