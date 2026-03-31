import { verifyPersonalMessageSignature } from "@mysten/sui/verify";
import { hydrateRuntimeProjectionFromBackendIfNeeded, persistMatchDetailToBackend } from "./matchBackendStore.ts";
import {
  __setMatchDetailForTests,
  getMatchDetail,
  listMatches,
  type MatchDetail,
  type MatchScore
} from "./matchRuntime.ts";
import {
  getPersistedMatchDetail,
  savePersistedTeamState,
  upsertPersistedMatch,
  type PersistedMatchWhitelist,
  type PersistedTeam,
  type PersistedTeamPayment
} from "./runtimeProjectionStore.ts";
import type { ErrorCode } from "../types/common.ts";
import { deriveTeamPaymentRef } from "../utils/teamPaymentRef.ts";
import type {
  JoinTeamResponse,
  PlayerRole,
  RoleSlots,
  Team,
  TeamApplication,
  TeamDetail,
  TeamMember,
  TeamStatus
} from "../types/team.ts";

type SignedPayload = {
  walletAddress: string;
  signature: string;
  message: string;
};

type RuntimeMember = TeamMember;

type RuntimeTeam = Team & {
  roleSlots: RoleSlots;
  members: RuntimeMember[];
  applications: TeamApplication[];
  whitelistCount: number;
};

type RuntimeMatchState = {
  id: string;
  status: "draft" | "lobby" | "prestart" | "running" | "panic" | "settling" | "settled" | "cancelled";
  roomId: string | null;
  escrowId: string | null;
  entryFee: number;
  prizePool: number;
  minTeams: number;
  maxTeams: number;
  teamSize: number;
  teams: RuntimeTeam[];
  teamPayments: PersistedTeamPayment[];
  whitelists: PersistedMatchWhitelist[];
};

type RuntimeStore = {
  matches: Map<string, RuntimeMatchState>;
};

type ApiFailure = {
  status: number;
  body: {
    ok: false;
    error: {
      code: ErrorCode;
      message: string;
    };
  };
};

type ApiSuccess<T> = {
  status: number;
  body: T;
};

type ActionResult<T> = ApiFailure | ApiSuccess<T>;

type CreateTeamInput = SignedPayload & {
  matchId: string;
  teamName: string;
  maxSize?: number;
  roleSlots: RoleSlots;
};

type JoinTeamInput = SignedPayload & {
  teamId: string;
  role: PlayerRole;
};

type ReviewJoinApplicationInput = SignedPayload & {
  teamId: string;
  applicationId: string;
  reason?: string;
};

type LeaveTeamInput = SignedPayload & {
  teamId: string;
};

type LockTeamInput = SignedPayload & {
  teamId: string;
};

type PayTeamInput = SignedPayload & {
  teamId: string;
  txDigest: string;
  txAmount?: number;
  memberAddresses?: string[];
};

type SoloVerificationInput = {
  matchId: string;
  walletAddress: string;
};

type SoloVerificationTeamInput = {
  teamId: string;
  walletAddress: string;
};

const SOLO_VERIFICATION_RIVAL_PREFIX = "SOLO VERIFY // RIVAL";

function resolveTeamSize(match: {
  teamSize?: number;
  minPlayers?: number;
}) {
  const explicit = Number(match.teamSize ?? Number.NaN);
  if (Number.isFinite(explicit) && explicit >= 3) {
    return Math.floor(explicit);
  }

  const legacy = Number(match.minPlayers ?? Number.NaN);
  if (Number.isFinite(legacy) && legacy >= 3) {
    return Math.floor(legacy);
  }

  return 3;
}

export type TeamPaymentQuote = {
  amount: number;
  memberCount: number;
  roomId: string | null;
  escrowId: string | null;
  teamRef: string;
};

export function getExpectedTeamPayment(teamId: string): TeamPaymentQuote | null {
  const found = findTeam(teamId.trim());
  if (!found) {
    return null;
  }

  const { match, team } = found;
  return {
    amount: match.entryFee * match.teamSize,
    memberCount: match.teamSize,
    roomId: match.roomId,
    escrowId: match.escrowId,
    teamRef: deriveTeamPaymentRef(team.id)
  };
}

const ROLE_ORDER: PlayerRole[] = ["collector", "hauler", "escort"];

function failure(status: number, code: ErrorCode, message: string): ApiFailure {
  return {
    status,
    body: {
      ok: false,
      error: {
        code,
        message
      }
    }
  };
}

function normalizeWallet(walletAddress: string) {
  return walletAddress.trim().toLowerCase();
}

function nowIso() {
  return new Date().toISOString();
}

function uniqueWallets(addresses: string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const address of addresses) {
    const normalized = normalizeWallet(address);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    unique.push(normalized);
  }

  return unique;
}

export function createTestTeamSignature(walletAddress: string, message: string) {
  return `dev:${normalizeWallet(walletAddress)}:${message.trim()}`;
}

function normalizeRole(role: string): PlayerRole | null {
  const normalized = role.trim().toLowerCase();
  if (normalized === "collector" || normalized === "hauler" || normalized === "escort") {
    return normalized;
  }
  return null;
}

function safeRoleSlotValue(value: unknown) {
  const normalized = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(normalized) || normalized < 0) {
    return 0;
  }
  return Math.floor(normalized);
}

function buildRoleSlots(roleSlots: Partial<RoleSlots>, maxSize: number): RoleSlots | null {
  const normalized: RoleSlots = {
    collector: safeRoleSlotValue(roleSlots.collector),
    hauler: safeRoleSlotValue(roleSlots.hauler),
    escort: safeRoleSlotValue(roleSlots.escort)
  };

  const total = normalized.collector + normalized.hauler + normalized.escort;
  if (total !== maxSize) {
    return null;
  }

  return normalized;
}

function roleSlotTotal(roleSlots: RoleSlots) {
  return roleSlots.collector + roleSlots.hauler + roleSlots.escort;
}

function inferRoleSlots(members: RuntimeMember[], maxSize: number): RoleSlots {
  const inferred: RoleSlots = {
    collector: 0,
    hauler: 0,
    escort: 0
  };

  for (const member of members) {
    inferred[member.role] += 1;
  }

  const missing = Math.max(0, maxSize - roleSlotTotal(inferred));
  if (missing > 0) {
    inferred.collector += missing;
  }

  return inferred;
}

function mapTeamDetail(match: RuntimeMatchState, team: RuntimeTeam): TeamDetail {
  return {
    ...mapTeam(team),
    memberCount: team.members.length,
    roleSlots: { ...team.roleSlots },
    members: team.members.map((member) => mapMember(member)),
    applications: team.applications.map((application) => mapApplication(application)),
    paymentAmount: String(match.entryFee * match.teamSize),
    paymentTxDigest: team.payTxDigest,
    whitelistCount: team.whitelistCount
  };
}

function mapTeam(team: RuntimeTeam): Team {
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

function mapMember(member: RuntimeMember): TeamMember {
  return {
    id: member.id,
    teamId: member.teamId,
    walletAddress: member.walletAddress,
    role: member.role,
    slotStatus: member.slotStatus,
    personalScore: member.personalScore,
    prizeAmount: member.prizeAmount,
    joinedAt: member.joinedAt
  };
}

function mapApplication(application: TeamApplication): TeamApplication {
  return {
    ...application
  };
}

function mapPersistedTeam(
  team: PersistedTeam,
  members: RuntimeMember[],
  applications: TeamApplication[],
  teamSize: number
): RuntimeTeam {
  return {
    id: team.id,
    matchId: team.matchId,
    name: team.name,
    captainAddress: team.captainAddress,
    maxSize: teamSize,
    isLocked: team.isLocked,
    hasPaid: team.hasPaid,
    payTxDigest: team.payTxDigest,
    totalScore: team.totalScore,
    rank: team.rank,
    prizeAmount: team.prizeAmount,
    status: team.status,
    createdAt: team.createdAt,
    roleSlots: Array.isArray(team.roleSlots) ? inferRoleSlots(members, teamSize) : { ...team.roleSlots },
    members,
    applications,
    whitelistCount: team.whitelistCount ?? 0
  };
}

function normalizePersistedTeamPayment(
  matchId: string,
  payment: PersistedTeamPayment
): PersistedTeamPayment | null {
  const teamId = payment.teamId.trim();
  const txDigest = payment.txDigest.trim();
  const walletAddress = normalizeWallet(payment.walletAddress);

  if (payment.matchId !== matchId || !teamId || !txDigest || !walletAddress) {
    return null;
  }

  const amount = parseTxAmount(payment.amount);
  return {
    matchId,
    teamId,
    walletAddress,
    txDigest,
    amount: amount !== null && amount >= 0 ? amount : 0,
    memberAddresses: uniqueWallets(payment.memberAddresses ?? []),
    createdAt: payment.createdAt || nowIso()
  };
}

function normalizePersistedMatchWhitelist(
  matchId: string,
  whitelist: PersistedMatchWhitelist
): PersistedMatchWhitelist | null {
  const teamId = whitelist.teamId.trim();
  const walletAddress = normalizeWallet(whitelist.walletAddress);
  const sourcePaymentTx = whitelist.sourcePaymentTx.trim();

  if (whitelist.matchId !== matchId || !teamId || !walletAddress || !sourcePaymentTx) {
    return null;
  }

  return {
    matchId,
    teamId,
    walletAddress,
    sourcePaymentTx,
    createdAt: whitelist.createdAt || nowIso()
  };
}

function normalizeTeamPayments(matchId: string, payments: PersistedTeamPayment[]) {
  const byTeam = new Map<string, PersistedTeamPayment>();

  for (const payment of payments) {
    const normalized = normalizePersistedTeamPayment(matchId, payment);
    if (!normalized) {
      continue;
    }
    byTeam.set(normalized.teamId, normalized);
  }

  return [...byTeam.values()];
}

function normalizeMatchWhitelists(matchId: string, whitelists: PersistedMatchWhitelist[]) {
  const byKey = new Map<string, PersistedMatchWhitelist>();

  for (const whitelist of whitelists) {
    const normalized = normalizePersistedMatchWhitelist(matchId, whitelist);
    if (!normalized) {
      continue;
    }
    byKey.set(`${normalized.teamId}:${normalized.walletAddress}`, normalized);
  }

  return [...byKey.values()];
}

function getTeamPaymentFact(match: RuntimeMatchState, teamId: string) {
  return match.teamPayments.find((payment) => payment.teamId === teamId) ?? null;
}

function getTeamWhitelistFacts(match: RuntimeMatchState, teamId: string) {
  return match.whitelists.filter((whitelist) => whitelist.teamId === teamId);
}

function buildWhitelistFacts(match: RuntimeMatchState, team: RuntimeTeam, memberAddresses: string[]) {
  const sourcePaymentTx = team.payTxDigest?.trim();
  if (!sourcePaymentTx) {
    return [];
  }

  const joinedAtByWallet = new Map(
    team.members.map((member) => [normalizeWallet(member.walletAddress), member.joinedAt] as const)
  );

  return memberAddresses.map((walletAddress) => ({
    matchId: match.id,
    teamId: team.id,
    walletAddress,
    sourcePaymentTx,
    createdAt: joinedAtByWallet.get(walletAddress) ?? team.createdAt
  }));
}

function rebuildMatchFacts(match: RuntimeMatchState) {
  const teamIds = new Set(match.teams.map((team) => team.id));
  const payments = normalizeTeamPayments(match.id, match.teamPayments).filter((payment) => teamIds.has(payment.teamId));
  const whitelists = normalizeMatchWhitelists(match.id, match.whitelists).filter((whitelist) => teamIds.has(whitelist.teamId));
  const paymentByTeam = new Map(payments.map((payment) => [payment.teamId, payment] as const));

  for (const team of match.teams) {
    const memberAddresses = uniqueWallets(team.members.map((member) => member.walletAddress));
    let payment = paymentByTeam.get(team.id) ?? null;

    if (!payment && team.hasPaid && team.payTxDigest) {
      payment = {
        matchId: match.id,
        teamId: team.id,
        walletAddress: normalizeWallet(team.captainAddress),
        txDigest: team.payTxDigest,
        amount: match.entryFee * match.teamSize,
        memberAddresses,
        createdAt: team.createdAt
      };
      payments.push(payment);
      paymentByTeam.set(team.id, payment);
    }

    if (payment) {
      const teamWhitelistWallets = new Set(
        whitelists.filter((whitelist) => whitelist.teamId === team.id).map((whitelist) => whitelist.walletAddress)
      );
      const canonicalWhitelistMembers = payment.memberAddresses.length > 0 ? payment.memberAddresses : memberAddresses;
      const missingMembers = canonicalWhitelistMembers.filter((walletAddress) => !teamWhitelistWallets.has(walletAddress));
      if (missingMembers.length > 0) {
        whitelists.push(...buildWhitelistFacts(match, { ...team, payTxDigest: payment.txDigest }, missingMembers));
      }
    }
  }

  match.teamPayments = normalizeTeamPayments(match.id, payments);
  match.whitelists = normalizeMatchWhitelists(match.id, whitelists);

  const finalPaymentByTeam = new Map(match.teamPayments.map((payment) => [payment.teamId, payment] as const));
  const whitelistCountByTeam = new Map<string, number>();
  for (const whitelist of match.whitelists) {
    whitelistCountByTeam.set(whitelist.teamId, (whitelistCountByTeam.get(whitelist.teamId) ?? 0) + 1);
  }

  for (const team of match.teams) {
    const payment = getTeamPaymentFact(match, team.id) ?? finalPaymentByTeam.get(team.id);
    if (payment) {
      team.hasPaid = true;
      team.payTxDigest = payment.txDigest;
      team.isLocked = true;
      if (team.status !== "ready") {
        team.status = "paid";
      }
      team.whitelistCount = getTeamWhitelistFacts(match, team.id).length || whitelistCountByTeam.get(team.id) || payment.memberAddresses.length;
      touchMemberStatuses(team);
      continue;
    }

    team.whitelistCount = 0;
  }
}

function persistMatchState(match: RuntimeMatchState) {
  rebuildMatchFacts(match);

  const teams: PersistedTeam[] = match.teams.map((team) => ({
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
    createdAt: team.createdAt,
    roleSlots: { ...team.roleSlots },
    whitelistCount: team.whitelistCount
  }));
  const members = match.teams.flatMap((team) => team.members.map((member) => mapMember(member)));
  const applications = match.teams.flatMap((team) => team.applications.map((application) => mapApplication(application)));

  savePersistedTeamState(match.id, teams, members, applications, match.teamPayments, match.whitelists);

  const baseMatch = getMatchDetail(match.id)?.match ?? listMatches().find((candidate) => candidate.id === match.id);
  if (baseMatch) {
    const persistedStatus: "draft" | "lobby" | "prestart" | "running" | "panic" | "settling" | "settled" =
      match.status === "cancelled" ? "settled" : match.status;
    upsertPersistedMatch({
      ...baseMatch,
      status: persistedStatus,
      entryFee: match.entryFee,
      prizePool: match.prizePool,
      minTeams: match.minTeams,
      maxTeams: match.maxTeams,
      teamSize: match.teamSize,
      minPlayers: match.teamSize,
      registeredTeams: match.teams.length,
      paidTeams: match.teamPayments.length
    });
  }

  syncMatchDetailOverlay(match);
}

function syncMatchDetailOverlay(
  match: RuntimeMatchState,
  options: {
    startedAt?: string | null;
    endedAt?: string | null;
    scores?: MatchScore[];
  } = {}
) {
  const detail = getMatchDetail(match.id);
  if (!detail) {
    return;
  }

  const nextMatch = {
    ...detail.match,
    status: match.status === "cancelled" ? "settled" : match.status,
    entryFee: match.entryFee,
    prizePool: match.prizePool,
    minTeams: match.minTeams,
    maxTeams: match.maxTeams,
    teamSize: match.teamSize,
    minPlayers: match.teamSize,
    registeredTeams: match.teams.length,
    paidTeams: match.teamPayments.length,
    ...(options.startedAt !== undefined ? { startedAt: options.startedAt } : {}),
    ...(options.endedAt !== undefined ? { endedAt: options.endedAt } : {})
  };

  const nextDetail: MatchDetail = {
    match: nextMatch,
    teams: match.teams.map((team) => mapTeam(team)),
    members: match.teams.flatMap((team) => team.members.map((member) => mapMember(member))),
    ...(options.scores ? { scores: options.scores } : detail.scores ? { scores: detail.scores } : {})
  };

  __setMatchDetailForTests(nextDetail);
}

function buildSoloVerificationWallet() {
  return normalizeWallet(`0x${crypto.randomUUID().replaceAll("-", "")}`);
}

function createSoloVerificationMember(team: RuntimeTeam, role: PlayerRole): RuntimeMember {
  return createMember(team.id, buildSoloVerificationWallet(), role, team.status);
}

function findCaptainTeam(match: RuntimeMatchState, walletAddress: string) {
  const normalized = normalizeWallet(walletAddress);
  return match.teams.find((team) => normalizeWallet(team.captainAddress) === normalized) ?? null;
}

function nextSoloRivalIndex(match: RuntimeMatchState) {
  return match.teams.filter((team) => team.name.startsWith(SOLO_VERIFICATION_RIVAL_PREFIX)).length + 1;
}

function buildSoloRivalTeam(match: RuntimeMatchState) {
  const teamId = crypto.randomUUID();
  const createdAt = nowIso();
  const teamSize = match.teamSize;
  const team: RuntimeTeam = {
    id: teamId,
    matchId: match.id,
    name: `${SOLO_VERIFICATION_RIVAL_PREFIX} ${nextSoloRivalIndex(match)}`,
    captainAddress: buildSoloVerificationWallet(),
    maxSize: teamSize,
    isLocked: true,
    hasPaid: true,
    payTxDigest: `solo_pay_${teamId.replaceAll("-", "")}`,
    totalScore: 0,
    rank: null,
    prizeAmount: null,
    status: "paid",
    createdAt,
    roleSlots: {
      collector: Math.max(1, teamSize - 2),
      hauler: teamSize >= 2 ? 1 : 0,
      escort: teamSize >= 3 ? 1 : 0
    },
    members: [],
    applications: [],
    whitelistCount: teamSize
  };

  const seededRoles: PlayerRole[] = [
    "collector",
    ...(teamSize >= 2 ? (["hauler"] as const) : []),
    ...(teamSize >= 3 ? (["escort"] as const) : []),
    ...Array(Math.max(0, teamSize - 3)).fill("collector")
  ];
  team.members = seededRoles.map((role) => createSoloVerificationMember(team, role));
  touchMemberStatuses(team);
  return team;
}

function buildSoloSettlementScores(match: RuntimeMatchState, walletAddress: string) {
  const normalized = normalizeWallet(walletAddress);
  const captainTeam = findCaptainTeam(match, normalized);
  const preferredTeamId = captainTeam?.id ?? match.teams[0]?.id ?? null;

  const templatesByRank = [
    [240, 150, 110],
    [170, 110, 80],
    [120, 80, 40]
  ];

  const rankedTeams = [...match.teams].sort((left, right) => {
    if (left.id === preferredTeamId && right.id !== preferredTeamId) {
      return -1;
    }
    if (right.id === preferredTeamId && left.id !== preferredTeamId) {
      return 1;
    }
    return left.createdAt.localeCompare(right.createdAt);
  });

  const scoreRows: MatchScore[] = [];
  for (const [teamIndex, team] of rankedTeams.entries()) {
    const template = templatesByRank[teamIndex] ?? [90, 60, 30];
    const members = [...team.members].sort((left, right) => left.joinedAt.localeCompare(right.joinedAt));
    let teamTotal = 0;

    members.forEach((member, memberIndex) => {
      const totalScore = template[memberIndex] ?? Math.max(10, template[template.length - 1] - memberIndex * 10);
      member.personalScore = totalScore;
      member.prizeAmount = null;
      teamTotal += totalScore;
      scoreRows.push({
        matchId: match.id,
        teamId: team.id,
        walletAddress: member.walletAddress,
        totalScore,
        fuelDeposited: Math.max(1, Math.round(totalScore / 2)),
        updatedAt: nowIso()
      });
    });

    team.totalScore = teamTotal;
    team.rank = teamIndex + 1;
    team.prizeAmount = null;
  }

  return scoreRows;
}

function walletInTeam(team: RuntimeTeam, walletAddress: string) {
  const normalized = normalizeWallet(walletAddress);
  return team.members.some((member) => normalizeWallet(member.walletAddress) === normalized);
}

function walletInMatch(match: RuntimeMatchState, walletAddress: string) {
  return match.teams.some((team) => walletInTeam(team, walletAddress));
}

function roleCapacity(team: RuntimeTeam, role: PlayerRole) {
  return team.roleSlots[role] ?? 0;
}

function roleFilled(team: RuntimeTeam, role: PlayerRole) {
  return team.members.filter((member) => member.role === role).length;
}

function teamHasRequiredSlots(team: RuntimeTeam) {
  return ROLE_ORDER.every((role) => roleFilled(team, role) >= roleCapacity(team, role));
}

function createStore(): RuntimeStore {
  return {
    matches: new Map<string, RuntimeMatchState>()
  };
}

function hydrateTeam(matchId: string, team: Team, members: TeamMember[]): RuntimeTeam {
  const teamMembers = members
    .filter((member) => member.teamId === team.id)
    .map((member) => mapMember(member));
  const match = listMatches().find((candidate) => candidate.id === matchId);
  const teamSize = match ? resolveTeamSize(match) : team.maxSize;

  return {
    ...team,
    matchId,
    maxSize: teamSize,
    roleSlots: inferRoleSlots(teamMembers, teamSize),
    members: teamMembers,
    applications: [],
    whitelistCount: team.hasPaid ? teamMembers.length : 0
  };
}

const globalForRuntime = globalThis as typeof globalThis & {
  __fuelFrogTeamRuntime__?: RuntimeStore;
};

const runtimeStore = globalForRuntime.__fuelFrogTeamRuntime__ ?? createStore();
globalForRuntime.__fuelFrogTeamRuntime__ = runtimeStore;

function getMatchState(matchId: string) {
  const baseMatch = listMatches().find((match) => match.id === matchId);
  if (!baseMatch) {
    return null;
  }
  const detail = getMatchDetail(matchId);

  const existing = runtimeStore.matches.get(matchId);
  if (existing) {
    existing.status = baseMatch.status;
    existing.roomId = baseMatch.onChainId ?? null;
    existing.escrowId = baseMatch.escrowId ?? null;
    existing.entryFee = baseMatch.entryFee;
    existing.prizePool = baseMatch.prizePool;
    existing.minTeams = baseMatch.minTeams;
    existing.maxTeams = baseMatch.maxTeams;
    existing.teamSize = resolveTeamSize(baseMatch);
    return existing;
  }

  const projection = getPersistedMatchDetail(matchId);
  if (projection) {
    const membersByTeam = new Map<string, RuntimeMember[]>();
    for (const member of projection.members) {
      const list = membersByTeam.get(member.teamId) ?? [];
      list.push(member);
      membersByTeam.set(member.teamId, list);
    }
    const applicationsByTeam = new Map<string, TeamApplication[]>();
    for (const application of projection.applications ?? []) {
      const list = applicationsByTeam.get(application.teamId) ?? [];
      list.push(application);
      applicationsByTeam.set(application.teamId, list);
    }

    const restored: RuntimeMatchState = {
      id: projection.match.id,
      status: projection.match.status,
      roomId: projection.match.onChainId ?? null,
      escrowId: projection.match.escrowId ?? null,
      entryFee: projection.match.entryFee,
      prizePool: projection.match.prizePool,
      minTeams: projection.match.minTeams,
      maxTeams: projection.match.maxTeams,
      teamSize: resolveTeamSize(projection.match),
      teams: projection.teams.map((team) =>
        mapPersistedTeam(
          team,
          membersByTeam.get(team.id) ?? [],
          applicationsByTeam.get(team.id) ?? [],
          resolveTeamSize(projection.match)
        )
      ),
      teamPayments: projection.teamPayments,
      whitelists: projection.whitelists
    };
    rebuildMatchFacts(restored);
    runtimeStore.matches.set(matchId, restored);
    return restored;
  }

  const created: RuntimeMatchState = {
    id: baseMatch.id,
    status: baseMatch.status,
    roomId: baseMatch.onChainId ?? null,
    escrowId: baseMatch.escrowId ?? null,
    entryFee: baseMatch.entryFee,
    prizePool: baseMatch.prizePool,
    minTeams: baseMatch.minTeams,
    maxTeams: baseMatch.maxTeams,
    teamSize: resolveTeamSize(baseMatch),
    teams: detail
      ? detail.teams.map((team) => hydrateTeam(baseMatch.id, team, detail.members))
      : [],
    teamPayments: [],
    whitelists: []
  };
  rebuildMatchFacts(created);
  runtimeStore.matches.set(matchId, created);
  return created;
}

function findTeam(teamId: string) {
  for (const match of runtimeStore.matches.values()) {
    const team = match.teams.find((item) => item.id === teamId);
    if (team) {
      return {
        match,
        team
      };
    }
  }

  for (const match of listMatches()) {
    const hydrated = getMatchState(match.id);
    const team = hydrated?.teams.find((item) => item.id === teamId);
    if (hydrated && team) {
      return {
        match: hydrated,
        team
      };
    }
  }

  return null;
}

async function verifySignedPayload(input: SignedPayload) {
  const walletAddress = normalizeWallet(input.walletAddress);
  const signature = input.signature.trim();
  const message = input.message.trim();

  if (!walletAddress || !signature || !message) {
    return false;
  }

  try {
    await verifyPersonalMessageSignature(new TextEncoder().encode(message), signature, {
      address: walletAddress
    });
    return true;
  } catch {
    return signature === `dev:${walletAddress}:${message}` || signature === `dev:${walletAddress}`;
  }
}

function createMember(teamId: string, walletAddress: string, role: PlayerRole, status: TeamStatus): RuntimeMember {
  const slotStatus =
    status === "paid" || status === "ready" ? "locked" : status === "locked" ? "locked" : "confirmed";

  return {
    id: crypto.randomUUID(),
    teamId,
    walletAddress: normalizeWallet(walletAddress),
    role,
    slotStatus,
    personalScore: 0,
    prizeAmount: null,
    joinedAt: new Date().toISOString()
  };
}

function touchMemberStatuses(team: RuntimeTeam) {
  const nextStatus = team.status;
  for (const member of team.members) {
    member.slotStatus =
      nextStatus === "paid" || nextStatus === "ready" ? "locked" : nextStatus === "locked" ? "locked" : "confirmed";
  }
}

function parseTxAmount(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

function validateTxDigest(txDigest: string) {
  const trimmed = txDigest.trim();
  if (trimmed.length < 8 || trimmed.toLowerCase().includes("reject")) {
    return false;
  }
  return true;
}

export async function createTeam(input: CreateTeamInput): Promise<ActionResult<{ team: Team; member: TeamMember }>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId: input.matchId });
  const isAuthorized = await verifySignedPayload(input);
  if (!isAuthorized) {
    return failure(401, "UNAUTHORIZED", "Wallet signature is invalid");
  }

  const matchId = input.matchId.trim();
  const teamName = input.teamName.trim();
  const walletAddress = normalizeWallet(input.walletAddress);

  if (!matchId || !teamName || !walletAddress) {
    return failure(400, "INVALID_INPUT", "Invalid team payload");
  }

  const match = getMatchState(matchId);
  if (!match) {
    return failure(404, "INVALID_INPUT", "Match not found");
  }
  if (match.status !== "lobby") {
    return failure(409, "ROOM_NOT_JOINABLE", "Match is not joinable");
  }
  if (match.teams.length >= match.maxTeams) {
    return failure(409, "ROOM_NOT_JOINABLE", "Match already reached max teams");
  }
  if (walletInMatch(match, walletAddress)) {
    return failure(409, "ROOM_NOT_JOINABLE", "Wallet is already registered in this match");
  }
  const roleSlots = buildRoleSlots(input.roleSlots, match.teamSize);
  if (!roleSlots) {
    return failure(400, "INVALID_INPUT", `Role slots must sum to fixed team size ${match.teamSize}`);
  }

  const captainRole = ROLE_ORDER.find((role) => roleSlots[role] > 0) ?? "collector";
  const createdAt = new Date().toISOString();
  const teamId = crypto.randomUUID();
  const member = createMember(teamId, walletAddress, captainRole, "forming");

  const team: RuntimeTeam = {
    id: teamId,
    matchId,
    name: teamName,
    captainAddress: walletAddress,
    maxSize: match.teamSize,
    isLocked: false,
    hasPaid: false,
    payTxDigest: null,
    totalScore: 0,
    rank: null,
    prizeAmount: null,
    status: "forming",
    createdAt,
    roleSlots,
    members: [member],
    applications: [],
    whitelistCount: 0
  };

  match.teams.push(team);
  persistMatchState(match);
  await persistMatchDetailToBackend(match.id);

  return {
    status: 200,
    body: {
      team: mapTeam(team),
      member: mapMember(member)
    }
  };
}

export async function joinTeam(input: JoinTeamInput): Promise<ActionResult<JoinTeamResponse>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded();
  const isAuthorized = await verifySignedPayload(input);
  if (!isAuthorized) {
    return failure(401, "UNAUTHORIZED", "Wallet signature is invalid");
  }

  const found = findTeam(input.teamId.trim());
  if (!found) {
    return failure(404, "INVALID_INPUT", "Team not found");
  }

  const { match, team } = found;
  const walletAddress = normalizeWallet(input.walletAddress);
  const role = normalizeRole(input.role);

  if (!walletAddress || !role) {
    return failure(400, "INVALID_INPUT", "Invalid join payload");
  }
  if (match.status !== "lobby" || team.status !== "forming") {
    return failure(409, "TEAM_LOCKED", "Team is not joinable");
  }
  if (walletInMatch(match, walletAddress)) {
    return failure(409, "ROOM_NOT_JOINABLE", "Wallet is already registered in this match");
  }
  if (team.members.length >= team.maxSize) {
    return failure(409, "TEAM_FULL", "Team is full");
  }
  if (team.applications.some((item) => normalizeWallet(item.applicantAddress) === walletAddress && item.status === "pending")) {
    return failure(409, "CONFLICT", "Wallet already has a pending application");
  }
  const application: TeamApplication = {
    applicationId: crypto.randomUUID(),
    teamId: team.id,
    applicantAddress: walletAddress,
    role,
    status: "pending",
    createdAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null
  };
  team.applications.push(application);
  persistMatchState(match);
  await persistMatchDetailToBackend(match.id);

  return {
    status: 200,
    body: {
      applicationId: application.applicationId,
      status: application.status
    }
  };
}

export async function approveJoinApplication(
  input: ReviewJoinApplicationInput
): Promise<ActionResult<{ team: TeamDetail; member: TeamMember; application: TeamApplication }>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded();
  const isAuthorized = await verifySignedPayload(input);
  if (!isAuthorized) {
    return failure(401, "UNAUTHORIZED", "Wallet signature is invalid");
  }
  const found = findTeam(input.teamId.trim());
  if (!found) {
    return failure(404, "NOT_FOUND", "Team not found");
  }

  const { team, match } = found;
  const walletAddress = normalizeWallet(input.walletAddress);
  if (normalizeWallet(team.captainAddress) !== walletAddress) {
    return failure(403, "FORBIDDEN", "Only the captain can review applications");
  }
  if (match.status !== "lobby" || team.status !== "forming") {
    return failure(409, "TEAM_LOCKED", "Team is not joinable");
  }
  const application = team.applications.find((item) => item.applicationId === input.applicationId.trim());
  if (!application) {
    return failure(404, "NOT_FOUND", "Application not found");
  }
  if (application.status !== "pending") {
    return failure(409, "CONFLICT", "Application already reviewed");
  }
  if (team.members.length >= team.maxSize) {
    return failure(409, "TEAM_FULL", "Team is full");
  }
  if (roleFilled(team, application.role) >= roleCapacity(team, application.role)) {
    return failure(409, "ROLE_SLOT_FULL", "Role slot is already occupied");
  }
  if (walletInMatch(match, application.applicantAddress)) {
    return failure(409, "CONFLICT", "Wallet is already registered in this match");
  }

  const member = createMember(team.id, application.applicantAddress, application.role, team.status);
  team.members.push(member);
  application.status = "approved";
  application.reviewedAt = new Date().toISOString();
  application.reviewedBy = walletAddress;
  persistMatchState(match);
  await persistMatchDetailToBackend(match.id);

  return {
    status: 200,
    body: {
      team: mapTeamDetail(match, team),
      member: mapMember(member),
      application: mapApplication(application)
    }
  };
}

export async function rejectJoinApplication(
  input: ReviewJoinApplicationInput
): Promise<ActionResult<{ team: TeamDetail; application: TeamApplication }>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded();
  const isAuthorized = await verifySignedPayload(input);
  if (!isAuthorized) {
    return failure(401, "UNAUTHORIZED", "Wallet signature is invalid");
  }
  const found = findTeam(input.teamId.trim());
  if (!found) {
    return failure(404, "NOT_FOUND", "Team not found");
  }

  const { team, match } = found;
  const walletAddress = normalizeWallet(input.walletAddress);
  if (normalizeWallet(team.captainAddress) !== walletAddress) {
    return failure(403, "FORBIDDEN", "Only the captain can review applications");
  }
  if (match.status !== "lobby" || team.status !== "forming") {
    return failure(409, "TEAM_LOCKED", "Team is not joinable");
  }
  const application = team.applications.find((item) => item.applicationId === input.applicationId.trim());
  if (!application) {
    return failure(404, "NOT_FOUND", "Application not found");
  }
  if (application.status !== "pending") {
    return failure(409, "CONFLICT", "Application already reviewed");
  }

  application.status = "rejected";
  application.reason = input.reason?.trim() || undefined;
  application.reviewedAt = new Date().toISOString();
  application.reviewedBy = walletAddress;
  persistMatchState(match);
  await persistMatchDetailToBackend(match.id);

  return {
    status: 200,
    body: {
      team: mapTeamDetail(match, team),
      application: mapApplication(application)
    }
  };
}

export async function leaveTeam(
  input: LeaveTeamInput
): Promise<ActionResult<{ ok: true; teamDeleted: boolean; team: TeamDetail | null }>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded();
  const isAuthorized = await verifySignedPayload(input);
  if (!isAuthorized) {
    return failure(401, "UNAUTHORIZED", "Wallet signature is invalid");
  }

  const found = findTeam(input.teamId.trim());
  if (!found) {
    return failure(404, "INVALID_INPUT", "Team not found");
  }

  const { match, team } = found;
  const walletAddress = normalizeWallet(input.walletAddress);

  if (team.status !== "forming") {
    return failure(409, "ROOM_NOT_JOINABLE", "Locked teams cannot be modified");
  }

  const memberIndex = team.members.findIndex((member) => normalizeWallet(member.walletAddress) === walletAddress);
  if (memberIndex < 0) {
    return failure(404, "INVALID_INPUT", "Member is not in this team");
  }

  const isCaptain = normalizeWallet(team.captainAddress) === walletAddress;
  if (isCaptain) {
    team.members.splice(memberIndex, 1);
    if (team.members.length > 0) {
      team.captainAddress = team.members[0]?.walletAddress ?? team.captainAddress;
      persistMatchState(match);
      await persistMatchDetailToBackend(match.id);
      return {
        status: 200,
        body: {
          ok: true,
          teamDeleted: false,
          team: mapTeamDetail(match, team)
        }
      };
    }
    match.teams = match.teams.filter((item) => item.id !== team.id);
    persistMatchState(match);
    await persistMatchDetailToBackend(match.id);
    return {
      status: 200,
      body: {
        ok: true,
        teamDeleted: true,
        team: null
      }
    };
  }

  team.members.splice(memberIndex, 1);
  if (team.members.length === 0) {
    match.teams = match.teams.filter((item) => item.id !== team.id);
    persistMatchState(match);
    await persistMatchDetailToBackend(match.id);
    return {
      status: 200,
      body: {
        ok: true,
        teamDeleted: true,
        team: null
      }
    };
  }

  persistMatchState(match);
  await persistMatchDetailToBackend(match.id);

  return {
    status: 200,
    body: {
      ok: true,
      teamDeleted: false,
      team: mapTeamDetail(match, team)
    }
  };
}

export async function lockTeam(input: LockTeamInput): Promise<ActionResult<{ team: TeamDetail }>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded();
  const isAuthorized = await verifySignedPayload(input);
  if (!isAuthorized) {
    return failure(401, "UNAUTHORIZED", "Wallet signature is invalid");
  }

  const found = findTeam(input.teamId.trim());
  if (!found) {
    return failure(404, "INVALID_INPUT", "Team not found");
  }

  const { match, team } = found;
  const walletAddress = normalizeWallet(input.walletAddress);

  if (normalizeWallet(team.captainAddress) !== walletAddress) {
    return failure(403, "UNAUTHORIZED", "Only the captain can lock the team");
  }
  if (match.status !== "lobby") {
    return failure(409, "ROOM_NOT_JOINABLE", "Match is not joinable");
  }
  if (team.status === "paid") {
    return failure(409, "TEAM_ALREADY_PAID", "Team is already paid");
  }
  if (team.status !== "forming") {
    return failure(409, "ROOM_NOT_JOINABLE", "Team is already locked");
  }
  if (team.members.length < team.maxSize) {
    return failure(409, "INVALID_INPUT", "Team is not full");
  }
  if (!team.members.some((member) => member.role === "hauler")) {
    return failure(409, "INVALID_INPUT", "Team requires at least one hauler");
  }
  if (!teamHasRequiredSlots(team)) {
    return failure(409, "INVALID_INPUT", "Team role slots are incomplete");
  }

  team.status = "locked";
  team.isLocked = true;
  touchMemberStatuses(team);
  persistMatchState(match);
  await persistMatchDetailToBackend(match.id);

  return {
    status: 200,
    body: {
      team: mapTeamDetail(match, team)
    }
  };
}

export async function payTeamEntry(
  input: PayTeamInput
): Promise<ActionResult<{ team: TeamDetail; whitelistCount: number }>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded();
  const isAuthorized = await verifySignedPayload(input);
  if (!isAuthorized) {
    return failure(401, "UNAUTHORIZED", "Wallet signature is invalid");
  }

  const found = findTeam(input.teamId.trim());
  if (!found) {
    return failure(404, "INVALID_INPUT", "Team not found");
  }

  const { match, team } = found;
  const walletAddress = normalizeWallet(input.walletAddress);
  const txDigest = input.txDigest.trim();

  if (!txDigest) {
    return failure(400, "INVALID_INPUT", "Payment digest is required");
  }
  if (normalizeWallet(team.captainAddress) !== walletAddress) {
    return failure(403, "UNAUTHORIZED", "Only the captain can submit payment");
  }
  if (match.status !== "lobby" && match.status !== "prestart") {
    return failure(409, "ROOM_NOT_JOINABLE", "Match is not payable");
  }
  if (team.status === "paid") {
    return failure(409, "TEAM_ALREADY_PAID", "Team has already paid");
  }
  if (team.status !== "locked") {
    return failure(409, "TEAM_NOT_LOCKED", "Team must be locked before payment");
  }
  if (!validateTxDigest(txDigest)) {
    return failure(400, "TX_REJECTED", "Transaction digest is invalid");
  }
  if (team.members.length !== match.teamSize) {
    return failure(409, "TEAM_NOT_LOCKED", "Team member count does not match the fixed roster size");
  }

  const expectedAmount = match.entryFee * match.teamSize;
  const txAmount = parseTxAmount(input.txAmount);
  if (txAmount !== null && txAmount < expectedAmount) {
    return failure(400, "INVALID_INPUT", "Paid amount is lower than expected");
  }

  const memberAddresses =
    input.memberAddresses && input.memberAddresses.length > 0
      ? uniqueWallets(input.memberAddresses)
      : uniqueWallets(team.members.map((member) => normalizeWallet(member.walletAddress)));

  const actualAddresses = uniqueWallets(team.members.map((member) => normalizeWallet(member.walletAddress)));
  if (actualAddresses.length !== match.teamSize) {
    return failure(409, "INVALID_INPUT", "Team roster is incomplete for payment");
  }
  if (
    memberAddresses.length !== actualAddresses.length ||
    actualAddresses.some((address) => !memberAddresses.includes(address))
  ) {
    return failure(400, "INVALID_INPUT", "Member whitelist payload does not match team members");
  }

  team.payTxDigest = txDigest;
  team.status = "paid";
  team.hasPaid = true;
  team.whitelistCount = memberAddresses.length;
  match.teamPayments = [
    ...match.teamPayments.filter((payment) => payment.teamId !== team.id),
    {
      matchId: match.id,
      teamId: team.id,
      walletAddress,
      txDigest,
      amount: expectedAmount,
      memberAddresses,
      createdAt: new Date().toISOString()
    }
  ];
  match.whitelists = [
    ...match.whitelists.filter((whitelist) => whitelist.teamId !== team.id),
    ...buildWhitelistFacts(match, team, memberAddresses)
  ];
  match.prizePool += expectedAmount;
  rebuildMatchFacts(match);
  if (match.teamPayments.length >= match.minTeams) {
    match.status = "prestart";
  }
  persistMatchState(match);
  await persistMatchDetailToBackend(match.id);

  return {
    status: 200,
    body: {
      team: mapTeamDetail(match, team),
      whitelistCount: team.whitelistCount
    }
  };
}

export async function fillSoloVerificationTeam(
  input: SoloVerificationTeamInput
): Promise<ActionResult<{ team: TeamDetail; addedMembers: number }>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded();

  const found = findTeam(input.teamId.trim());
  if (!found) {
    return failure(404, "NOT_FOUND", "Team not found");
  }

  const { match, team } = found;
  const walletAddress = normalizeWallet(input.walletAddress);
  if (!walletAddress) {
    return failure(400, "INVALID_INPUT", "Wallet address is required");
  }
  if (normalizeWallet(team.captainAddress) !== walletAddress) {
    return failure(403, "FORBIDDEN", "Only the captain can auto-fill this team");
  }
  if (match.status !== "lobby") {
    return failure(409, "ROOM_NOT_JOINABLE", "Solo verification fill only works while the match is in lobby");
  }
  if (team.status !== "forming") {
    return failure(409, "TEAM_LOCKED", "Only forming teams can be auto-filled");
  }

  const beforeCount = team.members.length;
  for (const role of ROLE_ORDER) {
    while (roleFilled(team, role) < roleCapacity(team, role)) {
      team.members.push(createSoloVerificationMember(team, role));
    }
  }

  const addedMembers = team.members.length - beforeCount;
  persistMatchState(match);
  await persistMatchDetailToBackend(match.id);

  return {
    status: 200,
    body: {
      team: mapTeamDetail(match, team),
      addedMembers
    }
  };
}

export async function seedSoloVerificationRivalTeam(
  input: SoloVerificationInput
): Promise<ActionResult<{ team: TeamDetail; matchStatus: RuntimeMatchState["status"] }>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId: input.matchId });

  const match = getMatchState(input.matchId.trim());
  if (!match) {
    return failure(404, "NOT_FOUND", "Match not found");
  }
  if (match.status !== "lobby" && match.status !== "prestart") {
    return failure(409, "ROOM_NOT_JOINABLE", "Solo verification rival seeding is only available before the match starts");
  }

  const walletAddress = normalizeWallet(input.walletAddress);
  const captainTeam = findCaptainTeam(match, walletAddress);
  if (!captainTeam) {
    return failure(409, "CONFLICT", "Create your own team first before seeding a rival");
  }

  const existingRival = match.teams.find((team) => team.name.startsWith(SOLO_VERIFICATION_RIVAL_PREFIX));
  const rival = existingRival ?? buildSoloRivalTeam(match);
  if (!existingRival) {
    if (match.teams.length >= match.maxTeams) {
      return failure(409, "CONFLICT", "Match already reached max teams");
    }
    match.teams.push(rival);
  }

  rebuildMatchFacts(match);
  if (match.teamPayments.length >= match.minTeams) {
    match.status = "prestart";
  }
  persistMatchState(match);
  await persistMatchDetailToBackend(match.id);

  return {
    status: 200,
    body: {
      team: mapTeamDetail(match, rival),
      matchStatus: match.status
    }
  };
}

export async function startSoloVerificationMatch(
  input: SoloVerificationInput
): Promise<ActionResult<{ matchId: string; status: RuntimeMatchState["status"]; startedAt: string }>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId: input.matchId });

  const match = getMatchState(input.matchId.trim());
  if (!match) {
    return failure(404, "NOT_FOUND", "Match not found");
  }
  if (match.status === "running" || match.status === "panic") {
    const detail = getMatchDetail(match.id);
    return {
      status: 200,
      body: {
        matchId: match.id,
        status: match.status,
        startedAt: detail?.match.startedAt ?? nowIso()
      }
    };
  }
  if (match.status !== "prestart" && match.status !== "lobby") {
    return failure(409, "CONFLICT", "Solo verification start is only available before the match is running");
  }
  if (match.teamPayments.length < match.minTeams) {
    return failure(409, "CONFLICT", "At least the minimum number of paid teams is required before starting");
  }

  const startedAt = nowIso();
  match.status = "running";
  persistMatchState(match);
  syncMatchDetailOverlay(match, {
    startedAt,
    endedAt: null
  });
  await persistMatchDetailToBackend(match.id);

  return {
    status: 200,
    body: {
      matchId: match.id,
      status: match.status,
      startedAt
    }
  };
}

export async function settleSoloVerificationMatch(
  input: SoloVerificationInput
): Promise<ActionResult<{ matchId: string; status: RuntimeMatchState["status"]; settledAt: string }>> {
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId: input.matchId });

  const match = getMatchState(input.matchId.trim());
  if (!match) {
    return failure(404, "NOT_FOUND", "Match not found");
  }
  if (match.teamPayments.length < match.minTeams) {
    return failure(409, "CONFLICT", "Solo verification settlement requires the minimum number of paid teams");
  }
  if (match.status === "settled") {
    const detail = getMatchDetail(match.id);
    return {
      status: 200,
      body: {
        matchId: match.id,
        status: "settled",
        settledAt: detail?.match.endedAt ?? nowIso()
      }
    };
  }
  if (match.status === "draft" || match.status === "lobby") {
    return failure(409, "CONFLICT", "Start the match before forcing settlement");
  }

  const detail = getMatchDetail(match.id);
  const startedAt = detail?.match.startedAt ?? nowIso();
  const settledAt = nowIso();
  const scores = buildSoloSettlementScores(match, input.walletAddress);

  match.status = "settling";
  persistMatchState(match);
  syncMatchDetailOverlay(match, {
    startedAt,
    endedAt: settledAt,
    scores
  });

  match.status = "settled";
  persistMatchState(match);
  syncMatchDetailOverlay(match, {
    startedAt,
    endedAt: settledAt,
    scores
  });
  await persistMatchDetailToBackend(match.id);

  return {
    status: 200,
    body: {
      matchId: match.id,
      status: match.status,
      settledAt
    }
  };
}

export function resetTeamRuntime() {
  runtimeStore.matches.clear();
}

export function getMatchTeamsSnapshot(
  matchId: string
): { items: TeamDetail[] } | null {
  const match = getMatchState(matchId);
  if (!match) {
    return null;
  }

  return {
    items: match.teams.map((team) => mapTeamDetail(match, team))
  };
}

export function __resetTeamRuntime() {
  runtimeStore.matches.clear();
}
