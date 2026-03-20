import { beforeEach, describe, expect, test } from "vitest";

import { useKillmailBingoStore } from "@/model/killmailBingoStore";
import type { BoardSlot, KillmailRef } from "@/types/killmail";

function seedBoard(): BoardSlot[] {
  return [
    {
      slotId: "slot-1",
      label: "Task 1",
      weight: 1,
      verificationRuleId: "rule-1",
      status: "Idle"
    },
    {
      slotId: "slot-2",
      label: "Task 2",
      weight: 2,
      verificationRuleId: "rule-2",
      status: "Idle"
    }
  ];
}

function event(killmailId: string): KillmailRef {
  return {
    killmailId,
    actorId: "pilot-demo",
    occurredAt: new Date("2026-03-20T00:00:00.000Z").toISOString()
  };
}

describe("killmailBingoStore slot transitions", () => {
  beforeEach(() => {
    const state = useKillmailBingoStore.getState();
    state.resetSessionForMatch("match-test");
    state.setBoardSlots(seedBoard());
  });

  test("sets pending slot then confirms and clears pending map", () => {
    const state = useKillmailBingoStore.getState();
    const killmail = event("km-001");

    state.setSlotPending("slot-1", killmail);
    let snapshot = useKillmailBingoStore.getState();
    expect(snapshot.boardSlots[0]?.status).toBe("Pending");
    expect(snapshot.pendingSlotByKillmailId[killmail.killmailId]).toBe("slot-1");

    state.confirmEvent("slot-1", killmail);
    snapshot = useKillmailBingoStore.getState();
    expect(snapshot.boardSlots[0]?.status).toBe("Confirmed");
    expect(snapshot.pendingEvents).toHaveLength(0);
    expect(snapshot.pendingSlotByKillmailId[killmail.killmailId]).toBeUndefined();
  });

  test("sets pending slot then rejects and writes report row with mapped slot", () => {
    const state = useKillmailBingoStore.getState();
    const killmail = event("km-bad-001");

    state.setSlotPending("slot-2", killmail);
    state.rejectEvent("slot-2", killmail);

    const snapshot = useKillmailBingoStore.getState();
    expect(snapshot.boardSlots[1]?.status).toBe("Rejected");
    expect(snapshot.rejectedEvents).toHaveLength(1);
    expect(snapshot.reportEntries.at(-1)).toMatchObject({
      killmailId: "km-bad-001",
      slotId: "slot-2",
      status: "Rejected"
    });
  });
});
