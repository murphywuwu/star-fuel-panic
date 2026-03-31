import type { ErrorCode } from "../types/common.ts";
import type { PlanningTeam, PlanningTeamApplication, PlanningTeamMember } from "../types/planningTeam.ts";
import type { PlayerRole, RoleSlots } from "../types/team.ts";
import {
  listPersistedPlanningTeamApplications,
  listPersistedPlanningTeams,
  removePersistedPlanningTeam,
  upsertPersistedPlanningTeamApplication,
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

type ReviewPlanningTeamApplicationInput = {
  teamId: string;
  applicationId: string;
  walletAddress: string;
  reason?: string;
};

type LeavePlanningTeamInput = {
  teamId: string;
  walletAddress: string;
};

type DisbandPlanningTeamInput = {
  teamId: string;
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

function normalizePlanningTeam(team: PlanningTeam, applications: PlanningTeamApplication[] = []): PlanningTeam {
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
    applications: applications
      .filter((application) => application.teamId === team.id)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
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

function hasPendingApplication(team: PlanningTeam, walletAddress: string) {
  const normalized = normalizeWallet(walletAddress);
  return team.applications.some(
    (application) =>
      application.status === "pending" &&
      normalizeWallet(application.applicantWalletAddress) === normalized
  );
}

function createPlanningTeamApplication(
  teamId: string,
  walletAddress: string,
  role: PlayerRole
): PlanningTeamApplication {
  return {
    id: crypto.randomUUID(),
    teamId,
    applicantWalletAddress: normalizeWallet(walletAddress),
    role,
    status: "pending",
    createdAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    reason: null
  };
}

export function listPlanningTeams() {
  const applications = listPersistedPlanningTeamApplications();
  return listPersistedPlanningTeams()
    .map((team) => normalizePlanningTeam(team, applications))
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
    applications: [],
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
): ActionResult<{ application: PlanningTeamApplication; team: PlanningTeam; totalTeams: number }> {
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

  if (hasPendingApplication(team, walletAddress)) {
    return failure(409, "CONFLICT", "Join request is already pending");
  }

  if (team.memberCount >= team.maxMembers) {
    return failure(409, "TEAM_FULL", "Planning team is full");
  }

  if (roleFilled(team, role) >= team.roleSlots[role]) {
    return failure(409, "ROLE_ALREADY_TAKEN", "Requested role is already full");
  }

  const application = createPlanningTeamApplication(teamId, walletAddress, role);
  upsertPersistedPlanningTeamApplication(application);

  const nextTeam = listPlanningTeams().find((item) => item.id === teamId) ?? {
    ...team,
    applications: [application, ...team.applications]
  };

  return {
    status: 202,
    body: {
      application,
      team: nextTeam,
      totalTeams: teams.length
    }
  };
}

export function approvePlanningTeamApplication(
  input: ReviewPlanningTeamApplicationInput
): ActionResult<{ team: PlanningTeam; totalTeams: number }> {
  const teamId = input.teamId.trim();
  const applicationId = input.applicationId.trim();
  const walletAddress = normalizeWallet(input.walletAddress);
  const teams = listPlanningTeams();
  const team = teams.find((item) => item.id === teamId);

  if (!team || !applicationId || !walletAddress) {
    return failure(400, "INVALID_INPUT", "Invalid planning team approval payload");
  }

  if (team.captainAddress !== walletAddress) {
    return failure(403, "FORBIDDEN", "Only the captain can approve join requests");
  }

  const application = team.applications.find((item) => item.id === applicationId);
  if (!application) {
    return failure(404, "NOT_FOUND", "Planning team application not found");
  }

  if (application.status !== "pending") {
    return failure(409, "CONFLICT", "Planning team application is no longer pending");
  }

  if (walletInAnyTeam(teams, application.applicantWalletAddress)) {
    return failure(409, "CONFLICT", "Applicant already belongs to a planning team");
  }

  if (team.memberCount >= team.maxMembers) {
    return failure(409, "TEAM_FULL", "Planning team is full");
  }

  if (roleFilled(team, application.role) >= team.roleSlots[application.role]) {
    return failure(409, "ROLE_ALREADY_TAKEN", "Requested role is already full");
  }

  const nextTeam: PlanningTeam = {
    ...team,
    members: [...team.members, createMember(application.applicantWalletAddress, application.role, new Date().toISOString())],
    memberCount: team.memberCount + 1
  };
  const reviewedApplication: PlanningTeamApplication = {
    ...application,
    status: "approved",
    reviewedAt: new Date().toISOString(),
    reviewedBy: walletAddress,
    reason: null
  };

  upsertPersistedPlanningTeam({
    ...nextTeam,
    applications: nextTeam.applications
  });
  upsertPersistedPlanningTeamApplication(reviewedApplication);

  const hydratedTeam = listPlanningTeams().find((item) => item.id === teamId) ?? nextTeam;
  return {
    status: 200,
    body: {
      team: hydratedTeam,
      totalTeams: teams.length
    }
  };
}

export function rejectPlanningTeamApplication(
  input: ReviewPlanningTeamApplicationInput
): ActionResult<{ team: PlanningTeam; totalTeams: number }> {
  const teamId = input.teamId.trim();
  const applicationId = input.applicationId.trim();
  const walletAddress = normalizeWallet(input.walletAddress);
  const teams = listPlanningTeams();
  const team = teams.find((item) => item.id === teamId);

  if (!team || !applicationId || !walletAddress) {
    return failure(400, "INVALID_INPUT", "Invalid planning team rejection payload");
  }

  if (team.captainAddress !== walletAddress) {
    return failure(403, "FORBIDDEN", "Only the captain can reject join requests");
  }

  const application = team.applications.find((item) => item.id === applicationId);
  if (!application) {
    return failure(404, "NOT_FOUND", "Planning team application not found");
  }

  if (application.status !== "pending") {
    return failure(409, "CONFLICT", "Planning team application is no longer pending");
  }

  const reviewedApplication: PlanningTeamApplication = {
    ...application,
    status: "rejected",
    reviewedAt: new Date().toISOString(),
    reviewedBy: walletAddress,
    reason: input.reason?.trim() || null
  };

  upsertPersistedPlanningTeamApplication(reviewedApplication);
  const hydratedTeam = listPlanningTeams().find((item) => item.id === teamId) ?? team;
  return {
    status: 200,
    body: {
      team: hydratedTeam,
      totalTeams: teams.length
    }
  };
}

export function leavePlanningTeam(
  input: LeavePlanningTeamInput
): ActionResult<{ team: PlanningTeam | null; totalTeams: number }> {
  const teamId = input.teamId.trim();
  const walletAddress = normalizeWallet(input.walletAddress);
  const teams = listPlanningTeams();
  const team = teams.find((item) => item.id === teamId);

  if (!team || !walletAddress) {
    return failure(400, "INVALID_INPUT", "Invalid planning team leave payload");
  }

  if (team.captainAddress === walletAddress) {
    return failure(403, "FORBIDDEN", "Captain must disband the team instead of leaving");
  }

  if (!team.members.some((member) => member.walletAddress === walletAddress)) {
    return failure(404, "NOT_FOUND", "Planning team member not found");
  }

  const nextTeam: PlanningTeam = {
    ...team,
    members: team.members.filter((member) => member.walletAddress !== walletAddress),
    memberCount: Math.max(0, team.memberCount - 1)
  };

  upsertPersistedPlanningTeam(nextTeam);
  const hydratedTeam = listPlanningTeams().find((item) => item.id === teamId) ?? nextTeam;
  return {
    status: 200,
    body: {
      team: hydratedTeam,
      totalTeams: teams.length
    }
  };
}

export function disbandPlanningTeam(
  input: DisbandPlanningTeamInput
): ActionResult<{ teamId: string; totalTeams: number }> {
  const teamId = input.teamId.trim();
  const walletAddress = normalizeWallet(input.walletAddress);
  const teams = listPlanningTeams();
  const team = teams.find((item) => item.id === teamId);

  if (!team || !walletAddress) {
    return failure(400, "INVALID_INPUT", "Invalid planning team disband payload");
  }

  if (team.captainAddress !== walletAddress) {
    return failure(403, "FORBIDDEN", "Only the captain can disband the team");
  }

  removePersistedPlanningTeam(teamId);
  return {
    status: 200,
    body: {
      teamId,
      totalTeams: Math.max(0, teams.length - 1)
    }
  };
}
