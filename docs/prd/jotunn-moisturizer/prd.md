# PRD: Jotunn Moisturizer

## 0. One-Screen Summary (Problem / Why / How)

- Problem it solves: 社区需要“有梗但不空洞”的协作活动，增强日常参与感。
- Why this matters now: 活动玩法同质化，缺少记忆点。
- How it solves it (3-step mechanism):
  1. 玩家提交水冰与指定资源。
  2. 巨神状态分阶段变化并触发奖励。
  3. 达标后发放团队 buff 与收益。
- Expected player/business outcome: 活动具备明显传播梗点和可视化反馈。

## 0.1 Before vs After

| Dimension | Before | After |
|---|---|---|
| Player clarity | 活动玩法同质化，缺少记忆点。 | 活动具备明显传播梗点和可视化反馈。 |
| Player outcome | 目标不清、协作效率受限 | 活动具备明显传播梗点和可视化反馈。 |
| Business outcome | 复玩率与营收闭环不稳定 | 可验证的玩法闭环与结算闭环 |

## 1. Document Control

- Product Name: Jotunn Moisturizer
- Project/App Path: apps/frontier-arcade-hub (proposed)
- Version: v1.0
- Status: Draft
- Owner (PM Agent): Codex
- Last Updated: 2026-03-20
- Related Docs:
  - SPEC: docs/spec/jotunn-moisturizer/spec.md (planned)
  - TODO: docs/todo/jotunn-moisturizer/todo.md (planned)
  - Test Plan: docs/test-plan/jotunn-moisturizer/test-plan.md (planned)

## 2. Background and Goal

- Problem Statement:
  - 需要将 Frontier 核心循环（生存、协作、竞争、经济）转化为可快速开局、可复玩、可结算的街机玩法。
  - 社区需要“有梗但不空洞”的协作活动，增强日常参与感。
- Target Users:
  - Frontier 玩家（个人与小队）
  - 联盟组织者 / 社区活动发起者
- Product Goal:
  - 交付可在黑客松时限内演示并可继续迭代的玩法闭环。
- Non-Goals:
  - 不做超出黑客松窗口的大型内容系统（如完整赛季运营后台）。
- Strategic Fit (why now for this hackathon/project):
  - 符合 Weirdest + Creative 维度，同时具备明确经济激励。

## 2.1 Why Players Need This Product

- 活动玩法同质化，缺少记忆点。
- 资源提交缺少阶段反馈，参与成就感不足。
- 玩家很难判断自己的贡献价值。

## 2.2 Player Segments and JTBD

| Segment | Context | Job-to-be-done | Current Friction |
|---|---|---|---|
| S-001 | 休闲协作玩家 | 参与有梗活动并获得稳定收益 | 反馈弱、奖励不透明、活动复开频率低 |
| S-002 | 社区运营者 | 用低成本玩法提高活跃和传播 | 活动素材和规则每次都要重做 |

## 2.3 Success Metrics and Guardrails

- North Star Metric: 活动参与人数 / 场
- Primary metrics:
  - M-001: 阶段目标达成率 >= 70%
  - M-002: 活动分享率（战报外链）>= 20%
- Guardrail metrics:
  - G-001: 资源刷提交拦截率 = 100%
  - G-002: 奖励争议率 < 1%
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
| P0 | Hackathon 72h | 资源提交、阶段奖励、活动结算 |
| P1 | Post-hackathon 2-4 weeks | 吉祥物成长线、主题周活动 |

### Out of Scope

- 跨玩法资产深度互通经济系统
- 完整电竞观战回放平台
- 主网正式商业运营法务流程

## 3.1 Dependencies and Constraints

- Internal dependencies: Arcade Hub、Reputation
- External dependencies (API/network/team): 资源状态读取、活动事件广播
- Critical assumptions: 活动期间资源供给可支撑目标阈值

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Value Hypothesis | Status |
|---|---|---|---|---|
| F-004 | Jotunn Moisturizer Core Gameplay | P0 | 梗文化+协作目标+阶段奖励可显著提升活动传播和复开率。 | Planned |
| F-012 | Monetization Engine Integration | P0 | 统一收费与结算规则可降低运营复杂度 | Planned |
| F-013 | Live Frontier Integration | P0 | 实网可运行是评审高权重加分项 | Planned |
| F-014 | Reputation & Anti-abuse Integration | P1 | 提升公平性并抑制刷子行为 | Planned |

## 5. Feature Business Logic

### F-004 Jotunn Moisturizer Core Gameplay

- User Story: 作为玩家，我希望通过给巨神喂水冰完成协作并换取奖励。
- Trigger: 周期活动开启后玩家进入活动房间。
- Preconditions: 玩家持有可提交资源。
- Main Flow:
1. 玩家提交水冰与指定资源。
2. 巨神状态分阶段变化并触发奖励。
3. 达标后发放团队 buff 与收益。
- Alternative Flow / Exceptions:
- 提交不足则活动失败，仅返还部分积分。
- 超时未达标进入冷却周期。
- Postconditions:
  - 生成可查询的对局结果、奖励分配和个人贡献记录。
- Data Rules:
- 奖励池按阶段阈值释放，不允许一次性提空。
- 单地址提交频率受限并记录行为画像。
- Error Handling:
  - 非法状态迁移、重复结算、重复领奖一律拒绝。
- Acceptance Criteria:
  - AC-001: 活动具备明显传播梗点和可视化反馈。
  - AC-002: 奖励和贡献可追溯且防刷有效。

### Step-by-step Gameplay User Stories

1. 作为玩家，我想先看到本轮活动目标与所需资源。
2. 作为队伍成员，我想快速分配采集和运输分工。
3. 作为提交者，我想在每次提交后看到阶段进度变化。
4. 作为团队，我想在达标瞬间获得明确奖励反馈。
5. 作为回归玩家，我想在下一轮继续累计成长收益。

### Core Loop Mapping

- Entry: 查看巨神当前状态和目标。
- Action: 提交资源推进阶段进度。
- Feedback: 阶段条、特效、团队贡献榜。
- Reward: 阶段奖励、buff、活动战报。
- Re-engagement trigger: 下一轮刷新目标与限时加成。

#### Loop Execution Detail (Implementation-facing)

- State machine and checkpoints:
  - LobbyReady: 房间参数、队伍、入场费用锁定。
  - MatchRunning: 主循环推进，持续写入关键进度事件。
  - GraceWindow: 允许提交最后一笔有效动作/证据。
  - Settled: 奖励与战报固化，禁止回写关键结果。
- Tick cadence and decision rhythm:
  - 建议 5-10s 一个状态刷新节拍（前端渲染可更高频，结算判定按节拍收敛）。
  - 每个节拍至少输出：进度值、风险值、队伍贡献 Top 指标。
- Failure and recovery:
  - 玩家掉线：进入托管/冻结窗口，不立即判负。
  - 对局异常中断：进入 GraceWindow，按最后有效快照结算或回滚。
  - 争议数据：仅接受带签名或链上事件可追溯的数据作为终态依据。
- Observable loop metrics (for PM/Test):
  - loop_completion_rate（开局到结算完成率）
  - avg_loop_duration（单局平均时长）
  - mid_match_drop_rate（中途退出率）
  - requeue_rate_10m（10 分钟内再开局率）

### Monetization and Economy Notes (If Applicable)

- Monetization touchpoint: 活动通行证/加速道具（可选）+报名费房间。
- Pricing / fee logic: 基础免费参与，竞技档位付费入场。
- Sink/faucet impact: 付费项进入奖池或活动金库；奖励按阶段发放。
- Anti-abuse rule: 提交频率限制 + 异常资源来源校验。


#### Economy Execution Detail (Implementation-facing)

- Cash-flow order (single match):
  1. 入场时锁定 entry_fee_lux（或等价 buy-in）。
  2. 开局后冻结奖池参数：platform_rake_bps、host_revshare_bps、payout_rule_id。
  3. 终局先扣平台费，再做主办方分成，再按规则发放玩家奖励。
  4. 生成可审计账单：gross_pool / platform_fee / host_fee / payout_pool。
- Fee safety rails:
  - platform_rake_bps 建议上限 <= 1500（15%）。
  - host_revshare_bps 建议上限 <= 6000（平台费内最多 60% 分给主办方）。
  - 任何超上限配置在建房阶段直接拒绝。
- Abuse and fraud controls:
  - 同地址/同设备高频对冲对局识别（刷分、对刷）。
  - 异常胜率和异常短局自动降权，不进入高奖励池。
  - 结算必须满足事件一致性（开局参数哈希 + 终局结果哈希）。
- Quick example (intuitive):
  - 8 名玩家，每人 80 LUX：gross_pool = 640。
  - 平台费 10%：platform_fee = 64。
  - 主办分成 50%（来自平台费）：host_fee = 32。
  - 玩家总奖池：payout_pool = 576。

### Three Core Questions (Required)

- 1. 钱从哪里来？
  - Base pool source: 玩家 buy-in（entry_fee_lux）构成基础奖池（player_buyin_pool）。
  - Optional seed/subsidy/sponsor sources: 可叠加 host_seed_pool / platform_subsidy_pool / sponsor_pool。
  - Pool lock timing: 在开局前锁池（LobbyReady -> MatchRunning 前），开局后不可改。
- 2. 任务是什么？
  - Core mission statement: 协作提交水冰资源推进巨神阶段目标并触发阶段奖励。
  - Completion condition: 在时限内完成阶段推进并达成更高团队分。
  - Failure condition: 资源提交不足导致阶段卡死或终局分落后。
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

## 7. Architecture Constraints

- Must follow: docs/architecture.md
- Required layer ownership:
  - View: 仅负责展示与交互采集
  - Controller: 编排用例与流程
  - Service: 业务规则与副作用编排
  - Model (Zustand): 统一状态源与状态迁移

## 8. Contract / Chain Considerations (If Applicable)

- Move module impacts: EventStageState、ContributionLog、RewardVault。
- On-chain/off-chain boundary: 上链记录阶段达成与奖励；链下承载高频动画和提示。
- Must follow testing standard: docs/sui-devnet-testing-standard.md
- Security and abuse considerations:
  - Replay: 提交事件绑定 stage_nonce 与玩家地址。
  - Double settlement: 同阶段奖励领取标记一次性。
  - Privilege checks: 阶段推进仅允许授权路径写入。

### Contract Feasibility Review (Based on docs/all_contracts.move.txt)

- Feasibility verdict: Medium-High（协作补给可做）
- Directly reusable contract primitives: inventory/storage_unit 可处理“水冰类资源”提交，status 可表达阶段状态。
- Missing capabilities / required new modules: 缺少“巨神进度条/阶段奖励”专用对象，需要新增 BossProgress/StageReward。
- P0 delivery boundary: 提交与消耗沿用库存原语，阶段推进和奖励分发表做新模块。

## 9. Risks and Assumptions

- Assumptions:
  - 使用 Next.js + Tailwind + Zustand + Sui Move 作为默认实现栈。
- Risks:
  - 若视觉反馈不强，玩法会显得重复。
  - 资源门槛设置不当会劝退新手。
- Mitigations:
  - 优先实现阶段特效与团队榜单反馈。
  - 设置新手档与高阶档双轨目标。

## 9.1 Open Questions

- Q-001: 是否允许跨联盟共享阶段进度？
- Q-002: 活动 buff 是否影响其他玩法平衡？

## 10. Release and Validation

- Milestones:
  - M1: 阶段系统；M2: 战报和榜单；M3: 周期复开机制
- Validation approach:
  - 每个玩法至少 1 条主流程 + 1 条异常流程通过。
  - 关键结算交易、事件日志和战报互相可追溯。
- Exit criteria:
  - 可完成真实多人对局并输出可验证的演示证据。

## 11. Traceability

| PRD Item | Linked SPEC Section | Linked TODO IDs |
|---|---|---|
| F-004 | 4.2 / 4.3 / 4.4 | T-001 ~ T-00x |
| F-012 | 4.3 / 5.1 | T-01x |
| F-013 | 4.3 / 7 | T-02x |
| F-014 | 4.3 / 5 / 7 | T-03x |

## 12. PM Discussion Log

| Date | User Question Summary | PM Answer Summary | Decision Type | PRD Changes |
|---|---|---|---|---|
| 2026-03-20 | 启用 PM 讨论模式（问答 + 文档同步） | 已启用：PM 问答若影响范围/逻辑/指标/优先级，将在同回合同步更新 PRD | Process | Added discussion-mode workflow and logging requirement |
| 2026-03-20 | 每个 PRD 需要详细阐述赚钱机制并举例 | 已执行：新增 Revenue Mechanism Breakdown + Revenue Example（含结算公式与数字算例） | Logic / Metrics | Updated monetization detail section |
| 2026-03-20 | 全量 PRD 可行性复审（all_contracts.move.txt） + 细化 Core Loop 与 Monetization | 结论：P0 可做，但需“现有合约原语 + 新玩法模块/索引层”组合交付；已补充执行级循环与资金流细节。 | Logic / Scope / Metrics | Added feasibility review + expanded Core Loop Mapping + Monetization notes |

| 2026-03-20 | global 3-question closure requirement across all PRDs | Enforced explicit answers for: funding source, mission objective, and post-mission distribution in each PRD. | Logic / Scope / Metrics | Added Three Core Questions (Required) section |

## 12.1 Pending Discussion Items

- D-001: None
