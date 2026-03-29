import type { PlayerRole, RoleSlots } from "./team";

export type PlanningTeamMember = {
  walletAddress: string;
  role: PlayerRole;
  joinedAt: string;
};

export type PlanningTeam = {
  id: string;
  name: string;
  captainAddress: string;
  maxMembers: number;
  memberCount: number;
  roleSlots: RoleSlots;
  members: PlanningTeamMember[];
  createdAt: string;
};
