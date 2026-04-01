import { listWorkerHealth, upsertWorkerHealth } from "@/server/runtimeProjectionStore";
import {
  isSupabaseRuntimeStoreAvailable,
  readWorkerHealthFromSupabase,
  upsertWorkerHealthToSupabase
} from "@/server/supabaseRuntimeStore";

function nowIso() {
  return new Date().toISOString();
}

/**
 * Reports worker heartbeat to both local store and Supabase (if configured).
 * This is the sync version for backward compatibility.
 */
export function reportWorkerHeartbeat(
  worker: string,
  options: {
    status?: "starting" | "healthy" | "degraded" | "stopped";
    detail?: string | null;
    lastError?: string | null;
    restartCount?: number;
    pid?: number | null;
  } = {}
) {
  const current = listWorkerHealth().find((item) => item.worker === worker) ?? null;

  const record = {
    worker,
    status: options.status ?? current?.status ?? "healthy",
    heartbeatAt: nowIso(),
    pid: options.pid ?? current?.pid ?? process.pid,
    restartCount: options.restartCount ?? current?.restartCount ?? 0,
    detail: options.detail ?? current?.detail ?? null,
    lastError: options.lastError ?? current?.lastError ?? null
  };

  // Write to local store (for local dev)
  upsertWorkerHealth(record);

  // Also write to Supabase (fire and forget for sync API)
  if (isSupabaseRuntimeStoreAvailable()) {
    upsertWorkerHealthToSupabase(record).catch((error) => {
      console.error(`[workerHealth] Failed to sync to Supabase: ${error}`);
    });
  }
}

/**
 * Async version of reportWorkerHeartbeat that waits for Supabase write.
 * Use this in workers for reliable persistence.
 */
export async function reportWorkerHeartbeatAsync(
  worker: string,
  options: {
    status?: "starting" | "healthy" | "degraded" | "stopped";
    detail?: string | null;
    lastError?: string | null;
    restartCount?: number;
    pid?: number | null;
  } = {}
): Promise<void> {
  const current = listWorkerHealth().find((item) => item.worker === worker) ?? null;

  const record = {
    worker,
    status: options.status ?? current?.status ?? "healthy",
    heartbeatAt: nowIso(),
    pid: options.pid ?? current?.pid ?? process.pid,
    restartCount: options.restartCount ?? current?.restartCount ?? 0,
    detail: options.detail ?? current?.detail ?? null,
    lastError: options.lastError ?? current?.lastError ?? null
  };

  // Write to local store
  upsertWorkerHealth(record);

  // Write to Supabase and wait
  if (isSupabaseRuntimeStoreAvailable()) {
    await upsertWorkerHealthToSupabase(record);
  }
}

export function listRuntimeWorkerHealth() {
  return listWorkerHealth();
}

/**
 * Async version that reads from Supabase if available.
 */
export async function listRuntimeWorkerHealthAsync() {
  if (isSupabaseRuntimeStoreAvailable()) {
    return await readWorkerHealthFromSupabase();
  }
  return listWorkerHealth();
}
