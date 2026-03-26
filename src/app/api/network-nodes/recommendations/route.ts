import { NextResponse } from "next/server";
import { getNodeRecommendations } from "@/server/nodeRecommendationRuntime";

export const dynamic = "force-dynamic";

function parsePositiveInt(value: string | null): number | undefined {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }
  return undefined;
}

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currentSystem = parsePositiveInt(searchParams.get("currentSystem"));

  if (!currentSystem) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "currentSystem is required"
        }
      },
      { status: 400 }
    );
  }

  try {
    const maxJumps = parsePositiveInt(searchParams.get("maxJumps"));
    const limit = parsePositiveInt(searchParams.get("limit"));
    const hasMatch = parseBoolean(searchParams.get("hasMatch"));
    const urgency = searchParams.get("urgency") ?? undefined;
    const forceRefresh = parseBoolean(searchParams.get("refresh")) ?? false;

    const result = await getNodeRecommendations(
      currentSystem,
      {
        ...(maxJumps ? { maxJumps } : {}),
        ...(limit ? { limit } : {}),
        ...(typeof hasMatch === "boolean" ? { hasMatch } : {}),
        ...(urgency ? { urgency } : {})
      },
      { forceRefresh }
    );

    return NextResponse.json({
      recommendations: result.recommendations.map((item) => ({
        node: item.node,
        distanceHops: item.distance,
        urgencyWeight: item.urgencyWeight,
        score: Number(item.score.toFixed(4)),
        reason: `${item.node.urgency} @ ${item.distance} jumps`
      })),
      meta: result.meta,
      userLocation: result.userLocation
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate node recommendations";
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "CHAIN_SYNC_ERROR",
          message
        }
      },
      { status: 500 }
    );
  }
}
