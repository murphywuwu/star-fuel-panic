# Fuel Frog Panic

Fuel Frog Panic 是一个构建在 EVE Frontier 与 Sui 之上的链上竞技任务平台。项目把“给关键设施送燃料”这类原本低反馈的后勤动作，重构为带有实时计分、LUX 奖池、队伍协作、游戏内浮窗反馈的短时竞技比赛。

当前仓库基线以以下文档为准：

- `docs/PRD.md` v2.6
- `docs/architecture.md` v6.0
- `docs/SPEC.md` v6.0
- `docs/test-plan.md` v1.2

## 1. 当前产品范围

当前版本聚焦 Fuel Frog Panic 主玩法闭环：

1. 钱包连接与身份建立
2. Lobby 发现比赛、设置位置、查看推荐星系与节点
3. 创建比赛草稿并发布
4. 创建战队、申请加入、审批、锁队、支付报名费
5. 比赛运行期实时记分、状态流转、Panic Mode
6. 自动结算、账单生成、队伍与个人奖金分配

### 当前规则基线

- 公开比赛模式只有两种：`free` 和 `precision`
- 创建比赛时 `solarSystemId` 必填
- `sponsorshipFee >= 500 LUX`
- `precision` 模式必须冻结 1 到 5 个 `targetNodeIds`
- 奖池公式：`grossPool = sponsorshipFee + entryFeeTotal + platformSubsidy`
- 文档基线的平台抽成是 `5%`，剩余 `95%` 进入玩家奖池
- 计分唯一可信源是链上 `FuelEvent(DEPOSITED)` 事件
- Panic Mode 为比赛最后 90 秒，倍率 `1.5x`

### 这个项目解决什么问题

在 EVE Frontier 中，星门、SSU、炮塔等设施高度依赖燃料。传统送油体验的问题是：

- 后勤动作反馈弱，成就感低
- 收益分配不透明
- 协作目标不清晰，不知道该救哪个点
- 高风险运输缺少即时认可

Fuel Frog Panic 用“可发现的任务 + 限时竞赛 + 可见奖池 + 实时榜单 + 自动分账”把后勤行为变成可参与、可观赛、可结算的竞技任务。

## 2. 技术栈

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS
- State: Zustand
- Wallet / Chain: Sui dApp Kit, Sui RPC, Sui Event Stream
- Backend shape: Next.js Route Handlers + domain runtimes/workers
- Data / Projection: Supabase / PostgreSQL / Realtime
- Contract: Sui Move
- 3D / Scene: `three`, `@react-three/fiber`, `@react-three/drei`

## 3. 架构基线

### 前端强制分层

本仓库必须遵守：

```text
View -> Controller -> Service -> Model
```

约束如下：

- View 只能访问 Controller
- Controller 只能访问 Service
- Service 只能访问 Model
- Model 只能由 Zustand store 承担
- View 不允许直接读写 store，也不允许直接请求 BFF / Route Handler

这条约束由以下命令做静态校验：

```bash
pnpm verify:arch
```

等价于：

```bash
pnpm build
node ./scripts/check-layer-imports.mjs
```

### 运行时职责分层

核心后端运行时如下：

- `solarSystemRuntime`: 星系、星座、gate links、搜索基础数据
- `constellationRuntime`: 星座聚合与推荐
- `nodeRuntime`: `NetworkNode` 读模型、燃料比例、紧急度
- `nodeRecommendationRuntime`: 基于位置与拓扑的推荐节点
- `matchRuntime`: 草稿创建、发布、比赛列表、状态机
- `teamRuntime`: 战队、申请审批、锁队、支付、白名单快照
- `chainSyncEngine`: 监听链上 `FuelEvent`、去重、记分、广播
- `settlementRuntime`: 冻结分数、结算、生成账单、执行发奖

### 链上与链下边界

- 链上事实：燃料状态、计分事件、支付/发布/结算相关交易结果
- 链下投影：大厅列表、推荐结果、实时榜单快照、结算账单读模型
- 兼容层仍然存在：旧命名 `mission`、`nodes` 可以作为历史接口保留，但新设计统一采用 `match`、`network-node`、`solar-system`

## 4. 仓库结构

```text
.
├─ contracts/                 # Sui Move 合约包
│  └─ sources/fuel_frog_panic.move
├─ docs/                      # PRD / architecture / SPEC / TODO / test plan / devnet 记录
├─ public/                    # 静态资源
├─ scripts/                   # 校验、QA、devnet 验证、辅助脚本
├─ src/
│  ├─ app/                    # Next.js App Router 页面与 API Route Handlers
│  ├─ controller/             # 页面/组件编排控制器
│  ├─ model/                  # Zustand stores
│  ├─ server/                 # runtime / projection / API contract / tests
│  ├─ service/                # 前端业务服务与 API / stream 适配层
│  ├─ types/                  # 共享类型
│  └─ view/                   # screens / components / view utils
├─ supabase/                  # migration 与 edge function 相关内容
└─ workers/                   # 独立 runtime worker 入口
```

### 当前页面入口

- `/`: 钱包连接与进入大厅前置页
- `/lobby`: 比赛发现主入口，包含位置选择与创建比赛 modal
- `/planning`: 组队、审批、锁队、支付，也保留创建比赛 fallback 入口
- `/match`: 比赛进行中视图与浮窗共享运行时
- `/settlement`: 结算等待页与结算账单页
- `/nodes-map`: 精准模式选点视图或兼容入口

### 当前 API 分组

- Discovery:
  - `GET /api/constellations`
  - `GET /api/search`
  - `GET /api/solar-systems`
  - `GET /api/solar-systems/recommendations`
- Nodes:
  - `GET /api/network-nodes`
  - `GET /api/network-nodes/recommendations`
- Matches:
  - `GET /api/matches`
  - `GET /api/matches/{id}`
  - `POST /api/matches`
  - `POST /api/matches/{id}/publish`
  - `GET /api/matches/{id}/teams`
  - `GET /api/matches/{id}/status`
  - `GET /api/matches/{id}/scoreboard`
  - `GET /api/matches/{id}/stream`
- Teams:
  - `POST /api/teams`
  - `POST /api/teams/{id}/join`
  - `POST /api/teams/{id}/applications/{applicationId}/approve`
  - `POST /api/teams/{id}/applications/{applicationId}/reject`
  - `POST /api/teams/{id}/leave`
  - `POST /api/teams/{id}/lock`
  - `POST /api/teams/{id}/pay`
- Settlement:
  - `GET /api/matches/{id}/result`
  - `GET /api/matches/{id}/settlement`
- Runtime Ops:
  - `GET /api/runtime/health`

兼容接口仍在仓库中可见，例如：

- `GET /api/missions`
- `GET /api/nodes`

## 5. 本地启动

### 依赖

- `pnpm`
- 可选：`sui` CLI 与 `jq`，用于 Move/devnet 校验

### 1) 安装依赖

```bash
pnpm install
```

### 2) 准备环境变量

```bash
cp .env.example .env
```

至少需要检查以下变量：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUI_NETWORK`
- `NEXT_PUBLIC_SUI_RPC_URL`
- `NEXT_PUBLIC_LUX_COIN_TYPE`
- `NEXT_PUBLIC_ENTRY_PAYMENT_RECIPIENT`
- `SUI_RPC_URL`
- `EVE_FRONTIER_WORLD_API_BASE_URL`

运行时调优变量：

- `NODE_INDEXER_INTERVAL_MS`
- `NODE_INDEXER_MAX_EVENT_PAGES`
- `SETTLEMENT_PLATFORM_FEE_BPS`
- `DEFAULT_MAX_TEAMS`
- `FORCE_START_SEC`

说明：

- 文档基线的平台费率是 `5%`，即 `500 bps`
- 实际运行时以 `SETTLEMENT_PLATFORM_FEE_BPS` 为准
- 本地配置时请确保环境变量与 PRD/SPEC 业务口径保持一致

### 3) 启动前端

```bash
pnpm dev
```

默认端口：

```text
http://localhost:3010
```

### 4) 按需启动 worker

完整体验读模型刷新、链上监听、结算与运行时状态时，可在独立终端按需启动：

```bash
pnpm worker:node-runtime
pnpm worker:constellation-runtime
pnpm worker:match-runtime
pnpm worker:chain-sync
pnpm worker:settlement-runtime
pnpm worker:supervisor
```

补充命令：

```bash
pnpm index:nodes:once
pnpm index:nodes
```

## 6. 常用命令

### 开发与构建

```bash
pnpm dev
pnpm build
pnpm start
pnpm typecheck
pnpm lint
pnpm lint:imports
pnpm verify
```

### 测试与 QA

```bash
pnpm test
pnpm test:f007
pnpm qa:all
pnpm qa:state-machine
pnpm qa:settlement
pnpm qa:whitelist
pnpm qa:ui-rules
pnpm qa:integration
pnpm qa:settlement-trace
```

### 合约与 devnet 验证

```bash
pnpm verify:contract:devnet
```

该命令会执行：

- `sui move test`
- `sui client test-publish`
- `sui client call ... create_room`
- devnet RPC 事件查询

并把结果写入：

- `docs/devnet-verification-latest.md`

## 7. 当前质量基线

根据 `docs/test-plan.md` v1.2，当前测试计划状态为 `Passed`。当前仓库已经包含：

- Route-level F-007 流程回归
- 发现页与推荐链路测试
- 节点 runtime / indexer / solar system runtime 测试
- 架构导入边界静态校验
- QA 脚本覆盖状态机、结算规则、白名单、UI 规则一致性

如果你要在前端继续开发，交付前至少应执行：

```bash
pnpm build
node ./scripts/check-layer-imports.mjs
```

如果你要继续做链上/结算相关改动，建议额外执行：

```bash
pnpm verify:contract:devnet
```

## 8. 开发约定

- 新功能命名优先使用 `match`、`network-node`、`solar-system`
- 旧的 `mission`、`nodes` 命名只作为兼容层，不再扩散
- 新前端功能必须明确落在 `View + Controller + Service + Model` 某一层，不得跨层直连
- View 层应保持渲染职责，不在组件内堆积流程型状态机
- 计分、支付、结算等高信任事实必须以 Sui 链上对象与事件为准

## 9. 参考文档

- `docs/PRD.md`: 产品范围、玩法逻辑、奖池与结算业务规则
- `docs/architecture.md`: 系统边界、分层规则、运行时职责
- `docs/SPEC.md`: DTO、HTTP/SSE 契约、层间接口
- `docs/TODO.md`: 当前执行基线与落地任务
- `docs/test-plan.md`: 测试计划与当前验证结果
- `docs/sui-devnet-testing-standard.md`: Sui devnet 测试规范
- `docs/all_contracts.move.txt`: EVE Frontier 合约上下文参考
- `docs/devnet-verification-latest.md`: 最新 devnet 验证记录
