"use client";

import { useSyncExternalStore } from "react";
import { selectIsTeamReady, selectMyRole, selectMyTeam, selectTeamSlots } from "@/model/fuelMissionStore";
import { fuelMissionService } from "@/service/fuelMissionService";
import { matchService } from "@/service/matchService";
import type { ControllerResult, MatchStreamCallbacks, TeamRole } from "@/types/fuelMission";

function normalizeResult<T>(result: ControllerResult<T>): ControllerResult<T> {
  return result;
}

export function useFuelMissionController() {
  const state = useSyncExternalStore(
    fuelMissionService.subscribe,
    fuelMissionService.getSnapshot,
    fuelMissionService.getSnapshot
  );

  return {
    state,
    selectors: {
      myTeam: selectMyTeam(state.teams, state.myTeamId),
      myRole: selectMyRole(state.teams, state.myTeamId),
      teamSlots: (teamId: string) => {
        const team = state.teams.find((item) => item.teamId === teamId);
        return team ? selectTeamSlots(team) : [];
      },
      isTeamReady: (teamId: string) => {
        const team = state.teams.find((item) => item.teamId === teamId);
        return team ? selectIsTeamReady(team) : false;
      }
    },
    actions: {
      onInitMission: () => normalizeResult(fuelMissionService.initMissionState()),
      onCreateRoom: () =>
        normalizeResult(
          fuelMissionService.createFuelRoom({
            hostId: "host-001",
            hostName: "Murphy",
            funding: {
              entryFeeLux: 100,
              playerCount: 6,
              minTeams: 1,
              maxTeams: 10,
              minPlayersPerTeam: 3,
              startRuleSummary: "Starts when N teams are fully paid; otherwise at least 1 team of 3 players force-starts after 3 minutes",
              hostSeedPool: 120,
              platformSubsidyPool: 80,
              sponsorPool: 50,
              platformRakeBps: 900,
              hostRevshareBps: 4000
            }
          })
        ),
      onJoinRoom: (teamId: string, playerId: string, name: string) =>
        normalizeResult(
          fuelMissionService.joinFuelRoom({ teamId, playerId, name }) as ControllerResult<{
            teamId?: string;
            playerCount?: number;
            remainingLux?: number;
            team?: { teamId?: string };
          }>
        ),
      onCreateTeam: (input: {
        teamName: string;
        maxSize: number;
        captainWallet: string;
        captainName: string;
        captainRole?: TeamRole;
        roleSlots?: TeamRole[];
      }) => normalizeResult(fuelMissionService.createTeam(input)),
      onJoinTeam: (input: { teamId: string; walletAddress: string; name: string; role: TeamRole }) =>
        normalizeResult(fuelMissionService.joinTeam(input)),
      onLockRole: (teamId: string, assignments: Partial<Record<TeamRole, string>>) =>
        normalizeResult(fuelMissionService.lockTeamRoles({ teamId, assignments })),
      onLockTeam: (teamId: string, captainWallet: string) =>
        normalizeResult(fuelMissionService.lockTeam({ teamId, captainWallet })),
      onPayEntry: (teamId: string, captainWallet: string, txDigest?: string) =>
        normalizeResult(fuelMissionService.payEntry({ teamId, captainWallet, txDigest })),
      onEnterPlanning: () => normalizeResult(fuelMissionService.transitionPhase("pre_start")),
      onStartMatch: () => {
        const matchId = state.room?.roomId ?? "match-local";
        matchService.resetMatchData(matchId);
        return normalizeResult(fuelMissionService.transitionPhase("running"));
      },
      onWatchMatchStream: (callbacks?: MatchStreamCallbacks) => fuelMissionService.subscribeMatchStream(callbacks),
      onStopMatchStream: () => fuelMissionService.stopMatchStream(),
      onSubscribeLobbyUpdates: (callbacks: Parameters<typeof fuelMissionService.subscribeLobbyUpdates>[0]) =>
        fuelMissionService.subscribeLobbyUpdates(callbacks),
      onSubmitSupplyRun: (nodeId: string, playerId: string, playerName: string, contributionDelta = 20, fillDelta = 0.1) =>
        normalizeResult(
          fuelMissionService.recordSupplyEvent({
            eventId: `evt_${Date.now()}_${Math.floor(Math.random() * 10_000)}`,
            nodeId,
            playerId,
            playerName,
            contributionDelta,
            fillDelta,
            chainTimestampMs: Date.now() - Math.floor(Math.random() * 1_000),
            wsPublishedAtMs: Date.now() - Math.floor(Math.random() * 120)
          })
        ),
      onSelectUrgencyNode: (nodeId: string) => normalizeResult(fuelMissionService.selectUrgencyNode(nodeId)),
      onExecuteUrgencyRecommendation: () =>
        normalizeResult(fuelMissionService.executeUrgencyRecommendation()),
      onToggleAdvancedIntel: (nextExpanded?: boolean) =>
        normalizeResult(fuelMissionService.toggleAdvancedIntel(nextExpanded)),
      onTick: (stepSec = 10) => normalizeResult(fuelMissionService.tickMatch(stepSec)),
      onSettle: () => normalizeResult(fuelMissionService.finalizeSettlement()),
      onRunAnomalyDrill: () => normalizeResult(fuelMissionService.runAnomalyDrill()),
      getObservabilityMetrics: () => fuelMissionService.getObservabilityMetrics(),
      onRefresh: () => fuelMissionService.refreshMissionState()
    }
  };
}
