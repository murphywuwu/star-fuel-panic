#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

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

run sui client envs
run sui client switch --env devnet

if [[ -f "Move.toml" ]]; then
  run sui move test
else
  echo
  echo "[SKIP] No Move.toml found in this project. Skip 'sui move test'."
fi

echo

echo "[OK] Local + devnet verification commands executed."
