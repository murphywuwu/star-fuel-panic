"use client";

import { useFuelMissionController } from "@/controller/useFuelMissionController";
import type { TeamState } from "@/types/fuelMission";

function phaseTone(phase: string) {
  if (phase === "Settled") return "text-accent";
  if (phase === "FinalSprint") return "text-warning";
  return "text-slate-100";
}

function teamTotal(team: TeamState, contributions: Array<{ playerId: string; score: number }>) {
  return team.players.reduce((sum, p) => {
    const c = contributions.find((x) => x.playerId === p.playerId)?.score ?? 0;
    return sum + c;
  }, 0);
}

export function FuelFrogDashboard() {
  const { state, actions } = useFuelMissionController();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header className="rounded-xl border border-slate-700 bg-steel p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fuel Frog Panic</p>
        <h1 className="mt-2 text-2xl font-semibold">Node Logistics Command</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span className={phaseTone(state.phase)}>Phase: {state.phase}</span>
          <span>Countdown: {state.countdownSec}s</span>
          <span>Room: {state.room?.roomId ?? "N/A"}</span>
          <span>Gross Pool: {state.settlement.grossPool} LUX</span>
          <span>Payout: {state.settlement.payoutPool} LUX</span>
          <span className={state.staleSnapshot ? "text-warning" : "text-slate-300"}>
            Snapshot: {state.staleSnapshot ? "STALE" : "LIVE"}
          </span>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {state.nodes.map((node) => (
          <article key={node.nodeId} className="rounded-xl border border-slate-700 bg-steel p-4">
            <h2 className="text-lg font-medium">{node.name}</h2>
            <p className="mt-2 text-sm text-slate-300">Risk Weight: {node.riskWeight}</p>
            <p className="text-sm text-slate-300">Fill: {(node.fillRatio * 100).toFixed(0)}%</p>
            <p className="text-sm text-slate-300">Status: {node.completed ? "Completed" : "In Progress"}</p>
            <button
              type="button"
              className="mt-4 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
              onClick={() => actions.onSubmitSupplyRun(node.nodeId, "p1", "Murphy")}
            >
              Submit Supply Run
            </button>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-700 bg-steel p-4">
          <h3 className="text-lg font-medium">Contribution Board</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {state.contributions.map((p) => (
              <li key={p.playerId} className="flex items-center justify-between">
                <span>{p.name}</span>
                <span>{p.score}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-700 bg-steel p-4">
          <h3 className="text-lg font-medium">Team Scoreboard</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {state.teams.map((team) => (
              <li key={team.teamId} className="flex items-center justify-between">
                <span>{team.name}</span>
                <span>{teamTotal(team, state.contributions)}</span>
              </li>
            ))}
            {state.teams.length === 0 && <li className="text-slate-400">No teams joined</li>}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-700 bg-steel p-4">
          <h3 className="text-lg font-medium">Settlement Bill</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between"><span>Buy-in Pool</span><span>{state.settlement.playerBuyinPool}</span></li>
            <li className="flex justify-between"><span>Gross Pool</span><span>{state.settlement.grossPool}</span></li>
            <li className="flex justify-between"><span>Platform Fee</span><span>{state.settlement.platformFee}</span></li>
            <li className="flex justify-between"><span>Host Fee</span><span>{state.settlement.hostFee}</span></li>
            <li className="flex justify-between"><span>Payout Pool</span><span>{state.settlement.payoutPool}</span></li>
            <li className="flex justify-between"><span>Settlement ID</span><span>{state.settlement.settlementId ?? "Pending"}</span></li>
          </ul>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-700 bg-steel p-4">
          <h3 className="text-lg font-medium">Risk Heat</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {state.riskMarkers.slice(0, 5).map((risk) => (
              <li key={risk.id} className="flex items-center justify-between">
                <span>{risk.reason}</span>
                <span className="uppercase">{risk.severity}</span>
              </li>
            ))}
            {state.riskMarkers.length === 0 && <li className="text-slate-400">No risk marker</li>}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-700 bg-steel p-4">
          <h3 className="text-lg font-medium">Audit Trail</h3>
          <ul className="mt-3 max-h-48 space-y-2 overflow-auto text-sm">
            {state.auditLogs.slice(0, 8).map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-3">
                <span>{log.action}</span>
                <span className="text-slate-400">{log.detail}</span>
              </li>
            ))}
            {state.auditLogs.length === 0 && <li className="text-slate-400">No audit logs yet</li>}
          </ul>
        </article>
      </section>

      <footer className="flex flex-wrap gap-3">
        <button className="rounded-md border border-slate-600 px-3 py-2 text-sm" onClick={actions.onInitMission}>
          Init Mission
        </button>
        <button className="rounded-md border border-slate-600 px-3 py-2 text-sm" onClick={actions.onCreateRoom}>
          Create Room
        </button>
        <button
          className="rounded-md border border-slate-600 px-3 py-2 text-sm"
          onClick={() => actions.onJoinRoom("team-alpha", "p1", "Murphy")}
        >
          Join Team Alpha
        </button>
        <button
          className="rounded-md border border-slate-600 px-3 py-2 text-sm"
          onClick={() => actions.onJoinRoom("team-beta", "p2", "Ari")}
        >
          Join Team Beta
        </button>
        <button
          className="rounded-md border border-slate-600 px-3 py-2 text-sm"
          onClick={() =>
            actions.onLockRole("team-alpha", {
              Collector: "p1",
              Dispatcher: "p1"
            })
          }
        >
          Lock Roles
        </button>
        <button className="rounded-md border border-slate-600 px-3 py-2 text-sm" onClick={actions.onEnterPlanning}>
          Enter Planning
        </button>
        <button className="rounded-md border border-slate-600 px-3 py-2 text-sm" onClick={actions.onStartMatch}>
          Start Match
        </button>
        <button className="rounded-md border border-slate-600 px-3 py-2 text-sm" onClick={actions.onRefresh}>
          Refresh Snapshot
        </button>
        <button className="rounded-md border border-slate-600 px-3 py-2 text-sm" onClick={actions.onTick}>
          Tick +10s
        </button>
        <button className="rounded-md border border-slate-600 px-3 py-2 text-sm" onClick={actions.onSettle}>
          Finalize Settlement
        </button>
      </footer>
    </main>
  );
}
