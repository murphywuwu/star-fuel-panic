// @ts-nocheck

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, env, jsonResponse } from "../_shared/http.ts";
import {
  countByRole,
  normalizeRole,
  normalizeWallet,
  walletExistsInMatch
} from "../_shared/lobby.ts";

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
    const teamId = String(body?.teamId ?? "").trim();
    const walletAddress = normalizeWallet(String(body?.walletAddress ?? ""));
    const role = normalizeRole(String(body?.role ?? ""));

    if (!teamId || !walletAddress) {
      return jsonResponse(400, { error: "INVALID_INPUT" });
    }

    const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));

    const { data: teamRow, error: teamError } = await supabase
      .from("teams")
      .select("id, match_id, status, max_size, role_slots")
      .eq("id", teamId)
      .maybeSingle();

    if (teamError) {
      return jsonResponse(500, { error: "TEAM_QUERY_FAILED", detail: teamError.message });
    }
    if (!teamRow) {
      return jsonResponse(404, { error: "TEAM_NOT_FOUND" });
    }

    const { data: matchRow, error: matchError } = await supabase
      .from("matches")
      .select("id, status")
      .eq("id", teamRow.match_id)
      .maybeSingle();

    if (matchError) {
      return jsonResponse(500, { error: "MATCH_QUERY_FAILED", detail: matchError.message });
    }
    if (!matchRow || matchRow.status !== "lobby") {
      return jsonResponse(409, { error: "ROOM_NOT_JOINABLE" });
    }

    if (teamRow.status !== "forming") {
      return jsonResponse(409, { error: "TEAM_NOT_JOINABLE" });
    }

    if (await walletExistsInMatch(supabase, teamRow.match_id, walletAddress)) {
      return jsonResponse(409, { error: "WALLET_ALREADY_IN_MATCH" });
    }

    const { data: members, error: membersError } = await supabase
      .from("team_members")
      .select("id, role")
      .eq("team_id", teamId);

    if (membersError) {
      return jsonResponse(500, { error: "MEMBER_QUERY_FAILED", detail: membersError.message });
    }

    if ((members?.length ?? 0) >= Number(teamRow.max_size ?? 0)) {
      return jsonResponse(409, { error: "TEAM_FULL" });
    }

    const required = countByRole((teamRow.role_slots ?? []).map((item: string) => ({ role: item })));
    const actual = countByRole((members ?? []).map((item: any) => ({ role: item.role })));
    if ((required[role] ?? 0) > 0 && (actual[role] ?? 0) >= (required[role] ?? 0)) {
      return jsonResponse(409, { error: "ROLE_ALREADY_TAKEN" });
    }

    const { data: memberRow, error: insertError } = await supabase
      .from("team_members")
      .insert({
        team_id: teamId,
        wallet_address: walletAddress,
        role
      })
      .select("*")
      .single();

    if (insertError) {
      const status = insertError.code === "23505" ? 409 : 500;
      return jsonResponse(status, { error: "JOIN_TEAM_FAILED", detail: insertError.message });
    }

    return jsonResponse(200, {
      member: mapMember(memberRow)
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "JOIN_TEAM_UNHANDLED",
      detail: error instanceof Error ? error.message : "UNKNOWN_ERROR"
    });
  }
});
