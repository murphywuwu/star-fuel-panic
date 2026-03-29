import { NextResponse } from "next/server";
import { hydrateRuntimeProjectionFromBackendIfNeeded } from "@/server/matchBackendStore";
import { getMatchTeamsSnapshot } from "@/server/teamRuntime";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
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
