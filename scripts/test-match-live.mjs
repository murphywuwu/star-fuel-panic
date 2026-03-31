#!/usr/bin/env node

const DEFAULT_BASE_URL = process.env.MATCH_SIM_BASE_URL?.trim() || "http://127.0.0.1:3010";

function parseArgs(argv) {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    matchId: "",
    scenario: "warboard",
    assemblyId: "",
    dryRun: false
  };

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--base-url" && next) {
      args.baseUrl = next;
      index += 1;
      continue;
    }
    if (arg === "--match-id" && next) {
      args.matchId = next;
      index += 1;
      continue;
    }
    if (arg === "--scenario" && next) {
      args.scenario = next;
      index += 1;
      continue;
    }
    if (arg === "--assembly-id" && next) {
      args.assemblyId = next;
      index += 1;
      continue;
    }
    if (arg === "--dry-run") {
      args.dryRun = true;
    }
  }

  return args;
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message || `HTTP ${response.status}`);
  }
  return payload;
}

function pickFirstMemberForTeam(team, members) {
  return members.find((member) => member.teamId === team.id) ?? null;
}

function buildScenario(detail, scoreboard, assemblyIdOverride) {
  const teams = detail.teams ?? [];
  const members = detail.members ?? [];
  if (teams.length < 2) {
    throw new Error("Scenario requires at least 2 teams in the match.");
  }

  const teamA = teams[0];
  const teamB = teams[1];
  const memberA = pickFirstMemberForTeam(teamA, members);
  const memberB = pickFirstMemberForTeam(teamB, members);
  if (!memberA || !memberB) {
    throw new Error("Scenario requires at least 1 member in each of the first 2 teams.");
  }

  const assemblyId =
    assemblyIdOverride ||
    scoreboard?.targetNodes?.[0]?.objectId ||
    detail.match?.targetNodes?.[0]?.objectId ||
    "sim-node-001";
  const nodeName =
    scoreboard?.targetNodes?.[0]?.name ||
    detail.match?.targetNodes?.[0]?.name ||
    "Simulated Node";

  return [
    {
      label: "A // standard critical open",
      walletAddress: memberA.walletAddress,
      assemblyId,
      nodeName,
      fuelAdded: 120,
      fuelTypeId: 88335,
      oldQuantity: 0,
      maxCapacity: 100000
    },
    {
      label: "B // refined critical response",
      walletAddress: memberB.walletAddress,
      assemblyId,
      nodeName,
      fuelAdded: 90,
      fuelTypeId: 78515,
      oldQuantity: 500,
      maxCapacity: 100000
    },
    {
      label: "A // premium warning lane",
      walletAddress: memberA.walletAddress,
      assemblyId,
      nodeName,
      fuelAdded: 140,
      fuelTypeId: 99999,
      fuelEfficiency: 55,
      oldQuantity: 25000,
      maxCapacity: 100000
    },
    {
      label: "B // refined panic spike",
      walletAddress: memberB.walletAddress,
      assemblyId,
      nodeName,
      fuelAdded: 110,
      fuelTypeId: 78515,
      oldQuantity: 1000,
      maxCapacity: 100000,
      forcePanic: true
    }
  ];
}

function printScoreboard(payload) {
  const teams = payload?.data?.teams ?? payload?.teams ?? [];
  if (!Array.isArray(teams) || teams.length === 0) {
    console.log("Scoreboard: no teams");
    return;
  }

  console.log("Scoreboard:");
  for (const team of teams) {
    console.log(`  #${team.rank} ${team.teamName} ${team.score}`);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.matchId) {
    throw new Error("Usage: node ./scripts/test-match-live.mjs --match-id <matchId> [--base-url http://127.0.0.1:3010]");
  }

  const detail = await fetchJson(`${args.baseUrl}/api/matches/${encodeURIComponent(args.matchId)}`);
  const scoreboard = await fetchJson(`${args.baseUrl}/api/matches/${encodeURIComponent(args.matchId)}/scoreboard`);
  const steps = buildScenario(detail, scoreboard, args.assemblyId);

  console.log(`Scenario: ${args.scenario}`);
  console.log(`Base URL: ${args.baseUrl}`);
  console.log(`Match: ${args.matchId}`);
  console.log(`Steps: ${steps.length}`);
  printScoreboard(scoreboard);

  if (args.dryRun) {
    for (const step of steps) {
      console.log(`[dry-run] ${step.label}`);
    }
    return;
  }

  for (const [index, step] of steps.entries()) {
    const response = await fetchJson(
      `${args.baseUrl}/api/matches/${encodeURIComponent(args.matchId)}/simulate-fuel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(step)
      }
    );

    console.log(`Step ${index + 1}/${steps.length}: ${step.label}`);
    console.log(
      `  scoreDelta=${response.data.scoreDelta} grade=${response.data.fuelDeposit.fuelGrade.label} panic=${response.data.fuelDeposit.panicMultiplier}`
    );

    const liveScoreboard = await fetchJson(
      `${args.baseUrl}/api/matches/${encodeURIComponent(args.matchId)}/scoreboard`
    );
    printScoreboard(liveScoreboard);
  }

  console.log("Scenario complete.");
  console.log(`Open ${args.baseUrl}/match and switch to LIVE FEED for visual verification.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
