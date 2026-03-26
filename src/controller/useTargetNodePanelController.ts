"use client";

import { useEffect, useMemo, useState } from "react";
import { targetNodeService } from "@/service/targetNodeService";
import type { NetworkNode } from "@/types/node";

export function useTargetNodePanelController(assemblyId: string | null) {
  const [node, setNode] = useState<NetworkNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemName, setSystemName] = useState("");

  useEffect(() => {
    let active = true;

    if (!assemblyId) {
      setNode(null);
      setSystemName("");
      setError(null);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError(null);

    void targetNodeService
      .getTargetNodeDetail(assemblyId)
      .then((detail) => {
        if (!active) {
          return;
        }
        setNode(detail.node);
        setSystemName(detail.systemName);
      })
      .catch((nextError) => {
        if (!active) {
          return;
        }
        console.error("Failed to load node:", nextError);
        setNode(null);
        setSystemName("");
        setError(nextError instanceof Error ? nextError.message : "Failed to load node data");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [assemblyId]);

  const view = useMemo(() => {
    if (!node) {
      return null;
    }

    return {
      urgencyColor:
        node.urgency === "critical"
          ? "text-red-500"
          : node.urgency === "warning"
            ? "text-yellow-500"
            : "text-green-500",
      statusColor: node.isOnline ? "text-green-500" : "text-gray-500",
      borderClassName:
        node.urgency === "critical"
          ? "border-red-500/30"
          : node.urgency === "warning"
            ? "border-yellow-500/30"
            : "border-blue-500/30",
      hasCoordinates: node.coordX !== 0 || node.coordY !== 0 || node.coordZ !== 0,
      hasEnergy: node.maxEnergyProduction > 0,
      systemNameLabel: systemName || `System ${node.solarSystem}`
    };
  }, [node, systemName]);

  return {
    node,
    loading,
    error,
    view
  };
}
