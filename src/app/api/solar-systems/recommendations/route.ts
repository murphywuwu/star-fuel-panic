import { NextResponse } from "next/server";
import { getSolarSystemRecommendations } from "@/server/constellationRuntime";
import { getProjectionRuntimeMeta } from "@/server/runtimeProjectionStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const recommendations = await getSolarSystemRecommendations();
    const meta = getProjectionRuntimeMeta();
    const stale = meta.constellations.stale || meta.solarSystems.stale;
    return NextResponse.json(stale ? { recommendations, stale } : { recommendations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get recommendations";
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "SOLAR_SYSTEM_RECOMMENDATIONS_QUERY_ERROR",
          message
        }
      },
      { status: 500 }
    );
  }
}
