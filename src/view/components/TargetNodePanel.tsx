"use client";

import { useEffect, useState } from "react";
import type { NetworkNode } from "@/types/node";
import { TacticalPanel } from "./TacticalPanel";
import { getSolarSystemName } from "@/utils/solarSystemNames";

type TargetNodePanelProps = {
  assemblyId: string | null;
};

export function TargetNodePanel({ assemblyId }: TargetNodePanelProps) {
  const [node, setNode] = useState<NetworkNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemName, setSystemName] = useState<string>("");

  useEffect(() => {
    if (!assemblyId) {
      setNode(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/nodes/${assemblyId}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.node) {
          setNode(data.node);
          // Fetch solar system name
          if (data.node.solarSystem !== 0) {
            const name = await getSolarSystemName(data.node.solarSystem);
            setSystemName(name);
          } else {
            setSystemName("Unknown System");
          }
        } else {
          setError("Node not found");
        }
      })
      .catch((err) => {
        console.error("Failed to load node:", err);
        setError("Failed to load node data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [assemblyId]);

  if (!assemblyId) {
    return null;
  }

  if (loading) {
    return (
      <TacticalPanel title="TARGET NODE" className="border-blue-500/30">
        <div className="text-center text-gray-400 py-4">Loading node data...</div>
      </TacticalPanel>
    );
  }

  if (error || !node) {
    return (
      <TacticalPanel title="TARGET NODE" className="border-red-500/30">
        <div className="text-center text-red-400 py-4">{error || "No node data"}</div>
      </TacticalPanel>
    );
  }

  const urgencyColor = {
    critical: "text-red-500",
    warning: "text-yellow-500",
    safe: "text-green-500"
  }[node.urgency];

  const statusColor = node.isOnline ? "text-green-500" : "text-gray-500";

  return (
    <TacticalPanel
      title="TARGET NODE"
      className={`border-${node.urgency === "critical" ? "red" : node.urgency === "warning" ? "yellow" : "blue"}-500/30`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-gray-500 text-xs uppercase mb-1">Node ID</div>
          <div className="font-mono text-xs">{node.id.slice(0, 10)}...</div>
        </div>

        <div>
          <div className="text-gray-500 text-xs uppercase mb-1">Name</div>
          <div className="font-semibold">{node.name}</div>
        </div>

        <div>
          <div className="text-gray-500 text-xs uppercase mb-1">Status</div>
          <div className={`font-semibold ${statusColor}`}>
            {node.isOnline ? "ONLINE" : "OFFLINE"}
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-xs uppercase mb-1">Urgency</div>
          <div className={`font-semibold uppercase ${urgencyColor}`}>
            {node.urgency}
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-xs uppercase mb-1">Fuel Level</div>
          <div className="font-semibold">
            {node.fuelQuantity.toLocaleString()} / {node.fuelMaxCapacity.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">
            {(node.fillRatio * 100).toFixed(2)}% filled
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-xs uppercase mb-1">Type ID</div>
          <div className="font-mono text-xs">{node.typeId}</div>
        </div>

        {node.solarSystem !== 0 && (
          <div>
            <div className="text-gray-500 text-xs uppercase mb-1">Solar System</div>
            <div className="font-semibold">{systemName || `System ${node.solarSystem}`}</div>
          </div>
        )}

        {node.maxEnergyProduction > 0 && (
          <div>
            <div className="text-gray-500 text-xs uppercase mb-1">Energy</div>
            <div className="font-semibold">
              {node.currentEnergyProduction} / {node.maxEnergyProduction}
            </div>
          </div>
        )}
      </div>

      {(node.coordX !== 0 || node.coordY !== 0 || node.coordZ !== 0) && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-gray-500 text-xs uppercase mb-2">Coordinates</div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div>
              <span className="text-gray-500">X:</span> {node.coordX.toExponential(2)}
            </div>
            <div>
              <span className="text-gray-500">Y:</span> {node.coordY.toExponential(2)}
            </div>
            <div>
              <span className="text-gray-500">Z:</span> {node.coordZ.toExponential(2)}
            </div>
          </div>
        </div>
      )}

      {node.isBurning && (
        <div className="mt-2 text-orange-500 text-xs">
          🔥 Fuel is currently burning (Rate: {node.fuelBurnRate}ms)
        </div>
      )}
    </TacticalPanel>
  );
}
