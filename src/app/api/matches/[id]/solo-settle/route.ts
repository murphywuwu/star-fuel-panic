import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import { parseJsonBody } from "@/server/mutationRoute";
import { settleSoloVerificationMatch } from "@/server/teamRuntime";

export const dynamic = "force-dynamic";

function localOnlyGuard() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return NextResponse.json(
    buildErrorRecord(crypto.randomUUID(), 404, "NOT_FOUND", "Solo verification helpers are unavailable").body,
    { status: 404 }
  );
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const guard = localOnlyGuard();
  if (guard) {
    return guard;
  }

  const { id } = await context.params;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json(
      buildErrorRecord(crypto.randomUUID(), 400, "INVALID_INPUT", "Request body must be valid JSON").body,
      { status: 400 }
    );
  }

  const candidate = (parsed.body ?? {}) as {
    walletAddress?: unknown;
  };

  const result = await settleSoloVerificationMatch({
    matchId: id,
    walletAddress: String(candidate.walletAddress ?? "")
  });

  if ("error" in result.body) {
    return NextResponse.json(
      buildErrorRecord(crypto.randomUUID(), result.status, result.body.error.code, result.body.error.message).body,
      { status: result.status }
    );
  }

  return NextResponse.json(result.body, { status: result.status });
}
