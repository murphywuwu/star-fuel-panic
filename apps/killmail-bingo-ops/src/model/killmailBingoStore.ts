import { create } from "zustand";

import type { BattleReportEntry, BoardSlot, KillmailRef, MatchPhase, SettlementBill } from "@/types/killmail";

interface KillmailBingoState {
  matchId: string;
  matchPhase: MatchPhase;
  boardSlots: BoardSlot[];
  pendingEvents: KillmailRef[];
  pendingSlotByKillmailId: Record<string, string>;
  confirmedEvents: KillmailRef[];
  rejectedEvents: KillmailRef[];
  usedKillmailIds: Record<string, string>;
  settlement: SettlementBill;
  settlementClaimedBy: string | null;
  reportEntries: BattleReportEntry[];
  riskFlag: boolean;
  riskScore: number;
  lastSyncedAt: string;
  errorLog: string[];
  setMatchId: (matchId: string) => void;
  setMatchPhase: (next: MatchPhase) => void;
  setBoardSlots: (slots: BoardSlot[]) => void;
  setSlotPending: (slotId: string, event: KillmailRef) => void;
  removePendingEvent: (killmailId: string) => void;
  confirmEvent: (slotId: string, event: KillmailRef) => void;
  rejectEvent: (slotId: string, event: KillmailRef) => void;
  markKillmailUsage: (killmailId: string, slotId: string) => void;
  setSettlement: (settlement: SettlementBill) => void;
  setSettlementClaimedBy: (pilotId: string | null) => void;
  addReportEntry: (entry: BattleReportEntry) => void;
  setRiskFlag: (riskFlag: boolean) => void;
  setRiskScore: (riskScore: number) => void;
  setLastSyncedAt: (timestamp: string) => void;
  logError: (error: string) => void;
  resetSessionForMatch: (matchId: string) => void;
}

const initialSettlement: SettlementBill = {
  settlementId: "UNSETTLED",
  grossPool: 0,
  platformFee: 0,
  hostFee: 0,
  payoutPool: 0
};

export const useKillmailBingoStore = create<KillmailBingoState>((set) => ({
  matchId: "match-demo-001",
  matchPhase: "LobbyReady",
  boardSlots: [],
  pendingEvents: [],
  pendingSlotByKillmailId: {},
  confirmedEvents: [],
  rejectedEvents: [],
  usedKillmailIds: {},
  settlement: initialSettlement,
  settlementClaimedBy: null,
  reportEntries: [],
  riskFlag: false,
  riskScore: 0,
  lastSyncedAt: new Date(0).toISOString(),
  errorLog: [],
  setMatchId: (matchId) => set({ matchId }),
  setMatchPhase: (next) => set({ matchPhase: next }),
  setBoardSlots: (slots) => set({ boardSlots: slots }),
  setSlotPending: (slotId, event) =>
    set((state) => ({
      boardSlots: state.boardSlots.map((slot) =>
        slot.slotId === slotId
          ? {
              ...slot,
              status: "Pending"
            }
          : slot
      ),
      pendingEvents: [...state.pendingEvents, event],
      pendingSlotByKillmailId: {
        ...state.pendingSlotByKillmailId,
        [event.killmailId]: slotId
      }
    })),
  removePendingEvent: (killmailId) =>
    set((state) => ({
      boardSlots: state.boardSlots.map((slot) =>
        slot.slotId === state.pendingSlotByKillmailId[killmailId]
          ? {
              ...slot,
              status: "Idle"
            }
          : slot
      ),
      pendingEvents: state.pendingEvents.filter((item) => item.killmailId !== killmailId),
      pendingSlotByKillmailId: Object.fromEntries(
        Object.entries(state.pendingSlotByKillmailId).filter(([id]) => id !== killmailId)
      )
    })),
  confirmEvent: (slotId, event) =>
    set((state) => ({
      boardSlots: state.boardSlots.map((slot) =>
        slot.slotId === slotId
          ? {
              ...slot,
              status: "Confirmed",
              confirmedKillmailId: event.killmailId
            }
          : slot
      ),
      pendingEvents: state.pendingEvents.filter((item) => item.killmailId !== event.killmailId),
      pendingSlotByKillmailId: Object.fromEntries(
        Object.entries(state.pendingSlotByKillmailId).filter(([id]) => id !== event.killmailId)
      ),
      confirmedEvents: [...state.confirmedEvents, event],
      reportEntries: [
        ...state.reportEntries,
        {
          killmailId: event.killmailId,
          slotId,
          status: "Confirmed"
        }
      ]
    })),
  rejectEvent: (slotId, event) =>
    set((state) => ({
      boardSlots: state.boardSlots.map((slot) =>
        slot.slotId === slotId
          ? {
              ...slot,
              status: "Rejected",
              confirmedKillmailId: event.killmailId
            }
          : slot
      ),
      pendingEvents: state.pendingEvents.filter((item) => item.killmailId !== event.killmailId),
      pendingSlotByKillmailId: Object.fromEntries(
        Object.entries(state.pendingSlotByKillmailId).filter(([id]) => id !== event.killmailId)
      ),
      rejectedEvents: [...state.rejectedEvents, event],
      reportEntries: [
        ...state.reportEntries,
        {
          killmailId: event.killmailId,
          slotId,
          status: "Rejected"
        }
      ]
    })),
  markKillmailUsage: (killmailId, slotId) =>
    set((state) => ({
      usedKillmailIds: {
        ...state.usedKillmailIds,
        [killmailId]: slotId
      }
    })),
  setSettlement: (settlement) => set({ settlement }),
  setSettlementClaimedBy: (pilotId) => set({ settlementClaimedBy: pilotId }),
  addReportEntry: (entry) => set((state) => ({ reportEntries: [...state.reportEntries, entry] })),
  setRiskFlag: (riskFlag) => set({ riskFlag }),
  setRiskScore: (riskScore) => set({ riskScore }),
  setLastSyncedAt: (timestamp) => set({ lastSyncedAt: timestamp }),
  logError: (error) => set((state) => ({ errorLog: [...state.errorLog, error] })),
  resetSessionForMatch: (matchId) =>
    set({
      matchId,
      matchPhase: "LobbyReady",
      boardSlots: [],
      pendingEvents: [],
      pendingSlotByKillmailId: {},
      confirmedEvents: [],
      rejectedEvents: [],
      usedKillmailIds: {},
      settlement: initialSettlement,
      settlementClaimedBy: null,
      reportEntries: [],
      riskFlag: false,
      riskScore: 0,
      errorLog: [],
      lastSyncedAt: new Date(0).toISOString()
    })
}));
