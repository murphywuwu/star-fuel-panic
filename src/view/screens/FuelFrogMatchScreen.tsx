"use client";

import { useFuelFrogMatchScreenController } from "@/controller/useFuelFrogMatchScreenController";
import { MatchShell } from "@/view/components/MatchShell";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TeamMascotBadge } from "@/view/components/TeamMascotBadge";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function feedToneClass(kind: "score" | "system" | "panic" | "warning") {
  if (kind === "panic") {
    return "border-eve-red/70 bg-eve-red/15 text-eve-offwhite";
  }
  if (kind === "warning") {
    return "border-eve-red/40 bg-eve-red/10 text-eve-offwhite/85";
  }
  if (kind === "system") {
    return "border-eve-offwhite/20 bg-eve-black/80 text-eve-offwhite/85";
  }
  return "border-eve-yellow/20 bg-eve-black/75 text-eve-offwhite/90";
}

function leaderStateClass(state: "LEAD" | "CHASE" | "RECOVER") {
  if (state === "LEAD") {
    return "border-eve-yellow/45 bg-eve-yellow/12 text-eve-yellow";
  }
  if (state === "CHASE") {
    return "border-eve-offwhite/25 bg-eve-offwhite/8 text-eve-offwhite";
  }
  return "border-eve-red/35 bg-eve-red/12 text-eve-red";
}

export function FuelFrogMatchScreen() {
  const { view, actions } = useFuelFrogMatchScreenController();

  return (
    <MatchShell
      title="MATCH OVERLAY / LIVE WARBOARD"
      subtitle="PRD 4.3 In-game Overlay: top timer, live scoreboard, target-node fuel status, and rolling event feed."
      activeRoute="/match"
      phase={view.phase}
      countdownSec={view.remainingSec}
      roomId={view.roomId}
      staleSnapshot={view.staleSnapshot}
      bannerMessage={view.bannerMessage}
    >
      <section
        className={cn(
          "relative mx-auto w-full max-w-6xl overflow-hidden border border-eve-yellow/35 bg-eve-black/90 shadow-[0_0_0_1px_rgba(229,179,43,0.18),0_20px_65px_rgba(0,0,0,0.55)] backdrop-blur-md",
          view.panicActive && "animate-pulse border-eve-red shadow-[0_0_0_1px_rgba(204,51,0,0.28),0_20px_80px_rgba(204,51,0,0.24)]"
        )}
      >
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(204,51,0,0.06)_1px,transparent_1px)] bg-[length:100%_4px]" />

        <header className="relative z-10 flex flex-col gap-4 border-b border-eve-yellow/25 bg-eve-black/95 px-5 py-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-eve-yellow">FUEL FROG PANIC</p>
              <span
                className={cn(
                  "border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                  view.isDemoMode
                    ? "border-eve-yellow/40 bg-eve-yellow/10 text-eve-yellow"
                    : "border-eve-offwhite/20 bg-eve-black text-eve-offwhite/75"
                )}
              >
                {view.isDemoMode ? view.simulationLabel : "LIVE FEED"}
              </span>
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-eve-offwhite/70">
              Status: {view.statusLabel(view.phase).toUpperCase()} | Match: {view.roomId}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/55">
              Telemetry: {view.isDemoMode ? "SCRIPTED REPLAY" : `API STREAM ${view.streamHealth.toUpperCase()}`}
            </p>
          </div>

          <div className="flex flex-col gap-3 xl:items-end">
            <div className="flex flex-wrap gap-2 xl:justify-end">
              <TacticalButton tone={view.isDemoMode ? "primary" : "ghost"} onClick={actions.showDemoReplay}>
                DEMO
              </TacticalButton>
              <TacticalButton tone={!view.isDemoMode ? "primary" : "ghost"} onClick={actions.showLiveFeed}>
                LIVE
              </TacticalButton>
              {view.isDemoMode ? (
                <>
                  <TacticalButton tone="ghost" onClick={actions.toggleReplayPlayback}>
                    {view.isReplayPlaying ? "PAUSE" : "RESUME"}
                  </TacticalButton>
                  <TacticalButton tone="ghost" onClick={actions.replayDemo}>
                    REPLAY
                  </TacticalButton>
                  <TacticalButton tone="danger" onClick={actions.jumpToPanic}>
                    PANIC JUMP
                  </TacticalButton>
                </>
              ) : null}
            </div>

            <div className="text-left xl:text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-eve-offwhite/75">
                {view.isDemoMode ? `Replay Clock ${Math.floor(view.playbackSec)}s / 60s` : "Deposit Window Remaining"}
              </p>
              <p className={cn("font-mono text-3xl text-eve-yellow", view.panicActive && "text-4xl text-eve-red")}>
                {view.formatCountdown(view.remainingSec)}
              </p>
            </div>
          </div>
        </header>

        {view.panicActive ? (
          <div className="relative z-10 border-b border-eve-red/50 bg-eve-red/20 px-5 py-3">
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-eve-red">
              PANIC MODE - ALL SCORE x1.5
            </p>
          </div>
        ) : null}

        {view.phase === "settling" ? (
          <div className="relative z-10 border-b border-eve-yellow/20 bg-eve-black/70 px-5 py-3">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-eve-offwhite/85">
              SETTLING ON-CHAIN DATA...
            </p>
          </div>
        ) : null}

        <div className="relative z-10 grid gap-4 p-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1.75fr)]">
          <section className="border border-eve-yellow/30 bg-eve-black/75 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-eve-yellow">
                {view.isDemoMode ? "Mascot Scoreboard" : "Scoreboard"}
              </p>
              {view.isDemoMode ? (
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/55">
                  4-team scripted telemetry
                </p>
              ) : null}
            </div>
            {view.leaderTeam ? (
              <div className="mt-3 grid gap-3 border border-eve-yellow/20 bg-eve-black/80 p-3 md:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Leader Lock</p>
                  <p className="mt-1 font-mono text-sm uppercase tracking-[0.14em] text-eve-offwhite">
                    {view.leaderTeam.unitTag} // {view.leaderTeam.teamName}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/62">
                    {view.leaderTeam.callsign} // {view.leaderTeam.specialty}
                  </p>
                </div>
                <div className="flex items-end gap-4 md:justify-end">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Lead Margin</p>
                    <p className="mt-1 font-mono text-lg text-eve-yellow">+{view.formatScore(view.chaseMargin)} pts</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Current Lead</p>
                    <p className="mt-1 font-mono text-lg text-eve-offwhite">{view.formatScore(view.leaderTeam.totalScore)}</p>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mt-3 space-y-3">
              {view.rankedTeams.length === 0 ? (
                <p className="text-xs text-eve-offwhite/70">WAITING FOR ACCEPTED SCORE EVENTS</p>
              ) : null}
              {view.rankedTeams.map((team) => {
                const ratio = Math.max(0.08, team.totalScore / view.leaderScore);
                return (
                  <article
                    key={team.teamId}
                    className="relative overflow-hidden border border-eve-yellow/20 bg-eve-black/75 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: team.accentColor }} />
                    <div
                      className="absolute right-0 top-0 h-10 w-20 opacity-20"
                      style={{ background: `linear-gradient(135deg, ${team.accentColor}55, transparent)` }}
                    />
                    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                      <TeamMascotBadge
                        accentColor={team.accentColor}
                        mascotSrc={team.mascotSrc}
                        teamName={team.teamName}
                        teamCode={team.teamCode}
                        unitTag={team.unitTag}
                        callsign={team.callsign}
                      />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-mono text-sm uppercase tracking-[0.12em] text-eve-offwhite">
                                <span style={{ color: team.accentColor }}>{team.teamCode}</span> {team.teamName}
                              </p>
                              <span className={cn("border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em]", leaderStateClass(team.leaderState))}>
                                {team.leaderState}
                              </span>
                            </div>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/55">
                              {team.callsign} // {team.specialty}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-mono text-sm" style={{ color: team.accentColor }}>
                              {view.formatScore(team.totalScore)} pts
                            </p>
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/55">
                              {team.rank === 1 ? "LEAD LOCK" : `-${view.formatScore(team.deltaFromLeader)} TO LEAD`}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 overflow-hidden border border-eve-yellow/20 bg-eve-grey/70 p-1">
                          <div className="relative">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:12.5%_100%]" />
                            <div
                              className="relative h-2.5 transition-all duration-500 shadow-[0_0_16px_rgba(255,255,255,0.12)]"
                              style={{ width: `${ratio * 100}%`, backgroundColor: team.accentColor }}
                            />
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border border-eve-yellow/15 bg-eve-black/70 px-2 py-2">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/78">
                            STATUS // {team.statusStrip}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: team.accentColor }}>
                            CALLSIGN {team.callsign}
                          </p>
                        </div>

                        {view.myScore && team.members.some((member) => member.walletAddress === view.myScore?.walletAddress) ? (
                          <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-eve-yellow/85">
                            You: {view.myScore.name} {view.formatScore(view.myScore.personalScore)} pts (
                            {(view.myScore.contributionRatio * 100).toFixed(1)}%)
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="space-y-4">
            <section className="border border-eve-yellow/30 bg-eve-black/75 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-eve-yellow">Target Nodes</p>
                {view.isDemoMode ? (
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/55">
                    scripted node telemetry
                  </p>
                ) : null}
              </div>
              <ul className="mt-3 space-y-3">
                {view.targetNodes.length === 0 ? <li className="text-xs text-eve-offwhite/70">NO TARGET NODES</li> : null}
                {view.targetNodes.map((node) => {
                  const fillPct = Math.round(node.fillRatio * 100);
                  const tone = view.statusTone(node.fillRatio);
                  return (
                    <li key={node.id} className="border border-eve-yellow/20 bg-eve-black/75 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-sm uppercase tracking-[0.12em] text-eve-offwhite">
                          {tone.icon} {node.name}
                        </p>
                        <p className={cn("font-mono text-xs uppercase tracking-[0.12em]", tone.toneClass)}>
                          {node.urgencyLabel} - {tone.multiplier}
                        </p>
                      </div>
                      <div className="mt-2 border border-eve-yellow/20 bg-eve-grey/70 p-1">
                        <div
                          className={cn("h-2.5 transition-all duration-500", view.panicActive && "animate-pulse")}
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
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-eve-yellow">
                  {view.isDemoMode ? "Scripted Event Feed" : "Live Event Feed"}
                </p>
                {view.isDemoMode ? (
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/55">
                    replay synced with scoreboard
                  </p>
                ) : null}
              </div>
              <ul className="mt-3 max-h-80 space-y-2 overflow-auto pr-1 text-xs text-eve-offwhite/85">
                {view.visibleFeed.length === 0 ? (
                  <li className="border border-eve-yellow/20 bg-eve-black/75 px-3 py-2">STANDBY // NO SCORE EVENTS</li>
                ) : null}

                {view.visibleFeed.map((entry) => (
                  <li key={entry.id} className={cn("border px-3 py-2", feedToneClass(entry.kind))}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/55">
                        {entry.timeLabel}
                      </p>
                      <p
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-[0.14em]",
                          entry.kind === "panic" ? "text-eve-red" : "text-eve-yellow/80"
                        )}
                      >
                        {entry.kind.toUpperCase()}
                      </p>
                    </div>
                    <p className="mt-1 leading-5">{entry.message}</p>
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
