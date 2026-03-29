import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import { hydrateRuntimeProjectionFromBackendIfNeeded } from "@/server/matchBackendStore";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { createTeam, getMatchTeamsSnapshot } from "@/server/teamRuntime";
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

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId: id });
  const snapshot = getMatchTeamsSnapshot(id);

  if (!snapshot) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "NOT_FOUND",
          message: "Match not found"
        }
      },
      { status: 404 }
    );
  }

  return NextResponse.json(snapshot);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
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
    name?: string;
    teamName?: string;
    maxMembers?: number;
    maxSize?: number;
    roleSlots?: unknown;
    walletAddress?: string;
    signature?: string;
    message?: string;
  };
  const mutation = await prepareSignedMutation(request, `POST:/api/matches/${id}/teams`, body, {
    walletAddress: candidate.walletAddress ?? "",
    signature: candidate.signature ?? "",
    message: candidate.message ?? "",
    scope: "FuelFrogPanic:create-team",
    targetId: id
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const result = await createTeam({
    matchId: id,
    teamName: candidate.name ?? candidate.teamName ?? "",
    maxSize:
      typeof candidate.maxMembers === "number"
        ? candidate.maxMembers
        : typeof candidate.maxSize === "number"
          ? candidate.maxSize
          : 0,
    roleSlots: parseRoleSlots(candidate.roleSlots),
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
    return finalizeMutation(`POST:/api/matches/${id}/teams`, mutation.mutation, {
      status: response.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        response.status,
        error?.error?.code ?? "UNKNOWN",
        error?.error?.message ?? "Unknown error"
      ).body
    });
  }

  return finalizeMutation(`POST:/api/matches/${id}/teams`, mutation.mutation, {
    status: response.status,
    body: {
      ...response.body,
      requestId: mutation.mutation.requestId
    }
  });
}
