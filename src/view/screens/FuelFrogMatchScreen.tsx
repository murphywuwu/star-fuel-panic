"use client";

import { useEffect, useMemo } from "react";
import { useMatchController } from "@/controller/useMatchController";
import { useMatchRuntimeController } from "@/controller/useMatchRuntimeController";
import { MatchShell } from "@/view/components/MatchShell";
import type { MatchStatus } from "@/types/fuelMission";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

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

export function FuelFrogMatchScreen() {
  const { state } = useMatchRuntimeController();
  const {
    eventFeed,
    matchScoreboard,
    myScore,
    rejectionFeed,
    scoreBoard,
    startWatching,
    streamHealth,
    stopWatching
  } = useMatchController();

  useEffect(() => {
    const matchId = state.room?.roomId ?? "match-local";
    startWatching(matchId);
    return () => {
      stopWatching();
    };
  }, [startWatching, stopWatching, state.room?.roomId]);

  const panicActive = state.isPanic || state.status === "panic" || state.remainingSec <= 90;
  const rankedTeams = useMemo(
    () => [...(scoreBoard?.teams ?? [])].sort((a, b) => b.totalScore - a.totalScore),
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
            .sort((a, b) => a.fillRatio - b.fillRatio)
            .slice(0, 6)
        : [...state.nodes]
            .map((node) => ({
              id: node.nodeId,
              name: node.name,
              fillRatio: node.fillRatio,
              detail: `RISK ${node.riskWeight.toFixed(2)}`
            }))
            .sort((a, b) => a.fillRatio - b.fillRatio)
            .slice(0, 6),
    [matchScoreboard, state.nodes]
  );
  const visibleEvents = eventFeed.slice(0, 8);
  const visibleRejections = rejectionFeed.slice(0, 4);

  return (
    <MatchShell
      title="MATCH OVERLAY / LIVE WARBOARD"
      subtitle="PRD 4.3 In-game Overlay: top timer, live scoreboard, target-node fuel status, and rolling event feed."
      activeRoute="/match"
      phase={state.status}
      countdownSec={state.remainingSec}
      roomId={state.room?.roomId}
      staleSnapshot={state.staleSnapshot}
      bannerMessage={state.staleSnapshot ? "STALE SNAPSHOT // CURRENT TELEMETRY MAY LAG" : undefined}
    >
      <section
        className={cn(
          "relative mx-auto w-full max-w-5xl overflow-hidden border border-eve-yellow/35 bg-eve-black/90 shadow-[0_0_0_1px_rgba(229,179,43,0.18),0_20px_65px_rgba(0,0,0,0.55)] backdrop-blur-md",
          panicActive && "animate-pulse border-eve-red shadow-[0_0_0_1px_rgba(204,51,0,0.28),0_20px_80px_rgba(204,51,0,0.24)]"
        )}
      >
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(204,51,0,0.06)_1px,transparent_1px)] bg-[length:100%_4px]" />

        <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-eve-yellow/25 bg-eve-black/95 px-5 py-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-eve-yellow">FUEL FROG PANIC</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-eve-offwhite/70">
              Status: {statusLabel(state.status).toUpperCase()} | Match: {state.room?.roomId ?? "match-local"}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/55">
              API Stream: {streamHealth.toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-eve-offwhite/75">Deposit Window Remaining</p>
            <p className={cn("font-mono text-3xl text-eve-yellow", panicActive && "text-4xl text-eve-red")}>
              {formatCountdown(state.remainingSec)}
            </p>
          </div>
        </header>

        {panicActive ? (
          <div className="relative z-10 border-b border-eve-red/50 bg-eve-red/20 px-5 py-3">
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-eve-red">
              PANIC MODE - ALL SCORE x1.5
            </p>
          </div>
        ) : null}

        {state.status === "settling" ? (
          <div className="relative z-10 border-b border-eve-yellow/20 bg-eve-black/70 px-5 py-3">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-eve-offwhite/85">
              SETTLING ON-CHAIN DATA...
            </p>
          </div>
        ) : null}

        <div className="relative z-10 grid gap-4 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1.85fr)]">
          <section className="border border-eve-yellow/30 bg-eve-black/75 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-eve-yellow">Scoreboard</p>
            <div className="mt-3 space-y-3">
              {rankedTeams.length === 0 ? (
                <p className="text-xs text-eve-offwhite/70">WAITING FOR ACCEPTED SCORE EVENTS</p>
              ) : null}
              {rankedTeams.map((team, teamIndex) => {
                const ratio = Math.max(0.08, team.totalScore / leaderScore);
                const barClass = teamIndex === 0 ? "bg-eve-yellow" : "bg-eve-offwhite/45";
                return (
                  <article key={team.teamId} className="border border-eve-yellow/20 bg-eve-black/75 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-sm uppercase tracking-[0.12em] text-eve-offwhite">
                        {teamIndex === 0 ? "A" : teamIndex === 1 ? "B" : `#${teamIndex + 1}`} {team.teamName}
                      </p>
                      <p className="font-mono text-sm text-eve-yellow">{formatScore(team.totalScore)} pts</p>
                    </div>
                    <div className="mt-2 border border-eve-yellow/20 bg-eve-grey/70 p-1">
                      <div className={cn("h-2 transition-all duration-300", barClass)} style={{ width: `${ratio * 100}%` }} />
                    </div>
                    {myScore && team.members.some((member) => member.walletAddress === myScore.walletAddress) ? (
                      <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-eve-yellow/85">
                        You: {myScore.name} {formatScore(myScore.personalScore)} pts (
                        {(myScore.contributionRatio * 100).toFixed(1)}%)
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>

          <div className="space-y-4">
            <section className="border border-eve-yellow/30 bg-eve-black/75 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-eve-yellow">Target Nodes</p>
              <ul className="mt-3 space-y-3">
                {targetNodes.length === 0 ? <li className="text-xs text-eve-offwhite/70">NO TARGET NODES</li> : null}
                {targetNodes.map((node) => {
                  const fillPct = Math.round(node.fillRatio * 100);
                  const tone = statusTone(node.fillRatio);
                  return (
                    <li key={node.id} className="border border-eve-yellow/20 bg-eve-black/75 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-sm uppercase tracking-[0.12em] text-eve-offwhite">
                          {tone.icon} {node.name}
                        </p>
                        <p className={cn("font-mono text-xs uppercase tracking-[0.12em]", tone.toneClass)}>
                          {tone.note} - {tone.multiplier}
                        </p>
                      </div>
                      <div className="mt-2 border border-eve-yellow/20 bg-eve-grey/70 p-1">
                        <div
                          className={cn("h-2 transition-all duration-300", panicActive && "animate-pulse")}
                          style={{ width: `${fillPct}%`, backgroundColor: tone.barColor }}
                        />
                      </div>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-eve-offwhite/80">
                        Fill Ratio: {fillPct}% | {node.detail}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="border border-eve-yellow/30 bg-eve-black/75 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-eve-yellow">Live Event Feed</p>
              <ul className="mt-3 max-h-72 space-y-2 overflow-auto pr-1 text-xs text-eve-offwhite/85">
                {visibleEvents.length === 0 && visibleRejections.length === 0 ? (
                  <li className="border border-eve-yellow/20 bg-eve-black/75 px-3 py-2">STANDBY // NO SCORE EVENTS</li>
                ) : null}

                {visibleEvents.map((event) => (
                  <li key={event.id} className="border border-eve-yellow/20 bg-eve-black/75 px-3 py-2">
                    {event.memberName} {"->"} {event.assemblyId} | +{Math.round(event.fuelDelta)} fuel | +
                    {Math.round(event.score)} pts
                  </li>
                ))}

                {visibleRejections.map((audit) => (
                  <li key={audit.id} className="border border-eve-red/45 bg-eve-red/10 px-3 py-2 text-eve-offwhite/80">
                    WARN FILTER_REJECTED: {audit.reason} // tx={audit.txDigest}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>
    </MatchShell>
  );
}
