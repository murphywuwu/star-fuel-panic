import type {
  DemoReplayFeedBurst,
  DemoReplayFrame,
  DemoReplayFrameNode,
  DemoReplayOutcomeTeam,
  DemoReplayFrameTeam,
  DemoReplayScenario,
  DemoReplayStatus,
  DemoReplayUrgencyLabel
} from "@/types/matchDemoReplay";

const SIMULATION_LABEL = "SIMULATION MODE // SCRIPTED TELEMETRY";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function roundScore(value: number) {
  return Math.round(value);
}

function resolveUrgency(fillRatio: number): DemoReplayUrgencyLabel {
  if (fillRatio < 0.2) {
    return "CRITICAL";
  }
  if (fillRatio < 0.5) {
    return "WARN";
  }
  return "SAFE";
}

function resolveStatus(playbackSec: number, loopSec: number): DemoReplayStatus {
  if (playbackSec >= loopSec) {
    return "settling";
  }
  if (playbackSec >= 40) {
    return "panic";
  }
  return "running";
}

function resolveSegmentIndex(scenario: DemoReplayScenario, playbackSec: number) {
  return scenario.segments.findIndex((segment) => playbackSec >= segment.startSec && playbackSec <= segment.endSec);
}

function resolveSegmentScoreStart(scenario: DemoReplayScenario, segmentIndex: number, teamId: string) {
  if (segmentIndex <= 0) {
    return scenario.teams.find((team) => team.teamId === teamId)?.startScore ?? 0;
  }

  return scenario.segments[segmentIndex - 1]?.scoreTargets[teamId] ?? 0;
}

function resolveSegmentNodeStart(scenario: DemoReplayScenario, segmentIndex: number, nodeId: string) {
  if (segmentIndex <= 0) {
    return scenario.nodes.find((node) => node.nodeId === nodeId)?.initialFillRatio ?? 0;
  }

  return scenario.segments[segmentIndex - 1]?.nodeTargets.find((node) => node.nodeId === nodeId)?.fillRatio ?? 0;
}

function listVisibleBursts(scenario: DemoReplayScenario, playbackSec: number): DemoReplayFeedBurst[] {
  return scenario.segments
    .flatMap((segment) => segment.feedBursts)
    .filter((burst) => burst.atSec <= playbackSec)
    .sort((left, right) => right.atSec - left.atSec);
}

function buildTeams(
  scenario: DemoReplayScenario,
  playbackSec: number,
  segmentIndex: number
): DemoReplayFrameTeam[] {
  const activeSegment = scenario.segments[segmentIndex] ?? null;
  const progress = activeSegment
    ? clamp((playbackSec - activeSegment.startSec) / Math.max(1, activeSegment.endSec - activeSegment.startSec), 0, 1)
    : 1;
  const visibleBursts = listVisibleBursts(scenario, playbackSec);

  const teams = scenario.teams.map<DemoReplayFrameTeam>((team) => {
    const startScore = activeSegment
      ? resolveSegmentScoreStart(scenario, segmentIndex, team.teamId)
      : scenario.segments.at(-1)?.scoreTargets[team.teamId] ?? team.startScore;
    const endScore = activeSegment
      ? activeSegment.scoreTargets[team.teamId] ?? startScore
      : scenario.segments.at(-1)?.scoreTargets[team.teamId] ?? startScore;
    const lastAction =
      visibleBursts.find((burst) => burst.teamId === team.teamId)?.summary ?? "SYNCING FORMATION";

    return {
      ...team,
      score: roundScore(lerp(startScore, endScore, progress)),
      rank: 0,
      lastAction
    };
  });

  const ranked = [...teams].sort((left, right) => right.score - left.score);
  const rankMap = new Map(ranked.map((team, index) => [team.teamId, index + 1] as const));

  return teams
    .map((team) => ({
      ...team,
      rank: rankMap.get(team.teamId) ?? teams.length
    }))
    .sort((left, right) => left.rank - right.rank);
}

function buildNodes(
  scenario: DemoReplayScenario,
  playbackSec: number,
  segmentIndex: number
): DemoReplayFrameNode[] {
  const activeSegment = scenario.segments[segmentIndex] ?? null;
  const progress = activeSegment
    ? clamp((playbackSec - activeSegment.startSec) / Math.max(1, activeSegment.endSec - activeSegment.startSec), 0, 1)
    : 1;

  return scenario.nodes.map((node) => {
    const startFill = activeSegment
      ? resolveSegmentNodeStart(scenario, segmentIndex, node.nodeId)
      : scenario.segments.at(-1)?.nodeTargets.find((candidate) => candidate.nodeId === node.nodeId)?.fillRatio ??
        node.initialFillRatio;
    const endFill = activeSegment
      ? activeSegment.nodeTargets.find((candidate) => candidate.nodeId === node.nodeId)?.fillRatio ?? startFill
      : scenario.segments.at(-1)?.nodeTargets.find((candidate) => candidate.nodeId === node.nodeId)?.fillRatio ?? startFill;
    const fillRatio = clamp(lerp(startFill, endFill, progress), 0, 1);

    return {
      nodeId: node.nodeId,
      name: node.name,
      fillRatio,
      urgencyLabel: resolveUrgency(fillRatio)
    };
  });
}

export const DEFAULT_MATCH_DEMO_REPLAY_SCENARIO: DemoReplayScenario = {
  id: "hackathon-demo-replay-v1",
  label: "Hackathon Demo Telemetry",
  roomId: "demo-warboard-01",
  loopSec: 60,
  settleHoldSec: 1,
  teams: [
    {
      teamId: "iron-frogs",
      teamCode: "A",
      teamName: "IRON FROGS",
      unitTag: "A-01",
      callsign: "BASTION WING",
      specialty: "HEAVY ARMOR ESCORT",
      mascotSrc: "/mascot-shield.png",
      accentColor: "#E5B32B",
      startScore: 1180
    },
    {
      teamId: "void-hoppers",
      teamCode: "B",
      teamName: "VOID HOPPERS",
      unitTag: "B-07",
      callsign: "VECTOR SWARM",
      specialty: "FAST STABILIZE CELL",
      mascotSrc: "/mascot-thinking.png",
      accentColor: "#E0E0E0",
      startScore: 1120
    },
    {
      teamId: "ember-toads",
      teamCode: "C",
      teamName: "EMBER TOADS",
      unitTag: "C-13",
      callsign: "BURN RIG",
      specialty: "CRITICAL REFILL CREW",
      mascotSrc: "/mascot-working.png",
      accentColor: "#CC3300",
      startScore: 980
    },
    {
      teamId: "relay-crew",
      teamCode: "D",
      teamName: "RELAY CREW",
      unitTag: "D-02",
      callsign: "LINK ARRAY",
      specialty: "COMMS + ROUTE CONTROL",
      mascotSrc: "/mascot-writing.png",
      accentColor: "#A69A72",
      startScore: 940
    }
  ],
  nodes: [
    {
      nodeId: "gate-alpha",
      name: "Gate-Alpha",
      initialFillRatio: 0.38
    },
    {
      nodeId: "ssu-beta",
      name: "SSU-Beta",
      initialFillRatio: 0.72
    },
    {
      nodeId: "turret-gamma",
      name: "Turret-Gamma",
      initialFillRatio: 0.18
    }
  ],
  segments: [
    {
      startSec: 0,
      endSec: 10,
      scoreTargets: {
        "iron-frogs": 1320,
        "void-hoppers": 1240,
        "ember-toads": 1090,
        "relay-crew": 1010
      },
      nodeTargets: [
        { nodeId: "gate-alpha", fillRatio: 0.42 },
        { nodeId: "ssu-beta", fillRatio: 0.74 },
        { nodeId: "turret-gamma", fillRatio: 0.16 }
      ],
      feedBursts: [
        {
          id: "burst-04",
          atSec: 4,
          teamId: "iron-frogs",
          message: "IRON FROGS // MIRA injected Gate-Alpha +140 pts",
          summary: "MIRA / GATE-ALPHA +140",
          kind: "score",
          scoreDelta: 140
        },
        {
          id: "burst-08",
          atSec: 8,
          teamId: "relay-crew",
          message: "RELAY CREW // ORIN secured relay route +70 pts",
          summary: "ORIN / RELAY ROUTE +70",
          kind: "score",
          scoreDelta: 70
        }
      ]
    },
    {
      startSec: 10,
      endSec: 25,
      scoreTargets: {
        "iron-frogs": 1540,
        "void-hoppers": 1520,
        "ember-toads": 1260,
        "relay-crew": 1130
      },
      nodeTargets: [
        { nodeId: "gate-alpha", fillRatio: 0.48 },
        { nodeId: "ssu-beta", fillRatio: 0.84 },
        { nodeId: "turret-gamma", fillRatio: 0.15 }
      ],
      feedBursts: [
        {
          id: "burst-13",
          atSec: 13,
          teamId: "void-hoppers",
          message: "VOID HOPPERS // SETH stabilized SSU-Beta +180 pts",
          summary: "SETH / SSU-BETA +180",
          kind: "score",
          scoreDelta: 180
        },
        {
          id: "burst-18",
          atSec: 18,
          teamId: "iron-frogs",
          message: "IRON FROGS // HOLT secured convoy lane +120 pts",
          summary: "HOLT / CONVOY LANE +120",
          kind: "score",
          scoreDelta: 120
        },
        {
          id: "burst-22",
          atSec: 22,
          teamId: "void-hoppers",
          message: "VOID HOPPERS // SETH stabilized SSU-Beta +150 pts",
          summary: "SETH / STABILIZE +150",
          kind: "score",
          scoreDelta: 150
        }
      ]
    },
    {
      startSec: 25,
      endSec: 32,
      scoreTargets: {
        "iron-frogs": 1640,
        "void-hoppers": 1610,
        "ember-toads": 1500,
        "relay-crew": 1200
      },
      nodeTargets: [
        { nodeId: "gate-alpha", fillRatio: 0.51 },
        { nodeId: "ssu-beta", fillRatio: 0.82 },
        { nodeId: "turret-gamma", fillRatio: 0.12 }
      ],
      feedBursts: [
        {
          id: "burst-28",
          atSec: 28,
          teamId: null,
          message: "SYSTEM // Turret-Gamma dropped into CRITICAL window",
          summary: "TURRET-GAMMA CRITICAL",
          kind: "system"
        },
        {
          id: "burst-31",
          atSec: 31,
          teamId: "ember-toads",
          message: "EMBER TOADS // KIRO triggered critical refill +210 pts",
          summary: "KIRO / CRITICAL REFILL +210",
          kind: "score",
          scoreDelta: 210
        }
      ]
    },
    {
      startSec: 32,
      endSec: 40,
      scoreTargets: {
        "iron-frogs": 1760,
        "void-hoppers": 1710,
        "ember-toads": 1810,
        "relay-crew": 1280
      },
      nodeTargets: [
        { nodeId: "gate-alpha", fillRatio: 0.54 },
        { nodeId: "ssu-beta", fillRatio: 0.86 },
        { nodeId: "turret-gamma", fillRatio: 0.24 }
      ],
      feedBursts: [
        {
          id: "burst-36",
          atSec: 36,
          teamId: "ember-toads",
          message: "EMBER TOADS // KIRO triggered critical refill +320 pts",
          summary: "KIRO / GAMMA +320",
          kind: "score",
          scoreDelta: 320
        }
      ]
    },
    {
      startSec: 40,
      endSec: 50,
      scoreTargets: {
        "iron-frogs": 2100,
        "void-hoppers": 1980,
        "ember-toads": 2140,
        "relay-crew": 1490
      },
      nodeTargets: [
        { nodeId: "gate-alpha", fillRatio: 0.62 },
        { nodeId: "ssu-beta", fillRatio: 0.9 },
        { nodeId: "turret-gamma", fillRatio: 0.36 }
      ],
      feedBursts: [
        {
          id: "burst-40",
          atSec: 40,
          teamId: null,
          message: "PANIC MODE ACTIVE // ALL SCORE x1.5",
          summary: "PANIC MODE ACTIVE",
          kind: "panic"
        },
        {
          id: "burst-44",
          atSec: 44,
          teamId: "void-hoppers",
          message: "VOID HOPPERS // SETH pushed convoy delta +170 pts",
          summary: "SETH / CONVOY DELTA +170",
          kind: "score",
          scoreDelta: 170
        },
        {
          id: "burst-47",
          atSec: 47,
          teamId: "ember-toads",
          message: "EMBER TOADS // KIRO panic siphon +330 pts",
          summary: "KIRO / PANIC SIPHON +330",
          kind: "score",
          scoreDelta: 330
        }
      ]
    },
    {
      startSec: 50,
      endSec: 60,
      scoreTargets: {
        "iron-frogs": 2380,
        "void-hoppers": 2210,
        "ember-toads": 2310,
        "relay-crew": 1660
      },
      nodeTargets: [
        { nodeId: "gate-alpha", fillRatio: 0.68 },
        { nodeId: "ssu-beta", fillRatio: 0.94 },
        { nodeId: "turret-gamma", fillRatio: 0.48 }
      ],
      feedBursts: [
        {
          id: "burst-53",
          atSec: 53,
          teamId: "iron-frogs",
          message: "IRON FROGS // HOLT stabilized formation +190 pts",
          summary: "HOLT / FORMATION +190",
          kind: "score",
          scoreDelta: 190
        },
        {
          id: "burst-58",
          atSec: 58,
          teamId: "iron-frogs",
          message: "IRON FROGS // FINAL PUSH +280 pts",
          summary: "FINAL PUSH +280",
          kind: "score",
          scoreDelta: 280
        }
      ]
    }
  ]
};

export function buildDemoReplayFrame(
  scenario: DemoReplayScenario,
  playbackSec: number
): DemoReplayFrame {
  const clampedSec = clamp(playbackSec, 0, scenario.loopSec);
  const segmentIndex = resolveSegmentIndex(scenario, clampedSec);
  const teams = buildTeams(scenario, clampedSec, segmentIndex === -1 ? scenario.segments.length - 1 : segmentIndex);
  const targetNodes = buildNodes(scenario, clampedSec, segmentIndex === -1 ? scenario.segments.length - 1 : segmentIndex);
  const status = resolveStatus(clampedSec, scenario.loopSec);

  return {
    status,
    remainingSec: Math.max(0, Math.ceil(scenario.loopSec - clampedSec)),
    isPanic: status === "panic",
    roomId: scenario.roomId,
    simulationLabel: SIMULATION_LABEL,
    teams,
    targetNodes,
    feed: listVisibleBursts(scenario, clampedSec).slice(0, 8)
  };
}

export function listMatchDemoOutcomeTeams(
  scenario: DemoReplayScenario = DEFAULT_MATCH_DEMO_REPLAY_SCENARIO
): DemoReplayOutcomeTeam[] {
  const finalScoreTargets = scenario.segments.at(-1)?.scoreTargets ?? {};

  return scenario.teams
    .map<DemoReplayOutcomeTeam>((team) => ({
      ...team,
      finalScore: finalScoreTargets[team.teamId] ?? team.startScore,
      finalRank: 0
    }))
    .sort((left, right) => right.finalScore - left.finalScore)
    .map((team, index) => ({
      ...team,
      finalRank: index + 1
    }));
}
