"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthController, walletErrorMessage } from "@/controller/useAuthController";
import { useTeamLobbyController } from "@/controller/useTeamLobbyController";
import { resolveMatchTeamSize } from "@/types/match";
import type { PlayerRole, RoleSlots, TeamApplication, TeamDetail } from "@/types/team";
import { deriveTeamPaymentRef } from "@/utils/teamPaymentRef";

function buildDefaultRoleSlots(maxMembers: number) {
  return {
    collectorSlots: Math.max(1, maxMembers - 2),
    haulerSlots: maxMembers >= 2 ? 1 : 0,
    escortSlots: maxMembers >= 3 ? 1 : 0
  };
}

const DEFAULT_TEAM_SIZE = 3;
const DEFAULT_ROLE_SLOTS = buildDefaultRoleSlots(DEFAULT_TEAM_SIZE);
const DEFAULT_CREATE_TEAM_FORM = {
  teamName: "Alpha Squad",
  maxMembers: DEFAULT_TEAM_SIZE,
  ...DEFAULT_ROLE_SLOTS
};

const SOLO_VERIFICATION_ENABLED = process.env.NODE_ENV !== "production";

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

function clampMaxMembers(value: number) {
  return Math.max(3, Math.min(8, Number(value) || 3));
}

function clampSlotCount(value: number) {
  return Math.max(0, Math.min(8, Number(value) || 0));
}

export function useTeamLobbyScreenController(preferredMatchId: string | null = null) {
  const { state, selectors, actions } = useTeamLobbyController();
  const { state: authState, actions: authActions } = useAuthController();
  const currentWalletAddress = authState.walletAddress;

  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [teamName, setTeamName] = useState(DEFAULT_CREATE_TEAM_FORM.teamName);
  const [maxMembers, setMaxMembers] = useState(DEFAULT_CREATE_TEAM_FORM.maxMembers);
  const [collectorSlots, setCollectorSlots] = useState(DEFAULT_CREATE_TEAM_FORM.collectorSlots);
  const [haulerSlots, setHaulerSlots] = useState(DEFAULT_CREATE_TEAM_FORM.haulerSlots);
  const [escortSlots, setEscortSlots] = useState(DEFAULT_CREATE_TEAM_FORM.escortSlots);
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

  useEffect(() => {
    if (!isCreateTeamModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCreateTeamModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCreateTeamModalOpen]);

  const requiredTeamSize = state.match ? resolveMatchTeamSize(state.match) : DEFAULT_TEAM_SIZE;

  useEffect(() => {
    const defaults = buildDefaultRoleSlots(requiredTeamSize);
    setMaxMembers(requiredTeamSize);
    setCollectorSlots(defaults.collectorSlots);
    setHaulerSlots(defaults.haulerSlots);
    setEscortSlots(defaults.escortSlots);
  }, [requiredTeamSize, state.matchId]);

  const slotCounts = useMemo<RoleSlots>(
    () => ({
      collector: collectorSlots,
      hauler: haulerSlots,
      escort: escortSlots
    }),
    [collectorSlots, escortSlots, haulerSlots]
  );
  const slotTotal = slotCounts.collector + slotCounts.hauler + slotCounts.escort;
  const canOpenCreateModal = authState.isConnected && Boolean(state.matchId);
  const canCreate = authState.isConnected && slotTotal === requiredTeamSize && teamName.trim().length > 0;
  const currentPlayerTeam = selectors.currentPlayerTeam(currentWalletAddress);

  const getTeamUiState = (team: TeamDetail) => {
    const captain = isCaptain(team, currentWalletAddress);
    const myPending = findMyPendingApplication(team, currentWalletAddress);

    return {
      captain,
      myPending,
      applications: pendingApplications(team),
      canApply:
        authState.isConnected &&
        !captain &&
        !currentPlayerTeam &&
        !myPending &&
        team.status === "forming",
      isCurrentPlayerTeam: currentPlayerTeam?.id === team.id,
      selectedJoinRole: joinRoleByTeam[team.id] ?? "hauler",
      paymentAmount: selectors.paymentAmount(team.id)
    };
  };

  const handleCreateTeam = async () => {
    const result = await actions.createTeam({
      matchId: state.matchId ?? "",
      name: teamName.trim(),
      roleSlots: slotCounts,
      walletAddress: authState.walletAddress ?? ""
    });

    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`TEAM CREATED // ${teamName.trim()}`);
    setIsCreateTeamModalOpen(false);
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
    const roomId = state.match?.onChainId?.trim() ?? "";
    const escrowId = state.match?.escrowId?.trim() ?? "";
    if (!roomId || !escrowId) {
      setMessage("MATCH ESCROW NOT READY // PUBLISH THE MATCH BEFORE TEAM PAYMENT");
      return;
    }

    const payment = await authActions.onExecuteEntryPayment({
      roomId,
      escrowId,
      teamRef: deriveTeamPaymentRef(team.id),
      memberCount: requiredTeamSize,
      amountLux: amount
    });
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

  const handleSoloFillTeam = async (teamId: string) => {
    const result = await actions.fillSoloTeam(teamId, authState.walletAddress ?? "");
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`SOLO VERIFY // TEAM AUTO-FILLED // ${teamId}`);
  };

  const handleSoloSeedRival = async () => {
    if (!state.matchId) {
      setMessage("SOLO VERIFY // NO MATCH LOADED");
      return;
    }

    const result = await actions.seedSoloRival(state.matchId, authState.walletAddress ?? "");
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`SOLO VERIFY // RIVAL SEEDED // ${state.matchId}`);
  };

  const handleSoloStart = async () => {
    if (!state.matchId) {
      setMessage("SOLO VERIFY // NO MATCH LOADED");
      return;
    }

    const result = await actions.startSoloMatch(state.matchId, authState.walletAddress ?? "");
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`SOLO VERIFY // MATCH STARTED // ${state.matchId}`);
  };

  const handleSoloSettle = async () => {
    if (!state.matchId) {
      setMessage("SOLO VERIFY // NO MATCH LOADED");
      return;
    }

    const result = await actions.settleSoloMatch(state.matchId, authState.walletAddress ?? "");
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`SOLO VERIFY // MATCH SETTLED // ${state.matchId}`);
  };

  return {
    state,
    authState,
    ui: {
      currentWalletAddress,
      currentPlayerTeamId: currentPlayerTeam?.id ?? null,
      isCreateTeamModalOpen,
      message,
      teamName,
      maxMembers: requiredTeamSize,
      collectorSlots,
      haulerSlots,
      escortSlots,
      slotCounts,
      slotTotal,
      canOpenCreateModal,
      canCreate,
      showSoloVerification: SOLO_VERIFICATION_ENABLED,
      rejectReasonByApplication
    },
    helpers: {
      roleLabel,
      teamStatusLabel,
      getTeamUiState,
      getRejectReason: (applicationId: string) => rejectReasonByApplication[applicationId] ?? ""
    },
    actions: {
      openCreateTeamModal: () => setIsCreateTeamModalOpen(true),
      closeCreateTeamModal: () => setIsCreateTeamModalOpen(false),
      setTeamName,
      setMaxMembers: (_value: number) => setMaxMembers(requiredTeamSize),
      setCollectorSlots: (value: number) => setCollectorSlots(clampSlotCount(value)),
      setHaulerSlots: (value: number) => setHaulerSlots(clampSlotCount(value)),
      setEscortSlots: (value: number) => setEscortSlots(clampSlotCount(value)),
      setJoinRole: (teamId: string, role: PlayerRole) =>
        setJoinRoleByTeam((current) => ({
          ...current,
          [teamId]: role
        })),
      setRejectReason: (applicationId: string, value: string) =>
        setRejectReasonByApplication((current) => ({
          ...current,
          [applicationId]: value
        })),
      handleCreateTeam,
      handleJoinTeam,
      handleApprove,
      handleReject,
      handleLeave,
      handleLock,
      handlePay,
      handleSoloFillTeam,
      handleSoloSeedRival,
      handleSoloStart,
      handleSoloSettle
    }
  };
}
