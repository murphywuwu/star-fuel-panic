# Devnet Verification Report

Generated At (UTC): 2026-03-27T13:57:28Z

## Commands Executed

sui client switch --env devnet
sui client envs
sui move test (env: testnet-fallback)
sui client test-publish --gas-budget 100000000 --json -e devnet --pubfile-path /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.f6Ysfkfooq/Pub.devnet.toml
sui client call --package 0x4b56b010955a8e1e62cfe68fd9b8597aa678b68bfaafc8623b44de42c13b0bf1 --module fuel_frog_panic --function create_match_draft --args 0 30000142 [] 50 4 100 2 80 0x6366672d6465766e6574 --gas-budget 100000000 --json
sui client call --package 0x4b56b010955a8e1e62cfe68fd9b8597aa678b68bfaafc8623b44de42c13b0bf1 --module fuel_frog_panic --function publish_match --args 0x57e201ab3d3307d145677fc341eec75083be35014463f4b2d275b772f785c74c --gas-budget 100000000 --json
curl <devnet-rpc> suix_queryEvents MoveEventType(0x4b56b010955a8e1e62cfe68fd9b8597aa678b68bfaafc8623b44de42c13b0bf1::fuel_frog_panic::MatchDraftCreated)
curl <devnet-rpc> suix_queryEvents MoveEventType(0x4b56b010955a8e1e62cfe68fd9b8597aa678b68bfaafc8623b44de42c13b0bf1::fuel_frog_panic::MatchPublished)

## Key Outcomes

- Active env: devnet
- Active address: 0xa4594358c0a6b99237fcb5e6b4beca05021280584de70ea3a9724c0e44d97bf3
- RPC endpoint: https://fullnode.devnet.sui.io:443
- Publish tx digest: FcYWMyteyDMUigs9UJ7D2hz1QBvFknNpNurd5z1y65zh
- Published package id: 0x4b56b010955a8e1e62cfe68fd9b8597aa678b68bfaafc8623b44de42c13b0bf1
- create_match_draft tx digest: pkqcHNhijbaGivd6bGeUAizfiquYrGeqbu4Akc4FdyZ
- publish_match tx digest: WbS4NyZVTydinM6rTEmabvVTjL9U8hhHBcrrzzbaEZf
- Draft event type: 0x4b56b010955a8e1e62cfe68fd9b8597aa678b68bfaafc8623b44de42c13b0bf1::fuel_frog_panic::MatchDraftCreated
- Draft event rows returned: 1
- Latest draft event tx digest: pkqcHNhijbaGivd6bGeUAizfiquYrGeqbu4Akc4FdyZ
- Publish event type: 0x4b56b010955a8e1e62cfe68fd9b8597aa678b68bfaafc8623b44de42c13b0bf1::fuel_frog_panic::MatchPublished
- Publish event rows returned: 1
- Latest publish event tx digest: WbS4NyZVTydinM6rTEmabvVTjL9U8hhHBcrrzzbaEZf
- Latest room id: 0x57e201ab3d3307d145677fc341eec75083be35014463f4b2d275b772f785c74c

## Artifacts

- Publish JSON: /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.f6Ysfkfooq/publish.json (ephemeral)
- Draft Call JSON: /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.f6Ysfkfooq/call-draft.json (ephemeral)
- Publish Call JSON: /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.f6Ysfkfooq/call-publish.json (ephemeral)
- Draft Event JSON: /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.f6Ysfkfooq/events-draft.json (ephemeral)
- Publish Event JSON: /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.f6Ysfkfooq/events-publish.json (ephemeral)

## 2026-03-31 FuelConfig Verification Addendum

### Commands Executed

```bash
sui client envs
sui client active-env
sui client active-address
sui client --client.env devnet object 0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75 --json
curl "$SUI_RPC_URL" ... sui_getObject(package) on testnet
curl "$SUI_RPC_URL" ... sui_getTransactionBlock(AzBhmMFd9UTbr4m4hnSjSbBLkmVW3VESUDG15DGnCT8)
curl "$SUI_RPC_URL" ... sui_getObject(0x0f354c803af170ac0d1ac9068625c6321996b3013dc67bdaf14d06f93fa1671f)
curl "$SUI_RPC_URL" ... suix_getDynamicFields(0x1beb08d47745a0925bce48175b69b6d683f663371f51413072f6ff3bd9f72167)
curl "$SUI_RPC_URL" ... sui_getObject(<dynamic-field-object>)
curl "$SUI_RPC_URL" ... suix_queryEvents(MoveEventType(0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75::fuel::FuelEvent))
curl "$SUI_RPC_URL" ... sui_getObject(0x722286493f1fdf9f70a8f55352bb64a7370ec231f6d5ee393493257b04cf7a8b)
```

### Key Outcomes

- `devnet` read-only verification failed for the configured EVE Frontier package:
  - `Object 0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75 not found`
- Because the world package is not deployed on devnet, `testnet` was used as a justified read-only fallback for `FuelConfig` verification.
- Confirmed package on testnet:
  - `EVE_FRONTIER_PACKAGE_ID`: `0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75`
  - publish tx: `AzBhmMFd9UTbr4m4hnSjSbBLkmVW3VESUDG15DGnCT8`
- Located real shared objects:
  - `FuelConfig`: `0x0f354c803af170ac0d1ac9068625c6321996b3013dc67bdaf14d06f93fa1671f`
  - `fuel_efficiency` table: `0x1beb08d47745a0925bce48175b69b6d683f663371f51413072f6ff3bd9f72167`
- Extracted real on-chain efficiency mapping:
  - `78437 -> 90` => `Tier 3 / Refined / 1.5x`
  - `78515 -> 80` => `Tier 3 / Refined / 1.5x`
  - `78516 -> 40` => `Tier 1 / Standard / 1.0x`
  - `84868 -> 40` => `Tier 1 / Standard / 1.0x`
  - `88319 -> 15` => `Tier 1 / Standard / 1.0x`
  - `88335 -> 10` => `Tier 1 / Standard / 1.0x`
- Current testnet snapshot contains:
  - `2` refined fuel types
  - `4` standard fuel types
  - `0` premium fuel types
- Real `DEPOSITED` sample verification:
  - tx digest: `9EofS8iLTFF2rZ8ZueiX5C7Ty1c5eKzA1FzdzdjJTeJo`
  - node: `0x722286493f1fdf9f70a8f55352bb64a7370ec231f6d5ee393493257b04cf7a8b`
  - event: `old_quantity=0`, `new_quantity=100`, `type_id=88335`
  - node current `max_capacity=100000`
  - inferred `fillRatioAt=0`, so `urgencyWeight=3.0`
  - `type_id=88335 -> efficiency 10 -> Tier 1 -> fuelGradeBonus=1.0`
  - Normal-mode sample score: `100 × 3.0 × 1.0 × 1.0 = 300`

### Config Sync

- Added to runtime config:
  - `.env`: `EVE_FRONTIER_FUEL_CONFIG_ID=0x0f354c803af170ac0d1ac9068625c6321996b3013dc67bdaf14d06f93fa1671f`
  - `.env.example`: same value for testnet baseline
