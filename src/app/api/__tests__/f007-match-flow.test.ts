import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { POST as createDraftRoute, GET as listMatchesRoute } from "../matches/route.ts";
import { POST as publishMatchRoute } from "../matches/[id]/publish/route.ts";
import { GET as getMatchStatusRoute } from "../matches/[id]/status/route.ts";
import { GET as getMatchScoreboardRoute } from "../matches/[id]/scoreboard/route.ts";
import { GET as getMatchStreamRoute } from "../matches/[id]/stream/route.ts";
import { GET as getMatchResultRoute } from "../matches/[id]/result/route.ts";
import { GET as getMatchSettlementRoute } from "../matches/[id]/settlement/route.ts";
import { POST as createTeamRoute } from "../matches/[id]/teams/route.ts";
import { POST as joinTeamRoute } from "../teams/[id]/join/route.ts";
import { POST as approveApplicationRoute } from "../teams/[id]/applications/[applicationId]/approve/route.ts";
import { POST as rejectApplicationRoute } from "../teams/[id]/applications/[applicationId]/reject/route.ts";
import { POST as lockTeamRoute } from "../teams/[id]/lock/route.ts";
import { POST as payTeamRoute } from "../teams/[id]/pay/route.ts";
import {
  __setMatchDetailForTests,
  createTestMatchSignature,
  getMatchDetail,
  resetMatchRuntime
} from "../../../server/matchRuntime.ts";
import {
  createTestTeamSignature,
  getMatchTeamsSnapshot,
  resetTeamRuntime
} from "../../../server/teamRuntime.ts";
import {
  createEmptyProjectionState,
  writeRuntimeProjectionState
} from "../../../server/runtimeProjectionStore.ts";

const originalFetch = global.fetch;
const originalNodeIndexStorePath = process.env.NODE_INDEX_STORE_PATH;
const originalProjectionStorePath = process.env.RUNTIME_PROJECTION_STORE_PATH;

function createResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async text() {
      return JSON.stringify(body);
    },
    async json() {
      return body;
    }
  } as Response;
}

function installWorldApiSuccessStub() {
  global.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/v2/solarsystems?")) {
      return createResponse({
        data: [
          {
            id: 30000142,
            name: "Jita",
            constellationId: 20000020,
            regionId: 10000002,
            location: { x: 4, y: 5, z: 6 }
          }
        ],
        metadata: {
          limit: 50,
          offset: 0,
          total: 1
        }
      });
    }

    throw new Error(`Unexpected fetch url: ${url}`);
  }) as typeof fetch;
}

function writeNodeIndexSnapshot(filePath: string) {
  const now = "2026-03-26T12:00:00.000Z";
  writeFileSync(
    filePath,
    JSON.stringify(
      {
        version: 1,
        lastSyncAt: now,
        cursor: null,
        nodes: [
          {
            id: "node-jita-critical",
            objectId: "node-jita-critical",
            name: "Jita Critical Gate",
            typeId: 101,
            ownerAddress: "shared",
            ownerCapId: null,
            isPublic: true,
            coordX: 1,
            coordY: 2,
            coordZ: 3,
            solarSystem: 30000142,
            fuelQuantity: 10,
            fuelMaxCapacity: 100,
            fuelTypeId: 1,
            fuelBurnRate: 1,
            isBurning: true,
            fillRatio: 0.1,
            urgency: "critical",
            maxEnergyProduction: 100,
            currentEnergyProduction: 60,
            isOnline: true,
            connectedAssemblyIds: [],
            description: "Critical node in Jita",
            imageUrl: null,
            lastUpdatedOnChain: now,
            updatedAt: now
          },
          {
            id: "node-jita-warning",
            objectId: "node-jita-warning",
            name: "Jita Warning Relay",
            typeId: 102,
            ownerAddress: "shared",
            ownerCapId: null,
            isPublic: true,
            coordX: 4,
            coordY: 5,
            coordZ: 6,
            solarSystem: 30000142,
            fuelQuantity: 35,
            fuelMaxCapacity: 100,
            fuelTypeId: 1,
            fuelBurnRate: 1,
            isBurning: false,
            fillRatio: 0.35,
            urgency: "warning",
            maxEnergyProduction: 100,
            currentEnergyProduction: 50,
            isOnline: true,
            connectedAssemblyIds: [],
            description: "Warning node in Jita",
            imageUrl: null,
            lastUpdatedOnChain: now,
            updatedAt: now
          }
        ]
      },
      null,
      2
    ),
    "utf8"
  );
}

function buildTempPaths() {
  const root = mkdtempSync(path.join(os.tmpdir(), "f007-match-"));
  return {
    root,
    nodeIndexPath: path.join(root, "node-index.json"),
    projectionPath: path.join(root, "projection.json")
  };
}

function buildMatchMessage(scope: string, targetId: string, walletAddress: string) {
  return `${scope}:${targetId}\nwallet=${walletAddress}\nts=2026-03-26T12:00:00.000Z`;
}

function buildTeamMessage(scope: string, walletAddress: string) {
  return `${scope}\nwallet=${walletAddress}\nts=2026-03-26T12:00:00.000Z`;
}

function buildScopedTeamMessage(scope: string, targetId: string, walletAddress: string) {
  return `${scope}:${targetId}\nwallet=${walletAddress}\nts=2026-03-26T12:00:00.000Z`;
}

async function createDraft(hostWallet = "0xhost001") {
  const message = buildMatchMessage("FuelFrogPanic:create-match-draft", "hosted", hostWallet);
  const signature = createTestMatchSignature(hostWallet, message);
  const response = await createDraftRoute(
    new Request("http://localhost/api/matches", {
      method: "POST",
      headers: {
        "X-Idempotency-Key": `create-draft-${hostWallet}`
      },
      body: JSON.stringify({
        name: "Jita Emergency Recovery",
        mode: "precision",
        solarSystemId: 30000142,
        targetNodeIds: ["node-jita-critical", "node-jita-warning"],
        sponsorshipFee: 600,
        entryFee: 120,
        maxTeams: 4,
        durationHours: 2,
        walletAddress: hostWallet,
        signature,
        message
      })
    })
  );
  assert.equal(response.status, 201);
  const json = await response.json();
  return {
    hostWallet,
    match: json.match
  };
}

async function publishMatch(matchId: string, hostWallet: string, idempotencyKey = "publish-key-1", txDigest = "tx_publish_001") {
  const message = buildMatchMessage("FuelFrogPanic:publish-match", matchId, hostWallet);
  const signature = createTestMatchSignature(hostWallet, message);
  return publishMatchRoute(
    new Request(`http://localhost/api/matches/${matchId}/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey
      },
      body: JSON.stringify({
        publishTxDigest: txDigest,
        walletAddress: hostWallet,
        signature,
        message
      })
    }),
    { params: Promise.resolve({ id: matchId }) }
  );
}

function toSettledDetail(matchId: string) {
  const detail = getMatchDetail(matchId);
  const snapshot = getMatchTeamsSnapshot(matchId);
  assert.ok(detail);
  assert.ok(snapshot);

  const scoreTemplate = [150, 90, 60];
  const members = snapshot!.items.flatMap((team) => team.members).map((member, index) => ({
    ...member,
    personalScore: scoreTemplate[index] ?? 30,
    prizeAmount: null
  }));
  const teamScore = members.reduce((sum, member) => sum + member.personalScore, 0);
  const teams = snapshot!.items.map(
    ({ applications: _applications, memberCount: _memberCount, members: _members, paymentAmount: _paymentAmount, paymentTxDigest: _paymentTxDigest, roleSlots: _roleSlots, whitelistCount: _whitelistCount, ...team }) => ({
      ...team,
      totalScore: teamScore,
      rank: 1,
      prizeAmount: null,
      status: "paid" as const
    })
  );

  return {
    match: {
      ...detail!.match,
      status: "settled" as const,
      startedAt: "2026-03-26T12:00:00.000Z",
      endedAt: "2026-03-26T12:20:00.000Z",
      prizePool: 960,
      hostPrizePool: 600
    },
    teams,
    members,
    scores: members.map((member) => ({
      matchId,
      teamId: member.teamId,
      walletAddress: member.walletAddress,
      totalScore: member.personalScore,
      fuelDeposited: Math.max(1, Math.floor(member.personalScore / 10)),
      updatedAt: "2026-03-26T12:10:00.000Z"
    }))
  };
}

test.beforeEach(() => {
  const paths = buildTempPaths();
  process.env.NODE_INDEX_STORE_PATH = paths.nodeIndexPath;
  process.env.RUNTIME_PROJECTION_STORE_PATH = paths.projectionPath;
  writeNodeIndexSnapshot(paths.nodeIndexPath);
  writeRuntimeProjectionState(createEmptyProjectionState());
  installWorldApiSuccessStub();
  resetMatchRuntime();
  resetTeamRuntime();
  (globalThis as typeof globalThis & { __f007MatchTmpRoot?: string }).__f007MatchTmpRoot = paths.root;
});

test.afterEach(() => {
  const root = (globalThis as typeof globalThis & { __f007MatchTmpRoot?: string }).__f007MatchTmpRoot;
  if (root) {
    rmSync(root, { recursive: true, force: true });
  }
  delete (globalThis as typeof globalThis & { __f007MatchTmpRoot?: string }).__f007MatchTmpRoot;
  global.fetch = originalFetch;
  process.env.NODE_INDEX_STORE_PATH = originalNodeIndexStorePath;
  process.env.RUNTIME_PROJECTION_STORE_PATH = originalProjectionStorePath;
  resetMatchRuntime();
  resetTeamRuntime();
});

test("F-007 T-0702/T-0705 publish is idempotent for the same key and rejects duplicate publish with a different key", async () => {
  const { match, hostWallet } = await createDraft();

  const firstPublishResponse = await publishMatch(match.id, hostWallet, "publish-key-1", "tx_publish_001");
  assert.equal(firstPublishResponse.status, 200);
  const firstPublishJson = await firstPublishResponse.json();
  assert.equal(firstPublishJson.match.status, "lobby");

  const replayPublishResponse = await publishMatch(match.id, hostWallet, "publish-key-1", "tx_publish_001");
  assert.equal(replayPublishResponse.status, 200);
  const replayPublishJson = await replayPublishResponse.json();
  assert.equal(replayPublishJson.match.id, match.id);
  assert.equal(replayPublishJson.match.publishIdempotencyKey, "publish-key-1");

  const duplicatePublishResponse = await publishMatch(match.id, hostWallet, "publish-key-2", "tx_publish_002");
  assert.equal(duplicatePublishResponse.status, 409);
  const duplicatePublishJson = await duplicatePublishResponse.json();
  assert.equal(duplicatePublishJson.error.code, "MATCH_NOT_PUBLISHABLE");
});

test("F-007 T-0703/T-0705 route-level E2E covers draft, publish, apply, approve/reject, pay, stream, settlement, and signature failures", async () => {
  const { match, hostWallet } = await createDraft();

  const listBeforePublishResponse = await listMatchesRoute(new Request("http://localhost/api/matches"));
  const listBeforePublishJson = await listBeforePublishResponse.json();
  assert.equal(listBeforePublishJson.matches.some((item: { id: string }) => item.id === match.id), false);

  const publishResponse = await publishMatch(match.id, hostWallet, "publish-key-main", "tx_publish_main");
  assert.equal(publishResponse.status, 200);

  const listAfterPublishResponse = await listMatchesRoute(new Request("http://localhost/api/matches"));
  const listAfterPublishJson = await listAfterPublishResponse.json();
  assert.equal(listAfterPublishJson.matches.some((item: { id: string }) => item.id === match.id), true);

  const captainWallet = "0xcaptain001";
  const createTeamMessage = buildScopedTeamMessage("FuelFrogPanic:create-team", match.id, captainWallet);
  const createTeamResponse = await createTeamRoute(
    new Request(`http://localhost/api/matches/${match.id}/teams`, {
      method: "POST",
      headers: {
        "X-Idempotency-Key": "create-team-1"
      },
      body: JSON.stringify({
        teamName: "Frontier Crew",
        maxSize: 3,
        roleSlots: ["collector", "hauler", "escort"],
        walletAddress: captainWallet,
        signature: createTestTeamSignature(captainWallet, createTeamMessage),
        message: createTeamMessage
      })
    }),
    { params: Promise.resolve({ id: match.id }) }
  );
  assert.equal(createTeamResponse.status, 200);
  const createTeamJson = await createTeamResponse.json();
  const teamId = createTeamJson.team.id as string;

  const haulerWallet = "0xhauler001";
  const haulerJoinMessage = buildScopedTeamMessage("FuelFrogPanic:join-team", teamId, haulerWallet);
  const haulerJoinResponse = await joinTeamRoute(
    new Request(`http://localhost/api/teams/${teamId}/join`, {
      method: "POST",
      headers: {
        "X-Idempotency-Key": "join-hauler-1"
      },
      body: JSON.stringify({
        role: "hauler",
        walletAddress: haulerWallet,
        signature: createTestTeamSignature(haulerWallet, haulerJoinMessage),
        message: haulerJoinMessage
      })
    }),
    { params: Promise.resolve({ id: teamId }) }
  );
  assert.equal(haulerJoinResponse.status, 200);
  const haulerJoinJson = (await haulerJoinResponse.json()) as { applicationId: string; status: string };

  const rejectedEscortWallet = "0xescort-reject";
  const rejectedEscortMessage = buildScopedTeamMessage("FuelFrogPanic:join-team", teamId, rejectedEscortWallet);
  const rejectedEscortJoinResponse = await joinTeamRoute(
    new Request(`http://localhost/api/teams/${teamId}/join`, {
      method: "POST",
      headers: {
        "X-Idempotency-Key": "join-escort-reject-1"
      },
      body: JSON.stringify({
        role: "escort",
        walletAddress: rejectedEscortWallet,
        signature: createTestTeamSignature(rejectedEscortWallet, rejectedEscortMessage),
        message: rejectedEscortMessage
      })
    }),
    { params: Promise.resolve({ id: teamId }) }
  );
  assert.equal(rejectedEscortJoinResponse.status, 200);
  const rejectedEscortJoinJson = (await rejectedEscortJoinResponse.json()) as { applicationId: string; status: string };

  const captainApproveMessage = buildScopedTeamMessage(
    "FuelFrogPanic:approve-team-application",
    `${teamId}:${haulerJoinJson.applicationId}`,
    captainWallet
  );
  const approveResponse = await approveApplicationRoute(
    new Request(`http://localhost/api/teams/${teamId}/applications/${haulerJoinJson.applicationId}/approve`, {
      method: "POST",
      headers: {
        "X-Idempotency-Key": "approve-hauler-1"
      },
      body: JSON.stringify({
        walletAddress: captainWallet,
        signature: createTestTeamSignature(captainWallet, captainApproveMessage),
        message: captainApproveMessage
      })
    }),
    { params: Promise.resolve({ id: teamId, applicationId: haulerJoinJson.applicationId }) }
  );
  assert.equal(approveResponse.status, 200);

  const captainRejectMessage = buildScopedTeamMessage(
    "FuelFrogPanic:reject-team-application",
    `${teamId}:${rejectedEscortJoinJson.applicationId}`,
    captainWallet
  );
  const rejectResponse = await rejectApplicationRoute(
    new Request(`http://localhost/api/teams/${teamId}/applications/${rejectedEscortJoinJson.applicationId}/reject`, {
      method: "POST",
      headers: {
        "X-Idempotency-Key": "reject-escort-1"
      },
      body: JSON.stringify({
        reason: "escort slot reserved",
        walletAddress: captainWallet,
        signature: createTestTeamSignature(captainWallet, captainRejectMessage),
        message: captainRejectMessage
      })
    }),
    { params: Promise.resolve({ id: teamId, applicationId: rejectedEscortJoinJson.applicationId }) }
  );
  assert.equal(rejectResponse.status, 200);
  const rejectJson = await rejectResponse.json();
  assert.equal(rejectJson.application.status, "rejected");

  const approvedEscortWallet = "0xescort-approve";
  const approvedEscortMessage = buildScopedTeamMessage("FuelFrogPanic:join-team", teamId, approvedEscortWallet);
  const approvedEscortJoinResponse = await joinTeamRoute(
    new Request(`http://localhost/api/teams/${teamId}/join`, {
      method: "POST",
      headers: {
        "X-Idempotency-Key": "join-escort-approve-1"
      },
      body: JSON.stringify({
        role: "escort",
        walletAddress: approvedEscortWallet,
        signature: createTestTeamSignature(approvedEscortWallet, approvedEscortMessage),
        message: approvedEscortMessage
      })
    }),
    { params: Promise.resolve({ id: teamId }) }
  );
  assert.equal(approvedEscortJoinResponse.status, 200);
  const approvedEscortJoinJson = (await approvedEscortJoinResponse.json()) as { applicationId: string; status: string };

  const approveEscortMessage = buildScopedTeamMessage(
    "FuelFrogPanic:approve-team-application",
    `${teamId}:${approvedEscortJoinJson.applicationId}`,
    captainWallet
  );
  const approveEscortResponse = await approveApplicationRoute(
    new Request(`http://localhost/api/teams/${teamId}/applications/${approvedEscortJoinJson.applicationId}/approve`, {
      method: "POST",
      headers: {
        "X-Idempotency-Key": "approve-escort-1"
      },
      body: JSON.stringify({
        walletAddress: captainWallet,
        signature: createTestTeamSignature(captainWallet, approveEscortMessage),
        message: approveEscortMessage
      })
    }),
    { params: Promise.resolve({ id: teamId, applicationId: approvedEscortJoinJson.applicationId }) }
  );
  assert.equal(approveEscortResponse.status, 200);

  const lockTeamMessage = buildScopedTeamMessage("FuelFrogPanic:lock-team", teamId, captainWallet);
  const lockTeamResponse = await lockTeamRoute(
    new Request(`http://localhost/api/teams/${teamId}/lock`, {
      method: "POST",
      headers: {
        "X-Idempotency-Key": "lock-team-1"
      },
      body: JSON.stringify({
        walletAddress: captainWallet,
        signature: createTestTeamSignature(captainWallet, lockTeamMessage),
        message: lockTeamMessage
      })
    }),
    { params: Promise.resolve({ id: teamId }) }
  );
  assert.equal(lockTeamResponse.status, 200);

  const invalidPayResponse = await payTeamRoute(
    new Request(`http://localhost/api/teams/${teamId}/pay`, {
      method: "POST",
      headers: {
        "X-Idempotency-Key": "pay-team-invalid-1"
      },
      body: JSON.stringify({
        txDigest: "tx_pay_invalid",
        walletAddress: captainWallet,
        signature: "dev:invalid",
        message: buildScopedTeamMessage("FuelFrogPanic:pay-team", teamId, captainWallet)
      })
    }),
    { params: Promise.resolve({ id: teamId }) }
  );
  assert.equal(invalidPayResponse.status, 401);
  const invalidPayJson = await invalidPayResponse.json();
  assert.equal(invalidPayJson.error.code, "UNAUTHORIZED");

  const payTeamMessage = buildScopedTeamMessage("FuelFrogPanic:pay-team", teamId, captainWallet);
  const payTeamResponse = await payTeamRoute(
    new Request(`http://localhost/api/teams/${teamId}/pay`, {
      method: "POST",
      headers: {
        "X-Idempotency-Key": "pay-team-valid-1"
      },
      body: JSON.stringify({
        txDigest: "tx_pay_valid",
        walletAddress: captainWallet,
        signature: createTestTeamSignature(captainWallet, payTeamMessage),
        message: payTeamMessage
      })
    }),
    { params: Promise.resolve({ id: teamId }) }
  );
  assert.equal(payTeamResponse.status, 200);
  const payTeamJson = await payTeamResponse.json();
  assert.equal(payTeamJson.whitelistCount, 3);

  const settlementPendingResponse = await getMatchSettlementRoute(new Request(`http://localhost/api/matches/${match.id}/settlement`), {
    params: Promise.resolve({ id: match.id })
  });
  assert.equal(settlementPendingResponse.status, 200);
  const settlementPendingJson = await settlementPendingResponse.json();
  assert.equal(settlementPendingJson.status, "pending");

  __setMatchDetailForTests(toSettledDetail(match.id));

  const statusResponse = await getMatchStatusRoute(new Request(`http://localhost/api/matches/${match.id}/status`), {
    params: Promise.resolve({ id: match.id })
  });
  assert.equal(statusResponse.status, 200);
  const statusJson = await statusResponse.json();
  assert.equal(statusJson.status, "settled");

  const scoreboardResponse = await getMatchScoreboardRoute(
    new Request(`http://localhost/api/matches/${match.id}/scoreboard`),
    { params: Promise.resolve({ id: match.id }) }
  );
  assert.equal(scoreboardResponse.status, 200);
  const scoreboardJson = await scoreboardResponse.json();
  assert.equal(scoreboardJson.ok, true);
  assert.equal(scoreboardJson.data.teams[0].score, 300);

  const streamResponse = await getMatchStreamRoute(new Request(`http://localhost/api/matches/${match.id}/stream`), {
    params: Promise.resolve({ id: match.id })
  });
  assert.equal(streamResponse.status, 200);
  const reader = streamResponse.body?.getReader();
  assert.ok(reader);
  const chunk = await reader!.read();
  await reader!.cancel();
  const chunkText = new TextDecoder().decode(chunk.value);
  assert.match(chunkText, /event: score_update/);

  const settlementSucceededResponse = await getMatchSettlementRoute(
    new Request(`http://localhost/api/matches/${match.id}/settlement`),
    { params: Promise.resolve({ id: match.id }) }
  );
  assert.equal(settlementSucceededResponse.status, 200);
  const settlementSucceededJson = await settlementSucceededResponse.json();
  assert.equal(settlementSucceededJson.status, "succeeded");

  const firstResultResponse = await getMatchResultRoute(new Request(`http://localhost/api/matches/${match.id}/result`), {
    params: Promise.resolve({ id: match.id })
  });
  const secondResultResponse = await getMatchResultRoute(new Request(`http://localhost/api/matches/${match.id}/result`), {
    params: Promise.resolve({ id: match.id })
  });
  assert.equal(firstResultResponse.status, 200);
  assert.equal(secondResultResponse.status, 200);
  const firstResultJson = await firstResultResponse.json();
  const secondResultJson = await secondResultResponse.json();
  assert.equal(firstResultJson.bill.resultHash, secondResultJson.bill.resultHash);
  assert.equal(firstResultJson.bill.teamBreakdown.length, 1);
  assert.equal(firstResultJson.bill.teamBreakdown[0].members.length, 3);
});
