import { listNodes } from "../src/server/nodeRuntime.ts";
import { runWorkerLoop } from "./_shared.ts";

const intervalMs = Number(process.env.NODE_RUNTIME_INTERVAL_MS ?? 5_000);

runWorkerLoop("nodeRuntime", intervalMs, async () => {
  const nodes = await listNodes({}, { forceRefresh: true });
  return `nodes=${nodes.length}`;
}).catch((error) => {
  console.error("[nodeRuntimeWorker] fatal", error);
  process.exit(1);
});
