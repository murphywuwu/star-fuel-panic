import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  createEmptyProjectionState,
  readRuntimeProjectionState,
  writeRuntimeProjectionState
} from "../../src/server/runtimeProjectionStore.ts";
import {
  deleteMatchDetailFromBackend,
  hydrateRuntimeProjectionFromBackendIfNeeded,
  persistMatchDetailToBackend
} from "../../src/server/matchBackendStore.ts";

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

async function supabaseRest(pathname, init = {}) {
  const baseUrl = requireEnv("SUPABASE_URL").replace(/\/+$/, "");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(`${baseUrl}/rest/v1/${pathname}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers
    }
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`SUPABASE_${response.status}_${pathname}:${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function buildFixture(matchId) {
  const teamId = randomUUID();
  const memberId = randomUUID();
  const createdAt = "2026-03-28T12:00:00.000Z";

  return {
    matchId,
    teamId,
    memberId,
    match: {
      id: matchId,
      onChainId: null,
      status: "settled",
      creationMode: "precision",
      solarSystemId: 30000142,
      targetNodeIds: ["node-jita-critical"],
      prizePool: 290,
      hostPrizePool: 50,
      entryFee: 120,
      platformSubsidy: 0,
      minTeams: 2,
      maxTeams: 4,
      minPlayers: 0,
      registeredTeams: 1,
      paidTeams: 1,
      durationMinutes: 120,
      scoringMode: "weighted",
      triggerMode: "min_threshold",
      startedAt: "2026-03-28T12:05:00.000Z",
      endedAt: "2026-03-28T14:05:00.000Z",
      createdBy: "0xlocal-host",
      hostAddress: "0xlocal-host",
      sponsorshipFee: 50,
      publishedAt: "2026-03-28T12:03:00.000Z",
      publishIdempotencyKey: "local-smoke-publish",
      createdAt
    },
    team: {
      id: teamId,
      matchId,
      name: "LOCAL-ALPHA",
      captainAddress: "0xlocal-host",
      maxSize: 3,
      isLocked: true,
      hasPaid: true,
      payTxDigest: "0xlocal-pay",
      totalScore: 180,
      rank: 1,
      prizeAmount: 275.5,
      status: "paid",
      createdAt,
      roleSlots: {
        collector: 1,
        hauler: 1,
        escort: 1
      },
      whitelistCount: 1
    },
    member: {
      id: memberId,
      teamId,
      walletAddress: "0xlocal-host",
      role: "collector",
      slotStatus: "confirmed",
      personalScore: 180,
      prizeAmount: 275.5,
      joinedAt: createdAt
    },
    settlement: {
      matchId,
      payoutTxDigest: "0xlocal-settlement",
      updatedAt: "2026-03-28T14:10:00.000Z",
      status: "succeeded",
      bill: {
        matchId,
        sponsorshipFee: "50",
        entryFeeTotal: "240",
        platformSubsidy: "0",
        grossPool: "290",
        platformFeeRate: 0.05,
        platformFee: "14.5",
        payoutPool: "275.5",
        payoutTxDigest: "0xlocal-settlement",
        teamBreakdown: [
          {
            teamId,
            teamName: "LOCAL-ALPHA",
            rank: 1,
            teamScore: 180,
            payoutAmount: "275.5",
            members: [
              {
                walletAddress: "0xlocal-host",
                role: "collector",
                contributionScore: 180,
                payoutAmount: "275.5"
              }
            ]
          }
        ],
        mvp: {
          walletAddress: "0xlocal-host",
          role: "collector",
          contributionScore: 180
        }
      }
    }
  };
}

const root = mkdtempSync(path.join(os.tmpdir(), "ffp-supabase-local-"));
process.env.RUNTIME_PROJECTION_STORE_PATH = path.join(root, "projection.json");

const matchId = randomUUID();
const fixture = buildFixture(matchId);

try {
  const initial = createEmptyProjectionState();
  initial.matches = [fixture.match];
  initial.teams = [fixture.team];
  initial.teamMembers = [fixture.member];
  initial.settlements = [fixture.settlement];
  writeRuntimeProjectionState(initial);

  const mirrored = await persistMatchDetailToBackend(matchId);
  assert.equal(mirrored, true, "backend mirror should be enabled");

  const [matchRows, teamRows, memberRows, settlementRows, targetRows] = await Promise.all([
    supabaseRest(`matches?select=id,status,solar_system_id&id=eq.${encodeURIComponent(matchId)}`),
    supabaseRest(`teams?select=id,match_id,status&match_id=eq.${encodeURIComponent(matchId)}`),
    supabaseRest(`team_members?select=id,team_id,wallet_address&team_id=eq.${encodeURIComponent(fixture.teamId)}`),
    supabaseRest(`settlements?select=match_id,status&match_id=eq.${encodeURIComponent(matchId)}`),
    supabaseRest(`match_targets?select=match_id,assembly_id&match_id=eq.${encodeURIComponent(matchId)}`)
  ]);

  assert.equal(matchRows.length, 1, "match row should be mirrored");
  assert.equal(teamRows.length, 1, "team row should be mirrored");
  assert.equal(memberRows.length, 1, "team member row should be mirrored");
  assert.equal(settlementRows.length, 1, "settlement row should be mirrored");
  assert.equal(targetRows.length, 1, "match target row should be mirrored");

  writeRuntimeProjectionState(createEmptyProjectionState());
  const hydrated = await hydrateRuntimeProjectionFromBackendIfNeeded({
    matchId,
    force: true
  });
  assert.equal(hydrated, true, "hydration should restore the mirrored match");

  const restored = readRuntimeProjectionState();
  assert.equal(restored.matches.length, 1, "restored projection should contain one match");
  assert.equal(restored.matches[0]?.id, matchId);
  assert.equal(restored.teams.length, 1, "restored projection should contain one team");
  assert.equal(restored.teams[0]?.id, fixture.teamId);
  assert.equal(restored.teamMembers.length, 1, "restored projection should contain one member");
  assert.equal(restored.teamMembers[0]?.id, fixture.memberId);
  assert.equal(restored.settlements.length, 1, "restored projection should contain one settlement");
  assert.equal(restored.settlements[0]?.matchId, matchId);

  console.log(
    JSON.stringify(
      {
        ok: true,
        matchId,
        teamId: fixture.teamId,
        memberId: fixture.memberId,
        mirrored: {
          matches: matchRows.length,
          teams: teamRows.length,
          teamMembers: memberRows.length,
          settlements: settlementRows.length,
          matchTargets: targetRows.length
        },
        hydrated: {
          matches: restored.matches.length,
          teams: restored.teams.length,
          teamMembers: restored.teamMembers.length,
          settlements: restored.settlements.length
        }
      },
      null,
      2
    )
  );
} finally {
  await deleteMatchDetailFromBackend(matchId).catch(() => false);
  rmSync(root, { recursive: true, force: true });
}
