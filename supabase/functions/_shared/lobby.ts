// @ts-nocheck

export const ALLOWED_ROLES = ["collector", "hauler", "escort"] as const;

export function normalizeWallet(wallet: string) {
  return wallet.trim().toLowerCase();
}

export function normalizeRole(role: string) {
  const value = role.trim().toLowerCase();
  if (ALLOWED_ROLES.includes(value as (typeof ALLOWED_ROLES)[number])) {
    return value;
  }
  throw new Error("INVALID_ROLE");
}

function cycleDefaultRoles(size: number) {
  const result: string[] = [];
  for (let i = 0; i < size; i += 1) {
    result.push(ALLOWED_ROLES[i % ALLOWED_ROLES.length]);
  }
  return result;
}

export function normalizeRoleSlots(input: unknown, maxSize: number) {
  if (!Array.isArray(input) || input.length === 0) {
    return cycleDefaultRoles(maxSize);
  }

  const sanitized = input
    .map((item) => String(item).trim().toLowerCase())
    .filter((item) => ALLOWED_ROLES.includes(item as (typeof ALLOWED_ROLES)[number]));

  if (sanitized.length === 0) {
    return cycleDefaultRoles(maxSize);
  }

  const normalized = sanitized.slice(0, maxSize);
  while (normalized.length < Math.min(maxSize, 3)) {
    normalized.push(ALLOWED_ROLES[normalized.length % ALLOWED_ROLES.length]);
  }
  return normalized;
}

export function countByRole(members: Array<{ role: string }>) {
  const counts: Record<string, number> = {
    collector: 0,
    hauler: 0,
    escort: 0
  };

  for (const member of members) {
    const role = String(member.role ?? "").toLowerCase();
    if (counts[role] !== undefined) {
      counts[role] += 1;
    }
  }

  return counts;
}

export function roleSlotsSatisfied(roleSlots: string[], members: Array<{ role: string }>) {
  const required = countByRole(roleSlots.map((role) => ({ role })));
  const actual = countByRole(members);

  for (const role of ALLOWED_ROLES) {
    if ((actual[role] ?? 0) < (required[role] ?? 0)) {
      return false;
    }
  }

  return true;
}

export async function walletExistsInMatch(supabase: any, matchId: string, walletAddress: string) {
  const normalizedWallet = normalizeWallet(walletAddress);

  const { data: teamRows, error: teamError } = await supabase
    .from("teams")
    .select("id")
    .eq("match_id", matchId);

  if (teamError) {
    throw new Error(`TEAM_QUERY_FAILED:${teamError.message}`);
  }

  const teamIds = (teamRows ?? []).map((row: any) => row.id);
  if (teamIds.length === 0) {
    return false;
  }

  const { data: memberRow, error: memberError } = await supabase
    .from("team_members")
    .select("id")
    .in("team_id", teamIds)
    .eq("wallet_address", normalizedWallet)
    .maybeSingle();

  if (memberError && memberError.code !== "PGRST116") {
    throw new Error(`TEAM_MEMBER_QUERY_FAILED:${memberError.message}`);
  }

  return Boolean(memberRow);
}

export async function syncMissionCounters(supabase: any, matchId: string) {
  const { data: matchRow, error: matchError } = await supabase
    .from("matches")
    .select("mission_id")
    .eq("id", matchId)
    .maybeSingle();

  if (matchError) {
    throw new Error(`MATCH_LOOKUP_FAILED:${matchError.message}`);
  }
  if (!matchRow?.mission_id) {
    return;
  }

  const { data: teams, error: teamError } = await supabase
    .from("teams")
    .select("team_name, status")
    .eq("match_id", matchId);

  if (teamError) {
    throw new Error(`TEAM_STATS_FAILED:${teamError.message}`);
  }

  const registeredTeams = teams?.length ?? 0;
  const paidTeams = (teams ?? []).filter((team: any) => team.status === "paid").length;
  const participatingTeams = (teams ?? []).map((team: any) => team.team_name).filter(Boolean);

  const { error: updateError } = await supabase
    .from("missions")
    .update({
      registered_teams: registeredTeams,
      paid_teams: paidTeams,
      participating_teams: participatingTeams,
      updated_at: new Date().toISOString()
    })
    .eq("id", matchRow.mission_id);

  if (updateError) {
    throw new Error(`MISSION_COUNTER_UPDATE_FAILED:${updateError.message}`);
  }
}
