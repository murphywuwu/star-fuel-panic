import { NextResponse } from "next/server";
import { listMatches } from "@/server/matchRuntime";
import type { MatchFilters, MatchSortBy, MatchStatus } from "@/types/match";

export const dynamic = "force-dynamic";

function parseSortBy(value: string | null): MatchSortBy | undefined {
  if (value === "urgency" || value === "prize_pool" || value === "created_at") {
    return value;
  }
  return undefined;
}

function parseStatus(value: string | null): MatchStatus | undefined {
  if (value === "lobby" || value === "prestart" || value === "running" || value === "panic" || value === "settling" || value === "settled") {
    return value;
  }
  return undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitRaw = Number(searchParams.get("limit"));

  const filters: MatchFilters = {
    sortBy: parseSortBy(searchParams.get("sortBy")),
    status: parseStatus(searchParams.get("status")),
    limit: Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : undefined
  };

  const matches = listMatches(filters);

  return NextResponse.json({
    deprecated: true,
    message: "Use GET /api/matches as primary discovery endpoint",
    matches
  });
}
