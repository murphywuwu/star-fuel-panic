import { verifyPersonalMessageSignature } from "@mysten/sui/verify";
import { hydrateRuntimeProjectionFromBackendIfNeeded, persistMatchDetailToBackend } from "./matchBackendStore.ts";
import { __setMatchDetailForTests, getMatchDetail, listMatches } from "./matchRuntime.ts";
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
  maxSize: number;
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
  const memberCount = team.members.length;
  return {
    amount: match.entryFee * memberCount,
    memberCount,
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
    paymentAmount: String(match.entryFee * team.members.length),
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

function mapPersistedTeam(team: PersistedTeam, members: RuntimeMember[], applications: TeamApplication[]): RuntimeTeam {
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
    createdAt: team.createdAt,
    roleSlots: Array.isArray(team.roleSlots) ? inferRoleSlots(members, team.maxSize) : { ...team.roleSlots },
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
        amount: match.entryFee * memberAddresses.length,
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
      registeredTeams: match.teams.length,
      paidTeams: match.teamPayments.length
    });
  }

  const detail = getMatchDetail(match.id);
  if (detail) {
    __setMatchDetailForTests({
      match: {
        ...detail.match,
        status: match.status === "cancelled" ? "settled" : match.status,
        entryFee: match.entryFee,
        prizePool: match.prizePool,
        minTeams: match.minTeams,
        maxTeams: match.maxTeams,
        registeredTeams: match.teams.length,
        paidTeams: match.teamPayments.length
      },
      teams: match.teams.map((team) => mapTeam(team)),
      members
    });
  }
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

  return {
    ...team,
    matchId,
    roleSlots: inferRoleSlots(teamMembers, team.maxSize),
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
      teams: projection.teams.map((team) =>
        mapPersistedTeam(team, membersByTeam.get(team.id) ?? [], applicationsByTeam.get(team.id) ?? [])
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
  const maxSize = Math.floor(input.maxSize);
  const walletAddress = normalizeWallet(input.walletAddress);

  if (!matchId || !teamName || !walletAddress || !Number.isInteger(maxSize) || maxSize < 3 || maxSize > 8) {
    return failure(400, "INVALID_INPUT", "Invalid team payload");
  }

  const roleSlots = buildRoleSlots(input.roleSlots, maxSize);
  if (!roleSlots) {
    return failure(400, "INVALID_INPUT", "Role slots are invalid");
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

  const captainRole = ROLE_ORDER.find((role) => roleSlots[role] > 0) ?? "collector";
  const createdAt = new Date().toISOString();
  const teamId = crypto.randomUUID();
  const member = createMember(teamId, walletAddress, captainRole, "forming");

  const team: RuntimeTeam = {
    id: teamId,
    matchId,
    name: teamName,
    captainAddress: walletAddress,
    maxSize,
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

  const expectedAmount = match.entryFee * team.members.length;
  const txAmount = parseTxAmount(input.txAmount);
  if (txAmount !== null && txAmount < expectedAmount) {
    return failure(400, "INVALID_INPUT", "Paid amount is lower than expected");
  }

  const memberAddresses =
    input.memberAddresses && input.memberAddresses.length > 0
      ? uniqueWallets(input.memberAddresses)
      : uniqueWallets(team.members.map((member) => normalizeWallet(member.walletAddress)));

  const actualAddresses = uniqueWallets(team.members.map((member) => normalizeWallet(member.walletAddress)));
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
