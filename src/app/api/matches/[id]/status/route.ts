import { NextResponse } from "next/server";
import { getMatchStatusSnapshot } from "@/server/matchRuntime";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const snapshot = getMatchStatusSnapshot(id);

  if (!snapshot) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Match not found"
        }
      },
      { status: 404 }
    );
  }

  return NextResponse.json(snapshot);
}
