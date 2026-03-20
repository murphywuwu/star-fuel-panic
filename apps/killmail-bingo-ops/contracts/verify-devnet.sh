#!/usr/bin/env bash
set -euo pipefail

run() {
  echo
  echo "> $*"
  "$@"
}

run sui client envs
run sui client switch --env devnet
run sui client active-address
run sui client gas
run sui move test -e testnet

echo

PUBFILE_PATH="/tmp/kbo-pub-$(date +%s)-$$.toml"
rm -f "${PUBFILE_PATH}"
echo "> sui client test-publish --build-env devnet --pubfile-path ${PUBFILE_PATH} --gas-budget 100000000"
if sui client test-publish --build-env devnet --pubfile-path "${PUBFILE_PATH}" --gas-budget 100000000; then
  echo "[OK] test-publish succeeded"
else
  echo "[WARN] test-publish failed (expected in no-gas or network-limited environments)"
fi
