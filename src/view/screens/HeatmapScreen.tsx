"use client";

import { useEffect, useMemo, useState } from "react";
import { useMissionController } from "@/controller/useMissionController";
import type { Mission, MissionSortBy, UrgencyLevel } from "@/types/mission";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { MatchCard } from "@/view/components/MatchCard";
import { NodeDetailOverlay } from "@/view/components/NodeDetailOverlay";
import { NodeMap } from "@/view/components/NodeMap";
import { TacticalPanel } from "@/view/components/TacticalPanel";

type UrgencyFilter = "all" | UrgencyLevel;

const SORT_OPTIONS: Array<{ value: MissionSortBy; label: string }> = [
  { value: "weighted", label: "Pool x Urgency" },
  { value: "prize_pool", label: "Highest Pool" },
  { value: "urgency", label: "Highest Urgency" },
  { value: "created_at", label: "Newest" }
];

export function HeatmapScreen() {
  const [sortBy, setSortBy] = useState<MissionSortBy>("weighted");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMission, setDetailMission] = useState<Mission | null>(null);
  const [statusText, setStatusText] = useState("Waiting for mission intelligence sync...");

  const { missions, loading, selectedMission, loadMissions, selectMission } = useMissionController(sortBy);

  const effectiveSelectedMissionId = selectedMission?.id ?? missions[0]?.id ?? null;

  const selectedMissionCountdown = useMemo(() => {
    if (!selectedMission) {
      return 0;
    }
    return selectedMission.countdownSec ?? 0;
  }, [selectedMission]);

  useEffect(() => {
    let active = true;
    void loadMissions({
      sortBy,
      status: "open",
      urgency: urgencyFilter === "all" ? undefined : urgencyFilter,
      limit: 20
    }).then((result) => {
      if (!active) {
        return;
      }
      if (!result.ok) {
        setStatusText(`Mission load failed: ${result.message}`);
        return;
      }
      setStatusText("Mission intelligence synced. Click the map or a card to inspect details.");
    });

    return () => {
      active = false;
    };
  }, [loadMissions, sortBy, urgencyFilter]);

  const handleSelectMission = (missionId: string) => {
    selectMission(missionId);
    const mission = missions.find((item) => item.id === missionId);
    if (mission) {
      setStatusText(`Target node locked: ${mission.nodeName}`);
    }
  };

  const handleOpenDetail = (mission: Mission) => {
    selectMission(mission.id);
    setDetailMission(mission);
    setDetailOpen(true);
  };

  return (
    <FuelMissionShell
      title="SYSTEM MAP / FUELING MATCH BOARD"
      subtitle="Split view. Prioritize matches with the biggest pools and the highest urgency."
      activeRoute="/lobby"
      phase="lobby"
      countdownSec={selectedMissionCountdown}
      roomId={selectedMission?.id}
      staleSnapshot={false}
    >
      <TacticalPanel title="Telemetry" eyebrow="Mission Sync">
        <p className="text-xs uppercase tracking-[0.18em] text-eve-offwhite/85">{statusText}</p>
      </TacticalPanel>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <NodeMap
          missions={missions}
          selectedMissionId={effectiveSelectedMissionId}
          onSelectMission={handleSelectMission}
          onOpenDetail={handleOpenDetail}
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
                  onChange={(event) => setSortBy(event.target.value as MissionSortBy)}
                  value={sortBy}
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
                  onChange={(event) => setUrgencyFilter(event.target.value as UrgencyFilter)}
                  value={urgencyFilter}
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
            {loading ? (
              <p className="border border-eve-red/25 bg-[#080808] px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite">
                Loading mission stream...
              </p>
            ) : null}

            {!loading && missions.length === 0 ? (
              <p className="border border-eve-red/40 bg-eve-red/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite">
                No open missions available.
              </p>
            ) : null}

            {missions.map((mission) => (
              <MatchCard
                key={mission.id}
                mission={mission}
                selected={mission.id === effectiveSelectedMissionId}
                onSelect={handleSelectMission}
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>
        </section>
      </section>

      <NodeDetailOverlay mission={detailMission} onClose={() => setDetailOpen(false)} open={detailOpen} />
    </FuelMissionShell>
  );
}
