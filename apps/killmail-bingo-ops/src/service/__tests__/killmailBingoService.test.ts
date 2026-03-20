import { describe, expect, test } from "vitest";

import { calculateRiskScore, canTransition, shouldFlagRisk } from "@/service/killmailBingoService";

describe("killmailBingoService core rules", () => {
  test("allows only forward state transitions", () => {
    expect(canTransition("LobbyReady", "CardDrafted")).toBe(true);
    expect(canTransition("CardDrafted", "MatchRunning")).toBe(true);
    expect(canTransition("GraceWindow", "Settled")).toBe(true);

    expect(canTransition("LobbyReady", "Settled")).toBe(false);
    expect(canTransition("Settled", "GraceWindow")).toBe(false);
  });

  test("computes risk score from rejected/duplicate/pending signals", () => {
    const score = calculateRiskScore({
      rejectedCount: 2,
      duplicateAttempts: 1,
      pendingCount: 3
    });

    expect(score).toBe(97);
    expect(shouldFlagRisk(score)).toBe(true);
    expect(shouldFlagRisk(59)).toBe(false);
  });

  test("keeps clean sessions below risk threshold", () => {
    const score = calculateRiskScore({
      rejectedCount: 0,
      duplicateAttempts: 0,
      pendingCount: 2
    });

    expect(score).toBe(8);
    expect(shouldFlagRisk(score)).toBe(false);
  });
});
