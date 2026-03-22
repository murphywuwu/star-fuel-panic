import { useMemo } from "react";
import type { UrgencyFeedItem } from "@/types/fuelMission";

interface UrgencyTrendSparklineProps {
  feed: UrgencyFeedItem[];
  urgencyIndexHistory: Record<string, number[]>;
  activeNodeId: string | null;
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function buildPolylinePoints(values: number[], width = 92, height = 24) {
  if (values.length === 0) {
    return "";
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(0.001, max - min);

  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - ((value - min) / span) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function UrgencyTrendSparkline({
  feed,
  urgencyIndexHistory,
  activeNodeId
}: UrgencyTrendSparklineProps) {
  const rows = useMemo(
    () =>
      feed.map((item) => {
        const history = urgencyIndexHistory[item.nodeId] ?? [item.priorityIndex];
        return {
          ...item,
          points: buildPolylinePoints(history)
        };
      }),
    [feed, urgencyIndexHistory]
  );

  return (
    <section className="border border-eve-yellow/30 bg-eve-black/70 px-3 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-eve-yellow">Trend // 30s</p>
      <ul className="mt-2 space-y-2">
        {rows.map((row) => {
          const active = row.nodeId === activeNodeId;
          const rising = row.priorityDelta30s >= 0;
          return (
            <li key={row.nodeId} className={cn("border px-2 py-2", active ? "border-eve-yellow" : "border-eve-yellow/20")}>
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.12em] text-eve-offwhite">
                <span>{row.name}</span>
                <span className={rising ? "text-eve-yellow" : "text-eve-offwhite/70"}>
                  {rising ? "+" : ""}
                  {Math.round(row.priorityDelta30s * 100)}%
                </span>
              </div>
              <svg viewBox="0 0 92 24" className="mt-2 h-6 w-full" aria-hidden>
                <polyline
                  points={row.points}
                  fill="none"
                  stroke={active ? "#E5B32B" : "#E0E0E0"}
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
