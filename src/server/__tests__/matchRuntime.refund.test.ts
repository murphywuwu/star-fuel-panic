import assert from "node:assert/strict";
import test from "node:test";
import {
  __resetMatchRuntime,
  __setMatchDetailForTests,
  refundTeamEntry,
  type MatchDetail
} from "@/server/matchRuntime.ts";
import { createEmptyProjectionState, writeRuntimeProjectionState } from "@/server/runtimeProjectionStore.ts";

function buildDetail(overrides?: {
  matchStatus?: MatchDetail["match"]["status"];
  isLocked?: boolean;
  hasPaid?: boolean;
  entryFee?: number;
}) : MatchDetail {
  const entryFee = overrides?.entryFee ?? 100;

  return {
    match: {
      id: "match-refund-1",
      onChainId: "0xrefund01",
      status: overrides?.matchStatus ?? "lobby",
      creationMode: "free",
      targetNodeIds: ["0xrefund01"],
      prizePool: 1500,
      hostPrizePool: 0,
      entryFee,
      minTeams: 1,
      maxTeams: 4,
      durationMinutes: 10,
      scoringMode: "weighted",
      challengeMode: "normal",
      triggerMode: "dynamic",
      startedAt: null,
      endedAt: null,
      createdBy: "system",
      hostAddress: null,
      createdAt: "2026-03-23T00:00:00.000Z"
    },
    teams: [
      {
        id: "team-refund-1",
        matchId: "match-refund-1",
        name: "Refund Squad",
        captainAddress: "0xcaptain",
        maxSize: 3,
        isLocked: overrides?.isLocked ?? false,
        hasPaid: overrides?.hasPaid ?? true,
        payTxDigest: overrides?.hasPaid === false ? null : "tx_pay_team-refund-1",
        totalScore: 0,
        rank: null,
        prizeAmount: null,
        status: overrides?.hasPaid === false ? "forming" : overrides?.isLocked ? "locked" : "paid",
        createdAt: "2026-03-23T00:00:00.000Z"
      }
    ],
    members: [
      {
        id: "member-1",
        teamId: "team-refund-1",
        walletAddress: "0xcaptain",
        role: "collector",
        slotStatus: "confirmed",
        personalScore: 0,
        prizeAmount: null,
        joinedAt: "2026-03-23T00:00:00.000Z"
      },
      {
        id: "member-2",
        teamId: "team-refund-1",
        walletAddress: "0xhauler",
        role: "hauler",
        slotStatus: "confirmed",
        personalScore: 0,
        prizeAmount: null,
        joinedAt: "2026-03-23T00:00:01.000Z"
      },
      {
        id: "member-3",
        teamId: "team-refund-1",
        walletAddress: "0xescort",
        role: "escort",
        slotStatus: "confirmed",
        personalScore: 0,
        prizeAmount: null,
        joinedAt: "2026-03-23T00:00:02.000Z"
      }
    ]
  };
}

test.beforeEach(() => {
  __resetMatchRuntime();
  writeRuntimeProjectionState(createEmptyProjectionState());
});

test("refunds the full paid entry before captain lock", () => {
  __setMatchDetailForTests(buildDetail({ matchStatus: "lobby", isLocked: false, hasPaid: true, entryFee: 120 }));

  const result = refundTeamEntry({
    teamId: "team-refund-1",
    walletAddress: "0xcaptain"
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.refundAmount, 360);
    assert.equal(result.data.team.hasPaid, false);
    assert.equal(result.data.team.payTxDigest, null);
    assert.equal(result.data.team.status, "forming");
  }
});

test("blocks refunds during the 30-second prestart window", () => {
  __setMatchDetailForTests(buildDetail({ matchStatus: "prestart", isLocked: true, hasPaid: true }));

  const result = refundTeamEntry({
    teamId: "team-refund-1",
    walletAddress: "0xcaptain"
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error.code, "REFUND_NOT_ALLOWED");
    assert.match(result.error.message, /30-second prestart window/i);
  }
});

test("blocks refunds once the match is running", () => {
  __setMatchDetailForTests(buildDetail({ matchStatus: "running", isLocked: true, hasPaid: true }));

  const result = refundTeamEntry({
    teamId: "team-refund-1",
    walletAddress: "0xcaptain"
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error.code, "REFUND_NOT_ALLOWED");
    assert.match(result.error.message, /after the match has started/i);
  }
});
