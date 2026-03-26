"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLobbyController } from "@/controller/useLobbyController";
import { useLocationController } from "@/controller/useLocationController";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";
import type { ConstellationSummary, RegionSummary, SearchHit, SolarSystemSummary } from "@/types/solarSystem";

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
  return entryFee > 0 ? `${entryFee} LUX / Pilot` : "Free Entry";
}

function sortConstellations(constellations: ConstellationSummary[]) {
  return [...constellations].sort(
    (left, right) => right.sortScore - left.sortScore || left.constellationId - right.constellationId
  );
}

export function LobbyDiscoveryScreen() {
  const location = useLocationController();
  const lobby = useLobbyController({
    currentSystemId: location.location?.systemId ?? null,
    currentConstellationId: location.location?.constellationId ?? null
  });
  const selectedMatch = lobby.selectedMatch;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [expandedRegionId, setExpandedRegionId] = useState<number | null>(null);
  const [expandedConstellationId, setExpandedConstellationId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const selectedMatchId = selectedMatch?.match.id;
    if (!selectedMatchId || selectedMatch.match.mode !== "free" || !location.location) {
      return;
    }

    if (lobby.recommendations.length > 0 || lobby.loadingRecommendationsFor === selectedMatchId) {
      return;
    }

    void lobby.actions.loadRecommendations(selectedMatchId);
  }, [
    lobby.actions,
    lobby.loadingRecommendationsFor,
    lobby.recommendations.length,
    location.location,
    selectedMatch
  ]);

  useEffect(() => {
    if (!pickerOpen) {
      return;
    }

    if (
      location.loadingBootstrap ||
      (location.regions.length > 0 && location.recommendedSystems.length > 0)
    ) {
      return;
    }

    void location.loadPickerBootstrap();
  }, [
    location.loadingBootstrap,
    location.regions.length,
    location.recommendedSystems.length,
    location.loadPickerBootstrap,
    pickerOpen
  ]);

  const regionSummaries = useMemo(
    () => [...location.regions].sort((left, right) => right.sortScore - left.sortScore || left.regionId - right.regionId),
    [location.regions]
  );

  const handleSystemSelect = async (system: SolarSystemSummary) => {
    location.setLocation(system);
    setPickerOpen(false);
  };

  const handleSearchSelect = async (hit: SearchHit) => {
    if (hit.type === "system") {
      await location.selectSystemById(hit.id);
      setPickerOpen(false);
      return;
    }

    if (typeof hit.regionId === "number") {
      setExpandedRegionId(hit.regionId);
      await location.loadRegionConstellations(hit.regionId);
    }
    setExpandedConstellationId(hit.id);
    await location.loadConstellationSystems(hit.id);
  };

  const toggleRegion = async (region: RegionSummary) => {
    if (expandedRegionId === region.regionId) {
      setExpandedRegionId(null);
      setExpandedConstellationId(null);
      return;
    }

    setExpandedRegionId(region.regionId);
    await location.loadRegionConstellations(region.regionId);
  };

  const toggleConstellation = async (constellationId: number) => {
    if (expandedConstellationId === constellationId) {
      setExpandedConstellationId(null);
      return;
    }

    setExpandedConstellationId(constellationId);
    await location.loadConstellationSystems(constellationId);
  };

  return (
    <FuelMissionShell
      title="MISSION LOBBY / DISCOVERY GRID"
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
                <TacticalButton onClick={() => setPickerOpen(true)}>
                  {location.location ? "CHANGE LOCATION" : "SET LOCATION"}
                </TacticalButton>
                {location.location ? (
                  <TacticalButton tone="ghost" onClick={() => location.clearLocation()}>
                    CLEAR
                  </TacticalButton>
                ) : null}
                <Link href="/nodes-map" className="border border-eve-yellow/40 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-eve-yellow">
                  NODE MAP
                </Link>
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
                const selected = selectedMatch?.match.id === match.id;

                return (
                  <button
                    key={match.id}
                    type="button"
                    onClick={() => void lobby.actions.openMatch(match.id)}
                    className={cn(
                      "w-full border px-4 py-4 text-left transition",
                      selected
                        ? "border-eve-red bg-eve-red/10 shadow-[0_0_0_1px_rgba(255,95,0,0.18)]"
                        : "border-eve-red/20 bg-[#101010]/90 hover:border-eve-red/45"
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-eve-red/90">{match.modeLabel}</p>
                        <h3 className="mt-2 text-lg font-black uppercase tracking-[0.04em] text-eve-offwhite">{match.name}</h3>
                      </div>
                      <span className="border border-eve-red/30 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/75">
                        {match.status}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-xs uppercase tracking-[0.16em] text-eve-offwhite/72 md:grid-cols-2">
                      <p>System: {match.targetSolarSystem.systemName}</p>
                      <p>Targets: {match.targetNodeSummary}</p>
                      <p>Prize Pool: {match.grossPool} LUX</p>
                      <p>Entry: {formatEntryFee(match.entryFee)}</p>
                      <p>
                        Team Progress: {match.teamProgress.registeredTeams}/{match.teamProgress.maxTeams}
                      </p>
                      <p>Distance: {match.distanceHint}</p>
                    </div>
                  </button>
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
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-eve-red/90">{selectedMatch.match.modeLabel}</p>
                  <h3 className="mt-2 text-xl font-black uppercase tracking-[0.04em] text-eve-offwhite">{selectedMatch.match.name}</h3>
                </div>

                <div className="grid gap-2 text-xs uppercase tracking-[0.16em] text-eve-offwhite/72">
                  <p>Target System: {selectedMatch.match.targetSolarSystem.systemName}</p>
                  <p>Target Summary: {selectedMatch.match.targetNodeSummary}</p>
                  <p>Prize Pool: {selectedMatch.match.grossPool} LUX</p>
                  <p>Entry: {formatEntryFee(selectedMatch.match.entryFee)}</p>
                  <p>
                    Team Progress: {selectedMatch.match.teamProgress.registeredTeams}/{selectedMatch.match.teamProgress.maxTeams}
                  </p>
                  <p>Distance Hint: {selectedMatch.match.distanceHint}</p>
                </div>

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
                          <span>{recommendation.node.name}</span>
                          <span className={urgencyTone(recommendation.node.urgency)}>{recommendation.node.urgency}</span>
                        </div>
                        <p className="mt-2 text-eve-offwhite/65">
                          {recommendation.reason} // Score {recommendation.score.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href={`/planning?matchId=${encodeURIComponent(selectedMatch.match.id)}`}
                  className="inline-flex border border-eve-red bg-eve-red px-4 py-3 text-xs font-black uppercase tracking-[0.24em] text-black transition hover:bg-[#ffb599]"
                >
                  Enter Team Lobby
                </Link>
              </div>
            )}
          </TacticalPanel>
        </div>
      </section>

      {pickerOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 px-4">
          <div className="max-h-[85vh] w-full max-w-5xl overflow-auto border border-eve-red/25 bg-[#0f0f0f] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-eve-red/90">Set Position</p>
                <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.04em] text-eve-offwhite">Region / Constellation / System</h3>
              </div>
              <TacticalButton tone="danger" onClick={() => setPickerOpen(false)}>
                CLOSE
              </TacticalButton>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <TacticalPanel title="Search" eyebrow="Direct Lookup">
                <input
                  value={searchQuery}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setSearchQuery(nextValue);
                    void location.search(nextValue);
                  }}
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
                      onClick={() => void handleSearchSelect(hit)}
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
                        onClick={() => void handleSystemSelect(recommendation.system)}
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
                  {regionSummaries.map((region) => {
                    const expandedRegion = expandedRegionId === region.regionId;
                    const constellations = sortConstellations(location.constellationsByRegion[region.regionId] ?? []);

                    return (
                      <div key={region.regionId} className="border border-eve-red/15 bg-[#080808]/65 p-3">
                        <button
                          type="button"
                          onClick={() => void toggleRegion(region)}
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
                              const expanded = expandedConstellationId === constellation.constellationId;

                              return (
                                <div key={constellation.constellationId} className="border border-eve-red/15 bg-[#111111]/80">
                                  <button
                                    type="button"
                                    onClick={() => void toggleConstellation(constellation.constellationId)}
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
                                            onClick={() => void handleSystemSelect(system)}
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
    </FuelMissionShell>
  );
}
