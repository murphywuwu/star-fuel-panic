import type { SettlementBill } from "@/types/settlement";

export type SettlementPresentationMode = "demo-report" | "live";
export type SettlementDemoPhase = "settling" | "report";
export type SettlementDemoTimelineKind = "status" | "award" | "chain";

export interface SettlementDemoTeamCard {
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

export interface SettlementDemoTimelineEntry {
  id: string;
  atSec: number;
  message: string;
  kind: SettlementDemoTimelineKind;
}

export interface SettlementDemoHero {
  championTeamId: string;
  championTeamName: string;
  championPrizeAmount: string;
  myPayoutAmount: string;
  myPilotName: string;
  mvpPilotName: string;
  mvpRole: string;
  mvpScore: number;
  payoutTxDigest: string;
}

export interface SettlementDemoFrame {
  phase: SettlementDemoPhase;
  roomId: string;
  remainingSec: number;
  progress: number;
  simulationLabel: string;
  statusTitle: string;
  statusNote: string;
  hero: SettlementDemoHero;
  bill: SettlementBill;
  teams: SettlementDemoTeamCard[];
  honorTags: string[];
  timeline: SettlementDemoTimelineEntry[];
}

export interface SettlementDemoScenario {
  id: string;
  label: string;
  roomId: string;
  loopSec: number;
  reportStartSec: number;
  bill: SettlementBill;
  teams: SettlementDemoTeamCard[];
  hero: SettlementDemoHero;
  honorTags: string[];
  timeline: SettlementDemoTimelineEntry[];
}
