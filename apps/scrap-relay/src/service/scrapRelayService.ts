import {
  selectCurrentExecutableSteps,
  selectSettlementExplainableRows,
  selectTopBlockedStep,
  useScrapRelayStore
} from "@/model/scrapRelayStore";
import {
  AntiAbuseInput,
  AntiAbuseResult,
  BlueprintStep,
  ContributionSnapshot,
  DomainError,
  MaterialCommitPayload,
  MemberPayout,
  Role,
  RoomState,
  SettlementBill
} from "@/types/scrapRelay";

interface TransitionRoomStateInput {
  nextState: RoomState;
}

interface LockRoleInput {
  playerId: string;
  role: Role;
}

interface CommitStepInput {
  playerId: string;
  stepId: string;
  materials: MaterialCommitPayload[];
}

interface BuildSettlementInput {
  playerCount: number;
  entryFeeLux: number;
  platformRakeBps: number;
  hostRevshareBps: number;
}

interface FinalizeSettlementInput {
  requestId: string;
  playerCount: number;
  entryFeeLux: number;
  platformRakeBps: number;
  hostRevshareBps: number;
  antiAbuseInput?: AntiAbuseInput;
}

interface ClaimRewardInput {
  playerId: string;
}

const chainWriteAttempts: Record<string, number> = {};

const makeError = (code: DomainError["code"], message: string): DomainError => ({ code, message });

export const transitionRoomState = ({ nextState }: TransitionRoomStateInput): { ok: true } | { ok: false; error: DomainError } => {
  try {
    useScrapRelayStore.getState().setRoomState(nextState);
    return { ok: true };
  } catch {
    return { ok: false, error: makeError("E_STATE_TRANSITION_INVALID", `Invalid transition to ${nextState}`) };
  }
};

export const enterRoleLock = (): { ok: true } | { ok: false; error: DomainError } =>
  transitionRoomState({ nextState: "RoleLock" });

export const startRelay = (): { ok: true } | { ok: false; error: DomainError } =>
  transitionRoomState({ nextState: "RelayRunning" });

export const lockRole = ({ playerId, role }: LockRoleInput): { ok: true } | { ok: false; error: DomainError } => {
  useScrapRelayStore.getState().assignRole(playerId, role);
  return { ok: true };
};

const validateStepDependencies = (step: BlueprintStep, allSteps: BlueprintStep[]): boolean =>
  step.dependencySteps.every((dep) => allSteps.find((item) => item.stepId === dep)?.completed);

const validateMaterials = (materials: MaterialCommitPayload[], expectedType: string, requiredQty: number): boolean => {
  const total = materials.reduce((sum, item) => {
    if (item.typeId !== expectedType || item.qty <= 0) {
      return sum;
    }
    return sum + item.qty;
  }, 0);
  return total >= requiredQty;
};

export const commitBlueprintStep = ({ playerId, stepId, materials }: CommitStepInput): { ok: true } | { ok: false; error: DomainError } => {
  const state = useScrapRelayStore.getState();
  const step = state.steps.find((item) => item.stepId === stepId);

  if (!step) {
    return { ok: false, error: makeError("E_MATERIAL_NOT_ALLOWED", "Step does not exist") };
  }
  if (step.completed) {
    return { ok: false, error: makeError("E_PERMISSION_DENIED", "Step already committed") };
  }
  if (!validateStepDependencies(step, state.steps)) {
    return { ok: false, error: makeError("E_BLUEPRINT_DEPENDENCY_UNMET", "Dependencies are not complete") };
  }
  if (!validateMaterials(materials, step.requiredTypeId, step.requiredQty)) {
    return { ok: false, error: makeError("E_MATERIAL_NOT_ALLOWED", "Material payload invalid") };
  }

  state.applyStepCommit(stepId, materials);

  const current = state.contributionByPlayer[playerId] ?? {
    miningPoints: 0,
    haulingPoints: 0,
    assemblyPoints: 0,
    guardPoints: 0
  };

  state.setContributionSnapshot(playerId, {
    ...current,
    assemblyPoints: current.assemblyPoints + 5
  });

  return { ok: true };
};

export const computeContribution = (): { snapshots: Record<string, ContributionSnapshot> } => {
  return { snapshots: useScrapRelayStore.getState().contributionByPlayer };
};

export const heartbeatTick = (): { blockedStep: string | null; executableStepCount: number } => {
  const state = useScrapRelayStore.getState();
  const executable = selectCurrentExecutableSteps(state);
  const blocked = state.steps
    .filter((step) => !step.completed && !step.dependencySteps.every((dep) => state.steps.find((item) => item.stepId === dep)?.completed))
    .map((step) => step.stepId);

  state.setBlockedSteps(blocked);

  if (state.roomState === "RelayRunning" && executable.length === 0 && blocked.length > 0) {
    transitionRoomState({ nextState: "Overtime" });
  }

  return { blockedStep: selectTopBlockedStep(useScrapRelayStore.getState()), executableStepCount: executable.length };
};

export const buildSettlementBill = ({
  playerCount,
  entryFeeLux,
  platformRakeBps,
  hostRevshareBps
}: BuildSettlementInput): { ok: true; data: SettlementBill } | { ok: false; error: DomainError } => {
  if (platformRakeBps > 1500 || hostRevshareBps > 6000) {
    return { ok: false, error: makeError("E_PERMISSION_DENIED", "Fee bounds exceeded") };
  }

  const grossPool = playerCount * entryFeeLux;
  const platformFee = Math.floor((grossPool * platformRakeBps) / 10000);
  const hostFee = Math.floor((platformFee * hostRevshareBps) / 10000);
  const payoutPool = grossPool - platformFee;

  const bill: SettlementBill = {
    grossPool,
    platformFee,
    hostFee,
    payoutPool,
    teamPayouts: [
      { teamId: "alpha", amount: Math.floor(payoutPool * 0.65) },
      { teamId: "beta", amount: payoutPool - Math.floor(payoutPool * 0.65) }
    ],
    memberPayouts: []
  };

  useScrapRelayStore.getState().setSettlementBill(bill);
  return { ok: true, data: bill };
};

export const evaluateAntiAbuse = (input: AntiAbuseInput): AntiAbuseResult => {
  const flags: string[] = [];

  if (input.matchDurationSec < 60) {
    flags.push("ABUSE_SHORT_MATCH");
  }
  if (input.repeatedRouteCount >= 5) {
    flags.push("ABUSE_REPEATED_ROUTE");
  }
  if (input.maxPlayerContributionRatio > 0.85) {
    flags.push("ABUSE_CONTRIBUTION_CONCENTRATION");
  }
  if (input.sameAddressClusterCount >= 3) {
    flags.push("ABUSE_SAME_ADDRESS_CLUSTER");
  }

  return { flagged: flags.length > 0, flags };
};

const buildMemberPayouts = (payoutPool: number, players: string[]): MemberPayout[] => {
  if (players.length === 0) {
    return [];
  }
  const base = Math.floor(payoutPool / players.length);
  return players.map((playerId, index) => ({
    playerId,
    amount: index === players.length - 1 ? payoutPool - base * (players.length - 1) : base
  }));
};

const tryWriteSettlementToChain = (requestId: string): { ok: true } | { ok: false; error: DomainError } => {
  const count = chainWriteAttempts[requestId] ?? 0;
  chainWriteAttempts[requestId] = count + 1;

  if (count >= 2) {
    return { ok: true };
  }

  return { ok: false, error: makeError("E_CHAIN_WRITE_FAILED", "Transient chain write failure, retry") };
};

export const finalizeSettlement = ({
  requestId,
  playerCount,
  entryFeeLux,
  platformRakeBps,
  hostRevshareBps,
  antiAbuseInput
}: FinalizeSettlementInput): { ok: true; data: SettlementBill } | { ok: false; error: DomainError } => {
  const state = useScrapRelayStore.getState();
  if (state.roomState !== "RelayRunning" && state.roomState !== "Overtime") {
    return { ok: false, error: makeError("E_STATE_TRANSITION_INVALID", "Settlement only allowed in RelayRunning/Overtime") };
  }

  if (state.settlementRequestIds.includes(requestId)) {
    if (state.bill.grossPool > 0) {
      return { ok: true, data: state.bill };
    }
    return { ok: false, error: makeError("E_SETTLEMENT_DUPLICATED", "Settlement already requested") };
  }

  if (antiAbuseInput) {
    const antiAbuse = evaluateAntiAbuse(antiAbuseInput);
    useScrapRelayStore.getState().setAuditFlags(antiAbuse.flags);
    if (antiAbuse.flagged) {
      return { ok: false, error: makeError("E_ANTI_ABUSE_FLAGGED", antiAbuse.flags.join(",")) };
    }
  } else {
    useScrapRelayStore.getState().setAuditFlags([]);
  }

  state.appendSettlementRequestId(requestId);

  const built = buildSettlementBill({ playerCount, entryFeeLux, platformRakeBps, hostRevshareBps });
  if (!built.ok) {
    return built;
  }

  const rolePlayers = Object.keys(state.roleAssignments);
  const memberPayouts = buildMemberPayouts(built.data.payoutPool, rolePlayers);
  const finalBill: SettlementBill = { ...built.data, memberPayouts };

  for (let i = 0; i < 3; i += 1) {
    const chain = tryWriteSettlementToChain(requestId);
    if (chain.ok) {
      useScrapRelayStore.getState().setSettlementBill(finalBill);
      const moved = transitionRoomState({ nextState: "Settled" });
      if (!moved.ok) {
        return { ok: false, error: moved.error };
      }
      return { ok: true, data: finalBill };
    }
  }

  return { ok: false, error: makeError("E_CHAIN_WRITE_FAILED", "Chain write failed after retries") };
};

export const claimReward = ({ playerId }: ClaimRewardInput): { ok: true } | { ok: false; error: DomainError } => {
  const state = useScrapRelayStore.getState();
  if (state.roomState !== "Settled") {
    return { ok: false, error: makeError("E_STATE_TRANSITION_INVALID", "Reward claim only allowed in Settled state") };
  }

  const hasPayout = state.bill.memberPayouts.some((item) => item.playerId === playerId);
  if (!hasPayout) {
    return { ok: false, error: makeError("E_PERMISSION_DENIED", "No payout available for this player") };
  }

  if (state.claimedPlayerIds.includes(playerId)) {
    return { ok: false, error: makeError("E_SETTLEMENT_DUPLICATED", "Reward already claimed") };
  }

  state.markRewardClaimed(playerId);
  return { ok: true };
};

export const restartMatch = () => {
  resetServiceRuntime();
  useScrapRelayStore.getState().resetStore();
};

export const useScrapRelayViewState = () => {
  const roomState = useScrapRelayStore((state) => state.roomState);
  const roleAssignments = useScrapRelayStore((state) => state.roleAssignments);
  const steps = useScrapRelayStore((state) => state.steps);
  const blockedSteps = useScrapRelayStore((state) => state.blockedSteps);
  const contributionByPlayer = useScrapRelayStore((state) => state.contributionByPlayer);
  const bill = useScrapRelayStore((state) => state.bill);
  const claimedPlayerIds = useScrapRelayStore((state) => state.claimedPlayerIds);
  const auditFlags = useScrapRelayStore((state) => state.auditFlags);
  const explainRows = useScrapRelayStore(selectSettlementExplainableRows);
  return { roomState, roleAssignments, steps, blockedSteps, contributionByPlayer, bill, claimedPlayerIds, auditFlags, explainRows };
};

export const resetServiceRuntime = () => {
  for (const key of Object.keys(chainWriteAttempts)) {
    delete chainWriteAttempts[key];
  }
};
