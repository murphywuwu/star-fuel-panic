import type { FundingSources, NodeDeficitSnapshot, TeamRole, TeamState } from "@/types/fuelMission";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";
import { buildTeamRuleSummary } from "@/view/utils/missionRuleSummary";

interface HowToPlayCardProps {
  missionText?: string;
}

interface MissionBoardProps {
  nodes: NodeDeficitSnapshot[];
}

interface PoolInfoBarProps {
  funding: FundingSources;
  teams: TeamState[];
}

interface RoleSelectorProps {
  selectedRole: TeamRole;
  onSelectRole: (role: TeamRole) => void;
}

function money(value: number) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)} LUX`;
}

function urgencyColor(deficitRatio: number) {
  if (deficitRatio >= 0.7) {
    return "#CC3300";
  }
  if (deficitRatio >= 0.4) {
    return "#E5B32B";
  }
  return "#4A7A4A";
}

function urgencyLabel(deficitRatio: number) {
  if (deficitRatio >= 0.7) {
    return "HIGH";
  }
  if (deficitRatio >= 0.4) {
    return "MED";
  }
  return "LOW";
}

function teamPlayerCount(teams: TeamState[]) {
  return teams.reduce((sum, team) => sum + team.players.length, 0);
}

function teamProgressPct(current: number, max: number) {
  if (max <= 0) {
    return 0;
  }
  return Math.min(100, (current / max) * 100);
}

function TeamFillBar({
  label,
  current,
  max,
  barClassName
}: {
  label: string;
  current: number;
  max: number;
  barClassName: string;
}) {
  const pct = teamProgressPct(current, max);
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-eve-offwhite/75">
        <span>{label}</span>
        <span className="text-eve-offwhite/90">
          {current}/{max}
        </span>
      </div>
      <div className="mt-1 border border-eve-yellow/25 bg-eve-black/80 p-px">
        <div className={`h-1.5 ${barClassName}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const ROLE_ROWS: Array<{ role: TeamRole; summary: string }> = [
  { role: "Collector", summary: "Collect fuel from extraction points." },
  { role: "Hauler", summary: "Deliver fuel to urgent stations." },
  { role: "Escort", summary: "Protect active transport routes." }
];

export function HowToPlayCard({ missionText }: HowToPlayCardProps) {
  return (
    <TacticalPanel title="How To Play" eyebrow="30s Brief">
      <ul className="space-y-2 text-sm text-eve-offwhite/90">
        <li>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">Objective</span>
          <p className="mt-1">Refuel the most urgent stations in 10 minutes.</p>
        </li>
        <li>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">Action</span>
          <p className="mt-1">Collect, haul, escort. Repeat until timer ends.</p>
        </li>
        <li>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">Win Condition</span>
          <p className="mt-1">Higher urgent-node completion and contribution score.</p>
        </li>
        <li>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">Payout</span>
          <p className="mt-1">Pool - platform fee, then split by score.</p>
        </li>
      </ul>
      {missionText ? (
        <p className="mt-3 border border-eve-yellow/30 bg-eve-black/70 px-3 py-2 text-xs text-eve-offwhite/80">{missionText}</p>
      ) : null}
    </TacticalPanel>
  );
}

export function MissionBoard({ nodes }: MissionBoardProps) {
  const sortedNodes = [...nodes].sort((a, b) => a.fillRatio - b.fillRatio);

  return (
    <TacticalPanel title="Mission Board" eyebrow="Free Browse Before Join">
      <ul className="space-y-3">
        {sortedNodes.length === 0 ? (
          <li className="border border-eve-red/70 bg-eve-red/20 px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-eve-offwhite">
            NO ACTIVE MISSIONS
          </li>
        ) : null}
        {sortedNodes.map((node) => {
          const deficitRatio = Math.max(0, 1 - node.fillRatio);
          const fillPct = Math.round(node.fillRatio * 100);
          const deficitPct = Math.round(deficitRatio * 100);
          const color = urgencyColor(deficitRatio);

          return (
            <li key={node.nodeId} className="border border-eve-yellow/35 bg-eve-black/75 px-3 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-sm uppercase tracking-[0.12em] text-eve-offwhite">{node.name}</p>
                <p className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color }}>
                  URGENCY {urgencyLabel(deficitRatio)}
                </p>
              </div>
              <div className="mt-2 border border-eve-yellow/30 bg-eve-grey/80 p-1">
                <div className="h-2" style={{ width: `${fillPct}%`, backgroundColor: color }} />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-eve-offwhite/85">
                <span>FILL {fillPct}%</span>
                <span>DEFICIT {deficitPct}%</span>
                <span>RISK {node.riskWeight.toFixed(2)}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </TacticalPanel>
  );
}

export function PoolInfoBar({ funding, teams }: PoolInfoBarProps) {
  const grossPoolPreview =
    funding.entryFeeLux * funding.playerCount +
    funding.hostSeedPool +
    funding.platformSubsidyPool +
    funding.sponsorPool;
  const joined = teamPlayerCount(teams);
  const maxTeams = funding.maxTeams ?? 10;
  const minTeams = funding.minTeams ?? 1;
  const minPlayers = funding.minPlayersPerTeam ?? 3;
  const registeredTeams = teams.length;
  const paidTeams = teams.filter((team) => team.status === "paid").length;
  const { teamScaleText, teamProgressText, startThresholdText } = buildTeamRuleSummary({
    minTeams,
    maxTeams,
    registeredTeams,
    paidTeams,
    minPlayers,
    startRuleMode: "min_team_force_start",
    forceStartSec: 180
  });

  return (
    <TacticalPanel title="Pool Info" eyebrow="Value Before Commitment">
      <ul className="space-y-2 text-sm text-eve-offwhite/90">
        <li className="flex items-center justify-between">
          <span>Entry Fee</span>
          <span className="font-mono text-eve-yellow">{money(funding.entryFeeLux)}</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Gross Pool Preview</span>
          <span className="font-mono text-eve-yellow">{money(grossPoolPreview)}</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Players Joined</span>
          <span className="font-mono">{joined} / {funding.playerCount}</span>
        </li>
      </ul>

      <div className="mt-3 border border-eve-yellow/30 bg-eve-black/75 px-3 py-3 text-xs text-eve-offwhite/80">
        <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">Teams</p>
        <p className="mt-2 font-mono uppercase tracking-[0.12em] text-eve-offwhite/85">{teamScaleText}</p>
        <p className="mt-1 font-mono uppercase tracking-[0.12em] text-eve-offwhite/75">{teamProgressText}</p>
        <p className="mt-1 font-mono uppercase tracking-[0.12em] text-eve-offwhite/65">{startThresholdText}</p>
        <TeamFillBar label="Registered" current={registeredTeams} max={maxTeams} barClassName="bg-eve-yellow/80" />
        <TeamFillBar label="Paid" current={paidTeams} max={maxTeams} barClassName="bg-emerald-500/85" />
        <p className="mt-3 font-mono uppercase tracking-[0.12em] text-eve-yellow">Fee Policy</p>
        <p className="mt-2">Platform rake: {(funding.platformRakeBps / 100).toFixed(1)}%</p>
        <p>Host revshare in platform fee: {(funding.hostRevshareBps / 100).toFixed(1)}%</p>
      </div>
    </TacticalPanel>
  );
}

export function RoleSelector({ selectedRole, onSelectRole }: RoleSelectorProps) {
  return (
    <TacticalPanel title="Role Selector" eyebrow="Decision Zone">
      <ul className="space-y-2">
        {ROLE_ROWS.map((row) => {
          const selected = row.role === selectedRole;

          return (
            <li key={row.role}>
              <TacticalButton
                tone={selected ? "primary" : "ghost"}
                fullWidth
                className="!justify-start text-left"
                onClick={() => onSelectRole(row.role)}
              >
                {row.role}
              </TacticalButton>
              <p className="mt-1 text-xs text-eve-offwhite/75">{row.summary}</p>
            </li>
          );
        })}
      </ul>
    </TacticalPanel>
  );
}
