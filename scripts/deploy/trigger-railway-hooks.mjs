const TARGETS = {
  staging: [
    "RAILWAY_WEB_DEPLOY_HOOK_URL_STAGING",
    "RAILWAY_RUNTIME_WORKERS_DEPLOY_HOOK_URL_STAGING",
    "RAILWAY_NODE_INDEXER_DEPLOY_HOOK_URL_STAGING"
  ],
  production: [
    "RAILWAY_WEB_DEPLOY_HOOK_URL_PRODUCTION",
    "RAILWAY_RUNTIME_WORKERS_DEPLOY_HOOK_URL_PRODUCTION",
    "RAILWAY_NODE_INDEXER_DEPLOY_HOOK_URL_PRODUCTION"
  ]
};

async function trigger(url, name) {
  const response = await fetch(url, { method: "POST" });
  if (!response.ok) {
    throw new Error(`${name} failed with status ${response.status}`);
  }
  console.log(`[railway-deploy] triggered ${name}`);
}

const environment = process.argv[2]?.trim();
if (!environment || !(environment in TARGETS)) {
  console.error(`Usage: node scripts/deploy/trigger-railway-hooks.mjs <${Object.keys(TARGETS).join("|")}>`);
  process.exit(1);
}

for (const key of TARGETS[environment]) {
  const url = process.env[key]?.trim();
  if (!url) {
    console.error(`[railway-deploy] missing ${key}`);
    process.exit(1);
  }
}

for (const key of TARGETS[environment]) {
  await trigger(process.env[key], key);
}
