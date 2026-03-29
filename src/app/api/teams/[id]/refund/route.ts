import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import {
  hydrateRuntimeProjectionFromBackendIfNeeded,
  persistMatchDetailForTeamToBackend
} from "@/server/matchBackendStore";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { refundTeamEntry } from "@/server/matchRuntime";

export const dynamic = "force-dynamic";

type RefundTeamRequest = {
  walletAddress?: string;
  signature?: string;
  message?: string;
};

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await hydrateRuntimeProjectionFromBackendIfNeeded();
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json(
      buildErrorRecord(crypto.randomUUID(), 400, "INVALID_INPUT", "Request body must be valid JSON").body,
      { status: 400 }
    );
  }
  const body = parsed.body as RefundTeamRequest | null;
  const mutation = await prepareSignedMutation(request, `POST:/api/teams/${id}/refund`, body, {
    walletAddress: body?.walletAddress ?? "",
    signature: body?.signature ?? "",
    message: body?.message ?? "",
    scope: "FuelFrogPanic:refund-team",
    targetId: id
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const result = refundTeamEntry({
    teamId: id,
    walletAddress: body?.walletAddress?.trim() ?? ""
  });

  if (!result.ok) {
    return finalizeMutation(`POST:/api/teams/${id}/refund`, mutation.mutation, {
      status: result.error.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        result.error.status,
        result.error.code,
        result.error.message
      ).body
    });
  }

  await persistMatchDetailForTeamToBackend(id);

  return finalizeMutation(`POST:/api/teams/${id}/refund`, mutation.mutation, {
    status: 200,
    body: {
      ok: true,
      data: result.data,
      requestId: mutation.mutation.requestId
    }
  });
}
