import { getSettlementBill } from "../src/server/settlementRuntime.ts";
import { listMatches } from "../src/server/matchRuntime.ts";
import { runWorkerLoop } from "./_shared.ts";

const intervalMs = Number(process.env.SETTLEMENT_RUNTIME_INTERVAL_MS ?? 10_000);

runWorkerLoop("settlementRuntime", intervalMs, async () => {
  const settledMatches = listMatches({ status: "settled" });
  for (const match of settledMatches.slice(0, 10)) {
    getSettlementBill(match.id);
  }
  return `settled=${settledMatches.length}`;
}).catch((error) => {
  console.error("[settlementRuntimeWorker] fatal", error);
  process.exit(1);
});
