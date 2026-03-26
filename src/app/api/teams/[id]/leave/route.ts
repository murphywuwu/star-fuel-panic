import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { leaveTeam } from "@/server/teamRuntime";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json(
      buildErrorRecord(crypto.randomUUID(), 400, "INVALID_INPUT", "Request body must be valid JSON").body,
      { status: 400 }
    );
  }
  const body = parsed.body;

  const mutation = await prepareSignedMutation(request, `POST:/api/teams/${id}/leave`, body, {
    walletAddress: String(body?.walletAddress ?? ""),
    signature: String(body?.signature ?? ""),
    message: String(body?.message ?? ""),
    scope: "FuelFrogPanic:leave-team",
    targetId: id
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const result = await leaveTeam({
    teamId: id,
    walletAddress: String(body?.walletAddress ?? ""),
    signature: String(body?.signature ?? ""),
    message: String(body?.message ?? "")
  });

  if ((result.body as { ok?: false }).ok === false) {
    const error = (result.body as { error?: { code?: string; message?: string } }).error;
    return finalizeMutation(`POST:/api/teams/${id}/leave`, mutation.mutation, {
      status: result.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        result.status,
        error?.code ?? "UNKNOWN",
        error?.message ?? "Unknown error"
      ).body
    });
  }

  return finalizeMutation(`POST:/api/teams/${id}/leave`, mutation.mutation, {
    status: result.status,
    body: {
      ...result.body,
      requestId: mutation.mutation.requestId
    }
  });
}
