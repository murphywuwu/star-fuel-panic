/**
 * Gate Topology Runtime
 *
 * Provides jump distance calculation between solar systems using
 * pre-computed star gate topology data.
 *
 * Usage:
 *   import { calculateJumps, getNearbySystems } from '@/server/gateTopologyRuntime';
 *
 *   const jumps = await calculateJumps(fromSystemId, toSystemId);
 *   const nearby = await getNearbySystems(systemId, maxJumps);
 */

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

export type GateLink = {
  gateId: number;
  gateName: string;
  destinationId: number;
  destinationName: string;
};

export type SystemInfo = {
  name: string;
  constellationId: number;
  regionId: number;
};

export type GateTopology = {
  version: string;
  generatedAt: string;
  stats: {
    totalSystems: number;
    systemsWithGates: number;
    totalGateLinks: number;
    isolatedSystems: number;
  };
  systems: Record<string, SystemInfo>;
  adjacencyList: Record<string, GateLink[]>;
};

export type NearbySystem = {
  systemId: number;
  systemName: string;
  constellationId: number;
  regionId: number;
  jumps: number;
  path: number[];
};

export type JumpPath = {
  fromSystemId: number;
  toSystemId: number;
  jumps: number;
  path: number[];
  reachable: boolean;
};

type RuntimeOptions = {
  forceReload?: boolean;
};

const TOPOLOGY_FILE_PATH = "data/gate-topology.json";

let cachedTopology: GateTopology | null = null;

function resolveTopologyPath(): string {
  // Try multiple possible locations
  const candidates = [
    resolve(process.cwd(), TOPOLOGY_FILE_PATH),
    resolve(process.cwd(), "..", TOPOLOGY_FILE_PATH),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0]; // Return default path even if not found
}

function loadTopology(options: RuntimeOptions = {}): GateTopology | null {
  if (!options.forceReload && cachedTopology) {
    return cachedTopology;
  }

  const topologyPath = resolveTopologyPath();

  if (!existsSync(topologyPath)) {
    console.warn(
      `[gateTopologyRuntime] Topology file not found: ${topologyPath}. ` +
        "Run 'node scripts/build-gate-topology.mjs' to generate it."
    );
    return null;
  }

  try {
    const content = readFileSync(topologyPath, "utf8");
    cachedTopology = JSON.parse(content) as GateTopology;
    console.log(
      `[gateTopologyRuntime] Loaded topology: ${cachedTopology.stats.totalSystems} systems, ` +
        `${cachedTopology.stats.systemsWithGates} with gates`
    );
    return cachedTopology;
  } catch (error) {
    console.error("[gateTopologyRuntime] Failed to load topology:", error);
    return null;
  }
}

/**
 * Calculate the number of jumps between two solar systems using BFS.
 *
 * @param fromSystemId - Starting system ID
 * @param toSystemId - Destination system ID
 * @returns Number of jumps, or -1 if unreachable
 */
export async function calculateJumps(
  fromSystemId: number,
  toSystemId: number,
  options: RuntimeOptions = {}
): Promise<number> {
  const result = await findPath(fromSystemId, toSystemId, options);
  return result.jumps;
}

/**
 * Find the shortest path between two solar systems using BFS.
 *
 * @param fromSystemId - Starting system ID
 * @param toSystemId - Destination system ID
 * @returns JumpPath with path details
 */
export async function findPath(
  fromSystemId: number,
  toSystemId: number,
  options: RuntimeOptions = {}
): Promise<JumpPath> {
  if (fromSystemId === toSystemId) {
    return {
      fromSystemId,
      toSystemId,
      jumps: 0,
      path: [fromSystemId],
      reachable: true,
    };
  }

  const topology = loadTopology(options);
  if (!topology) {
    return {
      fromSystemId,
      toSystemId,
      jumps: -1,
      path: [],
      reachable: false,
    };
  }

  // BFS to find shortest path
  const visited = new Set<number>();
  const queue: Array<{ systemId: number; path: number[] }> = [
    { systemId: fromSystemId, path: [fromSystemId] },
  ];

  visited.add(fromSystemId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const gates = topology.adjacencyList[current.systemId] || [];

    for (const gate of gates) {
      const nextSystemId = gate.destinationId;

      if (nextSystemId === toSystemId) {
        const fullPath = [...current.path, nextSystemId];
        return {
          fromSystemId,
          toSystemId,
          jumps: fullPath.length - 1,
          path: fullPath,
          reachable: true,
        };
      }

      if (!visited.has(nextSystemId)) {
        visited.add(nextSystemId);
        queue.push({
          systemId: nextSystemId,
          path: [...current.path, nextSystemId],
        });
      }
    }
  }

  // No path found
  return {
    fromSystemId,
    toSystemId,
    jumps: -1,
    path: [],
    reachable: false,
  };
}

/**
 * Get all systems within a certain number of jumps from a starting system.
 *
 * @param systemId - Starting system ID
 * @param maxJumps - Maximum number of jumps to search
 * @returns Array of nearby systems sorted by jump distance
 */
export async function getNearbySystems(
  systemId: number,
  maxJumps: number,
  options: RuntimeOptions = {}
): Promise<NearbySystem[]> {
  const topology = loadTopology(options);
  if (!topology) {
    return [];
  }

  const results: NearbySystem[] = [];
  const visited = new Map<number, { jumps: number; path: number[] }>();
  const queue: Array<{ currentId: number; jumps: number; path: number[] }> = [
    { currentId: systemId, jumps: 0, path: [systemId] },
  ];

  visited.set(systemId, { jumps: 0, path: [systemId] });

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.jumps >= maxJumps) {
      continue;
    }

    const gates = topology.adjacencyList[current.currentId] || [];

    for (const gate of gates) {
      const nextSystemId = gate.destinationId;

      if (!visited.has(nextSystemId)) {
        const newPath = [...current.path, nextSystemId];
        const newJumps = current.jumps + 1;

        visited.set(nextSystemId, { jumps: newJumps, path: newPath });

        const systemInfo = topology.systems[nextSystemId];
        results.push({
          systemId: nextSystemId,
          systemName: systemInfo?.name || `System ${nextSystemId}`,
          constellationId: systemInfo?.constellationId || 0,
          regionId: systemInfo?.regionId || 0,
          jumps: newJumps,
          path: newPath,
        });

        if (newJumps < maxJumps) {
          queue.push({
            currentId: nextSystemId,
            jumps: newJumps,
            path: newPath,
          });
        }
      }
    }
  }

  // Sort by jump distance, then by name
  results.sort((a, b) => {
    if (a.jumps !== b.jumps) return a.jumps - b.jumps;
    return a.systemName.localeCompare(b.systemName);
  });

  return results;
}

/**
 * Get the direct gate connections from a system.
 *
 * @param systemId - System ID to check
 * @returns Array of directly connected systems (1 jump away)
 */
export async function getDirectConnections(
  systemId: number,
  options: RuntimeOptions = {}
): Promise<GateLink[]> {
  const topology = loadTopology(options);
  if (!topology) {
    return [];
  }

  return topology.adjacencyList[systemId] || [];
}

/**
 * Check if the topology data is loaded and available.
 */
export async function isTopologyAvailable(options: RuntimeOptions = {}): Promise<boolean> {
  const topology = loadTopology(options);
  return topology !== null;
}

/**
 * Get topology statistics.
 */
export async function getTopologyStats(
  options: RuntimeOptions = {}
): Promise<GateTopology["stats"] | null> {
  const topology = loadTopology(options);
  return topology?.stats || null;
}

/**
 * Get system info from the topology.
 */
export async function getSystemInfo(
  systemId: number,
  options: RuntimeOptions = {}
): Promise<SystemInfo | null> {
  const topology = loadTopology(options);
  if (!topology) {
    return null;
  }

  return topology.systems[systemId] || null;
}

/**
 * Calculate jump distances from a system to multiple targets.
 * More efficient than calling calculateJumps multiple times.
 *
 * @param fromSystemId - Starting system ID
 * @param toSystemIds - Array of destination system IDs
 * @returns Map of systemId to jump distance (-1 if unreachable)
 */
export async function calculateJumpsToMultiple(
  fromSystemId: number,
  toSystemIds: number[],
  options: RuntimeOptions = {}
): Promise<Map<number, number>> {
  const topology = loadTopology(options);
  const result = new Map<number, number>();

  // Initialize all targets as unreachable
  for (const targetId of toSystemIds) {
    result.set(targetId, targetId === fromSystemId ? 0 : -1);
  }

  if (!topology) {
    return result;
  }

  const targetSet = new Set(toSystemIds);
  let remainingTargets = targetSet.size;

  // Remove self from targets if present
  if (targetSet.has(fromSystemId)) {
    remainingTargets--;
  }

  if (remainingTargets === 0) {
    return result;
  }

  // BFS to find all reachable targets
  const visited = new Set<number>();
  const queue: Array<{ systemId: number; jumps: number }> = [
    { systemId: fromSystemId, jumps: 0 },
  ];

  visited.add(fromSystemId);

  while (queue.length > 0 && remainingTargets > 0) {
    const current = queue.shift()!;
    const gates = topology.adjacencyList[current.systemId] || [];

    for (const gate of gates) {
      const nextSystemId = gate.destinationId;

      if (!visited.has(nextSystemId)) {
        visited.add(nextSystemId);
        const newJumps = current.jumps + 1;

        if (targetSet.has(nextSystemId)) {
          result.set(nextSystemId, newJumps);
          remainingTargets--;
        }

        queue.push({ systemId: nextSystemId, jumps: newJumps });
      }
    }
  }

  return result;
}
