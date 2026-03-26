#!/usr/bin/env node
import { execSync } from "node:child_process";

const commands = [
  "node scripts/qa/check-whitelist-after-pay.mjs",
  "node scripts/qa/check-match-state-machine.mjs",
  "node scripts/qa/check-settlement-rules.mjs",
  "node scripts/qa/check-ui-team-rules-consistency.mjs",
  "node scripts/qa/check-integration-lobby-lock-pay-running-settled.mjs",
  "node scripts/qa/check-settlement-chain-trace.mjs",
  "node scripts/qa/check-api-routes.mjs"
];

for (const cmd of commands) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

console.log("[qa] all checks passed.");
