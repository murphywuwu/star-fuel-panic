import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import {
  buildPlanningTeamBackendMissingMessage,
  hydratePlanningTeamsFromBackendIfNeeded,
  isBackendRelationMissing,
  persistPlanningTeamToBackend
} from "@/server/matchBackendStore";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { createPlanningTeam, getPlanningTeamsSnapshot } from "@/server/planningTeamRuntime";
import type { PlayerRole, RoleSlots } from "@/types/team";

export const dynamic = "force-dynamic";

const CREATE_PLANNING_TEAM_TARGET_ID = "planning-registry";

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

export async function GET() {
  try {
    await hydratePlanningTeamsFromBackendIfNeeded();
  } catch (error) {
    if (isBackendRelationMissing(error, "planning_teams")) {
      return NextResponse.json(
        buildErrorRecord(
          crypto.randomUUID(),
          503,
          "CHAIN_SYNC_ERROR",
          buildPlanningTeamBackendMissingMessage()
        ).body,
        { status: 503 }
      );
    }

    throw error;
  }
  const snapshot = getPlanningTeamsSnapshot();
  return NextResponse.json({
    ok: true,
    requestId: crypto.randomUUID(),
    data: snapshot
  });
}

export async function POST(request: Request) {
  try {
    await hydratePlanningTeamsFromBackendIfNeeded();
  } catch (error) {
    if (isBackendRelationMissing(error, "planning_teams")) {
      return NextResponse.json(
        buildErrorRecord(
          crypto.randomUUID(),
          503,
          "CHAIN_SYNC_ERROR",
          buildPlanningTeamBackendMissingMessage()
        ).body,
        { status: 503 }
      );
    }

    throw error;
  }
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json(
      buildErrorRecord(crypto.randomUUID(), 400, "INVALID_INPUT", "Request body must be valid JSON").body,
      { status: 400 }
    );
  }

  const body = parsed.body as {
    name?: unknown;
    maxMembers?: unknown;
    roleSlots?: unknown;
    walletAddress?: unknown;
    signature?: unknown;
    message?: unknown;
  };

  const mutation = await prepareSignedMutation(request, "POST:/api/planning-teams", body, {
    walletAddress: String(body.walletAddress ?? ""),
    signature: String(body.signature ?? ""),
    message: String(body.message ?? ""),
    scope: "FuelFrogPanic:create-planning-team",
    targetId: CREATE_PLANNING_TEAM_TARGET_ID
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const result = createPlanningTeam({
    teamName: String(body.name ?? ""),
    maxMembers: Number(body.maxMembers ?? Number.NaN),
    roleSlots: parseRoleSlots(body.roleSlots),
    walletAddress: String(body.walletAddress ?? "")
  });

  if ("ok" in result.body && result.body.ok === false) {
    return finalizeMutation("POST:/api/planning-teams", mutation.mutation, {
      status: result.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        result.status,
        result.body.error.code,
        result.body.error.message
      ).body
    });
  }

  const successBody = result.body as {
    team: import("@/types/planningTeam").PlanningTeam;
    totalTeams: number;
  };
  try {
    await persistPlanningTeamToBackend(successBody.team.id);
  } catch (error) {
    if (isBackendRelationMissing(error, "planning_teams") || isBackendRelationMissing(error, "planning_team_members")) {
      return finalizeMutation("POST:/api/planning-teams", mutation.mutation, {
        status: 503,
        body: buildErrorRecord(
          mutation.mutation.requestId,
          503,
          "CHAIN_SYNC_ERROR",
          buildPlanningTeamBackendMissingMessage()
        ).body
      });
    }

    throw error;
  }

  return finalizeMutation("POST:/api/planning-teams", mutation.mutation, {
    status: result.status,
    body: {
      ok: true,
      requestId: mutation.mutation.requestId,
      data: successBody
    }
  });
}
