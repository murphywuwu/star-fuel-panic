#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_DIR="${SUI_PACKAGE_DIR:-$PROJECT_ROOT/contracts}"
GAS_BUDGET="${SUI_GAS_BUDGET:-100000000}"
REPORT_PATH="${DEVNET_VERIFY_REPORT:-$PROJECT_ROOT/docs/devnet-verification-latest.md}"

ENTRY_FEE_LUX="${VERIFY_ENTRY_FEE_LUX:-100}"
PLAYER_LIMIT="${VERIFY_PLAYER_LIMIT:-4}"
HOST_SEED_POOL="${VERIFY_HOST_SEED_POOL:-120}"
PLATFORM_SUBSIDY_POOL="${VERIFY_PLATFORM_SUBSIDY_POOL:-80}"
SPONSOR_POOL="${VERIFY_SPONSOR_POOL:-50}"
PLATFORM_RAKE_BPS="${VERIFY_PLATFORM_RAKE_BPS:-900}"
HOST_REVSHARE_BPS="${VERIFY_HOST_REVSHARE_BPS:-4000}"
CONFIG_HASH_HEX="${VERIFY_CONFIG_HASH_HEX:-0x6366672d6465766e6574}"
EVENT_LIMIT="${VERIFY_EVENT_LIMIT:-3}"

TMP_DIR="$(mktemp -d)"
PUBLISH_JSON="$TMP_DIR/publish.json"
CALL_JSON="$TMP_DIR/call.json"
EVENT_JSON="$TMP_DIR/events.json"
PUBFILE_PATH="$TMP_DIR/Pub.devnet.toml"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

run() {
  echo
  echo "> $*"
  "$@"
}

if ! command -v sui >/dev/null 2>&1; then
  echo "[BLOCKED] sui CLI is not installed in current environment."
  exit 2
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "[BLOCKED] jq is required for parsing JSON outputs."
  exit 2
fi
if [[ ! -f "$PACKAGE_DIR/Move.toml" ]]; then
  echo "[BLOCKED] Move.toml not found in package directory: $PACKAGE_DIR"
  exit 2
fi

run sui client switch --env devnet
run sui client envs

ACTIVE_ENV="$(sui client --json active-env | jq -r '.')"
ACTIVE_ADDRESS="$(sui client --json active-address | jq -r '.')"
ACTIVE_RPC="$(sui client --json envs | jq -r --arg active "$ACTIVE_ENV" '.[0][] | select(.alias == $active) | .rpc')"
# Fallback to the known devnet alias if active-env parse fails unexpectedly.
if [[ -z "$ACTIVE_RPC" || "$ACTIVE_RPC" == "null" ]]; then
  ACTIVE_RPC="$(sui client --json envs | jq -r '.[0][] | select(.alias == "devnet") | .rpc')"
fi

MOVE_TEST_ENV="default"
if ! (
  cd "$PACKAGE_DIR"
  run sui move test
); then
  echo
  echo "[WARN] Default sui move test failed under current client env; retrying with -e testnet."
  (
    cd "$PACKAGE_DIR"
    run sui move test -e testnet
  )
  MOVE_TEST_ENV="testnet-fallback"
fi

(
  cd "$PACKAGE_DIR"
  echo
  echo "> sui client test-publish --gas-budget $GAS_BUDGET --json -e devnet --pubfile-path $PUBFILE_PATH"
  sui client test-publish --gas-budget "$GAS_BUDGET" --json -e devnet --pubfile-path "$PUBFILE_PATH" > "$PUBLISH_JSON"
)

PUBLISH_TX_DIGEST="$(jq -r '.digest // .effects.transactionDigest // empty' "$PUBLISH_JSON")"
PACKAGE_ID="$(jq -r '.objectChanges[]? | select(.type == "published") | .packageId' "$PUBLISH_JSON" | head -n 1)"
if [[ -z "$PACKAGE_ID" || "$PACKAGE_ID" == "null" ]]; then
  PACKAGE_ID="$(jq -r '.effects.created[]?.reference.objectId // empty' "$PUBLISH_JSON" | head -n 1)"
fi

if [[ -z "$PACKAGE_ID" || "$PACKAGE_ID" == "null" ]]; then
  echo "[BLOCKED] Failed to parse published package ID from publish output."
  exit 2
fi

echo
echo "> sui client call --package $PACKAGE_ID --module fuel_frog_panic --function create_room ... --json"
sui client call \
  --package "$PACKAGE_ID" \
  --module fuel_frog_panic \
  --function create_room \
  --args "$ENTRY_FEE_LUX" "$PLAYER_LIMIT" "$HOST_SEED_POOL" "$PLATFORM_SUBSIDY_POOL" "$SPONSOR_POOL" "$PLATFORM_RAKE_BPS" "$HOST_REVSHARE_BPS" "$CONFIG_HASH_HEX" \
  --gas-budget "$GAS_BUDGET" \
  --json > "$CALL_JSON"

CALL_TX_DIGEST="$(jq -r '.digest // .effects.transactionDigest // empty' "$CALL_JSON")"
ROOM_EVENT_TYPE="${PACKAGE_ID}::fuel_frog_panic::RoomCreated"

curl -sS "$ACTIVE_RPC" \
  -H 'Content-Type: application/json' \
  -d "$(jq -cn --arg event "$ROOM_EVENT_TYPE" --argjson limit "$EVENT_LIMIT" '{jsonrpc:"2.0", id: 1, method:"suix_queryEvents", params:[{MoveEventType:$event}, null, $limit, true]}')" \
  > "$EVENT_JSON"

EVENT_COUNT="$(jq -r '.result.data | length // 0' "$EVENT_JSON")"
LATEST_EVENT_ID="$(jq -r '.result.data[0].id.txDigest // empty' "$EVENT_JSON")"
LATEST_ROOM_ID="$(jq -r '.result.data[0].parsedJson.room_id // empty' "$EVENT_JSON")"

UTC_TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

cat > "$REPORT_PATH" <<MD
# Devnet Verification Report

Generated At (UTC): $UTC_TS

## Commands Executed

sui client switch --env devnet
sui client envs
sui move test (env: $MOVE_TEST_ENV)
sui client test-publish --gas-budget $GAS_BUDGET --json -e devnet --pubfile-path $PUBFILE_PATH
sui client call --package $PACKAGE_ID --module fuel_frog_panic --function create_room --args $ENTRY_FEE_LUX $PLAYER_LIMIT $HOST_SEED_POOL $PLATFORM_SUBSIDY_POOL $SPONSOR_POOL $PLATFORM_RAKE_BPS $HOST_REVSHARE_BPS $CONFIG_HASH_HEX --gas-budget $GAS_BUDGET --json
curl <devnet-rpc> suix_queryEvents MoveEventType($ROOM_EVENT_TYPE)

## Key Outcomes

- Active env: $ACTIVE_ENV
- Active address: $ACTIVE_ADDRESS
- RPC endpoint: $ACTIVE_RPC
- Publish tx digest: ${PUBLISH_TX_DIGEST:-N/A}
- Published package id: $PACKAGE_ID
- create_room tx digest: ${CALL_TX_DIGEST:-N/A}
- Queried event type: $ROOM_EVENT_TYPE
- Event rows returned: $EVENT_COUNT
- Latest event tx digest: ${LATEST_EVENT_ID:-N/A}
- Latest room id: ${LATEST_ROOM_ID:-N/A}

## Artifacts

- Publish JSON: $PUBLISH_JSON (ephemeral)
- Call JSON: $CALL_JSON (ephemeral)
- Event JSON: $EVENT_JSON (ephemeral)

MD

echo
echo "[OK] Devnet verification completed. Report: $REPORT_PATH"
