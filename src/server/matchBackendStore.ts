import {
  getPersistedMatchDetail,
  readRuntimeProjectionState,
  writeRuntimeProjectionState,
  type PersistedMatchTargetNode,
  type PersistedSettlement,
  type PersistedTeam
} from "./runtimeProjectionStore.ts";
import type { Match, MatchStatus } from "../types/match.ts";
import type { SettlementBill } from "../types/settlement.ts";
import type { TeamMember } from "../types/team.ts";

type BackendConfig = {
  baseUrl: string;
  serviceRoleKey: string;
};

type MatchRow = {
  id: string;
  status: string;
  entry_fee: number | string | null;
  min_teams: number | null;
  max_teams: number | null;
  duration_sec: number | null;
  created_at: string | null;
  updated_at: string | null;
  runtime_payload?: Match | null;
  creation_mode?: string | null;
  solar_system_id?: number | null;
  sponsorship_fee?: number | string | null;
  prize_pool?: number | string | null;
  host_prize_pool?: number | string | null;
  on_chain_id?: string | null;
  host_address?: string | null;
  created_by?: string | null;
  published_at?: string | null;
  publish_idempotency_key?: string | null;
};

type TeamRow = {
  id: string;
  match_id: string;
  captain_wallet: string;
  team_name: string;
  max_size: number;
  status: string;
  paid_tx_digest: string | null;
  total_score: number | null;
  rank: number | null;
  prize_amount: number | string | null;
  created_at: string | null;
  runtime_payload?: PersistedTeam | null;
};

type TeamMemberRow = {
  id: string;
  team_id: string;
  wallet_address: string;
  role: string;
  personal_score: number | null;
  prize_amount: number | string | null;
  joined_at: string | null;
  runtime_payload?: TeamMember | null;
};

type MatchTargetRow = {
  match_id: string;
  assembly_id: string;
};

type SettlementRow = {
  match_id: string;
  status: string;
  settlement_tx: string | null;
  bill_json: SettlementBill | null;
  updated_at: string | null;
  runtime_payload?: PersistedSettlement | null;
};

function resolveBackendConfig(): BackendConfig | null {
  const baseUrl =
    process.env.SUPABASE_URL?.trim() ??
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ??
    "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

  if (!baseUrl || !serviceRoleKey) {
    return null;
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    serviceRoleKey
  };
}

function readNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function toDbMatchStatus(status: MatchStatus): string {
  if (status === "prestart") {
    return "pre_start";
  }
  return status;
}

function fromDbMatchStatus(status: string | null | undefined): MatchStatus {
  if (status === "pre_start") {
    return "prestart";
  }
  if (status === "cancelled") {
    return "settled";
  }
  if (
    status === "draft" ||
    status === "lobby" ||
    status === "prestart" ||
    status === "running" ||
    status === "panic" ||
    status === "settling" ||
    status === "settled"
  ) {
    return status;
  }
  return "lobby";
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}) {
  const config = resolveBackendConfig();
  if (!config) {
    return null;
  }

  const response = await fetch(`${config.baseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`SUPABASE_${response.status}_${path}:${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  const body = await response.text().catch(() => "");
  if (!body.trim()) {
    return null;
  }

  return JSON.parse(body) as T;
}

function toMatchRow(match: Match): Record<string, unknown> {
  return {
    id: match.id,
    mission_id: null,
    status: toDbMatchStatus(match.status),
    entry_fee: match.entryFee,
    min_teams: match.minTeams,
    max_teams: match.maxTeams,
    duration_sec: match.durationMinutes * 60,
    creation_mode: match.creationMode,
    solar_system_id: match.solarSystemId ?? null,
    sponsorship_fee: match.sponsorshipFee ?? match.hostPrizePool ?? 0,
    prize_pool: match.prizePool,
    host_prize_pool: match.hostPrizePool,
    on_chain_id: match.onChainId,
    host_address: match.hostAddress,
    created_by: match.createdBy,
    published_at: match.publishedAt ?? null,
    publish_idempotency_key: match.publishIdempotencyKey ?? null,
    runtime_payload: match
  };
}

function toTeamRow(team: PersistedTeam): Record<string, unknown> {
  return {
    id: team.id,
    match_id: team.matchId,
    captain_wallet: team.captainAddress,
    team_name: team.name,
    max_size: team.maxSize,
    role_slots: Array.isArray(team.roleSlots)
      ? team.roleSlots
      : [
          ...Array(team.roleSlots.collector).fill("collector"),
          ...Array(team.roleSlots.hauler).fill("hauler"),
          ...Array(team.roleSlots.escort).fill("escort")
        ],
    status: team.status,
    paid_tx_digest: team.payTxDigest,
    total_score: team.totalScore,
    rank: team.rank,
    prize_amount: team.prizeAmount,
    runtime_payload: team
  };
}

function toTeamMemberRow(member: TeamMember): Record<string, unknown> {
  return {
    id: member.id,
    team_id: member.teamId,
    wallet_address: member.walletAddress,
    role: member.role,
    personal_score: member.personalScore,
    prize_amount: member.prizeAmount,
    joined_at: member.joinedAt,
    runtime_payload: member
  };
}

function normalizeMatch(row: MatchRow): Match {
  if (row.runtime_payload && typeof row.runtime_payload === "object") {
    return {
      ...row.runtime_payload,
      status: fromDbMatchStatus((row.runtime_payload as Match).status ?? row.status)
    };
  }

  return {
    id: row.id,
    onChainId: row.on_chain_id ?? null,
    status: fromDbMatchStatus(row.status),
    creationMode: row.creation_mode === "precision" ? "precision" : "free",
    solarSystemId: row.solar_system_id ?? undefined,
    targetNodeIds: [],
    urgency: undefined,
    prizePool: readNumber(row.prize_pool),
    hostPrizePool: readNumber(row.host_prize_pool),
    entryFee: readNumber(row.entry_fee),
    platformSubsidy: 0,
    minTeams: row.min_teams ?? 2,
    maxTeams: row.max_teams ?? 10,
    minPlayers: 0,
    registeredTeams: 0,
    paidTeams: 0,
    startThresholdText: undefined,
    durationMinutes: Math.max(1, Math.floor(readNumber(row.duration_sec, 600) / 60)),
    scoringMode: "weighted",
    triggerMode: "min_threshold",
    triggerNodeId: undefined,
    triggerNodeName: undefined,
    startedAt: null,
    endedAt: null,
    createdBy: row.created_by ?? "system",
    hostAddress: row.host_address ?? null,
    sponsorshipFee: readNumber(row.sponsorship_fee),
    publishedAt: row.published_at ?? null,
    publishIdempotencyKey: row.publish_idempotency_key ?? null,
    createdAt: row.created_at ?? new Date().toISOString()
  };
}

function normalizeTeam(row: TeamRow): PersistedTeam {
  if (row.runtime_payload && typeof row.runtime_payload === "object") {
    return row.runtime_payload;
  }

  return {
    id: row.id,
    matchId: row.match_id,
    name: row.team_name,
    captainAddress: row.captain_wallet,
    maxSize: row.max_size,
    isLocked: row.status === "locked" || row.status === "paid" || row.status === "ready",
    hasPaid: Boolean(row.paid_tx_digest) || row.status === "paid" || row.status === "ready",
    payTxDigest: row.paid_tx_digest,
    totalScore: readNumber(row.total_score),
    rank: row.rank,
    prizeAmount: readNumber(row.prize_amount),
    status: row.status === "locked" || row.status === "paid" || row.status === "ready" ? row.status : "forming",
    createdAt: row.created_at ?? new Date().toISOString(),
    roleSlots: [],
    whitelistCount: 0
  };
}

function normalizeTeamMember(row: TeamMemberRow): TeamMember {
  if (row.runtime_payload && typeof row.runtime_payload === "object") {
    return row.runtime_payload;
  }

  return {
    id: row.id,
    teamId: row.team_id,
    walletAddress: row.wallet_address,
    role: row.role === "hauler" || row.role === "escort" ? row.role : "collector",
    slotStatus: "confirmed",
    personalScore: readNumber(row.personal_score),
    prizeAmount: readNumber(row.prize_amount),
    joinedAt: row.joined_at ?? new Date().toISOString()
  };
}

function normalizeSettlement(row: SettlementRow): PersistedSettlement {
  if (row.runtime_payload && typeof row.runtime_payload === "object") {
    return row.runtime_payload;
  }

  return {
    matchId: row.match_id,
    bill: row.bill_json ?? {
      matchId: row.match_id,
      sponsorshipFee: "0",
      entryFeeTotal: "0",
      platformSubsidy: "0",
      grossPool: "0",
      platformFeeRate: 0.05,
      platformFee: "0",
      payoutPool: "0",
      payoutTxDigest: row.settlement_tx ?? null,
      teamBreakdown: [],
      mvp: null
    },
    payoutTxDigest: row.settlement_tx ?? null,
    updatedAt: row.updated_at ?? new Date().toISOString(),
    status: row.status === "failed" ? "failed" : row.status === "settled" ? "succeeded" : "running"
  };
}

function buildTargetNodeSnapshot(matchId: string, targetNodeId: string): PersistedMatchTargetNode {
  return {
    matchId,
    nodeObjectId: targetNodeId,
    capturedFillRatio: 0,
    capturedUrgency: "safe",
    name: `Node ${targetNodeId.slice(-6)}`,
    isOnline: true
  };
}

export function isMatchBackendConfigured() {
  return resolveBackendConfig() !== null;
}

export async function persistMatchDetailToBackend(matchId: string) {
  if (!isMatchBackendConfigured()) {
    return false;
  }

  const projection = getPersistedMatchDetail(matchId);
  if (!projection) {
    return false;
  }

  await supabaseRequest("matches?on_conflict=id", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify([toMatchRow(projection.match)])
  });

  await supabaseRequest(`match_targets?match_id=eq.${encodeURIComponent(matchId)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal"
    }
  });

  if (projection.match.targetNodeIds.length > 0) {
    await supabaseRequest("match_targets", {
      method: "POST",
      headers: {
        Prefer: "return=minimal"
      },
      body: JSON.stringify(
        projection.match.targetNodeIds.map((targetNodeId) => ({
          match_id: matchId,
          assembly_id: targetNodeId
        }))
      )
    });
  }

  await supabaseRequest(`team_members?team_id=in.(${projection.teams.map((team) => team.id).join(",") || "null"})`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal"
    }
  }).catch(() => null);

  await supabaseRequest(`teams?match_id=eq.${encodeURIComponent(matchId)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal"
    }
  });

  if (projection.teams.length > 0) {
    await supabaseRequest("teams?on_conflict=id", {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(projection.teams.map((team) => toTeamRow(team)))
    });
  }

  if (projection.members.length > 0) {
    await supabaseRequest("team_members?on_conflict=id", {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(projection.members.map((member) => toTeamMemberRow(member)))
    });
  }

  if (projection.settlement) {
    await supabaseRequest("settlements?on_conflict=match_id", {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify([
        {
          match_id: projection.settlement.matchId,
          status:
            projection.settlement.status === "succeeded"
              ? "settled"
              : projection.settlement.status === "failed"
                ? "failed"
                : "committed",
          settlement_tx: projection.settlement.payoutTxDigest,
          bill_json: projection.settlement.bill,
          runtime_payload: projection.settlement,
          result_hash: projection.settlement.matchId
        }
      ])
    });
  }

  return true;
}

export async function persistMatchDetailForTeamToBackend(teamId: string) {
  const state = readRuntimeProjectionState();
  const team = state.teams.find((candidate) => candidate.id === teamId);
  if (!team) {
    return false;
  }

  return persistMatchDetailToBackend(team.matchId);
}

export async function deleteMatchDetailFromBackend(matchId: string) {
  if (!isMatchBackendConfigured()) {
    return false;
  }

  await supabaseRequest(`matches?id=eq.${encodeURIComponent(matchId)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal"
    }
  });

  return true;
}

export async function hydrateRuntimeProjectionFromBackendIfNeeded(options: { matchId?: string; force?: boolean } = {}) {
  if (!isMatchBackendConfigured()) {
    return false;
  }

  const current = readRuntimeProjectionState();
  if (!options.force) {
    if (options.matchId && current.matches.some((match) => match.id === options.matchId)) {
      return false;
    }
    if (!options.matchId && current.matches.length > 0) {
      return false;
    }
  }

  const matchPath = options.matchId
    ? `matches?select=*&id=eq.${encodeURIComponent(options.matchId)}`
    : "matches?select=*";
  const matchRows = (await supabaseRequest<MatchRow[]>(matchPath, {
    method: "GET",
    headers: {
      Prefer: "return=representation"
    }
  })) ?? [];

  if (matchRows.length === 0) {
    return false;
  }

  const matchIds = matchRows.map((row) => row.id);
  const matchIdFilter = `(${matchIds.join(",")})`;
  const teamRows =
    (await supabaseRequest<TeamRow[]>(`teams?select=*&match_id=in.${matchIdFilter}`, {
      method: "GET",
      headers: {
        Prefer: "return=representation"
      }
    })) ?? [];

  const teamIds = teamRows.map((row) => row.id);
  const teamIdFilter = teamIds.length > 0 ? `(${teamIds.join(",")})` : null;
  const teamMemberRows =
    teamIdFilter
      ? ((await supabaseRequest<TeamMemberRow[]>(`team_members?select=*&team_id=in.${teamIdFilter}`, {
          method: "GET",
          headers: {
            Prefer: "return=representation"
          }
        })) ?? [])
      : [];
  const targetRows =
    (await supabaseRequest<MatchTargetRow[]>(`match_targets?select=*&match_id=in.${matchIdFilter}`, {
      method: "GET",
      headers: {
        Prefer: "return=representation"
      }
    })) ?? [];
  const settlementRows =
    (await supabaseRequest<SettlementRow[]>(`settlements?select=*&match_id=in.${matchIdFilter}`, {
      method: "GET",
      headers: {
        Prefer: "return=representation"
      }
    })) ?? [];

  const next = readRuntimeProjectionState();
  const matches = matchRows.map((row) => normalizeMatch(row));
  const teams = teamRows.map((row) => normalizeTeam(row));
  const members = teamMemberRows.map((row) => normalizeTeamMember(row));
  const settlements = settlementRows.map((row) => normalizeSettlement(row));

  next.matches = [
    ...next.matches.filter((match) => !matchIds.includes(match.id)),
    ...matches
  ];
  next.teams = [
    ...next.teams.filter((team) => !matchIds.includes(team.matchId)),
    ...teams
  ];
  next.teamMembers = [
    ...next.teamMembers.filter((member) => !teamIds.includes(member.teamId)),
    ...members
  ];
  next.matchTargetNodes = [
    ...next.matchTargetNodes.filter((row) => !matchIds.includes(row.matchId)),
    ...targetRows.map((row) => buildTargetNodeSnapshot(row.match_id, row.assembly_id))
  ];
  next.settlements = [
    ...next.settlements.filter((settlement) => !matchIds.includes(settlement.matchId)),
    ...settlements
  ];

  writeRuntimeProjectionState(next);
  return true;
}
