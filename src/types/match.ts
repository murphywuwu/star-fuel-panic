import type { UrgencyLevel } from "../types/mission.ts";
import type { FuelGradeInfo } from "../types/fuelGrade.ts";
import type { SettlementBill } from "../types/settlement.ts";
import type { Team, TeamMember } from "../types/team.ts";

export type MatchStatus = "draft" | "lobby" | "prestart" | "running" | "panic" | "settling" | "settled";

export type TriggerMode = "dynamic" | "min_threshold";

export type MatchCreationMode = "free" | "precision";

export type ScoringMode = "weighted" | "volume";

export type ChallengeMode = "normal" | "fuel_grade_challenge";

export type PrimaryFuelGrade = "standard" | "premium" | "refined";

export type Match = {
  id: string;
  onChainId: string | null;
  escrowId?: string | null;
  status: MatchStatus;
  creationMode: MatchCreationMode;
  solarSystemId?: number;
  targetNodeIds: string[];
  urgency?: UrgencyLevel;
  prizePool: number;
  hostPrizePool: number;
  entryFee: number;
  platformSubsidy?: number;
  minTeams: number;
  maxTeams: number;
  minPlayers?: number;
  registeredTeams?: number;
  paidTeams?: number;
  startThresholdText?: string;
  durationMinutes: number;
  scoringMode: ScoringMode;
  challengeMode: ChallengeMode;
  primaryFuelGrade?: PrimaryFuelGrade;
  triggerMode: TriggerMode;
  triggerNodeId?: string;
  triggerNodeName?: string;
  startedAt: string | null;
  endedAt: string | null;
  createdBy: string;
  hostAddress: string | null;
  sponsorshipFee?: number;
  publishedAt?: string | null;
  publishIdempotencyKey?: string | null;
  createdAt: string;
};

export type MatchSortBy = "prize_pool" | "urgency" | "created_at";

export type MatchFilters = {
  status?: MatchStatus;
  sortBy?: MatchSortBy;
  limit?: number;
  creationMode?: MatchCreationMode;
};

export type MatchScoreboardSnapshot = {
  matchId: string;
  status: MatchStatus;
  remainingSeconds: number;
  panicMode: boolean;
  teams: Array<{
    teamId: string;
    teamName: string;
    score: number;
    rank: number;
  }>;
  targetNodes: Array<{
    objectId: string;
    name: string;
    fillRatio: number;
    urgency: "critical" | "warning" | "safe";
    isOnline: boolean;
  }>;
  updatedAt: string;
};

export type FuelDepositEvent = {
  txDigest: string;
  sender: string;
  teamId: string;
  nodeId: string;
  nodeName: string;
  fuelAdded: number;
  fuelTypeId: number;
  fuelGrade: FuelGradeInfo;
  urgencyWeight: number;
  panicMultiplier: number;
  scoreDelta: number;
  timestamp: string;
};

export type MatchStreamEvent =
  | {
      type: "score_update";
      matchId: string;
      scoreboard: MatchScoreboardSnapshot;
      fuelDeposit?: FuelDepositEvent;
    }
  | {
      type: "phase_change" | "panic_mode";
      matchId: string;
      status: {
        status: MatchStatus;
        remainingSeconds: number;
        panicMode: boolean;
        serverTime: string;
      };
    }
  | {
      type: "node_status";
      matchId: string;
      targetNodes: MatchScoreboardSnapshot["targetNodes"];
    }
  | {
      type: "settlement_start";
      matchId: string;
      progress: number;
    }
  | {
      type: "settlement_complete";
      matchId: string;
      result: SettlementBill;
    }
  | {
      type: "heartbeat";
      matchId: string;
      serverTime: string;
    };

export type MatchDiscoveryMode = "free" | "precision";

export type MatchTargetNodeSnapshot = {
  objectId: string;
  name: string;
  fillRatio: number;
  urgency: UrgencyLevel;
  isOnline: boolean;
};

export type MatchDiscoveryItem = {
  id: string;
  mode: MatchDiscoveryMode;
  modeLabel: string;
  name: string;
  status: MatchStatus;
  targetSolarSystem: {
    systemId: number;
    systemName: string;
    constellationId: number;
    constellationName: string;
  };
  targetNodeCount: number;
  targetNodeSummary: string;
  grossPool: number;
  entryFee: number;
  sponsorshipFee: number;
  platformFeeRate: number;
  teamProgress: {
    registeredTeams: number;
    maxTeams: number;
  };
  durationHours: number;
  distanceHops: number | null;
  distanceHint: string;
  createdAt: string;
};

export type MatchDiscoveryDetail = {
  match: MatchDiscoveryItem & {
    targetNodes: MatchTargetNodeSnapshot[];
  };
  teams: Team[];
  members: TeamMember[];
};
