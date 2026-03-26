import { syncConstellationSummaries } from "../src/server/constellationRuntime.ts";
import { runWorkerLoop } from "./_shared.ts";

const intervalMs = Number(process.env.CONSTELLATION_RUNTIME_INTERVAL_MS ?? 15_000);

runWorkerLoop("constellationRuntime", intervalMs, async () => {
  const summaries = await syncConstellationSummaries({ forceRefresh: true });
  return `constellations=${summaries.length}`;
}).catch((error) => {
  console.error("[constellationRuntimeWorker] fatal", error);
  process.exit(1);
});
