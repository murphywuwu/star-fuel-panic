import type { UrgencyLevel } from "./mission.ts";

/**
 * NetworkNode 类型定义
 * 对应链上 world::network_node::NetworkNode 结构
 */
export type NetworkNode = {
  // === 基础标识 ===
  id: string;                      // 链上对象 ID
  objectId: string;                // 同 id（兼容字段）
  name: string;                    // 站点名称（从 metadata.name 或 display 读取）
  typeId: number;                  // 站点类型 ID（区分 SSU/Gate/Turret）

  // === 所有权信息 ===
  ownerAddress: string;            // 所有者地址（AddressOwner/ObjectOwner/Shared）
  ownerCapId: string | null;       // 关联的 OwnerCap<NetworkNode> ID
  isPublic: boolean;               // 是否为共享对象（Shared Object）

  // === 位置信息 ===
  coordX: number;                  // X 坐标（从 LocationRevealedEvent 读取）
  coordY: number;                  // Y 坐标
  coordZ: number;                  // Z 坐标（新增）
  solarSystem: number;             // 星系 ID（新增）

  // === 燃料数据（核心） ===
  fuelQuantity: number;            // 当前油量（world::fuel::Fuel.quantity）
  fuelMaxCapacity: number;         // 最大容量（world::fuel::Fuel.max_capacity）
  fuelTypeId: number | null;       // 燃料类型 ID（Option<u64>）
  fuelBurnRate: number;            // 燃料消耗速率（ms）
  isBurning: boolean;              // 是否正在燃烧
  fillRatio: number;               // 填充率（计算字段：quantity / max_capacity）
  urgency: UrgencyLevel;           // 紧急度（计算字段：< 0.2 critical, < 0.5 warning, else safe）

  // === 能量数据 ===
  maxEnergyProduction: number;     // 最大能量产出（world::energy::EnergySource.max_production）
  currentEnergyProduction: number; // 当前能量产出

  // === 状态信息 ===
  isOnline: boolean;               // 是否在线（world::status::AssemblyStatus.is_online）
  connectedAssemblyIds: string[];  // 连接的设施 ID 列表（Gate/Turret/SSU）

  // === 平台扩展字段 ===
  activeMatchId: string | null;    // 当前关联的比赛 ID（平台数据）

  // === 元数据 ===
  description: string | null;      // 描述（metadata.description）
  imageUrl: string | null;         // 图标 URL（metadata.url）

  // === 时间戳 ===
  lastUpdatedOnChain: string;      // 链上最后更新时间（从链上事件或对象版本推导）
  updatedAt: string;               // 本地缓存更新时间
};

/**
 * 节点过滤器
 */
export type NodeFilters = {
  urgency?: UrgencyLevel;          // 按紧急度过滤
  hasMatch?: boolean;              // 是否有关联比赛
  isOnline?: boolean;              // 是否在线（新增）
  typeId?: number;                 // 按站点类型过滤（新增）
  solarSystem?: number;            // 按星系筛选（PRD 4.1.7）
  limit?: number;                  // 返回数量限制
};

export type NodeRecommendation = {
  node: NetworkNode;
  distanceHops: number;
  urgencyWeight: number;
  score: number;
  reason: string;
};
