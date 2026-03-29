"use client";

import Link from "next/link";
import { useFuelFrogLobbyScreenController } from "@/controller/useFuelFrogLobbyScreenController";
import type { TeamRole } from "@/types/fuelMission";
import { PAYMENT_TOKEN_SYMBOL } from "@/utils/paymentToken";
import { MatchShell } from "@/view/components/MatchShell";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function FuelFrogLobbyScreen() {
  const controller = useFuelFrogLobbyScreenController();
  const { mission, auth, ui, helpers, actions } = controller;
  const { state, selectors } = mission;
  const { state: authState } = auth;

  return (
    <MatchShell
      title="SQUAD MANAGEMENT / LOBBY"
      subtitle="Create a squad, inspect open squads, pick role, then join and pay on the same team card."
      activeRoute="/planning"
      phase={state.phase}
      countdownSec={state.countdownSec}
      roomId={state.room?.roomId}
      staleSnapshot={state.staleSnapshot}
    >
      <div className="overflow-hidden border border-eve-red/20 bg-[linear-gradient(180deg,rgba(8,8,8,0.96)_0%,rgba(26,26,26,0.96)_100%)] px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-eve-red">MATCH GATE</span>
          <span className="font-mono text-xs text-eve-offwhite/70">
            {ui.paidTeams}/{ui.maxTeams} teams ready
          </span>
        </div>

        <div className="relative mt-4 h-3 overflow-hidden rounded-sm bg-eve-grey/60">
          {ui.minGateRatio > 0 && (
            <div
              className="absolute top-0 bottom-0 w-px bg-eve-yellow/90 z-10"
              style={{ left: `${ui.minGateRatio * 100}%` }}
            />
          )}
          <div
            className="absolute left-0 top-0 h-full bg-eve-yellow/40 transition-all duration-300"
            style={{ width: `${ui.registeredRatio * 100}%` }}
          />
          <div
            className="absolute left-0 top-0 h-full bg-eve-red transition-all duration-300"
            style={{ width: `${ui.paidRatio * 100}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.12em]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 bg-eve-red" />
              <span className="text-eve-offwhite/70">Paid {ui.paidTeams}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 bg-eve-yellow/40" />
              <span className="text-eve-offwhite/70">Registered {ui.registeredTeams}</span>
            </span>
          </div>
          <span className="text-eve-yellow/80">Min {ui.minTeams}</span>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
        <div className="space-y-4">
          <TacticalPanel title="Create Team" eyebrow="Captain">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Team Name</span>
                <input
                  value={ui.teamName}
                  onChange={(event) => actions.setTeamName(event.target.value)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Max Size (3-8)</span>
                <input
                  type="number"
                  min={3}
                  max={8}
                  value={ui.teamSize}
                  onChange={(event) => actions.setTeamSize(Number(event.target.value))}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Captain Name</span>
                <input
                  value={ui.captainName}
                  onChange={(event) => actions.setCaptainName(event.target.value)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Captain Role</span>
                <select
                  value={ui.captainRole}
                  onChange={(event) => actions.setCaptainRole(event.target.value as TeamRole)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                >
                  {ui.teamRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-3 border border-eve-red/15 bg-[#080808]/80 px-3 py-3">
              <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-yellow">Role Slot Plan</p>
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <label className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-eve-offwhite/70">Collector Slots</span>
                  <input
                    type="number"
                    min={0}
                    max={8}
                    value={ui.collectorSlots}
                    onChange={(event) => actions.setCollectorSlots(Number(event.target.value))}
                    className="w-full border border-eve-yellow/40 bg-eve-black/80 px-2 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-eve-offwhite/70">Hauler Slots</span>
                  <input
                    type="number"
                    min={0}
                    max={8}
                    value={ui.haulerSlots}
                    onChange={(event) => actions.setHaulerSlots(Number(event.target.value))}
                    className="w-full border border-eve-yellow/40 bg-eve-black/80 px-2 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-eve-offwhite/70">Escort Slots</span>
                  <input
                    type="number"
                    min={0}
                    max={8}
                    value={ui.escortSlots}
                    onChange={(event) => actions.setEscortSlots(Number(event.target.value))}
                    className="w-full border border-eve-yellow/40 bg-eve-black/80 px-2 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                  />
                </label>
              </div>
              <p className="mt-2 text-xs text-eve-offwhite/75">
                SLOT TOTAL: {ui.slotTotal} / TEAM SIZE {ui.teamSize} (shortfall will auto-fill with captain role)
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <TacticalButton onClick={actions.handleCreateTeam} disabled={!authState.isConnected}>
                Create Team
              </TacticalButton>
            </div>
          </TacticalPanel>

          <TacticalPanel title="Join Settings" eyebrow="Member">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Pilot Name</span>
                <input
                  value={ui.joinName}
                  onChange={(event) => actions.setJoinName(event.target.value)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Default Join Role</span>
                <select
                  value={ui.defaultJoinRole}
                  onChange={(event) => actions.setDefaultJoinRole(event.target.value as TeamRole)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                >
                  {ui.teamRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </TacticalPanel>
        </div>

        <div className="space-y-4">
          <TacticalPanel title="Open Squads" eyebrow="Recruiting">
            <div className="space-y-3">
              {state.teams.length === 0 ? (
                <p className="border border-eve-red/70 bg-eve-red/20 px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-eve-offwhite">
                  NO TEAMS YET
                </p>
              ) : null}

              {state.teams.map((team) => {
                const slots = selectors.teamSlots(team.teamId);
                const captainMatch = helpers.isCaptain(team, authState.walletAddress);
                const selected = team.teamId === ui.activeTeamId;
                const showJoinAction = !captainMatch && team.status === "forming";
                const joinDisabled = !authState.isConnected;
                const lockBlockers = helpers.lockBlockersForTeam(team);
                const payBlockers = helpers.payBlockersForTeam(team);
                const payAmount = state.funding.entryFeeLux * team.players.length;

                return (
                  <div
                    key={team.teamId}
                    className={
                      selected
                        ? "border border-eve-red bg-eve-red/10 px-3 py-3 shadow-[0_0_0_1px_rgba(255,95,0,0.3)]"
                        : "border border-eve-yellow/25 bg-eve-black/70 px-3 py-3 transition hover:border-eve-yellow/60"
                    }
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-mono text-sm uppercase tracking-[0.12em] text-eve-offwhite">{team.name}</p>
                      <div className="flex items-center gap-2">
                        {selected ? <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-eve-red">ACTIVE</span> : null}
                        <p className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">{helpers.teamStatusTag(team)}</p>
                      </div>
                    </div>

                    <div className="mt-2 grid gap-1 text-xs text-eve-offwhite/80 md:grid-cols-2">
                      <p>TEAM: {team.players.length} / {team.maxSize ?? 8}</p>
                      <p>ROLE GAPS: {helpers.openRolesText(team, selectors.teamSlots)}</p>
                      <p>CAPTAIN: {team.captainWallet ?? "N/A"}</p>
                      <p>CAPTAIN REP: PENDING (v1)</p>
                    </div>

                    <div className="mt-2 grid gap-1 border border-eve-red/10 bg-black/20 px-2 py-2 text-xs text-eve-offwhite/80">
                      {slots.map((slot) => (
                        <p key={slot.slotId}>
                          {slot.role}: {slot.member?.name ?? "OPEN"}
                        </p>
                      ))}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <TacticalButton tone="ghost" onClick={() => actions.setActiveTeamId(team.teamId)}>
                        View
                      </TacticalButton>

                      {showJoinAction ? (
                        <>
                          <select
                            value={ui.joinRoleByTeam[team.teamId] ?? ui.defaultJoinRole}
                            onChange={(event) => actions.setJoinRoleForTeam(team.teamId, event.target.value as TeamRole)}
                            className="border border-eve-yellow/50 bg-eve-black/80 px-2 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                          >
                            {ui.teamRoles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          <TacticalButton onClick={() => actions.handleJoinTeam(team.teamId)} disabled={joinDisabled}>
                            Join
                          </TacticalButton>
                        </>
                      ) : null}

                      {captainMatch ? (
                        <>
                          <TacticalButton tone="ghost" onClick={() => actions.handleLockTeam(team)} disabled={lockBlockers.length > 0}>
                            Lock
                          </TacticalButton>
                          <TacticalButton onClick={() => actions.handlePayEntry(team)} disabled={payBlockers.length > 0}>
                            Join & Pay
                          </TacticalButton>
                        </>
                      ) : null}
                    </div>

                    {captainMatch ? (
                      <p className="mt-2 text-xs text-eve-offwhite/70">ENTRY TOTAL: {payAmount} {PAYMENT_TOKEN_SYMBOL}</p>
                    ) : null}

                    {captainMatch && lockBlockers.length > 0 ? (
                      <div className="mt-2 border border-eve-red/60 bg-eve-red/20 px-3 py-2 text-xs text-eve-offwhite/85">
                        LOCK BLOCKER: {lockBlockers.join(" / ")}
                      </div>
                    ) : null}

                    {captainMatch && payBlockers.length > 0 ? (
                      <div className="mt-2 border border-eve-red/60 bg-eve-red/20 px-3 py-2 text-xs text-eve-offwhite/85">
                        PAY BLOCKER: {payBlockers.join(" / ")}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </TacticalPanel>
        </div>
      </section>

      {ui.paidTeams >= ui.minTeams ? (
        <Link
          href="/match"
          className="inline-flex border border-eve-yellow bg-eve-yellow px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-eve-black transition hover:bg-eve-offwhite"
        >
          Enter Match
        </Link>
      ) : null}

      <p className="border border-eve-yellow/35 bg-eve-black/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-eve-offwhite">
        {ui.message}
      </p>
    </MatchShell>
  );
}
