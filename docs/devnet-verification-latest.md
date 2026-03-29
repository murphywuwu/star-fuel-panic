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

