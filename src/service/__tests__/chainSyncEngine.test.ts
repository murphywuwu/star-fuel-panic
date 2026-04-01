import assert from "node:assert/strict";
import test from "node:test";
import {
  createChainSyncTables,
  listScoreEventsForMatch,
  processFuelEvent,
  getPlayerGradeCollection,
  getAllPlayerGradeCollections,
  PRIMARY_GRADE_MULTIPLIER,
  type ChainSyncContext
} from "../chainSyncEngine.ts";
import type { ChainFuelEvent } from "../../types/fuelMission.ts";

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
    fuelTypeId: 11,
    fuelEfficiency: 25,
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
    assert.equal(accepted.scoreEvent.fuelGrade.grade, "standard");
    assert.equal(accepted.scoreEvent.fuelGradeBonus, 1.0);
    assert.equal(accepted.scoreEvent.score, 450);
  }
});

test("applies fuel grade bonus from FuelEvent.type_id", () => {
  const tables = createChainSyncTables();
  const accepted = processFuelEvent(
    tables,
    buildContext(),
    buildEvent({
      txDigest: "tx-refined",
      fuelTypeId: 33,
      fuelEfficiency: 85
    })
  );

  assert.equal(accepted.accepted, true);
  if (accepted.accepted) {
    assert.equal(accepted.scoreEvent.fuelGrade.grade, "refined");
    assert.equal(accepted.scoreEvent.fuelGradeBonus, 1.5);
    assert.equal(accepted.scoreEvent.score, 450);
  }
});

// Fuel Grade Challenge Mode Tests

test("applies primary grade multiplier in fuel grade challenge mode", () => {
  const tables = createChainSyncTables();
  const context: ChainSyncContext = {
    ...buildContext(),
    challengeMode: "fuel_grade_challenge",
    primaryFuelGrade: "refined"
  };

  // Use refined fuel (primary grade) - should get 2x multiplier
  const refinedResult = processFuelEvent(
    tables,
    context,
    buildEvent({
      txDigest: "tx-primary",
      fuelTypeId: 33,
      fuelEfficiency: 85
    })
  );

  assert.equal(refinedResult.accepted, true);
  if (refinedResult.accepted) {
    assert.equal(refinedResult.scoreEvent.primaryGradeMultiplier, PRIMARY_GRADE_MULTIPLIER);
    // Score = 100 * 3.0 (urgency) * 1.0 (panic) * 1.5 (grade) * 2.0 (primary) = 900
    assert.equal(refinedResult.scoreEvent.score, 900);
  }
});

test("does not apply primary grade multiplier for non-primary fuel", () => {
  const tables = createChainSyncTables();
  const context: ChainSyncContext = {
    ...buildContext(),
    challengeMode: "fuel_grade_challenge",
    primaryFuelGrade: "refined"
  };

  // Use standard fuel (not primary) - should not get 2x multiplier
  const standardResult = processFuelEvent(
    tables,
    context,
    buildEvent({
      txDigest: "tx-standard",
      fuelTypeId: 11,
      fuelEfficiency: 25
    })
  );

  assert.equal(standardResult.accepted, true);
  if (standardResult.accepted) {
    assert.equal(standardResult.scoreEvent.primaryGradeMultiplier, 1.0);
    // Score = 100 * 3.0 (urgency) * 1.0 (panic) * 1.0 (grade) * 1.0 (primary) = 300
    assert.equal(standardResult.scoreEvent.score, 300);
  }
});

test("tracks grade collection in fuel grade challenge mode", () => {
  const tables = createChainSyncTables();
  const context: ChainSyncContext = {
    ...buildContext(),
    challengeMode: "fuel_grade_challenge",
    primaryFuelGrade: "refined"
  };

  // Deposit standard fuel
  processFuelEvent(tables, context, buildEvent({
    txDigest: "tx-collect-1",
    fuelTypeId: 11,
    fuelEfficiency: 25
  }));

  // Check collection - should have standard only
  const afterStandard = getPlayerGradeCollection(tables, "match-001", "pilot-alpha");
  assert.equal(afterStandard.collectedGrades.length, 1);
  assert.equal(afterStandard.collectedGrades[0], "standard");
  assert.equal(afterStandard.hasAllGrades, false);

  // Deposit premium fuel
  processFuelEvent(tables, context, buildEvent({
    txDigest: "tx-collect-2",
    fuelTypeId: 22,
    fuelEfficiency: 55
  }));

  // Deposit refined fuel
  processFuelEvent(tables, context, buildEvent({
    txDigest: "tx-collect-3",
    fuelTypeId: 33,
    fuelEfficiency: 85
  }));

  // Check collection - should have all grades
  const afterAll = getPlayerGradeCollection(tables, "match-001", "pilot-alpha");
  assert.equal(afterAll.collectedGrades.length, 3);
  assert.equal(afterAll.hasAllGrades, true);
});

test("does not track grade collection in normal mode", () => {
  const tables = createChainSyncTables();
  const context: ChainSyncContext = {
    ...buildContext(),
    challengeMode: "normal"
  };

  processFuelEvent(tables, context, buildEvent({
    txDigest: "tx-normal-1",
    fuelTypeId: 11,
    fuelEfficiency: 25
  }));

  const collection = getPlayerGradeCollection(tables, "match-001", "pilot-alpha");
  assert.equal(collection.collectedGrades.length, 0);
  assert.equal(collection.hasAllGrades, false);
});

test("getAllPlayerGradeCollections returns all players", () => {
  const tables = createChainSyncTables();
  const context: ChainSyncContext = {
    matchId: "match-001",
    whitelist: new Set(["pilot-alpha", "pilot-beta"]),
    targetAssemblies: new Set(["n1"]),
    window: { startTs: 1_000, endTs: 2_000, panicTs: 1_900 },
    memberTeamMap: new Map([
      ["pilot-alpha", "team-alpha"],
      ["pilot-beta", "team-beta"]
    ]),
    challengeMode: "fuel_grade_challenge",
    primaryFuelGrade: "refined"
  };

  // Alpha deposits standard and refined
  processFuelEvent(tables, context, buildEvent({
    txDigest: "tx-alpha-1",
    senderWallet: "pilot-alpha",
    fuelTypeId: 11,
    fuelEfficiency: 25
  }));
  processFuelEvent(tables, context, buildEvent({
    txDigest: "tx-alpha-2",
    senderWallet: "pilot-alpha",
    fuelTypeId: 33,
    fuelEfficiency: 85
  }));

  // Beta deposits all three grades
  processFuelEvent(tables, context, buildEvent({
    txDigest: "tx-beta-1",
    senderWallet: "pilot-beta",
    playerName: "Pilot Beta",
    fuelTypeId: 11,
    fuelEfficiency: 25
  }));
  processFuelEvent(tables, context, buildEvent({
    txDigest: "tx-beta-2",
    senderWallet: "pilot-beta",
    playerName: "Pilot Beta",
    fuelTypeId: 22,
    fuelEfficiency: 55
  }));
  processFuelEvent(tables, context, buildEvent({
    txDigest: "tx-beta-3",
    senderWallet: "pilot-beta",
    playerName: "Pilot Beta",
    fuelTypeId: 33,
    fuelEfficiency: 85
  }));

  const allCollections = getAllPlayerGradeCollections(tables, "match-001");
  assert.equal(allCollections.size, 2);

  const alphaCollection = allCollections.get("pilot-alpha");
  assert.ok(alphaCollection);
  assert.equal(alphaCollection.collectedGrades.length, 2);
  assert.equal(alphaCollection.hasAllGrades, false);

  const betaCollection = allCollections.get("pilot-beta");
  assert.ok(betaCollection);
  assert.equal(betaCollection.collectedGrades.length, 3);
  assert.equal(betaCollection.hasAllGrades, true);
});
