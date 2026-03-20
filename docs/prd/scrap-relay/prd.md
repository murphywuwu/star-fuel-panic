# PRD: Scrap Relay

## 0. One-Screen Summary (Problem / Why / How)

- Problem it solves: 玩家想练习完整产业链协作，但常规流程过长不适合短局。
- Why this matters now: 角色分工不清，协作效率低。
- How it solves it (3-step mechanism):
  1. 队员按角色执行采集与运输。
  2. 组装流程按蓝图依赖推进。
  3. 首个完成舰体的队伍获胜并结算。
- Expected player/business outcome: 强分工且强协作，15 分钟内形成胜负。

## 0.1 Before vs After

| Dimension | Before | After |
|---|---|---|
| Player clarity | 角色分工不清，协作效率低。 | 强分工且强协作，15 分钟内形成胜负。 |
| Player outcome | 目标不清、协作效率受限 | 强分工且强协作，15 分钟内形成胜负。 |
| Business outcome | 复玩率与营收闭环不稳定 | 可验证的玩法闭环与结算闭环 |

## 1. Document Control

- Product Name: Scrap Relay
- Project/App Path: apps/scrap-relay
- Version: v1.0
- Status: Draft
- Owner (PM Agent): Codex
- Last Updated: 2026-03-20
- Related Docs:
  - SPEC: apps/scrap-relay/spec.md
  - TODO: apps/scrap-relay/todo.md
  - Test Plan: docs/test-plan/scrap-relay/test-plan.md

## 2. Background and Goal

- Problem Statement:
  - 需要将 Frontier 核心循环（生存、协作、竞争、经济）转化为可快速开局、可复玩、可结算的街机玩法。
  - 玩家想练习完整产业链协作，但常规流程过长不适合短局。
- Target Users:
  - Frontier 玩家（个人与小队）
  - 联盟组织者 / 社区活动发起者
- Product Goal:
  - 交付可在黑客松时限内演示并可继续迭代的玩法闭环。
- Non-Goals:
  - 不做超出黑客松窗口的大型内容系统（如完整赛季运营后台）。
- Strategic Fit (why now for this hackathon/project):
  - 将 Frontier 采-运-造主线压缩为高反馈协作玩法，评审可快速理解。

## 2.1 Why Players Need This Product

- 角色分工不清，协作效率低。
- 制造流程反馈慢，进度阻塞不透明。
- 团队贡献难量化。
- 用户愿意付费前提：可在短局里获得“可见收益 + 可见成长 + 可见协作成就”。

## 2.2 Player Segments and JTBD

| Segment | Context | Job-to-be-done | Current Friction |
|---|---|---|---|
| S-001 | 协作型团队 | 在短局内完成采运造接力 | 依赖链复杂、阻塞点不透明 |
| S-002 | 新成员训练 | 低成本理解产业链协作 | 训练周期长且复盘困难 |

## 2.3 Success Metrics and Guardrails

- North Star Metric: 平均完工进度 / 局
- Primary metrics:
  - M-001: 15 分钟内完工率 >= 60%
  - M-002: 角色分工覆盖率 >= 90%
- Guardrail metrics:
  - G-001: 越序组装拦截率 = 100%
  - G-002: 无效材料提交率 < 3%
- Measurement method (event/log/query source):
  - 链上事件 + 房间结算日志 + 索引查询（GraphQL/gRPC）联合校验。

## 3. Scope

### In Scope

- 单玩法房间创建、入场、对局、结算
- 与统一商业化模块对接（buy-in / 奖池 / rake）
- 关键结果上链与战报可查

### In Scope by Phase

| Phase | Timebox | Must-have |
|---|---|---|
| P0 | Hackathon 72h | 角色分工、蓝图依赖、完工结算 |
| P1 | Post-hackathon 2-4 weeks | 替代蓝图分支、团队训练报告 |

### Out of Scope

- 跨玩法资产深度互通经济系统
- 完整电竞观战回放平台
- 主网正式商业运营法务流程

## 3.1 Dependencies and Constraints

- Internal dependencies: Arcade Hub、Reputation
- External dependencies (API/network/team): 材料库读取、蓝图配置
- Critical assumptions: 材料与蓝图规则可标准化

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Value Hypothesis | Status |
|---|---|---|---|---|
| F-007 | Scrap Relay Core Gameplay | P0 | 清晰依赖链和角色贡献可提升团队协作效率并增强复盘价值。 | Planned |
| F-012 | Monetization Engine Integration | P0 | 统一收费与结算规则可降低运营复杂度 | Planned |
| F-013 | Live Frontier Integration | P0 | 实网可运行是评审高权重加分项 | Planned |
| F-014 | Reputation & Anti-abuse Integration | P1 | 提升公平性并抑制刷子行为 | Planned |

## 5. Feature Business Logic

### F-007 Scrap Relay Core Gameplay

- User Story: 作为团队，我希望分工完成采-运-造接力并拼出舰体。
- Trigger: 接力赛模式开局。
- Preconditions: 材料池与蓝图规则初始化完成。
- Material pool definition and creator (P0):
  - 材料池（MaterialPool）= 本局可用材料类型、初始数量、补给刷新规则、可替代材料映射的集合。
  - 平台运营方维护“材料池模板库”（官方模板）。
  - 房主（Host）建房时选择材料池模板与难度档；系统据此生成本局 `material_pool_id + material_pool_hash`。
  - 开局后材料池模板与初始参数锁定，不允许中途改配方。
- Role model (P0):
  - Miner（采集位）：产出基础材料并保障稳定供给。
  - Runner（运输位）：在时限内把材料投递到组装点。
  - Assembler（组装位）：按蓝图依赖顺序提交工序。
  - Guard（护送/干扰防护位，可兼任）：降低运输中断与材料损耗。
- Blueprint model (P0):
  - 采用 6-8 步轻量 DAG 蓝图，每步有 `required_type_id`、`required_qty`、`dependency_steps`。
  - 必须满足前置步骤才能解锁下一步，禁止越序提交。
  - 蓝图模板由平台运营方维护（官方蓝图库）；房主只可选择模板/难度，不可在 P0 自定义步骤逻辑。
  - 系统开局生成本局 `blueprint_id + blueprint_hash` 并锁定，防止中途换图。
- Main Flow:
1. 队员按角色执行采集与运输，把资源汇入队伍组装池。
2. Assembler 按 DAG 顺序推进工序，系统实时计算“阻塞步骤”并提示优先补料。
3. 关键步骤完成后触发阶段加成（速度或分值）。
4. 首个完成舰体的队伍获胜；若超时则按完工百分比排名结算。
- Alternative Flow / Exceptions:
- 材料被劫触发替代蓝图支线（低收益但可保底完工）。
- 超时则按完工进度分段结算。
- 某步骤长时间阻塞时，系统开放“应急替代材料”但降低阶段奖励倍率。
- Postconditions:
  - 生成可查询的对局结果、奖励分配和个人贡献记录。
- Data Rules:
- 蓝图步骤必须按依赖顺序完成。
- 非法材料映射和越序组装直接拒绝。
- 开局后 `material_pool_hash` 与 `blueprint_hash` 不可修改，防止对局中途变更规则。
- 进度分建议公式：
  - `step_score = step_weight * completion_ratio * time_factor`
  - `team_progress_score = Σ(step_score) + finish_bonus`
- 角色贡献建议公式：
  - `contribution = mining_points + hauling_points + assembly_points + guard_points`
  - 队伍内分配按贡献权重执行，但须保留基础参与保底份额。
- Error Handling:
  - 非法状态迁移、重复结算、重复领奖一律拒绝。
- Acceptance Criteria:
  - AC-001: 强分工且强协作，15 分钟内形成胜负。
  - AC-002: 终局显示角色贡献占比与阻塞点复盘。
  - AC-003: 蓝图步骤、材料消耗、结算账单三者可对账。
  - AC-004: 材料池/蓝图创建权责清晰，且开局后模板锁定规则可验证。

### Step-by-step Gameplay User Stories

1. 作为玩家，我想先选择采集/运输/组装角色。
2. 作为采集位，我想知道当前最关键材料缺口。
3. 作为运输位，我想优先配送阻塞进度的材料。
4. 作为组装位，我想按蓝图顺序推进并得到下一步提示。
5. 作为团队，我想在结算看到各角色贡献占比。

### Core Loop Mapping

- Entry:
  - 选择角色、确认蓝图路线和 buy-in，锁定队伍职责。
- Action:
  - 采集、运输、组装三段接力推进，处理阻塞步骤并重排优先级。
- Feedback:
  - 蓝图 DAG 进度、阻塞原因、资源缺口、角色贡献热力图。
- Reward:
  - 完工奖励（LUX）+ 协作评分 + 训练报告（角色维度建议）。
- Re-engagement trigger:
  - 解锁更高阶蓝图、更短时限挑战和联盟训练赛模板。

#### Loop Execution Detail (Implementation-facing)

- State machine and checkpoints:
  - LobbyReady: 房间参数、蓝图模板、队伍、入场费用锁定。
  - RoleLock(30s): 角色与初始任务分配确认。
  - RelayRunning(10-12m): 采集-运输-组装循环推进。
  - Overtime(90s): 只允许推进已解锁步骤，不新增高风险支线。
  - Settled: 奖励与战报固化，禁止回写关键结果。
- Tick cadence and decision rhythm:
  - 建议 3s 前端刷新、10s 进度收敛一次结算节拍。
  - 每个节拍至少输出：当前可执行步骤、阻塞步骤、缺口材料、角色贡献 Top3。
- Failure and recovery:
  - 玩家掉线：其角色任务进入可接管状态，队友可临时补位。
  - 对局异常中断：基于最近蓝图步骤快照与材料账本做保底结算。
  - 争议数据：仅接受链上步骤提交与材料变更事件作为终态依据。
- Observable loop metrics (for PM/Test):
  - loop_completion_rate（开局到结算完成率）
  - blueprint_completion_rate（蓝图完工率）
  - step_blocked_time_p95（步骤阻塞时长）
  - role_coverage_rate（关键角色覆盖率）
  - requeue_rate_10m（10 分钟内再开局率）

### Monetization and Economy Notes (If Applicable)

- Monetization touchpoint:
  - 训练赛 buy-in（主收入）
  - 进阶蓝图包（可选，不影响基础公平）
  - 联盟内训工具费（主办方服务）
- Why players are willing to pay at the start (WTP drivers):
  - 预期正收益：存在明确奖金池与可验证分账，不是纯消耗。
  - 低门槛试错：Practice 房低 buy-in，允许新手小成本体验协作收益。
  - 技术成长价值：训练报告能直接反馈角色短板，帮助提升后续胜率与收益。
  - 团队社交价值：与固定队友协作完成舰体，本身就是强参与动机。
  - 公平与透明：开局锁定蓝图/材料池/分账参数，降低“付费被坑”心理风险。
- Pricing / fee logic:
  - Practice 房：低 buy-in + 低 rake，强调训练复玩。
  - Ranked Relay 房：中 buy-in + 中 rake，强调成绩和收益。
  - Championship 房：高 buy-in + 中高 rake，强调赛事营收。
- Sink/faucet impact:
  - Sink：buy-in、可选蓝图包。
  - Faucet：`payout_pool` 按完工排名和队内贡献分配。
  - 蓝图包收入进入平台内容金库，不直接挤占当局奖池。
- Anti-abuse rule:
  - 材料来源校验 + 越序操作拦截。
  - 对“低风险重复路线刷贡献”施加递减奖励。
  - 队内贡献异常偏置（单人过高）触发审计标记。
- First-session pay conversion safeguards:
  - 首局建议默认进入 Practice 房（低 buy-in），降低首次付费阻力。
  - 失败局仍发放基础参与回报（非本金全退），保证“花钱有反馈”。
  - 首次结算页必须展示“我为什么拿到这笔钱”的可解释分账明细。
- Simple in-match monetization example:
  1. Ranked 房 8 名玩家，每人 `100 LUX`，`gross_pool = 800`。
  2. 平台费 `10%`，`platform_fee = 80`；`host_revshare = 40%`，`host_fee = 32`。
  3. `payout_pool = 720`，第一名队伍 65%，第二名队伍 35%。
  4. 第一名队伍若 4 人贡献比 `40/25/20/15`，则分配为 `187.2 / 117 / 93.6 / 70.2` LUX。


#### Economy Execution Detail (Implementation-facing)

- Cash-flow order (single match):
  1. 入场锁定 `entry_fee_lux`，创建房间资金账本。
  2. 开局冻结：`platform_rake_bps`、`host_revshare_bps`、`payout_rule_id`、`blueprint_rule_id`。
  3. 终局按完工排名拆分奖池，再按队内贡献权重拆分成员奖励。
  4. 输出账单：`gross_pool / platform_fee / host_fee / payout_pool / rank_payouts / member_payouts`。
- Fee safety rails:
  - `platform_rake_bps <= 1500`（15%）
  - `host_revshare_bps <= 6000`（平台费内最多 60%）
  - 队内贡献加权上限建议 `<= 0.6`，保留基础参与份额，避免极端分配。
- Abuse and fraud controls:
  - 同地址/同设备高频对冲对局识别（刷分、对刷）。
  - 异常短局、异常路线重复、异常贡献集中触发降权。
  - 结算必须满足一致性：`blueprint_hash + step_commit_hash + settlement_hash`。
- Quick example (intuitive):
  - 8 名玩家，每人 80 LUX：`gross_pool = 640`。
  - 平台费 10%：`platform_fee = 64`；主办分成 50%：`host_fee = 32`。
  - 玩家总奖池：`payout_pool = 576`（按排名 + 队内贡献拆分）。

### Three Core Questions (Required)

- 1. 钱从哪里来？
  - Base pool source: 玩家 buy-in（entry_fee_lux）构成基础奖池（player_buyin_pool）。
  - Optional seed/subsidy/sponsor sources: 可叠加 host_seed_pool / platform_subsidy_pool / sponsor_pool。
  - Pool lock timing: 在开局前锁池（LobbyReady -> MatchRunning 前），开局后不可改。
- 2. 任务是什么？
  - Core mission statement: 按蓝图 DAG 依赖完成采集-运输-组装接力，优先清除阻塞步骤。
  - Completion condition: 首个完成舰体，或超时时完工百分比与步骤分最高。
  - Failure condition: 越序/缺料导致关键步骤长期阻塞并在终局分数落后。
- 3. 玩家完成任务后，如何分配？
  - Settlement order: gross_pool -> platform_fee -> host_fee(from platform_fee) -> payout_pool。
  - Team/member split rule: 先按胜负/排名分队伍池，再按队内贡献权重分成员奖励。
  - Traceable bill fields: player_buyin_pool, seed_pools, gross_pool, platform_fee, host_fee, payout_pool, member_payouts。

### Revenue Mechanism Breakdown (Required)

- Who pays: 参赛玩家支付 entry_fee_lux（或 buy-in）。
- Who receives: 玩家胜方获得 payout_pool；主办方获得 host_fee；平台获得 platform_fee - host_fee。
- Platform fee model: 平台按 `platform_rake_bps` 从总奖池收取手续费。
- Host/organizer revenue model: 主办方分成来自平台手续费内部分账（`host_revshare_bps`），不侵占玩家奖池本金。
- Fee boundary (max caps): `platform_rake_bps` 与 `host_revshare_bps` 必须配置上限并可审计。
- Settlement formula:
  - gross_pool = player_count * entry_fee_lux
  - platform_fee = gross_pool * platform_rake_bps / 10_000
  - host_fee = platform_fee * host_revshare_bps / 10_000
  - payout_pool = gross_pool - platform_fee

### Revenue Example (Required)

- Scenario input: 10 名玩家，每人 100 LUX，platform_rake=10%，host_revshare=40%。
- Step-by-step calculation:
  1. gross_pool = 10 * 100 = 1,000 LUX
  2. platform_fee = 1,000 * 10% = 100 LUX
  3. host_fee = 100 * 40% = 40 LUX，payout_pool = 1,000 - 100 = 900 LUX
- Final split result:
  - Player total payout: 900 LUX
  - Host/organizer revenue: 40 LUX
  - Platform revenue: 60 LUX

## 6. UX and UI Constraints

- Must follow: docs/eve-frontier-ui-style-guide.md
- Key interaction requirements:
  - 30 秒内完成“连接钱包 -> 入场 -> 开局”
  - 首屏展示目标、时限、奖励、失败代价
  - 对局过程具备实时反馈（倒计时/贡献/结算状态）
- Accessibility baseline:
  - 关键文字高对比可读
  - 核心操作键盘可达
- UX quality bar:
  - First-time user can understand win condition in <= 30s.
  - Critical state changes have immediate visual feedback.

### 6.1 Design Agent Output Scope (Required)

- Output location:
  - 本玩法设计描述直接维护在 `docs/prd/scrap-relay/prd.md`，不拆分独立设计文档。
- Mandatory references:
  - `AGENTS.md`
  - `docs/eve-frontier-ui-style-guide.md`
  - `docs/templates/prd-template.md`
- Design output quality bar:
  - 评审在 60 秒内可读懂核心页面、关键 CTA 与胜负反馈路径。
  - 每个关键页面都定义：目标、布局、模块、CTA、状态行为、响应式说明。
  - 视觉语言显式映射 EVE Frontier token（颜色、字体、交互语言），避免 SaaS 化软卡片风格。

### 6.2 Screen Inventory and Information Architecture

| Screen ID | Screen Name | Primary User Goal | Entry Trigger | Exit Trigger | Priority |
|---|---|---|---|---|---|
| S-001 | Command Lobby（建房/入场） | 快速理解本局参数并完成入场确认 | 钱包连接后进入玩法首页 | 点击 `进入接力` 后进入 Role Lock | P0 |
| S-002 | Role Lock & Mission Brief（锁角与任务简报） | 在倒计时内锁定职责并拿到首轮任务 | S-001 完成入场确认 | 角色锁定且房间进入 `RelayRunning` | P0 |
| S-003 | Relay Tactical Console（对局战术主界面） | 推进蓝图 DAG、处理阻塞、完成接力 | 房间状态切换到 `RelayRunning` | 触发结算或对局结束进入 S-004 | P0 |
| S-004 | Settlement Debrief（结算与复盘） | 理解账单与贡献分配，决定再开局 | 对局进入 `Settled` | 领取奖励并 `再来一局` 返回 S-001 | P0 |

### 6.3 Screen-by-screen Design Description

#### S-001 Command Lobby（建房/入场）

- Screen intent:
  - 让玩家在首屏 30 秒内确认“本局目标 + 入场成本 + 奖励规则 + 风险提示”并进入房间。
- Layout structure:
  - Top zone: 玩法标题、网络状态、钱包地址 Chip、当前赛道标签（Practice/Ranked/Championship）。
  - Core zone: 左侧房间列表/建房配置，右侧本局经济预览（buy-in、rake、预计 payout）。
  - Bottom zone: Ready Checklist + 主 CTA。
- Key UI modules:
  - Room Feed（房间卡片列表）
  - Match Config Panel（房间参数）
  - Economy Preview Bill（结算顺序预览）
  - Rule Snapshot（3 行规则快照：任务/胜利条件/失败代价）
- Primary CTA / Secondary actions:
  - Primary: `进入接力` / `创建房间`
  - Secondary: `查看规则`、`切换房型`、`返回训练入口`
- User interaction flow (step-by-step):
1. 玩家连接钱包并读取可加入房间列表。
2. 玩家选择房型或创建房间，确认入场费与分账比例。
3. 玩家完成 Ready Checklist，点击主 CTA 进入角色锁定页。
- Data binding requirements:
  - `room_id`, `entry_fee_lux`, `player_count`, `platform_rake_bps`, `host_revshare_bps`, `blueprint_id/hash`。
- Empty/loading/error states:
  - Empty: 无可加入房间时显示“暂无可加入房间”，给出 `创建房间` CTA。
  - Loading: 房间列表与账单预览使用骨架屏，不阻断返回操作。
  - Error: 钱包断连、参数拉取失败时显示错误条并给出 `重试`。
- Responsive notes:
  - Desktop: 左右双栏（列表 7/12，账单 5/12）。
  - Mobile: 单栏堆叠，主 CTA 固定底部，账单预览可折叠。
- Accessibility notes:
  - Tab 顺序固定为 `房间列表 -> 房间参数 -> Ready Checklist -> 主 CTA`，不允许焦点跳跃。
  - 主 CTA 与错误条必须有可见焦点环（2px `#E5B32B`）与键盘触发（Enter/Space）。
  - Buy-in、平台费率、分账比例字段提供 `aria-describedby`，明确单位与公式含义。

#### S-002 Role Lock & Mission Brief（锁角与任务简报）

- Screen intent:
  - 在 `RoleLock` 阶段快速完成角色确认，并对第一轮关键材料缺口形成团队共识。
- Layout structure:
  - Top zone: 倒计时、队伍就绪率、当前缺口摘要。
  - Core zone: 左侧角色矩阵（Miner/Runner/Assembler/Guard），右侧任务简报（前两步蓝图 + 缺料）。
  - Bottom zone: 角色确认 CTA 与倒计时告警条。
- Key UI modules:
  - Role Matrix（角色卡 + 已占位状态）
  - Team Slot Board（队伍位状态）
  - Mission Brief Card（首轮任务）
  - Risk Hint Strip（越序/缺料的后果提示）
- Primary CTA / Secondary actions:
  - Primary: `锁定职责`
  - Secondary: `倒计时内重选角色`、`请求队友补位`
- User interaction flow (step-by-step):
1. 玩家选择角色并查看当前队伍角色覆盖。
2. 玩家阅读第一阶段任务简报并确认优先材料。
3. 玩家点击 `锁定职责`，等待队伍完成就绪后自动开局。
- Data binding requirements:
  - `room_state`, `role_lock_deadline`, `role_coverage_rate`, `blocked_step_hint`, `material_gap_topN`。
- Empty/loading/error states:
  - Empty: 队伍未满时显示“等待队友加入”，保留当前锁定信息。
  - Loading: 角色占位同步中显示局部 loading，不清空已选角色。
  - Error: 锁角冲突或倒计时结束返回 `E_PERMISSION_DENIED`，提示重入下一局。
- Responsive notes:
  - Desktop: 双栏，任务简报常驻右栏。
  - Mobile: 角色矩阵优先，任务简报折叠为抽屉。
- Accessibility notes:
  - Role Matrix 采用 radio-group 语义，支持方向键切换与空格确认。
  - 倒计时与队伍就绪率放入 `aria-live="polite"` 区域；倒计时 <= 10s 升级为 `assertive`。
  - 角色占位状态不能只靠颜色区分，需同步显示文本（已占位/可选择）与图标。

#### S-003 Relay Tactical Console（对局战术主界面）

- Screen intent:
  - 在高信息密度下保持战术清晰，支持玩家持续推进蓝图、解决阻塞并追踪贡献变化。
- Layout structure:
  - Top zone: 阶段状态条（`RelayRunning/Overtime`）、总倒计时、局内吞吐指标。
  - Core zone: 左侧蓝图 DAG，中央执行工作台（材料提交/投递），右侧贡献榜与风控告警。
  - Bottom zone: 事件流时间线 + 快速操作键区。
- Key UI modules:
  - Blueprint DAG Board（可执行/阻塞/完成三态）
  - Material Commit Console（提交工序面板）
  - Blocked Step Radar（阻塞步骤 TopN）
  - Contribution Board（角色贡献与占比）
  - Audit Flag Panel（异常行为标记）
- Primary CTA / Secondary actions:
  - Primary（按角色动态）：`提交工序` / `投递材料` / `发起结算`
  - Secondary: `标记缺料`、`请求支援`、`查看链上事件`
- User interaction flow (step-by-step):
1. 玩家查看当前可执行步骤并确认本角色动作。
2. 玩家提交工序或投递材料，系统即时刷新 DAG 与贡献榜。
3. 若进入 `Overtime`，系统强化阻塞告警并收敛到终局动作。
4. 房主触发结算，进入 S-004。
- Data binding requirements:
  - `room_state`, `timers`, `blueprint_steps`, `blocked_steps`, `materials`, `contribution_snapshot`, `audit_flags`。
- Empty/loading/error states:
  - Empty: 无可执行步骤时显示“当前仅可清理阻塞步骤”并定位 Top1 阻塞。
  - Loading: 链上事件同步时，保留上次快照并显示 `SYNCING` 状态徽标。
  - Error: 越序/非法材料/非法状态迁移时展示错误码（如 `E_BLUEPRINT_DEPENDENCY_UNMET`）。
- Responsive notes:
  - Desktop: 三栏战术布局，DAG 常驻。
  - Tablet: 切换式双栏（DAG / 贡献榜 Tab）。
  - Mobile: 单栏滚动，底部悬浮主 CTA，DAG 缩略图 + 明细抽屉。
- Accessibility notes:
  - Blueprint DAG 节点需同时暴露颜色 + 文本状态（可执行/阻塞/完成），避免纯色传达。
  - 非法提交错误条写入 `aria-live="assertive"`，并在 5 秒内保持可聚焦。
  - 快捷动作键必须在 UI 显示对应键位提示，且提供无快捷键的等价按钮入口。

#### S-004 Settlement Debrief（结算与复盘）

- Screen intent:
  - 用可解释账单和贡献复盘建立“为什么赢/为什么拿到这笔奖励”的信任闭环。
- Layout structure:
  - Top zone: 胜负横幅、局内关键指标、再开局入口。
  - Core zone: 左侧账单瀑布（gross -> platform -> host -> payout），右侧队伍/成员分配与贡献排行。
  - Bottom zone: 复盘时间线与下一步动作。
- Key UI modules:
  - Settlement Waterfall Table
  - Team/Member Payout Grid
  - Contribution Replay Timeline
  - Chain Trace Card（package/event 引用）
- Primary CTA / Secondary actions:
  - Primary: `领取奖励`（如可领取） / `再来一局`
  - Secondary: `查看链上记录`、`导出战报`
- User interaction flow (step-by-step):
1. 玩家查看结算瀑布与队内分配结果。
2. 玩家下钻查看贡献与阻塞复盘时间线。
3. 玩家领取奖励并选择再开局或退出。
- Data binding requirements:
  - `gross_pool`, `platform_fee`, `host_fee`, `payout_pool`, `rank_payouts`, `member_payouts`, `audit_flags`。
- Empty/loading/error states:
  - Empty: 账单未生成时显示 `Settlement Pending` 与预计完成时间。
  - Loading: 结算确认中显示步骤进度，不隐藏已计算字段。
  - Error: 结算失败显示重试指引与 requestId，避免重复提交歧义。
- Responsive notes:
  - Desktop: 双栏账单 + 贡献并列展示。
  - Mobile: 卡片流展示，账单瀑布采用可折叠行。
- Accessibility notes:
  - 结算瀑布表格使用完整表头语义（`th scope`），支持屏幕阅读器逐列朗读。
  - 所有金额统一格式 `number + LUX`，并在同一行暴露原始公式字段名。
  - `领取奖励` 成功后给出可朗读确认信息（transaction id + 状态）。

### 6.4 Visual Token and Component Mapping (Style-guide Aligned)

- Color token mapping:
  - Primary CTA / Highlights: `#E5B32B`（Industrial Yellow）
  - Background: `#080808`（Deep Void Black）
  - Panel / Surface: `#1A1A1A`（Gunmetal Grey）
  - Warning/Error: `#CC3300`（Ember Orange）
  - Text: `#E0E0E0`（Off White）
- Typography mapping:
  - Headline / Metrics: `JetBrains Mono` 或 `Roboto Mono`
  - Body: `Inter` / `Inter Tight`
  - Label / Metadata: 大写标签（UPPERCASE）+ 紧凑字距
- Component style rules:
  - Buttons: 硬边、无圆角、机械式按压反馈（active 下沉 1px）。
  - Panels: 深色半透明面板 + 左侧高亮边条，优先信息可读性。
  - Tables/Lists: 行分隔明确，关键列使用高亮色对齐阅读路径。
  - Alerts: 使用高对比条带，不使用柔和 Toast 漂浮样式。
- Explicit anti-patterns to avoid in this product:
  - 大圆角 SaaS 卡片
  - 低对比度灰字
  - 粉彩/糖果色渐变
  - 过于弹跳和娱乐化动效

### 6.5 Interaction and Motion Description

- Hover/Active feedback:
  - Hover: CTA 提亮到 Off White 邻域，边框保持硬边。
  - Active: `translateY(1px)` + 阴影缩短，体现机械触发感。
- Transition style:
  - 使用短促、线性或近线性节奏（120ms~180ms），避免柔软缓动。
- Critical event feedback:
  - Success: 关键工序完成时，DAG 节点由灰转黄并触发短脉冲描边。
  - Warning: 阻塞步骤持续超阈值时，顶部状态条变橙并闪烁一次。
  - Failure: 非法提交时，错误条固定在操作区上方并显示错误码。
- Timing guidance:
  - Entry animations: 页面首屏模块分层进入，总时长 <= 250ms。
  - In-match updates: 3 秒刷新视觉节拍，10 秒执行一次重点状态收敛提醒。

### 6.6 Responsive and Adaptation Strategy

- Desktop behavior:
  - 默认高信息密度布局，核心操作与关键指标同屏可见。
- Tablet behavior:
  - 保留核心信息并采用分区 Tab 切换（DAG/贡献/账单）。
- Mobile behavior:
  - 优先“当前动作 + 阻塞提示 + 计时器”，次级信息下沉到抽屉。
- Priority downgrades for small screens:
  - 先隐藏装饰纹理与次级指标，再隐藏非关键历史日志。
  - 保留所有关键 CTA 与状态错误提示，不做功能降级。

### 6.7 Design QA Checklist (Required)

- [ ] 首屏 30 秒可读：目标、时限、奖励、失败代价可一眼定位。
- [ ] S-001~S-004 每屏均定义了主 CTA、状态行为、响应式说明。
- [ ] 颜色/字体/交互与 EVE token 完整对齐（`#E5B32B/#080808/#1A1A1A/#CC3300/#E0E0E0`）。
- [ ] 非法操作有明确错误码反馈，不出现“静默失败”。
- [ ] 结算页可解释账单字段与贡献分配，可支持复盘与争议定位。
- [ ] 每个关键屏幕均定义键盘可达路径与 `aria-live` 反馈策略。
- [ ] 关键状态（Loading/Error/Blocked/Settled）具备统一文案与下一步动作提示。

### 6.8 Frontend Layout Blueprint (Implementation-ready)

- Unified shell rules:
  - 全局采用 `Top Command Bar + Main Tactical Workspace + Bottom Action Rail` 三段式结构。
  - Top Command Bar 固定展示：房间状态、网络状态、倒计时（若存在）、钱包短地址。
  - Bottom Action Rail 仅放当前屏幕主 CTA 与最多两个次级动作，避免操作分散。
- Navigation and progression map:
  - `S-001 Command Lobby -> S-002 Role Lock -> S-003 Relay Console -> S-004 Settlement -> S-001`.
  - 仅允许前向推进；`S-003` 期间禁止返回 `S-001` 修改房间参数，防止状态漂移。
- Information priority ladder (all screens):
  1. 当前任务与胜负条件
  2. 时间压力（倒计时 / Overtime）
  3. 当前可执行动作（主 CTA）
  4. 风险告警与错误码
  5. 历史日志与扩展信息
- Desktop/Tablet/Mobile layout contract:
  - Desktop (`>=1280px`): 高密三栏优先，关键指标与主操作同屏。
  - Tablet (`768px-1279px`): 双栏 + Tab 切换，固定保留主 CTA 与计时器。
  - Mobile (`<768px`): 单栏 + 抽屉，默认只展示“当前动作/阻塞/倒计时”。

### 6.9 UI State Matrix and Microcopy Contract

| State Key | Trigger | Placement | Visual Rule | Microcopy | Next Action |
|---|---|---|---|---|---|
| `ROOM_LIST_LOADING` | 首次进入 S-001 拉房间列表 | Room Feed 区域 | 骨架屏 + 左边黄条 (`#E5B32B`) | `正在同步可加入房间...` | 等待 / `刷新列表` |
| `WALLET_DISCONNECTED` | 钱包断连或签名失败 | Top Command Bar 下方错误条 | 红色条带 (`#CC3300`) + 错误码 | `钱包连接中断，无法继续入场（E_WALLET_DISCONNECTED）` | `重连钱包` |
| `ROLE_LOCK_CONFLICT` | S-002 同角色并发占位冲突 | Role Matrix 顶部 | 红色边框 + 冲突角色闪烁一次 | `该职责已被占用，请在倒计时内重选` | `重新选择角色` |
| `STEP_BLOCKED` | S-003 当前无可执行步骤 | DAG 区与顶部状态条 | 橙色告警 (`#CC3300`) + Top1 阻塞高亮 | `当前工序被阻塞：优先补齐 {material_type}` | `标记缺料` / `请求支援` |
| `ILLEGAL_SUBMIT` | 越序提交/非法材料提交 | Material Console 上方 | 固定错误条 + `aria-live=assertive` | `提交失败：依赖未满足（E_BLUEPRINT_DEPENDENCY_UNMET）` | `查看可执行步骤` |
| `SETTLEMENT_PENDING` | S-004 结算数据尚未完全确认 | Settlement 顶部状态卡 | 黄黑条带 + 进度指示 | `结算确认中，请勿重复提交` | 等待 / `查看链上记录` |
| `SETTLEMENT_FAILED` | 结算交易失败或超时 | Settlement 顶部错误卡 | 红色条带 + requestId | `结算未完成，请按 requestId 重试或联系房主` | `重试结算` |

- Copy tone constraints:
  - 文案语气采用“战术指令式”，短句、强动词、少形容词。
  - 每条错误文案必须包含：原因 + 错误码 + 可执行下一步。
  - 同一状态在不同终端保持同义文案，不允许出现桌面/移动端语义漂移。

## 7. Architecture Constraints

- Must follow: docs/architecture.md
- Required layer ownership:
  - View: 仅负责展示与交互采集
  - Controller: 编排用例与流程
  - Service: 业务规则与副作用编排
  - Model (Zustand): 统一状态源与状态迁移

## 8. Contract / Chain Considerations (If Applicable)

- Move module impacts: BlueprintState、MaterialLedger、AssemblyProgress。
- On-chain/off-chain boundary: 链上确认关键工序和结算；链下展示进度与提示。
- Must follow testing standard: docs/sui-devnet-testing-standard.md
- Security and abuse considerations:
  - Replay: 工序提交绑定 assembly_id + step_id。
  - Double settlement: 同工序不可重复记分。
  - Privilege checks: 关键工序需持有对应角色权限。

### Contract Feasibility Review (Based on docs/all_contracts.move.txt)

- Feasibility verdict: High（生产接力与库存原语匹配）
- Directly reusable contract primitives:
  - `inventory + storage_unit`：可承载材料存取、转运、数量变更与权限控制；
  - `object_registry`：可用于蓝图实例和步骤对象的确定性索引；
  - `status`：可表达工序状态与终局状态迁移。
- Missing capabilities / required new modules:
  - 缺少 `BlueprintState / StepDependencyLedger / ContributionLedger / RelaySettlement`；
  - 缺少“替代蓝图支线”和“阻塞步骤审计”专用对象；
  - 缺少面向训练报告的结构化链上摘要字段。
- P0 delivery boundary:
  - 链上固化关键工序提交、材料消耗与终局结算；
  - 高频路径优化、引导提示、训练报告生成保持链下；
  - P1 再考虑把更多训练评估摘要上链。

## 9. Risks and Assumptions

- Assumptions:
  - 使用 Next.js + Tailwind + Zustand + Sui Move 作为默认实现栈。
- Risks:
  - 新手可能被蓝图复杂度劝退。
  - 角色不平衡导致体验偏差。
- Mitigations:
  - 提供简化蓝图和引导层。
  - 按局统计角色负载并动态调参。

## 9.1 Open Questions

- Q-001: 是否允许中途换角？
- Q-002: 替代蓝图奖励权重如何平衡？

## 10. Release and Validation

- Milestones:
  - M1: 基础接力；M2: 贡献复盘；M3: 训练模式扩展
- Validation approach:
  - 每个玩法至少 1 条主流程 + 1 条异常流程通过。
  - 关键结算交易、事件日志和战报互相可追溯。
- Exit criteria:
  - 可完成真实多人对局并输出可验证的演示证据。

## 11. Traceability

| PRD Item | Linked SPEC Section | Linked TODO IDs |
|---|---|---|
| F-007 | 4.1 / 4.2 / 4.3 / 4.4 / 5.1 / Contract Module Design | T-001, T-002, T-003, T-004, T-007, T-008, T-010, T-013, T-014 |
| F-012 | 4.3 / 5 / Contract Module Design | T-005, T-006, T-010, T-015 |
| F-013 | 4.3 / 7 / Contract Module Design | T-006, T-010, T-012, T-015, T-017 |
| F-014 | 4.3 / 5 / 7 / Contract Module Design | T-009, T-010, T-016 |

## 12. PM Discussion Log

| Date | User Question Summary | PM Answer Summary | Decision Type | PRD Changes |
|---|---|---|---|---|
| 2026-03-20 | 启用 PM 讨论模式（问答 + 文档同步） | 已启用：PM 问答若影响范围/逻辑/指标/优先级，将在同回合同步更新 PRD | Process | Added discussion-mode workflow and logging requirement |
| 2026-03-20 | 每个 PRD 需要详细阐述赚钱机制并举例 | 已执行：新增 Revenue Mechanism Breakdown + Revenue Example（含结算公式与数字算例） | Logic / Metrics | Updated monetization detail section |
| 2026-03-20 | 全量 PRD 可行性复审（all_contracts.move.txt） + 细化 Core Loop 与 Monetization | 结论：P0 可做，但需“现有合约原语 + 新玩法模块/索引层”组合交付；已补充执行级循环与资金流细节。 | Logic / Scope / Metrics | Added feasibility review + expanded Core Loop Mapping + Monetization notes |
| 2026-03-20 | 细化 Scrap Relay PRD（可执行级） | 已细化蓝图 DAG、角色职责、步骤计分、队内分账与工序可行性边界。 | Logic / Scope / Metrics | Expanded F-007 + Core Loop + Monetization + Feasibility detail |
| 2026-03-20 | Scrap Relay：材料池和蓝图是什么，谁创建？ | 决策：材料池和蓝图模板均由平台运营方维护；房主仅选择模板/难度；系统开局生成并锁定 hash。 | Logic / Scope | Added material pool definition + template ownership + AC-004 |
| 2026-03-20 | 为什么用户刚开始愿意投钱玩 Scrap Relay？ | 决策：通过“低门槛档位 + 可验证奖金池 + 首局可解释反馈 + 成长价值”建立首付意愿。 | Logic / Metrics | Added WTP drivers + first-session pay conversion safeguards |
| 2026-03-20 | global 3-question closure requirement across all PRDs | Enforced explicit answers for: funding source, mission objective, and post-mission distribution in each PRD. | Logic / Scope / Metrics | Added Three Core Questions (Required) section |
| 2026-03-20 | `$design`：根据 Scrap Relay PRD 设计前端界面 | 已在 PRD 内补齐 6.1~6.7 的屏幕级设计（S-001~S-004）、状态行为、响应式与 token 映射，不改变业务范围与分账逻辑。 | Design / UX | Expanded UX section with screen inventory, per-screen design, visual tokens, motion, responsive, QA checklist |
| 2026-03-20 | `$design`：进一步细化 Scrap Relay 前端界面实现说明 | 决策：在不变更业务与 monetization 的前提下，补齐逐屏 Accessibility、统一布局蓝图（6.8）与状态文案矩阵（6.9），用于前端实现对齐。 | Design / UX | Added per-screen accessibility notes, layout blueprint, and UI state microcopy contract |

## 12.1 Pending Discussion Items

- D-001: None
