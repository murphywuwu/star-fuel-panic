# PRD: Arcade Core Hub

## 0. One-Screen Summary (Problem / Why / How)

- Problem it solves: 当前 10 个玩法缺少统一入口与统一结算，导致学习成本高、组队链路长、复玩率低。
- Why this matters now: 玩家不想在多个入口反复切换，导致组队和开局耗时。
- How it solves it (3-step mechanism):
  1. 创建房间并配置玩法参数。
  2. 玩家入场后房间状态切换为 active。
  3. 结束后执行统一结算并生成战报。
- Expected player/business outcome: 10 个玩法均可复用同一房间与结算框架。

## 0.1 Before vs After

| Dimension | Before | After |
|---|---|---|
| Player clarity | 玩家不想在多个入口反复切换，导致组队和开局耗时。 | 10 个玩法均可复用同一房间与结算框架。 |
| Player outcome | 目标不清、协作效率受限 | 10 个玩法均可复用同一房间与结算框架。 |
| Business outcome | 复玩率与营收闭环不稳定 | 可验证的玩法闭环与结算闭环 |

## 1. Document Control

- Product Name: Arcade Core Hub
- Project/App Path: apps/frontier-arcade-hub (proposed)
- Version: v1.0
- Status: Draft
- Owner (PM Agent): Codex
- Last Updated: 2026-03-20
- Related Docs:
  - SPEC: docs/spec/arcade-core-hub/spec.md (planned)
  - TODO: docs/todo/arcade-core-hub/todo.md (planned)
  - Test Plan: docs/test-plan/arcade-core-hub/test-plan.md (planned)

## 2. Background and Goal

- Problem Statement:
  - 需要将 Frontier 核心循环（生存、协作、竞争、经济）转化为可快速开局、可复玩、可结算的街机玩法。
  - 当前 10 个玩法缺少统一入口与统一结算，导致学习成本高、组队链路长、复玩率低。
- Target Users:
  - Frontier 玩家（个人与小队）
  - 联盟组织者 / 社区活动发起者
- Product Goal:
  - 交付可在黑客松时限内演示并可继续迭代的玩法闭环。
- Non-Goals:
  - 不做超出黑客松窗口的大型内容系统（如完整赛季运营后台）。
- Strategic Fit (why now for this hackathon/project):
  - 作为黑客松演示底座，Hub 能同时支撑 Utility、Technical 和 Live Integration 三个评分维度。

## 2.1 Why Players Need This Product

- 玩家不想在多个入口反复切换，导致组队和开局耗时。
- 房间、匹配、结算规则不统一，队友难以协同。
- 战报和排名分散，长期参与激励不足。

## 2.2 Player Segments and JTBD

| Segment | Context | Job-to-be-done | Current Friction |
|---|---|---|---|
| S-001 | 个人或小队玩家想快速开局 | 在 30 秒内找到可玩的房间并完成入场 | 入口分散、规则不一致、等待时间不可预期 |
| S-002 | 社区组织者发起活动 | 低成本创建比赛并复用统一结算 | 每次活动重复搭建流程，运营成本高 |

## 2.3 Success Metrics and Guardrails

- North Star Metric: 每日有效对局数（完成结算的房间）
- Primary metrics:
  - M-001: 房间创建到开局中位耗时 <= 60 秒
  - M-002: 完成结算率 >= 95%
- Guardrail metrics:
  - G-001: 重复结算事件数 = 0
  - G-002: 异常退出导致的资金争议率 < 1%
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
| P0 | Hackathon 72h | 统一大厅、建房、匹配、统一结算、基础战报 |
| P1 | Post-hackathon 2-4 weeks | 赛季排行榜、房间模板、活动运营后台 |

### Out of Scope

- 跨玩法资产深度互通经济系统
- 完整电竞观战回放平台
- 主网正式商业运营法务流程

## 3.1 Dependencies and Constraints

- Internal dependencies: Monetization Engine、Reputation 模块、通用状态管理
- External dependencies (API/network/team): 钱包连接、链上事件索引、Stillness 接入
- Critical assumptions: Hackathon 期间网络可支撑至少 20 并发房间

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Value Hypothesis | Status |
|---|---|---|---|---|
| F-001 | Arcade Core Hub Core Gameplay | P0 | 统一入口可显著降低开局摩擦，并提升多人玩法复玩率与活动承载能力。 | Planned |
| F-012 | Monetization Engine Integration | P0 | 统一收费与结算规则可降低运营复杂度 | Planned |
| F-013 | Live Frontier Integration | P0 | 实网可运行是评审高权重加分项 | Planned |
| F-014 | Reputation & Anti-abuse Integration | P1 | 提升公平性并抑制刷子行为 | Planned |

## 5. Feature Business Logic

### F-001 Arcade Core Hub Core Gameplay

- User Story: 作为玩家，我希望在一个入口完成建房、入场、开局和结算。
- Trigger: 玩家进入 Arcade 页面并点击创建或快速加入。
- Preconditions: 钱包已连接；满足玩法入场条件；房间参数合法。
- Main Flow:
1. 创建房间并配置玩法参数。
2. 玩家入场后房间状态切换为 active。
3. 结束后执行统一结算并生成战报。
- Alternative Flow / Exceptions:
- 超时未满员自动解散并按规则退款。
- 玩家断线按托管或判负规则处理，确保结算可继续。
- Postconditions:
  - 生成可查询的对局结果、奖励分配和个人贡献记录。
- Data Rules:
- 房间状态必须遵循 created -> active -> settled -> closed 的单向状态机。
- 每局仅允许一次结算凭证，重复提交直接拒绝。
- Error Handling:
  - 非法状态迁移、重复结算、重复领奖一律拒绝。
- Acceptance Criteria:
  - AC-001: 10 个玩法均可复用同一房间与结算框架。
  - AC-002: 关键流程可在 Stillness 进行真实玩家演示。

### Step-by-step Gameplay User Stories

1. 作为玩家，我想在同一大厅快速筛选可玩房间。
2. 作为队长，我想一键建房并邀请队友。
3. 作为参赛者，我想在开局前确认规则和奖池。
4. 作为对局玩家，我想实时看到局内进度和贡献。
5. 作为结束后的玩家，我想立即查看结算并领奖。

### Core Loop Mapping

- Entry: 进入大厅并选择玩法。
- Action: 建房/入房并完成多人对局。
- Feedback: 实时状态、积分、贡献、风险提示。
- Reward: 结算奖励、排名、战报。
- Re-engagement trigger: 推荐下一局房间与队友复组。

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

- Monetization touchpoint: 统一收取报名费、结算奖池、抽取 rake。
- Pricing / fee logic: 支持固定 buy-in + 百分比 rake。
- Sink/faucet impact: 买入为 sink，奖励为 faucet；由结算引擎控制平衡。
- Anti-abuse rule: 同地址短时高频建房限流；异常房间标记人工复核。


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
  - Core mission statement: 完成所选玩法房间的开局-对局-结算闭环，并输出可审计战报。
  - Completion condition: 房间对局完成并产生可追溯结算与奖励发放。
  - Failure condition: 房间流程中断、结算失败或战报不可追溯。
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

- Move module impacts: RoomRegistry、MatchState、SettlementReceipt、LeaderboardSnapshot。
- On-chain/off-chain boundary: 上链记录关键状态和资金结算；链下处理高频临时 UI 状态和匹配队列。
- Must follow testing standard: docs/sui-devnet-testing-standard.md
- Security and abuse considerations:
  - Replay: 结算交易绑定唯一房间 ID + nonce。
  - Double settlement: SettlementReceipt 一次性消费。
  - Privilege checks: 仅授权 Controller/Service 调用结算入口。

### Contract Feasibility Review (Based on docs/all_contracts.move.txt)

- Feasibility verdict: Medium-High（平台骨架可做）
- Directly reusable contract primitives: access_control、character、object_registry、status 可支撑身份、对象索引与状态约束。
- Missing capabilities / required new modules: 缺少通用 RoomRegistry/MatchState/SettlementReceipt 模块，需要新增 Hub 级 Move 模块。
- P0 delivery boundary: P0 以“房间参数上链 + 关键结果上链 + 结算上链”为边界，匹配队列与高频 UI 保持链下。

## 9. Risks and Assumptions

- Assumptions:
  - 使用 Next.js + Tailwind + Zustand + Sui Move 作为默认实现栈。
- Risks:
  - 统一框架初期复杂度高，容易拖慢迭代。
  - 多玩法并发下状态同步压力上升。
- Mitigations:
  - 先实现最小闭环（建房-开局-结算），再扩展可选能力。
  - 对热点状态做分层缓存与事件节流。

## 9.1 Open Questions

- Q-001: 房间跨时区活动是否需要预约机制？
- Q-002: 排行榜是否需要反刷权重模型？

## 10. Release and Validation

- Milestones:
  - M1: Hub 闭环可跑；M2: 接入 3 个核心玩法；M3: 接入全部玩法并完成实网演示
- Validation approach:
  - 每个玩法至少 1 条主流程 + 1 条异常流程通过。
  - 关键结算交易、事件日志和战报互相可追溯。
- Exit criteria:
  - 可完成真实多人对局并输出可验证的演示证据。

## 11. Traceability

| PRD Item | Linked SPEC Section | Linked TODO IDs |
|---|---|---|
| F-001 | 4.2 / 4.3 / 4.4 | T-001 ~ T-00x |
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
