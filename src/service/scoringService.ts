import type { MemberScoreLine, ScoreBoard, ScoreEvent, TeamRole, TeamScoreLine, TeamState } from "@/types/fuelMission";
import type { FuelGrade } from "@/types/fuelGrade";
import type { ChallengeMode } from "@/types/match";
import { ALL_GRADES_BONUS } from "./chainSyncEngine";

export interface GradeCollectionMap {
  [memberWallet: string]: {
    collectedGrades: FuelGrade[];
    hasAllGrades: boolean;
  };
}

export interface ScoreBoardOptions {
  challengeMode?: ChallengeMode;
  gradeCollections?: GradeCollectionMap;
}

function resolveMemberRole(team: TeamState, walletAddress: string): TeamRole | "Unassigned" {
  const hit = Object.entries(team.roles).find(([, assignedWallet]) => assignedWallet === walletAddress);
  return (hit?.[0] as TeamRole | undefined) ?? "Unassigned";
}

function buildMemberScores(
  team: TeamState,
  events: ScoreEvent[],
  options?: ScoreBoardOptions
): MemberScoreLine[] {
  const teamEventRows = events.filter((event) => event.teamId === team.teamId);
  const memberTotals = new Map<string, number>();
  const nameMap = new Map<string, string>();

  for (const player of team.players) {
    memberTotals.set(player.playerId, 0);
    nameMap.set(player.playerId, player.name);
  }

  for (const event of teamEventRows) {
    memberTotals.set(event.memberWallet, (memberTotals.get(event.memberWallet) ?? 0) + event.score);
    nameMap.set(event.memberWallet, event.memberName);
  }

  // Apply all grades bonus for fuel grade challenge mode
  if (options?.challengeMode === "fuel_grade_challenge" && options.gradeCollections) {
    for (const [wallet, baseScore] of memberTotals) {
      const collection = options.gradeCollections[wallet];
      if (collection?.hasAllGrades) {
        memberTotals.set(wallet, Number((baseScore * ALL_GRADES_BONUS).toFixed(2)));
      }
    }
  }

  const totalScore = [...memberTotals.values()].reduce((sum, value) => sum + value, 0);

  return [...memberTotals.entries()]
    .map(([walletAddress, personalScore]) => ({
      walletAddress,
      name: nameMap.get(walletAddress) ?? walletAddress,
      role: resolveMemberRole(team, walletAddress),
      personalScore,
      contributionRatio: totalScore > 0 ? Number((personalScore / totalScore).toFixed(4)) : 0
    }))
    .sort((a, b) => b.personalScore - a.personalScore);
}

export const scoringService = {
  buildScoreBoard(
    matchId: string,
    teams: TeamState[],
    events: ScoreEvent[],
    options?: ScoreBoardOptions
  ): ScoreBoard {
    const teamRows: TeamScoreLine[] = teams.map((team) => {
      const members = buildMemberScores(team, events, options);
      const totalScore = members.reduce((sum, member) => sum + member.personalScore, 0);

      return {
        teamId: team.teamId,
        teamName: team.name,
        totalScore,
        members
      };
    });

    teamRows.sort((a, b) => b.totalScore - a.totalScore);

    return {
      matchId,
      teams: teamRows,
      lastUpdated: Date.now()
    };
  }
};
