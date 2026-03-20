#!/usr/bin/env bash
set -euo pipefail

PACKAGE_DIR="${SUI_PACKAGE_DIR:-}"
GAS_BUDGET="${SUI_GAS_BUDGET:-100000000}"
CONFIG_DIR="${SUI_CONFIG_DIR:-$(pwd)/.sui/sui_config}"
MOVE_HOME_DIR="${MOVE_HOME:-$(pwd)/.move}"
MOVE_TEST_CLIENT_ENV="${SUI_MOVE_TEST_ENV:-testnet}"
TEST_PUBLISH_BUILD_ENV="${SUI_TEST_PUBLISH_BUILD_ENV:-devnet}"

if [ -z "${PACKAGE_DIR}" ]; then
  if [ -f "./contracts/Move.toml" ]; then
    PACKAGE_DIR="./contracts"
  elif [ -f "Move.toml" ]; then
    PACKAGE_DIR="$(pwd)"
  else
    echo "[devnet-check] ERROR: Move.toml not found. Set SUI_PACKAGE_DIR to your Sui package path."
    exit 1
  fi
fi

if [ ! -f "${PACKAGE_DIR}/Move.toml" ]; then
  echo "[devnet-check] ERROR: Move.toml missing in SUI_PACKAGE_DIR=${PACKAGE_DIR}"
  exit 1
fi

if ! command -v sui >/dev/null 2>&1; then
  echo "[devnet-check] ERROR: sui CLI not found in PATH"
  echo "[devnet-check] ACTION: install Sui CLI first, then rerun npm run test:devnet"
  exit 1
fi

mkdir -p "${CONFIG_DIR}"
export SUI_CONFIG_DIR="${CONFIG_DIR}"
mkdir -p "${MOVE_HOME_DIR}"
export MOVE_HOME="${MOVE_HOME_DIR}"

echo "[devnet-check] Using package dir: ${PACKAGE_DIR}"
echo "[devnet-check] Using config dir: ${SUI_CONFIG_DIR}"
echo "[devnet-check] Using MOVE_HOME: ${MOVE_HOME}"
echo "[devnet-check] Using move-test client env: ${MOVE_TEST_CLIENT_ENV}"
echo "[devnet-check] Using test-publish build env: ${TEST_PUBLISH_BUILD_ENV}"
echo "[devnet-check] Ensuring devnet env exists..."
if ! sui client envs 2>/dev/null | grep -q "devnet"; then
  sui client new-env --alias devnet --rpc "https://fullnode.devnet.sui.io:443"
fi

echo "[devnet-check] Switching to devnet..."
sui client switch --env devnet

echo "[devnet-check] Current envs:"
sui client envs

echo "[devnet-check] Running local move tests..."
(
  cd "${PACKAGE_DIR}"
  sui move test -e "${MOVE_TEST_CLIENT_ENV}"
)

echo "[devnet-check] Publishing package to devnet..."
set +e
PUBLISH_OUTPUT="$((
  cd "${PACKAGE_DIR}" &&
  sui client publish --gas-budget "${GAS_BUDGET}" --skip-dependency-verification
) 2>&1)"
PUBLISH_CODE=$?
set -e

echo "${PUBLISH_OUTPUT}"
if [ ${PUBLISH_CODE} -eq 0 ]; then
  echo "[devnet-check] DONE"
  exit 0
fi

echo "[devnet-check] WARN: publish failed, attempting test-publish dry-run fallback..."
set +e
TEST_PUBLISH_OUTPUT="$((
  cd "${PACKAGE_DIR}" &&
  sui client test-publish --gas-budget "${GAS_BUDGET}" --skip-dependency-verification --dry-run --build-env "${TEST_PUBLISH_BUILD_ENV}"
) 2>&1)"
TEST_PUBLISH_CODE=$?
set -e

echo "${TEST_PUBLISH_OUTPUT}"

if [ ${TEST_PUBLISH_CODE} -ne 0 ]; then
  echo "[devnet-check] BLOCKED: devnet integration command failed in both publish and test-publish paths."
  exit ${TEST_PUBLISH_CODE}
fi

echo "[devnet-check] DONE (test-publish dry-run fallback)"
