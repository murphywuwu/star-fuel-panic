#!/usr/bin/env node

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json();
  return { response, data };
}

function printSystem(system) {
  console.log(`  ${system.systemId} ${system.systemName}`);
  console.log(`    constellation=${system.constellationId} region=${system.regionId}`);
  console.log(`    location=(${system.location.x}, ${system.location.y}, ${system.location.z})`);
}

async function main() {
  console.log("Testing world-api-backed solar systems API");

  const overview = await request("/api/solar-systems?stats=true&limit=5");
  if (!overview.response.ok) {
    console.error("Failed to load solar systems:", overview.data);
    process.exit(1);
  }

  console.log("\nSample systems:");
  for (const system of overview.data.systems ?? []) {
    printSystem(system);
  }

  console.log("\nStats:");
  console.log(overview.data.stats);
  console.log("\nMetadata:");
  console.log(overview.data.metadata);

  const detail = await request("/api/solar-systems/30000001");
  if (!detail.response.ok) {
    console.error("Failed to load solar system detail:", detail.data);
    process.exit(1);
  }

  console.log("\nSingle system detail:");
  console.log({
    systemId: detail.data.system?.systemId,
    systemName: detail.data.system?.systemName,
    gateLinks: detail.data.system?.gateLinks?.length ?? 0
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
