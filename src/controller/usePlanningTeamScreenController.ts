"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthController } from "@/controller/useAuthController";
import { usePlanningTeamController } from "@/controller/usePlanningTeamController";
import type { PlayerRole, RoleSlots } from "@/types/team";

const DEFAULT_CREATE_TEAM_FORM = {
  teamName: "Alpha Squad",
  maxMembers: 3,
  collectorSlots: 1,
  haulerSlots: 1,
  escortSlots: 1
};

const ROLE_ORDER: PlayerRole[] = ["collector", "hauler", "escort"];

function clampMaxMembers(value: number) {
  return Math.max(3, Math.min(8, Number(value) || 3));
}

function clampSlotCount(value: number) {
  return Math.max(0, Math.min(8, Number(value) || 0));
}

export function usePlanningTeamScreenController() {
  const { state, selectors, actions } = usePlanningTeamController();
  const { state: authState } = useAuthController();

  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [teamName, setTeamName] = useState(DEFAULT_CREATE_TEAM_FORM.teamName);
  const [maxMembers, setMaxMembers] = useState(DEFAULT_CREATE_TEAM_FORM.maxMembers);
  const [collectorSlots, setCollectorSlots] = useState(DEFAULT_CREATE_TEAM_FORM.collectorSlots);
  const [haulerSlots, setHaulerSlots] = useState(DEFAULT_CREATE_TEAM_FORM.haulerSlots);
  const [escortSlots, setEscortSlots] = useState(DEFAULT_CREATE_TEAM_FORM.escortSlots);
  const [joinRoleByTeam, setJoinRoleByTeam] = useState<Record<string, PlayerRole>>({});
  const [message, setMessage] = useState("TEAM REGISTRY ONLINE // BROWSE OPEN TEAMS OR CREATE A NEW FORMATION");

  useEffect(() => {
    void actions.load().then((result) => {
      if (!result.ok) {
        setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      }
    });
  }, [actions]);

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

  const slotCounts = useMemo<RoleSlots>(
    () => ({
      collector: collectorSlots,
      hauler: haulerSlots,
      escort: escortSlots
    }),
    [collectorSlots, escortSlots, haulerSlots]
  );
  const slotTotal = slotCounts.collector + slotCounts.hauler + slotCounts.escort;
  const currentPlayerTeam = selectors.currentPlayerTeam(authState.walletAddress);
  const normalizedWallet = authState.walletAddress?.trim().toLowerCase() ?? null;
  const currentPendingApplication = normalizedWallet
    ? state.teams
        .flatMap((team) => team.applications)
        .find(
          (application) =>
            application.status === "pending" &&
            application.applicantWalletAddress.trim().toLowerCase() === normalizedWallet
        ) ?? null
    : null;
  const canOpenCreateModal = authState.isConnected && !currentPlayerTeam && !currentPendingApplication;
  const canCreate = canOpenCreateModal && slotTotal === maxMembers && teamName.trim().length > 0;

  const countRoleMembers = (teamId: string, role: PlayerRole) => {
    const team = state.teams.find((item) => item.id === teamId);
    if (!team) {
      return 0;
    }

    return team.members.filter((member) => member.role === role).length;
  };

  const getOpenRoles = (teamId: string) =>
    ROLE_ORDER.filter((role) => {
      const team = state.teams.find((item) => item.id === teamId);
      if (!team) {
        return false;
      }

      return countRoleMembers(teamId, role) < team.roleSlots[role];
    });

  const getPendingApplication = (teamId: string) => {
    if (!normalizedWallet) {
      return null;
    }

    const team = state.teams.find((item) => item.id === teamId);
    if (!team) {
      return null;
    }

    return (
      team.applications.find(
        (application) =>
          application.status === "pending" &&
          application.applicantWalletAddress.trim().toLowerCase() === normalizedWallet
      ) ?? null
    );
  };

  const getPendingApplicationsForCaptain = (teamId: string) => {
    const team = state.teams.find((item) => item.id === teamId);
    if (!team) {
      return [];
    }

    return team.applications.filter((application) => application.status === "pending");
  };

  const resetForm = () => {
    setTeamName(DEFAULT_CREATE_TEAM_FORM.teamName);
    setMaxMembers(DEFAULT_CREATE_TEAM_FORM.maxMembers);
    setCollectorSlots(DEFAULT_CREATE_TEAM_FORM.collectorSlots);
    setHaulerSlots(DEFAULT_CREATE_TEAM_FORM.haulerSlots);
    setEscortSlots(DEFAULT_CREATE_TEAM_FORM.escortSlots);
  };

  const handleCreateTeam = async () => {
    const result = await actions.createTeam({
      name: teamName.trim(),
      maxMembers,
      roleSlots: slotCounts,
      walletAddress: authState.walletAddress ?? ""
    });

    if (!result.ok || !result.payload?.team) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`TEAM CREATED // ${result.payload.team.name} // COUNT ${result.payload.totalTeams}`);
    resetForm();
    setIsCreateTeamModalOpen(false);
  };

  const handleJoinTeam = async (teamId: string) => {
    const availableRoles = getOpenRoles(teamId);
    const selectedRole = joinRoleByTeam[teamId] ?? availableRoles[0] ?? "hauler";
    const result = await actions.joinTeam({
      teamId,
      role: selectedRole,
      walletAddress: authState.walletAddress ?? ""
    });

    if (!result.ok || !result.payload?.team) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`JOIN REQUEST SENT // ${result.payload.team.name} // ${selectedRole.toUpperCase()}`);
  };

  const handleApproveApplication = async (teamId: string, applicationId: string) => {
    const result = await actions.approveApplication({
      teamId,
      applicationId,
      walletAddress: authState.walletAddress ?? ""
    });

    if (!result.ok || !result.payload?.team) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`APPLICATION APPROVED // ${result.payload.team.name}`);
  };

  const handleRejectApplication = async (teamId: string, applicationId: string) => {
    const result = await actions.rejectApplication({
      teamId,
      applicationId,
      walletAddress: authState.walletAddress ?? ""
    });

    if (!result.ok || !result.payload?.team) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage(`APPLICATION REJECTED // ${result.payload.team.name}`);
  };

  const handleLeaveTeam = async (teamId: string) => {
    const result = await actions.leaveTeam({
      teamId,
      walletAddress: authState.walletAddress ?? ""
    });

    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage("LEFT TEAM // REGISTRY UPDATED");
  };

  const handleDisbandTeam = async (teamId: string) => {
    const result = await actions.disbandTeam({
      teamId,
      walletAddress: authState.walletAddress ?? ""
    });

    if (!result.ok) {
      setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
      return;
    }

    setMessage("TEAM DISBANDED // REGISTRY UPDATED");
  };

  return {
    state,
    authState,
    ui: {
      message,
      roleOrder: ROLE_ORDER,
      isCreateTeamModalOpen,
      teamName,
      maxMembers,
      collectorSlots,
      haulerSlots,
      escortSlots,
      slotCounts,
      slotTotal,
      canOpenCreateModal,
      canCreate,
      currentPlayerTeamId: currentPlayerTeam?.id ?? null,
      currentPendingApplicationTeamId: currentPendingApplication?.teamId ?? null,
      joinRoleByTeam
    },
    helpers: {
      roleLabel: (role: PlayerRole) => role.charAt(0).toUpperCase() + role.slice(1),
      getRoleCount: countRoleMembers,
      getOpenRoles,
      getPendingApplication,
      getPendingApplicationsForCaptain,
      isCaptain: (teamId: string) =>
        Boolean(
          state.teams.find(
            (team) =>
              team.id === teamId &&
              authState.walletAddress &&
              team.captainAddress.trim().toLowerCase() === authState.walletAddress.trim().toLowerCase()
          )
        ),
      isMember: (teamId: string) => currentPlayerTeam?.id === teamId
    },
    actions: {
      openCreateTeamModal: () => setIsCreateTeamModalOpen(true),
      closeCreateTeamModal: () => {
        resetForm();
        setIsCreateTeamModalOpen(false);
      },
      setTeamName,
      setMaxMembers: (value: number) => setMaxMembers(clampMaxMembers(value)),
      setCollectorSlots: (value: number) => setCollectorSlots(clampSlotCount(value)),
      setHaulerSlots: (value: number) => setHaulerSlots(clampSlotCount(value)),
      setEscortSlots: (value: number) => setEscortSlots(clampSlotCount(value)),
      setJoinRole: (teamId: string, role: PlayerRole) =>
        setJoinRoleByTeam((current) => ({
          ...current,
          [teamId]: role
        })),
      handleCreateTeam,
      handleJoinTeam,
      handleApproveApplication,
      handleRejectApplication,
      handleLeaveTeam,
      handleDisbandTeam
    }
  };
}
