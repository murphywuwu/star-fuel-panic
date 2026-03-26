import assert from "node:assert/strict";
import test from "node:test";
import {
  createBountyPostHandler,
  createTestBountySignature,
  isValidBountyTxDigest
} from "./matchBountyRoute.ts";

function buildMessage(matchId: string, walletAddress: string) {
  return `FuelFrogPanic:bounty:${matchId}\nwallet=${walletAddress}\nts=2026-03-23T00:00:00.000Z`;
}

test("accepts bounty requests and returns updated prize pool", async () => {
  const matchId = "mission-ssu-7";
  const walletAddress = "0xabc123";
  const message = buildMessage(matchId, walletAddress);
  const signature = createTestBountySignature(walletAddress, message);

  const handler = createBountyPostHandler({
    applyBounty: (input) => ({
      ok: true,
      updatedPrizePool: 1350,
      match: {
        id: input.matchId,
        prizePool: 1350,
        status: "lobby"
      },
      contribution: {
        walletAddress: input.walletAddress,
        bountyAmount: input.bountyAmount,
        txDigest: input.txDigest,
        createdAt: "2026-03-23T00:00:00.000Z"
      }
    })
  });

  const response = await handler(
    new Request("http://localhost/api/matches/mission-ssu-7/bounty", {
      method: "POST",
      body: JSON.stringify({
        walletAddress,
        signature,
        message,
        txDigest: "tx_bounty_001",
        bountyAmount: 150
      })
    }),
    { params: Promise.resolve({ id: matchId }) }
  );

  assert.equal(response.status, 200);
  const json = await response.json();
  assert.equal(json.ok, true);
  assert.equal(json.updatedPrizePool, 1350);
  assert.equal(json.match.id, matchId);
});

test("rejects invalid wallet signatures", async () => {
  const matchId = "mission-ssu-7";
  const walletAddress = "0xabc123";
  const message = buildMessage(matchId, walletAddress);

  const handler = createBountyPostHandler({
    applyBounty: () => {
      throw new Error("should not be called");
    }
  });

  const response = await handler(
    new Request("http://localhost/api/matches/mission-ssu-7/bounty", {
      method: "POST",
      body: JSON.stringify({
        walletAddress,
        signature: "test_sig:invalid",
        message,
        txDigest: "tx_bounty_001",
        bountyAmount: 150
      })
    }),
    { params: Promise.resolve({ id: matchId }) }
  );

  assert.equal(response.status, 401);
  const json = await response.json();
  assert.equal(json.error.code, "UNAUTHORIZED");
});

test("rejects malformed tx digests before hitting runtime", async () => {
  assert.equal(isValidBountyTxDigest("tx_bounty_001"), true);
  assert.equal(isValidBountyTxDigest("0x1234"), false);

  const matchId = "mission-ssu-7";
  const walletAddress = "0xabc123";
  const message = buildMessage(matchId, walletAddress);
  const signature = createTestBountySignature(walletAddress, message);

  const handler = createBountyPostHandler({
    applyBounty: () => {
      throw new Error("should not be called");
    }
  });

  const response = await handler(
    new Request("http://localhost/api/matches/mission-ssu-7/bounty", {
      method: "POST",
      body: JSON.stringify({
        walletAddress,
        signature,
        message,
        txDigest: "bad-digest",
        bountyAmount: 150
      })
    }),
    { params: Promise.resolve({ id: matchId }) }
  );

  assert.equal(response.status, 400);
  const json = await response.json();
  assert.equal(json.error.code, "TX_REJECTED");
});

test("maps ended matches to 409 conflicts", async () => {
  const matchId = "mission-ssu-7";
  const walletAddress = "0xabc123";
  const message = buildMessage(matchId, walletAddress);
  const signature = createTestBountySignature(walletAddress, message);

  const handler = createBountyPostHandler({
    applyBounty: () => ({
      ok: false,
      code: "MATCH_ALREADY_ENDED",
      status: 409,
      message: "Match already ended"
    })
  });

  const response = await handler(
    new Request("http://localhost/api/matches/mission-ssu-7/bounty", {
      method: "POST",
      body: JSON.stringify({
        walletAddress,
        signature,
        message,
        txDigest: "tx_bounty_001",
        bountyAmount: 150
      })
    }),
    { params: Promise.resolve({ id: matchId }) }
  );

  assert.equal(response.status, 409);
  const json = await response.json();
  assert.equal(json.error.code, "MATCH_ALREADY_ENDED");
});
