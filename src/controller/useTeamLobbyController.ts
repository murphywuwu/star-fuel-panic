"use client";

import { useMemo, useSyncExternalStore } from "react";
import { teamLobbyService } from "@/service/teamLobbyService";

function normalizeWallet(walletAddress: string | null) {
  return walletAddress?.trim().toLowerCase() ?? null;
}

export function useTeamLobbyController() {
  const state = useSyncExternalStore(
    teamLobbyService.subscribe,
    teamLobbyService.getSnapshot,
    teamLobbyService.getSnapshot
  );

  const selectors = useMemo(
    () => ({
      openTeams: state.teams.filter((team) => team.status === "forming"),
      currentPlayerTeam: (walletAddress: string | null) => {
        const normalized = normalizeWallet(walletAddress);
        if (!normalized) {
          return null;
        }

        return (
          state.teams.find((team) =>
            team.members.some((member) => normalizeWallet(member.walletAddress) === normalized)
          ) ?? null
        );
      },
      paymentAmount: (teamId: string) => {
        const team = state.teams.find((item) => item.id === teamId);
        if (!team) {
          return 0;
        }

        const parsed = Number(team.paymentAmount);
        return Number.isFinite(parsed) ? parsed : 0;
      }
    }),
    [state]
  );

  const actions = useMemo(
    () => ({
      load: teamLobbyService.load.bind(teamLobbyService),
      createTeam: teamLobbyService.createTeam.bind(teamLobbyService),
      joinTeam: teamLobbyService.joinTeam.bind(teamLobbyService),
      approveJoinApplication: teamLobbyService.approveJoin.bind(teamLobbyService),
      rejectJoinApplication: teamLobbyService.rejectJoin.bind(teamLobbyService),
      leaveTeam: teamLobbyService.leaveTeam.bind(teamLobbyService),
      lockTeam: teamLobbyService.lockTeam.bind(teamLobbyService),
      payTeam: teamLobbyService.payTeam.bind(teamLobbyService)
    }),
    []
  );

  return {
    state,
    selectors,
    actions
  };
}
