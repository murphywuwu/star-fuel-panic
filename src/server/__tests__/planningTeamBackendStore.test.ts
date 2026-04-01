import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  hydratePlanningTeamsFromBackendIfNeeded,
  persistPlanningTeamToBackend
} from "@/server/matchBackendStore.ts";
import {
  createEmptyProjectionState,
  readRuntimeProjectionState,
  writeRuntimeProjectionState
} from "@/server/runtimeProjectionStore.ts";
import type { PlanningTeam } from "@/types/planningTeam.ts";

const originalFetch = global.fetch;
const originalProjectionPath = process.env.RUNTIME_PROJECTION_STORE_PATH;
const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createPlanningTeam(): PlanningTeam {
  return {
    id: "planning-team-1",
    name: "Frontier Wolves",
    captainAddress: "0xcaptain001",
    maxMembers: 3,
    memberCount: 2,
    roleSlots: {
      collector: 1,
      hauler: 1,
      escort: 1
    },
    members: [
      {
        walletAddress: "0xcaptain001",
        role: "collector",
        joinedAt: "2026-03-31T12:00:00.000Z"
      },
      {
        walletAddress: "0xjoin001",
        role: "hauler",
        joinedAt: "2026-03-31T12:01:00.000Z"
      }
    ],
    applications: [],
    createdAt: "2026-03-31T12:00:00.000Z"
  };
}

test.beforeEach(() => {
  const root = mkdtempSync(path.join(os.tmpdir(), "ffp-planning-backend-"));
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

test("persistPlanningTeamToBackend mirrors local planning team projection into backend calls", async () => {
  const state = createEmptyProjectionState();
  const team = createPlanningTeam();
  state.planningTeams = [team];
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

  const mirrored = await persistPlanningTeamToBackend(team.id);
  assert.equal(mirrored, true);
  assert.deepEqual(
    calls.map((call) => [call.method, call.url.replace("https://supabase.example.com/rest/v1/", "")]),
    [
      ["POST", "planning_teams?on_conflict=id"],
      ["DELETE", `planning_team_members?team_id=eq.${encodeURIComponent(team.id)}`],
      ["POST", "planning_team_members"],
      ["DELETE", `planning_team_applications?team_id=eq.${encodeURIComponent(team.id)}`]
    ]
  );
});

test("hydratePlanningTeamsFromBackendIfNeeded restores backend planning teams into local projection", async () => {
  const team = createPlanningTeam();

  global.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    let payload: unknown = [];
    if (url.includes("/rest/v1/planning_teams?")) {
      payload = [
        {
          id: team.id,
          captain_wallet: team.captainAddress,
          team_name: team.name,
          max_members: team.maxMembers,
          member_count: team.memberCount,
          role_slots: team.roleSlots,
          runtime_payload: team
        }
      ];
    } else if (url.includes("/rest/v1/planning_team_members?")) {
      payload = team.members.map((member) => ({
        team_id: team.id,
        wallet_address: member.walletAddress,
        runtime_payload: member
      }));
    } else if (url.includes("/rest/v1/planning_team_applications?")) {
      payload = [];
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

  const hydrated = await hydratePlanningTeamsFromBackendIfNeeded({ force: true });
  assert.equal(hydrated, true);

  const state = readRuntimeProjectionState();
  assert.equal(state.planningTeams.length, 1);
  assert.equal(state.planningTeams[0]?.id, team.id);
  assert.equal(state.planningTeams[0]?.memberCount, 2);
});
