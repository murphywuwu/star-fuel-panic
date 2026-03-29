"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthController, walletErrorMessage } from "@/controller/useAuthController";
import { PAYMENT_TOKEN_SYMBOL } from "@/utils/paymentToken";
import { useFuelMissionController } from "@/controller/useFuelMissionController";
import type { TeamRole, TeamState } from "@/types/fuelMission";

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

function clampRatio(value: number) {
  return Math.max(0, Math.min(1, value));
}

function inferredStartRuleMode(summary: string | undefined) {
  return summary && /fully paid|starts when\s+\d+/i.test(summary) ? "full_paid" : "min_team_force_start";
}

export function useFuelFrogLobbyScreenController() {
  const mission = useFuelMissionController();
  const auth = useAuthController();
  const { state, actions, selectors } = mission;
  const { state: authState, actions: authActions } = auth;

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
      blockers.push(`Insufficient balance (need ${payAmount} ${PAYMENT_TOKEN_SYMBOL})`);
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

  return {
    mission,
    auth,
    ui: {
      teamName,
      teamSize,
      captainName,
      captainRole,
      collectorSlots,
      haulerSlots,
      escortSlots,
      joinName,
      defaultJoinRole,
      joinRoleByTeam,
      activeTeamId,
      message,
      paidTeams,
      registeredTeams,
      minTeams,
      maxTeams,
      minPlayersPerTeam,
      startRuleMode,
      registeredRatio,
      paidRatio,
      minGateRatio,
      pendingTeams,
      slotTotal,
      teamRoles: TEAM_ROLES
    },
    helpers: {
      teamStatusTag,
      openRolesText,
      isCaptain,
      lockBlockersForTeam,
      payBlockersForTeam
    },
    actions: {
      setTeamName,
      setTeamSize: (value: number) => setTeamSize(Math.max(3, Math.min(8, Number(value) || 3))),
      setCaptainName,
      setCaptainRole: (role: TeamRole) => setCaptainRole(role),
      setCollectorSlots: (value: number) => setCollectorSlots(Math.max(0, Math.min(8, Number(value) || 0))),
      setHaulerSlots: (value: number) => setHaulerSlots(Math.max(0, Math.min(8, Number(value) || 0))),
      setEscortSlots: (value: number) => setEscortSlots(Math.max(0, Math.min(8, Number(value) || 0))),
      setJoinName,
      setDefaultJoinRole: (role: TeamRole) => setDefaultJoinRole(role),
      setJoinRoleForTeam: (teamId: string, role: TeamRole) =>
        setJoinRoleByTeam((current) => ({
          ...current,
          [teamId]: role
        })),
      setActiveTeamId,
      handleCreateTeam,
      handleJoinTeam,
      handleLockTeam,
      handlePayEntry
    }
  };
}
