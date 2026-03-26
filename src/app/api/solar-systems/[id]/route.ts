import { NextResponse } from "next/server";
import { getSolarSystemDetailById } from "@/server/solarSystemRuntime";
import { getProjectionRuntimeMeta } from "@/server/runtimeProjectionStore";

export const dynamic = "force-dynamic";

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = parseBoolean(searchParams.get("refresh")) ?? false;
  const params = await context.params;
  const systemId = Number(params.id);

  if (!Number.isFinite(systemId) || systemId < 0) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "SOLAR_SYSTEM_ID_INVALID",
          message: "Solar system id must be a non-negative number"
        }
      },
      { status: 400 }
    );
  }

  try {
    const system = await getSolarSystemDetailById(systemId, { forceRefresh });

    if (!system) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "SOLAR_SYSTEM_NOT_FOUND",
            message: `Solar system ${systemId} was not found`
          }
        },
        { status: 404 }
      );
    }

    const stale = getProjectionRuntimeMeta().solarSystems.stale;
    return NextResponse.json(stale ? { system, stale } : { system });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to query solar system detail";

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "SOLAR_SYSTEM_DETAIL_QUERY_ERROR",
          message
        }
      },
      { status: 500 }
    );
  }
}
