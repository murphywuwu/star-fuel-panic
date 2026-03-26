export type TeamStatus = "forming" | "locked" | "paid" | "ready";

export type PlayerRole = "collector" | "hauler" | "escort";
export type TeamApplicationStatus = "pending" | "approved" | "rejected";

export type RoleSlots = {
  collector: number;
  hauler: number;
  escort: number;
};

export type Team = {
  id: string;
  matchId: string;
  name: string;
  captainAddress: string;
  maxSize: number;
  isLocked: boolean;
  hasPaid: boolean;
  payTxDigest: string | null;
  totalScore: number;
  rank: number | null;
  prizeAmount: number | null;
  status: TeamStatus;
  createdAt: string;
};

export type TeamMember = {
  id: string;
  teamId: string;
  walletAddress: string;
  role: PlayerRole;
  slotStatus: "waiting" | "confirmed" | "locked";
  personalScore: number;
  prizeAmount: number | null;
  joinedAt: string;
};

export type TeamApplication = {
  applicationId: string;
  teamId: string;
  applicantAddress: string;
  role: PlayerRole;
  status: TeamApplicationStatus;
  reason?: string;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
};

export type TeamDetail = Team & {
  memberCount: number;
  roleSlots: RoleSlots;
  members: TeamMember[];
  applications: TeamApplication[];
  paymentAmount: string;
  paymentTxDigest: string | null;
  whitelistCount: number;
};

export type JoinTeamResponse = {
  applicationId: string;
  status: TeamApplicationStatus;
};
