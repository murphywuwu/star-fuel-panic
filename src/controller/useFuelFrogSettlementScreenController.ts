"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthController, walletErrorMessage } from "@/controller/useAuthController";
import { useFuelMissionController } from "@/controller/useFuelMissionController";
import { useSettlementController } from "@/controller/useSettlementController";
import { useSettlementDemoController } from "@/controller/useSettlementDemoController";
import { formatPaymentTokenAmount } from "@/utils/paymentToken";
import type { MissionPhase } from "@/types/fuelMission";
import type { SettlementBill, TeamPayout } from "@/types/settlement";
import type { SettlementPresentationMode } from "@/types/settlementDemo";

interface SettlementTeamView {
  teamId: string;
  teamCode: string;
  unitTag: string;
  teamName: string;
  callsign: string;
  mascotSrc: string;
  accentColor: string;
  rank: number;
  totalScore: number;
  prizeRatio: number;
  prizeAmount: string;
  isPlayerTeam: boolean;
}

interface SettlementHeroView {
  championTeamName: string;
  championPrizeAmount: string;
  myPayoutAmount: string;
  myPilotName: string;
  mvpPilotName: string;
  mvpRole: string;
  mvpScore: number;
  payoutTxDigest: string;
}

interface SettlementTimelineView {
  id: string;
  kind: "status" | "award" | "chain" | "warning";
  message: string;
  timeLabel: string;
}

const TEAM_SKINS = [
  {
    teamCode: "A",
    unitTag: "A-01",
    callsign: "BASTION WING",
    mascotSrc: "/mascot-shield.png",
    accentColor: "#E5B32B"
  },
  {
    teamCode: "B",
    unitTag: "B-07",
    callsign: "VECTOR SWARM",
    mascotSrc: "/mascot-thinking.png",
    accentColor: "#E0E0E0"
  },
  {
    teamCode: "C",
    unitTag: "C-13",
    callsign: "BURN RIG",
    mascotSrc: "/mascot-working.png",
    accentColor: "#CC3300"
  },
  {
    teamCode: "D",
    unitTag: "D-02",
    callsign: "LINK ARRAY",
    mascotSrc: "/mascot-writing.png",
    accentColor: "#A69A72"
  }
] as const;

function money(value: string | number) {
  return formatPaymentTokenAmount(value, { maximumFractionDigits: 2 });
}

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatDemoTime(seconds: number) {
  return `${Math.max(0, Math.floor(seconds)).toString().padStart(2, "0")}s`;
}

function truncateWallet(wallet: string) {
  if (wallet.length <= 10) {
    return wallet;
  }
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

function buildLiveTeams(
  bill: SettlementBill | null,
  currentWalletAddress: string | null
): SettlementTeamView[] {
  if (!bill) {
    return [];
  }

  const rankedTeams = [...bill.teamBreakdown].sort((left, right) => left.rank - right.rank);
  return rankedTeams.map((team, index) => {
    const skin = TEAM_SKINS[index % TEAM_SKINS.length];
    return {
      teamId: team.teamId,
      teamCode: skin.teamCode,
      unitTag: skin.unitTag,
      teamName: team.teamName,
      callsign: skin.callsign,
      mascotSrc: skin.mascotSrc,
      accentColor: skin.accentColor,
      rank: team.rank,
      totalScore: team.totalScore,
      prizeRatio: team.prizeRatio,
      prizeAmount: team.prizeAmount,
      isPlayerTeam: currentWalletAddress
        ? team.members.some((member) => member.walletAddress === currentWalletAddress)
        : false
    };
  });
}

function buildLiveHero(
  bill: SettlementBill | null,
  myPayoutAmount: string,
  myPilotName: string
): SettlementHeroView {
  const champion = [...(bill?.teamBreakdown ?? [])].sort((left, right) => left.rank - right.rank)[0] ?? null;
  const mvp = bill?.mvp ?? null;

  return {
    championTeamName: champion?.teamName ?? "AWAITING REPORT",
    championPrizeAmount: champion?.prizeAmount ?? "0",
    myPayoutAmount,
    myPilotName,
    mvpPilotName: mvp?.walletAddress ? truncateWallet(mvp.walletAddress) : "NO MVP",
    mvpRole: (mvp?.role ?? "dispatcher").toUpperCase(),
    mvpScore: mvp?.score ?? 0,
    payoutTxDigest: bill?.payoutTxDigest ?? "PENDING"
  };
}

function buildLiveTimeline(
  loading: boolean,
  error: string | null,
  bill: SettlementBill | null
): SettlementTimelineView[] {
  const entries: SettlementTimelineView[] = [];

  if (loading) {
    entries.push({
      id: "live-loading",
      kind: "status",
      message: "LOADING LIVE SETTLEMENT STATUS...",
      timeLabel: "LIVE"
    });
  }

  if (bill?.payoutTxDigest) {
    entries.push({
      id: "live-trace",
      kind: "chain",
      message: `PAYOUT TRACE // ${bill.payoutTxDigest}`,
      timeLabel: "LIVE"
    });
  }

  if (bill?.mvp) {
    entries.push({
      id: "live-mvp",
      kind: "award",
      message: `MVP // ${truncateWallet(bill.mvp.walletAddress)} // ${bill.mvp.score} pts`,
      timeLabel: "LIVE"
    });
  }

  if (error) {
    entries.push({
      id: "live-error",
      kind: "warning",
      message: `SETTLEMENT ERROR // ${error}`,
      timeLabel: "LIVE"
    });
  }

  if (entries.length === 0) {
    entries.push({
      id: "live-pending",
      kind: "status",
      message: "AWAITING LIVE SETTLEMENT BILL",
      timeLabel: "LIVE"
    });
  }

  return entries;
}

export function useFuelFrogSettlementScreenController() {
  const mission = useFuelMissionController();
  const auth = useAuthController();
  const {
    status: liveSettlementStatus,
    bill: liveSettlementBill,
    loading: liveSettlementLoading,
    error: liveSettlementError,
    myPayout: liveMyPayout,
    mvp: liveMvp,
    loadStatus: loadLiveSettlementStatus,
    loadBill: loadLiveSettlementBill
  } = useSettlementController();
  const demo = useSettlementDemoController(true);
  const [presentationMode, setPresentationMode] = useState<SettlementPresentationMode>("demo-report");
  const [message, setMessage] = useState("READY // CONNECT WALLET TO CLAIM & FINALIZE");

  const matchId = mission.state.room?.roomId ?? demo.state.frame.roomId ?? "match-local";

  useEffect(() => {
    if (presentationMode !== "live") {
      return;
    }

    void loadLiveSettlementStatus(matchId);
    void loadLiveSettlementBill(matchId);
  }, [loadLiveSettlementBill, loadLiveSettlementStatus, matchId, presentationMode]);

  const isDemoMode = presentationMode === "demo-report";

  const liveMyPayoutAmount = liveMyPayout?.prizeAmount ?? "0";
  const liveMyPilotName = auth.state.walletAddress
    ? truncateWallet(auth.state.walletAddress)
    : mission.state.contributions[0]?.name ?? "Pilot Alpha";

  const liveBill = liveSettlementBill;
  const liveTeams = useMemo(
    () => buildLiveTeams(liveBill, auth.state.walletAddress),
    [auth.state.walletAddress, liveBill]
  );
  const liveHero = useMemo(
    () => buildLiveHero(liveBill, liveMyPayoutAmount, liveMyPilotName),
    [liveBill, liveMyPayoutAmount, liveMyPilotName]
  );
  const liveTimeline = useMemo(
    () => buildLiveTimeline(liveSettlementLoading, liveSettlementError, liveBill),
    [liveBill, liveSettlementError, liveSettlementLoading]
  );

  const shellPhase: MissionPhase = isDemoMode
    ? demo.state.frame.phase === "settling"
      ? "settling"
      : "settled"
    : liveSettlementStatus?.status === "running"
      ? "settling"
      : "settled";
  const reportReady = isDemoMode ? demo.state.frame.phase === "report" : liveSettlementStatus?.status === "succeeded" || Boolean(liveBill);
  const countdownSec = isDemoMode ? demo.state.frame.remainingSec : mission.state.countdownSec;
  const roomId = isDemoMode ? demo.state.frame.roomId : mission.state.room?.roomId ?? matchId;

  const bannerMessage = !isDemoMode && !auth.state.isConnected
    ? "BROWSE MODE // CONNECT WALLET TO FINALIZE OR CLAIM REWARDS"
    : undefined;

  const currentBill = isDemoMode ? demo.state.frame.bill : liveBill;
  const hero = isDemoMode ? demo.state.frame.hero : liveHero;
  const teamCards = isDemoMode ? demo.state.frame.teams : liveTeams;
  const honorTags = isDemoMode ? demo.state.frame.honorTags : liveMvp ? [
    `MVP // ${truncateWallet(liveMvp.walletAddress)}`,
    `ROLE // ${liveMvp.role.toUpperCase()}`,
    `SCORE // ${liveMvp.score} pts`
  ] : ["LIVE REPORT // WAITING FOR HONORS"];
  const timeline = isDemoMode
    ? demo.state.frame.timeline.map((entry) => ({
        id: entry.id,
        kind: entry.kind,
        message: entry.message,
        timeLabel: formatDemoTime(entry.atSec)
      }))
    : liveTimeline;

  const handleSettle = () => {
    if (!auth.state.isConnected) {
      setMessage("WALLET NOT CONNECTED // SETTLEMENT ACTION LOCKED");
      return;
    }

    const result = mission.actions.onSettle();
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${walletErrorMessage(result.errorCode, result.message)}`);
      return;
    }

    setMessage(`SETTLEMENT READY // ${result.payload?.settlementId ?? "N/A"}`);
  };

  return {
    mission,
    auth,
    view: {
      presentationMode,
      isDemoMode,
      shellPhase,
      reportReady,
      countdownSec,
      roomId,
      staleSnapshot: mission.state.staleSnapshot,
      bannerMessage,
      simulationLabel: isDemoMode ? demo.state.frame.simulationLabel : null,
      progress: isDemoMode ? demo.state.frame.progress : liveSettlementStatus?.progress ?? 0,
      statusTitle: isDemoMode
        ? demo.state.frame.statusTitle
        : liveSettlementLoading
          ? "LOADING LIVE SETTLEMENT"
          : liveSettlementStatus?.status === "running"
            ? "LIVE SETTLING"
            : "LIVE REPORT",
      statusNote: isDemoMode
        ? demo.state.frame.statusNote
        : liveSettlementError
          ? `SETTLEMENT ERROR // ${liveSettlementError}`
          : liveSettlementStatus?.payoutTxDigest
            ? `PAYOUT TRACE // ${liveSettlementStatus.payoutTxDigest}`
            : "READING LIVE BILL AND SETTLEMENT STATUS",
      hero,
      bill: currentBill,
      teamCards,
      honorTags,
      timeline,
      isDemoPlaying: demo.state.isPlaying,
      liveLoading: liveSettlementLoading,
      liveError: liveSettlementError,
      message,
      money,
      percent
    },
    actions: {
      showDemoReport: () => setPresentationMode("demo-report"),
      showLiveReport: () => setPresentationMode("live"),
      toggleDemoPlayback: () => {
        if (demo.state.isPlaying) {
          demo.actions.pause();
          return;
        }
        demo.actions.play();
      },
      replayDemo: () => demo.actions.replay(),
      jumpToReport: () => demo.actions.jumpToReport(),
      handleSettle,
      showAuditLog: () => setMessage("AUDIT LOG AVAILABLE IN SETTLEMENT TRACE"),
      refreshLiveSettlement: async () => {
        const [statusResult, billResult] = await Promise.all([
          loadLiveSettlementStatus(matchId),
          loadLiveSettlementBill(matchId)
        ]);
        if (!statusResult.ok || !billResult.ok) {
          setMessage("LIVE SETTLEMENT REFRESH FAILED");
          return;
        }
        setMessage("LIVE SETTLEMENT REFRESHED");
      }
    }
  };
}
