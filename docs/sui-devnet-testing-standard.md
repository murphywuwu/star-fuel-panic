# Sui Contract Testing Standard (Devnet)

Version: 1.0  
Scope: All Sui Move contract development and verification tasks in this monorepo.

## 1. Core Principle

For contract testing in this project, command-line workflow is the default path, and `devnet` is the default network for integration-level verification.

Rationale:

- Fast feedback via CLI automation.
- Stable team workflow for repeatable test and publish actions.
- Devnet environment is suitable for frequent iteration and does not block normal testing throughput in this project policy.

## 2. Test Layers

### Local Move Unit Tests (Required)

Run local Move tests first for logic validation.

```bash
sui move test
```

### Devnet Integration Validation (Required before delivery)

Use `devnet` for package publish, upgrade, and transaction-path checks.

Typical checks include:

- package publish success
- entry function execution success
- expected on-chain object/state transitions
- event emission and key failure-path checks

## 3. Network Standard

- Default network for integration tests: `devnet`.
- Any alternative network usage must be explicitly justified in task notes.

## 4. CLI-First Commands (Reference)

```bash
# set environment
sui client switch --env devnet

# verify current environment
sui client envs

# run unit tests
sui move test

# publish package on devnet (example)
sui client publish --gas-budget 100000000
```

Notes:

- Adjust `--gas-budget` based on package size and transaction complexity.
- For production release validation, mainnet checks are separate from this devnet testing standard.

## 5. Delivery Expectations for Contract Tasks

For any Sui contract implementation/refactor, delivery should include:

1. commands executed (at least local test + devnet integration command set)
2. key outcomes (success/failure + relevant object/package references)
3. unresolved risks or environment assumptions

## 6. Monorepo Context

- Repository type: monorepo.
- Frontend stack: TypeScript, Next.js, Tailwind CSS, Zustand.
- Contract stack: Sui Move.
- First mini-game: `Neural Sync: Civilization Code Reconstruction`.

This document is mandatory for contract-related tasks.
