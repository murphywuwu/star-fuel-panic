# PRD: Capture the Gate

## 0. One-Screen Summary (Problem / Why / How)

- Problem it solves: 玩家希望体验有战术深度的节点争夺，但当前缺少节奏紧凑的夺旗模式。
- Why this matters now: 战略玩法常常时长过长，不适合快速组局。
- How it solves it (3-step mechanism):
  1. 队伍争夺关键节点。
  2. 节点形成连通链路后触发夺旗得分。
  3. 达到目标分或超时后执行结算。
- Expected player/business outcome: 比赛可稳定演示三段式核心体验。

## 0.1 Before vs After

| Dimension | Before | After |
|---|---|---|
| Player clarity | 战略玩法常常时长过长，不适合快速组局。 | 比赛可稳定演示三段式核心体验。 |
| Player outcome | 目标不清、协作效率受限 | 比赛可稳定演示三段式核心体验。 |
| Business outcome | 复玩率与营收闭环不稳定 | 可验证的玩法闭环与结算闭环 |

## 1. Document Control

- Product Name: Capture the Gate
- Project/App Path: apps/frontier-arcade-hub (proposed)
- Version: v1.0
- Status: Draft
- Owner (PM Agent): Codex
- Last Updated: 2026-03-20
- Related Docs:
  - SPEC: docs/spec/capture-the-gate/spec.md (planned)
  - TODO: docs/todo/capture-the-gate/todo.md (planned)
  - Test Plan: docs/test-plan/capture-the-gate/test-plan.md (planned)

## 2. Background and Goal

- Problem Statement:
  - 需要将 Frontier 核心循环（生存、协作、竞争、经济）转化为可快速开局、可复玩、可结算的街机玩法。
  - 玩家希望体验有战术深度的节点争夺，但当前缺少节奏紧凑的夺旗模式。
- Target Users:
  - Frontier 玩家（个人与小队）
  - 联盟组织者 / 社区活动发起者
- Product Goal:
  - 交付可在黑客松时限内演示并可继续迭代的玩法闭环。
- Non-Goals:
  - 不做超出黑客松窗口的大型内容系统（如完整赛季运营后台）。
- Strategic Fit (why now for this hackathon/project):
  - 能直观展示 Frontier 的空间控制叙事与多人协作价值。

## 2.1 Why Players Need This Product

- 战略玩法常常时长过长，不适合快速组局。
- 节点连通逻辑复杂，新玩家难理解。
- 胜负过程缺少可解释回放。

## 2.2 Player Segments and JTBD

| Segment | Context | Job-to-be-done | Current Friction |
|---|---|---|---|
| S-001 | 战术型小队 | 通过分工控点和连线赢下短局 | 地图信息复杂、决策反馈慢 |
| S-002 | 主播/评审观战 | 快速看懂比赛关键转折 | 缺少清晰事件时间线 |

## 2.3 Success Metrics and Guardrails

- North Star Metric: 有效夺旗得分事件数 / 局
- Primary metrics:
  - M-001: 完整三段流程（争夺-连通-得分）触发率 >= 80%
  - M-002: 规则理解度（赛后问卷）>= 4/5
- Guardrail metrics:
  - G-001: 非法节点跳变拦截率 = 100%
  - G-002: 终局争议率 < 2%
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
| P0 | Hackathon 72h | 节点争夺、连线判定、夺旗得分、终局结算 |
| P1 | Post-hackathon 2-4 weeks | 多地图策略差异、回放时间线 |

### Out of Scope

- 跨玩法资产深度互通经济系统
- 完整电竞观战回放平台
- 主网正式商业运营法务流程

## 3.1 Dependencies and Constraints

- Internal dependencies: Arcade Hub、Reputation
- External dependencies (API/network/team): 地图服务、节点状态同步
- Critical assumptions: 节点状态同步延迟可控

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Value Hypothesis | Status |
|---|---|---|---|---|
| F-005 | Capture the Gate Core Gameplay | P0 | 清晰的连线夺旗规则能兼顾竞技深度和观赏性。 | Planned |
| F-012 | Monetization Engine Integration | P0 | 统一收费与结算规则可降低运营复杂度 | Planned |
| F-013 | Live Frontier Integration | P0 | 实网可运行是评审高权重加分项 | Planned |
| F-014 | Reputation & Anti-abuse Integration | P1 | 提升公平性并抑制刷子行为 | Planned |

## 5. Feature Business Logic

### F-005 Capture the Gate Core Gameplay

- User Story: 作为队伍，我希望通过连续占领跃迁节点完成夺旗。
- Trigger: 匹配完成后自动开局。
- Preconditions: 至少两队，节点图初始化完成。
- Route setup ownership:
  - 房主/赛事创建者在开局前选择“夺旗路线模板”（route template）。
  - 模板库由官方/运营方预先发布并白名单管理，普通玩家不能上传任意模板。
  - 对局一旦开始，路线模板立即锁定，局中不可修改。
  - 竞技/排位房：仅允许官方模板池随机或按规则选择；自定义房：允许在白名单模板中手动选。
- Main Flow:
1. 队伍争夺关键节点。
2. 节点形成连通链路后触发夺旗得分。
3. 达到目标分或超时后执行结算。
- Alternative Flow / Exceptions:
- 多队并列触发 sudden death。
- 关键节点争议进入重试窗口并复核。
- Postconditions:
  - 生成可查询的对局结果、奖励分配和个人贡献记录。
- Data Rules:
- 得分必须绑定节点连通状态快照。
- 非法节点跳变直接拒绝写入。
- 对局结算必须绑定开局时的 `route_template_id` 与 `route_config_hash`，防止中途篡改路线配置。
- 奖池结算绑定 `entry_fee_lux`、`platform_rake_bps`、`host_revshare_bps`、`payout_rule_id`，禁止局后修改。
- Error Handling:
  - 非法状态迁移、重复结算、重复领奖一律拒绝。
- Acceptance Criteria:
  - AC-001: 比赛可稳定演示三段式核心体验。
  - AC-002: 终局战报包含节点时间线和得分来源。
  - AC-003: 路线配置权责清晰，且“开局后不可改”规则可验证。

### Step-by-step Gameplay User Stories

1. 作为玩家，我想开局就看懂关键节点与夺旗条件。
2. 作为突击位，我想优先冲击枢纽节点。
3. 作为防守位，我想守住已占节点防止断链。
4. 作为指挥，我想基于链路状态做转点决策。
5. 作为队员，我想在终局看到得分来源解释。

### Core Loop Mapping

- Entry: 匹配进入地图。
- Action: 控点、连线、夺旗。
- Feedback: 节点颜色、连线状态、倒计时。
- Reward: 胜负奖励、战术评分、排名变化。
- Re-engagement trigger: 下一局地图轮换和战术调整。

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

- Monetization touchpoint: 竞技房间 buy-in 与赛事门票。
- Pricing / fee logic: 按房间级别配置买入档位。
- Sink/faucet impact: 买入沉淀奖池，胜方分配。
- Anti-abuse rule: 异常同队轮流让分检测。
- Reward and revenue model:
  - 玩家奖励：支持 LUX 奖励；玩家按名次/队伍贡献分配奖池（默认胜方队伍分配）。
  - 主办方收益：支持主办方分成（host revshare），从平台手续费中切分，不直接动用玩家奖池本金。
  - 平台收益：平台收取 rake（basis points），用于官方运营与持续活动资金池。
- Default settlement formula (configurable by room type):
  - `gross_pool = player_count * entry_fee_lux`
  - `platform_fee = gross_pool * platform_rake_bps / 10_000`
  - `host_fee = platform_fee * host_revshare_bps / 10_000`
  - `payout_pool = gross_pool - platform_fee`
  - `winners_payout = payout_pool`（再按 payout_rule 分给胜方成员）
- Governance and limits:
  - `platform_rake_bps` 设上限（建议 <= 1,500，即 15%）。
  - `host_revshare_bps` 为平台手续费内部分配比例（建议 <= 6,000，即平台费中的 60%）。
  - 房主创建房间时必须展示“玩家奖池金额、平台费、主办方分成金额”三项透明账单。
- Example (for clarity):
  - 10 名玩家，每人 100 LUX，`platform_rake=10%`，`host_revshare=40%`：
  - `gross_pool=1,000`，`platform_fee=100`，`host_fee=40`，`payout_pool=900`。
  - 结果：玩家总奖励 900 LUX，主办方收入 40 LUX，平台收入 60 LUX。


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
  - Core mission statement: 完成控点-连线-夺旗三段目标，维持节点连通并压制对手。
  - Completion condition: 终局得分更高且满足夺旗胜利条件。
  - Failure condition: 关键节点失守、连线断裂且总分落后。
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

- Move module impacts: NodeControlState、LinkProof、FlagScoreLedger。
- On-chain/off-chain boundary: 链上保存关键控点和得分事件，链下承担实时渲染。
- Must follow testing standard: docs/sui-devnet-testing-standard.md
- Security and abuse considerations:
  - Replay: 得分提交绑定 match_id + tick。
  - Double settlement: 同一得分事件不可重复入账。
  - Privilege checks: 仅授权裁定入口可写分。

### Contract Feasibility Review (Based on docs/all_contracts.move.txt)

- Feasibility verdict: Medium-High（对抗核心可做）
- Directly reusable contract primitives: gate、network_node、status 可复用为据点状态与可用性约束。
- Missing capabilities / required new modules: 缺少“控点计分/夺旗规则/路线模板锁定”专用模块，需要新增 ControlPointState/ScoreLedger。
- P0 delivery boundary: 开局锁路由哈希，终局按链上快照结算；实时战斗判定保持链下。

## 9. Risks and Assumptions

- Assumptions:
  - 使用 Next.js + Tailwind + Zustand + Sui Move 作为默认实现栈。
- Risks:
  - 新手理解门槛偏高。
  - 节点状态冲突可能引发争议。
- Mitigations:
  - 加入开局教学叠层与简化 UI。
  - 关键判定采用服务端签名 + 链上校验。

## 9.1 Open Questions

- Q-001: 是否需要简化版地图用于新手模式？
- Q-002: sudden death 持续时长是否动态调整？

## 10. Release and Validation

- Milestones:
  - M1: 三段闭环；M2: 时间线战报；M3: 实网多队演示
- Validation approach:
  - 每个玩法至少 1 条主流程 + 1 条异常流程通过。
  - 关键结算交易、事件日志和战报互相可追溯。
- Exit criteria:
  - 可完成真实多人对局并输出可验证的演示证据。

## 11. Traceability

| PRD Item | Linked SPEC Section | Linked TODO IDs |
|---|---|---|
| F-005 | 4.2 / 4.3 / 4.4 | T-001 ~ T-00x |
| F-012 | 4.3 / 5.1 | T-01x |
| F-013 | 4.3 / 7 | T-02x |
| F-014 | 4.3 / 5 / 7 | T-03x |

## 12. PM Discussion Log

| Date | User Question Summary | PM Answer Summary | Decision Type | PRD Changes |
|---|---|---|---|---|
| 2026-03-20 | 启用 PM 讨论模式（问答 + 文档同步） | 已启用：PM 问答若影响范围/逻辑/指标/优先级，将在同回合同步更新 PRD | Process | Added discussion-mode workflow and logging requirement |
| 2026-03-20 | Capture the Gate 的夺旗路线由谁设置？ | 决策：由房主/赛事创建者在开局前从官方白名单模板中选择；开局后锁定不可改。 | Logic / Scope | Updated 5.Feature Business Logic (`Route setup ownership`, `Data Rules`, `AC-003`) |
| 2026-03-20 | 玩家能否获得 LUX 奖励？主办方能否赚钱、怎么赚？ | 决策：支持 LUX 奖励；支持主办方收益，收益来自平台手续费分成（revshare），不侵占玩家奖池本金；增加透明账单和费率上限。 | Logic / Metrics | Updated `Data Rules` + `Monetization and Economy Notes` with settlement formula, limits, and numeric example |
| 2026-03-20 | 每个 PRD 需要详细阐述赚钱机制并举例 | 已执行：新增 Revenue Mechanism Breakdown + Revenue Example（含结算公式与数字算例） | Logic / Metrics | Updated monetization detail section |
| 2026-03-20 | 全量 PRD 可行性复审（all_contracts.move.txt） + 细化 Core Loop 与 Monetization | 结论：P0 可做，但需“现有合约原语 + 新玩法模块/索引层”组合交付；已补充执行级循环与资金流细节。 | Logic / Scope / Metrics | Added feasibility review + expanded Core Loop Mapping + Monetization notes |

| 2026-03-20 | global 3-question closure requirement across all PRDs | Enforced explicit answers for: funding source, mission objective, and post-mission distribution in each PRD. | Logic / Scope / Metrics | Added Three Core Questions (Required) section |

## 12.1 Pending Discussion Items

- D-001: None
