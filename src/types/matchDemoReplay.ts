import type { MatchStatus } from "@/types/fuelMission";

export type MatchPresentationMode = "demo-replay" | "live";
export type DemoReplayTeamCode = "A" | "B" | "C" | "D";
export type DemoReplayFeedKind = "score" | "system" | "panic";
export type DemoReplayUrgencyLabel = "SAFE" | "WARN" | "CRITICAL";
export type DemoReplayStatus = Extract<MatchStatus, "running" | "panic" | "settling">;

export interface DemoReplayTeamConfig {
  teamId: string;
  teamCode: DemoReplayTeamCode;
  teamName: string;
  unitTag: string;
  callsign: string;
  specialty: string;
  mascotSrc: string;
  accentColor: string;
  startScore: number;
}

export interface DemoReplayNodeConfig {
  nodeId: string;
  name: string;
  initialFillRatio: number;
}

export interface DemoReplayFeedBurst {
  id: string;
  atSec: number;
  teamId: string | null;
  message: string;
  summary: string;
  kind: DemoReplayFeedKind;
  scoreDelta?: number;
}

export interface DemoReplaySegment {
  startSec: number;
  endSec: number;
  scoreTargets: Record<string, number>;
  nodeTargets: Array<{
    nodeId: string;
    fillRatio: number;
  }>;
  feedBursts: DemoReplayFeedBurst[];
}

export interface DemoReplayScenario {
  id: string;
  label: string;
  roomId: string;
  loopSec: number;
  settleHoldSec: number;
  teams: DemoReplayTeamConfig[];
  nodes: DemoReplayNodeConfig[];
  segments: DemoReplaySegment[];
}

export interface DemoReplayFrameTeam extends DemoReplayTeamConfig {
  score: number;
  rank: number;
  lastAction: string;
}

export interface DemoReplayOutcomeTeam extends DemoReplayTeamConfig {
  finalScore: number;
  finalRank: number;
}

export interface DemoReplayFrameNode {
  nodeId: string;
  name: string;
  fillRatio: number;
  urgencyLabel: DemoReplayUrgencyLabel;
}

export interface DemoReplayFrame {
  status: DemoReplayStatus;
  remainingSec: number;
  isPanic: boolean;
  roomId: string;
  simulationLabel: string;
  teams: DemoReplayFrameTeam[];
  targetNodes: DemoReplayFrameNode[];
  feed: DemoReplayFeedBurst[];
}
