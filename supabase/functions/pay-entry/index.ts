// @ts-nocheck

import { createClient } from "npm:@supabase/supabase-js@2";
import { registerWhitelistOnChain } from "../_shared/chain.ts";
import { corsHeaders, env, jsonResponse } from "../_shared/http.ts";
import { normalizeWallet, syncMissionCounters } from "../_shared/lobby.ts";

function uniqueAddresses(addresses: string[]) {
  return [...new Set(addresses.map((address) => normalizeWallet(address)).filter(Boolean))];
}

async function verifyPaymentTx(input: {
  txDigest: string;
  matchId: string;
  teamId: string;
  captainWallet: string;
  expectedAmount: number;
}) {
  if (!input.txDigest || input.txDigest.length < 8) {
    throw new Error("INVALID_TX_DIGEST");
  }

  const verifierUrl = Deno.env.get("PAYMENT_TX_VERIFIER_URL");
  if (!verifierUrl) {
    return {
      ok: true,
      source: "stub"
    };
  }

  const response = await fetch(verifierUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(`PAYMENT_VERIFY_HTTP_${response.status}`);
  }

  const data = await response.json();
  if (!data?.ok) {
    throw new Error(data?.error ?? "PAYMENT_VERIFY_FAILED");
  }

  return {
    ok: true,
    source: "gateway"
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
    const teamId = String(body?.teamId ?? "").trim();
    const captainWallet = normalizeWallet(String(body?.captainWallet ?? ""));
    const txDigest = String(body?.txDigest ?? "").trim();

    if (!matchId || !teamId || !captainWallet || !txDigest) {
      return jsonResponse(400, { error: "INVALID_INPUT" });
    }

    const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));

    const { data: matchRow, error: matchError } = await supabase
      .from("matches")
      .select("id, status, entry_fee")
      .eq("id", matchId)
      .maybeSingle();

    if (matchError) {
      return jsonResponse(500, { error: "MATCH_QUERY_FAILED", detail: matchError.message });
    }
    if (!matchRow) {
      return jsonResponse(404, { error: "MATCH_NOT_FOUND" });
    }
    if (matchRow.status !== "lobby" && matchRow.status !== "pre_start") {
      return jsonResponse(409, { error: "MATCH_NOT_PAYABLE" });
    }

    const { data: teamRow, error: teamError } = await supabase
      .from("teams")
      .select("id, match_id, captain_wallet, status")
      .eq("id", teamId)
      .eq("match_id", matchId)
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
    if (teamRow.status !== "locked") {
      return jsonResponse(409, { error: "TEAM_NOT_LOCKED" });
    }

    const { data: teamMembers, error: memberError } = await supabase
      .from("team_members")
      .select("wallet_address")
      .eq("team_id", teamId);

    if (memberError) {
      return jsonResponse(500, { error: "MEMBER_QUERY_FAILED", detail: memberError.message });
    }

    const memberWallets = uniqueAddresses((teamMembers ?? []).map((member: any) => member.wallet_address));
    const requestedAddresses = uniqueAddresses(
      Array.isArray(body?.memberAddresses) ? body.memberAddresses.map((item: unknown) => String(item)) : memberWallets
    );

    if (requestedAddresses.length !== memberWallets.length) {
      return jsonResponse(400, { error: "MEMBER_ADDRESS_MISMATCH" });
    }

    const memberSet = new Set(memberWallets);
    if (requestedAddresses.some((address) => !memberSet.has(address))) {
      return jsonResponse(400, { error: "MEMBER_ADDRESS_MISMATCH" });
    }

    const expectedAmount = Number(matchRow.entry_fee ?? 0) * memberWallets.length;

    try {
      await verifyPaymentTx({
        txDigest,
        matchId,
        teamId,
        captainWallet,
        expectedAmount
      });
    } catch (error) {
      return jsonResponse(400, {
        error: "PAYMENT_TX_INVALID",
        detail: error instanceof Error ? error.message : "PAYMENT_VERIFY_FAILED"
      });
    }

    const whitelistRows = requestedAddresses.map((address) => ({
      match_id: matchId,
      wallet_address: address,
      tx_digest: txDigest,
      registered_by: captainWallet
    }));

    const { error: whitelistError } = await supabase
      .from("match_whitelist")
      .upsert(whitelistRows, { onConflict: "match_id,wallet_address", ignoreDuplicates: false });

    if (whitelistError) {
      return jsonResponse(500, { error: "WHITELIST_UPSERT_FAILED", detail: whitelistError.message });
    }

    try {
      await registerWhitelistOnChain({
        matchId,
        captainWallet,
        paymentTxDigest: txDigest,
        addresses: requestedAddresses
      });
    } catch (error) {
      return jsonResponse(500, {
        error: "REGISTER_WHITELIST_CHAIN_FAILED",
        detail: error instanceof Error ? error.message : "CHAIN_CALL_FAILED"
      });
    }

    const { error: teamUpdateError } = await supabase
      .from("teams")
      .update({
        status: "paid",
        paid_tx_digest: txDigest,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", teamId);

    if (teamUpdateError) {
      return jsonResponse(500, { error: "TEAM_MARK_PAID_FAILED", detail: teamUpdateError.message });
    }

    await syncMissionCounters(supabase, matchId);

    return jsonResponse(200, {
      whitelistCount: requestedAddresses.length,
      teamStatus: "paid"
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "PAY_ENTRY_UNHANDLED",
      detail: error instanceof Error ? error.message : "UNKNOWN_ERROR"
    });
  }
});
