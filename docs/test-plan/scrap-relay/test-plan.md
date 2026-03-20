# Test Plan: Scrap Relay

## 0. One-Screen Test Summary (Problem / Why / How)

- Problem being validated:
  - 验证状态机迁移、蓝图依赖校验、结算顺序、幂等与反滥用拦截是否满足 P0。
- Why this test batch now:
  - 合约层已实现，需要把 CLI-first 的 Move 单测与 devnet 集成路径补齐并记录阻塞点。
- How validation works (3-step):
  1. 静态检查（TypeScript）。
  2. 构建检查（Next.js production build）。
  3. 合约检查（`sui move test` + devnet `publish/test-publish` 路径）。
- Expected outcome:
  - 主流程可完成，异常路径有明确错误码，合约核心函数可编译并通过本地单测。

## 1. Scope

- In scope:
  - T-001 ~ T-010、T-013 ~ T-017 对应功能与错误路径。
- Out of scope:
  - 成功拿到正式 publish package id 后的链上 `client call` 交易回归（本轮仅验证 publish fallback dry-run）。

## 2. Test Matrix

| Case ID | Type | Linked TODO | Scenario | Expected Result | Status |
|---|---|---|---|---|---|
| TP-001 | Static | T-001~T-010 | `npm run typecheck` | 无 TypeScript 错误 | Passed |
| TP-002 | Build | T-001~T-010 | `npm run build` | Next.js 构建成功并输出路由 | Passed |
| TP-003 | Main flow | T-007/T-008 | Lock Role -> Commit Step -> Finalize Settlement | 状态到 `Settled`，账单字段完整 | Passed |
| TP-004 | Error flow | T-003 | 越序提交 `step-2` | 返回 `E_BLUEPRINT_DEPENDENCY_UNMET` | Passed |
| TP-005 | Error flow | T-005 | `platform_rake_bps > 1500` | 返回 `E_PERMISSION_DENIED` | Passed |
| TP-006 | Error flow | T-006 | 同 `requestId` 重复结算 | 返回 no-op，不重复派奖 | Passed |
| TP-007 | Abuse flow | T-009/T-016 | 短局+高重复路线+高集中贡献 | 返回 `E_ANTI_ABUSE_FLAGGED`，记录 audit flags | Passed |
| TP-008 | State flow | T-004/T-014 | 无可执行步骤且存在阻塞步骤后 tick | 迁移到 `Overtime` | Passed |
| TP-009 | Contract unit | T-014~T-016 | `sui move test -e testnet` | 3/3 单测通过（anti-abuse + blueprint） | Passed |
| TP-010 | Devnet CLI | T-012/T-017 | `npm run test:devnet` | 完成 switch/envs + publish 或 fallback | Passed (fallback) |
| TP-011 | Contract source | T-013~T-016 | 检查 Move 包结构与函数覆盖 | `Move.toml` + `relay.move` 覆盖状态机/结算/反滥用 | Passed |

## 3. Executed Commands and Outcomes

```bash
cd apps/scrap-relay
npm run typecheck
npm run build
npm run test:devnet

cd apps/scrap-relay/contracts
sui move test -e testnet
```

- `npm run typecheck`: Passed
- `npm run build`: Passed
- `sui move test -e testnet`: Passed (`3 passed, 0 failed`)
- `npm run test:devnet`: Passed (with fallback)
  - `sui client publish` 路径失败：环境映射校验失败（CLI 仍提示 env 不存在）
  - fallback `sui client test-publish --dry-run --build-env devnet` 成功，并返回 dry-run publish 结果

## 4. Regression Checklist

- [x] Invalid transition rejected (`E_STATE_TRANSITION_INVALID`)
- [x] Dependency unmet rejected (`E_BLUEPRINT_DEPENDENCY_UNMET`)
- [x] Material invalid rejected (`E_MATERIAL_NOT_ALLOWED`)
- [x] Fee bounds enforced (`E_PERMISSION_DENIED`)
- [x] Settlement idempotent by `requestId`
- [x] Anti-abuse flag and block (`E_ANTI_ABUSE_FLAGGED`)
- [x] Host-only settlement and relay start guards
- [x] UI shows room state, blocked steps, contribution, bill, audit flags

## 5. Known Limitations

- 当前 `sui client publish` 直发路径仍会命中环境映射报错，因此默认以 `test-publish --dry-run` 作为可交付验证路径。
- 目前只验证了 publish dry-run，尚未执行真实 `client call` 交易路径回归。
