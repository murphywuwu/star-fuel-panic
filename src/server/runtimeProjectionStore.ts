import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync
} from "node:fs";
import path from "node:path";

import type { FuelGrade } from "../types/fuelGrade.ts";
import type { Match, MatchStreamEvent } from "../types/match.ts";
import type { NetworkNode } from "../types/node.ts";
import type { PlanningTeam, PlanningTeamApplication } from "../types/planningTeam.ts";
import type { SettlementBill, SettlementStatus } from "../types/settlement.ts";
import type { SolarSystem } from "../types/solarSystem.ts";
import type { PlayerRole, Team, TeamApplication, TeamMember } from "../types/team.ts";
import { resolveFuelGradeInfo } from "../utils/fuelGrade.ts";

export type ConstellationProjectionSummary = {
  constellationId: number;
  constellationName: string;
  regionId: number;
  systemCount: number;
  selectableSystemCount: number;
  urgentNodeCount: number;
  warningNodeCount: number;
  sortScore: number;
  updatedAt: string;
};

export type PersistedTeam = Team & {
  roleSlots:
    | PlayerRole[]
    | {
        collector: number;
        hauler: number;
        escort: number;
      };
  whitelistCount: number;
};

export type PersistedMatchScore = {
  matchId: string;
  teamId: string;
  walletAddress: string;
  totalScore: number;
  fuelDeposited: number;
  updatedAt: string;
};

export type PersistedFuelEvent = {
  matchId: string;
  eventId: string;
  txDigest: string;
  senderWallet: string;
  teamId: string;
  assemblyId: string;
  fuelAdded: number;
  fuelTypeId: number;
  fuelGrade: FuelGrade;
  fuelGradeBonus: number;
  urgencyWeight: number;
  panicMultiplier: number;
  scoreDelta: number;
  chainTs: number;
  createdAt: string;
};

export type PersistedMatchTargetNode = {
  matchId: string;
  nodeObjectId: string;
  capturedFillRatio: number;
  capturedUrgency: "critical" | "warning" | "safe";
  name: string;
  isOnline: boolean;
};

export type PersistedMatchStreamEvent = {
  matchId: string;
  eventType: MatchStreamEvent["type"] | string;
  payload: unknown;
  createdAt: string;
};

export type PersistedTeamPayment = {
  matchId: string;
  teamId: string;
  walletAddress: string;
  txDigest: string;
  amount: number;
  memberAddresses: string[];
  createdAt: string;
};

export type PersistedMatchWhitelist = {
  matchId: string;
  teamId: string;
  walletAddress: string;
  sourcePaymentTx: string;
  createdAt: string;
};

export type PersistedSettlement = {
  matchId: string;
  bill: SettlementBill;
  payoutTxDigest: string | null;
  updatedAt: string;
  status: SettlementStatus["status"];
};

export type PersistedIdempotencyRecord = {
  scope: string;
  key: string;
  requestHash: string;
  status: number;
  body: unknown;
  headers: Record<string, string>;
  createdAt: string;
};

export type WorkerHealthRecord = {
  worker: string;
  status: "starting" | "healthy" | "degraded" | "stopped";
  heartbeatAt: string;
  pid: number | null;
  restartCount: number;
  detail: string | null;
  lastError: string | null;
};

export type ProjectionRuntimeMeta = {
  nodes: {
    lastSyncAt: string | null;
    stale: boolean;
    reason: string | null;
  };
  solarSystems: {
    lastSyncAt: string | null;
    stale: boolean;
    reason: string | null;
  };
  constellations: {
    lastSyncAt: string | null;
    stale: boolean;
    reason: string | null;
  };
};

export type RuntimeProjectionState = {
  version: 1;
  updatedAt: string | null;
  meta: ProjectionRuntimeMeta;
  networkNodes: Array<Omit<NetworkNode, "activeMatchId">>;
  solarSystemsCache: SolarSystem[];
  constellationSummaries: ConstellationProjectionSummary[];
  matches: Match[];
  planningTeams: PlanningTeam[];
  planningTeamApplications: PlanningTeamApplication[];
  teams: PersistedTeam[];
  teamMembers: TeamMember[];
  teamJoinApplications: TeamApplication[];
  matchScores: PersistedMatchScore[];
  fuelEvents: PersistedFuelEvent[];
  matchTargetNodes: PersistedMatchTargetNode[];
  matchStreamEvents: PersistedMatchStreamEvent[];
  teamPayments: PersistedTeamPayment[];
  matchWhitelists: PersistedMatchWhitelist[];
  settlements: PersistedSettlement[];
  idempotencyKeys: PersistedIdempotencyRecord[];
  workerHealth: WorkerHealthRecord[];
};

const DEFAULT_PROJECTION_PATH = path.join(process.cwd(), "data", "runtime-projections.json");

type ProjectionStateCache = {
  filePath: string;
  mtimeMs: number;
  size: number;
  state: RuntimeProjectionState;
};

let projectionStateCache: ProjectionStateCache | null = null;

function resolveProjectionPath() {
  return process.env.RUNTIME_PROJECTION_STORE_PATH?.trim() || DEFAULT_PROJECTION_PATH;
}

function nowIso() {
  return new Date().toISOString();
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function normalizePersistedSettlement(candidate: unknown): PersistedSettlement | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const settlement = candidate as Partial<PersistedSettlement> & {
    settledAt?: string;
  };
  if (typeof settlement.matchId !== "string" || !settlement.matchId.trim() || !settlement.bill) {
    return null;
  }

  const status = settlement.status;
  if (status !== "pending" && status !== "running" && status !== "succeeded" && status !== "failed") {
    return null;
  }

  const updatedAt =
    typeof settlement.updatedAt === "string"
      ? settlement.updatedAt
      : typeof settlement.settledAt === "string"
        ? settlement.settledAt
        : nowIso();

  return {
    matchId: settlement.matchId,
    bill: clone(settlement.bill),
    payoutTxDigest: typeof settlement.payoutTxDigest === "string" ? settlement.payoutTxDigest : null,
    updatedAt,
    status
  };
}

function normalizePersistedFuelEvent(candidate: unknown): PersistedFuelEvent | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const record = candidate as Partial<PersistedFuelEvent> & {
    sender?: string;
    fuel_type_id?: number;
    fuel_grade?: FuelGrade;
    fuel_grade_bonus?: number;
    score?: number;
    fuel_added?: number;
  };

  const matchId = typeof record.matchId === "string" ? record.matchId : null;
  const txDigest = typeof record.txDigest === "string" ? record.txDigest : null;
  const senderWallet =
    typeof record.senderWallet === "string"
      ? record.senderWallet
      : typeof record.sender === "string"
        ? record.sender
        : null;
  const teamId = typeof record.teamId === "string" ? record.teamId : null;
  const assemblyId = typeof record.assemblyId === "string" ? record.assemblyId : null;

  if (!matchId || !txDigest || !senderWallet || !teamId || !assemblyId) {
    return null;
  }

  const fuelTypeId =
    typeof record.fuelTypeId === "number"
      ? record.fuelTypeId
      : typeof record.fuel_type_id === "number"
        ? record.fuel_type_id
        : 0;
  const defaultFuelGrade = resolveFuelGradeInfo(fuelTypeId, null);
  const fuelGrade =
    record.fuelGrade === "standard" || record.fuelGrade === "premium" || record.fuelGrade === "refined"
      ? record.fuelGrade
      : record.fuel_grade === "standard" || record.fuel_grade === "premium" || record.fuel_grade === "refined"
        ? record.fuel_grade
        : defaultFuelGrade.grade;

  return {
    matchId,
    eventId:
      typeof record.eventId === "string" && record.eventId.trim().length > 0
        ? record.eventId
        : txDigest,
    txDigest,
    senderWallet,
    teamId,
    assemblyId,
    fuelAdded:
      typeof record.fuelAdded === "number"
        ? record.fuelAdded
        : typeof record.fuel_added === "number"
          ? record.fuel_added
          : 0,
    fuelTypeId,
    fuelGrade,
    fuelGradeBonus:
      typeof record.fuelGradeBonus === "number"
        ? record.fuelGradeBonus
        : typeof record.fuel_grade_bonus === "number"
          ? record.fuel_grade_bonus
          : defaultFuelGrade.bonus,
    urgencyWeight: typeof record.urgencyWeight === "number" ? record.urgencyWeight : 1,
    panicMultiplier: typeof record.panicMultiplier === "number" ? record.panicMultiplier : 1,
    scoreDelta:
      typeof record.scoreDelta === "number"
        ? record.scoreDelta
        : typeof record.score === "number"
          ? record.score
          : 0,
    chainTs: typeof record.chainTs === "number" ? record.chainTs : Date.now(),
    createdAt: typeof record.createdAt === "string" ? record.createdAt : nowIso()
  };
}

function createDefaultMeta(): ProjectionRuntimeMeta {
  return {
    nodes: {
      lastSyncAt: null,
      stale: false,
      reason: null
    },
    solarSystems: {
      lastSyncAt: null,
      stale: false,
      reason: null
    },
    constellations: {
      lastSyncAt: null,
      stale: false,
      reason: null
    }
  };
}

export function createEmptyProjectionState(): RuntimeProjectionState {
  return {
    version: 1,
    updatedAt: null,
    meta: createDefaultMeta(),
    networkNodes: [],
    solarSystemsCache: [],
    constellationSummaries: [],
    matches: [],
    planningTeams: [],
    planningTeamApplications: [],
    teams: [],
    teamMembers: [],
    teamJoinApplications: [],
    matchScores: [],
    fuelEvents: [],
    matchTargetNodes: [],
    matchStreamEvents: [],
    teamPayments: [],
    matchWhitelists: [],
    settlements: [],
    idempotencyKeys: [],
    workerHealth: []
  };
}

function sanitizeProjectionState(candidate: unknown): RuntimeProjectionState {
  if (!candidate || typeof candidate !== "object") {
    return createEmptyProjectionState();
  }

  const value = candidate as Partial<RuntimeProjectionState>;
  if (value.version !== 1) {
    return createEmptyProjectionState();
  }

  const state = createEmptyProjectionState();

  state.updatedAt = typeof value.updatedAt === "string" ? value.updatedAt : null;
  state.meta = {
    nodes: {
      lastSyncAt: typeof value.meta?.nodes?.lastSyncAt === "string" ? value.meta.nodes.lastSyncAt : null,
      stale: Boolean(value.meta?.nodes?.stale),
      reason: typeof value.meta?.nodes?.reason === "string" ? value.meta.nodes.reason : null
    },
    solarSystems: {
      lastSyncAt:
        typeof value.meta?.solarSystems?.lastSyncAt === "string" ? value.meta.solarSystems.lastSyncAt : null,
      stale: Boolean(value.meta?.solarSystems?.stale),
      reason: typeof value.meta?.solarSystems?.reason === "string" ? value.meta.solarSystems.reason : null
    },
    constellations: {
      lastSyncAt:
        typeof value.meta?.constellations?.lastSyncAt === "string" ? value.meta.constellations.lastSyncAt : null,
      stale: Boolean(value.meta?.constellations?.stale),
      reason: typeof value.meta?.constellations?.reason === "string" ? value.meta.constellations.reason : null
    }
  };

  state.networkNodes = Array.isArray(value.networkNodes) ? clone(value.networkNodes) : [];
  state.solarSystemsCache = Array.isArray(value.solarSystemsCache) ? clone(value.solarSystemsCache) : [];
  state.constellationSummaries = Array.isArray(value.constellationSummaries)
    ? clone(value.constellationSummaries)
    : [];
  state.matches = Array.isArray(value.matches) ? clone(value.matches) : [];
  state.planningTeams = Array.isArray(value.planningTeams) ? clone(value.planningTeams) : [];
  state.planningTeamApplications = Array.isArray(value.planningTeamApplications)
    ? clone(value.planningTeamApplications)
    : [];
  state.teams = Array.isArray(value.teams) ? clone(value.teams) : [];
  state.teamMembers = Array.isArray(value.teamMembers) ? clone(value.teamMembers) : [];
  state.teamJoinApplications = Array.isArray(value.teamJoinApplications) ? clone(value.teamJoinApplications) : [];
  state.matchScores = Array.isArray(value.matchScores) ? clone(value.matchScores) : [];
  state.fuelEvents = Array.isArray(value.fuelEvents)
    ? value.fuelEvents
        .map((entry) => normalizePersistedFuelEvent(entry))
        .filter((entry): entry is PersistedFuelEvent => entry !== null)
    : [];
  state.matchTargetNodes = Array.isArray(value.matchTargetNodes) ? clone(value.matchTargetNodes) : [];
  state.matchStreamEvents = Array.isArray(value.matchStreamEvents) ? clone(value.matchStreamEvents) : [];
  state.teamPayments = Array.isArray(value.teamPayments) ? clone(value.teamPayments) : [];
  state.matchWhitelists = Array.isArray(value.matchWhitelists) ? clone(value.matchWhitelists) : [];
  state.settlements = Array.isArray(value.settlements)
    ? value.settlements
        .map((settlement) => normalizePersistedSettlement(settlement))
        .filter((settlement): settlement is PersistedSettlement => settlement !== null)
    : [];
  state.idempotencyKeys = Array.isArray(value.idempotencyKeys) ? clone(value.idempotencyKeys) : [];
  state.workerHealth = Array.isArray(value.workerHealth) ? clone(value.workerHealth) : [];

  return state;
}

function getRuntimeProjectionState(): RuntimeProjectionState {
  const filePath = resolveProjectionPath();
  if (!existsSync(filePath)) {
    projectionStateCache = null;
    return createEmptyProjectionState();
  }

  try {
    const stat = statSync(filePath);
    if (
      projectionStateCache &&
      projectionStateCache.filePath === filePath &&
      projectionStateCache.mtimeMs === stat.mtimeMs &&
      projectionStateCache.size === stat.size
    ) {
      return projectionStateCache.state;
    }

    const raw = readFileSync(filePath, "utf8");
    const state = sanitizeProjectionState(JSON.parse(raw));
    projectionStateCache = {
      filePath,
      mtimeMs: stat.mtimeMs,
      size: stat.size,
      state
    };
    return state;
  } catch {
    projectionStateCache = null;
    return createEmptyProjectionState();
  }
}

export function readRuntimeProjectionState(): RuntimeProjectionState {
  return clone(getRuntimeProjectionState());
}

export function writeRuntimeProjectionState(state: RuntimeProjectionState) {
  const filePath = resolveProjectionPath();
  mkdirSync(path.dirname(filePath), { recursive: true });

  const nextState = clone({
    ...state,
    version: 1 as const,
    updatedAt: nowIso()
  });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  writeFileSync(tempPath, JSON.stringify(nextState, null, 2), "utf8");
  renameSync(tempPath, filePath);
  const stat = statSync(filePath);
  projectionStateCache = {
    filePath,
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    state: nextState
  };
}

export function updateRuntimeProjectionState<T>(mutate: (state: RuntimeProjectionState) => T): T {
  const state = clone(getRuntimeProjectionState());
  const result = mutate(state);
  writeRuntimeProjectionState(state);
  return result;
}

export function getProjectionRuntimeMeta() {
  return clone(getRuntimeProjectionState().meta);
}

export function updateProjectionRuntimeMeta(
  key: keyof ProjectionRuntimeMeta,
  patch: Partial<ProjectionRuntimeMeta[keyof ProjectionRuntimeMeta]>
) {
  updateRuntimeProjectionState((state) => {
    state.meta[key] = {
      ...state.meta[key],
      ...patch
    };
  });
}

export function readPersistedNetworkNodes() {
  return clone(getRuntimeProjectionState().networkNodes);
}

export function writePersistedNetworkNodes(nodes: Array<Omit<NetworkNode, "activeMatchId">>) {
  updateRuntimeProjectionState((state) => {
    state.networkNodes = clone(nodes);
  });
}

export function readPersistedSolarSystems() {
  return clone(getRuntimeProjectionState().solarSystemsCache);
}

export function writePersistedSolarSystems(systems: SolarSystem[]) {
  updateRuntimeProjectionState((state) => {
    state.solarSystemsCache = clone(systems);
  });
}

export function readPersistedConstellationSummaries() {
  return clone(getRuntimeProjectionState().constellationSummaries);
}

export function writePersistedConstellationSummaries(summaries: ConstellationProjectionSummary[]) {
  updateRuntimeProjectionState((state) => {
    state.constellationSummaries = clone(summaries);
  });
}

export function listPersistedMatches() {
  return clone(getRuntimeProjectionState().matches);
}

export function listPersistedPlanningTeams() {
  return clone(getRuntimeProjectionState().planningTeams);
}

export function listPersistedPlanningTeamApplications(teamId?: string) {
  const rows = getRuntimeProjectionState().planningTeamApplications;
  return clone(typeof teamId === "string" ? rows.filter((row) => row.teamId === teamId) : rows);
}

export function writePersistedPlanningTeams(teams: PlanningTeam[]) {
  updateRuntimeProjectionState((state) => {
    state.planningTeams = clone(teams);
  });
}

export function writePersistedPlanningTeamApplications(applications: PlanningTeamApplication[]) {
  updateRuntimeProjectionState((state) => {
    state.planningTeamApplications = clone(applications);
  });
}

export function upsertPersistedPlanningTeam(team: PlanningTeam) {
  updateRuntimeProjectionState((state) => {
    const existing = state.planningTeams.filter((item) => item.id !== team.id);
    state.planningTeams = [clone(team), ...existing];
  });
}

export function upsertPersistedPlanningTeamApplication(application: PlanningTeamApplication) {
  updateRuntimeProjectionState((state) => {
    const existing = state.planningTeamApplications.filter((item) => item.id !== application.id);
    state.planningTeamApplications = [clone(application), ...existing];
  });
}

export function removePersistedPlanningTeam(teamId: string) {
  updateRuntimeProjectionState((state) => {
    state.planningTeams = state.planningTeams.filter((team) => team.id !== teamId);
    state.planningTeamApplications = state.planningTeamApplications.filter((application) => application.teamId !== teamId);
  });
}

export function getPersistedMatch(matchId: string) {
  const state = getRuntimeProjectionState();
  return clone(state.matches.find((match) => match.id === matchId) ?? null);
}

export function listPersistedTeams(matchId?: string) {
  const teams = getRuntimeProjectionState().teams;
  return clone(typeof matchId === "string" ? teams.filter((team) => team.matchId === matchId) : teams);
}

export function listPersistedTeamMembers(matchId?: string) {
  const state = getRuntimeProjectionState();
  if (typeof matchId !== "string") {
    return clone(state.teamMembers);
  }

  const teamIds = new Set(state.teams.filter((team) => team.matchId === matchId).map((team) => team.id));
  return clone(state.teamMembers.filter((member) => teamIds.has(member.teamId)));
}

export function listPersistedTeamApplications(matchId?: string) {
  const state = getRuntimeProjectionState();
  if (typeof matchId !== "string") {
    return clone(state.teamJoinApplications);
  }

  const teamIds = new Set(state.teams.filter((team) => team.matchId === matchId).map((team) => team.id));
  return clone(state.teamJoinApplications.filter((application) => teamIds.has(application.teamId)));
}

export function listPersistedMatchScores(matchId?: string) {
  const scores = getRuntimeProjectionState().matchScores;
  return clone(typeof matchId === "string" ? scores.filter((score) => score.matchId === matchId) : scores);
}

export function listPersistedFuelEvents(matchId?: string) {
  const rows = getRuntimeProjectionState().fuelEvents;
  return clone(typeof matchId === "string" ? rows.filter((row) => row.matchId === matchId) : rows);
}

export function listPersistedMatchStreamEvents(matchId?: string) {
  const events = getRuntimeProjectionState().matchStreamEvents;
  return clone(typeof matchId === "string" ? events.filter((event) => event.matchId === matchId) : events);
}

export function listPersistedMatchTargetNodes(matchId?: string) {
  const rows = getRuntimeProjectionState().matchTargetNodes;
  return clone(typeof matchId === "string" ? rows.filter((row) => row.matchId === matchId) : rows);
}

export function listPersistedTeamPayments(matchId?: string) {
  const rows = getRuntimeProjectionState().teamPayments;
  return clone(typeof matchId === "string" ? rows.filter((row) => row.matchId === matchId) : rows);
}

export function listPersistedMatchWhitelists(matchId?: string) {
  const rows = getRuntimeProjectionState().matchWhitelists;
  return clone(typeof matchId === "string" ? rows.filter((row) => row.matchId === matchId) : rows);
}

export function getPersistedSettlement(matchId: string) {
  const state = getRuntimeProjectionState();
  return clone(state.settlements.find((settlement) => settlement.matchId === matchId) ?? null);
}

export function getPersistedMatchDetail(matchId: string) {
  const state = getRuntimeProjectionState();
  const match = state.matches.find((candidate) => candidate.id === matchId);
  if (!match) {
    return null;
  }

  const teams = state.teams.filter((team) => team.matchId === matchId);
  const teamIds = new Set(teams.map((team) => team.id));

  return clone({
    match,
    teams,
    members: state.teamMembers.filter((member) => teamIds.has(member.teamId)),
    applications: state.teamJoinApplications.filter((application) => teamIds.has(application.teamId)),
    scores: state.matchScores.filter((score) => score.matchId === matchId),
    fuelEvents: state.fuelEvents.filter((event) => event.matchId === matchId),
    targetNodes: state.matchTargetNodes.filter((row) => row.matchId === matchId),
    streamEvents: state.matchStreamEvents.filter((row) => row.matchId === matchId),
    teamPayments: state.teamPayments.filter((row) => row.matchId === matchId),
    whitelists: state.matchWhitelists.filter((row) => row.matchId === matchId),
    settlement: state.settlements.find((settlement) => settlement.matchId === matchId) ?? null
  });
}

export function upsertPersistedMatch(match: Match) {
  updateRuntimeProjectionState((state) => {
    state.matches = [...state.matches.filter((candidate) => candidate.id !== match.id), clone(match)];
  });
}

export function savePersistedMatchDetail(input: {
  match: Match;
  teams: PersistedTeam[];
  members: TeamMember[];
  applications?: TeamApplication[];
  scores?: PersistedMatchScore[];
  targetNodes?: PersistedMatchTargetNode[];
  streamEvents?: PersistedMatchStreamEvent[];
  teamPayments?: PersistedTeamPayment[];
  whitelists?: PersistedMatchWhitelist[];
}) {
  updateRuntimeProjectionState((state) => {
    state.matches = [...state.matches.filter((candidate) => candidate.id !== input.match.id), clone(input.match)];
    state.teams = [
      ...state.teams.filter((team) => team.matchId !== input.match.id),
      ...clone(input.teams)
    ];

    const teamIds = new Set(input.teams.map((team) => team.id));
    state.teamMembers = [
      ...state.teamMembers.filter((member) => !teamIds.has(member.teamId)),
      ...clone(input.members)
    ];

    if (input.applications) {
      state.teamJoinApplications = [
        ...state.teamJoinApplications.filter((application) => !teamIds.has(application.teamId)),
        ...clone(input.applications)
      ];
    }

    if (input.scores) {
      state.matchScores = [
        ...state.matchScores.filter((score) => score.matchId !== input.match.id),
        ...clone(input.scores)
      ];
    }

    if (input.targetNodes) {
      state.matchTargetNodes = [
        ...state.matchTargetNodes.filter((row) => row.matchId !== input.match.id),
        ...clone(input.targetNodes)
      ];
    }

    if (input.streamEvents) {
      state.matchStreamEvents = [
        ...state.matchStreamEvents.filter((row) => row.matchId !== input.match.id),
        ...clone(input.streamEvents)
      ];
    }

    if (input.teamPayments) {
      state.teamPayments = [
        ...state.teamPayments.filter((row) => row.matchId !== input.match.id),
        ...clone(input.teamPayments)
      ];
    }

    if (input.whitelists) {
      state.matchWhitelists = [
        ...state.matchWhitelists.filter((row) => row.matchId !== input.match.id),
        ...clone(input.whitelists)
      ];
    }
  });
}

export function appendPersistedMatchStreamEvents(events: PersistedMatchStreamEvent[]) {
  if (events.length === 0) {
    return;
  }

  updateRuntimeProjectionState((state) => {
    state.matchStreamEvents.push(...clone(events));
  });
}

export function appendPersistedFuelEvents(events: PersistedFuelEvent[]) {
  if (events.length === 0) {
    return;
  }

  updateRuntimeProjectionState((state) => {
    const seen = new Set(state.fuelEvents.map((event) => `${event.matchId}:${event.txDigest}:${event.eventId}`));
    for (const event of clone(events)) {
      const key = `${event.matchId}:${event.txDigest}:${event.eventId}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      state.fuelEvents.push(event);
    }
  });
}

export function savePersistedTeamState(
  matchId: string,
  teams: PersistedTeam[],
  members: TeamMember[],
  applications?: TeamApplication[],
  teamPayments?: PersistedTeamPayment[],
  whitelists?: PersistedMatchWhitelist[]
) {
  updateRuntimeProjectionState((state) => {
    const teamIds = new Set(teams.map((team) => team.id));
    state.teams = [...state.teams.filter((team) => team.matchId !== matchId), ...clone(teams)];
    state.teamMembers = [
      ...state.teamMembers.filter((member) => !teamIds.has(member.teamId)),
      ...clone(members)
    ];

    if (applications) {
      state.teamJoinApplications = [
        ...state.teamJoinApplications.filter((application) => !teamIds.has(application.teamId)),
        ...clone(applications)
      ];
    }

    if (teamPayments) {
      state.teamPayments = [
        ...state.teamPayments.filter((row) => row.matchId !== matchId),
        ...clone(teamPayments)
      ];
    }

    if (whitelists) {
      state.matchWhitelists = [
        ...state.matchWhitelists.filter((row) => row.matchId !== matchId),
        ...clone(whitelists)
      ];
    }
  });
}

export function savePersistedSettlement(settlement: PersistedSettlement) {
  updateRuntimeProjectionState((state) => {
    state.settlements = [
      ...state.settlements.filter((row) => row.matchId !== settlement.matchId),
      clone(settlement)
    ];
  });
}

export function deletePersistedMatch(matchId: string) {
  updateRuntimeProjectionState((state) => {
    const teamIds = new Set(state.teams.filter((team) => team.matchId === matchId).map((team) => team.id));
    state.matches = state.matches.filter((match) => match.id !== matchId);
    state.teams = state.teams.filter((team) => team.matchId !== matchId);
    state.teamMembers = state.teamMembers.filter((member) => !teamIds.has(member.teamId));
    state.teamJoinApplications = state.teamJoinApplications.filter((application) => !teamIds.has(application.teamId));
    state.matchScores = state.matchScores.filter((score) => score.matchId !== matchId);
    state.fuelEvents = state.fuelEvents.filter((event) => event.matchId !== matchId);
    state.matchTargetNodes = state.matchTargetNodes.filter((row) => row.matchId !== matchId);
    state.matchStreamEvents = state.matchStreamEvents.filter((row) => row.matchId !== matchId);
    state.teamPayments = state.teamPayments.filter((row) => row.matchId !== matchId);
    state.matchWhitelists = state.matchWhitelists.filter((row) => row.matchId !== matchId);
    state.settlements = state.settlements.filter((row) => row.matchId !== matchId);
  });
}

export function getPersistedIdempotencyRecord(scope: string, key: string) {
  const state = getRuntimeProjectionState();
  return clone(
    state.idempotencyKeys.find((record) => record.scope === scope && record.key === key) ?? null
  );
}

export function putPersistedIdempotencyRecord(record: PersistedIdempotencyRecord) {
  updateRuntimeProjectionState((state) => {
    state.idempotencyKeys = [
      ...state.idempotencyKeys.filter(
        (candidate) => !(candidate.scope === record.scope && candidate.key === record.key)
      ),
      clone(record)
    ];
  });
}

export function upsertWorkerHealth(record: WorkerHealthRecord) {
  updateRuntimeProjectionState((state) => {
    state.workerHealth = [
      ...state.workerHealth.filter((candidate) => candidate.worker !== record.worker),
      clone(record)
    ].sort((left, right) => left.worker.localeCompare(right.worker));
  });
}

export function listWorkerHealth() {
  return clone(getRuntimeProjectionState().workerHealth).sort((left, right) =>
    left.worker.localeCompare(right.worker)
  );
}

export function resolveRuntimeProjectionPath() {
  return resolveProjectionPath();
}
