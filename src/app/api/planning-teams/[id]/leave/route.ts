import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import {
  buildPlanningTeamBackendMissingMessage,
  hydratePlanningTeamsFromBackendIfNeeded,
  isBackendRelationMissing,
  persistPlanningTeamToBackend
} from "@/server/matchBackendStore";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { leavePlanningTeam } from "@/server/planningTeamRuntime";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await hydratePlanningTeamsFromBackendIfNeeded();
  } catch (error) {
    if (isBackendRelationMissing(error, "planning_teams")) {
      return NextResponse.json(
        buildErrorRecord(crypto.randomUUID(), 503, "CHAIN_SYNC_ERROR", buildPlanningTeamBackendMissingMessage()).body,
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
    walletAddress?: unknown;
    signature?: unknown;
    message?: unknown;
  };

  const mutation = await prepareSignedMutation(request, `POST:/api/planning-teams/${id}/leave`, body, {
    walletAddress: String(body.walletAddress ?? ""),
    signature: String(body.signature ?? ""),
    message: String(body.message ?? ""),
    scope: "FuelFrogPanic:leave-planning-team",
    targetId: id
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const result = leavePlanningTeam({
    teamId: id,
    walletAddress: String(body.walletAddress ?? "")
  });

  if ("ok" in result.body && result.body.ok === false) {
    return finalizeMutation(`POST:/api/planning-teams/${id}/leave`, mutation.mutation, {
      status: result.status,
      body: buildErrorRecord(mutation.mutation.requestId, result.status, result.body.error.code, result.body.error.message).body
    });
  }

  const successBody = result.body as { team: import("@/types/planningTeam").PlanningTeam | null; totalTeams: number };
  if (successBody.team) {
    try {
      await persistPlanningTeamToBackend(successBody.team.id);
    } catch (error) {
      if (isBackendRelationMissing(error, "planning_teams") || isBackendRelationMissing(error, "planning_team_members") || isBackendRelationMissing(error, "planning_team_applications")) {
        return finalizeMutation(`POST:/api/planning-teams/${id}/leave`, mutation.mutation, {
          status: 503,
          body: buildErrorRecord(mutation.mutation.requestId, 503, "CHAIN_SYNC_ERROR", buildPlanningTeamBackendMissingMessage()).body
        });
      }
      throw error;
    }
  }

  return finalizeMutation(`POST:/api/planning-teams/${id}/leave`, mutation.mutation, {
    status: result.status,
    body: {
      ok: true,
      requestId: mutation.mutation.requestId,
      data: successBody
    }
  });
}
