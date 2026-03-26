import { buildMatchStreamFrame, listMatches } from "../src/server/matchRuntime.ts";
import { runWorkerLoop } from "./_shared.ts";

const intervalMs = Number(process.env.MATCH_RUNTIME_INTERVAL_MS ?? 3_000);

runWorkerLoop("matchRuntime", intervalMs, async () => {
  const matches = listMatches();
  const activeMatches = matches.filter((match) =>
    ["lobby", "prestart", "running", "panic", "settling"].includes(match.status)
  );

  for (const match of activeMatches.slice(0, 10)) {
    await buildMatchStreamFrame(match.id);
  }

  return `matches=${matches.length},active=${activeMatches.length}`;
}).catch((error) => {
  console.error("[matchRuntimeWorker] fatal", error);
  process.exit(1);
});
