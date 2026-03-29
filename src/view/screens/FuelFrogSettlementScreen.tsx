"use client";

import Link from "next/link";
import { useFuelFrogSettlementScreenController } from "@/controller/useFuelFrogSettlementScreenController";
import { MatchShell } from "@/view/components/MatchShell";
import { SettlementBill } from "@/view/components/SettlementBill";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";
import { TeamMascotBadge } from "@/view/components/TeamMascotBadge";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function timelineToneClass(kind: "status" | "award" | "chain" | "warning") {
  if (kind === "award") {
    return "border-eve-yellow/35 bg-eve-yellow/10 text-eve-offwhite";
  }
  if (kind === "chain") {
    return "border-eve-offwhite/20 bg-eve-black/80 text-eve-offwhite/85";
  }
  if (kind === "warning") {
    return "border-eve-red/40 bg-eve-red/12 text-eve-offwhite/85";
  }
  return "border-eve-yellow/20 bg-eve-black/75 text-eve-offwhite/88";
}

export function FuelFrogSettlementScreen() {
  const { auth, view, actions } = useFuelFrogSettlementScreenController();

  return (
    <MatchShell
      title="SETTLEMENT LEDGER / FINAL REPORT"
      subtitle="Verify the bill path, review final splits, and present the reward story in one scan."
      activeRoute="/settlement"
      phase={view.shellPhase}
      countdownSec={view.countdownSec}
      roomId={view.roomId}
      staleSnapshot={view.staleSnapshot}
      bannerMessage={view.bannerMessage}
    >
      <section className="relative mx-auto w-full max-w-6xl overflow-hidden border border-eve-yellow/35 bg-eve-black/90 shadow-[0_0_0_1px_rgba(229,179,43,0.18),0_20px_65px_rgba(0,0,0,0.55)] backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(204,51,0,0.05)_1px,transparent_1px)] bg-[length:100%_4px]" />

        <header className="relative z-10 flex flex-col gap-4 border-b border-eve-yellow/25 bg-eve-black/95 px-5 py-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-eve-yellow">SETTLEMENT TRACE</p>
              <span
                className={cn(
                  "border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                  view.isDemoMode
                    ? "border-eve-yellow/40 bg-eve-yellow/10 text-eve-yellow"
                    : "border-eve-offwhite/20 bg-eve-black text-eve-offwhite/75"
                )}
              >
                {view.isDemoMode ? view.simulationLabel : "LIVE REPORT"}
              </span>
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-eve-offwhite/70">
              {view.statusTitle} | Match: {view.roomId}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/55">{view.statusNote}</p>
          </div>

          <div className="flex flex-col gap-3 xl:items-end">
            <div className="flex flex-wrap gap-2 xl:justify-end">
              <TacticalButton tone={view.isDemoMode ? "primary" : "ghost"} onClick={actions.showDemoReport}>
                DEMO
              </TacticalButton>
              <TacticalButton tone={!view.isDemoMode ? "primary" : "ghost"} onClick={actions.showLiveReport}>
                LIVE
              </TacticalButton>
              {view.isDemoMode ? (
                <>
                  <TacticalButton tone="ghost" onClick={actions.toggleDemoPlayback}>
                    {view.isDemoPlaying ? "PAUSE" : "RESUME"}
                  </TacticalButton>
                  <TacticalButton tone="ghost" onClick={actions.replayDemo}>
                    REPLAY
                  </TacticalButton>
                  <TacticalButton tone="danger" onClick={actions.jumpToReport}>
                    SHOW REPORT
                  </TacticalButton>
                </>
              ) : (
                <TacticalButton tone="ghost" onClick={actions.refreshLiveSettlement}>
                  REFRESH LIVE
                </TacticalButton>
              )}
            </div>

            <div className="text-left xl:text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-eve-offwhite/75">Settlement Progress</p>
              <p className="font-mono text-3xl text-eve-yellow">{view.progress}%</p>
            </div>
          </div>
        </header>

        {!view.reportReady ? (
          <div className="relative z-10 grid gap-4 p-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <TacticalPanel title="Settlement Status Rail" eyebrow="Simulated Settling">
              <div className="border border-eve-yellow/20 bg-eve-black/80 p-6 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-eve-yellow">{view.statusTitle}</p>
                <p className="mt-3 text-3xl font-mono text-eve-offwhite">{view.progress}%</p>
                <div className="mt-5 overflow-hidden border border-eve-yellow/20 bg-eve-grey/70 p-1">
                  <div
                    className="h-3 bg-eve-yellow transition-all duration-500"
                    style={{ width: `${view.progress}%` }}
                  />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-eve-offwhite/70">{view.statusNote}</p>
              </div>
            </TacticalPanel>

            <TacticalPanel title="Settlement Timeline" eyebrow="Resolution Feed">
              <ul className="space-y-2 text-xs text-eve-offwhite/85">
                {view.timeline.map((entry) => (
                  <li key={entry.id} className={cn("border px-3 py-2", timelineToneClass(entry.kind))}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/55">
                        {entry.timeLabel}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-eve-yellow/80">
                        {entry.kind.toUpperCase()}
                      </p>
                    </div>
                    <p className="mt-1 leading-5">{entry.message}</p>
                  </li>
                ))}
              </ul>
            </TacticalPanel>
          </div>
        ) : (
          <div className="relative z-10 space-y-4 p-4">
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)]">
              <TacticalPanel title="Payout Hero Board" eyebrow="Final Report">
                <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)]">
                  <TeamMascotBadge
                    accentColor={view.teamCards[0]?.accentColor ?? "#E5B32B"}
                    mascotSrc={view.teamCards[0]?.mascotSrc ?? "/mascot-shield.png"}
                    teamName={view.hero.championTeamName}
                    teamCode={view.teamCards[0]?.teamCode ?? "A"}
                    unitTag={view.teamCards[0]?.unitTag ?? "A-01"}
                    callsign={view.teamCards[0]?.callsign ?? "BASTION WING"}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-eve-yellow/20 bg-eve-black/80 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Champion</p>
                      <p className="mt-2 font-mono text-xl uppercase tracking-[0.1em] text-eve-yellow">
                        {view.hero.championTeamName}
                      </p>
                      <p className="mt-2 text-sm text-eve-offwhite/80">
                        Prize {view.money(view.hero.championPrizeAmount)}
                      </p>
                    </div>

                    <div className="border border-eve-yellow/20 bg-eve-black/80 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">My Payout</p>
                      <p className="mt-2 font-mono text-3xl text-eve-yellow">
                        {view.money(view.hero.myPayoutAmount)}
                      </p>
                      <p className="mt-2 text-sm uppercase tracking-[0.12em] text-eve-offwhite/70">
                        Pilot {view.hero.myPilotName}
                      </p>
                    </div>

                    <div className="border border-eve-yellow/20 bg-eve-black/80 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">MVP</p>
                      <p className="mt-2 font-mono text-lg uppercase tracking-[0.1em] text-eve-offwhite">
                        {view.hero.mvpPilotName}
                      </p>
                      <p className="mt-2 text-sm uppercase tracking-[0.12em] text-eve-offwhite/70">
                        {view.hero.mvpRole} // {view.hero.mvpScore} pts
                      </p>
                    </div>

                    <div className="border border-eve-yellow/20 bg-eve-black/80 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Payout Trace</p>
                      <p className="mt-2 font-mono text-sm text-eve-offwhite break-all">{view.hero.payoutTxDigest}</p>
                    </div>
                  </div>
                </div>
              </TacticalPanel>

              <TacticalPanel title="Pool Breakdown" eyebrow="Gross -> Fee -> Payout">
                {view.bill ? (
                  <div className="grid gap-3">
                    <div className="border border-eve-yellow/20 bg-eve-black/80 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Gross Pool</p>
                      <p className="mt-2 font-mono text-3xl text-eve-yellow">{view.money(view.bill.grossPool)}</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="border border-eve-yellow/20 bg-eve-black/80 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Platform Fee</p>
                        <p className="mt-2 font-mono text-xl text-eve-offwhite">{view.money(view.bill.platformFee)}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/55">
                          {view.percent(view.bill.platformFeeRate)}
                        </p>
                      </div>
                      <div className="border border-eve-yellow/20 bg-eve-black/80 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/55">Payout Pool</p>
                        <p className="mt-2 font-mono text-xl text-eve-yellow">{view.money(view.bill.payoutPool)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-eve-offwhite/70">NO REPORT BILL AVAILABLE</p>
                )}
              </TacticalPanel>
            </section>

            <TacticalPanel title="Team Distribution Grid" eyebrow="Rank -> Prize Split">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {view.teamCards.map((team) => (
                  <div key={team.teamId} className="border border-eve-yellow/20 bg-eve-black/80 p-3">
                    <div className="flex items-start gap-3">
                      <TeamMascotBadge
                        accentColor={team.accentColor}
                        mascotSrc={team.mascotSrc}
                        teamName={team.teamName}
                        teamCode={team.teamCode}
                        unitTag={team.unitTag}
                        callsign={team.callsign}
                        className="w-[3.9rem]"
                      />
                      <div className="min-w-0">
                        <p className="font-mono text-xs uppercase tracking-[0.14em] text-eve-offwhite">
                          #{team.rank} {team.teamName}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/55">
                          {team.callsign} // Score {team.totalScore}
                        </p>
                        <p className="mt-3 font-mono text-lg" style={{ color: team.accentColor }}>
                          {view.money(team.prizeAmount)}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/55">
                          Ratio {view.percent(team.prizeRatio)}
                          {team.isPlayerTeam ? " // YOUR TEAM" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TacticalPanel>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              {view.bill ? <SettlementBill bill={view.bill} /> : <TacticalPanel title="Settlement Ledger" eyebrow="Live Fallback">NO BILL</TacticalPanel>}

              <div className="space-y-4">
                <TacticalPanel title="Honor Tags" eyebrow="Final Recognition">
                  <div className="flex flex-wrap gap-2">
                    {view.honorTags.map((tag) => (
                      <span key={tag} className="border border-eve-yellow/30 bg-eve-black/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-eve-yellow">
                        {tag}
                      </span>
                    ))}
                  </div>
                </TacticalPanel>

                <TacticalPanel title="Settlement Actions" eyebrow="Next Step">
                  <div className="flex flex-wrap gap-2">
                    {!view.isDemoMode ? (
                      <TacticalButton onClick={actions.handleSettle} disabled={!auth.state.isConnected}>
                        Finalize Bill
                      </TacticalButton>
                    ) : null}
                    <TacticalButton tone="ghost" onClick={actions.showAuditLog}>
                      View Audit Log
                    </TacticalButton>
                    <Link
                      href="/lobby"
                      className="inline-flex border border-eve-red bg-eve-red px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#ffb599]"
                    >
                      Continue to Lobby
                    </Link>
                  </div>
                  <p className="mt-3 border border-eve-yellow/35 bg-eve-black/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-eve-offwhite">
                    {view.message}
                  </p>
                  {view.liveError ? (
                    <p className="mt-3 border border-eve-red/35 bg-eve-red/12 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-eve-offwhite">
                      LIVE ERROR // {view.liveError}
                    </p>
                  ) : null}
                </TacticalPanel>

                <TacticalPanel title="Resolution Feed" eyebrow="Settlement Timeline">
                  <ul className="space-y-2 text-xs text-eve-offwhite/85">
                    {view.timeline.map((entry) => (
                      <li key={entry.id} className={cn("border px-3 py-2", timelineToneClass(entry.kind))}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/55">
                            {entry.timeLabel}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-eve-yellow/80">
                            {entry.kind.toUpperCase()}
                          </p>
                        </div>
                        <p className="mt-1 leading-5">{entry.message}</p>
                      </li>
                    ))}
                  </ul>
                </TacticalPanel>
              </div>
            </section>
          </div>
        )}
      </section>
    </MatchShell>
  );
}
