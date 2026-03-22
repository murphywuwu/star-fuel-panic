import type { Mission } from "@/types/mission";
import { formatLux, urgencyColorClass, urgencyLabel } from "@/view/utils/missionRuleSummary";

interface NodeMapProps {
  missions: Mission[];
  selectedMissionId: string | null;
  onSelectMission: (missionId: string) => void;
  onOpenDetail: (mission: Mission) => void;
}

function nodePosition(index: number) {
  const points = [
    { x: 16, y: 18 },
    { x: 37, y: 62 },
    { x: 66, y: 25 },
    { x: 78, y: 68 },
    { x: 49, y: 43 },
    { x: 24, y: 78 },
    { x: 84, y: 40 },
    { x: 58, y: 81 }
  ];

  return points[index % points.length];
}

function urgencyDotClass(urgency: Mission["urgency"]) {
  if (urgency === "critical") {
    return "bg-eve-red border-eve-red";
  }
  if (urgency === "warning") {
    return "bg-eve-yellow border-eve-yellow";
  }
  return "bg-emerald-500 border-emerald-400";
}

function pulseRadius(prizePool: number) {
  return Math.max(26, Math.min(58, Math.round(prizePool / 24)));
}

function pulseDuration(countdownSec: number | null) {
  if (countdownSec === null) {
    return 2600;
  }
  return Math.max(550, Math.min(2600, countdownSec * 8));
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function NodeMap({ missions, selectedMissionId, onSelectMission, onOpenDetail }: NodeMapProps) {
  return (
    <section className="border border-eve-red/15 bg-[#1a1a1a]/92 p-4 shadow-[0_0_0_1px_rgba(255,95,0,0.05)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.22em] text-eve-offwhite">Interactive NodeMap</h2>
          <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-eve-red/75">RED IS URGENT / BIGGER RINGS MEAN HIGHER PRIZES</p>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-eve-offwhite/45">NODE_STREAM</p>
      </div>

      <div className="relative h-[420px] overflow-hidden border border-eve-red/20 bg-[radial-gradient(circle_at_20%_-10%,rgba(255,95,0,0.14),rgba(8,8,8,0)_48%),linear-gradient(rgba(224,224,224,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(224,224,224,0.03)_1px,transparent_1px)] bg-[length:100%_100%,18px_18px,18px_18px]">
        {missions.map((mission, index) => {
          const position = nodePosition(index);
          const isSelected = mission.id === selectedMissionId;
          const ringSize = pulseRadius(mission.prizePool);
          const duration = pulseDuration(mission.countdownSec);

          return (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              key={mission.id}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 border border-eve-red/60 opacity-70 animate-ping"
                style={{
                  width: `${ringSize}px`,
                  height: `${ringSize}px`,
                  animationDuration: `${duration}ms`
                }}
              />
              <button
                className={cn(
                  "relative z-10 h-4 w-4 border transition",
                  urgencyDotClass(mission.urgency),
                  isSelected ? "scale-125 shadow-[0_0_0_2px_rgba(255,95,0,0.45)]" : "scale-100"
                )}
                onClick={() => onSelectMission(mission.id)}
                onDoubleClick={() => onOpenDetail(mission)}
                title={`${mission.nodeName} | ${formatLux(mission.prizePool)}`}
                type="button"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid gap-2 text-xs text-eve-offwhite/85 sm:grid-cols-3">
        {missions.slice(0, 3).map((mission) => (
          <div className="border border-eve-red/15 bg-[#080808]/75 px-2 py-2" key={mission.id}>
            <p className={cn("text-[10px] font-black uppercase tracking-[0.18em]", urgencyColorClass(mission.urgency))}>
              {urgencyLabel(mission.urgency)}
            </p>
            <p className="mt-1 truncate">{mission.nodeName}</p>
            <p className="font-mono text-eve-red">{formatLux(mission.prizePool)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
