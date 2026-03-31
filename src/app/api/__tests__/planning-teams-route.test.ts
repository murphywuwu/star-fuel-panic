import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { GET, POST } from "../planning-teams/route.ts";
import { POST as POST_APPROVE } from "../planning-teams/[id]/applications/[applicationId]/approve/route.ts";
import { POST as POST_REJECT } from "../planning-teams/[id]/applications/[applicationId]/reject/route.ts";
import { POST as POST_DISBAND } from "../planning-teams/[id]/disband/route.ts";
import { POST as POST_JOIN } from "../planning-teams/[id]/join/route.ts";
import { POST as POST_LEAVE } from "../planning-teams/[id]/leave/route.ts";
import { createEmptyProjectionState, writeRuntimeProjectionState } from "../../../server/runtimeProjectionStore.ts";
import { buildDevWalletSignature } from "../../../server/walletSignature.ts";

const originalFetch = global.fetch;
const originalProjectionStorePath = process.env.RUNTIME_PROJECTION_STORE_PATH;
const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

function installTempProjection() {
  const root = mkdtempSync(path.join(os.tmpdir(), "planning-team-route-"));
  process.env.RUNTIME_PROJECTION_STORE_PATH = path.join(root, "projection.json");
  writeRuntimeProjectionState(createEmptyProjectionState());
  return root;
}

function restoreProjectionPath() {
  if (originalProjectionStorePath) {
    process.env.RUNTIME_PROJECTION_STORE_PATH = originalProjectionStorePath;
    return;
  }

  delete process.env.RUNTIME_PROJECTION_STORE_PATH;
}

let tempRoot = "";

test.beforeEach(() => {
  tempRoot = installTempProjection();
});

test.afterEach(() => {
  rmSync(tempRoot, { recursive: true, force: true });
  global.fetch = originalFetch;
  restoreProjectionPath();
  process.env.SUPABASE_URL = originalSupabaseUrl;
  process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceRole;
});

test("planning teams route creates and lists standalone teams", async () => {
  const walletAddress = "0xCaptain010";
  const message = `FuelFrogPanic:create-planning-team:planning-registry\nwallet=${walletAddress.toLowerCase()}\nts=2026-03-28T12:00:00.000Z`;
  const signature = buildDevWalletSignature(walletAddress, message);

  const createdResponse = await POST(
    new Request("http://localhost/api/planning-teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-create-1"
      },
      body: JSON.stringify({
        name: "Frontier Wolves",
        maxMembers: 3,
        roleSlots: {
          collector: 1,
          hauler: 1,
          escort: 1
        },
        walletAddress,
        signature,
        message
      })
    })
  );

  assert.equal(createdResponse.status, 201);
  const createdJson = await createdResponse.json();
  assert.equal(createdJson.ok, true);
  assert.equal(createdJson.data.team.name, "Frontier Wolves");
  assert.equal(createdJson.data.totalTeams, 1);
  assert.equal(createdJson.data.team.members.length, 1);

  const listedResponse = await GET();
  assert.equal(listedResponse.status, 200);
  const listedJson = await listedResponse.json();
  assert.equal(listedJson.ok, true);
  assert.equal(listedJson.data.totalTeams, 1);
  assert.equal(listedJson.data.items[0]?.name, "Frontier Wolves");
  assert.equal(listedJson.data.items[0]?.members.length, 1);

  const joinWalletAddress = "0xJoin020";
  const joinMessage = `FuelFrogPanic:join-planning-team:${createdJson.data.team.id}\nwallet=${joinWalletAddress.toLowerCase()}\nts=2026-03-28T12:01:00.000Z`;
  const joinSignature = buildDevWalletSignature(joinWalletAddress, joinMessage);

  const joinedResponse = await POST_JOIN(
    new Request(`http://localhost/api/planning-teams/${createdJson.data.team.id}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-join-1"
      },
      body: JSON.stringify({
        role: "hauler",
        walletAddress: joinWalletAddress,
        signature: joinSignature,
        message: joinMessage
      })
    }),
    {
      params: Promise.resolve({
        id: createdJson.data.team.id
      })
    }
  );

  assert.equal(joinedResponse.status, 202);
  const joinedJson = await joinedResponse.json();
  assert.equal(joinedJson.ok, true);
  assert.equal(joinedJson.data.application.status, "pending");
  assert.equal(joinedJson.data.team.memberCount, 1);
  assert.equal(joinedJson.data.team.applications[0]?.applicantWalletAddress, "0xjoin020");
});

test("planning teams route rehydrates totalTeams from backend after local projection reset", async () => {
  process.env.SUPABASE_URL = "https://supabase.example.com";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

  const backend = {
    teams: [] as unknown[],
    members: [] as unknown[],
    applications: [] as unknown[]
  };

  global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";

    if (url.startsWith("https://supabase.example.com/rest/v1/planning_teams")) {
      if (method === "POST") {
        const rows = JSON.parse(String(init?.body ?? "[]")) as unknown[];
        backend.teams = rows;
        return {
          ok: true,
          status: 201,
          async json() {
            return [];
          },
          async text() {
            return "";
          }
        } as Response;
      }

      return {
        ok: true,
        status: 200,
        async json() {
          return backend.teams;
        },
        async text() {
          return JSON.stringify(backend.teams);
        }
      } as Response;
    }

    if (url.startsWith("https://supabase.example.com/rest/v1/planning_team_members")) {
      if (method === "DELETE") {
        backend.members = [];
        return {
          ok: true,
          status: 204,
          async json() {
            return [];
          },
          async text() {
            return "";
          }
        } as Response;
      }

      if (method === "POST") {
        backend.members = JSON.parse(String(init?.body ?? "[]")) as unknown[];
        return {
          ok: true,
          status: 201,
          async json() {
            return [];
          },
          async text() {
            return "";
          }
        } as Response;
      }

      return {
        ok: true,
        status: 200,
        async json() {
          return backend.members;
        },
        async text() {
          return JSON.stringify(backend.members);
        }
      } as Response;
    }

    if (url.startsWith("https://supabase.example.com/rest/v1/planning_team_applications")) {
      if (method === "DELETE") {
        backend.applications = [];
        return {
          ok: true,
          status: 204,
          async json() {
            return [];
          },
          async text() {
            return "";
          }
        } as Response;
      }

      if (method === "POST") {
        backend.applications = JSON.parse(String(init?.body ?? "[]")) as unknown[];
        return {
          ok: true,
          status: 201,
          async json() {
            return [];
          },
          async text() {
            return "";
          }
        } as Response;
      }

      return {
        ok: true,
        status: 200,
        async json() {
          return backend.applications;
        },
        async text() {
          return JSON.stringify(backend.applications);
        }
      } as Response;
    }

    throw new Error(`Unexpected fetch: ${method} ${url}`);
  }) as typeof fetch;

  const walletAddress = "0xCaptainHydrate";
  const message = `FuelFrogPanic:create-planning-team:planning-registry\nwallet=${walletAddress.toLowerCase()}\nts=2026-03-31T12:00:00.000Z`;
  const signature = buildDevWalletSignature(walletAddress, message);

  const createdResponse = await POST(
    new Request("http://localhost/api/planning-teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-create-hydrate"
      },
      body: JSON.stringify({
        name: "Hydrate Crew",
        maxMembers: 3,
        roleSlots: {
          collector: 1,
          hauler: 1,
          escort: 1
        },
        walletAddress,
        signature,
        message
      })
    })
  );

  assert.equal(createdResponse.status, 201);
  writeRuntimeProjectionState(createEmptyProjectionState());

  const listedResponse = await GET();
  assert.equal(listedResponse.status, 200);
  const listedJson = await listedResponse.json();
  assert.equal(listedJson.ok, true);
  assert.equal(listedJson.data.totalTeams, 1);
  assert.equal(listedJson.data.items[0]?.name, "Hydrate Crew");
});

test("planning teams route returns a clear error when backend tables are missing", async () => {
  process.env.SUPABASE_URL = "https://supabase.example.com";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

  global.fetch = (async () => ({
    ok: false,
    status: 404,
    async json() {
      return {
        code: "42P01",
        message: 'relation "public.planning_teams" does not exist'
      };
    },
    async text() {
      return '{"code":"42P01","message":"relation \\"public.planning_teams\\" does not exist"}';
    }
  })) as unknown as typeof fetch;

  const response = await GET();
  assert.equal(response.status, 503);

  const payload = await response.json();
  assert.equal(payload.ok, false);
  assert.match(String(payload.error?.message ?? ""), /planning team backend tables are missing/i);
});

test("planning teams route supports apply -> approve -> leave -> disband lifecycle", async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  const captainWallet = "0xCaptainLifecycle";
  const createMessage = `FuelFrogPanic:create-planning-team:planning-registry\nwallet=${captainWallet.toLowerCase()}\nts=2026-03-31T12:10:00.000Z`;
  const createSignature = buildDevWalletSignature(captainWallet, createMessage);

  const createdResponse = await POST(
    new Request("http://localhost/api/planning-teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-create-lifecycle"
      },
      body: JSON.stringify({
        name: "Lifecycle Crew",
        maxMembers: 3,
        roleSlots: {
          collector: 1,
          hauler: 1,
          escort: 1
        },
        walletAddress: captainWallet,
        signature: createSignature,
        message: createMessage
      })
    })
  );

  const createdJson = await createdResponse.json();
  const teamId = createdJson.data.team.id;

  const joinWallet = "0xJoinLifecycle";
  const joinMessage = `FuelFrogPanic:join-planning-team:${teamId}\nwallet=${joinWallet.toLowerCase()}\nts=2026-03-31T12:11:00.000Z`;
  const joinSignature = buildDevWalletSignature(joinWallet, joinMessage);

  const joinedResponse = await POST_JOIN(
    new Request(`http://localhost/api/planning-teams/${teamId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-join-lifecycle"
      },
      body: JSON.stringify({
        role: "hauler",
        walletAddress: joinWallet,
        signature: joinSignature,
        message: joinMessage
      })
    }),
    { params: Promise.resolve({ id: teamId }) }
  );

  assert.equal(joinedResponse.status, 202);
  const joinedJson = await joinedResponse.json();
  const applicationId = joinedJson.data.application.id;

  const approveMessage = `FuelFrogPanic:approve-planning-team-application:${teamId}:${applicationId}\nwallet=${captainWallet.toLowerCase()}\nts=2026-03-31T12:12:00.000Z`;
  const approveSignature = buildDevWalletSignature(captainWallet, approveMessage);

  const approvedResponse = await POST_APPROVE(
    new Request(`http://localhost/api/planning-teams/${teamId}/applications/${applicationId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-approve-lifecycle"
      },
      body: JSON.stringify({
        walletAddress: captainWallet,
        signature: approveSignature,
        message: approveMessage
      })
    }),
    { params: Promise.resolve({ id: teamId, applicationId }) }
  );

  assert.equal(approvedResponse.status, 200);
  const approvedJson = await approvedResponse.json();
  assert.equal(approvedJson.data.team.memberCount, 2);

  const rejectWallet = "0xJoinRejectLifecycle";
  const rejectJoinMessage = `FuelFrogPanic:join-planning-team:${teamId}\nwallet=${rejectWallet.toLowerCase()}\nts=2026-03-31T12:12:30.000Z`;
  const rejectJoinSignature = buildDevWalletSignature(rejectWallet, rejectJoinMessage);
  const rejectedJoinResponse = await POST_JOIN(
    new Request(`http://localhost/api/planning-teams/${teamId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-join-reject-lifecycle"
      },
      body: JSON.stringify({
        role: "escort",
        walletAddress: rejectWallet,
        signature: rejectJoinSignature,
        message: rejectJoinMessage
      })
    }),
    { params: Promise.resolve({ id: teamId }) }
  );
  const rejectedJoinJson = await rejectedJoinResponse.json();
  const rejectApplicationId = rejectedJoinJson.data.application.id;

  const rejectMessage = `FuelFrogPanic:reject-planning-team-application:${teamId}:${rejectApplicationId}\nwallet=${captainWallet.toLowerCase()}\nts=2026-03-31T12:12:40.000Z`;
  const rejectSignature = buildDevWalletSignature(captainWallet, rejectMessage);
  const rejectResponse = await POST_REJECT(
    new Request(`http://localhost/api/planning-teams/${teamId}/applications/${rejectApplicationId}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-reject-lifecycle"
      },
      body: JSON.stringify({
        walletAddress: captainWallet,
        signature: rejectSignature,
        message: rejectMessage
      })
    }),
    { params: Promise.resolve({ id: teamId, applicationId: rejectApplicationId }) }
  );

  assert.equal(rejectResponse.status, 200);

  const leaveMessage = `FuelFrogPanic:leave-planning-team:${teamId}\nwallet=${joinWallet.toLowerCase()}\nts=2026-03-31T12:13:00.000Z`;
  const leaveSignature = buildDevWalletSignature(joinWallet, leaveMessage);
  const leftResponse = await POST_LEAVE(
    new Request(`http://localhost/api/planning-teams/${teamId}/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-leave-lifecycle"
      },
      body: JSON.stringify({
        walletAddress: joinWallet,
        signature: leaveSignature,
        message: leaveMessage
      })
    }),
    { params: Promise.resolve({ id: teamId }) }
  );

  assert.equal(leftResponse.status, 200);

  const disbandMessage = `FuelFrogPanic:disband-planning-team:${teamId}\nwallet=${captainWallet.toLowerCase()}\nts=2026-03-31T12:14:00.000Z`;
  const disbandSignature = buildDevWalletSignature(captainWallet, disbandMessage);
  const disbandResponse = await POST_DISBAND(
    new Request(`http://localhost/api/planning-teams/${teamId}/disband`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": "planning-team-disband-lifecycle"
      },
      body: JSON.stringify({
        walletAddress: captainWallet,
        signature: disbandSignature,
        message: disbandMessage
      })
    }),
    { params: Promise.resolve({ id: teamId }) }
  );

  assert.equal(disbandResponse.status, 200);

  const listedResponse = await GET();
  const listedJson = await listedResponse.json();
  assert.equal(listedJson.data.totalTeams, 0);
});
