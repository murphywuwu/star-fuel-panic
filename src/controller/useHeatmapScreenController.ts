"use client";

import { useEffect, useMemo, useState } from "react";
import { useMissionController } from "@/controller/useMissionController";
import type { Mission, MissionSortBy, UrgencyLevel } from "@/types/mission";

type UrgencyFilter = "all" | UrgencyLevel;

export function useHeatmapScreenController() {
  const [sortBy, setSortBy] = useState<MissionSortBy>("weighted");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMission, setDetailMission] = useState<Mission | null>(null);
  const [statusText, setStatusText] = useState("Waiting for mission intelligence sync...");

  const missionController = useMissionController(sortBy);
  const { missions, loading, selectedMission, loadMissions, selectMission } = missionController;
  const effectiveSelectedMissionId = selectedMission?.id ?? missions[0]?.id ?? null;
  const selectedMissionCountdown = useMemo(
    () => selectedMission?.countdownSec ?? 0,
    [selectedMission]
  );

  useEffect(() => {
    let active = true;
    void loadMissions({
        sortBy,
        status: "open",
        urgency: urgencyFilter === "all" ? undefined : urgencyFilter,
        limit: 20
      })
      .then((result) => {
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
    const selected = missions.find((item) => item.id === missionId);
    if (selected) {
      setStatusText(`Target node locked: ${selected.nodeName}`);
    }
  };

  const handleOpenDetail = (targetMission: Mission) => {
    selectMission(targetMission.id);
    setDetailMission(targetMission);
    setDetailOpen(true);
  };

  return {
    mission: {
      missions,
      loading,
      selectedMission,
      loadMissions,
      selectMission
    },
    view: {
      sortBy,
      urgencyFilter,
      detailOpen,
      detailMission,
      statusText,
      effectiveSelectedMissionId,
      selectedMissionCountdown
    },
    actions: {
      setSortBy,
      setUrgencyFilter,
      handleSelectMission,
      handleOpenDetail,
      closeDetail: () => setDetailOpen(false)
    }
  };
}
