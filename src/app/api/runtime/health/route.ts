import { NextResponse } from "next/server";

import { getProjectionRuntimeMeta } from "@/server/runtimeProjectionStore";
import { listRuntimeWorkerHealthAsync } from "@/server/workerHealth";
import {
  isSupabaseRuntimeStoreAvailable,
  readRuntimeMetaFromSupabase
} from "@/server/supabaseRuntimeStore";

export const dynamic = "force-dynamic";

export async function GET() {
  // Prefer Supabase data for production (shared between Vercel and Railway)
  const useSupabase = isSupabaseRuntimeStoreAvailable();

  const [workers, projections] = await Promise.all([
    listRuntimeWorkerHealthAsync(),
    useSupabase ? readRuntimeMetaFromSupabase() : Promise.resolve(getProjectionRuntimeMeta())
  ]);

  return NextResponse.json({
    workers,
    projections,
    source: useSupabase ? "supabase" : "local"
  });
}
