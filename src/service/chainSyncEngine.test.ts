import assert from "node:assert/strict";
import test from "node:test";
import {
  createChainSyncTables,
  listScoreEventsForMatch,
  processFuelEvent,
  type ChainSyncContext
} from "./chainSyncEngine.ts";
import type { ChainFuelEvent } from "../types/fuelMission.ts";

function buildContext(): ChainSyncContext {
  return {
    matchId: "match-001",
    whitelist: new Set(["pilot-alpha"]),
    targetAssemblies: new Set(["n1"]),
    window: {
      startTs: 1_000,
      endTs: 2_000,
      panicTs: 1_900
    },
    memberTeamMap: new Map([["pilot-alpha", "team-alpha"]])
  };
}

function buildEvent(overrides?: Partial<ChainFuelEvent>): ChainFuelEvent {
  return {
    eventId: "evt-001",
    matchId: "match-001",
    senderWallet: "pilot-alpha",
    playerName: "Pilot Alpha",
    txDigest: "tx-001",
    assemblyId: "n1",
    oldQuantity: 100,
    newQuantity: 200,
    maxCapacity: 1_000,
    chainTs: 1_500,
    ...overrides
  };
}

test("rejects non-whitelisted events", () => {
  const tables = createChainSyncTables();
  const result = processFuelEvent(
    tables,
    buildContext(),
    buildEvent({ senderWallet: "pilot-outsider", txDigest: "tx-outsider" })
  );

  assert.equal(result.accepted, false);
  if (!result.accepted) {
    assert.equal(result.audit.reason, "NOT_IN_MATCH_WHITELIST");
  }
  assert.equal(listScoreEventsForMatch(tables, "match-001").length, 0);
});

test("rejects out-of-window events", () => {
  const tables = createChainSyncTables();
  const result = processFuelEvent(
    tables,
    buildContext(),
    buildEvent({ txDigest: "tx-early", chainTs: 999 })
  );

  assert.equal(result.accepted, false);
  if (!result.accepted) {
    assert.equal(result.audit.reason, "EVENT_OUTSIDE_MATCH_WINDOW");
  }
  assert.equal(listScoreEventsForMatch(tables, "match-001").length, 0);
});

test("prevents duplicate tx_digest scoring", () => {
  const tables = createChainSyncTables();
  const context = buildContext();

  const first = processFuelEvent(tables, context, buildEvent({ txDigest: "tx-dup" }));
  assert.equal(first.accepted, true);

  const duplicate = processFuelEvent(tables, context, buildEvent({ txDigest: "tx-dup", eventId: "evt-dup-2" }));
  assert.equal(duplicate.accepted, false);
  if (!duplicate.accepted) {
    assert.equal(duplicate.audit.reason, "DUPLICATE_EVENT_ID");
  }

  assert.equal(listScoreEventsForMatch(tables, "match-001").length, 1);
});

test("applies urgency and panic multipliers", () => {
  const tables = createChainSyncTables();
  const context = buildContext();
  const accepted = processFuelEvent(
    tables,
    context,
    buildEvent({
      txDigest: "tx-formula",
      oldQuantity: 100,
      newQuantity: 200,
      chainTs: 1_950
    })
  );

  assert.equal(accepted.accepted, true);
  if (accepted.accepted) {
    assert.equal(accepted.scoreEvent.urgencyWeight, 3.0);
    assert.equal(accepted.scoreEvent.panicMultiplier, 1.5);
    assert.equal(accepted.scoreEvent.score, 450);
  }
});
