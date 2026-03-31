"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMatchController } from "@/controller/useMatchController";
import { useMatchDemoReplayController } from "@/controller/useMatchDemoReplayController";
import { useMatchRuntimeController } from "@/controller/useMatchRuntimeController";
import { formatFuelGradeBadge, formatFuelMultiplier } from "@/utils/fuelGrade";
import type { MatchPresentationMode } from "@/types/matchDemoReplay";
import type { MatchStatus, MemberScoreLine, ScoreEvent } from "@/types/fuelMission";

interface ScreenTeamView {
  teamId: string;
  teamCode: string;
  teamName: string;
  unitTag: string;
  callsign: string;
  specialty: string;
  totalScore: number;
  members: MemberScoreLine[];
  mascotSrc: string;
  accentColor: string;
  lastAction: string;
  rank: number;
  deltaFromLeader: number;
  leaderState: "LEAD" | "CHASE" | "RECOVER";
  statusStrip: string;
}

type BaseScreenTeamView = Omit<ScreenTeamView, "deltaFromLeader" | "leaderState" | "statusStrip">;

interface ScreenNodeView {
  id: string;
  name: string;
  fillRatio: number;
  detail: string;
  urgencyLabel: string;
}

interface ScreenFeedView {
  id: string;
  kind: "score" | "system" | "panic" | "warning";
  message: string;
  timeLabel: string;
}

const LIVE_TEAM_SKINS = [
  {
    teamCode: "A",
    unitTag: "A-01",
    callsign: "BASTION WING",
    specialty: "HEAVY ARMOR ESCORT",
    mascotSrc: "/mascot-shield.png",
    accentColor: "#E5B32B"
  },
  {
    teamCode: "B",
    unitTag: "B-07",
    callsign: "VECTOR SWARM",
    specialty: "FAST STABILIZE CELL",
    mascotSrc: "/mascot-thinking.png",
    accentColor: "#E0E0E0"
  },
  {
    teamCode: "C",
    unitTag: "C-13",
    callsign: "BURN RIG",
    specialty: "CRITICAL REFILL CREW",
    mascotSrc: "/mascot-working.png",
    accentColor: "#CC3300"
  },
  {
    teamCode: "D",
    unitTag: "D-02",
    callsign: "LINK ARRAY",
    specialty: "COMMS + ROUTE CONTROL",
    mascotSrc: "/mascot-writing.png",
    accentColor: "#A69A72"
  }
] as const;

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

function formatFeedTime(seconds: number) {
  return `${Math.max(0, Math.floor(seconds)).toString().padStart(2, "0")}s`;
}

function formatLiveTime(timestampMs: number) {
  return new Date(timestampMs).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
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

function buildLeaderState(rank: number, deltaFromLeader: number): ScreenTeamView["leaderState"] {
  if (rank === 1) {
    return "LEAD";
  }
  if (deltaFromLeader <= 160) {
    return "CHASE";
  }
  return "RECOVER";
}

function buildStatusStrip(rank: number, deltaFromLeader: number, lastAction: string) {
  if (rank === 1) {
    return `LEAD HOLD // ${lastAction}`;
  }
  if (deltaFromLeader <= 160) {
    return `CONTACT RANGE // ${lastAction}`;
  }
  return `REBUILD WINDOW // ${lastAction}`;
}

function enrichTeamCards(
  teams: BaseScreenTeamView[]
): ScreenTeamView[] {
  const leaderScore = teams[0]?.totalScore ?? 0;

  return teams.map((team) => {
    const deltaFromLeader = Math.max(0, leaderScore - team.totalScore);

    return {
      ...team,
      deltaFromLeader,
      leaderState: buildLeaderState(team.rank, deltaFromLeader),
      statusStrip: buildStatusStrip(team.rank, deltaFromLeader, team.lastAction)
    };
  });
}

function buildLiveTeams(
  teams: Array<{
    teamId: string;
    teamName: string;
    totalScore: number;
    members: MemberScoreLine[];
  }>,
  eventFeed: Array<Pick<ScoreEvent, "id" | "teamId" | "memberName" | "score" | "fuelGrade">>
): BaseScreenTeamView[] {
  return teams.map((team, index) => {
    const skin = LIVE_TEAM_SKINS[index % LIVE_TEAM_SKINS.length];
    const lastEvent = eventFeed.find((event) => event.teamId === team.teamId);

    return {
      teamId: team.teamId,
      teamCode: index < LIVE_TEAM_SKINS.length ? skin.teamCode : `#${index + 1}`,
      teamName: team.teamName,
      unitTag: skin.unitTag,
      callsign: skin.callsign,
      specialty: skin.specialty,
      totalScore: team.totalScore,
      members: team.members,
      mascotSrc: skin.mascotSrc,
      accentColor: skin.accentColor,
      lastAction: lastEvent ? `${formatFuelGradeBadge(lastEvent.fuelGrade)} // ${lastEvent.memberName} +${Math.round(lastEvent.score)}` : "AWAITING SCORE EVENT",
      rank: index + 1
    };
  }).sort((left, right) => right.totalScore - left.totalScore).map((team, index) => ({
    ...team,
    rank: index + 1
  }));
}

function buildLiveFeedEntries(
  eventFeed: ScoreEvent[],
  rejectionFeed: Array<{
    id: string;
    reason: string;
    txDigest: string;
    createdAt: number;
  }>
): ScreenFeedView[] {
  const scoreEntries: Array<ScreenFeedView & { sortKey: number }> = eventFeed.map((event) => ({
    id: event.id,
    kind: "score",
    message:
      `${formatFuelGradeBadge(event.fuelGrade)} // ${event.memberName} -> ${event.assemblyId} | ` +
      `+${Math.round(event.fuelDelta)} fuel | +${Math.round(event.score)} pts | ` +
      `U${formatFuelMultiplier(event.urgencyWeight)} × P${formatFuelMultiplier(event.panicMultiplier)} × G${formatFuelMultiplier(event.fuelGrade.bonus)}`,
    timeLabel: formatLiveTime(event.createdAt),
    sortKey: event.createdAt
  }));

  const rejectionEntries: Array<ScreenFeedView & { sortKey: number }> = rejectionFeed.map((audit) => ({
    id: audit.id,
    kind: "warning",
    message: `FILTER_REJECTED // ${audit.reason} // tx=${audit.txDigest}`,
    timeLabel: formatLiveTime(audit.createdAt),
    sortKey: audit.createdAt
  }));

  return [...scoreEntries, ...rejectionEntries]
    .sort((left, right) => right.sortKey - left.sortKey)
    .slice(0, 8)
    .map(({ sortKey: _sortKey, ...entry }) => entry);
}

export function useFuelFrogMatchScreenController() {
  const searchParams = useSearchParams();
  const runtime = useMatchRuntimeController();
  const {
    startWatching: startLiveWatching,
    stopWatching: stopLiveWatching,
    scoreBoard: liveScoreBoard,
    matchScoreboard: liveMatchScoreboard,
    streamHealth: liveStreamHealth,
    eventFeed: liveEventFeed,
    rejectionFeed: liveRejectionFeed,
    myScore: liveMyScore
  } = useMatchController();
  const [presentationMode, setPresentationMode] = useState<MatchPresentationMode>("demo-replay");
  const replay = useMatchDemoReplayController(presentationMode === "demo-replay");
  const liveMatchIdFromQuery = searchParams.get("matchId")?.trim() || null;
  const liveMatchId = liveMatchIdFromQuery || runtime.state.room?.roomId || "match-local";

  useEffect(() => {
    if (presentationMode !== "live") {
      stopLiveWatching();
      return undefined;
    }

    startLiveWatching(liveMatchId);
    return () => {
      stopLiveWatching();
    };
  }, [presentationMode, liveMatchId, startLiveWatching, stopLiveWatching]);

  const liveRankedTeams = useMemo(
    () => [...(liveScoreBoard?.teams ?? [])].sort((left, right) => right.totalScore - left.totalScore),
    [liveScoreBoard]
  );

  const liveTeams = useMemo(
    () => enrichTeamCards(buildLiveTeams(liveRankedTeams, liveEventFeed)),
    [liveEventFeed, liveRankedTeams]
  );

  const liveTargetNodes = useMemo(
    () =>
      liveMatchScoreboard && liveMatchScoreboard.targetNodes.length > 0
        ? liveMatchScoreboard.targetNodes
            .map((node) => ({
              id: node.objectId,
              name: node.name,
              fillRatio: node.fillRatio,
              detail: `${node.urgency.toUpperCase()} // ${node.isOnline ? "ONLINE" : "OFFLINE"}`,
              urgencyLabel: node.urgency.toUpperCase()
            }))
            .sort((left, right) => left.fillRatio - right.fillRatio)
            .slice(0, 6)
        : [...runtime.state.nodes]
            .map((node) => ({
              id: node.nodeId,
              name: node.name,
              fillRatio: node.fillRatio,
              detail: `RISK ${node.riskWeight.toFixed(2)}`,
              urgencyLabel: node.fillRatio < 0.2 ? "CRITICAL" : node.fillRatio < 0.5 ? "WARN" : "SAFE"
            }))
            .sort((left, right) => left.fillRatio - right.fillRatio)
            .slice(0, 6),
    [liveMatchScoreboard, runtime.state.nodes]
  );

  const liveFeed = useMemo(
    () => buildLiveFeedEntries(liveEventFeed, liveRejectionFeed),
    [liveEventFeed, liveRejectionFeed]
  );

  const demoTeams = useMemo<BaseScreenTeamView[]>(
    () =>
      replay.state.frame.teams.map((team) => ({
        teamId: team.teamId,
        teamCode: team.teamCode,
        teamName: team.teamName,
        unitTag: team.unitTag,
        callsign: team.callsign,
        specialty: team.specialty,
        totalScore: team.score,
        members: [],
        mascotSrc: team.mascotSrc,
        accentColor: team.accentColor,
        lastAction: team.lastAction,
        rank: team.rank
      })),
    [replay.state.frame.teams]
  );

  const demoTargetNodes = useMemo<ScreenNodeView[]>(
    () =>
      replay.state.frame.targetNodes.map((node) => ({
        id: node.nodeId,
        name: node.name,
        fillRatio: node.fillRatio,
        detail: `${node.urgencyLabel} // ${node.fillRatio < 0.2 ? "3.0x" : node.fillRatio < 0.5 ? "1.5x" : "1.0x"}`,
        urgencyLabel: node.urgencyLabel
      })),
    [replay.state.frame.targetNodes]
  );

  const demoFeed = useMemo<ScreenFeedView[]>(
    () =>
      replay.state.frame.feed.map((burst) => ({
        id: burst.id,
        kind: burst.kind,
        message: burst.message,
        timeLabel: formatFeedTime(burst.atSec)
      })),
    [replay.state.frame.feed]
  );

  const isDemoMode = presentationMode === "demo-replay";
  const rankedTeams = isDemoMode ? enrichTeamCards(demoTeams) : liveTeams;
  const leaderScore = Math.max(1, rankedTeams[0]?.totalScore ?? 0);
  const leaderTeam = rankedTeams[0] ?? null;
  const chaseMargin = rankedTeams[1] ? rankedTeams[0].totalScore - rankedTeams[1].totalScore : 0;
  const targetNodes = isDemoMode ? demoTargetNodes : liveTargetNodes;
  const visibleFeed = isDemoMode ? demoFeed : liveFeed;
  const phase = isDemoMode ? replay.state.frame.status : runtime.state.status;
  const remainingSec = isDemoMode ? replay.state.frame.remainingSec : runtime.state.remainingSec;
  const panicActive = isDemoMode ? replay.state.frame.isPanic : runtime.state.isPanic || runtime.state.status === "panic";
  const roomId = isDemoMode ? replay.state.frame.roomId : liveMatchId;
  const streamHealth = isDemoMode ? "healthy" : liveStreamHealth;
  const bannerMessage = !isDemoMode && runtime.state.staleSnapshot ? "STALE SNAPSHOT // CURRENT TELEMETRY MAY LAG" : undefined;

  return {
    view: {
      presentationMode,
      isDemoMode,
      phase,
      remainingSec,
      panicActive,
      roomId,
      leaderScore,
      leaderTeam,
      chaseMargin,
      rankedTeams,
      targetNodes,
      visibleFeed,
      myScore: isDemoMode ? null : liveMyScore,
      streamHealth,
      staleSnapshot: !isDemoMode && runtime.state.staleSnapshot,
      bannerMessage,
      simulationLabel: isDemoMode ? replay.state.frame.simulationLabel : null,
      playbackSec: replay.state.playbackSec,
      isReplayPlaying: replay.state.isPlaying,
      formatCountdown,
      formatScore,
      statusLabel,
      statusTone
    },
    actions: {
      showDemoReplay: () => setPresentationMode("demo-replay"),
      showLiveFeed: () => setPresentationMode("live"),
      toggleReplayPlayback: () => {
        if (replay.state.isPlaying) {
          replay.actions.pause();
          return;
        }
        replay.actions.play();
      },
      replayDemo: () => replay.actions.replay(),
      jumpToPanic: () => replay.actions.jumpToPanic()
    }
  };
}
