export type UrgencyLevel = "critical" | "warning" | "safe";

export type MissionStatus = "open" | "in_progress" | "settled" | "expired";

export type StartRuleMode = "full_paid" | "min_team_force_start";

export type Mission = {
  id: string;
  assemblyId: string;
  nodeName: string;
  fillRatio: number; // 0.0 ~ 1.0
  urgency: UrgencyLevel;
  prizePool: number; // LUX
  entryFee: number; // LUX per person
  minTeams: number;
  maxTeams: number;
  minPlayers: number;
  registeredTeams: number;
  paidTeams: number;
  participatingTeams: string[];
  countdownSec: number | null;
  startRuleMode: StartRuleMode;
  forceStartSec: number;
  status: MissionStatus;
  createdAt: string;
};

export type MissionSortBy = "urgency" | "prize_pool" | "created_at" | "weighted";

export type MissionFilters = {
  sortBy?: MissionSortBy;
  urgency?: UrgencyLevel;
  status?: MissionStatus;
  limit?: number;
};

export type MissionTeamRuleSummary = {
  teamScaleText: string;
  teamProgressText: string;
  startThresholdText: string;
};
