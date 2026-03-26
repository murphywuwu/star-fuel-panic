import { listMatches } from "../src/server/matchRuntime.ts";
import { runWorkerLoop } from "./_shared.ts";

const intervalMs = Number(process.env.CHAIN_SYNC_ENGINE_INTERVAL_MS ?? 2_000);

runWorkerLoop("chainSyncEngine", intervalMs, async () => {
  const activeMatches = listMatches().filter((match) =>
    ["running", "panic", "settling"].includes(match.status)
  );
  return `watching=${activeMatches.length}`;
}).catch((error) => {
  console.error("[chainSyncEngineWorker] fatal", error);
  process.exit(1);
});
