# PRD: Killmail Bingo Ops

## 0. One-Screen Summary (Problem / Why / How)

- Problem it solves: 玩家在 PVP 中目标感弱，缺少可组织的短期协作清单。
- Why this matters now: 战斗目标模糊，队伍行动缺少共同节奏。
- How it solves it (3-step mechanism):
  1. 系统生成本局任务格。
  2. 队伍完成目标事件并点亮格子。
  3. 完成行/列/全图后触发递进奖励。
- Expected player/business outcome: 单局目标明确且可复玩。

## 0.1 Before vs After

| Dimension | Before | After |
|---|---|---|
| Player clarity | 战斗目标模糊，队伍行动缺少共同节奏。 | 单局目标明确且可复玩。 |
| Player outcome | 目标不清、协作效率受限 | 单局目标明确且可复玩。 |
| Business outcome | 复玩率与营收闭环不稳定 | 可验证的玩法闭环与结算闭环 |

## 1. Document Control

- Product Name: Killmail Bingo Ops
- Project/App Path: apps/killmail-bingo-ops
- Version: v1.0
- Status: Draft
- Owner (PM Agent): Codex
- Last Updated: 2026-03-20
- Related Docs:
  - SPEC: apps/killmail-bingo-ops/spec.md
  - TODO: apps/killmail-bingo-ops/todo.md
  - Test Plan: apps/killmail-bingo-ops/test-results/2026-03-20-regression.md
  - Contract Package: apps/killmail-bingo-ops/contracts

## 2. Background and Goal

- Problem Statement:
  - 需要将 Frontier 核心循环（生存、协作、竞争、经济）转化为可快速开局、可复玩、可结算的街机玩法。
  - 玩家在 PVP 中目标感弱，缺少可组织的短期协作清单。
- Target Users:
  - Frontier 玩家（个人与小队）
  - 联盟组织者 / 社区活动发起者
- Product Goal:
  - 交付可在黑客松时限内演示并可继续迭代的玩法闭环。
- Non-Goals:
  - 不做超出黑客松窗口的大型内容系统（如完整赛季运营后台）。
- Strategic Fit (why now for this hackathon/project):
  - killmail 数据天然可验证，技术演示和业务玩法都清晰。

## 2.1 Why Players Need This Product

- 战斗目标模糊，队伍行动缺少共同节奏。
- 击杀成果难以结构化复盘。
- 活动传播素材不足。

## 2.2 Player Segments and JTBD

| Segment | Context | Job-to-be-done | Current Friction |
|---|---|---|---|
| S-001 | PVP 小队 | 围绕清单目标协作完成宾果 | 目标分配不清、进度反馈滞后 |
| S-002 | 社区传播 | 快速产出可分享战报图 | 手工整理成本高 |

## 2.3 Success Metrics and Guardrails

- North Star Metric: 每局点亮宾果格子数
- Primary metrics:
  - M-001: 完成至少一行宾果的对局占比 >= 70%
  - M-002: 战报分享率 >= 25%
- Guardrail metrics:
  - G-001: 重复事件刷格拦截率 = 100%
  - G-002: 错误确认回滚率 < 2%
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
| P0 | Hackathon 72h | 宾果卡生成、事件映射、递进奖励 |
| P1 | Post-hackathon 2-4 weeks | 赛季主题卡池、联盟联赛模式 |

### Out of Scope

- 跨玩法资产深度互通经济系统
- 完整电竞观战回放平台
- 主网正式商业运营法务流程

## 3.1 Dependencies and Constraints

- Internal dependencies: Arcade Hub、Reputation
- External dependencies (API/network/team): killmail 事件源、索引查询
- Critical assumptions: killmail 延迟在可接受范围

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Value Hypothesis | Status |
|---|---|---|---|---|
| F-006 | Killmail Bingo Ops Core Gameplay | P0 | 把击杀事件结构化为宾果目标可提升协作效率和传播效果。 | Implemented (MVP) |
| F-012 | Monetization Engine Integration | P0 | 统一收费与结算规则可降低运营复杂度 | Implemented (MVP) |
| F-013 | Live Frontier Integration | P0 | 实网可运行是评审高权重加分项 | Implemented (devnet test-publish success) |
| F-014 | Reputation & Anti-abuse Integration | P1 | 提升公平性并抑制刷子行为 | Implemented (MVP guardrails) |

## 5. Feature Business Logic

### F-006 Killmail Bingo Ops Core Gameplay

- User Story: 作为小队，我希望通过完成 killmail 组合任务拿到宾果奖励。
- Trigger: 开局抽取宾果卡模板。
- Preconditions: killmail 数据源可读取。
- Task creator and authority (P0):
  - 组合任务模板（宾果卡模板）由平台运营方创建并维护（官方模板池）。
  - 房主（Host）在建房时只能“选择模板池/难度档”，不能在 P0 直接自定义任务条件。
  - 系统在开局时根据已选模板池生成本局卡面（3x3）并锁定 `card_template_id + card_hash`。
  - P1 可开放“社区模板提案”，但需平台审核通过后才可进入可用模板池。
- Card spec (P0):
  - 默认 `3x3` 宾果卡（9 格），用于 10-15 分钟快节奏对局。
  - 格子类型：击杀类型、武器类型、风险区域、连击条件（四类）。
  - 每格带 `slot_weight`（分值权重）与 `verification_rule_id`（核验规则）。
- Main Flow:
1. 开局生成宾果卡并广播到全队，锁定卡片哈希。
2. 玩家触发 killmail 事件后，系统先标记 `Pending`（待核验）。
3. 事件通过 `killmail_registry` 核验后，对应格子从 `Pending -> Confirmed` 点亮。
4. 达成行/列触发阶段奖励，达成全图触发终局倍率奖励。
5. 终局按“点亮格数 + 连线数 + 全图达成”结算奖池。
- Alternative Flow / Exceptions:
- 数据延迟时保留 Pending 状态，不立即给分。
- 无效或冲突事件回滚格子状态并写入审计日志。
- 超时未确认事件不计分但保留在战报“未确认事件”区。
- Postconditions:
  - 生成可查询的对局结果、奖励分配和个人贡献记录。
- Data Rules:
- 同一 `killmail_id` 只能命中一格（禁止多格复用刷分）。
- 每格只能被点亮一次，且必须通过核验规则。
- 开局后 `card_template_id` 与 `card_hash` 不可修改，防止中途换题。
- 点亮分建议公式：
  - `slot_score = slot_weight * confirmation_quality * time_bonus`
  - `team_score = Σ(slot_score) + line_bonus + blackout_bonus`
- 只接受可核验事件源（registry + 索引一致性双检）。
- Error Handling:
  - 非法状态迁移、重复结算、重复领奖一律拒绝。
- Acceptance Criteria:
  - AC-001: 单局目标明确且可复玩。
  - AC-002: 输出可分享战报图与奖励明细。
  - AC-003: 事件核验链路可追踪到 `killmail_id -> slot_id -> settlement_id`。
  - AC-004: 任务创建权责清晰，且模板锁定规则可验证。

### Step-by-step Gameplay User Stories

1. 作为玩家，我想开局看到宾果目标清单。
2. 作为队伍，我想把不同目标分配给不同成员。
3. 作为执行者，我想达成后立刻看到格子点亮。
4. 作为全队，我想根据差一格策略决定是否冒险。
5. 作为胜利方，我想分享战报并领奖。

### Core Loop Mapping

- Entry:
  - 开局抽卡并确认本局 9 格目标、权重与奖励档位。
- Action:
  - 队伍围绕卡面目标进行击杀/协作行为，实时提交事件等待核验。
- Feedback:
  - 格子状态（Pending/Confirmed）、连线提示、剩余关键目标、对手进度。
- Reward:
  - 连线奖励、全图奖励、战报传播素材（可一键分享）。
- Re-engagement trigger:
  - 下一局刷新主题卡池和克制关系，鼓励复玩与战术调整。

#### Loop Execution Detail (Implementation-facing)

- State machine and checkpoints:
  - LobbyReady: 房间参数、卡池与入场费用锁定。
  - CardDrafted: 宾果卡生成并锁定卡哈希。
  - MatchRunning: 事件持续写入，格子状态在 Pending/Confirmed 间迁移。
  - GraceWindow(60s): 仅处理待确认事件，不接受新事件写入。
  - Settled: 奖励与战报固化，禁止回写关键结果。
- Tick cadence and decision rhythm:
  - 建议 2s 前端刷新、8-10s 事件核验节拍。
  - 每个节拍输出：已确认格数、待确认格数、关键连线机会、队伍排名变化。
- Failure and recovery:
  - 玩家掉线：保留队伍进度，个人加权按在线时长折算。
  - 对局异常中断：进入 GraceWindow，仅做 Pending 事件收敛后结算。
  - 争议数据：以可追溯事件源与签名证明为最终依据。
- Observable loop metrics (for PM/Test):
  - loop_completion_rate（开局到结算完成率）
  - pending_to_confirmed_latency_p95（待确认转确认延迟）
  - duplicate_event_reject_rate（重复事件拒绝率）
  - card_blackout_rate（全图达成率）
  - requeue_rate_10m（10 分钟内再开局率）

### Monetization and Economy Notes (If Applicable)

- Monetization touchpoint:
  - 赛事房间 buy-in（主收入）
  - 主题卡池通行证（可选，提供主题任务与展示权益）
  - 联赛房主服务费（组织者工具）
- Pricing / fee logic:
  - Casual 房：低 buy-in + 低 rake，强调参与量。
  - Ranked 房：中 buy-in + 中 rake，强调竞技与奖励。
  - Event 房：中高 buy-in + 主题通行证，强调活动营收。
- Sink/faucet impact:
  - Sink：buy-in 和可选通行证消费。
  - Faucet：`payout_pool` 按达成表现分配，保持“玩得好就更赚”。
  - 通行证收入不直接从玩家奖池扣减，避免体感负收益。
- Anti-abuse rule:
  - 事件去重 + 可疑重复行为风控。
  - 同队短时异常连击和固定对手循环匹配触发风险分。
  - 风控房间只保留基础奖励，不进入高倍率池。
- Simple in-match monetization example:
  1. Ranked 房 8 名玩家，每人 `80 LUX`，`gross_pool = 640`。
  2. 平台费 `10%`，`platform_fee = 64`；`host_revshare = 50%`，`host_fee = 32`。
  3. `payout_pool = 576`，第一名队伍得 60%，第二名得 40%。
  4. 若第一名队伍内两人贡献比 70/30，则队内分配为 `241.92 / 103.68` LUX。


#### Economy Execution Detail (Implementation-facing)

- Cash-flow order (single match):
  1. 入场锁定 `entry_fee_lux`，生成房间奖池账本。
  2. 开局冻结：`platform_rake_bps`、`host_revshare_bps`、`payout_rule_id`、`card_pool_id`。
  3. 终局按确认格子与连线规则计算队伍排名，再做奖池拆分。
  4. 输出账单：`gross_pool / platform_fee / host_fee / payout_pool / rank_payouts`。
- Fee safety rails:
  - `platform_rake_bps <= 1500`（15%）
  - `host_revshare_bps <= 6000`（平台费内最多 60%）
  - 主题通行证加成只影响“展示权益/任务池”，不得影响基础公平结算。
- Abuse and fraud controls:
  - 同地址/同设备高频对冲对局识别（刷分、对刷）。
  - 异常胜率、异常短局、固定对手循环匹配触发降权。
  - 结算必须满足一致性：`card_hash + confirmed_event_set_hash + settlement_hash`。
- Quick example (intuitive):
  - 8 名玩家，每人 80 LUX：`gross_pool = 640`。
  - 平台费 10%：`platform_fee = 64`；主办分成 50%：`host_fee = 32`。
  - 玩家总奖池：`payout_pool = 576`（按排名与队内贡献拆分）。

### Three Core Questions (Required)

- 1. 钱从哪里来？
  - Base pool source: 玩家 buy-in（entry_fee_lux）构成基础奖池（player_buyin_pool）。
  - Optional seed/subsidy/sponsor sources: 可叠加 host_seed_pool / platform_subsidy_pool / sponsor_pool。
  - Pool lock timing: 在开局前锁池（LobbyReady -> MatchRunning 前），开局后不可改。
- 2. 任务是什么？
  - Core mission statement: 围绕宾果卡目标完成可核验 killmail 事件，点亮格子并争取连线/全图。
  - Completion condition: 结算时 confirmed 格数与连线分更高，或达成全图 blackout。
  - Failure condition: 关键格未确认、连线不足且总分落后。
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
  - 设计说明直接维护在本 PRD（`docs/prd/killmail-bingo-ops/prd.md`）。
- Mandatory references:
  - `docs/eve-frontier-ui-style-guide.md`
- Design output quality bar:
  - 评审可在 60 秒内理解核心屏幕目标与关键操作。
  - 每个 P0 屏幕明确 CTA、状态切换与结果反馈。
  - 视觉语言必须映射 EVE Frontier 样式 token，不使用反模式。

### 6.2 Screen Inventory and Information Architecture

| Screen ID | Screen Name | Primary User Goal | Entry Trigger | Exit Trigger | Priority |
|---|---|---|---|---|---|
| S-001 | Tactical Lobby & Match Briefing | 在开局前确认任务卡池、费用与风险，30 秒内入场 | 玩家进入房间或房主创建房间 | 点击 `Initiate Match` 成功并进入对局 | P0 |
| S-002 | Bingo Combat Command Deck | 对局中围绕 3x3 任务卡协作并实时追踪 Pending/Confirmed 进度 | 对局状态进入 `MatchRunning` | 计时结束或触发全图达成进入结算 | P0 |
| S-003 | Event Verification Console | 快速处理待核验事件、回滚事件与争议提示 | S-002 中存在 Pending/冲突事件时展开 | 事件全部处理完毕或用户关闭侧栏 | P0 |
| S-004 | Settlement & Battle Report | 查看分账明细、贡献排名并一键分享战报 | 对局进入 `Settled` | 点击 `Re-Queue` 或 `Share Report` 完成后离开 | P0 |

### 6.3 Screen-by-screen Design Description

#### S-001 Tactical Lobby & Match Briefing

- Screen intent:
  - 让队伍在开局前完成“规则对齐 + 费用确认 + 任务认领”三件事，避免盲开局。
- Layout structure:
  - Top zone:
    - 房间编号、网络状态、倒计时入口条（开局前准备时间）。
  - Core zone:
    - 左栏：3x3 任务卡预览（只读，显示 `slot_weight` 与任务类型）。
    - 中栏：房间参数（buy-in、rake、host 分成、预计 `payout_pool`）。
    - 右栏：队伍席位与角色认领（谁负责哪类目标）。
  - Bottom zone:
    - 主操作条：`Initiate Match`（房主）/ `Ready`（成员）/ `Leave Room`。
- Key UI modules:
  - Mission Card Preview Panel（含任务标签和难度标识）。
  - Fee Breakdown Panel（`gross_pool / platform_fee / host_fee / payout_pool`）。
  - Squad Readiness Matrix（成员就绪状态与职责标签）。
- Primary CTA / Secondary actions:
  - Primary: `Initiate Match`（仅房主可用；所有成员 Ready 后高亮可点）。
  - Secondary: `Ready / Unready`、`Copy Room Code`、`Review Rules`。
- User interaction flow (step-by-step):
1. 玩家进房后先查看任务卡预览与奖励结构。
2. 玩家点击 `Ready` 并在小队面板认领目标类型。
3. 房主确认全员就绪后点击 `Initiate Match`，系统锁定 `card_template_id + card_hash` 并开局。
- Data binding requirements:
  - `roomState`、`playerReadyMap`、`entry_fee_lux`、`platform_rake_bps`、`host_revshare_bps`、`card_template_id`。
- Empty/loading/error states:
  - Empty: 无可用模板时显示 `NO CARD POOL ONLINE`，禁用开局按钮。
  - Loading: 房间配置同步中显示骨架屏 + `SYNCING OPS DATA`。
  - Error: 费用配置拉取失败显示红色告警条并提供 `Retry Sync`。
- Responsive notes:
  - Desktop 三栏并行；Tablet 合并为上下两层（卡面在上）；Mobile 使用分段标签（`Card / Fees / Squad`）避免信息挤压。
- Accessibility notes:
  - 所有关键 CTA 具备可见焦点框（`#E5B32B` 1px）。
  - Fee 面板对数字使用等宽字体并附文本标签，避免仅靠颜色表达。

#### S-002 Bingo Combat Command Deck

- Screen intent:
  - 在高压战斗中持续给出“下一步最有价值动作”，让队伍围绕连线/全图目标协作。
- Layout structure:
  - Top zone:
    - 对局主状态条（剩余时间、阶段、队伍排名变化）。
  - Core zone:
    - 左侧主区：3x3 宾果卡（状态色区分 `Locked/Pending/Confirmed/RolledBack`）。
    - 右上：实时 killmail feed（按核验优先级排序）。
    - 右下：贡献与连线机会雷达（`line_opportunity`、`team_score`）。
  - Bottom zone:
    - 快捷操作条：`Submit Event`、`Open Verification Console`、`Focus Critical Slot`。
- Key UI modules:
  - Tactical Bingo Grid（九宫格 + 连线高亮）。
  - Live Event Feed（事件时间戳、来源、核验状态）。
  - Team Contribution Panel（成员贡献权重与预估分配）。
- Primary CTA / Secondary actions:
  - Primary: `Submit Event`（提交 killmail_id 至待核验队列）。
  - Secondary: `Pin Slot`、`Mute Non-critical Feed`、`Open Verification Console`。
- User interaction flow (step-by-step):
1. 玩家从九宫格识别“差一格”目标并选择优先任务。
2. 触发击杀后提交事件，格子先转 `Pending`。
3. 核验成功时格子转 `Confirmed` 并触发连线提示；失败则回滚并记录原因。
- Data binding requirements:
  - `cardSlots[]`（含 `slot_state`）、`pendingEvents[]`、`confirmedEvents[]`、`teamScore`、`lineBonusState`、`matchTimer`。
- Empty/loading/error states:
  - Empty: 无事件输入时展示 `AWAITING KILLMAIL SIGNAL` 占位区。
  - Loading: 核验处理中显示格子扫描线动画（低频闪烁）。
  - Error: 事件冲突时弹出 `EVENT CONFLICT` 红色警报并给出冲突 ID。
- Responsive notes:
  - Desktop 左主右辅；Tablet 改为上卡面下 feed；Mobile 默认全宽卡面，feed/贡献切换为底部抽屉页签。
- Accessibility notes:
  - 每个格子提供文本状态（Pending/Confirmed）与图标双通道提示。
  - 快捷键：`1-9` 聚焦格子，`V` 打开核验台，`S` 提交事件。

#### S-003 Event Verification Console

- Screen intent:
  - 将“待确认事件”和“争议回滚”流程集中处理，减少主战斗视图噪音。
- Layout structure:
  - Top zone:
    - 核验队列摘要（Pending 数、超时数、冲突数）。
  - Core zone:
    - 左列：待核验列表（按超时风险排序）。
    - 右列：事件详情（`killmail_id -> slot_id` 映射与校验理由）。
  - Bottom zone:
    - 操作按钮：`Confirm`、`Reject`、`Request Recheck`。
- Key UI modules:
  - Pending Queue Table。
  - Verification Detail Card（规则命中、签名来源、索引一致性结果）。
  - Audit Trail Log（回滚与拒绝原因留痕）。
- Primary CTA / Secondary actions:
  - Primary: `Confirm`（满足规则且一致性通过后可用）。
  - Secondary: `Reject`、`Request Recheck`、`Export Audit Row`。
- User interaction flow (step-by-step):
1. 用户从队列点选一条 Pending 事件查看详情。
2. 对照规则结果决定 `Confirm` 或 `Reject`。
3. 系统将结果回写到 S-002 的格子与事件流。
- Data binding requirements:
  - `verificationQueue[]`、`ruleCheckResult`、`indexConsensus`、`auditLog[]`。
- Empty/loading/error states:
  - Empty: 队列为空显示 `NO PENDING EVENTS` 与绿色完成指示。
  - Loading: 打开详情时显示结构化骨架和 `VERIFYING SIGNATURES` 文案。
  - Error: 索引不可达时禁用确认按钮并标记 `INDEX OFFLINE`。
- Responsive notes:
  - Desktop 双列；Tablet 改为主从切换；Mobile 使用全屏抽屉并将操作区固定底部。
- Accessibility notes:
  - 队列表支持键盘上下选择与回车确认。
  - 所有操作按钮附带 aria-label（含事件 ID）。

#### S-004 Settlement & Battle Report

- Screen intent:
  - 在 15 秒内让玩家看懂“为何赢/输”和“钱怎么分”，并鼓励二次开局与分享。
- Layout structure:
  - Top zone:
    - 对局结果横幅（胜负、完成连线、是否全图）。
  - Core zone:
    - 左栏：分账账单（`gross_pool -> platform_fee -> host_fee -> payout_pool`）。
    - 中栏：队伍/个人贡献榜（含贡献权重与实际到账）。
    - 右栏：战报摘要卡（关键事件、高光格子、可分享素材）。
  - Bottom zone:
    - 主操作条：`Re-Queue`、`Share Report`、`View On-chain Receipt`。
- Key UI modules:
  - Settlement Ledger Panel。
  - Contribution Ranking Table。
  - Shareable Battle Report Card（可导出图）。
- Primary CTA / Secondary actions:
  - Primary: `Re-Queue`（带同配置快速再开局）。
  - Secondary: `Share Report`、`Copy Settlement ID`、`Open Receipt`。
- User interaction flow (step-by-step):
1. 玩家先看结果横幅确认本局胜负与达成度。
2. 查看账单与个人到账，理解平台费/主办分成/奖池拆分。
3. 选择一键分享战报或直接再开下一局。
- Data binding requirements:
  - `settlementId`、`grossPool`、`platformFee`、`hostFee`、`payoutPool`、`memberPayouts[]`、`highlightEvents[]`。
- Empty/loading/error states:
  - Empty: 若战报素材生成失败，显示纯文本战报并保留分享链接。
  - Loading: 结算确认中显示 `LOCKING PAYOUT LEDGER` 进度条。
  - Error: 链上回执拉取失败时保留本地账单并提供重试。
- Responsive notes:
  - Desktop 三栏对比展示；Tablet 折叠为“账单/贡献/战报”分段；Mobile 优先展示到账与 CTA，战报细节下沉。
- Accessibility notes:
  - 账单拆分以表格语义输出，可被屏幕阅读器逐列读取。
  - 分享按钮在键盘顺序中位于到账信息之后，符合主任务路径。

### 6.4 Visual Token and Component Mapping (Style-guide Aligned)

- Color token mapping:
  - Primary CTA: `--eve-yellow` / `#E5B32B`
  - Background: `--eve-black` / `#080808`
  - Panel: `--eve-grey` / `#1A1A1A`
  - Warning/Error: `--eve-red` / `#CC3300`
  - Text: `--eve-offwhite` / `#E0E0E0`
- Typography mapping:
  - Headline / Metrics: `JetBrains Mono`（房间号、计时器、分账数字）
  - Body: `Inter Tight`（说明文案与提示）
  - Label / Metadata: uppercase monospace（状态标签、队列标记、slot 类型）
- Component style rules:
  - Buttons:
    - 默认硬边（`border-radius: 0`），主 CTA 使用黄底黑字 + 右下阴影边。
  - Panels:
    - 使用 `rgba(8, 8, 8, 0.85)` + `backdrop-blur`，左侧黄线强调关键模块。
  - Tables/Lists:
    - 行高紧凑，分隔线 `#333`，关键值右对齐并使用等宽数字。
  - Alerts:
    - 红色高对比条 + 大写告警词（`EVENT CONFLICT` / `INDEX OFFLINE`）。
- Explicit anti-patterns to avoid in this product:
  - 圆角卡片化 SaaS 风格。
  - 低对比灰字与弱信息层级。
  - 紫色/粉色渐变和轻松娱乐化动效。

### 6.5 Interaction and Motion Description

- Hover/Active feedback:
  - Hover 提升亮度到 off-white 边界；Active 使用 `translateY(1px)` 提供机械按压反馈。
- Transition style:
  - 以短线性过渡为主（120-180ms），避免弹性曲线。
- Critical event feedback:
  - Success:
    - 格子 `Pending -> Confirmed` 时触发一次黄线脉冲并写入 feed。
  - Warning:
    - Pending 超时触发橙红边框闪烁，每 8 秒提醒一次。
  - Failure:
    - 冲突/回滚时格子回退并显示红色 strike-through 叠层。
- Timing guidance:
  - Entry animations:
    - 屏幕首次进入分区级渐显（80ms stagger），总时长 < 400ms。
  - In-match updates:
    - 事件流实时插入，关键分值/连线变化以 200ms 高亮补帧，不阻塞操作。

### 6.6 Responsive and Adaptation Strategy

- Desktop behavior:
  - 主信息面板并行展示（卡面 + 队列 + 分账），适合指挥位多信息判断。
- Tablet behavior:
  - 采用两段式布局，保留卡面实时可见，次级信息折叠为可展开模块。
- Mobile behavior:
  - 以“任务卡 + 主 CTA”优先；事件流、贡献榜、审计日志改为底部标签页。
- Priority downgrades for small screens:
  - 降级项：装饰性网格背景、次级统计图、完整审计文本默认折叠。
  - 保留项：任务状态、主计时器、主 CTA、到账结果。

### 6.7 Design QA Checklist (Required)

- [x] All P0 screens have design descriptions.
- [x] CTA and state transitions are unambiguous.
- [x] Color/typography/interaction language follow style guide.
- [x] Empty/loading/error states are defined for key screens.
- [x] Design descriptions remain consistent with feature business logic and monetization flow.

## 7. Architecture Constraints

- Must follow: docs/architecture.md
- Required layer ownership:
  - View: 仅负责展示与交互采集
  - Controller: 编排用例与流程
  - Service: 业务规则与副作用编排
  - Model (Zustand): 统一状态源与状态迁移

## 8. Contract / Chain Considerations (If Applicable)

- Move module impacts: BingoCardState、EventMarkProof、RewardLedger。
- On-chain/off-chain boundary: 链上确认关键事件与奖励；链下执行卡面渲染和提示。
- Must follow testing standard: docs/sui-devnet-testing-standard.md
- Security and abuse considerations:
  - Replay: 事件确认绑定 event_id + card_id。
  - Double settlement: 格子点亮为单次状态迁移。
  - Privilege checks: 仅授权索引校验服务可写入确认。

### Contract Feasibility Review (Based on docs/all_contracts.move.txt)

- Feasibility verdict: High（事件基础最完整）
- Directly reusable contract primitives:
  - `killmail` 与 `killmail_registry`：可作为事件真实性与唯一性证据源；
  - `access_control`：可约束房间创建与结算提交权限；
  - `object_registry`：可用于卡片对象与房间对象的确定性索引。
- Missing capabilities / required new modules:
  - 缺少 `BingoCardState / EventToSlotMatcher / BingoSettlement`；
  - 缺少“Pending -> Confirmed -> RolledBack”格子状态迁移对象；
  - 缺少面向反合谋的链上标记与风控接口。
- P0 delivery boundary:
  - 链上实现事件命中、卡面状态与结算；
  - 主题卡渲染、分享海报、高级推荐保持链下；
  - 合谋检测先在索引层落地，P1 再考虑链上化摘要证据。

## 9. Risks and Assumptions

- Assumptions:
  - 使用 Next.js + Tailwind + Zustand + Sui Move 作为默认实现栈。
- Risks:
  - 事件延迟影响体验连贯。
  - 高频战斗下数据噪音增加。
- Mitigations:
  - 前端先展示“待确认”状态减少焦虑。
  - 建立事件置信分和回滚策略。

## 9.1 Open Questions

- Q-001: 是否需要按武器类型设定主题卡池？
- Q-002: 是否支持联盟自定义宾果模板？

## 10. Release and Validation

- Milestones:
  - M1: 卡片闭环；M2: 战报分享；M3: 联赛模式预研
- Validation approach:
  - 每个玩法至少 1 条主流程 + 1 条异常流程通过。
  - 关键结算交易、事件日志和战报互相可追溯。
- Exit criteria:
  - 可完成真实多人对局并输出可验证的演示证据。

## 11. Traceability

| PRD Item | Linked SPEC Section | Linked TODO IDs |
|---|---|---|
| F-006 | 4.2 / 4.3 / 4.4 | T-001,T-002,T-003,T-004,T-007,T-008,T-010,T-012,T-022,T-024 |
| F-012 | 4.3 / 5.1 | T-005,T-009,T-011,T-017,T-022,T-024 |
| F-013 | 4.3 / 4.5 / 7 | T-004,T-014,T-016,T-017,T-018,T-019,T-020,T-021,T-022,T-023,T-024 |
| F-014 | 4.3 / 5 / 7 | T-006,T-008,T-009,T-018,T-023,T-024 |

## 12. PM Discussion Log

| Date | User Question Summary | PM Answer Summary | Decision Type | PRD Changes |
|---|---|---|---|---|
| 2026-03-20 | 启用 PM 讨论模式（问答 + 文档同步） | 已启用：PM 问答若影响范围/逻辑/指标/优先级，将在同回合同步更新 PRD | Process | Added discussion-mode workflow and logging requirement |
| 2026-03-20 | 每个 PRD 需要详细阐述赚钱机制并举例 | 已执行：新增 Revenue Mechanism Breakdown + Revenue Example（含结算公式与数字算例） | Logic / Metrics | Updated monetization detail section |
| 2026-03-20 | 全量 PRD 可行性复审（all_contracts.move.txt） + 细化 Core Loop 与 Monetization | 结论：P0 可做，但需“现有合约原语 + 新玩法模块/索引层”组合交付；已补充执行级循环与资金流细节。 | Logic / Scope / Metrics | Added feasibility review + expanded Core Loop Mapping + Monetization notes |
| 2026-03-20 | 细化 Killmail Bingo Ops PRD（可执行级） | 已细化卡片规格、事件核验链路、格子状态机、排名分账和反合谋边界。 | Logic / Scope / Metrics | Expanded F-006 + Core Loop + Monetization + Feasibility detail |
| 2026-03-20 | Killmail 组合任务由谁创建？ | 决策：P0 由平台运营方创建并维护模板池；房主仅可选模板池/难度；开局锁定模板与卡哈希。 | Logic / Scope | Updated task creator authority + template lock rule + AC-004 |
| 2026-03-20 | global 3-question closure requirement across all PRDs | Enforced explicit answers for: funding source, mission objective, and post-mission distribution in each PRD. | Logic / Scope / Metrics | Added Three Core Questions (Required) section |
| 2026-03-20 | 设计 killmail-bingo-ops 前端界面（Design 模式） | 已补齐 P0 屏幕清单、逐屏交互/状态、视觉 token 映射、响应式与设计 QA。 | Scope (Design) | Added section 6.1-6.7 UI design description |

## 12.1 Pending Discussion Items

- D-001: None
