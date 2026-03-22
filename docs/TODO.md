# TODO: Fuel Frog Panic Implementation Backlog

Version: v1.0
Last Updated: 2026-03-21
Source Docs: `docs/PRD.md`, `docs/architecture.md`, `docs/SPEC.md`

## Usage Rules

- 一级分类：按功能分类（F-000 ~ F-006）
- 二级分类：按架构层分类（View / Controller / Service / Model / Data / Contract / QA）
- 任务状态：
  - `[ ]` Todo
  - `[~]` In Progress
  - `[x]` Done
- 依赖规则：标注 `depends on: T-xxx`

---

## F-000 钱包连接与身份（PRD 4.0）

### View Layer

- [x] **T-0001** 实现钱包连接引导页与未连接限制态（浏览可用、操作受限）
- [x] **T-0002** 实现右上角钱包状态栏（地址缩写、余额、断开）

### Controller Layer

- [x] **T-0003** 新增 `useAuthController`：`connect / disconnect / refreshBalance`
- [x] **T-0004** 将钱包错误码映射为可展示文案（余额不足、签名拒绝、网络错误）

### Service Layer

- [x] **T-0005** 实现 `walletService.connectWallet()`
- [x] **T-0006** 实现 `walletService.signTransaction()` 与交易签名失败重试策略
- [x] **T-0007** 实现 `walletService.getBalance()` 周期刷新

### Model Layer

- [x] **T-0008** 实现 `authStore`（walletAddress/luxBalance/isConnected）
- [x] **T-0009** 实现 `selectWalletShort` 与连接状态 selector

### QA

- [x] **T-0010** 验证未连接状态下禁止 Join/Pay/Settlement 行为

---

## F-007 钱包真实接入修复（Wallet Standard）

### Research / Architecture

- [x] **T-0100** 对照 `docs/eve_bootcamp.md` 与 Sui dApp Kit 文档，确认 Wallet Standard 集成方案

### View / App Integration

- [x] **T-0101** 引入 `DAppKitProvider`（Next.js Client Wrapper）并完成全局接入

### Controller / Service

- [x] **T-0102** 移除 `walletService` 随机地址/随机签名 fallback，改为 Wallet Standard 真连接
- [x] **T-0103** 实现钱包身份挑战签名（`signPersonalMessage`）与签名校验
- [x] **T-0104** 在 `useAuthController` 中对齐钱包自动连接状态（account 变化同步 authStore）
- [x] **T-0107** 将 `pay-entry` 改为真实链上交易执行：前端发起 `signAndExecuteTransaction` 并回填 tx digest

### Env / QA

- [x] **T-0105** 增补钱包接入环境变量与说明（network/rpc/coin）
- [x] **T-0106** 执行 `pnpm typecheck` 与 `pnpm lint:imports` 验证改造结果
- [x] **T-0108** 新增 `NEXT_PUBLIC_ENTRY_PAYMENT_RECIPIENT` 并验证支付链路使用真实 digest

---

## F-001 任务发现与比赛大厅（PRD 4.1）

### View Layer

- [x] **T-0011** 实现 `HeatmapScreen`（左图右表双栏联动）
- [x] **T-0012** 实现 `MatchCard` 字段渲染：奖池、入场费、倒计时
- [x] **T-0013** 实现并强制展示战队参数：`minTeams/maxTeams/当前报名数/开赛门槛摘要`
- [x] **T-0014** 实现站点详情弹窗并同步显示同源战队参数（与卡片一致）

### Controller Layer

- [x] **T-0015** 实现 `useMissionController.loadMissions(filters)`
- [x] **T-0016** 实现任务筛选/排序（按奖池 x 紧急度）与选中任务联动

### Service Layer

- [x] **T-0017** 实现 `missionService.fetchMissions()` 对接 Supabase
- [x] **T-0018** 实现 mission Realtime 订阅（比赛状态变化/奖池变化）

### Model Layer

- [x] **T-0019** 实现 `missionStore`（missions/loading/selectedMission）
- [x] **T-0020** 扩展 Mission 类型：`minTeams/maxTeams/entryFee/prizePool`

### Data Layer

- [x] **T-0021** 建立 `missions` 表与索引（含 `min_teams/max_teams` 字段）
- [x] **T-0022** 配置 `missions` 的只读 RLS（公开可读）

### Edge / Backend

- [x] **T-0023** 实现 `node-scanner`（5s 轮询 NetworkNode）
- [x] **T-0024** 自动创建紧急任务时写入可配置战队上限（非固定 4）

### QA

- [x] **T-0025** 验证任务卡与详情弹窗中的战队参数一致性

---

## F-002 组队、角色锁定与入场支付（PRD 4.2 / 6）

### View Layer

- [x] **T-0026** 实现 `LobbyScreen`（队伍列表、角色槽、锁定按钮）
- [x] **T-0027** 在组队页顶持续显示战队规模与开赛门槛摘要
- [x] **T-0028** 实现 `Join & Pay` 按钮置灰逻辑与未达标提示
- [x] **T-0028A** 收口 `/planning` 页面为纯组队流程：移除任务地图、奖池预览和房间调试入口，仅保留创建战队、查看招募战队、选择角色、锁队与支付
- [x] **T-0028B** 将组队页顶部的比赛门槛信息压缩为轻量状态条，保留持续展示但移除独立大卡片
- [x] **T-0028C** 按 PRD 重排 `/planning`：突出“已有战队卡片 + 创建战队按钮”，并保证加入/锁队/支付均可在战队卡片上下文完成
- [x] **T-0100** 将 `/planning` 顶部比赛门槛摘要升级为可视化进度条，突出 `registered/paid` 进度与开赛门槛
- [x] **T-0101** 继续优化 `/planning` 顶部比赛信息 UI，弱化原始数字句子感，改成更图形化的门槛面板与状态提示

### Controller Layer

- [x] **T-0029** 实现 `useLobbyController.createTeam/joinTeam/lockTeam`
- [x] **T-0030** 实现 `useLobbyController.payEntry` 编排（余额校验 -> 签名 -> 后端提交）

### Service Layer

- [x] **T-0031** 实现 `lobbyService.createTeam/joinTeam/lockTeam`
- [x] **T-0032** 实现 `lobbyService.payEntry()`（提交 txDigest + memberAddresses）
- [x] **T-0033** 实现 Lobby Realtime 订阅（teams/team_members/match 状态）

### Model Layer

- [x] **T-0034** 实现 `lobbyStore`（match/teams/members/myTeamId）
- [x] **T-0035** 实现 `selectTeamSlots/selectIsTeamReady/selectMyRole`

### Data Layer

- [x] **T-0036** 建立 `matches/teams/team_members/match_whitelist/match_targets` 表
- [x] **T-0037** 建立唯一约束：同队钱包唯一、白名单复合主键唯一

### Contract Layer

- [x] **T-0038** 实现 `register_whitelist` 接口调用链（后端到合约）

### Edge / Backend

- [x] **T-0039** 实现 `create-team` Edge Function
- [x] **T-0040** 实现 `join-team` Edge Function
- [x] **T-0041** 实现 `lock-team` Edge Function
- [x] **T-0042** 实现 `pay-entry` Edge Function（验证付款 tx + 写白名单 + 更新队状态）

### QA

- [x] **T-0043** 验证队长付费后，成员地址全部进入白名单

---

## F-003 链上归因计分（PRD 5 / 7）

### View Layer

- [x] **T-0044** 实现实时分数板与个人贡献展示
- [x] **T-0045** 实现弹幕区（score_events 驱动）

### Controller Layer

- [x] **T-0046** 实现 `useMatchController` 的 score stream 绑定与解绑

### Service Layer

- [x] **T-0047** 实现 `matchService.subscribeMatchStream()`
- [x] **T-0048** 实现 `scoringService` 客户端投影逻辑（仅展示，不改业务真值）

### Model Layer

- [x] **T-0049** 实现 `scoreStore`（scoreBoard/eventFeed）
- [x] **T-0050** 实现 `selectLiveScore/selectRecentEvents/selectMyScore`

### Data Layer

- [x] **T-0051** 建立 `score_events` 表与唯一键 `UNIQUE(match_id, tx_digest)`
- [x] **T-0052** 建立 `audit_logs` 表用于过滤拒绝记录

### Edge / Backend

- [x] **T-0053** 实现 `chain-sync`（2s 轮询 FuelEvent）
- [x] **T-0054** 实现三重过滤：白名单/站点/时间窗口
- [x] **T-0055** 实现得分公式：`fuel_delta * urgency_weight * panic_multiplier`
- [x] **T-0056** 实现过滤拒绝审计日志（reason code）

### QA

- [x] **T-0057** 验证非白名单事件不计分
- [x] **T-0058** 验证窗口外事件不计分
- [x] **T-0059** 验证重复 tx_digest 不重复记分

---

## F-004 比赛状态机与实时反馈（PRD 4.3）

### View Layer

- [x] **T-0060** 实现倒计时与状态标签（Lobby/PreStart/Running/Panic/Settling/Settled）
- [x] **T-0061** 实现 Panic 模式视觉强化（边框脉冲、横幅、颜色切换）
- [x] **T-0062** 实现 Optimistic UI 虚线预更新与回退
- [x] **T-0099** 修复 `/match` 页面显示以对齐 PRD 4.3.2：收敛为“顶栏/得分板/站点状态栏/弹幕区”四区浮窗布局，移除调试导向的大块控制面板

### Controller Layer

- [x] **T-0063** 编排 match 状态变更到 UI 过渡动画

### Service Layer

- [x] **T-0064** 实现 match Realtime 订阅（matches 更新 + panic broadcast）

### Model Layer

- [x] **T-0065** 实现 `matchStore`（status/remainingSec/isPanic）

### Contract Layer

- [x] **T-0066** 实现/对接 `start_match()` 上链调用

### Edge / Backend

- [x] **T-0067** 实现 `match-tick`（1s）：驱动状态机
- [x] **T-0068** 在剩余 90 秒时广播 `panic_mode`
- [x] **T-0069** 状态非法迁移写审计日志并阻断

### QA

- [x] **T-0070** 验证状态迁移路径与 PRD 一致
- [x] **T-0071** 验证 Panic 在最后 90 秒准确触发

---

## F-005 结算与分账（PRD 4.4）

### View Layer

- [x] **T-0072** 实现 `SettlementScreen`（总奖池、队伍分配、个人分配、MVP）
- [x] **T-0073** 实现出口按钮：链上记录 / 分享战报 / 再来一局

### Controller Layer

- [x] **T-0074** 实现 `useSettlementController.loadBill(matchId)`

### Service Layer

- [x] **T-0075** 实现 `settlementService.fetchSettlementBill()`

### Model Layer

- [x] **T-0076** 实现 `settlementStore`（bill/loading）与 `selectMyPayout`

### Data Layer

- [x] **T-0077** 建立 `settlements` 表，约束 `UNIQUE(match_id)`（幂等）

### Contract Layer

- [x] **T-0078** 实现/对接 `end_match_and_settle()` 上链发奖

### Edge / Backend

- [x] **T-0079** 实现 `trigger-settlement`：排名计算 + 两层分配 + 链上提交
- [x] **T-0080** 实现 `get-settlement-bill`：返回 `SettlementBillDTO`
- [x] **T-0081** 幂等控制：重复结算请求返回同一结果，不重复出账

### QA

- [x] **T-0082** 验证 1/2/3/≥4 队分配比例符合 PRD
- [x] **T-0083** 验证个人分配按贡献比分配，0 分成员奖励为 0

---

## F-006 防作弊与可观测性（PRD 7.4）

### Service / Edge Layer

- [x] **T-0084** 为 filter rejection 定义 reason code 枚举
- [x] **T-0085** 为结算失败定义错误分类与告警分级
- [x] **T-0086** 输出关键指标：event lag / ws latency / settlement success

### Data Layer

- [x] **T-0087** 为 `audit_logs` 增加查询索引（`match_id`, `event_type`, `created_at`）

### QA

- [x] **T-0088** 演练异常链路：RPC 超时、重复结算、非法状态迁移

---

## Cross-Feature Infrastructure

### Architecture Governance

- [x] **T-0089** 建立 import lint 规则，确保 `View -> Controller -> Service -> Model` 单向依赖
- [x] **T-0090** 禁止 View 直接调用 Supabase Client

### Environment & Deployment

- [x] **T-0091** 配置环境变量：`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUI_RPC_URL`
- [x] **T-0092** 配置 Edge Functions secrets（service role、private keys）
- [x] **T-0093** 编写部署检查清单（Vercel + Supabase）

---

## Testing Milestones

### M1: 主链路可跑通

- [x] **T-0094** 集成回归：`Lobby -> Lock -> Pay -> Running -> Settled`

### M2: 合约与 devnet 验证

- [x] **T-0095** 执行 `sui move test`
- [x] **T-0096** 执行 devnet `publish/call/query-events` 并记录结果

### M3: 发布前验收

- [x] **T-0097** 验证 UI 强制条款：比赛卡片/详情/组队页战队参数一致展示
- [x] **T-0098** 验证结算账单可追溯到链上 tx（commitment/settlement）

---

## Suggested Critical Path

1. T-001, T-002, T-003, T-0021, T-0036, T-0051, T-0077
2. T-0038, T-0042, T-0053, T-0067, T-0079
3. T-0011, T-0026, T-0044, T-0072
4. T-0094, T-0095, T-0096, T-0097, T-0098
