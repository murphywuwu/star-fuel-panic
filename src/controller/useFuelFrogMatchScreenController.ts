"use client";

import { useEffect, useMemo } from "react";
import { useMatchController } from "@/controller/useMatchController";
import { useMatchRuntimeController } from "@/controller/useMatchRuntimeController";
import type { MatchStatus } from "@/types/fuelMission";

function formatCountdown(totalSec: number) {
  const safe = Math.max(0, Math.floor(totalSec));
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatScore(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

function statusLabel(status: MatchStatus) {
  switch (status) {
    case "lobby":
      return "Lobby";
    case "pre_start":
      return "PreStart";
    case "running":
      return "Running";
    case "panic":
      return "Panic";
    case "settling":
      return "Settling";
    case "settled":
      return "Settled";
    default:
      return "Lobby";
  }
}

function statusTone(fillRatio: number) {
  if (fillRatio < 0.2) {
    return {
      icon: "[CRIT]",
      toneClass: "text-eve-red",
      note: "CRITICAL",
      multiplier: "3.0x",
      barColor: "#CC3300"
    };
  }
  if (fillRatio < 0.5) {
    return {
      icon: "[WARN]",
      toneClass: "text-eve-yellow",
      note: "STRESSED",
      multiplier: "1.5x",
      barColor: "#E5B32B"
    };
  }
  return {
    icon: "[SAFE]",
    toneClass: "text-[#6DB36D]",
    note: "STABLE",
    multiplier: "1.0x",
    barColor: "#6DB36D"
  };
}

export function useFuelFrogMatchScreenController() {
  const runtime = useMatchRuntimeController();
  const matchController = useMatchController();
  const {
    startWatching,
    stopWatching,
    scoreBoard,
    matchScoreboard,
    eventFeed,
    rejectionFeed
  } = matchController;

  useEffect(() => {
    const matchId = runtime.state.room?.roomId ?? "match-local";
    startWatching(matchId);
    return () => {
      stopWatching();
    };
  }, [runtime.state.room?.roomId, startWatching, stopWatching]);

  const panicActive = runtime.state.isPanic || runtime.state.status === "panic" || runtime.state.remainingSec <= 90;
  const rankedTeams = useMemo(
    () => [...(scoreBoard?.teams ?? [])].sort((left, right) => right.totalScore - left.totalScore),
    [scoreBoard]
  );
  const leaderScore = Math.max(1, rankedTeams[0]?.totalScore ?? 0);
  const targetNodes = useMemo(
    () =>
      matchScoreboard && matchScoreboard.targetNodes.length > 0
        ? matchScoreboard.targetNodes
            .map((node) => ({
              id: node.objectId,
              name: node.name,
              fillRatio: node.fillRatio,
              detail: `${node.urgency.toUpperCase()} // ${node.isOnline ? "ONLINE" : "OFFLINE"}`
            }))
            .sort((left, right) => left.fillRatio - right.fillRatio)
            .slice(0, 6)
        : [...runtime.state.nodes]
            .map((node) => ({
              id: node.nodeId,
              name: node.name,
              fillRatio: node.fillRatio,
              detail: `RISK ${node.riskWeight.toFixed(2)}`
            }))
            .sort((left, right) => left.fillRatio - right.fillRatio)
            .slice(0, 6),
    [matchScoreboard, runtime.state.nodes]
  );

  return {
    runtime,
    match: matchController,
    view: {
      panicActive,
      rankedTeams,
      leaderScore,
      targetNodes,
      visibleEvents: eventFeed.slice(0, 8),
      visibleRejections: rejectionFeed.slice(0, 4),
      formatCountdown,
      formatScore,
      statusLabel,
      statusTone
    }
  };
}
