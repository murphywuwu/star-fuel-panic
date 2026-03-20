# Scrap Relay Contract Layer (Sui Move)

## Structure

- `Move.toml`: package definition
- `sources/relay.move`: room state machine + blueprint commit + settlement + anti-abuse

## Key Entry Functions

- `create_room(entry_fee_lux, player_count, platform_rake_bps, host_revshare_bps, ctx)`
- `lock_role(room, role, ctx)`
- `start_relay(room, ctx)`
- `commit_step(room, step_id, material_type_id, material_qty, ctx)`
- `heartbeat_tick(room, clock)`
- `finalize_settlement(room, request_id, match_duration_sec, repeated_route_count, max_player_contribution_bps, same_address_cluster_count, ctx)`

## Security and State Guarantees

- State machine enforced on-chain:
  - `LobbyReady -> RoleLock -> RelayRunning -> Overtime -> Settled`
- Permission guard:
  - `start_relay` / `finalize_settlement` are host-only
  - `lock_role` / `commit_step` bind actor to `tx_context::sender`
- Fee bounds enforced:
  - `platform_rake_bps <= 1500`
  - `host_revshare_bps <= 6000`
- Settlement idempotency:
  - duplicate `request_id` becomes no-op
- Anti-abuse:
  - short match / repeated route / contribution concentration / address cluster

## Devnet Commands (CLI-first)

```bash
cd apps/scrap-relay/contracts
sui client switch --env devnet
sui client envs
sui move test -e testnet
sui client publish --gas-budget 100000000 --skip-dependency-verification
```

If publish is blocked by local environment mapping, use ephemeral validation:

```bash
sui client test-publish --gas-budget 100000000 --skip-dependency-verification --dry-run --build-env devnet
```

Or run from app root:

```bash
cd apps/scrap-relay
SUI_PACKAGE_DIR=./contracts npm run test:devnet
```
