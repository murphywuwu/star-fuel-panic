"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthController } from "@/controller/useAuthController";
import { useCreateMatchController } from "@/controller/useCreateMatchController";
import type { NetworkNode } from "@/types/node";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

interface CreateMatchScreenProps {
  onClose?: () => void;
  onPublished?: (matchId: string) => void;
}

type PlottedNode = {
  objectId: string;
  name: string;
  fillRatio: number;
  urgency: "critical" | "warning" | "safe";
  plotLeft: number;
  plotTop: number;
};

const FALLBACK_PLOT_POINTS = [
  { left: 14, top: 24 },
  { left: 26, top: 62 },
  { left: 42, top: 34 },
  { left: 58, top: 72 },
  { left: 72, top: 24 },
  { left: 84, top: 58 },
  { left: 36, top: 82 },
  { left: 64, top: 16 }
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function urgencyTone(urgency: "critical" | "warning" | "safe") {
  if (urgency === "critical") return "text-eve-red";
  if (urgency === "warning") return "text-eve-yellow";
  return "text-eve-offwhite/70";
}

function modeCardClass(active: boolean) {
  return active
    ? "border-eve-red bg-eve-red/10 shadow-[0_0_0_1px_rgba(255,95,0,0.2)]"
    : "border-eve-red/20 bg-[#0d0d0d]/80 hover:border-eve-red/45";
}

function nodeDotClass(urgency: "critical" | "warning" | "safe") {
  if (urgency === "critical") return "border-eve-red bg-eve-red";
  if (urgency === "warning") return "border-eve-yellow bg-eve-yellow";
  return "border-eve-offwhite/60 bg-eve-offwhite/75";
}

function nodeRingClass(urgency: "critical" | "warning" | "safe") {
  if (urgency === "critical") return "border-eve-red/65";
  if (urgency === "warning") return "border-eve-yellow/65";
  return "border-eve-offwhite/35";
}

function pulseSize(fillRatio: number) {
  const deficit = 1 - fillRatio;
  return Math.max(22, Math.min(58, Math.round(24 + deficit * 30)));
}

function formatEntryLabel(entryFee: number) {
  return entryFee > 0 ? `${entryFee} LUX per pilot` : "Free entry";
}

function formatDurationLabel(durationHours: number) {
  return durationHours === 1 ? "1 hour" : `${durationHours} hours`;
}

function numberInputClass() {
  return "mt-2 w-full border border-eve-red/25 bg-[#080808] px-3 py-3 text-sm text-eve-offwhite outline-none transition focus:border-eve-red";
}

function helpText(text: string) {
  return <p className="mt-2 text-[11px] leading-5 text-eve-offwhite/60">{text}</p>;
}

function buildNodePlot(nodes: NetworkNode[]): PlottedNode[] {
  if (nodes.length === 0) {
    return [];
  }

  const withCoords = nodes.filter((node) => node.coordX !== 0 || node.coordZ !== 0);
  if (withCoords.length === 0) {
    return nodes.map((node, index) => ({
      objectId: node.objectId,
      name: node.name,
      fillRatio: node.fillRatio,
      urgency: node.urgency,
      plotLeft: FALLBACK_PLOT_POINTS[index % FALLBACK_PLOT_POINTS.length]?.left ?? 50,
      plotTop: FALLBACK_PLOT_POINTS[index % FALLBACK_PLOT_POINTS.length]?.top ?? 50
    }));
  }

  const xs = withCoords.map((node) => node.coordX);
  const zs = withCoords.map((node) => node.coordZ);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);

  return nodes.map((node, index) => {
    if (node.coordX === 0 && node.coordZ === 0) {
      return {
        objectId: node.objectId,
        name: node.name,
        fillRatio: node.fillRatio,
        urgency: node.urgency,
        plotLeft: FALLBACK_PLOT_POINTS[index % FALLBACK_PLOT_POINTS.length]?.left ?? 50,
        plotTop: FALLBACK_PLOT_POINTS[index % FALLBACK_PLOT_POINTS.length]?.top ?? 50
      };
    }

    const left = maxX === minX ? 50 : 12 + ((node.coordX - minX) / (maxX - minX)) * 76;
    const top = maxZ === minZ ? 50 : 12 + ((node.coordZ - minZ) / (maxZ - minZ)) * 76;

    return {
      objectId: node.objectId,
      name: node.name,
      fillRatio: node.fillRatio,
      urgency: node.urgency,
      plotLeft: Number(left.toFixed(2)),
      plotTop: Number(top.toFixed(2))
    };
  });
}

export function CreateMatchScreen({ onClose, onPublished }: CreateMatchScreenProps) {
  const { state: authState } = useAuthController();
  const { state, actions } = useCreateMatchController();
  const [systemQuery, setSystemQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = systemQuery.trim();
    if (trimmed.length < 2) {
      void actions.searchSystems("");
      return;
    }

    const timer = window.setTimeout(() => {
      void actions.searchSystems(trimmed);
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [actions, systemQuery]);

  useEffect(() => {
    return () => {
      actions.reset();
    };
  }, [actions]);

  const selectedSystem = state.selectedSystem;
  const precisionMode = state.mode === "precision";
  const selectedNodeCount = state.targetNodeIds.length;
  const plottedNodes = useMemo(() => buildNodePlot(state.systemNodes), [state.systemNodes]);
  const selectedNodes = useMemo(
    () => state.systemNodes.filter((node) => state.targetNodeIds.includes(node.objectId)),
    [state.systemNodes, state.targetNodeIds]
  );
  const estimatedMaxGrossPool = useMemo(() => {
    const assumedPilotsPerTeam = 3;
    return state.sponsorshipFee + state.entryFee * state.maxTeams * assumedPilotsPerTeam;
  }, [state.entryFee, state.maxTeams, state.sponsorshipFee]);

  const handleModeChange = (mode: "free" | "precision") => {
    actions.setField("mode", mode);
    setStatusMessage(null);
    if (mode === "free" && state.targetNodeIds.length > 0) {
      actions.setField("targetNodeIds", []);
    }
  };

  const handleSelectSystem = async (systemId: number) => {
    const result = await actions.selectSystem(systemId);
    if (!result.ok) {
      setStatusMessage(result.message);
      return;
    }
    setSystemQuery("");
    setStatusMessage(null);
  };

  const handleToggleTargetNode = (objectId: string) => {
    if (!precisionMode) {
      return;
    }

    const result = actions.toggleTargetNode(objectId);
    if (!result.ok) {
      setStatusMessage(result.message);
      return;
    }
    setStatusMessage(null);
  };

  const handlePublish = async () => {
    if (!authState.walletAddress) {
      setStatusMessage("Connect a wallet before publishing a match.");
      return;
    }

    if (!state.solarSystemId || !selectedSystem) {
      setStatusMessage("Select a target system before publishing.");
      return;
    }

    if (precisionMode && selectedNodeCount === 0) {
      setStatusMessage("Precision mode requires at least one target node.");
      return;
    }

    setStatusMessage("CREATING MATCH DRAFT...");
    const draftResult = state.draftId
      ? { ok: true, message: "DRAFT_READY", payload: state.draftId }
      : await actions.createDraft(authState.walletAddress);

    if (!draftResult.ok || !draftResult.payload) {
      setStatusMessage(draftResult.message);
      return;
    }

    setStatusMessage("LOCKING SPONSORSHIP AND PUBLISHING...");
    const publishResult = await actions.publish(authState.walletAddress);
    if (!publishResult.ok) {
      setStatusMessage(publishResult.message);
      return;
    }

    const matchId = draftResult.payload;
    actions.reset();
    setSystemQuery("");

    if (onPublished) {
      onPublished(matchId);
      return;
    }

    setStatusMessage(`MATCH PUBLISHED // ${matchId}`);
  };

  const handleClose = () => {
    actions.reset();
    setSystemQuery("");
    setStatusMessage(null);
    onClose?.();
  };

  return (
    <section className="space-y-4">
      <TacticalPanel title="Match Mode" eyebrow="Scoring Scope">
        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => handleModeChange("free")}
            className={cn("border px-4 py-4 text-left transition", modeCardClass(state.mode === "free"))}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-eve-red/90">Free Mode</p>
            <p className="mt-3 text-sm font-black uppercase tracking-[0.08em] text-eve-offwhite">
              Any online node in the selected system can score.
            </p>
            {helpText("Use this when you want squads to spread out and race for whichever nodes they judge worth the route.")}
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("precision")}
            className={cn("border px-4 py-4 text-left transition", modeCardClass(state.mode === "precision"))}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-eve-red/90">Precision Mode</p>
            <p className="mt-3 text-sm font-black uppercase tracking-[0.08em] text-eve-offwhite">
              Only your selected target nodes can score.
            </p>
            {helpText("Use this when you want a focused rescue contract or a tactical contest around a small set of critical infrastructure.")}
          </button>
        </div>
      </TacticalPanel>

      <TacticalPanel title="Target System & Network Nodes" eyebrow="Search / Select / Arm Targets">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-offwhite/70">
                Search Systems
                <input
                  value={systemQuery}
                  onChange={(event) => setSystemQuery(event.target.value)}
                  placeholder="Type a system name or system ID..."
                  className={numberInputClass()}
                />
              </label>
              {helpText("Choose the solar system first. The tactical field on the right will then light up its indexed online network nodes.")}
            </div>

            <div className="mt-3 space-y-2">
              {state.searching ? (
                <p className="text-[11px] uppercase tracking-[0.14em] text-eve-offwhite/55">Searching systems...</p>
              ) : null}

              {state.searchHits.map((hit) => (
                <button
                  key={`${hit.type}-${hit.id}`}
                  type="button"
                  onClick={() => void handleSelectSystem(hit.id)}
                  className="flex w-full items-center justify-between gap-3 border border-eve-red/20 bg-[#080808]/80 px-3 py-3 text-left text-xs uppercase tracking-[0.14em] text-eve-offwhite/82 transition hover:border-eve-red/45"
                >
                  <span>{hit.label}</span>
                  <span className="text-eve-offwhite/50">SELECT</span>
                </button>
              ))}
            </div>

            <div className="mt-4 border border-eve-red/15 bg-[#080808]/80 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red/90">Selected System</p>
              {!selectedSystem ? (
                <p className="mt-3 text-sm uppercase tracking-[0.12em] text-eve-offwhite/55">
                  No target system selected yet.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-lg font-black uppercase tracking-[0.06em] text-eve-offwhite">
                      {selectedSystem.systemName}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-eve-offwhite/60">
                      System ID {selectedSystem.systemId} // Constellation {selectedSystem.constellationId}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="border border-eve-red/15 bg-[#111111]/80 px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Travel Topology</p>
                      <p className="mt-2 uppercase tracking-[0.1em] text-eve-offwhite/85">
                        {selectedSystem.gateLinks.length} gate links detected
                      </p>
                    </div>
                    <div className="border border-eve-red/15 bg-[#111111]/80 px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Indexed Node Count</p>
                      <p className="mt-2 uppercase tracking-[0.1em] text-eve-offwhite/85">
                        {state.systemNodes.length} online nodes
                      </p>
                    </div>
                  </div>
                  {helpText(
                    precisionMode
                      ? "Click the flashing dots to arm 1 to 5 scoring targets."
                      : "In Free Mode the dot field is informational only; any online node in this system can score."
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="border border-eve-red/20 bg-[radial-gradient(circle_at_20%_-10%,rgba(255,95,0,0.12),rgba(8,8,8,0)_48%),linear-gradient(rgba(224,224,224,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(224,224,224,0.03)_1px,transparent_1px)] bg-[length:100%_100%,18px_18px,18px_18px] p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-yellow">
                    Tactical Node Grid
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-eve-offwhite/60">
                    {precisionMode
                      ? "Click flashing dots to lock scoring targets"
                      : "Free mode node field for route reconnaissance"}
                  </p>
                </div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/45">
                  {selectedNodeCount}/5 locked
                </p>
              </div>

              <div className="relative h-[360px] overflow-hidden border border-eve-red/15 bg-[#070707]/85">
                {!selectedSystem ? (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.16em] text-eve-offwhite/45">
                    Select a system to render its network nodes.
                  </div>
                ) : state.loadingSystem ? (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.16em] text-eve-offwhite/45">
                    Loading node topology...
                  </div>
                ) : plottedNodes.length === 0 ? (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.16em] text-eve-offwhite/45">
                    No online nodes are currently available in this system.
                  </div>
                ) : (
                  plottedNodes.map((node) => {
                    const selected = state.targetNodeIds.includes(node.objectId);
                    const disabled = precisionMode && !selected && state.targetNodeIds.length >= 5;
                    const pulse = pulseSize(node.fillRatio);

                    return (
                      <button
                        key={node.objectId}
                        type="button"
                        onClick={() => handleToggleTargetNode(node.objectId)}
                        disabled={!precisionMode || disabled}
                        className={cn(
                          "absolute -translate-x-1/2 -translate-y-1/2 text-left",
                          !precisionMode && "cursor-default",
                          disabled && "opacity-45"
                        )}
                        style={{ left: `${node.plotLeft}%`, top: `${node.plotTop}%` }}
                        title={`${node.name} // ${Math.round(node.fillRatio * 100)}% fill // ${node.urgency}`}
                      >
                        <span
                          className={cn(
                            "pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 border animate-ping",
                            selected ? "border-eve-yellow/75" : nodeRingClass(node.urgency)
                          )}
                          style={{
                            width: `${pulse}px`,
                            height: `${pulse}px`,
                            animationDuration: `${Math.max(900, Math.round(2400 - node.fillRatio * 1200))}ms`
                          }}
                        />
                        <span
                          className={cn(
                            "pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 border",
                            selected ? "border-eve-yellow/90" : nodeRingClass(node.urgency)
                          )}
                          style={{
                            width: `${Math.max(18, pulse - 16)}px`,
                            height: `${Math.max(18, pulse - 16)}px`
                          }}
                        />
                        <span
                          className={cn(
                            "relative z-10 block h-4 w-4 border transition",
                            selected
                              ? "border-eve-yellow bg-eve-yellow shadow-[0_0_0_2px_rgba(229,179,43,0.22)]"
                              : nodeDotClass(node.urgency)
                          )}
                        />
                      </button>
                    );
                  })
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/55">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 border border-eve-red bg-eve-red" />
                  Critical
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 border border-eve-yellow bg-eve-yellow" />
                  Warning
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 border border-eve-offwhite/60 bg-eve-offwhite/75" />
                  Stable
                </span>
                {precisionMode ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 border border-eve-yellow bg-eve-yellow" />
                    Selected Target
                  </span>
                ) : null}
              </div>
            </div>

            {precisionMode && selectedNodes.length > 0 ? (
              <div className="grid gap-2 md:grid-cols-2">
                {selectedNodes.map((node) => (
                  <div key={node.objectId} className="border border-eve-red/20 bg-[#080808]/80 px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-black uppercase tracking-[0.08em] text-eve-offwhite">
                        {node.name}
                      </span>
                      <span className={cn("text-[10px] font-black uppercase tracking-[0.18em]", urgencyTone(node.urgency))}>
                        {node.urgency}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-eve-offwhite/60">
                      Fill ratio {Math.round(node.fillRatio * 100)}% // Selected for scoring
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </TacticalPanel>

      <TacticalPanel title="Match Economics" eyebrow="Player Commitment">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-offwhite/70">
            Sponsorship Stake
            <input
              type="number"
              min={500}
              value={state.sponsorshipFee}
              onChange={(event) => actions.setField("sponsorshipFee", Math.max(500, Number(event.target.value) || 500))}
              className={numberInputClass()}
            />
            {helpText("This is your guaranteed contribution to the pool. It is the minimum prize players will compete for.")}
          </label>

          <label className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-offwhite/70">
            Team Cap
            <select
              value={state.maxTeams}
              onChange={(event) => actions.setField("maxTeams", Number(event.target.value))}
              className={numberInputClass()}
            >
              {[2, 4, 6, 8, 12, 16].map((value) => (
                <option key={value} value={value}>
                  {value} teams
                </option>
              ))}
            </select>
            {helpText("This caps how many squads can register. Use a lower cap for tighter, higher-intensity contests.")}
          </label>

          <label className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-offwhite/70">
            Entry Fee
            <input
              type="number"
              min={0}
              value={state.entryFee}
              onChange={(event) => actions.setField("entryFee", Math.max(0, Number(event.target.value) || 0))}
              className={numberInputClass()}
            />
            {helpText("Charged per pilot when a squad locks in. Set to 0 when you want the match to be fully sponsor-funded.")}
          </label>

          <label className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-offwhite/70">
            Match Duration
            <select
              value={state.durationHours}
              onChange={(event) => actions.setField("durationHours", Number(event.target.value))}
              className={numberInputClass()}
            >
              {[1, 2, 4, 8, 12, 24, 48, 72].map((value) => (
                <option key={value} value={value}>
                  {formatDurationLabel(value)}
                </option>
              ))}
            </select>
            {helpText("Controls how long squads can score before the match closes and settlement begins.")}
          </label>
        </div>
      </TacticalPanel>

      <TacticalPanel title="Publish Summary" eyebrow="Pilot Brief">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-3">
            <div className="border border-eve-red/15 bg-[#080808]/80 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-eve-red/90">
                What Players Are Joining
              </p>
              <div className="mt-3 space-y-2 text-sm uppercase tracking-[0.12em] text-eve-offwhite/82">
                <p>{precisionMode ? "A focused rescue contract" : "A system-wide fuel hunt"}</p>
                <p>Target System: {selectedSystem?.systemName ?? "Not selected"}</p>
                <p>
                  Scoring Scope:{" "}
                  {precisionMode
                    ? `${selectedNodeCount} locked target nodes`
                    : "Any online node in the chosen system"}
                </p>
                <p>Entry Model: {formatEntryLabel(state.entryFee)}</p>
                <p>Duration: {formatDurationLabel(state.durationHours)}</p>
              </div>
            </div>

            <div className="border border-eve-red/15 bg-[#080808]/80 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-eve-red/90">
                Publish Checklist
              </p>
              <div className="mt-3 space-y-2 text-sm uppercase tracking-[0.12em] text-eve-offwhite/82">
                <p className={selectedSystem ? "text-eve-offwhite" : "text-eve-offwhite/45"}>
                  {selectedSystem ? "SYSTEM LOCKED" : "SYSTEM NOT SET"}
                </p>
                <p className={!precisionMode || selectedNodeCount > 0 ? "text-eve-offwhite" : "text-eve-offwhite/45"}>
                  {!precisionMode || selectedNodeCount > 0 ? "SCORING TARGETS READY" : "SELECT PRECISION TARGETS"}
                </p>
                <p className={state.sponsorshipFee >= 500 ? "text-eve-offwhite" : "text-eve-offwhite/45"}>
                  {state.sponsorshipFee >= 500 ? "SPONSORSHIP THRESHOLD MET" : "SPONSORSHIP BELOW MINIMUM"}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-eve-red/15 bg-[#080808]/80 px-4 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red/90">Pool Projection</p>
            <div className="mt-3 space-y-2 text-sm uppercase tracking-[0.12em] text-eve-offwhite/82">
              <p>Guaranteed pool: {state.sponsorshipFee} LUX</p>
              <p>Potential full pool: {estimatedMaxGrossPool} LUX</p>
              <p>Assumption: {state.maxTeams} teams x 3 pilots per team</p>
            </div>
            {helpText(
              "The guaranteed pool is what you stake up front. The potential full pool assumes every available squad fills with three pilots and pays in."
            )}
          </div>
        </div>

        {state.error || statusMessage ? (
          <div className="mt-4 border border-eve-red/35 bg-eve-red/10 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-eve-offwhite">
            {statusMessage ?? state.error}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-3">
          {onClose ? (
            <TacticalButton tone="ghost" onClick={handleClose} disabled={state.loading}>
              CANCEL
            </TacticalButton>
          ) : null}
          <TacticalButton onClick={() => void handlePublish()} disabled={state.loading}>
            {state.loading ? "PUBLISHING" : "LOCK SPONSORSHIP & PUBLISH"}
          </TacticalButton>
        </div>
      </TacticalPanel>
    </section>
  );
}
