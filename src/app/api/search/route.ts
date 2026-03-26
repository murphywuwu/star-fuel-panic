import { NextResponse } from "next/server";
import { searchSolarSystemsAndConstellations } from "@/server/constellationRuntime";
import { getProjectionRuntimeMeta } from "@/server/runtimeProjectionStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  try {
    const hits = await searchSolarSystemsAndConstellations(q);
    const meta = getProjectionRuntimeMeta();
    const stale = meta.constellations.stale || meta.solarSystems.stale;
    return NextResponse.json(stale ? { q, hits, stale } : { q, hits });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "SEARCH_QUERY_ERROR",
          message
        }
      },
      { status: 500 }
    );
  }
}
