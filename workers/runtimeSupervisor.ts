import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";

const workerFiles = [
  "nodeRuntime.ts",
  "constellationRuntime.ts",
  "matchRuntime.ts",
  "chainSyncEngine.ts",
  "settlementRuntime.ts"
] as const;

const restartDelayMs = Number(process.env.RUNTIME_SUPERVISOR_RESTART_DELAY_MS ?? 2_000);

function spawnWorker(file: string): ChildProcess {
  const workerPath = path.join(process.cwd(), "workers", file);
  // Use tsx to support TypeScript path aliases (@/server, @/types, etc.)
  const child = spawn("npx", ["tsx", workerPath], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
    shell: true
  });

  child.on("exit", (code, signal) => {
    console.error(`[runtimeSupervisor] ${file} exited code=${code ?? "null"} signal=${signal ?? "null"}`);
    setTimeout(() => {
      spawnWorker(file);
    }, restartDelayMs);
  });

  return child;
}

for (const file of workerFiles) {
  spawnWorker(file);
}
