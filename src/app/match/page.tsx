import { Suspense } from "react";
import { FuelFrogMatchScreen } from "@/view/screens/FuelFrogMatchScreen";

export default function MatchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 text-[#e0e0e0]">
          <div className="border border-[#e5b32b]/40 bg-[#080808]/96 px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-[#e5b32b]">
            Initializing live match surface...
          </div>
        </main>
      }
    >
      <FuelFrogMatchScreen />
    </Suspense>
  );
}
