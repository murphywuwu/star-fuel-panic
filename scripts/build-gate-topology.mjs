#!/usr/bin/env node
/**
 * Gate Topology Builder
 *
 * Fetches all solar systems from EVE Frontier World API and builds
 * a complete star gate topology graph for jump distance calculations.
 *
 * Output: data/gate-topology.json
 *
 * Usage: node scripts/build-gate-topology.mjs [--concurrency=10] [--output=data/gate-topology.json]
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

const DEFAULT_WORLD_API = 'https://world-api-utopia.uat.pub.evefrontier.com';
const DEFAULT_CONCURRENCY = 10;
const DEFAULT_OUTPUT = 'data/gate-topology.json';
const CHECKPOINT_FILE = 'data/.gate-topology-checkpoint.json';

function parseArgs() {
  const args = {
    concurrency: DEFAULT_CONCURRENCY,
    output: DEFAULT_OUTPUT,
    resume: false,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--concurrency=')) {
      args.concurrency = parseInt(arg.split('=')[1], 10) || DEFAULT_CONCURRENCY;
    } else if (arg.startsWith('--output=')) {
      args.output = arg.split('=')[1];
    } else if (arg === '--resume') {
      args.resume = true;
    }
  }

  return args;
}

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
        console.log(`  Rate limited, waiting ${retryAfter}s...`);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(delay * (i + 1));
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllSystems(baseUrl) {
  console.log('Fetching solar system list...');

  const systems = [];
  let offset = 0;
  const limit = 500;

  while (true) {
    const url = `${baseUrl}/v2/solarsystems?limit=${limit}&offset=${offset}`;
    const page = await fetchWithRetry(url);

    if (!page.data || page.data.length === 0) break;

    systems.push(...page.data);
    console.log(`  Fetched ${systems.length} / ${page.metadata?.total || '?'} systems`);

    if (page.data.length < limit) break;
    offset += page.data.length;
  }

  console.log(`Total systems: ${systems.length}`);
  return systems;
}

async function fetchSystemDetail(baseUrl, systemId) {
  const url = `${baseUrl}/v2/solarsystems/${systemId}?format=json`;
  return fetchWithRetry(url);
}

async function fetchSystemsWithGates(baseUrl, systems, concurrency, checkpoint) {
  console.log(`\nFetching gate links (concurrency: ${concurrency})...`);

  const adjacencyList = checkpoint?.adjacencyList || {};
  const processedIds = new Set(checkpoint?.processedIds || []);
  const systemsToProcess = systems.filter(s => !processedIds.has(s.id));

  if (processedIds.size > 0) {
    console.log(`  Resuming from checkpoint: ${processedIds.size} already processed`);
  }

  let processed = processedIds.size;
  const total = systems.length;
  const startTime = Date.now();

  // Process in batches
  for (let i = 0; i < systemsToProcess.length; i += concurrency) {
    const batch = systemsToProcess.slice(i, i + concurrency);

    const results = await Promise.allSettled(
      batch.map(system => fetchSystemDetail(baseUrl, system.id))
    );

    for (let j = 0; j < results.length; j++) {
      const systemId = batch[j].id;
      processedIds.add(systemId);

      if (results[j].status === 'fulfilled') {
        const detail = results[j].value;
        if (detail.gateLinks && detail.gateLinks.length > 0) {
          adjacencyList[systemId] = detail.gateLinks.map(link => ({
            gateId: link.id,
            gateName: link.name,
            destinationId: link.destination?.id,
            destinationName: link.destination?.name,
          }));
        }
      }
    }

    processed = processedIds.size;

    // Progress report every 100 systems
    if (processed % 100 === 0 || processed === total) {
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = (processed - (checkpoint?.processedIds?.length || 0)) / elapsed;
      const remaining = (total - processed) / rate;

      console.log(
        `  Progress: ${processed}/${total} (${((processed / total) * 100).toFixed(1)}%)` +
        ` | ${rate.toFixed(1)} sys/s | ETA: ${Math.ceil(remaining / 60)}m`
      );

      // Save checkpoint every 500 systems
      if (processed % 500 === 0) {
        saveCheckpoint({ adjacencyList, processedIds: [...processedIds] });
      }
    }
  }

  return { adjacencyList, processedIds: [...processedIds] };
}

function saveCheckpoint(data) {
  const checkpointPath = resolve(PROJECT_ROOT, CHECKPOINT_FILE);
  const dir = dirname(checkpointPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(checkpointPath, JSON.stringify(data), 'utf8');
}

function loadCheckpoint() {
  const checkpointPath = resolve(PROJECT_ROOT, CHECKPOINT_FILE);
  if (!existsSync(checkpointPath)) return null;

  try {
    return JSON.parse(readFileSync(checkpointPath, 'utf8'));
  } catch {
    return null;
  }
}

function buildTopologyOutput(systems, adjacencyList) {
  // Build system lookup
  const systemLookup = {};
  for (const system of systems) {
    systemLookup[system.id] = {
      name: system.name,
      constellationId: system.constellationId,
      regionId: system.regionId,
    };
  }

  // Count statistics
  const systemsWithGates = Object.keys(adjacencyList).length;
  const totalGates = Object.values(adjacencyList).reduce((sum, gates) => sum + gates.length, 0);

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    stats: {
      totalSystems: systems.length,
      systemsWithGates,
      totalGateLinks: totalGates,
      isolatedSystems: systems.length - systemsWithGates,
    },
    systems: systemLookup,
    adjacencyList,
  };
}

async function main() {
  const args = parseArgs();
  const baseUrl = process.env.EVE_FRONTIER_WORLD_API_BASE_URL || DEFAULT_WORLD_API;

  console.log('=== Gate Topology Builder ===');
  console.log(`API: ${baseUrl}`);
  console.log(`Output: ${args.output}`);
  console.log(`Concurrency: ${args.concurrency}`);
  console.log('');

  try {
    // Fetch all systems
    const systems = await fetchAllSystems(baseUrl);

    // Load checkpoint if resuming
    const checkpoint = args.resume ? loadCheckpoint() : null;

    // Fetch gate links for each system
    const { adjacencyList } = await fetchSystemsWithGates(
      baseUrl,
      systems,
      args.concurrency,
      checkpoint
    );

    // Build output
    const topology = buildTopologyOutput(systems, adjacencyList);

    // Write output file
    const outputPath = resolve(PROJECT_ROOT, args.output);
    const outputDir = dirname(outputPath);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    writeFileSync(outputPath, JSON.stringify(topology, null, 2), 'utf8');

    console.log('\n=== Build Complete ===');
    console.log(`Total systems: ${topology.stats.totalSystems}`);
    console.log(`Systems with gates: ${topology.stats.systemsWithGates}`);
    console.log(`Total gate links: ${topology.stats.totalGateLinks}`);
    console.log(`Isolated systems: ${topology.stats.isolatedSystems}`);
    console.log(`Output: ${outputPath}`);

    // Clean up checkpoint
    const checkpointPath = resolve(PROJECT_ROOT, CHECKPOINT_FILE);
    if (existsSync(checkpointPath)) {
      const { unlinkSync } = await import('fs');
      unlinkSync(checkpointPath);
    }

  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

main();
