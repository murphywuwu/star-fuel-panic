"use client";

import { useHeatmapScreenController } from "@/controller/useHeatmapScreenController";
import type { MissionSortBy } from "@/types/mission";
import { MatchShell } from "@/view/components/MatchShell";
import { MatchCard } from "@/view/components/MatchCard";
import { NodeDetailOverlay } from "@/view/components/NodeDetailOverlay";
import { NodeMap } from "@/view/components/NodeMap";
import { TacticalPanel } from "@/view/components/TacticalPanel";

const SORT_OPTIONS: Array<{ value: MissionSortBy; label: string }> = [
  { value: "weighted", label: "Pool x Urgency" },
  { value: "prize_pool", label: "Highest Pool" },
  { value: "urgency", label: "Highest Urgency" },
  { value: "created_at", label: "Newest" }
];

export function HeatmapScreen() {
  const controller = useHeatmapScreenController();
  const { mission, view, actions } = controller;

  return (
    <MatchShell
      title="SYSTEM MAP / FUELING MATCH BOARD"
      subtitle="Split view. Prioritize matches with the biggest pools and the highest urgency."
      activeRoute="/lobby"
      phase="lobby"
      countdownSec={view.selectedMissionCountdown}
      roomId={mission.selectedMission?.id}
      staleSnapshot={false}
    >
      <TacticalPanel title="Telemetry" eyebrow="Mission Sync">
        <p className="text-xs uppercase tracking-[0.18em] text-eve-offwhite/85">{view.statusText}</p>
      </TacticalPanel>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <NodeMap
          missions={mission.missions}
          selectedMissionId={view.effectiveSelectedMissionId}
          onSelectMission={actions.handleSelectMission}
          onOpenDetail={actions.handleOpenDetail}
        />

        <section className="border border-eve-red/15 bg-[#1a1a1a]/90 p-4 shadow-[0_0_0_1px_rgba(255,95,0,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-eve-red">MATCH BOARD</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-eve-offwhite/65">Available fuel runs</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <label className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-eve-offwhite/65">Sort</span>
                <select
                  className="border border-eve-red/25 bg-[#080808] px-2 py-1 text-eve-offwhite outline-none focus:border-eve-red"
                  onChange={(event) => actions.setSortBy(event.target.value as MissionSortBy)}
                  value={view.sortBy}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-eve-offwhite/65">Risk</span>
                <select
                  className="border border-eve-red/25 bg-[#080808] px-2 py-1 text-eve-offwhite outline-none focus:border-eve-red"
                  onChange={(event) => actions.setUrgencyFilter(event.target.value as typeof view.urgencyFilter)}
                  value={view.urgencyFilter}
                >
                  <option value="all">ALL</option>
                  <option value="critical">CRITICAL</option>
                  <option value="warning">WARNING</option>
                  <option value="safe">SAFE</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-4 max-h-[520px] space-y-3 overflow-auto pr-1">
            {mission.loading ? (
              <p className="border border-eve-red/25 bg-[#080808] px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite">
                Loading mission stream...
              </p>
            ) : null}

            {!mission.loading && mission.missions.length === 0 ? (
              <p className="border border-eve-red/40 bg-eve-red/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite">
                No open missions available.
              </p>
            ) : null}

            {mission.missions.map((item) => (
              <MatchCard
                key={item.id}
                mission={item}
                selected={item.id === view.effectiveSelectedMissionId}
                onSelect={actions.handleSelectMission}
                onOpenDetail={actions.handleOpenDetail}
              />
            ))}
          </div>
        </section>
      </section>

      <NodeDetailOverlay mission={view.detailMission} onClose={actions.closeDetail} open={view.detailOpen} />
    </MatchShell>
  );
}
