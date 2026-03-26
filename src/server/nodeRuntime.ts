import { listMissions } from "./missionRuntime.ts";
import { readIndexedNodes, syncNodeIndexOnce } from "./nodeIndexerRuntime.ts";
import {
  listPersistedMatches,
  readPersistedNetworkNodes,
  updateProjectionRuntimeMeta,
  writePersistedNetworkNodes
} from "./runtimeProjectionStore.ts";
import type { Match, MatchStatus } from "../types/match.ts";
import type { Mission, UrgencyLevel } from "../types/mission.ts";
import type { NetworkNode, NodeFilters } from "../types/node.ts";

const URGENCY_WEIGHT: Record<UrgencyLevel, number> = {
  critical: 3,
  warning: 2,
  safe: 1
};

function clampFillRatio(fuelQuantity: number, fuelMaxCapacity: number) {
  if (fuelMaxCapacity <= 0) {
    return 0;
  }
  return Number(Math.max(0, Math.min(1, fuelQuantity / fuelMaxCapacity)).toFixed(4));
}

function deriveUrgency(fillRatio: number): UrgencyLevel {
  if (fillRatio < 0.2) {
    return "critical";
  }
  if (fillRatio < 0.5) {
    return "warning";
  }
  return "safe";
}

function mapMissionStatus(status: Mission["status"]): MatchStatus {
  switch (status) {
    case "in_progress":
      return "running";
    case "settled":
      return "settled";
    case "expired":
      return "settling";
    case "open":
    default:
      return "lobby";
  }
}

function mapMissionToMatch(mission: Mission, nodeId: string): Match {
  return {
    id: mission.id,
    onChainId: mission.assemblyId,
    status: mapMissionStatus(mission.status),
    creationMode: "free",
    targetNodeIds: [nodeId],
    prizePool: mission.prizePool,
    hostPrizePool: 0,
    entryFee: mission.entryFee,
    minTeams: mission.minTeams,
    maxTeams: mission.maxTeams,
    durationMinutes: 10,
    scoringMode: "weighted",
    triggerMode: mission.startRuleMode === "full_paid" ? "dynamic" : "min_threshold",
    startedAt: null,
    endedAt: null,
    createdBy: "system",
    hostAddress: null,
    createdAt: mission.createdAt
  };
}

async function buildNodes(options: { forceRefresh?: boolean } = {}) {
  const persistedMatches = listPersistedMatches();
  const fallbackMissions = persistedMatches.length === 0 ? listMissions() : [];
  const missionByObjectId = new Map(fallbackMissions.map((mission) => [mission.assemblyId, mission]));
  const activeMatchByObjectId = new Map<string, string>();

  for (const match of persistedMatches) {
    if (match.status === "settled" || match.status === "draft") {
      continue;
    }

    for (const nodeId of match.targetNodeIds) {
      if (!activeMatchByObjectId.has(nodeId)) {
        activeMatchByObjectId.set(nodeId, match.id);
      }
    }
  }

  let snapshot = await readIndexedNodes();

  // 如果缓存为空或强制刷新，从链上同步数据
  if (options.forceRefresh || snapshot.nodes.length === 0) {
    console.log("[nodeRuntime] Cache empty or force refresh requested, syncing from chain...");
    try {
      snapshot = await syncNodeIndexOnce();
      console.log(`[nodeRuntime] Synced ${snapshot.nodes.length} nodes from chain`);
      updateProjectionRuntimeMeta("nodes", {
        lastSyncAt: snapshot.lastSyncAt,
        stale: false,
        reason: null
      });
    } catch (error) {
      console.error("[nodeRuntime] Failed to sync nodes from chain:", error);
      // 如果同步失败，继续使用缓存数据（可能为空）
      updateProjectionRuntimeMeta("nodes", {
        stale: true,
        reason: error instanceof Error ? error.message : "NODE_SYNC_FAILED"
      });
    }
  }

  let indexedNodes = snapshot.nodes;
  if (indexedNodes.length === 0) {
    indexedNodes = readPersistedNetworkNodes();
  }

  writePersistedNetworkNodes(indexedNodes);

  const nodes = indexedNodes.map((indexedNode) => {
    const activeMission = missionByObjectId.get(indexedNode.objectId);

    // IndexedNode 已经包含了所有 NetworkNode 字段（除了 activeMatchId）
    // 直接合并即可
    const node: NetworkNode = {
      ...indexedNode,
      activeMatchId: activeMatchByObjectId.get(indexedNode.objectId) ?? activeMission?.id ?? null
    };

    return {
      node,
      activeMatch: activeMission ? mapMissionToMatch(activeMission, indexedNode.objectId) : null
    };
  });

  return nodes;
}

function applyFilters(
  entries: Array<{ node: NetworkNode; activeMatch: Match | null }>,
  filters: NodeFilters = {}
) {
  const filtered = entries.filter(({ node }) => {
    // 紧急度过滤
    if (filters.urgency && node.urgency !== filters.urgency) {
      return false;
    }

    // 比赛关联过滤
    if (typeof filters.hasMatch === "boolean" && (node.activeMatchId !== null) !== filters.hasMatch) {
      return false;
    }

    // 在线状态过滤（新增）
    if (typeof filters.isOnline === "boolean" && node.isOnline !== filters.isOnline) {
      return false;
    }

    // 站点类型过滤（新增）
    if (typeof filters.typeId === "number" && node.typeId !== filters.typeId) {
      return false;
    }

    // 星系过滤（PRD 4.1.7）
    if (typeof filters.solarSystem === "number" && node.solarSystem !== filters.solarSystem) {
      return false;
    }

    return true;
  });

  // 排序逻辑：紧急度 > 填充率（升序，越低越紧急）> 更新时间
  filtered.sort((a, b) => {
    const urgencyDelta = URGENCY_WEIGHT[b.node.urgency] - URGENCY_WEIGHT[a.node.urgency];
    if (urgencyDelta !== 0) {
      return urgencyDelta;
    }

    if (a.node.fillRatio !== b.node.fillRatio) {
      return a.node.fillRatio - b.node.fillRatio;
    }

    return b.node.updatedAt.localeCompare(a.node.updatedAt);
  });

  if (typeof filters.limit === "number" && filters.limit > 0) {
    return filtered.slice(0, filters.limit);
  }

  return filtered;
}

export async function listNodes(filters: NodeFilters = {}, options: { forceRefresh?: boolean } = {}) {
  return applyFilters(await buildNodes(options), filters).map(({ node }) => node);
}

export async function getNodeById(nodeId: string, options: { forceRefresh?: boolean } = {}) {
  return (await buildNodes(options)).find(({ node }) => node.id === nodeId || node.objectId === nodeId) ?? null;
}
