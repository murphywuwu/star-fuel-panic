// @ts-nocheck

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, env, jsonResponse } from "../_shared/http.ts";
import {
  normalizeRole,
  normalizeRoleSlots,
  normalizeWallet,
  syncMissionCounters,
  walletExistsInMatch
} from "../_shared/lobby.ts";

function mapTeam(team: any) {
  return {
    id: team.id,
    matchId: team.match_id,
    captainWallet: team.captain_wallet,
    teamName: team.team_name,
    maxSize: team.max_size,
    roleSlots: team.role_slots ?? [],
    status: team.status,
    totalScore: team.total_score,
    rank: team.rank,
    prizeAmount: team.prize_amount,
    createdAt: team.created_at
  };
}

function mapMember(member: any) {
  return {
    id: member.id,
    teamId: member.team_id,
    walletAddress: member.wallet_address,
    role: member.role,
    personalScore: member.personal_score,
    prizeAmount: member.prize_amount,
    joinedAt: member.joined_at
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { error: "METHOD_NOT_ALLOWED" });
  }

  try {
    const body = await request.json();
    const matchId = String(body?.matchId ?? "").trim();
    const teamName = String(body?.teamName ?? "").trim();
    const captainWallet = normalizeWallet(String(body?.captainWallet ?? ""));
    const maxSize = Number(body?.maxSize ?? 0);

    if (!matchId || !teamName || !captainWallet || !Number.isInteger(maxSize) || maxSize < 3 || maxSize > 8) {
      return jsonResponse(400, { error: "INVALID_INPUT" });
    }

    const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));

    const { data: matchRow, error: matchError } = await supabase
      .from("matches")
      .select("id, status, max_teams")
      .eq("id", matchId)
      .maybeSingle();

    if (matchError) {
      return jsonResponse(500, { error: "MATCH_QUERY_FAILED", detail: matchError.message });
    }
    if (!matchRow) {
      return jsonResponse(404, { error: "MATCH_NOT_FOUND" });
    }
    if (matchRow.status !== "lobby") {
      return jsonResponse(409, { error: "ROOM_NOT_JOINABLE" });
    }

    const { count: teamCount, error: countError } = await supabase
      .from("teams")
      .select("id", { count: "exact", head: true })
      .eq("match_id", matchId);

    if (countError) {
      return jsonResponse(500, { error: "TEAM_COUNT_FAILED", detail: countError.message });
    }
    if ((teamCount ?? 0) >= Number(matchRow.max_teams ?? 0)) {
      return jsonResponse(409, { error: "MAX_TEAMS_REACHED" });
    }

    if (await walletExistsInMatch(supabase, matchId, captainWallet)) {
      return jsonResponse(409, { error: "WALLET_ALREADY_IN_MATCH" });
    }

    const roleSlots = normalizeRoleSlots(body?.roleSlots, maxSize);
    const captainRole = normalizeRole(String(body?.captainRole ?? roleSlots[0] ?? "collector"));
    if (!roleSlots.includes(captainRole)) {
      roleSlots[0] = captainRole;
    }

    const teamPayload = {
      match_id: matchId,
      captain_wallet: captainWallet,
      team_name: teamName,
      max_size: maxSize,
      role_slots: roleSlots,
      status: "forming"
    };

    const { data: teamRow, error: teamInsertError } = await supabase
      .from("teams")
      .insert(teamPayload)
      .select("*")
      .single();

    if (teamInsertError) {
      const status = teamInsertError.code === "23505" ? 409 : 500;
      return jsonResponse(status, { error: "CREATE_TEAM_FAILED", detail: teamInsertError.message });
    }

    const memberPayload = {
      team_id: teamRow.id,
      wallet_address: captainWallet,
      role: captainRole
    };

    const { data: memberRow, error: memberInsertError } = await supabase
      .from("team_members")
      .insert(memberPayload)
      .select("*")
      .single();

    if (memberInsertError) {
      await supabase.from("teams").delete().eq("id", teamRow.id);
      return jsonResponse(500, { error: "CREATE_CAPTAIN_MEMBER_FAILED", detail: memberInsertError.message });
    }

    await syncMissionCounters(supabase, matchId);

    return jsonResponse(200, {
      team: mapTeam(teamRow),
      captainMember: mapMember(memberRow)
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "CREATE_TEAM_UNHANDLED",
      detail: error instanceof Error ? error.message : "UNKNOWN_ERROR"
    });
  }
});
