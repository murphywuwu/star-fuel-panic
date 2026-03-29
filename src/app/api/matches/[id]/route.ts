import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import {
  deleteMatchDetailFromBackend,
  hydrateRuntimeProjectionFromBackendIfNeeded,
  persistMatchDetailToBackend
} from "@/server/matchBackendStore";
import { getMatchDiscoveryDetail } from "@/server/matchDiscoveryRuntime";
import { cancelHostedMatch } from "@/server/matchRuntime";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId: id });
  const { searchParams } = new URL(request.url);
  const currentSystem = Number(searchParams.get("currentSystem"));

  const detail = await getMatchDiscoveryDetail(
    id,
    Number.isFinite(currentSystem) && currentSystem > 0 ? currentSystem : null
  );

  if (!detail) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Match not found"
        }
      },
      { status: 404 }
    );
  }

  return NextResponse.json(detail);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId: id });

  const parsed = await parseJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json(
      buildErrorRecord(crypto.randomUUID(), 400, "INVALID_INPUT", "Request body must be valid JSON").body,
      { status: 400 }
    );
  }
  const body = parsed.body;

  const candidate = (body ?? {}) as {
    walletAddress?: unknown;
    signature?: unknown;
    message?: unknown;
  };
  const mutation = await prepareSignedMutation(request, `DELETE:/api/matches/${id}`, body, {
    walletAddress: String(candidate.walletAddress ?? ""),
    signature: String(candidate.signature ?? ""),
    message: String(candidate.message ?? ""),
    scope: "FuelFrogPanic:cancel-match",
    targetId: id
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const result = await cancelHostedMatch({
    matchId: id,
    walletAddress: String(candidate.walletAddress ?? ""),
    signature: String(candidate.signature ?? ""),
    message: String(candidate.message ?? "")
  });

  if (!result.ok) {
    return finalizeMutation(`DELETE:/api/matches/${id}`, mutation.mutation, {
      status: result.error.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        result.error.status,
        result.error.code,
        result.error.message
      ).body
    });
  }

  await deleteMatchDetailFromBackend(id);

  return finalizeMutation(`DELETE:/api/matches/${id}`, mutation.mutation, {
    status: 200,
    body: {
      ...result.data,
      requestId: mutation.mutation.requestId
    }
  });
}
