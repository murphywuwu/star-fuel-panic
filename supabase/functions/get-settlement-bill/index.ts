// @ts-nocheck

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildSettlementBill,
  mapTeamsWithMembers,
  parseNumeric
} from "../_shared/settlement.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
};

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}

function env(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`MISSING_ENV_${name}`);
  }
  return value;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "GET") {
    return jsonResponse(405, { error: "METHOD_NOT_ALLOWED" });
  }

  try {
    const url = new URL(req.url);
    const matchId = url.searchParams.get("matchId");
    if (!matchId) {
      return jsonResponse(400, { error: "INVALID_MATCH_ID" });
    }

    const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));

    const { data: settlementRow, error: settlementError } = await supabase
      .from("settlements")
      .select("status, gross_pool, platform_fee, payout_pool, result_hash, commitment_tx, settlement_tx, bill_json")
      .eq("match_id", matchId)
      .maybeSingle();

    if (settlementError) {
      return jsonResponse(500, { error: "SETTLEMENT_QUERY_FAILED", detail: settlementError.message });
    }
    if (!settlementRow) {
      return jsonResponse(404, { error: "SETTLEMENT_NOT_FOUND" });
    }

    if (settlementRow.status !== "settled" && settlementRow.status !== "committed") {
      return jsonResponse(409, { error: "MATCH_NOT_SETTLED" });
    }

    if (settlementRow.bill_json && typeof settlementRow.bill_json === "object" && settlementRow.bill_json.matchId) {
      return jsonResponse(200, { bill: settlementRow.bill_json });
    }

    const { data: teams, error: teamError } = await supabase
      .from("teams")
      .select("id, team_name, total_score, team_members(wallet_address, role, personal_score)")
      .eq("match_id", matchId);

    if (teamError) {
      return jsonResponse(500, { error: "TEAM_QUERY_FAILED", detail: teamError.message });
    }

    const bill = await buildSettlementBill({
      matchId,
      grossPool: parseNumeric(settlementRow.gross_pool, 0),
      platformFee: parseNumeric(settlementRow.platform_fee, 0),
      payoutPool: parseNumeric(settlementRow.payout_pool, 0),
      status: settlementRow.status,
      commitmentTx: settlementRow.commitment_tx,
      settlementTx: settlementRow.settlement_tx,
      teams: mapTeamsWithMembers(teams ?? [])
    });

    return jsonResponse(200, { bill });
  } catch (error) {
    return jsonResponse(500, {
      error: "GET_SETTLEMENT_BILL_FAILED",
      detail: error instanceof Error ? error.message : "UNKNOWN_ERROR"
    });
  }
});
