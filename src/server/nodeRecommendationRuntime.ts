/**
 * Node Recommendation Runtime
 *
 * Generates personalized node recommendations for Free Mode matches
 * based on user location and node urgency.
 *
 * Algorithm: score = urgencyWeight × distanceWeight × matchBonus
 */

import { listNodes } from "./nodeRuntime.ts";
import {
  calculateJumps,
  calculateJumpsToMultiple,
  getSystemInfo,
  isTopologyAvailable,
} from "./gateTopologyRuntime.ts";
import type { NetworkNode } from "../types/node.ts";

export type NodeRecommendation = {
  node: NetworkNode;
  distance: number;              // 跳数（0 = 同星系）
  score: number;                 // 综合性价比得分 (0.0 ~ 3.0+)
  urgencyWeight: number;         // 紧急度权重 (1.0 / 1.2 / 1.5)
  distanceWeight: number;        // 距离权重 (0.2 ~ 1.0)
  matchBonus: number;            // 比赛加成 (1.0 / 1.3)
  systemName: string;            // 节点所在星系名称
};

export type RecommendationFilters = {
  maxJumps?: number;             // 最大跳数（默认 5）
  urgency?: string;              // 紧急度过滤（如 "critical,warning"）
  hasMatch?: boolean;            // 是否只返回有活跃比赛的节点
  limit?: number;                // 返回数量（默认 10）
  excludeNodeIds?: string[];     // 排除的节点 ID
};

export type RecommendationResult = {
  recommendations: NodeRecommendation[];
  userLocation: {
    systemId: number;
    systemName: string;
    constellationId: number;
    regionId: number;
  };
  meta: {
    totalNodesScanned: number;
    nodesInRange: number;
    filtersApplied: string[];
    maxJumpsUsed: number;
    topologyAvailable: boolean;
  };
};

type RuntimeOptions = {
  forceRefresh?: boolean;
};

type TopologyRuntimeOptions = {
  forceReload?: boolean;
};

const DEFAULT_MAX_JUMPS = 5;
const DEFAULT_LIMIT = 10;

/**
 * Calculate urgency weight based on fill ratio.
 * Lower fill ratio = higher urgency = higher weight
 */
function calculateUrgencyWeight(fillRatio: number): number {
  if (fillRatio < 0.2) return 1.5;  // critical
  if (fillRatio < 0.5) return 1.2;  // warning
  return 1.0;                        // safe
}

/**
 * Calculate distance weight based on jump count.
 * Closer nodes get higher weight.
 */
function calculateDistanceWeight(jumps: number): number {
  if (jumps === 0) return 1.0;       // same system
  if (jumps <= 2) return 0.8;        // very close
  if (jumps <= 5) return 0.5;        // moderate
  return 0.2;                        // far
}

/**
 * Calculate match bonus.
 * Nodes with active matches get a bonus.
 */
function calculateMatchBonus(hasActiveMatch: boolean): number {
  return hasActiveMatch ? 1.3 : 1.0;
}

/**
 * Generate node recommendations based on user location.
 *
 * @param currentSystemId - User's current solar system
 * @param filters - Optional filters
 * @returns Recommendation result with scored nodes
 */
export async function getNodeRecommendations(
  currentSystemId: number,
  filters: RecommendationFilters = {},
  options: RuntimeOptions = {}
): Promise<RecommendationResult> {
  const maxJumps = filters.maxJumps ?? DEFAULT_MAX_JUMPS;
  const limit = filters.limit ?? DEFAULT_LIMIT;
  const urgencyFilter = filters.urgency?.split(",").map(s => s.trim().toLowerCase()) || [];
  const excludeSet = new Set(filters.excludeNodeIds || []);
  const filtersApplied: string[] = [];
  const topologyOptions: TopologyRuntimeOptions = options.forceRefresh ? { forceReload: true } : {};

  // Check topology availability
  const topologyAvailable = await isTopologyAvailable(topologyOptions);

  // Get user's system info
  const userSystemInfo = topologyAvailable
    ? await getSystemInfo(currentSystemId, topologyOptions)
    : null;

  const userLocation = {
    systemId: currentSystemId,
    systemName: userSystemInfo?.name || `System ${currentSystemId}`,
    constellationId: userSystemInfo?.constellationId || 0,
    regionId: userSystemInfo?.regionId || 0,
  };

  // Fetch all nodes
  const allNodes = await listNodes({}, options);
  const totalNodesScanned = allNodes.length;

  // Filter nodes with valid location
  let candidateNodes = allNodes.filter(node => {
    // Must have a solar system assigned
    if (node.solarSystem <= 0) return false;

    // Exclude specific nodes
    if (excludeSet.has(node.id)) return false;

    // Apply urgency filter
    if (urgencyFilter.length > 0 && !urgencyFilter.includes(node.urgency)) {
      return false;
    }

    // Apply hasMatch filter
    if (filters.hasMatch !== undefined) {
      const hasMatch = !!node.activeMatchId;
      if (filters.hasMatch !== hasMatch) return false;
    }

    return true;
  });

  // Track applied filters
  if (urgencyFilter.length > 0) {
    filtersApplied.push(`urgency:${urgencyFilter.join(",")}`);
  }
  if (filters.hasMatch !== undefined) {
    filtersApplied.push(`hasMatch:${filters.hasMatch}`);
  }

  // Calculate distances to all candidate systems
  let recommendations: NodeRecommendation[] = [];

  if (topologyAvailable) {
    // Get unique system IDs from candidate nodes
    const systemIds = [...new Set(candidateNodes.map(n => n.solarSystem))];

    // Batch calculate distances
    const distanceMap = await calculateJumpsToMultiple(currentSystemId, systemIds, topologyOptions);

    // Score and filter nodes
    for (const node of candidateNodes) {
      const distance = distanceMap.get(node.solarSystem) ?? -1;

      // Skip unreachable nodes or nodes beyond maxJumps
      if (distance < 0 || distance > maxJumps) continue;

      const urgencyWeight = calculateUrgencyWeight(node.fillRatio);
      const distanceWeight = calculateDistanceWeight(distance);
      const matchBonus = calculateMatchBonus(!!node.activeMatchId);
      const score = urgencyWeight * distanceWeight * matchBonus;

      const nodeSystemInfo = await getSystemInfo(node.solarSystem, topologyOptions);

      recommendations.push({
        node,
        distance,
        score,
        urgencyWeight,
        distanceWeight,
        matchBonus,
        systemName: nodeSystemInfo?.name || `System ${node.solarSystem}`,
      });
    }
  } else {
    // Fallback: only include nodes in the same system
    filtersApplied.push("fallback:same-system-only");

    for (const node of candidateNodes) {
      if (node.solarSystem !== currentSystemId) continue;

      const urgencyWeight = calculateUrgencyWeight(node.fillRatio);
      const distanceWeight = 1.0; // same system
      const matchBonus = calculateMatchBonus(!!node.activeMatchId);
      const score = urgencyWeight * distanceWeight * matchBonus;

      recommendations.push({
        node,
        distance: 0,
        score,
        urgencyWeight,
        distanceWeight,
        matchBonus,
        systemName: userLocation.systemName,
      });
    }
  }

  // Sort by score (descending), then by distance (ascending)
  recommendations.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.distance !== b.distance) return a.distance - b.distance;
    return a.node.name.localeCompare(b.node.name);
  });

  // Apply limit
  const nodesInRange = recommendations.length;
  recommendations = recommendations.slice(0, limit);

  return {
    recommendations,
    userLocation,
    meta: {
      totalNodesScanned,
      nodesInRange,
      filtersApplied,
      maxJumpsUsed: maxJumps,
      topologyAvailable,
    },
  };
}

/**
 * Get the best recommendation for a specific user.
 * Used for tactical panel to show each team member their top pick.
 */
export async function getBestRecommendation(
  currentSystemId: number,
  excludeNodeIds: string[] = [],
  options: RuntimeOptions = {}
): Promise<NodeRecommendation | null> {
  const result = await getNodeRecommendations(
    currentSystemId,
    {
      maxJumps: 5,
      limit: 1,
      excludeNodeIds,
    },
    options
  );

  return result.recommendations[0] || null;
}

/**
 * Generate tactical recommendations for a team.
 * Each member gets their best node based on their location.
 *
 * @param memberLocations - Map of wallet address to system ID
 * @param strategy - 'concentrate' (same node) or 'spread' (different nodes)
 */
export async function getTeamRecommendations(
  memberLocations: Map<string, number>,
  strategy: "concentrate" | "spread" = "spread",
  options: RuntimeOptions = {}
): Promise<Map<string, NodeRecommendation | null>> {
  const result = new Map<string, NodeRecommendation | null>();
  const assignedNodeIds: string[] = [];

  // Sort members by their location (for deterministic assignment)
  const members = [...memberLocations.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  if (strategy === "concentrate") {
    // Find the best overall node for the team
    // Use the first member's location as reference
    const [firstWallet, firstSystemId] = members[0] || [];
    if (!firstSystemId) {
      for (const [wallet] of members) {
        result.set(wallet, null);
      }
      return result;
    }

    const bestForTeam = await getBestRecommendation(firstSystemId, [], options);

    // Assign the same node to all members
    for (const [wallet] of members) {
      result.set(wallet, bestForTeam);
    }
  } else {
    // Spread strategy: each member gets a different node
    for (const [wallet, systemId] of members) {
      if (!systemId) {
        result.set(wallet, null);
        continue;
      }

      const recommendation = await getBestRecommendation(
        systemId,
        assignedNodeIds,
        options
      );

      if (recommendation) {
        assignedNodeIds.push(recommendation.node.id);
      }

      result.set(wallet, recommendation);
    }
  }

  return result;
}

/**
 * Calculate estimated score contribution for a recommendation.
 * Based on node urgency and expected fuel delivery.
 */
export function estimateScoreContribution(recommendation: NodeRecommendation): number {
  const { node } = recommendation;

  // Base score depends on urgency
  let baseScore = 100;
  if (node.urgency === "critical") {
    baseScore = 300; // 3x points for critical nodes
  } else if (node.urgency === "warning") {
    baseScore = 150; // 1.5x points for warning nodes
  }

  // Adjust by fill ratio (lower fill = more room for fuel = more points)
  const fillBonus = (1 - node.fillRatio) * 0.5 + 0.5; // 0.5 to 1.0

  return Math.round(baseScore * fillBonus);
}
