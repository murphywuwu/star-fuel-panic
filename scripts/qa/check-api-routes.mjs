#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";

const createRoute = fs.readFileSync("src/app/api/matches/[id]/teams/route.ts", "utf8");
const joinRoute = fs.readFileSync("src/app/api/teams/[id]/join/route.ts", "utf8");
const lockRoute = fs.readFileSync("src/app/api/teams/[id]/lock/route.ts", "utf8");
const payRoute = fs.readFileSync("src/app/api/teams/[id]/pay/route.ts", "utf8");
const resultRoute = fs.readFileSync("src/app/api/matches/[id]/result/route.ts", "utf8");

assert.ok(createRoute.includes("createTeam"), "create route must delegate to createTeam");
assert.ok(joinRoute.includes("joinTeam"), "join route must delegate to joinTeam");
assert.ok(lockRoute.includes("lockTeam"), "lock route must delegate to lockTeam");
assert.ok(payRoute.includes("payTeamEntry"), "pay route must delegate to payTeamEntry");
assert.ok(resultRoute.includes("getSettlementBill"), "result route must delegate to settlement runtime");

console.log("[qa] pass: team-flow API routes and result route exist.");
