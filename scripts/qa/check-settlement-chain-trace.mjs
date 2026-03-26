#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";

const triggerSettlement = fs.readFileSync("supabase/functions/trigger-settlement/index.ts", "utf8");
const getBill = fs.readFileSync("supabase/functions/get-settlement-bill/index.ts", "utf8");
const settlementService = fs.readFileSync("src/service/settlementService.ts", "utf8");

assert.ok(triggerSettlement.includes("settlement_tx"), "trigger-settlement must persist settlement_tx");
assert.ok(triggerSettlement.includes("result_hash"), "trigger-settlement must persist result_hash");
assert.ok(getBill.includes("settlement_tx"), "get-settlement-bill must query settlement_tx");
assert.ok(settlementService.includes("payoutTxDigest"), "frontend settlement service must expose payoutTxDigest");

console.log("[qa] pass: settlement bill remains traceable to on-chain payout tx fields.");
