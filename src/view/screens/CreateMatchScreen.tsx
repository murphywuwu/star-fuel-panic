"use client";

import { useState } from "react";
import { useCreateMatchScreenController, type PlottedNode } from "@/controller/useCreateMatchScreenController";
import { PAYMENT_TOKEN_LABEL, PAYMENT_TOKEN_SYMBOL, formatPaymentTokenAmount } from "@/utils/paymentToken";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

interface CreateMatchScreenProps {
  onClose?: () => void;
  onPublished?: (matchId: string) => void;
}

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

function fuelGaugeFillClass(urgency: "critical" | "warning" | "safe") {
  if (urgency === "critical") return "bg-gradient-to-r from-eve-red to-[#ff8a66]";
  if (urgency === "warning") return "bg-gradient-to-r from-eve-yellow to-[#f3d97e]";
  return "bg-gradient-to-r from-eve-offwhite/80 to-eve-offwhite";
}

function formatEntryLabel(entryFee: number) {
  return entryFee > 0 ? `${formatPaymentTokenAmount(entryFee, { maximumFractionDigits: 0 })} per pilot` : "Free entry";
}

function formatDurationLabel(durationHours: number) {
  return durationHours === 1 ? "1 hour" : `${durationHours} hours`;
}

function formatLux(value: number) {
  return formatPaymentTokenAmount(value, { maximumFractionDigits: 0 }).replace(` ${PAYMENT_TOKEN_SYMBOL}`, "");
}

function formatFuel(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(Math.max(0, Math.floor(value)));
}

function nodeTooltipHorizontalClass(plotLeft: number) {
  if (plotLeft <= 24) return "left-0";
  if (plotLeft >= 76) return "right-0";
  return "left-1/2 -translate-x-1/2";
}

function nodeTooltipVerticalClass(plotTop: number) {
  return plotTop <= 22 ? "top-7" : "bottom-7";
}

function numberInputClass() {
  return "mt-2 w-full border border-eve-red/25 bg-[#080808] px-3 py-3 text-sm text-eve-offwhite outline-none transition focus:border-eve-red";
}

function helpText(text: string) {
  return <p className="mt-2 text-[11px] leading-5 text-eve-offwhite/60">{text}</p>;
}

export function CreateMatchScreen({ onClose, onPublished }: CreateMatchScreenProps) {
  const { state, view, actions } = useCreateMatchScreenController({ onClose, onPublished });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const {
    systemQuery,
    feedbackMessage,
    sponsorshipFeeInput,
    entryFeeInput,
    selectedSystem,
    selectedNodeCount,
    precisionMode,
    plottedNodes,
    selectedNodes,
    estimatedMaxGrossPool,
    teamSize,
    guaranteedPool,
    projectedEntryFlow,
    projectedPlatformFee,
    projectedPayoutPool,
    guaranteedSharePct,
    entrySharePct,
    payoutSharePct,
    prizeLadder,
    topPrize,
    systemLoadingNotice,
    targetPanelTitle,
    targetPanelEyebrow,
    targetGridSummaryLabel,
    targetGridInstruction,
    targetLegendAccentLabel,
    displayNodes,
    pulseSize
  } = view;

  return (
    <section className="space-y-4">
      <TacticalPanel title="Match Mode" eyebrow="Scoring Scope">
        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => actions.handleModeChange("free")}
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
            onClick={() => actions.handleModeChange("precision")}
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

      <TacticalPanel title="Match Economics" eyebrow="Player Commitment">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-offwhite/70">
            Sponsorship Stake
            <input
              type="number"
              min={50}
              inputMode="numeric"
              value={sponsorshipFeeInput}
              onChange={(event) => actions.handleSponsorshipFeeInputChange(event.target.value)}
              onBlur={actions.commitSponsorshipFeeInput}
              className={numberInputClass()}
            />
            {helpText(`This is your guaranteed contribution to the pool. For the current testing phase, the minimum sponsorship is 50 ${PAYMENT_TOKEN_SYMBOL}.`)}
          </label>

          <label className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-offwhite/70">
            Team Cap
            <select
              value={state.maxTeams}
              onChange={(event) => actions.setMaxTeams(Number(event.target.value))}
              className={numberInputClass()}
            >
              {[2, 4, 6, 8, 12, 16].map((value) => (
                <option key={value} value={value}>
                  {value} teams
                </option>
              ))}
            </select>
            {helpText("Set the squad cap first so you can judge pool scale before picking the battlefield.")}
          </label>

          <label className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-offwhite/70">
            Team Size
            <select
              value={teamSize}
              onChange={(event) => actions.setTeamSize(Number(event.target.value))}
              className={numberInputClass()}
            >
              {[3, 4, 5, 6, 7, 8].map((value) => (
                <option key={value} value={value}>
                  {value} pilots
                </option>
              ))}
            </select>
            {helpText("Every squad in this match must use the same fixed roster size. Team entry cost is entry fee multiplied by this value.")}
          </label>

          <label className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-offwhite/70">
            Entry Fee
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={entryFeeInput}
              onChange={(event) => actions.handleEntryFeeInputChange(event.target.value)}
              onBlur={actions.commitEntryFeeInput}
              className={numberInputClass()}
            />
            {helpText("Charged per pilot when a squad locks in. Set to 0 when you want the match to be fully sponsor-funded.")}
          </label>

          <label className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-offwhite/70">
            Match Duration
            <select
              value={state.durationHours}
              onChange={(event) => actions.setDurationHours(Number(event.target.value))}
              className={numberInputClass()}
            >
              {[1, 2, 4, 8, 12, 24, 48, 72].map((value) => (
                <option key={value} value={value}>
                  {formatDurationLabel(value)}
                </option>
              ))}
            </select>
            {helpText("Lock the economics first, then choose the system that matches the intended intensity and travel time.")}
          </label>
        </div>
      </TacticalPanel>

      <TacticalPanel title={targetPanelTitle} eyebrow={targetPanelEyebrow}>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-offwhite/70">
                Search Systems
                <input
                  value={systemQuery}
                  onChange={(event) => actions.setSystemQuery(event.target.value)}
                  placeholder="Type a system name or system ID..."
                  className={numberInputClass()}
                  disabled={state.loadingSystem}
                />
              </label>
              {helpText(
                precisionMode
                  ? "Choose the solar system first. After that, arm 1 to 5 indexed network nodes as the only scoring targets."
                  : "Choose the solar system first. The same tactical node grid will preview every online network node that can score in Free Mode."
              )}
            </div>

            <div className="mt-3 space-y-2">
              {state.searching ? (
                <p className="text-[11px] uppercase tracking-[0.14em] text-eve-offwhite/55">Searching systems...</p>
              ) : null}
              {systemLoadingNotice ? (
                <div className="border border-eve-yellow/25 bg-eve-yellow/10 px-3 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-eve-yellow">
                  {systemLoadingNotice}
                </div>
              ) : null}

              {state.searchHits.map((hit) => (
                <button
                  key={`${hit.type}-${hit.id}`}
                  type="button"
                  onClick={() => void actions.handleSelectSystem(hit.id)}
                  disabled={state.loadingSystem}
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
                      : "Any online node rendered in the tactical grid below is automatically eligible for scoring. No node locking step is required in Free Mode."
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
                    {targetGridInstruction}
                  </p>
                </div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/45">
                  {targetGridSummaryLabel}
                </p>
              </div>

              <div className="relative h-[360px] overflow-hidden border border-eve-red/15 bg-[#070707]/85">
                {state.loadingSystem ? (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
                    <div className="border border-eve-yellow/35 bg-[#080808]/95 px-5 py-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-eve-yellow">
                        Syncing System Topology
                      </p>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="h-2 w-2 animate-pulse border border-eve-yellow bg-eve-yellow" />
                        <span className="h-2 w-2 animate-pulse border border-eve-yellow bg-eve-yellow [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-pulse border border-eve-yellow bg-eve-yellow [animation-delay:300ms]" />
                      </div>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-eve-offwhite/75">
                        Loading node positions and availability...
                      </p>
                    </div>
                  </div>
                ) : null}
                {!selectedSystem ? (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.16em] text-eve-offwhite/45">
                    Select a system to render its network nodes.
                  </div>
                ) : plottedNodes.length === 0 ? (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.16em] text-eve-offwhite/45">
                    No online nodes are currently available in this system.
                  </div>
                ) : (
                  plottedNodes.map((node: PlottedNode) => {
                    const selected = precisionMode && state.targetNodeIds.includes(node.objectId);
                    const disabled = precisionMode && !selected && state.targetNodeIds.length >= 5;
                    const pulse = pulseSize(node.fillRatio);
                    const fuelLoadPct = Math.max(0, Math.min(100, Math.round(node.fillRatio * 100)));
                    const fuelDeficitPct = Math.max(0, 100 - fuelLoadPct);
                    const statusLabel = precisionMode
                      ? selected
                        ? "Locked scoring target"
                        : disabled
                          ? "Selection limit reached"
                          : "Available scoring target"
                      : "Auto-scoring node";

                    return (
                      <button
                        key={node.objectId}
                        type="button"
                        onPointerEnter={() => setHoveredNodeId(node.objectId)}
                        onPointerLeave={() => setHoveredNodeId((current) => (current === node.objectId ? null : current))}
                        onFocus={() => setHoveredNodeId(node.objectId)}
                        onBlur={() => setHoveredNodeId((current) => (current === node.objectId ? null : current))}
                        onClick={() => {
                          if (!precisionMode || state.loadingSystem || disabled) {
                            return;
                          }
                          actions.handleToggleTargetNode(node.objectId);
                        }}
                        aria-disabled={state.loadingSystem || disabled}
                        aria-label={`${node.name}. Fuel remaining ${formatFuel(node.fuelQuantity)}. Capacity ${formatFuel(node.fuelMaxCapacity)}. Deficit ${formatFuel(node.fuelDeficit)}.`}
                        className={cn(
                          "absolute -translate-x-1/2 -translate-y-1/2 text-left focus:outline-none",
                          disabled && "opacity-45",
                          disabled && precisionMode && "cursor-not-allowed",
                          !precisionMode && "cursor-default"
                        )}
                        style={{ left: `${node.plotLeft}%`, top: `${node.plotTop}%` }}
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
                        {hoveredNodeId === node.objectId ? (
                          <span
                            className={cn(
                              "pointer-events-none absolute z-20 min-w-[240px] border border-eve-yellow/40 bg-[#080808]/96 px-3 py-3 shadow-[0_0_0_1px_rgba(229,179,43,0.12),0_18px_42px_rgba(0,0,0,0.55)] backdrop-blur-[6px]",
                              nodeTooltipHorizontalClass(node.plotLeft),
                              nodeTooltipVerticalClass(node.plotTop)
                            )}
                          >
                            <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-eve-yellow">
                              {statusLabel}
                            </span>
                            <span className="mt-2 block text-sm font-black uppercase tracking-[0.08em] text-eve-offwhite">
                              {node.name}
                            </span>
                            <span className="mt-3 block border border-eve-red/15 bg-black/35 px-2 py-2">
                              <span className="flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.18em] text-eve-offwhite/48">
                                <span>Fuel Load</span>
                                <span className="font-black text-eve-offwhite/82">{fuelLoadPct}%</span>
                              </span>
                              <span className="relative mt-2 block h-3 overflow-hidden border border-eve-red/20 bg-[#120807]">
                                <span
                                  className={cn("absolute inset-y-0 left-0 shadow-[0_0_14px_rgba(229,179,43,0.16)]", fuelGaugeFillClass(node.urgency))}
                                  style={{ width: `${fuelLoadPct}%` }}
                                />
                                <span
                                  className="absolute inset-y-0 right-0 bg-[repeating-linear-gradient(135deg,rgba(204,51,0,0.34)_0_4px,rgba(8,8,8,0)_4px_8px)] opacity-85"
                                  style={{ width: `${fuelDeficitPct}%` }}
                                />
                                <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(224,224,224,0.08)_1px,transparent_1px)] bg-[length:24px_100%] opacity-35" />
                              </span>
                              <span className="mt-2 flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.18em] text-eve-offwhite/42">
                                <span>Loaded</span>
                                <span>Gap To Full</span>
                              </span>
                            </span>
                            <span className="mt-3 grid grid-cols-3 gap-2">
                              <span className="border border-eve-red/15 bg-black/35 px-2 py-2">
                                <span className="block text-[9px] uppercase tracking-[0.18em] text-eve-offwhite/48">Remaining</span>
                                <span className="mt-1 block text-[11px] font-black uppercase tracking-[0.08em] text-eve-offwhite">
                                  {formatFuel(node.fuelQuantity)}
                                </span>
                              </span>
                              <span className="border border-eve-red/15 bg-black/35 px-2 py-2">
                                <span className="block text-[9px] uppercase tracking-[0.18em] text-eve-offwhite/48">Capacity</span>
                                <span className="mt-1 block text-[11px] font-black uppercase tracking-[0.08em] text-eve-offwhite">
                                  {formatFuel(node.fuelMaxCapacity)}
                                </span>
                              </span>
                              <span className="border border-eve-red/15 bg-black/35 px-2 py-2">
                                <span className="block text-[9px] uppercase tracking-[0.18em] text-eve-offwhite/48">Deficit</span>
                                <span className="mt-1 block text-[11px] font-black uppercase tracking-[0.08em] text-eve-yellow">
                                  {formatFuel(node.fuelDeficit)}
                                </span>
                              </span>
                            </span>
                          </span>
                        ) : null}
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
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 border border-eve-yellow bg-eve-yellow" />
                  {targetLegendAccentLabel}
                </span>
              </div>
            </div>

            {displayNodes.length > 0 ? (
              <div className="grid gap-2 md:grid-cols-2">
                {displayNodes.map((node) => (
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
                      Fill ratio {Math.round(node.fillRatio * 100)}% //{" "}
                      {precisionMode ? "Selected for scoring" : "Auto-included scoring node"}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </TacticalPanel>

      <TacticalPanel title="Publish Summary" eyebrow="Pilot Brief">
        <div>
          <div className="relative overflow-hidden border border-eve-yellow/40 bg-[radial-gradient(circle_at_top_left,rgba(229,179,43,0.26),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,95,0,0.26),transparent_38%),linear-gradient(180deg,rgba(24,24,24,0.98)_0%,rgba(8,8,8,0.98)_100%)] px-4 py-4 shadow-[0_0_0_1px_rgba(229,179,43,0.12),0_38px_100px_rgba(0,0,0,0.62)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-eve-yellow to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-[40%] bg-[linear-gradient(135deg,rgba(229,179,43,0.08),rgba(229,179,43,0)_35%,rgba(204,51,0,0.1)_100%)] opacity-85" />
            <div className="pointer-events-none absolute -right-12 top-6 rotate-[18deg] text-[76px] font-black uppercase tracking-[-0.08em] text-eve-offwhite/[0.05]">
              {PAYMENT_TOKEN_SYMBOL}
            </div>

            <div className="relative grid gap-4">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)]">
                <div className="border border-eve-red/18 bg-black/22 px-4 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-eve-yellow">Pool Projection</p>
                  <p className="mt-3 text-sm font-black uppercase tracking-[0.08em] text-eve-offwhite">
                    Prize Poster
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-eve-offwhite/58">
                    {state.maxTeams} teams
                  </p>

                  <div className="mt-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">
                        <span>Guaranteed Stake</span>
                        <span>{guaranteedSharePct}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden border border-eve-red/25 bg-black/40">
                        <div
                          className="h-full bg-gradient-to-r from-eve-red to-eve-yellow shadow-[0_0_18px_rgba(229,179,43,0.25)]"
                          style={{ width: `${guaranteedSharePct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">
                        <span>Entry Flow</span>
                        <span>{entrySharePct}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden border border-eve-yellow/25 bg-black/40">
                        <div
                          className="h-full bg-gradient-to-r from-eve-yellow to-[#f3d97e] shadow-[0_0_18px_rgba(229,179,43,0.28)]"
                          style={{ width: `${entrySharePct}%` }}
                        />
                      </div>
                    </div>

                    <div className="border border-eve-red/18 bg-black/24 px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Platform Fee @ 5%</p>
                      <p className="mt-1 text-lg font-black uppercase tracking-[0.02em] text-eve-offwhite/84">
                        {formatLux(projectedPlatformFee)} {PAYMENT_TOKEN_SYMBOL}
                      </p>
                    </div>

                    <div className="border border-eve-red/18 bg-black/24 px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Publish Checklist</p>
                      <div className="mt-3 space-y-2 text-sm uppercase tracking-[0.12em] text-eve-offwhite/82">
                        <p className={selectedSystem ? "text-eve-offwhite" : "text-eve-offwhite/45"}>
                          {selectedSystem ? "SYSTEM LOCKED" : "SYSTEM NOT SET"}
                        </p>
                        <p className={!precisionMode || selectedNodeCount > 0 ? "text-eve-offwhite" : "text-eve-offwhite/45"}>
                          {!precisionMode || selectedNodeCount > 0 ? "SCORING TARGETS READY" : "SELECT PRECISION TARGETS"}
                        </p>
                        <p className={state.sponsorshipFee >= 50 ? "text-eve-offwhite" : "text-eve-offwhite/45"}>
                          {state.sponsorshipFee >= 50 ? "SPONSORSHIP THRESHOLD MET" : "SPONSORSHIP BELOW MINIMUM"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden border border-eve-yellow/45 bg-[radial-gradient(circle_at_top,rgba(229,179,43,0.18),transparent_42%),linear-gradient(180deg,rgba(12,12,12,0.9)_0%,rgba(8,8,8,0.98)_100%)] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(229,179,43,0.06),0_0_36px_rgba(229,179,43,0.12)]">
                  <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-eve-yellow/80 to-transparent" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">Projected Full Pool</p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-eve-offwhite/52">
                        Tournament prize poster
                      </p>
                    </div>
                    <div className="border border-eve-yellow/35 bg-black/24 px-3 py-2 text-right">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/52">Payout Share</p>
                      <p className="mt-1 text-2xl font-black uppercase tracking-[-0.04em] text-eve-offwhite">
                        {payoutSharePct}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-5xl font-black uppercase tracking-[-0.08em] text-eve-yellow drop-shadow-[0_0_22px_rgba(229,179,43,0.2)]">
                        {formatLux(estimatedMaxGrossPool)}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-eve-offwhite/72">{PAYMENT_TOKEN_LABEL} total at full registration</p>
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        <div className="border border-eve-red/18 bg-black/22 px-3 py-3">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/52">Target System</p>
                          <p className="mt-1 text-sm font-black uppercase tracking-[0.06em] text-eve-offwhite">
                            {selectedSystem?.systemName ?? "Not selected"}
                          </p>
                        </div>
                        <div className="border border-eve-red/18 bg-black/22 px-3 py-3">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/52">Duration</p>
                          <p className="mt-1 text-sm font-black uppercase tracking-[0.06em] text-eve-offwhite">
                            {formatDurationLabel(state.durationHours)}
                          </p>
                        </div>
                        <div className="border border-eve-red/18 bg-black/22 px-3 py-3 md:col-span-2">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/52">Fixed Roster Rule</p>
                          <p className="mt-1 text-sm font-black uppercase tracking-[0.06em] text-eve-offwhite">
                            {teamSize} pilots per squad
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border border-eve-red bg-eve-red/10 px-4 py-3 shadow-[0_0_0_1px_rgba(255,95,0,0.14),0_0_28px_rgba(255,95,0,0.12)]">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/62">Champion Prize</p>
                      <p className="mt-1 text-3xl font-black uppercase tracking-[-0.05em] text-eve-red">
                        {formatLux(topPrize)}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/74">{PAYMENT_TOKEN_SYMBOL} to 1st place</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="border border-eve-red/20 bg-black/22 px-4 py-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Guaranteed Stake</p>
                      <p className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-eve-offwhite">
                        {formatLux(guaranteedPool)}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/56">Host-funded base pool</p>
                    </div>

                    <div className="border border-eve-yellow/30 bg-eve-yellow/8 px-4 py-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Projected Entry Flow</p>
                      <p className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-eve-yellow">
                        {formatLux(projectedEntryFlow)}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/56">
                        If all {state.maxTeams} squads fill {teamSize} pilots and pay
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border border-eve-yellow/30 bg-black/24 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/62">Projected Payout Pool</p>
                        <p className="mt-1 text-3xl font-black uppercase tracking-[-0.05em] text-eve-red">
                          {formatLux(projectedPayoutPool)} {PAYMENT_TOKEN_SYMBOL}
                        </p>
                      </div>
                      <div className="border border-eve-red/40 bg-black/25 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-eve-offwhite/82">
                        95% to pilots
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2 md:grid-cols-3">
                    {prizeLadder.map((prize) => (
                      <div key={prize.label} className="border border-eve-red/18 bg-black/20 px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/52">{prize.label} Prize</p>
                        <p className={`mt-2 text-2xl font-black uppercase tracking-[-0.04em] ${prize.tone}`}>
                          {formatLux(prize.amount)}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">
                          {Math.round(prize.ratio * 100)}% of payout pool
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-[11px] leading-5 text-eve-offwhite/58">
                Full-pool estimate assumes every available squad registers with the fixed roster size of {teamSize} paid pilots.
              </p>
            </div>
          </div>
        </div>

        {feedbackMessage ? (
          <div className="mt-4 border border-eve-red/35 bg-eve-red/10 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-eve-offwhite">
            {feedbackMessage}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-3">
          {onClose ? (
            <TacticalButton tone="ghost" onClick={actions.handleClose} disabled={state.loading || state.loadingSystem}>
              CANCEL
            </TacticalButton>
          ) : null}
          <TacticalButton onClick={() => void actions.handlePublish()} disabled={state.loading || state.loadingSystem}>
            {state.loading ? "PUBLISHING" : "LOCK SPONSORSHIP & PUBLISH"}
          </TacticalButton>
        </div>
      </TacticalPanel>
    </section>
  );
}
