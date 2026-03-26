import { NextResponse } from "next/server";
import { listConstellations } from "@/server/constellationRuntime";
import { getProjectionRuntimeMeta } from "@/server/runtimeProjectionStore";

export const dynamic = "force-dynamic";

function listRegions(
  constellations: Awaited<ReturnType<typeof listConstellations>>
) {
  const grouped = new Map<
    number,
    {
      regionId: number;
      constellationCount: number;
      selectableSystemCount: number;
      urgentNodeCount: number;
      warningNodeCount: number;
      sortScore: number;
    }
  >();

  for (const constellation of constellations) {
    const current = grouped.get(constellation.regionId) ?? {
      regionId: constellation.regionId,
      constellationCount: 0,
      selectableSystemCount: 0,
      urgentNodeCount: 0,
      warningNodeCount: 0,
      sortScore: 0
    };

    current.constellationCount += 1;
    current.selectableSystemCount += constellation.selectableSystemCount;
    current.urgentNodeCount += constellation.urgentNodeCount;
    current.warningNodeCount += constellation.warningNodeCount;
    current.sortScore += constellation.sortScore;
    grouped.set(constellation.regionId, current);
  }

  return [...grouped.values()].sort(
    (left, right) => right.sortScore - left.sortScore || left.regionId - right.regionId
  );
}

export async function GET(request: Request) {
  try {
    const constellations = await listConstellations();
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view");
    const regionIdRaw = searchParams.get("regionId");
    const regionId = Number(regionIdRaw);

    if (regionIdRaw && (!Number.isFinite(regionId) || regionId < 0)) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_INPUT",
            message: "regionId must be a non-negative number"
          }
        },
        { status: 400 }
      );
    }

    const payload =
      view === "regions"
        ? { regions: listRegions(constellations) }
        : Number.isFinite(regionId) && regionId >= 0
          ? { constellations: constellations.filter((item) => item.regionId === regionId) }
          : { constellations };

    const meta = getProjectionRuntimeMeta();
    const stale = meta.constellations.stale || meta.solarSystems.stale;
    return NextResponse.json(stale ? { ...payload, stale } : payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list constellations";
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "CONSTELLATION_QUERY_ERROR",
          message
        }
      },
      { status: 500 }
    );
  }
}
