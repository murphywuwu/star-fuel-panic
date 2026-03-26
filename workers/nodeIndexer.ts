import { bootstrapNodeIndex, createNodeIndexerIntervalMs, syncNodeIndexOnce } from "../src/server/nodeIndexerRuntime.ts";
import { resolveNodeIndexPath } from "../src/server/nodeIndexStore.ts";

const intervalMs = createNodeIndexerIntervalMs();

async function main() {
  await bootstrapNodeIndex();
  console.log(`[node-indexer] bootstrap complete -> ${resolveNodeIndexPath()}`);

  while (true) {
    const snapshot = await syncNodeIndexOnce();
    console.log(
      `[node-indexer] synced ${snapshot.nodes.length} nodes at ${snapshot.lastSyncAt ?? "unknown"}`
    );
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

main().catch((error) => {
  console.error("[node-indexer] fatal", error);
  process.exit(1);
});
