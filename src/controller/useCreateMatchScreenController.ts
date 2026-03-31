"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthController } from "@/controller/useAuthController";
import { useCreateMatchController } from "@/controller/useCreateMatchController";

interface CreateMatchScreenControllerOptions {
  onClose?: () => void;
  onPublished?: (matchId: string) => void;
}

type PrizeLadderItem = {
  label: string;
  ratio: number;
  amount: number;
  tone: string;
};

export type PlottedNode = {
  objectId: string;
  name: string;
  fuelQuantity: number;
  fuelMaxCapacity: number;
  fuelDeficit: number;
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
    fuelQuantity: number;
    fuelMaxCapacity: number;
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
        fuelQuantity: node.fuelQuantity,
        fuelMaxCapacity: node.fuelMaxCapacity,
        fuelDeficit: Math.max(0, node.fuelMaxCapacity - node.fuelQuantity),
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
        fuelQuantity: node.fuelQuantity,
        fuelMaxCapacity: node.fuelMaxCapacity,
        fuelDeficit: Math.max(0, node.fuelMaxCapacity - node.fuelQuantity),
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
      fuelQuantity: node.fuelQuantity,
      fuelMaxCapacity: node.fuelMaxCapacity,
      fuelDeficit: Math.max(0, node.fuelMaxCapacity - node.fuelQuantity),
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

function buildPrizeLadder(maxTeams: number, payoutPool: number): PrizeLadderItem[] {
  if (maxTeams <= 2) {
    return [
      { label: "1st", ratio: 0.7, amount: Math.round(payoutPool * 0.7), tone: "text-eve-yellow" },
      { label: "2nd", ratio: 0.3, amount: Math.round(payoutPool * 0.3), tone: "text-eve-offwhite" }
    ];
  }

  return [
    { label: "1st", ratio: 0.6, amount: Math.round(payoutPool * 0.6), tone: "text-eve-yellow" },
    { label: "2nd", ratio: 0.3, amount: Math.round(payoutPool * 0.3), tone: "text-eve-offwhite" },
    { label: "3rd", ratio: 0.1, amount: Math.round(payoutPool * 0.1), tone: "text-eve-red" }
  ];
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
  const [sponsorshipFeeInput, setSponsorshipFeeInput] = useState(() => String(state.sponsorshipFee));
  const [entryFeeInput, setEntryFeeInput] = useState(() => String(state.entryFee));
  const [pendingPublishTxDigest, setPendingPublishTxDigest] = useState<string | null>(null);

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

  useEffect(() => {
    setSponsorshipFeeInput(String(state.sponsorshipFee));
  }, [state.sponsorshipFee]);

  useEffect(() => {
    setEntryFeeInput(String(state.entryFee));
  }, [state.entryFee]);

  const selectedSystem = state.selectedSystem;
  const selectedNodeCount = state.targetNodeIds.length;
  const precisionMode = state.mode === "precision";
  const plottedNodes = useMemo(
    () =>
      buildNodePlot(
        state.systemNodes.map((node) => ({
          objectId: node.objectId,
          name: node.name,
          fuelQuantity: node.fuelQuantity,
          fuelMaxCapacity: node.fuelMaxCapacity,
          coordX: node.coordX,
          coordZ: node.coordZ,
          fillRatio: node.fillRatio,
          urgency: node.urgency
        }))
      ),
    [state.systemNodes]
  );
  const estimatedMaxGrossPool = useMemo(() => {
    return state.sponsorshipFee + state.entryFee * state.maxTeams * state.teamSize;
  }, [state.entryFee, state.maxTeams, state.sponsorshipFee, state.teamSize]);
  const selectedNodes = useMemo(
    () => state.systemNodes.filter((node) => state.targetNodeIds.includes(node.objectId)),
    [state.systemNodes, state.targetNodeIds]
  );
  const displayNodes = useMemo(
    () => (precisionMode ? selectedNodes : state.systemNodes),
    [precisionMode, selectedNodes, state.systemNodes]
  );
  const guaranteedPool = state.sponsorshipFee;
  const projectedEntryFlow = Math.max(0, estimatedMaxGrossPool - guaranteedPool);
  const projectedPlatformFee = Math.floor(estimatedMaxGrossPool * 0.05);
  const projectedPayoutPool = Math.max(0, estimatedMaxGrossPool - projectedPlatformFee);
  const guaranteedSharePct = estimatedMaxGrossPool > 0 ? Math.max(8, Math.round((guaranteedPool / estimatedMaxGrossPool) * 100)) : 0;
  const entrySharePct = estimatedMaxGrossPool > 0 ? Math.max(0, Math.round((projectedEntryFlow / estimatedMaxGrossPool) * 100)) : 0;
  const payoutSharePct = estimatedMaxGrossPool > 0 ? Math.max(0, Math.round((projectedPayoutPool / estimatedMaxGrossPool) * 100)) : 0;
  const prizeLadder = useMemo(() => buildPrizeLadder(state.maxTeams, projectedPayoutPool), [projectedPayoutPool, state.maxTeams]);
  const topPrize = prizeLadder[0]?.amount ?? 0;
  const systemLoadingNotice = state.loadingSystem ? "Loading system detail and indexed network nodes..." : null;

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

  const handleSponsorshipFeeInputChange = (rawValue: string) => {
    setSponsorshipFeeInput(rawValue);
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed < 50) {
      return;
    }

    actions.setField("sponsorshipFee", Math.max(50, Math.floor(parsed)));
  };

  const commitSponsorshipFeeInput = () => {
    const parsed = Number(sponsorshipFeeInput);
    const nextValue = Number.isFinite(parsed) ? Math.max(50, Math.floor(parsed)) : state.sponsorshipFee;
    actions.setField("sponsorshipFee", nextValue);
    setSponsorshipFeeInput(String(nextValue));
  };

  const handleEntryFeeInputChange = (rawValue: string) => {
    setEntryFeeInput(rawValue);
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return;
    }

    actions.setField("entryFee", Math.max(0, Math.floor(parsed)));
  };

  const commitEntryFeeInput = () => {
    const parsed = Number(entryFeeInput);
    const nextValue = Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : state.entryFee;
    actions.setField("entryFee", nextValue);
    setEntryFeeInput(String(nextValue));
  };

  const handlePublish = async () => {
    const parsedSponsorshipFee = Number(sponsorshipFeeInput);
    const sponsorshipFeeAmount = Number.isFinite(parsedSponsorshipFee)
      ? Math.max(50, Math.floor(parsedSponsorshipFee))
      : state.sponsorshipFee;

    commitSponsorshipFeeInput();
    commitEntryFeeInput();

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

    if (!pendingPublishTxDigest) {
      setStatusMessage("LOCKING SPONSORSHIP INTO ESCROW...");
    }

    const paymentResult =
      pendingPublishTxDigest !== null
        ? {
            ok: true as const,
            message: "SPONSORSHIP_PAYMENT_REUSED",
            payload: { txDigest: pendingPublishTxDigest }
          }
        : await actions.executePublishEscrowTransaction(authState.walletAddress);
    if (!paymentResult.ok || !paymentResult.payload?.txDigest) {
      setStatusMessage(paymentResult.message);
      return;
    }

    setPendingPublishTxDigest(paymentResult.payload.txDigest);
    setStatusMessage("LOCKING SPONSORSHIP AND PUBLISHING...");
    const publishResult = await actions.publish(authState.walletAddress, paymentResult.payload.txDigest);
    if (!publishResult.ok) {
      setStatusMessage(publishResult.message);
      return;
    }

    const matchId = draftResult.payload;
    actions.reset();
    setSystemQuery("");
    setPendingPublishTxDigest(null);

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
    setPendingPublishTxDigest(null);
    onClose?.();
  };

  return {
    authState,
    state,
    view: {
      systemQuery,
      feedbackMessage: statusMessage ?? state.error,
      sponsorshipFeeInput,
      entryFeeInput,
      selectedSystem,
      selectedNodeCount,
      precisionMode,
      plottedNodes,
      selectedNodes,
      estimatedMaxGrossPool,
      teamSize: state.teamSize,
      guaranteedPool,
      projectedEntryFlow,
      projectedPlatformFee,
      projectedPayoutPool,
      guaranteedSharePct,
      entrySharePct,
      payoutSharePct,
      prizeLadder,
      topPrize,
      systemLoadingNotice,
      targetPanelTitle: "Target System & Network Nodes",
      targetPanelEyebrow: "Search / Select / Review Topology",
      targetGridSummaryLabel: precisionMode ? `${selectedNodeCount}/5 locked` : `${state.systemNodes.length} online`,
      targetGridInstruction: precisionMode
        ? "Click flashing dots to lock scoring targets"
        : "All online nodes in the selected system score automatically",
      targetLegendAccentLabel: precisionMode ? "Selected Target" : "Auto Scoring",
      displayNodes,
      pulseSize
    },
    actions: {
      setSystemQuery,
      handleModeChange,
      handleSelectSystem,
      handleToggleTargetNode,
      handlePublish,
      handleClose,
      handleSponsorshipFeeInputChange,
      commitSponsorshipFeeInput,
      handleEntryFeeInputChange,
      commitEntryFeeInput,
      setMode: (mode: "free" | "precision") => handleModeChange(mode),
      setSponsorshipFee: (value: number) => actions.setField("sponsorshipFee", Math.max(50, value || 50)),
      setMaxTeams: (value: number) => actions.setField("maxTeams", clampNumber(value, 2, 16, state.maxTeams)),
      setTeamSize: (value: number) => actions.setField("teamSize", clampNumber(value, 3, 8, state.teamSize)),
      setEntryFee: (value: number) => actions.setField("entryFee", Math.max(0, value || 0)),
      setDurationHours: (value: number) =>
        actions.setField("durationHours", clampNumber(value, 1, 72, state.durationHours))
    }
  };
}
