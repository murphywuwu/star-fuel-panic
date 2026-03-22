#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";

const matchCard = fs.readFileSync("src/view/components/MatchCard.tsx", "utf8");
const nodeDetail = fs.readFileSync("src/view/components/NodeDetailOverlay.tsx", "utf8");
const lobbyModules = fs.readFileSync("src/view/components/LobbyModules.tsx", "utf8");

assert.ok(matchCard.includes("buildMissionTeamRuleSummary"), "MatchCard must use shared mission rule summary");
assert.ok(nodeDetail.includes("buildMissionTeamRuleSummary"), "NodeDetailOverlay must use shared mission rule summary");
assert.ok(lobbyModules.includes("buildTeamRuleSummary"), "Lobby modules must use shared team rule summary builder");

for (const token of ["teamScaleText", "teamProgressText", "startThresholdText"]) {
  assert.ok(matchCard.includes(token), `MatchCard missing ${token}`);
  assert.ok(nodeDetail.includes(token), `NodeDetailOverlay missing ${token}`);
  assert.ok(lobbyModules.includes(token), `LobbyModules missing ${token}`);
}

console.log("[qa] pass: card/detail/lobby render consistent team-rule summary fields.");
