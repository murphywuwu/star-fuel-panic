import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { createTeam } from "@/server/teamRuntime";
import type { PlayerRole, RoleSlots } from "@/types/team";

export const dynamic = "force-dynamic";

function parseRoleSlots(value: unknown): RoleSlots {
  if (Array.isArray(value)) {
    return value.reduce<RoleSlots>(
      (acc, item) => {
        if (item === "collector") acc.collector += 1;
        if (item === "hauler") acc.hauler += 1;
        if (item === "escort") acc.escort += 1;
        return acc;
      },
      { collector: 0, hauler: 0, escort: 0 }
    );
  }

  const candidate = (value ?? {}) as Partial<Record<PlayerRole, unknown>>;
  return {
    collector: Number(candidate.collector ?? 0),
    hauler: Number(candidate.hauler ?? 0),
    escort: Number(candidate.escort ?? 0)
  };
}

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json(
      buildErrorRecord(crypto.randomUUID(), 400, "INVALID_INPUT", "Request body must be valid JSON").body,
      { status: 400 }
    );
  }

  const body = parsed.body;
  const candidate = (body ?? {}) as {
    matchId?: unknown;
    name?: unknown;
    teamName?: unknown;
    maxMembers?: unknown;
    maxSize?: unknown;
    roleSlots?: unknown;
    walletAddress?: unknown;
    signature?: unknown;
    message?: unknown;
  };
  const matchId = String(candidate.matchId ?? "");
  const mutation = await prepareSignedMutation(request, "POST:/api/teams", body, {
    walletAddress: String(candidate.walletAddress ?? ""),
    signature: String(candidate.signature ?? ""),
    message: String(candidate.message ?? ""),
    scope: "FuelFrogPanic:create-team",
    targetId: matchId
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const result = await createTeam({
    matchId,
    teamName: String(candidate.name ?? candidate.teamName ?? ""),
    maxSize: Number(candidate.maxMembers ?? candidate.maxSize ?? Number.NaN),
    roleSlots: parseRoleSlots(candidate.roleSlots),
    walletAddress: String(candidate.walletAddress ?? ""),
    signature: String(candidate.signature ?? ""),
    message: String(candidate.message ?? "")
  });

  const response = result as {
    status: number;
    body: Record<string, unknown> & { ok?: false; error?: { code?: string; message?: string } };
  };

  if (response.body.ok === false) {
    const error = response.body as { error?: { code?: string; message?: string } } | undefined;
    return finalizeMutation("POST:/api/teams", mutation.mutation, {
      status: response.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        response.status,
        error?.error?.code ?? "UNKNOWN",
        error?.error?.message ?? "Unknown error"
      ).body
    });
  }

  return finalizeMutation("POST:/api/teams", mutation.mutation, {
    status: response.status,
    body: {
      ...response.body,
      requestId: mutation.mutation.requestId
    }
  });
}
