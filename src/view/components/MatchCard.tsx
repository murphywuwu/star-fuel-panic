import type { Mission } from "@/types/mission";
import {
  buildMissionTeamRuleSummary,
  formatCountdown,
  formatLux,
  urgencyColorClass,
  urgencyLabel
} from "@/view/utils/missionRuleSummary";

interface MatchCardProps {
  mission: Mission;
  selected: boolean;
  onSelect: (missionId: string) => void;
  onOpenDetail: (mission: Mission) => void;
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function MatchCard({ mission, selected, onSelect, onOpenDetail }: MatchCardProps) {
  const ruleSummary = buildMissionTeamRuleSummary(mission);

  return (
    <article
      className={cn(
        "border bg-[#080808]/75 p-3 transition",
        selected ? "border-eve-red shadow-[0_0_0_1px_rgba(255,95,0,0.35)]" : "border-eve-red/20"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite">
          <span className={cn("mr-2", urgencyColorClass(mission.urgency))}>[{urgencyLabel(mission.urgency)}]</span>
          {mission.nodeName}
        </p>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-eve-red">{formatCountdown(mission.countdownSec)}</p>
      </div>

      <div className="mt-2 grid gap-2 text-sm text-eve-offwhite/90 sm:grid-cols-2">
        <p>
          Total Pool:
          <span className="ml-2 font-mono text-eve-red">{formatLux(mission.prizePool)}</span>
        </p>
        <p>
          Entry Fee:
          <span className="ml-2 font-mono text-eve-red">{formatLux(mission.entryFee)} / pilot</span>
        </p>
      </div>

      <div className="mt-3 space-y-1 border border-eve-red/15 bg-[#1a1a1a]/80 px-3 py-2 text-xs text-eve-offwhite/85">
        <p>{ruleSummary.teamScaleText}</p>
        <p>{ruleSummary.teamProgressText}</p>
        <p className="text-eve-red/95">{ruleSummary.startThresholdText}</p>
      </div>

      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-eve-offwhite/75">
        {mission.participatingTeams.length > 0 ? (
          <p>
            Teams:
            <span className="ml-2 font-mono text-eve-offwhite">{mission.participatingTeams.join(" / ")}</span>
          </p>
        ) : (
          <p>Teams: Recruiting</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="border border-eve-red bg-eve-red px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#ffb599]"
          onClick={() => onSelect(mission.id)}
          type="button"
        >
          JOIN NOW
        </button>
        <button
          className="border border-eve-offwhite/20 bg-transparent px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite transition hover:border-eve-red/50"
          onClick={() => onOpenDetail(mission)}
          type="button"
        >
          SITE DETAILS
        </button>
      </div>
    </article>
  );
}
