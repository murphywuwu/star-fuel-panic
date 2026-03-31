"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { matchService } from "@/service/matchService";
import { matchStreamService, type MatchStreamHealth } from "@/service/matchStreamService";
import type { FuelDepositEvent, MatchScoreboardSnapshot, MatchStreamEvent } from "@/types/match";
import type { MemberScoreLine, ScoreBoard, ScoreEvent } from "@/types/fuelMission";

function buildStreamScoreEvent(matchId: string, fuelDeposit: FuelDepositEvent): ScoreEvent {
  return {
    id: `${fuelDeposit.txDigest}:${fuelDeposit.timestamp}`,
    matchId,
    teamId: fuelDeposit.teamId,
    memberWallet: fuelDeposit.sender,
    memberName: fuelDeposit.sender,
    txDigest: fuelDeposit.txDigest,
    assemblyId: fuelDeposit.nodeId,
    oldQuantity: 0,
    newQuantity: fuelDeposit.fuelAdded,
    maxCapacity: 1,
    fuelDelta: fuelDeposit.fuelAdded,
    fuelTypeId: fuelDeposit.fuelTypeId,
    fuelGrade: fuelDeposit.fuelGrade,
    fillRatioAt: 0,
    urgencyWeight: fuelDeposit.urgencyWeight,
    panicMultiplier: fuelDeposit.panicMultiplier,
    fuelGradeBonus: fuelDeposit.fuelGrade.bonus,
    primaryGradeMultiplier: 1.0,
    score: fuelDeposit.scoreDelta,
    chainTs: Date.parse(fuelDeposit.timestamp) || Date.now(),
    createdAt: Date.parse(fuelDeposit.timestamp) || Date.now()
  };
}

function mergeMatchScoreboard(
  scoreboard: MatchScoreboardSnapshot,
  previous: ScoreBoard | null
): ScoreBoard {
  const previousMembers = new Map<string, MemberScoreLine[]>(
    (previous?.teams ?? []).map((team) => [team.teamId, team.members])
  );

  return {
    matchId: scoreboard.matchId,
    lastUpdated: Date.parse(scoreboard.updatedAt) || Date.now(),
    teams: scoreboard.teams.map((team) => ({
      teamId: team.teamId,
      teamName: team.teamName,
      totalScore: team.score,
      members: previousMembers.get(team.teamId) ?? []
    }))
  };
}

export function useMatchController() {
  const matchState = useSyncExternalStore(
    matchService.subscribeMatchRuntime,
    matchService.getMatchRuntimeSnapshot,
    matchService.getMatchRuntimeSnapshot
  );
  const scoreState = useSyncExternalStore(
    matchService.subscribeScore,
    matchService.getScoreSnapshot,
    matchService.getScoreSnapshot
  );

  const legacyUnsubscribeRef = useRef<(() => void) | null>(null);
  const publicStreamUnsubscribeRef = useRef<(() => void) | null>(null);
  const activeMatchIdRef = useRef<string | null>(null);
  const seenFuelDepositsRef = useRef<Set<string>>(new Set());
  const [streamHealth, setStreamHealth] = useState<MatchStreamHealth>("disconnected");
  const [matchScoreboard, setMatchScoreboard] = useState<MatchScoreboardSnapshot | null>(null);

  const applyScoreboard = useCallback((scoreboard: MatchScoreboardSnapshot) => {
    setMatchScoreboard(scoreboard);
    const snapshot = matchService.getScoreSnapshot();
    snapshot.setScoreBoard(mergeMatchScoreboard(scoreboard, snapshot.scoreBoard));
  }, []);

  const handleStreamEvent = useCallback(
    (event: MatchStreamEvent) => {
      matchService.getMatchRuntimeSnapshot().applyStreamEvent(event);

      if (event.type === "score_update") {
        applyScoreboard(event.scoreboard);
        if (event.fuelDeposit) {
          const key = `${event.fuelDeposit.txDigest}:${event.fuelDeposit.timestamp}`;
          if (!seenFuelDepositsRef.current.has(key)) {
            seenFuelDepositsRef.current.add(key);
            matchService.getScoreSnapshot().appendEvent(buildStreamScoreEvent(event.matchId, event.fuelDeposit));
          }
        }
        return;
      }

      if (event.type === "node_status") {
        setMatchScoreboard((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            targetNodes: event.targetNodes
          };
        });
      }
    },
    [applyScoreboard]
  );

  const startWatching = useCallback(
    (matchId: string) => {
      if (!matchId) {
        return;
      }

      if (legacyUnsubscribeRef.current && activeMatchIdRef.current === matchId) {
        return;
      }

      publicStreamUnsubscribeRef.current?.();
      publicStreamUnsubscribeRef.current = null;
      legacyUnsubscribeRef.current?.();
      legacyUnsubscribeRef.current = null;
      activeMatchIdRef.current = matchId;
      seenFuelDepositsRef.current.clear();
      setMatchScoreboard(null);
      setStreamHealth("connecting");

      legacyUnsubscribeRef.current = matchService.subscribeMatchStream(matchId, {
        onStatusChange: () => {},
        onRemainingChange: () => {},
        onScoreUpdate: (board) => matchService.getScoreSnapshot().setScoreBoard(board),
        onScoreEvent: (event) => matchService.getScoreSnapshot().appendEvent(event),
        onPanicMode: () => {},
        onSettlementStart: () => {},
        onFilterRejected: (audit) => matchService.getScoreSnapshot().appendRejection(audit)
      });

      void matchStreamService
        .getScoreboard(matchId)
        .then((scoreboard) => {
          if (activeMatchIdRef.current !== matchId) {
            return;
          }
          applyScoreboard(scoreboard);
        })
        .catch(() => {
          if (activeMatchIdRef.current === matchId) {
            setStreamHealth("stale");
          }
        });

      void matchStreamService
        .subscribe(matchId, handleStreamEvent, setStreamHealth)
        .then((stopPublicStream) => {
          if (activeMatchIdRef.current !== matchId) {
            stopPublicStream();
            return;
          }
          publicStreamUnsubscribeRef.current = stopPublicStream;
        })
        .catch(() => {
          if (activeMatchIdRef.current === matchId) {
            setStreamHealth("disconnected");
          }
        });
    },
    [applyScoreboard, handleStreamEvent]
  );

  const stopWatching = useCallback(() => {
    publicStreamUnsubscribeRef.current?.();
    publicStreamUnsubscribeRef.current = null;
    legacyUnsubscribeRef.current?.();
    legacyUnsubscribeRef.current = null;
    activeMatchIdRef.current = null;
    seenFuelDepositsRef.current.clear();
    setMatchScoreboard(null);
    setStreamHealth("disconnected");
  }, []);

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  const activeWallet = matchState.contributions[0]?.playerId ?? null;
  const myScore = useMemo(
    () => {
      if (!activeWallet || !scoreState.scoreBoard) {
        return null;
      }

      for (const team of scoreState.scoreBoard.teams) {
        const member = team.members.find((item) => item.walletAddress === activeWallet);
        if (member) {
          return member;
        }
      }

      return null;
    },
    [activeWallet, scoreState]
  );

  return {
    status: matchState.status,
    remainingSec: matchState.remainingSec,
    isPanic: matchState.isPanic,
    scoreBoard: scoreState.scoreBoard,
    matchScoreboard,
    streamHealth,
    liveTeamScores: scoreState.scoreBoard?.teams ?? [],
    eventFeed: scoreState.eventFeed.slice(0, 20),
    rejectionFeed: scoreState.rejectionFeed.slice(0, 20),
    myScore,
    startWatching,
    stopWatching
  };
}
