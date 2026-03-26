import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getMatchScoreboardSnapshot } from "@/server/matchRuntime";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID();
  const { id } = await context.params;
  const scoreboard = await getMatchScoreboardSnapshot(id);

  if (!scoreboard) {
    return NextResponse.json(
      {
        ok: false,
        requestId,
        error: {
          code: "INVALID_INPUT",
          message: "Match not found"
        }
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    requestId,
    data: scoreboard
  });
}
