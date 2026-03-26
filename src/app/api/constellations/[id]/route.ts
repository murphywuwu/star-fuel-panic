import { NextResponse } from "next/server";
import { getConstellationById } from "@/server/constellationRuntime";
import { getProjectionRuntimeMeta } from "@/server/runtimeProjectionStore";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const constellationId = Number(id);
  if (!Number.isFinite(constellationId) || constellationId < 0) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "constellation id must be a non-negative number"
        }
      },
      { status: 400 }
    );
  }

  try {
    const result = await getConstellationById(constellationId);
    if (!result) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "NOT_FOUND",
            message: "constellation not found"
          }
        },
        { status: 404 }
      );
    }
    const meta = getProjectionRuntimeMeta();
    const stale = meta.constellations.stale || meta.solarSystems.stale;
    return NextResponse.json(stale ? { ...result, stale } : result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get constellation detail";
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "CONSTELLATION_DETAIL_QUERY_ERROR",
          message
        }
      },
      { status: 500 }
    );
  }
}
