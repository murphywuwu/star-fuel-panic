import type { PlayerRole, RoleSlots } from "./team";

export type PlanningTeamMember = {
  walletAddress: string;
  role: PlayerRole;
  joinedAt: string;
};

export type PlanningTeamApplicationStatus = "pending" | "approved" | "rejected";

export type PlanningTeamApplication = {
  id: string;
  teamId: string;
  applicantWalletAddress: string;
  role: PlayerRole;
  status: PlanningTeamApplicationStatus;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reason: string | null;
};

export type PlanningTeam = {
  id: string;
  name: string;
  captainAddress: string;
  maxMembers: number;
  memberCount: number;
  roleSlots: RoleSlots;
  members: PlanningTeamMember[];
  applications: PlanningTeamApplication[];
  createdAt: string;
};
