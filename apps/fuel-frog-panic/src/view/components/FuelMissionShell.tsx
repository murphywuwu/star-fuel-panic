import Link from "next/link";
import type { ReactNode } from "react";
import type { MissionPhase } from "@/types/fuelMission";

interface FuelMissionShellProps {
  title: string;
  subtitle: string;
  activeRoute: string;
  phase: MissionPhase;
  countdownSec: number;
  roomId?: string;
  staleSnapshot?: boolean;
  bannerMessage?: string;
  bannerTone?: "warning" | "error";
  children: ReactNode;
}

const NAV_ITEMS = [
  { href: "/lobby", label: "Lobby" },
  { href: "/planning", label: "Planning" },
  { href: "/match", label: "Match" },
  { href: "/final", label: "Final" },
  { href: "/settlement", label: "Settlement" }
];

function navClass(active: boolean) {
  if (active) {
    return "border-eve-yellow bg-eve-yellow text-eve-black";
  }
  return "border-eve-yellow/50 bg-transparent text-eve-offwhite hover:border-eve-offwhite";
}

export function FuelMissionShell({
  title,
  subtitle,
  activeRoute,
  phase,
  countdownSec,
  roomId,
  staleSnapshot,
  bannerMessage,
  bannerTone = "warning",
  children
}: FuelMissionShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6">
      {bannerMessage ? (
        <div
          className={
            bannerTone === "error"
              ? "border border-eve-red bg-eve-red/20 px-3 py-2 text-xs font-mono uppercase tracking-[0.14em] text-eve-offwhite"
              : "border border-eve-yellow/70 bg-eve-yellow/20 px-3 py-2 text-xs font-mono uppercase tracking-[0.14em] text-eve-offwhite"
          }
        >
          {bannerMessage}
        </div>
      ) : null}

      <header className="border border-eve-yellow/60 bg-eve-black/90 p-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-eve-yellow">Fuel Frog Panic</p>
        <h1 className="mt-2 font-mono text-2xl font-bold uppercase tracking-[0.08em] text-eve-offwhite">{title}</h1>
        <p className="mt-1 text-sm text-eve-offwhite/80">{subtitle}</p>
        <div className="mt-4 grid gap-2 text-xs text-eve-offwhite/90 sm:grid-cols-2 lg:grid-cols-4">
          <p>PHASE: {phase}</p>
          <p>COUNTDOWN: {countdownSec}s</p>
          <p>ROOM: {roomId ?? "NO ACTIVE ROOM"}</p>
          <p className={staleSnapshot ? "text-eve-red" : "text-eve-offwhite/90"}>
            SNAPSHOT: {staleSnapshot ? "STALE SNAPSHOT" : "LIVE FEED"}
          </p>
        </div>
      </header>

      <nav className="grid gap-2 sm:grid-cols-5">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`border px-3 py-2 text-center text-xs font-mono uppercase tracking-[0.14em] transition ${navClass(
              item.href === activeRoute
            )}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {children}
    </main>
  );
}
