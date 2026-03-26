import { NextResponse } from "next/server";
import { getPlayerProfile } from "@/server/playerRuntime";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ address: string }> }) {
  const { address } = await context.params;
  const normalized = address.trim();

  if (!normalized) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Player address is required"
        }
      },
      { status: 400 }
    );
  }

  return NextResponse.json(getPlayerProfile(normalized));
}
