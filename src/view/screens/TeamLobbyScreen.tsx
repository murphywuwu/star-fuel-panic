"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthController, walletErrorMessage } from "@/controller/useAuthController";
import { useTeamLobbyController } from "@/controller/useTeamLobbyController";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";
import type { PlayerRole, TeamApplication, TeamDetail } from "@/types/team";

const ROLE_ORDER: PlayerRole[] = ["collector", "hauler", "escort"];

function roleLabel(role: PlayerRole) {
  if (role === "collector") return "Collector";
  if (role === "hauler") return "Hauler";
  return "Escort";
}

function teamStatusLabel(team: TeamDetail) {
  if (team.status === "paid") return "PAID";
  if (team.status === "locked") return "LOCKED";
  return "FORMING";
}

function isCaptain(team: TeamDetail, walletAddress: string | null) {
  if (!walletAddress) {
    return false;
  }
  return team.captainAddress.trim().toLowerCase() === walletAddress.trim().toLowerCase();
}

function pendingApplications(team: TeamDetail) {
  return team.applications.filter((application) => application.status === "pending");
}

function findMyPendingApplication(team: TeamDetail, walletAddress: string | null) {
  if (!walletAddress) {
    return null;
  }

  const normalized = walletAddress.trim().toLowerCase();
  return (
    team.applications.find(
      (application) =>
        application.status === "pending" &&
        application.applicantAddress.trim().toLowerCase() === normalized
    ) ?? null
  );
}

function roleSlotTotal(counts: { collector: number; hauler: number; escort: number }) {
  return counts.collector + counts.hauler + counts.escort;
}

export function TeamLobbyScreen() {
  const searchParams = useSearchParams();
  const preferredMatchId = searchParams.get("matchId");
  const { state, selectors, actions } = useTeamLobbyController();
  const { state: authState, actions: authActions } = useAuthController();
  const currentWalletAddress = authState.walletAddress;

  const [teamName, setTeamName] = useState("Alpha Squad");
  const [maxMembers, setMaxMembers] = useState(3);
  const [collectorSlots, setCollectorSlots] = useState(1);
  const [haulerSlots, setHaulerSlots] = useState(1);
  const [escortSlots, setEscortSlots] = useState(1);
  const [joinRoleByTeam, setJoinRoleByTeam] = useState<Record<string, PlayerRole>>({});
  const [rejectReasonByApplication, setRejectReasonByApplication] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("TEAM LOBBY ONLINE // LOAD A MATCH AND FORM A SQUAD");

  useEffect(() => {
    void actions.load(preferredMatchId).then((result) => {
      if (!result.ok) {
        setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      }
    });
  }, [actions, preferredMatchId]);

  const slotCounts = {
    collector: collectorSlots,
    hauler: haulerSlots,
    escort: escortSlots
  };
  const slotTotal = roleSlotTotal(slotCounts);
  const canCreate = authState.isConnected && slotTotal === maxMembers && teamName.trim().length > 0;

  const handleCreateTeam = async () => {
    const result = await actions.createTeam({
      matchId: state.matchId ?? "",
      name: teamName.trim(),
      maxMembers,
      roleSlots: slotCounts,
      walletAddress: authState.walletAddress ?? ""
    });

    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`TEAM CREATED // ${teamName.trim()}`);
  };

  const handleJoinTeam = async (teamId: string) => {
    const result = await actions.joinTeam(teamId, {
      role: joinRoleByTeam[teamId] ?? "hauler",
      walletAddress: authState.walletAddress ?? ""
    });
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`APPLICATION SENT // ${result.payload?.applicationId ?? "PENDING"}`);
  };

  const handleApprove = async (teamId: string, applicationId: string) => {
    const result = await actions.approveJoinApplication(teamId, applicationId, authState.walletAddress ?? "");
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`APPLICATION APPROVED // ${applicationId}`);
  };

  const handleReject = async (teamId: string, applicationId: string) => {
    const result = await actions.rejectJoinApplication(teamId, applicationId, {
      walletAddress: authState.walletAddress ?? "",
      reason: rejectReasonByApplication[applicationId]?.trim() || undefined
    });
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`APPLICATION REJECTED // ${applicationId}`);
  };

  const handleLeave = async (teamId: string) => {
    const result = await actions.leaveTeam(teamId, authState.walletAddress ?? "");
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`LEFT TEAM // ${teamId}`);
  };

  const handleLock = async (teamId: string) => {
    const result = await actions.lockTeam(teamId, authState.walletAddress ?? "");
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`TEAM LOCKED // ${teamId}`);
  };

  const handlePay = async (team: TeamDetail) => {
    const amount = selectors.paymentAmount(team.id);
    const payment = await authActions.onExecuteEntryPayment(amount);
    if (!payment.ok || !payment.payload?.txDigest) {
      setMessage(`${payment.errorCode ?? "UNKNOWN"} // ${walletErrorMessage(payment.errorCode, payment.message)}`);
      return;
    }

    const result = await actions.payTeam(team.id, {
      walletAddress: authState.walletAddress ?? "",
      txDigest: payment.payload.txDigest
    });
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`TEAM PAID // ${team.name} // ${payment.payload.txDigest}`);
  };

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
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Max Members</span>
                <input
                  type="number"
                  min={3}
                  max={8}
                  value={maxMembers}
                  onChange={(event) => setMaxMembers(Math.max(3, Math.min(8, Number(event.target.value) || 3)))}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Collector</span>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={collectorSlots}
                  onChange={(event) => setCollectorSlots(Math.max(0, Math.min(8, Number(event.target.value) || 0)))}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Hauler</span>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={haulerSlots}
                  onChange={(event) => setHaulerSlots(Math.max(0, Math.min(8, Number(event.target.value) || 0)))}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Escort</span>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={escortSlots}
                  onChange={(event) => setEscortSlots(Math.max(0, Math.min(8, Number(event.target.value) || 0)))}
                  className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
                />
              </label>
            </div>

            <div className="mt-3 border border-eve-red/20 bg-black/20 px-3 py-3 text-xs uppercase tracking-[0.12em] text-eve-offwhite/75">
              SLOT TOTAL: {slotTotal} / {maxMembers}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <TacticalButton onClick={handleCreateTeam} disabled={!canCreate || state.isMutating}>
                Create Team
              </TacticalButton>
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
                const captain = isCaptain(team, currentWalletAddress);
                const myPending = findMyPendingApplication(team, currentWalletAddress);
                const canApply =
                  authState.isConnected &&
                  !captain &&
                  !selectors.currentPlayerTeam(currentWalletAddress) &&
                  !myPending &&
                  team.status === "forming";
                const applications = pendingApplications(team);

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
                        {teamStatusLabel(team)}
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
                          {roleLabel(role)}: {team.members.filter((member) => member.role === role).length}/{team.roleSlots[role]}
                        </p>
                      ))}
                    </div>

                    <div className="mt-3 grid gap-2 border border-eve-yellow/15 bg-black/20 px-3 py-3 text-xs text-eve-offwhite/78">
                      {team.members.map((member) => (
                        <p key={member.id}>
                          {roleLabel(member.role)} // {member.walletAddress} // {member.slotStatus}
                        </p>
                      ))}
                    </div>

                    {applications.length > 0 ? (
                      <div className="mt-3 space-y-2 border border-eve-red/20 bg-eve-red/5 px-3 py-3">
                        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-eve-red">Pending Applications</p>
                        {applications.map((application: TeamApplication) => (
                          <div key={application.applicationId} className="border border-eve-red/20 bg-black/20 px-3 py-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-eve-offwhite/78">
                              {application.applicantAddress} // {roleLabel(application.role)}
                            </p>
                            {captain ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                <input
                                  value={rejectReasonByApplication[application.applicationId] ?? ""}
                                  onChange={(event) =>
                                    setRejectReasonByApplication((current) => ({
                                      ...current,
                                      [application.applicationId]: event.target.value
                                    }))
                                  }
                                  placeholder="Reject reason (optional)"
                                  className="min-w-[14rem] flex-1 border border-eve-yellow/40 bg-eve-black/80 px-3 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                                />
                                <TacticalButton
                                  tone="ghost"
                                  onClick={() => void handleApprove(team.id, application.applicationId)}
                                  disabled={state.isMutating}
                                >
                                  Approve
                                </TacticalButton>
                                <TacticalButton
                                  tone="danger"
                                  onClick={() => void handleReject(team.id, application.applicationId)}
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
                        APPLICATION PENDING // {roleLabel(myPending.role)}
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {canApply ? (
                        <>
                          <select
                            value={joinRoleByTeam[team.id] ?? "hauler"}
                            onChange={(event) =>
                              setJoinRoleByTeam((current) => ({
                                ...current,
                                [team.id]: event.target.value as PlayerRole
                              }))
                            }
                            className="border border-eve-yellow/50 bg-eve-black/80 px-2 py-2 text-xs text-eve-offwhite outline-none focus:border-eve-yellow"
                          >
                            {ROLE_ORDER.map((role) => (
                              <option key={`${team.id}-${role}`} value={role}>
                                {roleLabel(role)}
                              </option>
                            ))}
                          </select>
                          <TacticalButton onClick={() => void handleJoinTeam(team.id)} disabled={state.isMutating}>
                            Apply Join
                          </TacticalButton>
                        </>
                      ) : null}

                      {selectors.currentPlayerTeam(currentWalletAddress)?.id === team.id && team.status === "forming" ? (
                        <TacticalButton tone="ghost" onClick={() => void handleLeave(team.id)} disabled={state.isMutating}>
                          Leave
                        </TacticalButton>
                      ) : null}

                      {captain ? (
                        <>
                          <TacticalButton tone="ghost" onClick={() => void handleLock(team.id)} disabled={state.isMutating}>
                            Lock Team
                          </TacticalButton>
                          <TacticalButton
                            onClick={() => void handlePay(team)}
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
            : message}
      </p>
    </FuelMissionShell>
  );
}
