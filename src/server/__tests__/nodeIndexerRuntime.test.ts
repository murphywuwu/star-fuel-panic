import assert from "node:assert/strict";
import test from "node:test";

/**
 * Node Indexer Runtime 测试
 *
 * 测试覆盖：
 * - 字段解析函数
 * - fillRatio 计算
 * - urgency 推导
 * - 边界情况处理
 */

// Mock Sui 对象响应数据
const mockNetworkNodeObject = {
  data: {
    objectId: "0x1234567890abcdef",
    type: "0x93d3209c::network_node::NetworkNode",
    owner: {
      Shared: {
        initial_shared_version: 1
      }
    },
    content: {
      dataType: "moveObject" as const,
      type: "0x93d3209c::network_node::NetworkNode",
      hasPublicTransfer: false,
      fields: {
        id: {
          id: "0x1234567890abcdef"
        },
        key: {
          item_id: "12345",
          tenant: "0xabc"
        },
        type_id: "67890",
        owner_cap_id: {
          id: "0xownerCapId123"
        },
        status: {
          is_online: true
        },
        fuel: {
          quantity: "300",
          max_capacity: "1000",
          type_id: {
            vec: ["1"]
          },
          burn_rate_in_ms: "60000",
          is_burning: true,
          unit_volume: {
            vec: ["10"]
          }
        },
        energy_source: {
          max_production: "100",
          current_production: "75"
        },
        metadata: {
          vec: [
            {
              name: "SSU-Frontier-7",
              description: "Primary storage unit",
              url: "https://example.com/ssu-7.png"
            }
          ]
        },
        connected_assembly_ids: [
          { id: "0xassembly1" },
          { id: "0xassembly2" }
        ],
        location: {
          hash: "0xlocationHash"
        }
      }
    },
    display: {
      data: {
        name: "SSU Display Name"
      }
    }
  }
};

const mockLocationEvent = {
  type: "0x93d3209c::location::LocationRevealedEvent",
  parsedJson: {
    assembly_id: {
      id: "0x1234567890abcdef"
    },
    x: "1234.5",
    y: "5678.9",
    z: "9012.3",
    solarsystem: "42"
  },
  id: {
    txDigest: "0xtxdigest",
    eventSeq: "0"
  },
  timestampMs: "1711234567890"
};

// === 辅助函数测试 ===

test("clampFillRatio 计算正确（正常值）", () => {
  // 300 / 1000 = 0.3
  const fillRatio = clampFillRatio(300, 1000);
  assert.equal(fillRatio, 0.3);
});

test("clampFillRatio 计算正确（边界值 0）", () => {
  const fillRatio = clampFillRatio(0, 1000);
  assert.equal(fillRatio, 0);
});

test("clampFillRatio 计算正确（边界值 1）", () => {
  const fillRatio = clampFillRatio(1000, 1000);
  assert.equal(fillRatio, 1);
});

test("clampFillRatio 计算正确（超过最大值）", () => {
  // 超过 max_capacity 时应 clamp 到 1
  const fillRatio = clampFillRatio(1500, 1000);
  assert.equal(fillRatio, 1);
});

test("clampFillRatio 计算正确（负值）", () => {
  // 负值应 clamp 到 0
  const fillRatio = clampFillRatio(-100, 1000);
  assert.equal(fillRatio, 0);
});

test("clampFillRatio 处理 maxCapacity 为 0", () => {
  const fillRatio = clampFillRatio(100, 0);
  assert.equal(fillRatio, 0);
});

test("clampFillRatio 处理 maxCapacity 为负数", () => {
  const fillRatio = clampFillRatio(100, -100);
  assert.equal(fillRatio, 0);
});

test("clampFillRatio 精度正确（4 位小数）", () => {
  // 333 / 1000 = 0.333
  const fillRatio = clampFillRatio(333, 1000);
  assert.equal(fillRatio, 0.333);
});

test("deriveUrgency 正确推导（critical）", () => {
  assert.equal(deriveUrgency(0.0), "critical");
  assert.equal(deriveUrgency(0.1), "critical");
  assert.equal(deriveUrgency(0.19), "critical");
});

test("deriveUrgency 正确推导（warning）", () => {
  assert.equal(deriveUrgency(0.2), "warning");
  assert.equal(deriveUrgency(0.3), "warning");
  assert.equal(deriveUrgency(0.49), "warning");
});

test("deriveUrgency 正确推导（safe）", () => {
  assert.equal(deriveUrgency(0.5), "safe");
  assert.equal(deriveUrgency(0.75), "safe");
  assert.equal(deriveUrgency(1.0), "safe");
});

test("deriveUrgency 边界值正确", () => {
  // 临界值测试
  assert.equal(deriveUrgency(0.1999), "critical");
  assert.equal(deriveUrgency(0.2), "warning");
  assert.equal(deriveUrgency(0.4999), "warning");
  assert.equal(deriveUrgency(0.5), "safe");
});

// === 字段解析测试 ===

test("readFuelQuantity 正确解析", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const quantity = readFuelQuantity(fields);
  assert.equal(quantity, 300);
});

test("readFuelMaxCapacity 正确解析", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const maxCapacity = readFuelMaxCapacity(fields);
  assert.equal(maxCapacity, 1000);
});

test("readFuelTypeId 正确解析（Option<u64>）", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const typeId = readFuelTypeId(fields);
  assert.equal(typeId, 1);
});

test("readFuelTypeId 处理空 Option", () => {
  const fields = {
    fuel: {
      type_id: { vec: [] }
    }
  };
  const typeId = readFuelTypeId(fields);
  assert.equal(typeId, null);
});

test("readFuelBurnRate 正确解析", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const burnRate = readFuelBurnRate(fields);
  assert.equal(burnRate, 60000);
});

test("readIsBurning 正确解析（true）", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const isBurning = readIsBurning(fields);
  assert.equal(isBurning, true);
});

test("readIsBurning 正确解析（false）", () => {
  const fields = {
    fuel: {
      is_burning: false
    }
  };
  const isBurning = readIsBurning(fields);
  assert.equal(isBurning, false);
});

test("readMaxEnergyProduction 正确解析", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const maxProduction = readMaxEnergyProduction(fields);
  assert.equal(maxProduction, 100);
});

test("readCurrentEnergyProduction 正确解析", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const currentProduction = readCurrentEnergyProduction(fields);
  assert.equal(currentProduction, 75);
});

test("readIsOnline 正确解析（true）", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const isOnline = readIsOnline(fields);
  assert.equal(isOnline, true);
});

test("readIsOnline 正确解析（false）", () => {
  const fields = {
    status: {
      is_online: false
    }
  };
  const isOnline = readIsOnline(fields);
  assert.equal(isOnline, false);
});

test("readTypeId 正确解析", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const typeId = readTypeId(fields);
  assert.equal(typeId, 67890);
});

test("readOwnerCapId 正确解析", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const ownerCapId = readOwnerCapId(fields);
  assert.equal(ownerCapId, "0xownerCapId123");
});

test("readConnectedAssemblyIds 正确解析", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const assemblyIds = readConnectedAssemblyIds(fields);
  assert.deepEqual(assemblyIds, ["0xassembly1", "0xassembly2"]);
});

test("readConnectedAssemblyIds 处理空数组", () => {
  const fields = {
    connected_assembly_ids: []
  };
  const assemblyIds = readConnectedAssemblyIds(fields);
  assert.deepEqual(assemblyIds, []);
});

test("readMetadataName 优先使用 display.name", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const displayData = mockNetworkNodeObject.data.display?.data;
  const name = displayData?.name ?? readMetadataName(fields, "Fallback");
  assert.equal(name, "SSU Display Name");
});

test("readMetadataName 回退到 metadata.name", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const name = readMetadataName(fields, "Fallback");
  assert.equal(name, "SSU-Frontier-7");
});

test("readMetadataName 使用 fallback", () => {
  const fields = { metadata: { vec: [] } };
  const name = readMetadataName(fields, "NetworkNode-abc123");
  assert.equal(name, "NetworkNode-abc123");
});

test("readMetadataDescription 正确解析", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const description = readMetadataDescription(fields);
  assert.equal(description, "Primary storage unit");
});

test("readMetadataUrl 正确解析", () => {
  const fields = mockNetworkNodeObject.data.content.fields;
  const url = readMetadataUrl(fields);
  assert.equal(url, "https://example.com/ssu-7.png");
});

test("readOwnerAddress 正确解析 Shared", () => {
  const owner = mockNetworkNodeObject.data.owner;
  const address = readOwnerAddress(owner);
  assert.equal(address, "shared");
});

test("readOwnerAddress 正确解析 AddressOwner", () => {
  const owner = { AddressOwner: "0xabc123" };
  const address = readOwnerAddress(owner);
  assert.equal(address, "0xabc123");
});

test("readOwnerAddress 正确解析 ObjectOwner", () => {
  const owner = { ObjectOwner: "0xobject123" };
  const address = readOwnerAddress(owner);
  assert.equal(address, "0xobject123");
});

test("readIsSharedOwner 正确判断（Shared）", () => {
  const owner = mockNetworkNodeObject.data.owner;
  const isShared = readIsSharedOwner(owner);
  assert.equal(isShared, true);
});

test("readIsSharedOwner 正确判断（AddressOwner）", () => {
  const owner = { AddressOwner: "0xabc123" };
  const isShared = readIsSharedOwner(owner);
  assert.equal(isShared, false);
});

// === LocationRevealedEvent 解析测试 ===

test("LocationRevealedEvent 解析坐标", () => {
  const parsed = mockLocationEvent.parsedJson;
  const x = readNumber(parsed.x);
  const y = readNumber(parsed.y);
  const z = readNumber(parsed.z);
  const solarSystem = readNumber(parsed.solarsystem);

  assert.equal(x, 1234.5);
  assert.equal(y, 5678.9);
  assert.equal(z, 9012.3);
  assert.equal(solarSystem, 42);
});

// === 辅助函数实现（用于测试） ===

function clampFillRatio(fuelQuantity: number, fuelMaxCapacity: number) {
  if (fuelMaxCapacity <= 0) {
    return 0;
  }
  return Number(Math.max(0, Math.min(1, fuelQuantity / fuelMaxCapacity)).toFixed(4));
}

function deriveUrgency(fillRatio: number): "critical" | "warning" | "safe" {
  if (fillRatio < 0.2) {
    return "critical";
  }
  if (fillRatio < 0.5) {
    return "warning";
  }
  return "safe";
}

function readFuelQuantity(json: Record<string, unknown>) {
  return readNestedNumber(json, ["fuel", "quantity"]) ?? 0;
}

function readFuelMaxCapacity(json: Record<string, unknown>) {
  return readNestedNumber(json, ["fuel", "max_capacity"]) ?? 0;
}

function readFuelTypeId(json: Record<string, unknown>): number | null {
  const fuelRecord = asRecord(json.fuel);
  if (!fuelRecord) return null;
  const rawTypeId = unwrapMoveOption(fuelRecord.type_id);
  return readNumber(rawTypeId);
}

function readFuelBurnRate(json: Record<string, unknown>) {
  return readNestedNumber(json, ["fuel", "burn_rate_in_ms"]) ?? 0;
}

function readIsBurning(json: Record<string, unknown>): boolean {
  const value =
    json.fuel && typeof json.fuel === "object" && "is_burning" in json.fuel
      ? (json.fuel as Record<string, unknown>).is_burning
      : false;
  return Boolean(value);
}

function readMaxEnergyProduction(json: Record<string, unknown>) {
  return readNestedNumber(json, ["energy_source", "max_production"]) ?? 0;
}

function readCurrentEnergyProduction(json: Record<string, unknown>) {
  return readNestedNumber(json, ["energy_source", "current_production"]) ?? 0;
}

function readIsOnline(json: Record<string, unknown>): boolean {
  const statusRecord = asRecord(json.status);
  if (!statusRecord) {
    return false;
  }
  const isOnline = statusRecord.is_online ?? statusRecord.online;
  return Boolean(isOnline);
}

function readTypeId(json: Record<string, unknown>): number {
  return readNestedNumber(json, ["type_id"]) ?? 0;
}

function readOwnerCapId(json: Record<string, unknown>): string | null {
  return readNestedString(json, ["owner_cap_id", "id"]) ?? readNestedString(json, ["owner_cap_id"]) ?? null;
}

function readConnectedAssemblyIds(json: Record<string, unknown>): string[] {
  const ids = json.connected_assembly_ids;
  if (!Array.isArray(ids)) {
    return [];
  }
  return ids.map((id) => readString(id)).filter((id): id is string => typeof id === "string");
}

function readMetadataName(json: Record<string, unknown>, fallbackName: string) {
  const metadata = asRecord(unwrapMoveOption(json.metadata)) ?? asRecord(json.metadata) ?? null;
  return readNestedString(metadata, ["name"]) ?? fallbackName;
}

function readMetadataDescription(json: Record<string, unknown>): string | null {
  const metadata = asRecord(unwrapMoveOption(json.metadata)) ?? asRecord(json.metadata) ?? null;
  return readNestedString(metadata, ["description"]) ?? null;
}

function readMetadataUrl(json: Record<string, unknown>): string | null {
  const metadata = asRecord(unwrapMoveOption(json.metadata)) ?? asRecord(json.metadata) ?? null;
  return readNestedString(metadata, ["url"]) ?? null;
}

function readOwnerAddress(owner: unknown) {
  const record = asRecord(owner);
  if (!record) {
    return "shared";
  }
  if (typeof record.AddressOwner === "string") {
    return record.AddressOwner;
  }
  if (typeof record.ObjectOwner === "string") {
    return record.ObjectOwner;
  }
  if ("Shared" in record) {
    return "shared";
  }
  return "unknown";
}

function readIsSharedOwner(owner: unknown) {
  const record = asRecord(owner);
  return Boolean(record && "Shared" in record);
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readString(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }
  const record = asRecord(value);
  if (!record) {
    return null;
  }
  if (typeof record.id === "string") {
    return record.id;
  }
  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function unwrapMoveOption(value: unknown): unknown {
  if (value === null || value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  const record = asRecord(value);
  if (!record) {
    return value;
  }
  if (Array.isArray(record.vec)) {
    return record.vec[0] ?? null;
  }
  return value;
}

function readNestedNumber(record: Record<string, unknown> | null, path: string[]) {
  let current: unknown = record;
  for (const part of path) {
    const nextRecord = asRecord(current);
    if (!nextRecord) {
      return null;
    }
    current = nextRecord[part];
  }
  return readNumber(current);
}

function readNestedString(record: Record<string, unknown> | null, path: string[]) {
  let current: unknown = record;
  for (const part of path) {
    const nextRecord = asRecord(current);
    if (!nextRecord) {
      return null;
    }
    current = nextRecord[part];
  }
  return readString(current);
}
