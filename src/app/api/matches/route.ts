import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import { hydrateRuntimeProjectionFromBackendIfNeeded, persistMatchDetailToBackend } from "@/server/matchBackendStore";
import { createMatchDraft } from "@/server/matchRuntime";
import { listMatchDiscoveryItems } from "@/server/matchDiscoveryRuntime";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import type { MatchCreationMode, MatchFilters, MatchSortBy, MatchStatus } from "@/types/match";

export const dynamic = "force-dynamic";

function parseStatus(value: string | null): MatchStatus | undefined {
  if (
    value === "lobby" ||
    value === "prestart" ||
    value === "running" ||
    value === "panic" ||
    value === "settling" ||
    value === "settled"
  ) {
    return value;
  }
  return undefined;
}

function parseSortBy(value: string | null): MatchSortBy | undefined {
  if (value === "prize_pool" || value === "urgency" || value === "created_at") {
    return value;
  }
  return undefined;
}

function parseCreationMode(value: string | null): MatchCreationMode | undefined {
  if (value === "free" || value === "precision") {
    return value;
  }
  return undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitRaw = Number(searchParams.get("limit"));
  const currentSystem = Number(searchParams.get("currentSystem"));

  const filters: MatchFilters = {
    status: parseStatus(searchParams.get("status")),
    sortBy: parseSortBy(searchParams.get("sortBy")),
    creationMode: parseCreationMode(searchParams.get("creationMode") ?? searchParams.get("mode")),
    limit: Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : undefined
  };

  const matches = await listMatchDiscoveryItems({
    filters,
    currentSystemId: Number.isFinite(currentSystem) && currentSystem > 0 ? currentSystem : null
  });

  return NextResponse.json({ matches });
}

export async function POST(request: Request) {
  await hydrateRuntimeProjectionFromBackendIfNeeded();
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json(
      buildErrorRecord(crypto.randomUUID(), 400, "INVALID_INPUT", "Request body must be valid JSON").body,
      { status: 400 }
    );
  }
  const body = parsed.body;

  const candidate = (body ?? {}) as {
    name?: unknown;
    mode?: unknown;
    solarSystemId?: unknown;
    targetNodeIds?: unknown;
    sponsorshipFee?: unknown;
    entryFee?: unknown;
    maxTeams?: unknown;
    durationHours?: unknown;
    walletAddress?: unknown;
    signature?: unknown;
    message?: unknown;
  };
  const mutation = await prepareSignedMutation(request, "POST:/api/matches", body, {
    walletAddress: String(candidate.walletAddress ?? ""),
    signature: String(candidate.signature ?? ""),
    message: String(candidate.message ?? ""),
    scope: "FuelFrogPanic:create-match-draft",
    targetId: "hosted"
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const result = createMatchDraft({
    name: typeof candidate.name === "string" ? candidate.name : undefined,
    mode: candidate.mode === "free" || candidate.mode === "precision" ? candidate.mode : "free",
    solarSystemId: Number(candidate.solarSystemId ?? Number.NaN),
    targetNodeIds: Array.isArray(candidate.targetNodeIds)
      ? candidate.targetNodeIds.filter((item): item is string => typeof item === "string")
      : [],
    sponsorshipFee: Number(candidate.sponsorshipFee ?? Number.NaN),
    entryFee: Number(candidate.entryFee ?? 0),
    maxTeams: Number(candidate.maxTeams ?? Number.NaN),
    durationHours: Number(candidate.durationHours ?? Number.NaN),
    walletAddress: String(candidate.walletAddress ?? ""),
    signature: String(candidate.signature ?? ""),
    message: String(candidate.message ?? "")
  });

  if (!result.ok) {
    return finalizeMutation("POST:/api/matches", mutation.mutation, {
      status: result.error.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        result.error.status,
        result.error.code,
        result.error.message
      ).body
    });
  }

  await persistMatchDetailToBackend(result.data.match.id);

  return finalizeMutation("POST:/api/matches", mutation.mutation, {
    status: 201,
    body: {
      ...result.data,
      requestId: mutation.mutation.requestId
    }
  });
}
