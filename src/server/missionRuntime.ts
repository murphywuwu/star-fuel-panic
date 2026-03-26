import type { Mission, MissionFilters } from "../types/mission.ts";

const URGENCY_WEIGHT: Record<Mission["urgency"], number> = {
  critical: 3,
  warning: 2,
  safe: 1
};

const SEED_MISSIONS: Mission[] = [
  {
    id: "mission-ssu-7",
    assemblyId: "0x8a7f4b11",
    nodeName: "SSU-Frontier-7",
    fillRatio: 0.12,
    urgency: "critical",
    prizePool: 1200,
    entryFee: 100,
    minTeams: 1,
    maxTeams: 10,
    minPlayers: 3,
    registeredTeams: 3,
    paidTeams: 2,
    participatingTeams: ["Aster Wolves", "Signal Reavers", "Anchorline"],
    countdownSec: 154,
    startRuleMode: "full_paid",
    forceStartSec: 180,
    status: "open",
    createdAt: "2026-03-21T00:12:00.000Z"
  },
  {
    id: "mission-gate-12",
    assemblyId: "0x6ea02c75",
    nodeName: "Gate-12",
    fillRatio: 0.36,
    urgency: "warning",
    prizePool: 780,
    entryFee: 80,
    minTeams: 1,
    maxTeams: 6,
    minPlayers: 3,
    registeredTeams: 2,
    paidTeams: 1,
    participatingTeams: ["Pioneer Cartel", "North Hook"],
    countdownSec: 214,
    startRuleMode: "min_team_force_start",
    forceStartSec: 180,
    status: "open",
    createdAt: "2026-03-21T00:18:00.000Z"
  },
  {
    id: "mission-peri-4",
    assemblyId: "0x918de320",
    nodeName: "Perimeter-4",
    fillRatio: 0.21,
    urgency: "critical",
    prizePool: 980,
    entryFee: 90,
    minTeams: 2,
    maxTeams: 16,
    minPlayers: 3,
    registeredTeams: 5,
    paidTeams: 4,
    participatingTeams: ["Trawl Union", "Night Lift", "G-Null", "Ironway", "Wisp"],
    countdownSec: 88,
    startRuleMode: "full_paid",
    forceStartSec: 240,
    status: "open",
    createdAt: "2026-03-21T00:06:00.000Z"
  },
  {
    id: "mission-orbit-9",
    assemblyId: "0x57c09f8e",
    nodeName: "Orbit-9",
    fillRatio: 0.58,
    urgency: "safe",
    prizePool: 360,
    entryFee: 50,
    minTeams: 1,
    maxTeams: 4,
    minPlayers: 3,
    registeredTeams: 1,
    paidTeams: 1,
    participatingTeams: ["LineRunner"],
    countdownSec: null,
    startRuleMode: "min_team_force_start",
    forceStartSec: 180,
    status: "open",
    createdAt: "2026-03-21T00:23:00.000Z"
  },
  {
    id: "mission-kite-2",
    assemblyId: "0x6fa31c50",
    nodeName: "Kite-Lane-2",
    fillRatio: 0.44,
    urgency: "warning",
    prizePool: 520,
    entryFee: 70,
    minTeams: 1,
    maxTeams: 8,
    minPlayers: 3,
    registeredTeams: 4,
    paidTeams: 2,
    participatingTeams: ["Blue Fork", "Orchid Rush", "Twelve Port", "Quarry"],
    countdownSec: 300,
    startRuleMode: "min_team_force_start",
    forceStartSec: 180,
    status: "open",
    createdAt: "2026-03-21T00:09:00.000Z"
  }
];

let missions: Mission[] = SEED_MISSIONS.map((mission) => ({ ...mission }));
let lastTickMs = Date.now();

function weightedScore(mission: Mission) {
  return mission.prizePool * URGENCY_WEIGHT[mission.urgency];
}

function tickRuntime() {
  const now = Date.now();
  const elapsedSec = Math.floor((now - lastTickMs) / 1000);
  if (elapsedSec <= 0) {
    return;
  }
  lastTickMs = now;

  missions = missions.map((mission) => {
    if (mission.status !== "open") {
      return mission;
    }

    const urgencyBonus = URGENCY_WEIGHT[mission.urgency];
    const nextPrizePool = mission.prizePool + elapsedSec * urgencyBonus;

    if (mission.countdownSec === null) {
      return {
        ...mission,
        prizePool: nextPrizePool
      };
    }

    const nextCountdown = Math.max(0, mission.countdownSec - elapsedSec);
    const missionWindow = Math.max(1, mission.forceStartSec);
    const joinProgress = 1 - nextCountdown / missionWindow;
    const projectedTeams = Math.min(
      mission.maxTeams,
      Math.max(mission.registeredTeams, Math.floor(joinProgress * mission.maxTeams))
    );

    const projectedPaid = Math.min(projectedTeams, Math.max(mission.paidTeams, Math.floor(projectedTeams * 0.75)));

    return {
      ...mission,
      prizePool: nextPrizePool,
      countdownSec: nextCountdown,
      registeredTeams: projectedTeams,
      paidTeams: projectedPaid
    };
  });
}

function applyFilters(list: Mission[], filters: MissionFilters = {}) {
  const filtered = list.filter((mission) => {
    if (filters.status && mission.status !== filters.status) {
      return false;
    }
    if (filters.urgency && mission.urgency !== filters.urgency) {
      return false;
    }
    return true;
  });

  const sortBy = filters.sortBy ?? "weighted";
  filtered.sort((a, b) => {
    if (sortBy === "created_at") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "urgency") {
      return URGENCY_WEIGHT[b.urgency] - URGENCY_WEIGHT[a.urgency] || b.prizePool - a.prizePool;
    }
    if (sortBy === "prize_pool") {
      return b.prizePool - a.prizePool;
    }
    return weightedScore(b) - weightedScore(a);
  });

  if (typeof filters.limit === "number") {
    return filtered.slice(0, filters.limit);
  }

  return filtered;
}

export function listMissions(filters: MissionFilters = {}) {
  tickRuntime();
  return applyFilters(missions, filters).map((mission) => ({
    ...mission,
    participatingTeams: [...mission.participatingTeams]
  }));
}

export function getMissionById(missionId: string) {
  tickRuntime();
  const mission = missions.find((item) => item.id === missionId);
  if (!mission) {
    return null;
  }
  return {
    ...mission,
    participatingTeams: [...mission.participatingTeams]
  };
}

export function upsertMission(nextMission: Mission) {
  const index = missions.findIndex((mission) => mission.id === nextMission.id);
  if (index < 0) {
    missions = [...missions, nextMission];
    return;
  }

  missions = missions.map((mission) => (mission.id === nextMission.id ? nextMission : mission));
}

export function resetMissionRuntime() {
  missions = SEED_MISSIONS.map((mission) => ({ ...mission, participatingTeams: [...mission.participatingTeams] }));
  lastTickMs = Date.now();
}
