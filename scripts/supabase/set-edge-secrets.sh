#!/usr/bin/env bash
set -euo pipefail

required=(
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
)

for key in "${required[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    echo "[BLOCKED] Missing required env: $key"
    exit 2
  fi
done

supabase secrets set \
  SUPABASE_URL="$SUPABASE_URL" \
  SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
  CHAIN_GATEWAY_URL="${CHAIN_GATEWAY_URL:-}" \
  CHAIN_GATEWAY_API_KEY="${CHAIN_GATEWAY_API_KEY:-}" \
  PAYMENT_TX_VERIFIER_URL="${PAYMENT_TX_VERIFIER_URL:-}" \
  SETTLEMENT_CHAIN_SUBMITTER_URL="${SETTLEMENT_CHAIN_SUBMITTER_URL:-}" \
  SETTLEMENT_PLATFORM_FEE_BPS="${SETTLEMENT_PLATFORM_FEE_BPS:-1000}" \
  DEFAULT_MAX_TEAMS="${DEFAULT_MAX_TEAMS:-10}" \
  FORCE_START_SEC="${FORCE_START_SEC:-180}"

echo "[OK] Supabase Edge secrets updated."
