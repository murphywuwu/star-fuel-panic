import type { Mission } from "@/types/mission";
import {
  buildMissionTeamRuleSummary,
  formatCountdown,
  formatLux,
  urgencyColorClass,
  urgencyLabel
} from "@/view/utils/missionRuleSummary";

interface NodeDetailOverlayProps {
  mission: Mission | null;
  open: boolean;
  onClose: () => void;
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function NodeDetailOverlay({ mission, open, onClose }: NodeDetailOverlayProps) {
  if (!open || !mission) {
    return null;
  }

  const ruleSummary = buildMissionTeamRuleSummary(mission);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 px-4 backdrop-blur-sm">
      <section className="w-full max-w-2xl border border-eve-red/45 bg-[#080808]/96 p-5 shadow-[0_0_36px_rgba(255,95,0,0.12)]">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className={cn("font-mono text-xs uppercase tracking-[0.14em]", urgencyColorClass(mission.urgency))}>
              [{urgencyLabel(mission.urgency)}] {mission.nodeName}
            </p>
            <h3 className="mt-1 text-lg font-black uppercase tracking-[0.12em] text-eve-offwhite">Node Detail Overlay</h3>
          </div>
          <button
            className="border border-eve-red/40 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite transition hover:border-eve-red hover:bg-eve-red/10"
            onClick={onClose}
            type="button"
          >
            CLOSE
          </button>
        </div>

        <div className="mt-4 grid gap-3 text-sm text-eve-offwhite/90 md:grid-cols-2">
          <p>
            Fill Ratio:
            <span className="ml-2 font-mono">{Math.round(mission.fillRatio * 100)}%</span>
          </p>
          <p>
            Current Bounty:
            <span className="ml-2 font-mono text-eve-yellow">{formatLux(mission.prizePool)}</span>
          </p>
          <p>
            Entry Fee:
            <span className="ml-2 font-mono text-eve-yellow">{formatLux(mission.entryFee)} / pilot</span>
          </p>
          <p>
            Countdown:
            <span className="ml-2 font-mono">{formatCountdown(mission.countdownSec)}</span>
          </p>
        </div>

        <div className="mt-4 space-y-2 border border-eve-red/15 bg-[#1a1a1a]/80 px-3 py-3 text-sm text-eve-offwhite/90">
          <p>{ruleSummary.teamScaleText}</p>
          <p>{ruleSummary.teamProgressText}</p>
          <p className="text-eve-red">{ruleSummary.startThresholdText}</p>
        </div>

        <div className="mt-4 border border-eve-red/15 bg-[#080808]/80 px-3 py-3 text-sm text-eve-offwhite/85">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red">Participating Teams</p>
          {mission.participatingTeams.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {mission.participatingTeams.map((teamName) => (
                <li key={teamName} className="flex items-center justify-between">
                  <span>{teamName}</span>
                  <span className="font-mono text-xs text-eve-offwhite/70">Reputation feed pending</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2">No teams are listed yet. Click Join Now to claim a slot.</p>
          )}
        </div>
      </section>
    </div>
  );
}
