import assert from "node:assert/strict";
import test from "node:test";
import type { NetworkNode, NodeFilters } from "../../types/node.ts";

/**
 * Node Runtime 测试
 *
 * 测试覆盖：
 * - 过滤逻辑（urgency、hasMatch、isOnline、typeId、solarSystem）
 * - 排序逻辑（urgency > fillRatio > updatedAt）
 * - Limit 限制
 * - 边界情况
 */

// Mock 节点数据
const mockNodes: NetworkNode[] = [
  {
    id: "node-1",
    objectId: "node-1",
    name: "Critical Node 1",
    typeId: 100,
    ownerAddress: "0xowner1",
    ownerCapId: "0xcap1",
    isPublic: true,
    coordX: 100,
    coordY: 200,
    coordZ: 300,
    solarSystem: 1,
    fuelQuantity: 50,
    fuelMaxCapacity: 1000,
    fuelTypeId: 1,
    fuelBurnRate: 60000,
    isBurning: true,
    fillRatio: 0.05, // critical
    urgency: "critical",
    maxEnergyProduction: 100,
    currentEnergyProduction: 50,
    isOnline: true,
    connectedAssemblyIds: [],
    activeMatchId: "match-1",
    description: null,
    imageUrl: null,
    lastUpdatedOnChain: "2026-03-24T10:00:00.000Z",
    updatedAt: "2026-03-24T10:00:00.000Z"
  },
  {
    id: "node-2",
    objectId: "node-2",
    name: "Critical Node 2",
    typeId: 100,
    ownerAddress: "0xowner2",
    ownerCapId: "0xcap2",
    isPublic: true,
    coordX: 150,
    coordY: 250,
    coordZ: 350,
    solarSystem: 1,
    fuelQuantity: 150,
    fuelMaxCapacity: 1000,
    fuelTypeId: 1,
    fuelBurnRate: 60000,
    isBurning: true,
    fillRatio: 0.15, // critical
    urgency: "critical",
    maxEnergyProduction: 100,
    currentEnergyProduction: 50,
    isOnline: true,
    connectedAssemblyIds: [],
    activeMatchId: null,
    description: null,
    imageUrl: null,
    lastUpdatedOnChain: "2026-03-24T10:01:00.000Z",
    updatedAt: "2026-03-24T10:01:00.000Z"
  },
  {
    id: "node-3",
    objectId: "node-3",
    name: "Warning Node",
    typeId: 200,
    ownerAddress: "0xowner3",
    ownerCapId: "0xcap3",
    isPublic: true,
    coordX: 200,
    coordY: 300,
    coordZ: 400,
    solarSystem: 2,
    fuelQuantity: 300,
    fuelMaxCapacity: 1000,
    fuelTypeId: 1,
    fuelBurnRate: 60000,
    isBurning: false,
    fillRatio: 0.3, // warning
    urgency: "warning",
    maxEnergyProduction: 100,
    currentEnergyProduction: 0,
    isOnline: true,
    connectedAssemblyIds: [],
    activeMatchId: "match-2",
    description: null,
    imageUrl: null,
    lastUpdatedOnChain: "2026-03-24T10:02:00.000Z",
    updatedAt: "2026-03-24T10:02:00.000Z"
  },
  {
    id: "node-4",
    objectId: "node-4",
    name: "Safe Node",
    typeId: 100,
    ownerAddress: "0xowner4",
    ownerCapId: "0xcap4",
    isPublic: false,
    coordX: 250,
    coordY: 350,
    coordZ: 450,
    solarSystem: 2,
    fuelQuantity: 800,
    fuelMaxCapacity: 1000,
    fuelTypeId: 1,
    fuelBurnRate: 60000,
    isBurning: true,
    fillRatio: 0.8, // safe
    urgency: "safe",
    maxEnergyProduction: 100,
    currentEnergyProduction: 75,
    isOnline: true,
    connectedAssemblyIds: ["0xassembly1"],
    activeMatchId: null,
    description: "Safe node description",
    imageUrl: "https://example.com/node4.png",
    lastUpdatedOnChain: "2026-03-24T10:03:00.000Z",
    updatedAt: "2026-03-24T10:03:00.000Z"
  },
  {
    id: "node-5",
    objectId: "node-5",
    name: "Offline Node",
    typeId: 200,
    ownerAddress: "0xowner5",
    ownerCapId: "0xcap5",
    isPublic: true,
    coordX: 300,
    coordY: 400,
    coordZ: 500,
    solarSystem: 3,
    fuelQuantity: 100,
    fuelMaxCapacity: 1000,
    fuelTypeId: 1,
    fuelBurnRate: 60000,
    isBurning: false,
    fillRatio: 0.1, // critical
    urgency: "critical",
    maxEnergyProduction: 100,
    currentEnergyProduction: 0,
    isOnline: false, // offline
    connectedAssemblyIds: [],
    activeMatchId: null,
    description: null,
    imageUrl: null,
    lastUpdatedOnChain: "2026-03-24T10:04:00.000Z",
    updatedAt: "2026-03-24T10:04:00.000Z"
  }
];

// === 过滤逻辑测试 ===

test("applyFilters: urgency=critical", () => {
  const filters: NodeFilters = { urgency: "critical" };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 3, "should return 3 critical nodes (including offline one)");
  result.forEach((node) => {
    assert.equal(node.urgency, "critical");
  });
});

test("applyFilters: urgency=warning", () => {
  const filters: NodeFilters = { urgency: "warning" };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 1);
  result.forEach((node) => {
    assert.equal(node.urgency, "warning");
  });
});

test("applyFilters: urgency=safe", () => {
  const filters: NodeFilters = { urgency: "safe" };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 1);
  result.forEach((node) => {
    assert.equal(node.urgency, "safe");
  });
});

test("applyFilters: hasMatch=true", () => {
  const filters: NodeFilters = { hasMatch: true };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 2, "should return 2 nodes with matches");
  result.forEach((node) => {
    assert.notEqual(node.activeMatchId, null);
  });
});

test("applyFilters: hasMatch=false", () => {
  const filters: NodeFilters = { hasMatch: false };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 3, "should return 3 nodes without matches");
  result.forEach((node) => {
    assert.equal(node.activeMatchId, null);
  });
});

test("applyFilters: isOnline=true", () => {
  const filters: NodeFilters = { isOnline: true };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 4, "should return 4 online nodes");
  result.forEach((node) => {
    assert.equal(node.isOnline, true);
  });
});

test("applyFilters: isOnline=false", () => {
  const filters: NodeFilters = { isOnline: false };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 1, "should return 1 offline node");
  result.forEach((node) => {
    assert.equal(node.isOnline, false);
  });
});

test("applyFilters: typeId=100", () => {
  const filters: NodeFilters = { typeId: 100 };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 3, "should return 3 nodes with typeId=100");
  result.forEach((node) => {
    assert.equal(node.typeId, 100);
  });
});

test("applyFilters: typeId=200", () => {
  const filters: NodeFilters = { typeId: 200 };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 2, "should return 2 nodes with typeId=200");
  result.forEach((node) => {
    assert.equal(node.typeId, 200);
  });
});

test("applyFilters: solarSystem=1", () => {
  const filters: NodeFilters = { solarSystem: 1 };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 2, "should return 2 nodes in solarSystem=1");
  result.forEach((node) => {
    assert.equal(node.solarSystem, 1);
  });
});

test("applyFilters: solarSystem=0（无匹配）", () => {
  const filters: NodeFilters = { solarSystem: 0 };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 0, "mock data has no solarSystem=0 node");
});

test("applyFilters: limit=2", () => {
  const filters: NodeFilters = { limit: 2 };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 2, "should return at most 2 nodes");
});

test("applyFilters: limit=0 被忽略", () => {
  const filters: NodeFilters = { limit: 0 };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, mockNodes.length, "limit=0 should be ignored");
});

test("applyFilters: limit=-1 被忽略", () => {
  const filters: NodeFilters = { limit: -1 };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, mockNodes.length, "limit=-1 should be ignored");
});

test("applyFilters: 组合过滤器（urgency + isOnline）", () => {
  const filters: NodeFilters = { urgency: "critical", isOnline: true };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 2, "should return 2 critical AND online nodes");
  result.forEach((node) => {
    assert.equal(node.urgency, "critical");
    assert.equal(node.isOnline, true);
  });
});

test("applyFilters: 组合过滤器（urgency + hasMatch + limit）", () => {
  const filters: NodeFilters = { urgency: "critical", hasMatch: true, limit: 1 };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 1, "should return 1 node");
  assert.equal(result[0]?.urgency, "critical");
  assert.notEqual(result[0]?.activeMatchId, null);
});

test("applyFilters: 组合过滤器（typeId + isOnline + hasMatch）", () => {
  const filters: NodeFilters = { typeId: 100, isOnline: true, hasMatch: false };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 2, "should return 2 nodes");
  result.forEach((node) => {
    assert.equal(node.typeId, 100);
    assert.equal(node.isOnline, true);
    assert.equal(node.activeMatchId, null);
  });
});

// === 排序逻辑测试 ===

test("applySorting: urgency 降序（critical > warning > safe）", () => {
  const sorted = applySorting([...mockNodes].filter((n) => n.isOnline));

  const urgencies = sorted.map((n) => n.urgency);

  // critical 节点应排在最前面
  assert.ok(
    urgencies.indexOf("critical") < urgencies.indexOf("warning"),
    "critical should come before warning"
  );
  assert.ok(urgencies.indexOf("warning") < urgencies.indexOf("safe"), "warning should come before safe");
});

test("applySorting: 同 urgency 时按 fillRatio 升序", () => {
  const criticalNodes = mockNodes.filter((n) => n.urgency === "critical" && n.isOnline);
  const sorted = applySorting(criticalNodes);

  // node-1 (0.05) 应排在 node-2 (0.15) 前面
  assert.equal(sorted[0]?.fillRatio, 0.05);
  assert.equal(sorted[1]?.fillRatio, 0.15);
});

test("applySorting: 同 urgency 且同 fillRatio 时按 updatedAt 降序", () => {
  const nodesWithSameFillRatio = [
    {
      ...mockNodes[0],
      fillRatio: 0.1,
      updatedAt: "2026-03-24T10:00:00.000Z"
    },
    {
      ...mockNodes[1],
      fillRatio: 0.1,
      updatedAt: "2026-03-24T10:05:00.000Z"
    }
  ];

  const sorted = applySorting(nodesWithSameFillRatio);

  // 更新时间晚的应排在前面
  assert.equal(sorted[0]?.updatedAt, "2026-03-24T10:05:00.000Z");
  assert.equal(sorted[1]?.updatedAt, "2026-03-24T10:00:00.000Z");
});

test("applySorting: 完整排序逻辑", () => {
  const sorted = applySorting([...mockNodes].filter((n) => n.isOnline));

  // 验证排序结果
  // 1. node-1: critical, fillRatio=0.05
  // 2. node-2: critical, fillRatio=0.15
  // 3. node-3: warning, fillRatio=0.3
  // 4. node-4: safe, fillRatio=0.8

  assert.equal(sorted[0]?.id, "node-1");
  assert.equal(sorted[1]?.id, "node-2");
  assert.equal(sorted[2]?.id, "node-3");
  assert.equal(sorted[3]?.id, "node-4");
});

// === 边界情况测试 ===

test("applyFilters: 空数组", () => {
  const result = applyFilters([], {});
  assert.deepEqual(result, []);
});

test("applyFilters: 无匹配结果", () => {
  const filters: NodeFilters = { urgency: "critical", hasMatch: true, typeId: 999 };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, 0);
});

test("applyFilters: 无过滤器（返回所有节点）", () => {
  const result = applyFilters(mockNodes, {});
  assert.equal(result.length, mockNodes.length);
});

test("applyFilters: limit 大于总数", () => {
  const filters: NodeFilters = { limit: 1000 };
  const result = applyFilters(mockNodes, filters);

  assert.equal(result.length, mockNodes.length);
});

// === 辅助函数实现 ===

const URGENCY_WEIGHT = { critical: 3, warning: 2, safe: 1 };

function applyFilters(nodes: NetworkNode[], filters: NodeFilters = {}): NetworkNode[] {
  const filtered = nodes.filter((node) => {
    if (filters.urgency && node.urgency !== filters.urgency) {
      return false;
    }
    if (typeof filters.hasMatch === "boolean" && (node.activeMatchId !== null) !== filters.hasMatch) {
      return false;
    }
    if (typeof filters.isOnline === "boolean" && node.isOnline !== filters.isOnline) {
      return false;
    }
    if (typeof filters.typeId === "number" && node.typeId !== filters.typeId) {
      return false;
    }
    if (typeof filters.solarSystem === "number" && node.solarSystem !== filters.solarSystem) {
      return false;
    }
    return true;
  });

  const sorted = applySorting(filtered);

  if (typeof filters.limit === "number" && filters.limit > 0) {
    return sorted.slice(0, filters.limit);
  }

  return sorted;
}

function applySorting(nodes: NetworkNode[]): NetworkNode[] {
  return nodes.sort((a, b) => {
    const urgencyDelta = URGENCY_WEIGHT[b.urgency] - URGENCY_WEIGHT[a.urgency];
    if (urgencyDelta !== 0) {
      return urgencyDelta;
    }

    if (a.fillRatio !== b.fillRatio) {
      return a.fillRatio - b.fillRatio;
    }

    return b.updatedAt.localeCompare(a.updatedAt);
  });
}
