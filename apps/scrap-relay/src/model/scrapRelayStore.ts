import { create } from "zustand";
import { BlueprintStep, ContributionSnapshot, MaterialCommitPayload, MemberPayout, RoomState, SettlementBill } from "@/types/scrapRelay";

export interface ScrapRelayStore {
  roomState: RoomState;
  roleAssignments: Record<string, string>;
  steps: BlueprintStep[];
  blockedSteps: string[];
  contributionByPlayer: Record<string, ContributionSnapshot>;
  bill: SettlementBill;
  claimedPlayerIds: string[];
  settlementRequestIds: string[];
  auditFlags: string[];
  setRoomState: (next: RoomState) => void;
  assignRole: (playerId: string, role: string) => void;
  applyStepCommit: (stepId: string, payload: MaterialCommitPayload[]) => void;
  setBlockedSteps: (stepIds: string[]) => void;
  setContributionSnapshot: (playerId: string, snapshot: ContributionSnapshot) => void;
  setSettlementBill: (bill: SettlementBill) => void;
  markRewardClaimed: (playerId: string) => void;
  appendSettlementRequestId: (requestId: string) => void;
  setAuditFlags: (flags: string[]) => void;
  resetStore: () => void;
}

const allowedTransitions: Record<RoomState, RoomState[]> = {
  LobbyReady: ["RoleLock"],
  RoleLock: ["RelayRunning"],
  RelayRunning: ["Overtime", "Settled"],
  Overtime: ["Settled"],
  Settled: []
};

const initialSteps: BlueprintStep[] = [
  { stepId: "step-1", requiredTypeId: "ore-a", requiredQty: 10, dependencySteps: [], completed: false },
  { stepId: "step-2", requiredTypeId: "alloy-b", requiredQty: 6, dependencySteps: ["step-1"], completed: false },
  { stepId: "step-3", requiredTypeId: "hull-c", requiredQty: 3, dependencySteps: ["step-2"], completed: false }
];

const initialBill: SettlementBill = {
  grossPool: 0,
  platformFee: 0,
  hostFee: 0,
  payoutPool: 0,
  teamPayouts: [],
  memberPayouts: []
};

const cloneInitialBill = (): SettlementBill => ({
  grossPool: initialBill.grossPool,
  platformFee: initialBill.platformFee,
  hostFee: initialBill.hostFee,
  payoutPool: initialBill.payoutPool,
  teamPayouts: [],
  memberPayouts: []
});

export const useScrapRelayStore = create<ScrapRelayStore>((set, get) => ({
  roomState: "LobbyReady",
  roleAssignments: {},
  steps: initialSteps,
  blockedSteps: [],
  contributionByPlayer: {},
  bill: cloneInitialBill(),
  claimedPlayerIds: [],
  settlementRequestIds: [],
  auditFlags: [],
  setRoomState: (next) => {
    const current = get().roomState;
    if (!allowedTransitions[current].includes(next)) {
      throw new Error("E_STATE_TRANSITION_INVALID");
    }
    set({ roomState: next });
  },
  assignRole: (playerId, role) => {
    set((state) => ({ roleAssignments: { ...state.roleAssignments, [playerId]: role } }));
  },
  applyStepCommit: (stepId) => {
    set((state) => ({
      steps: state.steps.map((item) => (item.stepId === stepId ? { ...item, completed: true } : item))
    }));
  },
  setBlockedSteps: (stepIds) => set({ blockedSteps: stepIds }),
  setContributionSnapshot: (playerId, snapshot) => {
    set((state) => ({
      contributionByPlayer: { ...state.contributionByPlayer, [playerId]: snapshot }
    }));
  },
  setSettlementBill: (bill) => set({ bill }),
  markRewardClaimed: (playerId) => {
    const { roomState, claimedPlayerIds, bill } = get();
    if (roomState !== "Settled") {
      return;
    }
    const payoutExists = bill.memberPayouts.some((item: MemberPayout) => item.playerId === playerId);
    if (!payoutExists || claimedPlayerIds.includes(playerId)) {
      return;
    }
    set({ claimedPlayerIds: [...claimedPlayerIds, playerId] });
  },
  appendSettlementRequestId: (requestId) => {
    set((state) => ({ settlementRequestIds: [...state.settlementRequestIds, requestId] }));
  },
  setAuditFlags: (flags) => set({ auditFlags: flags }),
  resetStore: () =>
    set({
      roomState: "LobbyReady",
      roleAssignments: {},
      steps: initialSteps.map((step) => ({ ...step })),
      blockedSteps: [],
      contributionByPlayer: {},
      bill: cloneInitialBill(),
      claimedPlayerIds: [],
      settlementRequestIds: [],
      auditFlags: []
    })
}));

export const selectCurrentExecutableSteps = (state: ScrapRelayStore): BlueprintStep[] =>
  state.steps.filter((step) => !step.completed && step.dependencySteps.every((dep) => state.steps.find((x) => x.stepId === dep)?.completed));

export const selectTopBlockedStep = (state: ScrapRelayStore): string | null => state.blockedSteps[0] ?? null;

export const selectPlayerContributionRatio = (playerId: string) => (state: ScrapRelayStore): number => {
  const values = Object.values(state.contributionByPlayer);
  const total = values.reduce((sum, item) => sum + item.miningPoints + item.haulingPoints + item.assemblyPoints + item.guardPoints, 0);
  if (total === 0) {
    return 0;
  }
  const mine = state.contributionByPlayer[playerId];
  if (!mine) {
    return 0;
  }
  const own = mine.miningPoints + mine.haulingPoints + mine.assemblyPoints + mine.guardPoints;
  return own / total;
};

export const selectSettlementExplainableRows = (state: ScrapRelayStore): string[] => [
  `gross_pool=${state.bill.grossPool}`,
  `platform_fee=${state.bill.platformFee}`,
  `host_fee=${state.bill.hostFee}`,
  `payout_pool=${state.bill.payoutPool}`
];

export const resetScrapRelayStore = () => {
  useScrapRelayStore.getState().resetStore();
};
