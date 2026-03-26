import { NextResponse } from "next/server";
import { getSettlementBill } from "@/server/settlementRuntime";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = getSettlementBill(id);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: result.reason === "not_found" ? "INVALID_INPUT" : "SETTLEMENT_IN_PROGRESS",
          message: result.reason === "not_found" ? "Match not found" : "Match settlement is not ready"
        }
      },
      { status: result.reason === "not_found" ? 404 : 409 }
    );
  }

  return NextResponse.json({
    bill: result.bill
  });
}
