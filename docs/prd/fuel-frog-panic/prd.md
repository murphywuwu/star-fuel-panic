# PRD: Fuel Frog Panic

## 0. One-Screen Summary (Problem / Why / How)

- Problem it solves: Frontier 后勤补给本身高压但分散，玩家缺少短时协作演练场景。
- Why this matters now: 玩家知道补给重要，但缺少清晰分工工具。
- How it solves it (3-step mechanism):
  1. 系统下发多节点燃料缺口与时限。
  2. 玩家分工执行采集、运输、护航。
  3. 按完成度与时效进行积分和奖池结算。
- Expected player/business outcome: 单局 10-15 分钟完成，流程稳定。

## 0.1 Before vs After

| Dimension | Before | After |
|---|---|---|
| Player clarity | 玩家知道补给重要，但缺少清晰分工工具。 | 单局 10-15 分钟完成，流程稳定。 |
| Player outcome | 目标不清、协作效率受限 | 单局 10-15 分钟完成，流程稳定。 |
| Business outcome | 复玩率与营收闭环不稳定 | 可验证的玩法闭环与结算闭环 |

## 1. Document Control

- Product Name: Fuel Frog Panic
- Project/App Path: apps/fuel-frog-panic
- Version: v1.1
- Status: Draft
- Owner (PM Agent): Codex
- Last Updated: 2026-03-20
- Related Docs:
  - SPEC: apps/fuel-frog-panic/spec.md
  - TODO: apps/fuel-frog-panic/todo.md
  - Test Plan: docs/test-plan/fuel-frog-panic/test-plan.md

## 2. Background and Goal

- Problem Statement:
  - 需要将 Frontier 核心循环（生存、协作、竞争、经济）转化为可快速开局、可复玩、可结算的街机玩法。
  - Frontier 后勤补给本身高压但分散，玩家缺少短时协作演练场景。
- Target Users:
  - Frontier 玩家（个人与小队）
  - 联盟组织者 / 社区活动发起者
- Product Goal:
  - 交付可在黑客松时限内演示并可继续迭代的玩法闭环。
- Non-Goals:
  - 不做超出黑客松窗口的大型内容系统（如完整赛季运营后台）。
- Strategic Fit (why now for this hackathon/project):
  - 该玩法兼具 Utility（生存补给）与 Live Integration（真实补给事件），适合黑客松现场演示。

## 2.1 Why Players Need This Product

- 玩家知道补给重要，但缺少清晰分工工具。
- 后勤过程反馈慢，贡献不透明，导致队友积极性下降。
- 活动缺少可持续激励和可复盘战报。
- 玩家有明确收益预期：打得好可获得 LUX 奖励，且贡献可沉淀为信誉分与更高档位入场资格。

## 2.2 Player Segments and JTBD

| Segment | Context | Job-to-be-done | Current Friction |
|---|---|---|---|
| S-001 | 小队协作冲分 | 在限时内协作完成多点补给 | 缺口信息分散、分工不清、局内反馈不足 |
| S-002 | 联盟训练新成员 | 用短局训练采集-运输-护航协同 | 训练成本高且缺乏量化评估 |

## 2.3 Success Metrics and Guardrails

- North Star Metric: 有效补给完成节点数 / 局
- Primary metrics:
  - M-001: 局完成率 >= 85%
  - M-002: 团队协作得分占比 >= 60%
- Guardrail metrics:
  - G-001: 异常分数提交拦截率 = 100%
  - G-002: 结算争议率 < 1%
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
| P0 | Hackathon 72h | 多节点缺口下发、角色分工、统一结算 |
| P1 | Post-hackathon 2-4 weeks | 动态天气/敌对干扰、训练报告模板 |

### Out of Scope

- 跨玩法资产深度互通经济系统
- 完整电竞观战回放平台
- 主网正式商业运营法务流程

## 3.1 Dependencies and Constraints

- Internal dependencies: Arcade Hub、Monetization、Reputation
- External dependencies (API/network/team): 链上事件订阅、地图与节点状态读取
- Critical assumptions: 节点数据可实时读取并可用于结算

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Value Hypothesis | Status |
|---|---|---|---|---|
| F-002 | Fuel Frog Panic Core Gameplay | P0 | 把后勤痛点游戏化后可显著提升协作参与度和联盟训练效率。 | Planned |
| F-012 | Monetization Engine Integration | P0 | 统一收费与结算规则可降低运营复杂度 | Planned |
| F-013 | Live Frontier Integration | P0 | 实网可运行是评审高权重加分项 | Planned |
| F-014 | Reputation & Anti-abuse Integration | P1 | 提升公平性并抑制刷子行为 | Planned |

## 5. Feature Business Logic

### F-002 Fuel Frog Panic Core Gameplay

- User Story: 作为协作小队，我希望在限时内补给星门网络并防止断供。
- Trigger: 房主发起燃料救援局。
- Room/Team creation rule (P0):
  - 房间由 `Host` 创建（可为官方活动账号、联盟组织者或普通队长）。
  - 队伍默认由房主先创建 1~2 支队伍框架；玩家以“单人入队”或“小队整队入队”方式加入。
  - 开局前队长可调整角色位（Collector/Hauler/Escort/Dispatcher），开局后锁定。
- Preconditions: 3-8 名玩家完成入场与买入。
- Role model (P0):
  - Collector（采集位）：负责获取指定燃料与关键补给物资。
  - Hauler（运输位）：负责把资源从采集点运到目标节点。
  - Escort（护航位）：降低运输被打断概率，处理高风险路段。
  - Dispatcher（指挥位，可由任意角色兼任）：负责动态重排节点优先级和路线。
- Main Flow:
1. 开局生成 `NodeDeficitSnapshot`（节点缺口、截止时间、风险权重）。
2. 队伍在 30 秒准备期内完成角色分配与首轮路线确认。
3. Collector 采集并提交资源到队伍补给池，Hauler 执行运输，Escort 保证通过率。
4. 节点按 `fill_ratio` 从 0 到 1 递增，达到阈值即触发节点完成事件并加分。
5. 在最后冲刺窗口（Final 90s）允许执行高风险高收益补给任务。
6. 对局结束后按“节点完成度 + 时效 + 风险路段完成度”进行奖池结算。
- Alternative Flow / Exceptions:
- 节点受干扰时触发应急补给支线（高风险高倍率）。
- 运输中断时，货物可回退到最近中继点，避免整段进度清零。
- 超时未满员自动解散并退款。
- Postconditions:
  - 生成可查询的对局结果、奖励分配和个人贡献记录。
- Data Rules:
- 团队分只能由链上可验证补给事件累计，不接受前端直接写分。
- 节点完成状态不可回退，防止重复刷分。
- 节点评分建议公式：
  - `node_score = base_weight * fill_ratio * time_bonus * risk_bonus`
  - `team_score = Σ(node_score) + final_sprint_bonus`
- 个人贡献建议公式：
  - `player_contribution = collect_points + haul_points + escort_points + dispatch_points`
  - 奖励分配时 `contribution_weight` 仅在队伍内部分配比例中生效，不改变总奖池。
- Error Handling:
  - 非法状态迁移、重复结算、重复领奖一律拒绝。
- Acceptance Criteria:
  - AC-001: 单局 10-15 分钟完成，流程稳定。
  - AC-002: 贡献、奖励与战报可追溯并可复盘。
  - AC-003: 节点缺口、完成事件、结算账单三者可链路对齐。

### Step-by-step Gameplay User Stories

1. 作为玩家，我想先看到哪些节点最紧急。
2. 作为采集手，我想明确当前优先资源类型。
3. 作为运输手，我想获取建议路线与护航需求。
4. 作为护航手，我想优先保护高价值运输。
5. 作为队伍成员，我想在结算看到贡献和分配。

### Core Loop Mapping

- Entry:
  - 查看缺口地图、节点权重、推荐角色，选择入队并锁定 buy-in。
- Action:
  - 采集位产出资源，运输位完成投递，护航位保障关键路段成功率，指挥位动态调度。
- Feedback:
  - 实时显示节点 `fill_ratio`、剩余时长、风险热度、角色贡献榜和阻塞点。
- Reward:
  - 对局奖励（LUX）+ 信誉分 + 训练评分（角色维度）。
- Re-engagement trigger:
  - 系统推荐“更高风险但更高收益”的下一轮补给局，支持原队伍一键续局。

#### Loop Execution Detail (Implementation-facing)

- State machine and checkpoints:
  - LobbyReady: 房间参数、节点缺口快照、队伍、入场费用锁定。
  - Planning(30s): 角色分配、首轮路线确认、关键节点标记。
  - MatchRunning(8-12m): 采集/运输/护航循环，持续写入补给事件。
  - FinalSprint(90s): 开放高风险支线与倍率奖励。
  - Settled: 奖励与战报固化，禁止回写关键结果。
- Tick cadence and decision rhythm:
  - 建议 3s 前端刷新、10s 结算节拍收敛一次有效进度。
  - 每个节拍至少输出：节点完成率、运输在途量、关键路段中断次数、队伍贡献 Top3。
- Failure and recovery:
  - 玩家掉线：角色进入 45s 托管窗口，允许队友临时接管任务。
  - 对局异常中断：按最近 `NodeDeficitSnapshot` 与已确认补给事件做保底结算。
  - 争议数据：仅接受链上事件（或带签名证明）作为终态依据。
- Observable loop metrics (for PM/Test):
  - loop_completion_rate（开局到结算完成率）
  - avg_loop_duration（单局平均时长）
  - critical_node_saved_rate（关键节点抢救成功率）
  - escort_interrupt_rate（运输中断率）
  - requeue_rate_10m（10 分钟内再开局率）

### Monetization and Economy Notes (If Applicable)

- Monetization touchpoint:
  - 对局 buy-in（主收入）
  - 联盟训练专场服务费（主办方可配置）
  - 可选训练模板包（非付费不影响胜负）
- Prize pool funding source (where the initial money comes from):
  - 默认来源：玩家入场买入（buy-in）累积形成基础奖池。
  - 可选来源 A：主办方保底注资（host_seed_pool），用于“保底奖金房”。
  - 可选来源 B：平台活动补贴（platform_subsidy_pool），用于拉新或赛事活动。
  - 可选来源 C：赞助资金池（sponsor_pool），用于品牌合作专场。
  - 奖池在 `LobbyReady -> Planning` 切换时锁定，开局后不可改动资金来源结构。
- Pricing / fee logic:
  - Drill 房（新手）：`entry_fee_lux = 20~50`，低 rake（6%~8%）
  - Contract 房（标准）：`entry_fee_lux = 60~120`，中 rake（8%~10%）
  - Crisis 房（高压）：`entry_fee_lux = 150~300`，中高 rake（10%~12%）
- Sink/faucet impact:
  - Sink：buy-in 进入总奖池并扣除平台费。
  - Faucet：`payout_pool` 按“胜负 + 贡献权重”回流玩家。
  - 训练模板包收入进入平台内容金库，不参与当局奖池分配。
- Platform revenue path (how platform makes money):
  - 每局平台从 `gross_pool` 抽取 `platform_fee`（按 `platform_rake_bps`）。
  - 平台净收入 = `platform_fee - host_fee`（主办方分成来自平台费内部，不额外扣玩家奖池）。
  - 平台可叠加 B2B 训练工具费与模板包收入，形成“对局抽成 + 工具服务”双收入结构。
- Player earning path (why players play):
  - 玩家可通过胜负与贡献拿到 LUX 奖励（尤其是高风险节点和关键护航贡献）。
  - 玩家还能获得信誉分，用于进入更高 buy-in 房间，提升潜在收益天花板。
  - 即使非冠军，若贡献高也可在队内分账中获得更高份额（按 `contribution_weight`）。
- Anti-abuse rule:
  - 限制同设备多号同步入局；异常贡献曲线报警。
  - 对“低风险路线高频刷分”做收益递减惩罚。
  - 队伍内贡献异常集中（单人占比异常）触发风控审计。
- Simple in-match monetization example:
  1. Contract 房 6 名玩家，每人 `100 LUX`，`gross_pool = 600`。
  2. `platform_rake = 10%`，则 `platform_fee = 60`；`host_revshare = 40%`，则 `host_fee = 24`。
  3. `payout_pool = 540`，冠军队得 70%（378），亚军队得 30%（162）。
  4. 冠军队内再按贡献权重分配，例如 A/B/C 贡献 50/30/20，则分得 `189 / 113.4 / 75.6` LUX。
  5. 若主办方额外注入 `host_seed_pool = 120 LUX`，则 `gross_pool = 720`，玩家可感知为“保底奖金更高”。


#### Economy Execution Detail (Implementation-facing)

- Cash-flow order (single match):
  1. 入场锁定 `entry_fee_lux` 并生成房间账本。
  2. 注入并锁定可选奖池来源：`host_seed_pool`、`platform_subsidy_pool`、`sponsor_pool`。
  3. 开局冻结参数：`platform_rake_bps`、`host_revshare_bps`、`payout_rule_id`、`contribution_rule_id`。
  4. 计算总奖池：
     - `player_buyin_pool = player_count * entry_fee_lux`
     - `gross_pool = player_buyin_pool + host_seed_pool + platform_subsidy_pool + sponsor_pool`
  5. 终局先计算 `payout_pool`，再按胜负队伍比例拆分，最后按队内贡献加权拆分。
  6. 输出可审计账单：`player_buyin_pool / seed_pools / gross_pool / platform_fee / host_fee / payout_pool / member_payouts`。
- Fee safety rails:
  - `platform_rake_bps <= 1500`（15%）
  - `host_revshare_bps <= 6000`（平台费内最多 60%）
  - 贡献权重封顶：单人贡献加权系数建议 `<= 0.6`，避免单人通吃。
- Abuse and fraud controls:
  - 同地址/同设备高频对冲对局识别（刷分、对刷）。
  - 异常胜率、异常短局、异常贡献集中度触发降权。
  - 结算必须满足事件一致性（开局参数哈希 + 终局结果哈希 + 节点完成哈希）。
- Quick example (intuitive):
  - 8 名玩家，每人 80 LUX：`gross_pool = 640`。
  - 平台费 10%：`platform_fee = 64`；主办分成 50%：`host_fee = 32`。
  - 玩家总奖池：`payout_pool = 576`（再按胜负与贡献拆分）。
  - 若活动补贴 160 LUX：`gross_pool = 800`，玩家奖池同步提高。

### Three Core Questions (Required)

- 1. 钱从哪里来？
  - Base pool source: 玩家 buy-in（entry_fee_lux）构成基础奖池（player_buyin_pool）。
  - Optional seed/subsidy/sponsor sources: 可叠加 host_seed_pool / platform_subsidy_pool / sponsor_pool。
  - Pool lock timing: 在开局前锁池（LobbyReady -> MatchRunning 前），开局后不可改。
- 2. 任务是什么？
  - Core mission statement: 在限时内完成多节点燃料补给，达成节点 fill_ratio 目标并守住关键路线。
  - Completion condition: 达到目标节点完成数或在时限内获得更高 team_score。
  - Failure condition: 超时且关键节点未达标，或队伍总分落后。
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
  - player_buyin_pool = player_count * entry_fee_lux
  - gross_pool = player_buyin_pool + host_seed_pool + platform_subsidy_pool + sponsor_pool
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

- Must follow: `docs/eve-frontier-ui-style-guide.md`
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
  - 设计描述直接维护在本 PRD（不额外拆分独立设计文档）。
- Mandatory references:
  - `docs/eve-frontier-ui-style-guide.md`
- Design output quality bar:
  - 评审在 60 秒内理解关键界面与主要操作路径。
  - 每个 P0 界面明确 CTA、状态反馈、异常反馈。
  - 所有视觉定义都能映射到 EVE Frontier 样式 token。

### 6.2 Screen Inventory and Information Architecture

| Screen ID | Screen Name | Primary User Goal | Entry Trigger | Exit Trigger | Priority |
|---|---|---|---|---|---|
| S-001 | Mission Lobby / Buy-in | 了解目标并完成入场 | 进入玩法房间 | 完成入场并点击准备 | P0 |
| S-002 | Planning / Role Lock | 分配角色与路线 | 房间满员或手动进入规划 | 角色锁定 + 开局 | P0 |
| S-003 | Tactical Command Map | 执行补给主循环 | 对局开始 | 进入 Final Sprint 或结算 | P0 |
| S-004 | Final Sprint Alert Layer | 冲刺阶段高风险决策 | 倒计时 <= 90s | 对局结束 | P0 |
| S-005 | Settlement Bill | 理解分账与个人收益 | 对局结束触发结算 | 确认并返回大厅 | P0 |
| S-006 | After Action Report | 复盘贡献与问题点 | 结算确认后 | 一键续局或离开 | P1 |

### 6.3 Screen-by-screen Design Description

#### S-001 Mission Lobby / Buy-in

- Screen intent:
  - 让玩家在 30 秒内理解“目标节点、风险、买入、收益路径”并完成入场。
- Layout structure:
  - Top zone: 房间标题、剩余准备时间、风险级别标签。
  - Core zone: 节点缺口摘要卡（3-5 个）、奖池来源摘要、队伍占位。
  - Bottom zone: 主 CTA（`Join Match`）、次操作（查看规则、退出）。
- Key UI modules:
  - 节点缺口卡片（节点名、fill_ratio、risk_weight）。
  - 奖池摘要条（buy-in、seed、subsidy、sponsor）。
  - 队伍席位面板（Alpha/Beta 当前人数）。
- Primary CTA / Secondary actions:
  - Primary: `Join Match`（工业黄实底按钮）。
  - Secondary: `View Rules`、`Leave Room`（线框按钮）。
- User interaction flow (step-by-step):
1. 玩家阅读节点与奖池摘要。
2. 玩家选择队伍并确认 buy-in。
3. 玩家进入已准备状态，等待规划阶段。
- Data binding requirements:
  - `roomId`, `playerCount`, `entry_fee_lux`, `gross_pool_preview`, `nodeDeficitSnapshot[]`。
- Empty/loading/error states:
  - Empty: 无可加入房间时显示“NO ACTIVE RELAY OPS”并给创建入口。
  - Loading: Skeleton 卡片 + 网格扫描背景。
  - Error: 入场失败弹出错误条（高对比橙红）。
- Accessibility notes:
  - CTA 最小点击区 >= 44px。
  - 倒计时与买入金额提供文本冗余，不只颜色编码。

#### S-002 Planning / Role Lock

- Screen intent:
  - 在 30 秒内完成角色分工与首轮路线确认。
- Layout structure:
  - Top zone: 30 秒规划倒计时 + 当前建议策略。
  - Core zone: 队伍角色槽（Collector/Hauler/Escort/Dispatcher）+ 路线列表。
  - Bottom zone: 主 CTA（`Lock Roles & Start`）。
- Key UI modules:
  - 角色槽拖拽/点击分配面板。
  - 路线优先级列表（A/B/C 节点，风险标签）。
- Primary CTA / Secondary actions:
  - Primary: `Lock Roles & Start`。
  - Secondary: `Auto Assign`、`Reset`。
- User interaction flow (step-by-step):
1. 队长分配角色位。
2. 指挥位确认首轮路线优先级。
3. 队长锁定角色并触发开局。
- Data binding requirements:
  - `teamRoleMap`, `planningCountdown`, `routePriority[]`, `rolesLocked`。
- Empty/loading/error states:
  - Empty: 未分配角色时按钮禁用并提示缺失项。
  - Loading: 角色槽显示占位态。
  - Error: 锁定失败时显示错误码（如配置已锁/状态非法）。
- Accessibility notes:
  - 键盘可完成角色切换与确认（Tab/Enter）。

#### S-003 Tactical Command Map

- Screen intent:
  - 支撑主循环执行，实时展示节点进度、贡献排行、风险热度。
- Layout structure:
  - Left column: 节点地图与补给路线。
  - Middle column: 实时事件流（补给成功/中断/节点完成）。
  - Right column: 贡献榜、队伍分、风险告警。
  - Bottom strip: 快速动作栏（提交补给、请求护航、标记阻塞）。
- Key UI modules:
  - Node Map（fill_ratio 条 + 状态色）。
  - Contribution Board（Top3 + 个人贡献）。
  - Risk Heat Panel（高风险路段提醒）。
- Primary CTA / Secondary actions:
  - Primary: `Submit Supply Run`。
  - Secondary: `Request Escort`、`Re-route`、`Ping Team`。
- User interaction flow (step-by-step):
1. 玩家查看关键缺口节点。
2. 执行补给动作并查看即时反馈。
3. 根据风险提示动态调整路线。
- Data binding requirements:
  - `nodes[]`, `teamScore`, `playerContribution[]`, `riskMarkers[]`, `countdownSec`。
- Empty/loading/error states:
  - Empty: 无实时事件时显示“STANDBY // NO NEW LOGS”。
  - Loading: 地图模块骨架屏 + 低透明扫描层。
  - Error: 数据延迟时显示 `STALE SNAPSHOT` 徽标并提供重试按钮。
- Accessibility notes:
  - 地图关键状态同步输出为表格文本视图，避免仅图形表达。

#### S-004 Final Sprint Alert Layer

- Screen intent:
  - 在最后 90 秒触发高压决策，强化节奏与风险感知。
- Layout structure:
  - 全宽顶部告警条 + 中央冲刺任务卡 + 右侧奖励倍率说明。
- Key UI modules:
  - 冲刺任务卡（高风险高收益）。
  - 倒计时高亮模块（秒级）。
- Primary CTA / Secondary actions:
  - Primary: `Commit Sprint Route`。
  - Secondary: `Fallback Safe Route`。
- User interaction flow (step-by-step):
1. 阶段切换触发告警层。
2. 队伍选择冲刺路线。
3. 执行并等待终局结算。
- Data binding requirements:
  - `phase`, `finalSprintTasks[]`, `multiplierRule`, `remainingSec`。
- Empty/loading/error states:
  - Empty: 无冲刺任务时自动回退普通任务列表。
  - Error: 任务提交失败时显示明确失败原因与重试入口。
- Accessibility notes:
  - 告警文案不只颜色变化，必须有文字标签 `FINAL SPRINT`。

#### S-005 Settlement Bill

- Screen intent:
  - 让玩家直观看懂“钱怎么来、怎么扣、怎么分”。
- Layout structure:
  - Top zone: 对局结果与结算状态（Settled/Retry）。
  - Core zone: 分账流水表（gross/platform/host/payout/member）。
  - Bottom zone: 主 CTA（`Confirm & Continue`）。
- Key UI modules:
  - Bill Table（可审计字段）。
  - 队内分配卡（个人贡献权重 + 到账）。
- Primary CTA / Secondary actions:
  - Primary: `Confirm & Continue`。
  - Secondary: `View Audit Log`、`Report Issue`。
- User interaction flow (step-by-step):
1. 玩家查看总池与手续费。
2. 玩家查看队内个人分配。
3. 玩家确认结算并进入复盘。
- Data binding requirements:
  - `settlementBill`, `memberPayouts[]`, `auditId`, `settlementId`。
- Empty/loading/error states:
  - Loading: 结算计算中显示 `SYNCING LEDGER...`。
  - Error: 幂等冲突时显示“使用已确认结算单”。
- Accessibility notes:
  - 金额字段采用等宽数字与千分位分隔，保证可读性。

### 6.4 Visual Token and Component Mapping (Style-guide Aligned)

- Color token mapping:
  - Primary CTA: `#E5B32B`（Industrial Yellow）。
  - Background: `#080808`（Deep Void Black）。
  - Panel: `#1A1A1A` + `rgba(8, 8, 8, 0.85)`。
  - Warning/Error: `#CC3300`（Ember Orange）。
  - Text: `#E0E0E0`（Off White）。
- Typography mapping:
  - Headline / Metrics: `JetBrains Mono` / `Roboto Mono` / `Share Tech Mono`。
  - Body: `Inter` / `Inter Tight`。
  - Label / Metadata: 全大写 + 高字距。
- Component style rules:
  - Buttons: 硬边角、强对比、按下 `translateY(1px)`。
  - Panels: 1px 实线边框（`#333` 或 `#E5B32B`），左侧强调线。
  - Tables/Lists: 网格化分隔线，行高稳定，避免圆角卡片感。
  - Alerts: 橙红告警条 + 单独图标区，不做柔和渐变提示。
- Explicit anti-patterns to avoid in this product:
  - 大圆角 SaaS 卡片。
  - 低对比灰字。
  - 粉彩/柔和渐变主视觉。
  - 过于弹性、玩具化动画。

### 6.5 Interaction and Motion Description

- Hover/Active feedback:
  - Hover 提亮到接近 `#E0E0E0` 或提升边框亮度。
  - Active 使用轻微下压（`translateY(1px)`）模拟机械按键。
- Transition style:
  - 使用短促线性或近线性节奏（120ms~220ms），避免软弹簧效果。
- Critical event feedback:
  - Success: 节点完成时显示黄线脉冲 + 事件日志插入。
  - Warning: 风险升高时触发橙红边框闪烁（低频）。
  - Failure: 提交失败时固定顶部错误条 + 明确错误码。
- Timing guidance:
  - Entry animations: 屏幕入场 160ms，模块错峰 40ms。
  - In-match updates: 3s 刷新节拍 + 10s 聚合一次关键状态。

### 6.6 Responsive and Adaptation Strategy

- Desktop behavior:
  - 三栏主控布局（地图 / 事件 / 贡献与风险）。
- Tablet behavior:
  - 双栏布局，事件流下移到可折叠面板。
- Mobile behavior:
  - 单栏任务优先，地图缩略 + 列表化关键节点。
- Priority downgrades for small screens:
  - 隐藏低优先级装饰纹理与次级统计。
  - 保留必须信息：倒计时、关键节点、主 CTA、结算金额。

### 6.7 Design QA Checklist (Required)

- [x] All P0 screens have design descriptions.
- [x] CTA and state transitions are unambiguous.
- [x] Color/typography/interaction language follow style guide.
- [x] Empty/loading/error states are defined for key screens.
- [x] Design descriptions remain consistent with feature business logic and monetization flow.

### 6.8 Design-to-Implementation Handoff Pack (For $code / $test)

#### Route and Page Mapping

| Route | Screen ID | Purpose | Phase |
|---|---|---|---|
| `/lobby` | S-001 | 房间入场与 buy-in | LobbyReady |
| `/planning` | S-002 | 角色与路线锁定 | Planning |
| `/match` | S-003 | 主循环战术界面 | MatchRunning |
| `/final` | S-004 | 冲刺阶段决策层 | FinalSprint |
| `/settlement` | S-005 | 分账结算与可解释账单 | Settled |

#### Component Breakdown (Execution-ready)

| Component ID | Layer Ownership | Description | Primary Data |
|---|---|---|---|
| `MissionLobbyPanel` | View | 显示节点摘要、奖池来源、入场动作 | `roomSummary`, `nodeDeficitSnapshot` |
| `RoleLockPanel` | View | 角色槽分配与锁定动作 | `teamRoleMap`, `planningCountdown` |
| `NodeMapPanel` | View | 节点 fill_ratio 与关键路径显示 | `nodes[]`, `countdownSec` |
| `ContributionBoard` | View | 队伍和个人贡献排行 | `playerContribution[]`, `teamScore` |
| `RiskHeatPanel` | View | 风险告警与阻塞提示 | `riskMarkers[]` |
| `SettlementBillPanel` | View | 分账流水和成员分配 | `settlementBill`, `memberPayouts[]` |
| `useFuelMissionController` | Controller | 对接 UI 事件与业务用例 | create/join/lock/submit/settle/refresh |

#### Interaction Acceptance Contracts

| IA ID | Trigger | Expected UI Feedback | Data/State Expectation |
|---|---|---|---|
| IA-001 | 点击 `Join Match` | 按钮进入确认态并显示队伍占位更新 | `playerCount +1`, `entry locked` |
| IA-002 | 点击 `Lock Roles & Start` | 角色槽冻结，阶段切换为 Planning/Match | `rolesLocked=true`, `phase` 前进 |
| IA-003 | 提交 `Submit Supply Run` | 节点进度条增长、事件流插入新记录 | `fill_ratio` 增加，贡献值更新 |
| IA-004 | 进入 Final Sprint | 显示冲刺告警层和倍率任务卡 | `phase=FinalSprint`, `remainingSec<=90` |
| IA-005 | 触发结算 | 显示账单流水与个人分配 | `settlementId` 存在且幂等 |
| IA-006 | 数据延迟/失败 | 顶部错误条或 `STALE SNAPSHOT` 标识 | `stale=true` 或明确错误码 |

#### Frontend QA Priority Checklist

- P0 必测：
  - IA-001 ~ IA-006 全通过。
  - 五个关键路由可达、可返回、无死链。
  - 结算页金额与 PRD 分账公式一致。
- P1 补充：
  - AAR 复盘页（S-006）可视化训练建议。
  - 触屏与键盘双端操作一致性。

## 7. Architecture Constraints

- Must follow: docs/architecture.md
- Required layer ownership:
  - View: 仅负责展示与交互采集
  - Controller: 编排用例与流程
  - Service: 业务规则与副作用编排
  - Model (Zustand): 统一状态源与状态迁移

## 8. Contract / Chain Considerations (If Applicable)

- Move module impacts: FuelMission、NodeCheckpoint、ContributionLedger、SettlementReceipt。
- On-chain/off-chain boundary: 上链保存关键补给事件与结算；链下做路径提示和高频 UI 计算。
- Must follow testing standard: docs/sui-devnet-testing-standard.md
- Security and abuse considerations:
  - Replay: 补给提交绑定 mission_id + stage_nonce。
  - Double settlement: 同节点同阶段只能确认一次。
  - Privilege checks: 只有授权服务可写入关键节点状态。

### Contract Feasibility Review (Based on docs/all_contracts.move.txt)

- Feasibility verdict: High（与现有原语契合度高）
- Directly reusable contract primitives:
  - `fuel`：可承载燃料存取与不足校验；
  - `storage_unit + inventory`：可承载物资托管、转运与数量变更事件；
  - `network_node + status`：可表达节点可用状态和网络约束。
- Missing capabilities / required new modules:
  - 缺少玩法级 `FuelMissionState / NodeDeficitSnapshot / MissionScore / ContributionLedger`。
  - 缺少“高风险支线倍率”与“队内贡献加权结算”的专用策略对象。
- P0 delivery boundary:
  - P0 使用现有原语完成资源流与节点状态；
  - 新增轻量玩法模块处理评分、阶段状态、结算映射；
  - 高频路径推荐和难度预测保持索引层/服务层实现。

## 9. Risks and Assumptions

- Assumptions:
  - 使用 Next.js + Tailwind + Zustand + Sui Move 作为默认实现栈。
- Risks:
  - 玩法偏后勤，若反馈弱会显得枯燥。
  - 节点数据延迟会影响判定公平。
- Mitigations:
  - 强化实时视觉反馈与阶段奖励。
  - 对关键判定采用链上最终态 + 链下预估双层机制。

## 9.1 Open Questions

- Q-001: 是否需要按联盟规模动态调整节点数量？
- Q-002: 是否引入新手保护匹配池？

## 10. Release and Validation

- Milestones:
  - M1: 单局闭环；M2: 干扰事件与战报；M3: 实网对局演示
- Validation approach:
  - 每个玩法至少 1 条主流程 + 1 条异常流程通过。
  - 关键结算交易、事件日志和战报互相可追溯。
- Exit criteria:
  - 可完成真实多人对局并输出可验证的演示证据。

## 11. Traceability

| PRD Item | Linked SPEC Section | Linked TODO IDs |
|---|---|---|
| F-002 | 4.2 / 4.3 / 4.4 | T-001 ~ T-00x |
| F-012 | 4.3 / 5.1 | T-01x |
| F-013 | 4.3 / 7 | T-02x |
| F-014 | 4.3 / 5 / 7 | T-03x |

## 12. PM Discussion Log

| Date | User Question Summary | PM Answer Summary | Decision Type | PRD Changes |
|---|---|---|---|---|
| 2026-03-20 | 启用 PM 讨论模式（问答 + 文档同步） | 已启用：PM 问答若影响范围/逻辑/指标/优先级，将在同回合同步更新 PRD | Process | Added discussion-mode workflow and logging requirement |
| 2026-03-20 | 每个 PRD 需要详细阐述赚钱机制并举例 | 已执行：新增 Revenue Mechanism Breakdown + Revenue Example（含结算公式与数字算例） | Logic / Metrics | Updated monetization detail section |
| 2026-03-20 | 全量 PRD 可行性复审（all_contracts.move.txt） + 细化 Core Loop 与 Monetization | 结论：P0 可做，但需“现有合约原语 + 新玩法模块/索引层”组合交付；已补充执行级循环与资金流细节。 | Logic / Scope / Metrics | Added feasibility review + expanded Core Loop Mapping + Monetization notes |
| 2026-03-20 | 细化 Fuel Frog Panic PRD（可执行级） | 已细化角色模型、节点计分公式、阶段状态机、贡献加权分账与 P0 合约落地边界。 | Logic / Scope / Metrics | Expanded F-002 + Core Loop + Monetization + Feasibility detail |
| 2026-03-20 | Fuel Frog Panic：队伍谁创建、平台如何赚钱、玩家为何要玩且是否能赚钱？ | 决策：房间与队伍由 Host/队长在开局前创建并锁定；平台通过每局 rake 与工具服务费盈利；玩家可通过胜负+贡献获得 LUX 收益与信誉成长。 | Logic / Scope / Metrics | Updated Why Players Need + F-002 room/team creation rule + monetization/player earning path |
| 2026-03-20 | 创建队伍后最初奖金池从哪来？ | 决策：基础奖池来自玩家 buy-in，可叠加主办方保底注资、平台活动补贴、赞助池；在开局前统一锁池。 | Logic / Scope / Metrics | Added prize pool funding source + updated settlement formulas/examples |
| 2026-03-20 | global 3-question closure requirement across all PRDs | Enforced explicit answers for: funding source, mission objective, and post-mission distribution in each PRD. | Logic / Scope / Metrics | Added Three Core Questions (Required) section |
| 2026-03-20 | 基于 PRD 直接生成界面设计描述（需对齐 EVE Frontier UI 规范） | 已补充完整 UI 设计描述：屏幕清单、逐屏交互、状态设计、视觉 token 映射、响应式策略与设计 QA 清单。 | UX/UI | Expanded section 6 with 6.1~6.7 |
| 2026-03-20 | 将设计描述转成可执行交付包（供 `$code/$test`） | 已新增路由映射、组件拆分、交互验收合同和前端 QA 优先级清单。 | UX/UI / Process | Added section 6.8 Design-to-Implementation Handoff Pack |
| 2026-03-20 | 路由不使用 `/fuel-frog-panic` 前缀，且当前页面样式异常 | 决策：P0 路由统一使用无前缀路径（`/lobby` 等），旧前缀路由保留兼容跳转；UI 强制校验 Tailwind token 与全局样式链路。 | UX/UI / Process | Updated section 6.8 route mapping and implementation sync notes |

## 12.1 Pending Discussion Items

- D-001: None
