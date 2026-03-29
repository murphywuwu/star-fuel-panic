import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { joinPlanningTeam } from "@/server/planningTeamRuntime";
import type { PlayerRole } from "@/types/team";

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

  const body = parsed.body as {
    role?: unknown;
    walletAddress?: unknown;
    signature?: unknown;
    message?: unknown;
  };

  const mutation = await prepareSignedMutation(request, `POST:/api/planning-teams/${id}/join`, body, {
    walletAddress: String(body.walletAddress ?? ""),
    signature: String(body.signature ?? ""),
    message: String(body.message ?? ""),
    scope: "FuelFrogPanic:join-planning-team",
    targetId: id
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const result = joinPlanningTeam({
    teamId: id,
    role: String(body.role ?? "") as PlayerRole,
    walletAddress: String(body.walletAddress ?? "")
  });

  if ("ok" in result.body && result.body.ok === false) {
    return finalizeMutation(`POST:/api/planning-teams/${id}/join`, mutation.mutation, {
      status: result.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        result.status,
        result.body.error.code,
        result.body.error.message
      ).body
    });
  }

  return finalizeMutation(`POST:/api/planning-teams/${id}/join`, mutation.mutation, {
    status: result.status,
    body: {
      ok: true,
      requestId: mutation.mutation.requestId,
      data: result.body
    }
  });
}
