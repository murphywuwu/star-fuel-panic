import type { MemberPayout, SettlementBill, TeamPayout } from "@/types/settlement";
import type { DemoReplayOutcomeTeam } from "@/types/matchDemoReplay";
import type { SettlementDemoFrame, SettlementDemoScenario, SettlementDemoTeamCard } from "@/types/settlementDemo";
import { DEFAULT_MATCH_DEMO_REPLAY_SCENARIO, listMatchDemoOutcomeTeams } from "@/utils/matchDemoReplayScenario";

const SIMULATION_LABEL = "SIMULATION MODE // DEMO REPORT";
const PLAYER_TEAM_ID = "iron-frogs";
const PAYOUT_POOL = 1188;
const PRIZE_RATIOS = [0.6, 0.3, 0.1, 0];

type DemoMemberProfile = {
  walletAddress: string;
  role: "collector" | "hauler" | "escort" | "dispatcher";
  personalScore: number;
};

const MEMBER_PROFILES: Record<string, DemoMemberProfile[]> = {
  "iron-frogs": [
    { walletAddress: "0xiron_mira", role: "hauler", personalScore: 1320 },
    { walletAddress: "0xiron_holt", role: "escort", personalScore: 650 },
    { walletAddress: "0xiron_cass", role: "collector", personalScore: 410 }
  ],
  "ember-toads": [
    { walletAddress: "0xember_kiro", role: "hauler", personalScore: 1220 },
    { walletAddress: "0xember_nox", role: "escort", personalScore: 670 },
    { walletAddress: "0xember_tao", role: "collector", personalScore: 420 }
  ],
  "void-hoppers": [
    { walletAddress: "0xvoid_seth", role: "hauler", personalScore: 1210 },
    { walletAddress: "0xvoid_lyra", role: "collector", personalScore: 650 },
    { walletAddress: "0xvoid_vex", role: "escort", personalScore: 350 }
  ],
  "relay-crew": [
    { walletAddress: "0xrelay_orin", role: "dispatcher", personalScore: 920 },
    { walletAddress: "0xrelay_ves", role: "collector", personalScore: 470 },
    { walletAddress: "0xrelay_ark", role: "escort", personalScore: 270 }
  ]
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function toMoneyString(value: number) {
  return round2(value).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function buildTeamPrizeAmount(rank: number) {
  return rank >= 1 && rank <= PRIZE_RATIOS.length ? round2(PAYOUT_POOL * (PRIZE_RATIOS[rank - 1] ?? 0)) : 0;
}

function buildMemberPayouts(teamPrizeAmount: number, members: DemoMemberProfile[]): MemberPayout[] {
  const totalScore = members.reduce((sum, member) => sum + member.personalScore, 0);
  let allocated = 0;

  return members.map((member, index) => {
    const contributionRatio = totalScore > 0 ? round2(member.personalScore / totalScore) : 0;
    const rawAmount =
      teamPrizeAmount <= 0 || member.personalScore <= 0
        ? 0
        : index === members.length - 1
          ? round2(teamPrizeAmount - allocated)
          : round2(teamPrizeAmount * (member.personalScore / totalScore));

    const prizeAmount = Math.max(0, rawAmount);
    allocated = round2(allocated + prizeAmount);

    return {
      walletAddress: member.walletAddress,
      role: member.role,
      personalScore: member.personalScore,
      contributionRatio,
      prizeAmount: toMoneyString(prizeAmount)
    };
  });
}

function buildTeamBreakdown(outcomeTeams: DemoReplayOutcomeTeam[]): TeamPayout[] {
  return outcomeTeams.map((team) => {
    const members = MEMBER_PROFILES[team.teamId] ?? [];
    const prizeAmount = buildTeamPrizeAmount(team.finalRank);

    return {
      teamId: team.teamId,
      teamName: team.teamName,
      rank: team.finalRank,
      totalScore: team.finalScore,
      prizeRatio: PRIZE_RATIOS[team.finalRank - 1] ?? 0,
      prizeAmount: toMoneyString(prizeAmount),
      members: buildMemberPayouts(prizeAmount, members)
    };
  });
}

function buildDemoBill(outcomeTeams: DemoReplayOutcomeTeam[]): SettlementBill {
  const teamBreakdown = buildTeamBreakdown(outcomeTeams);
  const mvpMember =
    teamBreakdown
      .flatMap((team) => team.members.map((member) => ({ teamId: team.teamId, member })))
      .sort((left, right) => right.member.personalScore - left.member.personalScore)[0] ?? null;

  return {
    matchId: DEFAULT_MATCH_DEMO_REPLAY_SCENARIO.roomId,
    sponsorshipFee: "50",
    entryFeeTotal: "1200",
    platformSubsidy: "0",
    grossPool: "1250",
    platformFeeRate: 0.05,
    platformFee: "62",
    payoutPool: toMoneyString(PAYOUT_POOL),
    payoutTxDigest: "0xDEMO_SETTLEMENT_TRACE_7B19",
    teamBreakdown,
    mvp: mvpMember
      ? {
          walletAddress: mvpMember.member.walletAddress,
          teamId: mvpMember.teamId,
          role: mvpMember.member.role,
          score: mvpMember.member.personalScore
        }
      : null
  };
}

function buildTeamCards(outcomeTeams: DemoReplayOutcomeTeam[], bill: SettlementBill): SettlementDemoTeamCard[] {
  return outcomeTeams.map((team) => {
    const payout = bill.teamBreakdown.find((entry) => entry.teamId === team.teamId);
    return {
      teamId: team.teamId,
      teamCode: team.teamCode,
      unitTag: team.unitTag,
      teamName: team.teamName,
      callsign: team.callsign,
      mascotSrc: team.mascotSrc,
      accentColor: team.accentColor,
      rank: team.finalRank,
      totalScore: team.finalScore,
      prizeRatio: payout?.prizeRatio ?? 0,
      prizeAmount: payout?.prizeAmount ?? "0",
      isPlayerTeam: team.teamId === PLAYER_TEAM_ID
    };
  });
}

function clampReportProgress(playbackSec: number, reportStartSec: number) {
  if (playbackSec <= 0) {
    return 18;
  }
  if (playbackSec <= 4) {
    return Math.round(lerp(18, 72, playbackSec / 4));
  }
  if (playbackSec <= reportStartSec) {
    return Math.round(lerp(72, 100, (playbackSec - 4) / Math.max(1, reportStartSec - 4)));
  }
  return 100;
}

function buildStatusTitle(playbackSec: number, reportStartSec: number) {
  if (playbackSec < 4) {
    return "SIMULATED SETTLING";
  }
  if (playbackSec < reportStartSec) {
    return "PAYOUT READY";
  }
  return "MATCH REPORT";
}

function buildStatusNote(playbackSec: number, reportStartSec: number) {
  if (playbackSec < 4) {
    return "LOCKING FINAL SCORE SNAPSHOT FROM MATCH DEMO AND PREPARING PAYOUT GRAPH";
  }
  if (playbackSec < reportStartSec) {
    return "RESOLVING BILL FLOW, MVP, AND PAYOUT TRACE FROM THE FINAL MATCH RANKING";
  }
  return "FINAL BILL RESOLVED // REPORT DERIVED FROM MATCH DEMO FINAL SCOREBOARD";
}

const OUTCOME_TEAMS = listMatchDemoOutcomeTeams();
const DEMO_BILL = buildDemoBill(OUTCOME_TEAMS);
const DEMO_TEAM_CARDS = buildTeamCards(OUTCOME_TEAMS, DEMO_BILL);
const PLAYER_TEAM = DEMO_BILL.teamBreakdown.find((team) => team.teamId === PLAYER_TEAM_ID) ?? DEMO_BILL.teamBreakdown[0];
const PLAYER_MEMBER = PLAYER_TEAM?.members[0] ?? null;
const CHAMPION_TEAM = DEMO_BILL.teamBreakdown.find((team) => team.rank === 1) ?? DEMO_BILL.teamBreakdown[0];

export const DEFAULT_SETTLEMENT_DEMO_SCENARIO: SettlementDemoScenario = {
  id: "hackathon-settlement-demo-v1",
  label: "Hackathon Settlement Demo",
  roomId: DEFAULT_MATCH_DEMO_REPLAY_SCENARIO.roomId,
  loopSec: 14,
  reportStartSec: 7,
  bill: DEMO_BILL,
  teams: DEMO_TEAM_CARDS,
  hero: {
    championTeamId: CHAMPION_TEAM?.teamId ?? "iron-frogs",
    championTeamName: CHAMPION_TEAM?.teamName ?? "IRON FROGS",
    championPrizeAmount: CHAMPION_TEAM?.prizeAmount ?? "0",
    myPayoutAmount: PLAYER_MEMBER?.prizeAmount ?? "0",
    myPilotName: PLAYER_MEMBER?.walletAddress === "0xiron_mira" ? "MIRA" : PLAYER_MEMBER?.walletAddress ?? "MIRA",
    mvpPilotName: DEMO_BILL.mvp?.walletAddress === "0xiron_mira" ? "MIRA" : DEMO_BILL.mvp?.walletAddress ?? "MIRA",
    mvpRole: (DEMO_BILL.mvp?.role ?? "dispatcher").toUpperCase(),
    mvpScore: DEMO_BILL.mvp?.score ?? 0,
    payoutTxDigest: DEMO_BILL.payoutTxDigest ?? "0xDEMO_SETTLEMENT_TRACE_7B19"
  },
  honorTags: [
    "MATCH DEMO OUTCOME LOCKED",
    "CHAMPION // IRON FROGS",
    "MVP // MIRA",
    "PAYOUT TRACE VERIFIED"
  ],
  timeline: [
    {
      id: "settle-01",
      atSec: 1,
      message: "SETTLEMENT TRACE LOCKED // FREEZE FINAL SCORE SNAPSHOT FROM MATCH OVERLAY",
      kind: "status"
    },
    {
      id: "settle-03",
      atSec: 3,
      message: "POOL BREAKDOWN RESOLVED // GROSS 1250 / PLATFORM 62 / PAYOUT 1188",
      kind: "chain"
    },
    {
      id: "settle-05",
      atSec: 5,
      message: "PAYOUT GRAPH READY // IRON FROGS 60% / EMBER TOADS 30% / VOID HOPPERS 10%",
      kind: "award"
    },
    {
      id: "settle-07",
      atSec: 7,
      message: `REPORT READY // MVP MIRA / YOUR PAYOUT ${PLAYER_MEMBER?.prizeAmount ?? "0"} LUX`,
      kind: "award"
    }
  ]
};

export function buildSettlementDemoFrame(
  scenario: SettlementDemoScenario,
  playbackSec: number
): SettlementDemoFrame {
  const clampedSec = clamp(playbackSec, 0, scenario.loopSec);
  const phase = clampedSec < scenario.reportStartSec ? "settling" : "report";
  const visibleTimeline = scenario.timeline
    .filter((entry) => entry.atSec <= clampedSec)
    .sort((left, right) => right.atSec - left.atSec)
    .slice(0, 6);

  return {
    phase,
    roomId: scenario.roomId,
    remainingSec: Math.max(0, scenario.reportStartSec - Math.floor(clampedSec)),
    progress: clampReportProgress(clampedSec, scenario.reportStartSec),
    simulationLabel: SIMULATION_LABEL,
    statusTitle: buildStatusTitle(clampedSec, scenario.reportStartSec),
    statusNote: buildStatusNote(clampedSec, scenario.reportStartSec),
    hero: scenario.hero,
    bill: scenario.bill,
    teams: scenario.teams,
    honorTags: scenario.honorTags,
    timeline: visibleTimeline
  };
}
