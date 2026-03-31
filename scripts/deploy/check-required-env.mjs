const REQUIRED_ENV_BY_TARGET = {
  web: [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUI_NETWORK",
    "NEXT_PUBLIC_SUI_RPC_URL",
    "NEXT_PUBLIC_LUX_COIN_TYPE",
    "NEXT_PUBLIC_LUX_DECIMALS",
    "NEXT_PUBLIC_PAYMENT_TOKEN_LABEL",
    "NEXT_PUBLIC_PAYMENT_TOKEN_SYMBOL",
    "NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUI_RPC_URL",
    "FUEL_FROG_CHAIN_MODE",
    "EVE_FRONTIER_FUEL_CONFIG_ID",
    "EVE_FRONTIER_WORLD_API_BASE_URL",
    "RUNTIME_PROJECTION_STORE_PATH"
  ],
  "runtime-workers": [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUI_RPC_URL",
    "NEXT_PUBLIC_LUX_COIN_TYPE",
    "NEXT_PUBLIC_LUX_DECIMALS",
    "FUEL_FROG_CHAIN_MODE",
    "EVE_FRONTIER_FUEL_CONFIG_ID",
    "EVE_FRONTIER_WORLD_API_BASE_URL",
    "RUNTIME_PROJECTION_STORE_PATH"
  ],
  "node-indexer": [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUI_RPC_URL",
    "EVE_FRONTIER_WORLD_API_BASE_URL",
    "NODE_INDEX_STORE_PATH"
  ],
  "github-staging": [
    "SUPABASE_ACCESS_TOKEN_STAGING",
    "SUPABASE_PROJECT_ID_STAGING",
    "SUPABASE_DB_URL_STAGING",
    "RAILWAY_WEB_DEPLOY_HOOK_URL_STAGING",
    "RAILWAY_RUNTIME_WORKERS_DEPLOY_HOOK_URL_STAGING",
    "RAILWAY_NODE_INDEXER_DEPLOY_HOOK_URL_STAGING"
  ],
  "github-production": [
    "SUPABASE_ACCESS_TOKEN_PRODUCTION",
    "SUPABASE_PROJECT_ID_PRODUCTION",
    "SUPABASE_DB_URL_PRODUCTION",
    "RAILWAY_WEB_DEPLOY_HOOK_URL_PRODUCTION",
    "RAILWAY_RUNTIME_WORKERS_DEPLOY_HOOK_URL_PRODUCTION",
    "RAILWAY_NODE_INDEXER_DEPLOY_HOOK_URL_PRODUCTION"
  ]
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

const target = process.argv[2]?.trim();
if (!target || !(target in REQUIRED_ENV_BY_TARGET)) {
  fail(`Usage: node scripts/deploy/check-required-env.mjs <${Object.keys(REQUIRED_ENV_BY_TARGET).join("|")}>`);
}

const required = REQUIRED_ENV_BY_TARGET[target];
const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  fail(`[deploy-env] missing required variables for ${target}: ${missing.join(", ")}`);
}

console.log(`[deploy-env] ${target} ok (${required.length} variables checked)`);
