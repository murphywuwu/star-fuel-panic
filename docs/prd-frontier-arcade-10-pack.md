# PRD: Frontier Arcade 10-Pack (Toolkit for Civilization)

> Deprecated: this consolidated PRD is kept for historical reference only.
> Active PM workflow must use per-game PRDs under `docs/prd/<product-name>/prd.md`.

## 1. Document Control

- Product Name: Frontier Arcade 10-Pack
- Project/App Path: `apps/frontier-arcade-hub` (proposed)
- Version: v0.1
- Status: Draft
- Owner (PM Agent): Codex
- Last Updated: 2026-03-20

## 2. Background and Goal

- Problem Statement:
  - EVE Frontier Builder 生态已有基础设施与工具类玩法，但缺少可快速拉新、可社交传播、可短时循环付费的“街机化多人玩法包”。
  - 黑客松评审强调 Utility / Technical / Creative / Weird / Live Integration，需要一个既可演示技术又可被真实玩家即刻体验的产品结构。
- Target Users:
  - Frontier 现有玩家（联盟成员、基础设施运营者、PVP/PVE 玩家）
  - 新进入玩家（通过 zkLogin + sponsored tx 低门槛体验）
  - 社区组织者（可发起活动与赛事）
- Product Goal:
  - 在单一街机入口内上线 10 个“有梗+可协作+可结算”的小游戏模块。
  - 所有玩法对齐 Frontier 世界观（生存、补给、争夺、物流、联盟治理）。
  - 形成可验证收入闭环（报名费、奖池、rake、通行证）。
- Non-Goals:
  - 不在黑客松窗口内完成 AAA 美术资产重做。
  - 不在黑客松窗口内上线复杂跨赛季经济平衡系统。
  - 不覆盖所有 Frontier 世界系统，仅覆盖与 10 个玩法相关的最小扩展接口。

## 3. Scope

### In Scope

- 统一 Arcade Hub（房间、匹配、榜单、结算）
- 10 个可配置玩法规则包（见 Feature List）
- 统一货币化引擎（buy-in / 奖池 / rake / 通行证）
- Stillness 在线部署与真实玩家可参与验证
- 关键行为上链记录（结果、奖励、信誉影响）

### Out of Scope

- 复杂跨游戏资产互通经济模型
- 完整电竞观战系统与回放剪辑系统
- 多语言本地化全覆盖
- 主网商业化正式运营条款与法务流程

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Status |
|---|---|---|---|
| F-001 | Arcade Core Hub（大厅/房间/结算） | P0 | Planned |
| F-002 | Fuel Frog Panic（燃料青蛙救援） | P0 | Planned |
| F-003 | King of Toll Hill（山丘收费王） | P0 | Planned |
| F-004 | Jotunn Moisturizer（给巨神加湿） | P1 | Planned |
| F-005 | Capture the Gate（夺旗跃迁链） | P1 | Planned |
| F-006 | Killmail Bingo Ops（击杀邮件宾果） | P1 | Planned |
| F-007 | Scrap Relay（废土拼船接力） | P1 | Planned |
| F-008 | Heat Route Rush（热区航线竞速） | P2 | Planned |
| F-009 | Bounty Board Blitz（任务墙闪击） | P2 | Planned |
| F-010 | Dutch Auction Heist（拍卖劫掠冲刺） | P2 | Planned |
| F-011 | Pirate Insurance Rumble（海盗保险对赌） | P2 | Planned |
| F-012 | Monetization Engine（报名费/奖池/rake/通行证） | P0 | Planned |
| F-013 | Live Frontier Integration（Stillness 实网接入） | P0 | Planned |
| F-014 | Reputation & Anti-abuse（信誉与反滥用） | P0 | Planned |

## 5. Feature Business Logic

### F-001 Arcade Core Hub（大厅/房间/结算）

- User Story: 作为玩家，我希望在一个入口创建或加入多人小游戏并查看实时结果。
- Trigger: 玩家进入 Arcade Hub，选择玩法并点击“创建房间/快速加入”。
- Preconditions: 钱包连接完成；满足玩法最小入场条件（余额、信誉或通行证）。
- Main Flow:
1. 玩家选择玩法与参数（人数、买入、地图/规则）。
2. 系统创建房间并等待匹配/邀请加入。
3. 对局结束后系统触发统一结算并写入战报。
- Alternative Flow / Exceptions:
  - 房间超时未满员自动解散并退款。
  - 玩家中途断线按规则托管或判负。
- Postconditions: 生成可查询的赛局记录与奖励结果。
- Data Rules: 房间状态必须为 `created -> active -> settled -> closed` 的单向状态机。
- Error Handling: 重复结算、重复领奖、非法状态切换必须拒绝。
- Acceptance Criteria:
  - 可稳定完成“建房-开局-结算”闭环。
  - 10 个玩法可复用同一房间与结算框架。

### F-002 Fuel Frog Panic（燃料青蛙救援）

- User Story: 作为协作小队，我希望在限时内补给星门网络并防止断供。
- Trigger: 房主发起燃料救援局。
- Preconditions: 3-8 名玩家入场，买入完成。
- Main Flow:
1. 系统下发多节点燃料缺口与时间窗。
2. 玩家分工采集、运输、护航。
3. 按完成度与时效进行积分和奖池分配。
- Alternative Flow / Exceptions: 节点被敌对事件干扰时可触发“应急补给”支线。
- Postconditions: 记录团队贡献与个人绩效。
- Data Rules: 团队分必须由节点补给事件累计计算，不允许前端直接上报分数。
- Error Handling: 非法提交补给量、过期补给、重复记分拒绝。
- Acceptance Criteria: 单局 10-15 分钟内完成，协作行为占总分 60% 以上。

### F-003 King of Toll Hill（山丘收费王）

- User Story: 作为联盟/队伍，我希望争夺收费控制点并获得收益分成。
- Trigger: 发起 KOTH 模式并设置 buy-in、rake 比例。
- Preconditions: 双方或多方队伍完成入场。
- Main Flow:
1. 队伍争夺控制点并维持占领时间。
2. 系统动态计算控制值和冲突事件。
3. 结算奖池并向运营地址抽取 rake。
- Alternative Flow / Exceptions: 平分判定触发加时赛。
- Postconditions: 产出排名、分润与控制点日志。
- Data Rules: rake 计算公式固定且链上可验证。
- Error Handling: 比赛中断可按规则回滚部分结算。
- Acceptance Criteria: 结算逻辑可审计，至少支持 2v2 与 4v4。

### F-004 Jotunn Moisturizer（给巨神加湿）

- User Story: 作为玩家，我希望通过“给巨神喂水冰”完成协作换取燃料奖励。
- Trigger: 周期性世界事件开启。
- Preconditions: 玩家持有可提交资源。
- Main Flow:
1. 玩家协作提交水冰与指定资源。
2. 巨神状态变化触发阶段奖励。
3. 达标后发放团队 buff 与奖励。
- Alternative Flow / Exceptions: 资源提交不足则事件失败并仅返还部分积分。
- Postconditions: 形成 meme 事件战报和参与证明。
- Data Rules: 奖励池按阶段阈值释放，不能一次性提取。
- Error Handling: 重复提交凭证、防刷地址频率限制。
- Acceptance Criteria: 玩法具备强梗传播与可重复运营性。

### F-005 Capture the Gate（夺旗跃迁链）

- User Story: 作为队伍，我希望通过连续占领跃迁节点完成夺旗。
- Trigger: 匹配完成后开局。
- Preconditions: 至少两队，地图节点初始化完成。
- Main Flow:
1. 双方争夺节点控制权。
2. 占领链路连通后可“夺旗”得分。
3. 达到目标分或时间结束后结算。
- Alternative Flow / Exceptions: 多队并列时进入 sudden death。
- Postconditions: 生成节点控制时间线。
- Data Rules: 得分事件必须绑定节点状态快照。
- Error Handling: 非法节点跳变拒绝写入。
- Acceptance Criteria: 可清晰演示“争夺-连通-得分”三段体验。

### F-006 Killmail Bingo Ops（击杀邮件宾果）

- User Story: 作为小队，我希望通过完成 killmail 组合任务拿到宾果奖励。
- Trigger: 开局抽取宾果卡模板。
- Preconditions: 关联 killmail 数据可读取。
- Main Flow:
1. 系统生成任务格（目标类型/条件）。
2. 队伍完成对应击杀或行为条件。
3. 完成行/列/全图触发递进奖励。
- Alternative Flow / Exceptions: 数据延迟时先临时标记后异步确认。
- Postconditions: 产出可分享战报图。
- Data Rules: 只接受链上可验证或官方接口可核验事件。
- Error Handling: 重复利用同一事件刷多个格子时按规则去重。
- Acceptance Criteria: 单局目标明确，复玩性高。

### F-007 Scrap Relay（废土拼船接力）

- User Story: 作为团队，我希望分工完成“采-运-造”并拼出可起飞舰体。
- Trigger: 接力赛模式开局。
- Preconditions: 材料池与蓝图规则初始化。
- Main Flow:
1. 队员按角色采集、运输、组装。
2. 系统实时校验蓝图完成度。
3. 首个完成舰体的队伍获胜。
- Alternative Flow / Exceptions: 材料被劫可触发替代蓝图分支。
- Postconditions: 记录角色贡献曲线。
- Data Rules: 蓝图步骤必须按依赖顺序完成。
- Error Handling: 非法材料映射、越序组装拒绝。
- Acceptance Criteria: 强协作、强分工，且规则清晰。

### F-008 Heat Route Rush（热区航线竞速）

- User Story: 作为航线团队，我希望在热区和燃料限制下跑出最优路线。
- Trigger: 竞速赛开启。
- Preconditions: 路线图与热度参数加载。
- Main Flow:
1. 玩家提交路线计划并执行。
2. 系统根据热度、燃料、距离计算结果。
3. 以总耗时与成本排名。
- Alternative Flow / Exceptions: 高热区触发随机干扰事件。
- Postconditions: 输出路线复盘和优化建议。
- Data Rules: 排名以可验证路径日志为准。
- Error Handling: 非法坐标或路径伪造直接判无效。
- Acceptance Criteria: 玩法可展示 Frontier 物流策略深度。

### F-009 Bounty Board Blitz（任务墙闪击）

- User Story: 作为组织者，我希望快速发布“任务+奖励”并让玩家协作完成。
- Trigger: 发布者创建任务单。
- Preconditions: 奖励资金托管完成。
- Main Flow:
1. 发布任务（目标、时限、奖励）。
2. 玩家组队接单执行。
3. 完成后自动或人工核验结算。
- Alternative Flow / Exceptions: 超时未完成自动失效。
- Postconditions: 形成任务履约记录与信誉影响。
- Data Rules: 同一任务只能被一个队伍在同时间窗口占有（可配置）。
- Error Handling: 无效证据提交拒绝，争议进入仲裁状态。
- Acceptance Criteria: 任务发布到结算闭环稳定。

### F-010 Dutch Auction Heist（拍卖劫掠冲刺）

- User Story: 作为团队，我希望在降价拍卖中争夺补给并组织护送。
- Trigger: 拍卖局创建。
- Preconditions: 拍卖品与起始参数锁定。
- Main Flow:
1. 价格随时间递减。
2. 队伍择机竞拍并完成资产护送。
3. 成功护送后获得额外积分或收益。
- Alternative Flow / Exceptions: 拍卖流拍则触发保底回收。
- Postconditions: 记录竞拍与运输双阶段结果。
- Data Rules: 价格曲线按时间函数确定，不能人工改写。
- Error Handling: 重复出价、余额不足、超时签名拒绝。
- Acceptance Criteria: 可演示“经济决策+协作执行”组合价值。

### F-011 Pirate Insurance Rumble（海盗保险对赌）

- User Story: 作为风险玩家，我希望购买保险后参与高风险对抗并获得补偿或盈利。
- Trigger: 对赌局创建。
- Preconditions: 参赛者完成保费支付。
- Main Flow:
1. 玩家选择保险档位并入局。
2. 对抗结果触发赔付或奖金分配。
3. 信誉系统记录风险行为。
- Alternative Flow / Exceptions: 异常中断按保险条款进行部分赔付。
- Postconditions: 生成赔付与战绩明细。
- Data Rules: 赔付上限、免赔规则、冷却期可配置且公开。
- Error Handling: 欺诈性重复理赔拒绝并惩罚。
- Acceptance Criteria: 风险回报机制清晰且可审计。

### F-012 Monetization Engine（报名费/奖池/rake/通行证）

- User Story: 作为运营方，我希望所有玩法复用统一商业化模块。
- Trigger: 任一玩法创建局时调用。
- Preconditions: 收费策略已配置。
- Main Flow:
1. 收取 buy-in / 校验通行证折扣。
2. 进入托管奖池并锁定结算规则。
3. 结算时自动分配奖励与 rake。
- Alternative Flow / Exceptions: 局取消时按策略退款。
- Postconditions: 产生可审计收入与分润记录。
- Data Rules: 每局必须存在唯一结算单据。
- Error Handling: 重复扣费/重复退款必须被拦截。
- Acceptance Criteria: 至少支持固定买入、百分比 rake、白名单折扣。

### F-013 Live Frontier Integration（Stillness 实网接入）

- User Story: 作为评审，我希望看到玩法在 Stillness 与真实玩家发生交互。
- Trigger: 发布候选版本。
- Preconditions: 合约与前端完成测试网验证。
- Main Flow:
1. 部署到 Stillness 兼容环境。
2. 发起真实玩家局并记录链上事件。
3. 展示可复现 demo 与关键指标。
- Alternative Flow / Exceptions: 若实网拥堵，降级到限流模式并保留演示。
- Postconditions: 获得 Live Integration 证据链。
- Data Rules: 关键截图、Tx digest、事件日志必须可追溯。
- Error Handling: 接口不可用时提供只读 fallback 面板。
- Acceptance Criteria: 至少完成 1 场真实对局并可验证结果。

### F-014 Reputation & Anti-abuse（信誉与反滥用）

- User Story: 作为运营方，我希望减少刷子行为并激励正向协作。
- Trigger: 每局完成后自动触发评分更新。
- Preconditions: 玩家身份与行为日志可关联。
- Main Flow:
1. 聚合局内行为和历史记录。
2. 更新信誉分并影响后续入场阈值/奖励倍率。
3. 标记异常地址进入人工复核。
- Alternative Flow / Exceptions: 可对误伤进行申诉和修正。
- Postconditions: 信誉分参与匹配与风控。
- Data Rules: 评分规则版本化并公开。
- Error Handling: 数据缺失时采用保守默认分。
- Acceptance Criteria: 明显减少重复作弊路径。

## 6. UX and UI Constraints

- Must follow: `docs/eve-frontier-ui-style-guide.md`
- Key interaction requirements:
  - 30 秒内完成“连接钱包 -> 入场 -> 开局”
  - 任一玩法必须在首屏展示：目标、时限、奖励、失败代价
  - 对局过程反馈必须显式（倒计时、团队贡献、结算进度）
- Accessibility baseline:
  - 关键信息支持高对比度与文本替代
  - 交互操作支持键盘可达

## 7. Architecture Constraints

- Must follow: `docs/architecture.md`
- Required layer ownership:
  - View: 仅负责页面与组件渲染、事件采集、反馈展示
  - Controller: 编排玩法流程、校验输入、调用服务用例
  - Service: 规则计算、结算策略、链上/链下接口编排
  - Model (Zustand): 玩家会话、房间状态、对局状态、结算状态

## 8. Contract / Chain Considerations (If Applicable)

- Move module impacts:
  - 对局创建/状态机/结算/奖池托管/信誉更新模块
- On-chain/off-chain boundary:
  - 上链：关键状态迁移、资金结算、可审计事件、信誉快照
  - 链下：高频临时状态、匹配队列、实时 UI 聚合
- Must follow testing standard: `docs/sui-devnet-testing-standard.md`

## 9. Risks and Assumptions

- Assumptions:
  - 团队可用栈为 Next.js + Tailwind + Zustand + Sui Move。
  - 黑客松演示时间有限，优先展示 1-3 个核心玩法，其他玩法以规则包形式展示。
- Risks:
  - 10 玩法同时完工风险高。
  - 实网集成存在不确定延迟。
  - 反作弊策略不完善会影响演示可信度。
- Mitigations:
  - 采用“统一引擎 + 规则包”架构复用。
  - 提前完成 devnet/Stillness 预演和降级演示路径。
  - 最小反滥用策略先行：频率限制、重复行为判定、信誉阈值。

## 10. Release and Validation

- Milestones:
  - M1: Core Hub + F-002 + F-003 可玩闭环
  - M2: 货币化引擎 + 实网接入 + 信誉基础版
  - M3: 补齐其余规则包并完成评审演示材料
- Validation approach:
  - 功能验证：每个玩法至少 1 条主流程 + 1 条异常流程通过
  - 业务验证：buy-in/rake 分账记录可追溯
  - 评审验证：可复现 Live Integration 证据（Tx/Event/对局战报）
- Exit criteria:
  - 至少 3 个玩法可在 Stillness 与真实玩家完成对局
  - 10 个玩法均具备可演示规则入口
  - 收入闭环与结算闭环可验证
