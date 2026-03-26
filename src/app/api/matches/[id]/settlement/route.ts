import { NextResponse } from "next/server";
import { getSettlementStatus } from "@/server/settlementRuntime";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const settlement = getSettlementStatus(id);

  if (!settlement) {
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

  return NextResponse.json(settlement);
}
