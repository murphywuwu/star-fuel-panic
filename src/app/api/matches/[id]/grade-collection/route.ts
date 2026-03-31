import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { hydrateRuntimeProjectionFromBackendIfNeeded } from "@/server/matchBackendStore";
import { getMatchDetail } from "@/server/matchRuntime";
import { getGradeCollectionForMatch } from "@/server/gradeCollectionRuntime";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID();
  const { id } = await context.params;
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId: id });

  const detail = getMatchDetail(id);
  if (!detail) {
    return NextResponse.json(
      {
        ok: false,
        requestId,
        error: {
          code: "NOT_FOUND",
          message: "Match not found"
        }
      },
      { status: 404 }
    );
  }

  if (detail.match.challengeMode !== "fuel_grade_challenge") {
    return NextResponse.json(
      {
        ok: false,
        requestId,
        error: {
          code: "INVALID_OPERATION",
          message: "This match is not a fuel grade challenge"
        }
      },
      { status: 400 }
    );
  }

  const gradeCollection = getGradeCollectionForMatch(id);

  return NextResponse.json({
    ok: true,
    requestId,
    data: {
      matchId: id,
      challengeMode: detail.match.challengeMode,
      primaryFuelGrade: detail.match.primaryFuelGrade,
      primaryGradeMultiplier: 2.0,
      allGradesBonus: 1.2,
      players: gradeCollection
    }
  });
}
