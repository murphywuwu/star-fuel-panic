"use client";

import Link from "next/link";
import { useLobbyDiscoveryScreenController } from "@/controller/useLobbyDiscoveryScreenController";
import type { MatchDiscoveryDetail, MatchDiscoveryItem } from "@/types/match";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";
import { CreateMatchScreen } from "@/view/screens/CreateMatchScreen";
import type { SolarSystemSummary } from "@/types/solarSystem";
import { formatPaymentTokenAmount, PAYMENT_TOKEN_SYMBOL } from "@/utils/paymentToken";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function urgencyTone(urgency: "critical" | "warning" | "safe") {
  if (urgency === "critical") {
    return "text-eve-red";
  }
  if (urgency === "warning") {
    return "text-eve-yellow";
  }
  return "text-eve-offwhite/80";
}

function selectableLabel(selectableState: SolarSystemSummary["selectableState"]) {
  if (selectableState === "selectable") return "Selectable";
  if (selectableState === "offline_only") return "Offline Only";
  if (selectableState === "not_public") return "Coordinates Hidden";
  return "No Nodes";
}

function formatEntryFee(entryFee: number) {
  return entryFee > 0 ? formatPaymentTokenAmount(entryFee, { maximumFractionDigits: 0 }) : "Free";
}

function formatPool(pool: number) {
  return formatPaymentTokenAmount(pool, { maximumFractionDigits: 0 });
}

function formatStatusLabel(status: MatchDiscoveryItem["status"]) {
  if (status === "prestart") return "PRESTART";
  if (status === "running") return "RUNNING";
  if (status === "panic") return "PANIC";
  if (status === "settling") return "SETTLING";
  if (status === "settled") return "SETTLED";
  return "RECRUITING";
}

function statusTone(status: MatchDiscoveryItem["status"]) {
  if (status === "panic") return "border-eve-red/60 bg-eve-red/15 text-eve-red";
  if (status === "running") return "border-eve-yellow/45 bg-eve-yellow/10 text-eve-yellow";
  if (status === "settled") return "border-eve-offwhite/20 bg-[#111111] text-eve-offwhite/70";
  return "border-eve-red/25 bg-[#111111] text-eve-offwhite/78";
}

function targetScopeLabel(match: MatchDiscoveryItem) {
  return match.mode === "precision" ? `${match.targetNodeCount} locked nodes` : "System-wide scoring";
}

function distanceLabel(match: MatchDiscoveryItem) {
  if (match.distanceHops === null) {
    return match.distanceHint.toUpperCase();
  }

  if (match.distanceHops === 0) {
    return "ON SITE";
  }

  if (match.distanceHops === 1) {
    return "1 JUMP";
  }

  return `${match.distanceHops} JUMPS`;
}

function teamProgressPct(registeredTeams: number, maxTeams: number) {
  if (maxTeams <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((registeredTeams / maxTeams) * 100)));
}

function lobbyProjectedPool(match: MatchDiscoveryItem) {
  const projectedEntryFlow = match.entryFee * match.teamProgress.maxTeams * match.teamSize;
  return Math.max(match.grossPool, match.sponsorshipFee + projectedEntryFlow);
}

function actionLinkClass(tone: "primary" | "ghost" = "primary") {
  if (tone === "ghost") {
    return "inline-flex items-center justify-center gap-2 border border-eve-offwhite/20 bg-transparent px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite transition duration-150 hover:border-eve-offwhite/40 hover:bg-eve-offwhite/5";
  }

  return "inline-flex items-center justify-center gap-2 border border-eve-red bg-eve-red px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-black transition duration-150 hover:border-[#ffb599] hover:bg-[#ffb599]";
}

function MatchMetric({
  label,
  value,
  tone = "text-eve-offwhite"
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="border border-eve-red/15 bg-[#080808]/80 px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-eve-offwhite/48">{label}</p>
      <p className={`mt-2 text-sm font-black uppercase tracking-[0.08em] ${tone}`}>{value}</p>
    </div>
  );
}

function JoinMatchAction({
  joinCta
}: {
  joinCta: {
    href: string;
    label: string;
    disabled: boolean;
    blocker: string | null;
  };
}) {
  if (!joinCta.disabled) {
    return (
      <Link
        href={joinCta.href}
        className={actionLinkClass()}
        onClick={(event) => event.stopPropagation()}
      >
        {joinCta.label}
      </Link>
    );
  }

  return (
    <div
      className="group relative inline-flex"
      tabIndex={0}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      aria-label={joinCta.blocker ? `${joinCta.label}. ${joinCta.blocker}` : joinCta.label}
    >
      <TacticalButton disabled>{joinCta.label}</TacticalButton>
      {joinCta.blocker ? (
        <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 w-64 -translate-x-1/2 border border-eve-red/30 bg-[#080808]/96 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/85 opacity-0 shadow-[0_18px_32px_rgba(0,0,0,0.45)] transition duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
          {joinCta.blocker}
        </div>
      ) : null}
    </div>
  );
}

function MatchCard({
  match,
  selected,
  onSelect,
  joinCta
}: {
  match: MatchDiscoveryItem;
  selected: boolean;
  onSelect: () => void;
  joinCta: {
    href: string;
    label: string;
    disabled: boolean;
    blocker: string | null;
  };
}) {
  const progress = teamProgressPct(match.teamProgress.registeredTeams, match.teamProgress.maxTeams);
  const projectedPool = lobbyProjectedPool(match);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "w-full cursor-pointer border px-4 py-4 text-left transition",
        selected
          ? "border-eve-red bg-eve-red/10 shadow-[0_0_0_1px_rgba(255,95,0,0.18)]"
          : "border-eve-red/20 bg-[#101010]/90 hover:border-eve-red/45"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-eve-red/30 px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-eve-red/90">
              {match.modeLabel}
            </span>
            <span className={cn("border px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em]", statusTone(match.status))}>
              {formatStatusLabel(match.status)}
            </span>
            <span className="border border-eve-offwhite/15 px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-eve-offwhite/62">
              {distanceLabel(match)}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-black uppercase tracking-[0.04em] text-eve-offwhite">
            {match.name}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/68">
            <span className="border border-eve-red/15 bg-[#080808]/70 px-2 py-1">
              System // {match.targetSolarSystem.systemName}
            </span>
            <span className="border border-eve-red/15 bg-[#080808]/70 px-2 py-1">
              Scope // {targetScopeLabel(match)}
            </span>
          </div>
        </div>

        <div className="min-w-[150px] border border-eve-yellow/30 bg-[radial-gradient(circle_at_top,rgba(229,179,43,0.12),transparent_55%),#080808] px-4 py-3 text-right">
          <p className="text-[10px] uppercase tracking-[0.22em] text-eve-offwhite/50">Prize Pool</p>
          <p className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-eve-yellow">
            {new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(projectedPool)}
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">{PAYMENT_TOKEN_SYMBOL} gross</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <MatchMetric label="Entry" value={formatEntryFee(match.entryFee)} />
        <div className="border border-eve-red/15 bg-[#080808]/80 px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-eve-offwhite/48">Teams</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">{progress}% full</p>
          </div>
          <p className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-eve-offwhite">
            {match.teamProgress.registeredTeams}/{match.teamProgress.maxTeams}
          </p>
          <div className="mt-3 h-2 overflow-hidden border border-eve-red/20 bg-black/40">
            <div className="h-full bg-gradient-to-r from-eve-red to-eve-yellow" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <MatchMetric label="Roster" value={`${match.teamSize} pilots`} tone="text-eve-offwhite/84" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
        <JoinMatchAction joinCta={joinCta} />
      </div>
    </div>
  );
}

function MatchDetailSummary({ detail }: { detail: MatchDiscoveryDetail }) {
  const match = detail.match;
  const progress = teamProgressPct(match.teamProgress.registeredTeams, match.teamProgress.maxTeams);
  const projectedPool = lobbyProjectedPool(match);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-eve-red/30 px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-eve-red/90">
              {match.modeLabel}
            </span>
            <span className={cn("border px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em]", statusTone(match.status))}>
              {formatStatusLabel(match.status)}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-black uppercase tracking-[0.04em] text-eve-offwhite">{match.name}</h3>
          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-eve-offwhite/58">
            {match.targetSolarSystem.systemName} // {targetScopeLabel(match)}
          </p>
        </div>

        <div className="min-w-[168px] border border-eve-yellow/35 bg-[radial-gradient(circle_at_top,rgba(229,179,43,0.14),transparent_52%),#080808] px-4 py-3 text-right">
          <p className="text-[10px] uppercase tracking-[0.22em] text-eve-offwhite/50">Gross Pool</p>
          <p className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-eve-yellow">{formatPool(projectedPool)}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <MatchMetric label="Entry" value={formatEntryFee(match.entryFee)} />
        <MatchMetric label="Duration" value={`${match.durationHours}H`} />
        <div className="border border-eve-red/15 bg-[#080808]/80 px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-eve-offwhite/48">Teams</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">{progress}% full</p>
          </div>
          <p className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-eve-offwhite">
            {match.teamProgress.registeredTeams}/{match.teamProgress.maxTeams}
          </p>
          <div className="mt-3 h-2 overflow-hidden border border-eve-red/20 bg-black/40">
            <div className="h-full bg-gradient-to-r from-eve-red to-eve-yellow" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <MatchMetric label="Roster" value={`${match.teamSize} pilots`} />
      </div>

      <div className="border border-eve-red/15 bg-[#080808]/80 px-4 py-4">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red/90">Battlefield Brief</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <MatchMetric label="System" value={match.targetSolarSystem.systemName} />
          <MatchMetric label="Scoring Scope" value={targetScopeLabel(match)} />
        </div>
      </div>
    </div>
  );
}

export function LobbyDiscoveryScreen() {
  const controller = useLobbyDiscoveryScreenController();
  const { location, lobby, selectedMatch, ui, actions, helpers } = controller;

  return (
    <FuelMissionShell
      title="MATCH LOBBY"
      subtitle="Set your current system, filter live matches, inspect targets, and push pilots into the squad lobby."
      activeRoute="/lobby"
      phase="lobby"
      countdownSec={0}
      roomId={selectedMatch?.match.id}
      staleSnapshot={false}
      bannerMessage={lobby.error ?? location.error ?? undefined}
      bannerTone="error"
    >
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.9fr)]">
        <div className="space-y-4">
          <TacticalPanel title="My Position" eyebrow="Navigation Anchor">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-eve-offwhite/65">
                  {location.location
                    ? `${location.location.systemName ?? `System ${location.location.systemId}`} / ${
                        location.location.constellationName ?? `Constellation ${location.location.constellationId}`
                      }`
                    : "Location Not Set"}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-eve-red/80">
                  {location.location
                    ? `Region ${location.location.regionId} // Distance hints and recommendations online`
                    : "Set your location to unlock hop distance hints and free-mode recommendations"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <TacticalButton onClick={actions.openCreateMatch}>
                  CREATE MATCH
                </TacticalButton>
                <TacticalButton onClick={actions.openPicker}>
                  {location.location ? "CHANGE LOCATION" : "SET LOCATION"}
                </TacticalButton>
                {location.location ? (
                  <TacticalButton tone="ghost" onClick={() => actions.clearLocation()}>
                    CLEAR
                  </TacticalButton>
                ) : null}
              </div>
            </div>
          </TacticalPanel>

          <TacticalPanel title="Mission Filters" eyebrow="Lobby Read Model">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/65">
                Mode
                <select
                  className="mt-2 w-full border border-eve-red/25 bg-[#080808] px-3 py-2 text-xs text-eve-offwhite outline-none"
                  value={lobby.filters.mode}
                  onChange={(event) => void lobby.actions.setFilters({ mode: event.target.value as typeof lobby.filters.mode })}
                >
                  <option value="all">All Modes</option>
                  <option value="free">Free Mode</option>
                  <option value="precision">Precision Mode</option>
                </select>
              </label>
              <label className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/65">
                Status
                <select
                  className="mt-2 w-full border border-eve-red/25 bg-[#080808] px-3 py-2 text-xs text-eve-offwhite outline-none"
                  value={lobby.filters.status}
                  onChange={(event) => void lobby.actions.setFilters({ status: event.target.value as typeof lobby.filters.status })}
                >
                  <option value="lobby">Recruiting</option>
                  <option value="prestart">Prestart</option>
                  <option value="running">Running</option>
                  <option value="settled">Settled</option>
                </select>
              </label>
              <label className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/65">
                Distance
                <select
                  className="mt-2 w-full border border-eve-red/25 bg-[#080808] px-3 py-2 text-xs text-eve-offwhite outline-none"
                  value={lobby.filters.distance}
                  onChange={(event) => void lobby.actions.setFilters({ distance: event.target.value as typeof lobby.filters.distance })}
                >
                  <option value="all">All Distances</option>
                  <option value="same_system">Same System</option>
                  <option value="same_constellation">Same Constellation</option>
                  <option value="within_2">Within 2 Jumps</option>
                </select>
              </label>
            </div>
          </TacticalPanel>

          <TacticalPanel title="Active Matches" eyebrow="Discovery">
            <div className="space-y-3">
              {lobby.loadingMatches ? (
                <p className="border border-eve-red/25 bg-[#080808] px-3 py-3 text-xs uppercase tracking-[0.18em] text-eve-offwhite/75">
                  Loading lobby read model...
                </p>
              ) : null}

              {!lobby.loadingMatches && lobby.matches.length === 0 ? (
                <p className="border border-eve-red/25 bg-[#080808] px-3 py-3 text-xs uppercase tracking-[0.18em] text-eve-offwhite/75">
                  No matches available for the current filters.
                </p>
              ) : null}

              {lobby.matches.map((match) => {
                const selected = lobby.selectedMatchId === match.id;
                const joinCta = helpers.getJoinCta(match);

                return (
                  <MatchCard
                    key={match.id}
                    match={match}
                    selected={selected}
                    onSelect={() => void lobby.actions.openMatch(match.id)}
                    joinCta={joinCta}
                  />
                );
              })}
            </div>
          </TacticalPanel>
        </div>

        <div className="space-y-4">
          <TacticalPanel title="Match Detail" eyebrow="Preview">
            {!selectedMatch ? (
              <p className="text-xs uppercase tracking-[0.18em] text-eve-offwhite/70">Select a match on the left to inspect its detail.</p>
            ) : (
              <div className="space-y-4">
                <MatchDetailSummary detail={selectedMatch} />
                {(() => {
                  const joinCta = helpers.getJoinCta(selectedMatch.match);

                  return (
                    <div className="space-y-3 border border-eve-red/15 bg-[#080808]/80 px-4 py-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red/90">Join Access</p>
                      <div className="flex flex-wrap gap-2">
                        <JoinMatchAction joinCta={joinCta} />
                        <Link href="/planning" className={actionLinkClass("ghost")}>
                          Open Team Registry
                        </Link>
                      </div>
                      {joinCta.blocker ? (
                        <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/65">
                          Hover the disabled join button to inspect the blocker.
                        </p>
                      ) : (
                        <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/65">
                          Squad verified. Continue into Team Lobby to finish lock and payment.
                        </p>
                      )}
                    </div>
                  );
                })()}

                {selectedMatch.match.mode === "precision" ? (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red/90">Target Nodes</p>
                    {selectedMatch.match.targetNodes.length === 0 ? (
                      <p className="text-xs uppercase tracking-[0.18em] text-eve-offwhite/60">No frozen target-node snapshot is available yet.</p>
                    ) : null}
                    {selectedMatch.match.targetNodes.map((node) => (
                      <div key={node.objectId} className="border border-eve-red/20 bg-[#080808]/80 px-3 py-3 text-xs uppercase tracking-[0.16em]">
                        <div className="flex items-center justify-between gap-3">
                          <span>{node.name}</span>
                          <span className={urgencyTone(node.urgency)}>{node.urgency}</span>
                        </div>
                        <p className="mt-2 text-eve-offwhite/65">Fuel Fill: {Math.round(node.fillRatio * 100)}%</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red/90">Free Mode Recommendations</p>
                      {location.location ? (
                        <TacticalButton
                          tone="ghost"
                          onClick={() => void lobby.actions.loadRecommendations(selectedMatch.match.id)}
                          disabled={lobby.loadingRecommendationsFor === selectedMatch.match.id}
                        >
                          {lobby.loadingRecommendationsFor === selectedMatch.match.id ? "LOADING" : "REFRESH"}
                        </TacticalButton>
                      ) : null}
                    </div>

                    {!location.location ? (
                      <p className="text-xs uppercase tracking-[0.18em] text-eve-offwhite/60">Set your current location to unlock node recommendations.</p>
                    ) : null}

                    {location.location && lobby.recommendations.length === 0 ? (
                      <p className="text-xs uppercase tracking-[0.18em] text-eve-offwhite/60">No recommendations are available for the current context.</p>
                    ) : null}

                    {lobby.recommendations.map((recommendation) => (
                      <div key={recommendation.node.id} className="border border-eve-red/20 bg-[#080808]/80 px-3 py-3 text-xs uppercase tracking-[0.16em]">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-black text-eve-offwhite">{recommendation.node.name}</span>
                          <span className={urgencyTone(recommendation.node.urgency)}>{recommendation.node.urgency}</span>
                        </div>
                        <div className="mt-3 grid gap-2 md:grid-cols-2">
                          <MatchMetric
                            label="Route"
                            value={recommendation.distanceHops === 0 ? "ON SITE" : `${recommendation.distanceHops} JUMPS`}
                          />
                          <MatchMetric label="Score" value={recommendation.score.toFixed(2)} tone="text-eve-yellow" />
                        </div>
                        <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/52">{recommendation.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TacticalPanel>
        </div>
      </section>

      {ui.pickerOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 px-4">
          <div className="max-h-[85vh] w-full max-w-5xl overflow-auto border border-eve-red/25 bg-[#0f0f0f] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-eve-red/90">Set Position</p>
                <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.04em] text-eve-offwhite">Region / Constellation / System</h3>
              </div>
              <TacticalButton tone="danger" onClick={actions.closePicker}>
                CLOSE
              </TacticalButton>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <TacticalPanel title="Search" eyebrow="Direct Lookup">
                <input
                  value={ui.searchQuery}
                  onChange={(event) => void actions.handleSearchChange(event.target.value)}
                  placeholder="Search constellations or systems..."
                  className="w-full border border-eve-red/25 bg-[#080808] px-3 py-3 text-sm text-eve-offwhite outline-none"
                />

                <div className="mt-3 space-y-2">
                  {location.searching ? (
                    <p className="text-xs uppercase tracking-[0.16em] text-eve-offwhite/60">Searching...</p>
                  ) : null}
                  {location.searchHits.map((hit) => (
                    <button
                      key={`${hit.type}-${hit.id}`}
                      type="button"
                      className="w-full border border-eve-red/20 bg-[#080808]/80 px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-eve-offwhite/80"
                      onClick={() => void actions.handleSearchSelect(hit)}
                    >
                      <span className="text-eve-red/90">{hit.type}</span>
                      <span className="ml-2">{hit.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red/90">Recommended Systems</p>
                  <div className="mt-3 space-y-2">
                    {location.recommendedSystems.slice(0, 6).map((recommendation) => (
                      <button
                        key={recommendation.system.systemId}
                        type="button"
                        onClick={() => void actions.handleSystemSelect(recommendation.system)}
                        className="w-full border border-eve-red/20 bg-[#080808]/80 px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-eve-offwhite/80"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span>{recommendation.system.systemName}</span>
                          <span className={urgencyTone(recommendation.topUrgency)}>{recommendation.topUrgency}</span>
                        </div>
                        <p className="mt-2 text-eve-offwhite/55">{recommendation.summary}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </TacticalPanel>

              <TacticalPanel title="Constellations" eyebrow="Browse">
                <div className="space-y-4">
                  {ui.regionSummaries.map((region) => {
                    const expandedRegion = ui.expandedRegionId === region.regionId;
                    const constellations = ui.sortConstellations(location.constellationsByRegion[region.regionId] ?? []);

                    return (
                      <div key={region.regionId} className="border border-eve-red/15 bg-[#080808]/65 p-3">
                        <button
                          type="button"
                          onClick={() => void actions.toggleRegion(region)}
                          className="flex w-full items-center justify-between gap-3 text-left"
                        >
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-yellow">Region {region.regionId}</p>
                            <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-eve-offwhite/60">
                              {region.constellationCount} constellations // {region.selectableSystemCount} selectable systems
                            </p>
                          </div>
                          <div className="text-right text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/55">
                            <p>critical {region.urgentNodeCount}</p>
                            <p>warning {region.warningNodeCount}</p>
                          </div>
                        </button>

                        {expandedRegion ? (
                          <div className="mt-3 space-y-2">
                            {location.loadingConstellationsForRegion === region.regionId && constellations.length === 0 ? (
                              <p className="text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/55">Loading constellations...</p>
                            ) : null}
                            {constellations.map((constellation) => {
                              const systems = location.systemsByConstellation[constellation.constellationId] ?? [];
                              const expanded = ui.expandedConstellationId === constellation.constellationId;

                              return (
                                <div key={constellation.constellationId} className="border border-eve-red/15 bg-[#111111]/80">
                                  <button
                                    type="button"
                                    onClick={() => void actions.toggleConstellation(constellation.constellationId)}
                                    className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-eve-offwhite/82"
                                  >
                                    <span>{constellation.constellationName}</span>
                                    <span className="text-eve-offwhite/55">
                                      {constellation.selectableSystemCount}/{constellation.systemCount} selectable
                                    </span>
                                  </button>

                                  {expanded ? (
                                    <div className="border-t border-eve-red/10 px-3 py-3">
                                      {location.loadingSystems && systems.length === 0 ? (
                                        <p className="text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/55">Loading systems...</p>
                                      ) : null}
                                      <div className="space-y-2">
                                        {systems.map((system) => (
                                          <button
                                            key={system.systemId}
                                            type="button"
                                            onClick={() => void actions.handleSystemSelect(system)}
                                            className="flex w-full items-center justify-between gap-3 border border-eve-red/10 bg-[#080808]/70 px-3 py-2 text-left text-[11px] uppercase tracking-[0.14em] text-eve-offwhite/80"
                                          >
                                            <span>{system.systemName}</span>
                                            <span className={cn("text-[10px]", system.selectableState === "selectable" ? "text-eve-yellow" : "text-eve-offwhite/45")}>
                                              {selectableLabel(system.selectableState)}
                                            </span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </TacticalPanel>
            </div>
          </div>
        </div>
      ) : null}

      {ui.createMatchOpen ? (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/72 px-4">
          <div className="max-h-[88vh] w-full max-w-6xl overflow-auto border border-eve-red/25 bg-[#0f0f0f] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-eve-red/90">
                  Create Fuel Match
                </p>
                <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.04em] text-eve-offwhite">
                  Sponsor A New Fuel Operation
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-eve-offwhite/70">
                  Build the match directly from the lobby, define the scoring scope, set the player economics,
                  and publish the contract without leaving this page.
                </p>
              </div>
              <TacticalButton tone="danger" onClick={actions.closeCreateMatch}>
                CLOSE
              </TacticalButton>
            </div>

            <div className="mt-6">
              <CreateMatchScreen
                onClose={actions.closeCreateMatch}
                onPublished={(matchId) => void actions.handleMatchPublished(matchId)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </FuelMissionShell>
  );
}
