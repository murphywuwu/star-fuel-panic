"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthController } from "@/controller/useAuthController";
import { useCreateMatchController } from "@/controller/useCreateMatchController";

interface CreateMatchScreenControllerOptions {
  onClose?: () => void;
  onPublished?: (matchId: string) => void;
}

export type PlottedNode = {
  objectId: string;
  name: string;
  fillRatio: number;
  urgency: "critical" | "warning" | "safe";
  plotLeft: number;
  plotTop: number;
};

const FALLBACK_PLOT_POINTS = [
  { left: 14, top: 24 },
  { left: 28, top: 64 },
  { left: 48, top: 33 },
  { left: 67, top: 58 },
  { left: 82, top: 26 },
  { left: 38, top: 80 },
  { left: 74, top: 78 },
  { left: 56, top: 16 }
];

function buildNodePlot(
  nodes: Array<{
    objectId: string;
    name: string;
    coordX: number;
    coordZ: number;
    fillRatio: number;
    urgency: "critical" | "warning" | "safe";
  }>
): PlottedNode[] {
  if (nodes.length === 0) {
    return [];
  }

  const withCoords = nodes.filter((node) => node.coordX !== 0 || node.coordZ !== 0);
  if (withCoords.length === 0) {
    return nodes.map((node, index) => ({
      objectId: node.objectId,
      name: node.name,
      fillRatio: node.fillRatio,
      urgency: node.urgency,
      plotLeft: FALLBACK_PLOT_POINTS[index % FALLBACK_PLOT_POINTS.length]?.left ?? 50,
      plotTop: FALLBACK_PLOT_POINTS[index % FALLBACK_PLOT_POINTS.length]?.top ?? 50
    }));
  }

  const xs = withCoords.map((node) => node.coordX);
  const zs = withCoords.map((node) => node.coordZ);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);

  return nodes.map((node, index) => {
    if (node.coordX === 0 && node.coordZ === 0) {
      return {
        objectId: node.objectId,
        name: node.name,
        fillRatio: node.fillRatio,
        urgency: node.urgency,
        plotLeft: FALLBACK_PLOT_POINTS[index % FALLBACK_PLOT_POINTS.length]?.left ?? 50,
        plotTop: FALLBACK_PLOT_POINTS[index % FALLBACK_PLOT_POINTS.length]?.top ?? 50
      };
    }

    const left = maxX === minX ? 50 : 12 + ((node.coordX - minX) / (maxX - minX)) * 76;
    const top = maxZ === minZ ? 50 : 12 + ((node.coordZ - minZ) / (maxZ - minZ)) * 76;

    return {
      objectId: node.objectId,
      name: node.name,
      fillRatio: node.fillRatio,
      urgency: node.urgency,
      plotLeft: Number(left.toFixed(2)),
      plotTop: Number(top.toFixed(2))
    };
  });
}

function pulseSize(fillRatio: number) {
  const deficit = 1 - fillRatio;
  return Math.max(24, Math.min(60, Math.round(26 + deficit * 28)));
}

function clampNumber(value: number, minimum: number, maximum: number, fallback: number) {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(minimum, Math.min(maximum, Math.round(value)));
}

export function useCreateMatchScreenController({
  onClose,
  onPublished
}: CreateMatchScreenControllerOptions = {}) {
  const { state: authState } = useAuthController();
  const { state, actions } = useCreateMatchController();
  const [systemQuery, setSystemQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = systemQuery.trim();
    if (trimmed.length < 2) {
      void actions.searchSystems("");
      return;
    }

    const timer = window.setTimeout(() => {
      void actions.searchSystems(trimmed);
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [actions, systemQuery]);

  useEffect(() => {
    return () => {
      actions.reset();
    };
  }, [actions]);

  const selectedSystem = state.selectedSystem;
  const selectedNodeCount = state.targetNodeIds.length;
  const precisionMode = state.mode === "precision";
  const plottedNodes = useMemo(
    () =>
      buildNodePlot(
        state.systemNodes.map((node) => ({
          objectId: node.objectId,
          name: node.name,
          coordX: node.coordX,
          coordZ: node.coordZ,
          fillRatio: node.fillRatio,
          urgency: node.urgency
        }))
      ),
    [state.systemNodes]
  );
  const estimatedMaxGrossPool = useMemo(() => {
    const assumedPilotsPerTeam = 3;
    return state.sponsorshipFee + state.entryFee * state.maxTeams * assumedPilotsPerTeam;
  }, [state.entryFee, state.maxTeams, state.sponsorshipFee]);

  const handleModeChange = (mode: "free" | "precision") => {
    actions.setField("mode", mode);
    setStatusMessage(null);
    if (mode === "free" && state.targetNodeIds.length > 0) {
      actions.setField("targetNodeIds", []);
    }
  };

  const handleSelectSystem = async (systemId: number) => {
    const result = await actions.selectSystem(systemId);
    if (!result.ok) {
      setStatusMessage(result.message);
      return;
    }

    setSystemQuery("");
    setStatusMessage(null);
  };

  const handleToggleTargetNode = (objectId: string) => {
    const result = actions.toggleTargetNode(objectId);
    if (!result.ok) {
      setStatusMessage(result.message);
      return;
    }

    setStatusMessage(null);
  };

  const handlePublish = async () => {
    if (!authState.walletAddress) {
      setStatusMessage("Connect a wallet before publishing a match.");
      return;
    }

    if (!state.solarSystemId || !selectedSystem) {
      setStatusMessage("Select a target system before publishing.");
      return;
    }

    if (precisionMode && selectedNodeCount === 0) {
      setStatusMessage("Precision mode requires at least one target node.");
      return;
    }

    setStatusMessage("CREATING MATCH DRAFT...");
    const draftResult = state.draftId
      ? { ok: true, message: "DRAFT_READY", payload: state.draftId }
      : await actions.createDraft(authState.walletAddress);

    if (!draftResult.ok || !draftResult.payload) {
      setStatusMessage(draftResult.message);
      return;
    }

    setStatusMessage("LOCKING SPONSORSHIP AND PUBLISHING...");
    const publishResult = await actions.publish(authState.walletAddress);
    if (!publishResult.ok) {
      setStatusMessage(publishResult.message);
      return;
    }

    const matchId = draftResult.payload;
    actions.reset();
    setSystemQuery("");

    if (onPublished) {
      onPublished(matchId);
      return;
    }

    setStatusMessage(`MATCH PUBLISHED // ${matchId}`);
  };

  const handleClose = () => {
    actions.reset();
    setSystemQuery("");
    setStatusMessage(null);
    onClose?.();
  };

  return {
    authState,
    state,
    view: {
      systemQuery,
      feedbackMessage: statusMessage ?? state.error,
      selectedSystem,
      selectedNodeCount,
      precisionMode,
      plottedNodes,
      estimatedMaxGrossPool,
      pulseSize
    },
    actions: {
      setSystemQuery,
      handleModeChange,
      handleSelectSystem,
      handleToggleTargetNode,
      handlePublish,
      handleClose,
      setMode: (mode: "free" | "precision") => handleModeChange(mode),
      setSponsorshipFee: (value: number) => actions.setField("sponsorshipFee", Math.max(500, value || 500)),
      setMaxTeams: (value: number) => actions.setField("maxTeams", clampNumber(value, 2, 16, state.maxTeams)),
      setEntryFee: (value: number) => actions.setField("entryFee", Math.max(0, value || 0)),
      setDurationHours: (value: number) =>
        actions.setField("durationHours", clampNumber(value, 1, 24, state.durationHours))
    }
  };
}
