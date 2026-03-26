import { listWorkerHealth, upsertWorkerHealth } from "@/server/runtimeProjectionStore";

function nowIso() {
  return new Date().toISOString();
}

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

  upsertWorkerHealth({
    worker,
    status: options.status ?? current?.status ?? "healthy",
    heartbeatAt: nowIso(),
    pid: options.pid ?? current?.pid ?? process.pid,
    restartCount: options.restartCount ?? current?.restartCount ?? 0,
    detail: options.detail ?? current?.detail ?? null,
    lastError: options.lastError ?? current?.lastError ?? null
  });
}

export function listRuntimeWorkerHealth() {
  return listWorkerHealth();
}
