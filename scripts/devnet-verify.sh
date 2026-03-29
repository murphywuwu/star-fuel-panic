#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_DIR="${SUI_PACKAGE_DIR:-$PROJECT_ROOT/contracts}"
GAS_BUDGET="${SUI_GAS_BUDGET:-100000000}"
REPORT_PATH="${DEVNET_VERIFY_REPORT:-$PROJECT_ROOT/docs/devnet-verification-latest.md}"

ENTRY_FEE_LUX="${VERIFY_ENTRY_FEE_LUX:-100}"
PLAYER_LIMIT="${VERIFY_PLAYER_LIMIT:-4}"
HOST_SEED_POOL="${VERIFY_HOST_SEED_POOL:-0}"
PLATFORM_SUBSIDY_POOL="${VERIFY_PLATFORM_SUBSIDY_POOL:-80}"
SPONSOR_POOL="${VERIFY_SPONSOR_POOL:-50}"
PLATFORM_RAKE_BPS="${VERIFY_PLATFORM_RAKE_BPS:-500}"
HOST_REVSHARE_BPS="${VERIFY_HOST_REVSHARE_BPS:-0}"
CONFIG_HASH_HEX="${VERIFY_CONFIG_HASH_HEX:-0x6366672d6465766e6574}"
EVENT_LIMIT="${VERIFY_EVENT_LIMIT:-3}"
MATCH_MODE="${VERIFY_MATCH_MODE:-0}"
SOLAR_SYSTEM_ID="${VERIFY_SOLAR_SYSTEM_ID:-30000142}"
TARGET_NODE_IDS_HEX="${VERIFY_TARGET_NODE_IDS_HEX:-[]}"
EVENT_RETRY_COUNT="${VERIFY_EVENT_RETRY_COUNT:-6}"
EVENT_RETRY_SLEEP_SEC="${VERIFY_EVENT_RETRY_SLEEP_SEC:-2}"

TMP_DIR="$(mktemp -d)"
PUBLISH_JSON="$TMP_DIR/publish.json"
CALL_DRAFT_JSON="$TMP_DIR/call-draft.json"
CALL_PUBLISH_JSON="$TMP_DIR/call-publish.json"
EVENT_DRAFT_JSON="$TMP_DIR/events-draft.json"
EVENT_PUBLISH_JSON="$TMP_DIR/events-publish.json"
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

query_events_with_retry() {
  local event_type="$1"
  local output_path="$2"
  local attempt=1

  while [[ "$attempt" -le "$EVENT_RETRY_COUNT" ]]; do
    curl -sS "$ACTIVE_RPC" \
      -H 'Content-Type: application/json' \
      -d "$(jq -cn --arg event "$event_type" --argjson limit "$EVENT_LIMIT" '{jsonrpc:"2.0", id: 1, method:"suix_queryEvents", params:[{MoveEventType:$event}, null, $limit, true]}')" \
      > "$output_path"

    local count
    count="$(jq -r '.result.data | length // 0' "$output_path")"
    if [[ "$count" != "0" ]]; then
      return 0
    fi

    if [[ "$attempt" -lt "$EVENT_RETRY_COUNT" ]]; then
      sleep "$EVENT_RETRY_SLEEP_SEC"
    fi
    attempt=$((attempt + 1))
  done

  return 1
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
echo "> sui client call --package $PACKAGE_ID --module fuel_frog_panic --function create_match_draft ... --json"
sui client call \
  --package "$PACKAGE_ID" \
  --module fuel_frog_panic \
  --function create_match_draft \
  --args "$MATCH_MODE" "$SOLAR_SYSTEM_ID" "$TARGET_NODE_IDS_HEX" "$SPONSOR_POOL" "$PLAYER_LIMIT" "$ENTRY_FEE_LUX" 2 "$PLATFORM_SUBSIDY_POOL" "$CONFIG_HASH_HEX" \
  --gas-budget "$GAS_BUDGET" \
  --json > "$CALL_DRAFT_JSON"

CALL_DRAFT_TX_DIGEST="$(jq -r '.digest // .effects.transactionDigest // empty' "$CALL_DRAFT_JSON")"
DRAFT_EVENT_TYPE="${PACKAGE_ID}::fuel_frog_panic::MatchDraftCreated"
PUBLISH_EVENT_TYPE="${PACKAGE_ID}::fuel_frog_panic::MatchPublished"

query_events_with_retry "$DRAFT_EVENT_TYPE" "$EVENT_DRAFT_JSON"

DRAFT_EVENT_COUNT="$(jq -r '.result.data | length // 0' "$EVENT_DRAFT_JSON")"
LATEST_DRAFT_EVENT_ID="$(jq -r '.result.data[0].id.txDigest // empty' "$EVENT_DRAFT_JSON")"
LATEST_ROOM_ID="$(jq -r '.result.data[0].parsedJson.room_id // empty' "$EVENT_DRAFT_JSON")"

if [[ -z "$LATEST_ROOM_ID" || "$LATEST_ROOM_ID" == "null" ]]; then
  echo "[BLOCKED] Failed to parse room id from MatchDraftCreated event."
  exit 2
fi

echo
echo "> sui client call --package $PACKAGE_ID --module fuel_frog_panic --function publish_match --args $LATEST_ROOM_ID --json"
sui client call \
  --package "$PACKAGE_ID" \
  --module fuel_frog_panic \
  --function publish_match \
  --args "$LATEST_ROOM_ID" \
  --gas-budget "$GAS_BUDGET" \
  --json > "$CALL_PUBLISH_JSON"

CALL_PUBLISH_TX_DIGEST="$(jq -r '.digest // .effects.transactionDigest // empty' "$CALL_PUBLISH_JSON")"

query_events_with_retry "$PUBLISH_EVENT_TYPE" "$EVENT_PUBLISH_JSON"

PUBLISH_EVENT_COUNT="$(jq -r '.result.data | length // 0' "$EVENT_PUBLISH_JSON")"
LATEST_PUBLISH_EVENT_ID="$(jq -r '.result.data[0].id.txDigest // empty' "$EVENT_PUBLISH_JSON")"

UTC_TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

cat > "$REPORT_PATH" <<MD
# Devnet Verification Report

Generated At (UTC): $UTC_TS

## Commands Executed

sui client switch --env devnet
sui client envs
sui move test (env: $MOVE_TEST_ENV)
sui client test-publish --gas-budget $GAS_BUDGET --json -e devnet --pubfile-path $PUBFILE_PATH
sui client call --package $PACKAGE_ID --module fuel_frog_panic --function create_match_draft --args $MATCH_MODE $SOLAR_SYSTEM_ID $TARGET_NODE_IDS_HEX $SPONSOR_POOL $PLAYER_LIMIT $ENTRY_FEE_LUX 2 $PLATFORM_SUBSIDY_POOL $CONFIG_HASH_HEX --gas-budget $GAS_BUDGET --json
sui client call --package $PACKAGE_ID --module fuel_frog_panic --function publish_match --args $LATEST_ROOM_ID --gas-budget $GAS_BUDGET --json
curl <devnet-rpc> suix_queryEvents MoveEventType($DRAFT_EVENT_TYPE)
curl <devnet-rpc> suix_queryEvents MoveEventType($PUBLISH_EVENT_TYPE)

## Key Outcomes

- Active env: $ACTIVE_ENV
- Active address: $ACTIVE_ADDRESS
- RPC endpoint: $ACTIVE_RPC
- Publish tx digest: ${PUBLISH_TX_DIGEST:-N/A}
- Published package id: $PACKAGE_ID
- create_match_draft tx digest: ${CALL_DRAFT_TX_DIGEST:-N/A}
- publish_match tx digest: ${CALL_PUBLISH_TX_DIGEST:-N/A}
- Draft event type: $DRAFT_EVENT_TYPE
- Draft event rows returned: $DRAFT_EVENT_COUNT
- Latest draft event tx digest: ${LATEST_DRAFT_EVENT_ID:-N/A}
- Publish event type: $PUBLISH_EVENT_TYPE
- Publish event rows returned: $PUBLISH_EVENT_COUNT
- Latest publish event tx digest: ${LATEST_PUBLISH_EVENT_ID:-N/A}
- Latest room id: ${LATEST_ROOM_ID:-N/A}

## Artifacts

- Publish JSON: $PUBLISH_JSON (ephemeral)
- Draft Call JSON: $CALL_DRAFT_JSON (ephemeral)
- Publish Call JSON: $CALL_PUBLISH_JSON (ephemeral)
- Draft Event JSON: $EVENT_DRAFT_JSON (ephemeral)
- Publish Event JSON: $EVENT_PUBLISH_JSON (ephemeral)

MD

echo
echo "[OK] Devnet verification completed. Report: $REPORT_PATH"
