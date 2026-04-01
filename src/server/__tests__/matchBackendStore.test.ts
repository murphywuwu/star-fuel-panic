import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  hydrateRuntimeProjectionFromBackendIfNeeded,
  persistMatchDetailToBackend
} from "@/server/matchBackendStore.ts";
import {
  createEmptyProjectionState,
  readRuntimeProjectionState,
  writeRuntimeProjectionState,
  type PersistedTeam
} from "@/server/runtimeProjectionStore.ts";
import type { Match } from "@/types/match.ts";
import type { TeamMember } from "@/types/team.ts";

const originalFetch = global.fetch;
const originalProjectionPath = process.env.RUNTIME_PROJECTION_STORE_PATH;
const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createMatch(matchId: string): Match {
  return {
    id: matchId,
    onChainId: null,
    status: "draft",
    creationMode: "free",
    solarSystemId: 30000142,
    targetNodeIds: [],
    prizePool: 50,
    hostPrizePool: 50,
    entryFee: 100,
    minTeams: 2,
    maxTeams: 4,
    durationMinutes: 120,
    scoringMode: "weighted",
    challengeMode: "normal",
    triggerMode: "min_threshold",
    startedAt: null,
    endedAt: null,
    createdBy: "0xhost",
    hostAddress: "0xhost",
    sponsorshipFee: 50,
    publishedAt: null,
    publishIdempotencyKey: null,
    createdAt: "2026-03-28T00:00:00.000Z"
  };
}

function createTeam(matchId: string): PersistedTeam {
  return {
    id: "team-1",
    matchId,
    name: "ALPHA",
    captainAddress: "0xhost",
    maxSize: 3,
    isLocked: false,
    hasPaid: false,
    payTxDigest: null,
    totalScore: 0,
    rank: null,
    prizeAmount: null,
    status: "forming",
    createdAt: "2026-03-28T00:00:00.000Z",
    roleSlots: {
      collector: 1,
      hauler: 1,
      escort: 1
    },
    whitelistCount: 0
  };
}

function createMember(): TeamMember {
  return {
    id: "member-1",
    teamId: "team-1",
    walletAddress: "0xhost",
    role: "collector",
    slotStatus: "confirmed",
    personalScore: 0,
    prizeAmount: null,
    joinedAt: "2026-03-28T00:00:00.000Z"
  };
}

test.beforeEach(() => {
  const root = mkdtempSync(path.join(os.tmpdir(), "ffp-match-backend-"));
  process.env.RUNTIME_PROJECTION_STORE_PATH = path.join(root, "projection.json");
  process.env.SUPABASE_URL = "https://supabase.example.com";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
  writeRuntimeProjectionState(createEmptyProjectionState());
});

test.afterEach(() => {
  const projectionPath = process.env.RUNTIME_PROJECTION_STORE_PATH;
  if (projectionPath) {
    rmSync(path.dirname(projectionPath), { recursive: true, force: true });
  }
  global.fetch = originalFetch;
  process.env.RUNTIME_PROJECTION_STORE_PATH = originalProjectionPath;
  process.env.SUPABASE_URL = originalSupabaseUrl;
  process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceRole;
});

test("persistMatchDetailToBackend mirrors local match projection into backend table calls", async () => {
  const state = createEmptyProjectionState();
  const match = createMatch("match-1");
  state.matches = [match];
  state.teams = [createTeam(match.id)];
  state.teamMembers = [createMember()];
  writeRuntimeProjectionState(state);

  const calls: Array<{ url: string; method: string }> = [];
  global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({
      url: String(input),
      method: init?.method ?? "GET"
    });

    const prefer = typeof init?.headers === "object" && init?.headers
      ? ("Prefer" in init.headers
          ? init.headers.Prefer
          : "prefer" in init.headers
            ? init.headers.prefer
            : undefined)
      : undefined;
    const isMinimal = typeof prefer === "string" && prefer.includes("return=minimal");

    return {
      ok: true,
      status: init?.method === "DELETE" ? 204 : isMinimal ? 201 : 200,
      async json() {
        return [];
      },
      async text() {
        return isMinimal ? "" : "[]";
      }
    } as Response;
  }) as typeof fetch;

  const mirrored = await persistMatchDetailToBackend(match.id);
  assert.equal(mirrored, true);
  assert.deepEqual(
    calls.map((call) => [call.method, call.url.replace("https://supabase.example.com/rest/v1/", "")]),
    [
      ["POST", "matches?on_conflict=id"],
      ["DELETE", `match_targets?match_id=eq.${encodeURIComponent(match.id)}`],
      ["DELETE", "team_members?team_id=in.(team-1)"],
      ["DELETE", `teams?match_id=eq.${encodeURIComponent(match.id)}`],
      ["POST", "teams?on_conflict=id"],
      ["POST", "team_members?on_conflict=id"]
    ]
  );
});

test("hydrateRuntimeProjectionFromBackendIfNeeded restores backend match rows into local projection", async () => {
  const match = createMatch("match-2");
  const team = createTeam(match.id);
  const member = createMember();

  global.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    let payload: unknown = [];
    if (url.includes("/rest/v1/matches?")) {
      payload = [
        {
          id: match.id,
          status: "lobby",
          runtime_payload: {
            ...match,
            status: "lobby"
          }
        }
      ];
    } else if (url.includes("/rest/v1/teams?")) {
      payload = [
        {
          id: team.id,
          match_id: match.id,
          runtime_payload: team
        }
      ];
    } else if (url.includes("/rest/v1/team_members?")) {
      payload = [
        {
          id: member.id,
          team_id: team.id,
          runtime_payload: member
        }
      ];
    }

    return {
      ok: true,
      status: 200,
      async json() {
        return payload;
      },
      async text() {
        return JSON.stringify(payload);
      }
    } as Response;
  }) as typeof fetch;

  const hydrated = await hydrateRuntimeProjectionFromBackendIfNeeded({ force: true });
  assert.equal(hydrated, true);

  const state = readRuntimeProjectionState();
  assert.equal(state.matches.length, 1);
  assert.equal(state.matches[0]?.id, match.id);
  assert.equal(state.matches[0]?.status, "lobby");
  assert.equal(state.teams.length, 1);
  assert.equal(state.teamMembers.length, 1);
});

test("hydrateRuntimeProjectionFromBackendIfNeeded merges backend matches even when local projection already has history", async () => {
  const localHistory = createMatch("match-local-history");
  localHistory.status = "settled";

  const backendMatch = createMatch("match-live-lobby");
  backendMatch.status = "lobby";
  backendMatch.solarSystemId = 30000145;

  const state = createEmptyProjectionState();
  state.matches = [localHistory];
  writeRuntimeProjectionState(state);

  const calls: string[] = [];
  global.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push(url);

    let payload: unknown = [];
    if (url.includes("/rest/v1/matches?")) {
      payload = [
        {
          id: backendMatch.id,
          status: "lobby",
          runtime_payload: backendMatch
        }
      ];
    }

    return {
      ok: true,
      status: 200,
      async json() {
        return payload;
      },
      async text() {
        return JSON.stringify(payload);
      }
    } as Response;
  }) as typeof fetch;

  const hydrated = await hydrateRuntimeProjectionFromBackendIfNeeded();
  assert.equal(hydrated, true);
  assert.ok(calls.some((url) => url.includes("/rest/v1/matches?select=*")));

  const next = readRuntimeProjectionState();
  assert.equal(next.matches.length, 2);
  assert.deepEqual(
    next.matches.map((match) => match.id).sort(),
    [backendMatch.id, localHistory.id].sort()
  );
  assert.equal(next.matches.find((match) => match.id === backendMatch.id)?.status, "lobby");
  assert.equal(next.matches.find((match) => match.id === localHistory.id)?.status, "settled");
});
