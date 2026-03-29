import { Buffer } from "node:buffer";
import type { MatchPublishedCommitment } from "./devnetChainRuntime.ts";
import { hydrateRuntimeProjectionFromBackendIfNeeded, persistMatchDetailToBackend } from "./matchBackendStore.ts";
import { getMissionById, listMissions } from "./missionRuntime.ts";
import { getNodeById, listNodes } from "./nodeRuntime.ts";
import { syncSettlementProjectionForTransition } from "./settlementRuntime.ts";
import {
  appendPersistedMatchStreamEvents,
  deletePersistedMatch,
  getPersistedMatchDetail,
  getPersistedSettlement,
  listPersistedMatchStreamEvents,
  listPersistedMatches,
  savePersistedMatchDetail,
  type PersistedMatchStreamEvent,
  type PersistedMatchScore,
  type PersistedTeam
} from "./runtimeProjectionStore.ts";
import type { ErrorCode } from "../types/common.ts";
import type { Mission, StartRuleMode } from "../types/mission.ts";
import type {
  Match,
  MatchCreationMode,
  MatchFilters,
  MatchScoreboardSnapshot,
  MatchStatus,
  MatchStreamEvent,
  TriggerMode
} from "../types/match.ts";
import type { PlayerRole, Team, TeamMember } from "../types/team.ts";

export type MatchScore = {
  matchId: string;
  teamId: string;
  walletAddress: string;
  totalScore: number;
  fuelDeposited: number;
  updatedAt: string;
};

export type MatchDetail = {
  match: Match;
  teams: Team[];
  members: TeamMember[];
  scores?: MatchScore[];
};

export type MatchStatusSnapshot = {
  status: MatchStatus;
  remainingSec: number | null;
  phase: "Lobby" | "PreStart" | "Running" | "Panic" | "Settling" | "Settled";
  isPanic: boolean;
};

export type MatchTimerSnapshot = {
  totalDuration: number;
  elapsed: number;
  remaining: number | null;
  serverTime: string;
};

type ScoreboardTargetNode = MatchScoreboardSnapshot["targetNodes"][number];

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { status: number; code: ErrorCode; message: string } };

type CreateDraftInput = {
  name?: string;
  mode: Extract<MatchCreationMode, "free" | "precision">;
  solarSystemId: number;
  targetNodeIds?: string[];
  sponsorshipFee: number;
  maxTeams: number;
  entryFee: number;
  durationHours: number;
  walletAddress: string;
  signature: string;
  message: string;
};

type PublishMatchInput = {
  matchId: string;
  publishTxDigest: string;
  publishCommitment?: MatchPublishedCommitment | null;
  idempotencyKey?: string;
  walletAddress: string;
  signature: string;
  message: string;
};

type CreateTeamInput = {
  teamName: string;
  maxSize: number;
  roleSlots: PlayerRole[];
  walletAddress: string;
  signature: string;
  message: string;
};

type JoinTeamInput = {
  role: PlayerRole;
  walletAddress: string;
  signature: string;
  message: string;
};

type LockTeamInput = {
  walletAddress: string;
  signature: string;
  message: string;
};

type PayTeamInput = {
  txDigest: string;
  txAmount?: number;
  walletAddress: string;
  signature: string;
  message: string;
};

type RefundTeamEntryInput = {
  teamId: string;
  walletAddress: string;
};

type RefundTeamEntryResult = ApiResult<{
  refundTxDigest: string;
  refundAmount: number;
  team: Team;
}>;

type BountyMutationResult =
  | {
      ok: true;
      match: { id: string; prizePool: number; status: string };
      updatedPrizePool: number;
      contribution: { walletAddress: string; bountyAmount: number; txDigest: string; createdAt: string };
    }
  | { ok: false; code: string; status: number; message: string };

const ROLE_ORDER: PlayerRole[] = ["collector", "hauler", "escort"];
const mutableMatchDetails = new Map<string, MatchDetail>();
const SEEDED_MATCH_SYSTEM_IDS: Record<string, number> = {
  "mission-ssu-7": 30000142,
  "mission-gate-12": 30000143,
  "mission-peri-4": 30000144,
  "mission-orbit-9": 30000145,
  "mission-kite-2": 30000146
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
}

function cloneDetail(detail: MatchDetail): MatchDetail {
  return {
    match: { ...detail.match, targetNodeIds: [...detail.match.targetNodeIds] },
    teams: detail.teams.map((team) => ({ ...team })),
    members: detail.members.map((member) => ({ ...member })),
    ...(detail.scores ? { scores: detail.scores.map((score) => ({ ...score })) } : {})
  };
}

function stripPersistedTeam(team: PersistedTeam): Team {
  return {
    id: team.id,
    matchId: team.matchId,
    name: team.name,
    captainAddress: team.captainAddress,
    maxSize: team.maxSize,
    isLocked: team.isLocked,
    hasPaid: team.hasPaid,
    payTxDigest: team.payTxDigest,
    totalScore: team.totalScore,
    rank: team.rank,
    prizeAmount: team.prizeAmount,
    status: team.status,
    createdAt: team.createdAt
  };
}

function toPersistedTeam(team: Team, detail: MatchDetail): PersistedTeam {
  const members = detail.members.filter((member) => member.teamId === team.id);
  return {
    ...team,
    roleSlots:
      members.length > 0
        ? members.map((member) => member.role)
        : ROLE_ORDER.slice(0, Math.min(team.maxSize, ROLE_ORDER.length)),
    whitelistCount: team.hasPaid ? members.length : 0
  };
}

function buildPersistedTargetNodes(match: Match) {
  return match.targetNodeIds.slice(0, 5).map((nodeObjectId) => ({
    matchId: match.id,
    nodeObjectId,
    capturedFillRatio: 0,
    capturedUrgency: "safe" as const,
    name: `Node ${nodeObjectId.slice(-6)}`,
    isOnline: true
  }));
}

function toPersistedStreamEvents(events: MatchStreamEvent[]): PersistedMatchStreamEvent[] {
  const createdAt = nowIso();
  return events.map((event) => {
    if (event.type === "settlement_start") {
      return {
        matchId: event.matchId,
        eventType: event.type,
        payload: {
          progress: event.progress
        },
        createdAt
      };
    }

    if (event.type === "settlement_complete") {
      return {
        matchId: event.matchId,
        eventType: event.type,
        payload: {
          result: event.result
        },
        createdAt
      };
    }

    return {
      matchId: event.matchId,
      eventType: event.type,
      payload: event,
      createdAt
    };
  });
}

export function getMatchStreamEventSignature(event: MatchStreamEvent) {
  if (event.type === "score_update") {
    return JSON.stringify({
      ...event,
      scoreboard: {
        ...event.scoreboard,
        updatedAt: "__normalized__"
      }
    });
  }

  if (event.type === "phase_change" || event.type === "panic_mode") {
    return JSON.stringify({
      ...event,
      status: {
        ...event.status,
        serverTime: "__normalized__"
      }
    });
  }

  return JSON.stringify(event);
}

function hydratePersistedStreamEvent(row: PersistedMatchStreamEvent): MatchStreamEvent | null {
  const payload = row.payload as Record<string, unknown> | null;

  switch (row.eventType) {
    case "score_update":
      if (!payload || !("scoreboard" in payload)) {
        return null;
      }
      return {
        type: "score_update",
        matchId: row.matchId,
        scoreboard: payload.scoreboard as MatchScoreboardSnapshot
      };
    case "phase_change":
    case "panic_mode":
      if (!payload || !("status" in payload)) {
        return null;
      }
      return {
        type: row.eventType,
        matchId: row.matchId,
        status: payload.status as {
          status: MatchStatus;
          remainingSeconds: number;
          panicMode: boolean;
          serverTime: string;
        }
      };
    case "node_status":
      if (!payload || !("targetNodes" in payload)) {
        return null;
      }
      return {
        type: "node_status",
        matchId: row.matchId,
        targetNodes: payload.targetNodes as MatchScoreboardSnapshot["targetNodes"]
      };
    case "settlement_start":
      return {
        type: "settlement_start",
        matchId: row.matchId,
        progress: Number(payload?.progress ?? 75)
      };
    case "settlement_complete":
      if (!payload || !("result" in payload)) {
        return null;
      }
      return {
        type: "settlement_complete",
        matchId: row.matchId,
        result: payload.result as import("../types/settlement.ts").SettlementBill
      };
    case "heartbeat":
      return {
        type: "heartbeat",
        matchId: row.matchId,
        serverTime: String(payload?.serverTime ?? row.createdAt)
      };
    default:
      return null;
  }
}

function fail<T>(status: number, code: ErrorCode, message: string): ApiResult<T> {
  return { ok: false, error: { status, code, message } };
}

function toMatchStatus(mission: Mission): MatchStatus {
  if (mission.status === "settled" || mission.status === "expired") return "settled";
  if (mission.status === "in_progress") return mission.countdownSec !== null && mission.countdownSec <= 90 ? "panic" : "running";
  if (mission.countdownSec !== null && mission.paidTeams >= mission.minTeams && mission.countdownSec <= 30) return "prestart";
  return "lobby";
}

function toTriggerMode(startRuleMode: StartRuleMode): TriggerMode {
  return startRuleMode === "full_paid" ? "dynamic" : "min_threshold";
}

function buildMatchFromMission(mission: Mission): Match {
  return {
    id: mission.id,
    onChainId: mission.assemblyId,
    status: toMatchStatus(mission),
    creationMode: "free",
    solarSystemId: SEEDED_MATCH_SYSTEM_IDS[mission.id] ?? 0,
    targetNodeIds: [],
    prizePool: mission.prizePool,
    hostPrizePool: 0,
    entryFee: mission.entryFee,
    minTeams: mission.minTeams,
    maxTeams: mission.maxTeams,
    durationMinutes: 10,
    scoringMode: "weighted",
    triggerMode: toTriggerMode(mission.startRuleMode),
    startedAt: mission.status === "in_progress" ? mission.createdAt : null,
    endedAt: mission.status === "settled" || mission.status === "expired" ? nowIso() : null,
    createdBy: "system",
    hostAddress: null,
    createdAt: mission.createdAt
  };
}

function seedWallet(matchId: string, teamIndex: number, memberIndex: number) {
  return `0x${matchId.replace(/[^a-z0-9]/gi, "").slice(0, 8)}${teamIndex.toString(16)}${memberIndex.toString(16)}`;
}

function buildSeedDetail(mission: Mission): MatchDetail {
  const match = buildMatchFromMission(mission);
  const teams: Team[] = mission.participatingTeams.slice(0, mission.registeredTeams).map((name, teamIndex) => ({
    id: `${match.id}_team_${teamIndex + 1}`,
    matchId: match.id,
    name,
    captainAddress: seedWallet(match.id, teamIndex + 1, 1),
    maxSize: mission.minPlayers,
    isLocked: true,
    hasPaid: teamIndex < mission.paidTeams,
    payTxDigest: teamIndex < mission.paidTeams ? `tx_${match.id}_${teamIndex + 1}` : null,
    totalScore: 0,
    rank: null,
    prizeAmount: null,
    status: teamIndex < mission.paidTeams ? "paid" : "locked",
    createdAt: new Date(Date.parse(match.createdAt) + teamIndex * 60_000).toISOString()
  }));

  const members: TeamMember[] = teams.flatMap((team, teamIndex) =>
    ROLE_ORDER.map((role, memberIndex) => ({
      id: `${team.id}_member_${memberIndex + 1}`,
      teamId: team.id,
      walletAddress: seedWallet(match.id, teamIndex + 1, memberIndex + 1),
      role,
      slotStatus: team.hasPaid ? "locked" : "confirmed",
      personalScore: Math.max(0, Math.round((match.prizePool - teamIndex * 90 - memberIndex * 35) / 10)),
      prizeAmount: null,
      joinedAt: new Date(Date.parse(team.createdAt) + memberIndex * 15_000).toISOString()
    }))
  );

  const scores: MatchScore[] = members.map((member) => ({
    matchId: match.id,
    teamId: member.teamId,
    walletAddress: member.walletAddress,
    totalScore: member.personalScore,
    fuelDeposited: Math.max(1, Math.round(member.personalScore / 2)),
    updatedAt: member.joinedAt
  }));

  for (const team of teams) {
    team.totalScore = members.filter((member) => member.teamId === team.id).reduce((sum, member) => sum + member.personalScore, 0);
  }

  [...teams].sort((a, b) => b.totalScore - a.totalScore).forEach((team, index) => {
    const target = teams.find((candidate) => candidate.id === team.id);
    if (target) target.rank = index + 1;
  });

  return {
    match,
    teams,
    members,
    ...(match.status === "running" || match.status === "panic" || match.status === "settling" || match.status === "settled" ? { scores } : {})
  };
}

function getDetail(matchId: string) {
  const persisted = mutableMatchDetails.get(matchId);
  if (persisted) return persisted;

  const projection = getPersistedMatchDetail(matchId);
  if (projection) {
    const detail: MatchDetail = {
      match: projection.match,
      teams: projection.teams.map(stripPersistedTeam),
      members: projection.members,
      ...(projection.scores.length > 0 ? { scores: projection.scores as MatchScore[] } : {})
    };
    mutableMatchDetails.set(matchId, detail);
    return detail;
  }

  const mission = getMissionById(matchId);
  if (!mission) return null;
  const detail = buildSeedDetail(mission);
  mutableMatchDetails.set(matchId, detail);
  savePersistedMatchDetail({
    match: detail.match,
    teams: detail.teams.map((team) => toPersistedTeam(team, detail)),
    members: detail.members,
    scores: (detail.scores ?? []) as PersistedMatchScore[],
    targetNodes: buildPersistedTargetNodes(detail.match)
  });
  return detail;
}

function persist(detail: MatchDetail) {
  const previousStatus =
    mutableMatchDetails.get(detail.match.id)?.match.status ?? getPersistedMatchDetail(detail.match.id)?.match.status ?? null;
  const cloned = cloneDetail(detail);
  mutableMatchDetails.set(cloned.match.id, cloned);
  savePersistedMatchDetail({
    match: cloned.match,
    teams: cloned.teams.map((team) => toPersistedTeam(team, cloned)),
    members: cloned.members,
    scores: (cloned.scores ?? []) as PersistedMatchScore[],
    targetNodes: buildPersistedTargetNodes(cloned.match)
  });

  const settlementTransition = syncSettlementProjectionForTransition(cloned, previousStatus);
  if (settlementTransition.streamEvents.length > 0) {
    appendPersistedMatchStreamEvents(toPersistedStreamEvents(settlementTransition.streamEvents));
  }
}

function roleCount(detail: MatchDetail, teamId: string, role: PlayerRole) {
  return detail.members.filter((member) => member.teamId === teamId && member.role === role).length;
}

function buildTestSignature(address: string, message: string) {
  return `test_sig:${normalizeAddress(address)}:${Buffer.from(message, "utf8").toString("base64url")}`;
}

function isSigned(address: string, signature: string, message: string, scope: string, targetId: string) {
  const normalized = normalizeAddress(address);
  return (
    Boolean(normalized) &&
    message.includes(`${scope}:${targetId}`) &&
    message.toLowerCase().includes(normalized) &&
    (signature.trim() === buildTestSignature(normalized, message) || signature.trim() === `dev:${normalized}:${message}` || signature.trim() === `dev:${normalized}`)
  );
}

function findDetailByTeamId(teamId: string) {
  for (const detail of listMatchDetails()) {
    if (detail.teams.some((team) => team.id === teamId)) return detail;
  }
  return null;
}

function phaseFor(status: MatchStatus): MatchStatusSnapshot["phase"] {
  if (status === "prestart") return "PreStart";
  if (status === "running") return "Running";
  if (status === "panic") return "Panic";
  if (status === "settling") return "Settling";
  if (status === "settled") return "Settled";
  return "Lobby";
}

export function createTestMatchSignature(address: string, message: string) {
  return buildTestSignature(address, message);
}

export function listMatches(filters: MatchFilters = {}) {
  const persistedMatches = listPersistedMatches();
  const baseMatches =
    persistedMatches.length > 0
      ? persistedMatches
      : listMissions().map((mission) => cloneDetail(getDetail(mission.id) ?? buildSeedDetail(mission)).match);
  const extraMatches = [...mutableMatchDetails.entries()]
    .filter(([matchId]) => !baseMatches.some((match) => match.id === matchId))
    .map(([, detail]) => cloneDetail(detail).match);

  const matches = [...baseMatches, ...extraMatches].filter((match) => {
    if (!filters.status && match.status === "draft") return false;
    if (filters.status && match.status !== filters.status) return false;
    if (filters.creationMode && match.creationMode !== filters.creationMode) return false;
    return true;
  });

  matches.sort((left, right) =>
    filters.sortBy === "created_at"
      ? Date.parse(right.createdAt) - Date.parse(left.createdAt)
      : (right.sponsorshipFee ?? right.prizePool) - (left.sponsorshipFee ?? left.prizePool)
  );
  return typeof filters.limit === "number" ? matches.slice(0, filters.limit) : matches;
}

export function listMatchDetails() {
  const persistedMatches = listPersistedMatches();
  const details =
    persistedMatches.length > 0
      ? persistedMatches
          .map((match) => getDetail(match.id))
          .filter((detail): detail is MatchDetail => Boolean(detail))
          .map((detail) => cloneDetail(detail))
      : listMissions().map((mission) => cloneDetail(getDetail(mission.id) ?? buildSeedDetail(mission)));
  const known = new Set(details.map((detail) => detail.match.id));
  for (const [matchId, detail] of mutableMatchDetails.entries()) {
    if (!known.has(matchId)) details.push(cloneDetail(detail));
  }
  return details;
}

export function getMatchDetail(matchId: string) {
  const detail = getDetail(matchId);
  return detail ? cloneDetail(detail) : null;
}

export function listMaterializedMatchStreamEvents(matchId: string): MatchStreamEvent[] {
  return listPersistedMatchStreamEvents(matchId)
    .map((row) => hydratePersistedStreamEvent(row))
    .filter((event): event is MatchStreamEvent => event !== null);
}

function syncMaterializedLiveStreamEvents(matchId: string, events: MatchStreamEvent[]) {
  const candidates = events.filter((event) => event.type !== "heartbeat");
  if (candidates.length === 0) {
    return;
  }

  const latestByType = new Map<MatchStreamEvent["type"], MatchStreamEvent>();
  for (const event of listMaterializedMatchStreamEvents(matchId)) {
    if (event.type === "heartbeat") {
      continue;
    }
    latestByType.set(event.type, event);
  }

  const changed = candidates.filter((event) => {
    const previous = latestByType.get(event.type);
    return !previous || getMatchStreamEventSignature(previous) !== getMatchStreamEventSignature(event);
  });

  if (changed.length === 0) {
    return;
  }

  appendPersistedMatchStreamEvents(toPersistedStreamEvents(changed));
}

export function getMatchStatusSnapshot(matchId: string): MatchStatusSnapshot | null {
  const detail = getMatchDetail(matchId);
  if (!detail) return null;
  return { status: detail.match.status, remainingSec: null, phase: phaseFor(detail.match.status), isPanic: detail.match.status === "panic" };
}

export function getMatchTimerSnapshot(matchId: string): MatchTimerSnapshot | null {
  const detail = getMatchDetail(matchId);
  if (!detail) return null;
  const totalDuration = detail.match.durationMinutes * 60;
  const serverTime = nowIso();
  if (!detail.match.startedAt || detail.match.status === "lobby" || detail.match.status === "prestart") {
    return { totalDuration, elapsed: 0, remaining: null, serverTime };
  }
  const elapsed = Math.max(0, Math.floor((Date.parse(serverTime) - Date.parse(detail.match.startedAt)) / 1000));
  return { totalDuration, elapsed, remaining: Math.max(0, totalDuration - elapsed), serverTime };
}

function fallbackTargetNode(objectId: string): ScoreboardTargetNode {
  return {
    objectId,
    name: `Node ${objectId.slice(0, 8)}`,
    fillRatio: 0,
    urgency: "safe",
    isOnline: false
  };
}

async function resolveTargetNodes(detail: MatchDetail): Promise<ScoreboardTargetNode[]> {
  const targetIds =
    detail.match.targetNodeIds.length > 0
      ? detail.match.targetNodeIds.slice(0, 5)
      : detail.match.onChainId
        ? [detail.match.onChainId]
        : [];

  if (targetIds.length > 0) {
    return Promise.all(
      targetIds.map(async (targetId) => {
        const entry = await getNodeById(targetId);
        if (!entry) {
          return fallbackTargetNode(targetId);
        }

        const node = entry.node;
        return {
          objectId: node.objectId,
          name: node.name,
          fillRatio: node.fillRatio,
          urgency: node.urgency,
          isOnline: node.isOnline
        };
      })
    );
  }

  if (!detail.match.solarSystemId || detail.match.solarSystemId <= 0) {
    return [];
  }

  const nodes = await listNodes({
    solarSystem: detail.match.solarSystemId,
    limit: 5
  });

  return nodes.map((node) => ({
    objectId: node.objectId,
    name: node.name,
    fillRatio: node.fillRatio,
    urgency: node.urgency,
    isOnline: node.isOnline
  }));
}

export async function getMatchScoreboardSnapshot(matchId: string): Promise<MatchScoreboardSnapshot | null> {
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId });
  const detail = getMatchDetail(matchId);
  if (!detail) return null;

  const teams = [...detail.teams]
    .sort((left, right) => right.totalScore - left.totalScore)
    .map((team, index) => ({
      teamId: team.id,
      teamName: team.name,
      score: team.totalScore,
      rank: index + 1
    }));

  const timer = getMatchTimerSnapshot(matchId);
  const remainingSeconds = timer?.remaining ?? 0;
  const targetNodes = await resolveTargetNodes(detail);

  return {
    matchId,
    status: detail.match.status,
    remainingSeconds,
    panicMode: detail.match.status === "panic",
    teams,
    targetNodes,
    updatedAt: nowIso()
  };
}

export async function buildMatchStreamFrame(matchId: string): Promise<MatchStreamEvent[] | null> {
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId });
  const status = getMatchStatusSnapshot(matchId);
  const scoreboard = await getMatchScoreboardSnapshot(matchId);
  if (!status || !scoreboard) return null;

  const events: MatchStreamEvent[] = [
    {
      type: "score_update",
      matchId,
      scoreboard
    },
    {
      type: "node_status",
      matchId,
      targetNodes: scoreboard.targetNodes
    },
    {
      type: status.isPanic ? "panic_mode" : "phase_change",
      matchId,
      status: {
        status: status.status,
        remainingSeconds: scoreboard.remainingSeconds,
        panicMode: status.isPanic,
        serverTime: nowIso()
      }
    },
    {
      type: "heartbeat",
      matchId,
      serverTime: nowIso()
    }
  ];

  if (status.status === "settling") {
    events.push({
      type: "settlement_start",
      matchId,
      progress: 75
    });
  }

  if (status.status === "settled") {
    const settlement = getPersistedSettlement(matchId);
    if (settlement?.status === "succeeded") {
      events.push({
        type: "settlement_complete",
        matchId,
        result: settlement.bill
      });
    }
  }

  syncMaterializedLiveStreamEvents(matchId, events);
  return events;
}

export function createTeamForMatch(matchId: string, input: CreateTeamInput): ApiResult<{ team: Team; member: TeamMember }> {
  const detail = getDetail(matchId);
  if (!detail) return fail(404, "INVALID_INPUT", "Match not found");
  if (!isSigned(input.walletAddress, input.signature, input.message, "FuelFrogPanic:create-team", matchId)) return fail(401, "UNAUTHORIZED", "Invalid wallet signature");
  if (detail.match.status !== "lobby") return fail(409, "ROOM_NOT_JOINABLE", "Match is not joinable");
  if (!input.teamName.trim() || input.maxSize < 3 || input.maxSize > 8) return fail(400, "INVALID_INPUT", "Invalid team payload");
  if (detail.members.some((member) => normalizeAddress(member.walletAddress) === normalizeAddress(input.walletAddress))) return fail(409, "ROOM_NOT_JOINABLE", "Wallet is already registered in this match");

  const next = cloneDetail(detail);
  const teamId = crypto.randomUUID();
  const roleSlots = input.roleSlots.length > 0 ? input.roleSlots : ROLE_ORDER;
  const team: Team = {
    id: teamId,
    matchId,
    name: input.teamName.trim(),
    captainAddress: normalizeAddress(input.walletAddress),
    maxSize: input.maxSize,
    isLocked: false,
    hasPaid: false,
    payTxDigest: null,
    totalScore: 0,
    rank: null,
    prizeAmount: null,
    status: "forming",
    createdAt: nowIso()
  };
  const member: TeamMember = {
    id: crypto.randomUUID(),
    teamId,
    walletAddress: normalizeAddress(input.walletAddress),
    role: roleSlots[0] ?? "collector",
    slotStatus: "confirmed",
    personalScore: 0,
    prizeAmount: null,
    joinedAt: nowIso()
  };
  next.teams.push(team);
  next.members.push(member);
  persist(next);
  return { ok: true, data: { team, member } };
}

export function createTeam(input: CreateTeamInput & { matchId: string }) {
  return createTeamForMatch(input.matchId, input);
}

export function joinTeam(teamId: string, input: JoinTeamInput): ApiResult<{ member: TeamMember }> {
  const detail = findDetailByTeamId(teamId);
  if (!detail) return fail(404, "INVALID_INPUT", "Team not found");
  if (!isSigned(input.walletAddress, input.signature, input.message, "FuelFrogPanic:join-team", teamId)) return fail(401, "UNAUTHORIZED", "Invalid wallet signature");

  const next = cloneDetail(detail);
  const team = next.teams.find((candidate) => candidate.id === teamId);
  if (!team) return fail(404, "INVALID_INPUT", "Team not found");
  if (team.status !== "forming") return fail(409, "ROOM_NOT_JOINABLE", "Team is not joinable");
  if (next.members.some((member) => normalizeAddress(member.walletAddress) === normalizeAddress(input.walletAddress))) return fail(409, "ROOM_NOT_JOINABLE", "Wallet is already registered in this match");
  if (next.members.filter((member) => member.teamId === teamId).length >= team.maxSize) return fail(409, "ROOM_NOT_JOINABLE", "Team is full");
  if (roleCount(next, teamId, input.role) >= 1) return fail(409, "ROLE_ALREADY_TAKEN", "Role slot is already occupied");

  const member: TeamMember = {
    id: crypto.randomUUID(),
    teamId,
    walletAddress: normalizeAddress(input.walletAddress),
    role: input.role,
    slotStatus: "confirmed",
    personalScore: 0,
    prizeAmount: null,
    joinedAt: nowIso()
  };
  next.members.push(member);
  persist(next);
  return { ok: true, data: { member } };
}

export function lockTeam(teamId: string, input: LockTeamInput): ApiResult<{ team: Team }> {
  const detail = findDetailByTeamId(teamId);
  if (!detail) return fail(404, "INVALID_INPUT", "Team not found");
  if (!isSigned(input.walletAddress, input.signature, input.message, "FuelFrogPanic:lock-team", teamId)) return fail(401, "UNAUTHORIZED", "Invalid wallet signature");

  const next = cloneDetail(detail);
  const teamIndex = next.teams.findIndex((team) => team.id === teamId);
  const team = next.teams[teamIndex];
  if (normalizeAddress(team.captainAddress) !== normalizeAddress(input.walletAddress)) return fail(403, "UNAUTHORIZED", "Only the captain can lock the team");

  const members = next.members.filter((member) => member.teamId === teamId);
  if (members.length < team.maxSize) return fail(409, "INVALID_INPUT", "Team is not full");
  if (!members.some((member) => member.role === "hauler")) return fail(409, "INVALID_INPUT", "Team requires at least one hauler");

  const updatedTeam: Team = { ...team, isLocked: true, status: "locked" };
  next.teams[teamIndex] = updatedTeam;
  next.members = next.members.map((member) => (member.teamId === teamId ? { ...member, slotStatus: "locked" } : member));
  persist(next);
  return { ok: true, data: { team: updatedTeam } };
}

export function payTeam(teamId: string, input: PayTeamInput): ApiResult<{ team: Team; whitelistCount: number }> {
  const detail = findDetailByTeamId(teamId);
  if (!detail) return fail(404, "INVALID_INPUT", "Team not found");
  if (!isSigned(input.walletAddress, input.signature, input.message, "FuelFrogPanic:pay-team", teamId)) return fail(401, "UNAUTHORIZED", "Invalid wallet signature");

  const next = cloneDetail(detail);
  const teamIndex = next.teams.findIndex((team) => team.id === teamId);
  const team = next.teams[teamIndex];
  if (team.status !== "locked") return fail(409, "TEAM_NOT_LOCKED", "Team must be locked before payment");
  if (normalizeAddress(team.captainAddress) !== normalizeAddress(input.walletAddress)) return fail(403, "UNAUTHORIZED", "Only the captain can pay");
  if (!input.txDigest.trim()) return fail(400, "TX_REJECTED", "Transaction digest is invalid");

  const memberCount = next.members.filter((member) => member.teamId === teamId).length;
  const expectedAmount = next.match.entryFee * memberCount;
  if (typeof input.txAmount === "number" && Number.isFinite(input.txAmount) && input.txAmount < expectedAmount) return fail(400, "INVALID_INPUT", "Paid amount is lower than expected");

  const updatedTeam: Team = { ...team, hasPaid: true, payTxDigest: input.txDigest.trim(), status: "paid" };
  next.teams[teamIndex] = updatedTeam;
  next.match = {
    ...next.match,
    prizePool: next.match.prizePool + expectedAmount,
    status: next.teams.filter((item, index) => (index === teamIndex ? true : item.hasPaid)).length >= next.match.minTeams ? "prestart" : next.match.status
  };
  persist(next);
  return { ok: true, data: { team: updatedTeam, whitelistCount: memberCount } };
}

export function addMatchBounty(input: { matchId: string; walletAddress: string; bountyAmount: number; txDigest: string }): BountyMutationResult {
  const detail = getDetail(input.matchId);
  if (!detail) return { ok: false, code: "INVALID_INPUT", status: 404, message: "Match not found" };
  const next = cloneDetail(detail);
  next.match = { ...next.match, prizePool: next.match.prizePool + input.bountyAmount };
  persist(next);
  return {
    ok: true,
    match: { id: next.match.id, prizePool: next.match.prizePool, status: next.match.status },
    updatedPrizePool: next.match.prizePool,
    contribution: { walletAddress: normalizeAddress(input.walletAddress), bountyAmount: input.bountyAmount, txDigest: input.txDigest, createdAt: nowIso() }
  };
}

export function createHostedMatch(input: {
  config: {
    targetNodeIds?: string[];
    hostPrizePool: number;
    entryFee?: number;
    minTeams: number;
    maxTeams: number;
    durationMinutes?: number;
    scoringMode?: "weighted" | "volume";
    creationMode?: MatchCreationMode;
  };
  txDigest: string;
  walletAddress: string;
  signature: string;
  message: string;
}): ApiResult<{ match: Match; onChainId: string }> {
  if (input.config.creationMode === "free") return fail(400, "INVALID_INPUT", "FREE_MATCH_CANNOT_BE_CREATED_MANUALLY");
  if (!isSigned(input.walletAddress, input.signature, input.message, "FuelFrogPanic:create-match", "hosted")) return fail(401, "UNAUTHORIZED", "Invalid wallet signature");
  if (!input.txDigest.trim() || input.txDigest.toLowerCase().includes("reject")) return fail(400, "TX_REJECTED", "Transaction digest is invalid");

  const hostPrizePool = Number(input.config.hostPrizePool);
  const entryFee = Number(input.config.entryFee ?? 0);
  const minTeams = Math.floor(Number(input.config.minTeams));
  const maxTeams = Math.floor(Number(input.config.maxTeams));
  const durationMinutes = Math.floor(Number(input.config.durationMinutes ?? 10));
  const scoringMode = input.config.scoringMode ?? "weighted";
  if (!Number.isFinite(hostPrizePool) || hostPrizePool < 100 || entryFee < 0 || minTeams < 1 || minTeams > 4 || maxTeams < 2 || maxTeams > 16 || minTeams > maxTeams || ![5, 10, 15].includes(durationMinutes) || !["weighted", "volume"].includes(scoringMode)) {
    return fail(400, "INVALID_INPUT", "Hosted match config is invalid");
  }

  const matchId = crypto.randomUUID();
  const onChainId = `hosted_${input.txDigest.trim().slice(0, 12)}_${Date.now()}`;
  const match: Match = {
    id: matchId,
    onChainId,
    status: "draft",
    creationMode: "precision",
    targetNodeIds: (input.config.targetNodeIds ?? []).slice(0, 5),
    prizePool: hostPrizePool,
    hostPrizePool,
    entryFee,
    minTeams,
    maxTeams,
    durationMinutes,
    scoringMode,
    triggerMode: minTeams === maxTeams ? "dynamic" : "min_threshold",
    startedAt: null,
    endedAt: null,
    createdBy: normalizeAddress(input.walletAddress),
    hostAddress: normalizeAddress(input.walletAddress),
    sponsorshipFee: hostPrizePool,
    solarSystemId: 0,
    publishedAt: null,
    publishIdempotencyKey: null,
    createdAt: nowIso()
  };
  persist({ match, teams: [], members: [] });
  return { ok: true, data: { match, onChainId } };
}

export function createMatchDraft(input: CreateDraftInput): ApiResult<{ match: Match }> {
  if (!isSigned(input.walletAddress, input.signature, input.message, "FuelFrogPanic:create-match-draft", "hosted")) {
    return fail(401, "UNAUTHORIZED", "Invalid wallet signature");
  }

  const solarSystemId = Math.floor(Number(input.solarSystemId));
  const sponsorshipFee = Math.floor(Number(input.sponsorshipFee));
  const maxTeams = Math.floor(Number(input.maxTeams));
  const entryFee = Math.floor(Number(input.entryFee));
  const durationHours = Math.floor(Number(input.durationHours));
  const targetNodeIds = (input.targetNodeIds ?? []).filter((value) => typeof value === "string").slice(0, 5);

  if (!Number.isFinite(solarSystemId) || solarSystemId <= 0) {
    return fail(400, "INVALID_INPUT", "solarSystemId is required");
  }
  if (input.mode !== "free" && input.mode !== "precision") {
    return fail(400, "INVALID_INPUT", "mode must be free or precision");
  }
  if (!Number.isFinite(sponsorshipFee) || sponsorshipFee < 0) {
    return fail(400, "INVALID_INPUT", "sponsorshipFee must be zero or greater");
  }
  if (!Number.isFinite(maxTeams) || maxTeams < 2 || maxTeams > 16) {
    return fail(400, "INVALID_INPUT", "maxTeams must be between 2 and 16");
  }
  if (!Number.isFinite(entryFee) || entryFee < 0 || entryFee > 1000) {
    return fail(400, "INVALID_INPUT", "entryFee must be between 0 and 1000");
  }
  if (!Number.isFinite(durationHours) || durationHours < 1 || durationHours > 24) {
    return fail(400, "INVALID_INPUT", "durationHours must be between 1 and 24");
  }
  if (input.mode === "precision" && (targetNodeIds.length < 1 || targetNodeIds.length > 5)) {
    return fail(400, "INVALID_INPUT", "precision mode requires 1-5 target nodes");
  }

  const matchId = crypto.randomUUID();
  const match: Match = {
    id: matchId,
    onChainId: null,
    status: "draft",
    creationMode: input.mode,
    solarSystemId,
    targetNodeIds,
    prizePool: 0,
    hostPrizePool: 0,
    entryFee,
    minTeams: 2,
    maxTeams,
    durationMinutes: durationHours * 60,
    scoringMode: "weighted",
    triggerMode: "min_threshold",
    startedAt: null,
    endedAt: null,
    createdBy: normalizeAddress(input.walletAddress),
    hostAddress: normalizeAddress(input.walletAddress),
    sponsorshipFee,
    publishedAt: null,
    publishIdempotencyKey: null,
    createdAt: nowIso()
  };

  persist({ match, teams: [], members: [] });
  return { ok: true, data: { match } };
}

export function cancelHostedMatch(input: { matchId: string; walletAddress: string; signature: string; message: string }): ApiResult<{ refundTxDigest: string; refundAmount: number }> {
  const detail = getDetail(input.matchId);
  if (!detail) return fail(404, "INVALID_INPUT", "Match not found");
  if (!detail.match.hostAddress) return fail(403, "FORBIDDEN", "System matches cannot be cancelled");
  if (!isSigned(input.walletAddress, input.signature, input.message, "FuelFrogPanic:cancel-match", input.matchId)) return fail(401, "UNAUTHORIZED", "Invalid wallet signature");
  if (normalizeAddress(detail.match.hostAddress ?? "") !== normalizeAddress(input.walletAddress)) return fail(403, "UNAUTHORIZED", "Only the host can cancel this match");
  if (detail.match.status !== "draft" && detail.match.status !== "lobby") return fail(409, "ROOM_NOT_JOINABLE", "Hosted match can only be cancelled before the match starts");
  if (detail.teams.some((team) => team.hasPaid)) return fail(409, "ROOM_NOT_JOINABLE", "Hosted match already has paid teams");

  mutableMatchDetails.delete(input.matchId);
  deletePersistedMatch(input.matchId);
  return { ok: true, data: { refundTxDigest: `refund_${input.matchId}_${Date.now()}`, refundAmount: detail.match.hostPrizePool } };
}

export async function publishMatch(input: PublishMatchInput): Promise<ApiResult<{ match: Match }>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId: input.matchId });
  const detail = getDetail(input.matchId);
  if (!detail) return fail(404, "NOT_FOUND", "match not found");
  if (!isSigned(input.walletAddress, input.signature, input.message, "FuelFrogPanic:publish-match", input.matchId)) {
    return fail(401, "UNAUTHORIZED", "Invalid wallet signature");
  }
  if (normalizeAddress(detail.match.hostAddress ?? "") !== normalizeAddress(input.walletAddress)) {
    return fail(403, "UNAUTHORIZED", "only host can publish");
  }
  const publishTxDigest = input.publishTxDigest.trim();
  if (!publishTxDigest || publishTxDigest.toLowerCase().includes("reject")) {
    return fail(400, "TX_REJECTED", "Transaction digest is invalid");
  }
  if (detail.match.status === "lobby") {
    const sameKey = Boolean(detail.match.publishIdempotencyKey) && detail.match.publishIdempotencyKey === input.idempotencyKey;
    const sameDigest = detail.match.onChainId === `draft_${publishTxDigest}`;
    if (sameKey || sameDigest) {
      return { ok: true, data: { match: cloneDetail(detail).match } };
    }
    return fail(409, "MATCH_NOT_PUBLISHABLE", "match already published");
  }
  if (detail.match.status !== "draft") return fail(409, "MATCH_NOT_PUBLISHABLE", "match is not publishable");
  if ((detail.match.sponsorshipFee ?? detail.match.hostPrizePool) < 50) return fail(400, "SPONSORSHIP_TOO_LOW", "SPONSORSHIP_TOO_LOW");
  if (!detail.match.solarSystemId || detail.match.solarSystemId <= 0) return fail(400, "SYSTEM_NOT_FOUND", "SYSTEM_NOT_FOUND");

  if (input.publishCommitment) {
    if (input.publishCommitment.mode && input.publishCommitment.mode !== detail.match.creationMode) {
      return fail(409, "MATCH_NOT_PUBLISHABLE", "publish commitment mode does not match draft");
    }
    if (
      input.publishCommitment.solarSystemId !== null &&
      input.publishCommitment.solarSystemId !== detail.match.solarSystemId
    ) {
      return fail(409, "MATCH_NOT_PUBLISHABLE", "publish commitment system does not match draft");
    }
    if (
      detail.match.creationMode === "precision" &&
      input.publishCommitment.targetNodeCount !== null &&
      input.publishCommitment.targetNodeCount !== detail.match.targetNodeIds.length
    ) {
      return fail(409, "MATCH_NOT_PUBLISHABLE", "publish commitment target count does not match draft");
    }
  }

  const nodesInSystem = await listNodes({ solarSystem: detail.match.solarSystemId });
  const selectableNodes = nodesInSystem.filter((node) => node.isOnline && node.isPublic);
  if (selectableNodes.length === 0) return fail(400, "SYSTEM_NOT_SELECTABLE", "SYSTEM_NOT_SELECTABLE");

  if (detail.match.creationMode === "precision") {
    if (detail.match.targetNodeIds.length < 1 || detail.match.targetNodeIds.length > 5) {
      return fail(400, "TARGET_NODE_LIMIT_EXCEEDED", "TARGET_NODE_LIMIT_EXCEEDED");
    }
    const selectableSet = new Set(selectableNodes.map((node) => node.id));
    for (const nodeId of detail.match.targetNodeIds) {
      const nodeEntry = await getNodeById(nodeId);
      const node = nodeEntry?.node;
      if (!node) {
        return fail(404, "NODE_NOT_FOUND", "NODE_NOT_FOUND");
      }
      if (!selectableSet.has(node.id) || node.solarSystem !== detail.match.solarSystemId) {
        return fail(400, "NODE_NOT_IN_SYSTEM", "NODE_NOT_IN_SYSTEM");
      }
    }
  }

  const updated = cloneDetail(detail);
  updated.match.status = "lobby";
  updated.match.onChainId = input.publishCommitment?.roomId ?? `draft_${publishTxDigest}`;
  updated.match.escrowId = input.publishCommitment?.escrowId ?? updated.match.escrowId ?? null;
  updated.match.prizePool = updated.match.sponsorshipFee ?? updated.match.hostPrizePool;
  updated.match.hostPrizePool = updated.match.sponsorshipFee ?? updated.match.hostPrizePool;
  updated.match.publishedAt = nowIso();
  updated.match.publishIdempotencyKey = input.idempotencyKey ?? null;
  persist(updated);
  await persistMatchDetailToBackend(updated.match.id);
  return { ok: true, data: { match: updated.match } };
}

export function refundTeamEntry(input: RefundTeamEntryInput): RefundTeamEntryResult {
  const detail = findDetailByTeamId(input.teamId);
  if (!detail) return fail(404, "INVALID_INPUT", "Team not found");
  const next = cloneDetail(detail);
  const teamIndex = next.teams.findIndex((team) => team.id === input.teamId);
  const team = next.teams[teamIndex];
  if (normalizeAddress(team.captainAddress) !== normalizeAddress(input.walletAddress)) return fail(403, "UNAUTHORIZED", "Only the team captain can request a refund");
  if (!team.hasPaid || !team.payTxDigest) return fail(409, "TEAM_NOT_PAID", "Team has no paid entry to refund");
  if (next.match.status === "prestart") return fail(409, "REFUND_NOT_ALLOWED", "Refund is disabled during the 30-second prestart window");
  if (["running", "panic", "settling", "settled"].includes(next.match.status)) return fail(409, "REFUND_NOT_ALLOWED", "Refund is unavailable after the match has started");

  const refundAmount = next.match.entryFee * next.members.filter((member) => member.teamId === team.id).length;
  const updatedTeam: Team = { ...team, hasPaid: false, payTxDigest: null, status: "forming", isLocked: false };
  next.teams[teamIndex] = updatedTeam;
  next.match = { ...next.match, prizePool: Math.max(next.match.hostPrizePool, next.match.prizePool - refundAmount), status: "lobby" };
  next.members = next.members.map((member) => (member.teamId === team.id ? { ...member, slotStatus: "confirmed" } : member));
  persist(next);
  return { ok: true, data: { refundTxDigest: `refund_${team.id}_${Date.now()}`, refundAmount, team: updatedTeam } };
}

export function resetMatchRuntime() {
  mutableMatchDetails.clear();
}

export function __resetMatchRuntime() {
  resetMatchRuntime();
}

export function __setMatchDetailForTests(detail: MatchDetail) {
  persist(detail);
}
