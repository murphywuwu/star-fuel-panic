"use client";

import Link from "next/link";
import { Suspense } from "react";
import { NodeMap3D } from "@/view/components/NodeMap3D";

export default function NodesMapPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-[#e0e0e0]">
      <header className="border-b border-[#333333] bg-[#080808]/96 px-4 py-3 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#e5b32b]">frontier cartography // live node map</p>
            <h1 className="mt-2 font-mono text-2xl uppercase tracking-[0.08em] md:text-3xl">Solar System Node Map</h1>
          </div>
          <div className="grid gap-1 text-right text-[10px] uppercase tracking-[0.18em] text-[#e0e0e0]/55">
            <Link
              href="/lobby"
              className="justify-self-end border border-[#e5b32b]/60 px-2 py-1 text-[10px] tracking-[0.14em] text-[#e5b32b] hover:border-[#e5b32b]"
            >
              Back To Lobby
            </Link>
            <span>Region to Constellation to System to Nodes</span>
            <span>2D tactical ingress // 3D local inspect</span>
          </div>
        </div>
      </header>

      <div className="mx-auto h-[calc(100vh-88px)] max-w-[1800px]">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center border-t border-[#333333] bg-[#080808]">
              <div className="border border-[#e5b32b]/40 bg-[#080808]/96 px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-[#e5b32b]">
                Initializing cartography view...
              </div>
            </div>
          }
        >
          <NodeMap3D className="h-full w-full" />
        </Suspense>
      </div>
    </main>
  );
}
