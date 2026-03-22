import { NextResponse } from "next/server";
import { listMissions } from "@/server/missionRuntime";
import type { MissionFilters, MissionSortBy, MissionStatus, UrgencyLevel } from "@/types/mission";

export const dynamic = "force-dynamic";

function parseSortBy(value: string | null): MissionSortBy | undefined {
  if (value === "urgency" || value === "prize_pool" || value === "created_at" || value === "weighted") {
    return value;
  }
  return undefined;
}

function parseUrgency(value: string | null): UrgencyLevel | undefined {
  if (value === "critical" || value === "warning" || value === "safe") {
    return value;
  }
  return undefined;
}

function parseStatus(value: string | null): MissionStatus | undefined {
  if (value === "open" || value === "in_progress" || value === "settled" || value === "expired") {
    return value;
  }
  return undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitRaw = Number(searchParams.get("limit"));

  const filters: MissionFilters = {
    sortBy: parseSortBy(searchParams.get("sortBy")),
    urgency: parseUrgency(searchParams.get("urgency")),
    status: parseStatus(searchParams.get("status")),
    limit: Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : undefined
  };

  const missions = listMissions(filters);

  return NextResponse.json({ missions });
}
