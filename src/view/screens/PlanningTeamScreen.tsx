"use client";

import { usePlanningTeamScreenController } from "@/controller/usePlanningTeamScreenController";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

function shortAddress(value: string) {
  if (value.length <= 14) {
    return value;
  }

  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function teamFillPercent(memberCount: number, maxMembers: number) {
  if (maxMembers <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((memberCount / maxMembers) * 100)));
}

function unitCode(teamName: string, teamId: string) {
  const letters = teamName
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 3))
    .join("-");

  return letters || teamId.slice(0, 6).toUpperCase();
}

function squadState(memberCount: number, maxMembers: number) {
  if (memberCount >= maxMembers) {
    return "FULL";
  }
  if (memberCount === maxMembers - 1) {
    return "ALMOST READY";
  }
  return "RECRUITING";
}

function vacancyMessage(openRoles: Array<"collector" | "hauler" | "escort">) {
  if (openRoles.length === 0) {
    return "NO VACANCY";
  }

  if (openRoles.length === 1) {
    return `NEEDS ${openRoles[0].toUpperCase()}`;
  }

  return `${openRoles.length} OPEN ROLES`;
}

function roleTone(role: "collector" | "hauler" | "escort") {
  if (role === "collector") {
    return {
      frame: "border-eve-yellow/35 bg-eve-yellow/10 text-eve-yellow",
      soft: "border-eve-yellow/15 bg-[#1b1606] text-eve-offwhite",
      meter: "from-eve-yellow to-[#f0d372]"
    };
  }

  if (role === "hauler") {
    return {
      frame: "border-eve-offwhite/30 bg-eve-offwhite/10 text-eve-offwhite",
      soft: "border-eve-offwhite/15 bg-[#141414] text-eve-offwhite",
      meter: "from-eve-offwhite to-[#ffffff]"
    };
  }

  return {
    frame: "border-eve-red/35 bg-eve-red/10 text-eve-red",
    soft: "border-eve-red/15 bg-[#1b0906] text-eve-offwhite",
    meter: "from-eve-red to-[#ff8c68]"
  };
}

function roleCode(role: "collector" | "hauler" | "escort") {
  if (role === "collector") return "COL";
  if (role === "hauler") return "HAU";
  return "ESC";
}

function joinLabel(input: {
  hasJoinCapacity: boolean;
  canJoin: boolean;
  isConnected: boolean;
  currentPlayerTeamId: string | null;
  currentPendingApplicationTeamId: string | null;
  teamId: string;
  selectedRole: "collector" | "hauler" | "escort";
}) {
  if (!input.hasJoinCapacity) {
    return "No Open Slots";
  }
  if (!input.isConnected) {
    return "Connect Wallet To Join";
  }
  if (input.currentPlayerTeamId) {
    return "Already In A Team";
  }
  if (input.currentPendingApplicationTeamId === input.teamId) {
    return "Application Pending";
  }
  if (input.currentPendingApplicationTeamId) {
    return "Pending In Another Team";
  }
  if (!input.canJoin) {
    return "Join Locked";
  }
  return `Request Join As ${input.selectedRole.charAt(0).toUpperCase()}${input.selectedRole.slice(1)}`;
}

export function PlanningTeamScreen() {
  const controller = usePlanningTeamScreenController();
  const { state, authState, ui, helpers, actions } = controller;

  return (
    <FuelMissionShell
      title="TEAM REGISTRY / OPEN FORMATION"
      subtitle="Browse every registered team, join an open slot, or create a fresh formation."
      activeRoute="/planning"
      phase="lobby"
      countdownSec={0}
      staleSnapshot={false}
      bannerMessage={state.error ?? undefined}
      bannerTone="error"
    >
      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <TacticalPanel title="Current Team Count" eyebrow="Registry">
          <div className="space-y-4">
            <div className="border border-eve-yellow/25 bg-black/30 px-4 py-5">
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-eve-offwhite/62">
                Registered Teams
              </p>
              <p className="mt-3 font-mono text-6xl font-black uppercase tracking-[-0.08em] text-eve-yellow">
                {state.totalTeams}
              </p>
            </div>

            <div className="grid gap-2 text-xs uppercase tracking-[0.12em] text-eve-offwhite/75 md:grid-cols-2">
              <p>WALLET READY: {authState.isConnected ? "YES" : "NO"}</p>
              <p>CREATE ACCESS: {ui.canOpenCreateModal ? "ONLINE" : "LOCKED"}</p>
            </div>

            <p className="border border-eve-red/15 bg-black/20 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/70">
              {state.totalTeams === 0
                ? "NO TEAMS REGISTERED YET // CREATE THE FIRST TEAM PROFILE"
                : "TEAM BOARD IS LIVE // JOIN HERE BEFORE ENTERING A MATCH"}
            </p>

            {ui.currentPlayerTeamId ? (
              <p className="border border-eve-yellow/25 bg-eve-yellow/10 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/82">
                YOU ALREADY BELONG TO A REGISTERED TEAM // USE THE TEAM CARD TO LEAVE OR MANAGE IT
              </p>
            ) : null}
            {ui.currentPendingApplicationTeamId ? (
              <p className="border border-eve-yellow/25 bg-eve-yellow/10 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/82">
                YOU HAVE A PENDING JOIN REQUEST // WAIT FOR CAPTAIN REVIEW BEFORE APPLYING ELSEWHERE
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <TacticalButton
                onClick={actions.openCreateTeamModal}
                disabled={!ui.canOpenCreateModal || state.isMutating}
              >
                Open Create Team
              </TacticalButton>
            </div>

            {!ui.canOpenCreateModal ? (
              <p className="border border-eve-red/20 bg-black/20 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/72">
                {authState.isConnected
                  ? ui.currentPendingApplicationTeamId
                    ? "YOU ALREADY HAVE A PENDING APPLICATION // CREATE IS LOCKED"
                    : "YOU ARE ALREADY IN A REGISTERED TEAM // CREATE IS LOCKED"
                  : "CONNECT A WALLET BEFORE REGISTERING A TEAM."}
              </p>
            ) : null}
          </div>
        </TacticalPanel>

        <TacticalPanel title="Team Board" eyebrow="Join Or Create">
          <div className="space-y-4">
            {state.teams.length === 0 ? (
              <p className="border border-eve-red/20 bg-black/20 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/72">
                NO REGISTERED TEAMS YET.
              </p>
            ) : null}

            {state.teams.map((team) => {
              const openRoles = helpers.getOpenRoles(team.id);
              const isMember = helpers.isMember(team.id);
              const isCaptain = helpers.isCaptain(team.id);
              const pendingApplication = helpers.getPendingApplication(team.id);
              const pendingApplicationsForCaptain = helpers.getPendingApplicationsForCaptain(team.id);
              const fillPercent = teamFillPercent(team.memberCount, team.maxMembers);
              const selectedRole = ui.joinRoleByTeam[team.id] ?? openRoles[0] ?? "hauler";
              const code = unitCode(team.name, team.id);
              const stateLabel = squadState(team.memberCount, team.maxMembers);
              const hasJoinCapacity = openRoles.length > 0 && team.memberCount < team.maxMembers;
              const canJoin =
                authState.isConnected &&
                !ui.currentPlayerTeamId &&
                !ui.currentPendingApplicationTeamId &&
                hasJoinCapacity;
              const joinButtonLabel = joinLabel({
                hasJoinCapacity,
                canJoin,
                isConnected: authState.isConnected,
                currentPlayerTeamId: ui.currentPlayerTeamId,
                currentPendingApplicationTeamId: ui.currentPendingApplicationTeamId,
                teamId: team.id,
                selectedRole
              });

              return (
                <article
                  key={team.id}
                  className="relative overflow-hidden border border-eve-yellow/25 bg-[linear-gradient(180deg,rgba(18,18,18,0.96)_0%,rgba(8,8,8,0.99)_100%)] px-4 py-4 shadow-[0_0_0_1px_rgba(229,179,43,0.06),0_22px_40px_rgba(0,0,0,0.34)]"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-eve-yellow/80 to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[linear-gradient(180deg,rgba(229,179,43,0.06)_0%,transparent_70%)]" />

                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-eve-yellow/15 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="border border-eve-yellow/40 bg-eve-yellow/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-eve-yellow">
                        UNIT {code}
                      </span>
                      <span
                        className={`border px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
                          hasJoinCapacity
                            ? "border-eve-yellow/35 bg-eve-yellow/10 text-eve-yellow"
                            : team.memberCount >= team.maxMembers
                              ? "border-eve-red/35 bg-eve-red/10 text-eve-red"
                              : "border-eve-offwhite/20 bg-black/30 text-eve-offwhite/70"
                        }`}
                      >
                        {stateLabel}
                      </span>
                      <span className="border border-eve-offwhite/15 bg-black/30 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-eve-offwhite/68">
                        {vacancyMessage(openRoles)}
                      </span>
                    </div>

                    <div className="flex h-7 items-center border border-eve-red/20 bg-black/30 px-3 text-[10px] font-black uppercase tracking-[0.22em] text-eve-offwhite/58">
                      Squad Registry
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isMember ? (
                          <span className="border border-eve-yellow/45 bg-eve-yellow/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-eve-yellow">
                            {isCaptain ? "Your Team // Captain" : "Your Team"}
                          </span>
                        ) : null}
                        <span className="border border-eve-offwhite/15 bg-black/30 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-eve-offwhite/72">
                          Open Seats
                        </span>
                      </div>

                      <div className="mt-3 space-y-3">
                        <div className="min-w-0 border border-eve-yellow/15 bg-black/25 px-3 py-3">
                          <p className="font-mono text-lg font-black uppercase tracking-[0.08em] text-eve-offwhite">{team.name}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">
                            Captain // {shortAddress(team.captainAddress)}
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="overflow-hidden border border-eve-yellow/30 bg-[radial-gradient(circle_at_top,rgba(229,179,43,0.14),transparent_55%),#080808] px-3 py-3">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-eve-offwhite/48">Roster</p>
                            <p className="mt-2 text-xl font-black uppercase tracking-[-0.04em] text-eve-yellow">
                              {team.memberCount}/{team.maxMembers}
                            </p>
                          </div>
                          <div className="overflow-hidden border border-eve-yellow/15 bg-black/25 px-3 py-3">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-eve-offwhite/48">Open</p>
                            <p className="mt-2 text-xl font-black uppercase tracking-[-0.04em] text-eve-offwhite">
                              {Math.max(0, team.maxMembers - team.memberCount)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border border-eve-yellow/15 bg-black/30 px-3 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-eve-offwhite/48">Occupancy</p>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">{fillPercent}% filled</p>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden border border-eve-yellow/20 bg-black/40">
                          <div
                            className="h-full bg-gradient-to-r from-eve-red via-eve-yellow to-[#f1d27a]"
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                    <div className="space-y-3">
                      <div className="border border-eve-red/10 bg-black/20 px-3 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red/90">Role Slots</p>
                        <div className="mt-3 grid gap-2 md:grid-cols-3 xl:grid-cols-1">
                          {ui.roleOrder.map((role) => {
                            const filled = helpers.getRoleCount(team.id, role);
                            const total = team.roleSlots[role];
                            const open = Math.max(0, total - filled);
                            const tone = roleTone(role);

                            return (
                              <div key={`${team.id}-${role}`} className={`border px-3 py-3 ${tone.soft}`}>
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className={`border px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${tone.frame}`}>
                                      {roleCode(role)}
                                    </span>
                                    <p className="text-xs font-black uppercase tracking-[0.12em] text-eve-offwhite">
                                      {helpers.roleLabel(role)}
                                    </p>
                                  </div>
                                  <p className="text-[10px] uppercase tracking-[0.18em] text-eve-offwhite/58">
                                    {filled}/{total}
                                  </p>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden border border-eve-yellow/20 bg-black/40">
                                  <div
                                    className={`h-full bg-gradient-to-r ${tone.meter}`}
                                    style={{ width: total > 0 ? `${Math.max(0, Math.min(100, Math.round((filled / total) * 100)))}%` : "0%" }}
                                  />
                                </div>
                                <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/58">
                                  {open > 0 ? `${open} open ${helpers.roleLabel(role)} slot` : "Role filled"}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="border border-eve-red/10 bg-black/20 px-3 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red/90">Open Roles</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {openRoles.length > 0 ? (
                            openRoles.map((role) => (
                              <span
                                key={`${team.id}-open-${role}`}
                                className="border border-eve-yellow/35 bg-eve-yellow/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-eve-yellow"
                              >
                                OPEN // {helpers.roleLabel(role)}
                              </span>
                            ))
                          ) : (
                            <span className="border border-eve-red/25 bg-eve-red/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-eve-red">
                              No open role slots
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="border border-eve-red/15 bg-[linear-gradient(180deg,rgba(204,51,0,0.1)_0%,rgba(8,8,8,0.94)_100%)] px-3 py-3 shadow-[0_0_0_1px_rgba(204,51,0,0.08)]">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red/90">Join Console</p>
                          {pendingApplication ? (
                            <span className="border border-eve-yellow/35 bg-eve-yellow/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-eve-yellow">
                              Pending
                            </span>
                          ) : hasJoinCapacity ? (
                            <span className="border border-eve-yellow/35 bg-eve-yellow/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-eve-yellow">
                              Join Open
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-3 space-y-3">
                          <div className="border border-eve-yellow/15 bg-black/30 px-3 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-eve-offwhite/72">
                            {pendingApplication
                              ? "JOIN REQUEST ALREADY PENDING // WAIT FOR CAPTAIN REVIEW."
                              : hasJoinCapacity
                              ? canJoin
                                ? "SELECT YOUR ROLE, THEN SEND A JOIN REQUEST TO THE CAPTAIN."
                                : !authState.isConnected
                                  ? "CONNECT WALLET, THEN JOIN THIS SQUAD."
                                  : ui.currentPendingApplicationTeamId
                                    ? "YOU ALREADY HAVE A PENDING REQUEST."
                                    : "YOU ALREADY BELONG TO ANOTHER TEAM."
                              : "THIS TEAM HAS NO OPEN ROLE SLOTS."}
                          </div>
                          {hasJoinCapacity ? (
                            <div className="grid gap-2 sm:grid-cols-3">
                              {openRoles.map((role) => {
                                const tone = roleTone(role);
                                const selected = selectedRole === role;

                                return (
                                  <button
                                    key={`${team.id}-${role}`}
                                    type="button"
                                    onClick={() => {
                                      if (!canJoin) {
                                        return;
                                      }
                                      actions.setJoinRole(team.id, role);
                                    }}
                                    disabled={!canJoin}
                                    className={`border px-3 py-3 text-left transition ${
                                      selected
                                        ? `${tone.frame} shadow-[0_0_0_1px_rgba(229,179,43,0.14)]`
                                        : `${tone.soft} hover:border-eve-yellow/30 hover:text-eve-offwhite`
                                    } ${!canJoin ? "opacity-60" : ""}`}
                                  >
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em]">
                                      {roleCode(role)}
                                    </p>
                                    <p className="mt-2 text-xs font-black uppercase tracking-[0.12em]">
                                      {helpers.roleLabel(role)}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>
                          ) : null}
                          <TacticalButton
                            fullWidth
                            onClick={() => void actions.handleJoinTeam(team.id)}
                            disabled={state.isMutating || !canJoin || Boolean(pendingApplication)}
                            className="py-3 text-sm tracking-[0.2em] shadow-[0_0_18px_rgba(229,179,43,0.18)] border-b-4 border-r-4 border-black"
                          >
                            {joinButtonLabel}
                          </TacticalButton>

                          {isCaptain && pendingApplicationsForCaptain.length > 0 ? (
                            <div className="space-y-2 border border-eve-yellow/15 bg-black/25 px-3 py-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-yellow">Pending Applications</p>
                              {pendingApplicationsForCaptain.map((application) => (
                                <div
                                  key={application.id}
                                  className="border border-eve-yellow/15 bg-black/40 px-3 py-3"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/75">
                                      {shortAddress(application.applicantWalletAddress)} // {helpers.roleLabel(application.role)}
                                    </p>
                                    <span className="border border-eve-yellow/35 bg-eve-yellow/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-eve-yellow">
                                      Pending
                                    </span>
                                  </div>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <TacticalButton
                                      onClick={() => void actions.handleApproveApplication(team.id, application.id)}
                                      disabled={state.isMutating}
                                    >
                                      Approve
                                    </TacticalButton>
                                    <TacticalButton
                                      tone="ghost"
                                      onClick={() => void actions.handleRejectApplication(team.id, application.id)}
                                      disabled={state.isMutating}
                                    >
                                      Reject
                                    </TacticalButton>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {isMember && !isCaptain ? (
                            <TacticalButton
                              tone="ghost"
                              fullWidth
                              onClick={() => void actions.handleLeaveTeam(team.id)}
                              disabled={state.isMutating}
                            >
                              Leave Team
                            </TacticalButton>
                          ) : null}

                          {isCaptain ? (
                            <TacticalButton
                              tone="ghost"
                              fullWidth
                              onClick={() => void actions.handleDisbandTeam(team.id)}
                              disabled={state.isMutating}
                            >
                              Disband Team
                            </TacticalButton>
                          ) : null}
                        </div>
                      </div>

                      <div className="border border-eve-yellow/15 bg-black/20 px-3 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red/90">Crew Roster</p>
                        <div className="mt-3 grid gap-2">
                          {team.members.map((member) => {
                            const tone = roleTone(member.role);

                            return (
                              <div
                                key={`${team.id}-${member.walletAddress}`}
                                className="flex items-center justify-between gap-3 border border-eve-yellow/15 bg-[#080808]/85 px-3 py-3"
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  <span className={`border px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${tone.frame}`}>
                                    {roleCode(member.role)}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-xs font-black uppercase tracking-[0.12em] text-eve-offwhite">
                                      {helpers.roleLabel(member.role)}
                                    </p>
                                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/58">
                                      {shortAddress(member.walletAddress)}
                                    </p>
                                  </div>
                                </div>
                                {member.walletAddress === team.captainAddress ? (
                                  <span className="border border-eve-red/35 bg-eve-red/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-eve-red">
                                    Captain
                                  </span>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </TacticalPanel>
      </section>

      <p className="border border-eve-yellow/35 bg-eve-black/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-eve-offwhite">
        {state.isLoading
          ? "LOADING TEAM REGISTRY..."
          : state.isMutating
            ? "TEAM REGISTRATION IN FLIGHT..."
            : ui.message}
      </p>

      {ui.isCreateTeamModalOpen ? (
        <div
          className="fixed inset-0 z-[72] flex items-center justify-center bg-black/72 px-4 backdrop-blur-sm"
          onClick={actions.closeCreateTeamModal}
        >
          <div
            className="w-full max-w-2xl border border-eve-yellow/35 bg-[linear-gradient(180deg,rgba(26,26,26,0.98)_0%,rgba(8,8,8,0.98)_100%)] p-5 shadow-[0_0_0_1px_rgba(229,179,43,0.12),0_24px_80px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-eve-red/90">Captain</p>
                <h2 className="mt-1 text-sm font-black uppercase tracking-[0.18em] text-eve-offwhite">
                  Create Team
                </h2>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-eve-offwhite/70">
                  Create a reusable team profile.
                </p>
              </div>
              <TacticalButton tone="ghost" onClick={actions.closeCreateTeamModal}>
                Close
              </TacticalButton>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">
                  Team Name
                </span>
                <input
                  value={ui.teamName}
                  onChange={(event) => actions.setTeamName(event.target.value)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">
                  Max Members
                </span>
                <input
                  type="number"
                  min={3}
                  max={8}
                  value={ui.maxMembers}
                  onChange={(event) => actions.setMaxMembers(Number(event.target.value))}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">
                  Collector
                </span>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={ui.collectorSlots}
                  onChange={(event) => actions.setCollectorSlots(Number(event.target.value))}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">
                  Hauler
                </span>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={ui.haulerSlots}
                  onChange={(event) => actions.setHaulerSlots(Number(event.target.value))}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">
                  Escort
                </span>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={ui.escortSlots}
                  onChange={(event) => actions.setEscortSlots(Number(event.target.value))}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>
            </div>

            <div className="mt-4 border border-eve-red/20 bg-black/20 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/75">
              SLOT TOTAL MUST MATCH MAX MEMBERS // {ui.slotTotal} / {ui.maxMembers}
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <TacticalButton tone="ghost" onClick={actions.closeCreateTeamModal}>
                Cancel
              </TacticalButton>
              <TacticalButton onClick={() => void actions.handleCreateTeam()} disabled={!ui.canCreate || state.isMutating}>
                Create Team
              </TacticalButton>
            </div>
          </div>
        </div>
      ) : null}
    </FuelMissionShell>
  );
}
