import type { ErrorCode } from "../types/common.ts";
import type { PlanningTeam, PlanningTeamMember } from "../types/planningTeam.ts";
import type { PlayerRole, RoleSlots } from "../types/team.ts";
import {
  listPersistedPlanningTeams,
  upsertPersistedPlanningTeam
} from "./runtimeProjectionStore.ts";

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

type CreatePlanningTeamInput = {
  teamName: string;
  maxMembers: number;
  roleSlots: RoleSlots;
  walletAddress: string;
};

type JoinPlanningTeamInput = {
  teamId: string;
  role: PlayerRole;
  walletAddress: string;
};

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

function pickDefaultRole(roleSlots: RoleSlots): PlayerRole {
  if (roleSlots.collector > 0) {
    return "collector";
  }
  if (roleSlots.hauler > 0) {
    return "hauler";
  }
  return "escort";
}

function safeRoleSlotValue(value: unknown) {
  const normalized = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(normalized) || normalized < 0) {
    return 0;
  }
  return Math.floor(normalized);
}

function buildRoleSlots(roleSlots: Partial<RoleSlots>, maxMembers: number): RoleSlots | null {
  const normalized: RoleSlots = {
    collector: safeRoleSlotValue(roleSlots.collector),
    hauler: safeRoleSlotValue(roleSlots.hauler),
    escort: safeRoleSlotValue(roleSlots.escort)
  };

  const total = normalized.collector + normalized.hauler + normalized.escort;
  if (total !== maxMembers) {
    return null;
  }

  return normalized;
}

function createMember(walletAddress: string, role: PlayerRole, joinedAt: string): PlanningTeamMember {
  return {
    walletAddress: normalizeWallet(walletAddress),
    role,
    joinedAt
  };
}

function normalizePlanningTeam(team: PlanningTeam): PlanningTeam {
  const roleSlots = buildRoleSlots(team.roleSlots, Math.max(3, Number(team.maxMembers) || 3)) ?? {
    collector: 1,
    hauler: 1,
    escort: 1
  };
  const createdAt = typeof team.createdAt === "string" && team.createdAt ? team.createdAt : new Date().toISOString();
  const captainAddress = normalizeWallet(team.captainAddress);
  const normalizedMembers = Array.isArray(team.members)
    ? team.members
        .filter((member) => member && typeof member.walletAddress === "string")
        .map((member) => createMember(member.walletAddress, member.role, member.joinedAt || createdAt))
    : [];

  const members =
    normalizedMembers.length > 0
      ? normalizedMembers
      : [createMember(captainAddress, pickDefaultRole(roleSlots), createdAt)];

  return {
    ...team,
    captainAddress,
    maxMembers: Math.max(3, Number(team.maxMembers) || members.length || 3),
    memberCount: members.length,
    roleSlots,
    members,
    createdAt
  };
}

function walletInAnyTeam(teams: PlanningTeam[], walletAddress: string) {
  const normalized = normalizeWallet(walletAddress);
  return teams.some((team) => team.members.some((member) => normalizeWallet(member.walletAddress) === normalized));
}

function roleFilled(team: PlanningTeam, role: PlayerRole) {
  return team.members.filter((member) => member.role === role).length;
}

export function listPlanningTeams() {
  return listPersistedPlanningTeams()
    .map((team) => normalizePlanningTeam(team))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function getPlanningTeamsSnapshot() {
  const items = listPlanningTeams();
  return {
    items,
    totalTeams: items.length
  };
}

export function createPlanningTeam(
  input: CreatePlanningTeamInput
): ActionResult<{ team: PlanningTeam; totalTeams: number }> {
  const teamName = input.teamName.trim();
  const maxMembers = Math.floor(input.maxMembers);
  const walletAddress = normalizeWallet(input.walletAddress);

  if (!teamName || !walletAddress || !Number.isInteger(maxMembers) || maxMembers < 3 || maxMembers > 8) {
    return failure(400, "INVALID_INPUT", "Invalid planning team payload");
  }

  const roleSlots = buildRoleSlots(input.roleSlots, maxMembers);
  if (!roleSlots) {
    return failure(400, "INVALID_INPUT", "Role slots are invalid");
  }

  const existingTeams = listPlanningTeams();
  if (walletInAnyTeam(existingTeams, walletAddress)) {
    return failure(409, "CONFLICT", "Wallet already belongs to a planning team");
  }

  const createdAt = new Date().toISOString();
  const captainRole = pickDefaultRole(roleSlots);

  const team: PlanningTeam = {
    id: crypto.randomUUID(),
    name: teamName,
    captainAddress: walletAddress,
    maxMembers,
    memberCount: 1,
    roleSlots,
    members: [createMember(walletAddress, captainRole, createdAt)],
    createdAt
  };

  upsertPersistedPlanningTeam(team);
  const totalTeams = listPlanningTeams().length;

  return {
    status: 201,
    body: {
      team,
      totalTeams
    }
  };
}

export function joinPlanningTeam(
  input: JoinPlanningTeamInput
): ActionResult<{ team: PlanningTeam; totalTeams: number }> {
  const teamId = input.teamId.trim();
  const walletAddress = normalizeWallet(input.walletAddress);
  const role = input.role;

  if (!teamId || !walletAddress || (role !== "collector" && role !== "hauler" && role !== "escort")) {
    return failure(400, "INVALID_INPUT", "Invalid planning team join payload");
  }

  const teams = listPlanningTeams();
  const team = teams.find((item) => item.id === teamId);
  if (!team) {
    return failure(404, "NOT_FOUND", "Planning team not found");
  }

  if (walletInAnyTeam(teams, walletAddress)) {
    return failure(409, "CONFLICT", "Wallet already belongs to a planning team");
  }

  if (team.memberCount >= team.maxMembers) {
    return failure(409, "TEAM_FULL", "Planning team is full");
  }

  if (roleFilled(team, role) >= team.roleSlots[role]) {
    return failure(409, "ROLE_ALREADY_TAKEN", "Requested role is already full");
  }

  const nextTeam: PlanningTeam = {
    ...team,
    members: [...team.members, createMember(walletAddress, role, new Date().toISOString())],
    memberCount: team.memberCount + 1
  };

  upsertPersistedPlanningTeam(nextTeam);

  return {
    status: 200,
    body: {
      team: nextTeam,
      totalTeams: teams.length
    }
  };
}
