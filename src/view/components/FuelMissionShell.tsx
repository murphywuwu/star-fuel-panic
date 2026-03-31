"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useFuelMissionShellController } from "@/controller/useFuelMissionShellController";
import type { ReactNode } from "react";
import type { MissionPhase } from "@/types/fuelMission";
import { TacticalButton } from "@/view/components/TacticalButton";

const WalletConnectBridge = dynamic(
  () => import("@/view/components/WalletConnectBridge").then((mod) => mod.WalletConnectBridge),
  {
    ssr: false,
    loading: () => null
  }
);

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
  {
    href: "/lobby",
    label: "MISSION LOBBY",
    shortLabel: "LOBBY",
    code: "LBY-01",
    hint: "Discover matches, set position, and route into squad planning"
  },
  {
    href: "/planning",
    label: "TEAM REGISTRY",
    shortLabel: "TEAMS",
    code: "REG-02",
    hint: "Review current team count and register a new formation"
  },
  {
    href: "/team",
    label: "SQUAD DOSSIER",
    shortLabel: "DOSSIER",
    code: "SQD-03",
    hint: "Inspect active squad structure, role occupancy, and deployment history"
  },
  {
    href: "/match",
    label: "LIVE MATCH",
    shortLabel: "MATCH",
    code: "RUN-04",
    hint: "Submit supply runs, watch the board, beat the timer"
  },
  {
    href: "/settlement",
    label: "SETTLEMENT LEDGER",
    shortLabel: "PAYOUT",
    code: "SET-05",
    hint: "Review payouts, MVP, and final rewards"
  }
];

function formatStatusLabel(status: MissionPhase) {
  if (status === "pre_start") return "PreStart";
  if (status === "running") return "Running";
  if (status === "panic") return "Panic";
  if (status === "settling") return "Settling";
  if (status === "settled") return "Settled";
  return "Lobby";
}

function navPillClass(active: boolean) {
  return active
    ? "border-eve-red bg-eve-red text-black shadow-[0_0_0_1px_rgba(255,95,0,0.28),0_0_24px_rgba(255,95,0,0.16)]"
    : "border-eve-red/20 bg-[#101010]/82 text-eve-offwhite/72 hover:border-eve-red/45 hover:text-eve-offwhite";
}

function navRailClass(active: boolean) {
  return active
    ? "border-eve-red bg-eve-red/10 text-eve-offwhite shadow-[inset_0_0_0_1px_rgba(255,95,0,0.16)]"
    : "border-transparent bg-transparent text-eve-offwhite/72 hover:border-eve-red/35 hover:bg-[#131313] hover:text-eve-offwhite";
}

const BRAND_NAME = "Star Fuel Panic";
const BRAND_MASCOT_SRC = "/mascot-hero-waving.png";

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
  const shell = useFuelMissionShellController();
  const activeNavItem = NAV_ITEMS.find((item) => item.href === activeRoute) ?? NAV_ITEMS[0];
  const phaseLabel = formatStatusLabel(phase).toUpperCase();

  return (
    <main className="min-h-screen text-eve-offwhite">
      {shell.walletBridge.shouldRender ? (
        <WalletConnectBridge
          openSignal={shell.walletBridge.openSignal}
          shouldClose={shell.walletBridge.shouldClose}
        />
      ) : null}

      <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-eve-red/25 bg-[#0e0e0e]/96 px-4 shadow-[0_0_24px_rgba(255,95,0,0.08)] backdrop-blur-md sm:px-6 lg:px-8">
        <Link
          href="/lobby"
          prefetch
          className="inline-flex min-w-0 items-center gap-3 whitespace-nowrap text-eve-red transition hover:text-[#ffb599]"
        >
          <span className="flex h-10 w-10 items-center justify-center border border-eve-red/35 bg-[#080808] shadow-[0_0_18px_rgba(255,95,0,0.12)] sm:h-11 sm:w-11">
            <Image
              src={BRAND_MASCOT_SRC}
              alt={`${BRAND_NAME} mascot`}
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-contain"
            />
          </span>
          <span className="min-w-0">
            <span className="block text-[9px] font-black uppercase tracking-[0.32em] text-eve-red/70 sm:text-[10px]">
              Frontier Ops
            </span>
            <span className="hidden text-lg font-black italic tracking-[-0.05em] text-eve-offwhite sm:block sm:text-2xl">
              {BRAND_NAME}
            </span>
            <span className="text-base font-black italic tracking-[-0.04em] text-eve-offwhite sm:hidden">SFP</span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center xl:flex">
          <div className="flex min-w-0 max-w-2xl flex-1 items-center gap-4 border border-eve-red/20 bg-[#121212]/88 px-4 py-2 shadow-[0_0_0_1px_rgba(255,95,0,0.05)]">
            <div className="flex h-10 w-12 shrink-0 items-center justify-center border border-eve-red/35 bg-[#080808] text-[10px] font-black uppercase tracking-[0.2em] text-eve-red">
              {activeNavItem.code}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.34em] text-eve-red/70">Active Route</p>
              <p className="truncate text-xs font-black uppercase tracking-[0.22em] text-eve-offwhite">
                {activeNavItem.label}
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.16em] text-eve-offwhite/52">
                {activeNavItem.hint}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-3 border border-eve-red/20 bg-[#121212]/88 px-3 py-2 sm:flex">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.32em] text-eve-red/70">Phase</p>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-eve-offwhite">{phaseLabel}</p>
            </div>
            <div className="hidden h-8 w-px bg-eve-red/15 md:block" />
            <div className="hidden md:block">
              <p className="text-[9px] font-black uppercase tracking-[0.32em] text-eve-red/70">Route</p>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-eve-offwhite">{activeNavItem.code}</p>
            </div>
          </div>
          <Link
            href="/match"
            prefetch
            className="inline-flex items-center border border-eve-red bg-eve-red px-3 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-black transition hover:bg-[#ffb599] sm:px-4 sm:text-xs"
          >
            PANIC
          </Link>
        </div>
      </nav>

      <div className="fixed inset-x-0 top-16 z-40 flex h-12 items-center border-b border-eve-red/12 bg-[#111111]/94 px-3 backdrop-blur-md lg:hidden">
        <div className="flex w-full gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === activeRoute;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 border px-3 py-1.5 text-left transition ${navPillClass(isActive)}`}
              >
                <span className="block text-[9px] font-black uppercase tracking-[0.28em] opacity-70">{item.code}</span>
                <span className="mt-1 block text-[11px] font-black uppercase tracking-[0.2em]">{item.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 overflow-hidden border-r border-eve-red/15 bg-[#1c1b1b]/96 backdrop-blur-md lg:flex lg:flex-col">
        <div className="shrink-0 border-b border-eve-red/15 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-eve-red text-black">
              <span className="text-sm font-black">◉</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-eve-red">STRAT_CMD</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-eve-offwhite/60">SECTOR_04</p>
            </div>
          </div>
          <div className="mt-4 border border-eve-red/15 bg-[#080808]/80 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-eve-red">Wallet Identity</p>
            <div className="mt-3 space-y-1 text-xs text-eve-offwhite/85">
              <p>ADDRESS: {shell.wallet.shortAddress}</p>
              <p className={shell.wallet.isBalanceLow ? "text-eve-red" : "text-eve-offwhite/85"}>
                BALANCE: {shell.wallet.balanceLabel}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {!shell.viewState.isMounted ? (
                <TacticalButton disabled>CONNECT</TacticalButton>
              ) : !shell.authState.isConnected ? (
                <>
                  <TacticalButton onClick={shell.actions.connectWallet} disabled={shell.authState.isConnecting}>
                    {shell.authState.isConnecting ? "CONNECTING" : "CONNECT"}
                  </TacticalButton>
                  {!shell.wallet.hasEveWallet ? (
                    <p className="basis-full text-[10px] uppercase tracking-[0.14em] text-eve-red">
                      EVE WALLET PROVIDER NOT DETECTED
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <TacticalButton tone="ghost" onClick={shell.actions.refreshBalance}>
                    REFRESH
                  </TacticalButton>
                  <TacticalButton tone="danger" onClick={shell.actions.disconnectWallet}>
                    EXIT
                  </TacticalButton>
                </>
              )}
            </div>
            {shell.wallet.notice ? (
              <p className="mt-3 border border-eve-red/25 bg-[#080808] px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/90">
                {shell.wallet.notice}
              </p>
            ) : null}
            {shell.wallet.showProviderList ? (
              <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-eve-offwhite/55">
                PROVIDERS: {shell.wallet.providerNames}
              </p>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                aria-current={item.href === activeRoute ? "page" : undefined}
                className={`flex items-start gap-3 border-l-4 px-4 py-4 text-left transition ${navRailClass(
                  item.href === activeRoute
                )}`}
              >
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.24em]">{item.label}</p>
                  <p className="mt-1 text-[10px] leading-4 uppercase tracking-[0.16em] text-eve-offwhite/60">
                    {item.hint}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-eve-red/15 p-4">
          <button className="w-full border border-eve-red/50 bg-transparent px-3 py-3 text-xs font-black uppercase tracking-[0.22em] text-eve-red transition hover:bg-eve-red/10">
            DEPLOY
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <div className="fixed left-0 right-0 top-28 z-30 flex h-6 items-center overflow-hidden border-b border-eve-red/10 bg-[#1c1b1b]/90 px-4 text-[10px] uppercase tracking-[0.22em] text-eve-red/75 backdrop-blur-sm lg:left-64 lg:top-16">
          <div className="flex whitespace-nowrap">
            <span className="mr-6">SYS_READY: {phaseLabel}</span>
            <span className="mr-6">DATA_STREAM: [{roomId ?? "NO_ROOM"}]</span>
            <span className="mr-6">COUNTDOWN: {countdownSec}s</span>
            <span className="mr-6">SNAPSHOT: {staleSnapshot ? "STALE" : "LIVE"}</span>
            <span className="mr-6">LATENCY: 12ms</span>
            <span className="mr-6">SYS_READY: OK</span>
            <span className="mr-6">LINK: ACTIVE</span>
          </div>
        </div>

        <section className="grid-bg min-h-screen px-4 pb-10 pt-36 sm:px-6 lg:px-8 lg:pt-28">
          {bannerMessage ? (
            <div
              className={
                bannerTone === "error"
                  ? "mb-6 border border-eve-red/60 bg-eve-red/20 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite"
                  : "mb-6 border border-eve-red/40 bg-eve-red/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-eve-offwhite"
              }
            >
              {bannerMessage}
            </div>
          ) : null}

          <section className="relative overflow-hidden border border-eve-red/15 bg-[linear-gradient(180deg,rgba(18,18,18,0.95)_0%,rgba(13,13,13,0.98)_100%)] px-6 py-10 shadow-[0_0_0_1px_rgba(255,95,0,0.05),0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,95,0,0.14),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(229,179,43,0.08),transparent_24%)]" />
            <div className="relative flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="h-px w-10 bg-eve-red" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-eve-red">TACTICAL RESOLUTION COMPLETE</p>
                <div className="h-px w-10 bg-eve-red" />
              </div>
              <h1 className="max-w-5xl text-4xl font-black italic uppercase leading-none tracking-[-0.08em] text-eve-offwhite md:text-6xl">
                {title}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-eve-offwhite/75">{subtitle}</p>
            </div>
          </section>

          <div className="mt-6 space-y-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
