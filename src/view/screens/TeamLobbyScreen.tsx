"use client";

import { useTeamLobbyScreenController } from "@/controller/useTeamLobbyScreenController";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";
import type { PlayerRole } from "@/types/team";

const ROLE_ORDER: PlayerRole[] = ["collector", "hauler", "escort"];

interface TeamLobbyScreenProps {
  preferredMatchId?: string | null;
}

export function TeamLobbyScreen({ preferredMatchId = null }: TeamLobbyScreenProps) {
  const controller = useTeamLobbyScreenController(preferredMatchId);
  const { state, authState, ui, helpers, actions } = controller;

  return (
    <FuelMissionShell
      title="TEAM LOBBY / APPROVAL CHAIN"
      subtitle="Create a squad, review pending join applications, lock the formation, then submit one captain payment."
      activeRoute="/planning"
      phase="lobby"
      countdownSec={0}
      roomId={state.matchId ?? undefined}
      staleSnapshot={false}
      bannerMessage={state.error ?? undefined}
      bannerTone="error"
    >
      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <TacticalPanel title="Match Snapshot" eyebrow="Context">
            {state.match ? (
              <div className="grid gap-2 text-xs uppercase tracking-[0.12em] text-eve-offwhite/78 md:grid-cols-2">
                <p>MATCH: {state.match.id}</p>
                <p>STATUS: {state.match.status}</p>
                <p>ENTRY FEE: {state.match.entryFee} LUX</p>
                <p>PRIZE POOL: {state.match.prizePool} LUX</p>
                <p>REGISTERED TEAMS: {state.teams.length}</p>
                <p>MAX TEAMS: {state.match.maxTeams}</p>
              </div>
            ) : (
              <p className="text-xs uppercase tracking-[0.12em] text-eve-offwhite/60">
                {state.isLoading ? "LOADING MATCH..." : "NO MATCH AVAILABLE"}
              </p>
            )}
          </TacticalPanel>

          <TacticalPanel title="Create Team" eyebrow="Captain">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.12em] text-eve-offwhite/72">
                Open a dedicated creation modal instead of editing squad configuration directly in the lobby stream.
              </p>
              <div className="grid gap-2 text-xs uppercase tracking-[0.12em] text-eve-offwhite/75 md:grid-cols-3">
                <p>MATCH READY: {state.matchId ? "YES" : "NO"}</p>
                <p>WALLET READY: {authState.isConnected ? "YES" : "NO"}</p>
                <p>OPEN SLOTS: {Math.max(0, (state.match?.maxTeams ?? 0) - state.teams.length)}</p>
              </div>
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
                  CONNECT A WALLET AND LOAD A MATCH BEFORE CREATING A SQUAD.
                </p>
              ) : null}
            </div>
          </TacticalPanel>
        </div>

        <div className="space-y-4">
          <TacticalPanel title="Team Board" eyebrow="Operations">
            <div className="space-y-3">
              {state.teams.length === 0 ? (
                <p className="border border-eve-red/60 bg-eve-red/15 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/82">
                  NO TEAMS REGISTERED
                </p>
              ) : null}

              {state.teams.map((team) => {
                const teamUi = helpers.getTeamUiState(team);
                const captain = teamUi.captain;
                const myPending = teamUi.myPending;
                const applications = teamUi.applications;

                return (
                  <article key={team.id} className="border border-eve-yellow/25 bg-eve-black/70 px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-sm uppercase tracking-[0.12em] text-eve-offwhite">{team.name}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/60">
                          CAPTAIN: {team.captainAddress}
                        </p>
                      </div>
                      <span className="font-mono text-xs uppercase tracking-[0.14em] text-eve-yellow">
                        {helpers.teamStatusLabel(team)}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-xs uppercase tracking-[0.12em] text-eve-offwhite/75 md:grid-cols-3">
                      <p>MEMBERS: {team.memberCount}/{team.maxSize}</p>
                      <p>PAYMENT: {team.paymentAmount} LUX</p>
                      <p>WL: {team.whitelistCount}</p>
                    </div>

                    <div className="mt-3 grid gap-2 border border-eve-red/10 bg-black/20 px-3 py-3 text-xs text-eve-offwhite/78">
                      {ROLE_ORDER.map((role) => (
                        <p key={`${team.id}-${role}`}>
                          {helpers.roleLabel(role)}: {team.members.filter((member) => member.role === role).length}/{team.roleSlots[role]}
                        </p>
                      ))}
                    </div>

                    <div className="mt-3 grid gap-2 border border-eve-yellow/15 bg-black/20 px-3 py-3 text-xs text-eve-offwhite/78">
                      {team.members.map((member) => (
                        <p key={member.id}>
                          {helpers.roleLabel(member.role)} // {member.walletAddress} // {member.slotStatus}
                        </p>
                      ))}
                    </div>

                    {applications.length > 0 ? (
                      <div className="mt-3 space-y-2 border border-eve-red/20 bg-eve-red/5 px-3 py-3">
                        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-eve-red">Pending Applications</p>
                        {applications.map((application) => (
                          <div key={application.applicationId} className="border border-eve-red/20 bg-black/20 px-3 py-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-eve-offwhite/78">
                              {application.applicantAddress} // {helpers.roleLabel(application.role)}
                            </p>
                            {captain ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                <input
                                  value={helpers.getRejectReason(application.applicationId)}
                                  onChange={(event) => actions.setRejectReason(application.applicationId, event.target.value)}
                                  placeholder="Reject reason (optional)"
                                  className="min-w-[14rem] flex-1 border border-eve-yellow/40 bg-eve-black/80 px-3 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                                />
                                <TacticalButton
                                  tone="ghost"
                                  onClick={() => void actions.handleApprove(team.id, application.applicationId)}
                                  disabled={state.isMutating}
                                >
                                  Approve
                                </TacticalButton>
                                <TacticalButton
                                  tone="danger"
                                  onClick={() => void actions.handleReject(team.id, application.applicationId)}
                                  disabled={state.isMutating}
                                >
                                  Reject
                                </TacticalButton>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {myPending ? (
                      <p className="mt-3 border border-eve-yellow/35 bg-eve-yellow/10 px-3 py-2 text-xs uppercase tracking-[0.12em] text-eve-offwhite/82">
                        APPLICATION PENDING // {helpers.roleLabel(myPending.role)}
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {teamUi.canApply ? (
                        <>
                          <select
                            value={teamUi.selectedJoinRole}
                            onChange={(event) => actions.setJoinRole(team.id, event.target.value as PlayerRole)}
                            className="border border-eve-yellow/50 bg-eve-black/80 px-2 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                          >
                            {ROLE_ORDER.map((role) => (
                              <option key={`${team.id}-${role}`} value={role}>
                                {helpers.roleLabel(role)}
                              </option>
                            ))}
                          </select>
                          <TacticalButton onClick={() => void actions.handleJoinTeam(team.id)} disabled={state.isMutating}>
                            Apply Join
                          </TacticalButton>
                        </>
                      ) : null}

                      {teamUi.isCurrentPlayerTeam && team.status === "forming" ? (
                        <TacticalButton tone="ghost" onClick={() => void actions.handleLeave(team.id)} disabled={state.isMutating}>
                          Leave
                        </TacticalButton>
                      ) : null}

                      {captain ? (
                        <>
                          <TacticalButton tone="ghost" onClick={() => void actions.handleLock(team.id)} disabled={state.isMutating}>
                            Lock Team
                          </TacticalButton>
                          <TacticalButton
                            onClick={() => void actions.handlePay(team)}
                            disabled={state.isMutating || team.status !== "locked"}
                          >
                            Captain Pay
                          </TacticalButton>
                        </>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </TacticalPanel>
        </div>
      </section>

      <p className="border border-eve-yellow/35 bg-eve-black/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-eve-offwhite">
        {state.isLoading
          ? "LOADING TEAM LOBBY..."
          : state.isMutating
            ? "TEAM LOBBY MUTATION IN FLIGHT..."
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
                <h2 className="mt-1 text-sm font-black uppercase tracking-[0.18em] text-eve-offwhite">Create Team</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-eve-offwhite/70">
                  Configure squad size and role slots, then submit a fresh team into the current match lobby.
                </p>
              </div>
              <TacticalButton tone="ghost" onClick={actions.closeCreateTeamModal}>
                Close
              </TacticalButton>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Team Name</span>
                <input
                  value={ui.teamName}
                  onChange={(event) => actions.setTeamName(event.target.value)}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Max Members</span>
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
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Collector</span>
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
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Hauler</span>
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
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Escort</span>
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

            <div className="mt-4 grid gap-2 border border-eve-red/20 bg-black/20 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/75 md:grid-cols-3">
              <p>SLOT TOTAL: {ui.slotTotal} / {ui.maxMembers}</p>
              <p>MATCH: {state.matchId ?? "UNAVAILABLE"}</p>
              <p>CAPTAIN: {authState.walletAddress ?? "NOT CONNECTED"}</p>
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
