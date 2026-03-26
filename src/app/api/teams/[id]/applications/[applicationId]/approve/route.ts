import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { approveJoinApplication } from "@/server/teamRuntime";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string; applicationId: string }> }
) {
  const { id, applicationId } = await context.params;

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
  const mutation = await prepareSignedMutation(request, `POST:/api/teams/${id}/applications/${applicationId}/approve`, body, {
    walletAddress: String(candidate.walletAddress ?? ""),
    signature: String(candidate.signature ?? ""),
    message: String(candidate.message ?? ""),
    scope: "FuelFrogPanic:approve-team-application",
    targetId: `${id}:${applicationId}`
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const result = await approveJoinApplication({
    teamId: id,
    applicationId,
    walletAddress: String(candidate.walletAddress ?? ""),
    signature: String(candidate.signature ?? ""),
    message: String(candidate.message ?? "")
  });

  if ((result.body as { ok?: false }).ok === false) {
    const error = (result.body as { error?: { code?: string; message?: string } }).error;
    return finalizeMutation(`POST:/api/teams/${id}/applications/${applicationId}/approve`, mutation.mutation, {
      status: result.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        result.status,
        error?.code ?? "UNKNOWN",
        error?.message ?? "Unknown error"
      ).body
    });
  }

  return finalizeMutation(`POST:/api/teams/${id}/applications/${applicationId}/approve`, mutation.mutation, {
    status: result.status,
    body: {
      ...result.body,
      requestId: mutation.mutation.requestId
    }
  });
}
