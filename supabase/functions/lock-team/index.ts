// @ts-nocheck

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, env, jsonResponse } from "../_shared/http.ts";
import {
  normalizeWallet,
  roleSlotsSatisfied,
  syncMissionCounters
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

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "METHOD_NOT_ALLOWED" });
  }

  try {
    const body = await request.json();
    const teamId = String(body?.teamId ?? "").trim();
    const captainWallet = normalizeWallet(String(body?.captainWallet ?? ""));

    if (!teamId || !captainWallet) {
      return jsonResponse(400, { error: "INVALID_INPUT" });
    }

    const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));

    const { data: teamRow, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .maybeSingle();

    if (teamError) {
      return jsonResponse(500, { error: "TEAM_QUERY_FAILED", detail: teamError.message });
    }
    if (!teamRow) {
      return jsonResponse(404, { error: "TEAM_NOT_FOUND" });
    }

    if (normalizeWallet(teamRow.captain_wallet) !== captainWallet) {
      return jsonResponse(403, { error: "FORBIDDEN_NOT_CAPTAIN" });
    }

    if (teamRow.status === "paid") {
      return jsonResponse(409, { error: "TEAM_ALREADY_PAID" });
    }
    if (teamRow.status !== "forming") {
      return jsonResponse(409, { error: "TEAM_ALREADY_LOCKED" });
    }

    const { data: matchRow, error: matchError } = await supabase
      .from("matches")
      .select("id, status, min_players")
      .eq("id", teamRow.match_id)
      .maybeSingle();

    if (matchError) {
      return jsonResponse(500, { error: "MATCH_QUERY_FAILED", detail: matchError.message });
    }
    if (!matchRow || matchRow.status !== "lobby") {
      return jsonResponse(409, { error: "ROOM_NOT_JOINABLE" });
    }

    const { data: members, error: memberError } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", teamId);

    if (memberError) {
      return jsonResponse(500, { error: "MEMBER_QUERY_FAILED", detail: memberError.message });
    }

    if ((members?.length ?? 0) < Number(matchRow.min_players ?? 1)) {
      return jsonResponse(409, { error: "TEAM_NOT_READY" });
    }

    if (!roleSlotsSatisfied(teamRow.role_slots ?? [], members ?? [])) {
      return jsonResponse(409, { error: "ROLE_SLOTS_INCOMPLETE" });
    }

    const { data: updatedTeam, error: updateError } = await supabase
      .from("teams")
      .update({ status: "locked", updated_at: new Date().toISOString() })
      .eq("id", teamId)
      .select("*")
      .single();

    if (updateError) {
      return jsonResponse(500, { error: "LOCK_TEAM_FAILED", detail: updateError.message });
    }

    await syncMissionCounters(supabase, teamRow.match_id);

    return jsonResponse(200, {
      team: mapTeam(updatedTeam)
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "LOCK_TEAM_UNHANDLED",
      detail: error instanceof Error ? error.message : "UNKNOWN_ERROR"
    });
  }
});
