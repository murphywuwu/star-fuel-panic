"use client";

import { useSyncExternalStore } from "react";
import { fuelMissionService } from "@/service/fuelMissionService";
import type { ControllerResult, TeamRole } from "@/types/fuelMission";

function normalizeResult<T>(result: ControllerResult<T> | ControllerResult<undefined>): ControllerResult<T> {
  if (result.ok) {
    return {
      ok: true,
      message: result.message,
      payload: result.payload as T
    };
  }

  return {
    ok: false,
    message: result.message,
    errorCode: result.errorCode
  };
}

export function useFuelMissionController() {
  const state = useSyncExternalStore(
    fuelMissionService.subscribe,
    fuelMissionService.getSnapshot,
    fuelMissionService.getSnapshot
  );

  return {
    state,
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
              hostSeedPool: 120,
              platformSubsidyPool: 80,
              sponsorPool: 50,
              platformRakeBps: 900,
              hostRevshareBps: 4000
            }
          })
        ),
      onJoinRoom: (teamId: string, playerId: string, name: string) =>
        normalizeResult(fuelMissionService.joinFuelRoom({ teamId, playerId, name })),
      onLockRole: (teamId: string, assignments: Partial<Record<TeamRole, string>>) =>
        normalizeResult(fuelMissionService.lockTeamRoles({ teamId, assignments })),
      onEnterPlanning: () => normalizeResult(fuelMissionService.transitionPhase("Planning")),
      onStartMatch: () => normalizeResult(fuelMissionService.transitionPhase("MatchRunning")),
      onSubmitSupplyRun: (nodeId: string, playerId: string, playerName: string, contributionDelta = 20, fillDelta = 0.1) =>
        normalizeResult(
          fuelMissionService.recordSupplyEvent({
            eventId: `evt_${Date.now()}_${Math.floor(Math.random() * 10_000)}`,
            nodeId,
            playerId,
            playerName,
            contributionDelta,
            fillDelta
          })
        ),
      onTick: () => normalizeResult(fuelMissionService.tickMatch()),
      onSettle: () => normalizeResult(fuelMissionService.finalizeSettlement()),
      onRefresh: () => fuelMissionService.refreshMissionState()
    }
  };
}
