# Move on Sui: 从零到精通 — 完整合并版

> 本文档由脚本自动合并生成，内容按 SUMMARY.md 阅读顺序排列。



---


<!-- source: book.toml -->
## book.toml

[book]
title = "Move on Sui: 从零到精通"
authors = ["HOH Community"]
language = "zh"
src = "src"

[output.html]
default-theme = "light"
preferred-dark-theme = "navy"
git-repository-url = "https://github.com/hoh-zone/learning-sui"


---


<!-- source: CLAUDE.md -->
## CLAUDE.md

# Move on Sui: 从零到精通

本书项目已安装 Sui Dev Skills，编写或修改 Move / TypeScript / 前端代码时请遵循技能包中的约定。

## 技能引用

- **Move 合约与测试**：@.claude/skills/sui-dev-skills/sui-move/SKILL.md
- **TypeScript SDK（PTB、客户端、执行）**：@.claude/skills/sui-dev-skills/sui-ts-sdk/SKILL.md
- **前端 dApp Kit**：@.claude/skills/sui-dev-skills/sui-frontend/SKILL.md

## 本书结构

- 正文目录：`src/SUMMARY.md`
- 构建：`mdbook build` 或 `mdbook serve`


---


# ==================== Move on Sui: 从零到精通 ====================



---


<!-- source: foreword.md -->
## 前言

# 前言

欢迎阅读《Move on Sui: 从零到精通》。这本书是为所有希望深入理解 Sui 区块链及 Move 智能合约语言的开发者而编写的，无论你是从 Solidity 转型的以太坊开发者、有一定编程基础的系统工程师，还是对 Web3 充满好奇的通用程序员，本书都将为你提供一条从入门到精通的清晰路径。本书全面覆盖 **Move 2024 Edition** 在 Sui 上的最新特性，确保你学到的每一行代码都与当前主网保持同步。

## 目标读者

本书面向以下几类读者：

### 区块链开发者

如果你已经在以太坊、Solana 或其他链上有开发经验，本书将帮助你快速理解 Sui 的对象模型与 Move 语言的独特设计哲学。你会发现 Move 在资源安全性和类型系统上相比 Solidity 有质的飞跃。

### Solidity 开发者

本书在关键章节中穿插了与 Solidity 的对比，包括存储模型差异（账户模型 vs 对象模型）、安全机制（重入攻击在 Move 中为何不存在）以及编程范式的根本区别。这些对比将大幅缩短你的学习曲线。

### 通用程序员

即使你没有任何区块链经验，本书也从最基础的概念讲起。只要你熟悉至少一门编程语言（如 Rust、TypeScript、Python 或 Go），就能跟上本书的节奏。Move 语言的语法借鉴了 Rust，如果你有 Rust 背景会感到尤其亲切。

## 学习路线

本书采用循序渐进的结构，共分为五个阶段：

### 第一阶段：基础认知（第 1–2 章）

了解区块链与智能合约的基本原理，认识 Sui 的技术架构与生态系统，搭建完整的开发环境。这一阶段为后续所有内容打下坚实基础。

### 第二阶段：Move 语言精通（第 3–5 章）

从 Hello World 开始，逐步掌握 Move 的类型系统、Abilities 机制、所有权与引用、泛型编程等核心语言特性。每个知识点都配有可编译运行的代码示例。

### 第三阶段：Sui 对象模型（第 6–8 章）

深入 Sui 最具创新性的对象模型——理解对象所有权、共享对象与快速路径、动态字段、Balance 与 Coin 等核心概念。这是区分"会写 Move"和"会用 Sui"的关键分水岭。

### 第四阶段：设计模式与工程实践（第 9–10 章）

掌握 Capability、Witness、Hot Potato 等经典设计模式，学习编写高质量测试。这些模式是生产级 Sui 合约的基石。

### 第五阶段：应用实战（第 11–17 章）

从代币发行、NFT 市场到全栈 DApp 开发，再到 ZKLogin、DeepBook、Walrus 等前沿技术，将所学知识付诸实践。

```move
// 你将在本书中编写的第一个 Move 模块
module hello::hello_world;

use std::string::String;
use std::unit_test::assert_eq;

public fun greeting(): String {
    b"Hello, Move on Sui!".to_string()
}

#[test]
fun greeting_returns_hello() {
    assert_eq!(greeting(), b"Hello, Move on Sui!".to_string());
}
```

## 如何使用本书

### 动手实践

本书采用**边学边练**的教学方法。每一章都包含完整的代码示例，我们强烈建议你在本地环境中亲手输入、编译和运行每一段代码，而不是简单地复制粘贴。肌肉记忆是掌握新语言最有效的方式。

### 章节递进

各章节之间存在依赖关系——后面的章节会引用前面介绍的概念和代码。建议你按照章节顺序阅读，至少在第一遍学习时不要跳读。当然，如果你已有一定基础，可以从目录中选择感兴趣的章节开始。

### 代码仓库

本书所有代码示例均可在配套的 GitHub 仓库中找到。每一章的代码都是独立可编译的 Move 项目，你可以直接 clone 下来运行：

```bash
git clone https://github.com/hoh-zone/learning-sui.git
cd learning-sui
```

### 版本说明

本书内容基于以下版本编写：

- **Move 语言**：2024 Edition
- **Sui 框架**：与当前 Sui 主网版本保持同步
- **Sui CLI**：最新稳定版

由于 Sui 生态发展迅速，部分 API 可能会随版本更新而变化。如果遇到编译错误，请先检查依赖版本是否与书中一致。

## 前置知识

为了顺利阅读本书，你需要具备以下基础：

- **编程基础**：熟悉至少一门编程语言的基本概念（变量、函数、控制流、数据结构）
- **命令行操作**：能够在终端中执行基本命令
- **Git 基础**：了解 clone、commit、push 等基本操作
- **区块链概念**（可选）：如果你了解公钥/私钥、交易、区块等基本概念会更有帮助，但这不是必须的——第一章会从头讲起

不需要提前学习 Rust，虽然 Move 的语法与 Rust 相似，但本书会在引入每个语法特性时给出充分的解释。

## 小结

本书将带你从零开始，系统地掌握 Sui 区块链上的 Move 智能合约开发。通过理论讲解与实战演练相结合的方式，你将不仅学会 Move 语言本身，更会深入理解 Sui 的对象模型、设计模式与最佳实践。无论你的最终目标是构建 DeFi 协议、NFT 市场，还是创新的链上应用，本书都将为你提供坚实的技术基础。

让我们开始这段旅程吧。


---


# ==================== 入门篇 ====================



---


<!-- source: 01_introduction/index.md -->
## 第一章 · 走进 Sui 与 Move

# 第一章 · 走进 Sui 与 Move

本章将带你了解 Sui 区块链的核心理念和技术架构，认识 Move 语言的独特优势，并安装好开发所需的工具链。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 1.1 | 区块链与智能合约 | 区块链基础概念、共识机制、智能合约的作用 |
| 1.2 | Sui 架构概览 | 对象中心设计、并行执行、Narwhal + Bullshark 共识 |
| 1.3 | Sui 生态全景 | Walrus、DeepBook、zkLogin、Kiosk 等生态组件 |
| 1.4 | Move 语言的诞生与演进 | 从 Diem 到 Sui，Move 与 Solidity 的对比 |
| 1.5 | Suiup — 工具链管理器 | 一键安装和管理 Sui 生态全部 CLI 工具 |

## 学习目标

读完本章后，你将能够：

- 理解 Sui 区块链相对于其他链的核心差异
- 说出 Move 语言在安全性和资产建模上的优势
- 使用 suiup 安装和管理 Sui 开发工具


---


<!-- source: 01_introduction/blockchain-and-smart-contracts.md -->
## 1.1 区块链与智能合约

# 区块链与智能合约

区块链是一种去中心化的分布式账本技术，它通过密码学和共识机制保证数据的不可篡改性与一致性。智能合约则是运行在区块链上的程序，它们能够在无需信任第三方的情况下自动执行预定义的逻辑。理解这两个基础概念，是踏入 Sui 与 Move 开发世界的第一步。

## 什么是区块链

### 分布式账本

区块链的本质是一个由众多节点共同维护的分布式账本。与传统的中心化数据库不同，区块链没有单一的管理者——每个参与节点都持有完整（或部分）的账本副本。当一笔新的交易发生时，它会被广播到整个网络，经过验证后被永久记录。

这种架构带来了几个关键特性：

- **去中心化**：没有单点故障，任何单一节点的宕机不会影响整个网络
- **透明性**：所有交易记录公开可查，任何人都可以验证
- **不可篡改**：一旦数据被记录到区块链上，修改它的代价在计算上是不可行的

### 区块与交易

区块链由一系列按时间顺序链接的**区块（Block）**组成。每个区块包含：

- **区块头**：包含时间戳、前一个区块的哈希值、Merkle 根等元数据
- **交易列表**：该区块中包含的所有交易
- **区块哈希**：对区块头的加密哈希值，作为该区块的唯一标识

**交易（Transaction）**是区块链上状态变更的最小单位。一笔交易通常包含：

- 发送者地址与签名
- 接收者地址或目标合约
- 调用的函数与参数
- Gas 费用（执行成本）

```
区块 N-1          区块 N           区块 N+1
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Hash N-2 │◄───│ Hash N-1 │◄───│ Hash N   │
│ 时间戳    │    │ 时间戳    │    │ 时间戳    │
│ 交易列表  │    │ 交易列表  │    │ 交易列表  │
│ Merkle根  │    │ Merkle根  │    │ Merkle根  │
└──────────┘    └──────────┘    └──────────┘
```

### 共识机制

共识机制是区块链网络中各节点就账本状态达成一致的规则。不同的区块链采用不同的共识算法，各有优劣：

#### 工作量证明（Proof of Work, PoW）

PoW 是比特币采用的共识机制。矿工需要通过大量计算找到满足特定条件的哈希值（即"挖矿"），第一个找到的矿工获得记账权和区块奖励。

- **优势**：经过十多年验证，安全性极高
- **劣势**：能源消耗巨大，交易确认速度慢（比特币约 10 分钟一个区块）

#### 权益证明（Proof of Stake, PoS）

PoS 中，验证者通过质押（Staking）代币来获得参与共识的权利。被选中的验证者负责提议和验证新区块。以太坊在 2022 年从 PoW 迁移到了 PoS。

- **优势**：能效大幅提升，交易速度更快
- **劣势**：可能出现"富者越富"的中心化趋势

#### 拜占庭容错变体（BFT Variants）

BFT 类共识机制能够在部分节点存在恶意行为的情况下仍然达成一致。Sui 采用的 **Bullshark** 协议就属于此类。

- **优势**：确定性终局（Finality），无需等待多个区块确认
- **劣势**：通常对验证者数量有一定限制

Sui 的共识设计尤为独特——对于仅涉及**已拥有对象（Owned Objects）**的交易，Sui 甚至可以绕过共识协议，直接通过拜占庭一致广播实现亚秒级确认。我们将在后续章节中详细讨论这一机制。

## 什么是智能合约

### 定义与核心思想

智能合约（Smart Contract）是部署在区块链上、由网络中的节点自动执行的程序代码。它们一旦部署，便按照预定义的规则运行，无法被单方面修改或停止——"代码即法律"（Code is Law）。

更准确地说，智能合约是一组**存储在链上的函数和状态**，任何人都可以通过发送交易来调用这些函数，触发状态变更。

### 与传统编程的区别

智能合约编程与传统的后端开发有着根本性的区别：

| 维度 | 传统编程 | 智能合约 |
|------|---------|---------|
| **执行环境** | 开发者控制的服务器 | 去中心化的区块链网络 |
| **确定性** | 可以有随机性、网络调用 | 必须完全确定性（相同输入 → 相同输出） |
| **执行成本** | 服务器资源费用（固定） | Gas 费用（按计算量付费） |
| **可变性** | 可以随时更新部署 | 部署后不可修改（或需要升级机制） |
| **数据存储** | 数据库可自由读写 | 链上存储昂贵，需精心设计 |
| **错误处理** | 可以捕获异常并恢复 | 交易失败则所有状态回滚 |
| **并发模型** | 多线程/多进程 | 通常顺序执行（Sui 支持并行） |

### Gas 模型

区块链上的每一步计算都需要消耗**Gas**——这是防止网络滥用的经济机制。Gas 的作用包括：

1. **防止无限循环**：每笔交易都有 Gas 上限，超出则交易失败
2. **资源定价**：计算越复杂、存储越多，费用越高
3. **激励验证者**：Gas 费用支付给验证者作为处理交易的报酬

在 Sui 上，Gas 以 **SUI** 代币（最小单位为 MIST，1 SUI = 10^9 MIST）支付。Sui 的 Gas 定价机制相对稳定，且支持 Gas 赞助（Sponsored Transactions），允许应用为用户代付 Gas 费。

### 一个智能合约的概念示例

以下伪代码展示了一个简单的数字资产合约应该具备的基本结构：

```
Contract DigitalAsset:

    // 定义资产结构
    struct Asset:
        id: UniqueID
        owner: Address
        name: String
        value: u64

    // 创建新资产
    function create_asset(name: String, value: u64) -> Asset:
        return Asset {
            id: generate_unique_id(),
            owner: caller_address(),
            name: name,
            value: value
        }

    // 转移资产
    function transfer_asset(asset: Asset, recipient: Address):
        require(asset.owner == caller_address(), "Not the owner")
        asset.owner = recipient

    // 查询资产
    function get_value(asset: Asset) -> u64:
        return asset.value
```

在 Move 语言中，这个概念可以被优雅地表达。Move 的所有权系统使得资产转移变得更加安全——你不需要手动检查调用者是否是所有者，类型系统会在编译期帮你保证：

```move
module examples::digital_asset;

use std::string::String;

/// 一个简单的数字资产
public struct Asset has key, store {
    id: UID,
    name: String,
    value: u64,
}

/// 创建新资产
public fun create(
    name: String,
    value: u64,
    ctx: &mut TxContext,
): Asset {
    Asset {
        id: object::new(ctx),
        name,
        value,
    }
}

/// 获取资产价值
public fun value(asset: &Asset): u64 {
    asset.value
}

/// 创建并转移给接收者
entry fun mint_and_transfer(
    name: String,
    value: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let asset = create(name, value, ctx);
    transfer::public_transfer(asset, recipient);
}
```

注意在 Move 中，我们不需要 `require(asset.owner == caller_address())` 这样的检查——**所有权由运行时自动管理**。当函数接收一个 `Asset` 类型参数时，Sui 运行时已经验证了调用者确实拥有该对象。

## 智能合约的应用场景

### 去中心化金融（DeFi）

DeFi 是智能合约最成功的应用领域。通过智能合约，用户可以在无需银行等中介的情况下完成借贷、交易、保险等金融操作：

- **去中心化交易所（DEX）**：如 Uniswap、Cetus，允许用户直接进行代币交换
- **借贷协议**：如 Aave、Scallop，用户可以质押资产并借入其他代币
- **稳定币**：如 DAI，通过超额抵押机制维持与美元的锚定
- **流动性质押**：如 Lido、Volo，将质押资产代币化以释放流动性

### 非同质化代币（NFT）

NFT 是代表唯一数字资产所有权的代币。智能合约定义了 NFT 的铸造、转移和销毁规则：

- **数字艺术**：艺术家可以直接向全球收藏者出售作品
- **游戏资产**：游戏道具以 NFT 形式存在，玩家真正拥有自己的游戏资产
- **身份凭证**：学位证书、会员资格等可以以 NFT 形式颁发

### 去中心化自治组织（DAO）

DAO 通过智能合约实现组织治理的自动化：

- **提案与投票**：成员可以提交提案并投票表决
- **资金管理**：国库资金按照投票结果自动分配
- **权限控制**：不同角色拥有不同的操作权限

### 链上游戏（GameFi）

区块链游戏将游戏逻辑和资产管理放到链上，确保公平性和资产所有权：

- **链上随机数**：确保游戏结果的公平性
- **可组合资产**：不同游戏之间的资产可以互操作
- **Play-to-Earn**：玩家通过游戏获得真正有价值的代币奖励

## 为什么选择 Sui

在众多区块链平台中，Sui 具有以下独特优势：

1. **并行执行**：Sui 可以同时处理不相关的交易，吞吐量远超传统区块链
2. **亚秒级终局**：对于所有权明确的交易，Sui 可以在不到一秒内完成确认
3. **对象中心模型**：资产是一等公民，天然适合表达数字资产的所有权
4. **Move 语言的安全性**：编译期消除了重入攻击、整数溢出等常见漏洞
5. **低且可预测的 Gas 费**：Sui 的 Gas 定价机制更加稳定

## 小结

本节介绍了区块链和智能合约的基础概念。我们了解了区块链作为分布式账本的核心特性、主流共识机制的工作原理，以及智能合约与传统编程的根本区别。我们还通过一个数字资产的示例，初步体会了 Move 语言在表达资产逻辑时的优雅与安全。在下一节中，我们将深入了解 Sui 独特的技术架构，理解为什么它在性能和安全性上能够超越前代区块链。


---


<!-- source: 01_introduction/sui-architecture.md -->
## 1.2 Sui 架构概览

# Sui 的技术架构

Sui 是一条高性能的 Layer 1 区块链，由 Mysten Labs 开发。它从底层重新设计了区块链的执行模型——以**对象（Object）**而非账户为核心，通过对象级别的并行执行和创新的共识协议，实现了亚秒级的交易终局和水平可扩展的吞吐量。本节将深入剖析 Sui 的技术架构，帮助你从系统层面理解 Sui 的设计哲学。

## 对象中心模型 vs 账户模型

### 以太坊的账户模型

在以太坊中，所有状态都存储在**账户**下。每个账户有一个余额和一个存储空间（Storage），智能合约的数据以键值对的形式存放在合约账户的 Storage 中。

```
以太坊账户模型:

账户 0xAlice
├── 余额: 10 ETH
└── Nonce: 5

合约账户 0xERC20
├── 余额: 0 ETH
├── 代码: ERC20 逻辑
└── Storage:
    ├── balances[Alice] = 1000
    ├── balances[Bob] = 500
    └── totalSupply = 1500
```

这个模型的问题在于：Alice 和 Bob 的代币余额都存储在同一个合约的 Storage 中。当 Alice 和 Bob 同时发起转账时，即使他们的交易完全无关，由于都需要修改同一个 Storage，这两笔交易也**必须顺序执行**。

### Sui 的对象模型

Sui 采用了完全不同的方式——数据以**对象**的形式存在，每个对象有唯一的 ID 和明确的所有者：

```
Sui 对象模型:

对象 0x1a2b (Coin<SUI>)
├── 所有者: Alice
└── 余额: 10 SUI

对象 0x3c4d (Coin<USDC>)
├── 所有者: Alice
└── 余额: 1000 USDC

对象 0x5e6f (Coin<USDC>)
├── 所有者: Bob
└── 余额: 500 USDC
```

在这个模型中，Alice 的 USDC（对象 `0x3c4d`）和 Bob 的 USDC（对象 `0x5e6f`）是**独立的对象**。当 Alice 转账给 Carol 时，她操作的是对象 `0x3c4d`；Bob 转账给 Dave 时，操作的是对象 `0x5e6f`。这两笔交易涉及不同的对象，可以被**完全并行地执行**。

### 对象模型的优势

| 特性 | 账户模型（以太坊） | 对象模型（Sui） |
|------|------------------|----------------|
| **并行性** | 需要复杂的并行化策略 | 天然支持并行执行 |
| **资产表达** | 余额是合约存储中的数字 | 资产是独立的一等对象 |
| **所有权** | 由合约逻辑维护 | 由运行时原生保证 |
| **可组合性** | 通过合约调用组合 | 对象可以直接嵌套和组合 |
| **存储粒度** | 合约级别 | 对象级别 |

## 并行交易执行

Sui 的并行执行能力是其高性能的核心来源。传统区块链（如以太坊）按顺序逐一执行交易，而 Sui 可以同时处理大量不相关的交易。

### 依赖关系分析

Sui 在执行交易前，会分析每笔交易涉及的对象集合。如果两笔交易操作的对象集合没有交集，它们就可以并行执行：

```
交易 A: Alice 转 SUI 给 Bob    → 涉及对象: {0x1a2b}
交易 B: Carol 铸造 NFT          → 涉及对象: {新对象}
交易 C: Dave 转 USDC 给 Eve    → 涉及对象: {0x7g8h}
交易 D: Alice 转 USDC 给 Frank → 涉及对象: {0x3c4d}

依赖分析:
- A, B, C, D 涉及的对象完全不同
- 四笔交易可以完全并行执行！

对比以太坊:
- 所有交易都必须排队顺序执行
- 即使交易之间完全无关
```

### 水平可扩展性

由于交易可以并行执行，Sui 的吞吐量可以随着硬件资源的增加而线性提升。增加更多的 CPU 核心和验证者节点，就能处理更多的并发交易。这种**水平可扩展性**是传统区块链所不具备的。

## 共识架构：Narwhal + Bullshark

Sui 的共识系统由两个关键组件协同工作：**Narwhal** 负责交易的传播和排序，**Bullshark** 负责在验证者之间达成最终共识。

### Narwhal：基于 DAG 的内存池

Narwhal 是一个高吞吐量的**内存池（Mempool）**协议。它使用**有向无环图（DAG）**结构来组织交易批次，而非传统的线性区块链结构。

```
Narwhal DAG 结构（简化示意）:

轮次 1       轮次 2       轮次 3
┌─────┐    ┌─────┐    ┌─────┐
│ V1  │───▶│ V1  │───▶│ V1  │
└─────┘  ╲ └─────┘ ╲  └─────┘
          ╲  ▲    ╲  ╲  ▲
┌─────┐    ╲│      ╲  ╲│
│ V2  │────▶│ V2  │───▶│ V2  │
└─────┘  ╱  └─────┘ ╱  └─────┘
        ╱     ▲    ╱     ▲
┌─────┐╱     │   ╱     │
│ V3  │────▶│ V3  │───▶│ V3  │
└─────┘    └─────┘    └─────┘

V1, V2, V3 = 验证者节点
每个方块 = 该验证者在该轮次提交的交易批次
箭头 = 对前一轮次批次的引用（因果关系）
```

Narwhal 的关键设计：

- **数据传播与共识解耦**：交易数据的分发不需要等待共识完成
- **高吞吐量**：每个验证者可以独立地持续提交交易批次
- **可靠性**：即使部分节点故障，已提交的交易也不会丢失

### Bullshark：共识协议

Bullshark 是建立在 Narwhal DAG 之上的共识协议。它的工作是在 DAG 结构中确定一个所有验证者都认同的交易排序。

Bullshark 的核心特性：

- **零消息开销**：Bullshark 不需要额外的消息交换，完全利用 Narwhal DAG 中已有的信息
- **确定性终局**：一旦共识达成，交易顺序不可更改，无需等待多个区块确认
- **拜占庭容错**：能够在最多 1/3 的验证者存在恶意行为时正常运作

## 已拥有对象 vs 共享对象

Sui 中的对象根据所有权模型分为不同类型，这直接影响了交易的执行路径和性能特征。

### 已拥有对象（Owned Objects）

已拥有对象是归属于某个特定地址的对象。只有所有者才能在交易中使用它们。

```move
module examples::owned_demo;

/// 只有所有者能使用的资产
public struct MyAsset has key, store {
    id: UID,
    value: u64,
}

/// 创建一个已拥有对象——转移给发送者
public fun create(value: u64, ctx: &mut TxContext) {
    let asset = MyAsset {
        id: object::new(ctx),
        value,
    };
    transfer::transfer(asset, ctx.sender());
}

/// 只有所有者能调用此函数修改值
public fun update_value(asset: &mut MyAsset, new_value: u64) {
    asset.value = new_value;
}
```

### 共享对象（Shared Objects）

共享对象可以被任何人在交易中访问。由于多个用户可能同时操作共享对象，涉及共享对象的交易**必须经过完整的共识排序**。

```move
module examples::shared_demo;

/// 一个共享的计数器，任何人都可以递增
public struct Counter has key {
    id: UID,
    count: u64,
}

/// 创建共享对象
fun init(ctx: &mut TxContext) {
    let counter = Counter {
        id: object::new(ctx),
        count: 0,
    };
    transfer::share_object(counter);
}

/// 任何人都可以调用此函数
public fun increment(counter: &mut Counter) {
    counter.count = counter.count + 1;
}

/// 读取计数值
public fun value(counter: &Counter): u64 {
    counter.count
}
```

### 快速路径（Fast Path）

这是 Sui 最具突破性的设计之一。对于**仅涉及已拥有对象**的交易，Sui 可以跳过 Bullshark 共识，直接通过拜占庭一致广播（Byzantine Consistent Broadcast）实现确认。

```
交易执行路径:

              ┌─────────────────────┐
              │     交易提交         │
              └──────────┬──────────┘
                         │
                   ┌─────▼─────┐
                   │ 对象分析   │
                   └─────┬─────┘
                         │
              ┌──────────┴──────────┐
              │                     │
       ┌──────▼──────┐      ┌──────▼──────┐
       │ 仅已拥有对象  │      │ 涉及共享对象  │
       └──────┬──────┘      └──────┬──────┘
              │                     │
       ┌──────▼──────┐      ┌──────▼──────┐
       │  快速路径     │      │ Bullshark   │
       │ (~400ms)     │      │  共识排序     │
       └──────┬──────┘      │ (~2-3s)     │
              │              └──────┬──────┘
              │                     │
              └──────────┬──────────┘
                         │
                  ┌──────▼──────┐
                  │  交易终局    │
                  └─────────────┘
```

快速路径的意义：

- **亚秒级终局**：仅涉及已拥有对象的交易可以在约 400 毫秒内完成确认
- **适用场景**：个人代币转账、NFT 铸造和转移、个人资产更新等
- **无需共识**：减少了验证者之间的通信开销，大幅提升吞吐量

### 设计选择的影响

理解已拥有对象和共享对象的区别，对于 Sui 开发者来说至关重要。它直接影响了你的合约设计：

```move
module examples::design_choice;

/// 方案 A：使用共享对象（需要共识，但任何人可操作）
public struct SharedPool has key {
    id: UID,
    total_liquidity: u64,
}

/// 方案 B：使用已拥有对象（快速路径，但只有所有者可操作）
public struct PersonalVault has key {
    id: UID,
    balance: u64,
}

/// 在设计合约时，需要权衡：
/// - 共享对象：灵活但慢（适合 DEX、借贷池等多人交互场景）
/// - 已拥有对象：快但限制（适合个人钱包、NFT 等个人资产场景）
```

## Sui 的独特特性

### 亚秒级终局

得益于快速路径机制，Sui 是目前终局速度最快的区块链之一。相比之下：

| 区块链 | 终局时间 |
|--------|---------|
| 比特币 | ~60 分钟（6 个区块确认） |
| 以太坊 | ~13 分钟（64 个 slot） |
| Solana | ~13 秒 |
| **Sui（快速路径）** | **~400 毫秒** |
| **Sui（共识路径）** | **~2-3 秒** |

### 水平可扩展性

传统区块链的吞吐量受限于单条链的处理能力。Sui 通过对象级别的并行执行，实现了真正的水平可扩展性——增加更多的计算资源，就能获得更高的吞吐量，而不需要分片或二层扩展方案。

### 对象级粒度

Sui 的状态管理精确到单个对象级别，这带来了以下好处：

- **精确的 Gas 计量**：按实际使用的对象存储和计算量收费
- **存储费退还**：当对象被删除时，用户可以拿回预付的存储费
- **细粒度权限控制**：每个对象可以有不同的所有权和访问模式

### 可编程交易块（PTB）

可编程交易块允许在单笔交易中组合多个操作，实现复杂的原子操作：

```
PTB 示例：单笔交易完成三个步骤

Transaction {
    // 步骤 1：从 DEX 购买代币
    let coin = dex::swap(sui_coin, usdc_type);

    // 步骤 2：用代币添加流动性
    let lp = pool::add_liquidity(coin);

    // 步骤 3：将 LP 代币质押
    staking::stake(lp);
}
```

PTB 的优势：

- **原子性**：要么全部成功，要么全部回滚
- **可组合性**：一个步骤的输出可以直接作为下一个步骤的输入
- **Gas 效率**：多个操作合并在一笔交易中，节省 Gas
- **无需合约串联**：不需要编写专门的聚合合约

## Sui 架构全景图

```
┌─────────────────────────────────────────────────────┐
│                    客户端层                           │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│   │ 钱包应用  │  │  DApp    │  │ SDK/CLI  │         │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘         │
│        └──────────────┼──────────────┘               │
└───────────────────────┼─────────────────────────────┘
                        │ JSON-RPC / GraphQL
┌───────────────────────┼─────────────────────────────┐
│                    全节点层                           │
│              ┌────────▼────────┐                     │
│              │    Full Node    │                     │
│              │  ┌────────────┐ │                     │
│              │  │ 交易路由    │ │                     │
│              │  │ 状态查询    │ │                     │
│              │  │ 事件索引    │ │                     │
│              │  └────────────┘ │                     │
│              └────────┬────────┘                     │
└───────────────────────┼─────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────┐
│                   验证者层                            │
│     ┌─────────────────▼─────────────────────┐       │
│     │            交易处理引擎                  │       │
│     │  ┌───────────┐      ┌───────────────┐ │       │
│     │  │ 快速路径   │      │ Bullshark     │ │       │
│     │  │ (Owned)   │      │ 共识 (Shared)  │ │       │
│     │  └───────────┘      └───────────────┘ │       │
│     └───────────────────────────────────────┘       │
│     ┌───────────────────────────────────────┐       │
│     │           Narwhal (DAG Mempool)        │       │
│     └───────────────────────────────────────┘       │
│     ┌───────────────────────────────────────┐       │
│     │           Move 虚拟机 (MoveVM)          │       │
│     └───────────────────────────────────────┘       │
│     ┌───────────────────────────────────────┐       │
│     │          对象存储 (Object Store)        │       │
│     └───────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

## 小结

本节深入介绍了 Sui 的技术架构。Sui 的对象中心模型从根本上改变了区块链的状态管理方式，使得并行执行成为可能；Narwhal + Bullshark 共识架构提供了高吞吐量和确定性终局；快速路径机制让已拥有对象的交易实现了亚秒级确认。这些设计创新使 Sui 成为当前性能最强的 Layer 1 区块链之一。在下一节中，我们将纵览 Sui 的生态系统，了解在这个强大基础设施之上构建的各类应用和协议。


---


<!-- source: 01_introduction/sui-ecosystem.md -->
## 1.3 Sui 生态全景

# Sui 生态全景

Sui 自主网上线以来，围绕其高性能基础设施构建了一个快速增长的生态系统。从去中心化存储到链上订单簿交易所，从零知识登录到数字资产市场框架，Sui 生态中的项目充分利用了对象模型和并行执行的优势，探索着 Web3 应用的全新可能性。本节将按类别全面介绍 Sui 生态中的关键项目和基础设施。

## 基础设施

### Walrus：去中心化存储

Walrus 是 Sui 生态中的去中心化存储协议，专门为大规模非结构化数据（如图片、视频、网页等）设计。它使用 **Red Stuff** 纠删编码技术，将数据分片后分布存储在全球节点上，以极低的冗余度（约 4-5 倍，远低于传统全副本方案的 N 倍）实现高可用性。

Walrus 的核心特点：

- **与 Sui 深度集成**：存储元数据和可用性证明记录在 Sui 链上
- **成本高效**：纠删编码大幅降低存储成本
- **可编程存储**：通过 Move 合约控制存储策略和访问权限
- **去中心化网站托管**：支持通过 Walrus Sites 直接部署前端应用

```move
module examples::walrus_integration;

/// 链上记录 Walrus 存储引用
public struct StorageRecord has key, store {
    id: UID,
    blob_id: vector<u8>,
    content_type: vector<u8>,
    size: u64,
    owner: address,
}

/// 注册一条存储记录
public fun register_blob(
    blob_id: vector<u8>,
    content_type: vector<u8>,
    size: u64,
    ctx: &mut TxContext,
) {
    let record = StorageRecord {
        id: object::new(ctx),
        blob_id,
        content_type,
        size,
        owner: ctx.sender(),
    };
    transfer::transfer(record, ctx.sender());
}
```

### Sui Bridge：跨链桥

Sui Bridge 是 Sui 的原生跨链桥，支持在 Sui 和以太坊之间安全地转移资产。它采用了基于验证者委员会的多签机制，确保跨链操作的安全性。

主要功能：

- **资产转移**：支持 ETH、USDC、USDT 等主流资产的跨链转移
- **原生集成**：桥接逻辑内置于 Sui 协议中，而非第三方方案
- **安全机制**：由 Sui 验证者委员会共同保障跨链交易安全

### SuiNS：域名服务

SuiNS 是 Sui 上的去中心化域名系统，类似于以太坊上的 ENS。用户可以将难以记忆的地址映射为人类可读的名称。

```
地址映射示例:
alice.sui → 0x1a2b3c4d5e6f...
bob.sui   → 0x7a8b9c0d1e2f...
```

SuiNS 域名本身就是 Sui 上的 NFT 对象，可以自由交易和转让。开发者可以在合约中直接解析 SuiNS 域名，获取对应地址。

### Move Registry

Move Registry 是 Sui 上的包管理和命名系统，为 Move 包提供人类可读的名称和版本管理。开发者可以通过名称引用依赖包，而不需要使用原始的包地址。

## 去中心化金融（DeFi）

### DeepBook：链上订单簿

DeepBook 是 Sui 上的原生链上中央限价订单簿（CLOB）协议。与使用自动做市商（AMM）的 DEX 不同，DeepBook 提供了类似中心化交易所的交易体验：

- **限价单和市价单**：支持完整的订单类型
- **链上撮合**：所有订单匹配都在链上完成，完全透明
- **高性能**：利用 Sui 的并行执行能力，实现高吞吐量的订单处理
- **共享流动性**：作为基础设施层，其他 DeFi 协议可以直接接入 DeepBook 的流动性

```move
module examples::deepbook_usage;

use deepbook::clob_v2;

/// DeepBook 交易示例（概念性代码）
/// 在真实场景中需要引入 deepbook 依赖
public fun place_limit_order_example() {
    // 1. 创建交易池
    // clob_v2::create_pool<BaseAsset, QuoteAsset>(...)

    // 2. 创建托管账户
    // clob_v2::create_account(...)

    // 3. 存入资产
    // clob_v2::deposit_base(...)

    // 4. 下限价单
    // clob_v2::place_limit_order(...)

    // 5. 撮合引擎自动匹配订单
}
```

### 主要 DeFi 协议

Sui 上已经涌现出众多 DeFi 协议，覆盖了去中心化金融的各个领域：

#### DEX（去中心化交易所）

| 协议 | 类型 | 特点 |
|------|------|------|
| Cetus | 集中流动性 AMM | 类似 Uniswap V3 的集中流动性机制 |
| Turbos | 集中流动性 AMM | 专注于资本效率和交易体验 |
| Aftermath | AMM + 路由 | 智能路由聚合多个流动性来源 |
| DeepBook | 订单簿 CLOB | 原生链上订单簿 |

#### 借贷协议

| 协议 | 特点 |
|------|------|
| Scallop | 支持多种抵押品的借贷市场 |
| NAVI | 一站式流动性协议 |
| Suilend | 高效的借贷市场 |

#### 流动性质押

| 协议 | 特点 |
|------|------|
| Aftermath (afSUI) | 流动性质押代币 |
| Volo (voloSUI) | 高收益流动性质押 |
| Haedal (haSUI) | 自动复利质押方案 |

#### 稳定币与收益

| 协议 | 特点 |
|------|------|
| Bucket Protocol | 超额抵押稳定币 |
| Typus | 结构化收益产品 |

## 身份与认证

### zkLogin：零知识登录

zkLogin 是 Sui 最具创新性的功能之一，它允许用户使用 Google、Facebook、Apple 等社交账号直接登录 Sui 应用，而无需创建和管理加密钱包。

```
zkLogin 工作流程:

用户                 应用                OAuth 提供商        Sui 网络
 │                    │                    │                 │
 │  1. 点击登录       │                    │                 │
 │──────────────────▶│                    │                 │
 │                    │  2. OAuth 请求      │                 │
 │                    │──────────────────▶│                 │
 │  3. 社交登录       │                    │                 │
 │◀──────────────────────────────────────│                 │
 │                    │  4. JWT Token       │                 │
 │                    │◀──────────────────│                 │
 │                    │                    │                 │
 │                    │  5. 生成零知识证明   │                 │
 │                    │  (证明 JWT 有效，    │                 │
 │                    │   但不泄露身份信息)  │                 │
 │                    │                    │                 │
 │                    │  6. 提交交易 + ZK证明│                 │
 │                    │──────────────────────────────────▶│
 │                    │                    │  7. 验证并执行   │
 │                    │                    │                 │
```

zkLogin 的核心价值：

- **零门槛**：用户不需要记住助记词或管理私钥
- **隐私保护**：零知识证明确保社交身份信息不会泄露到链上
- **无缝体验**：Web2 用户可以像使用传统应用一样使用 DApp

### 多签（Multisig）

Sui 原生支持多签钱包，允许设置 M-of-N 的签名策略。组织和团队可以共同管理资金，提高安全性。

## NFT 与数字资产

### Kiosk：数字资产市场框架

Kiosk 是 Sui 的原生数字资产交易框架。它提供了一个标准化的方式来展示、出售和管理 NFT 等数字资产，同时支持创作者自定义**转移策略（Transfer Policy）**。

```move
module examples::kiosk_demo;

use sui::kiosk;
use sui::transfer_policy;

/// Kiosk 核心概念:
///
/// 1. Kiosk（展柜）:
///    - 类似一个个人商店
///    - 所有者可以在其中放置和展示 NFT
///    - 支持上架出售和下架操作
///
/// 2. Transfer Policy（转移策略）:
///    - 创作者定义 NFT 转移时的规则
///    - 可以强制收取版税
///    - 可以限制转移目标
///
/// 3. Purchase Cap（购买凭证）:
///    - 买家获得购买凭证后才能完成交易
///    - 确保所有转移都遵循转移策略

/// 一个简单的 NFT
public struct ArtNFT has key, store {
    id: UID,
    name: vector<u8>,
    artist: address,
}

/// 铸造 NFT 并放入 Kiosk
public fun mint_to_kiosk(
    kiosk: &mut kiosk::Kiosk,
    cap: &kiosk::KioskOwnerCap,
    name: vector<u8>,
    ctx: &mut TxContext,
) {
    let nft = ArtNFT {
        id: object::new(ctx),
        name,
        artist: ctx.sender(),
    };
    kiosk.place(cap, nft);
}
```

Kiosk 的设计优势：

- **创作者保护**：强制执行版税，创作者在每次转售中获得收益
- **标准化交易**：统一的交易接口，方便市场聚合
- **灵活策略**：支持自定义规则，如白名单、冻结期等

### 链上游戏

Sui 的对象模型和高性能使其成为链上游戏的理想平台：

- **游戏资产即对象**：武器、装备、角色等都是 Sui 对象，玩家真正拥有它们
- **低延迟**：快速路径确保游戏内交易的即时确认
- **可组合性**：不同游戏之间的资产可以互操作
- **动态 NFT**：利用动态字段，NFT 的属性可以随游戏进程演变

## 生态全景图

```
┌─────────────────────────────────────────────────────────────┐
│                    Sui 生态全景                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─── 基础设施 ───────────────────────────────────────────┐ │
│  │  Walrus (存储)  │  Sui Bridge (跨链)  │  SuiNS (域名)  │ │
│  │  Move Registry  │  Mysten Labs 索引器  │  GraphQL API   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─── DeFi ──────────────────────────────────────────────┐ │
│  │  DeepBook (CLOB) │  Cetus (AMM)  │  Scallop (借贷)    │ │
│  │  NAVI (借贷)     │  Aftermath    │  Turbos (AMM)      │ │
│  │  Bucket (稳定币) │  Suilend      │  Typus (结构化)    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─── 身份与认证 ────────────────────────────────────────┐ │
│  │  zkLogin (零知识登录)   │  Multisig (多签)             │ │
│  │  Enoki (开发者身份工具) │  zkSend (隐私转账)           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─── NFT / 游戏 ───────────────────────────────────────┐ │
│  │  Kiosk (市场框架)    │  SuiFrens (官方 NFT)           │ │
│  │  Clutchy (游戏平台)  │  BlueMove (NFT 市场)           │ │
│  │  Mysticeti (游戏)   │  各种 PFP / 艺术 NFT 系列       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─── 开发工具 ──────────────────────────────────────────┐ │
│  │  Sui CLI        │  Move Analyzer (LSP)                │ │
│  │  Sui TypeScript SDK   │  dApp Kit (React)             │ │
│  │  Sui Rust SDK   │  Move Formatter / Linter            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─── 前沿技术 ──────────────────────────────────────────┐ │
│  │  Nautilus (TEE 可信计算)   │  Seal (密钥管理)          │ │
│  │  链上随机数 (drand)       │  Sponsored Transactions    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 开发者工具链

Sui 为开发者提供了完善的工具链：

### Sui CLI

命令行工具，支持项目创建、编译、测试、部署和链上交互：

```bash
# 创建新项目
sui move new my_project

# 编译
sui move build

# 运行测试
sui move test

# 发布到测试网
sui client publish
```

### TypeScript SDK 与 dApp Kit

Sui 提供了功能完备的 TypeScript SDK 和 React dApp Kit，让前端开发者能快速构建 DApp：

```typescript
// TypeScript SDK 使用示例
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Transaction } from '@mysten/sui/transactions';

const client = new SuiGrpcClient({
  network: 'mainnet',
  baseUrl: 'https://fullnode.mainnet.sui.io:443',
});

// 构建可编程交易块
const tx = new Transaction();
tx.moveCall({
    target: '0x...::module::function',
    arguments: [tx.pure.u64(100)],
});
```

### Move Analyzer

Move 语言的 LSP（Language Server Protocol）实现，为 VS Code 等编辑器提供代码补全、类型检查、跳转定义等功能。

## 小结

Sui 生态正在快速发展，涵盖了从基础设施到上层应用的完整技术栈。Walrus 解决了去中心化存储问题，DeepBook 提供了专业级的链上交易体验，zkLogin 消除了 Web3 的用户门槛，Kiosk 为数字资产交易建立了标准框架。丰富的开发者工具链让构建 Sui 应用变得高效而愉快。随着更多创新项目的涌现，Sui 生态的边界还将持续扩展。在下一节中，我们将追溯 Move 语言的起源与演进，理解它是如何从 Facebook 的实验性项目成长为 Sui 的核心编程语言的。


---


<!-- source: 01_introduction/move-evolution.md -->
## 1.4 Move 语言的诞生与演进

# Move 语言的演进

Move 语言诞生于 2018 年 Facebook（现 Meta）的 Libra（后更名为 Diem）区块链项目，并于 2019 年随 Libra 白皮书首次公开亮相。它是第一种专为数字资产设计的智能合约语言，从一开始就将**安全性**、**资源导向**和**形式化验证**作为核心设计目标。如今，Move 已经从 Diem 的账户模型演化到 Sui 的对象模型，在保持语言内核安全特性的同时，获得了前所未有的表达力和性能。

## Move 的诞生：Diem 时代

### 背景与设计动机

2018 年，Facebook 启动了雄心勃勃的 Libra 项目，目标是创建一个全球性的数字货币和金融基础设施。项目团队意识到，现有的智能合约语言（尤其是 Solidity）在安全性方面存在根本性的缺陷——重入攻击、整数溢出、权限管理混乱等问题导致了数十亿美元的资产损失。

为此，他们决定从零开始设计一门新语言，核心设计原则包括：

- **资源安全**：数字资产不能被复制或意外销毁，就像现实世界中的物理资产
- **类型安全**：通过强类型系统在编译期捕获尽可能多的错误
- **模块封装**：资源类型只能由定义它的模块创建和销毁
- **形式化可验证**：语言设计支持数学层面的安全性证明

### 线性类型与资源模型

Move 最核心的创新是引入了**线性类型系统**。在传统编程语言中，一个值可以被随意复制和丢弃。但在 Move 中，某些类型（资源类型）必须被**恰好使用一次**——不能复制，不能丢弃，只能移动（Move）。

```move
module examples::linear_type_demo;

/// 一个不能被复制或丢弃的代币
/// 没有 copy 和 drop 能力
public struct PreciousToken has key, store {
    id: UID,
    value: u64,
}

/// 创建代币
public fun mint(value: u64, ctx: &mut TxContext): PreciousToken {
    PreciousToken {
        id: object::new(ctx),
        value,
    }
}

/// 销毁代币并取回值
public fun burn(token: PreciousToken): u64 {
    let PreciousToken { id, value } = token;
    id.delete();
    value
}

/// 以下代码将无法编译——Move 编译器阻止了不安全行为：
///
/// fun unsafe_copy(token: &PreciousToken): PreciousToken {
///     *token  // 错误! PreciousToken 没有 copy 能力
/// }
///
/// fun unsafe_drop(token: PreciousToken) {
///     // 什么都不做就返回
///     // 错误! PreciousToken 没有 drop 能力，必须被显式处理
/// }
```

这种设计从语言层面保证了数字资产的安全性——你的代币不可能因为编程错误而被凭空复制或消失。

### Ability 系统

Move 使用**四种 Ability（能力）**来精确控制类型的行为：

| Ability | 含义 | 作用 |
|---------|------|------|
| `copy` | 可以复制 | 允许值被复制 |
| `drop` | 可以丢弃 | 允许值在作用域结束时被自动销毁 |
| `store` | 可以存储 | 允许值被存储在其他对象的字段中 |
| `key` | 可以作为对象 | 允许值作为 Sui 对象使用（需要 `id: UID` 字段） |

```move
module examples::abilities_demo;

/// 普通数据——可以自由复制和丢弃
public struct Point has copy, drop {
    x: u64,
    y: u64,
}

/// 链上对象——可以存储和转移，但不能复制
public struct Sword has key, store {
    id: UID,
    damage: u64,
    level: u8,
}

/// 权限凭证——只能转移，不能复制或存储到其他对象中
public struct AdminCap has key {
    id: UID,
}
```

## 从 Diem Move 到 Sui Move

### 账户模型 vs 对象模型

Diem/Aptos Move 和 Sui Move 最大的区别在于**存储模型**。

在 Diem Move 中，资源存储在**账户**之下。如果 Alice 想把一个 Token 转给 Bob，Bob 的账户下必须先有一个接收该类型 Token 的"容器"：

```
Diem Move（账户模型）:

Alice 的账户 (0xAlice)
└── Token { value: 100 }

转移前提: Bob 的账户必须先执行 "accept<Token>()" 创建空容器
Bob 的账户 (0xBob)
└── Token { value: 0 }  ← 必须预先存在！

转移过程:
1. 从 Alice 账户取出 Token
2. 检查 Bob 账户是否有 Token 容器
3. 合并到 Bob 的 Token 中
```

Sui Move 彻底改变了这个模型。在 Sui 中，对象是**一等公民**，拥有全局唯一 ID 和独立的所有权。Alice 可以直接将对象转给 Bob，无需 Bob 做任何准备：

```
Sui Move（对象模型）:

对象 0xAABB (Token)
├── id: 0xAABB
├── owner: Alice
└── value: 100

转移过程:
1. 更改对象 0xAABB 的 owner 为 Bob
就这么简单！Bob 不需要做任何操作。
```

### 代码对比

以下代码展示了同样的"转移代币"操作在两种模型中的差异：

```move
// ===== Sui Move 风格 =====
module examples::sui_token;

public struct Token has key, store {
    id: UID,
    value: u64,
}

/// 铸造并直接转给接收者
/// Bob 不需要任何前置操作！
public fun mint_and_send(
    value: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let token = Token {
        id: object::new(ctx),
        value,
    };
    transfer::public_transfer(token, recipient);
}
```

在 Diem/Aptos Move 中，类似操作需要更多的样板代码——接收者需要先"注册"才能接收资源。Sui 的对象模型消除了这种摩擦，让数字资产的转移像发送电子邮件一样简单。

### 关键差异总结

| 特性 | Diem/Aptos Move | Sui Move |
|------|----------------|----------|
| **存储模型** | 账户下存储资源 | 全局对象存储 |
| **资产标识** | 由账户地址 + 类型标识 | 全局唯一 UID |
| **转移机制** | 接收者需预先创建容器 | 直接转移，无需接收者准备 |
| **并行执行** | 受限（共享全局状态） | 天然支持（对象独立） |
| **入口函数** | `entry fun` + `signer` | `entry fun` + `TxContext` |
| **模块初始化** | 无原生支持 | `init` 函数在发布时自动执行 |

## Move vs Solidity

对于从以太坊转来的开发者，理解 Move 和 Solidity 的区别尤为重要。

### 类型安全

Solidity 中的代币本质上是一个映射表中的数字，没有类型安全保障：

```solidity
// Solidity — 代币只是一个数字
mapping(address => uint256) public balances;

function transfer(address to, uint256 amount) public {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    balances[to] += amount;
}
```

Move 中的代币是一个**真正的类型对象**，编译器保证它不能被凭空创造或复制：

```move
module examples::move_token;

/// 代币是一个有 Ability 约束的结构体
/// 只能通过 mint 创建，通过 burn 销毁
public struct Token has key, store {
    id: UID,
    value: u64,
}

/// 唯一的创建途径
public fun mint(treasury: &mut Treasury, value: u64, ctx: &mut TxContext): Token {
    treasury.total_supply = treasury.total_supply + value;
    Token { id: object::new(ctx), value }
}

/// 唯一的销毁途径
public fun burn(treasury: &mut Treasury, token: Token) {
    let Token { id, value } = token;
    treasury.total_supply = treasury.total_supply - value;
    id.delete();
}

public struct Treasury has key {
    id: UID,
    total_supply: u64,
}
```

### 重入攻击

重入攻击是 Solidity 中最臭名昭著的安全漏洞，2016 年的 The DAO 事件导致了 6000 万美元的损失。

```solidity
// Solidity — 存在重入风险
function withdraw(uint256 amount) public {
    require(balances[msg.sender] >= amount);
    // 危险！先转账，再更新余额
    (bool success,) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount;  // 攻击者可以在这之前重复调用 withdraw
}
```

**Move 从语言设计上完全消除了重入攻击的可能性：**

1. **没有动态调度**：Move 的函数调用在编译时完全确定，不存在 Solidity 中的 `call` 机制
2. **线性类型**：资源在同一时刻只能有一个所有者，不可能在持有资源的同时将其传递给外部代码
3. **借用检查**：Move 的引用系统保证不会出现可变引用和不可变引用同时存在的情况

```move
module examples::safe_withdraw;

use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::balance::Balance;

const EInsufficientBalance: u64 = 0;

/// Move 中的提款——天然安全，无需特殊防护
public fun withdraw(vault: &mut Vault, amount: u64, ctx: &mut TxContext): Coin<SUI> {
    assert!(vault.balance >= amount, EInsufficientBalance);
    vault.balance = vault.balance - amount;
    // 返回 Coin 对象，调用者获得所有权
    // 不存在回调机制，不可能触发重入
    coin::take(&mut vault.coin_balance, amount, ctx)
}

public struct Vault has key {
    id: UID,
    balance: u64,
    coin_balance: Balance<SUI>,
}
```

### 全面对比

| 维度 | Solidity | Move |
|------|----------|------|
| **类型系统** | 弱类型，资产是 mapping 中的数字 | 强类型，资产是一等类型对象 |
| **重入攻击** | 需要 ReentrancyGuard 等模式防护 | 语言层面不可能发生 |
| **整数安全** | 需要 SafeMath（0.8.0 后内置检查） | 编译器内置溢出检查 |
| **资产安全** | 依赖开发者正确实现逻辑 | 编译器保证资产不被复制或丢弃 |
| **权限控制** | 通常用 `onlyOwner` 修饰符 | Capability 模式 + 类型系统 |
| **升级机制** | 代理模式（复杂且有风险） | 原生包升级机制 |
| **形式化验证** | 有限支持 | Move Prover 提供数学级别验证 |

## Move 的核心价值观

Move 语言的设计哲学可以概括为三个核心价值：

### 1. 默认安全（Secure by Default）

安全不是事后添加的特性，而是融入语言 DNA 的设计原则。Move 编译器会在你的代码运行之前就捕获绝大多数安全漏洞：

```move
module examples::secure_by_default;

/// 编译器保证:
/// 1. NFT 不能被复制（没有 copy ability）
/// 2. NFT 不能被意外丢弃（没有 drop ability）
/// 3. 只有该模块能创建和销毁 NFT
public struct NFT has key, store {
    id: UID,
    name: vector<u8>,
}

/// 这是创建 NFT 的唯一入口
public fun mint(name: vector<u8>, ctx: &mut TxContext): NFT {
    NFT { id: object::new(ctx), name }
}

/// 这是销毁 NFT 的唯一入口
public fun burn(nft: NFT) {
    let NFT { id, name: _ } = nft;
    id.delete();
}

/// 模块外的代码无法绕过这些函数来创建或销毁 NFT
/// 这是由 Move 的模块封装机制在语言层面保证的
```

### 2. 天然表达力（Expressive by Nature）

Move 提供了丰富的原语来表达复杂的数字资产逻辑。可编程对象、动态字段、可编程交易块等特性让开发者能够构建高度灵活的应用：

```move
module examples::expressive;

use sui::dynamic_field;

/// 一个可以动态扩展属性的角色
public struct Character has key {
    id: UID,
    name: vector<u8>,
    level: u64,
}

/// 装备武器——使用动态字段
public fun equip_weapon(character: &mut Character, weapon: Weapon) {
    dynamic_field::add(&mut character.id, b"weapon", weapon);
}

/// 武器本身也是一个结构体
public struct Weapon has store {
    name: vector<u8>,
    damage: u64,
}

/// 在 PTB 中，这些操作可以组合在一笔交易中:
/// 1. 铸造角色
/// 2. 铸造武器
/// 3. 装备武器
/// 4. 将角色转给玩家
/// 全部在一笔交易中原子性完成！
```

### 3. 对所有人直觉化（Intuitive for All）

Move 2024 Edition 引入了大量语法改进，让代码更加简洁和直观：

```move
module examples::intuitive;

use std::string::String;

public struct Profile has key {
    id: UID,
    name: String,
    bio: String,
    score: u64,
}

public fun create_profile(
    name: String,
    bio: String,
    ctx: &mut TxContext,
): Profile {
    Profile {
        id: object::new(ctx),
        name,
        bio,
        score: 0,
    }
}

/// Move 2024 方法语法——像调用对象方法一样
public fun update_score(profile: &mut Profile, delta: u64) {
    profile.score = profile.score + delta;
}

/// 使用示例（在测试或 PTB 中）:
/// let profile = create_profile(name, bio, ctx);
/// profile.update_score(10);  // 方法语法：直观！
```

## Move 语言时间线

```
2018 年
├── Facebook 启动 Libra 项目
└── Move 语言开始设计和开发

2019 年
├── 6 月: Libra 白皮书发布，Move 首次公开亮相
└── Move 技术论文发表

2020 年
├── Libra 更名为 Diem
├── 第一个 Move 网络启动
└── Move Prover（形式化验证工具）发布

2021 年
├── Mysten Labs 成立（由前 Meta/Novi 核心成员创建）
└── Sui 项目启动，开始设计对象模型

2022 年
├── Meta 宣布关闭 Diem 项目
├── Sui 测试网上线
├── Move 社区分化：Aptos Move（账户模型）vs Sui Move（对象模型）
└── Sui 获得大规模融资

2023 年
├── 5 月: Sui 主网正式上线
├── Move 2024 Edition 预览
└── zkLogin、DeepBook 等创新功能发布

2024 年
├── Move 2024 Edition 正式发布
├── 枚举类型、方法语法等新特性落地
├── Walrus 去中心化存储发布
└── Sui 生态快速扩张

2025–2026 年
├── Move 语言持续演进
├── Sui 性能进一步优化
└── 生态项目全面开花
```

## Move 的核心技术要素

### 可编程对象（Programmable Objects）

每个 Sui 对象都有唯一 ID、明确的所有权和类型化的数据。对象是 Move 在 Sui 上最核心的抽象单元。

### Ability 系统（线性类型）

四种 Ability（`key`、`store`、`copy`、`drop`）精确控制值的生命周期行为，从编译期保证资源安全。

### 模块系统与强封装

Move 的模块是类型和函数的命名空间。关键安全属性：**只有定义类型的模块才能创建、销毁和访问该类型的内部字段**。这种封装是不可绕过的。

### 动态字段（Dynamic Fields）

允许在运行时向对象添加任意类型的键值对，实现灵活的数据模型扩展，而不需要预先定义所有字段。

### 可编程交易块（PTBs）

允许在单笔交易中组合多个 Move 调用，前一个调用的返回值可以直接作为后一个调用的参数。这是 Sui 独有的强大特性，实现了无合约级别的可组合性。

## 小结

Move 语言从 2018 年 Facebook Libra 项目中诞生，经历了从 Diem 到 Sui 的重大演化。它的核心设计——线性类型、Ability 系统、模块封装——在 Sui 的对象模型中得到了最充分的发挥。与 Solidity 相比，Move 在类型安全、资产安全和重入防护方面具有本质性的优势。Move 2024 Edition 进一步提升了语言的表达力和开发者体验，使其成为当前最先进的智能合约语言之一。从下一章开始，我们将搭建开发环境，亲手编写第一个 Move 程序，开始真正的 Move on Sui 之旅。


---


<!-- source: 01_introduction/suiup.md -->
## 1.5 Suiup — 工具链管理器

# Suiup — Sui 生态工具链管理器

Suiup 是 Mysten Labs 官方推出的 Sui 生态 CLI 安装与版本管理工具，类似于 Rust 生态中的 `rustup`。通过 suiup，你可以一键安装、升级和切换 Sui CLI 及其他生态工具，无需手动下载二进制文件或从源码编译。

## 为什么使用 Suiup

在没有 suiup 之前，安装 Sui CLI 通常需要：

- 安装 Rust 工具链
- 从源码编译 `sui`（耗时较长）
- 手动管理不同网络版本的切换

suiup 解决了这些痛点：

| 功能 | 说明 |
|------|------|
| **一键安装** | 自动下载对应平台的预编译二进制 |
| **版本管理** | 同时安装多个版本，自由切换 |
| **网络对齐** | 直接安装 testnet / devnet / mainnet 对应版本 |
| **生态覆盖** | 不止 sui，还管理 walrus、mvr、move-analyzer 等 |
| **自动更新** | 一条命令升级到最新版本 |

## 安装 Suiup

### macOS / Linux（推荐方式）

打开终端，运行以下命令：

```bash
curl -sSfL https://raw.githubusercontent.com/MystenLabs/suiup/main/install.sh | sh
```

安装脚本会自动：
1. 检测操作系统（macOS / Linux）和 CPU 架构（x86_64 / ARM64）
2. 下载对应的 suiup 二进制文件
3. 安装到 `~/.local/bin/` 目录

安装完成后，重启终端或执行：

```bash
source ~/.bashrc  # bash 用户
source ~/.zshrc   # zsh 用户（macOS 默认）
```

验证安装：

```bash
suiup --version
```

### 自定义安装路径

如果你想安装到其他目录：

```bash
SUIUP_INSTALL_DIR=/opt/suiup curl -sSfL https://raw.githubusercontent.com/MystenLabs/suiup/main/install.sh | sh
```

### 通过 Cargo 安装

如果你已经安装了 Rust 工具链，也可以通过 Cargo 安装：

```bash
cargo install --git https://github.com/MystenLabs/suiup.git --locked
```

### Windows

1. 从 [GitHub Releases](https://github.com/MystenLabs/suiup/releases) 下载最新的 `suiup-Windows-msvc-x86_64.zip`
2. 解压后将 `suiup.exe` 放到 PATH 目录中

### 支持的平台

| 操作系统 | 架构 | 支持状态 |
|----------|------|---------|
| macOS | x86_64 (Intel) | ✅ 完全支持 |
| macOS | ARM64 (Apple Silicon) | ✅ 完全支持 |
| Linux | x86_64 | ✅ 完全支持 |
| Linux | ARM64 | ✅ 完全支持 |
| Windows | x86_64 | ✅ 完全支持 |
| Windows | ARM64 | ⚠️ 有限支持 |

## 安装 Sui CLI

suiup 安装成功后，用它来安装 Sui CLI：

```bash
# 安装最新 testnet 版本（默认）
suiup install sui

# 安装特定网络版本
suiup install sui@testnet
suiup install sui@devnet
suiup install sui@mainnet

# 安装特定版本号
suiup install sui@testnet-1.40.1
suiup install sui@1.44.2

# 跳过确认提示（CI 环境常用）
suiup install sui -y
```

安装完成后验证：

```bash
sui --version
sui client --version
```

### 安装 Debug 版本

如果你需要使用 `sui move test --coverage`（测试覆盖率），需要安装 debug 版本：

```bash
suiup install sui --debug
```

### 从源码编译安装（Nightly）

如果你需要最新开发分支的功能（需要 Rust 工具链）：

```bash
# 默认从 main 分支编译
suiup install sui --nightly

# 指定分支
suiup install sui --nightly releases/sui-v1.45.0-release
```

## 可安装的工具

suiup 不仅管理 Sui CLI，还支持整个 Sui 生态的工具链：

```bash
suiup list
```

| 工具 | 说明 | 安装命令 |
|------|------|---------|
| `sui` | Sui CLI（核心工具） | `suiup install sui` |
| `sui-node` | Sui 全节点 | `suiup install sui-node` |
| `move-analyzer` | Move 语言分析器（IDE 插件后端） | `suiup install move-analyzer` |
| `mvr` | Move Registry CLI | `suiup install mvr` |
| `walrus` | Walrus 去中心化存储 CLI | `suiup install walrus` |
| `site-builder` | Walrus Sites 静态站点构建器 | `suiup install site-builder` |
| `ledger-signer` | Ledger 硬件钱包签名工具 | `suiup install ledger-signer` |
| `yubikey-signer` | YubiKey 签名工具 | `suiup install yubikey-signer` |

### 推荐的开发环境安装

对于 Move 开发者，建议至少安装以下工具：

```bash
suiup install sui@testnet
suiup install move-analyzer
suiup install mvr
```

## 版本管理与切换

suiup 的核心优势在于可以同时管理多个版本。

### 查看已安装的版本

```bash
suiup show
```

输出示例：

```
sui:
  testnet-1.44.2 (default)
  devnet-1.45.0
  mainnet-1.43.1
move-analyzer:
  mainnet-2024.1.1 (default)
mvr:
  0.0.8 (default)
```

### 切换默认版本

当你同时安装了多个版本，可以随时切换：

```bash
# 切换 sui 到 devnet 版本
suiup default set sui@devnet

# 切换到特定版本
suiup default set sui@testnet-1.40.0

# 切换 debug 版本为默认
suiup default set sui@testnet-1.44.2 --debug
```

也可以使用 `switch` 命令快速切换：

```bash
suiup switch sui@testnet
suiup switch sui@devnet
suiup switch sui@mainnet
```

### 查看当前默认版本

```bash
suiup default get
```

### 查看工具的安装路径

```bash
suiup which
```

## 升级工具

### 升级已安装的工具

```bash
# 升级 sui 到对应网络的最新版本
suiup update sui

# 升级特定网络的 sui
suiup update sui@testnet
suiup update sui@devnet

# 跳过确认
suiup update sui -y

# 升级其他工具
suiup update walrus
suiup update mvr
```

### 升级 Suiup 自身

```bash
suiup self update
```

## 环境诊断

如果遇到问题，使用 `doctor` 命令进行环境检查：

```bash
suiup doctor
```

该命令会检查：
- PATH 配置是否正确
- 已安装的二进制文件是否完整
- GitHub API 是否可访问
- 配置文件是否正常

## 缓存清理

suiup 会缓存下载的安装包，可以定期清理：

```bash
# 清理 30 天前的缓存（默认）
suiup cleanup

# 清理 7 天前的缓存
suiup cleanup --days 7

# 清理所有缓存
suiup cleanup --all

# 预览会清理什么（不实际删除）
suiup cleanup --dry-run
```

## 卸载

### 卸载已安装的工具

```bash
suiup remove sui
suiup remove walrus
```

> **注意：** `remove` 命令目前可能不太稳定，建议手动删除对应的二进制文件。

### 卸载 Suiup 自身

```bash
suiup self uninstall
```

## CI / CD 集成

在 CI 环境中使用 suiup，推荐设置 GitHub Token 以避免 API 速率限制：

```bash
GITHUB_TOKEN=your_token suiup install sui -y
```

GitHub Actions 示例：

```yaml
name: Build and Test
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install suiup
        run: curl -sSfL https://raw.githubusercontent.com/MystenLabs/suiup/main/install.sh | sh

      - name: Install Sui
        run: suiup install sui@testnet -y
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and Test
        run: |
          sui move build
          sui move test
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `SUIUP_INSTALL_DIR` | 自定义 suiup 安装目录 |
| `SUIUP_DEFAULT_BIN_DIR` | 自定义默认二进制文件目录 |
| `GITHUB_TOKEN` | GitHub API Token（提高速率限制） |
| `SUIUP_DISABLE_UPDATE_WARNINGS` | 禁用 suiup 更新提醒 |

## 常用命令速查

```bash
# 安装
suiup install sui@testnet          # 安装 Sui（testnet）
suiup install sui@devnet           # 安装 Sui（devnet）
suiup install move-analyzer        # 安装 Move 语言分析器

# 查看
suiup show                         # 查看所有已安装的工具和版本
suiup list                         # 查看所有可安装的工具
suiup which                        # 查看默认二进制路径
suiup default get                  # 查看当前默认版本

# 版本切换
suiup switch sui@testnet           # 切换到 testnet 版本
suiup default set sui@devnet       # 设置 devnet 为默认

# 升级
suiup update sui                   # 升级 Sui
suiup self update                  # 升级 suiup 自身

# 维护
suiup doctor                       # 环境诊断
suiup cleanup                      # 清理缓存
```

## 小结

suiup 是 Sui 开发者的必备工具，它让工具链管理变得简单高效：

- **安装简单**：一行命令安装 suiup，再一行命令安装 sui
- **版本管理**：轻松在 testnet / devnet / mainnet 之间切换
- **生态覆盖**：统一管理 sui、walrus、mvr、move-analyzer 等所有生态工具
- **持续更新**：一条命令完成升级，始终保持最新版本

建议所有 Sui 开发者使用 suiup 作为工具链管理的标准方式，取代手动安装和源码编译。


---


<!-- source: 02_getting_started/index.md -->
## 第二章 · 开发环境搭建

# 第二章 · 开发环境搭建

本章将指导你从零搭建完整的 Sui Move 开发环境，包括 CLI 工具、IDE 配置、钱包创建和网络连接。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 2.1 | 安装 Sui CLI | 通过 suiup 或手动方式安装 Sui CLI |
| 2.2 | IDE 与编辑器配置 | VS Code 插件、Move Analyzer、代码补全 |
| 2.3 | 创建钱包与获取测试币 | CLI 钱包管理、网络切换、水龙头领币 |
| 2.4 | Move 2024 Edition | 新版语法特性：method syntax、enum、public(package) |

## 学习目标

读完本章后，你将能够：

- 在本地运行 `sui` 命令并查看版本
- 在 VS Code 中获得 Move 代码的语法高亮和错误提示
- 拥有一个 devnet/testnet 钱包并持有测试 SUI


---


<!-- source: 02_getting_started/install-sui.md -->
## 2.1 安装 Sui CLI

# 安装 Sui CLI

Sui CLI 是开发 Move 智能合约和与 Sui 网络交互的核心工具。它集成了项目创建、编译、测试、部署和链上交互等全套功能，是每位 Sui 开发者的必备工具。本节将介绍多种安装方式，并帮助你完成环境验证。

## 安装方式

### 使用 suiup 安装（推荐）

`suiup` 是 Sui 官方提供的版本管理工具，类似于 Rust 的 `rustup`。它可以方便地安装、切换和管理不同版本的 Sui CLI。

```bash
# 安装 suiup
curl -fsSL https://sui.io/suiup.sh | bash

# 使用 suiup 安装最新稳定版 Sui CLI
suiup install sui
```

安装完成后，`sui` 命令将自动添加到你的 `PATH` 中。如果终端提示找不到命令，请重新打开终端或执行 `source ~/.bashrc`（或 `source ~/.zshrc`）。

### 使用 Homebrew 安装（macOS）

macOS 用户可以通过 Homebrew 快速安装：

```bash
brew install sui
```

### 使用 Chocolatey 安装（Windows）

Windows 用户可以通过 Chocolatey 包管理器安装：

```bash
choco install sui
```

### 下载预编译二进制文件

你也可以直接从 GitHub Releases 页面下载对应平台的预编译二进制文件：

1. 访问 [Sui Releases](https://github.com/MystenLabs/sui/releases)
2. 选择目标版本，下载对应操作系统的压缩包
3. 解压后将 `sui` 二进制文件移动到系统 `PATH` 目录下

```bash
# macOS / Linux 示例
tar -xzf sui-<version>-<platform>.tgz
sudo mv sui /usr/local/bin/
```

### 从源码编译安装

如果你需要最新的开发版本，或者想要自定义编译选项，可以通过 Cargo 从源码编译：

```bash
# 前提：已安装 Rust 工具链
# 安装 mainnet 分支版本
cargo install --git https://github.com/MystenLabs/sui.git sui --branch mainnet

# 安装 testnet 分支版本
cargo install --git https://github.com/MystenLabs/sui.git sui --branch testnet
```

> **注意**：从源码编译需要较长时间（通常 10-30 分钟），且需要足够的磁盘空间和内存。建议至少预留 2GB 内存和 10GB 磁盘空间。

## 验证安装

安装完成后，运行以下命令验证：

```bash
sui client --version
```

你应该看到类似如下的输出：

```bash
sui 1.45.2-abc1234
```

你还可以查看所有可用命令：

```bash
sui --help
```

## 使用 suiup 管理版本

在实际开发中，你可能需要在不同网络环境之间切换。例如，testnet 和 mainnet 可能运行着不同版本的 Sui 协议。`suiup` 可以帮助你轻松管理多个版本。

```bash
# 查看当前安装的版本
suiup show

# 安装特定网络对应的版本
suiup install sui --network testnet
suiup install sui --network mainnet

# 切换到 testnet 版本
suiup use --network testnet

# 切换到 mainnet 版本
suiup use --network mainnet
```

> **最佳实践**：在部署合约到特定网络前，确保你使用的 Sui CLI 版本与目标网络的协议版本兼容。使用 `suiup` 切换到对应版本可以避免兼容性问题。

## 常见问题排查

### 命令找不到

如果安装后终端提示 `command not found: sui`：

```bash
# 检查安装路径
which sui

# 如果使用 suiup，确保 PATH 包含 ~/.sui/bin
echo $PATH | tr ':' '\n' | grep sui

# 手动添加到 PATH（添加到 ~/.zshrc 或 ~/.bashrc）
export PATH="$HOME/.sui/bin:$PATH"
source ~/.zshrc
```

### 依赖缺失（源码编译）

从源码编译时可能遇到依赖问题：

```bash
# macOS：安装 Xcode 命令行工具
xcode-select --install

# Ubuntu/Debian：安装必要依赖
sudo apt-get update
sudo apt-get install -y build-essential libssl-dev pkg-config cmake clang
```

### 版本不匹配

如果遇到与网络版本不兼容的错误：

```bash
# 查看当前版本
sui client --version

# 检查网络协议版本
sui client envs

# 使用 suiup 切换到匹配版本
suiup install sui --network <target-network>
suiup use --network <target-network>
```

### 权限问题

在 Linux/macOS 上可能遇到权限问题：

```bash
# 确保二进制文件有执行权限
chmod +x /usr/local/bin/sui

# 如果安装到系统目录需要 sudo
sudo mv sui /usr/local/bin/
```

## 小结

本节介绍了五种安装 Sui CLI 的方式：suiup（推荐）、Homebrew、Chocolatey、预编译二进制和源码编译。推荐使用 `suiup`，因为它不仅安装简便，还提供了版本管理功能，方便你在不同网络环境间切换。安装完成后，请务必通过 `sui client --version` 验证安装是否成功。下一节我们将配置 IDE 开发环境，为编写 Move 代码做好准备。


---


<!-- source: 02_getting_started/ide-setup.md -->
## 2.2 IDE 与编辑器配置

# IDE 开发环境配置

一个良好的 IDE 配置可以显著提升 Move 开发效率。通过语言服务器的支持，你可以获得代码补全、实时错误检查、跳转定义等功能，避免许多低级错误。本节将详细介绍如何配置主流编辑器来支持 Move 开发。

## Visual Studio Code（推荐）

VSCode 是目前 Move 开发体验最好的编辑器，拥有最完善的插件生态。

### 安装 Move 扩展

#### Move（Mysten Labs 官方扩展）

这是 Sui Move 开发的核心扩展，由 Mysten Labs 官方维护，提供：

- **Move Analyzer 语言服务器**：实时语法和类型检查
- **代码补全**：智能提示函数、类型、模块名等
- **跳转定义**：`Cmd/Ctrl + 点击` 跳转到符号定义
- **悬停文档**：鼠标悬停显示类型信息和文档
- **错误诊断**：编译错误实时显示在编辑器中

安装步骤：

1. 打开 VSCode
2. 按 `Cmd+Shift+X`（macOS）或 `Ctrl+Shift+X`（Windows/Linux）打开扩展面板
3. 搜索 "Move" 并安装由 **Mysten Labs** 发布的扩展

> **注意**：市场上有多个名为 "Move" 的扩展，请确认发布者是 **Mysten Labs**，而非其他第三方。

#### Move Formatter

基于 `prettier-plugin-move` 的代码格式化扩展，帮助你保持代码风格一致：

1. 在扩展面板搜索 "Move Formatter" 并安装
2. 在 VSCode 设置中将 Move 文件的默认格式化工具设为此扩展

在 VSCode 的 `settings.json` 中添加：

```json
{
    "[move]": {
        "editor.defaultFormatter": "mysten.prettier-move",
        "editor.formatOnSave": true
    }
}
```

#### Move Syntax

提供增强的 Move 语法高亮支持，让代码更易阅读。在扩展面板搜索 "Move Syntax" 并安装即可。

### VSCode 推荐配置

以下是一份针对 Move 开发优化的 VSCode 配置：

```json
{
    "editor.tabSize": 4,
    "editor.insertSpaces": true,
    "editor.rulers": [100],
    "editor.wordWrap": "off",
    "[move]": {
        "editor.defaultFormatter": "mysten.prettier-move",
        "editor.formatOnSave": true,
        "editor.tabSize": 4
    },
    "files.associations": {
        "Move.toml": "toml"
    }
}
```

### 工作区设置

对于多包项目，建议创建 `.vscode/settings.json` 进行工作区级别配置：

```json
{
    "move.sui.path": "/usr/local/bin/sui",
    "move.lint": true
}
```

## 其他编辑器

### IntelliJ IDEA

JetBrains 系列 IDE 用户可以使用 Move Language Plugin：

1. 打开 `Settings/Preferences → Plugins → Marketplace`
2. 搜索 "Move Language"，安装由 **MoveFuns** 发布的插件
3. 重启 IDE

该插件提供：

- Move 语法高亮
- 基本代码补全
- 项目结构识别
- Move.toml 文件支持

> **提示**：IntelliJ 的 Move 插件功能不如 VSCode 扩展完善，但对于习惯 JetBrains 生态的开发者来说仍是不错的选择。

### Emacs

Emacs 用户可以使用 `move-mode`：

```bash
# 通过 MELPA 安装
M-x package-install RET move-mode RET
```

或在 Emacs 配置文件中添加：

```elisp
(use-package move-mode
  :ensure t
  :mode "\\.move\\'"
  :hook (move-mode . (lambda ()
                       (setq tab-width 4)
                       (setq indent-tabs-mode nil))))
```

### Zed

Zed 编辑器通过其扩展系统提供 Move 支持：

1. 打开 Zed
2. 通过命令面板 `Cmd+Shift+P` 搜索 "Extensions"
3. 搜索并安装 Move 语言扩展

### GitHub Codespaces

如果你不想配置本地环境，GitHub Codespaces 是一个很好的选择：

1. 在 Sui 相关仓库中点击 "Code → Codespaces → New codespace"
2. Codespaces 会自动配置开发环境
3. 在线上 VSCode 中安装上述推荐的 Move 扩展

## 配置 Move Analyzer

Move Analyzer 是 Move 语言服务器的核心组件。在安装 Sui CLI 后，它通常已包含在内。你可以验证：

```bash
# 检查 move-analyzer 是否可用
sui move analyzer --version
```

如果 VSCode 无法找到 Move Analyzer，可能需要手动指定路径。在 VSCode 设置中搜索 "move" 并设置 `Move: Sui Path` 为 `sui` 二进制文件的完整路径：

```bash
# 查找 sui 的安装位置
which sui
```

## 开发工作流

一个高效的 Move 开发工作流通常包括以下步骤：

### 编辑 - 检查 - 构建 - 测试循环

```bash
# 1. 编辑代码（在 IDE 中进行，实时错误检查）

# 2. 构建项目
sui move build

# 3. 运行测试
sui move test

# 4. 运行特定测试
sui move test test_function_name

# 5. 查看测试覆盖
sui move test --coverage
```

### 集成终端

建议在 VSCode 中使用集成终端（`Ctrl + ~`），这样你可以在同一个窗口中编辑代码和运行命令。你可以设置常用命令的快捷方式：

```json
// .vscode/tasks.json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Move Build",
            "type": "shell",
            "command": "sui move build",
            "group": "build",
            "problemMatcher": []
        },
        {
            "label": "Move Test",
            "type": "shell",
            "command": "sui move test",
            "group": "test",
            "problemMatcher": []
        }
    ]
}
```

配置完成后，你可以通过 `Cmd+Shift+B`（macOS）或 `Ctrl+Shift+B`（Windows/Linux）快速运行构建任务。

## 小结

本节介绍了多种编辑器的 Move 开发环境配置，其中 VSCode + Mysten Labs 官方 Move 扩展是目前最推荐的方案。关键要确保以下三个功能正常工作：**实时错误检查**（通过 Move Analyzer）、**代码格式化**（通过 Move Formatter）和**语法高亮**（通过 Move Syntax）。配合集成终端和自动化任务，你将拥有一个流畅的 Move 开发体验。下一节我们将配置钱包并获取测试币，为部署合约做准备。


---


<!-- source: 02_getting_started/wallet-and-faucet.md -->
## 2.3 创建钱包与获取测试币

# 钱包与测试币

在 Sui 上部署和调用智能合约需要消耗 SUI 代币作为 Gas 费用。在开发阶段，我们可以通过 Sui CLI 创建钱包并从水龙头（Faucet）获取免费测试币。本节将介绍钱包的创建、网络环境切换以及测试币的获取方法。

## 创建钱包

### 首次初始化

第一次运行 `sui client` 时，CLI 会引导你完成钱包初始化：

```bash
sui client
```

系统会依次提示你配置以下内容：

```
Config file ["/Users/<username>/.sui/sui_config/client.yaml"] doesn't exist, do you want to connect to a Sui Full node server [y/N]?
```

输入 `y` 后选择连接的网络：

```
Sui Full node server URL (Defaults to Sui Devnet if not specified) :
```

可选的网络地址：

| 网络 | RPC 地址 |
|------|----------|
| 本地网络 | `http://127.0.0.1:9000` |
| Devnet | `https://fullnode.devnet.sui.io:443` |
| Testnet | `https://fullnode.testnet.sui.io:443` |
| Mainnet | `https://fullnode.mainnet.sui.io:443` |

接下来选择密钥方案：

```
Select key scheme to generate keypair (0 for ed25519, 1 for secp256k1, 2 for secp256r1):
```

三种密钥方案的区别：

- **ed25519**（推荐）：最常用的方案，性能好，安全性高
- **secp256k1**：与比特币和以太坊使用相同的曲线，适合跨链场景
- **secp256r1**：也称为 P-256，广泛用于 Web 标准和硬件安全模块

> **建议**：如果没有特殊需求，选择 `0`（ed25519）即可。

初始化完成后，系统会生成一个新的密钥对并显示你的地址：

```
Generated new keypair and alias for address with scheme "ed25519" [trusting-sapphire: 0x...]
```

### 导入已有密钥

如果你已有私钥或助记词，可以导入：

```bash
# 通过助记词导入
sui keytool import "<your-mnemonic-phrase>" ed25519

# 通过私钥导入
sui keytool import <private-key-base64> ed25519
```

## 地址管理

### 查看当前活跃地址

```bash
sui client active-address
```

输出示例：

```
0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169571c0156a9e38437e
```

### 查看所有地址

```bash
sui client addresses
```

### 生成新地址

```bash
sui keytool generate ed25519
```

### 切换活跃地址

```bash
sui client switch --address <地址或别名>
```

## 网络环境管理

### 查看当前环境

```bash
sui client envs
```

输出示例：

```
╭──────────┬─────────────────────────────────────────┬────────╮
│ alias    │ url                                     │ active │
├──────────┼─────────────────────────────────────────┼────────┤
│ devnet   │ https://fullnode.devnet.sui.io:443      │ *      │
│ testnet  │ https://fullnode.testnet.sui.io:443     │        │
╰──────────┴─────────────────────────────────────────┴────────╯
```

### 添加新环境

```bash
# 添加 devnet
sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io:443

# 添加 testnet
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

# 添加 mainnet
sui client new-env --alias mainnet --rpc https://fullnode.mainnet.sui.io:443

# 添加本地网络
sui client new-env --alias local --rpc http://127.0.0.1:9000
```

### 切换网络

```bash
sui client switch --env devnet
```

> **注意**：切换网络后，你的地址不变，但链上状态（余额、对象等）是网络独立的。也就是说，你在 devnet 上的余额和 testnet 上的余额是完全独立的。

## 获取测试币

### 通过 CLI 获取

在 devnet 或 testnet 上，你可以通过内置的水龙头命令获取免费测试币：

```bash
# 确保已切换到 devnet 或 testnet
sui client switch --env devnet

# 请求测试币
sui client faucet
```

成功后会看到类似输出：

```
Request successful. It can take up to 1 minute to get the coin.
```

> **提示**：水龙头有请求频率限制，如果收到速率限制错误，请等待一段时间后重试。

### 通过 Web 水龙头获取

你也可以通过浏览器访问水龙头页面：

- Devnet：[https://faucet.devnet.sui.io/](https://faucet.devnet.sui.io/)
- Testnet：[https://faucet.testnet.sui.io/](https://faucet.testnet.sui.io/)

输入你的地址即可获取测试币。

### 通过 cURL 获取

```bash
curl --location --request POST 'https://faucet.devnet.sui.io/v2/gas' \
--header 'Content-Type: application/json' \
--data-raw "{
    \"FixedAmountRequest\": {
        \"recipient\": \"$(sui client active-address)\"
    }
}"
```

## 查看余额和对象

### 查看余额

```bash
sui client balance
```

输出示例：

```
╭─────────────────────────────────────────╮
│ Balance of coins owned by this address  │
├─────────────────────────────────────────┤
│ ╭─────────────────┬────────────────╮    │
│ │ coin            │ balance (MIST) │    │
│ ├─────────────────┼────────────────┤    │
│ │ 0x2::sui::SUI   │ 1000000000     │    │
│ ╰─────────────────┴────────────────╯    │
╰─────────────────────────────────────────╯
```

> **换算关系**：1 SUI = 10^9 MIST。上面的 1000000000 MIST 就是 1 SUI。

### 查看拥有的对象

```bash
sui client objects
```

输出会列出你地址下所有的对象，包括 SUI 代币（Coin 对象）和其他资产。

### 查看特定对象详情

```bash
sui client object <object-id>

# 以 JSON 格式查看
sui client object <object-id> --json
```

## 安全提醒

- **永远不要**在公开场合分享你的私钥或助记词
- 密钥文件默认存储在 `~/.sui/sui_config/sui.keystore`
- 开发时使用 devnet/testnet，**不要**用主网私钥进行测试
- 建议为开发和生产使用不同的密钥对

## 小结

本节介绍了如何通过 Sui CLI 创建钱包、管理地址、切换网络环境以及获取测试币。核心命令包括：`sui client`（初始化）、`sui client active-address`（查看地址）、`sui client switch --env`（切换网络）、`sui client faucet`（获取测试币）和 `sui client balance`（查看余额）。这些是后续开发和部署合约的基础操作。下一节我们将了解 Move 2024 版本的新特性。


---


<!-- source: 02_getting_started/move-2024.md -->
## 2.4 Move 2024 Edition

# Move 2024 版本新特性

Move 2024 是 Move 语言的一次重要更新，引入了大量现代化的语法特性，使代码更简洁、更符合直觉。本书所有代码均基于 Move 2024 版本编写。本节将详细介绍这些新特性，并通过前后对比帮助你理解每项改进。

## 启用 Move 2024

在 `Move.toml` 中设置版本：

```toml
[package]
name = "my_package"
edition = "2024"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
my_package = "0x0"
```

> **重要**：`edition = "2024"` 必须在 `[package]` 下显式声明。如果省略，默认使用旧版本语法。

## 可变绑定：`let mut`

Move 2024 要求显式标注可变变量，使代码意图更清晰。

### 旧版本

```move
let x = 5;
x = 10;  // 隐式可变，容易产生误解
```

### 新版本

```move
let mut x = 5;
x = 10;  // 显式声明可变性

let y = 5;
// y = 10;  // 编译错误！未声明 mut
```

这一改变与 Rust 的 `let mut` 一致，让开发者在声明时就明确变量是否会被修改。函数参数同样适用：

```move
public fun process(mut value: u64): u64 {
    value = value + 1;
    value
}
```

## 结构体可见性：`public struct`

结构体声明现在需要显式指定可见性。

### 旧版本

```move
struct MyStruct has key {
    id: UID,
    value: u64,
}
```

### 新版本

```move
public struct MyStruct has key {
    id: UID,
    value: u64,
}
```

如果结构体只在模块内部使用，可以省略 `public`：

```move
struct InternalConfig {
    max_retries: u64,
    timeout_ms: u64,
}
```

## 包可见性：`public(package)` 替代 `friend`

`friend` 机制已被弃用，取而代之的是更简洁的 `public(package)` 可见性。

### 旧版本

```move
module my_package::module_a {
    friend my_package::module_b;

    public(friend) fun internal_helper(): u64 {
        42
    }
}
```

### 新版本

```move
module my_package::module_a;

public(package) fun internal_helper(): u64 {
    42
}
```

`public(package)` 允许同一包内的所有模块调用该函数，无需逐一声明 `friend` 关系，更加灵活且易于维护。

三种函数可见性总结：

| 可见性 | 访问范围 | 使用场景 |
|--------|----------|----------|
| `fun` | 仅当前模块 | 内部辅助函数 |
| `public(package)` | 同一包内的所有模块 | 包内共享逻辑 |
| `public` | 任何模块 | 对外公开的 API |

## 方法语法：接收者风格调用

Move 2024 支持使用 `.` 语法在结构体实例上调用方法，类似于面向对象语言。

### 旧版本

```move
let len = vector::length(&my_vec);
let val = vector::borrow(&my_vec, 0);
vector::push_back(&mut my_vec, 42);
```

### 新版本

```move
let len = my_vec.length();
let val = my_vec.borrow(0);
my_vec.push_back(42);
```

编译器会自动将 `e.f(args)` 转换为 `f(e, args)`，其中 `e` 作为第一个参数传入。这要求函数的第一个参数类型与调用者匹配。

自定义结构体同样支持方法语法：

```move
public struct Counter has key {
    id: UID,
    value: u64,
}

public fun increment(counter: &mut Counter) {
    counter.value = counter.value + 1;
}

// 调用时可以写成：
// counter.increment();
```

## 内置类型方法

Move 2024 为基本类型和内置类型添加了便捷方法。

### 字节串转 String

```move
// 旧版本
use std::string;
let s = string::utf8(b"Hello, Move!");

// 新版本
let s = b"Hello, Move!".to_string();
```

### 地址转字节

```move
// 旧版本
use sui::address;
let bytes = address::to_bytes(@0xa11ce);

// 新版本
let bytes = @0xa11ce.to_bytes();
```

### 常用方法一览

```move
// vector 方法
let mut v = vector[1, 2, 3];
v.push_back(4);
let len = v.length();
let first = v[0];         // 索引访问
let is_empty = v.is_empty();

// u64 方法
let s = 42u64.to_string();
```

## 索引语法

使用 `[]` 操作符直接访问集合元素，替代冗长的 `borrow` 调用。

### 旧版本

```move
let val = *vector::borrow(&my_vec, 0);
*vector::borrow_mut(&mut my_vec, 1) = 42;
```

### 新版本

```move
let val = my_vec[0];       // 不可变索引
my_vec[1] = 42;            // 可变索引
```

对于自定义类型，可以通过 `#[syntax(index)]` 属性实现索引访问：

```move
public struct Registry has key {
    id: UID,
    entries: Table<address, u64>,
}

#[syntax(index)]
public fun borrow_entry(registry: &Registry, addr: address): &u64 {
    table::borrow(&registry.entries, addr)
}

#[syntax(index)]
public fun borrow_entry_mut(registry: &mut Registry, addr: address): &mut u64 {
    table::borrow_mut(&mut registry.entries, addr)
}

// 使用：
// let value = registry[addr];
// registry[addr] = 100;
```

## 方法别名

`use fun` 和 `public use fun` 允许你为类型关联自定义方法名。

```move
module my_package::my_module;

use sui::coin::Coin;
use sui::sui::SUI;

public use fun coin_value as Coin<SUI>.value;

public fun coin_value(coin: &Coin<SUI>): u64 {
    coin.value()
}
```

通过 `use fun`，你可以为不属于你的类型添加方法调用语法，增强代码可读性。

## 枚举类型与模式匹配

Move 2024 引入了枚举类型（`enum`）和 `match` 表达式，这是一项重大功能增强。

### 定义枚举

```move
public enum Color has copy, drop {
    Red,
    Green,
    Blue,
    Custom { r: u8, g: u8, b: u8 },
}
```

### 模式匹配

```move
public fun color_to_rgb(color: &Color): (u8, u8, u8) {
    match (color) {
        Color::Red => (255, 0, 0),
        Color::Green => (0, 255, 0),
        Color::Blue => (0, 0, 255),
        Color::Custom { r, g, b } => (*r, *g, *b),
    }
}
```

### 实际应用示例

```move
public enum Action has copy, drop {
    Transfer { to: address, amount: u64 },
    Burn { amount: u64 },
    Freeze,
}

public fun describe_action(action: &Action): String {
    match (action) {
        Action::Transfer { to: _, amount } => {
            b"Transfer".to_string()
        },
        Action::Burn { amount: _ } => {
            b"Burn".to_string()
        },
        Action::Freeze => {
            b"Freeze".to_string()
        },
    }
}
```

> **注意**：`match` 必须是穷尽的 —— 你必须覆盖枚举的所有变体，或使用通配符 `_` 作为兜底。

## 模块声明简化

Move 2024 允许省略模块的花括号包裹，整个文件即为一个模块：

### 旧版本

```move
module my_package::my_module {
    use std::string::String;

    public fun hello(): String {
        b"Hello".to_string()
    }
}
```

### 新版本

```move
module my_package::my_module;

use std::string::String;

public fun hello(): String {
    b"Hello".to_string()
}
```

文件级模块声明以分号结尾，后续所有代码都属于该模块，更加简洁。

## 迁移工具

如果你有旧版本的 Move 代码需要迁移到 2024 版本，可以使用官方迁移工具：

```bash
sui move migrate
```

该工具会自动执行以下转换：

- 添加 `mut` 标注
- 添加 `public` 结构体可见性
- 将 `friend` + `public(friend)` 替换为 `public(package)`
- 更新 `Move.toml` 中的 `edition`

> **提示**：迁移工具会尽可能自动转换，但某些复杂情况可能需要手动调整。建议在迁移后运行 `sui move build` 和 `sui move test` 确认一切正常。

## 特性对照表

| 特性 | 旧版本 | Move 2024 |
|------|--------|-----------|
| 可变变量 | `let x = 5; x = 10;` | `let mut x = 5; x = 10;` |
| 结构体声明 | `struct S {}` | `public struct S {}` |
| 包内可见 | `friend` + `public(friend)` | `public(package)` |
| 方法调用 | `vector::length(&v)` | `v.length()` |
| 字节串转换 | `string::utf8(b"hi")` | `b"hi".to_string()` |
| 索引访问 | `*vector::borrow(&v, 0)` | `v[0]` |
| 模块声明 | `module pkg::mod { ... }` | `module pkg::mod;` |
| 枚举 | 不支持 | `enum Color { Red, Blue }` |
| 模式匹配 | 不支持 | `match (x) { ... }` |

## 小结

Move 2024 通过引入 `let mut`、`public struct`、`public(package)`、方法语法、索引语法、枚举和模式匹配等特性，大幅提升了语言的表达力和开发体验。这些改进使 Move 代码更简洁、更安全、更易读。本书后续所有代码都将使用 Move 2024 语法。如果你需要迁移旧代码，可以使用 `sui move migrate` 工具自动完成大部分转换。


---


<!-- source: 03_first_move/index.md -->
## 第三章 · 第一个 Move 程序

# 第三章 · 第一个 Move 程序

本章将带你动手编写、编译、测试和部署第一个 Move 智能合约，完成从代码到链上的全流程。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 3.1 | Hello World | 创建项目、编写模块、编译和本地测试 |
| 3.2 | Hello Sui | 将合约部署到 devnet、理解发布输出 |
| 3.3 | 与合约交互 | 用 CLI 调用合约函数、查看对象和交易 |

## 学习目标

读完本章后，你将能够：

- 独立创建一个 Move 项目并编写简单模块
- 将合约部署到 Sui devnet
- 通过 CLI 调用链上合约并查看结果


---


<!-- source: 03_first_move/hello-world.md -->
## 3.1 Hello World — 编写、编译与测试

# Hello, World!

每位开发者学习新语言的第一步，几乎都是编写一个 "Hello, World!" 程序。在 Move 中，我们将创建一个完整的 Move 包，编写模块和测试，并通过 Sui CLI 完成构建与测试。本节将带你体验从零开始创建 Move 项目的完整流程。

## 创建 Move 包

使用 `sui move new` 命令创建一个新的 Move 项目：

```bash
sui move new hello_world
```

该命令会生成以下目录结构：

```
hello_world/
├── Move.toml
├── sources/
│   └── hello_world.move
└── tests/
    └── hello_world_tests.move
```

各文件和目录的作用：

| 文件/目录 | 说明 |
|-----------|------|
| `Move.toml` | 包的清单文件，定义包名、依赖和地址等 |
| `sources/` | 存放 Move 源代码 |
| `tests/` | 存放测试代码 |

## 理解 Move.toml

打开生成的 `Move.toml` 文件：

```toml
[package]
name = "hello_world"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
hello_world = "0x0"
```

各字段含义：

### `[package]`

- **name**：包名称，在依赖引用时使用
- **edition**：Move 语言版本。建议设为 `"2024"` 以使用最新语法

### `[dependencies]`

声明项目依赖。默认依赖 Sui Framework，它提供了核心类型和函数（如 `UID`、`TxContext`、`transfer` 等）。

### `[addresses]`

定义地址别名。`hello_world = "0x0"` 表示本包在本地开发时使用 `0x0` 作为地址占位符，发布到链上后会被替换为实际的包地址。

## 编写模块

打开 `sources/hello_world.move`，将内容替换为：

```move
module hello_world::hello_world;

use std::string::String;

/// 返回 "Hello, World!" 字符串
public fun hello_world(): String {
    b"Hello, World!".to_string()
}
```

让我们逐行解析：

### 模块声明

```move
module hello_world::hello_world;
```

- `hello_world`（第一个）：对应 `Move.toml` 中 `[addresses]` 下定义的地址别名
- `hello_world`（第二个）：模块名称
- 以分号结尾：这是 Move 2024 的文件级模块声明语法

### 导入

```move
use std::string::String;
```

从标准库导入 `String` 类型。`std` 是 Sui 框架隐式包含的 Move 标准库。

### 函数定义

```move
public fun hello_world(): String {
    b"Hello, World!".to_string()
}
```

- `public`：该函数可以被其他模块调用
- `fun`：函数声明关键字
- `hello_world()`：函数名和参数（此处无参数）
- `: String`：返回类型
- `b"Hello, World!"`：字节串字面量
- `.to_string()`：Move 2024 的内置方法，将字节串转换为 `String`

> **注意**：Move 函数中最后一个表达式会自动作为返回值，无需 `return` 关键字。

## 编写测试

打开 `tests/hello_world_tests.move`，将内容替换为：

```move
#[test_only]
module hello_world::hello_world_tests;

use hello_world::hello_world;

#[test]
fun hello_world() {
    assert_eq!(hello_world::hello_world(), b"Hello, World!".to_string());
}
```

### 测试模块属性

```move
#[test_only]
module hello_world::hello_world_tests;
```

`#[test_only]` 标注表示这个模块仅在测试时编译，不会包含在发布的包中。

### 测试函数

```move
#[test]
fun hello_world() {
    assert_eq!(hello_world::hello_world(), b"Hello, World!".to_string());
}
```

- `#[test]`：标记该函数为测试函数
- `assert!`：断言宏，条件为 `false` 时测试失败
- 测试函数不需要 `public` 修饰符

## 构建项目

在项目根目录下运行：

```bash
cd hello_world
sui move build
```

成功构建的输出：

```
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING hello_world
```

如果代码有错误，编译器会给出详细的错误信息和位置提示：

```
error[E01002]: unexpected token
   ┌─ sources/hello_world.move:5:1
   │
 5 │ public fun hello_world() String {
   │                          ^^^^^^
   │                          Expected ':'
```

> **提示**：第一次构建会下载 Sui Framework 依赖，可能需要一些时间。后续构建会使用缓存，速度会快很多。

## 运行测试

```bash
sui move test
```

成功输出：

```
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING hello_world
Running Move unit tests
[ PASS    ] hello_world::hello_world_tests::test_hello_world
Test result: OK. Total tests: 1; passed: 1; failed: 0
```

### 运行特定测试

如果项目中有多个测试，可以通过名称过滤：

```bash
# 只运行名称包含 "hello" 的测试
sui move test hello
```

### 查看详细输出

```bash
# 显示测试过程中的调试信息
sui move test --verbose
```

### 测试覆盖率

```bash
sui move test --coverage

# 查看覆盖率报告
sui move coverage summary
```

## 项目结构最佳实践

随着项目增长，建议采用以下结构：

```
my_project/
├── Move.toml
├── sources/
│   ├── module_a.move
│   ├── module_b.move
│   └── utils.move
└── tests/
    ├── module_a_tests.move
    └── module_b_tests.move
```

约定：

- 每个 `.move` 文件包含一个模块
- 文件名与模块名一致
- 测试文件名以 `_tests` 后缀命名
- 将相关功能组织在同一个包中

## 小结

本节我们完成了第一个 Move 程序的完整开发流程：使用 `sui move new` 创建项目，理解 `Move.toml` 配置文件，编写模块和测试代码，最后通过 `sui move build` 构建和 `sui move test` 测试。虽然 "Hello, World!" 很简单，但它涵盖了 Move 开发的核心工作流。下一节我们将编写一个更有实际意义的合约，并将其部署到 Sui 网络上。


---


<!-- source: 03_first_move/hello-sui.md -->
## 3.2 Hello Sui — 部署到链上

# 部署合约到 Sui 网络

编写和测试 Move 代码只是第一步，真正激动人心的是将合约部署到 Sui 网络上并让它运行起来。本节将通过一个 TodoList 合约示例，完整演示从编写到发布的全过程，并深入解读发布交易的每一个细节。

## 准备工作

在部署之前，确保你已完成以下准备（详见[钱包与测试币](../02_getting_started/wallet-and-faucet.md)章节）：

```bash
# 1. 确认当前网络为 devnet 或 testnet
sui client envs

# 2. 切换到 devnet（如果需要）
sui client switch --env devnet

# 3. 确认有足够的测试币
sui client balance

# 4. 如果余额不足，获取测试币
sui client faucet
```

## 编写 TodoList 合约

创建一个新项目：

```bash
sui move new todo_list
cd todo_list
```

编辑 `sources/todo_list.move`：

```move
module todo_list::todo_list;

use std::string::String;

/// 一个简单的待办事项列表
public struct TodoList has key, store {
    id: UID,
    items: vector<String>,
}

/// 创建一个新的待办事项列表
public fun new(ctx: &mut TxContext): TodoList {
    TodoList {
        id: object::new(ctx),
        items: vector[],
    }
}

/// 添加一个待办事项
public fun add(list: &mut TodoList, item: String) {
    list.items.push_back(item);
}

/// 删除指定位置的待办事项，返回被删除的内容
public fun remove(list: &mut TodoList, index: u64): String {
    list.items.remove(index)
}

/// 获取待办事项数量
public fun length(list: &TodoList): u64 {
    list.items.length()
}
```

让我们解析这个合约的关键要素：

### 结构体定义

```move
public struct TodoList has key, store {
    id: UID,
    items: vector<String>,
}
```

- `has key`：表示该结构体是一个 Sui 对象，拥有全局唯一的 `id`
- `has store`：表示该对象可以被存储在其他对象中，也可以被转移
- `id: UID`：每个 Sui 对象必须有的唯一标识符字段
- `items: vector<String>`：使用向量存储待办事项列表

### 对象创建

```move
public fun new(ctx: &mut TxContext): TodoList {
    TodoList {
        id: object::new(ctx),
        items: vector[],
    }
}
```

- `ctx: &mut TxContext`：交易上下文，用于生成唯一 ID
- `object::new(ctx)`：创建新的 `UID`
- `vector[]`：Move 2024 的空向量字面量语法

### 构建项目

```bash
sui move build
```

确保编译通过没有错误。

## 发布合约

使用以下命令将合约发布到链上：

```bash
sui client publish
```

CLI 会自动估算 Gas，一般无需指定 `--gas-budget`；仅在需要覆盖默认值时再添加该参数。

## 解读发布交易输出

发布成功后，CLI 会输出大量信息。让我们逐部分解读。

### Transaction Digest

```
Transaction Digest: 5JxQpNBk4r5F2UaGRe4Vb9DF7hLZqijU3aTvN8H7kQ2W
```

交易摘要（Digest）是交易的唯一标识符，可以在区块浏览器中查看交易详情。

### Transaction Data

```
╭──────────────────────────────────────────────────────────╮
│ Transaction Data                                         │
├──────────────────────────────────────────────────────────┤
│ Sender: 0x7d20dcdb...                                    │
│ Gas Budget: 100000000 MIST                               │
│ Commands:                                                │
│   Publish:                                               │
│     - Package: todo_list                                 │
│   TransferObjects:                                       │
│     - UpgradeCap → Sender                                │
╰──────────────────────────────────────────────────────────╯
```

- **Sender**：发布者的地址
- **Commands**：交易包含两个命令
  - **Publish**：发布 `todo_list` 包
  - **TransferObjects**：将 `UpgradeCap`（升级能力）转移给发布者

### Transaction Effects

```
╭──────────────────────────────────────────────────────────╮
│ Transaction Effects                                      │
├──────────────────────────────────────────────────────────┤
│ Status: Success                                          │
│ Created Objects:                                         │
│   - Package:    0xabc123...                              │
│   - UpgradeCap: 0xdef456...                              │
│ Gas Cost Summary:                                        │
│   Storage Cost:  8976000 MIST                            │
│   Computation Cost: 1000000 MIST                         │
│   Total Gas Cost: 9976000 MIST                           │
│   Storage Rebate: 978120 MIST                            │
╰──────────────────────────────────────────────────────────╯
```

- **Status: Success**：交易执行成功
- **Created Objects**：创建了两个对象
  - **Package**：发布的包，包含你的 Move 模块
  - **UpgradeCap**：升级能力对象，后续升级包时需要用到
- **Gas Cost**：Gas 费用明细

### Object Changes

```
╭──────────────────────────────────────────────────────────╮
│ Object Changes                                           │
├──────────────────────────────────────────────────────────┤
│ Published Objects:                                       │
│   PackageID: 0xabc123def456...                           │
│   Modules: todo_list                                     │
╰──────────────────────────────────────────────────────────╯
```

**PackageID** 是你的合约在链上的唯一标识，后续调用合约函数时需要用到它。

> **重要**：请记录下你的 PackageID，后续章节将需要使用它。

## 使用 JSON 格式输出

添加 `--json` 标志可以获取 JSON 格式的输出，方便程序化解析：

```bash
sui client publish --json
```

JSON 输出更适合脚本自动化处理，你可以用 `jq` 提取关键信息：

```bash
# 发布并提取 PackageID
sui client publish --json | jq -r '.objectChanges[] | select(.type == "published") | .packageId'
```

## 理解 UpgradeCap

`UpgradeCap`（升级能力）是 Sui 包管理的核心机制：

- 每次发布包时自动生成并转移给发布者
- 持有 `UpgradeCap` 的人可以升级对应的包
- 如果你销毁或转移 `UpgradeCap`，就放弃了升级权限
- 这是 Sui 上实现**不可变性保证**的一种方式

```bash
# 查看 UpgradeCap 对象
sui client object <upgrade-cap-id>
```

> **安全提示**：如果你想让包变成不可变的（无法升级），可以在发布后销毁 `UpgradeCap`。但请谨慎操作，一旦销毁便无法撤回。

## 在区块浏览器上查看

你可以在 Sui 区块浏览器上查看已发布的包：

- **Devnet**：`https://suiscan.xyz/devnet/object/<PackageID>`
- **Testnet**：`https://suiscan.xyz/testnet/object/<PackageID>`

在浏览器中你可以看到：

- 包的所有模块
- 每个模块的公开函数
- 结构体定义
- 历史交易

## 完整发布流程总结

```bash
# 1. 创建项目
sui move new todo_list && cd todo_list

# 2. 编写合约代码（编辑 sources/todo_list.move）

# 3. 构建
sui move build

# 4. 测试
sui move test

# 5. 确保有测试币
sui client faucet

# 6. 发布
sui client publish

# 7. 记录 PackageID
export PACKAGE_ID=0x<your-package-id>
```

## 小结

本节我们完成了一个 TodoList 合约的编写和链上发布。关键步骤包括：使用 `sui client publish` 发布包、理解交易输出中的 Digest、Effects、Created Objects 等信息。发布后我们获得了两个重要的对象——**Package**（包含合约代码）和 **UpgradeCap**（升级能力）。记录好 PackageID，下一节我们将学习如何通过 CLI 与已发布的合约进行交互。


---


<!-- source: 03_first_move/interact-with-contract.md -->
## 3.3 与合约交互

# 与合约交互

合约发布到链上后，我们需要通过交易来调用它的函数。Sui CLI 提供了强大的可编程交易块（Programmable Transaction Blocks，PTB）功能，可以在一笔交易中组合多个操作。本节将通过与上一节发布的 TodoList 合约交互，深入学习 PTB 的使用方法。

## 准备环境变量

首先，设置我们需要用到的环境变量：

```bash
# 替换为你上一节发布时获得的 PackageID
export PACKAGE_ID=0x<your-package-id>

# 获取当前活跃地址
export MY_ADDRESS=$(sui client active-address)

# 验证设置
echo "Package ID: $PACKAGE_ID"
echo "My Address: $MY_ADDRESS"
```

## 理解可编程交易块（PTB）

PTB 是 Sui 交易系统的核心概念。与传统区块链每次交易只能调用一个函数不同，Sui 的 PTB 允许你在**一笔交易中执行多个命令**，每个命令可以使用前面命令的结果。

PTB 的关键特性：

- **原子性**：所有命令要么全部成功，要么全部回滚
- **可组合性**：后续命令可以使用前面命令的返回值
- **高效性**：多个操作合并为一笔交易，减少 Gas 消耗
- **灵活性**：支持调用函数、转移对象、分割/合并 Coin 等

## 创建 TodoList 对象

让我们创建一个新的 TodoList 对象：

```bash
sui client ptb \
    --assign sender @$MY_ADDRESS \
    --move-call $PACKAGE_ID::todo_list::new \
    --assign list \
    --transfer-objects "[list]" sender
```

让我们逐行解析这个命令：

| 参数 | 说明 |
|------|------|
| `--assign sender @$MY_ADDRESS` | 将地址赋值给变量 `sender` |
| `--move-call $PACKAGE_ID::todo_list::new` | 调用 `new` 函数创建 TodoList |
| `--assign list` | 将上一个命令的返回值赋给变量 `list` |
| `--transfer-objects "[list]" sender` | 将 `list` 对象转移给 `sender` |

> **注意**：`new` 函数虽然需要 `&mut TxContext` 参数，但 CLI 会自动传入，无需手动指定。

交易成功后，输出中会包含创建的对象 ID。记录下这个 ID：

```bash
# 从输出中找到 Created Objects 的 ID
export LIST_ID=0x<created-object-id>
```

## 查看对象

### 基本查看

```bash
sui client object $LIST_ID
```

输出示例：

```
╭───────────────┬──────────────────────────────────────────────╮
│ objectId      │ 0x1234...                                    │
│ version       │ 1                                            │
│ digest        │ abc123...                                    │
│ objType       │ 0x<pkg>::todo_list::TodoList                 │
│ owner         │ AddressOwner(0x7d20...)                      │
│ content       │ { id: 0x1234..., items: [] }                 │
╰───────────────┴──────────────────────────────────────────────╯
```

可以看到 `items` 字段为空数组，这是我们刚创建的空 TodoList。

### JSON 格式查看

```bash
sui client object $LIST_ID --json
```

JSON 格式更适合程序解析，包含更详细的类型信息和字段值。

## 添加待办事项

使用 `add` 函数向列表中添加项目：

```bash
sui client ptb \
    --move-call $PACKAGE_ID::todo_list::add \
        @$LIST_ID \
        "'学习 Move 语言'"
```

这里直接传入了两个参数：

- `@$LIST_ID`：TodoList 对象的引用（`@` 前缀表示对象 ID）
- `"'学习 Move 语言'"`：要添加的字符串内容

> **提示**：字符串参数需要用单引号包裹，外层再用双引号，即 `"'内容'"`。

再添加几个事项：

```bash
sui client ptb \
    --move-call $PACKAGE_ID::todo_list::add \
        @$LIST_ID \
        "'编写智能合约'"

sui client ptb \
    --move-call $PACKAGE_ID::todo_list::add \
        @$LIST_ID \
        "'部署到主网'"
```

## 在一笔交易中执行多个操作

PTB 的强大之处在于可以在一笔交易中组合多个命令。让我们在一次交易中添加多个待办事项：

```bash
sui client ptb \
    --move-call $PACKAGE_ID::todo_list::add \
        @$LIST_ID \
        "'阅读 Sui 文档'" \
    --move-call $PACKAGE_ID::todo_list::add \
        @$LIST_ID \
        "'参与社区讨论'"
```

这样做不仅更高效（只需一笔 Gas 费），而且保证了原子性：要么两个事项都添加成功，要么都不添加。

## 创建对象并立即使用

下面展示一个更复杂的 PTB 示例——创建 TodoList 并立即添加事项：

```bash
sui client ptb \
    --assign sender @$MY_ADDRESS \
    --move-call $PACKAGE_ID::todo_list::new \
    --assign new_list \
    --move-call $PACKAGE_ID::todo_list::add new_list "'第一个任务'" \
    --move-call $PACKAGE_ID::todo_list::add new_list "'第二个任务'" \
    --transfer-objects "[new_list]" sender
```

这个交易包含了四个命令：

1. 调用 `new` 创建 TodoList
2. 调用 `add` 添加第一个事项（使用步骤 1 的返回值）
3. 调用 `add` 添加第二个事项
4. 将 TodoList 转移给自己

## 删除待办事项

```bash
# 删除索引为 0 的事项（第一个）
sui client ptb \
    --move-call $PACKAGE_ID::todo_list::remove \
        @$LIST_ID \
        0
```

## 查询拥有的对象

查看当前地址下的所有对象：

```bash
sui client objects
```

输出会列出你拥有的所有对象，包括 SUI Coin、TodoList、UpgradeCap 等：

```
╭───────────────────────────────────────────────────────────────╮
│ ╭────────────┬──────────────────────────────────────────────╮ │
│ │ objectId   │ 0x1234...                                   │ │
│ │ version    │ 5                                           │ │
│ │ digest     │ abc...                                      │ │
│ │ objectType │ 0x<pkg>::todo_list::TodoList                │ │
│ ╰────────────┴──────────────────────────────────────────────╯ │
│ ╭────────────┬──────────────────────────────────────────────╮ │
│ │ objectId   │ 0x5678...                                   │ │
│ │ version    │ 1                                           │ │
│ │ digest     │ def...                                      │ │
│ │ objectType │ 0x2::coin::Coin<0x2::sui::SUI>             │ │
│ ╰────────────┴──────────────────────────────────────────────╯ │
╰───────────────────────────────────────────────────────────────╯
```

## 查看交易历史

你可以通过区块浏览器查看某个地址或对象的所有交易历史：

```bash
# 查看特定交易详情
sui client transaction-block <transaction-digest> --json
```

## PTB 命令速查

以下是 `sui client ptb` 支持的常用操作：

| 操作 | 语法 | 说明 |
|------|------|------|
| 调用 Move 函数 | `--move-call pkg::mod::fun args...` | 调用链上函数 |
| 赋值变量 | `--assign name value` | 将值赋给变量 |
| 转移对象 | `--transfer-objects "[obj]" recipient` | 转移对象给接收者 |
| 分割 Coin | `--split-coins coin "[amount]"` | 从 Coin 中分出指定金额 |
| 合并 Coin | `--merge-coins target "[source]"` | 将多个 Coin 合并为一个 |
| 设置 Gas 预算（可选） | `--gas-budget amount` | 覆盖自动估算的最大 Gas；通常可省略 |

## 交互流程总结

```bash
# 完整的交互流程

# 1. 设置环境变量
export PACKAGE_ID=0x...
export MY_ADDRESS=$(sui client active-address)

# 2. 创建对象
sui client ptb \
    --assign sender @$MY_ADDRESS \
    --move-call $PACKAGE_ID::todo_list::new \
    --assign list \
    --transfer-objects "[list]" sender

# 3. 记录对象 ID
export LIST_ID=0x...

# 4. 调用函数修改对象
sui client ptb \
    --move-call $PACKAGE_ID::todo_list::add @$LIST_ID "'新任务'"

# 5. 查看对象状态
sui client object $LIST_ID

# 6. 查看所有对象
sui client objects
```

## 小结

本节我们学习了如何通过 Sui CLI 的 PTB 命令与链上合约交互。核心要点包括：使用 `sui client ptb --move-call` 调用合约函数、使用 `--assign` 捕获返回值、使用 `--transfer-objects` 转移对象。PTB 最强大的特性是**可组合性**——你可以在一笔交易中串联多个命令，后续命令可以使用前面命令的结果，而整个过程是原子的。这种设计让 Sui 上的交易既灵活又高效。至此，你已经掌握了 Move 开发的完整流程：编写 → 测试 → 发布 → 交互。接下来我们将深入学习 Move 语言的核心概念。


---


# ==================== 语言篇 ====================



---


<!-- source: 04_concepts/index.md -->
## 第四章 · 核心概念

# 第四章 · 核心概念

本章介绍 Sui Move 开发中的基础概念，理解这些概念是编写合约的前提。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 4.1 | 包（Package） | 包的概念、结构、依赖管理 |
| 4.2 | 清单文件（Move.toml） | 配置字段、依赖声明、地址别名 |
| 4.3 | 地址（Address） | 地址格式、命名地址、地址与包的关系 |
| 4.4 | 账户（Account） | 账户模型、密钥对、签名机制 |
| 4.5 | 交易（Transaction） | 交易结构、生命周期、Gas 机制 |

## 学习目标

读完本章后，你将能够：

- 理解 Move 包的组织方式和依赖管理
- 正确配置 Move.toml 文件
- 解释 Sui 上地址、账户和交易的关系


---


<!-- source: 04_concepts/packages.md -->
## 4.1 包（Package）

# 包（Package）

在 Move 语言中，包（Package）是代码组织的基本单位。每个包在发布到 Sui 区块链后，都会被分配一个唯一的链上地址作为标识。理解包的结构和工作机制，是编写和部署 Move 智能合约的第一步。

## 包的目录结构

使用 Sui CLI 创建一个新包：

```bash
sui move new my_package
```

生成的标准目录结构如下：

```
my_package/
├── Move.toml
├── sources/
│   └── my_module.move
└── tests/
    └── my_module_tests.move
```

各目录和文件的作用：

| 路径 | 说明 |
|------|------|
| `Move.toml` | 包的清单文件，声明包名、依赖、地址别名等 |
| `sources/` | 存放所有 Move 源代码（`.move` 文件） |
| `tests/` | 存放测试代码 |
| `examples/` | 可选目录，存放示例代码（不会被编译到主包中） |

## 包与模块的关系

一个包可以包含多个模块（Module），每个模块又包含函数、类型（结构体）和常量。它们的层次关系可以这样理解：

```
package 0x...
    module a
        struct A1
        fun hello_world()
    module b
        struct B1
        fun hello_package()
```

在代码层面，每个 `.move` 文件通常定义一个模块：

```move
// sources/cafe.move
module my_package::cafe;

public struct Coffee has drop {
    strength: u8,
}

public fun brew(strength: u8): Coffee {
    Coffee { strength }
}
```

```move
// sources/bakery.move
module my_package::bakery;

public struct Bread has drop {
    flavor: vector<u8>,
}

public fun bake(flavor: vector<u8>): Bread {
    Bread { flavor }
}
```

上面的两个模块 `cafe` 和 `bakery` 同属于 `my_package` 这一个包。发布后，它们共享同一个链上地址。

## 包的发布与不可变性

使用以下命令将包发布到 Sui 网络：

```bash
sui client publish
```

发布后，包具有以下特性：

- **唯一地址**：每个已发布的包都有一个唯一的链上地址（如 `0xabc123...`），后续所有对该包中模块和函数的调用都通过此地址进行。
- **不可变性**：已发布的包是不可变对象（Immutable Object），任何人（包括发布者）都无法修改或删除它。这保证了链上合约代码的透明性和可审计性。

### 在代码中引用已发布的包

其他包可以通过地址引用已发布的模块：

```move
module other_package::user;

use 0xabc123::cafe;

public fun drink() {
    let _coffee = cafe::brew(10);
}
```

## 包的升级与 UpgradeCap

虽然已发布的包不可变，但 Sui 提供了**包升级**机制，允许开发者发布一个新版本的包来替代旧版。

### UpgradeCap

当一个包首次发布时，发布者会收到一个 `UpgradeCap` 对象。持有此对象即拥有升级该包的权限：

```bash
sui client upgrade
```

升级时需注意以下兼容性规则：

| 升级策略 | 允许的变更 |
|----------|-----------|
| `compatible` | 可以添加新函数和新模块，不能删除或修改已有的公共函数签名 |
| `additive` | 只能添加新模块，不能修改现有模块 |
| `dep_only` | 只能更改依赖项 |

### 放弃升级权限

如果希望让包彻底不可变（无法再升级），可以销毁 `UpgradeCap`：

```move
module my_package::config;

use sui::package;

public fun make_immutable(cap: package::UpgradeCap) {
    package::make_immutable(cap);
}
```

调用此函数后，包将永远无法再被升级。

## 包的命名规范

- 包名使用 `snake_case`，如 `my_defi_app`
- 模块名同样使用 `snake_case`，如 `liquidity_pool`
- 包名在 `Move.toml` 的 `[package]` 段中声明，同时作为 `[addresses]` 中的命名地址使用

```toml
[package]
name = "my_defi_app"

[addresses]
my_defi_app = "0x0"
```

## 小结

包是 Move 项目的顶层组织单位。一个包由 `Move.toml` 清单文件和 `sources/` 目录中的模块组成。发布到链上后，包获得唯一地址并变为不可变。通过 `UpgradeCap` 机制，开发者可以在保持兼容性的前提下发布新版本。理解包的结构和生命周期，是构建 Sui 应用的基础。


---


<!-- source: 04_concepts/manifest.md -->
## 4.2 清单文件（Move.toml）

# Move.toml 清单文件详解

`Move.toml` 是每个 Move 包的清单文件（Manifest），位于包的根目录下。它定义了包的基本信息、依赖关系和地址别名等配置。可以说，`Move.toml` 之于 Move 包，就像 `package.json` 之于 Node.js 项目、`Cargo.toml` 之于 Rust 项目。

## 完整示例

先看一个典型的 `Move.toml` 文件全貌，后续逐段讲解：

```toml
[package]
name = "my_project"
version = "0.0.0"
edition = "2024"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
my_project = "0x0"

[dev-addresses]
my_project = "0x0"

[dev-dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }
```

## [package] — 包的基本信息

```toml
[package]
name = "my_project"
version = "0.0.0"
edition = "2024"
```

| 字段 | 说明 |
|------|------|
| `name` | 包名，使用 `snake_case` 命名。同时也是默认的命名地址 |
| `version` | 版本号，遵循语义化版本（SemVer）格式 |
| `edition` | Move 语言版本。推荐使用 `"2024"` 以获得最新的语言特性（如枚举、方法语法等） |

`edition` 字段决定了编译器可用的语言特性。`2024` 版本相较于旧版引入了枚举类型（enum）、方法语法（method syntax）、位置域（positional fields）等重要特性。

## [dependencies] — 依赖管理

Move 包通过 `[dependencies]` 段声明对其他包的依赖。

### Git 依赖

最常见的依赖方式，从 Git 仓库拉取：

```toml
[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }
```

| 参数 | 说明 |
|------|------|
| `git` | Git 仓库的 URL |
| `subdir` | 仓库中包所在的子目录 |
| `rev` | Git 引用，可以是分支名、标签名或 commit hash |

也可以使用多行格式使其更易读：

```toml
[dependencies.Sui]
git = "https://github.com/MystenLabs/sui.git"
subdir = "crates/sui-framework/packages/sui-framework"
rev = "framework/mainnet"
```

### 本地依赖

在开发或调试时，可以引用本地路径的包：

```toml
[dependencies]
MyLibrary = { local = "../my_library" }
```

### 自动依赖（Sui CLI v1.45+）

从 Sui CLI v1.45 版本开始，系统包（如 `Sui`、`MoveStdlib`）会自动根据当前网络环境解析，无需手动指定。你可以简化为：

```toml
[dependencies]
```

留空即可，编译器会自动添加必要的系统框架依赖。

### 解决版本冲突

当多个依赖引用了同一个包的不同版本时，可以使用 `override = true` 来强制指定版本：

```toml
[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet", override = true }
```

`override = true` 会让当前包中声明的这个版本覆盖所有传递依赖中的同名包版本。

## [addresses] — 命名地址

```toml
[addresses]
my_project = "0x0"
std = "0x1"
sui = "0x2"
```

命名地址为链上地址提供了人类可读的别名。在代码中可以直接使用这些名称：

```move
module my_project::hello;

// my_project 在本地编译时指向 "0x0"
// 发布后会被替换为实际的链上地址
```

其中 `"0x0"` 是一个特殊的占位地址，表示"尚未发布"。在执行 `sui client publish` 时，编译器会自动将其替换为实际分配的链上地址。

常见的保留地址：

| 名称 | 地址 | 说明 |
|------|------|------|
| `std` | `0x1` | Move 标准库 |
| `sui` | `0x2` | Sui 框架 |

## [dev-addresses] — 开发/测试环境地址

```toml
[dev-addresses]
my_project = "0x0"
```

`[dev-addresses]` 中的配置仅在 `test` 和 `dev` 模式下生效，会覆盖 `[addresses]` 中的同名地址。这对于测试场景中需要使用不同地址的情况非常有用。

## [dev-dependencies] — 开发/测试依赖

```toml
[dev-dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }
```

与 `[dev-addresses]` 类似，`[dev-dependencies]` 中声明的依赖仅在 `test` 和 `dev` 模式下使用，会覆盖 `[dependencies]` 中的同名依赖。典型用途是在测试时使用 testnet 版本的框架。

## 实战：一个 DeFi 项目的 Move.toml

```toml
[package]
name = "defi_swap"
version = "1.0.0"
edition = "2024"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }
MoveStdlib = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/move-stdlib", rev = "framework/mainnet" }

[addresses]
defi_swap = "0x0"

[dev-dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet", override = true }

[dev-addresses]
defi_swap = "0x0"
```

## 小结

`Move.toml` 是 Move 包的核心配置文件，由五个主要段落组成：`[package]` 声明包的基本信息，`[dependencies]` 管理外部依赖，`[addresses]` 定义命名地址别名，`[dev-dependencies]` 和 `[dev-addresses]` 则为测试环境提供覆盖配置。熟练掌握 `Move.toml` 的各项配置，有助于高效管理项目结构和依赖关系。


---


<!-- source: 04_concepts/address.md -->
## 4.3 地址（Address）

# 地址（Address）

地址（Address）是 Sui 区块链上的唯一标识符，长度为 32 字节（256 位），以十六进制字符串表示。在 Sui 中，地址被广泛用于标识包、账户和对象，是连接链上各种实体的核心概念。

## 地址的格式

地址由 64 个十六进制字符组成，前缀为 `0x`：

```
0x06b36e07f3d5a3d76e66fc1b14735e7f4b0045c3ebca6f3b1c3bfb9d3bcda2a7
```

### 格式规则

| 规则 | 说明 |
|------|------|
| 长度 | 32 字节，64 个十六进制字符 |
| 前缀 | 以 `0x` 开头 |
| 大小写 | 不区分大小写，`0xABC` 和 `0xabc` 等价 |
| 短地址 | 不足 64 位的自动在左侧补零 |

### 短地址补零

为了书写方便，地址可以使用简写形式。不足 64 个字符的地址会自动在左侧补零：

```
0x1
= 0x0000000000000000000000000000000000000000000000000000000000000001

0x2
= 0x0000000000000000000000000000000000000000000000000000000000000002

0xdead
= 0x000000000000000000000000000000000000000000000000000000000000dead
```

在代码中使用短地址和完整地址效果相同：

```move
module example::demo;

use std::debug;

#[test]
fun address() {
    let addr1 = @0x1;
    let addr2 = @0x0000000000000000000000000000000000000000000000000000000000000001;
    assert_eq!(addr1, addr2);
}
```

## 保留地址

Sui 网络中有一些特殊的保留地址，用于系统级别的包和对象：

| 地址 | 名称 | 用途 |
|------|------|------|
| `0x1` | Move 标准库（`std`） | 提供基础类型和工具，如 `string`、`vector`、`option` 等 |
| `0x2` | Sui 框架（`sui`） | 提供 Sui 特有的功能，如 `object`、`transfer`、`coin`、`tx_context` 等 |
| `0x5` | Sui System | Sui 系统状态对象 |
| `0x6` | 系统时钟（`Clock`） | 全局共享的时钟对象，用于获取链上时间戳 |
| `0x8` | 随机数（`Random`） | 链上随机数生成器对象 |
| `0x403` | `DenyList` | 受管代币的拒绝列表 |

在代码中引用这些地址：

```move
module my_project::example;

use std::string;          // 来自 0x1
use sui::clock::Clock;    // 来自 0x2
use sui::coin::Coin;      // 来自 0x2
```

## 地址的用途

在 Sui 中，地址有三个主要用途：

### 1. 标识账户

每个用户账户由一个地址标识。这个地址从用户的公钥派生而来：

```
私钥 → 公钥 → 地址
```

用户通过其地址接收对象、发送交易。

### 2. 标识包

每个已发布的 Move 包都有一个唯一的地址。调用包中的函数时需要指定包的地址：

```move
module 0xabc123::marketplace;

// 该模块属于地址为 0xabc123 的包
```

### 3. 标识对象

Sui 上的每个对象也有一个唯一的地址（即对象 ID）。对象 ID 在创建时由系统分配。

## Move 中的 address 类型

在 Move 语言中，`address` 是一个内置的原始类型：

```move
module my_project::address_demo;

public fun show_address(): address {
    @0x1
}

public fun compare_addresses(a: address, b: address): bool {
    a == b
}

#[test]
fun address_type() {
    let system_addr = @0x1;
    let framework_addr = @0x2;
    assert!(system_addr != framework_addr);
}
```

### 地址与字符串转换

利用标准库可以在地址与字符串之间进行转换：

```move
module my_project::addr_utils;

use std::string::String;
use sui::address;

public fun addr_to_string(addr: address): String {
    address::to_string(addr)
}

public fun addr_length(): u64 {
    address::length()  // 返回 32
}
```

## 地址字面量的使用

在 Move 代码中，地址字面量以 `@` 符号开头：

```move
module my_project::literals;

const ADMIN: address = @0xA11CE;
const STD: address = @std;   // 使用命名地址，等价于 @0x1

fun check_admin(sender: address): bool {
    sender == ADMIN
}
```

命名地址（如 `@std`、`@sui`）在 `Move.toml` 的 `[addresses]` 段中定义，编译时会被替换为实际值。

## 小结

地址是 Sui 区块链上标识各种实体的核心概念。它是一个 32 字节的十六进制值，用于标识账户、包和对象。Move 语言中提供了 `address` 原始类型来操作地址，并通过 `@` 前缀表示地址字面量。Sui 网络中保留了若干特殊地址（如 `0x1`、`0x2`、`0x6`）用于系统组件。理解地址的格式和用途，是与 Sui 链上实体交互的基础。


---


<!-- source: 04_concepts/account.md -->
## 4.4 账户（Account）

# 账户模型

在 Sui 中，账户（Account）代表区块链上的一个用户身份。账户由私钥生成，通过对应的地址来标识。每个账户可以拥有对象、发送交易，是用户与 Sui 网络交互的入口。

## 账户的生成

账户的生成遵循一条从私钥到地址的推导链：

```
私钥（Private Key）
    ↓ 数学推导
公钥（Public Key）
    ↓ 哈希运算
地址（Address）
```

### 密钥对

密钥对（Key Pair）由公钥和私钥组成：

- **私钥**：必须严格保密，用于对交易进行数字签名。持有私钥即拥有账户的完全控制权。
- **公钥**：可以公开分享，用于验证签名的合法性。
- **地址**：从公钥通过哈希运算派生，是账户在链上的唯一标识。

使用 Sui CLI 生成新的密钥对：

```bash
sui client new-address ed25519
```

输出示例：

```
╭─────────────────────────────────────────────────────────╮
│ Created new keypair and saved it to keystore.           │
├────────────────┬────────────────────────────────────────┤
│ alias          │ tender-garnet                          │
│ address        │ 0xa11c...                             │
│ keyScheme      │ ed25519                                │
╰────────────────┴────────────────────────────────────────╯
```

## 支持的密码学方案

Sui 支持多种密码学签名方案，这种特性被称为**密码学敏捷性**（Cryptographic Agility）：

| 方案 | 说明 | 典型用途 |
|------|------|----------|
| **Ed25519** | 高性能的椭圆曲线签名算法 | 默认方案，大多数场景的首选 |
| **Secp256k1** | 与比特币、以太坊相同的曲线 | 兼容现有加密货币生态 |
| **Secp256r1** | NIST 标准曲线，又称 P-256 | 硬件安全模块（HSM）和 Passkey 支持 |
| **zkLogin** | 基于零知识证明的社交登录 | 用 Google、Facebook 等账号生成链上身份 |

### 密码学敏捷性

Sui 的密码学敏捷性意味着不同的签名方案可以共存于同一网络中。用户可以根据需求选择最合适的方案：

```bash
# 使用 Ed25519（默认）
sui client new-address ed25519

# 使用 Secp256k1（兼容比特币/以太坊）
sui client new-address secp256k1

# 使用 Secp256r1（兼容 Passkey/硬件安全模块）
sui client new-address secp256r1
```

所有方案生成的地址格式完全相同，都是 32 字节的地址，在链上可以无差别地使用。

## zkLogin — 社交登录上链

zkLogin 是 Sui 独有的创新特性，允许用户通过社交账号（如 Google、Facebook、Apple、Twitch 等）直接生成区块链账户，无需管理私钥或助记词。

### 工作原理

```
用户使用 Google 登录
    ↓
获取 OAuth JWT Token
    ↓
生成零知识证明（ZKP）
    ↓
将证明映射为 Sui 地址
    ↓
用户获得链上账户
```

zkLogin 的核心价值在于：

- **降低门槛**：用户无需理解密钥管理、助记词等区块链概念
- **隐私保护**：零知识证明确保社交账号信息不会泄露到链上
- **安全性**：即使 OAuth 提供商被攻破，攻击者也无法获取用户的私钥

## 账户与对象的关系

账户是对象的"所有者"。在 Sui 的面向对象模型中，账户可以：

- **拥有对象**：对象可以归属于某个地址（账户）
- **发送交易**：修改自己拥有的对象、调用智能合约函数
- **接收转移**：接受其他账户转移过来的对象

```move
module my_project::wallet;

use sui::coin::{Self, Coin};
use sui::sui::SUI;

public fun send_coin(
    coin: Coin<SUI>,
    recipient: address,
) {
    transfer::public_transfer(coin, recipient);
}
```

在上面的例子中，`recipient` 就是接收方的账户地址。

## 交易与签名

每一笔提交到 Sui 网络的交易都必须由发送者的私钥签名。签名过程确保：

1. **身份认证**：证明交易确实由该地址的所有者发起
2. **完整性**：交易内容在传输过程中未被篡改
3. **不可否认**：发送者无法否认曾发送过该交易

```
交易构建（Transaction）
    ↓
私钥签名（Sign）
    ↓
提交到网络（Submit）
    ↓
验证者验证签名（Verify）
    ↓
执行交易（Execute）
```

### 使用 CLI 发送交易

```bash
# 查看当前活跃地址
sui client active-address

# 转账 SUI
sui client transfer-sui --to 0xRECIPIENT --sui-coin-object-id 0xCOIN_ID --amount 1000
```

CLI 在执行交易时会自动使用当前活跃地址对应的私钥进行签名。

## 多地址管理

一个用户可以同时管理多个地址（账户），Sui CLI 提供了相应的管理工具：

```bash
# 查看所有地址
sui client addresses

# 切换活跃地址
sui client switch --address 0xYOUR_ADDRESS
```

## 小结

Sui 的账户模型基于公钥密码学，通过"私钥 → 公钥 → 地址"的推导链生成用户身份。Sui 支持 Ed25519、Secp256k1、Secp256r1 三种密码学方案，并通过 zkLogin 实现社交账号登录上链，大幅降低了用户使用门槛。账户通过地址标识，可以拥有对象、发送交易，是用户与 Sui 链上世界交互的桥梁。


---


<!-- source: 04_concepts/transaction.md -->
## 4.5 交易（Transaction）

# 交易（Transaction）

交易（Transaction）是改变 Sui 区块链状态的唯一方式。无论是转移对象、调用智能合约函数，还是发布新的 Move 包，都必须通过交易来完成。理解交易的结构和生命周期，是掌握 Sui 开发的关键。

## 交易的结构

一笔 Sui 交易由以下几个核心部分组成：

```
Transaction {
    sender:    发送者地址（签名者）
    commands:  操作命令列表
    inputs:    输入参数（纯值参数 + 对象参数）
    gas:       Gas 支付信息（Gas 对象、价格、预算）
}
```

### 发送者（Sender）

每笔交易都有一个发送者，即签署并提交交易的账户地址。发送者必须用对应的私钥对交易进行签名。

### 命令（Commands）

交易可以包含一个或多个命令，按顺序执行。Sui 支持的命令类型：

| 命令 | 说明 |
|------|------|
| `MoveCall` | 调用已发布包中的 Move 函数 |
| `TransferObjects` | 将一个或多个对象转移给指定地址 |
| `SplitCoins` | 从一个 Coin 中拆分出指定金额 |
| `MergeCoins` | 将多个同类型 Coin 合并为一个 |
| `Publish` | 发布一个新的 Move 包 |
| `Upgrade` | 升级一个已发布的 Move 包 |
| `MakeMoveVec` | 创建一个 Move 向量 |

### 输入（Inputs）

交易的输入分为两类：

#### 纯值参数（Pure Arguments）

可以直接传入交易的基础值类型：

| 类型 | 示例 |
|------|------|
| `bool` | `true`, `false` |
| 整数类型 | `u8`, `u16`, `u32`, `u64`, `u128`, `u256` |
| `address` | `0xa11ce...` |
| `String` | `"hello"` |
| `vector<T>` | `vector[1, 2, 3]` |
| `Option<T>` | `some(42)`, `none` |
| `ID` | 对象标识符 |

#### 对象参数（Object Arguments）

链上对象需要根据其所有权类型以不同方式传入：

| 对象类型 | 传入方式 | 说明 |
|----------|----------|------|
| 拥有的对象（Owned） | 按引用或按值 | 只有所有者可以使用 |
| 共享对象（Shared） | 按可变引用 | 任何人都可以使用 |
| 冻结对象（Frozen/Immutable） | 按不可变引用 | 任何人都可以读取 |

## 交易命令详解

### MoveCall — 调用 Move 函数

最常用的命令，用于调用链上已发布包中的函数：

```move
module marketplace::shop;

use sui::coin::Coin;
use sui::sui::SUI;

public struct Item has key, store {
    id: UID,
    name: vector<u8>,
}

public fun purchase(
    payment: Coin<SUI>,
    ctx: &mut TxContext,
): Item {
    // 验证支付金额、处理业务逻辑...
    let item = Item {
        id: object::new(ctx),
        name: b"Rare Sword",
    };
    transfer::public_transfer(payment, @0xSHOP_OWNER);
    item
}
```

### SplitCoins — 拆分代币

从一个 Coin 对象中拆分出指定金额。`Gas` 是一个特殊的关键字，表示交易的 Gas 支付 Coin：

```
SplitCoins(Gas, [1000])
// 从 Gas Coin 中拆分出 1000 MIST
```

### MergeCoins — 合并代币

将多个同类型 Coin 合并为一个：

```
MergeCoins(dest_coin, [coin_a, coin_b])
// 将 coin_a 和 coin_b 合并到 dest_coin 中
```

### TransferObjects — 转移对象

将对象转移给指定地址：

```
TransferObjects([object_a, object_b], recipient)
// 将 object_a 和 object_b 转移给 recipient
```

## 交易示例

以下是一个在市场中购买物品的完整交易伪代码：

```
Inputs:
  - sender = 0xa11ce

Commands:
  - payment = SplitCoins(Gas, [1000])
  - item = MoveCall(0xAAA::market::purchase, [payment])
  - TransferObjects([item], sender)
```

这笔交易执行了三步操作：

1. 从 Gas Coin 中拆分出 1000 MIST 作为支付
2. 调用市场合约的 `purchase` 函数，传入支付 Coin，获取物品
3. 将获得的物品转移给自己（发送者）

使用 Sui TypeScript SDK 构建同样的交易：

```typescript
const tx = new Transaction();

const [payment] = tx.splitCoins(tx.gas, [1000]);
const [item] = tx.moveCall({
    target: '0xAAA::market::purchase',
    arguments: [payment],
});
tx.transferObjects([item], tx.pure.address('0xa11ce'));
```

## 交易的生命周期

一笔交易从构建到最终确认，经历以下阶段：

```
构建（Construct）
    ↓
签名（Sign）
    ↓
提交（Submit）
    ↓
执行（Execute）
    ↓
产生效果（Effects）
```

### 1. 构建

开发者使用 SDK 或 CLI 构建交易，指定命令、输入和 Gas 参数。

### 2. 签名

发送者使用私钥对交易进行数字签名。

### 3. 提交

将签名后的交易提交给 Sui 验证者节点。

### 4. 执行

验证者验证签名和交易合法性后，执行交易中的命令序列。

### 5. 产生效果

交易执行完成后产生 **交易效果（Transaction Effects）**，记录交易的所有结果。

## 交易效果（Transaction Effects）

每笔交易执行后都会产生一组效果，详细记录了交易的执行结果：

| 字段 | 说明 |
|------|------|
| **Transaction Digest** | 交易的唯一哈希标识符 |
| **Status** | 执行状态：成功（success）或失败（failure） |
| **Created Objects** | 本次交易新创建的对象列表 |
| **Mutated Objects** | 本次交易修改的对象列表 |
| **Deleted Objects** | 本次交易删除的对象列表 |
| **Gas Cost Summary** | Gas 费用明细 |
| **Events** | 交易中发出的事件列表 |
| **Balance Changes** | 各账户的余额变动 |

使用 CLI 查看交易效果：

```bash
sui client tx-block <TRANSACTION_DIGEST>
```

## Gas 机制

Gas 是执行交易所需的费用，以 Sui 的最小单位 **MIST** 计价：

```
1 SUI = 1,000,000,000 MIST（10^9 MIST）
```

### Gas 的组成

每笔交易需要指定三个 Gas 相关参数：

| 参数 | 说明 |
|------|------|
| **Gas 对象** | 用于支付 Gas 费的 Coin 对象 |
| **Gas 预算（Gas Budget）** | 交易愿意支付的最大 Gas 量（MIST） |
| **Gas 价格（Gas Price）** | 每单位计算的价格，不低于网络参考价格 |

### Gas 费用明细

交易执行后的 Gas 费用包含以下几部分：

| 费用类型 | 说明 |
|----------|------|
| **计算费用（Computation Cost）** | 执行交易中命令所消耗的计算资源 |
| **存储费用（Storage Cost）** | 新创建或扩大的对象所需的链上存储费用 |
| **存储退款（Storage Rebate）** | 删除或缩小对象时返还的存储费用 |

实际扣除的 Gas 费用计算公式：

```
实际费用 = 计算费用 + 存储费用 - 存储退款
```

### Gas 预算

如果交易执行的实际费用超过了设定的 Gas 预算，交易将失败并回滚所有操作，但 Gas 费用仍会被扣除。因此建议设置合理的 Gas 预算：

```bash
# CLI 会自动估算 Gas，一般无需写 --gas-budget
sui client call --package 0xPKG --module shop --function purchase \
    --args 0xCOIN_ID
```

## 可编程交易块（PTB）

Sui 的一大特色是**可编程交易块**（Programmable Transaction Block, PTB）。一笔交易可以包含多个命令，这些命令按顺序执行，前一个命令的输出可以作为后一个命令的输入：

```
Commands:
  1. coin = SplitCoins(Gas, [5000])
  2. nft = MoveCall(0xBBB::nft::mint, ["My NFT"])
  3. MoveCall(0xCCC::auction::bid, [nft, coin])
```

PTB 的优势：

- **原子性**：所有命令要么全部成功，要么全部失败
- **组合性**：可以在一笔交易中调用多个不同包的函数
- **高效性**：减少了多次交易的网络往返开销
- **数据流转**：前一个命令的返回值可以直接传给后续命令

## 小结

交易是 Sui 区块链上改变状态的唯一方式。一笔交易包含发送者、命令列表、输入参数和 Gas 支付信息。Sui 提供了 `MoveCall`、`TransferObjects`、`SplitCoins` 等多种命令类型，并通过可编程交易块（PTB）实现了多命令的原子组合。交易执行后会产生包含状态变更、Gas 费用、事件等信息的交易效果。Gas 以 MIST 为单位计价（1 SUI = 10^9 MIST），由计算费用、存储费用和存储退款三部分组成。


---


<!-- source: 05_move_basics/index.md -->
## 第五章 · Move 语法基础

# 第五章 · Move 语法基础

本章讲解 Move 的基础语法：模块与组织、类型与表达式、结构体与能力、控制流与函数，为后续进阶与 Sui 开发打下扎实基础。进阶与高级内容见第六章、第七章。

## 本章内容

| 节 | 主题 | 核心知识点 |
|---|------|-----------|
| 5.1 | 模块 | 模块声明、结构、与包的关系 |
| 5.2 | 注释 | 行注释、块注释、文档注释 |
| 5.3 | 模块导入与别名 | use 语句、别名、成员导入 |
| 5.4 | 整数类型 | u8～u256、字面量、算术与位运算、溢出保护 |
| 5.5 | 布尔与类型转换 | bool、逻辑运算、as 类型转换 |
| 5.6 | 地址类型 | address 字面量、与 ID 的关系 |
| 5.7 | 元组与 Unit | 多返回值、解构、unit 类型 |
| 5.8 | 表达式 | 块表达式、语句与表达式的区别 |
| 5.9 | 局部变量与作用域 | let/mut、类型标注、解构、作用域、遮蔽、move/copy |
| 5.10 | 相等比较 | ==、!=、类型与引用比较、无 drop 类型的比较 |
| 5.11 | 结构体 | 定义、字段访问、解构 |
| 5.12 | Abilities 概述 | copy / drop / store / key 四种能力 |
| 5.13 | drop 能力 | 自动销毁、使用场景 |
| 5.14 | copy 能力 | 值复制语义、与引用的区别 |
| 5.15 | 常量 | 常量声明、命名规范 |
| 5.16 | 条件分支 | if/else 表达式、无 else 分支 |
| 5.17 | 循环与带标签控制流 | while、loop、break/continue/return、标签、Gas 安全 |
| 5.18 | 断言与中止 | assert!、abort、错误码、#[error] 与 Clever Errors |
| 5.19 | 函数定义与调用 | 声明、参数、单一/多返回值、解构 |
| 5.20 | entry 与 public 函数 | 四种可见性、entry 交易入口、跨模块调用 |
| 5.21 | 可见性修饰符 | public / public(package) / private |

## 学习目标

读完本章后，你将能够：

- 阅读并编写包含模块、类型、结构体与能力的 Move 代码
- 使用控制流、断言与函数实现简单业务逻辑
- 理解 Move 的能力系统（copy / drop 等）及其对类型与值的影响


---


<!-- source: 05_move_basics/module.md -->
## 5.1 模块（Module）

# 模块（Module）

模块（Module）是 Move 语言中代码组织的基本单元，用于将相关的类型定义、函数和常量组织在一起。模块为代码提供了命名空间隔离，所有成员默认是私有的，只有显式标记为 `public` 的成员才能被外部访问。理解模块的声明方式和组织规范是学习 Move 语言的第一步。

## 模块声明语法

每个 Move 源文件通常包含一个模块声明。模块声明的基本语法如下：

```move
module package_address::module_name;
```

其中 `package_address` 是包地址（可以是字面地址或命名地址），`module_name` 是模块名称。

### 2024 标签语法与传统语法

在 Move 2024 版本中，推荐使用上面的标签语法（label syntax），以分号结尾，模块体中的代码直接写在文件中，无需大括号包裹。

传统语法（pre-2024）使用大括号包裹模块体：

```move
module book::my_module {
    // 模块内容全部在大括号内
    public fun hello(): u64 { 42 }
}
```

本书统一使用 2024 标签语法。

## 命名规范

Move 模块遵循 **snake_case**（蛇形命名法）规范，即全部小写字母，单词之间以下划线分隔：

- `my_module` ✅
- `token_swap` ✅
- `MyModule` ❌
- `tokenSwap` ❌

通常建议 **一个文件只包含一个模块**，文件名与模块名保持一致。例如模块 `my_module` 对应文件 `my_module.move`。

## 模块成员

一个模块可以包含以下成员：

- **结构体（Struct）**：自定义数据类型
- **函数（Function）**：可执行的逻辑单元
- **常量（Constant）**：编译时确定的不可变值
- **导入（Use）**：引用其他模块的成员

```move
module book::my_module;

use std::string::String;

const MAX_SIZE: u64 = 100;

public struct Item has key, store {
    id: UID,
    name: String,
}

public fun create_item(name: String, ctx: &mut TxContext): Item {
    Item {
        id: object::new(ctx),
        name,
    }
}
```

上面的示例展示了一个完整的模块，包含了导入、常量、结构体和函数。

## 地址与命名地址

模块必须属于一个地址。地址可以是字面地址或命名地址。

### 字面地址

字面地址是一个十六进制值，例如 `0x0`、`0x1`、`0x2`：

```move
module 0x1::math;
```

### 命名地址

命名地址是在 `Move.toml` 配置文件中定义的别名，更加可读且便于管理：

```toml
# Move.toml
[addresses]
book = "0x0"
std = "0x1"
sui = "0x2"
```

使用命名地址声明模块：

```move
module book::my_module;
```

编译时，`book` 会被替换为 `Move.toml` 中定义的实际地址 `0x0`。命名地址的好处是在发布合约后只需修改 `Move.toml` 中的地址，而不需要修改源代码。

## 访问控制

模块中的所有成员默认是 **私有的**，即只能在定义它们的模块内部访问：

```move
module book::access_control;

// 私有函数，只能在本模块内调用
fun internal_logic(): u64 {
    42
}

// 公开函数，可以被其他模块调用
public fun value(): u64 {
    internal_logic()
}

// 仅供 package 内其他模块调用
public(package) fun package_only(): u64 {
    100
}
```

Move 提供了三种可见性级别：

| 可见性 | 关键字 | 访问范围 |
|--------|--------|----------|
| 私有 | （无修饰符） | 仅模块内部 |
| 公开 | `public` | 任何模块 |
| 包级别 | `public(package)` | 同一个包内的模块 |

## 小结

模块是 Move 语言的代码组织基石。本节的核心要点包括：

- 模块使用 `module address::name;` 语法声明，推荐使用 2024 标签语法
- 模块名遵循 snake_case 命名规范，一个文件对应一个模块
- 模块可以包含结构体、函数、常量和导入
- 地址可以是字面地址或 `Move.toml` 中定义的命名地址
- 所有模块成员默认私有，需要显式标记 `public` 或 `public(package)` 来暴露


---


<!-- source: 05_move_basics/comments.md -->
## 5.2 注释

# 注释

注释是代码中用于解释和说明的文本，不会被编译器执行。Move 语言支持三种注释方式：行注释、块注释和文档注释。合理使用注释可以大幅提升代码的可读性和可维护性，特别是文档注释能够用于自动生成 API 文档。

## 行注释

行注释以 `//` 开头，从 `//` 到该行末尾的所有内容都会被编译器忽略：

```move
module book::line_comments;

// 这是一个行注释
public fun add(a: u64, b: u64): u64 {
    a + b // 也可以放在代码后面
}
```

行注释适用于简短的说明，是最常用的注释形式。

## 块注释

块注释以 `/*` 开头，以 `*/` 结尾，可以跨越多行：

```move
module book::block_comments;

/* 这是一个块注释
   可以跨越多行
   适合用于较长的说明 */
public fun multiply(a: u64, b: u64): u64 {
    a * b
}

public fun complex_logic(x: u64): u64 {
    /* 临时禁用某段逻辑时也可以用块注释
    let temp = x * 2;
    temp + 1
    */
    x + 1
}
```

块注释支持嵌套，即你可以在块注释内部再嵌套一个块注释，这在临时注释掉一段已经包含块注释的代码时非常有用。

## 文档注释

文档注释以 `///` 开头，用于为模块、结构体、函数等生成文档。文档注释必须放在被注释项的 **正上方**：

```move
module book::comments_example;

/// This is a doc comment for the module

/// A simple counter struct
public struct Counter has key {
    id: UID,
    /// The current count value
    count: u64,
}

// This is a line comment
/* This is a block comment
   spanning multiple lines */

/// Increment the counter by 1
public fun increment(counter: &mut Counter) {
    counter.count = counter.count + 1;
}
```

### 文档注释的最佳实践

文档注释应该描述 **为什么** 和 **做什么**，而不是 **怎么做**（代码本身已经说明了怎么做）：

```move
module book::doc_best_practices;

/// 用户积分记录，用于奖励系统的积分追踪。
/// 积分不可转让，只能由系统增减。
public struct Points has key {
    id: UID,
    /// 当前积分余额
    balance: u64,
    /// 历史累计获得积分（不会因消费减少）
    total_earned: u64,
}

/// 为用户增加积分。
/// 同时更新当前余额和历史累计。
///
/// 参数：
/// - `points`: 积分记录的可变引用
/// - `amount`: 要增加的积分数量
public fun earn(points: &mut Points, amount: u64) {
    points.balance = points.balance + amount;
    points.total_earned = points.total_earned + amount;
}
```

## 空白字符

在 Move 中，空白字符（空格、制表符、换行符）对程序的语义没有影响，仅影响代码的可读性。以下两段代码在编译器看来完全等价：

```move
module book::whitespace_example;

public fun add(a: u64, b: u64): u64 { a + b }

public fun add_formatted(
    a: u64,
    b: u64,
): u64 {
    a + b
}
```

虽然空白不影响语义，但建议遵循社区代码风格约定，保持一致的缩进（4 个空格）和合理的换行，以提升代码可读性。

## 小结

注释是代码可读性的重要组成部分。本节核心要点：

- **行注释** `//`：最常用，适合简短说明
- **块注释** `/* */`：可跨行，支持嵌套，适合较长说明或临时禁用代码
- **文档注释** `///`：放在定义之前，用于生成 API 文档
- 空白字符不影响程序语义，但应遵循统一的代码风格
- 好的注释应解释 "为什么"，而非重复代码已经表达的 "怎么做"


---


<!-- source: 05_move_basics/importing-modules.md -->
## 5.3 模块导入与别名

# 模块导入

Move 的模块系统通过 `use` 语句实现代码复用和依赖管理。导入机制让你可以引用标准库、Sui Framework 以及外部包中定义的类型和函数，而无需在每次使用时写出完整的模块路径。掌握模块导入的各种方式是编写整洁、可维护的 Move 代码的关键。

## 基本导入语法

### 导入整个模块

使用 `use package::module;` 可以导入一个模块，之后通过 `module::member` 的方式访问其成员：

```move
module book::import_module;

use sui::coin;
use sui::sui::SUI;

public fun value(c: &coin::Coin<SUI>): u64 {
    coin::value(c)
}
```

### 导入具体成员

使用 `use package::module::MemberName;` 直接导入模块中的某个类型或函数，之后可以直接使用名称，无需模块前缀：

```move
module book::import_member;

use std::string::String;

public struct Profile has drop {
    name: String,
}
```

## 分组导入

当需要从同一个模块导入多个成员时，可以使用花括号进行分组：

```move
module book::grouped_import;

use sui::coin::{Self, Coin};
use sui::sui::SUI;

public fun coin_value(c: &Coin<SUI>): u64 {
    coin::value(c)
}
```

上例中 `{Self, Coin}` 同时导入了模块本身（`Self` 等价于 `coin`）和 `Coin` 类型。这样既可以使用 `Coin` 类型，也可以通过 `coin::value` 调用模块函数。

### Self 关键字

`Self` 在导入中代表模块本身。使用 `Self` 可以在分组导入中同时引入模块和其成员：

```move
module book::self_import;

use std::string::{Self, String};

public fun create_greeting(): String {
    let bytes = b"Hello, Sui!";
    string::utf8(bytes)
}
```

## 别名导入

使用 `as` 关键字可以为导入的模块或类型指定别名，解决命名冲突或提升可读性：

```move
module book::alias_import;

use std::string::String as UTF8String;
use std::ascii::String as ASCIIString;

public struct Names has drop {
    utf8_name: UTF8String,
    ascii_name: ASCIIString,
}
```

当两个不同模块导出了同名的类型时，别名是避免冲突的唯一方式。

## 从 Sui Framework 导入

Sui Framework 是构建 Sui 智能合约最常用的依赖库。它提供了对象模型、代币系统、事件等核心功能。以下是一些常见的导入：

```move
module book::sui_imports;

use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::event;
use sui::object;
use sui::transfer;
use sui::tx_context::TxContext;
use std::string::String;
```

### 常用的 Framework 模块

| 包 | 模块 | 用途 |
|-----|------|------|
| `std` | `std::string` | UTF-8 字符串操作 |
| `std` | `std::option` | `Option<T>` 类型 |
| `std` | `std::vector` | 向量操作 |
| `sui` | `sui::object` | 对象创建与操作 |
| `sui` | `sui::transfer` | 对象转移 |
| `sui` | `sui::tx_context` | 交易上下文 |
| `sui` | `sui::coin` | 代币操作 |
| `sui` | `sui::event` | 事件发送 |
| `sui` | `sui::clock` | 链上时钟 |

## 自动导入

Move 编译器会自动导入一些常用的模块和类型，无需手动编写 `use` 语句：

- `std::vector` — 向量模块
- `std::option` — Option 模块
- `std::option::Option` — Option 类型

这意味着你可以直接使用 `vector[]`、`option::some()`、`Option<T>` 等，而无需显式导入。

```move
module book::auto_import;

public struct Container has drop {
    items: vector<u64>,
    label: Option<u64>,
}

#[test]
fun auto_import() {
    let items = vector[1u64, 2, 3];
    let label = option::some(42u64);

    let c = Container { items, label };
    assert_eq!(c.items.length(), 3);
    assert!(c.label.is_some());
}
```

## 外部依赖

外部包的依赖通过 `Move.toml` 配置文件进行管理。

### Move.toml 中的依赖配置

```toml
[package]
name = "my_project"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
book = "0x0"
```

定义好依赖后，就可以在代码中导入该依赖包提供的模块。

### CLI v1.45+ 的简化

从 Sui CLI v1.45 版本开始，系统包（`std`、`sui`）会被 **自动包含** 为依赖，无需在 `Move.toml` 中手动添加。这大大简化了新项目的配置。

## 导入位置

`use` 语句通常放在模块声明之后、其他代码之前。虽然 Move 允许在函数内部使用 `use`，但推荐在模块顶部统一管理导入：

```move
module book::import_placement;

// 推荐：在模块顶部统一导入
use std::string::String;
use sui::coin::{Self, Coin};
use sui::sui::SUI;

public struct Token has drop {
    name: String,
}

public fun coin_value(c: &Coin<SUI>): u64 {
    // 也可以在函数内部导入（不推荐）
    // use sui::coin;
    coin::value(c)
}
```

## 完整示例

下面的例子综合展示了各种导入方式的实际用法：

```move
module book::import_example;

use std::string::String;
use sui::coin::{Self, Coin};
use sui::sui::SUI;

public struct MyToken has key {
    id: UID,
    name: String,
}

public fun coin_value(c: &Coin<SUI>): u64 {
    coin::value(c)
}

public fun create_token(name: String, ctx: &mut TxContext): MyToken {
    MyToken {
        id: object::new(ctx),
        name,
    }
}
```

## 小结

模块导入是 Move 代码组织的核心机制。本节核心要点：

- **模块导入**：`use package::module;` 导入模块，通过 `module::member` 访问成员
- **成员导入**：`use package::module::Member;` 直接导入类型或函数
- **分组导入**：`use package::module::{Self, Type1, Type2};` 一次导入多个成员
- **别名**：`use package::module::Type as Alias;` 解决命名冲突
- **Self 关键字**：在分组导入中代表模块本身
- **自动导入**：`vector`、`option`、`Option` 无需手动导入
- **外部依赖**：通过 `Move.toml` 配置，CLI v1.45+ 自动包含系统包


---


<!-- source: 05_move_basics/integers.md -->
## 5.4 整数类型

# 整数类型

Move 提供六种无符号整数类型，没有有符号整数。所有整数类型都具有 `copy`、`drop` 和 `store` 能力，是构建数值逻辑的基础。

## 整数类型一览

| 类型 | 位宽 | 范围 |
|------|------|------|
| `u8` | 8位 | 0 ~ 255 |
| `u16` | 16位 | 0 ~ 65,535 |
| `u32` | 32位 | 0 ~ 4,294,967,295 |
| `u64` | 64位 | 0 ~ 18,446,744,073,709,551,615 |
| `u128` | 128位 | 0 ~ 2¹²⁸-1 |
| `u256` | 256位 | 0 ~ 2²⁵⁶-1 |

## 整数字面量

整数字面量可以使用后缀指定类型，也可以使用下划线分隔提高可读性：

```move
module book::int_literals;

#[test]
fun literals() {
    let a: u8 = 255;
    let b = 1_000_000u64;       // 下划线分隔
    let c = 0xFF_u8;            // 十六进制
    let d: u128 = 1_000_000_000_000;
    let e: u256 = 0;

    assert_eq!(a, 255);
    assert_eq!(b, 1000000);
}
```

## 算术运算符

| 运算符 | 说明 | 示例 |
|--------|------|------|
| `+` | 加法 | `10 + 20` |
| `-` | 减法 | `30 - 10` |
| `*` | 乘法 | `5 * 6` |
| `/` | 整除 | `100 / 3` → `33` |
| `%` | 取余 | `100 % 3` → `1` |

## 位运算符

| 运算符 | 说明 | 示例 |
|--------|------|------|
| `&` | 按位与 | `0xFF & 0x0F` → `0x0F` |
| `\|` | 按位或 | `0xF0 \| 0x0F` → `0xFF` |
| `^` | 按位异或 | `0xFF ^ 0x0F` → `0xF0` |
| `<<` | 左移 | `1 << 3` → `8` |
| `>>` | 右移 | `16 >> 2` → `4` |

## 比较运算符

| 运算符 | 说明 |
|--------|------|
| `==` | 等于 |
| `!=` | 不等于 |
| `<` | 小于 |
| `>` | 大于 |
| `<=` | 小于等于 |
| `>=` | 大于等于 |

## 综合示例

```move
module book::primitive_examples;

#[test]
fun primitives() {
    let a: u8 = 255;
    let b: u64 = 1_000_000;
    let c: u128 = 1_000_000_000_000;
    let d: u256 = 0;

    let sum = 10u64 + 20;
    let diff = 30u64 - 10;
    let product = 5u64 * 6;
    let quotient = 100u64 / 3;
    let remainder = 100u64 % 3;
}
```

## 溢出保护

Move 的整数运算在运行时具有 **溢出保护**。当运算结果超出类型范围时，程序会产生运行时错误（abort），而不是静默地回绕（wrapping）：

```move
module book::overflow;

#[test]
#[expected_failure(abort_code = /* arithmetic error */)]
fun overflow() {
    let max: u8 = 255;
    let _result = max + 1; // 运行时 abort，不会回绕为 0
}
```

这一设计确保了链上资产运算的安全性，避免因溢出导致的漏洞。

## 类型推断与显式标注

Move 编译器通常可以根据上下文推断变量类型，但在某些情况下需要显式标注：

```move
module book::type_inference;

#[test]
fun inference() {
    let a = 42;             // 编译器从使用场景推断类型
    let b: u64 = 42;        // 显式标注为 u64
    let c = 42u8;           // 通过后缀指定为 u8
    let d = (42 as u128);   // 通过 as 指定为 u128

    assert_eq!(b, (a as u64));
}
```

当编译器无法推断类型时（例如变量未被使用，或者存在多种可能的类型），你需要显式标注类型。

## 小结

- **整数类型**：u8、u16、u32、u64、u128、u256，全部为无符号
- **字面量**：后缀指定类型、下划线分隔、十六进制
- **运算符**：算术（+、-、*、/、%）、位运算（&、|、^、<<、>>）、比较（==、!=、<、>、<=、>=）
- **溢出保护**：运行时检测溢出并 abort，而非静默回绕


---


<!-- source: 05_move_basics/booleans-and-casts.md -->
## 5.5 布尔与类型转换

# 布尔与类型转换

布尔类型与类型转换是 Move 基础类型的重要组成部分。布尔用于条件与逻辑判断；`as` 用于在不同整数类型之间进行显式转换。

## 布尔类型

布尔类型 `bool` 只有两个值：`true` 和 `false`。

### 逻辑运算符

| 运算符 | 说明 | 示例 |
|--------|------|------|
| `&&` | 逻辑与 | `true && false` → `false` |
| `\|\|` | 逻辑或 | `true \|\| false` → `true` |
| `!` | 逻辑非 | `!true` → `false` |

```move
module book::bool_example;

#[test]
fun bool_ops() {
    let a = true;
    let b = false;

    assert!(a && !b);     // true && true = true
    assert!(a || b);      // true || false = true
    assert!(!(a && b));   // !(true && false) = true
}
```

逻辑与 `&&` 和逻辑或 `||` 支持 **短路求值**：如果左操作数已经能确定结果，右操作数不会被求值。

## 类型转换

Move 使用 `as` 关键字在不同整数类型之间进行显式转换：

```move
module book::casting;

#[test]
fun casting() {
    let x: u8 = 42;
    let y: u64 = (x as u64);
    let z: u128 = (y as u128);
    let w: u256 = (z as u256);

    // 也可以从大类型转到小类型（会截断）
    let big: u64 = 300;
    let small: u8 = (big as u8); // 300 % 256 = 44
    assert_eq!(small, 44);
}
```

> **注意**：从大类型向小类型转换时会发生截断，高位被丢弃。

## 小结

- **布尔类型**：`true`/`false`，支持 `&&`、`||`、`!`，短路求值
- **类型转换**：使用 `as` 关键字进行显式转换，大转小会截断


---


<!-- source: 05_move_basics/address-type.md -->
## 5.6 地址类型

# 地址类型（address）

地址类型 `address` 是 Move 语言中的一种特殊类型，占用 32 字节（256 位），用于表示区块链上的位置标识。在 Sui 中，地址既用于标识账户（用户钱包），也用于标识对象（Object）。掌握地址类型及其转换方法，是与链上资源交互的基础。

## 地址字面量

地址字面量以 `@` 符号开头，可以使用十六进制值或命名地址：

```move
module book::address_literal;

#[test]
fun address_literal() {
    // 十六进制字面地址
    let addr1 = @0x0;
    let addr2 = @0x1;
    let addr3 = @0x2;

    // 命名地址（在 Move.toml 中定义）
    let std_addr = @std;   // 等价于 @0x1
    let sui_addr = @sui;   // 等价于 @0x2
}
```

常见的预定义地址：

| 地址 | 命名地址 | 说明 |
|------|----------|------|
| `@0x1` | `@std` | Move 标准库 |
| `@0x2` | `@sui` | Sui Framework |
| `@0x6` | — | 系统时钟对象 |

## 地址与 u256 之间的转换

地址本质上是一个 256 位的数值，因此可以与 `u256` 类型互相转换：

```move
module book::address_u256;

#[test]
fun address_u256() {
    let addr = @0x1;

    // address -> u256
    let addr_as_u256: u256 = addr.to_u256();
    assert_eq!(addr_as_u256, 1u256);

    // u256 -> address
    let addr_from_u256 = address::from_u256(addr_as_u256);
    assert_eq!(addr, addr_from_u256);
}
```

## 地址与字节数组之间的转换

地址可以转换为 32 字节的 `vector<u8>`，也可以从字节数组还原：

```move
module book::address_bytes;

#[test]
fun address_bytes() {
    let addr = @0x1;

    // address -> vector<u8>（32字节）
    let bytes: vector<u8> = addr.to_bytes();
    assert_eq!(bytes.length(), 32);

    // vector<u8> -> address
    let addr_from_bytes = address::from_bytes(bytes);
    assert_eq!(addr, addr_from_bytes);
}
```

> **注意**：`address::from_bytes` 要求传入的 `vector<u8>` 长度恰好为 32 字节，否则会产生运行时错误。

## 地址与字符串之间的转换

地址可以转换为十六进制字符串表示：

```move
module book::address_examples;

use std::string::String;

#[test]
fun address() {
    let addr = @0x1;
    let named_addr = @std;

    // Convert to u256
    let addr_as_u256: u256 = addr.to_u256();
    let addr_from_u256 = address::from_u256(addr_as_u256);
    assert_eq!(addr, addr_from_u256);

    // Convert to bytes
    let bytes: vector<u8> = addr.to_bytes();
    let addr_from_bytes = address::from_bytes(bytes);
    assert_eq!(addr, addr_from_bytes);

    // Convert to string
    let addr_str: String = addr.to_string();
}
```

## 地址与对象 ID 的关系

在 Sui 中，每个对象（Object）都有一个唯一的 ID，类型为 `sui::object::ID`。对象 ID 本质上也是一个地址值，两者之间存在密切关系：

```move
module book::address_and_id;

use sui::object;

public fun id_to_address(id: &object::ID): address {
    object::id_to_address(id)
}

public fun address_to_id(addr: address): object::ID {
    object::id_from_address(addr)
}
```

### 理解地址的双重角色

在 Sui 网络中，地址扮演着双重角色：

1. **账户地址**：每个用户钱包对应一个地址，用于发送交易和持有对象
2. **对象地址**：每个链上对象都有一个唯一的地址（即对象 ID）

两者在格式上完全相同，都是 32 字节的十六进制值。区别在于语义：账户地址是由公钥派生的，而对象地址是在对象创建时由系统生成的。

## 转换方法汇总

| 方法 | 说明 | 方向 |
|------|------|------|
| `addr.to_u256()` | 地址转 u256 | address → u256 |
| `address::from_u256(n)` | u256 转地址 | u256 → address |
| `addr.to_bytes()` | 地址转字节数组 | address → vector\<u8\> |
| `address::from_bytes(bytes)` | 字节数组转地址 | vector\<u8\> → address |
| `addr.to_string()` | 地址转十六进制字符串 | address → String |
| `object::id_to_address(id)` | 对象 ID 转地址 | ID → address |
| `object::id_from_address(addr)` | 地址转对象 ID | address → ID |

## 小结

地址类型是 Move 与区块链交互的核心类型。本节核心要点：

- 地址是 32 字节（256 位）的特殊类型，用 `@` 前缀表示
- 支持十六进制字面量（`@0x1`）和命名地址（`@std`）
- 提供与 `u256`、`vector<u8>`、`String` 之间的双向转换方法
- 在 Sui 中，地址既标识账户也标识对象，对象 ID 本质上就是一个地址


---


<!-- source: 05_move_basics/tuples-and-unit.md -->
## 5.7 元组与 Unit

# 元组与 Unit

Move 支持元组形式的表达式，用于多返回值和解构；同时提供 **unit** 类型 `()`，表示“无有意义值”。元组在字节码层并不存在独立表示，因此不能绑定到局部变量、不能存入结构体、也不能作为泛型类型参数实例化，只能在表达式（尤其是返回值）中使用。

## Unit 类型 `()`

Unit 是“空元组”，类型为 `()`，常用于无返回值的函数：

```move
module book::unit_example;

public fun do_nothing(): () {
    ()
}

public fun do_nothing_implicit() {
    // 无返回类型时默认为 ()
}
```

空块或块尾带分号时，块的值也是 `()`。

## 元组字面量

元组由括号内逗号分隔的表达式构成，类型为 `(T1, T2, ...)`。注意**单元素** `(e)` 只是括号，类型仍是 `e` 的类型，不是单元素元组：

```move
module book::tuples;

public fun returns_unit(): () {
    ()
}

public fun returns_pair(): (u64, bool) {
    (0, false)
}

public fun returns_three(): (u64, u8, address) {
    (1, 2, @0x42)
}
```

## 元组解构

在 `let` 或赋值中可对元组解构，按位置绑定到多个局部变量：

```move
#[test]
fun destructure() {
    let () = ();
    let (x, y): (u64, u64) = (0, 1);
    let (a, b, c) = (@0x0, 0u8, true);

    (x, y) = (2, 3);
    assert_eq!(x, 2);
    assert_eq!(y, 3);
}
```

元组长度必须与模式一致，否则会报错。

## 多返回值

函数返回多个值时，在类型和 return 处使用元组语法；调用方用解构接收：

```move
public fun swap(a: u64, b: u64): (u64, u64) {
    (b, a)
}

#[test]
fun use_swap() {
    let (x, y) = swap(1, 2);
    assert_eq!(x, 2);
    assert_eq!(y, 1);
}
```

Move 不允许在结构体中存储引用，因此多返回值（尤其是包含引用时）依赖元组语法实现。

## 小结

- `()` 是 unit 类型，表示“无值”；无返回类型的函数即返回 `()`。
- 元组 `(e1, e2, ...)` 用于多返回值和解构，不能存到变量或结构体。
- 通过 `let (a, b, ...) = ...` 或赋值解构元组，长度需匹配。


---


<!-- source: 05_move_basics/expression.md -->
## 5.8 表达式

# 表达式

在 Move 中，几乎所有的语法构造都是表达式（Expression），即它们会产生一个值。唯一的例外是 `let` 语句——它是语句（Statement），不产生值。这种"一切皆表达式"的设计让 Move 的代码风格更加简洁和富有表达力。

## 字面量表达式

字面量是最基本的表达式，直接表示一个值：

```move
module book::literals;

#[test]
fun literals() {
    // 布尔字面量
    let _b1 = true;
    let _b2 = false;

    // 整数字面量
    let _i1 = 42u64;
    let _i2 = 0xFF;        // 十六进制

    // 字节向量字面量
    let _bytes1 = b"hello"; // UTF-8 字符串转字节向量
    let _bytes2 = x"0A1B";  // 十六进制字节向量

    // 地址字面量
    let _addr = @0x1;
}
```

### 字节向量的两种写法

- `b"hello"`：将 UTF-8 字符串编码为 `vector<u8>`
- `x"0A1B"`：将十六进制值直接解析为 `vector<u8>`

## 运算符表达式

所有运算符都会产生一个值，因此它们也是表达式：

```move
module book::operator_expr;

#[test]
fun operators() {
    // 算术运算产生整数值
    let sum = 10 + 20;         // 30
    let product = 5 * 6;       // 30

    // 比较运算产生布尔值
    let is_equal = sum == product;  // true

    // 逻辑运算产生布尔值
    let is_positive = sum > 0;
    let combined = is_equal && is_positive; // true

    assert!(combined);
}
```

## 块表达式

用花括号 `{ }` 包裹的代码块本身也是一个表达式。块中最后一个表达式的值（**不带分号**）就是整个块的返回值：

```move
module book::block_expr;

#[test]
fun block_returns_value() {
    let x = {
        let a = 10;
        let b = 20;
        a + b  // 没有分号 = 返回值
    };
    assert_eq!(x, 30);

    // 嵌套块表达式
    let y = {
        let inner = {
            let c = 5;
            c * 2
        };
        inner + 10
    };
    assert_eq!(y, 20);
}
```

### 空块

空块 `{}` 返回单元值 `()`（unit type）：

```move
module book::empty_block;

#[test]
fun empty_block() {
    let _unit: () = {};
}
```

## 分号的作用

分号 `;` 用于终止一个表达式。被分号终止的表达式的值会被丢弃。如果分号后面没有其他表达式，编译器会自动插入单元值 `()`：

```move
module book::semicolons;

#[test]
fun semicolons() {
    // 带分号：值被丢弃，块返回 ()
    let _a: () = {
        10 + 20; // 值 30 被丢弃
    };

    // 不带分号：值被返回
    let b: u64 = {
        10 + 20 // 值 30 被返回
    };
    assert_eq!(b, 30);
}
```

> **常见错误**：函数末尾不小心加了分号，导致返回 `()` 而非预期值。这是新手最容易犯的错误之一。

## 函数调用作为表达式

函数调用也是表达式，其值为函数的返回值：

```move
module book::func_expr;

fun double(x: u64): u64 {
    x * 2
}

fun add(a: u64, b: u64): u64 {
    a + b
}

#[test]
fun func_as_expr() {
    // 函数调用的结果可以直接参与运算
    let result = add(double(5), double(3));
    assert_eq!(result, 16); // (5*2) + (3*2) = 16
}
```

## 控制流表达式

`if/else` 在 Move 中也是表达式，会产生一个值：

```move
module book::expression_examples;

#[test]
fun expressions_mixed() {
    // Literals
    let _bool_val = true;
    let _int_val = 42u64;
    let _hex_val = 0xFF;
    let _bytes = b"hello";

    // Block expression returns a value
    let x = {
        let a = 10;
        let b = 20;
        a + b  // no semicolon = return value
    };
    assert_eq!(x, 30);

    // if as expression
    let y = if (x > 20) { 1 } else { 0 };
    assert_eq!(y, 1);

    // Operators
    let sum = 10 + 20;
    let is_positive = sum > 0;
    assert!(is_positive);
}
```

当 `if/else` 作为表达式使用时，两个分支的返回类型必须一致：

```move
module book::if_expr;

#[test]
fun if_expr_grade() {
    let score = 85u64;

    let grade = if (score >= 90) {
        b"A"
    } else if (score >= 80) {
        b"B"
    } else if (score >= 70) {
        b"C"
    } else {
        b"D"
    };

    assert_eq!(grade, b"B");
}
```

## 表达式序列

多个表达式可以通过分号连接形成序列，最后一个表达式的值是整个序列的值：

```move
module book::expr_sequence;

fun compute(input: u64): u64 {
    let doubled = input * 2;
    let offset = doubled + 10;
    let result = offset / 3;
    result // 最后一个表达式的值作为函数返回值
}

#[test]
fun sequence() {
    assert_eq!(compute(10), 10); // (10*2 + 10) / 3 = 10
}
```

## 小结

表达式是 Move 语言的核心语法概念。本节核心要点：

- Move 中几乎一切都是表达式，唯一的例外是 `let` 语句
- **字面量**：布尔、整数、十六进制、字节向量（`b"..."`、`x"..."`）、地址都是表达式
- **块表达式**：`{ }` 中最后一个不带分号的表达式是块的返回值
- **分号**：终止表达式并丢弃其值，末尾加分号会导致返回 `()`
- **控制流**：`if/else` 也是表达式，两个分支返回类型必须一致
- **函数调用**：函数调用的结果可以直接作为表达式参与运算


---


<!-- source: 05_move_basics/variables-and-scope.md -->
## 5.9 局部变量与作用域

# 局部变量与作用域

Move 中的局部变量采用词法（静态）作用域，通过 `let` 引入。使用 `mut` 标记的变量可以重新赋值或被可变借用。本节系统介绍变量声明、类型标注、解构、作用域、遮蔽（shadowing）以及 move 与 copy 的语义。

## let 绑定

使用 `let` 将名字绑定到值：

```move
module book::variables;

#[test]
fun let_bindings() {
    let x = 1;
    let y = x + x;
    assert_eq!(y, 2);
}
```

可以先声明后赋值（便于在分支或循环中赋初值）：

```move
#[test]
fun let_then_assign() {
    let x;
    if (true) {
        x = 1
    } else {
        x = 0
    };
    assert_eq!(x, 1);
}
```

变量在**赋值前不能使用**，且在**所有控制流路径上都必须被赋值**，否则类型检查会报错（例如 `let x; if (cond) x = 0; x + 1` 在 else 分支未赋 x 会报错；`while` 循环后的 x 也视为可能未赋值）。

## mut 可变变量

需要重新赋值或需要被 `&mut` 借用时，必须用 `let mut` 声明：

```move
#[test]
fun mut_var() {
    let mut x = 0;
    x = x + 1;
    assert_eq!(x, 1);
}
```

函数参数若需可变借用，也应使用 `mut`，例如 `fun f(mut v: vector<u64>)`。

## 变量命名规则

变量名可包含字母、数字和下划线，且**必须以小写字母或下划线开头**，不能以大写字母开头（大写用于类型或常量）：

```move
let x = 1;      // 合法
let _x = 1;     // 合法，下划线常用于“有意忽略”
let x0 = 1;     // 合法
// let X = 1;   // 非法
```

## 类型标注

多数情况下类型可推断，需要时可显式标注：

```move
let x: u64 = 0;
let v: vector<u8> = vector[];
let a: address = @0x0;
```

在以下情况类型标注是**必须的**：（1）泛型无法推断，例如空向量 `vector[]`；（2）发散表达式（如 `return`、`abort`、无 `break` 的 `loop`）的绑定，编译器无法从后续代码推断类型。类型标注写在**模式右侧**、等号左侧，例如 `let (x, y): (u64, u64) = (0, 1);`，而不是 `let (x: u64, y: u64) = ...`。

```move
let empty: vector<u64> = vector[];  // 必须标注元素类型
```

## 用元组一次绑定多个变量

`let` 可以用元组同时引入多个变量：

```move
#[test]
fun tuple_destructure() {
    let () = ();
    let (x, y) = (0u64, 1u64);
    let (a, b, c) = (true, 10u8, @0x1);
    assert_eq!(x + y, 1);
}
```

元组长度必须与模式匹配，且同一 `let` 中不能重复同名变量。

## 用结构体解构绑定

可以从结构体中解构出字段并绑定到局部变量：

```move
public struct Point has copy, drop {
    x: u64,
    y: u64,
}

#[test]
fun struct_destructure() {
    let Point { x, y } = Point { x: 1, y: 2 };
    assert_eq!(x + y, 3);
}

#[test]
fun struct_destructure_rename() {
    let Point { x: a, y: b } = Point { x: 10, y: 20 };
    assert_eq!(a, 10);
    assert_eq!(b, 20);
}
```

对引用解构会得到引用类型的绑定（`&t` / `&mut t`），不会消费原值。

## 忽略值：下划线

不需要绑定的值可用 `_` 忽略，避免“未使用变量”警告：

```move
let (x, _, z) = (1, 2, 3);  // 第二个值被忽略
```

## 块与作用域

用花括号 `{ }` 构成块；块内 `let` 只在该块内有效。块最后一个表达式（无分号）的值即为块的值：

```move
#[test]
fun block_scope() {
    let x = 0;
    let y = {
        let inner = 1;
        x + inner
    };
    assert_eq!(y, 1);
    // inner 在此不可见
}
```

内层块可以访问外层变量；外层不能访问内层声明的变量。

## 遮蔽（Shadowing）

同一作用域内再次用 `let` 声明同名变量会遮蔽之前的绑定，之后无法访问旧值：

```move
#[test]
fun shadowing() {
    let x = 0;
    assert_eq!(x, 0);
    let x = 1;  // 遮蔽
    assert_eq!(x, 1);
}
```

被遮蔽的变量若类型无 `drop` 能力，其值仍须在函数结束前被转移或销毁，不能“藏起来”就不管。

## 赋值

`mut` 变量可通过赋值 `x = e` 修改。赋值本身是表达式，类型为 `()`：

```move
let mut x = 0;
x = 1;
if (cond) x = 2 else x = 3;
```

## move 与 copy

- **copy**：复制值，原变量仍可使用；仅对具有 `copy` 能力的类型可用。
- **move**：将值移出变量，移出后该变量不可再使用。

未显式写 `copy` 或 `move` 时，编译器按以下规则**推断**：  
（1）有 `copy` 能力的类型默认 **copy**；  
（2）**引用**（`&T`、`&mut T`）默认 **copy**（特殊情况下在不再使用时可能按 move 处理以得到更清晰的借用错误）；  
（3）其他类型（无 copy 或资源类型）默认 **move**。

```move
let x = 1;
let y = copy x;  // 显式复制，x 仍可用
let z = move x;  // 移出后 x 不可再用
```

## 小结

- 用 `let` 引入局部变量，需要修改或可变借用时用 `let mut`。
- 变量名以小写或下划线开头；可选用类型标注。
- 可用元组或结构体解构一次绑定多个变量，用 `_` 忽略不需要的值。
- 块 `{ }` 限定作用域；块尾无分号的表达式为块的值。
- 同名 `let` 会遮蔽；赋值仅针对 `mut` 变量。
- 值的使用方式由 move/copy 语义决定，编译器会做推断。


---


<!-- source: 05_move_basics/equality.md -->
## 5.10 相等比较

# 相等比较

Move 提供两种相等运算：`==`（相等）和 `!=`（不相等）。两者都要求两个操作数类型相同，且比较会**消费**参与比较的值，因此只有具有 `drop` 能力的类型可以直接用 `==` / `!=` 比较；否则应先借用再比较。

## 基本用法

| 语法 | 含义 |
|------|------|
| `==` | 两操作数值相等则为 `true`，否则 `false` |
| `!=` | 两操作数值不相等则为 `true`，否则 `false` |

```move
module book::equality;

#[test]
fun equality_basic() {
    assert!(0 == 0);
    assert!(1u128 != 2u128);
    assert!(b"hello" != b"world");
}
```

## 类型要求

两边类型必须一致；可用于所有类型（包括自定义结构体，只要该类型有 `drop` 能力）：

```move
public struct S has copy, drop {
    f: u64,
}

#[test]
fun struct_equality() {
    let s1 = S { f: 1 };
    let s2 = S { f: 1 };
    assert!(s1 == s2);
    assert!(s1 != S { f: 2 });
}
```

## 引用比较

比较引用时，比较的是**所指的值**，与引用是 `&` 还是 `&mut` 无关；`&T` 与 `&mut T` 可以互相比较（底层类型须相同）。语义上等价于在需要不可变引用的地方对 `&mut` 做一次 `freeze` 再比较：

```move
#[test]
fun ref_equality() {
    let x = 0;
    let mut y = 1;
    let r = &x;
    let m = &mut y;
    assert!(r != m);  // 0 != 1
    assert!(r == r);
    assert!(m == m);
    // 等价于：r == freeze(m)、freeze(m) == r 等
}
```

两边的**底层类型**必须相同，例如 `&u64` 与 `&vector<u8>` 不能比较。

## 无 drop 类型：先借用再比较

没有 `drop` 能力的值不能直接被 `==` / `!=` 消费，否则会报错。应使用引用比较：

```move
public struct Coin has store {
    value: u64,
}

public fun coins_equal(c1: &Coin, c2: &Coin): bool {
    c1 == c2  // 比较引用指向的值
}
```

### Move 2024：自动借用

Move 2024 中，若一边是引用、另一边是值，会**自动对值做不可变借用**再比较，因此无需手写 `&`：

```move
let r = &0;
r == 0;   // true，0 被自动借用为 &0
0 == r;   // true
r != 1;   // false
```

自动借用始终是**不可变借用**。

## 避免不必要的 copy

对大型值或向量，用引用比较可避免复制：

```move
assert!(&v1 == &v2);   // 推荐
assert!(copy v1 == copy v2);  // 可能产生大拷贝
```

## 小结

- `==`、`!=` 要求两操作数类型相同，可用于有 `drop` 的类型及引用。
- 无 `drop` 的类型需通过引用比较（`&a == &b`）。
- 大值或向量建议用引用比较以减少 copy。


---


<!-- source: 05_move_basics/struct.md -->
## 5.11 结构体（Struct）

# 结构体（Struct）

结构体（Struct）是 Move 语言中定义自定义类型的核心机制，也是类型系统的基本构建块。通过结构体，开发者可以将多个不同类型的数据组合成一个有意义的整体。在 Sui 中，链上对象本质上就是带有 `key` 能力的结构体。

## 定义结构体

结构体使用 `struct` 关键字定义，可以附带能力声明和字段列表：

```move
module book::struct_definition;

use std::string::String;

public struct Profile has key, store {
    id: UID,
    name: String,
    age: u8,
    is_active: bool,
}
```

### 语法结构

```
[public] struct 名称 [has 能力列表] {
    字段名1: 类型1,
    字段名2: 类型2,
    ...
}
```

- `public` 修饰符使类型对外可见（字段仍然是私有的）
- `has` 后面跟能力列表，详见能力系统章节
- 字段类型可以是任何合法的 Move 类型，包括其他结构体

### 命名规范

- 结构体名使用 **PascalCase**（大驼峰）：`MyStruct`、`TokenBalance`
- 字段名使用 **snake_case**（蛇形）：`total_supply`、`is_active`

## 嵌套结构体

结构体的字段可以包含其他结构体类型，但 **不允许递归引用自身**：

```move
module book::struct_examples;

use std::string::String;
use std::option::Option;

public struct Artist has copy, drop {
    name: String,
}

public struct Record has copy, drop {
    title: String,
    artist: Artist,
    year: u16,
    is_debut: bool,
    edition: Option<u16>,
}
```

## 创建实例

通过结构体名称和字段赋值来创建实例。所有字段都必须赋值：

```move
module book::struct_create;

use std::string::String;

public struct Point has copy, drop {
    x: u64,
    y: u64,
}

public struct NamedPoint has copy, drop {
    name: String,
    point: Point,
}

#[test]
fun create() {
    let origin = Point { x: 0, y: 0 };
    let p = Point { x: 10, y: 20 };

    let named = NamedPoint {
        name: b"Center".to_string(),
        point: origin,
    };
}
```

当变量名与字段名相同时，可以使用简写语法：

```move
module book::struct_shorthand;

public struct Pair has copy, drop {
    first: u64,
    second: u64,
}

#[test]
fun shorthand() {
    let first = 10u64;
    let second = 20u64;
    let pair = Pair { first, second }; // 等价于 Pair { first: first, second: second }
    assert_eq!(pair.first, 10);
}
```

## 字段访问

使用 `.` 运算符访问结构体字段。**字段访问仅限于定义该结构体的模块内部**：

```move
module book::struct_access;

use std::string::String;
use std::option::Option;

public struct Artist has copy, drop {
    name: String,
}

public struct Record has copy, drop {
    title: String,
    artist: Artist,
    year: u16,
    is_debut: bool,
    edition: Option<u16>,
}

public fun new_artist(name: String): Artist {
    Artist { name }
}

public fun new_record(
    title: String,
    artist: Artist,
    year: u16,
    is_debut: bool,
    edition: Option<u16>,
): Record {
    Record { title, artist, year, is_debut, edition }
}

public fun artist_name(artist: &Artist): &String {
    &artist.name
}

public fun record_year(record: &Record): u16 {
    record.year
}
```

## 解构（Unpacking）

解构可以将结构体的字段值提取到独立变量中。这是访问结构体内部数据的另一种方式：

```move
module book::struct_unpack;

use std::string::String;
use std::option::Option;

public struct Artist has copy, drop {
    name: String,
}

public struct Record has copy, drop {
    title: String,
    artist: Artist,
    year: u16,
    is_debut: bool,
    edition: Option<u16>,
}

#[test]
fun struct_unpack() {
    let artist = Artist { name: b"The Beatles".to_string() };
    let record = Record {
        title: b"Abbey Road".to_string(),
        artist,
        year: 1969,
        is_debut: false,
        edition: option::none(),
    };

    assert_eq!(record.year, 1969);
    assert_eq!(record.is_debut, false);

    // Unpacking
    let Record { title: _, artist: _, year, is_debut: _, edition: _ } = record;
    assert_eq!(year, 1969);
}
```

### 忽略不需要的字段

解构时，对于不需要的字段，使用 `_` 前缀或直接用 `_` 来忽略：

```move
module book::struct_ignore;

public struct Config has copy, drop {
    width: u64,
    height: u64,
    depth: u64,
    color: u8,
}

#[test]
fun ignore_fields() {
    let config = Config { width: 100, height: 200, depth: 50, color: 3 };

    // 只关心 width 和 height
    let Config { width, height, depth: _, color: _ } = config;
    assert_eq!(width, 100);
    assert_eq!(height, 200);
}
```

## 无能力结构体的约束

没有任何能力的结构体不能被丢弃，必须显式处理（解构）。这是 Move 资源安全性的重要保障：

```move
module book::struct_no_ability;

public struct Receipt {
    amount: u64,
    paid: bool,
}

public fun create_receipt(amount: u64): Receipt {
    Receipt { amount, paid: false }
}

public fun consume_receipt(receipt: Receipt) {
    let Receipt { amount: _, paid: _ } = receipt; // 必须解构
}
```

如果尝试忽略没有 `drop` 能力的结构体实例，编译器会报错。这一特性常用于实现 **Hot Potato** 模式，确保某些操作必须被完成。

## 可变字段

对于可变引用的结构体，可以直接修改其字段值：

```move
module book::struct_mut;

public struct Balance has copy, drop {
    value: u64,
}

public fun increase(balance: &mut Balance, amount: u64) {
    balance.value = balance.value + amount;
}

public fun decrease(balance: &mut Balance, amount: u64) {
    assert!(balance.value >= amount);
    balance.value = balance.value - amount;
}

#[test]
fun mut_fields() {
    let mut bal = Balance { value: 100 };
    increase(&mut bal, 50);
    assert_eq!(bal.value, 150);
    decrease(&mut bal, 30);
    assert_eq!(bal.value, 120);
}
```

## 小结

结构体是 Move 类型系统的核心。本节核心要点：

- 使用 `struct` 关键字定义自定义类型，字段可以是任何合法类型（不支持递归）
- 结构体类型默认私有，`public struct` 使类型可见，但 **字段始终私有**
- 创建实例需要提供所有字段值，支持变量名与字段名相同时的简写语法
- 字段访问（`.`运算符）仅限于定义该结构体的模块内部
- 解构（unpacking）可以提取字段值，不需要的字段用 `_` 忽略
- 没有能力的结构体不能被丢弃，必须显式解构——这是 Move 资源安全性的基石


---


<!-- source: 05_move_basics/abilities-introduction.md -->
## 5.12 Abilities 概述

# 能力系统概览（Abilities）

能力系统（Abilities）是 Move 语言最独特的类型系统特性之一，它通过四种能力——`copy`、`drop`、`key`、`store`——来精确控制类型的行为。不同于大多数编程语言中类型可以被随意复制和丢弃，Move 要求开发者显式声明类型的行为权限，从而在编译期保障链上资源的安全性。

## 能力声明

能力通过 `has` 关键字声明在结构体定义中：

```move
module book::ability_syntax;

// 同时拥有多个能力，用逗号分隔
public struct Token has key, store {
    id: UID,
    value: u64,
}

// 没有任何能力的结构体
public struct Unique {
    value: u64,
}
```

## 四种能力详解

### copy —— 可复制

拥有 `copy` 能力的类型，其值可以被隐式复制。没有 `copy` 的值在赋值或传参时会被 **移动**（move），原变量将不可再使用：

```move
module book::ability_copy;

public struct Copyable has copy, drop {
    value: u64,
}

public struct NonCopyable has drop {
    value: u64,
}

#[test]
fun copy_vs_move() {
    let a = Copyable { value: 42 };
    let b = a;  // 复制，a 仍然可用
    assert_eq!(a.value, 42);
    assert_eq!(b.value, 42);

    let c = NonCopyable { value: 100 };
    let d = c;  // 移动，c 不再可用
    // assert!(c.value == 100); // 编译错误！c 已被移动
    assert_eq!(d.value, 100);
}
```

### drop —— 可丢弃

拥有 `drop` 能力的类型，其值可以在离开作用域时被自动丢弃。没有 `drop` 的值必须被显式消费（解构或转移）：

```move
module book::ability_drop;

public struct Droppable has drop {
    value: u64,
}

public struct MustUse {
    value: u64,
}

public fun consume(item: MustUse) {
    let MustUse { value: _ } = item; // 必须显式解构
}
```

### key —— 可作为存储键

拥有 `key` 能力的类型可以作为链上对象存在。在 Sui 中，`key` 结构体的第一个字段必须是 `id: UID`：

```move
module book::ability_key;

public struct MyObject has key {
    id: UID,
    data: u64,
}
```

`key` 是将结构体变为 Sui 对象的必要条件。拥有 `key` 的对象可以被转移、共享或冻结。

### store —— 可存储

拥有 `store` 能力的类型可以被存储在其他拥有 `key` 的对象内部。`store` 也是对象能被公开转移（`public_transfer`）的必要条件：

```move
module book::ability_store;

use std::string::String;

public struct Metadata has store, copy, drop {
    name: String,
    version: u64,
}

public struct Container has key, store {
    id: UID,
    metadata: Metadata,  // Metadata 有 store，可以存在对象中
}
```

## 能力组合总览

| 能力组合 | 含义 | 典型用途 |
|----------|------|----------|
| 无能力 | 不可复制、不可丢弃、不可存储 | Hot Potato 模式 |
| `drop` | 可丢弃 | Witness 模式 |
| `copy, drop` | 可复制、可丢弃 | 纯数据/值类型 |
| `key` | 链上对象 | 不可转移的对象 |
| `key, store` | 可转移的链上对象 | NFT、代币等 |
| `store, copy, drop` | 可存储的值类型 | 嵌入对象的元数据 |
| `key, store, copy, drop` | 完全能力对象 | 较少见 |

## 内置类型的能力

所有原始类型天然拥有 `copy`、`drop` 和 `store`：

| 类型 | 能力 |
|------|------|
| `bool` | `copy`, `drop`, `store` |
| `u8` ~ `u256` | `copy`, `drop`, `store` |
| `address` | `copy`, `drop`, `store` |
| `&T`、`&mut T` | `copy`, `drop` |
| `vector<T>` | 取决于 `T` 的能力 |

## 完整示例

```move
module book::abilities_example;

// Has all four abilities - can be copied, dropped, stored as object
public struct FullAbility has key, store, copy, drop {
    id: UID,
    value: u64,
}

// Can be copied and dropped but not stored
public struct Copyable has copy, drop {
    value: u64,
}

// No abilities - Hot Potato! Must be explicitly consumed
public struct HotPotato {
    value: u64,
}

// Only drop - Witness pattern
public struct Witness has drop {}
```

## 能力约束与泛型

在泛型函数或泛型结构体中，可以对类型参数施加能力约束：

```move
module book::ability_constraints;

public struct Box<T: store> has key, store {
    id: UID,
    content: T,
}

public fun unbox<T: store>(box: Box<T>): T {
    let Box { id, content } = box;
    object::delete(id);
    content
}
```

`T: store` 意味着只有拥有 `store` 能力的类型才能放入 `Box` 中。这种约束在编译期就能捕获类型错误。

## 常见设计模式

### Hot Potato 模式

没有任何能力的结构体不能被复制、丢弃或存储，必须在创建它的交易中被显式消费。这个模式常用于强制执行某些操作序列：

```move
module book::hot_potato;

public struct FlashLoan {
    amount: u64,
}

public fun borrow(amount: u64): (u64, FlashLoan) {
    (amount, FlashLoan { amount })
}

public fun repay(loan: FlashLoan, payment: u64) {
    let FlashLoan { amount } = loan;
    assert!(payment >= amount);
}
```

### Witness 模式

只有 `drop` 能力的结构体，通常用于一次性类型证明（One-Time Witness）：

```move
module book::witness;

public struct WITNESS has drop {}
```

## 小结

能力系统是 Move 语言安全性的核心保障。本节核心要点：

- **四种能力**：`copy`（可复制）、`drop`（可丢弃）、`key`（可作为对象）、`store`（可存储）
- 能力通过 `has` 关键字在结构体定义中声明
- 所有原始类型拥有 `copy`、`drop`、`store`
- 没有能力的结构体（Hot Potato）必须被显式消费，确保操作不可跳过
- 只有 `drop` 的结构体（Witness）用于一次性类型证明
- 泛型中可以通过能力约束限制类型参数
- 能力系统在编译期强制执行资源安全规则，防止资产被意外复制或丢弃


---


<!-- source: 05_move_basics/ability-drop.md -->
## 5.13 drop 能力

# Drop 能力详解

`drop` 能力决定了结构体实例是否可以被自动丢弃（忽略）。当一个值离开作用域或被赋值覆盖时，如果该类型拥有 `drop` 能力，值会被自动清理；否则编译器会要求开发者显式处理该值。这一机制是 Move 保障数字资产安全的重要组成部分。

## 默认行为：不可丢弃

在 Move 中，结构体默认 **没有** `drop` 能力。这意味着编译器会跟踪每一个实例的生命周期，确保它不会被静默地丢弃：

```move
module book::no_drop;

public struct NoDrop {
    value: u64,
}

public fun create(): NoDrop {
    NoDrop { value: 42 }
}

// 如果函数中创建了 NoDrop 实例但没有处理，编译器会报错
// fun bad_example() {
//     let item = NoDrop { value: 42 };
//     // 编译错误：item 没有 drop 能力，不能被忽略
// }

public fun consume(item: NoDrop) {
    let NoDrop { value: _ } = item; // 必须显式解构
}
```

## 添加 drop 能力

通过 `has drop` 让结构体可以被自动丢弃：

```move
module book::with_drop;

public struct Droppable has drop {
    value: u64,
}

#[test]
fun auto_drop() {
    let _item = Droppable { value: 42 };
    // 函数结束时，_item 自动被丢弃，无需任何处理
}

#[test]
fun reassign_drops_old() {
    let mut x = Droppable { value: 1 };
    x = Droppable { value: 2 }; // 旧值自动被丢弃
    assert_eq!(x.value, 2);
}
```

## 完整示例

```move
module book::drop_example;

// Without drop - compilation error if ignored
public struct NoDrop {
    value: u64,
}

// With drop - can be safely ignored
public struct Droppable has drop {
    value: u64,
}

#[test]
fun drop_vs_no_drop() {
    // This works - Droppable is automatically dropped
    let _ = Droppable { value: 42 };

    // To use NoDrop, we must explicitly unpack it
    let no_drop = NoDrop { value: 100 };
    let NoDrop { value: _ } = no_drop; // must unpack
}
```

## 安全性价值

`drop` 的设计初衷是保护数字资产。考虑以下场景：

```move
module book::asset_safety;

public struct Coin {
    value: u64,
}

public fun mint(value: u64): Coin {
    Coin { value }
}

public fun burn(coin: Coin): u64 {
    let Coin { value } = coin;
    value
}
```

因为 `Coin` 没有 `drop` 能力，它不能被"凭空消失"。如果函数接收了一个 `Coin` 却没有处理它，编译器会立即报错。这确保了代币不会在转账或交易过程中意外丢失。

## 原生类型的 drop 能力

所有原生类型都拥有 `drop` 能力：

| 类型 | 拥有 drop |
|------|-----------|
| `bool` | ✅ |
| `u8`、`u16`、`u32`、`u64`、`u128`、`u256` | ✅ |
| `address` | ✅ |
| `vector<T>`（当 `T` 有 `drop` 时） | ✅ |

## 标准库中拥有 drop 的类型

以下常用标准库类型拥有 `drop` 能力：

| 类型 | 条件 |
|------|------|
| `Option<T>` | 当 `T` 有 `drop` 时 |
| `String` | 始终有 `drop` |
| `TypeName` | 始终有 `drop` |
| `VecSet<T>` | 当 `T` 有 `drop` 时 |
| `VecMap<K, V>` | 当 `K` 和 `V` 都有 `drop` 时 |

## Witness 模式

Witness（见证者）模式是 `drop` 能力最经典的应用之一。Witness 是一个 **只有 `drop` 能力** 的结构体，通常没有字段（或只有空字段），用于在类型层面进行身份证明：

```move
module book::witness_pattern;

public struct MY_TOKEN has drop {}

public fun create_currency(witness: MY_TOKEN) {
    let MY_TOKEN {} = witness;
    // 使用 witness 证明调用者有权创建此类型的货币
    // witness 被解构后自动丢弃
}
```

### One-Time Witness（OTW）

在 Sui 中，One-Time Witness 是一种特殊的 Witness，它只在模块初始化函数 `init` 中被创建一次，保证了某些操作（如代币发行）全局唯一：

```move
module book::otw_example;

public struct OTW_EXAMPLE has drop {}

fun init(witness: OTW_EXAMPLE) {
    // witness 由系统自动创建并传入，全局只有一次
    // 用于初始化代币、NFT 集合等需要唯一性保证的操作
    let OTW_EXAMPLE {} = witness;
}
```

OTW 的命名规则：类型名必须与模块名相同（全大写），且结构体只有 `drop` 能力、没有字段。

## 条件 drop

对于包含泛型字段的结构体，`drop` 能力取决于所有字段类型是否都拥有 `drop`：

```move
module book::conditional_drop;

public struct Wrapper<T: drop> has drop {
    inner: T,
}

public struct Container<T> {
    content: T,
}

// Wrapper<u64> 有 drop，因为 u64 有 drop
// Container<u64> 没有 drop，因为 Container 本身没有声明 drop
```

## 小结

`drop` 能力是 Move 资源安全模型的关键组成部分。本节核心要点：

- **默认不可丢弃**：结构体默认没有 `drop`，必须显式处理每一个实例
- **添加 `drop`**：通过 `has drop` 允许实例在离开作用域时自动清理
- **安全保障**：不可丢弃的类型确保数字资产不会意外消失
- **原生类型**：所有内置类型（bool、整数、address）天然拥有 `drop`
- **标准库**：`Option<T>`、`String` 等常用类型也拥有 `drop`（可能依赖于泛型参数）
- **Witness 模式**：只有 `drop` 能力的空结构体，用于类型级别的身份证明
- **OTW 模式**：Sui 特有的一次性见证者，保证操作的全局唯一性


---


<!-- source: 05_move_basics/ability-copy.md -->
## 5.14 copy 能力

# Copy 能力详解

`copy` 能力允许值被复制（Duplicate），是 Move 四大能力之一。没有 `copy` 能力的类型遵循 **移动语义**（Move Semantics），即值在赋值或传参后原变量将失效。理解 `copy` 能力对于掌握 Move 的所有权模型至关重要，它决定了值能否被安全地重复使用。

## 什么是 Copy

在 Move 中，默认情况下自定义结构体没有 `copy` 能力。当一个值被赋给另一个变量、传递给函数时，原始值会被 **移动**（move），此后不再可用。`copy` 能力改变了这一行为——拥有 `copy` 能力的类型在赋值和传参时会自动复制，原始值保持有效。

### 移动语义 vs 复制语义

没有 `copy` 的类型使用移动语义：

```move
module book::move_semantics;

public struct NoCopy { value: u64 }

#[test]
#[expected_failure]
fun move_invalid_use_after() {
    let a = NoCopy { value: 42 };
    let _b = a;     // a 被移动到 _b
    // let _c = a;  // 编译错误：a 已被移动，不再可用
}
```

拥有 `copy` 的类型使用复制语义：

```move
module book::copy_semantics;

public struct Copyable has copy, drop {
    value: u64,
}

#[test]
fun copy_both_valid() {
    let a = Copyable { value: 42 };
    let b = a;     // 隐式复制，a 仍然可用
    let c = a;     // 再次复制，a 依然可用
    assert_eq!(a.value, 42);
    assert_eq!(b.value, 42);
    assert_eq!(c.value, 42);
}
```

## 隐式复制与显式复制

### 隐式复制

当拥有 `copy` 能力的值被赋给新变量或传递给函数时，编译器会自动进行隐式复制：

```move
module book::implicit_copy;

public struct Point has copy, drop {
    x: u64,
    y: u64,
}

fun consume_point(_p: Point) {}

#[test]
fun implicit_copy() {
    let p = Point { x: 10, y: 20 };

    let q = p;           // 隐式复制
    consume_point(p);    // 隐式复制后传入函数

    assert_eq!(q.x, 10);  // q 是 p 的副本
}
```

### 显式复制

使用解引用运算符 `*&` 可以进行显式复制，这种写法更加清晰地表达了开发者的意图：

```move
module book::explicit_copy;

public struct Data has copy, drop {
    value: u64,
}

#[test]
fun explicit_copy() {
    let a = Data { value: 100 };
    let b = *&a;         // 显式复制：先取引用 &a，再解引用 *

    assert_eq!(a.value, 100);
    assert_eq!(b.value, 100);
}
```

`*&` 的语义是：先获取值的引用（`&a`），再通过解引用（`*`）创建一个副本。对于拥有 `copy` 能力的类型，这与隐式复制效果相同，但在代码审查中更容易识别复制操作。

## Copy 与 Drop 的关系

在实践中，拥有 `copy` 能力的类型几乎总是同时拥有 `drop` 能力。原因在于：如果一个值可以被复制但不能被丢弃，那么每次复制都会产生一个新值，而所有这些值都必须被显式消耗，这会导致代码极其繁琐且容易出错。

```move
module book::copy_drop;

public struct CopyDrop has copy, drop {
    value: u64,
}

#[test]
fun copy_drop_both_dropped() {
    let a = CopyDrop { value: 1 };
    let _b = a;     // 复制
    let _c = a;     // 再次复制
    // 函数结束时，a、_b、_c 都会自动 drop，无需手动处理
}
```

> **规则**：如果一个类型拥有 `copy`，通常也应该赋予 `drop`。Move 编译器不会强制要求这一点，但这是社区的最佳实践。

## 原始类型的 Copy 能力

Move 中所有原始类型天然拥有 `copy`（以及 `drop` 和 `store`）能力：

| 类型 | 拥有 copy | 说明 |
|------|----------|------|
| `bool` | ✅ | 布尔值 |
| `u8` ~ `u256` | ✅ | 所有整数类型 |
| `address` | ✅ | 地址类型 |
| `vector<T>` | 当 `T` 有 `copy` 时 | 泛型容器，能力取决于元素类型 |

```move
module book::primitive_copy;

#[test]
fun primitive_copy() {
    let x: u64 = 42;
    let y = x;          // 隐式复制
    let z = *&x;        // 显式复制
    assert_eq!(x, 42);
    assert_eq!(y, 42);
    assert_eq!(z, 42);

    let v1 = vector[1u64, 2, 3];
    let v2 = v1;         // vector<u64> 有 copy，因为 u64 有 copy
    assert_eq!(v1.length(), 3);
    assert_eq!(v2.length(), 3);
}
```

## 标准库中拥有 Copy 的类型

除了原始类型，标准库中也有一些常用类型拥有 `copy` 能力：

| 类型 | 模块路径 | 说明 |
|------|---------|------|
| `Option<T>` | `std::option` | 当 `T` 有 `copy` 时，`Option<T>` 也有 `copy` |
| `String` | `std::string` | UTF-8 字符串（底层是 `vector<u8>`） |
| `AsciiString` | `std::ascii` | ASCII 字符串 |
| `TypeName` | `std::type_name` | 运行时类型名称 |

```move
module book::stdlib_copy;

use std::string::String;

#[test]
fun stdlib_copy() {
    let name: String = b"Sui".to_string();
    let name_copy = name;           // String 有 copy，可以复制
    assert!(name == name_copy);

    let maybe: Option<u64> = option::some(42);
    let maybe_copy = maybe;         // Option<u64> 有 copy
    assert!(maybe.is_some());
    assert!(maybe_copy.is_some());
}
```

## 结构体字段的约束

当一个结构体声明为 `has copy` 时，它的 **所有字段** 的类型都必须拥有 `copy` 能力。如果任何字段的类型不支持 `copy`，编译器会报错：

```move
module book::copy_fields;

public struct Inner has copy, drop {
    value: u64,
}

public struct Outer has copy, drop {
    inner: Inner,       // Inner 有 copy，合法
    count: u64,         // u64 有 copy，合法
}

// 以下代码无法编译：
// public struct Bad has copy, drop {
//     id: UID,          // UID 没有 copy，编译错误
// }
```

这一规则确保了 `copy` 操作可以递归地复制结构体的每一个字段。

## 完整示例

下面的例子综合展示了 `copy` 能力在实际开发中的使用场景：

```move
module book::copy_example;

use std::string::String;

public struct Config has copy, drop, store {
    name: String,
    max_retries: u64,
    enabled: bool,
}

public fun default_config(): Config {
    Config {
        name: b"default".to_string(),
        max_retries: 3,
        enabled: true,
    }
}

public fun with_name(config: &Config, name: String): Config {
    let mut new_config = *config;    // 显式复制配置
    new_config.name = name;
    new_config
}

#[test]
fun config_copy() {
    let base = default_config();
    let custom = with_name(&base, b"custom".to_string());

    // base 未被移动，仍然可用
    assert_eq!(base.name, b"default".to_string());
    assert_eq!(custom.name, b"custom".to_string());
    assert_eq!(base.max_retries, custom.max_retries);
}
```

## 小结

`copy` 能力控制了值是否可以被复制。本节核心要点：

- **移动 vs 复制**：没有 `copy` 的类型遵循移动语义，赋值后原变量失效；有 `copy` 则自动复制
- **隐式复制**：赋值和传参时自动发生
- **显式复制**：使用 `*&value` 语法，意图更清晰
- **Copy + Drop**：拥有 `copy` 的类型通常也应该拥有 `drop`
- **原始类型**：`bool`、所有整数类型、`address` 天然拥有 `copy`
- **字段约束**：结构体声明 `copy` 时，所有字段类型必须也拥有 `copy`
- **标准库**：`String`、`Option<T>`、`TypeName` 等常用类型拥有 `copy`


---


<!-- source: 05_move_basics/constants.md -->
## 5.15 常量

# 常量

常量（Constants）是使用 `const` 关键字定义的模块级不可变值。常量在编译时确定，存储在字节码中，每次使用时会被复制到使用位置。它们用于定义配置值、限制条件、错误码等在整个模块中共用的固定值。合理使用常量可以避免代码中出现难以理解的"魔术数字"，提升代码的可读性和可维护性。

## 基本语法

### 常量声明

常量使用 `const` 关键字声明，必须指定类型和初始值：

```move
module book::const_basic;

const MAX_SUPPLY: u64 = 1_000_000;
const DEFAULT_PRICE: u64 = 100;
const IS_TESTNET: bool = true;
const ADMIN_ADDRESS: address = @0x1;
const APP_NAME: vector<u8> = b"MyApp";
```

### 名称约束

常量名称 **必须以大写字母开头**，这是编译器强制要求的规则。

社区约定使用两种命名风格：

- **ALL_CAPS_WITH_UNDERSCORES** — 用于普通常量值
- **EPascalCase** — 用于错误码常量（E 前缀 + 大驼峰）

```move
module book::const_naming;

// 普通常量：全大写 + 下划线分隔
const MAX_RETRIES: u64 = 3;
const DEFAULT_TIMEOUT: u64 = 5000;
const BASE_URL: vector<u8> = b"https://api.sui.io";

// 错误码常量：E 前缀 + 驼峰命名
const ENotAuthorized: u64 = 0;
const EInsufficientBalance: u64 = 1;
const EItemNotFound: u64 = 2;
const EExceedsMaxSupply: u64 = 3;
```

## 支持的类型

常量只能使用以下类型：

| 类型 | 示例 |
|------|------|
| `bool` | `const FLAG: bool = true;` |
| `u8` ~ `u256` | `const MAX: u64 = 100;` |
| `address` | `const ADDR: address = @0x1;` |
| `vector<u8>` | `const NAME: vector<u8> = b"hello";` |

> **注意**：常量不支持自定义结构体类型、`String`、`Option` 等复杂类型。如需使用这些类型的常量值，应通过函数封装。

```move
module book::const_types;

const BOOL_CONST: bool = false;
const U8_CONST: u8 = 255;
const U64_CONST: u64 = 1_000_000;
const U128_CONST: u128 = 1_000_000_000_000;
const U256_CONST: u256 = 0;
const ADDR_CONST: address = @0xCAFE;
const BYTES_CONST: vector<u8> = b"Hello, Move!";
```

## 常量是模块私有的

常量只能在定义它们的模块内部使用，无法被其他模块直接访问。这是 Move 的设计决策——如果需要将常量值暴露给外部模块，应通过公开函数（getter）来实现。

### 配置模式

```move
module book::const_config;

const MAX_SUPPLY: u64 = 1_000_000;
const DEFAULT_PRICE: u64 = 100;
const MIN_STAKE: u64 = 1_000;

// 通过公开函数暴露常量值
public fun max_supply(): u64 { MAX_SUPPLY }
public fun default_price(): u64 { DEFAULT_PRICE }
public fun min_stake(): u64 { MIN_STAKE }

#[test]
fun config_getters() {
    assert_eq!(max_supply(), 1_000_000);
    assert_eq!(default_price(), 100);
    assert_eq!(min_stake(), 1_000);
}
```

这种模式在智能合约开发中非常常见，它将常量值的访问控制权保留在定义模块中，同时允许外部读取。

## 错误码常量

在 Move 中，`assert!` 宏的第二个参数是一个错误码。使用常量定义错误码比直接使用数字更具可读性：

```move
module book::const_errors;

const ENotOwner: u64 = 0;
const EInsufficientFunds: u64 = 1;
const EAlreadyInitialized: u64 = 2;
const EInvalidAmount: u64 = 3;

public struct Wallet has drop {
    owner: address,
    balance: u64,
}

public fun withdraw(wallet: &mut Wallet, amount: u64, caller: address): u64 {
    assert!(caller == wallet.owner, ENotOwner);
    assert!(amount > 0, EInvalidAmount);
    assert!(wallet.balance >= amount, EInsufficientFunds);

    wallet.balance = wallet.balance - amount;
    amount
}

#[test]
fun withdraw_ok() {
    let mut wallet = Wallet { owner: @0x1, balance: 1000 };
    let amount = withdraw(&mut wallet, 100, @0x1);
    assert_eq!(amount, 100);
    assert_eq!(wallet.balance, 900);
}

#[test]
#[expected_failure(abort_code = ENotOwner)]
fun not_owner() {
    let mut wallet = Wallet { owner: @0x1, balance: 1000 };
    withdraw(&mut wallet, 100, @0x2); // 非 owner 调用，触发 abort
}
```

### 错误码命名建议

| 前缀 | 含义 | 示例 |
|------|------|------|
| `ENotX` | 条件不满足 | `ENotOwner`、`ENotAuthorized` |
| `EInsufficientX` | 数量不足 | `EInsufficientBalance`、`EInsufficientFunds` |
| `EInvalidX` | 输入无效 | `EInvalidAmount`、`EInvalidAddress` |
| `EAlreadyX` | 重复操作 | `EAlreadyInitialized`、`EAlreadyExists` |
| `EExceedsX` | 超出限制 | `EExceedsMaxSupply`、`EExceedsLimit` |

## 常量的存储方式

常量存储在编译后的字节码中，每次使用时会被 **复制** 到使用位置。这意味着：

- 常量不占用链上存储空间（不是对象）
- 每次引用常量都是一次值复制
- 对于大型 `vector<u8>` 常量，频繁使用可能增加字节码大小

```move
module book::const_storage;

const LARGE_BYTES: vector<u8> = b"This is a relatively long constant string value";

#[test]
fun constant_copy() {
    let a = LARGE_BYTES;
    let b = LARGE_BYTES;   // 独立的副本

    assert!(a == b);
    assert_eq!(a.length(), b.length());
}
```

## 不可变性

常量是真正不可变的——一旦定义，无法在运行时修改。任何试图对常量赋值的操作都会导致编译错误：

```move
module book::const_immutable;

const VALUE: u64 = 42;

public fun value(): u64 {
    // VALUE = 100;  // 编译错误：无法对常量赋值
    VALUE
}
```

如果需要可修改的全局状态，应使用链上对象（Object）来存储。

## 完整示例

```move
module book::constants_example;

const MAX_SUPPLY: u64 = 1_000_000;
const DEFAULT_PRICE: u64 = 100;
const ADMIN_ADDRESS: address = @0x1;
const APP_NAME: vector<u8> = b"MyApp";

const ENotAuthorized: u64 = 0;
const EInsufficientBalance: u64 = 1;

public fun max_supply(): u64 { MAX_SUPPLY }
public fun default_price(): u64 { DEFAULT_PRICE }

public fun check_authorized(addr: address) {
    assert!(addr == ADMIN_ADDRESS, ENotAuthorized);
}

#[test]
fun constants_example() {
    assert_eq!(max_supply(), 1_000_000);
    assert_eq!(default_price(), 100);
    check_authorized(@0x1);
}

#[test]
#[expected_failure(abort_code = ENotAuthorized)]
fun unauthorized() {
    check_authorized(@0x99);
}
```

## 小结

常量是 Move 模块中不可变的固定值。本节核心要点：

- **声明语法**：`const NAME: Type = value;`，名称必须大写字母开头
- **命名规范**：普通常量用 `ALL_CAPS`，错误码用 `EPascalCase`
- **支持的类型**：`bool`、整数类型、`address`、`vector<u8>`
- **模块私有**：常量只在定义模块内可见，通过公开函数暴露给外部
- **配置模式**：使用 `public fun xxx(): Type { CONSTANT }` 暴露常量值
- **错误码**：使用 `E` 前缀命名，配合 `assert!` 进行条件检查
- **存储方式**：编译时嵌入字节码，每次使用时复制
- **不可变性**：定义后无法修改，需要可变状态请使用链上对象


---


<!-- source: 05_move_basics/conditionals.md -->
## 5.16 条件分支（if / else）

# 条件分支（if / else）

Move 使用 `if/else` 实现条件分支。与许多语言不同，Move 中的 `if/else` 是 **表达式**，可以返回值，两个分支的返回类型必须一致。

## 基本语法

`if` 表达式根据布尔条件选择执行路径：

```move
module book::if_basic;

public fun is_positive(n: u64): bool {
    if (n > 0) {
        true
    } else {
        false
    }
}

#[test]
fun if_positive() {
    assert!(is_positive(10));
    assert!(!is_positive(0));
}
```

## 作为表达式使用

`if/else` 可以返回值，此时两个分支的返回类型必须一致：

```move
module book::if_expression;

public fun abs_diff(a: u64, b: u64): u64 {
    if (a > b) { a - b } else { b - a }
}

public fun max(a: u64, b: u64): u64 {
    if (a >= b) { a } else { b }
}

public fun describe(n: u64): vector<u8> {
    if (n == 0) {
        b"zero"
    } else if (n < 10) {
        b"small"
    } else if (n < 100) {
        b"medium"
    } else {
        b"large"
    }
}

#[test]
fun expression_if() {
    assert_eq!(abs_diff(10, 3), 7);
    assert_eq!(max(5, 8), 8);
    assert_eq!(describe(0), b"zero");
    assert_eq!(describe(5), b"small");
    assert_eq!(describe(50), b"medium");
    assert_eq!(describe(200), b"large");
}
```

## 无 else 分支

当 `if` 不作为表达式使用时（即不返回值），可以省略 `else` 分支：

```move
module book::if_no_else;

#[test]
fun no_else() {
    let mut result = 0u64;
    let condition = true;

    if (condition) {
        result = 42;
    };

    assert_eq!(result, 42);
}
```

## 小结

- **if/else**：条件分支，可作为表达式返回值
- **分支类型**：作为表达式时，两个分支的返回类型必须一致
- **无 else**：不返回值时可以省略 `else`


---


<!-- source: 05_move_basics/loops-and-labels.md -->
## 5.17 循环与带标签控制流

# 循环与带标签控制流

Move 支持 `while` 条件循环、`loop` 无限循环，以及 `break`、`continue`、`return` 等流程控制。在嵌套循环或块中，可以使用 **标签** 精确指定跳转目标。

## while 循环

`while` 在条件为 `true` 时重复执行循环体：

```move
module book::while_loop;

public fun sum_to_n(n: u64): u64 {
    let mut i = 0u64;
    let mut sum = 0u64;
    while (i <= n) {
        sum = sum + i;
        i = i + 1;
    };
    sum
}

#[test]
fun while_sum() {
    assert_eq!(sum_to_n(10), 55);
}
```

> **注意**：`while` 循环的尾部需要加分号 `;`，因为循环本身是一条语句。

## loop 无限循环

`loop` 创建一个无限循环，必须通过 `break` 或 `return` 退出。配合 `break` 可以返回值，作为表达式使用：

```move
module book::loop_example;

public fun find_first_divisible(v: &vector<u64>, divisor: u64): Option<u64> {
    let mut i = 0;
    loop {
        if (i >= v.length()) {
            break option::none()
        };
        if (v[i] % divisor == 0) {
            break option::some(v[i])
        };
        i = i + 1;
    }
}
```

## break 和 continue

`break` 提前退出循环，可携带返回值；`continue` 跳过当前迭代的剩余部分：

```move
module book::break_continue;

#[test]
fun break_early() {
    let mut sum = 0u64;
    let mut i = 0;
    while (i < 100) {
        if (sum > 50) break;
        sum = sum + i;
        i = i + 1;
    };
}

#[test]
fun continue_even_sum() {
    let mut sum = 0u64;
    let mut i = 0;
    while (i < 10) {
        i = i + 1;
        if (i % 2 != 0) continue;
        sum = sum + i;
    };
    assert_eq!(sum, 30); // 2 + 4 + 6 + 8 + 10
}
```

## return — 提前返回

`return` 可以在函数中任意位置提前返回值：

```move
module book::return_example;

public fun find_first_even(v: &vector<u64>): Option<u64> {
    let mut i = 0;
    while (i < v.length()) {
        if (v[i] % 2 == 0) {
            return option::some(v[i])
        };
        i = i + 1;
    };
    option::none()
}
```

## Gas 消耗与无限循环

在区块链环境中，每条指令都会消耗 Gas。循环必须有明确的退出条件，避免无限循环导致 Gas 耗尽。

## 带标签的控制流

在嵌套循环或块中，可以用 **标签** 精确指定 `break`、`continue` 或 `return` 的目标，格式为 `'label:`。

### 循环标签

给 `loop` 或 `while` 加上标签后，`break 'label value` 会直接跳出到该标签对应的循环并携带返回值；`continue 'label` 会跳到该循环的下一次迭代：

```move
module book::labeled_loop;

public fun sum_until_threshold(input: &vector<vector<u64>>, threshold: u64): u64 {
    let mut sum = 0u64;
    let mut i = 0u64;
    let len = input.length();

    'outer: loop {
        if (i >= len) break sum;
        let vec = &input[i];
        let mut j = 0u64;
        while (j < vec.length()) {
            let v_entry = vec[j];
            if (sum + v_entry < threshold) {
                sum = sum + v_entry;
            } else {
                break 'outer sum
            };
            j = j + 1;
        };
        i = i + 1;
    }
}
```

### 块标签与 return

给**块**加标签后，可以在块内使用 `return 'label value` 从该块“返回”一个值，作为整个块表达式的值。`return` 只能用于块标签；`break`/`continue` 只能用于循环标签。

## 小结

- **while**：条件循环，尾部需加分号
- **loop**：无限循环，必须通过 `break` 或 `return` 退出；`break` 可携带返回值
- **break / continue / return**：控制流程
- **标签**：`'label:` 用于循环或块，精确指定跳转目标
- **Gas 安全**：循环必须有明确退出条件


---


<!-- source: 05_move_basics/assert-and-abort.md -->
## 5.18 断言与中止（assert / abort）

# 断言与中止

Move 语言中的错误处理机制与大多数编程语言截然不同：它没有 `try/catch` 异常捕获机制。当出现错误时，交易要么完全成功，要么通过中止（abort）回滚所有状态变更。`abort` 用于立即中止执行，`assert!` 宏则提供了一种便捷的条件检查方式——当条件不满足时自动中止。

## abort 关键字

### 基本用法

`abort` 是 Move 的关键字，用于立即停止当前交易的执行。它接受一个 `u64` 类型的错误码作为参数：

```move
module book::abort_basic;

const ENotAllowed: u64 = 0;

public fun only_positive(value: u64): u64 {
    if (value == 0) {
        abort ENotAllowed
    };
    value
}

#[test, expected_failure(abort_code = ENotAllowed)]
fun abort_on_zero() {
    only_positive(0);
}
```

当 `abort` 被触发时，当前交易的所有状态变更都会被撤销，链上不会留下任何修改痕迹，但消耗的 gas 费不会退还。

### abort 的语法形式

`abort` 可以作为表达式使用。由于它永远不会返回值，可以用在任何需要表达式的地方：

```move
module book::abort_expr;

const EInvalidChoice: u64 = 0;

public fun describe(choice: u8): vector<u8> {
    if (choice == 1) {
        b"Option A"
    } else if (choice == 2) {
        b"Option B"
    } else {
        abort EInvalidChoice
    }
}

#[test]
fun describe_ok() {
    assert_eq!(describe(1), b"Option A");
    assert_eq!(describe(2), b"Option B");
}
```

## assert! 宏

### 基本用法

`assert!` 是一个内置宏，它检查一个布尔条件，如果条件为 `false`，则以给定的错误码中止执行：

```move
module book::assert_basic;

const ENotAuthorized: u64 = 0;
const EInvalidAmount: u64 = 1;

public fun transfer_tokens(
    sender: address,
    admin: address,
    amount: u64,
) {
    assert!(sender == admin, ENotAuthorized);
    assert!(amount > 0, EInvalidAmount);
    // 主要逻辑在这里...
}

#[test]
fun valid_transfer() {
    transfer_tokens(@0x1, @0x1, 100);
}

#[test, expected_failure(abort_code = ENotAuthorized)]
fun not_authorized() {
    transfer_tokens(@0x1, @0x2, 100);
}

#[test, expected_failure(abort_code = EInvalidAmount)]
fun invalid_amount() {
    transfer_tokens(@0x1, @0x1, 0);
}
```

`assert!` 本质上是 `if (!condition) abort code` 的语法糖，让代码更加简洁易读。

### 单参数 assert!

在测试中，`assert!` 可以只传一个参数，省略错误码。此时如果条件为 `false`，将以默认错误码中止：

```move
module book::assert_single;

#[test]
fun assert_single_arg() {
    let x = 42;
    assert!(x == 42);       // 仅检查条件，无自定义错误码
    assert!(x > 0);
    assert!(x != 100);
}
```

## 错误常量约定

### 命名规范

Move 社区约定使用 `E` 前缀加大驼峰命名法（EPascalCase）来定义错误常量，类型统一为 `u64`：

```move
module book::error_conventions;

const ENotOwner: u64 = 0;
const EInsufficientBalance: u64 = 1;
const EItemNotFound: u64 = 2;
const EAlreadyExists: u64 = 3;
const EExpired: u64 = 4;

public fun check_owner(caller: address, owner: address) {
    assert!(caller == owner, ENotOwner);
}

public fun check_balance(balance: u64, required: u64) {
    assert!(balance >= required, EInsufficientBalance);
}
```

每个模块内的错误码通常从 0 开始递增，确保每个错误码在模块内是唯一的。

### Move 2024 #[error] 属性

Move 2024 引入了 `#[error]` 属性，允许错误常量使用 `vector<u8>` 类型来提供人类可读的错误信息：

```move
module book::error_attribute;

#[error]
const ECustomNotFound: vector<u8> = b"The requested item was not found";

#[error]
const EInvalidInput: vector<u8> = b"Input validation failed: value out of range";

public fun find_item(id: u64): u64 {
    if (id == 0) {
        abort ECustomNotFound
    };
    id
}

public fun validate(value: u64) {
    assert!(value <= 1000, EInvalidInput);
}

#[test, expected_failure(abort_code = ECustomNotFound)]
fun not_found() {
    find_item(0);
}
```

使用 `#[error]` 属性后，当交易失败时，Sui CLI 与 GraphQL 等工具会将 abort 码解码为可读信息（如 `Error from '0x...::module::fun' (line N), abort 'EConstName': "message"`）。**不写错误码**的 `assert!(cond)` 或 `abort` 也会自动从源码行号派生一个“clever error”码，便于定位；但若需稳定错误码（如测试中按码断言），应使用具名错误常量。

### Clever Errors 的编码与解码

带 `#[error]` 的常量在运行时会被编码为一个 `u64` 的 clever 码，其高位包含：**标记位**（表示是 clever 码）、**中止发生的行号**、**常量名在模块标识表中的索引**、**常量值在模块常量表中的索引**。例如某次中止得到的十六进制码可能形如 `0x8000_0007_0001_0000`，解码后可得到行号、常量名（如 `EIsThree`）和常量值（如 `b"The value is three"`），工具会渲染为类似：

`Error from '0x...::module::fun' (line 7), abort 'EIsThree': "The value is three"`

**未提供错误码**的 `assert!(cond)` 或 `abort` 也会生成 clever 码，其中“常量名索引”和“常量值索引”用哨兵值 `0xffff` 填充，仅行号有效，便于在源码中定位。  
**宏**中的 `assert!`/`abort` 的行号取**宏调用处**，而不是宏定义内部，这样错误信息会指向调用方代码。

如需从 `u64` 手工解码 clever 码，可参考 Sui 文档或 CLI/GraphQL 的解码流程；日常开发中直接依赖 Sui CLI 与 GraphQL 的自动解码即可。

## 错误处理的最佳实践

### 前置断言模式

最佳实践是将所有的断言检查放在函数主逻辑之前，这样可以在执行任何状态变更前就发现问题，即"先验证，后执行"：

```move
module book::abort_example;

const ENotAuthorized: u64 = 0;
const EInvalidAmount: u64 = 1;
const EInsufficientBalance: u64 = 2;

#[error]
const ECustomError: vector<u8> = b"This is a custom error message";

public fun transfer_tokens(
    sender: address,
    admin: address,
    amount: u64,
) {
    // 所有断言在前
    assert!(sender == admin, ENotAuthorized);
    assert!(amount > 0, EInvalidAmount);
    // 主要逻辑在后...
}

public fun must_be_positive(value: u64): u64 {
    if (value == 0) {
        abort EInvalidAmount
    };
    value
}

#[test]
fun assert_ok() {
    let result = must_be_positive(42);
    assert_eq!(result, 42);
}

#[test, expected_failure(abort_code = EInvalidAmount)]
fun abort_zero() {
    must_be_positive(0);
}
```

### 交易的原子性

由于 Move 没有 `try/catch` 机制，整个交易是原子性的：

- **全部成功**：所有操作都执行完毕，状态变更生效
- **全部回滚**：只要有一个 `abort` 被触发，所有状态变更都被撤销

这种设计简化了安全模型——开发者不需要担心部分执行导致的不一致状态：

```move
module book::atomic_example;

const EStepOneFailed: u64 = 0;
const EStepTwoFailed: u64 = 1;

public fun multi_step_operation(a: u64, b: u64) {
    // 步骤一
    assert!(a > 0, EStepOneFailed);

    // 步骤二
    assert!(b > a, EStepTwoFailed);

    // 如果执行到这里，说明所有检查都通过了
    // 实际操作逻辑...
}

#[test]
fun success() {
    multi_step_operation(5, 10);
}

#[test, expected_failure(abort_code = EStepTwoFailed)]
fun step_two_fails() {
    // 即使步骤一通过了，步骤二失败也会回滚所有变更
    multi_step_operation(5, 3);
}
```

## 小结

Move 的错误处理机制简洁而强大。`abort` 立即中止执行并回滚所有状态变更，`assert!` 宏提供了简洁的条件检查语法。错误常量使用 `E` 前缀的驼峰命名，Move 2024 还引入了 `#[error]` 属性支持可读的错误信息。由于没有 `try/catch` 机制，交易具有完全的原子性——要么全部成功，要么全部回滚。最佳实践是将断言检查放在函数主逻辑之前，确保"先验证，后执行"。


---


<!-- source: 05_move_basics/function-basics.md -->
## 5.19 函数定义与调用

# 函数定义与调用

函数是 Move 程序的基本构建单元，使用 `fun` 关键字声明。函数体最后一个不带分号的表达式即为返回值；支持通过元组返回多值并用解构接收。

## 基本语法

函数遵循蛇形命名法（snake_case）。每个参数都必须显式标注类型：

```move
module book::function_basic;

fun add(a: u64, b: u64): u64 {
    a + b  // 最后一个表达式作为返回值，不加分号
}

#[test]
fun add_returns_sum() {
    assert_eq!(add(2, 3), 5);
}
```

## 无返回值与 Unit

如果函数不需要返回值，返回类型可以省略，默认返回空元组 `()`（unit 类型）：

```move
module book::function_unit;

public fun do_nothing() {
    // 隐式返回 ()
}

public fun explicit_unit(): () {
    ()
}
```

## 参数与类型标注

Move 是强类型语言，函数签名中的参数类型必须显式标注，不能依赖推导：

```move
module book::function_params;

use std::string::String;

public fun greet(name: String, times: u64): String {
    let _ = times;
    name
}
```

## 单一返回值与 return

函数体中最后一个不带分号的表达式就是返回值；也可以使用 `return` 提前返回：

```move
module book::function_return;

public fun max(a: u64, b: u64): u64 {
    if (a > b) {
        return a
    };
    b
}
```

## 多返回值（元组）

Move 支持通过元组返回多个值，调用方使用解构接收：

```move
module book::function_tuple;

public fun swap(a: u64, b: u64): (u64, u64) {
    (b, a)
}

public fun min_max(a: u64, b: u64): (u64, u64) {
    if (a < b) { (a, b) } else { (b, a) }
}

#[test]
fun swap_returns_reversed() {
    let (x, y) = swap(1, 2);
    assert_eq!(x, 2);
    assert_eq!(y, 1);
}
```

## 忽略返回值

使用 `_` 可以忽略不需要的返回值：

```move
#[test]
fun ignore_return() {
    let (value, _) = get_pair();
    let (_, flag) = get_pair();
}
```

## 小结

- **声明**：`fun` 关键字，蛇形命名，参数必须显式类型
- **返回值**：最后表达式或 `return`；支持元组多返回值与解构
- **Unit**：无返回值时隐式返回 `()`


---


<!-- source: 05_move_basics/entry-and-public.md -->
## 5.20 entry 与 public 函数

# entry 与 public 函数

Move 函数有多种可见性级别，控制可被谁调用。**入口函数（entry）** 是 Sui 交易的直接入口，可从客户端发起；**公共函数（public）** 可被任意模块调用。

## 四种可见性

| 修饰符 | 可调用范围 |
|--------|------------|
| （无 / 私有） | 仅本模块内部 |
| `public` | 任意模块 |
| `public(package)` | 同一包内模块 |
| `entry` | 仅可从交易直接调用，不可被其他 Move 模块调用 |

```move
module book::function_example;

// 私有函数 — 仅模块内部
fun add(a: u64, b: u64): u64 {
    a + b
}

// 公共函数 — 任何模块都可调用
public fun multiply(a: u64, b: u64): u64 {
    a * b
}

// 包内可见
public(package) fun internal_multiply(a: u64, b: u64): u64 {
    a * b
}
```

## entry 函数

`entry` 函数是 Sui 交易的入口点，可以直接从客户端发起的交易中被调用，但不能从其他 Move 模块中调用。参数类型通常限于基础类型、对象和 `&mut TxContext`：

```move
module book::entry_example;

public struct Counter has key {
    id: UID,
    value: u64,
}

entry fun create_counter(ctx: &mut TxContext) {
    let counter = Counter {
        id: object::new(ctx),
        value: 0,
    };
    transfer::transfer(counter, ctx.sender());
}

entry fun increment(counter: &mut Counter) {
    counter.value = counter.value + 1;
}
```

## 调用其他模块的函数

通过 `模块名::函数名()` 调用其他模块的公共函数，需先用 `use` 导入：

```move
module book::caller_example;

use book::function_example;

fun call_public() {
    let result = function_example::multiply(3, 4);
    assert!(result == 12);
}
```

## 小结

- **可见性**：私有、`public`、`public(package)`、`entry`
- **entry**：交易入口，仅可从交易调用，不能从其他模块调用
- **调用方式**：`模块名::函数名()`，需先 `use` 导入


---


<!-- source: 05_move_basics/visibility.md -->
## 5.21 可见性修饰符

# 可见性修饰符

可见性修饰符控制模块成员（函数、结构体等）的访问范围，是 Move 模块化设计的核心机制。Move 提供四种可见性级别：私有（private）、公共（public）、包内可见（public(package)）和入口（entry），每种级别对应不同的访问权限和使用场景。合理使用可见性可以实现良好的封装，保护模块的内部实现细节。

## 私有可见性（private）

### 默认访问级别

不添加任何修饰符的函数默认是私有的，只能在定义它的模块内部调用：

```move
module book::private_example;

// 私有函数 —— 只有本模块内部可以调用
fun internal_helper(): u64 {
    42
}

fun another_helper(): u64 {
    // 同一模块内，可以调用私有函数
    internal_helper() + 8
}

#[test]
fun private_only_in_module() {
    assert_eq!(internal_helper(), 42);
    assert_eq!(another_helper(), 50);
}
```

私有函数是模块封装的基础。将实现细节隐藏在私有函数中，只暴露必要的公共接口，是良好 API 设计的关键。

## 公共可见性（public）

### 对外开放的接口

使用 `public` 修饰的函数可以被任何模块调用，是模块对外暴露的 API：

```move
module book::public_example;

const EInvalid: u64 = 0;

// 公共函数 —— 任何模块都可以调用
public fun calculate(a: u64, b: u64): u64 {
    validate(a, b);
    a + b
}

// 内部验证逻辑保持私有
fun validate(a: u64, b: u64) {
    assert!(a > 0 && b > 0, EInvalid);
}

#[test]
fun public_calculate() {
    assert_eq!(calculate(3, 7), 10);
}
```

需要注意：**一旦函数被标记为 `public`，它就成为模块的公共 API。在包升级时，不能删除或更改已有的 `public` 函数签名**，否则会破坏依赖它的外部模块。

## 包内可见性（public(package)）

### 包级别的共享

`public(package)` 允许同一个包（package）内的所有模块调用该函数，但包外的模块无法访问。它取代了早期版本中的 `friend` 机制：

```move
module book::package_example;

// 包内可见 —— 同一个包的模块可以调用，外部包不行
public(package) fun package_helper(): u64 {
    100
}

// 公共函数调用包内函数
public fun public_api(): u64 {
    package_helper() * 2
}

#[test]
fun package_visibility() {
    assert_eq!(package_helper(), 100);
    assert_eq!(public_api(), 200);
}
```

`public(package)` 非常适合用于包内多个模块之间的协作函数，这些函数需要被包内其他模块使用，但不应该暴露给外部。

## 入口可见性（entry）

### 交易的入口点

`entry` 函数可以直接从 Sui 交易中被调用，但**不能**从其他 Move 模块调用。它是连接链下客户端和链上逻辑的桥梁：

```move
module book::entry_example;

public struct Greeting has key {
    id: UID,
    text: vector<u8>,
}

// 入口函数 —— 只能从交易调用，不能被其他模块调用
entry fun create_greeting(text: vector<u8>, ctx: &mut TxContext) {
    let greeting = Greeting {
        id: object::new(ctx),
        text,
    };
    transfer::transfer(greeting, ctx.sender());
}

// entry 函数作为交易入口，不可被其他模块调用，也不返回值（与 public 二选一，不要写 public entry）
entry fun update_greeting(greeting: &mut Greeting, text: vector<u8>) {
    greeting.text = text;
}
```

## 可见性对比示例

### 完整的可见性示例

将所有可见性级别放在一个模块中对比：

```move
module book::visibility_example;

// 私有 —— 仅本模块可调用
fun internal_helper(): u64 { 42 }

// 公共 —— 任何模块都可调用
public fun public_api(): u64 { internal_helper() }

// 包内可见 —— 同一包的模块可调用
public(package) fun package_helper(): u64 { 100 }

// 入口 —— 仅从交易调用
entry fun do_something(ctx: &mut TxContext) {
    let _ = ctx;
}
```

### 从其他模块调用

下面展示在同一包的另一个模块中，哪些函数可以调用，哪些不行：

```move
module book::try_access;

use book::visibility_example;

fun test() {
    visibility_example::public_api();      // OK —— 公共函数
    visibility_example::package_helper();   // OK —— 同一包内
    // visibility_example::internal_helper(); // 错误！私有函数不可调用
    // visibility_example::do_something();    // 错误！entry 函数不能被模块调用
}
```

## 结构体字段的可见性

### 字段始终是私有的

Move 中结构体的字段始终是私有的，无法直接从模块外部访问。需要通过公共函数来提供读写接口：

```move
module book::field_visibility;

public struct User has drop {
    name: vector<u8>,
    age: u64,
}

public fun new(name: vector<u8>, age: u64): User {
    User { name, age }
}

// 通过公共函数提供读取接口
public fun name(user: &User): &vector<u8> {
    &user.name
}

public fun age(user: &User): u64 {
    user.age
}

// 通过公共函数提供修改接口
public fun set_age(user: &mut User, new_age: u64) {
    user.age = new_age;
}

#[test]
fun field_access() {
    let mut user = new(b"Alice", 25);
    assert_eq!(age(&user), 25);

    set_age(&mut user, 26);
    assert_eq!(age(&user), 26);
}
```

> **重要提示**：虽然结构体字段在代码层面是私有的，但这并不意味着数据是机密的。链上对象的所有数据都是公开可读的。字段的私有性是一种编程封装，不是数据隐私保护。

## 小结

Move 提供四种可见性级别来控制函数的访问范围：`private`（默认）仅模块内部可见，`public` 对所有模块开放，`public(package)` 限制在同一包内，`entry` 仅供交易直接调用。结构体的字段始终是私有的，需要通过公共函数暴露读写接口。合理运用可见性修饰符是良好模块设计的基础——暴露最小必要的接口，隐藏内部实现细节。


---


<!-- source: 06_move_intermediate/index.md -->
## 第六章 · Move 语法进阶

# 第六章 · Move 语法进阶

本章在语法基础之上，介绍标准库与常用集合类型、枚举与模式匹配、方法语法、宏函数，以及所有权与引用，帮助你写出结构清晰、可维护的 Move 模块。

## 本章内容

| 节 | 主题 | 核心知识点 |
|---|------|-----------|
| 6.1 | 标准库概览 | Move 标准库常用模块与使用方式 |
| 6.2 | Vector | 向量操作、下标语法、遍历、常用方法 |
| 6.3 | Option | None / Some、安全取值与模式匹配 |
| 6.4 | String | UTF-8 与 ASCII、字符串操作 |
| 6.5 | 枚举 | enum 定义、带数据变体、能力、实例化与限制 |
| 6.6 | 模式匹配 | match 表达式、穷尽性、通配符、解构变体数据 |
| 6.7 | 结构体方法 | 方法语法、self 参数、链式调用 |
| 6.8 | 宏函数 | macro fun、lambda、向量/Option 宏 |
| 6.9 | 所有权与作用域 | 所有权转移、变量生命周期 |
| 6.10 | 引用（& 与 &mut） | &T / &mut T、借用规则与使用场景 |

## 学习目标

读完本章后，你将能够：

- 熟练使用标准库中的 Vector、Option、String 等类型
- 用枚举与模式匹配表达多分支逻辑与错误处理
- 用结构体方法和宏函数组织与复用代码
- 理解所有权与引用，写出正确且高效的 Move 代码


---


<!-- source: 05_move_basics/standard-library.md -->
## 6.1 标准库概览

# Move 标准库概览

Move 标准库（Move Standard Library，简称 `std`）是 Move 语言内置的基础工具集，发布在地址 `0x1` 上。它提供了字符串处理、集合操作、序列化、哈希计算等核心功能，是每个 Move 开发者日常使用的基石。了解标准库的模块结构和常用接口，可以避免重复造轮子，写出更高效、更安全的代码。

## 标准库地址

Move 标准库的包地址为 `0x1`，在 `Move.toml` 中通常以命名地址 `std` 引用：

```toml
[addresses]
std = "0x1"
```

在代码中，所有标准库模块都以 `std::` 前缀访问，例如 `std::string`、`std::vector`。

## 常用模块一览

以下是 Move 标准库中最常用的模块及其功能：

| 模块 | 用途 | 主要类型/函数 |
|------|------|-------------|
| `std::string` | UTF-8 字符串操作 | `String`, `utf8()`, `append()`, `length()` |
| `std::ascii` | ASCII 字符串操作 | `String`, `string()`, `length()` |
| `std::option` | 可选值类型 | `Option<T>`, `some()`, `none()`, `is_some()` |
| `std::vector` | 动态数组操作 | `push_back()`, `pop_back()`, `length()` |
| `std::bcs` | BCS 序列化 | `to_bytes()` |
| `std::address` | 地址工具 | `to_string()`, `length()` |
| `std::type_name` | 运行时类型反射 | `TypeName`, `get<T>()`, `into_string()` |
| `std::hash` | 哈希函数 | `sha2_256()`, `sha3_256()` |
| `std::debug` | 调试输出（仅测试） | `print()`, `print_stack_trace()` |

## 字符串模块

### std::string — UTF-8 字符串

`std::string` 提供 UTF-8 编码的字符串类型，是最常用的字符串模块：

```move
module book::std_string_demo;

use std::string::{Self, String};

#[test]
fun string_demo() {
    let s: String = b"Hello, Move!".to_string();
    assert_eq!(s.length(), 12);

    let mut greeting = b"Hello".to_string();
    greeting.append(b", World!".to_string());
    assert_eq!(greeting, b"Hello, World!".to_string());

    // 安全创建：返回 Option<String>
    let valid = string::try_utf8(b"valid");
    assert!(valid.is_some());
}
```

### std::ascii — ASCII 字符串

`std::ascii` 用于处理纯 ASCII 字符串，限制每个字节在 0~127 范围内：

```move
module book::std_ascii_demo;

use std::ascii;

#[test]
fun ascii_demo() {
    let s = b"Hello".to_ascii_string();
    assert_eq!(ascii::length(&s), 5);
}
```

## 集合与容器模块

### std::vector — 动态数组

`vector` 是 Move 中唯一的原生集合类型，`std::vector` 提供了丰富的操作函数：

```move
module book::std_vector_demo;

#[test]
fun vector_demo() {
    let mut v = vector[10u64, 20, 30];

    v.push_back(40);
    assert_eq!(v.length(), 4);
    assert!(v.contains(&20));

    let last = v.pop_back();
    assert_eq!(last, 40);
}
```

### std::option — 可选值

`Option<T>` 表示一个可能存在也可能不存在的值，是处理缺失值的安全方式：

```move
module book::std_option_demo;

#[test]
fun option_demo() {
    let some_val: Option<u64> = option::some(42);
    let none_val: Option<u64> = option::none();

    assert!(some_val.is_some());
    assert!(none_val.is_none());

    let val = some_val.destroy_some();
    assert_eq!(val, 42);
}
```

## 序列化与哈希

### std::bcs — BCS 序列化

BCS（Binary Canonical Serialization）是 Move 和 Sui 使用的序列化格式。`std::bcs` 可以将任意拥有 `copy` 能力的值转换为字节序列：

```move
module book::std_bcs_demo;

use std::bcs;

#[test]
fun bcs_demo() {
    let value: u64 = 1234;
    let bytes: vector<u8> = bcs::to_bytes(&value);
    assert!(bytes.length() > 0);

    let flag = true;
    let flag_bytes = bcs::to_bytes(&flag);
    assert_eq!(flag_bytes, vector[1u8]); // true 序列化为 [1]
}
```

### std::hash — 哈希函数

标准库提供了两种常用的密码学哈希函数：

```move
module book::std_hash_demo;

use std::hash;

#[test]
fun hash_demo() {
    let data = b"hello";
    let sha2 = hash::sha2_256(data);
    let sha3 = hash::sha3_256(data);

    assert_eq!(sha2.length(), 32); // SHA2-256 输出 32 字节
    assert_eq!(sha3.length(), 32); // SHA3-256 输出 32 字节
    assert!(sha2 != sha3);        // 不同算法，结果不同
}
```

## 类型反射

### std::type_name — 运行时类型信息

`std::type_name` 允许在运行时获取类型的完全限定名称，常用于泛型编程和调试：

```move
module book::std_type_name_demo;

use std::type_name;
use std::ascii::String;

#[test]
fun type_name_demo() {
    let name = type_name::get<u64>();
    let name_str: String = name.into_string();
    assert_eq!(name_str, b"u64".to_ascii_string());
}
```

## 整数工具模块

标准库为每种整数类型提供了实用函数模块：`std::u8`、`std::u16`、`std::u32`、`std::u64`、`std::u128`、`std::u256`。

这些模块提供的常用函数：

| 函数 | 说明 |
|------|------|
| `max(a, b)` | 返回两者中的较大值 |
| `diff(a, b)` | 返回两者的绝对差值 |
| `pow(base, exp)` | 幂运算 |
| `sqrt(n)` | 整数平方根 |

```move
module book::std_integer_demo;

use std::u64;

#[test]
fun integer_utils() {
    assert_eq!(u64::max(10, 20), 20);
    assert_eq!(u64::diff(30, 10), 20);
    assert_eq!(u64::diff(10, 30), 20);  // 绝对差值
    assert_eq!(u64::pow(2, 10), 1024);
    assert_eq!(u64::sqrt(144), 12);
}
```

## 调试模块

### std::debug — 测试专用调试

`std::debug` 仅在测试环境中有效，用于在 `sui move test` 时打印调试信息：

```move
module book::std_debug_demo;

use std::debug;
use std::string::String;

#[test]
fun debug_demo() {
    let value: u64 = 42;
    debug::print(&value);

    let name: String = b"Sui Move".to_string();
    debug::print(&name);

    debug::print_stack_trace();
}
```

> **注意**：`debug::print` 在链上执行时不会产生任何输出，仅用于本地测试调试。

## 隐式导入

编译器会自动导入以下标准库模块，无需在代码中编写 `use` 语句：

- `std::vector` — 向量操作函数
- `std::option` — Option 模块及其函数
- `std::option::Option` — Option 类型

因此，你可以直接在代码中使用 `vector[1, 2, 3]`、`option::some(x)`、`Option<T>` 等。

## 标准库 vs Sui Framework

初学者容易混淆 Move 标准库（`std`，地址 `0x1`）和 Sui Framework（`sui`，地址 `0x2`）。两者的核心区别：

| 特性 | Move 标准库 (`std`) | Sui Framework (`sui`) |
|------|--------------------|-----------------------|
| 地址 | `0x1` | `0x2` |
| 定位 | 语言层面的通用工具 | Sui 链特有的功能 |
| 存储能力 | 无存储相关功能 | 提供对象存储、转移等 |
| 对象模型 | 不涉及 | `UID`、`object`、`transfer` |
| 典型模块 | `string`、`vector`、`option` | `coin`、`transfer`、`clock` |

简单来说，`std` 提供数据处理的基础工具，`sui` 提供链上对象和交易的高级功能。两者互补，共同构成了 Sui Move 的开发基础。

## 小结

Move 标准库是开发 Sui 智能合约的基础工具集。本节核心要点：

- **地址**：标准库位于地址 `0x1`，通过 `std::module` 访问
- **字符串**：`std::string`（UTF-8）和 `std::ascii`（ASCII）两种字符串类型
- **集合**：`std::vector` 提供动态数组，`std::option` 提供可选值
- **序列化**：`std::bcs` 进行 BCS 序列化
- **哈希**：`std::hash` 提供 SHA2-256 和 SHA3-256
- **类型反射**：`std::type_name` 获取运行时类型信息
- **整数工具**：`std::u64` 等模块提供 `max`、`diff`、`pow`、`sqrt`
- **调试**：`std::debug` 仅用于测试时的打印输出
- **隐式导入**：`vector`、`option`、`Option` 自动可用
- **区别 Sui Framework**：`std` 是通用工具，`sui` 提供链上功能


---


<!-- source: 05_move_basics/vector.md -->
## 6.2 Vector

# 向量（Vector）

向量（Vector）是 Move 语言中唯一的原生集合类型，用于存储同一类型的有序元素序列。它类似于其他语言中的动态数组或列表，可以在运行时添加、删除和访问元素。向量是 Move 中最基础、最常用的数据结构，几乎所有复杂的数据组织都建立在它之上。

## 创建向量

### 字面量语法

Move 提供了简洁的字面量语法来创建向量：

```move
module book::vector_create;

#[test]
fun create() {
    let empty: vector<u64> = vector[];     // 空向量，需要类型标注
    let nums = vector[1u64, 2, 3];         // 带初始元素的向量
    let bools = vector[true, false, true]; // 布尔向量
    let bytes = vector[0u8, 1, 2, 255];   // 字节向量

    assert_eq!(empty.length(), 0);
    assert_eq!(nums.length(), 3);
    assert_eq!(bools.length(), 3);
    assert_eq!(bytes.length(), 4);
}
```

### 泛型类型

向量的类型表示为 `vector<T>`，其中 `T` 可以是任何合法的 Move 类型：

```move
module book::vector_types;

use std::string::String;

public struct Item has copy, drop {
    name: String,
    value: u64,
}

#[test]
fun vector_types() {
    let _strings: vector<String> = vector[];
    let _nested: vector<vector<u64>> = vector[];    // 向量的向量
    let _items: vector<Item> = vector[];             // 结构体向量
    let _options: vector<Option<u64>> = vector[];    // Option 向量
}
```

## 基本操作

向量内置于语言中，无需导入即可使用。以下是最常用的操作方法：

### 添加与移除元素

```move
module book::vector_ops;

#[test]
fun push_pop() {
    let mut v = vector<u64>[];

    // 尾部添加元素
    v.push_back(10);
    v.push_back(20);
    v.push_back(30);
    assert_eq!(v.length(), 3);

    // 尾部移除元素（返回被移除的值）
    let last = v.pop_back();
    assert_eq!(last, 30);
    assert_eq!(v.length(), 2);

    // 在指定位置移除元素
    let removed = v.remove(0);  // 移除第一个元素
    assert_eq!(removed, 10);
    assert_eq!(v.length(), 1);
}
```

### 访问元素

```move
module book::vector_access;

#[test]
fun access() {
    let v = vector[10u64, 20, 30, 40];

    // 索引访问（语法糖，等价于 *vector::borrow(&v, 0)）
    assert_eq!(v[0], 10);
    assert_eq!(v[3], 40);

    // 通过 borrow 获取不可变引用
    let first: &u64 = &v[0];
    assert_eq!(*first, 10);
}
```

### 修改元素

```move
module book::vector_modify;

#[test]
fun modify() {
    let mut v = vector[10u64, 20, 30];

    // 通过索引修改元素
    v[1] = 200;
    assert_eq!(v[1], 200);

    // 通过 borrow_mut 获取可变引用
    let second = &mut v[1];
    *second = 999;
    assert_eq!(v[1], 999);
}
```

### 下标语法

`v[i]` 是 Move 的**下标语法**：编译器会将其转换为对 `vector::borrow`（只读）或 `vector::borrow_mut`（可写）的调用。标准库中的 `vector` 通过 `#[syntax(index)]` 标记了 `borrow` 与 `borrow_mut`，因此支持 `v[i]` 和 `&v[i]`、`&mut v[i]`。

自定义类型也可以为“索引访问”定义类似语法：在同一模块中为类型定义带有 `#[syntax(index)]` 的 `public fun borrow(...)` 和 `public fun borrow_mut(...)`，第一个参数为 `&Self` / `&mut Self`，返回 `&T` / `&mut T`，即可对该类型的值使用 `obj[index_expr]` 形式的读写。详见语言参考中的 Index Syntax。

## 查询操作

```move
module book::vector_query;

#[test]
fun query() {
    let v = vector[10u64, 20, 30, 40, 50];

    // 长度
    assert_eq!(v.length(), 5);

    // 是否为空
    assert!(!v.is_empty());
    assert!(vector<u64>[].is_empty());

    // 是否包含某个元素
    assert!(v.contains(&30));
    assert!(!v.contains(&99));
}
```

## 排列操作

```move
module book::vector_arrange;

#[test]
fun arrange() {
    let mut v = vector[1u64, 2, 3, 4, 5];

    // 交换两个位置的元素
    v.swap(0, 4);
    assert_eq!(v[0], 5);
    assert_eq!(v[4], 1);

    // swap_remove：将指定位置元素与最后一个交换，然后 pop_back
    // 比 remove 更高效（O(1)），但不保持顺序
    let mut v2 = vector[10u64, 20, 30, 40];
    let removed = v2.swap_remove(1);  // 移除索引 1 的元素 (20)
    assert_eq!(removed, 20);
    // v2 现在是 [10, 40, 30]（40 被换到了索引 1）

    // 反转向量
    let mut v3 = vector[1u64, 2, 3];
    v3.reverse();
    assert!(v3 == vector[3u64, 2, 1]);
}
```

## 遍历向量

### while 循环遍历

Move 中遍历向量最常见的方式是使用 `while` 循环配合索引：

```move
module book::vector_iterate;

#[test]
fun while_loop() {
    let v = vector[10u64, 20, 30, 40, 50];

    let mut i = 0;
    let mut sum = 0u64;
    while (i < v.length()) {
        sum = sum + v[i];
        i = i + 1;
    };

    assert_eq!(sum, 150);
}
```

### 消耗式遍历

如果不再需要向量，可以使用 `pop_back` 逐个取出元素：

```move
module book::vector_consume;

#[test]
fun consume() {
    let mut v = vector[1u64, 2, 3];
    let mut sum = 0u64;

    while (!v.is_empty()) {
        sum = sum + v.pop_back();
    };

    assert_eq!(sum, 6);
    assert!(v.is_empty());
    v.destroy_empty(); // 显式销毁空向量
}
```

## 销毁向量

### destroy_empty

对于元素类型没有 `drop` 能力的向量，必须在向量为空后使用 `destroy_empty` 显式销毁：

```move
module book::vector_destroy;

public struct NoDrop { value: u64 }

fun consume(_item: NoDrop) {
    let NoDrop { value: _ } = _item;
}

#[test]
fun destroy() {
    let mut v = vector[NoDrop { value: 1 }, NoDrop { value: 2 }];

    // 必须逐个取出并消耗元素
    consume(v.pop_back());
    consume(v.pop_back());

    // 向量为空后才能销毁
    v.destroy_empty();
}
```

如果元素类型有 `drop` 能力，向量在作用域结束时会自动销毁，无需手动处理。

## 向量的向量

Move 支持嵌套向量，即向量的元素本身也是向量：

```move
module book::nested_vector;

#[test]
fun nested() {
    let mut matrix: vector<vector<u64>> = vector[];

    matrix.push_back(vector[1, 2, 3]);
    matrix.push_back(vector[4, 5, 6]);
    matrix.push_back(vector[7, 8, 9]);

    assert_eq!(matrix.length(), 3);
    assert_eq!(matrix[0][0], 1);
    assert_eq!(matrix[1][1], 5);
    assert_eq!(matrix[2][2], 9);
}
```

## 结构体向量

向量可以存储自定义结构体，这在实际开发中非常常见：

```move
module book::struct_vector;

use std::string::String;

public struct Player has copy, drop {
    name: String,
    score: u64,
}

public fun top_scorer(players: &vector<Player>): String {
    assert!(!players.is_empty());

    let mut best_idx = 0;
    let mut i = 1;
    while (i < players.length()) {
        if (players[i].score > players[best_idx].score) {
            best_idx = i;
        };
        i = i + 1;
    };

    players[best_idx].name
}

#[test]
fun struct_vector() {
    let players = vector[
        Player { name: b"Alice".to_string(), score: 100 },
        Player { name: b"Bob".to_string(), score: 250 },
        Player { name: b"Charlie".to_string(), score: 180 },
    ];

    let top = top_scorer(&players);
    assert_eq!(top, b"Bob".to_string());
}
```

## 完整示例

下面的例子综合展示了向量的常用操作：

```move
module book::vector_example;

#[test]
fun vector_example() {
    let mut v = vector[10u64, 20, 30];

    // 添加元素
    v.push_back(40);
    assert_eq!(v.length(), 4);

    // 访问元素
    assert_eq!(v[0], 10);
    assert_eq!(v[3], 40);

    // 移除最后一个元素
    let last = v.pop_back();
    assert_eq!(last, 40);

    // 按索引移除
    let removed = v.remove(1); // 移除 20
    assert_eq!(removed, 20);

    // 查询
    assert!(v.contains(&10));
    assert!(!v.contains(&20));

    // 遍历求和
    let mut i = 0;
    let mut sum = 0u64;
    while (i < v.length()) {
        sum = sum + v[i];
        i = i + 1;
    };

    assert_eq!(sum, 40); // 10 + 30
}
```

## 小结

向量是 Move 中最基础也是最重要的集合类型。本节核心要点：

- **创建**：使用 `vector[]` 字面量语法，类型为 `vector<T>`
- **添加/移除**：`push_back` 尾部添加，`pop_back` 尾部移除，`remove` 按索引移除
- **访问**：通过 `v[i]` 索引访问，`borrow` 获取引用，`borrow_mut` 获取可变引用
- **查询**：`length()`、`is_empty()`、`contains()` 检查向量状态
- **排列**：`swap` 交换、`swap_remove` 高效删除、`reverse` 反转
- **遍历**：使用 `while` 循环配合索引进行遍历
- **销毁**：元素有 `drop` 时自动销毁，否则需要清空后调用 `destroy_empty`
- **嵌套**：支持 `vector<vector<T>>` 等嵌套结构


---


<!-- source: 05_move_basics/option.md -->
## 6.3 Option

# Option 类型

`Option<T>` 表示一个可能存在也可能不存在的值，借鉴自 Rust 语言的设计理念。它是处理缺失值的安全方式——与使用哨兵值（如 0 或 -1 表示"无"）不同，`Option` 在类型层面强制开发者处理值可能不存在的情况。在 Sui Move 中，`Option` 广泛用于可选的结构体字段、函数返回值等场景。

## 基本概念

### 内部实现

`Option<Element>` 的底层实现是一个最多包含一个元素的 `vector<Element>`：

- `option::some(value)` — 创建包含值的 Option（vector 长度为 1）
- `option::none()` — 创建空的 Option（vector 长度为 0）

这种实现方式简洁高效，复用了 vector 的内存管理机制。

### 隐式导入

`Option` 类型和 `option` 模块由编译器自动导入，无需手动编写 `use` 语句即可直接使用：

```move
module book::option_auto;

public struct Example has drop {
    value: Option<u64>,  // 直接使用，无需 use std::option
}

#[test]
fun auto_import() {
    let some_val = option::some(42u64);  // 直接使用 option::some
    let none_val: Option<u64> = option::none();

    assert!(some_val.is_some());
    assert!(none_val.is_none());
}
```

## 创建 Option

```move
module book::option_create;

use std::string::String;

#[test]
fun create() {
    // 创建包含值的 Option
    let some_int = option::some(42u64);
    let some_bool = option::some(true);
    let some_string = option::some(b"hello".to_string());

    // 创建空的 Option
    let none_int: Option<u64> = option::none();
    let none_string: Option<String> = option::none();

    assert!(some_int.is_some());
    assert!(none_int.is_none());
}
```

## 检查 Option 状态

`is_some()` 和 `is_none()` 用于检查 Option 是否包含值：

```move
module book::option_check;

#[test]
fun check() {
    let has_value = option::some(100u64);
    let no_value: Option<u64> = option::none();

    assert!(has_value.is_some());     // true
    assert!(!has_value.is_none());    // false

    assert!(no_value.is_none());      // true
    assert!(!no_value.is_some());     // false
}
```

## 提取 Option 中的值

### borrow — 不可变借用

`borrow()` 返回内部值的不可变引用。如果 Option 为空，会触发 abort：

```move
module book::option_borrow;

#[test]
fun borrow() {
    let opt = option::some(42u64);
    let value_ref: &u64 = opt.borrow();
    assert_eq!(*value_ref, 42);
}
```

### borrow_mut — 可变借用

`borrow_mut()` 返回内部值的可变引用，允许直接修改 Option 中的值：

```move
module book::option_borrow_mut;

#[test]
fun borrow_mut() {
    let mut opt = option::some(10u64);
    let value_ref = opt.borrow_mut();
    *value_ref = 20;

    assert_eq!(*opt.borrow(), 20);
}
```

### extract — 取出并清空

`extract()` 从 Option 中取出值，Option 变为 `none`。值被移出后 Option 仍然存在但为空：

```move
module book::option_extract;

#[test]
fun extract() {
    let mut opt = option::some(42u64);
    let value = opt.extract();

    assert_eq!(value, 42);
    assert!(opt.is_none());  // 提取后变为 none
}
```

### destroy_some — 销毁并取值

`destroy_some()` 销毁 Option 并返回内部的值。与 `extract` 不同的是，它会消耗整个 Option：

```move
module book::option_destroy_some;

#[test]
fun destroy_some() {
    let opt = option::some(42u64);
    let value = opt.destroy_some();
    assert_eq!(value, 42);
    // opt 已被销毁，不再可用
}
```

### get_with_default — 带默认值的获取

`get_with_default()` 在 Option 有值时返回该值的副本，为空时返回提供的默认值：

```move
module book::option_default;

#[test]
fun default() {
    let some_val = option::some(42u64);
    let none_val: Option<u64> = option::none();

    let a = some_val.get_with_default(0);  // 返回 42
    let b = none_val.get_with_default(0);  // 返回默认值 0

    assert_eq!(a, 42);
    assert_eq!(b, 0);
}
```

## 销毁 Option

### destroy_none — 销毁空 Option

`destroy_none()` 销毁一个空的 Option。如果 Option 包含值，会触发 abort：

```move
module book::option_destroy_none;

#[test]
fun destroy_none() {
    let empty: Option<u64> = option::none();
    empty.destroy_none();  // 安全销毁空 Option
}
```

## 修改 Option

### fill 和 swap

```move
module book::option_modify;

#[test]
fun fill_swap() {
    let mut opt: Option<u64> = option::none();

    // fill：向空 Option 中填入值
    opt.fill(100);
    assert_eq!(*opt.borrow(), 100);

    // swap：替换 Option 中的值，返回旧值
    let old = opt.swap(200);
    assert_eq!(old, 100);
    assert_eq!(*opt.borrow(), 200);
}
```

## 常见使用场景

### 可选的结构体字段

`Option` 最常见的用途是表示结构体中的可选字段：

```move
module book::option_example;

use std::string::String;

public struct UserProfile has drop {
    name: String,
    middle_name: Option<String>,
    bio: Option<String>,
}

public fun new_profile(name: String): UserProfile {
    UserProfile {
        name,
        middle_name: option::none(),
        bio: option::none(),
    }
}

#[test]
fun option_profile() {
    let mut profile = new_profile(b"Alice".to_string());

    assert!(profile.middle_name.is_none());

    // 设置中间名
    profile.middle_name = option::some(b"Marie".to_string());
    assert!(profile.middle_name.is_some());

    // 借用内部值
    let middle = profile.middle_name.borrow();
    assert_eq!(*middle, b"Marie".to_string());

    // 获取带默认值的字段
    let bio = profile.bio.get_with_default(b"No bio".to_string());
    assert_eq!(bio, b"No bio".to_string());
}
```

### 安全的查找操作

在集合中查找元素时，使用 `Option` 表示可能找不到的情况：

```move
module book::option_search;

public fun find_index(v: &vector<u64>, target: u64): Option<u64> {
    let mut i = 0;
    while (i < v.length()) {
        if (v[i] == target) {
            return option::some(i)
        };
        i = i + 1;
    };
    option::none()
}

#[test]
fun find() {
    let nums = vector[10u64, 20, 30, 40];

    let found = find_index(&nums, 30);
    assert!(found.is_some());
    assert_eq!(found.destroy_some(), 2);

    let not_found = find_index(&nums, 99);
    assert!(not_found.is_none());
}
```

## Option 的能力

`Option<T>` 的能力取决于内部元素类型 `T`：

| T 的能力 | Option\<T\> 拥有的能力 |
|---------|----------------------|
| `copy` | `Option<T>` 有 `copy` |
| `drop` | `Option<T>` 有 `drop` |
| `store` | `Option<T>` 有 `store` |

```move
module book::option_abilities;

public struct Copyable has copy, drop { value: u64 }

#[test]
fun option_copy() {
    let opt = option::some(Copyable { value: 42 });
    let opt_copy = opt;       // Option<Copyable> 有 copy
    assert!(opt.is_some());   // 原值仍然可用
    assert!(opt_copy.is_some());
}
```

## 小结

`Option` 是 Move 中处理可选值的标准方式。本节核心要点：

- **概念**：`Option<T>` 表示"有值"或"无值"，底层通过 `vector<T>` 实现
- **创建**：`option::some(value)` 创建有值，`option::none()` 创建空值
- **检查**：`is_some()` 和 `is_none()` 判断状态
- **提取**：`borrow()` 借用、`extract()` 取出、`destroy_some()` 销毁并取值
- **默认值**：`get_with_default()` 安全获取，避免 abort
- **修改**：`fill()` 填入值、`swap()` 替换值
- **隐式导入**：`Option` 类型和 `option` 模块自动可用，无需 `use`
- **常见场景**：可选结构体字段、安全的查找/返回操作


---


<!-- source: 05_move_basics/string.md -->
## 6.4 String

# 字符串

Move 语言提供了两种字符串类型：`std::string::String`（UTF-8 编码）和 `std::ascii::String`（ASCII 编码）。两者的底层都是 `vector<u8>` 的封装，但在编码验证和使用场景上有所不同。UTF-8 字符串是日常开发中最常用的字符串类型，而 ASCII 字符串适用于需要严格限制字符范围的场景。

## UTF-8 字符串

### 创建字符串

`std::string::String` 是最常用的字符串类型，支持完整的 UTF-8 字符集：

```move
module book::string_create;

use std::string::{Self, String};

#[test]
fun create() {
    // 最常用的方式：字节字面量转换
    let s1: String = b"Hello, Sui!".to_string();

    // 通过 string::utf8 函数创建
    let bytes = b"Hello";
    let s2 = string::utf8(bytes);

    assert_eq!(s1.length(), 11);
    assert_eq!(s2.length(), 5);
}
```

### 安全创建

`string::try_utf8` 返回 `Option<String>`，在输入不是合法 UTF-8 时不会 abort，而是返回 `none`：

```move
module book::string_safe;

use std::string;

#[test]
fun try_utf8() {
    let valid = string::try_utf8(b"valid utf8");
    assert!(valid.is_some());

    let invalid = string::try_utf8(vector[0xFF, 0xFE]);
    assert!(invalid.is_none());
}
```

## 常用字符串操作

### 拼接与子串

```move
module book::string_ops;

use std::string::String;

#[test]
fun ops() {
    let mut str = b"Hello".to_string();
    let world = b", World!".to_string();

    // 拼接（会修改原字符串）
    str.append(world);
    assert_eq!(str, b"Hello, World!".to_string());
    assert_eq!(str.length(), 13);

    // 提取子串（按字节索引）
    let hello = str.sub_string(0, 5);
    assert_eq!(hello, b"Hello".to_string());

    let world_part = str.sub_string(7, 13);
    assert_eq!(world_part, b"World!".to_string());
}
```

### 长度与空值检查

```move
module book::string_check;

use std::string::String;

#[test]
fun length() {
    let s = b"Sui Move".to_string();
    assert_eq!(s.length(), 8);
    assert!(!s.is_empty());

    let empty: String = b"".to_string();
    assert_eq!(empty.length(), 0);
    assert!(empty.is_empty());
}
```

### 获取底层字节

`bytes()` 方法返回字符串底层 `vector<u8>` 的不可变引用：

```move
module book::string_bytes;

use std::string::String;

#[test]
fun bytes() {
    let s: String = b"ABC".to_string();
    let bytes: &vector<u8> = s.bytes();

    assert_eq!(bytes.length(), 3);
    assert_eq!(bytes[0], 65);  // 'A' 的 ASCII 值
    assert_eq!(bytes[1], 66);  // 'B'
    assert_eq!(bytes[2], 67);  // 'C'
}
```

### 插入与删除

```move
module book::string_insert;

use std::string::String;

#[test]
fun insert() {
    let mut s = b"Hello World".to_string();

    // insert: 在指定字节位置插入另一个字符串
    s.insert(5, b",".to_string());
    assert_eq!(s, b"Hello, World".to_string());
}
```

## UTF-8 的限制

`length()` 返回的是 **字节数**，而非字符数。对于多字节 UTF-8 字符（如中文），字节数和字符数不同：

```move
module book::string_utf8_limit;

use std::string::String;

#[test]
fun utf8_length() {
    let ascii_str: String = b"Hello".to_string();
    assert!(ascii_str.length() == 5);  // 5 个 ASCII 字符 = 5 字节

    // 注意：sub_string 按字节索引操作
    // 如果在多字节字符的中间截断，会导致非法 UTF-8
    // 因此在处理非 ASCII 字符时需格外小心
}
```

> **注意**：Move 的字符串 API 基于字节操作，不支持字符级别的访问。在处理包含非 ASCII 字符（如中文、emoji）的字符串时，需要特别注意字节边界问题。

## ASCII 字符串

### 创建和使用

`std::ascii::String` 严格限制每个字节在 0~127 范围内：

```move
module book::ascii_example;

use std::ascii;

#[test]
fun ascii() {
    // 使用 to_ascii_string 创建
    let s = b"Hello, ASCII!".to_ascii_string();
    assert!(ascii::length(&s) == 13);

    // 安全创建：返回 Option
    let valid = ascii::try_string(b"valid");
    assert!(valid.is_some());

    // 包含非 ASCII 字节的输入会返回 none
    let invalid = ascii::try_string(vector[200u8]);
    assert!(invalid.is_none());
}
```

### UTF-8 与 ASCII 的选择

| 特性 | `std::string::String` | `std::ascii::String` |
|------|----------------------|---------------------|
| 编码 | UTF-8 | ASCII (0~127) |
| 字符范围 | 全 Unicode | 仅英文字母、数字、基本符号 |
| 底层类型 | `vector<u8>` | `vector<u8>` |
| 常见用途 | 用户输入、显示文本 | 标识符、协议字段 |
| 创建方式 | `b"...".to_string()` | `b"...".to_ascii_string()` |

在大多数场景下，推荐使用 UTF-8 的 `std::string::String`。ASCII 字符串主要用于那些需要严格限制字符范围的场景，例如 URL、标识符等。

## 字符串与字节向量的转换

字符串本质上是带有编码验证的 `vector<u8>` 封装：

```move
module book::string_conversion;

use std::string::{Self, String};

#[test]
fun conversion() {
    // 字节向量 -> 字符串
    let bytes = b"Hello";
    let s: String = string::utf8(bytes);

    // 字符串 -> 字节向量引用
    let bytes_ref: &vector<u8> = s.bytes();
    assert!(bytes_ref == &b"Hello");

    // 字符串 -> 字节向量（消耗字符串）
    let owned_bytes: vector<u8> = s.into_bytes();
    assert!(owned_bytes == b"Hello");
}
```

## 完整示例

```move
module book::string_example;

use std::string::String;

#[test]
fun string_example() {
    let mut str = b"Hello".to_string();
    let world = b", World!".to_string();

    // 拼接
    str.append(world);
    assert_eq!(str.length(), 13);

    // 子串
    let hello = str.sub_string(0, 5);
    assert_eq!(hello, b"Hello".to_string());

    // 空值检查
    assert!(!str.is_empty());

    // 安全创建
    let valid = std::string::try_utf8(b"valid utf8");
    assert!(valid.is_some());

    // 获取字节
    let bytes: &vector<u8> = str.bytes();
    assert_eq!(bytes.length(), 13);
}
```

## 小结

字符串是 Move 中处理文本数据的核心类型。本节核心要点：

- **两种字符串**：`std::string::String`（UTF-8）和 `std::ascii::String`（ASCII）
- **底层结构**：都是 `vector<u8>` 的封装，带有编码验证
- **创建方式**：`b"text".to_string()` 创建 UTF-8，`string::try_utf8()` 安全创建
- **常用操作**：`append()` 拼接、`sub_string()` 子串、`length()` 长度、`is_empty()` 检查空值
- **字节访问**：`bytes()` 获取底层字节引用，`into_bytes()` 转换为字节向量
- **UTF-8 限制**：`length()` 返回字节数而非字符数，无字符级别访问
- **ASCII 字符串**：适用于标识符等需要限制字符范围的场景
- **选择建议**：大多数情况下使用 UTF-8 字符串


---


<!-- source: 05_move_basics/enum.md -->
## 6.5 枚举

# 枚举

枚举（Enum）是一种能表示多个变体（Variant）的类型，每个变体可以携带不同的数据。枚举是 Move 2024 引入的重要特性，极大地增强了类型系统的表达能力。

## 基本语法

枚举使用 `public enum` 关键字定义，每个变体用逗号分隔：

```move
module book::enum_basic;

public enum Direction has copy, drop {
    North,
    South,
    East,
    West,
}

#[test]
fun direction() {
    let d = Direction::North;
    let _e = Direction::East;
}
```

## 带数据的变体

变体可以携带数据，支持两种形式：

- **位置参数**：`Variant(Type)` — 类似元组
- **命名字段**：`Variant { field: Type }` — 类似结构体

```move
module book::enum_data;

use std::string::String;

public enum Shape has copy, drop {
    Circle(u64),                           // 位置参数：半径
    Rectangle { width: u64, height: u64 }, // 命名字段
    Point,                                 // 无数据
}

public enum Message has copy, drop {
    Quit,
    Text(String),
    Move { x: u64, y: u64 },
}
```

## 能力声明

枚举可以声明能力，但所有变体中携带的数据类型必须满足这些能力的要求：

```move
module book::enum_abilities;

public enum Status has copy, drop, store {
    Active,
    Inactive,
    Suspended { reason: vector<u8> },
}
```

## 实例化枚举

使用 `EnumName::VariantName` 语法创建枚举实例：

```move
module book::enum_instantiate;

public enum Color has copy, drop {
    Red,
    Green,
    Blue,
    Custom { r: u8, g: u8, b: u8 },
}

#[test]
fun instantiate() {
    let _red = Color::Red;
    let _custom = Color::Custom { r: 128, g: 0, b: 255 };
}
```

## 枚举的限制

- 一个枚举最多可以有 **100 个变体**
- **不支持递归枚举**（变体不能包含自身类型）
- 枚举的变体访问是 **模块内部** 的（类似结构体字段），外部模块不能直接构造或解构变体

## 小结

- **定义**：`public enum Name has abilities { Variant1, Variant2(Type), Variant3 { field: Type } }`
- **变体形式**：无数据、位置参数、命名字段
- **实例化**：`EnumName::VariantName` 或带数据形式
- **限制**：最多 100 个变体、不支持递归、变体访问仅限模块内部


---


<!-- source: 05_move_basics/pattern-matching.md -->
## 6.6 模式匹配

# 模式匹配

`match` 表达式根据枚举的变体进行分支处理，支持解构变体数据、通配符与穷尽性检查。配合枚举使用，可以安全、优雅地处理多种情况。

## 基本模式匹配

`match` 根据枚举的变体进行分支，每个分支用 `=>` 连接模式与结果：

```move
module book::match_basic;

public enum Coin has copy, drop {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

public fun value_in_cents(coin: &Coin): u64 {
    match (coin) {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

## 穷尽性检查

`match` 必须 **穷尽** 所有可能的变体，遗漏变体会导致编译错误。

## 通配符模式

使用 `_` 匹配所有未显式列出的变体：

```move
public fun is_urgent(p: &Priority): bool {
    match (p) {
        Priority::Critical => true,
        Priority::High => true,
        _ => false,
    }
}
```

## 解构变体数据

在 `match` 中可以解构变体携带的数据；使用 `..` 可忽略命名字段变体中的全部字段：

```move
public fun get_click_x(event: &Event): Option<u64> {
    match (event) {
        Event::Click { x, y: _ } => option::some(*x),
        _ => option::none(),
    }
}

// 忽略所有字段
Color::Custom { .. } => b"Custom"
```

## match 作为表达式

`match` 是表达式，可以返回值；所有分支的返回类型必须一致。

## 常见模式

- **is_variant 检查函数**：用 `match` 实现 `is_active(s)`、`is_paused(s)` 等
- **try_into 转换函数**：变体匹配时返回 `option::some(...)`，否则返回 `option::none()`

## 小结

- **match**：必须穷尽所有变体，支持通配符 `_`
- **解构**：在 match 中绑定变体数据，`..` 忽略所有字段
- **作为表达式**：match 可返回值，分支类型必须一致


---


<!-- source: 05_move_basics/struct-methods.md -->
## 6.7 结构体方法

# 结构体方法

Move 支持接收者语法（receiver syntax），允许使用点号 `e.f()` 的方式调用结构体的方法，这使得代码更加直观和面向对象。当函数的第一个参数是模块内定义的结构体类型时，就可以通过点号语法调用。理解方法的定义与调用方式，是编写优雅 Move 代码的重要一步。

## 方法定义

### 基本语法

如果一个函数的第一个参数是当前模块内定义的结构体类型（或其引用），那么该函数可以通过点号语法调用。第一个参数被称为"接收者"（receiver）：

```move
module book::method_basic;

public struct Counter has drop {
    value: u64,
}

public fun new(): Counter {
    Counter { value: 0 }
}

// 第一个参数是 &Counter，可通过 counter.value() 调用
public fun value(self: &Counter): u64 {
    self.value
}

#[test]
fun method_call() {
    let counter = new();
    assert_eq!(counter.value(), 0);  // 点号语法调用
    assert_eq!(value(&counter), 0);  // 传统调用方式，效果相同
}
```

### 三种接收者类型

接收者参数有三种形式，分别对应不同的访问权限：

```move
module book::method_example;

public struct Counter has drop {
    value: u64,
}

public fun new(): Counter {
    Counter { value: 0 }
}

// &self —— 不可变引用：只读访问
public fun value(self: &Counter): u64 {
    self.value
}

// &mut self —— 可变引用：可以修改
public fun increment(self: &mut Counter) {
    self.value = self.value + 1;
}

// &mut self 带额外参数
public fun add(self: &mut Counter, n: u64) {
    self.value = self.value + n;
}

// self（按值传递）—— 获取所有权，消耗该实例
public fun destroy(self: Counter): u64 {
    let Counter { value } = self;
    value
}

#[test]
fun methods() {
    let mut counter = new();
    assert_eq!(counter.value(), 0);

    counter.increment();
    counter.increment();
    counter.add(8);
    assert_eq!(counter.value(), 10);

    let final_value = counter.destroy();
    assert_eq!(final_value, 10);
}
```

三种接收者的适用场景：

| 接收者类型 | 语义 | 使用场景 |
|-----------|------|---------|
| `&self` | 不可变借用 | 读取数据、查询状态 |
| `&mut self` | 可变借用 | 修改状态、更新字段 |
| `self` | 获取所有权 | 销毁对象、转换类型 |

## 方法链式调用

当方法返回 `&mut self` 或可修改的引用时，可以进行链式调用。对于返回 `void` 的可变方法，需要分步调用：

```move
module book::method_chain;

public struct Builder has drop {
    name: vector<u8>,
    value: u64,
}

public fun new(): Builder {
    Builder { name: b"", value: 0 }
}

public fun set_name(self: &mut Builder, name: vector<u8>) {
    self.name = name;
}

public fun set_value(self: &mut Builder, value: u64) {
    self.value = value;
}

// getter 以字段名命名，无 get_ 前缀
public fun value(self: &Builder): u64 {
    self.value
}

#[test]
fun builder() {
    let mut builder = new();
    builder.set_name(b"test");
    builder.set_value(42);
    assert_eq!(builder.value(), 42);
}
```

## 方法别名

### use fun 语法

`use fun` 可以为函数创建方法别名，使得非当前模块定义的函数也能用点号语法调用：

```move
module book::method_alias;

public struct Wallet has drop {
    balance: u64,
}

public fun new(balance: u64): Wallet {
    Wallet { balance }
}

fun is_empty_check(w: &Wallet): bool {
    w.balance == 0
}

// 为 is_empty_check 创建方法别名
use fun is_empty_check as Wallet.is_empty;

#[test]
fun alias() {
    let wallet = new(100);
    assert!(!wallet.is_empty());  // 通过别名调用

    let empty_wallet = new(0);
    assert!(empty_wallet.is_empty());
}
```

### public use fun

`public use fun` 可以导出方法别名，使得其他模块在导入该类型时也能使用点号语法调用。只能对当前模块定义的类型使用 `public use fun`：

```move
module book::public_alias;

public struct Token has drop {
    amount: u64,
}

public fun new(amount: u64): Token {
    Token { amount }
}

fun token_amount(t: &Token): u64 {
    t.amount
}

fun token_is_zero(t: &Token): bool {
    t.amount == 0
}

// 导出别名，其他模块导入 Token 后也能使用这些方法
public use fun token_amount as Token.amount;
public use fun token_is_zero as Token.is_zero;

#[test]
fun public_alias() {
    let token = new(50);
    assert_eq!(token.amount(), 50);
    assert!(!token.is_zero());
}
```

## 自动关联

当一个模块被导入时，该模块中以其定义的结构体类型作为第一个参数的公共函数会自动关联为该类型的方法。无需手动创建别名，导入后即可使用点号语法：

```move
module book::auto_method;

public struct Circle has drop {
    radius: u64,
}

public fun new(radius: u64): Circle {
    Circle { radius }
}

public fun area_approx(self: &Circle): u64 {
    // 简化计算，使用 3 * r * r 近似
    3 * self.radius * self.radius
}
```

在其他模块中导入后直接使用：

```move
module book::use_circle;

use book::auto_method::{Self, Circle};

fun calculate() {
    let circle: Circle = auto_method::new(10);
    let area = circle.area_approx();  // 自动关联，直接使用点号语法
    assert_eq!(area, 300);
}
```

## 小结

Move 的接收者语法让代码具有面向对象的风格，使得函数调用更加直观。方法的第一个参数决定了访问权限：`&self` 只读、`&mut self` 可修改、`self` 获取所有权。`use fun` 为函数创建方法别名，`public use fun` 可以将别名导出供其他模块使用。当模块被导入时，符合条件的公共函数会自动关联为方法，无需额外配置。


---


<!-- source: 05_move_basics/macros.md -->
## 6.8 宏函数

# 宏函数

宏函数（macro function）在**编译时**在调用处展开，参数按表达式替换而非先求值再传参，并可接收 **lambda** 形式的代码块。Move 的宏仍然有类型约束，因此可以像普通函数一样使用，也支持[方法语法](./struct-methods.md)和 `use fun`。

## 语法

宏用 `macro fun` 定义；**类型参数**和**值参数**名必须以 `$` 开头，以区别于普通函数：

```move
module book::macro_basic;

macro fun add_three($x: u64, $y: u64, $z: u64): u64 {
    $x + $y + $z
}

#[test]
fun use_macro() {
    let sum = add_three!(1, 2, 3);
    assert_eq!(sum, 6);
}
```

- 以 `$` 开头的参数在编译期按**表达式**替换（不是先求值再代入）。
- 调用宏时使用 `macro_name!(...)`，与普通函数调用的括号形式区分。
- 若宏需要接收“一段代码”，可使用 **lambda** 类型参数（见下文）。

## Lambda

Lambda 只能作为宏的参数出现，用于把“一段代码”传给宏。类型写法为 `|T1, T2, ...| -> R`，无返回类型时默认为 `()`：

```move
|u64, u64| -> u128        // 两个 u64，返回 u128
|&mut vector<u8>|         // 一个参数，返回 ()
```

定义 lambda 时：

```move
|x| 2 * x
|x: u64| -> u64 { x + 1 }
|a, b| a + b
```

Lambda 可以**捕获**外层变量（在 lambda 内使用当前作用域中的变量）。

## 标准库中的向量宏

Move 标准库为 `vector` 提供了一批宏，替代手写 `while` 循环，使代码更简洁：

| 宏 | 含义 |
|----|------|
| `vec.do!( \|e\| ... )` | 对每个元素执行一次，消费向量 |
| `vec.do_ref!( \|e\| ... )` | 对每个元素的引用执行 |
| `vec.do_mut!( \|e\| ... )` | 对每个元素的可变引用执行 |
| `vec.destroy!( \|e\| ... )` | 消费向量，对每个元素调用给定函数（常用于销毁无 drop 的元素） |
| `vec.fold!(init, \|acc, e\| ... )` | 从左到右折叠为一个值 |
| `vec.filter!( \|e\| cond )` | 过滤（要求元素类型有 drop） |
| `n.do!( \|_\| ... )` | 将某操作重复 n 次（如 `32u8.do!(\|_\| ...)`) |
| `vector::tabulate!(n, \|i\| ...)` | 生成长度为 n 的向量，元素由下标 i 计算 |

示例：

```move
module book::vector_macros;

#[test]
fun do_and_fold() {
    let v = vector[1u64, 2, 3, 4, 5];
    let mut sum = 0u64;
    v.do_ref!(|e| sum = sum + *e);
    assert_eq!(sum, 15);

    let folded = v.fold!(0u64, |acc, e| acc + e);
    assert_eq!(folded, 15);
}

#[test]
fun tabulate() {
    let indices = vector::tabulate!(5, |i| i);
    assert_eq!(indices, vector[0u64, 1, 2, 3, 4]);
}
```

## Option 宏

`option::do!(opt, |value| ...)` 在为 `some` 时执行 lambda；`opt.destroy_or!(default)` 或 `opt.destroy_or!(abort E)` 用于取出值或提供默认/中止。

## 小结

- 宏用 `macro fun` 定义，类型与值参数以 `$` 开头，调用形式为 `name!(...)`。
- Lambda 类型为 `|T1, T2| -> R`，只能作为宏参数，可捕获外层变量。
- 标准库提供 `vector` 的 `do!`、`fold!`、`tabulate!`、`destroy!` 等宏，以及 `option` 的 `do!`、`destroy_or!`，推荐优先使用宏替代手写循环。


---


<!-- source: 05_move_basics/ownership-and-scope.md -->
## 6.9 所有权与作用域

# 所有权与作用域

Move 语言采用所有权（Ownership）模型来管理值的生命周期。每个变量都有一个所有者和一个作用域，当作用域结束时，变量会被丢弃（drop）。所有权可以通过赋值或函数调用来转移，这种机制从根本上杜绝了悬垂引用和双重释放等内存安全问题。

## 作用域

### 函数作用域

每个函数定义一个作用域。在函数内声明的变量属于该函数所有，当函数执行结束时，所有局部变量都会被丢弃：

```move
module book::scope_basic;

public struct Ticket has drop {
    event: vector<u8>,
}

fun create_and_drop() {
    let _ticket = Ticket { event: b"Concert" };
    // 函数结束时，_ticket 自动被丢弃（需要 drop 能力）
}

#[test]
fun scope() {
    create_and_drop();
}
```

### 块作用域

花括号 `{ }` 创建子作用域（block scope）。子作用域中声明的变量在块结束时被丢弃，但可以通过块的最后一个表达式将值转移出去：

```move
module book::block_scope;

#[test]
fun block_scope() {
    let x = {
        let inner = 42u64;
        inner  // 将所有权转移到外部作用域
    };
    // inner 在这里不可用，但它的值已经转移给了 x
    assert_eq!(x, 42);

    let result = {
        let a = 10u64;
        let b = 20u64;
        a + b  // 块的返回值
    };
    assert_eq!(result, 30);
}
```

### 嵌套作用域

作用域可以嵌套。内层作用域可以访问外层作用域的变量，但外层作用域无法访问内层的局部变量：

```move
module book::nested_scope;

#[test]
fun nested() {
    let outer = 100u64;

    {
        let _inner = outer + 1;  // 可以访问外层变量
        assert_eq!(_inner, 101);
        // _inner 在块结束时被丢弃
    };

    // _inner 在这里不可用
    assert_eq!(outer, 100);  // outer 依然有效
}
```

## 所有权转移

### 函数调用时的所有权转移

当将一个不可复制的值作为参数传递给函数时，所有权会转移到被调用的函数。原变量变得无效，不能再使用：

```move
module book::ownership_example;

public struct Ticket has drop {
    event: vector<u8>,
}

public struct UniqueItem {
    value: u64,
}

public fun create_ticket(): Ticket {
    Ticket { event: b"Concert" }  // 所有权转移给调用者
}

public fun use_ticket(ticket: Ticket) {
    let Ticket { event: _ } = ticket;  // ticket 在这里被消耗
}

#[test]
fun ownership() {
    let ticket = create_ticket();    // ticket 归当前函数所有
    // ticket 的所有权转移给 use_ticket，此后不再有效
    use_ticket(ticket);
    // let _ = ticket.event;  // 错误！ticket 已经被移动
}
```

### 赋值时的所有权转移

将一个不可复制的值赋给另一个变量时，所有权也会转移：

```move
module book::ownership_transfer;

public struct Token has drop {
    value: u64,
}

#[test]
fun assignment_move() {
    let token_a = Token { value: 100 };
    let _token_b = token_a;  // 所有权从 token_a 转移到 token_b
    // assert!(token_a.value == 100);  // 错误！token_a 已经被移动
    assert_eq!(_token_b.value, 100);    // token_b 是有效的所有者
}
```

### 返回值的所有权转移

函数的返回值将所有权转移给调用者：

```move
module book::ownership_return;

public struct Wrapper has drop {
    value: u64,
}

fun make_wrapper(): Wrapper {
    Wrapper { value: 42 }
    // 所有权转移给调用者，不会在函数结束时被丢弃
}

#[test]
fun return_ownership() {
    let wrapper = make_wrapper();  // 接收所有权
    assert_eq!(wrapper.value, 42);
    // wrapper 在测试函数结束时被丢弃
}
```

## 复制与移动

### 可复制类型

拥有 `copy` 能力的类型在赋值和传参时会自动复制，原变量仍然有效：

```move
module book::copy_example;

#[test]
fun copy_vs_move() {
    // u64 拥有 copy 能力，赋值时自动复制
    let a = 10u64;
    let b = a;      // a 被复制，仍然有效
    assert_eq!(a, 10);
    assert_eq!(b, 10);

    // bool 也拥有 copy 能力
    let flag = true;
    let flag_copy = flag;
    assert_eq!(flag, true);
    assert_eq!(flag_copy, true);
}
```

### 不可复制类型

没有 `copy` 能力的类型在赋值时会移动，原变量失效：

```move
module book::move_example;

public struct UniqueItem has drop {
    value: u64,
}

#[test]
fun unique_move() {
    let item = UniqueItem { value: 1 };
    let item2 = item;  // item 被移动到 item2
    // assert!(item.value == 1);  // 错误！item 已被移动
    assert_eq!(item2.value, 1);
}
```

### move 关键字

可以使用 `move` 关键字显式地表达所有权转移的意图，让代码更加清晰：

```move
module book::explicit_move;

public struct Resource has drop {
    data: u64,
}

fun consume(resource: Resource) {
    let Resource { data: _ } = resource;
}

#[test]
fun explicit_move() {
    let resource = Resource { data: 42 };
    consume(move resource);  // 显式移动
    // resource 在这里不再有效
}
```

## 析构与 drop

### 显式析构

对于没有 `drop` 能力的类型，必须显式析构（解包）来消耗它们：

```move
module book::destruct_example;

public struct Receipt {
    amount: u64,
    paid: bool,
}

public fun create_receipt(amount: u64): Receipt {
    Receipt { amount, paid: true }
}

const ENotPaid: u64 = 0;

// 必须通过解包来消耗 Receipt
public fun verify_and_consume(receipt: Receipt): u64 {
    let Receipt { amount, paid } = receipt;
    assert!(paid, ENotPaid);
    amount
}

#[test]
fun destruct() {
    let receipt = create_receipt(500);
    let amount = verify_and_consume(receipt);
    assert_eq!(amount, 500);
}
```

### drop 能力

拥有 `drop` 能力的类型可以在作用域结束时自动丢弃，无需显式析构：

```move
module book::drop_example;

public struct Droppable has drop {
    value: u64,
}

public struct NotDroppable {
    value: u64,
}

#[test]
fun auto_drop() {
    let _d = Droppable { value: 1 };
    // 函数结束时自动丢弃，无需处理

    let nd = NotDroppable { value: 2 };
    // 必须显式析构
    let NotDroppable { value: _ } = nd;
}
```

## 小结

Move 的所有权模型确保了每个值在任意时刻只有一个所有者。值通过赋值、函数参数和返回值来转移所有权。拥有 `copy` 能力的类型可以复制，不可复制类型在赋值时会移动，原变量随即失效。作用域（函数和块）限定了变量的生命周期，作用域结束时变量被丢弃。没有 `drop` 能力的类型必须显式析构，这一机制可以用来实现"不可丢弃"的资源模式，保证重要操作不会被遗漏。


---


<!-- source: 05_move_basics/references.md -->
## 6.10 引用（& 与 &mut）

# 引用

引用（Reference）允许在不转移所有权的情况下访问值。Move 提供两种引用类型：不可变引用 `&T`（只读访问）和可变引用 `&mut T`（读写访问）。引用是 Move 中最常用的参数传递方式，通过借用检查器（borrow checker）在编译期保证引用的安全使用。

## 引用运算符一览

| 语法 | 类型 | 说明 |
|------|------|------|
| `&e` | `&T`（e: T 且 T 非引用） | 创建不可变引用 |
| `&mut e` | `&mut T` | 创建可变引用 |
| `&e.f` | `&T`（e.f: T） | 对字段 f 的不可变引用 |
| `&mut e.f` | `&mut T` | 对字段 f 的可变引用 |
| `freeze(e)` | `&T`（e: &mut T） | 将可变引用转为不可变引用 |

`&e.f` / `&mut e.f` 既可对结构体直接取字段引用，也可在已有引用上“延伸”（如 `&s_ref.f`）。同一模块内的嵌套结构体可链式写：`&a.b.c`。注意：**引用不能再次取引用**，即不存在 `&&T`。

## 引用类型

### 不可变引用 &T

不可变引用提供只读访问，不能通过它修改值：

```move
module book::immutable_ref;

public struct Wallet has drop {
    balance: u64,
}

public fun new(balance: u64): Wallet {
    Wallet { balance }
}

// 接收不可变引用，只能读取
public fun balance(wallet: &Wallet): u64 {
    wallet.balance
}

#[test]
fun immutable_ref() {
    let wallet = new(100);
    let b = balance(&wallet);   // 创建不可变引用
    assert_eq!(b, 100);
    // wallet 仍然有效，所有权没有转移
    assert_eq!(balance(&wallet), 100);
}
```

### 可变引用 &mut T

可变引用提供读写访问，可以修改被引用的值：

```move
module book::mutable_ref;

public struct Wallet has drop {
    balance: u64,
}

public fun new(balance: u64): Wallet {
    Wallet { balance }
}

// 接收可变引用，可以修改值
public fun deposit(wallet: &mut Wallet, amount: u64) {
    wallet.balance = wallet.balance + amount;
}

public fun balance(wallet: &Wallet): u64 {
    wallet.balance
}

#[test]
fun mutable_ref() {
    let mut wallet = new(100);
    deposit(&mut wallet, 50);      // 创建可变引用
    assert_eq!(balance(&wallet), 150);
    deposit(&mut wallet, 30);
    assert_eq!(balance(&wallet), 180);
}
```

## 实际案例：地铁卡

用一个地铁卡的例子来理解引用的三种使用方式——购买（获取所有权）、出示（不可变借用）、刷卡（可变借用）、回收（转移所有权）：

```move
module book::reference_example;

public struct Card has drop {
    rides: u64,
}

const ENoRides: u64 = 0;

// 购买：返回拥有的 Card
public fun purchase(): Card {
    Card { rides: 5 }
}

// 出示：不可变借用（只读）
public fun remaining_rides(card: &Card): u64 {
    card.rides
}

// 刷卡：可变借用（修改）
public fun use_ride(card: &mut Card) {
    assert!(card.rides > 0, ENoRides);
    card.rides = card.rides - 1;
}

// 回收：获取所有权（消耗）
public fun recycle(card: Card) {
    let Card { rides: _ } = card;
}

#[test]
fun references() {
    let mut card = purchase();

    // 不可变借用 —— 只是查看
    assert_eq!(remaining_rides(&card), 5);

    // 可变借用 —— 修改状态
    use_ride(&mut card);
    use_ride(&mut card);
    assert_eq!(remaining_rides(&card), 3);

    // 移动 —— 转移所有权
    recycle(card);
    // card 在这里不再有效
}
```

## 解引用

### 使用 * 解引用

对引用使用 `*` 运算符可以获取引用指向的值的副本。被引用的类型必须拥有 `copy` 能力：

```move
module book::deref_example;

#[test]
fun deref() {
    let value = 42u64;
    let ref_value = &value;

    // 解引用获取值的副本
    let copied = *ref_value;
    assert_eq!(copied, 42);
    assert_eq!(value, 42);  // 原值不受影响
}
```

### 通过可变引用修改

可以通过解引用可变引用来修改值。**读** `*e` 要求被引用类型有 `copy` 能力（读会复制值）；**写** `*e1 = e2` 要求被引用类型有 `drop` 能力（写会丢弃旧值）。因此不能通过引用复制或销毁“资源”类型（如无 copy/drop 的资产）。

```move
module book::deref_mut;

#[test]
fun deref_mut() {
    let mut value = 10u64;
    let ref_mut = &mut value;
    *ref_mut = 20;
    assert_eq!(value, 20);
}
```

### freeze 与子类型

在需要 `&T` 的地方可以传入 `&mut T`：编译器会在需要时插入 `freeze`，将可变引用视为不可变使用。因此类型系统把 **`&mut T` 当作 `&T` 的子类型**：任何接受 `&T` 的表达式也可以接受 `&mut T`，反之则不成立（不能把 `&T` 赋给 `&mut T` 或传给需要 `&mut T` 的参数）。

### 引用的复制与 Move 与 Rust 的差异

在 Move 中，**引用可以被多次复制**，同一时刻存在多个对同一值的引用（包括多个 `&mut`）在类型上是被允许的；只有在**通过可变引用写入**时，才要求该可变引用是“唯一可写”的。这与 Rust 的“同一时刻只能有一个 &mut”的规则不同，但写入前的唯一性保证同样严格。

### 引用不可存储

引用和元组是**仅有的**不能作为结构体字段类型存储的类型，因此引用不能进入全局存储或 Sui 对象，只能在一次执行过程中临时存在，程序结束时全部销毁。这是 Move 与允许在结构体中存引用的 Rust 的又一区别。

## 借用规则

### 基本规则

Move 的借用检查器确保引用的安全使用，遵循以下规则：

1. **在任意时刻**，对同一个值要么有一个可变引用，要么有多个不可变引用，但不能同时拥有两者
2. **引用不能悬垂**——被引用的值在引用存在期间不能被移动或丢弃
3. **不能返回对局部变量的引用**——局部变量在函数结束时被丢弃，引用会变成悬垂引用

```move
module book::borrow_rules;

public struct Data has drop, copy {
    value: u64,
}

#[test]
fun multiple_immutable() {
    let data = Data { value: 42 };
    let ref1 = &data;
    let ref2 = &data;
    // 多个不可变引用可以同时存在
    assert_eq!(ref1.value, 42);
    assert_eq!(ref2.value, 42);
}

#[test]
fun mutable_exclusive() {
    let mut data = Data { value: 42 };
    let ref_mut = &mut data;
    // 可变引用期间，不能有其他引用
    ref_mut.value = 100;
    assert_eq!(data.value, 100);
}
```

### 引用不能返回局部变量

函数不能返回对局部变量的引用，因为局部变量在函数结束后就不存在了：

```move
module book::no_dangling;

public struct Container has drop {
    value: u64,
}

// 这是正确的 —— 返回对参数的引用（getter 以字段名命名，无 get_ 前缀）
public fun value(container: &Container): &u64 {
    &container.value
}

// 以下代码无法编译：
// fun dangling_ref(): &u64 {
//     let local = 42u64;
//     &local  // 错误！local 在函数结束时被丢弃
// }

#[test]
fun ref_to_field() {
    let container = Container { value: 99 };
    let value_ref = value(&container);
    assert_eq!(*value_ref, 99);
}
```

## 引用与所有权的选择

在设计函数签名时，选择合适的参数类型：

| 参数类型 | 含义 | 调用后原值 |
|---------|------|-----------|
| `T` | 获取所有权 | 原变量失效 |
| `&T` | 不可变借用 | 原变量仍有效 |
| `&mut T` | 可变借用 | 原变量仍有效（可能被修改） |

```move
module book::ref_choice;

public struct Account has drop {
    balance: u64,
}

// 获取所有权 —— 消耗 Account
public fun close(account: Account): u64 {
    let Account { balance } = account;
    balance
}

// 不可变借用 —— 只读查询（getter 以字段名命名）
public fun balance(account: &Account): u64 {
    account.balance
}

// 可变借用 —— 修改状态
public fun deposit(account: &mut Account, amount: u64) {
    account.balance = account.balance + amount;
}

#[test]
fun ref_choice() {
    let mut account = Account { balance: 100 };

    // 查询 —— 不可变借用
    assert_eq!(balance(&account), 100);

    // 修改 —— 可变借用
    deposit(&mut account, 50);
    assert_eq!(balance(&account), 150);

    // 关闭 —— 转移所有权
    let final_balance = close(account);
    assert_eq!(final_balance, 150);
}
```

## 小结

引用是 Move 中访问值的核心机制。不可变引用 `&T` 提供只读访问，可变引用 `&mut T` 提供读写访问，两者都不会转移所有权。借用检查器在编译期确保同一时刻不会同时存在可变引用和不可变引用，也不允许返回对局部变量的引用。在设计函数签名时，应根据需要选择参数类型：只读查询用 `&T`，需要修改用 `&mut T`，需要消耗或转移用 `T`。


---


<!-- source: 07_move_advanced/index.md -->
## 第七章 · Move 语法高级

# 第七章 · Move 语法高级

本章介绍泛型与类型反射，涉及类型参数、能力约束以及运行时类型信息，是编写可复用、类型安全的 Move 库与框架的必备内容。

## 本章内容

| 节 | 主题 | 核心知识点 |
|---|------|-----------|
| 7.1 | 泛型基础 | 泛型函数与泛型结构体、类型参数、多类型参数 |
| 7.2 | 类型参数与能力约束 | 能力约束、幻影类型参数、泛型与对象 |
| 7.3 | 类型反射 | type_name 模块、运行时类型信息与使用场景 |
| 7.4 | 编译模式（Modes） | #[mode(name)]、--mode 构建、不可发布代码 |
| 7.5 | 下标语法（Index Syntax） | #[syntax(index)]、自定义类型的索引访问与规则 |

## 学习目标

读完本章后，你将能够：

- 编写泛型函数与泛型结构体，并正确施加能力约束
- 理解 phantom 类型参数的作用与用法
- 在需要时使用类型反射获取运行时类型信息
- 使用编译模式控制调试/测试等不可发布代码的编入与发布安全
- 为自定义类型定义下标语法（#[syntax(index)]）并遵守只读/可写成对规则


---


<!-- source: 05_move_basics/generics-basics.md -->
## 7.1 泛型基础

# 泛型基础

泛型（Generics）允许在未指定具体类型的情况下定义函数和结构体，实现代码复用与抽象。Move 使用尖括号 `<T>` 声明类型参数，类型参数可用于参数类型、返回类型和函数体。

## 泛型函数

```move
module book::generic_fun;

public fun identity<T>(value: T): T {
    value
}

public fun make_pair<T, U>(first: T, second: U): (T, U) {
    (first, second)
}

#[test]
fun generic_fun() {
    let x = identity(42u64);
    assert_eq!(x, 42);
    let (a, b) = make_pair(10u64, true);
    assert_eq!(a, 10);
    assert_eq!(b, true);
}
```

编译器通常可根据上下文推断类型参数。无法推断时，可使用 `function_name<Type>()` 显式指定。

## 泛型结构体

结构体也可以使用泛型类型参数：

```move
module book::generic_struct;

public struct Container<T: drop> has drop {
    value: T,
}

public fun new<T: drop>(value: T): Container<T> {
    Container { value }
}

public fun value<T: drop + copy>(container: &Container<T>): T {
    container.value
}
```

## 多类型参数

函数和结构体可以有多个类型参数：

```move
public struct Pair<T: copy + drop, U: copy + drop> has copy, drop {
    first: T,
    second: U,
}
```

## 小结

- **泛型函数**：`fun name<T>(...)`，类型参数可用于参数与返回值
- **泛型结构体**：`struct Name<T> { ... }`
- **类型推断**：多数情况可省略显式类型；必要时使用 `name<Type>()`


---


<!-- source: 05_move_basics/type-parameters-and-constraints.md -->
## 7.2 类型参数与能力约束

# 类型参数与能力约束

对泛型类型参数施加 **能力约束**（ability constraints），可以要求类型具备 `copy`、`drop`、`store`、`key` 等能力。**幻影类型参数**（phantom）不占用存储空间，仅用于类型层面的区分，常用于实现类型安全的抽象（如不同货币）。

## 能力约束

对类型参数添加能力约束，要求传入的类型必须满足相应能力：

```move
module book::generic_constraints;

public struct Copyable<T: copy + drop> has copy, drop {
    value: T,
}

public struct Storable<T: store> has store {
    value: T,
}

public fun duplicate<T: copy>(value: &T): T {
    *value
}
```

常见约束组合：

| 约束 | 含义 |
|------|------|
| `T: drop` | T 可以被丢弃 |
| `T: copy` | T 可以被复制 |
| `T: copy + drop` | T 可复制和丢弃 |
| `T: store` | T 可存储在全局对象中 |
| `T: key + store` | T 可作为顶层对象 |

## 幻影类型参数

当类型参数未在结构体字段中使用、仅用于类型区分时，需用 `phantom` 标记：

```move
module book::generics_phantom;

public struct USD {}
public struct EUR {}

public struct Balance<phantom Currency> has store, drop {
    amount: u64,
}

public fun new_balance<Currency>(amount: u64): Balance<Currency> {
    Balance { amount }
}

public fun merge<Currency>(b1: &mut Balance<Currency>, b2: Balance<Currency>) {
    let Balance { amount } = b2;
    b1.amount = b1.amount + amount;
}
```

这样只能合并相同“货币”类型的余额，在编译期防止类型混用。

## 泛型与对象

在 Sui 中，泛型常与对象结合，实现通用对象容器（如 `Container<T: store> has key, store`），并通过 `store` 等能力约束保证类型可安全存储。

## 小结

- **能力约束**：`T: copy + drop`、`T: store` 等，确保类型参数满足所需能力
- **phantom**：不占存储，仅用于类型区分；零运行时开销、编译期类型安全
- **泛型对象**：结合 `key`/`store` 实现可存储的泛型对象


---


<!-- source: 05_move_basics/type-reflection.md -->
## 7.3 类型反射

# 类型反射

Move 提供有限的运行时类型反射能力，主要通过 `std::type_name` 模块实现。类型反射允许在运行时获取类型的名称、模块信息和包地址等元数据，常用于在集合中存储类型信息、实现类型分发逻辑或调试。虽然反射能力有限，但在很多场景下已经足够实用。

## type_name 模块

### 获取类型名称

`type_name::get<T>()` 函数返回一个 `TypeName` 结构体，包含类型 `T` 的元数据信息：

```move
module book::reflection_basic;

use std::type_name;

public struct MyType has drop {}

#[test]
fun get_type_name() {
    let my_type_name = type_name::get<MyType>();
    let u64_type_name = type_name::get<u64>();
    let bool_type_name = type_name::get<bool>();

    // 不同类型的 TypeName 不相等
    assert!(u64_type_name != bool_type_name);

    let _ = my_type_name;
}
```

### 类型名称字符串

通过 `into_string()` 方法可以将 `TypeName` 转换为 ASCII 字符串，获取完整的类型名称：

```move
module book::reflection_string;

use std::type_name;
use std::ascii::String;

public struct Token has drop {}

#[test]
fun type_string() {
    let type_name = type_name::get<Token>();
    let name_str: String = type_name.into_string();

    // name_str 包含完整的类型路径，如 "0x...::reflection_string::Token"
    let _ = name_str;
}
```

## TypeName 方法

### 提取模块和地址信息

`TypeName` 提供了多个方法来提取类型的各部分信息：

```move
module book::reflection_example;

use std::type_name;
use std::ascii::String;

public struct MyType has drop {}

#[test]
fun type_reflection() {
    let type_name = type_name::get<MyType>();

    // 获取完整的类型名称字符串
    let name_str: String = type_name.into_string();

    // 获取模块名称
    let module_name = type_name.get_module();

    // 获取包地址
    let address = type_name.get_address();

    // 类型比较
    let u64_name = type_name::get<u64>();
    let bool_name = type_name::get<bool>();
    assert!(u64_name != bool_name);

    let _ = name_str;
    let _ = module_name;
    let _ = address;
}
```

### 原始类型的判断

`is_primitive()` 方法可以判断一个类型是否为原始类型（如 `u8`、`u64`、`bool`、`address` 等）：

```move
module book::reflection_primitive;

use std::type_name;

public struct CustomType has drop {}

#[test]
fun is_primitive() {
    let u64_name = type_name::get<u64>();
    let bool_name = type_name::get<bool>();
    let custom_name = type_name::get<CustomType>();

    assert!(u64_name.is_primitive());
    assert!(bool_name.is_primitive());
    assert!(!custom_name.is_primitive());
}
```

## Defining ID 与 Original ID

### 两种包标识

Move 在类型反射中区分两种包标识：

- **Original ID**（原始 ID）：类型首次发布时所在的包地址
- **Defining ID**（定义 ID）：引入该类型的包地址（在包升级后可能不同）

当包没有被升级时，两者相同。当包经过升级后，新版本的包地址与原始包地址不同，这时两个 ID 的区别就显现出来了：

```move
module book::reflection_ids;

use std::type_name;

public struct VersionedType has drop {}

#[test]
fun type_ids() {
    // get 方法使用 defining ID
    let with_defining = type_name::get<VersionedType>();

    // get_with_original_ids 使用 original ID
    let with_original = type_name::get_with_original_ids<VersionedType>();

    // 未升级时两者相同
    let _ = with_defining;
    let _ = with_original;
}
```

## 实际应用场景

### 在集合中存储类型信息

类型反射常用于在动态字段或表中以类型作为键：

```move
module book::reflection_usage;

use std::type_name::{Self, TypeName};
use std::ascii::String;

public struct TypeRegistry has drop {
    registered: vector<TypeName>,
}

public fun new_registry(): TypeRegistry {
    TypeRegistry { registered: vector[] }
}

public fun register<T>(registry: &mut TypeRegistry) {
    let type_name = type_name::get<T>();
    registry.registered.push_back(type_name);
}

public fun is_registered<T>(registry: &TypeRegistry): bool {
    let type_name = type_name::get<T>();
    let mut i = 0;
    while (i < registry.registered.length()) {
        if (registry.registered[i] == type_name) {
            return true
        };
        i = i + 1;
    };
    false
}

public struct TokenA has drop {}
public struct TokenB has drop {}
public struct TokenC has drop {}

#[test]
fun registry() {
    let mut registry = new_registry();

    register<TokenA>(&mut registry);
    register<TokenB>(&mut registry);

    assert!(is_registered<TokenA>(&registry));
    assert!(is_registered<TokenB>(&registry));
    assert!(!is_registered<TokenC>(&registry));
}
```

### 类型信息调试

在开发和测试阶段，类型反射可以帮助调试泛型代码：

```move
module book::reflection_debug;

use std::type_name;
use std::ascii::String;

public fun type_info<T>(): String {
    let type_name = type_name::get<T>();
    type_name.into_string()
}

#[test]
fun debug_info() {
    let u64_info = type_info<u64>();
    let bool_info = type_info<bool>();

    // 可以在测试中打印或断言类型信息
    assert!(u64_info != bool_info);
}
```

## 小结

Move 通过 `std::type_name` 模块提供有限但实用的运行时类型反射能力。`type_name::get<T>()` 返回 `TypeName` 结构体，可以获取类型的完整名称、模块名、包地址等元数据。`is_primitive()` 用于判断是否为原始类型。Move 还区分 Defining ID 和 Original ID 来处理包升级后的类型标识问题。类型反射在动态集合的类型键、类型注册表和调试等场景中非常有用。


---


<!-- source: 05_move_basics/compilation-modes.md -->
## 7.4 编译模式（Modes）

# 编译模式（Modes）

**编译模式**（Modes）允许你只在显式启用某个命名构建模式时，才把**不可发布**的代码编入包中。可以把它理解为 `#[test_only]` 的泛化：除了内置的 `test` 模式外，你还可以定义 `debug`、`benchmark`、`spec` 等任意模式，用于调试、压测或规范代码。

## 要点一览

- 使用 `#[mode(name, ...)]` 标注模块或成员；`#[test_only]` 是 `#[mode(test)]` 的简写。
- 使用 `--mode <name>`（或 `--test` 跑单测）构建时，只有标注了该模式的项会被编入；未匹配的项会被**排除**。
- **只要启用了任意模式**（包括 `--test`），生成的产物都**不可发布**，从而保证调试/测试代码不会上链。
- **未标注** `#[mode(...)]` / `#[test_only]` 的项**始终**会被编入。

> 提示：模式是编译期过滤，不影响运行时字节码。适合用于调试辅助、模拟器和不应发布的 mock 类型与函数。

## 语法

与 `#[test_only]` 一样，可以把模式属性挂在模块或单个成员上：

```move
// 整个模块仅在启用对应模式时编入
#[mode(debug)]
module my_pkg::debug_tools {
    public fun dump_state() { /* ... */ }
}

module my_pkg::library {
    // 仅在 debug 或 test 构建中存在
    #[mode(debug, test)]
    public fun assert_invariants() { /* ... */ }

    // 仅测试；等价于 #[mode(test)]
    #[test_only]
    fun mk_fake() { /* ... */ }
}
```

一个属性中可以写多个模式：`#[mode(name1, name2, ...)]`。只要**任一**列出的模式被启用，该项就会被编入。**没有**模式标注的项始终编入。

> `#[mode(test)]` 与 `#[test_only]` 等价。

## 如何按模式构建

用 Sui CLI 在构建或测试时启用模式：

```bash
# 启用自定义模式构建
sui move build --mode debug

# 跑单测（自动包含 #[test_only]）
sui move test --test

# 同时启用 test 与 debug（例如带调试输出的测试）
sui move test --test --mode debug
```

启用某模式时，标注了该模式的项会被编入；只标注了其他模式的项会被排除；未标注的项始终编入。

> **发布前**：只要用过 `--mode` 或 `--test` 构建，产物都不可发布。发布前请用**不带** `--mode`/`--test` 的干净构建：`sui move build`。

## test 模式（单元测试）

`#[test_only]` 即内置的 `test` 模式，行为与 `#[mode(test)]` 一致。使用 `sui move test --test` 时，会自动启用 `test` 模式，从而编入所有 `#[test_only]` 的模块和函数。详见第十二章「测试」。

## 自定义模式示例：debug

例如你希望只在开发/调试时编入带日志的包装函数，而不影响正式构建：

```move
#[mode(debug)]
module my_pkg::bank_debug {
    use std::debug;
    use my_pkg::bank;

    public fun transfer_with_logs(from: &signer, to: address, amount: u64) {
        debug::print(&b"[DEBUG] transfer".to_vector());
        bank::transfer(from, to, amount);
    }
}
```

构建时若不加 `--mode debug`，`bank_debug` 不会被编入；用 `sui move build --mode debug` 或 `sui move test --test --mode debug` 时才会包含。

## 小结

- **编译模式**：`#[mode(name, ...)]` 控制项在何种构建下被编入；`#[test_only]` ≡ `#[mode(test)]`。
- **构建**：`sui move build --mode <name>`、`sui move test --test`（自动启用 test）。
- **发布**：启用任意模式后的产物不可发布；发布前必须执行不带 `--mode`/`--test` 的 `sui move build`。


---


<!-- source: 05_move_basics/index-syntax.md -->
## 7.5 下标语法（Index Syntax）

# 下标语法（Index Syntax）

Move 通过 **语法属性** 允许你为自定义类型定义像内置语法一样的操作，在编译期将写法“降级”为你提供的函数调用。**下标语法**（`#[syntax(index)]`）让你可以为类型定义类似 `v[i]`、`m[i,j]` 的索引访问，使 API 更直观、可链式使用。

## 概述

标准库中的 `vector` 通过 `#[syntax(index)]` 标记了 `borrow` 与 `borrow_mut`，因此支持 `v[i]`、`&v[i]`、`&mut v[i]`。你可以在**定义该类型的同一模块内**为自定义类型声明只读和可写的“下标”函数，满足一定规则后，该类型的值就可以使用 `obj[index_expr]` 形式的读写。

## 示例：矩阵类型

下面为矩阵类型定义下标访问，支持 `m[i, j]` 和 `&mut m[i, j]`：

```move
module matrix::matrix;

public struct Matrix<T> has drop {
    v: vector<vector<T>>,
}

#[syntax(index)]
public fun borrow<T>(s: &Matrix<T>, i: u64, j: u64): &T {
    vector::borrow(vector::borrow(&s.v, i), j)
}

#[syntax(index)]
public fun borrow_mut<T>(s: &mut Matrix<T>, i: u64, j: u64): &mut T {
    vector::borrow_mut(vector::borrow_mut(&mut s.v, i), j)
}

public fun make_matrix<T>(v: vector<vector<T>>): Matrix<T> {
    Matrix { v }
}
```

使用方式：

```move
let mut m = matrix::make_matrix(vector[
    vector[1, 0, 0],
    vector[0, 1, 0],
    vector[0, 0, 1],
]);
assert!(m[0, 0] == 1);
*(&mut m[1, 1]) = 2;
```

## 编译期如何翻译

编译器根据“只读 / 可变”和“是否再取引用”将下标表达式翻译为对应的函数调用：

| 写法 | 翻译为 |
|------|--------|
| `mat[i, j]`（只读，且类型有 copy） | `copy matrix::borrow(&mat, i, j)` |
| `&mat[i, j]` | `matrix::borrow(&mat, i, j)` |
| `&mut mat[i, j]` | `matrix::borrow_mut(&mut mat, i, j)` |

下标可与字段访问混合：`&input.vs[0].v[0]` 会按嵌套的 `borrow` 链正确解析。

## 定义规则

1. **属性与模块**：带有 `#[syntax(index)]` 的函数必须与“被索引的类型”在**同一模块**中定义。
2. **可见性**：下标函数必须是 `public`，以便在使用该类型的任意位置都能解析到。
3. **第一个参数（接收者）**：第一个参数必须是**引用**（`&T` 或 `&mut T`），且类型 `T` 必须是本模块定义的类型（不能是元组、类型参数或按值）。
4. **返回值**：只读版本返回 `&Element`，可写版本返回 `&mut Element`；可变性与第一个参数一致。
5. **成对**：每个类型最多一个“只读下标”和一个“可写下标”；只读与可写版本在类型参数个数、约束、其余参数类型上必须一致（仅可变性不同）。

### 不可作为下标接收者的类型

- 元组：`(A, B)` 不能作为第一个参数类型。
- 类型参数：`T` 不能作为接收者类型。
- 按值：第一个参数不能是值（必须是 `&` / `&mut`）。

### 只读与可写版本的类型兼容

两个版本必须：

- 类型参数个数、约束、使用方式一致；
- 除可变性外，第一个参数类型和返回类型一致；
- 除接收者外的所有参数类型完全一致。

这样无论当前表达式是只读还是可写，下标语义都一致。

## 小结

- 使用 `#[syntax(index)]` 在**同一模块**内为类型定义 `borrow`（只读）和 `borrow_mut`（可写），即可对该类型的值使用 `obj[index_expr]` 和 `&mut obj[index_expr]`。
- 编译器将下标按“是否可变、是否再取引用”翻译为对应函数调用。
- 自定义下标可带多个索引参数（如 `m[i, j]`），也可用于实现“带默认值的索引”等更复杂语义；具体规则见 [Move Reference - Index Syntax](https://move-book.com/reference/index-syntax)。


---


# ==================== 对象篇 ====================



---


<!-- source: 06_object_model/index.md -->
## 第八章 · 对象模型

# 第八章 · 对象模型

本章深入讲解 Sui 独创的对象模型，这是 Sui 区别于其他区块链的核心设计，也是理解 Sui Move 编程的关键。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 8.1 | 数字资产的语言 | Move 为何天生适合表达数字资产 |
| 8.2 | 什么是对象 | 对象的定义、结构（UID + 字段）、与值的区别 |
| 8.3 | 对象所有权 | 四种所有权模型总览 |
| 8.3.1 | 地址所有 | 创建、转移、独占访问 |
| 8.3.2 | 不可变对象 | freeze_object、共享常量数据 |
| 8.3.3 | 共享对象 | share_object、并发访问、共识要求 |
| 8.3.4 | 包装对象 | 嵌套存储、取出与销毁 |
| 8.3.5 | Party 对象 | 混合所有权、共识版本、party_transfer、权限 |
| 8.4 | 快速路径与共识 | owned object 的性能优势 |

## 学习目标

读完本章后，你将能够：

- 解释 Sui 对象模型与 EVM 账户模型的区别
- 根据场景选择合适的所有权类型
- 理解快速路径对性能的影响


---


<!-- source: 06_object_model/digital-assets.md -->
## 8.1 数字资产的语言

# 数字资产的语言

Move 语言从设计之初就将**数字资产**作为一等公民（first-class citizen）来对待。与传统的智能合约语言不同，Move 通过其类型系统在语言层面保障资产的安全性，让开发者可以像操作普通数据类型一样自然地表达数字资产的创建、转移和销毁。本章将探讨 Move 为何是表达数字资产的理想语言，以及它如何从根本上解决了区块链资产管理中的常见问题。

## 传统区块链语言的资产表达困境

在理解 Move 的优势之前，我们需要先了解传统方案的不足。

### ERC-20 与 ERC-721 的本质问题

以太坊的 ERC-20（同质化代币）和 ERC-721（非同质化代币）标准本质上只是**记账模型**——它们使用 `mapping(address => uint256)` 这样的映射表来记录谁拥有多少代币。这带来了几个根本性问题：

- **资产不是独立实体**：代币余额只是合约内部状态中的一个数字，它没有独立的身份和生命周期。
- **安全性依赖开发者自律**：重入攻击、整数溢出、授权漏洞等问题反复出现，因为语言本身不提供资产安全的保障。
- **标准碎片化**：ERC-20、ERC-721、ERC-1155……每种资产类型需要独立的标准和实现，增加了复杂性。

### Move 的解决方案

Move 采用了完全不同的思路：**资产即类型**。一个数字资产就是一个 Move 结构体（struct），其安全属性由类型系统在编译期强制保证。不需要任何外部标准或约定，语言本身就知道如何正确处理资产。

## 数字资产的三大本质属性

任何真正的数字资产都应具备三个关键属性。Move 通过其独特的能力（ability）系统来强制保障这些属性。

### 所有权（Ownership）

每个数字资产必须有明确的所有者。在 Move on Sui 中，每个对象都有一个确定的所有者——可以是一个地址、另一个对象，或者被共享/冻结。

所有权不是通过查询合约内部映射表来确定的，而是**由运行时直接追踪**的。这意味着：

- 只有所有者可以在交易中使用该对象
- 所有权的转移是原子性的
- 无需担心授权和代理的复杂逻辑

### 不可复制（Non-copyable）

现实世界中，你不能复制一幅画或一枚金币。数字资产也应如此。Move 中，除非显式声明 `copy` 能力，结构体默认是**不可复制**的。这意味着：

- 数字资产不会被意外或恶意地"复制"
- 资产的总量始终是可控的
- "双重支付"在类型系统层面就被杜绝了

### 不可丢弃（Non-discardable）

你不能让一枚有价值的代币凭空消失。在 Move 中，除非显式声明 `drop` 能力，结构体在作用域结束时**必须被显式处理**——要么转移给他人，要么通过解构（destructure）来销毁。编译器会强制检查这一点：

- 忘记处理资产会导致编译错误
- 资产不会因为编程疏忽而丢失
- 每个资产的完整生命周期都是可追踪的

## Move 的类型系统如何保障资源安全

Move 的**线性类型系统**（linear type system）是其安全保障的核心。它的四种能力（abilities）精确控制了类型的行为：

| 能力 | 含义 | 对资产的影响 |
|------|------|-------------|
| `key` | 可以作为对象存储 | 使结构体成为链上对象 |
| `store` | 可以嵌入其他对象 | 允许资产被包装和组合 |
| `copy` | 可以被复制 | 资产通常**不应**具有此能力 |
| `drop` | 可以被隐式丢弃 | 资产通常**不应**具有此能力 |

一个典型的数字资产只需要 `key` 能力（可能加上 `store`），而刻意**不赋予** `copy` 和 `drop`。这样，Move 编译器就会自动保证该资产不能被复制或丢弃。

## 代码示例：一个简单的数字资产

下面的示例展示了如何在 Sui 上定义一个数字资产——一幅画作（Painting）。注意它只有 `key` 能力，没有 `copy` 和 `drop`：

```move
module examples::digital_asset;

/// A simple digital asset - a Painting
public struct Painting has key {
    id: UID,
    artist: address,
    title: vector<u8>,
    year: u64,
}

/// Create a new painting - ownership is granted to the creator
public fun create(
    title: vector<u8>,
    year: u64,
    ctx: &mut TxContext,
): Painting {
    Painting {
        id: object::new(ctx),
        artist: ctx.sender(),
        title,
        year,
    }
}

/// Transfer a painting to a new owner
/// After this call, the original owner loses all control
public fun give_to(painting: Painting, recipient: address) {
    transfer::transfer(painting, recipient);
}
```

### 代码要点分析

1. **`has key`**：`Painting` 具有 `key` 能力，这使它成为一个 Sui 对象，可以被独立拥有和追踪。
2. **`id: UID`**：每个 Sui 对象的第一个字段必须是 `id: UID`，这是其全局唯一标识符。
3. **没有 `copy`**：你无法复制一幅画，`let copy = painting;` 这样的代码会编译失败。
4. **没有 `drop`**：你不能忽略一幅画，函数结束时如果 `Painting` 没有被转移或解构，编译器会报错。
5. **`give_to` 接收值而非引用**：`painting: Painting` 是按值传递的。调用此函数后，调用者**完全失去**对这幅画的控制权——这就是真正的所有权转移。

## 与传统方案的对比

让我们用一个表格来对比 Move 和传统 ERC 标准在资产管理上的差异：

| 特性 | ERC-20/ERC-721 | Move |
|------|---------------|------|
| 资产表达 | 映射表中的数字 | 独立的结构体实例 |
| 所有权保障 | 开发者自行实现 | 运行时自动追踪 |
| 防止复制 | 依赖业务逻辑 | 类型系统编译期保证 |
| 防止丢失 | 无保障 | 编译器强制检查 |
| 可组合性 | 需要额外标准 | 结构体自然组合 |
| 安全审计 | 需要大量人工审查 | 编译器自动验证关键属性 |

## 更复杂的资产示例

在实际开发中，数字资产通常更复杂。以下示例展示了一个带有稀有度和属性的游戏道具：

```move
module examples::game_item;

use std::string::String;

/// 稀有度枚举
public struct Rarity has store, copy, drop {
    level: u8, // 1=普通, 2=稀有, 3=史诗, 4=传说
}

/// 游戏道具 - 不可复制、不可丢弃的数字资产
public struct GameItem has key, store {
    id: UID,
    name: String,
    rarity: Rarity,
    power: u64,
    creator: address,
}

/// 铸造一个新的游戏道具
public fun mint(
    name: String,
    rarity_level: u8,
    power: u64,
    ctx: &mut TxContext,
): GameItem {
    assert!(rarity_level >= 1 && rarity_level <= 4, 0);
    GameItem {
        id: object::new(ctx),
        name,
        rarity: Rarity { level: rarity_level },
        power,
        creator: ctx.sender(),
    }
}

/// 销毁道具（回收），只有创建者可以销毁
public fun burn(item: GameItem, ctx: &TxContext) {
    assert!(item.creator == ctx.sender(), 1);
    let GameItem { id, name: _, rarity: _, power: _, creator: _ } = item;
    id.delete();
}

/// 读取道具的属性
public fun power(item: &GameItem): u64 {
    item.power
}

public fun rarity_level(item: &GameItem): u8 {
    item.rarity.level
}
```

在这个例子中：

- `Rarity` 是一个值类型（有 `store`、`copy`、`drop`），它不是对象，可以自由复制和丢弃。
- `GameItem` 是一个数字资产（有 `key`、`store`），它是不可复制、不可丢弃的对象。
- `burn` 函数是销毁资产的唯一途径——必须显式解构每个字段，并删除 `UID`。

这种设计确保了即使在复杂的游戏经济中，每个道具的生命周期都是完整可追踪的。

## 小结

Move 语言从本质上重新定义了区块链上数字资产的表达方式。通过将资产建模为具有线性类型约束的结构体，Move 在编译期就能保证三大核心属性：

- **所有权明确**：每个资产都有唯一的所有者，所有权转移是原子性的。
- **不可复制**：类型系统阻止了任何非法的资产复制。
- **不可丢弃**：编译器确保每个资产都被正确处理，不会因编程失误而丢失。

这些保障不需要开发者额外编写任何安全检查代码——它们是语言内建的。这就是 Move 被称为"数字资产的语言"的原因。在接下来的章节中，我们将深入探讨 Sui 的对象模型，了解这些资产在链上是如何被组织和管理的。


---


<!-- source: 06_object_model/what-is-an-object.md -->
## 8.2 什么是对象

# 什么是对象

在 Sui 区块链中，**对象（Object）** 是存储和管理链上数据的基本单元。它是 Move 数字资产概念在 Sui 平台上的具体实现——每个对象都是一个具有全局唯一标识符的独立实体，拥有明确的所有者和完整的生命周期。理解对象模型是掌握 Sui 开发的关键基础。

本章将详细介绍什么是 Sui 对象、对象的结构和属性，以及对象与普通值类型（value）之间的本质区别。

## 对象模型：数字资产的高层抽象

Sui 的对象模型为数字资产提供了一个高层次的抽象。与传统区块链将所有状态存储在一个全局状态树中不同，Sui 将链上状态组织为一个个**独立的对象**。每个对象：

- 有自己的唯一身份
- 有明确的所有者
- 可以独立地被读取、修改和转移
- 有完整的版本历史

这种模型带来了一个重要优势：由于对象是独立的，涉及不同对象的交易可以**并行执行**，大幅提升了区块链的吞吐量。

## 对象的六大属性

每个 Sui 对象都具备以下六大属性：

### 类型（Type）

每个对象都有一个确定的 Move 类型，例如 `0x2::coin::Coin<0x2::sui::SUI>`。类型定义了对象包含哪些数据字段，以及可以对它执行哪些操作。类型在对象创建后**不可更改**。

### 唯一标识符（Unique ID）

每个对象在创建时会被分配一个全局唯一的 ID（`UID`），格式为 32 字节的地址。这个 ID 在整个 Sui 网络中是唯一的，即使对象被销毁，其 ID 也不会被复用。

### 所有者（Owner）

每个对象都有一个所有者，决定了谁可以在交易中使用这个对象。所有者可以是：

- 一个地址（address-owned）
- 被共享（shared）
- 被冻结（immutable/frozen）
- 另一个对象（object-owned/wrapped）

### 数据（Data）

对象携带的实际业务数据，由其类型中定义的字段组成。例如一个代币对象的数据包含余额，一个 NFT 的数据包含名称和图片 URL。

### 版本（Version）

每当对象被交易修改时，其版本号会递增。版本号用于乐观并发控制——如果交易提交时对象的版本已经变化，该交易会被拒绝。

### 摘要（Digest）

对象内容的加密哈希，用于验证对象数据的完整性。

## 如何定义一个对象

在 Move 中定义一个 Sui 对象需要满足两个条件：

1. 结构体必须具有 **`key`** 能力
2. 结构体的**第一个字段**必须是 `id: UID`

```move
module examples::object_basics;

/// An object has `key` ability and `id: UID` as first field
public struct Profile has key {
    id: UID,
    name: vector<u8>,
    score: u64,
}

/// A value struct - NOT an object (no `key` ability)
public struct Stats has store, copy, drop {
    level: u8,
    experience: u64,
}

/// Create a new Profile object
public fun new_profile(
    name: vector<u8>,
    ctx: &mut TxContext,
): Profile {
    Profile {
        id: object::new(ctx),
        name,
        score: 0,
    }
}
```

### `key` 能力的意义

`key` 能力告诉 Sui 运行时：这个结构体的实例应该被当作一个**独立的链上对象**来管理。拥有 `key` 能力的结构体：

- 可以作为交易的输入和输出
- 会被分配全局唯一 ID
- 受到所有权系统的保护
- 会被存储在 Sui 的全局对象存储中

### `UID` 的作用

`UID`（Unique Identifier）是 Sui 对象系统的核心类型，定义在 `sui::object` 模块中。它有以下特点：

- **不可复制**（没有 `copy` 能力）：确保每个 ID 的唯一性
- **不可丢弃**（没有 `drop` 能力）：销毁对象时必须显式删除 UID
- **全局唯一**：由 `TxContext` 保证每次生成的 ID 都不同
- **必须是第一个字段**：这是 Sui 运行时的硬性要求

```move
module examples::uid_demo;

public struct MyObject has key {
    id: UID,       // 必须是第一个字段
    value: u64,
}

/// 创建对象时，通过 object::new(ctx) 生成唯一 ID
public fun create(value: u64, ctx: &mut TxContext): MyObject {
    MyObject {
        id: object::new(ctx),
        value,
    }
}

/// 销毁对象时，必须显式删除 UID
public fun destroy(obj: MyObject) {
    let MyObject { id, value: _ } = obj;
    id.delete();
}
```

## 对象 vs 值（Object vs Value）

理解对象和值的区别是 Sui 开发中非常重要的概念。

### 对象（Object）

- 具有 `key` 能力
- 第一个字段是 `id: UID`
- 存在于 Sui 的全局对象存储中
- 有独立的所有者
- 可以作为交易的输入
- 有版本号和摘要

### 值（Value）

- 没有 `key` 能力
- 没有 `id: UID` 字段
- 不能独立存在于链上
- 只能作为对象的字段存在
- 不能直接作为交易的输入
- 通常具有 `store`、`copy`、`drop` 等能力

```move
module examples::object_vs_value;

use std::string::String;

/// 这是一个对象：有 key 能力和 id: UID
public struct Notebook has key {
    id: UID,
    title: String,
    entries: vector<Entry>,
}

/// 这是一个值：没有 key 能力，不能独立存在于链上
public struct Entry has store, copy, drop {
    content: String,
    timestamp: u64,
}

/// 创建一个笔记本对象
public fun create_notebook(
    title: String,
    ctx: &mut TxContext,
): Notebook {
    Notebook {
        id: object::new(ctx),
        title,
        entries: vector::empty(),
    }
}

/// 添加一个条目（值）到笔记本（对象）
public fun add_entry(
    notebook: &mut Notebook,
    content: String,
    timestamp: u64,
) {
    let entry = Entry { content, timestamp };
    vector::push_back(&mut notebook.entries, entry);
}

/// 读取条目数量
public fun entry_count(notebook: &Notebook): u64 {
    vector::length(&notebook.entries)
}
```

在这个例子中，`Notebook` 是一个对象，它可以独立存在于链上，有自己的 ID 和所有者。而 `Entry` 是一个值，它只能作为 `Notebook` 的一部分存在，不能独立拥有或转移。

## 对象的创建与生命周期

一个对象从创建到销毁的完整生命周期如下：

### 1. 创建

通过 `object::new(ctx)` 生成新的 UID，构造结构体实例。

### 2. 上链

通过 `transfer::transfer`、`transfer::share_object`、`transfer::freeze_object` 等函数将对象放到链上。

### 3. 使用

对象可以在后续交易中被读取（`&T`）或修改（`&mut T`），也可以被按值传入（`T`）以转移或销毁。

### 4. 销毁

通过解构（destructure）对象，提取所有字段，并调用 `id.delete()` 删除 UID。

```move
module examples::lifecycle;

public struct Token has key {
    id: UID,
    value: u64,
}

/// 步骤1: 创建
public fun mint(value: u64, ctx: &mut TxContext): Token {
    Token {
        id: object::new(ctx),
        value,
    }
}

/// 步骤2: 上链（转移给某人）
public fun send(token: Token, recipient: address) {
    transfer::transfer(token, recipient);
}

/// 步骤3: 使用（读取和修改）
public fun value(token: &Token): u64 {
    token.value
}

public fun add_value(token: &mut Token, amount: u64) {
    token.value = token.value + amount;
}

/// 步骤4: 销毁
public fun burn(token: Token) {
    let Token { id, value: _ } = token;
    id.delete();
}
```

## 常见错误与注意事项

### UID 不是第一个字段

```move
// 错误！UID 必须是第一个字段
public struct Bad has key {
    value: u64,
    id: UID,  // 应作为第一个字段
}
```

### 忘记删除 UID

```move
// 错误！UID 没有 drop 能力，不能被丢弃
public fun bad_destroy(obj: MyObject) {
    let MyObject { id, value: _ } = obj;
    // 编译错误：id 没有被使用，也不能被隐式丢弃
}
```

正确做法是调用 `id.delete()`。

### 给资产对象添加 copy/drop

```move
// 不推荐！数字资产不应该可复制或可丢弃
public struct BadToken has key, copy, drop {
    id: UID,
    value: u64,
}
```

虽然编译器允许，但这违反了数字资产的核心原则，会导致资产可以被随意复制和丢弃。

## 小结

Sui 的对象是链上数据的基本组织单元，也是数字资产概念的具体实现。核心要点如下：

- **对象定义**：具有 `key` 能力且第一个字段为 `id: UID` 的结构体就是 Sui 对象。
- **六大属性**：每个对象都有类型、唯一 ID、所有者、数据、版本和摘要。
- **UID 是关键**：UID 保证了对象的全局唯一性，创建时生成，销毁时必须显式删除。
- **对象 vs 值**：对象可以独立存在于链上，值只能嵌入对象中。
- **完整生命周期**：创建 → 上链 → 使用 → 销毁，每个阶段都有明确的语义。

理解了对象的概念和结构后，下一章我们将深入探讨 Sui 的所有权模型——对象最重要的属性之一。


---


<!-- source: 06_object_model/ownership.md -->
## 8.3 对象所有权

# 所有权模型概述

所有权（Ownership）是 Sui 对象模型中最核心的概念之一。每个存在于 Sui 链上的对象都必须有一个明确的所有权状态，而这个状态直接决定了谁可以访问该对象、如何访问，以及对象在交易中的执行路径。Sui 提供了四种所有权类型，每种类型适用于不同的应用场景，理解它们是构建高效 Sui 应用的基础。

## 四种所有权类型概览

Sui 中的每个对象都处于以下四种所有权状态之一：

| 所有权类型 | 中文名称 | 访问控制 | 执行路径 |
|-----------|---------|---------|---------|
| Address-owned | 地址所有 | 仅所有者 | 快速路径 |
| Shared | 共享状态 | 任何人 | 共识路径 |
| Immutable | 不可变 | 任何人（只读） | 快速路径 |
| Object-owned | 对象所有 | 父对象的所有者 | 继承父对象 |
| Party | Party 对象 | Party 内配置的权限 | 共识路径 |

此外，**Party 对象**结合了「单一所有者」与「共识版本化」：通过 `party_transfer` / `public_party_transfer` 创建，适合多笔交易排队、与共享对象配合等场景，详见 [8.3.5 Party 对象](ownership-party.md)。

接下来我们逐一介绍每种所有权类型。

## 地址所有（Account Owner / Address-owned）

地址所有是最常见也最直观的所有权类型。一个地址所有的对象**只能由其所有者**在交易中使用。

### 核心特征

- 对象属于一个特定的 Sui 地址
- 只有该地址的持有者可以在交易中引用此对象
- 这是真正意义上的"个人所有权"——与现实世界中拥有一件物品非常类似
- 通过 `transfer::transfer` 或 `transfer::public_transfer` 转移所有权

### 适用场景

- 个人钱包中的代币
- 用户的 NFT 收藏
- 管理权限凭证（如 `AdminCap`）
- 任何应该由个人独占的资产

### 性能优势

由于地址所有的对象只能被其所有者使用，涉及此类对象的交易**不需要经过共识排序**，可以通过快速路径（fast path）直接执行。这使得此类交易的延迟极低。

## 共享状态（Shared State）

共享对象可以被**任何人**在交易中访问和修改。这使得它成为实现多方交互的关键机制。

### 核心特征

- 没有特定的所有者
- 任何地址都可以在交易中以可变引用（`&mut T`）或不可变引用（`&T`）访问
- 通过 `transfer::share_object` 或 `transfer::public_share_object` 创建
- 一旦共享，**不可逆转**——不能再转移或冻结

### 适用场景

想象一个 NFT 市场：

- 卖家将 NFT 挂单到一个共享的市场对象中
- 买家从市场对象中购买 NFT
- 多个用户需要同时读写同一个对象

其他场景包括：去中心化交易所的流动性池、投票合约、排行榜等。

### 性能考量

由于共享对象可能被多个交易同时访问，Sui 需要通过**共识机制**对涉及共享对象的交易进行排序。这意味着共享对象交易的延迟相对较高。因此，在设计应用时应尽量减少对共享对象的使用。

## 不可变状态（Immutable State）

不可变对象被永久冻结，**任何人**都可以读取但**没有人**可以修改、删除或转移它。

### 核心特征

- 通过 `transfer::freeze_object` 或 `transfer::public_freeze_object` 创建
- 冻结操作是不可逆的
- 只能以不可变引用（`&T`）在交易中使用
- 任何地址都可以读取

### 适用场景

- 全局配置参数
- 合约元数据
- 共享的常量数据（如游戏规则）
- 参考数据集

### 性能优势

不可变对象像地址所有的对象一样，走**快速路径**执行。因为它们不会被修改，所以不需要共识排序。

## 对象所有（Object Owner）

对象可以由另一个对象所拥有，形成对象之间的层级关系。

### 核心特征

- 一个对象被另一个对象"持有"
- 被持有的对象通过 `transfer::transfer_to_object` 或直接嵌入父对象的字段中（包装，wrapping）
- 访问被持有的对象需要先访问父对象

### 适用场景

想象一个 RPG 游戏：

- 一个角色（Hero）对象拥有装备（Sword、Shield）
- 装备被包装在角色对象内部
- 要使用装备，必须先通过角色对象访问

```move
module examples::ownership_demo;

public struct Item has key, store {
    id: UID,
    name: vector<u8>,
}

/// Single owner: transfer to a specific address
public fun send_to_owner(item: Item, recipient: address) {
    transfer::transfer(item, recipient);
}

/// Shared: anyone can access
public fun make_shared(item: Item) {
    transfer::share_object(item);
}

/// Immutable: permanently read-only
public fun make_immutable(item: Item) {
    transfer::freeze_object(item);
}
```

### 代码解析

上述代码展示了一个 `Item` 对象在三种所有权状态之间的转换：

1. **`send_to_owner`**：将 Item 转移给指定地址，该地址成为唯一所有者。
2. **`make_shared`**：将 Item 变为共享对象，任何人都可以访问。
3. **`make_immutable`**：将 Item 永久冻结，任何人可读但无人可改。

注意：`Item` 同时具有 `key` 和 `store` 能力。`store` 能力使得它可以使用 `transfer::transfer`（模块内部调用）以及 `transfer::public_transfer`（任何模块都可以调用）。

## 所有权与数据可见性

一个常见的误解是：**所有权控制了数据的可见性**。实际上并非如此。

在 Sui 中，所有链上数据都是**公开可读**的。所有权控制的是**谁可以在交易中使用这个对象作为输入**，而不是谁可以看到这个对象的数据。

| | 可以查看数据 | 可以在交易中使用 |
|---|---|---|
| Address-owned | 任何人 | 仅所有者 |
| Shared | 任何人 | 任何人 |
| Immutable | 任何人 | 任何人（只读） |
| Object-owned | 任何人 | 父对象的使用者 |

这意味着：**不要将敏感信息直接存储在对象中**。如果需要保密数据，应该使用加密方案。

## 所有权转换规则

对象的所有权状态之间存在严格的转换规则：

```
Address-owned ──→ Shared（不可逆）
Address-owned ──→ Immutable（不可逆）
Address-owned ──→ Object-owned
Address-owned ──→ Party（party_transfer / public_party_transfer）
Address-owned ──→ 另一个 Address（转移）

Object-owned  ──→ Address-owned（解包后转移）

Party         ──→ Address-owned / Immutable / Object-owned；──×→ Shared（不可转为共享）
Shared        ──→ ×（不可转换，只能销毁）
Immutable     ──→ ×（不可转换，不可销毁）
```

关键规则：
- 共享和不可变状态都是**不可逆的**
- **Party 对象**一旦创建，不能再变为共享；可转回地址所有、变为不可变或放入动态字段
- 共享对象可以被销毁（如果模块提供了销毁函数）
- 不可变对象**不能**被销毁

## 如何选择所有权类型

在设计应用时，选择正确的所有权类型至关重要。以下是一些指导原则：

### 使用 Address-owned 当：

- 对象属于某个特定用户
- 需要最高的交易性能（快速路径）
- 对象不需要被多方同时修改

### 使用 Shared 当：

- 多方需要读写同一个对象
- 构建市场、流动性池等多方交互场景
- 愿意接受共识带来的额外延迟

### 使用 Immutable 当：

- 数据一旦设置就永不更改
- 需要全局可读的配置或参考数据
- 希望享受快速路径的性能优势

### 使用 Object-owned 当：

- 需要建模对象之间的层级关系
- 一个对象在逻辑上"属于"另一个对象
- 游戏角色与装备、容器与内容等场景

### 使用 Party 当：

- 需要共识版本化，但对象仍由单方（或有限成员）控制
- 同一对象上希望多笔交易并行排队（pipeline）
- 与共享对象或其它 Party 对象一起使用，且不想把对象设为完全共享  
详见 [8.3.5 Party 对象](ownership-party.md)。

## 小结

Sui 的四种所有权类型为开发者提供了灵活而强大的状态管理模型：

- **地址所有**：个人独占，快速路径执行，最常用的所有权类型。
- **共享状态**：多方可访问，需要共识排序，适用于多方交互场景。
- **不可变状态**：永久冻结，全局可读，适用于配置和参考数据。
- **对象所有**：对象间的层级关系，实现复杂的数据组合模式。
- **Party 对象**：单一 Party 所有 + 共识版本化，支持多笔交易排队，详见 8.3.5。

所有权**不控制数据可见性**——所有链上数据都是公开的。所有权控制的是谁可以在交易中使用对象。选择正确的所有权类型，是平衡安全性、性能和功能需求的关键决策。

在接下来的章节中，我们将分别深入每种所有权类型的细节和最佳实践。


---


<!-- source: 06_object_model/ownership-address.md -->
## 8.3.1 地址所有

# 地址所有的对象

地址所有（Address-owned）是 Sui 中最常见的所有权类型。当一个对象被转移给某个地址后，只有该地址的持有者才能在交易中使用它。这种模型直观地对应了现实世界中"个人拥有物品"的概念——你的钱包里的代币、你的 NFT 收藏、你的管理员权限凭证，都是地址所有的对象。

本章将深入探讨地址所有对象的创建、转移、使用模式，以及常见的设计模式。

## 创建与转移

创建一个地址所有的对象分为两步：构造对象，然后将其转移给某个地址。

### 使用 `transfer::transfer`

`transfer::transfer` 是模块内部使用的转移函数。它可以转移**任何具有 `key` 能力**的对象，即使该对象没有 `store` 能力：

```move
module examples::basic_transfer;

public struct Secret has key {
    id: UID,
    content: vector<u8>,
}

public fun create_and_send(
    content: vector<u8>,
    recipient: address,
    ctx: &mut TxContext,
) {
    let secret = Secret {
        id: object::new(ctx),
        content,
    };
    transfer::transfer(secret, recipient);
}
```

注意 `Secret` 只有 `key` 能力而没有 `store`。这意味着只有定义 `Secret` 的模块才能转移它——外部模块无法调用 `transfer::transfer` 来转移 `Secret`。

### 使用 `transfer::public_transfer`

如果对象同时具有 `key` 和 `store` 能力，可以使用 `transfer::public_transfer`。这个函数可以在**任何模块**中调用：

```move
module examples::public_transfer_demo;

public struct Collectible has key, store {
    id: UID,
    name: vector<u8>,
}

public fun create(name: vector<u8>, ctx: &mut TxContext): Collectible {
    Collectible {
        id: object::new(ctx),
        name,
    }
}

/// 任何拥有 Collectible 的人都可以转移它
public fun send(item: Collectible, to: address) {
    transfer::public_transfer(item, to);
}
```

`store` 能力的存在与否决定了对象的**可转移性控制**：

| | `key` only | `key + store` |
|---|---|---|
| 模块内转移 | `transfer::transfer` | `transfer::transfer` 或 `transfer::public_transfer` |
| 模块外转移 | 不可以 | `transfer::public_transfer` |

## 只有所有者可以使用

地址所有对象最重要的特性是：**只有所有者才能在交易中将其作为输入**。

当你提交一个交易时，Sui 运行时会检查：

1. 交易中引用的每个地址所有对象，其所有者是否匹配交易发送者
2. 对象的版本是否与链上最新版本一致

如果检查失败，交易会被直接拒绝，不会执行。

这种机制提供了强大的安全保障：即使你的合约代码有 bug，其他人也无法使用你的对象。

## 转移的语义：按值传递

在 Move 中，转移对象意味着**按值传递**。调用 `transfer::transfer(obj, addr)` 后，`obj` 被**消耗（consumed）**，调用者完全失去对它的控制：

```move
module examples::transfer_semantics;

public struct Token has key, store {
    id: UID,
    value: u64,
}

public fun transfer_demo(token: Token, recipient: address) {
    transfer::public_transfer(token, recipient);
    // 此处 token 已经被消耗，以下代码会导致编译错误：
    // let v = token.value;  // 错误！token 已经不存在
}
```

这确保了所有权转移的**原子性**——不会出现一个对象同时属于两个人的情况。

## 常见设计模式

### 能力模式（Capability Pattern）

能力模式是 Sui 开发中最重要的设计模式之一。它使用一个特殊的对象作为"权限凭证"，持有该对象的人拥有特定的操作权限。

```move
module examples::address_owned;

public struct AdminCap has key {
    id: UID,
}

public struct UserProfile has key, store {
    id: UID,
    name: vector<u8>,
    points: u64,
}

fun init(ctx: &mut TxContext) {
    let admin_cap = AdminCap { id: object::new(ctx) };
    transfer::transfer(admin_cap, ctx.sender());
}

public fun create_profile(
    _: &AdminCap,
    name: vector<u8>,
    recipient: address,
    ctx: &mut TxContext,
) {
    let profile = UserProfile {
        id: object::new(ctx),
        name,
        points: 0,
    };
    transfer::public_transfer(profile, recipient);
}

public fun transfer_profile(profile: UserProfile, to: address) {
    transfer::public_transfer(profile, to);
}
```

#### 能力模式解析

1. **`AdminCap`**：一个只有 `key` 能力的结构体，作为管理员权限凭证。
2. **`init` 函数**：模块发布时自动执行，将 `AdminCap` 转移给发布者。
3. **`create_profile` 的第一个参数 `_: &AdminCap`**：虽然不使用其值（用 `_` 忽略），但要求调用者必须拥有 `AdminCap` 对象。由于 `AdminCap` 是地址所有的，只有管理员才能调用此函数。
4. **`AdminCap` 没有 `store`**：这意味着它不能被模块外部转移，增强了安全性。

### 转移到自身模式

有时函数需要创建对象并将其转移给交易发送者：

```move
module examples::self_transfer;

public struct Ticket has key {
    id: UID,
    event: vector<u8>,
    seat: u64,
}

/// 用户为自己购买门票
public fun buy_ticket(
    event: vector<u8>,
    seat: u64,
    ctx: &mut TxContext,
) {
    let ticket = Ticket {
        id: object::new(ctx),
        event,
        seat,
    };
    transfer::transfer(ticket, ctx.sender());
}
```

`ctx.sender()` 返回当前交易的发送者地址，将对象转移给它等于"给自己创建了一个新对象"。

### 多凭证模式

对于需要更精细权限控制的场景，可以使用多个不同的能力对象：

```move
module examples::multi_cap;

/// 可以创建内容
public struct CreatorCap has key { id: UID }

/// 可以删除内容
public struct ModeratorCap has key { id: UID }

public struct Post has key, store {
    id: UID,
    content: vector<u8>,
    author: address,
}

fun init(ctx: &mut TxContext) {
    transfer::transfer(
        CreatorCap { id: object::new(ctx) },
        ctx.sender(),
    );
    transfer::transfer(
        ModeratorCap { id: object::new(ctx) },
        ctx.sender(),
    );
}

/// 只有 Creator 可以发布内容
public fun publish(
    _: &CreatorCap,
    content: vector<u8>,
    ctx: &mut TxContext,
) {
    let post = Post {
        id: object::new(ctx),
        content,
        author: ctx.sender(),
    };
    transfer::public_transfer(post, ctx.sender());
}

/// 只有 Moderator 可以删除内容
public fun remove(_: &ModeratorCap, post: Post) {
    let Post { id, content: _, author: _ } = post;
    id.delete();
}

/// Creator 和 Moderator 可以分别授权给不同的人
public fun delegate_creator(cap: CreatorCap, to: address) {
    transfer::transfer(cap, to);
}

public fun delegate_moderator(cap: ModeratorCap, to: address) {
    transfer::transfer(cap, to);
}
```

这种模式将不同的权限分离到不同的能力对象中，可以将它们授权给不同的地址，实现精细的权限管理。

## 地址所有对象的优势

### 性能

地址所有对象走**快速路径**执行，不需要共识排序。这使得涉及地址所有对象的交易延迟极低（通常在毫秒级别）。

### 安全性

即使合约代码存在漏洞，攻击者也无法使用你地址下的对象。所有权检查是在运行时层面进行的，不依赖于合约逻辑。

### 简单性

地址所有权的语义非常直观——谁拥有对象，谁就能使用它。这降低了开发和理解的复杂度。

## 注意事项

### 不能在交易外查询"我拥有哪些对象"

Move 智能合约内部没有 API 可以列出某个地址拥有的所有对象。这种查询需要通过 Sui SDK 或索引服务在链外完成。

### 丢失私钥意味着丢失资产

地址所有对象只能由对应私钥的持有者使用。如果私钥丢失，对应地址下的所有对象将永久无法访问。

### 一次只能在一个交易中使用

一个地址所有对象在同一时刻只能被一个交易使用。如果你提交了两个使用同一对象的交易，只有一个会成功（基于版本检查）。

## 小结

地址所有对象是 Sui 中最基础也最常用的所有权类型。核心要点回顾：

- **独占控制**：只有所有者可以在交易中使用该对象。
- **按值转移**：转移操作消耗原对象，保证所有权的原子性转移。
- **能力模式**：通过持有特定的能力对象来控制操作权限，是 Sui 开发中的核心设计模式。
- **`key` vs `key + store`**：决定了对象是否可以在模块外部被转移。
- **快速路径**：地址所有对象的交易不需要共识排序，性能最优。

地址所有对象适用于所有"个人资产"场景。在需要多方共同访问数据时，应考虑使用共享对象或不可变对象。


---


<!-- source: 06_object_model/ownership-immutable.md -->
## 8.3.2 不可变对象

# 不可变对象

不可变对象（Immutable Object）是 Sui 中一种特殊的所有权状态。当对象被冻结（frozen）后，它将**永久不可修改**——没有任何人可以更改、删除或转移它，但任何人都可以读取它的数据。不可变对象就像刻在石碑上的铭文，一旦刻下便永恒不变，供所有人查阅。

本章将深入探讨不可变对象的创建方式、使用约束、性能特征，以及在实际开发中的最佳实践。

## 创建不可变对象

将对象变为不可变状态有两种方式，取决于调用的上下文和对象的能力。

### `transfer::freeze_object`

`freeze_object` 只能在**定义该对象类型的模块内部**调用。对象只需具有 `key` 能力：

```move
module examples::freeze_demo;

public struct Rule has key {
    id: UID,
    description: vector<u8>,
}

public fun create_and_freeze(
    description: vector<u8>,
    ctx: &mut TxContext,
) {
    let rule = Rule {
        id: object::new(ctx),
        description,
    };
    transfer::freeze_object(rule);
}
```

### `transfer::public_freeze_object`

`public_freeze_object` 可以在**任何模块**中调用，但要求对象同时具有 `key` 和 `store` 能力：

```move
module examples::public_freeze_demo;

public struct Announcement has key, store {
    id: UID,
    message: vector<u8>,
}

public fun create(message: vector<u8>, ctx: &mut TxContext): Announcement {
    Announcement {
        id: object::new(ctx),
        message,
    }
}

/// 因为 Announcement 有 store，任何模块都可以调用此函数冻结它
public fun make_permanent(announcement: Announcement) {
    transfer::public_freeze_object(announcement);
}
```

### `freeze_object` vs `public_freeze_object` 对比

| 特性 | `freeze_object` | `public_freeze_object` |
|------|----------------|----------------------|
| 要求的能力 | `key` | `key + store` |
| 调用位置 | 仅定义模块内 | 任何模块 |
| 控制力 | 模块完全控制冻结逻辑 | 外部也可以冻结 |

## 不可变对象的约束

一旦对象被冻结，以下操作都**永久不可执行**：

### 不可修改

不可变对象只能以不可变引用（`&T`）的形式在交易中使用。任何试图获取可变引用（`&mut T`）或按值（`T`）使用的操作都会被拒绝。

```move
module examples::immutable_access;

public struct Config has key {
    id: UID,
    value: u64,
}

/// 这个函数可以接受不可变对象
public fun value(config: &Config): u64 {
    config.value
}

/// 这个函数不能接受不可变对象（需要 &mut）
public fun update(config: &mut Config, new_value: u64) {
    config.value = new_value;
}
```

如果 `Config` 对象已被冻结，只有 `value` 函数可以使用它，`update` 函数将无法在交易中引用这个对象。

### 不可删除

不可变对象不能被解构和销毁。即使模块提供了销毁函数，也无法在交易中按值获取冻结的对象。

### 不可转移

不可变对象没有"所有者"——它属于所有人。因此不存在转移所有权的概念。

## 完整示例：游戏配置

以下是一个使用不可变对象存储游戏配置的完整示例：

```move
module examples::immutable_config;

use std::string::String;

public struct GameConfig has key {
    id: UID,
    max_players: u64,
    game_name: String,
    version: u64,
}

public struct AdminCap has key { id: UID }

fun init(ctx: &mut TxContext) {
    transfer::transfer(
        AdminCap { id: object::new(ctx) },
        ctx.sender(),
    );
}

public fun create_and_freeze(
    _: &AdminCap,
    max_players: u64,
    game_name: String,
    version: u64,
    ctx: &mut TxContext,
) {
    let config = GameConfig {
        id: object::new(ctx),
        max_players,
        game_name,
        version,
    };
    transfer::freeze_object(config);
}

/// Anyone can read config via immutable reference
public fun max_players(config: &GameConfig): u64 {
    config.max_players
}

public fun game_name(config: &GameConfig): &String {
    &config.game_name
}
```

### 示例解析

1. **`AdminCap` 控制创建权**：只有管理员可以创建游戏配置，这通过能力模式保证。
2. **创建即冻结**：`create_and_freeze` 在同一个函数中创建并冻结配置。这是一个常见模式——配置对象从来不会处于可修改状态。
3. **只提供读取函数**：`max_players` 和 `game_name` 都接受 `&GameConfig`（不可变引用），这是使用不可变对象的唯一方式。
4. **没有更新函数**：既然对象是不可变的，提供更新函数没有意义。如果需要"更新配置"，应该创建一个新的配置对象（带有新版本号）并冻结它。

## 从地址所有到冻结的转换

对象可以先作为地址所有对象存在，然后在某个时刻被冻结。这在某些场景中很有用——例如，先让管理员对配置进行调整，确认无误后再冻结：

```move
module examples::owned_to_frozen;

use std::string::String;

public struct Document has key {
    id: UID,
    title: String,
    content: String,
    finalized: bool,
}

public struct EditorCap has key { id: UID }

fun init(ctx: &mut TxContext) {
    transfer::transfer(
        EditorCap { id: object::new(ctx) },
        ctx.sender(),
    );
}

/// 创建一个可编辑的文档（地址所有）
public fun create_draft(
    _: &EditorCap,
    title: String,
    content: String,
    ctx: &mut TxContext,
) {
    let doc = Document {
        id: object::new(ctx),
        title,
        content,
        finalized: false,
    };
    transfer::transfer(doc, ctx.sender());
}

/// 编辑文档内容（地址所有状态下）
public fun edit(doc: &mut Document, new_content: String) {
    assert!(!doc.finalized, 0);
    doc.content = new_content;
}

/// 定稿并冻结文档（从地址所有 → 不可变）
public fun finalize(doc: Document) {
    let Document { id, title: _, content: _, finalized: _ } = doc;
    // 注意：这里需要重新创建一个标记为 finalized 的文档
    // 因为我们不能修改后再冻结同一个对象
    id.delete();
}

/// 更好的做法：直接冻结整个对象
public fun publish(mut doc: Document) {
    doc.finalized = true;
    transfer::freeze_object(doc);
}
```

### 转换注意事项

- 冻结操作需要对象的**值**（按值传递），而非引用
- 这意味着调用者必须是对象的所有者
- 冻结后，对象永远无法回到地址所有或共享状态

## 不可变对象的性能优势

不可变对象在 Sui 的执行模型中享有与地址所有对象相同的**快速路径**优势：

### 为什么不需要共识？

共识排序的目的是解决"多个交易同时修改同一对象"的冲突。不可变对象**永远不会被修改**，因此不存在这种冲突，自然不需要共识排序。

### 多交易并行使用

不可变对象可以被**无限数量的交易同时使用**，因为每个交易都只是读取它，不存在竞争条件。这使得不可变对象成为高吞吐量场景下的理想选择。

### 与共享对象的性能对比

| 特性 | 不可变对象 | 共享对象 |
|------|----------|---------|
| 执行路径 | 快速路径 | 共识路径 |
| 并发访问 | 无限制 | 需要排序 |
| 延迟 | 极低 | 较高 |
| 适用场景 | 只读数据 | 需要修改的共享数据 |

## 实际应用场景

### 全局常量

将应用的常量配置存储为不可变对象，所有用户都可以读取：

```move
module examples::constants;

public struct AppConstants has key {
    id: UID,
    fee_rate_bps: u64,     // 手续费率（基点）
    min_deposit: u64,       // 最小存款额
    max_withdrawal: u64,    // 最大取款额
}

fun init(ctx: &mut TxContext) {
    let constants = AppConstants {
        id: object::new(ctx),
        fee_rate_bps: 30,      // 0.3%
        min_deposit: 1000,
        max_withdrawal: 1_000_000,
    };
    transfer::freeze_object(constants);
}

public fun fee_rate(c: &AppConstants): u64 { c.fee_rate_bps }
public fun min_deposit(c: &AppConstants): u64 { c.min_deposit }
public fun max_withdrawal(c: &AppConstants): u64 { c.max_withdrawal }
```

### 合约元数据

存储合约的版本信息、描述等元数据：

```move
module examples::metadata;

use std::string::String;

public struct PackageInfo has key {
    id: UID,
    name: String,
    version: String,
    author: address,
    description: String,
}

fun init(ctx: &mut TxContext) {
    let info = PackageInfo {
        id: object::new(ctx),
        name: b"MyDApp".to_string(),
        version: b"1.0.0".to_string(),
        author: ctx.sender(),
        description: b"A decentralized application on Sui".to_string(),
    };
    transfer::freeze_object(info);
}
```

## 版本化配置的更新策略

既然不可变对象不能修改，那如何"更新"配置？常见策略是**创建新版本**：

```move
module examples::versioned_config;

use std::string::String;

public struct Config has key {
    id: UID,
    version: u64,
    data: String,
}

public struct AdminCap has key { id: UID }

/// 创建新版本的配置并冻结
public fun publish_config(
    _: &AdminCap,
    version: u64,
    data: String,
    ctx: &mut TxContext,
) {
    let config = Config {
        id: object::new(ctx),
        version,
        data,
    };
    transfer::freeze_object(config);
}
```

客户端应用通过版本号来选择使用最新的配置对象。旧版本的配置依然存在于链上，可以作为历史记录查阅。

## 小结

不可变对象为 Sui 开发者提供了一种高效的只读数据共享机制。核心要点如下：

- **创建方式**：通过 `freeze_object`（模块内部）或 `public_freeze_object`（需要 `store` 能力）冻结。
- **永久约束**：冻结后不可修改、不可删除、不可转移，操作不可逆。
- **访问方式**：只能以不可变引用（`&T`）使用，任何人都可以读取。
- **性能优势**：走快速路径执行，可以被无限数量的交易并行使用。
- **适用场景**：全局配置、合约元数据、常量数据、参考数据集等只读场景。
- **更新策略**：通过创建新版本的不可变对象来实现"更新"。

在需要全局共享且永不更改的数据时，不可变对象是最佳选择——它兼具安全性和高性能。


---


<!-- source: 06_object_model/ownership-shared.md -->
## 8.3.3 共享对象

# 共享对象

共享对象（Shared Object）是 Sui 中唯一一种允许**任何人**以可变方式访问的所有权类型。与地址所有对象的独占控制不同，共享对象没有特定的所有者——任何地址都可以在交易中读取或修改它。这使得共享对象成为构建去中心化市场、流动性池、投票系统等多方交互应用的核心构建块。

本章将深入探讨共享对象的创建、使用、性能影响，以及设计共享对象时需要注意的陷阱。

## 创建共享对象

与不可变对象类似，共享对象也有两种创建方式。

### `transfer::share_object`

在定义对象类型的模块内部使用，对象只需具有 `key` 能力：

```move
module examples::share_demo;

public struct Registry has key {
    id: UID,
    entries: vector<vector<u8>>,
}

public fun create(ctx: &mut TxContext) {
    let registry = Registry {
        id: object::new(ctx),
        entries: vector::empty(),
    };
    transfer::share_object(registry);
}
```

### `transfer::public_share_object`

可以在任何模块中调用，但要求对象同时具有 `key` 和 `store` 能力：

```move
module examples::public_share_demo;

public struct Pool has key, store {
    id: UID,
    balance: u64,
}

public fun create_pool(ctx: &mut TxContext): Pool {
    Pool {
        id: object::new(ctx),
        balance: 0,
    }
}

public fun share_pool(pool: Pool) {
    transfer::public_share_object(pool);
}
```

## 共享对象的核心特性

### 任何人可访问

共享对象可以被任何地址在交易中引用。在交易中，你可以通过以下方式使用共享对象：

- **`&T`**（不可变引用）：读取数据
- **`&mut T`**（可变引用）：读取和修改数据
- **`T`**（按值）：只在销毁对象时使用

### 共识排序

由于多个交易可能同时尝试修改同一个共享对象，Sui 需要通过**共识机制**对这些交易进行排序。这意味着涉及共享对象的交易延迟高于地址所有对象的交易。

### 不可逆转

一旦对象被共享，就**永远不能**：

- 转移给某个地址（变为地址所有）
- 冻结（变为不可变）
- 只能通过销毁来"移除"

## 完整示例：共享计数器

以下是一个经典的共享计数器示例：

```move
module examples::shared_counter;

const ENotCreator: u64 = 0;

public struct Counter has key {
    id: UID,
    value: u64,
    owner: address,
}

public fun create_and_share(ctx: &mut TxContext) {
    let counter = Counter {
        id: object::new(ctx),
        value: 0,
        owner: ctx.sender(),
    };
    transfer::share_object(counter);
}

/// Anyone can increment the counter
public fun increment(counter: &mut Counter) {
    counter.value = counter.value + 1;
}

/// Anyone can read the value
public fun value(counter: &Counter): u64 {
    counter.value
}

/// Only the creator can destroy the shared counter
public fun destroy(counter: Counter, ctx: &TxContext) {
    assert!(counter.owner == ctx.sender(), ENotCreator);
    let Counter { id, value: _, owner: _ } = counter;
    id.delete();
}
```

### 示例解析

1. **创建即共享**：`create_and_share` 在同一个函数中创建并共享计数器。注意我们保存了创建者的地址（`owner`），以便后续进行权限检查。
2. **任何人可递增**：`increment` 接受 `&mut Counter`，任何地址都可以调用它来增加计数值。
3. **任何人可读取**：`value` 接受 `&Counter`，纯读取操作。
4. **权限控制销毁**：虽然共享对象可以被任何人访问，但我们在 `destroy` 中通过 `assert!` 检查只有创建者可以销毁它。

## 共享对象的删除

共享对象是可以被删除的，这是一个常见的误解需要澄清。删除共享对象需要：

1. 以**按值（`T`）** 方式接收共享对象
2. 解构对象，删除其 `UID`

```move
module examples::shared_deletion;

const ENotCreator: u64 = 0;

public struct SharedBox has key {
    id: UID,
    content: vector<u8>,
    creator: address,
}

public fun create(content: vector<u8>, ctx: &mut TxContext) {
    let box_obj = SharedBox {
        id: object::new(ctx),
        content,
        creator: ctx.sender(),
    };
    transfer::share_object(box_obj);
}

/// 销毁共享对象 - 注意参数类型是 SharedBox（按值），不是 &mut SharedBox
public fun destroy(box_obj: SharedBox, ctx: &TxContext) {
    assert!(box_obj.creator == ctx.sender(), ENotCreator);
    let SharedBox { id, content: _, creator: _ } = box_obj;
    id.delete();
}
```

当在交易中使用共享对象并按值传递时，Sui 会检查该对象确实是共享的，并通过共识路径执行交易。

## 性能影响与优化策略

### 共识带来的延迟

涉及共享对象的交易需要经过 Sui 的共识协议进行排序。这个过程虽然在 Sui 中已经高度优化，但仍然比快速路径慢。具体差异：

- **快速路径（地址所有/不可变对象）**：通常在几百毫秒内完成
- **共识路径（共享对象）**：通常需要 2-3 秒

### 热点问题

如果一个共享对象被大量交易同时访问和修改，它会成为**热点（hotspot）**，限制系统吞吐量。常见热点场景：

- 全局计数器
- 单一的流动性池
- 集中式的订单簿

### 优化策略

#### 策略一：最小化共享对象的使用

尽可能将数据存储在地址所有对象中，只在必要时使用共享对象：

```move
module examples::minimize_shared;

/// 不好的设计：所有用户数据存在一个共享对象中
public struct BadUserStore has key {
    id: UID,
    users: vector<address>,
    balances: vector<u64>,
}

/// 好的设计：每个用户有自己的对象（地址所有）
public struct UserAccount has key {
    id: UID,
    balance: u64,
}

/// 只在需要多方交互时使用共享对象
public struct Marketplace has key {
    id: UID,
    listings: vector<Listing>,
}

public struct Listing has store {
    seller: address,
    price: u64,
    item_id: address,
}
```

#### 策略二：分片

将一个大的共享对象拆分为多个：

```move
module examples::sharding;

/// 不好的设计：单一全局计数器
public struct GlobalCounter has key {
    id: UID,
    count: u64,
}

/// 好的设计：分区计数器
public struct ShardedCounter has key {
    id: UID,
    shard_id: u8,
    count: u64,
}

/// 创建多个分片
public fun create_shards(ctx: &mut TxContext) {
    let mut i: u8 = 0;
    while (i < 10) {
        let shard = ShardedCounter {
            id: object::new(ctx),
            shard_id: i,
            count: 0,
        };
        transfer::share_object(shard);
        i = i + 1;
    };
}

/// 用户根据某种规则选择一个分片来递增
public fun increment_shard(shard: &mut ShardedCounter) {
    shard.count = shard.count + 1;
}
```

#### 策略三：读写分离

对于读多写少的场景，考虑使用不可变对象存储只读数据，共享对象只负责写操作：

```move
module examples::read_write_split;

use std::string::String;

/// 不可变对象：存储产品目录（只读）
public struct ProductCatalog has key {
    id: UID,
    products: vector<String>,
}

/// 共享对象：存储订单（需要读写）
public struct OrderBook has key {
    id: UID,
    orders: vector<Order>,
}

public struct Order has store, drop {
    buyer: address,
    product_index: u64,
    quantity: u64,
}
```

## 共享对象的安全考虑

### 权限控制

共享对象可以被任何人访问，因此**必须在函数逻辑中实现权限控制**：

```move
module examples::shared_security;

const ENotAdmin: u64 = 0;
const EInsufficientBalance: u64 = 1;

public struct Treasury has key {
    id: UID,
    balance: u64,
    admin: address,
}

public fun create(ctx: &mut TxContext) {
    let treasury = Treasury {
        id: object::new(ctx),
        balance: 0,
        admin: ctx.sender(),
    };
    transfer::share_object(treasury);
}

/// 任何人可以存款
public fun deposit(treasury: &mut Treasury, amount: u64) {
    treasury.balance = treasury.balance + amount;
}

/// 只有管理员可以取款
public fun withdraw(
    treasury: &mut Treasury,
    amount: u64,
    ctx: &TxContext,
): u64 {
    assert!(treasury.admin == ctx.sender(), ENotAdmin);
    assert!(treasury.balance >= amount, EInsufficientBalance);
    treasury.balance = treasury.balance - amount;
    amount
}
```

### 重入安全

与以太坊不同，Sui 的交易模型天然防止重入攻击。每个交易是原子性的，在一个交易内对共享对象的修改不会被其他交易"中途"观察到。

### 前置交易（Front-running）

由于共享对象的交易需要共识排序，理论上存在前置交易（front-running）的风险——矿工/验证者可以在看到你的交易后抢先提交自己的交易。在设计金融协议时需要考虑这一点。

## 共享对象 vs 其他所有权类型

| 特性 | Address-owned | Shared | Immutable |
|------|-------------|--------|-----------|
| 访问权限 | 仅所有者 | 任何人 | 任何人（只读） |
| 修改 | 所有者可修改 | 任何人可修改 | 不可修改 |
| 删除 | 所有者可删除 | 可删除（需权限检查） | 不可删除 |
| 转移 | 可转移 | 不可转移 | 不可转移 |
| 执行路径 | 快速路径 | 共识路径 | 快速路径 |
| 并发性 | 低（独占） | 需要排序 | 高（无限并行） |

## 小结

共享对象是 Sui 中实现多方交互的关键机制，但也带来了性能和安全方面的挑战：

- **创建方式**：通过 `share_object`（模块内部）或 `public_share_object`（需要 `store` 能力）。
- **任何人可访问**：共享对象可以被任何地址在交易中使用，支持读写操作。
- **共识排序**：涉及共享对象的交易需要经过共识，延迟高于快速路径。
- **不可逆转**：共享状态是不可逆的，但共享对象可以被销毁。
- **权限控制**：必须在合约逻辑中自行实现，因为任何人都能调用函数。
- **性能优化**：最小化共享对象的使用、分片、读写分离是常见的优化策略。

在设计 Sui 应用时，应该审慎使用共享对象——只在确实需要多方交互时才使用，其余数据尽量存储在地址所有或不可变对象中。


---


<!-- source: 06_object_model/ownership-wrapped.md -->
## 8.3.4 包装对象

# 包装对象

包装对象（Wrapped Object）是 Sui 对象模型中一种强大的组合机制——一个对象可以被另一个对象"包装"在内部，成为其字段的一部分。被包装的对象从全局对象存储中"消失"，不再能被直接访问，只有通过父对象才能触及它们。这种机制非常适合建模层级关系，比如游戏角色与装备、容器与内容物等。

本章将详细介绍包装对象的工作原理、使用方式、以及在实际开发中的常见模式。

## 什么是包装

在 Sui 中，当一个对象（子对象）被存储为另一个对象（父对象）的字段时，就发生了**包装（wrapping）**。被包装的子对象：

- 从 Sui 的全局对象存储中**移除**
- 不再能被直接通过 ID 查询或访问
- 只能通过父对象间接访问
- 其 UID 仍然存在，但不在顶层索引中

### 包装的前提条件

子对象必须具有 `store` 能力，才能被嵌入到其他对象中。这是因为 `store` 能力的定义就是"可以作为其他对象的字段存储"。

```move
module examples::wrapping_basics;

/// 子对象：具有 key + store，可以独立存在，也可以被包装
public struct Gem has key, store {
    id: UID,
    value: u64,
}

/// 父对象：将 Gem 包装在内部
public struct Chest has key {
    id: UID,
    gem: Gem,   // Gem 被包装在 Chest 中
}

public fun create_chest_with_gem(
    gem_value: u64,
    ctx: &mut TxContext,
): Chest {
    let gem = Gem {
        id: object::new(ctx),
        value: gem_value,
    };
    Chest {
        id: object::new(ctx),
        gem,
    }
}
```

当 `Chest` 被创建并放到链上时，`Gem` 作为 `Chest` 的字段一起存储。此时 `Gem` 不能被独立查询——你必须通过 `Chest` 来访问它。

## 使用 Option 实现可选包装

更常见的模式是使用 `Option<T>` 来表示一个对象**可能持有**也可能不持有某个子对象。这在游戏场景中尤为常用：

```move
module examples::wrapped_objects;

use std::string::String;

public struct Sword has key, store {
    id: UID,
    damage: u64,
    name: String,
}

public struct Shield has key, store {
    id: UID,
    defense: u64,
}

public struct Hero has key {
    id: UID,
    name: String,
    hp: u64,
    sword: Option<Sword>,
    shield: Option<Shield>,
}

public fun create_hero(
    name: String,
    ctx: &mut TxContext,
): Hero {
    Hero {
        id: object::new(ctx),
        name,
        hp: 100,
        sword: option::none(),
        shield: option::none(),
    }
}

public fun equip_sword(hero: &mut Hero, sword: Sword) {
    option::fill(&mut hero.sword, sword);
}

public fun unequip_sword(hero: &mut Hero): Sword {
    option::extract(&mut hero.sword)
}

public fun create_sword(
    damage: u64,
    name: String,
    ctx: &mut TxContext,
): Sword {
    Sword { id: object::new(ctx), damage, name }
}
```

### 装备与卸下流程

1. **创建英雄**：调用 `create_hero`，此时 `sword` 和 `shield` 都是 `option::none()`。
2. **创建武器**：调用 `create_sword` 创建一把 `Sword` 对象（地址所有）。
3. **装备武器**：调用 `equip_sword`，将 `Sword` 按值传入并存储到 `Hero` 内部。此时 `Sword` 从全局对象存储中消失，被包装在 `Hero` 中。
4. **卸下武器**：调用 `unequip_sword`，从 `Hero` 中提取 `Sword`。提取后的 `Sword` 重新成为独立对象，需要被转移给某个地址。

## 包装与解包装的完整生命周期

```move
module examples::wrap_lifecycle;

use std::string::String;

public struct Accessory has key, store {
    id: UID,
    name: String,
    bonus: u64,
}

public struct Character has key {
    id: UID,
    name: String,
    accessories: vector<Accessory>,
}

/// 创建一个角色
public fun create_character(name: String, ctx: &mut TxContext): Character {
    Character {
        id: object::new(ctx),
        name,
        accessories: vector::empty(),
    }
}

/// 创建一个饰品
public fun create_accessory(
    name: String,
    bonus: u64,
    ctx: &mut TxContext,
): Accessory {
    Accessory { id: object::new(ctx), name, bonus }
}

/// 包装：将饰品添加到角色身上
public fun add_accessory(character: &mut Character, acc: Accessory) {
    vector::push_back(&mut character.accessories, acc);
}

/// 解包装：从角色身上移除饰品（按索引）
public fun remove_accessory(
    character: &mut Character,
    index: u64,
): Accessory {
    vector::remove(&mut character.accessories, index)
}

/// 读取角色的饰品数量
public fun accessory_count(character: &Character): u64 {
    vector::length(&character.accessories)
}

/// 销毁角色和所有饰品
public fun destroy_character(character: Character) {
    let Character { id, name: _, mut accessories } = character;
    while (!vector::is_empty(&accessories)) {
        let acc = vector::pop_back(&mut accessories);
        let Accessory { id: acc_id, name: _, bonus: _ } = acc;
        acc_id.delete();
    };
    vector::destroy_empty(accessories);
    id.delete();
}
```

### 销毁包含被包装对象的父对象

当销毁一个包含被包装对象的父对象时，你**必须同时处理所有被包装的子对象**。由于子对象不具有 `drop` 能力（数字资产不应该有），你需要：

1. 解构父对象，取出所有子对象
2. 对每个子对象，要么转移给某个地址，要么也解构并销毁它

上面的 `destroy_character` 函数展示了逐一销毁所有饰品的过程。

## 包装 vs `transfer::transfer_to_object`

Sui 提供了两种方式让一个对象"拥有"另一个对象：

### 方式一：直接包装（Wrapping）

将子对象存储为父对象的字段。子对象从全局存储中消失。

**优点**：
- 访问子对象只需要访问父对象
- 数据局部性好
- 概念简单直观

**缺点**：
- 子对象不能被直接查询
- 修改子对象必须通过父对象
- 需要 `store` 能力

### 方式二：对象转移到对象

使用 `transfer::transfer` 将子对象转移给父对象的 UID 地址。子对象仍然存在于全局存储中，但其所有者是另一个对象。

**优点**：
- 子对象仍然可以被查询（通过 ID）
- 可以独立地读取子对象的版本和状态

**缺点**：
- 需要额外的机制来访问子对象（如 `Receiving`）
- 概念上更复杂

在大多数场景中，直接包装是更简单和常用的选择。

## 进阶模式：背包系统

下面是一个更复杂的背包系统示例，展示了包装对象在游戏开发中的实际应用：

```move
module examples::backpack;

use std::string::String;

const EBackpackFull: u64 = 0;
const EItemNotFound: u64 = 1;

public struct Item has key, store {
    id: UID,
    name: String,
    weight: u64,
}

public struct Backpack has key {
    id: UID,
    max_capacity: u64,
    items: vector<Item>,
}

public fun create_backpack(
    max_capacity: u64,
    ctx: &mut TxContext,
): Backpack {
    Backpack {
        id: object::new(ctx),
        max_capacity,
        items: vector::empty(),
    }
}

public fun create_item(
    name: String,
    weight: u64,
    ctx: &mut TxContext,
): Item {
    Item { id: object::new(ctx), name, weight }
}

/// 将物品放入背包（包装）
public fun put_item(backpack: &mut Backpack, item: Item) {
    assert!(
        vector::length(&backpack.items) < backpack.max_capacity,
        EBackpackFull,
    );
    vector::push_back(&mut backpack.items, item);
}

/// 从背包取出物品（解包装）
public fun take_item(backpack: &mut Backpack, index: u64): Item {
    assert!(index < vector::length(&backpack.items), EItemNotFound);
    vector::remove(&mut backpack.items, index)
}

/// 查看背包中的物品数量
public fun item_count(backpack: &Backpack): u64 {
    vector::length(&backpack.items)
}

/// 计算背包中所有物品的总重量
public fun total_weight(backpack: &Backpack): u64 {
    let mut total = 0u64;
    let mut i = 0u64;
    let len = vector::length(&backpack.items);
    while (i < len) {
        total = total + vector::borrow(&backpack.items, i).weight;
        i = i + 1;
    };
    total
}

/// 丢弃背包中的物品（销毁）
public fun discard_item(backpack: &mut Backpack, index: u64) {
    let item = vector::remove(&mut backpack.items, index);
    let Item { id, name: _, weight: _ } = item;
    id.delete();
}
```

这个背包系统展示了：

- **容量限制**：`max_capacity` 限制了背包能持有的物品数量
- **包装（put_item）**：物品被放入背包后，从全局存储中消失
- **解包装（take_item）**：物品从背包中取出后，重新成为独立对象
- **销毁（discard_item）**：在背包内直接销毁物品

## 注意事项

### 包装的对象不可被直接查询

这是最重要的注意事项。一旦对象被包装，它就不在全局对象索引中了。如果你的应用需要通过对象 ID 直接查询某个对象，那么包装可能不是正确的选择。

### 嵌套包装

对象可以多层嵌套包装：A 包含 B，B 包含 C。这在概念上没问题，但会增加销毁操作的复杂度——你需要逐层解构。

### 大量包装影响交易大小

父对象包含的被包装对象越多，交易读写这个父对象时需要处理的数据量越大。这可能会影响交易的 gas 费用和执行效率。

### store 能力的安全考量

给对象添加 `store` 能力意味着它可以被包装到任何其他对象中，也可以被 `public_transfer` 转移。在设计时需要考虑是否真的需要这种灵活性。

## 小结

包装对象为 Sui 开发者提供了一种强大的对象组合机制，核心要点如下：

- **包装本质**：将子对象存储为父对象的字段，子对象从全局存储中消失。
- **`store` 能力**：子对象必须具有 `store` 能力才能被包装。
- **`Option<T>`**：使用 Option 类型实现可选包装，适合装备/卸下场景。
- **解包装**：从父对象中取出子对象后，它重新成为独立对象。
- **销毁规则**：销毁父对象时必须同时处理所有被包装的子对象。
- **适用场景**：游戏角色与装备、容器与内容物、组合资产等层级关系。

包装对象是构建复杂链上数据结构的重要工具。在需要建模"拥有"关系时，包装比简单地存储 ID 引用更安全、更直观。但要注意包装对象的不可查询性和对交易大小的影响。


---


<!-- source: 06_object_model/ownership-party.md -->
## 8.3.5 Party 对象

# Party 对象

Party 对象是 Sui 的一种**混合所有权**类型：像地址所有对象一样有**单一所有者**，又像共享对象一样由**共识做版本管理**。它适合「需要共识版本、又希望保留单方所有权」或「同一对象上多笔交易并行排队」的场景。

参考：[Sui 官方文档 - Party Objects](https://docs.sui.io/concepts/object-ownership/party)、[sui::party 模块](https://docs.sui.io/references/framework/sui/party)。

## 核心特征

| 特性 | 说明 |
|------|------|
| **所有权** | 归属于一个 **Party**（由 `sui::party::Party` 描述），Party 内可配置多个地址及各自权限 |
| **版本化** | 与共享对象一样经**共识**出块并产生版本，便于多笔交易对同一对象排队（pipeline） |
| **转移方式** | 使用 `transfer::party_transfer` 或 `transfer::public_party_transfer`，将对象「转给」一个 Party |
| **后续转换** | 可再转为地址所有、不可变、或作为动态对象字段；**不能**在创建后变为共享对象 |

与**地址所有**对比：地址所有对象同一时刻只能参与一笔未完成交易；Party 对象可以有多笔 in-flight 交易同时排队，由共识排序后依次执行。

与**共享对象**对比：共享对象任何人都可访问；Party 对象只有 Party 内被授权的主体能访问，访问权限由 Party 的权限配置决定。

## Party 类型与权限

Party 描述「谁对该对象有什么权限」。权限在 `sui::party` 中定义为位掩码：

| 常量 | 值 | 含义 |
|------|---|------|
| `READ` | 1 | 可将对象作为**不可变**输入参与交易（发送时校验） |
| `WRITE` | 2 | 可**修改**对象，但不能改所有者或删除（执行结束时校验） |
| `DELETE` | 4 | 可**删除**对象，不能做其他修改（执行结束时校验） |
| `TRANSFER` | 8 | 可**变更对象所有者**，不能做其他修改（执行结束时校验） |
| `NO_PERMISSIONS` | 0 | 无权限 |
| `ALL_PERMISSIONS` | 15 | 读 + 写 + 删除 + 转移 |

Party 内部可维护「成员 → 权限」的映射；若交易发送方在成员表中，则使用该成员的权限，否则使用默认权限。常用构造方式：

- **`party::single_owner(owner: address): Party`**  
  创建一个「单所有者」Party：仅该 `owner` 拥有全部权限，无其他成员、无默认权限。大多数「把对象交给一个地址，但用共识版本」的场景可用此方式。

## 创建 Party 对象

将对象转为 Party 所有权，使用 `sui::transfer` 中的：

```move
// 模块内使用（不要求对象有 store）
public fun party_transfer<T: key>(obj: T, party: sui::party::Party);

// 公共使用（对象需 key + store）
public fun public_party_transfer<T: key + store>(obj: T, party: sui::party::Party);
```

- 若类型有 **store**，可从任意模块调用 **public_party_transfer**。
- 若类型无 store、且需支持「转给 Party」，则需在定义该类型的模块内使用 **party_transfer**，或通过[自定义转移策略](https://docs.sui.io/guides/developer/objects/transfers/custom-rules.md)控制。

**示例**：铸造一个 NFT 并转为单所有者 Party 对象

```move
use sui::party;
use sui::transfer;

public fun mint_and_party_transfer(
    nft: NFT,
    owner: address,
) {
    let p = party::single_owner(owner);
    transfer::public_party_transfer(nft, p);
}
```

## 何时使用 Party 对象

适合使用 Party 对象的典型情况：

1. **需要共识版本、但仍是单方资产**  
   例如：需要与共享对象或其它 Party 对象在同一交易中交互，希望由共识排序、版本一致，又不想把对象设为「任何人可访问」的共享。

2. **同一对象上多笔交易并行排队（pipeline）**  
   地址所有对象同一时刻只能被一笔交易使用；Party 对象可被多笔 in-flight 交易同时引用，由验证人按共识结果依次执行，有利于高并发场景。

3. **与其它 Party/共享对象一起使用**  
   若对象主要和 Party 或共享对象配合使用，转为 Party 对象不会带来额外共识成本（因为同属共识路径），却能得到单方所有权和权限控制。

**注意**：

- Party 对象**创建后不能再变为共享**；可转为地址所有、不可变或放入动态对象字段。
- **Coin 可以是 Party 对象**，但作为 Party 的 Coin **不能直接用于支付 gas**；若要用其支付 gas，需先转回地址所有。

## 在交易中使用 Party 对象

在 PTB 中，Party 对象与共享对象一样作为**交易输入**传入：按对象 ID（及必要时的版本）指定即可。验证人会检查**交易发送方**是否有权访问该 Party 对象（即是否在该 Party 的成员中且具备相应权限）。若在执行前该 Party 对象的所有者因其它冲突交易已变更，验证人可能在执行时中止交易。

通过「transfer to object」机制接收对象时，若**接收方是对象 ID**（即对象作为「父」接收子对象），则**不支持**以「该对象 ID 为所有者的 Party 对象」作为接收目标；Party 对象的所有者若为**账户地址**则不受此限（按官方文档当前约定）。

## 与其它所有权类型的对比

| 维度 | 地址所有 | 共享 | Party |
|------|----------|------|--------|
| 所有者 | 单一地址 | 无 | 单一 Party（可多成员+权限） |
| 版本化 | 无共识版本 | 共识版本 | 共识版本 |
| 多笔 in-flight 交易 | ❌ | ✅ | ✅ |
| 创建后能否变共享 | ✅（可 share_object） | — | ❌ |
| 典型用法 | 钱包资产、Cap | 市场、池子 | 需共识版本的单方资产、pipeline |

## 小结

- **Party 对象** = 单一 Party 所有 + 共识版本化，通过 **party_transfer / public_party_transfer** 创建，通过 **sui::party::Party**（如 **single_owner**）指定所有者与权限。
- 适合「要共识版本、又要单方控制」或「同一对象多笔交易排队」的场景；**不能**在创建后再改为共享对象。
- 使用前请查阅本书 [Transfer 函数参考](../appendix/transfer-functions.md) 中的 `party_transfer` / `public_party_transfer` 说明，以及 [sui::party](https://docs.sui.io/references/framework/sui/party) 的权限常量与 `single_owner` 等 API。


---


<!-- source: 06_object_model/fast-path-and-consensus.md -->
## 8.4 快速路径与共识

# 快速路径与共识

Sui 区块链的一个核心创新在于其**双轨执行模型**：针对不同类型的对象，Sui 采用不同的交易处理路径。涉及地址所有和不可变对象的交易可以绕过共识，通过"快速路径"直接执行；而涉及共享对象的交易则需要经过共识排序。这种设计使 Sui 在保持安全性的同时，实现了极高的交易吞吐量和极低的延迟。

本章将深入探讨快速路径和共识路径的工作原理、对象类型与执行路径的对应关系，以及如何利用这一机制优化应用性能。

## 区块链的并发挑战

### 传统区块链的瓶颈

在比特币和以太坊等传统区块链中，所有交易都需要**全局排序**。即使两个交易操作的是完全不同的数据，它们也必须被排成一个线性序列来执行。这就像一家银行只有一个柜台——即使客户要办理的业务完全无关，也必须排队等候。

这种模型的问题是明显的：

- **吞吐量受限**：所有交易串行执行，系统吞吐量取决于单线程处理速度
- **延迟较高**：即使是简单交易也要等待共识完成
- **资源浪费**：大量算力用于对无关交易进行排序

### Sui 的创新：基于对象的并发

Sui 的关键洞察是：**不是所有交易都需要全局排序**。如果两个交易操作的是不同的对象，且这些对象各自只有一个所有者，那么这两个交易之间没有冲突，可以**并行执行**。

这就像银行开设了多个柜台——不同客户办理不同业务时可以同时进行，只有涉及同一账户的操作才需要排队。

## 快速路径（Fast Path）

### 工作原理

当一个交易**只涉及地址所有对象和/或不可变对象**时，Sui 会通过快速路径执行它：

1. 交易被提交给一组验证者
2. 每个验证者**独立检查**交易的有效性（签名、对象所有权、版本等）
3. 验证者直接签署交易结果
4. 当收集到足够多的签名（2/3+ 权重）时，交易即完成
5. **不需要验证者之间相互通信达成共识**

这个过程非常快——只需要一到两轮网络通信。

### 为什么可以跳过共识？

关键原因是**所有权的排他性**：

- 地址所有对象只能被其所有者使用
- 一个所有者在同一时刻只能提交一个使用该对象的交易（通过版本号保证）
- 因此不存在两个交易同时修改同一个地址所有对象的可能性

不可变对象更简单——它们永远不会被修改，所以无论多少交易同时读取它们都不会产生冲突。

### 快速路径的性能特征

- **延迟**：通常在 400-600 毫秒内完成（亚秒级）
- **吞吐量**：理论上可以无限扩展（不同对象的交易完全并行）
- **费用**：更低的 gas 费用（不需要共识开销）

## 共识路径（Consensus Path）

### 工作原理

当交易涉及**至少一个共享对象**时，需要通过共识路径执行：

1. 交易被提交给验证者
2. 验证者将交易输入**共识协议**（Sui 使用 Mysticeti 等高性能共识算法）
3. 共识协议对涉及同一共享对象的交易进行**全局排序**
4. 排序后的交易按顺序执行
5. 执行结果被最终确认

### 为什么共享对象需要共识？

共享对象可以被任何人修改。如果两个交易同时尝试修改同一个共享对象：

- 交易 A：将计数器从 10 增加到 11
- 交易 B：将计数器从 10 增加到 11

没有排序的话，两个交易都会读到 10 并写入 11，导致一次增量被"丢失"。共识确保这两个交易被排成 A → B 或 B → A 的顺序执行。

### 共识路径的性能特征

- **延迟**：通常在 2-3 秒内完成
- **吞吐量**：受共识协议性能和共享对象竞争程度影响
- **费用**：相对较高的 gas 费用

## 代码示例：两种路径对比

```move
module examples::fast_path_demo;

/// Address-owned object: uses FAST PATH (no consensus needed)
public struct PersonalNote has key {
    id: UID,
    content: vector<u8>,
}

/// Shared object: requires CONSENSUS
public struct Bulletin has key {
    id: UID,
    messages: vector<vector<u8>>,
}

public fun write_note(content: vector<u8>, ctx: &mut TxContext) {
    let note = PersonalNote {
        id: object::new(ctx),
        content,
    };
    transfer::transfer(note, ctx.sender());
}

public fun create_bulletin(ctx: &mut TxContext) {
    let bulletin = Bulletin {
        id: object::new(ctx),
        messages: vector::empty(),
    };
    transfer::share_object(bulletin);
}

public fun post_message(bulletin: &mut Bulletin, msg: vector<u8>) {
    vector::push_back(&mut bulletin.messages, msg);
}
```

### 执行路径分析

| 操作 | 使用的对象 | 执行路径 | 预期延迟 |
|------|----------|---------|---------|
| `write_note` | 无输入对象（创建新对象） | 快速路径 | ~500ms |
| 修改已有的 `PersonalNote` | 地址所有对象 | 快速路径 | ~500ms |
| `post_message` | 共享的 `Bulletin` | 共识路径 | ~2-3s |
| 读取 `Bulletin` 的 `messages` | 共享的 `Bulletin`（只读） | 共识路径 | ~2-3s |

注意：即使只是**读取**共享对象（使用 `&T`），交易仍然走共识路径。这是因为 Sui 需要确保读取到的是共享对象的最新状态。

## 对象类型与执行路径的映射

### 地址所有对象 → 快速路径

地址所有对象的交易始终走快速路径。这是 Sui 中性能最优的对象类型。

### 不可变对象 → 快速路径

不可变对象永远不会被修改，因此也走快速路径。而且不可变对象可以被**无限数量的交易同时使用**，是最优的只读数据存储方式。

### 共享对象 → 共识路径

共享对象的交易必须走共识路径。这是最慢但功能最强大的执行路径。

### 被包装对象 → 继承父对象

被包装（wrapped）的对象不在全局存储中独立存在，它们的执行路径由**父对象的所有权类型**决定：

- 如果父对象是地址所有的 → 快速路径
- 如果父对象是共享的 → 共识路径

```move
module examples::inherited_path;

use std::string::String;

public struct Weapon has store {
    name: String,
    damage: u64,
}

/// 地址所有的角色 → 对武器的操作走快速路径
public struct OwnedCharacter has key {
    id: UID,
    weapon: Option<Weapon>,
}

/// 共享的 NPC → 对武器的操作走共识路径
public struct SharedNPC has key {
    id: UID,
    weapon: Option<Weapon>,
}

public fun equip_owned(character: &mut OwnedCharacter, weapon: Weapon) {
    option::fill(&mut character.weapon, weapon);
}

public fun equip_shared(npc: &mut SharedNPC, weapon: Weapon) {
    option::fill(&mut npc.weapon, weapon);
}
```

在这个例子中，`equip_owned` 走快速路径（因为 `OwnedCharacter` 是地址所有的），而 `equip_shared` 走共识路径（因为 `SharedNPC` 是共享的）。同样的 `Weapon` 数据操作，因为父对象类型不同，执行路径也不同。

## 混合交易

一个交易可以同时涉及多种类型的对象。在这种情况下：

- **只要有一个共享对象，整个交易就走共识路径**
- 只有**全部**输入对象都是地址所有或不可变的，交易才走快速路径

```move
module examples::mixed_transaction;

public struct OwnedToken has key, store {
    id: UID,
    value: u64,
}

public struct SharedPool has key {
    id: UID,
    total: u64,
}

/// 这个交易同时涉及地址所有对象和共享对象
/// 因此走共识路径
public fun deposit(
    token: OwnedToken,
    pool: &mut SharedPool,
) {
    pool.total = pool.total + token.value;
    let OwnedToken { id, value: _ } = token;
    id.delete();
}
```

`deposit` 函数接收一个地址所有的 `OwnedToken` 和一个共享的 `SharedPool`。由于涉及共享对象，整个交易走共识路径。

## 性能优化策略

理解快速路径和共识路径后，我们可以有针对性地优化应用性能。

### 策略一：最大化使用地址所有对象

将尽可能多的数据存储为地址所有对象，最小化共享对象的使用：

```move
module examples::perf_optimization;

/// 较差设计：所有余额存在一个共享对象中
public struct SharedLedger has key {
    id: UID,
    balances: vector<u64>,
    owners: vector<address>,
}

/// 较好设计：每个用户有自己的余额对象
public struct PersonalBalance has key {
    id: UID,
    balance: u64,
}

/// 用户间转账时才使用共享对象协调
public struct TransferRequest has key {
    id: UID,
    from: address,
    to: address,
    amount: u64,
}
```

### 策略二：利用不可变对象缓存只读数据

将不会变化的数据冻结为不可变对象，享受快速路径的性能：

```move
module examples::cache_pattern;

use std::string::String;

/// 将价格表冻结为不可变对象
public struct PriceTable has key {
    id: UID,
    prices: vector<u64>,
    symbols: vector<String>,
    updated_at: u64,
}

public fun create_price_table(
    prices: vector<u64>,
    symbols: vector<String>,
    timestamp: u64,
    ctx: &mut TxContext,
) {
    let table = PriceTable {
        id: object::new(ctx),
        prices,
        symbols,
        updated_at: timestamp,
    };
    transfer::freeze_object(table);
}

/// 任何人都可以高效地读取价格，走快速路径
public fun price_at(table: &PriceTable, index: u64): u64 {
    *vector::borrow(&table.prices, index)
}
```

### 策略三：延迟共享

对象不需要在创建时就共享。可以先作为地址所有对象进行初始化配置，准备就绪后再共享：

```move
module examples::lazy_sharing;

const ENotConfigured: u64 = 0;

public struct GameRoom has key {
    id: UID,
    name: vector<u8>,
    max_players: u64,
    is_configured: bool,
}

/// 步骤1：创建房间（地址所有，走快速路径）
public fun create_room(
    name: vector<u8>,
    ctx: &mut TxContext,
): GameRoom {
    GameRoom {
        id: object::new(ctx),
        name,
        max_players: 0,
        is_configured: false,
    }
}

/// 步骤2：配置房间（仍是地址所有，走快速路径）
public fun configure(room: &mut GameRoom, max_players: u64) {
    room.max_players = max_players;
    room.is_configured = true;
}

/// 步骤3：配置完成后共享（之后走共识路径）
public fun open_room(room: GameRoom) {
    assert!(room.is_configured, ENotConfigured);
    transfer::share_object(room);
}
```

这种模式将配置阶段（可能需要多次修改）保持在快速路径上，只在最终需要多方访问时才切换到共识路径。

## 执行路径的选择决策树

在设计应用时，可以按照以下决策树来选择对象的所有权类型：

```
该数据是否需要被多方修改？
├── 否 → 该数据创建后是否需要修改？
│   ├── 否 → 使用不可变对象（快速路径，最优）
│   └── 是 → 使用地址所有对象（快速路径）
└── 是 → 使用共享对象（共识路径，必要时）
```

## 实际性能数据

以下是 Sui 主网上不同执行路径的典型性能数据（供参考）：

| 指标 | 快速路径 | 共识路径 |
|------|---------|---------|
| 最终确认延迟 | 400-600ms | 2-3s |
| 吞吐量 | 极高（并行） | 受共识限制 |
| Gas 费用 | 较低 | 较高 |
| 并发能力 | 无冲突交易完全并行 | 同一对象的交易串行 |

## 小结

Sui 的双轨执行模型是其高性能的核心秘密。关键要点回顾：

- **快速路径**：涉及地址所有对象和不可变对象的交易跳过共识，直接执行，延迟极低。
- **共识路径**：涉及共享对象的交易需要共识排序，延迟较高但保证了数据一致性。
- **混合交易**：只要包含一个共享对象，整个交易就走共识路径。
- **继承规则**：被包装对象继承父对象的执行路径。
- **性能优化**：最大化使用地址所有和不可变对象，最小化共享对象的使用。
- **延迟共享**：先以地址所有对象进行初始化，准备就绪后再共享。

理解并善用快速路径与共识路径的区别，是构建高性能 Sui 应用的关键。在大多数应用中，80-90% 的交易都可以设计为走快速路径，只有在真正需要多方交互时才使用共享对象。


---


<!-- source: 07_using_objects/index.md -->
## 第九章 · 使用对象

# 第九章 · 使用对象

本章讲解如何在 Move 代码中创建、存储、转移和接收对象，掌握对象操作的全部 API。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 7.1 | key 能力 | 使结构体成为对象、UID 的作用 |
| 7.2 | store 能力 | 嵌套存储、与 key 的区别 |
| 7.3 | UID 与 ID | object::new()、id() 方法、UID 销毁 |
| 7.4 | 存储函数 | transfer / public_transfer / share / freeze |
| 7.5 | 转移限制 | 有 store 与无 store 的区别 |
| 7.6 | 接收对象 | transfer::receive、对象邮箱模式 |

## 学习目标

读完本章后，你将能够：

- 正确使用 key 和 store 能力定义对象
- 选择合适的存储函数管理对象
- 实现对象间的转移和接收


---


<!-- source: 07_using_objects/ability-key.md -->
## 9.1 key 能力

# key 能力

在 Sui Move 中，`key` 能力是定义**对象（Object）**的核心标志。一个结构体只有拥有 `key` 能力，才能作为独立的链上对象存在，拥有全局唯一的标识符，并参与 Sui 的所有权和存储模型。理解 `key` 能力是掌握 Sui 对象系统的第一步。

## key 的历史演变

在早期的 Move 语言（Diem/Aptos 版本）中，`key` 能力表示一个类型可以作为**全局存储的顶层资源（Resource）**存在。拥有 `key` 的结构体可以通过 `move_to`、`move_from` 等操作存储到账户地址下。

Sui Move 对 `key` 的语义进行了重新定义：

- **不再有全局存储操作**：Sui 移除了 `move_to`、`move_from`、`borrow_global` 等全局存储原语。
- **key = 对象**：在 Sui 中，`key` 能力的唯一作用是将一个结构体声明为**对象**。
- **对象模型取代资源模型**：Sui 使用基于对象的存储模型，每个对象通过唯一的 `UID` 在链上独立存在。

这一转变使得 Sui 能够实现并行交易执行——每个对象独立寻址，不依赖账户级别的全局存储。

## 对象定义规则

### 第一字段必须是 `id: UID`

这是 Sui Move 的硬性规则：任何拥有 `key` 能力的结构体，**第一个字段必须是 `id: UID`**。这由 Sui 字节码验证器（Sui Verifier）在编译和发布时强制检查。

```move
module examples::key_demo;

use std::string::String;

/// 一个拥有 `key` 能力的结构体就是一个 Object
/// 第一个字段必须是 `id: UID`
public struct User has key {
    id: UID,
    name: String,
    age: u8,
}

/// 创建一个新的 User 对象
public fun new(name: String, age: u8, ctx: &mut TxContext): User {
    User {
        id: object::new(ctx),
        name,
        age,
    }
}

/// 创建并转移给发送者
public fun create_and_send(name: String, age: u8, ctx: &mut TxContext) {
    let user = new(name, age, ctx);
    transfer::transfer(user, ctx.sender());
}
```

`UID` 是对象的全局唯一标识符。它由 `object::new(ctx)` 生成，其底层是从交易哈希和计数器派生的地址值，保证全局唯一且不可预测。

### 违反规则的示例

以下代码**无法通过编译**：

```move
// 错误！第一个字段不是 `id: UID`
public struct BadObject has key {
    name: String,  // 第一个字段必须是 id: UID
    id: UID,
}
```

```move
// 错误！缺少 id 字段
public struct AlsoBad has key {
    value: u64,
}
```

Sui 验证器会拒绝这些定义，确保所有对象都有统一的标识方式。

## key 与 store 的字段约束

拥有 `key` 能力的结构体，其**所有字段**的类型都必须拥有 `store` 能力。这是 Move 类型系统的约束——一个结构体的能力不能"超过"其字段类型的能力。

```move
/// String 拥有 store，u8 拥有 store，UID 拥有 store
/// 所以 Profile 可以拥有 key
public struct Profile has key {
    id: UID,          // UID has store
    name: String,     // String has store
    score: u64,       // u64 has store
}
```

如果某个字段的类型没有 `store`，编译器会报错：

```move
public struct NoStore { value: u64 }

// 错误！NoStore 没有 store 能力
public struct Invalid has key {
    id: UID,
    data: NoStore,  // 编译失败
}
```

### 原生类型的 store 能力

以下原生类型天然拥有 `store`（以及 `copy` 和 `drop`）：

| 类型 | 能力 |
|------|------|
| `bool` | `copy`, `drop`, `store` |
| `u8`, `u16`, `u32`, `u64`, `u128`, `u256` | `copy`, `drop`, `store` |
| `address` | `copy`, `drop`, `store` |
| `vector<T>` | 继承 `T` 的能力 |

## key 与 copy/drop 的关系

这是理解 Sui 对象模型的关键点：**拥有 `key` 能力的结构体通常不能同时拥有 `copy` 或 `drop`**。

原因在于 `UID` 类型：

- `UID` **没有** `copy` 能力——对象标识不能被复制，否则两个对象会共享同一个 ID。
- `UID` **没有** `drop` 能力——对象标识不能被隐式丢弃，必须显式调用 `id.delete()` 删除。

由于结构体的能力受限于其字段类型的能力，包含 `UID` 的结构体自然无法拥有 `copy` 或 `drop`：

```move
// 错误！UID 没有 copy 和 drop，所以 CopyObj 不能拥有它们
public struct CopyObj has key, copy, drop {
    id: UID,
    value: u64,
}
```

这个设计是刻意为之的：

- **不能 copy**：确保每个对象在链上是唯一的，不会出现"分身"。
- **不能 drop**：确保对象不会被意外丢弃，必须被显式转移（transfer）、共享（share）、冻结（freeze）或销毁（delete）。

### 对象的去向

由于对象不能被 `drop`，在函数结束时，对象必须有一个明确的归宿：

```move
public fun must_handle_object(ctx: &mut TxContext) {
    let user = User {
        id: object::new(ctx),
        name: std::string::utf8(b"Alice"),
        age: 25,
    };

    // 必须处理 user，以下四种方式之一：
    // 1. 转移给某人
    transfer::transfer(user, ctx.sender());

    // 2. 共享为共享对象
    // transfer::share_object(user);

    // 3. 冻结为不可变对象
    // transfer::freeze_object(user);

    // 4. 解构并删除 UID
    // let User { id, name: _, age: _ } = user;
    // id.delete();
}
```

## 拥有 key 能力的类型总结

在 Sui 生态中，几乎所有链上实体都是拥有 `key` 的对象：

| 用途 | 示例 |
|------|------|
| NFT | `public struct NFT has key, store { id: UID, ... }` |
| 代币金库 | `public struct TreasuryCap has key, store { id: UID, ... }` |
| 权限凭证 | `public struct AdminCap has key { id: UID }` |
| 配置对象 | `public struct Config has key { id: UID, ... }` |
| 共享状态 | `public struct Registry has key { id: UID, ... }` |

注意：有些对象只有 `key` 而没有 `store`，这是为了限制转移权限（详见后续章节）。

## 完整示例：游戏角色对象

```move
module examples::game_character;

use std::string::String;

public struct Weapon has store {
    name: String,
    damage: u64,
}

public struct Character has key {
    id: UID,
    name: String,
    level: u8,
    hp: u64,
    weapon: Weapon,
}

public fun create_character(
    name: String,
    ctx: &mut TxContext,
) {
    let starter_weapon = Weapon {
        name: std::string::utf8(b"Wooden Sword"),
        damage: 10,
    };

    let character = Character {
        id: object::new(ctx),
        name,
        level: 1,
        hp: 100,
        weapon: starter_weapon,
    };

    transfer::transfer(character, ctx.sender());
}

public fun upgrade_weapon(
    character: &mut Character,
    new_weapon_name: String,
    new_damage: u64,
) {
    character.weapon = Weapon {
        name: new_weapon_name,
        damage: new_damage,
    };
}

public fun destroy_character(character: Character) {
    let Character {
        id,
        name: _,
        level: _,
        hp: _,
        weapon: _,
    } = character;
    id.delete();
}
```

在这个例子中：

- `Weapon` 拥有 `store`——它可以作为对象的字段存在，但本身不是对象。
- `Character` 拥有 `key`——它是链上对象，拥有唯一的 `id`。
- `Character` 的所有字段（`UID`、`String`、`u8`、`u64`、`Weapon`）都拥有 `store`。
- `Character` 没有 `copy` 或 `drop`，因此必须在 `destroy_character` 中显式解构并删除 `UID`。

## 小结

- `key` 能力是 Sui 对象的定义标志，任何拥有 `key` 的结构体都是链上对象。
- 对象的第一个字段**必须**是 `id: UID`，这是 Sui 验证器的硬性要求。
- 对象的所有字段类型都必须拥有 `store` 能力。
- 由于 `UID` 没有 `copy` 和 `drop`，对象通常也不能拥有这两个能力，这保证了对象的唯一性和不可丢弃性。
- 对象在使用完毕后必须被转移、共享、冻结或显式销毁——没有第五种选择。


---


<!-- source: 07_using_objects/ability-store.md -->
## 9.2 store 能力

# store 能力

`store` 能力在 Sui Move 中扮演着双重角色：它既控制一个类型**能否被嵌套存储**在其他对象中，又决定了对象的**转移权限**是开放的还是受限的。理解 `store` 能力对于设计合理的对象访问控制至关重要。

## store 的基本定义

`store` 能力表示一个类型可以出现在拥有 `key` 的结构体内部作为字段。换句话说，`store` 是"可被存储"的许可证。

```move
module examples::store_demo;

use std::string::String;

/// 拥有 `store` —— 可以作为其他对象的字段
public struct Metadata has store {
    bio: String,
    website: String,
}

/// 拥有 `key` + `store` —— 既是对象，又可公开转移
public struct TradableItem has key, store {
    id: UID,
    name: String,
    metadata: Metadata,
}
```

`Metadata` 本身不是对象（没有 `key`），但它拥有 `store`，所以可以作为 `TradableItem` 的字段嵌套存储。

## store 与 key 的关系

这是一条经常被忽视但至关重要的规则：

> **拥有 `key` 能力的结构体，其所有字段的类型都必须拥有 `store` 能力。**

这意味着如果你定义了一个对象，那么这个对象内部的每个字段类型都必须明确声明 `store`：

```move
/// 拥有 store 的辅助类型
public struct Stats has store {
    strength: u64,
    agility: u64,
}

/// 合法：所有字段类型都有 store
public struct Hero has key {
    id: UID,       // UID has store
    name: String,  // String has store
    stats: Stats,  // Stats has store（我们刚声明的）
    level: u64,    // u64 has store
}
```

```move
/// 没有声明任何能力
public struct RawData {
    bytes: vector<u8>,
}

/// 非法！RawData 没有 store
public struct BadObj has key {
    id: UID,
    data: RawData,  // 编译错误
}
```

### 隐含关系链

这形成了一个自底向上的能力依赖链：

```
key 结构体
  └── 所有字段必须有 store
        └── 这些字段的字段也必须有 store
              └── ... 递归到叶子类型
```

## store 与 copy/drop 的关系

`store` 与 `copy`、`drop` 是完全**独立**的能力，它们之间没有隐含的依赖关系：

| 组合 | 合法？ | 含义 |
|------|--------|------|
| `store` | 是 | 可嵌套存储，不可复制，不可丢弃 |
| `store, copy` | 是 | 可嵌套存储，可复制 |
| `store, drop` | 是 | 可嵌套存储，可丢弃 |
| `store, copy, drop` | 是 | 可嵌套存储，可复制，可丢弃 |
| `copy, drop`（无 store） | 是 | 纯内存类型，不可存储在对象中 |

```move
/// 可存储、可复制、可丢弃的轻量数据
public struct Point has store, copy, drop {
    x: u64,
    y: u64,
}

/// 只能存储，不可复制不可丢弃——适合表示唯一性资源
public struct UniqueGem has store {
    rarity: u8,
    color: vector<u8>,
}
```

## store 作为"公开"修饰符

在 Sui 中，`store` 能力的另一个关键作用是**解锁公开存储操作**。这是 Sui 特有的语义，在其他 Move 平台上不存在。

### 核心规则

`sui::transfer` 模块提供了两组存储函数：

| 内部函数（key 即可） | 公开函数（需要 key + store） |
|----------------------|----------------------------|
| `transfer::transfer` | `transfer::public_transfer` |
| `transfer::freeze_object` | `transfer::public_freeze_object` |
| `transfer::share_object` | `transfer::public_share_object` |

- **内部函数**：只能在**定义该类型的模块内部**调用。
- **公开函数**：可以在**任何模块**中调用，但要求类型同时拥有 `key` 和 `store`。

```move
/// 只有 `key` —— 转移受限，只有定义模块能控制
public struct SoulboundBadge has key {
    id: UID,
    title: String,
}

/// `key` + `store` —— 任何人都可以公开转移
public struct TradableItem has key, store {
    id: UID,
    name: String,
    metadata: Metadata,
}
```

### 模块控制的转移

对于只有 `key` 的 `SoulboundBadge`，只有定义它的模块才能调用 `transfer::transfer`：

```move
/// 模块控制：只有本模块能决定 badge 的去向
public fun issue_badge(
    title: String,
    recipient: address,
    ctx: &mut TxContext,
) {
    let badge = SoulboundBadge { id: object::new(ctx), title };
    transfer::transfer(badge, recipient);
}
```

其他模块尝试转移 `SoulboundBadge` 会被 Sui 验证器拒绝：

```move
// 在另一个模块中——编译失败！
// SoulboundBadge 只有 key，不能在外部模块使用 transfer
public fun try_steal(badge: SoulboundBadge, thief: address) {
    transfer::transfer(badge, thief);        // 错误
    transfer::public_transfer(badge, thief); // 也是错误，因为没有 store
}
```

### 公开转移

对于拥有 `key + store` 的 `TradableItem`，任何模块都可以转移它：

```move
/// 任何模块都可以调用——因为 TradableItem 有 store
public fun trade(item: TradableItem, to: address) {
    transfer::public_transfer(item, to);
}
```

## 拥有 store 的标准类型

Sui 标准库和 Move 标准库中的大多数类型都拥有 `store`：

| 类型 | 能力 |
|------|------|
| `bool`, `u8` ~ `u256`, `address` | `copy`, `drop`, `store` |
| `vector<T>` | 继承 `T` 的能力 |
| `String` (`std::string`) | `copy`, `drop`, `store` |
| `Option<T>` | 继承 `T` 的能力 |
| `UID` | `store` |
| `ID` | `copy`, `drop`, `store` |
| `Coin<T>` | `key`, `store` |
| `Balance<T>` | `store` |
| `Table<K, V>` | `store` |
| `Bag` | `store` |

## 有无 store 的设计考量

选择是否给对象添加 `store` 能力是一个重要的设计决策：

### 添加 store（key + store）

- 用户可以自由转移、交易对象
- 适合 NFT、代币、游戏道具等需要流通的资产
- 可以被包装（wrapped）在其他对象中
- 放弃了模块对转移的独占控制

### 不添加 store（仅 key）

- 只有定义模块能控制对象的转移
- 适合权限凭证（Capability）、灵魂绑定代币（SBT）、系统配置
- 模块可以实现自定义转移逻辑（如收费转移、条件转移）
- 无法被其他模块的对象包含

## 完整示例：游戏资产系统

```move
module examples::game_assets;

use std::string::String;

/// 可交易的游戏道具（key + store）
public struct Sword has key, store {
    id: UID,
    name: String,
    attack: u64,
}

/// 不可交易的玩家等级证明（仅 key）
public struct PlayerRank has key {
    id: UID,
    rank: u64,
    player: address,
}

/// 可嵌套的附魔效果（仅 store）
public struct Enchantment has store, copy, drop {
    element: String,
    power: u64,
}

/// 带附魔的高级武器
public struct EnchantedSword has key, store {
    id: UID,
    base: Sword,
    enchantment: Enchantment,
}

/// 铸造武器——任何人随后可自由转移
public fun forge_sword(
    name: String,
    attack: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let sword = Sword { id: object::new(ctx), name, attack };
    transfer::public_transfer(sword, recipient);
}

/// 授予等级——只有本模块能转移
public fun grant_rank(
    player: address,
    rank: u64,
    ctx: &mut TxContext,
) {
    let player_rank = PlayerRank {
        id: object::new(ctx),
        rank,
        player,
    };
    transfer::transfer(player_rank, player);
}

/// 附魔武器
public fun enchant_sword(
    sword: Sword,
    element: String,
    power: u64,
    ctx: &mut TxContext,
): EnchantedSword {
    let enchantment = Enchantment { element, power };
    EnchantedSword {
        id: object::new(ctx),
        base: sword,
        enchantment,
    }
}

/// 拆解附魔武器，取回基础武器
public fun disenchant(enchanted: EnchantedSword): Sword {
    let EnchantedSword { id, base, enchantment: _ } = enchanted;
    id.delete();
    base
}
```

## 小结

- `store` 能力表示一个类型可以作为对象的字段存储，是嵌套存储的许可证。
- 拥有 `key` 的对象，其所有字段类型都必须拥有 `store`。
- `store` 与 `copy`、`drop` 是完全独立的，可以自由组合。
- 在 Sui 中，`store` 还充当"公开"修饰符——`key + store` 的对象可以被任何模块使用 `public_transfer`、`public_freeze_object`、`public_share_object` 操作。
- 只有 `key` 的对象，其存储操作被限制在定义模块内部，适合实现灵魂绑定、权限控制等场景。
- 是否添加 `store` 是灵活性与控制权之间的权衡——这是 Sui 对象设计中最重要的决策之一。


---


<!-- source: 07_using_objects/uid-and-id.md -->
## 9.3 UID 与 ID

# UID 与 ID

`UID` 和 `ID` 是 Sui 对象系统的基石类型。每个链上对象都通过一个全局唯一的 `UID` 来标识，而 `ID` 则是 `UID` 的轻量级引用形式，用于在不持有对象的情况下指向它。深入理解这两个类型的定义、生成机制和生命周期，是构建可靠 Sui 应用的前提。

## UID 的定义

`UID` 定义在 `sui::object` 模块中，是一个包装了 `ID` 的结构体：

```move
// sui::object 模块中的定义（简化）
public struct UID has store {
    id: ID,
}
```

而 `ID` 又是一个包装了 `address` 的结构体：

```move
public struct ID has copy, drop, store {
    bytes: address,
}
```

因此，层级关系为：

```
UID (has store)
 └── ID (has copy, drop, store)
      └── address (has copy, drop, store)
```

注意 `UID` 的能力：

- **有 `store`**：可以作为对象的字段（`key` 结构体要求所有字段有 `store`）。
- **没有 `copy`**：对象标识不可复制，确保唯一性。
- **没有 `drop`**：对象标识不可隐式丢弃，必须显式删除。

## UID 的生成机制

### object::new(ctx)

`UID` 通过 `object::new(ctx)` 创建，其中 `ctx` 是 `&mut TxContext`——交易上下文的可变引用：

```move
let uid: UID = object::new(ctx);
```

底层实现流程：

1. 从 `TxContext` 中获取**交易哈希**（`tx_hash`）。
2. 获取并递增 `TxContext` 中的**对象计数器**（`ids_created`）。
3. 将 `tx_hash` 和计数器值通过哈希函数派生出一个唯一的 `address`。
4. 用这个 `address` 构造 `ID`，再包装为 `UID`。

这个机制保证了：

- **同一笔交易内**：即使创建多个对象，每个 `UID` 都不同（计数器递增）。
- **不同交易之间**：交易哈希不同，派生的地址自然不同。
- **不可预测性**：外部无法提前计算出将要生成的 `UID`。

### 必须在同一函数中使用

`UID` 一旦创建，由于没有 `drop` 能力，必须在当前执行路径中被使用（嵌入到对象中）或被删除。编译器会确保不存在被遗忘的 `UID`。

## UID 的生命周期

一个 `UID` 从创建到销毁的完整生命周期：

```move
module examples::uid_demo;

public struct Character has key {
    id: UID,
    name: vector<u8>,
}

/// 创建并销毁一个角色——演示 UID 完整生命周期
public fun create_and_destroy(ctx: &mut TxContext) {
    // 1. 创建 UID
    let char = Character {
        id: object::new(ctx),
        name: b"Hero",
    };

    // 2. 解构对象，取出 UID
    let Character { id, name: _ } = char;

    // 3. 显式删除 UID
    id.delete();
}
```

### 三个阶段

| 阶段 | 操作 | 说明 |
|------|------|------|
| 创建 | `object::new(ctx)` | 生成全局唯一的 UID |
| 使用 | 作为对象的 `id` 字段 | 对象通过 UID 在链上寻址 |
| 删除 | `id.delete()` | 释放 UID，对象从链上消失 |

### 删除的重要性

`UID` 的删除不仅仅是内存释放——它意味着这个对象标识从 Sui 的全局对象表中移除。被删除的 `UID` 对应的对象将不再可查询或访问。

## ID 类型详解

`ID` 是 `UID` 的内部表示，但它拥有 `copy`、`drop` 和 `store`，使得它可以被自由复制和传递：

```move
/// 演示 ID 和地址的转换
public fun id_operations(ctx: &mut TxContext) {
    let uid: UID = object::new(ctx);

    // UID -> ID（复制内部 ID）
    let id: ID = uid.to_inner();

    // UID -> address
    let addr_from_uid: address = uid.to_address();

    // ID -> address
    let addr_from_id: address = id.to_address();

    assert!(addr_from_uid == addr_from_id, 0);

    uid.delete();
}
```

### ID 的常用方法

| 方法 | 签名 | 说明 |
|------|------|------|
| `object::id<T>` | `&T -> ID` | 从对象引用获取 ID |
| `object::id_address<T>` | `&T -> address` | 从对象引用获取地址 |
| `uid.to_inner()` | `&UID -> ID` | 从 UID 引用获取 ID 副本 |
| `uid.to_address()` | `&UID -> address` | 从 UID 引用获取地址 |
| `id.to_address()` | `&ID -> address` | 从 ID 获取底层地址 |
| `object::id_to_address` | `&ID -> address` | 同上的模块函数形式 |
| `object::id_from_address` | `address -> ID` | 从地址构造 ID |

### ID 的典型用途

`ID` 常用于在不持有对象的情况下引用它：

```move
public struct Listing has key {
    id: UID,
    item_id: ID,        // 引用另一个对象
    seller: address,
    price: u64,
}

public struct TransferRecord has key {
    id: UID,
    object_id: ID,      // 记录哪个对象被转移了
    from: address,
    to: address,
}
```

## fresh_object_address

有时候你需要一个全局唯一的地址，但不需要创建完整的 `UID`（例如用作订单 ID、随机种子等）：

```move
/// 生成唯一的订单 ID，不创建对象
public fun unique_order_id(ctx: &mut TxContext): address {
    tx_context::fresh_object_address(ctx)
}
```

`fresh_object_address` 使用与 `object::new` 相同的派生机制，但只返回 `address`，不创建 `UID`。这意味着它也会递增 `TxContext` 中的计数器。

## UID 派生：derived_object 模块

Sui 还提供了基于已有 UID 的**确定性派生**机制，通过 `sui::derived_object` 模块实现：

```move
/// 从父对象的 UID 派生一个新的地址
public fun derive_id(uid: &UID, derivation_key: u64): address {
    // 基于 uid 的地址和 derivation_key 进行哈希派生
    sui::derived_object::derive_id(uid.to_address(), derivation_key)
}
```

派生 ID 的特点：

- **确定性**：同一个父 UID + 同一个 key，总是得到相同的派生地址。
- **用途**：创建与父对象逻辑关联的子对象，使得子对象的 ID 可预测。

## 删除证明（Proof of Deletion）

由于 `UID` 不能被 `drop`，必须通过 `id.delete()` 显式删除，这一特性可以被利用来实现**删除证明**模式：

```move
module examples::deletion_proof;

public struct Asset has key {
    id: UID,
    value: u64,
}

public struct DeletionReceipt has key {
    id: UID,
    deleted_asset_id: ID,
    deleted_value: u64,
}

/// 销毁资产并发放删除凭证
public fun destroy_with_receipt(
    asset: Asset,
    ctx: &mut TxContext,
): DeletionReceipt {
    let asset_id = object::id(&asset);
    let Asset { id, value } = asset;
    id.delete();

    DeletionReceipt {
        id: object::new(ctx),
        deleted_asset_id: asset_id,
        deleted_value: value,
    }
}
```

这个模式在以下场景非常有用：

- **跨模块销毁协议**：模块 A 需要验证模块 B 的对象已被销毁。
- **销毁即铸造**：销毁旧版本资产后，凭凭证铸造新版本。
- **退款流程**：销毁代金券后凭删除凭证领取退款。

## 完整示例：对象注册表

```move
module examples::registry;

use sui::table::{Self, Table};

public struct Registry has key {
    id: UID,
    items: Table<ID, address>,
    count: u64,
}

public struct Item has key, store {
    id: UID,
    data: vector<u8>,
}

public fun create_registry(ctx: &mut TxContext) {
    let registry = Registry {
        id: object::new(ctx),
        items: table::new(ctx),
        count: 0,
    };
    transfer::share_object(registry);
}

public fun register_item(
    registry: &mut Registry,
    data: vector<u8>,
    ctx: &mut TxContext,
) {
    let item = Item {
        id: object::new(ctx),
        data,
    };

    let item_id = object::id(&item);
    registry.items.add(item_id, ctx.sender());
    registry.count = registry.count + 1;

    transfer::public_transfer(item, ctx.sender());
}

public fun is_registered(registry: &Registry, item: &Item): bool {
    let item_id = object::id(item);
    registry.items.contains(item_id)
}
```

## 小结

- `UID` 是 Sui 对象的全局唯一标识符，由 `object::new(ctx)` 生成，底层通过交易哈希和计数器派生。
- `UID` 拥有 `store` 但没有 `copy` 和 `drop`，确保了对象标识的唯一性和不可丢弃性。
- `ID` 是 `UID` 的轻量级引用形式，拥有 `copy`、`drop`、`store`，适合用于记录和引用对象。
- `UID` 的生命周期包括创建、使用和删除三个阶段，每个 `UID` 最终必须被显式删除。
- `fresh_object_address` 可以生成唯一地址而不创建 `UID`，适用于需要唯一标识但不需要对象的场景。
- `UID` 的不可丢弃特性可以被利用来实现"删除证明"模式，为跨模块协作提供可验证的销毁凭证。


---


<!-- source: 07_using_objects/storage-functions.md -->
## 9.4 存储函数 — transfer / share / freeze

# 存储函数详解

Sui Move 通过 `sui::transfer` 模块提供了一组存储函数，用于决定对象在链上的**归属方式**——是转移给某个地址、冻结为不可变对象，还是共享给所有人。这些函数是 Sui 对象生命周期管理的核心工具，每个 Sui 开发者都必须熟练掌握。

## sui::transfer 模块概览

`sui::transfer` 模块是 Sui 框架的核心模块之一，它在每个 Sui Move 模块中被**隐式导入**，无需手动 `use`。该模块提供了六个主要的存储函数，分为内部版本和公开版本两组。

### 六个核心函数

| 内部函数 | 公开函数 | 作用 |
|---------|---------|------|
| `transfer::transfer` | `transfer::public_transfer` | 转移给指定地址 |
| `transfer::freeze_object` | `transfer::public_freeze_object` | 冻结为不可变对象 |
| `transfer::share_object` | `transfer::public_share_object` | 共享为共享对象 |

## 内部函数 vs 公开函数

这是 Sui 对象权限模型的核心区分：

### 内部函数（Internal Functions）

- 要求类型拥有 `key` 能力。
- **只能在定义该类型的模块内部调用**——这由 Sui 验证器在字节码层面强制执行。
- 适用于需要模块控制转移逻辑的场景。

### 公开函数（Public Functions）

- 要求类型同时拥有 `key` 和 `store` 能力。
- **可以在任何模块中调用**——不受定义模块的限制。
- 适用于需要自由流通的资产。

```move
module examples::storage_demo;

use std::string::String;

public struct AdminCap has key { id: UID }

public struct Gift has key, store {
    id: UID,
    message: String,
}

public struct Config has key {
    id: UID,
    message: String,
}
```

## transfer 与 public_transfer：转移给地址

`transfer` 将对象的所有权转移给指定的地址。转移后，只有该地址的持有者才能在交易中使用这个对象。

### 函数签名

```move
public fun transfer<T: key>(obj: T, recipient: address);
public fun public_transfer<T: key + store>(obj: T, recipient: address);
```

注意这两个函数都是按**值**接收对象（`obj: T`，不是引用），这意味着调用后原来的变量将不再可用——所有权被转移了。

### 使用示例

```move
fun init(ctx: &mut TxContext) {
    let admin_cap = AdminCap { id: object::new(ctx) };
    // AdminCap 只有 key，使用内部 transfer
    transfer::transfer(admin_cap, ctx.sender());
}

/// 内部转移（key only）
public fun transfer_admin(cap: AdminCap, to: address) {
    transfer::transfer(cap, to);
}

/// 公开转移（key + store）
public fun send_gift(gift: Gift, to: address) {
    transfer::public_transfer(gift, to);
}
```

### 转移的语义

调用 `transfer` 后：

1. 对象从当前上下文中移除（Move 语义，按值传递）。
2. 对象被标记为 `recipient` 地址拥有。
3. 后续只有 `recipient` 发起的交易才能使用该对象。
4. 对象成为**拥有对象（Owned Object）**。

## freeze_object 与 public_freeze_object：冻结为不可变

冻结操作将对象变为**不可变对象（Immutable Object）**。冻结后，对象永远不能被修改或删除，但任何人都可以通过不可变引用（`&T`）读取它。

### 函数签名

```move
public fun freeze_object<T: key>(obj: T);
public fun public_freeze_object<T: key + store>(obj: T);
```

### 使用示例

```move
/// 创建并冻结配置——使用内部版本
public fun create_config(
    _: &AdminCap,
    message: String,
    ctx: &mut TxContext,
) {
    let config = Config { id: object::new(ctx), message };
    transfer::freeze_object(config);
}

/// 冻结礼物——使用公开版本（Gift 有 store）
public fun freeze_gift(gift: Gift) {
    transfer::public_freeze_object(gift);
}
```

### 冻结的特性

- **不可逆**：一旦冻结，永远无法解冻。
- **全局可读**：任何交易都可以通过 `&T`（不可变引用）读取冻结对象。
- **无需所有权**：读取冻结对象不需要持有它的所有权。
- **不消耗 gas**：读取冻结对象不计入交易的对象输入限制。
- **适用场景**：全局配置、元数据、不变的合约参数。

```move
/// 任何人都可以读取冻结的 Config
public fun read_config(config: &Config): String {
    config.message
}
```

## share_object 与 public_share_object：共享给所有人

共享操作将对象变为**共享对象（Shared Object）**。共享对象没有特定的所有者，任何交易都可以通过可变引用（`&mut T`）或不可变引用（`&T`）访问它。

### 函数签名

```move
public fun share_object<T: key>(obj: T);
public fun public_share_object<T: key + store>(obj: T);
```

### 使用示例

```move
/// 创建并共享配置
public fun create_shared_config(
    message: String,
    ctx: &mut TxContext,
) {
    let config = Config { id: object::new(ctx), message };
    transfer::share_object(config);
}
```

### 共享对象的特性

- **不可逆**：一旦共享，无法取消共享或转回拥有对象。
- **全局可写**：任何交易都可以获取共享对象的可变引用进行修改。
- **共识排序**：涉及共享对象的交易需要经过共识排序，性能低于纯拥有对象交易。
- **适用场景**：全局状态（如 DEX 的流动性池）、注册表、计数器等。

```move
/// 修改共享的 Config
public fun update_shared_config(config: &mut Config, new_message: String) {
    config.message = new_message;
}
```

## 三种对象状态对比

| 特性 | 拥有对象 | 共享对象 | 不可变对象 |
|------|---------|---------|-----------|
| 所有者 | 特定地址 | 无（所有人） | 无 |
| 可修改 | 是（所有者） | 是（任何人） | 否 |
| 可删除 | 是 | 是 | 否 |
| 可转移 | 是 | 否 | 否 |
| 访问方式 | 按值/`&`/`&mut` | `&`/`&mut` | 仅 `&` |
| 共识需求 | 不需要 | 需要 | 不需要 |
| 性能 | 高 | 较低 | 高 |

## 拥有对象转冻结对象

一个常见的模式是先创建拥有对象，经过配置后再冻结它：

```move
public fun setup_and_freeze(
    message: String,
    ctx: &mut TxContext,
) {
    let mut config = Config {
        id: object::new(ctx),
        message,
    };

    // 在冻结前可以修改
    config.message = std::string::utf8(b"Final config");

    // 冻结后不可再修改
    transfer::freeze_object(config);
}
```

## 共享对象的删除

共享对象可以被删除，但需要按值传入（这要求交易指定该共享对象作为输入）：

```move
/// 删除共享的 Config
public fun delete_config(config: Config) {
    let Config { id, message: _ } = config;
    id.delete();
}
```

虽然在技术上可行，但删除共享对象需要谨慎——如果其他交易正在并发访问该共享对象，可能导致交易失败。

## Move 语义回顾

理解存储函数需要牢记 Move 的**所有权语义**：

### 按值传递（By Value）

```move
public fun consume(obj: Gift) {
    // obj 被移入函数，调用者不再拥有它
    transfer::public_transfer(obj, @0x1);
}
```

所有存储函数都按值接收对象，这保证了：
- 调用者失去对对象的所有权。
- 对象不可能被"双花"——同一个对象只能被转移一次。

### 按不可变引用（By Immutable Reference）

```move
public fun read_gift(gift: &Gift): String {
    gift.message
}
```

只能读取，不能修改或转移。

### 按可变引用（By Mutable Reference）

```move
public fun update_gift(gift: &mut Gift, new_message: String) {
    gift.message = new_message;
}
```

可以修改对象的字段，但不能转移或删除对象。

## 完整示例：多功能存储管理

```move
module examples::storage_manager;

use std::string::String;

public struct ManagerCap has key {
    id: UID,
}

public struct Document has key, store {
    id: UID,
    title: String,
    content: String,
    version: u64,
}

fun init(ctx: &mut TxContext) {
    transfer::transfer(
        ManagerCap { id: object::new(ctx) },
        ctx.sender(),
    );
}

/// 创建文档并转移给指定用户
public fun create_and_send(
    _: &ManagerCap,
    title: String,
    content: String,
    recipient: address,
    ctx: &mut TxContext,
) {
    let doc = Document {
        id: object::new(ctx),
        title,
        content,
        version: 1,
    };
    transfer::public_transfer(doc, recipient);
}

/// 创建文档并共享（所有人可编辑）
public fun create_and_share(
    title: String,
    content: String,
    ctx: &mut TxContext,
) {
    let doc = Document {
        id: object::new(ctx),
        title,
        content,
        version: 1,
    };
    transfer::public_share_object(doc);
}

/// 创建文档并冻结（只读模板）
public fun create_template(
    title: String,
    content: String,
    ctx: &mut TxContext,
) {
    let doc = Document {
        id: object::new(ctx),
        title,
        content,
        version: 1,
    };
    transfer::public_freeze_object(doc);
}

/// 编辑共享文档
public fun edit_document(
    doc: &mut Document,
    new_content: String,
) {
    doc.content = new_content;
    doc.version = doc.version + 1;
}

/// 删除文档
public fun delete_document(doc: Document) {
    let Document { id, title: _, content: _, version: _ } = doc;
    id.delete();
}
```

## 小结

- `sui::transfer` 模块提供六个核心存储函数，分为内部版本和公开版本。
- 内部版本（`transfer`/`freeze_object`/`share_object`）只能在定义类型的模块中使用，类型需要 `key`。
- 公开版本（`public_transfer`/`public_freeze_object`/`public_share_object`）可在任何模块使用，类型需要 `key + store`。
- 对象有三种链上状态：拥有（Owned）、共享（Shared）、不可变（Immutable），状态转换是单向的。
- 所有存储函数按值接收对象，遵循 Move 的所有权语义，确保对象不会被"双花"。
- 共享对象涉及共识排序，性能低于拥有对象——在设计时应尽量减少共享对象的使用。


---


<!-- source: 07_using_objects/transfer-restrictions.md -->
## 9.5 转移限制

# 转移限制

Sui Move 的对象系统内置了一套精巧的**转移权限控制**机制。通过 `key` 和 `store` 能力的组合，开发者可以精确控制谁能转移、冻结或共享一个对象。这一机制是实现灵魂绑定代币（SBT）、权限凭证和受控资产等模式的基础。

## 默认行为：转移受限

在 Sui 中，存储操作（`transfer`、`freeze_object`、`share_object`）默认是**受限的**——只有定义该类型的模块才能调用这些操作。

这意味着当你创建一个只有 `key` 的对象时，外部模块无法对它执行任何存储操作：

```move
module examples::transfer_a;

/// key only —— 转移受限，只有本模块能转移
public struct SoulboundNFT has key {
    id: UID,
    name: vector<u8>,
}

/// key + store —— 公开转移，任何人都可以转移
public struct TradableNFT has key, store {
    id: UID,
    name: vector<u8>,
}

public fun mint_soulbound(name: vector<u8>, to: address, ctx: &mut TxContext) {
    let nft = SoulboundNFT { id: object::new(ctx), name };
    transfer::transfer(nft, to);
}

public fun mint_tradable(name: vector<u8>, to: address, ctx: &mut TxContext) {
    let nft = TradableNFT { id: object::new(ctx), name };
    transfer::public_transfer(nft, to);
}
```

## Sui 验证器的强制约束

转移限制不是靠编程约定实现的——它由 **Sui 字节码验证器（Sui Verifier）** 在**发布时**强制执行。

### 验证规则

当验证器检查一个模块时，它会扫描所有对 `transfer::transfer`、`transfer::freeze_object`、`transfer::share_object` 的调用，并检查：

> **被操作的类型 `T` 是否在当前模块中定义？**

如果不是，验证器直接拒绝发布。这是字节码级别的检查，无法通过任何编程技巧绕过。

同类「类型须由当前模块定义」的约束也适用于其他 Sui 标准 API，例如 `sui::event::emit<T>`：泛型参数 `T` 必须由调用方所在模块定义，否则验证器会报错。其目的与转移限制一致：保证关键操作的类型由可信模块控制。

### 跨模块示例

```move
module examples::transfer_b;

use examples::transfer_a::{TradableNFT};

/// 合法：TradableNFT 有 `store`，可以使用 public_transfer
public fun transfer_tradable(nft: TradableNFT, to: address) {
    transfer::public_transfer(nft, to);
}
```

如果尝试对 `SoulboundNFT` 做同样的操作：

```move
module examples::transfer_c;

use examples::transfer_a::{SoulboundNFT};

/// 非法！SoulboundNFT 只有 key，不能在外部模块使用 transfer
public fun try_transfer(nft: SoulboundNFT, to: address) {
    transfer::transfer(nft, to);         // 验证器拒绝！
}

/// 也不行！SoulboundNFT 没有 store，不能使用 public_transfer
public fun try_public_transfer(nft: SoulboundNFT, to: address) {
    transfer::public_transfer(nft, to);  // 编译错误！
}
```

## public_* 函数放宽限制

`transfer` 模块的 `public_*` 系列函数通过要求 `store` 能力来放宽限制：

```move
// 内部版本：T: key —— 只能在定义 T 的模块中调用
public fun transfer<T: key>(obj: T, recipient: address);

// 公开版本：T: key + store —— 可在任何模块调用
public fun public_transfer<T: key + store>(obj: T, recipient: address);
```

`store` 能力在这里充当了一个**显式的许可标记**——模块作者通过给类型添加 `store`，明确声明"我允许外部模块操作这个类型的存储"。

## key-only vs key+store 对比

| 特性 | key only | key + store |
|------|----------|-------------|
| 是否为对象 | 是 | 是 |
| 模块内转移 | `transfer::transfer` | `transfer::transfer` 或 `public_transfer` |
| 外部模块转移 | 不可能 | `transfer::public_transfer` |
| 模块内冻结 | `transfer::freeze_object` | 两者皆可 |
| 外部模块冻结 | 不可能 | `transfer::public_freeze_object` |
| 模块内共享 | `transfer::share_object` | 两者皆可 |
| 外部模块共享 | 不可能 | `transfer::public_share_object` |
| 可包装（Wrap） | 不可以 | 可以 |
| 自定义转移逻辑 | 支持 | 难以强制执行 |
| 用例 | 权限控制、SBT | NFT、代币、可交易资产 |

## 添加 store 的影响

决定是否给对象添加 `store` 是一个**灵活性 vs 控制权**的权衡。

### 添加 store 意味着

1. **自由流通**：持有者可以自由转移对象，不受模块约束。
2. **可组合**：其他模块可以将你的对象包装（wrap）在它们的对象中。
3. **失去控制**：你无法阻止转移、不能收取转移费用、不能实施黑名单。
4. **PTB 友好**：用户可以在可编程交易块（PTB）中直接操作。

### 不添加 store 意味着

1. **模块控制**：所有转移必须通过你的模块函数，你可以添加任意业务逻辑。
2. **不可组合**：其他模块无法包装或自由操作你的对象。
3. **可实现**：收费转移、冷却期、白名单、审批流程等。
4. **PTB 受限**：用户必须调用你提供的函数来操作对象。

## 灵魂绑定代币模式

灵魂绑定代币（Soulbound Token, SBT）是"key without store"的经典应用：

```move
module examples::soulbound;

use std::string::String;

/// 灵魂绑定徽章——不可转让
public struct Badge has key {
    id: UID,
    title: String,
    description: String,
    issued_to: address,
    issued_at: u64,
}

/// 只有本模块能颁发徽章
public fun issue(
    title: String,
    description: String,
    recipient: address,
    ctx: &mut TxContext,
) {
    let badge = Badge {
        id: object::new(ctx),
        title,
        description,
        issued_to: recipient,
        issued_at: tx_context::epoch(ctx),
    };
    transfer::transfer(badge, recipient);
}

/// 持有者可以选择销毁自己的徽章
public fun burn(badge: Badge) {
    let Badge {
        id,
        title: _,
        description: _,
        issued_to: _,
        issued_at: _,
    } = badge;
    id.delete();
}
```

由于 `Badge` 只有 `key`：

- 持有者**无法转让**给其他人（`transfer::public_transfer` 不可用，`transfer::transfer` 只能在本模块调用）。
- 徽章永远绑定在最初的接收者身上。
- 只有通过模块提供的 `burn` 函数才能销毁。

## 受控转移模式

利用 key-only 限制，可以实现自定义的转移逻辑：

```move
module examples::controlled_transfer;

use std::string::String;

const EMaxTransfersReached: u64 = 0;

public struct Ticket has key {
    id: UID,
    event_name: String,
    transfer_count: u64,
    max_transfers: u64,
}

/// 铸造门票
public fun mint(
    event_name: String,
    max_transfers: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let ticket = Ticket {
        id: object::new(ctx),
        event_name,
        transfer_count: 0,
        max_transfers,
    };
    transfer::transfer(ticket, recipient);
}

/// 受控转移——带有转移次数限制
public fun controlled_transfer(
    mut ticket: Ticket,
    to: address,
) {
    assert!(
        ticket.transfer_count < ticket.max_transfers,
        EMaxTransfersReached,
    );

    ticket.transfer_count = ticket.transfer_count + 1;
    transfer::transfer(ticket, to);
}
```

在这个例子中，门票只能通过 `controlled_transfer` 函数转移，并且有最大转移次数限制。如果 `Ticket` 有 `store`，持有者就可以绕过这个限制直接用 `public_transfer` 转移。

## 自定义策略模式

通过 `key` only，开发者可以实现更复杂的策略：

```move
module examples::policy_transfer;

use std::string::String;
use sui::coin::{Self, Coin};
use sui::sui::SUI;

public struct PremiumAsset has key {
    id: UID,
    name: String,
    value: u64,
}

public struct TransferPolicy has key {
    id: UID,
    fee_bps: u64,        // 转移费率（基点）
    fee_recipient: address,
}

/// 创建转移策略（共享对象）
public fun create_policy(
    fee_bps: u64,
    fee_recipient: address,
    ctx: &mut TxContext,
) {
    let policy = TransferPolicy {
        id: object::new(ctx),
        fee_bps,
        fee_recipient,
    };
    transfer::share_object(policy);
}

/// 需要缴费的转移
public fun transfer_with_fee(
    asset: PremiumAsset,
    policy: &TransferPolicy,
    mut payment: Coin<SUI>,
    to: address,
    ctx: &mut TxContext,
) {
    let fee_amount = (asset.value * policy.fee_bps) / 10000;
    let fee = coin::split(&mut payment, fee_amount, ctx);

    transfer::public_transfer(fee, policy.fee_recipient);
    transfer::public_transfer(payment, ctx.sender());
    transfer::transfer(asset, to);
}
```

## 小结

- Sui 的存储操作默认受限于定义类型的模块，这由 Sui 字节码验证器在发布时强制执行。
- `public_*` 函数通过要求 `store` 能力来放宽限制，允许外部模块操作对象。
- `key only` 提供最大的控制权，适合权限凭证、灵魂绑定代币、受控转移等场景。
- `key + store` 提供最大的灵活性，适合 NFT、代币等需要自由流通的资产。
- 是否添加 `store` 是 Sui 对象设计中最重要的决策——它决定了谁能控制对象的生命周期。
- 利用 key-only 限制，开发者可以实现收费转移、次数限制、审批流程等自定义策略。


---


<!-- source: 07_using_objects/transfer-to-object.md -->
## 9.6 接收对象（Transfer to Object）

# 对象间转移

Sui 的 **Transfer to Object (TTO)** 机制允许将对象转移给另一个对象（而不仅仅是地址）。结合 `Receiving` 类型和 `receive` 函数，这一机制为 Sui 带来了强大的对象组合能力，实现了"对象邮箱"、账户抽象等高级模式。

## 为什么需要对象间转移

在传统的对象模型中，对象只能被转移给地址（即账户）。但在很多实际场景中，我们希望对象能够"持有"其他对象：

- **邮箱系统**：用户的邮箱对象接收信件对象。
- **库存管理**：角色对象接收装备对象。
- **账户抽象**：智能合约对象代替地址持有资产。
- **多签钱包**：钱包对象接收待批准的交易对象。

Sui 的 TTO 机制正是为此而设计的。

## 基本概念

### 转移到对象

任何对象都可以作为"接收方"，就像地址一样。每个对象都有一个唯一的 `UID`，其底层是一个 `address`——因此可以用这个地址作为 `transfer` 的目标：

```move
// 将 letter 转移给一个对象（使用对象的地址）
transfer::public_transfer(letter, object_address);
```

被转移到某个对象的子对象，不会直接成为父对象的字段——它们存在于一个逻辑上的"邮箱"中，需要通过 `receive` 操作来提取。

### Receiving 类型

`Receiving<T>` 是 `sui::transfer` 模块中定义的一个特殊类型，它代表"有一个类型为 `T` 的对象正在等待被接收"：

```move
// sui::transfer 模块中的定义（简化）
public struct Receiving<phantom T: key> has drop {
    id: ID,
    version: u64,
}
```

`Receiving<T>` 的特点：

- 拥有 `drop` 能力——如果不接收，可以安全忽略。
- 包含 `phantom T`——不实际存储 `T`，只做类型标记。
- 在交易中由 Sui 运行时自动构造——不能由用户代码创建。
- 包含对象的 `ID` 和 `version`，用于验证接收操作。

## receive 与 public_receive

与 `transfer` 类似，`receive` 也分为内部版本和公开版本：

| 函数 | 要求 | 限制 |
|------|------|------|
| `transfer::receive<T>` | `T: key` | 只能在定义 `T` 的模块中调用 |
| `transfer::public_receive<T>` | `T: key + store` | 可在任何模块中调用 |

### 函数签名

```move
public fun receive<T: key>(
    parent: &mut UID,
    to_receive: Receiving<T>,
): T;

public fun public_receive<T: key + store>(
    parent: &mut UID,
    to_receive: Receiving<T>,
): T;
```

注意 `parent` 参数是 `&mut UID`——需要父对象的 `UID` 的可变引用。这意味着只有能获取父对象可变引用的代码才能提取子对象，提供了访问控制。

## 邮箱模式：完整示例

```move
module examples::post_office;

use std::string::String;

public struct PostBox has key {
    id: UID,
    owner: address,
}

public struct Letter has key, store {
    id: UID,
    content: String,
    from: address,
}

public fun create_postbox(ctx: &mut TxContext): PostBox {
    PostBox {
        id: object::new(ctx),
        owner: ctx.sender(),
    }
}

/// 发送信件到某人的邮箱
public fun send_letter(
    postbox_id: address,
    content: String,
    ctx: &mut TxContext,
) {
    let letter = Letter {
        id: object::new(ctx),
        content,
        from: ctx.sender(),
    };
    // 将信件转移到邮箱对象的地址
    transfer::public_transfer(letter, postbox_id);
}

/// 从邮箱中接收信件
public fun receive_letter(
    postbox: &mut PostBox,
    letter: transfer::Receiving<Letter>,
): Letter {
    transfer::public_receive(&mut postbox.id, letter)
}
```

### 执行流程

1. Alice 创建一个 `PostBox` 对象。
2. Bob 调用 `send_letter`，将 `Letter` 转移到 `PostBox` 的地址。
3. `Letter` 进入 `PostBox` 的"邮箱"（不是字段，是链上的关联关系）。
4. Alice 调用 `receive_letter`，传入 `PostBox` 的可变引用和 `Receiving<Letter>`。
5. Sui 运行时验证 `Letter` 确实在 `PostBox` 的邮箱中，然后返回 `Letter`。

## 内部接收约束

对于只有 `key` 的类型，`receive` 只能在定义该类型的模块中调用：

```move
module examples::restricted_mail;

use std::string::String;

/// 只有 key——接收受限
public struct SecretDocument has key {
    id: UID,
    classified_content: String,
}

public struct SecureBox has key {
    id: UID,
}

/// 只有本模块能接收 SecretDocument
public fun receive_secret(
    box_obj: &mut SecureBox,
    doc: transfer::Receiving<SecretDocument>,
): SecretDocument {
    transfer::receive(&mut box_obj.id, doc)
}

/// 可以在接收时添加自定义逻辑
public fun receive_and_verify(
    box_obj: &mut SecureBox,
    doc: transfer::Receiving<SecretDocument>,
    ctx: &TxContext,
): SecretDocument {
    let document = transfer::receive(&mut box_obj.id, doc);
    assert!(ctx.sender() == @examples, 0);
    document
}
```

外部模块尝试接收 `SecretDocument` 会失败：

```move
// 在另一个模块中——错误！
public fun try_receive(
    box_obj: &mut examples::restricted_mail::SecureBox,
    doc: transfer::Receiving<SecretDocument>,
) {
    // transfer::receive 只能在定义 SecretDocument 的模块中调用
    let _doc = transfer::receive(&mut box_obj.id, doc); // 验证器拒绝
}
```

## 对象钱包模式

TTO 机制可以实现一个对象级别的"钱包"，用于接收和管理各种资产：

```move
module examples::object_wallet;

use std::string::String;
use sui::coin::Coin;
use sui::sui::SUI;

public struct Wallet has key {
    id: UID,
    name: String,
}

public fun create_wallet(name: String, ctx: &mut TxContext) {
    let wallet = Wallet {
        id: object::new(ctx),
        name,
    };
    transfer::transfer(wallet, ctx.sender());
}

/// 向钱包发送 SUI
public fun deposit(
    wallet_address: address,
    coin: Coin<SUI>,
) {
    transfer::public_transfer(coin, wallet_address);
}

/// 从钱包提取 SUI
public fun withdraw(
    wallet: &mut Wallet,
    coin_to_receive: transfer::Receiving<Coin<SUI>>,
    recipient: address,
) {
    let coin = transfer::public_receive(&mut wallet.id, coin_to_receive);
    transfer::public_transfer(coin, recipient);
}

/// 查询钱包地址（用于存入）
public fun wallet_address(wallet: &Wallet): address {
    object::id(wallet).to_address()
}
```

## 多层接收模式

TTO 可以嵌套使用——对象 A 收到了对象 B，对象 B 又收到了对象 C：

```move
module examples::nested_receive;

use std::string::String;

public struct Warehouse has key {
    id: UID,
    name: String,
}

public struct Crate has key, store {
    id: UID,
    label: String,
}

public struct Package has key, store {
    id: UID,
    item: String,
}

/// 将包裹发送到箱子
public fun send_to_crate(
    crate_addr: address,
    item: String,
    ctx: &mut TxContext,
) {
    let package = Package {
        id: object::new(ctx),
        item,
    };
    transfer::public_transfer(package, crate_addr);
}

/// 将箱子发送到仓库
public fun send_to_warehouse(
    warehouse_addr: address,
    label: String,
    ctx: &mut TxContext,
) {
    let crate_obj = Crate {
        id: object::new(ctx),
        label,
    };
    transfer::public_transfer(crate_obj, warehouse_addr);
}

/// 从仓库接收箱子
public fun receive_crate(
    warehouse: &mut Warehouse,
    crate_ticket: transfer::Receiving<Crate>,
): Crate {
    transfer::public_receive(&mut warehouse.id, crate_ticket)
}

/// 从箱子接收包裹
public fun receive_package(
    crate_obj: &mut Crate,
    package_ticket: transfer::Receiving<Package>,
): Package {
    transfer::public_receive(&mut crate_obj.id, package_ticket)
}
```

## TTO 的使用场景

| 场景 | 描述 |
|------|------|
| 邮箱系统 | 用户对象接收消息对象 |
| 账户抽象 | 智能合约对象代替地址管理资产 |
| 多签钱包 | 钱包对象接收待审批的提案 |
| 游戏库存 | 角色对象接收战利品和装备 |
| DAO 治理 | DAO 对象接收提案和投票 |
| 托管服务 | 托管对象接收双方存入的资产 |

## TTO 与包装（Wrapping）的区别

将对象存储在另一个对象中有两种方式，它们有本质区别：

| 特性 | 包装（Wrapping） | TTO（Receiving） |
|------|-----------------|-----------------|
| 存储方式 | 作为父对象的字段 | 在父对象的"邮箱"中 |
| 链上可见性 | 子对象变为不可见 | 子对象保持可见 |
| 添加时机 | 创建时或通过 `&mut` | 任何时候通过 `transfer` |
| 提取方式 | 解构父对象 | 通过 `receive` |
| 类型限制 | 子类型需要 `store` | 子类型需要 `key`（+ `store` 用于 `public_receive`） |
| 动态性 | 静态——编译时确定 | 动态——运行时接收 |

## 小结

- Transfer to Object (TTO) 允许将对象转移给另一个对象，而不仅仅是地址。
- `Receiving<T>` 类型代表一个等待被接收的对象，由 Sui 运行时在交易中自动构造。
- `receive` 和 `public_receive` 用于从父对象的"邮箱"中提取子对象，遵循与 `transfer` 相同的内部/公开限制。
- 接收操作需要父对象的 `&mut UID`，提供了天然的访问控制——只有能获取父对象可变引用的代码才能提取子对象。
- TTO 机制实现了对象级别的资产管理，适用于邮箱系统、账户抽象、多签钱包等高级场景。
- TTO 与包装（Wrapping）是互补的两种对象组合方式——TTO 更动态灵活，Wrapping 更静态紧凑。


---


# ==================== 进阶篇 ====================



---


<!-- source: 08_programmability/index.md -->
## 第十章 · 高级可编程性

# 第十章 · 高级可编程性

本章介绍 Sui Framework 提供的高级编程能力，包括动态字段、集合、代币操作、密码学等，让你的合约具备丰富的链上功能。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 8.1 | Sui Framework 概览 | 框架结构、核心模块 |
| 8.2 | 交易上下文 | TxContext 的方法和传递规则 |
| 8.3 | 模块初始化器 | init 函数的签名要求和执行时机 |
| 8.4 | 事件 | 事件定义、emit、链下监听 |
| 8.5 | Epoch 与时间 | 基于时间的逻辑 |
| 8.6 | 集合类型 | VecMap / VecSet 的使用 |
| 8.7 | 动态字段 | 异构存储、增删改查 |
| 8.8 | 动态对象字段 | 与动态字段的区别、链上可查询 |
| 8.9 | 派生对象（derived_object） | 确定性地址、claim/exists、注册表模式 |
| 8.10 | 动态集合 | Table / Bag / ObjectTable / ObjectBag |
| 8.11 | Balance 与 Coin | 代币的底层操作 |
| 8.12 | BCS 序列化 | 编码 / 解码、链下参数构造 |
| 8.13 | 密码学与哈希 | SHA / ED25519 / ECDSA |
| 8.14 | 链上随机数 | Random 对象、公平性保证 |

## 学习目标

读完本章后，你将能够：

- 使用动态字段与动态对象字段实现灵活的数据存储
- 使用派生对象（derived_object）实现确定性地址与注册表模式
- 操作 Balance 和 Coin 实现代币逻辑
- 在合约中使用密码学原语和链上随机数


---


<!-- source: 08_programmability/sui-framework.md -->
## 10.1 Sui Framework 概览

# Sui Framework 概览

Sui Framework 是每个 Sui Move 项目的默认依赖，它构建在 Move 标准库（Standard Library）之上，为开发者提供了丰富的链上编程原语。理解 Sui Framework 的模块结构和核心接口，是高效编写 Sui 智能合约的基础。本章将系统梳理 Sui Framework 的架构、核心模块和常用工具模块。

## 框架依赖关系

Sui Framework 本身依赖于 Move 标准库（`std`），因此当你在 `Move.toml` 中声明 Sui Framework 依赖时，标准库会自动引入，无需单独声明。

```toml
[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }
```

Sui Framework 导出了两个命名地址：

| 地址别名 | 实际地址 | 说明 |
|---------|---------|------|
| `std`   | `0x1`   | Move 标准库地址 |
| `sui`   | `0x2`   | Sui Framework 地址 |

这意味着你可以在代码中直接使用 `sui::` 和 `std::` 前缀来引用对应模块，而无需在 `Move.toml` 中手动定义这两个地址。

## 隐式导入

Sui Framework 中有三个模块会被**自动隐式导入**，你无需编写 `use` 语句即可直接使用它们的类型和函数：

- **`sui::object`** — 提供 `UID`、`ID` 等对象相关类型和 `object::new()`、`object::id()` 等函数
- **`sui::tx_context`** — 提供 `TxContext` 类型和 `ctx.sender()`、`ctx.epoch()` 等方法
- **`sui::transfer`** — 提供 `transfer::transfer()`、`transfer::share_object()` 等对象转移函数

```move
module examples::framework_usage;

// 以下模块被隐式导入，无需 `use` 语句：
// - sui::object (UID, ID)
// - sui::tx_context (TxContext)
// - sui::transfer

// 其他框架模块则需要显式导入
use sui::event;
use sui::clock::Clock;

public struct MyObject has key {
    id: UID,   // UID 来自 sui::object（隐式导入）
}

public struct MyEvent has copy, drop {
    created: bool,
}

public fun create(ctx: &mut TxContext) {
    let obj = MyObject { id: object::new(ctx) };
    event::emit(MyEvent { created: true });
    transfer::transfer(obj, ctx.sender());
}
```

上述代码中，`UID`、`object::new`、`transfer::transfer`、`ctx.sender()` 均来自隐式导入的模块，而 `event` 和 `Clock` 则需要显式声明 `use` 语句。

## 核心模块

核心模块提供了 Sui 对象模型和交易系统的基础能力，是几乎每个合约都会用到的模块。

| 模块 | 说明 |
|------|------|
| `sui::object` | 对象标识：`UID` 和 `ID` 类型，`new()`、`delete()`、`id()` 等 |
| `sui::transfer` | 对象所有权转移：`transfer`、`public_transfer`、`share_object`、`freeze_object` |
| `sui::tx_context` | 交易上下文：获取发送者地址、epoch、时间戳等 |
| `sui::address` | 地址工具：地址长度常量、与 `u256`/`vector<u8>` 之间的转换 |
| `sui::clock` | 链上时钟：提供毫秒级时间戳，共享对象位于 `0x6` |
| `sui::dynamic_field` | 动态字段：为对象附加异构键值对数据 |
| `sui::dynamic_object_field` | 动态对象字段：类似动态字段，但值必须是 Sui 对象 |
| `sui::event` | 事件系统：`emit()` 函数向链下发送通知 |
| `sui::package` | 包管理：`Publisher` 类型、包升级策略 |
| `sui::display` | 显示标准：为对象类型定义链下展示模板 |

### sui::object

`sui::object` 是 Sui 对象系统的基石。每个 Sui 对象都必须包含一个 `UID` 类型的 `id` 字段，`UID` 在内部封装了全局唯一的 `ID`。

```move
module examples::object_demo;

public struct Artifact has key {
    id: UID,
    power: u64,
}

public fun create_artifact(power: u64, ctx: &mut TxContext): Artifact {
    Artifact {
        id: object::new(ctx),
        power,
    }
}

public fun artifact_id(artifact: &Artifact): ID {
    object::id(artifact)
}

public fun destroy_artifact(artifact: Artifact) {
    let Artifact { id, power: _ } = artifact;
    id.delete();
}
```

### sui::transfer

`sui::transfer` 控制对象的所有权和访问方式。它提供了四种核心操作：

- `transfer::transfer(obj, recipient)` — 将对象转移给指定地址（需要在定义模块中调用）
- `transfer::public_transfer(obj, recipient)` — 公开转移（对象需要 `store` 能力）
- `transfer::share_object(obj)` — 将对象设为共享，所有人可访问
- `transfer::freeze_object(obj)` — 冻结对象，变为不可变

```move
module examples::transfer_demo;

public struct Gift has key, store {
    id: UID,
    message: vector<u8>,
}

public fun send_gift(message: vector<u8>, recipient: address, ctx: &mut TxContext) {
    let gift = Gift { id: object::new(ctx), message };
    // 因为 Gift 有 store，可以使用 public_transfer
    transfer::public_transfer(gift, recipient);
}

public struct SharedBoard has key {
    id: UID,
    posts: vector<vector<u8>>,
}

public fun create_shared_board(ctx: &mut TxContext) {
    let board = SharedBoard {
        id: object::new(ctx),
        posts: vector::empty(),
    };
    transfer::share_object(board);
}
```

## 集合模块

Sui Framework 提供了多种集合类型，适用于不同的数据存储需求。

| 模块 | 类型 | 存储方式 | 适用场景 |
|------|------|---------|---------|
| `sui::vec_set` | `VecSet<K>` | 对象内部 | 小规模去重集合 |
| `sui::vec_map` | `VecMap<K, V>` | 对象内部 | 小规模键值映射 |
| `sui::table` | `Table<K, V>` | 动态字段 | 大规模同构键值存储 |
| `sui::bag` | `Bag` | 动态字段 | 异构键值存储 |
| `sui::object_table` | `ObjectTable<K, V>` | 动态对象字段 | 存储值为对象的表 |
| `sui::object_bag` | `ObjectBag` | 动态对象字段 | 存储值为对象的异构包 |
| `sui::linked_table` | `LinkedTable<K, V>` | 动态字段 | 支持顺序遍历的表 |

`VecSet` 和 `VecMap` 基于 `vector` 实现，数据存储在对象内部，适合小数据集（通常几十到几百个元素）。`Table`、`Bag` 等基于动态字段实现，每个条目独立存储，适合大规模数据且不受单个对象大小限制。

```move
module examples::collection_overview;

use sui::table::{Self, Table};
use sui::vec_map::{Self, VecMap};

public struct UserRegistry has key {
    id: UID,
    // Table: 适合大量用户数据，每条记录独立存储
    profiles: Table<address, vector<u8>>,
    // VecMap: 适合少量配置项，存储在对象内部
    settings: VecMap<vector<u8>, vector<u8>>,
}

public fun create_registry(ctx: &mut TxContext) {
    let registry = UserRegistry {
        id: object::new(ctx),
        profiles: table::new(ctx),
        settings: vec_map::empty(),
    };
    transfer::share_object(registry);
}

public fun register(registry: &mut UserRegistry, profile: vector<u8>, ctx: &TxContext) {
    table::add(&mut registry.profiles, ctx.sender(), profile);
}
```

## 工具模块

Sui Framework 还提供了若干通用工具模块，覆盖序列化、类型检查、十六进制编码等常见需求。

| 模块 | 说明 |
|------|------|
| `sui::bcs` | BCS（Binary Canonical Serialization）编解码 |
| `sui::borrow` | 安全借用：保证取出的对象必须归还 |
| `sui::hex` | 十六进制字符串编解码 |
| `sui::types` | 类型工具：`is_one_time_witness()` 判断 OTW |

### sui::bcs

BCS 是 Move 生态的标准序列化格式。`sui::bcs` 模块允许你在合约内对数据进行序列化和反序列化，这在跨模块通信、链下数据验证等场景中非常有用。

```move
module examples::bcs_demo;

use sui::bcs;

public struct Config has copy, drop {
    version: u64,
    active: bool,
}

public fun serialize_config(config: &Config): vector<u8> {
    bcs::to_bytes(config)
}

public fun deserialize_u64(data: vector<u8>): u64 {
    let mut bcs_data = bcs::new(data);
    bcs::peel_u64(&mut bcs_data)
}
```

### sui::types

`sui::types` 模块最常用的功能是 `is_one_time_witness<T>()`，用于在 `init` 函数中验证传入的类型是否为合法的一次性见证（OTW）。

```move
module examples::types_demo;

use sui::types;
use sui::package;

public struct TYPES_DEMO has drop {}

fun init(otw: TYPES_DEMO, ctx: &mut TxContext) {
    // 验证 OTW 合法性
    assert!(types::is_one_time_witness(&otw), 0);

    let publisher = package::claim(otw, ctx);
    transfer::public_transfer(publisher, ctx.sender());
}
```

## 使用建议

1. **优先使用隐式导入的模块**：`object`、`transfer`、`tx_context` 不需要 `use` 语句，保持代码简洁。
2. **选择合适的集合类型**：小数据集用 `VecSet`/`VecMap`，大数据集用 `Table`/`Bag`。
3. **理解地址常量**：`@sui`（`0x2`）和 `@std`（`0x1`）是框架预定义的。
4. **查阅源码**：Sui Framework 完全开源，遇到不确定的 API，直接阅读源码是最可靠的方式。

## 小结

Sui Framework 是 Sui Move 开发的核心基础设施，它在 Move 标准库之上构建了完整的链上编程能力。框架分为三大类模块：**核心模块**（对象、转移、上下文、事件等）负责对象生命周期管理；**集合模块**（Table、Bag、VecMap 等）提供多种数据结构选择；**工具模块**（BCS、hex、types 等）覆盖序列化和类型检查等通用需求。其中 `sui::object`、`sui::transfer` 和 `sui::tx_context` 三个模块会被隐式导入，是最基础也是最常用的模块。掌握 Sui Framework 的模块体系，能让你在编写合约时快速找到合适的工具，提升开发效率。


---


<!-- source: 08_programmability/transaction-context.md -->
## 10.2 交易上下文（TxContext）

# 交易上下文 TxContext

TxContext（交易上下文）是 Sui Move 中每笔交易的运行时环境信息载体。它由 Sui 虚拟机在交易执行前自动创建，包含发送者地址、交易哈希、epoch 信息等关键数据。几乎所有需要创建对象或读取交易信息的函数都需要接收 TxContext 参数。

## TxContext 结构

TxContext 是一个定义在 `sui::tx_context` 模块中的结构体，其内部字段如下：

| 字段 | 类型 | 说明 |
|------|------|------|
| `sender` | `address` | 交易发送者的地址 |
| `tx_hash` | `vector<u8>` | 当前交易的哈希值 |
| `epoch` | `u64` | 当前 epoch 编号 |
| `epoch_timestamp_ms` | `u64` | 当前 epoch 开始时的时间戳（毫秒） |
| `ids_created` | `u64` | 本次交易中已创建的对象 ID 数量 |

> **重要**：TxContext **不能被手动构造**。它由 Sui 虚拟机在交易执行时自动创建并注入到入口函数中。开发者只能通过函数参数接收它，不能使用结构体字面量来创建。

## 函数签名规则

TxContext 在函数签名中有严格的位置要求——它**必须是最后一个参数**。

```move
module examples::ctx_rules;

// 正确：TxContext 是最后一个参数
public fun correct_usage(value: u64, ctx: &mut TxContext) {
    let _ = value;
    let _ = ctx;
}

// 以下写法会导致编译错误：
// public fun wrong_usage(ctx: &mut TxContext, value: u64) { ... }
```

TxContext 可以作为不可变引用（`&TxContext`）或可变引用（`&mut TxContext`）传入。选择哪种取决于你是否需要修改它的状态（主要是 `ids_created` 计数器）。

## 读取交易信息

TxContext 提供了多个方法来读取当前交易的上下文信息。这些方法只需要不可变引用 `&TxContext`。

### sender()

返回当前交易的发送者地址。这是最常用的方法之一，用于权限检查、记录操作者等场景。

```move
module examples::tx_context_demo;

public struct Receipt has key {
    id: UID,
    buyer: address,
    epoch: u64,
    timestamp_ms: u64,
}

/// 演示从 TxContext 读取信息
public fun create_receipt(ctx: &mut TxContext): Receipt {
    Receipt {
        id: object::new(ctx),
        buyer: ctx.sender(),
        epoch: ctx.epoch(),
        timestamp_ms: ctx.epoch_timestamp_ms(),
    }
}

/// 生成唯一的订单 ID
public fun generate_order_id(ctx: &mut TxContext): address {
    tx_context::fresh_object_address(ctx)
}
```

### epoch() 和 epoch_timestamp_ms()

- `ctx.epoch()` — 返回当前 epoch 编号，`u64` 类型
- `ctx.epoch_timestamp_ms()` — 返回当前 epoch 开始时的 Unix 时间戳（毫秒），`u64` 类型

注意 `epoch_timestamp_ms` 返回的是 **epoch 开始时的时间戳**，而非交易执行时的精确时间。如果需要更高精度的时间，应使用 `sui::clock::Clock`（参见 [Epoch 与时间](./epoch-and-time.md) 一章）。

```move
module examples::epoch_check;

public struct EpochRecord has key {
    id: UID,
    recorded_epoch: u64,
    recorded_timestamp: u64,
}

public fun record_epoch(ctx: &mut TxContext) {
    let record = EpochRecord {
        id: object::new(ctx),
        recorded_epoch: ctx.epoch(),
        recorded_timestamp: ctx.epoch_timestamp_ms(),
    };
    transfer::transfer(record, ctx.sender());
}

/// 限制只能在特定 epoch 之后调用
public fun only_after_epoch(required_epoch: u64, ctx: &TxContext) {
    assert!(ctx.epoch() >= required_epoch, 0);
}
```

## 可变引用与对象创建

当你需要创建新的对象时，TxContext 必须以 `&mut TxContext` 的形式传入。这是因为 `object::new(ctx)` 会递增 `ids_created` 计数器，以此生成全局唯一的对象 ID。

### 工作原理

每次调用 `object::new(ctx)` 时：
1. 使用 `tx_hash` 和当前 `ids_created` 值计算出一个唯一地址
2. 将 `ids_created` 加 1
3. 返回一个新的 `UID`

这种机制确保了在同一笔交易中创建的多个对象拥有不同的 ID。

```move
module examples::multi_create;

public struct Token has key {
    id: UID,
    index: u64,
}

/// 在一笔交易中创建多个对象，每个都有唯一的 ID
public fun batch_create(count: u64, recipient: address, ctx: &mut TxContext) {
    let mut i = 0;
    while (i < count) {
        let token = Token {
            id: object::new(ctx),  // 每次调用都递增 ids_created
            index: i,
        };
        transfer::transfer(token, recipient);
        i = i + 1;
    };
}
```

### 何时使用 &TxContext vs &mut TxContext

| 引用类型 | 适用场景 |
|---------|---------|
| `&TxContext` | 只读取交易信息（sender、epoch 等） |
| `&mut TxContext` | 需要创建对象（调用 `object::new`）或生成唯一地址 |

一般建议：如果不确定是否需要可变引用，**优先使用 `&mut TxContext`**，因为它向后兼容——当函数内部后续需要创建对象时，不需要修改函数签名。

## fresh_object_address()

`tx_context::fresh_object_address()` 使用与 `object::new()` 相同的算法生成一个唯一地址，但不会创建 `UID`。它适用于需要唯一标识符但不需要完整对象的场景。

```move
module examples::unique_id;

use std::string::String;

public struct Order has key {
    id: UID,
    order_ref: address,  // 唯一的订单引用号
    item: String,
    quantity: u64,
}

public fun place_order(
    item: String,
    quantity: u64,
    ctx: &mut TxContext,
) {
    let order = Order {
        id: object::new(ctx),
        order_ref: tx_context::fresh_object_address(ctx),
        item,
        quantity,
    };
    transfer::transfer(order, ctx.sender());
}
```

## 实际应用模式

### 权限控制

利用 `ctx.sender()` 实现简单的所有者权限验证：

```move
module examples::owner_check;

public struct Vault has key {
    id: UID,
    owner: address,
    balance: u64,
}

public fun create_vault(ctx: &mut TxContext) {
    let vault = Vault {
        id: object::new(ctx),
        owner: ctx.sender(),
        balance: 0,
    };
    transfer::share_object(vault);
}

public fun deposit(vault: &mut Vault, amount: u64) {
    vault.balance = vault.balance + amount;
}

/// 只有 owner 可以提取
public fun withdraw(vault: &mut Vault, amount: u64, ctx: &TxContext): u64 {
    assert!(vault.owner == ctx.sender(), 0);
    assert!(vault.balance >= amount, 1);
    vault.balance = vault.balance - amount;
    amount
}
```

### 基于 Epoch 的逻辑

利用 epoch 实现基于时间周期的业务逻辑：

```move
module examples::epoch_staking;

public struct Stake has key {
    id: UID,
    staker: address,
    amount: u64,
    start_epoch: u64,
    lock_epochs: u64,
}

public fun stake(amount: u64, lock_epochs: u64, ctx: &mut TxContext) {
    let s = Stake {
        id: object::new(ctx),
        staker: ctx.sender(),
        amount,
        start_epoch: ctx.epoch(),
        lock_epochs,
    };
    transfer::transfer(s, ctx.sender());
}

public fun unstake(stake: Stake, ctx: &TxContext): u64 {
    let Stake { id, staker: _, amount, start_epoch, lock_epochs } = stake;
    assert!(ctx.epoch() >= start_epoch + lock_epochs, 0);
    id.delete();
    amount
}
```

## 小结

TxContext 是 Sui Move 交易执行的核心上下文对象，由虚拟机自动创建，不可手动构造。它提供了 `sender()`、`epoch()`、`epoch_timestamp_ms()` 等方法来读取当前交易的运行时信息。当需要创建新对象时，必须以 `&mut TxContext` 形式传入，因为 `object::new()` 会修改其内部的 `ids_created` 计数器。TxContext 必须作为函数的**最后一个参数**。`fresh_object_address()` 可以在不创建完整 UID 的情况下生成唯一地址。在实际开发中，TxContext 最常用于获取发送者地址进行权限控制，以及创建新的 Sui 对象。


---


<!-- source: 08_programmability/module-initializer.md -->
## 10.3 模块初始化器（init）

# 模块初始化器 init

`init` 函数是 Sui Move 中特殊的模块初始化器，它在模块发布（publish）时被自动调用且仅调用一次。`init` 函数是设置模块初始状态、创建管理员权限对象、初始化共享资源的标准方式。理解 `init` 函数的规则和限制，对于正确设计合约的启动流程至关重要。

## 基本规则

`init` 函数有一组严格的约束条件：

| 规则 | 说明 |
|------|------|
| 函数名 | 必须命名为 `init`，不能是其他名称 |
| 可见性 | 必须是 **`private`**（不加任何可见性修饰符） |
| 返回值 | **不能有返回值** |
| 参数 | 接受 1 或 2 个参数（见下文） |
| 调用时机 | 模块**发布时**自动调用，**仅调用一次** |
| 升级时 | 包升级时**不会**再次调用 |

### 参数形式

`init` 函数支持两种参数签名：

1. **仅 TxContext**：`fun init(ctx: &mut TxContext)`
2. **OTW + TxContext**：`fun init(otw: MY_TYPE, ctx: &mut TxContext)`

TxContext 始终是最后一个参数，可以是 `&mut TxContext` 或 `&TxContext`（推荐使用 `&mut`，因为大多数情况下需要创建对象）。

## 基本用法

最常见的 `init` 用法是创建管理员权限能力对象（AdminCap）并建立模块的初始状态。

```move
module examples::shop;

use std::string::String;

public struct ShopOwnerCap has key {
    id: UID,
}

public struct Shop has key {
    id: UID,
    name: String,
    item_count: u64,
}

/// 模块发布时调用一次
fun init(ctx: &mut TxContext) {
    // 创建管理员权限对象
    let owner_cap = ShopOwnerCap { id: object::new(ctx) };
    transfer::transfer(owner_cap, ctx.sender());

    // 创建并共享商店对象
    let shop = Shop {
        id: object::new(ctx),
        name: std::string::utf8(b"My Shop"),
        item_count: 0,
    };
    transfer::share_object(shop);
}

/// 只有持有 ShopOwnerCap 的人才能添加商品
public fun add_item(_: &ShopOwnerCap, shop: &mut Shop) {
    shop.item_count = shop.item_count + 1;
}
```

在上面的例子中，`init` 做了两件事：

1. 创建了一个 `ShopOwnerCap` 对象并转移给模块发布者——这赋予了发布者管理商店的权限
2. 创建了一个 `Shop` 共享对象——这是所有用户都可以交互的公共资源

## 一次性见证 OTW 变体

当 `init` 函数的第一个参数是**一次性见证（One-Time Witness，OTW）**类型时，Sui 虚拟机会自动创建该类型的实例并传入。OTW 提供了**密码学级别的保证**，证明该代码只在模块发布时执行了一次。

### OTW 类型规则

OTW 类型必须满足以下条件：

- 以模块名命名，全部大写（如模块名为 `shop`，则 OTW 类型为 `SHOP`）
- 只有 `drop` 能力（`has drop`）
- 没有任何字段
- 不是泛型类型

```move
module examples::shop_otw;

/// OTW：以模块名大写命名，只有 drop 能力，没有字段
public struct SHOP_OTW has drop {}

fun init(otw: SHOP_OTW, ctx: &mut TxContext) {
    // otw 证明这是模块发布时的首次且唯一的调用
    // 常用于创建 Publisher、定义 Coin 类型等
    let _ = otw;
    let _ = ctx;
}
```

### OTW 的典型应用

OTW 最常见的用途是配合 `sui::package::claim()` 创建 `Publisher` 对象，或配合 **`sui::coin_registry::new_currency_with_otw` + `finalize`** 创建自定义代币（`coin::create_currency` 已废弃）：

```move
module examples::my_token;

use std::string;
use sui::coin_registry;

public struct MY_TOKEN has drop {}

fun init(otw: MY_TOKEN, ctx: &mut TxContext) {
    let (initializer, treasury_cap) = coin_registry::new_currency_with_otw<MY_TOKEN>(
        otw,                                    // OTW 证明唯一性
        9,                                      // 精度
        string::utf8(b"MYT"),                   // 符号
        string::utf8(b"My Token"),              // 名称
        string::utf8(b"A demo token"),          // 描述
        string::utf8(b"https://example.com/icon.png"), // 图标 URL
        ctx,
    );
    let metadata_cap = coin_registry::finalize(initializer, ctx);
    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(metadata_cap, ctx.sender());
}
```

## 初始化模式

### 模式一：能力对象（Capability Pattern）

这是最常见的 `init` 模式——创建一个权限对象来控制后续操作的访问。

```move
module examples::admin_cap;

public struct AdminCap has key, store {
    id: UID,
}

public struct Config has key {
    id: UID,
    paused: bool,
    fee_bps: u64,
}

fun init(ctx: &mut TxContext) {
    transfer::transfer(
        AdminCap { id: object::new(ctx) },
        ctx.sender(),
    );

    transfer::share_object(Config {
        id: object::new(ctx),
        paused: false,
        fee_bps: 100,  // 1%
    });
}

public fun set_fee(_: &AdminCap, config: &mut Config, new_fee: u64) {
    config.fee_bps = new_fee;
}

public fun pause(_: &AdminCap, config: &mut Config) {
    config.paused = true;
}

public fun unpause(_: &AdminCap, config: &mut Config) {
    config.paused = false;
}
```

### 模式二：共享状态初始化

初始化全局共享状态，供所有用户使用：

```move
module examples::registry;

use sui::table::{Self, Table};

public struct Registry has key {
    id: UID,
    entries: Table<address, vector<u8>>,
    total_count: u64,
}

const EAlreadyRegistered: u64 = 0;

fun init(ctx: &mut TxContext) {
    let registry = Registry {
        id: object::new(ctx),
        entries: table::new(ctx),
        total_count: 0,
    };
    transfer::share_object(registry);
}

public fun register(registry: &mut Registry, data: vector<u8>, ctx: &TxContext) {
    let sender = ctx.sender();
    assert!(!table::contains(&registry.entries, sender), EAlreadyRegistered);
    table::add(&mut registry.entries, sender, data);
    registry.total_count = registry.total_count + 1;
}
```

### 模式三：Publisher + Display

结合 OTW 创建 `Publisher` 和 `Display` 对象，为 NFT 或其他对象类型设置链下展示属性：

```move
module examples::nft_init;

use std::string::utf8;
use sui::package;
use sui::display;

public struct NFT_INIT has drop {}

public struct GameNFT has key, store {
    id: UID,
    name: vector<u8>,
    image_url: vector<u8>,
    level: u64,
}

fun init(otw: NFT_INIT, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    let keys = vector[
        utf8(b"name"),
        utf8(b"image_url"),
        utf8(b"description"),
        utf8(b"project_url"),
    ];
    let values = vector[
        utf8(b"{name}"),
        utf8(b"{image_url}"),
        utf8(b"Game NFT Level {level}"),
        utf8(b"https://example-game.com"),
    ];

    let mut disp = display::new_with_fields<GameNFT>(
        &publisher, keys, values, ctx,
    );
    display::update_version(&mut disp);

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(disp, ctx.sender());
}
```

## 安全注意事项

### init 不是万能的安全保障

虽然 `init` 只执行一次，但仅依靠 `init` 函数本身并不能提供强安全保证。如果你需要证明某段逻辑确实只在模块发布时执行过一次，应该使用**一次性见证（OTW）**机制。

```move
module examples::secure_init;

use sui::types;

public struct SECURE_INIT has drop {}

public struct InitProof has key {
    id: UID,
}

fun init(otw: SECURE_INIT, ctx: &mut TxContext) {
    // 显式验证 OTW 合法性
    assert!(types::is_one_time_witness(&otw), 0);

    transfer::transfer(
        InitProof { id: object::new(ctx) },
        ctx.sender(),
    );
}
```

### 升级时不会重新调用

当你升级一个已发布的包时，`init` 函数**不会再次执行**。如果升级后需要执行初始化逻辑，你需要通过其他方式实现（例如提供一个需要 AdminCap 权限的初始化函数）。

```move
module examples::upgradeable;

public struct AdminCap has key {
    id: UID,
}

public struct State has key {
    id: UID,
    version: u64,
}

fun init(ctx: &mut TxContext) {
    transfer::transfer(AdminCap { id: object::new(ctx) }, ctx.sender());
    transfer::share_object(State {
        id: object::new(ctx),
        version: 1,
    });
}

/// 升级后手动调用的迁移函数
public fun migrate(_: &AdminCap, state: &mut State) {
    state.version = 2;
}
```

## 测试 init 函数

在单元测试中，`init` 函数不会自动调用。你需要手动调用它来测试初始化逻辑：

```move
#[test_only]
module examples::shop_tests;

use examples::shop;

#[test]
fun init_runs() {
    let mut ctx = tx_context::dummy();
    // 在测试中手动调用 init
    shop::init_for_testing(&mut ctx);
}
```

为了支持测试，通常需要在模块中添加一个测试辅助函数：

```move
#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}
```

## 小结

`init` 函数是 Sui Move 的模块初始化器，在模块发布时自动调用且仅调用一次。它必须命名为 `init`、保持私有、没有返回值，参数为可选的 OTW 加上 TxContext。最常见的用途包括创建管理员权限对象（AdminCap 模式）、初始化共享状态、以及配合 OTW 创建 Publisher 和代币类型。需要注意的是，包升级时 `init` 不会重新执行，因此对于可升级合约需要设计额外的迁移机制。安全敏感的初始化操作应结合 OTW 机制来提供更强的保证。


---


<!-- source: 08_programmability/events.md -->
## 10.4 事件（Events）

# 事件系统

事件（Events）是 Sui Move 中合约与链下世界通信的桥梁。通过事件，智能合约可以向链下应用程序、索引器和用户界面发送通知，告知链上发生了什么。事件不会存储在链上状态中，但会被 Sui 全节点记录并提供查询接口，是构建响应式 DApp 的重要基础。

## 事件基础

### 核心概念

事件系统由 `sui::event` 模块提供，其核心是一个简单的函数：

```move
public native fun emit<T: copy + drop>(event: T);
```

当合约调用 `event::emit()` 时，Sui 运行时会捕获该事件数据，并将其附加到交易的执行结果中。链下应用可以通过 Sui JSON-RPC API 订阅和查询这些事件。

### 事件类型要求

用作事件的结构体必须满足以下条件：

| 要求 | 说明 |
|------|------|
| `copy` 能力 | 事件值需要被复制 |
| `drop` 能力 | 事件值在 emit 后被丢弃 |
| 模块内部定义 | 事件类型必须在调用 `emit` 的模块内定义 |

注意：事件类型**不能**使用从其他模块导入的类型作为事件 emit。你只能 emit 当前模块中定义的结构体。

### 事件的元数据

每个 emit 的事件会自动附带以下元数据信息（由 Sui 运行时添加，无需开发者处理）：

- **发送者地址**：触发事件的交易发送者
- **包 ID**：发出事件的包地址
- **模块名**：发出事件的模块
- **事件类型**：事件结构体的完全限定类型名
- **时间戳**：交易执行的时间

## 定义和发出事件

### 基本用法

```move
module examples::marketplace_events;

use std::string::String;

/// 商品上架事件
public struct ItemListed has copy, drop {
    item_id: ID,
    price: u64,
    seller: address,
}

/// 商品售出事件
public struct ItemSold has copy, drop {
    item_id: ID,
    price: u64,
    seller: address,
    buyer: address,
}

/// 取消上架事件
public struct ListingCancelled has copy, drop {
    item_id: ID,
    seller: address,
}

public struct Item has key, store {
    id: UID,
    name: String,
}

public fun list_item(item: &Item, price: u64, ctx: &TxContext) {
    sui::event::emit(ItemListed {
        item_id: object::id(item),
        price,
        seller: ctx.sender(),
    });
}

public fun buy_item(
    item: &Item,
    price: u64,
    seller: address,
    ctx: &TxContext,
) {
    sui::event::emit(ItemSold {
        item_id: object::id(item),
        price,
        seller,
        buyer: ctx.sender(),
    });
}

public fun cancel_listing(item: &Item, ctx: &TxContext) {
    sui::event::emit(ListingCancelled {
        item_id: object::id(item),
        seller: ctx.sender(),
    });
}
```

### 导入方式

你可以选择完整路径或导入 `emit` 函数：

```move
module examples::event_import;

// 方式一：使用完整路径
// sui::event::emit(MyEvent { ... });

// 方式二：导入模块
use sui::event;

public struct Transfer has copy, drop {
    from: address,
    to: address,
    amount: u64,
}

public fun do_transfer(from: address, to: address, amount: u64) {
    // 使用模块前缀
    event::emit(Transfer { from, to, amount });
}
```

## 事件设计最佳实践

### 命名规范

事件类型名称应该使用**过去分词**或**动作名词**，清晰表达发生了什么：

```move
module examples::event_naming;

// 好的命名——清晰表达了发生的动作
public struct TokenMinted has copy, drop {
    token_id: ID,
    recipient: address,
    amount: u64,
}

public struct PoolCreated has copy, drop {
    pool_id: ID,
    creator: address,
    initial_liquidity: u64,
}

public struct VoteSubmitted has copy, drop {
    proposal_id: ID,
    voter: address,
    vote: bool,
}
```

### 包含足够的信息

事件应该包含链下应用需要的所有关键信息，避免链下应用还需要额外查询链上状态：

```move
module examples::rich_events;

use std::string::String;

public struct NFTMinted has copy, drop {
    nft_id: ID,
    collection_id: ID,
    name: String,
    creator: address,
    serial_number: u64,
    total_supply: u64,
    timestamp_ms: u64,
}

public struct AuctionCompleted has copy, drop {
    auction_id: ID,
    item_id: ID,
    winner: address,
    winning_bid: u64,
    total_bids: u64,
    duration_epochs: u64,
}
```

### 为不同操作定义不同事件

不要试图用一个通用事件覆盖所有场景，而是为每种操作定义专门的事件类型。这让链下消费者可以精确订阅感兴趣的事件。

```move
module examples::defi_events;

public struct LiquidityAdded has copy, drop {
    pool_id: ID,
    provider: address,
    amount_a: u64,
    amount_b: u64,
    lp_tokens_minted: u64,
}

public struct LiquidityRemoved has copy, drop {
    pool_id: ID,
    provider: address,
    amount_a: u64,
    amount_b: u64,
    lp_tokens_burned: u64,
}

public struct SwapExecuted has copy, drop {
    pool_id: ID,
    trader: address,
    amount_in: u64,
    amount_out: u64,
    fee: u64,
}
```

## 完整示例：带事件的投票系统

```move
module examples::voting;

use std::string::String;
use sui::event;

// ========== 事件定义 ==========

public struct ProposalCreated has copy, drop {
    proposal_id: ID,
    title: String,
    creator: address,
    end_epoch: u64,
}

public struct VoteCast has copy, drop {
    proposal_id: ID,
    voter: address,
    in_favor: bool,
}

public struct ProposalFinalized has copy, drop {
    proposal_id: ID,
    approved: bool,
    yes_votes: u64,
    no_votes: u64,
}

// ========== 常量 ==========

const EAlreadyFinalized: u64 = 0;
const EVotingEnded: u64 = 1;

// ========== 数据结构 ==========

public struct Proposal has key {
    id: UID,
    title: String,
    creator: address,
    yes_votes: u64,
    no_votes: u64,
    end_epoch: u64,
    finalized: bool,
}

public struct VoterCap has key {
    id: UID,
}

// ========== 函数 ==========

public fun create_proposal(
    title: String,
    duration_epochs: u64,
    ctx: &mut TxContext,
) {
    let proposal = Proposal {
        id: object::new(ctx),
        title,
        creator: ctx.sender(),
        yes_votes: 0,
        no_votes: 0,
        end_epoch: ctx.epoch() + duration_epochs,
        finalized: false,
    };

    event::emit(ProposalCreated {
        proposal_id: object::id(&proposal),
        title: proposal.title,
        creator: proposal.creator,
        end_epoch: proposal.end_epoch,
    });

    transfer::share_object(proposal);
}

public fun vote(proposal: &mut Proposal, in_favor: bool, ctx: &TxContext) {
    assert!(!proposal.finalized, EAlreadyFinalized);
    assert!(ctx.epoch() <= proposal.end_epoch, EVotingEnded);

    if (in_favor) {
        proposal.yes_votes = proposal.yes_votes + 1;
    } else {
        proposal.no_votes = proposal.no_votes + 1;
    };

    event::emit(VoteCast {
        proposal_id: object::id(proposal),
        voter: ctx.sender(),
        in_favor,
    });
}

public fun finalize(proposal: &mut Proposal, ctx: &TxContext) {
    assert!(!proposal.finalized, EAlreadyFinalized);
    assert!(ctx.epoch() > proposal.end_epoch, EVotingEnded);

    proposal.finalized = true;
    let approved = proposal.yes_votes > proposal.no_votes;

    event::emit(ProposalFinalized {
        proposal_id: object::id(proposal),
        approved,
        yes_votes: proposal.yes_votes,
        no_votes: proposal.no_votes,
    });
}
```

## 链下事件订阅

虽然链下订阅的代码不是 Move 合约的一部分，但了解消费端如何工作有助于你设计更好的事件。Sui 提供了以下方式来获取事件：

1. **JSON-RPC API**：使用 `suix_queryEvents` 方法按事件类型、发送者、交易哈希等条件查询历史事件
2. **WebSocket 订阅**：使用 `suix_subscribeEvent` 方法实时订阅新事件
3. **索引器**：通过第三方索引服务（如 Sui Indexer）聚合和查询事件

查询事件的典型 RPC 调用示例（JSON-RPC）：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "suix_queryEvents",
    "params": [
        {
            "MoveEventType": "0xPACKAGE_ID::marketplace_events::ItemSold"
        },
        null,
        10,
        false
    ]
}
```

## 小结

事件是 Sui Move 合约与链下世界沟通的标准机制。事件类型必须具有 `copy` 和 `drop` 能力，且只能在定义它的模块中通过 `sui::event::emit()` 发出。事件数据不存储在链上状态中，但由全节点记录，可通过 JSON-RPC API 查询和订阅。设计事件时应遵循以下原则：为每种操作定义专门的事件类型、包含足够的上下文信息、使用清晰的命名。良好的事件设计能极大简化链下应用的开发，是构建完整 DApp 体验不可或缺的一环。


---


<!-- source: 08_programmability/epoch-and-time.md -->
## 10.5 Epoch 与时间

# Epoch 与时间

在区块链智能合约中，时间是一个重要但复杂的概念。Sui 提供了两种获取时间信息的方式：基于 **Epoch** 的粗粒度时间和基于 **Clock** 对象的毫秒级精确时间。理解两者的区别和适用场景，是实现时间相关业务逻辑（如锁仓、拍卖、限时活动）的关键。

## Epoch 概述

### 什么是 Epoch

Epoch 是 Sui 网络的运行周期单位。每个 epoch 大约持续 **24 小时**（具体时长由网络治理决定）。在每个 epoch 结束时，网络会进行验证者集合更新、质押奖励分配等操作。

每个 epoch 有一个递增的编号（从 0 开始），以及一个起始时间戳。

### 从 TxContext 获取 Epoch 信息

TxContext 提供了两个与 epoch 相关的方法：

| 方法 | 返回类型 | 说明 |
|------|---------|------|
| `ctx.epoch()` | `u64` | 当前 epoch 编号 |
| `ctx.epoch_timestamp_ms()` | `u64` | 当前 epoch 的开始时间戳（毫秒） |

```move
module examples::epoch_demo;

public struct EpochInfo has key {
    id: UID,
    epoch_number: u64,
    epoch_start_ms: u64,
    recorded_by: address,
}

public fun record_current_epoch(ctx: &mut TxContext) {
    let info = EpochInfo {
        id: object::new(ctx),
        epoch_number: ctx.epoch(),
        epoch_start_ms: ctx.epoch_timestamp_ms(),
        recorded_by: ctx.sender(),
    };
    transfer::transfer(info, ctx.sender());
}
```

### Epoch 的特点

- **粗粒度**：一个 epoch 约 24 小时，无法精确到秒或毫秒
- **稳定性**：在同一个 epoch 内，`ctx.epoch()` 和 `ctx.epoch_timestamp_ms()` 返回固定值
- **低开销**：从 TxContext 读取，不需要额外的共享对象输入
- **适用场景**：锁仓周期、质押奖励计算、功能开关等对时间精度要求不高的场景

### 基于 Epoch 的锁仓示例

```move
module examples::epoch_lock;

public struct EpochVault has key {
    id: UID,
    owner: address,
    amount: u64,
    lock_until_epoch: u64,
}

/// 创建一个按 epoch 锁定的金库
public fun create_vault(
    amount: u64,
    lock_epochs: u64,
    ctx: &mut TxContext,
) {
    let vault = EpochVault {
        id: object::new(ctx),
        owner: ctx.sender(),
        amount,
        lock_until_epoch: ctx.epoch() + lock_epochs,
    };
    transfer::transfer(vault, ctx.sender());
}

/// 到达指定 epoch 后才能解锁
public fun unlock(vault: EpochVault, ctx: &TxContext): u64 {
    assert!(ctx.epoch() >= vault.lock_until_epoch, 0);
    assert!(ctx.sender() == vault.owner, 1);

    let EpochVault { id, owner: _, amount, lock_until_epoch: _ } = vault;
    id.delete();
    amount
}

/// 查询剩余锁定 epoch 数
public fun remaining_epochs(vault: &EpochVault, ctx: &TxContext): u64 {
    if (ctx.epoch() >= vault.lock_until_epoch) {
        0
    } else {
        vault.lock_until_epoch - ctx.epoch()
    }
}
```

## Clock 对象

### 什么是 Clock

`sui::clock::Clock` 是一个**系统级共享对象**，位于固定地址 `0x6`。它由 Sui 系统在每个 checkpoint 时更新，提供**毫秒级精度**的时间戳，比 epoch 时间戳精确得多。

### Clock 的特性

| 特性 | 说明 |
|------|------|
| 地址 | 固定为 `0x6` |
| 类型 | 共享不可变对象 |
| 引用方式 | 只能以不可变引用 `&Clock` 传入 |
| 精度 | 毫秒级 |
| 更新频率 | 每个 checkpoint 更新一次 |

> **重要**：Clock 对象只能以 `&Clock`（不可变引用）的形式在交易中使用。你不能获取 `&mut Clock`，因为它由系统独占更新。

### 使用 Clock

```move
module examples::clock_demo;

use sui::clock::Clock;

public struct TimestampRecord has key {
    id: UID,
    recorded_at_ms: u64,
    recorder: address,
}

/// 记录当前精确时间戳
public fun record_time(clock: &Clock, ctx: &mut TxContext) {
    let record = TimestampRecord {
        id: object::new(ctx),
        recorded_at_ms: clock.timestamp_ms(),
        recorder: ctx.sender(),
    };
    transfer::transfer(record, ctx.sender());
}

/// 检查是否已过指定时间
public fun has_elapsed(clock: &Clock, since_ms: u64, duration_ms: u64): bool {
    clock.timestamp_ms() >= since_ms + duration_ms
}
```

### 时间锁定金库

```move
module examples::time_lock;

use sui::clock::Clock;

public struct TimeLock has key {
    id: UID,
    unlock_time_ms: u64,
    content: vector<u8>,
    creator: address,
}

/// 创建一个时间锁定的金库
public fun create_lock(
    clock: &Clock,
    lock_duration_ms: u64,
    content: vector<u8>,
    ctx: &mut TxContext,
) {
    let lock = TimeLock {
        id: object::new(ctx),
        unlock_time_ms: clock.timestamp_ms() + lock_duration_ms,
        content,
        creator: ctx.sender(),
    };
    transfer::transfer(lock, ctx.sender());
}

/// 只有时间到达后才能解锁
public fun unlock(lock: TimeLock, clock: &Clock): vector<u8> {
    assert!(clock.timestamp_ms() >= lock.unlock_time_ms, 0);
    let TimeLock { id, unlock_time_ms: _, content, creator: _ } = lock;
    id.delete();
    content
}

/// 查询当前 epoch 信息
public fun current_epoch(ctx: &TxContext): u64 {
    ctx.epoch()
}
```

## Epoch vs Clock 对比

| 维度 | Epoch | Clock |
|------|-------|-------|
| 精度 | ~24 小时 | 毫秒级 |
| 来源 | TxContext（自动提供） | Clock 共享对象（需作为参数传入） |
| 开销 | 极低（无额外输入） | 需要输入共享对象（可能影响并行） |
| 稳定性 | 同一 epoch 内值不变 | 每个 checkpoint 更新 |
| 适用场景 | 锁仓周期、奖励计算 | 拍卖、限时活动、精确计时 |

### 选择建议

- 如果业务逻辑只需要"大约几天"的时间粒度，使用 **epoch**
- 如果需要"几秒到几小时"的精确计时，使用 **Clock**
- 如果同时需要两者，可以在同一个函数中同时使用 `&Clock` 和 `&TxContext`

## 实际应用场景

### 限时拍卖

```move
module examples::auction;

use sui::clock::Clock;
use sui::event;

public struct AuctionCreated has copy, drop {
    auction_id: ID,
    end_time_ms: u64,
}

public struct BidPlaced has copy, drop {
    auction_id: ID,
    bidder: address,
    amount: u64,
}

public struct Auction has key {
    id: UID,
    seller: address,
    highest_bid: u64,
    highest_bidder: address,
    end_time_ms: u64,
    settled: bool,
}

public fun create_auction(
    clock: &Clock,
    duration_ms: u64,
    starting_bid: u64,
    ctx: &mut TxContext,
) {
    let end_time = clock.timestamp_ms() + duration_ms;
    let auction = Auction {
        id: object::new(ctx),
        seller: ctx.sender(),
        highest_bid: starting_bid,
        highest_bidder: @0x0,
        end_time_ms: end_time,
        settled: false,
    };

    event::emit(AuctionCreated {
        auction_id: object::id(&auction),
        end_time_ms: end_time,
    });

    transfer::share_object(auction);
}

public fun place_bid(
    auction: &mut Auction,
    bid_amount: u64,
    clock: &Clock,
    ctx: &TxContext,
) {
    assert!(!auction.settled, 0);
    assert!(clock.timestamp_ms() < auction.end_time_ms, 1);
    assert!(bid_amount > auction.highest_bid, 2);

    auction.highest_bid = bid_amount;
    auction.highest_bidder = ctx.sender();

    event::emit(BidPlaced {
        auction_id: object::id(auction),
        bidder: ctx.sender(),
        amount: bid_amount,
    });
}

public fun settle(auction: &mut Auction, clock: &Clock) {
    assert!(!auction.settled, 0);
    assert!(clock.timestamp_ms() >= auction.end_time_ms, 1);
    auction.settled = true;
}
```

### 冷却期机制

```move
module examples::cooldown;

use sui::clock::Clock;

public struct Player has key {
    id: UID,
    last_action_ms: u64,
    cooldown_ms: u64,
    action_count: u64,
}

public fun create_player(cooldown_ms: u64, ctx: &mut TxContext) {
    let player = Player {
        id: object::new(ctx),
        last_action_ms: 0,
        cooldown_ms,
        action_count: 0,
    };
    transfer::transfer(player, ctx.sender());
}

public fun perform_action(player: &mut Player, clock: &Clock) {
    let now = clock.timestamp_ms();
    assert!(now >= player.last_action_ms + player.cooldown_ms, 0);

    player.last_action_ms = now;
    player.action_count = player.action_count + 1;
}

public fun time_until_ready(player: &Player, clock: &Clock): u64 {
    let ready_time = player.last_action_ms + player.cooldown_ms;
    let now = clock.timestamp_ms();
    if (now >= ready_time) {
        0
    } else {
        ready_time - now
    }
}
```

## 小结

Sui 提供了两种互补的时间机制。**Epoch** 来自 TxContext，表示网络运行周期（约 24 小时），适合粗粒度的时间逻辑，且无额外开销。**Clock** 是位于地址 `0x6` 的系统共享对象，提供毫秒级精度的时间戳，适合拍卖、冷却期、精确限时等场景，但需要作为 `&Clock` 引用传入函数。选择时间机制时，应根据业务需求的精度要求来决定：周期性逻辑优先使用 epoch，精确计时逻辑使用 Clock。两种机制可以在同一函数中组合使用。


---


<!-- source: 08_programmability/collections.md -->
## 10.6 集合类型 — VecMap / VecSet

# 集合类型

Sui Framework 提供了一组轻量级的集合数据结构——`VecSet` 和 `VecMap`，它们基于 `vector` 实现，适合在对象内部存储小规模数据。与基于动态字段的 `Table`/`Bag` 不同，这些集合将所有数据存储在对象内部，具有更简单的使用模型和更低的 Gas 开销（在数据量较小时）。本章将详细介绍它们的 API、使用场景和限制。

## VecSet：去重集合

### 概述

`VecSet<K>` 是一个基于 `vector` 的集合类型，保证元素唯一性。它的行为类似于其他语言中的 `HashSet`，但底层使用有序数组实现。

`VecSet` 位于 `sui::vec_set` 模块中，元素类型 `K` 必须具有 `copy` 和 `drop` 能力。

### 核心 API

| 方法 | 签名 | 说明 |
|------|------|------|
| `empty()` | `fun empty<K>(): VecSet<K>` | 创建空集合 |
| `singleton()` | `fun singleton<K>(key: K): VecSet<K>` | 创建只含一个元素的集合 |
| `insert()` | `fun insert<K>(set: &mut VecSet<K>, key: K)` | 插入元素，已存在则 abort |
| `remove()` | `fun remove<K>(set: &mut VecSet<K>, key: &K)` | 移除元素，不存在则 abort |
| `contains()` | `fun contains<K>(set: &VecSet<K>, key: &K): bool` | 检查元素是否存在 |
| `size()` | `fun size<K>(set: &VecSet<K>): u64` | 返回元素数量 |
| `is_empty()` | `fun is_empty<K>(set: &VecSet<K>): bool` | 是否为空 |
| `into_keys()` | `fun into_keys<K>(set: VecSet<K>): vector<K>` | 解构为 vector |

### 使用示例

```move
module examples::collections_demo;

use sui::vec_map::{Self, VecMap};
use sui::vec_set::{Self, VecSet};
use std::string::String;

public struct Whitelist has key {
    id: UID,
    addresses: VecSet<address>,
}

public struct Scores has key {
    id: UID,
    player_scores: VecMap<address, u64>,
}

public fun create_whitelist(ctx: &mut TxContext): Whitelist {
    Whitelist {
        id: object::new(ctx),
        addresses: vec_set::empty(),
    }
}

public fun add_to_whitelist(wl: &mut Whitelist, addr: address) {
    vec_set::insert(&mut wl.addresses, addr);
}

public fun is_whitelisted(wl: &Whitelist, addr: &address): bool {
    vec_set::contains(&wl.addresses, addr)
}

public fun create_scores(ctx: &mut TxContext): Scores {
    Scores {
        id: object::new(ctx),
        player_scores: vec_map::empty(),
    }
}

public fun set_score(scores: &mut Scores, player: address, score: u64) {
    if (vec_map::contains(&scores.player_scores, &player)) {
        let s = vec_map::get_mut(&mut scores.player_scores, &player);
        *s = score;
    } else {
        vec_map::insert(&mut scores.player_scores, player, score);
    };
}
```

### 白名单完整示例

```move
module examples::whitelist;

use sui::vec_set::{Self, VecSet};
use sui::event;

public struct WhitelistUpdated has copy, drop {
    added: bool,
    addr: address,
    new_size: u64,
}

public struct AdminCap has key {
    id: UID,
}

public struct MintWhitelist has key {
    id: UID,
    allowed: VecSet<address>,
    max_size: u64,
}

fun init(ctx: &mut TxContext) {
    transfer::transfer(AdminCap { id: object::new(ctx) }, ctx.sender());
    transfer::share_object(MintWhitelist {
        id: object::new(ctx),
        allowed: vec_set::empty(),
        max_size: 1000,
    });
}

public fun add_address(_: &AdminCap, wl: &mut MintWhitelist, addr: address) {
    assert!(vec_set::size(&wl.allowed) < wl.max_size, 0);
    assert!(!vec_set::contains(&wl.allowed, &addr), 1);
    vec_set::insert(&mut wl.allowed, addr);

    event::emit(WhitelistUpdated {
        added: true,
        addr,
        new_size: vec_set::size(&wl.allowed),
    });
}

public fun remove_address(_: &AdminCap, wl: &mut MintWhitelist, addr: address) {
    assert!(vec_set::contains(&wl.allowed, &addr), 0);
    vec_set::remove(&mut wl.allowed, &addr);

    event::emit(WhitelistUpdated {
        added: false,
        addr,
        new_size: vec_set::size(&wl.allowed),
    });
}

public fun can_mint(wl: &MintWhitelist, addr: &address): bool {
    vec_set::contains(&wl.allowed, addr)
}
```

## VecMap：键值映射

### 概述

`VecMap<K, V>` 是一个基于 `vector` 的键值对映射，保证键的唯一性。键类型 `K` 必须具有 `copy` 能力，以便进行查找和比较。

`VecMap` 位于 `sui::vec_map` 模块中。

### 核心 API

| 方法 | 说明 |
|------|------|
| `empty()` | 创建空映射 |
| `insert(map, key, value)` | 插入键值对，键已存在则 abort |
| `remove(map, key)` | 移除键值对，返回 `(key, value)` |
| `contains(map, key)` | 检查键是否存在 |
| `get(map, key)` | 获取值的不可变引用 |
| `get_mut(map, key)` | 获取值的可变引用 |
| `size(map)` | 返回键值对数量 |
| `is_empty(map)` | 是否为空 |
| `keys(map)` | 获取所有键的引用 |
| `into_keys_values(map)` | 解构为两个 vector |
| `get_idx(map, key)` | 获取键的索引位置 |
| `get_entry_by_idx(map, idx)` | 通过索引获取键值对引用 |
| `remove_entry_by_idx(map, idx)` | 通过索引移除键值对 |

### 配置管理示例

```move
module examples::config_map;

use sui::vec_map::{Self, VecMap};
use std::string::{Self, String};

const ENotAdmin: u64 = 0;

public struct AppConfig has key {
    id: UID,
    settings: VecMap<String, String>,
    admin: address,
}

public fun create_config(ctx: &mut TxContext) {
    let mut settings = vec_map::empty<String, String>();

    vec_map::insert(
        &mut settings,
        string::utf8(b"app_name"),
        string::utf8(b"MyDApp"),
    );
    vec_map::insert(
        &mut settings,
        string::utf8(b"version"),
        string::utf8(b"1.0.0"),
    );
    vec_map::insert(
        &mut settings,
        string::utf8(b"max_users"),
        string::utf8(b"10000"),
    );

    let config = AppConfig {
        id: object::new(ctx),
        settings,
        admin: ctx.sender(),
    };
    transfer::share_object(config);
}

public fun update_setting(
    config: &mut AppConfig,
    key: String,
    value: String,
    ctx: &TxContext,
) {
    assert!(config.admin == ctx.sender(), ENotAdmin);

    if (vec_map::contains(&config.settings, &key)) {
        let v = vec_map::get_mut(&mut config.settings, &key);
        *v = value;
    } else {
        vec_map::insert(&mut config.settings, key, value);
    };
}

public fun setting(config: &AppConfig, key: &String): &String {
    vec_map::get(&config.settings, key)
}

public fun remove_setting(config: &mut AppConfig, key: &String, ctx: &TxContext) {
    assert!(config.admin == ctx.sender(), ENotAdmin);
    vec_map::remove(&mut config.settings, key);
}

public fun setting_count(config: &AppConfig): u64 {
    vec_map::size(&config.settings)
}
```

### 积分排行榜示例

```move
module examples::leaderboard;

use sui::vec_map::{Self, VecMap};

public struct Leaderboard has key {
    id: UID,
    scores: VecMap<address, u64>,
}

public fun create(ctx: &mut TxContext) {
    transfer::share_object(Leaderboard {
        id: object::new(ctx),
        scores: vec_map::empty(),
    });
}

public fun add_score(board: &mut Leaderboard, player: address, points: u64) {
    if (vec_map::contains(&board.scores, &player)) {
        let current = vec_map::get_mut(&mut board.scores, &player);
        *current = *current + points;
    } else {
        vec_map::insert(&mut board.scores, player, points);
    };
}

public fun score(board: &Leaderboard, player: &address): u64 {
    if (vec_map::contains(&board.scores, player)) {
        *vec_map::get(&board.scores, player)
    } else {
        0
    }
}

public fun player_count(board: &Leaderboard): u64 {
    vec_map::size(&board.scores)
}

public fun reset_player(board: &mut Leaderboard, player: &address) {
    if (vec_map::contains(& board.scores, player)) {
        vec_map::remove(&mut board.scores, player);
    };
}
```

## 限制与注意事项

### 对象大小限制

`VecSet` 和 `VecMap` 将所有数据存储在对象内部。Sui 对单个对象的大小有上限（目前约 256 KB）。当集合数据量增长到接近此限制时，交易可能会失败。

### O(n) 操作复杂度

由于底层基于 `vector`，大部分查找和删除操作的时间复杂度为 **O(n)**：

- `contains()` — 线性扫描查找
- `remove()` — 线性扫描 + 移位
- `insert()` — 线性扫描检查唯一性

对于频繁操作的大数据集，这会导致 Gas 消耗显著增加。

### 何时使用 VecSet/VecMap vs 动态集合

| 场景 | 推荐 | 原因 |
|------|------|------|
| 元素数量 < 100 | `VecSet`/`VecMap` | 简单直接，Gas 低 |
| 元素数量 100-1000 | 视情况而定 | 测试 Gas 消耗后决定 |
| 元素数量 > 1000 | `Table`/`Bag` | 避免对象大小限制和高 Gas |
| 需要存储对象值 | `ObjectTable`/`ObjectBag` | 对象需要独立存储 |
| 需要顺序遍历 | `LinkedTable` | 支持链式遍历 |
| 数据异构（不同类型） | `Bag`/`ObjectBag` | 支持不同类型的值 |

### 不可比较

`VecSet` 和 `VecMap` 本身**不支持相等性比较**（没有 `==` 操作）。如果你需要比较两个集合，需要将它们解构为 `vector` 后自行实现比较逻辑。

## 组合使用模式

在实际项目中，`VecSet` 和 `VecMap` 经常组合使用，或与其他数据结构配合：

```move
module examples::access_control;

use sui::vec_set::{Self, VecSet};
use sui::vec_map::{Self, VecMap};

public struct AccessControl has key {
    id: UID,
    admins: VecSet<address>,
    role_permissions: VecMap<vector<u8>, VecSet<vector<u8>>>,
}

public fun create(creator: address, ctx: &mut TxContext) {
    let mut admins = vec_set::empty<address>();
    vec_set::insert(&mut admins, creator);

    transfer::share_object(AccessControl {
        id: object::new(ctx),
        admins,
        role_permissions: vec_map::empty(),
    });
}

const ENotAdmin: u64 = 0;

public fun add_admin(ac: &mut AccessControl, new_admin: address, ctx: &TxContext) {
    assert!(vec_set::contains(&ac.admins, &ctx.sender()), ENotAdmin);
    vec_set::insert(&mut ac.admins, new_admin);
}

public fun add_role_permission(
    ac: &mut AccessControl,
    role: vector<u8>,
    permission: vector<u8>,
    ctx: &TxContext,
) {
    assert!(vec_set::contains(&ac.admins, &ctx.sender()), ENotAdmin);

    if (vec_map::contains(&ac.role_permissions, &role)) {
        let perms = vec_map::get_mut(&mut ac.role_permissions, &role);
        if (!vec_set::contains(perms, &permission)) {
            vec_set::insert(perms, permission);
        };
    } else {
        let mut perms = vec_set::empty<vector<u8>>();
        vec_set::insert(&mut perms, permission);
        vec_map::insert(&mut ac.role_permissions, role, perms);
    };
}

public fun has_permission(
    ac: &AccessControl,
    role: &vector<u8>,
    permission: &vector<u8>,
): bool {
    if (!vec_map::contains(&ac.role_permissions, role)) {
        return false
    };
    let perms = vec_map::get(&ac.role_permissions, role);
    vec_set::contains(perms, permission)
}
```

## 小结

`VecSet` 和 `VecMap` 是 Sui Framework 提供的轻量级集合类型，基于 `vector` 实现，数据存储在对象内部。`VecSet` 提供去重集合语义，`VecMap` 提供键值映射语义，两者都保证键/元素的唯一性。它们适合存储小规模数据（通常几十到几百个元素），操作简单且 Gas 开销较低。但由于底层使用线性扫描，操作复杂度为 O(n)，且受对象大小限制（约 256 KB），不适合大规模数据存储。当数据量增长到数百以上时，应考虑使用 `Table`、`Bag` 等基于动态字段的集合类型。


---


<!-- source: 08_programmability/dynamic-fields.md -->
## 10.7 动态字段

# 动态字段

动态字段（Dynamic Fields）是 Sui Move 中最强大的存储机制之一。它允许你在运行时为对象添加、修改和删除任意键值对数据，突破了结构体字段在编译时固定的限制。动态字段没有数量上限，可以存储异构数据类型，是构建灵活、可扩展合约的核心工具。

## 基本概念

### 什么是动态字段

普通的结构体字段在编译时确定，一旦定义就不能增减。动态字段则不同——它们在运行时通过名称（key）附加到对象的 `UID` 上，存储在独立的内部 `Field` 对象中。

从概念上说，动态字段就像是一个无限大小的键值存储，挂载在某个 Sui 对象上。

### 工作原理

当你调用 `dynamic_field::add(uid, name, value)` 时：

1. Sui 运行时创建一个内部 `Field<Name, Value>` 对象
2. 该 `Field` 对象以 `name` 为键，与目标对象的 `UID` 关联
3. `value` 被存储在这个 `Field` 对象中
4. 这个 `Field` 对象不会出现在对象的序列化表示中，但可以通过 `UID` 和 `name` 访问

### 类型约束

| 约束 | 名称（Name） | 值（Value） |
|------|-------------|------------|
| 必须能力 | `copy + drop + store` | `store` |
| 说明 | 用于查找和比较 | 需要持久化存储 |

## 核心 API

动态字段的操作由 `sui::dynamic_field` 模块提供：

| 函数 | 签名 | 说明 |
|------|------|------|
| `add` | `fun add<Name, Value>(uid: &mut UID, name: Name, value: Value)` | 添加字段，名称重复则 abort |
| `remove` | `fun remove<Name, Value>(uid: &mut UID, name: Name): Value` | 移除并返回字段值 |
| `borrow` | `fun borrow<Name, Value>(uid: &UID, name: Name): &Value` | 借用字段值（不可变） |
| `borrow_mut` | `fun borrow_mut<Name, Value>(uid: &mut UID, name: Name): &mut Value` | 借用字段值（可变） |
| `exists_` | `fun exists_<Name>(uid: &UID, name: Name): bool` | 检查字段是否存在 |
| `exists_with_type` | `fun exists_with_type<Name, Value>(uid: &UID, name: Name): bool` | 检查指定类型的字段是否存在 |

## 基础用法

### 添加和读取动态字段

```move
module examples::dynamic_fields_demo;

use sui::dynamic_field as df;
use std::string::String;

public struct Character has key {
    id: UID,
    name: String,
}

public struct Hat has store {
    color: String,
}

public struct Sword has store {
    damage: u64,
}

public fun create_character(name: String, ctx: &mut TxContext): Character {
    Character { id: object::new(ctx), name }
}

/// 使用动态字段添加异构装备
public fun equip_hat(character: &mut Character, hat: Hat) {
    df::add(&mut character.id, b"hat", hat);
}

public fun equip_sword(character: &mut Character, sword: Sword) {
    df::add(&mut character.id, b"sword", sword);
}

/// 借用动态字段
public fun hat_color(character: &Character): &String {
    let hat: &Hat = df::borrow(&character.id, b"hat");
    &hat.color
}

/// 移除动态字段
public fun unequip_hat(character: &mut Character): Hat {
    df::remove(&mut character.id, b"hat")
}

/// 检查字段是否存在
public fun has_sword(character: &Character): bool {
    df::exists_(&character.id, b"sword")
}
```

### 修改动态字段值

```move
module examples::df_modify;

use sui::dynamic_field as df;

public struct GameItem has key {
    id: UID,
}

public struct Stats has store, drop {
    attack: u64,
    defense: u64,
}

public fun create_item(ctx: &mut TxContext): GameItem {
    let mut item = GameItem { id: object::new(ctx) };
    df::add(&mut item.id, b"stats", Stats { attack: 10, defense: 5 });
    item
}

public fun upgrade_attack(item: &mut GameItem, bonus: u64) {
    let stats: &mut Stats = df::borrow_mut(&mut item.id, b"stats");
    stats.attack = stats.attack + bonus;
}

public fun upgrade_defense(item: &mut GameItem, bonus: u64) {
    let stats: &mut Stats = df::borrow_mut(&mut item.id, b"stats");
    stats.defense = stats.defense + bonus;
}

public fun attack(item: &GameItem): u64 {
    let stats: &Stats = df::borrow(&item.id, b"stats");
    stats.attack
}
```

## 自定义类型作为字段名

使用原始类型（如 `vector<u8>`）作为字段名虽然简单，但存在安全风险——任何知道名称的模块都可能访问你的字段。使用**自定义类型作为字段名**可以实现模块级别的访问控制。

### 为什么需要自定义键

只有能构造键类型实例的模块才能访问对应的动态字段。如果键类型定义在你的模块中且构造函数不对外暴露，那么只有你的模块能操作这些字段。

```move
module examples::df_custom_key;

use sui::dynamic_field as df;

/// 自定义键类型——只有本模块能创建实例
public struct ConfigKey has copy, drop, store {}

public struct AdminKey has copy, drop, store { index: u64 }

public struct Registry has key {
    id: UID,
}

public fun set_config(registry: &mut Registry, value: vector<u8>) {
    if (df::exists_(&registry.id, ConfigKey {})) {
        let v: &mut vector<u8> = df::borrow_mut(&mut registry.id, ConfigKey {});
        *v = value;
    } else {
        df::add(&mut registry.id, ConfigKey {}, value);
    }
}

public fun get_config(registry: &Registry): &vector<u8> {
    df::borrow(&registry.id, ConfigKey {})
}

public fun set_admin(registry: &mut Registry, index: u64, admin: address) {
    let key = AdminKey { index };
    if (df::exists_(&registry.id, key)) {
        let v: &mut address = df::borrow_mut(&mut registry.id, key);
        *v = admin;
    } else {
        df::add(&mut registry.id, key, admin);
    }
}

public fun get_admin(registry: &Registry, index: u64): address {
    *df::borrow(&registry.id, AdminKey { index })
}
```

### 多维度访问控制

```move
module examples::df_access;

use sui::dynamic_field as df;
use std::string::String;

/// 只有本模块能创建和使用这些键
public struct MetadataKey has copy, drop, store { field: String }
public struct PermissionKey has copy, drop, store { role: vector<u8> }

public struct ProtectedObject has key {
    id: UID,
}

public fun set_metadata(obj: &mut ProtectedObject, field: String, value: String) {
    let key = MetadataKey { field };
    if (df::exists_(&obj.id, key)) {
        let v: &mut String = df::borrow_mut(&mut obj.id, key);
        *v = value;
    } else {
        df::add(&mut obj.id, key, value);
    };
}

public fun metadata(obj: &ProtectedObject, field: String): &String {
    df::borrow(&obj.id, MetadataKey { field })
}

public fun grant_permission(obj: &mut ProtectedObject, role: vector<u8>, addr: address) {
    let key = PermissionKey { role };
    if (df::exists_(&obj.id, key)) {
        let v: &mut address = df::borrow_mut(&mut obj.id, key);
        *v = addr;
    } else {
        df::add(&mut obj.id, key, addr);
    };
}
```

## 外部类型作为动态字段

动态字段的一个强大特性是可以使用**其他模块定义的类型**作为值存储。只要该类型具有 `store` 能力，就可以作为动态字段的值。

```move
module examples::df_foreign;

use sui::dynamic_field as df;
use sui::coin::Coin;
use sui::sui::SUI;

public struct Wallet has key {
    id: UID,
    owner: address,
}

public struct CoinSlotKey has copy, drop, store { index: u64 }

public fun create_wallet(ctx: &mut TxContext): Wallet {
    Wallet {
        id: object::new(ctx),
        owner: ctx.sender(),
    }
}

public fun deposit_coin(wallet: &mut Wallet, index: u64, coin: Coin<SUI>) {
    df::add(&mut wallet.id, CoinSlotKey { index }, coin);
}

public fun withdraw_coin(wallet: &mut Wallet, index: u64): Coin<SUI> {
    df::remove(&mut wallet.id, CoinSlotKey { index })
}

public fun has_coin(wallet: &Wallet, index: u64): bool {
    df::exists_with_type<CoinSlotKey, Coin<SUI>>(&wallet.id, CoinSlotKey { index })
}
```

## 动态字段 vs 动态对象字段

Sui Framework 还提供了 `sui::dynamic_object_field` 模块。两者的主要区别在于：

| 特性 | 动态字段 (`dynamic_field`) | 动态对象字段 (`dynamic_object_field`) |
|------|--------------------------|--------------------------------------|
| 值类型要求 | `store` | `key + store`（必须是 Sui 对象） |
| 存储方式 | 值嵌入在 Field 对象中 | 值作为独立对象存储，Field 只存引用 |
| 链上可见性 | 值不可通过 ID 直接查询 | 值作为独立对象，可通过 ID 查询 |
| 适用场景 | 存储普通数据 | 存储需要独立可见的子对象 |

```move
module examples::df_vs_dof;

use sui::dynamic_field as df;
use sui::dynamic_object_field as dof;
use std::string::String;

public struct Parent has key {
    id: UID,
}

/// 普通值——用 dynamic_field
public struct Metadata has store {
    description: String,
}

/// Sui 对象——可以用 dynamic_object_field
public struct Child has key, store {
    id: UID,
    value: u64,
}

public fun attach_metadata(parent: &mut Parent, desc: String) {
    df::add(&mut parent.id, b"metadata", Metadata { description: desc });
}

public fun attach_child(parent: &mut Parent, child: Child) {
    dof::add(&mut parent.id, b"child", child);
}

public fun detach_child(parent: &mut Parent): Child {
    dof::remove(&mut parent.id, b"child")
}
```

## 孤儿动态字段

当一个拥有动态字段的对象被销毁（通过解构 + `object::delete()`）时，如果其动态字段**没有被先移除**，这些字段就会变成"孤儿"——它们仍然存在于链上存储中，但再也无法被访问或删除。

### 问题示例

```move
module examples::orphan_warning;

use sui::dynamic_field as df;

public struct Container has key {
    id: UID,
}

public fun create(ctx: &mut TxContext): Container {
    let mut c = Container { id: object::new(ctx) };
    df::add(&mut c.id, b"data", 42u64);
    c
}

/// 危险！动态字段 "data" 将变成孤儿
public fun destroy_unsafe(container: Container) {
    let Container { id } = container;
    id.delete();
    // "data" 字段永远无法访问了
}

/// 安全的做法：先移除所有动态字段
public fun destroy_safe(mut container: Container) {
    if (df::exists_(&container.id, b"data")) {
        let _: u64 = df::remove(&mut container.id, b"data");
    };
    let Container { id } = container;
    id.delete();
}
```

> **最佳实践**：在销毁拥有动态字段的对象之前，始终确保所有动态字段已被移除。如果动态字段数量不确定或过多，考虑设计时就避免需要销毁父对象的场景。

## 暴露 UID 的安全性

要让外部模块能为你的对象添加动态字段，你需要暴露对象的 `UID` 引用。这有安全隐患——任何获得 `&mut UID` 的模块都可以为该对象添加、修改或删除动态字段。

### 安全暴露策略

```move
module examples::uid_exposure;

use sui::dynamic_field as df;

public struct MyObject has key {
    id: UID,
    owner: address,
}

/// 暴露不可变 UID——允许读取动态字段，但不能修改
public fun uid(obj: &MyObject): &UID {
    &obj.id
}

/// 暴露可变 UID——允许添加/修改/删除动态字段
/// 通过要求 owner 验证来限制访问
public fun uid_mut(obj: &mut MyObject, ctx: &TxContext): &mut UID {
    assert!(obj.owner == ctx.sender(), 0);
    &mut obj.id
}
```

## 动态字段 vs 结构体字段

| 维度 | 结构体字段 | 动态字段 |
|------|-----------|---------|
| 定义时机 | 编译时固定 | 运行时动态添加 |
| 类型一致性 | 每个字段类型固定 | 不同名称可存储不同类型 |
| 数量限制 | 编译时确定 | 无上限 |
| 访问开销 | 直接访问，零额外开销 | 需要查找，有额外 Gas 开销 |
| 对象大小 | 占用对象空间 | 独立存储，不占父对象空间 |
| 可见性 | 对象序列化中可见 | 不在对象序列化中直接可见 |

### 性能考虑

- **结构体字段**读写没有额外开销，是最快的方式
- **动态字段**每次操作需要额外的存储查找，Gas 开销更高
- 对于固定已知的属性，优先使用结构体字段
- 对于数量不定或类型不一的扩展数据，使用动态字段

## 实际应用：可扩展的 NFT

```move
module examples::extensible_nft;

use sui::dynamic_field as df;
use std::string::String;

public struct NFT has key, store {
    id: UID,
    name: String,
    collection: String,
}

public struct TraitKey has copy, drop, store { name: String }

public fun create_nft(
    name: String,
    collection: String,
    ctx: &mut TxContext,
): NFT {
    NFT { id: object::new(ctx), name, collection }
}

public fun add_trait(nft: &mut NFT, trait_name: String, trait_value: String) {
    let key = TraitKey { name: trait_name };
    if (df::exists_(&nft.id, key)) {
        let v: &mut String = df::borrow_mut(&mut nft.id, key);
        *v = trait_value;
    } else {
        df::add(&mut nft.id, key, trait_value);
    };
}

public fun trait_value(nft: &NFT, trait_name: String): &String {
    df::borrow(&nft.id, TraitKey { name: trait_name })
}

public fun has_trait(nft: &NFT, trait_name: String): bool {
    df::exists_(&nft.id, TraitKey { name: trait_name })
}

public fun remove_trait(nft: &mut NFT, trait_name: String): String {
    df::remove(&mut nft.id, TraitKey { name: trait_name })
}
```

## 小结

动态字段是 Sui Move 中实现灵活数据存储的核心机制。它通过将键值对附加到对象的 `UID` 上，突破了结构体字段在编译时固定的限制，支持运行时动态添加异构数据且没有数量上限。核心操作包括 `add`、`remove`、`borrow`、`borrow_mut` 和 `exists_`。使用自定义类型作为字段名可以实现模块级访问控制，增强安全性。需要注意孤儿字段问题——销毁父对象前应移除所有动态字段。动态字段与动态对象字段（`dynamic_object_field`）的区别在于后者要求值为 Sui 对象，且值作为独立对象在链上可查询。在性能方面，动态字段比结构体字段有更高的 Gas 开销，应根据数据的固定性和规模选择合适的存储方式。


---


<!-- source: 08_programmability/dynamic-object-fields.md -->
## 10.8 动态对象字段

# 动态对象字段

动态对象字段（Dynamic Object Fields）是 Sui 提供的一种高级存储机制，允许将 **独立对象** 以键值对的形式附加到父对象上。与普通动态字段不同，动态对象字段中存储的值仍然保持其独立对象身份——可以通过对象 ID 在链下被发现和直接访问。这使得动态对象字段成为构建需要保留对象可发现性的复杂数据结构的理想选择。

## 动态对象字段与普通动态字段的区别

在深入学习动态对象字段之前，我们需要理解它与普通动态字段（`dynamic_field`）的核心差异：

### 值约束不同

| 特性 | 动态字段 (`dynamic_field`) | 动态对象字段 (`dynamic_object_field`) |
|------|--------------------------|--------------------------------------|
| 值的能力约束 | `store` | `key + store`（必须是对象） |
| 值是否被包装 | 是（被包装进 `Field` 结构体） | 否（值保持独立存在） |
| 链下可发现性 | 丢失（无法通过 ID 查找） | 保留（可通过对象 ID 查找） |
| 成本 | 较低（加载 1 个对象） | 较高（加载 2 个对象） |

### 内部存储机制

普通动态字段将值直接包装在一个 `Field<Name, Value>` 对象中，值成为该对象的一部分，失去了独立身份。

动态对象字段则使用了一种巧妙的设计：内部创建一个 `Field<Name, ID>` 对象，仅存储子对象的 **ID 引用**，而子对象本身仍然作为顶层对象存在于全局存储中。这意味着：

- 子对象的 ID 保持不变，可以被外部直接引用
- 链下索引器可以通过 ID 查询到该对象
- 对象浏览器中可以直接看到该对象

## 模块定义与导入

动态对象字段定义在 `sui::dynamic_object_field` 模块中，通常使用缩写导入：

```move
use sui::dynamic_object_field as dof;
```

## 核心操作

### add — 添加动态对象字段

`add` 函数将一个对象作为动态对象字段附加到父对象上：

```move
public fun add<Name: copy + drop + store, Value: key + store>(
    object: &mut UID,
    name: Name,
    value: Value,
);
```

注意 `Value` 的约束是 `key + store`，意味着只有拥有 `key` 和 `store` 能力的结构体（即对象）才能作为值存储。

### borrow 和 borrow_mut — 借用字段

```move
public fun borrow<Name: copy + drop + store, Value: key + store>(
    object: &UID,
    name: Name,
): &Value;

public fun borrow_mut<Name: copy + drop + store, Value: key + store>(
    object: &mut UID,
    name: Name,
): &mut Value;
```

分别以不可变引用和可变引用的方式访问动态对象字段中存储的对象。

### remove — 移除字段

```move
public fun remove<Name: copy + drop + store, Value: key + store>(
    object: &mut UID,
    name: Name,
): Value;
```

移除动态对象字段并返回其中存储的对象，调用者可以决定如何处理该对象（转移、销毁等）。

### exists_ 和 id — 查询函数

```move
public fun exists_<Name: copy + drop + store>(object: &UID, name: Name): bool;

public fun id<Name: copy + drop + store>(object: &UID, name: Name): Option<ID>;
```

- `exists_` 检查指定名称的动态对象字段是否存在
- `id` 返回存储在动态对象字段中的对象 ID（如果存在）

`id` 函数是动态对象字段独有的，普通动态字段没有这个函数。它允许你在不借用值的情况下获取子对象的 ID。

## 完整代码示例

以下示例展示了一个仓库系统，使用动态对象字段来管理存储的物品：

```move
module examples::dynamic_object_fields_demo;

use sui::dynamic_object_field as dof;
use std::string::String;

public struct Warehouse has key {
    id: UID,
}

public struct StoredItem has key, store {
    id: UID,
    name: String,
    value: u64,
}

public fun create_warehouse(ctx: &mut TxContext): Warehouse {
    Warehouse { id: object::new(ctx) }
}

public fun store_item(
    warehouse: &mut Warehouse,
    name: String,
    item: StoredItem,
) {
    dof::add(&mut warehouse.id, name, item);
}

public fun borrow_item(warehouse: &Warehouse, name: String): &StoredItem {
    dof::borrow(&warehouse.id, name)
}

public fun take_item(warehouse: &mut Warehouse, name: String): StoredItem {
    dof::remove(&mut warehouse.id, name)
}

public fun has_item(warehouse: &Warehouse, name: String): bool {
    dof::exists_(&warehouse.id, name)
}
```

### 扩展：获取子对象 ID

利用 `id` 函数，我们可以在不借用子对象的情况下获取其 ID，这在某些场景下非常有用：

```move
public fun item_id(warehouse: &Warehouse, name: String): Option<ID> {
    dof::id(&warehouse.id, name)
}
```

### 扩展：更新子对象属性

通过 `borrow_mut` 获取可变引用，可以直接修改子对象的内部状态：

```move
public fun update_item_value(
    warehouse: &mut Warehouse,
    name: String,
    new_value: u64,
) {
    let item = dof::borrow_mut<String, StoredItem>(&mut warehouse.id, name);
    item.value = new_value;
}
```

## 链下可发现性

动态对象字段最重要的特性之一是保留了子对象的链下可发现性。这意味着：

1. **索引器支持**：全节点索引器可以通过子对象的 ID 直接查询到它
2. **对象浏览器**：用户可以在 Sui Explorer 中通过 ID 找到并查看子对象
3. **GraphQL 查询**：可以通过 `sui_getObject` API 使用子对象 ID 直接获取信息

这与普通动态字段形成鲜明对比——普通动态字段中的值被包装后，只能通过父对象来发现和访问。

## 性能与成本考量

使用动态对象字段时需要注意以下成本：

- **读取成本**：每次访问动态对象字段需要加载 **两个对象**（`Field` 包装器和子对象本身），而普通动态字段只需加载一个
- **Gas 消耗**：由于需要加载更多对象，Gas 消耗相应增加
- **存储成本**：子对象作为独立顶层对象存在，需要额外的存储开销

因此在性能敏感的场景中，如果不需要链下可发现性，优先考虑使用普通动态字段。

## 何时选择动态对象字段

### 适合使用动态对象字段的场景

- 子对象需要在链下被独立发现和查询（如 NFT 市场中的上架 NFT）
- 子对象可能需要被其他交易直接引用
- 需要通过 `id` 函数获取子对象 ID 而不加载完整对象
- 构建开放式协议，第三方需要查询和交互子对象

### 适合使用普通动态字段的场景

- 值不需要独立的对象身份（如简单数据类型 `u64`、`String` 等）
- 不需要链下可发现性
- 追求更低的 Gas 成本
- 值的类型不满足 `key + store` 约束

## 小结

动态对象字段是 Sui 中处理对象间动态组合关系的重要工具。它在保持子对象独立身份和可发现性的同时，实现了灵活的键值存储。核心要点包括：

- 值必须具有 `key + store` 能力，即必须是对象
- 子对象不会被包装，保留独立的对象 ID 和链下可发现性
- 提供 `add`、`remove`、`borrow`、`borrow_mut`、`exists_`、`id` 六个核心操作
- 相比普通动态字段，每次访问需要加载两个对象，成本更高
- 在需要链下可发现性的场景中（如 NFT、市场等）优先选择动态对象字段，否则使用普通动态字段以节省成本


---


<!-- source: 08_programmability/derived-object.md -->
## 10.9 派生对象（derived_object）

# 派生对象（Derived Object）

派生对象（Derived Object）是 Sui Framework 中用于**按父对象与键生成确定性地址**的机制。通过 `sui::derived_object`，你可以让某个对象的 ID 完全由「父对象 UID + 键」推导而出，从而实现可预测的地址、注册表去重以及按类型或键命名空间管理子对象。本节将详细介绍其 API、典型场景与注意事项。

## 为什么需要确定性地址

在默认情况下，`object::new(ctx)` 会为每个新对象分配一个**随机的**新 ID。但在以下场景中，我们更需要**确定性**的地址：

- **注册表（Registry）**：例如「每种代币类型 T 在 CoinRegistry 下对应唯一一个 Currency\<T\>」，希望同一类型 T 永远映射到同一个地址，便于链下按地址查询。
- **命名空间**：父对象作为命名空间，不同键对应不同子对象地址，且同一键不能重复注册。
- **可预测的 object ID**：前端或索引器希望在不发起交易的前提下，仅根据父 ID 和键就能算出子对象的 ID。

`derived_object` 提供的正是：**由 (父 UID, Key) 确定性地推导出 address/UID**，并在父对象上记录「该键已被占用」，从而保证同一键只能被 claim 一次。

## 与动态字段的关系

`derived_object` 在实现上依赖 **动态字段**（`dynamic_field`）：  
在父对象的 UID 上以 `Claimed(derived_id)` 为名存储一个标记，表示该派生 ID 已被占用。因此：

- **claim** 时会向父对象写入一条动态字段，用于防止同一 key 被重复 claim。
- **exists** 时只是查询该动态字段是否存在，不创建新对象。
- 派生出的 UID 一旦被 **claim**，就与父对象解耦使用，子对象可以独立存在、转移或共享，不要求父对象在交易中一起被访问（仅首次 claim 时需要父对象可变引用）。

## 模块与导入

```move
use sui::derived_object;
```

## 核心 API

| 函数 | 签名 | 说明 |
|------|------|------|
| **derive_address** | `fun derive_address<K: copy + drop + store>(parent: ID, key: K): address` | 根据父 ID 和键**计算**派生地址，不修改状态，不占用键。 |
| **claim** | `fun claim<K: copy + drop + store>(parent: &mut UID, key: K): UID` | 在父对象上**占用**该键，返回对应的派生 UID；同一键重复 claim 会 abort。 |
| **exists** | `fun exists<K: copy + drop + store>(parent: &UID, key: K): bool` | 查询该 (父, key) 是否已被 claim 过。 |

### derive_address

仅做**纯计算**：给定父对象的 `ID` 和键 `key`，返回一个确定的 `address`。不访问链上状态，不写入任何对象。可用于：

- 在未 claim 之前就预先知道「若用该 key claim，对象会落在哪个地址」。
- 链下或前端用相同算法推算子对象 ID（需与框架实现保持一致）。

```move
let parent_id = parent.id.to_inner();
let addr = derived_object::derive_address(parent_id, my_key);
// addr 每次对同一 parent_id + my_key 都相同
```

### claim

在**父对象的 UID** 上占用键 `key`，并返回一个**派生 UID**。内部会：

1. 用 `derive_address(parent, key)` 得到地址并转成 ID；
2. 检查父对象上是否已有 `Claimed(该 id)` 的动态字段；
3. 若无，则添加该动态字段，并返回由该地址构造的 `UID`。

返回的 UID 可直接用于构造新对象，使该对象「诞生」在派生地址上：

```move
let derived_uid = derived_object::claim(&mut parent.id, key);
let child = MyObject {
    id: derived_uid,
    field: value,
};
// child 的地址 = derive_address(parent.id.to_inner(), key)
```

同一 `(parent, key)` 只能 **claim 一次**；再次 claim 会触发 **EObjectAlreadyExists** 并 abort。

### exists

查询在给定父对象上，某键是否已被 claim 过（即是否已存在对应的 `Claimed` 动态字段）。  
注意：一旦 claim 过，即使之后把派生出的对象删掉（`object::delete`），**exists 仍为 true**，该键无法再次 claim。这样设计是为了避免「删掉子对象后重新 claim 同一键得到新对象」，保证派生地址的长期唯一性。

## Key 的类型约束与唯一性

键类型 `K` 必须满足 **`copy + drop + store`**。常见用法：

- **简单类型**：`u64`、`address`、`bool` 等。
- **字符串**：`std::string::String`、`std::ascii::String`（注意 `String` 与 `vector<u8>`、`ascii::String` 类型不同，会得到不同地址）。
- **结构体**：如 `CurrencyKey<T>()` 这种单例式 key，用于「按类型 T 派生」。

不同**类型**或不同**值**的 key 会得到不同的派生地址。例如：

- `derive_address(parent, b"foo".to_string())` 与 `derive_address(parent, b"foo")`（`vector<u8>`）**不等**；
- `derive_address(parent, key1)` 与 `derive_address(parent, key2)` 在 `key1 != key2` 时**不等**。

因此设计注册表时，键的选取（类型 + 取值）要能唯一标识一个「槽位」。

## 典型场景

### 1. 按类型注册：每个 T 一个槽位

在类型注册表（如 CoinRegistry）中，希望「每种类型 T 对应一个对象」。可以用**类型相关的 key**（例如一个只包含类型的结构体）作为键：

```move
use sui::derived_object;

public struct Registry has key { id: UID }

/// 用作派生键：同一类型 T 总是同一个 Key
public struct TypeKey<phantom T> has copy, drop, store {}

public fun register<T: key>(
    registry: &mut Registry,
    ctx: &mut TxContext,
): UID {
    derived_object::claim(&mut registry.id, TypeKey<T>())
}

public fun exists<T: key>(registry: &Registry): bool {
    derived_object::exists(&registry.id, TypeKey<T>())
}
```

这样每种 `T` 最多被注册一次，且对应地址唯一、可复现。

### 2. 按字符串键注册：命名槽位

用字符串（或其它业务键）做命名空间，每个键对应一个派生对象：

```move
public fun create_named_slot(
    registry: &mut Registry,
    name: std::string::String,
    ctx: &mut TxContext,
): UID {
    derived_object::claim(&mut registry.id, name)
}

public fun slot_exists(registry: &Registry, name: std::string::String): bool {
    derived_object::exists(&registry.id, name)
}
```

### 3. 先算地址再创建对象

若希望「先知道地址，再在后续逻辑里创建对象」，可以先用 `derive_address` 得到地址，再在需要时 `claim` 并用返回的 UID 构造对象：

```move
// 仅计算，不占用
let addr = derived_object::derive_address(registry.id.to_inner(), my_key);

// 需要时再占用并创建对象
let uid = derived_object::claim(&mut registry.id, my_key);
let obj = MyRecord { id: uid, data: ... };
```

## 完整示例：简单类型注册表

下面示例实现一个「按类型 T 注册单例对象」的注册表，并用派生对象保证每种类型只有一个实例、地址确定：

```move
module examples::type_registry;

use sui::derived_object;
use sui::transfer;
use std::string::String;

public struct Registry has key {
    id: UID,
}

/// 每种类型 T 对应一个「槽位」键
public struct TypeKey<phantom T> has copy, drop, store {}

/// 注册表中每类 T 存一条记录
public struct Record<T: store> has key {
    id: UID,
    name: String,
    value: T,
}

public fun new_registry(ctx: &mut TxContext): Registry {
    Registry { id: object::new(ctx) }
}

/// 为类型 T 注册一条记录；若 T 已注册则 abort
public fun register<T: key + store>(
    registry: &mut Registry,
    name: String,
    value: T,
    ctx: &mut TxContext,
) {
    assert!(!derived_object::exists(&registry.id, TypeKey<T>()), 0);
    let uid = derived_object::claim(&mut registry.id, TypeKey<T>());
    let record = Record<T> { id: uid, name, value };
    transfer::share_object(record); // 或 transfer::transfer(record, ctx.sender())
}

public fun is_registered<T: key>(registry: &Registry): bool {
    derived_object::exists(&registry.id, TypeKey<T>())
}
```

要点：

- 用 **TypeKey\<T\>** 做键，保证「每种 T 一个槽位」。
- **register** 中先 `exists` 再 `claim`，避免重复注册。
- **claim** 得到的 UID 直接用作 `Record` 的 `id`，这样 `Record<T>` 的 object ID 永远由 `(Registry.id, TypeKey<T>)` 确定。

## 在 CoinRegistry 中的用法

Sui 的 **CoinRegistry** 在 **finalize_registration** 中使用了派生对象：  
当一种新代币的 `Currency<T>` 被「注册」到链上时，会从 CoinRegistry 的 UID 和 **CurrencyKey\<T\>** 派生出该 Currency 的 UID，并作为共享对象发布。这样：

- 每种代币类型 `T` 在全局只有一个 `Currency<T>` 对象；
- 其地址由 `(CoinRegistry.id, CurrencyKey<T>)` 确定，索引器和前端可以稳定地按类型推算或查询。

你不需要自己实现该逻辑，但理解「派生对象 = 父 + 键 → 确定性 UID」有助于阅读框架中各类 Registry 的实现。

## 注意事项

1. **claim 不可逆**：一旦对某 (parent, key) 调用了 **claim**，该键就永远被视为已占用；即使之后用返回的 UID 创建的对象被删掉，**exists** 仍为 true，不能再次 claim 同一 key。
2. **键的类型与值都要一致**：链下或前端若想复现地址，键的类型和值必须与链上完全一致（例如都用 `String` 且内容相同）。
3. **父对象需可变**：只有 **claim** 需要 `&mut UID`；**derive_address** 和 **exists** 只需 `&UID` 或 `ID`。
4. **派生出的对象独立存在**：claim 返回的 UID 用于构造对象后，该对象与普通对象一样可以 transfer、share、freeze，不要求父对象同时存在或可访问（仅首次 claim 时需要父对象）。

## 小结

- **derived_object** 提供由 **(父 UID, Key)** 确定性地推导 **address/UID** 的能力，并保证同一键只能被 **claim** 一次。
- **derive_address** 只做计算；**claim** 占用键并返回 UID，用于在派生地址上创建对象；**exists** 查询键是否已被占用。
- 常用于**注册表**、**按类型或名称的命名空间**，以及需要**可预测 object ID** 的场景。
- 实现上依赖动态字段在父对象上记录「已占用的派生 ID」；派生出的对象之后可独立于父对象使用。


---


<!-- source: 08_programmability/dynamic-collections.md -->
## 10.10 Table / Bag / ObjectTable / ObjectBag

# 动态集合

Sui 框架在动态字段之上构建了一系列开箱即用的集合类型，包括 `Table`、`Bag`、`ObjectTable`、`ObjectBag` 和 `LinkedTable`。这些集合封装了底层动态字段的操作细节，提供了类似传统编程语言中 Map、Dictionary 等数据结构的使用体验。合理选择集合类型是编写高效 Move 合约的关键技能。

## Table — 同构键值映射

`Table<K, V>` 是一个**同构**的键值映射集合，所有键必须是同一类型 `K`，所有值必须是同一类型 `V`。它基于普通动态字段实现，内部会自动追踪元素数量。

### 核心 API

```move
use sui::table::{Self, Table};

// 创建
table::new<K, V>(ctx: &mut TxContext): Table<K, V>

// 增删改查
table::add<K, V>(table: &mut Table<K, V>, k: K, v: V)
table::remove<K, V>(table: &mut Table<K, V>, k: K): V
table::borrow<K, V>(table: &Table<K, V>, k: K): &V
table::borrow_mut<K, V>(table: &mut Table<K, V>, k: K): &mut V

// 查询
table::contains<K, V>(table: &Table<K, V>, k: K): bool
table::length<K, V>(table: &Table<K, V>): u64
table::is_empty<K, V>(table: &Table<K, V>): bool

// 销毁（仅当为空时）
table::destroy_empty<K, V>(table: Table<K, V>)
```

### 索引语法支持

`Table` 支持方括号索引语法，使代码更加简洁：

```move
// 以下两种写法等价
let val = table::borrow(&my_table, key);
let val = &my_table[key];

// 可变借用同样支持
let val_mut = table::borrow_mut(&mut my_table, key);
let val_mut = &mut my_table[key];
```

### 类型约束

- 键 `K`：`copy + drop + store`
- 值 `V`：`store`

## Bag — 异构键值映射

`Bag` 是一个**异构**的键值映射集合，不同的键值对可以拥有不同的类型。这使得 `Bag` 极其灵活，适合存储结构多样的数据。

### 核心 API

```move
use sui::bag::{Self, Bag};

// 创建
bag::new(ctx: &mut TxContext): Bag

// 增删改查（K/V 类型每次可以不同）
bag::add<K: copy + drop + store, V: store>(bag: &mut Bag, k: K, v: V)
bag::remove<K: copy + drop + store, V: store>(bag: &mut Bag, k: K): V
bag::borrow<K: copy + drop + store, V: store>(bag: &Bag, k: K): &V
bag::borrow_mut<K: copy + drop + store, V: store>(bag: &mut Bag, k: K): &mut V

// 查询
bag::contains<K: copy + drop + store>(bag: &Bag, k: K): bool
bag::length(bag: &Bag): u64
bag::is_empty(bag: &Bag): bool
```

### 异构存储示例

`Bag` 允许在同一个集合中存储不同类型的值：

```move
bag::add(&mut my_bag, b"name", b"Alice");       // vector<u8>
bag::add(&mut my_bag, b"score", 100u64);         // u64
bag::add(&mut my_bag, b"active", true);          // bool
```

但读取时必须指定正确的类型，否则会在运行时报错：

```move
let name: &vector<u8> = bag::borrow(&my_bag, b"name");
let score: &u64 = bag::borrow(&my_bag, b"score");
```

## ObjectTable — 对象级同构映射

`ObjectTable<K, V>` 与 `Table` 类似，但基于**动态对象字段**实现。其核心区别在于：

- 值 `V` 必须具有 `key + store` 能力（必须是对象）
- 存储的对象保持独立身份，可被链下索引器发现
- 每次访问需要加载两个底层对象，成本更高

API 与 `Table` 完全一致，只是类型约束更严格：

```move
use sui::object_table::{Self, ObjectTable};

// 值必须是对象（key + store）
object_table::add<K, V: key + store>(table: &mut ObjectTable<K, V>, k: K, v: V)
```

## ObjectBag — 对象级异构映射

`ObjectBag` 与 `Bag` 的关系类似 `ObjectTable` 与 `Table` 的关系：

- 基于动态对象字段实现
- 值必须具有 `key + store` 能力
- 保留子对象的链下可发现性
- 成本更高

```move
use sui::object_bag::{Self, ObjectBag};
```

## LinkedTable — 有序链表映射

`LinkedTable<K, V>` 是一个维护插入顺序的键值映射，内部通过双向链表实现。它是唯一支持有序遍历的集合类型。

### 核心 API

```move
use sui::linked_table::{Self, LinkedTable};

// 创建
linked_table::new<K, V>(ctx: &mut TxContext): LinkedTable<K, V>

// 头尾操作
linked_table::push_front<K, V>(table: &mut LinkedTable<K, V>, k: K, v: V)
linked_table::push_back<K, V>(table: &mut LinkedTable<K, V>, k: K, v: V)
linked_table::pop_front<K, V>(table: &mut LinkedTable<K, V>): (K, V)
linked_table::pop_back<K, V>(table: &mut LinkedTable<K, V>): (K, V)

// 头尾查询
linked_table::front<K, V>(table: &LinkedTable<K, V>): &Option<K>
linked_table::back<K, V>(table: &LinkedTable<K, V>): &Option<K>

// 前后节点导航
linked_table::prev<K, V>(table: &LinkedTable<K, V>, k: K): &Option<K>
linked_table::next<K, V>(table: &LinkedTable<K, V>, k: K): &Option<K>

// 标准操作
linked_table::remove<K, V>(table: &mut LinkedTable<K, V>, k: K): V
linked_table::borrow<K, V>(table: &LinkedTable<K, V>, k: K): &V
linked_table::borrow_mut<K, V>(table: &mut LinkedTable<K, V>, k: K): &mut V
linked_table::contains<K, V>(table: &LinkedTable<K, V>, k: K): bool
linked_table::length<K, V>(table: &LinkedTable<K, V>): u64
linked_table::is_empty<K, V>(table: &LinkedTable<K, V>): bool
```

### LinkedTable 遍历示例

```move
public fun sum_all_values(table: &LinkedTable<u64, u64>): u64 {
    let mut sum = 0u64;
    let mut current = *linked_table::front(table);
    while (option::is_some(&current)) {
        let key = *option::borrow(&current);
        sum = sum + *linked_table::borrow(table, key);
        current = *linked_table::next(table, key);
    };
    sum
}
```

## 完整代码示例

### 用户注册系统（Table）

```move
module examples::collections;

use sui::table::{Self, Table};
use sui::bag::{Self, Bag};

public struct UserRegistry has key {
    id: UID,
    users: Table<address, vector<u8>>,
    count: u64,
}

public struct GameInventory has key {
    id: UID,
    items: Bag,
}

public fun create_registry(ctx: &mut TxContext): UserRegistry {
    UserRegistry {
        id: object::new(ctx),
        users: table::new(ctx),
        count: 0,
    }
}

public fun register(registry: &mut UserRegistry, name: vector<u8>, ctx: &TxContext) {
    let sender = ctx.sender();
    table::add(&mut registry.users, sender, name);
    registry.count = registry.count + 1;
}

public fun name(registry: &UserRegistry, addr: address): &vector<u8> {
    &registry.users[addr]
}

public fun create_inventory(ctx: &mut TxContext): GameInventory {
    GameInventory {
        id: object::new(ctx),
        items: bag::new(ctx),
    }
}

public fun add_item<V: store>(inventory: &mut GameInventory, key: vector<u8>, item: V) {
    bag::add(&mut inventory.items, key, item);
}

public fun item<V: store>(inventory: &GameInventory, key: vector<u8>): &V {
    bag::borrow(&inventory.items, key)
}
```

### 排行榜系统（LinkedTable）

```move
module examples::leaderboard;

use sui::linked_table::{Self, LinkedTable};

public struct Leaderboard has key {
    id: UID,
    scores: LinkedTable<address, u64>,
}

public fun create(ctx: &mut TxContext) {
    let board = Leaderboard {
        id: object::new(ctx),
        scores: linked_table::new(ctx),
    };
    transfer::share_object(board);
}

public fun submit_score(board: &mut Leaderboard, score: u64, ctx: &TxContext) {
    let player = ctx.sender();
    if (linked_table::contains(&board.scores, player)) {
        let current = linked_table::borrow_mut(&mut board.scores, player);
        if (score > *current) {
            *current = score;
        };
    } else {
        linked_table::push_back(&mut board.scores, player, score);
    };
}

public fun get_top_player(board: &Leaderboard): (address, u64) {
    let mut best_addr = @0x0;
    let mut best_score = 0u64;
    let mut current = *linked_table::front(&board.scores);
    while (option::is_some(&current)) {
        let addr = *option::borrow(&current);
        let score = *linked_table::borrow(&board.scores, addr);
        if (score > best_score) {
            best_score = score;
            best_addr = addr;
        };
        current = *linked_table::next(&board.scores, addr);
    };
    (best_addr, best_score)
}
```

## 集合类型选择指南

选择合适的集合类型是设计 Move 合约的重要决策。以下是选择建议：

| 需求 | 推荐类型 |
|------|---------|
| 固定类型的键值对，不需要链下发现值 | `Table` |
| 固定类型的键值对，值需要链下可发现 | `ObjectTable` |
| 不同类型的键值对（灵活结构） | `Bag` |
| 不同类型的对象，需要链下可发现 | `ObjectBag` |
| 需要维护插入顺序或遍历 | `LinkedTable` |

### 关键决策因素

1. **类型一致性**：如果所有键值对类型相同，使用 `Table`/`ObjectTable`；否则使用 `Bag`/`ObjectBag`
2. **链下可发现性**：如果值需要通过 ID 被链下查询，使用 `Object-` 前缀的变体
3. **有序性**：如果需要遍历或维护顺序，使用 `LinkedTable`
4. **Gas 成本**：`Object-` 变体每次访问的成本更高（加载两个对象），在不需要可发现性时避免使用

### 注意事项

- 所有集合类型都具有 `key + store` 能力，可以作为对象字段或独立对象使用
- 集合拥有 `drop` 能力的前提是内部为空——非空集合不能被丢弃
- `destroy_empty` 仅在集合为空时可以调用，否则会报错
- 非空集合在模块升级或对象删除时需要先清空

## 小结

Sui 提供的五种集合类型覆盖了链上数据存储的常见需求：

- **Table**：同构、高效、适合已知类型的映射场景
- **Bag**：异构、灵活、适合结构不固定的存储场景
- **ObjectTable / ObjectBag**：基于动态对象字段，保留子对象的链下可发现性，代价是更高的 Gas 消耗
- **LinkedTable**：唯一支持有序遍历的集合，适合排行榜、队列等需要顺序的场景

所有集合都支持 `add`、`remove`、`borrow`、`borrow_mut`、`contains`、`length`、`is_empty` 等标准操作，且 `Table` 和 `Bag` 支持方括号索引语法。根据实际需求在类型安全性、灵活性、可发现性和性能之间做出权衡，选择最合适的集合类型。


---


<!-- source: 08_programmability/balance-and-coin.md -->
## 10.11 Balance 与 Coin

# Balance 与 Coin

`Balance<T>` 和 `Coin<T>` 是 Sui 代币经济体系的两大基石。`Balance<T>` 是一个轻量级的数值余额表示，而 `Coin<T>` 则是将 `Balance<T>` 包装为可独立流转的对象。理解这两者的关系及其配套的 `Supply<T>` 和 `TreasuryCap<T>` 机制，是构建任何涉及代币逻辑的 Sui 应用的基础。

## Balance — 原始数值余额

### 定义与能力

`Balance<T>` 定义在 `sui::balance` 模块中，其结构非常简单：

```move
public struct Balance<phantom T> has store {
    value: u64,
}
```

关键特征：

- **只有 `store` 能力**，没有 `key`——它不是一个独立对象，不能直接拥有对象 ID
- 使用 `phantom` 类型参数 `T` 来区分不同代币（如 `Balance<SUI>`、`Balance<USDC>` 等）
- 轻量级，适合作为其他对象的内部字段

### Balance 核心操作

```move
use sui::balance;

// 创建零余额
balance::zero<T>(): Balance<T>

// 查询余额值
balance::value<T>(balance: &Balance<T>): u64

// 合并两个余额（将 other 合并到 self 中）
balance::join<T>(self: &mut Balance<T>, other: Balance<T>): u64

// 拆分指定金额
balance::split<T>(self: &mut Balance<T>, amount: u64): Balance<T>

// 销毁零余额
balance::destroy_zero<T>(balance: Balance<T>)
```

`Balance` 不能凭空创建非零值——只能通过铸币（`Supply`）或从已有余额拆分得到。这是 Sui 代币安全模型的核心保证。

## Coin — 余额的对象包装

### 定义与能力

`Coin<T>` 定义在 `sui::coin` 模块中：

```move
public struct Coin<phantom T> has key, store {
    id: UID,
    balance: Balance<T>,
}
```

关键特征：

- 拥有 `key + store` 能力——它是一个独立的 Sui 对象
- 内部包含一个 `Balance<T>` 字段
- 可以被转移、共享、冻结等
- 在交易中作为输入/输出对象使用

### Coin 核心操作

```move
use sui::coin;

// 查询 Coin 中的余额值
coin::value<T>(coin: &Coin<T>): u64

// Coin → Balance 转换（消耗 Coin）
coin::into_balance<T>(coin: Coin<T>): Balance<T>

// Balance → Coin 转换（需要 TxContext 创建新对象）
coin::from_balance<T>(balance: Balance<T>, ctx: &mut TxContext): Coin<T>

// 创建零值 Coin
coin::zero<T>(ctx: &mut TxContext): Coin<T>

// 拆分 Coin
coin::split<T>(coin: &mut Coin<T>, amount: u64, ctx: &mut TxContext): Coin<T>

// 合并 Coin
coin::join<T>(self: &mut Coin<T>, other: Coin<T>)

// 销毁零值 Coin
coin::destroy_zero<T>(coin: Coin<T>)
```

### Coin 与 Balance 的转换

两者可以自由互转：

- `coin::into_balance(coin)` 将 `Coin` 解包为 `Balance`（销毁 Coin 对象）
- `coin::from_balance(balance, ctx)` 将 `Balance` 包装为新的 `Coin` 对象

这种转换是无损的，不会丢失任何代币价值。

## Supply 与 TreasuryCap — 代币铸造体系

### Supply

`Supply<T>` 记录了某种代币的总供应量，是铸币和销毁的底层机制：

```move
public struct Supply<phantom T> has store {
    value: u64,
}
```

### TreasuryCap

`TreasuryCap<T>` 是铸币权限的凭证，内部包含 `Supply<T>`：

```move
public struct TreasuryCap<phantom T> has key, store {
    id: UID,
    total_supply: Supply<T>,
}
```

持有 `TreasuryCap` 的地址拥有铸造和销毁该代币的权限。

## 创建新代币

`coin::create_currency` 已废弃，应使用 **`coin_registry::new_currency_with_otw`** 配合 **`coin_registry::finalize`** 创建新代币。一次性见证（OTW）确保每种代币只能被创建一次；元数据会注册到链上 `CoinRegistry`，并返回 `MetadataCap` 用于后续更新。

```move
module examples::my_coin;

use std::string;
use sui::coin::{Self, TreasuryCap, Coin};
use sui::coin_registry;
use sui::balance::{Self, Balance};

public struct MY_COIN has drop {}

fun init(witness: MY_COIN, ctx: &mut TxContext) {
    let (initializer, treasury_cap) = coin_registry::new_currency_with_otw<MY_COIN>(
        witness,
        9,                              // decimals
        string::utf8(b"MYC"),           // symbol
        string::utf8(b"My Coin"),       // name
        string::utf8(b"An example coin"), // description
        string::utf8(b""),               // icon_url（空表示无图标）
        ctx,
    );
    let metadata_cap = coin_registry::finalize(initializer, ctx);
    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(metadata_cap, ctx.sender());
}

public fun mint(
    treasury_cap: &mut TreasuryCap<MY_COIN>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let coin = coin::mint(treasury_cap, amount, ctx);
    transfer::public_transfer(coin, recipient);
}

public fun burn(
    treasury_cap: &mut TreasuryCap<MY_COIN>,
    coin: Coin<MY_COIN>,
) {
    coin::burn(treasury_cap, coin);
}
```

### new_currency_with_otw 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `otw` | `T` | 一次性见证，确保唯一性 |
| `decimals` | `u8` | 小数位数（如 9 表示最小单位是十亿分之一） |
| `symbol` | `String` | 代币符号（如 `string::utf8(b"SUI")`） |
| `name` | `String` | 代币全名 |
| `description` | `String` | 代币描述 |
| `icon_url` | `String` | 图标 URL，无图标可传 `string::utf8(b"")` |
| `ctx` | `&mut TxContext` | 交易上下文 |

返回 `(CurrencyInitializer<T>, TreasuryCap<T>)`；再调用 **`coin_registry::finalize(initializer, ctx)`** 得到 **`MetadataCap<T>`**。代币元数据存储在链上 `CoinRegistry` 的 `Currency<T>` 中，可通过 `MetadataCap` 使用 `coin_registry::set_name` 等更新。

## 铸造与销毁

### 铸币流程

```move
// 方式 1：直接铸造为 Coin 对象
let coin = coin::mint(treasury_cap, amount, ctx);

// 方式 2：铸造为 Balance（不创建对象）
let balance = coin::mint_balance(treasury_cap, amount);
```

`mint_balance` 返回 `Balance<T>` 而不是 `Coin<T>`，适用于不需要立即创建独立对象的场景（如存入金库）。

### 销毁流程

```move
// 销毁 Coin，减少总供应量
coin::burn(treasury_cap, coin);
```

销毁操作会将代币从流通中永久移除，并相应减少 `Supply` 中记录的总供应量。

## 拆分与合并

### 拆分 Coin

```move
// 从一个 Coin 中拆出指定金额，创建新的 Coin
let new_coin = coin::split(&mut original_coin, 100, ctx);
```

### 合并 Coin

```move
// 将 other_coin 合并到 main_coin 中（other_coin 被消耗）
coin::join(&mut main_coin, other_coin);
```

## 实战：金库合约

以下示例展示了如何使用 `Balance` 构建一个共享金库，支持存入和提取 SUI 代币：

```move
module examples::vault;

use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::sui::SUI;

public struct Vault has key {
    id: UID,
    balance: Balance<SUI>,
}

public fun create(ctx: &mut TxContext) {
    let vault = Vault {
        id: object::new(ctx),
        balance: balance::zero(),
    };
    transfer::share_object(vault);
}

public fun deposit(vault: &mut Vault, coin: Coin<SUI>) {
    let coin_balance = coin::into_balance(coin);
    balance::join(&mut vault.balance, coin_balance);
}

public fun withdraw(
    vault: &mut Vault,
    amount: u64,
    ctx: &mut TxContext,
): Coin<SUI> {
    let withdrawn = balance::split(&mut vault.balance, amount);
    coin::from_balance(withdrawn, ctx)
}

public fun balance(vault: &Vault): u64 {
    balance::value(&vault.balance)
}
```

### 设计要点

在金库合约中，我们使用 `Balance<SUI>` 而不是 `Coin<SUI>` 作为内部存储，原因是：

1. **`Balance` 更轻量**：没有对象开销，不需要 UID
2. **合并更高效**：`balance::join` 直接修改数值，不涉及对象操作
3. **灵活性**：可以精确拆分任意金额，而不受限于已有 Coin 的面值

外部接口接受 `Coin<SUI>` 参数（因为用户持有的是 Coin 对象），内部通过 `into_balance` 转换后存储，提取时通过 `from_balance` 转回 `Coin` 返回给用户。

## Balance 与 Coin 的选择策略

| 场景 | 推荐类型 | 原因 |
|------|---------|------|
| 对象内部存储代币余额 | `Balance<T>` | 轻量、无对象开销 |
| 用户持有和转移代币 | `Coin<T>` | 是对象，可转移和交易 |
| 函数参数接收代币 | `Coin<T>` | 用户钱包中持有的是 Coin |
| 函数返回代币给用户 | `Coin<T>` | 需要对象才能被接收 |
| DeFi 协议内部记账 | `Balance<T>` | 高效合并和拆分 |

## 小结

`Balance` 和 `Coin` 构成了 Sui 代币系统的双层架构：

- **Balance<T>**：轻量级数值余额，只有 `store` 能力，适合作为对象内部字段进行高效代币管理
- **Coin<T>**：Balance 的对象包装，拥有 `key + store` 能力，是用户可见和可交互的代币形式
- **TreasuryCap<T>**：铸币权限凭证，通过一次性见证模式确保每种代币只能创建一次
- 铸造通过 `coin::mint` 或 `coin::mint_balance` 完成，销毁通过 `coin::burn` 完成
- Coin 支持 `split`（拆分）和 `join`（合并）操作
- 两者可通过 `into_balance` 和 `from_balance` 自由互转
- 合约内部通常使用 `Balance` 存储，外部接口使用 `Coin` 交互


---


<!-- source: 08_programmability/bcs.md -->
## 10.12 BCS 序列化

# BCS 序列化

BCS（Binary Canonical Serialization）是 Move 生态系统中使用的标准二进制序列化格式，最初由 Diem（前 Libra）项目设计。它提供了一种确定性的、紧凑的二进制编码方式，用于在链上进行数据的序列化和反序列化。Sui 在 `sui::bcs` 模块中提供了完整的 BCS 编解码支持，使得智能合约可以处理跨模块、跨链的数据交换。

## BCS 格式概述

### 核心设计原则

BCS 格式遵循以下设计原则：

1. **确定性**：相同的数据结构始终编码为完全相同的字节序列，保证了共识安全性
2. **紧凑性**：使用最少的字节来表示数据，减少链上存储成本
3. **非自描述性**：编码结果中不包含类型信息，解码时必须提前知道数据的类型布局

### 编码规则

| 类型 | 编码方式 |
|------|---------|
| `bool` | 1 字节：`0x00`（false）或 `0x01`（true） |
| `u8` | 1 字节，直接存储 |
| `u16` / `u32` / `u64` / `u128` / `u256` | 小端序（Little-Endian） |
| `address` | 32 字节，直接存储 |
| `vector<T>` | ULEB128 编码的长度 + 每个元素的 BCS 编码 |
| `Option<T>` | 编码为 `vector<T>`（None = 空向量，Some(v) = 单元素向量） |
| `struct` | 各字段按声明顺序依次编码（无字段名、无分隔符） |
| `enum` | ULEB128 变体索引 + 变体数据的 BCS 编码 |

### ULEB128 编码

ULEB128（Unsigned Little-Endian Base 128）是一种变长整数编码，用于表示向量长度等可变大小的值。短长度（0-127）仅需 1 字节，长度越大使用的字节越多。

## 编码：bcs::to_bytes

`bcs::to_bytes` 将任何具有 `drop` 能力的值序列化为字节向量：

```move
use sui::bcs;

let value: u64 = 1000;
let bytes: vector<u8> = bcs::to_bytes(&value);
```

任何 Move 值——基本类型、结构体、向量等——只要具有适当的能力，都可以被 BCS 编码。

## 解码：BCS 包装器与 peel 函数

BCS 解码使用 `BCS` 包装器结构体和一系列 `peel_*` 函数来逐字段提取数据：

### 创建 BCS 解码器

```move
let mut bcs = bcs::new(bytes);
```

### 基本类型解码

```move
let bool_val = bcs.peel_bool();
let u8_val = bcs.peel_u8();
let u16_val = bcs.peel_u16();
let u32_val = bcs.peel_u32();
let u64_val = bcs.peel_u64();
let u128_val = bcs.peel_u128();
let u256_val = bcs.peel_u256();
let addr = bcs.peel_address();
```

### 向量解码

```move
// 解码 vector<u8>（最常用）
let bytes = bcs.peel_vec_u8();

// 解码 vector<u64>
let numbers = bcs.peel_vec_u64();

// 解码 vector<address>
let addresses = bcs.peel_vec_address();

// 通用向量解码（使用 peel_vec! 宏）
let custom_vec = bcs.peel_vec!(|bcs| bcs.peel_u64());
```

### Option 解码

```move
// 解码 Option<u64>
let maybe_val = bcs.peel_option!(|bcs| bcs.peel_u64());
```

## 完整代码示例

### 玩家数据编解码

```move
module examples::bcs_demo;

use sui::bcs;

public struct PlayerData has drop {
    name: vector<u8>,
    score: u64,
    level: u8,
}

/// Encode data to BCS bytes
public fun encode_player(): vector<u8> {
    let player = PlayerData {
        name: b"Alice",
        score: 1000,
        level: 5,
    };
    bcs::to_bytes(&player)
}

/// Decode BCS bytes back to structured data
public fun decode_player(bytes: vector<u8>): (vector<u8>, u64, u8) {
    let mut bcs = bcs::new(bytes);
    let name = bcs.peel_vec_u8();
    let score = bcs.peel_u64();
    let level = bcs.peel_u8();
    (name, score, level)
}

/// Decode a vector of addresses
public fun decode_address_list(bytes: vector<u8>): vector<address> {
    let mut bcs = bcs::new(bytes);
    bcs.peel_vec!(|bcs| bcs.peel_address())
}
```

### 结构体逐字段解码

由于 BCS 不是自描述的，解码结构体时必须按照字段声明的**精确顺序**逐个提取每个字段：

```move
module examples::bcs_struct;

use sui::bcs;

public struct GameConfig has drop {
    max_players: u64,
    entry_fee: u64,
    reward_pool: u64,
    is_active: bool,
    admin: address,
}

public fun decode_config(bytes: vector<u8>): GameConfig {
    let mut bcs = bcs::new(bytes);
    GameConfig {
        max_players: bcs.peel_u64(),
        entry_fee: bcs.peel_u64(),
        reward_pool: bcs.peel_u64(),
        is_active: bcs.peel_bool(),
        admin: bcs.peel_address(),
    }
}
```

## 嵌套结构解码

对于包含嵌套向量和 Option 的复杂结构，需要组合使用多种 peel 函数：

```move
module examples::bcs_complex;

use sui::bcs;

public fun decode_complex(
    bytes: vector<u8>
): (vector<u8>, vector<u64>, Option<address>) {
    let mut bcs = bcs::new(bytes);

    let name = bcs.peel_vec_u8();

    let scores = bcs.peel_vec!(|bcs| bcs.peel_u64());

    let maybe_referee = bcs.peel_option!(|bcs| bcs.peel_address());

    (name, scores, maybe_referee)
}
```

## 链下参数构造

BCS 的一个重要应用场景是**链下构造参数**。前端或后端应用可以使用 BCS 将复杂数据结构编码为字节数组，然后作为 `vector<u8>` 参数传入链上函数。链上合约再使用 `peel_*` 函数解码。

典型工作流程：

1. **链下**：使用 JavaScript/Python/Rust 的 BCS 库将结构化数据编码为字节数组
2. **交易调用**：将字节数组作为 `vector<u8>` 参数传入 Move 函数
3. **链上**：使用 `bcs::new` 和 `peel_*` 函数解码字节数组，还原为结构化数据

```move
module examples::bcs_params;

use sui::bcs;

public fun process_batch_transfer(data: vector<u8>) {
    let mut bcs = bcs::new(data);
    let recipients = bcs.peel_vec!(|bcs| bcs.peel_address());
    let amounts = bcs.peel_vec!(|bcs| bcs.peel_u64());
    let count = vector::length(&recipients);
    assert_eq!(count, vector::length(&amounts));
    let mut i = 0;
    while (i < count) {
        let _recipient = *vector::borrow(&recipients, i);
        let _amount = *vector::borrow(&amounts, i);
        // 执行转账逻辑...
        i = i + 1;
    };
}
```

## 注意事项

### 字段顺序至关重要

BCS 编码不包含字段名，完全依赖于字段的声明顺序。如果编码方和解码方使用的字段顺序不一致，将导致数据损坏或运行时错误。

### 不支持跳过字段

BCS 解码器必须按顺序读取所有字段。不能跳过中间字段只读取后面的字段——必须从头依次 peel。

### 剩余字节

解码完成后，如果 BCS 缓冲区中仍有未读取的字节，可以使用 `bcs.into_remainder_bytes()` 获取剩余字节。这在处理变长数据时非常有用。

## 小结

BCS 是 Sui/Move 生态系统中数据序列化的标准格式，核心要点包括：

- 采用确定性的二进制编码，使用小端序和 ULEB128 变长整数
- 非自描述格式——解码时必须知道数据的完整类型布局
- 编码使用 `bcs::to_bytes(&value)` 一步完成
- 解码使用 `bcs::new(bytes)` 创建解码器，然后通过 `peel_*` 系列函数逐字段提取
- 向量使用 `peel_vec!` 宏解码，Option 使用 `peel_option!` 宏解码
- 结构体按字段声明顺序逐个解码，顺序不可更改
- 常用于链下构造链上参数的场景，前端通过 BCS 编码复杂参数传递给 Move 合约


---


<!-- source: 08_programmability/cryptography-and-hashing.md -->
## 10.13 密码学与哈希

# 密码学与哈希

密码学原语是区块链安全的基石。Sui 在 Move 标准库和框架中提供了丰富的密码学工具，包括多种哈希函数和数字签名验证算法。这些工具使得智能合约可以在链上执行内容完整性校验、承诺-揭示方案、签名验证等常见密码学操作，为构建安全可靠的去中心化应用提供底层保障。

## 哈希函数

### 概述

哈希函数将任意长度的输入数据映射为固定长度的输出（哈希值/摘要），具有以下核心性质：

- **确定性**：相同输入始终产生相同输出
- **不可逆性**：无法从哈希值反推出原始数据
- **雪崩效应**：输入的微小变化会导致输出的巨大变化
- **抗碰撞性**：极难找到两个不同的输入产生相同的输出

### sui::hash 模块

`sui::hash` 模块提供了四种主流哈希函数，全部返回 256 位（32 字节）的哈希值：

| 函数 | 算法 | 输出长度 | 典型用途 |
|------|------|---------|---------|
| `sha2_256` | SHA-2 256 | 32 字节 | 通用哈希、与比特币兼容 |
| `sha3_256` | SHA-3 256 | 32 字节 | 通用哈希、与以太坊兼容 |
| `blake2b256` | BLAKE2b-256 | 32 字节 | 高性能哈希 |
| `keccak256` | Keccak-256 | 32 字节 | 以太坊签名兼容 |

### 基本用法

```move
module examples::crypto_demo;

use sui::hash;

/// Hash data using SHA2-256
public fun hash_sha2(data: &vector<u8>): vector<u8> {
    hash::sha2_256(*data)
}

/// Hash data using SHA3-256
public fun hash_sha3(data: &vector<u8>): vector<u8> {
    hash::sha3_256(*data)
}

/// Hash data using Blake2b-256
public fun hash_blake2b(data: &vector<u8>): vector<u8> {
    hash::blake2b256(*data)
}

/// Verify content integrity
public fun verify_content(
    content: vector<u8>,
    expected_hash: vector<u8>,
): bool {
    let actual_hash = hash::sha3_256(content);
    actual_hash == expected_hash
}
```

### 哈希函数选择建议

- **SHA2-256**：最广泛使用的哈希算法，与比特币生态兼容
- **SHA3-256**：SHA-2 的后继者，安全边际更高，与部分以太坊操作兼容
- **BLAKE2b-256**：速度最快的通用哈希函数，适合性能敏感场景
- **Keccak-256**：以太坊的核心哈希算法，在需要与以太坊互操作时使用

## 应用场景：承诺-揭示方案

承诺-揭示（Commit-Reveal）是密码学中经典的两阶段协议，广泛用于链上投票、拍卖、随机数生成等场景。其基本流程：

1. **承诺阶段**：参与者提交数据的哈希值（承诺），不暴露原始数据
2. **揭示阶段**：参与者公开原始数据，合约验证其与承诺的一致性

```move
module examples::commit_reveal;

use sui::hash;

public struct Commitment has key {
    id: UID,
    hash: vector<u8>,
    revealed: bool,
}

public fun commit(data_hash: vector<u8>, ctx: &mut TxContext) {
    let commitment = Commitment {
        id: object::new(ctx),
        hash: data_hash,
        revealed: false,
    };
    transfer::transfer(commitment, ctx.sender());
}

public fun reveal(commitment: &mut Commitment, data: vector<u8>) {
    let hash = hash::sha3_256(data);
    assert!(hash == commitment.hash, 0);
    commitment.revealed = true;
}
```

### 增强的承诺方案

为防止彩虹表攻击（当数据空间较小时，攻击者可预计算所有可能值的哈希），可以在承诺中加入随机盐值（salt）：

```move
module examples::salted_commit;

use sui::hash;

public struct SaltedCommitment has key {
    id: UID,
    hash: vector<u8>,
    revealed: bool,
}

public fun commit_with_salt(
    salted_hash: vector<u8>,
    ctx: &mut TxContext,
) {
    let commitment = SaltedCommitment {
        id: object::new(ctx),
        hash: salted_hash,
        revealed: false,
    };
    transfer::transfer(commitment, ctx.sender());
}

public fun reveal_with_salt(
    commitment: &mut SaltedCommitment,
    data: vector<u8>,
    salt: vector<u8>,
) {
    let mut combined = data;
    vector::append(&mut combined, salt);
    let hash = hash::sha3_256(combined);
    assert!(hash == commitment.hash, 0);
    commitment.revealed = true;
}
```

用户在链下将 `data + salt` 拼接后计算哈希并提交承诺。揭示时同时提供原始数据和盐值，合约重新计算哈希并验证。

## 数字签名验证

### Ed25519 签名

Ed25519 是一种基于 Edwards 曲线的高性能数字签名算法，Sui 在 `sui::ed25519` 模块中提供了验证支持：

```move
use sui::ed25519;

/// 验证 Ed25519 签名
/// signature: 64 字节签名
/// public_key: 32 字节公钥
/// msg: 被签名的原始消息
public fun ed25519_verify(
    signature: &vector<u8>,
    public_key: &vector<u8>,
    msg: &vector<u8>,
): bool;
```

典型应用场景：

- 验证链下服务器签发的授权凭证
- 跨链消息验证
- Oracle 数据源签名验证

### ECDSA 签名

Sui 还支持两种 ECDSA 曲线的签名验证：

#### secp256k1（比特币/以太坊使用的曲线）

```move
use sui::ecdsa_k1;

/// 验证 secp256k1 签名并恢复公钥
public fun secp256k1_ecrecover(
    signature: &vector<u8>,  // 65 字节（含恢复标志）
    msg: &vector<u8>,        // 32 字节哈希
    hash: u8,                // 0 = keccak256, 1 = sha256
): vector<u8>;               // 返回 33 字节压缩公钥

/// 直接验证
public fun secp256k1_verify(
    signature: &vector<u8>,
    public_key: &vector<u8>,
    msg: &vector<u8>,
    hash: u8,
): bool;
```

#### secp256r1（NIST P-256，WebAuthn 使用的曲线）

```move
use sui::ecdsa_r1;

public fun secp256r1_ecrecover(
    signature: &vector<u8>,
    msg: &vector<u8>,
    hash: u8,               // 0 = keccak256, 1 = sha256
): vector<u8>;

public fun secp256r1_verify(
    signature: &vector<u8>,
    public_key: &vector<u8>,
    msg: &vector<u8>,
    hash: u8,
): bool;
```

## 实战：签名授权验证

以下示例展示了如何使用 Ed25519 签名验证来实现链下授权机制：

```move
module examples::auth;

use sui::ed25519;
use sui::hash;
use sui::bcs;

public struct AuthConfig has key {
    id: UID,
    authorized_signer: vector<u8>,
}

public fun create_config(
    signer_pubkey: vector<u8>,
    ctx: &mut TxContext,
) {
    let config = AuthConfig {
        id: object::new(ctx),
        authorized_signer: signer_pubkey,
    };
    transfer::share_object(config);
}

public fun execute_with_auth(
    config: &AuthConfig,
    action: vector<u8>,
    signature: vector<u8>,
) {
    let is_valid = ed25519::ed25519_verify(
        &signature,
        &config.authorized_signer,
        &action,
    );
    assert!(is_valid, 0);
    // 签名有效，执行授权操作...
}
```

## 实战：内容哈希注册表

利用哈希函数构建一个内容完整性验证系统：

```move
module examples::content_registry;

use sui::hash;
use sui::table::{Self, Table};

public struct Registry has key {
    id: UID,
    entries: Table<vector<u8>, address>,
}

public fun create(ctx: &mut TxContext) {
    let registry = Registry {
        id: object::new(ctx),
        entries: table::new(ctx),
    };
    transfer::share_object(registry);
}

public fun register_content(
    registry: &mut Registry,
    content: vector<u8>,
    ctx: &TxContext,
) {
    let hash = hash::sha3_256(content);
    assert!(!table::contains(&registry.entries, hash), 0);
    table::add(&mut registry.entries, hash, ctx.sender());
}

public fun verify_ownership(
    registry: &Registry,
    content: vector<u8>,
    claimed_owner: address,
): bool {
    let hash = hash::sha3_256(content);
    if (!table::contains(&registry.entries, hash)) {
        return false
    };
    *table::borrow(&registry.entries, hash) == claimed_owner
}
```

## 安全注意事项

1. **不要用哈希生成随机数**：哈希函数是确定性的，仅用已知的链上数据（如区块号、时间戳）作为输入无法生成安全的随机数。应使用 `sui::random` 模块
2. **选择合适的哈希函数**：跨链互操作时必须使用目标链相同的哈希算法（如以太坊使用 Keccak-256）
3. **签名消息格式**：验证签名时，链上和链下必须使用完全相同的消息格式和序列化方式
4. **防止重放攻击**：签名验证应包含唯一标识（如 nonce 或时间戳），防止同一签名被重复使用

## 小结

Sui 提供了全面的密码学工具链，核心要点包括：

- **哈希函数**：`sui::hash` 模块支持 SHA2-256、SHA3-256、BLAKE2b-256 和 Keccak-256 四种算法，均返回 32 字节摘要
- **常见应用**：内容完整性校验、承诺-揭示方案、数据指纹生成
- **Ed25519 签名验证**：通过 `sui::ed25519` 模块进行高性能签名验证
- **ECDSA 签名验证**：支持 secp256k1（比特币/以太坊兼容）和 secp256r1（WebAuthn 兼容）两种曲线
- 承诺-揭示方案应加入盐值防止彩虹表攻击
- 签名验证需注意消息格式一致性和重放攻击防护


---


<!-- source: 08_programmability/randomness.md -->
## 10.14 链上随机数

# 链上随机数

安全的随机数生成是区块链上最具挑战性的问题之一。传统方法（如使用区块哈希或时间戳）容易被验证者操纵，存在严重的安全隐患。Sui 通过内置的 `Random` 共享对象和 `RandomGenerator` 机制，提供了一套经过密码学验证的链上随机数生成方案。本章将详细介绍如何在 Move 合约中安全地使用随机数。

## Random 共享对象

### 系统预置对象

Sui 在创世时预置了一个 `Random` 共享对象，地址固定为 `0x8`。该对象由系统维护，每个 epoch 更新随机种子。所有需要随机数的交易都通过引用这个对象来获取随机性。

```move
// Random 对象的地址常量
// 0x0000000000000000000000000000000000000000000000000000000000000008
```

### 安全保证

Sui 的随机数机制提供以下安全保证：

1. **不可预测性**：在交易执行之前，没有人（包括验证者）能预测将生成的随机数
2. **不可偏倚性**：任何单一参与者无法影响随机数的分布
3. **确定性重放**：给定相同的交易和种子，随机数生成过程可以确定性重放（用于共识验证）

## RandomGenerator — 随机数生成器

### 创建生成器

每次需要随机数时，首先从 `Random` 对象创建一个 `RandomGenerator`：

```move
use sui::random::{Self, Random, RandomGenerator};

entry fun my_random_function(random: &Random, ctx: &mut TxContext) {
    let mut generator = random::new_generator(random, ctx);
    // 使用 generator 生成随机数...
}
```

`RandomGenerator` 绑定到当前交易上下文，确保同一交易中的多次随机数生成是独立且不可预测的。

### 生成整数随机数

`RandomGenerator` 提供了丰富的整数随机数生成函数：

```move
// 全范围随机数
let val_u8: u8 = random::generate_u8(&mut generator);
let val_u16: u16 = random::generate_u16(&mut generator);
let val_u32: u32 = random::generate_u32(&mut generator);
let val_u64: u64 = random::generate_u64(&mut generator);
let val_u128: u128 = random::generate_u128(&mut generator);
let val_u256: u256 = random::generate_u256(&mut generator);

// 范围内随机数（包含两端）
let in_range: u8 = random::generate_u8_in_range(&mut generator, 1, 100);
let in_range: u64 = random::generate_u64_in_range(&mut generator, 0, 999);
```

### 生成随机字节

```move
// 生成指定长度的随机字节向量
let random_bytes: vector<u8> = random::generate_bytes(&mut generator, 32);
```

### 随机打乱向量

```move
// 原地随机打乱向量元素顺序（Fisher-Yates 洗牌算法）
let mut items = vector[1, 2, 3, 4, 5];
random::shuffle(&mut generator, &mut items);
```

### 生成布尔值

```move
let coin_flip: bool = random::generate_bool(&mut generator);
```

## 安全要求：entry 函数

### 为什么必须使用 entry 函数

使用随机数的函数**必须声明为 `entry`** 而不是 `public`。这是 Sui 随机数安全模型的关键约束。

```move
// 正确：使用 entry
entry fun draw_winner(random: &Random, ctx: &mut TxContext) { ... }

// 危险：使用 public 会带来安全风险
public fun draw_winner(random: &Random, ctx: &mut TxContext) { ... }
```

原因分析：

如果使用随机数的函数是 `public` 的，攻击者可以在 PTB（Programmable Transaction Block）中组合调用：

1. 调用随机函数获取结果
2. 检查结果是否满足条件
3. 如果不满足，使整个交易中止（abort）

这样攻击者可以无成本地反复尝试，直到获得有利的随机结果。将函数声明为 `entry` 可以防止这种组合攻击，因为 `entry` 函数只能作为交易的入口点，不能被其他函数调用。

## 完整示例：抽奖系统

```move
module examples::lottery;

use sui::random::{Self, Random, RandomGenerator};

public struct Lottery has key {
    id: UID,
    participants: vector<address>,
    winner: Option<address>,
}

public fun create(ctx: &mut TxContext) {
    let lottery = Lottery {
        id: object::new(ctx),
        participants: vector::empty(),
        winner: option::none(),
    };
    transfer::share_object(lottery);
}

public fun join(lottery: &mut Lottery, ctx: &TxContext) {
    vector::push_back(&mut lottery.participants, ctx.sender());
}

/// Must be `entry` not `public` for randomness security
entry fun draw_winner(
    lottery: &mut Lottery,
    random: &Random,
    ctx: &mut TxContext,
) {
    assert!(vector::length(&lottery.participants) > 0, 0);
    let mut generator = random::new_generator(random, ctx);
    let len = vector::length(&lottery.participants);
    let idx = random::generate_u64_in_range(&mut generator, 0, len - 1);
    let winner = *vector::borrow(&lottery.participants, idx);
    lottery.winner = option::some(winner);
}
```

### 关键设计要点

1. `draw_winner` 声明为 `entry` 而非 `public`，防止组合攻击
2. `Random` 以不可变引用 `&Random` 传入，它是共享对象
3. 使用 `generate_u64_in_range` 在参与者索引范围内生成随机索引
4. 随机数在交易执行时才确定，任何人无法提前预测结果

## 完整示例：掷骰子

```move
module examples::dice;

use sui::random::{Self, Random};
use sui::event;

public struct DiceRolled has copy, drop {
    value: u8,
    player: address,
}

entry fun roll_dice(random: &Random, ctx: &mut TxContext) {
    let mut generator = random::new_generator(random, ctx);
    let value = random::generate_u8_in_range(&mut generator, 1, 6);
    event::emit(DiceRolled {
        value,
        player: ctx.sender(),
    });
}
```

这个示例展示了最简单的随机数使用场景。注意事项：

- 函数声明为 `entry`，确保安全性
- 使用 `generate_u8_in_range(1, 6)` 生成 1-6 的随机数（两端包含）
- 通过事件（Event）广播掷骰子的结果，方便链下应用监听

## 进阶示例：随机 NFT 属性

```move
module examples::random_nft;

use sui::random::{Self, Random};
use std::string::String;

public struct Monster has key, store {
    id: UID,
    name: String,
    attack: u64,
    defense: u64,
    speed: u64,
    rarity: u8,
}

entry fun mint_random_monster(
    name: String,
    random: &Random,
    ctx: &mut TxContext,
) {
    let mut gen = random::new_generator(random, ctx);

    let attack = random::generate_u64_in_range(&mut gen, 10, 100);
    let defense = random::generate_u64_in_range(&mut gen, 10, 100);
    let speed = random::generate_u64_in_range(&mut gen, 10, 100);

    // 稀有度：1-100 的随机数，越高越稀有
    let rarity_roll = random::generate_u8_in_range(&mut gen, 1, 100);
    let rarity = if (rarity_roll <= 50) {
        1 // 普通 (50%)
    } else if (rarity_roll <= 80) {
        2 // 稀有 (30%)
    } else if (rarity_roll <= 95) {
        3 // 史诗 (15%)
    } else {
        4 // 传说 (5%)
    };

    let monster = Monster {
        id: object::new(ctx),
        name,
        attack,
        defense,
        speed,
        rarity,
    };
    transfer::transfer(monster, ctx.sender());
}
```

## 常见陷阱与最佳实践

### 陷阱 1：在 public 函数中使用随机数

永远不要在 `public` 函数中使用 `Random`。攻击者可以利用 PTB 组合调用进行选择性中止攻击。

### 陷阱 2：先生成随机数再根据结果做可中止操作

```move
// 危险模式
entry fun bad_pattern(random: &Random, ctx: &mut TxContext) {
    let mut gen = random::new_generator(random, ctx);
    let result = random::generate_u64(&mut gen);
    // 不要在获取随机数后执行可能失败的外部调用
    // 因为这可能被利用来选择性中止交易
}
```

### 陷阱 3：重复使用 Generator

同一个 `RandomGenerator` 可以安全地生成多个随机数——每次调用都会更新内部状态。不需要为每个随机数创建新的生成器。

### 最佳实践

1. 使用随机数的函数始终声明为 `entry`
2. 在同一函数中只创建一个 `RandomGenerator`，多次使用即可
3. 随机数生成应当是函数中的最后一步操作之一，避免后续操作导致交易中止
4. 使用事件广播随机结果，方便链下应用获取

## 小结

Sui 的链上随机数机制提供了密码学安全的随机性保证，核心要点包括：

- **Random 对象**：系统预置的共享对象（地址 `0x8`），是所有随机数的来源
- **RandomGenerator**：通过 `random::new_generator(random, ctx)` 创建，绑定到当前交易
- **丰富的生成函数**：支持 `u8` 到 `u256` 的全范围和指定范围随机数，以及随机字节和向量打乱
- **安全约束**：使用随机数的函数必须声明为 `entry` 而非 `public`，防止 PTB 组合攻击
- **公平性保证**：随机种子在交易执行前不可知，任何参与者（包括验证者）无法预测或操纵结果
- 在实际应用中，随机数广泛用于抽奖、游戏、NFT 属性生成等需要公平随机性的场景


---


<!-- source: 09_patterns/index.md -->
## 第十一章 · 设计模式

# 第十一章 · 设计模式

本章汇总 Sui Move 开发中最重要的设计模式，这些模式是构建安全、可组合合约的基石。

## 本章内容

| 节 | 模式 | 核心思想 |
|---|------|---------|
| 9.1 | Capability | 用对象表示权限，持有即授权 |
| 9.2 | Witness | 用类型证明身份，泛型工厂 |
| 9.3 | 一次性见证（OTW） | 只能使用一次的类型证明 |
| 9.4 | Hot Potato | 必须在同一交易中消耗的值 |
| 9.5 | Wrapper | 包装 / 解包对象，权限封装 |
| 9.6 | Publisher | 证明包的发布者身份 |
| 9.7 | Object Display | 定义对象的链下展示规范（V1） |
| 9.8 | Display V2 与 Registry | V2 设计、V1/V2 对比、迁移与 API |
| 9.9 | 授权模式 | 各模式的选型指南与组合使用 |

## 学习目标

读完本章后，你将能够：

- 根据需求选择合适的权限控制模式
- 实现 Witness 和 OTW 模式的泛型工厂
- 使用 Hot Potato 模式强制执行业务流程


---


<!-- source: 09_patterns/capability.md -->
## 11.1 Capability 模式

# Capability 模式

Capability（能力）模式是 Move on Sui 中最常用的访问控制模式之一。它通过将权限具象化为一个**拥有的对象**，实现了类型安全、可转移、可撤销的授权机制。与传统的地址检查方式相比，Capability 模式更加灵活，也更符合 Move 的面向资源编程范式。

本章将深入讲解 Capability 模式的设计理念、实现方式、命名规范及最佳实践。

## 什么是 Capability

Capability 是一个被特定账户拥有的对象，它的存在本身就代表了一种权限。在函数签名中，通过要求调用者传入某个 Capability 类型的引用，即可实现访问控制——只有拥有该对象的账户才能成功调用该函数。

这种设计理念源自 **Capability-Based Security**（基于能力的安全模型），核心思想是：**持有凭证即拥有权限**，无需在运行时检查调用者身份。

### 与传统地址检查的对比

传统方式通常在合约中硬编码管理员地址：

```move
const ADMIN: address = @0xABC;
const ENotAdmin: u64 = 0;

public fun admin_only(ctx: &TxContext) {
    assert!(ctx.sender() == ADMIN, ENotAdmin);
    // 执行操作...
}
```

这种方式存在明显缺陷：

- **不可迁移**：管理员地址硬编码在合约中，无法转移权限
- **不可升级**：更换管理员需要升级合约
- **缺乏类型安全**：地址只是一个值，编译器无法区分不同权限

Capability 模式完美解决了这些问题。

## 命名规范

Sui 社区约定 Capability 类型以 **`Cap`** 后缀命名：

| 名称 | 用途 |
|------|------|
| `AdminCap` | 管理员权限 |
| `OwnerCap` | 所有者权限 |
| `MinterCap` | 铸造权限 |
| `BurnCap` | 销毁权限 |
| `TreasuryCap` | 国库/资金管理权限 |
| `UpgradeCap` | 升级权限 |

这种命名让开发者一眼就能识别权限类型，提高了代码的可读性和可发现性。

## 基本实现

### 在 init 函数中创建 Capability

Capability 通常在模块的 `init` 函数中创建，并转移给合约部署者：

```move
module examples::capability;

use std::string::String;

/// 管理员能力 - 在 init 中仅创建一次
public struct AdminCap has key { id: UID }

/// 铸造能力 - 可授予特定账户
public struct MinterCap has key { id: UID }

public struct NFT has key, store {
    id: UID,
    name: String,
    creator: address,
}

fun init(ctx: &mut TxContext) {
    transfer::transfer(
        AdminCap { id: object::new(ctx) },
        ctx.sender(),
    );
}
```

`AdminCap` 只有 `key` 能力，没有 `store`，这意味着它不能通过 `public_transfer` 被任意转移——只有本模块定义的函数可以控制其流转。这是一种有意的设计选择，防止管理员权限被意外转让。

### 使用 Capability 作为函数参数

通过引用传入 Capability 来实现权限控制：

```move
/// 只有管理员才能创建铸造能力
public fun create_minter(
    _: &AdminCap,
    recipient: address,
    ctx: &mut TxContext,
) {
    transfer::transfer(
        MinterCap { id: object::new(ctx) },
        recipient,
    );
}

/// 任何持有 MinterCap 的人都可以铸造 NFT
public fun mint(
    _: &MinterCap,
    name: String,
    recipient: address,
    ctx: &mut TxContext,
) {
    let nft = NFT {
        id: object::new(ctx),
        name,
        creator: ctx.sender(),
    };
    transfer::public_transfer(nft, recipient);
}

/// 管理员也可以直接铸造
public fun admin_mint(
    _: &AdminCap,
    name: String,
    recipient: address,
    ctx: &mut TxContext,
) {
    let nft = NFT {
        id: object::new(ctx),
        name,
        creator: ctx.sender(),
    };
    transfer::public_transfer(nft, recipient);
}
```

注意参数名使用了 `_`（下划线），表示我们不需要读取 Capability 的内容——它的存在本身就是授权证明。

## 撤销权限

Capability 模式的一大优势是权限可以被撤销。通过解构（destructure）Capability 对象来销毁它：

```move
/// 撤销铸造能力，通过销毁它
public fun revoke_minter(_: &AdminCap, cap: MinterCap) {
    let MinterCap { id } = cap;
    id.delete();
}
```

这要求管理员能够获取目标 `MinterCap` 对象。在实践中，这通常通过以下方式实现：

1. 持有者主动交还（将 cap 作为参数传入撤销函数）
2. 使用 `transfer::receive` 从对象地址接收

## 细粒度授权

通过定义多种 Capability 类型，可以实现精细的权限划分：

```move
module examples::fine_grained;

use std::string::String;

public struct AdminCap has key { id: UID }
public struct EditorCap has key { id: UID }
public struct ViewerCap has key { id: UID }

public struct Document has key, store {
    id: UID,
    title: String,
    content: String,
    published: bool,
}

fun init(ctx: &mut TxContext) {
    transfer::transfer(
        AdminCap { id: object::new(ctx) },
        ctx.sender(),
    );
}

/// 管理员可以授予编辑权限
public fun grant_editor(
    _: &AdminCap,
    recipient: address,
    ctx: &mut TxContext,
) {
    transfer::transfer(
        EditorCap { id: object::new(ctx) },
        recipient,
    );
}

/// 管理员可以授予查看权限
public fun grant_viewer(
    _: &AdminCap,
    recipient: address,
    ctx: &mut TxContext,
) {
    transfer::transfer(
        ViewerCap { id: object::new(ctx) },
        recipient,
    );
}

/// 编辑者可以修改文档
public fun edit_document(
    _: &EditorCap,
    doc: &mut Document,
    new_content: String,
) {
    doc.content = new_content;
}

/// 管理员可以发布文档
public fun publish_document(
    _: &AdminCap,
    doc: &mut Document,
) {
    doc.published = true;
}
```

这种设计实现了**最小权限原则**——每个角色只拥有完成其任务所需的最低限度的权限。

## Capability 模式的优势

### 1. 可迁移性

权限可以通过转移 Capability 对象来转移给新账户，无需修改合约代码。

### 2. 类型安全

编译器在编译时就能检查权限——如果函数要求 `AdminCap` 引用，传入 `MinterCap` 会直接编译失败。

### 3. 可发现性

通过查看函数签名，立即就能知道调用该函数需要什么权限。无需阅读函数体内的断言逻辑。

### 4. 可组合性

多个模块可以共享同一个 Capability 类型，或者定义自己的 Capability 类型来构建复杂的权限体系。

### 5. 可审计性

链上可以追踪 Capability 对象的持有者，轻松审计谁拥有什么权限。

## 设计建议

| 建议 | 说明 |
|------|------|
| 使用 `key` 而非 `key, store` | 防止 Capability 被随意转移 |
| 在 `init` 中创建根 Capability | 确保只有部署者获得初始权限 |
| 使用引用 `&Cap` 而非值传递 | 避免意外消耗 Capability |
| 提供撤销函数 | 允许回收已授予的权限 |
| 按职责划分 Cap 类型 | 遵循最小权限原则 |

## 小结

Capability 模式是 Move on Sui 中实现访问控制的基石。它将权限物化为对象，利用类型系统在编译时提供安全保证。相比传统的地址检查方式，Capability 模式更加灵活、安全、可维护。在设计合约的权限体系时，应优先考虑使用 Capability 模式，并根据业务需求定义合理的 Capability 类型层级。


---


<!-- source: 09_patterns/witness.md -->
## 11.2 Witness 模式

# Witness 模式

Witness（见证者）模式是 Move 中一种强大的授权机制。其核心思想是：**通过构造某个类型的实例来证明对该类型的所有权**。由于 Move 的封装规则规定只有定义结构体的模块才能创建该结构体的实例，因此 Witness 可以作为一种类型级别的"身份证明"。

本章将详细介绍 Witness 模式的原理、实现方式以及在 Sui 框架中的实际应用。

## 什么是 Witness

在 Move 中，**结构体只能在定义它的模块内被构造**。这条规则是 Witness 模式的基础。如果一个函数要求传入类型 `T` 的实例作为参数，那么只有定义 `T` 的模块才能调用该函数——因为只有该模块能创建 `T` 的实例。

这个被传入的实例就被称为 **Witness**（见证者），它"见证"了调用方确实拥有对该类型的控制权。

### 核心规则

```
结构体打包规则（Struct Packing Rule）：
只有定义结构体 S 的模块 M 才能创建 S 的实例。
```

这意味着，如果模块 A 定义了 `struct GOLD {}`，那么任何其他模块都无法凭空创建 `GOLD {}` 实例。这就是 Witness 模式的安全基础。

## 基本实现

### 定义需要 Witness 的泛型接口

```move
module examples::witness;

/// 一个需要见证者才能创建的泛型容器
public struct TypedContainer<phantom T> has key {
    id: UID,
    count: u64,
}

/// 创建新容器 - 需要类型 T 的见证者
public fun new_container<T: drop>(
    _witness: T,
    ctx: &mut TxContext,
): TypedContainer<T> {
    TypedContainer {
        id: object::new(ctx),
        count: 0,
    }
}
```

关键细节：

- `phantom T`：表示 `T` 仅在类型层面使用，不实际存储在结构体中
- `_witness: T`：参数名前的下划线表示值本身不被使用，类型才是关键
- `T: drop`：要求 `T` 具有 `drop` 能力，这样 witness 在使用后可以被自动丢弃

### 使用 Witness

```move
module examples::use_witness;

use examples::witness;

/// 我们的见证者类型 - 只有本模块能创建它
public struct GOLD has drop {}

/// 创建一个 GOLD 类型的容器
public fun create_gold_container(ctx: &mut TxContext): witness::TypedContainer<GOLD> {
    witness::new_container(GOLD {}, ctx)
}
```

在这个例子中：

1. `GOLD` 结构体定义在 `use_witness` 模块中
2. 只有 `use_witness` 模块能创建 `GOLD {}` 实例
3. 因此只有 `use_witness` 模块能调用 `new_container<GOLD>`
4. 得到的容器类型为 `TypedContainer<GOLD>`，在类型层面与其他容器区分

## Witness 与 drop 能力

Witness 类型通常具有 `drop` 能力，这意味着它在使用后可以被自动销毁。这是因为 Witness 的价值在于**创建的瞬间**——它证明了调用方有权创建该类型，使用完毕后就没有存在的必要了。

```move
module examples::witness_drop;

/// 带 drop 的 Witness - 使用后自动销毁
public struct MyWitness has drop {}

/// 不带 drop 的 Witness - 必须显式消耗
public struct StrictWitness {}

public fun use_droppable(_w: MyWitness) {
    // MyWitness 在函数结束时自动丢弃
}

public fun use_strict(w: StrictWitness) {
    // 必须显式解构
    let StrictWitness {} = w;
}
```

不带 `drop` 的 Witness 更加严格——它要求使用方必须显式处理该值，不能忽略。这在某些需要强制执行流程的场景下非常有用（详见 Hot Potato 模式）。

## 工厂模式与 Witness

Witness 模式常用于实现类型安全的工厂模式——由一个通用模块提供创建逻辑，由各业务模块通过 Witness 来定制化：

```move
module examples::token_factory;

use std::string::String;

/// 泛型代币 - 由 Witness 决定类型
public struct Token<phantom T> has key, store {
    id: UID,
    name: String,
    value: u64,
}

/// 用 Witness 创建特定类型的代币
public fun create_token<T: drop>(
    _witness: T,
    name: String,
    value: u64,
    ctx: &mut TxContext,
): Token<T> {
    Token {
        id: object::new(ctx),
        name,
        value,
    }
}

/// 合并同类型代币
public fun merge<T>(token: &mut Token<T>, other: Token<T>) {
    let Token { id, name: _, value } = other;
    id.delete();
    token.value = token.value + value;
}

/// 拆分代币
public fun split<T>(
    token: &mut Token<T>,
    amount: u64,
    ctx: &mut TxContext,
): Token<T> {
    assert!(token.value >= amount, 0);
    token.value = token.value - amount;
    Token {
        id: object::new(ctx),
        name: token.name,
        value: amount,
    }
}
```

```move
module examples::game_gold;

use std::string::String;
use examples::token_factory;

/// 游戏金币的 Witness
public struct GAME_GOLD has drop {}

public fun mint_gold(
    amount: u64,
    ctx: &mut TxContext,
): token_factory::Token<GAME_GOLD> {
    token_factory::create_token(
        GAME_GOLD {},
        std::string::utf8(b"Game Gold"),
        amount,
        ctx,
    )
}
```

这种设计的优势：

- `token_factory` 提供通用的代币逻辑（创建、合并、拆分）
- 各业务模块通过 Witness 创建专属代币类型
- 类型系统保证 `Token<GAME_GOLD>` 和 `Token<SILVER>` 不会混淆

## 在 Sui 框架中的应用

### sui::balance 中的 Supply

Sui 框架中的 `Balance` 和 `Supply` 就是 Witness 模式的典型应用：

```move
// sui::balance 模块的简化版本
public struct Supply<phantom T> has store {
    value: u64,
}

public struct Balance<phantom T> has store {
    value: u64,
}

/// 创建新的 Supply 需要 Witness
public fun create_supply<T: drop>(_witness: T): Supply<T> {
    Supply { value: 0 }
}

/// 通过 Supply 增发 Balance
public fun increase_supply<T>(supply: &mut Supply<T>, value: u64): Balance<T> {
    supply.value = supply.value + value;
    Balance { value }
}
```

（已废弃的）`coin::create_currency` 以及当前推荐的 **`coin_registry::new_currency_with_otw`** 内部都会用到 `balance::create_supply`（通过 **`coin::new_treasury_cap`** 等），OTW 用于确保每种货币的 Supply 只被创建一次。

## phantom 类型参数

在 Witness 模式中，经常会看到 `phantom` 关键字：

```move
public struct Container<phantom T> has key, store {
    id: UID,
    value: u64,
}
```

`phantom` 表示类型参数 `T` 不在结构体的字段中实际使用，它只用于在类型层面区分不同的实例。这有两个好处：

1. **无存储开销**：`T` 不占用实际存储空间
2. **能力推断更灵活**：`Container<T>` 的能力不受 `T` 的能力限制

## Witness 模式 vs Capability 模式

| 维度 | Witness | Capability |
|------|---------|------------|
| 授权方式 | 类型构造权 | 对象所有权 |
| 生命周期 | 通常即用即弃 | 持久存在 |
| 存储需求 | 无 | 占用链上存储 |
| 转移性 | 不可转移（绑定模块） | 可转移给其他账户 |
| 撤销 | 无需撤销 | 可销毁撤销 |
| 适用场景 | 类型级别的一次性授权 | 账户级别的持续授权 |

## 小结

Witness 模式利用 Move 的结构体打包规则，将类型的构造权转化为一种授权机制。它特别适用于泛型系统中的类型级别授权，如代币工厂、通用容器等场景。Witness 通常是轻量级的（具有 `drop` 能力），在证明完成后即被丢弃。与 Capability 模式相比，Witness 更适合一次性的类型证明，而 Capability 更适合持续的权限管理。两种模式经常配合使用，构建出安全、灵活的授权体系。


---


<!-- source: 09_patterns/one-time-witness.md -->
## 11.3 一次性见证（One-Time Witness）

# 一次性见证（One Time Witness）

一次性见证（One Time Witness，简称 OTW）是 Witness 模式的特殊变体，它由系统保证**在整个合约生命周期中只被创建一次**。OTW 是 Sui 框架中许多核心功能的基础，包括代币创建（**`coin_registry::new_currency_with_otw`**）和发布者声明（`package::claim`）。

本章将详细介绍 OTW 的定义规则、系统行为以及典型应用场景。

## OTW 的定义规则

要让一个类型成为合法的 OTW，必须满足以下**全部条件**：

1. **名称为模块名的大写形式**：如模块名为 `my_token`，则 OTW 类型名必须为 `MY_TOKEN`
2. **只有 `drop` 能力**：不能有 `copy`、`key`、`store` 等其他能力
3. **没有任何字段**：必须是空结构体
4. **不是泛型**：不能有类型参数

```move
module examples::my_token;

/// 合法的 OTW：
/// ✅ 名称 = 模块名大写 (my_token → MY_TOKEN)
/// ✅ 只有 drop 能力
/// ✅ 没有字段
/// ✅ 不是泛型
public struct MY_TOKEN has drop {}
```

以下是一些**不合法**的 OTW 示例：

```move
module examples::bad_otw;

/// ❌ 名称不匹配模块名
public struct TOKEN has drop {}

/// ❌ 有额外能力
public struct BAD_OTW has drop, copy {}

/// ❌ 有字段
public struct BAD_OTW2 has drop { value: u64 }

/// ❌ 是泛型
public struct BAD_OTW3<T> has drop {}
```

## 系统如何提供 OTW

OTW 实例不是由开发者手动创建的，而是由 **Sui 运行时在模块发布时自动创建**，并作为 `init` 函数的第一个参数传入：

```move
module examples::my_token;

public struct MY_TOKEN has drop {}

fun init(otw: MY_TOKEN, ctx: &mut TxContext) {
    // otw 是系统创建的唯一实例
    // 在 init 执行完毕后，再也无法获得 MY_TOKEN 的实例
}
```

关键行为：

- `init` 函数在模块**发布时**被调用，且**只调用一次**
- OTW 实例由运行时在调用 `init` 前创建
- `init` 结束后，由于 OTW 有 `drop` 能力，实例被丢弃
- 由于 OTW 没有 `copy` 能力，无法复制
- 由于模块外无法构造 OTW，`init` 之外也无法获得新的实例

因此，OTW 实例在整个区块链历史中**确实只存在过一次**。

## 验证 OTW

Sui 框架提供了 `sui::types::is_one_time_witness` 函数来验证一个值是否是合法的 OTW：

```move
module examples::my_token;

public struct MY_TOKEN has drop {}

fun init(otw: MY_TOKEN, ctx: &mut TxContext) {
    assert!(sui::types::is_one_time_witness(&otw), 0);

    let (initializer, treasury_cap) = sui::coin_registry::new_currency_with_otw<MY_TOKEN>(
        otw, 6,
        std::string::utf8(b"MTK"),
        std::string::utf8(b"My Token"),
        std::string::utf8(b"Example token using OTW"),
        std::string::utf8(b""),
        ctx,
    );
    let metadata_cap = sui::coin_registry::finalize(initializer, ctx);
    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(metadata_cap, ctx.sender());
}
```

`is_one_time_witness` 会检查：

1. 该类型是否只有 `drop` 能力
2. 该类型是否没有字段
3. 该类型名称是否与模块名大写匹配

许多 Sui 框架函数（如 **`coin_registry::new_currency_with_otw`**）内部都会调用此检查，确保传入的确实是 OTW。

## OTW 的典型应用

### 1. 创建代币（coin_registry::new_currency_with_otw）

这是 OTW 最常见的用途。**`coin_registry::new_currency_with_otw`** 要求传入 OTW 以确保每种代币只能被创建一次（旧 API `coin::create_currency` 已废弃）：

```move
module examples::usdc;

use std::string;
use sui::coin_registry;

public struct USDC has drop {}

fun init(otw: USDC, ctx: &mut TxContext) {
    let (initializer, treasury_cap) = coin_registry::new_currency_with_otw<USDC>(
        otw, 6,
        string::utf8(b"USDC"),
        string::utf8(b"USD Coin"),
        string::utf8(b"Stablecoin pegged to USD"),
        string::utf8(b""),
        ctx,
    );
    let metadata_cap = coin_registry::finalize(initializer, ctx);
    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(metadata_cap, ctx.sender());
}
```

为什么需要 OTW？因为 `new_currency_with_otw` 内部会创建该代币的 `TreasuryCap` 与链上 `Currency`，若允许多次调用会产生重复注册，破坏代币唯一性。

### 2. 声明 Publisher（package::claim）

`Publisher` 对象证明了某个地址是某个包的发布者，用于创建 `Display` 和 `TransferPolicy`：

```move
module examples::my_nft;

use sui::package;

public struct MY_NFT has drop {}

public struct GameItem has key, store {
    id: UID,
    name: std::string::String,
}

fun init(otw: MY_NFT, ctx: &mut TxContext) {
    // 用 OTW 声明 Publisher 身份
    let publisher = package::claim(otw, ctx);
    transfer::public_transfer(publisher, ctx.sender());
}
```

### 3. 自定义一次性初始化

你也可以利用 OTW 确保某些操作只执行一次：

```move
module examples::singleton;

public struct SINGLETON has drop {}

public struct GlobalConfig has key {
    id: UID,
    max_supply: u64,
    is_paused: bool,
}

fun init(otw: SINGLETON, ctx: &mut TxContext) {
    assert!(sui::types::is_one_time_witness(&otw), 0);

    let config = GlobalConfig {
        id: object::new(ctx),
        max_supply: 1_000_000,
        is_paused: false,
    };

    // 共享全局配置对象 - 只会创建一次
    transfer::share_object(config);
}
```

## OTW 与普通 Witness 的区别

| 特征 | OTW | 普通 Witness |
|------|-----|-------------|
| 创建次数 | 系统保证仅一次 | 模块内可多次创建 |
| 创建方式 | 系统自动传入 init | 手动构造 |
| 命名要求 | 必须是模块名大写 | 无特殊要求 |
| 能力限制 | 只能有 drop | 无限制（通常有 drop） |
| 用途 | 全局唯一初始化 | 类型级别授权 |

## 常见错误

### 错误 1：在 init 外尝试创建 OTW

```move
module examples::wrong;

public struct WRONG has drop {}

public fun create_otw(): WRONG {
    WRONG {} // 这虽然能编译，但不会被系统认定为 OTW
}
```

虽然这段代码可以编译通过（因为结构体可以在定义模块内构造），但 `WRONG {}` 不会被 `is_one_time_witness` 认可。只有 `init` 函数中由系统传入的实例才是真正的 OTW。

### 错误 2：OTW 名称不匹配

```move
module examples::token;

// ❌ 名称应为 TOKEN（模块名大写），不是 Token
public struct Token has drop {}

fun init(otw: Token, ctx: &mut TxContext) {
    // 编译可能通过，但 otw 不是合法的 OTW；应改为 public struct TOKEN has drop {}
}
```

### 错误 3：忘记消耗 OTW

```move
module examples::forgot;

public struct FORGOT has drop {}

fun init(_otw: FORGOT, ctx: &mut TxContext) {
    // 没有使用 otw！
    // 虽然 drop 能力允许自动丢弃，但这通常意味着忘记了初始化逻辑
}
```

这不会导致编译错误（因为有 `drop`），但通常意味着遗漏了重要的初始化步骤。

## 小结

一次性见证（OTW）是 Sui 生态中的核心模式，它利用系统级保证实现了真正的"只执行一次"语义。OTW 必须满足严格的定义规则：模块名大写、仅有 `drop` 能力、无字段、非泛型。它的主要用途包括代币创建、Publisher 声明以及全局唯一初始化。理解 OTW 对于使用 Sui 框架的高级功能至关重要——几乎所有需要"一次性初始化"的场景都依赖于这一模式。


---


<!-- source: 09_patterns/hot-potato.md -->
## 11.4 Hot Potato 模式

# Hot Potato 模式

Hot Potato（烫手山芋）模式是 Move 中一种独特而强大的设计模式。其核心是一个**没有任何能力（abilities）的结构体**——它不能被存储、不能被复制、不能被丢弃。就像一个真正的烫手山芋，一旦创建就必须被"消耗"掉，否则交易会失败。

这种模式可以在没有回调机制的情况下**强制执行特定的工作流程**，是 Move 类型系统最精妙的应用之一。

## 什么是 Hot Potato

在 Move 中，结构体可以拥有四种能力：`copy`、`drop`、`store`、`key`。一个没有任何能力的结构体具有以下特性：

| 操作 | 是否允许 | 原因 |
|------|---------|------|
| 复制 | ❌ | 没有 `copy` |
| 丢弃 | ❌ | 没有 `drop` |
| 存储到对象中 | ❌ | 没有 `store` |
| 作为对象存在 | ❌ | 没有 `key` |
| 转移给其他地址 | ❌ | 没有 `key` |

唯一的处理方式是**在同一个交易中通过解构（destructure）来消耗它**。这意味着必须调用某个接受该类型并解构它的函数。

```move
/// Hot Potato - 没有任何能力！
public struct Receipt {
    amount: u64,
}

/// 创建 Hot Potato
public fun create_receipt(amount: u64): Receipt {
    Receipt { amount }
}

/// 消耗 Hot Potato - 唯一的"出路"
public fun consume_receipt(receipt: Receipt): u64 {
    let Receipt { amount } = receipt;
    amount
}
```

## 为什么叫"烫手山芋"

想象你拿到一个滚烫的山芋：

1. **不能拿着不动**（不能 drop）——交易结束时如果还持有，交易失败
2. **不能放进口袋**（不能 store）——无法存储在任何对象中
3. **不能递给别人**（不能 transfer）——没有 key，不能作为独立对象转移
4. **必须处理掉**（必须解构）——唯一的解决方案

这就强制了调用者必须在同一个交易中完成整个工作流程。

## 闪电贷示例

闪电贷（Flash Loan）是 Hot Potato 模式最经典的应用场景。借款人必须在同一交易中借款并还款，否则交易会回滚：

```move
module examples::flash_loan;

use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::sui::SUI;

/// Hot Potato! 没有任何能力 - 必须被消耗
public struct FlashLoanReceipt {
    amount: u64,
    fee: u64,
}

public struct LendingPool has key {
    id: UID,
    balance: Balance<SUI>,
    fee_percent: u64,
}

public fun create_pool(ctx: &mut TxContext) {
    let pool = LendingPool {
        id: object::new(ctx),
        balance: balance::zero(),
        fee_percent: 1,
    };
    transfer::share_object(pool);
}

public fun deposit(pool: &mut LendingPool, coin: Coin<SUI>) {
    balance::join(&mut pool.balance, coin::into_balance(coin));
}

/// 借款 - 返回资金和一个 Hot Potato 收据
public fun borrow(
    pool: &mut LendingPool,
    amount: u64,
    ctx: &mut TxContext,
): (Coin<SUI>, FlashLoanReceipt) {
    let coins = coin::from_balance(
        balance::split(&mut pool.balance, amount),
        ctx,
    );
    let receipt = FlashLoanReceipt {
        amount,
        fee: amount * pool.fee_percent / 100,
    };
    (coins, receipt)
}

/// 还款 - 消耗 Hot Potato
const EInsufficientRepay: u64 = 0;

public fun repay(
    pool: &mut LendingPool,
    payment: Coin<SUI>,
    receipt: FlashLoanReceipt,
) {
    let FlashLoanReceipt { amount, fee } = receipt;
    let repay_amount = amount + fee;
    assert!(coin::value(&payment) >= repay_amount, EInsufficientRepay);
    balance::join(&mut pool.balance, coin::into_balance(payment));
}
```

调用流程必须是：

```
borrow() → [使用资金做其他操作] → repay()
```

如果调用者只调用 `borrow()` 不调用 `repay()`，交易会失败，因为 `FlashLoanReceipt` 无法被丢弃。资金安全得到了类型系统的保证。

## 借用与归还模式

另一个常见场景是确保借出的资源一定会被归还：

```move
module examples::lending;

use std::string::String;

public struct Item has key, store {
    id: UID,
    name: String,
}

/// Hot Potato - 借用凭证
public struct BorrowReceipt {
    item_id: ID,
    borrower: address,
}

public struct Vault has key {
    id: UID,
    items: vector<Item>,
}

/// 从保险柜借出物品，返回物品和凭证
public fun borrow_item(
    vault: &mut Vault,
    index: u64,
    ctx: &TxContext,
): (Item, BorrowReceipt) {
    let item = vector::remove(&mut vault.items, index);
    let receipt = BorrowReceipt {
        item_id: object::id(&item),
        borrower: ctx.sender(),
    };
    (item, receipt)
}

const EItemMismatch: u64 = 0;

/// 归还物品，消耗凭证
public fun return_item(
    vault: &mut Vault,
    item: Item,
    receipt: BorrowReceipt,
) {
    let BorrowReceipt { item_id, borrower: _ } = receipt;
    assert!(object::id(&item) == item_id, EItemMismatch);
    vector::push_back(&mut vault.items, item);
}
```

## 多步骤工作流

Hot Potato 可以用来强制执行多步骤的工作流程，确保每一步都不会被跳过：

```move
module examples::phone_shop;

use sui::coin::{Self, Coin};
use sui::sui::SUI;

/// 手机
public struct Phone has key, store {
    id: UID,
    model: std::string::String,
}

/// Hot Potato：排队号
public struct QueueTicket {
    customer: address,
}

/// Hot Potato：验货凭证
public struct InspectionSlip {
    customer: address,
    phone_id: ID,
}

/// 第一步：排队取号
public fun take_queue_number(ctx: &TxContext): QueueTicket {
    QueueTicket { customer: ctx.sender() }
}

/// 第二步：选购手机（消耗排队号，产生验货凭证）
public fun select_phone(
    ticket: QueueTicket,
    phone: &Phone,
): InspectionSlip {
    let QueueTicket { customer } = ticket;
    InspectionSlip {
        customer,
        phone_id: object::id(phone),
    }
}

const EPhoneMismatch: u64 = 0;

/// 第三步：付款取货（消耗验货凭证）
public fun pay_and_collect(
    slip: InspectionSlip,
    phone: Phone,
    mut payment: Coin<SUI>,
    shop_owner: address,
    ctx: &mut TxContext,
) {
    let InspectionSlip { customer, phone_id } = slip;
    assert!(object::id(&phone) == phone_id, EPhoneMismatch);

    let price = coin::split(&mut payment, 1000, ctx);
    transfer::public_transfer(price, shop_owner);
    transfer::public_transfer(payment, customer);
    transfer::public_transfer(phone, customer);
}
```

这个例子强制了购买流程的三个步骤必须按顺序执行：

1. `take_queue_number()` → 得到 `QueueTicket`
2. `select_phone()` → 消耗 `QueueTicket`，得到 `InspectionSlip`
3. `pay_and_collect()` → 消耗 `InspectionSlip`

跳过任何步骤都会导致 Hot Potato 无法被消耗，交易失败。

## 可变路径执行

Hot Potato 还可以支持多种不同的消耗路径，实现灵活的工作流：

```move
module examples::multi_path;

public struct Obligation {
    value: u64,
}

public fun create_obligation(value: u64): Obligation {
    Obligation { value }
}

/// 路径 A：全额偿还
public fun fulfill_full(obligation: Obligation) {
    let Obligation { value: _ } = obligation;
}

/// 路径 B：部分偿还 + 新义务
const EInvalidPartial: u64 = 0;

public fun fulfill_partial(
    obligation: Obligation,
    partial_amount: u64,
): Obligation {
    let Obligation { value } = obligation;
    assert!(partial_amount < value, EInvalidPartial);
    Obligation { value: value - partial_amount }
}

/// 路径 C：由管理员豁免
public fun waive(
    _admin: &examples::capability::AdminCap,
    obligation: Obligation,
) {
    let Obligation { value: _ } = obligation;
}
```

## 设计要点

### 1. 确保有消耗路径

每个 Hot Potato 都必须至少有一个公开的消耗函数，否则调用者永远无法完成交易：

```move
/// ❌ 错误：没有公开的消耗函数
public struct Trap { value: u64 }

public fun create_trap(): Trap {
    Trap { value: 0 }
    // 调用者拿到 Trap 后无法处理！
}

// 消耗函数只在模块内部，外部无法调用
fun consume_trap(trap: Trap) {
    let Trap { value: _ } = trap;
}
```

### 2. 验证一致性

在消耗函数中验证 Hot Potato 携带的数据与实际操作一致：

```move
public fun repay(receipt: Receipt, payment: Coin<SUI>) {
    let Receipt { amount } = receipt;
    // ✅ 验证还款金额
    assert!(coin::value(&payment) >= amount, 0);
}
```

### 3. 携带必要信息

Hot Potato 可以携带字段来传递创建时的上下文信息到消耗时：

```move
public struct ActionReceipt {
    expected_result: u64,
    deadline_epoch: u64,
    initiator: address,
}
```

## 小结

Hot Potato 模式利用 Move 类型系统中"无能力结构体必须被解构"的规则，在没有回调机制的情况下实现了强制工作流程执行。它就像一个必须被传递和处理的"烫手山芋"，确保了借贷必须归还、流程必须完成、义务必须履行。这是 Move 语言独有的设计模式，在闪电贷、借用归还、多步骤流程等场景中有着不可替代的作用。


---


<!-- source: 09_patterns/wrapper.md -->
## 11.5 Wrapper 模式

# Wrapper 模式

Wrapper（包装器）模式是一种通过创建新类型来包装已有类型，从而**扩展或限制**其行为的设计模式。在 Move 中，Wrapper 模式广泛用于构建自定义数据结构、控制对象访问权限以及实现类型安全的接口封装。

本章将介绍 Wrapper 模式的基本原理、常见实现方式，以及在对象系统中的高级应用。

## 什么是 Wrapper 模式

Wrapper 模式的核心思想很简单：**创建一个新的结构体，其中包含一个已有类型的字段**。通过控制对外暴露的接口，可以：

- **限制行为**：隐藏底层类型的某些操作（如只允许栈操作，不允许随机访问）
- **扩展行为**：在底层类型的基础上添加新功能（如添加权限检查、日志记录）
- **改变语义**：赋予底层类型新的含义（如将 `vector` 包装为 `Stack`）

### 基本结构

```move
/// 典型的 Wrapper 结构
public struct Wrapper<T> has store {
    inner: T,
}
```

### 标准访问器

Wrapper 通常提供三种标准访问器：

| 函数 | 签名 | 用途 |
|------|------|------|
| `inner()` | `&Wrapper<T> -> &T` | 只读访问内部值 |
| `inner_mut()` | `&mut Wrapper<T> -> &mut T` | 可变访问内部值 |
| `into_inner()` | `Wrapper<T> -> T` | 解包，消耗 Wrapper |

## 限制行为：Stack 示例

将 `vector` 包装为 `Stack`，只暴露后进先出（LIFO）操作：

```move
module examples::wrapper;

/// Stack - 包装 vector 以限制操作
public struct Stack<T> has store {
    inner: vector<T>,
}

public fun new<T>(): Stack<T> {
    Stack { inner: vector::empty() }
}

public fun push<T>(stack: &mut Stack<T>, item: T) {
    vector::push_back(&mut stack.inner, item);
}

public fun pop<T>(stack: &mut Stack<T>): T {
    vector::pop_back(&mut stack.inner)
}

public fun peek<T>(stack: &Stack<T>): &T {
    let len = vector::length(&stack.inner);
    vector::borrow(&stack.inner, len - 1)
}

public fun is_empty<T>(stack: &Stack<T>): bool {
    vector::is_empty(&stack.inner)
}

public fun size<T>(stack: &Stack<T>): u64 {
    vector::length(&stack.inner)
}

/// 只读访问底层 vector
public fun inner<T>(stack: &Stack<T>): &vector<T> {
    &stack.inner
}

/// 销毁 Wrapper，返回底层 vector
public fun into_inner<T>(stack: Stack<T>): vector<T> {
    let Stack { inner } = stack;
    inner
}
```

通过这种包装：

- ✅ 允许 `push`、`pop`、`peek` 操作
- ❌ 禁止随机访问（`vector::borrow`）
- ❌ 禁止在中间插入或删除元素
- 如果需要底层 `vector`，必须显式调用 `into_inner()` 解包

## 扩展行为：带边界检查的数组

```move
module examples::bounded_vec;

/// 有最大长度限制的 vector
public struct BoundedVec<T> has store {
    inner: vector<T>,
    max_size: u64,
}

public fun new<T>(max_size: u64): BoundedVec<T> {
    BoundedVec {
        inner: vector::empty(),
        max_size,
    }
}

public fun push<T>(bv: &mut BoundedVec<T>, item: T) {
    assert!(vector::length(&bv.inner) < bv.max_size, 0);
    vector::push_back(&mut bv.inner, item);
}

public fun pop<T>(bv: &mut BoundedVec<T>): T {
    vector::pop_back(&mut bv.inner)
}

public fun get<T>(bv: &BoundedVec<T>, index: u64): &T {
    vector::borrow(&bv.inner, index)
}

public fun length<T>(bv: &BoundedVec<T>): u64 {
    vector::length(&bv.inner)
}

public fun max_size<T>(bv: &BoundedVec<T>): u64 {
    bv.max_size
}

public fun is_full<T>(bv: &BoundedVec<T>): bool {
    vector::length(&bv.inner) >= bv.max_size
}
```

`BoundedVec` 在 `vector` 的基础上增加了最大长度限制，每次 `push` 时自动检查是否超出容量。

## 不可变包装器

通过不提供可变访问器，可以创建不可变的数据结构：

```move
module examples::immutable_vec;

/// 一旦创建就不可修改的 vector
public struct ImmutableVec<T: store> has store {
    inner: vector<T>,
}

/// 从 vector 创建，之后不可修改
public fun from_vec<T: store>(v: vector<T>): ImmutableVec<T> {
    ImmutableVec { inner: v }
}

/// 只读访问
public fun get<T: store>(iv: &ImmutableVec<T>, index: u64): &T {
    vector::borrow(&iv.inner, index)
}

public fun length<T: store>(iv: &ImmutableVec<T>): u64 {
    vector::length(&iv.inner)
}

public fun contains<T: store>(iv: &ImmutableVec<T>, item: &T): bool
where T: copy {
    vector::contains(&iv.inner, item)
}

/// 解包获取底层 vector（消耗 ImmutableVec）
public fun into_inner<T: store>(iv: ImmutableVec<T>): vector<T> {
    let ImmutableVec { inner } = iv;
    inner
}
```

注意这里**没有**提供 `inner_mut()` 或任何修改方法，确保了创建后的不可变性。

## 包装对象

Wrapper 模式在对象层面同样强大。通过将一个对象包装在另一个对象中，可以实现权限控制、时间锁等功能。

### 时间锁包装器

```move
module examples::guarded;

use std::string::String;

/// 将任意可存储类型包装为带时间锁的对象
public struct Locked<T: store> has key {
    id: UID,
    content: T,
    unlock_epoch: u64,
}

public fun lock<T: store>(
    content: T,
    unlock_epoch: u64,
    ctx: &mut TxContext,
) {
    let locked = Locked {
        id: object::new(ctx),
        content,
        unlock_epoch,
    };
    transfer::transfer(locked, ctx.sender());
}

public fun unlock<T: store>(
    locked: Locked<T>,
    ctx: &TxContext,
): T {
    assert!(ctx.epoch() >= locked.unlock_epoch, 0);
    let Locked { id, content, unlock_epoch: _ } = locked;
    id.delete();
    content
}
```

这个包装器可以锁定任意类型，直到指定的 epoch 才能解锁。

### 权限包装器

```move
module examples::permission_wrapper;

use std::string::String;

/// 包装对象，添加权限控制
public struct Protected<T: store> has key {
    id: UID,
    content: T,
    authorized_users: vector<address>,
}

public fun protect<T: store>(
    content: T,
    authorized_users: vector<address>,
    ctx: &mut TxContext,
) {
    let protected = Protected {
        id: object::new(ctx),
        content,
        authorized_users,
    };
    transfer::share_object(protected);
}

const ENotAuthorized: u64 = 0;

/// 只有授权用户才能访问
public fun access<T: store>(
    protected: &Protected<T>,
    ctx: &TxContext,
): &T {
    assert!(
        vector::contains(&protected.authorized_users, &ctx.sender()),
        ENotAuthorized,
    );
    &protected.content
}

/// 只有授权用户才能修改
public fun access_mut<T: store>(
    protected: &mut Protected<T>,
    ctx: &TxContext,
): &mut T {
    assert!(
        vector::contains(&protected.authorized_users, &ctx.sender()),
        ENotAuthorized,
    );
    &mut protected.content
}

/// 添加授权用户（需要已是授权用户）
public fun add_user<T: store>(
    protected: &mut Protected<T>,
    new_user: address,
    ctx: &TxContext,
) {
    assert!(
        vector::contains(&protected.authorized_users, &ctx.sender()),
        ENotAuthorized,
    );
    vector::push_back(&mut protected.authorized_users, new_user);
}
```

## Wrapper 与 Wrapped Object

在 Sui 的对象模型中，当一个对象被包装到另一个对象内部时，它就变成了**被包装对象**（Wrapped Object）。被包装的对象在链上是不可直接访问的，只有通过外层对象才能操作它。

```move
module examples::nft_bundle;

use std::string::String;

public struct NFT has key, store {
    id: UID,
    name: String,
}

/// 将多个 NFT 捆绑为一个对象
public struct Bundle has key {
    id: UID,
    nfts: vector<NFT>,
    label: String,
}

public fun create_bundle(
    nfts: vector<NFT>,
    label: String,
    ctx: &mut TxContext,
) {
    let bundle = Bundle {
        id: object::new(ctx),
        nfts,
        label,
    };
    transfer::transfer(bundle, ctx.sender());
}

/// 解开捆绑包，归还所有 NFT
public fun unbundle(
    bundle: Bundle,
    ctx: &TxContext,
) {
    let Bundle { id, mut nfts, label: _ } = bundle;
    id.delete();
    while (!vector::is_empty(&nfts)) {
        let nft = vector::pop_back(&mut nfts);
        transfer::public_transfer(nft, ctx.sender());
    };
    vector::destroy_empty(nfts);
}
```

## 设计原则

### 何时使用 Wrapper

| 场景 | 示例 |
|------|------|
| 限制底层类型的操作 | `Stack`、`ImmutableVec` |
| 添加额外约束 | `BoundedVec`、`Locked` |
| 组合多个类型 | `Bundle`、`Protected` |
| 改变语义 | 将 `u64` 包装为 `Percentage`（百分比） |

### 设计建议

1. **最小接口原则**：只暴露必要的操作，隐藏不需要的底层功能
2. **提供逃生舱**：通常应提供 `into_inner()` 方法，允许在需要时解包
3. **考虑能力传递**：Wrapper 的能力应该合理反映其用途
4. **文档化限制**：清晰说明 Wrapper 与底层类型的行为差异

## 小结

Wrapper 模式通过将已有类型包装在新类型中，实现了行为的扩展和限制。在数据结构层面，它可以创建 Stack、BoundedVec 等受限集合；在对象层面，它可以实现时间锁、权限控制等高级功能。Wrapper 模式的精髓在于**通过接口控制来改变类型的行为**，同时保持底层数据的完整性。在设计 Move 模块时，合理使用 Wrapper 模式可以显著提高代码的安全性和可维护性。


---


<!-- source: 09_patterns/publisher.md -->
## 11.6 Publisher 权限

# Publisher 权限

Publisher（发布者）是 Sui 框架提供的一种权限对象，用于**证明某个地址是某个包（package）的发布者**。它在创建 `Display` 对象和 `TransferPolicy` 时是必需的，是连接链上包与链下展示的关键桥梁。

本章将介绍 Publisher 的定义、获取方式、验证机制以及实际应用场景。

## Publisher 的定义

`Publisher` 定义在 `sui::package` 模块中，其结构如下（简化版）：

```move
// sui::package 模块中的定义（简化）
public struct Publisher has key, store {
    id: UID,
    package: String,
    module_name: String,
}
```

核心字段：

- `package`：包的地址（发布时确定）
- `module_name`：模块名称

Publisher 具有 `key` 和 `store` 能力，这意味着它是一个可以被自由转移和存储的对象。

## 获取 Publisher

Publisher 只能通过 `package::claim` 函数获取，该函数要求传入一个 OTW（一次性见证者）：

```move
module examples::my_publisher;

use sui::package;
use std::string::String;

public struct MY_PUBLISHER has drop {}

public struct Item has key, store {
    id: UID,
    name: String,
}

fun init(otw: MY_PUBLISHER, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);
    transfer::public_transfer(publisher, ctx.sender());
}
```

关键点：

1. `package::claim` 消耗 OTW，因此每个模块只能创建一个 Publisher
2. Publisher 被转移给部署者（`ctx.sender()`）
3. 使用 `public_transfer` 是因为 Publisher 有 `store` 能力

## 验证机制

Publisher 提供了两个验证函数来检查类型与 Publisher 的关系：

### from_module\<T\>

验证类型 `T` 是否定义在 Publisher 对应的模块中：

```move
/// 验证 Item 是否属于 Publisher 对应的模块
public fun authorized_action(publisher: &package::Publisher) {
    assert!(package::from_module<Item>(publisher), 0);
    // 只有当 Item 定义在 publisher 对应的模块中，才会通过
}
```

### from_package\<T\>

验证类型 `T` 是否定义在 Publisher 对应的包中（可以是不同模块）：

```move
/// 验证类型是否属于同一个包（可以是不同模块）
public fun package_level_check(publisher: &package::Publisher) {
    assert!(package::from_package<Item>(publisher), 0);
}
```

两者的区别：

| 函数 | 检查范围 | 用途 |
|------|---------|------|
| `from_module<T>` | 精确到模块 | 模块级别的权限验证 |
| `from_package<T>` | 整个包 | 包级别的权限验证 |

## Publisher 的核心用途

### 1. 创建 Display 对象

`Display<T>` 对象定义了类型 `T` 在钱包、浏览器等客户端中的展示方式。创建 `Display` 需要 Publisher 来证明调用者有权为该类型定义展示规则：

```move
module examples::hero_display;

use sui::package;
use sui::display;
use std::string::String;

public struct HERO_DISPLAY has drop {}

public struct Hero has key, store {
    id: UID,
    name: String,
    power: u64,
}

fun init(otw: HERO_DISPLAY, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    let keys = vector[
        std::string::utf8(b"name"),
        std::string::utf8(b"description"),
        std::string::utf8(b"image_url"),
    ];

    let values = vector[
        std::string::utf8(b"{name}"),
        std::string::utf8(b"A hero with {power} power"),
        std::string::utf8(b"https://example.com/heroes/{name}.png"),
    ];

    let mut disp = display::new_with_fields<Hero>(
        &publisher,  // 需要 Publisher 引用
        keys,
        values,
        ctx,
    );
    display::update_version(&mut disp);

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(disp, ctx.sender());
}
```

### 2. 创建 TransferPolicy

`TransferPolicy<T>` 定义了类型 `T` 在交易所/市场中的转移规则（如版税）。同样需要 Publisher：

```move
module examples::marketplace_policy;

use sui::package;
use sui::transfer_policy;

public struct MARKETPLACE_POLICY has drop {}

public struct Collectible has key, store {
    id: UID,
    rarity: u64,
}

fun init(otw: MARKETPLACE_POLICY, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    let (policy, policy_cap) = transfer_policy::new<Collectible>(
        &publisher,  // 需要 Publisher
        ctx,
    );

    transfer::public_share_object(policy);
    transfer::public_transfer(policy_cap, ctx.sender());
    transfer::public_transfer(publisher, ctx.sender());
}
```

### 3. 类型权限验证

Publisher 也可以用作通用的权限验证机制：

```move
module examples::admin_ops;

use sui::package;
use std::string::String;

public struct Config has key {
    id: UID,
    name: String,
    value: u64,
}

/// 使用 Publisher 验证调用者身份
public fun update_config(
    publisher: &package::Publisher,
    config: &mut Config,
    new_value: u64,
) {
    // 验证 Publisher 确实属于定义 Config 的模块
    assert!(package::from_module<Config>(publisher), 0);
    config.value = new_value;
}
```

## Publisher 的安全考量

### Publisher 不是唯一的管理员方案

虽然 Publisher 可以用于权限控制，但它有一些限制：

1. **一个模块只有一个 Publisher**：不支持多管理员场景
2. **权限范围固定**：Publisher 的权限与模块/包绑定，无法细粒度控制
3. **可被转移**：如果 Publisher 被意外转移，权限也会随之转移

因此，对于复杂的权限管理场景，推荐结合 Capability 模式使用：

```move
module examples::combined_auth;

use sui::package;

public struct COMBINED_AUTH has drop {}

/// 自定义管理员能力
public struct AdminCap has key { id: UID }

fun init(otw: COMBINED_AUTH, ctx: &mut TxContext) {
    // Publisher 用于 Display 和 TransferPolicy
    let publisher = package::claim(otw, ctx);
    transfer::public_transfer(publisher, ctx.sender());

    // AdminCap 用于业务逻辑的权限控制
    transfer::transfer(
        AdminCap { id: object::new(ctx) },
        ctx.sender(),
    );
}

/// Display 相关操作用 Publisher
public fun setup_display(publisher: &package::Publisher) {
    assert!(package::from_module<AdminCap>(publisher), 0);
    // 设置 Display...
}

/// 业务操作用 AdminCap
public fun admin_action(_: &AdminCap) {
    // 执行管理操作...
}
```

### 保管好 Publisher

Publisher 是高权限对象，建议：

| 建议 | 原因 |
|------|------|
| 妥善保管 | 丢失后无法重新创建 |
| 不要随意转移 | 转移后原持有者失去权限 |
| 考虑冻结 | 如果不再需要修改 Display，可以冻结 Publisher |
| 使用多签钱包持有 | 防止单点故障 |

## Publisher 的生命周期

```
包发布
  │
  ├── init() 被调用
  │     │
  │     ├── package::claim(otw) → 创建 Publisher
  │     │
  │     └── transfer Publisher 给部署者
  │
  ├── 使用 Publisher 创建 Display
  │
  ├── 使用 Publisher 创建 TransferPolicy
  │
  └── 持续持有 Publisher 以便未来更新
       或冻结 Publisher（如果不再需要更新）
```

## 小结

Publisher 是 Sui 框架中证明包发布者身份的核心对象。它通过 `package::claim` 与 OTW 配合创建，确保每个模块只有一个 Publisher。Publisher 的主要用途是创建 `Display` 和 `TransferPolicy`，这两个功能是 Sui NFT 生态的基础。在实际项目中，应将 Publisher 与 Capability 模式结合使用——Publisher 负责框架级别的权限（Display、TransferPolicy），Capability 负责业务级别的权限控制。


---


<!-- source: 09_patterns/display.md -->
## 11.7 Object Display

# Object Display（V1）

Object Display 是 Sui 提供的一套标准化机制，用于定义对象在链下客户端（钱包、浏览器、市场）中的**展示方式**。通过 `Display<T>` 对象，开发者可以为类型设置模板化的展示字段，而无需在每个对象实例中存储元数据。

本章介绍 **Display V1**（`sui::display`）的设计背景、创建方式、模板语法以及最佳实践。新一代 **Display V2** 基于 Display Registry（系统对象 `0xd`），支持每类型一个 Display、固定查询点与迁移路径，详见 [11.8 Display V2 与 Display Registry](display-v2.md)。

## 设计背景

### 为什么不在对象中存储元数据？

传统方案可能会在每个 NFT 对象中存储 `name`、`description`、`image_url` 等展示字段：

```move
/// ❌ 不推荐：每个对象都存储完整的元数据
public struct BadNFT has key, store {
    id: UID,
    name: String,
    description: String,    // 每个对象都存一份
    image_url: String,      // 每个对象都存一份
    project_url: String,    // 每个对象都存一份
    creator: String,        // 每个对象都存一份
    // ...业务字段
    power: u64,
}
```

这种方式存在几个问题：

1. **存储冗余**：大量重复数据（如 `project_url` 对同类对象都一样）
2. **Gas 浪费**：创建和存储更多数据意味着更高的 Gas 费
3. **更新困难**：如果要修改展示方式，需要逐个更新所有对象
4. **耦合严重**：业务逻辑与展示逻辑混在一起

### Display 的解决方案

`Display<T>` 将展示逻辑与对象数据分离：

- 对象只存储**业务数据**
- 展示规则定义在单独的 `Display<T>` 对象中
- 客户端在展示时，将 Display 模板与对象字段结合，动态生成展示内容

```move
/// ✅ 推荐：对象只存储业务数据
public struct GoodNFT has key, store {
    id: UID,
    name: String,
    power: u64,
    image_id: String,
}

// Display<GoodNFT> 定义展示规则：
// name: "{name}"
// description: "An NFT with {power} power"
// image_url: "https://example.com/nfts/{image_id}.png"
```

## Display\<T\> 对象

`Display<T>` 是一个与类型 `T` 关联的对象，包含一组键值对，定义了展示模板：

```move
// sui::display 模块中的定义（简化）
public struct Display<phantom T: key> has key, store {
    id: UID,
    fields: VecMap<String, String>,
    version: u16,
}
```

关键点：

- `phantom T`：与特定类型关联，`Display<Hero>` 和 `Display<Weapon>` 是不同类型
- `fields`：键值对映射，key 是字段名，value 是模板字符串
- `version`：版本号，每次更新后递增，客户端据此刷新缓存

## 创建 Display

创建 `Display<T>` 需要该类型所属模块的 `Publisher` 对象：

```move
module examples::game_hero;

use sui::package;
use sui::display;
use std::string::String;

public struct GAME_HERO has drop {}

public struct Hero has key, store {
    id: UID,
    name: String,
    class: String,
    level: u64,
    image_id: String,
}

fun init(otw: GAME_HERO, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    let keys = vector[
        std::string::utf8(b"name"),
        std::string::utf8(b"description"),
        std::string::utf8(b"image_url"),
        std::string::utf8(b"project_url"),
    ];

    let values = vector[
        std::string::utf8(b"{name} - Level {level}"),
        std::string::utf8(b"A {class} hero in the game"),
        std::string::utf8(b"https://game.example.com/heroes/{image_id}"),
        std::string::utf8(b"https://game.example.com"),
    ];

    let mut disp = display::new_with_fields<Hero>(
        &publisher,
        keys,
        values,
        ctx,
    );
    display::update_version(&mut disp);

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(disp, ctx.sender());
}
```

也可以分步创建和添加字段：

```move
fun init_step_by_step(otw: GAME_HERO, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    // 先创建空的 Display
    let mut disp = display::new<Hero>(&publisher, ctx);

    // 逐个添加字段
    display::add(&mut disp, std::string::utf8(b"name"), std::string::utf8(b"{name}"));
    display::add(&mut disp, std::string::utf8(b"description"), std::string::utf8(b"A {class} hero"));
    display::add(&mut disp, std::string::utf8(b"image_url"), std::string::utf8(b"https://game.example.com/heroes/{image_id}"));

    // 更新版本号以通知客户端
    display::update_version(&mut disp);

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(disp, ctx.sender());
}
```

## 模板语法

Display 使用花括号 `{}` 作为模板占位符，在客户端渲染时替换为对象的实际字段值。

### 基本字段引用

```
{field_name}
```

直接引用对象的字段名：

| 模板 | 对象字段 | 渲染结果 |
|------|---------|---------|
| `"{name}"` | `name: "Warrior"` | `"Warrior"` |
| `"Level {level}"` | `level: 5` | `"Level 5"` |
| `"{name} - Lv.{level}"` | `name: "Warrior"`, `level: 5` | `"Warrior - Lv.5"` |

### URL 模板

最常见的用法是构建动态 URL：

```
"https://example.com/images/{image_id}.png"
```

如果对象的 `image_id` 字段值为 `"abc123"`，渲染结果为：

```
"https://example.com/images/abc123.png"
```

### 静态值

不包含 `{}` 的值会原样展示：

```
"https://game.example.com"  // 所有对象共享同一个项目 URL
```

## 标准字段

Sui 生态约定了一组标准展示字段，客户端会优先识别这些字段：

| 字段 | 用途 | 示例值 |
|------|------|--------|
| `name` | 对象名称 | `"{name}"` |
| `description` | 对象描述 | `"A {class} hero"` |
| `image_url` | 展示图片 URL | `"https://example.com/{image_id}.png"` |
| `link` | 对象详情页链接 | `"https://example.com/items/{id}"` |
| `project_url` | 项目主页 | `"https://example.com"` |
| `creator` | 创建者信息 | `"Game Studio"` |
| `thumbnail_url` | 缩略图 URL | `"https://example.com/thumbs/{image_id}.png"` |

## 更新 Display

持有 `Display<T>` 对象的用户可以随时更新展示规则：

```move
module examples::update_display;

use sui::display;
use std::string::String;

public struct Item has key, store {
    id: UID,
    name: String,
    version: u64,
}

/// 更新 Display 的字段
public fun update_item_display(
    disp: &mut display::Display<Item>,
) {
    // 修改已有字段
    display::edit(
        disp,
        std::string::utf8(b"description"),
        std::string::utf8(b"Updated: Item v{version} - {name}"),
    );

    // 添加新字段
    display::add(
        disp,
        std::string::utf8(b"thumbnail_url"),
        std::string::utf8(b"https://new-cdn.example.com/thumbs/{name}.png"),
    );

    // 必须更新版本号，客户端才会刷新
    display::update_version(disp);
}

/// 移除字段
public fun remove_field(
    disp: &mut display::Display<Item>,
) {
    display::remove(disp, std::string::utf8(b"thumbnail_url"));
    display::update_version(disp);
}
```

### 版本号的重要性

每次修改 Display 后，必须调用 `display::update_version` 来递增版本号。客户端通过监听版本变化来决定是否刷新缓存。如果忘记更新版本号，修改可能不会立即生效。

## 创建者特权

Display 的一个重要特性是**创建者特权**——持有 Display 对象的人可以随时全局更新所有同类型对象的展示方式，而无需逐个修改对象本身。

这带来了巨大的灵活性：

- **迁移 CDN**：更换图片服务器时，只需更新 Display 中的 URL 模板
- **修复错误**：发现描述有误，一次修改即可全部生效
- **版本迭代**：随着项目发展，逐步丰富展示内容

```move
module examples::cdn_migration;

use sui::display;
use std::string::String;

public struct NFT has key, store {
    id: UID,
    name: String,
    image_hash: String,
}

/// 迁移到新的 CDN
public fun migrate_cdn(
    disp: &mut display::Display<NFT>,
) {
    // 从旧 CDN 迁移到新 CDN
    display::edit(
        disp,
        std::string::utf8(b"image_url"),
        std::string::utf8(b"https://new-cdn.example.com/nfts/{image_hash}.png"),
    );
    display::update_version(disp);
}
```

## 完整示例：游戏装备系统

```move
module examples::equipment;

use sui::package;
use sui::display;
use std::string::String;

public struct EQUIPMENT has drop {}

public struct Weapon has key, store {
    id: UID,
    name: String,
    weapon_type: String,
    damage: u64,
    rarity: String,
    skin_id: String,
}

public struct Armor has key, store {
    id: UID,
    name: String,
    armor_type: String,
    defense: u64,
    rarity: String,
    skin_id: String,
}

fun init(otw: EQUIPMENT, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    // 为 Weapon 创建 Display
    let mut weapon_display = display::new_with_fields<Weapon>(
        &publisher,
        vector[
            std::string::utf8(b"name"),
            std::string::utf8(b"description"),
            std::string::utf8(b"image_url"),
            std::string::utf8(b"project_url"),
            std::string::utf8(b"creator"),
        ],
        vector[
            std::string::utf8(b"{name} ({rarity})"),
            std::string::utf8(b"A {weapon_type} dealing {damage} damage"),
            std::string::utf8(b"https://game.example.com/weapons/{skin_id}.png"),
            std::string::utf8(b"https://game.example.com"),
            std::string::utf8(b"Game Studio"),
        ],
        ctx,
    );
    display::update_version(&mut weapon_display);

    // 为 Armor 创建 Display
    let mut armor_display = display::new_with_fields<Armor>(
        &publisher,
        vector[
            std::string::utf8(b"name"),
            std::string::utf8(b"description"),
            std::string::utf8(b"image_url"),
            std::string::utf8(b"project_url"),
            std::string::utf8(b"creator"),
        ],
        vector[
            std::string::utf8(b"{name} ({rarity})"),
            std::string::utf8(b"A {armor_type} providing {defense} defense"),
            std::string::utf8(b"https://game.example.com/armors/{skin_id}.png"),
            std::string::utf8(b"https://game.example.com"),
            std::string::utf8(b"Game Studio"),
        ],
        ctx,
    );
    display::update_version(&mut armor_display);

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(weapon_display, ctx.sender());
    transfer::public_transfer(armor_display, ctx.sender());
}
```

## Display 与 CoinMetadata

值得注意的是，`Coin<T>` 类型不使用 Display 标准来展示元数据。代币的元数据（名称、符号、图标等）由 **coin_registry** 管理，存储在链上 **`Currency<T>`** 中（通过 **`coin_registry::new_currency_with_otw` + `finalize`** 创建，而非已废弃的 `coin::create_currency`）。这是因为代币的元数据需求与普通对象不同，需要标准化的字段格式。

## 小结

Object Display 是 Sui 的链下展示标准，它将展示逻辑从对象数据中分离出来，通过模板机制实现了高效、灵活的展示配置。创建 Display 需要 Publisher 权限，确保只有类型的定义者才能设置展示规则。模板语法使用 `{field_name}` 引用对象字段，支持动态 URL 生成和字符串拼接。Display 的创建者特权允许全局更新展示规则，无需修改单个对象，极大地方便了项目的运营和迭代。


---


<!-- source: 09_patterns/display-v2.md -->
## 11.8 Display V2 与 Display Registry

# Object Display V2 与 Display Registry

Display V2 是 Sui 基于 **Display Registry**（系统对象 `0xd`）的新一代对象展示机制，用于解决 V1 依赖事件索引、难以维护以及仅支持 `key` 类型等问题。本节将介绍 V2 的设计动机、与 V1 的对比、核心 API 及迁移方式。

参考：[MystenLabs/sui#23710](https://github.com/MystenLabs/sui/pull/23710)（Display Registry 框架）、[MystenLabs/sui#25753](https://github.com/MystenLabs/sui/pull/25753)（Display V2 文档）。

---

## 为什么需要 Display V2

### V1 的局限

| 问题 | 说明 |
|------|------|
| **索引依赖事件** | V1 通过 `DisplayCreated<T>` 等事件发现 Display，索引器必须正确消费事件并维护状态，难以保证一致性与可恢复性。 |
| **每类型多个 Display** | 同一类型 `T` 可以有多个 `Display<T>` 对象，链下需要决定「用哪一个」，缺乏唯一规范。 |
| **仅支持 `T: key`** | `Display<T>` 要求 `T: key`，无法为「非顶层对象」（如动态字段中的值）定义展示。 |
| **无固定查询点** | 没有像 CoinRegistry 那样「按类型推导地址」的固定查询点，不利于前端与索引器稳定拉取。 |

### V2 的目标

1. **固定查询点**：Display 信息挂在 **DisplayRegistry**（`0xd`）下，通过 **派生地址（derived object）** 或注册表 API 查询，依赖**活对象集**而非事件，索引更简单、可靠。
2. **每类型一个 Display**：每种类型在 registry 下对应**一个** Display 槽位，避免「N 个 Display 选谁」的问题。
3. **支持非 `key` 类型**：V2 不要求 `T: key`，可为更多类型（含非顶层对象）配置展示。
4. **可迁移、可废弃 V1**：提供从 `Display<T>`（V1）和 `Publisher` 迁移到 V2 的路径，以及 V1 的最终废弃与删除。

---

## V1 与 V2 对比

| 维度 | **V1（display.move）** | **V2（display_registry）** |
|------|------------------------|----------------------------|
| **每类型 Display 数量** | 可有 **N 个** `Display<T>` | **1 个**  per type（由 registry + 类型键派生） |
| **发现方式** | **事件**（如 `DisplayCreated<T>`），索引器监听事件 | **派生地址 / 注册表**，固定查找点，基于活对象 |
| **类型约束** | `T: key`（仅顶层对象） | **不要求 `T: key`**，可支持非顶层对象 |
| **存储位置** | 独立 `Display<T>` 对象，由用户/合约持有 | 挂在 **DisplayRegistry**（`0xd`）下，确定性地址 |
| **创建权限** | 需 **Publisher**，创建后对象可转移 | 需 **Publisher** 或内部 **Permit**，创建后可选 **share** |
| **更新权限** | 持有 `Display<T>` 的人 | 持有 **DisplayCap** 的人（claim 自 Publisher 或迁移） |
| **索引与前端** | 依赖事件回溯，易出现漏/重 | 按类型推导或查 registry，行为确定 |

简要结论：V2 用「**一个 registry + 每类型一个 Display + 派生地址**」替代「多个 Display + 事件」，使展示数据可预测、可稳定查询，并为非 `key` 类型和未来扩展（如 init 参数）留出空间。

---

## Display Registry 与系统对象 `0xd`

- **DisplayRegistry** 是 Sui 的**系统级共享对象**，在协议升级时由系统在 epoch 边界创建，地址为 **`0xd`**（与 CoinRegistry `0xc` 类似）。
- 所有 V2 的 Display 都「挂在」该 Registry 下：通过 **derived_object** 分配**确定性派生地址**，在该地址创建 **Display** 对象。当前实现可能为全局单一槽位；后续版本可能按类型 `T` 扩展为「每类型一个」Display，与文档中的「1 per type」一致。
- 链下和前端可以基于 DisplayRegistry 与派生规则（或索引器 API）查询 Display，无需依赖事件。

---

## 核心类型与 API（display_registry）

以下 API 基于 [PR #23710](https://github.com/MystenLabs/sui/pull/23710) 中的 `sui::display_registry` 模块，实际发布时可能有小幅命名或签名调整。

### 类型概览

| 类型 | 说明 |
|------|------|
| **DisplayRegistry** | 系统对象，根命名空间，地址 `0xd`。 |
| **Display** | 实际存储展示字段的对象，含 `fields: VecMap<String, String>`，可选 `cap_id`。 |
| **DisplayCap** | 能力对象：持有者可更新/清空该 Display（set / unset / clear）。 |
| **SystemMigrationCap** | 系统迁移用能力，用于批量把 V1 Display 迁入 V2，用后销毁。 |

### 创建 Display（V2）

**方式一：用 Publisher 创建（推荐）**

```move
use sui::display_registry;
use sui::package::Publisher;

/// 为当前包下的类型在 DisplayRegistry 中创建 V2 Display，并拿到 DisplayCap
public fun create_display_v2(
    registry: &mut DisplayRegistry,
    publisher: &mut Publisher,
    ctx: &mut TxContext,
): (Display, DisplayCap) {
    display_registry::new_with_publisher(registry, publisher, ctx)
}
```

- 要求 `publisher.from_package<T>()` 对要展示的类型 `T` 成立（即该 Publisher 来自定义 `T` 的包）。
- 返回的 **Display** 需要由调用方 **share** 或转移；**DisplayCap** 由调用方持有，用于后续更新。

**方式二：分享 Display**

创建后若希望所有人可读、仅 Cap 持有者可写，可共享 Display：

```move
let (display, cap) = display_registry::new_with_publisher(registry, publisher, ctx);
display_registry::share(display);
// 将 cap 转给需要更新权限的地址
transfer::public_transfer(cap, ctx.sender());
```

### 更新 Display（set / unset / clear）

只有持有 **DisplayCap** 的地址可以修改对应 Display 的字段：

```move
// 设置或覆盖字段
display_registry::set(display, &cap, std::string::utf8(b"name"), std::string::utf8(b"{name}"));
display_registry::set(display, &cap, std::string::utf8(b"image_url"), std::string::utf8(b"https://cdn.example.com/{id}.png"));

// 删除字段
display_registry::unset(display, &cap, std::string::utf8(b"thumbnail_url"));

// 清空所有字段后重新设置
display_registry::clear(display, &cap);
```

模板语法与 V1 一致：使用 `{field_name}` 引用对象字段，在链下渲染时替换。

### 读取 Display

```move
// 只读访问字段表
let fields = display_registry::fields(display);
// 或查询 cap 是否已被 claim
let cap_opt = display_registry::cap_id(display);
```

链下可通过「DisplayRegistry + 类型派生地址」或 RPC/索引器按类型查询到唯一 Display 对象，再读其 `fields`。

---

## 从 V1 迁移到 V2

### 迁移路径一：已有 `Display<T>`（V1）→ 同内容 V2

若链上已存在 V1 的 `Display<T>`，可在 V2 启用后，用其内容在 Registry 中创建 V2 Display，并销毁 V1 对象：

```move
use sui::display_registry;
use sui::display::Display as LegacyDisplay;

/// 将 V1 Display<T> 迁移为 V2，并销毁 V1 对象
public fun migrate_v1_to_v2<T: key>(
    registry: &mut DisplayRegistry,
    legacy: LegacyDisplay<T>,
    ctx: &mut TxContext,
): (Display, DisplayCap) {
    display_registry::migrate_v1_to_v2(registry, legacy, ctx)
}
```

迁移后，V2 的 Display 拥有与 V1 相同的字段内容，Cap 返回给调用方；V1 对象被销毁，不再存在。

### 迁移路径二：先创建空 V2，再 claim Cap（用 V1 或 Publisher）

若希望「先占住」V2 槽位，再通过「交还 V1」或「用 Publisher 证明」来领取 **DisplayCap**：

- **用 V1 领取 Cap**：调用 `display_registry::claim(display, legacy_display, ctx)`，会销毁 V1 并得到 **DisplayCap**；之后可调用 `delete_legacy` 删除其它 V1 副本（若框架支持）。
- **用 Publisher 领取 Cap**：调用 `display_registry::claim_with_publisher(display, publisher, ctx)`，不销毁任何对象，仅证明包所有权并领取 **DisplayCap**。

### 删除 V1 Display（在 Cap 已 claim 之后）

在 V2 的 Display 已存在且其 **DisplayCap** 已被 claim 的前提下，允许删除对应的 V1 对象，避免链上同时存在两套展示数据：

```move
display_registry::delete_legacy(display, legacy_display);
```

---

## 系统迁移（批量 V1 → V2）

协议升级时会创建 **DisplayRegistry** 和 **SystemMigrationCap**。拥有 **SystemMigrationCap** 的地址（如多签系统地址）可调用 **system_migration**，用预置的 keys/values 在 Registry 下创建 Display（通常用于批量导入历史 V1 数据）。迁移脚本只需执行一次；之后各类型可再通过 **migrate_v1_to_v2** 或 **new_with_publisher** 做细粒度创建/更新。**SystemMigrationCap** 在全局迁移完成后可通过 **destroy_system_migration_cap** 销毁。

---

## 标准字段与模板语法（与 V1 一致）

V2 的 Display 仍使用与 V1 相同的**标准字段名**和**模板语法**，便于现有前端与钱包复用：

| 字段 | 用途 |
|------|------|
| `name` | 对象名称 |
| `description` | 描述 |
| `image_url` | 主图 URL |
| `link` | 详情页链接 |
| `project_url` | 项目主页 |
| `creator` | 创建者 |
| `thumbnail_url` | 缩略图 URL |

模板中使用 `{field_name}` 引用对象字段，例如 `"{name}"`、`"https://example.com/{id}.png"`。

---

## 小结

- **Display V2** 基于 **DisplayRegistry**（`0xd`），通过 **derived object** 实现「每类型一个 Display」和**固定查询点**，不再依赖事件索引。
- **V1 vs V2**：V1 允许多个 Display、依赖事件、仅 `T: key`；V2 为每类型一个、按 registry 派生地址查询、不要求 `T: key`。
- 创建使用 **new_with_publisher(registry, publisher, ctx)**，更新使用 **DisplayCap** 配合 **set / unset / clear**；Display 可 **share** 供只读。
- 迁移：**migrate_v1_to_v2** 将 V1 内容迁入 V2 并销毁 V1；**claim** / **claim_with_publisher** 用于在已有 V2 Display 上领取 **DisplayCap**；**delete_legacy** 用于在 Cap 已 claim 后删除 V1 对象。
- 标准字段与模板语法与 V1 一致，便于生态兼容；后续 V1 的 `display.move` 将在独立 PR 中标记废弃并最终移除。


---


<!-- source: 09_patterns/authorization.md -->
## 11.9 授权模式

# 授权模式总结

在前面的章节中，我们分别学习了 Capability 模式、Witness 模式和一次性见证（OTW）模式。这三种模式共同构成了 Move on Sui 中授权体系的基石。本章将对这些模式进行横向对比，分析各自的适用场景，并展示如何组合使用它们来构建安全、灵活的授权架构。

## 三种授权模式回顾

### Capability 模式

**核心思想**：将权限具象化为一个拥有的对象。持有该对象即拥有对应权限。

```move
/// AdminCap 是一个权限对象
public struct AdminCap has key { id: UID }

/// 持有 AdminCap 才能调用
public fun admin_only(_: &AdminCap) {
    // 特权操作
}
```

**特点**：

- 权限是一个链上对象，有明确的生命周期
- 可以转移、销毁、追踪
- 适合持续性的角色授权

### Witness 模式

**核心思想**：通过构造某个类型的实例来证明对该类型的所有权。

```move
/// 只有定义模块能创建 GOLD
public struct GOLD has drop {}

/// 需要 Witness 来创建容器
public fun new_container<T: drop>(_witness: T): Container<T> {
    Container { value: 0 }
}
```

**特点**：

- 利用 Move 的结构体打包规则
- 轻量级，不占用链上存储
- 适合类型级别的一次性授权

### OTW 模式

**核心思想**：系统保证只存在一次的 Witness，用于全局唯一初始化。

```move
/// OTW：模块名大写，仅 drop，无字段
public struct MY_MODULE has drop {}

fun init(otw: MY_MODULE, ctx: &mut TxContext) {
    // 全局唯一的初始化逻辑
}
```

**特点**：

- 系统级保证只创建一次
- 严格的定义规则
- 适合代币创建、Publisher 声明等一次性操作

## 对比分析

### 核心维度对比

| 维度 | Capability | Witness | OTW |
|------|-----------|---------|-----|
| **授权载体** | 链上对象 | 类型实例 | 系统提供的类型实例 |
| **创建次数** | 可多次 | 可多次 | 仅一次 |
| **生命周期** | 持久存在 | 即用即弃 | 即用即弃 |
| **存储开销** | 占用存储 | 无 | 无 |
| **可转移** | ✅ | ❌（绑定模块） | ❌ |
| **可撤销** | ✅（销毁对象） | ❌ | ❌ |
| **授权粒度** | 账户级别 | 类型/模块级别 | 包级别 |
| **运行时检查** | 类型系统检查 | 类型系统检查 | 类型系统 + 运行时检查 |

### 适用场景对比

| 场景 | 推荐模式 | 原因 |
|------|---------|------|
| 管理员权限 | Capability | 需要持续授权，可能需要转移 |
| 角色权限（编辑者、审核者） | Capability | 多角色，需要细粒度控制 |
| 代币创建 | OTW | 必须保证全局唯一 |
| Publisher 声明 | OTW | 系统要求 |
| 泛型工厂 | Witness | 类型级别授权 |
| 插件/扩展系统 | Witness | 模块间的类型证明 |
| 全局配置初始化 | OTW | 只需执行一次 |
| 权限委托 | Capability | 可转移给其他账户 |

## 组合使用模式

在实际项目中，这三种模式经常组合使用。下面是一个综合示例：

```move
module examples::auth_combined;

use std::string::String;

/// Capability：管理员权限
public struct AdminCap has key { id: UID }

/// Witness：类型级别授权
public struct AuthWitness has drop {}

/// OTW：一次性初始化
public struct AUTH_COMBINED has drop {}

/// 注册表：结合多种授权模式
public struct Registry has key {
    id: UID,
    initialized: bool,
}

fun init(otw: AUTH_COMBINED, ctx: &mut TxContext) {
    // OTW 确保只初始化一次
    assert!(sui::types::is_one_time_witness(&otw), 0);

    // 创建管理员能力
    transfer::transfer(
        AdminCap { id: object::new(ctx) },
        ctx.sender(),
    );

    // 创建并共享注册表
    let registry = Registry {
        id: object::new(ctx),
        initialized: true,
    };
    transfer::share_object(registry);
}

/// Cap 守护的操作：需要 AdminCap
public fun admin_action(_: &AdminCap, _registry: &mut Registry) {
    // 只有管理员能执行
}

/// Witness 守护的工厂函数
public fun create_typed<T: drop>(_witness: T, ctx: &mut TxContext): UID {
    object::new(ctx)
}

/// 模块内部使用自己的 Witness
public fun internal_create(ctx: &mut TxContext): UID {
    create_typed(AuthWitness {}, ctx)
}
```

### 实际项目架构示例

一个典型的 NFT 项目可能这样组合使用三种模式：

```move
module examples::nft_project;

use sui::package;
use sui::display;
use std::string::String;

/// OTW - 用于初始化
public struct NFT_PROJECT has drop {}

/// Capability - 管理员权限
public struct AdminCap has key { id: UID }

/// Capability - 铸造权限
public struct MinterCap has key { id: UID }

/// NFT 类型
public struct GameNFT has key, store {
    id: UID,
    name: String,
    level: u64,
    image_id: String,
}

/// 全局配置
public struct Config has key {
    id: UID,
    max_supply: u64,
    current_supply: u64,
    is_minting_active: bool,
}

fun init(otw: NFT_PROJECT, ctx: &mut TxContext) {
    // 1. OTW → Publisher → Display（一次性）
    let publisher = package::claim(otw, ctx);

    let keys = vector[
        std::string::utf8(b"name"),
        std::string::utf8(b"image_url"),
        std::string::utf8(b"description"),
    ];
    let values = vector[
        std::string::utf8(b"{name}"),
        std::string::utf8(b"https://nft.example.com/{image_id}.png"),
        std::string::utf8(b"Level {level} game NFT"),
    ];
    let mut disp = display::new_with_fields<GameNFT>(
        &publisher, keys, values, ctx,
    );
    display::update_version(&mut disp);

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(disp, ctx.sender());

    // 2. Capability → 管理员权限（持续性）
    transfer::transfer(
        AdminCap { id: object::new(ctx) },
        ctx.sender(),
    );

    // 3. 全局配置（一次性创建，共享）
    let config = Config {
        id: object::new(ctx),
        max_supply: 10000,
        current_supply: 0,
        is_minting_active: false,
    };
    transfer::share_object(config);
}

/// AdminCap 守护：授予铸造权
public fun grant_minter(
    _: &AdminCap,
    recipient: address,
    ctx: &mut TxContext,
) {
    transfer::transfer(
        MinterCap { id: object::new(ctx) },
        recipient,
    );
}

/// AdminCap 守护：开启/关闭铸造
public fun toggle_minting(
    _: &AdminCap,
    config: &mut Config,
) {
    config.is_minting_active = !config.is_minting_active;
}

/// MinterCap 守护：铸造 NFT
public fun mint(
    _: &MinterCap,
    config: &mut Config,
    name: String,
    image_id: String,
    recipient: address,
    ctx: &mut TxContext,
) {
    assert!(config.is_minting_active, 0);
    assert!(config.current_supply < config.max_supply, 1);

    config.current_supply = config.current_supply + 1;

    let nft = GameNFT {
        id: object::new(ctx),
        name,
        level: 1,
        image_id,
    };
    transfer::public_transfer(nft, recipient);
}
```

在这个项目中：

- **OTW** 用于创建 Publisher 和 Display（一次性初始化）
- **AdminCap** 用于管理权限（授予铸造权、控制铸造开关）
- **MinterCap** 用于铸造权限（细粒度授权）

## 决策流程

选择授权模式时，可以按以下流程决策：

```
需要授权控制？
│
├── 是否需要一次性初始化？
│   ├── 是 → 使用 OTW
│   │   ├── 创建代币 → coin_registry::new_currency_with_otw + finalize
│   │   ├── 声明 Publisher → package::claim
│   │   └── 全局配置 → 在 init 中创建共享对象
│   │
│   └── 否 → 继续判断
│
├── 是否需要持续性的权限管理？
│   ├── 是 → 使用 Capability
│   │   ├── 单一管理员 → AdminCap
│   │   ├── 多角色 → AdminCap + EditorCap + ViewerCap
│   │   └── 可委托 → 转移 Cap 给其他账户
│   │
│   └── 否 → 继续判断
│
├── 是否需要类型级别的证明？
│   ├── 是 → 使用 Witness
│   │   ├── 泛型工厂 → T: drop 作为参数
│   │   └── 类型注册 → 用 Witness 绑定类型
│   │
│   └── 否 → 可能不需要特殊的授权模式
```

## 授权设计最佳实践

### 1. 最小权限原则

每种 Capability 只授予完成特定任务所需的最低限度权限：

```move
// ✅ 细粒度的权限划分
public struct MinterCap has key { id: UID }   // 只能铸造
public struct BurnerCap has key { id: UID }   // 只能销毁
public struct PauserCap has key { id: UID }   // 只能暂停

// ❌ 过于粗糙的权限
public struct GodCap has key { id: UID }      // 能做一切
```

### 2. 权限层级

建立清晰的权限层级，高级权限可以授予低级权限：

```move
// AdminCap 可以创建 MinterCap 和 BurnerCap
// MinterCap 只能铸造，不能创建其他 Cap
// BurnerCap 只能销毁，不能创建其他 Cap
```

### 3. 组合优于单一

不要试图用一种模式解决所有问题：

```move
// ✅ 组合使用
// OTW → 初始化
// Publisher → Display 和 TransferPolicy
// AdminCap → 业务管理
// Witness → 泛型类型系统

// ❌ 单一模式
// 仅用 AdminCap 做所有事情
```

### 4. 文档化权限要求

通过函数签名和文档清晰表达权限要求：

```move
/// 铸造 NFT
/// 
/// 需要：MinterCap（由 AdminCap 持有者授予）
/// 前置条件：铸造必须处于开启状态
public fun mint(_: &MinterCap, ...) { ... }
```

### 5. 提供撤销机制

对于 Capability 模式，始终提供撤销（销毁）权限的方法：

```move
public fun revoke(_: &AdminCap, cap: MinterCap) {
    let MinterCap { id } = cap;
    id.delete();
}
```

## 小结

Capability、Witness 和 OTW 是 Move on Sui 中三种核心的授权模式。Capability 将权限物化为可管理的对象，适合持续性的角色授权；Witness 利用类型构造权实现轻量级的模块间授权，适合泛型系统；OTW 通过系统级保证实现一次性初始化，是代币创建和 Publisher 声明的基础。在实际项目中，应根据具体需求组合使用这三种模式，遵循最小权限原则，构建安全、灵活、可维护的授权体系。理解这些模式之间的关系和各自的适用场景，是成为 Move on Sui 高级开发者的关键。


---


<!-- source: 10_testing/index.md -->
## 第十二章 · 测试

# 第十二章 · 测试

本章系统讲解 Sui Move 的测试体系，从单元测试到多角色场景测试，从覆盖率到 Gas 分析，帮助你编写高质量的测试代码。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 10.1 | 测试基础 | #[test]、#[expected_failure]、运行命令 |
| 10.2 | 好的测试 | 覆盖正常/异常路径、命名规范 |
| 10.3 | 测试工具函数 | #[test_only] 模块、辅助函数 |
| 10.4 | 模拟交易上下文 | dummy()、自定义 sender |
| 10.5 | 测试场景 | 多角色多交易、take / return |
| 10.6 | 使用系统对象 | Clock、Random 的测试模拟 |
| 10.7 | Builder 模式测试 | 链式构造复杂测试数据 |
| 10.8 | 随机输入测试 | 模糊测试、随机用例生成 |
| 10.9 | 扩展外部模块 | 测试第三方依赖 |
| 10.10 | 覆盖率报告 | 生成和解读覆盖率数据 |
| 10.11 | Gas Profiling | Gas 消耗分析与优化 |

## 学习目标

读完本章后，你将能够：

- 为合约编写全面的单元测试和场景测试
- 使用 Test Scenario 模拟多用户交互
- 分析测试覆盖率和 Gas 消耗


---


<!-- source: 10_testing/testing-basics.md -->
## 12.1 测试基础

# 测试基础

Move 编译器内置了测试框架——测试用 Move 编写，与源代码并存。你只需为函数添加 `#[test]` 注解，编译器就会自动发现并执行它们。测试中的 VM 执行环境与生产环境一致，确保代码语义完全相同。本节将带你掌握编写和运行测试的基本方法。

## 什么是测试？

测试是带有 `#[test]` 属性的函数。测试函数不能接收参数，也不应返回值。当测试函数意外中止（abort）时，测试即为失败。

```move
module book::my_module;

#[test]
fun addition() {
    assert_eq!(2 + 2, 4);
}

#[test]
fun that_aborts() {
    abort // 此测试会失败——意外的 abort
}

#[test, expected_failure]
fun expected_abort() {
    abort // 此测试会通过——abort 在预期之中
}
```

## 运行测试

使用 `sui move test` 命令运行测试。编译器会在 _测试模式_ 下构建包并执行所有发现的测试。

```bash
sui move test
```

输出示例：

```
Running Move unit tests
[ PASS    ] book::my_module::addition
[ FAIL    ] book::my_module::that_aborts
[ PASS    ] book::my_module::expected_abort
Test result: FAILED. Total tests: 3; passed: 2; failed: 1
```

### 过滤测试

可以通过提供过滤字符串来运行特定测试，只有完全限定名中包含该字符串的测试才会执行：

```bash
# 运行名称中含 "addition" 的测试
sui move test addition

# 运行特定模块的所有测试
sui move test my_module

# 运行特定测试
sui move test book::my_module::addition
```

## 期望失败（Expected Failure）

使用 `#[expected_failure]` 测试代码在特定条件下是否会中止。只有函数 abort 时测试才通过；若正常完成则测试失败。

### 基本用法

```move
#[test, expected_failure]
fun division_by_zero() {
    let _ = 1 / 0; // 中止——测试通过
}
```

### 指定中止码

通过指定期望的 abort code 确保函数因正确的原因失败：

```move
module book::errors;

const EInvalidInput: u64 = 1;
const ENotFound: u64 = 2;

public fun validate(x: u64) {
    assert!(x > 0, EInvalidInput);
}

#[test, expected_failure(abort_code = EInvalidInput)]
fun validate_zero_fails() {
    validate(0); // 以 EInvalidInput 中止——测试通过
}

#[test, expected_failure(abort_code = ENotFound)]
fun wrong_error_code() {
    validate(0); // 以 EInvalidInput 中止而非 ENotFound——测试失败
}
```

### 指定中止位置

使用 `location` 指定 abort 应发生在哪个模块中：

```move
#[test, expected_failure(abort_code = EInvalidInput, location = book::errors)]
fun abort_location() {
    validate(0);
}

#[test, expected_failure(abort_code = 1, location = Self)]
fun abort_in_self() {
    abort 1
}
```

## 仅测试代码（Test-Only Code）

标记为 `#[test_only]` 的代码只在测试模式下编译，适用于测试工具函数、辅助导入等不应出现在生产代码中的内容。

### 仅测试导入

```move
#[test_only]
use std::unit_test::assert_eq;

#[test]
fun with_assert_eq() {
    assert_eq!(2 + 2, 4);
}
```

### 仅测试函数

```move
#[test_only]
fun setup_test_data(): vector<u64> {
    vector[1, 2, 3, 4, 5]
}

#[test]
fun sum() {
    let data = setup_test_data();
    let mut sum = 0;
    data.do!(|x| sum = sum + x);
    assert_eq!(sum, 15);
}
```

### 仅测试常量与模块

```move
#[test_only]
const TEST_ADDRESS: address = @0xCAFE;

#[test_only]
module book::test_helpers;
public fun create_test_scenario(): u64 { 42 }
```

## 常用 CLI 选项

| 选项 | 描述 |
| --- | --- |
| `<filter>` | 只运行匹配过滤字符串的测试 |
| `--coverage` | 收集覆盖率信息 |
| `--trace` | 生成 LCOV 追踪数据 |
| `--statistics` | 显示 Gas 消耗统计 |
| `--threads <n>` | 并行测试线程数 |
| `--rand-num-iters <n>` | 随机测试的迭代次数 |
| `--seed <n>` | 可复现的随机种子 |

## 测试失败输出

当测试失败时，输出会包含测试名称、FAIL 状态、abort code、失败位置和调用栈：

```
┌── test_that_failed ──────
│ error[E11001]: test failure
│    ┌─ ./sources/module.move:15:9
│    │
│ 15 │         assert!(balance == 100);
│    │         ^^^^^^^^^^^^^^^^^^^^^^^ Test was not expected to error, but it
│    │         aborted with code 1 originating in the module 0x0::module
│
└──────────────────
```

## 小结

- 使用 `#[test]` 标注测试函数，`sui move test` 运行所有测试
- `#[expected_failure]` 用于验证代码是否正确地 abort，可指定 abort code 和 location
- `#[test_only]` 标记仅在测试模式下编译的代码，适合放置辅助函数和导入
- 通过过滤字符串可精确运行特定测试，CLI 提供覆盖率、统计等丰富选项


---


<!-- source: 10_testing/good-tests.md -->
## 12.2 好的测试长什么样

# 好的测试特征

编写测试是一回事，编写 _好的_ 测试是另一回事。一个仅仅存在但无法真正发现 bug 的测试套件只会带来虚假的安全感。本节将介绍区分高效测试与形式测试的原则和实践，帮助你写出简洁、可读、可维护的智能合约测试。

## 好测试的特征

### 1. 测试应当简洁

每个测试应简短明了，聚焦于单一行为或场景。避免编写过长、过于复杂的测试。

### 2. 测试应当可读

测试是代码行为的文档。任何人阅读测试时都应能快速理解：正在测试什么场景、期望的结果是什么。推荐使用 Arrange-Act-Assert 模式：

```move
#[test]
fun add_increases_balance_by_specified_amount() {
    // Arrange: 准备初始状态
    let mut balance = balance::new(100);

    // Act: 执行被测操作
    balance.add(50);

    // Assert: 验证期望结果
    assert_eq!(balance.value(), 150);
}
```

### 3. 每个测试只测一件事

每个测试应验证单一行为。当测试失败时，你应立即知道是什么出了问题。

```move
module book::single_responsibility;

public struct Counter has copy, drop { value: u64 }

public fun increment(c: &mut Counter) { c.value = c.value + 1; }
public fun decrement(c: &mut Counter) { c.value = c.value - 1; }

#[test_only]
use std::unit_test::assert_eq;

#[test]
fun increment_adds_one() {
    let mut counter = Counter { value: 0 };
    counter.increment();
    assert_eq!(counter.value, 1);
}

#[test]
fun decrement_subtracts_one() {
    let mut counter = Counter { value: 1 };
    counter.decrement();
    assert_eq!(counter.value, 0);
}
```

## 测试什么

### 测试合约行为，而非实现

关注函数的可观察行为——它返回什么、产生什么副作用——而非内部实现细节。这允许你在重构实现时不破坏测试。

### 测试边界条件

边界条件是 bug 的高发区。对于数值运算应考虑：

- 零值
- 最大值（`U64_MAX`、`U128_MAX`）
- 边界条件（off-by-one 错误）
- 空集合

```move
module book::edge_cases;

public fun safe_divide(a: u64, b: u64): u64 {
    if (b == 0) return 0;
    a / b
}

#[test_only]
use std::unit_test::assert_eq;

#[test]
fun divide_normal_case() {
    assert_eq!(safe_divide(10, 2), 5);
}

#[test]
fun divide_by_zero_returns_zero() {
    assert_eq!(safe_divide(10, 0), 0);
}

#[test]
fun divide_zero_by_nonzero() {
    assert_eq!(safe_divide(0, 5), 0);
}
```

### 测试异常路径

验证代码在非法输入下是否正确失败。使用 `#[expected_failure]` 验证函数是否以正确的错误码中止：

```move
module book::error_conditions;

const EInsufficientBalance: u64 = 1;

public struct Wallet has copy, drop { balance: u64 }

public fun withdraw(wallet: &mut Wallet, amount: u64) {
    assert!(wallet.balance >= amount, EInsufficientBalance);
    wallet.balance = wallet.balance - amount;
}

#[test_only]
use std::unit_test::assert_eq;

#[test]
fun withdraw_succeeds_with_sufficient_balance() {
    let mut wallet = Wallet { balance: 100 };
    wallet.withdraw(50);
    assert_eq!(wallet.balance, 50);
}

#[test, expected_failure(abort_code = EInsufficientBalance)]
fun withdraw_fails_with_insufficient_balance() {
    let mut wallet = Wallet { balance: 50 };
    wallet.withdraw(100);
}
```

## 测试组织

### 使用描述性命名

测试名称应描述场景和预期结果。推荐命名规范：`test_<函数>_<场景>_<预期结果>`。

```move
// 好的命名
fun withdraw_with_zero_balance_aborts() { ... }
fun transfer_to_self_succeeds() { ... }

// 差的命名
fun test1() { ... }
fun withdraw() { ... }
```

### 分组组织测试

按函数或特性逻辑分组测试。在 Move 中，可以将测试放在与被测代码相同的模块中，也可以放在独立的 `tests/` 目录中的 `*_tests.move` 文件里。

## 测试金字塔

一个平衡的测试套件通常遵循测试金字塔：

1. **单元测试**（基础）：大量小型、快速的测试，验证独立的函数
2. **集成测试**（中间）：较少的测试，验证组件如何协同工作
3. **端到端测试**（顶部）：少量测试，验证完整的用户场景

在 Move 中所有测试都以单元测试形式实现，但通过 Test Scenario 可以在单个测试中测试多个交易和用户操作。

## 常见测试错误

### 只测试正常路径

不要只测试代码在一切正确时的表现。务必测试非法输入、边界条件和错误情况下的行为。

### 过度模拟

虽然隔离性很重要，但过度模拟可能导致测试通过但真实集成却失败。在单元测试和使用真实组件的集成测试之间取得平衡。

### 忽视测试维护

测试也是代码。保持它们整洁，删除过时的测试，在需求变更时更新它们。被忽视的测试套件会成为负担而非资产。

## 追求合理的覆盖率

高测试覆盖率是积极的指标，但不应成为编写测试的唯一目标。仅为提高覆盖率而存在的测试——却不验证有意义的行为——只会带来虚假的信心。**先写有意义的测试，好的覆盖率自然而来。**

## 小结

- 好的测试应简洁、可读、每次只测一件事
- 遵循 Arrange-Act-Assert 模式组织测试代码
- 全面测试正常路径、异常路径和边界条件
- 使用描述性命名，按功能分组组织测试
- 追求合理覆盖率但不以数字为目标，测试也需要维护


---


<!-- source: 10_testing/test-utilities.md -->
## 12.3 测试工具函数

# 测试工具函数

除了内置的 `assert!` 宏之外，Move 标准库还提供了常用的测试工具。最重要的工具定义在 `std::unit_test` 模块中。本节将介绍这些工具函数的用法，以及如何设计 `#[test_only]` 辅助函数让测试更高效。

## assert! 宏

`assert!` 是内置的语言特性，是验证测试条件的最基本工具。它接受一个布尔表达式，当表达式为 `false` 时中止执行。

```move
#[test]
fun addition() {
    let sum = 2 + 2;
    assert_eq!(sum, 4);
}
```

在发布的代码中 `assert!` 通常需要第二个参数作为 abort code，但在测试代码中这不是必要的：

```move
// 生产代码中——需要 abort code
assert!(balance >= amount, EInsufficientBalance);

// 测试代码中——abort code 可选
assert!(balance >= amount);
```

## assert_eq! 和 assert_ref_eq!

`assert!` 的局限是：失败时只知道条件为 false，不知道实际值是什么。`assert_eq!` 解决了这个问题——失败时会打印两个比较值：

```move
use std::unit_test::assert_eq;

#[test]
fun test_balance_update() {
    let balance = calculate_balance();
    assert_eq!(balance, 1000); // 失败时显示: "Assertion failed: 750 != 1000"
}
```

按引用比较时使用 `assert_ref_eq!`：

```move
use std::unit_test::assert_ref_eq;

#[test]
fun test_reference_equality() {
    let user = get_user();
    let expected = create_expected_user();
    assert_ref_eq!(&user, &expected);
}
```

## 黑洞函数：destroy

`destroy` 函数可以消耗任何值，无论它具有什么 ability。这对于测试没有 `drop` ability 的类型至关重要：

```move
module book::ticket;

public struct Ticket has key, store {
    id: UID,
    event_id: u64,
    seat: u64,
}

public fun new(event_id: u64, seat: u64, ctx: &mut TxContext): Ticket {
    Ticket { id: object::new(ctx), event_id, seat }
}
```

在测试中使用 `destroy` 清理不可 drop 的值：

```move
use sui::test_utils::destroy;

#[test]
fun ticket_creation() {
    let mut ctx = tx_context::dummy();
    let ticket = ticket::new(1, 42, &mut ctx);

    // 验证通过——但如何处理 ticket？
    destroy(ticket); // 消耗 ticket
}
```

> `destroy` 函数只在测试代码中可用，不能在生产模块中使用。

## 设计 #[test_only] 辅助函数

### 命名规范

建议为仅测试函数添加 `_for_testing` 后缀，便于区分生产代码和测试代码：

```move
#[test_only]
public fun create_wallet_for_testing(balance: u64): Wallet {
    Wallet { balance }
}

#[test_only]
public fun get_balance_for_testing(wallet: &Wallet): u64 {
    wallet.balance
}
```

### 测试辅助模块

可以创建独立的测试辅助模块来集中管理测试工具：

```move
#[test_only]
module book::test_helpers;

use book::game::{Self, GameState};

public fun setup_game_for_testing(ctx: &mut TxContext): GameState {
    let state = game::new(ctx);
    // 设置初始状态...
    state
}

public fun advance_rounds_for_testing(
    state: &mut GameState,
    rounds: u64,
    ctx: &mut TxContext
) {
    let mut i = 0;
    while (i < rounds) {
        game::play_round(state, ctx);
        i = i + 1;
    }
}
```

### 可见性设计

`#[test_only]` 函数通常设为 `public` 或 `public(package)` 可见性，以便其他模块的测试也能调用。由于测试代码在生产构建中被剥离，这不会影响包的公共 API。

```move
#[test_only]
public fun mint_test_coin_for_testing(
    amount: u64,
    ctx: &mut TxContext
): Coin<MY_TOKEN> {
    // 创建测试用代币
    coin::mint_for_testing<MY_TOKEN>(amount, ctx)
}
```

## 小结

- `assert!` 是最基本的断言工具，测试中可省略 abort code
- `assert_eq!` 在失败时打印两个比较值，推荐在测试中优先使用
- `destroy` 函数是"黑洞"，可消耗任何类型的值，解决测试中的清理问题
- 使用 `#[test_only]` 标记辅助函数和模块，建议添加 `_for_testing` 后缀
- 测试辅助函数通常设为 `public` 可见性，方便跨模块测试调用


---


<!-- source: 10_testing/mock-transaction-context.md -->
## 12.4 模拟交易上下文

# 模拟 TxContext

大多数创建对象或与用户交互的 Move 函数都需要 `TxContext` 参数。交易执行时其值由运行时提供，但在测试中你需要自行创建和传递。`sui::tx_context` 模块提供了多个工具函数来满足这一需求。本节将详细介绍如何在测试中创建和操控交易上下文。

## 创建 Dummy 上下文

最简单的方式是 `tx_context::dummy()`，它创建一个具有默认值的上下文——发送者为零地址、epoch 为 0、固定的交易哈希：

```move
use std::unit_test::assert_eq;

#[test]
fun create_object() {
    let mut ctx = tx_context::dummy();
    let obj = my_module::new(&mut ctx);

    assert_eq!(ctx.sender(), @0); // 默认发送者是 0x0
    // ...
}
```

这对大多数不关心具体上下文值的测试来说已足够。

## 自定义上下文

当需要指定发送者、epoch 或时间戳时，使用 `tx_context::new`：

```move
use std::unit_test::assert_eq;

#[test]
fun with_specific_sender() {
    let sender = @0xA;
    let tx_hash = x"3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532";
    let epoch = 5;
    let epoch_timestamp_ms = 1234567890000;
    let ids_created = 0;

    let mut ctx = tx_context::new(
        sender,
        tx_hash,
        epoch,
        epoch_timestamp_ms,
        ids_created,
    );

    assert_eq!(ctx.sender(), @0xA);
    assert_eq!(ctx.epoch(), 5);
}
```

### 使用 new_from_hint 简化哈希

`tx_hash` 必须恰好 32 字节。使用 `new_from_hint` 可从简单整数生成唯一哈希：

```move
#[test]
fun with_hint() {
    let mut ctx = tx_context::new_from_hint(
        @0xA,    // sender
        42,      // hint（用于生成唯一的 tx_hash）
        5,       // epoch
        1000,    // epoch_timestamp_ms
        0,       // ids_created
    );
    // ...
}
```

## 追踪创建的对象

在测试对象创建时，你可能需要验证创建了多少对象，或获取最后创建的对象 ID：

```move
use std::unit_test::assert_eq;

#[test]
fun object_creation_count() {
    let mut ctx = tx_context::dummy();

    assert_eq!(ctx.ids_created(), 0);

    let obj1 = my_module::new(&mut ctx);
    assert_eq!(ctx.ids_created(), 1);

    let obj2 = my_module::new(&mut ctx);
    assert_eq!(ctx.ids_created(), 2);

    let last_id = ctx.last_created_object_id();
    // ...
}
```

## 模拟时间和 Epoch

对于依赖时间或 epoch 变化的测试，使用递增函数：

```move
use std::unit_test::assert_eq;

#[test]
fun time_dependent_logic() {
    let mut ctx = tx_context::dummy();

    // 初始状态
    assert_eq!(ctx.epoch(), 0);
    assert_eq!(ctx.epoch_timestamp_ms(), 0);

    // 模拟 epoch 变化
    ctx.increment_epoch_number();
    assert_eq!(ctx.epoch(), 1);

    // 模拟时间流逝（增加 1 天的毫秒数）
    ctx.increment_epoch_timestamp(24 * 60 * 60 * 1000);
    assert_eq!(ctx.epoch_timestamp_ms(), 86_400_000);
}
```

## 完全控制：create

需要完全控制所有上下文字段（包括 Gas 相关参数）时，使用 `tx_context::create`：

```move
use std::unit_test::assert_eq;

#[test]
fun with_full_context() {
    let ctx = &tx_context::create(
        @0xA,                                        // sender
        tx_context::dummy_tx_hash_with_hint(1),      // tx_hash
        10,                                          // epoch
        1700000000000,                               // epoch_timestamp_ms
        0,                                           // ids_created
        1000,                                        // reference_gas_price
        1500,                                        // gas_price
        10_000_000,                                  // gas_budget
        option::none(),                              // sponsor
    );

    assert_eq!(ctx.gas_budget(), 10_000_000);
}
```

## 函数速查表

| 函数 | 用途 |
| --- | --- |
| `dummy()` | 快速创建简单测试用上下文 |
| `new()` | 自定义 sender、epoch 或时间戳 |
| `new_from_hint()` | 类似 `new` 但从整数生成 tx_hash |
| `create()` | 完全控制包括 Gas 参数在内的所有字段 |
| `ids_created()` | 检查已创建的对象数量 |
| `last_created_object_id()` | 获取最近创建的对象 ID |
| `increment_epoch_number()` | 模拟 epoch 推进 |
| `increment_epoch_timestamp()` | 模拟时间流逝 |

## 小结

- `tx_context::dummy()` 适合大多数简单测试，创建零地址发送者的默认上下文
- `tx_context::new()` 和 `new_from_hint()` 用于需要特定发送者或时间的场景
- `tx_context::create()` 提供完全控制，包括 Gas 预算和赞助者
- 这些工具仅适合简单单元测试；多交易场景应使用 Test Scenario


---


<!-- source: 10_testing/test-scenario.md -->
## 12.5 测试场景（Test Scenario）

# Test Scenario

`test_scenario` 模块来自 Sui Framework，提供了在测试中模拟多交易场景的能力。它维护一个全局对象池视图，允许你测试对象如何在多个交易中被创建、转移和访问。这是 Sui Move 测试框架中最强大的工具之一。

## 启动和结束场景

测试场景以 `test_scenario::begin` 开始，接受发送者地址作为参数。场景必须以 `test_scenario::end` 结束以清理资源：

```move
use sui::test_scenario;

#[test]
fun basic_scenario() {
    let alice = @0xA;

    let mut scenario = test_scenario::begin(alice);

    // ... 执行操作 ...

    scenario.end();
}
```

> 每个测试中应只有一个 scenario。在同一测试中创建多个 scenario 可能产生意外结果。

## 交易模拟

使用 `next_tx` 推进到指定发送者的新交易。在前一个交易中转移的对象在下一个交易中变为可用：

```move
use sui::test_scenario;

#[test]
fun multi_transaction() {
    let alice = @0xA;
    let bob = @0xB;

    let mut scenario = test_scenario::begin(alice);

    // 第一笔交易：alice 创建对象

    // 推进到第二笔交易，bob 作为发送者
    let _effects = scenario.next_tx(bob);

    // ... bob 现在可以访问转移给他的对象 ...

    scenario.end();
}
```

> 在交易中转移的对象只有在调用 `next_tx` 后才可用。你不能在同一笔交易中访问刚转移的对象。

## 访问拥有的对象

转移到某地址的对象可以用 `take_from_sender` 或 `take_from_address` 获取，用完后通过 `return_to_sender` 或 `return_to_address` 归还：

```move
module book::test_scenario_example;

public struct Item has key, store {
    id: UID,
    value: u64,
}

public fun create(value: u64, ctx: &mut TxContext): Item {
    Item { id: object::new(ctx), value }
}

public fun value(item: &Item): u64 { item.value }

#[test]
fun take_and_return() {
    use std::unit_test::assert_eq;
    use sui::test_scenario;

    let alice = @0xA;
    let mut scenario = test_scenario::begin(alice);

    // 交易 1：创建一个 Item 并转移给 alice
    {
        let item = create(100, scenario.ctx());
        transfer::public_transfer(item, alice);
    };

    // 交易 2：alice 取出该 Item
    scenario.next_tx(alice);
    {
        let item = scenario.take_from_sender<Item>();
        assert_eq!(item.value(), 100);
        scenario.return_to_sender(item);
    };

    scenario.end();
}
```

### 按 ID 取对象

当存在多个同类型对象时，使用 `take_from_sender_by_id` 取出特定对象：

```move
#[test]
fun take_by_id() {
    use std::unit_test::assert_eq;
    use sui::test_scenario;

    let alice = @0xA;
    let mut scenario = test_scenario::begin(alice);

    let item1 = create(100, scenario.ctx());
    let item2 = create(200, scenario.ctx());
    let id1 = object::id(&item1);

    transfer::public_transfer(item1, alice);
    transfer::public_transfer(item2, alice);

    scenario.next_tx(alice);
    {
        let item = scenario.take_from_sender_by_id<Item>(id1);
        assert_eq!(item.value(), 100);
        scenario.return_to_sender(item);
    };

    scenario.end();
}
```

### 检查对象是否存在

```move
// 在取对象前可以检查是否存在
assert!(scenario.has_most_recent_for_sender<Item>());
```

## 访问共享对象

共享对象使用 `take_shared` 获取，必须用 `return_shared` 归还：

```move
module book::shared_counter;

public struct Counter has key {
    id: UID,
    value: u64,
}

public fun create(ctx: &mut TxContext) {
    transfer::share_object(Counter {
        id: object::new(ctx),
        value: 0,
    })
}

public fun increment(counter: &mut Counter) {
    counter.value = counter.value + 1;
}

public fun value(counter: &Counter): u64 { counter.value }

#[test]
fun shared_object() {
    use std::unit_test::assert_eq;
    use sui::test_scenario;

    let alice = @0xA;
    let bob = @0xB;
    let mut scenario = test_scenario::begin(alice);

    // Alice 创建共享计数器
    create(scenario.ctx());

    // Bob 递增
    scenario.next_tx(bob);
    {
        let mut counter = scenario.take_shared<Counter>();
        counter.increment();
        assert_eq!(counter.value(), 1);
        test_scenario::return_shared(counter);
    };

    // Alice 再次递增
    scenario.next_tx(alice);
    {
        let mut counter = scenario.take_shared<Counter>();
        counter.increment();
        assert_eq!(counter.value(), 2);
        test_scenario::return_shared(counter);
    };

    scenario.end();
}
```

## 访问不可变对象

冻结的对象使用 `take_immutable` 获取，用 `return_immutable` 归还：

```move
module book::immutable_config;

public struct Config has key {
    id: UID,
    max_value: u64,
}

public fun create(max_value: u64, ctx: &mut TxContext) {
    transfer::freeze_object(Config {
        id: object::new(ctx),
        max_value,
    })
}

public fun max_value(config: &Config): u64 { config.max_value }

#[test]
fun immutable_object() {
    use std::unit_test::assert_eq;
    use sui::test_scenario;

    let alice = @0xA;
    let mut scenario = test_scenario::begin(alice);

    create(1000, scenario.ctx());

    scenario.next_tx(alice);
    {
        let config = scenario.take_immutable<Config>();
        assert_eq!(config.max_value(), 1000);
        test_scenario::return_immutable(config);
    };

    scenario.end();
}
```

## 读取交易效果（Transaction Effects）

`next_tx` 和 `end` 都返回 `TransactionEffects`，包含交易期间发生的信息：

```move
#[test]
fun transaction_effects() {
    use std::unit_test::assert_eq;
    use sui::test_scenario;

    let alice = @0xA;
    let bob = @0xB;
    let mut scenario = test_scenario::begin(alice);

    let item1 = create(100, scenario.ctx());
    let item2 = create(200, scenario.ctx());
    transfer::public_transfer(item1, alice);
    transfer::public_transfer(item2, bob);

    let effects = scenario.next_tx(alice);

    assert_eq!(effects.created().length(), 2);
    assert_eq!(effects.transferred_to_account().size(), 2);
    assert_eq!(effects.num_user_events(), 0);

    scenario.end();
}
```

### 效果字段一览

| 方法 | 返回类型 | 描述 |
| --- | --- | --- |
| `created()` | `vector<ID>` | 本交易创建的对象 |
| `written()` | `vector<ID>` | 本交易修改的对象 |
| `deleted()` | `vector<ID>` | 本交易删除的对象 |
| `transferred_to_account()` | `VecMap<ID, address>` | 转移到地址的对象 |
| `shared()` | `vector<ID>` | 本交易共享的对象 |
| `frozen()` | `vector<ID>` | 本交易冻结的对象 |
| `num_user_events()` | `u64` | 发出的事件数 |

## Epoch 和时间操作

使用 `next_epoch` 和 `later_epoch` 测试依赖时间的逻辑：

```move
#[test]
fun epoch_advancement() {
    use std::unit_test::assert_eq;
    use sui::test_scenario;

    let alice = @0xA;
    let mut scenario = test_scenario::begin(alice);

    assert_eq!(scenario.ctx().epoch(), 0);

    scenario.next_epoch(alice);
    assert_eq!(scenario.ctx().epoch(), 1);

    // 同时推进 epoch 和时间
    scenario.later_epoch(1000, alice);
    assert_eq!(scenario.ctx().epoch(), 2);
    assert_eq!(scenario.ctx().epoch_timestamp_ms(), 1000);

    scenario.end();
}
```

## 完整示例：代币转移流程

```move
module book::simple_token;

public struct Token has key, store {
    id: UID,
    amount: u64,
}

public fun mint(amount: u64, ctx: &mut TxContext): Token {
    Token { id: object::new(ctx), amount }
}

public fun amount(token: &Token): u64 { token.amount }

#[test]
fun token_transfer_flow() {
    use std::unit_test::assert_eq;
    use sui::test_scenario;

    let admin = @0xAD;
    let alice = @0xA;
    let bob = @0xB;

    let mut scenario = test_scenario::begin(admin);

    // Admin 为 alice 铸造代币
    {
        let token = mint(1000, scenario.ctx());
        transfer::public_transfer(token, alice);
    };

    // Alice 接收并转移给 bob
    scenario.next_tx(alice);
    {
        assert!(scenario.has_most_recent_for_sender<Token>());
        let token = scenario.take_from_sender<Token>();
        assert_eq!(token.amount(), 1000);
        transfer::public_transfer(token, bob);
    };

    // Bob 接收代币
    scenario.next_tx(bob);
    {
        let token = scenario.take_from_sender<Token>();
        assert_eq!(token.amount(), 1000);
        scenario.return_to_sender(token);
    };

    scenario.end();
}
```

## 函数速查表

| 函数 | 用途 |
| --- | --- |
| `begin(sender)` | 启动新场景 |
| `end(scenario)` | 结束场景并获取最终效果 |
| `next_tx(scenario, sender)` | 推进到下一笔交易 |
| `ctx(scenario)` | 获取 TxContext 可变引用 |
| `take_from_sender<T>` | 从发送者取出拥有的对象 |
| `return_to_sender(obj)` | 归还对象给发送者 |
| `take_shared<T>` | 取出共享对象 |
| `return_shared(obj)` | 归还共享对象 |
| `take_immutable<T>` | 取出不可变对象 |
| `return_immutable(obj)` | 归还不可变对象 |
| `create_system_objects` | 创建 Clock、Random、DenyList |
| `next_epoch` | 推进到下一个 epoch |
| `later_epoch(ms, sender)` | 推进 epoch 并设置时间 |

## 小结

- `test_scenario` 是 Sui Move 中模拟多交易场景的核心工具
- 使用 `begin`/`end` 创建和结束场景，`next_tx` 推进交易
- 对象按所有权类型分别用 `take_from_sender`、`take_shared`、`take_immutable` 获取
- `TransactionEffects` 提供交易结果的详细信息
- `next_epoch` 和 `later_epoch` 用于测试时间相关逻辑


---


<!-- source: 10_testing/using-system-objects.md -->
## 12.6 使用系统对象

# 使用系统对象

某些测试需要系统对象如 `Clock`、`Random` 或 `DenyList`。这些对象在网络上拥有固定地址，在创世时创建。但在测试中它们默认不存在，因此 Sui Framework 提供了 `#[test_only]` 函数来创建和操控它们。

## Clock

`Clock` 提供当前网络时间戳。使用 `clock::create_for_testing` 创建，并通过测试专用函数操控时间：

```move
use std::unit_test::assert_eq;
use sui::clock;
use sui::test_utils::destroy;

#[test]
fun clock() {
    let mut ctx = tx_context::dummy();
    let mut clock = clock::create_for_testing(&mut ctx);

    // 初始时间为 0
    assert_eq!(clock.timestamp_ms(), 0);

    // 增加时间（毫秒）
    clock.increment_for_testing(1000);
    assert_eq!(clock.timestamp_ms(), 1000);

    // 设置绝对时间（必须 >= 当前时间）
    clock.set_for_testing(5000);
    assert_eq!(clock.timestamp_ms(), 5000);

    // 清理——Clock 没有 drop ability
    destroy(clock);
}
```

### 在 Test Scenario 中共享 Clock

```move
#[test]
fun shared_clock() {
    let mut ctx = tx_context::dummy();
    let clock = clock::create_for_testing(&mut ctx);
    clock.share_for_testing();
}
```

## Random

`Random` 对象提供链上随机性。推荐的做法是让核心逻辑接受 `RandomGenerator` 参数，这样在单元测试中可以直接创建 generator，绕过 `Random` 对象：

```move
use sui::random::{Self, Random, RandomGenerator};

entry fun my_entry_function(r: &Random, ctx: &mut TxContext) {
    let mut gen = random::new_generator(r, ctx);
    let result = inner_function(&mut gen);
    result.destroy_or!(abort);
}

public(package) fun inner_function(gen: &mut RandomGenerator): Option<u64> {
    if (gen.generate_bool()) {
        option::some(gen.generate_u64())
    } else {
        option::none()
    }
}

#[test]
fun simple_random() {
    // 确定性结果，总是相同的值
    let mut gen = random::new_generator_for_testing();
    assert!(inner_function(&mut gen).is_none());

    // 确定性结果（相同种子可复现）
    let seed = b"Arbitrary seed bytes";
    let mut gen = random::new_generator_from_seed_for_testing(seed);
    assert!(inner_function(&mut gen).is_some());
}
```

### 在 Test Scenario 中使用完整 Random 对象

```move
use sui::random::{Self, Random};
use sui::test_scenario;

#[test]
fun random_shared() {
    let mut scenario = test_scenario::begin(@0x0);

    random::create_for_testing(scenario.ctx());
    scenario.next_tx(@0x0);

    let mut random = scenario.take_shared<Random>();

    // 初始化随机状态（使用前必须）
    random.update_randomness_state_for_testing(
        0,
        x"1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F",
        scenario.ctx(),
    );

    my_entry_function(&random, scenario.ctx());

    test_scenario::return_shared(random);
    scenario.end();
}
```

## DenyList

`DenyList` 用于受监管代币的地址黑名单。使用 `new_for_testing` 创建本地实例，或 `create_for_testing` 创建共享实例：

```move
use sui::deny_list;
use sui::test_scenario;
use sui::test_utils::destroy;

#[test]
fun deny_list() {
    let mut scenario = test_scenario::begin(@0x0);

    // 创建本地实例用于简单测试
    let deny_list = deny_list::new_for_testing(scenario.ctx());
    destroy(deny_list);

    // 或创建共享的 DenyList
    deny_list::create_for_testing(scenario.ctx());
    scenario.next_tx(@0x0);
    // ... take_shared 并使用

    scenario.end();
}
```

## Coin 和 Balance

使用 `coin::mint_for_testing` 和 `balance::create_for_testing` 创建测试用代币：

```move
use std::unit_test::assert_eq;
use sui::coin;
use sui::balance;
use sui::sui::SUI;

#[test]
fun coins() {
    let mut ctx = tx_context::dummy();

    // 创建任意类型的代币
    let coin = coin::mint_for_testing<SUI>(1000, &mut ctx);
    assert_eq!(coin.value(), 1000);

    // 销毁并取回值
    let value = coin.burn_for_testing();
    assert_eq!(value, 1000);

    // 直接创建 Balance
    let balance = balance::create_for_testing<SUI>(500);
    let value = balance.destroy_for_testing();
    assert_eq!(value, 500);
}
```

## 一次创建所有系统对象

在 Test Scenario 中使用 `create_system_objects` 一次性创建所有系统对象（Clock、Random、DenyList）：

```move
use sui::clock::Clock;
use sui::random::Random;
use sui::deny_list::DenyList;
use sui::test_scenario;

#[test]
fun with_all_system_objects() {
    let mut scenario = test_scenario::begin(@0xA);

    // 一次性创建 Clock、Random 和 DenyList
    scenario.create_system_objects();
    scenario.next_tx(@0xA);

    let clock = scenario.take_shared<Clock>();
    let random = scenario.take_shared<Random>();
    let deny_list = scenario.take_shared<DenyList>();

    // ... 使用这些对象 ...

    test_scenario::return_shared(clock);
    test_scenario::return_shared(random);
    test_scenario::return_shared(deny_list);

    scenario.end();
}
```

> 测试中创建的系统对象不会拥有与活跃网络上相同的固定地址。使用 `take_shared<T>()` 按类型而非按 ID 来访问它们。

## 速查表

| 对象 | 创建方式 | 测试专用功能 |
| --- | --- | --- |
| `Clock` | `clock::create_for_testing(ctx)` | `increment_for_testing`, `set_for_testing` |
| `Random` | `random::create_for_testing(ctx)` | `update_randomness_state_for_testing` |
| `RandomGenerator` | `random::new_generator_for_testing()` | `new_generator_from_seed_for_testing` |
| `DenyList` | `deny_list::create_for_testing(ctx)` | `new_for_testing` |
| `Coin<T>` | `coin::mint_for_testing<T>(value, ctx)` | `burn_for_testing` |
| `Balance<T>` | `balance::create_for_testing<T>(value)` | `destroy_for_testing` |
| 全部系统对象 | `scenario.create_system_objects()` | 创建 Clock、Random、DenyList |

## 小结

- 系统对象在测试中默认不存在，需要通过 `*_for_testing` 函数创建
- `Clock` 可通过 `increment_for_testing` 和 `set_for_testing` 操控时间
- `Random` 推荐通过 `RandomGenerator` 方式测试，避免 `entry` 函数的限制
- `coin::mint_for_testing` 和 `balance::create_for_testing` 是创建测试代币的便捷方式
- `create_system_objects` 可在 Test Scenario 中一次性创建所有系统对象


---


<!-- source: 10_testing/builder-pattern.md -->
## 12.7 Builder 模式测试

# Builder 模式测试

Builder 模式用于以灵活、可读的方式构造具有多个参数的复杂对象。它通过方法调用逐步积累配置，在调用 `build()` 时产生最终对象。这一模式在测试中尤为有用——你经常需要创建仅有细微差异的对象，同时保持大多数字段使用合理的默认值。

> Builder 模式在发布代码中可能因中间结构体和多次函数调用而增加 Gas 成本。此模式最适合测试场景，其中可读性和可维护性比 Gas 消耗更重要。

## 定义 Builder

Builder 结构体镜像目标对象的字段，但使用 `Option` 类型包装。典型的 Builder 提供：

- `new()` 创建空 Builder
- Setter 方法配置各字段并返回 Builder 用于链式调用
- `build()` 使用默认值填充未设置的字段，构造最终对象

```move
module book::user;

public struct User has copy, drop {
    name: String,
    balance: u64,
    is_active: bool,
    level: u8,
}
```

对应的 Builder：

```move
#[test_only]
module book::user_builder;

use book::user::User;

public struct UserBuilder has copy, drop {
    name: Option<String>,
    balance: Option<u64>,
    is_active: Option<bool>,
    level: Option<u8>,
}

public fun new(): UserBuilder {
    UserBuilder {
        name: option::none(),
        balance: option::none(),
        is_active: option::none(),
        level: option::none(),
    }
}

public fun name(mut self: UserBuilder, name: String): UserBuilder {
    self.name = option::some(name);
    self
}

public fun balance(mut self: UserBuilder, balance: u64): UserBuilder {
    self.balance = option::some(balance);
    self
}

public fun is_active(mut self: UserBuilder, is_active: bool): UserBuilder {
    self.is_active = option::some(is_active);
    self
}

public fun level(mut self: UserBuilder, level: u8): UserBuilder {
    self.level = option::some(level);
    self
}

public fun build(self: UserBuilder): User {
    User {
        name: self.name.destroy_or!(b"default".to_string()),
        balance: self.balance.destroy_or!(0),
        is_active: self.is_active.destroy_or!(true),
        level: self.level.destroy_or!(1),
    }
}
```

## 使用示例

### 没有 Builder 时

每个测试必须指定所有字段，即使只有一个字段与测试相关：

```move
#[test]
fun inactive_user_without_builder() {
    let user = User {
        name: b"Alice".to_string(),
        balance: 0,
        is_active: false,  // 只关心这个字段
        level: 1,
    };
    assert!(!user.is_active);
}
```

### 使用 Builder 后

测试变得聚焦且自文档化：

```move
#[test]
fun inactive_user_with_builder() {
    let user = user_builder::new()
        .is_active(false)
        .build();
    assert!(!user.is_active);
}

#[test]
fun high_level_user() {
    let user = user_builder::new()
        .name(b"Hero".to_string())
        .level(99)
        .build();
    assert_eq!(user.level, 99);
}
```

每个测试清楚地展示了哪个字段是关键的。向 `User` 添加新字段时只需更新 Builder 的 `build()` 函数添加默认值——现有测试无需修改。

## 方法链

流畅 Builder 语法的关键是方法链。每个 setter 方法通过值取得 `mut self` 的所有权，修改后返回修改过的 Builder：

```move
public fun is_active(mut self: UserBuilder, is_active: bool): UserBuilder {
    self.is_active = option::some(is_active);
    self
}
```

链式调用的每个方法消耗前一个 Builder 并返回新的 Builder，最终 `build()` 消耗 Builder 产生目标对象：

```move
let user = user_builder::new()
    .name(b"Alice".to_string())
    .balance(1000)
    .is_active(true)
    .build();
```

## 系统包中的使用

Sui Framework 和 Sui System 包广泛使用 Builder 模式进行测试：

### ValidatorBuilder

```move
use sui_system::validator_builder;

#[test]
fun validator_operations() {
    let validator = validator_builder::preset()
        .name("My Validator")
        .gas_price(1000)
        .commission_rate(500) // 5%
        .initial_stake(100_000_000)
        .build(ctx);
    // 测试验证器操作...
}
```

### TxContextBuilder

```move
use sui::test_scenario as ts;

#[test]
fun epoch_dependent_logic() {
    let mut test = ts::begin(@0x1);
    let ctx = test
        .ctx_builder()
        .set_epoch(100)
        .set_epoch_timestamp(1000000)
        .build();
    // 测试依赖 epoch 的逻辑...
    test.end();
}
```

## 小结

- Builder 模式通过 setter 方法积累配置，通过 `build()` 产生最终对象
- 使用 `Option` 字段使配置可选，在 `build()` 中提供合理默认值
- 方法链（`fun method(mut self, ...): Self`）创建流畅的 API
- Builder 减少测试样板代码，将测试与目标结构体的变更隔离
- 此模式最适合用于测试工具，可读性比 Gas 成本更重要的场景


---


<!-- source: 10_testing/random-test.md -->
## 12.8 随机输入测试

# 随机输入测试

Move 编译器支持通过 `#[random_test]` 属性运行带有随机输入的测试。这实现了基于属性的测试（Property-based Testing），让测试使用随机生成的值多次运行，自动发现你可能想不到的边界情况。

> `#[random_test]` 是编译器的测试输入特性，与链上随机性的 `sui::random` 模块是不同的概念。

## 基本用法

用 `#[random_test]` 标记函数并声明原始类型参数。测试运行器会在运行时为每个参数生成随机值：

```move
module book::math;

public fun safe_add(a: u64, b: u64): u64 {
    if (a > 0xFFFFFFFFFFFFFFFF - b) {
        0xFFFFFFFFFFFFFFFF // 饱和到最大值
    } else {
        a + b
    }
}

#[random_test]
fun safe_add_never_overflows(a: u64, b: u64) {
    let result = safe_add(a, b);
    // 结果应始终 >= 两个输入（无溢出回绕）
    assert!(result >= a && result >= b);
}
```

## 支持的类型

| 类型 | 生成范围 |
| --- | --- |
| `u8`, `u16`, `u32`, `u64`, `u128`, `u256` | 类型的完整范围 |
| `bool` | `true` 或 `false` |
| `address` | 随机 32 字节地址 |
| `vector<T>` | 随机长度、随机元素 |

其中 `vector<T>` 的 `T` 必须是原始类型或另一个 vector。

## 实用技巧

### 约束大整数

如果函数期望较小的值，使用小类型并做类型转换：

```move
#[random_test]
fun with_bounded_input(small: u8) {
    let bounded = (small as u64) % 100; // 0-99 范围
    // ... 使用 bounded 值测试
}
```

### 避免无界 vector

`vector<u8>` 可能生成非常大的 vector，导致测试缓慢或 Gas 错误。优先使用固定大小的输入：

```move
// 避免：可能生成巨大 vector
#[random_test]
fun bad(v: vector<u8>) { /* ... */ }

// 更好：控制大小
#[random_test]
fun good(a: u8, b: u8, c: u8) {
    let v = vector[a, b, c];
    // ... 使用已知大小的 vector 测试
}
```

### 与定向测试互补

随机测试发现意外的边界情况，但可能遗漏特定场景。与定向单元测试配合使用：

```move
use std::unit_test::assert_eq;

// 定向测试：特定场景
#[test]
fun add_zero() {
    assert_eq!(safe_add(std::u64::max(), 0), std::u64::max());
}

// 随机测试：通用属性
#[random_test]
fun add_commutative(a: u64, b: u64) {
    assert_eq!(safe_add(a, b), safe_add(b, a));
}
```

### 使用 assert_eq! 改善调试

随机测试失败时，你需要知道哪些值导致了失败。`assert_eq!` 会在失败时打印两个比较值：

```move
use std::unit_test::assert_eq;

#[random_test]
fun double(value: u64) {
    let doubled = value * 2;
    // 失败时显示: "Assertion failed: <actual> != <expected>"
    assert_eq!(doubled / 2, value);
}
```

## 控制测试运行

### 迭代次数

默认情况下随机测试会以不同输入运行多次。使用 `--rand-num-iters` 控制迭代次数：

```bash
# 每个随机测试运行 100 次
sui move test --rand-num-iters 100
```

### 可复现的种子

当随机测试失败时，输出会包含种子和复现说明：

```
┌── test_that_failed ────── (seed = 2033439370411573084)
│ ...
│ This test uses randomly generated inputs. Rerun with
│ `sui move test test_that_failed --seed 2033439370411573084`
│ to recreate this test failure.
└──────────────────
```

使用提供的种子精确复现失败：

```bash
sui move test test_that_failed --seed 2033439370411573084
```

## 局限性

- **无范围约束**：不能直接限制随机值到特定范围，需用取模或类型转换
- **Vector 大小**：无法控制生成的 vector 长度

## 小结

- 使用 `#[random_test]`（非 `#[test]`）启用函数参数的随机化输入
- 参数必须是原始类型或原始类型的 vector
- 使用小类型和类型转换约束输入，避免极端值
- 使用 `assert_eq!` 获得更好的失败诊断信息
- 通过 `--rand-num-iters` 控制迭代次数，`--seed` 复现失败
- 随机测试是定向单元测试的补充，而非替代


---


<!-- source: 10_testing/extend-foreign-module.md -->
## 12.9 扩展外部模块

# 扩展外部模块测试

当测试依赖外部包的代码时，你经常需要为这些包定义的类型创建测试数据。然而许多库不提供测试工具函数，导致你无法构造测试所需的对象。模块扩展（Module Extensions）通过允许你向外部模块添加仅测试函数来解决这个问题。

## 问题背景

假设你的应用使用 Pyth Network 的价格预言机。代码依赖 Pyth 包中的 `PriceInfoObject` 来获取资产价格：

```move
module app::trading;

use pyth::price_info::PriceInfoObject;

public fun execute_trade(price_info: &PriceInfoObject, amount: u64): u64 {
    let price = get_price(price_info);
    amount * price / 1_000_000
}
```

要测试 `execute_trade`，你需要一个 `PriceInfoObject`。但 Pyth 的 Sui 实现没有提供 `create_price_info_for_testing` 函数——获取 `PriceInfoObject` 的唯一方式是通过实际的预言机更新，这在单元测试中不可行。

## 什么是扩展？

扩展允许你向现有模块（甚至外部包中的模块）添加函数。扩展的函数可以访问模块的私有类型，并能创建、读取或修改它们：

```move
#[test_only]
extend module pyth::price_info;

// 现在可以定义有权访问 pyth::price_info
// 私有类型和函数的函数
```

扩展的特性：

- **仅可添加**：只能添加新声明，不能修改或删除已有项
- **局部于你的包**：不影响下游依赖或原始包
- **需要模式属性**：最常用 `#[test_only]` 用于测试
- **强大**：可完全访问被扩展模块的内部，如同代码直接写在该模块中

## 解决方案

创建一个扩展文件为 `PriceInfoObject` 添加测试辅助函数：

```move
// tests/extensions/pyth_price_info_ext.move
#[test_only]
extend module pyth::price_info;

public fun new_price_info_object_for_testing(
    price_info: PriceInfo,
    ctx: &mut TxContext,
): PriceInfoObject {
    PriceInfoObject {
        id: object::new(ctx),
        price_info,
    }
}
```

现在可以编写正确的单元测试：

```move
#[test_only]
module app::trading_tests;

use app::trading;
use pyth::price_info;
use std::unit_test::assert_eq;
use sui::test_utils::destroy;

#[test]
fun execute_trade_with_price() {
    let mut ctx = tx_context::dummy();

    let price_info = price_info::new_price_info_object_for_testing(
        /* ... */
        &mut ctx,
    );

    let result = trading::execute_trade(&price_info, 1000);
    assert_eq!(result, 50_000);

    destroy(price_info);
}
```

## 项目结构

建议将扩展放在专用文件夹中：

```
my_project/
├── sources/
│   └── trading.move
├── tests/
│   ├── extensions/
│   │   └── pyth_price_info_ext.move
│   └── trading_tests.move
└── Move.toml
```

## 扩展自己的模块

扩展不限于外部包——也可以扩展自己包中的模块。这对于添加测试辅助函数而不在生产代码中塞满 `#[test_only]` 函数很有用：

```move
#[test_only]
extend module app::trading;

public fun get_internal_value(/* ... */): u64 {
    // 访问私有字段用于测试
}

#[test]
fun test_internal_invariant() {
    // 测试可以和辅助函数共存于扩展中
}
```

## 其他用例

- **创建和销毁具有私有字段的对象**：当依赖不暴露类型构造器时
- **通过公共访问器暴露内部状态**：需要在测试中验证内部不变量时
- **模拟行为**：需要模拟正常难以达到的特定状态时
- **测试错误条件**：需要创建无效状态来测试错误处理时

## 限制

- **需要模式属性**：扩展必须有如 `#[test_only]` 的模式属性
- **仅可添加**：只能添加新声明，不能修改、覆盖或遮蔽已有项
- **仅根包有效**：只有根包中定义的扩展会被应用；依赖中的扩展会被忽略
- **Edition 兼容**：扩展代码受目标模块的 edition 特性约束
- **Edition 要求**：扩展需要 `2024.alpha` 或更高版本

## 小结

- 模块扩展允许向外部模块添加 `#[test_only]` 函数，解决无法构造外部类型测试数据的问题
- 使用 `extend module` 关键字，扩展可访问目标模块的所有私有内容
- 扩展是仅添加的、局部于包的，且需要模式属性
- 建议在 `tests/extensions/` 目录中组织扩展文件
- 也可用于扩展自己的模块，保持生产代码整洁


---


<!-- source: 10_testing/coverage.md -->
## 12.10 覆盖率报告

# 覆盖率报告

代码覆盖率是衡量测试期间代码哪些部分被执行的指标。它帮助识别未测试的代码路径，确保你的测试是全面的。`sui move test` 的 `--coverage` 标志用于生成覆盖率数据，`sui move coverage` 提供分析工具。

## 运行带覆盖率的测试

```bash
sui move test --coverage
```

这会运行所有测试并收集覆盖率信息。覆盖率数据存储在 `build` 目录中。

## 覆盖率摘要

`sui move coverage summary` 显示所有模块的覆盖率概览：

```bash
sui move coverage summary
```

输出示例：

```
+-------------------------+
| Move Coverage Summary   |
+-------------------------+
Module 0x0::my_module
>>> % Module coverage: 85.71
Module 0x0::another_module
>>> % Module coverage: 100.00
Module 0x0::untested_module
>>> % Module coverage: 0.00
+-------------------------+
| % Move Coverage: 62.50  |
+-------------------------+
```

### 按函数查看

```bash
sui move coverage summary --summarize-functions
```

### CSV 格式输出

```bash
sui move coverage summary --csv
```

## 源代码覆盖率

查看特定模块哪些行被执行：

```bash
sui move coverage source --module <MODULE_NAME>
```

这会显示带有覆盖率注解的源代码，指出哪些行被覆盖（在测试中执行过），哪些未被覆盖。

## LCOV 格式

对于与外部工具和 CI/CD 流水线集成，可以生成 LCOV 格式报告。

### 生成 LCOV 报告

首先运行带 `--trace` 标志的测试：

```bash
sui move test --coverage --trace
```

然后生成 LCOV 报告：

```bash
sui move coverage lcov
```

这会在当前目录创建 `lcov.info` 文件。

### 生成 HTML 报告

使用 `genhtml` 从 LCOV 文件生成 HTML 报告：

```bash
genhtml lcov.info -o coverage_html
```

可在浏览器中打开 `coverage_html` 目录查看交互式覆盖率报告。

### 差异覆盖率

查看特定测试独占覆盖的代码行：

```bash
sui move coverage lcov --differential-test <TEST_NAME>
```

### 单测覆盖率

仅生成单个测试的覆盖率：

```bash
sui move coverage lcov --only-test <TEST_NAME>
```

## 字节码覆盖率

高级调试时可查看反汇编字节码的覆盖率：

```bash
sui move coverage bytecode --module <MODULE_NAME>
```

## 可视化工具集成

LCOV 格式兼容多种覆盖率可视化工具：

- **genhtml** — 生成 HTML 覆盖率报告
- **VS Code Coverage Gutters** — 在编辑器中可视化覆盖率
- **Codecov / Coveralls** — 上传到覆盖率跟踪服务

## 命令速查表

| 命令 | 描述 |
| --- | --- |
| `sui move test --coverage` | 运行测试并收集覆盖率数据 |
| `sui move test --coverage --trace` | 运行测试并生成追踪数据（LCOV 所需） |
| `sui move coverage summary` | 显示每个模块的覆盖率百分比 |
| `sui move coverage summary --summarize-functions` | 按函数分解显示覆盖率 |
| `sui move coverage summary --csv` | CSV 格式输出覆盖率摘要 |
| `sui move coverage source --module <NAME>` | 显示模块的逐行覆盖率 |
| `sui move coverage lcov` | 生成 LCOV 报告 |
| `sui move coverage bytecode --module <NAME>` | 显示字节码覆盖率 |

## 小结

- 使用 `--coverage` 标志收集测试覆盖率数据
- `sui move coverage summary` 提供模块级和函数级的覆盖率概览
- `sui move coverage source` 显示逐行覆盖情况，帮助定位未测试的代码路径
- LCOV 格式支持与 CI/CD、HTML 报告、编辑器插件等外部工具集成
- 差异覆盖率分析可了解每个测试的独特贡献


---


<!-- source: 10_testing/gas-profiling.md -->
## 12.11 Gas Profiling

# Gas 分析

理解 Gas 消耗有助于优化 Move 代码并估算交易成本。Move 测试框架提供了内置工具来测量测试执行期间的 Gas 使用量，此外还有 `sui analyze-trace` 工具用于更深入的分析。

> `-s` 显示的统计数据仅反映**计算单元**，不包括存储成本。编译器计算单元不直接映射到实际的链上 Gas 费用，它们展示的是相对计算复杂度，适合在不同实现之间比较。要获取实际 Gas 成本，请发布到测试网并测量真实交易。

## 简单测量：测试统计

使用 `-s` 或 `--statistics` 标志查看每个测试的执行时间和 Gas 消耗：

```bash
sui move test -s
```

输出示例：

```
Test Statistics:

┌──────────────────────────────────────────┬────────────┬───────────────────┐
│               Test Name                  │    Time    │     Gas Used      │
├──────────────────────────────────────────┼────────────┼───────────────────┤
│ book::my_module::test_simple_operation   │   0.003    │         1         │
├──────────────────────────────────────────┼────────────┼───────────────────┤
│ book::my_module::test_complex_operation  │   0.011    │        59         │
├──────────────────────────────────────────┼────────────┼───────────────────┤
│ book::my_module::test_with_objects       │   0.008    │        25         │
└──────────────────────────────────────────┴────────────┴───────────────────┘
```

### CSV 输出

导入到电子表格或用于程序化分析：

```bash
sui move test -s csv
```

```
test_name,time_ns,gas_used
book::my_module::test_simple_operation,3381750,1
book::my_module::test_complex_operation,8454125,59
book::my_module::test_with_objects,3905625,25
```

## Gas 限制

使用 `-i` 或 `--gas-limit` 设置测试的最大 Gas 预算，超出限制的测试会超时：

```bash
sui move test -i 50
```

```
[ PASS    ] book::my_module::test_simple_operation
[ TIMEOUT ] book::my_module::test_complex_operation
[ PASS    ] book::my_module::test_with_objects
```

适用场景：

- **识别昂贵操作**：发现消耗意外大量 Gas 的测试
- **强制 Gas 预算**：确保关键路径保持在可接受的限制内
- **测试 Gas 耗尽**：验证代码正确处理 Gas 不足的情况

## 比较不同实现

使用统计数据比较不同实现的 Gas 消耗：

```move
module book::comparison;

use std::unit_test::assert_eq;

public fun sum_loop(n: u64): u64 {
    let mut sum = 0;
    n.do!(|i| sum = sum + i);
    sum
}

public fun sum_formula(n: u64): u64 {
    n * (n - 1) / 2
}

#[test]
fun sum_loop_100() {
    let result = sum_loop(100);
    assert_eq!(result, 4950);
}

#[test]
fun sum_formula_100() {
    let result = sum_formula(100);
    assert_eq!(result, 4950);
}
```

运行统计分析揭示差异：

```bash
sui move test -s comparison
```

```
┌────────────────────────────────────┬────────────┬───────────┐
│           Test Name                │    Time    │  Gas Used │
├────────────────────────────────────┼────────────┼───────────┤
│ book::comparison::sum_loop_100     │   0.005    │    201    │
├────────────────────────────────────┼────────────┼───────────┤
│ book::comparison::sum_formula_100  │   0.002    │      3    │
└────────────────────────────────────┴────────────┴───────────┘
```

数学公式比循环节省了约 66 倍的计算量！

## 追踪分析（Trace Analysis）

对于更深入的性能分析，可以生成执行追踪并用 speedscope 可视化。

### 步骤 1：生成追踪

```bash
sui move test --trace
```

追踪文件写入包构建目录下的 `traces/` 文件夹。

### 步骤 2：生成 Gas 概况

```bash
sui analyze-trace -p traces/<TRACE_FILE> gas-profile
```

输出 `gas_profile_<TRACE_FILE>.json` 文件。

### 步骤 3：使用 Speedscope 可视化

```bash
npm install -g speedscope
speedscope gas_profile_<TRACE_FILE>.json
```

Speedscope 提供三种视图：

- **Time Order**：按调用顺序从左到右展示调用栈，条形宽度对应 Gas 消耗
- **Left Heavy**：将重复调用分组，按总 Gas 消耗排序——适合找到最昂贵的代码路径
- **Sandwich**：列出每个函数的 Gas 消耗，含 **Total**（包括被调用函数）和 **Self**（仅函数本身）

## Gas 优化策略

基于分析结果的常见优化方向：

1. **用数学公式替代循环**：如上例所示
2. **减少对象创建**：每个 `object::new` 都有成本
3. **选择高效数据结构**：`VecMap` 适合小集合，`Table` 适合大集合
4. **避免不必要的拷贝**：使用引用而非值传递
5. **批量操作**：将多个小操作合并为少量大操作

## 小结

- 使用 `sui move test -s` 获取每个测试的 Gas 消耗统计
- `--gas-limit` 可设置 Gas 上限，识别昂贵操作
- Gas 统计适合比较不同实现的计算效率
- `sui analyze-trace` 配合 speedscope 提供函数级的 Gas 消耗火焰图
- 注意：编译器 Gas 单元与实际链上费用不同，适合做相对比较


---


# ==================== 应用篇 ====================



---


<!-- source: 11_tokens/index.md -->
## 第十三章 · 代币经济

# 第十三章 · 代币经济

本章讲解如何在 Sui 上创建和管理各种类型的代币，从标准 Coin 到受监管代币再到闭环 Token。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 11.1 | 创建自定义 Coin | OTW + coin_registry（new_currency_with_otw / finalize）、铸造与销毁 |
| 11.2 | Coin 元数据 | 名称、符号、精度、图标 |
| 11.3 | Treasury Cap 管理 | 固定供应 vs 无限供应、锁定策略 |
| 11.4 | 受监管代币 | DenyCap、黑名单、合规设计 |
| 11.5 | 闭环代币 | Token vs Coin、TokenPolicy、消费规则 |
| 11.6 | 游戏内代币实战 | 积分系统、双币经济、代币兑换 |

## 学习目标

读完本章后，你将能够：

- 创建并发布自己的代币
- 实现固定供应和受监管的代币逻辑
- 设计游戏内的代币经济系统


---


<!-- source: 11_tokens/custom-coin.md -->
## 13.1 创建自定义 Coin

# 创建自定义 Coin

Sui 的 **coin_registry** 与 **coin** 模块提供了标准化的同质化代币创建机制。通过 **`coin_registry::new_currency_with_otw`** 与 **`finalize`**，你可以在模块初始化时创建代币并将元数据注册到链上（旧 API **`coin::create_currency`** 已废弃）。本节介绍如何从零开始创建一个自定义 Coin。

## Coin 标准概述

Sui 上的 Coin 标准基于以下核心概念：

- **One-Time Witness (OTW)**：一次性见证者，确保代币类型只能被创建一次
- **TreasuryCap**：铸造权凭证，持有者可以铸造和销毁代币
- **Currency / MetadataCap**：元数据由链上 **CoinRegistry** 的 **Currency<T>** 管理，**MetadataCap<T>** 用于更新元数据

## 定义代币类型

首先定义一个一次性见证者结构体。它必须与模块名同名（大写），且只有 `drop` ability：

```move
module silver::silver;

use std::string;
use sui::coin::{Self, TreasuryCap, Coin};
use sui::coin_registry;

/// One-Time Witness，必须与模块名同名
public struct SILVER() has drop;
```

## 创建代币

在 `init` 函数中使用 **`coin_registry::new_currency_with_otw`** 与 **`finalize`** 创建代币：

```move
const DECIMALS: u8 = 9;

fun init(otw: SILVER, ctx: &mut TxContext) {
    let (initializer, treasury_cap) = coin_registry::new_currency_with_otw<SILVER>(
        otw,
        DECIMALS,
        string::utf8(b"SILVER"),
        string::utf8(b"Silver"),
        string::utf8(b"Silver, commonly used by heroes"),
        string::utf8(b"https://example.com/silver.png"),
        ctx,
    );
    let metadata_cap = coin_registry::finalize(initializer, ctx);

    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(metadata_cap, ctx.sender());
}
```

### 参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `otw` | `SILVER` | 一次性见证者，证明这是首次创建 |
| `decimals` | `u8` | 精度，9 表示最小单位为 10^-9 |
| `symbol` | `String` | 代币符号，如 `string::utf8(b"SILVER")` |
| `name` | `String` | 代币名称 |
| `description` | `String` | 代币描述 |
| `icon_url` | `String` | 图标 URL，无图标可传 `string::utf8(b"")` |
| `ctx` | `&mut TxContext` | 交易上下文 |

### 返回值

- **new_currency_with_otw** 返回 `(CurrencyInitializer<T>, TreasuryCap<T>)`
- **finalize(initializer, ctx)** 消耗 initializer 并返回 **MetadataCap<T>**；元数据写入链上 **Currency<T>**

## 铸造代币

使用 `TreasuryCap` 铸造新代币：

```move
public fun mint_silver(
    treasury_cap: &mut TreasuryCap<SILVER>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let coin = coin::mint(treasury_cap, amount, ctx);
    transfer::public_transfer(coin, recipient);
}
```

## 销毁代币

使用 `TreasuryCap` 销毁代币：

```move
public fun burn_silver(
    treasury_cap: &mut TreasuryCap<SILVER>,
    coin: Coin<SILVER>,
) {
    coin::burn(treasury_cap, coin);
}
```

## 查询总供应量

```move
public fun total_supply(treasury_cap: &TreasuryCap<SILVER>): u64 {
    treasury_cap.total_supply()
}
```

## 测试

测试中可使用 **`coin_registry::finalize_for_testing`** 得到 `(Currency, MetadataCap)`，或直接使用 **finalize** 得到 `MetadataCap` 并断言 `treasury_cap.total_supply()` 等：

```move
#[test_only]
use std::string;
use sui::coin::Coin;
use sui::coin_registry;

#[test]
fun create_currency() {
    let mut ctx = tx_context::dummy();
    let (initializer, treasury_cap) = coin_registry::new_currency_with_otw<SILVER>(
        SILVER(), DECIMALS,
        string::utf8(b"SILVER"),
        string::utf8(b"Silver"),
        string::utf8(b"Silver, commonly used by heroes"),
        string::utf8(b"https://example.com/silver.png"),
        &mut ctx,
    );
    let (currency, _metadata_cap) = coin_registry::finalize_for_testing(initializer, &mut ctx);

    assert_eq!(treasury_cap.total_supply(), 0);
    assert_eq!(coin_registry::decimals(&currency), DECIMALS);
    assert_eq!(coin_registry::name(&currency), string::utf8(b"Silver"));
    assert_eq!(coin_registry::symbol(&currency), string::utf8(b"SILVER"));
}

#[test]
fun mint_and_burn() {
    let amount = 10_000_000_000;
    let mut ctx = tx_context::dummy();
    let (initializer, mut treasury_cap) = coin_registry::new_currency_with_otw<SILVER>(
        SILVER(), DECIMALS,
        string::utf8(b"SILVER"),
        string::utf8(b"Silver"),
        string::utf8(b"Silver, commonly used by heroes"),
        string::utf8(b""),
        &mut ctx,
    );
    let _ = coin_registry::finalize_for_testing(initializer, &mut ctx);

    let coin = coin::mint(&mut treasury_cap, amount, &mut ctx);
    assert_eq!(coin::value(&coin), amount);
    assert_eq!(treasury_cap.total_supply(), amount);

    coin::burn(&mut treasury_cap, coin);
    assert_eq!(treasury_cap.total_supply(), 0);
}
```

## 小结

- Coin 标准通过 **`coin_registry::new_currency_with_otw` + `finalize`** 创建（**`coin::create_currency`** 已废弃），需要 One-Time Witness 确保唯一性
- **TreasuryCap** 是铸造权凭证，持有者可铸造和销毁代币
- 元数据由链上 **Currency<T>** 管理，**MetadataCap<T>** 用于更新；链下/索引器可通过 CoinRegistry 查询
- `init` 函数是创建代币的标准位置，在模块发布时自动执行
- 代币精度（decimals）决定了最小单位，9 是最常用的精度值


---


<!-- source: 11_tokens/coin-metadata.md -->
## 13.2 Coin 元数据

# Coin 元数据

每个 Coin 类型都有对应的 `CoinMetadata` 对象，存储代币的名称、符号、精度、描述和图标等信息。元数据通常在代币创建时设置，然后冻结为不可变对象供全链查询。本节将深入介绍 Coin 元数据的各个方面。

## CoinMetadata 结构

`CoinMetadata` 是一个 Sui 对象，包含以下字段：

```move
public struct CoinMetadata<phantom T> has key, store {
    id: UID,
    decimals: u8,
    name: string::String,
    symbol: ascii::String,
    description: string::String,
    icon_url: Option<Url>,
}
```

### 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `decimals` | `u8` | 精度，决定最小可分割单位 |
| `name` | `String` | 代币全名，如 "Silver" |
| `symbol` | `ascii::String` | 代币符号（ASCII），如 "SILVER" |
| `description` | `String` | 代币描述文本 |
| `icon_url` | `Option<Url>` | 代币图标的 URL |

## 精度（Decimals）

精度决定了代币的最小可分割单位。最常见的精度值：

- **9**：最常用，1 个代币 = 10^9 个最小单位（类似 SUI 的精度）
- **6**：类似 USDC/USDT
- **0**：不可分割的代币（如积分、票据）

```move
// 精度为 9 时：
// 1 SILVER = 1_000_000_000 (10^9) 最小单位
// 0.5 SILVER = 500_000_000

// 精度为 6 时：
// 1 USDC = 1_000_000 (10^6) 最小单位

// 精度为 0 时：
// 1 POINT = 1（不可分割）
```

## 创建元数据

**`coin::create_currency` 已废弃**。应使用 **`coin_registry::new_currency_with_otw`** 与 **`coin_registry::finalize`**：元数据会写入链上 `CoinRegistry` 的 `Currency<T>`，并返回 **`MetadataCap<T>`** 用于后续更新。

```move
use std::string;
use sui::coin_registry;

fun init(otw: MY_TOKEN, ctx: &mut TxContext) {
    let (initializer, treasury_cap) = coin_registry::new_currency_with_otw<MY_TOKEN>(
        otw,
        9,                                  // 精度
        string::utf8(b"MYT"),               // 符号
        string::utf8(b"My Token"),          // 名称
        string::utf8(b"A demo token on Sui"), // 描述
        string::utf8(b"https://example.com/icon.png"), // 图标 URL
        ctx,
    );
    let metadata_cap = coin_registry::finalize(initializer, ctx);
    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(metadata_cap, ctx.sender());
}
```

## 读取元数据

使用新 API 时，元数据存储在 `CoinRegistry` 的 **`Currency<T>`** 中。需要通过 `CoinRegistry` 按类型 `T` 取到对应 `Currency` 后，用 **`coin_registry::decimals` / `name` / `symbol` / `description` / `icon_url`** 读取：

```move
use sui::coin_registry;

public fun display_info<T>(registry: &CoinRegistry, currency: &Currency<T>) {
    let decimals = coin_registry::decimals(currency);
    let name = coin_registry::name(currency);
    let symbol = coin_registry::symbol(currency);
    let description = coin_registry::description(currency);
    let icon_url = coin_registry::icon_url(currency);
}
```

（旧版 **`CoinMetadata<T>`** 仍可用于已用 `create_currency` 创建的老代币，通过 `get_decimals()`、`get_name()` 等读取。）

## 更新元数据

使用新 API 时，持有 **`MetadataCap<T>`** 的人可通过 **`coin_registry::set_*`** 更新链上 `Currency<T>` 的元数据：

```move
use sui::coin_registry;

public fun update_description<T>(
    currency: &mut Currency<T>,
    metadata_cap: &MetadataCap<T>,
    new_description: std::string::String,
) {
    coin_registry::set_description(currency, metadata_cap, new_description);
}

public fun update_name<T>(
    currency: &mut Currency<T>,
    metadata_cap: &MetadataCap<T>,
    new_name: std::string::String,
) {
    coin_registry::set_name(currency, metadata_cap, new_name);
}

public fun update_icon_url<T>(
    currency: &mut Currency<T>,
    metadata_cap: &MetadataCap<T>,
    new_url: std::string::String,
) {
    coin_registry::set_icon_url(currency, metadata_cap, new_url);
}
```

> `Currency` 由 `CoinRegistry` 管理；若调用 **`coin_registry::delete_metadata_cap`** 删除 `MetadataCap`，则之后无法再更新该代币元数据。

## 元数据的处理策略（新 API）

使用 **coin_registry** 时，元数据在链上 `Currency<T>` 中，由 `CoinRegistry` 管理：

- **MetadataCap** 转移给发行方，持有者可调用 `coin_registry::set_name` 等更新元数据。
- 若不再需要更新，可调用 **`coin_registry::delete_metadata_cap`** 永久删除 `MetadataCap`，此后该代币元数据不可再改。

（旧 API 下可将 `CoinMetadata` 冻结或转移，新 API 下不再单独冻结元数据对象。）

## 测试元数据

使用 **coin_registry** 时，测试中可用 **`coin_registry::create_coin_data_registry_for_testing`** 创建测试用 Registry，用 **`finalize_for_testing`** 得到 `(Currency, MetadataCap)`，再通过 **`coin_registry::decimals(currency)`** 等读取：

```move
#[test]
fun metadata_fields() {
    use std::string;
    use std::unit_test::assert_eq;
    use std::unit_test::destroy;
    use sui::coin_registry;

    let mut ctx = tx_context::dummy();
    let (initializer, _treasury_cap) = coin_registry::new_currency_with_otw<MY_TOKEN>(
        MY_TOKEN(), 6,
        string::utf8(b"MYT"),
        string::utf8(b"My Token"),
        string::utf8(b"A demo token"),
        string::utf8(b""),
        &mut ctx,
    );
    let (currency, metadata_cap) = coin_registry::finalize_for_testing(initializer, &mut ctx);

    assert_eq!(coin_registry::decimals(&currency), 6);
    assert_eq!(coin_registry::symbol(&currency), string::utf8(b"MYT"));
    assert_eq!(coin_registry::name(&currency), string::utf8(b"My Token"));
    assert_eq!(coin_registry::description(&currency), string::utf8(b"A demo token"));
    assert_eq!(coin_registry::icon_url(&currency), string::utf8(b""));
}
```

## 小结

- 新代币应使用 **`coin_registry::new_currency_with_otw` + `finalize`** 创建；元数据存储在链上 **`Currency<T>`** 中，由 `CoinRegistry` 管理
- **`MetadataCap<T>`** 用于更新元数据（`set_name`、`set_description`、`set_icon_url`）；删除后不可再更新
- 精度（decimals）决定代币的最小可分割单位，最常见值为 9 和 6
- 旧版 **`coin::create_currency`** 与 **`CoinMetadata<T>`** 已废弃，仅适用于历史代币


---


<!-- source: 11_tokens/treasury-cap.md -->
## 13.3 Treasury Cap 管理

# Treasury Cap 管理

`TreasuryCap` 是 Sui Coin 标准中的核心权限对象，控制着代币的铸造和销毁。如何管理 `TreasuryCap` 直接决定了代币的供应模型——是无限供应、固定供应还是可控供应。本节将深入探讨不同的 TreasuryCap 管理策略。

## TreasuryCap 的角色

```move
public struct TreasuryCap<phantom T> has key, store {
    id: UID,
    total_supply: Supply<T>,
}
```

`TreasuryCap` 持有者拥有以下权限：

- **铸造**：通过 `coin::mint` 创建新代币
- **销毁**：通过 `coin::burn` 销毁代币
- **查询总供应量**：通过 `total_supply()` 获取当前总供应量
- **更新元数据**：持有 `MetadataCap` 时可通过 `coin_registry::set_name` 等更新链上 `Currency` 元数据

## 无限供应模型

最简单的模型——`TreasuryCap` 持有者可以随时铸造新代币：

```move
module game::gold;

use std::string;
use sui::coin::{Self, TreasuryCap};
use sui::coin_registry;

public struct GOLD() has drop;

fun init(otw: GOLD, ctx: &mut TxContext) {
    let (initializer, treasury_cap) = coin_registry::new_currency_with_otw<GOLD>(
        otw, 9,
        string::utf8(b"GOLD"),
        string::utf8(b"Gold"),
        string::utf8(b"Game currency"),
        string::utf8(b""),
        ctx,
    );
    let metadata_cap = coin_registry::finalize(initializer, ctx);
    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(metadata_cap, ctx.sender());
}

public fun mint(
    treasury_cap: &mut TreasuryCap<GOLD>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let coin = coin::mint(treasury_cap, amount, ctx);
    transfer::public_transfer(coin, recipient);
}

public fun burn(
    treasury_cap: &mut TreasuryCap<GOLD>,
    coin: coin::Coin<GOLD>,
) {
    coin::burn(treasury_cap, coin);
}
```

## 固定供应模型

在 `init` 中铸造全部供应量，然后锁定 `TreasuryCap` 使其无法再铸造：

```move
module fixed_supply::silver;

use std::string;
use sui::coin::{Self, TreasuryCap};
use sui::coin_registry;
use sui::dynamic_object_field as dof;

public struct SILVER() has drop;

public struct Freezer has key {
    id: UID,
}

public struct TreasuryCapKey() has copy, drop, store;

const TOTAL_SUPPLY: u64 = 10_000_000_000_000_000_000;

fun init(otw: SILVER, ctx: &mut TxContext) {
    let (initializer, mut treasury_cap) = coin_registry::new_currency_with_otw<SILVER>(
        otw, 9,
        string::utf8(b"SILVER"),
        string::utf8(b"Silver"),
        string::utf8(b"Fixed supply token"),
        string::utf8(b""),
        ctx,
    );
    let metadata_cap = coin_registry::finalize(initializer, ctx);
    transfer::public_transfer(metadata_cap, ctx.sender());

    // 铸造全部供应量
    let coin = coin::mint(&mut treasury_cap, TOTAL_SUPPLY, ctx);
    transfer::public_transfer(coin, ctx.sender());

    // 将 TreasuryCap 锁入 Freezer 的动态对象字段
    let mut freezer = Freezer { id: object::new(ctx) };
    dof::add(&mut freezer.id, TreasuryCapKey(), treasury_cap);

    // 冻结 Freezer，使 TreasuryCap 永远无法取出
    transfer::freeze_object(freezer);
}
```

### 锁定策略解析

1. **铸造全部供应量**并转移给发布者
2. **将 TreasuryCap 放入 Freezer**的动态对象字段中
3. **冻结 Freezer**——一旦冻结，其中的 TreasuryCap 无法取出，也就无法再铸造

这样代币的总供应量就被永久固定了。TreasuryCap 仍然存在（可被索引器查询），但无法使用。

## 可控供应模型

通过智能合约逻辑控制铸造，而非直接暴露 `TreasuryCap`：

```move
module game::reward_token;

use std::string;
use sui::coin::{Self, TreasuryCap};
use sui::coin_registry;

public struct REWARD_TOKEN() has drop;

public struct MintCap has key {
    id: UID,
    max_per_mint: u64,
    total_minted: u64,
    max_supply: u64,
}

const EExceedsMaxPerMint: u64 = 1;
const EExceedsMaxSupply: u64 = 2;

fun init(otw: REWARD_TOKEN, ctx: &mut TxContext) {
    let (initializer, treasury_cap) = coin_registry::new_currency_with_otw<REWARD_TOKEN>(
        otw, 9,
        string::utf8(b"RWD"),
        string::utf8(b"Reward Token"),
        string::utf8(b"Reward"),
        string::utf8(b""),
        ctx,
    );
    let metadata_cap = coin_registry::finalize(initializer, ctx);

    // TreasuryCap 共享，通过 MintCap 控制访问
    transfer::public_share_object(treasury_cap);
    transfer::public_transfer(metadata_cap, ctx.sender());

    transfer::transfer(MintCap {
        id: object::new(ctx),
        max_per_mint: 1_000_000_000,
        total_minted: 0,
        max_supply: 100_000_000_000_000_000,
    }, ctx.sender());
}

public fun controlled_mint(
    treasury_cap: &mut TreasuryCap<REWARD_TOKEN>,
    mint_cap: &mut MintCap,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    assert!(amount <= mint_cap.max_per_mint, EExceedsMaxPerMint);
    assert!(
        mint_cap.total_minted + amount <= mint_cap.max_supply,
        EExceedsMaxSupply,
    );

    let coin = coin::mint(treasury_cap, amount, ctx);
    mint_cap.total_minted = mint_cap.total_minted + amount;
    transfer::public_transfer(coin, recipient);
}
```

## 销毁 TreasuryCap

另一种确保固定供应的方式——直接销毁 TreasuryCap（如果框架支持）或将其转移到无人能访问的地址：

```move
// 将 TreasuryCap 转移给 0x0 地址（事实上销毁）
transfer::public_transfer(treasury_cap, @0x0);
```

## 测试固定供应

```move
#[test_only]
use sui::coin::Coin;
use sui::dynamic_object_field as dof;
use sui::test_scenario;

#[test]
fun fixed_supply_init() {
    let publisher = @0x11111;
    let mut scenario = test_scenario::begin(publisher);

    init(SILVER(), scenario.ctx());
    scenario.next_tx(publisher);
    {
        // 验证 Freezer 被冻结且包含 TreasuryCap
        let freezer = scenario.take_immutable<Freezer>();
        assert!(dof::exists_(&freezer.id, TreasuryCapKey()));

        let cap: &TreasuryCap<SILVER> = dof::borrow(&freezer.id, TreasuryCapKey());
        assert_eq!(cap.total_supply(), TOTAL_SUPPLY);

        // 验证全部供应量转移给了发布者
        let coin = scenario.take_from_sender<Coin<SILVER>>();
        assert_eq!(coin.value(), TOTAL_SUPPLY);

        scenario.return_to_sender(coin);
        test_scenario::return_immutable(freezer);
    };
    scenario.end();
}
```

## 小结

- `TreasuryCap` 是代币铸造和销毁的核心权限对象
- **无限供应**：持有者随时可铸造，适合游戏货币等场景
- **固定供应**：在 `init` 中铸造全部供应量，然后锁定 TreasuryCap（放入冻结对象的 DOF）
- **可控供应**：通过额外的 `MintCap` 逻辑控制铸造量和频率
- TreasuryCap 的管理方式直接决定了代币的经济模型


---


<!-- source: 11_tokens/regulated-coin.md -->
## 13.4 受监管代币

# 受监管代币

在某些场景下，代币发行方需要限制特定地址的代币使用——例如合规要求、制裁名单或反洗钱。Sui 通过 `DenyCap` 和 `DenyList` 机制提供了原生的受监管代币支持。本节将介绍如何创建和管理受监管代币。

## 受监管代币 vs 普通代币

普通代币使用 **`coin_registry::new_currency_with_otw` + `finalize`** 创建。受监管代币在创建时使用 **`coin_registry::make_regulated`**（`coin::create_regulated_currency_v2` 已废弃），额外得到 **`DenyCapV2<T>`**，允许发行方将特定地址加入黑名单。

## 创建受监管代币

```move
module regulated::rusd;

use std::string;
use sui::coin_registry;
use sui::deny_list::DenyList;

public struct RUSD() has drop;

fun init(otw: RUSD, ctx: &mut TxContext) {
    let (mut initializer, treasury_cap) = coin_registry::new_currency_with_otw<RUSD>(
        otw, 6,
        string::utf8(b"RUSD"),
        string::utf8(b"Regulated USD"),
        string::utf8(b"A regulated stablecoin"),
        string::utf8(b""),
        ctx,
    );
    let deny_cap = coin_registry::make_regulated(&mut initializer, true, ctx); // allow_global_pause
    let metadata_cap = coin_registry::finalize(initializer, ctx);

    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(deny_cap, ctx.sender());
    transfer::public_transfer(metadata_cap, ctx.sender());
}
```

### 新 API 返回值说明

| 对象 | 说明 |
| --- | --- |
| `TreasuryCap<T>` | 铸造权凭证 |
| `DenyCapV2<T>` | 黑名单与全局暂停管理权凭证 |
| `MetadataCap<T>` | 代币元数据更新权（链上元数据在 `Currency<T>` 中） |

## DenyCap 与黑名单管理

`DenyCap` 的持有者可以将地址添加到黑名单或从黑名单中移除：

```move
use sui::deny_list::DenyList;
use sui::coin;

/// 将地址加入黑名单
public fun deny_address(
    deny_list: &mut DenyList,
    deny_cap: &mut coin::DenyCapV2<RUSD>,
    addr: address,
    ctx: &mut TxContext,
) {
    coin::deny_list_v2_add(deny_list, deny_cap, addr, ctx);
}

/// 将地址从黑名单移除
public fun undeny_address(
    deny_list: &mut DenyList,
    deny_cap: &mut coin::DenyCapV2<RUSD>,
    addr: address,
    ctx: &mut TxContext,
) {
    coin::deny_list_v2_remove(deny_list, deny_cap, addr, ctx);
}

/// 检查地址是否在黑名单中
public fun is_denied(
    deny_list: &DenyList,
    addr: address,
): bool {
    coin::deny_list_v2_contains_current_epoch<RUSD>(deny_list, addr)
}
```

## 全局暂停

使用 **`coin_registry::make_regulated`** 时将 `allow_global_pause` 设为 `true`，即可启用全局暂停，暂停所有该代币的转移：

```move
/// 全局暂停代币转移
public fun global_pause(
    deny_list: &mut DenyList,
    deny_cap: &mut coin::DenyCapV2<RUSD>,
    ctx: &mut TxContext,
) {
    coin::deny_list_v2_enable_global_pause(deny_list, deny_cap, ctx);
}

/// 恢复代币转移
public fun global_unpause(
    deny_list: &mut DenyList,
    deny_cap: &mut coin::DenyCapV2<RUSD>,
    ctx: &mut TxContext,
) {
    coin::deny_list_v2_disable_global_pause(deny_list, deny_cap, ctx);
}
```

## DenyList 系统对象

`DenyList` 是 Sui 的系统对象，在创世时创建。它是一个共享对象，用于存储所有受监管代币的黑名单信息。在交易中作为 `&mut DenyList` 参数传入。

## 合规代币设计模式

### 多签管理

将 **`DenyCapV2`** 放入多签钱包管理，而非单一地址：

```move
use std::string;
use sui::coin_registry;

fun init(otw: RUSD, ctx: &mut TxContext) {
    let (mut initializer, treasury_cap) = coin_registry::new_currency_with_otw<RUSD>(
        otw, 6,
        string::utf8(b"RUSD"),
        string::utf8(b"Regulated USD"),
        string::utf8(b"Compliant stablecoin"),
        string::utf8(b""),
        ctx,
    );
    let deny_cap = coin_registry::make_regulated(&mut initializer, true, ctx);
    let metadata_cap = coin_registry::finalize(initializer, ctx);

    let multisig_addr = @0xMULTISIG;
    transfer::public_transfer(treasury_cap, multisig_addr);
    transfer::public_transfer(deny_cap, multisig_addr);
    transfer::public_transfer(metadata_cap, multisig_addr);
}
```

### 分权管理

铸造权和黑名单权分开管理：

```move
use std::string;
use sui::coin_registry;

fun init(otw: RUSD, ctx: &mut TxContext) {
    let (mut initializer, treasury_cap) = coin_registry::new_currency_with_otw<RUSD>(
        otw, 6,
        string::utf8(b"RUSD"),
        string::utf8(b"Regulated USD"),
        string::utf8(b"Compliant stablecoin"),
        string::utf8(b""),
        ctx,
    );
    let deny_cap = coin_registry::make_regulated(&mut initializer, true, ctx);
    let metadata_cap = coin_registry::finalize(initializer, ctx);

    let minter = @0xMINTER;
    let compliance_officer = @0xCOMPLIANCE;

    transfer::public_transfer(treasury_cap, minter);
    transfer::public_transfer(deny_cap, compliance_officer);
    transfer::public_transfer(metadata_cap, compliance_officer);
}
```

## 测试受监管代币

```move
#[test]
fun deny_and_undeny() {
    use sui::test_scenario;
    use sui::deny_list;

    let admin = @0xAD;
    let blocked_user = @0xBAD;
    let mut scenario = test_scenario::begin(admin);

    // 创建系统对象（包括 DenyList）
    scenario.create_system_objects();

    init(RUSD(), scenario.ctx());
    scenario.next_tx(admin);

    // 获取 DenyCap 和 DenyList
    {
        let mut deny_cap = scenario.take_from_sender<coin::DenyCapV2<RUSD>>();
        let mut deny_list = scenario.take_shared<DenyList>();

        // 加入黑名单
        coin::deny_list_v2_add(
            &mut deny_list, &mut deny_cap, blocked_user, scenario.ctx(),
        );

        test_scenario::return_shared(deny_list);
        scenario.return_to_sender(deny_cap);
    };

    scenario.end();
}
```

## 小结

- 受监管代币使用 **`coin_registry::new_currency_with_otw` + `make_regulated` + `finalize`** 创建，额外返回 **`DenyCapV2`**（`coin::create_regulated_currency_v2` 已废弃）
- **`DenyCapV2`** 允许将地址加入/移出黑名单，被黑名单的地址无法接收或发送该代币
- **`DenyList`** 是系统共享对象，存储所有受监管代币的黑名单数据
- 支持全局暂停功能，可一键暂停所有代币转移
- 合规场景中建议使用多签或分权管理铸造权和黑名单权


---


<!-- source: 11_tokens/closed-loop-token.md -->
## 13.5 闭环代币（Closed-Loop Token）

# 闭环代币

Sui 的闭环代币（Closed-Loop Token）系统提供了比 Coin 更精细的控制能力。与 Coin 允许自由转移不同，Token 的每个操作都需要通过 `TokenPolicy` 的规则验证。这使得它非常适合游戏内货币、忠诚积分、有条件转移等场景。

## Token 与 Coin 的区别

| 特性 | Coin | Token |
| --- | --- | --- |
| 转移 | 自由转移（有 `store`） | 需要通过 Policy 批准 |
| Ability | `key, store` | `key`（无 `store`） |
| 使用方式 | 标准转账 | 通过 ActionRequest 请求操作 |
| 适用场景 | 通用代币、DeFi | 积分、游戏货币、有限制的代币 |

## 核心概念

### TokenPolicy

`TokenPolicy` 是控制 Token 操作的策略对象。每个操作（transfer、spend、to_coin 等）可以配置不同的规则：

```move
use sui::token::{Self, TokenPolicy, TokenPolicyCap};
```

### ActionRequest

每次对 Token 的操作都会生成一个 `ActionRequest`，需要满足 Policy 中的所有规则后才能被确认：

```move
// 转移 Token 生成 ActionRequest
let request = token::transfer(my_token, recipient, ctx);

// 通过规则验证
my_rule::prove(&mut request, &policy, ctx);

// 确认请求
token::confirm_request(&policy, request, ctx);
```

### Rule

规则（Rule）是附加到 TokenPolicy 上的验证逻辑。每个规则是一个 witness 类型，可以有自己的配置：

```move
public struct CrownCouncilRule() has drop;

public struct Config has store {
    members: VecSet<address>,
}
```

## 创建闭环代币

以 King Credits（国王信用）为例——一种只有皇家议会成员才能转移的代币：

```move
module king_credits::king_credits;

use std::string;
use sui::coin;
use sui::coin_registry;
use sui::token;
use king_credits::crown_council_rule::{Self, CrownCouncilRule};

public struct KING_CREDITS() has drop;

fun init(otw: KING_CREDITS, ctx: &mut TxContext) {
    let (initializer, treasury_cap) = coin_registry::new_currency_with_otw<KING_CREDITS>(
        otw, 9,
        string::utf8(b"KING_CREDITS"),
        string::utf8(b"King's Credits"),
        string::utf8(b"Awarded to citizens for heroic actions."),
        string::utf8(b"https://example.com/icon"),
        ctx,
    );
    let metadata_cap = coin_registry::finalize(initializer, ctx);
    transfer::public_transfer(metadata_cap, ctx.sender());

    // 创建 Token Policy
    let (mut policy, policy_cap) = token::new_policy(&treasury_cap, ctx);

    // 允许 transfer 操作，但需要 CrownCouncilRule 验证
    token::add_rule_for_action<KING_CREDITS, CrownCouncilRule>(
        &mut policy,
        &policy_cap,
        token::transfer_action(),
        ctx,
    );

    // 设置规则配置（初始议会成员）
    crown_council_rule::add_rule_config(
        &mut policy,
        &policy_cap,
        vector[ctx.sender()],
        ctx,
    );

    // 共享 Policy，转移 PolicyCap 和 TreasuryCap
    token::share_policy(policy);
    transfer::public_transfer(policy_cap, ctx.sender());
    transfer::public_transfer(treasury_cap, ctx.sender());
}
```

## 实现自定义规则

```move
module king_credits::crown_council_rule;

use sui::token::{Self, ActionRequest, TokenPolicy, TokenPolicyCap};
use sui::vec_set::{Self, VecSet};

const EMaxCouncilMembers: u64 = 0;
const ENotACouncilMember: u64 = 1;
const MAX_CROWN_COUNCIL_MEMBERS: u64 = 100;

public struct CrownCouncilRule() has drop;

public struct Config has store {
    members: VecSet<address>,
}

/// 初始化规则配置
public fun add_rule_config<T>(
    policy: &mut TokenPolicy<T>,
    cap: &TokenPolicyCap<T>,
    initial_members: vector<address>,
    ctx: &mut TxContext,
) {
    assert!(initial_members.length() <= MAX_CROWN_COUNCIL_MEMBERS, EMaxCouncilMembers);
    let members = vec_set::from_keys(initial_members);
    token::add_rule_config(CrownCouncilRule(), policy, cap, Config { members }, ctx);
}

/// 添加议会成员
public fun add_council_member<T>(
    policy: &mut TokenPolicy<T>,
    cap: &TokenPolicyCap<T>,
    member_addr: address,
) {
    let config: &mut Config = token::rule_config_mut(CrownCouncilRule(), policy, cap);
    config.members.insert(member_addr);
}

/// 移除议会成员
public fun remove_council_member<T>(
    policy: &mut TokenPolicy<T>,
    cap: &TokenPolicyCap<T>,
    member_addr: address,
) {
    let config: &mut Config = token::rule_config_mut(CrownCouncilRule(), policy, cap);
    config.members.remove(&member_addr);
}

/// 验证请求发送者是否为议会成员
public fun prove<T>(
    request: &mut ActionRequest<T>,
    policy: &TokenPolicy<T>,
    ctx: &mut TxContext,
) {
    let config: &Config = token::rule_config(CrownCouncilRule(), policy);
    assert!(config.members.contains(&ctx.sender()), ENotACouncilMember);
    token::add_approval(CrownCouncilRule(), request, ctx);
}
```

## Token 操作流程

### 铸造

```move
let token = token::mint(&mut treasury_cap, 100_000, ctx);
let request = token::transfer(token, recipient, ctx);
// 使用 treasury_cap 确认（绕过规则）
token::confirm_with_treasury_cap(&mut treasury_cap, request, ctx);
```

### 转移（需要规则验证）

```move
let token = scenario.take_from_sender<Token<KING_CREDITS>>();
let mut request = token::transfer(token, recipient, ctx);

// 证明满足 CrownCouncilRule
crown_council_rule::prove(&mut request, &policy, ctx);

// 确认请求
token::confirm_request(&policy, request, ctx);
```

### 消费（Spend）

```move
let mut request = token::spend(token, ctx);
// 验证规则...
token::confirm_request(&policy, request, ctx);
```

## 完整测试

```move
#[test]
fun transfer() {
    use sui::test_scenario;
    use sui::token::{Token, TokenPolicy, TokenPolicyCap};
    use sui::coin::TreasuryCap;

    let publisher = @0x11111;
    let council_member = @0x22222;
    let recipient = @0x33333;

    let mut scenario = test_scenario::begin(publisher);

    // 初始化
    init(KING_CREDITS(), scenario.ctx());

    // 添加议会成员
    scenario.next_tx(publisher);
    {
        let policy_cap = scenario.take_from_sender<TokenPolicyCap<KING_CREDITS>>();
        let mut policy = scenario.take_shared<TokenPolicy<KING_CREDITS>>();
        crown_council_rule::add_council_member(
            &mut policy, &policy_cap, council_member,
        );
        test_scenario::return_shared(policy);
        scenario.return_to_sender(policy_cap);
    };

    // 铸造给议会成员
    scenario.next_tx(publisher);
    {
        let mut tcap = scenario.take_from_sender<TreasuryCap<KING_CREDITS>>();
        let token = token::mint(&mut tcap, 100_000_000_000_000, scenario.ctx());
        let request = token::transfer(token, council_member, scenario.ctx());
        token::confirm_with_treasury_cap(&mut tcap, request, scenario.ctx());
        scenario.return_to_sender(tcap);
    };

    // 议会成员转移给接收者
    scenario.next_tx(council_member);
    {
        let policy = scenario.take_shared<TokenPolicy<KING_CREDITS>>();
        let token = scenario.take_from_sender<Token<KING_CREDITS>>();
        let mut request = token::transfer(token, recipient, scenario.ctx());
        crown_council_rule::prove(&mut request, &policy, scenario.ctx());
        token::confirm_request(&policy, request, scenario.ctx());
        test_scenario::return_shared(policy);
    };

    scenario.end();
}
```

## 小结

- 闭环代币（Token）与 Coin 不同，每个操作都需要通过 `TokenPolicy` 规则验证
- Token 没有 `store` ability，无法自由转移，必须通过 ActionRequest 机制
- 自定义 Rule 可以实现任意验证逻辑（成员检查、时间锁、数量限制等）
- `confirm_with_treasury_cap` 可以绕过规则直接确认请求（用于铸造初始分配）
- 闭环代币适用于积分系统、游戏货币、有条件转移等需要精细控制的场景


---


<!-- source: 11_tokens/in-game-token.md -->
## 13.6 游戏内代币实战

# 游戏内代币实战

本节将所学的代币知识应用于实际游戏场景，涵盖忠诚积分、游戏货币和代币兑换等常见模式。我们将设计一个完整的游戏经济系统，展示如何在 Move 中实现各种代币用例。

## 忠诚积分系统

忠诚积分是闭环代币的经典应用——积分只能通过特定操作获取，只能在指定商店消费：

```move
module game::loyalty_points;

use std::string;
use sui::coin;
use sui::coin_registry;
use sui::token::{Self, Token, ActionRequest, TokenPolicy, TokenPolicyCap};

public struct LOYALTY_POINTS() has drop;

public struct ShopOwnerRule() has drop;

public struct ShopConfig has store {
    shop_owner: address,
}

fun init(otw: LOYALTY_POINTS, ctx: &mut TxContext) {
    let (initializer, treasury_cap) = coin_registry::new_currency_with_otw<LOYALTY_POINTS>(
        otw, 0,
        string::utf8(b"LP"),
        string::utf8(b"Loyalty Points"),
        string::utf8(b"Earn points, redeem rewards"),
        string::utf8(b""),
        ctx,
    );
    let metadata_cap = coin_registry::finalize(initializer, ctx);

    let (mut policy, policy_cap) = token::new_policy(&treasury_cap, ctx);

    token::add_rule_for_action<LOYALTY_POINTS, ShopOwnerRule>(
        &mut policy, &policy_cap, token::spend_action(), ctx,
    );
    token::add_rule_config(
        ShopOwnerRule(), &mut policy, &policy_cap,
        ShopConfig { shop_owner: ctx.sender() }, ctx,
    );

    token::share_policy(policy);
    transfer::public_transfer(policy_cap, ctx.sender());
    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(metadata_cap, ctx.sender());
}

/// 玩家完成任务后获得积分
public fun reward_player(
    treasury_cap: &mut coin::TreasuryCap<LOYALTY_POINTS>,
    amount: u64,
    player: address,
    ctx: &mut TxContext,
) {
    let token = token::mint(treasury_cap, amount, ctx);
    let request = token::transfer(token, player, ctx);
    token::confirm_with_treasury_cap(treasury_cap, request, ctx);
}

/// 消费积分兑换奖励
public fun spend_points(
    token: Token<LOYALTY_POINTS>,
    policy: &TokenPolicy<LOYALTY_POINTS>,
    ctx: &mut TxContext,
) {
    let mut request = token::spend(token, ctx);
    // 验证消费规则
    let config: &ShopConfig = token::rule_config(ShopOwnerRule(), policy);
    assert!(ctx.sender() == config.shop_owner || true); // 示例：任何人都可消费
    token::add_approval(ShopOwnerRule(), &mut request, ctx);
    token::confirm_request(policy, request, ctx);
}
```

## 游戏货币（双币系统）

许多游戏采用双币系统——一种免费获取的软币和一种需要购买的硬币：

```move
module game::currencies;

use std::string;
use sui::coin::{Self, Coin, TreasuryCap};
use sui::coin_registry;

/// 软币：通过游戏获取，可自由转移
public struct GOLD() has drop;

/// 硬币：通过充值获取（固定供应或可控铸造）
public struct GEM() has drop;

/// 游戏商店
public struct GameShop has key {
    id: UID,
    gold_treasury: TreasuryCap<GOLD>,
    gold_per_quest: u64,
    gem_to_gold_rate: u64,
}

/// 初始化游戏货币
public fun init_gold(otw: GOLD, ctx: &mut TxContext): TreasuryCap<GOLD> {
    let (initializer, treasury_cap) = coin_registry::new_currency_with_otw<GOLD>(
        otw, 0,
        string::utf8(b"GOLD"),
        string::utf8(b"Gold"),
        string::utf8(b"In-game currency earned by playing"),
        string::utf8(b""),
        ctx,
    );
    let metadata_cap = coin_registry::finalize(initializer, ctx);
    transfer::public_transfer(metadata_cap, ctx.sender());
    treasury_cap
}

/// 完成任务获得金币
public fun complete_quest(
    shop: &mut GameShop,
    player: address,
    ctx: &mut TxContext,
) {
    let reward = coin::mint(
        &mut shop.gold_treasury, shop.gold_per_quest, ctx,
    );
    transfer::public_transfer(reward, player);
}

/// 用宝石兑换金币
public fun exchange_gem_for_gold(
    shop: &mut GameShop,
    gem: Coin<GEM>,
    ctx: &mut TxContext,
): Coin<GOLD> {
    let gem_amount = gem.value();
    let gold_amount = gem_amount * shop.gem_to_gold_rate;

    // 销毁宝石（需要 GEM 的 TreasuryCap）
    // 铸造对应的金币
    let gold = coin::mint(
        &mut shop.gold_treasury, gold_amount, ctx,
    );

    transfer::public_transfer(gem, @0x0); // 简化处理
    gold
}
```

## 代币兑换市场

实现一个简单的代币兑换合约：

```move
module game::exchange;

use sui::coin::{Self, Coin};
use sui::balance::{Self, Balance};

public struct Exchange<phantom CoinA, phantom CoinB> has key {
    id: UID,
    reserve_a: Balance<CoinA>,
    reserve_b: Balance<CoinB>,
    rate_a_to_b: u64,  // 1 A = rate 个 B（以最小单位计）
    rate_b_to_a: u64,
}

const EInsufficientReserve: u64 = 1;

/// 创建兑换池
public fun create_exchange<CoinA, CoinB>(
    initial_a: Coin<CoinA>,
    initial_b: Coin<CoinB>,
    rate_a_to_b: u64,
    rate_b_to_a: u64,
    ctx: &mut TxContext,
) {
    let exchange = Exchange<CoinA, CoinB> {
        id: object::new(ctx),
        reserve_a: initial_a.into_balance(),
        reserve_b: initial_b.into_balance(),
        rate_a_to_b,
        rate_b_to_a,
    };
    transfer::share_object(exchange);
}

/// 用 A 换 B
public fun swap_a_for_b<CoinA, CoinB>(
    exchange: &mut Exchange<CoinA, CoinB>,
    coin_a: Coin<CoinA>,
    ctx: &mut TxContext,
): Coin<CoinB> {
    let amount_a = coin_a.value();
    let amount_b = amount_a * exchange.rate_a_to_b;

    assert!(exchange.reserve_b.value() >= amount_b, EInsufficientReserve);

    // 存入 A
    exchange.reserve_a.join(coin_a.into_balance());

    // 取出 B
    let balance_b = exchange.reserve_b.split(amount_b);
    balance_b.into_coin(ctx)
}

/// 用 B 换 A
public fun swap_b_for_a<CoinA, CoinB>(
    exchange: &mut Exchange<CoinA, CoinB>,
    coin_b: Coin<CoinB>,
    ctx: &mut TxContext,
): Coin<CoinA> {
    let amount_b = coin_b.value();
    let amount_a = amount_b * exchange.rate_b_to_a;

    assert!(exchange.reserve_a.value() >= amount_a, EInsufficientReserve);

    exchange.reserve_b.join(coin_b.into_balance());

    let balance_a = exchange.reserve_a.split(amount_a);
    balance_a.into_coin(ctx)
}
```

## 奖励分发模式

按比例分发代币奖励的常见模式：

```move
module game::rewards;

use sui::coin::{Self, Coin, TreasuryCap};

public struct RewardPool<phantom T> has key {
    id: UID,
    treasury: TreasuryCap<T>,
    reward_per_action: u64,
    total_distributed: u64,
    max_distribution: u64,
}

const EPoolExhausted: u64 = 1;

public fun claim_reward<T>(
    pool: &mut RewardPool<T>,
    player: address,
    ctx: &mut TxContext,
) {
    assert!(
        pool.total_distributed + pool.reward_per_action <= pool.max_distribution,
        EPoolExhausted,
    );

    let reward = coin::mint(
        &mut pool.treasury, pool.reward_per_action, ctx,
    );
    pool.total_distributed = pool.total_distributed + pool.reward_per_action;
    transfer::public_transfer(reward, player);
}

public fun remaining_rewards<T>(pool: &RewardPool<T>): u64 {
    pool.max_distribution - pool.total_distributed
}
```

## 测试游戏代币

```move
#[test]
fun loyalty_reward_and_spend() {
    use sui::test_scenario;
    use sui::token::{Token, TokenPolicy};

    let shop_owner = @0xSHOP;
    let player = @0xPLAYER;
    let mut scenario = test_scenario::begin(shop_owner);

    // 初始化忠诚积分
    init(LOYALTY_POINTS(), scenario.ctx());

    // 奖励玩家
    scenario.next_tx(shop_owner);
    {
        let mut tcap = scenario.take_from_sender<coin::TreasuryCap<LOYALTY_POINTS>>();
        reward_player(&mut tcap, 100, player, scenario.ctx());
        scenario.return_to_sender(tcap);
    };

    // 玩家消费积分
    scenario.next_tx(player);
    {
        let token = scenario.take_from_sender<Token<LOYALTY_POINTS>>();
        let policy = scenario.take_shared<TokenPolicy<LOYALTY_POINTS>>();
        spend_points(token, &policy, scenario.ctx());
        test_scenario::return_shared(policy);
    };

    scenario.end();
}
```

## 小结

- 忠诚积分适合使用闭环代币（Token），限制获取和消费渠道
- 双币系统（软币 + 硬币）是游戏经济的常见模式，软币用 Coin 实现，硬币可用固定供应
- 代币兑换可通过 Balance 管理储备池实现简单的定价机制
- 奖励分发模式需要控制总分发量，防止通胀
- 根据场景选择 Coin（自由转移）或 Token（受限操作），或两者结合


---


<!-- source: 12_nft_kiosk/index.md -->
## 第十四章 · NFT 与 Kiosk

# 第十四章 · NFT 与 Kiosk

本章讲解在 Sui 上创建 NFT 和构建 NFT 交易市场的完整流程，包括 Kiosk 标准和自定义转移策略。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 12.1 | NFT 基础 | 对象即 NFT、Display 标准 |
| 12.2 | 铸造自定义 NFT | 定义结构体、mint 函数、Display 配置 |
| 12.3 | Kiosk 标准 | 创建 Kiosk、上架/下架/购买流程 |
| 12.4 | 自定义转移策略 | TransferPolicy、版税规则 |
| 12.5 | 构建 NFT 市场 | 完整市场合约与前端集成 |
| 12.6 | 灵魂绑定 NFT | 不可转移设计、成就/证书场景 |

## 学习目标

读完本章后，你将能够：

- 铸造具有自定义属性和展示信息的 NFT
- 使用 Kiosk 标准构建安全的 NFT 交易流程
- 实现版税收取和灵魂绑定等高级功能


---


<!-- source: 12_nft_kiosk/nft-basics.md -->
## 14.1 NFT 基础

# NFT 基础概念

在 Sui 上，NFT（Non-Fungible Token，非同质化代币）不需要特殊的标准或框架——每个 Sui 对象天然就是唯一的。Sui 的对象模型为 NFT 提供了天然的表达能力：每个对象都有唯一的 ID、明确的所有权，并且可以附加丰富的数据。本节将介绍 NFT 的基础概念及其在 Sui 上的实现方式。

## Sui 对象即 NFT

在其他区块链上，NFT 需要遵循特定标准（如 ERC-721）。但在 Sui 上，任何具有 `key` ability 的对象都天然具备 NFT 的核心特性：

- **唯一性**：每个对象有全局唯一的 `UID`
- **所有权**：对象属于特定地址或另一个对象
- **不可替代**：每个对象是独立的实体

```move
module game::hero;

/// Hero 就是一个 NFT——每个实例都是唯一的
public struct Hero has key, store {
    id: UID,
    health: u64,
    stamina: u64,
}

public fun mint_hero(ctx: &mut TxContext): Hero {
    Hero {
        id: object::new(ctx),
        health: 100,
        stamina: 10,
    }
}
```

## Display 标准

`sui::display` 模块允许为对象定义链下展示模板，告诉钱包、浏览器和市场如何展示你的 NFT：

```move
module game::hero;

use sui::display;
use sui::package;

public struct Hero has key, store {
    id: UID,
    name: String,
    image_url: String,
    description: String,
    power: u64,
}

public struct HERO() has drop;

fun init(otw: HERO, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    let mut display = display::new<Hero>(&publisher, ctx);

    display.add(b"name".to_string(), b"{name}".to_string());
    display.add(b"image_url".to_string(), b"{image_url}".to_string());
    display.add(b"description".to_string(), b"{description}".to_string());
    display.add(
        b"project_url".to_string(),
        b"https://mygame.com".to_string(),
    );

    display.update_version();

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());
}
```

### Display 模板语法

Display 使用 `{field_name}` 语法引用对象字段：

| 键 | 值示例 | 说明 |
| --- | --- | --- |
| `name` | `{name}` | NFT 名称 |
| `image_url` | `{image_url}` | 图片 URL |
| `description` | `{description}` | 描述 |
| `project_url` | 固定 URL | 项目主页 |
| `creator` | `MyGame Team` | 创作者信息 |

### Display 的工作原理

1. 用 `package::claim` 获取 `Publisher` 对象证明包的发布者身份
2. 用 `display::new<T>` 创建 Display 对象
3. 用 `display.add()` 添加模板字段
4. 调用 `display.update_version()` 发出更新事件
5. 链下索引器读取事件并缓存模板

## 对象所有权与 NFT

Sui 的所有权模型天然契合 NFT 的需求：

### 地址拥有

NFT 属于某个钱包地址，只有该地址可以操作：

```move
// 铸造并转移给玩家
let hero = mint_hero(ctx);
transfer::public_transfer(hero, player_address);
```

### 对象拥有

NFT 可以属于另一个对象（嵌套组合）：

```move
use sui::dynamic_object_field as dof;

/// 武器 NFT
public struct Sword has key, store {
    id: UID,
    name: String,
    damage: u64,
}

/// 英雄装备武器
public fun equip_sword(hero: &mut Hero, sword: Sword) {
    dof::add(&mut hero.id, b"sword".to_string(), sword);
}

/// 英雄卸下武器
public fun unequip_sword(hero: &mut Hero): Sword {
    dof::remove(&mut hero.id, b"sword".to_string())
}
```

### 不可变对象

将 NFT 冻结为不可变——永远无法修改或转移：

```move
// 创建永久性证书
let cert = Certificate { id: object::new(ctx), /* ... */ };
transfer::freeze_object(cert);
```

## NFT 的 Ability 选择

| Ability 组合 | 含义 | 适用场景 |
| --- | --- | --- |
| `key, store` | 可自由转移、可存入其他对象 | 可交易的 NFT |
| `key` | 只能通过自定义函数转移 | 灵魂绑定 NFT |
| `key, store, copy` | 可复制 | 通常不用于 NFT |

## 集合（Collection）模式

虽然 Sui 没有强制的集合概念，但可以通过共享对象实现：

```move
public struct Collection has key {
    id: UID,
    name: String,
    description: String,
    total_minted: u64,
    max_supply: u64,
}

const EMaxSupplyReached: u64 = 1;

public fun mint_from_collection(
    collection: &mut Collection,
    ctx: &mut TxContext,
): Hero {
    assert!(collection.total_minted < collection.max_supply, EMaxSupplyReached);
    collection.total_minted = collection.total_minted + 1;

    Hero {
        id: object::new(ctx),
        name: b"Hero #".to_string(), // 可拼接编号
        image_url: b"https://mygame.com/hero.png".to_string(),
        description: b"A brave hero".to_string(),
        power: 10,
    }
}
```

## 小结

- 在 Sui 上每个对象天然就是 NFT——具有唯一 ID 和明确所有权
- `Display` 标准定义 NFT 的链下展示方式（名称、图片、描述等）
- 所有权模型支持地址拥有、对象嵌套、不可变等多种模式
- 通过 ability 选择控制 NFT 的可转移性（`store` 允许自由转移）
- 集合（Collection）模式可通过共享对象实现供应量限制


---


<!-- source: 12_nft_kiosk/mint-custom-nft.md -->
## 14.2 铸造自定义 NFT

# 铸造自定义 NFT

本节将通过一个完整的 Hero NFT 项目，手把手教你如何定义结构体、编写 mint 函数、设置 Display 元数据，以及使用动态对象字段组合 NFT。

## 定义 NFT 结构体

一个好的 NFT 结构体应包含有意义的属性：

```move
module hero::hero;

use std::string::String;
use sui::dynamic_object_field as dof;

public struct Hero has key, store {
    id: UID,
    health: u64,
    stamina: u64,
}

public fun mint_hero(ctx: &mut TxContext): Hero {
    Hero {
        id: object::new(ctx),
        health: 100,
        stamina: 10,
    }
}

public fun health(self: &Hero): u64 { self.health }
public fun stamina(self: &Hero): u64 { self.stamina }
```

## 定义附属 NFT

英雄可以装备武器——另一个独立的 NFT：

```move
module hero::blacksmith;

use std::string::String;

public struct Sword has key, store {
    id: UID,
    name: String,
    damage: u64,
    special_effects: vector<String>,
}

public fun new_sword(
    name: String,
    damage: u64,
    special_effects: vector<String>,
    ctx: &mut TxContext,
): Sword {
    Sword {
        id: object::new(ctx),
        name,
        damage,
        special_effects,
    }
}

public fun name(self: &Sword): &String { &self.name }
public fun damage(self: &Sword): u64 { self.damage }
```

## 组合 NFT（动态对象字段）

通过动态对象字段将武器装备到英雄身上：

```move
module hero::hero;

use hero::blacksmith::Sword;
use sui::dynamic_field as df;
use sui::dynamic_object_field as dof;

const EAlreadyEquipedSword: u64 = 1;

public fun equip_sword(self: &mut Hero, sword: Sword) {
    if (df::exists_(&self.id, b"sword".to_string())) {
        abort(EAlreadyEquipedSword)
    };
    dof::add(&mut self.id, b"sword".to_string(), sword);
}

public fun sword(self: &Hero): &Sword {
    dof::borrow(&self.id, b"sword".to_string())
}
```

## 设置 Display

使用 `Publisher` 和 `Display` 定义 NFT 在前端的展示方式：

```move
module hero::hero;

use sui::display;
use sui::package;

public struct HERO() has drop;

fun init(otw: HERO, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    // 创建 Hero 的 Display
    let mut hero_display = display::new<Hero>(&publisher, ctx);
    hero_display.add(b"name".to_string(), b"Hero #{id}".to_string());
    hero_display.add(
        b"image_url".to_string(),
        b"https://mygame.com/heroes/{id}.png".to_string(),
    );
    hero_display.add(
        b"description".to_string(),
        b"A brave hero with {health} HP".to_string(),
    );
    hero_display.update_version();

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(hero_display, ctx.sender());
}
```

### Display 字段自动填充

Display 模板中的 `{field_name}` 会被对象的实际字段值替换：

```
模板: "A brave hero with {health} HP"
对象: Hero { health: 100, ... }
结果: "A brave hero with 100 HP"
```

## 完整的 Mint 函数

提供公开的 mint 入口函数，带参数验证：

```move
const ENameTooLong: u64 = 2;
const EInvalidDamage: u64 = 3;
const MAX_NAME_LENGTH: u64 = 64;

public fun mint_hero_and_transfer(
    recipient: address,
    ctx: &mut TxContext,
) {
    let hero = mint_hero(ctx);
    transfer::public_transfer(hero, recipient);
}

public fun forge_sword_and_transfer(
    name: String,
    damage: u64,
    special_effects: vector<String>,
    recipient: address,
    ctx: &mut TxContext,
) {
    assert!(name.length() <= MAX_NAME_LENGTH, ENameTooLong);
    assert!(damage > 0, EInvalidDamage);

    let sword = blacksmith::new_sword(name, damage, special_effects, ctx);
    transfer::public_transfer(sword, recipient);
}
```

## 通过 PTB 铸造并装备

在客户端通过可编程交易块（PTB）一次性完成铸造和装备：

```typescript
const tx = new Transaction();

// 铸造 Hero
const hero = tx.moveCall({
  target: `${PACKAGE_ID}::hero::mint_hero`,
  arguments: [],
});

// 铸造 Sword
const sword = tx.moveCall({
  target: `${PACKAGE_ID}::blacksmith::new_sword`,
  arguments: [
    tx.pure.string("Excalibur"),
    tx.pure.u64(100),
    tx.pure(bcs.vector(bcs.string()).serialize(["Fire", "Holy"])),
  ],
});

// 装备
tx.moveCall({
  target: `${PACKAGE_ID}::hero::equip_sword`,
  arguments: [hero, sword],
});

// 转移给用户
tx.transferObjects([hero], account.address);
```

## 测试

```move
#[test_only]
public fun uid_mut_for_testing(self: &mut Hero): &mut UID {
    &mut self.id
}

#[test]
fun mint_and_equip() {
    use std::unit_test::assert_eq;
    use sui::test_utils::destroy;

    let mut ctx = tx_context::dummy();

    let mut hero = mint_hero(&mut ctx);
    assert_eq!(hero.health(), 100);
    assert_eq!(hero.stamina(), 10);

    let sword = blacksmith::new_sword(
        b"Iron Sword".to_string(),
        25,
        vector[b"None".to_string()],
        &mut ctx,
    );

    equip_sword(&mut hero, sword);

    let equipped_sword = hero.sword();
    assert_eq!(equipped_sword.damage(), 25);

    destroy(hero);
}

#[test, expected_failure(abort_code = EAlreadyEquipedSword)]
fun cannot_equip_two_swords() {
    let mut ctx = tx_context::dummy();
    let mut hero = mint_hero(&mut ctx);

    let sword1 = blacksmith::new_sword(
        b"Sword 1".to_string(), 10, vector[], &mut ctx,
    );
    let sword2 = blacksmith::new_sword(
        b"Sword 2".to_string(), 20, vector[], &mut ctx,
    );

    equip_sword(&mut hero, sword1);
    equip_sword(&mut hero, sword2); // 应该失败
}
```

## 小结

- NFT 结构体需要 `key` ability（如需自由交易还需 `store`）
- 通过动态对象字段可实现 NFT 的组合和嵌套（如英雄装备武器）
- `Display` 标准定义前端展示模板，支持字段自动填充
- `Publisher` 对象证明包的发布者身份，是创建 Display 的前提
- PTB 可以在一次交易中完成铸造、装备和转移等多步操作


---


<!-- source: 12_nft_kiosk/kiosk-standard.md -->
## 14.3 Kiosk 标准

# Kiosk 标准

Kiosk 是 Sui 的去中心化商业基础设施，为 NFT 交易提供了标准化的上架、购买和转移机制。每个用户可以拥有自己的 Kiosk（类似于虚拟商店），在其中展示和出售 NFT。本节将介绍 Kiosk 的核心概念和操作流程。

## Kiosk 概念

Kiosk 是一个共享对象，扮演用户的个人商店角色：

- **持有者**通过 `KioskOwnerCap` 管理自己的 Kiosk
- NFT 可以**放置**（place）到 Kiosk 中
- 放置的 NFT 可以**上架**（list）出售
- 买家可以**购买**（purchase）上架的 NFT
- 所有转移受 **TransferPolicy** 约束

```
  卖家                     买家
   │                       │
   ├─ 创建 Kiosk           │
   ├─ 放置 NFT             │
   ├─ 上架（设定价格）      │
   │                       ├─ 浏览 Kiosk
   │                       ├─ 购买 NFT
   │                       ├─ 满足 TransferPolicy
   │                       └─ 获得 NFT
   └─ 提取收益
```

## 创建 Kiosk

```move
use sui::kiosk;

// 创建 Kiosk 和 KioskOwnerCap
let (mut kiosk, kiosk_cap) = kiosk::new(ctx);

// 共享 Kiosk，转移 Cap
transfer::public_share_object(kiosk);
transfer::public_transfer(kiosk_cap, ctx.sender());
```

使用 TypeScript SDK：

```typescript
import { KioskClient, KioskTransaction } from "@mysten/kiosk";

const tx = new Transaction();
const kioskTx = new KioskTransaction({ transaction: tx, kioskClient });

kioskTx.create();
kioskTx.finalize();

const result = await client.signAndExecuteTransaction({ transaction: tx, signer: keypair });
if (result.$kind === 'FailedTransaction') {
  throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction failed');
}
await client.waitForTransaction({ digest: result.Transaction.digest });
```

## 放置和上架

### 放置 NFT

将 NFT 放入 Kiosk（不出售）：

```move
use sui::kiosk;

public fun place_in_kiosk<T: key + store>(
    kiosk: &mut Kiosk,
    cap: &KioskOwnerCap,
    item: T,
) {
    kiosk::place(kiosk, cap, item);
}
```

### 上架出售

设定价格后上架：

```move
public fun list_in_kiosk<T: key + store>(
    kiosk: &mut Kiosk,
    cap: &KioskOwnerCap,
    item_id: ID,
    price: u64,
) {
    kiosk::list<T>(kiosk, cap, item_id, price);
}
```

### 放置并上架（一步完成）

```move
public fun place_and_list<T: key + store>(
    kiosk: &mut Kiosk,
    cap: &KioskOwnerCap,
    item: T,
    price: u64,
) {
    kiosk::place_and_list(kiosk, cap, item, price);
}
```

TypeScript 版本：

```typescript
const kioskTx = new KioskTransaction({
  transaction: tx,
  kioskClient,
  kioskCap: myKioskCap,
});

kioskTx.placeAndList({
  itemType: `${PACKAGE_ID}::sword::Sword`,
  item: swordId,
  price: 1_000_000_000n, // 1 SUI
});

kioskTx.finalize();
```

## 购买

买家从 Kiosk 购买 NFT：

```move
use sui::kiosk;
use sui::coin::Coin;
use sui::sui::SUI;
use sui::transfer_policy::TransferPolicy;

public fun purchase_from_kiosk<T: key + store>(
    kiosk: &mut Kiosk,
    item_id: ID,
    payment: Coin<SUI>,
    policy: &TransferPolicy<T>,
    ctx: &mut TxContext,
) {
    let (item, mut request) = kiosk::purchase<T>(kiosk, item_id, payment);

    // 满足 TransferPolicy 的规则
    // （如果 Policy 为空则无需额外操作）

    // 确认转移
    transfer_policy::confirm_request(policy, request);

    // 转移给买家
    transfer::public_transfer(item, ctx.sender());
}
```

TypeScript 版本：

```typescript
const kioskTx = new KioskTransaction({
  transaction: tx,
  kioskClient,
  kioskCap: buyerKioskCap,
});

await kioskTx.purchase({
  itemType: `${PACKAGE_ID}::sword::Sword`,
  itemId: swordId,
  price: 1_000_000_000n,
  sellerKiosk: sellerKioskId,
});

kioskTx.finalize();
```

## 下架和取回

### 下架

取消出售但保留在 Kiosk 中：

```move
kiosk::delist<Sword>(kiosk, cap, item_id);
```

### 取回

从 Kiosk 中取回 NFT：

```move
let item = kiosk::take<Sword>(kiosk, cap, item_id);
```

## 提取收益

卖家从 Kiosk 中提取销售收益：

```move
let profits = kiosk::withdraw(kiosk, cap, option::none(), ctx);
// option::none() 表示提取全部，也可指定金额
transfer::public_transfer(profits, ctx.sender());
```

## TransferPolicy

每种 NFT 类型需要一个 `TransferPolicy` 来定义转移规则。没有 Policy 的类型无法通过 Kiosk 交易。

### 创建空 Policy

```move
use sui::transfer_policy;
use sui::package;

fun create_policy<T>(publisher: &package::Publisher, ctx: &mut TxContext) {
    let (policy, policy_cap) = transfer_policy::new<T>(publisher, ctx);
    transfer::public_share_object(policy);
    transfer::public_transfer(policy_cap, ctx.sender());
}
```

空的 Policy 意味着无需额外条件即可完成转移。

## 完整交易流程示例

```move
#[test]
fun kiosk_trading() {
    use sui::test_scenario;
    use sui::kiosk;
    use sui::transfer_policy;
    use sui::sui::SUI;
    use sui::coin;

    let seller = @0xSELLER;
    let buyer = @0xBUYER;
    let mut scenario = test_scenario::begin(seller);

    // 卖家创建 Kiosk 并上架 Sword
    {
        let (mut kiosk, cap) = kiosk::new(scenario.ctx());
        let sword = new_sword(b"Flame Sword".to_string(), 50, vector[], scenario.ctx());
        let sword_id = object::id(&sword);
        kiosk::place_and_list(&mut kiosk, &cap, sword, 1_000_000_000);
        transfer::public_share_object(kiosk);
        transfer::public_transfer(cap, seller);
    };

    // 创建 TransferPolicy
    scenario.next_tx(seller);
    // ... 使用 Publisher 创建 Policy

    // 买家购买
    scenario.next_tx(buyer);
    {
        let mut kiosk = scenario.take_shared<kiosk::Kiosk>();
        let payment = coin::mint_for_testing<SUI>(1_000_000_000, scenario.ctx());
        // ... 购买逻辑
        test_scenario::return_shared(kiosk);
    };

    scenario.end();
}
```

## 小结

- Kiosk 是 Sui 的去中心化商店标准，每个用户可拥有自己的 Kiosk
- 操作流程：创建 Kiosk → 放置 NFT → 上架定价 → 买家购买 → 满足 Policy → 转移
- `KioskOwnerCap` 是管理权凭证，持有者可放置、上架、下架、提取收益
- `TransferPolicy` 定义 NFT 转移规则，是 Kiosk 交易的必要组件
- TypeScript SDK 的 `KioskClient` 和 `KioskTransaction` 提供了便捷的客户端操作


---


<!-- source: 12_nft_kiosk/transfer-policies.md -->
## 14.4 自定义转移策略

# 自定义转移策略

TransferPolicy 是 Kiosk 系统中控制 NFT 转移行为的核心机制。通过附加不同的规则（Rule），你可以实现版税收取、锁定要求、个人 Kiosk 限制等高级功能。本节将介绍如何创建和配置 TransferPolicy 及其规则。

## TransferPolicy 概述

当买家从 Kiosk 购买 NFT 时，会生成一个 `TransferRequest`。这个请求必须满足 TransferPolicy 中所有已添加的规则后才能被确认，NFT 才能完成转移。

```
购买 NFT → 生成 TransferRequest → 满足所有 Rule → confirm_request → NFT 转移完成
```

## 创建 TransferPolicy

创建 Policy 需要 `Publisher` 对象证明你是该 NFT 类型的发布者：

```move
use sui::transfer_policy::{Self, TransferPolicy, TransferPolicyCap};
use sui::package::Publisher;

fun create_transfer_policy<T>(
    publisher: &Publisher,
    ctx: &mut TxContext,
) {
    let (policy, policy_cap) = transfer_policy::new<T>(publisher, ctx);
    transfer::public_share_object(policy);
    transfer::public_transfer(policy_cap, ctx.sender());
}
```

## 规则机制说明

Sui Framework 只提供 TransferPolicy 原语（`add_rule`、`get_rule`、`add_receipt`、`add_to_balance` 等），**不提供**现成的 `sui::royalty_rule`、`sui::kiosk_lock_rule` 等模块。版税、锁定、个人 Kiosk 等规则需要：

- 在 Move 中自行基于 `transfer_policy::add_rule` 实现，或  
- 使用生态包（如 [MystenLabs Kiosk 包](https://github.com/MystenLabs/apps/tree/testnet/kiosk)）中提供的规则。

下面以「版税规则」为例说明如何在 Move 中实现并满足规则；TS SDK 的用法仍可与 Kiosk 包或自定义规则配合使用。

### 版税规则（Royalty Rule）示例

每次交易按比例收取版税。前端可使用 `@mysten/kiosk` 的 `RoyaltyRule`（依赖 Kiosk 包）与已有 Policy 交互；在 Move 中需自行实现规则逻辑。

在 Move 中（自定义规则，仅用 framework）：

```move
// 自定义 Rule 与 Config，使用 transfer_policy::add_rule
module game::royalty_rule;

use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::transfer_policy::{Self as policy, TransferPolicy, TransferPolicyCap, TransferRequest};

const MAX_BP: u16 = 10_000;

public struct Rule has drop {}
public struct Config has store, drop { amount_bp: u16 }

public fun add<T: key + store>(
    policy: &mut TransferPolicy<T>,
    cap: &TransferPolicyCap<T>,
    amount_bp: u16,
) {
    assert!(amount_bp <= MAX_BP, 0);
    policy::add_rule(Rule {}, policy, cap, Config { amount_bp })
}

public fun pay<T: key + store>(
    policy: &mut TransferPolicy<T>,
    request: &mut TransferRequest<T>,
    payment: &mut Coin<SUI>,
    ctx: &mut TxContext,
) {
    let paid = policy::paid(request);
    let config = policy::get_rule(Rule {}, policy);
    let amount = ((paid as u128) * (config.amount_bp as u128) / (MAX_BP as u128)) as u64;
    assert!(coin::value(payment) >= amount, 1);
    let fee = coin::split(payment, amount, ctx);
    policy::add_to_balance(Rule {}, policy, fee);
    policy::add_receipt(Rule {}, request)
}
```

添加 5% 版税并创建 Policy 后，购买时需先调用该规则的 `pay` 再 `confirm_request`：

```move
// 购买时：先 pay 版税，再 confirm
let (item, mut request) = kiosk::purchase<Sword>(kiosk, item_id, payment);
royalty_rule::pay(policy, &mut request, &mut royalty_payment, ctx);
transfer_policy::confirm_request(policy, request);
transfer::public_transfer(item, ctx.sender());
```

### 锁定规则（Kiosk Lock Rule）

要求买家将 NFT 锁定在自己的 Kiosk 中，不能直接取出。锁定规则的实现不在 Sui Framework 内，而是由 [Kiosk 包](https://github.com/MystenLabs/apps/tree/testnet/kiosk) 提供（如 `kiosk::kiosk_lock_rule`）。

前端可用 TypeScript 添加规则：

```typescript
import { KioskLockRule } from "@mysten/kiosk/rules";

KioskLockRule.add(tx, {
  policy: policyId,
  policyCap: policyCapId,
});
```

若在 Move 中依赖 Kiosk 包，则添加与满足规则的方式类似：

```move
// 依赖 Kiosk 包时
use kiosk::kiosk_lock_rule;

kiosk_lock_rule::add(policy, cap);

// 购买后锁入买家 Kiosk 并证明
let (item, mut request) = kiosk::purchase<Sword>(seller_kiosk, item_id, payment);
kiosk::lock(buyer_kiosk, buyer_cap, policy, item);
kiosk_lock_rule::prove(&mut request, buyer_kiosk);
```

### 个人 Kiosk 规则（Personal Kiosk Rule）

要求买家使用个人 Kiosk（不可转让 KioskOwnerCap 的 Kiosk）。该规则同样由 Kiosk 生态包提供，Framework 中无对应模块。

```typescript
import { PersonalKioskRule } from "@mysten/kiosk/rules";

PersonalKioskRule.add(tx, {
  policy: policyId,
  policyCap: policyCapId,
});
```

创建个人 Kiosk：

```typescript
const kioskTx = new KioskTransaction({
  transaction: tx,
  kioskClient,
});

kioskTx.createPersonal();
kioskTx.finalize();
```

## 组合多个规则

可以同时添加多个规则，所有规则都必须满足。版税类规则可在本包内用 `transfer_policy::add_rule` 实现；锁定、个人 Kiosk 等需依赖 Kiosk 包：

```move
// 假设本包有 game::royalty_rule，并依赖 Kiosk 包
use game::royalty_rule;
use kiosk::kiosk_lock_rule;
use kiosk::personal_kiosk_rule;

public fun setup_strict_policy(
    policy: &mut TransferPolicy<Sword>,
    cap: &TransferPolicyCap<Sword>,
) {
    royalty_rule::add(policy, cap, 500);      // 5% 版税（自定义规则）
    kiosk_lock_rule::add(policy, cap);       // 必须锁定在 Kiosk（Kiosk 包）
    personal_kiosk_rule::add(policy, cap);   // 必须使用个人 Kiosk（Kiosk 包）
}
```

购买时满足所有规则：

```typescript
const kioskTx = new KioskTransaction({
  transaction: tx,
  kioskClient,
  kioskCap: buyerKioskCap,
});

await kioskTx.purchase({
  itemType: `${PACKAGE_ID}::sword::Sword`,
  itemId: swordId,
  price: 1_000_000_000n,
  sellerKiosk: sellerKioskId,
});

// SDK 会自动解析 Policy 中的规则并生成对应的满足逻辑
kioskTx.finalize();
```

## 自定义规则

除了内置规则，你还可以创建自定义规则：

```move
module game::level_rule;

use sui::transfer_policy::{Self, TransferPolicy, TransferPolicyCap, TransferRequest};

public struct LevelRule() has drop;

public struct Config has store, drop {
    min_level: u64,
}

/// 添加等级要求规则
public fun add<T>(
    policy: &mut TransferPolicy<T>,
    cap: &TransferPolicyCap<T>,
    min_level: u64,
) {
    transfer_policy::add_rule(LevelRule(), policy, cap, Config { min_level });
}

/// 验证买家等级
public fun prove<T>(
    request: &mut TransferRequest<T>,
    player_level: u64,
    policy: &TransferPolicy<T>,
) {
    let config: &Config = transfer_policy::get_rule(LevelRule(), policy);
    assert!(player_level >= config.min_level);
    transfer_policy::add_receipt(LevelRule(), request);
}
```

## 提取版税收益

Policy 持有者可提取收集的版税：

```move
let profits = transfer_policy::withdraw(
    policy,
    cap,
    option::none(), // none 表示全部提取
    ctx,
);
transfer::public_transfer(profits, ctx.sender());
```

## 小结

- TransferPolicy 控制 NFT 通过 Kiosk 交易时的转移行为
- Framework 只提供 `add_rule` / `get_rule` / `add_receipt` 等原语，无现成「内置」版税/锁定/个人 Kiosk 模块；版税等需自行实现或使用 [Kiosk 包](https://github.com/MystenLabs/apps/tree/testnet/kiosk) 中的规则
- 多个规则可组合使用，所有规则都必须满足后转移才能完成
- 可创建自定义规则实现特定业务逻辑
- TypeScript SDK 的 KioskClient 可自动解析 Policy 规则并生成满足逻辑


---


<!-- source: 12_nft_kiosk/build-marketplace.md -->
## 14.5 构建 NFT 市场

# 构建 NFT 市场

本节将所有 Kiosk 相关知识整合，设计一个完整的 NFT 市场。我们将从合约设计到前端集成思路，展示如何构建一个支持上架、购买和版税收取的去中心化 NFT 市场。

## 市场架构

基于 Kiosk 标准的市场架构：

```
┌────────────────────────────────────────────┐
│                 前端 dApp                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 浏览市场  │  │ 上架 NFT │  │ 购买 NFT │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │             │             │        │
├───────┼─────────────┼─────────────┼────────┤
│       │        TypeScript SDK     │        │
│       │        KioskClient        │        │
├───────┼─────────────┼─────────────┼────────┤
│       ▼             ▼             ▼        │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  │
│  │ 索引器   │  │ 卖家     │  │ 买家     │  │
│  │ 查询     │  │ Kiosk    │  │ Kiosk    │  │
│  └─────────┘  └──────────┘  └──────────┘  │
│                     │                      │
│              TransferPolicy                │
│          (版税 + 锁定 + 个人Kiosk)          │
└────────────────────────────────────────────┘
```

## 合约设计

### NFT 定义

```move
module marketplace::sword;

use std::string::String;
use sui::display;
use sui::package;

public struct Sword has key, store {
    id: UID,
    name: String,
    damage: u64,
    special_effects: vector<String>,
}

public struct SWORD() has drop;

fun init(otw: SWORD, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    // 设置 Display
    let mut d = display::new<Sword>(&publisher, ctx);
    d.add(b"name".to_string(), b"{name}".to_string());
    d.add(
        b"image_url".to_string(),
        b"https://mygame.com/swords/{name}.png".to_string(),
    );
    d.add(
        b"description".to_string(),
        b"A sword with {damage} damage".to_string(),
    );
    d.update_version();

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(d, ctx.sender());
}

public fun mint(
    name: String,
    damage: u64,
    special_effects: vector<String>,
    ctx: &mut TxContext,
): Sword {
    Sword {
        id: object::new(ctx),
        name,
        damage,
        special_effects,
    }
}

public fun name(self: &Sword): &String { &self.name }
public fun damage(self: &Sword): u64 { self.damage }
```

### TransferPolicy 配置

Sui Framework 只提供 `transfer_policy::add_rule` 等原语，不包含现成的 `sui::royalty_rule` 或 `sui::kiosk_lock_rule`。版税等规则需要自行实现（或依赖 [Kiosk 生态包](https://github.com/MystenLabs/apps/tree/testnet/kiosk)）。下面示例在包内实现一个简单的版税规则并创建 Policy：

```move
// 包内自定义版税规则（基于 transfer_policy::add_rule）
module marketplace::royalty_rule;

use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::transfer_policy::{Self as policy, TransferPolicy, TransferPolicyCap, TransferRequest};

const MAX_BP: u16 = 10_000;

public struct Rule has drop {}
public struct Config has store, drop { amount_bp: u16 }

public fun add<T: key + store>(
    policy: &mut TransferPolicy<T>,
    cap: &TransferPolicyCap<T>,
    amount_bp: u16,
) {
    assert!(amount_bp <= MAX_BP, 0);
    policy::add_rule(Rule {}, policy, cap, Config { amount_bp })
}

public fun pay<T: key + store>(
    policy: &mut TransferPolicy<T>,
    request: &mut TransferRequest<T>,
    payment: &mut Coin<SUI>,
    ctx: &mut TxContext,
) {
    let paid = policy::paid(request);
    let config = policy::get_rule(Rule {}, policy);
    let amount = ((paid as u128) * (config.amount_bp as u128) / (MAX_BP as u128)) as u64;
    assert!(coin::value(payment) >= amount, 1);
    let fee = coin::split(payment, amount, ctx);
    policy::add_to_balance(Rule {}, policy, fee);
    policy::add_receipt(Rule {}, request)
}
```

```move
module marketplace::policy_setup;

use sui::transfer_policy::{Self, TransferPolicy, TransferPolicyCap};
use sui::package::Publisher;
use marketplace::sword::Sword;
use marketplace::royalty_rule;

public fun create_policy_with_royalty(
    publisher: &Publisher,
    royalty_bps: u16,
    _min_royalty: u64,
    ctx: &mut TxContext,
) {
    let (mut policy, cap) = transfer_policy::new<Sword>(publisher, ctx);

    royalty_rule::add(&mut policy, &cap, royalty_bps);

    transfer::public_share_object(policy);
    transfer::public_transfer(cap, ctx.sender());
}
```

## 前端集成

### 初始化 KioskClient

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { KioskClient, Network } from "@mysten/kiosk";

const suiClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

const kioskClient = new KioskClient({
  client: suiClient,
  network: Network.TESTNET,
});
```

### 创建 Kiosk

```typescript
import { KioskTransaction } from "@mysten/kiosk";
import { Transaction } from "@mysten/sui/transactions";

async function createUserKiosk(signer: Keypair) {
  const tx = new Transaction();
  const kioskTx = new KioskTransaction({
    transaction: tx,
    kioskClient,
  });

  kioskTx.create();
  kioskTx.finalize();

  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer,
  });
  if (result.$kind === 'FailedTransaction') {
    throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction failed');
  }
  await suiClient.waitForTransaction({ digest: result.Transaction.digest });
  return result;
}
```

### 上架 NFT

```typescript
async function listNFT(
  signer: Keypair,
  kioskCap: KioskOwnerCap,
  swordId: string,
  price: bigint,
) {
  const tx = new Transaction();
  const kioskTx = new KioskTransaction({
    transaction: tx,
    kioskClient,
    kioskCap,
  });

  kioskTx.list({
    itemType: `${PACKAGE_ID}::sword::Sword`,
    itemId: swordId,
    price,
  });

  kioskTx.finalize();

  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer,
  });
  if (result.$kind === 'FailedTransaction') {
    throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction failed');
  }
  await suiClient.waitForTransaction({ digest: result.Transaction.digest });
  return result;
}
```

### 购买 NFT

```typescript
async function purchaseNFT(
  signer: Keypair,
  buyerKioskCap: KioskOwnerCap,
  swordId: string,
  sellerKioskId: string,
  price: bigint,
) {
  const tx = new Transaction();
  const kioskTx = new KioskTransaction({
    transaction: tx,
    kioskClient,
    kioskCap: buyerKioskCap,
  });

  await kioskTx.purchase({
    itemType: `${PACKAGE_ID}::sword::Sword`,
    itemId: swordId,
    price,
    sellerKiosk: sellerKioskId,
  });

  kioskTx.finalize();

  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer,
  });
  if (result.$kind === 'FailedTransaction') {
    throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction failed');
  }
  await suiClient.waitForTransaction({ digest: result.Transaction.digest });
  return result;
}
```

### 查询上架 NFT

```typescript
async function getListedItems(kioskId: string) {
  const { items } = await kioskClient.getKiosk({
    id: kioskId,
    options: {
      withListingPrices: true,
      withKioskFields: true,
    },
  });

  return items
    .filter((item) => item.listing !== undefined)
    .map((item) => ({
      id: item.objectId,
      type: item.type,
      price: item.listing?.price,
    }));
}
```

### 提取收益

```typescript
async function withdrawProfits(signer: Keypair, kioskCap: KioskOwnerCap) {
  const tx = new Transaction();
  const kioskTx = new KioskTransaction({
    transaction: tx,
    kioskClient,
    kioskCap,
  });

  kioskTx.withdraw(tx.object(kioskCap.kioskId));
  kioskTx.finalize();

  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer,
  });
  if (result.$kind === 'FailedTransaction') {
    throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction failed');
  }
  await suiClient.waitForTransaction({ digest: result.Transaction.digest });
  return result;
}
```

## 市场功能清单

一个完整的 NFT 市场通常包含：

| 功能 | 合约层 | 前端层 |
| --- | --- | --- |
| 铸造 NFT | Move mint 函数 | Mint 表单页面 |
| 创建 Kiosk | `kiosk::new` | 用户注册时自动创建 |
| 上架 | `kiosk::place_and_list` | 价格设定表单 |
| 购买 | `kiosk::purchase` + Policy 满足 | 购买按钮 + 钱包签名 |
| 下架 | `kiosk::delist` | 管理面板 |
| 提取收益 | `kiosk::withdraw` | 收益提取按钮 |
| 浏览 | 索引器 + RPC | 列表页 + 详情页 |
| 版税 | TransferPolicy | 自动收取 |

## 小结

- 基于 Kiosk 的 NFT 市场是去中心化的——每个用户拥有自己的商店
- 合约层负责 NFT 定义、Display、TransferPolicy 配置
- 前端通过 TypeScript SDK 的 `KioskClient` 和 `KioskTransaction` 交互
- TransferPolicy 的规则（版税、锁定等）自动在购买过程中执行
- SDK 提供了自动解析 Policy 并生成满足逻辑的能力，简化开发


---


<!-- source: 12_nft_kiosk/soulbound-nft.md -->
## 14.6 灵魂绑定 NFT

# 灵魂绑定 NFT

灵魂绑定代币（Soulbound Token, SBT）是不可转移的 NFT，一旦铸造给某个地址就永久绑定。在 Sui 上，这通过去掉 `store` ability 来实现——没有 `store` 的对象无法通过 `transfer::public_transfer` 转移，只能通过模块自定义的函数操作。本节将介绍如何设计和实现灵魂绑定 NFT。

## 设计原理

在 Sui 中，ability 组合决定了对象的行为：

| Ability | 含义 |
| --- | --- |
| `key` | 对象可以存在于链上 |
| `store` | 可被 `public_transfer` 自由转移 |
| `key` 但无 `store` | 只能通过定义模块内的 `transfer::transfer` 转移 |

灵魂绑定 NFT 只有 `key` 而没有 `store`，因此：

- 无法通过标准的 `transfer::public_transfer` 转移
- 无法放入 Kiosk 交易
- 只能通过模块定义的专用函数操作

## 基本实现

### 成就证书

```move
module game::achievement;

use std::string::String;

/// 没有 store ability——不可转移
public struct Achievement has key {
    id: UID,
    name: String,
    description: String,
    earned_by: address,
    earned_at: u64,
}

/// 只有游戏合约可以铸造成就
public fun mint_achievement(
    name: String,
    description: String,
    recipient: address,
    ctx: &mut TxContext,
) {
    let achievement = Achievement {
        id: object::new(ctx),
        name,
        description,
        earned_by: recipient,
        earned_at: ctx.epoch_timestamp_ms(),
    };

    // 使用 transfer::transfer（非 public_transfer）
    // 只有定义模块可以调用
    transfer::transfer(achievement, recipient);
}

public fun name(self: &Achievement): &String { &self.name }
public fun description(self: &Achievement): &String { &self.description }
public fun earned_by(self: &Achievement): address { self.earned_by }
```

### 身份凭证

```move
module identity::credential;

use std::string::String;

public struct Credential has key {
    id: UID,
    holder: address,
    credential_type: String,
    issuer: address,
    issued_at: u64,
    expires_at: Option<u64>,
}

const ENotIssuer: u64 = 1;
const EAlreadyExpired: u64 = 2;

public struct IssuerCap has key, store {
    id: UID,
    issuer_name: String,
}

/// 颁发凭证
public fun issue(
    issuer_cap: &IssuerCap,
    credential_type: String,
    holder: address,
    expires_at: Option<u64>,
    ctx: &mut TxContext,
) {
    let credential = Credential {
        id: object::new(ctx),
        holder,
        credential_type,
        issuer: object::id_address(issuer_cap),
        issued_at: ctx.epoch_timestamp_ms(),
        expires_at,
    };

    transfer::transfer(credential, holder);
}

/// 吊销凭证（需要持有者配合）
public fun revoke(credential: Credential) {
    let Credential { id, .. } = credential;
    object::delete(id);
}

/// 验证凭证是否有效
public fun is_valid(
    credential: &Credential,
    current_time: u64,
): bool {
    match (credential.expires_at) {
        option::some(expiry) => current_time < expiry,
        option::none() => true,
    }
}
```

## 带 Display 的灵魂绑定 NFT

即使 NFT 不可转移，仍可设置 Display 用于展示：

```move
module game::badge;

use std::string::String;
use sui::display;
use sui::package;

public struct Badge has key {
    id: UID,
    title: String,
    tier: u8,  // 1=铜, 2=银, 3=金
    image_url: String,
}

public struct BADGE() has drop;

fun init(otw: BADGE, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    let mut d = display::new<Badge>(&publisher, ctx);
    d.add(b"name".to_string(), b"{title}".to_string());
    d.add(b"image_url".to_string(), b"{image_url}".to_string());
    d.add(
        b"description".to_string(),
        b"Soulbound badge - Tier {tier}".to_string(),
    );
    d.update_version();

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(d, ctx.sender());
}

public fun award_badge(
    title: String,
    tier: u8,
    image_url: String,
    recipient: address,
    ctx: &mut TxContext,
) {
    let badge = Badge {
        id: object::new(ctx),
        title,
        tier,
        image_url,
    };
    transfer::transfer(badge, recipient);
}
```

## 可销毁但不可转移

有时需要允许持有者放弃 SBT（比如注销账号），但不允许转移：

```move
module game::membership;

use std::string::String;

public struct Membership has key {
    id: UID,
    member_name: String,
    level: u64,
    join_date: u64,
}

/// 铸造会员卡
public fun join(
    member_name: String,
    recipient: address,
    ctx: &mut TxContext,
) {
    transfer::transfer(Membership {
        id: object::new(ctx),
        member_name,
        level: 1,
        join_date: ctx.epoch_timestamp_ms(),
    }, recipient);
}

/// 升级会员等级
public fun level_up(membership: &mut Membership) {
    membership.level = membership.level + 1;
}

/// 持有者可以选择销毁（退出）
public fun resign(membership: Membership) {
    let Membership { id, .. } = membership;
    object::delete(id);
}
```

## 灵魂绑定 NFT 的使用场景

### 1. 游戏成就系统

```move
// 首杀成就
award_badge(
    b"First Blood".to_string(),
    1,
    b"https://game.com/badges/first-blood.png".to_string(),
    player,
    ctx,
);
```

### 2. 教育证书

```move
// 课程完成证书
issue(
    &issuer_cap,
    b"Move Developer Certificate".to_string(),
    graduate,
    option::none(), // 永不过期
    ctx,
);
```

### 3. DAO 投票权

```move
public struct VotingPower has key {
    id: UID,
    dao_id: ID,
    weight: u64,
}

// 投票权不可转移，防止投票权买卖
public fun grant_voting_power(
    dao_id: ID,
    weight: u64,
    member: address,
    ctx: &mut TxContext,
) {
    transfer::transfer(VotingPower {
        id: object::new(ctx),
        dao_id,
        weight,
    }, member);
}
```

## 测试灵魂绑定 NFT

```move
#[test]
fun achievement_is_soulbound() {
    use std::unit_test::assert_eq;
    use sui::test_scenario;

    let issuer = @0xISSUER;
    let player = @0xPLAYER;
    let mut scenario = test_scenario::begin(issuer);

    // 铸造成就给玩家
    mint_achievement(
        b"Dragon Slayer".to_string(),
        b"Defeated the final dragon".to_string(),
        player,
        scenario.ctx(),
    );

    // 玩家可以查看自己的成就
    scenario.next_tx(player);
    {
        let achievement = scenario.take_from_sender<Achievement>();
        assert_eq!(achievement.earned_by(), player);
        // 不能 public_transfer——编译器会阻止
        // transfer::public_transfer(achievement, @0xOTHER); // 编译错误！
        scenario.return_to_sender(achievement);
    };

    scenario.end();
}
```

## 小结

- 灵魂绑定 NFT 通过去掉 `store` ability 实现不可转移性
- 只有定义模块可以使用 `transfer::transfer` 转移，外部无法调用 `public_transfer`
- 仍可设置 Display 用于钱包和浏览器展示
- 常见场景包括成就、证书、会员、投票权等
- 可以设计为可销毁（持有者可选择放弃）但不可转移的模式


---


<!-- source: 13_client/index.md -->
## 第十五章 · 客户端与 PTB

# 第十五章 · 客户端与 PTB

本章讲解如何从客户端与 Sui 链交互，包括 SDK 的使用、可编程交易块（PTB）的构造、链上数据的读取以及钱包集成。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 13.1 | Sui Client SDK 概览 | TypeScript / Rust SDK、dApp Kit |
| 13.2 | 可编程交易块（PTB） | 概念、命令类型、链式操作 |
| 13.3 | 读取链上对象 | getObject、multiGetObjects |
| 13.4 | 动态字段查询 | getDynamicFields、getDynamicFieldObject |
| 13.5 | 分页读取 | cursor 分页、批量查询 |
| 13.6 | 交易提交与 Gas 管理 | 签名执行、Gas Budget、赞助交易 |
| 13.7 | 钱包集成 | Wallet Standard、dApp Kit 组件 |

## 学习目标

读完本章后，你将能够：

- 使用 TypeScript SDK 读写 Sui 链上数据
- 构造复杂的可编程交易块（PTB）
- 在 React 应用中集成 Sui 钱包


---


<!-- source: 13_client/client-overview.md -->
## 15.1 Sui Client SDK 概览

# Sui Client SDK 概览

与 Sui 区块链交互需要客户端 SDK。Sui 官方提供了 TypeScript SDK 作为主要的客户端开发工具，同时社区也维护了 Rust、Python 等语言的 SDK。此外，dApp Kit 为 React 开发者提供了开箱即用的组件和 Hooks。本节将概览各 SDK 的特点和适用场景。

## TypeScript SDK

TypeScript SDK（`@mysten/sui`）是最成熟、最常用的 Sui 客户端库，适用于前端 dApp、Node.js 服务和脚本工具。

### 安装

```bash
npm install @mysten/sui
```

### 初始化客户端

推荐使用 **gRPC 客户端**（`SuiGrpcClient`），性能更好；需要 JSON-RPC 时使用 `SuiJsonRpcClient`：

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";

// 推荐：gRPC 客户端
const testnetClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

const mainnetClient = new SuiGrpcClient({
  network: "mainnet",
  baseUrl: "https://fullnode.mainnet.sui.io:443",
});
```

```typescript
// 可选：JSON-RPC 客户端（旧 API，仍可用）
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";

const client = new SuiJsonRpcClient({
  url: getJsonRpcFullnodeUrl("testnet"),
  network: "testnet",
});
```

可用网络：

| 网络 | 用途 |
| --- | --- |
| `devnet` | 开发测试，频繁重置 |
| `testnet` | 集成测试，较稳定 |
| `mainnet` | 生产环境 |
| `localnet` | 本地开发 |

### 查询余额

```typescript
// v2：使用 client.core.listBalances，再按 coinType 汇总
const { data: balances } = await client.core.listBalances({
  owner: "0xYOUR_ADDRESS",
});
const suiBalance = balances.find((b) => b.coinType === "0x2::sui::SUI");
console.log(`Balance: ${suiBalance?.totalBalance ?? 0}`);
```

### 使用水龙头

在 devnet/testnet 上可以免费获取测试 SUI：

```typescript
import { getFaucetHost, requestSuiFromFaucetV2 } from "@mysten/sui/faucet";

await requestSuiFromFaucetV2({
  host: getFaucetHost("devnet"),
  recipient: "0xYOUR_ADDRESS",
});
```

### 密钥管理

```typescript
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

// 生成新密钥对
const keypair = new Ed25519Keypair();

// 从私钥导入
const keypairFromSecret = Ed25519Keypair.fromSecretKey(secretKey);

// 从助记词导入
const keypairFromMnemonic = Ed25519Keypair.deriveKeypair(mnemonic);

console.log(`Address: ${keypair.toSuiAddress()}`);
```

## gRPC 与 JSON-RPC

**SuiGrpcClient**（见上文「初始化客户端」）使用二进制 gRPC 协议，为当前推荐方式。**SuiJsonRpcClient** 使用 JSON-RPC，兼容旧版节点或工具时可选。

## dApp Kit（React）

dApp Kit 为 React 开发者提供了完整的 Sui dApp 开发工具包：

### 安装

```bash
npm install @mysten/dapp-kit-react
```

### 配置 Provider

```tsx
import { createDAppKit, DAppKitProvider } from "@mysten/dapp-kit-react";
import { SuiGrpcClient } from "@mysten/sui/grpc";

const dAppKit = createDAppKit({
  networks: ["devnet", "testnet", "mainnet"],
  defaultNetwork: "testnet",
  createClient(network) {
    return new SuiGrpcClient({ network });
  },
});

function App() {
  return (
    <DAppKitProvider dAppKit={dAppKit}>
      <MyApp />
    </DAppKitProvider>
  );
}
```

### 核心 Hooks

```tsx
import {
  ConnectButton,
  useCurrentAccount,
  useCurrentClient,
  useDAppKit,
} from "@mysten/dapp-kit-react";

function MyComponent() {
  const account = useCurrentAccount();
  const client = useCurrentClient();
  const dAppKit = useDAppKit();

  if (!account) return <ConnectButton />;

  return <p>Connected: {account.address}</p>;
}
```

### 签名并执行交易

```tsx
import { Transaction } from "@mysten/sui/transactions";
import { useDAppKit, useCurrentAccount, useCurrentClient } from "@mysten/dapp-kit-react";

function MintButton() {
  const dAppKit = useDAppKit();
  const client = useCurrentClient();
  const account = useCurrentAccount();

  const handleMint = async () => {
    const tx = new Transaction();
    const hero = tx.moveCall({
      target: `${PACKAGE_ID}::hero::mint_hero`,
      arguments: [],
    });
    tx.transferObjects([hero], account!.address);

    const result = await dAppKit.signAndExecuteTransaction({
      transaction: tx,
    });

    if (result.$kind === "FailedTransaction") {
      throw new Error(result.FailedTransaction.status.error?.message ?? "Transaction failed");
    }
    await client.waitForTransaction({ digest: result.Transaction.digest });
    console.log("Transaction digest:", result.Transaction.digest);
  };

  return <button onClick={handleMint}>Mint Hero</button>;
}
```

## Rust SDK

Sui Rust SDK 适用于后端服务、命令行工具和高性能应用：

```rust
use sui_sdk::SuiClientBuilder;

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let sui = SuiClientBuilder::default()
        .build("https://fullnode.testnet.sui.io:443")
        .await?;

    let address = "0xYOUR_ADDRESS".parse()?;
    let balance = sui.coin_read_api().get_balance(address, None).await?;

    println!("Balance: {}", balance.total_balance);
    Ok(())
}
```

## SDK 选择指南

| 场景 | 推荐 SDK |
| --- | --- |
| React 前端 dApp | dApp Kit + TypeScript SDK |
| Node.js 后端服务 | TypeScript SDK |
| 命令行工具 | TypeScript SDK 或 Rust SDK |
| 高性能后端 | Rust SDK 或 gRPC Client |
| 脚本和自动化 | TypeScript SDK |
| 移动端 | TypeScript SDK (React Native) |

## 测试连接

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";

async function testConnection() {
  const client = new SuiGrpcClient({
    network: "devnet",
    baseUrl: "https://fullnode.devnet.sui.io:443",
  });

  const chainId = await client.getChainIdentifier();
  console.log("Chain ID:", chainId);
}

testConnection();
```

## 小结

- TypeScript SDK 是最主要的 Sui 客户端库，覆盖所有常见操作
- 推荐使用 `SuiGrpcClient`（`@mysten/sui/grpc`）连接全节点；可选 `SuiJsonRpcClient`（`@mysten/sui/jsonRpc`）
- dApp Kit 为 React 提供了 Provider、Hooks 和 ConnectButton
- gRPC 客户端使用二进制协议，适合高性能场景
- Rust SDK 适用于后端服务和命令行工具
- 根据应用场景选择合适的 SDK 组合


---


<!-- source: 13_client/ptb.md -->
## 15.2 可编程交易块（PTB）

# 可编程交易块（PTB）

可编程交易块（Programmable Transaction Blocks, PTBs）是 Sui 的核心特性之一，允许在单个交易中原子地执行多个操作。PTB 无需修改智能合约就能在客户端灵活组合多个 Move 调用，极大地提升了效率和用户体验。

## PTB 概念

### 传统方式 vs PTB

**传统方式**（两笔独立交易）：

```
交易 1: 拆分代币 → 等待确认
交易 2: 转移拆分出的代币 → 等待确认
```

问题：非原子执行、Gas 更高、错误处理复杂。

**PTB 方式**（单笔交易）：

```
交易: [拆分代币] → [转移代币]    // 原子执行
```

优势：原子性（全成功或全失败）、更低 Gas、更简单。

### PTB 的优势

1. **原子性**：所有操作要么全部成功，要么全部回滚
2. **低 Gas**：一笔交易比多笔交易更省 Gas
3. **可组合**：无需合约间直接依赖就能组合调用
4. **灵活性**：无需升级合约即可创建新的操作流程

## 命令类型

PTB 支持以下命令类型：

### MoveCall

调用 Move 函数：

```typescript
const tx = new Transaction();

const hero = tx.moveCall({
  target: `${PACKAGE_ID}::hero::mint_hero`,
  arguments: [],
});
```

### SplitCoins

从一个代币中拆分出新的代币：

```typescript
const tx = new Transaction();

// 从 Gas 代币中拆分出 1 SUI
const coin = tx.splitCoins(tx.gas, [1_000_000_000]);
```

### MergeCoins

合并多个同类型代币：

```typescript
const tx = new Transaction();

tx.mergeCoins(tx.object(coinId1), [tx.object(coinId2), tx.object(coinId3)]);
```

### TransferObjects

转移对象到指定地址：

```typescript
const tx = new Transaction();

const hero = tx.moveCall({
  target: `${PACKAGE_ID}::hero::mint_hero`,
  arguments: [],
});

tx.transferObjects([hero], "0xRECIPIENT_ADDRESS");
```

### MakeMoveVec

创建 Move vector：

```typescript
const tx = new Transaction();

const vec = tx.makeMoveVec({
  type: "u64",
  elements: [tx.pure.u64(1), tx.pure.u64(2), tx.pure.u64(3)],
});
```

## 构建 PTB

### 基本结构

```typescript
import { Transaction } from "@mysten/sui/transactions";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const client = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});
const keypair = Ed25519Keypair.fromSecretKey(secretKey);

const tx = new Transaction();

// 添加命令
// ...

const result = await client.signAndExecuteTransaction({
  transaction: tx,
  signer: keypair,
});

if (result.$kind === "FailedTransaction") {
  throw new Error(result.FailedTransaction.status.error?.message ?? "Transaction failed");
}

await client.waitForTransaction({ digest: result.Transaction.digest });
```

### 传递参数

```typescript
const tx = new Transaction();

// 纯值参数
tx.moveCall({
  target: `${PACKAGE_ID}::game::set_name`,
  arguments: [
    tx.object(heroId),         // 对象参数
    tx.pure.string("Hero #1"), // 字符串参数
    tx.pure.u64(100),          // 数值参数
    tx.pure.bool(true),        // 布尔参数
    tx.pure.address("0xABC"),  // 地址参数
  ],
});
```

### 链式操作

PTB 的真正强大之处在于链式操作——前一个命令的返回值可以作为后一个命令的输入：

```typescript
const tx = new Transaction();

// 步骤 1: 铸造 Hero
const hero = tx.moveCall({
  target: `${PACKAGE_ID}::hero::mint_hero`,
  arguments: [],
});

// 步骤 2: 铸造 Sword
const sword = tx.moveCall({
  target: `${PACKAGE_ID}::blacksmith::new_sword`,
  arguments: [
    tx.pure.string("Excalibur"),
    tx.pure.u64(100),
  ],
});

// 步骤 3: 装备（使用前两步的返回值）
tx.moveCall({
  target: `${PACKAGE_ID}::hero::equip_sword`,
  arguments: [hero, sword],
});

// 步骤 4: 转移
tx.transferObjects([hero], account.address);
```

## CLI 中的 PTB

Sui CLI 也支持直接执行 PTB：

### 拆分并转移

```bash
sui client ptb \
    --split-coins @$COIN_ID [1000000000] \
    --assign coin \
    --transfer-objects [coin] @RECIPIENT_ADDRESS
```

### 复杂 PTB

```bash
sui client ptb \
    --move-call $PKG::hero::mint_hero \
    --assign hero \
    --move-call $PKG::blacksmith::new_sword \
        '"Excalibur"' 100 \
    --assign sword \
    --move-call $PKG::hero::equip_sword hero sword \
    --transfer-objects [hero] @MY_ADDRESS
```

## 动态合约组合

PTB 最强大的能力是在客户端动态组合多个合约调用，无需合约之间存在直接依赖：

```typescript
const tx = new Transaction();

// 调用天气预言机
const weather = tx.moveCall({
  target: `${WEATHER_PKG}::oracle::get_weather`,
  arguments: [tx.object(oracleId)],
});

// 调用姓名索引器
const name = tx.moveCall({
  target: `${NAMES_PKG}::indexer::get_name`,
  arguments: [tx.object(indexerId), tx.pure.address(userAddr)],
});

// 调用年龄计算器
const age = tx.moveCall({
  target: `${AGE_PKG}::calculator::calculate_age`,
  arguments: [tx.pure.u64(birthYear)],
});

// 组合所有信息发出事件
tx.moveCall({
  target: `${EVENT_PKG}::emitter::emit_greeting`,
  arguments: [name, age, weather],
});
```

这些合约之间没有任何依赖关系，但通过 PTB 可以在客户端自由组合。

## 处理执行结果

```typescript
const result = await client.signAndExecuteTransaction({
  transaction: tx,
  signer: keypair,
  include: {
    effects: true,
    balanceChanges: true,
    objectTypes: true,
    events: true,
  },
});

// 必须按 result.$kind 检查成功或失败
if (result.$kind === "FailedTransaction") {
  throw new Error(result.FailedTransaction.status.error?.message ?? "Transaction failed");
}

const txResult = result.Transaction;
console.log("Transaction succeeded!", txResult.digest);

// 查看余额变化、事件等（若 include 中已请求）
const balanceChanges = txResult.balanceChanges;
const events = txResult.events;
await client.waitForTransaction({ digest: txResult.digest });
```

## 小结

- PTB 允许在单笔交易中原子地执行多个操作，降低 Gas 并简化错误处理
- 支持 MoveCall、SplitCoins、MergeCoins、TransferObjects 等命令类型
- 命令之间可链式传递返回值，实现复杂的操作流程
- 支持在客户端动态组合不同合约的调用，无需合约间直接依赖
- CLI 和 TypeScript SDK 都支持构建和执行 PTB


---


<!-- source: 13_client/read-objects.md -->
## 15.3 读取链上对象

# 读取链上对象

与 Sui 区块链交互的第一步通常是读取链上数据。TypeScript SDK 提供了丰富的查询方法，可以按 ID 获取单个对象、批量获取多个对象，以及按条件过滤。本节将介绍这些核心读取操作。

## getObject

获取单个对象的完整信息：

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";

const client = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

const object = await client.core.getObject({
  objectId: "0xOBJECT_ID",
  include: {
    content: true,   // 返回对象内容（字段值）
    type: true,      // 返回对象类型
    owner: true,     // 返回所有者信息
    display: true,   // 返回 Display 渲染结果
  },
});
```

### 返回结构

```typescript
{
  data: {
    objectId: "0x...",
    version: "123",
    digest: "...",
    type: "0xPKG::hero::Hero",
    owner: {
      AddressOwner: "0xOWNER_ADDRESS"
    },
    content: {
      dataType: "moveObject",
      type: "0xPKG::hero::Hero",
      fields: {
        id: { id: "0x..." },
        health: "100",
        stamina: "10"
      }
    },
    display: {
      data: {
        name: "Hero #1",
        image_url: "https://...",
        description: "..."
      }
    }
  }
}
```

### 解析对象字段

```typescript
interface Hero {
  health: number;
  stamina: number;
}

function parseHero(data: any): Hero {
  const fields = data.data?.content?.fields;
  if (!fields) throw new Error("Invalid hero data");

  return {
    health: Number(fields.health),
    stamina: Number(fields.stamina),
  };
}

const object = await client.core.getObject({
  objectId: heroId,
  include: { content: true },
});

const hero = parseHero(object);
console.log(`Health: ${hero.health}, Stamina: ${hero.stamina}`);
```

## multiGetObjects

批量获取多个对象，比循环调用 `getObject` 更高效：

```typescript
const { data: objects } = await client.core.getObjects({
  objectIds: ["0xOBJ1", "0xOBJ2", "0xOBJ3"],
  include: { content: true, type: true },
});

objects.forEach((obj) => {
  if (obj.data) {
    console.log(`Object ${obj.data.objectId}: ${obj.data.type}`);
  } else {
    console.log("Object not found or error:", obj.error);
  }
});
```

## getOwnedObjects

获取某地址拥有的所有对象：

```typescript
const { data: ownedObjects } = await client.core.listOwnedObjects({
  owner: "0xOWNER_ADDRESS",
  include: { content: true, type: true },
});

console.log(`Total objects: ${ownedObjects.length}`);
ownedObjects.forEach((item) => {
  console.log(`  ${item.data?.objectId}: ${item.data?.type}`);
});
```

### 按类型过滤

```typescript
const { data: heroes } = await client.core.listOwnedObjects({
  owner: userAddress,
  filter: {
    StructType: `${PACKAGE_ID}::hero::Hero`,
  },
  include: { content: true, display: true },
});
```

### 过滤器类型

| 过滤器 | 说明 | 示例 |
| --- | --- | --- |
| `StructType` | 按对象类型过滤 | `"0xPKG::module::Type"` |
| `Package` | 按包 ID 过滤 | `"0xPKG_ID"` |
| `MatchAll` | 组合多个过滤条件（AND） | `[filter1, filter2]` |
| `MatchAny` | 满足任一条件（OR） | `[filter1, filter2]` |
| `MatchNone` | 排除条件 | `[filter1]` |

## 处理对象版本

Sui 对象有版本概念。默认获取最新版本，也可指定特定版本：

```typescript
// 获取特定版本（v2：使用 getObject 的 version 或等价 API）
const historicalObject = await client.core.getObject({
  objectId,
  version: 42,
  include: { content: true },
});
```

## 错误处理

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";

async function safeGetObject(client: SuiGrpcClient, id: string) {
  try {
    const result = await client.core.getObject({
      objectId: id,
      include: { content: true },
    });

    if (result.error) {
      if (result.error.code === "notExists") {
        console.log("Object does not exist");
        return null;
      }
      if (result.error.code === "deleted") {
        console.log("Object has been deleted");
        return null;
      }
      throw new Error(`Unknown error: ${result.error.code}`);
    }

    return result.data;
  } catch (e) {
    console.error("Failed to fetch object:", e);
    return null;
  }
}
```

## 完整示例：读取 Hero NFT

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";

const PACKAGE_ID = "0x...";

interface HeroData {
  objectId: string;
  health: number;
  stamina: number;
  swordIds: string[];
}

async function getHeroData(
  client: SuiGrpcClient,
  heroId: string,
): Promise<HeroData> {
  // 获取 Hero 对象
  const hero = await client.core.getObject({
    objectId: heroId,
    include: { content: true, type: true },
  });

  if (!hero.data?.content || hero.data.content.dataType !== "moveObject") {
    throw new Error("Invalid hero object");
  }

  const fields = hero.data.content.fields as any;

  // 获取动态对象字段（装备的武器）
  const { data: dynamicFields } = await client.core.listDynamicFields({
    parentId: heroId,
  });

  const swordIds = dynamicFields
    .filter((df) => df.objectType?.includes("Sword"))
    .map((df) => df.objectId);

  return {
    objectId: hero.data.objectId,
    health: Number(fields.health),
    stamina: Number(fields.stamina),
    swordIds,
  };
}

// 使用
const client = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});
const hero = await getHeroData(client, "0xHERO_ID");
console.log(hero);
```

## 小结

- `client.core.getObject` 获取单个对象，通过 `include` 控制返回的信息粒度
- `client.core.getObjects` 批量获取对象，适合需要同时读取多个对象的场景
- `client.core.listOwnedObjects` 获取地址拥有的对象，支持按类型过滤
- 对象字段在 `content.fields` 中，需要手动解析类型
- 始终做好错误处理，对象可能不存在或已被删除


---


<!-- source: 13_client/query-dynamic-fields.md -->
## 15.4 动态字段查询

# 动态字段查询

动态字段（Dynamic Fields）和动态对象字段（Dynamic Object Fields）是 Sui 中实现灵活数据结构的关键特性。在客户端查询这些字段需要专门的 API。本节将介绍如何使用 TypeScript SDK 查询和读取动态字段。

## 动态字段 vs 动态对象字段

| 特性 | 动态字段 (DF) | 动态对象字段 (DOF) |
| --- | --- | --- |
| 值类型 | 任意类型 | 必须是对象（有 `key`） |
| 独立访问 | 不能独立访问 | 可通过 ID 独立访问 |
| Move API | `dynamic_field` | `dynamic_object_field` |
| 适用场景 | 简单键值存储 | 嵌套对象（如装备） |

## getDynamicFields

列出对象的所有动态字段：

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";

const client = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

const { data: dynamicFields } = await client.core.listDynamicFields({
  parentId: "0xPARENT_OBJECT_ID",
});

console.log("Dynamic fields:", dynamicFields);
```

### 返回结构

```typescript
{
  data: [
    {
      name: {
        type: "0x1::string::String",
        value: "sword"
      },
      bcsName: "...",
      type: "DynamicObject",   // 或 "DynamicField"
      objectType: "0xPKG::blacksmith::Sword",
      objectId: "0xSWORD_ID",
      version: 42,
      digest: "..."
    },
    // ... 更多字段
  ],
  nextCursor: null,   // 分页游标
  hasNextPage: false
}
```

### 按类型过滤

```typescript
const { data: allFields } = await client.core.listDynamicFields({
  parentId: heroId,
});

// 过滤出 Sword 类型的动态对象字段
const swords = allFields.filter(
  (field) => field.objectType?.includes("Sword")
);

console.log(`Hero has ${swords.length} swords`);
```

## getDynamicField

获取特定动态字段的完整对象数据（v2：`client.core.getDynamicField`）：

```typescript
const swordData = await client.core.getDynamicField({
  parentId: heroId,
  name: {
    type: "0x1::string::String",
    value: "sword",
  },
});

if (swordData.data?.content?.dataType === "moveObject") {
  const fields = swordData.data.content.fields as any;
  console.log(`Sword name: ${fields.name}`);
  console.log(`Sword damage: ${fields.damage}`);
}
```

### name 参数格式

`name` 参数需要指定类型和值：

```typescript
// 字符串键
{
  type: "0x1::string::String",
  value: "my_key"
}

// u64 键
{
  type: "u64",
  value: "42"
}

// 地址键
{
  type: "address",
  value: "0xABC..."
}

// 自定义结构体键
{
  type: "0xPKG::module::KeyType",
  value: { /* BCS 编码的值 */ }
}
```

## 完整示例：查询 Hero 的武器

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";

const PACKAGE_ID = "0x...";

interface Sword {
  objectId: string;
  name: string;
  damage: number;
  specialEffects: string[];
}

async function getHeroSwords(
  client: SuiGrpcClient,
  heroId: string,
): Promise<Sword[]> {
  // 步骤 1: 列出所有动态字段
  const { data: dynamicFields } = await client.core.listDynamicFields({
    parentId: heroId,
  });

  // 步骤 2: 过滤 Sword 类型的字段
  const swordFields = dynamicFields.filter(
    (field) => field.objectType === `${PACKAGE_ID}::blacksmith::Sword`
  );

  // 步骤 3: 获取每把 Sword 的详细数据
  const swords: Sword[] = [];

  for (const field of swordFields) {
    const swordObj = await client.core.getDynamicField({
      parentId: heroId,
      name: field.name,
    });

    if (swordObj.data?.content?.dataType === "moveObject") {
      const fields = swordObj.data.content.fields as any;
      swords.push({
        objectId: swordObj.data.objectId,
        name: fields.name,
        damage: Number(fields.damage),
        specialEffects: fields.special_effects || [],
      });
    }
  }

  return swords;
}

// 使用
const client = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});
const swords = await getHeroSwords(client, "0xHERO_ID");
swords.forEach((sword) => {
  console.log(`${sword.name}: ${sword.damage} damage`);
});
```

## 批量查询优化

当需要查询大量动态字段时，可以使用 `client.core.getObjects` 优化：

```typescript
async function getHeroSwordsOptimized(
  client: SuiGrpcClient,
  heroId: string,
): Promise<Sword[]> {
  // 列出所有动态字段
  const { data: dynamicFields } = await client.core.listDynamicFields({
    parentId: heroId,
  });

  const swordFields = dynamicFields.filter(
    (field) => field.objectType?.includes("Sword")
  );

  if (swordFields.length === 0) return [];

  // 批量获取所有 Sword 对象
  const swordIds = swordFields.map((f) => f.objectId);
  const { data: objects } = await client.core.getObjects({
    objectIds: swordIds,
    include: { content: true },
  });

  return objects
    .filter((obj) => obj.data?.content?.dataType === "moveObject")
    .map((obj) => {
      const fields = (obj.data!.content as any).fields;
      return {
        objectId: obj.data!.objectId,
        name: fields.name,
        damage: Number(fields.damage),
        specialEffects: fields.special_effects || [],
      };
    });
}
```

## Table 和 Bag 的动态字段查询

Move 中的 `Table`、`Bag`、`ObjectTable`、`ObjectBag` 底层都使用动态字段实现，查询方式相同：

```typescript
// 查询 Table 的内容
const { data: tableEntries } = await client.core.listDynamicFields({
  parentId: tableObjectId,
});

// 获取特定条目
const entry = await client.core.getDynamicField({
  parentId: tableObjectId,
  name: {
    type: "address",
    value: "0xUSER_ADDRESS",
  },
});
```

## 小结

- `client.core.listDynamicFields` 列出对象的所有动态字段，返回字段名、类型和对象 ID
- `client.core.getDynamicField` 获取特定动态字段的完整对象数据
- 动态字段的 `name` 参数需要同时指定类型和值
- 对大量字段可使用 `client.core.getObjects` 批量查询优化性能
- `Table`、`Bag` 等集合类型底层使用动态字段，查询方式相同


---


<!-- source: 13_client/paginated-reads.md -->
## 15.5 分页读取

# 分页读取

当查询结果可能包含大量数据时（如某地址拥有数百个 NFT），Sui API 使用基于游标（cursor）的分页机制。本节将介绍如何正确处理分页，获取完整的数据集。

## 分页机制

Sui 的分页 API 返回三个关键字段：

```typescript
{
  data: [...],           // 当前页的数据
  nextCursor: "...",     // 下一页的游标（null 表示无更多数据）
  hasNextPage: true      // 是否有下一页
}
```

## 基本分页查询

### getOwnedObjects 分页

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";

const client = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

// 获取第一页
const firstPage = await client.core.listOwnedObjects({
  owner: userAddress,
  include: { type: true },
  limit: 50, // 每页最多 50 条
});

console.log(`Page 1: ${firstPage.data.length} objects`);
console.log(`Has next page: ${firstPage.hasNextPage}`);

// 获取第二页
if (firstPage.hasNextPage && firstPage.nextCursor) {
  const secondPage = await client.core.listOwnedObjects({
    owner: userAddress,
    include: { type: true },
    limit: 50,
    cursor: firstPage.nextCursor,
  });

  console.log(`Page 2: ${secondPage.data.length} objects`);
}
```

## 获取所有数据

### 循环分页

最常见的模式——循环获取所有页面：

```typescript
async function getAllOwnedObjects(
  client: SuiGrpcClient,
  owner: string,
): Promise<any[]> {
  const allObjects: any[] = [];
  let cursor: string | null | undefined = undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await client.core.listOwnedObjects({
      owner,
      include: { content: true, type: true },
      limit: 50,
      cursor,
    });

    allObjects.push(...page.data);
    hasNextPage = page.hasNextPage;
    cursor = page.nextCursor;
  }

  return allObjects;
}

// 使用
const objects = await getAllOwnedObjects(client, userAddress);
console.log(`Total objects: ${objects.length}`);
```

### 带类型过滤的分页

```typescript
async function getAllHeroes(
  client: SuiGrpcClient,
  owner: string,
  packageId: string,
): Promise<any[]> {
  const allHeroes: any[] = [];
  let cursor: string | null | undefined = undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await client.core.listOwnedObjects({
      owner,
      filter: {
        StructType: `${packageId}::hero::Hero`,
      },
      include: { content: true, display: true },
      limit: 50,
      cursor,
    });

    allHeroes.push(...page.data);
    hasNextPage = page.hasNextPage;
    cursor = page.nextCursor;
  }

  return allHeroes;
}
```

## getDynamicFields 分页

动态字段查询同样支持分页：

```typescript
async function getAllDynamicFields(
  client: SuiGrpcClient,
  parentId: string,
): Promise<any[]> {
  const allFields: any[] = [];
  let cursor: string | null | undefined = undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await client.core.listDynamicFields({
      parentId,
      limit: 50,
      cursor,
    });

    allFields.push(...page.data);
    hasNextPage = page.hasNextPage;
    cursor = page.nextCursor;
  }

  return allFields;
}
```

## 查询交易记录分页

```typescript
async function getTransactionHistory(
  client: SuiGrpcClient,
  address: string,
  maxResults: number = 100,
): Promise<any[]> {
  const transactions: any[] = [];
  let cursor: string | null | undefined = undefined;
  let hasNextPage = true;

  while (hasNextPage && transactions.length < maxResults) {
    const page = await client.core.queryTransactions({
      filter: {
        FromAddress: address,
      },
      include: { effects: true, events: true },
      limit: Math.min(50, maxResults - transactions.length),
      cursor,
      order: "descending",
    });

    transactions.push(...page.data);
    hasNextPage = page.hasNextPage;
    cursor = page.nextCursor;
  }

  return transactions;
}
```

## 通用分页工具函数

创建一个可复用的分页工具：

```typescript
interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null | undefined;
  hasNextPage: boolean;
}

async function fetchAllPages<T>(
  fetcher: (cursor?: string | null) => Promise<PaginatedResult<T>>,
  maxItems?: number,
): Promise<T[]> {
  const allItems: T[] = [];
  let cursor: string | null | undefined = undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    if (maxItems && allItems.length >= maxItems) break;

    const page = await fetcher(cursor);
    allItems.push(...page.data);
    hasNextPage = page.hasNextPage;
    cursor = page.nextCursor;
  }

  return maxItems ? allItems.slice(0, maxItems) : allItems;
}

// 使用
const allObjects = await fetchAllPages((cursor) =>
  client.core.listOwnedObjects({
    owner: userAddress,
    include: { type: true },
    limit: 50,
    cursor: cursor ?? undefined,
  })
);
```

## 性能优化

### 并行获取详情

列表查询后需要获取详情时，使用 `multiGetObjects` 替代循环：

```typescript
async function getOwnedHeroesWithDetails(
  client: SuiGrpcClient,
  owner: string,
  packageId: string,
): Promise<any[]> {
  // 步骤 1: 获取所有 Hero ID
  const ownedObjects = await fetchAllPages((cursor) =>
    client.core.listOwnedObjects({
      owner,
      filter: { StructType: `${packageId}::hero::Hero` },
      limit: 50,
      cursor: cursor ?? undefined,
    })
  );

  const heroIds = ownedObjects
    .map((obj) => obj.data?.objectId)
    .filter(Boolean) as string[];

  if (heroIds.length === 0) return [];

  // 步骤 2: 批量获取详情（每批 50 个）
  const batchSize = 50;
  const allDetails: any[] = [];

  for (let i = 0; i < heroIds.length; i += batchSize) {
    const batch = heroIds.slice(i, i + batchSize);
    const { data: details } = await client.core.getObjects({
      objectIds: batch,
      include: { content: true, display: true },
    });
    allDetails.push(...details);
  }

  return allDetails;
}
```

### 控制请求频率

避免过于频繁的 API 请求：

```typescript
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRateLimit<T>(
  fetcher: (cursor?: string | null) => Promise<PaginatedResult<T>>,
  delayMs: number = 100,
): Promise<T[]> {
  const allItems: T[] = [];
  let cursor: string | null | undefined = undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await fetcher(cursor);
    allItems.push(...page.data);
    hasNextPage = page.hasNextPage;
    cursor = page.nextCursor;

    if (hasNextPage) await delay(delayMs);
  }

  return allItems;
}
```

## 小结

- Sui API 使用基于 cursor 的分页机制，通过 `nextCursor` 和 `hasNextPage` 控制
- 使用 while 循环遍历所有页面获取完整数据集
- 可以创建通用的 `fetchAllPages` 工具函数简化分页代码
- 获取详情时优先使用 `client.core.getObjects` 批量查询
- 注意控制请求频率和设置最大结果数，避免过载


---


<!-- source: 13_client/transaction-and-gas.md -->
## 15.6 交易提交与 Gas 管理

# 交易提交与 Gas 管理

在 Sui 上执行交易涉及构建交易、签名、提交和处理结果。Gas 管理是其中的关键环节——理解 Gas Budget、Gas Price 和 Balance Changes 有助于构建可靠的应用。本节将详细介绍交易提交的完整流程和 Gas 管理策略。

## 交易提交流程

```
构建交易 → 签名 → 提交 → 等待确认 → 处理结果
   │          │        │         │           │
Transaction  Keypair  Client  waitFor    Effects
```

## 构建和签名交易

### 基本流程

```typescript
import { Transaction } from "@mysten/sui/transactions";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const client = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});
const keypair = Ed25519Keypair.fromSecretKey(secretKey);

// 构建交易
const tx = new Transaction();
const [coin] = tx.splitCoins(tx.gas, [1_000_000_000]);
tx.transferObjects([coin], "0xRECIPIENT");

// 签名并执行
const result = await client.signAndExecuteTransaction({
  transaction: tx,
  signer: keypair,
});

if (result.$kind === "FailedTransaction") {
  throw new Error(result.FailedTransaction.status.error?.message ?? "Transaction failed");
}
await client.waitForTransaction({ digest: result.Transaction.digest });
```

### 分步执行

如果需要更细粒度的控制：

```typescript
// 步骤 1: 构建交易字节
tx.setSender(keypair.toSuiAddress());
const bytes = await tx.build({ client });

// 步骤 2: 签名
const signature = await keypair.signTransaction(bytes);

// 步骤 3: 提交（低层 API；一般直接使用 signAndExecuteTransaction 即可）
const result = await client.core.executeTransaction({
  transaction: bytes,
  signatures: [signature.signature],
  include: { effects: true },
});

if (result.$kind === "FailedTransaction") {
  throw new Error(result.FailedTransaction.status.error?.message ?? "Transaction failed");
}
await client.waitForTransaction({ digest: result.Transaction.digest });
```

## Gas 管理

### Gas Budget

Gas Budget 是你愿意为这笔交易支付的最大 Gas 量。设置过低会导致交易失败，设置过高不会多扣费（只收实际消耗）。

```typescript
const tx = new Transaction();
// 手动设置 Gas Budget（单位：MIST，1 SUI = 10^9 MIST）
tx.setGasBudget(10_000_000); // 0.01 SUI

// 通常不需要手动设置——SDK 会自动估算
```

### Gas Price

Gas Price 由网络的参考 Gas Price 决定。你可以查询当前参考价格：

```typescript
// v2：参考 Gas 价格可通过 getReferenceGasPrice 或链上查询获取，具体以 SDK 文档为准
const gasPrice = await client.getReferenceGasPrice?.();
console.log(`Reference Gas Price: ${gasPrice ?? "N/A"}`);
```

### Gas Coin

默认使用发送者的 SUI 代币作为 Gas Coin。你也可以指定特定的代币对象：

```typescript
const tx = new Transaction();
tx.setGasPayment([
  { objectId: "0xCOIN_ID", version: "123", digest: "..." },
]);
```

### 赞助交易（Sponsored Transactions）

让第三方为交易支付 Gas：

```typescript
// 赞助者构建和签名 Gas 部分
const tx = new Transaction();
tx.setSender(userAddress);
tx.setGasOwner(sponsorAddress);

// 用户签名交易内容
const userSignature = await userKeypair.signTransaction(
  await tx.build({ client })
);

// 赞助者签名 Gas 部分
const sponsorSignature = await sponsorKeypair.signTransaction(
  await tx.build({ client })
);

// 提交（包含两个签名）
await client.core.executeTransaction({
  transaction: await tx.build({ client }),
  signatures: [userSignature.signature, sponsorSignature.signature],
});
```

## 处理交易结果

### 检查执行状态

执行后根据 `result.$kind` 判断成功（`Transaction`）或失败（`FailedTransaction`）：

```typescript
const result = await client.signAndExecuteTransaction({
  transaction: tx,
  signer: keypair,
});

if (result.$kind === "FailedTransaction") {
  console.error("Transaction failed:", result.FailedTransaction.status.error?.message);
  throw new Error(result.FailedTransaction.status.error?.message ?? "Transaction failed");
}

console.log("Transaction succeeded!", result.Transaction.digest);
await client.waitForTransaction({ digest: result.Transaction.digest });
```

### Balance Changes

成功后可从 `waitForTransaction` 返回或单独查询交易效果获取 balance changes；如需在内存中直接使用，可解析返回的 effects。

### 解析余额变化

```typescript
import { SUI_TYPE_ARG } from "@mysten/sui/utils";

function parseBalanceChanges(
  balanceChanges: any[],
  address: string,
  coinType: string = SUI_TYPE_ARG,
) {
  return balanceChanges
    .filter(
      (change) =>
        (change.owner as any)?.AddressOwner === address &&
        change.coinType === coinType
    )
    .map((change) => ({
      amount: BigInt(change.amount),
      coinType: change.coinType,
    }));
}
```

### Object Changes

交易成功后，可调用 `client.core.getTransaction({ digest, include: { balanceChanges: true, objectTypes: true } })` 获取 object changes；或在应用层根据事件/返回结果推断新创建的对象。

## 等待交易确认

```typescript
const result = await client.signAndExecuteTransaction({
  transaction: tx,
  signer: keypair,
});

if (result.$kind === "FailedTransaction") {
  throw new Error(result.FailedTransaction.status.error?.message ?? "Transaction failed");
}

await client.waitForTransaction({ digest: result.Transaction.digest });
```

## Dry Run（模拟执行）

在提交前模拟执行交易，预览结果和 Gas 消耗：

```typescript
const tx = new Transaction();
// ... 构建交易

tx.setSender(keypair.toSuiAddress());
const dryRunResult = await client.core.simulateTransaction({
  transaction: await tx.build({ client }),
});

console.log("Dry run status:", dryRunResult.effects?.status);
console.log("Gas used:", dryRunResult.effects?.gasUsed);
console.log("Balance changes:", dryRunResult.balanceChanges);
```

## 完整示例：转账 SUI

```typescript
import { Transaction } from "@mysten/sui/transactions";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";

async function transferSUI(
  client: SuiGrpcClient,
  signer: Ed25519Keypair,
  recipient: string,
  amountInSUI: number,
) {
  const amountInMIST = BigInt(amountInSUI * 1_000_000_000);

  const tx = new Transaction();
  const [coin] = tx.splitCoins(tx.gas, [amountInMIST]);
  tx.transferObjects([coin], recipient);

  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
  });

  if (result.$kind === "FailedTransaction") {
    throw new Error(result.FailedTransaction.status.error?.message ?? "Transfer failed");
  }

  await client.waitForTransaction({ digest: result.Transaction.digest });

  return {
    digest: result.Transaction.digest,
    amount: amountInMIST,
  };
}
```

## 小结

- 交易流程：构建 → 签名 → 提交 → 等待确认 → 处理结果
- Gas Budget 是最大花费限制，SDK 通常可自动估算
- `include` 参数控制返回哪些信息（effects、balanceChanges、objectTypes、events）
- Dry Run 可在提交前模拟执行，预览结果和 Gas 消耗
- 赞助交易允许第三方支付 Gas，改善用户体验
- 始终根据 `result.$kind` 判断成功/失败，成功后调用 `waitForTransaction` 再处理业务


---


<!-- source: 13_client/wallet-integration.md -->
## 15.7 钱包集成

# 钱包集成

将 dApp 与 Sui 钱包集成是构建用户友好的去中心化应用的关键步骤。Sui 采用 Wallet Standard 规范，确保不同钱包之间的互操作性。dApp Kit 提供了开箱即用的 React 组件和 Hooks，大大简化了钱包集成的工作。

## Wallet Standard

Sui 钱包遵循 Wallet Standard 规范，定义了钱包应实现的标准接口：

- **连接/断开**：用户授权 dApp 访问钱包
- **获取账户**：读取用户地址和公钥
- **签名交易**：请求用户签名交易
- **签名消息**：请求用户签名任意消息

所有兼容的钱包（Sui Wallet、Suiet、Martian 等）都实现了这些接口。

## 使用 dApp Kit 集成钱包

### 项目设置

```bash
npm install @mysten/dapp-kit-react @mysten/sui
```

### 配置 dApp Kit

```tsx
// src/dapp-kit.ts
import { createDAppKit } from "@mysten/dapp-kit-react";
import { SuiGrpcClient } from "@mysten/sui/grpc";

export const dAppKit = createDAppKit({
  networks: ["devnet", "testnet", "mainnet"],
  defaultNetwork: "testnet",
  createClient(network) {
    return new SuiGrpcClient({ network });
  },
});
```

TypeScript 模块增强（使 Hooks 返回正确类型）：

```typescript
declare module "@mysten/dapp-kit-react" {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
```

### 设置 Provider

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { DAppKitProvider } from "@mysten/dapp-kit-react";
import { dAppKit } from "./dapp-kit";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <DAppKitProvider dAppKit={dAppKit}>
    <App />
  </DAppKitProvider>
);
```

## 连接钱包

### ConnectButton

最简单的方式——使用内置的连接按钮：

```tsx
import { ConnectButton } from "@mysten/dapp-kit-react";

function Header() {
  return (
    <nav>
      <h1>My dApp</h1>
      <ConnectButton />
    </nav>
  );
}
```

`ConnectButton` 自动处理：

- 发现可用钱包
- 显示钱包选择列表
- 连接和断开操作
- 显示已连接地址

### 获取当前账户

```tsx
import { useCurrentAccount } from "@mysten/dapp-kit-react";

function WalletStatus() {
  const account = useCurrentAccount();

  if (!account) {
    return <p>Please connect your wallet</p>;
  }

  return (
    <div>
      <p>Connected: {account.address}</p>
      <p>
        Short: {account.address.slice(0, 6)}...{account.address.slice(-4)}
      </p>
    </div>
  );
}
```

## 签名与发送交易

### 使用 useDAppKit

```tsx
import { Transaction } from "@mysten/sui/transactions";
import {
  useCurrentAccount,
  useCurrentClient,
  useDAppKit,
} from "@mysten/dapp-kit-react";
import { useState } from "react";

function MintNFTForm({ onMinted }: { onMinted: () => void }) {
  const account = useCurrentAccount();
  const client = useCurrentClient();
  const dAppKit = useDAppKit();
  const [isLoading, setIsLoading] = useState(false);

  const handleMint = async () => {
    if (!account) return;

    setIsLoading(true);
    try {
      const tx = new Transaction();

      const hero = tx.moveCall({
        target: `${PACKAGE_ID}::hero::mint_hero`,
        arguments: [],
      });
      tx.transferObjects([hero], account.address);

      const result = await dAppKit.signAndExecuteTransaction({
        transaction: tx,
      });

      if (result.$kind === 'FailedTransaction') {
        throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction failed');
      }
      await client.waitForTransaction({ digest: result.Transaction.digest });

      // 通知父组件刷新
      onMinted();
    } catch (error) {
      console.error("Mint failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) return null;

  return (
    <button onClick={handleMint} disabled={isLoading}>
      {isLoading ? "Minting..." : "Mint Hero"}
    </button>
  );
}
```

### 签名消息

```tsx
function SignMessageButton() {
  const dAppKit = useDAppKit();
  const account = useCurrentAccount();

  const handleSign = async () => {
    if (!account) return;

    const message = new TextEncoder().encode("Hello, Sui!");
    const result = await dAppKit.signPersonalMessage({
      message,
    });

    console.log("Signature:", result.signature);
  };

  return <button onClick={handleSign}>Sign Message</button>;
}
```

## 显示用户资产

### 获取拥有的对象

```tsx
import {
  useCurrentAccount,
  useCurrentClient,
} from "@mysten/dapp-kit-react";
import { useState, useEffect, useCallback } from "react";

function OwnedHeroes({ refreshKey }: { refreshKey: number }) {
  const client = useCurrentClient();
  const account = useCurrentAccount();
  const [heroes, setHeroes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHeroes = useCallback(async () => {
    if (!account) return;
    setLoading(true);
    try {
      const { data } = await client.core.listOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${PACKAGE_ID}::hero::Hero`,
        },
        include: { content: true, display: true },
      });
      setHeroes(data);
    } catch (e) {
      console.error("Failed to fetch heroes:", e);
    } finally {
      setLoading(false);
    }
  }, [client, account]);

  useEffect(() => {
    fetchHeroes();
  }, [account?.address, refreshKey, fetchHeroes]);

  if (loading) return <p>Loading...</p>;
  if (heroes.length === 0) return <p>No heroes found</p>;

  return (
    <ul>
      {heroes.map((hero) => (
        <li key={hero.data?.objectId}>
          {hero.data?.display?.data?.name || hero.data?.objectId}
        </li>
      ))}
    </ul>
  );
}
```

## 完整 App 组装

```tsx
import { useState } from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit-react";

function App() {
  const account = useCurrentAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <header>
        <h1>Hero Game</h1>
        <ConnectButton />
      </header>

      {account && (
        <main>
          <WalletStatus />
          <MintNFTForm onMinted={() => setRefreshKey((k) => k + 1)} />
          <OwnedHeroes refreshKey={refreshKey} />
        </main>
      )}
    </div>
  );
}
```

### 自动刷新流程

```
用户点击 Mint → signAndExecuteTransaction → waitForTransaction → onMinted()
                                                                       │
                                                               setRefreshKey(k+1)
                                                                       │
                                                               useEffect 触发
                                                                       │
                                                               fetchHeroes() 重新查询
```

## 网络切换

dApp Kit 支持在不同网络间切换：

```tsx
import { useCurrentNetwork, useSwitchNetwork } from "@mysten/dapp-kit-react";

function NetworkSelector() {
  const currentNetwork = useCurrentNetwork();
  const switchNetwork = useSwitchNetwork();

  return (
    <select
      value={currentNetwork}
      onChange={(e) => switchNetwork(e.target.value)}
    >
      <option value="devnet">Devnet</option>
      <option value="testnet">Testnet</option>
      <option value="mainnet">Mainnet</option>
    </select>
  );
}
```

## 小结

- Sui 采用 Wallet Standard 规范，确保不同钱包间的互操作性
- dApp Kit 提供 `ConnectButton`、`useCurrentAccount`、`useDAppKit` 等开箱即用工具
- `DAppKitProvider` 包裹应用根组件，提供钱包连接和客户端能力
- 使用 `dAppKit.signAndExecuteTransaction` 请求用户签名并执行交易
- `waitForTransaction` 确保交易被索引后再刷新 UI
- 通过 `refreshKey` 模式实现交易后的自动数据刷新


---


<!-- source: 14_fullstack_dapp/index.md -->
## 第十六章 · 全栈 DApp 实战

# 第十六章 · 全栈 DApp 实战

本章通过一个完整的项目案例，串联前面所学的所有知识，从需求到上线完成一个全栈去中心化应用。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 14.1 | 项目规划与架构设计 | 需求分析、技术选型、目录结构 |
| 14.2 | Move 合约开发 | 模型设计、核心逻辑、合约测试 |
| 14.3 | TypeScript SDK 集成 | 客户端初始化、交易构造 |
| 14.4 | dApp Kit 前端开发 | React 组件、钱包连接、合约调用 |
| 14.5 | 部署、测试与上线 | testnet 部署、主网上线检查清单 |

## 学习目标

读完本章后，你将能够：

- 独立规划和开发一个完整的 Sui DApp
- 将 Move 合约与 TypeScript 前端无缝集成
- 完成从 testnet 到 mainnet 的上线流程


---


<!-- source: 14_fullstack_dapp/project-planning.md -->
## 16.1 项目规划与架构设计

# 项目规划与架构设计

本节介绍如何从零开始规划一个基于 Sui 的全栈去中心化应用（dApp）。我们将从需求分析出发，完成技术选型、目录结构设计和开发流程规划，为后续的 Move 合约开发与前端集成打下基础。

## 需求分析

在开始编码之前，明确项目需求是最重要的一步。以 Hero NFT 游戏为例：

### 用户故事

- 作为用户，我可以连接钱包到应用
- 作为用户，我可以创建一个英雄（Hero）并装备武器（Weapon）
- 作为用户，我可以查看自己拥有的英雄列表
- 作为用户，我可以查看最近被铸造的所有英雄

### 功能拆解

| 功能模块 | 链上（Move） | 链下（前端/SDK） |
|---------|------------|--------------|
| 英雄铸造 | `new_hero` 函数 | 交易构造 + 签名 |
| 武器铸造 | `new_weapon` 函数 | 交易构造 + 签名 |
| 装备管理 | `equip_weapon` / `unequip_weapon` | UI 交互 + PTB 调用 |
| 英雄列表 | `HeroRegistry` 共享对象 | RPC 查询 + 渲染 |
| 我的英雄 | — | `getOwnedObjects` 过滤 |

## 技术选型

### 技术栈概览

```
┌──────────────────────────────────────────────────┐
│                  全栈 DApp 架构                     │
├──────────────────────────────────────────────────┤
│                                                    │
│  智能合约层    Sui Move                             │
│  集成测试层    TypeScript + @mysten/sui SDK         │
│  前端 UI 层   React + @mysten/dapp-kit             │
│  钱包连接层    Slush Wallet / Suiet / Sui Wallet   │
│                                                    │
└──────────────────────────────────────────────────┘
```

### 核心依赖

| 层 | 技术 | 用途 |
|---|------|-----|
| 合约 | Sui Move | 链上逻辑、对象模型 |
| SDK | `@mysten/sui` | 交易构造、RPC 调用、BCS 编码 |
| 前端框架 | React + Vite | UI 渲染、路由管理 |
| dApp 工具包 | `@mysten/dapp-kit` | 钱包连接、hooks、查询 |
| 脚手架 | `@mysten/create-dapp` | 快速初始化项目 |

### 为什么选择 Sui？

- **对象所有权模型**：NFT 天然适合 Sui 的所有权语义
- **并行执行**：独立的 owned object 交易可并行处理
- **PTB（可编程交易块）**：一笔交易内完成铸造+装备的原子操作
- **Move 类型安全**：编译期保证资源安全

## 目录结构设计

```
my-dapp/
├── move/                          # Move 合约
│   └── hero/
│       ├── Move.toml              # 包配置
│       ├── sources/
│       │   └── hero.move          # 核心合约
│       └── tests/
│           └── hero_tests.move    # 单元测试
├── typescript/                    # TypeScript 集成
│   ├── src/
│   │   ├── helpers/               # 交易构造辅助函数
│   │   │   ├── mintHero.ts
│   │   │   └── mintWeapon.ts
│   │   └── tests/
│   │       └── e2e.test.ts        # 端到端测试
│   ├── package.json
│   └── tsconfig.json
├── app/                           # React 前端
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeroesList.tsx     # 英雄列表组件
│   │   │   ├── HeroCard.tsx       # 英雄卡片组件
│   │   │   ├── CreateHeroForm.tsx # 创建英雄表单
│   │   │   └── OwnedObjects.tsx   # 我的英雄
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## 开发流程

### 推荐的开发顺序

```
1. 设计数据模型（Move 结构体）
      │
      ▼
2. 实现核心合约逻辑
      │
      ▼
3. 编写 Move 单元测试
      │
      ▼
4. 发布到 localnet/testnet
      │
      ▼
5. 编写 TypeScript 集成辅助函数
      │
      ▼
6. 编写端到端测试
      │
      ▼
7. 搭建 React 前端
      │
      ▼
8. 集成钱包 + 调用合约
      │
      ▼
9. 测试 + 部署
```

### Move.toml 配置示例

```toml
[package]
name = "hero"
edition = "2024"

[addresses]
hero = "0x0"
```

### 初始化前端项目

```bash
cd app
npm create @mysten/dapp
# 选择模板，填写项目名称
cd <app-name>
pnpm install
pnpm run dev
```

## 数据模型设计原则

设计 Move 结构体时需要考虑的关键问题：

### 1. Owned vs Shared

| 类型 | 适用场景 | 示例 |
|------|---------|-----|
| Owned Object | 单一用户拥有，不需要并发访问 | Hero、Weapon |
| Shared Object | 全局状态，需要多方读写 | HeroRegistry |

### 2. 能力（Abilities）选择

```move
// key + store：可转让的 NFT
public struct Hero has key, store {
    id: UID,
    name: String,
    stamina: u64,
    weapon: Option<Weapon>,
}

// key + store：能力凭证（Cap 后缀）
public struct AdminCap has key, store {
    id: UID,
}

// copy + drop：事件
public struct HeroCreated has copy, drop {
    hero_id: ID,
    creator: address,
}
```

### 3. 注册表模式

使用共享对象追踪全局状态：

```move
public struct HeroRegistry has key {
    id: UID,
    ids: vector<ID>,
    counter: u64,
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(HeroRegistry {
        id: object::new(ctx),
        ids: vector[],
        counter: 0,
    });
}
```

## 小结

项目规划是全栈 dApp 开发的第一步。关键要点：

- 从用户故事出发，明确链上/链下的职责划分
- 采用 Move 合约 → TypeScript SDK → React 前端的三层架构
- 合理组织目录结构，保持模块清晰
- 先设计数据模型，再实现逻辑——Move 的类型系统会帮你在编译期发现问题
- 遵循 "合约优先" 的开发顺序，确保链上逻辑正确后再构建前端


---


<!-- source: 14_fullstack_dapp/move-contract.md -->
## 16.2 Move 合约开发

# Move 合约开发

本节详细讲解如何设计和实现 DApp 的 Move 智能合约。我们以 Hero NFT 游戏为实战案例，涵盖数据模型设计、核心逻辑实现、错误处理和单元测试。

## 数据模型设计

### 核心结构体

一个 Hero NFT 游戏需要三个核心类型：

```move
module hero::hero;

use std::string::String;

const EAlreadyEquipedWeapon: u64 = 1;
const ENotEquipedWeapon: u64 = 2;

/// 英雄 NFT：拥有名字、耐力值和可选武器
public struct Hero has key, store {
    id: UID,
    name: String,
    stamina: u64,
    weapon: Option<Weapon>,
}

/// 武器 NFT：拥有名字和攻击力
public struct Weapon has key, store {
    id: UID,
    name: String,
    attack: u64,
}

/// 共享注册表：追踪所有已铸造英雄的 ID 和总数
public struct HeroRegistry has key {
    id: UID,
    ids: vector<ID>,
    counter: u64,
}
```

### 设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| Hero 的 abilities | `key, store` | 允许自由转让和存储 |
| Weapon 作为 Option | `Option<Weapon>` | 英雄可以没有武器 |
| Registry 作为共享对象 | `share_object` | 所有用户都能读取英雄列表 |

## 初始化函数

```move
/// init 在包发布时自动调用一次
fun init(ctx: &mut TxContext) {
    transfer::share_object(HeroRegistry {
        id: object::new(ctx),
        ids: vector[],
        counter: 0,
    });
}
```

`init` 函数的特点：
- 只在包首次发布时执行一次
- 升级时不会重新执行
- 通常用于创建全局共享对象和分发管理员权限

## 核心逻辑实现

### 铸造英雄

```move
/// 创建英雄并注册到全局注册表
public fun new_hero(
    name: String,
    stamina: u64,
    registry: &mut HeroRegistry,
    ctx: &mut TxContext,
) {
    let hero = Hero {
        id: object::new(ctx),
        name,
        stamina,
        weapon: option::none(),
    };
    // 注册英雄 ID
    registry.ids.push_back(object::id(&hero));
    registry.counter = registry.counter + 1;
    // 转让给调用者
    transfer::transfer(hero, ctx.sender());
}
```

### 铸造武器

```move
/// 创建武器并转让给调用者
public fun new_weapon(name: String, attack: u64, ctx: &mut TxContext) {
    let weapon = Weapon {
        id: object::new(ctx),
        name,
        attack,
    };
    transfer::transfer(weapon, ctx.sender());
}
```

### 装备与卸下武器

```move
/// 为英雄装备武器。如果已有武器则中止
public fun equip_weapon(hero: &mut Hero, weapon: Weapon) {
    assert!(hero.weapon.is_none(), EAlreadyEquipedWeapon);
    hero.weapon.fill(weapon);
}

/// 卸下英雄的武器。如果没有武器则中止
public fun unequip_weapon(hero: &mut Hero): Weapon {
    assert!(hero.weapon.is_some(), ENotEquipedWeapon);
    hero.weapon.extract()
}
```

### 访问器函数

为前端查询提供只读访问（getter 以字段命名，无 `get_` 前缀）：

```move
public fun name(hero: &Hero): String { hero.name }
public fun stamina(hero: &Hero): u64 { hero.stamina }
public fun weapon(hero: &Hero): &Option<Weapon> { &hero.weapon }
public fun name(weapon: &Weapon): String { weapon.name }
public fun attack(weapon: &Weapon): u64 { weapon.attack }
public fun counter(registry: &HeroRegistry): u64 { registry.counter }
public fun ids(registry: &HeroRegistry): vector<ID> { registry.ids }
```

## PTB 友好的设计

为了支持可编程交易块（PTB），函数设计应遵循可组合原则：

```move
// 好的设计：返回对象，让调用者决定如何处理
public fun mint(ctx: &mut TxContext): Hero { /* ... */ }

// 不推荐：在函数内部 transfer，不够灵活
public fun mint_and_transfer(ctx: &mut TxContext) {
    transfer::transfer(mint(ctx), ctx.sender());
}
```

PTB 中的组合调用示例——在一笔交易中完成铸造英雄、铸造武器、装备武器：

```typescript
const tx = new Transaction();

// 铸造英雄
tx.moveCall({
  target: `${packageId}::hero::new_hero`,
  arguments: [
    tx.pure.string("Warrior"),
    tx.pure.u64(100),
    tx.object(registryId),
  ],
});

// 铸造武器
tx.moveCall({
  target: `${packageId}::hero::new_weapon`,
  arguments: [
    tx.pure.string("Excalibur"),
    tx.pure.u64(50),
  ],
});

// 装备武器（需要从前面的 moveCall 获取结果）
tx.moveCall({
  target: `${packageId}::hero::equip_weapon`,
  arguments: [tx.object(heroId), tx.object(weaponId)],
});
```

## 单元测试

### 测试框架

```move
#[test_only]
public(package) fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}

#[test]
fun new_hero() {
    use std::unit_test::assert_eq;
    use sui::test_utils::destroy;

    let mut ctx = tx_context::dummy();
    let mut registry = HeroRegistry {
        id: object::new(&mut ctx),
        ids: vector[],
        counter: 0,
    };

    new_hero(b"Test Hero".to_string(), 100, &mut registry, &mut ctx);
    assert_eq!(registry.counter(), 1);
    assert_eq!(registry.ids().length(), 1);

    destroy(registry);
}

#[test]
fun equip_unequip_weapon() {
    use std::unit_test::assert_eq;
    use sui::test_utils::destroy;

    let mut ctx = tx_context::dummy();
    let mut hero = Hero {
        id: object::new(&mut ctx),
        name: b"Warrior".to_string(),
        stamina: 100,
        weapon: option::none(),
    };
    let weapon = Weapon {
        id: object::new(&mut ctx),
        name: b"Sword".to_string(),
        attack: 50,
    };

    equip_weapon(&mut hero, weapon);
    assert!(hero.weapon().is_some());

    let weapon = unequip_weapon(&mut hero);
    assert!(hero.weapon().is_none());

    destroy(hero);
    destroy(weapon);
}

#[test, expected_failure(abort_code = EAlreadyEquipedWeapon)]
fun double_equip_fails() {
    let mut ctx = tx_context::dummy();
    let mut hero = Hero {
        id: object::new(&mut ctx),
        name: b"Warrior".to_string(),
        stamina: 100,
        weapon: option::none(),
    };
    let w1 = Weapon { id: object::new(&mut ctx), name: b"S1".to_string(), attack: 10 };
    let w2 = Weapon { id: object::new(&mut ctx), name: b"S2".to_string(), attack: 20 };

    equip_weapon(&mut hero, w1);
    equip_weapon(&mut hero, w2); // 应当中止
}
```

### 运行测试

```bash
cd move/hero
sui move test
```

测试输出示例：

```
Running Move unit tests
[ PASS    ] hero::hero::new_hero
[ PASS    ] hero::hero::equip_unequip_weapon
[ PASS    ] hero::hero::double_equip_fails
Test result: OK. Total tests: 3; passed: 3; failed: 0
```

## 发布合约

```bash
# 发布到 testnet
sui client publish

# 从输出中记录：
# - Package ID
# - HeroRegistry 对象 ID
```

## 小结

Move 合约开发的核心要点：

- 使用 `key + store` abilities 创建可转让的 NFT
- 利用共享对象（如 HeroRegistry）管理全局状态
- 通过 `Option` 类型实现可选字段
- 设计可组合的公共函数以支持 PTB
- 用 `assert!` + 错误常量进行输入验证
- 编写充分的单元测试，包括正常路径和失败路径


---


<!-- source: 14_fullstack_dapp/ts-sdk-integration.md -->
## 16.3 TypeScript SDK 集成

# TypeScript SDK 集成

本节讲解如何使用 `@mysten/sui` TypeScript SDK 与链上 Move 合约交互。我们将覆盖 SDK 安装配置、客户端初始化、交易构造、签名执行和结果解析的完整流程。

## 安装与配置

### 安装依赖

```bash
npm install @mysten/sui
# 或
pnpm add @mysten/sui
```

### 客户端初始化

推荐使用 gRPC 客户端（`SuiGrpcClient`）；可选 JSON-RPC（`SuiJsonRpcClient`）。

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';

const devnetClient = new SuiGrpcClient({
  network: 'devnet',
  baseUrl: 'https://fullnode.devnet.sui.io:443',
});
const testnetClient = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});
const mainnetClient = new SuiGrpcClient({
  network: 'mainnet',
  baseUrl: 'https://fullnode.mainnet.sui.io:443',
});
const localClient = new SuiGrpcClient({
  network: 'local',
  baseUrl: 'http://127.0.0.1:9000',
});
```

### 密钥管理

```typescript
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromBase64 } from '@mysten/bcs';

// 从私钥创建
const keypair = Ed25519Keypair.fromSecretKey(
  fromBase64(process.env.PRIVATE_KEY!)
);

// 获取地址
const address = keypair.toSuiAddress();
console.log('Address:', address);
```

## 交易构造

### Transaction 基础

```typescript
import { Transaction } from '@mysten/sui/transactions';

const tx = new Transaction();

// 设置 gas 预算
tx.setGasBudget(10_000_000);
```

### 调用 Move 函数

```typescript
const PACKAGE_ID = '0x...';
const REGISTRY_ID = '0x...';

function mintHero(tx: Transaction, name: string, stamina: number) {
  tx.moveCall({
    target: `${PACKAGE_ID}::hero::new_hero`,
    arguments: [
      tx.pure.string(name),
      tx.pure.u64(stamina),
      tx.object(REGISTRY_ID),
    ],
  });
}

function mintWeapon(tx: Transaction, name: string, attack: number) {
  tx.moveCall({
    target: `${PACKAGE_ID}::hero::new_weapon`,
    arguments: [
      tx.pure.string(name),
      tx.pure.u64(attack),
    ],
  });
}
```

### 组合 PTB：一笔交易完成多个操作

```typescript
function mintHeroWithWeapon(
  tx: Transaction,
  heroName: string,
  stamina: number,
  weaponName: string,
  attack: number,
) {
  // 铸造英雄（返回 Hero 对象）
  const [hero] = tx.moveCall({
    target: `${PACKAGE_ID}::hero::new_hero`,
    arguments: [
      tx.pure.string(heroName),
      tx.pure.u64(stamina),
      tx.object(REGISTRY_ID),
    ],
  });

  // 铸造武器（返回 Weapon 对象）
  const [weapon] = tx.moveCall({
    target: `${PACKAGE_ID}::hero::new_weapon`,
    arguments: [
      tx.pure.string(weaponName),
      tx.pure.u64(attack),
    ],
  });

  // 装备武器
  tx.moveCall({
    target: `${PACKAGE_ID}::hero::equip_weapon`,
    arguments: [hero, weapon],
  });
}
```

## 签名与执行

### 签名并执行交易

执行后根据 `result.$kind` 判断成功（`Transaction`）或失败（`FailedTransaction`），失败时抛出错误；成功后建议再调用 `waitForTransaction` 等待确认。

```typescript
async function executeTransaction(tx: Transaction) {
  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  if (result.$kind === 'FailedTransaction') {
    throw new Error(
      result.FailedTransaction.status.error?.message ?? 'Transaction failed'
    );
  }

  console.log('Digest:', result.Transaction.digest);
  await client.waitForTransaction({ digest: result.Transaction.digest });
  return result;
}
```

## 数据查询

### 查询对象

```typescript
// 查询单个对象
async function getHeroRegistry() {
  const obj = await client.core.getObject({
    objectId: REGISTRY_ID,
    include: { content: true },
  });

  if (obj.data?.content?.dataType === 'moveObject') {
    const fields = obj.data.content.fields as any;
    console.log('Counter:', fields.counter);
    console.log('Hero IDs:', fields.ids);
  }
}

// 批量查询对象
async function getHeroes(heroIds: string[]) {
  const objects = await client.core.getObjects({
    objectIds: heroIds,
    include: { content: true },
  });

  return objects.map(obj => {
    if (obj.data?.content?.dataType === 'moveObject') {
      return obj.data.content.fields;
    }
    return null;
  });
}
```

### 查询用户拥有的对象

```typescript
async function getOwnedHeroes(owner: string) {
  const objects = await client.core.listOwnedObjects({
    owner,
    filter: {
      StructType: `${PACKAGE_ID}::hero::Hero`,
    },
    include: { content: true },
  });

  return objects.data;
}
```

### 查询事件

```typescript
async function getHeroEvents() {
  const events = await client.queryEvents({
    query: {
      MoveEventModule: {
        module: 'hero',
        package: PACKAGE_ID,
      },
    },
    order: 'descending',
    limit: 50,
  });

  return events.data;
}
```

## 端到端测试

### 测试框架配置

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000,
};
```

### 编写 E2E 测试

```typescript
import { describe, it, expect, beforeAll } from '@jest/globals';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

describe('Hero E2E Tests', () => {
  let client: SuiGrpcClient;
  let keypair: Ed25519Keypair;

  beforeAll(() => {
    client = new SuiGrpcClient({
      network: 'testnet',
      baseUrl: 'https://fullnode.testnet.sui.io:443',
    });
    keypair = Ed25519Keypair.fromSecretKey(/* ... */);
  });

  it('should mint a hero successfully', async () => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::hero::new_hero`,
      arguments: [
        tx.pure.string('Test Hero'),
        tx.pure.u64(100),
        tx.object(REGISTRY_ID),
      ],
    });

    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    });

    if (result.$kind === 'FailedTransaction') {
      throw new Error(result.FailedTransaction.status.error?.message);
    }
    await client.waitForTransaction({ digest: result.Transaction.digest });
  });

  it('should mint hero with weapon in single PTB', async () => {
    const tx = new Transaction();
    mintHeroWithWeapon(tx, 'Warrior', 100, 'Excalibur', 50);

    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    });

    if (result.$kind === 'FailedTransaction') {
      throw new Error(result.FailedTransaction.status.error?.message);
    }
    await client.waitForTransaction({ digest: result.Transaction.digest });
  });
});
```

### 运行测试

```bash
npm test
# 或
npx jest --verbose
```

## BCS 编码

与合约的高级交互可能需要 BCS 编码：

```typescript
import { bcs } from '@mysten/bcs';

// 定义事件结构对应 Move struct
const HeroCreatedEvent = bcs.struct('HeroCreated', {
  hero_id: bcs.Address,
  name: bcs.string(),
  stamina: bcs.u64(),
});

// 解码事件数据
function decodeHeroEvent(eventBcsData: Uint8Array) {
  return HeroCreatedEvent.parse(eventBcsData);
}
```

## 小结

TypeScript SDK 集成的核心要点：

- 推荐使用 `SuiGrpcClient`（`@mysten/sui/grpc`）连接 Sui 网络
- 通过 `Transaction` 类构造可编程交易块（PTB）
- `moveCall` 调用 Move 函数，参数通过 `tx.pure.*` 和 `tx.object()` 传递
- 执行后根据 `result.$kind` 判断成功/失败，成功后调用 `waitForTransaction` 等待确认
- 使用 `client.core.getObject`、`client.core.listOwnedObjects`、`client.core.getObjects` 等方法查询链上状态（v2 Core API，`include` 替代 `options`）
- BCS 编码/解码用于处理事件数据和复杂参数


---


<!-- source: 14_fullstack_dapp/dapp-kit-frontend.md -->
## 16.4 dApp Kit 前端开发

# dApp Kit 前端开发

本节讲解如何使用 `@mysten/dapp-kit-react` 构建 React 前端应用，包括连接钱包、查询链上数据、构造和签名交易。dApp Kit 提供 `createDAppKit` + `DAppKitProvider` 以及一套 React hooks，大幅简化 Sui dApp 前端的开发。（旧版 `@mysten/dapp-kit` 已废弃，新项目请使用 `@mysten/dapp-kit-react`。）

## 项目初始化

### 使用脚手架创建项目

```bash
npm create @mysten/dapp
# 按提示操作：
# - 选择 "React app with dApp Kit"
# - 输入项目名称
# - 选择包管理器

cd my-dapp
pnpm install
pnpm run dev
```

### 安装依赖（手动配置）

```bash
pnpm add @mysten/dapp-kit-react @mysten/sui @tanstack/react-query
```

## 应用配置

### Provider 设置

使用 `createDAppKit` 创建实例，并用 `DAppKitProvider` 包裹应用；客户端推荐使用 `SuiGrpcClient`：

```typescript
// src/dapp-kit.ts
import { createDAppKit } from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const GRPC_URLS: Record<string, string> = {
  testnet: 'https://fullnode.testnet.sui.io:443',
  mainnet: 'https://fullnode.mainnet.sui.io:443',
};

export const dAppKit = createDAppKit({
  networks: ['testnet', 'mainnet'],
  defaultNetwork: 'testnet',
  createClient: (network) =>
    new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] }),
  autoConnect: true,
});

declare module '@mysten/dapp-kit-react' {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
```

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { DAppKitProvider, ConnectButton } from '@mysten/dapp-kit-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { dAppKit } from './dapp-kit';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DAppKitProvider dAppKit={dAppKit}>
        <ConnectButton />
        <App />
      </DAppKitProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
```

## 连接钱包

### ConnectButton 组件

```typescript
// src/components/WalletConnect.tsx
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit-react';

export function WalletConnect() {
  const account = useCurrentAccount();

  return (
    <div>
      <ConnectButton />
      {account && (
        <p>已连接: {account.address}</p>
      )}
    </div>
  );
}
```

### 使用钱包 Hooks

```typescript
import { useCurrentAccount, useCurrentWallet, useDAppKit } from '@mysten/dapp-kit-react';

function WalletInfo() {
  const account = useCurrentAccount();
  const wallet = useCurrentWallet();
  const dAppKit = useDAppKit();

  if (!account) return <p>请先连接钱包</p>;

  return (
    <div>
      <p>钱包: {wallet?.name}</p>
      <p>地址: {account.address}</p>
      <button onClick={() => dAppKit.disconnectWallet()}>断开连接</button>
    </div>
  );
}
```

## 查询链上数据

### 查询对象（HeroRegistry）

使用 `useCurrentClient` 获取客户端，配合 `useQuery` 查询；仅在需要时启用（如已选网络）：

```typescript
// src/components/HeroesList.tsx
import { useQuery } from '@tanstack/react-query';
import { useCurrentClient } from '@mysten/dapp-kit-react';

const REGISTRY_ID = '0x...'; // 你的 HeroRegistry 对象 ID

export function HeroesList() {
  const client = useCurrentClient();
  const { data, isPending, error } = useQuery({
    queryKey: ['object', REGISTRY_ID],
    queryFn: () => client!.core.getObject({ objectId: REGISTRY_ID, include: { content: true } }),
    enabled: !!client,
  });

  if (isPending) return <p>加载中...</p>;
  if (error) return <p>错误: {(error as Error).message}</p>;

  const content = data?.data?.content;
  const fields = content?.dataType === 'moveObject' ? (content.fields as any) : null;

  if (!fields) return <p>未找到注册表</p>;

  return (
    <div>
      <h2>所有英雄（共 {fields.counter} 个）</h2>
      <ul>
        {fields.ids.map((id: string) => (
          <li key={id}>
            <a
              href={`https://suiscan.xyz/testnet/object/${id}`}
              target="_blank"
              rel="noreferrer"
            >
              {id}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 批量查询英雄详情

```typescript
import { useQuery } from '@tanstack/react-query';
import { useCurrentClient } from '@mysten/dapp-kit-react';

function HeroDetails({ heroIds }: { heroIds: string[] }) {
  const client = useCurrentClient();
  const { data } = useQuery({
    queryKey: ['getObjects', heroIds],
    queryFn: () => client!.core.getObjects({ objectIds: heroIds, include: { content: true } }),
    enabled: !!client && heroIds.length > 0,
  });

  if (!data) return null;

  return (
    <div className="hero-grid">
      {data.map((obj, i) => {
        const fields = obj.data?.content?.dataType === 'moveObject'
          ? (obj.data.content.fields as any)
          : null;
        if (!fields) return null;
        return <HeroCard key={i} fields={fields} />;
      })}
    </div>
  );
}

function HeroCard({ fields }: { fields: any }) {
  return (
    <div className="hero-card">
      <h3>{fields.name}</h3>
      <p>耐力: {fields.stamina}</p>
      <p>武器: {fields.weapon ? '已装备' : '无'}</p>
    </div>
  );
}
```

### 查询我的英雄

```typescript
// src/components/OwnedHeroes.tsx
import { useQuery } from '@tanstack/react-query';
import { useCurrentAccount, useCurrentClient } from '@mysten/dapp-kit-react';

const PACKAGE_ID = '0x...';

export function OwnedHeroes() {
  const account = useCurrentAccount();
  const client = useCurrentClient();

  const { data, isPending, refetch } = useQuery({
    queryKey: ['ownedObjects', account?.address, PACKAGE_ID],
    queryFn: () =>
      client!.core.listOwnedObjects({
        owner: account!.address,
        filter: { StructType: `${PACKAGE_ID}::hero::Hero` },
        include: { content: true },
      }),
    enabled: !!account?.address && !!client,
  });

  if (!account) return <p>请先连接钱包</p>;
  if (isPending) return <p>加载中...</p>;

  return (
    <div>
      <h2>我的英雄</h2>
      {data?.data?.map((obj) => {
        const fields = obj.data?.content?.dataType === 'moveObject'
          ? (obj.data.content.fields as any)
          : null;
        if (!fields) return null;
        return (
          <div key={obj.data?.objectId}>
            <p>{fields.name} - 耐力: {fields.stamina}</p>
          </div>
        );
      })}
    </div>
  );
}
```

## 签名与执行交易

### 创建英雄表单

```typescript
// src/components/CreateHeroForm.tsx
import { useState } from 'react';
import { useDAppKit, useCurrentClient } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';
import { useQueryClient } from '@tanstack/react-query';

const PACKAGE_ID = '0x...';
const REGISTRY_ID = '0x...';

export function CreateHeroForm() {
  const [heroName, setHeroName] = useState('');
  const [stamina, setStamina] = useState(100);
  const [weaponName, setWeaponName] = useState('');
  const [attack, setAttack] = useState(50);
  const [isPending, setIsPending] = useState(false);

  const client = useCurrentClient();
  const dAppKit = useDAppKit();
  const queryClient = useQueryClient();

  const handleMint = async () => {
    if (!client) return;
    setIsPending(true);
    try {
      const tx = new Transaction();

      const [hero] = tx.moveCall({
        target: `${PACKAGE_ID}::hero::new_hero`,
        arguments: [
          tx.pure.string(heroName || 'Hero'),
          tx.pure.u64(stamina),
          tx.object(REGISTRY_ID),
        ],
      });

      const [weapon] = tx.moveCall({
        target: `${PACKAGE_ID}::hero::new_weapon`,
        arguments: [
          tx.pure.string(weaponName || 'Sword'),
          tx.pure.u64(attack),
        ],
      });

      tx.moveCall({
        target: `${PACKAGE_ID}::hero::equip_weapon`,
        arguments: [hero, weapon],
      });

      const result = await dAppKit.signAndExecuteTransaction({ transaction: tx });
      if (result.$kind === 'FailedTransaction') {
        throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction failed');
      }
      await client.waitForTransaction({ digest: result.Transaction.digest });
      queryClient.invalidateQueries();
    } catch (e) {
      console.error('交易失败:', e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <h2>创建英雄</h2>
      <div>
        <label>英雄名称:</label>
        <input
          value={heroName}
          onChange={(e) => setHeroName(e.target.value)}
          placeholder="输入英雄名称"
        />
      </div>
      <div>
        <label>耐力值:</label>
        <input
          type="number"
          value={stamina}
          onChange={(e) => setStamina(Number(e.target.value))}
        />
      </div>
      <div>
        <label>武器名称:</label>
        <input
          value={weaponName}
          onChange={(e) => setWeaponName(e.target.value)}
          placeholder="输入武器名称"
        />
      </div>
      <div>
        <label>攻击力:</label>
        <input
          type="number"
          value={attack}
          onChange={(e) => setAttack(Number(e.target.value))}
        />
      </div>
      <button onClick={() => handleMint()} disabled={isPending}>
        {isPending ? '铸造中...' : '铸造英雄'}
      </button>
    </div>
  );
}
```

## 完整 App 组装

```typescript
// src/App.tsx
import { ConnectButton } from '@mysten/dapp-kit-react';
import { HeroesList } from './components/HeroesList';
import { OwnedHeroes } from './components/OwnedHeroes';
import { CreateHeroForm } from './components/CreateHeroForm';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Hero NFT DApp</h1>
        <ConnectButton />
      </header>

      <main>
        <section>
          <CreateHeroForm />
        </section>

        <section>
          <OwnedHeroes />
        </section>

        <section>
          <HeroesList />
        </section>
      </main>
    </div>
  );
}

export default App;
```

## 常用 Hooks 速查

| Hook | 用途 |
|------|------|
| `useCurrentAccount` | 获取当前连接的钱包账户 |
| `useCurrentWallet` | 获取当前钱包信息 |
| `useDAppKit` | 获取 dAppKit 实例（含 `signAndExecuteTransaction`、`disconnectWallet` 等） |
| `useCurrentClient` | 获取当前网络的 Sui 客户端（如 `SuiGrpcClient`） |
| `useSignPersonalMessage` | 签名个人消息 |

链上查询使用 `useCurrentClient` + `@tanstack/react-query` 的 `useQuery` / `useInfiniteQuery`，并设置 `enabled: !!account` 等条件。

## 小结

dApp Kit 前端开发的核心要点：

- 使用 `createDAppKit` + `DAppKitProvider` 配置应用，客户端推荐 `SuiGrpcClient`
- `ConnectButton` 提供开箱即用的钱包连接 UI
- 链上数据用 `useCurrentClient` + `useQuery` 查询，并设置 `enabled` 避免未连接时请求
- 交易使用 `dAppKit.signAndExecuteTransaction`，根据 `result.$kind` 判断成功/失败，成功后先 `client.waitForTransaction` 再 `queryClient.invalidateQueries`
- 利用 React Query 的缓存与失效机制减少重复请求


---


<!-- source: 14_fullstack_dapp/deploy-and-launch.md -->
## 16.5 部署、测试与上线

# 部署测试与上线

本节涵盖从本地开发到 testnet 部署、再到主网上线的完整流程。包括环境配置、部署命令、测试验证和生产上线检查清单。

## 本地开发环境

### 启动本地网络

```bash
# 启动 localnet（带水龙头）
RUST_LOG="off,sui_node=info" sui start --with-faucet --force-regenesis

# 新终端中添加 localnet 环境
sui client new-env --alias localnet --rpc http://127.0.0.1:9000

# 切换到 localnet
sui client switch --env localnet

# 获取测试代币
sui client faucet
```

### 本地发布合约

```bash
cd move/hero

# 构建
sui move build

# 测试
sui move test

# 发布（localnet）
sui client publish
```

## Testnet 部署

### 配置 testnet 环境

```bash
# 添加 testnet 环境
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

# 切换到 testnet
sui client switch --env testnet

# 查看当前地址
sui client active-address

# 获取 testnet SUI（水龙头）
sui client faucet
```

### 发布到 testnet

```bash
cd move/hero
sui client publish
```

从发布输出中记录关键信息：

| 信息 | 来源 |
|------|------|
| **Package ID** | `Published Objects` 部分 |
| **HeroRegistry ID** | `Created Objects` 中类型为 `HeroRegistry` 的对象 |
| **UpgradeCap ID** | `Created Objects` 中类型为 `UpgradeCap` 的对象 |

```bash
# 验证发布的对象
sui client objects
```

### 验证合约功能

```bash
# 铸造英雄
sui client call \
  --package <PACKAGE_ID> \
  --module hero \
  --function new_hero \
  --args "Warrior" 100 <REGISTRY_ID>

# 查看创建的对象
sui client object <HERO_ID>
```

## 前端部署

### 更新前端配置

```typescript
// src/config/constants.ts
export const CONFIG = {
  PACKAGE_ID: '0x<your_package_id>',
  REGISTRY_ID: '0x<your_registry_id>',
  NETWORK: 'testnet' as const,
};
```

### 构建前端

```bash
cd app
pnpm run build
```

### 部署选项

| 平台 | 特点 | 命令 |
|------|------|------|
| Vercel | 自动 CI/CD，适合 React 项目 | `vercel --prod` |
| Walrus Sites | 去中心化托管 | `walrus publish` |
| Cloudflare Pages | CDN 全球分发 | `wrangler pages deploy dist` |

### 部署到 Walrus Sites

```bash
# 安装 Walrus CLI
# 参考 https://docs.walrus.site/

# 发布到 Walrus Sites
walrus sites publish ./dist
```

## 主网部署

### 主网前准备检查清单

#### 合约安全

- [ ] 所有 `public` 函数签名已确认不再变动（升级后不能改）
- [ ] `assert!` 覆盖所有输入验证场景
- [ ] 错误码清晰、唯一、有文档
- [ ] 共享对象的并发访问已考虑
- [ ] 无硬编码的测试地址或密钥
- [ ] 已通过所有单元测试和集成测试
- [ ] 考虑了包升级策略（是否保留 UpgradeCap）

#### 权限管理

- [ ] AdminCap / UpgradeCap 已安全存储
- [ ] 考虑使用多签（Multisig）管理关键权限
- [ ] 明确了升级策略：compatible / additive / immutable

#### 前端

- [ ] Package ID 和对象 ID 已更新为主网地址
- [ ] 网络配置切换到 mainnet
- [ ] 错误处理和用户提示完善
- [ ] 钱包连接支持主流钱包

#### 运维

- [ ] 监控告警已配置
- [ ] 索引器/后端服务已部署
- [ ] 日志收集已配置
- [ ] 回滚方案已准备

### 主网发布流程

```bash
# 1. 切换到主网
sui client switch --env mainnet

# 2. 确认有足够 SUI 支付 gas
sui client gas

# 3. 最终构建和测试
sui move build
sui move test

# 4. 发布
sui client publish

# 5. 记录所有创建的对象 ID
sui client objects
```

### 发布后验证

```bash
# 验证包已发布
sui client object <PACKAGE_ID>

# 测试核心功能
sui client call \
  --package <PACKAGE_ID> \
  --module hero \
  --function new_hero \
  --args "Genesis Hero" 100 <REGISTRY_ID>
```

## 升级管理

### 保留 UpgradeCap

UpgradeCap 是升级合约的唯一凭证，务必安全保管：

```bash
# 查看 UpgradeCap
sui client object <UPGRADE_CAP_ID>
```

### 升级策略选择

| 策略 | 适用场景 |
|------|---------|
| `compatible`（默认） | 迭代开发阶段 |
| `additive` | 稳定期，只允许添加新功能 |
| `dep_only` | 只允许更新依赖 |
| `immutable` | 永久冻结，不可升级 |

```bash
# 执行升级
sui client upgrade --upgrade-capability <UPGRADE_CAP_ID>

# 如果决定冻结包（不可逆！）
# sui client call --package 0x2 --module package --function make_immutable \
#   --args <UPGRADE_CAP_ID>
```

## 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| 交易失败 `InsufficientGas` | gas 预算不足 | 可尝试显式增加 `--gas-budget`（多数情况 CLI 自动估算即可） |
| 对象未找到 | ID 错误或网络不匹配 | 确认网络和对象 ID |
| 钱包连接失败 | 网络配置不一致 | 检查前端和钱包的网络设置 |
| RPC 超时 | 全节点压力大 | 使用多个 RPC 端点做负载均衡 |
| 交易签名失败 | 钱包版本不兼容 | 更新钱包和 SDK 版本 |

## 小结

部署和上线的核心要点：

- 先在 localnet 充分测试，再部署到 testnet，最后上主网
- 发布合约后仔细记录所有关键对象 ID
- 主网部署前完成安全检查清单
- 妥善保管 UpgradeCap，选择合适的升级策略
- 部署前端时确保配置文件指向正确的网络和合约地址
- 建立监控和告警机制，及时发现和处理线上问题


---


# ==================== 工程篇 ====================



---


<!-- source: 15_upgrade/index.md -->
## 第十七章 · 包升级

# 第十七章 · 包升级

在 Sui 上，已发布的包是**不可变对象**——字节码一旦上链就永远不会改变。包升级机制通过发布一个**与原始包链接的新版本**来实现迭代：旧包保持不变，新包继承类型系统，共享对象在两个版本之间通过迁移函数无缝过渡。

本章从升级机制、策略选择、版本化模式、数据迁移到完整实战，系统讲解包升级的完整知识体系。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 15.1 | 升级机制与 UpgradeCap | 升级原理、三步流程、兼容性规则、CLI 操作 |
| 15.2 | 升级策略 | 四种内置策略、收紧操作、自定义策略（时间锁/多签） |
| 15.3 | 版本化共享对象 | 包级、对象级、混合三种版本化模式 |
| 15.4 | 数据迁移与向前兼容 | 动态字段扩展、Bag/Anchor 模式、用户对象迁移 |
| 15.5 | 实战：Hero 游戏完整升级 | 从 V1 到 V2 的完整案例与 CLI 验证 |

## 学习目标

读完本章后，你将能够：

- 理解 UpgradeCap 与升级三步流程，掌握兼容性规则
- 根据项目阶段选择合适的升级策略，必要时实现自定义策略
- 设计版本化共享对象，实现发布与激活解耦的迁移窗口
- 使用动态字段实现向前兼容的对象设计
- 独立完成一次从发布、升级到迁移、验证的全流程


---


<!-- source: 15_upgrade/01-mechanism.md -->
## 17.1 升级机制与 UpgradeCap

# 升级机制与 UpgradeCap

在 Sui 上，已发布的包是**不可变对象**——字节码一旦上链就永远不会改变。包升级通过发布一个**与原始包链接的新版本**来实现：旧包保持不变，新包获得新的 Package ID，但继承其类型系统，共享对象通过迁移函数过渡到新版本。

本节讲解升级的唯一凭证 UpgradeCap、三步升级流程、兼容性规则和 CLI 操作。

## UpgradeCap — 升级的唯一凭证

当你发布一个包时，Sui 自动创建一个 `UpgradeCap` 对象并发送给发布者：

```move
// 来自 sui::package 模块
public struct UpgradeCap has key, store {
    id: UID,
    package: ID,       // 原始包的 ID
    version: u64,      // 当前版本号
    policy: u8,        // 升级策略
}
```

**重要特性：**

- 每个包只有一个 `UpgradeCap`——谁持有它，谁就能升级这个包
- `UpgradeCap` 具有 `store` 能力，可以转移给他人、存入多签钱包、或被自定义合约管理
- 如果 `UpgradeCap` 被销毁（`make_immutable()`），包将永远无法升级
- **必须安全保管**——丢失意味着失去升级能力，泄露意味着任何人都能升级

## 升级流程

升级分为三个原子步骤：

```
┌──────────────────────────────────────────────────────────┐
│  步骤 1: 授权（Authorize）                                │
│  出示 UpgradeCap → 获得 UpgradeTicket                    │
│  ┌─────────┐         ┌──────────────┐                    │
│  │UpgradeCap│ ──────→ │UpgradeTicket │                   │
│  └─────────┘         └──────────────┘                    │
├──────────────────────────────────────────────────────────┤
│  步骤 2: 发布（Publish）                                  │
│  提交新字节码 + UpgradeTicket → 链上验证兼容性             │
│  ┌──────────────┐  ┌──────────┐     ┌───────────────┐   │
│  │UpgradeTicket │ +│ 新字节码  │ ──→ │UpgradeReceipt │   │
│  └──────────────┘  └──────────┘     └───────────────┘   │
├──────────────────────────────────────────────────────────┤
│  步骤 3: 提交（Commit）                                   │
│  UpgradeReceipt 确认升级完成，更新 UpgradeCap             │
│  ┌───────────────┐  ┌─────────┐                         │
│  │UpgradeReceipt │→ │UpgradeCap│ version + 1             │
│  └───────────────┘  └─────────┘                         │
└──────────────────────────────────────────────────────────┘
```

在 CLI 中，`sui client upgrade` 命令自动完成以上三步。新版本的包获得自己的地址（新的 Package ID），但与原始包保持链接关系。

## 兼容性规则

升级必须保持**向后兼容**。核心原则：**依赖你的包的代码不应因升级而失效。**

### 什么可以改、什么不能改

| 元素 | 可以删除? | 可以改签名? | 可以改实现? |
|------|:---------:|:-----------:|:-----------:|
| **模块** | ❌ 不可删除 | — | — |
| **`public` 函数** | ❌ 不可删除 | ❌ 不可改 | ✅ 可以改 |
| **`public(package)` 函数** | ✅ 可以删除 | ✅ 可以改 | ✅ 可以改 |
| **`entry` 函数（非 public）** | ✅ 可以删除 | ✅ 可以改 | ✅ 可以改 |
| **`private` 函数** | ✅ 可以删除 | ✅ 可以改 | ✅ 可以改 |
| **`public` 结构体** | ❌ 不可删除 | ❌ 字段不可改 | — |
| **新模块** | ✅ 可添加 | — | — |
| **新函数** | ✅ 可添加 | — | — |
| **新结构体** | ✅ 可添加 | — | — |

用代码说明：

```move
module book::upgradable;

use std::string::String;

// ❌ 这个结构体不能被删除，字段不能被修改
public struct Book has key {
    id: UID,
    title: String,
}

// ❌ 这个函数不能被删除，签名不能改变
// ✅ 但函数体（实现）可以改
public fun create_book(ctx: &mut TxContext): Book {
    create_book_internal(ctx) // 这行代码可以换成别的实现
}

// ✅ 这个函数可以被删除、签名可以改
public(package) fun create_book_package(ctx: &mut TxContext): Book {
    create_book_internal(ctx)
}

// ✅ 这个函数可以被删除（因为不是 public）；entry 不能返回值
entry fun create_book_entry(ctx: &mut TxContext) {
    let book = create_book_internal(ctx);
    transfer::transfer(book, ctx.sender());
}

// ✅ 私有函数完全自由
fun create_book_internal(ctx: &mut TxContext): Book {
    abort 0
}
```

### 关键注意点

1. **`init` 不会在升级时重新运行**。如果新版本需要初始化逻辑，必须通过单独的迁移函数实现
2. **结构体字段不能增减**。如果需要给对象添加新字段，请使用动态字段（见第 15.4 节）
3. **`public` 是永久契约**。一旦声明为 `public`，函数签名就被永久锁定。设计时请慎重考虑哪些函数真正需要 `public`

### 设计建议

```move
// 🔴 不推荐：过早暴露 public 接口
public fun set_price(item: &mut Item, price: u64) { ... }

// 🟢 推荐：用 public(package) 保留灵活性，通过 entry 暴露
public(package) fun set_price_internal(item: &mut Item, price: u64) { ... }

entry fun set_price(item: &mut Item, price: u64) {
    set_price_internal(item, price);
}
```

`entry` 函数对外可调用但不会成为兼容性契约的一部分，升级时可以自由修改。

## CLI 操作

### 发布初始版本

```bash
cd my_package
sui client publish
```

发布成功后，记录输出中的关键信息：

```
╭──────────────────────────────────────────────────────╮
│ Published Objects                                     │
├──────────────────────────────────────────────────────┤
│ PackageID: 0x1a2b3c...   ← 记录这个                  │
╰──────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────╮
│ Created Objects                                       │
├──────────────────────────────────────────────────────┤
│ ObjectID: 0x4d5e6f...                                │
│ ObjectType: 0x2::package::UpgradeCap   ← 记录这个    │
╰──────────────────────────────────────────────────────╯
```

### 执行升级

```bash
# 1. 修改代码
# 2. 构建（检查兼容性错误）
sui move build

# 3. 升级
sui client upgrade --upgrade-capability <UPGRADE_CAP_ID>
```

升级成功后会输出新的 Package ID。

## 小结

- 已发布的 Sui 包是不可变的，升级通过发布链接到原始包的新版本实现
- `UpgradeCap` 是升级的唯一凭证，必须安全保管
- 升级三步：授权 → 发布 → 提交（CLI 的 `sui client upgrade` 自动完成）
- 升级遵循严格的兼容性规则：`public` 函数和结构体是永久契约
- `init` 不会在升级时重新执行，需要单独的迁移函数
- 使用 `public(package)` 和 `entry` 代替 `public` 可以保留更多升级灵活性


---


<!-- source: 15_upgrade/02-policies.md -->
## 17.2 升级策略

# 升级策略

升级策略决定了包被允许进行何种程度的修改。合理选择和管理升级策略是平衡**灵活性**与**安全性**的关键——策略越宽松，开发者越灵活；策略越严格，用户越安心。

## 四种内置策略

Sui 提供四种内置升级策略，由 `UpgradeCap` 的 `policy` 字段控制。按权限从高到低排列：

```
compatible  →  additive  →  dependency-only  →  immutable
 (最灵活)                                        (最安全)
     ←────── 只能往这个方向收紧，不可回退 ──────→
```

### 1. compatible（兼容升级）— 默认策略

发布包时默认使用此策略，提供最大灵活性：

| 允许 | 不允许 |
|------|--------|
| 添加新模块 | 删除已有模块 |
| 添加新函数（包括 `public`） | 删除 `public` 函数 |
| 添加新结构体 | 修改已有结构体字段/abilities |
| 修改任何函数的实现 | 修改 `public` 函数签名 |
| 修改/删除 `private`、`entry`、`public(package)` 函数 | |

```move
// ✅ compatible 策略下允许的修改

// 修改私有函数实现
fun internal_logic(): u64 {
    42 // 可以改为任何值
}

// 修改 public(package) 函数（签名和实现都可以改）
public(package) fun helper(x: u64): u64 {
    x * 2 // 自由修改
}

// 添加新的 public 函数
public fun new_feature(): bool { true }

// 修改 public 函数的实现（但签名不变）
public fun existing_fn(x: u64): u64 {
    x + 1 // 实现可以改
    // 但参数 (x: u64) 和返回类型 u64 不能改
}
```

**适用场景：** 开发和测试阶段、Beta 版本、需要快速迭代的项目

### 2. additive（仅添加升级）

只允许**添加**新内容，不允许修改已有代码（包括私有函数）：

| 允许 | 不允许 |
|------|--------|
| 添加新模块 | 修改已有函数体（即使是 private） |
| 添加新函数 | 删除任何函数 |
| 添加新结构体 | 修改结构体 |

```move
// ✅ additive 策略下允许的修改

// 添加全新的模块
module my_package::analytics;

// 添加新函数
public fun get_statistics(): u64 { 0 }

// ❌ 以下都不允许：
// 修改已有函数体（即使是 private）
// fun existing_helper(): u64 { 100 }  // 原来是 42，不能改
```

**适用场景：** 稳定版本，只需要添加新功能而不修改已有逻辑

### 3. dependency-only（仅依赖升级）

只允许修改 `Move.toml` 中的依赖版本，不允许修改任何 `.move` 文件：

```toml
# ✅ 允许：更新依赖版本
[dependencies]
Sui = { git = "...", rev = "framework/testnet" }  # 可以改 rev

# ❌ 不允许：修改任何 .move 源文件
```

**适用场景：** 框架升级（跟随 Sui Framework 更新），代码已完全冻结

### 4. immutable（不可变）

永久冻结，再也无法进行任何升级。**此操作不可逆！**

```move
// 通过销毁 UpgradeCap 实现
public fun make_immutable(cap: UpgradeCap) {
    // UpgradeCap 被永久销毁
    // 此后任何升级尝试都会失败
}
```

**适用场景：** 成熟协议（如 DEX 核心合约）、需要给用户"永不修改"承诺的场景

## 收紧策略的操作

策略只能**收紧**（向更严格的方向），永远不能放松：

```move
use sui::package;

// 当前是 compatible，收紧为 additive
package::only_additive_upgrades(&mut upgrade_cap);

// 当前是 additive，收紧为 dependency-only
package::only_dep_upgrades(&mut upgrade_cap);

// 永久冻结（不可逆！请三思！）
package::make_immutable(upgrade_cap); // 注意：这里是 move，不是引用
```

**你不能这样做：**

```
immutable → dependency-only   ❌ 不可能
dependency-only → additive    ❌ 不可能
additive → compatible         ❌ 不可能
```

## 策略选择指南

### 按项目阶段选择

| 阶段 | 推荐策略 | 理由 |
|------|---------|------|
| 开发/测试 | `compatible` | 需要快速迭代，修复 bug |
| Beta / 审计中 | `compatible` | 审计可能发现需要修改的问题 |
| 正式发布 v1 | `compatible` → `additive` | 初期保留修复能力，稳定后收紧 |
| 成熟稳定 | `additive` → `dependency-only` | 只跟随框架升级 |
| 最终冻结 | `immutable` | 给用户最大信任 |

### 渐进式收紧策略

最佳实践是**渐进式收紧**——随着项目成熟逐步限制升级能力：

```
发布 v1 ──→ 修复 bug ──→ v1 稳定
(compatible)              │
                          ↓
              收紧为 additive
              只添加新功能
                          │
                          ↓
              v2 功能完整
              收紧为 dependency-only
                          │
                          ↓
              协议成熟
              make_immutable（永久冻结）
```

### 不同类型项目的建议

| 项目类型 | 建议策略 | 说明 |
|---------|---------|------|
| 个人项目 / 学习 | `compatible` | 保持最大灵活性 |
| DeFi 协议 | `compatible` → `additive` | 安全审计后收紧 |
| NFT 合约 | `additive` → `immutable` | 保证 NFT 规则不变 |
| 基础设施（Oracle） | `compatible` | 需要持续维护 |
| 标准库 / 公共合约 | `immutable` | 给依赖方最大信任 |

## 自定义升级策略

内置策略可能不满足所有需求。你可以通过**封装 UpgradeCap**来实施额外的升级规则。

### 时间锁升级

要求升级提议后必须等待一段冷却期，给社区时间审查：

```move
module my_protocol::timelock_upgrade;

use sui::package::UpgradeCap;
use sui::clock::Clock;

const ETimelockNotExpired: u64 = 0;
const ENoProposal: u64 = 1;

/// 24 小时冷却期
const TIMELOCK_DURATION_MS: u64 = 86_400_000;

/// 将 UpgradeCap 封装在时间锁中
public struct TimelockUpgrade has key {
    id: UID,
    cap: UpgradeCap,
    proposed_at: Option<u64>,  // 提议时间戳
}

/// 发布时调用：创建时间锁封装
public fun wrap_upgrade_cap(
    cap: UpgradeCap,
    ctx: &mut TxContext,
) {
    transfer::share_object(TimelockUpgrade {
        id: object::new(ctx),
        cap,
        proposed_at: option::none(),
    });
}

/// 第一步：提议升级（开始计时）
/// 社区可以在冷却期内审查升级内容
public fun propose_upgrade(
    self: &mut TimelockUpgrade,
    clock: &Clock,
) {
    self.proposed_at = option::some(clock.timestamp_ms());
}

/// 第二步：取消提议（如果社区有异议）
public fun cancel_proposal(self: &mut TimelockUpgrade) {
    self.proposed_at = option::none();
}

/// 第三步：执行升级（需等待冷却期结束）
public fun authorize_upgrade(
    self: &mut TimelockUpgrade,
    clock: &Clock,
): &mut UpgradeCap {
    assert!(self.proposed_at.is_some(), ENoProposal);
    let proposed_time = *self.proposed_at.borrow();
    assert!(
        clock.timestamp_ms() >= proposed_time + TIMELOCK_DURATION_MS,
        ETimelockNotExpired,
    );
    self.proposed_at = option::none();
    &mut self.cap
}
```

使用流程：

```
Day 0: propose_upgrade()         ← 提议升级
Day 0-1: 社区审查代码             ← 24 小时冷却期
Day 1: authorize_upgrade()        ← 冷却期结束，执行升级
       sui client upgrade ...
```

### 多签升级

要求多个管理员同意才能执行升级：

```move
module my_protocol::multisig_upgrade;

use sui::package::UpgradeCap;

const ENotApprover: u64 = 0;
const EAlreadyApproved: u64 = 1;
const ENotEnoughApprovals: u64 = 2;

/// 需要 3/5 管理员同意
const REQUIRED_APPROVALS: u64 = 3;

public struct MultisigUpgrade has key {
    id: UID,
    cap: UpgradeCap,
    approvers: vector<address>,  // 5 个授权管理员
    approvals: vector<address>,  // 已批准的管理员
}

/// 创建多签升级管理器
public fun create(
    cap: UpgradeCap,
    approvers: vector<address>,
    ctx: &mut TxContext,
) {
    transfer::share_object(MultisigUpgrade {
        id: object::new(ctx),
        cap,
        approvers,
        approvals: vector[],
    });
}

/// 管理员批准升级
public fun approve(
    self: &mut MultisigUpgrade,
    ctx: &TxContext,
) {
    let sender = ctx.sender();
    assert!(self.approvers.contains(&sender), ENotApprover);
    assert!(!self.approvals.contains(&sender), EAlreadyApproved);
    self.approvals.push_back(sender);
}

/// 批准数达到阈值后执行升级
public fun authorize_upgrade(
    self: &mut MultisigUpgrade,
): &mut UpgradeCap {
    assert!(
        self.approvals.length() >= REQUIRED_APPROVALS,
        ENotEnoughApprovals,
    );
    self.approvals = vector[];
    &mut self.cap
}
```

使用流程：

```
管理员 A: approve()   → approvals: [A]
管理员 B: approve()   → approvals: [A, B]
管理员 C: approve()   → approvals: [A, B, C]  ← 达到阈值
任何人:   authorize_upgrade()  → 执行升级
```

### DAO 投票升级

更复杂的场景可以结合代币投票：

```move
module my_protocol::dao_upgrade;

use sui::package::UpgradeCap;
use sui::coin::Coin;
use sui::balance::{Self, Balance};
use sui::clock::Clock;

const EVotingNotEnded: u64 = 0;
const EVoteNotPassed: u64 = 1;

/// 投票持续 7 天
const VOTING_DURATION_MS: u64 = 604_800_000;
/// 需要 > 50% 赞成票
const APPROVAL_THRESHOLD_BPS: u64 = 5000;

public struct DAOUpgrade<phantom T> has key {
    id: UID,
    cap: UpgradeCap,
    vote_start: u64,
    votes_for: Balance<T>,
    votes_against: Balance<T>,
}

/// 发起升级投票
public fun start_vote<T>(
    cap: UpgradeCap,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    transfer::share_object(DAOUpgrade<T> {
        id: object::new(ctx),
        cap,
        vote_start: clock.timestamp_ms(),
        votes_for: balance::zero(),
        votes_against: balance::zero(),
    });
}

/// 投赞成票（质押代币作为投票权重）
public fun vote_for<T>(
    self: &mut DAOUpgrade<T>,
    coin: Coin<T>,
) {
    self.votes_for.join(coin.into_balance());
}

/// 投反对票
public fun vote_against<T>(
    self: &mut DAOUpgrade<T>,
    coin: Coin<T>,
) {
    self.votes_against.join(coin.into_balance());
}

/// 投票结束后执行升级
public fun finalize<T>(
    self: &mut DAOUpgrade<T>,
    clock: &Clock,
): &mut UpgradeCap {
    assert!(
        clock.timestamp_ms() >= self.vote_start + VOTING_DURATION_MS,
        EVotingNotEnded,
    );
    let total = self.votes_for.value() + self.votes_against.value();
    let for_bps = (self.votes_for.value() * 10000) / total;
    assert!(for_bps > APPROVAL_THRESHOLD_BPS, EVoteNotPassed);
    &mut self.cap
}
```

## 实战：管理 UpgradeCap

### 发布时保存 UpgradeCap

```bash
# 发布包
sui client publish

# 从输出中找到 UpgradeCap 的 ObjectID
# 类型：0x2::package::UpgradeCap
```

### 查看当前策略

```bash
sui client object <UPGRADE_CAP_ID> --json
```

输出中的 `policy` 字段：
- `0` = compatible
- `128` = additive
- `192` = dependency-only
- `255` = immutable

### 收紧策略

```bash
# 收紧为 additive
sui client call \
  --package 0x2 \
  --module package \
  --function only_additive_upgrades \
  --args <UPGRADE_CAP_ID> \

# 永久冻结
sui client call \
  --package 0x2 \
  --module package \
  --function make_immutable \
  --args <UPGRADE_CAP_ID> \
```

### 转移 UpgradeCap 给多签地址

```bash
sui client transfer \
  --object-id <UPGRADE_CAP_ID> \
  --to <MULTISIG_ADDRESS> \
```

## 小结

- Sui 提供四种内置升级策略：compatible → additive → dependency-only → immutable
- 策略只能变得更严格，**不可回退**
- `compatible` 是默认策略，适合开发迭代阶段
- `immutable` 是终极安全选择，但**不可逆**
- 最佳实践是**渐进式收紧**——随项目成熟逐步限制升级能力
- 通过封装 `UpgradeCap` 可以实现自定义策略：时间锁、多签、DAO 投票
- `UpgradeCap` 具有 `store` 能力，可以转移给多签地址或由智能合约管理


---


<!-- source: 15_upgrade/03-versioning.md -->
## 17.3 版本化共享对象

# 版本化共享对象

升级包后，旧版本的包仍然存在于链上——任何人都可以继续通过旧包地址调用函数。如果不做限制，用户会选择对自己有利的版本（比如 XP 更多的旧版训练函数），破坏系统设计。版本化共享对象模式通过在对象和函数中嵌入版本检查来解决这个问题。

本节介绍三种版本化模式：**包级版本化**、**对象级版本化**和**混合版本化**。

## 模式一：包级版本化

包级版本化是最基础也最常用的模式。核心思想：创建一个全局共享的 `Version` 对象，所有入口函数都通过它进行版本检查。

### Version 管理器

```move
module my_protocol::version_manager;

const EInvalidPackageVersion: u64 = 0;
const EProtocolPaused: u64 = 1;
const EVersionMismatch: u64 = 2;

/// 包级版本常量
/// V1 中值为 1，V2 升级后改为 2
const CURRENT_VERSION: u64 = 1;

/// 全局版本对象（共享）
public struct Version has key {
    id: UID,
    version: u64,
    is_paused: bool,
}

/// 发布时创建 Version 对象
fun init(ctx: &mut TxContext) {
    transfer::share_object(Version {
        id: object::new(ctx),
        version: CURRENT_VERSION,
        is_paused: false,
    });
}

/// 核心检查：包的编译时版本 == 链上对象版本
public fun assert_is_valid(self: &Version) {
    assert!(!self.is_paused, EProtocolPaused);
    assert!(self.version == CURRENT_VERSION, EInvalidPackageVersion);
}

/// 暂停协议（升级前调用）
public fun pause(self: &mut Version) {
    self.is_paused = true;
}

/// 恢复协议（升级后调用）
public fun unpause(self: &mut Version) {
    self.is_paused = false;
}

/// 迁移：将版本更新为当前包版本
public fun migrate(self: &mut Version) {
    self.version = CURRENT_VERSION;
}
```

### 在业务函数中使用

每个入口函数都接收 `&Version` 参数并调用检查：

```move
module my_protocol::calculator;

use my_protocol::version_manager::Version;

/// 所有业务函数都需要版本检查
public fun sum_numbers(version: &Version, a: u64, b: u64): u64 {
    version.assert_is_valid();
    a + b
}

public fun multiply_numbers(version: &Version, a: u64, b: u64): u64 {
    version.assert_is_valid();
    a * b
}
```

### 升级流程

```
1. pause()             ← 暂停协议，阻止所有操作
2. sui client upgrade  ← 发布新包（CURRENT_VERSION = 2）
3. migrate()           ← 更新 Version 对象的版本号
4. unpause()           ← 恢复协议
```

暂停机制的好处：防止升级过程中（migrate 之前）旧包代码继续执行，确保状态一致性。

### V2 中的变化

升级时只需修改 `CURRENT_VERSION` 常量：

```move
// V2 中
const CURRENT_VERSION: u64 = 2; // ← 从 1 改为 2
```

升级后的效果：

```
V1 包（CURRENT_VERSION=1）+ Version 对象（version=2）
→ 1 != 2 → assert_is_valid() 失败 → 旧包不可用 ✓

V2 包（CURRENT_VERSION=2）+ Version 对象（version=2）
→ 2 == 2 → assert_is_valid() 成功 → 新包正常工作 ✓
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| 实现简单，一个 Version 对象管理整个包 | 所有函数都需要传入 `&Version` 参数 |
| 迁移原子化，一次 `migrate()` 切换所有函数 | 不支持按对象粒度控制版本 |
| 支持暂停/恢复机制 | 共享对象会走共识路径 |

## 模式二：对象级版本化

对象级版本化将版本信息嵌入到**每个共享对象**中，而不是使用全局 Version 对象。适用于有多个独立共享对象、需要逐个迁移的场景。

### 示例：流动性池和注册表

```move
module my_protocol::pool;

use my_protocol::version_check;

public struct SharedPool<phantom T0, phantom T1> has key {
    id: UID,
    version: u64,         // 每个池有自己的版本
    balance_t0: u64,
    balance_t1: u64,
    is_active: bool,
}

/// 创建池（版本 = 当前包版本）
public fun create_pool<T0, T1>(ctx: &mut TxContext) {
    transfer::share_object(SharedPool<T0, T1> {
        id: object::new(ctx),
        version: version_check::current_version(),
        balance_t0: 0,
        balance_t1: 0,
        is_active: true,
    });
}

/// 存款到池（检查池的版本）
public fun deposit<T0, T1>(
    pool: &mut SharedPool<T0, T1>,
    amount_t0: u64,
    amount_t1: u64,
) {
    version_check::assert_pool_version(pool.version);
    assert!(pool.is_active, 0);

    pool.balance_t0 = pool.balance_t0 + amount_t0;
    pool.balance_t1 = pool.balance_t1 + amount_t1;
}

/// 迁移单个池
public fun migrate_pool<T0, T1>(pool: &mut SharedPool<T0, T1>) {
    pool.version = version_check::current_version();
}
```

```move
module my_protocol::registry;

use my_protocol::version_check;

public struct SharedRegistry has key {
    id: UID,
    version: u64,
    pool_count: u64,
}

public fun register_pool(
    registry: &mut SharedRegistry,
    pool_id: ID,
) {
    version_check::assert_registry_version(registry.version);
    registry.pool_count = registry.pool_count + 1;
}

public fun migrate_registry(registry: &mut SharedRegistry) {
    registry.version = version_check::current_version();
}
```

### 版本检查模块

```move
module my_protocol::version_check;

const ENotSupportedObjectVersion: u64 = 0;

const CURRENT_VERSION: u64 = 1;

public fun current_version(): u64 {
    CURRENT_VERSION
}

public fun assert_pool_version(object_version: u64) {
    assert!(object_version == CURRENT_VERSION, ENotSupportedObjectVersion);
}

public fun assert_registry_version(object_version: u64) {
    assert!(object_version == CURRENT_VERSION, ENotSupportedObjectVersion);
}
```

### 逐对象迁移

对象级版本化的核心优势：可以**逐个迁移**共享对象，而不是一刀切。

```bash
# 升级包后，逐个迁移

# 先迁移注册表
sui client call --package 0xV2 --module registry --function migrate_registry \
  --args 0xREGISTRY

# 再迁移各个池（可以分批，甚至跨多笔交易）
sui client call --package 0xV2 --module pool --function migrate_pool \
  --type-args 0x2::sui::SUI 0xUSDC::usdc::USDC \
  --args 0xPOOL_SUI_USDC
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| 逐对象迁移，不影响其他对象 | 每个对象都需要 version 字段 |
| 不需要全局 Version 对象 | 迁移过程可能较长（多个对象） |
| 函数签名不需要额外的 Version 参数 | 无法一次性切换所有对象 |

## 模式三：混合版本化

混合版本化结合了**包级**和**对象级**两种模式。入口函数同时检查全局 Version 和对象自身的版本——适用于有复杂权限和多层状态管理的协议。

### 示例

```move
module my_protocol::mixed;

use my_protocol::version_manager::Version;
use my_protocol::pool::SharedPool;
use my_protocol::registry::SharedRegistry;

/// 管理员操作：同时检查包版本和对象版本
public fun set_pool_in_registry(
    version: &Version,
    registry: &mut SharedRegistry,
    pool_id: ID,
    is_active: bool,
) {
    version.assert_is_valid();
    version.assert_versions_match(registry.version());
    // 业务逻辑...
}

/// 用户操作：同时检查包版本和池版本
public fun withdraw_from_pool<T0, T1>(
    version: &Version,
    pool: &mut SharedPool<T0, T1>,
    amount: u64,
) {
    version.assert_is_valid();
    version.assert_versions_match(pool.version());
    // 提款逻辑...
}
```

### 版本管理器扩展

```move
module my_protocol::version_manager;

/// 检查对象版本是否与全局版本匹配
public fun assert_versions_match(self: &Version, object_version: u64) {
    assert!(self.version == object_version, EVersionMismatch);
}
```

### 升级流程

```
1. version.pause()                    ← 暂停全局
2. sui client upgrade                 ← 发布新包
3. version.migrate()                  ← 更新全局版本
4. pool.migrate_pool()                ← 逐个迁移池
5. registry.migrate_registry()        ← 迁移注册表
6. version.unpause()                  ← 恢复服务
```

### 何时使用混合模式

| 场景 | 推荐模式 |
|------|---------|
| 简单合约，1-2 个共享对象 | 包级版本化 |
| 多个独立共享对象（如多个池） | 对象级版本化 |
| DeFi 协议，有管理员+用户操作 | 混合版本化 |

## 小结

- **包级版本化**：一个 Version 对象管理全包，实现简单，适合大多数场景
- **对象级版本化**：每个对象独立管理版本，支持逐对象迁移
- **混合版本化**：结合两者，适合复杂协议
- 版本化将**发布**与**激活**解耦，提供受控的迁移窗口
- 暂停/恢复机制可以保护迁移过程中的状态一致性


---


<!-- source: 15_upgrade/04-migration.md -->
## 17.4 数据迁移与向前兼容

# 数据迁移与向前兼容

升级时最大的挑战之一是如何修改已有对象的数据结构。因为结构体字段在发布后**不能增减**，我们必须使用**动态字段**或**扩展容器**来实现数据迁移和向前兼容。本节介绍三种常用模式，并给出完整升级检查清单。

## 为什么不能直接改结构体

兼容性规则要求：**已有 `public` 结构体的字段不能增删改**。因此：

```move
// ❌ 错误：升级时添加新字段会破坏兼容性
public struct User has key, store {
    id: UID,
    name: String,
    level: u64,     // 不能添加
}
```

正确做法是：**保持结构体签名不变**，用动态字段或嵌套结构（如 Bag）来扩展数据。

## 模式 A：Bag 扩展

使用 `Bag` 作为万能扩展容器，在升级时往 Bag 里添加新键值对：

```move
module my_protocol::extensible_state;

use sui::bag::{Self, Bag};

public struct AppState has key {
    id: UID,
    version: u64,
    core_data: u64,
    extensions: Bag,  // 万能扩展容器
}

fun init(ctx: &mut TxContext) {
    let mut extensions = bag::new(ctx);
    extensions.add(b"fee_rate", 100u64);
    extensions.add(b"max_supply", 10000u64);

    transfer::share_object(AppState {
        id: object::new(ctx),
        version: 1,
        core_data: 0,
        extensions,
    });
}

// V1 的读取
public fun fee_rate(state: &AppState): u64 {
    *state.extensions.borrow(b"fee_rate")
}

// V2 迁移：添加新字段
public fun migrate_to_v2(state: &mut AppState) {
    state.extensions.add(b"is_paused", false);
    state.extensions.add(b"admin_fee_bps", 30u64);
    state.version = 2;
}

// V3 迁移：修改已有字段、添加新字段
public fun migrate_to_v3(state: &mut AppState) {
    let fee_rate: &mut u64 = state.extensions.borrow_mut(b"fee_rate");
    *fee_rate = 50;
    state.extensions.add(b"treasury_address", @0x123);
    state.version = 3;
}
```

## 模式 B：动态字段 Anchor

使用动态字段挂载整个配置结构体，升级时用 `remove` + `add` 替换为新版本结构体：

```move
module my_protocol::anchor;

use sui::dynamic_field as df;

/// 锚对象（结构永远不变）
public struct Anchor has key {
    id: UID,
    version: u16,
}

/// V1 配置
public struct ConfigV1 has store, drop {
    max_items: u64,
    fee_rate: u64,
}

fun init(ctx: &mut TxContext) {
    let mut anchor = Anchor {
        id: object::new(ctx),
        version: 1,
    };
    df::add(&mut anchor.id, 0u8, ConfigV1 {
        max_items: 100,
        fee_rate: 50,
    });
    transfer::share_object(anchor);
}

/// V1 读取配置
public fun get_max_items(anchor: &Anchor): u64 {
    let config: &ConfigV1 = df::borrow(&anchor.id, 0u8);
    config.max_items
}
```

V2 升级时，定义新的配置结构并迁移：

```move
/// V2 配置（添加了 paused 和 admin 字段）
public struct ConfigV2 has store, drop {
    max_items: u64,
    fee_rate: u64,
    paused: bool,
    admin: address,
}

/// 从 V1 迁移到 V2
public fun migrate_v1_to_v2(anchor: &mut Anchor, admin: address) {
    let old: ConfigV1 = df::remove(&mut anchor.id, 0u8);
    df::add(&mut anchor.id, 0u8, ConfigV2 {
        max_items: old.max_items,
        fee_rate: old.fee_rate,
        paused: false,
        admin,
    });
    anchor.version = 2;
}

public fun get_config_v2(anchor: &Anchor): &ConfigV2 {
    df::borrow(&anchor.id, 0u8)
}
```

## 模式 C：单对象动态字段扩展

不需要替换整个配置、只需给已有对象“加字段”时，可以直接用 `dynamic_field` 在对象上挂新数据：

```move
module hero_game::upgrade_requirements;

use sui::dynamic_field as df;
use sui::dynamic_object_field as dof;
use std::string::String;

public struct DummyObject has key, store {
    id: UID,
    name: String,
}

// ✅ 使用动态字段添加“新字段”
public fun add_level_to_object(obj: &mut DummyObject, level: u64) {
    df::add(&mut obj.id, b"level", level);
}

public fun get_level(obj: &DummyObject): u64 {
    *df::borrow(&obj.id, b"level")
}

// ✅ 使用动态对象字段挂载新对象
public struct Equipment has key, store {
    id: UID,
    power: u64,
}

public fun equip(obj: &mut DummyObject, equipment: Equipment) {
    dof::add(&mut obj.id, b"equipment", equipment);
}
```

## 模式 D：用户对象迁移

升级后，旧版本创建的用户对象（如 HeroV1）仍然存在。若新版本引入了新结构体（如 HeroV2），需要提供**显式迁移函数**，让用户把旧对象换成新对象：

```move
/// 旧版英雄（V1 创建的）
public struct HeroV1 has key, store {
    id: UID,
    name: vector<u8>,
    xp: u64,
}

/// 新版英雄（V2 新增了 level 字段）
/// 注意：这是新增的结构体，不是修改旧结构体
public struct HeroV2 has key, store {
    id: UID,
    name: vector<u8>,
    xp: u64,
    level: u64,
}

/// 用户调用此函数将旧英雄迁移到新版本
public fun migrate_hero(
    old_hero: HeroV1,
    ctx: &mut TxContext,
): HeroV2 {
    let HeroV1 { id, name, xp } = old_hero;
    id.delete(); // 销毁旧 UID

    HeroV2 {
        id: object::new(ctx),
        name,
        xp,
        level: xp / 100,
    }
}
```

**注意：** 用户对象迁移后**对象 ID 会改变**。若有其他合约或链下系统引用旧 ID，需要同步更新。

## 完整升级检查清单

每次升级前，建议对照以下清单：

```
□ 代码修改
  □ 更新 VERSION / CURRENT_VERSION 常量
  □ 确认没有删除 public 函数
  □ 确认没有修改 public 函数签名
  □ 确认没有修改已有结构体
  □ 新增字段用动态字段实现
  □ 废弃的函数改为 abort

□ 迁移函数
  □ 编写 migrate() 函数
  □ migrate() 有适当的权限控制（AdminCap / Publisher）
  □ migrate() 处理数据结构变化
  □ 测试 migrate() 在单元测试中通过

□ 兼容性测试
  □ sui move build 无错误
  □ 单元测试全部通过
  □ 在 devnet/testnet 上测试完整流程

□ 发布流程
  □ 暂停协议（如果使用暂停机制）
  □ sui client upgrade --upgrade-capability <CAP_ID>
  □ 记录新 Package ID
  □ 调用 migrate() 更新共享对象版本
  □ 迁移各个共享对象（如果使用对象级版本化）
  □ 恢复协议
  □ 验证旧包函数不可调用
  □ 验证新包函数正常工作
```

## 小结

- 结构体字段不可增减，必须通过**动态字段**或 **Bag** 扩展
- **Bag 扩展**：适合键值型扩展，多版本逐步加字段
- **动态字段 Anchor**：适合整块配置替换（ConfigV1 → ConfigV2）
- **单对象动态字段**：给已有对象挂新字段或新对象（如 level、equipment）
- **用户对象迁移**：旧类型 → 新类型需显式迁移函数，注意对象 ID 会变
- 每次升级前对照检查清单，确保兼容性与迁移流程正确


---


<!-- source: 15_upgrade/05-hero-walkthrough.md -->
## 17.5 实战：Hero 游戏完整升级

# 实战：Hero 游戏完整升级

本节通过一个完整的 Hero 游戏案例，演示从 V1 发布、使用，到 V2 修改、升级、迁移和验证的全流程。你将亲手完成一次真实的包升级。

## 第一步：创建项目

```bash
sui move new hero_game
cd hero_game
```

## 第二步：编写 V1 代码

**sources/hero.move** — 英雄 NFT 定义：

```move
module hero_game::hero;

use sui::package;

public struct HERO has drop {}

public struct Hero has key, store {
    id: UID,
    lvl: u64,
    xp: u64,
    xp_to_next_lvl: u64,
}

fun init(otw: HERO, ctx: &mut TxContext) {
    package::claim_and_keep(otw, ctx);
}

public fun mint_hero(ctx: &mut TxContext) {
    let hero = Hero {
        id: object::new(ctx),
        lvl: 1,
        xp: 0,
        xp_to_next_lvl: 100,
    };
    transfer::transfer(hero, ctx.sender());
}

// === Package 内部访问器 ===

public(package) fun lvl(self: &Hero): u64 { self.lvl }
public(package) fun xp(self: &Hero): u64 { self.xp }
public(package) fun xp_to_next_lvl(self: &Hero): u64 { self.xp_to_next_lvl }

// === Package 内部修改器 ===

public(package) fun add_xp(self: &mut Hero, amount: u64) {
    self.xp = self.xp + amount;
}

public(package) fun set_lvl(self: &mut Hero, value: u64) {
    self.lvl = value;
}

public(package) fun set_xp(self: &mut Hero, value: u64) {
    self.xp = value;
}

public(package) fun set_xp_to_next_lvl(self: &mut Hero, value: u64) {
    self.xp_to_next_lvl = value;
}
```

访问器和修改器使用 `public(package)` 而非 `public`，保留升级时修改签名的灵活性。

**sources/training_ground.move** — 训练场（版本控制 + 业务逻辑）：

```move
module hero_game::training_ground;

use hero_game::hero::Hero;

const VERSION: u64 = 1;
const XP_PER_TRAINING: u64 = 50;

const EInvalidPackageVersion: u64 = 0;
const ENotEnoughXp: u64 = 1;

public struct TrainingGround has key {
    id: UID,
    version: u64,
    xp_per_level: u64,
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(TrainingGround {
        id: object::new(ctx),
        version: VERSION,
        xp_per_level: 100,
    })
}

public fun check_is_valid(self: &TrainingGround) {
    assert!(self.version == VERSION, EInvalidPackageVersion);
}

public fun train(self: &TrainingGround, hero: &mut Hero) {
    self.check_is_valid();
    hero.add_xp(XP_PER_TRAINING);
}

public fun level_up(self: &TrainingGround, hero: &mut Hero) {
    self.check_is_valid();
    let current_xp = hero.xp();
    let req_xp = hero.xp_to_next_lvl();
    let current_lvl = hero.lvl();
    assert!(current_xp >= req_xp, ENotEnoughXp);

    hero.set_xp(current_xp - req_xp);
    let new_lvl = current_lvl + 1;
    hero.set_lvl(new_lvl);
    hero.set_xp_to_next_lvl(new_lvl * self.xp_per_level);
}
```

## 第三步：发布 V1

```bash
sui client publish
```

记录输出中的：
- **Package ID**（例如 `0xV1_PACKAGE`）
- **UpgradeCap ID**（例如 `0xUPGRADE_CAP`）
- **TrainingGround ID**（共享对象，例如 `0xTRAINING_GROUND`）

## 第四步：V1 使用体验

```bash
# 铸造英雄
sui client call \
  --package 0xV1_PACKAGE \
  --module hero \
  --function mint_hero \
# 记录 Hero ID（例如 0xHERO）

# 训练英雄（+50 XP）
sui client call \
  --package 0xV1_PACKAGE \
  --module training_ground \
  --function train \
  --args 0xTRAINING_GROUND 0xHERO \

# 再训练一次（累计 100 XP）
sui client call \
  --package 0xV1_PACKAGE \
  --module training_ground \
  --function train \
  --args 0xTRAINING_GROUND 0xHERO \

# 升级英雄（100 XP → Level 2）
sui client call \
  --package 0xV1_PACKAGE \
  --module training_ground \
  --function level_up \
  --args 0xTRAINING_GROUND 0xHERO \
```

## 第五步：修改为 V2

假设要重新平衡：每次训练 XP 从 50 降为 30，并增加升级所需 XP。V2 改动：

1. `VERSION` 从 1 改为 2
2. 废弃旧 `train`，新增 `train_v2`（30 XP）
3. 添加 `migrate` 更新共享对象版本和参数

修改 **sources/training_ground.move**：

```move
module hero_game::training_ground;

use hero_game::hero::Hero;

const VERSION: u64 = 2;

const EInvalidPackageVersion: u64 = 0;
const ENotEnoughXp: u64 = 1;
const EUseTrainV2Instead: u64 = 2;

public struct TrainingGround has key {
    id: UID,
    version: u64,
    xp_per_level: u64,
}

public fun check_is_valid(self: &TrainingGround) {
    assert!(self.version == VERSION, EInvalidPackageVersion);
}

/// 迁移共享对象到 V2
public fun migrate(self: &mut TrainingGround) {
    assert!(self.version < VERSION, EInvalidPackageVersion);
    self.version = VERSION;
    self.xp_per_level = 150;
}

/// [已废弃] 旧训练函数 — 调用将中止
public fun train(_self: &TrainingGround, _hero: &mut Hero) {
    abort EUseTrainV2Instead
}

/// V2 训练：每次 30 XP
public fun train_v2(self: &TrainingGround, hero: &mut Hero) {
    self.check_is_valid();
    hero.add_xp(30);
}

public fun level_up(self: &TrainingGround, hero: &mut Hero) {
    self.check_is_valid();
    let current_xp = hero.xp();
    let req_xp = hero.xp_to_next_lvl();
    let current_lvl = hero.lvl();
    assert!(current_xp >= req_xp, ENotEnoughXp);

    hero.set_xp(current_xp - req_xp);
    let new_lvl = current_lvl + 1;
    hero.set_lvl(new_lvl);
    hero.set_xp_to_next_lvl(new_lvl * self.xp_per_level);
}
```

## 第六步：发布 V2 升级

```bash
sui move build
sui client upgrade --upgrade-capability 0xUPGRADE_CAP
```

记录新的 **Package ID**（例如 `0xV2_PACKAGE`）。

## 第七步：迁移窗口

升级发布后、调用 `migrate` 之前，存在一个**迁移窗口**：

```
发布 V2 后，migrate 前的状态：
┌──────────────────┬───────────────────┐
│ V1 包 (VERSION=1)│ V2 包 (VERSION=2) │
│ 对象 version=1   │ 对象 version=1    │
│ 1 == 1 ✅ 可调用 │ 2 != 1 ❌ 会中止  │
└──────────────────┴───────────────────┘

调用 migrate 后：
┌──────────────────┬───────────────────┐
│ V1 包 (VERSION=1)│ V2 包 (VERSION=2) │
│ 对象 version=2   │ 对象 version=2    │
│ 1 != 2 ❌ 会中止 │ 2 == 2 ✅ 可调用  │
└──────────────────┴───────────────────┘
```

发布与激活解耦，便于先验证再切换。

## 第八步：执行迁移

```bash
sui client call \
  --package 0xV2_PACKAGE \
  --module training_ground \
  --function migrate \
  --args 0xTRAINING_GROUND \
```

## 第九步：验证升级效果

```bash
# 验证 1：旧 train 已废弃
sui client call \
  --package 0xV2_PACKAGE \
  --module training_ground \
  --function train \
  --args 0xTRAINING_GROUND 0xHERO \
# 预期：MoveAbort EUseTrainV2Instead

# 验证 2：train_v2 正常
sui client call \
  --package 0xV2_PACKAGE \
  --module training_ground \
  --function train_v2 \
  --args 0xTRAINING_GROUND 0xHERO \
# 预期：成功，+30 XP

# 验证 3：旧包被拒绝
sui client call \
  --package 0xV1_PACKAGE \
  --module training_ground \
  --function train \
  --args 0xTRAINING_GROUND 0xHERO \
# 预期：MoveAbort EInvalidPackageVersion
```

## 小结

- 完整流程：创建项目 → 写 V1 → 发布 → 使用 → 改 V2 → 升级 → 迁移 → 验证
- 版本化共享对象（`version` 字段 + `check_is_valid()`）实现发布与激活解耦
- `public` 函数不能删除，可改为 `abort` 实现废弃
- 迁移窗口内旧包仍可用，调用 `migrate` 后仅新包可用
- 建议在 devnet/testnet 上完整跑通一遍后再上主网


---


<!-- source: 15_security/index.md -->
## 第十八章 · 安全与升级

# 第十八章 · 安全与升级

本章讲解 Sui Move 合约的安全最佳实践，帮助你构建生产级别的安全合约。包升级的完整内容已独立成第十五章。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 18.1 | 安全最佳实践 | 权限检查、输入验证、对象安全 |
| 18.2 | 常见漏洞模式 | 权限泄露、对象混淆、整数溢出 |
| 18.3 | 错误处理最佳实践 | 错误码设计、分类、用户友好的错误信息 |
| 18.4 | 协议与网络限制 | 交易/对象/参数/动态字段/事件等协议上限 |

## 学习目标

读完本章后，你将能够：

- 识别和防范常见的安全漏洞
- 设计健壮的错误处理策略
- 在合约中落实权限与输入验证等安全实践


---


<!-- source: 15_security/security-best-practices.md -->
## 18.1 安全最佳实践

# 安全最佳实践

本节总结 Move 合约开发中的安全最佳实践，涵盖权限管理、输入验证和对象安全三大方面。这些实践来源于 Sui 生态的真实项目经验和常见安全审计发现。

## 权限管理

### Capability 模式

使用 Capability 对象控制特权操作：

```move
module admin_action::admin_cap;

use sui::package;

public struct ADMIN_CAP() has drop;

/// 持有此凭证才能执行管理操作
public struct AdminCap has key, store {
    id: UID,
}

public struct Hero has key {
    id: UID,
    health: u64,
    stamina: u64,
}

fun init(otw: ADMIN_CAP, ctx: &mut TxContext) {
    package::claim_and_keep(otw, ctx);
    transfer::public_transfer(AdminCap {
        id: object::new(ctx),
    }, ctx.sender());
}

/// 只有持有 AdminCap 的地址才能铸造
public fun mint(
    _cap: &AdminCap, // Capability 作为权限证明
    health: u64,
    stamina: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    transfer::transfer(Hero {
        id: object::new(ctx),
        health,
        stamina,
    }, recipient);
}
```

### ACL（访问控制列表）模式

使用共享对象维护授权地址列表：

```move
module admin_action::acl;

const ENotAdmin: u64 = 0;

public struct AccessControlList has key {
    id: UID,
    admins: vector<address>,
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(AccessControlList {
        id: object::new(ctx),
        admins: vector[ctx.sender()],
    });
}

public fun mint(
    acl: &AccessControlList,
    health: u64,
    stamina: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    assert!(acl.admins.contains(&ctx.sender()), ENotAdmin);
    // ... 铸造逻辑
}

public fun add_admin(
    acl: &mut AccessControlList,
    _cap: &AdminCap,
    new_admin: address,
) {
    acl.admins.push_back(new_admin);
}
```

### 签名验证模式

使用 Ed25519 签名进行链下授权：

```move
module admin_action::signature;

use sui::{ed25519, hash};

const BE_PUBLIC_KEY: vector<u8> = x"...your_public_key...";

public struct Counter has key {
    id: UID,
    value: u64,
}

#[allow(implicit_const_copy)]
public fun mint(
    sig: vector<u8>,
    counter: &mut Counter,
    health: u64,
    stamina: u64,
    ctx: &mut TxContext,
): bool {
    // 将 counter 值包含在签名消息中，防止重放攻击
    let mut msg = b"Mint Hero for: 0x".to_string();
    msg.append(ctx.sender().to_string());
    msg.append_utf8(b";health=");
    msg.append(health.to_string());
    msg.append_utf8(b";counter=");
    msg.append(counter.value.to_string());

    let bytes = msg.into_bytes();
    let digest = hash::blake2b256(&bytes);

    if (!ed25519::ed25519_verify(&sig, &BE_PUBLIC_KEY, &digest)) {
        return false
    };

    // 递增 counter 防止重放
    counter.value = counter.value + 1;

    transfer::transfer(Hero {
        id: object::new(ctx),
        health,
        stamina,
    }, ctx.sender());
    true
}
```

## 对象引用安全

### Referent ID 问题

Capability 必须与它控制的共享对象绑定，否则一个 Capability 可以操控任意共享对象：

```move
// 不安全：SatchelCap 可以操控任何 SharedSatchel
public struct SatchelCap has key, store {
    id: UID,
}

// 安全：SatchelCap 绑定到特定的 SharedSatchel
public struct SatchelCap has key, store {
    id: UID,
    satchel_id: ID, // 绑定到特定共享对象
}

public fun add_scroll(
    self: &mut SharedSatchel,
    cap: &SatchelCap,
    scroll: Scroll,
) {
    // 验证 cap 属于这个 satchel
    assert!(cap.satchel_id == object::id(self), ENotYourSatchel);
    self.scrolls.push_back(scroll);
}
```

### Hot Potato 安全

Borrow 类型的 Hot Potato 也需要绑定到特定对象，防止跨对象借用：

```move
/// 不安全的 Borrow
public struct Borrow()

/// 安全的 Borrow：绑定到特定的 SharedSatchel
public struct Borrow {
    satchel_id: ID,
}

public fun borrow_scroll(
    self: &mut SharedSatchel,
    scroll_id: ID,
): (Scroll, Borrow) {
    let idx = self.scrolls.find_index!(|s| object::id(s) == scroll_id);
    assert!(idx.is_some(), ENoScrollWithThisID);
    (
        self.scrolls.remove(idx.extract()),
        Borrow { satchel_id: object::id(self) },
    )
}

public fun return_scroll(
    self: &mut SharedSatchel,
    scroll: Scroll,
    borrow: Borrow,
) {
    assert!(borrow.satchel_id == object::id(self), EInvalidReturn);
    self.scrolls.push_back(scroll);
    let Borrow { satchel_id: _ } = borrow;
}
```

## 输入验证

### 全面的参数检查

```move
const EInvalidName: u64 = 1;
const EInvalidStamina: u64 = 2;
const EInvalidAttack: u64 = 3;
const MAX_STAMINA: u64 = 1000;
const MAX_ATTACK: u64 = 500;

public fun create_hero(
    name: String,
    stamina: u64,
    attack: u64,
    ctx: &mut TxContext,
): Hero {
    assert!(name.length() > 0 && name.length() <= 32, EInvalidName);
    assert!(stamina > 0 && stamina <= MAX_STAMINA, EInvalidStamina);
    assert!(attack <= MAX_ATTACK, EInvalidAttack);

    Hero {
        id: object::new(ctx),
        name,
        stamina,
        weapon: option::none(),
    }
}
```

### 整数溢出保护

```move
const EOverflow: u64 = 10;

public fun safe_add(a: u64, b: u64): u64 {
    let result = a + b;
    assert!(result >= a, EOverflow); // 检查溢出
    result
}

public fun add_xp(hero: &mut Hero, amount: u64) {
    hero.xp = safe_add(hero.xp, amount);
}
```

## 协议限制

了解 Sui 的协议限制对于安全设计至关重要：

| 限制 | 值 | 影响 |
|------|---|------|
| `max_num_new_move_object_ids` | 2048 | 每笔交易最多创建的新对象数 |
| `max_move_object_size` | 256,000 bytes | 单个对象最大大小 |
| `object_runtime_max_num_cached_objects` | 1000 | 单笔交易最多访问的动态字段数 |
| `max_num_event_emit` | 1024 | 每笔交易最多发出的事件数 |

### 批量操作

```move
/// 批量铸造：分批处理以遵守协议限制
public fun mint_swords_batch(
    armory: &mut Armory,
    n_swords: u64,
    attack: u64,
    ctx: &mut TxContext,
) {
    // 每批最多 1000 个（尊重缓存限制）
    let batch_size = if (n_swords > 1000) { 1000 } else { n_swords };
    batch_size.do!(|_| {
        let sword = Sword {
            id: object::new(ctx),
            attack,
        };
        table::add(&mut armory.swords, armory.index, sword);
        armory.index = armory.index + 1;
    });
}
```

## 安全检查清单

### 发布前必查

- [ ] 所有特权操作都有 Capability 或 ACL 保护
- [ ] Capability 与其控制的共享对象绑定（Referent ID）
- [ ] Hot Potato 绑定到特定对象
- [ ] 所有用户输入都经过验证
- [ ] 整数运算检查溢出
- [ ] 共享对象有版本控制
- [ ] 错误码唯一且有描述性
- [ ] 遵守协议限制（对象大小、数量等）
- [ ] 敏感操作有重放攻击防护
- [ ] `public` 函数签名已确认稳定

## 小结

- 使用 Capability 模式、ACL 模式或签名验证模式管理权限
- Capability 必须通过 Referent ID 绑定到它控制的共享对象
- Hot Potato 应绑定到特定对象，防止跨对象操作
- 全面验证用户输入：范围检查、长度检查、溢出保护
- 了解并遵守 Sui 协议限制
- 使用签名 + Counter 防止重放攻击
- 发布前完成安全检查清单


---


<!-- source: 15_security/common-vulnerabilities.md -->
## 18.2 常见漏洞模式

# 常见漏洞模式

本节分析 Move 合约开发中常见的安全漏洞模式，包括权限泄露、对象混淆、整数溢出、存储膨胀等。了解这些漏洞模式可以帮助你在编码阶段就避免它们。

## 权限泄露

### 未绑定的 Capability

最常见的权限漏洞是 Capability 没有绑定到特定的共享对象：

```move
// 漏洞：任何 SatchelCap 都能操控任何 SharedSatchel
public struct SatchelCap has key, store {
    id: UID,
}

public fun remove_scroll(
    self: &mut SharedSatchel,
    _cap: &SatchelCap, // 没有验证 cap 属于 self
    scroll_id: ID,
): Scroll {
    // 直接操作，无权限验证...
}
```

**修复**：在 Capability 中存储关联对象的 ID：

```move
public struct SatchelCap has key, store {
    id: UID,
    satchel_id: ID,
}

public fun remove_scroll(
    self: &mut SharedSatchel,
    cap: &SatchelCap,
    scroll_id: ID,
): Scroll {
    assert!(cap.satchel_id == object::id(self), ENotYourSatchel);
    // ...
}
```

### 过度暴露的 Capability

```move
// 漏洞：AdminCap 有 store 能力，可以被自由转让
public struct AdminCap has key, store {
    id: UID,
}

// 更安全：去掉 store，只允许定义模块内转让
public struct AdminCap has key {
    id: UID,
}
```

## 对象混淆

### Hot Potato 跨对象攻击

不绑定的 Hot Potato 可以被用来在不同对象间移动资产：

```move
// 漏洞：Borrow 没有绑定到特定 Satchel
public struct Borrow() {}

// 攻击场景：
// 1. 从 satchel_a 借出 scroll（获得 Borrow）
// 2. 将 scroll 归还到 satchel_b（使用同一个 Borrow）
// 3. scroll 被移动到了攻击者控制的 satchel
```

**修复**：

```move
public struct Borrow {
    satchel_id: ID,
    scroll_id: ID,
}

public fun return_scroll(
    self: &mut SharedSatchel,
    scroll: Scroll,
    borrow: Borrow,
) {
    let Borrow { satchel_id, scroll_id } = borrow;
    assert!(satchel_id == object::id(self), EInvalidReturn);
    assert!(scroll_id == object::id(&scroll), EWrongScroll);
    self.scrolls.push_back(scroll);
}
```

### 类型混淆

```move
// 潜在漏洞：使用泛型时未限制类型参数
public fun withdraw<T: key + store>(
    vault: &mut Vault,
    id: ID,
): T {
    df::remove(&mut vault.id, id)
}

// 攻击者可能用错误的类型 T 调用，导致意外行为
// 修复：使用 Phantom 类型或验证类型
```

## 重放攻击

### 签名重放

```move
// 漏洞：同一个签名可以被多次使用
public fun mint(
    sig: vector<u8>,
    health: u64,
    stamina: u64,
    ctx: &mut TxContext,
): bool {
    let msg = /* 构造消息 */;
    let digest = hash::blake2b256(&msg);
    if (!ed25519::ed25519_verify(&sig, &BE_PUBLIC_KEY, &digest)) {
        return false
    };
    // 铸造...但同样的 sig 可以再次使用！
    true
}
```

**修复**：加入递增的 counter 或 nonce：

```move
public fun mint(
    sig: vector<u8>,
    counter: &mut Counter,
    health: u64,
    stamina: u64,
    ctx: &mut TxContext,
): bool {
    let mut msg = b"Mint Hero;counter=".to_string();
    msg.append(counter.value.to_string());
    // ... 其他消息内容

    let digest = hash::blake2b256(&msg.into_bytes());
    if (!ed25519::ed25519_verify(&sig, &BE_PUBLIC_KEY, &digest)) {
        return false
    };

    counter.value = counter.value + 1; // 递增，使旧签名失效
    // 铸造...
    true
}
```

## 整数溢出

### 算术溢出

Move 默认不检查算术溢出。在 u64 范围内，大数值相加可能会回绕：

```move
// 潜在漏洞：如果 amount 非常大
public fun add_balance(account: &mut Account, amount: u64) {
    account.balance = account.balance + amount;
    // 如果溢出，balance 可能变成一个很小的值
}
```

**修复**：

```move
const EOverflow: u64 = 100;

public fun add_balance(account: &mut Account, amount: u64) {
    let new_balance = account.balance + amount;
    assert!(new_balance >= account.balance, EOverflow);
    account.balance = new_balance;
}
```

### 除零错误

```move
// 漏洞：divisor 可能为 0
public fun calculate_share(total: u64, divisor: u64): u64 {
    total / divisor // 如果 divisor == 0 会 panic
}

// 修复
const EDivisionByZero: u64 = 101;

public fun calculate_share(total: u64, divisor: u64): u64 {
    assert!(divisor > 0, EDivisionByZero);
    total / divisor
}
```

## 存储膨胀

### Vector 无限增长

```move
// 漏洞：vector 无限增长最终会超过对象大小限制
public struct Registry has key {
    id: UID,
    items: vector<ID>, // 当超过约 31,000 个 ID 时会超过 256KB 限制
}

public fun register(reg: &mut Registry, id: ID) {
    reg.items.push_back(id); // 无限制添加
}
```

**修复**：使用 `Table` 替代 `vector`：

```move
use sui::table::Table;

public struct Registry has key {
    id: UID,
    items: Table<u64, ID>, // 动态字段不计入对象大小
    counter: u64,
}

public fun register(reg: &mut Registry, id: ID) {
    reg.items.add(reg.counter, id);
    reg.counter = reg.counter + 1;
}
```

### 存储回收遗漏

使用 Table 时，`drop` 只销毁表结构，不回收条目的存储空间：

```move
// 漏洞：丢失存储回收
public fun destroy(armory: Armory) {
    let Armory { id, swords } = armory;
    swords.drop(); // 只删表，条目变成"孤儿"，存储费无法回收
    id.delete();
}

// 修复：先清空表条目
public fun destroy_entries(
    armory: &mut Armory,
    start: u64,
    end: u64,
) {
    let mut i = start;
    while (i < end) {
        let _sword: Sword = armory.swords.remove(i);
        let Sword { id, .. } = _sword;
        id.delete(); // 回收存储
        i = i + 1;
    };
}

public fun destroy(armory: Armory) {
    let Armory { id, swords } = armory;
    swords.destroy_empty(); // 确保表已清空
    id.delete();
}
```

## 版本跳过攻击

```move
// 漏洞：升级后不使用版本检查
public fun perform_action(state: &mut AppState) {
    // 没有版本检查！旧包的函数仍然可以调用
}

// 修复
public fun perform_action(state: &mut AppState) {
    assert!(state.version == VERSION, EInvalidPackageVersion);
    // ...
}
```

## 漏洞检查清单

| 漏洞类型 | 检查方法 |
|---------|---------|
| 权限泄露 | Capability 是否绑定到特定对象？ |
| 对象混淆 | Hot Potato 是否包含对象 ID？ |
| 重放攻击 | 签名消息是否包含 nonce/counter？ |
| 整数溢出 | 大数值运算是否有边界检查？ |
| 存储膨胀 | 是否使用 Table 替代无界 vector？ |
| 版本跳过 | 共享对象操作是否有版本检查？ |
| 除零错误 | 除法操作前是否验证分母？ |
| 过度暴露 | Capability 是否需要 `store` 能力？ |

## 小结

- 权限泄露是最常见的漏洞：始终将 Capability 绑定到特定对象
- Hot Potato 必须包含来源对象的 ID，防止跨对象操作
- 签名验证必须包含 nonce/counter 防止重放
- 注意整数溢出和除零错误，添加适当的断言
- 使用 `Table` 替代无界 `vector`，避免存储膨胀
- 正确回收 Table 条目的存储空间
- 所有操作共享对象的函数都应包含版本检查


---


<!-- source: 15_security/error-handling.md -->
## 18.3 错误处理最佳实践

# 错误处理最佳实践

本节讲解 Move 合约中的错误处理策略。良好的错误处理不仅能帮助调试，还能向用户提供有意义的反馈。我们将介绍错误码设计、分类策略和三条核心规则。

## Move 中的错误机制

当执行遇到 `abort` 时，交易失败并返回中止码（abort code）。Move VM 会返回中止交易的模块名称和中止码。但这种行为对调用者来说不够透明，特别是当一个函数包含多个可能中止的调用时。

### 问题场景

```move
module book::module_a;

use book::module_b;

public fun do_something() {
    let field_1 = module_b::get_field(1); // 可能以 abort code 0 中止
    /* ... 大量逻辑 ... */
    let field_2 = module_b::get_field(2); // 可能以 abort code 0 中止
    /* ... 更多逻辑 ... */
    let field_3 = module_b::get_field(3); // 可能以 abort code 0 中止
}
```

如果调用者收到 abort code `0`，无法确定是哪个调用失败了。

## 三条核心规则

### 规则一：处理所有可能的场景

在调用可能中止的函数之前，先用安全的检查函数验证：

```move
module book::module_a;

use book::module_b;

const ENoField: u64 = 0;

public fun do_something() {
    assert!(module_b::has_field(1), ENoField);
    let field_1 = module_b::get_field(1);
    /* ... */
    assert!(module_b::has_field(2), ENoField);
    let field_2 = module_b::get_field(2);
    /* ... */
    assert!(module_b::has_field(3), ENoField);
    let field_3 = module_b::get_field(3);
}
```

通过在每次调用前添加自定义检查，开发者掌握了错误处理的控制权。

### 规则二：使用不同的错误码

为每个失败场景分配唯一的错误码：

```move
module book::module_a;

use book::module_b;

const ENoFieldA: u64 = 0;
const ENoFieldB: u64 = 1;
const ENoFieldC: u64 = 2;

public fun do_something() {
    assert!(module_b::has_field(1), ENoFieldA);
    let field_1 = module_b::get_field(1);
    /* ... */
    assert!(module_b::has_field(2), ENoFieldB);
    let field_2 = module_b::get_field(2);
    /* ... */
    assert!(module_b::has_field(3), ENoFieldC);
    let field_3 = module_b::get_field(3);
}
```

现在调用者可以精确定位问题：abort code `0` 表示 "字段 1 不存在"，`1` 表示 "字段 2 不存在"，依此类推。

### 规则三：返回 bool 而非 assert

不要暴露一个公共的 assert 函数，而是提供返回 bool 的检查函数：

```move
// 不推荐：暴露断言函数
module book::some_app_assert;

const ENotAuthorized: u64 = 0;

public fun do_a() {
    assert_is_authorized();
    // ...
}

/// 不要这样做
public fun assert_is_authorized() {
    assert!(/* 某个条件 */ true, ENotAuthorized);
}
```

```move
// 推荐：暴露布尔函数
module book::some_app;

const ENotAuthorized: u64 = 0;

public fun do_a() {
    assert!(is_authorized(), ENotAuthorized);
    // ...
}

public fun do_b() {
    assert!(is_authorized(), ENotAuthorized);
    // ...
}

/// 返回 bool，让调用者决定如何处理
public fun is_authorized(): bool {
    /* 某个条件 */ true
}

// 内部使用的断言函数仍然可以存在
fun assert_is_authorized() {
    assert!(is_authorized(), ENotAuthorized);
}
```

## 错误码设计规范

### 命名约定

错误常量使用 `EPascalCase` 前缀：

```move
// 正确：EPascalCase
const ENotAuthorized: u64 = 0;
const EInsufficientBalance: u64 = 1;
const EObjectNotFound: u64 = 2;

// 错误：ALL_CAPS 用于普通常量
const NOT_AUTHORIZED: u64 = 0; // 不推荐
```

### 分类编号策略

按模块功能分组分配错误码：

```move
module my_protocol::marketplace;

// 权限错误：0-9
const ENotOwner: u64 = 0;
const ENotAdmin: u64 = 1;
const ENotApproved: u64 = 2;

// 输入验证错误：10-19
const EInvalidPrice: u64 = 10;
const EInvalidQuantity: u64 = 11;
const EInvalidName: u64 = 12;

// 状态错误：20-29
const EAlreadyListed: u64 = 20;
const ENotListed: u64 = 21;
const EAlreadySold: u64 = 22;

// 余额错误：30-39
const EInsufficientBalance: u64 = 30;
const EInsufficientPayment: u64 = 31;

// 版本/系统错误：100+
const EInvalidPackageVersion: u64 = 100;
const EDeprecated: u64 = 101;
```

### 前端错误码映射

```typescript
const ERROR_MESSAGES: Record<number, string> = {
  0: '您没有权限执行此操作',
  1: '需要管理员权限',
  10: '价格无效，请输入正数',
  11: '数量无效',
  20: '该物品已上架',
  21: '该物品未上架',
  30: '余额不足',
  100: '合约版本不兼容，请刷新页面',
};

function getErrorMessage(abortCode: number): string {
  return ERROR_MESSAGES[abortCode] ?? `未知错误 (代码: ${abortCode})`;
}
```

## 高级模式

### 错误上下文包装

当需要区分同一模块中不同位置的相同类型错误时：

```move
const ETransferFailed_SenderCheck: u64 = 40;
const ETransferFailed_ReceiverCheck: u64 = 41;
const ETransferFailed_AmountCheck: u64 = 42;

public fun transfer(
    from: &mut Account,
    to: &mut Account,
    amount: u64,
) {
    assert!(from.is_active(), ETransferFailed_SenderCheck);
    assert!(to.is_active(), ETransferFailed_ReceiverCheck);
    assert!(from.balance >= amount, ETransferFailed_AmountCheck);
    // ...
}
```

### 优雅降级

对于非关键操作，考虑返回结果而非中止：

```move
/// 尝试装备武器，返回操作结果
public fun try_equip_weapon(
    hero: &mut Hero,
    weapon: Weapon,
): (bool, Option<Weapon>) {
    if (hero.weapon.is_some()) {
        // 已有武器，返回失败和未使用的武器
        (false, option::some(weapon))
    } else {
        hero.weapon.fill(weapon);
        (true, option::none())
    }
}
```

## 测试错误处理

```move
#[test, expected_failure(abort_code = ENotAuthorized)]
fun unauthorized_access_fails() {
    let ctx = &mut tx_context::dummy();
    // 设置无权限场景
    unauthorized_action(ctx);
    abort 0xFF // 如果执行到这里说明测试失败
}

#[test]
fun error_returns_correct_code() {
    // 验证 is_authorized 返回正确的布尔值
    assert!(!is_authorized_for(@0x0));
    assert!(is_authorized_for(@0x1));
}
```

## 小结

- 遵循三条核心规则：处理所有场景、使用不同错误码、返回 bool 而非 assert
- 错误常量使用 `EPascalCase` 命名约定
- 按功能分组分配错误码，便于定位和维护
- 在前端维护错误码到用户友好消息的映射
- 提供 `is_*` 检查函数让调用者在中止前验证条件
- 对非关键操作考虑优雅降级（返回结果而非中止）
- 使用 `#[expected_failure(abort_code = ...)]` 测试错误路径


---


<!-- source: 15_security/protocol-limits.md -->
## 18.4 协议与网络限制

# 协议与网络限制

为保证网络安全与稳定，Sui 在协议层规定了一系列限制。超过这些限制时，交易会被网络拒绝或执行时中止。这些限制由协议配置定义，只能通过网络升级修改。开发应用时需在设计阶段就考虑这些上限。

## 交易大小

单笔**交易**的总大小上限为 **128KB**，包括交易负载、签名和元数据。超过后交易会被网络拒绝。

## 对象大小

单个**对象**的数据大小上限为 **256KB**。超过后对象无法被接受。若需存储更多数据，可使用「基础对象 + 动态字段」（如 Bag）等方式拆分。

## 单参数大小（Pure 参数）

单笔交易中，**单个纯参数**的大小上限为 **16KB**。若传入的向量等超过该限制，会导致执行失败。例如要传入超过约 500 个 address（每个 32 字节）的列表，应在 PTB 或 Move 内用 `vector::append` 等动态拼接，而不是一次性传入超过 16KB 的单个参数。

## 单笔交易创建的对象数

单笔交易中**新创建的对象**数量上限为 **2048**。超过后交易会被拒绝。动态字段的 key 和 value 也计为对象，因此单笔交易中**新创建的动态字段**数量上限约为 **1000**（动态对象字段同理）。

## 单笔交易访问的动态字段数

单笔交易中**被访问的**动态字段数量上限为 **1000**。超过后交易会被拒绝。

## 单笔交易发出的事件数

单笔交易中**发出的事件**数量上限为 **1024**。超过后交易会中止。

## 小结

| 限制项 | 上限 | 超出后果 |
|--------|------|----------|
| 交易大小 | 128KB | 交易被拒绝 |
| 对象大小 | 256KB | 对象被拒绝 |
| 单纯参数大小 | 16KB | 执行失败 |
| 单笔创建对象数 | 2048 | 交易被拒绝 |
| 单笔创建动态字段数 | 约 1000 | 交易被拒绝 |
| 单笔访问动态字段数 | 1000 | 交易被拒绝 |
| 单笔事件数 | 1024 | 交易中止 |

设计大对象、批量铸造、复杂 PTB 或高吞吐事件时，请对照上述限制做容量与拆分设计。更多实践可参考「安全最佳实践」与「代码质量检查清单」。


---


<!-- source: 16_infrastructure/index.md -->
## 第十九章 · 基础设施与数据

# 第十九章 · 基础设施与数据

本章介绍 Sui 的基础设施组件，包括全节点、索引器、API 和监控，适合需要构建后端服务的开发者。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 16.1 | 全节点概述 | 架构、运行方式、RPC 端点 |
| 16.2 | 自定义索引器 | 为什么需要索引器、Rust/JS 实现 |
| 16.3 | gRPC 事件流 | 实时事件订阅、过滤与重放 |
| 16.4 | GraphQL API | 查询语法、常用查询、分页 |
| 16.5 | Prometheus 与 Grafana | 指标采集、仪表板、告警配置 |

## 学习目标

读完本章后，你将能够：

- 理解 Sui 全节点的架构和数据流
- 搭建自定义索引器处理链上数据
- 使用 Prometheus + Grafana 监控服务状态


---


<!-- source: 16_infrastructure/fullnode-overview.md -->
## 19.1 全节点概述

# 全节点概述

本节介绍 Sui 全节点的架构、运行方式以及 RPC 端点。全节点是 Sui 网络的核心基础设施，为 dApp 提供数据查询、交易提交和事件订阅等服务。

## 什么是全节点

Sui 全节点存储完整的区块链状态，但不参与共识。它的主要职责是：

- 提供 JSON-RPC 和 GraphQL API
- 验证和转发交易
- 存储和索引链上数据
- 提供事件流订阅

```
┌─────────────────────────────────────────────┐
│             Sui 网络架构                      │
├─────────────────────────────────────────────┤
│                                               │
│  验证者（Validators）  ← 参与共识              │
│       │                                       │
│       ▼                                       │
│  全节点（Full Nodes）  ← 同步状态、提供 API    │
│       │                                       │
│       ▼                                       │
│  DApp / SDK / 浏览器   ← 查询数据、提交交易    │
│                                               │
└─────────────────────────────────────────────┘
```

## 公共 RPC 端点

| 网络 | RPC URL |
|------|---------|
| Mainnet | `https://fullnode.mainnet.sui.io:443` |
| Testnet | `https://fullnode.testnet.sui.io:443` |
| Devnet | `https://fullnode.devnet.sui.io:443` |
| Localnet | `http://127.0.0.1:9000` |

### 使用 SDK 连接

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';

const client = new SuiGrpcClient({
  network: 'mainnet',
  baseUrl: 'https://fullnode.mainnet.sui.io:443',
});

const chainId = await client.getChainIdentifier();
console.log('Chain ID:', chainId);
```

## 运行自己的全节点

### 硬件要求

| 资源 | 最低要求 | 推荐配置 |
|------|---------|---------|
| CPU | 8 核 | 16 核 |
| 内存 | 128 GB | 256 GB |
| 存储 | 4 TB NVMe SSD | 8 TB NVMe SSD |
| 网络 | 1 Gbps | 10 Gbps |

### 使用 Docker 运行

```bash
# 下载最新配置
curl -fLJ -o fullnode.yaml \
  https://github.com/MystenLabs/sui/raw/main/crates/sui-config/data/fullnode-template.yaml

# 下载创世纪文件
curl -fLJ -o genesis.blob \
  https://github.com/MystenLabs/sui-genesis/raw/main/mainnet/genesis.blob

# 启动全节点
docker run -d \
  --name sui-fullnode \
  -p 9000:9000 \
  -v $(pwd)/fullnode.yaml:/opt/sui/config/fullnode.yaml \
  -v $(pwd)/genesis.blob:/opt/sui/config/genesis.blob \
  -v $(pwd)/suidb:/opt/sui/db \
  mysten/sui-node:mainnet \
  /opt/sui/bin/sui-node --config-path /opt/sui/config/fullnode.yaml
```

## RPC 方法概览

### 对象查询

```typescript
// 查询单个对象
const obj = await client.core.getObject({
  objectId: '0x...',
  include: { content: true, owner: true, type: true },
});

// 批量查询对象
const objects = await client.core.getObjects({
  objectIds: ['0x...', '0x...'],
  include: { content: true },
});

// 查询拥有的对象
const owned = await client.core.listOwnedObjects({
  owner: '0x...',
  filter: { StructType: '0x...::hero::Hero' },
  include: { content: true },
});
```

### 交易查询

```typescript
// 查询交易详情
const tx = await client.core.getTransaction({
  digest: '...',
  include: {
    effects: true,
    transaction: true,
    events: true,
    balanceChanges: true,
  },
});

// 查询交易历史（具体 API 以当前 SDK 为准）
const txs = await client.queryTransactionBlocks({
  filter: { FromAddress: '0x...' },
  order: 'descending',
  limit: 10,
});
```

### 事件查询

```typescript
// 查询事件
const events = await client.queryEvents({
  query: {
    MoveEventType: `${PACKAGE_ID}::hero::HeroCreated`,
  },
  order: 'descending',
  limit: 50,
});

// 订阅事件（WebSocket）
const unsubscribe = await client.subscribeEvent({
  filter: {
    MoveEventType: `${PACKAGE_ID}::hero::HeroCreated`,
  },
  onMessage: (event) => {
    console.log('New event:', event);
  },
});
```

## 数据查询限制

### 公共节点限制

| 限制 | 值 |
|------|---|
| 请求频率 | 通常 100 req/s |
| 单次查询对象数 | 50 |
| 事件查询最大返回数 | 50 |
| WebSocket 连接 | 有限制 |

### 应对策略

| 问题 | 解决方案 |
|------|---------|
| 需要高频查询 | 运行自己的全节点 |
| 需要历史数据 | 使用自定义索引器 |
| 需要复杂查询 | 使用 GraphQL API |
| 需要实时推送 | 使用 gRPC 事件流 |

## 动态字段查询

```typescript
// 查询动态字段
const dynamicFields = await client.core.listDynamicFields({
  parentId: '0x...',
});

// 查询特定动态字段
const field = await client.core.getDynamicField({
  parentId: '0x...',
  name: {
    type: 'u64',
    value: '0',
  },
});
```

## Dry Run 交易

在提交前模拟交易执行：

```typescript
const tx = new Transaction();
// ... 构造交易

const dryRunResult = await client.core.simulateTransaction({
  transaction: await tx.build({ client }),
});

console.log('Status:', dryRunResult.effects.status);
console.log('Gas used:', dryRunResult.effects.gasUsed);
```

## 小结

- 全节点是 Sui 网络的基础设施层，提供 RPC、GraphQL 和事件流服务
- 公共 RPC 端点适合开发测试，生产环境建议运行自己的全节点
- RPC 提供对象、交易和事件的丰富查询接口
- 公共节点有速率限制，高级需求需要自定义索引器或自建节点
- Dry Run 可以在不消耗 gas 的情况下模拟交易执行


---


<!-- source: 16_infrastructure/custom-indexer.md -->
## 19.2 自定义索引器

# 自定义索引器

本节讲解为什么需要自定义索引器以及如何实现。索引器是连接链上数据和应用业务逻辑的桥梁，支持复杂查询、历史数据分析和实时数据处理。

## 为什么需要索引器

RPC 节点的查询能力有限：

| 需求 | RPC 能力 | 索引器能力 |
|------|---------|-----------|
| 查询某用户的所有交易 | 仅最近部分 | 完整历史 |
| 按属性过滤 NFT | 不支持 | 自定义索引 |
| 聚合统计 | 不支持 | SQL 查询 |
| 复杂关联查询 | 不支持 | JOIN 操作 |
| 实时通知 | WebSocket（有限） | 自定义推送 |

## 索引器架构

```
┌──────────────────────────────────────────────────┐
│                 索引器架构                          │
├──────────────────────────────────────────────────┤
│                                                    │
│  Sui 全节点                                        │
│       │                                            │
│       ├── RPC 轮询（queryEvents）                   │
│       └── gRPC 流（subscribeCheckpoints）           │
│            │                                       │
│       ┌────▼────┐                                  │
│       │ 索引器   │                                  │
│       │         │                                  │
│       │ ├ 事件过滤                                  │
│       │ ├ BCS 解码                                  │
│       │ ├ 数据转换                                  │
│       │ └ 写入数据库                                │
│       └────┬────┘                                  │
│            │                                       │
│       ┌────▼────┐                                  │
│       │ 数据库   │ (PostgreSQL / SQLite)            │
│       └────┬────┘                                  │
│            │                                       │
│       ┌────▼────┐                                  │
│       │ API 层   │ (REST / GraphQL)                │
│       └─────────┘                                  │
│                                                    │
└──────────────────────────────────────────────────┘
```

## JavaScript/TypeScript 索引器

### 项目结构

```
indexer-js/
├── prisma/
│   └── schema.prisma          # 数据库 schema
├── indexer/
│   └── event-indexer.ts       # 事件索引核心逻辑
├── handlers/
│   └── hero.ts                # 事件处理器
├── types/
│   └── HeroEvent.ts           # 事件类型定义
├── config.ts                  # 配置
├── db.ts                      # 数据库连接
├── sui-utils.ts               # Sui 工具函数
├── server.ts                  # API 服务器
├── docker-compose.yml         # PostgreSQL
└── package.json
```

### 配置文件

```typescript
// config.ts
export const CONFIG = {
  NETWORK: 'testnet' as const,
  CONTRACT: {
    packageId: process.env.PACKAGE_ID!,
    module: 'hero',
  },
  POLLING_INTERVAL_MS: 2000,
};
```

### 事件索引核心

```typescript
// indexer/event-indexer.ts
import { EventId, SuiEvent, SuiEventFilter } from '@mysten/sui/client';
import { SuiGrpcClient } from '@mysten/sui/grpc';

type SuiEventsCursor = EventId | null | undefined;

type EventTracker = {
  type: string;
  filter: SuiEventFilter;
  callback: (events: SuiEvent[], type: string) => Promise<void>;
};

const EVENTS_TO_TRACK: EventTracker[] = [
  {
    type: `${CONFIG.CONTRACT.packageId}::hero`,
    filter: {
      MoveEventModule: {
        module: 'hero',
        package: CONFIG.CONTRACT.packageId,
      },
    },
    callback: handleHeroEvents,
  },
];

async function executeEventJob(
  client: SuiGrpcClient,
  tracker: EventTracker,
  cursor: SuiEventsCursor,
) {
  const { data, hasNextPage, nextCursor } = await client.queryEvents({
    query: tracker.filter,
    cursor,
    order: 'ascending',
  });

  await tracker.callback(data, tracker.type);

  if (nextCursor && data.length > 0) {
    await saveLatestCursor(tracker, nextCursor);
    return { cursor: nextCursor, hasNextPage };
  }

  return { cursor, hasNextPage: false };
}

async function runEventJob(
  client: SuiGrpcClient,
  tracker: EventTracker,
  cursor: SuiEventsCursor,
) {
  const result = await executeEventJob(client, tracker, cursor);

  setTimeout(
    () => runEventJob(client, tracker, result.cursor),
    result.hasNextPage ? 0 : CONFIG.POLLING_INTERVAL_MS,
  );
}

export async function setupListeners() {
  const client = new SuiGrpcClient({
    network: CONFIG.NETWORK,
    baseUrl: CONFIG.NETWORK === 'mainnet'
      ? 'https://fullnode.mainnet.sui.io:443'
      : 'https://fullnode.testnet.sui.io:443',
  });
  for (const event of EVENTS_TO_TRACK) {
    const cursor = await getLatestCursor(event);
    runEventJob(client, event, cursor);
  }
}
```

### 事件处理器

```typescript
// handlers/hero.ts
import { SuiEvent } from '@mysten/sui/client';
import { prisma } from '../db';

export async function handleHeroEvents(events: SuiEvent[]) {
  for (const event of events) {
    const fields = event.parsedJson as {
      hero_id: string;
      name: string;
      stamina: string;
      creator: string;
    };

    await prisma.hero.upsert({
      where: { heroId: fields.hero_id },
      update: {
        name: fields.name,
        stamina: parseInt(fields.stamina),
      },
      create: {
        heroId: fields.hero_id,
        name: fields.name,
        stamina: parseInt(fields.stamina),
        creator: fields.creator,
        createdAt: new Date(parseInt(event.timestampMs!)),
      },
    });
  }
}
```

### 游标持久化

```typescript
// 保存游标到数据库，确保重启后能从上次位置继续
async function saveLatestCursor(
  tracker: EventTracker,
  cursor: EventId,
) {
  await prisma.cursor.upsert({
    where: { id: tracker.type },
    update: {
      eventSeq: cursor.eventSeq,
      txDigest: cursor.txDigest,
    },
    create: {
      id: tracker.type,
      eventSeq: cursor.eventSeq,
      txDigest: cursor.txDigest,
    },
  });
}

async function getLatestCursor(tracker: EventTracker) {
  return prisma.cursor.findUnique({
    where: { id: tracker.type },
  });
}
```

### 数据库 Schema（Prisma）

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Hero {
  id        Int      @id @default(autoincrement())
  heroId    String   @unique
  name      String
  stamina   Int
  creator   String
  createdAt DateTime
}

model Cursor {
  id       String @id
  eventSeq String
  txDigest String
}
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: hero_indexer
      POSTGRES_USER: indexer
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## API 服务

```typescript
// server.ts
import express from 'express';
import { prisma } from './db';

const app = express();

app.get('/heroes', async (req, res) => {
  const heroes = await prisma.hero.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json(heroes);
});

app.get('/heroes/:id', async (req, res) => {
  const hero = await prisma.hero.findUnique({
    where: { heroId: req.params.id },
  });
  res.json(hero);
});

app.get('/stats', async (req, res) => {
  const totalHeroes = await prisma.hero.count();
  const avgStamina = await prisma.hero.aggregate({
    _avg: { stamina: true },
  });
  res.json({ totalHeroes, avgStamina: avgStamina._avg.stamina });
});

app.listen(3000, () => console.log('API running on :3000'));
```

## 启动流程

```bash
# 1. 启动 PostgreSQL
docker-compose up -d

# 2. 初始化数据库
npx prisma migrate dev

# 3. 启动索引器
npm start

# 4. 启动 API（如果分开的话）
npm run serve
```

## 小结

- 自定义索引器弥补了 RPC 节点查询能力的不足
- 架构模式：事件捕获 → 数据处理 → 存储 → API 暴露
- 使用游标持久化确保索引器重启后能从上次位置继续
- 使用 Prisma + PostgreSQL 实现高效的数据存储和查询
- 轮询模式简单可靠，适合大部分场景
- 对实时性要求高的场景可以使用 gRPC 流（见下节）


---


<!-- source: 16_infrastructure/grpc-event-stream.md -->
## 19.3 gRPC 事件流

# gRPC 事件流

本节讲解如何使用 Sui 的 gRPC 服务实现实时事件订阅。相比 RPC 轮询，gRPC 提供更低延迟和更高效的数据推送能力。

## gRPC vs RPC 轮询

| 特性 | RPC 轮询 | gRPC 流 |
|------|---------|---------|
| 延迟 | 取决于轮询间隔 | 近实时 |
| 效率 | 大量空查询 | 只推送有数据的内容 |
| 连接方式 | HTTP 短连接 | 长连接流 |
| 数据格式 | JSON | Protocol Buffers |
| 适用场景 | 简单索引 | 实时索引、监控 |

## 合约准备：事件发射

gRPC 索引器消费的是链上事件。确保合约正确发射事件：

```move
module indexer_sample::indexer_sample;

use std::string::String;
use sui::event;

public struct UsersCounter has key {
    id: UID,
    count: u64,
}

/// 用户注册事件
public struct UserRegistered has copy, drop {
    owner: address,
    name: String,
    users_id: u64,
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(UsersCounter {
        id: object::new(ctx),
        count: 0,
    });
}

public fun register_user(
    name: String,
    counter: &mut UsersCounter,
    ctx: &mut TxContext,
) {
    counter.count = counter.count + 1;

    event::emit(UserRegistered {
        owner: ctx.sender(),
        name,
        users_id: counter.count,
    });
}
```

## TypeScript gRPC 客户端

### 安装依赖

```bash
npm install @mysten/sui
```

### Checkpoint 订阅

```typescript
import { SuiGRPCClient } from '@mysten/sui/client';

const GRPC_URL = 'https://grpc.testnet.sui.io:443';
const PACKAGE_ID = process.env.PACKAGE_ID!;
const MODULE_NAME = 'indexer_sample';

async function startIndexer() {
  const grpcClient = new SuiGRPCClient(GRPC_URL);

  const stream = grpcClient.subscriptionService.subscribeCheckpoints({
    readMask: {
      paths: ['transactions.events'],
    },
  });

  console.log('Subscribed to checkpoint stream...');

  for await (const checkpoint of stream) {
    for (const tx of checkpoint.transactions ?? []) {
      for (const event of tx.events ?? []) {
        processEvent(event);
      }
    }
  }
}
```

### 事件过滤与处理

```typescript
const FULL_EVENT_NAME = `${PACKAGE_ID}::${MODULE_NAME}::UserRegistered`;

function processEvent(event: any) {
  if (event.eventType !== FULL_EVENT_NAME) return;

  const decoded = decodeEventData(event.bcs);
  console.log('Event Data:', decoded);

  // 写入数据库或触发业务逻辑
  saveToDatabase(decoded);
}
```

### BCS 解码

事件数据使用 BCS（Binary Canonical Serialization）编码。解码时结构必须精确匹配 Move 的 struct 定义：

```typescript
import { bcs } from '@mysten/bcs';
import { fromBase64 } from '@mysten/bcs';

const USER_REGISTERED_EVENT_BCS = bcs.struct('UserRegistered', {
  owner: bcs.Address,
  name: bcs.string(),
  users_id: bcs.u64(),
});

function decodeEventData(bcsData: string) {
  const bytes = fromBase64(bcsData);
  return USER_REGISTERED_EVENT_BCS.parse(bytes);
}

// 解码结果示例：
// {
//   owner: '0x1234...abcd',
//   name: 'Alice',
//   users_id: '1'
// }
```

## 完整索引器实现

```typescript
import { SuiGRPCClient } from '@mysten/sui/client';
import { bcs, fromBase64 } from '@mysten/bcs';

const GRPC_URL = process.env.GRPC_URL || 'https://grpc.testnet.sui.io:443';
const PACKAGE_ID = process.env.PACKAGE_ID!;
const MODULE_NAME = process.env.MODULE_NAME || 'indexer_sample';
const FULL_EVENT_NAME = `${PACKAGE_ID}::${MODULE_NAME}::UserRegistered`;

const UserRegisteredBCS = bcs.struct('UserRegistered', {
  owner: bcs.Address,
  name: bcs.string(),
  users_id: bcs.u64(),
});

async function main() {
  const grpcClient = new SuiGRPCClient(GRPC_URL);

  console.log(`Starting indexer for package: ${PACKAGE_ID}`);
  console.log(`Listening for event: ${FULL_EVENT_NAME}`);

  const stream = grpcClient.subscriptionService.subscribeCheckpoints({
    readMask: {
      paths: ['transactions.events'],
    },
  });

  console.log('Subscribed to checkpoint stream...');

  for await (const checkpoint of stream) {
    const checkpointSeq = checkpoint.sequenceNumber;

    for (const tx of checkpoint.transactions ?? []) {
      for (const event of tx.events ?? []) {
        if (event.eventType === FULL_EVENT_NAME) {
          try {
            const decoded = UserRegisteredBCS.parse(
              fromBase64(event.bcs)
            );

            console.log(`[Checkpoint ${checkpointSeq}] New user registered:`);
            console.log(`  Owner: ${decoded.owner}`);
            console.log(`  Name: ${decoded.name}`);
            console.log(`  User ID: ${decoded.users_id}`);

            // 在这里写入数据库
            await saveUser(decoded);
          } catch (err) {
            console.error('Failed to decode event:', err);
          }
        }
      }
    }
  }
}

async function saveUser(data: { owner: string; name: string; users_id: string }) {
  // 写入数据库的逻辑
  console.log('Saved user to database:', data.name);
}

main().catch(console.error);
```

## 错误处理与重连

```typescript
async function startWithRetry(maxRetries = 5) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await main();
    } catch (error) {
      retries++;
      const delay = Math.min(1000 * Math.pow(2, retries), 30000);
      console.error(`Connection lost. Retry ${retries}/${maxRetries} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  console.error('Max retries reached. Exiting.');
  process.exit(1);
}

startWithRetry();
```

## 事件重放

gRPC 支持从指定 checkpoint 开始重放事件，用于：

- 索引器重启后恢复
- 回填历史数据
- 调试和测试

```typescript
const stream = grpcClient.subscriptionService.subscribeCheckpoints({
  startCheckpoint: lastProcessedCheckpoint + 1n, // 从上次处理的下一个开始
  readMask: {
    paths: ['transactions.events'],
  },
});
```

## 测试集成

```typescript
// tests/registerUser.test.ts
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Transaction } from '@mysten/sui/transactions';

test('should successfully register a new user', async () => {
  const client = new SuiGrpcClient({
    network: 'testnet',
    baseUrl: 'https://fullnode.testnet.sui.io:443',
  });
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::register_user`,
    arguments: [
      tx.pure.string('Alice'),
      tx.object(USERS_COUNTER_OBJECT_ID),
    ],
  });

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  if (result.$kind === 'FailedTransaction') {
    throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction failed');
  }
  await client.waitForTransaction({ digest: result.Transaction.digest });

  expect(result.Transaction.digest).toBeDefined();
});
```

## 小结

- gRPC 提供低延迟的实时事件流，适合需要即时响应的索引器
- 使用 `subscribeCheckpoints` 订阅 checkpoint 流并过滤事件
- BCS 解码是处理事件数据的关键，结构必须与 Move struct 精确匹配
- 实现断线重连和指数退避，确保索引器的高可用性
- 支持从指定 checkpoint 重放，用于恢复和回填数据
- 持久化最后处理的 checkpoint 序号，确保重启不丢数据


---


<!-- source: 16_infrastructure/graphql-api.md -->
## 19.4 GraphQL API

# GraphQL API

本节介绍 Sui 的 GraphQL API。GraphQL 提供了比 JSON-RPC 更灵活的查询能力，支持精确的字段选择、嵌套查询和强类型系统，适合构建复杂的数据查询场景。

## 端点

| 网络 | GraphQL 端点 |
|------|-------------|
| Mainnet | `https://sui-mainnet.mystenlabs.com/graphql` |
| Testnet | `https://sui-testnet.mystenlabs.com/graphql` |

GraphQL IDE（交互式查询工具）可通过浏览器直接访问上述 URL。

## 基础查询

### 查询链信息

```graphql
query {
  chainIdentifier
  epoch {
    epochId
    startTimestamp
    endTimestamp
    referenceGasPrice
  }
}
```

### 查询对象

```graphql
query GetObject {
  object(address: "0x...") {
    objectId
    version
    digest
    owner {
      ... on AddressOwner {
        owner {
          address
        }
      }
      ... on Shared {
        initialSharedVersion
      }
    }
    asMoveObject {
      contents {
        type { repr }
        json
      }
    }
  }
}
```

### 查询地址拥有的对象

```graphql
query OwnedObjects {
  address(address: "0x...") {
    objects(
      filter: { type: "0xPACKAGE::hero::Hero" }
      first: 10
    ) {
      nodes {
        objectId
        asMoveObject {
          contents {
            json
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
```

## 交易查询

### 查询交易详情

```graphql
query GetTransaction {
  transactionBlock(digest: "...") {
    digest
    sender {
      address
    }
    effects {
      status
      gasEffects {
        gasSummary {
          computationCost
          storageCost
          storageRebate
        }
      }
      objectChanges {
        nodes {
          outputState {
            objectId
            asMoveObject {
              contents { json }
            }
          }
        }
      }
    }
  }
}
```

### 查询地址的交易历史

```graphql
query TransactionHistory {
  address(address: "0x...") {
    transactionBlocks(
      first: 20
      scanLimit: 100
      filter: {}
    ) {
      nodes {
        digest
        effects {
          status
          timestamp
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
```

## 事件查询

```graphql
query Events {
  events(
    filter: {
      eventType: "0xPACKAGE::hero::HeroCreated"
    }
    first: 20
  ) {
    nodes {
      sendingModule {
        name
        package { address }
      }
      type { repr }
      json
      timestamp
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## 分页

GraphQL API 使用基于游标的分页：

```graphql
# 第一页
query FirstPage {
  objects(
    filter: { type: "0xPACKAGE::hero::Hero" }
    first: 10
  ) {
    nodes {
      objectId
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

# 下一页：使用上一页的 endCursor
query NextPage {
  objects(
    filter: { type: "0xPACKAGE::hero::Hero" }
    first: 10
    after: "eyJj..."  # endCursor from previous page
  ) {
    nodes {
      objectId
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## TypeScript 客户端

### 使用 fetch 调用

```typescript
const GRAPHQL_URL = 'https://sui-testnet.mystenlabs.com/graphql';

async function queryGraphQL(query: string, variables?: Record<string, any>) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  return result.data;
}

// 使用示例
const data = await queryGraphQL(`
  query GetHeroes($owner: SuiAddress!) {
    address(address: $owner) {
      objects(filter: { type: "0xPACKAGE::hero::Hero" }, first: 10) {
        nodes {
          objectId
          asMoveObject {
            contents { json }
          }
        }
      }
    }
  }
`, { owner: '0x...' });
```

### 使用 graphql-request 库

```typescript
import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient(GRAPHQL_URL);

const query = gql`
  query GetObject($id: SuiAddress!) {
    object(address: $id) {
      objectId
      version
      asMoveObject {
        contents {
          type { repr }
          json
        }
      }
    }
  }
`;

const data = await client.request(query, { id: '0x...' });
```

## 动态字段查询

```graphql
query DynamicFields {
  object(address: "0x...") {
    dynamicFields(first: 10) {
      nodes {
        name {
          json
        }
        value {
          ... on MoveValue {
            json
          }
          ... on MoveObject {
            contents {
              json
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
```

## GraphQL vs JSON-RPC

| 方面 | GraphQL | JSON-RPC |
|------|---------|----------|
| 字段选择 | 精确请求需要的字段 | 返回预定义的字段集 |
| 嵌套查询 | 一次请求获取关联数据 | 可能需要多次请求 |
| 类型系统 | 强类型 schema | 文档型 |
| 分页 | 游标分页 | limit/offset |
| 过滤 | 丰富的过滤参数 | 有限的过滤选项 |
| 工具支持 | GraphQL IDE、代码生成 | Postman 等通用工具 |

## 小结

- Sui GraphQL API 提供比 JSON-RPC 更灵活的查询能力
- 使用精确的字段选择减少网络传输和解析开销
- 游标分页适合处理大量数据
- 嵌套查询可以在单次请求中获取关联数据
- GraphQL IDE 是探索和调试查询的好工具
- 适合构建需要复杂查询的应用前端和后端服务


---


<!-- source: 16_infrastructure/monitoring.md -->
## 19.5 Prometheus 与 Grafana 监控

# Prometheus 与 Grafana 监控

本节讲解如何使用 Prometheus 和 Grafana 监控 Sui dApp 的后端服务。我们以 NFT 铸造 API 为例，展示指标采集、仪表板搭建和告警配置的完整流程。

## 监控架构

```
┌─────────────────────────────────────────────────┐
│              监控架构                             │
├─────────────────────────────────────────────────┤
│                                                   │
│  用户 ──► REST API ──► Sui 区块链                  │
│               │                                   │
│               │ /metrics（暴露指标）                │
│               ▼                                   │
│          Prometheus（采集指标）                     │
│               │                                   │
│               ▼                                   │
│           Grafana（可视化 + 告警）                  │
│                                                   │
└─────────────────────────────────────────────────┘
```

## 场景：NFT 空投 API

假设我们有一个 NFT 空投服务：

- NFT 不预先铸造，按需铸造
- 用户不支付 gas 费
- 只有管理员地址可以铸造
- 需要支持并发请求

## 定义指标

### Node.js + prom-client

```typescript
// src/metrics.ts
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

export const register = new Registry();

// 请求总数
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// 铸造请求计数
export const mintRequestsTotal = new Counter({
  name: 'mint_requests_total',
  help: 'Total number of mint requests',
  labelNames: ['status'],
  registers: [register],
});

// 请求响应时间
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
  registers: [register],
});

// 队列中的待处理请求
export const pendingRequests = new Gauge({
  name: 'pending_mint_requests',
  help: 'Number of mint requests currently being processed',
  registers: [register],
});
```

### Express API 集成

```typescript
// src/index.ts
import express from 'express';
import { register, httpRequestsTotal, httpRequestDuration, mintRequestsTotal, pendingRequests } from './metrics';
import { mintHero } from './helpers/mintHero';

const app = express();
app.use(express.json());

// 指标端点
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// 健康检查
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// 铸造端点
app.post('/mint', async (req, res) => {
  const end = httpRequestDuration.startTimer({ method: 'POST', route: '/mint' });
  pendingRequests.inc();

  try {
    const { recipient } = req.body;
    const result = await mintHero(recipient);

    mintRequestsTotal.inc({ status: 'success' });
    httpRequestsTotal.inc({ method: 'POST', route: '/mint', status: '200' });
    res.json({ success: true, digest: result.digest });
  } catch (error) {
    mintRequestsTotal.inc({ status: 'error' });
    httpRequestsTotal.inc({ method: 'POST', route: '/mint', status: '500' });
    res.status(500).json({ success: false, error: String(error) });
  } finally {
    pendingRequests.dec();
    end();
  }
});

app.listen(8000, () => {
  console.log('API running on http://localhost:8000');
  console.log('Metrics at http://localhost:8000/metrics');
});
```

### 铸造辅助函数

```typescript
// src/helpers/mintHero.ts
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Transaction } from '@mysten/sui/transactions';
import { getAdminSigner } from './getAdminSigner';

const client = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});

export async function mintHero(recipient: string) {
  const signer = getAdminSigner();
  const tx = new Transaction();

  tx.moveCall({
    target: `${process.env.PACKAGE_ID}::hero::new_hero`,
    arguments: [
      tx.pure.string('Airdrop Hero'),
      tx.pure.u64(100),
      tx.object(process.env.REGISTRY_ID!),
    ],
  });

  tx.transferObjects(
    [tx.object(/* hero result */)],
    tx.pure.address(recipient),
  );

  return client.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: { showEffects: true },
  });
}
```

## Prometheus 配置

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'mint-api'
    static_configs:
      - targets: ['host.docker.internal:8000']
    metrics_path: '/metrics'
    scrape_interval: 5s
```

## Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    extra_hosts:
      - 'host.docker.internal:host-gateway'

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3001:3000'
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    depends_on:
      - prometheus
```

## 启动监控栈

```bash
# 1. 启动 API
cd api
npm install
npm run dev

# 2. 启动 Prometheus + Grafana
docker-compose up -d

# 3. 验证
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001 (admin/admin)
```

## Grafana 仪表板配置

### 添加数据源

1. 访问 Grafana → Connections → Data Sources
2. 选择 Prometheus
3. URL: `http://prometheus:9090`
4. 点击 Save & Test

### 常用面板查询

**请求速率（QPS）**：
```promql
rate(http_requests_total[5m])
```

**铸造成功率**：
```promql
rate(mint_requests_total{status="success"}[5m])
/ rate(mint_requests_total[5m])
```

**平均响应时间**：
```promql
rate(http_request_duration_seconds_sum[5m])
/ rate(http_request_duration_seconds_count[5m])
```

**P95 响应时间**：
```promql
histogram_quantile(0.95,
  rate(http_request_duration_seconds_bucket[5m])
)
```

**错误率**：
```promql
rate(mint_requests_total{status="error"}[5m])
/ rate(mint_requests_total[5m])
```

**当前待处理请求**：
```promql
pending_mint_requests
```

## 告警配置

### Grafana 告警规则

在每个面板上可以配置告警规则：

| 告警 | 条件 | 持续时间 |
|------|------|---------|
| 高错误率 | 错误率 > 10% | 1 分钟 |
| 慢响应 | 平均响应时间 > 5s | 2 分钟 |
| 队列堆积 | 待处理请求 > 50 | 30 秒 |
| 服务宕机 | 无数据 | 1 分钟 |

### Prometheus 告警规则

```yaml
# alert-rules.yml
groups:
  - name: mint-api-alerts
    rules:
      - alert: HighErrorRate
        expr: |
          rate(mint_requests_total{status="error"}[5m])
          / rate(mint_requests_total[5m]) > 0.1
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: 'Mint API error rate is above 10%'

      - alert: SlowResponses
        expr: |
          histogram_quantile(0.95,
            rate(http_request_duration_seconds_bucket[5m])
          ) > 5
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: 'P95 response time is above 5 seconds'
```

## 压力测试

```bash
#!/bin/bash
# mint.sh - 模拟 50 个并发请求
for i in $(seq 1 50); do
  curl -s -X POST http://localhost:8000/mint \
    -H "Content-Type: application/json" \
    -d "{\"recipient\": \"0x$(printf '%064x' $i)\"}" &
done
wait
echo "All requests completed"
```

## 小结

- 使用 `prom-client` 在 Node.js 应用中定义和暴露 Prometheus 指标
- 常用指标类型：Counter（计数）、Histogram（分布）、Gauge（当前值）
- Prometheus 定期抓取 `/metrics` 端点采集数据
- Grafana 提供强大的可视化和告警能力
- 关注关键指标：QPS、错误率、响应时间分布、队列深度
- 配置合理的告警阈值和持续时间，避免误报
- 使用 Docker Compose 快速搭建完整的监控栈


---


<!-- source: 17_advanced_topics/index.md -->
## 第二十章 · 前沿技术

# 第二十章 · 前沿技术

本章介绍 Sui 生态中的前沿技术和创新协议，这些技术正在拓展区块链应用的边界。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 17.1 | ZKLogin | 零知识证明 + OAuth 登录，无需私钥 |
| 17.2 | 多签（Multisig） | 多签地址、权重、联合签名 |
| 17.3 | Nautilus | TEE 可信执行环境、链上链下交互 |
| 17.4 | Seal | 去中心化密钥管理、访问策略加密 |
| 17.5 | DeepBook | 链上中央限价订单簿（CLOB） |
| 17.6 | Walrus | 去中心化 Blob 存储、与合约集成 |
| 17.7 | MVR | Move 包注册中心、人类可读的依赖管理 |
| 17.8 | Sui Dev Skills | AI 辅助开发技能包、Claude 技能安装与组合 |

## 学习目标

读完本章后，你将能够：

- 理解 ZKLogin 的原理并集成到 DApp 中
- 使用 Seal 实现链上访问控制的加密数据
- 使用 MVR 管理 Move 包依赖
- 安装和组合 Sui Dev Skills，让 AI 遵循 Sui 开发规范


---


<!-- source: 17_advanced_topics/zklogin.md -->
## 20.1 ZKLogin — 零知识登录

# ZKLogin 零知识登录

本节讲解 Sui 的 ZKLogin 认证机制。ZKLogin 允许用户通过熟悉的 OAuth 提供商（Google、Facebook 等）登录，同时通过零知识证明保护隐私。用户无需管理助记词或私钥即可拥有链上地址。

## ZKLogin 原理

### 核心思想

ZKLogin 将 OAuth 身份（如 Google 账号）映射到一个 Sui 地址，无需暴露用户的 OAuth 身份信息：

```
┌──────────────────────────────────────────────┐
│              ZKLogin 流程                      │
├──────────────────────────────────────────────┤
│                                                │
│  用户 ──► OAuth 登录 ──► JWT Token              │
│                              │                 │
│                              ▼                 │
│                     临时密钥对 + JWT            │
│                              │                 │
│                              ▼                 │
│                     零知识证明（ZKP）            │
│                              │                 │
│                              ▼                 │
│                     Sui 地址（确定性派生）       │
│                              │                 │
│                              ▼                 │
│                     签名并发送交易              │
│                                                │
└──────────────────────────────────────────────┘
```

### 关键特性

- **无助记词**：用 Google/Facebook 账号即可登录
- **隐私保护**：零知识证明确保链上不暴露 OAuth 身份
- **确定性地址**：同一个 OAuth 账号始终映射到同一个 Sui 地址
- **兼容性**：与所有 Sui 功能完全兼容

## 四步实现流程

### 第一步：生成临时密钥对和配置

```typescript
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/sui/zklogin';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const suiClient = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});

// 生成临时密钥对
const ephemeralKeypair = new Ed25519Keypair();

// 获取当前 epoch
const { epoch } = await suiClient.getLatestSuiSystemState();
const maxEpoch = Number(epoch) + 2; // 临时密钥有效期

// 生成随机数
const randomness = generateRandomness();

// 计算 nonce（用于 OAuth）
const nonce = generateNonce(
  ephemeralKeypair.getPublicKey(),
  maxEpoch,
  randomness,
);
```

### 第二步：OAuth 认证

```typescript
// 构造 OAuth URL（以 Google 为例）
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID!;
const REDIRECT_URI = 'http://localhost:5173/callback';

const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
oauthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
oauthUrl.searchParams.set('redirect_uri', REDIRECT_URI);
oauthUrl.searchParams.set('response_type', 'id_token');
oauthUrl.searchParams.set('scope', 'openid email');
oauthUrl.searchParams.set('nonce', nonce);

// 将用户重定向到 OAuth 页面
window.location.href = oauthUrl.toString();
```

回调处理：

```typescript
// 从 URL hash 中获取 JWT
const hash = window.location.hash.substring(1);
const params = new URLSearchParams(hash);
const jwtToken = params.get('id_token')!;

// 解码 JWT（不验证签名，仅读取内容）
import { jwtDecode } from 'jwt-decode';
const decodedJwt = jwtDecode(jwtToken);
```

### 第三步：生成零知识证明

```typescript
import { getZkLoginSignature } from '@mysten/sui/zklogin';

// 准备证明请求负载
const zkProofPayload = {
  jwt: jwtToken,
  extendedEphemeralPublicKey: ephemeralKeypair.getPublicKey().toBase64(),
  maxEpoch: maxEpoch,
  jwtRandomness: randomness,
  salt: userSalt, // 用户特定的盐值
  keyClaimName: 'sub',
};

// 向证明服务请求 ZKP
const zkProofResponse = await fetch('https://prover.mystenlabs.com/v1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(zkProofPayload),
});

const zkProof = await zkProofResponse.json();
```

### 第四步：创建钱包并发送交易

```typescript
import { computeZkLoginAddress, getZkLoginSignature } from '@mysten/sui/zklogin';

// 派生 Sui 地址
const zkLoginAddress = computeZkLoginAddress({
  claimName: 'sub',
  claimValue: decodedJwt.sub!,
  iss: decodedJwt.iss!,
  aud: GOOGLE_CLIENT_ID,
  userSalt: BigInt(userSalt),
});

console.log('ZKLogin Address:', zkLoginAddress);

// 构造并签名交易
const tx = new Transaction();
tx.setSender(zkLoginAddress);
// ... 添加交易命令

const { bytes, signature: ephSignature } = await tx.sign({
  client: suiClient,
  signer: ephemeralKeypair,
});

// 组合 ZKLogin 签名
const zkLoginSignature = getZkLoginSignature({
  inputs: {
    ...zkProof,
    addressSeed: addressSeed.toString(),
  },
  maxEpoch,
  userSignature: ephSignature,
});

// 执行交易
const result = await suiClient.core.executeTransaction({
  transaction: bytes,
  signatures: [zkLoginSignature],
});

if (result.$kind === 'FailedTransaction') {
  throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction failed');
}
await suiClient.waitForTransaction({ digest: result.Transaction.digest });
```

## React 组件示例

### ZKLogin 上下文

```typescript
// src/contexts/AppContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

interface AppState {
  ephemeralKeypair: Ed25519Keypair | null;
  jwt: string | null;
  zkProof: any | null;
  zkAddress: string | null;
  maxEpoch: number;
  randomness: string;
}

const AppContext = createContext<{
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    ephemeralKeypair: null,
    jwt: null,
    zkProof: null,
    zkAddress: null,
    maxEpoch: 0,
    randomness: '',
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
};
```

### 登录按钮组件

```typescript
// src/components/ZkLogin/LoginButton.tsx
import { useAppState } from '../../contexts/AppContext';

export function LoginButton() {
  const { state } = useAppState();

  const handleLogin = () => {
    if (!state.ephemeralKeypair) {
      alert('请先生成临时密钥对');
      return;
    }
    // 重定向到 OAuth
    window.location.href = buildOAuthUrl(state);
  };

  return (
    <button onClick={handleLogin} disabled={!state.ephemeralKeypair}>
      使用 Google 登录
    </button>
  );
}
```

## 环境配置

```bash
# .env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_SUI_NETWORK=testnet
VITE_PROVER_URL=https://prover.mystenlabs.com/v1
```

### Google Cloud 配置

1. 创建 Google Cloud 项目
2. 启用 OAuth 2.0 API
3. 配置 OAuth 同意屏幕
4. 创建 OAuth 客户端 ID（Web 应用类型）
5. 添加授权重定向 URI

## 安全注意事项

| 要点 | 说明 |
|------|------|
| 盐值管理 | 用户盐值必须持久存储，丢失则无法恢复地址 |
| 临时密钥有效期 | 建议 2-3 个 epoch，过期需重新认证 |
| JWT 验证 | 虽然 ZKP 已验证，前端仍应基本检查 JWT |
| HTTPS | OAuth 回调必须使用 HTTPS（本地开发除外） |
| 证明服务 | 使用 Mysten Labs 提供的证明服务或自建 |

## 小结

- ZKLogin 让用户通过 OAuth 登录直接获得 Sui 链上地址
- 四步流程：生成临时密钥 → OAuth 认证 → 生成 ZKP → 签名交易
- 零知识证明确保链上不暴露用户的 OAuth 身份信息
- 同一 OAuth 账号 + 盐值始终派生出同一个 Sui 地址
- 适合面向普通用户的 dApp，降低 Web3 入门门槛
- 妥善管理盐值——丢失盐值意味着无法访问对应的链上资产


---


<!-- source: 17_advanced_topics/multisig.md -->
## 20.2 多签（Multisig）

# 多签（Multisig）

本节讲解 Sui 上的多重签名（Multisig）机制。多签允许多个密钥共同控制一个地址，通过设置权重和阈值来实现灵活的资产管理和权限控制。

## 多签概述

多签地址由多个公钥和一个阈值（threshold）定义。只有当签名的权重之和达到或超过阈值时，交易才会被执行。

```
┌────────────────────────────────────────────┐
│            多签 2-of-3 示例                  │
├────────────────────────────────────────────┤
│                                              │
│  密钥 A（权重 1）  ──┐                        │
│  密钥 B（权重 1）  ──┼── 阈值 = 2 ──► 执行    │
│  密钥 C（权重 1）  ──┘                        │
│                                              │
│  任意 2 个密钥签名即可执行交易                  │
│                                              │
└────────────────────────────────────────────┘
```

## 创建多签地址

### 使用 CLI 创建

```bash
# 生成三个密钥对
sui keytool generate ed25519
sui keytool generate ed25519
sui keytool generate ed25519

# 获取公钥
sui keytool list

# 创建多签地址（阈值=2，三个公钥各权重1）
sui keytool multi-sig-address \
  --pks <PK_A> <PK_B> <PK_C> \
  --weights 1 1 1 \
  --threshold 2
```

### 使用 TypeScript SDK

```typescript
import { MultiSigPublicKey } from '@mysten/sui/multisig';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// 创建三个密钥对
const keypairA = new Ed25519Keypair();
const keypairB = new Ed25519Keypair();
const keypairC = new Ed25519Keypair();

// 创建多签公钥
const multiSigPublicKey = MultiSigPublicKey.fromPublicKeys({
  threshold: 2,
  publicKeys: [
    { publicKey: keypairA.getPublicKey(), weight: 1 },
    { publicKey: keypairB.getPublicKey(), weight: 1 },
    { publicKey: keypairC.getPublicKey(), weight: 1 },
  ],
});

// 获取多签地址
const multiSigAddress = multiSigPublicKey.toSuiAddress();
console.log('MultiSig Address:', multiSigAddress);
```

## 权重设置策略

### 等权模式

```typescript
// 3-of-5 等权多签
const multiSig = MultiSigPublicKey.fromPublicKeys({
  threshold: 3,
  publicKeys: [
    { publicKey: pk1, weight: 1 },
    { publicKey: pk2, weight: 1 },
    { publicKey: pk3, weight: 1 },
    { publicKey: pk4, weight: 1 },
    { publicKey: pk5, weight: 1 },
  ],
});
```

### 加权模式

```typescript
// 加权多签：CEO 有更高权重
const multiSig = MultiSigPublicKey.fromPublicKeys({
  threshold: 3,
  publicKeys: [
    { publicKey: ceoPk, weight: 2 },    // CEO: 权重 2
    { publicKey: ctoPk, weight: 1 },    // CTO: 权重 1
    { publicKey: cfoPk, weight: 1 },    // CFO: 权重 1
    { publicKey: cooFk, weight: 1 },    // COO: 权重 1
  ],
});
// CEO + 任意一人 = 3 ≥ 阈值
// 或 CTO + CFO + COO = 3 ≥ 阈值
```

## 交易签名与执行

### 构造交易

```typescript
import { Transaction } from '@mysten/sui/transactions';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const client = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const tx = new Transaction();
tx.setSender(multiSigAddress);
tx.setGasOwner(multiSigAddress);

// 添加交易命令
tx.transferObjects(
  [tx.object('0x...')],
  tx.pure.address('0x...')
);

// 构建交易字节
const txBytes = await tx.build({ client });
```

### 收集签名

```typescript
// 签名者 A 签名
const sigA = await keypairA.signTransaction(txBytes);

// 签名者 B 签名
const sigB = await keypairB.signTransaction(txBytes);
```

### 组合并执行

```typescript
// 组合多签签名
const multiSigSignature = multiSigPublicKey.combinePartialSignatures([
  sigA.signature,
  sigB.signature,
]);

// 执行交易
const result = await client.core.executeTransaction({
  transaction: txBytes,
  signatures: [multiSigSignature],
  include: { effects: true },
});

if (result.$kind === 'FailedTransaction') {
  throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction failed');
}
await client.waitForTransaction({ digest: result.Transaction.digest });
```

## 使用 CLI 签名

```bash
# 各方分别签名
sui keytool sign \
  --address <SIGNER_A_ADDRESS> \
  --data <TX_BYTES_BASE64>

sui keytool sign \
  --address <SIGNER_B_ADDRESS> \
  --data <TX_BYTES_BASE64>

# 组合多签
sui keytool multi-sig-combine-partial-sig \
  --pks <PK_A> <PK_B> <PK_C> \
  --weights 1 1 1 \
  --threshold 2 \
  --sigs <SIG_A> <SIG_B>

# 执行交易
sui client execute-signed-tx \
  --tx-bytes <TX_BYTES_BASE64> \
  --signatures <MULTI_SIG>
```

## 多签管理 UpgradeCap

多签是管理包升级权限的理想方式：

```typescript
// 将 UpgradeCap 转移到多签地址
const tx = new Transaction();
tx.transferObjects(
  [tx.object(UPGRADE_CAP_ID)],
  tx.pure.address(multiSigAddress),
);

// 后续升级需要多签授权
async function upgradeWithMultisig() {
  const upgradeTx = new Transaction();
  upgradeTx.setSender(multiSigAddress);
  // ... 升级逻辑

  const txBytes = await upgradeTx.build({ client });

  // 收集足够的签名
  const sig1 = await keypairA.signTransaction(txBytes);
  const sig2 = await keypairB.signTransaction(txBytes);

  const multiSig = multiSigPublicKey.combinePartialSignatures([
    sig1.signature,
    sig2.signature,
  ]);

  const result = await client.core.executeTransaction({
    transaction: txBytes,
    signatures: [multiSig],
  });
  if (result.$kind === 'FailedTransaction') {
    throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction failed');
  }
  await client.waitForTransaction({ digest: result.Transaction.digest });
  return result;
}
```

## 应用场景

| 场景 | 推荐配置 | 说明 |
|------|---------|------|
| 团队金库 | 3-of-5 等权 | 任意三人授权资金移动 |
| 包升级 | 2-of-3 等权 | 防止单点失败 |
| DAO 治理 | 加权投票 | 按持股比例分配权重 |
| 冷存储 | 2-of-3 不同设备 | 一个密钥离线存储 |
| 紧急操作 | CEO 高权重 | CEO 可快速响应 |

## 小结

- 多签通过多个密钥的组合签名来控制地址，提高安全性
- 权重和阈值机制支持灵活的签名策略
- 支持 Ed25519、Secp256k1 和 Secp256r1 多种密钥类型混合
- 多签特别适合管理 UpgradeCap、金库和关键权限
- 使用 CLI 或 TypeScript SDK 都可以创建和管理多签
- 交易签名可以异步收集，适合分布式团队


---


<!-- source: 17_advanced_topics/nautilus.md -->
## 20.3 Nautilus — TEE 可信计算

# Nautilus TEE 可信计算

本节讲解 Nautilus——一个在 Sui 上实现安全、可验证的链下计算框架。Nautilus 利用可信执行环境（TEE）将复杂计算移到链下执行，同时通过链上合约验证计算结果的真实性。

## Nautilus 解决的问题

```
┌──────────────────────────────────────────────┐
│              计算模式对比                       │
├──────────────────────────────────────────────┤
│                                                │
│  链上计算：                                     │
│  ✓ 去信任、可验证                               │
│  ✗ 昂贵（gas 费用）                             │
│  ✗ 公开（无隐私）                               │
│  ✗ 计算能力有限                                 │
│                                                │
│  传统链下计算：                                  │
│  ✓ 便宜、快速                                   │
│  ✓ 可保护隐私                                   │
│  ✗ 需要信任运营者                               │
│  ✗ 无可验证性保证                               │
│                                                │
│  Nautilus（TEE）：                               │
│  ✓ 便宜、快速                                   │
│  ✓ 隐私保护（隔离内存）                          │
│  ✓ 密码学可验证                                 │
│  ✓ 去信任（验证而非信任）                        │
│                                                │
└──────────────────────────────────────────────┘
```

## 核心概念

### 可信执行环境（TEE）

TEE 是处理器内的安全区域，保证加载其中的代码和数据在机密性和完整性方面受到保护：

1. **执行隔离**：代码在受保护内存中运行，即使主机操作系统也无法访问
2. **身份证明**：可以生成密码学证明来证明正在运行的代码
3. **秘密保护**：私钥和敏感数据永远不会离开 enclave

### PCR（平台配置寄存器）

PCR 是 SHA-384 哈希值，唯一标识 enclave 的代码和配置：

| PCR | 测量内容 | 变化条件 |
|-----|---------|---------|
| **PCR0** | 操作系统和启动环境 | Enclave 镜像或内核变化 |
| **PCR1** | 应用程序代码 | 任何代码更改 |
| **PCR2** | 运行时配置 | `run.sh` 或流量规则变化 |

任何组件的单字节变化都会导致 PCR 改变，使链上合约能验证 enclave 运行的代码。

### 证明文档（Attestation Document）

AWS 签发的密码学证明，包含：
- enclave 运行在真实的 AWS Nitro 硬件上
- 运行代码的 PCR 值
- enclave 的公钥
- 时间戳

## 架构设计

### 完整数据流

```
用户                 Enclave (TEE)           Sui 区块链
 │                      │                      │
 │  1. 请求处理          │                      │
 │─────────────────────►│                      │
 │                      │ 2. TEE 内处理         │
 │                      │   - 获取外部数据       │
 │                      │   - 签名响应           │
 │  3. 签名的响应        │                      │
 │◄─────────────────────│                      │
 │                      │                      │
 │  4. 提交交易（附带 enclave、签名、数据）      │
 │─────────────────────────────────────────────►│
 │                      │                      │
 │                      │     5. 验证签名        │
 │                      │     6. 执行应用逻辑    │
 │  7. 交易结果          │                      │
 │◄─────────────────────────────────────────────│
```

### Enclave 端点

每个 Nautilus enclave 暴露三个 HTTP 端点：

| 端点 | 用途 |
|------|------|
| `GET /health_check` | 验证 enclave 可访问外部域名 |
| `GET /get_attestation` | 获取签名的证明文档（链上注册时使用） |
| `POST /process_data` | 执行自定义应用逻辑（开发者实现） |

## Move 合约示例

### 天气预言机

```move
module weather::weather;

use nautilus::enclave::Enclave;

const WEATHER_INTENT: u8 = 0;
const EInvalidSignature: u64 = 0;

/// 天气响应数据（必须与 Rust 端 BCS 序列化完全匹配）
public struct WeatherResponse has drop {
    location: String,
    temperature: u64,
}

/// 天气 NFT
public struct WeatherNFT has key, store {
    id: UID,
    location: String,
    temperature: u64,
    timestamp_ms: u64,
}

/// 验证 enclave 签名后铸造天气 NFT
public fun update_weather<T>(
    location: String,
    temperature: u64,
    timestamp_ms: u64,
    sig: &vector<u8>,
    enclave: &Enclave<T>,
    ctx: &mut TxContext,
): WeatherNFT {
    // 验证签名
    let res = enclave.verify_signature(
        WEATHER_INTENT,
        timestamp_ms,
        WeatherResponse { location, temperature },
        sig,
    );
    assert!(res, EInvalidSignature);

    // 签名有效，铸造 NFT
    WeatherNFT {
        id: object::new(ctx),
        location,
        temperature,
        timestamp_ms,
    }
}
```

### Enclave 配置

```move
module weather::config;

use nautilus::enclave;

/// OTW 名称须与模块名一致（ALL_CAPS）
public struct CONFIG() has drop;

fun init(otw: CONFIG, ctx: &mut TxContext) {
    // 创建 enclave 配置（初始 PCR 为占位值）
    enclave::new_cap<CONFIG>(otw, ctx);
    enclave::create_enclave_config<CONFIG>(
        x"000000...", // PCR0 占位
        x"000000...", // PCR1 占位
        x"000000...", // PCR2 占位
        ctx,
    );
}
```

## Rust Enclave 实现

### 应用逻辑（mod.rs）

```rust
use serde::{Deserialize, Serialize};
use nautilus_server::common::{
    AppState, IntentMessage, ProcessDataRequest,
    ProcessedDataResponse, EnclaveError, to_signed_response,
};

#[repr(u8)]
pub enum IntentScope {
    ProcessData = 0,
}

#[derive(Deserialize)]
pub struct WeatherRequest {
    pub location: String,
}

#[derive(Serialize)]
pub struct WeatherResponse {
    pub location: String,
    pub temperature: u64,
}

pub async fn process_data(
    State(state): State<Arc<AppState>>,
    Json(request): Json<ProcessDataRequest<WeatherRequest>>,
) -> Result<Json<ProcessedDataResponse<IntentMessage<WeatherResponse>>>, EnclaveError> {
    let location = &request.payload.location;

    // 1. 调用外部天气 API
    let weather = fetch_weather(location).await?;

    // 2. 验证时间戳新鲜度（拒绝超过 1 小时的请求）
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)?
        .as_millis() as u64;
    let timestamp = request.timestamp_ms;
    if now - timestamp > 3_600_000 {
        return Err(EnclaveError::InvalidTimestamp);
    }

    // 3. 使用 enclave 临时密钥签名响应
    Ok(Json(to_signed_response(
        &state.eph_kp,
        WeatherResponse {
            location: location.clone(),
            temperature: weather.temp,
        },
        timestamp,
        IntentScope::ProcessData as u8,
    )))
}
```

### 允许的外部端点

```yaml
# allowed_endpoints.yaml
- api.weatherapi.com
```

## 部署流程

```
1. 开发
   ├── 克隆 nautilus 模板
   ├── 实现自定义逻辑（mod.rs）
   ├── 配置允许的域名
   └── 本地调试测试

2. 构建
   ├── 构建可重现的 enclave 镜像
   ├── 记录 PCR0、PCR1、PCR2
   └── 公开源代码

3. 部署合约
   ├── 部署 enclave 配置合约
   ├── 在链上设置 PCR 值
   └── 部署应用合约

4. 部署 Enclave
   ├── 配置 AWS EC2 + Nitro Enclave
   ├── 部署 enclave 镜像
   └── 获取证明文档

5. 注册
   ├── 提交证明文档到合约
   ├── 合约验证 PCR 匹配
   └── 存储 enclave 公钥

6. 运行
   ├── 前端发送请求到 enclave
   ├── Enclave 处理并签名
   └── 签名响应在链上验证
```

## 安全考虑

### Nautilus 能防护的

- **运营者篡改**：PCR 验证代码
- **数据泄露**：TEE 隔离内存
- **响应伪造**：密码学签名
- **重放攻击**：时间戳验证

### Nautilus 不能防护的

- **侧信道攻击**：TEE 有已知的侧信道漏洞
- **应用代码 bug**：验证的代码仍然可能有逻辑错误
- **依赖链攻击**：构建过程中的供应链攻击
- **AWS 被攻破**：信任根是 AWS（国家级威胁）

## 小结

- Nautilus 通过 TEE 实现可验证的链下计算，兼顾性能和安全
- PCR 值唯一标识 enclave 运行的代码，任何更改都会导致 PCR 变化
- 每个响应都由 enclave 的临时密钥签名，链上合约验证真实性
- 适用场景：预言机、隐私计算、密封拍卖、可验证随机数
- 开发者只需实现 `mod.rs`（Rust 逻辑）和 `weather.move`（验证逻辑）
- 信任是密码学的——用户验证而非信任运营者


---


<!-- source: 17_advanced_topics/seal.md -->
## 20.4 Seal — 去中心化密钥管理

# Seal 去中心化密钥管理

本节深入讲解 Seal——Sui 上的去中心化密钥管理（DSM）服务。Seal 允许你加密数据并通过 Move 智能合约定义的访问策略控制谁可以解密。它填补了区块链基础设施中的一个关键空白：虽然区块链解决了身份认证（"你是谁？"），但缺少原生的加密模型（"在什么条件下你可以解密什么？"）。

## 核心概念

### 基于身份的加密（IBE）

Seal 结合了两个核心思想：

1. **IBE（Identity-Based Encryption）**：任何字符串都可以作为公钥，无需密钥交换基础设施
2. **链上访问策略**：Move 合约定义谁有权获取解密密钥

```
IBE 身份 = [packageId] || [id]
            ─────────    ────
            命名空间      策略特定标识符
```

## 架构

### 双支柱设计

```
┌──────────────────────────────────────────────┐
│              Seal 架构                         │
├──────────────────────────────────────────────┤
│                                                │
│  链上（Sui）                                    │
│  ├── Move 包定义访问策略                         │
│  ├── seal_approve* 函数作为"守门人"              │
│  └── 包地址 = IBE 身份命名空间                   │
│                                                │
│  链下（Key Servers）                            │
│  ├── 持有 IBE 主密钥（msk）                      │
│  ├── 通过 dry run 评估 seal_approve*             │
│  ├── 策略通过则派生并返回解密密钥                 │
│  └── 无状态，可水平扩展                          │
│                                                │
└──────────────────────────────────────────────┘
```

### 加密流程（本地操作，不联系密钥服务器）

1. 选择策略（`packageId`）并构造身份 `id`
2. 选择密钥服务器集合和阈值 `t`（如 2-of-3）
3. 生成随机对称密钥 `k_sym`
4. 使用 `k_sym` 和 AES-256-GCM 加密数据
5. 使用 Shamir 秘密共享将 `k_sym` 分成 `n` 份
6. 使用每个密钥服务器的公钥和 IBE 身份加密每份
7. 打包为 `EncryptedObject`

### 解密流程（需要与密钥服务器交互）

1. 构造 PTB 调用 `seal_approve*` 函数
2. 向至少 `t` 个密钥服务器请求派生密钥
3. 密钥服务器通过 dry run 验证策略
4. 策略通过则返回加密的 IBE 派生密钥
5. 使用 `t` 个派生密钥重建 `k_sym`
6. 使用 `k_sym` 解密数据

## 访问策略

### seal_approve 接口

```move
module my_package::access;

const ENoAccess: u64 = 0;

/// 只有指定地址可以解密
entry fun seal_approve(id: vector<u8>, ctx: &TxContext) {
    let caller_bytes = bcs::to_bytes(&ctx.sender());
    assert!(id == caller_bytes, ENoAccess);
}
```

### 内置访问模式

#### 私有数据

```move
/// 只有对象所有者可以解密
entry fun seal_approve(id: vector<u8>, ctx: &TxContext) {
    let caller = bcs::to_bytes(&ctx.sender());
    assert!(id == caller, ENoAccess);
}
```

#### 白名单

```move
/// 白名单地址可以解密
entry fun seal_approve(
    id: vector<u8>,
    list: &Allowlist,
    ctx: &TxContext,
) {
    assert!(allowlist::contains(list, ctx.sender()), ENoAccess);
}
```

#### 时间锁

```move
/// 到达指定时间后任何人可以解密
entry fun seal_approve(id: vector<u8>, c: &clock::Clock) {
    let mut prepared: BCS = bcs::new(id);
    let t = prepared.peel_u64();
    let leftovers = prepared.into_remainder_bytes();
    assert!(
        leftovers.length() == 0 && c.timestamp_ms() >= t,
        ENoAccess
    );
}
```

#### 订阅

```move
/// 持有有效订阅凭证的用户可以解密
entry fun seal_approve(
    id: vector<u8>,
    pass: &SubscriptionPass,
    c: &clock::Clock,
) {
    assert!(pass.is_valid(c.timestamp_ms()), ENoAccess);
}
```

#### 组合模式

```move
/// 组合时间限制和白名单
entry fun seal_approve(
    id: vector<u8>,
    list: &Allowlist,
    c: &clock::Clock,
    ctx: &TxContext,
) {
    let mut prepared: BCS = bcs::new(id);
    let expiry = prepared.peel_u64();
    assert!(c.timestamp_ms() <= expiry, EExpired);
    assert!(allowlist::contains(list, ctx.sender()), ENoAccess);
}
```

## TypeScript SDK 使用

### 安装

```bash
npm install @mysten/seal
```

### 配置密钥服务器

```typescript
import { SealClient } from '@mysten/seal';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const suiClient = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});

// Testnet 验证密钥服务器
const serverObjectIds = [
  '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75',
  '0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8',
];

const sealClient = new SealClient({
  suiClient,
  serverConfigs: serverObjectIds.map(id => ({
    objectId: id,
    weight: 1,
  })),
  verifyKeyServers: false,
});
```

### 加密数据

```typescript
import { fromHEX } from '@mysten/bcs';

const { encryptedObject, key: backupKey } = await sealClient.encrypt({
  threshold: 2,
  packageId: fromHEX(packageId),
  id: fromHEX(identityId),
  data: new TextEncoder().encode('Secret message'),
});
```

### 创建会话密钥

```typescript
import { SessionKey } from '@mysten/seal';

const sessionKey = await SessionKey.create({
  address: suiAddress,
  packageId: fromHEX(packageId),
  ttlMin: 10, // 10 分钟有效期
  suiClient,
});

// 用户在钱包中签名
const message = sessionKey.getPersonalMessage();
const { signature } = await keypair.signPersonalMessage(message);
sessionKey.setPersonalMessageSignature(signature);
```

### 解密数据

```typescript
import { Transaction } from '@mysten/sui/transactions';

// 构建调用 seal_approve 的交易
const tx = new Transaction();
tx.moveCall({
  target: `${packageId}::access::seal_approve`,
  arguments: [
    tx.pure.vector('u8', fromHEX(identityId)),
  ],
});

const txBytes = await tx.build({
  client: suiClient,
  onlyTransactionKind: true,
});

// 解密
const decryptedBytes = await sealClient.decrypt({
  data: encryptedObject,
  sessionKey,
  txBytes,
});

const plaintext = new TextDecoder().decode(decryptedBytes);
```

## 密钥服务器模式

| 模式 | 特点 | 适用场景 |
|------|------|---------|
| **Open** | 接受任何包的请求 | 测试、公共服务 |
| **Permissioned** | 只服务白名单中的包，每客户端独立密钥 | 企业级部署 |
| **Committee** | DKG 分布式密钥，无单点持有完整密钥 | 高安全需求 |

## 安全模型

### 信任假设

| 假设 | 含义 |
|------|------|
| 密钥服务器诚实 | 阈值加密下，少于 `t` 个服务器被攻破即安全 |
| 全节点诚实 | 密钥服务器依赖全节点评估策略 |
| 策略正确 | Move 代码准确表达了预期的访问规则 |

### 阈值配置

| 配置 | 隐私保证 | 可用性保证 |
|------|---------|-----------|
| 1-of-1 | 无阈值保护 | 单点故障 |
| 2-of-3 | 容忍 1 个被攻破 | 容忍 1 个不可用 |
| 3-of-5 | 容忍 2 个被攻破 | 容忍 2 个不可用 |

### 信封加密

对于大文件或高敏感数据，使用信封加密模式：

```typescript
// 1. 本地生成对称密钥并加密数据
const localKey = crypto.getRandomValues(new Uint8Array(32));
const encryptedData = await aesEncrypt(data, localKey);

// 2. 使用 Seal 仅加密对称密钥
const { encryptedObject } = await sealClient.encrypt({
  threshold: 2,
  packageId: fromHEX(packageId),
  id: fromHEX(identityId),
  data: localKey, // 只加密密钥
});

// 3. 分别存储加密数据（Walrus）和加密密钥（Seal）
```

## 应用场景

| 场景 | 实现方式 |
|------|---------|
| 私密 NFT | 加密后存储在 Walrus，所有者解密 |
| 付费内容 | 订阅策略控制解密权限 |
| 密封投票 | 时间锁加密，到期后链上解密计票 |
| 抗 MEV 交易 | 时间锁加密订单，防止抢跑 |
| 端到端消息 | 以接收者地址为 ID 加密 |
| 代币门控 | 持有特定 NFT/代币才能解密 |

## 小结

- Seal 填补了区块链加密基础设施的空白
- 加密只需公钥和策略，不需要联系密钥服务器
- 解密需要密钥服务器通过 dry run 验证 Move 策略
- `seal_approve*` 函数是纯 Move 代码，可以组合任意链上状态
- 阈值加密 + 多密钥服务器保障安全性和可用性
- 信封加密模式适合大文件和高安全需求场景
- 密钥服务器选择是信任决策——选择可靠的运营者并多样化


---


<!-- source: 17_advanced_topics/deepbook.md -->
## 20.5 DeepBook — 链上订单簿

# DeepBook 链上订单簿

本节介绍 DeepBook——Sui 上的去中心化链上订单簿（CLOB）。DeepBook 提供完全透明的链上交易撮合，支持限价单、市价单和闪电贷等高级功能。

## 设计理念

### 为什么是链上订单簿

传统 DEX（如 AMM）的局限性：

| 方面 | AMM | 链上订单簿（DeepBook） |
|------|-----|----------------------|
| 价格发现 | 由公式决定 | 由市场供需决定 |
| 滑点 | 大额交易滑点高 | 深度足够时滑点小 |
| 做市方式 | 提供流动性 | 挂限价单 |
| 资本效率 | 较低 | 较高 |

### Sui 的优势

- **并行执行**：不同交易对可以并行处理
- **低延迟**：亚秒级确认
- **低费用**：适合高频交易
- **PTB**：一笔交易完成复杂操作

## 核心概念

### 流动性池（Pool）

每个交易对对应一个 Pool 共享对象：

```move
// DeepBook 池结构（简化）
public struct Pool<phantom BaseAsset, phantom QuoteAsset> has key {
    id: UID,
    bids: CritbitTree<TickLevel>,  // 买单
    asks: CritbitTree<TickLevel>,  // 卖单
    tick_size: u64,                // 最小价格变动
    lot_size: u64,                 // 最小数量变动
}
```

### 账户（Account）

用户需要创建账户来管理余额：

```typescript
import { Transaction } from '@mysten/sui/transactions';

const DEEPBOOK_PACKAGE = '0x...';

// 创建交易账户
function createAccount(tx: Transaction) {
  tx.moveCall({
    target: `${DEEPBOOK_PACKAGE}::clob::create_account`,
  });
}
```

## 下单操作

### 限价单

```typescript
function placeLimitOrder(
  tx: Transaction,
  poolId: string,
  price: number,
  quantity: number,
  isBid: boolean,
  accountCap: string,
) {
  tx.moveCall({
    target: `${DEEPBOOK_PACKAGE}::clob::place_limit_order`,
    arguments: [
      tx.object(poolId),
      tx.pure.u64(price),
      tx.pure.u64(quantity),
      tx.pure.bool(isBid),
      tx.pure.u64(0), // expire_timestamp (0 = no expiry)
      tx.pure.u8(0),  // restriction (0 = no restriction)
      tx.object('0x6'), // Clock
      tx.object(accountCap),
    ],
    typeArguments: ['0x2::sui::SUI', '0x...::usdc::USDC'],
  });
}
```

### 市价单

```typescript
function placeMarketOrder(
  tx: Transaction,
  poolId: string,
  quantity: number,
  isBid: boolean,
  accountCap: string,
  baseCoin: string,
  quoteCoin: string,
) {
  tx.moveCall({
    target: `${DEEPBOOK_PACKAGE}::clob::place_market_order`,
    arguments: [
      tx.object(poolId),
      tx.object(accountCap),
      tx.pure.u64(quantity),
      tx.pure.bool(isBid),
      tx.object(baseCoin),
      tx.object(quoteCoin),
      tx.object('0x6'), // Clock
    ],
    typeArguments: ['0x2::sui::SUI', '0x...::usdc::USDC'],
  });
}
```

### 撤单

```typescript
function cancelOrder(
  tx: Transaction,
  poolId: string,
  orderId: string,
  accountCap: string,
) {
  tx.moveCall({
    target: `${DEEPBOOK_PACKAGE}::clob::cancel_order`,
    arguments: [
      tx.object(poolId),
      tx.pure.u128(orderId),
      tx.object(accountCap),
    ],
    typeArguments: ['0x2::sui::SUI', '0x...::usdc::USDC'],
  });
}
```

## 查询订单簿

### 获取最佳买卖价

```typescript
async function getBestPrices(client: import("@mysten/sui/grpc").SuiGrpcClient, poolId: string) {
  const pool = await client.core.getObject({
    objectId: poolId,
    include: { content: true },
  });

  // 解析订单簿数据
  // ...
}
```

### 查询用户订单

```typescript
function getUserOrders(
  tx: Transaction,
  poolId: string,
  accountCap: string,
) {
  tx.moveCall({
    target: `${DEEPBOOK_PACKAGE}::clob::list_open_orders`,
    arguments: [
      tx.object(poolId),
      tx.object(accountCap),
    ],
    typeArguments: ['0x2::sui::SUI', '0x...::usdc::USDC'],
  });
}
```

## 闪电贷

DeepBook 支持闪电贷——在一笔交易中借入和归还流动性：

```typescript
function flashLoan(tx: Transaction, poolId: string, amount: number) {
  // 借入
  const [coin, receipt] = tx.moveCall({
    target: `${DEEPBOOK_PACKAGE}::clob::borrow_flashloan`,
    arguments: [
      tx.object(poolId),
      tx.pure.u64(amount),
    ],
    typeArguments: ['0x2::sui::SUI', '0x...::usdc::USDC'],
  });

  // 在这里使用借入的资金进行套利等操作
  // ...

  // 归还（必须在同一笔交易中）
  tx.moveCall({
    target: `${DEEPBOOK_PACKAGE}::clob::return_flashloan`,
    arguments: [
      tx.object(poolId),
      coin,
      receipt, // Hot Potato，确保必须归还
    ],
    typeArguments: ['0x2::sui::SUI', '0x...::usdc::USDC'],
  });
}
```

## 做市策略示例

```typescript
async function simpleMarketMaker(
  client: import("@mysten/sui/grpc").SuiGrpcClient,
  keypair: Ed25519Keypair,
  poolId: string,
  accountCap: string,
  spread: number,
) {
  // 获取中间价
  const midPrice = await getMidPrice(client, poolId);

  const tx = new Transaction();

  // 挂买单（中间价 - 价差/2）
  placeLimitOrder(
    tx, poolId,
    midPrice - spread / 2,
    1000, // 数量
    true, // is_bid
    accountCap,
  );

  // 挂卖单（中间价 + 价差/2）
  placeLimitOrder(
    tx, poolId,
    midPrice + spread / 2,
    1000,
    false, // is_ask
    accountCap,
  );

  await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });
}
```

## 小结

- DeepBook 是 Sui 上的完全去中心化链上订单簿
- 支持限价单、市价单和闪电贷等高级交易功能
- Sui 的并行执行和低延迟使链上订单簿成为可能
- 通过 PTB 可以在一笔交易中组合多个交易操作
- 闪电贷利用 Hot Potato 模式确保借入的资金必须在同一交易中归还
- 做市商可以利用 DeepBook API 实现自动化做市策略


---


<!-- source: 17_advanced_topics/walrus.md -->
## 20.6 Walrus — 去中心化存储

# Walrus 去中心化存储

本节介绍 Walrus——Sui 生态系统中的去中心化存储协议。Walrus 提供高可用、低成本的数据存储服务，特别适合存储大文件、媒体内容和 dApp 前端。

## 存储原理

### 纠删码技术

Walrus 使用 Red Stuff 纠删码将数据编码为碎片（slivers），分布在全球存储节点上：

```
┌──────────────────────────────────────────────┐
│           Walrus 存储原理                      │
├──────────────────────────────────────────────┤
│                                                │
│  原始文件 ──► 纠删码编码 ──► N 个碎片            │
│                                                │
│  只需要 N/3 个碎片即可重建原始文件               │
│  即使 2/3 的节点离线，数据仍可恢复              │
│                                                │
│  碎片分布在不同的存储节点上                      │
│  每个节点只存储一个碎片                          │
│                                                │
└──────────────────────────────────────────────┘
```

### 与 Sui 的关系

- **Walrus 存储大数据**：文件、图片、视频、前端代码
- **Sui 存储元数据**：Blob ID、所有权、存储凭证
- **Sui 管理经济模型**：存储费支付、节点质押

## 数据上传

### 使用 CLI

```bash
# 安装 Walrus CLI
# 参考 https://docs.walrus.site/usage/setup.html

# 上传文件
walrus store my-file.png

# 输出 Blob ID
# Blob ID: 0x1234...abcd

# 指定存储时长（以 epochs 为单位）
walrus store my-file.png --epochs 5
```

### 使用 HTTP API

```typescript
// 通过 Publisher API 上传
async function uploadToWalrus(data: Uint8Array): Promise<string> {
  const response = await fetch('https://publisher.walrus-testnet.walrus.space/v1/blobs', {
    method: 'PUT',
    body: data,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  const result = await response.json();

  if (result.newlyCreated) {
    return result.newlyCreated.blobObject.blobId;
  } else if (result.alreadyCertified) {
    return result.alreadyCertified.blobId;
  }

  throw new Error('Upload failed');
}
```

### 使用 TypeScript SDK

```typescript
import { WalrusClient } from '@mysten/walrus';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const suiClient = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const walrusClient = new WalrusClient({
  network: 'testnet',
  suiClient,
});

// 上传数据
const { blobId } = await walrusClient.writeBlob({
  blob: new TextEncoder().encode('Hello, Walrus!'),
  deletable: true,
  epochs: 5,
  signer: keypair,
});

console.log('Blob ID:', blobId);
```

## 数据下载

### 使用 CLI

```bash
# 下载文件
walrus read <BLOB_ID> -o output.png
```

### 使用 HTTP API

```typescript
async function downloadFromWalrus(blobId: string): Promise<Uint8Array> {
  const response = await fetch(
    `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`
  );

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}
```

### 在浏览器中显示

```typescript
// 直接在 img 标签中使用 Walrus URL
function WalrusImage({ blobId }: { blobId: string }) {
  const url = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`;
  return <img src={url} alt="Walrus stored image" />;
}
```

## 与 Move 合约集成

### 在 NFT 中引用 Walrus 数据

```move
module my_nft::nft;

use std::string::String;

public struct MediaNFT has key, store {
    id: UID,
    name: String,
    description: String,
    blob_id: String,     // Walrus Blob ID
    media_type: String,  // "image/png", "video/mp4" 等
}

public fun mint(
    name: String,
    description: String,
    blob_id: String,
    media_type: String,
    ctx: &mut TxContext,
): MediaNFT {
    MediaNFT {
        id: object::new(ctx),
        name,
        description,
        blob_id,
        media_type,
    }
}
```

### 前端展示

```typescript
function NFTCard({ nft }: { nft: { name: string; blob_id: string; media_type: string } }) {
  const mediaUrl = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${nft.blob_id}`;

  return (
    <div className="nft-card">
      <h3>{nft.name}</h3>
      {nft.media_type.startsWith('image/') ? (
        <img src={mediaUrl} alt={nft.name} />
      ) : (
        <video src={mediaUrl} controls />
      )}
    </div>
  );
}
```

## Walrus Sites：去中心化前端托管

Walrus Sites 允许将 Web 应用的前端代码托管在 Walrus 上：

```bash
# 构建前端
cd my-dapp
pnpm run build

# 发布到 Walrus Sites
walrus sites publish ./dist

# 输出访问 URL
# Site published at: https://<site-id>.walrus.site
```

### 更新站点

```bash
# 更新已发布的站点
walrus sites update ./dist --site <SITE_OBJECT_ID>
```

## 结合 Seal 使用加密存储

```typescript
// 1. 加密文件
const { encryptedObject, key } = await sealClient.encrypt({
  threshold: 2,
  packageId: fromHEX(policyPackageId),
  id: fromHEX(accessPolicyId),
  data: fileContent,
});

// 2. 将加密文件存储到 Walrus
const blobId = await uploadToWalrus(encryptedObject);

// 3. 在链上记录 Blob ID
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::encrypted_storage::register`,
  arguments: [
    tx.pure.string(blobId),
    tx.pure.string(accessPolicyId),
  ],
});

// 4. 授权用户可以通过 Seal 策略解密
// seal_approve* 函数控制谁能解密
```

## 存储成本

| 方面 | 说明 |
|------|------|
| 计费单位 | 按存储大小和时长（epochs） |
| 支付代币 | WAL（Walrus 代币）或 SUI |
| 最小存储期 | 1 epoch |
| 数据冗余 | 自动，由纠删码保证 |

## 小结

- Walrus 使用纠删码提供高可用、低成本的去中心化存储
- 支持 CLI、HTTP API 和 TypeScript SDK 多种使用方式
- 特别适合存储 NFT 媒体文件、dApp 前端和用户数据
- Walrus Sites 实现完全去中心化的 Web 应用托管
- 结合 Seal 可以实现加密存储和访问控制
- 与 Sui 紧密集成：Sui 管理元数据和经济模型，Walrus 存储数据


---


<!-- source: 17_advanced_topics/mvr.md -->
## 20.7 MVR — Move 包注册中心

# MVR — Move 包注册中心

MVR（Move Registry）是 Sui 生态的包注册中心，为 Move 包提供人类可读的命名系统。它的作用类似于 JavaScript 生态中的 NPM 或 Rust 生态中的 crates.io，让开发者可以用 `@org/package` 的形式引用链上包，而不必记忆 64 位的十六进制地址。

## 为什么需要 MVR

在没有 MVR 之前，引用一个 Sui 链上包需要这样写：

```toml
[dependencies]
SomePackage = { git = "https://github.com/org/repo.git", subdir = "packages/some", rev = "abc123" }
```

这带来了几个问题：

| 问题 | 说明 |
|------|------|
| **地址不可读** | `0xbb97fa5af2504cc944a8df78dcb5c8b72c3673ca4ba8e4969a98188bf745ee54` 毫无语义 |
| **版本管理困难** | 包升级后地址会变，依赖方需要手动更新 |
| **网络差异** | testnet 和 mainnet 的地址不同，需要分别维护 |
| **PTB 硬编码** | 可编程交易块中必须硬编码包地址 |

MVR 通过链上名称注册表解决了这些问题：

```toml
[dependencies]
demo = { r.mvr = "@mvr/demo" }
```

## 安装 MVR CLI

### 方式一：通过 Suiup 安装（推荐）

```bash
suiup install mvr
```

### 方式二：通过 Cargo 安装

```bash
cargo install --locked --git https://github.com/mystenlabs/mvr --branch release mvr
```

### 方式三：下载预编译二进制

| 操作系统 | 架构 | 下载链接 |
|----------|------|---------|
| macOS | Apple Silicon | [mvr-macos-arm64](https://github.com/mystenlabs/mvr/releases/latest/download/mvr-macos-arm64) |
| macOS | Intel | [mvr-macos-x86_64](https://github.com/mystenlabs/mvr/releases/latest/download/mvr-macos-x86_64) |
| Linux | x86_64 | [mvr-ubuntu-x86_64](https://github.com/mystenlabs/mvr/releases/latest/download/mvr-ubuntu-x86_64) |
| Linux | ARM64 | [mvr-ubuntu-aarch64](https://github.com/mystenlabs/mvr/releases/latest/download/mvr-ubuntu-aarch64) |
| Windows | x86_64 | [mvr-windows-x86_64.exe](https://github.com/mystenlabs/mvr/releases/latest/download/mvr-windows-x86_64.exe) |

下载后重命名并添加执行权限：

```bash
mv mvr-macos-arm64 mvr
chmod +x mvr
sudo mv mvr /usr/local/bin/
```

### 前置要求

- **Sui CLI ≥ 1.63**，且已加入 PATH
- 如果 Sui CLI 不在默认路径，设置环境变量：`export SUI_BINARY_PATH=/path/to/sui`

### 验证安装

```bash
mvr --version
```

## 核心概念

### 名称格式

MVR 的名称由三部分组成：

```
@组织名/包名[/版本号]
```

| 组成部分 | 规则 | 示例 |
|---------|------|------|
| 组织名 | 小写字母、数字、连字符，最长 64 字符 | `@mvr`, `@myorg` |
| 包名 | 小写字母、数字、连字符，最长 64 字符 | `demo`, `my-package` |
| 版本号 | 可选，整数 | `/1`, `/2` |

示例：

```
@mvr/demo          # 最新版本
@mvr/core           # MVR 核心包
@pkg/qwer/1         # 指定版本 1
```

### 名称与 SuiNS 的关系

MVR 的组织名称基于 [SuiNS](https://suins.io/)（Sui Name Service）。要注册一个 MVR 包名，你需要：

1. 拥有一个 SuiNS 域名（如 `myorg.sui`）
2. 用该域名注册 MVR 应用名称
3. 将包信息绑定到名称上

### 链上架构

```
┌─────────────────────────────────────────────┐
│  MoveRegistry（共享对象）                     │
│  ┌───────────────────────────────────────┐  │
│  │  Table<Name, AppRecord>               │  │
│  │                                       │  │
│  │  @mvr/demo  ──→  AppRecord {         │  │
│  │                    networks: {        │  │
│  │                      mainnet: AppInfo │  │
│  │                      testnet: AppInfo │  │
│  │                    }                  │  │
│  │                    package_info: ID   │  │
│  │                  }                    │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

核心类型：

- **MoveRegistry** — 全局注册表，存储所有名称到应用记录的映射
- **AppRecord** — 应用记录，包含各网络的包信息
- **AppCap** — 应用管理权限，持有者可以更新应用信息
- **PackageInfo** — 包的元数据（git 仓库、版本、Display 信息）

## 使用 MVR 管理依赖

### 添加依赖

确保当前 Sui CLI 已连接到正确的网络：

```bash
# 查看当前网络
sui client active-env

# 切换网络
sui client switch --env mainnet
sui client switch --env testnet
```

然后使用 `mvr add` 添加依赖：

```bash
mvr add @mvr/demo
```

该命令会自动修改你的 `Move.toml`，添加：

```toml
[dependencies]
demo = { r.mvr = "@mvr/demo" }
```

### 本地/不支持的网络

如果你使用本地网络或自定义网络，设置回退网络：

```bash
MVR_FALLBACK_NETWORK=mainnet mvr add @mvr/demo
```

### 指定版本

```toml
[dependencies]
my_pkg = { r.mvr = "@org/package" }       # 最新版本
my_pkg = { r.mvr = "@org/package/1" }     # 指定版本 1
my_pkg = { r.mvr = "@org/package/2" }     # 指定版本 2
```

### 构建项目

添加 MVR 依赖后，正常构建即可。Sui CLI 会自动调用 MVR 解析依赖：

```bash
sui move build
```

构建过程中，MVR CLI 作为依赖解析器被调用：

1. Sui CLI 检测到 `r.mvr` 依赖
2. 调用 `mvr --resolve-deps` 解析名称
3. MVR 通过 API 查询链上注册信息
4. 下载并缓存对应的包
5. 返回本地路径给 Sui CLI

## 查询与搜索

### 解析名称

查看一个 MVR 名称对应的包信息：

```bash
# 默认使用当前网络
mvr resolve @mvr/demo

# 指定网络
mvr resolve @mvr/demo --network mainnet
mvr resolve @mvr/demo --network testnet
```

输出包含包的地址、版本、git 仓库等信息。

### 搜索包

```bash
# 按名称搜索
mvr search demo

# 搜索某个组织的所有包
mvr search @myorg/

# 限制结果数量
mvr search demo --limit 5

# 分页查询
mvr search demo --cursor <cursor_value>
```

### JSON 输出

所有命令都支持 JSON 格式输出，方便脚本处理：

```bash
mvr resolve @mvr/demo --json
mvr search demo --json
```

## 在 PTB 中使用 MVR

MVR 的一大优势是可以在可编程交易块（PTB）中使用名称代替地址。这样当包升级后，PTB 会自动使用最新版本，无需修改代码。

### TypeScript SDK 集成

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Transaction } from "@mysten/sui/transactions";
import { MVRPlugin } from "@mysten/mvr-plugin";

const client = new SuiGrpcClient({
  network: "mainnet",
  baseUrl: "https://fullnode.mainnet.sui.io:443",
});

const tx = new Transaction();

// 使用 MVR 名称代替地址
tx.moveCall({
  target: `@mvr/demo::demo::hello`,
  arguments: [],
});

// MVR 插件会在执行前自动解析名称
const plugin = new MVRPlugin(client);
await plugin.resolve(tx);
```

### CLI PTB 集成

```bash
sui client ptb \
  --move-call @mvr/demo::demo::hello \
```

## 发布你的包到 MVR

### 步骤概览

```
1. 拥有 SuiNS 域名
       ↓
2. 注册应用名称
       ↓
3. 发布 Move 包到链上
       ↓
4. 创建 PackageInfo
       ↓
5. 绑定名称到 PackageInfo
       ↓
6. 设置网络信息
```

### 1. 获取 SuiNS 域名

前往 [suins.io](https://suins.io) 注册一个域名，如 `myorg.sui`。

### 2. 在 MVR 注册应用

前往 [moveregistry.com](https://www.moveregistry.com) 使用 SuiNS 域名注册应用名称。

### 3. 发布包并绑定

发布你的 Move 包后，通过 MVR Web 界面或 API 将包地址绑定到注册的名称上。

### 4. 设置 Git 信息

设置包的 git 仓库地址和相关元数据，让其他开发者可以查看源码：

```
仓库: https://github.com/myorg/my-package
子目录: packages/core
标签: v1.0.0
```

## API 端点

MVR 提供 REST API，供 CLI 和第三方工具使用：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/v1/names` | GET | 搜索名称（分页） |
| `/v1/names/{name}` | GET | 获取包信息 |
| `/v1/resolution/{name}` | GET | 解析名称到包地址 |
| `/v1/resolution/bulk` | POST | 批量解析 |
| `/v1/reverse-resolution/{package_id}` | GET | 反向解析（地址→名称） |
| `/v1/reverse-resolution/bulk` | POST | 批量反向解析 |
| `/v1/type-resolution/{type_name}` | GET | 解析类型名称 |
| `/v1/struct-definition/{type_name}` | GET | 获取结构体定义 |
| `/v1/package-address/{id}/dependencies` | GET | 查询依赖 |
| `/v1/package-address/{id}/dependents` | GET | 查询被依赖 |
| `/health` | GET | 健康检查 |

API 基础地址：

- Mainnet: `https://mainnet.mvr.mystenlabs.com`
- Testnet: `https://testnet.mvr.mystenlabs.com`

使用示例：

```bash
# 解析名称
curl https://mainnet.mvr.mystenlabs.com/v1/resolution/@mvr/demo

# 反向解析
curl https://mainnet.mvr.mystenlabs.com/v1/reverse-resolution/0xabc...

# 搜索
curl "https://mainnet.mvr.mystenlabs.com/v1/names?query=demo&limit=10"
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `SUI_BINARY_PATH` | Sui CLI 路径（默认使用 PATH 中的 `sui`） |
| `MVR_FALLBACK_NETWORK` | 回退网络（`mainnet` 或 `testnet`），用于本地/不支持的网络 |

## 常用命令速查

```bash
# 安装
suiup install mvr                         # 通过 suiup 安装

# 依赖管理
mvr add @org/package                      # 添加依赖到 Move.toml
mvr add @org/package/1                    # 添加指定版本

# 查询
mvr resolve @org/package                  # 解析名称
mvr resolve @org/package --network mainnet  # 指定网络解析
mvr search demo                           # 搜索包
mvr search @org/ --limit 20              # 搜索组织下的包

# 构建
sui move build                            # 自动解析 MVR 依赖

# 网络切换
sui client switch --env mainnet           # MVR 跟随 Sui CLI 网络
sui client switch --env testnet
```

## 实战示例：使用 MVR 依赖构建项目

### 创建项目

```bash
sui move new my_defi_app
cd my_defi_app
```

### 添加 MVR 依赖

```bash
# 确保在正确的网络
sui client switch --env mainnet

# 添加依赖
mvr add @mvr/core
```

### Move.toml

```toml
[package]
name = "my_defi_app"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }
mvr_core = { r.mvr = "@mvr/core" }

[addresses]
my_defi_app = "0x0"
```

### 编写代码

```move
module my_defi_app::app;

// MVR 依赖会被自动解析
// 可以直接使用 @mvr/core 中的类型和函数

public struct MyApp has key {
    id: UID,
    name: vector<u8>,
}

fun init(ctx: &mut TxContext) {
    let app = MyApp {
        id: object::new(ctx),
        name: b"My DeFi App",
    };
    transfer::transfer(app, ctx.sender());
}
```

### 构建与测试

```bash
sui move build    # MVR 自动解析依赖
sui move test     # 运行测试
```

## 小结

MVR 是 Sui 生态中包管理的基础设施，它为 Move 开发带来了现代化的依赖管理体验：

- **人类可读**：`@org/package` 取代冗长的十六进制地址
- **自动解析**：构建时自动解析 MVR 名称，无需手动管理地址
- **网络感知**：同一名称在不同网络自动解析到对应的包
- **版本管理**：支持版本号，包升级后依赖方可以平滑迁移
- **PTB 集成**：在可编程交易块中使用名称，始终调用最新版本
- **生态互通**：通过注册中心发现和复用社区包

随着 Sui 生态的成长，MVR 将成为 Move 开发者日常工作流中不可或缺的一环，建议尽早在项目中采用 MVR 管理依赖。


---


<!-- source: 17_advanced_topics/gas-pool.md -->
## 20.8 Gas Pool — 赞助交易服务

# Sui Gas Pool — 赞助交易服务

Sui Gas Pool 是 Mysten Labs 开源的**赞助交易（Sponsored Transaction）**基础设施服务。它管理一个由赞助者地址持有的 Gas Coin 池，通过 API 为用户交易提供 Gas 代付，让用户无需持有 SUI 即可与 DApp 交互。

## 为什么需要 Gas Pool

传统区块链上，用户必须先持有原生代币才能发起交易，这形成了巨大的入门门槛。Gas Pool 让 DApp 开发者可以为用户代付 Gas 费用：

```
┌──────────┐     ①构建交易(无Gas)    ┌──────────────┐
│   用户    │ ──────────────────────→ │  应用服务器   │
│  (无SUI)  │                        │              │
└──────────┘                        └──────┬───────┘
     ↑                                     │
     │  ④签名后发回                    ②预留Gas Coin
     │                                     ↓
     │                              ┌──────────────┐
     │                              │  Gas Pool    │
     │                              │  (赞助者)     │
     └──────────────────────────────┤              │
        ⑤完整交易→链上执行            └──────────────┘
                                         ③返回Gas信息
```

| 场景 | 说明 |
|------|------|
| **新用户引导** | 用户无需购买 SUI 即可体验 DApp |
| **游戏** | 玩家操作由游戏方代付 Gas |
| **企业应用** | 企业为员工/客户承担链上费用 |
| **空投活动** | 领取方无需持币即可 claim |

## 架构概览

Gas Pool 由三个核心组件构成：

```
                    ┌─────────────────────────────────────┐
                    │         Gas Pool 集群               │
                    │                                     │
┌──────────┐       │  ┌──────────┐    ┌──────────────┐  │     ┌──────────┐
│  应用    │ HTTP  │  │ Gas Pool │    │    Redis     │  │     │ Sui      │
│  服务器  │──────→│  │ Server   │←──→│  (状态存储)   │  │────→│ Fullnode │
│          │       │  │ (可多实例) │    └──────────────┘  │     └──────────┘
└──────────┘       │  └────┬─────┘                      │
                    │       │                             │
                    │  ┌────┴─────┐                      │
                    │  │ KMS      │                      │
                    │  │ Sidecar  │                      │
                    │  │ (签名服务) │                      │
                    │  └──────────┘                      │
                    └─────────────────────────────────────┘
```

| 组件 | 作用 | 扩展性 |
|------|------|--------|
| **Gas Pool Server** | 核心服务，处理 Gas 预留和交易执行 | 可水平扩展（多实例共享 Redis） |
| **Redis** | 存储 Gas Coin 状态、预留队列、过期管理 | 每个 Gas Pool 一个实例 |
| **KMS Sidecar**（可选） | 外部密钥管理签名（如 AWS KMS） | 每个 Gas Pool 一个实例 |

## 安装

### 前置要求

- **Rust 1.90+**
- **Redis**（本地开发或生产部署）
- **Sui Fullnode** RPC 端点

### 从源码构建

```bash
git clone https://github.com/MystenLabs/sui-gas-pool.git
cd sui-gas-pool

cargo build --release
```

构建产物：
- `target/release/sui-gas-station` — 主服务
- `target/release/tool` — CLI 工具

### Docker 构建

```bash
cd docker
./build.sh
```

## 配置

### 生成示例配置

```bash
# 使用本地密钥签名
cargo run --bin tool generate-sample-config --config-path config.yaml

# 使用 KMS Sidecar 签名
cargo run --bin tool generate-sample-config --config-path config.yaml --with-sidecar-signer
```

### 配置文件详解

```yaml
# 签名配置
signer-config:
  # 方式一：本地密钥（开发用）
  local:
    keypair: "suiprivkey1..."

  # 方式二：KMS Sidecar（生产用）
  # sidecar:
  #   sidecar_url: "http://localhost:3000/aws-kms"

# API 服务配置
rpc-host-ip: 0.0.0.0
rpc-port: 9527

# Prometheus 指标端口
metrics-port: 9184

# Redis 存储配置
gas-pool-config:
  redis:
    redis_url: "redis://127.0.0.1:6379"
    connection-timeout-ms: 5000
    response-timeout-ms: 5000
    number-of-retries: 3

# Sui 全节点 RPC
fullnode-url: "https://fullnode.testnet.sui.io:443"

# Gas Coin 初始化配置
coin-init-config:
  # 每个 Gas Coin 的目标余额（MIST），0.1 SUI = 100000000
  target-init-balance: 100000000
  # 定期检查新资金的间隔（秒）
  refresh-interval-sec: 86400

# 每日 Gas 使用上限（MIST），1.5 SUI = 1500000000000
daily-gas-usage-cap: 1500000000000

# 单次请求最大 SUI 数量（默认 2 SUI）
# max-sui-per-request: 2000000000

# 高级水龙头模式（发送方=赞助方，Gas Coin 可用于转账）
# advanced-faucet-mode: false
```

### 关键配置项说明

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `signer-config` | 签名方式：`local`（本地密钥）或 `sidecar`（KMS） | 必填 |
| `rpc-port` | API 服务端口 | 9527 |
| `metrics-port` | Prometheus 指标端口 | 9184 |
| `redis_url` | Redis 连接地址 | 必填 |
| `fullnode-url` | Sui Fullnode RPC 地址 | 必填 |
| `target-init-balance` | 每个 Gas Coin 目标余额（MIST） | 必填 |
| `refresh-interval-sec` | 资金刷新检查间隔 | 86400 |
| `daily-gas-usage-cap` | 每日 Gas 使用上限（MIST） | 必填 |
| `max-sui-per-request` | 单次预留最大 SUI | 2 SUI |
| `advanced-faucet-mode` | 水龙头模式 | false |

## 部署流程

### 1. 创建赞助者地址

```bash
sui client new-address ed25519
```

记录生成的地址和密钥。这个地址将专门用作 Gas 赞助，**不要用于其他用途**。

### 2. 为赞助者充值

向赞助者地址转入足够的 SUI：

```bash
# testnet 可使用水龙头
sui client faucet --address <sponsor_address>

# mainnet 需要手动转账
sui client transfer-sui --to <sponsor_address> --amount 1000000000 --sui-coin-object-id <coin_id>
```

### 3. 部署 Redis

```bash
# Docker 方式
docker run -d --name gas-pool-redis -p 6379:6379 redis:7

# 或使用系统包管理器
brew install redis && brew services start redis  # macOS
```

### 4. 编写配置文件

参考上方的配置模板，创建 `config.yaml`。

### 5. 设置认证 Token

```bash
export GAS_STATION_AUTH="your-secret-bearer-token"
```

### 6. 启动服务

```bash
./target/release/sui-gas-station --config-path config.yaml
```

首次启动时，Gas Pool 会自动将赞助者地址持有的大额 SUI Coin 拆分成多个小额 Coin（每个目标余额由 `target-init-balance` 决定），以支持并行赞助。

## API 使用

所有 API 请求需在 Header 中携带认证 Token：

```
Authorization: Bearer <GAS_STATION_AUTH>
```

### 健康检查

```bash
# 基本健康检查（无需认证）
curl http://localhost:9527/

# 版本信息（无需认证）
curl http://localhost:9527/version

# 完整健康检查（需要认证）
curl -X POST http://localhost:9527/debug_health_check \
  -H "Authorization: Bearer $GAS_STATION_AUTH"
```

### 预留 Gas Coin

```bash
curl -X POST http://localhost:9527/v1/reserve_gas \
  -H "Authorization: Bearer $GAS_STATION_AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "gas_budget": 100000000,
    "reserve_duration_secs": 60
  }'
```

**请求参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `gas_budget` | u64 | Gas 预算（MIST） |
| `reserve_duration_secs` | u64 | 预留时长（最长 600 秒） |

**响应：**

```json
{
  "result": {
    "sponsor_address": "0xabc...",
    "reservation_id": 42,
    "gas_coins": [
      {
        "objectId": "0x123...",
        "version": "5",
        "digest": "abc123..."
      }
    ]
  },
  "error": null
}
```

### 执行交易

```bash
curl -X POST http://localhost:9527/v1/execute_tx \
  -H "Authorization: Bearer $GAS_STATION_AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "reservation_id": 42,
    "tx_bytes": "<base64 编码的 TransactionData>",
    "user_sig": "<base64 编码的用户签名>",
    "options": {
      "showEffects": true,
      "showBalanceChanges": true
    }
  }'
```

**请求参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `reservation_id` | u64 | 预留时返回的 ID |
| `tx_bytes` | String | Base64 编码的 BCS 序列化交易数据 |
| `user_sig` | String | Base64 编码的用户签名 |
| `options` | Object | 可选，控制返回内容 |

**响应选项：**

| 选项 | 说明 |
|------|------|
| `showEffects` | 返回交易效果 |
| `showBalanceChanges` | 返回余额变化 |
| `showObjectChanges` | 返回对象变化 |
| `showEvents` | 返回事件 |
| `showInput` | 返回交易输入 |
| `showRawEffects` | 返回原始效果 |
| `showRawInput` | 返回原始输入 |

## TypeScript 集成示例

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { toBase64 } from "@mysten/sui/utils";

const GAS_POOL_URL = "http://localhost:9527";
const GAS_POOL_AUTH = "your-secret-bearer-token";
const client = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

async function sponsoredTransaction(userKeypair: Ed25519Keypair) {
  const userAddress = userKeypair.toSuiAddress();

  // 1. 构建交易（不设置 Gas）
  const tx = new Transaction();
  tx.setSender(userAddress);
  tx.moveCall({
    target: "0xPACKAGE::module::function",
    arguments: [],
  });
  const txBytes = await tx.build({ client });

  // 2. 向 Gas Pool 预留 Gas
  const reserveRes = await fetch(`${GAS_POOL_URL}/v1/reserve_gas`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GAS_POOL_AUTH}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gas_budget: 50000000,
      reserve_duration_secs: 60,
    }),
  });
  const reserveData = await reserveRes.json();
  const { reservation_id, sponsor_address, gas_coins } = reserveData.result;

  // 3. 用预留的 Gas Coin 重新构建交易
  const sponsoredTx = new Transaction();
  sponsoredTx.setSender(userAddress);
  sponsoredTx.setGasOwner(sponsor_address);
  sponsoredTx.setGasPayment(gas_coins);
  sponsoredTx.setGasBudget(50000000);
  sponsoredTx.moveCall({
    target: "0xPACKAGE::module::function",
    arguments: [],
  });
  const sponsoredTxBytes = await sponsoredTx.build({ client });

  // 4. 用户签名
  const userSig = await userKeypair.signTransaction(sponsoredTxBytes);

  // 5. 发送到 Gas Pool 执行
  const executeRes = await fetch(`${GAS_POOL_URL}/v1/execute_tx`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GAS_POOL_AUTH}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reservation_id,
      tx_bytes: toBase64(sponsoredTxBytes),
      user_sig: userSig.signature,
      options: { showEffects: true },
    }),
  });
  const result = await executeRes.json();
  console.log("交易结果:", result);
}
```

## KMS Sidecar 配置（生产环境）

生产环境建议使用 AWS KMS 等外部密钥管理服务，避免在服务器上存储明文私钥。

项目提供了一个 TypeScript 示例 Sidecar：

```bash
cd sample_kms_sidecar
npm install
```

设置 AWS 环境变量：

```bash
export AWS_KMS_KEY_ID="arn:aws:kms:us-east-1:123456789:key/abc-def"
export AWS_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
```

启动 Sidecar：

```bash
npx ts-node index.ts
```

Sidecar 提供两个端点：

| 端点 | 说明 |
|------|------|
| `GET /aws-kms/get-pubkey-address` | 获取 KMS 密钥对应的 Sui 地址 |
| `POST /aws-kms/sign-transaction` | 使用 KMS 签署交易 |

在 Gas Pool 配置中引用：

```yaml
signer-config:
  sidecar:
    sidecar_url: "http://localhost:3000/aws-kms"
```

## 运维与监控

### Prometheus 指标

Gas Pool 在 `metrics-port`（默认 9184）暴露 Prometheus 指标：

**请求指标：**

| 指标 | 说明 |
|------|------|
| `num_reserve_gas_requests` | 预留请求总数 |
| `num_successful_reserve_gas_requests` | 成功的预留请求数 |
| `num_execute_tx_requests` | 执行请求总数 |
| `num_successful_execute_tx_requests` | 成功的执行请求数 |

**池状态指标：**

| 指标 | 说明 |
|------|------|
| `gas_pool_available_gas_coin_count` | 可用 Gas Coin 数量 |
| `gas_pool_available_gas_total_balance` | 可用 Gas 总余额 |
| `daily_gas_usage` | 当日 Gas 使用量 |
| `num_expired_gas_coins` | 过期归还的 Coin 数量 |

**性能指标：**

| 指标 | 说明 |
|------|------|
| `reserve_gas_latency` | 预留请求延迟 |
| `transaction_signing_latency` | 交易签名延迟 |
| `transaction_execution_latency` | 交易执行延迟 |

### CLI 健康检查

```bash
# 基本健康检查
cargo run --bin tool cli check-station-health \
  --gas-station-url http://localhost:9527

# 完整端到端检查
cargo run --bin tool cli check-station-end-to-end-health \
  --gas-station-url http://localhost:9527 \
  --auth-token "$GAS_STATION_AUTH"
```

### 压力测试

```bash
cargo run --release --bin tool benchmark \
  --gas-station-url http://localhost:9527 \
  --auth-token "$GAS_STATION_AUTH" \
  --reserve-duration-sec 20 \
  --num-clients 100 \
  --benchmark-mode reserve-only
```

## 限制与约束

| 约束 | 值 |
|------|-----|
| 单次预留最大 Gas Coin 数 | 256 个 |
| 单交易最大输入对象数 | 50 个 |
| 最长预留时间 | 600 秒（10 分钟） |
| 单次请求最大 SUI | 2 SUI（可配置） |
| 每日 Gas 上限 | 配置决定，午夜重置 |

## 安全注意事项

1. **专用地址**：赞助者地址应专门用于 Gas Pool，不要用于其他交易
2. **Token 保密**：`GAS_STATION_AUTH` 只应在内部服务器使用，不要暴露给前端
3. **KMS 签名**：生产环境强烈建议使用 KMS Sidecar，避免明文私钥
4. **每日上限**：合理设置 `daily-gas-usage-cap` 防止资金耗尽
5. **水龙头模式**：`advanced-faucet-mode` 有更高的资金风险，谨慎使用

## 小结

Sui Gas Pool 是实现赞助交易的完整基础设施方案：

- **降低门槛**：用户无需持有 SUI 即可使用 DApp
- **高并发**：通过 Coin 拆分和 Redis 状态管理支持大规模并发赞助
- **水平扩展**：多个 Server 实例共享同一 Redis，轻松扩容
- **安全签名**：支持 AWS KMS 等外部密钥管理，保护赞助者私钥
- **可观测**：内置 Prometheus 指标，便于监控和告警
- **资金管控**：每日上限、单次上限、自动过期回收，防止资金耗尽

对于需要优化用户体验的 DApp，Gas Pool 是不可或缺的基础设施组件。


---


<!-- source: 17_advanced_topics/dev-skills.md -->
## 20.9 Sui Dev Skills — AI 辅助开发技能包

# Sui Dev Skills — AI 辅助开发技能包

Sui Dev Skills 是 Mysten Labs 维护的一套 **Claude 技能包（Skills）**，用于在 Claude Code 或兼容的 AI 编程助手中规范 Sui 开发行为。每个技能是一份 `SKILL.md` 文档，描述了对应技术栈的约定、最佳实践和常见坑，AI 在编写或审查代码时会自动参考这些规则，从而产出更符合 Sui 生态习惯的代码。

本节介绍 Sui Dev Skills 的安装方式、三个子技能的内容与适用场景，以及如何在本项目中组合使用。

## 什么是 Sui Dev Skills

在 Sui 开发中，AI 容易犯一些典型错误，例如：

- **Move**：使用 Aptos Move 的 `signer`、`move_to`，或旧版 Sui 的 `public(friend)`、无 `public` 的结构体
- **TypeScript**：使用已废弃的 `@mysten/sui.js`、`TransactionBlock`，或忘记检查交易执行结果
- **前端**：使用已废弃的 `@mysten/dapp-kit` 三 Provider 结构，或未在查询前 `waitForTransaction`

Sui Dev Skills 通过结构化文档（SKILL.md）明确「应该怎么做」和「不要怎么做」，让 AI 在写 Move、TS SDK 或前端代码时遵循同一套约定，减少上述问题。

### 三个子技能

| 技能 | 路径 | 适用场景 | 主要内容 |
|------|------|----------|----------|
| **sui-move** | `sui-move/SKILL.md` | 编写、审查、调试或部署 Sui Move 代码；配置 Move.toml；写 Move 测试 | Move 2024 语法、包结构、对象能力、Capability 模式、事件、PTB 可调用的 entry、测试约定 |
| **sui-ts-sdk** | `sui-ts-sdk/SKILL.md` | 用 TypeScript/JavaScript 与 Sui 链交互（脚本、CLI、服务端或前端的交易构建层） | `@mysten/sui`、PTB 构建（Transaction、moveCall、splitCoins、coinWithBalance）、SuiGrpcClient、签名与执行、链上查询 |
| **sui-frontend** | `sui-frontend/SKILL.md` | 构建浏览器端 Sui dApp（React 或 Vue/原生 JS/Svelte + dApp Kit） | `@mysten/dapp-kit-react` / `dapp-kit-core`、钱包连接、React hooks、Web Components、nanostores、链上查询与缓存失效 |

**路由建议：**

- 只写 Move 合约 → 加载 **sui-move**
- 只写后端脚本或 CLI → 加载 **sui-ts-sdk**
- 只写前端页面（含钱包、查询、发交易）→ 加载 **sui-frontend** + **sui-ts-sdk**
- 全栈（合约 + 前端 + 脚本）→ 三个都加载

## 安装

### 方式一：全局安装（推荐）

技能放在 Claude Code 的全局技能目录，对所有项目生效：

```bash
git clone https://github.com/MystenLabs/sui-dev-skills ~/.claude/skills/sui-dev-skills
```

Claude Code 会自动发现 `~/.claude/skills/` 下的技能，并根据当前编辑的文件和任务类型选择合适的技能激活。

### 方式二：项目内安装（可提交到仓库）

把技能克隆到项目内的 `.claude/skills/`，方便团队统一使用：

```bash
mkdir -p .claude/skills
git clone https://github.com/MystenLabs/sui-dev-skills .claude/skills/sui-dev-skills
```

将 `.claude/skills/sui-dev-skills` 提交到 Git 后，任何人用 Claude Code 打开该项目都会自动应用这些技能。

### 方式三：在 CLAUDE.md 中显式引用

若使用 Cursor、Claude Code 等支持 `CLAUDE.md` 的编辑器，可以在项目根目录的 `CLAUDE.md` 中固定引用要用的技能，确保每次对话都会加载：

```markdown
# My Sui Dapp

@.claude/skills/sui-dev-skills/sui-move/SKILL.md
@.claude/skills/sui-dev-skills/sui-ts-sdk/SKILL.md
@.claude/skills/sui-dev-skills/sui-frontend/SKILL.md
```

全局安装时路径可能是：

```markdown
@~/sui-dev-skills/sui-move/SKILL.md
@~/sui-dev-skills/sui-ts-sdk/SKILL.md
@~/sui-dev-skills/sui-frontend/SKILL.md
```

这样 AI 在动手写代码前就会先读取这些技能文档，按其中的约定生成或修改代码。

## 各技能要点速览

### sui-move

- **包与模块**：`edition = "2024.beta"`，Sui 1.45+ 不显式写框架依赖，命名地址带项目前缀
- **语法**：单行 `module pkg::mod;`，`public struct`，`let mut`，方法语法，枚举与 `match`
- **对象**：带 `key` 的结构体必须有 `id: UID`，只用 `transfer`/`share_object`/`freeze_object` 的非 `public_` 版本在定义该类型的模块内调用
- **可见性**：用 `public(package)` 替代 `public(friend)`，不要写 `public entry`
- **命名**：Capability 后缀 `Cap`，事件过去式，错误常量 `EPascalCase`
- **测试**：不写 `test_` 前缀，用 `assert_eq!`、`tx_context::dummy()`、`sui::test_utils::destroy`

详细规则见仓库内 `sui-move/SKILL.md`。

### sui-ts-sdk

- **包与客户端**：使用 `@mysten/sui`，新代码优先 `SuiGrpcClient`，不再用 `SuiClient`/`getFullnodeUrl`
- **交易**：使用 `Transaction`（不是 `TransactionBlock`），`tx.pure.u64()` 等类型化纯参数，`tx.object(id)` 由 SDK 解析版本
- **命令**：`splitCoins`、`mergeCoins`、`transferObjects`、`moveCall`、`coinWithBalance`（非 SUI 时需 `setSender`）
- **执行**：始终检查 `result.$kind === 'FailedTransaction'`，执行后用 `client.waitForTransaction()` 再查链上状态
- **赞助交易**：用 `coinWithBalance` 而非 `tx.gas` 做支付，避免占用赞助方 gas

详细规则见仓库内 `sui-ts-sdk/SKILL.md`。

### sui-frontend

- **包**：新项目用 `@mysten/dapp-kit-react`（React）或 `@mysten/dapp-kit-core`（Vue/原生等），不再用旧的 `@mysten/dapp-kit`
- **配置**：`createDAppKit` + `DAppKitProvider`，`createClient` 传入 `SuiGrpcClient`
- **React**：`useCurrentAccount`、`useCurrentClient`、`useDAppKit().signAndExecuteTransaction`，链上数据用 `useCurrentClient` + `@tanstack/react-query`，查询加 `enabled: !!account`
- **非 React**：nanostores 的 `$connection`、`$currentClient` 等，Web Components 如 `mysten-dapp-kit-connect-button`
- **交易后**：先 `waitForTransaction`，再 `queryClient.invalidateQueries`，避免读到未索引数据

详细规则见仓库内 `sui-frontend/SKILL.md`。

## 典型使用流程

1. **安装**：按上面任选一种方式安装 Sui Dev Skills（推荐项目内克隆并提交）。
2. **按任务选技能**：只写合约就依赖 sui-move；只写脚本就依赖 sui-ts-sdk；写 dApp 就同时依赖 sui-frontend + sui-ts-sdk；全栈则三个都引用。
3. **在 CLAUDE.md 中固定技能**（可选）：把用到的 `SKILL.md` 路径写在 `CLAUDE.md` 里，保证每次对话都会加载。
4. **正常写需求**：像平时一样描述需求或贴代码，AI 会结合技能里的约定生成或修改代码，并避免技能中列出的反模式。

## 运行 Evals（可选）

仓库中每个子技能都带有 `evals/evals.json`，用于在 Claude Code 中通过 skill-creator 跑自动化评测，验证技能是否能让 AI 产出符合预期的代码。若你只关心「在日常开发里用好这些技能」，可以跳过 evals；若需要验证或贡献技能，可参考仓库根目录 README 中的 “Running evals” 说明。

## 小结

- Sui Dev Skills 是一套供 AI 参考的 Sui 开发规范，包含 **sui-move**、**sui-ts-sdk**、**sui-frontend** 三个子技能。
- 安装方式：全局克隆到 `~/.claude/skills/`，或项目内克隆到 `.claude/skills/sui-dev-skills`，或在 `CLAUDE.md` 中直接引用对应 `SKILL.md`。
- 按任务选择加载的技能：只合约 → sui-move；只脚本 → sui-ts-sdk；只前端 → sui-frontend + sui-ts-sdk；全栈 → 三个都加载。
- 使用后，AI 会更稳定地遵循 Move 2024、TS SDK v2 和 dApp Kit 的推荐写法，并避免常见错误（如错误包名、旧 API、未检查交易结果、查询未索引数据等）。


---


<!-- source: 18_pas/index.md -->
## 第二十一章 · 许可资产标准（PAS）

# 第二十一章 · 许可资产标准（PAS）

本章介绍 Mysten Labs 的 **Permissioned Assets Standard（PAS）**——一套在 Sui 上发行与管理**许可型余额**的框架，适用于需要 KYC/AML、转移限制与监管控制的现实资产代币化场景。内容基于 [MystenLabs/pas](https://github.com/MystenLabs/pas) 及 [KYC-compliant coin 示例 PR #25](https://github.com/MystenLabs/pas/pull/25)。

## 本章内容

| 节 | 主题 | 你将学到 |
|---|------|---------|
| 21.1 | PAS 概述与方案对比 | 设计目标、Chest/Policy 模型、与 DenyList/闭环 Token/TransferPolicy 的对比 |
| 21.2 | 核心抽象 | Namespace、Chest、Policy、PolicyCap |
| 21.3 | 请求与解析 | SendFunds / UnlockFunds / Clawback、Request、required_approvals、resolve |
| 21.4 | Templates 与 Command | 发行方如何配置 PTB 模板、SDK 如何解析转账 |
| 21.5 | 版本控制与 Clawback | Versioning、可选 Clawback、紧急阻断 |
| 21.6 | 实战一：简单合规代币 | 限额、禁止某地址、自定义 TransferApproval |
| 21.7 | 实战二：KYC 合规代币 | KYC 校验、发行方签发 stamp、仅 KYC 通过可收发 |

## 学习目标

读完本章后，你将能够：

- **引入并使用 PAS 库**：配置依赖、use 语句，并在各节中查阅 Namespace / Chest / Policy / Request / Templates 的接口速查表
- 理解 PAS 的 Chest 架构与「请求-解析」流程，会使用 **request.data()**、**send_funds::sender/recipient/funds**、**resolve_balance** / **resolve** 等接口
- 将 PAS 与 DenyList 受监管代币、闭环 Token、Kiosk TransferPolicy 做选型对比
- 使用 PAS 实现简单合规规则与 KYC 合规代币思路，并会配置 **set_template_command** 与 **ptb::move_call** / **ext_input**


---


<!-- source: 18_pas/01-overview.md -->
## 21.1 PAS 概述与方案对比

# PAS 概述与方案对比

## 如何引入 PAS 库

### 依赖配置

在发行方包的 `Move.toml` 中声明对 `pas` 和（若需注册 Command）`ptb` 的依赖：

```toml
[package]
name = "your_coin"
edition = "2024.beta"

[dependencies]
pas = { local = "../pas" }   # 或 git = "https://github.com/MystenLabs/pas" }
ptb = { local = "../ptb" }   # 仅当需要 set_template_command 时
sui = { git = "https://github.com/MystenLabs/sui", rev = "..." }
```

### 常用 use 语句

发行方模块中通常需要：

```move
use pas::namespace::Namespace;
use pas::policy::{Self, Policy, PolicyCap};
use pas::chest::{Self, Chest, Auth};
use pas::request::Request;
use pas::send_funds::{Self, SendFunds};
use pas::unlock_funds::{Self, UnlockFunds};
use pas::clawback_funds::{Self, ClawbackFunds};
use pas::templates::Templates;
use ptb::ptb;  // 用于 move_call、ext_input、object_by_id 等
```

解析函数里会用到 `request.data()`、`request.approve(...)`，以及 `send_funds::sender/recipient/funds` 等访问器。

## 什么是 PAS

**Permissioned Assets Standard（PAS）** 是 Sui 上用于发行和管理**许可型资产**的框架，面向需要合规约束、转移限制和监管控制的**同质化代币**场景（如证券型代币、稳定币、合规稳定币等）。资产只能存放在 **Chest** 中，转账通过 **Request（SendFunds / UnlockFunds / Clawback）** 发起，并由发行方定义的**解析逻辑**（含 KYC、白名单、限额等）批准后才会完成。

参考：[MystenLabs/pas](https://github.com/MystenLabs/pas)、[PR #25 KYC-compliant coin example](https://github.com/MystenLabs/pas/pull/25)。

## 设计目标

- **许可转移**：所有转账必须经过 Chest，并由与 Policy 绑定的自定义规则批准。
- **Chest 架构**：代币只能存在于 Chest 中，每个地址（或对象）对应一个派生 Chest，便于发现与 RPC 查询。
- **灵活策略**：每种代币类型对应一个 Policy，可配置不同动作（send_funds、unlock_funds、clawback_funds）所需的审批类型。
- **可选 Clawback**：在注册时选择是否允许监管收回（clawback），满足合规需求。

## 核心概念一览

| 概念 | 说明 |
|------|------|
| **Namespace** | 全局单例，用于派生 Chest、Policy、Templates 的地址，并管理版本阻断。 |
| **Chest** | 每个地址（或对象）一个，由 Namespace 派生；余额只能从 Chest 到 Chest 或通过 Unlock 流出。 |
| **Policy\<T\>** | 与代币类型 T 绑定，规定各动作（send_funds 等）需要哪些「审批类型」才能 resolve。 |
| **Request** | 转账/解锁/收回时产生的「热土豆」，须在 PTB 中调用发行方包里的 resolve 逻辑并凑齐所需审批后 resolve。 |
| **Templates** | 存储每种审批类型对应的 PTB Command，供 SDK 自动构造解析交易。 |

## 与既有方案的详细对比

下表对比 PAS 与本书前面介绍的几种「受限/合规」方案，便于按场景选型。

| 维度 | **PAS（许可资产标准）** | **DenyList 受监管代币**（13.4） | **闭环 Token（Closed-Loop）**（13.5） | **Kiosk TransferPolicy**（14.4） |
|------|-------------------------|----------------------------------|----------------------------------------|-----------------------------------|
| **适用资产** | 同质化、许可型（如合规稳定币、证券型代币） | 同质化 Coin，链上原生 | 同质化 Token（sui::token） | NFT / 可交易对象 |
| **存储形态** | 余额在 **Chest**（每地址一个派生对象） | 普通 **Coin\<T\>** 在钱包地址 | **Token\<T\>**，转移受 Policy 约束 | 对象在 Kiosk 或钱包 |
| **限制方式** | 每笔转账生成 **Request**，须发行方包内 **resolve**（任意逻辑：KYC、白名单、限额等） | **黑名单**：被列地址不能收/发该 Coin；可选全局暂停 | **TokenPolicy**：按动作（transfer/spend 等）配置 Rule，须 prove 后 confirm | **TransferPolicy**：按 Rule 收版税、锁定 Kiosk 等，满足后 confirm_request |
| **谁做校验** | **发行方自己的 Move 模块**（approve_transfer 等），可读链上/链下 KYC 等 | 链上 **DenyList** 系统对象，DenyCap 持有者维护名单 | 链上 **TokenPolicy**，Rule 的 prove 在合约内 | 链上 **TransferPolicy**，Rule 的 add_receipt 在合约内 |
| **发现与索引** | Chest/Policy 地址**可推导**，无需事件即可查余额 | 普通对象，按类型与 owner 查询 | 普通对象，按类型与 owner 查询 | 需 Policy 与 Kiosk 对象 ID |
| **Clawback** | **支持**（Policy 注册时可选，由发行方发起 clawback 请求并 resolve） | 不支持（仅禁止转移） | 一般不支持 | 不适用 |
| **解锁到链上通用余额** | 通过 **UnlockFunds** 请求，由 Policy 决定是否允许「流出 PAS 体系」 | 无「解锁」概念，仅黑名单解除 | 无「解锁」概念 | 不涉及 |
| **典型场景** | 合规稳定币、证券型代币、需 KYC/AML 的资产 | 制裁名单、简单黑名单合规 | 游戏积分、忠诚度、仅限应用内使用 | NFT 版税、NFT 锁定在 Kiosk |

### 选型建议

- **只需黑/白名单、无需每笔自定义逻辑**：DenyList 受监管代币即可。
- **同质化 + 每笔转账都要做 KYC/限额/白名单等自定义检查**：用 **PAS**，在 resolve 里实现你的规则。
- **同质化 + 仅限在自家应用内 transfer/spend**：闭环 **Token + TokenPolicy** 更轻。
- **NFT 版税、Kiosk 内交易与锁定**：用 **Kiosk + TransferPolicy**。

---

## Coin、受监管 Coin、闭环 Token 与 PAS 详解

下面从「存储与转移模型」「谁做校验」「能表达什么规则」「典型用途」四方面，把 **标准 Coin**、**DenyList 受监管 Coin**、**闭环 Token**、**PAS** 说清，并说明**为什么要 PAS**。

### 1. 标准 Coin（普通代币）

| 项目 | 说明 |
|------|------|
| **创建方式** | `coin_registry::new_currency_with_otw` + `finalize`，得到 `TreasuryCap<T>`、`MetadataCap<T>` |
| **存储形态** | **Coin\<T\>** 或 **Balance\<T\>** 在用户地址下，和任意 Sui 对象一样可自由持有、转移 |
| **转移方式** | 任意人可 `coin::transfer` 或 `balance::send_funds`，无需发行方或第三方参与 |
| **谁做校验** | 无。链上不对「谁可以转、转给谁、转多少」做额外校验 |
| **能表达什么规则** | 无链上合规规则，仅依赖应用层或链下约束 |
| **Clawback / 收回** | 不支持。发行方无法从用户地址收回已转出的代币 |
| **典型用途** | 通用支付、DeFi、无合规要求的同质化代币 |

**小结**：Coin 是「完全开放」的同质化资产，适合不需要合规或转移限制的场景。

---

### 2. DenyList 受监管 Coin（黑名单代币）

| 项目 | 说明 |
|------|------|
| **创建方式** | 在 Coin 创建流程上多加一步 **`coin_registry::make_regulated`**，得到 **`DenyCapV2<T>`**；代币仍为链上标准 Coin |
| **存储形态** | 仍是 **Coin\<T\>** 在用户地址，和普通 Coin 一致 |
| **转移方式** | 仍是标准 `coin::transfer`，但**链上在转移时检查 DenyList**：若发送方或接收方在黑名单中，转移被拒绝 |
| **谁做校验** | **DenyList 系统对象** + **DenyCapV2** 维护的黑名单；校验逻辑固定为「地址是否在名单中」 |
| **能表达什么规则** | **仅黑名单**：禁止某些地址收/发；可选**全局暂停**（暂停该代币所有转移） |
| **Clawback / 收回** | 不支持。只能「禁止转移」，不能把已持有的代币从地址中收回 |
| **典型用途** | 制裁名单、简单合规黑名单、需要「一键暂停」的稳定币 |

**小结**：受监管 Coin 在「标准 Coin + 黑名单 + 可选全局暂停」范围内做合规，**不能**做按笔的 KYC、白名单、限额、自定义逻辑。

---

### 3. 闭环 Token（Closed-Loop Token）

| 项目 | 说明 |
|------|------|
| **创建方式** | `coin_registry::new_currency_with_otw` + `finalize` 得到货币元数据，再用 **`token::new_policy`** 创建 **TokenPolicy\<T\>**，并为各**动作**（transfer、spend、to_coin 等）绑定 **Rule** |
| **存储形态** | **Token\<T\>**（无 `store`），不能随意转手；只能通过 **ActionRequest** 发起操作，满足 Policy 的 Rule 并 **confirm** 后才完成 |
| **转移方式** | `token::transfer` 生成 **ActionRequest**；用户（或应用）调用各 Rule 的 **prove** 往 request 上「盖章」，再 **token::confirm_request** 完成转移 |
| **谁做校验** | **TokenPolicy** 上挂的 **Rule**（如 CrownCouncilRule）；每个 Rule 在 **prove** 里实现自己的逻辑（成员集合、时间锁等） |
| **能表达什么规则** | 按**动作**（transfer / spend / to_coin）配置不同 Rule；可做白名单、成员校验、时间锁等，但规则是「满足 Rule 即放行」，**不能**由发行方在链上做「每笔审批」或读链下 KYC |
| **Clawback / 收回** | 一般不提供；若要收回应由发行方通过自有 Cap 或 Rule 设计实现 |
| **典型用途** | 游戏内货币、忠诚度积分、仅限应用内使用的代币、需要「满足规则才可转」的同质化 Token |

**小结**：闭环 Token 是「同质化但非自由流通」的 Token，规则由 **Rule + prove** 表达，适合应用内闭环；**不是**「每笔都经发行方或链下 KYC 审批」的模型。

---

### 4. PAS（许可资产标准）

| 项目 | 说明 |
|------|------|
| **创建方式** | 依赖 **PAS 包**（Namespace、Templates 等）；发行方用 **coin_registry** 等创建货币后，用 **policy::new_for_currency** 在 PAS 里注册 **Policy\<Balance\<C\>\>**，并可选配置 **Clawback** |
| **存储形态** | 余额只能在 **Chest** 中（每地址或每对象一个派生 Chest）；**没有**「裸 Coin 在钱包」的形态，所有转入必须先进入 Chest |
| **转移方式** | **chest::send_balance** 生成 **Request\<SendFunds\>**（热土豆）；同一 PTB 内必须调用**发行方包**里的解析函数（如 **approve_transfer**），做任意校验后 **request.approve(...)**，再 **send_funds::resolve_balance** 才完成 Chest→Chest 转账 |
| **谁做校验** | **发行方自己的 Move 模块**（解析函数）；可读链上状态（KYC 表、白名单）、也可依赖链下输入（通过参数或预言机），**每笔**都可做不同逻辑 |
| **能表达什么规则** | **任意链上/链下逻辑**：KYC、白名单、黑名单、单笔限额、冷却期、监管审批等；还可区分 **send_funds / unlock_funds / clawback_funds** 配置不同审批 |
| **Clawback / 收回** | **支持**。Policy 注册时可选 **clawback_allowed**；发行方发起 **clawback_balance** 请求并满足 Policy 审批后 **resolve**，即可从某 Chest 收回余额 |
| **解锁到链上** | **UnlockFunds** 请求：经 Policy 审批后可将余额从 PAS 体系解锁为链上通用 Balance/Coin，用于赎回或退出 |
| **典型用途** | 合规稳定币、证券型代币、需 KYC/AML 的资产、需要监管收回或解锁控制的场景 |

**小结**：PAS 是「每笔转移都可被发行方自定义逻辑约束」的同质化资产框架，且支持 Clawback 与可控解锁。

---

## 为什么要 PAS：三种方案覆盖不了的场景

- **Coin**：不限制谁转、转给谁、转多少，无法做合规或每笔审批。
- **Deny Coin**：只能「禁止名单内地址」，不能做「仅允许 KYC 用户」「单笔限额」「每笔经发行方逻辑放行」。
- **闭环 Token**：规则是「满足 Rule 即放行」，规则在链上固定（如成员集、时间锁），**不能**做「每笔由发行方或链下 KYC 审批」；且一般无 Clawback、无「解锁到链上」的标准路径。

**PAS 要解决的问题**恰恰是：

1. **每笔转移都可执行自定义合规逻辑**（KYC、限额、白名单、黑名单、监管审批等），且逻辑在**发行方自己的 Move 模块**里，可演进、可升级。
2. **需要 Clawback**：监管或司法要求时，发行方能从指定 Chest 收回资产。
3. **需要可控「解锁」**：在合规允许时，将资产从 PAS 体系解锁为链上通用余额（如赎回为稳定币或法币通道）。
4. **钱包/SDK 友好**：通过 **Templates + Command**，链下可以按「审批类型」自动拼出解析 PTB，而不必手写每家的解析逻辑。

因此：**当你要做「同质化 + 每笔可审批 + 可选 Clawback/解锁」的合规资产时，应选 PAS**；若只需黑名单或应用内闭环，用 Deny Coin 或闭环 Token 更简单。

---

## 用途对比一览

| 需求 | Coin | Deny Coin | 闭环 Token | PAS |
|------|------|-----------|------------|-----|
| 自由转账、无合规 | ✅ 默认 | ✅ 未列名单即可 | ❌ 须过 Rule | ❌ 须过解析 |
| 禁止某些地址收/发 | ❌ | ✅ 黑名单 | 可用 Rule 模拟 | ✅ 解析里可做 |
| 全局暂停 | ❌ | ✅ | 需自建 | 可用 versioning 阻断 |
| 仅允许某类用户（如 KYC）每笔校验 | ❌ | ❌ | ❌ Rule 无法表达「链下 KYC」 | ✅ 解析里读 KYC/白名单 |
| 单笔限额、冷却期等自定义规则 | ❌ | ❌ | 仅 Rule 能表达的有限形式 | ✅ 任意逻辑 |
| 发行方收回资产（Clawback） | ❌ | ❌ | 一般不提供 | ✅ Policy 可选 |
| 合规「解锁」到链上余额 | ❌ | ❌ | 有 to_coin 等但非标准解锁 | ✅ UnlockFunds |
| 钱包/SDK 自动拼解析交易 | — | — | — | ✅ Templates + Command |
| 适用典型场景 | 通用支付、DeFi | 制裁/黑名单合规 | 游戏积分、应用内代币 | 证券型代币、合规稳定币、KYC 资产 |

## 小结

- **Coin**：自由转移、无合规；**Deny Coin**：黑名单 + 可选全局暂停，无每笔逻辑、无 Clawback；**闭环 Token**：Rule + ActionRequest，应用内闭环，无每笔发行方审批、一般无 Clawback；**PAS**：Chest + Request + 发行方解析，每笔可自定义合规、可选 Clawback 与 Unlock。
- PAS 面向**许可型同质化资产**，通过 **Chest + Request + Policy 解析** 实现「每笔转移都可被发行方规则约束」；**为什么要 PAS**：当需要每笔 KYC/限额/白名单、Clawback 或合规解锁时，Coin / Deny Coin / 闭环 Token 无法满足，选 PAS。
- 选型时结合「用途对比一览」表：按需求看哪一列打勾，即可在四种方案中做出取舍。


---


<!-- source: 18_pas/02-core-abstractions.md -->
## 21.2 核心抽象：Namespace、Chest、Policy

# 核心抽象：Namespace、Chest、Policy

## 模块与入口一览

| 模块 | 主要类型 / 函数 | 说明 |
|------|-----------------|------|
| `pas::namespace` | `Namespace`, `setup`, `block_version`, `unblock_version`, `chest_address`, `policy_address` | 单例、派生地址、版本阻断 |
| `pas::chest` | `Chest`, `Auth`, `create_and_share`, `send_balance`, `unlock_balance`, `clawback_balance`, `deposit_balance`, `new_auth` | 创建 Chest、发起请求、存款、鉴权 |
| `pas::policy` | `Policy<T>`, `PolicyCap<T>`, `new_for_currency`, `share`, `set_required_approval`, `required_approvals` | 创建策略、配置审批、查询 |
| `pas::templates` | `Templates`, `setup`, `set_template_command`, `unset_template_command` | Command 注册，供 SDK 解析 |
| `pas::request` | `Request<K>`, `approve`, `data`, `approvals` | 热土豆、收集审批 |
| `pas::send_funds` / `unlock_funds` / `clawback_funds` | `SendFunds<T>`, `resolve_balance` / `resolve` | 请求数据与 resolve 入口 |
| `pas::keys` | `send_funds_action()`, `unlock_funds_action()`, `clawback_funds_action()`, `is_valid_action` | 动作名字符串（`"send_funds"` 等） |

---

## Namespace

**Namespace** 是 PAS 中的全局单例共享对象，负责：

- 为每个**地址**（或对象）派生唯一的 **Chest** 地址；
- 为每种**代币类型**派生唯一的 **Policy\<Balance\<C\>\>** 地址；
- 存储 **Templates**（各审批类型对应的 PTB Command）；
- 管理 **Versioning**（block_version / unblock_version），用于紧急阻断或升级兼容。

发布 PAS 包时，`init` 会创建并 `share_object` 一个 Namespace。之后通过 `namespace::setup(namespace, &upgrade_cap)` 绑定 UpgradeCap，即可用该 Cap 调用 `block_version` / `unblock_version`。

派生规则依赖 **derived_object**：Chest 由 `keys::chest_key(owner)` 派生，Policy 由 `keys::policy_key<Balance<C>>()` 派生，因此**同一地址在同一 Namespace 下只有一个 Chest**，**同一代币类型只有一个 Policy**，便于钱包与索引器按地址/类型推算 ID。

### Namespace 接口速查

| 函数 | 签名 | 说明 |
|------|------|------|
| `setup` | `entry fun setup(namespace: &mut Namespace, cap: &UpgradeCap)` | 绑定 UpgradeCap，之后才能 block/unblock 版本、claim 派生对象 |
| `block_version` | `public fun block_version(namespace: &mut Namespace, cap: &UpgradeCap, version: u64)` | 阻断指定包版本 |
| `unblock_version` | `public fun unblock_version(namespace: &mut Namespace, cap: &UpgradeCap, version: u64)` | 解除版本阻断 |
| `chest_exists` | `public fun chest_exists(namespace: &Namespace, owner: address): bool` | 某地址是否已有 Chest |
| `chest_address` | `public fun chest_address(namespace: &Namespace, owner: address): address` | 派生 Chest 地址（用于查询或 deposit） |
| `policy_exists` | `public fun policy_exists<T>(namespace: &Namespace): bool` | 是否存在 Policy\<T\> |
| `policy_address` | `public fun policy_address<T>(namespace: &Namespace): address` | 派生 Policy\<T\> 的地址 |

## Chest

**Chest** 是存放某一种或多种 PAS 代币余额的容器，与「所有者」一一对应：

- **所有者**：可以是 `address`（用户钱包）或对象（用于账户抽象/协议托管）。
- **每个所有者在一个 Namespace 下只有一个 Chest**（由 `derived_object::claim(namespace, chest_key(owner))` 保证）。
- Chest 创建后通常 **share_object**，便于任何人向该 Chest 存款或查询余额；只有所有者（或授权证明 **Auth**）才能发起转出、解锁或被动被 clawback。

余额只能：

- 从 Chest A **转到** Chest B（通过 **SendFunds** 请求）；
- 从 Chest **解锁**到链上普通余额（通过 **UnlockFunds** 请求，若 Policy 支持）；
- 被发行方 **Clawback**（通过 **ClawbackFunds** 请求，若 Policy 在注册时允许）。

Chest 内部使用 `balance::Balance<C>` 等存储，与 Sui 标准余额兼容，RPC/钱包可按「Chest 的派生地址」查询余额。

### Chest 接口速查

| 函数 | 签名 | 说明 |
|------|------|------|
| `create` | `public fun create(namespace: &mut Namespace, owner: address): Chest` | 为 owner 创建 Chest（需随后 share） |
| `create_and_share` | `public fun create_and_share(namespace: &mut Namespace, owner: address)` | 创建并共享，一步完成 |
| `share` | `public fun share(chest: Chest)` | 将 Chest 设为共享对象 |
| `send_balance` | `public fun send_balance<C>(from: &mut Chest, auth: &Auth, to: &Chest, amount: u64, _ctx: &mut TxContext): Request<SendFunds<Balance<C>>>` | 从 from 转 amount 到 to Chest，返回待解析的 Request |
| `unsafe_send_balance` | `public fun unsafe_send_balance<C>(from: &mut Chest, auth: &Auth, recipient_address: address, amount: u64, _ctx: &mut TxContext): Request<SendFunds<Balance<C>>>` | 按**地址**转账（可转给尚未建 Chest 的地址），易用错，慎用 |
| `unlock_balance` | `public fun unlock_balance<C>(chest: &mut Chest, auth: &Auth, amount: u64, _ctx: &mut TxContext): Request<UnlockFunds<Balance<C>>>` | 发起解锁请求 |
| `clawback_balance` | `public fun clawback_balance<C>(from: &mut Chest, amount: u64, _ctx: &mut TxContext): Request<ClawbackFunds<Balance<C>>>` | 发行方发起收回请求（无 Auth） |
| `deposit_balance` | `public fun deposit_balance<C>(chest: &Chest, balance: Balance<C>)` | 无许可向 Chest 存入余额 |
| `owner` | `public fun owner(chest: &Chest): address` | 返回 Chest 所有者地址 |
| `new_auth` | `public fun new_auth(ctx: &TxContext): Auth` | 用交易发送方生成 Auth |
| `new_auth_as_object` | `public fun new_auth_as_object(uid: &mut UID): Auth` | 用对象 UID 生成 Auth（对象拥有 Chest 时） |
| `sync_versioning` | `public fun sync_versioning(chest: &mut Chest, namespace: &Namespace)` | 与 Namespace 同步版本信息 |

## Policy 与 PolicyCap

**Policy\<T\>** 与某种可转移类型 `T`（实践中多为 `Balance<C>`）绑定，表示「该类型在 PAS 下的转移规则」：

- **required_approvals**：`VecMap<String, VecSet<TypeName>>`，键为动作名（如 `"send_funds"`、`"unlock_funds"`、`"clawback_funds"`），值为需要收集的**审批类型**（TypeName）集合；只有收集齐这些审批后，对应 Request 才能被 resolve。
- **clawback_allowed**：注册时确定，是否允许对该类型的 Chest 发起 clawback。
- **versioning**：与 Namespace 同步，用于阻断旧版本。

**PolicyCap\<T\>** 与 Policy 一一对应，持有者可：

- 调用 `policy::set_required_approval` / `remove_action_approval` 配置各动作所需的审批类型；
- 与 **Templates** 配合，为每种审批类型设置 PTB **Command**，供 SDK 解析转账时使用。

创建方式（以代币类型 `Balance<C>` 为例）：`policy::new_for_currency(namespace, &mut treasury_cap, clawback_allowed)`，得到 `(Policy<Balance<C>>, PolicyCap<Balance<C>>)`；然后 `policy::share(policy)`，PolicyCap 由发行方保管。

### Policy 接口速查

| 函数 | 签名 | 说明 |
|------|------|------|
| `new_for_currency` | `public fun new_for_currency<C>(namespace: &mut Namespace, _cap: &mut TreasuryCap<C>, clawback_allowed: bool): (Policy<Balance<C>>, PolicyCap<Balance<C>>)` | 为货币 C 创建 Policy 与 PolicyCap |
| `share` | `public fun share<T>(policy: Policy<T>)` | 共享 Policy，供 resolve 等使用 |
| `set_required_approval` | `public fun set_required_approval<T, A: drop>(policy: &mut Policy<T>, cap: &PolicyCap<T>, action: String)` | 设置某动作（如 `"send_funds"`）需要审批类型 A |
| `remove_action_approval` | `public fun remove_action_approval<T>(policy: &mut Policy<T>, _: &PolicyCap<T>, action: String)` | 移除某动作的审批要求（导致该动作无法 resolve） |
| `required_approvals` | `public fun required_approvals<T>(policy: &Policy<T>, action_type: String): VecSet<TypeName>` | 查询某动作所需的审批类型集合 |
| `sync_versioning` | `public fun sync_versioning<T>(policy: &mut Policy<T>, namespace: &Namespace)` | 与 Namespace 同步版本 |

合法 `action` 字符串由 `pas::keys` 定义：`send_funds_action()`、`unlock_funds_action()`、`clawback_funds_action()`（即 `"send_funds"`、`"unlock_funds"`、`"clawback_funds"`）。

## 小结

- **Namespace**：单例，负责派生 Chest/Policy/Templates 及版本控制。
- **Chest**：每地址（或对象）一个，存 PAS 余额；仅能通过 SendFunds / UnlockFunds / Clawback 变动。
- **Policy + PolicyCap**：按代币类型规定各动作所需审批类型，Cap 持有者配置审批与 Templates。


---


<!-- source: 18_pas/03-requests-and-resolution.md -->
## 21.3 请求与解析

# 请求与解析：SendFunds、UnlockFunds、Clawback

## 请求与解析相关接口速查

| 模块 | 函数 / 类型 | 说明 |
|------|-------------|------|
| `pas::request` | `Request<K>`, `approve<K, U>(request, _approval: U)`, `data<K>(request): &K`, `approvals<K>(request): VecSet<TypeName>` | 热土豆：approve 收集审批，data 取请求体，resolve 时校验 approvals |
| `pas::send_funds` | `SendFunds<T>`, `sender/recipient/sender_chest_id/recipient_chest_id/funds`, `resolve_balance<C>(request, policy)` | 发送请求数据与 resolve：将 balance 转入 recipient_chest_id |
| `pas::unlock_funds` | `UnlockFunds<T>`, `owner/chest_id/funds`, `resolve(request, policy): T`, `resolve_unrestricted_balance<C>(request, namespace): Balance<C>` | 解锁：有 Policy 时用 resolve；无 Policy 时用 resolve_unrestricted_balance |
| `pas::clawback_funds` | `ClawbackFunds<T>`, `owner/chest_id/funds`, `resolve(request, policy): T` | 收回：仅当 Policy 允许 clawback 时可 resolve，返回被收回的 T |

## Request 是什么

在 PAS 中，任何「从 Chest 转出」或「被收回」的操作都会先产生一个 **Request\<K\>**，其中 `K` 是请求数据类型（如 `SendFunds<Balance<C>>`、`UnlockFunds<Balance<C>>`、`ClawbackFunds<Balance<C>>`）。Request 是一个**热土豆**：必须在同一笔交易（PTB）内被 **resolve**，否则交易失败。

- **approvals**：本请求已收集的审批类型集合（TypeName）。
- **data**：请求数据（发送方、接收方、金额、Chest ID 等）。

只有当前请求的 `approvals` 与 Policy 中该动作的 **required_approvals** 完全一致时，才能调用对应请求模块的 **resolve** 消费 Request 并完成余额移动。`request::resolve` 为包内函数，对外暴露的是 `send_funds::resolve_balance`、`unlock_funds::resolve`、`clawback_funds::resolve` 等。

### request 模块接口

- **approve\<K, U: drop\>(request: &mut Request\<K\>, _approval: U)**：向 request 加入审批类型 U（用 `type_name::with_defining_ids<U>()` 记录）。
- **data\<K\>(request: &Request\<K\>): &K**：获取请求体，用于解析函数内读取 sender、recipient、amount 等做业务校验。
- **approvals\<K\>(request: &Request\<K\>): VecSet\<TypeName\>**：当前已收集的审批类型集合（一般由 resolve 内部使用）。

## 三种请求类型

### SendFunds

**发送余额到另一个 Chest**。用户（或协议）调用 `chest::send_balance(from, auth, to, amount, ctx)`：

- 从 `from` Chest 扣减 `amount`，生成 `Request<SendFunds<Balance<C>>>`，其中包含 sender、recipient、sender_chest_id、recipient_chest_id、funds。
- 在 PTB 中需要调用**发行方包**中的「解析函数」，该函数内部对 Request 做业务校验（KYC、白名单、限额等），然后调用 `request.approve(SomeApproval())` 凑齐 Policy 要求的审批类型，最后由 PAS 模块完成 `send_funds::resolve_balance(request, policy)`，将 balance 转入 recipient_chest_id。

**SendFunds 数据访问器**（在解析函数中常用）：

- `send_funds::sender(request.data())` / `send_funds::recipient(request.data())`：发送方、接收方**地址**（非 chest id）。
- `send_funds::sender_chest_id` / `send_funds::recipient_chest_id`：Chest 的 ID。
- `send_funds::funds(request.data())`：`&Balance<C>`，可 `.value()` 取金额。

### UnlockFunds

**将余额从 PAS 体系解锁到链上**（例如变成普通 Coin 或转给非 Chest 地址）。调用 `chest::unlock_balance(chest, auth, amount, ctx)` 会生成 `Request<UnlockFunds<Balance<C>>>`。解析逻辑同样在发行方包中实现，满足 Policy 的 `unlock_funds` 所需审批后，调用 `unlock_funds::resolve(request, policy)` 得到 `Balance<C>`，再由发行方或用户将该 balance 转成 Coin 或做后续处理。

**两种解锁方式**：

- **有 Policy 的资产**：必须用 `unlock_funds::resolve(request, policy): T`，且 Policy 中需配置 `unlock_funds` 的 required_approvals。
- **无 Policy 的资产**（如 SUI）：任何人可调用 `unlock_funds::resolve_unrestricted_balance<C>(request, namespace): Balance<C>`，将余额取回；若该类型存在 Policy 则断言失败。

### ClawbackFunds

**发行方收回某 Chest 中的余额**。仅当该代币类型的 Policy 在注册时设置了 `clawback_allowed = true` 时可用。调用 `chest::clawback_balance(from, amount, ctx)` 生成 `Request<ClawbackFunds<Balance<C>>>`，由发行方在 PTB 中提供 Policy 要求的审批（例如监管授权 witness），然后 `clawback_funds::resolve(request, policy): T` 返回被收回的余额 T（如 `Balance<C>`），发行方再将该 balance 转入自己的 Treasury 或专用 Chest。

## 解析流程简述

1. 用户/前端发起「转账」或「解锁」：构造 PTB，其中一步调用 `chest::send_balance` 或 `chest::unlock_balance`，得到未完成的 Request。
2. 同一 PTB 中，必须再调用**发行方包**中的解析函数（例如 `approve_transfer`），传入该 Request 以及所需系统对象（如 Clock、Faucet）。
3. 解析函数内做业务检查（金额上限、KYC、禁止地址等），然后 `request.approve(TransferApproval())`（或发行方定义的其它审批类型）。
4. 最后调用 PAS 的 `send_funds::resolve_balance(request, policy)`（或对应 unlock/clawback 的 resolve），Request 被消费，余额完成移动。
5. 若 Policy 要求多种审批类型，则需在 PTB 中多次调用不同的 approve，凑齐后再 resolve。

## 小结

- 所有「转出或收回」都通过 **Request** 热土豆完成；须在**同一 PTB** 内凑齐 **required_approvals** 并 **resolve**。
- **SendFunds**：Chest → Chest；**UnlockFunds**：Chest → 链上通用；**ClawbackFunds**：发行方收回，仅当 Policy 允许时可用。


---


<!-- source: 18_pas/04-templates-and-command.md -->
## 21.4 Templates 与 Command

# Templates 与 Command：SDK 如何解析转账

## Templates 与 PTB 接口速查

| 模块 | 函数 / 类型 | 说明 |
|------|-------------|------|
| `pas::templates` | `Templates`, `setup(namespace)` | 创建并共享 Templates（entry） |
| `pas::templates` | `set_template_command<A>(templates, permit, command)`, `unset_template_command<A>(templates, permit)` | 按审批类型 A 注册/移除 PTB Command |
| `ptb::ptb` | `move_call(package_id, module, function, arguments, type_arguments): Command` | 构造一次 Move 调用的 Command |
| `ptb::ptb` | `ext_input(name): Argument` | 占位参数，由链下解析为「request」等，name 如 `"pas:request"` |
| `ptb::ptb` | `object_by_id(id): Argument` | 按对象 ID 的占位，链下解析时填入实际对象 |
| `ptb::ptb` | `clock()`, `random()`, `display()` | 常用系统对象（0x6 Clock、0x8 Random、0xD DisplayRegistry） |

## 为什么需要 Templates

PAS 的解析逻辑在**发行方自己的包**里（例如 `approve_transfer`），钱包和 SDK 无法硬编码每个发行方的入口。因此 PAS 引入 **Templates**：发行方在链上为每种**审批类型**注册一个 **Command**（PTB 指令描述），SDK 只需根据「当前 Request 类型 + Policy 要求的审批类型」从 Templates 中取出对应 Command，即可构造「解析这一步」的 PTB，而无需理解具体 Move 逻辑。

## Templates 与 Command 的关系

- **Templates** 是一个共享对象，由 Namespace 派生，内部用动态字段存储 `TypeName -> Command` 的映射。
- **Command** 来自 `ptb::ptb` 模块，描述「如何调用某包的某函数、传哪些参数」；例如：`ptb::move_call(package_id, module_name, "approve_transfer", [request_arg, clock_arg], type_args)`。
- 发行方在 `setup`（或后续更新）中调用 `templates::set_template_command(templates, permit, command)`，将「某审批类型 A」与「用于收集 A 的 PTB Command」绑定；**Permit\<A\>** 由审批类型 A 的**定义包**提供（如 `internal::permit<TransferApproval>()`），证明调用方有权为该类型注册模板。

### set_template_command 签名

```move
public fun set_template_command<A: drop>(
    templates: &mut Templates,
    _: internal::Permit<A>,
    command: Command,
)
```

键为 `type_name::with_defining_ids<A>()`，即审批类型 A 的 TypeName；SDK 根据 Policy 的 required_approvals 查到类型名，再在 Templates 中取对应 Command。

这样，当 SDK 看到「需要 TransferApproval 才能 resolve SendFunds」时，可查询 Templates 中 `TransferApproval` 对应的 Command，把当前 Request 和所需对象 ID 填入，得到解析用的 PTB 片段。

## 发行方如何设置 Command

在发行方包的 `setup` 中（示例见 [demo_usd](https://github.com/MystenLabs/pas/blob/main/packages/testing/demo_usd/sources/demo_usd.move)）：

1. 用 `policy::new_for_currency` 创建 Policy 与 PolicyCap，并 `policy::set_required_approval<_, TransferApproval>(&cap, "send_funds")`。
2. 构造 Command：  
   - **package_id**：`type_name::with_defining_ids<DEMO_USD>().address_string().to_string()`（即本包地址字符串）。  
   - **arguments**：`vector[ptb::ext_input("pas:request"), ptb::object_by_id(clock_id)]`，其中 `"pas:request"` 表示链下解析时填入当前 PTB 中的 Request 对象；Clock 可用 `ptb::clock()` 或具体 ID。  
   - **type_arguments**：若解析函数泛型参数为代币类型，传 `vector[(*type_name.as_string()).to_string()]`。  
   ```move
   let cmd = ptb::move_call(
       type_name::with_defining_ids<DEMO_USD>().address_string().to_string(),
       "demo_usd",
       "approve_transfer",
       vector[ptb::ext_input("pas:request"), ptb::object_by_id(@0x6.to_id())],
       vector[(*type_name.as_string()).to_string()],
   );
   ```
3. 调用 `templates::set_template_command(templates, internal::permit<TransferApproval>(), cmd)`。

之后，任何客户端只要知道「SendFunds 需要 TransferApproval」，就可以从 Templates 读取该 TypeName 对应的 Command，把 `ext_input("pas:request")` 等替换成当前交易的 Request 与对象，组装出完整的 resolve PTB。

## 小结

- **Templates** 存的是「审批类型 → PTB Command」的映射，供 SDK 自动构造解析交易。
- 发行方在 **setup** 时用 **set_template_command** 注册自己包的解析入口（如 `approve_transfer`），实现「可发现、可自动化」的合规解析。


---


<!-- source: 18_pas/05-versioning-and-clawback.md -->
## 21.5 版本控制与 Clawback

# 版本控制与 Clawback

## 相关接口速查

| 模块 | 函数 / 说明 |
|------|-------------|
| `pas::namespace` | `block_version(namespace, cap, version)`, `unblock_version(namespace, cap, version)`：需先 `setup` 绑定 UpgradeCap |
| `pas::versioning` | `assert_is_valid_version(versioning)`：在 Chest/Policy 操作中由 PAS 内部调用，使用 `breaking_version!()` 宏得到的包版本；若该版本被 block 则断言失败 |
| `pas::chest` / `policy` | `sync_versioning(chest/policy, namespace)`：任何人可调，将对象版本信息与 Namespace 同步，以继续在 block 后使用新版本 |

## Versioning

PAS 的 **Versioning** 与 Namespace 绑定，用于在紧急情况下**阻断**特定包版本，使旧版本无法再参与 Chest/Policy 操作（例如 resolve、send_balance）。Namespace 持有 UpgradeCap 后，管理员可调用：

- `namespace::block_version(namespace, cap, version)`：阻断该版本；
- `namespace::unblock_version(namespace, cap, version)`：解除阻断。

Policy 和 Chest 在关键路径上会调用 `versioning.assert_is_valid_version()`，若当前包版本已被 block，则断言失败，从而强制用户或协议升级到新版本后再与 PAS 交互。这为安全修复或破坏性升级提供了「紧急制动」能力。

## Clawback

**Clawback** 指发行方（或授权方）从某 Chest 中**收回**一定数量代币，通常用于监管要求（如法院令、制裁合规）。PAS 中：

- 只有在**注册 Policy** 时传入 `clawback_allowed = true` 的代币类型才允许 clawback。
- 发行方调用 `chest::clawback_balance(from_chest, amount, ctx)` 生成 `Request<ClawbackFunds<Balance<C>>>`。
- 在同一 PTB 中，发行方提供 Policy 为 `clawback_funds` 动作要求的审批（例如监管 Cap 或内部 witness），然后调用 `clawback_funds::resolve_balance(...)`，将余额转入发行方指定的目标（如 Treasury 或专用 Chest）。

Clawback 一旦在注册时启用，无法通过升级关闭（由 Policy 的 `clawback_allowed` 在创建时确定），因此发行方需要在设计时明确是否接受该能力。

## 小结

- **Versioning**：通过 block_version 禁止旧版本参与 PAS，用于紧急修复或升级。
- **Clawback**：可选功能，仅在 Policy 注册时开启；由发行方发起请求并满足审批后 resolve，将指定 Chest 中的余额收回。


---


<!-- source: 18_pas/06-practice-simple.md -->
## 21.6 实战一：简单合规代币

# 实战一：简单合规代币（限额与禁止地址）

本实战基于 PAS 仓库中的 [demo_usd](https://github.com/MystenLabs/pas/blob/main/packages/testing/demo_usd/sources/demo_usd.move)，实现一个「简单合规」的 PAS 代币：单笔转账金额上限、禁止自转、以及（在 V2 中）禁止向某地址转账。

## 依赖与入口

- **依赖**：`pas`、`ptb`、`sui`（含 `coin_registry`、`balance`、`clock` 等）。
- **init**：用 `coin_registry::new_currency_with_otw` 注册货币，并 `share_object(Faucet { cap, metadata, policy_cap: none() })`。
- **entry setup**：入参 `namespace: &mut Namespace`、`templates: &mut Templates`、`faucet: &mut Faucet`；内部创建 Policy、注册 Command、`policy.share()`。

## 目标

- 使用 PAS 的 Chest + Policy + Request 模型；
- 在 **approve_transfer** 中实现：金额 &lt; 10K、sender ≠ recipient、V2 中 recipient ≠ 0x2；
- 通过 **setup** 注册 Policy 与 Templates Command，便于 SDK 解析。

## 核心代码要点

### 1. 代币与 Faucet

- 用 **coin_registry** 注册 `DEMO_USD` 货币（精度 6、名称/描述等），得到 `TreasuryCap` 与 `MetadataCap`。
- **Faucet** 持有 `cap`、`metadata` 和可选的 `policy_cap`；`faucet_mint_balance` 用于测试时铸造余额。

### 2. 审批类型

- **TransferApproval**：V1 解析用；
- **TransferApprovalV2**：V2 解析用（演示升级后切换审批逻辑）；
- **UnlockApproval**：若需解锁到链上，可在此模块实现 `approve_unlock` 并注册。

### 3. approve_transfer（V1）与接口使用

解析函数签名需与 Command 中注册的 `move_call` 一致（参数顺序、类型）：

```move
public fun approve_transfer<T>(request: &mut Request<SendFunds<Balance<T>>>, _clock: &Clock) {
    let data = request.data();
    assert!(send_funds::funds(data).value() < 10_000 * 1_000_000, EInvalidAmount);
    assert!(send_funds::sender(data) != send_funds::recipient(data), ECannotSelfTransfer);
    request.approve(TransferApproval());
}
```

- **request.data()** 得到 `&SendFunds<Balance<T>>`，用 **send_funds::sender/recipient/funds** 取字段；**funds().value()** 为金额（6 位精度下 10K = 10_000 * 1_000_000）。
- 禁止 sender == recipient。
- 通过则 **request.approve(TransferApproval())**，与 Policy 的 `required_approvals["send_funds"]` 一致后，同一 PTB 中可调用 **send_funds::resolve_balance(request, policy)** 完成转账。

### 4. approve_transfer_v2（V2）

- 仅校验 `request.data().recipient() != @0x2`（禁止向 0x2 转账）；
- `request.approve(TransferApprovalV2())`。
- 通过 **use_v2** 将 Policy 的 send_funds 改为需要 TransferApprovalV2，并更新 Templates 中对应 Command，实现「升级后规则变更」。

### 5. setup

- `policy::new_for_currency(namespace, &mut faucet.cap, true)`：创建 Policy 与 PolicyCap，`clawback_allowed = true`。
- `policy.set_required_approval<_, TransferApproval>(&cap, "send_funds")`：send_funds 需要 TransferApproval。
- 构造 `ptb::move_call(..., "approve_transfer", [request, clock], type_args)`，用 **templates.set_template_command(permit<TransferApproval>(), cmd)** 注册，便于 SDK 根据 Request 类型自动构造解析 PTB。

## 流程小结

1. 用户发起 `chest::send_balance(from_chest, auth, to, amount, ctx)`，得到 `Request<SendFunds<Balance<DEMO_USD>>>`。
2. 同一 PTB 中调用 `demo_usd::approve_transfer(request, clock)`，通过则 `request.approve(TransferApproval())`。
3. 调用 `send_funds::resolve_balance(request, policy)`，完成 Chest → Chest 转账。
4. 若升级到 V2，管理员调用 **use_v2** 后，解析改为 `approve_transfer_v2`，规则变为「仅禁止转给 0x2」。

此实战展示了：**限额、自转校验、禁止某地址** 均可放在发行方自己的 `approve_*` 里，与 PAS 的 Request/Policy 无缝配合。


---


<!-- source: 18_pas/07-practice-kyc.md -->
## 21.7 实战二：KYC 合规代币

# 实战二：KYC 合规代币（仅 KYC 通过可收发）

本实战对应 [MystenLabs/pas PR #25](https://github.com/MystenLabs/pas/pull/25) 的 **KYC-compliant coin** 思路：只有通过 KYC 的地址才能接收或发送该 PAS 代币，发行方通过签发 **KYC Stamp**（或类似证明）来授权。

## 设计思路

- **KYC 状态**：链上维护「已通过 KYC 的地址」集合，或由发行方为每个用户签发一个 **KYC Stamp** 对象（如 NFT 或 one-time proof）。
- **发送/接收规则**：在 **approve_transfer**（或等价解析函数）中检查：
  - **发送方**：必须持有有效 KYC 证明（或其地址在 KYC 名单中）；
  - **接收方**：必须已通过 KYC（或将在同一 PTB 中创建 Chest 并满足「首次接收前已 KYC」的策略）。
- **发行方**：拥有 KYC 签发权（例如 KYCCap），可调用 `issue_kyc_stamp(user)` 将 Stamp 转给用户；用户后续转账时在 PTB 中传入该 Stamp，解析函数验证后 `request.approve(KYCApproval())`。

## 实现要点（概念代码）

### 1. KYC 证明类型

```move
// 发行方签发的 KYC 证明，用户持有才能参与转账
public struct KYCStamp has key, store {
    id: UID,
    user: address,
    issued_at: u64,
}
```

或使用 **Table** / **Bag** 维护 `address -> bool` 的 KYC 名单，由发行方 Cap 更新。

### 2. 审批类型

- 定义 **KYCApproval**（或 KYCTransferApproval），在 Policy 中设置 `set_required_approval<_, KYCApproval>(&cap, "send_funds")`。

### 3. approve_transfer 中的 KYC 校验与接口

在解析函数中使用 PAS 接口读取请求数据并做校验：

```move
public fun approve_kyc_transfer<C>(
    request: &mut Request<SendFunds<Balance<C>>>,
    kyc_registry: &KYCRegistry,
) {
    let data = request.data();
    assert!(kyc_registry.is_kyc(send_funds::sender(data)), ESenderNotKYC);
    assert!(kyc_registry.is_kyc(send_funds::recipient(data)), ERecipientNotKYC);
    request.approve(KYCApproval());
}
```

- **request.data()** 配合 **send_funds::sender(data)**、**send_funds::recipient(data)** 获取发送方与接收方地址；
- 校验 sender/recipient 已在链上 KYC 表或持有有效 KYCStamp；
- 通过则 **request.approve(KYCApproval())**；Policy 中需 `set_required_approval<_, KYCApproval>(&cap, "send_funds")`，Templates 中为该类型注册对应 Command。

### 4. Templates

- 为 KYCApproval 设置 Command：例如 `move_call(..., "approve_kyc_transfer", [request, kyc_stamp_or_registry], type_args)`，SDK 解析时知道需要用户提供 KYC 证明对象或由发行方服务端提供证明。

### 5. 发行方流程

- **KYC 通过**：发行方调用 `issue_kyc_stamp(user)` 将 KYCStamp 转给 user，或将 user 加入链上 KYC 表；
- **撤销 KYC**：收回 Stamp 或从表中移除，后续该用户的转账在解析时将无法通过校验。

## 与简单合规代币的对比

| 项目 | 实战一（简单合规） | 实战二（KYC 合规） |
|------|-------------------|---------------------|
| 校验依据 | 金额、sender/recipient 地址 | 发送方/接收方是否持有 KYC 证明或位于 KYC 名单 |
| 审批类型 | TransferApproval / TransferApprovalV2 | KYCApproval（需 KYCStamp 或 KYC 表） |
| 发行方能力 | 仅配置 Policy/Templates、升级解析逻辑 | 签发/撤销 KYC、控制谁可参与转账 |
| 典型场景 | 限额、黑名单 | 证券型代币、合规稳定币、机构客户 |

## 小结

- KYC 合规代币在 PAS 中的实现方式：**在 resolve 前的 approve 函数里校验「发送方 + 接收方」的 KYC 状态**，通过则 approve 对应类型，由 PAS 完成 resolve。
- 参考 [PR #25](https://github.com/MystenLabs/pas/pull/25) 的 KYC-compliant coin 示例可获得完整 Move 与 setup 细节；本章给出的是通用思路与与实战一的对比，便于你在自己的包中实现类似逻辑。


---


<!-- source: appendix/index.md -->
## 附录

# 附录

本附录提供开发过程中的常用参考资料，方便随时查阅。

## 内容索引

| 附录 | 主题 | 说明 |
|------|------|------|
| A | 术语表 | Move / Sui 核心术语中英文对照 |
| B | 保留地址 | 0x1 / 0x2 / 0x6 等系统地址 |
| C | Transfer 函数参考 | transfer 模块所有函数签名 |
| D | CLI 速查表 | sui move / sui client 常用命令 |
| E | 编码规范 | 命名、文件组织、代码风格 |
| F | 代码质量检查清单 | 发布前检查项目 |


---


<!-- source: appendix/glossary.md -->
## A. 术语表

# 术语表

本附录收录 Move 和 Sui 生态系统中的核心术语，提供中英文对照和简要解释。

## A

| 术语 | 英文 | 解释 |
|------|------|------|
| 能力 | Ability | Move 类型系统中的属性标记，包括 `key`、`store`、`copy`、`drop` 四种 |
| 访问控制列表 | Access Control List (ACL) | 维护授权地址列表的权限管理模式 |
| 地址 | Address | Sui 上的 32 字节标识符，用于标识账户和对象 |
| 证明文档 | Attestation Document | TEE 签发的密码学证明，证明 enclave 运行的代码和状态 |

## B

| 术语 | 英文 | 解释 |
|------|------|------|
| Bag | Bag | 异构动态集合，可以存储不同类型的键值对 |
| BCS | Binary Canonical Serialization | Sui 使用的标准二进制序列化格式 |
| Borrow 模式 | Borrow Pattern | 使用 Hot Potato 实现的安全借用模式 |

## C

| 术语 | 英文 | 解释 |
|------|------|------|
| 能力凭证 | Capability (Cap) | 代表特权的对象，持有者可执行受保护操作 |
| Checkpoint | Checkpoint | Sui 网络确认的一批交易 |
| 时钟 | Clock | Sui 的系统时钟对象（地址 `0x6`），提供链上时间 |
| 币 | Coin | Sui 上的同质化代币类型 `Coin<T>` |
| 兼容性 | Compatibility | 包升级必须遵守的向后兼容规则 |
| 可组合性 | Composability | 函数设计为可在 PTB 中与其他函数组合调用 |
| 共识 | Consensus | 验证者就交易顺序和结果达成一致的过程 |
| copy 能力 | copy Ability | 允许值被复制的能力，与 `key` 互斥 |

## D

| 术语 | 英文 | 解释 |
|------|------|------|
| DeepBook | DeepBook | Sui 上的去中心化链上订单簿 |
| 拒绝列表 | DenyList | 系统对象（`0x403`），用于代币冻结 |
| 动态字段 | Dynamic Field | 运行时添加到对象的键值对，不计入对象大小限制 |
| 动态对象字段 | Dynamic Object Field | 值是对象的动态字段，保留独立的对象 ID |
| drop 能力 | drop Ability | 允许值被丢弃/忽略的能力，与 `key` 互斥 |
| Dry Run | Dry Run | 模拟交易执行而不实际上链，不消耗 gas |

## E

| 术语 | 英文 | 解释 |
|------|------|------|
| 纪元 | Epoch | Sui 网络的时间周期（约 24 小时），影响质押奖励和验证者变更 |
| 事件 | Event | 交易执行期间发射的数据，用于链下索引和通知 |
| 入口函数 | Entry Function | 可以作为交易入口点直接调用的函数 |
| 纠删码 | Erasure Coding | Walrus 使用的数据编码技术，提供冗余和可恢复性 |
| 临时密钥 | Ephemeral Key | ZKLogin 中使用的短期密钥对 |

## F

| 术语 | 英文 | 解释 |
|------|------|------|
| 快速路径 | Fast Path | 不涉及共享对象的交易可以跳过共识，快速执行 |
| 闪电贷 | Flash Loan | 在同一笔交易内借入和归还的即时贷款，利用 Hot Potato 保证归还 |
| 冻结对象 | Frozen Object | 不可变对象，只能通过不可变引用访问 |
| 全节点 | Full Node | 存储完整链状态、提供 RPC 服务但不参与共识的节点 |
| 框架 | Framework | Sui 核心库（`0x2`），提供 `object`、`transfer` 等基础模块 |

## G

| 术语 | 英文 | 解释 |
|------|------|------|
| Gas | Gas | 交易执行消耗的计算资源单位 |
| 泛型 | Generics | Move 的参数化类型系统，允许编写适用于多种类型的代码 |
| GraphQL | GraphQL | Sui 提供的灵活查询 API |
| gRPC | gRPC | Sui 的高性能远程过程调用协议，支持事件流 |

## H

| 术语 | 英文 | 解释 |
|------|------|------|
| Hot Potato | Hot Potato | 没有任何能力的结构体，必须在创建它的交易中被消费 |

## I

| 术语 | 英文 | 解释 |
|------|------|------|
| 不可变对象 | Immutable Object | 永远不能被修改的对象 |
| 索引器 | Indexer | 监听链上事件并存储到数据库的服务 |
| 初始化函数 | init Function | 包发布时自动调用一次的函数 |
| 内部类型 | Internal Type | 模块内定义的类型，字段不可从外部访问 |
| IBE | Identity-Based Encryption | 基于身份的加密，Seal 使用的核心密码学原语 |

## K

| 术语 | 英文 | 解释 |
|------|------|------|
| key 能力 | key Ability | 标记对象的能力，要求第一个字段为 `id: UID` |
| 密钥服务器 | Key Server | Seal 中持有 IBE 主密钥并派生解密密钥的链下服务 |
| Kiosk | Kiosk | Sui 的去中心化商店模式，支持交易策略和版税 |

## M

| 术语 | 英文 | 解释 |
|------|------|------|
| 主网 | Mainnet | Sui 的生产网络 |
| Move | Move | Sui 使用的智能合约编程语言 |
| 模块 | Module | Move 代码的组织单元，包含类型、函数和常量 |
| 多签 | Multisig | 多重签名，多个密钥共同控制一个地址 |
| 可变引用 | Mutable Reference (&mut) | 允许修改被引用值的引用 |

## N

| 术语 | 英文 | 解释 |
|------|------|------|
| Nautilus | Nautilus | 基于 TEE 的可验证链下计算框架 |
| NFT | Non-Fungible Token | 非同质化代币，Sui 上表现为具有 `key` 能力的对象 |

## O

| 术语 | 英文 | 解释 |
|------|------|------|
| 对象 | Object | Sui 的基本存储单元，具有全局唯一 ID |
| 对象 ID | Object ID | 对象的唯一标识符（32 字节地址） |
| 一次性见证 | One-Time Witness (OTW) | 只在 `init` 函数中创建一次的特殊类型，用于初始化 |
| Owned Object | Owned Object | 归特定地址所有的对象 |

## P

| 术语 | 英文 | 解释 |
|------|------|------|
| 包 | Package | Move 代码的部署单元，包含一个或多个模块 |
| 并行执行 | Parallel Execution | Sui 运行时并行执行交易的能力 |
| PCR | Platform Configuration Register | 标识 enclave 代码和配置的 SHA-384 哈希值 |
| PTB | Programmable Transaction Block | 可编程交易块，一笔交易中组合多个操作 |
| 幻影类型参数 | Phantom Type Parameter | 不在结构体字段中使用的类型参数，用于类型标记 |
| Publisher | Publisher | 证明包发布权的对象，通过 OTW 创建 |

## R

| 术语 | 英文 | 解释 |
|------|------|------|
| 随机数 | Random | 系统随机数对象（地址 `0x8`） |
| 引用 ID | Referent ID | 将 Capability 绑定到特定共享对象的 ID |
| RPC | Remote Procedure Call | 远程过程调用，用于与 Sui 节点通信 |

## S

| 术语 | 英文 | 解释 |
|------|------|------|
| Seal | Seal | 去中心化密钥管理服务 |
| 会话密钥 | Session Key | Seal 中的短期授权，允许 dApp 在有效期内获取解密密钥 |
| 共享对象 | Shared Object | 任何人都可以访问的对象，需要共识排序 |
| 标准库 | Standard Library | Move 标准库（`0x1`），提供基础类型和工具 |
| store 能力 | store Ability | 允许值被存储在其他对象中的能力 |
| 结构体 | Struct | Move 的自定义类型定义 |

## T

| 术语 | 英文 | 解释 |
|------|------|------|
| Table | Table | 同构动态键值集合，条目存储为动态字段 |
| TEE | Trusted Execution Environment | 可信执行环境，提供硬件级代码隔离 |
| 测试网 | Testnet | Sui 的测试网络 |
| Transfer | Transfer | 将对象所有权转移到指定地址的操作 |
| 阈值加密 | Threshold Encryption | Seal 中使用的 t-of-n 加密方案 |
| 交易摘要 | Transaction Digest | 交易的唯一标识哈希 |

## U

| 术语 | 英文 | 解释 |
|------|------|------|
| UID | Unique Identifier | 对象的唯一标识符类型，每个 `key` 对象的必需首字段 |
| UpgradeCap | Upgrade Capability | 包升级的权限凭证 |

## V

| 术语 | 英文 | 解释 |
|------|------|------|
| 验证者 | Validator | 参与共识的 Sui 网络节点 |
| VecMap | VecMap | 基于 Vector 的有序映射 |
| VecSet | VecSet | 基于 Vector 的有序集合 |
| 版本化共享对象 | Versioned Shared Object | 包含版本字段的共享对象，用于控制升级后的访问 |

## W

| 术语 | 英文 | 解释 |
|------|------|------|
| Walrus | Walrus | Sui 生态的去中心化存储协议 |
| 见证模式 | Witness Pattern | 使用类型实例作为权限证明的设计模式 |
| 封装对象 | Wrapped Object | 存储在另一个对象字段中的对象 |

## Z

| 术语 | 英文 | 解释 |
|------|------|------|
| ZKLogin | ZKLogin | 基于零知识证明的 OAuth 登录机制 |
| 零知识证明 | Zero-Knowledge Proof (ZKP) | 在不泄露信息的情况下证明某个陈述为真的密码学技术 |

## 小结

本术语表涵盖了 Move 和 Sui 开发中最常用的概念。随着 Sui 生态的发展，新的术语会不断出现。建议将本表作为快速参考，结合具体章节深入理解每个概念。


---


<!-- source: appendix/reserved-addresses.md -->
## B. 保留地址

# 保留地址

本附录列出 Sui 网络中的保留地址。这些地址在所有环境（mainnet、testnet、devnet、localnet）中保持不变，用于特定的原生操作。

## 地址一览

| 地址 | 名称 | 别名 | 用途 |
|------|------|------|------|
| `0x1` | Move 标准库 | `std` | 基础类型和工具函数 |
| `0x2` | Sui 框架 | `sui` | Sui 核心功能模块 |
| `0x5` | SuiSystem | — | 系统状态管理 |
| `0x6` | Clock | — | 链上时钟 |
| `0x8` | Random | — | 链上随机数 |
| `0xc` | CoinRegistry | — | 代币注册表 |
| `0x403` | DenyList | — | 代币冻结拒绝列表 |

## 详细说明

### 0x1 — Move 标准库（MoveStdlib）

提供 Move 语言的基础类型和工具：

```move
use std::string::String;
use std::option::{Self, Option};
use std::vector;
use std::type_name;
use std::ascii;
use std::bcs;
use std::hash;
use std::debug;
```

主要模块：

| 模块 | 用途 |
|------|------|
| `std::string` | UTF-8 字符串 |
| `std::option` | 可选值类型 |
| `std::vector` | 动态数组 |
| `std::bcs` | BCS 序列化/反序列化 |
| `std::hash` | 哈希函数（SHA2-256、SHA3-256） |
| `std::type_name` | 类型名称反射 |
| `std::ascii` | ASCII 字符串 |
| `std::debug` | 调试打印（仅测试可用） |
| `std::unit_test` | 测试断言工具 |

### 0x2 — Sui 框架（Sui Framework）

提供 Sui 区块链的核心功能：

```move
use sui::object::{Self, UID, ID};
use sui::transfer;
use sui::tx_context::TxContext;
use sui::coin::{Self, Coin};
use sui::balance::{Self, Balance};
use sui::event;
use sui::clock::Clock;
use sui::table::Table;
use sui::bag::Bag;
use sui::dynamic_field as df;
use sui::dynamic_object_field as dof;
use sui::package;
use sui::display;
use sui::kiosk;
```

主要模块：

| 模块 | 用途 |
|------|------|
| `sui::object` | 对象创建和管理 |
| `sui::transfer` | 对象转移（转让、共享、冻结） |
| `sui::tx_context` | 交易上下文（发送者地址、创建 UID） |
| `sui::coin` | 同质化代币 |
| `sui::balance` | 余额管理 |
| `sui::event` | 事件发射 |
| `sui::clock` | 时间查询 |
| `sui::table` | 同构键值集合（动态字段） |
| `sui::bag` | 异构键值集合（动态字段） |
| `sui::dynamic_field` | 动态字段操作 |
| `sui::dynamic_object_field` | 动态对象字段操作 |
| `sui::package` | 包管理和升级 |
| `sui::display` | Display 标准（NFT 显示元数据） |
| `sui::kiosk` | Kiosk 交易协议 |
| `sui::ed25519` | Ed25519 签名验证 |
| `sui::hash` | Blake2b256 哈希 |
| `sui::random` | 链上随机数 |

### 0x5 — SuiSystem

管理 Sui 网络的系统状态：

```move
use sui::sui_system::SuiSystemState;
```

包含验证者集合、质押信息、Epoch 管理等系统级功能。

### 0x6 — Clock

提供链上时间戳：

```move
use sui::clock::Clock;

public fun do_time_check(clock: &Clock) {
    let now_ms = clock.timestamp_ms();
    // 使用时间戳...
}
```

在交易中使用：
```typescript
tx.moveCall({
  target: `${packageId}::my_module::do_time_check`,
  arguments: [tx.object('0x6')], // Clock 对象
});
```

### 0x8 — Random

提供链上可验证随机数：

```move
use sui::random::Random;

entry fun roll_dice(r: &Random, ctx: &mut TxContext) {
    let mut gen = r.new_generator(ctx);
    let result = gen.generate_u8_in_range(1, 6);
    // 使用随机数...
}
```

在交易中使用：
```typescript
tx.moveCall({
  target: `${packageId}::game::roll_dice`,
  arguments: [tx.object('0x8')],
});
```

### 0x403 — DenyList

管理代币冻结列表，用于合规场景：

```move
use sui::deny_list::DenyList;

/// 冻结某地址的代币
public fun freeze_address(
    deny_list: &mut DenyList,
    _cap: &DenyCap<MY_COIN>,
    addr: address,
) {
    deny_list.add(addr);
}
```

## 在 Move.toml 中的引用

从 Sui 1.45 开始，标准库和 Sui 框架的依赖是隐式的：

```toml
[package]
name = "my_package"
edition = "2024"

# 不需要显式声明 Sui 依赖
[dependencies]
# Sui, MoveStdlib, SuiSystem 自动导入
```

## 小结

- 保留地址在所有 Sui 网络环境中保持一致
- `0x1`（标准库）和 `0x2`（Sui 框架）是最常用的
- `0x6`（Clock）和 `0x8`（Random）是交易中常引用的系统对象
- 从 Sui 1.45 起，框架依赖自动导入，无需在 `Move.toml` 中声明


---


<!-- source: appendix/transfer-functions.md -->
## C. Transfer 函数参考

# Transfer 函数参考

本附录汇总 `sui::transfer` 模块中所有转移函数的签名、用途和权限要求。

## 函数总览

| 函数 | 公共变体 | 最终状态 | 权限 |
|------|---------|---------|------|
| `transfer` | `public_transfer` | 地址所有 | 完全权限 |
| `share_object` | `public_share_object` | 共享 | 引用、可变引用、删除 |
| `freeze_object` | `public_freeze_object` | 冻结 | 仅不可变引用 |
| `party_transfer` | `public_party_transfer` | Party | 取决于 Party 设置 |

## 对象状态说明

| 状态 | 描述 |
|------|------|
| 地址所有（Address Owned） | 对象可以被一个地址（或对象）完全访问 |
| 共享（Shared） | 对象可以被任何人引用和删除 |
| 冻结（Frozen） | 对象只能通过不可变引用访问 |
| Party | 取决于 Party 设置 |

## 详细函数签名

### transfer / public_transfer

将对象转移到指定地址，使其成为地址所有的对象。

```move
// 模块内部使用（不需要 store 能力）
public fun transfer<T: key>(obj: T, recipient: address);

// 公共使用（需要 store 能力）
public fun public_transfer<T: key + store>(obj: T, recipient: address);
```

**使用示例**：

```move
module my_package::example;

// key only 的类型只能在定义模块内 transfer
public struct AdminCap has key {
    id: UID,
}

// key + store 的类型可以从任何地方 public_transfer
public struct NFT has key, store {
    id: UID,
}

fun init(ctx: &mut TxContext) {
    // 模块内使用 transfer
    transfer::transfer(AdminCap {
        id: object::new(ctx),
    }, ctx.sender());
}

public fun mint(ctx: &mut TxContext): NFT {
    NFT { id: object::new(ctx) }
    // 调用者可以使用 public_transfer 转移
}
```

### share_object / public_share_object

将对象变为共享对象，任何人都可以访问。

```move
// 模块内部使用
public fun share_object<T: key>(obj: T);

// 公共使用（需要 store）
public fun public_share_object<T: key + store>(obj: T);
```

**使用示例**：

```move
public struct Registry has key {
    id: UID,
    items: vector<ID>,
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(Registry {
        id: object::new(ctx),
        items: vector[],
    });
}
```

**注意**：共享后不可逆——对象永远保持共享状态。

### freeze_object / public_freeze_object

将对象冻结为不可变对象。

```move
// 模块内部使用
public fun freeze_object<T: key>(obj: T);

// 公共使用（需要 store）
public fun public_freeze_object<T: key + store>(obj: T);
```

**使用示例**：

```move
public struct Config has key, store {
    id: UID,
    max_supply: u64,
    name: String,
}

public fun freeze_config(config: Config) {
    transfer::public_freeze_object(config);
    // 此后 config 只能通过 &Config 访问
}
```

### receive

从"父"对象中接收一个发送给它的"子"对象。

```move
public fun receive<T: key>(parent: &mut UID, to_receive: Receiving<T>): T;

public fun public_receive<T: key + store>(parent: &mut UID, to_receive: Receiving<T>): T;
```

**使用示例**：

```move
public struct Wallet has key {
    id: UID,
}

public fun accept_nft(
    wallet: &mut Wallet,
    nft_receiving: Receiving<NFT>,
): NFT {
    transfer::public_receive(&mut wallet.id, nft_receiving)
}
```

## 选择指南

### 何时使用 transfer vs public_transfer

```move
// 使用 transfer：希望限制转移权限在模块内
public struct SoulboundNFT has key {
    id: UID,
    // 没有 store 能力，外部无法调用 public_transfer
}

// 使用 public_transfer：允许自由转让
public struct TradableNFT has key, store {
    id: UID,
    // 有 store 能力，任何模块都可以调用 public_transfer
}
```

### 决策流程图

```
创建对象后要做什么？
    │
    ├── 转给特定地址 ──────────── transfer / public_transfer
    │
    ├── 所有人都能访问和修改 ──── share_object / public_share_object
    │
    ├── 永远不再修改 ──────────── freeze_object / public_freeze_object
    │
    └── 发送给另一个对象 ──────── transfer（收件人为对象地址）
                                  └── 使用 receive 接收
```

### store 能力的影响

| 有无 store | transfer | public_transfer | 被包装 | 动态字段 |
|-----------|----------|-----------------|--------|---------|
| 无 store | ✓ 模块内 | ✗ | ✗ | ✗ |
| 有 store | ✓ | ✓ 任何地方 | ✓ | ✓ |

## 常见模式

### 铸造并转让

```move
public fun mint_and_transfer(
    name: String,
    recipient: address,
    ctx: &mut TxContext,
) {
    let nft = NFT {
        id: object::new(ctx),
        name,
    };
    transfer::public_transfer(nft, recipient);
}
```

### 可组合铸造（推荐）

```move
// 返回对象，让 PTB 决定如何处理
public fun mint(name: String, ctx: &mut TxContext): NFT {
    NFT {
        id: object::new(ctx),
        name,
    }
}

// PTB 中：
// const [nft] = tx.moveCall({ target: '...::mint', ... });
// tx.transferObjects([nft], recipient);
```

## 小结

- `transfer` 系列函数控制对象的最终状态：地址所有、共享或冻结
- `public_*` 变体需要对象有 `store` 能力，允许从任何模块调用
- 非 `public_*` 变体只能在定义该类型的模块内调用
- 共享和冻结操作不可逆
- 推荐可组合设计：函数返回对象，让调用者（PTB）决定后续操作


---


<!-- source: appendix/cli-cheatsheet.md -->
## D. CLI 速查表

# CLI 速查表

本附录汇总 `sui` CLI 最常用的命令，方便日常开发快速查阅。

## 环境管理

```bash
# 查看当前环境
sui client envs

# 添加新环境
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client new-env --alias mainnet --rpc https://fullnode.mainnet.sui.io:443
sui client new-env --alias localnet --rpc http://127.0.0.1:9000

# 切换环境
sui client switch --env testnet

# 查看当前活跃地址
sui client active-address

# 切换活跃地址
sui client switch --address <ADDRESS>

# 获取 chain identifier
sui client chain-identifier
```

## 密钥管理

```bash
# 生成新密钥对
sui keytool generate ed25519
sui keytool generate secp256k1
sui keytool generate secp256r1

# 列出所有密钥
sui keytool list

# 导出私钥
sui keytool export --key-identity <ADDRESS>

# 格式转换
sui keytool convert <BECH32_PRIVATE_KEY>

# 从助记词导入
sui keytool import "<MNEMONIC>" ed25519
```

## 多签

```bash
# 创建多签地址
sui keytool multi-sig-address \
  --pks <PK1> <PK2> <PK3> \
  --weights 1 1 1 \
  --threshold 2

# 签名交易
sui keytool sign --address <ADDRESS> --data <TX_BYTES_BASE64>

# 组合多签
sui keytool multi-sig-combine-partial-sig \
  --pks <PK1> <PK2> <PK3> \
  --weights 1 1 1 \
  --threshold 2 \
  --sigs <SIG1> <SIG2>
```

## 账户与余额

```bash
# 获取测试代币
sui client faucet

# 查看 gas 余额
sui client gas

# 查看所有 gas coins
sui client gas --json
```

## Move 项目

```bash
# 创建新 Move 项目
sui move new my_package

# 构建
sui move build

# 运行测试
sui move test

# 带详细输出的测试
sui move test --verbose

# 运行特定测试
sui move test --filter test_name
```

## 发布与升级

```bash
# 发布包
sui client publish

# 发布（指定构建环境）
sui client publish --build-env testnet

# 升级包
sui client upgrade --upgrade-capability <UPGRADE_CAP_ID>

# 测试发布（localnet）
sui client test-publish

# 测试升级
sui client test-upgrade --upgrade-capability <UPGRADE_CAP_ID>
```

## 对象查询

```bash
# 列出拥有的对象
sui client objects

# 查看特定对象
sui client object <OBJECT_ID>

# 查看对象详情（JSON 格式）
sui client object <OBJECT_ID> --json

# 查看动态字段
sui client dynamic-field <PARENT_OBJECT_ID>
```

## 调用函数

```bash
# 调用 Move 函数
sui client call \
  --package <PACKAGE_ID> \
  --module <MODULE> \
  --function <FUNCTION> \
  --args <ARG1> <ARG2>

# 使用类型参数
sui client call \
  --package <PACKAGE_ID> \
  --module <MODULE> \
  --function <FUNCTION> \
  --type-args "0x2::sui::SUI" \
  --args <ARG1>

# 传递对象参数
sui client call \
  --package <PACKAGE_ID> \
  --module hero \
  --function new_hero \
  --args "Warrior" 100 <REGISTRY_ID>
```

## 转账

```bash
# 转移 SUI
sui client transfer-sui \
  --to <RECIPIENT> \
  --sui-coin-object-id <COIN_ID> \
  --amount 1000000000

# 转移对象
sui client transfer \
  --to <RECIPIENT> \
  --object-id <OBJECT_ID>

# 合并 coins
sui client merge-coin \
  --primary-coin <PRIMARY_COIN_ID> \
  --coin-to-merge <COIN_ID>

# 拆分 coin
sui client split-coin \
  --coin-id <COIN_ID> \
  --amounts 1000000000
```

## 交易查询

```bash
# 查看交易详情
sui client tx-block <DIGEST>

# 执行已签名的交易
sui client execute-signed-tx \
  --tx-bytes <TX_BYTES> \
  --signatures <SIGNATURE>
```

## 本地网络

```bash
# 启动本地网络
sui start

# 带水龙头启动
sui start --with-faucet

# 强制重新生成
sui start --with-faucet --force-regenesis

# 指定日志级别
RUST_LOG="off,sui_node=info" sui start --with-faucet
```

## 验证与调试

```bash
# 验证源码
sui move build --dump-bytecode-as-base64

# 查看包信息
sui client object <PACKAGE_ID>

# 干跑（Dry Run）交易
# 通过 SDK 的 client.core.simulateTransaction 方法实现
```

## 实用技巧

### 使用 JSON 输出解析

```bash
# 获取 Package ID（从发布输出）
sui client publish --json | jq '.objectChanges[] | select(.type=="published") | .packageId'

# 获取创建的对象
sui client publish --json | jq '.objectChanges[] | select(.type=="created")'
```

### 环境变量

```bash
# 设置默认 gas 预算
export SUI_GAS_BUDGET=100000000

# 设置 RPC URL
export SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

## 小结

| 类别 | 常用命令 |
|------|---------|
| 环境 | `sui client envs` / `switch --env` |
| 密钥 | `sui keytool generate` / `list` / `export` |
| 构建 | `sui move build` / `test` / `new` |
| 发布 | `sui client publish` / `upgrade` |
| 查询 | `sui client objects` / `object` |
| 调用 | `sui client call` |
| 网络 | `sui start --with-faucet` |


---


<!-- source: appendix/coding-conventions.md -->
## E. 编码规范

# 编码规范

本附录总结 Move on Sui 的编码规范和最佳实践，涵盖命名、文件组织、代码风格和常见反模式。遵循这些规范可以提高代码可读性和可维护性。

## 包配置

### 使用正确的 Edition

```toml
[package]
name = "my_package"
edition = "2024"
```

### 隐式框架依赖

从 Sui 1.45 起，不再需要显式声明框架依赖：

```toml
# 现代写法
[dependencies]
# Sui, MoveStdlib, SuiSystem 自动导入

# 旧写法（不再需要）
# [dependencies]
# Sui = { ... }
```

### 命名地址加前缀

```toml
# 不推荐：通用名称容易冲突
[addresses]
math = "0x0"

# 推荐：项目前缀
[addresses]
my_protocol_math = "0x0"
```

## 模块结构

### 使用模块标签

```move
// 不推荐：旧风格，增加缩进
module my_package::my_module {
    public struct A {}
}

// 推荐：模块标签
module my_package::my_module;

public struct A {}
```

### Import 规范

```move
// 不推荐：单独的 Self 导入
use my_package::my_module::{Self};

// 推荐
use my_package::my_module;

// 同时需要模块和成员时
use my_package::other::{Self, OtherMember};

// 不推荐：分开写
use my_package::my_module;
use my_package::my_module::OtherMember;

// 推荐：合并
use my_package::my_module::{Self, OtherMember};
```

## 命名规范

### 常量命名

```move
// 错误常量：EPascalCase
const ENotAuthorized: u64 = 0;
const EInsufficientBalance: u64 = 1;

// 普通常量：ALL_CAPS
const MAX_SUPPLY: u64 = 10000;
const MY_CONSTANT: vector<u8> = b"my const";
```

### 结构体命名

```move
// Capability 类型加 Cap 后缀
public struct AdminCap has key, store {
    id: UID,
}

// 不要加 Potato 后缀
// 不推荐
public struct PromisePotato {}
// 推荐
public struct Promise {}

// 事件使用过去时
// 不推荐
public struct RegisterUser has copy, drop { user: address }
// 推荐
public struct UserRegistered has copy, drop { user: address }

// 动态字段键使用位置结构体 + Key 后缀
public struct DynamicFieldKey() has copy, drop, store;
```

## 函数设计

### 不要使用 public entry

```move
// 不推荐：entry 对 public 函数不必要
entry fun do_something() { /* ... */ }
// 或：public fun do_something() { /* ... */ } 供 PTB 组合调用

// 推荐：public 函数已经可以在交易中调用
public fun do_something(): T { /* ... */ }
```

### 可组合设计

```move
// 不推荐：不可组合，难以测试
public fun mint_and_transfer(ctx: &mut TxContext) {
    transfer::transfer(mint(ctx), ctx.sender());
}

// 推荐：可组合
public fun mint(ctx: &mut TxContext): NFT { /* ... */ }

// 可以使用 entry 做不可组合的便捷函数
entry fun mint_and_keep(ctx: &mut TxContext) { /* ... */ }
```

### 参数顺序

```move
// 不推荐：参数顺序混乱
public fun call_app(
    value: u8,
    app: &mut App,
    is_smth: bool,
    cap: &AppCap,
    clock: &Clock,
    ctx: &mut TxContext,
) { /* ... */ }

// 推荐：对象优先，Capability 其次，值参数随后，Clock 和 ctx 最后
public fun call_app(
    app: &mut App,
    cap: &AppCap,
    value: u8,
    is_smth: bool,
    clock: &Clock,
    ctx: &mut TxContext,
) { /* ... */ }
```

### 访问器命名

```move
// 不推荐：不必要的 get_ 前缀
public fun get_name(u: &User): String { /* ... */ }

// 推荐：getter 以字段名命名，无 get_ 前缀
public fun name(u: &User): String { /* ... */ }

// 可变引用加 _mut 后缀
public fun details_mut(u: &mut User): &mut Details { /* ... */ }
```

## 现代语法

### 字符串

```move
// 不推荐
use std::string::utf8;
let str = utf8(b"hello");

// 推荐
let str = b"hello".to_string();
let ascii = b"hello".to_ascii_string();
```

### UID 和上下文

```move
// 不推荐
object::delete(id);
tx_context::sender(ctx);

// 推荐
id.delete();
ctx.sender();
```

### Vector

```move
// 不推荐
let mut v = vector::empty();
vector::push_back(&mut v, 10);
let first = vector::borrow(&v, 0);
assert!(vector::length(&v) == 1);

// 推荐
let mut v = vector[10];
let first = v[0];
assert!(v.length() == 1);
```

### Coin 操作

```move
// 不推荐
let paid = coin::split(&mut payment, amount, ctx);
let balance = coin::into_balance(paid);

// 推荐
let balance = payment.split(amount, ctx).into_balance();

// 更好（不创建临时 coin）
let balance = payment.balance_mut().split(amount);
```

## 宏的使用

### Option 宏

```move
// 不推荐
if (opt.is_some()) {
    let inner = opt.destroy_some();
    call_function(inner);
};

// 推荐
opt.do!(|value| call_function(value));

// 带默认值
let value = opt.destroy_or!(default_value);
let value = opt.destroy_or!(abort ECannotBeEmpty);
```

### 循环宏

```move
// 不推荐
let mut i = 0;
while (i < 32) {
    do_action();
    i = i + 1;
};

// 推荐
32u8.do!(|_| do_action());

// 生成 vector
vector::tabulate!(32, |i| i);

// 遍历 vector
vec.do_ref!(|e| call_function(e));

// 销毁 vector 并对每个元素操作
vec.destroy!(|e| call(e));

// 折叠
let sum = source.fold!(0, |acc, v| acc + v);

// 过滤
let filtered = source.filter!(|e| e > 10);
```

### 解构

```move
// 不推荐
let MyStruct { id, field_1: _, field_2: _, field_3: _ } = value;
id.delete();

// 推荐
let MyStruct { id, .. } = value;
id.delete();
```

## 测试规范

### 合并测试属性

```move
// 不推荐：属性分两行
#[test]
#[expected_failure]
fun value_passes_check() { abort }

// 推荐：合并属性，测试函数不加 test_ 前缀
#[test, expected_failure]
fun value_passes_check() { abort }
```

### 简化测试上下文

```move
// 不推荐：不必要地使用 TestScenario
let mut test = test_scenario::begin(@0);
let nft = app::mint(test.ctx());
app::destroy(nft);
test.end();

// 推荐：使用 dummy context
let ctx = &mut tx_context::dummy();
app::mint(ctx).destroy();
```

### 使用 assert_eq!

```move
// 不推荐：assert! 不显示期望值与实际值
assert!(result == b"expected_value", 0);

// 推荐：assert_eq! 失败时打印两侧值（需 use std::unit_test::assert_eq）
assert_eq!(result, expected_value);
```

### 使用 test_utils::destroy

```move
// 不推荐：自定义 destroy_for_testing
nft.destroy_for_testing();

// 推荐：使用框架 test_utils::destroy
use sui::test_utils::destroy;
destroy(nft);
```

### 测试命名

```move
// 不推荐：测试函数不需要 test_ 前缀
#[test]
fun test_this_feature() { /* ... */ }

// 推荐：#[test] 已表达测试意图
#[test]
fun this_feature_works() { /* ... */ }
```

## 注释规范

```move
// 使用 /// 编写文档注释
/// 创建新的英雄 NFT
public fun mint(ctx: &mut TxContext): Hero { /* ... */ }

// 使用 // 解释复杂逻辑
// 当值小于 10 时可能下溢，需要添加 assert
let value = external_call(value, ctx);
```

## 小结

- 使用 Move 2024 Edition 和模块标签语法
- 错误常量用 `EPascalCase`，普通常量用 `ALL_CAPS`
- 函数设计遵循可组合原则，优先返回对象
- 参数顺序：对象 → Capability → 值参数 → Clock → ctx
- 积极使用现代语法：方法调用、宏、vector 字面量
- 测试中使用 `assert_eq!`、`destroy`、`tx_context::dummy()`
- 使用 Move Formatter 保持代码格式一致


---


<!-- source: appendix/code-quality-checklist.md -->
## F. 代码质量检查清单

# 代码质量检查清单

本附录提供一份全面的代码质量检查清单，用于在发布 Move 合约前系统性地审查代码。

## 包配置

- [ ] 使用 `edition = "2024"` 或更新
- [ ] 移除了不必要的显式框架依赖（Sui 1.45+）
- [ ] 命名地址有项目前缀，避免冲突
- [ ] `Move.toml` 中没有硬编码的非零地址（应使用 `"0x0"`）

## 模块结构

- [ ] 使用模块标签语法（不用大括号包裹）
- [ ] `use` 语句合理分组，使用 `{Self, Member}` 合并导入
- [ ] 没有多余的 `{Self}` 单独导入
- [ ] 模块内代码组织清晰：常量 → 结构体 → init → 公共函数 → 包可见函数 → 私有函数

## 命名规范

- [ ] 错误常量使用 `EPascalCase`（如 `ENotAuthorized`）
- [ ] 普通常量使用 `ALL_CAPS`（如 `MAX_SUPPLY`）
- [ ] Capability 类型以 `Cap` 结尾（如 `AdminCap`）
- [ ] 事件类型使用过去时（如 `HeroCreated`，不是 `CreateHero`）
- [ ] 动态字段键使用 `Key` 后缀和位置结构体
- [ ] Hot Potato 类型名称不包含 "Potato"
- [ ] 访问器函数直接用字段名，不加 `get_` 前缀
- [ ] 可变访问器加 `_mut` 后缀

## 函数设计

- [ ] 没有 `public entry` 函数（使用 `public` 或 `entry`）
- [ ] 公共函数设计为可组合（返回对象而非内部 transfer）
- [ ] 参数顺序：对象 → Capability → 值 → Clock → ctx
- [ ] Capability 作为第二个参数（对象之后）
- [ ] `public` 函数签名已确认不再变动（升级后不可改）
- [ ] 需要冻结的便捷函数使用 `entry`（不是 `public`）

## 现代语法

- [ ] 使用 `b"...".to_string()` 而非 `utf8(b"...")`
- [ ] 使用 `id.delete()` 而非 `object::delete(id)`
- [ ] 使用 `ctx.sender()` 而非 `tx_context::sender(ctx)`
- [ ] 使用 vector 字面量 `vector[1, 2, 3]`
- [ ] 使用方法语法 `v.length()` 而非 `vector::length(&v)`
- [ ] 使用索引语法 `v[0]` 而非 `vector::borrow(&v, 0)`
- [ ] 使用集合索引 `&map[&key]` 而非 `map.get(&key)`
- [ ] Coin 操作使用链式调用

## 宏使用

- [ ] 使用 `opt.do!(|v| ...)` 而非 if-is_some-extract
- [ ] 使用 `opt.destroy_or!(default)` 处理默认值
- [ ] 使用 `n.do!(|_| ...)` 而非 while 循环计数
- [ ] 使用 `vec.do_ref!(|e| ...)` 遍历 vector
- [ ] 使用 `vec.destroy!(|e| ...)` 消费 vector
- [ ] 使用 `vec.fold!(init, |acc, v| ...)` 折叠
- [ ] 使用 `vec.filter!(|e| ...)` 过滤
- [ ] 使用 `vector::tabulate!(n, |i| ...)` 生成 vector

## 解构

- [ ] 使用 `let Struct { field, .. } = value;` 忽略不需要的字段
- [ ] 不使用 `field_1: _, field_2: _` 逐个忽略

## 安全检查

- [ ] 所有特权操作有权限控制（Capability / ACL / 签名验证）
- [ ] Capability 绑定了 Referent ID
- [ ] Hot Potato 绑定到特定对象
- [ ] 所有用户输入经过验证（范围、长度、类型）
- [ ] 整数运算有溢出检查
- [ ] 除法前检查分母非零
- [ ] 共享对象有版本控制
- [ ] `seal_approve*` 函数是 `entry`（非 `public`），支持升级
- [ ] 无硬编码的测试密钥或地址
- [ ] 错误码唯一且有描述性

## 升级准备

- [ ] `public` 函数签名稳定，不会在未来变更
- [ ] 共享对象包含 `version` 字段
- [ ] 有 `migrate` 函数用于版本升级
- [ ] `init` 中不包含升级后需要重新执行的逻辑
- [ ] 使用动态字段存储可变配置
- [ ] UpgradeCap 安全存储（考虑多签）
- [ ] 确定升级策略（compatible / additive / immutable）

## 测试

- [ ] 所有核心功能有单元测试
- [ ] 测试覆盖正常路径和错误路径
- [ ] 使用 `#[test, expected_failure(abort_code = ...)]` 测试错误
- [ ] expected_failure 测试不做不必要的清理
- [ ] 使用 `assert_eq!` 而非 `assert!(a == b, 0)`
- [ ] 测试中不使用 abort code 参数的 `assert!`
- [ ] 使用 `tx_context::dummy()` 而非不必要的 TestScenario
- [ ] 使用 `sui::test_utils::destroy` 清理测试对象
- [ ] 测试模块中函数名不加 `test_` 前缀

## 注释

- [ ] 文档注释使用 `///`（不是 `/** */`）
- [ ] 复杂逻辑有解释性注释
- [ ] 没有多余的显而易见的注释
- [ ] TODO 和已知问题有注释标记

## 协议限制

- [ ] 单笔交易创建的对象不超过 2048 个
- [ ] 单个对象大小不超过 256KB
- [ ] 单笔交易访问的动态字段不超过 1000 个
- [ ] 单笔交易发射的事件不超过 1024 个
- [ ] 大集合使用 `Table` 而非 `vector`
- [ ] 批量操作分批处理

## 前端集成

- [ ] 合约暴露了前端需要的所有查询函数
- [ ] 事件结构清晰，便于索引和展示
- [ ] Display 标准已配置（如适用）
- [ ] 错误码有对应的前端错误消息

## 工具使用

- [ ] 使用 Move Formatter 格式化代码
- [ ] CI 中集成了格式化检查
- [ ] 使用 `sui move test` 运行完整测试套件
- [ ] 在 testnet 上完成集成测试

## 小结

这份检查清单涵盖了从代码风格到安全性的各个方面。建议在以下时机使用：

1. **代码审查前**：自查代码是否符合规范
2. **发布前**：系统性检查所有安全和兼容性要求
3. **升级前**：确认升级兼容性和迁移逻辑
4. **团队新人入职**：作为编码标准的参考文档