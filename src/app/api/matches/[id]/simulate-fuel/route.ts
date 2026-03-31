import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import { injectSimulatedFuelDeposit } from "@/server/matchSimulationRuntime";

export const dynamic = "force-dynamic";

function isSimulationEnabled() {
  const flag = process.env.ENABLE_LOCAL_MATCH_SIMULATION?.trim().toLowerCase();
  return flag === "1" || flag === "true" || flag === "yes";
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSimulationEnabled()) {
    return NextResponse.json(
      buildErrorRecord(
        crypto.randomUUID(),
        403,
        "FORBIDDEN",
        "Local match simulation is disabled. Set ENABLE_LOCAL_MATCH_SIMULATION=true to enable this endpoint."
      ).body,
      { status: 403 }
    );
  }

  const { id } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      buildErrorRecord(crypto.randomUUID(), 400, "INVALID_INPUT", "Request body must be valid JSON").body,
      { status: 400 }
    );
  }

  const result = await injectSimulatedFuelDeposit({
    matchId: id,
    walletAddress: String(body.walletAddress ?? ""),
    assemblyId: String(body.assemblyId ?? ""),
    fuelAdded: Number(body.fuelAdded ?? Number.NaN),
    fuelTypeId: Number(body.fuelTypeId ?? Number.NaN),
    oldQuantity: Number(body.oldQuantity ?? 0),
    maxCapacity: Number(body.maxCapacity ?? 100000),
    fuelEfficiency:
      body.fuelEfficiency == null ? null : Number(body.fuelEfficiency),
    forcePanic: Boolean(body.forcePanic),
    timestamp: typeof body.timestamp === "string" || typeof body.timestamp === "number" ? body.timestamp : null,
    nodeName: typeof body.nodeName === "string" ? body.nodeName : null
  });

  if (!result.ok) {
    const status = result.code === "NOT_FOUND" ? 404 : result.code === "CONFLICT" ? 409 : 400;
    return NextResponse.json(buildErrorRecord(crypto.randomUUID(), status, result.code, result.message).body, {
      status
    });
  }

  return NextResponse.json({
    ok: true,
    requestId: crypto.randomUUID(),
    data: result
  });
}
