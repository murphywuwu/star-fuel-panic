# PRD: King of Toll Hill

## 0. One-Screen Summary (Problem / Why / How)

- Problem it solves: 玩家对收费点控制有强对抗需求，但缺少短平快且可结算的竞技模式。
- Why this matters now: 现有对抗玩法开局成本高，难以快速组织。
- How it solves it (3-step mechanism):
  1. 队伍争夺控制点并维持占领时长。
  2. 系统动态计算控制值与冲突事件。
  3. 结束后执行奖池分配并抽取 rake。
- Expected player/business outcome: 支持 2v2 与 4v4 两种核心模式。

## 0.1 Before vs After

| Dimension | Before | After |
|---|---|---|
| Player clarity | 现有对抗玩法开局成本高，难以快速组织。 | 支持 2v2 与 4v4 两种核心模式。 |
| Player outcome | 目标不清、协作效率受限 | 支持 2v2 与 4v4 两种核心模式。 |
| Business outcome | 复玩率与营收闭环不稳定 | 可验证的玩法闭环与结算闭环 |

## 1. Document Control

- Product Name: King of Toll Hill
- Project/App Path: apps/frontier-arcade-hub (proposed)
- Version: v1.0
- Status: Draft
- Owner (PM Agent): Codex
- Last Updated: 2026-03-20
- Related Docs:
  - SPEC: docs/spec/king-of-toll-hill/spec.md (planned)
  - TODO: docs/todo/king-of-toll-hill/todo.md (planned)
  - Test Plan: docs/test-plan/king-of-toll-hill/test-plan.md (planned)

## 2. Background and Goal

- Problem Statement:
  - 需要将 Frontier 核心循环（生存、协作、竞争、经济）转化为可快速开局、可复玩、可结算的街机玩法。
  - 玩家对收费点控制有强对抗需求，但缺少短平快且可结算的竞技模式。
- Target Users:
  - Frontier 玩家（个人与小队）
  - 联盟组织者 / 社区活动发起者
- Product Goal:
  - 交付可在黑客松时限内演示并可继续迭代的玩法闭环。
- Non-Goals:
  - 不做超出黑客松窗口的大型内容系统（如完整赛季运营后台）。
- Strategic Fit (why now for this hackathon/project):
  - 直接承接官方 buy-in + rake 方向，业务价值和评审价值都高。

## 2.1 Why Players Need This Product

- 现有对抗玩法开局成本高，难以快速组织。
- 控制点收益分配不透明，争议多。
- 缺少可审计的奖池分润机制。

## 2.2 Player Segments and JTBD

| Segment | Context | Job-to-be-done | Current Friction |
|---|---|---|---|
| S-001 | PVP 小队冲分 | 在短局中通过控点获得胜利与收益 | 规则复杂、收益不清晰、匹配效率低 |
| S-002 | 活动组织者办赛事 | 复用标准规则快速开赛并自动结算 | 人工结算容易出错，运营成本高 |

## 2.3 Success Metrics and Guardrails

- North Star Metric: 控点对局完成数（含结算）
- Primary metrics:
  - M-001: 2v2 和 4v4 模式完赛率 >= 90%
  - M-002: 自动结算成功率 >= 99%
- Guardrail metrics:
  - G-001: 平局争议率 < 2%
  - G-002: 重复领奖事件数 = 0
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
| P0 | Hackathon 72h | 控点争夺、加时规则、奖池结算 |
| P1 | Post-hackathon 2-4 weeks | 多地图轮换、赛季积分和段位 |

### Out of Scope

- 跨玩法资产深度互通经济系统
- 完整电竞观战回放平台
- 主网正式商业运营法务流程

## 3.1 Dependencies and Constraints

- Internal dependencies: Arcade Hub、Monetization、Reputation
- External dependencies (API/network/team): 实时房间广播、链上结算服务
- Critical assumptions: 对战同步延迟控制在可接受范围

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Value Hypothesis | Status |
|---|---|---|---|---|
| F-003 | King of Toll Hill Core Gameplay | P0 | 可审计控点对抗 + 自动分润能成为最易商业化的高复玩模式。 | Planned |
| F-012 | Monetization Engine Integration | P0 | 统一收费与结算规则可降低运营复杂度 | Planned |
| F-013 | Live Frontier Integration | P0 | 实网可运行是评审高权重加分项 | Planned |
| F-014 | Reputation & Anti-abuse Integration | P1 | 提升公平性并抑制刷子行为 | Planned |

## 5. Feature Business Logic

### F-003 King of Toll Hill Core Gameplay

- User Story: 作为队伍，我希望争夺收费控制点并获得收益分成。
- Trigger: 发起 KOTH 对局并配置 buy-in 与 rake。
- Preconditions: 至少两支队伍完成入场。
- Main Flow:
1. 队伍争夺控制点并维持占领时长。
2. 系统动态计算控制值与冲突事件。
3. 结束后执行奖池分配并抽取 rake。
- Alternative Flow / Exceptions:
- 并列时触发加时赛。
- 中途异常可按规则部分回滚。
- Postconditions:
  - 生成可查询的对局结果、奖励分配和个人贡献记录。
- Data Rules:
- rake 公式固定且链上可审计。
- 占领时长与得分事件绑定同一状态快照。
- Error Handling:
  - 非法状态迁移、重复结算、重复领奖一律拒绝。
- Acceptance Criteria:
  - AC-001: 支持 2v2 与 4v4 两种核心模式。
  - AC-002: 结算明细对玩家可见且可追溯。

### Step-by-step Gameplay User Stories

1. 作为队长，我想在开局前确认买入和队伍配置。
2. 作为前线玩家，我想实时看到控点进度条。
3. 作为支援玩家，我想根据战况进行机动支援。
4. 作为全队成员，我想在平分时进入加时继续争夺。
5. 作为赢家队伍，我想看到清晰分润并即时领奖。

### Core Loop Mapping

- Entry: 加入控点对局。
- Action: 压点、转点、协作防守与反打。
- Feedback: 进度条、比分、加时提示。
- Reward: 奖池分配、排名提升、声望收益。
- Re-engagement trigger: 下一局地图轮换与更高 buy-in 房间。

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

- Monetization touchpoint: 每局 buy-in + 平台 rake。
- Pricing / fee logic: 按房间档位配置入场费与 rake。
- Sink/faucet impact: 买入形成奖池，胜方按规则分配。
- Anti-abuse rule: 异常同队反复对刷检测；可疑局冻结二次核验。


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
  - Core mission statement: 争夺并维持收费控制点，在时限内累计更高控点收益。
  - Completion condition: 终局控点收益与比分领先。
  - Failure condition: 控点持续失守、加时赛失利。
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

- Move module impacts: ControlPointState、MatchLedger、PrizePool、SettlementReceipt。
- On-chain/off-chain boundary: 上链记录比分关键节点和结算；链下处理实时战斗 UI。
- Must follow testing standard: docs/sui-devnet-testing-standard.md
- Security and abuse considerations:
  - Replay: 结算交易包含唯一 match_digest。
  - Double settlement: Receipt 消费后不可重复领取。
  - Privilege checks: 仅房间授权地址可提交终局结果。

### Contract Feasibility Review (Based on docs/all_contracts.move.txt)

- Feasibility verdict: Medium（对抗结算可做，控点规则需新增）
- Directly reusable contract primitives: gate/network_node/status 可映射控点状态，access_control 可约束房间操作。
- Missing capabilities / required new modules: 无原生“占领计时/加时赛/分润规则”模块，需要新增 ControlTimer/PrizeSplitRule。
- P0 delivery boundary: 关键比分快照与终局结算上链；实时占点细节链下聚合。

## 9. Risks and Assumptions

- Assumptions:
  - 使用 Next.js + Tailwind + Zustand + Sui Move 作为默认实现栈。
- Risks:
  - 高对抗下易出现同步争议。
  - 高 buy-in 房间可能引发作弊动机。
- Mitigations:
  - 关键判定以链上终态为准并保留回放摘要。
  - 引入信誉阈值和异常对局审计。

## 9.1 Open Questions

- Q-001: 是否需要分区匹配以降低延迟？
- Q-002: 加时规则是否按地图动态调整？

## 10. Release and Validation

- Milestones:
  - M1: 2v2 闭环；M2: 4v4 + 加时；M3: 实网赛事演示
- Validation approach:
  - 每个玩法至少 1 条主流程 + 1 条异常流程通过。
  - 关键结算交易、事件日志和战报互相可追溯。
- Exit criteria:
  - 可完成真实多人对局并输出可验证的演示证据。

## 11. Traceability

| PRD Item | Linked SPEC Section | Linked TODO IDs |
|---|---|---|
| F-003 | 4.2 / 4.3 / 4.4 | T-001 ~ T-00x |
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
