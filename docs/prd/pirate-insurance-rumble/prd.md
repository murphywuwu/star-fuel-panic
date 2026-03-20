# PRD: Pirate Insurance Rumble

## 0. One-Screen Summary (Problem / Why / How)

- Problem it solves: 高风险对抗门槛高，新玩家因“全损恐惧”不敢参与。
- Why this matters now: 高风险玩法容错率低，劝退新手。
- How it solves it (3-step mechanism):
  1. 玩家选择保险档位并入局。
  2. 对抗结束后触发赔付或奖分结算。
  3. 信誉系统记录风险行为影响后续条件。
- Expected player/business outcome: 风险回报机制清晰且可审计。

## 0.1 Before vs After

| Dimension | Before | After |
|---|---|---|
| Player clarity | 高风险玩法容错率低，劝退新手。 | 风险回报机制清晰且可审计。 |
| Player outcome | 目标不清、协作效率受限 | 风险回报机制清晰且可审计。 |
| Business outcome | 复玩率与营收闭环不稳定 | 可验证的玩法闭环与结算闭环 |

## 1. Document Control

- Product Name: Pirate Insurance Rumble
- Project/App Path: apps/frontier-arcade-hub (proposed)
- Version: v1.0
- Status: Draft
- Owner (PM Agent): Codex
- Last Updated: 2026-03-20
- Related Docs:
  - SPEC: docs/spec/pirate-insurance-rumble/spec.md (planned)
  - TODO: docs/todo/pirate-insurance-rumble/todo.md (planned)
  - Test Plan: docs/test-plan/pirate-insurance-rumble/test-plan.md (planned)

## 2. Background and Goal

- Problem Statement:
  - 需要将 Frontier 核心循环（生存、协作、竞争、经济）转化为可快速开局、可复玩、可结算的街机玩法。
  - 高风险对抗门槛高，新玩家因“全损恐惧”不敢参与。
- Target Users:
  - Frontier 玩家（个人与小队）
  - 联盟组织者 / 社区活动发起者
- Product Goal:
  - 交付可在黑客松时限内演示并可继续迭代的玩法闭环。
- Non-Goals:
  - 不做超出黑客松窗口的大型内容系统（如完整赛季运营后台）。
- Strategic Fit (why now for this hackathon/project):
  - 保险机制天然连接风险控制与经济系统，商业价值明确。

## 2.1 Why Players Need This Product

- 高风险玩法容错率低，劝退新手。
- 赔付规则不透明容易引发不信任。
- 缺少可量化风险回报模型。

## 2.2 Player Segments and JTBD

| Segment | Context | Job-to-be-done | Current Friction |
|---|---|---|---|
| S-001 | 高风险玩家 | 在可控风险下参与刺激对抗 | 赔付规则不透明、结果不可预期 |
| S-002 | 新玩家 | 通过保险降低首局心理门槛 | 看不懂风险档位差异 |

## 2.3 Success Metrics and Guardrails

- North Star Metric: 保险参赛转化率
- Primary metrics:
  - M-001: 投保入局率 >= 50%
  - M-002: 结算满意度 >= 4/5
- Guardrail metrics:
  - G-001: 重复理赔拦截率 = 100%
  - G-002: 理赔争议率 < 2%
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
| P0 | Hackathon 72h | 保险档位、入局、赔付结算 |
| P1 | Post-hackathon 2-4 weeks | 动态保费、信誉联动定价 |

### Out of Scope

- 跨玩法资产深度互通经济系统
- 完整电竞观战回放平台
- 主网正式商业运营法务流程

## 3.1 Dependencies and Constraints

- Internal dependencies: Arcade Hub、Reputation、Monetization
- External dependencies (API/network/team): 风险事件源、赔付审计
- Critical assumptions: 风险事件可结构化上链

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Value Hypothesis | Status |
|---|---|---|---|---|
| F-011 | Pirate Insurance Rumble Core Gameplay | P0 | 可审计保险机制能降低参与门槛并提升高风险玩法活跃。 | Planned |
| F-012 | Monetization Engine Integration | P0 | 统一收费与结算规则可降低运营复杂度 | Planned |
| F-013 | Live Frontier Integration | P0 | 实网可运行是评审高权重加分项 | Planned |
| F-014 | Reputation & Anti-abuse Integration | P1 | 提升公平性并抑制刷子行为 | Planned |

## 5. Feature Business Logic

### F-011 Pirate Insurance Rumble Core Gameplay

- User Story: 作为风险玩家，我希望购买保险后参与高风险对抗并获得赔付或盈利。
- Trigger: 对赌局创建。
- Preconditions: 参赛者完成保费支付。
- Main Flow:
1. 玩家选择保险档位并入局。
2. 对抗结束后触发赔付或奖分结算。
3. 信誉系统记录风险行为影响后续条件。
- Alternative Flow / Exceptions:
- 异常中断按保险条款部分赔付。
- 欺诈信号触发风控拦截并复核。
- Postconditions:
  - 生成可查询的对局结果、奖励分配和个人贡献记录。
- Data Rules:
- 赔付上限、免赔规则、冷却期公开且版本化。
- 重复理赔与循环套利必须拦截。
- Error Handling:
  - 非法状态迁移、重复结算、重复领奖一律拒绝。
- Acceptance Criteria:
  - AC-001: 风险回报机制清晰且可审计。
  - AC-002: 新手可在低档位完成首局体验。

### Step-by-step Gameplay User Stories

1. 作为玩家，我想在入场前比较保险档位风险回报。
2. 作为参赛者，我想确认保费生效后再入局。
3. 作为对抗玩家，我想专注战斗而非纠结规则。
4. 作为结算参与者，我想知道本局是赔付还是盈利分配。
5. 作为长期玩家，我想让信誉影响我下一局保险条件。

### Core Loop Mapping

- Entry: 选择保险档位并投保。
- Action: 参与高风险对抗。
- Feedback: 风险提示、档位权益、理赔进度。
- Reward: 赔付/盈利、信誉变化、档位解锁。
- Re-engagement trigger: 挑战更高风险档位。

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

- Monetization touchpoint: 保费 + 房间买入。
- Pricing / fee logic: 按风险档位分层定价。
- Sink/faucet impact: 保费沉淀风险池，赔付按规则释放。
- Anti-abuse rule: 反作弊引擎识别异常理赔路径。


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
  - Core mission statement: 选择保险档位后参与高风险对抗，按事件触发赔付或收益分成。
  - Completion condition: 满足保单条件并在结算中获得净收益。
  - Failure condition: 触发不利风险事件且未满足赔付条件。
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

- Move module impacts: InsurancePolicy、RiskEventProof、ClaimSettlement。
- On-chain/off-chain boundary: 链上保单与赔付结算，链下风险评分与风控模型。
- Must follow testing standard: docs/sui-devnet-testing-standard.md
- Security and abuse considerations:
  - Replay: 理赔提交绑定 policy_id + event_digest。
  - Double settlement: 同保单同事件不可重复理赔。
  - Privilege checks: 赔付审批权限最小化。

### Contract Feasibility Review (Based on docs/all_contracts.move.txt)

- Feasibility verdict: Medium-Low（金融逻辑需新建）
- Directly reusable contract primitives: killmail 可作为部分理赔触发信号，access_control 可实现保单权限。
- Missing capabilities / required new modules: 无保单、费率、精算、理赔模块；需新增 InsurancePolicy/ClaimSettlement/RiskBand。
- P0 delivery boundary: 只做固定档位保费与简单赔付规则，复杂动态费率放 P1。

## 9. Risks and Assumptions

- Assumptions:
  - 使用 Next.js + Tailwind + Zustand + Sui Move 作为默认实现栈。
- Risks:
  - 保费过高会抑制参与。
  - 赔付过宽会导致系统亏损。
- Mitigations:
  - 分层档位并动态调价。
  - 引入信誉加权和冷却期。

## 9.1 Open Questions

- Q-001: 是否支持联盟团体保单？
- Q-002: 是否允许部分自动理赔？

## 10. Release and Validation

- Milestones:
  - M1: 投保闭环；M2: 理赔风控；M3: 动态定价
- Validation approach:
  - 每个玩法至少 1 条主流程 + 1 条异常流程通过。
  - 关键结算交易、事件日志和战报互相可追溯。
- Exit criteria:
  - 可完成真实多人对局并输出可验证的演示证据。

## 11. Traceability

| PRD Item | Linked SPEC Section | Linked TODO IDs |
|---|---|---|
| F-011 | 4.2 / 4.3 / 4.4 | T-001 ~ T-00x |
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
