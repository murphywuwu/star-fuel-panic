#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";

const createTeam = fs.readFileSync("supabase/functions/create-team/index.ts", "utf8");
const lockTeam = fs.readFileSync("supabase/functions/lock-team/index.ts", "utf8");
const payEntry = fs.readFileSync("supabase/functions/pay-entry/index.ts", "utf8");
const matchTick = fs.readFileSync("supabase/functions/match-tick/index.ts", "utf8");

assert.ok(createTeam.includes('status: "forming"'), "create-team must create forming team");
assert.ok(lockTeam.includes('status: "locked"'), "lock-team must move team to locked");
assert.ok(payEntry.includes('status: "paid"'), "pay-entry must move team to paid");
assert.ok(payEntry.includes("registerWhitelistOnChain"), "pay-entry must call register_whitelist chain path");

for (const token of [
  'safeTransition(supabase, match, "pre_start"',
  'safeTransition(supabase, match, "running"',
  'safeTransition(supabase, match, "panic"',
  'safeTransition(supabase, match, "settling"',
  'safeTransition(supabase, match, "settled"'
]) {
  assert.ok(matchTick.includes(token), `match-tick missing transition token: ${token}`);
}

assert.ok(matchTick.includes("startMatchOnChain"), "match-tick must call start_match chain path");
assert.ok(matchTick.includes("triggerSettlement"), "match-tick must trigger settlement on settling phase");

console.log("[qa] pass: implementation contains Lobby -> Lock -> Pay -> Running -> Settled critical path.");
