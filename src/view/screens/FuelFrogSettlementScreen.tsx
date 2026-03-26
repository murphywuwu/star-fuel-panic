"use client";

import Link from "next/link";
import { useFuelFrogSettlementScreenController } from "@/controller/useFuelFrogSettlementScreenController";
import { MatchShell } from "@/view/components/MatchShell";
import { BillTable, EarningsCard, ScoreSummary } from "@/view/components/SettlementModules";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

export function FuelFrogSettlementScreen() {
  const controller = useFuelFrogSettlementScreenController();
  const { mission, auth, view, actions } = controller;
  const state = mission.state;
  const authState = auth.state;

  return (
    <MatchShell
      title="MISSION SUCCESS"
      subtitle="Read score, verify bill flow, and confirm your final payout."
      activeRoute="/settlement"
      phase={state.phase}
      countdownSec={state.countdownSec}
      roomId={state.room?.roomId}
      staleSnapshot={state.staleSnapshot}
      bannerMessage={!authState.isConnected ? "BROWSE MODE // CONNECT WALLET TO FINALIZE OR CLAIM REWARDS" : undefined}
    >
      <ScoreSummary contributions={state.contributions} teams={state.teams} teamScore={state.teamScore} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <BillTable settlement={state.settlement} />
        <EarningsCard
          pilotName={view.pilotEarnings.pilotName}
          payoutAmount={view.pilotEarnings.payoutAmount}
          settlementId={state.settlement.settlementId}
        />
      </section>

      <TacticalPanel title="Settlement Actions" eyebrow="Confirm Flow">
        <div className="flex flex-wrap gap-2">
          <TacticalButton onClick={actions.handleSettle} disabled={!authState.isConnected}>
            Finalize Bill
          </TacticalButton>
          <TacticalButton tone="ghost" onClick={actions.showAuditLog}>
            View Audit Log
          </TacticalButton>
          <Link
            href="/lobby"
            className="inline-flex border border-eve-red bg-eve-red px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#ffb599]"
          >
            Confirm & Continue
          </Link>
        </div>
        <p className="mt-3 border border-eve-yellow/35 bg-eve-black/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-eve-offwhite">
          {view.message}
        </p>
      </TacticalPanel>
    </MatchShell>
  );
}
