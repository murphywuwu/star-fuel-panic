import type { Mission, MissionTeamRuleSummary } from "@/types/mission";

type TeamRuleSummaryInput = {
  minTeams: number;
  maxTeams: number;
  registeredTeams: number;
  paidTeams: number;
  minPlayers: number;
  startRuleMode: Mission["startRuleMode"];
  forceStartSec: number;
};

export function formatLux(value: number) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)} LUX`;
}

export function formatCountdown(countdownSec: number | null) {
  if (countdownSec === null) {
    return "WAITING FOR START";
  }

  const clamped = Math.max(0, countdownSec);
  const minutes = Math.floor(clamped / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(clamped % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function urgencyLabel(urgency: Mission["urgency"]) {
  if (urgency === "critical") {
    return "CRITICAL";
  }
  if (urgency === "warning") {
    return "WARNING";
  }
  return "SAFE";
}

export function urgencyColorClass(urgency: Mission["urgency"]) {
  if (urgency === "critical") {
    return "text-eve-red";
  }
  if (urgency === "warning") {
    return "text-eve-yellow";
  }
  return "text-emerald-400";
}

export function buildTeamRuleSummary(input: TeamRuleSummaryInput): MissionTeamRuleSummary {
  const teamScaleText = `MIN ${input.minTeams} TEAMS / MAX ${input.maxTeams} TEAMS`;
  const teamProgressText = `REGISTERED ${input.registeredTeams}/${input.maxTeams} (PAID ${input.paidTeams})`;

  if (input.startRuleMode === "full_paid") {
    return {
      teamScaleText,
      teamProgressText,
      startThresholdText: `STARTS WHEN ${input.maxTeams} TEAMS ARE FULLY PAID`
    };
  }

  const forceStartMin = Math.max(1, Math.round(input.forceStartSec / 60));
  return {
    teamScaleText,
    teamProgressText,
    startThresholdText: `IF NOT FULL, AT LEAST ${input.minTeams} TEAMS WITH ${input.minPlayers} PLAYERS EACH FORCE START IN ${forceStartMin} MIN`
  };
}

export function buildMissionTeamRuleSummary(mission: Mission): MissionTeamRuleSummary {
  return buildTeamRuleSummary({
    minTeams: mission.minTeams,
    maxTeams: mission.maxTeams,
    registeredTeams: mission.registeredTeams,
    paidTeams: mission.paidTeams,
    minPlayers: mission.minPlayers,
    startRuleMode: mission.startRuleMode,
    forceStartSec: mission.forceStartSec
  });
}
