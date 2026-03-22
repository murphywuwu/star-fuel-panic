import type { PlayerContribution, SettlementBill, TeamState } from "@/types/fuelMission";
import { TacticalPanel } from "@/view/components/TacticalPanel";

interface ScoreSummaryProps {
  contributions: PlayerContribution[];
  teams: TeamState[];
  teamScore: Record<string, number>;
}

interface BillTableProps {
  settlement: SettlementBill;
}

interface EarningsCardProps {
  pilotName: string;
  payoutAmount: number;
  settlementId?: string;
}

function money(value: number) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value)} LUX`;
}

export function ScoreSummary({ contributions, teams, teamScore }: ScoreSummaryProps) {
  const rankedPlayers = [...contributions].sort((a, b) => b.score - a.score).slice(0, 3);
  const rankedTeams = [...teams].sort((a, b) => (teamScore[b.teamId] ?? 0) - (teamScore[a.teamId] ?? 0));

  return (
    <TacticalPanel title="Score Summary" eyebrow="3s Result Read">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">Team Ranking</p>
          <ul className="mt-2 space-y-1 text-sm text-eve-offwhite/85">
            {rankedTeams.length === 0 ? <li>NO TEAM DATA</li> : null}
            {rankedTeams.map((team, index) => (
              <li key={team.teamId} className="flex items-center justify-between">
                <span>#{index + 1} {team.name}</span>
                <span className="font-mono">{teamScore[team.teamId] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">Top Contributors</p>
          <ul className="mt-2 space-y-1 text-sm text-eve-offwhite/85">
            {rankedPlayers.length === 0 ? <li>NO CONTRIBUTION DATA</li> : null}
            {rankedPlayers.map((player, index) => (
              <li key={player.playerId} className="flex items-center justify-between">
                <span>#{index + 1} {player.name}</span>
                <span className="font-mono">{player.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TacticalPanel>
  );
}

export function BillTable({ settlement }: BillTableProps) {
  const rows = [
    { label: "Player Buy-in Pool", value: settlement.playerBuyinPool },
    { label: "Gross Pool", value: settlement.grossPool },
    { label: "Platform Fee", value: settlement.platformFee },
    { label: "Host Fee", value: settlement.hostFee },
    { label: "Payout Pool", value: settlement.payoutPool }
  ];

  return (
    <TacticalPanel title="Bill Table" eyebrow="Gross -> Fee -> Payout">
      <div className="overflow-hidden border border-eve-yellow/35 bg-eve-black/75">
        <table className="w-full border-collapse text-left text-sm text-eve-offwhite/90">
          <thead className="bg-eve-grey/80 font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">
            <tr>
              <th className="border-b border-eve-yellow/30 px-3 py-2">Field</th>
              <th className="border-b border-eve-yellow/30 px-3 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="border-b border-eve-yellow/20 px-3 py-2">{row.label}</td>
                <td className="border-b border-eve-yellow/20 px-3 py-2 font-mono">{money(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TacticalPanel>
  );
}

export function EarningsCard({ pilotName, payoutAmount, settlementId }: EarningsCardProps) {
  return (
    <TacticalPanel title="Earnings Card" eyebrow="Primary Outcome">
      <p className="text-xs uppercase tracking-[0.12em] text-eve-offwhite/80">Pilot</p>
      <p className="mt-1 font-mono text-lg uppercase tracking-[0.08em] text-eve-yellow">{pilotName}</p>

      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-eve-offwhite/80">You Earned</p>
      <p className="mt-1 font-mono text-2xl text-eve-yellow">{money(payoutAmount)}</p>

      <p className="mt-4 text-xs text-eve-offwhite/70">Settlement ID: {settlementId ?? "PENDING"}</p>
    </TacticalPanel>
  );
}
