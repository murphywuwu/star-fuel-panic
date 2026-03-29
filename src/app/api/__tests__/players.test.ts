import assert from "node:assert/strict";
import test from "node:test";
import { __resetMatchRuntime, __setMatchDetailForTests, type MatchDetail } from "../../../server/matchRuntime.ts";
import { getPlayerProfile, getPlayerTeamDossier } from "../../../server/playerRuntime.ts";
import { createEmptyProjectionState, writeRuntimeProjectionState } from "../../../server/runtimeProjectionStore.ts";
import { resetTeamRuntime } from "../../../server/teamRuntime.ts";
import type { MatchStatus } from "../../../types/match.ts";
import type { PlayerRole, Team, TeamMember } from "../../../types/team.ts";

const PILOT = "0xtest-pilot-alpha";
const OTHER_A = "0xtest-wing-a";
const OTHER_B = "0xtest-wing-b";

function member(teamId: string, walletAddress: string, role: PlayerRole, personalScore: number, joinedAt: string): TeamMember {
  return {
    id: `${teamId}-${walletAddress}`,
    teamId,
    walletAddress,
    role,
    slotStatus: "locked",
    personalScore,
    prizeAmount: null,
    joinedAt
  };
}

function team(input: {
  id: string;
  matchId: string;
  name: string;
  captainAddress: string;
  totalScore: number;
  rank: number | null;
  createdAt: string;
  status?: Team["status"];
}): Team {
  return {
    id: input.id,
    matchId: input.matchId,
    name: input.name,
    captainAddress: input.captainAddress,
    maxSize: 3,
    isLocked: true,
    hasPaid: true,
    payTxDigest: `pay_${input.id}`,
    totalScore: input.totalScore,
    rank: input.rank,
    prizeAmount: null,
    status: input.status ?? "paid",
    createdAt: input.createdAt
  };
}

function scoreRows(teamId: string, members: TeamMember[], matchId: string) {
  return members.map((item) => ({
    matchId,
    teamId,
    walletAddress: item.walletAddress,
    totalScore: item.personalScore,
    fuelDeposited: Math.max(1, Math.round(item.personalScore / 2)),
    updatedAt: item.joinedAt
  }));
}

function buildDetail(input: {
  matchId: string;
  status: MatchStatus;
  creationMode: "free" | "precision";
  solarSystemId: number;
  prizePool: number;
  createdAt: string;
  teamName: string;
  pilotCaptain?: boolean;
  pilotScore: number;
  wingAScore: number;
  wingBScore: number;
  rivalScores: [number, number, number];
  pilotRank: number | null;
}): MatchDetail {
  const pilotTeamId = `${input.matchId}-team-alpha`;
  const rivalTeamId = `${input.matchId}-team-rival`;
  const pilotTeamCreatedAt = new Date(Date.parse(input.createdAt) + 60_000).toISOString();
  const rivalTeamCreatedAt = new Date(Date.parse(input.createdAt) + 120_000).toISOString();

  const pilotTeamMembers = [
    member(pilotTeamId, OTHER_A, "collector", input.wingAScore, new Date(Date.parse(input.createdAt) + 61_000).toISOString()),
    member(pilotTeamId, PILOT, "hauler", input.pilotScore, new Date(Date.parse(input.createdAt) + 62_000).toISOString()),
    member(pilotTeamId, OTHER_B, "escort", input.wingBScore, new Date(Date.parse(input.createdAt) + 63_000).toISOString())
  ];
  const rivalMembers = [
    member(rivalTeamId, `${input.matchId}-rival-a`, "collector", input.rivalScores[0], new Date(Date.parse(input.createdAt) + 64_000).toISOString()),
    member(rivalTeamId, `${input.matchId}-rival-b`, "hauler", input.rivalScores[1], new Date(Date.parse(input.createdAt) + 65_000).toISOString()),
    member(rivalTeamId, `${input.matchId}-rival-c`, "escort", input.rivalScores[2], new Date(Date.parse(input.createdAt) + 66_000).toISOString())
  ];

  const pilotTeam = team({
    id: pilotTeamId,
    matchId: input.matchId,
    name: input.teamName,
    captainAddress: input.pilotCaptain ? PILOT : OTHER_A,
    totalScore: input.pilotScore + input.wingAScore + input.wingBScore,
    rank: input.pilotRank,
    createdAt: pilotTeamCreatedAt
  });
  const rivalTeam = team({
    id: rivalTeamId,
    matchId: input.matchId,
    name: "Nova Wing",
    captainAddress: `${input.matchId}-rival-a`,
    totalScore: input.rivalScores[0] + input.rivalScores[1] + input.rivalScores[2],
    rank: input.pilotRank === 1 ? 2 : input.pilotRank === 2 ? 1 : null,
    createdAt: rivalTeamCreatedAt
  });

  return {
    match: {
      id: input.matchId,
      onChainId: null,
      status: input.status,
      creationMode: input.creationMode,
      solarSystemId: input.solarSystemId,
      targetNodeIds: [],
      prizePool: input.prizePool,
      hostPrizePool: input.prizePool,
      entryFee: 0,
      minTeams: 2,
      maxTeams: 4,
      durationMinutes: 120,
      scoringMode: "weighted",
      triggerMode: "dynamic",
      startedAt: input.status === "lobby" ? null : input.createdAt,
      endedAt: input.status === "settled" ? new Date(Date.parse(input.createdAt) + 7_200_000).toISOString() : null,
      createdBy: "0xtest-host",
      hostAddress: "0xtest-host",
      sponsorshipFee: input.prizePool,
      createdAt: input.createdAt
    },
    teams: [pilotTeam, rivalTeam],
    members: [...pilotTeamMembers, ...rivalMembers],
    scores: [...scoreRows(pilotTeamId, pilotTeamMembers, input.matchId), ...scoreRows(rivalTeamId, rivalMembers, input.matchId)]
  };
}

function seedPlayerMatches() {
  __setMatchDetailForTests(
    buildDetail({
      matchId: "match-settled-1",
      status: "settled",
      creationMode: "precision",
      solarSystemId: 30000142,
      prizePool: 300,
      createdAt: "2026-03-25T08:00:00.000Z",
      teamName: "Alpha Squad",
      pilotCaptain: false,
      pilotScore: 120,
      wingAScore: 60,
      wingBScore: 20,
      rivalScores: [80, 40, 20],
      pilotRank: 1
    })
  );

  __setMatchDetailForTests(
    buildDetail({
      matchId: "match-settled-2",
      status: "settled",
      creationMode: "free",
      solarSystemId: 30000143,
      prizePool: 200,
      createdAt: "2026-03-26T09:00:00.000Z",
      teamName: "Escort Coil",
      pilotCaptain: false,
      pilotScore: 40,
      wingAScore: 40,
      wingBScore: 40,
      rivalScores: [120, 40, 40],
      pilotRank: 2
    })
  );

  __setMatchDetailForTests(
    buildDetail({
      matchId: "match-active-1",
      status: "running",
      creationMode: "precision",
      solarSystemId: 30000144,
      prizePool: 450,
      createdAt: "2026-03-27T10:00:00.000Z",
      teamName: "Alpha Squad",
      pilotCaptain: true,
      pilotScore: 72,
      wingAScore: 48,
      wingBScore: 36,
      rivalScores: [70, 40, 30],
      pilotRank: null
    })
  );
}

test.beforeEach(() => {
  __resetMatchRuntime();
  resetTeamRuntime();
  writeRuntimeProjectionState(createEmptyProjectionState());
  seedPlayerMatches();
});

test("aggregates player profile stats across seeded matches", () => {
  const profile = getPlayerProfile(PILOT);

  assert.equal(profile.address, PILOT);
  assert.equal(profile.totalMatches, 3);
  assert.equal(profile.wins, 1);
  assert.equal(profile.totalScore, 232);
  assert.equal(profile.totalEarnings, 138.7);
  assert.equal(profile.reputationScore, 40);
  assert.deepEqual(
    profile.recentMatches.map((match) => ({
      matchId: match.matchId,
      rank: match.rank,
      score: match.score,
      earnings: match.earnings
    })),
    [
      { matchId: "match-active-1", rank: 0, score: 72, earnings: 0 },
      { matchId: "match-settled-2", rank: 2, score: 40, earnings: 19 },
      { matchId: "match-settled-1", rank: 1, score: 120, earnings: 119.7 }
    ]
  );
});

test("builds player team dossier with current deployment and participation log", async () => {
  const dossier = await getPlayerTeamDossier(PILOT);

  assert.equal(dossier.address, PILOT);
  assert.equal(dossier.summary.totalMatches, 3);
  assert.equal(dossier.summary.totalTeams, 3);
  assert.equal(dossier.summary.wins, 1);
  assert.equal(dossier.summary.totalScore, 232);
  assert.equal(dossier.summary.totalEarnings, 138.7);
  assert.equal(dossier.summary.activeDeployments, 1);
  assert.equal(dossier.currentDeployment?.team.name, "Alpha Squad");
  assert.equal(dossier.currentDeployment?.isCaptain, true);
  assert.equal(dossier.currentDeployment?.myRole, "hauler");
  assert.equal(dossier.currentDeployment?.match.matchId, "match-active-1");
  assert.equal(dossier.currentDeployment?.match.modeLabel, "Precision Mode");
  assert.equal(dossier.participations.length, 3);
  assert.deepEqual(
    dossier.participations.map((item) => ({
      matchId: item.match.matchId,
      teamName: item.teamName,
      payout: item.payout,
      role: item.role
    })),
    [
      { matchId: "match-active-1", teamName: "Alpha Squad", payout: 0, role: "hauler" },
      { matchId: "match-settled-2", teamName: "Escort Coil", payout: 19, role: "hauler" },
      { matchId: "match-settled-1", teamName: "Alpha Squad", payout: 119.7, role: "hauler" }
    ]
  );
});

test("returns zeroed stats and empty dossier for unknown players", async () => {
  const profile = getPlayerProfile("0xunknown-pilot");
  const dossier = await getPlayerTeamDossier("0xunknown-pilot");

  assert.equal(profile.totalMatches, 0);
  assert.equal(profile.wins, 0);
  assert.equal(profile.totalScore, 0);
  assert.equal(profile.totalEarnings, 0);
  assert.equal(profile.reputationScore, 0);
  assert.deepEqual(profile.recentMatches, []);

  assert.equal(dossier.summary.totalMatches, 0);
  assert.equal(dossier.summary.totalTeams, 0);
  assert.equal(dossier.summary.totalEarnings, 0);
  assert.equal(dossier.summary.activeDeployments, 0);
  assert.equal(dossier.currentDeployment, null);
  assert.deepEqual(dossier.participations, []);
});
