# TEST-TODO: Fuel Frog Panic 测试执行清单（对齐 v2.6 基线）

Version: v2.0
Last Updated: 2026-03-26
Source: `docs/PRD.md` v2.6, `docs/SPEC.md` v6.0, `docs/architecture.md` v6.0

---

## 0. 目标与范围

- 目标：将测试口径统一到 `free / precision` 模式、`match/network-node/solar-system` 命名、`create draft -> publish` 流程。
- 范围：覆盖 `View -> Controller -> Service -> Model` 分层、BFF Route + Runtime、链上事件归因、结算与可观测性。
- 不在本清单内：已废弃的“official/host 模式”命名、旧接口语义分叉（仅保留兼容性校验）。

---

## 1. 覆盖率目标（阶段性）

| 层级 | 目标覆盖率 | 状态 |
|---|---|---|
| Route + Runtime（API） | >= 85% | Pending |
| Service | >= 85% | Pending |
| Controller | >= 75% | Pending |
| Model（Zustand） | >= 80% | Pending |
| View | >= 60% | Pending |
| Integration | 主链路全覆盖 | Pending |
| E2E | 关键用户路径全覆盖 | Pending |

---

## 2. API / Route Contract Tests（SPEC §4）

### 2.1 Discovery APIs

- [ ] **API-001** `GET /api/constellations`
  - 校验分页、排序、筛选参数生效
  - 返回 `ApiResult<{ items, nextOffset }>`
- [ ] **API-002** `GET /api/constellations/{constellationId}`
  - 返回 `constellation + systems`
  - 不存在返回 `NOT_FOUND`
- [ ] **API-003** `GET /api/search`
  - 校验 `q` 最小长度与 `type` 过滤
  - 结果项符合 `SearchHit` 结构
- [ ] **API-004** `GET /api/solar-systems/recommendations`
  - 返回推荐星系列表，字段符合 `SolarSystemRecommendation`
- [ ] **API-005** `GET /api/solar-systems`
  - 校验 `constellationId/q/limit/offset`
  - 返回 `nextOffset` 语义正确
- [ ] **API-006** `GET /api/solar-systems/{systemId}`
  - 返回 `system + nodes`
  - `gateLinks` 存在并可用于跳数计算
- [ ] **API-007** `GET /api/network-nodes?solarSystem={id}`
  - 返回字段口径对齐 PRD 0.6（`fillRatio/urgency/isPublic/isOnline/activeMatchId`）
- [ ] **API-008** `GET /api/network-nodes/recommendations`
  - 仅自由模式可用推荐
  - 校验 `currentSystem/maxJumps/urgency/limit/targetMatchId`

### 2.2 Match APIs

- [ ] **API-020** `GET /api/matches`
  - 公开列表不返回 `draft/cancelled`
  - 存在 `currentSystemId` 时返回 `distanceHops`
- [ ] **API-021** `GET /api/matches/{matchId}`
  - 返回 `MatchDetail` 全字段
- [ ] **API-022** `POST /api/matches`（create draft）
  - 必须 `X-Idempotency-Key`
  - 校验：`sponsorshipFee>=500`、`2<=maxTeams<=16`、`0<=entryFee<=1000`、`1<=durationHours<=72`
  - `precision` 模式校验 `targetNodeIds` 为 1-5
  - 成功返回 `status='draft'`
- [ ] **API-023** `POST /api/matches/{id}/publish`
  - 必须 `X-Idempotency-Key`
  - 校验 `publishTxDigest` 金额等于 `sponsorshipFee`
  - 仅允许 `draft -> lobby`
  - `precision` 目标节点必须属于目标星系
- [ ] **API-024** `GET /api/matches/{id}/status`
  - 返回 `MatchStatusSnapshot`，倒计时/阶段字段正确
- [ ] **API-025** `GET /api/matches/{id}/scoreboard`
  - 返回 `ScoreboardSnapshot`，排名与分数一致
- [ ] **API-026** `WS /api/matches/{id}/stream`
  - 至少覆盖 `score_update/phase_change/panic_mode/settlement_start`
  - 事件顺序与状态机一致

### 2.3 Team APIs

- [ ] **API-040** `GET /api/matches/{id}/teams`
  - 返回 `TeamDetail[]`，含申请与成员槽位信息
- [ ] **API-041** `POST /api/teams`
  - 必须 `X-Idempotency-Key`
  - 校验 `3<=maxMembers<=8` 且 `roleSlots` 总和等于 `maxMembers`
  - 比赛必须为 `lobby`
- [ ] **API-042** `POST /api/teams/{id}/join`
  - 生成 `pending` 申请，不立即占用成员槽位
  - 相同地址同队仅允许 1 条 `pending`
- [ ] **API-043** `POST /api/teams/{id}/applications/{applicationId}/approve`
  - 仅队长可调用；仅 `pending` 可批准
  - 批准后占用角色槽位
- [ ] **API-044** `POST /api/teams/{id}/applications/{applicationId}/reject`
  - 仅队长可调用；拒绝后不占用槽位
- [ ] **API-045** `POST /api/teams/{id}/leave`
  - 锁队/已付费不可离队
  - 队长离队默认返回 `CONFLICT`
- [ ] **API-046** `POST /api/teams/{id}/lock`
  - 仅队长、且成员数等于 `maxMembers`
  - 锁队后拒绝新增申请与离队
- [ ] **API-047** `POST /api/teams/{id}/pay`
  - 必须 `X-Idempotency-Key`
  - `payTxDigest` 金额 = `entryFee * memberCount`
  - 成功后写入白名单快照

### 2.4 Settlement APIs

- [ ] **API-060** `GET /api/matches/{id}/result`
  - 返回 `SettlementBill`
  - 校验 `grossPool/platformFee/payoutPool/teamPayouts/playerPayouts`
- [ ] **API-061** `GET /api/matches/{id}/settlement`
  - 返回结算状态机快照（处理中/完成/失败）

### 2.5 Legacy Alias Compatibility

- [ ] **API-080** `/api/nodes` 与 `/api/network-nodes` 响应同构
- [ ] **API-081** `/api/missions` 与 `/api/matches` 响应同构
- [ ] **API-082** 新代码路径不再依赖旧别名（静态扫描 + 运行验证）

---

## 3. Runtime Contract Tests（SPEC §5 + Architecture §5/§7）

### 3.1 `solarSystemRuntime` + `constellationRuntime`

- [ ] **RT-001** world API 失败时回退缓存并返回 `stale=true`
- [ ] **RT-002** selectable 规则正确：`isOnline && isPublic` 至少一个节点
- [ ] **RT-003** 推荐星系排序：紧急优先、可选系统数次之

### 3.2 `nodeRuntime` + `nodeRecommendationRuntime`

- [ ] **RT-010** 节点投影 5 秒刷新窗口内更新
- [ ] **RT-011** `activeMatchId` 仅作展示投影，不作为唯一占用约束
- [ ] **RT-012** 推荐结果按运行时计算输出，前端不复算

### 3.3 `matchRuntime`

- [ ] **RT-020** `draft -> lobby` 仅 publish 可达
- [ ] **RT-021** 开赛触发：满员即刻开赛 / 最低人数公开倒计时
- [ ] **RT-022** `running -> panic` 在最后 90 秒触发
- [ ] **RT-023** 状态迁移 CAS 防重推进

### 3.4 `teamRuntime`

- [ ] **RT-030** `join` 为申请流（pending/approve/reject）一致性
- [ ] **RT-031** 锁队后成员冻结
- [ ] **RT-032** 支付成功后白名单快照完整写入

### 3.5 `chainSyncEngine`

- [ ] **RT-040** 事件去重键：`txDigest + eventSeq`
- [ ] **RT-041** 三重过滤：白名单、节点范围、时间窗口
- [ ] **RT-042** 计分公式：`fuelAdded * urgencyWeight * panicMultiplier`
- [ ] **RT-043** 权重使用注入时刻 `fillRatio`，防止刷分

### 3.6 `settlementRuntime`

- [ ] **RT-050** 单飞锁：每场比赛最多一次有效结算
- [ ] **RT-051** 抽成固定 `platformFeeRate = 0.05`
- [ ] **RT-052** 队伍分配比例：2 队 `[0.7,0.3]`；3+ 队 `[0.6,0.3,0.1]`
- [ ] **RT-053** 个人奖金按个人得分占比分配
- [ ] **RT-054** 链上发奖成功后才允许 `settled`

---

## 4. Frontend Layer Tests（Architecture §4）

### 4.1 Controller Layer

- [ ] **CTL-001** `useCreateMatchController`：草稿创建 + 发布编排
- [ ] **CTL-002** `useLobbyController`：列表筛选、详情预览、分页
- [ ] **CTL-003** `useLocationController`：位置设置与推荐触发
- [ ] **CTL-004** `useTeamLobbyController`：申请、审批、锁队、付费流程
- [ ] **CTL-005** `useMatchRuntimeController`：状态/分数/流事件同步
- [ ] **CTL-006** `useSettlementController`：账单拉取与结算态展示
- [ ] **CTL-007** `useAuthController`：钱包接入态与清理逻辑

### 4.2 Service Layer

- [ ] **SVC-001** 所有写接口均携带 `X-Idempotency-Key`
- [ ] **SVC-002** `matchService` 不暴露已废弃命名作为新入口
- [ ] **SVC-003** `nodeRecommendationService` 仅消费后端推荐结果
- [ ] **SVC-004** `matchStreamService` 处理断流重连与健康态
- [ ] **SVC-005** `settlementService` 结果只读，不做本地再分账

### 4.3 Model Layer（Zustand）

- [ ] **MDL-001** `createMatchStore`：草稿字段与校验错误状态
- [ ] **MDL-002** `lobbyStore`：列表、筛选、分页、选中态
- [ ] **MDL-003** `locationStore`：当前位置持久化与恢复
- [ ] **MDL-004** `teamLobbyStore`：申请流、锁队、支付状态
- [ ] **MDL-005** `matchRuntimeStore`：阶段、倒计时、得分板、流健康度
- [ ] **MDL-006** `settlementStore`：结算状态、账单、MVP

### 4.4 View Layer

- [ ] **VW-001** `/lobby`：模式标签、距离提示、详情入口
- [ ] **VW-002** `/planning`：创建比赛（free/precision）与节点选点 UI
- [ ] **VW-003** `/match`：Panic 横幅、得分板、目标节点面板
- [ ] **VW-004** `/settlement`：队伍分账、个人分账、MVP 展示
- [ ] **VW-005** `/nodes-map` 仅作为精准模式内部选点视图（非默认发现入口）

### 4.5 分层约束测试

- [ ] **ARC-001** View 不直接访问 BFF / store 写操作
- [ ] **ARC-002** Controller 不直接请求数据库、不直接操作 store
- [ ] **ARC-003** Service 负责 BFF/流订阅并通过 actions 写 store
- [ ] **ARC-004** Model 不含网络请求与 DOM 依赖

---

## 5. Integration Tests（关键业务流）

- [ ] **INT-001** 创建草稿 -> 发布比赛 -> Lobby 可见
- [ ] **INT-002** Lobby 设置位置 -> 获取推荐节点 -> 进入组队大厅
- [ ] **INT-003** 申请入队 -> 队长审批 -> 锁队 -> 付费 -> 白名单完成
- [ ] **INT-004** 开赛条件满足 -> prestart -> running -> panic -> settling -> settled
- [ ] **INT-005** 链上 FuelEvent -> 三重过滤 -> 计分 -> 流推送 -> 前端更新
- [ ] **INT-006** 结算完成 -> 账单查询 -> 结果页展示一致
- [ ] **INT-007** 精准模式仅目标节点计分；自由模式目标星系内节点计分

---

## 6. E2E Tests（用户视角）

- [ ] **E2E-001** 钱包接入 -> Lobby 浏览 -> 创建比赛并发布 -> 进入等待
- [ ] **E2E-002** 玩家组队完整链路（申请/审批/锁队/支付）
- [ ] **E2E-003** 比赛运行链路（实时分数 + Panic + 结算落账）
- [ ] **E2E-004** 异常链路（链路超时、流中断、重试与提示）

---

## 7. 错误、幂等、重试、可观测性专项（SPEC §6 + Architecture §8/§9）

- [ ] **OBS-001** 所有响应包含 `requestId`
- [ ] **OBS-002** 写接口缺失 `X-Idempotency-Key` 时返回规范错误
- [ ] **OBS-003** 不可重试错误：`INVALID_INPUT/FORBIDDEN/SYSTEM_NOT_SELECTABLE`
- [ ] **OBS-004** 可重试错误：`CHAIN_SYNC_ERROR/STREAM_UNAVAILABLE/timeout`
- [ ] **OBS-005** `CONFLICT` 返回后客户端先刷新状态再重试
- [ ] **OBS-006** 结构化日志字段齐全：`requestId/runtime/matchId/teamId/walletAddress/txDigest/errorCode`
- [ ] **OBS-007** 指标门槛：
  - `score_delivery_latency_ms < 1000`
  - `danmaku_latency_ms < 500`
  - `node_snapshot_age_seconds <= 5`
  - `match_publish_latency_ms < 3000`（不含签名等待）
  - `settlement_duration_seconds` 在 10-30s

---

## 8. 执行命令建议

```bash
# 基础质量
pnpm typecheck
pnpm lint

# 测试（按仓库脚本为准）
pnpm test
pnpm test:coverage
pnpm test:integration
pnpm test:e2e

# 若涉及合约
cd contracts && sui move test
```

---

## 9. 维护规则

- 新增或变更接口契约时，必须同步更新本文件对应编号项。
- 每次测试批次结束后，勾选完成项并补充失败原因与回归结果。
- 若 PRD/SPEC/Architecture 版本升级，优先更新本文件顶部 Source 版本与差异项。

---

*文档结束 — TEST-TODO v2.0*
