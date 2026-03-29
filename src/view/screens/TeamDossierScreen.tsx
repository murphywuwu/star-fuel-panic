"use client";

import Link from "next/link";
import { useTeamDossierScreenController } from "@/controller/useTeamDossierScreenController";
import { PAYMENT_TOKEN_SYMBOL } from "@/utils/paymentToken";
import type { MatchStatus } from "@/types/match";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

function shellPhase(status: MatchStatus | undefined) {
  if (status === "prestart") return "pre_start";
  if (status === "running") return "running";
  if (status === "panic") return "panic";
  if (status === "settling") return "settling";
  if (status === "settled") return "settled";
  return "lobby";
}

function linkClass(tone: "primary" | "ghost" = "primary") {
  if (tone === "ghost") {
    return "inline-flex items-center justify-center gap-2 border border-eve-offwhite/20 bg-transparent px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite transition duration-150 hover:border-eve-offwhite/40 hover:bg-eve-offwhite/5";
  }

  return "inline-flex items-center justify-center gap-2 border border-eve-red bg-eve-red px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-black transition duration-150 hover:border-[#ffb599] hover:bg-[#ffb599]";
}

function badgeClass(status: MatchStatus) {
  if (status === "panic") return "border-eve-red/60 bg-eve-red/15 text-eve-red";
  if (status === "running") return "border-eve-yellow/45 bg-eve-yellow/10 text-eve-yellow";
  if (status === "settling") return "border-eve-yellow/30 bg-eve-yellow/10 text-eve-offwhite";
  if (status === "settled") return "border-eve-offwhite/20 bg-[#111111] text-eve-offwhite/70";
  return "border-eve-red/25 bg-[#111111] text-eve-offwhite/78";
}

function MetricCard({ label, value, tone = "text-eve-offwhite" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="border border-eve-red/15 bg-[#080808]/80 px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-eve-offwhite/48">{label}</p>
      <p className={`mt-2 text-sm font-black uppercase tracking-[0.08em] ${tone}`}>{value}</p>
    </div>
  );
}

export function TeamDossierScreen() {
  const controller = useTeamDossierScreenController();
  const { state, dossier, ui, helpers, actions } = controller;
  const currentDeployment = ui.currentDeployment;
  const latestParticipation = ui.latestParticipation;
  const currentMatchLink = currentDeployment
    ? helpers.buildMatchHref(currentDeployment.match.matchId, currentDeployment.match.matchStatus)
    : null;

  return (
    <FuelMissionShell
      title="MY TEAM / MATCH HISTORY"
      subtitle="Left side shows the squad this wallet is in right now. Right side shows every squad match record, newest first."
      activeRoute="/team"
      phase={shellPhase(currentDeployment?.match.matchStatus)}
      countdownSec={0}
      roomId={currentDeployment?.match.matchId}
      staleSnapshot={false}
      bannerMessage={state.error ?? undefined}
      bannerTone="error"
    >
      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-4">
          <TacticalPanel title="Wallet Summary" eyebrow="Pilot">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard label="Matches" value={String(dossier?.summary.totalMatches ?? 0)} />
              <MetricCard label="Wins" value={String(dossier?.summary.wins ?? 0)} tone="text-eve-yellow" />
              <MetricCard label="Score" value={helpers.formatMoney(dossier?.summary.totalScore ?? 0)} />
              <MetricCard label="Earnings" value={`${helpers.formatMoney(dossier?.summary.totalEarnings ?? 0)} ${PAYMENT_TOKEN_SYMBOL}`} />
              <MetricCard label="Teams Joined" value={String(dossier?.summary.totalTeams ?? 0)} />
              <MetricCard label="Live Matches" value={String(dossier?.summary.activeDeployments ?? 0)} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <TacticalButton onClick={actions.retry} disabled={!ui.hasWallet || state.isLoading}>
                {state.isLoading ? "Refreshing..." : "Refresh Dossier"}
              </TacticalButton>
              <Link href="/lobby" className={linkClass("ghost")}>
                Open Lobby
              </Link>
            </div>

            {!ui.hasWallet ? (
              <p className="mt-4 border border-eve-red/20 bg-black/20 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/72">
                CONNECT YOUR WALLET FROM THE LEFT RAIL, THEN THIS DOSSIER WILL AUTO-LINK TO YOUR ACTIVE SQUAD.
              </p>
            ) : null}
          </TacticalPanel>

          <TacticalPanel title="Current Team" eyebrow="Now">
            <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-eve-offwhite/58">
              THIS BLOCK ONLY SHOWS A TEAM WHEN YOU ARE STILL IN A RECRUITING OR LIVE MATCH.
            </p>
            {currentDeployment ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="border border-eve-red/30 px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-eve-red/90">
                        {currentDeployment.match.modeLabel}
                      </span>
                      <span
                        className={`border px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${badgeClass(
                          currentDeployment.match.matchStatus
                        )}`}
                      >
                        {helpers.matchStatusLabel(currentDeployment.match.matchStatus)}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-black uppercase tracking-[0.04em] text-eve-offwhite">
                      {currentDeployment.team.name}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-eve-offwhite/58">
                      {currentDeployment.match.matchName} // {currentDeployment.match.solarSystemName}
                    </p>
                  </div>

                  <div className="border border-eve-yellow/30 bg-[radial-gradient(circle_at_top,rgba(229,179,43,0.12),transparent_55%),#080808] px-4 py-3 text-right">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-eve-offwhite/50">My Role Now</p>
                    <p className="mt-2 text-base font-black uppercase tracking-[0.06em] text-eve-yellow">
                      {helpers.roleLabel(currentDeployment.myRole)}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">
                      {helpers.teamStatusLabel(currentDeployment.team.status)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <MetricCard label="Captain" value={currentDeployment.team.captainAddress} tone="text-eve-offwhite/82" />
                  <MetricCard
                    label="Squad Size"
                    value={`${currentDeployment.team.memberCount}/${currentDeployment.team.maxSize}`}
                    tone="text-eve-offwhite/82"
                  />
                  <MetricCard label="Entry Fee" value={`${helpers.formatMoney(currentDeployment.match.entryFee)} ${PAYMENT_TOKEN_SYMBOL}`} />
                  <MetricCard label="Gross Pool" value={`${helpers.formatMoney(currentDeployment.match.grossPool)} ${PAYMENT_TOKEN_SYMBOL}`} tone="text-eve-yellow" />
                </div>

                <div className="grid gap-2 border border-eve-red/15 bg-[#080808]/70 px-3 py-3 text-xs text-eve-offwhite/82">
                  {ui.roleOrder.map((role) => (
                    <p key={role}>
                      {helpers.roleLabel(role)}: {helpers.countMembers(currentDeployment.team, role)}/
                      {currentDeployment.team.roleSlots[role]}
                    </p>
                  ))}
                </div>

                <div className="grid gap-2 border border-eve-yellow/15 bg-black/20 px-3 py-3 text-xs text-eve-offwhite/78">
                  {currentDeployment.team.members.map((member) => (
                    <p key={member.id}>
                      {helpers.roleLabel(member.role)} // {member.walletAddress} // {member.slotStatus}
                    </p>
                  ))}
                </div>

                {currentMatchLink ? (
                  <div className="flex flex-wrap gap-2">
                    <Link href={currentMatchLink.href} className={linkClass()}>
                      {currentMatchLink.label}
                    </Link>
                    <Link href="/planning" className={linkClass("ghost")}>
                      Open Team Registry
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : latestParticipation ? (
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.12em] text-eve-offwhite/72">
                  YOU ARE NOT IN A LIVE MATCH RIGHT NOW. THIS IS YOUR MOST RECENT SQUAD RECORD.
                </p>
                <div className="border border-eve-red/20 bg-[#080808]/70 px-4 py-4">
                  <p className="text-sm font-black uppercase tracking-[0.08em] text-eve-offwhite">{latestParticipation.teamName}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">
                    {latestParticipation.match.matchName} // {helpers.matchStatusLabel(latestParticipation.match.matchStatus)}
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <MetricCard label="Role" value={helpers.roleLabel(latestParticipation.role)} />
                    <MetricCard label="Score" value={helpers.formatMoney(latestParticipation.personalScore)} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/lobby" className={linkClass()}>
                    Find Match
                  </Link>
                  <Link href="/planning" className={linkClass("ghost")}>
                    Open Team Registry
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="border border-eve-red/20 bg-black/20 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/72">
                  THIS WALLET HAS NOT JOINED A SQUAD YET.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/lobby" className={linkClass()}>
                    Browse Matches
                  </Link>
                  <Link href="/planning" className={linkClass("ghost")}>
                    Create Team
                  </Link>
                </div>
              </div>
            )}
          </TacticalPanel>
        </div>

        <div className="space-y-4">
          <TacticalPanel title="Match History" eyebrow="Newest First">
            <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-eve-offwhite/58">
              EACH ROW IS ONE MATCH THIS WALLET ENTERED WITH A SQUAD.
            </p>
            <div className="space-y-3">
              {ui.participationHistory.length === 0 ? (
                <p className="border border-eve-red/20 bg-black/20 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/72">
                  NO FUEL MATCH HISTORY RECORDED FOR THIS WALLET.
                </p>
              ) : null}

              {ui.participationHistory.map((participation) => {
                const action = helpers.buildMatchHref(participation.match.matchId, participation.match.matchStatus);
                const showPayout = participation.match.matchStatus === "settled";

                return (
                  <article key={participation.teamId} className="border border-eve-red/18 bg-[#101010]/90 px-4 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="border border-eve-red/30 px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-eve-red/90">
                            {participation.match.modeLabel}
                          </span>
                          <span
                            className={`border px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${badgeClass(
                              participation.match.matchStatus
                            )}`}
                          >
                            {helpers.matchStatusLabel(participation.match.matchStatus)}
                          </span>
                        </div>
                        <h3 className="mt-3 text-base font-black uppercase tracking-[0.04em] text-eve-offwhite">
                          {participation.match.matchName}
                        </h3>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">
                          {participation.teamName} // {participation.match.solarSystemName} // {helpers.formatDate(participation.createdAt)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-eve-offwhite/48">
                          {showPayout ? "Your Reward" : "Current Pool"}
                        </p>
                        <p className="mt-2 text-lg font-black uppercase tracking-[0.04em] text-eve-yellow">
                          {helpers.formatMoney(showPayout ? participation.payout : participation.match.grossPool)}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">{PAYMENT_TOKEN_SYMBOL}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <MetricCard label="My Role" value={helpers.roleLabel(participation.role)} />
                      <MetricCard label="My Score" value={helpers.formatMoney(participation.personalScore)} />
                      <MetricCard label="Team Rank" value={participation.rank ? `#${participation.rank}` : "UNRANKED"} />
                      <MetricCard label="Squad State" value={helpers.teamStatusLabel(participation.teamStatus)} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={action.href} className={linkClass()}>
                        {action.label}
                      </Link>
                      <Link href="/planning" className={linkClass("ghost")}>
                        Open Team Registry
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </TacticalPanel>
        </div>
      </section>

      <p className="border border-eve-yellow/35 bg-eve-black/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-eve-offwhite">
        {state.isLoading ? "LOADING TEAM DOSSIER..." : ui.message}
      </p>
    </FuelMissionShell>
  );
}
