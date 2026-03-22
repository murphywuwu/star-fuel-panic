# Devnet Verification Report

Generated At (UTC): 2026-03-20T23:53:38Z

## Commands Executed

sui client switch --env devnet
sui client envs
sui move test (env: testnet-fallback)
sui client test-publish --gas-budget 100000000 --json -e devnet --pubfile-path /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.H0ZCrpn7bs/Pub.devnet.toml
sui client call --package 0xea9a11cd190bea523d5ce40f267b6478f3a864d4c9586ed4844a081058bb9500 --module fuel_frog_panic --function create_room --args 100 4 120 80 50 900 4000 0x6366672d6465766e6574 --gas-budget 100000000 --json
curl <devnet-rpc> suix_queryEvents MoveEventType(0xea9a11cd190bea523d5ce40f267b6478f3a864d4c9586ed4844a081058bb9500::fuel_frog_panic::RoomCreated)

## Key Outcomes

- Active env: devnet
- Active address: 0xa4594358c0a6b99237fcb5e6b4beca05021280584de70ea3a9724c0e44d97bf3
- RPC endpoint: https://fullnode.devnet.sui.io:443
- Publish tx digest: 4dCb99nXJieprqDKjXnaZjvb594BYSB5iCni2kRK2m1Z
- Published package id: 0xea9a11cd190bea523d5ce40f267b6478f3a864d4c9586ed4844a081058bb9500
- create_room tx digest: 7D9XR89DZSYHk5gzoXt7sgN4CVcocr4krs6o9w5hdNBB
- Queried event type: 0xea9a11cd190bea523d5ce40f267b6478f3a864d4c9586ed4844a081058bb9500::fuel_frog_panic::RoomCreated
- Event rows returned: 1
- Latest event tx digest: 7D9XR89DZSYHk5gzoXt7sgN4CVcocr4krs6o9w5hdNBB
- Latest room id: 0x5f4118617f2d4e3232c8cea3d7d795e2301cb327288b46b40f96a2f33f019c7b

## Artifacts

- Publish JSON: /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.H0ZCrpn7bs/publish.json (ephemeral)
- Call JSON: /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.H0ZCrpn7bs/call.json (ephemeral)
- Event JSON: /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.H0ZCrpn7bs/events.json (ephemeral)

