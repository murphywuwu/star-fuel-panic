import { NextResponse } from "next/server";

import { getProjectionRuntimeMeta } from "@/server/runtimeProjectionStore";
import { listRuntimeWorkerHealth } from "@/server/workerHealth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    workers: listRuntimeWorkerHealth(),
    projections: getProjectionRuntimeMeta()
  });
}
