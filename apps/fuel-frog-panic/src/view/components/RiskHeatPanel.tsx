import type { RiskMarker } from "@/types/fuelMission";
import { TacticalPanel } from "@/view/components/TacticalPanel";

interface RiskHeatPanelProps {
  riskMarkers: RiskMarker[];
}

function severityClass(severity: RiskMarker["severity"]) {
  if (severity === "high") {
    return "text-eve-red";
  }
  if (severity === "medium") {
    return "text-eve-yellow";
  }
  return "text-eve-offwhite/85";
}

export function RiskHeatPanel({ riskMarkers }: RiskHeatPanelProps) {
  return (
    <TacticalPanel title="Risk Heat Panel" eyebrow="Threat Feed">
      <ul className="space-y-2 text-xs text-eve-offwhite/90">
        {riskMarkers.length === 0 ? <li>NO ACTIVE RISK MARKER</li> : null}
        {riskMarkers.slice(0, 8).map((marker) => (
          <li key={marker.id} className="border border-eve-yellow/30 bg-eve-black/70 px-3 py-2">
            <p className={`font-mono uppercase tracking-[0.12em] ${severityClass(marker.severity)}`}>
              {marker.severity} RISK
            </p>
            <p className="mt-1 text-eve-offwhite/85">{marker.reason}</p>
          </li>
        ))}
      </ul>
    </TacticalPanel>
  );
}
