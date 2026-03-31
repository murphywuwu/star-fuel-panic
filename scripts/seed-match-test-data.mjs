#!/usr/bin/env node

import crypto from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function nowIso() {
  return new Date().toISOString();
}

function resolveProjectionPath() {
  return process.env.RUNTIME_PROJECTION_STORE_PATH?.trim() || path.join(process.cwd(), "data", "runtime-projections.json");
}

function createEmptyProjectionState() {
  return {
    version: 1,
    updatedAt: null,
    meta: {
      nodes: { lastSyncAt: null, stale: false, reason: null },
      solarSystems: { lastSyncAt: null, stale: false, reason: null },
      constellations: { lastSyncAt: null, stale: false, reason: null }
    },
    networkNodes: [],
    solarSystemsCache: [],
    constellationSummaries: [],
    matches: [],
    planningTeams: [],
    planningTeamApplications: [],
    teams: [],
    teamMembers: [],
    teamJoinApplications: [],
    matchScores: [],
    fuelEvents: [],
    matchTargetNodes: [],
    matchStreamEvents: [],
    teamPayments: [],
    matchWhitelists: [],
    settlements: [],
    idempotencyKeys: [],
    workerHealth: []
  };
}

function loadProjectionState() {
  const filePath = resolveProjectionPath();
  if (!existsSync(filePath)) {
    return createEmptyProjectionState();
  }

  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return createEmptyProjectionState();
  }
}

function saveProjectionState(state) {
  const filePath = resolveProjectionPath();
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(
    filePath,
    JSON.stringify(
      {
        ...state,
        version: 1,
        updatedAt: nowIso()
      },
      null,
      2
    ),
    "utf8"
  );
}

function parseArgs(argv) {
  const args = {
    matchId: "",
    solarSystemId: 30000142,
    targetNodeId: "0xsimtargetnode001",
    teamCount: 2,
    baseUrl: process.env.MATCH_SIM_BASE_URL?.trim() || "http://127.0.0.1:3010"
  };

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--match-id" && next) {
      args.matchId = next;
      index += 1;
      continue;
    }

    if (arg === "--solar-system-id" && next) {
      args.solarSystemId = Number(next);
      index += 1;
      continue;
    }

    if (arg === "--target-node-id" && next) {
      args.targetNodeId = next;
      index += 1;
      continue;
    }

    if (arg === "--team-count" && next) {
      args.teamCount = Math.max(2, Math.min(4, Number(next) || 2));
      index += 1;
      continue;
    }

    if (arg === "--base-url" && next) {
      args.baseUrl = next;
      index += 1;
    }
  }

  return args;
}

function createMember(teamId, walletAddress, role) {
  return {
    id: crypto.randomUUID(),
    teamId,
    walletAddress,
    role,
    slotStatus: "locked",
    personalScore: 0,
    prizeAmount: null,
    joinedAt: nowIso()
  };
}

function createScore(matchId, teamId, walletAddress) {
  return {
    matchId,
    teamId,
    walletAddress,
    totalScore: 0,
    fuelDeposited: 0,
    updatedAt: nowIso()
  };
}

function buildSeed(matchId, solarSystemId, targetNodeId, teamCount) {
  const createdAt = nowIso();
  const teams = [];
  const members = [];
  const scores = [];
  const teamNames = ["ALPHA FROGS", "BETA HAULERS", "GAMMA ESCORTS", "DELTA CREW"];
  const teamRoles = [
    ["collector", "hauler", "escort"],
    ["collector", "hauler", "escort"],
    ["collector", "hauler", "escort"],
    ["collector", "hauler", "escort"]
  ];

  for (let teamIndex = 0; teamIndex < teamCount; teamIndex += 1) {
    const teamId = `${matchId}-team-${teamIndex + 1}`;
    const captainWallet = `0xsimcaptain${teamIndex + 1}`;
    teams.push({
      id: teamId,
      matchId,
      name: teamNames[teamIndex] ?? `SIM TEAM ${teamIndex + 1}`,
      captainAddress: captainWallet,
      maxSize: 3,
      isLocked: true,
      hasPaid: true,
      payTxDigest: `tx_seed_pay_${teamIndex + 1}`,
      totalScore: 0,
      rank: teamIndex + 1,
      prizeAmount: null,
      status: "paid",
      createdAt
    });

    for (let memberIndex = 0; memberIndex < 3; memberIndex += 1) {
      const walletAddress =
        memberIndex === 0 ? captainWallet : `0xsimmember${teamIndex + 1}${memberIndex + 1}`;
      const role = teamRoles[teamIndex]?.[memberIndex] ?? "escort";
      const member = createMember(teamId, walletAddress, role);
      members.push(member);
      scores.push(createScore(matchId, teamId, walletAddress));
    }
  }

  return {
    match: {
      id: matchId,
      onChainId: matchId,
      status: "running",
      creationMode: "precision",
      solarSystemId,
      targetNodeIds: [targetNodeId],
      prizePool: 1200,
      hostPrizePool: 600,
      entryFee: 50,
      minTeams: 2,
      maxTeams: teamCount,
      durationMinutes: 30,
      scoringMode: "weighted",
      triggerMode: "min_threshold",
      startedAt: createdAt,
      endedAt: null,
      createdBy: "0xsimhost",
      hostAddress: "0xsimhost",
      sponsorshipFee: 600,
      publishedAt: createdAt,
      publishIdempotencyKey: `seed-${matchId}`,
      createdAt
    },
    teams,
    members,
    scores,
    targetNodes: [
      {
        matchId,
        nodeObjectId: targetNodeId,
        capturedFillRatio: 0.01,
        capturedUrgency: "critical",
        name: "Sim Target Alpha",
        isOnline: true
      }
    ]
  };
}

function main() {
  const args = parseArgs(process.argv);
  const matchId = args.matchId || `sim-match-${Date.now()}`;
  const payload = buildSeed(matchId, args.solarSystemId, args.targetNodeId, args.teamCount);

  const state = loadProjectionState();
  state.matches = [...(state.matches ?? []).filter((match) => match.id !== matchId), payload.match];
  state.teams = [...(state.teams ?? []).filter((team) => team.matchId !== matchId), ...payload.teams];
  const teamIds = new Set(payload.teams.map((team) => team.id));
  state.teamMembers = [
    ...(state.teamMembers ?? []).filter((member) => !teamIds.has(member.teamId)),
    ...payload.members
  ];
  state.matchScores = [...(state.matchScores ?? []).filter((score) => score.matchId !== matchId), ...payload.scores];
  state.matchTargetNodes = [
    ...(state.matchTargetNodes ?? []).filter((row) => row.matchId !== matchId),
    ...payload.targetNodes
  ];
  saveProjectionState(state);

  console.log(`Seeded match: ${matchId}`);
  console.log(`Open live page: ${args.baseUrl}/match?matchId=${encodeURIComponent(matchId)}`);
  console.log(
    `Run simulation: node ./scripts/test-match-live.mjs --base-url ${args.baseUrl} --match-id ${matchId}`
  );
}

main();
