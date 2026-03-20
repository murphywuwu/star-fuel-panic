import { describe, expect, test } from "vitest";

import { createKboContractGateway } from "@/service/kboContractGateway";

describe("kboContractGateway", () => {
  test("executes happy path with settlement and claim", () => {
    const gateway = createKboContractGateway();
    const created = gateway.createMatch({
      host: "host-alpha",
      entryFeeLux: 80,
      players: 8,
      platformFeeBps: 1000,
      hostRevshareBps: 5000
    });

    expect(created.matchId).toBe("kbo-match-0");
    expect(created.phase).toBe("LobbyReady");
    expect(created.settlement.payoutPool).toBe(576);

    gateway.startMatch(created.matchId);
    gateway.submitKillmail({ matchId: created.matchId, slotId: 1, killmailId: "km-001" });
    gateway.openGraceWindow(created.matchId);
    const settled = gateway.settleMatch({ matchId: created.matchId, lineBonus: 32, blackoutBonus: 0 });
    expect(settled.phase).toBe("Settled");
    expect(settled.settlement.payoutPool).toBe(608);

    const claim = gateway.claimSettlement({ matchId: created.matchId, pilotId: "pilot-1" });
    expect(claim.payout).toBe(608);
    expect(claim.snapshot.claimedBy).toBe("pilot-1");
  });

  test("rejects duplicate killmail globally", () => {
    const gateway = createKboContractGateway();
    const matchA = gateway.createMatch({
      host: "host-a",
      entryFeeLux: 80,
      players: 8,
      platformFeeBps: 1000,
      hostRevshareBps: 5000
    });
    const matchB = gateway.createMatch({
      host: "host-b",
      entryFeeLux: 80,
      players: 8,
      platformFeeBps: 1000,
      hostRevshareBps: 5000
    });

    gateway.startMatch(matchA.matchId);
    gateway.startMatch(matchB.matchId);
    gateway.submitKillmail({ matchId: matchA.matchId, slotId: 1, killmailId: "km-dup" });

    expect(() =>
      gateway.submitKillmail({ matchId: matchB.matchId, slotId: 2, killmailId: "km-dup" })
    ).toThrowError(/killmail already submitted/);
  });

  test("rejects replay claim", () => {
    const gateway = createKboContractGateway();
    const match = gateway.createMatch({
      host: "host-a",
      entryFeeLux: 80,
      players: 8,
      platformFeeBps: 1000,
      hostRevshareBps: 5000
    });

    gateway.startMatch(match.matchId);
    gateway.submitKillmail({ matchId: match.matchId, slotId: 1, killmailId: "km-claim" });
    gateway.openGraceWindow(match.matchId);
    gateway.settleMatch({ matchId: match.matchId, lineBonus: 16, blackoutBonus: 0 });
    gateway.claimSettlement({ matchId: match.matchId, pilotId: "pilot-a" });

    expect(() => gateway.claimSettlement({ matchId: match.matchId, pilotId: "pilot-b" })).toThrowError(
      /settlement already claimed/
    );
  });
});
