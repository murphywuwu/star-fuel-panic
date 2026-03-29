"use client";

import { useEffect, useState } from "react";
import { useAuthController } from "@/controller/useAuthController";
import { useTeamDossierController } from "@/controller/useTeamDossierController";
import type { MatchStatus } from "@/types/match";
import type { PlayerRole, TeamDetail, TeamStatus } from "@/types/team";

const ROLE_ORDER: PlayerRole[] = ["collector", "hauler", "escort"];

function roleLabel(role: PlayerRole) {
  if (role === "collector") return "Collector";
  if (role === "hauler") return "Hauler";
  return "Escort";
}

function teamStatusLabel(status: TeamStatus) {
  if (status === "paid") return "PAID";
  if (status === "locked") return "LOCKED";
  if (status === "ready") return "READY";
  return "FORMING";
}

function matchStatusLabel(status: MatchStatus) {
  if (status === "prestart") return "PRESTART";
  if (status === "running") return "RUNNING";
  if (status === "panic") return "PANIC";
  if (status === "settling") return "SETTLING";
  if (status === "settled") return "SETTLED";
  return "LOBBY";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

function formatDate(value: string) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(parsed);
}

function buildMatchHref(matchId: string, status: MatchStatus) {
  if (status === "lobby" || status === "prestart") {
    return {
      href: `/planning?matchId=${encodeURIComponent(matchId)}`,
      label: "Open Team Lobby"
    };
  }

  if (status === "running" || status === "panic" || status === "settling") {
    return {
      href: "/match",
      label: "Open Match"
    };
  }

  return {
    href: "/settlement",
    label: "Open Settlement"
  };
}

function countMembers(team: TeamDetail, role: PlayerRole) {
  return team.members.filter((member) => member.role === role).length;
}

export function useTeamDossierScreenController() {
  const { state, selectors, actions } = useTeamDossierController();
  const { state: authState } = useAuthController();
  const [message, setMessage] = useState("SQUAD DOSSIER STANDBY // CONNECT WALLET");

  useEffect(() => {
    if (!authState.isConnected || !authState.walletAddress) {
      actions.clear();
      setMessage("SQUAD DOSSIER STANDBY // CONNECT WALLET");
      return;
    }

    void actions.load(authState.walletAddress).then((result) => {
      if (!result.ok) {
        setMessage(`${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
        return;
      }

      setMessage(`DOSSIER LINKED // ${authState.walletAddress}`);
    });
  }, [actions, authState.isConnected, authState.walletAddress]);

  return {
    state,
    authState,
    dossier: state.dossier,
    ui: {
      message,
      roleOrder: ROLE_ORDER,
      currentDeployment: selectors.currentDeployment,
      latestParticipation: selectors.latestParticipation,
      participationHistory: selectors.participationHistory,
      hasWallet: authState.isConnected && Boolean(authState.walletAddress)
    },
    helpers: {
      roleLabel,
      teamStatusLabel,
      matchStatusLabel,
      formatMoney,
      formatDate,
      buildMatchHref,
      countMembers
    },
    actions: {
      retry: () => {
        if (!authState.walletAddress) {
          return;
        }

        void actions.load(authState.walletAddress).then((result) => {
          setMessage(result.ok ? `DOSSIER REFRESHED // ${authState.walletAddress}` : `${result.errorCode ?? "UNKNOWN"} // ${result.message}`);
        });
      }
    }
  };
}
