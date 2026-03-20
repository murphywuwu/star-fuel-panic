"use client";

import { FormEvent, useMemo, useState } from "react";

import { useKillmailBingoController } from "@/controller/useKillmailBingoController";
import type { MatchPhase, SlotStatus } from "@/types/killmail";

interface SquadMember {
  id: string;
  callsign: string;
  role: string;
}

type FeedStatus = "Pending" | "Confirmed" | "Rejected";

interface FeedRow {
  killmailId: string;
  actorId: string;
  occurredAt: string;
  status: FeedStatus;
  slotId?: string;
}

const SQUAD_MEMBERS: SquadMember[] = [
  { id: "pilot-demo", callsign: "VANTA-01", role: "Command" },
  { id: "pilot-alpha", callsign: "LANCE-02", role: "Tackle" },
  { id: "pilot-beta", callsign: "EMBER-03", role: "Damage" },
  { id: "pilot-gamma", callsign: "AXIS-04", role: "Scout" }
];

function createReadinessState() {
  const readiness: Record<string, boolean> = {};
  for (const member of SQUAD_MEMBERS) {
    readiness[member.id] = member.id === "pilot-demo";
  }
  return readiness;
}

function slotTone(status: SlotStatus, focused: boolean) {
  const shared = focused ? "ring-1 ring-eve-yellow" : "";
  switch (status) {
    case "Confirmed":
      return `border-eve-yellow bg-eve-yellow/10 ${shared}`;
    case "Rejected":
      return `border-eve-red bg-eve-red/10 ${shared}`;
    case "Pending":
      return `border-eve-offwhite bg-eve-grey/80 ${shared}`;
    default:
      return `border-[#333] bg-eve-black/70 ${shared}`;
  }
}

function feedTone(status: FeedStatus) {
  if (status === "Confirmed") {
    return "text-eve-yellow";
  }
  if (status === "Rejected") {
    return "text-eve-red";
  }
  return "text-eve-offwhite";
}

function toScreenByPhase(phase: MatchPhase) {
  if (phase === "LobbyReady" || phase === "CardDrafted") {
    return "S-001";
  }
  if (phase === "MatchRunning" || phase === "GraceWindow") {
    return "S-002";
  }
  return "S-004";
}

function formatIsoTime(iso: string) {
  const value = Number(new Date(iso));
  if (!Number.isFinite(value)) {
    return "N/A";
  }
  return new Date(iso).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

export function KillmailBingoView() {
  const controller = useKillmailBingoController();
  const { viewState, lastUiError } = controller;

  const [entryFee, setEntryFee] = useState("80");
  const [killmailId, setKillmailId] = useState("");
  const [pilotId, setPilotId] = useState("pilot-demo");
  const [selectedActorId, setSelectedActorId] = useState("pilot-demo");
  const [readiness, setReadiness] = useState<Record<string, boolean>>(() => createReadinessState());
  const [focusedSlotId, setFocusedSlotId] = useState<string | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [selectedPendingKillmailId, setSelectedPendingKillmailId] = useState<string | null>(null);

  const activeScreen = toScreenByPhase(viewState.matchPhase);
  const readyCount = SQUAD_MEMBERS.filter((member) => readiness[member.id]).length;
  const allReady = readyCount === SQUAD_MEMBERS.length;
  const canInitiateMatch = viewState.matchPhase === "CardDrafted" && allReady;
  const slotByKillmailId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const slot of viewState.boardSlots) {
      if (slot.confirmedKillmailId) {
        map[slot.confirmedKillmailId] = slot.slotId;
      }
    }
    return map;
  }, [viewState.boardSlots]);

  const eventFeed = useMemo<FeedRow[]>(() => {
    const pending = viewState.pendingEvents.map((event) => ({
      killmailId: event.killmailId,
      actorId: event.actorId,
      occurredAt: event.occurredAt,
      status: "Pending" as const
    }));
    const confirmed = viewState.confirmedEvents.map((event) => ({
      killmailId: event.killmailId,
      actorId: event.actorId,
      occurredAt: event.occurredAt,
      status: "Confirmed" as const,
      slotId: slotByKillmailId[event.killmailId]
    }));
    const rejected = viewState.rejectedEvents.map((event) => ({
      killmailId: event.killmailId,
      actorId: event.actorId,
      occurredAt: event.occurredAt,
      status: "Rejected" as const,
      slotId: slotByKillmailId[event.killmailId]
    }));
    return [...pending, ...confirmed, ...rejected].sort(
      (left, right) => Number(new Date(right.occurredAt)) - Number(new Date(left.occurredAt))
    );
  }, [slotByKillmailId, viewState.confirmedEvents, viewState.pendingEvents, viewState.rejectedEvents]);

  const selectedPendingEvent =
    viewState.pendingEvents.find((item) => item.killmailId === selectedPendingKillmailId) ?? viewState.pendingEvents[0];

  const contributionRows = useMemo(() => {
    const countsByPilot: Record<string, number> = {};
    for (const member of SQUAD_MEMBERS) {
      countsByPilot[member.id] = 0;
    }
    for (const event of viewState.confirmedEvents) {
      countsByPilot[event.actorId] = (countsByPilot[event.actorId] ?? 0) + 1;
    }

    const rows = SQUAD_MEMBERS.map((member) => ({
      ...member,
      score: countsByPilot[member.id] ?? 0
    })).sort((left, right) => right.score - left.score);
    const totalScore = rows.reduce((sum, row) => sum + row.score, 0);

    return rows.map((row, index) => {
      const weight = totalScore > 0 ? row.score / totalScore : index === 0 ? 1 : 0;
      return {
        ...row,
        payout: viewState.settlement.payoutPool * weight,
        weight
      };
    });
  }, [viewState.confirmedEvents, viewState.settlement.payoutPool]);

  const sharePayload = useMemo(
    () =>
      JSON.stringify(
        {
          matchId: viewState.matchId,
          phase: viewState.matchPhase,
          settlementId: viewState.settlement.settlementId,
          report: viewState.reportEntries
        },
        null,
        2
      ),
    [viewState.matchId, viewState.matchPhase, viewState.reportEntries, viewState.settlement.settlementId]
  );

  function onCreateRoom(event: FormEvent) {
    event.preventDefault();
    controller.onCreateRoom(Number(entryFee));
    setIsVerificationOpen(false);
    setFocusedSlotId(null);
    setSelectedPendingKillmailId(null);
  }

  function onToggleReady(memberId: string) {
    setReadiness((current) => ({
      ...current,
      [memberId]: !current[memberId]
    }));
  }

  function onSubmitKillmail(event: FormEvent) {
    event.preventDefault();
    if (!killmailId.trim()) {
      return;
    }
    controller.onSubmitKillmail(killmailId.trim(), selectedActorId);
    setKillmailId("");
    setIsVerificationOpen(true);
  }

  function onShareReport() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(sharePayload);
    }
  }

  function onReQueue() {
    controller.onCreateRoom(Number(entryFee));
  }

  return (
    <main className="min-h-screen bg-eve-black bg-scan-grid bg-grid text-eve-offwhite">
      <section className="mx-auto w-full max-w-7xl space-y-4 p-4 md:p-8">
        <header className="panel p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#333] pb-4">
            <div>
              <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-eve-yellow/90">
                Frontier Ops // Live Combat Interface
              </p>
              <h1 className="mt-1 font-[var(--font-mono)] text-2xl font-bold uppercase text-eve-yellow md:text-3xl">
                Killmail Bingo Ops
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-2 text-right text-[11px] uppercase md:grid-cols-3">
              <div className="border border-[#333] bg-eve-black/70 px-2 py-1">
                Screen // {activeScreen}
              </div>
              <div className="border border-[#333] bg-eve-black/70 px-2 py-1">
                Phase // {viewState.matchPhase}
              </div>
              <div className="border border-[#333] bg-eve-black/70 px-2 py-1">
                Net // devnet
              </div>
              <div className="border border-[#333] bg-eve-black/70 px-2 py-1">Match // {viewState.matchId}</div>
              <div className="border border-[#333] bg-eve-black/70 px-2 py-1">
                Synced // {formatIsoTime(viewState.lastSyncedAt)}
              </div>
              <div className="border border-[#333] bg-eve-black/70 px-2 py-1">
                Team Score // {viewState.weightedScore}
              </div>
            </div>
          </div>
          {(lastUiError || viewState.lastError) && (
            <p className="mt-3 border border-eve-red bg-eve-red/10 px-2 py-1 font-[var(--font-mono)] text-xs uppercase text-eve-red">
              {lastUiError ?? viewState.lastError}
            </p>
          )}
        </header>

        {activeScreen === "S-001" && (
          <section className="grid gap-4 xl:grid-cols-[1.2fr,1fr,1fr]">
            <article className="panel p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-[var(--font-mono)] text-sm uppercase text-eve-yellow">S-001 // Mission Card Preview</h2>
                <span className="text-[11px] uppercase text-eve-offwhite/70">3x3 Template Locked After Start</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {viewState.boardSlots.length === 0 && (
                  <div className="col-span-3 border border-dashed border-[#333] p-6 text-center text-xs uppercase text-eve-offwhite/60">
                    No card online. Create room to draft.
                  </div>
                )}
                {viewState.boardSlots.map((slot) => (
                  <button
                    key={slot.slotId}
                    type="button"
                    onClick={() => setFocusedSlotId(slot.slotId)}
                    className={`min-h-28 border p-2 text-left ${slotTone(slot.status, focusedSlotId === slot.slotId)}`}
                  >
                    <p className="font-[var(--font-mono)] text-[10px] uppercase text-eve-yellow">{slot.slotId}</p>
                    <p className="mt-1 text-xs leading-snug">{slot.label}</p>
                    <p className="mt-2 text-[10px] uppercase text-eve-offwhite/70">Weight {slot.weight}</p>
                  </button>
                ))}
              </div>
            </article>

            <article className="panel p-4 md:p-5">
              <h2 className="mb-3 font-[var(--font-mono)] text-sm uppercase text-eve-yellow">Fee Breakdown Panel</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between border-b border-[#222] pb-1">
                  <dt className="uppercase text-eve-offwhite/70">Gross Pool</dt>
                  <dd className="font-[var(--font-mono)]">{viewState.settlement.grossPool.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-[#222] pb-1">
                  <dt className="uppercase text-eve-offwhite/70">Platform Fee</dt>
                  <dd className="font-[var(--font-mono)]">{viewState.settlement.platformFee.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-[#222] pb-1">
                  <dt className="uppercase text-eve-offwhite/70">Host Fee</dt>
                  <dd className="font-[var(--font-mono)]">{viewState.settlement.hostFee.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="uppercase text-eve-offwhite/70">Payout Pool</dt>
                  <dd className="font-[var(--font-mono)] text-eve-yellow">{viewState.settlement.payoutPool.toFixed(2)}</dd>
                </div>
              </dl>
              <p className="mt-3 border border-[#333] bg-eve-black/60 px-2 py-1 text-xs uppercase text-eve-offwhite/75">
                Settlement ID // {viewState.settlement.settlementId}
              </p>
            </article>

            <article className="panel p-4 md:p-5">
              <h2 className="mb-3 font-[var(--font-mono)] text-sm uppercase text-eve-yellow">Squad Readiness Matrix</h2>
              <ul className="space-y-2">
                {SQUAD_MEMBERS.map((member) => (
                  <li key={member.id} className="flex items-center justify-between border border-[#333] px-2 py-2">
                    <div>
                      <p className="font-[var(--font-mono)] text-xs uppercase">{member.callsign}</p>
                      <p className="text-[11px] uppercase text-eve-offwhite/65">{member.role}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleReady(member.id)}
                      className={`border px-2 py-1 font-[var(--font-mono)] text-[11px] uppercase ${
                        readiness[member.id]
                          ? "border-eve-yellow bg-eve-yellow/10 text-eve-yellow"
                          : "border-[#333] bg-eve-black text-eve-offwhite"
                      }`}
                    >
                      {readiness[member.id] ? "Ready" : "Standby"}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs uppercase text-eve-offwhite/70">
                Ready Status // {readyCount}/{SQUAD_MEMBERS.length}
              </p>
            </article>

            <article className="panel space-y-3 p-4 md:col-span-3 md:p-5">
              <h2 className="font-[var(--font-mono)] text-sm uppercase text-eve-yellow">Room Ops</h2>
              <form onSubmit={onCreateRoom} className="grid gap-2 md:grid-cols-[200px,1fr]">
                <label className="text-xs uppercase tracking-wide text-eve-offwhite/80">
                  Entry Fee (LUX)
                  <input
                    value={entryFee}
                    onChange={(event) => setEntryFee(event.target.value)}
                    className="mt-1 w-full border border-[#333] bg-eve-black px-3 py-2 font-[var(--font-mono)] text-sm"
                  />
                </label>
                <button type="submit" className="tactical-btn px-3 py-2 font-[var(--font-mono)] text-sm">
                  Create Room + Draft Card
                </button>
              </form>
              <div className="grid gap-2 md:grid-cols-3">
                <button
                  type="button"
                  onClick={() => onToggleReady("pilot-demo")}
                  className="border border-[#333] bg-eve-grey px-3 py-2 font-[var(--font-mono)] text-sm uppercase"
                >
                  Toggle Self Ready
                </button>
                <button
                  type="button"
                  onClick={() => controller.onStartMatch()}
                  disabled={!canInitiateMatch}
                  className={`px-3 py-2 font-[var(--font-mono)] text-sm uppercase ${
                    canInitiateMatch
                      ? "tactical-btn"
                      : "cursor-not-allowed border border-[#333] bg-eve-black text-eve-offwhite/50"
                  }`}
                >
                  Initiate Match
                </button>
                <button
                  type="button"
                  onClick={() => controller.onRefreshMatchState()}
                  className="border border-[#333] bg-eve-black px-3 py-2 font-[var(--font-mono)] text-sm uppercase"
                >
                  Sync Room Snapshot
                </button>
              </div>
            </article>
          </section>
        )}

        {activeScreen === "S-002" && (
          <section className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[1.3fr,1fr]">
              <article className="panel p-4 md:p-5">
                <div className="mb-3 flex items-center justify-between border-b border-[#333] pb-3">
                  <h2 className="font-[var(--font-mono)] text-sm uppercase text-eve-yellow">
                    S-002 // Bingo Combat Command Deck
                  </h2>
                  <span className="text-[11px] uppercase text-eve-offwhite/70">
                    Lines {viewState.completedLineCount} / Opportunities {viewState.opportunityLineCount}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {viewState.boardSlots.map((slot) => (
                    <button
                      key={slot.slotId}
                      type="button"
                      onClick={() => setFocusedSlotId(slot.slotId)}
                      className={`min-h-28 border p-2 text-left md:min-h-32 ${slotTone(
                        slot.status,
                        focusedSlotId === slot.slotId
                      )}`}
                    >
                      <p className="font-[var(--font-mono)] text-[10px] uppercase text-eve-yellow/90">{slot.slotId}</p>
                      <p className="mt-1 text-xs leading-snug">{slot.label}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] uppercase">
                        <span>{slot.status}</span>
                        <span>W {slot.weight}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 grid gap-2 md:grid-cols-4">
                  <div className="border border-[#333] p-2 text-center">
                    <p className="text-[10px] uppercase text-eve-offwhite/65">Confirmed</p>
                    <p className="font-[var(--font-mono)] text-lg text-eve-yellow">{viewState.confirmedCount}</p>
                  </div>
                  <div className="border border-[#333] p-2 text-center">
                    <p className="text-[10px] uppercase text-eve-offwhite/65">Pending</p>
                    <p className="font-[var(--font-mono)] text-lg">{viewState.pendingCount}</p>
                  </div>
                  <div className="border border-[#333] p-2 text-center">
                    <p className="text-[10px] uppercase text-eve-offwhite/65">Rejected</p>
                    <p className="font-[var(--font-mono)] text-lg text-eve-red">{viewState.rejectedCount}</p>
                  </div>
                  <div className="border border-[#333] p-2 text-center">
                    <p className="text-[10px] uppercase text-eve-offwhite/65">Blackout</p>
                    <p className="font-[var(--font-mono)] text-lg">{viewState.blackoutReady ? "Ready" : "No"}</p>
                  </div>
                </div>
              </article>

              <aside className="space-y-4">
                <article className="panel p-4">
                  <h3 className="mb-3 font-[var(--font-mono)] text-sm uppercase text-eve-yellow">Submit Killmail</h3>
                  <form onSubmit={onSubmitKillmail} className="space-y-2">
                    <label className="block text-xs uppercase text-eve-offwhite/70">
                      Actor
                      <select
                        value={selectedActorId}
                        onChange={(event) => setSelectedActorId(event.target.value)}
                        className="mt-1 w-full border border-[#333] bg-eve-black px-2 py-2 font-[var(--font-mono)] text-xs uppercase"
                      >
                        {SQUAD_MEMBERS.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.callsign}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs uppercase text-eve-offwhite/70">
                      Killmail ID
                      <input
                        value={killmailId}
                        onChange={(event) => setKillmailId(event.target.value)}
                        placeholder="km_2026_001"
                        className="mt-1 w-full border border-[#333] bg-eve-black px-2 py-2 font-[var(--font-mono)] text-sm"
                      />
                    </label>
                    <button type="submit" className="tactical-btn w-full px-3 py-2 font-[var(--font-mono)] text-sm">
                      Submit Event
                    </button>
                  </form>
                </article>

                <article className="panel p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-[var(--font-mono)] text-sm uppercase text-eve-yellow">Live Event Feed</h3>
                    <button
                      type="button"
                      onClick={() => setIsVerificationOpen((value) => !value)}
                      className="border border-[#333] px-2 py-1 font-[var(--font-mono)] text-[11px] uppercase"
                    >
                      {isVerificationOpen ? "Hide Console" : "Open Console"}
                    </button>
                  </div>
                  <div className="max-h-64 overflow-auto border border-[#333]">
                    {eventFeed.length === 0 && (
                      <p className="p-3 text-xs uppercase text-eve-offwhite/60">Awaiting killmail signal.</p>
                    )}
                    {eventFeed.map((event) => (
                      <div key={`${event.killmailId}-${event.status}`} className="border-b border-[#222] px-2 py-2 text-xs">
                        <div className="flex items-center justify-between">
                          <p className="font-[var(--font-mono)]">{event.killmailId}</p>
                          <p className={`font-[var(--font-mono)] uppercase ${feedTone(event.status)}`}>{event.status}</p>
                        </div>
                        <p className="mt-1 uppercase text-eve-offwhite/65">
                          Actor {event.actorId} {event.slotId ? `// ${event.slotId}` : ""} // {formatIsoTime(event.occurredAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel p-4">
                  <h3 className="mb-2 font-[var(--font-mono)] text-sm uppercase text-eve-yellow">Match Controls</h3>
                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={() => controller.onRefreshMatchState()}
                      className="border border-[#333] bg-eve-black px-3 py-2 font-[var(--font-mono)] text-xs uppercase"
                    >
                      Refresh Match State
                    </button>
                    <button
                      type="button"
                      onClick={() => controller.onOpenGraceWindow()}
                      disabled={viewState.matchPhase !== "MatchRunning"}
                      className={`px-3 py-2 font-[var(--font-mono)] text-xs uppercase ${
                        viewState.matchPhase === "MatchRunning"
                          ? "border border-[#333] bg-eve-grey"
                          : "cursor-not-allowed border border-[#333] bg-eve-black text-eve-offwhite/50"
                      }`}
                    >
                      Open Grace Window
                    </button>
                    <button
                      type="button"
                      onClick={() => controller.onFinalizeSettlement()}
                      disabled={viewState.matchPhase !== "GraceWindow"}
                      className={`px-3 py-2 font-[var(--font-mono)] text-xs uppercase ${
                        viewState.matchPhase === "GraceWindow"
                          ? "border border-eve-yellow text-eve-yellow"
                          : "cursor-not-allowed border border-[#333] bg-eve-black text-eve-offwhite/50"
                      }`}
                    >
                      Finalize Settlement
                    </button>
                  </div>
                  {viewState.riskFlag && (
                    <p className="mt-2 border border-eve-red bg-eve-red/10 px-2 py-1 text-[11px] uppercase text-eve-red">
                      Risk Flag Active // score {viewState.riskScore}
                    </p>
                  )}
                </article>
              </aside>
            </div>

            {isVerificationOpen && (
              <article className="panel p-4 md:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#333] pb-3">
                  <h2 className="font-[var(--font-mono)] text-sm uppercase text-eve-yellow">
                    S-003 // Event Verification Console
                  </h2>
                  <p className="text-[11px] uppercase text-eve-offwhite/70">
                    Pending {viewState.pendingCount} // Conflicts {viewState.rejectedCount}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-[1fr,1.3fr]">
                  <div className="border border-[#333]">
                    <div className="border-b border-[#333] bg-eve-grey px-2 py-1 font-[var(--font-mono)] text-[10px] uppercase">
                      Pending Queue
                    </div>
                    {viewState.pendingEvents.length === 0 && (
                      <p className="p-3 text-xs uppercase text-eve-offwhite/60">No pending events.</p>
                    )}
                    {viewState.pendingEvents.map((event) => (
                      <button
                        key={event.killmailId}
                        type="button"
                        onClick={() => setSelectedPendingKillmailId(event.killmailId)}
                        className={`block w-full border-b border-[#222] px-2 py-2 text-left text-xs ${
                          selectedPendingEvent?.killmailId === event.killmailId ? "bg-eve-yellow/10" : "bg-transparent"
                        }`}
                      >
                        <p className="font-[var(--font-mono)]">{event.killmailId}</p>
                        <p className="mt-1 uppercase text-eve-offwhite/70">
                          Actor {event.actorId} // {formatIsoTime(event.occurredAt)}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 border border-[#333] p-3">
                    <p className="font-[var(--font-mono)] text-[10px] uppercase text-eve-yellow">Verification Detail</p>
                    {selectedPendingEvent ? (
                      <>
                        <p className="font-[var(--font-mono)] text-sm">{selectedPendingEvent.killmailId}</p>
                        <p className="text-xs uppercase text-eve-offwhite/70">
                          Rule Check // registry consensus pending
                        </p>
                        <p className="text-xs uppercase text-eve-offwhite/70">
                          Source // {selectedPendingEvent.actorId} // {formatIsoTime(selectedPendingEvent.occurredAt)}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs uppercase text-eve-offwhite/60">Select a pending event to inspect details.</p>
                    )}
                    <div className="grid gap-2 pt-2 md:grid-cols-3">
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed border border-[#333] px-2 py-2 font-[var(--font-mono)] text-[11px] uppercase text-eve-offwhite/50"
                      >
                        Confirm (Auto)
                      </button>
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed border border-[#333] px-2 py-2 font-[var(--font-mono)] text-[11px] uppercase text-eve-offwhite/50"
                      >
                        Reject (Auto)
                      </button>
                      <button
                        type="button"
                        onClick={() => controller.onRefreshMatchState()}
                        className="border border-[#333] px-2 py-2 font-[var(--font-mono)] text-[11px] uppercase"
                      >
                        Request Recheck
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </section>
        )}

        {activeScreen === "S-004" && (
          <section className="space-y-4">
            <article className="panel p-4 md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#333] pb-3">
                <div>
                  <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-eve-yellow/90">
                    S-004 // Settlement & Battle Report
                  </p>
                  <h2 className="mt-1 font-[var(--font-mono)] text-xl uppercase text-eve-yellow">Match Settled</h2>
                </div>
                <div className="text-right text-[11px] uppercase">
                  <p>Lines // {viewState.completedLineCount}</p>
                  <p>Blackout // {viewState.blackoutReady ? "Achieved" : "No"}</p>
                </div>
              </div>
            </article>

            <div className="grid gap-4 xl:grid-cols-[1fr,1fr,1.2fr]">
              <article className="panel p-4">
                <h3 className="mb-3 font-[var(--font-mono)] text-sm uppercase text-eve-yellow">Settlement Ledger</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="uppercase text-eve-offwhite/70">Settlement ID</dt>
                    <dd className="font-[var(--font-mono)]">{viewState.settlement.settlementId}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="uppercase text-eve-offwhite/70">Gross Pool</dt>
                    <dd className="font-[var(--font-mono)]">{viewState.settlement.grossPool.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="uppercase text-eve-offwhite/70">Platform Fee</dt>
                    <dd className="font-[var(--font-mono)]">{viewState.settlement.platformFee.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="uppercase text-eve-offwhite/70">Host Fee</dt>
                    <dd className="font-[var(--font-mono)]">{viewState.settlement.hostFee.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-[#333] pt-2">
                    <dt className="uppercase text-eve-offwhite/70">Payout Pool</dt>
                    <dd className="font-[var(--font-mono)] text-eve-yellow">{viewState.settlement.payoutPool.toFixed(2)}</dd>
                  </div>
                </dl>
              </article>

              <article className="panel p-4">
                <h3 className="mb-3 font-[var(--font-mono)] text-sm uppercase text-eve-yellow">Contribution Ranking</h3>
                <div className="max-h-64 overflow-auto border border-[#333]">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#333] bg-eve-grey">
                        <th className="px-2 py-1 font-[var(--font-mono)] uppercase">Pilot</th>
                        <th className="px-2 py-1 font-[var(--font-mono)] uppercase">Score</th>
                        <th className="px-2 py-1 font-[var(--font-mono)] uppercase">Payout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributionRows.map((row) => (
                        <tr key={row.id} className="border-b border-[#222]">
                          <td className="px-2 py-1 font-[var(--font-mono)]">
                            {row.callsign}
                            <span className="ml-1 text-[10px] uppercase text-eve-offwhite/60">{row.role}</span>
                          </td>
                          <td className="px-2 py-1">{row.score}</td>
                          <td className="px-2 py-1">{row.payout.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="panel p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-[var(--font-mono)] text-sm uppercase text-eve-yellow">Battle Report</h3>
                  <button
                    type="button"
                    onClick={onShareReport}
                    className="border border-[#333] px-2 py-1 font-[var(--font-mono)] text-[11px] uppercase"
                  >
                    Share Report
                  </button>
                </div>
                <div className="max-h-64 overflow-auto border border-[#333]">
                  {viewState.reportEntries.length === 0 ? (
                    <p className="p-3 text-xs uppercase text-eve-offwhite/60">No report entries yet.</p>
                  ) : (
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#333] bg-eve-grey">
                          <th className="px-2 py-1 font-[var(--font-mono)] uppercase">Killmail</th>
                          <th className="px-2 py-1 font-[var(--font-mono)] uppercase">Slot</th>
                          <th className="px-2 py-1 font-[var(--font-mono)] uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewState.reportEntries.map((row, index) => (
                          <tr key={`${row.killmailId}-${index}`} className="border-b border-[#222]">
                            <td className="px-2 py-1 font-[var(--font-mono)]">{row.killmailId}</td>
                            <td className="px-2 py-1">{row.slotId}</td>
                            <td className={`px-2 py-1 ${row.status === "Rejected" ? "text-eve-red" : "text-eve-yellow"}`}>
                              {row.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </article>
            </div>

            <article className="panel space-y-3 p-4">
              <h3 className="font-[var(--font-mono)] text-sm uppercase text-eve-yellow">Settlement Actions</h3>
              <div className="grid gap-2 md:grid-cols-[220px,1fr,1fr]">
                <input
                  value={pilotId}
                  onChange={(event) => setPilotId(event.target.value)}
                  className="border border-[#333] bg-eve-black px-3 py-2 font-[var(--font-mono)] text-sm"
                  placeholder="pilot id"
                />
                <button
                  type="button"
                  onClick={() => controller.onClaimSettlement(pilotId)}
                  className="tactical-btn px-3 py-2 font-[var(--font-mono)] text-sm"
                >
                  Claim Settlement
                </button>
                <button
                  type="button"
                  onClick={onReQueue}
                  className="border border-[#333] bg-eve-grey px-3 py-2 font-[var(--font-mono)] text-sm uppercase"
                >
                  Re-Queue (Same Fee)
                </button>
              </div>
              {viewState.settlementClaimedBy && (
                <p className="border border-eve-yellow/40 bg-eve-yellow/10 px-2 py-1 text-xs uppercase text-eve-yellow">
                  Claimed By // {viewState.settlementClaimedBy}
                </p>
              )}
            </article>
          </section>
        )}
      </section>
    </main>
  );
}
