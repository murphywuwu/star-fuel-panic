#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_DIR="${SUI_PACKAGE_DIR:-$PROJECT_ROOT/contracts}"
GAS_BUDGET="${SUI_GAS_BUDGET:-100000000}"

run() {
  echo
  echo "> $*"
  "$@"
}

if ! command -v sui >/dev/null 2>&1; then
  echo "[BLOCKED] sui CLI is not installed in current environment."
  echo "Install Sui CLI first, then rerun this script."
  exit 2
fi

if [[ ! -f "$PACKAGE_DIR/Move.toml" ]]; then
  echo "[BLOCKED] Move.toml not found in package directory: $PACKAGE_DIR"
  exit 2
fi

run sui client envs
run sui client switch --env devnet

(
  cd "$PACKAGE_DIR"
  run sui move test -e testnet
)

(
  cd "$PACKAGE_DIR"
  run sui client test-publish --gas-budget "$GAS_BUDGET" -e testnet
)

echo
echo "[OK] Local move tests + devnet test-publish commands executed."
