# PRD: Heat Route Rush

## 0. One-Screen Summary (Problem / Why / How)

- Problem it solves: 玩家在航线规划中缺少可竞赛化、可复盘的机制。
- Why this matters now: 路线选择凭经验，缺少量化反馈。
- How it solves it (3-step mechanism):
  1. 队伍提交并执行路线计划。
  2. 系统计算热度、燃料、距离综合成本。
  3. 按总耗时与总成本进行排名结算。
- Expected player/business outcome: 可清晰展示路线策略差异。

## 0.1 Before vs After

| Dimension | Before | After |
|---|---|---|
| Player clarity | 路线选择凭经验，缺少量化反馈。 | 可清晰展示路线策略差异。 |
| Player outcome | 目标不清、协作效率受限 | 可清晰展示路线策略差异。 |
| Business outcome | 复玩率与营收闭环不稳定 | 可验证的玩法闭环与结算闭环 |

## 1. Document Control

- Product Name: Heat Route Rush
- Project/App Path: apps/frontier-arcade-hub (proposed)
- Version: v1.0
- Status: Draft
- Owner (PM Agent): Codex
- Last Updated: 2026-03-20
- Related Docs:
  - SPEC: docs/spec/heat-route-rush/spec.md (planned)
  - TODO: docs/todo/heat-route-rush/todo.md (planned)
  - Test Plan: docs/test-plan/heat-route-rush/test-plan.md (planned)

## 2. Background and Goal

- Problem Statement:
  - 需要将 Frontier 核心循环（生存、协作、竞争、经济）转化为可快速开局、可复玩、可结算的街机玩法。
  - 玩家在航线规划中缺少可竞赛化、可复盘的机制。
- Target Users:
  - Frontier 玩家（个人与小队）
  - 联盟组织者 / 社区活动发起者
- Product Goal:
  - 交付可在黑客松时限内演示并可继续迭代的玩法闭环。
- Non-Goals:
  - 不做超出黑客松窗口的大型内容系统（如完整赛季运营后台）。
- Strategic Fit (why now for this hackathon/project):
  - 可突出 Frontier 物流深度与 Sui 低成本高频交互优势。

## 2.1 Why Players Need This Product

- 路线选择凭经验，缺少量化反馈。
- 热区与燃料约束复杂，试错成本高。
- 赛后难以系统复盘。

## 2.2 Player Segments and JTBD

| Segment | Context | Job-to-be-done | Current Friction |
|---|---|---|---|
| S-001 | 导航/后勤玩家 | 在约束下找到最优路线并赢下竞速 | 信息散、反馈慢、缺少复盘工具 |
| S-002 | 团队指挥 | 评估不同路线策略收益 | 缺少可比较的数据记录 |

## 2.3 Success Metrics and Guardrails

- North Star Metric: 平均路线效率分（耗时+燃料综合）
- Primary metrics:
  - M-001: 有效完赛率 >= 85%
  - M-002: 复盘日志查看率 >= 60%
- Guardrail metrics:
  - G-001: 非法坐标拦截率 = 100%
  - G-002: 路径伪造判定误伤率 < 1%
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
| P0 | Hackathon 72h | 路线提交、热区约束、排名结算 |
| P1 | Post-hackathon 2-4 weeks | 策略回放、联盟路线赛 |

### Out of Scope

- 跨玩法资产深度互通经济系统
- 完整电竞观战回放平台
- 主网正式商业运营法务流程

## 3.1 Dependencies and Constraints

- Internal dependencies: Arcade Hub
- External dependencies (API/network/team): 地图热度数据、路径验证服务
- Critical assumptions: 热度数据更新频率满足对局需要

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Value Hypothesis | Status |
|---|---|---|---|---|
| F-008 | Heat Route Rush Core Gameplay | P0 | 把物流策略显性化可提升高阶玩家参与和教学传播价值。 | Planned |
| F-012 | Monetization Engine Integration | P0 | 统一收费与结算规则可降低运营复杂度 | Planned |
| F-013 | Live Frontier Integration | P0 | 实网可运行是评审高权重加分项 | Planned |
| F-014 | Reputation & Anti-abuse Integration | P1 | 提升公平性并抑制刷子行为 | Planned |

## 5. Feature Business Logic

### F-008 Heat Route Rush Core Gameplay

- User Story: 作为航线团队，我希望在热区和燃料限制下跑出最优路线。
- Trigger: 竞速赛开启。
- Preconditions: 路线图与热度参数加载完成。
- Main Flow:
1. 队伍提交并执行路线计划。
2. 系统计算热度、燃料、距离综合成本。
3. 按总耗时与总成本进行排名结算。
- Alternative Flow / Exceptions:
- 高热区触发随机干扰事件。
- 路径超限或违规则判罚。
- Postconditions:
  - 生成可查询的对局结果、奖励分配和个人贡献记录。
- Data Rules:
- 排名基于可验证路径日志。
- 无效坐标或伪造路径直接判无效。
- Error Handling:
  - 非法状态迁移、重复结算、重复领奖一律拒绝。
- Acceptance Criteria:
  - AC-001: 可清晰展示路线策略差异。
  - AC-002: 赛后可输出可读复盘日志。

### Step-by-step Gameplay User Stories

1. 作为玩家，我想在开局前看到热区与燃料约束。
2. 作为导航手，我想提出候选路线并估算风险。
3. 作为队伍，我想在执行中根据热度变化改线。
4. 作为参赛者，我想实时看到排名和耗能差距。
5. 作为复盘者，我想赛后导出路径日志。

### Core Loop Mapping

- Entry: 查看地图并制定路线。
- Action: 执行路径并处理干扰。
- Feedback: 实时排名、耗能、风险预警。
- Reward: 排名奖励、策略评分、复盘数据。
- Re-engagement trigger: 挑战更高难度热区地图。

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

- Monetization touchpoint: 高阶竞速房间买入。
- Pricing / fee logic: 按地图难度分档收费。
- Sink/faucet impact: 买入汇总奖池，按排名分配。
- Anti-abuse rule: 路径日志签名校验 + 异常路线检测。


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
  - Core mission statement: 在热区与燃料限制下完成最优航线任务并控制风险。
  - Completion condition: 在时限内完成更多高价值航段并保持燃料效率。
  - Failure condition: 航段中断、燃料策略失败导致总分落后。
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

- Move module impacts: RouteCommitment、RouteProof、RaceSettlement。
- On-chain/off-chain boundary: 链上保存路线承诺与结算，链下完成实时导航建议。
- Must follow testing standard: docs/sui-devnet-testing-standard.md
- Security and abuse considerations:
  - Replay: 路线提交绑定 race_id + player_nonce。
  - Double settlement: 同一提交只计一次成绩。
  - Privilege checks: 裁定接口仅授权服务可调用。

### Contract Feasibility Review (Based on docs/all_contracts.move.txt)

- Feasibility verdict: Medium-High（路线与资源可做）
- Directly reusable contract primitives: location、fuel、network_node 支持路线约束、燃料消耗和节点状态。
- Missing capabilities / required new modules: “热区风险值/最优路线评价”不是链上现成字段，需要索引与仿真服务。
- P0 delivery boundary: 链上只固化关键节点通过与资源消耗，热区评分链下计算并回写摘要。

## 9. Risks and Assumptions

- Assumptions:
  - 使用 Next.js + Tailwind + Zustand + Sui Move 作为默认实现栈。
- Risks:
  - 高约束地图可能导致挫败感。
  - 干扰事件过多会降低可控性。
- Mitigations:
  - 提供难度分层与新手地图。
  - 限制干扰频率并可解释。

## 9.1 Open Questions

- Q-001: 是否支持队伍共享路线草稿？
- Q-002: 复盘数据是否开放给第三方工具？

## 10. Release and Validation

- Milestones:
  - M1: 排名闭环；M2: 复盘日志；M3: 高阶地图
- Validation approach:
  - 每个玩法至少 1 条主流程 + 1 条异常流程通过。
  - 关键结算交易、事件日志和战报互相可追溯。
- Exit criteria:
  - 可完成真实多人对局并输出可验证的演示证据。

## 11. Traceability

| PRD Item | Linked SPEC Section | Linked TODO IDs |
|---|---|---|
| F-008 | 4.2 / 4.3 / 4.4 | T-001 ~ T-00x |
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
