"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuthController, walletErrorMessage } from "@/controller/useAuthController";
import { useFuelMissionController } from "@/controller/useFuelMissionController";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { BillTable, EarningsCard, ScoreSummary } from "@/view/components/SettlementModules";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

export function FuelFrogSettlementScreen() {
  const { state, actions } = useFuelMissionController();
  const { state: authState } = useAuthController();
  const [message, setMessage] = useState("READY // CONNECT WALLET TO CLAIM & FINALIZE");

  const pilotEarnings = useMemo(() => {
    const topContribution = state.contributions[0];
    if (!topContribution) {
      return { pilotName: "Pilot Alpha", payoutAmount: 0 };
    }

    const payout = state.settlement.memberPayouts.find((item) => item.playerId === topContribution.playerId)?.amount ?? 0;
    return { pilotName: topContribution.name, payoutAmount: payout };
  }, [state.contributions, state.settlement.memberPayouts]);

  const handleSettle = () => {
    if (!authState.isConnected) {
      setMessage("WALLET NOT CONNECTED // SETTLEMENT ACTION LOCKED");
      return;
    }
    const result = actions.onSettle();
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${walletErrorMessage(result.errorCode, result.message)}`);
      return;
    }
    setMessage(`SETTLEMENT READY // ${result.payload?.settlementId ?? "N/A"}`);
  };

  return (
    <FuelMissionShell
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
          pilotName={pilotEarnings.pilotName}
          payoutAmount={pilotEarnings.payoutAmount}
          settlementId={state.settlement.settlementId}
        />
      </section>

      <TacticalPanel title="Settlement Actions" eyebrow="Confirm Flow">
        <div className="flex flex-wrap gap-2">
          <TacticalButton onClick={handleSettle} disabled={!authState.isConnected}>
            Finalize Bill
          </TacticalButton>
          <TacticalButton tone="ghost" onClick={() => setMessage("AUDIT LOG AVAILABLE IN EVENT FEED")}>
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
          {message}
        </p>
      </TacticalPanel>
    </FuelMissionShell>
  );
}
