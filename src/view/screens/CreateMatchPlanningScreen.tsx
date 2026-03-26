"use client";

import Link from "next/link";
import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import { CreateMatchScreen } from "@/view/screens/CreateMatchScreen";

export function CreateMatchPlanningScreen() {
  return (
    <FuelMissionShell
      title="MATCH CREATION / SPONSORSHIP LOCK"
      subtitle="Draft a free or precision fuel match, configure the pool, and publish it into the mission lobby."
      activeRoute="/planning"
      phase="lobby"
      countdownSec={0}
      staleSnapshot={false}
    >
      <section className="space-y-4">
        <CreateMatchScreen />

        <div className="flex flex-wrap gap-3">
          <Link
            href="/planning"
            className="inline-flex border border-eve-yellow/40 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-eve-yellow transition hover:border-eve-yellow hover:bg-eve-yellow/10"
          >
            Open Team Lobby
          </Link>
          <Link
            href="/lobby"
            className="inline-flex border border-eve-offwhite/20 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite transition hover:border-eve-offwhite/40 hover:bg-eve-offwhite/5"
          >
            Back To Lobby
          </Link>
        </div>
      </section>
    </FuelMissionShell>
  );
}
