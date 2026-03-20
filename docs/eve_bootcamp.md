# EVE Bootcamp 文档合并

- 来源入口: https://hoh-zone.github.io/eve-bootcamp/index.html
- 页面总数: 59

## 目录

- [01. 课程简介 - EVE Frontier Builder Course](#01-课程简介---eve-frontier-builder-course)
- [02. 术语表 - EVE Frontier Builder Course](#02-术语表---eve-frontier-builder-course)
- [03. 先读懂 EVE Frontier 这款游戏 - EVE Frontier Builder Course](#03-先读懂-eve-frontier-这款游戏---eve-frontier-builder-course)
- [04. Chapter 1: EVE Frontier 宏观架构 - EVE Frontier Builder Course](#04-chapter-1-eve-frontier-宏观架构---eve-frontier-builder-course)
- [05. Chapter 2: 开发环境配置 - EVE Frontier Builder Course](#05-chapter-2-开发环境配置---eve-frontier-builder-course)
- [06. Chapter 3: Move 合约基础 - EVE Frontier Builder Course](#06-chapter-3-move-合约基础---eve-frontier-builder-course)
- [07. Chapter 4: 智能组件开发与链上部署 - EVE Frontier Builder Course](#07-chapter-4-智能组件开发与链上部署---eve-frontier-builder-course)
- [08. Chapter 5: dApp 前端开发 - EVE Frontier Builder Course](#08-chapter-5-dapp-前端开发---eve-frontier-builder-course)
- [09. Example 1: 炮塔白名单 - EVE Frontier Builder Course](#09-example-1-炮塔白名单---eve-frontier-builder-course)
- [10. Example 2: 星门收费站 - EVE Frontier Builder Course](#10-example-2-星门收费站---eve-frontier-builder-course)
- [11. Chapter 6: 项目结构与合约开发 - EVE Frontier Builder Course](#11-chapter-6-项目结构与合约开发---eve-frontier-builder-course)
- [12. Chapter 7: TS 脚本与 dApp 开发 - EVE Frontier Builder Course](#12-chapter-7-ts-脚本与-dapp-开发---eve-frontier-builder-course)
- [13. Chapter 8: 赞助交易与服务端集成 - EVE Frontier Builder Course](#13-chapter-8-赞助交易与服务端集成---eve-frontier-builder-course)
- [14. Chapter 9: 链下索引与 GraphQL 进阶 - EVE Frontier Builder Course](#14-chapter-9-链下索引与-graphql-进阶---eve-frontier-builder-course)
- [15. Chapter 10: dApp 集成实战 - EVE Frontier Builder Course](#15-chapter-10-dapp-集成实战---eve-frontier-builder-course)
- [16. Example 4: 任务解锁系统 - EVE Frontier Builder Course](#16-example-4-任务解锁系统---eve-frontier-builder-course)
- [17. Example 11: 物品租赁系统 - EVE Frontier Builder Course](#17-example-11-物品租赁系统---eve-frontier-builder-course)
- [18. Chapter 11: 所有权模型深度解析 - EVE Frontier Builder Course](#18-chapter-11-所有权模型深度解析---eve-frontier-builder-course)
- [19. Chapter 12: Move 进阶 - EVE Frontier Builder Course](#19-chapter-12-move-进阶---eve-frontier-builder-course)
- [20. Chapter 13: NFT 设计与元数据管理 - EVE Frontier Builder Course](#20-chapter-13-nft-设计与元数据管理---eve-frontier-builder-course)
- [21. Chapter 14: 链上经济系统设计 - EVE Frontier Builder Course](#21-chapter-14-链上经济系统设计---eve-frontier-builder-course)
- [22. Chapter 15: 跨合约组合性 - EVE Frontier Builder Course](#22-chapter-15-跨合约组合性---eve-frontier-builder-course)
- [23. Chapter 16: 位置与临近性系统 - EVE Frontier Builder Course](#23-chapter-16-位置与临近性系统---eve-frontier-builder-course)
- [24. Chapter 17: 测试、调试与安全审计 - EVE Frontier Builder Course](#24-chapter-17-测试调试与安全审计---eve-frontier-builder-course)
- [25. Example 3: 链上拍卖行 - EVE Frontier Builder Course](#25-example-3-链上拍卖行---eve-frontier-builder-course)
- [26. Example 6: 动态 NFT - EVE Frontier Builder Course](#26-example-6-动态-nft---eve-frontier-builder-course)
- [27. Example 7: 星门物流网络 - EVE Frontier Builder Course](#27-example-7-星门物流网络---eve-frontier-builder-course)
- [28. Example 9: 跨 Builder 协议 - EVE Frontier Builder Course](#28-example-9-跨-builder-协议---eve-frontier-builder-course)
- [29. Example 13: 订阅制通行证 - EVE Frontier Builder Course](#29-example-13-订阅制通行证---eve-frontier-builder-course)
- [30. Example 14: NFT 质押借贷 - EVE Frontier Builder Course](#30-example-14-nft-质押借贷---eve-frontier-builder-course)
- [31. Example 16: NFT 合成拆解 - EVE Frontier Builder Course](#31-example-16-nft-合成拆解---eve-frontier-builder-course)
- [32. Example 18: 跨联盟外交条约 - EVE Frontier Builder Course](#32-example-18-跨联盟外交条约---eve-frontier-builder-course)
- [33. Chapter 18: 多租户与游戏服务器集成 - EVE Frontier Builder Course](#33-chapter-18-多租户与游戏服务器集成---eve-frontier-builder-course)
- [34. Chapter 19: 全栈 dApp 架构设计 - EVE Frontier Builder Course](#34-chapter-19-全栈-dapp-架构设计---eve-frontier-builder-course)
- [35. Chapter 20: 游戏内 dApp 集成 - EVE Frontier Builder Course](#35-chapter-20-游戏内-dapp-集成---eve-frontier-builder-course)
- [36. Chapter 21: 性能优化与 Gas 最小化 - EVE Frontier Builder Course](#36-chapter-21-性能优化与-gas-最小化---eve-frontier-builder-course)
- [37. Chapter 22: Move 高级模式 - EVE Frontier Builder Course](#37-chapter-22-move-高级模式---eve-frontier-builder-course)
- [38. Chapter 23: 发布、维护与社区协作 - EVE Frontier Builder Course](#38-chapter-23-发布维护与社区协作---eve-frontier-builder-course)
- [39. Chapter 24: 故障排查手册 - EVE Frontier Builder Course](#39-chapter-24-故障排查手册---eve-frontier-builder-course)
- [40. Chapter 25: 从 Builder 到产品 - EVE Frontier Builder Course](#40-chapter-25-从-builder-到产品---eve-frontier-builder-course)
- [41. Example 5: 联盟 DAO - EVE Frontier Builder Course](#41-example-5-联盟-dao---eve-frontier-builder-course)
- [42. Example 12: 联盟招募 - EVE Frontier Builder Course](#42-example-12-联盟招募---eve-frontier-builder-course)
- [43. Example 15: PvP 物品保险 - EVE Frontier Builder Course](#43-example-15-pvp-物品保险---eve-frontier-builder-course)
- [44. Example 17: 游戏内浮层实战 - EVE Frontier Builder Course](#44-example-17-游戏内浮层实战---eve-frontier-builder-course)
- [45. Chapter 26: 访问控制完整解析 - EVE Frontier Builder Course](#45-chapter-26-访问控制完整解析---eve-frontier-builder-course)
- [46. Chapter 27: 链下签名 × 链上验证 - EVE Frontier Builder Course](#46-chapter-27-链下签名--链上验证---eve-frontier-builder-course)
- [47. Chapter 28: 位置证明协议 - EVE Frontier Builder Course](#47-chapter-28-位置证明协议---eve-frontier-builder-course)
- [48. Chapter 29: 能量与燃料系统 - EVE Frontier Builder Course](#48-chapter-29-能量与燃料系统---eve-frontier-builder-course)
- [49. Chapter 30: Extension 模式实战 - EVE Frontier Builder Course](#49-chapter-30-extension-模式实战---eve-frontier-builder-course)
- [50. Chapter 31: 炮塔 AI 扩展 - EVE Frontier Builder Course](#50-chapter-31-炮塔-ai-扩展---eve-frontier-builder-course)
- [51. Chapter 32: KillMail 系统 - EVE Frontier Builder Course](#51-chapter-32-killmail-系统---eve-frontier-builder-course)
- [52. Example 8: Builder 竞赛系统 - EVE Frontier Builder Course](#52-example-8-builder-竞赛系统---eve-frontier-builder-course)
- [53. Example 10: 综合实战 - EVE Frontier Builder Course](#53-example-10-综合实战---eve-frontier-builder-course)
- [54. Chapter 33: zkLogin 原理与设计 - EVE Frontier Builder Course](#54-chapter-33-zklogin-原理与设计---eve-frontier-builder-course)
- [55. Chapter 34: 技术架构与开发部署 - EVE Frontier Builder Course](#55-chapter-34-技术架构与开发部署---eve-frontier-builder-course)
- [56. Chapter 35: 未来展望 - EVE Frontier Builder Course](#56-chapter-35-未来展望---eve-frontier-builder-course)
- [57. 运行指南: 如何启动案例 dApp - EVE Frontier Builder Course](#57-运行指南-如何启动案例-dapp---eve-frontier-builder-course)
- [58. Sui 核心特性创意 100 例 - EVE Frontier Builder Course](#58-sui-核心特性创意-100-例---eve-frontier-builder-course)
- [59. 常规综合创意 100 例 - EVE Frontier Builder Course](#59-常规综合创意-100-例---eve-frontier-builder-course)

## 01. 课程简介 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/index.html

# EVE Frontier 构建者完整课程

每节课约 **2 小时**，共 **54 节**：36 个基础章节 + 18 个实战案例 ≈ **108 小时**完整学习内容。

---

## 📖 章节主线（按建议学习顺序排列，每节约 2 小时）

### 前置章节

| 章节      | 文件                                                                       | 主题摘要                                                      |
| ------- | ------------------------------------------------------------------------ | --------------------------------------------------------- |
| Prelude | [chapter-00.md](https://hoh-zone.github.io/eve-bootcamp/chapter-00.html) | 先读懂 EVE Frontier 这款游戏：玩家在争夺什么、设施为什么重要、位置/战损/物流/经济如何串成完整玩法 |

## 02. 术语表 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/glossary.html

# 术语表

本页统一解释课程中高频出现、且容易在不同章节里重复出现的术语。阅读 Chapter 26-35 与 Example 11-18 时，建议把本页当作速查表。

## AdminACL

World 合约中的服务端授权控制对象。游戏服务器或 Builder 后端会把被允许的 sponsor 地址写入 `AdminACL`，链上逻辑通过 `verify_sponsor` 等校验函数确认调用者是否具备“服务器代表”身份。

## OwnerCap

对象或设施的所有权凭证。很多 World 侧权限检查并不只看 `ctx.sender()`，而是要求调用方显式持有与目标对象关联的 `OwnerCap`。

## AdminCap

Builder 自己模块中的管理员能力对象。它通常在 `init` 时发给发布者，用来写配置、修改规则、暂停功能或提取资金。

## Typed Witness

一种通过类型系统收紧授权边界的模式。EVE Frontier 的 Gate / Turret / Storage Unit 扩展经常用它约束“只有特定模块、特定入口”才能调用敏感 API。

## Shared Object

Sui 上可被多方并发访问的共享对象。World 里的 Gate、Storage Unit、Registry 这一类设施经常采用该模型。

## Derived Object

基于父对象和业务键确定性派生出的对象 ID。KillMail、注册表子对象等场景用它来保证 `业务 ID -> 链上对象 ID` 是稳定且不可重复的。

## Sponsored Transaction

玩家发起、但由 Builder 或服务器代付 Gas 的交易。EVE Vault 支持赞助交易扩展，这也是“用户没有 SUI 也能用 dApp”的核心基础。

## zkLogin

Sui 的无助记词登录方案。用户用 Web2 身份完成 OAuth 登录后，钱包再基于临时密钥、salt、proof 派生链上地址。

## Epoch

Sui 的纪元单位。zkLogin 的临时证明和部分缓存都与 Epoch 绑定，过期后需要重新签发或刷新登录态。

## `0x6`

Sui `Clock` 系统对象的固定对象 ID。文中许多时间相关示例会把 `0x6` 作为参数传入。

## `0x8`

Sui `Random` 系统对象的固定对象 ID。需要链上随机数的示例中通常会传入该对象。

## LUX 与 SUI

课程中的不少案例会“用 `SUI` 代替 `LUX` 演示”，方便在公开环境和标准 SDK 中说明资金流。实际接入 EVE Frontier 时，需以游戏内真实资产与 World/钱包接口为准。

## GraphQL / Indexer

本书里提到的 GraphQL，多数指 Sui 索引层提供的查询入口；Indexer 指围绕事件和对象状态建立的链下检索服务。它们主要负责“读”，而不是“写”。

## 03. 先读懂 EVE Frontier 这款游戏 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-00.html

# 前置章节：先读懂 EVE Frontier 这款游戏

**目标：** 在学习合约、组件和 dApp 之前，先理解 EVE Frontier 里的玩家到底在争夺什么、建设什么、为什么这些机制会天然适合被做成链上规则。

---

状态：前置导读。重点是先建立“游戏玩法直觉”，让后面章节里的 Gate、Turret、StorageUnit、KillMail、LocationProof 不再像抽象名词。

## 0.1 这不是一款“套了链的钱包游戏”

如果你先把 EVE Frontier 想成“一个有 NFT 和代币的太空游戏”，后面大概率会越学越别扭。因为这款游戏真正的核心，不是发资产，而是一个**持续运行、充满资源竞争、地理约束和玩家冲突的开放世界**。

它更接近下面这种组合：

| 维度    | EVE Frontier 更像什么      | 为什么这点重要                           |
| ----- | ---------------------- | --------------------------------- |
| 世界结构  | 持续存在的太空沙盒              | 世界不会因为你下线就暂停，设施、路线、控制区和经济关系会继续变化  |
| 生存压力  | 从“活下来”开始，而不是从“点签到领奖”开始 | 资源、燃料、运输、安全和位置都是真问题               |
| 玩家关系  | 长期合作与长期对抗并存            | 你会需要联盟、补给、通道、防御、外交和报复             |
| 建筑意义  | 建筑不是摆设，而是改变玩法的基础设施     | 星门、炮塔、存储设施会直接影响谁能通过、谁能拿货、谁会被打     |
| 区块链角色 | 公开规则层与资产层              | 重点不是把所有玩法搬上链，而是把值得公开验证的那部分变成可编程规则 |

## 04. Chapter 1: EVE Frontier 宏观架构 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-01.html

# Chapter 1：EVE Frontier 宏观架构与核心概念

**目标：** 理解 EVE Frontier 是什么，它为什么选择 Sui 区块链，以及“可编程宇宙“的核心哲学。

---

状态：基础章节。正文以宏观架构和术语建立为主，适合作为全书入口。

如果你对这款游戏本身还没有形成清晰直觉，建议先读 [前置章节：先读懂 EVE Frontier 这款游戏](https://hoh-zone.github.io/eve-bootcamp/chapter-00.html)。

## 1.1 为什么 EVE Frontier 不一样？

传统网络游戏的世界规则由开发商独断——经济系统、战斗公式、内容更新，玩家只是参与者。EVE Frontier 挑战了这一范式：游戏的核心机制是**开放的**，开发者（Builders）可以在游戏服务器限定的框架内，真正**重写和扩展游戏规则**。

这不是简单的“MOD 插件“——你写下的逻辑会作为智能合约运行在 Sui 公链上，永久可查、无需中心化服务器托管、7×24 自动执行。

### 它不是什么？

初学者最容易把 EVE Frontier 想成以下几种东西，但它都不完全等同：

********************

| 容易混淆的对象         | 为什么像            | 为什么又不一样                                                  |
| --------------- | --------------- | -------------------------------------------------------- |
| 传统 MOD / 插件系统   | 都允许第三方扩展游戏逻辑    | MOD 通常跑在中心化服务器或客户端；EVE Frontier 的关键状态和规则可以上链、可审计、可组合     |
| 私服脚本系统          | 都能改掉默认玩法        | 私服脚本通常由运营方单方面控制；Builder 合约则可以形成公开、可验证的规则市场               |
| 普通链游合约          | 都有 NFT、Token、市场 | EVE Frontier 的重点不是单个资产合约，而是把“星门、炮塔、存储箱”这种游戏基础设施变成可编程对象   |
| 纯 on-chain game | 都强调链上规则         | EVE Frontier 仍保留游戏服务器、物理模拟和实时世界，因此是“链上规则 + 游戏服务器协作”的混合体系 |

## 05. Chapter 2: 开发环境配置 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-02.html

# Chapter 2：Sui 与 EVE 环境配置

**目标：** 只完成本书最基础、最必要的两项安装：`Sui CLI` 与 `EVE Vault`。本章不再展开 Git、Docker、Node.js、pnpm 这类通用开发工具。

---

状态：基础章节。正文只保留 Sui 与 EVE Frontier 直接相关的安装与配置。

## 2.1 本章只安装什么？

这一章只处理两类和本书直接相关的安装项：

********

| 工具        | 版本要求      | 用途            |
| --------- | --------- | ------------- |
| Sui CLI   | testnet 版 | 编译、发布 Move 合约 |
| EVE Vault | 最新版       | 浏览器钱包 + 身份    |

## 06. Chapter 3: Move 合约基础 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-03.html

# Chapter 3：Move 智能合约基础

**目标：** 掌握 Move 语言的核心概念，理解 Sui 对象模型，能看懂并修改 EVE Frontier 的合约代码。

---

状态：基础章节。正文以 Move 语言、对象模型和最小示例为主。

## 3.1 Move 语言概览

Move 是 Sui 使用的智能合约语言，专门为“链上资产不能乱复制、乱丢弃、乱转移”这个问题设计。它不是先写一套通用编程语言，再靠库去约束资产；而是从语言层面就把“资源”当成最重要的对象。

你可以先抓住三个直觉：

- **资产不是一串余额数字** 在 Sui 上，很多资产真的是一个独立对象，有自己的 `id`、字段、所有权和生命周期
- **类型决定你能不能复制、存储、丢弃** Move 会用能力系统限制一个值能做什么，避免你误把“珍贵资产”当成普通变量
- **合约更像模块 + 对象系统** 你写的不是“一份全局大状态”，而是一组模块函数去创建、读取、修改对象

所以学 Move，不是只学语法。你真正要建立的是一套新的思维方式：

1. 先分清什么是普通数据，什么是资源
1. 再分清对象是谁拥有、谁能改、谁能转
1. 最后才是把这些规则写进函数入口和业务流程

这也正适合 EVE Frontier。因为在 EVE 里，很多东西天然就不是“数据库里的一行记录”，而更像独立存在的资产或设施：

- 一张通行证 NFT
- 一个智能星门
- 一个仓储单元
- 一个权限凭证
- 一条击杀记录

这些东西放到 Move 里，表达会非常自然。

---

## 3.2 模块 (Module) 结构

一个 Move 合约由一个或多个**模块**组成：

```
// 文件：sources/my_contract.move

// 模块声明：包名::模块名
module my_package::my_module {

    // 导入依赖
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;

    // 结构体定义（资产/数据）
    public struct MyObject has key, store {
        id: UID,
        value: u64,
    }

    // 初始化函数（合约部署时自动执行一次）
    fun init(ctx: &mut TxContext) {
        let obj = MyObject {
            id: object::new(ctx),
            value: 0,
        };
        transfer::share_object(obj);
    }

    // 公开函数（可被外部调用）
    public fun set_value(obj: &mut MyObject, new_value: u64) {
        obj.value = new_value;
    }
}
```

上面这段代码虽然很短，但已经包含了 Move 最常见的四类元素：

- **模块声明**`module my_package::my_module` 表示“这个文件里定义了一个模块”
- **依赖导入**`use` 用来引入别的模块暴露出来的类型或函数
- **结构体定义**`MyObject` 描述链上对象长什么样
- **函数入口**`init`、`set_value` 这些函数定义对象如何被创建和修改

### 模块和包到底是什么关系？

很多新手会把“包”和“模块”混成一件事，实际上它们不是一个层级：

- **包（Package）** 是一整个 Move 工程目录，通常包含 `Move.toml`、`sources/`、`tests/`
- **模块（Module）** 是包内部的代码单元，一个包里可以有多个模块

举个更接近真实项目的结构：

```
my-extension/
├── Move.toml
├── sources/
│   ├── gate_logic.move
│   ├── gate_auth.move
│   └── pricing.move
└── tests/
    └── gate_tests.move
```

这里：

- `my-extension` 是一个包
- `gate_logic`、`gate_auth`、`pricing` 是三个模块

你可以把“包”理解为部署单位，把“模块”理解为代码组织单位。

### `init` 为什么重要？

`init` 会在包首次发布时执行一次，常见用途包括：

- 创建共享对象
- 给部署者发 `AdminCap`
- 初始化全局配置
- 建立注册表对象

它通常是“系统第一次上线时的开机动作”。如果你在 `init` 里把关键对象没建好，后面很多入口函数都没法正常使用。

### 字段为什么几乎总是从 `id: UID` 开始？

因为在 Sui 上，一个真正的链上对象必须带 `UID`，这代表它有全局唯一身份。没有 `UID` 的 struct 往往只是：

- 普通嵌套数据
- 配置项
- 事件载荷
- 一次性凭证

这也是你以后读 EVE 合约时判断“这是不是独立对象”的第一眼线索。

---

## 3.3 Move 的 Abilities（能力系统）

这是 Move 中最重要的概念之一。每个结构体类型可以拥有以下能力（abilities）：

****************

| 能力    | 关键字         | 含义                   |
| ----- | ----------- | -------------------- |
| Key   | `has key`   | 可以作为 Sui 对象，存储在全局状态中 |
| Store | `has store` | 可以嵌套存储在其他对象中         |
| Copy  | `has copy`  | 可以被隐式复制（谨慎使用！）       |
| Drop  | `has drop`  | 函数结束时可以自动丢弃（不使用也没关系） |

## 07. Chapter 4: 智能组件开发与链上部署 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-04.html

# Chapter 4：智能组件开发与链上部署

**目标：** 理解每种智能组件的工作原理和 API，掌握从角色创建到合约部署的完整工作流。

---

状态：基础章节。正文以部署工作流和链上组件操作为主。

## 4.1 完整的部署工作流

在你的代码能在真实游戏中生效之前，需要完成以下完整链路：

```
1. 创建链上角色 (Smart Character)
        ↓
2. 部署网络节点 (Network Node)，存入燃料并上线
        ↓
3. 锚定智能组件 (Anchor Assembly)
        ↓
4. 将组件上线 (Assembly Online)
        ↓
5. 编写并发布自定义 Move 扩展包
        ↓
6. 将扩展注册到组件 (authorize_extension)
        ↓
7. 玩家通过扩展 API 与组件交互
```

在本地开发中，步骤 1-5 可以用 `builder-scaffold` 的初始化脚本一键完成。

很多人第一次接触这一章时，会误以为“发布合约”才是主流程。实际上不是。对 EVE Builder 来说，真正的主流程是：

1. 先有链上主体
1. 再有可运行的设施
1. 然后才有自定义扩展逻辑
1. 最后把扩展挂到设施上供玩家消费

也就是说，你写出来的 Move 包并不是凭空就能独立工作。它必须挂接到一个真实存在、已经上线、已经归属到角色体系中的智能组件上。

### 这一章最容易混淆的三个“ID”

在部署过程中，至少会同时出现三类 ID：

- **Package ID** 代表你发布到链上的 Move 包
- **Object ID** 代表具体对象，例如角色、星门、炮塔、存储箱
- **业务 ID** 代表游戏服务器里的角色、物品、设施编号

这三者不要混：

- `Package ID` 决定“你的代码在哪里”
- `Object ID` 决定“你的设施和资产在哪里”
- 业务 ID 决定“游戏世界里的东西是谁”

后面你会频繁地在“代码地址”和“设施对象地址”之间来回切换。如果这两个概念不分开，调试时会非常痛苦。

---

## 4.2 Smart Character（智能角色）

Smart Character 是你在链上的 **主体身份**，所有组件都归属于你的角色。

### 角色的链上结构

```
public struct Character has key {
    id: UID,                        // 唯一对象 ID
    // 每个拥有的资产对应一个 OwnerCap
    // owner_caps 以 dynamic field 形式存储
}
```

### OwnerCap：资产所有权凭证

每当你拥有一个组件（网络节点/炮塔/星门/存储箱），角色就会持有对应的 `OwnerCap<T>` 对象。对该组件的所有写操作都需要先从角色中“借用“这个 OwnerCap：

```
// TypeScript 脚本示例：借用 OwnerCap
const [ownerCap] = tx.moveCall({
    target: `${packageId}::character::borrow_owner_cap`,
    typeArguments: [`${packageId}::assembly::Assembly`],
    arguments: [tx.object(characterId), tx.object(ownerCapId)],
});

// ... 使用 ownerCap 执行操作 ...

// 用完必须归还
tx.moveCall({
    target: `${packageId}::character::return_owner_cap`,
    typeArguments: [`${packageId}::assembly::Assembly`],
    arguments: [tx.object(characterId), ownerCap],
});
```

💡 借用-归还 (Borrow & Return) 模式配合 Hot Potato 确保 OwnerCap 不会离开角色对象。

### 为什么不是把 OwnerCap 直接取出来永久持有？

因为 `OwnerCap` 不是普通钥匙，而是高权限凭证。把它设计成“借用后必须归还”，有几个直接好处：

- 权限不会轻易脱离角色体系
- 一笔交易结束后，不会留下悬空的高权限对象
- 组件所有权仍然稳定地归属于角色，而不是散落到脚本地址或临时对象里

从设计上看，这相当于在链上实现了“临时提权”：

- 你先证明自己是角色的合法操作者
- 系统暂时借给你权限对象
- 你完成高权限操作后，必须把权限交还

这比“管理员地址硬编码”更灵活，也更适合游戏场景中的委托、转移、继承、换壳运营等需求。

### Character 在业务上到底扮演什么角色？

不要把 `Character` 只理解成钱包地址的别名。它更像一个链上“经营主体”：

- 组件挂在角色名下，而不是直接挂在钱包地址名下
- 角色内部可以统一管理多个 `OwnerCap`
- 角色可以作为链上权限和游戏内身份的桥梁

所以在很多 Builder 场景里，真正稳定的主体不是“哪个钱包点了按钮”，而是“哪个角色在经营这些设施”。

---

## 4.3 Network Node（网络节点）

### 什么是网络节点？

- 锚定在拉格朗日点（Lagrange Point）的能源站
- 为附近所有智能组件提供 **Energy（能量）**
- 每个组件上线时需要从网络节点“预留“一定量的能量

### 生命周期

```
Anchored（已锚定）
    ↓ depositFuel（存入燃料）
Fueled（已充能）
    ↓ online（上线）
Online（运行中）  ←→ offline（下线）
```

这里最重要的不是记住状态名字，而是理解：

设施能不能工作，不只是“合约有没有发布”，还取决于它在游戏世界里有没有被真正供能。

这正是 EVE Frontier 和普通 dApp 的一个关键差异。普通 dApp 里，合约发布成功后，理论上任何人都能调用；但在 EVE 里，很多设施的可用性还会受到“世界状态”的约束：

- 有没有网络节点
- 网络节点有没有燃料
- 设施有没有被正确锚定
- 设施是不是在线

### 从 Builder 视角看，Network Node 实际解决了什么？

它解决的是“设施不应该无条件永久在线”这个问题。

如果没有这层设计：

- 星门可以永远开放
- 炮塔可以永远工作
- 仓储设施可以一直响应

那游戏里的运营、维护、补给、占领都会失去很多意义。加入网络节点之后，设施就会变成一种真正需要维护的资产，而不是“一次部署永久印钞机”。

### 本地测试用的初始化脚本（来自 builder-scaffold）

```
# 在 builder-scaffold/ts-scripts 目录执行
pnpm setup:character      # 创建角色
pnpm setup:network-node   # 创建并启动网络节点
pnpm setup:assembly       # 创建并连接智能组件
```

---

## 4.4 Smart Storage Unit（智能存储单元）深度解析

### 两种仓库

********

| 仓库类型             | 持有者      | 容量 | 访问方式                    |
| ---------------- | -------- | -- | ----------------------- |
| 主仓库 (Primary)    | 组件 Owner | 大  | `OwnerCap<StorageUnit>` |
| 临时仓库 (Ephemeral) | 交互角色     | 小  | 角色自己的 `OwnerCap`        |

## 08. Chapter 5: dApp 前端开发 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-05.html

# Chapter 5：dApp 前端开发与钱包集成

**目标：** 使用 `@evefrontier/dapp-kit` 构建一个能连接 EVE Vault 钱包、读取链上数据并执行交易的前端 dApp。

---

状态：基础章节。正文以钱包接入、前端状态读取和交易发起为主。

## 5.1 dApp 在 EVE Frontier 中的角色

当你完成了 Move 合约开发后，玩家需要一个界面来与你的设施交互。dApp（去中心化应用）就是这个界面，它可以：

- 显示你的智能组件的实时状态（库存、在线状态等）
- 让玩家连接 EVE Vault 钱包
- 通过 UI 触发链上交易（购买物品、申请跳跃许可等）
- 运行在标准 Web 浏览器中，无需下载游戏客户端

### 两种使用场景

********

| 场景    | 描述                                 |
| ----- | ---------------------------------- |
| 游戏内浮窗 | 玩家在游戏内靠近组件时，游戏客户端显示你的 dApp（iframe） |
| 外部浏览器 | 独立网页，通过 EVE Vault 扩展连接钱包           |

## 09. Example 1: 炮塔白名单 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-01.html

# 实战案例 1：白名单矿区守卫（智能炮塔访问控制）

**目标：** 编写一个智能炮塔扩展，让炮塔只放行持有“矿区通行证 NFT“的玩家；同时构建一个管理界面，让 Owner 能在线颁发通行证。

---

状态：已映射到本地代码目录。正文覆盖通行证 NFT 与炮塔白名单逻辑，适合作为第一个完整 Builder 闭环。

## 对应代码目录

- [example-01](https://hoh-zone.github.io/eve-bootcamp/code/example-01)
- [example-01/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-01/dapp)

## 最小调用链

`Owner 颁发通行证 -> 玩家持有 MiningPass -> 炮塔扩展读取凭证 -> 放行或开火`

## 需求分析

**场景：** 你的联盟在深空开采到了一片稀有矿区，部署了一个智能炮塔保护基地。但你希望区别对待不同角色：

- ✅ **联盟成员**：持有 `MiningPass` NFT，炮塔放行
- ❌ **非成员**：没有 `MiningPass`，炮塔自动开火

**额外要求：**

- Owner（你）可以通过 dApp 给信任角色颁发 `MiningPass`
- `MiningPass` 可以被 Owner 撤销
- dApp 显示当前受保护状态和通行证持有者列表

---

## 第一部分：Move 合约开发

### 目录结构

```
mining-guard/
├── Move.toml
└── sources/
    ├── mining_pass.move      # NFT 定义
    └── guard_extension.move  # 炮塔扩展
```

### 第一步：定义 MiningPass NFT

```
// sources/mining_pass.move
module mining_guard::mining_pass;

use sui::object::{Self, UID};
use sui::tx_context::TxContext;
use sui::transfer;
use sui::event;

/// 矿区通行证 NFT
public struct MiningPass has key, store {
    id: UID,
    holder_name: vector<u8>,    // 持有者名称（方便辨识）
    issued_at_ms: u64,          // 颁发时间戳
    zone_id: u64,               // 对应哪个矿区（支持多矿区）
}

/// 管理员能力（只有合约部署者持有）
public struct AdminCap has key, store {
    id: UID,
}

/// 事件：新通行证颁发
public struct PassIssued has copy, drop {
    pass_id: ID,
    recipient: address,
    zone_id: u64,
}

/// 合约初始化：部署者获得 AdminCap
fun init(ctx: &mut TxContext) {
    let admin_cap = AdminCap {
        id: object::new(ctx),
    };
    // 将 AdminCap 转给部署者地址
    transfer::transfer(admin_cap, ctx.sender());
}

/// 颁发矿区通行证（只有持有 AdminCap 才能调用）
public fun issue_pass(
    _admin_cap: &AdminCap,             // 验证调用者是管理员
    recipient: address,                 // 接收者地址
    holder_name: vector<u8>,
    zone_id: u64,
    ctx: &mut TxContext,
) {
    let pass = MiningPass {
        id: object::new(ctx),
        holder_name,
        issued_at_ms: ctx.epoch_timestamp_ms(),
        zone_id,
    };

    // 发射事件
    event::emit(PassIssued {
        pass_id: object::id(&pass),
        recipient,
        zone_id,
    });

    // 将通行证转给接收者
    transfer::transfer(pass, recipient);
}

/// 撤销通行证
/// Owner 可以通过 admin_cap 销毁指定角色的通行证
/// （实际上，你可以设计成"收回+销毁"，这里简化为让持有者自行烧毁）
public fun revoke_pass(
    _admin_cap: &AdminCap,
    pass: MiningPass,
) {
    let MiningPass { id, .. } = pass;
    id.delete();
}

/// 检查通行证是否属于特定矿区
public fun is_valid_for_zone(pass: &MiningPass, zone_id: u64): bool {
    pass.zone_id == zone_id
}
```

### 第二步：编写炮塔扩展

```
// sources/guard_extension.move
module mining_guard::guard_extension;

use mining_guard::mining_pass::{Self, MiningPass};
use world::turret::{Self, Turret};
use world::character::Character;
use sui::tx_context::TxContext;

/// 炮塔扩展的 Witness 类型
public struct GuardAuth has drop {}

/// 受保护的矿区 ID（这个版本保护 zone 1）
const PROTECTED_ZONE_ID: u64 = 1;

/// 请求安全通行（玩家持有通行证则被炮塔放过）
/// 
/// 注意：实际炮塔的"不开火"逻辑由游戏服务器执行，
/// 这里的合约用于验证和记录许可意图
public fun request_safe_passage(
    turret: &mut Turret,
    character: &Character,
    pass: &MiningPass,           // 必须持有通行证
    ctx: &mut TxContext,
) {
    // 验证通行证属于正确的矿区
    assert!(
        mining_pass::is_valid_for_zone(pass, PROTECTED_ZONE_ID),
        0  // 错误码：无效的矿区通行证
    );

    // 调用炮塔的安全通行函数，传入 GuardAuth{} 作为扩展凭证
    // （实际 API 以世界合约为准）
    turret::grant_safe_passage(
        turret,
        character,
        GuardAuth {},
        ctx,
    );
}
```

### 第三步：编译和发布

```
cd mining-guard

# 编译检查
sui move build

# 发布到测试网
sui client publish 

# 记录输出：
# Package ID: 0x_YOUR_PACKAGE_ID_
# AdminCap Object ID: 0x_YOUR_ADMIN_CAP_
```

### 第四步：注册扩展到炮塔

```
// scripts/register-extension.ts
import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const WORLD_PACKAGE = "0x...";
const MY_PACKAGE = "0x_YOUR_PACKAGE_ID_";
const TURRET_ID = "0x...";
const CHARACTER_ID = "0x...";
const OWNER_CAP_ID = "0x...";

async function registerExtension() {
  const client = new SuiClient({ url: "https://fullnode.testnet.sui.io:443" });
  const keypair = Ed25519Keypair.fromSecretKey(/* your key */);

  const tx = new Transaction();

  // 1. 从角色借用炮塔的 OwnerCap
  const [ownerCap] = tx.moveCall({
    target: `${WORLD_PACKAGE}::character::borrow_owner_cap`,
    typeArguments: [`${WORLD_PACKAGE}::turret::Turret`],
    arguments: [tx.object(CHARACTER_ID), tx.object(OWNER_CAP_ID)],
  });

  // 2. 注册我们的扩展
  tx.moveCall({
    target: `${WORLD_PACKAGE}::turret::authorize_extension`,
    typeArguments: [`${MY_PACKAGE}::guard_extension::GuardAuth`],
    arguments: [tx.object(TURRET_ID), ownerCap],
  });

  // 3. 归还 OwnerCap
  tx.moveCall({
    target: `${WORLD_PACKAGE}::character::return_owner_cap`,
    typeArguments: [`${WORLD_PACKAGE}::turret::Turret`],
    arguments: [tx.object(CHARACTER_ID), ownerCap],
  });

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });
  console.log("扩展注册成功！Tx:", result.digest);
}

registerExtension();
```

---

## 第二部分：管理员 dApp

### 功能：颁发通行证界面

```
// src/AdminPanel.tsx
import { useState } from 'react'
import { useDAppKit } from '@mysten/dapp-kit-react'
import { useConnection } from '@evefrontier/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'

const MY_PACKAGE = "0x_YOUR_PACKAGE_ID_"
const ADMIN_CAP_ID = "0x_YOUR_ADMIN_CAP_"

export function AdminPanel() {
  const { isConnected, handleConnect } = useConnection()
  const dAppKit = useDAppKit()
  const [recipient, setRecipient] = useState('')
  const [holderName, setHolderName] = useState('')
  const [status, setStatus] = useState('')

  const issuePass = async () => {
    if (!recipient || !holderName) {
      setStatus('❌ 请填写接收者地址和名称')
      return
    }

    const tx = new Transaction()
    tx.moveCall({
      target: `${MY_PACKAGE}::mining_pass::issue_pass`,
      arguments: [
        tx.object(ADMIN_CAP_ID),
        tx.pure.address(recipient),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(holderName))),
        tx.pure.u64(1), // 矿区 Zone ID
      ],
    })

    try {
      setStatus('⏳ 交易提交中...')
      const result = await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus(`✅ 通行证已颁发！Tx: ${result.digest.slice(0, 12)}...`)
    } catch (e: any) {
      setStatus(`❌ 失败：${e.message}`)
    }
  }

  if (!isConnected) {
    return (
      <div className="admin-panel">
        <button onClick={handleConnect}>🔗 连接管理员钱包</button>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <h2>🛡 矿区通行证管理</h2>

      <div className="form-group">
        <label>接收者 Sui 地址</label>
        <input
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          placeholder="0x..."
        />
      </div>

      <div className="form-group">
        <label>持有者名称</label>
        <input
          value={holderName}
          onChange={e => setHolderName(e.target.value)}
          placeholder="Mining Corp Alpha"
        />
      </div>

      <button className="issue-btn" onClick={issuePass}>
        📜 颁发矿区通行证
      </button>

      {status && <p className="status">{status}</p>}
    </div>
  )
}
```

---

## 第三部分：玩家端 dApp

```
// src/PlayerPanel.tsx
import { useConnection, useSmartObject } from '@evefrontier/dapp-kit'
import { useDAppKit } from '@mysten/dapp-kit-react'
import { Transaction } from '@mysten/sui/transactions'

const MY_PACKAGE = "0x_YOUR_PACKAGE_ID_"
const TURRET_ID = "0x..."
const CHARACTER_ID = "0x..."

export function PlayerPanel() {
  const { isConnected, handleConnect } = useConnection()
  const { assembly, loading } = useSmartObject()
  const dAppKit = useDAppKit()
  const [passId, setPassId] = useState('')
  const [status, setStatus] = useState('')

  const requestPassage = async () => {
    const tx = new Transaction()
    tx.moveCall({
      target: `${MY_PACKAGE}::guard_extension::request_safe_passage`,
      arguments: [
        tx.object(TURRET_ID),
        tx.object(CHARACTER_ID),
        tx.object(passId),  // 玩家的 MiningPass Object ID
      ],
    })

    try {
      await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus('✅ 安全通行已记录，炮塔将放行')
    } catch (e: any) {
      setStatus('❌ 通行证验证失败，无法进入矿区')
    }
  }

  if (!isConnected) return <button onClick={handleConnect}>连接钱包</button>
  if (loading) return <div>加载炮塔状态...</div>

  return (
    <div className="player-panel">
      <h2>⚡ {assembly?.name ?? '矿区守卫炮塔'}</h2>
      <p>状态：{assembly?.status}</p>

      <div className="pass-input">
        <label>输入你的矿区通行证 Object ID</label>
        <input
          value={passId}
          onChange={e => setPassId(e.target.value)}
          placeholder="0x..."
        />
        <button onClick={requestPassage}>🛡 申请安全通行</button>
      </div>

      {status && <p>{status}</p>}
    </div>
  )
}
```

---

## 🎯 完整实现回顾

```
1. Move 合约
   ├── mining_pass.move → 定义 MiningPass NFT + AdminCap + issue_pass / revoke_pass
   └── guard_extension.move → 炮塔扩展 + request_safe_passage（验证通行证后调用炮塔 API）

2. 注册流程
   └── authorize_extension<GuardAuth>(turret, owner_cap)

3. 管理员 dApp
   └── 输入地址和名称 → 调用 issue_pass → 将 NFT 转给目标角色

4. 玩家 dApp
   └── 输入通行证 ID → 调用 request_safe_passage → 炮塔放行记录上链
```

## 🔧 扩展练习

1. 给 `MiningPass` 添加过期时间，过期后炮塔不再放行
1. 在合约中记录所有活跃通行证的集合，供 dApp 查询展示
1. 实现“团队许可证“：一张许可证可供多个预定成员使用

---

## 📚 关联文档

- [Smart Turret 文档](https://github.com/evefrontier/builder-documentation/blob/main/smart-assemblies/turret/README.md)
- [Chapter 3：Move 安全模式](https://hoh-zone.github.io/eve-bootcamp/chapter-03.html)
- [Chapter 4：注册扩展到组件](https://hoh-zone.github.io/eve-bootcamp/chapter-04.html)

## 10. Example 2: 星门收费站 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-02.html

# 实战案例 2：太空高速收费站（智能星门收费系统）

**目标：** 编写一个智能星门扩展，实现按次收取 LUX 代币通行费；并建立一个面向玩家的购票 dApp 界面。

---

状态：已映射到本地代码目录。正文覆盖收费星门、票据与金库三件套，是最典型的 Builder 商业化案例之一。

## 对应代码目录

- [example-02](https://hoh-zone.github.io/eve-bootcamp/code/example-02)
- [example-02/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-02/dapp)

## 最小调用链

`玩家支付通行费 -> 金库收款 -> 铸造 JumpTicket -> 星门校验票据 -> 完成跳跃`

## 需求分析

**场景：** 你和联盟控制了两个星门组成的战略要道，连接了宇宙两个繁忙区域。你决定将这条航线商业化：

- 🎟 任何玩家想跳跃，必须支付 **50 LUX** 购买 `JumpTicket`
- 🏦 所有收取的 LUX 进入金库（合约管理的共享对象）
- 💰 只有 Owner（你）可以提取金库中的 LUX
- 📊 dApp 实时显示当前票价、跳跃次数、金库余额

---

## 第一部分：Move 合约开发

### 目录结构

```
toll-gate/
├── Move.toml
└── sources/
    ├── treasury.move       # 金库：收集和管理 LUX
    └── toll_gate.move      # 星门扩展：收费逻辑
```

### 第一步：定义金库合约

```
// sources/treasury.move
module toll_gate::treasury;

use sui::object::{Self, UID};
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::tx_context::TxContext;
use sui::transfer;
use sui::event;

// ── 类型定义 ─────────────────────────────────────────────

/// 这里用 SUI 代币代表 LUX（演示）
/// 真实部署中换成 LUX 的 Coin 类型

/// 金库：收集所有通行费
public struct TollTreasury has key {
    id: UID,
    balance: Balance<SUI>,
    total_jumps: u64,      // 累计跳跃次数（统计用）
    toll_amount: u64,      // 当前票价（以 MIST 计，1 SUI = 10^9 MIST）
}

/// OwnerCap：只有持有此对象才能提取金库资金
public struct TreasuryOwnerCap has key, store {
    id: UID,
}

// ── 事件 ──────────────────────────────────────────────────

public struct TollCollected has copy, drop {
    payer: address,
    amount: u64,
    total_jumps: u64,
}

public struct TollWithdrawn has copy, drop {
    recipient: address,
    amount: u64,
}

// ── 初始化 ────────────────────────────────────────────────

fun init(ctx: &mut TxContext) {
    // 创建金库（共享对象，任何人可以存入）
    let treasury = TollTreasury {
        id: object::new(ctx),
        balance: balance::zero(),
        total_jumps: 0,
        toll_amount: 50_000_000_000,  // 50 SUI（单位：MIST）
    };

    // 创建 Owner 凭证（转给部署者）
    let owner_cap = TreasuryOwnerCap {
        id: object::new(ctx),
    };

    transfer::share_object(treasury);
    transfer::transfer(owner_cap, ctx.sender());
}

// ── 公开函数 ──────────────────────────────────────────────

/// 存入通行费（由星门扩展调用）
public fun deposit_toll(
    treasury: &mut TollTreasury,
    payment: Coin<SUI>,
    payer: address,
) {
    let amount = coin::value(&payment);

    // 验证金额正确
    assert!(amount >= treasury.toll_amount, 1); // E_INSUFFICIENT_FEE

    treasury.total_jumps = treasury.total_jumps + 1;
    balance::join(&mut treasury.balance, coin::into_balance(payment));

    event::emit(TollCollected {
        payer,
        amount,
        total_jumps: treasury.total_jumps,
    });
}

/// 提取金库 LUX（只有持有 TreasuryOwnerCap 才能调用）
public fun withdraw(
    treasury: &mut TollTreasury,
    _cap: &TreasuryOwnerCap,
    amount: u64,
    ctx: &mut TxContext,
) {
    let coin = coin::take(&mut treasury.balance, amount, ctx);
    transfer::public_transfer(coin, ctx.sender());

    event::emit(TollWithdrawn {
        recipient: ctx.sender(),
        amount,
    });
}

/// 修改票价（Owner 调用）
public fun set_toll_amount(
    treasury: &mut TollTreasury,
    _cap: &TreasuryOwnerCap,
    new_amount: u64,
) {
    treasury.toll_amount = new_amount;
}

/// 读取当前票价
public fun toll_amount(treasury: &TollTreasury): u64 {
    treasury.toll_amount
}

/// 读取金库余额
public fun balance_amount(treasury: &TollTreasury): u64 {
    balance::value(&treasury.balance)
}
```

### 第二步：编写星门扩展

```
// sources/toll_gate.move
module toll_gate::toll_gate_ext;

use toll_gate::treasury::{Self, TollTreasury};
use world::gate::{Self, Gate};
use world::character::Character;
use sui::coin::Coin;
use sui::sui::SUI;
use sui::clock::Clock;
use sui::tx_context::TxContext;

/// 星门扩展的 Witness 类型
public struct TollAuth has drop {}

/// 默认跳跃许可有效期：15 分钟
const PERMIT_DURATION_MS: u64 = 15 * 60 * 1000;

/// 支付通行费并获得跳跃许可
public fun pay_toll_and_get_permit(
    source_gate: &Gate,
    destination_gate: &Gate,
    character: &Character,
    treasury: &mut TollTreasury,
    payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // 1. 收取通行费
    treasury::deposit_toll(treasury, payment, ctx.sender());

    // 2. 计算 Permit 过期时间
    let expires_at = clock.timestamp_ms() + PERMIT_DURATION_MS;

    // 3. 向星门申请跳跃许可（TollAuth{} 是扩展凭证）
    gate::issue_jump_permit(
        source_gate,
        destination_gate,
        character,
        TollAuth {},
        expires_at,
        ctx,
    );

    // 注意：JumpPermit 对象会被自动转给 character 的 Owner
}
```

### 第三步：发布合约

```
cd toll-gate

sui move build

sui client publish 

# 记录：
# Package ID: 0x_TOLL_PACKAGE_
# TollTreasury ID: 0x_TREASURY_ID_（共享对象）
# TreasuryOwnerCap ID: 0x_OWNER_CAP_ID_
```

### 第四步：注册扩展到星门

```
// scripts/authorize-toll-gate.ts
import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";

const WORLD_PACKAGE = "0x...";
const TOLL_PACKAGE = "0x_TOLL_PACKAGE_";
const GATE_ID = "0x...";
const CHARACTER_ID = "0x...";
const GATE_OWNER_CAP_ID = "0x...";

async function authorizeTollGate() {
  const client = new SuiClient({ url: "https://fullnode.testnet.sui.io:443" });
  const tx = new Transaction();

  // 借用星门 OwnerCap
  const [ownerCap] = tx.moveCall({
    target: `${WORLD_PACKAGE}::character::borrow_owner_cap`,
    typeArguments: [`${WORLD_PACKAGE}::gate::Gate`],
    arguments: [tx.object(CHARACTER_ID), tx.object(GATE_OWNER_CAP_ID)],
  });

  // 注册 TollAuth 作为授权扩展
  tx.moveCall({
    target: `${WORLD_PACKAGE}::gate::authorize_extension`,
    typeArguments: [`${TOLL_PACKAGE}::toll_gate_ext::TollAuth`],
    arguments: [tx.object(GATE_ID), ownerCap],
  });

  // 归还 OwnerCap
  tx.moveCall({
    target: `${WORLD_PACKAGE}::character::return_owner_cap`,
    typeArguments: [`${WORLD_PACKAGE}::gate::Gate`],
    arguments: [tx.object(CHARACTER_ID), ownerCap],
  });

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });
  console.log("收费站扩展注册成功！", result.digest);
}
```

---

## 第二部分：玩家购票 dApp

### 完整购票界面

```
// src/TollGateApp.tsx
import { useState, useEffect } from 'react'
import { useConnection, useSmartObject, getObjectWithJson } from '@evefrontier/dapp-kit'
import { useDAppKit } from '@mysten/dapp-kit-react'
import { Transaction } from '@mysten/sui/transactions'

const WORLD_PACKAGE = "0x..."
const TOLL_PACKAGE = "0x_TOLL_PACKAGE_"
const SOURCE_GATE_ID = "0x..."
const DEST_GATE_ID = "0x..."
const CHARACTER_ID = "0x..."
const TREASURY_ID = "0x_TREASURY_ID_"

interface TreasuryData {
  toll_amount: string
  total_jumps: string
  balance: string
}

export function TollGateApp() {
  const { isConnected, handleConnect, currentAddress } = useConnection()
  const { assembly, loading } = useSmartObject()
  const dAppKit = useDAppKit()

  const [treasury, setTreasury] = useState<TreasuryData | null>(null)
  const [txStatus, setTxStatus] = useState('')
  const [isPaying, setIsPaying] = useState(false)

  // 加载金库数据
  const loadTreasury = async () => {
    const data = await getObjectWithJson(TREASURY_ID)
    if (data?.content?.dataType === 'moveObject') {
      setTreasury(data.content.fields as TreasuryData)
    }
  }

  useEffect(() => {
    loadTreasury()
    const interval = setInterval(loadTreasury, 10_000) // 每 10 秒刷新
    return () => clearInterval(interval)
  }, [])

  const payAndJump = async () => {
    if (!isConnected) {
      setTxStatus('❌ 请先连接钱包')
      return
    }

    setIsPaying(true)
    setTxStatus('⏳ 提交交易中...')

    const tollAmount = BigInt(treasury?.toll_amount ?? 50_000_000_000)
    const tx = new Transaction()

    // 分割出票价金额的 SUI
    const [paymentCoin] = tx.splitCoins(tx.gas, [
      tx.pure.u64(tollAmount)
    ])

    // 调用收费并获取 Permit
    tx.moveCall({
      target: `${TOLL_PACKAGE}::toll_gate_ext::pay_toll_and_get_permit`,
      arguments: [
        tx.object(SOURCE_GATE_ID),
        tx.object(DEST_GATE_ID),
        tx.object(CHARACTER_ID),
        tx.object(TREASURY_ID),
        paymentCoin,
        tx.object('0x6'), // Clock 系统对象
      ],
    })

    try {
      const result = await dAppKit.signAndExecuteTransaction({
        transaction: tx,
      })
      setTxStatus(`✅ 已获得跳跃许可！ Tx: ${result.digest.slice(0, 12)}...`)
      loadTreasury() // 刷新金库数据
    } catch (e: any) {
      setTxStatus(`❌ ${e.message}`)
    } finally {
      setIsPaying(false)
    }
  }

  const tollInSui = treasury
    ? (Number(treasury.toll_amount) / 1e9).toFixed(2)
    : '...'

  const balanceInSui = treasury
    ? (Number(treasury.balance) / 1e9).toFixed(2)
    : '...'

  return (
    <div className="toll-gate-app">
      {/* 星门信息 */}
      <header className="gate-header">
        <div className="gate-icon">🌀</div>
        <div>
          <h1>{loading ? '...' : assembly?.name ?? '星门'}</h1>
          <span className={`status-badge ${assembly?.status?.toLowerCase()}`}>
            {assembly?.status ?? '检测中...'}
          </span>
        </div>
      </header>

      {/* 通行费信息 */}
      <section className="toll-info">
        <div className="info-card">
          <span className="label">💰 当前票价</span>
          <span className="value">{tollInSui} SUI</span>
        </div>
        <div className="info-card">
          <span className="label">🚀 累计跳跃</span>
          <span className="value">{treasury?.total_jumps ?? '...'} 次</span>
        </div>
        <div className="info-card">
          <span className="label">🏦 金库余额</span>
          <span className="value">{balanceInSui} SUI</span>
        </div>
      </section>

      {/* 跳跃操作 */}
      <section className="jump-section">
        {!isConnected ? (
          <button className="connect-btn" onClick={handleConnect}>
            🔗 连接 EVE Vault 钱包
          </button>
        ) : (
          <>
            <div className="wallet-info">
              ✅ {currentAddress?.slice(0, 6)}...{currentAddress?.slice(-4)}
            </div>
            <button
              className="jump-btn"
              onClick={payAndJump}
              disabled={isPaying || assembly?.status !== 'Online'}
            >
              {isPaying ? '⏳ 处理中...' : `🛸 支付 ${tollInSui} SUI 并跃迁`}
            </button>
          </>
        )}

        {txStatus && (
          <div className={`tx-status ${txStatus.startsWith('✅') ? 'success' : 'error'}`}>
            {txStatus}
          </div>
        )}
      </section>

      {/* 目的地信息 */}
      <section className="destination-info">
        <p>📍 目的地：<strong>Alpha Centauri 矿区</strong></p>
        <p>⏱ 许可证有效期：<strong>15 分钟</strong></p>
      </section>
    </div>
  )
}
```

---

## 第三部分：Owner 管理面板

```
// src/OwnerPanel.tsx
import { useDAppKit } from '@mysten/dapp-kit-react'
import { Transaction } from '@mysten/sui/transactions'

const TOLL_PACKAGE = "0x_TOLL_PACKAGE_"
const TREASURY_ID = "0x_TREASURY_ID_"
const OWNER_CAP_ID = "0x_OWNER_CAP_ID_"

export function OwnerPanel({ treasuryBalance }: { treasuryBalance: number }) {
  const dAppKit = useDAppKit()
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [newToll, setNewToll] = useState('')
  const [status, setStatus] = useState('')

  const withdraw = async () => {
    const amountMist = Math.floor(parseFloat(withdrawAmount) * 1e9)

    const tx = new Transaction()
    tx.moveCall({
      target: `${TOLL_PACKAGE}::treasury::withdraw`,
      arguments: [
        tx.object(TREASURY_ID),
        tx.object(OWNER_CAP_ID),
        tx.pure.u64(amountMist),
      ],
    })

    try {
      await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus(`✅ 已提取 ${withdrawAmount} SUI`)
    } catch (e: any) {
      setStatus(`❌ ${e.message}`)
    }
  }

  const updateToll = async () => {
    const amountMist = Math.floor(parseFloat(newToll) * 1e9)

    const tx = new Transaction()
    tx.moveCall({
      target: `${TOLL_PACKAGE}::treasury::set_toll_amount`,
      arguments: [
        tx.object(TREASURY_ID),
        tx.object(OWNER_CAP_ID),
        tx.pure.u64(amountMist),
      ],
    })

    try {
      await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus(`✅ 票价已更新为 ${newToll} SUI`)
    } catch (e: any) {
      setStatus(`❌ ${e.message}`)
    }
  }

  return (
    <div className="owner-panel">
      <h2>⚙️ 收费站管理</h2>

      <div className="panel-section">
        <h3>💵 提取收入</h3>
        <p>金库余额：{(treasuryBalance / 1e9).toFixed(2)} SUI</p>
        <input
          type="number"
          value={withdrawAmount}
          onChange={e => setWithdrawAmount(e.target.value)}
          placeholder="提取金额（SUI）"
        />
        <button onClick={withdraw}>提取到钱包</button>
      </div>

      <div className="panel-section">
        <h3>🏷 调整票价</h3>
        <input
          type="number"
          value={newToll}
          onChange={e => setNewToll(e.target.value)}
          placeholder="新票价（SUI）"
        />
        <button onClick={updateToll}>更新票价</button>
      </div>

      {status && <p className="status">{status}</p>}
    </div>
  )
}
```

---

## 🎯 完整实现回顾

```
Move 合约层
├── treasury.move
│   ├── TollTreasury（共享金库对象）
│   ├── TreasuryOwnerCap（提款权凭证）
│   ├── deposit_toll()      ← 扩展调用
│   ├── withdraw()          ← Owner 调用
│   └── set_toll_amount()   ← Owner 调用
│
└── toll_gate_ext.move
    ├── TollAuth（Witness 类型）
    └── pay_toll_and_get_permit()  ← 玩家调用
        ├── 1. 验证并收费 → treasury.deposit_toll()
        └── 2. 颁发许可 → gate::issue_jump_permit()

dApp 层
├── TollGateApp.tsx       → 玩家购票界面
│   ├── 实时显示票价、跳跃次数、金库余额
│   └── 一键支付并获取 JumpPermit
└── OwnerPanel.tsx        → 管理员面板
    ├── 提取金库收入
    └── 调整票价
```

---

## 🔧 扩展练习

1. **等级会员制**：联盟成员持有会员 NFT 可享受折扣（检查 NFT 后应用不同票价）
1. **限时免费通道**：在特定时间段（如维护期）自动接受 0 LUX Permit
1. **收益分配**：金库收入自动按比例分配给多个联盟股东地址
1. **历史记录 dApp**：监听 `TollCollected` 事件，展示最近 50 次跳跃记录

---

## 📚 关联文档

- [Smart Gate 文档](https://github.com/evefrontier/builder-documentation/blob/main/smart-assemblies/gate/README.md)
- [Interfacing with the World](https://github.com/evefrontier/builder-documentation/blob/main/smart-contracts/interfacing-with-the-eve-frontier-world.md)
- [Chapter 3：Move 资源与 Coin 模型](https://hoh-zone.github.io/eve-bootcamp/chapter-03.html)
- [Chapter 5：dApp 发起链上交易](https://hoh-zone.github.io/eve-bootcamp/chapter-05.html)
- [builder-scaffold Smart Gate 示例](https://github.com/evefrontier/builder-scaffold/tree/main/move-contracts/smart_gate)

## 11. Chapter 6: 项目结构与合约开发 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-06.html

# 第6章：Builder Scaffold 完整使用指南（一）——项目结构与合约开发

**学习目标**：掌握 `builder-scaffold` 的完整目录结构，理解 Docker 和本机两种开发流程，并能独立完成 smart_gate 合约的本地开发与发布。

---

状态：已映射到本地脚手架目录。正文命令以本仓库现有 `builder-scaffold` 目录为准。

## 最小调用链

`启动本地链 -> 编译 smart_gate -> 发布 -> 记录 package/object id -> 配置规则 -> 发 permit`

## 对应代码目录

- [builder-scaffold](https://github.com/evefrontier/builder-scaffold)

## 1. 什么是 Builder Scaffold？

`builder-scaffold` 是 EVE Frontier 官方提供的**一站式 Builder 开发脚手架**，包含：

- **Move 合约模板**：两个完整的 Smart Gate Extension 示例
- **TypeScript 交互脚本**：发布后立即可用的链上交互脚本
- **Docker 开发环境**：零配置、开箱即用的本地链
- **dApp 模板**：React + EVE Frontier dapp-kit 的前端起点

```
builder-scaffold/
├── docker/             # Docker 开发环境（Sui CLI + Node.js 容器）
├── move-contracts/     # Move 合约示例
│   ├── smart_gate/     # 主要示例：Star Gate Extension
│   ├── storage_unit/   # 存储单元 Extension 示例
│   └── tokens/         # 代币合约示例
├── ts-scripts/         # TypeScript 交互脚本
│   ├── smart_gate/     # 针对 smart_gate 的 6 个操作脚本
│   ├── utils/          # 公共工具：env配置、derive-object-id、proof
│   └── helpers/        # 查询 OwnerCap 等辅助函数
├── dapps/              # React dApp 模板（EVE Frontier dapp-kit）
└── docs/               # 完整的部署流程文档
```

这一章最重要的不是背目录，而是理解：

`builder-scaffold` 不是一个示例仓库而已，它其实是在替你把“本地链、合约、脚本、前端”这几条线预先接好。

所以真正的价值是：

- 降低第一次打通闭环的成本
- 给你一个能边改边跑的标准骨架
- 让后面的自定义开发尽量从“改模板”开始，而不是从“自己搭平台”开始

---

## 2. 选择开发流程

官方支持两种流程：

********

| 流程         | 适用场景                 | 前置要求              |
| ---------- | -------------------- | ----------------- |
| Docker 流程  | 不想在本机安装 Sui/Node 的用户 | 仅 Docker          |
| 本机（Host）流程 | 已有 Sui CLI + Node.js | Sui CLI + Node.js |

## 12. Chapter 7: TS 脚本与 dApp 开发 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-07.html

# 第7章：Builder Scaffold 完整使用指南（二）——TS 脚本与 dApp 开发

**学习目标**：掌握 `ts-scripts/` 中 6 个交互脚本的用法与原理，理解 `helper.ts` 工具链，并学会在 `dapps/` React 模板的基础上构建属于自己的 EVE Frontier dApp。

---

状态：已映射脚本与 dApp 目录。正文以本仓库内 `builder-scaffold` 的脚本布局为准。

## 最小调用链

`读取 .env -> helper.ts 初始化客户端/对象 ID -> TS 脚本发起 PTB -> 链上对象变化 -> dApp 查询并展示新状态`

## 目录职责边界

把 `builder-scaffold` 用顺，关键不是记住每个脚本名，而是先分清三层职责：

| 目录/文件                        | 责任                 | 不应该承担的事       |
| ---------------------------- | ------------------ | ------------- |
| `ts-scripts/smart_gate/*`    | 组织单个业务动作，拼装 PTB    | 塞大量共享工具函数     |
| `ts-scripts/utils/helper.ts` | 初始化客户端、读取环境、封装公共查询 | 写具体业务规则       |
| `dapps/src/*`                | 展示状态、发起交互、承接钱包连接   | 直接硬编码环境和对象 ID |

## 13. Chapter 8: 赞助交易与服务端集成 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-08.html

# Chapter 8：赞助交易与服务端集成

**目标：** 深入理解 EVE Frontier 的赞助交易机制，掌握如何构建后端服务来验证业务逻辑并代玩家支付 Gas，实现无摩擦的游戏体验。

---

状态：工程章节。正文以赞助交易、服务端校验和链上链下协同为主。

## 8.1 什么是赞助交易？

在普通的 Sui 交易中，**发起者**（Sender）和 **Gas 付款人**（Gas Owner）是同一个人。赞助交易允许这两个角色分离：

```
普通交易：  玩家签名 + 玩家付 Gas
赞助交易：  玩家签名意图 + 服务器验证 + 服务器付 Gas
```

**对 EVE Frontier 至关重要**，因为：

- 某些操作需要**游戏服务器验证**（如临近性证明、距离检查）
- 降低玩家的**入门门槛**（不需要提前充值 SUI 做 Gas）
- 实现**业务级别的风控**：服务器可以拒绝非法请求

这里真正的关键不是“谁替谁付 Gas”这么简单，而是：

赞助交易把一次玩家操作拆成了“用户意图 + 服务端审核 + 链上执行”三段。

这让很多原本很难做的产品体验成为可能：

- 玩家不需要先准备 SUI
- 服务端可以在上链前做业务判断
- 风险控制可以发生在签名前，而不是等资产出事后再补救

但代价也很明确：你的系统不再只是前端 + 合约，而是正式进入“链上链下协同系统”。

---

## 8.2 AdminACL：游戏服务器的权限对象

EVE Frontier 通过 `AdminACL` 共享对象来管理哪些服务器地址被授权作为赞助者：

```
GovernorCap
    └──（管理）AdminACL（共享对象）
                └── sponsors: vector<address>
                    ├── 游戏服务器1地址
                    ├── 游戏服务器2地址
                    └── ...
```

需要服务器参与的操作（如跳跃）在合约中有类似这样的检查：

```
public fun verify_sponsor(admin_acl: &AdminACL, ctx: &TxContext) {
    // tx_context::sponsor() 返回 Gas 付款人的地址
    let sponsor = ctx.sponsor().unwrap(); // 如果没有 sponsor 则 abort
    assert!(
        vector::contains(&admin_acl.sponsors, &sponsor),
        EUnauthorizedSponsor,
    );
}
```

这意味着：即使玩家自己构造了一个合法的交易，如果没有授权服务器签名，调用 `jump_with_permit` 等函数也会 abort。

### `AdminACL` 真正表达的是什么？

它表达的不是“这个服务器技术上能签名”，而是：

这个服务器被世界规则正式信任，可以为某类敏感动作背书。

这和普通后端服务有本质区别。很多 Web 应用里，后端只是帮你做业务判断；在这里，后端本身还是链上权限模型的一部分。

所以一旦 `AdminACL` 管理混乱，影响的不是单个接口，而是整条可信链：

- 谁能代付
- 谁能为临近性证明背书
- 谁能发起某些受限动作

---

## 8.3 赞助交易的完整流程

```
   玩家                    你的后端服务                   Sui 网络
    │                          │                            │
    │── 1. 构建 Transaction ──►│                            │
    │   (setSender = 玩家地址)  │                            │
    │                          │                            │
    │◄── 2. 后端验证业务逻辑 ───│                            │
    │   (检查临近性、余额等)    │                            │
    │                          │                            │
    │── 3. 玩家签名 (Sender) ──►│                            │
    │                          │                            │
    │                          │── 4. 服务器签名 (Gas) ─────►│
    │                          │   (setGasOwner = 服务器)   │
    │                          │                            │
    │◄─────────────────────────┼── 5. 交易执行结果 ─────────│
```

### 这条链路里每一段分别在防什么？

- **玩家构建交易** 防止服务端替用户随意捏造意图
- **后端验证业务逻辑** 防止不满足条件的请求直接上链
- **玩家签名** 证明这确实是用户授权的动作
- **服务器签名** 证明平台愿意为这笔动作代付并背书

四段缺一不可。只要少一段，就会出现典型问题：

- 没有玩家签名：变成平台可代用户乱发
- 没有后端校验：变成谁都能白嫖赞助
- 没有服务器签名：链上受限入口直接失败

---

## 8.4 构建简单的后端赞助服务

### 项目结构

```
backend/
├── src/
│   ├── server.ts          # Express 服务器
│   ├── sponsor.ts          # 赞助交易逻辑
│   ├── validators.ts       # 业务验证
│   └── config.ts           # 配置
└── package.json
```

### `sponsor.ts`：核心赞助逻辑

```
// src/sponsor.ts
import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { fromBase64 } from "@mysten/sui/utils";

const client = new SuiClient({
  url: process.env.SUI_RPC_URL ?? "https://fullnode.testnet.sui.io:443",
});

// 服务器签名密钥（安全存储在环境变量中）
const serverKeypair = Ed25519Keypair.fromSecretKey(
  fromBase64(process.env.SERVER_PRIVATE_KEY!)
);

export interface SponsoredTxRequest {
  txBytes: string;         // 玩家构建的交易（base64）
  playerSignature: string; // 玩家对 txBytes 的签名（base64）
  playerAddress: string;
}

export async function sponsorAndExecute(req: SponsoredTxRequest) {
  // 1. 反序列化玩家的交易
  const txBytes = fromBase64(req.txBytes);

  // 2. 服务器设置 Gas 付款人
  //    这会修改交易，使服务器地址成为 Gas 付款人
  const tx = Transaction.from(txBytes);
  tx.setGasOwner(serverKeypair.getPublicKey().toSuiAddress());

  // 3. 服务器签名（作为 Gas 付款人）
  const sponsoredBytes = await tx.build({ client });
  const serverSig = await serverKeypair.signTransaction(sponsoredBytes);

  // 4. 执行：同时提交玩家签名和服务器签名
  const result = await client.executeTransactionBlock({
    transactionBlock: sponsoredBytes,
    signature: [
      req.playerSignature,  // 玩家作为 Sender 的签名
      serverSig.signature,  // 服务器作为 Gas Owner 的签名
    ],
    options: { showEvents: true, showEffects: true },
  });

  return result;
}
```

### 服务端在这里最需要防的，不是“请求失败”，而是“请求被滥用”

一个真正可用的赞助服务，至少要考虑这些风控点：

- 同一玩家短时间内重复请求
- 同一交易被重复提交
- 某类高成本操作被批量刷
- 玩家把本不该赞助的交易偷偷塞给服务端

所以在真实项目里，赞助服务通常还会增加：

- 请求频率限制
- 交易白名单或入口白名单
- 每个动作的预算限制
- 请求日志和审计记录

### `validators.ts`：业务验证逻辑

```
// src/validators.ts
import { SuiClient } from "@mysten/sui/client";

const client = new SuiClient({ url: process.env.SUI_RPC_URL! });

// 验证临近性（简化版：检查两个组件的游戏坐标是否足够近）
export async function validateProximity(
  playerAddress: string,
  assemblyId: string,
): Promise<boolean> {
  // 在真实场景中，这里会查询游戏服务器或链上的位置哈希
  // 此处仅做示例性实现
  try {
    const assembly = await client.getObject({
      id: assemblyId,
      options: { showContent: true },
    });

    // 检查玩家是否在组件附近（游戏物理规则验证）
    // 真实实现需要与游戏服务器通信
    return true; // 简化
  } catch {
    return false;
  }
}

// 验证玩家是否满足条件（如持有特定 NFT）
export async function validatePlayerCondition(
  playerAddress: string,
  requiredNftType: string,
): Promise<boolean> {
  const objects = await client.getOwnedObjects({
    owner: playerAddress,
    filter: { StructType: requiredNftType },
  });

  return objects.data.length > 0;
}
```

### 校验逻辑为什么不要和执行逻辑混在一起？

因为这两件事变化速度不同：

- 校验规则会频繁迭代
- 执行链路需要尽量稳定

把它们拆开后，你会得到几个直接好处：

- 风控规则更容易单独更新
- 更容易给不同 action 组合不同验证器
- 更容易做灰度和回放分析

### `server.ts`：REST API 服务器

```
// src/server.ts
import express from "express";
import { sponsorAndExecute, SponsoredTxRequest } from "./sponsor";
import { validateProximity, validatePlayerCondition } from "./validators";

const app = express();
app.use(express.json());

// 赞助跳跃请求
app.post("/api/sponsor/jump", async (req, res) => {
  const { txBytes, playerSignature, playerAddress, gateId } = req.body;

  try {
    // 1. 验证临近性（玩家必须在星门附近）
    const isNear = await validateProximity(playerAddress, gateId);
    if (!isNear) {
      return res.status(400).json({ error: "玩家不在星门附近" });
    }

    // 2. 执行赞助交易
    const result = await sponsorAndExecute({
      txBytes,
      playerSignature,
      playerAddress,
    });

    res.json({ success: true, digest: result.digest });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 赞助通用操作（带自定义验证）
app.post("/api/sponsor/action", async (req, res) => {
  const { txBytes, playerSignature, playerAddress, actionType, metadata } = req.body;

  try {
    // 根据 actionType 做不同验证
    switch (actionType) {
      case "deposit_ore": {
        // 验证是否在存储箱附近
        const ok = await validateProximity(playerAddress, metadata.ssuId);
        if (!ok) return res.status(400).json({ error: "不在附近" });
        break;
      }
      case "special_gate": {
        // 验证是否持有 VIP NFT
        const hasNft = await validatePlayerCondition(
          playerAddress,
          `${process.env.MY_PACKAGE}::vip_pass::VipPass`
        );
        if (!hasNft) return res.status(403).json({ error: "需要 VIP 通行证" });
        break;
      }
    }

    const result = await sponsorAndExecute({ txBytes, playerSignature, playerAddress });
    res.json({ success: true, digest: result.digest });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("赞助服务运行在 :3001"));
```

### 幂等性是赞助服务最容易被忽略的问题

玩家网络抖动、前端重试、用户狂点按钮，都会导致同一个请求被发多次。

如果你的后端没有幂等设计，就会出现：

- 同一业务请求被重复赞助
- 用户以为点了一次，链上却发了两次
- 预算和统计全部失真

实际项目里，至少应该给每次业务动作一个稳定请求 ID，并在服务端记录“这个请求是否已经处理过”。

---

## 8.5 前端配合赞助交易

```
// src/hooks/useSponsoredAction.ts
import { useWallet } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { toBase64 } from "@mysten/sui/utils";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3001";

export function useSponsoredAction() {
  const wallet = useWallet();

  const executeSponsoredJump = async (
    tx: Transaction,
    gateId: string,
  ) => {
    if (!wallet.currentAccount) throw new Error("请先连接钱包");

    const playerAddress = wallet.currentAccount.address;

    // 1. 玩家只签名，不提交
    const txBytes = await tx.build({ client: suiClient });
    const { signature: playerSig } = await wallet.signTransaction({
      transaction: tx,
    });

    // 2. 发送到后端，让服务器验证并代付 Gas
    const response = await fetch(`${BACKEND_URL}/api/sponsor/jump`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        txBytes: toBase64(txBytes),
        playerSignature: playerSig,
        playerAddress,
        gateId,
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error);
    }

    return response.json();
  };

  return { executeSponsoredJump };
}
```

---

## 8.6 赞助交易的安全考量

| 风险        | 防御措施                              |
| --------- | --------------------------------- |
| 服务器私钥泄露   | 使用 HSM 或 KMS 存储私钥；定期轮换            |
| 恶意玩家重放交易  | Sui 的 TransactionDigest 是唯一的，无法重放 |
| DDoS 攻击后端 | Rate limiting + IP 封锁 + 要求玩家 auth |
| 绕过验证直接提交  | 链上合约的 `verify_sponsor` 强制要求授权地址   |
| Gas 费耗尽   | 监控服务器账户余额，设置告警阈值                  |

## 14. Chapter 9: 链下索引与 GraphQL 进阶 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-09.html

# Chapter 9：链下索引与 GraphQL 进阶

**目标：** 掌握链下数据查询的完整工具链，包括 GraphQL、gRPC、事件订阅和自定义索引器，构建高性能的数据驱动 dApp。

---

状态：工程章节。正文以 GraphQL、事件和索引器设计为主。

## 9.1 读写分离原则

EVE Frontier 开发的黄金法则：

```
写操作（改变链上状态）→ 通过 Transaction 提交 → 消耗 Gas
读操作（查询链上状态）→ 通过 GraphQL/gRPC/SuiClient → 完全免费
```

**设计指导**：将所有可能的逻辑移到链下读取，只在真正需要改变状态时才提交交易。

这条原则看起来简单，但它其实决定了你的整个系统成本结构：

- 链上写得越多，Gas 越高、失败面越大
- 链下读得越好，前端越快、交互越轻

所以一个成熟的 Builder 系统，通常不是“什么都往链上塞”，而是明确拆成三层：

- **链上对象** 存必须可信的状态
- **链上事件** 存发生过的动作
- **链下索引** 存前端真正需要消费的视图

如果这三层不拆开，你的前端迟早会变成一堆昂贵又难维护的实时 RPC 调用。

---

## 9.2 SuiClient 基础读取

```
import { SuiClient } from "@mysten/sui/client";

const client = new SuiClient({ url: "https://fullnode.testnet.sui.io:443" });

// ❶ 读取单个对象
const gate = await client.getObject({
  id: "0x...",
  options: { showContent: true, showOwner: true, showType: true },
});
console.log(gate.data?.content);

// ❷ 批量读取多个对象（一次请求）
const objects = await client.multiGetObjects({
  ids: ["0x...gate1", "0x...gate2", "0x...ssu"],
  options: { showContent: true },
});

// ❸ 查询某地址拥有的所有对象
const ownedObjects = await client.getOwnedObjects({
  owner: "0xALICE",
  filter: { StructType: `${WORLD_PKG}::gate::Gate` },
  options: { showContent: true },
});

// ❹ 分页查询（处理大量数据）
let cursor: string | null = null;
const allGates: any[] = [];

do {
  const page = await client.getOwnedObjects({
    owner: "0xALICE",
    cursor,
    limit: 50,
  });
  allGates.push(...page.data);
  cursor = page.nextCursor ?? null;
} while (cursor);
```

### `SuiClient` 最适合做什么？

它最适合：

- 单对象读取
- 小规模批量读取
- 调试和脚本验证
- 前端的轻量查询

它不一定适合直接承担：

- 大规模排行榜
- 跨多类型对象的聚合视图
- 高频复杂筛选

一旦你的查询需求开始出现“排序、聚合、跨对象拼表”，就该考虑上 GraphQL 或自定义索引层了。

---

## 9.3 GraphQL 深度使用

Sui 的 GraphQL 接口比 JSON-RPC 更强大，支持复杂过滤、嵌套查询和游标分页。

### 连接 GraphQL

```
import { SuiGraphQLClient, graphql } from "@mysten/sui/graphql";

const graphqlClient = new SuiGraphQLClient({
  url: "https://graphql.testnet.sui.io/graphql",
});
```

### 查询某类型的所有对象

```
const GET_ALL_GATES = graphql(`
  query GetAllGates($type: String!, $after: String) {
    objects(filter: { type: $type }, first: 50, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        address
        asMoveObject {
          contents {
            json  # 以 JSON 格式返回字段
          }
        }
      }
    }
  }
`);

async function getAllGates(): Promise<any[]> {
  const results: any[] = [];
  let after: string | null = null;

  do {
    const data = await graphqlClient.query({
      query: GET_ALL_GATES,
      variables: {
        type: `${WORLD_PKG}::gate::Gate`,
        after,
      },
    });

    const objects = data.data?.objects;
    if (!objects) break;

    results.push(...objects.nodes.map(n => n.asMoveObject?.contents?.json));
    after = objects.pageInfo.hasNextPage ? objects.pageInfo.endCursor : null;
  } while (after);

  return results;
}
```

### GraphQL 真正的价值，不只是“语法更优雅”

它更重要的价值是让你能按前端视图去组织查询，而不是被 RPC 单对象接口牵着走。

这在实际产品里非常重要，因为页面需要的常常不是“某一个对象原始长什么样”，而是：

- 当前对象 + 关联对象摘要
- 一页列表 + 分页信息
- 多种对象拼成一个 dashboard

### GraphQL 也不是万能的

如果你把它当成数据库去无限制拉取，同样会踩坑：

- 查询过大，前端首屏变慢
- 一页塞太多嵌套对象，调试困难
- 复杂查询一变更，前后端一起炸

所以 GraphQL 最好的用法通常是：

- 面向页面拆查询
- 每个查询只服务一类明确视图
- 需要聚合统计时让自定义索引器承担更多责任

### 查询多个关联对象（嵌套）

```
// 查询星门及其关联的网络节点信息
const GET_GATE_WITH_NODE = graphql(`
  query GetGateWithNode($gateId: SuiAddress!) {
    object(address: $gateId) {
      address
      asMoveObject {
        contents { json }
      }
    }
  }
`);

// 批量: 一次查询多个不同类型
const GET_ASSEMBLY_OVERVIEW = graphql(`
  query AssemblyOverview($gateId: SuiAddress!, $ssuId: SuiAddress!) {
    gate: object(address: $gateId) {
      asMoveObject { contents { json } }
    }
    ssu: object(address: $ssuId) {
      asMoveObject { contents { json } }
    }
  }
`);
```

### 按动态字段查询（Table 内容）

```
// 查询 Market 的 listings Table 中特定条目
const GET_LISTING = graphql(`
  query GetListing($marketId: SuiAddress!, $typeId: String!) {
    object(address: $marketId) {
      dynamicField(name: { type: "u64", bcs: $typeId }) {
        value {
          ... on MoveValue {
            json
          }
        }
      }
    }
  }
`);
```

### 为什么动态字段查询会比普通对象字段更麻烦？

因为动态字段天然更接近“运行时长出来的索引结构”，而不是固定 schema。

这意味着：

- 你必须非常清楚 key 的编码方式
- 前端和索引层必须用同一套 key 规则
- 一旦 key 设计变了，读路径会整体失效

所以动态字段的设计，不只是合约内部问题，它会直接外溢到查询和前端层。

---

## 9.4 事件实时订阅

```
import { SuiClient } from "@mysten/sui/client";

const client = new SuiClient({ url: "https://fullnode.testnet.sui.io:443" });

// 订阅特定包的所有事件
const unsubscribe = await client.subscribeEvent({
  filter: { Package: MY_PACKAGE },
  onMessage: (event) => {
    switch (event.type) {
      case `${MY_PACKAGE}::toll_gate_ext::GateJumped`:
        handleGateJump(event.parsedJson);
        break;

      case `${MY_PACKAGE}::market::ItemSold`:
        handleItemSold(event.parsedJson);
        break;
    }
  },
});

// 90 秒后取消订阅
setTimeout(unsubscribe, 90_000);

// 查询历史事件（带过滤）
const history = await client.queryEvents({
  query: {
    And: [
      { MoveEventType: `${MY_PACKAGE}::toll_gate_ext::GateJumped` },
      { Sender: "0xPlayerAddress..." },
    ],
  },
  order: "descending",
  limit: 100,
});
```

### 事件订阅最适合解决什么问题？

最适合：

- 实时通知
- 活动流
- 轻量增量更新
- 索引器消费新交易

不适合直接当成：

- 当前态唯一来源
- 完整业务列表接口
- 高可靠历史数据库

因为事件流天然有两个现实问题：

- 你可能会掉线、漏消息
- 你总得有一套历史回补机制

所以成熟索引器通常都是：

- 先回放历史
- 再订阅增量
- 定期做一致性校验

---

## 9.5 gRPC：高吞吐量数据流

对于需要处理大量实时数据的场景（如排行榜、全网状态快照），gRPC 比 GraphQL 更高效：

```
// 使用 gRPC 流式读取最新 Checkpoints
import { SuiHTTPTransport } from "@mysten/sui/client";

// gRPC 适合监控整个链的状态变化
// 例如：每个 Checkpoint 包含该期间内所有交易的摘要
// 高级用法：构建自定义索引器时使用
```

### 什么时候值得上 gRPC，而不是继续堆 RPC / GraphQL？

当你开始遇到这些场景时：

- 需要长期消费 checkpoint
- 需要自己维护一套近实时索引
- 需要高吞吐、低延迟的链上数据流

如果你只是做一个普通 dApp 页面，通常没必要一开始就上 gRPC。它更像“基础设施建设工具”，不是页面查询工具。

---

## 9.6 构建自定义链下索引器

对于复杂的查询需求（如排行榜、聚合统计），可以构建自己的索引服务：

```
// server/indexer.ts
import { SuiClient } from "@mysten/sui/client";

const client = new SuiClient({ url: process.env.SUI_RPC! });

// 内存索引（小规模；生产环境用 Redis 或 PostgreSQL）
const jumpLeaderboard = new Map<string, number>(); // address → jump count

// 启动索引：监听事件并更新本地状态
async function startIndexer() {
  console.log("索引器启动...");

  // 先载入历史数据
  await loadHistoricalEvents();

  // 然后订阅新事件
  await client.subscribeEvent({
    filter: { Package: MY_PACKAGE },
    onMessage: (event) => {
      if (event.type.includes("GateJumped")) {
        const { character_id } = event.parsedJson as any;
        const count = jumpLeaderboard.get(character_id) ?? 0;
        jumpLeaderboard.set(character_id, count + 1);
      }
    },
  });
}

async function loadHistoricalEvents() {
  let cursor = null;
  do {
    const page = await client.queryEvents({
      query: { MoveEventType: `${MY_PACKAGE}::toll_gate_ext::GateJumped` },
      cursor,
      limit: 200,
    });

    for (const event of page.data) {
      const { character_id } = event.parsedJson as any;
      const count = jumpLeaderboard.get(character_id) ?? 0;
      jumpLeaderboard.set(character_id, count + 1);
    }

    cursor = page.nextCursor;
  } while (cursor && !cursor.startsWith("0x00")); // 简化终止条件
}

// API：提供排行榜数据
import express from "express";
const app = express();

app.get("/api/leaderboard", (req, res) => {
  const sorted = [...jumpLeaderboard.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([address, count], rank) => ({ rank: rank + 1, address, count }));

  res.json(sorted);
});

startIndexer().then(() => app.listen(3002));
```

---

## 9.7 在 dApp 中高效展示链上数据

### 使用 React Query 缓存与自动刷新

```
// src/hooks/useLeaderboard.ts
import { useQuery } from "@tanstack/react-query";

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard");
      return res.json();
    },
    refetchInterval: 30_000,  // 每 30 秒刷新
    staleTime: 25_000,        // 25 秒内不重新请求
  });
}

// 使用
function Leaderboard() {
  const { data, isLoading } = useLeaderboard();

  return (
    <table>
      <thead><tr><th>#</th><th>玩家</th><th>跳跃次数</th></tr></thead>
      <tbody>
        {data?.map(({ rank, address, count }) => (
          <tr key={address}>
            <td>{rank}</td>
            <td>{address.slice(0, 8)}...</td>
            <td>{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 🔖 本章小结

| 工具                      | 场景        | 特点                 |
| ----------------------- | --------- | ------------------ |
| `SuiClient.getObject()` | 读取单个/多个对象 | 简单直接               |
| `GraphQL`               | 复杂过滤、嵌套查询 | 灵活，TypeScript 类型生成 |
| `subscribeEvent`        | 实时事件推送    | WebSocket，适合 dApp  |
| `queryEvents`           | 历史事件分页查询  | 适合数据分析             |
| 自定义索引器                  | 复杂聚合、排行榜  | 全控制，需要自己维护         |

## 15. Chapter 10: dApp 集成实战 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-10.html

# 第10章：EVE Vault 与 dApp 集成实战

**学习目标**：掌握在 Builder dApp 中接入 EVE Vault 的完整流程——账户发现、连接、签名交易、赞助交易，以及处理 zkLogin 特有的 Epoch 刷新和断连情况。

---

状态：教学示例。正文 API 说明以当前依赖版本与本仓库示例 dApp 为准，实际接入时需以本地包版本核对。

## 最小调用链

`dApp Provider 初始化 -> useConnection 发现钱包 -> 构建 PTB -> EVE Vault 审批/签名 -> 链上执行 -> dApp 刷新对象状态`

## 钱包能力矩阵

| 能力                 | 普通 Wallet Standard 钱包 | EVE Vault            |
| ------------------ | --------------------- | -------------------- |
| 发现与连接              | 支持                    | 支持                   |
| 普通交易签名             | 支持                    | 支持                   |
| Sponsored Tx       | 通常不支持                 | 支持                   |
| zkLogin / Epoch 处理 | 依赖钱包实现                | 内建处理                 |
| 游戏内浮层联动            | 通常没有                  | 可与 EVE Frontier 场景配合 |

## 16. Example 4: 任务解锁系统 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-04.html

# 实战案例 4：任务解锁系统（链上任务 + 条件星门）

**目标：** 构建一套链上任务系统：玩家完成指定任务后，链上记录完成状态；星门扩展读取任务状态，只允许完成任务的玩家跃迁。同时提供任务发布和验证的 dApp。

---

状态：已映射到本地代码目录。正文以任务状态和条件星门解耦为核心，适合做权限型玩法入口。

## 对应代码目录

- [example-04](https://hoh-zone.github.io/eve-bootcamp/code/example-04)
- [example-04/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-04/dapp)

## 最小调用链

`注册任务 -> 玩家完成任务 -> 链上记录状态 -> 星门读取任务状态 -> 放行或拒绝`

## 需求分析

**场景：** 你运营着一个星门，通向一个高价值矿区。想要进入的玩家必须先完成一系列“入会考核“：

- 📋 **任务一**：向你的存储箱捐献 100 单位矿石（链上可验证）
- 🔑 **任务二**：获得联盟 Leader 的链上签发认证
- 🚪 **完成所有任务** → 可以通过星门进入矿区

**设计特点：**

- 任务状态全部在链上，无法伪造
- 任务系统和星门系统解耦，便于独立升级
- dApp 提供任务进度追踪和一键申请跃迁

---

## 第一部分：任务系统合约

### `quest_registry.move`

```
module quest_system::registry;

use sui::object::{Self, UID, ID};
use sui::table::{Self, Table};
use sui::event;
use sui::tx_context::TxContext;
use sui::transfer;

/// 任务的类型（用 u8 枚举）
const QUEST_DONATE_ORE: u8 = 0;
const QUEST_LEADER_CERT: u8 = 1;

/// 任务完成状态（位标志）
/// bit 0: QUEST_DONATE_ORE 完成
/// bit 1: QUEST_LEADER_CERT 完成
const QUEST_ALL_COMPLETE: u64 = 0b11;

/// 任务注册表（共享对象）
public struct QuestRegistry has key {
    id: UID,
    gate_id: ID,                          // 对应哪个星门
    completions: Table<address, u64>,     // address → 完成标志位
}

/// 任务管理员凭证
public struct QuestAdminCap has key, store {
    id: UID,
    registry_id: ID,
}

/// 事件
public struct QuestCompleted has copy, drop {
    registry_id: ID,
    player: address,
    quest_type: u8,
    all_done: bool,
}

/// 部署：创建任务注册表
public fun create_registry(
    gate_id: ID,
    ctx: &mut TxContext,
) {
    let registry = QuestRegistry {
        id: object::new(ctx),
        gate_id,
        completions: table::new(ctx),
    };

    let admin_cap = QuestAdminCap {
        id: object::new(ctx),
        registry_id: object::id(®istry),
    };

    transfer::share_object(registry);
    transfer::transfer(admin_cap, ctx.sender());
}

/// 管理员标记任务完成（由联盟 Leader 或管理脚本调用）
public fun mark_quest_complete(
    registry: &mut QuestRegistry,
    cap: &QuestAdminCap,
    player: address,
    quest_type: u8,
    ctx: &TxContext,
) {
    assert!(cap.registry_id == object::id(registry), ECapMismatch);

    // 初始化玩家条目
    if !table::contains(®istry.completions, player) {
        table::add(&mut registry.completions, player, 0u64);
    };

    let flags = table::borrow_mut(&mut registry.completions, player);
    *flags = *flags | (1u64 << (quest_type as u64));

    let all_done = *flags == QUEST_ALL_COMPLETE;

    event::emit(QuestCompleted {
        registry_id: object::id(registry),
        player,
        quest_type,
        all_done,
    });
}

/// 查询玩家是否完成了所有任务
public fun is_all_complete(registry: &QuestRegistry, player: address): bool {
    if !table::contains(®istry.completions, player) {
        return false
    }
    *table::borrow(®istry.completions, player) == QUEST_ALL_COMPLETE
}

/// 查询玩家完成了哪些任务
public fun get_completion_flags(registry: &QuestRegistry, player: address): u64 {
    if !table::contains(®istry.completions, player) {
        return 0
    }
    *table::borrow(®istry.completions, player)
}

const ECapMismatch: u64 = 0;
```

---

### `quest_gate.move`（星门扩展）

```
module quest_system::quest_gate;

use quest_system::registry::{Self, QuestRegistry};
use world::gate::{Self, Gate};
use world::character::Character;
use sui::clock::Clock;
use sui::tx_context::TxContext;

/// 星门扩展 Witness
public struct QuestGateAuth has drop {}

/// 任务完成后申请跳跃许可
public fun quest_jump(
    source_gate: &Gate,
    dest_gate: &Gate,
    character: &Character,
    quest_registry: &QuestRegistry,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // 验证调用者已完成所有任务
    assert!(
        registry::is_all_complete(quest_registry, ctx.sender()),
        EQuestsNotComplete,
    );

    // 签发跳跃许可（有效期 30 分钟）
    let expires_at = clock.timestamp_ms() + 30 * 60 * 1000;

    gate::issue_jump_permit(
        source_gate,
        dest_gate,
        character,
        QuestGateAuth {},
        expires_at,
        ctx,
    );
}

const EQuestsNotComplete: u64 = 0;
```

---

## 第二部分：任务验证逻辑（任务一：捐献矿石）

任务一（捐献矿石）需要链下监控 SSU 的存储事件，然后管理员手动（或脚本自动）标记完成。

```
// scripts/auto-quest-monitor.ts
import { SuiClient } from "@mysten/sui/client"
import { Transaction } from "@mysten/sui/transactions"
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"

const QUEST_PACKAGE = "0x_QUEST_PACKAGE_"
const REGISTRY_ID = "0x_REGISTRY_ID_"
const QUEST_ADMIN_CAP_ID = "0x_QUEST_ADMIN_CAP_"
const STORAGE_UNIT_ID = "0x_SSU_ID_"
const DONATE_ORE_TYPE_ID = 12345 // 矿石物品类型 ID

const client = new SuiClient({ url: "https://fullnode.testnet.sui.io:443" })
const adminKeypair = Ed25519Keypair.fromSecretKey(/* ... */)

// 监听 SSU 的捐献事件
async function monitorDonations() {
  await client.subscribeEvent({
    filter: {
      MoveEventType: `${"0x_WORLD_PACKAGE_"}::storage_unit::ItemDeposited`,
    },
    onMessage: async (event) => {
      const { depositor, storage_unit_id, item_type_id } = event.parsedJson as any

      // 检查是否是我们的 SSU 和指定物品
      if (
        storage_unit_id === STORAGE_UNIT_ID &&
        Number(item_type_id) === DONATE_ORE_TYPE_ID
      ) {
        console.log(`玩家 ${depositor} 捐献了矿石，标记任务完成...`)
        await markQuestComplete(depositor, 0) // quest_type = 0 (QUEST_DONATE_ORE)
      }
    },
  })
}

async function markQuestComplete(player: string, questType: number) {
  const tx = new Transaction()
  tx.moveCall({
    target: `${QUEST_PACKAGE}::registry::mark_quest_complete`,
    arguments: [
      tx.object(REGISTRY_ID),
      tx.object(QUEST_ADMIN_CAP_ID),
      tx.pure.address(player),
      tx.pure.u8(questType),
    ],
  })

  const result = await client.signAndExecuteTransaction({
    signer: adminKeypair,
    transaction: tx,
  })
  console.log(`任务标记成功: ${result.digest}`)
}

monitorDonations()
```

---

## 第三部分：任务追踪 dApp

```
// src/QuestTrackerApp.tsx
import { useState, useEffect } from 'react'
import { useConnection, getObjectWithJson } from '@evefrontier/dapp-kit'
import { useDAppKit } from '@mysten/dapp-kit-react'
import { Transaction } from '@mysten/sui/transactions'
import { SuiClient } from '@mysten/sui/client'

const QUEST_PACKAGE = "0x_QUEST_PACKAGE_"
const REGISTRY_ID = "0x_REGISTRY_ID_"
const SOURCE_GATE_ID = "0x..."
const DEST_GATE_ID = "0x..."
const CHARACTER_ID = "0x..."

const QUEST_NAMES = [
  { id: 0, name: '捐献矿石', description: '向联盟存储箱存入 100 单位矿石' },
  { id: 1, name: '获得认证', description: '联系联盟 Leader 在链上为你签发认证' },
]

export function QuestTrackerApp() {
  const { isConnected, handleConnect, currentAddress } = useConnection()
  const dAppKit = useDAppKit()
  const [flags, setFlags] = useState<number>(0)
  const [isJumping, setIsJumping] = useState(false)
  const [status, setStatus] = useState('')

  const allComplete = flags === 0b11

  // 加载任务完成状态
  useEffect(() => {
    if (!currentAddress) return

    const loadFlags = async () => {
      // 通过 GraphQL 读取 table 中的玩家条目
      const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' })
      const obj = await client.getDynamicFieldObject({
        parentId: REGISTRY_ID,
        name: {
          type: 'address',
          value: currentAddress,
        },
      })

      if (obj.data?.content?.dataType === 'moveObject') {
        setFlags(Number((obj.data.content.fields as any).value))
      } else {
        setFlags(0) // 玩家尚未有记录
      }
    }

    loadFlags()
  }, [currentAddress])

  const handleJump = async () => {
    if (!allComplete) {
      setStatus('❌ 请先完成所有任务')
      return
    }

    setIsJumping(true)
    setStatus('⏳ 申请跳跃许可...')

    try {
      const tx = new Transaction()
      tx.moveCall({
        target: `${QUEST_PACKAGE}::quest_gate::quest_jump`,
        arguments: [
          tx.object(SOURCE_GATE_ID),
          tx.object(DEST_GATE_ID),
          tx.object(CHARACTER_ID),
          tx.object(REGISTRY_ID),
          tx.object('0x6'), // Clock
        ],
      })

      await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus('🚀 已获得跳跃许可，享受矿区之旅！')
    } catch (e: any) {
      setStatus(`❌ ${e.message}`)
    } finally {
      setIsJumping(false)
    }
  }

  return (
    <div className="quest-tracker">
      <h1>🌟 联盟入会考核</h1>

      {!isConnected ? (
        <button onClick={handleConnect}>连接钱包</button>
      ) : (
        <>
          <div className="quest-list">
            {QUEST_NAMES.map(quest => {
              const done = (flags & (1 << quest.id)) !== 0
              return (
                <div key={quest.id} className={`quest-item ${done ? 'done' : 'pending'}`}>
                  <span className="quest-icon">{done ? '✅' : '⬜'}</span>
                  <div>
                    <strong>{quest.name}</strong>
                    <p>{quest.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="progress">
            完成进度：{Object.keys(QUEST_NAMES)
              .filter(i => (flags & (1 << Number(i))) !== 0).length} / {QUEST_NAMES.length}
          </div>

          <button
            className={`jump-btn ${allComplete ? 'active' : 'locked'}`}
            onClick={handleJump}
            disabled={!allComplete || isJumping}
          >
            {allComplete
              ? (isJumping ? '⏳ 申请中...' : '🚀 进入矿区')
              : '🔒 完成所有任务才可进入'
            }
          </button>

          {status && <p className="status">{status}</p>}
        </>
      )}
    </div>
  )
}
```

---

## 🎯 完整回顾

```
合约层
├── quest_registry.move
│   ├── QuestRegistry（共享对象，存储玩家完成标志位）
│   ├── QuestAdminCap（管理员凭证）
│   ├── mark_quest_complete() ← 管理员调用
│   └── is_all_complete()     ← 星门合约调用
│
└── quest_gate.move
    ├── QuestGateAuth（星门扩展 Witness）
    └── quest_jump()          ← 玩家调用
        ├── registry::is_all_complete() → 验证任务完成
        └── gate::issue_jump_permit()   → 发放许可

链下监控
└── auto-quest-monitor.ts
    ├── 订阅 SSU ItemDeposited 事件
    └── 自动调用 mark_quest_complete()

dApp 层
└── QuestTrackerApp.tsx
    ├── 显示任务进度（位标志解码）
    └── 一键申请跳跃许可
```

---

## 🔧 扩展练习

1. **任务时效**：任务完成后 7 天内有效，过期需重新完成（在标志位旁存储时间戳）
1. **链上任务一**（不需要链下）：玩家主动调用 `donate_ore()` 函数，直接转移物品，合约自动标记任务完成
1. **任务积分**：每个任务赋予不同积分权重，累计达到阈值才解锁星门

---

## 📚 关联文档

- [Chapter 11：OwnerCap 与 Keychain](https://hoh-zone.github.io/eve-bootcamp/chapter-11.html)
- [Chapter 12：位标志与 Table](https://hoh-zone.github.io/eve-bootcamp/chapter-12.html)
- [Smart Gate 文档](https://github.com/evefrontier/builder-documentation/blob/main/smart-assemblies/gate/README.md)

## 17. Example 11: 物品租赁系统 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-11.html

# 实战案例 11：物品租赁系统（出租而非出售）

**目标：** 构建一个链上物品租赁市场——物品所有者出租而非出售装备，租用者在有效期内拥有使用权，到期后物品自动归还（或可赎回）。

---

状态：教学示例。正文解释核心业务流，完整目录以本地 `book/src/code/example-11/` 为准。

## 对应代码目录

- [example-11](https://hoh-zone.github.io/eve-bootcamp/code/example-11)
- [example-11/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-11/dapp)

## 最小调用链

`创建挂单 -> 用户租用 -> 合约铸造 RentalPass -> 到期或提前归还 -> 资金结算`

## 测试闭环

- 挂单创建：确认 `is_available == true`，且可被前端正确查询到
- 成功租用：确认租用者收到 `RentalPass`，出租者收到 70% 租金
- 提前归还：确认退款按剩余天数计算，剩余押金正确流向出租者
- 到期回收：确认未到期时回收失败，到期后回收成功

## 需求分析

**场景：** 高级飞船模块价格昂贵，多数玩家买不起，但可以租用：

- 出租者将模块锁入租赁合约，设置日租金和最长租期
- 租用者支付租金，获得临时**使用权凭证 NFT**（`RentalPass`）
- 使用权凭证携带到期时间戳，合约在使用时验证是否在有效期内
- 到期后，出租者可以收回模块（或续租）
- 若租用者提前归还，退还剩余天数的租金

---

## 第一部分：租赁合约

```
module rental::equipment_rental;

use sui::object::{Self, UID, ID};
use sui::table::{Self, Table};
use sui::clock::Clock;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::balance::{Self, Balance};
use sui::transfer;
use sui::event;
use std::string::String;

// ── 常量 ──────────────────────────────────────────────────

const DAY_MS: u64 = 86_400_000;

// ── 数据结构 ───────────────────────────────────────────────

/// 租赁挂单（锁定物品）
public struct RentalListing has key {
    id: UID,
    item_id: ID,              // 被租赁的物品对象 ID
    item_name: String,
    owner: address,
    daily_rate_sui: u64,      // 每天租金（MIST）
    max_days: u64,            // 最长租期
    deposited_balance: Balance<SUI>, // 出租者预存的保证金（可选）
    is_available: bool,
    current_renter: option::Option<address>,
    lease_expires_ms: u64,
}

/// 租用凭证 NFT（租用者持有）
public struct RentalPass has key, store {
    id: UID,
    listing_id: ID,
    item_name: String,
    renter: address,
    expires_ms: u64,
    prepaid_days: u64,
    refundable_balance: Balance<SUI>, // 可退还余额（提前归还用）
}

// ── 事件 ──────────────────────────────────────────────────

public struct ItemRented has copy, drop {
    listing_id: ID,
    renter: address,
    days: u64,
    total_paid: u64,
    expires_ms: u64,
}

public struct ItemReturned has copy, drop {
    listing_id: ID,
    renter: address,
    early: bool,
    refund_amount: u64,
}

// ── 出租者操作 ────────────────────────────────────────────

/// 创建租赁挂单
public fun create_listing(
    item_name: vector<u8>,
    tracked_item_id: ID,       // 物品的 Object ID（合约追踪，实际物品在 SSU 中）
    daily_rate_sui: u64,
    max_days: u64,
    ctx: &mut TxContext,
) {
    let listing = RentalListing {
        id: object::new(ctx),
        item_id: tracked_item_id,
        item_name: std::string::utf8(item_name),
        owner: ctx.sender(),
        daily_rate_sui,
        max_days,
        deposited_balance: balance::zero(),
        is_available: true,
        current_renter: option::none(),
        lease_expires_ms: 0,
    };
    transfer::share_object(listing);
}

/// 下架（只有在物品未出租时才能撤回）
public fun delist(
    listing: &mut RentalListing,
    ctx: &TxContext,
) {
    assert!(listing.owner == ctx.sender(), ENotOwner);
    assert!(listing.is_available, EItemCurrentlyRented);
    listing.is_available = false;
}

// ── 租用者操作 ────────────────────────────────────────────

/// 租用物品
public fun rent_item(
    listing: &mut RentalListing,
    days: u64,
    mut payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(listing.is_available, ENotAvailable);
    assert!(days >= 1 && days <= listing.max_days, EInvalidDays);

    let total_cost = listing.daily_rate_sui * days;
    assert!(coin::value(&payment) >= total_cost, EInsufficientPayment);

    let expires_ms = clock.timestamp_ms() + days * DAY_MS;

    // 扣除租金
    let rent_payment = payment.split(total_cost, ctx);
    // 给出租者发送 70%，剩余 30% 作为押金锁在 RentalPass 中（提前归还时退还）
    let owner_share = rent_payment.split(total_cost * 70 / 100, ctx);
    transfer::public_transfer(owner_share, listing.owner);

    // 更新挂单状态
    listing.is_available = false;
    listing.current_renter = option::some(ctx.sender());
    listing.lease_expires_ms = expires_ms;

    // 发放 RentalPass NFT
    let pass = RentalPass {
        id: object::new(ctx),
        listing_id: object::id(listing),
        item_name: listing.item_name,
        renter: ctx.sender(),
        expires_ms,
        prepaid_days: days,
        refundable_balance: coin::into_balance(rent_payment), // 剩余 30%
    };

    // 退找零
    if coin::value(&payment) > 0 {
        transfer::public_transfer(payment, ctx.sender());
    } else { coin::destroy_zero(payment); }

    transfer::public_transfer(pass, ctx.sender());

    event::emit(ItemRented {
        listing_id: object::id(listing),
        renter: ctx.sender(),
        days,
        total_paid: total_cost,
        expires_ms,
    });
}

/// 使用物品时验证租赁是否有效
public fun verify_rental(
    pass: &RentalPass,
    listing_id: ID,
    clock: &Clock,
): bool {
    pass.listing_id == listing_id
        && clock.timestamp_ms() <= pass.expires_ms
}

/// 提前归还（退押金）
public fun return_early(
    listing: &mut RentalListing,
    mut pass: RentalPass,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(pass.listing_id == object::id(listing), EWrongListing);
    assert!(pass.renter == ctx.sender(), ENotRenter);
    assert!(clock.timestamp_ms() < pass.expires_ms, EAlreadyExpired);

    // 计算剩余天数应退款
    let remaining_ms = pass.expires_ms - clock.timestamp_ms();
    let remaining_days = remaining_ms / DAY_MS;
    let refund = if remaining_days > 0 {
        balance::value(&pass.refundable_balance) * remaining_days / pass.prepaid_days
    } else { 0 };

    // 退款
    if refund > 0 {
        let refund_coin = coin::take(&mut pass.refundable_balance, refund, ctx);
        transfer::public_transfer(refund_coin, ctx.sender());
    };

    // 销毁剩余押金给出租者
    let remaining_bal = balance::withdraw_all(&mut pass.refundable_balance);
    if balance::value(&remaining_bal) > 0 {
        transfer::public_transfer(coin::from_balance(remaining_bal, ctx), listing.owner);
    } else { balance::destroy_zero(remaining_bal); }

    // 归还 listing 可用性
    listing.is_available = true;
    listing.current_renter = option::none();

    let RentalPass { id, refundable_balance, .. } = pass;
    balance::destroy_zero(refundable_balance);
    id.delete();

    event::emit(ItemReturned {
        listing_id: object::id(listing),
        renter: ctx.sender(),
        early: true,
        refund_amount: refund,
    });
}

/// 租期到期后，出租者收回控制权
public fun reclaim_after_expiry(
    listing: &mut RentalListing,
    clock: &Clock,
    ctx: &TxContext,
) {
    assert!(listing.owner == ctx.sender(), ENotOwner);
    assert!(!listing.is_available, EAlreadyAvailable);
    assert!(clock.timestamp_ms() > listing.lease_expires_ms, ELeaseNotExpired);

    listing.is_available = true;
    listing.current_renter = option::none();
}

// ── 错误码 ────────────────────────────────────────────────
const ENotOwner: u64 = 0;
const EItemCurrentlyRented: u64 = 1;
const ENotAvailable: u64 = 2;
const EInvalidDays: u64 = 3;
const EInsufficientPayment: u64 = 4;
const EWrongListing: u64 = 5;
const ENotRenter: u64 = 6;
const EAlreadyExpired: u64 = 7;
const EAlreadyAvailable: u64 = 8;
const ELeaseNotExpired: u64 = 9;
```

---

## 第二部分：租赁市场 dApp

```
// src/RentalMarket.tsx
import { useState } from 'react'
import { useCurrentClient } from '@mysten/dapp-kit-react'
import { useQuery } from '@tanstack/react-query'
import { Transaction } from '@mysten/sui/transactions'
import { useDAppKit } from '@mysten/dapp-kit-react'

const RENTAL_PKG = "0x_RENTAL_PACKAGE_"

interface Listing {
  id: string
  item_name: string
  owner: string
  daily_rate_sui: string
  max_days: string
  is_available: boolean
  lease_expires_ms: string
}

function DaysLeftBadge({ expireMs }: { expireMs: number }) {
  const remaining = Math.max(0, expireMs - Date.now())
  const days = Math.ceil(remaining / 86400000)
  if (days === 0) return <span className="badge badge--expired">已到期</span>
  return <span className="badge badge--active">剩余 {days} 天</span>
}

export function RentalMarket() {
  const client = useCurrentClient()
  const dAppKit = useDAppKit()
  const [rentDays, setRentDays] = useState(1)
  const [status, setStatus] = useState('')

  const { data: listings } = useQuery({
    queryKey: ['rental-listings'],
    queryFn: async () => {
      // 教学示例：直接读取当前挂单对象。
      // 真实项目里建议通过 indexer 维护“可租挂单”视图，而不是从租用事件反推列表。
      const objects = await client.getOwnedObjects({
        owner: '0x_RENTAL_REGISTRY_OWNER_',
        filter: { StructType: `${RENTAL_PKG}::equipment_rental::RentalListing` },
        options: { showContent: true },
      })
      return objects.data.map(obj => (obj.data?.content as any)?.fields).filter(Boolean) as Listing[]
    },
  })

  const handleRent = async (listingId: string, dailyRate: number) => {
    const tx = new Transaction()
    const totalCost = BigInt(dailyRate * rentDays)
    const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(totalCost)])

    tx.moveCall({
      target: `${RENTAL_PKG}::equipment_rental::rent_item`,
      arguments: [
        tx.object(listingId),
        tx.pure.u64(rentDays),
        payment,
        tx.object('0x6'),
      ],
    })

    try {
      setStatus('⏳ 提交租赁交易...')
      await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus('✅ 租赁成功！RentalPass 已发送到你的钱包')
    } catch (e: any) {
      setStatus(`❌ ${e.message}`)
    }
  }

  return (
    <div className="rental-market">
      <h1>🔧 装备租赁市场</h1>
      <p className="subtitle">租而不买，灵活使用高端装备</p>

      <div className="rent-days-selector">
        <label>租期：</label>
        {[1, 3, 7, 14, 30].map(d => (
          <button
            key={d}
            className={rentDays === d ? 'selected' : ''}
            onClick={() => setRentDays(d)}
          >
            {d} 天
          </button>
        ))}
      </div>

      <div className="listings-grid">
        {listings?.map(listing => (
          <div key={listing.id} className="listing-card">
            <h3>{listing.item_name}</h3>
            <div className="listing-meta">
              <span>💰 {Number(listing.daily_rate_sui) / 1e9} SUI/天</span>
              <span>📅 最长 {listing.max_days} 天</span>
            </div>
            <div className="listing-cost">
              租 {rentDays} 天共：<strong>{Number(listing.daily_rate_sui) * rentDays / 1e9} SUI</strong>
            </div>
            {listing.is_available ? (
              <button
                className="rent-btn"
                onClick={() => handleRent(listing.id, Number(listing.daily_rate_sui))}
              >
                🤝 立即租用
              </button>
            ) : (
              <DaysLeftBadge expireMs={Number(listing.lease_expires_ms)} />
            )}
          </div>
        ))}
      </div>

      {status && <p className="status">{status}</p>}
    </div>
  )
}
```

---

## 🎯 关键设计亮点

| 机制   | 实现方式                                                  |
| ---- | ----------------------------------------------------- |
| 时效控制 | `RentalPass.expires_ms` + `clock.timestamp_ms()` 实时验证 |
| 押金管理 | 30% 租金锁在 `RentalPass.refundable_balance`              |
| 提前归还 | 按剩余天数比例退款，其余归出租者                                      |
| 到期回收 | `reclaim_after_expiry()` 由出租者在到期后调用                   |
| 防双租  | `is_available` 标志保证同时只有一个租用者                          |

## 18. Chapter 11: 所有权模型深度解析 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-11.html

# Chapter 11：所有权模型深度解析

**目标：** 深入理解 EVE Frontier 的能力对象体系，掌握 OwnerCap 的完整生命周期，学会设计安全的委托授权和所有权转移方案。

---

状态：设计进阶章节。正文以 OwnerCap、委托与所有权生命周期为主。

## 11.1 为什么要有专门的所有权模型？

很多新手在第一次设计权限系统时，直觉都是：

- 记录一个 owner 地址
- 每次操作时检查调用者是不是这个地址

这种方式短期很省事，但一旦进入 EVE Frontier 这类“设施可经营、可转移、可委托、可组合”的世界，很快就会暴露问题：

- **不可委托** 你很难安全地把部分权力临时交给别人
- **不可组合** 权限规则散在各个函数里，系统越做越乱
- **不可细粒度表达** 很难表达“可以操作这个炮塔，但不能操作那个星门”
- **不可自然转移** 一旦设施、角色、经营权发生迁移，地址硬编码会变得很脆

EVE Frontier 使用的是 Sui 原生的 **Capability 对象体系**。它的核心思想不是“看你是谁”，而是：

看你手里拿着哪一个权限对象。

这会让所有权从“账户属性”变成“可组合、可转移、可验证的链上实体”。

---

## 11.2 权限层级结构

```
GovernorCap（部署者持有 — 最高权限）
    │
    └── AdminACL（共享对象 — 授权的服务器地址列表）
            │
            └── OwnerCap<T>（玩家持有 — 对特定对象的操作权）
```

### GovernorCap：游戏运营层

`GovernorCap` 在合约部署时创建，由 CCP Games（游戏运营方）持有。它可以：

- 向 `AdminACL` 添加/删除服务器授权地址
- 执行全局配置更改

作为 Builder，你无需关心 `GovernorCap`。

### AdminACL：服务器授权层

`AdminACL` 是一个**共享对象**，包含被授权的游戏服务器地址列表。

某些操作（如临近证明、跃迁验证）需要游戏服务器作为**赞助者（Sponsor）**签署交易：

```
// 验证调用者是否为授权赞助者
public fun verify_sponsor(admin_acl: &AdminACL, ctx: &TxContext) {
    assert!(
        admin_acl.sponsors.contains(ctx.sponsor().unwrap()),
        EUnauthorizedSponsor
    );
}
```

这意味着：某些敏感操作玩家不能单独完成，必须经过游戏服务器验证。

### OwnerCap：玩家操作层

```
public struct OwnerCap<phantom T> has key {
    id: UID,
    authorized_object_id: ID,  // 只对这一个具体对象有效
}
```

`phantom T` 使得 `OwnerCap<Gate>` 和 `OwnerCap<StorageUnit>` 是完全不同的类型，无法混用——这是类型系统级别的安全保证。

### 这三层权限为什么要分开？

你可以把它理解成三种完全不同的职责：

- **GovernorCap** 解决“世界级规则和全局治理”
- **AdminACL** 解决“哪些服务器或后端流程被信任”
- **OwnerCap** 解决“具体哪个经营主体可以操作哪个设施”

把它们拆开最大的好处是：系统不会把“全局治理权”和“单设施操作权”混成一锅。

否则你很容易出现这种糟糕结构：

- 一个地址既是服务器授权者
- 又是所有设施管理员
- 又是某些临时业务的执行者

一旦这个地址出问题，整个系统的权限边界都会塌掉。

---

## 11.3 Character 作为钥匙串（Keychain）

玩家的所有 `OwnerCap` 都存储在 **Character 对象**中，而不是直接发给钱包地址。

```
玩家钱包地址
    └── Character（共享对象，映射到钱包地址）
            ├── OwnerCap<NetworkNode>  → 网络节点 0x...a1
            ├── OwnerCap<Gate>         → 星门 0x...b2
            ├── OwnerCap<StorageUnit>  → 存储箱 0x...c3
            └── OwnerCap<Gate>         → 星门 0x...d4（第二个星门）
```

**为什么这样设计？**

- 所有资产的所有权集中于 Character，转让 Character 等于转让所有资产
- 即使玩家更换钱包地址，Character 还在，资产不丢失
- 与联盟机制配合，可以实现集体所有权管理

这里要特别注意一件事：

Character 不是简单的钱包映射层，而是一个真正的权限容器。

它把“人、角色、设施、权限”这几个维度组织在了一起：

- 钱包是签名入口
- Character 是经营主体
- OwnerCap 是具体设施权限
- 设施对象是被控制的资产

这样的好处是，当你以后做：

- 账号迁移
- 多签控制
- 联盟托管
- 角色转让

你不需要重写一整套权限系统，而是围绕 `Character` 这层做变更。

---

## 11.4 Borrow-Use-Return 完整模式

执行任何需要 OwnerCap 的操作，都必须遵循「借用 → 使用 → 归还」三步原子事务：

```
// Character 模块提供的接口
public fun borrow_owner_cap<T: key>(
    character: &mut Character,
    owner_cap_ticket: Receiving<OwnerCap<T>>,  // 使用 Receiving 模式
    ctx: &TxContext,
): (OwnerCap<T>, ReturnOwnerCapReceipt)        // 返回 Cap + 热土豆收据

public fun return_owner_cap<T: key>(
    character: &Character,
    owner_cap: OwnerCap<T>,
    receipt: ReturnOwnerCapReceipt,             // 必须消耗收据
)
```

`ReturnOwnerCapReceipt` 是一个热土豆（无 Abilities），确保 OwnerCap **必须被归还**，不能在交易外流失。

### 这个模式真正防的是什么？

它不是单纯为了“写法优雅”，而是在防几类非常真实的风险：

- 高权限对象在交易中途被截留
- 脚本忘记归还权限，留下悬空状态
- 扩展逻辑把权限对象带进了不该到达的路径
- 多步骤操作中，权限边界变得不再可审计

把 `borrow -> use -> return` 强制收束在同一笔事务里，相当于给高权限操作加了一条硬约束：

你可以临时拿来做事，但不能把它带走。

### 为什么要配合 Hot Potato Receipt？

因为只靠“开发者自觉调用 return”是不够的。

只要类型系统允许你漏掉归还步骤，迟早会有人：

- 在脚本里忘掉
- 在重构时删掉
- 在错误分支里直接 `return`

加入 receipt 之后，编译器和类型系统会一起逼你把流程走完。

### 完整 TypeScript 调用示例

```
import { Transaction } from "@mysten/sui/transactions";

const WORLD_PKG = "0x...";

async function bringGateOnline(
  tx: Transaction,
  characterId: string,
  ownerCapId: string,
  gateId: string,
  networkNodeId: string,
) {
  // ① 借用 OwnerCap
  const [ownerCap, receipt] = tx.moveCall({
    target: `${WORLD_PKG}::character::borrow_owner_cap`,
    typeArguments: [`${WORLD_PKG}::gate::Gate`],
    arguments: [
      tx.object(characterId),
      tx.receivingRef({ objectId: ownerCapId, version: "...", digest: "..." }),
    ],
  });

  // ② 使用 OwnerCap：将星门上线
  tx.moveCall({
    target: `${WORLD_PKG}::gate::online`,
    arguments: [
      tx.object(gateId),
      tx.object(networkNodeId),
      tx.object(ENERGY_CONFIG_ID),
      ownerCap,
    ],
  });

  // ③ 归还 OwnerCap（receipt 被消耗，热土豆使此步不可跳过）
  tx.moveCall({
    target: `${WORLD_PKG}::character::return_owner_cap`,
    arguments: [tx.object(characterId), ownerCap, receipt],
  });
}
```

---

## 11.5 所有权转让场景

### 场景一：转让单个组件的控制权

如果你想把一个星门的控制权交给盟友（但保留你的 Character 和其他设施），可以只转让对应的 `OwnerCap`：

```
// 从你的 Character 取出 OwnerCap，发给盟友
const tx = new Transaction();

// 取出 OwnerCap（注意这里不是借用，而是转移）
// 具体 API 以世界合约为准，此处仅展示思路
tx.moveCall({
  target: `${WORLD_PKG}::character::transfer_owner_cap`,
  typeArguments: [`${WORLD_PKG}::gate::Gate`],
  arguments: [
    tx.object(myCharacterId),
    tx.object(ownerCapId),
    tx.pure.address(allyAddress),  // 盟友的 Character 地址
  ],
});
```

### 场景二：转让完整角色（所有资产打包转让）

转移整个 Character 对象，则对应钱包地址即可控制所有绑定资产。适合联盟整体资产交割、账号交易等场景。

这里要区分三件听起来很像、但完全不同的动作：

- **转让单个 OwnerCap** 只交出某一个设施的控制权
- **转让 Character** 把一整串权限和资产一起交出去
- **委托操作** 不转移所有权，只给对方有限操作能力

如果这三件事不分开，你的产品设计会很快乱掉。

比如联盟金库场景：

- 财产权可能属于联盟主体
- 日常操作权可能属于值班成员
- 紧急停机权可能只属于核心管理员

这就要求你不能只用“一个 owner”去表达全部关系。

### 场景三：委托操作（不转让所有权）

通过编写扩展合约，可以允许特定地址在**有限范围内**操作你的设施，而无需转让 OwnerCap：

```
// 在你的扩展合约中，维护一个操作员白名单
public struct OperatorRegistry has key {
    id: UID,
    operators: Table<address, bool>,
}

public fun delegated_action(
    registry: &OperatorRegistry,
    ctx: &TxContext,
) {
    // 验证调用者在操作员名单中
    assert!(registry.operators.contains(ctx.sender()), ENotOperator);
    // ... 执行操作
}
```

### 委托最容易踩的坑

很多人第一次做委托，会把白名单当成“弱化版所有权”。这是不够的。

一个安全的委托设计，至少要回答：

- 委托人能做哪些动作，不能做哪些动作？
- 委托有没有时间限制？
- 委托能不能撤销？
- 委托是不是只对某一个设施有效？
- 被委托人能不能再次转授？

如果这些边界没有写清，委托就会从“灵活授权”变成“隐形送权”。

---

## 11.6 OwnerCap 的安全边界

### 每个 OwnerCap 只对一个对象有效

```
public fun verify_owner_cap<T: key>(
    obj: &T,
    owner_cap: &OwnerCap<T>,
) {
    // authorized_object_id 确保这个 OwnerCap 只能用于对应的那个对象
    assert!(
        owner_cap.authorized_object_id == object::id(obj),
        EOwnerCapMismatch
    );
}
```

这意味着如果你有两个星门，就有两个 `OwnerCap<Gate>`，它们不能互换使用。

### 为什么 `authorized_object_id` 这么关键？

因为 `phantom T` 只解决了“对象类别不能混用”，但还没解决“同类不同实例不能混用”。

例如：

- `OwnerCap<Gate>` 只能用于 Gate，没有问题
- 但如果没有 `authorized_object_id` 你的一张 Gate 权限就可能错误地操作另一座 Gate

所以完整安全边界其实是两层：

1. **类型边界**`Gate` 和 `StorageUnit` 不能混
1. **实例边界** 这座 Gate 和那座 Gate 也不能混

### 丢失 OwnerCap 意味着失去控制权

如果 OwnerCap 所在的 Character 被转让，你就失去了对所有设施的控制。请**妥善保管你的 Character 对象的所有权私钥**。

从运营角度看，更准确地说，你要保护的不是“某个按钮权限”，而是整条经营控制链：

- 钱包签名权
- Character 控制权
- Character 内部的 OwnerCap 集合
- 关键委托配置和多签设置

一旦这条链断掉，恢复成本会非常高。

---

## 11.7 高级：多签与联盟共有

通过 Sui 的多签（Multisig）功能，可以让一个联盟共同控制关键设施：

```
# 创建 2/3 多签地址（需要 3 个成员中的 2 个同意才能操作）
sui keytool multi-sig-address \
  --pks <pk1> <pk2> <pk3> \
  --weights 1 1 1 \
  --threshold 2
```

将 Character 的控制地址设置为多签地址，联盟关键资产就需要多人签名才能操作。

### 多签适合什么，不适合什么？

多签非常适合：

- 联盟金库
- 超高价值基础设施
- 关键参数调整
- 升级与紧急停机

多签不一定适合：

- 高频日常操作
- 玩家需要秒级响应的交互
- 大量小额重复管理动作

所以现实做法通常不是“全部都上多签”，而是分层：

- 核心控制权放多签
- 日常运营权限通过受限委托释放给执行层

这才更接近真实组织结构。

---

## 🔖 本章小结

| 概念                | 核心要点                                            |
| ----------------- | ----------------------------------------------- |
| 权限层级              | GovernorCap > AdminACL > OwnerCap               |
| Character 钥匙串     | 所有 OwnerCap 集中存储，转让 Character = 转让所有资产          |
| Borrow-Use-Return | 三步原子操作，ReturnReceipt（热土豆）确保必须归还                 |
| 类型安全              | `OwnerCap<Gate>` ≠ `OwnerCap<StorageUnit>`，无法混用 |
| 委托操作              | 通过扩展合约 + 白名单实现，无需转让 OwnerCap                    |
| 多签                | Sui 原生多签地址适合联盟共有资产场景                            |

## 19. Chapter 12: Move 进阶 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-12.html

# Chapter 12：Move 进阶 — 泛型、动态字段与事件系统

**目标：** 掌握 Move 中泛型编程、动态字段存储、Table/VecMap 数据结构和事件系统，能独立设计复杂的链上数据模型。

---

状态：设计进阶章节。正文以泛型、动态字段、事件和 Table/VecMap 为主。

## 12.1 泛型（Generics）

泛型让你的代码可以适用于多种类型，同时保持类型安全。这在 EVE Frontier 的 OwnerCap 中被广泛使用。

### 基础泛型语法

```
// T 是类型参数，类似其他语言的 <T>
public struct Box<T: store> has key, store {
    id: UID,
    value: T,
}

// 泛型函数
public fun wrap<T: store>(value: T, ctx: &mut TxContext): Box<T> {
    Box { id: object::new(ctx), value }
}

public fun unwrap<T: store>(box: Box<T>): T {
    let Box { id, value } = box;
    id.delete();
    value
}
```

### Phantom 类型参数

`phantom T` 不真正持有 T 类型的值，只用于类型区分：

```
// T 没有实际被使用，但创造了类型区分
public struct OwnerCap<phantom T> has key {
    id: UID,
    authorized_object_id: ID,
}

// 这两个是完全不同的类型，系统不会混淆
let gate_cap: OwnerCap<Gate> = ...;
let ssu_cap: OwnerCap<StorageUnit> = ...;
```

### 带约束的泛型

```
// T 必须同时具有 key 和 store abilities
public fun transfer_to_object<T: key + store, Container: key>(
    container: &mut Container,
    value: T,
) { ... }

// T 必须具有 copy 和 drop（临时值，不是资产）
public fun log_value<T: copy + drop>(value: T) { ... }
```

### 泛型在 Move 里为什么特别重要？

因为 Move 里很多安全设计都不是靠“传一个字符串标识类型”，而是直接把类型本身放进接口里。

这样做的好处是：

- 编译期就能发现类型不匹配
- 权限和对象类别可以被强绑定
- 你不用在运行时手写一大堆脆弱的类型判断

### `phantom` 到底解决了什么？

第一次看 `phantom T` 很容易觉得它只是语法技巧。其实它解决的是：

“我不需要真的存一个 T，但我需要这个类型身份参与安全边界。”

这在权限对象里特别常见，因为权限真正关心的常常不是数据本体，而是“这张权限卡到底是给谁的”。

### 什么时候该上泛型，什么时候不要上？

适合用泛型的场景：

- 权限对象
- 通用容器
- 同一套逻辑要服务多个对象类型
- 类型本身承载安全含义

不适合过度泛型化的场景：

- 业务语义已经非常明确
- 只有一两种固定对象类型
- 泛型会让接口阅读成本明显升高

也就是说，泛型不是为了“显得高级”，而是为了把“这套逻辑天然是通用的”表达清楚。

---

## 12.2 动态字段（Dynamic Fields）

Sui 有一个强大特性：**动态字段（Dynamic Fields）**，允许在运行时向对象添加任意键值对，不需要在编译期定义所有字段。

### 为什么需要动态字段？

假设你的存储箱需要支持任意类型的物品，而物品类型在编译时未知：

```
// ❌ 不灵活的方式：固定字段
public struct Inventory has key {
    id: UID,
    fuel: Option<u64>,
    ore: Option<u64>,
    // 新增物品类型就要修改合约...
}

// ✅ 灵活的方式：动态字段
public struct Inventory has key {
    id: UID,
    // 没有预定义字段，用动态字段存储
}
```

### 动态字段 API

```
use sui::dynamic_field as df;
use sui::dynamic_object_field as dof;

// 添加动态字段（值不是对象类型）
df::add(&mut inventory.id, b"fuel_amount", 1000u64);

// 读取动态字段
let fuel: &u64 = df::borrow(&inventory.id, b"fuel_amount");
let fuel_mut: &mut u64 = df::borrow_mut(&mut inventory.id, b"fuel_amount");

// 检查是否存在
let exists = df::exists_(&inventory.id, b"fuel_amount");

// 移除动态字段
let old_value: u64 = df::remove(&mut inventory.id, b"fuel_amount");

// 动态对象字段（值本身是一个对象，有独立 ObjectID）
dof::add(&mut storage.id, item_type_id, item_object);
let item = dof::borrow<u64, Item>(&storage.id, item_type_id);
let item = dof::remove<u64, Item>(&mut storage.id, item_type_id);
```

### EVE Frontier 中的实际应用

存储单元的 **临时仓库（Ephemeral Inventory）** 就是用动态字段实现的：

```
// 为特定角色创建临时仓库（以角色 OwnerCap ID 为 key）
df::add(
    &mut storage_unit.id,
    owner_cap_id,      // 用角色的 OwnerCap ID 作为 key
    EphemeralInventory::new(ctx),
);

// 角色访问自己的临时仓库
let my_inventory = df::borrow_mut<ID, EphemeralInventory>(
    &mut storage_unit.id,
    my_owner_cap_id,
);
```

### 动态字段的真正价值

它最大的价值不是“省得改 struct 定义”，而是：

让对象在运行时长出新的子状态，而不必提前把所有槽位写死。

这对游戏型系统尤其关键，因为很多状态是天然开放集合：

- 一个仓库可能容纳很多种物品
- 一个设施可能服务很多个角色
- 一个市场可能有不断新增的挂单

如果都写成固定字段，你的结构会很快失控。

### 什么时候用 `dynamic_field`，什么时候用 `dynamic_object_field`？

一个很实用的判断标准：

- **值只是一个简单值或普通 struct** 用 `dynamic_field`
- **值本身也应该是独立对象** 用 `dynamic_object_field`

后者更适合：

- 需要独立对象 ID
- 需要单独转移、引用、删除
- 后续可能被别的逻辑单独操作

### 动态字段最常见的误区

#### 1. 把它当成“万能数据库”

动态字段很灵活，但不是无限免费。它会带来：

- 更高的读写成本
- 更复杂的索引路径
- 更高的调试难度

#### 2. 键设计过于随意

如果 key 设计不稳定，后面会出现：

- 同一业务实体找不到原来的数据
- 链下和链上的映射规则不一致
- 数据看似写成功，实际读不回来

#### 3. 把频繁遍历的大集合直接塞进去

动态字段适合按 key 定位，不天然适合做高频全量遍历。只要你的业务经常需要“把所有条目扫一遍”，就要开始考虑索引和分页策略。

---

## 12.3 Table 与 VecMap：链上集合类型

### Table：键值映射

```
use sui::table::{Self, Table};

public struct Registry has key {
    id: UID,
    members: Table<address, MemberInfo>,
}

// 添加
table::add(&mut registry.members, member_addr, MemberInfo { ... });

// 查询
let info = table::borrow(®istry.members, member_addr);
let info_mut = table::borrow_mut(&mut registry.members, member_addr);

// 存在检查
let is_member = table::contains(®istry.members, member_addr);

// 移除
let old_info = table::remove(&mut registry.members, member_addr);

// 长度
let count = table::length(®istry.members);
```

⚠️ **注意**：Table 中的每个条目在链上都是一个独立的动态字段，每次访问都有单独的 cost。一个交易内最多访问 **1024 个动态字段**。

### VecMap：小规模有序映射

```
use sui::vec_map::{Self, VecMap};

// VecMap 存储在对象字段中（不是动态字段），适合小数据集
public struct Config has key {
    id: UID,
    toll_settings: VecMap<u64, u64>,  // zone_id -> toll_amount
}

// 操作
vec_map::insert(&mut config.toll_settings, zone_id, amount);
let amount = vec_map::get(&config.toll_settings, &zone_id);
vec_map::remove(&mut config.toll_settings, &zone_id);
```

### 选择建议

| 场景                  | 推荐类型                   |
| ------------------- | ---------------------- |
| 大规模、动态增长的集合         | `Table`                |
| 小于 100 条、需要遍历       | `VecMap` 或 `vector`    |
| 以对象为值（有独立 ObjectID） | `dynamic_object_field` |
| 以简单值为值（u64, bool 等） | `dynamic_field`        |

## 20. Chapter 13: NFT 设计与元数据管理 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-13.html

# Chapter 13：NFT 设计与元数据管理

**目标：** 掌握 Sui 的 NFT 标准（Display），设计可进化的动态 NFT，以及在 EVE Frontier 生态中应用 NFT 作为权限凭证、成就徽章和游戏资产。

---

状态：设计进阶章节。正文以 NFT 标准、动态元数据和 Collection 模式为主。

## 13.1 Sui 的 NFT 模型

在 Sui 上，NFT 就是一个带有 `key` ability 的唯一对象。没有特殊的 “NFT 合约”——任何带有唯一 ObjectID 的对象都天然是 NFT：

```
// 最简单的 NFT
public struct Badge has key, store {
    id: UID,
    name: vector<u8>,
    description: vector<u8>,
    image_url: vector<u8>,
}
```

最重要的理解不是“NFT 能显示图片”，而是：

NFT 在 Sui 里首先是一个对象，其次才是一个收藏品或展示品。

这意味着你可以很自然地把 NFT 用在三类不同场景：

- **纯展示型** 勋章、纪念品、成就证明
- **权限型** 通行证、会员卡、白名单凭证
- **功能型** 可升级飞船、装备、订阅权、租赁凭证

这三类 NFT 的设计重点完全不同。

### 设计 NFT 前先问四个问题

1. 它主要是展示品、权限卡，还是可操作资产？
1. 它是否允许转让？
1. 它的元数据是否会变化？
1. 前端和市场应不应该把它当“可交易商品”看待？

只要这四个问题没答清，后面的 `Display`、`Collection`、`TransferPolicy` 都很容易做偏。

---

## 13.2 Sui Display 标准：让 NFT 在各处正确显示

`Display` 对象告诉钱包、市场如何显示你的 NFT：

```
module my_nft::space_badge;

use sui::display;
use sui::package;
use std::string::utf8;

// 一次性见证（创建 Publisher）
public struct SPACE_BADGE has drop {}

public struct SpaceBadge has key, store {
    id: UID,
    name: String,
    tier: u8,           // 1=铜牌, 2=银牌, 3=金牌
    earned_at_ms: u64,
    image_url: String,
}

fun init(witness: SPACE_BADGE, ctx: &mut TxContext) {
    // 1. 用 OTW 创建 Publisher（证明这个包的作者身份）
    let publisher = package::claim(witness, ctx);

    // 2. 创建 Display（定义如何展示 SpaceBadge）
    let mut display = display::new_with_fields<SpaceBadge>(
        &publisher,
        // 字段名   // 模板值（{field_name} 会被实际字段值替换）
        vector[
            utf8(b"name"),
            utf8(b"description"),
            utf8(b"image_url"),
            utf8(b"project_url"),
        ],
        vector[
            utf8(b"{name}"),                                          // NFT 名称
            utf8(b"EVE Frontier Builder Badge - Tier {tier}"),        // 描述
            utf8(b"{image_url}"),                                     // 图片 URL
            utf8(b"https://evefrontier.com"),                         // 项目链接
        ],
        ctx,
    );

    // 3. 提交 Display（冻结版本，使其对外可见）
    display::update_version(&mut display);

    // 4. 转移（Publisher 给部署者，Display 共享或冻结）
    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_freeze_object(display);
}
```

### `Display` 真正解决的是什么？

它解决的是“链上对象字段”到“钱包和市场展示内容”之间的解释层问题。

如果没有这层：

- 钱包只能看到生硬字段
- 市场很难统一显示名称、描述、图片
- 同一类 NFT 在不同前端里会表现不一致

所以 `Display` 不是装饰，而是 NFT 产品体验的一部分。

### 设计 Display 时最容易犯的错

#### 1. 把所有展示语义都塞进链上字段

不是所有展示文案都要做成可变链上字段。有些稳定说明更适合放在模板里，有些动态状态才适合放字段里。

#### 2. 过度依赖外部图片 URL

如果图片资源路径不稳定，NFT 本体还在，但用户看到的体验会崩。

#### 3. 字段命名和前端理解脱节

如果链上字段叫得过于内部化，前端和钱包层就很难稳定解释。

---

## 13.3 动态 NFT：会进化的元数据

EVE Frontier 的游戏状态实时变化，你的 NFT 元数据也可以随之变化：

```
module my_nft::evolving_ship;

/// 可进化的飞船 NFT
public struct EvolvingShip has key, store {
    id: UID,
    name: String,
    hull_class: u8,        // 0=护卫舰, 1=巡洋舰, 2=战列舰
    combat_score: u64,     // 战斗积分（随战斗增加）
    kills: u64,            // 击杀数
    image_url: String,     // 根据 hull_class 变化
}

/// 记录战斗结果（由炮塔合约调用）
public fun record_kill(
    ship: &mut EvolvingShip,
    ctx: &TxContext,
) {
    ship.kills = ship.kills + 1;
    ship.combat_score = ship.combat_score + 100;

    // 升级飞船等级（进化）
    if ship.combat_score >= 10_000 && ship.hull_class < 2 {
        ship.hull_class = ship.hull_class + 1;
        // 更新图片 URL（指向更高级别的资产）
        ship.image_url = get_image_url(ship.hull_class);
    }
}

fun get_image_url(class: u8): String {
    let base = b"https://assets.evefrontier.com/ships/";
    let suffix = if class == 0 { b"frigate.png" }
                 else if class == 1 { b"cruiser.png" }
                 else { b"battleship.png" };
    // 拼接 URL（Move 中字符串操作用 sui::string）
    let mut url = std::string::utf8(base);
    url.append(std::string::utf8(suffix));
    url
}
```

**Display 模板自动更新**：由于 Display 用 `{hull_class}` 和 `{image_url}` 等字段的当前值渲染，当字段变化时，NFT 在钱包中的显示也会立即更新。

### 动态 NFT 适合什么，不适合什么？

适合：

- 成长型资产
- 会被状态影响价值的物品
- 游戏内战绩、成就、熟练度映射

不一定适合：

- 强调静态稀缺叙事的收藏品
- 二级市场非常依赖固定元数据的资产

因为一旦元数据可变，你就默认引入了新的产品问题：

- 谁能改？
- 改动是否可审计？
- 玩家买入时到底买的是当前状态，还是未来可能变化的状态？

### 动态元数据设计的关键边界

- **状态变化是否链上可追溯** 最好有事件记录
- **改动权限是否明确** 不是任何模块都能乱改
- **前端是否能正确反映变化** 否则链上变了，用户界面还停在旧图

---

## 13.4 集合（Collection）模式

```
module my_nft::badge_collection;

/// 勋章系列集合（元对象，描述这个 NFT 系列）
public struct BadgeCollection has key {
    id: UID,
    name: String,
    total_supply: u64,
    minted_count: u64,
    admin: address,
}

/// 单个勋章
public struct AllianceBadge has key, store {
    id: UID,
    collection_id: ID,      // 归属于哪个集合
    serial_number: u64,     // 系列编号（第几个铸造的）
    tier: u8,
    attributes: vector<NFTAttribute>,
}

public struct NFTAttribute has store, copy, drop {
    trait_type: String,
    value: String,
}

/// 铸造勋章（追踪编号和总量）
public fun mint_badge(
    collection: &mut BadgeCollection,
    recipient: address,
    tier: u8,
    attributes: vector<NFTAttribute>,
    ctx: &mut TxContext,
) {
    assert!(ctx.sender() == collection.admin, ENotAdmin);
    assert!(collection.minted_count < collection.total_supply, ESoldOut);

    collection.minted_count = collection.minted_count + 1;

    let badge = AllianceBadge {
        id: object::new(ctx),
        collection_id: object::id(collection),
        serial_number: collection.minted_count,
        tier,
        attributes,
    };

    transfer::public_transfer(badge, recipient);
}
```

Collection 的价值，不只是“把一批 NFT 归个类”，而是让系列化管理变得清晰：

- 总量控制
- 编号追踪
- 官方系列身份
- 前端聚合展示

### Collection 最适合解决哪些问题？

- 某一系列是否已经售罄
- 第几号资产属于哪一系列
- 一个 badge 是否来自官方那套发行体系

如果没有 collection 这一层，你后面做：

- 系列页
- 稀有度统计
- 官方认证

都会变得更难。

---

## 13.5 NFT 作为访问控制凭证

在 EVE Frontier 中，NFT 是最天然的权限载体：

```
// 使用 NFT 检查权限的方式
public fun enter_restricted_zone(
    gate: &Gate,
    character: &Character,
    badge: &AllianceBadge,   // 持有勋章才能调用
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // 验证勋章等级（需要金牌才能进入）
    assert!(badge.tier >= 3, EInsufficientBadgeTier);
    // 验证勋章属于正确集合（防止伪造）
    assert!(badge.collection_id == OFFICIAL_COLLECTION_ID, EWrongCollection);
    // ...
}
```

这是 EVE Builder 里 NFT 最实用的一类用法，因为它把“权限”做成了玩家真的能持有和理解的对象。

### 为什么权限 NFT 往往比地址白名单更好？

因为它更灵活，也更产品化：

- 可以转让
- 可以回收
- 可以有等级
- 可以有到期时间
- 前端可以直观展示

但也要小心一件事：

只要它能转让，权限也会跟着流动。

所以你必须先决定，这张权限 NFT 到底应该是：

- 可转让的市场资产
- 还是不可转让的身份凭证

---

## 13.6 NFT 转让策略

Sui 支持灵活的 NFT 转让政策：

```
// 默认：任何人都可以转让（public_transfer）
transfer::public_transfer(badge, recipient);

// 锁仓：NFT 只能由特定合约转移（通过 TransferPolicy）
use sui::transfer_policy;

// 在包初始化时建立 TransferPolicy（限制转让条件）
fun init(witness: SPACE_BADGE, ctx: &mut TxContext) {
    let publisher = package::claim(witness, ctx);
    let (policy, policy_cap) = transfer_policy::new<SpaceBadge>(&publisher, ctx);

    // 添加自定义规则（如需支付版税）
    // royalty_rule::add(&mut policy, &policy_cap, 200, 0); // 2% 版税

    transfer::public_share_object(policy);
    transfer::public_transfer(policy_cap, ctx.sender());
    transfer::public_transfer(publisher, ctx.sender());
}
```

### 转让策略本质上是在定义“这个 NFT 的社会属性”

- **自由转让** 更像商品
- **受限转让** 更像带规则的许可
- **不可转让** 更像身份或成就

这不是技术细节，而是产品定位。

如果你的 NFT 是：

- 会员资格
- 实名凭证
- 联盟内部身份卡

那默认自由转让往往不是好主意。

---

## 13.7 将 NFT 嵌入 EVE Frontier 资产（对象拥有对象）

```
// 飞船装备 NFT（被飞船对象持有）
public struct Equipment has key, store {
    id: UID,
    name: String,
    stat_bonus: u64,
}

public struct Ship has key {
    id: UID,
    // Equipment 被嵌入 Ship 对象中（对象拥有对象）
    equipped_items: vector<Equipment>,
}

// 为飞船装备物品
public fun equip(
    ship: &mut Ship,
    equipment: Equipment,  // Equipment 从玩家钱包移入 Ship
    ctx: &TxContext,
) {
    vector::push_back(&mut ship.equipped_items, equipment);
}
```

对象拥有对象这套设计，对游戏资产尤其自然，因为它允许你表达：

- 一艘船拥有多件装备
- 一个角色拥有一套证件
- 一个容器里放着多个特殊资产

### 什么时候该把 NFT 独立存在，什么时候该嵌进去？

适合独立存在：

- 需要单独交易
- 需要单独展示
- 需要单独授权或转让

适合嵌进别的对象：

- 主要作为某个大对象的组成部分
- 不需要频繁单独流转
- 更强调组合后的整体状态

这背后其实是在平衡“可流通性”和“组合表达力”。

---

## 🔖 本章小结

| 知识点            | 核心要点                                  |
| -------------- | ------------------------------------- |
| Sui NFT 本质     | 带 `key` 的唯一对象，ObjectID 即 NFT ID       |
| Display 标准     | `display::new_with_fields()` 定义钱包显示模板 |
| 动态 NFT         | 字段可变 + Display 模板引用字段 → 自动同步显示        |
| Collection 模式  | MetaObject 追踪总量和编号                    |
| NFT 作为权限       | 传入 NFT 引用做权限检查，比地址白名单更灵活              |
| TransferPolicy | 控制 NFT 二级市场转让规则（如版税）                  |

## 21. Chapter 14: 链上经济系统设计 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-14.html

# Chapter 14：链上经济系统设计

**目标：** 学会在 EVE Frontier 中设计和实现完整的链上经济系统，包括自定义代币发行、去中心化市场、动态定价与金库管理。

---

状态：设计进阶章节。正文以代币、市场、金库和定价机制为主。

## 14.1 EVE Frontier 的经济体系

EVE Frontier 本身已有两种官方货币：

********

| 货币        | 用途        | 特点              |
| --------- | --------- | --------------- |
| LUX       | 游戏内主流交易货币 | 稳定，用于日常服务和商品交易  |
| EVE Token | 生态代币      | 用于开发者激励，可购买特殊资产 |

## 22. Chapter 15: 跨合约组合性 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-15.html

# Chapter 15：跨合约组合性（Composability）

**目标：** 掌握如何设计对外友好的合约接口，以及如何安全地调用其他 Builder 发布的合约，构建可组合的 EVE Frontier 生态系统。

---

状态：设计进阶章节。正文以跨合约接口与可组合性为主。

## 15.1 可组合性的价值

EVE Frontier 最激动人心的特性之一：**你的合约可以直接调用他人的合约，无需任何中间人**。

```
Builder A：发行了 ALLY Token + 价格预言机
Builder B：调用 A 的价格预言机，以 ALLY Token 定价出售物品
Builder C：在 B 的市场上架，同时接受 A 的 ALLY 和 SUI 支付
```

这创造了真正意义上的**开放经济协议栈**。

可组合性真正厉害的地方，不是“大家都能互相调用”这句口号，而是：

你写的协议一旦足够清晰，别人就能把它当积木，而不是把它当黑盒。

这会直接改变 Builder 的思路：

- 你不再只是做一个单点功能
- 你是在决定自己要成为“终端产品”还是“底层能力”

很多最有价值的协议，并不是自己包办所有事，而是把某一个能力做成别人愿意反复接入的模块。

---

## 15.2 设计对外友好的 Move 接口

好的 Move 接口设计应遵循：

```
module my_protocol::oracle;

// ── 公开的视图函数（只读，免费调用）──────────────────────

/// 获取 ALLY/SUI 汇率（以 MIST 计）
public fun get_ally_price(oracle: &PriceOracle): u64 {
    oracle.ally_per_sui
}

/// 检查价格是否在有效期内
public fun is_price_fresh(oracle: &PriceOracle, clock: &Clock): bool {
    clock.timestamp_ms() - oracle.last_updated_ms < PRICE_TTL_MS
}

// ── 公开的可组合函数（其他合约可调用）───────────────────

/// 将 SUI 金额换算为 ALLY 数量
public fun sui_to_ally_amount(
    oracle: &PriceOracle,
    sui_amount: u64,
    clock: &Clock,
): u64 {
    assert!(is_price_fresh(oracle, clock), EPriceStale);
    sui_amount * oracle.ally_per_sui / 1_000_000_000
}
```

### 设计原则

********************

| 原则    | 实现方式                            |
| ----- | ------------------------------- |
| 只读视图  | `public fun` 不含 `&mut`，零 Gas 调用 |
| 可组合操作 | 接受 Witness 参数，允许授权调用方执行         |
| 版本化   | 保留旧接口，新接口以新函数名/类型参数区分           |
| 事件发射  | 关键操作发射事件，方便监听                   |
| 文档化   | 完整注释说明前置条件和返回值                  |

## 23. Chapter 16: 位置与临近性系统 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-16.html

# Chapter 16：位置与临近性系统

**目标：** 理解 EVE Frontier 的链上位置隐私设计，掌握如何利用临近性系统构建地理化游戏逻辑，以及未来 ZK 证明方向。

---

状态：教学示例章节。正文以位置隐私、服务器证明和未来 ZK 方向为主。

## 16.1 空间游戏的链上挑战

一个传统MMORPG游戏中，位置信息由游戏服务器统一管理。在链上，这带来两个矛盾：

1. **透明性**：链上数据任何人可查；若坐标明文存储，所有玩家隐藏基地的位置立即暴露
1. **信任性**：如果位置由客户端上报，玩家可以造假（“我就在你旁边！”）

EVE Frontier 的解决方案：**哈希位置 + 信任游戏服务器签名**。

这里最重要的不是记住“哈希位置”这四个字，而是先看清它到底在平衡什么：

- **隐私** 不能把基地、设施、玩家位置直接公开
- **可验证** 又必须让某些距离相关动作能被证明
- **可用性** 还不能把整套系统设计得慢到没法玩

所以位置系统本质上是一个“隐私、可信、实时性”三者之间的工程折中。

---

## 16.2 哈希位置：保护坐标隐私

链上存储的不是明文坐标，而是 **哈希值**：

```
存储：hash(x, y, salt) → chain.location_hash
查询：任何人只能看到哈希，无法反推坐标
验证：玩家向服务器证明"我知道这个哈希对应的坐标"
```

```
// location.move（简化版）
public struct Location has store {
    location_hash: vector<u8>,  // 坐标的哈希，而不是明文坐标
}

/// 更新位置（需要游戏服务器签名授权）
public fun update_location(
    assembly: &mut Assembly,
    new_location_hash: vector<u8>,
    admin_acl: &AdminACL,  // 必须由授权服务器作为赞助者
    ctx: &TxContext,
) {
    verify_sponsor(admin_acl, ctx);
    assembly.location.location_hash = new_location_hash;
}
```

### 哈希位置能保护什么，不能保护什么？

它能保护的是：

- 链上不直接暴露明文坐标
- 普通观察者无法直接从对象字段看到真实地点

它不能自动保护的是：

- 弱哈希或可枚举空间带来的反推风险
- 链下接口泄露真实位置
- 前端或日志把映射关系意外暴露出去

也就是说，哈希只是隐私体系的一层，不是全部。

---

## 16.3 临近性验证：服务器签名模式

当需要验证“A 在 B 附近“时（如取物品、跳跃），当前采用**服务器签名**：

```
① 玩家向游戏服务器请求："证明我在星门 0x...附近"
② 服务器查询玩家的实际游戏坐标
③ 服务器验证玩家确实在星门附近（<20km）
④ 服务器用私钥签名"玩家A在星门B附近"的声明
⑤ 玩家将这个签名附在交易中提交
⑥ 链上合约验证签名来自授权服务器（AdminACL）
```

这套设计里最关键的信任边界是：

链上并不知道真实坐标，它只相信“被授权的服务器已经替它判断过这件事”。

这意味着系统安全不只取决于链上校验是否严格，也取决于：

- 游戏服务器是否诚实
- 签名 payload 是否完整
- 时间窗和 nonce 是否设计正确

```
// 星门链接时的距离验证
public fun link_gates(
    gate_a: &mut Gate,
    gate_b: &mut Gate,
    owner_cap_a: &OwnerCap<Gate>,
    distance_proof: vector<u8>,  // 服务器签名的"两门距离 > 20km"证明
    admin_acl: &AdminACL,
    ctx: &TxContext,
) {
    // 验证服务器签名（简化；实际实现验证 ed25519 签名）
    verify_sponsor(admin_acl, ctx);
    // ...
}
```

### 16.3.1 建议的最小证明消息体

不要把“附近证明”做成一个只有服务器自己看得懂的黑盒字节串。最小可落地的 payload 至少要绑定以下字段：

```
{
  "proof_type": "assembly_proximity",
  "player": "0xPLAYER",
  "assembly_id": "0xASSEMBLY",
  "location_hash": "0xHASH",
  "max_distance_m": 20000,
  "issued_at_ms": 1735689600000,
  "expires_at_ms": 1735689660000,
  "nonce": "4d2f1c..."
}
```

每个字段的职责：

- `player`：防止别的玩家复用证明
- `assembly_id`：防止把 A 星门的证明拿去调用 B 星门
- `location_hash`：把链上当前位置状态绑定进证明
- `issued_at_ms` / `expires_at_ms`：限制重放窗口
- `nonce`：防止同一窗口内多次重放

### 16.3.2 服务端签名与链上校验的最小闭环

链下服务至少要做两件事：先验证真实坐标关系，再对明确的 payload 签名。

```
type ProximityProofPayload = {
  proofType: "assembly_proximity";
  player: string;
  assemblyId: string;
  locationHash: string;
  maxDistanceM: number;
  issuedAtMs: number;
  expiresAtMs: number;
  nonce: string;
};

async function issueProximityProof(input: {
  player: string;
  assemblyId: string;
  expectedHash: string;
}) {
  const location = await getPlayerLocationFromGameServer(input.player);
  const assembly = await getAssemblyLocation(input.assemblyId);

  assert(hash(location) === input.expectedHash);
  assert(distance(location, assembly) <= 20_000);

  const payload: ProximityProofPayload = {
    proofType: "assembly_proximity",
    player: input.player,
    assemblyId: input.assemblyId,
    locationHash: input.expectedHash,
    maxDistanceM: 20_000,
    issuedAtMs: Date.now(),
    expiresAtMs: Date.now() + 60_000,
    nonce: crypto.randomUUID(),
  };

  return signPayload(payload);
}
```

链上侧至少要校验四层：

```
// 简化伪代码：真实实现应把 payload 反序列化后逐字段比对
public fun verify_proximity_proof(
    assembly_id: ID,
    expected_player: address,
    expected_hash: vector<u8>,
    proof_bytes: vector<u8>,
    admin_acl: &AdminACL,
    clock: &Clock,
    ctx: &TxContext,
) {
    verify_sponsor(admin_acl, ctx);

    let payload = decode_proximity_payload(proof_bytes);
    assert!(payload.assembly_id == assembly_id, EWrongAssembly);
    assert!(payload.player == expected_player, EWrongPlayer);
    assert!(payload.location_hash == expected_hash, EWrongLocationHash);
    assert!(clock.timestamp_ms() <= payload.expires_at_ms, EProofExpired);
    assert!(check_and_consume_nonce(payload.nonce), EReplay);
}
```

这里真正重要的是：`verify_sponsor(admin_acl, ctx)` 只证明“这笔交易来自授权服务端”，还不够证明“这条位置声明本身是针对当前对象、当前玩家、当前时间窗的”。

### 所以位置证明最容易犯的错是什么？

不是“签名算法写错”，而是 payload 绑定不完整。

一旦 payload 少绑定一项，就会出现经典复用问题：

- 绑定了玩家，没绑定对象 玩家能拿着 A 的证明去调 B
- 绑定了对象，没绑定时间窗 旧证明能被反复重放
- 绑定了时间，没绑定当前位置哈希 旧位置能冒充新位置

---

## 16.4 围绕位置系统的策略设计

即使位置是哈希的，Builder 仍然可以设计许多地理化逻辑：

### 策略一：位置锁定（资产绑定地点）

```
// 资产只在特定位置哈希处有效
public fun claim_resource(
    claim: &mut ResourceClaim,
    claimant_location_hash: vector<u8>,  // 服务器证明的位置
    admin_acl: &AdminACL,
    ctx: &mut TxContext,
) {
    verify_sponsor(admin_acl, ctx);
    // 验证玩家位置哈希与资源点匹配
    assert!(
        claimant_location_hash == claim.required_location_hash,
        EWrongLocation,
    );
    // 发放资源
}
```

位置系统真正有意思的地方在于：你不需要知道明文坐标，也能设计出非常强的空间规则。

这意味着 Builder 在上层业务里关心的通常不是“你具体在宇宙哪一点”，而是：

- 你是否在某个设施附近
- 你是否在某个区域内
- 你是否满足进入、提取、激活条件

这会让很多玩法更像“条件访问控制”，而不是“地图渲染系统”。

### 策略二：基地范围控制

```
public struct BaseZone has key {
    id: UID,
    center_hash: vector<u8>,   // 基地中心位置哈希
    owner: address,
    zone_nft_ids: vector<ID>,  // 在这个区域内的友方 NFT 列表
}

// 授权组件只对在基地范围内的玩家开放
public fun base_service(
    zone: &BaseZone,
    service: &mut StorageUnit,
    player_in_zone_proof: vector<u8>,  // 服务器证明"玩家在基地范围内"
    admin_acl: &AdminACL,
    ctx: &mut TxContext,
) {
    verify_sponsor(admin_acl, ctx);
    // ...提供服务
}
```

### 策略三：移动路径追踪（链外 + 链上结合）

```
// 链下：监听玩家位置更新事件
client.subscribeEvent({
  filter: { MoveEventType: `${WORLD_PKG}::location::LocationUpdated` },
  onMessage: (event) => {
    const { assembly_id, new_hash } = event.parsedJson as any;
    // 更新本地路径记录
    locationHistory.push({ assembly_id, hash: new_hash, time: Date.now() });
  },
});

// 链上：只存储哈希，链下解析路径
```

---

## 16.5 未来方向：零知识证明取代服务器信任

官方文档提到，**未来计划用 ZK 证明**替代当前的服务器签名：

```
现在：
  玩家 → 服务器（你在哪里？）→ 服务器签名 → 链上验证签名

未来（ZK）：
  玩家 → 本地计算 ZK 证明（"我知道满足这个哈希的坐标，且 < 20km"）
         → 链上 ZK 验证器（无需服务器参与）
```

**ZK 证明的优势**：

- 完全去中心化，不依赖服务器诚实性
- 玩家可以证明“我在这里“而不暴露具体坐标
- 理论上可以证明任意复杂的空间关系

**实际开发建议**：

- 当前阶段，与服务器集成时就把 payload 结构、时间窗、nonce 和对象绑定设计清楚（见 Chapter 8）
- `AdminACL.verify_sponsor()` 只能当“来源验证”的一层，不能替代 payload 校验
- 未来 ZK 上线后，尽量只替换“证明机制”，不要重写上层业务状态机

### 为什么现在就要按“将来可替换证明机制”的思路设计？

因为真正应该稳定的是上层业务语义，而不是今天采用的证明实现细节。

换句话说，你最好把系统拆成两层：

- **上层业务规则** 例如“只有在附近时才能取出物品”
- **底层证明机制** 例如今天是服务器签名，未来可能换成 ZK

这样未来升级时，你替换的是“如何证明”，而不是把整条业务状态机重写一遍。

### 16.5.1 失败场景与防御清单

| 失败场景    | 典型原因                     | 最小防御                    |
| ------- | ------------------------ | ----------------------- |
| 重放证明    | payload 没有 `nonce` 或过期时间 | 加 `nonce` + 短有效期 + 链上消费 |
| 错对象复用   | 证明没有绑定 `assembly_id`     | payload 强绑定目标对象         |
| 错人复用    | 证明没有绑定 `player`          | payload 强绑定调用者地址        |
| 旧位置复用   | 没有绑定 `location_hash`     | 把当前链上哈希写入 payload       |
| 服务端时钟偏差 | 过期判断不一致                  | 用链上 `Clock` 做最终裁决       |

## 24. Chapter 17: 测试、调试与安全审计 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-17.html

# Chapter 17：测试、调试与安全审计

**目标：** 能为 Move 合约编写完整的单元测试，识别常见安全漏洞，制定合约升级策略。

---

状态：工程保障章节。正文以测试、安全与升级风险控制为主。

## 17.1 为什么安全测试至关重要？

链上合约一旦部署，资产是真实的。以下是常见损失场景：

- 价格计算溢出，导致物品以 0 价格出售
- 权限检查遗漏，任何人都能调用 “仅 Owner” 函数
- 可重入漏洞（在 Move 中较少见但仍需关注）
- 升级失误导致旧数据无法被新合约读取

**防御策略：** 先测试，再发布。

这里最值得建立的观念不是“测试很重要”这种空话，而是：

链上合约测试的目标，不是证明它能跑，而是证明它在错误输入、错误顺序、错误权限下也不会失控。

很多初学者写测试，只会验证“正常路径成功”。但真实资产损失通常来自另外三类路径：

- 本来就不该成功的调用却成功了
- 边界值输入让系统进入异常状态
- 升级或维护后，旧对象与新逻辑不再兼容

所以对 Builder 来说，测试不是收尾工作，而是设计工作的一部分。

---

## 17.2 Move 单元测试基础

Move 内置了测试框架，测试代码写在同一个 `.move` 文件中，用 `#[test]` 注解标记：

```
module my_package::my_module;

// ... 正常合约代码 ...

// 测试模块：只在 test 环境编译
#[test_only]
module my_package::my_module_tests;

use my_package::my_module;
use sui::test_scenario::{Self, Scenario};
use sui::coin;
use sui::sui::SUI;
use sui::clock;

// ── 基础测试 ─────────────────────────────────────────────

#[test]
fun test_deposit_and_withdraw() {
    // 初始化测试场景（模拟区块链状态）
    let mut scenario = test_scenario::begin(@0xALICE);

    // 测试步骤 1：Alice 部署合约
    {
        let ctx = scenario.ctx();
        my_module::init_for_testing(ctx);  // 测试专用 init
    };

    // 测试步骤 2：Alice 存入物品
    scenario.next_tx(@0xALICE);
    {
        let mut vault = scenario.take_shared<my_module::Vault>();
        let ctx = scenario.ctx();

        my_module::deposit(&mut vault, 100, ctx);
        assert!(my_module::balance(&vault) == 100, 0);

        test_scenario::return_shared(vault);
    };

    // 测试步骤 3：Bob 尝试取款（应该失败）
    scenario.next_tx(@0xBOB);
    {
        let mut vault = scenario.take_shared<my_module::Vault>();
        // 期望这个调用会失败（abort）
        // 用 #[test, expected_failure] 测试失败路径
        test_scenario::return_shared(vault);
    };

    scenario.end();
}

// ── 测试失败路径 ────────────────────────────────────────

#[test]
#[expected_failure(abort_code = my_module::ENotOwner)]
fun test_unauthorized_withdraw_fails() {
    let mut scenario = test_scenario::begin(@0xALICE);

    // 部署
    { my_module::init_for_testing(scenario.ctx()); };

    // Bob 尝试以 Alice 身份操作（应 abort）
    scenario.next_tx(@0xBOB);
    {
        let mut vault = scenario.take_shared<my_module::Vault>();
        my_module::owner_withdraw(&mut vault, scenario.ctx()); // 应 abort
        test_scenario::return_shared(vault);
    };

    scenario.end();
}

// ── 使用 Clock 测试时间相关逻辑 ─────────────────────────

#[test]
fun test_time_based_pricing() {
    let mut scenario = test_scenario::begin(@0xALICE);
    let mut clock = clock::create_for_testing(scenario.ctx());

    // 设置当前时间
    clock.set_for_testing(1_000_000);

    {
        let price = my_module::get_dutch_price(
            1000,  // 起始价
            100,   // 最低价
            0,     // 开始时间
            2_000_000,  // 持续时间（2秒）
            &clock,
        );
        // 经过一半时间，价格应为中间值
        assert!(price == 550, 0);
    };

    clock.destroy_for_testing();
    scenario.end();
}
```

运行测试：

```
# 运行所有测试
sui move test

# 只运行特定测试
sui move test test_deposit_and_withdraw

# 显示详细输出
sui move test --verbose
```

### 写测试时，先分四类场景

一个实用的测试分层是：

1. **正常路径** 合法输入下，系统是否按预期完成
1. **权限失败路径** 没有权限时，是否稳定 abort
1. **边界值路径** 0、最大值、过期、空集合、最后一个条目等情况是否正确
1. **状态演进路径** 做完一步后，再做下一步，系统是否仍然一致

如果你的测试只有第一类，那其实还不够叫“有测试”。

### `test_scenario` 真正适合拿来干什么？

它最适合模拟：

- 多个地址轮流发起交易
- 共享对象在多笔交易里的状态变化
- 时间推进后的行为变化
- 对象创建、取回、归还的完整生命周期

这恰好就是 EVE Builder 项目最常见的风险集中区。

### 测试不是越细碎越好

有些测试太碎，最后只证明“小函数按字面工作”，却没有覆盖真正的业务闭环。

更有价值的做法通常是：

- 保留少量关键单元测试
- 再写几条端到端业务场景测试

例如租赁系统里，比起只测 `calc_refund()`，更重要的是测：

1. 创建挂单
1. 成功租用
1. 提前归还
1. 到期回收

这条完整链路是否闭合。

---

## 17.3 常见安全漏洞与防御

### 漏洞一：整数溢出/下溢

```
// ❌ 危险：u64 减法下溢会 abort，但如果逻辑错误可能算出极大值
fun unsafe_calc(a: u64, b: u64): u64 {
    a - b  // 如果 b > a，直接 abort（Move 会检查）
}

// ✅ 安全：在操作前检查
fun safe_calc(a: u64, b: u64): u64 {
    assert!(a >= b, EInsufficientBalance);
    a - b
}

// ✅ 对于有意允许的下溢，使用检查后的计算
fun safe_pct(total: u64, bps: u64): u64 {
    // bps 最大 10000，防止 total * bps 溢出
    assert!(bps <= 10_000, EInvalidBPS);
    total * bps / 10_000  // Move u64 最大 1.8e19，需要注意大数
}
```

✅ **Move 的优势**：Move 默认会检查 u64 运算溢出，溢出时 abort 而不是静默返回错误值（不同于 Solidity 早期版本）。

但要注意，Move 帮你解决的是“机器级溢出安全”，不是“业务数学正确”。

比如下面这些问题，类型系统并不会替你思考：

- 手续费是否应该先算再扣，还是先扣再算分润
- 百分比是否该向下取整还是四舍五入
- 多地址分账后余数应该留在金库还是返给用户

很多经济 bug 最后不是“黑客级漏洞”，而是结算口径本身设计错了。

### 漏洞二：权限检查遗漏

```
// ❌ 危险：没有验证调用者
public fun withdraw_all(treasury: &mut Treasury, ctx: &mut TxContext) {
    let all = coin::take(&mut treasury.balance, balance::value(&treasury.balance), ctx);
    transfer::public_transfer(all, ctx.sender()); // 任何人都能取走资金！
}

// ✅ 安全：要求 OwnerCap
public fun withdraw_all(
    treasury: &mut Treasury,
    _cap: &TreasuryOwnerCap,  // 检查调用者持有 OwnerCap
    ctx: &mut TxContext,
) {
    let all = coin::take(&mut treasury.balance, balance::value(&treasury.balance), ctx);
    transfer::public_transfer(all, ctx.sender());
}
```

权限检查里最容易犯的错，是只验证“某种权限存在”，却没验证：

- 这张权限是不是这个对象的
- 这笔调用是不是当前场景允许的
- 这张权限是不是应该只在某一时段或某一路径里使用

### 漏洞三：Capability 未正确绑定

```
// ❌ 危险：OwnerCap 没有验证对应的对象 ID
public fun admin_action(vault: &mut Vault, _cap: &OwnerCap) {
    // 任何 OwnerCap 都能控制任何 Vault！
}

// ✅ 安全：验证 OwnerCap 和对象的绑定关系
public fun admin_action(vault: &mut Vault, cap: &OwnerCap) {
    assert!(cap.authorized_object_id == object::id(vault), ECapMismatch);
    // ...
}
```

### 漏洞四：时间戳操控

```
// ❌ 不推荐：直接依赖 ctx.epoch() 作为精确时间
// epoch 的粒度是约 24 小时，不适合细粒度时效

// ✅ 推荐：使用 Clock 对象
public fun check_expiry(expiry_ms: u64, clock: &Clock): bool {
    clock.timestamp_ms() < expiry_ms
}
```

### 漏洞五：共享对象的竞态条件

共享对象可以被多个交易并发访问。当多个交易同时抢购同一物品时：

```
// ❌ 有竞态问题：两个交易可能同时通过检查
public fun buy_item(market: &mut Market, ...) {
    let listing = table::borrow(&market.listings, item_type_id);
    assert!(listing.amount > 0, EOutOfStock);
    // ← 另一个 TX 可能在这里同时通过同样的检查
    // ... 然后两个都执行购买，导致超卖
}

// ✅ Sui 的解决方案：通过对共享对象的写锁确保序列化
// Sui 的 Move 执行器保证：写同一个共享对象的交易是顺序执行的
// 所以上面的代码在 Sui 上实际是安全的！但要确保你的逻辑正确处理负库存
public fun buy_item(market: &mut Market, ...) {
    // 这次检查是原子的，其他 TX 会等待
    assert!(table::contains(&market.listings, item_type_id), ENotListed);
    let listing = table::remove(&mut market.listings, item_type_id);  // 原子移除
    // ...
}
```

虽然 Sui 会对共享对象写入做顺序化，但这不代表你就可以忽略业务竞态。

你仍然要测试：

- 同一商品被连续快速购买
- 一个对象被先下架再购买
- 价格更新与购买在相邻交易发生时的表现

也就是说，底层执行器帮你解决了一部分并发安全，但没有替你设计完整业务一致性。

---

## 17.4 使用 Move Prover 进行形式验证

Move Prover 是一个形式化验证工具，可以数学证明某些属性永远成立：

```
// spec 块：形式规范
spec fun total_supply_conserved(treasury: TreasuryCap<TOKEN>): bool {
    // 声明：铸造后总供应量增加的精确量
    ensures result == old(total_supply(treasury)) + amount;
}

#[verify_only]
spec module {
    // 不变量：金库余额永远不超过某个上限
    invariant forall vault: Vault:
        balance::value(vault.balance) <= MAX_VAULT_SIZE;
}
```

运行验证：

```
sui move prove
```

### Move Prover 什么时候值得上？

并不是所有项目都需要一开始就做形式验证。更实际的策略通常是：

- 普通案例和中小项目：先把单测和失败路径覆盖做好
- 高价值金库、清算、权限系统：再引入 Prover 证明关键不变量

最适合用 Prover 的地方通常包括：

- 总量守恒
- 余额不会为负
- 某类权限不能越权
- 某个状态机不会跳非法状态

---

## 17.5 合约升级策略

Move 包一旦发布是**不可变的**，但可以通过升级机制发布新版本：

```
# 首次发布
sui client publish 
# 得到 UpgradeCap 对象（升级权凭证）

# 升级（需要 UpgradeCap）
sui client upgrade \
  --upgrade-capability <UPGRADE_CAP_ID> \
```

### 升级兼容性规则

| 变更类型         | 是否允许  |
| ------------ | ----- |
| 添加新函数        | ✅ 允许  |
| 添加新模块        | ✅ 允许  |
| 修改函数逻辑（不变签名） | ✅ 允许  |
| 修改函数签名       | ❌ 不允许 |
| 删除函数         | ❌ 不允许 |
| 修改结构体字段      | ❌ 不允许 |
| 添加结构体字段      | ❌ 不允许 |

## 25. Example 3: 链上拍卖行 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-03.html

# 实战案例 3：链上拍卖行（智能存储单元 + 荷兰式拍卖）

**目标：** 将 Smart Storage Unit 改造为荷兰式拍卖（价格随时间递减），物品自动流转给出价者，完整实现拍卖合约 + 竞拍者 dApp + Owner 管理面板。

---

状态：已附合约、dApp 与 Move 测试文件。正文已经接近完整案例，适合作为“定价策略 + 前端倒计时”范例。

## 对应代码目录

- [example-03](https://hoh-zone.github.io/eve-bootcamp/code/example-03)
- [example-03/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-03/dapp)

## 最小调用链

`Owner 创建拍卖 -> 时间递减价格 -> 买家支付当前价 -> 拍卖结算 -> 物品流转`

## 需求分析

**场景：** 你控制着一个存储着珍稀矿石的智能存储箱。相比固定价格，你希望通过荷兰式拍卖（价格从高到低递减）来最大化销售收益，并让价格发现更加透明：

- 🕐 拍卖开始时以 **5000 LUX** 起拍
- 📉 每 10 分钟降低 **500 LUX**
- 🏆 **最低价为 500 LUX**，价格不再下降
- ⚡ 任何时候有人支付当前价格，物品立即成交
- 📊 dApp 实时显示倒计时和当前价格

---

## 第一部分：Move 合约

### 目录结构

```
dutch-auction/
├── Move.toml
└── sources/
    ├── dutch_auction.move    # 荷兰拍卖逻辑
    └── auction_manager.move  # 拍卖管理（创建/结束）
```

### 核心合约：`dutch_auction.move`

```
module dutch_auction::auction;

use world::storage_unit::{Self, StorageUnit};
use world::character::Character;
use world::inventory::Item;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::balance::{Self, Balance};
use sui::clock::Clock;
use sui::object::{Self, UID, ID};
use sui::event;
use sui::transfer;

/// SSU 扩展 Witness
public struct AuctionAuth has drop {}

/// 拍卖状态
public struct DutchAuction has key {
    id: UID,
    storage_unit_id: ID,        // 绑定的存储箱
    item_type_id: u64,          // 拍卖的物品类型
    start_price: u64,           // 起始价（MIST）
    end_price: u64,             // 最低价
    start_time_ms: u64,         // 拍卖开始时间
    price_drop_interval_ms: u64, // 每次降价间隔（毫秒）
    price_drop_amount: u64,     // 每次降价幅度
    is_active: bool,            // 是否仍在进行
    proceeds: Balance<SUI>,     // 拍卖收益
    owner: address,             // 拍卖创建者
}

/// 事件
public struct AuctionCreated has copy, drop {
    auction_id: ID,
    item_type_id: u64,
    start_price: u64,
    end_price: u64,
}

public struct AuctionSettled has copy, drop {
    auction_id: ID,
    winner: address,
    final_price: u64,
    item_type_id: u64,
}

// ── 计算当前价格 ─────────────────────────────────────────

public fun current_price(auction: &DutchAuction, clock: &Clock): u64 {
    if !auction.is_active {
        return auction.end_price
    }

    let elapsed_ms = clock.timestamp_ms() - auction.start_time_ms;
    let drops = elapsed_ms / auction.price_drop_interval_ms;
    let total_drop = drops * auction.price_drop_amount;

    if total_drop >= auction.start_price - auction.end_price {
        auction.end_price  // 已降到最低价
    } else {
        auction.start_price - total_drop
    }
}

/// 计算下次降价的剩余时间（毫秒）
public fun ms_until_next_drop(auction: &DutchAuction, clock: &Clock): u64 {
    let elapsed = clock.timestamp_ms() - auction.start_time_ms;
    let interval = auction.price_drop_interval_ms;
    let next_drop_at = (elapsed / interval + 1) * interval;
    next_drop_at - elapsed
}

// ── 创建拍卖 ─────────────────────────────────────────────

public fun create_auction(
    storage_unit: &StorageUnit,
    item_type_id: u64,
    start_price: u64,
    end_price: u64,
    price_drop_interval_ms: u64,
    price_drop_amount: u64,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(start_price > end_price, EInvalidPricing);
    assert!(price_drop_amount > 0, EInvalidDropAmount);
    assert!(price_drop_interval_ms >= 60_000, EIntervalTooShort); // 最小1分钟

    let auction = DutchAuction {
        id: object::new(ctx),
        storage_unit_id: object::id(storage_unit),
        item_type_id,
        start_price,
        end_price,
        start_time_ms: clock.timestamp_ms(),
        price_drop_interval_ms,
        price_drop_amount,
        is_active: true,
        proceeds: balance::zero(),
        owner: ctx.sender(),
    };

    event::emit(AuctionCreated {
        auction_id: object::id(&auction),
        item_type_id,
        start_price,
        end_price,
    });

    transfer::share_object(auction);
}

// ── 竞拍：支付当前价格获得物品 ──────────────────────────

public fun buy_now(
    auction: &mut DutchAuction,
    storage_unit: &mut StorageUnit,
    character: &Character,
    mut payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
): Item {
    assert!(auction.is_active, EAuctionEnded);

    let price = current_price(auction, clock);
    assert!(coin::value(&payment) >= price, EInsufficientPayment);

    // 退还多付的部分
    let change_amount = coin::value(&payment) - price;
    if change_amount > 0 {
        let change = payment.split(change_amount, ctx);
        transfer::public_transfer(change, ctx.sender());
    }

    // 收入进入拍卖金库
    balance::join(&mut auction.proceeds, coin::into_balance(payment));
    auction.is_active = false;

    event::emit(AuctionSettled {
        auction_id: object::id(auction),
        winner: ctx.sender(),
        final_price: price,
        item_type_id: auction.item_type_id,
    });

    // 从 SSU 取出物品
    storage_unit::withdraw_item(
        storage_unit,
        character,
        AuctionAuth {},
        auction.item_type_id,
        ctx,
    )
}

// ── Owner：提取拍卖收益 ──────────────────────────────────

public fun withdraw_proceeds(
    auction: &mut DutchAuction,
    ctx: &mut TxContext,
) {
    assert!(ctx.sender() == auction.owner, ENotOwner);
    assert!(!auction.is_active, EAuctionStillActive);

    let amount = balance::value(&auction.proceeds);
    let coin = coin::take(&mut auction.proceeds, amount, ctx);
    transfer::public_transfer(coin, ctx.sender());
}

// ── Owner：取消拍卖 ──────────────────────────────────────

public fun cancel_auction(
    auction: &mut DutchAuction,
    storage_unit: &mut StorageUnit,
    character: &Character,
    ctx: &mut TxContext,
): Item {
    assert!(ctx.sender() == auction.owner, ENotOwner);
    assert!(auction.is_active, EAuctionAlreadyEnded);

    auction.is_active = false;

    // 将物品取回给 Owner
    storage_unit::withdraw_item(
        storage_unit, character, AuctionAuth {}, auction.item_type_id, ctx,
    )
}

// 错误码
const EInvalidPricing: u64 = 0;
const EInvalidDropAmount: u64 = 1;
const EIntervalTooShort: u64 = 2;
const EAuctionEnded: u64 = 3;
const EInsufficientPayment: u64 = 4;
const EAuctionStillActive: u64 = 5;
const EAuctionAlreadyEnded: u64 = 6;
const ENotOwner: u64 = 7;
```

---

## 第二部分：单元测试

```
#[test_only]
module dutch_auction::auction_tests;

use dutch_auction::auction;
use sui::test_scenario;
use sui::clock;
use sui::coin;
use sui::sui::SUI;

#[test]
fun test_price_decreases_over_time() {
    let mut scenario = test_scenario::begin(@0xOwner);
    let mut clock = clock::create_for_testing(scenario.ctx());

    // 设置0时刻
    clock.set_for_testing(0);

    // 创建伪造拍卖对象测试价格计算
    let auction = auction::create_test_auction(
        5000,   // start_price
        500,    // end_price
        600_000, // 10分钟 (ms)
        500,    // 每次降 500
        &clock,
        scenario.ctx(),
    );

    // 时刻 0：价格应为 5000
    assert!(auction::current_price(&auction, &clock) == 5000, 0);

    // 经过 10 分钟：价格应为 4500
    clock.set_for_testing(600_000);
    assert!(auction::current_price(&auction, &clock) == 4500, 0);

    // 经过 90 分钟（降价9次 × 500 = 4500，但最低 500）：价格应为 500
    clock.set_for_testing(5_400_000);
    assert!(auction::current_price(&auction, &clock) == 500, 0);

    clock.destroy_for_testing();
    auction.destroy_test_auction();
    scenario.end();
}

#[test]
#[expected_failure(abort_code = auction::EInsufficientPayment)]
fun test_underpayment_fails() {
    // ...测试支付不足时的失败路径
}
```

---

## 第三部分：竞拍者 dApp

```
// src/AuctionApp.tsx
import { useState, useEffect, useCallback } from 'react'
import { useConnection, getObjectWithJson } from '@evefrontier/dapp-kit'
import { useDAppKit } from '@mysten/dapp-kit-react'
import { Transaction } from '@mysten/sui/transactions'

const DUTCH_PACKAGE = "0x_DUTCH_PACKAGE_"
const AUCTION_ID = "0x_AUCTION_ID_"
const STORAGE_UNIT_ID = "0x..."
const CHARACTER_ID = "0x..."
const CLOCK_OBJECT_ID = "0x6"

interface AuctionState {
  start_price: string
  end_price: string
  start_time_ms: string
  price_drop_interval_ms: string
  price_drop_amount: string
  is_active: boolean
  item_type_id: string
}

function calculateCurrentPrice(state: AuctionState): number {
  if (!state.is_active) return Number(state.end_price)

  const now = Date.now()
  const elapsed = now - Number(state.start_time_ms)
  const drops = Math.floor(elapsed / Number(state.price_drop_interval_ms))
  const totalDrop = drops * Number(state.price_drop_amount)
  const maxDrop = Number(state.start_price) - Number(state.end_price)

  if (totalDrop >= maxDrop) return Number(state.end_price)
  return Number(state.start_price) - totalDrop
}

function msUntilNextDrop(state: AuctionState): number {
  const now = Date.now()
  const elapsed = now - Number(state.start_time_ms)
  const interval = Number(state.price_drop_interval_ms)
  return interval - (elapsed % interval)
}

export function AuctionApp() {
  const { isConnected, handleConnect } = useConnection()
  const dAppKit = useDAppKit()
  const [auctionState, setAuctionState] = useState<AuctionState | null>(null)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [status, setStatus] = useState('')
  const [isBuying, setIsBuying] = useState(false)

  // 加载拍卖状态
  const loadAuction = useCallback(async () => {
    const obj = await getObjectWithJson(AUCTION_ID)
    if (obj?.content?.dataType === 'moveObject') {
      const fields = obj.content.fields as AuctionState
      setAuctionState(fields)
    }
  }, [])

  useEffect(() => {
    loadAuction()
  }, [loadAuction])

  // 每秒更新价格倒计时
  useEffect(() => {
    if (!auctionState) return
    const timer = setInterval(() => {
      setCurrentPrice(calculateCurrentPrice(auctionState))
      setCountdown(msUntilNextDrop(auctionState))
    }, 1000)
    return () => clearInterval(timer)
  }, [auctionState])

  const handleBuyNow = async () => {
    if (!isConnected) { setStatus('请先连接钱包'); return }
    setIsBuying(true)
    setStatus('⏳ 提交交易...')

    try {
      const tx = new Transaction()
      const [paymentCoin] = tx.splitCoins(tx.gas, [
        tx.pure.u64(currentPrice + 1_000) // 略多于当前价，防止最后一秒涨价
      ])

      tx.moveCall({
        target: `${DUTCH_PACKAGE}::auction::buy_now`,
        arguments: [
          tx.object(AUCTION_ID),
          tx.object(STORAGE_UNIT_ID),
          tx.object(CHARACTER_ID),
          paymentCoin,
          tx.object(CLOCK_OBJECT_ID),
        ],
      })

      const result = await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus(`🏆 竞拍成功！Tx: ${result.digest.slice(0, 12)}...`)
      await loadAuction()
    } catch (e: any) {
      setStatus(`❌ ${e.message}`)
    } finally {
      setIsBuying(false)
    }
  }

  const countdownSec = Math.ceil(countdown / 1000)
  const priceInSui = (currentPrice / 1e9).toFixed(2)
  const nextPriceSui = (
    Math.max(Number(auctionState?.end_price ?? 0), currentPrice - Number(auctionState?.price_drop_amount ?? 0)) / 1e9
  ).toFixed(2)

  return (
    <div className="auction-app">
      <header>
        <h1>🔨 荷兰式拍卖行</h1>
        {!isConnected
          ? <button onClick={handleConnect}>连接钱包</button>
          : <span className="connected">✅ 已连接</span>
        }
      </header>

      {auctionState ? (
        <div className="auction-board">
          <div className="current-price">
            <span className="label">当前价格</span>
            <span className="price">{priceInSui} SUI</span>
          </div>

          <div className="countdown">
            <span className="label">⏳ {countdownSec} 秒后降为</span>
            <span className="next-price">{nextPriceSui} SUI</span>
          </div>

          <div className="info-row">
            <span>起拍价：{(Number(auctionState.start_price) / 1e9).toFixed(2)} SUI</span>
            <span>最低价：{(Number(auctionState.end_price) / 1e9).toFixed(2)} SUI</span>
          </div>

          {auctionState.is_active ? (
            <button
              className="buy-btn"
              onClick={handleBuyNow}
              disabled={isBuying || !isConnected}
            >
              {isBuying ? '⏳ 购买中...' : `💰 立即购买 ${priceInSui} SUI`}
            </button>
          ) : (
            <div className="sold-banner">🎉 已售出</div>
          )}

          {status && <p className="tx-status">{status}</p>}
        </div>
      ) : (
        <div>加载拍卖信息...</div>
      )}
    </div>
  )
}
```

---

## 🎯 完整回顾

```
合约层
├── create_auction() → 创建共享 DutchAuction 对象
├── current_price()  → 根据时间计算当前价格（纯计算，不修改状态）
├── buy_now()        → 支付 → 收益入金库 → SSU 取出物品 → 发事件
├── cancel_auction() → Owner 取消，物品归还
└── withdraw_proceeds() → Owner 提取拍卖收益

dApp 层
├── 每秒重新计算价格（纯前端，不消耗 Gas）
├── 倒计时显示下次降价时间
└── 一键购买，自动附上当前价格
```

---

## 🔧 扩展练习

1. 支持批量拍卖：同时拍卖多种物品，每种独立倒计时
1. 预约购买：玩家设定目标价格，自动在达到时触发购买（链下监听 + 定时提交）
1. 历史成交记录：监听 `AuctionSettled` 事件展示近期成交数据

---

## 📚 关联文档

- [Chapter 12：事件系统](https://hoh-zone.github.io/eve-bootcamp/chapter-12.html)
- [Chapter 14：定价策略](https://hoh-zone.github.io/eve-bootcamp/chapter-14.html)
- [Smart Storage Unit](https://github.com/evefrontier/builder-documentation/blob/main/smart-assemblies/storage-unit/README.md)

## 26. Example 6: 动态 NFT - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-06.html

# 实战案例 6：动态 NFT 装备系统（可进化的飞船武器）

**目标：** 创建一套飞船武器 NFT，其属性随游戏战斗结果自动升级；利用 Sui Display 标准确保 NFT 在所有钱包和市场中实时显示最新状态。

---

状态：教学示例。正文聚焦动态 NFT 和 Display 更新，完整目录以 `book/src/code/example-06/` 为准。

## 对应代码目录

- [example-06](https://hoh-zone.github.io/eve-bootcamp/code/example-06)
- [example-06/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-06/dapp)

## 最小调用链

`玩家持有武器 NFT -> 击杀事件累加 -> 达到阈值升级 -> Display 元数据更新 -> 钱包/市场显示新外观`

## 需求分析

**场景：** 你设计了一款“成长型武器“系统——玩家获得一把 `PlasmaRifle`，初始是一把普通武器，随着每次击杀积累，自动升级外观和属性：

- ⚪ **初级（0-9 击杀）**：Plasma Rifle Mk.1，基础伤害
- 🔵 **精英（10-49 击杀）**：Plasma Rifle Mk.2，图片变为精英版本，伤害+30%
- 🟡 **传奇（50+ 击杀）**：Plasma Rifle Mk.3 “Inferno”，图片变为传奇版本，特殊效果

---

## 第一部分：NFT 合约

```
module dynamic_nft::plasma_rifle;

use sui::object::{Self, UID};
use sui::display;
use sui::package;
use sui::transfer;
use sui::event;
use std::string::{Self, String, utf8};

// ── 一次性见证 ─────────────────────────────────────────────

public struct PLASMA_RIFLE has drop {}

// ── 武器等级常量 ───────────────────────────────────────────

const TIER_BASIC: u8 = 1;
const TIER_ELITE: u8 = 2;
const TIER_LEGENDARY: u8 = 3;

const KILLS_FOR_ELITE: u64 = 10;
const KILLS_FOR_LEGENDARY: u64 = 50;

// ── 数据结构 ───────────────────────────────────────────────

public struct PlasmaRifle has key, store {
    id: UID,
    name: String,
    tier: u8,
    kills: u64,
    damage_bonus_pct: u64,   // 伤害加成（百分比）
    image_url: String,
    description: String,
    owner_history: u64,      // 历史流通次数
}

public struct ForgeAdminCap has key, store {
    id: UID,
}

// ── 事件 ──────────────────────────────────────────────────

public struct RifleEvolved has copy, drop {
    rifle_id: ID,
    from_tier: u8,
    to_tier: u8,
    total_kills: u64,
}

// ── 初始化 ────────────────────────────────────────────────

fun init(witness: PLASMA_RIFLE, ctx: &mut TxContext) {
    let publisher = package::claim(witness, ctx);

    let keys = vector[
        utf8(b"name"),
        utf8(b"description"),
        utf8(b"image_url"),
        utf8(b"attributes"),
        utf8(b"project_url"),
    ];

    let values = vector[
        utf8(b"{name}"),
        utf8(b"{description}"),
        utf8(b"{image_url}"),
        // attributes 拼接多个字段
        utf8(b"[{\"trait_type\":\"Tier\",\"value\":\"{tier}\"},{\"trait_type\":\"Kills\",\"value\":\"{kills}\"},{\"trait_type\":\"Damage Bonus\",\"value\":\"{damage_bonus_pct}%\"}]"),
        utf8(b"https://evefrontier.com/weapons"),
    ];

    let mut display = display::new_with_fields<PlasmaRifle>(
        &publisher, keys, values, ctx,
    );
    display::update_version(&mut display);

    let admin_cap = ForgeAdminCap { id: object::new(ctx) };

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_freeze_object(display);
    transfer::public_transfer(admin_cap, ctx.sender());
}

// ── 铸造初始武器 ──────────────────────────────────────────

public fun forge_rifle(
    _admin: &ForgeAdminCap,
    recipient: address,
    ctx: &mut TxContext,
) {
    let rifle = PlasmaRifle {
        id: object::new(ctx),
        name: utf8(b"Plasma Rifle Mk.1"),
        tier: TIER_BASIC,
        kills: 0,
        damage_bonus_pct: 0,
        image_url: utf8(b"https://assets.example.com/weapons/plasma_mk1.png"),
        description: utf8(b"A standard-issue plasma rifle. Prove yourself in combat."),
        owner_history: 0,
    };

    transfer::public_transfer(rifle, recipient);
}

// ── 记录击杀（炮塔扩展调用此函数）────────────────────────

public fun record_kill(
    rifle: &mut PlasmaRifle,
    ctx: &TxContext,
) {
    rifle.kills = rifle.kills + 1;
    check_and_evolve(rifle);
}

fun check_and_evolve(rifle: &mut PlasmaRifle) {
    let old_tier = rifle.tier;

    if rifle.kills >= KILLS_FOR_LEGENDARY && rifle.tier < TIER_LEGENDARY {
        rifle.tier = TIER_LEGENDARY;
        rifle.name = utf8(b"Plasma Rifle Mk.3 \"Inferno\"");
        rifle.damage_bonus_pct = 60;
        rifle.image_url = utf8(b"https://assets.example.com/weapons/plasma_legendary.png");
        rifle.description = utf8(b"This weapon has bathed in the fires of a thousand battles. Its plasma burns with legendary fury.");
    } else if rifle.kills >= KILLS_FOR_ELITE && rifle.tier < TIER_ELITE {
        rifle.tier = TIER_ELITE;
        rifle.name = utf8(b"Plasma Rifle Mk.2");
        rifle.damage_bonus_pct = 30;
        rifle.image_url = utf8(b"https://assets.example.com/weapons/plasma_mk2.png");
        rifle.description = utf8(b"Battle-hardened and upgraded. The plasma cells burn hotter than standard.");
    };

    if old_tier != rifle.tier {
        event::emit(RifleEvolved {
            rifle_id: object::id(rifle),
            from_tier: old_tier,
            to_tier: rifle.tier,
            total_kills: rifle.kills,
        });
    }
}

// ── 读取函数 ──────────────────────────────────────────────

public fun get_tier(rifle: &PlasmaRifle): u8 { rifle.tier }
public fun get_kills(rifle: &PlasmaRifle): u64 { rifle.kills }
public fun get_damage_bonus(rifle: &PlasmaRifle): u64 { rifle.damage_bonus_pct }

// ── 转让追踪（可选） ─────────────────────────────────────

// 如果使用 TransferPolicy，可以追踪转让次数
// 此处简化为通过事件监听实现
```

---

## 第二部分：炮塔扩展 — 战斗结果上报武器

```
module dynamic_nft::turret_combat;

use dynamic_nft::plasma_rifle::{Self, PlasmaRifle};
use world::turret::{Self, Turret};
use world::character::Character;

public struct CombatAuth has drop {}

/// 炮塔击杀事件（炮塔扩展调用）
public fun on_kill(
    turret: &Turret,
    killer: &Character,
    weapon: &mut PlasmaRifle,       // 玩家使用的武器
    ctx: &TxContext,
) {
    // 验证是合法的炮塔扩展调用（需要 CombatAuth）
    turret::verify_extension(turret, CombatAuth {});

    // 记录击杀到武器
    plasma_rifle::record_kill(weapon, ctx);
}
```

---

## 第三部分：前端武器展示 dApp

```
// src/WeaponDisplay.tsx
import { useState, useEffect } from 'react'
import { useCurrentClient } from '@mysten/dapp-kit-react'
import { useRealtimeEvents } from './hooks/useRealtimeEvents'

const DYNAMIC_NFT_PKG = "0x_DYNAMIC_NFT_PACKAGE_"

interface RifleData {
  name: string
  tier: string
  kills: string
  damage_bonus_pct: string
  image_url: string
  description: string
}

const TIER_COLORS = {
  '1': '#9CA3AF',  // 灰色（普通）
  '2': '#3B82F6',  // 蓝色（精英）
  '3': '#F59E0B',  // 金色（传奇）
}

const TIER_LABELS = { '1': 'Basic', '2': 'Elite', '3': 'Legendary' }

export function WeaponDisplay({ rifleId }: { rifleId: string }) {
  const client = useCurrentClient()
  const [rifle, setRifle] = useState<RifleData | null>(null)
  const [justEvolved, setJustEvolved] = useState(false)

  const loadRifle = async () => {
    const obj = await client.getObject({
      id: rifleId,
      options: { showContent: true },
    })
    if (obj.data?.content?.dataType === 'moveObject') {
      setRifle(obj.data.content.fields as RifleData)
    }
  }

  useEffect(() => { loadRifle() }, [rifleId])

  // 监听进化事件
  const evolutions = useRealtimeEvents<{
    rifle_id: string; from_tier: string; to_tier: string; total_kills: string
  }>(`${DYNAMIC_NFT_PKG}::plasma_rifle::RifleEvolved`)

  useEffect(() => {
    const myEvolution = evolutions.find(e => e.rifle_id === rifleId)
    if (myEvolution) {
      setJustEvolved(true)
      loadRifle() // 重新加载最新数据
      setTimeout(() => setJustEvolved(false), 5000)
    }
  }, [evolutions])

  if (!rifle) return <div className="loading">加载武器数据...</div>

  const tierColor = TIER_COLORS[rifle.tier as keyof typeof TIER_COLORS]
  const tierLabel = TIER_LABELS[rifle.tier as keyof typeof TIER_LABELS]
  const killsForNextTier = rifle.tier === '1'
    ? 10 : rifle.tier === '2' ? 50 : null
  const progress = killsForNextTier
    ? Math.min(100, (Number(rifle.kills) / killsForNextTier) * 100) : 100

  return (
    <div className="weapon-card" style={{ borderColor: tierColor }}>
      {justEvolved && (
        <div className="evolution-banner">
          ✨ 武器已进化！
        </div>
      )}

      <div className="weapon-image-container">
        <img
          src={rifle.image_url}
          alt={rifle.name}
          className={`weapon-image tier-${rifle.tier}`}
        />
        <span className="tier-badge" style={{ background: tierColor }}>
          {tierLabel}
        </span>
      </div>

      <div className="weapon-info">
        <h2>{rifle.name}</h2>
        <p className="description">{rifle.description}</p>

        <div className="stats">
          <div className="stat">
            <span>⚔️ 击杀数</span>
            <strong>{rifle.kills}</strong>
          </div>
          <div className="stat">
            <span>💥 伤害加成</span>
            <strong>+{rifle.damage_bonus_pct}%</strong>
          </div>
        </div>

        {killsForNextTier && (
          <div className="evolution-progress">
            <span>进化进度：{rifle.kills} / {killsForNextTier} 击杀</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%`, background: tierColor }}
              />
            </div>
          </div>
        )}

        {!killsForNextTier && (
          <div className="max-tier-badge">👑 已达最高等级</div>
        )}
      </div>
    </div>
  )
}
```

---

## 🎯 完整回顾

```
合约层
├── plasma_rifle.move
│   ├── PlasmaRifle（NFT 对象，字段随战斗更新）
│   ├── Display（模板引用字段 → 钱包自动同步显示）
│   ├── forge_rifle()    ← Owner 铸造发放
│   ├── record_kill()    ← 炮塔合约调用
│   └── check_and_evolve() ← 内部：检查阈值，升级字段 + 发事件
│
└── turret_combat.move
    └── on_kill()         ← 炮塔击杀时调用武器升级

dApp 层
└── WeaponDisplay.tsx
    ├── 订阅 RifleEvolved 事件（一旦进化立即刷新）
    ├── 动态颜色主题（按等级）
    └── 进化进度条
```

## 🔧 扩展练习

1. **武器磨损**：每次使用降低 `durability` 字段，质量下降后伤害减少（需要修理）
1. **特殊属性**：传奇等级随机获得特殊词缀（用随机数 + 动态字段）
1. **武器融合**：两把 Elite 武器销毁 → 铸造一把 Legendary（材料消耗型升级）

---

## 📚 关联文档

- [Chapter 13：NFT 设计与 Display 标准](https://hoh-zone.github.io/eve-bootcamp/chapter-13.html)
- [Chapter 12：事件系统](https://hoh-zone.github.io/eve-bootcamp/chapter-12.html)
- [Sui Display 文档](https://docs.sui.io/standards/display)

## 27. Example 7: 星门物流网络 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-07.html

# 实战案例 7：星门物流网络（多跳路由系统）

**目标：** 构建一个联盟拥有多个星门的物流网络，支持“A → B → C“多跳路由，链下计算最优路径，链上原子执行多次跳跃；并提供路由规划 dApp。

---

状态：教学示例。正文聚焦多跳路由和链下规划，完整目录以 `book/src/code/example-07/` 为准。

## 对应代码目录

- [example-07](https://hoh-zone.github.io/eve-bootcamp/code/example-07)
- [example-07/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-07/dapp)

## 最小调用链

`链下计算最优路由 -> 构建多跳 PTB -> 链上原子执行所有跳跃 -> 全部成功或全部回滚`

## 需求分析

**场景：** 你的联盟控制着 5 个互联星门，形成如下拓扑：

```
Mining Area ──[Gate1]──► Hub Alpha ──[Gate2]──► Trade Hub
                              │
                         [Gate3]
                              │
                         Refinery ──[Gate4]──► Manufacturing
                              │
                         [Gate5]
                              │
                         Safe Harbor
```

**要求：**

- 玩家可以一次性购买“多跳通行证“，完成 A→Hub Alpha→Trade Hub 这样的复合路由
- 路由计算在链下进行（节省 Gas）
- 链上原子执行：要么全部跳跃成功，要么全部回滚
- dApp 提供可视化路线规划器

---

## 第一部分：多跳路由合约

```
module logistics::multi_hop;

use world::gate::{Self, Gate};
use world::character::Character;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::clock::Clock;
use sui::object::{Self, ID};
use sui::event;

public struct LogisticsAuth has drop {}

/// 一次购买多跳路线
public fun purchase_route(
    source_gate: &Gate,
    hop1_dest: &Gate,       // 第一跳目的
    hop2_source: &Gate,     // 第二跳起点（= hop1_dest 的链接门）
    hop2_dest: &Gate,       // 第二跳目的
    character: &Character,
    mut payment: Coin<SUI>,  // 支付两跳的总费用
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // 验证路线连续性：hop1_dest 和 hop2_source 必须是链接的星门
    assert!(
        gate::are_linked(hop1_dest, hop2_source),
        ERouteDiscontinuous,
    );

    // 计算并扣除每跳费用
    let hop1_toll = get_toll(source_gate);
    let hop2_toll = get_toll(hop2_source);
    let total_toll = hop1_toll + hop2_toll;

    assert!(coin::value(&payment) >= total_toll, EInsufficientPayment);

    // 退还找零
    let change = payment.split(coin::value(&payment) - total_toll, ctx);
    if coin::value(&change) > 0 {
        transfer::public_transfer(change, ctx.sender());
    } else { coin::destroy_zero(change); }

    // 发放两个 JumpPermit（1小时有效期）
    let expires = clock.timestamp_ms() + 60 * 60 * 1000;

    gate::issue_jump_permit(
        source_gate, hop1_dest, character, LogisticsAuth {}, expires, ctx,
    );
    gate::issue_jump_permit(
        hop2_source, hop2_dest, character, LogisticsAuth {}, expires, ctx,
    );

    // 扣除收费
    let hop1_coin = payment.split(hop1_toll, ctx);
    let hop2_coin = payment;
    collect_toll(source_gate, hop1_coin, ctx);
    collect_toll(hop2_source, hop2_coin, ctx);

    event::emit(RouteTicketIssued {
        character_id: object::id(character),
        gates: vector[object::id(source_gate), object::id(hop1_dest), object::id(hop2_dest)],
        total_toll,
    });
}

/// 通用 N 跳路由（接受可变长度路线）
public fun purchase_route_n_hops(
    gates: vector<&Gate>,          // 星门列表 [A, B, C, D, ...]
    character: &Character,
    mut payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let n = vector::length(&gates);
    assert!(n >= 2, ETooFewGates);
    assert!(n <= 6, ETooManyHops); // 防止超大交易

    // 验证路线连续性（每对相邻目的/起点必须链接）
    let mut i = 1;
    while (i < n - 1) {
        assert!(
            gate::are_linked(vector::borrow(&gates, i), vector::borrow(&gates, i)),
            ERouteDiscontinuous,
        );
        i = i + 1;
    };

    // 计算总费用
    let mut total: u64 = 0;
    let mut j = 0;
    while (j < n - 1) {
        total = total + get_toll(vector::borrow(&gates, j));
        j = j + 1;
    };

    assert!(coin::value(&payment) >= total, EInsufficientPayment);

    // 发放所有 Permit
    let expires = clock.timestamp_ms() + 60 * 60 * 1000;
    let mut k = 0;
    while (k < n - 1) {
        gate::issue_jump_permit(
            vector::borrow(&gates, k),
            vector::borrow(&gates, k + 1),
            character,
            LogisticsAuth {},
            expires,
            ctx,
        );
        k = k + 1;
    };

    // 退款找零
    let change = payment.split(coin::value(&payment) - total, ctx);
    if coin::value(&change) > 0 {
        transfer::public_transfer(change, ctx.sender());
    } else { coin::destroy_zero(change); }
    // 处理 payment 到各个星门金库...
}

fun get_toll(gate: &Gate): u64 {
    // 从星门的扩展数据读取通行费（动态字段）
    // 简化版：固定费率
    10_000_000_000 // 10 SUI
}

fun collect_toll(gate: &Gate, coin: Coin<SUI>, ctx: &TxContext) {
    // 将 coin 转到星门对应的 Treasury
    // ...
}

public struct RouteTicketIssued has copy, drop {
    character_id: ID,
    gates: vector<ID>,
    total_toll: u64,
}

const ERouteDiscontinuous: u64 = 0;
const EInsufficientPayment: u64 = 1;
const ETooFewGates: u64 = 2;
const ETooManyHops: u64 = 3;
```

---

## 第二部分：链下路径规划（Dijkstra）

```
// lib/routePlanner.ts

interface Gate {
  id: string
  name: string
  linkedGates: string[]  // 链接的星门 ID 列表
  tollAmount: number     // 通行费（SUI）
}

interface Route {
  gateIds: string[]
  totalToll: number
  hops: number
}

// Dijkstra 最短路径（以通行费为权重）
export function findCheapestRoute(
  gateMap: Map<string, Gate>,
  fromId: string,
  toId: string,
): Route | null {
  const dist = new Map<string, number>()
  const prev = new Map<string, string | null>()
  const unvisited = new Set(gateMap.keys())

  for (const id of gateMap.keys()) {
    dist.set(id, Infinity)
    prev.set(id, null)
  }
  dist.set(fromId, 0)

  while (unvisited.size > 0) {
    // 找距离最小的未访问节点
    let current: string | null = null
    let minDist = Infinity
    for (const id of unvisited) {
      if ((dist.get(id) ?? Infinity) < minDist) {
        minDist = dist.get(id)!
        current = id
      }
    }

    if (!current || current === toId) break
    unvisited.delete(current)

    const gate = gateMap.get(current)!
    for (const neighborId of gate.linkedGates) {
      const neighbor = gateMap.get(neighborId)
      if (!neighbor || !unvisited.has(neighborId)) continue

      const newDist = (dist.get(current) ?? 0) + neighbor.tollAmount
      if (newDist < (dist.get(neighborId) ?? Infinity)) {
        dist.set(neighborId, newDist)
        prev.set(neighborId, current)
      }
    }
  }

  if (dist.get(toId) === Infinity) return null // 不可达

  // 重建路径
  const path: string[] = []
  let cur: string | null = toId
  while (cur) {
    path.unshift(cur)
    cur = prev.get(cur) ?? null
  }

  return {
    gateIds: path,
    totalToll: dist.get(toId) ?? 0,
    hops: path.length - 1,
  }
}
```

---

## 第三部分：路由规划 dApp

```
// src/RoutePlannerApp.tsx
import { useState, useEffect } from 'react'
import { useConnection } from '@evefrontier/dapp-kit'
import { useDAppKit } from '@mysten/dapp-kit-react'
import { findCheapestRoute } from '../lib/routePlanner'
import { Transaction } from '@mysten/sui/transactions'

const LOGISTICS_PKG = "0x_LOGISTICS_PACKAGE_"

// 星门网络拓扑（通常从链上读取）
const GATE_NETWORK = new Map([
  ['gate_mining', { id: 'gate_mining', name: '矿区入口', linkedGates: ['gate_hub_alpha'], tollAmount: 5 }],
  ['gate_hub_alpha', { id: 'gate_hub_alpha', name: 'Hub Alpha', linkedGates: ['gate_mining', 'gate_trade', 'gate_refinery'], tollAmount: 3 }],
  ['gate_trade', { id: 'gate_trade', name: '贸易中心', linkedGates: ['gate_hub_alpha'], tollAmount: 8 }],
  ['gate_refinery', { id: 'gate_refinery', name: '精炼厂', linkedGates: ['gate_hub_alpha', 'gate_manufacturing', 'gate_harbor'], tollAmount: 4 }],
  ['gate_manufacturing', { id: 'gate_manufacturing', name: '制造厂', linkedGates: ['gate_refinery'], tollAmount: 6 }],
  ['gate_harbor', { id: 'gate_harbor', name: '安全港湾', linkedGates: ['gate_refinery'], tollAmount: 2 }],
])

export function RoutePlannerApp() {
  const { isConnected, handleConnect } = useConnection()
  const dAppKit = useDAppKit()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [route, setRoute] = useState<{gateIds: string[]; totalToll: number; hops: number} | null>(null)
  const [status, setStatus] = useState('')

  const planRoute = () => {
    if (!from || !to) return
    const result = findCheapestRoute(GATE_NETWORK, from, to)
    setRoute(result)
  }

  const purchaseRoute = async () => {
    if (!route || route.gateIds.length < 2) return

    const tx = new Transaction()

    // 准备支付（总费用 + 5% 缓冲防止价格变动）
    const totalSui = Math.ceil(route.totalToll * 1.05) * 1e9
    const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(totalSui)])

    // 构建星门参数列表
    const gateArgs = route.gateIds.map(id => tx.object(id))

    // 调用多跳路由合约
    if (route.hops === 2) {
      tx.moveCall({
        target: `${LOGISTICS_PKG}::multi_hop::purchase_route`,
        arguments: [
          gateArgs[0], gateArgs[1], gateArgs[1], gateArgs[2],
          tx.object('CHARACTER_ID'),
          paymentCoin,
          tx.object('0x6'),
        ],
      })
    }

    try {
      setStatus('⏳ 购买路线通行证...')
      const result = await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus(`✅ 路线购买成功！Tx: ${result.digest.slice(0, 12)}...`)
    } catch (e: any) {
      setStatus(`❌ ${e.message}`)
    }
  }

  return (
    <div className="route-planner">
      <h1>🗺 星门物流路线规划</h1>

      <div className="planner-inputs">
        <div>
          <label>出发星门</label>
          <select value={from} onChange={e => setFrom(e.target.value)}>
            <option value="">选择出发地...</option>
            {[...GATE_NETWORK.values()].map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="arrow">→</div>

        <div>
          <label>目的星门</label>
          <select value={to} onChange={e => setTo(e.target.value)}>
            <option value="">选择目的地...</option>
            {[...GATE_NETWORK.values()].map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <button onClick={planRoute} disabled={!from || !to || from === to}>
          📍 规划路线
        </button>
      </div>

      {route && (
        <div className="route-result">
          <h3>最优路线（费用最低）</h3>
          <div className="route-path">
            {route.gateIds.map((id, i) => (
              <>
                <span key={id} className="gate-node">
                  {GATE_NETWORK.get(id)?.name}
                </span>
                {i < route.gateIds.length - 1 && (
                  <span className="arrow-icon">→</span>
                )}
              </>
            ))}
          </div>
          <div className="route-stats">
            <span>🔀 跳跃次数：{route.hops}</span>
            <span>💰 总费用：{route.totalToll} SUI</span>
          </div>
          <button
            className="purchase-btn"
            onClick={purchaseRoute}
            disabled={!isConnected}
          >
            {isConnected ? '🚀 一键购买全程通行证' : '请先连接钱包'}
          </button>
        </div>
      )}

      {route === null && from && to && from !== to && (
        <p className="no-route">⚠️ 找不到从 {from} 到 {to} 的路线</p>
      )}

      {status && <p className="status">{status}</p>}
    </div>
  )
}
```

---

## 🎯 完整回顾

```
合约层
├── multi_hop.move
│   ├── purchase_route()      → 两跳快速版（指定4个星门参数）
│   ├── purchase_route_n_hops() → N跳通用版（vector参数，最多6跳）
│   └── LogisticsAuth {}      → 星门扩展 Witness

链下路径规划
└── routePlanner.ts
    └── findCheapestRoute()   → Dijkstra，以通行费为权重

dApp 层
└── RoutePlannerApp.tsx
    ├── 下拉选择出发/目的地
    ├── 调用 Dijkstra 展示最优路线
    └── 一键购买全程通行证
```

## 🔧 扩展练习

1. **最短跳数路由**：实现第二种模式（优先减少跳数而不是费用）
1. **实时拥堵感知**：监听 GateJumped 事件，计算最近 5 分钟各星门流量，路由时避开拥堵
1. **物品护送保险**：购买路线时可额外购买“物品损失险“NFT，失败时赔付

---

## 📚 关联文档

- [Smart Gate API](https://github.com/evefrontier/builder-documentation/blob/main/smart-assemblies/gate/README.md)
- [Chapter 21：批处理事务](https://hoh-zone.github.io/eve-bootcamp/chapter-21.html)
- [Chapter 9：链下索引](https://hoh-zone.github.io/eve-bootcamp/chapter-09.html)

## 28. Example 9: 跨 Builder 协议 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-09.html

# 实战案例 9：跨 Builder 协议聚合市场

**目标：** 设计一个“协议适配器“层，让用户在一个 dApp 中同时访问多个不同 Builder 发布的市场合约（尽管它们接口各异），实现类似 DEX 聚合器的体验。

---

状态：教学示例。当前案例以聚合器架构和适配器分层为主，重点在统一接口而非单个 Move 合约。

## 对应代码目录

- [example-09/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-09/dapp)

## 最小调用链

`前端查询多个市场 -> 适配器归一化报价 -> 选出最优市场 -> 按对应协议提交购买`

## 需求分析

**场景：** EVE Frontier 生态中已有 3 个不同 Builder 的市场合约：

| Builder        | 合约地址       | 接口风格                                                        |
| -------------- | ---------- | ----------------------------------------------------------- |
| Builder Alice  | `0xAAA...` | `buy_item(market, character, item_id, coin)`                |
| Builder Bob    | `0xBBB...` | `purchase(storage, char, type_id, payment, ctx)`            |
| 你（Builder You） | `0xYYY...` | `buy_item_v2(market, character, item_id, coin, clock, ctx)` |

## 29. Example 13: 订阅制通行证 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-13.html

# 实战案例 13：订阅制通行证（月付无限跳跃）

**目标：** 建立订阅制通行证系统——玩家每月支付固定 SUI，获得在你联盟星门网络中无限跳跃的权利，无需每次单独购票。

---

状态：教学示例。正文聚焦订阅模型，完整目录以 `book/src/code/example-13/` 为准。

## 对应代码目录

- [example-13](https://hoh-zone.github.io/eve-bootcamp/code/example-13)
- [example-13/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-13/dapp)

## 最小调用链

`选择套餐 -> 支付订阅费 -> 铸造/更新 GatePassNFT -> 星门校验 pass 是否有效`

## 需求分析

**场景：** 你的联盟控制 5 个星门，希望建立月度会员制：

- **月票**：30 SUI/月，所有星门无限跳跃
- **季票**：80 SUI/季度，有折扣
- 过期后需续费，否则降级为按次付费
- 订阅 NFT 可转让（玩家可以二手交易）

---

## 合约

```
module subscription::gate_pass;

use sui::object::{Self, UID, ID};
use sui::clock::Clock;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::balance::{Self, Balance};
use sui::transfer;
use sui::event;
use std::string::String;

// ── 常量 ──────────────────────────────────────────────────

const MONTH_MS: u64 = 30 * 24 * 60 * 60 * 1000;

/// 套餐类型
const PLAN_MONTHLY: u8 = 0;
const PLAN_QUARTERLY: u8 = 1;

// ── 数据结构 ───────────────────────────────────────────────

/// 订阅管理器（共享对象）
public struct SubscriptionManager has key {
    id: UID,
    monthly_price: u64,     // 月套餐价格（MIST）
    quarterly_price: u64,   // 季度套餐价格
    revenue: Balance<SUI>,
    admin: address,
    total_subscribers: u64,
}

/// 订阅 NFT（可转让，持有即有权限）
public struct GatePassNFT has key, store {
    id: UID,
    plan: u8,
    valid_until_ms: u64,
    subscriber: address,  // 原始订阅者
    serial_number: u64,
}

// ── 事件 ──────────────────────────────────────────────────

public struct PassPurchased has copy, drop {
    pass_id: ID,
    buyer: address,
    plan: u8,
    valid_until_ms: u64,
}

public struct PassRenewed has copy, drop {
    pass_id: ID,
    new_expiry_ms: u64,
}

// ── 初始化 ────────────────────────────────────────────────

fun init(ctx: &mut TxContext) {
    transfer::share_object(SubscriptionManager {
        id: object::new(ctx),
        monthly_price: 30_000_000_000,   // 30 SUI
        quarterly_price: 80_000_000_000, // 80 SUI（比3个月便宜10 SUI）
        revenue: balance::zero(),
        admin: ctx.sender(),
        total_subscribers: 0,
    });
}

// ── 购买订阅 ──────────────────────────────────────────────

public fun purchase_pass(
    mgr: &mut SubscriptionManager,
    plan: u8,
    mut payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let (price, duration_ms) = if plan == PLAN_MONTHLY {
        (mgr.monthly_price, MONTH_MS)
    } else if plan == PLAN_QUARTERLY {
        (mgr.quarterly_price, 3 * MONTH_MS)
    } else abort EInvalidPlan;

    assert!(coin::value(&payment) >= price, EInsufficientPayment);

    let pay = payment.split(price, ctx);
    balance::join(&mut mgr.revenue, coin::into_balance(pay));

    if coin::value(&payment) > 0 {
        transfer::public_transfer(payment, ctx.sender());
    } else { coin::destroy_zero(payment); }

    mgr.total_subscribers = mgr.total_subscribers + 1;
    let valid_until_ms = clock.timestamp_ms() + duration_ms;

    let pass = GatePassNFT {
        id: object::new(ctx),
        plan,
        valid_until_ms,
        subscriber: ctx.sender(),
        serial_number: mgr.total_subscribers,
    };
    let pass_id = object::id(&pass);

    transfer::public_transfer(pass, ctx.sender());

    event::emit(PassPurchased {
        pass_id,
        buyer: ctx.sender(),
        plan,
        valid_until_ms,
    });
}

/// 续费（延长已有 Pass 的有效期）
public fun renew_pass(
    mgr: &mut SubscriptionManager,
    pass: &mut GatePassNFT,
    mut payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let (price, duration_ms) = if pass.plan == PLAN_MONTHLY {
        (mgr.monthly_price, MONTH_MS)
    } else {
        (mgr.quarterly_price, 3 * MONTH_MS)
    };

    assert!(coin::value(&payment) >= price, EInsufficientPayment);

    let pay = payment.split(price, ctx);
    balance::join(&mut mgr.revenue, coin::into_balance(pay));
    if coin::value(&payment) > 0 {
        transfer::public_transfer(payment, ctx.sender());
    } else { coin::destroy_zero(payment); }

    // 如果已过期从现在起算，否则在原到期时间上叠加
    let base = if pass.valid_until_ms < clock.timestamp_ms() {
        clock.timestamp_ms()
    } else { pass.valid_until_ms };

    pass.valid_until_ms = base + duration_ms;

    event::emit(PassRenewed {
        pass_id: object::id(pass),
        new_expiry_ms: pass.valid_until_ms,
    });
}

/// 星门扩展：验证 Pass 有效性
public fun is_pass_valid(pass: &GatePassNFT, clock: &Clock): bool {
    clock.timestamp_ms() <= pass.valid_until_ms
}

/// 星门跳跃（持有有效 Pass 无限跳）
public fun subscriber_jump(
    gate: &Gate,
    dest_gate: &Gate,
    character: &Character,
    pass: &GatePassNFT,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(is_pass_valid(pass, clock), EPassExpired);
    gate::issue_jump_permit(
        gate, dest_gate, character, SubscriberAuth {},
        clock.timestamp_ms() + 30 * 60 * 1000, ctx,
    );
}

public struct SubscriberAuth has drop {}

/// 管理员提款
public fun withdraw_revenue(
    mgr: &mut SubscriptionManager,
    amount: u64,
    ctx: &TxContext,
) {
    assert!(ctx.sender() == mgr.admin, ENotAdmin);
    let coin = coin::take(&mut mgr.revenue, amount, ctx);
    transfer::public_transfer(coin, mgr.admin);
}

const EInvalidPlan: u64 = 0;
const EInsufficientPayment: u64 = 1;
const EPassExpired: u64 = 2;
const ENotAdmin: u64 = 3;
```

---

## dApp

```
// PassShop.tsx
import { useState } from 'react'
import { Transaction } from '@mysten/sui/transactions'
import { useDAppKit } from '@mysten/dapp-kit-react'

const SUB_PKG = "0x_SUBSCRIPTION_PACKAGE_"
const MGR_ID = "0x_MANAGER_ID_"

const PLANS = [
  { id: 0, name: '月套餐', price: 30, duration: '30 天', badge: '标准' },
  { id: 1, name: '季套餐', price: 80, duration: '90 天', badge: '省 10 SUI', popular: true },
]

export function PassShop() {
  const dAppKit = useDAppKit()
  const [status, setStatus] = useState('')

  const purchase = async (plan: number, priceInSUI: number) => {
    const tx = new Transaction()
    const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(priceInSUI * 1e9)])
    tx.moveCall({
      target: `${SUB_PKG}::gate_pass::purchase_pass`,
      arguments: [tx.object(MGR_ID), tx.pure.u8(plan), payment, tx.object('0x6')],
    })
    try {
      setStatus('⏳ 购买中...')
      await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus('✅ 订阅成功！GatePassNFT 已发送到你的钱包')
    } catch (e: any) { setStatus(`❌ ${e.message}`) }
  }

  return (
    <div className="pass-shop">
      <h1>🎫 星门订阅通行证</h1>
      <p>持有有效期内的通行证，在本联盟所有星门无限跳跃</p>
      <div className="plan-grid">
        {PLANS.map(plan => (
          <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="popular-badge">推荐</div>}
            <h3>{plan.name}</h3>
            <div className="plan-price">
              <span className="price">{plan.price}</span>
              <span className="unit">SUI</span>
            </div>
            <div className="plan-duration">有效期 {plan.duration}</div>
            <div className="plan-badge">{plan.badge}</div>
            <button className="buy-btn" onClick={() => purchase(plan.id, plan.price)}>
              购买  {plan.name}
            </button>
          </div>
        ))}
      </div>
      {status && <p className="status">{status}</p>}
    </div>
  )
}
```

---

## 📚 关联文档

- [Chapter 13：NFT 设计与 TransferPolicy](https://hoh-zone.github.io/eve-bootcamp/chapter-13.html)
- [Example 2：星门收费站](https://hoh-zone.github.io/eve-bootcamp/example-02.html)

## 30. Example 14: NFT 质押借贷 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-14.html

# 实战案例 14：物品质押借贷协议

**目标：** 构建链上借贷协议——玩家以 NFT 或高价物品作为抵押，借取 SUI 流动性；逾期未还则抵押物被清算拍卖给出价最高者。

---

状态：教学示例。正文覆盖核心借贷流程，完整目录以 `book/src/code/example-14/` 为准。

## 对应代码目录

- [example-14](https://hoh-zone.github.io/eve-bootcamp/code/example-14)
- [example-14/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-14/dapp)

## 最小调用链

`出借人注入流动性 -> 借款人抵押 NFT -> 合约发放 SUI -> 到期还款或触发清算`

## 需求分析

**场景：** 玩家持有一件价值 1000 SUI 的“稀有护盾“，但急需 SUI 购买矿机。他将护盾质押，借出 600 SUI（60% LTV），30 天内归还 618 SUI（含 3% 月息），否则护盾被清算。

---

## 合约

```
module lending::collateral_loan;

use sui::object::{Self, UID, ID};
use sui::clock::Clock;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::balance::{Self, Balance};
use sui::transfer;
use sui::dynamic_field as df;
use sui::event;

// ── 常量 ──────────────────────────────────────────────────

const MONTH_MS: u64 = 30 * 24 * 60 * 60 * 1000;
const LTV_BPS: u64 = 6_000;            // 60% 贷款价值比
const MONTHLY_INTEREST_BPS: u64 = 300; // 3% 月息
const LIQUIDATION_BONUS_BPS: u64 = 500; // 清算人奖励 5%

// ── 数据结构 ───────────────────────────────────────────────

/// 借贷池（共享对象，存放出借方的 SUI）
public struct LendingPool has key {
    id: UID,
    liquidity: Balance<SUI>,
    total_loaned: u64,
    admin: address,
}

/// 单笔贷款
public struct Loan has key {
    id: UID,
    borrower: address,
    collateral_id: ID,    // 质押物 ObjectID
    collateral_value: u64, // 出借时评估的价值（SUI）
    loan_amount: u64,      // 实际借出金额
    interest_amount: u64,  // 应还利息
    repay_by_ms: u64,      // 还款截止时间
    is_active: bool,
}

// ── 事件 ──────────────────────────────────────────────────

public struct LoanCreated has copy, drop {
    loan_id: ID,
    borrower: address,
    loan_amount: u64,
    repay_by_ms: u64,
}

public struct LoanRepaid has copy, drop {
    loan_id: ID,
    repaid: u64,
}

public struct LoanLiquidated has copy, drop {
    loan_id: ID,
    liquidator: address,
    collateral_id: ID,
}

// ── 初始化借贷池 ──────────────────────────────────────────

public fun create_pool(ctx: &mut TxContext) {
    transfer::share_object(LendingPool {
        id: object::new(ctx),
        liquidity: balance::zero(),
        total_loaned: 0,
        admin: ctx.sender(),
    });
}

/// 出借方向池中注入流动性
public fun deposit_liquidity(
    pool: &mut LendingPool,
    coin: Coin<SUI>,
    _ctx: &TxContext,
) {
    balance::join(&mut pool.liquidity, coin::into_balance(coin));
}

// ── 借款（以 NFT 为抵押）────────────────────────────────

/// 由 Oracle/Admin 评估并发起贷款
/// （实际场景中，collateral_value 需要通过链下价格预言机确定）
public fun create_loan<T: key + store>(
    pool: &mut LendingPool,
    collateral: T,
    collateral_value_sui: u64,    // 价格预言机或 Admin 确认的估值
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let loan_amount = collateral_value_sui * LTV_BPS / 10_000; // 60% LTV
    let interest = loan_amount * MONTHLY_INTEREST_BPS / 10_000;
    assert!(balance::value(&pool.liquidity) >= loan_amount, EInsufficientLiquidity);

    let collateral_id = object::id(&collateral);

    let mut loan = Loan {
        id: object::new(ctx),
        borrower: ctx.sender(),
        collateral_id,
        collateral_value: collateral_value_sui,
        loan_amount,
        interest_amount: interest,
        repay_by_ms: clock.timestamp_ms() + MONTH_MS,
        is_active: true,
    };

    // 将抵押物锁定在 Loan 对象中（动态字段）
    df::add(&mut loan.id, b"collateral", collateral);

    // 发放借款
    let loan_coin = coin::take(&mut pool.liquidity, loan_amount, ctx);
    pool.total_loaned = pool.total_loaned + loan_amount;

    transfer::public_transfer(loan_coin, ctx.sender());

    event::emit(LoanCreated {
        loan_id: object::id(&loan),
        borrower: ctx.sender(),
        loan_amount,
        repay_by_ms: loan.repay_by_ms,
    });

    transfer::share_object(loan);
}

// ── 还款（归还借款 + 利息，取回抵押物）──────────────────

public fun repay_loan<T: key + store>(
    pool: &mut LendingPool,
    loan: &mut Loan,
    mut repayment: Coin<SUI>,
    ctx: &mut TxContext,
) {
    assert!(loan.borrower == ctx.sender(), ENotBorrower);
    assert!(loan.is_active, ELoanInactive);

    let total_due = loan.loan_amount + loan.interest_amount;
    assert!(coin::value(&repayment) >= total_due, EInsufficientRepayment);

    // 还款入池
    let repay_coin = repayment.split(total_due, ctx);
    balance::join(&mut pool.liquidity, coin::into_balance(repay_coin));
    pool.total_loaned = pool.total_loaned - loan.loan_amount;

    if coin::value(&repayment) > 0 {
        transfer::public_transfer(repayment, ctx.sender());
    } else { coin::destroy_zero(repayment); }

    // 取回抵押物
    let collateral: T = df::remove(&mut loan.id, b"collateral");
    transfer::public_transfer(collateral, ctx.sender());

    loan.is_active = false;

    event::emit(LoanRepaid {
        loan_id: object::id(loan),
        repaid: total_due,
    });
}

// ── 清算（到期未还，清算人取走抵押物）──────────────────

public fun liquidate<T: key + store>(
    pool: &mut LendingPool,
    loan: &mut Loan,
    mut liquidation_payment: Coin<SUI>, // 清算人支付 collateral_value * 95%
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(loan.is_active, ELoanInactive);
    assert!(clock.timestamp_ms() > loan.repay_by_ms, ENotYetExpired);

    // 清算人需支付抵押物估值的 95%（留 5% 作为奖励）
    let liquidation_price = loan.collateral_value * (10_000 - LIQUIDATION_BONUS_BPS) / 10_000;
    assert!(coin::value(&liquidation_payment) >= liquidation_price, EInsufficientPayment);

    let pay = liquidation_payment.split(liquidation_price, ctx);
    // 还款本金 + 利息入池，剩余归清算人作奖励
    balance::join(&mut pool.liquidity, coin::into_balance(pay));

    if coin::value(&liquidation_payment) > 0 {
        transfer::public_transfer(liquidation_payment, ctx.sender());
    } else { coin::destroy_zero(liquidation_payment); }

    // 清算人获得抵押物
    let collateral: T = df::remove(&mut loan.id, b"collateral");
    transfer::public_transfer(collateral, ctx.sender());

    loan.is_active = false;

    event::emit(LoanLiquidated {
        loan_id: object::id(loan),
        liquidator: ctx.sender(),
        collateral_id: loan.collateral_id,
    });
}

const EInsufficientLiquidity: u64 = 0;
const ENotBorrower: u64 = 1;
const ELoanInactive: u64 = 2;
const EInsufficientRepayment: u64 = 3;
const ENotYetExpired: u64 = 4;
const EInsufficientPayment: u64 = 5;
```

---

## dApp 界面（借贷仪表盘）

```
// LendingDashboard.tsx
import { useQuery } from '@tanstack/react-query'
import { useCurrentClient } from '@mysten/dapp-kit-react'

const LENDING_PKG = "0x_LENDING_PACKAGE_"
const POOL_ID = "0x_POOL_ID_"

export function LendingDashboard() {
  const client = useCurrentClient()

  const { data: pool } = useQuery({
    queryKey: ['lending-pool'],
    queryFn: async () => {
      const obj = await client.getObject({ id: POOL_ID, options: { showContent: true } })
      return (obj.data?.content as any)?.fields
    },
    refetchInterval: 15_000,
  })

  const availableLiquidity = Number(pool?.liquidity?.fields?.value ?? 0) / 1e9
  const totalLoaned = Number(pool?.total_loaned ?? 0) / 1e9
  const utilization = totalLoaned / (availableLiquidity + totalLoaned) * 100

  return (
    <div className="lending-dashboard">
      <h1>🏦 物品质押借贷</h1>

      <div className="pool-stats">
        <div className="stat">
          <span>💧 可借流动性</span>
          <strong>{availableLiquidity.toFixed(2)} SUI</strong>
        </div>
        <div className="stat">
          <span>📤 已借出</span>
          <strong>{totalLoaned.toFixed(2)} SUI</strong>
        </div>
        <div className="stat">
          <span>📊 资金使用率</span>
          <strong>{utilization.toFixed(1)}%</strong>
        </div>
        <div className="stat">
          <span>💰 月息</span>
          <strong>3%</strong>
        </div>
      </div>

      <div className="loan-info">
        <h3>借款条件</h3>
        <ul>
          <li>贷款价值比（LTV）：60%</li>
          <li>月息：3%（固定）</li>
          <li>最长借期：30 天</li>
          <li>逾期清算：抵押物以估值 95% 被清算人收购</li>
        </ul>
      </div>
    </div>
  )
}
```

---

## 📚 关联文档

- [Chapter 12：动态字段](https://hoh-zone.github.io/eve-bootcamp/chapter-12.html)
- [Chapter 14：经济系统](https://hoh-zone.github.io/eve-bootcamp/chapter-14.html)
- [Chapter 15：跨合约组合](https://hoh-zone.github.io/eve-bootcamp/chapter-15.html)

## 31. Example 16: NFT 合成拆解 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-16.html

# 实战案例 16：NFT 合成与拆解系统

**目标：** 构建材料合成系统——销毁多个低级 NFT 合成一个高级 NFT（概率性），也支持高级 NFT 拆解为材料；利用链上随机数确保结果公平。

---

状态：教学示例。正文讲解合成/拆解与随机数接入，完整目录以 `book/src/code/example-16/` 为准。

## 对应代码目录

- [example-16](https://hoh-zone.github.io/eve-bootcamp/code/example-16)
- [example-16/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-16/dapp)

## 最小调用链

`用户选择材料 -> 合约读取随机数 -> 执行合成/失败返还 -> 发事件 -> 前端刷新结果`

## 需求分析

**场景：** 你设计了三层装备体系：

- **材料碎片**（Fragment）：普通，随机掉落
- **精炼组件**（Component）：3 个碎片 → 60% 概率合成
- **传世神器**（Artifact）：3 个精炼组件 → 30% 概率合成，失败返回 1 个组件

---

## 合约

```
module crafting::forge;

use sui::object::{Self, UID, ID};
use sui::random::{Self, Random};
use sui::transfer;
use sui::event;
use std::string::{Self, String, utf8};

// ── 常量 ──────────────────────────────────────────────────

const TIER_FRAGMENT: u8 = 0;
const TIER_COMPONENT: u8 = 1;
const TIER_ARTIFACT: u8 = 2;

// 合成成功率（BPS）
const FRAGMENT_TO_COMPONENT_BPS: u64 = 6_000; // 60%
const COMPONENT_TO_ARTIFACT_BPS: u64 = 3_000; // 30%

// ── 数据结构 ───────────────────────────────────────────────

public struct ForgeItem has key, store {
    id: UID,
    tier: u8,
    name: String,
    image_url: String,
    power: u64,    // 属性值（越高级越强）
}

public struct ForgeAdminCap has key, store { id: UID }

// ── 事件 ──────────────────────────────────────────────────

public struct CraftAttempted has copy, drop {
    crafter: address,
    input_tier: u8,
    success: bool,
    result_tier: u8,
}

public struct ItemDisassembled has copy, drop {
    crafter: address,
    from_tier: u8,
    fragments_returned: u64,
}

// ── 初始化 ────────────────────────────────────────────────

fun init(ctx: &mut TxContext) {
    transfer::public_transfer(ForgeAdminCap { id: object::new(ctx) }, ctx.sender());
}

/// 铸造基础碎片（Admin only，比如任务奖励）
public fun mint_fragment(
    _cap: &ForgeAdminCap,
    recipient: address,
    ctx: &mut TxContext,
) {
    let item = ForgeItem {
        id: object::new(ctx),
        tier: TIER_FRAGMENT,
        name: utf8(b"Plasma Fragment"),
        image_url: utf8(b"https://assets.example.com/fragment.png"),
        power: 10,
    };
    transfer::public_transfer(item, recipient);
}

// ── 合成：3 个低级 → 1 个高级（带随机成功率）────────────

public fun craft(
    input1: ForgeItem,
    input2: ForgeItem,
    input3: ForgeItem,
    random: &Random,
    ctx: &mut TxContext,
) {
    // 三个输入必须同一阶段
    assert!(input1.tier == input2.tier && input2.tier == input3.tier, EMismatchedTier);
    let input_tier = input1.tier;
    assert!(input_tier < TIER_ARTIFACT, EMaxTierReached);

    let target_tier = input_tier + 1;

    // 获取链上随机数（0-9999）
    let mut rng = random::new_generator(random, ctx);
    let roll = rng.generate_u64() % 10_000;

    let success_threshold = if target_tier == TIER_COMPONENT {
        FRAGMENT_TO_COMPONENT_BPS
    } else {
        COMPONENT_TO_ARTIFACT_BPS
    };

    // 无论成功与否，都销毁三个输入
    let ForgeItem { id: id1, .. } = input1;
    let ForgeItem { id: id2, .. } = input2;
    let ForgeItem { id: id3, .. } = input3;
    id1.delete(); id2.delete(); id3.delete();

    let success = roll < success_threshold;

    if success {
        let (name, image_url, power) = get_tier_info(target_tier);
        let result = ForgeItem {
            id: object::new(ctx),
            tier: target_tier,
            name,
            image_url,
            power,
        };
        transfer::public_transfer(result, ctx.sender());
    } else if target_tier == TIER_ARTIFACT {
        // 合成神器失败时，安慰奖：返还 1 个精炼组件
        let (name, image_url, power) = get_tier_info(TIER_COMPONENT);
        let consolation = ForgeItem {
            id: object::new(ctx),
            tier: TIER_COMPONENT,
            name,
            image_url,
            power,
        };
        transfer::public_transfer(consolation, ctx.sender());
    };
    // 合成组件失败时不返还任何东西（60% 成功率，风险在于玩家）

    event::emit(CraftAttempted {
        crafter: ctx.sender(),
        input_tier,
        success,
        result_tier: if success { target_tier } else { input_tier },
    });
}

// ── 拆解：1 个高级 → 多个低级 ────────────────────────────

public fun disassemble(
    item: ForgeItem,
    ctx: &mut TxContext,
) {
    assert!(item.tier > TIER_FRAGMENT, ECannotDisassembleFragment);

    let target_tier = item.tier - 1;
    let fragments_to_return = 2u64; // 拆解只返还 2 个（有损耗）
    let item_tier = item.tier;

    let ForgeItem { id, .. } = item;
    id.delete();

    let (name, image_url, power) = get_tier_info(target_tier);
    let mut i = 0;
    while (i < fragments_to_return) {
        let fragment = ForgeItem {
            id: object::new(ctx),
            tier: target_tier,
            name,
            image_url,
            power,
        };
        transfer::public_transfer(fragment, ctx.sender());
        i = i + 1;
    };

    event::emit(ItemDisassembled {
        crafter: ctx.sender(),
        from_tier: item_tier,
        fragments_returned: fragments_to_return,
    });
}

fun get_tier_info(tier: u8): (String, String, u64) {
    if tier == TIER_FRAGMENT {
        (utf8(b"Plasma Fragment"), utf8(b"https://assets.example.com/fragment.png"), 10)
    } else if tier == TIER_COMPONENT {
        (utf8(b"Refined Component"), utf8(b"https://assets.example.com/component.png"), 100)
    } else {
        (utf8(b"Ancient Artifact"), utf8(b"https://assets.example.com/artifact.png"), 1000)
    }
}

const EMismatchedTier: u64 = 0;
const EMaxTierReached: u64 = 1;
const ECannotDisassembleFragment: u64 = 2;
```

---

## dApp（铸造台界面）

```
// ForgingStation.tsx
import { useState } from 'react'
import { useCurrentClient, useCurrentAccount } from '@mysten/dapp-kit-react'
import { useQuery } from '@tanstack/react-query'
import { Transaction } from '@mysten/sui/transactions'
import { useDAppKit } from '@mysten/dapp-kit-react'

const CRAFTING_PKG = "0x_CRAFTING_PACKAGE_"
const TIER_NAMES = ['💎 碎片', '⚙️ 精炼组件', '🌟 传世神器']
const CRAFT_RATES = ['60%', '30%', '—']

export function ForgingStation() {
  const client = useCurrentClient()
  const dAppKit = useDAppKit()
  const account = useCurrentAccount()
  const [selected, setSelected] = useState<string[]>([])
  const [status, setStatus] = useState('')
  const [lastCraft, setLastCraft] = useState<{success: boolean; tier: string} | null>(null)

  const { data: userItems, refetch } = useQuery({
    queryKey: ['forge-items', account?.address],
    queryFn: async () => {
      if (!account) return []
      const objs = await client.getOwnedObjects({
        owner: account.address,
        filter: { StructType: `${CRAFTING_PKG}::forge::ForgeItem` },
        options: { showContent: true },
      })
      return objs.data.map(obj => ({
        id: obj.data!.objectId,
        tier: Number((obj.data!.content as any).fields.tier),
        name: (obj.data!.content as any).fields.name,
        power: (obj.data!.content as any).fields.power,
      }))
    },
    enabled: !!account,
  })

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const handleCraft = async () => {
    if (selected.length !== 3) return
    const tx = new Transaction()
    tx.moveCall({
      target: `${CRAFTING_PKG}::forge::craft`,
      arguments: [
        tx.object(selected[0]),
        tx.object(selected[1]),
        tx.object(selected[2]),
        tx.object('0x8'), // Random 系统对象
      ],
    })
    try {
      setStatus('⏳ 合成中（链上随机数判定）...')
      const result = await dAppKit.signAndExecuteTransaction({ transaction: tx })
      // 从事件读取合成结果
      const craftEvent = result.events?.find(e => e.type.includes('CraftAttempted'))
      if (craftEvent) {
        const { success, result_tier } = craftEvent.parsedJson as any
        setLastCraft({ success, tier: TIER_NAMES[Number(result_tier)] })
        setStatus(success ? `✅ 合成成功！获得 ${TIER_NAMES[Number(result_tier)]}` : '❌ 合成失败')
      }
      setSelected([])
      refetch()
    } catch (e: any) { setStatus(`❌ ${e.message}`) }
  }

  const selectedTier = selected.length > 0 && userItems
    ? userItems.find(i => i.id === selected[0])?.tier
    : null

  return (
    <div className="forging-station">
      <h1>⚒ 神秘铸造台</h1>

      {lastCraft && (
        <div className={`craft-result ${lastCraft.success ? 'success' : 'fail'}`}>
          {lastCraft.success ? '✨ 合成成功！' : '💔 合成失败'} → {lastCraft.tier}
        </div>
      )}

      <div className="craft-info">
        <div>碎片 × 3 → 精炼组件（成功率 {CRAFT_RATES[0]}）</div>
        <div>精炼组件 × 3 → 传世神器（成功率 {CRAFT_RATES[1]}）</div>
      </div>

      <h3>选择 3 件同阶物品进行合成</h3>
      <div className="items-grid">
        {userItems?.map(item => (
          <div
            key={item.id}
            className={`item-slot ${selected.includes(item.id) ? 'selected' : ''}`}
            onClick={() => toggleSelect(item.id)}
          >
            <div className="tier-badge">{TIER_NAMES[item.tier]}</div>
            <div className="power">⚡ {item.power}</div>
          </div>
        ))}
      </div>

      <button
        className="craft-btn"
        disabled={selected.length !== 3}
        onClick={handleCraft}
      >
        🔥 开始合成（{selected.length}/3 已选）
      </button>

      {status && <p className="status">{status}</p>}
    </div>
  )
}
```

---

## 📚 关联文档

- [Sui 链上随机数](https://docs.sui.io/guides/developer/advanced/randomness-onchain)
- [Chapter 13：NFT 设计](https://hoh-zone.github.io/eve-bootcamp/chapter-13.html)
- [Chapter 35：未来展望](https://hoh-zone.github.io/eve-bootcamp/chapter-35.html)

## 32. Example 18: 跨联盟外交条约 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-18.html

# 实战案例 18：跨联盟外交合约（停火与资源条约）

**目标：** 构建链上外交合约——两个联盟可以签署条约（停火、资源共享、贸易协定），条约由双方 Leader 多签生效，违约可在链上举证，有效期内强制执行。

---

状态：教学示例。正文覆盖条约状态机，完整目录以 `book/src/code/example-18/` 为准。

## 对应代码目录

- [example-18](https://hoh-zone.github.io/eve-bootcamp/code/example-18)
- [example-18/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-18/dapp)

## 最小调用链

`一方发起提案 -> 双方存押金并签署 -> 条约生效 -> 发生违约/撕约 -> 扣罚或退还押金`

## 测试闭环

- 发起提案：确认 `TreatyProposal` 创建成功并发出事件
- 双签生效：确认 `effective_at_ms` 写入，双方押金对等
- 提前通知与终止：确认通知期未成熟前无法终止，成熟后押金退回
- 举报违约：确认罚款从违约方押金扣出并转给对方

## 需求分析

**场景：** 联盟 Alpha 和联盟 Beta 爆发冲突，双方决定谈判：

1. **停火协议**：72 小时内双方炮塔不对对方成员开火
1. **过路协议**：Alpha 成员可免费使用 Beta 的星门（反之亦然）
1. **资源分享**：双方每日互相转账 100 WAR Token
1. 任一方可以单方面撕毁条约（需提前 24 小时通知链上）
1. 违约行为（如炮塔非法开火）可以通过服务器签名举报，罚款押金

---

## 合约

```
module diplomacy::treaty;

use sui::object::{Self, UID, ID};
use sui::clock::Clock;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::balance::{Self, Balance};
use sui::transfer;
use sui::event;
use std::string::{Self, String, utf8};

// ── 常量 ──────────────────────────────────────────────────

const NOTICE_PERIOD_MS: u64 = 24 * 60 * 60 * 1000;  // 撕约提前通知 24 小时
const BREACH_FINE: u64 = 100_000_000_000;             // 违约罚款 100 SUI（从押金扣）

// 条约类型
const TREATY_CEASEFIRE: u8 = 0;       // 停火协议
const TREATY_PASSAGE: u8 = 1;         // 过路权协议
const TREATY_RESOURCE_SHARE: u8 = 2;  // 资源共享

// ── 数据结构 ───────────────────────────────────────────────

/// 外交条约（共享对象）
public struct Treaty has key {
    id: UID,
    treaty_type: u8,
    party_a: address,          // 联盟 A 的 Leader 地址
    party_b: address,          // 联盟 B 的 Leader 地址
    party_a_signed: bool,
    party_b_signed: bool,
    effective_at_ms: u64,      // 生效时间（双签后）
    expires_at_ms: u64,        // 到期时间（0 = 无限期）
    termination_notice_ms: u64, // 撕约通知时间（0 = 未通知）
    party_a_deposit: Balance<SUI>,  // A 方押金（用于违约赔偿）
    party_b_deposit: Balance<SUI>,  // B 方押金
    breach_count_a: u64,
    breach_count_b: u64,
    description: String,
}

/// 条约提案（由一方发起，等待对方签署）
public struct TreatyProposal has key {
    id: UID,
    proposed_by: address,
    counterparty: address,
    treaty_type: u8,
    duration_days: u64,        // 有效期（天），0 = 无限期
    deposit_required: u64,      // 要求各方押金
    description: String,
}

// ── 事件 ──────────────────────────────────────────────────

public struct TreatyProposed has copy, drop { proposal_id: ID, proposer: address, counterparty: address }
public struct TreatySigned has copy, drop { treaty_id: ID, party: address }
public struct TreatyEffective has copy, drop { treaty_id: ID, treaty_type: u8 }
public struct TreatyTerminated has copy, drop { treaty_id: ID, terminated_by: address }
public struct BreachReported has copy, drop { treaty_id: ID, breaching_party: address, fine: u64 }

// ── 发起条约提案 ──────────────────────────────────────────

public fun propose_treaty(
    counterparty: address,
    treaty_type: u8,
    duration_days: u64,
    deposit_required: u64,
    description: vector<u8>,
    ctx: &mut TxContext,
) {
    let proposal = TreatyProposal {
        id: object::new(ctx),
        proposed_by: ctx.sender(),
        counterparty,
        treaty_type,
        duration_days,
        deposit_required,
        description: utf8(description),
    };
    let proposal_id = object::id(&proposal);
    transfer::share_object(proposal);
    event::emit(TreatyProposed {
        proposal_id,
        proposer: ctx.sender(),
        counterparty,
    });
}

// ── 接受提案（发起方签署 + 押金）────────────────────────

public fun accept_and_sign_a(
    proposal: &TreatyProposal,
    mut deposit: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(ctx.sender() == proposal.proposed_by, ENotParty);

    let deposit_amt = coin::value(&deposit);
    assert!(deposit_amt >= proposal.deposit_required, EInsufficientDeposit);

    let deposit_coin = deposit.split(proposal.deposit_required, ctx);
    if coin::value(&deposit) > 0 {
        transfer::public_transfer(deposit, ctx.sender());
    } else { coin::destroy_zero(deposit); }

    let expires = if proposal.duration_days > 0 {
        clock.timestamp_ms() + proposal.duration_days * 86_400_000
    } else { 0 };

    let treaty = Treaty {
        id: object::new(ctx),
        treaty_type: proposal.treaty_type,
        party_a: proposal.proposed_by,
        party_b: proposal.counterparty,
        party_a_signed: true,
        party_b_signed: false,
        effective_at_ms: 0,
        expires_at_ms: expires,
        termination_notice_ms: 0,
        party_a_deposit: coin::into_balance(deposit_coin),
        party_b_deposit: balance::zero(),
        breach_count_a: 0,
        breach_count_b: 0,
        description: proposal.description,
    };
    let treaty_id = object::id(&treaty);
    transfer::share_object(treaty);
    event::emit(TreatySigned { treaty_id, party: ctx.sender() });
}

/// 对方联盟签署（条约正式生效）
public fun countersign(
    treaty: &mut Treaty,
    mut deposit: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(ctx.sender() == treaty.party_b, ENotParty);
    assert!(treaty.party_a_signed, ENotYetSigned);
    assert!(!treaty.party_b_signed, EAlreadySigned);

    let required = balance::value(&treaty.party_a_deposit); // 对等押金
    assert!(coin::value(&deposit) >= required, EInsufficientDeposit);

    let dep = deposit.split(required, ctx);
    balance::join(&mut treaty.party_b_deposit, coin::into_balance(dep));
    if coin::value(&deposit) > 0 {
        transfer::public_transfer(deposit, ctx.sender());
    } else { coin::destroy_zero(deposit); }

    treaty.party_b_signed = true;
    treaty.effective_at_ms = clock.timestamp_ms();

    event::emit(TreatyEffective { treaty_id: object::id(treaty), treaty_type: treaty.treaty_type });
    event::emit(TreatySigned { treaty_id: object::id(treaty), party: ctx.sender() });
}

// ── 验证条约是否生效（炮塔/星门扩展调用）───────────────

public fun is_treaty_active(treaty: &Treaty, clock: &Clock): bool {
    if !treaty.party_a_signed || !treaty.party_b_signed { return false };
    if treaty.expires_at_ms > 0 && clock.timestamp_ms() > treaty.expires_at_ms { return false };
    // 撕约通知期内，条约仍然有效
    true
}

/// 检查某地址是否在条约保护下
public fun is_protected_by_treaty(
    treaty: &Treaty,
    protected_member: address, // 受保护的联盟成员（通过 FactionNFT.owner 或 member 列表核查）
    aggressor_faction: address,
    clock: &Clock,
): bool {
    is_treaty_active(treaty, clock)
    // 真实场景中需要额外核查成员与联盟的关联
}

// ── 提交撕约通知（24 小时后生效）───────────────────────

public fun give_termination_notice(
    treaty: &mut Treaty,
    clock: &Clock,
    ctx: &TxContext,
) {
    assert!(ctx.sender() == treaty.party_a || ctx.sender() == treaty.party_b, ENotParty);
    assert!(is_treaty_active(treaty, clock), ETreatyNotActive);
    treaty.termination_notice_ms = clock.timestamp_ms();
    event::emit(TreatyTerminated { treaty_id: object::id(treaty), terminated_by: ctx.sender() });
}

/// 通知期满后正式终止条约，双方取回押金
public fun finalize_termination(
    treaty: &mut Treaty,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(treaty.termination_notice_ms > 0, ENoNoticeGiven);
    assert!(
        clock.timestamp_ms() >= treaty.termination_notice_ms + NOTICE_PERIOD_MS,
        ENoticeNotMature,
    );
    // 退还押金
    let a_dep = balance::withdraw_all(&mut treaty.party_a_deposit);
    let b_dep = balance::withdraw_all(&mut treaty.party_b_deposit);
    if balance::value(&a_dep) > 0 {
        transfer::public_transfer(coin::from_balance(a_dep, ctx), treaty.party_a);
    } else { balance::destroy_zero(a_dep); }
    if balance::value(&b_dep) > 0 {
        transfer::public_transfer(coin::from_balance(b_dep, ctx), treaty.party_b);
    } else { balance::destroy_zero(b_dep); }
}

// ── 举报违约（由游戏服务器验证并签名）──────────────────

public fun report_breach(
    treaty: &mut Treaty,
    breaching_party: address,  // 违约联盟的 Leader 地址
    admin_acl: &AdminACL,
    ctx: &mut TxContext,
) {
    verify_sponsor(admin_acl, ctx);  // 服务器证明违约事件真实发生

    let fine = BREACH_FINE;

    if breaching_party == treaty.party_a {
        treaty.breach_count_a = treaty.breach_count_a + 1;
        // 从 A 的押金中扣除罚款转给 B
        if balance::value(&treaty.party_a_deposit) >= fine {
            let fine_coin = coin::take(&mut treaty.party_a_deposit, fine, ctx);
            transfer::public_transfer(fine_coin, treaty.party_b);
        }
    } else if breaching_party == treaty.party_b {
        treaty.breach_count_b = treaty.breach_count_b + 1;
        if balance::value(&treaty.party_b_deposit) >= fine {
            let fine_coin = coin::take(&mut treaty.party_b_deposit, fine, ctx);
            transfer::public_transfer(fine_coin, treaty.party_a);
        }
    } else abort ENotParty;

    event::emit(BreachReported {
        treaty_id: object::id(treaty),
        breaching_party,
        fine,
    });
}

const ENotParty: u64 = 0;
const EInsufficientDeposit: u64 = 1;
const ENotYetSigned: u64 = 2;
const EAlreadySigned: u64 = 3;
const ETreatyNotActive: u64 = 4;
const ENoNoticeGiven: u64 = 5;
const ENoticeNotMature: u64 = 6;
```

---

## dApp（外交中心）

```
// DiplomacyCenter.tsx
import { useState } from 'react'
import { useCurrentClient } from '@mysten/dapp-kit-react'
import { useQuery } from '@tanstack/react-query'

const DIP_PKG = "0x_DIPLOMACY_PACKAGE_"

const TREATY_TYPES = [
  { id: 0, name: '⚔️ 停火协议', desc: '双方在有效期内不得发起攻击' },
  { id: 1, name: '🚪 过路权协议', desc: '双方成员可免费使用对方星门' },
  { id: 2, name: '💰 资源共享协议', desc: '定期相互转移资源' },
]

export function DiplomacyCenter() {
  const client = useCurrentClient()
  const [proposing, setProposing] = useState(false)

  const { data: treaties } = useQuery({
    queryKey: ['active-treaties'],
    queryFn: async () => {
      const events = await client.queryEvents({
        query: { MoveEventType: `${DIP_PKG}::treaty::TreatyEffective` },
        limit: 20,
      })
      return events.data
    },
    refetchInterval: 30_000,
  })

  return (
    <div className="diplomacy-center">
      <header>
        <h1>🌐 跨联盟外交中心</h1>
        <p>在链上签署具有法律效力的联盟条约</p>
      </header>

      <section className="treaty-types">
        <h3>可签署的条约类型</h3>
        <div className="types-grid">
          {TREATY_TYPES.map(t => (
            <div key={t.id} className="type-card">
              <h4>{t.name}</h4>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="active-treaties">
        <h3>当前生效条约</h3>
        {treaties?.length === 0 && <p>暂无条约</p>}
        {treaties?.map(e => {
          const { treaty_id, treaty_type } = e.parsedJson as any
          const type = TREATY_TYPES[Number(treaty_type)]
          return (
            <div key={treaty_id} className="treaty-card">
              <span className="treaty-type">{type?.name}</span>
              <span className="treaty-id">{treaty_id.slice(0, 12)}...</span>
              <span className="treaty-status active">✅ 生效中</span>
            </div>
          )
        })}
      </section>

      <button className="propose-btn" onClick={() => setProposing(true)}>
        📝 提议新条约
      </button>
    </div>
  )
}
```

---

## 🎯 关键设计亮点

| 机制   | 实现方式                                            |
| ---- | ----------------------------------------------- |
| 双签生效 | `party_a_signed` + `party_b_signed` 都为 true 才生效 |
| 押金约束 | 争端双方各存押金，违约自动扣罚                                 |
| 撕约通知 | `termination_notice_ms` + 24 小时冷静期              |
| 违约举证 | 游戏服务器 AdminACL 签名证明，自动执行罚款                      |
| 条约核查 | `is_treaty_active()` 供炮塔/星门扩展调用                 |

## 33. Chapter 18: 多租户与游戏服务器集成 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-18.html

# Chapter 18：多租户架构与游戏服务器集成

**目标：** 理解 EVE Frontier 的多租户（Multi-tenant）世界合约设计，掌握如何构建可服务多个联盟的平台型合约，以及如何与游戏服务器双向集成。

---

状态：架构章节。正文以多租户设计和 Registry 模式为主。

## 18.1 什么是多租户合约？

**单租户**：一个合约只服务于一个 Owner（你的联盟）。

**多租户**：一个合约部署后，可以同时服务多个不相关的 Owner（多个联盟），彼此数据隔离。

```
单租户例子（Example 1-5 的模式）：
  合约 → 专属 TollGate（只有你的星门）

多租户例子：
  合约 → 注册 Alliance A 的星门收费配置
        → 注册 Alliance B 的星门收费配置
        → 注册 Alliance C 的存储箱市场配置
        →（每个联盟彼此隔离，数据独立）
```

**适用场景**：打造一个可供多个联盟使用的“SaaS“级工具。例如：通用拍卖平台、版税市场基础设施、任务系统框架。

多租户这件事最容易被误解成“把很多用户塞进一个合约”。真正要解决的问题其实是：

如何让很多彼此不信任的经营者，共享同一套协议能力，但又互不串线、互不越权、互不污染数据。

所以多租户设计的核心不是“省部署次数”，而是三件事：

- **隔离** A 租户不能碰 B 租户状态
- **复用** 同一套逻辑不必为每个联盟重新发一遍包
- **可运营** 平台方自己还能持续维护、升级和计费

---

## 18.2 多租户合约设计模式

```
module platform::multi_toll;

use sui::table::{Self, Table};
use sui::object::{Self, ID};

/// 平台注册表（共享对象，所有租户共用）
public struct TollPlatform has key {
    id: UID,
    registrations: Table<ID, TollConfig>,  // gate_id → 收费配置
}

/// 每个租户（星门）的独立配置
public struct TollConfig has store {
    owner: address,          // 这个配置的 Owner（星门拥有者）
    toll_amount: u64,
    fee_recipient: address,
    total_collected: u64,
}

/// 租户注册（任意 Builder 都可以把自己的星门注册进来）
public fun register_gate(
    platform: &mut TollPlatform,
    gate: &Gate,
    owner_cap: &OwnerCap<Gate>,          // 证明你是这个星门的 Owner
    toll_amount: u64,
    fee_recipient: address,
    ctx: &TxContext,
) {
    // 验证 OwnerCap 和 Gate 对应
    assert!(owner_cap.authorized_object_id == object::id(gate), ECapMismatch);

    let gate_id = object::id(gate);
    assert!(!table::contains(&platform.registrations, gate_id), EAlreadyRegistered);

    table::add(&mut platform.registrations, gate_id, TollConfig {
        owner: ctx.sender(),
        toll_amount,
        fee_recipient,
        total_collected: 0,
    });
}

/// 调整租户配置（只有自己的配置才能修改）
public fun update_toll(
    platform: &mut TollPlatform,
    gate: &Gate,
    owner_cap: &OwnerCap<Gate>,
    new_toll_amount: u64,
    ctx: &TxContext,
) {
    assert!(owner_cap.authorized_object_id == object::id(gate), ECapMismatch);

    let config = table::borrow_mut(&mut platform.registrations, object::id(gate));
    assert!(config.owner == ctx.sender(), ENotConfigOwner);

    config.toll_amount = new_toll_amount;
}

/// 多租户跳跃（收费逻辑复用，但配置各自独立）
public fun multi_tenant_jump(
    platform: &mut TollPlatform,
    source_gate: &Gate,
    dest_gate: &Gate,
    character: &Character,
    mut payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // 读取该星门的专属收费配置
    let gate_id = object::id(source_gate);
    assert!(table::contains(&platform.registrations, gate_id), EGateNotRegistered);

    let config = table::borrow_mut(&mut platform.registrations, gate_id);
    assert!(coin::value(&payment) >= config.toll_amount, EInsufficientPayment);

    // 转给各自的 fee_recipient
    let toll = payment.split(config.toll_amount, ctx);
    transfer::public_transfer(toll, config.fee_recipient);
    config.total_collected = config.total_collected + config.toll_amount;

    // 还回找零
    if coin::value(&payment) > 0 {
        transfer::public_transfer(payment, ctx.sender());
    } else {
        coin::destroy_zero(payment);
    };

    // 发放跳跃许可
    gate::issue_jump_permit(
        source_gate, dest_gate, character, MultiTollAuth {}, clock.timestamp_ms() + 15 * 60 * 1000, ctx,
    );
}

public struct MultiTollAuth has drop {}
const ECapMismatch: u64 = 0;
const EAlreadyRegistered: u64 = 1;
const ENotConfigOwner: u64 = 2;
const EGateNotRegistered: u64 = 3;
const EInsufficientPayment: u64 = 4;
```

### 多租户设计真正要先决定的，是“租户键”是什么

在这个例子里，`gate_id` 充当租户边界。现实里常见的租户键还有：

- 某个 `assembly_id`
- 某个 `character_id`
- 某个联盟对象 ID
- 某个经过规范化的业务主键

这个选择非常关键，因为它决定了：

- 数据如何隔离
- 权限如何校验
- 前端和索引层如何检索

如果租户键选得不稳定，后面你会频繁遇到“这到底算一个租户还是两个”的脏边界问题。

### 多租户合约最常见的三类事故

#### 1. 隔离做得不彻底

看起来是多租户，实际某些路径仍然用全局共享参数，导致不同联盟之间互相影响。

#### 2. 平台参数和租户参数混在一起

结果是：

- 有些配置本来应该全局统一
- 却被某个租户私自改了

或者反过来：

- 本来应该每租户独立的费率
- 却被做成全局唯一值

#### 3. 查询模型没跟上

链上写了多租户结构，但前端和索引层仍然只会按“单对象”思路读取，最后平台根本不好用。

---

## 18.3 游戏服务器集成模式

### 模式一：服务器作为事件监听器

```
// game-server/event-listener.ts
// 游戏服务器监听链上事件，更新游戏状态

import { SuiClient } from "@mysten/sui/client";

const client = new SuiClient({ url: process.env.SUI_RPC! });

// 监听玩家成就，触发游戏内奖励
await client.subscribeEvent({
  filter: { Package: MY_PACKAGE },
  onMessage: async (event) => {
    if (event.type.includes("AchievementUnlocked")) {
      const { player, achievement_type } = event.parsedJson as any;

      // 游戏服务器处理：给玩家发放游戏内物品
      await gameServerAPI.grantItemToPlayer(player, achievement_type);
    }

    if (event.type.includes("GateJumped")) {
      const { character_id, destination_gate_id } = event.parsedJson as any;

      // 游戏服务器处理：传送玩家到目的地星系
      await gameServerAPI.teleportCharacter(character_id, destination_gate_id);
    }
  },
});
```

### 模式二：服务器作为数据提供者

```
// game-server/api.ts
// 游戏服务器提供链下数据，dApp 调用

import express from "express";

const app = express();

// 提供星系名称（解密位置哈希）
app.get("/api/location/:hash", async (req, res) => {
  const { hash } = req.params;
  const geoInfo = await locationDB.getByHash(hash);
  res.json(geoInfo);
});

// 验证临近性（供 Sponsor 服务调用）
app.post("/api/proximity/verify", async (req, res) => {
  const { player_id, assembly_id, max_distance_km } = req.body;

  const playerPos = await getPlayerPosition(player_id);
  const assemblyPos = await getAssemblyPosition(assembly_id);
  const distance = calculateDistance(playerPos, assemblyPos);

  res.json({
    is_near: distance <= max_distance_km,
    distance_km: distance,
  });
});

// 获取玩家实时游戏状态
app.get("/api/character/:id/status", async (req, res) => {
  const status = await gameServerAPI.getCharacterStatus(req.params.id);
  res.json({
    online: status.online,
    system: status.current_system,
    ship: status.current_ship,
    fleet: status.fleet_id,
  });
});
```

### 模式三：双向状态同步

```
链上事件 ──────────────► 游戏服务器
（NFT 铸造、任务完成）     （更新游戏世界状态）

游戏服务器 ──────────────► 链上交易
（物理验证、赞助签名）      （记录结果、发放奖励）
```

### 这三种模式不要混成一锅

它们虽然都叫“服务端集成”，但职责完全不同：

- **事件监听器** 偏消费型，把链上结果同步回游戏世界
- **数据提供者** 偏查询型，为前端和后端提供链下解释层
- **双向同步** 偏协同型，让链上和游戏服互相推动状态变化

如果你不分层，最后很容易出现：

- 一个服务既管监听，又管赞助，又管所有查询
- 出问题时完全不知道是哪条链路坏了

### 游戏服务器和链上之间最关键的不是“联通”，而是“口径一致”

例如：

- 链上认的 `assembly_id` 和游戏服认的设施编号是否同一件事
- 位置哈希和链下地图坐标是否一一对应
- 事件里的角色 ID 与游戏数据库里的角色主键是否稳定映射

这些映射一旦漂移，系统表面上还是通的，业务却会慢慢失真。

---

## 18.4 ObjectRegistry：全局查询表

当你的合约有多个共享对象时，需要一个注册表让其他合约和 dApp 找到它们：

```
module platform::registry;

/// 全局注册表（类似域名系统）
public struct ObjectRegistry has key {
    id: UID,
    entries: Table<String, ID>,  // 名称 → ObjectID
}

/// 注册一个命名对象
public fun register(
    registry: &mut ObjectRegistry,
    name: vector<u8>,
    object_id: ID,
    _admin_cap: &AdminCap,
    ctx: &TxContext,
) {
    table::add(
        &mut registry.entries,
        std::string::utf8(name),
        object_id,
    );
}

/// 查询
public fun resolve(registry: &ObjectRegistry, name: String): ID {
    *table::borrow(®istry.entries, name)
}
```

```
// 通过注册表查找 Treasury ID
const registry = await getObjectWithJson(REGISTRY_ID);
const treasuryId = registry?.entries?.["alliance_treasury"];
```

Registry 的价值，不只是“方便查一个 ID”，而是把“分散的对象发现逻辑”统一下来。

这会直接改善三件事：

- 前端不必硬编码一堆对象地址
- 其他合约知道该去哪里找关键对象
- 升级或迁移后，可以通过注册表做平滑切换

### 但 Registry 也有边界

不要把它当成万能数据库。它最适合做：

- 命名解析
- 核心对象入口发现
- 少量稳定映射

不适合做：

- 高频变化的大列表
- 重型业务统计
- 大规模时间序列数据

---

## 🔖 本章小结

| 知识点            | 核心要点                                |
| -------------- | ----------------------------------- |
| 多租户合约          | Table 按 gate_id 隔离配置，任意 Builder 可注册 |
| 服务端角色          | 事件监听 + 数据提供 + 临近性验证                 |
| 双向同步           | 链上事件 → 游戏状态；游戏验证 → 链上记录             |
| ObjectRegistry | 全局命名表，方便其他合约和 dApp 查找对象             |

## 34. Chapter 19: 全栈 dApp 架构设计 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-19.html

# Chapter 19：全栈 dApp 架构设计

**目标：** 设计和实现生产级的 EVE Frontier dApp，涵盖状态管理、实时数据更新、错误处理、响应式设计和 CI/CD 自动化部署。

---

状态：架构章节。正文以全栈 dApp 组织、状态管理和部署为主。

## 19.1 全栈架构概览

```
┌─────────────────────────────────────────────────────┐
│                    用户浏览器                         │
│  ┌──────────────────────────────────────────────┐   │
│  │              React / Next.js dApp             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐  │   │
│  │  │ EVE Vault│  │React     │  │ Tanstack   │  │   │
│  │  │ Wallet   │  │ dapp-kit │  │ Query      │  │   │
│  │  └──────────┘  └──────────┘  └────────────┘  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────┘
                          │
              ┌───────────┼────────────┐
              ▼           ▼            ▼
         Sui 全节点    你的后端      游戏服务器
         GraphQL      赞助服务      位置 / 验证 API
         事件流        索引服务
```

这张图最该传达的不是“技术栈很多”，而是：

一个真实可用的 EVE dApp，从来不是单页前端，而是一整套分层协同系统。

这套系统里每层都在解决不同问题：

- 浏览器负责交互和状态反馈
- 钱包负责签名与身份
- 全节点和 GraphQL 提供链上真相
- 后端负责赞助、风控、聚合
- 游戏服务器提供链下世界解释和验证

如果这些职责不分层，系统表面能跑，后面一定会越来越难维护。

---

## 19.2 项目结构（Next.js 示例）

```
dapp/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 全局布局（Provider）
│   ├── page.tsx                  # 首页
│   ├── gate/[id]/page.tsx        # 星门详情页
│   └── dashboard/page.tsx        # 管理面板
├── components/
│   ├── common/
│   │   ├── WalletButton.tsx
│   │   ├── TxStatus.tsx
│   │   └── LoadingSpinner.tsx
│   ├── gate/
│   │   ├── GateCard.tsx
│   │   ├── JumpPanel.tsx
│   │   └── TollInfo.tsx
│   └── market/
│       ├── ItemGrid.tsx
│       └── BuyButton.tsx
├── hooks/
│   ├── useGate.ts                # 星门数据
│   ├── useMarket.ts              # 市场数据
│   ├── useSponsoredAction.ts     # 赞助交易
│   └── useEvents.ts              # 实时事件
├── lib/
│   ├── sui.ts                    # SuiClient 实例
│   ├── contracts.ts              # 合约常量
│   ├── queries.ts                # GraphQL 查询
│   └── config.ts                 # 环境配置
├── store/
│   └── useAppStore.ts            # Zustand 全局状态
└── .env.local
```

### 目录结构的真正目的不是“好看”，而是防止职责蔓延

最常见的失控方式是：

- 组件里直接塞链上请求
- Hook 里直接写业务规则
- 页面里直接拼交易细节
- 全局 store 里塞一切状态

短期能跑，长期会很难改。

一个更稳的边界通常是：

- `components/` 负责展示和交互
- `hooks/` 负责页面级数据流
- `lib/` 负责底层客户端和查询封装
- `store/` 只放真正跨页面共享的本地 UI 状态

---

## 19.3 全局 Provider 配置

```
// app/layout.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit-react";
import { EveFrontierProvider } from "@evefrontier/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { EVE_VAULT_WALLET } from "@evefrontier/dapp-kit";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,    // 30 秒内不重新请求
      refetchInterval: false,
      retry: 2,
    },
  },
});

const networks = {
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networks} defaultNetwork="testnet">
            <WalletProvider wallets={[EVE_VAULT_WALLET]} autoConnect>
              <EveFrontierProvider>
                {children}
              </EveFrontierProvider>
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### Provider 链其实是在声明整套应用的运行时依赖顺序

这不是形式问题。顺序一旦错，常见后果包括：

- 钱包上下文拿不到 client
- Query cache 失效不按预期工作
- dapp-kit 读取不到需要的环境

所以全局 Provider 最好尽量稳定，不要在业务迭代中频繁改动。

---

## 19.4 状态管理（Zustand + React Query）

```
// store/useAppStore.ts
import { create } from "zustand";

interface AppStore {
  selectedGateId: string | null;
  txPending: boolean;
  txDigest: string | null;
  setSelectedGate: (id: string | null) => void;
  setTxPending: (pending: boolean) => void;
  setTxDigest: (digest: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  selectedGateId: null,
  txPending: false,
  txDigest: null,
  setSelectedGate: (id) => set({ selectedGateId: id }),
  setTxPending: (pending) => set({ txPending: pending }),
  setTxDigest: (digest) => set({ txDigest: digest }),
}));
```

```
// hooks/useGate.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentClient } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";

export function useGate(gateId: string) {
  const client = useCurrentClient();

  return useQuery({
    queryKey: ["gate", gateId],
    queryFn: async () => {
      const obj = await client.getObject({
        id: gateId,
        options: { showContent: true },
      });
      return obj.data?.content?.dataType === "moveObject"
        ? obj.data.content.fields
        : null;
    },
    refetchInterval: 15_000,
  });
}

export function useJumpGate(gateId: string) {
  const queryClient = useQueryClient();
  const { signAndExecuteSponsoredTransaction } = useSponsoredAction();

  return useMutation({
    mutationFn: async (characterId: string) => {
      const tx = new Transaction();
      tx.moveCall({
        target: `${TOLL_PACKAGE}::toll_gate_ext::pay_toll_and_get_permit`,
        arguments: [/* ... */],
      });
      return signAndExecuteSponsoredTransaction(tx);
    },
    onSuccess: () => {
      // 交易成功后使相关查询失效（触发重新加载）
      queryClient.invalidateQueries({ queryKey: ["gate", gateId] });
      queryClient.invalidateQueries({ queryKey: ["treasury"] });
    },
  });
}
```

### React Query 和 Zustand 不要混用职责

一个非常实用的分工是：

- **React Query** 管链上数据、远程数据、缓存、失效与重取
- **Zustand** 管本地 UI 状态，例如当前选中项、弹窗、临时输入

一旦把链上对象也塞进 Zustand，或者把纯 UI 状态硬塞进 Query cache，后面几乎一定会变乱。

### 一个成熟 dApp 至少有三层状态

1. **远程真相状态** 链上对象、索引结果、游戏服 API 返回
1. **本地交互状态** 表单、hover、loading、弹窗
1. **事务状态** 正在签名、已提交、已确认、失败

这三层状态更新节奏不同，不应该揉成一层。

---

## 19.5 实时数据推送

```
// hooks/useEvents.ts
import { useEffect, useRef, useState } from "react";
import { useCurrentClient } from "@mysten/dapp-kit-react";

export function useRealtimeEvents<T>(
  eventType: string,
  options?: { maxEvents?: number }
) {
  const client = useCurrentClient();
  const [events, setEvents] = useState<T[]>([]);
  const unsubRef = useRef<(() => void) | null>(null);
  const maxEvents = options?.maxEvents ?? 50;

  useEffect(() => {
    const subscribe = async () => {
      unsubRef.current = await client.subscribeEvent({
        filter: { MoveEventType: eventType },
        onMessage: (event) => {
          setEvents((prev) => [event.parsedJson as T, ...prev].slice(0, maxEvents));
        },
      });
    };

    subscribe();
    return () => { unsubRef.current?.(); };
  }, [client, eventType, maxEvents]);

  return events;
}

// 使用
function JumpFeed() {
  const jumps = useRealtimeEvents<{character_id: string; toll_paid: string}>(
    `${TOLL_PACKAGE}::toll_gate_ext::GateJumped`
  );

  return (
    <ul>
      {jumps.map((j, i) => (
        <li key={i}>
          {j.character_id.slice(0, 8)}... 支付 {Number(j.toll_paid) / 1e9} SUI
        </li>
      ))}
    </ul>
  );
}
```

### 实时流不要拿来替代完整数据加载

它更适合做：

- 增量 feed
- 提示和通知
- 局部活跃信息

而不是直接充当页面首屏数据源。更稳的策略通常是：

1. 页面先加载当前快照
1. 再接事件流补增量
1. 定时或按需做一致性刷新

---

## 19.6 错误处理与用户体验

```
// components/common/TxButton.tsx
import { useState } from "react";

interface TxButtonProps {
  onClick: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
}

export function TxButton({ onClick, children, disabled }: TxButtonProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setStatus("pending");
    setMessage("⏳ 提交中...");
    try {
      await onClick();
      setStatus("success");
      setMessage("✅ 交易成功！");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e: any) {
      setStatus("error");
      // 解析 Move abort 错误码为人类可读信息
      const abortCode = extractAbortCode(e.message);
      setMessage(`❌ ${translateError(abortCode) ?? e.message}`);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={disabled || status === "pending"}
        className={`tx-btn tx-btn--${status}`}
      >
        {status === "pending" ? "⏳ 处理中..." : children}
      </button>
      {message && <p className={`message message--${status}`}>{message}</p>}
    </div>
  );
}

// 将 Move abort 错误码翻译为友好提示
function translateError(code: number | null): string | null {
  const errors: Record<number, string> = {
    0: "权限不足，请确认钱包已连接",
    1: "余额不足",
    2: "物品已售出",
    3: "星门未上线",
  };
  return code !== null ? errors[code] ?? null : null;
}

function extractAbortCode(message: string): number | null {
  const match = message.match(/abort_code: (\d+)/);
  return match ? parseInt(match[1]) : null;
}
```

---

## 19.7 CI/CD 自动部署

```
# .github/workflows/deploy.yml
name: Deploy dApp

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
        env:
          VITE_SUI_RPC_URL: ${{ vars.TESTNET_RPC_URL }}
          VITE_WORLD_PACKAGE: ${{ vars.TESTNET_WORLD_PACKAGE }}
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-prod:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
        env:
          VITE_SUI_RPC_URL: ${{ vars.MAINNET_RPC_URL }}
          VITE_WORLD_PACKAGE: ${{ vars.MAINNET_WORLD_PACKAGE }}
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: "--prod"
```

---

## 🔖 本章小结

| 架构组件  | 技术选择                           | 职责        |
| ----- | ------------------------------ | --------- |
| UI 框架 | React + Next.js                | 页面渲染、路由   |
| 链上通信  | @mysten/dapp-kit + SuiClient   | 读链/签名/发交易 |
| 状态管理  | Zustand（全局） + React Query（服务端） | 缓存与同步     |
| 实时更新  | subscribeEvent（WebSocket）      | 事件推送      |
| 错误处理  | abort code 翻译 + 状态机            | 用户友好提示    |
| CI/CD | GitHub Actions + Vercel        | 自动测试与部署   |

## 35. Chapter 20: 游戏内 dApp 集成 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-20.html

# Chapter 20：游戏内 dApp 集成（浮层 UI 与事件通信）

**目标：** 掌握如何将你的 dApp 嵌入 EVE Frontier 游戏客户端作为悬浮面板，实现游戏内与链上数据的无缝交互，以及如何从游戏内发起签名请求而无需切换到外部浏览器。

---

状态：集成章节。正文以游戏内 WebView、浮层 UI 和事件通信为主。

## 20.1 两种 dApp 访问模式

EVE Frontier 支持两种访问你的 dApp 的方式：

********

| 模式    | 入口              | 适合场景           |
| ----- | --------------- | -------------- |
| 外部浏览器 | 玩家手动打开网页        | 管理面板、数据分析、设置页  |
| 游戏内浮层 | 游戏客户端内嵌 WebView | 交易弹窗、实时状态、战斗辅助 |

## 36. Chapter 21: 性能优化与 Gas 最小化 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-21.html

# Chapter 21：性能优化与 Gas 最小化

**目标：** 掌握链上操作的性能优化技巧，最大化利用链下计算，通过批处理、对象设计优化和 Gas 预算控制，构建高效低成本的 EVE Frontier 应用。

---

状态：工程章节。正文以 Gas、批处理和对象设计优化为主。

## 21.1 Gas 成本模型

Sui 的 Gas 由两部分组成：

```
Gas 费 = (计算单元 + 存储差额) × Gas 价格
```

- **计算单元**：Move 代码执行消耗
- **存储差额**：链上存储的净增量（新增字节收费，删除字节退款）

**关键洞察**：

- 读取数据是**免费的**（GraphQL/RPC 读取不上链）
- 动态字段的增删有显著 Gas 成本
- 发射事件几乎免费（不占用链上存储）

Gas 优化最容易走偏的一点是：很多人一上来就盯着“怎么省几个单位”，却没先看清：

真正昂贵的，往往不是某一行代码，而是你整个状态模型迫使系统反复做的那些事。

所以性能优化最好分三层看：

- **交易层** 这笔交易是否能合并、是否重复做了很多小动作
- **对象层** 你的对象是否过大、过热、过于集中
- **架构层** 哪些计算和聚合其实根本不该上链

### 21.1.1 一组可以复用的 Gas 对比记录模板

这一章最容易流于口号。建议至少拿一组固定操作记录“优化前/后”数据：

| 操作          | 低效写法           | 优化写法        | 你要记录的字段             |
| ----------- | -------------- | ----------- | ------------------- |
| 两个星门上线 + 链接 | 3 笔独立交易        | 1 笔 PTB 批处理 | `gasUsed`、对象写入数、总耗时 |
| 市场创建挂单      | 大对象追加 `vector` | 独立对象或动态字段   | 对象大小、写入次数、存储退款      |
| 历史记录        | 持久化到共享对象       | 改发事件 + 链下索引 | 事件数、对象增长字节          |

## 37. Chapter 22: Move 高级模式 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-22.html

# Chapter 22：Move 高级模式 — 升级兼容性设计

**目标：** 掌握生产级 Move 合约的升级兼容架构，包括版本化 API、数据迁移、Policy 控制，以及在不中断服务的情况下平滑升级。

---

状态：设计进阶章节。正文以升级兼容、迁移和时间锁控制为主。

## 22.1 升级兼容性问题的本质

Move 合约升级面临两个核心约束：

```
约束1：结构体定义不可修改（不能加/删字段，不能改字段类型）
约束2：函数签名不可修改（参数和返回值不能变）

BUT：
✅ 可以添加新函数
✅ 可以添加新模块
✅ 可以修改函数内部逻辑（不变签名）
✅ 可以添加新结构体
```

**挑战**：如果你的合约 v1 有个 `Market` 结构体，v2 想增加一个 `expiry_ms` 字段，你不能直接修改。

升级兼容这一章真正要解决的，不是“怎么发新版本”，而是：

怎么让一个已经被对象、前端、脚本、用户共同依赖的系统继续活下去。

所以升级问题本质上是四层兼容问题：

- 链上对象兼容
- 链上接口兼容
- 前端解析兼容
- 运维流程兼容

---

## 22.2 扩展模式：用动态字段追加“未来字段“

**最佳实践**：预先为未来字段留下扩展空间：

```
module my_market::market_v1;

/// 当前字段
public struct Market has key {
    id: UID,
    toll: u64,
    owner: address,
    // 注意：不要试图预测未来需要的字段——因为你改不了
    // 而是依赖动态字段做扩展
}

// V1 → V2：用动态字段追加 expiry_ms
// （升级包发布后，在迁移脚本中调用）
public fun add_expiry_field(
    market: &mut Market,
    expiry_ms: u64,
) {
    // 如果还没有这个字段，才添加
    if !df::exists_(&market.id, b"expiry_ms") {
        df::add(&mut market.id, b"expiry_ms", expiry_ms);
    }
}

/// V2 版本读取 expiry（向后兼容：旧对象没有这个字段时返回默认值）
public fun get_expiry(market: &Market): u64 {
    if df::exists_(&market.id, b"expiry_ms") {
        *df::borrow<vector<u8>, u64>(&market.id, b"expiry_ms")
    } else {
        0  // 默认永不过期
    }
}
```

### 动态字段为什么会成为升级逃生口？

因为它让你在不改原始 struct 布局的前提下，给旧对象补充新语义。

但它也有边界：

- 适合追加字段
- 不适合把所有未来复杂结构都硬塞进去

如果一个版本升级需要往对象上拼很多临时字段，那通常说明你该重新思考模型，而不是无限依赖补丁式扩展。

---

## 22.3 版本化 API 设计

当你需要改变函数行为时，保留旧版本，添加新版本：

```
module my_market::market;

/// V1 API（永远保持向后兼容）
public fun buy_item_v1(
    market: &mut Market,
    payment: Coin<SUI>,
    item_type_id: u64,
    ctx: &mut TxContext,
): Item {
    // 原始逻辑
}

/// V2 API（新功能：支持折扣码）
public fun buy_item_v2(
    market: &mut Market,
    payment: Coin<SUI>,
    item_type_id: u64,
    discount_code: Option<vector<u8>>,  // 新参数
    clock: &Clock,                       // 新参数（时效验证）
    ctx: &mut TxContext,
): Item {
    // 新逻辑（包含折扣处理）
    let effective_price = apply_discount(market, item_type_id, discount_code, clock);
    // ...
}
```

**dApp 端适配**：在 TypeScript 端检查合约版本，选择调用哪个函数：

```
async function buyItem(useV2: boolean, ...) {
  const tx = new Transaction();

  if (useV2) {
    tx.moveCall({ target: `${PKG}::market::buy_item_v2`, ... });
  } else {
    tx.moveCall({ target: `${PKG}::market::buy_item_v1`, ... });
  }
}
```

### 为什么“保留旧入口”往往比“强迫全部迁移”更稳？

因为线上系统的调用方从来不只有你自己：

- 旧前端还在跑
- 用户脚本可能还在用
- 第三方聚合器可能还没升级

所以最稳的升级路径往往不是“一刀切替换”，而是：

1. 新旧并存
1. 给迁移窗口
1. 逐步下线旧接口

---

## 22.4 升级锁定策略

对于高价值合约，可以在 UpgradeCap 上增加时间锁：

```
module my_gov::upgrade_timelock;

use sui::package::UpgradeCap;
use sui::clock::Clock;

public struct TimelockWrapper has key {
    id: UID,
    upgrade_cap: UpgradeCap,
    delay_ms: u64,           // 升级需要提前公告的等待时间
    announced_at_ms: u64,    // 公告时间（0 = 未公告）
}

/// 第一步：公告升级意图（开始计时）
public fun announce_upgrade(
    wrapper: &mut TimelockWrapper,
    _admin: &AdminCap,
    clock: &Clock,
) {
    assert!(wrapper.announced_at_ms == 0, EAlreadyAnnounced);
    wrapper.announced_at_ms = clock.timestamp_ms();
}

/// 第二步：等待延迟期后才能执行升级
public fun authorize_upgrade(
    wrapper: &mut TimelockWrapper,
    clock: &Clock,
): &mut UpgradeCap {
    assert!(wrapper.announced_at_ms > 0, ENotAnnounced);
    assert!(
        clock.timestamp_ms() >= wrapper.announced_at_ms + wrapper.delay_ms,
        ETimelockNotExpired,
    );
    // 重置，下次升级需要重新公告
    wrapper.announced_at_ms = 0;
    &mut wrapper.upgrade_cap
}
```

### TimeLock 真正保护的不是代码，而是信任关系

它给社区、协作者和用户留出了观察窗口，让升级不至于变成“管理员今晚想改什么就改什么”。

这在高价值协议里非常关键，因为升级风险很多时候不是技术 bug，而是治理风险。

---

## 22.5 大规模数据迁移策略

当需要重建存储结构时，采用“增量迁移“而不是“一次性迁移“：

```
// 场景：将 ListingsV1（vector）迁移为 ListingsV2（Table）
module migration::market_migration;

public struct MigrationState has key {
    id: UID,
    migrated_count: u64,
    total_count: u64,
    is_complete: bool,
}

/// 每次迁移一批（避免一笔交易超出计算限制）
public fun migrate_batch(
    old_market: &mut MarketV1,
    new_market: &mut MarketV2,
    state: &mut MigrationState,
    batch_size: u64,         // 每次处理 batch_size 条记录
    ctx: &TxContext,
) {
    let start = state.migrated_count;
    let end = min(start + batch_size, state.total_count);
    let mut i = start;

    while (i < end) {
        let listing = get_listing_v1(old_market, i);
        insert_listing_v2(new_market, listing);
        i = i + 1;
    };

    state.migrated_count = end;
    if end == state.total_count {
        state.is_complete = true;
    };
}
```

**迁移脚本：自动循环执行直到完成**

```
async function runMigration(stateId: string) {
  let isComplete = false;
  let batchNum = 0;

  while (!isComplete) {
    const tx = new Transaction();
    tx.moveCall({
      target: `${MIGRATION_PKG}::market_migration::migrate_batch`,
      arguments: [/* ... */, tx.pure.u64(100)], // 每批 100 条
    });

    const result = await client.signAndExecuteTransaction({ signer: adminKeypair, transaction: tx });
    console.log(`Batch ${++batchNum} done:`, result.digest);

    // 检查迁移状态
    const state = await client.getObject({ id: stateId, options: { showContent: true } });
    isComplete = (state.data?.content as any)?.fields?.is_complete;

    await new Promise(r => setTimeout(r, 1000)); // 间隔 1 秒
  }

  console.log("迁移完成！");
}
```

### 为什么迁移最好增量做，而不是一把梭？

因为真实线上系统里，你通常要同时平衡：

- 计算上限
- 风险可控
- 失败可恢复
- 迁移期间服务还能继续运行

一次性迁移最大的问题不是写不出来，而是：

- 中途失败很难恢复
- 失败后状态容易半新半旧
- 交易太大时根本发不出去

---

## 22.6 升级完整工作流

```
① 开发新版本合约（本地 + testnet 验证）
② 声明升级意图（TimeLock 开始计时，通知社区）
③ 社区审查期（72 小时）
④ TimeLock 到期后，执行 sui client upgrade --upgrade-capability <CAP_ID>
⑤ 运行数据迁移脚本（如有必要）
⑥ 更新 dApp 配置（新 Package ID、新接口版本）
⑦ 公告升级完成
```

### 一个成熟团队会把升级视为一次“受控发布事件”

也就是说，除了链上动作本身，还应该同步准备：

- 升级公告
- 前端切换计划
- 回滚或停机预案
- 升级后观察指标

否则“链上已经升级完成”并不等于“系统已经稳定完成升级”。

---

## 🔖 本章小结

| 知识点         | 核心要点                                  |
| ----------- | ------------------------------------- |
| 升级约束        | 结构体/函数签名不可改，但可加新函数/模块                 |
| 动态字段扩展      | `df::add()` 在运行时追加“未来字段“              |
| 版本化 API     | `buy_v1()` / `buy_v2()` 并存，dApp 按版本选择 |
| TimeLock 升级 | 公告 + 等待期 → 社区审查 → 才能执行                |
| 增量迁移        | `migrate_batch()` 分批处理，避免超出计算限制       |

## 38. Chapter 23: 发布、维护与社区协作 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-23.html

# Chapter 23：发布、维护与社区协作

**目标：** 掌握从开发到上线的完整发布流程，理解 Builder 生态的边界与定位，成为可持续活跃的 EVE Frontier 构建者。

---

状态：发布与运营章节。正文以上线流程、维护和 Builder 协作为主。

## 23.1 发布 checklist 全览

从本地开发到正式上线，需要经历以下阶段：

```
Phase 1 —— 本地开发（Localnet）
  ✅ Docker 本地链运行
  ✅ Move build 编译通过
  ✅ 单元测试全部通过
  ✅ 功能测试（脚本模拟完整流程）

Phase 2 —— 测试网（Testnet）
  ✅ sui client publish 到 testnet
  ✅ 扩展注册到测试组件
  ✅ dApp 部署到测试 URL
  ✅ 邀请小范围用户测试

Phase 3 —— 主网发布（Mainnet）
  ✅ 代码审计（自审 + 社区审查）
  ✅ 备份 UpgradeCap 到安全地址
  ✅ sui client switch --env mainnet
  ✅ 发布合约，记录 Package ID
  ✅ dApp 发布到正式域名
  ✅ 通知社区 / 更新公告
```

这张 checklist 本身没有问题，但真正要建立的是一个观念：

发布不是“代码从本地搬到链上”，而是“把一个真实会被人使用和依赖的服务切到生产状态”。

所以发布要同时覆盖四条线：

- **合约线** 包有没有发对、权限有没有配对
- **前端线** dApp 是否连到正确网络和对象
- **运营线** 用户知不知道新版本怎么用、旧入口是否失效
- **应急线** 出故障时谁处理、先停哪一层

---

## 23.2 网络环境配置

Sui 和 EVE Frontier 支持三个网络：

************

| 网络       | 用途             | RPC 地址                                |
| -------- | -------------- | ------------------------------------- |
| localnet | 本地开发，Docker 启动 | `http://127.0.0.1:9000`               |
| testnet  | 公开测试，无真实价值     | `https://fullnode.testnet.sui.io:443` |
| mainnet  | 正式生产环境         | `https://fullnode.mainnet.sui.io:443` |

## 39. Chapter 24: 故障排查手册 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-24.html

# Chapter 24：故障排查手册（常见错误与调试方法）

**目标：** 系统整理 EVE Frontier Builder 开发过程中最常遇到的错误类型，掌握高效的调试工作流，把“踩坑“时间降到最低。

---

状态：工程保障章节。正文以排错路径和调试习惯为主。

## 24.1 错误分类总览

```
EVE Frontier 开发错误
├── 合约错误（Move）
│   ├── 编译错误（构建失败）
│   ├── 链上 Abort（运行时失败）
│   └── 逻辑错误（成功执行但结果错误）
├── 交易错误（Sui）
│   ├── Gas 问题
│   ├── 对象版本冲突
│   └── 权限错误
├── dApp 错误（TypeScript/React）
│   ├── 钱包连接失败
│   ├── 读取链上数据失败
│   └── 参数构建错误
└── 环境错误
    ├── Docker/本地节点问题
    ├── Sui CLI 配置问题
    └── ENV 变量缺失
```

真正高效的排错，不是背错误大全，而是先把问题定位到正确层。

一个很实用的思路是先问：

1. 这是编译前就坏了，还是链上执行时坏了？
1. 是对象和权限错了，还是前端构参错了？
1. 是环境不一致，还是逻辑本身真的有 bug？

只要第一层归类做对，后面的排查效率会高很多。

---

## 24.2 Move 编译错误

### 错误：`unbound module`

```
error[E02001]: unbound module
  ┌─ sources/my_ext.move:3:5
  │
3 │ use world::gate;
  │     ^^^^^^^^^^^ Unbound module 'world::gate'
```

**原因**：`Move.toml` 中缺少对 `world` 包的依赖声明。

**解决：**

```
# Move.toml
[dependencies]
World = { git = "https://github.com/evefrontier/world-contracts.git", subdir = "contracts/world", rev = "v0.0.14" }
```

---

### 错误：`ability constraint not satisfied`

```
error[E05001]: ability constraint not satisfied
   ┌─ sources/market.move:42:30
   |
42 │     transfer::public_transfer(listing, recipient);
   |                               ^^^^^^^ Missing 'store' ability
```

**原因**：`Listing` 结构体缺少 `store` ability，无法被 `public_transfer`。

**解决**：

```
// 添加所需 ability
public struct Listing has key, store { ... }
//                            ^^^^^
```

---

### 错误：`unused variable` / `unused let binding`

```
warning[W09001]: unused let binding
  = 'receipt' is bound but not used
```

**解决**：用下划线忽略，或确认是否遗漏了归还步骤（Borrow-Use-Return 模式）：

```
let (_receipt) = character::borrow_owner_cap(...); // 暂时忽略
// 更好的做法：确认归还
character::return_owner_cap(own_cap, receipt);
```

### 对编译错误最有用的习惯

不是复制粘贴报错去搜，而是立刻判断它属于哪一类：

- **依赖解析问题**`unbound module`
- **类型 / ability 问题**`ability constraint not satisfied`
- **资源生命周期问题**`unused let binding`、值未消费、借用冲突

Move 编译器给的错误往往已经很接近真实原因，只要别把它当成纯噪音。

---

## 24.3 链上 Abort 错误解读

链上 Abort 返回如下格式：

```
MoveAbort(MoveLocation { module: ModuleId { address: 0x..., name: Identifier("toll_gate_ext") }, function: 2, instruction: 6, function_name: Some("pay_toll") }, 1)
```

**关键信息**：`function_name` + abort code（末尾的数字）。

### 常见 Abort Code 对照表

| 错误代码 | 典型含义                                   | 排查方向                              |
| ---- | -------------------------------------- | --------------------------------- |
| `0`  | 权限不足（`assert!(ctx.sender() == owner)`） | 检查调用者地址 vs 合约中存储的 owner           |
| `1`  | 余额/数量不足                                | 检查 `coin::value()` vs 所需金额        |
| `2`  | 对象已存在（`table::add` 重复键）                | 检查是否已注册/已购买过                      |
| `3`  | 对象不存在（`table::borrow` 找不到）             | 检查 key 是否正确                       |
| `4`  | 时间校验失败（过期 / 未到时间）                      | `clock.timestamp_ms()` 与合约逻辑对比    |
| `5`  | 状态不正确（如已结束、未开始）                        | 检查 `is_settled`、`is_online` 等状态字段 |

## 40. Chapter 25: 从 Builder 到产品 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-25.html

# Chapter 25：从 Builder 到产品——商业化路径与生态运营

**目标：** 超越技术层面，理解如何将你的 EVE Frontier 合约和 dApp 打造成有用户、有收入、有社区的真实产品，以及如何在这个新兴生态中找到自己的定位。

---

状态：产品章节。正文以商业模式、增长和运营机制为主。

## 25.1 Builder 的四种商业模式

在 EVE Frontier 生态中，Builder 有四种主要的价值捕获方式：

```
┌─────────────────────────────────────────────────────────┐
│               Builder 商业模式图谱                       │
├─────────────────┬───────────────────────────────────────┤
│ 模式            │ 代表案例               │ 收入来源      │
├─────────────────┼───────────────────────┼──────────────┤
│ 基础设施        │ 星门收费、存储市场      │ 使用费（自动）│
│ Infrastructure  │ 通用拍卖平台           │              │
├─────────────────┼───────────────────────┼──────────────┤
│ 代币经济        │ 联盟 Token + DAO       │ 代币升值、税  │
│ Token Economy   │ 点数系统               │              │
├─────────────────┼───────────────────────┼──────────────┤
│ 平台/SaaS       │ 多租户市场框架         │ 平台抽成      │
│ Platform        │ 竞赛系统框架           │ 月费/注册费   │
├─────────────────┼───────────────────────┼──────────────┤
│ 数据服务        │ 排行榜、分析面板       │ 广告/订阅     │
│ Data & Tools    │ 价格聚合器             │ 增值服务      │
└─────────────────┴───────────────────────┴──────────────┘
```

这张图最重要的不是帮你“选一个赛道名词”，而是看清：

你到底是在卖资产、卖流量、卖协议能力，还是卖信息优势。

很多 Builder 项目做不起来，不是技术不行，而是一开始就没想清楚自己卖的是什么。

---

## 25.2 定价策略：链上自动收入

最简单的 Builder 收入：**交易自动抽佣**，零运营成本。

### 双层费率结构

```
// 结算时：平台费 + Builder 费双层结构
public fun settle_sale(
    market: &mut Market,
    sale_price: u64,
    mut payment: Coin<SUI>,
    ctx: &mut TxContext,
): Coin<SUI> {
    // 1. 平台协议费（EVE Frontier 官方，如果有的话）
    let protocol_fee = sale_price * market.protocol_fee_bps / 10_000;

    // 2. 你的 Builder 费
    let builder_fee = sale_price * market.builder_fee_bps / 10_000;    // 例：200 = 2%

    // 3. 剩余给卖家
    let seller_amount = sale_price - protocol_fee - builder_fee;

    // 分配
    transfer::public_transfer(payment.split(builder_fee, ctx), market.fee_recipient);
    // ... 协议费到官方地址，剩余给卖家

    payment // 返回 seller_amount
}
```

### 费率范围建议

| 类型      | 建议区间       | 说明                |
| ------- | ---------- | ----------------- |
| 星门通行费   | 5-50 SUI/次 | 固定费，体现稀缺性         |
| 市场佣金    | 1-3%       | 对标传统市场            |
| 拍卖平台费   | 2-5%       | 提供的撮合服务           |
| 多租户平台月费 | 10-100 SUI | 其他 Builder 使用你的框架 |

## 41. Example 5: 联盟 DAO - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-05.html

# 实战案例 5：联盟代币与自动分红系统

**目标：** 发行联盟专属 Coin（`ALLY Token`），构建一套自动分红合约——联盟运营的设施收入自动按持仓比例分配给代币持有者——并附带治理面板 dApp。

---

状态：教学示例。仓库内已有联盟代币、金库和治理源码，重点在理解资金流与治理流如何并存。

## 对应代码目录

- [example-05](https://hoh-zone.github.io/eve-bootcamp/code/example-05)
- [example-05/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-05/dapp)

## 最小调用链

`发行 ALLY Token -> 收入汇入金库 -> 按持仓分红 -> 发起提案 -> 成员投票`

## 需求分析

**场景：** 你的联盟同时运营多个星门收费站和存储箱市场，收入来自多个渠道。你希望：

- 💎 发行 `ALLY Token`（总量 1,000,000），按贡献分配给联盟成员
- 🏦 所有设施收入统一汇入联盟金库（Treasury）
- 💸 持有 `ALLY Token` 的成员，按持仓比例定期领取分红
- 🗳 Token 持有者可对联盟重大决策（如费率调整）投票
- 📊 治理面板显示金库余额、分红历史、提案列表

---

## 第一部分：联盟代币合约

```
module ally_dao::ally_token;

use sui::coin::{Self, Coin, TreasuryCap, CoinMetadata};
use sui::transfer;
use sui::tx_context::TxContext;

/// 一次性见证（One-Time Witness）
public struct ALLY_TOKEN has drop {}

fun init(witness: ALLY_TOKEN, ctx: &mut TxContext) {
    let (treasury_cap, coin_metadata) = coin::create_currency(
        witness,
        6,                          // 精度：6位小数
        b"ALLY",                    // 符号
        b"Alliance Token",          // 名称
        b"Governance and dividend token for Alliance X",
        option::none(),
        ctx,
    );

    // TreasuryCap 赋予联盟 DAO 合约（通过地址或多签）
    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_freeze_object(coin_metadata); // 元数据不可变
}

/// 铸造（由 DAO 合约控制，不直接暴露给外部）
public fun internal_mint(
    treasury: &mut TreasuryCap<ALLY_TOKEN>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let coin = coin::mint(treasury, amount, ctx);
    transfer::public_transfer(coin, recipient);
}
```

---

## 第二部分：DAO 金库与分红合约

```
module ally_dao::treasury;

use ally_dao::ally_token::ALLY_TOKEN;
use sui::coin::{Self, Coin, TreasuryCap};
use sui::balance::{Self, Balance};
use sui::object::{Self, UID, ID};
use sui::table::{Self, Table};
use sui::event;
use sui::transfer;
use sui::tx_context::TxContext;
use sui::sui::SUI;

// ── 数据结构 ──────────────────────────────────────────────

/// 联盟金库
public struct AllianceTreasury has key {
    id: UID,
    sui_balance: Balance<SUI>,          // 等待分配的 SUI
    total_distributed: u64,             // 历史累计分红总额
    distribution_index: u64,            // 当前分红轮次
    total_ally_supply: u64,             // 当前 ALLY Token 流通总量
}

/// 分红领取凭证（记录每个持有者已领到哪一轮）
public struct DividendClaim has key, store {
    id: UID,
    holder: address,
    last_claimed_index: u64,
}

/// 提案（治理）
public struct Proposal has key {
    id: UID,
    proposer: address,
    description: vector<u8>,
    vote_yes: u64,      // 赞成票（ALLY Token 数量加权）
    vote_no: u64,       // 反对票
    deadline_ms: u64,
    executed: bool,
}

/// 分红快照（每次分红创建一个）
public struct DividendSnapshot has store {
    amount_per_token: u64,  // 每个 ALLY Token 对应的 SUI 数量（以最小精度计）
    total_supply_at_snapshot: u64,
}

// ── 事件 ──────────────────────────────────────────────────

public struct DividendDistributed has copy, drop {
    treasury_id: ID,
    total_amount: u64,
    per_token_amount: u64,
    distribution_index: u64,
}

public struct DividendClaimed has copy, drop {
    holder: address,
    amount: u64,
    rounds: u64,
}

// ── 初始化 ────────────────────────────────────────────────

public fun create_treasury(
    total_ally_supply: u64,
    ctx: &mut TxContext,
) {
    let treasury = AllianceTreasury {
        id: object::new(ctx),
        sui_balance: balance::zero(),
        total_distributed: 0,
        distribution_index: 0,
        total_ally_supply,
    };
    transfer::share_object(treasury);
}

// ── 收入存入 ──────────────────────────────────────────────

/// 任何合约（星门、市场等）都可以向金库存入收入
public fun deposit_revenue(treasury: &mut AllianceTreasury, coin: Coin<SUI>) {
    balance::join(&mut treasury.sui_balance, coin::into_balance(coin));
}

// ── 触发分红 ──────────────────────────────────────────────

/// 管理员触发：将当前金库余额按比例准备分红
/// 需要存储每轮的快照
public fun trigger_distribution(
    treasury: &mut AllianceTreasury,
    ctx: &TxContext,
) {
    let total = balance::value(&treasury.sui_balance);
    assert!(total > 0, ENoBalance);
    assert!(treasury.total_ally_supply > 0, ENoSupply);

    // 每个 Token 分到多少（以最小精度，即乘以 1e6 避免精度损失）
    let per_token_scaled = total * 1_000_000 / treasury.total_ally_supply;

    treasury.distribution_index = treasury.distribution_index + 1;
    treasury.total_distributed = treasury.total_distributed + total;

    // 存储快照到动态字段
    sui::dynamic_field::add(
        &mut treasury.id,
        treasury.distribution_index,
        DividendSnapshot {
            amount_per_token: per_token_scaled,
            total_supply_at_snapshot: treasury.total_ally_supply,
        }
    );

    event::emit(DividendDistributed {
        treasury_id: object::id(treasury),
        total_amount: total,
        per_token_amount: per_token_scaled,
        distribution_index: treasury.distribution_index,
    });
}

// ── 持有者领取分红 ────────────────────────────────────────

/// 持有者提供自己的 ALLY Token（不消耗，只读取数量）来领取分红
public fun claim_dividends(
    treasury: &mut AllianceTreasury,
    ally_coin: &Coin<ALLY_TOKEN>,    // 持有者的 ALLY Token（只读）
    claim_record: &mut DividendClaim,
    ctx: &mut TxContext,
) {
    assert!(claim_record.holder == ctx.sender(), ENotHolder);

    let holder_balance = coin::value(ally_coin);
    assert!(holder_balance > 0, ENoAllyTokens);

    let from_index = claim_record.last_claimed_index + 1;
    let to_index = treasury.distribution_index;
    assert!(from_index <= to_index, ENothingToClaim);

    let mut total_claim: u64 = 0;
    let mut i = from_index;

    while (i <= to_index) {
        let snapshot: &DividendSnapshot = sui::dynamic_field::borrow(
            &treasury.id, i
        );
        // 按持仓比例计算（反缩放）
        total_claim = total_claim + (holder_balance * snapshot.amount_per_token / 1_000_000);
        i = i + 1;
    };

    assert!(total_claim > 0, ENothingToClaim);

    claim_record.last_claimed_index = to_index;
    let payout = sui::coin::take(&mut treasury.sui_balance, total_claim, ctx);
    transfer::public_transfer(payout, ctx.sender());

    event::emit(DividendClaimed {
        holder: ctx.sender(),
        amount: total_claim,
        rounds: to_index - from_index + 1,
    });
}

/// 创建领取凭证（每个持有者创建一次）
public fun create_claim_record(ctx: &mut TxContext) {
    let record = DividendClaim {
        id: object::new(ctx),
        holder: ctx.sender(),
        last_claimed_index: 0,
    };
    transfer::transfer(record, ctx.sender());
}

const ENoBalance: u64 = 0;
const ENoSupply: u64 = 1;
const ENotHolder: u64 = 2;
const ENoAllyTokens: u64 = 3;
const ENothingToClaim: u64 = 4;
```

---

## 第三部分：治理投票合约

```
module ally_dao::governance;

use ally_dao::ally_token::ALLY_TOKEN;
use sui::coin::Coin;
use sui::object::{Self, UID};
use sui::clock::Clock;
use sui::transfer;
use sui::event;

public struct Proposal has key {
    id: UID,
    proposer: address,
    description: vector<u8>,
    vote_yes: u64,
    vote_no: u64,
    deadline_ms: u64,
    executed: bool,
}

/// 创建提案（需要持有最少 1000 ALLY Token）
public fun create_proposal(
    ally_coin: &Coin<ALLY_TOKEN>,
    description: vector<u8>,
    voting_duration_ms: u64,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // 需要持有足够代币才能发起提案
    assert!(sui::coin::value(ally_coin) >= 1_000_000_000, EInsufficientToken); // 1000 ALLY

    let proposal = Proposal {
        id: object::new(ctx),
        proposer: ctx.sender(),
        description,
        vote_yes: 0,
        vote_no: 0,
        deadline_ms: clock.timestamp_ms() + voting_duration_ms,
        executed: false,
    };

    transfer::share_object(proposal);
}

/// 投票（用 ALLY Token 数量加权）
public fun vote(
    proposal: &mut Proposal,
    ally_coin: &Coin<ALLY_TOKEN>,
    support: bool,
    clock: &Clock,
    _ctx: &TxContext,
) {
    assert!(clock.timestamp_ms() < proposal.deadline_ms, EVotingEnded);

    let weight = sui::coin::value(ally_coin);
    if support {
        proposal.vote_yes = proposal.vote_yes + weight;
    } else {
        proposal.vote_no = proposal.vote_no + weight;
    };
}

const EInsufficientToken: u64 = 0;
const EVotingEnded: u64 = 1;
```

---

## 第四部分：治理面板 dApp

```
// src/GovernanceDashboard.tsx
import { useState, useEffect } from 'react'
import { useConnection, getObjectWithJson, executeGraphQLQuery } from '@evefrontier/dapp-kit'
import { useDAppKit } from '@mysten/dapp-kit-react'
import { Transaction } from '@mysten/sui/transactions'

const DAO_PACKAGE = "0x_DAO_PACKAGE_"
const TREASURY_ID = "0x_TREASURY_ID_"

interface TreasuryInfo {
  sui_balance: string
  total_distributed: string
  distribution_index: string
  total_ally_supply: string
}

interface Proposal {
  id: string
  description: string
  vote_yes: string
  vote_no: string
  deadline_ms: string
  executed: boolean
}

export function GovernanceDashboard() {
  const { isConnected, handleConnect, currentAddress } = useConnection()
  const dAppKit = useDAppKit()
  const [treasury, setTreasury] = useState<TreasuryInfo | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [allyBalance, setAllyBalance] = useState<number>(0)
  const [claimRecordId, setClaimRecordId] = useState<string | null>(null)
  const [status, setStatus] = useState('')

  // 加载金库数据
  useEffect(() => {
    getObjectWithJson(TREASURY_ID).then(obj => {
      if (obj?.content?.dataType === 'moveObject') {
        setTreasury(obj.content.fields as TreasuryInfo)
      }
    })
  }, [])

  // 领取分红
  const claimDividends = async () => {
    if (!claimRecordId) {
      setStatus('⚠️ 请先创建领取凭证')
      return
    }
    const tx = new Transaction()
    tx.moveCall({
      target: `${DAO_PACKAGE}::treasury::claim_dividends`,
      arguments: [
        tx.object(TREASURY_ID),
        tx.object('ALLY_COIN_ID'), // 用户的 ALLY Coin 对象 ID
        tx.object(claimRecordId),
      ],
    })
    try {
      const r = await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus(`✅ 分红已领取！ ${r.digest.slice(0, 12)}...`)
    } catch (e: any) {
      setStatus(`❌ ${e.message}`)
    }
  }

  // 投票
  const vote = async (proposalId: string, support: boolean) => {
    const tx = new Transaction()
    tx.moveCall({
      target: `${DAO_PACKAGE}::governance::vote`,
      arguments: [
        tx.object(proposalId),
        tx.object('ALLY_COIN_ID'), // 用户的 ALLY Coin 对象 ID
        tx.pure.bool(support),
        tx.object('0x6'), // Clock
      ],
    })
    try {
      await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus(`✅ 投票成功`)
    } catch (e: any) {
      setStatus(`❌ ${e.message}`)
    }
  }

  return (
    <div className="governance-dashboard">
      <header>
        <h1>🏛 联盟 DAO 治理中心</h1>
        {!isConnected
          ? <button onClick={handleConnect}>连接钱包</button>
          : <span>✅ {currentAddress?.slice(0, 8)}...</span>
        }
      </header>

      {/* 金库状态 */}
      <section className="treasury-panel">
        <h2>💰 联盟金库</h2>
        <div className="stats-grid">
          <div className="stat">
            <span className="label">当前余额</span>
            <span className="value">
              {((Number(treasury?.sui_balance ?? 0)) / 1e9).toFixed(2)} SUI
            </span>
          </div>
          <div className="stat">
            <span className="label">历史分红总额</span>
            <span className="value">
              {((Number(treasury?.total_distributed ?? 0)) / 1e9).toFixed(2)} SUI
            </span>
          </div>
          <div className="stat">
            <span className="label">分红轮次</span>
            <span className="value">{treasury?.distribution_index ?? '-'}</span>
          </div>
          <div className="stat">
            <span className="label">你的 ALLY 持仓</span>
            <span className="value">{(allyBalance / 1e6).toFixed(2)} ALLY</span>
          </div>
        </div>
        <button className="claim-btn" onClick={claimDividends} disabled={!isConnected}>
          💸 领取待领分红
        </button>
      </section>

      {/* 治理提案 */}
      <section className="proposals-panel">
        <h2>🗳 当前提案</h2>
        {proposals.length === 0
          ? <p>暂无进行中的提案</p>
          : proposals.map(p => {
            const total = Number(p.vote_yes) + Number(p.vote_no)
            const yesPct = total > 0 ? Math.round(Number(p.vote_yes) * 100 / total) : 0
            const expired = Date.now() > Number(p.deadline_ms)
            return (
              <div key={p.id} className="proposal-card">
                <p className="proposal-desc">{p.description}</p>
                <div className="vote-bar">
                  <div className="yes-bar" style={{ width: `${yesPct}%` }} />
                </div>
                <div className="vote-stats">
                  <span>✅ {(Number(p.vote_yes) / 1e6).toFixed(0)} ALLY</span>
                  <span>❌ {(Number(p.vote_no) / 1e6).toFixed(0)} ALLY</span>
                </div>
                {!expired && !p.executed && (
                  <div className="vote-actions">
                    <button onClick={() => vote(p.id, true)}>👍 支持</button>
                    <button onClick={() => vote(p.id, false)}>👎 反对</button>
                  </div>
                )}
                {expired && <span className="badge">投票结束</span>}
              </div>
            )
          })
        }
      </section>

      {status && <div className="status-bar">{status}</div>}
    </div>
  )
}
```

---

## 🎯 完整回顾

```
Move 合约层
├── ally_token.move          → 发行 ALLY_TOKEN（总量受 TreasuryCap 控制）
├── treasury.move
│   ├── AllianceTreasury     → 共享金库对象，接收多渠道收入
│   ├── DividendClaim        → 持有者的领取凭证（记录已领轮次）
│   ├── deposit_revenue()    ← 星门/市场合约调用
│   ├── trigger_distribution() ← 管理员触发，按快照准备分红
│   └── claim_dividends()    ← 持有者自助领取
└── governance.move
    ├── Proposal             → 治理提案共享对象
    ├── create_proposal()    ← 持有 1000+ ALLY 才能发起
    └── vote()               ← ALLY 持量加权投票

与其他设施集成
└── 在 example-02 的 toll_gate.move 中调用
    treasury::deposit_revenue(alliance_treasury, fee_coin)
    → 星门收费直接进入联盟金库

dApp 层
└── GovernanceDashboard.tsx
    ├── 金库余额与分红历史统计
    ├── 一键领取分红
    └── 提案列表 + 投票
```

---

## 🔧 扩展练习

1. **防双投**：一次分红周期内每个地址只能投一票（在 proposal 上维护 `voted_addresses: Table<address, bool>`）
1. **锁仓增益**：持仓超过 30 天的地址，分红加权 1.2x（需要存储持仓时间戳）
1. **多资产支持**：金库同时接受 SUI 和 LUX，分红也按比例两种代币发放
1. **自动执行提案**：提案通过后，合约自动执行修改费率等操作（需 Governor 多签）

---

## 📚 关联文档

- [Chapter 14：链上经济系统设计](https://hoh-zone.github.io/eve-bootcamp/chapter-14.html)
- [Chapter 12：动态字段与事件](https://hoh-zone.github.io/eve-bootcamp/chapter-12.html)
- [Sui Coin 标准](https://docs.sui.io/guides/developer/sui-101/create-coin)
- [Example 2: 星门收费站](https://hoh-zone.github.io/eve-bootcamp/example-02.html)（收入来源）

## 42. Example 12: 联盟招募 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-12.html

# 实战案例 12：联盟招募系统（申请→投票→批准）

**目标：** 构建完整的联盟加入流程：候选人提交申请 → 现有成员投票 → 达到阈值自动批准并发放成员 NFT；也可设置创始人一票否决权。

---

状态：教学示例。正文展示联盟招募的最小业务闭环，完整代码以 `book/src/code/example-12/` 为准。

## 对应代码目录

- [example-12](https://hoh-zone.github.io/eve-bootcamp/code/example-12)
- [example-12/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-12/dapp)

## 最小调用链

`用户申请 -> 成员投票 -> 票数达到阈值 -> 发 MemberNFT 或没收押金`

## 需求分析

**场景：** 联盟“死亡先锋“有 20 名成员，每次接纳新人需要：

1. 申请人押金 10 SUI（防止刷申请，批准后退还）
1. 现有成员 72 小时内投票（匿名，链上记录）
1. 支持票 ≥ 60% 则自动批准，发放 MemberNFT
1. 创始人有一票否决权（`veto`）
1. 拒绝时押金被没收，进联盟金库

---

## 第一部分：联盟招募合约

```
module alliance::recruitment;

use sui::table::{Self, Table};
use sui::object::{Self, UID, ID};
use sui::clock::Clock;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::balance::{Self, Balance};
use sui::transfer;
use sui::event;
use std::string::String;

// ── 常量 ──────────────────────────────────────────────────

const VOTE_WINDOW_MS: u64 = 72 * 60 * 60 * 1000; // 72 小时
const APPROVAL_THRESHOLD_BPS: u64 = 6_000;         // 60%
const APPLICATION_DEPOSIT: u64 = 10_000_000_000;   // 10 SUI

// ── 数据结构 ───────────────────────────────────────────────

public struct AllianceDAO has key {
    id: UID,
    name: String,
    founder: address,
    members: vector<address>,
    treasury: Balance<SUI>,
    pending_applications: Table<address, Application>,
    total_accepted: u64,
}

public struct Application has store {
    applicant: address,
    applied_at_ms: u64,
    votes_for: u64,
    votes_against: u64,
    voters: vector<address>,  // 防止重复投票
    deposit: Balance<SUI>,
    status: u8,  // 0=pending, 1=approved, 2=rejected, 3=vetoed
}

/// 成员 NFT
public struct MemberNFT has key, store {
    id: UID,
    alliance_name: String,
    member: address,
    joined_at_ms: u64,
    serial_number: u64,
}

public struct FounderCap has key, store { id: UID }

// ── 事件 ──────────────────────────────────────────────────

public struct ApplicationSubmitted has copy, drop { applicant: address, alliance_id: ID }
public struct VoteCast has copy, drop { applicant: address, voter: address, approve: bool }
public struct ApplicationResolved has copy, drop {
    applicant: address,
    approved: bool,
    votes_for: u64,
    votes_total: u64,
}

// ── 初始化 ────────────────────────────────────────────────

public fun create_alliance(
    name: vector<u8>,
    ctx: &mut TxContext,
) {
    let mut dao = AllianceDAO {
        id: object::new(ctx),
        name: std::string::utf8(name),
        founder: ctx.sender(),
        members: vector[ctx.sender()],
        treasury: balance::zero(),
        pending_applications: table::new(ctx),
        total_accepted: 0,
    };

    // 创始人获得 MemberNFT（编号 #1）
    let founder_nft = MemberNFT {
        id: object::new(ctx),
        alliance_name: dao.name,
        member: ctx.sender(),
        joined_at_ms: 0,
        serial_number: 1,
    };
    dao.total_accepted = 1;

    let founder_cap = FounderCap { id: object::new(ctx) };

    transfer::share_object(dao);
    transfer::public_transfer(founder_nft, ctx.sender());
    transfer::public_transfer(founder_cap, ctx.sender());
}

// ── 申请加入 ──────────────────────────────────────────────

public fun apply(
    dao: &mut AllianceDAO,
    mut deposit: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let applicant = ctx.sender();
    assert!(!vector::contains(&dao.members, &applicant), EAlreadyMember);
    assert!(!table::contains(&dao.pending_applications, applicant), EAlreadyApplied);
    assert!(coin::value(&deposit) >= APPLICATION_DEPOSIT, EInsufficientDeposit);

    let deposit_balance = deposit.split(APPLICATION_DEPOSIT, ctx);
    if coin::value(&deposit) > 0 {
        transfer::public_transfer(deposit, applicant);
    } else { coin::destroy_zero(deposit); }

    table::add(&mut dao.pending_applications, applicant, Application {
        applicant,
        applied_at_ms: clock.timestamp_ms(),
        votes_for: 0,
        votes_against: 0,
        voters: vector::empty(),
        deposit: coin::into_balance(deposit_balance),
        status: 0,
    });

    event::emit(ApplicationSubmitted { applicant, alliance_id: object::id(dao) });
}

// ── 成员投票 ──────────────────────────────────────────────

public fun vote(
    dao: &mut AllianceDAO,
    applicant: address,
    approve: bool,
    _member_nft: &MemberNFT,  // 持有 NFT 才能投票
    clock: &Clock,
    ctx: &TxContext,
) {
    assert!(vector::contains(&dao.members, &ctx.sender()), ENotMember);
    assert!(table::contains(&dao.pending_applications, applicant), ENoApplication);

    let app = table::borrow_mut(&mut dao.pending_applications, applicant);
    assert!(app.status == 0, EApplicationClosed);
    assert!(clock.timestamp_ms() <= app.applied_at_ms + VOTE_WINDOW_MS, EVoteWindowClosed);
    assert!(!vector::contains(&app.voters, &ctx.sender()), EAlreadyVoted);

    vector::push_back(&mut app.voters, ctx.sender());
    if approve {
        app.votes_for = app.votes_for + 1;
    } else {
        app.votes_against = app.votes_against + 1;
    };

    event::emit(VoteCast { applicant, voter: ctx.sender(), approve });

    // 若票数已足够，尝试自动结算
    try_resolve(dao, applicant, clock, ctx);
}

fun try_resolve(
    dao: &mut AllianceDAO,
    applicant: address,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let app = table::borrow(&dao.pending_applications, applicant);
    let total_votes = app.votes_for + app.votes_against;
    let member_count = vector::length(&dao.members);

    // 提前结算条件：赞成 >= 60% 且至少 3 票，或反对 > 40% 且覆盖全员
    let approve_pct = total_votes * 10_000 / member_count;
    let enough_approval = app.votes_for * 10_000 / member_count >= APPROVAL_THRESHOLD_BPS
                          && total_votes >= 3;
    let definite_rejection = app.votes_against * 10_000 / member_count > 4_000
                             && total_votes == member_count;

    let time_expired = clock.timestamp_ms() > app.applied_at_ms + VOTE_WINDOW_MS;

    if enough_approval || time_expired || definite_rejection {
        resolve_application(dao, applicant, ctx);
    }
}

fun resolve_application(
    dao: &mut AllianceDAO,
    applicant: address,
    ctx: &mut TxContext,
) {
    let app = table::borrow_mut(&mut dao.pending_applications, applicant);
    let total_votes = app.votes_for + app.votes_against;
    let approved = total_votes > 0
        && app.votes_for * 10_000 / (total_votes) >= APPROVAL_THRESHOLD_BPS;

    if approved {
        app.status = 1;
        // 退还押金
        let deposit = balance::withdraw_all(&mut app.deposit);
        transfer::public_transfer(coin::from_balance(deposit, ctx), applicant);

        // 加入成员列表并发放 NFT
        vector::push_back(&mut dao.members, applicant);
        dao.total_accepted = dao.total_accepted + 1;

        let nft = MemberNFT {
            id: object::new(ctx),
            alliance_name: dao.name,
            member: applicant,
            joined_at_ms: 0, // clock 无法传进内部函数，简化处理
            serial_number: dao.total_accepted,
        };
        transfer::public_transfer(nft, applicant);
    } else {
        app.status = 2;
        // 没收押金入金库
        let deposit = balance::withdraw_all(&mut app.deposit);
        balance::join(&mut dao.treasury, deposit);
    };

    event::emit(ApplicationResolved {
        applicant,
        approved,
        votes_for: app.votes_for,
        votes_total: total_votes,
    });
}

/// 创始人一票否决
public fun veto(
    dao: &mut AllianceDAO,
    applicant: address,
    _cap: &FounderCap,
    ctx: &mut TxContext,
) {
    assert!(table::contains(&dao.pending_applications, applicant), ENoApplication);
    let app = table::borrow_mut(&mut dao.pending_applications, applicant);
    assert!(app.status == 0, EApplicationClosed);
    app.status = 3;
    // 没收押金
    let deposit = balance::withdraw_all(&mut app.deposit);
    balance::join(&mut dao.treasury, deposit);
}

// ── 错误码 ────────────────────────────────────────────────

const EAlreadyMember: u64 = 0;
const EAlreadyApplied: u64 = 1;
const EInsufficientDeposit: u64 = 2;
const ENotMember: u64 = 3;
const ENoApplication: u64 = 4;
const EApplicationClosed: u64 = 5;
const EVoteWindowClosed: u64 = 6;
const EAlreadyVoted: u64 = 7;
```

---

## 第二部分：招募管理 dApp

```
// src/RecruitmentPanel.tsx
import { useState } from 'react'
import { useCurrentClient, useCurrentAccount } from '@mysten/dapp-kit-react'
import { useQuery } from '@tanstack/react-query'
import { Transaction } from '@mysten/sui/transactions'
import { useDAppKit } from '@mysten/dapp-kit-react'

const RECRUIT_PKG = "0x_RECRUIT_PACKAGE_"
const DAO_ID = "0x_DAO_ID_"

interface PendingApp {
  applicant: string
  applied_at_ms: string
  votes_for: string
  votes_against: string
  status: string
}

export function RecruitmentPanel({ isMember, isFounder }: {
  isMember: boolean, isFounder: boolean
}) {
  const client = useCurrentClient()
  const dAppKit = useDAppKit()
  const account = useCurrentAccount()
  const [status, setStatus] = useState('')

  const { data: dao, refetch } = useQuery({
    queryKey: ['dao', DAO_ID],
    queryFn: async () => {
      const obj = await client.getObject({ id: DAO_ID, options: { showContent: true } })
      return (obj.data?.content as any)?.fields
    },
    refetchInterval: 15_000,
  })

  const handleApply = async () => {
    const tx = new Transaction()
    const [deposit] = tx.splitCoins(tx.gas, [tx.pure.u64(10_000_000_000)])
    tx.moveCall({
      target: `${RECRUIT_PKG}::recruitment::apply`,
      arguments: [tx.object(DAO_ID), deposit, tx.object('0x6')],
    })
    try {
      setStatus('⏳ 提交申请...')
      await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus('✅ 申请已提交！等待成员投票（72小时内）')
      refetch()
    } catch (e: any) { setStatus(`❌ ${e.message}`) }
  }

  const handleVote = async (applicant: string, approve: boolean) => {
    const tx = new Transaction()
    tx.moveCall({
      target: `${RECRUIT_PKG}::recruitment::vote`,
      arguments: [
        tx.object(DAO_ID),
        tx.pure.address(applicant),
        tx.pure.bool(approve),
        tx.object('MEMBER_NFT_ID'),
        tx.object('0x6'),
      ],
    })
    try {
      setStatus('⏳ 提交投票...')
      await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus(`✅ 已投票：${approve ? '赞成' : '反对'}`)
      refetch()
    } catch (e: any) { setStatus(`❌ ${e.message}`) }
  }

  const pendingApps = dao?.pending_applications?.fields?.contents ?? []
  const memberCount = dao?.members?.length ?? 0

  return (
    <div className="recruitment-panel">
      <header>
        <h1>⚔️ {dao?.name ?? '...'} — 招募中心</h1>
        <div className="stats">
          <span>👥 成员数：{memberCount}</span>
          <span>📋 待审申请：{pendingApps.filter((a: any) => a.fields?.value?.fields?.status === '0').length}</span>
        </div>
      </header>

      {/* 申请入盟 */}
      {!isMember && (
        <section className="apply-section">
          <h3>申请加入联盟</h3>
          <p>需要押金 10 SUI（批准后退还）。现有成员将在 72 小时内投票。</p>
          <button className="apply-btn" onClick={handleApply}>
            📝 提交申请（押金 10 SUI）
          </button>
        </section>
      )}

      {/* 待审列表（仅成员可见） */}
      {isMember && (
        <section className="pending-section">
          <h3>待审申请</h3>
          {pendingApps.map((entry: any) => {
            const app = entry.fields?.value?.fields
            if (!app || app.status !== '0') return null
            const hoursLeft = Math.max(0,
              Math.ceil((Number(app.applied_at_ms) + 72*3600_000 - Date.now()) / 3_600_000)
            )
            const totalVotes = Number(app.votes_for) + Number(app.votes_against)
            const pct = memberCount > 0 ? Math.round(Number(app.votes_for) * 100 / memberCount) : 0

            return (
              <div key={entry.fields?.key} className="application-card">
                <div className="applicant-info">
                  <strong>{entry.fields?.key?.slice(0, 8)}...</strong>
                  <span className="time-left">⏳ 剩余 {hoursLeft}h</span>
                </div>
                <div className="vote-bar">
                  <div className="vote-fill" style={{ width: `${pct}%` }} />
                  <span>{app.votes_for} 赞成 / {app.votes_against} 反对（{totalVotes}/{memberCount} 人投票）</span>
                </div>
                <div className="vote-buttons">
                  <button className="btn-approve" onClick={() => handleVote(entry.fields?.key, true)}>
                    👍 赞成
                  </button>
                  <button className="btn-reject" onClick={() => handleVote(entry.fields?.key, false)}>
                    👎 反对
                  </button>
                  {isFounder && (
                    <button className="btn-veto" onClick={() => {}}>
                      🚫 否决
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </section>
      )}

      {status && <p className="status">{status}</p>}
    </div>
  )
}
```

---

## 🎯 关键设计亮点

| 机制    | 实现方式                      |
| ----- | ------------------------- |
| 防刷申请  | 押金 10 SUI，被拒没收            |
| 防重复投票 | `voters` vector 追踪已投成员    |
| 自动结算  | 每次投票后检查是否达到阈值             |
| 一票否决  | `FounderCap` 授权的 `veto()` |
| 成员凭证  | `MemberNFT` 作为投票和权限载体     |

## 43. Example 15: PvP 物品保险 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-15.html

# 实战案例 15：去中心化物品保险

**目标：** 构建链上物品保险协议——玩家购买 PvP 战损险，若物品在游戏中被摧毁则通过服务器证明（AdminACL）自动赔付，理赔资金来自保险池。

---

状态：教学示例。正文强调理赔流程与资金池设计，完整目录以 `book/src/code/example-15/` 为准。

## 对应代码目录

- [example-15](https://hoh-zone.github.io/eve-bootcamp/code/example-15)
- [example-15/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-15/dapp)

## 最小调用链

`用户购买保单 -> 服务器出具战损证明 -> 合约验证保单与签名 -> 保险池赔付`

## 测试闭环

- 投保成功：确认 `claims_pool` / `reserve` 的 70/30 分账正确
- 有效期内理赔：确认赔付金额等于 `coverage_amount`
- 过期拒赔：确认过期保单无法再次发起理赔
- 理赔池不足：确认不会发生负余额或重复扣款

## 需求分析

**场景：** 玩家带着价值 500 SUI 的稀有护盾出征 PvP。他花 15 SUI 购买 30 天物品险，若战斗中护盾被摧毁：

1. 游戏服务器记录死亡事件
1. 玩家提交理赔申请 + 服务器签名（AdminACL 验证）
1. 合约验证保单有效期内，自动赔付（赔付率 80%）

---

## 合约

```
module insurance::pvp_shield;

use sui::object::{Self, UID, ID};
use sui::clock::Clock;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::balance::{Self, Balance};
use sui::table::{Self, Table};
use sui::transfer;
use sui::event;

// ── 常量 ──────────────────────────────────────────────────

const COVERAGE_BPS: u64 = 8_000;        // 赔付率 80%
const DAY_MS: u64 = 86_400_000;
const MIN_PREMIUM_BPS: u64 = 300;        // 最低保费：保额的 3%/月

// ── 数据结构 ───────────────────────────────────────────────

/// 保险池（共享）
public struct InsurancePool has key {
    id: UID,
    reserve: Balance<SUI>,       // 准备金
    total_collected: u64,        // 累计保费
    total_paid_out: u64,         // 累计赔付
    claims_pool: Balance<SUI>,   // 专用理赔池（保费的 70%）
    admin: address,
}

/// 保单 NFT
public struct PolicyNFT has key, store {
    id: UID,
    insured_item_id: ID,          // 被保物品 ObjectID
    insured_value: u64,           // 保额（SUI）
    coverage_amount: u64,         // 最高赔付（= 保额 × 80%）
    valid_until_ms: u64,          // 有效期
    is_claimed: bool,
    policy_holder: address,
}

// ── 事件 ──────────────────────────────────────────────────

public struct PolicyIssued has copy, drop {
    policy_id: ID,
    holder: address,
    insured_item_id: ID,
    coverage: u64,
    expires_ms: u64,
}

public struct ClaimPaid has copy, drop {
    policy_id: ID,
    holder: address,
    amount_paid: u64,
}

// ── 初始化 ────────────────────────────────────────────────

fun init(ctx: &mut TxContext) {
    transfer::share_object(InsurancePool {
        id: object::new(ctx),
        reserve: balance::zero(),
        total_collected: 0,
        total_paid_out: 0,
        claims_pool: balance::zero(),
        admin: ctx.sender(),
    });
}

// ── 购买保险 ──────────────────────────────────────────────

public fun purchase_policy(
    pool: &mut InsurancePool,
    insured_item_id: ID,         // 被保物品的 ObjectID
    insured_value: u64,           // 声明保额
    days: u64,                    // 保险天数（1-90）
    mut premium: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(days >= 1 && days <= 90, EInvalidDuration);

    // 计算保费：保额 × 月费率 × 天数
    let monthly_premium = insured_value * MIN_PREMIUM_BPS / 10_000;
    let required_premium = monthly_premium * days / 30;
    assert!(coin::value(&premium) >= required_premium, EInsufficientPremium);

    let pay = premium.split(required_premium, ctx);
    let premium_amount = coin::value(&pay);

    // 70% 进理赔池，30% 进准备金
    let claims_share = premium_amount * 70 / 100;
    let reserve_share = premium_amount - claims_share;

    let mut pay_balance = coin::into_balance(pay);
    let claims_portion = balance::split(&mut pay_balance, claims_share);
    balance::join(&mut pool.claims_pool, claims_portion);
    balance::join(&mut pool.reserve, pay_balance);
    pool.total_collected = pool.total_collected + premium_amount;

    if coin::value(&premium) > 0 {
        transfer::public_transfer(premium, ctx.sender());
    } else { coin::destroy_zero(premium); }

    let coverage = insured_value * COVERAGE_BPS / 10_000;
    let valid_until_ms = clock.timestamp_ms() + days * DAY_MS;

    let policy = PolicyNFT {
        id: object::new(ctx),
        insured_item_id,
        insured_value,
        coverage_amount: coverage,
        valid_until_ms,
        is_claimed: false,
        policy_holder: ctx.sender(),
    };
    let policy_id = object::id(&policy);

    transfer::public_transfer(policy, ctx.sender());

    event::emit(PolicyIssued {
        policy_id,
        holder: ctx.sender(),
        insured_item_id,
        coverage,
        expires_ms: valid_until_ms,
    });
}

// ── 理赔（需要游戏服务器签名证明物品已损毁）────────────

public fun file_claim(
    pool: &mut InsurancePool,
    policy: &mut PolicyNFT,
    admin_acl: &AdminACL,   // 游戏服务器验证物品确实损毁
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // 验证服务器签名（即服务器确认物品已经损毁）
    verify_sponsor(admin_acl, ctx);

    assert!(!policy.is_claimed, EAlreadyClaimed);
    assert!(clock.timestamp_ms() <= policy.valid_until_ms, EPolicyExpired);
    assert!(policy.policy_holder == ctx.sender(), ENotPolicyHolder);

    // 检查赔付池余额是否足够
    let payout = policy.coverage_amount;
    assert!(balance::value(&pool.claims_pool) >= payout, EInsufficientClaimsPool);

    // 标记已理赔（防止重复理赔）
    policy.is_claimed = true;

    // 赔付
    let payout_coin = coin::take(&mut pool.claims_pool, payout, ctx);
    pool.total_paid_out = pool.total_paid_out + payout;
    transfer::public_transfer(payout_coin, ctx.sender());

    event::emit(ClaimPaid {
        policy_id: object::id(policy),
        holder: ctx.sender(),
        amount_paid: payout,
    });
}

/// 管理员从准备金补充理赔池（当理赔池不足时）
public fun replenish_claims_pool(
    pool: &mut InsurancePool,
    amount: u64,
    ctx: &TxContext,
) {
    assert!(ctx.sender() == pool.admin, ENotAdmin);
    assert!(balance::value(&pool.reserve) >= amount, EInsufficientReserve);
    let replenish = balance::split(&mut pool.reserve, amount);
    balance::join(&mut pool.claims_pool, replenish);
}

const EInvalidDuration: u64 = 0;
const EInsufficientPremium: u64 = 1;
const EAlreadyClaimed: u64 = 2;
const EPolicyExpired: u64 = 3;
const ENotPolicyHolder: u64 = 4;
const EInsufficientClaimsPool: u64 = 5;
const ENotAdmin: u64 = 6;
const EInsufficientReserve: u64 = 7;
```

---

## dApp（购买与理赔）

```
// InsuranceApp.tsx
import { useState } from 'react'
import { Transaction } from '@mysten/sui/transactions'
import { useDAppKit } from '@mysten/dapp-kit-react'

const INS_PKG = "0x_INSURANCE_PACKAGE_"
const POOL_ID = "0x_POOL_ID_"

export function InsuranceApp() {
  const dAppKit = useDAppKit()
  const [value, setValue] = useState(500) // 保额（SUI）
  const [days, setDays] = useState(30)
  const [status, setStatus] = useState('')

  // 保费计算
  const premium = (value * 0.03 * days / 30).toFixed(2)
  const coverage = (value * 0.8).toFixed(2)

  const purchase = async () => {
    const tx = new Transaction()
    const premiumMist = BigInt(Math.ceil(Number(premium) * 1e9))
    const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(premiumMist)])
    tx.moveCall({
      target: `${INS_PKG}::pvp_shield::purchase_policy`,
      arguments: [
        tx.object(POOL_ID),
        tx.pure.id('0x_ITEM_OBJECT_ID_'),
        tx.pure.u64(value * 1e9),
        tx.pure.u64(days),
        payment,
        tx.object('0x6'),
      ],
    })
    try {
      setStatus('⏳ 购买保险...')
      await dAppKit.signAndExecuteTransaction({ transaction: tx })
      setStatus('✅ 保单已生效！PolicyNFT 已发送到钱包')
    } catch (e: any) { setStatus(`❌ ${e.message}`) }
  }

  return (
    <div className="insurance-app">
      <h1>🛡 PvP 物品战损险</h1>
      <div className="config-section">
        <label>保额（SUI）</label>
        <input type="range" min={100} max={5000} step={50}
          value={value} onChange={e => setValue(Number(e.target.value))} />
        <span>{value} SUI</span>

        <label>保险天数</label>
        {[7, 14, 30, 60, 90].map(d => (
          <button key={d} className={days === d ? 'selected' : ''} onClick={() => setDays(d)}>
            {d} 天
          </button>
        ))}
      </div>

      <div className="summary-card">
        <div className="summary-row">
          <span>📋 保额</span><strong>{value} SUI</strong>
        </div>
        <div className="summary-row">
          <span>💰 最高赔付</span><strong>{coverage} SUI</strong>
        </div>
        <div className="summary-row">
          <span>🏷 保费</span><strong>{premium} SUI</strong>
        </div>
        <div className="summary-row">
          <span>📅 有效期</span><strong>{days} 天</strong>
        </div>
      </div>

      <button className="purchase-btn" onClick={purchase}>
        购买保险（{premium} SUI）
      </button>
      {status && <p className="status">{status}</p>}
    </div>
  )
}
```

---

## 📚 关联文档

- [Chapter 8：赞助交易与 AdminACL 验证](https://hoh-zone.github.io/eve-bootcamp/chapter-08.html)
- [Chapter 14：经济系统与资金池](https://hoh-zone.github.io/eve-bootcamp/chapter-14.html)

## 44. Example 17: 游戏内浮层实战 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-17.html

# 实战案例 17：游戏内浮层 dApp 实战（收费站游戏内版）

**目标：** 将 Example 2 的星门收费站 dApp 改造为**游戏内浮层版本**——玩家靠近星门时自动弹出购票面板，可在不离开游戏的情况下完成签名和跳跃。

---

状态：教学示例。当前案例以 dApp 浮层改造为主，合约部分沿用 [Example 2](https://hoh-zone.github.io/eve-bootcamp/example-02.html)。

## 对应代码目录

- [example-17/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-17/dapp)

## 最小调用链

`游戏内事件 -> postMessage -> 浮层 dApp 更新状态 -> 用户签名 -> 购票/跳跃成功 -> 浮层关闭`

## 需求分析

**场景：** 收费站逻辑已经存在（重用 Example 2 的合约），现在要：

1. 游戏客户端检测到玩家进入星门 100km 范围
1. 通过 `postMessage` 发送事件至 WebView 浮层
1. 浮层弹出购票面板，显示费用和目的地
1. 玩家一键点击，EVE Vault 弹出签名确认
1. 签名完成后，显示成功动画并自动关闭

这个案例聚焦于 **Chapter 20 的工程实践**，代码细节更完整。

---

## 项目结构

```
ingame-toll-overlay/
├── index.html
├── src/
│   ├── main.tsx                  # 入口，Provider 设置
│   ├── App.tsx                   # 环境检测和路由
│   ├── overlay/
│   │   ├── TollOverlay.tsx       # 游戏内浮层主组件
│   │   ├── JumpPanel.tsx         # 购票面板
│   │   └── SuccessAnimation.tsx  # 成功动画
│   └── lib/
│       ├── gameEvents.ts         # postMessage 监听
│       ├── environment.ts        # 环境检测
│       └── contracts.ts          # 合约常量
├── ingame.css                    # 浮层样式
└── vite.config.ts
```

---

## 第一部分：游戏事件监听

```
// src/lib/gameEvents.ts

export interface GateAproachEvent {
  type: "GATE_IN_RANGE"
  gateId: string
  gateName: string
  destinationSystemName: string
  distanceKm: number
}

export interface PlayerLeftEvent {
  type: "GATE_OUT_OF_RANGE"
  gateId: string
}

export type OverlayEvent = GateAproachEvent | PlayerLeftEvent

type Listener = (event: OverlayEvent) => void
const listeners = new Set<Listener>()

let initialized = false

export function initGameEventListener() {
  if (initialized) return
  initialized = true

  window.addEventListener("message", (e: MessageEvent) => {
    if (e.data?.source !== "EVEFrontierClient") return
    const event = e.data as { source: string } & OverlayEvent
    if (!event.type) return
    listeners.forEach(fn => fn(event))
  })
}

export function addGameEventListener(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// ── 开发/测试用：模拟游戏事件 ─────────────────────────────

export function simulateGateApproach(gateId: string) {
  const mockEvent: GateAproachEvent = {
    type: "GATE_IN_RANGE",
    gateId,
    gateName: "Alpha Gate Alpha-7",
    destinationSystemName: "贸易枢纽 IV",
    distanceKm: 78,
  }
  window.dispatchEvent(
    new MessageEvent("message", {
      data: { source: "EVEFrontierClient", ...mockEvent },
    })
  )
}
```

---

## 第二部分：主浮层组件

```
// src/overlay/TollOverlay.tsx
import { useEffect, useState, useCallback } from 'react'
import {
  initGameEventListener,
  addGameEventListener,
  GateAproachEvent,
} from '../lib/gameEvents'
import { JumpPanel } from './JumpPanel'
import { SuccessAnimation } from './SuccessAnimation'

type OverlayState = 'hidden' | 'visible' | 'success'

export function TollOverlay() {
  const [state, setState] = useState<OverlayState>('hidden')
  const [activeGate, setActiveGate] = useState<GateAproachEvent | null>(null)

  useEffect(() => {
    initGameEventListener()

    return addGameEventListener((event) => {
      if (event.type === 'GATE_IN_RANGE') {
        setActiveGate(event)
        setState('visible')
      } else if (event.type === 'GATE_OUT_OF_RANGE') {
        if (state !== 'success') setState('hidden')
      }
    })
  }, [state])

  const handleSuccess = useCallback(() => {
    setState('success')
    // 3 秒后自动关闭
    setTimeout(() => {
      setState('hidden')
      setActiveGate(null)
    }, 3000)
  }, [])

  const handleDismiss = useCallback(() => {
    setState('hidden')
  }, [])

  if (state === 'hidden') return null

  return (
    <div className="overlay-container">
      <div className={`overlay-panel ${state === 'success' ? 'overlay-panel--success' : ''}`}>
        {state === 'success' ? (
          <SuccessAnimation />
        ) : (
          activeGate && (
            <JumpPanel
              gateEvent={activeGate}
              onSuccess={handleSuccess}
              onDismiss={handleDismiss}
            />
          )
        )}
      </div>
    </div>
  )
}
```

---

## 第三部分：购票面板

```
// src/overlay/JumpPanel.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCurrentClient } from '@mysten/dapp-kit-react'
import { useDAppKit } from '@mysten/dapp-kit-react'
import { Transaction } from '@mysten/sui/transactions'
import { GateAproachEvent } from '../lib/gameEvents'
import { TOLL_PKG, ADMIN_ACL_ID, CHARACTER_ID } from '../lib/contracts'

interface JumpPanelProps {
  gateEvent: GateAproachEvent
  onSuccess: () => void
  onDismiss: () => void
}

export function JumpPanel({ gateEvent, onSuccess, onDismiss }: JumpPanelProps) {
  const client = useCurrentClient()
  const dAppKit = useDAppKit()
  const [buying, setBuying] = useState(false)

  // 读取该星门的通行费
  const { data: tollInfo } = useQuery({
    queryKey: ['gate-toll', gateEvent.gateId],
    queryFn: async () => {
      const obj = await client.getObject({
        id: gateEvent.gateId,
        options: { showContent: true },
      })
      const fields = (obj.data?.content as any)?.fields
      return {
        tollAmount: Number(fields?.toll_amount ?? 0),
        destinationGateId: fields?.linked_gate_id,
      }
    },
  })

  const tollSUI = ((tollInfo?.tollAmount ?? 0) / 1e9).toFixed(2)

  const handleBuy = async () => {
    if (!tollInfo) return
    setBuying(true)

    const tx = new Transaction()
    const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(tollInfo.tollAmount)])
    tx.moveCall({
      target: `${TOLL_PKG}::toll_gate_ext::pay_toll_and_get_permit`,
      arguments: [
        tx.object(gateEvent.gateId),      // 源星门
        tx.object(tollInfo.destinationGateId), // 目的星门
        tx.object(CHARACTER_ID),          // 角色对象
        payment,
        tx.object(ADMIN_ACL_ID),
        tx.object('0x6'),                 // Clock
      ],
    })

    try {
      // 调用赞助交易（服务器验证临近性后代付 Gas）
      await dAppKit.signAndExecuteSponsoredTransaction({ transaction: tx })
      onSuccess()
    } catch (e: any) {
      console.error(e)
      setBuying(false)
    }
  }

  return (
    <div className="jump-panel">
      {/* 关闭按钮 */}
      <button className="dismiss-btn" onClick={onDismiss} aria-label="关闭">✕</button>

      {/* 星门信息 */}
      <div className="gate-icon">🌀</div>
      <h2 className="gate-name">{gateEvent.gateName}</h2>
      <p className="destination">
        目的地：<strong>{gateEvent.destinationSystemName}</strong>
      </p>
      <p className="distance">📡 距离：{gateEvent.distanceKm} km</p>

      {/* 费用 */}
      <div className="toll-display">
        <span className="toll-label">通行费</span>
        <span className="toll-amount">{tollSUI} SUI</span>
      </div>

      {/* 购票按钮 */}
      <button
        className="jump-btn"
        onClick={handleBuy}
        disabled={buying || !tollInfo}
      >
        {buying ? '⏳ 签名中...' : '🚀 购票并跳跃'}
      </button>

      <p className="jump-hint">通行证有效期 30 分钟</p>
    </div>
  )
}
```

---

## 第四部分：成功动画

```
// src/overlay/SuccessAnimation.tsx
import { useEffect, useState } from 'react'

export function SuccessAnimation() {
  const [frame, setFrame] = useState(0)
  const frames = ['🌌', '⚡', '🌀', '✨', '🚀']

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % frames.length)
    }, 200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="success-animation">
      <div className="animation-icon">{frames[frame]}</div>
      <h2>跳跃成功！</h2>
      <p>正在传送至目的地...</p>
    </div>
  )
}
```

---

## 游戏内专用 CSS

```
/* ingame.css */
.overlay-container {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
  width: 320px;
}

.overlay-panel {
  background: rgba(8, 12, 24, 0.95);
  border: 1px solid rgba(96, 180, 255, 0.5);
  border-radius: 12px;
  padding: 20px;
  color: #d0e8ff;
  font-family: 'Share Tech Mono', monospace;
  backdrop-filter: blur(12px);
  animation: slideIn 0.25s ease;
  box-shadow: 0 0 30px rgba(96, 180, 255, 0.15);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
}

.jump-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #1a5cff, #0a3acc);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 15px;
  font-family: inherit;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.jump-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2a6cff, #1a4aee);
  box-shadow: 0 0 20px rgba(26, 92, 255, 0.4);
}

.toll-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
}

.toll-amount {
  font-size: 24px;
  font-weight: bold;
  color: #4fa3ff;
}

.success-animation {
  text-align: center;
  padding: 24px 0;
  animation-icon { font-size: 48px; }
}
```

---

## 📚 关联文档

- [Chapter 20：游戏内 dApp 集成](https://hoh-zone.github.io/eve-bootcamp/chapter-20.html)
- [Chapter 8：赞助交易](https://hoh-zone.github.io/eve-bootcamp/chapter-08.html)
- [Example 2：星门收费站（合约层）](https://hoh-zone.github.io/eve-bootcamp/example-02.html)

## 45. Chapter 26: 访问控制完整解析 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-26.html

# 第26章：访问控制系统完整解析

**学习目标**：深入理解 `world::access` 模块的完整权限架构——从 `GovernorCap`、`AdminACL`、`OwnerCap` 到 `Receiving` 模式，掌握 EVE Frontier 访问控制系统的精密设计。

---

状态：教学示例。访问控制细节较多，建议直接对照源码与测试逐段阅读，而不是只看概念图。

## 最小调用链

`调用入口 -> 权限对象/授权列表校验 -> 借出或消费 capability -> 执行业务动作 -> 归还或销毁能力对象`

## 对应代码目录

- [world-contracts/contracts/world](https://github.com/evefrontier/world-contracts/tree/main/contracts/world)

## 关键 Struct

| 类型                      | 作用                   | 阅读重点                               |
| ----------------------- | -------------------- | ---------------------------------- |
| `AdminACL`              | 服务器授权白名单             | 看 sponsor 白名单如何维护                  |
| `GovernorCap`           | 系统级最高权限能力            | 看哪些动作必须走 governor 而不是 owner        |
| `OwnerCap<T>`           | 泛型所有权凭证              | 看借出、归还、转移三种生命周期                    |
| `Receiving` 相关模式        | 安全借用 object-owned 资产 | 看 object-owned 和 address-owned 的差异 |
| `ServerAddressRegistry` | 服务端地址注册表             | 看签名身份和业务权限如何串起来                    |

## 46. Chapter 27: 链下签名 × 链上验证 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-27.html

# 第27章：链下签名 × 链上验证

**学习目标**：深入理解 `world::sig_verify` 模块的 Ed25519 签名验证机制，掌握“游戏服务器签名 → Move 合约验证“这一 EVE Frontier 的核心安全模式。

---

状态：教学示例。正文中的验证流程是对官方实现的拆解版，落地时请优先对照实际源码和测试。

## 最小调用链

`游戏服务器构造消息 -> Ed25519 签名 -> 玩家提交 bytes/signature -> sig_verify 模块校验 -> 合约继续执行`

## 对应代码目录

- [world-contracts/contracts/world](https://github.com/evefrontier/world-contracts/tree/main/contracts/world)

## 关键 Struct / 输入

| 类型或输入             | 作用                            | 阅读重点                    |
| ----------------- | ----------------------------- | ----------------------- |
| 消息 bytes          | 链下事实的原始编码                     | 看链下签名和链上验证是否使用完全相同的字节序列 |
| 签名 blob           | `flag + raw_sig + public_key` | 看长度、切片顺序和签名算法标识         |
| `AdminACL` / 授权地址 | 业务允许的服务器身份                    | 看“签名正确”和“签名者有权”是两层校验    |

## 47. Chapter 28: 位置证明协议 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-28.html

# 第28章：位置证明协议深度剖析

**学习目标**：掌握 `world::location` 模块的核心设计——位置哈希、BCS 反序列化、LocationProof 验证，以及在 Builder 扩展中要求玩家“必须在场“的完整实现。

---

状态：教学示例。位置证明的消息组织和签名流程会因业务而变，本章重点是解释协议结构和验证边界。

## 最小调用链

`游戏服务器观测位置 -> 生成 LocationProof -> 玩家提交 proof -> 合约反序列化并验证 -> 放行/拒绝业务动作`

## 对应代码目录

- [world-contracts/contracts/world](https://github.com/evefrontier/world-contracts/tree/main/contracts/world)

## 关键 Struct

| 类型                     | 作用            | 阅读重点                            |
| ---------------------- | ------------- | ------------------------------- |
| `Location`             | 链上位置哈希容器      | 看链上只保存 hash，不保存明文坐标             |
| `LocationProofMessage` | 服务器签名的位置证明消息体 | 看玩家、源对象、目标对象、距离、deadline 是否全部绑定 |
| `LocationProof`        | 链上提交的证明载体     | 看 bytes、签名和消息体如何组合              |

## 48. Chapter 29: 能量与燃料系统 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-29.html

# 第29章：能量与燃料系统机制

**学习目标**：深入理解 EVE Frontier 建筑运行的双层能源机制——Energy（电力容量）与 Fuel（燃料消耗），掌握 `world::energy` 和 `world::fuel` 模块的源码设计，并学会编写与这两个系统交互的 Builder 扩展。

---

状态：教学示例。正文中的能量/燃料模型用于帮助你读懂官方实现，字段和入口请以实际模块为准。

## 最小调用链

`Network Node 分配能量 -> 建筑检查 energy/fuel 条件 -> 业务模块消耗燃料 -> 建筑状态更新`

## 对应代码目录

- [world-contracts/contracts/world](https://github.com/evefrontier/world-contracts/tree/main/contracts/world)

## 关键 Struct

| 类型               | 作用          | 阅读重点                 |
| ---------------- | ----------- | -------------------- |
| `EnergyConfig`   | 不同装配类型的能量配置 | 看类型到能量需求的映射如何维护      |
| `EnergySource`   | 网络节点的供能状态   | 看最大产能、当前产能、已预留能量三者关系 |
| `Fuel` 相关结构      | 建筑燃料存量与消耗状态 | 看燃料存量和时间费率如何绑定       |
| `FuelEfficiency` | 燃料类型与效率差异   | 看不同燃料如何影响续航和成本       |

## 49. Chapter 30: Extension 模式实战 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-30.html

# 第30章：Extension 模式实战——官方示例精读

**学习目标**：通过精读 `world-contracts/contracts/extension_examples/` 中两个真实的官方扩展示例，掌握 EVE Frontier Builder 扩展的标准开发模式。

---

状态：已映射到官方示例目录。正文是结构化讲解，建议边读边打开扩展示例源码。

## 最小调用链

`authorize_extension<XAuth> -> 写入 ExtensionConfig -> 业务入口校验规则 -> 调用 World Assembly API`

## 对应代码目录

- [world-contracts/contracts/extension_examples](https://github.com/evefrontier/world-contracts/tree/main/contracts/extension_examples)

## 关键 Struct

| 类型                   | 作用          | 阅读重点                 |
| -------------------- | ----------- | -------------------- |
| `AdminCap`           | 配置扩展规则的管理能力 | 看谁能写配置、谁只能读配置        |
| `XAuth` / witness 类型 | 绑定扩展授权身份    | 看 witness 类型如何成为扩展开关 |
| 配置对象 / 动态字段键         | 保存扩展规则      | 看规则 key 与业务入口读取是否一致  |

## 50. Chapter 31: 炮塔 AI 扩展 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-31.html

# 第31章：炮塔 AI 扩展开发

**学习目标**：深入理解 `world::turret` 模块的目标优先级系统，掌握通过 Extension 模式自定义炮塔 AI 行为的完整实现方法。

---

状态：教学示例。正文关注优先级模型和扩展切入点，具体字段仍应以官方 `turret` 模块源码为准。

## 最小调用链

`飞船进入范围/触发 aggression -> turret 模块收集候选目标 -> 扩展规则排序 -> 执行攻击决策`

## 对应代码目录

- [world-contracts/contracts/world](https://github.com/evefrontier/world-contracts/tree/main/contracts/world)
- [world-contracts/contracts/extension_examples](https://github.com/evefrontier/world-contracts/tree/main/contracts/extension_examples)

## 关键 Struct

| 类型                         | 作用         | 阅读重点                     |
| -------------------------- | ---------- | ------------------------ |
| `TargetCandidate`          | 炮塔决策输入候选集  | 看哪些字段参与过滤、哪些字段参与排序       |
| `ReturnTargetPriorityList` | 扩展返回的优先级结果 | 看扩展到底返回“排序建议”还是“直接开火命令”  |
| `BehaviourChangeReason`    | 触发本次重算的原因  | 看 AI 刷新来自进入范围、攻击行为还是状态变化 |
| `OnlineReceipt`            | 炮塔在线状态相关凭证 | 看扩展逻辑是否依赖在线前置条件          |

## 51. Chapter 32: KillMail 系统 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-32.html

# 第32章：KillMail 系统深度解析

**学习目标**：理解 EVE Frontier 链上战斗死亡记录的完整架构——从源码结构到与 Builder 扩展的交互方式。

---

状态：教学示例。正文代码为便于讲解而做了精简，源码验收请以仓库内实际 `world-contracts` 文件为准。

## 最小调用链

`游戏服务器 -> AdminACL 校验 -> create_killmail -> derived_object::claim -> share_object -> emit event`

## 对应代码目录

- [world-contracts/contracts/world](https://github.com/evefrontier/world-contracts/tree/main/contracts/world)

## 关键 Struct

| 类型                 | 作用          | 阅读重点                         |
| ------------------ | ----------- | ---------------------------- |
| `Killmail`         | 链上击杀记录共享对象  | 看唯一 key、时间戳、击杀双方与发生地如何落盘     |
| `LossType`         | 区分飞船/建筑损失   | 看它如何影响上层业务解释                 |
| `KillmailRegistry` | 注册表与索引入口    | 看它如何避免重复创建、如何定位记录            |
| `TenantItemId`     | 游戏内对象到链上映射键 | 看 tenant + item_id 如何形成稳定业务键 |

## 52. Example 8: Builder 竞赛系统 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-08.html

# 实战案例 8：Builder 竞赛系统（链上排行榜 + 自动奖励）

**目标：** 构建一套链上竞赛框架：在固定时间窗口内，玩家通过质押积分参与竞赛，排行榜记录链上，到时间自动结算，前三名获得 NFT 奖杯和代币奖励。

---

状态：代码骨架。仓库内已附 `Move.toml`、`weekly_race.move` 和 dApp 目录，但积分上报授权、奖励资产类型与链下结算来源仍需按你的赛事业务补齐。

## 对应代码目录

- [example-08](https://hoh-zone.github.io/eve-bootcamp/code/example-08)
- [example-08/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-08/dapp)

## 最小调用链

`创建赛事 -> 充值奖池 -> 链下聚合积分 -> 服务器授权上报积分 -> 到期结算 -> 分发奖池与奖杯`

## 链下职责边界

本案例最容易写坏的地方，不是排行榜本身，而是链下协作边界。建议把职责拆清：

- 链上只负责：赛事生命周期、奖池资金、最终结算、奖杯铸造
- 服务器负责：监听跳跃事件、按赛季聚合分数、为积分上报签名
- 前端负责：展示当前积分、触发管理员操作、读取结算结果

如果你暂时补不齐服务器签名和积分聚合，不要把本案例宣传成“完整自动化比赛系统”；更准确的表述是“赛事合约骨架 + 排行榜结算模型”。

## 需求分析

**场景：** 你（Builder）每周举办“矿区争夺赛“，比谁在本周通过你的星门跳跃最多次：

- 📅 **赛制**：每周日 00:00 UTC 开始，下周六 23:59 结束
- 📊 **积分**：每次跳跃 +1 积分（通过监听 GateJumped 事件上报）
- 🏆 **奖励**： 

  - 🥇 第一名：Champion NFT 奖杯 + 500 ALLY Token
  - 🥈 第二名：Elite NFT 奖杯 + 200 ALLY Token
  - 🥉 第三名：Contender NFT 奖杯 + 100 ALLY Token

- 💡 **关键**：前三名由合约根据链上积分自动决定，不可人工干预

---

## 第一部分：竞赛合约

```
module competition::weekly_race;

use sui::table::{Self, Table};
use sui::object::{Self, UID, ID};
use sui::clock::Clock;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::balance::{Self, Balance};
use sui::event;
use sui::transfer;
use std::string::{Self, String, utf8};

// 说明：此处省略了实际项目中的 `AdminACL` / `verify_sponsor`
// 导入与链下排行榜聚合逻辑，示例只展示合约建模方式。

// ── 常量 ──────────────────────────────────────────────────

const WEEK_DURATION_MS: u64 = 7 * 24 * 60 * 60 * 1000; // 7 天

// ── 数据结构 ───────────────────────────────────────────────

/// 竞赛（每周创建一个新的）
public struct Race has key {
    id: UID,
    season: u64,              // 第几届
    start_time_ms: u64,
    end_time_ms: u64,
    scores: Table<address, u64>,  // 玩家地址 → 积分
    top3: vector<address>,        // 前三名（结算后填充）
    is_settled: bool,
    prize_pool_sui: Balance<SUI>,
    admin: address,
}

/// 奖杯 NFT
public struct TrophyNFT has key, store {
    id: UID,
    season: u64,
    rank: u8,      // 1, 2, 3
    score: u64,
    winner: address,
    image_url: String,
}

public struct RaceAdminCap has key, store { id: UID }

// ── 事件 ──────────────────────────────────────────────────

public struct ScoreUpdated has copy, drop {
    race_id: ID,
    player: address,
    new_score: u64,
}

public struct RaceSettled has copy, drop {
    race_id: ID,
    season: u64,
    winner: address,
    second: address,
    third: address,
}

// ── 初始化 ────────────────────────────────────────────────

fun init(ctx: &mut TxContext) {
    transfer::transfer(RaceAdminCap { id: object::new(ctx) }, ctx.sender());
}

/// 创建新一届竞赛
public fun create_race(
    _cap: &RaceAdminCap,
    season: u64,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let start = clock.timestamp_ms();
    let race = Race {
        id: object::new(ctx),
        season,
        start_time_ms: start,
        end_time_ms: start + WEEK_DURATION_MS,
        scores: table::new(ctx),
        top3: vector::empty(),
        is_settled: false,
        prize_pool_sui: balance::zero(),
        admin: ctx.sender(),
    };
    transfer::share_object(race);
}

/// 充值奖池
public fun fund_prize_pool(
    race: &mut Race,
    _cap: &RaceAdminCap,
    coin: Coin<SUI>,
) {
    balance::join(&mut race.prize_pool_sui, coin::into_balance(coin));
}

// ── 积分上报（由赛事服务器或炮塔/星门扩展调用） ────────────

public fun report_score(
    race: &mut Race,
    player: address,
    score_delta: u64,    // 本次增加的积分
    clock: &Clock,
    admin_acl: &AdminACL, // 需要游戏服务器签名
    ctx: &TxContext,
) {
    verify_sponsor(admin_acl, ctx);         // 验证是授权服务器
    assert!(!race.is_settled, ERaceEnded);
    assert!(clock.timestamp_ms() <= race.end_time_ms, ERaceEnded);

    if !table::contains(&race.scores, player) {
        table::add(&mut race.scores, player, 0u64);
    };

    let score = table::borrow_mut(&mut race.scores, player);
    *score = *score + score_delta;

    event::emit(ScoreUpdated {
        race_id: object::id(race),
        player,
        new_score: *score,
    });
}

// ── 结算（需要链下算出前三名后传入）────────────────────────

public fun settle_race(
    race: &mut Race,
    _cap: &RaceAdminCap,
    first: address,
    second: address,
    third: address,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(!race.is_settled, EAlreadySettled);
    assert!(clock.timestamp_ms() >= race.end_time_ms, ERaceNotEnded);

    // 验证链上积分（防止传入假排名）
    let s1 = *table::borrow(&race.scores, first);
    let s2 = *table::borrow(&race.scores, second);
    let s3 = *table::borrow(&race.scores, third);
    assert!(s1 >= s2 && s2 >= s3, EInvalidRanking);

    race.is_settled = true;
    race.top3 = vector[first, second, third];

    // 分发奖池：50% 给第一，30% 给第二，20% 给第三
    let total = balance::value(&race.prize_pool_sui);
    let prize1 = coin::take(&mut race.prize_pool_sui, total * 50 / 100, ctx);
    let prize2 = coin::take(&mut race.prize_pool_sui, total * 30 / 100, ctx);
    let prize3 = coin::take(&mut race.prize_pool_sui, balance::value(&race.prize_pool_sui), ctx);

    transfer::public_transfer(prize1, first);
    transfer::public_transfer(prize2, second);
    transfer::public_transfer(prize3, third);

    // 铸造奖杯 NFT
    mint_trophy(race.season, 1, s1, first, ctx);
    mint_trophy(race.season, 2, s2, second, ctx);
    mint_trophy(race.season, 3, s3, third, ctx);

    event::emit(RaceSettled {
        race_id: object::id(race),
        season: race.season,
        winner: first,
        second,
        third,
    });
}

fun mint_trophy(
    season: u64,
    rank: u8,
    score: u64,
    winner: address,
    ctx: &mut TxContext,
) {
    let (name, image_url) = match(rank) {
        1 => (b"Champion Trophy", b"https://assets.example.com/trophies/gold.png"),
        2 => (b"Elite Trophy", b"https://assets.example.com/trophies/silver.png"),
        _ => (b"Contender Trophy", b"https://assets.example.com/trophies/bronze.png"),
    };

    let trophy = TrophyNFT {
        id: object::new(ctx),
        season,
        rank,
        score,
        winner,
        image_url: utf8(image_url),
    };

    transfer::public_transfer(trophy, winner);
}

const ERaceEnded: u64 = 0;
const EAlreadySettled: u64 = 1;
const ERaceNotEnded: u64 = 2;
const EInvalidRanking: u64 = 3;
```

---

## 第二部分：结算脚本（链下排名 + 链上结算）

```
// scripts/settle-race.ts
import { SuiClient } from "@mysten/sui/client"
import { Transaction } from "@mysten/sui/transactions"
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"

const RACE_PKG = "0x_COMPETITION_PACKAGE_"
const RACE_ID = "0x_RACE_ID_"

async function settleRace() {
  const client = new SuiClient({ url: "https://fullnode.testnet.sui.io:443" })
  const adminKeypair = Ed25519Keypair.fromSecretKey(/* ... */)

  // 1. 从链上读取所有积分（通过 ScoreUpdated 事件聚合）
  const scoreMap = new Map<string, number>()
  let cursor = null

  do {
    const page = await client.queryEvents({
      query: { MoveEventType: `${RACE_PKG}::weekly_race::ScoreUpdated` },
      cursor,
      limit: 200,
    })

    for (const event of page.data) {
      const { player, new_score } = event.parsedJson as any
      scoreMap.set(player, Number(new_score)) // 取最新值
    }

    cursor = page.nextCursor
  } while (cursor)

  // 2. 排序找出前三名
  const sorted = [...scoreMap.entries()]
    .sort((a, b) => b[1] - a[1])

  if (sorted.length < 3) {
    console.log("参与人数不足，无法结算")
    return
  }

  const [first, second, third] = sorted.slice(0, 3).map(([addr]) => addr)
  console.log(`第一：${first}（${sorted[0][1]} 积分）`)
  console.log(`第二：${second}（${sorted[1][1]} 积分）`)
  console.log(`第三：${third}（${sorted[2][1]} 积分）`)

  // 3. 提交结算交易
  const tx = new Transaction()
  tx.moveCall({
    target: `${RACE_PKG}::weekly_race::settle_race`,
    arguments: [
      tx.object(RACE_ID),
      tx.object("ADMIN_CAP_ID"),
      tx.pure.address(first),
      tx.pure.address(second),
      tx.pure.address(third),
      tx.object("0x6"), // Clock
    ],
  })

  const result = await client.signAndExecuteTransaction({
    signer: adminKeypair,
    transaction: tx,
  })
  console.log("结算成功！奖杯已发放。Tx:", result.digest)
}

settleRace()
```

---

## 第三部分：实时排行榜 dApp

```
// src/LeaderboardApp.tsx
import { useEffect, useState } from 'react'
import { useRealtimeEvents } from './hooks/useRealtimeEvents'

const RACE_PKG = "0x_COMPETITION_PACKAGE_"

interface ScoreEntry {
  rank: number
  address: string
  score: number
}

export function LeaderboardApp() {
  const [scores, setScores] = useState<Map<string, number>>(new Map())
  const [timeLeft, setTimeLeft] = useState('')
  const raceEnd = new Date('2026-03-08T00:00:00Z').getTime()

  // 实时订阅积分更新
  const events = useRealtimeEvents<{ player: string; new_score: string }>(
    `${RACE_PKG}::weekly_race::ScoreUpdated`
  )

  useEffect(() => {
    const updated = new Map(scores)
    for (const e of events) {
      updated.set(e.player, Number(e.new_score))
    }
    setScores(updated)
  }, [events])

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = raceEnd - Date.now()
      if (diff <= 0) { setTimeLeft('已结束'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(`${d}天 ${h}时 ${m}分`)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const sorted: ScoreEntry[] = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([address, score], i) => ({ rank: i + 1, address, score }))

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="leaderboard">
      <header>
        <h1>🏆 第一届星门跳跃竞赛</h1>
        <div className="countdown">
          ⏳ 剩余时间：<strong>{timeLeft}</strong>
        </div>
      </header>

      <table className="ranking-table">
        <thead>
          <tr><th>排名</th><th>玩家</th><th>跳跃次数</th></tr>
        </thead>
        <tbody>
          {sorted.map(({ rank, address, score }) => (
            <tr key={address} className={rank <= 3 ? 'top3' : ''}>
              <td>{medals[rank - 1] ?? rank}</td>
              <td>{address.slice(0, 6)}...{address.slice(-4)}</td>
              <td><strong>{score}</strong> 次</td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr><td colSpan={3}>暂无数据，等待第一次跳跃...</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
```

---

## 🎯 完整回顾

```
合约层
├── weekly_race.move
│   ├── Race（共享对象，每届一个）
│   ├── TrophyNFT（奖杯对象）
│   ├── create_race()     ← Admin 创建
│   ├── fund_prize_pool() ← Admin 充奖池
│   ├── report_score()    ← 服务器上报积分（AdminACL 验证）
│   └── settle_race()     ← Admin 传入前三名，合约验证并结算

结算脚本
└── settle-race.ts
    ├── QueryEvents 聚合所有积分
    ├── 排序计算前三名
    └── 提交 settle_race() 交易

dApp 层
└── LeaderboardApp.tsx
    ├── subscribeEvent 实时更新排行榜
    └── 竞赛倒计时
```

## 🔧 扩展练习

1. **防刷分**：在 `report_score` 中限速（每个玩家每分钟最多上报 60 积分）
1. **公开验证**：将每次积分上报的原始数据哈希也存链上，让任何人可以验算最终排名
1. **赛季制**：Admin 无法提前结束当届竞赛，合约强制执行时间轴

---

## 📚 关联文档

- [Chapter 8：赞助交易与服务端集成](https://hoh-zone.github.io/eve-bootcamp/chapter-08.html)
- [Chapter 9：链下索引](https://hoh-zone.github.io/eve-bootcamp/chapter-09.html)
- [Chapter 13：NFT 设计](https://hoh-zone.github.io/eve-bootcamp/chapter-13.html)

## 53. Example 10: 综合实战 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/example-10.html

# 实战案例 10：太空资源争夺战（综合实战）

**目标：** 整合本课程所有知识，构建一个微型完整游戏：两个联盟争夺一片矿区的控制权，包含炮塔攻防、星门收费、物品存储、代币奖励和实时战报 dApp。

---

状态：综合案例。正文整合多个模块，是检验你是否真正把全书前半段串起来的最好案例。

## 对应代码目录

- [example-10](https://hoh-zone.github.io/eve-bootcamp/code/example-10)
- [example-10/dapp](https://hoh-zone.github.io/eve-bootcamp/code/example-10/dapp)

## 最小调用链

`发放势力 NFT -> 星门/炮塔按势力校验 -> 玩家采矿获奖 -> WAR Token 发放 -> dApp 展示战况`

## 项目全景

```
┌─────────────────────────────────────────────┐
│              太空资源争夺战                    │
│                                             │
│    联盟 A                   联盟 B           │
│    Territory (炮塔 ×2)      Territory (炮塔 ×2)│
│         ↑                       ↑           │
│    ┌─[Gate A1]─── 中立矿区 ───[Gate B1]─┐   │
│    │           (存储箱 + 资源)           │   │
│    └─────────────────────────────────────┘  │
│                                             │
│  战斗规则：                                  │
│  • 进入中立矿区需要通过对方炮塔检查           │
│  • 持有"势力 NFT"才能通过己方星门            │
│  • 矿区资源每小时刷新，先到先得              │
│  • 每次采矿获得 WAR Token（联盟代币）        │
└─────────────────────────────────────────────┘
```

---

## 合约架构设计

```
war_game/
├── Move.toml
└── sources/
    ├── faction_nft.move    # 势力 NFT（加入联盟的凭证）
    ├── war_token.move      # WAR Token（战争代币）
    ├── faction_gate.move   # 星门扩展（势力检查）
    ├── faction_turret.move # 炮塔扩展（enemy 检测）
    ├── mining_depot.move   # 矿区存储箱扩展（资源采集）
    └── war_registry.move   # 游戏注册表（全局状态）
```

---

## 第一部分：核心合约

### `faction_nft.move`

```
module war_game::faction_nft;

use sui::object::{Self, UID};
use sui::transfer;
use std::string::{Self, String, utf8};

public struct FACTION_NFT has drop {}

/// 势力枚举
const FACTION_ALPHA: u8 = 0;
const FACTION_BETA: u8 = 1;

/// 势力 NFT（入盟证明）
public struct FactionNFT has key, store {
    id: UID,
    faction: u8,                // 0 = Alpha, 1 = Beta
    member_since_ms: u64,
    name: String,
}

public struct WarAdminCap has key, store { id: UID }

public fun enlist(
    _admin: &WarAdminCap,
    faction: u8,
    member_name: vector<u8>,
    recipient: address,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(faction == FACTION_ALPHA || faction == FACTION_BETA, EInvalidFaction);
    let nft = FactionNFT {
        id: object::new(ctx),
        faction,
        member_since_ms: clock.timestamp_ms(),
        name: utf8(member_name),
    };
    transfer::public_transfer(nft, recipient);
}

public fun get_faction(nft: &FactionNFT): u8 { nft.faction }
public fun is_alpha(nft: &FactionNFT): bool { nft.faction == FACTION_ALPHA }
public fun is_beta(nft: &FactionNFT): bool { nft.faction == FACTION_BETA }

const EInvalidFaction: u64 = 0;
```

### `war_token.move`

```
module war_game::war_token;

/// WAR Token（标准 Coin 设计，参考 Chapter 14）
public struct WAR_TOKEN has drop {}

fun init(witness: WAR_TOKEN, ctx: &mut TxContext) {
    let (treasury, metadata) = sui::coin::create_currency(
        witness, 6, b"WAR", b"War Token",
        b"Earned through combat and mining in the Space Resource War",
        option::none(), ctx,
    );
    transfer::public_transfer(treasury, ctx.sender());
    transfer::public_freeze_object(metadata);
}
```

### `faction_gate.move`（星门扩展）

```
module war_game::faction_gate;

use war_game::faction_nft::{Self, FactionNFT};
use world::gate::{Self, Gate};
use world::character::Character;
use sui::clock::Clock;
use sui::tx_context::TxContext;

public struct AlphaGateAuth has drop {}
public struct BetaGateAuth has drop {}

/// Alpha 联盟星门：只允许 Alpha 成员通过
public fun alpha_gate_jump(
    source_gate: &Gate,
    dest_gate: &Gate,
    character: &Character,
    faction_nft: &FactionNFT,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(faction_nft::is_alpha(faction_nft), EWrongFaction);
    gate::issue_jump_permit(
        source_gate, dest_gate, character, AlphaGateAuth {},
        clock.timestamp_ms() + 30 * 60 * 1000, ctx,
    );
}

/// Beta 联盟星门
public fun beta_gate_jump(
    source_gate: &Gate,
    dest_gate: &Gate,
    character: &Character,
    faction_nft: &FactionNFT,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(faction_nft::is_beta(faction_nft), EWrongFaction);
    gate::issue_jump_permit(
        source_gate, dest_gate, character, BetaGateAuth {},
        clock.timestamp_ms() + 30 * 60 * 1000, ctx,
    );
}

const EWrongFaction: u64 = 0;
```

### `mining_depot.move`（矿区核心）

```
module war_game::mining_depot;

use war_game::faction_nft::{Self, FactionNFT};
use war_game::war_token::WAR_TOKEN;
use world::storage_unit::{Self, StorageUnit};
use world::character::Character;
use sui::coin::{Self, TreasuryCap};
use sui::clock::Clock;
use sui::object::{Self, UID};
use sui::event;

public struct MiningAuth has drop {}

/// 矿区状态
public struct MiningDepot has key {
    id: UID,
    resource_count: u64,       // 当前可采数量
    last_refresh_ms: u64,      // 上次刷新时间
    refresh_amount: u64,       // 每次刷新补充量
    refresh_interval_ms: u64,  // 刷新间隔
    alpha_total_mined: u64,
    beta_total_mined: u64,
}

public struct ResourceMined has copy, drop {
    miner: address,
    faction: u8,
    amount: u64,
    faction_total: u64,
}

/// 采矿（同时检查势力 NFT 并发放 WAR Token 奖励）
public fun mine(
    depot: &mut MiningDepot,
    storage_unit: &mut StorageUnit,
    character: &Character,
    faction_nft: &FactionNFT,       // 需要势力认证
    war_treasury: &mut TreasuryCap<WAR_TOKEN>,
    amount: u64,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // 自动刷新资源
    maybe_refresh(depot, clock);

    assert!(amount > 0 && amount <= depot.resource_count, EInsufficientResource);

    depot.resource_count = depot.resource_count - amount;

    // 根据势力更新统计
    let faction = faction_nft::get_faction(faction_nft);
    if faction == 0 {
        depot.alpha_total_mined = depot.alpha_total_mined + amount;
    } else {
        depot.beta_total_mined = depot.beta_total_mined + amount;
    };

    // 取出资源（从 SSU）
    // storage_unit::withdraw_batch(storage_unit, character, MiningAuth {}, RESOURCE_TYPE_ID, amount, ctx)

    // 发放 WAR Token 奖励（每单位资源 = 10 WAR）
    let war_reward = amount * 10_000_000; // 10 WAR per unit，6 decimals
    let war_coin = sui::coin::mint(war_treasury, war_reward, ctx);
    sui::transfer::public_transfer(war_coin, ctx.sender());

    event::emit(ResourceMined {
        miner: ctx.sender(),
        faction,
        amount,
        faction_total: if faction == 0 { depot.alpha_total_mined } else { depot.beta_total_mined },
    });
}

fun maybe_refresh(depot: &mut MiningDepot, clock: &Clock) {
    let now = clock.timestamp_ms();
    if now >= depot.last_refresh_ms + depot.refresh_interval_ms {
        depot.resource_count = depot.resource_count + depot.refresh_amount;
        depot.last_refresh_ms = now;
    }
}

const EInsufficientResource: u64 = 0;
```

---

## 第二部分：战报实时 dApp

```
// src/WarDashboard.tsx
import { useState, useEffect } from 'react'
import { useRealtimeEvents } from './hooks/useRealtimeEvents'
import { useCurrentClient } from '@mysten/dapp-kit-react'
import { useConnection } from '@evefrontier/dapp-kit'

const WAR_PKG = "0x_WAR_PACKAGE_"
const DEPOT_ID = "0x_DEPOT_ID_"

interface DepotState {
  resource_count: string
  alpha_total_mined: string
  beta_total_mined: string
  last_refresh_ms: string
}

interface MiningEvent {
  miner: string
  faction: string
  amount: string
  faction_total: string
}

const FACTION_COLOR = { '0': '#3B82F6', '1': '#EF4444' } // Alpha=蓝, Beta=红
const FACTION_NAME = { '0': 'Alpha 联盟', '1': 'Beta 联盟' }

export function WarDashboard() {
  const { isConnected, currentAddress } = useConnection()
  const client = useCurrentClient()
  const [depot, setDepot] = useState<DepotState | null>(null)
  const [nextRefreshIn, setNextRefreshIn] = useState(0)

  // 加载矿区状态
  const loadDepot = async () => {
    const obj = await client.getObject({ id: DEPOT_ID, options: { showContent: true } })
    if (obj.data?.content?.dataType === 'moveObject') {
      setDepot(obj.data.content.fields as DepotState)
    }
  }

  useEffect(() => { loadDepot() }, [])

  // 刷新倒计时
  useEffect(() => {
    if (!depot) return
    const timer = setInterval(() => {
      const refreshInterval = 60 * 60 * 1000 // 1小时
      const nextRefresh = Number(depot.last_refresh_ms) + refreshInterval
      setNextRefreshIn(Math.max(0, nextRefresh - Date.now()))
    }, 1000)
    return () => clearInterval(timer)
  }, [depot])

  // 实时战报
  const miningEvents = useRealtimeEvents<MiningEvent>(
    `${WAR_PKG}::mining_depot::ResourceMined`,
    { maxEvents: 20 }
  )

  useEffect(() => {
    if (miningEvents.length > 0) loadDepot() // 有采矿事件就刷新矿区状态
  }, [miningEvents])

  // 计算领土控制百分比
  const alpha = Number(depot?.alpha_total_mined ?? 0)
  const beta = Number(depot?.beta_total_mined ?? 0)
  const total = alpha + beta
  const alphaPct = total > 0 ? Math.round(alpha * 100 / total) : 50

  return (
    <div className="war-dashboard">
      <h1>⚔️ 太空资源争夺战</h1>

      {/* 势力控制率 */}
      <section className="control-bar-section">
        <div className="control-labels">
          <span style={{ color: FACTION_COLOR['0'] }}>
            Alpha {alphaPct}%
          </span>
          <span style={{ color: FACTION_COLOR['1'] }}>
            {100 - alphaPct}% Beta
          </span>
        </div>
        <div className="control-bar">
          <div
            className="alpha-bar"
            style={{ width: `${alphaPct}%`, background: FACTION_COLOR['0'] }}
          />
        </div>
      </section>

      {/* 矿区状态 */}
      <section className="depot-status">
        <div className="stat-card">
          <span>⛏ 剩余资源</span>
          <strong>{depot?.resource_count ?? '-'}</strong>
        </div>
        <div className="stat-card">
          <span>⏳ 下次刷新</span>
          <strong>{Math.ceil(nextRefreshIn / 60000)} 分钟</strong>
        </div>
        <div className="stat-card alpha">
          <span style={{ color: FACTION_COLOR['0'] }}>Alpha 采矿总量</span>
          <strong>{depot?.alpha_total_mined ?? '-'}</strong>
        </div>
        <div className="stat-card beta">
          <span style={{ color: FACTION_COLOR['1'] }}>Beta 采矿总量</span>
          <strong>{depot?.beta_total_mined ?? '-'}</strong>
        </div>
      </section>

      {/* 实时战报 */}
      <section className="battle-log">
        <h3>📡 实时战报</h3>
        {miningEvents.length === 0 ? (
          <p className="quiet">矿区沉寂中...</p>
        ) : (
          <ul>
            {miningEvents.map((e, i) => (
              <li
                key={i}
                style={{ borderLeftColor: FACTION_COLOR[e.faction as '0' | '1'] }}
              >
                <span className="faction-tag" style={{ color: FACTION_COLOR[e.faction as '0' | '1'] }}>
                  [{FACTION_NAME[e.faction as '0' | '1']}]
                </span>
                {e.miner.slice(0, 8)}... 采集了 {e.amount} 单位资源
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
```

---

## 完整部署流程

```
# 1. 编译并发布合约
cd war_game
sui move build
sui client publish --gas-budget 200000000

# 2. 初始化游戏对象
# 运行 scripts/init-game.ts：创建 MiningDepot、注册星门/炮塔扩展

# 3. 测试角色入盟
# scripts/enlist-player.ts：给测试玩家发放 FactionNFT

# 4. 启动 dApp
cd dapp
npm run dev
```

---

## 🎯 知识综合运用

| 本课程知识点                 | 在本例的应用                                        |
| ---------------------- | --------------------------------------------- |
| Chapter 3：Witness 模式   | `MiningAuth`, `AlphaGateAuth`, `BetaGateAuth` |
| Chapter 4：组件扩展注册       | 炮塔 + 星门 + 存储箱均有独立扩展                           |
| Chapter 5：dApp + Hooks | `useRealtimeEvents` 驱动战报实时更新                  |
| Chapter 11：OwnerCap    | 联盟 Leader 持有各组件的 OwnerCap                     |
| Chapter 12：事件系统        | `ResourceMined` 事件驱动 dApp                     |
| Chapter 14：代币经济        | WAR Token 作为采矿奖励                              |
| Chapter 17：安全审计        | 权限验证 + 资源不超量扣减                                |
| Chapter 23：发布流程        | 多合约同时发布 + 初始化脚本                               |
| Chapter 8：赞助交易         | 炮塔攻击验证需服务器签名                                  |
| Chapter 9：GraphQL      | 实时查询矿区和战役状态                                   |
| Chapter 15：跨合约         | mining_depot 调用 faction_nft 的只读视图             |
| Chapter 13：NFT         | FactionNFT 的 Display 展示势力信息                   |

## 54. Chapter 33: zkLogin 原理与设计 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-33.html

# 第33章：EVE Vault 钱包概述——zkLogin 原理与设计

**学习目标**：理解 EVE Vault 是什么，它为什么使用 zkLogin 而不是传统私钥，以及 zkLogin 的完整密码学工作原理。

---

状态：源码导读。密码学细节以 EVE Vault 当前实现和 Sui zkLogin 机制为准，正文偏重架构理解。

## 最小调用链

`FusionAuth/OAuth 登录 -> 回调拿 code -> 交换 token -> 派生 zkLogin 地址 -> 保存登录态 -> 钱包可签名`

## 对应代码目录

- [evevault](https://github.com/evefrontier/evevault)

## 1. EVE Vault 是什么？

EVE Vault 是 EVE Frontier 的专属 **Chrome 浏览器扩展钱包**，基于以下技术栈构建：

| 层     | 技术                              | 用途               |
| ----- | ------------------------------- | ---------------- |
| 扩展框架  | WXT + Chrome MV3                | 跨浏览器扩展构建         |
| UI 框架 | React + TanStack Router         | 弹窗和审批页面          |
| 状态管理  | Zustand + Chrome Storage        | 持久化用户状态          |
| 区块链   | Sui Wallet Standard             | dApp 发现与交互协议     |
| 身份认证  | EVE Frontier FusionAuth (OAuth) | EVE 游戏账户登录       |
| 地址派生  | Sui zkLogin + Enoki             | 从 OAuth 身份派生链上地址 |

## 55. Chapter 34: 技术架构与开发部署 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-34.html

# 第34章：EVE Vault 技术架构与开发部署

**学习目标**：理解 EVE Vault 的 Chrome MV3 架构（5 层脚本、消息协议、Keeper 安全容器），掌握本地构建和调试扩展的完整流程，以及 Monorepo 中各包的分工。

---

状态：源码导读。适合边读文档边打开扩展入口点与 background 代码核对消息流。

## 最小调用链

`页面/内容脚本请求 -> background 分发消息 -> keeper 保护敏感状态 -> 审批页签名 -> 响应回发到调用方`

## 对应代码目录

- [evevault](https://github.com/evefrontier/evevault)

## 1. 项目结构（Monorepo）

```
evevault/
├── apps/
│   ├── extension/          # Chrome MV3 扩展（主体）
│   │   ├── entrypoints/    # WXT 入口点（每个 = 一个独立页面/脚本）
│   │   │   ├── background.ts        # Service Worker（后台常驻）
│   │   │   ├── content.ts           # 内容脚本（每个页面注入）
│   │   │   ├── injected.ts          # 页面上下文脚本（注册钱包）
│   │   │   ├── popup/               # 扩展弹窗
│   │   │   ├── sign_transaction/    # 交易审批页
│   │   │   ├── sign_sponsored_transaction/ # 赞助交易审批页
│   │   │   ├── sign_personal_message/     # 消息签名审批页
│   │   │   ├── sign_and_execute_transaction/
│   │   │   └── keeper/              # 安全密钥容器
│   │   └── src/
│   │       ├── features/   # 功能模块（auth、wallet）
│   │       ├── lib/        # 核心库（adapters、background、utils）
│   │       └── routes/     # React 路由（TanStack Router）
│   └── web/                # Web 版本（即将推出）
└── packages/
    └── shared/             # 跨 app 共享：类型、Sui 客户端、工具函数
        └── src/
            ├── types/      # 消息类型、钱包类型、认证类型
            ├── sui/        # SuiClient、GraphQL 客户端
            └── auth/       # Enoki 集成、zkLogin 工具
```

**构建工具**：Bun（包管理）+ Turborepo（构建缓存）+ WXT（扩展框架）

Monorepo 这里真正值得理解的是：

Vault 不是一个单页扩展，而是一组彼此隔离、通过消息协议协作的子系统。

所以看目录时，最好不要只看“文件在哪”，而是看“哪层持有哪些权力”。

---

## 2. Chrome MV3 的 5 层脚本架构

这 5 层架构真正解决的是浏览器扩展里的安全矛盾：

- dApp 需要一个好接入的钱包接口
- 但敏感状态又不能暴露给任意页面脚本

所以架构被刻意拆成：

- 页面层可发现
- 中转层可通信
- 后台层可调度
- Keeper 层可保密
- 审批页可让用户做最终确认

Chrome MV3 扩展中各脚本的隔离边界和通信方式：

```
┌──────────────────── 浏览器 Tab（网页）───────────────────────┐
│                                                               │
│  dApp（网页 JavaScript）                                       │
│      ↕ wallet-standard API（同进程调用）                      │
│  injected.ts ← 由 content.ts 注入到页面进程                   │
│      EveVaultWallet 类注册到 @mysten/wallet-standard           │
└───────────────────────────────────────────────────────────────┘
               ↕ window.postMessage（跨进程）
┌──────────────────── Chrome Extension 进程 ────────────────────┐
│  content.ts（内容脚本）                                        │
│      转发：页面 → background                                  │
│      转发：background → 页面                                  │
└───────────────────────────────────────────────────────────────┘
               ↕ chrome.runtime.sendMessage
┌──────────────────── Service Worker ────────────────────────────┐
│  background.ts                                                  │
│      OAuth 流程、Token 交换、Storage 管理                      │
│      处理签名请求（转发给 Keeper）                             │
│      ↕ chrome.runtime Port                                    │
│  keeper.ts（隐藏 iframe，内存安全容器）                        │
│      存储临时私钥（不写 chrome.storage）                       │
└─────────────────────────────────────────────────────────────────┘
               ↕ chrome.runtime.sendMessage
┌──────────────────── Extension Pages ───────────────────────────┐
│  popup/               ← 点击扩展图标显示                       │
│  sign_transaction/    ← 交易审批弹窗                           │
│  sign_sponsored_transaction/ ← 赞助交易审批                   │
│  sign_personal_message/ ← 消息签名审批                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 消息系统（Message Protocol）

消息协议为什么是扩展系统的生命线？

因为这套扩展不是靠函数直接互调，而是靠跨进程消息驱动。

一旦消息类型、字段语义或响应约定变得混乱，就会出现最难排查的问题：

- 页面看起来请求发出去了
- background 也收到了
- 但 keeper 或审批页返回的语义已经不一致

所以这类系统里，消息协议本身就是“接口标准”。

所有跨进程通信通过标准化的消息类型定义：

```
// packages/shared/src/types/messages.ts

// 认证相关消息
export enum AuthMessageTypes {
    AUTH_SUCCESS = "auth_success",
    AUTH_ERROR = "auth_error",
    EXT_LOGIN = "ext_login",
    REFRESH_TOKEN = "refresh_token",
}

// Vault（加密容器）消息
export enum VaultMessageTypes {
    UNLOCK_VAULT = "UNLOCK_VAULT",
    LOCK = "LOCK",
    CREATE_KEYPAIR = "CREATE_KEYPAIR",
    GET_PUBLIC_KEY = "GET_PUBLIC_KEY",
    ZK_EPH_SIGN_BYTES = "ZK_EPH_SIGN_BYTES",  // 用临时私钥签名
    SET_ZKPROOF = "SET_ZKPROOF",
    GET_ZKPROOF = "GET_ZKPROOF",
    CLEAR_ZKPROOF = "CLEAR_ZKPROOF",
}

// Wallet Standard 相关（dApp 触发）
export enum WalletStandardMessageTypes {
    SIGN_PERSONAL_MESSAGE = "sign_personal_message",
    SIGN_TRANSACTION = "sign_transaction",
    SIGN_AND_EXECUTE_TRANSACTION = "sign_and_execute_transaction",
    EVEFRONTIER_SIGN_SPONSORED_TRANSACTION = "sign_sponsored_transaction",
}

// Keeper 安全容器消息
export enum KeeperMessageTypes {
    READY = "KEEPER_READY",
    CREATE_KEYPAIR = "KEEPER_CREATE_KEYPAIR",
    UNLOCK_VAULT = "KEEPER_UNLOCK_VAULT",
    GET_PUBLIC_KEY = "KEEPER_GET_KEY",
    EPH_SIGN = "KEEPER_EPH_SIGN",       // 临时私钥签名
    CLEAR_EPHKEY = "KEEPER_CLEAR_EPHKEY",
    SET_ZKPROOF = "KEEPER_SET_ZKPROOF",
    GET_ZKPROOF = "KEEPER_GET_ZKPROOF",
    CLEAR_ZKPROOF = "KEEPER_CLEAR_ZKPROOF",
}
```

### 消息流：dApp 签名请求的完整路径

```
dApp 调用 wallet.signTransaction(tx)
    ↓ wallet-standard（同进程）
injected.ts (EveVaultWallet.signTransaction)
    ↓ window.postMessage({ type: "sign_transaction", ... })
content.ts
    ↓ chrome.runtime.sendMessage(...)
background.ts（walletHandlers.ts）
    → 打开 sign_transaction 审批窗口
    ← 用户点击"同意"
    → 发消息给 Keeper
    ↓ chrome.runtime Port
keeper.ts
    → 用临时私钥签名
    → 返回 ZK Proof + 签名
    ↓ chrome.runtime Port
background.ts
    ↓ chrome.runtime.sendMessage
content.ts
    ↓ window.postMessage
injected.ts
    → 返回 SignedTransaction 给 dApp
```

---

## 4. Wallet Standard 实现（SuiWallet.ts）

EVE Vault 通过实现 `@mysten/wallet-standard` 的 `Wallet` 接口，让所有支持 Wallet Standard 的 dApp 自动发现它：

```
// apps/extension/src/lib/adapters/SuiWallet.ts

export class EveVaultWallet implements Wallet {
    readonly #version = "1.0.0" as const;
    readonly #name = "Eve Vault" as const;

    // 支持的 Sui 网络链
    get chains(): Wallet["chains"] {
        return [SUI_TESTNET_CHAIN, SUI_DEVNET_CHAIN] as `sui:${string}`[];
    }

    // 实现的 Wallet Standard 功能
    get features() {
        return {
            [StandardConnect]: { connect: this.#connect },
            [StandardDisconnect]: { disconnect: this.#disconnect },
            [StandardEvents]: { on: this.#on },
            [SuiSignTransaction]: { signTransaction: this.#signTransaction },
            [SuiSignAndExecuteTransaction]: { signAndExecuteTransaction: this.#signAndExecuteTransaction },
            [SuiSignPersonalMessage]: { signPersonalMessage: this.#signPersonalMessage },
            // EVE Frontier 专有扩展特性
            [EVEFRONTIER_SPONSORED_TRANSACTION]: {
                signSponsoredTransaction: this.#signSponsoredTransaction,
            },
        };
    }
}
```

### 注册到页面（injected.ts）

```
// apps/extension/entrypoints/injected.ts
import { registerWallet } from "@mysten/wallet-standard";
import { EveVaultWallet } from "../src/lib/adapters/SuiWallet";

// 在页面加载时立即注册
registerWallet(new EveVaultWallet());
```

dApp 通过 `@mysten/wallet-standard` 的 `getWallets()` 自动发现 `EveVaultWallet`，无需任何特殊集成。

---

## 5. Keeper：安全密钥容器

Keeper 是 EVE Vault 最独特的安全设计——临时私钥永远不离开 Keeper 进程的内存：

```
// apps/extension/entrypoints/keeper/keeper.ts

// Keeper 处理的消息类型
switch (message.type) {
    case KeeperMessageTypes.CREATE_KEYPAIR:
        // 生成新的 Ed25519 临时密钥对
        // 私钥只在内存中，不写 chrome.storage
        break;

    case KeeperMessageTypes.EPH_SIGN:
        // 用临时私钥对字节签名
        // 只暴露签名结果，不暴露私钥
        break;

    case KeeperMessageTypes.CLEAR_EPHKEY:
        // 清除内存中的临时私钥（锁定操作）
        break;
}
```

**安全保证**：

- 临时私钥 = 内存变量，不序列化到 chrome.storage
- 浏览器关闭或 Keeper 崩溃 → 私钥自动销毁
- 重新解锁 → 重新生成新的临时密钥对
- Background/Popup 无法直接读取私钥，只能通过 Port 消息请求签名

Keeper 最重要的不是“神秘”，而是权限最小化。

它把最敏感的能力压缩成很少的几件事：

- 生成临时密钥
- 用临时密钥签名
- 清除临时密钥

除此之外，别的层尽量不要碰到私钥本体。

---

## 6. 本地开发配置

### 安装依赖

```
# 推荐使用 Bun
bun install
```

### 配置 .env

```
# apps/extension/.env
VITE_FUSION_SERVER_URL="https://auth.evefrontier.com"
VITE_FUSIONAUTH_CLIENT_ID=your-fusionauth-client-id
VITE_FUSION_CLIENT_SECRET=your-fusionauth-client-secret
VITE_ENOKI_API_KEY=your-enoki-api-key
EXTENSION_ID="your-extension-public-key"
```

### 启动开发模式

```
# 只运行扩展（推荐）
bun run dev:extension

# 运行所有 apps（扩展 + web）
bun run dev
```

开发模式下，WXT 会在 `apps/extension/.output/chrome-mv3/` 生成扩展文件，并监听文件变化自动重建。

### 在 Chrome 中加载扩展

1. 打开 `chrome://extensions`
1. 开启右上角「开发者模式」
1. 点击「加载已解压的扩展程序」
1. 选择 `apps/extension/.output/chrome-mv3/`

每次文件变化后，Chrome 会自动检测并提示更新（无需手动重新加载）。

---

## 7. 构建生产版本

```
# 构建 Chrome 扩展
bun run build:extension
# 输出：apps/extension/.output/chrome-mv3.zip

# 构建所有 apps
bun run build

# 清除所有缓存（构建时间变慢时使用）
bun run clean
```

---

## 8. FusionAuth OAuth 配置

在 FusionAuth 控制台需要添加以下重定向 URI（格式固定）：

```
https://<extension-id>.chromiumapp.org/
```

Extension ID 是 Chrome 分配的扩展唯一标识符（可在 `chrome://extensions` 页面找到）。

**必要的 OAuth 范围（Scopes）**：

- `openid`（获取 JWT 格式的 token）
- `profile`（获取用户信息）
- `email`（用户邮箱）

---

## 9. Turborepo 构建缓存

项目使用 Turborepo 加速构建：

```
# turbo.json 定义了任务并行关系
# build:extension 依赖 shared 包的构建
bun run build:extension
# → 先 build packages/shared
# → 然后 build apps/extension（使用缓存）

# 强制重新构建（忽略缓存）
bun run build --force
```

---

## 10. E2E 测试

```
# tests/e2e/ 目录包含余额查询等端到端测试
bun run test:e2e

# 测试前需要钱包已登录并配置了测试账户
# tests/e2e/helpers/state.ts 提供状态管理工具
```

---

## 本章小结

| 组件              | 层级              | 功能                                  |
| --------------- | --------------- | ----------------------------------- |
| `injected.ts`   | 页面进程            | 注册 EveVaultWallet 到 Wallet Standard |
| `content.ts`    | 内容脚本            | 消息桥接：页面 ↔ Background                |
| `background.ts` | Service Worker  | OAuth、存储、请求协调                       |
| `keeper.ts`     | 隐藏容器            | 临时私钥的安全存储与使用                        |
| `popup/`        | Extension Page  | 用户界面：登录、地址、余额                       |
| `sign_*/`       | Extension Pages | 交易/消息审批 UI                          |
| `SuiWallet.ts`  | Adapter         | Wallet Standard 完整实现                |

## 56. Chapter 35: 未来展望 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/chapter-35.html

# Chapter 35：未来展望 — ZK 证明、完全去中心化与 EVM 互操作

**目标：** 了解 EVE Frontier 和 Sui 生态的前沿技术方向，思考如何为未来的关键升级提前做好架构准备，成为站在技术前沿的构建者。

---

状态：展望章节。正文以未来技术方向和架构预留为主。

## 35.1 当前的信任假设与局限

回顾我们整个课程中的架构，有几个核心的“信任假设“：

| 环节     | 当前依赖        | 局限性       |
| ------ | ----------- | --------- |
| 临近性验证  | 游戏服务器签名     | 服务器可撒谎或宕机 |
| 位置隐私   | 服务器不泄露哈希映射  | 服务器知道所有位置 |
| 组件状态更新 | 游戏服务器提交     | 中心化瓶颈     |
| 游戏规则修改 | CCP 控制的合约升级 | 玩家无直接治理权  |

## 57. 运行指南: 如何启动案例 dApp - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/code/index.html

# EVE Frontier 案例 dApp 运行指南

为了方便你在学习实战案例时能直观地与智能合约进行交互，我们在本目录为所有 18 个 Example 分别生成了配套的 React / dApp 前端工程。

为了极大地节省磁盘空间并加快安装速度，所有的 dApp 都在这个目录（`src/code/`）被配置为了一个 **pnpm workspace (Monorepo)**。

---

## 🚀 1. 首次配置与安装

在运行任何一个案例之前，你需要先在 `src/code/` 根目录下完成依赖安装。

确保你已经安装了 [Node.js](https://nodejs.org/) 和 [pnpm](https://pnpm.io/zh/installation)。

打开终端，进入 `code` 目录：

```
cd EVE-Builder-Course/src/code
```

安装所有项目的共享依赖：

```
pnpm install
```

*(提示：这个步骤可能需要1-2分钟，取决于你的网络情况，只需执行一次。)*

---

## 🎮 2. 运行指定的案例 dApp

每一个案例（如 Example 01、Example 10）都有自己专属的前端包，命名规则为 `evefrontier-example-XX-dapp`。

假设你现在正在学习 **[Example 1: 炮塔白名单 (MiningPass)](https://hoh-zone.github.io/eve-bootcamp/example-01.html)**，你想启动它的交互界面。

在 `code` 目录下，运行以下指令：

```
pnpm run dev --filter evefrontier-example-01-dapp
```

*(你只需要把 `01` 换成你想要测试的章节编号，比如 `05`、`18` 即可)*

终端会输出类似于以下的启动信息：

```
  VITE v6.4.0  ready in 134 ms
  ➜  Local:   http://localhost:5173/
```

**点击或在浏览器打开 `http://localhost:5173/`**，你就能看到该案例专属的前端界面了！

---

## 🛠 3. 页面功能说明

打开案例页面后，你会看到：

1. **Connect EVE Vault** (右上角)：点击此按钮可拉起 EVE Vault 钱包浏览器扩展进行连接。
1. **案例主题标题**：显示当前正在测试的案例（例如：“Example 1: 炮塔白名单 (MiningPass)”）。
1. **交互动作按钮**：点击大蓝框中的功能按钮（例如：“Mint MiningPass NFT”）。 

  - 如果钱包尚未连接，会提示 `Please connect your EVE Vault wallet to interact with this dApp.`
  - 按钮点击后将自动触发对应 `target` 的 Move 合约调用，你可以在弹出的 EVE Vault 扩展面板上批准/确认这笔交易。
  - 打开浏览器的“开发者工具 (F12) -> Console”可以查看详细的交易执行日志或失败报错。

---

## 🏗 (进阶) 全部项目构建检查

如果你修改了 TypeScript 源码或 `App.tsx`，想要检查是否破坏了代码，可以在 `code` 目录使用聚合构建命令：

```
pnpm run build
```

这会顺次编译全部 18 个案例的前端代码，如果有语法错误，TS 编译器会明确给出报错的位置。

## 58. Sui 核心特性创意 100 例 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/idea/index.html

# EVE Frontier 2026 Hackathon: Sui 核心特性创意库

本目录收录了 100 个专为 EVE Frontier x Sui 黑客松设计的硬核创意。每个创意均深度结合了 Sui 的底层优势（如 PTB、Dynamic Fields、Kiosk、DeepBook 等），并分配了独立的文件以供进一步细化架构和落地方案。

## 创意列表

1. [太空闪电贷 (Space Flash Loan)](https://hoh-zone.github.io/eve-bootcamp/idea/idea_001.html) - 单笔交易直接借船-采矿-跨星区高价兜售矿产-最后还船还息，若中间任何一步亏损或被击毁则全局时空倒流回…
1. [舰队同步空投矩阵](https://hoh-zone.github.io/eve-bootcamp/idea/idea_002.html) - 一个 PTB 打包 100 名玩家的独立跳跃请求签名，确保所有人不在有任何延迟的情况下于同一个 Su…
1. [复合毁灭重铸工厂](https://hoh-zone.github.io/eve-bootcamp/idea/idea_003.html) - 在一个 PTB 内同时要求销毁（Burn）5种分布在宇宙各地的不同零件，瞬间极速原位组装（Mint）…
1. [一键脱壳求生方案](https://hoh-zone.github.io/eve-bootcamp/idea/idea_004.html) - 当主舰濒临爆炸的毫秒间，PTB 原子级执行卸载身上最值钱的高级雷达设备并转移进逃生舱对象中火速弹射…
1. [多签联合悬赏资金池](https://hoh-zone.github.io/eve-bootcamp/idea/idea_005.html) - PTB 串联多重合约逻辑验证军团高层的多方签名后，才瞬间释放联盟保险箱底层的无尽物资用于犒赏三军…
1. [过路费无感代付系统](https://hoh-zone.github.io/eve-bootcamp/idea/idea_006.html) - 大舰队雇主代替佣兵支付星门跳过路费，同时该佣兵将刚采集的矿石在同一个 PTB 内按比例反切划转给雇主…
1. [极速无缝换装快切板](https://hoh-zone.github.io/eve-bootcamp/idea/idea_007.html) - 将全套飞船机甲从“采矿特化型”零延迟一键换肤拔换所有组件切换成“防空堡垒型”…
1. [跨合约截胡套利脚本](https://hoh-zone.github.io/eve-bootcamp/idea/idea_008.html) - 利用 PTB 的前后调用链接，在这个星门低价收废料过账的同一纳秒在隔壁当做高价燃料倒满卖出…
1. [自动均分平衡油箱网](https://hoh-zone.github.io/eve-bootcamp/idea/idea_009.html) - 通过 PTB 循环读取整支舰队 50 艘所有战舰的燃料罐状态，瞬间抽取高残余并平均调配给即将干涸的船…
1. [破防暴击叠加引擎](https://hoh-zone.github.io/eve-bootcamp/idea/idea_010.html) - 在一个单一逻辑交易块之内极其夸张地连续高频调用炮塔 20 次射击函数，达成数学意义上完美的连击暴击蓄…
1. [无尽外挂外设插槽](https://hoh-zone.github.io/eve-bootcamp/idea/idea_011.html) - 打破固定飞船几个装配位的传统概念，利用动态对象字段 (DOF) 实现无限量叠加装配微型外设扫描仪…
1. [高度加密的黑匣子日志](https://hoh-zone.github.io/eve-bootcamp/idea/idea_012.html) - 将跳跃和交战敏感坐标历史直接利用 DF 深埋入飞船的极深子域结构，没有特定的检索秘钥绝对连扫都扫不出…
1. [打破体积限制的套娃虫洞储存](https://hoh-zone.github.io/eve-bootcamp/idea/idea_013.html) - 由于每个储物箱因为代码有容量极限，利用 DOF 一层层做子域嵌套实现无限套娃的超级仓库空间…
1. [鲜血进化的成长武器](https://hoh-zone.github.io/eve-bootcamp/idea/idea_014.html) - 根据炮管实际消灭人数，合约动态增加一个名为 `veteran_stats` 的额外字段来凭空拔高它的…
1. [不染核心的军团痛车涂装](https://hoh-zone.github.io/eve-bootcamp/idea/idea_015.html) - 不更改船只自身高昂昂贵的防御架构主体模块，而是只将其外部材质包的链接随时通过增删 DF 来替换展现风…
1. [极其恶毒的太空寄生虫病](https://hoh-zone.github.io/eve-bootcamp/idea/idea_016.html) - 敌方不仅是进行攻击，更是将一连串病毒字段强行插入你的飞船底层 DOF 中变成每小时都吸取护盾的不可解…
1. [全员通报动态赏金刺配贴](https://hoh-zone.github.io/eve-bootcamp/idea/idea_017.html) - 这并非系统机制，而是给全宇宙极度犯众怒的海盗飞船脑门上被全权打上并挂载永远闪亮的红名动态悬赏标签…
1. [柔性不关机税控升级台](https://hoh-zone.github.io/eve-bootcamp/idea/idea_018.html) - 不需要停止机器打补丁，星门依据通过船只，直接在底层随时以增删字段的形式扩充不同船型的精确税率小抄条款…
1. [临时日抛口令防线大钥锁](https://hoh-zone.github.io/eve-bootcamp/idea/idea_019.html) - 给本公会成员贴上时效只有半天的身份特征子字段，大白银星门仅此才敞开…
1. [防爆裂脱挂反应装甲墙](https://hoh-zone.github.io/eve-bootcamp/idea/idea_020.html) - 当飞船承受完全无法阻挡的一击致命炮火，底层逻辑主动解开并粉碎自身外部连接好的防御场对象用作绝对抵挡…
1. [企业内网专属星矿局](https://hoh-zone.github.io/eve-bootcamp/idea/idea_021.html) - 设定只允许后缀为 “@amazon.com” 或者 “@sui.io” 的专属联盟企业员工靠 zkL…
1. [Twitch 粉头门禁卡大派发](https://hoh-zone.github.io/eve-bootcamp/idea/idea_022.html) - 通过与 Twitch SSO 结合的 zkLogin 取信确认，当红游戏主播能极其轻松通过这种协议将…
1. [Discord 社群绝对权力挂钩](https://hoh-zone.github.io/eve-bootcamp/idea/idea_023.html) - 将会长的游戏内顶级操作员大锁绑定到 Discord ID 上。如果换届在群里发生变更游戏内政权无缝由…
1. [了无痕迹的无名卧底信使](https://hoh-zone.github.io/eve-bootcamp/idea/idea_024.html) - 不创建繁琐的 Web3 链子交互，直接利用极高匿名和用完即抛特点随便乱填临时邮箱创建超脱主号外且无法…
1. [防肉鸡挂机邮箱强验证门](https://hoh-zone.github.io/eve-bootcamp/idea/idea_025.html) - 那些刷子和脚本当试图穿越极度肥沃且严密封锁核心带星门时会弹跳弹窗必须到绑的实体邮箱收一个动态验证码进…
1. [地球地缘锚定局域国战](https://hoh-zone.github.io/eve-bootcamp/idea/idea_026.html) - 运用 Web2 天然能够捕抓物理定位与 IP 并和该次验证登录进行硬锚定，强行构建一个限制比如北美玩…
1. [极其小白甚至白痴的傻瓜一键找回遗产库](https://hoh-zone.github.io/eve-bootcamp/idea/idea_027.html) - 由于极其简单依靠 OAuth 和社交账号的背书验证特性。即便被清空密码新手也能一键光复自己当初那条破…
1. [跨不同游历世界同源生态大成就共享箱](https://hoh-zone.github.io/eve-bootcamp/idea/idea_028.html) - 通过这一同源技术接口你如果在以太坊曾经某个链游是个屠龙大师系统查验直接跨游发放你在这个大乱斗服一台黄…
1. [防盗库线下现实闹钟联动警报器触发极点](https://hoh-zone.github.io/eve-bootcamp/idea/idea_029.html) - 这甚至不是游戏内的炮火！一旦星门被强行爆破黑客攻击它直接调回 Web2 直接拨打这账号身后预存现实手…
1. [成年人分级豪赌深暗冰冷不设防极恶区域网关](https://hoh-zone.github.io/eve-bootcamp/idea/idea_030.html) - 这绝对不会放进小孩去因为这里涉及极大血腥残忍并且极大 SUI 大额搏杀，进入大门利用此必须强过政府级…
1. [宇宙洗牌跳楼机虫洞引擎](https://hoh-zone.github.io/eve-bootcamp/idea/idea_031.html) - 抛开航道把命压上全扔进去！闭眼推杆之后，将有一半可能一飞冲天抵达满是资源伊甸园或者当场掉进全是恶鬼星…
1. [致残极其拼人品薛定谔急救补给包修理台](https://hoh-zone.github.io/eve-bootcamp/idea/idea_032.html) - 投入天价不二价 10 SUI：里面有 50% 极其逆天拉满机体到极品战斗满编全状态；但甚至有 50%…
1. [暴走跳弹几率折射偏移仪强化塔](https://hoh-zone.github.io/eve-bootcamp/idea/idea_033.html) - 它不是每次给加成 5% 极其枯燥设定；开火伤害极其看脸每一次炮击可能只打出零星抓痒数值也可能暴起一击…
1. [海选捡垃圾废墟大奖盲盒打捞钩爪臂](https://hoh-zone.github.io/eve-bootcamp/idea/idea_034.html) - 在清扫成千上万一堆破烂残骸碎片里混杂极大极微弱的抽奖池掉落库。没准一抓钩下去你成为了全宇宙那个抽得最…
1. [极其残酷且没道理恶劣外星宇宙引力天气系统台](https://hoh-zone.github.io/eve-bootcamp/idea/idea_035.html) - 每日正午由链上掷出的这惊天大骰子来强制决定这一天是会发生全宇宙掉半血削弱以及大引力减速和各种恶狠狠负…
1. [完全无逻辑瞎逛流窜神秘财宝飞箱怪](https://hoh-zone.github.io/eve-bootcamp/idea/idea_036.html) - 系统彻底解放由这个真随机乱跑到处生成大黑箱；你需要到处跑甚至这宝物怪自己都不知自己将刷新在哪，极大丰…
1. [只能活出一人绝命毒师对决生还转盘绞肉门](https://hoh-zone.github.io/eve-bootcamp/idea/idea_037.html) - 两个已经把身家性命打烂甚至结下死仇大联盟长不仅单挑并进密室锁定然后彻底交由程序抽签，三秒后大门打开一…
1. [全盘皆乱大洗牌矿带成分狂乱变异变点重生地带](https://hoh-zone.github.io/eve-bootcamp/idea/idea_038.html) - 每天只要开采枯竭，系统就会通过摇号随机去彻底把下次不仅重生纯度、出产、连带种类元素像乱配对一样极其杂…
1. [大轮盘恶霸强盗海关碰碰运气全免或者被彻底搜刮榨取交费站](https://hoh-zone.github.io/eve-bootcamp/idea/idea_039.html) - 他不仅连个固定定价都不贴你要想过去你就自己按大转轮！如果小可能彻底免费让你开心离去，但要是大那是毫不…
1. [自适应变色龙绝境反弹反击大装甲层防卫甲](https://hoh-zone.github.io/eve-bootcamp/idea/idea_040.html) - 每次受到伤害时在接受瞬间由那个随机转数瞬间当场改变其各种属性抗性反克，不仅能反克甚至还会弹出各种极其…
1. [入会即签卖身契换来的傻瓜全免打工特惠包租卡](https://hoh-zone.github.io/eve-bootcamp/idea/idea_041.html) - 新矿工一穷二白？军团大老板帮你包下你在里面的每一铲子甚至每一个呼吸每一脚油门费用，全部走它那深不见底…
1. [免费大路看似宽阔且极其阴毒深渊大门伪善剥皮星区过站台](https://hoh-zone.github.io/eve-bootcamp/idea/idea_042.html) - 星门挂大喇叭完全不收你一分过门路水费极大勾引你经过，但在条款微小并且极其难发现的深处通过你的授权抽走…
1. [商城极致体验免车船税狂飙极测试飞车场](https://hoh-zone.github.io/eve-bootcamp/idea/idea_043.html) - 给你顶配好船但是限定的不是燃料而是极具只在当前系统和这极大极其狂野的一个钟头试驾时间里，你疯狂甩炮和…
1. [大爱无疆公益超速保险死无全尸回家大火箭秒级复苏单](https://hoh-zone.github.io/eve-bootcamp/idea/idea_044.html) - 当极具惨烈被爆机瞬间连全尸都没留下，红叉公益系统不需要由于你在这个时刻连按出来的仅有几毫厘的气数直接…
1. [拉皮条裂变传销吸粉体验巨主播引流金大管道链](https://hoh-zone.github.io/eve-bootcamp/idea/idea_045.html) - 主播为了增加观众群只要你点击那个入驻小字号哪怕是什么都不懂摸黑砸砸开两枪，那些全由主播大后台直接全赞…
1. [纯善贫民窟哪怕低安区甚至是那些垃圾聚集大黑洞免费大低保充电急救区](https://hoh-zone.github.io/eve-bootcamp/idea/idea_046.html) - 在这个极其惨绝人寰绝境下这是一个散发神性光辉纯由大佬建立的免费急救区，不仅完全免费而且由于极其可怜完…
1. [挂包极其彻底托管后台机器人无脑大打钱脚本协议挂载插件](https://hoh-zone.github.io/eve-bootcamp/idea/idea_047.html) - 免除了每天自己各种烦躁点击，哪怕是你用来跑挂机脚本文消耗系统运算摩擦费用全让你那个托管的无所不包的后…
1. [全包揽订阅大金主星空大土豪畅玩这星区专属尊贵 VIP 通行全免黑卡机制](https://hoh-zone.github.io/eve-bootcamp/idea/idea_048.html) - 交足大这天价 SUI 保镖月租金之后你哪怕在这个大指定区里每一秒按住这镭射炮狂轰滥炸扫了几千上万次都…
1. [终极全服总动员并且不惜一切代价哪怕打空大金库燃烧到底全战争机器打响不计这极其庞大国力损耗大豁免打通特批最高总法令](https://hoh-zone.github.io/eve-bootcamp/idea/idea_049.html) - 当极具两方全服大决战这个统率直接拉开最牛的极其恐怖智能赞助条令让底层敢死队能够毫无顾虑放肆极其夸大超…
1. [极其贴切且符合各种巨大联盟不仅出纳以及会计极为严丝合缝报销并且甚至极大体现后勤大体制完全报表对账补偿大系统台应用](https://hoh-zone.github.io/eve-bootcamp/idea/idea_050.html) - 完美解决由于引公采办一草一木由于因公导致这个耗损甚至是这磨损完全自动化报销补偿给前线打工人的智能福利…
1. [垄断式战争武装专营店](https://hoh-zone.github.io/eve-bootcamp/idea/idea_051.html) - 顶级火炮只能从我开设的 Kiosk 中买，且任何人之后倒卖这尊火炮，都会被原制造者无视任何市场系统强…
1. [纯血军团内部黑心国营商会](https://hoh-zone.github.io/eve-bootcamp/idea/idea_052.html) - 利用 Kiosk 设置白名单条件，这儿的平价军需只能验证你是否佩戴公会特定徽章才能进行购买，外人花一…
1. [绝地禁售防黄牛大锁限令](https://hoh-zone.github.io/eve-bootcamp/idea/idea_053.html) - 限定某些超级功勋战舰 NFT 就算在 Kiosk 里挂售也无法被任意转移，彻底切断一切二手市场交易和…
1. [有时效的不见光租赁黑展柜](https://hoh-zone.github.io/eve-bootcamp/idea/idea_054.html) - 将飞船放进 Kiosk 设定“Rent”借出给别人开，租期结束不仅它无论宇宙何处都会在瞬间被强制剥夺…
1. [密封盲拍极品暗网拍卖行](https://hoh-zone.github.io/eve-bootcamp/idea/idea_055.html) - 利用 Kiosk 特性和密文出价，暗拍极度稀缺的绝版高级星门建城执照，价高者得但互不知道底牌…
1. [强制分润大海盗分赃协定](https://hoh-zone.github.io/eve-bootcamp/idea/idea_056.html) - 这几个海盗团队将抢来的船只挂在 Kiosk 出售，规定售出资金强行瞬间无误差平分为 5 份打给 5 …
1. [跨服恶霸星门承包权流转](https://hoh-zone.github.io/eve-bootcamp/idea/idea_057.html) - 这口大星门的管理和所有权作为 Kiosk 展品上架，任何土豪只要有钱都可以用预设极高违约溢价强行盘下…
1. [纯粹摆显土豪艺术家飞船玻璃大展厅](https://hoh-zone.github.io/eve-bootcamp/idea/idea_058.html) - 不卖只炫耀！专攻审美的土豪购买全服第一台艺术旗舰放入不提供贩售价格仅仅供人仰望并设置成只要点赞才能查…
1. [自适应跳楼折旧大甩卖二手黑车行](https://hoh-zone.github.io/eve-bootcamp/idea/idea_059.html) - 一旦出过事故每经过一次转手倒卖或者损坏修理再进入，Kiosk 的挂盘出售系统标价会自动由于战损痕迹强…
1. [隐去真名大黑市洗钱符文深空网](https://hoh-zone.github.io/eve-bootcamp/idea/idea_060.html) - 挂上 Kiosk 时强行利用隐私或者代理逻辑去剥离卖家真实交易地址的深网黑市流转，从而完全规避任何大…
1. [即时无滑点燃料挂单闪兑深池](https://hoh-zone.github.io/eve-bootcamp/idea/idea_061.html) - 不需要慢悠悠匹配，通过 DeepBook 构建全链的矿物/燃料交易对大单墙，矿工拉着矿船直接一键按最…
1. [超高频极速差价真空无损搬砖机](https://hoh-zone.github.io/eve-bootcamp/idea/idea_062.html) - 全自动化监听运行于各个 DeepBook 接口极远星系之间的矿石微小差价，通过算法控制飞船穿梭疯狂做…
1. [暗夜战争物资恐慌期货做空机](https://hoh-zone.github.io/eve-bootcamp/idea/idea_063.html) - 拥有绝密情报预判敌方即将惨败而且资源大崩溃，赶在消息走漏前在 DeepBook 上面用高杠杆挂上并且…
1. [巨无霸军团级国家大金库资金护盘做市](https://hoh-zone.github.io/eve-bootcamp/idea/idea_064.html) - 为了公会大计直接将联盟税收那些富可敌国海量 SUI 和海量燃料组成的特大池子注入特定 DeepBoo…
1. [绝命限价止损斩仓连逃带跑逃生舱](https://hoh-zone.github.io/eve-bootcamp/idea/idea_065.html) - 当飞船处于危险血量大残即将全军覆没时，通过连接程序设定触发特定危急价位会自动通过连入该星门 Deep…
1. [战时即崩极高压借贷大平仓引擎](https://hoh-zone.github.io/eve-bootcamp/idea/idea_066.html) - 你抵押了星门贷款买巨炮去装逼，当敌方开始攻打你的星系，抵押大门由于地价剧烈贬值，这个 DeFi 合约…
1. [打爆不仅人死甚至瞬间还要大爆仓破产倾家荡产大杠杆狂赚合约](https://hoh-zone.github.io/eve-bootcamp/idea/idea_067.html) - 这帮亡命赌徒抵押飞船开上了 100 倍恐怖杠杆去博 SUI 涨跌大走势，一旦看走眼不仅在链上你血本无…
1. [极度跨星区全联盟大通证跨服资产综合权重大指数基金](https://hoh-zone.github.io/eve-bootcamp/idea/idea_068.html) - 将其全部打包直接发行一款包含这些最高级矿物指数成分汇总而且极大分量的联合大 ETF 代币公然送上了交…
1. [全链反向对冲大灾难黑天鹅大爆船险 (Credit Default Swap)](https://hoh-zone.github.io/eve-bootcamp/idea/idea_069.html) - 一旦那个最大土豪特定那一艘史诗级战列舰极其意外遭毁不仅会立刻触发兑现巨额期权衍生品超级赔付资金大套死…
1. [全能极限聚合大 DEX 通道吃尽天下星门](https://hoh-zone.github.io/eve-bootcamp/idea/idea_070.html) - 任何人通过星门时，这机器不仅自动给你传送而且会在全网各种价单上给你匹配寻找最优价，将你过往垃圾残碎矿…
1. [易读导航指路信标超级大站长定位](https://hoh-zone.github.io/eve-bootcamp/idea/idea_071.html) - 用极其清晰的 `base.alliance.sui` 取代那些让人不可能记住的繁杂大合约极大对象这一…
1. [全游最高通缉大红榜](https://hoh-zone.github.io/eve-bootcamp/idea/idea_072.html) - 只要向全系统广播 `kill.boss.sui` 这样简单粗暴且悬赏极高惹眼的大域名，所有人立刻闻风…
1. [跨次元超级大金主星门网冠名](https://hoh-zone.github.io/eve-bootcamp/idea/idea_073.html) - 财力极佳的巨型联盟不仅自己盖星门更是将其命名为现实著名商业大品牌 `redbull.sui`，借此拿…
1. [真假大将军防伪克隆标识铭牌](https://hoh-zone.github.io/eve-bootcamp/idea/idea_074.html) - 最高统帅直接绑定 `commander-john.sui` 杜绝敌人使用假马甲乱入频道发号施令…
1. [国别改朝换代全网交接大系统](https://hoh-zone.github.io/eve-bootcamp/idea/idea_075.html) - 由于一切公国资产大权直接绑定在 `king.blood.sui` 之上，转手该域名意味着瞬间将整个王…
1. [极紧迫生死相搏求救短地址](https://hoh-zone.github.io/eve-bootcamp/idea/idea_076.html) - 快被打爆没空输入参数时候直接公屏输入 `help.me.sui` 一键全军驰援防线…
1. [太空冷笑话解压点智能分发仪](https://hoh-zone.github.io/eve-bootcamp/idea/idea_077.html) - 偏远停机坪的 `tell.joke.sui` 里面不仅仅会自动广播各种太空段子专供无聊玩家挂机时解闷…
1. [绝对公开历史透明记名外交长廊](https://hoh-zone.github.io/eve-bootcamp/idea/idea_078.html) - 利用全服唯一 `diplomacy.guild.sui` 这里无情且无法挂除地挂满了极其耻辱毁约背刺…
1. [极其无耻黑吃黑夺命深空伏击网](https://hoh-zone.github.io/eve-bootcamp/idea/idea_079.html) - 黑客通过篡改全服极度信任的地标级安全域名比如 `home.sui` 的底层映射点，将一整支大舰队瞬间…
1. [完全树形的军团阶层超级分册名录网](https://hoh-zone.github.io/eve-bootcamp/idea/idea_080.html) - 使用 `.admiral.fleet1.alliance.sui` 的绝妙域名多重后缀极其完美展示这…
1. [硬核去中心化不可磨灭星系通史全大录像](https://hoh-zone.github.io/eve-bootcamp/idea/idea_081.html) - 高达几十GB全记录的宇宙战争编年史战争录屏不再放 YouTube，直接用合约挂载进 Walrus 库…
1. [赛博狂野百兆机甲痛车喷漆超清全图列阵](https://hoh-zone.github.io/eve-bootcamp/idea/idea_082.html) - 将毫无上限超高清的个性暴走飞船装甲极大材质包全传至 Walrus 以供整个游戏进行不受带宽限制的超逼…
1. [拯救全服失传开源极品深空图纸库](https://hoh-zone.github.io/eve-bootcamp/idea/idea_083.html) - 一个永不丢失的海量由于年代久远或者早就全服没人懂了的超级远古飞船设计蓝图保存在 Walrus 中而成…
1. [各种极品机密由于战线潜入之天价情报网赚](https://hoh-zone.github.io/eve-bootcamp/idea/idea_084.html) - 极其高密大舰队全方位集结暗中潜行极清百兆偷拍大视频保存在 Walrus 后并锁定只有极其极其天价密匙…
1. [星际广播电台与航线播报网](https://hoh-zone.github.io/eve-bootcamp/idea/idea_085.html) - 把联盟广播、战争简报、航线预警和广告赞助做成可订阅、可打赏、可归档的深空媒体系统…
1. [开源舰队 AI 策略仓库](https://hoh-zone.github.io/eve-bootcamp/idea/idea_086.html) - 让炮塔策略、物流调度、价格模型和联盟战术模板变成可授权、可订阅、可分成的规则插件市场…
1. [KillMail 取证回放台](https://hoh-zone.github.io/eve-bootcamp/idea/idea_087.html) - 围绕击杀记录做录像索引、赔付取证、战术复盘和战争教学的公开回放平台…
1. [热土豆通缉信标](https://hoh-zone.github.io/eve-bootcamp/idea/idea_088.html) - 用 Hot Potato 思路做高风险追猎赛事、逃亡挑战和限时传递型 PvP 节目…
1. [共享矿带抢采协议](https://hoh-zone.github.io/eve-bootcamp/idea/idea_089.html) - 把整条矿带做成共享资源池，让多人并发争夺、协作和干扰同一批高价值资源…
1. [永久战争纪念碑](https://hoh-zone.github.io/eve-bootcamp/idea/idea_090.html) - 将联盟胜利、远征和重大牺牲铸造成不可篡改的纪念对象，而不是不合理的无敌要塞…
1. [只认舰长的私有旗舰](https://hoh-zone.github.io/eve-bootcamp/idea/idea_091.html) - 设计强身份绑定的旗舰控制系统，解决高价值舰船的授权、封存和防劫持问题…
1. [旗舰试驾与限时借舰库](https://hoh-zone.github.io/eve-bootcamp/idea/idea_092.html) - 用 Borrow 模式做高价值舰船的体验、教学、赛事赞助和押金租赁系统…
1. [联盟多签金库与军费保险箱](https://hoh-zone.github.io/eve-bootcamp/idea/idea_093.html) - 把军费、税收和战时预算做成多签审批、可审计、防卷款跑路的联盟财务系统…
1. [全服倒计时争夺战](https://hoh-zone.github.io/eve-bootcamp/idea/idea_094.html) - 基于链上时钟做公开倒计时的资源争夺、战争窗口、限时拍卖和撤离结算玩法…
1. [蓝图母版与版税工厂](https://hoh-zone.github.io/eve-bootcamp/idea/idea_095.html) - 让舰船、装备和装饰蓝图以母版授权形式生产，并持续向原创者分发版税…
1. [诅咒突变古神兵](https://hoh-zone.github.io/eve-bootcamp/idea/idea_096.html) - 设计会随击杀、重铸和献祭不断突变、变强也可能反噬主人的危险神兵系统…
1. [红名自动截杀网](https://hoh-zone.github.io/eve-bootcamp/idea/idea_097.html) - 围绕红名、赏金和信誉数据，把多座星门和炮塔联成一张自动协防与封锁网络…
1. [组件众筹超级战舰](https://hoh-zone.github.io/eve-bootcamp/idea/idea_098.html) - 让多人分组件认购、组装、运营和分摊战损，打造联盟级超级战舰项目…
1. [ZK 跨链身份映射](https://hoh-zone.github.io/eve-bootcamp/idea/idea_099.html) - 在不暴露完整隐私的前提下证明其他链或其他世界中的身份、成就和信誉…
1. [治理权碎片寻回战役](https://hoh-zone.github.io/eve-bootcamp/idea/idea_100.html) - 把治理权抽象成安全的赛季事件碎片，让玩家通过协作占点、护送和解谜争夺治理资格…

## 59. 常规综合创意 100 例 - EVE Frontier Builder Course

来源：https://hoh-zone.github.io/eve-bootcamp/idea_general/index.html

# EVE Frontier 2026 Hackathon: 常规创意库

本目录收录了 100 个基于 EVE Frontier ‘A Toolkit for Civilization’ 主题的常规黑客松创意。这些创意涵盖了实用工具、技术架构、脑洞创意、怪诞玩法以及实时服务器联动等五大赛道。

## 创意列表

1. [智能星区燃料调度仪 (Smart Resource Router)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_001.html) - 监听全星区星门的跃迁频率，自动将联盟运输船的物流目的地修改为燃料库存低于 20% 的节点，确保整个防…
1. [极危求救信标 (Automated SOS Beacon)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_002.html) - 改造储物单元（Storage Unit），当其装甲值（HP）低于 30% 时，智能合约自动在公共频道…
1. [去中心化太空典当行 (Space Pawnshop)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_003.html) - 允许玩家将全服限量的 NFT 涂装或稀有蓝图锁入智能储物箱，合约自动根据预言机喂价发放高流动性的 S…
1. [军团 CTA 出勤打卡器 (Guild Attendance Tracker)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_004.html) - 一个特殊的智能网关或炮塔，当发起 “Call to Arms” 集结令时，它会自动记录并在链上给所有…
1. [动态拥堵收费星门 (Dynamic Toll Stargate)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_005.html) - 算法根据过去 1 小时内星门的通过流量计算收费。如果在激战期间有大批舰队想走捷径，过路费会呈指数级上…
1. [链上无头赏金所 (Bounty Hunter Escrow)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_006.html) - 全匿名的智能合约，任何人都可以将 SUI 锁入其中并指定一个角色的 ID。当系统捕捉到该角色的确切死…
1. [全自动化兵工厂 (Automated Ammo Factory)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_007.html) - 利用 Move 的 `Borrow-Use-Return` 模式，在无需人工干预的情况下，自动吃进矿…
1. [共享充电桩网络 (Shared Battery Network)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_008.html) - 部署超大型能量源组件（EnergySource），允许全宇宙任何飞船（无论阵营）停靠补能，但按照实际…
1. [太空运单撮合市场 (Logistics Queue Manager)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_009.html) - 类似太空中的滴滴货运。发货人锁定押金和报酬，货柜车司机接单。只有当特定物品真实地存入了远在数光年外的…
1. [一次性急救包贩卖机 (Emergency Medical Bay)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_010.html) - 高危星区的救命稻草。出售即用即毁的动态 NFT，飞船在濒死时触发此 NFT 的销毁交互，可以瞬间通过…
1. [炮塔限时租赁协议 (Mercenary Firepower Renting)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_011.html) - 利用时间戳将特定杀伤性炮塔的 `OwnerCap` 临时授权给一个非本联盟的矿工玩家。24小时后授权…
1. [太空海关扣款机 (Customs & Tax Stargate)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_012.html) - 专门部署在交通要道的星门，不按次收费，而是强制扣除过境船只钱包内所有 SUI 余额的 1% 作为“过…
1. [联盟战利品均分系统 (Automated Loot Distributor)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_013.html) - 将战后打扫战场的储物箱链接到专门的分账合约。舰队指挥官只要把海量战利品抛入其中，智能合约会瞬间将其均…
1. [死人开关：遗产继承器 (Dead-Man’s Switch Inheritor)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_014.html) - 长达 30 天没有任何链上签名的玩家会被判定为“脑死亡”。其名下的所有高级智能组件（储物箱、星门）的…
1. [情报黑市付费墙 (Spy Network Paywall)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_015.html) - 侦察兵在敌对星系边缘捕捉到的舰队集结坐标。他们将坐标加密成一段 Dynamic Field 附加在特…
1. [去中心化采矿订单板 (Alliance Job Board)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_016.html) - 军团建造泰坦需要大量 Veldspar 矿。直接发布锁定 10,000 SUI 的链上悬赏金，任何散…
1. [异星资源期货交易所 (Fuel Futures Exchange)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_017.html) - 将还在地下、未来预计开采产出的特定类型燃料代币化（发行期货 Token）。玩家可以在开战前在二级市场…
1. [闭关锁国网关 (Border Control API)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_018.html) - 绝对防御！该星门不仅仅校验白名单配置，更强制验证玩家地址内是否持有某知名链上身份认证凭证（例如：只允…
1. [智能勒索炮塔 (Automated Ransomware Turret)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_019.html) - 锁定敌方飞船后不直接击毁，而是将其引擎功率锁定（利用特定的 De-buff）。除非对方在 5 分钟内…
1. [全宇宙全民基本收入发生器 (UBI Generator)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_020.html) - 一个纯公益的 DAO 组织。部署一组永动机级别的能源阵列，每天搜集溢出的能源并在链上均匀地向全服所有…
1. [零知识隐秘星区穿梭 (ZK Fleet Movements)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_021.html) - 运用原生 zkLogin / ZK Proof 密码学手段，舰队指挥官可以证明自己“合法支付了星门过…
1. [跨链硬资产 EVE 映射桥 (Cross-Chain Asset Bridge)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_022.html) - 技术难度极高的跨链机制。允许以太坊巨鲸将其钱包里的 USDC 锁定，并在 EVE 的贸易站内自动 1…
1. [亚毫秒级高频贸易站 (HFT DeepBook Trading Post)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_023.html) - 放弃传统的低效 AMM，直接将 Sui 官方的高性能中央限价订单簿（DeepBook）源码融入进 E…
1. [Sui GraphQL 全图热力追踪器 (GraphQL Live Heatmap)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_024.html) - 开发一个超强性能的链下数据聚合器。通过实时监听 Move 合约中抛出的 `TurretFired`（…
1. [战略武器多重签名发射井 (Multi-Sig Missile Silo)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_025.html) - 在 Sui 链上实现复杂的 N-of-M 多重签名机制。一枚能毁灭整个星区的超级实体导弹，想点火必须…
1. [亿级对象池并发优化器 (Optimized Object Registry)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_026.html) - 针对超大战场中的“物品爆装”问题，重写底层的 `ObjectRegistry`。利用动态字段（Dyn…
1. [混合签名异步结算架构 (Off-Chain Sig_Verify)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_027.html) - 将绝大部分不涉及资产转移的高频交互（如走位、瞄准）通过链下服务器发放临时 Ed25519 签名，玩家…
1. [动态无限船长日志 (Dynamic Field Metadata Engine)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_028.html) - 使用对象树形嵌套设计。将飞船所经历过的每一场著名战役的描述作为 `Dynamic Field` 追加…
1. [海绵宝宝赞助钱包 (Gas-Sponge Dapp-Kit)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_029.html) - 极大优化新手体验（UX）。直接集成 `@evefrontier/dapp-kit` 的赞助交易代码：…
1. [物理临近性地缘证明 (Proximity Proof Protocol)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_030.html) - 利用强大的密码学算法（如哈希时空碰撞），证明两个没有从属关系的玩家，此刻在现实（游戏底层引擎）的 3…
1. [反肉鸡链上验证节点 (Decentralized CAPTCHA Node)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_031.html) - 在挂机刷矿泛滥的区域部署。该智能组件会随机抛出一个完全在 Move VM 内生成且验证的逻辑谜题，无…
1. [基于 Move Prover 的绝对安全金库 (Move Prover Invariants)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_032.html) - 不仅仅是写业务代码，同时附带数百行的形式化验证（Formal Verification）断言集。从数…
1. [时序锁定的舰队集体牵引跳跃 (Batched Jump Router)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_033.html) - 一个极为精妙的 TS 脚本应用，利用事务批处理技术，将军团内 100 艘舰船分别进行授权的过程打包入…
1. [无缝热更新的包管理器 (Upgradable Package Manager)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_034.html) - 由于修改不可变资产风险极大，设计一种可插拔的模块化网关。未来需要迭代网关 AI 或收费逻辑时，可以将…
1. [ERC-20式的插件标准扩展协议 (Cross-Package Combinator)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_035.html) - 提出并实现一套针对 EVE 组件定制化的标准函数签名（如 `ActionModifier::exec…
1. [硬派极客 EVE Vault 硬件插件 (Vault Keeper Ledger Edition)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_036.html) - 挑战高难度浏览器扩展开发！为目前基于 zkLogin 的 EVE 钱包加上一层强制性的 Ledger…
1. [链下高速状态通道 (State Channel Skirmishes)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_037.html) - 两群玩家赌上身家性命进行狗斗，但由于链上 TPS 不够顺畅，他们将双方飞船资产总库隔离锁定，进入链下…
1. [安全红队自动化黑盒机 (Automated Security CI/CD)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_038.html) - 一个服务于各路 Builder 的网页测试平台。能够一键上传自己刚写好的 EVE 防御网合约，平台会…
1. [哨戒兵高敏监听 Discord Bot (Event-Driven Alert Bot)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_039.html) - 一款全天候悬浮于 WebSocket 连接上的机器人。当特定的系统组件抛出类似于 `UnderAtt…
1. [完全去中心化的加密暗网指令 (On-Chain Encrypted Orders)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_040.html) - 舰队高层的命令全都是明文？利用 Diffie-Hellman 密钥交换原理与 EVE 角色的链上公钥…
1. [可进化的拓麻歌子电子宠物 (Evolving Tamagotchi Drones)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_041.html) - 存在于星舰货舱里的一只非常脆弱的电子眼 NFT。玩家必须每天按时喂它特定的燃料渣滓，如果长达 7 天…
1. [深空加密巨幅广告牌 (Space Billboard Protocol)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_042.html) - 如果你占领了全服最繁忙十字路口的一块太空巨石。你可以在这块石头上挂载基于链上 Display 标准的…
1. [太空神权政治与神罚 (Sectarian Religion Framework)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_043.html) - 游戏内可以信奉不存在的“虚空之神”。土豪们向自己信仰的“战神”祭祀（存入）大把的 SUI 币；神殿的…
1. [星海烈士纪念金卡 (Bounty Target NFT Cards)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_044.html) - 如果你单挑战胜了当前公认的顶尖全服霸主（例如 CEO）。在这个被摧毁的瞬间，系统会自动提取该霸主的最…
1. [银河同步心跳电台 (Intergalactic Radio Station)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_045.html) - 一个简单的链上文字数组队列，玩家花极小代价就能在数组尾部追加一条 Spotify 的音乐链接。任何接…
1. [星系大发现的终身冠名权 (Asteroid Naming Rights)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_046.html) - 当未知的神秘星区第一次被挖空探测器扫描完毕，那个打下最后一块原矿的玩家，会被赋予一次神圣的链上权限。…
1. [零重力俄罗斯轮盘 (Cosmic Roulette)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_047.html) - 把生死交给真正的随机数！在一个完全隔离的赌台网关里，两名驾驶员签订生死状，并把各自心爱的史诗级旗舰所…
1. [涂装乱入大师 (Cosmetic Modding Pipeline)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_048.html) - 类似早期的 Steam 社区创意工坊。极大地释放艺术表现，只要符合特定的 3D 模型面数规格限制，玩…
1. [AI 诗人传记生成器 (Generative Lore Library)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_049.html) - 每一座屹立于虚空中的超级跨星系跳跃星门的落成，都是由千万名蓝领劳工一点一滴搬砖建成的。这套组件会利用…
1. [嗜血吸血鬼护盾 (Vampiric Weaponry)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_050.html) - 这不是用来彻底击没敌人的野蛮火炮。它射出的射线会在击中敌人装甲后，巧妙地截取非常精准的小数点后特定额…
1. [去中心化联盟股份化 (Alliance Stock Market)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_051.html) - 联盟不再是一个组织形式，更是一个注册制上市公司。联盟的所有核心产能（每天的总采矿量流水）公开透明不可…
1. [链上太空版密室逃脱 (On-Chain Escape Room)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_052.html) - 一种用技术极客心酸搭建的“连环画密码盒”。这里有一排按顺序放置好的储物箱，你必须通过解读上一个储物箱…
1. [生存倒计时的星空死神契约 (Space Lotteries - Tontines)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_053.html) - 这是一场纯粹精神威压的残酷游戏，1 签定契约的 100 个人各自质押大量的起步金到奖池里；随着太空大…
1. [全透明无金融性质的信誉系统 (Reputation Score Graph)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_054.html) - EVE 中尔虞我诈实在太多。为了防止小团队里有内鬼搞事，建立一套只计算社会交互维度的网络体系。如果你…
1. [无声的战死者绝唱碑亭 (Monument to the Fallen)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_055.html) - 这不再是一个有用或者有经济效能的物件，这是一个废弃、不连接任何能量管线、毫无光泽的超大报废星门。但任…
1. [高风险多签政治和亲条约 (Diplomatic Marriage Smart Contract)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_056.html) - 在两方巨大联盟对决的最焦灼时刻为了展示诚意。双方首脑把自己能打开所有公会最高密级物资库的核心权限卡（…
1. [星长民主代议制 (Planetary Election System)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_057.html) - 一片庞大且富饶的太阳系由于矿石储量丰富吸引无数打工仔。为了治理这片混乱地带，大家决定投入高昂燃料进行…
1. [席卷银河系的大海贼宝藏 (Galactic Treasure Hunt)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_058.html) - 全服超级彩蛋事件，开发者个人自掏腰包隐藏了一笔数目极其惊人的加密 SUI 代币于一个神秘的微小保险锁…
1. [玩家主导型的去重式无限委托网 (Player-Generated Quests)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_059.html) - 抛开传统网游固定死的打十只野猪给两件白板衣服的套路。引入由所有闲散玩家自行定义的悬赏面板功能，你可以…
1. [反向侦查雷达之暗夜走私网络 (Black Market Contraband)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_060.html) - 设定部分高能破坏原件具有很强的辐射效应被服务器自动打上了 “违禁品（Illegal）” 标签，因此在…
1. [Twitch 弹幕即时防空警报 (Turret Tourette’s)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_061.html) - 部署一台极度神经质的星门防卫重炮。其枪口朝向和开火的布尔值逻辑判断完全不看任何游戏参数，而是将其外接…
1. [“薛定谔的瑞克小卷”星门 (The “Rickroll” Gateway)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_062.html) - 披着无害外衣实则令人精神崩塌的整蛊组件。它确实有 99% 的绝对概率进行一次标准的星系曲率折叠，可如…
1. [全太阳系公共土嗨广播站 (SUI-fueled Space Jukebox)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_063.html) - 这是一台具有极强全服广播扰属性的设施。任何过路者无论愿意与否，只要你停在这个太阳系，这个大音响储物间…
1. [情感索取狂AI自爆飞镖 (The Sentient Bomb)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_064.html) - 被抛出来的并不是会物理追踪热能的火药。而是一个内嵌极速连线着 GPT-4 的多话痨炸包箱，你在面临这…
1. [代驾代死：深空版Uber外包群 (Space Uber for Ships)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_065.html) - 由于路途漫长，很多土豪不想自己花生命按时赶路。这产生了一个极不负责任的分布式闲置打鱼飞船托管接力应用…
1. [宇宙深度单机相亲插件 (Intergalactic Tinder)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_066.html) - 在冰冷无声且充满死亡的虚拟天体带里滑动匹配。本应用只允许你在方圆一百光年以内的区域搜寻那些同样加装了…
1. [消耗型邪教——胖企鹅神风特攻队 (Kamikaze Drone Factory)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_067.html) - 极具嘲讽与烧钱快感的奢靡玩具工厂。只有你在链上真实并且永远烧毁掉诸如 Pudgy Penguins …
1. [深空巨魔喷子：“凯伦”AI (The “Karen” AI Turret)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_068.html) - 当你驾船路过此地时，它既不索要买路钱也不放出激光。它唯一的判定机制是扫描你飞船的尾气排放引擎质量，只…
1. [强行发钱的精神病收费站 (Reverse Toll Booth)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_069.html) - 完全不符合经济学常识甚至属于富婆撒币逻辑产物。某位退隐的币圈传奇巨贾注入大额资金建立的怪异星门：只要…
1. [混沌真假暗箱魔盒 (Schrödinger’s Cargo Box)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_070.html) - 采用黑手党模式和深层的完全隐秘不透明封装函数手段设计的一个中转储物集装箱平台。你满心期待把一个价值连…
1. [全银河致命热土豆极速传花接力赛 (Space Potato Relay Racing)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_071.html) - 将原生的不可消亡底层 Move “Hot Potato” 这种没有 Drop 能力的纯逻辑毒药，转化…
1. [风水与命格算命算力仪 (Blockchain Fortune Teller)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_072.html) - 将东方神秘主义通过极客手段搬进了全息投影面板：你路过的某个废弃空间站台不仅仅是一个摆设，当你触碰之时…
1. [反常理的圣母白莲花“治愈”治疗仪炮 (The Pacifist Laser)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_073.html) - 这种武器造出来就是为了纯属折磨人并且利用整蛊系统漏洞！发射这种名为光束武器实际则是海量垃圾垃圾冗余运…
1. [涂鸦狂人的太空重金贴皮战 (On-Chain Vandalism Graffiti)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_074.html) - 这种黑客协议将矛头直指了任何本应该是庄重肃穆或者属于知名土豪玩家辛苦打造的宇宙标志性豪宅、顶级舰队旗…
1. [让人迷失的极简深渊恐惧补丁视觉重构 (The Existential Dread Mod)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_075.html) - 这不是一个简单的扩展插件，它是从深层次心理维度打击那些习惯了无数报表堆砌以及金钱数字狂欢的高端玩家：…
1. [缺角材质渲染残缺魔方的拜物邪教 (Cult of the Floating Default Cube)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_076.html) - 因某种游戏内引擎因为偶然一次贴图渲染出错产生的漂浮的完全虚空的灰白紫黑相间的 Default 模型方…
1. [公共广播频率超大噪声文字转语音骚扰推车 (Sui-to-Speech Propaganda Network)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_077.html) - 所有只要途径这片归属于这个强大狂躁大联盟统治和看守之下的关隘或者是跳跃航道空间节点。你的船舱内部的无…
1. [金字塔顶端庞氏骗局跨界星门 (The Pyramid Scheme Stargate)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_078.html) - 一个利用贪婪和精明伪装出的一种金融收割镰刀游戏系统大网。其实通过这个有着捷径和便利称呼的网关原本是要…
1. [利用天文星象玄学走势控制期货市场的盘口系统软件 (Astrological Market manipulation)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_079.html) - 既然在这款全宇宙最充满变故与冰冷数据交织的庞大宇宙经济引擎中无法判断稀有元素在次日的暴跌暴涨。有个怪…
1. [附带真正流血效果的残酷老虎机抽箱机 (Space Gacha with Real Punishments)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_080.html) - 对于抽奖文化走火入魔并且带有自毁性质倾向一种极致展现。你不仅在此刻投下了所有可能令你破产的身价积蓄在…
1. [Stillness 全天候无缝星际公路救援拖车联盟 (Stillness Automated Resupply - SAR)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_081.html) - 一群如同活雷锋一般潜伏于目前仍在测试火并阶段的各个角落。这是基于后台代码自动化时刻待命的一批幽灵护卫…
1. [实时前线势力板块变动活点地图应用 (Live Territory Map Integrator)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_082.html) - 脱离单一维度的信息战！这是一套庞大并且能够如同监控中心般俯瞰现在真人在玩在干嘛的超宽屏宏伟态势实时图…
1. [Stillness 微观经济脉动指数超级彭博机终端 (Stillness Economy Dashboard)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_083.html) - 这里没有任何飞船轰炸这里只有关于利益输送和资本变动最赤裸裸和腥风血雨的数字流动记录中心！开发人员成功…
1. [活体打劫海关自动化追缴讨债黑社会系统车队 (Automated Toll Collector Fleet)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_084.html) - 一群利用机器全天自动待命脚本组成并且在关键路口列阵而停的可怕黑道打手！这并不是游戏内预设那些很容易规…
1. [现实同频跨界巨星全息太空音乐节实时检票系统门票发行大卖贩售处 (Live Event Ticketing)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_085.html) - 并不是开玩笑！在这款目前有大量高粘性测试人群活跃在服务器的宇宙之中正在确确切切真真正在举办着某个类似…
1. [一键报警深空黑水国际安保快反部队紧急护航派发热线 Discord 中心 (Stillness Distress Signal Network)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_086.html) - 极度危险随时都被狙杀在无人工区运送物资矿工的极其必须品！他们开发了一套专门用于通过特定的快捷发报模块…
1. [血流成河实时真金白银价值排行悬赏绞肉积分大榜 (On-Chain Killboard for Stillness)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_087.html) - 这是一个充斥满屏幕鲜红色并且全服所有人都极其关注的实时权威并且不可造假的顶尖刺客排名黑榜风云榜！这个…
1. [Stillness 内鬼监控财务高压线贪污资产全线熔断抓捕冻结器功能模块 (Live Alliance Treason Monitor)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_088.html) - 为了防患那些身居高位但是包场私通或者突然有一天被对家重金收买想要卷款而逃甚至要拉整个公会作为垫被直接…
1. [多边形无差别黑心跨区域倒爷超级贸易套利嗅探器前瞻雷达终端 (Stillness Dynamic Supply/Demand Tracker)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_089.html) - 这里不讲究温情仅仅讲究着极致的差利润！这套界面满是高科技密密麻麻数据图不断通过极高的刷新频率全地图范…
1. [直播室弹幕与实时对线游戏内实景神仙打斗金主打赏连麦绝杀暗杀指令下注网络 (Live Streamer Bounty Overlay)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_090.html) - 这个模块系统完美模糊了一切什么是场外观众干预什么更是身处于局中当局者的极限打破边界四面墙大作：如果这…
1. [代码写手随写随投火线生死时速一键热战区即走即用 CI/CD 直送大炮平台投射器 (Continuous Integration Deployer)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_091.html) - 那些极具疯狂热爱在这个完全由代码决定生死战局的顶尖技术极客前线黑心商人们和防御专家们他们急需的一种极…
1. [大过滤器与宇宙审判长不可销毁永远挂榜游街活体历史耻辱柱罪证录档案馆 (Stillness Diplomatic Incident Logger)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_092.html) - 这是没有偏袒也不存在各种公关或者口水战中双方相互推诿并且泼脏水的混乱！这个大记事本终端极其冷冰并且绝…
1. [无人机蜂群大军绝对服从冷酷集权控制同步采矿调度全境指挥旗舰模块 (Automated Live Mining Fleet Manager)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_093.html) - 抛弃一切闲散而且总是出错以及摸鱼甚至因为没注意去上厕所导致错失了好几块珍稀大原矿的散漫人工指挥部！这…
1. [网络大崩溃与蓝屏宕机自然灾害巨额对冲理赔不讲理保险天灾保障兜底机构 (Live Server Status Oracle)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_094.html) - 游戏总是非常残酷的而且对于还仍然是个巨大草台班子的而且随时可能会因为挤掉线并且各种不完善导致的大炸服…
1. [真实活体深空华尔街之狼交易不打烊巨型现期货深蓝星门交割大盘枢纽重置中心 (The Stillness “Stock Exchange”)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_095.html) - 你所以为的买卖还是两艘船小心翼翼如同见不得光的毒贩在某个角落进行微不足道的小数目接触交换防骗的那种极…
1. [星系大航海房产黑中介与超级学区房不讲理二手囤积地皮拍卖行应用大炒家平台 (In-game Real Estate Brokerage)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_096.html) - 不要觉得在这个如此广阔并没有边界甚至完全真空连一块落脚的泥土都非常奢侈以及随时都在漂移宇宙中就没有地…
1. [星际盖世太保大路条只认衣服不认人无差别人种全场面大清查拦截霸道大安检巨炮网关卡 (Live Contraband Scanner Hub)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_097.html) - 在这场充斥着极度自由并且毫无任何道德规矩或者是底线的极度疯狂甚至什么情况都发生的世界和时间大背景下当…
1. [星空荒野大流浪与极度无助遇难荒岛幸存者极限极速极地救援并且能吃热饭热汤极暖心慈善红十字大飞机大公益抢险基金拨款援助总群 DAO 基地 (Stillness Rescue DAO)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_098.html) - 和上面那种随时让你骨头都不剩下和极端恶毒的大炮关口不同！世界上终有善良而且极具大爱充满并且在这个冷冰…
1. [深空巨头垄断不眠不休大托拉斯大资本垄断无情超级做市收割巨鳄机器人黑心机器模块全自动割韭菜提款机 (Live Market Maker Bot - MMB)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_099.html) - 你不要极其天真并且极其单纯地去以为在这个充斥这极其无边无际甚至广袤并且完全没有任何约束缺乏且那些各种…
1. [全宇宙极度悲惨死人谷永远安息极度恐怖阴风阵阵甚至极其诡异幽静完全荒凉甚至如同禁地一般不仅极其极其巨大甚至庞大无边且死气沉沉完全彻底没有一丝生机大墓碑排行榜大超级甚至带有悼词完全无人敢踏足极大并且绝望超大死人谷活体大纪念坑中心墓地遗迹 (The “Stillness Memorial”)](https://hoh-zone.github.io/eve-bootcamp/idea_general/idea_100.html) - 在这样一个在这个无时无刻充斥每天随时可能发生极其惨烈并且到处充满了爆炸并且有着各种勾心斗角为了利益连…
