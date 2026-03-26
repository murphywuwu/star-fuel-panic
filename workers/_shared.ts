import { reportWorkerHeartbeat } from "../src/server/workerHealth.ts";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runWorkerLoop(
  worker: string,
  intervalMs: number,
  task: () => Promise<string | void>
) {
  reportWorkerHeartbeat(worker, {
    status: "starting",
    pid: process.pid,
    detail: `booting interval=${intervalMs}ms`
  });

  while (true) {
    try {
      const detail = await task();
      reportWorkerHeartbeat(worker, {
        status: "healthy",
        pid: process.pid,
        detail: detail ?? null,
        lastError: null
      });
    } catch (error) {
      reportWorkerHeartbeat(worker, {
        status: "degraded",
        pid: process.pid,
        detail: null,
        lastError: error instanceof Error ? error.message : String(error)
      });
    }

    await sleep(intervalMs);
  }
}
