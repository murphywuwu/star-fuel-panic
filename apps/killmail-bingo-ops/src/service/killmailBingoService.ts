import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { useKillmailBingoStore } from "@/model/killmailBingoStore";
import { createKboContractGateway } from "@/service/kboContractGateway";
import type {
  BoardSlot,
  ContractMatchSnapshot,
  DomainError,
  KillmailRef,
  MatchPhase,
  MatchSnapshot,
  SettlementBill
} from "@/types/killmail";

const PHASE_ORDER: MatchPhase[] = ["LobbyReady", "CardDrafted", "MatchRunning", "GraceWindow", "Settled"];
const DEFAULT_PLAYERS = 8;
const DEFAULT_PLATFORM_FEE_BPS = 1000;
const DEFAULT_HOST_REVSHARE_BPS = 5000;

export function canTransition(current: MatchPhase, next: MatchPhase) {
  const currentIndex = PHASE_ORDER.indexOf(current);
  return PHASE_ORDER[currentIndex + 1] === next;
}

export function calculateRiskScore(input: {
  rejectedCount: number;
  duplicateAttempts: number;
  pendingCount: number;
}) {
  const { rejectedCount, duplicateAttempts, pendingCount } = input;
  return rejectedCount * 25 + duplicateAttempts * 35 + pendingCount * 4;
}

export function shouldFlagRisk(riskScore: number) {
  return riskScore >= 60;
}

function generateCardSlots(): BoardSlot[] {
  const labels = [
    "Final Blow in Lowsec",
    "Fleet Tackle Kill",
    "Heavy Weapon Confirm",
    "Outnumbered Victory",
    "Objective Grid Kill",
    "Commander Mark Target",
    "Gate Ambush Confirm",
    "Assist Chain x3",
    "No-loss Strike"
  ];

  return labels.map((label, index) => ({
    slotId: `slot-${index + 1}`,
    label,
    weight: 1 + (index % 3),
    verificationRuleId: `rule-${index + 1}`,
    status: "Idle"
  }));
}

function chooseNextSlot(boardSlots: BoardSlot[]) {
  return boardSlots.find((slot) => slot.status === "Idle");
}

function parseSlotId(slotId: string) {
  const value = Number(slotId.replace("slot-", ""));
  if (!Number.isInteger(value) || value < 1 || value > 9) {
    throw { code: "E_INVALID_INPUT", message: `invalid slot id: ${slotId}` } satisfies DomainError;
  }
  return value;
}

function isDomainError(input: unknown): input is DomainError {
  return Boolean(
    input &&
      typeof input === "object" &&
      "code" in input &&
      "message" in input &&
      typeof (input as { code: unknown }).code === "string" &&
      typeof (input as { message: unknown }).message === "string"
  );
}

function toDomainError(input: unknown): DomainError {
  if (isDomainError(input)) {
    return input;
  }
  return {
    code: "E_CHAIN_UNAVAILABLE",
    message: "contract gateway unavailable"
  };
}

function mapPhase(phase: Exclude<MatchPhase, "CardDrafted">, hasDraftedBoard: boolean): MatchPhase {
  if (phase === "LobbyReady" && hasDraftedBoard) {
    return "CardDrafted";
  }
  return phase;
}

function buildLineStats(boardSlots: BoardSlot[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  let completed = 0;
  let opportunity = 0;

  for (const line of lines) {
    const statuses = line.map((index) => boardSlots[index]?.status);
    const confirmedCount = statuses.filter((status) => status === "Confirmed").length;
    const openCount = statuses.filter((status) => status === "Idle" || status === "Pending").length;

    if (confirmedCount === 3) {
      completed += 1;
      continue;
    }

    if (confirmedCount === 2 && openCount === 1) {
      opportunity += 1;
    }
  }

  return { completed, opportunity };
}

const selectKillmailBingoViewState = (state: ReturnType<typeof useKillmailBingoStore.getState>) => {
  const confirmedCount = state.boardSlots.filter((slot) => slot.status === "Confirmed").length;
  const pendingCount = state.pendingEvents.length;
  const lineStats = buildLineStats(state.boardSlots);
  const weightedScore =
    state.boardSlots
      .filter((slot) => slot.status === "Confirmed")
      .reduce((sum, slot) => sum + slot.weight * 100, 0) +
    lineStats.completed * 32 +
    (confirmedCount === 9 ? 16 : 0);

  return {
    matchId: state.matchId,
    matchPhase: state.matchPhase,
    boardSlots: state.boardSlots,
    pendingCount,
    confirmedCount,
    rejectedCount: state.rejectedEvents.length,
    pendingEvents: state.pendingEvents,
    confirmedEvents: state.confirmedEvents,
    rejectedEvents: state.rejectedEvents,
    completedLineCount: lineStats.completed,
    opportunityLineCount: lineStats.opportunity,
    blackoutReady: confirmedCount === 9,
    weightedScore,
    settlement: state.settlement,
    settlementClaimedBy: state.settlementClaimedBy,
    riskFlag: state.riskFlag,
    riskScore: state.riskScore,
    reportEntries: state.reportEntries,
    lastSyncedAt: state.lastSyncedAt,
    lastError: state.errorLog.at(-1)
  };
};

export function useKillmailBingoViewState() {
  return useKillmailBingoStore(useShallow(selectKillmailBingoViewState));
}

export function useKillmailBingoService() {
  const store = useKillmailBingoStore();
  const gateway = useMemo(() => createKboContractGateway(), []);

  const syncFromContract = (snapshot: ContractMatchSnapshot) => {
    store.setMatchId(snapshot.matchId);
    store.setSettlement(snapshot.settlement);
    store.setSettlementClaimedBy(snapshot.claimedBy);
    store.setMatchPhase(mapPhase(snapshot.phase, store.boardSlots.length > 0));
    store.setLastSyncedAt(new Date().toISOString());
  };

  return useMemo(
    () => ({
      initializeMatch(entryFee = 80) {
        if (!Number.isFinite(entryFee) || entryFee <= 0) {
          const error: DomainError = {
            code: "E_INVALID_INPUT",
            message: "entryFee must be a finite number greater than 0"
          };
          store.logError(error.message);
          return { ok: false as const, error };
        }

        if (!canTransition(store.matchPhase, "CardDrafted") && store.matchPhase !== "LobbyReady") {
          const error: DomainError = {
            code: "E_INVALID_STATE_TRANSITION",
            message: `Cannot initialize from phase ${store.matchPhase}`
          };
          store.logError(error.message);
          return { ok: false as const, error };
        }

        try {
          const snapshot = gateway.createMatch({
            host: "host-demo",
            entryFeeLux: entryFee,
            players: DEFAULT_PLAYERS,
            platformFeeBps: DEFAULT_PLATFORM_FEE_BPS,
            hostRevshareBps: DEFAULT_HOST_REVSHARE_BPS
          });

          store.resetSessionForMatch(snapshot.matchId);
          store.setBoardSlots(generateCardSlots());
          store.setSettlement(snapshot.settlement);
          store.setMatchPhase("CardDrafted");
          store.setLastSyncedAt(new Date().toISOString());

          return { ok: true as const, settlementId: snapshot.settlement.settlementId };
        } catch (cause) {
          const error = toDomainError(cause);
          store.logError(error.message);
          return { ok: false as const, error };
        }
      },
      startMatch() {
        if (!canTransition(store.matchPhase, "MatchRunning")) {
          const error: DomainError = {
            code: "E_INVALID_STATE_TRANSITION",
            message: `Cannot start from phase ${store.matchPhase}`
          };
          store.logError(error.message);
          return { ok: false as const, error };
        }

        try {
          const snapshot = gateway.startMatch(store.matchId);
          syncFromContract(snapshot);
          return { ok: true as const };
        } catch (cause) {
          const error = toDomainError(cause);
          store.logError(error.message);
          return { ok: false as const, error };
        }
      },
      ingestKillmail(event: KillmailRef) {
        if (!event.killmailId.trim()) {
          const error: DomainError = {
            code: "E_INVALID_INPUT",
            message: "killmailId is required"
          };
          store.logError(error.message);
          return { ok: false as const, error };
        }

        const usedAt = store.usedKillmailIds[event.killmailId];
        if (usedAt) {
          const riskScore = calculateRiskScore({
            rejectedCount: store.rejectedEvents.length,
            duplicateAttempts: 1,
            pendingCount: store.pendingEvents.length
          });
          store.setRiskScore(riskScore);
          store.setRiskFlag(shouldFlagRisk(riskScore));

          const error: DomainError = {
            code: "E_DUPLICATE_KILLMAIL",
            message: `killmail already used in ${usedAt}`
          };
          store.logError(error.message);
          return { ok: false as const, error };
        }

        const slot = chooseNextSlot(store.boardSlots);
        if (!slot) {
          const error: DomainError = {
            code: "E_VERIFICATION_TIMEOUT",
            message: "no idle slot available"
          };
          store.logError(error.message);
          return { ok: false as const, error };
        }

        store.setSlotPending(slot.slotId, event);

        try {
          const shouldReject = event.killmailId.toLowerCase().includes("bad");
          if (shouldReject) {
            const snapshot = gateway.rejectKillmail(store.matchId);
            store.rejectEvent(slot.slotId, event);

            const riskScore = calculateRiskScore({
              rejectedCount: store.rejectedEvents.length + 1,
              duplicateAttempts: 0,
              pendingCount: store.pendingEvents.length
            });
            store.setRiskScore(riskScore);
            store.setRiskFlag(shouldFlagRisk(riskScore));
            syncFromContract(snapshot);

            return { ok: true as const, status: "Rejected" as const };
          }

          const snapshot = gateway.submitKillmail({
            matchId: store.matchId,
            slotId: parseSlotId(slot.slotId),
            killmailId: event.killmailId
          });

          store.markKillmailUsage(event.killmailId, slot.slotId);
          store.confirmEvent(slot.slotId, event);

          const riskScore = calculateRiskScore({
            rejectedCount: store.rejectedEvents.length,
            duplicateAttempts: 0,
            pendingCount: store.pendingEvents.length
          });
          store.setRiskScore(riskScore);
          store.setRiskFlag(shouldFlagRisk(riskScore));
          syncFromContract(snapshot);

          return {
            ok: true as const,
            status: "Confirmed" as const,
            trace: {
              killmailId: event.killmailId,
              slotId: slot.slotId,
              settlementId: snapshot.settlement.settlementId
            }
          };
        } catch (cause) {
          store.removePendingEvent(event.killmailId);
          const error = toDomainError(cause);
          store.logError(error.message);
          return { ok: false as const, error };
        }
      },
      refreshMatchState(): MatchSnapshot {
        const timestamp = new Date().toISOString();
        try {
          const snapshot = gateway.getMatchSnapshot(store.matchId);
          syncFromContract(snapshot);
          return {
            matchId: snapshot.matchId,
            phase: mapPhase(snapshot.phase, store.boardSlots.length > 0),
            lastSyncedAt: timestamp
          };
        } catch (cause) {
          const error = toDomainError(cause);
          if (error.code !== "E_MATCH_NOT_FOUND") {
            store.logError(error.message);
          }

          store.setLastSyncedAt(timestamp);
          return {
            matchId: store.matchId,
            phase: store.matchPhase,
            lastSyncedAt: timestamp
          };
        }
      },
      openGraceWindow() {
        if (!canTransition(store.matchPhase, "GraceWindow")) {
          const error: DomainError = {
            code: "E_INVALID_STATE_TRANSITION",
            message: `Cannot enter grace window from ${store.matchPhase}`
          };
          store.logError(error.message);
          return { ok: false as const, error };
        }

        try {
          const snapshot = gateway.openGraceWindow(store.matchId);
          syncFromContract(snapshot);
          return { ok: true as const };
        } catch (cause) {
          const error = toDomainError(cause);
          store.logError(error.message);
          return { ok: false as const, error };
        }
      },
      finalizeSettlement() {
        if (!canTransition(store.matchPhase, "Settled")) {
          const error: DomainError = {
            code: "E_SETTLEMENT_REPLAY",
            message: `Settlement unavailable from phase ${store.matchPhase}`
          };
          store.logError(error.message);
          return { ok: false as const, error };
        }

        const suspicious = shouldFlagRisk(store.riskScore) || store.rejectedEvents.length > 0;
        store.setRiskFlag(suspicious);

        const lineBonus = store.confirmedEvents.length >= 3 ? 32 : 0;
        const blackoutBonus = store.confirmedEvents.length >= 9 ? 16 : 0;

        try {
          if (suspicious) {
            gateway.applyRiskPenalty(store.matchId);
          }
          const snapshot = gateway.settleMatch({
            matchId: store.matchId,
            lineBonus,
            blackoutBonus
          });

          syncFromContract(snapshot);
          return { ok: true as const, settlement: snapshot.settlement };
        } catch (cause) {
          const error = toDomainError(cause);
          store.logError(error.message);
          return { ok: false as const, error };
        }
      },
      claimSettlement(pilotId: string) {
        if (store.matchPhase !== "Settled") {
          const error: DomainError = {
            code: "E_INVALID_STATE_TRANSITION",
            message: "settlement is not ready"
          };
          store.logError(error.message);
          return { ok: false as const, error };
        }

        if (!pilotId.trim()) {
          const error: DomainError = {
            code: "E_PERMISSION_DENIED",
            message: "pilotId is required"
          };
          store.logError(error.message);
          return { ok: false as const, error };
        }

        try {
          const claim = gateway.claimSettlement({
            matchId: store.matchId,
            pilotId
          });

          syncFromContract(claim.snapshot);
          store.addReportEntry({
            killmailId: "SETTLEMENT_CLAIM",
            slotId: "SETTLED",
            status: "Confirmed",
            settlementId: claim.settlementId
          });

          return {
            ok: true as const,
            payout: claim.payout,
            settlementId: claim.settlementId
          };
        } catch (cause) {
          const error = toDomainError(cause);
          store.logError(error.message);
          return { ok: false as const, error };
        }
      }
    }),
    [gateway, store]
  );
}
