import { useMemo } from "react";
import type { PlayerContribution, TeamState } from "@/types/fuelMission";
import { TacticalPanel } from "@/view/components/TacticalPanel";

interface ContributionBoardProps {
  contributions: PlayerContribution[];
  teams: TeamState[];
  teamScore: Record<string, number>;
}

function teamLabel(teamId: string) {
  return teamId === "team-alpha" ? "Team Alpha" : "Team Beta";
}

export function ContributionBoard({ contributions, teams, teamScore }: ContributionBoardProps) {
  const ranked = useMemo(() => [...contributions].sort((a, b) => b.score - a.score).slice(0, 3), [contributions]);

  const teamRows = useMemo(
    () =>
      teams.map((team) => ({
        teamId: team.teamId,
        name: team.name || teamLabel(team.teamId),
        score: teamScore[team.teamId] ?? 0
      })),
    [teamScore, teams]
  );

  return (
    <TacticalPanel title="Contribution Board" eyebrow="Top 3">
      <ul className="space-y-2 text-xs text-eve-offwhite/90">
        {ranked.length === 0 ? <li>NO CONTRIBUTION DATA</li> : null}
        {ranked.map((player, index) => (
          <li key={player.playerId} className="flex items-center justify-between border border-eve-yellow/30 bg-eve-black/70 px-3 py-2">
            <span className="font-mono uppercase tracking-[0.12em]">
              #{index + 1} {player.name}
            </span>
            <span className="font-mono text-eve-yellow">{player.score}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 border border-eve-yellow/30 bg-eve-black/70 px-3 py-3 text-xs">
        <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">Team Score</p>
        <ul className="mt-2 space-y-1 text-eve-offwhite/85">
          {teamRows.length === 0 ? <li>NO TEAMS JOINED</li> : null}
          {teamRows.map((row) => (
            <li key={row.teamId} className="flex items-center justify-between">
              <span>{row.name}</span>
              <span className="font-mono">{row.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </TacticalPanel>
  );
}
