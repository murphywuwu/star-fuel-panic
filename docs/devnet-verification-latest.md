# Devnet Verification Report

Generated At (UTC): 2026-03-26T15:50:22Z

## Commands Executed

sui client switch --env devnet
sui client envs
sui move test (env: testnet-fallback)
sui client test-publish --gas-budget 100000000 --json -e devnet --pubfile-path /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.3ADTMyO7UO/Pub.devnet.toml
sui client call --package 0x0bfe52b798996a3038c1dc8d710e0d7f3c39e067dd79c85fe9353bfd7ba43645 --module fuel_frog_panic --function create_room --args 100 4 120 80 50 900 4000 0x6366672d6465766e6574 --gas-budget 100000000 --json
curl <devnet-rpc> suix_queryEvents MoveEventType(0x0bfe52b798996a3038c1dc8d710e0d7f3c39e067dd79c85fe9353bfd7ba43645::fuel_frog_panic::RoomCreated)

## Key Outcomes

- Active env: devnet
- Active address: 0xa4594358c0a6b99237fcb5e6b4beca05021280584de70ea3a9724c0e44d97bf3
- RPC endpoint: https://fullnode.devnet.sui.io:443
- Publish tx digest: 5yNJ2WxPov8cbN5c5XfryjTzEVmS6AnwdR2xGMqKJDC5
- Published package id: 0x0bfe52b798996a3038c1dc8d710e0d7f3c39e067dd79c85fe9353bfd7ba43645
- create_room tx digest: EVs2Vb3BnM3ZTQJeHFhrAYgSBBaXN5XLPEUB85TPpMRT
- Queried event type: 0x0bfe52b798996a3038c1dc8d710e0d7f3c39e067dd79c85fe9353bfd7ba43645::fuel_frog_panic::RoomCreated
- Event rows returned: 1
- Latest event tx digest: EVs2Vb3BnM3ZTQJeHFhrAYgSBBaXN5XLPEUB85TPpMRT
- Latest room id: 0x60d7dc558f36e526e02190bbfd8800eec9a9e683fbb4acb7a42d2a822c38b8d1

## Artifacts

- Publish JSON: /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.3ADTMyO7UO/publish.json (ephemeral)
- Call JSON: /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.3ADTMyO7UO/call.json (ephemeral)
- Event JSON: /var/folders/0n/yfqb3p112gg_29t_sxt3v7th0000gn/T/tmp.3ADTMyO7UO/events.json (ephemeral)

