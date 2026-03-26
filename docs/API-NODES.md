# API Documentation: /api/nodes

## 概述

`GET /api/nodes` 端点用于获取 EVE Frontier 链上的所有 NetworkNode 数据，是星系热力图和比赛发布的核心数据源。

---

## 端点

### `GET /api/nodes`

获取所有网络节点列表（支持过滤）

**请求示例**：
```http
GET /api/nodes?urgency=critical&isOnline=true&limit=50
```

**查询参数**：

| 参数 | 类型 | 可选值 | 说明 |
|------|------|--------|------|
| `urgency` | string | `critical` / `warning` / `safe` | 按紧急度过滤 |
| `hasMatch` | boolean | `true` / `false` | 是否有关联比赛 |
| `isOnline` | boolean | `true` / `false` | 是否在线（离线站点不返回） |
| `typeId` | number | 任意正整数 | 按站点类型 ID 过滤 |
| `limit` | number | 任意正整数 | 返回数量限制 |

**响应示例**：
```json
{
  "nodes": [
    {
      "id": "0x1a2b3c4d...",
      "objectId": "0x1a2b3c4d...",
      "name": "SSU-Frontier-7",
      "typeId": 12345,
      "ownerAddress": "0xabcd...",
      "ownerCapId": "0xef01...",
      "isPublic": true,
      "coordX": 1234.5,
      "coordY": 5678.9,
      "coordZ": 9012.3,
      "solarSystem": 42,
      "fuelQuantity": 120,
      "fuelMaxCapacity": 1000,
      "fuelTypeId": 1,
      "fuelBurnRate": 60000,
      "isBurning": true,
      "fillRatio": 0.12,
      "urgency": "critical",
      "maxEnergyProduction": 100,
      "currentEnergyProduction": 50,
      "isOnline": true,
      "connectedAssemblyIds": ["0x5678...", "0x9abc..."],
      "activeMatchId": "match_123",
      "description": "Primary storage unit for Sector 04",
      "imageUrl": "https://...",
      "lastUpdatedOnChain": "2026-03-24T10:30:00.000Z",
      "updatedAt": "2026-03-24T10:30:05.123Z"
    }
  ]
}
```

---

### `GET /api/nodes/[id]`

获取单个网络节点详情（包含关联比赛信息）

**请求示例**：
```http
GET /api/nodes/0x1a2b3c4d5e6f...
```

**响应示例**：
```json
{
  "node": {
    "id": "0x1a2b3c4d...",
    "objectId": "0x1a2b3c4d...",
    // ... 同上，包含所有 NetworkNode 字段
  },
  "activeMatch": {
    "id": "match_123",
    "onChainId": "0x1a2b3c4d...",
    "status": "running",
    "prizePool": 1200,
    "entryFee": 100,
    // ... 其他比赛字段
  }
}
```

**404 响应**：
```json
{
  "ok": false,
  "error": {
    "code": "UNKNOWN",
    "message": "Node not found"
  }
}
```

---

## NetworkNode 数据模型

### 基础标识

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 链上对象 ID |
| `objectId` | string | 同 `id`（兼容字段） |
| `name` | string | 站点名称（从 metadata.name 或 display 读取） |
| `typeId` | number | 站点类型 ID（区分 SSU/Gate/Turret） |

### 所有权信息

| 字段 | 类型 | 说明 |
|------|------|------|
| `ownerAddress` | string | 所有者地址（AddressOwner/ObjectOwner/Shared） |
| `ownerCapId` | string \| null | 关联的 OwnerCap<NetworkNode> ID |
| `isPublic` | boolean | 是否为共享对象（Shared Object） |

### 位置信息

| 字段 | 类型 | 说明 |
|------|------|------|
| `coordX` | number | X 坐标 |
| `coordY` | number | Y 坐标 |
| `coordZ` | number | Z 坐标 |
| `solarSystem` | number | 星系 ID |

### 燃料数据（核心）

| 字段 | 类型 | 说明 |
|------|------|------|
| `fuelQuantity` | number | 当前油量（`world::fuel::Fuel.quantity`） |
| `fuelMaxCapacity` | number | 最大容量（`world::fuel::Fuel.max_capacity`） |
| `fuelTypeId` | number \| null | 燃料类型 ID |
| `fuelBurnRate` | number | 燃料消耗速率（毫秒） |
| `isBurning` | boolean | 是否正在燃烧 |
| `fillRatio` | number | **填充率**（计算字段：`quantity / max_capacity`，0-1 范围） |
| `urgency` | `"critical"` \| `"warning"` \| `"safe"` | **紧急度**（< 0.2 = critical，< 0.5 = warning，else safe） |

### 能量数据

| 字段 | 类型 | 说明 |
|------|------|------|
| `maxEnergyProduction` | number | 最大能量产出 |
| `currentEnergyProduction` | number | 当前能量产出 |

### 状态信息

| 字段 | 类型 | 说明 |
|------|------|------|
| `isOnline` | boolean | 是否在线（`world::status::AssemblyStatus.is_online`） |
| `connectedAssemblyIds` | string[] | 连接的设施 ID 列表（Gate/Turret/SSU） |

### 平台扩展字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `activeMatchId` | string \| null | 当前关联的比赛 ID（平台数据） |

### 元数据

| 字段 | 类型 | 说明 |
|------|------|------|
| `description` | string \| null | 站点描述 |
| `imageUrl` | string \| null | 图标 URL |

### 时间戳

| 字段 | 类型 | 说明 |
|------|------|------|
| `lastUpdatedOnChain` | string | 链上最后更新时间（ISO 8601） |
| `updatedAt` | string | 本地缓存更新时间（ISO 8601） |

---

## 数据来源

### 链上数据源

| 模块 | 事件/对象 | 用途 |
|------|-----------|------|
| `world::network_node` | `NetworkNodeCreatedEvent` | 发现新站点 |
| `world::network_node` | `NetworkNode` 对象 | 读取 fuel、energy、status 等字段 |
| `world::location` | `LocationRevealedEvent` | 获取站点坐标 |

### 更新机制

**Node Scanner Worker**（每 5 秒）：
1. 监听 `NetworkNodeCreatedEvent` 发现新站点
2. 监听 `LocationRevealedEvent` 更新坐标
3. 批量调用 `sui.multiGetObjects()` 获取最新状态
4. 写入本地缓存文件 `data/node-index.json`

**API 查询流程**：
```
/api/nodes 请求
  ↓
读取缓存文件 (data/node-index.json)
  ↓
应用过滤器（urgency、isOnline、typeId 等）
  ↓
合并关联比赛数据（activeMatchId）
  ↓
返回 JSON 响应
```

---

## 常见使用场景

### 1. 获取所有红色警戒站点（用于自动比赛生成）

```http
GET /api/nodes?urgency=critical&isOnline=true&limit=20
```

### 2. 获取所有有比赛进行中的站点（用于地图高亮）

```http
GET /api/nodes?hasMatch=true
```

### 3. 获取特定星系的所有在线站点

```typescript
// 先从星系 API 获取官方星系元数据
const systemRes = await fetch('/api/solar-systems/30000001');
const { system } = await systemRes.json();

// 再按 solarSystem 拉取该星系的节点
const nodesRes = await fetch(`/api/nodes?solarSystem=${system.systemId}&isOnline=true`);
const { nodes } = await nodesRes.json();
```

### 4. 获取站点详情（包含关联比赛）

```http
GET /api/nodes/0x1a2b3c4d5e6f...
```

---

## 错误处理

**500 Internal Server Error**：
```json
{
  "ok": false,
  "error": {
    "code": "CHAIN_SYNC_ERROR",
    "message": "Failed to load on-chain nodes"
  }
}
```

常见原因：
- Sui RPC 连接失败
- 缓存文件损坏
- 数据解析错误

**解决方案**：
- 检查 Sui RPC 配置（`NEXT_PUBLIC_SUI_RPC_URL`）
- 重启 Node Scanner Worker 触发重新同步
- 检查日志文件排查具体错误

---

## 性能优化

### 缓存机制

- **数据源**：本地文件缓存（`data/node-index.json`）
- **更新频率**：每 5 秒（可通过 `NODE_INDEXER_INTERVAL_MS` 环境变量配置）
- **响应时间**：< 50ms（从缓存读取）

### 批量查询优化

`multiGetObjects()` 批量查询（每批 50 个对象）：
- 减少 RPC 调用次数
- 降低网络延迟
- 避免 rate limiting

### 过滤器优化

优先使用服务端过滤参数，而非前端过滤：
```
✅ 推荐：GET /api/nodes?urgency=critical&limit=10
❌ 不推荐：GET /api/nodes（前端再 filter）
```

---

## 与 Solar Systems API 的关系

当前推荐分工：

- `/api/nodes`
  - 读取链上节点事实
  - 返回节点燃料、状态、所属 `solarSystem`
- `/api/solar-systems`
  - 读取官方全宇宙星系元数据
  - 返回星系名称、区域、星座、宇宙坐标
- `/api/solar-systems/[id]`
  - 读取单星系详情
  - 返回 `gateLinks`

推荐组合：

1. 用 `/api/solar-systems` 或 `/api/solar-systems/[id]` 获取官方星系信息
2. 用 `/api/nodes?solarSystem={id}` 获取该星系节点
3. 在前端聚合节点统计或渲染详情

已移除的旧入口：

- `POST /api/solar-systems/sync`
- `GET /api/solar-systems/names`

---

## 相关文档

- [PRD - 核心功能模块 4.1](../PRD.md#41-星系赏金热力图与比赛发布galaxy-bounty-heatmap)
- [SPEC - Node API 接口规范](../SPEC.md)
- [架构文档 - Node Scanner Worker](../architecture.md)
- [Solar Systems API 文档](./SOLAR-SYSTEMS-API.md)
- [EVE Frontier 合约模块说明](../PRD.md#0-eve-frontier-链上合约模块说明)
