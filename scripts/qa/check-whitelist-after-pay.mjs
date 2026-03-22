#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("supabase/functions/pay-entry/index.ts", "utf8");

const checks = [
  ".from(\"team_members\")",
  ".select(\"wallet_address\")",
  "const whitelistRows = requestedAddresses.map",
  ".from(\"match_whitelist\")",
  "upsert(whitelistRows",
  "registerWhitelistOnChain",
  "status: \"paid\"",
  "whitelistCount: requestedAddresses.length"
];

for (const token of checks) {
  assert.ok(source.includes(token), `missing required pay-entry flow token: ${token}`);
}

console.log("[qa] pass: pay-entry includes member-wide whitelist registration and paid-state update.");
