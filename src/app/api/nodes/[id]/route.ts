import { NextResponse } from "next/server";
import { getNodeById } from "@/server/nodeRuntime";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  let entry;

  try {
    entry = await getNodeById(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load on-chain node";
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "CHAIN_SYNC_ERROR",
          message
        }
      },
      { status: 500 }
    );
  }

  if (!entry) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "UNKNOWN",
          message: "Node not found"
        }
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    node: entry.node,
    activeMatch: entry.activeMatch
  });
}
