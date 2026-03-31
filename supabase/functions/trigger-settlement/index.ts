// @ts-nocheck

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildSettlementBill,
  mapTeamsWithMembers,
  parseNumeric,
  roundPoolValues
} from "../_shared/settlement.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
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

async function submitSettlementOnChain(matchId: string, bill: any) {
  const chainSubmitter = Deno.env.get("SETTLEMENT_CHAIN_SUBMITTER_URL");
  if (!chainSubmitter) {
    const digestSeed = `${matchId}:${bill.resultHash}:${Date.now()}`;
    return `stub_tx_${await crypto.subtle.digest("SHA-256", new TextEncoder().encode(digestSeed)).then((hash) =>
      [...new Uint8Array(hash)].map((item) => item.toString(16).padStart(2, "0")).join("").slice(0, 32)
    )}`;
  }

  const response = await fetch(chainSubmitter, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      matchId,
      resultHash: bill.resultHash,
      payoutAddresses: bill.teamBreakdown.flatMap((team) => team.members.map((member) => member.walletAddress)),
      payoutAmounts: bill.teamBreakdown.flatMap((team) => team.members.map((member) => member.prizeAmount))
    })
  });

  if (!response.ok) {
    throw new Error(`CHAIN_SUBMIT_FAILED_${response.status}`);
  }
  const data = await response.json();
  return data.settlementTx ?? data.txDigest ?? data.digest;
}

async function loadMatchSettlementContext(supabase, matchId: string) {
  const [{ data: matchRow, error: matchError }, { data: teams, error: teamError }] = await Promise.all([
    supabase
      .from("matches")
      .select("id, status, entry_fee, platform_subsidy")
      .eq("id", matchId)
      .maybeSingle(),
    supabase
      .from("teams")
      .select("id, team_name, total_score, team_members(wallet_address, role, personal_score)")
      .eq("match_id", matchId)
  ]);

  if (matchError) {
    throw new Error(`MATCH_QUERY_FAILED:${matchError.message}`);
  }
  if (!matchRow) {
    return null;
  }
  if (teamError) {
    throw new Error(`TEAMS_QUERY_FAILED:${teamError.message}`);
  }

  return {
    matchRow,
    teams: mapTeamsWithMembers(teams ?? [])
  };
}

async function buildBillFromContext(matchId: string, context: any) {
  const teamCount = context.teams.length;
  const participantCount = context.teams.reduce((sum, team) => sum + team.members.length, 0);
  const entryFee = parseNumeric(context.matchRow.entry_fee, 0);
  const subsidy = parseNumeric(context.matchRow.platform_subsidy, 0);
  const grossPool = participantCount * entryFee + subsidy;

  const platformFeeBps = parseNumeric(Deno.env.get("SETTLEMENT_PLATFORM_FEE_BPS"), 1000);
  const rounded = roundPoolValues(grossPool, platformFeeBps);

  const bill = await buildSettlementBill({
    matchId,
    grossPool: rounded.grossPool,
    platformFee: rounded.platformFee,
    payoutPool: rounded.payoutPool,
    status: teamCount > 0 ? "committed" : "failed",
    teams: context.teams
  });

  return bill;
}

async function persistDistribution(supabase, bill: any) {
  for (const team of bill.teamBreakdown) {
    await supabase
      .from("teams")
      .update({
        rank: team.rank,
        prize_amount: team.prizeAmount
      })
      .eq("id", team.teamId);

    for (const member of team.members) {
      await supabase
        .from("team_members")
        .update({ prize_amount: member.prizeAmount })
        .eq("team_id", team.teamId)
        .eq("wallet_address", member.walletAddress);
    }
  }
}

async function readExistingBill(supabase, matchId: string) {
  const { data, error } = await supabase
    .from("settlements")
    .select("id, status, bill_json")
    .eq("match_id", matchId)
    .maybeSingle();

  if (error) {
    throw new Error(`SETTLEMENT_READ_FAILED:${error.message}`);
  }
  if (!data) {
    return null;
  }

  if (data.bill_json && typeof data.bill_json === "object" && data.bill_json.matchId) {
    return {
      status: data.status,
      bill: data.bill_json
    };
  }

  return {
    status: data.status,
    bill: null
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "METHOD_NOT_ALLOWED" });
  }

  try {
    const { matchId } = await req.json();
    if (!matchId || typeof matchId !== "string") {
      return jsonResponse(400, { error: "INVALID_MATCH_ID" });
    }

    const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
    const existing = await readExistingBill(supabase, matchId);
    if (existing?.bill) {
      return jsonResponse(200, {
        idempotent: true,
        bill: existing.bill
      });
    }

    const context = await loadMatchSettlementContext(supabase, matchId);
    if (!context) {
      return jsonResponse(404, { error: "MATCH_NOT_FOUND" });
    }

    const committedBill = await buildBillFromContext(matchId, context);
    const upsertPayload = {
      match_id: matchId,
      gross_pool: committedBill.grossPool,
      platform_fee: committedBill.platformFee,
      payout_pool: committedBill.payoutPool,
      result_hash: committedBill.resultHash,
      commitment_tx: committedBill.commitmentTx,
      settlement_tx: committedBill.settlementTx,
      status: committedBill.status,
      bill_json: committedBill
    };

    const { error: upsertError } = await supabase
      .from("settlements")
      .upsert(upsertPayload, { onConflict: "match_id" });

    if (upsertError) {
      return jsonResponse(500, { error: "SETTLEMENT_UPSERT_FAILED", detail: upsertError.message });
    }

    await persistDistribution(supabase, committedBill);

    const settlementTx = await submitSettlementOnChain(matchId, committedBill);
    const settledBill = {
      ...committedBill,
      status: "settled",
      settlementTx
    };

    const { error: settleUpdateError } = await supabase
      .from("settlements")
      .update({
        status: "settled",
        settlement_tx: settlementTx,
        bill_json: settledBill
      })
      .eq("match_id", matchId);

    if (settleUpdateError) {
      return jsonResponse(500, {
        error: "SETTLEMENT_FINALIZE_FAILED",
        detail: settleUpdateError.message
      });
    }

    await supabase
      .from("matches")
      .update({
        status: "settled",
        end_tx: settlementTx
      })
      .eq("id", matchId);

    return jsonResponse(200, {
      idempotent: false,
      bill: settledBill
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "TRIGGER_SETTLEMENT_FAILED",
      detail: error instanceof Error ? error.message : "UNKNOWN_ERROR"
    });
  }
});
