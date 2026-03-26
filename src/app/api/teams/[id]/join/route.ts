import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { joinTeam } from "@/server/teamRuntime";
import type { PlayerRole } from "@/types/team";

export const dynamic = "force-dynamic";

function parseRole(value: unknown): PlayerRole | null {
  if (value === "collector" || value === "hauler" || value === "escort") {
    return value;
  }
  return null;
}

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

  const candidate = (body ?? {}) as {
    role?: unknown;
    walletAddress?: string;
    signature?: string;
    message?: string;
  };
  const role = parseRole(candidate.role);

  if (!role) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Invalid role"
        }
      },
      { status: 400 }
    );
  }

  const mutation = await prepareSignedMutation(request, `POST:/api/teams/${id}/join`, body, {
    walletAddress: candidate.walletAddress ?? "",
    signature: candidate.signature ?? "",
    message: candidate.message ?? "",
    scope: "FuelFrogPanic:join-team",
    targetId: id
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const result = await joinTeam({
    teamId: id,
    role,
    walletAddress: candidate.walletAddress ?? "",
    signature: candidate.signature ?? "",
    message: candidate.message ?? ""
  });

  const response = result as {
    status: number;
    body: Record<string, unknown> & { ok?: false; error?: { code?: string; message?: string } };
  };

  if (response.body.ok === false) {
    const error = response.body as { error?: { code?: string; message?: string } } | undefined;
    return finalizeMutation(`POST:/api/teams/${id}/join`, mutation.mutation, {
      status: response.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        response.status,
        error?.error?.code ?? "UNKNOWN",
        error?.error?.message ?? "Unknown error"
      ).body
    });
  }

  return finalizeMutation(`POST:/api/teams/${id}/join`, mutation.mutation, {
    status: response.status,
    body: {
      ...response.body,
      requestId: mutation.mutation.requestId
    }
  });
}
