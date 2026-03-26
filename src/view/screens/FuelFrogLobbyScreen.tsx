"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuthController, walletErrorMessage } from "@/controller/useAuthController";
import { useFuelMissionController } from "@/controller/useFuelMissionController";
import type { TeamRole, TeamState } from "@/types/fuelMission";
import { MatchShell } from "@/view/components/MatchShell";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

const TEAM_ROLES: TeamRole[] = ["Collector", "Hauler", "Escort"];

function teamStatusTag(team: TeamState) {
  if (team.status === "paid") {
    return "PAID";
  }
  if (team.status === "locked") {
    return "LOCKED";
  }
  return "FORMING";
}

function isCaptain(team: TeamState, walletAddress: string | null) {
  if (!walletAddress) {
    return false;
  }
  return (team.captainWallet ?? "").toLowerCase() === walletAddress.toLowerCase();
}

function buildRoleSlots(
  maxSize: number,
  collectorSlots: number,
  haulerSlots: number,
  escortSlots: number,
  captainRole: TeamRole
): TeamRole[] {
  const slots: TeamRole[] = [];

  for (let i = 0; i < collectorSlots; i += 1) {
    slots.push("Collector");
  }
  for (let i = 0; i < haulerSlots; i += 1) {
    slots.push("Hauler");
  }
  for (let i = 0; i < escortSlots; i += 1) {
    slots.push("Escort");
  }

  if (slots.length === 0) {
    slots.push(captainRole);
  }

  while (slots.length < maxSize) {
    slots.push(captainRole);
  }

  const normalized = slots.slice(0, maxSize);
  if (!normalized.includes(captainRole)) {
    normalized[0] = captainRole;
  }

  return normalized;
}

function openRolesText(team: TeamState, teamSlots: ReturnType<typeof useFuelMissionController>["selectors"]["teamSlots"]) {
  const openRoles = Array.from(new Set(teamSlots(team.teamId).filter((slot) => !slot.filled).map((slot) => slot.role)));
  return openRoles.length > 0 ? openRoles.join(" / ") : "NONE";
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function clampRatio(value: number) {
  return Math.max(0, Math.min(1, value));
}

function inferredStartRuleMode(summary: string | undefined) {
  return summary && /fully paid|starts when\s+\d+/i.test(summary) ? "full_paid" : "min_team_force_start";
}

export function FuelFrogLobbyScreen() {
  const { state, actions, selectors } = useFuelMissionController();
  const { state: authState, actions: authActions } = useAuthController();

  const [teamName, setTeamName] = useState("Team Alpha");
  const [teamSize, setTeamSize] = useState(4);
  const [captainName, setCaptainName] = useState("Captain Murphy");
  const [captainRole, setCaptainRole] = useState<TeamRole>("Collector");
  const [collectorSlots, setCollectorSlots] = useState(1);
  const [haulerSlots, setHaulerSlots] = useState(1);
  const [escortSlots, setEscortSlots] = useState(1);

  const [joinName, setJoinName] = useState("Pilot Nova");
  const [defaultJoinRole, setDefaultJoinRole] = useState<TeamRole>("Hauler");
  const [joinRoleByTeam, setJoinRoleByTeam] = useState<Record<string, TeamRole>>({});

  const [activeTeamId, setActiveTeamId] = useState("");
  const [message, setMessage] = useState("SQUAD LOBBY ONLINE // CREATE OR JOIN A TEAM");

  const paidTeams = useMemo(() => state.teams.filter((team) => team.status === "paid").length, [state.teams]);

  const registeredTeams = state.teams.length;
  const minTeams = state.funding.minTeams ?? 1;
  const maxTeams = state.funding.maxTeams ?? 10;
  const minPlayersPerTeam = state.funding.minPlayersPerTeam ?? 3;
  const startRuleMode = inferredStartRuleMode(state.funding.startRuleSummary);
  const registeredRatio = clampRatio(registeredTeams / Math.max(1, maxTeams));
  const paidRatio = clampRatio(paidTeams / Math.max(1, maxTeams));
  const minGateRatio = clampRatio(minTeams / Math.max(1, maxTeams));
  const pendingTeams = Math.max(0, registeredTeams - paidTeams);

  const slotTotal = collectorSlots + haulerSlots + escortSlots;

  useEffect(() => {
    if (!activeTeamId && (state.myTeamId || state.teams[0])) {
      setActiveTeamId(state.myTeamId ?? state.teams[0]?.teamId ?? "");
    }
  }, [activeTeamId, state.myTeamId, state.teams]);

  const ensureLobbyRoom = () => {
    if (state.room) {
      return true;
    }

    const result = actions.onCreateRoom();
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${walletErrorMessage(result.errorCode, result.message)}`);
      return false;
    }
    return true;
  };

  const lockBlockersForTeam = (team: TeamState) => {
    const blockers: string[] = [];

    if (!isCaptain(team, authState.walletAddress)) {
      blockers.push("Captain only: lock team");
    }
    if (!selectors.isTeamReady(team.teamId)) {
      blockers.push("Role slots are not filled");
    }
    if (team.players.length < minPlayersPerTeam) {
      blockers.push(`Not enough players. Minimum ${minPlayersPerTeam}`);
    }

    return blockers;
  };

  const payBlockersForTeam = (team: TeamState) => {
    const blockers: string[] = [];
    const payAmount = state.funding.entryFeeLux * team.players.length;

    if (!authState.isConnected) {
      blockers.push("Wallet not connected");
    }
    if (!isCaptain(team, authState.walletAddress)) {
      blockers.push("Captain only: pay entry");
    }
    if (team.status !== "locked") {
      blockers.push("Team is not locked");
    }
    if (!selectors.isTeamReady(team.teamId)) {
      blockers.push("Role slots are not filled");
    }
    if (team.players.length < minPlayersPerTeam) {
      blockers.push(`Not enough players. Minimum ${minPlayersPerTeam}`);
    }
    if (authState.luxBalance < payAmount) {
      blockers.push(`Insufficient balance (need ${payAmount} LUX)`);
    }

    return blockers;
  };

  const handleCreateTeam = () => {
    if (!authState.isConnected || !authState.walletAddress) {
      setMessage("WALLET NOT CONNECTED // CONNECT BEFORE CREATING A SQUAD");
      return;
    }
    if (!ensureLobbyRoom()) {
      return;
    }

    const roleSlots = buildRoleSlots(teamSize, collectorSlots, haulerSlots, escortSlots, captainRole);
    const result = actions.onCreateTeam({
      teamName,
      maxSize: teamSize,
      captainWallet: authState.walletAddress,
      captainName: captainName.trim(),
      captainRole,
      roleSlots
    });

    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${walletErrorMessage(result.errorCode, result.message)}`);
      return;
    }

    const teamId = result.payload?.team.teamId;
    if (teamId) {
      setActiveTeamId(teamId);
    }
    setMessage(`TEAM CREATED // ${result.payload?.team.name ?? "N/A"}`);
  };

  const handleJoinTeam = (teamId: string) => {
    if (!authState.isConnected || !authState.walletAddress) {
      setMessage("WALLET NOT CONNECTED // CONNECT BEFORE JOINING");
      return;
    }
    if (!ensureLobbyRoom()) {
      return;
    }

    const joinRole = joinRoleByTeam[teamId] ?? defaultJoinRole;
    const result = actions.onJoinTeam({
      teamId,
      walletAddress: authState.walletAddress,
      name: joinName.trim(),
      role: joinRole
    });

    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${walletErrorMessage(result.errorCode, result.message)}`);
      return;
    }

    setActiveTeamId(result.payload?.teamId ?? teamId);
    setMessage(`JOINED TEAM // ${result.payload?.teamId ?? teamId} // ${result.payload?.playerCount ?? 0} PILOTS`);
  };

  const handleLockTeam = (team: TeamState) => {
    const result = actions.onLockTeam(team.teamId, authState.walletAddress ?? "");
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${walletErrorMessage(result.errorCode, result.message)}`);
      return;
    }

    setMessage(`TEAM LOCKED // ${team.name}`);
  };

  const handlePayEntry = async (team: TeamState) => {
    if (!authState.isConnected || !authState.walletAddress) {
      setMessage("WALLET NOT CONNECTED // CONNECT BEFORE PAYMENT");
      return;
    }

    const payAmount = state.funding.entryFeeLux * team.players.length;
    const payment = await authActions.onExecuteEntryPayment(payAmount);
    if (!payment.ok || !payment.payload?.txDigest) {
      setMessage(`${payment.errorCode ?? "E_UNKNOWN"} // ${walletErrorMessage(payment.errorCode, payment.message)}`);
      return;
    }

    const result = actions.onPayEntry(team.teamId, authState.walletAddress, payment.payload.txDigest);
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${walletErrorMessage(result.errorCode, result.message)}`);
      return;
    }

    setMessage(
      `ENTRY PAID // TEAM=${team.name} // TX=${result.payload?.txDigest ?? payment.payload.txDigest} // WL=${result.payload?.whitelistCount ?? 0}`
    );
  };

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
            {paidTeams}/{maxTeams} teams ready
          </span>
        </div>

        <div className="relative mt-4 h-3 overflow-hidden rounded-sm bg-eve-grey/60">
          {minGateRatio > 0 && (
            <div
              className="absolute top-0 bottom-0 w-px bg-eve-yellow/90 z-10"
              style={{ left: `${minGateRatio * 100}%` }}
            />
          )}
          <div
            className="absolute left-0 top-0 h-full bg-eve-yellow/40 transition-all duration-300"
            style={{ width: `${registeredRatio * 100}%` }}
          />
          <div
            className="absolute left-0 top-0 h-full bg-eve-red transition-all duration-300"
            style={{ width: `${paidRatio * 100}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.12em]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 bg-eve-red" />
              <span className="text-eve-offwhite/70">Paid {paidTeams}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 bg-eve-yellow/40" />
              <span className="text-eve-offwhite/70">Registered {registeredTeams}</span>
            </span>
          </div>
          <span className="text-eve-yellow/80">Min {minTeams}</span>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
        <div className="space-y-4">
          <TacticalPanel title="Create Team" eyebrow="Captain">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Team Name</span>
                <input
                  value={teamName}
                  onChange={(event) => setTeamName(event.target.value)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Max Size (3-8)</span>
                <input
                  type="number"
                  min={3}
                  max={8}
                  value={teamSize}
                  onChange={(event) => setTeamSize(Math.max(3, Math.min(8, Number(event.target.value) || 3)))}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Captain Name</span>
                <input
                  value={captainName}
                  onChange={(event) => setCaptainName(event.target.value)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Captain Role</span>
                <select
                  value={captainRole}
                  onChange={(event) => setCaptainRole(event.target.value as TeamRole)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                >
                  {TEAM_ROLES.map((role) => (
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
                    value={collectorSlots}
                    onChange={(event) => setCollectorSlots(Math.max(0, Math.min(8, Number(event.target.value) || 0)))}
                    className="w-full border border-eve-yellow/40 bg-eve-black/80 px-2 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-eve-offwhite/70">Hauler Slots</span>
                  <input
                    type="number"
                    min={0}
                    max={8}
                    value={haulerSlots}
                    onChange={(event) => setHaulerSlots(Math.max(0, Math.min(8, Number(event.target.value) || 0)))}
                    className="w-full border border-eve-yellow/40 bg-eve-black/80 px-2 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-eve-offwhite/70">Escort Slots</span>
                  <input
                    type="number"
                    min={0}
                    max={8}
                    value={escortSlots}
                    onChange={(event) => setEscortSlots(Math.max(0, Math.min(8, Number(event.target.value) || 0)))}
                    className="w-full border border-eve-yellow/40 bg-eve-black/80 px-2 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                  />
                </label>
              </div>
              <p className="mt-2 text-xs text-eve-offwhite/75">
                SLOT TOTAL: {slotTotal} / TEAM SIZE {teamSize} (shortfall will auto-fill with captain role)
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <TacticalButton onClick={handleCreateTeam} disabled={!authState.isConnected}>
                Create Team
              </TacticalButton>
            </div>
          </TacticalPanel>

          <TacticalPanel title="Join Settings" eyebrow="Member">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Pilot Name</span>
                <input
                  value={joinName}
                  onChange={(event) => setJoinName(event.target.value)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Default Join Role</span>
                <select
                  value={defaultJoinRole}
                  onChange={(event) => setDefaultJoinRole(event.target.value as TeamRole)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                >
                  {TEAM_ROLES.map((role) => (
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
                const captainMatch = isCaptain(team, authState.walletAddress);
                const selected = team.teamId === activeTeamId;
                const showJoinAction = !captainMatch && team.status === "forming";
                const joinDisabled = !authState.isConnected;
                const lockBlockers = lockBlockersForTeam(team);
                const payBlockers = payBlockersForTeam(team);
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
                        <p className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">{teamStatusTag(team)}</p>
                      </div>
                    </div>

                    <div className="mt-2 grid gap-1 text-xs text-eve-offwhite/80 md:grid-cols-2">
                      <p>TEAM: {team.players.length} / {team.maxSize ?? 8}</p>
                      <p>ROLE GAPS: {openRolesText(team, selectors.teamSlots)}</p>
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
                      <TacticalButton tone="ghost" onClick={() => setActiveTeamId(team.teamId)}>
                        View
                      </TacticalButton>

                      {showJoinAction ? (
                        <>
                          <select
                            value={joinRoleByTeam[team.teamId] ?? defaultJoinRole}
                            onChange={(event) =>
                              setJoinRoleByTeam((current) => ({
                                ...current,
                                [team.teamId]: event.target.value as TeamRole
                              }))
                            }
                            className="border border-eve-yellow/50 bg-eve-black/80 px-2 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                          >
                            {TEAM_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          <TacticalButton onClick={() => handleJoinTeam(team.teamId)} disabled={joinDisabled}>
                            Join
                          </TacticalButton>
                        </>
                      ) : null}

                      {captainMatch ? (
                        <>
                          <TacticalButton tone="ghost" onClick={() => handleLockTeam(team)} disabled={lockBlockers.length > 0}>
                            Lock
                          </TacticalButton>
                          <TacticalButton onClick={() => handlePayEntry(team)} disabled={payBlockers.length > 0}>
                            Join & Pay
                          </TacticalButton>
                        </>
                      ) : null}
                    </div>

                    {captainMatch ? (
                      <p className="mt-2 text-xs text-eve-offwhite/70">ENTRY TOTAL: {payAmount} LUX</p>
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

      {paidTeams >= minTeams ? (
        <Link
          href="/match"
          className="inline-flex border border-eve-yellow bg-eve-yellow px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-eve-black transition hover:bg-eve-offwhite"
        >
          Enter Match
        </Link>
      ) : null}

      <p className="border border-eve-yellow/35 bg-eve-black/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-eve-offwhite">
        {message}
      </p>
    </MatchShell>
  );
}
