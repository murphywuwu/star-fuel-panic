import { NextResponse } from "next/server";
import { getSolarSystemMapPoints } from "@/server/solarSystemRuntime";
import type { SolarSystemMapLevel } from "@/types/solarSystem";

export const dynamic = "force-dynamic";

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true" || value === "1") {
    return true;
  }
  if (value === "false" || value === "0") {
    return false;
  }
  return undefined;
}

function parseInteger(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  return Math.floor(parsed);
}

function parseLevel(value: string | null): SolarSystemMapLevel {
  if (value === "constellation" || value === "system") {
    return value;
  }
  return "region";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = parseLevel(searchParams.get("level"));
  const regionId = parseInteger(searchParams.get("regionId"));
  const constellationId = parseInteger(searchParams.get("constellationId"));
  const limit = parseInteger(searchParams.get("limit"));
  const cursor = searchParams.get("cursor");
  const forceRefresh = parseBoolean(searchParams.get("refresh")) ?? false;

  if (level === "constellation" && typeof regionId !== "number") {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "SOLAR_SYSTEM_MAP_REGION_REQUIRED",
          message: "regionId is required when level=constellation"
        }
      },
      { status: 400 }
    );
  }

  if (level === "system" && typeof constellationId !== "number") {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "SOLAR_SYSTEM_MAP_CONSTELLATION_REQUIRED",
          message: "constellationId is required when level=system"
        }
      },
      { status: 400 }
    );
  }

  try {
    const overview = await getSolarSystemMapPoints(
      {
        level,
        regionId,
        constellationId,
        limit,
        cursor
      },
      { forceRefresh }
    );

    return NextResponse.json({
      ...overview,
      metadata: {
        normalized: true,
        coordinateSource: "world_api"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to query solar system map";

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "SOLAR_SYSTEM_MAP_QUERY_ERROR",
          message
        }
      },
      { status: 500 }
    );
  }
}
