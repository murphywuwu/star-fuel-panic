"use client";

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { scoreStore, selectLiveScore, selectMyScore, selectRecentEvents } from "@/model/scoreStore";
import { fuelMissionStore } from "@/model/fuelMissionStore";
import { matchService } from "@/service/matchService";

export function useMatchController() {
  const missionState = useSyncExternalStore(
    fuelMissionStore.subscribe,
    fuelMissionStore.getState,
    fuelMissionStore.getState
  );
  const scoreState = useSyncExternalStore(
    scoreStore.subscribe,
    scoreStore.getState,
    scoreStore.getState
  );

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const activeMatchIdRef = useRef<string | null>(null);

  const startWatching = useCallback((matchId: string) => {
    if (!matchId) {
      return;
    }

    if (unsubscribeRef.current && activeMatchIdRef.current === matchId) {
      return;
    }

    unsubscribeRef.current?.();
    activeMatchIdRef.current = matchId;

    const stop = matchService.subscribeMatchStream(matchId, {
      onStatusChange: () => {},
      onScoreUpdate: (board) => scoreStore.getState().setScoreBoard(board),
      onScoreEvent: (event) => scoreStore.getState().appendEvent(event),
      onPanicMode: () => {},
      onSettlementStart: () => {},
      onFilterRejected: (audit) => scoreStore.getState().appendRejection(audit)
    });

    unsubscribeRef.current = stop;
  }, []);

  const stopWatching = useCallback(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    activeMatchIdRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  const activeWallet = missionState.contributions[0]?.playerId ?? null;
  const myScore = useMemo(
    () => (activeWallet ? selectMyScore(scoreState, activeWallet) : null),
    [activeWallet, scoreState]
  );

  return {
    status: missionState.status,
    remainingSec: missionState.remainingSec,
    isPanic: missionState.isPanic,
    scoreBoard: scoreState.scoreBoard,
    liveTeamScores: selectLiveScore(scoreState),
    eventFeed: selectRecentEvents(scoreState, 20),
    rejectionFeed: scoreState.rejectionFeed.slice(0, 20),
    myScore,
    startWatching,
    stopWatching
  };
}
