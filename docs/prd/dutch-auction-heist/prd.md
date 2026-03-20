# PRD: Dutch Auction Heist

## 0. One-Screen Summary (Problem / Why / How)

- Problem it solves: 玩家希望经济博弈不止于“出价”，而是结合行动协作。
- Why this matters now: 传统拍卖缺少团队协作参与感。
- How it solves it (3-step mechanism):
  1. 价格按时间递减。
  2. 队伍择机竞拍并成交。
  3. 成交后完成护送获取额外收益。
- Expected player/business outcome: 可演示经济决策与协作执行两段价值。

## 0.1 Before vs After

| Dimension | Before | After |
|---|---|---|
| Player clarity | 传统拍卖缺少团队协作参与感。 | 可演示经济决策与协作执行两段价值。 |
| Player outcome | 目标不清、协作效率受限 | 可演示经济决策与协作执行两段价值。 |
| Business outcome | 复玩率与营收闭环不稳定 | 可验证的玩法闭环与结算闭环 |

## 1. Document Control

- Product Name: Dutch Auction Heist
- Project/App Path: apps/frontier-arcade-hub (proposed)
- Version: v1.0
- Status: Draft
- Owner (PM Agent): Codex
- Last Updated: 2026-03-20
- Related Docs:
  - SPEC: docs/spec/dutch-auction-heist/spec.md (planned)
  - TODO: docs/todo/dutch-auction-heist/todo.md (planned)
  - Test Plan: docs/test-plan/dutch-auction-heist/test-plan.md (planned)

## 2. Background and Goal

- Problem Statement:
  - 需要将 Frontier 核心循环（生存、协作、竞争、经济）转化为可快速开局、可复玩、可结算的街机玩法。
  - 玩家希望经济博弈不止于“出价”，而是结合行动协作。
  - 拍卖对象不是“空气价格”，而是可兑现的稀缺补给货单与其优先提货权（成交后必须通过护送任务把价值落地）。
- Target Users:
  - Frontier 玩家（个人与小队）
  - 联盟组织者 / 社区活动发起者
- Product Goal:
  - 交付可在黑客松时限内演示并可继续迭代的玩法闭环。
- Non-Goals:
  - 不做超出黑客松窗口的大型内容系统（如完整赛季运营后台）。
- Strategic Fit (why now for this hackathon/project):
  - 能够同时展示链上经济机制与多人协作执行。

## 2.1 Why Players Need This Product

- 传统拍卖缺少团队协作参与感。
- 价格决策缺少风险反馈。
- 成交后价值实现路径单一。

## 2.2 Player Segments and JTBD

| Segment | Context | Job-to-be-done | Current Friction |
|---|---|---|---|
| S-001 | 经济型玩家 | 在价格窗口中做出最优出价并兑现收益 | 信息不对称、出价时机难把握 |
| S-002 | 协作小队 | 竞拍后完成护送并拿到额外收益 | 护送风险高，分工不清 |

## 2.3 Success Metrics and Guardrails

- North Star Metric: 有效成交并成功护送的场次占比
- Primary metrics:
  - M-001: 成交率 >= 75%
  - M-002: 护送成功率 >= 60%
- Guardrail metrics:
  - G-001: 重复出价结算拦截率 = 100%
  - G-002: 超时签名失败率 < 3%
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
| P0 | Hackathon 72h | 降价拍卖、成交确认、护送结算 |
| P1 | Post-hackathon 2-4 weeks | 多标的并行拍卖、联盟车队模式 |

### Out of Scope

- 跨玩法资产深度互通经济系统
- 完整电竞观战回放平台
- 主网正式商业运营法务流程

## 3.1 Dependencies and Constraints

- Internal dependencies: Arcade Hub、Monetization
- External dependencies (API/network/team): 拍卖索引、路径风险状态、缺货指数服务（由链上库存事件聚合）
- Critical assumptions: 拍卖参数可实时同步到房间；P0 缺货清单由索引服务计算并喂给房间，而非合约直接返回“全局缺货列表”

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Value Hypothesis | Status |
|---|---|---|---|---|
| F-010 | Dutch Auction Heist Core Gameplay | P0 | “竞拍+护送”双阶段设计能把经济决策转化为团队玩法。 | Planned |
| F-012 | Monetization Engine Integration | P0 | 统一收费与结算规则可降低运营复杂度 | Planned |
| F-013 | Live Frontier Integration | P0 | 实网可运行是评审高权重加分项 | Planned |
| F-014 | Reputation & Anti-abuse Integration | P1 | 提升公平性并抑制刷子行为 | Planned |

## 5. Feature Business Logic

### F-010 Dutch Auction Heist Core Gameplay

- User Story: 作为团队，我希望在降价拍卖中争夺补给并完成护送。
- What is being auctioned:
  - 一份稀缺补给货单（`AuctionLot`）的优先提货权与结算权，而非纯装饰性道具。
  - 成交即获得该货单的执行资格，并进入护送阶段以兑现最终收益。
- Who creates the auction:
  - 默认由主办方/房主（Host）创建拍卖局，并提交 8 类配置对象。
  - 运营方可通过权限模型开放“自定义房间创建”，但必须受 `Permissions` 与风控阈值约束。
- Relation to team play:
  - 拍卖决定“谁拿到货单执行权”，组队决定“能否把货单安全兑现为最终收益”。
  - 建议以队伍为竞拍主体（队长提交出价），成交后由同队执行护送分工（护航、侦察、拦截）。
- Trigger: 拍卖局创建。
- Preconditions: 拍卖标的与起始参数锁定。
- Auction room creation checklist (required):
  - `AuctionRoom`：房间基础信息（room_id、创建者、开始时间、持续时长、状态机）。
  - `AuctionLotEscrow`：拍卖标的托管对象（标的类型、数量、保底价/起拍价、归属证明）。
  - `PriceCurveConfig`：荷兰拍卖价格曲线参数（start_price、reserve_price、decay_mode、decay_interval）。
  - `EntryAndEligibility`：入场与资格规则（entry_fee_lux、队伍规模、是否白名单、信誉阈值）。
  - `SettlementPolicy`：结算策略（platform_rake_bps、host_revshare_bps、payout_rule_id）。
  - `EscortMissionConfig`：护送阶段参数（路线模板、风险事件、成功条件、超时条件）。
  - `Permissions`：权限模型（创建者、运营方、可取消条件、可修改窗口）。
  - `AuditEvents`：审计事件（AuctionCreated、BidPlaced、AuctionSettled、EscortResolved）。
- Main Flow:
1. 价格按时间递减。
2. 队伍择机竞拍并成交。
3. 成交后完成护送获取额外收益。
- Alternative Flow / Exceptions:
- 流拍触发保底回收。
- 护送失败仅保留部分收益。
- Postconditions:
  - 生成可查询的对局结果、奖励分配和个人贡献记录。
- Data Rules:
- 价格曲线函数固定且公开。
- 出价与结算凭证必须去重。
- 稀缺补给货单来源规则（P0）：基于链上 `ItemMinted/ItemBurned/ItemDeposited/ItemWithdrawn` 事件与库存快照聚合得到 `shortage_score`，按阈值入选 `AuctionLot`。
- 现有合约快照不提供“全局缺货清单”单一查询接口；缺货判定属于索引层计算逻辑。
- Error Handling:
  - 非法状态迁移、重复结算、重复领奖一律拒绝。
- Acceptance Criteria:
  - AC-001: 可演示经济决策与协作执行两段价值。
  - AC-002: 成交、护送、奖励链路可审计。
  - AC-003: 拍卖局创建时必须完整生成并校验上述 8 类配置对象。

### Step-by-step Gameplay User Stories

1. 作为玩家，我想观察价格曲线决定出手时机。
2. 作为队伍，我想提前约定出价上限和护送路线。
3. 作为竞拍者，我想成交后立即确认资产归属。
4. 作为护送队伍，我想按分工保护高价值货物。
5. 作为获胜方，我想在护送完成后领取额外收益。

### Core Loop Mapping

- Entry: 查看拍卖标的与价格曲线。
- Action: 出价成交并执行护送。
- Feedback: 实时价格、竞争态势、护送风险。
- Reward: 成交收益 + 护送加成。
- Re-engagement trigger: 下一场更高价值标的拍卖。

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

- Monetization touchpoint:
  - 入场买入（entry_fee_lux）
  - 成交后平台手续费（platform_rake_bps）
  - 主办方分成（host_revshare_bps，来自平台手续费内部，不侵占玩家奖池）
- Pricing / fee logic:
  - 基础房间：低 buy-in + 低 rake（适合拉新）
  - 高价值房间：高 buy-in + 中等 rake（提高单场营收）
  - 手续费建议区间：`platform_rake_bps = 600 ~ 1200`（6%~12%）
- Sink/faucet impact:
  - Sink：手续费从总奖池抽取，进入平台收入池（并按规则分给主办方）
  - Faucet：`payout_pool` 回流给玩家（竞拍成功并完成护送的一方/队伍）
  - 通过“护送成功加成”提高留存与复玩，形成交易量增长
- Anti-abuse rule:
  - 同队/同地址短时高频互刷检测（wash-trade pattern）
  - 异常房间（极低时长、异常高胜率、重复对手）触发风控降权
  - 结算必须满足 `AuctionSettled + EscortResolved` 双事件一致性
- Simple in-match monetization example:
  1. 8 名玩家进入一局，每人买入 `80 LUX`，则 `gross_pool = 640 LUX`。
  2. 平台费率 `10%`，则 `platform_fee = 64 LUX`；主办方分成 `50%`，则 `host_fee = 32 LUX`。
  3. 玩家奖池 `payout_pool = 576 LUX`；若冠军队 70%、亚军队 30%，则分别 `403.2 LUX` 和 `172.8 LUX`。
  4. 平台净收入 `32 LUX`，主办方收入 `32 LUX`，玩家侧可感知为“赢了有肉、平台有抽成、主办有动力开局”。


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
  - Core mission statement: 在降价拍卖中拿下补给货单执行权，并完成护送兑现收益。
  - Completion condition: 竞拍成交且护送成功，获得更高结算收益。
  - Failure condition: 流拍或护送失败导致收益显著下降。
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

- Move module impacts: AuctionState、BidReceipt、EscortOutcome、SettlementLedger。
- On-chain/off-chain boundary: 链上处理成交和结算；链下做价格可视化与路径提示。
- Must follow testing standard: docs/sui-devnet-testing-standard.md
- Security and abuse considerations:
  - Replay: 成交绑定 auction_id + bid_digest。
  - Double settlement: 同一成交不能重复领取。
  - Privilege checks: 拍卖参数修改权限隔离。

### Contract Feasibility Review (Based on docs/all_contracts.move.txt)

- Feasibility verdict: Medium（经济原语可复用，拍卖引擎需新增）
- Directly reusable contract primitives: inventory 事件与 storage_unit 可用于标的托管与稀缺度信号采集。
- Missing capabilities / required new modules: 没有原生 Dutch Auction、出价簿、护送结算模块；“全局缺货榜”需索引层计算。
- P0 delivery boundary: 实现最小拍卖房间 + 结算策略上链；缺货指数由索引服务提供。

## 9. Risks and Assumptions

- Assumptions:
  - 使用 Next.js + Tailwind + Zustand + Sui Move 作为默认实现栈。
- Risks:
  - 价格节奏不合理会影响参与度。
  - 护送失败率过高会挫伤积极性。
- Mitigations:
  - 分档价格曲线并做 A/B 参数测试。
  - 提供风险提示与新手护送缓冲。

## 9.1 Open Questions

- Q-001: 是否支持团队联合出价？
- Q-002: 护送失败惩罚比例是否动态？
- Q-003: P1 是否需要新增链上市场/订单簿模块，把“缺货指数”部分上链以降低索引信任假设？

## 10. Release and Validation

- Milestones:
  - M1: 成交闭环；M2: 护送加成；M3: 多标的模式
- Validation approach:
  - 每个玩法至少 1 条主流程 + 1 条异常流程通过。
  - 关键结算交易、事件日志和战报互相可追溯。
- Exit criteria:
  - 可完成真实多人对局并输出可验证的演示证据。

## 11. Traceability

| PRD Item | Linked SPEC Section | Linked TODO IDs |
|---|---|---|
| F-010 | 4.2 / 4.3 / 4.4 | T-001 ~ T-00x |
| F-012 | 4.3 / 5.1 | T-01x |
| F-013 | 4.3 / 7 | T-02x |
| F-014 | 4.3 / 5 / 7 | T-03x |

## 12. PM Discussion Log

| Date | User Question Summary | PM Answer Summary | Decision Type | PRD Changes |
|---|---|---|---|---|
| 2026-03-20 | 启用 PM 讨论模式（问答 + 文档同步） | 已启用：PM 问答若影响范围/逻辑/指标/优先级，将在同回合同步更新 PRD | Process | Added discussion-mode workflow and logging requirement |
| 2026-03-20 | 每个 PRD 需要详细阐述赚钱机制并举例 | 已执行：新增 Revenue Mechanism Breakdown + Revenue Example（含结算公式与数字算例） | Logic / Metrics | Updated monetization detail section |
| 2026-03-20 | Dutch Auction Heist 的拍卖局需要创建什么？ | 决策：拍卖局创建采用 8 项配置清单（房间、标的托管、价格曲线、资格、结算、护送、权限、审计事件）。 | Logic / Scope | Updated `F-010` creation checklist + added `AC-003` |
| 2026-03-20 | 拍卖到底在拍卖什么问题？ | 澄清：拍卖标的是“稀缺补给货单的优先提货权”，成交后通过护送任务兑现价值，解决“只出价不落地”的玩法空心化问题。 | Logic | Updated problem statement + `F-010` auctioned object definition |
| 2026-03-20 | 拍卖的是什么、谁创建、和组队关系是什么？ | 澄清：拍卖标的是货单执行权；默认由 Host 创建；组队用于成交后护送兑现收益，竞拍与执行形成双阶段协作。 | Logic | Updated `F-010` with creator rule and team-play relation |
| 2026-03-20 | 现有合约能否直接给出“哪些货物缺货”？ | 结论：不能直接给全局缺货清单；P0 采用链上库存事件 + 索引层计算 shortage_score 产出 AuctionLot。 | Logic / Scope | Updated dependencies + data rules + added Q-003 |
| 2026-03-20 | 完善 Monetization and Economy Notes，并给简单直观例子 | 已增强：补充收费触点、费率分层、资金流向、反作弊规则，并新增单局分账算例。 | Logic / Metrics | Expanded Monetization notes + added simple in-match monetization example |
| 2026-03-20 | 全量 PRD 可行性复审（all_contracts.move.txt） + 细化 Core Loop 与 Monetization | 结论：P0 可做，但需“现有合约原语 + 新玩法模块/索引层”组合交付；已补充执行级循环与资金流细节。 | Logic / Scope / Metrics | Added feasibility review + expanded Core Loop Mapping + Monetization notes |

| 2026-03-20 | global 3-question closure requirement across all PRDs | Enforced explicit answers for: funding source, mission objective, and post-mission distribution in each PRD. | Logic / Scope / Metrics | Added Three Core Questions (Required) section |

## 12.1 Pending Discussion Items

- D-001: None
