import {
  claimReward,
  commitBlueprintStep,
  computeContribution,
  enterRoleLock,
  finalizeSettlement,
  heartbeatTick,
  lockRole,
  restartMatch,
  startRelay,
  transitionRoomState,
  useScrapRelayViewState
} from "@/service/scrapRelayService";
import { AntiAbuseInput, ControllerResult, MaterialCommitPayload, Role, SettlementBill } from "@/types/scrapRelay";

export const useScrapRelayControllerViewModel = () => useScrapRelayViewState();

export const enterRoleLockHandler = (): ControllerResult<null> => {
  const moved = enterRoleLock();
  if (!moved.ok) {
    return { ok: false, error: moved.error };
  }
  return { ok: true, data: null };
};

export const lockRoleHandler = (input: { playerId: string; role: Role; requestId: string }): ControllerResult<null> => {
  const moved = transitionRoomState({ nextState: "RoleLock" });
  if (!moved.ok && moved.error.code !== "E_STATE_TRANSITION_INVALID") {
    return { ok: false, error: moved.error };
  }

  const result = lockRole({ playerId: input.playerId, role: input.role });
  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, data: null };
};

export const submitBlueprintStepHandler = (input: {
  playerId: string;
  stepId: string;
  materials: MaterialCommitPayload[];
  requestId: string;
}): ControllerResult<null> => {
  const moved = transitionRoomState({ nextState: "RelayRunning" });
  if (!moved.ok && moved.error.code !== "E_STATE_TRANSITION_INVALID") {
    return { ok: false, error: moved.error };
  }

  const committed = commitBlueprintStep({
    playerId: input.playerId,
    stepId: input.stepId,
    materials: input.materials
  });

  if (!committed.ok) {
    return { ok: false, error: committed.error };
  }

  heartbeatTick();
  computeContribution();

  return { ok: true, data: null };
};

export const startRelayHandler = (): ControllerResult<null> => {
  const moved = startRelay();
  if (!moved.ok) {
    return { ok: false, error: moved.error };
  }
  return { ok: true, data: null };
};

export const heartbeatTickHandler = (): ControllerResult<{ blockedStep: string | null; executableStepCount: number }> => {
  const data = heartbeatTick();
  return { ok: true, data };
};

export const requestSettlementHandler = (input: {
  requestId: string;
  playerCount: number;
  entryFeeLux: number;
  platformRakeBps: number;
  hostRevshareBps: number;
  antiAbuseInput?: AntiAbuseInput;
}): ControllerResult<SettlementBill> => {
  const settled = finalizeSettlement(input);
  if (!settled.ok) {
    return { ok: false, error: settled.error };
  }
  return { ok: true, data: settled.data };
};

export const claimRewardHandler = (input: { playerId: string; requestId: string }): ControllerResult<null> => {
  if (!input.requestId) {
    return { ok: false, error: { code: "E_PERMISSION_DENIED", message: "requestId is required" } };
  }

  const result = claimReward({ playerId: input.playerId });
  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  return { ok: true, data: null };
};

export const restartMatchHandler = (): ControllerResult<null> => {
  restartMatch();
  return { ok: true, data: null };
};
