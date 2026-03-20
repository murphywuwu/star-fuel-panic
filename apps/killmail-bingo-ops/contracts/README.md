# Killmail Bingo Ops Contracts

Move package for the on-chain state machine and settlement guardrails.

## Package

- Path: `apps/killmail-bingo-ops/contracts`
- Module: `killmail_bingo_ops::kbo_registry`

## Commands

```bash
cd apps/killmail-bingo-ops/contracts
sui move test -e testnet
./verify-devnet.sh
```

## Notes

- `test-publish` may fail if the active devnet address has no gas coins.
- The module includes anti-abuse guards for duplicate killmail and replay claim.
