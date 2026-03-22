// @ts-nocheck

import { createClient } from "npm:@supabase/supabase-js@2";
import { startMatchOnChain } from "../_shared/chain.ts";
import { canTransition, computeRemainingSec } from "../_shared/matchState.ts";
import { corsHeaders, env, jsonResponse } from "../_shared/http.ts";

const PANIC_THRESHOLD_SEC = 90;

type MatchRow = {
  id: string;
  status: "lobby" | "pre_start" | "running" | "panic" | "settling" | "settled";
  start_rule_mode: "full_paid" | "min_team_force_start";
  min_teams: number;
  max_teams: number;
  min_players: number;
  force_start_sec: number;
  pre_start_sec: number;
  duration_sec: number;
  countdown_sec: number | null;
  start_at: string | null;
  panic_at: string | null;
  end_at: string | null;
  start_tx: string | null;
  end_tx: string | null;
};

function nowIso() {
  return new Date().toISOString();
}

async function writeAuditLog(
  supabase: any,
  input: {
    matchId: string;
    eventType: string;
    detail: Record<string, unknown>;
    reasonCode?: string;
    severity?: "info" | "warning" | "critical";
  }
) {
  await supabase.from("audit_logs").insert({
    match_id: input.matchId,
    event_type: input.eventType,
    reason_code: input.reasonCode ?? null,
    severity: input.severity ?? null,
    detail: input.detail,
    created_at: nowIso()
  });
}

async function safeTransition(
  supabase: any,
  match: MatchRow,
  targetStatus: MatchRow["status"],
  patch?: Record<string, unknown>
) {
  if (!canTransition(match.status, targetStatus)) {
    await writeAuditLog(supabase, {
      matchId: match.id,
      eventType: "state_transition_rejected",
      reasonCode: "INVALID_STATE_TRANSITION",
      severity: "warning",
      detail: {
        from: match.status,
        to: targetStatus,
        patch: patch ?? {}
      }
    });
    return false;
  }

  const payload = {
    ...patch,
    status: targetStatus,
    updated_at: nowIso()
  };

  const { error } = await supabase
    .from("matches")
    .update(payload)
    .eq("id", match.id)
    .eq("status", match.status);

  if (error) {
    await writeAuditLog(supabase, {
      matchId: match.id,
      eventType: "state_transition_failed",
      reasonCode: "MATCH_UPDATE_FAILED",
      severity: "critical",
      detail: {
        from: match.status,
        to: targetStatus,
        error: error.message
      }
    });
    return false;
  }

  await writeAuditLog(supabase, {
    matchId: match.id,
    eventType: "state_transition",
    severity: "info",
    detail: {
      from: match.status,
      to: targetStatus,
      patch: patch ?? {}
    }
  });

  match.status = targetStatus;
  Object.assign(match, patch ?? {});
  return true;
}

async function broadcastPanicMode(supabase: any, matchId: string) {
  try {
    const channel = supabase.channel(`match:${matchId}`);
    await channel.subscribe();
    await channel.send({
      type: "broadcast",
      event: "panic_mode",
      payload: {
        matchId,
        triggeredAt: nowIso()
      }
    });
    await channel.unsubscribe();
  } catch {
    // Broadcast failure should not block state transition.
  }
}

async function triggerSettlement(matchId: string) {
  const baseUrl = env("SUPABASE_URL").replace(/\/$/, "");
  const serviceRole = env("SUPABASE_SERVICE_ROLE_KEY");

  const response = await fetch(`${baseUrl}/functions/v1/trigger-settlement`, {
    method: "POST",
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ matchId })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      ok: false,
      error: data?.error ?? `HTTP_${response.status}`,
      detail: data?.detail ?? null
    };
  }

  return {
    ok: true,
    bill: data?.bill ?? null
  };
}

async function readTeamSnapshots(supabase: any, matchId: string) {
  const { data, error } = await supabase
    .from("teams")
    .select("id, status, team_members(id)")
    .eq("match_id", matchId);

  if (error) {
    throw new Error(`TEAM_SNAPSHOT_FAILED:${error.message}`);
  }

  return data ?? [];
}

async function processLobbyMatch(supabase: any, match: MatchRow) {
  const teams = await readTeamSnapshots(supabase, match.id);
  const teamCount = teams.length;
  const paidTeams = teams.filter((team: any) => team.status === "paid").length;
  const readyTeams = teams.filter((team: any) => {
    const memberCount = (team.team_members ?? []).length;
    if (memberCount < Number(match.min_players ?? 1)) {
      return false;
    }
    return team.status === "locked" || team.status === "paid" || team.status === "ready";
  }).length;

  const fullPaidReached =
    teamCount >= Number(match.max_teams ?? 0) && paidTeams >= Number(match.max_teams ?? 0);

  if (match.start_rule_mode === "full_paid") {
    if (fullPaidReached) {
      await safeTransition(supabase, match, "pre_start", {
        countdown_sec: Number(match.pre_start_sec ?? 30)
      });
    }
    return;
  }

  if (fullPaidReached) {
    await safeTransition(supabase, match, "pre_start", {
      countdown_sec: Number(match.pre_start_sec ?? 30)
    });
    return;
  }

  const minTeamsReached = readyTeams >= Number(match.min_teams ?? 1);
  if (!minTeamsReached) {
    if (match.countdown_sec != null) {
      await supabase
        .from("matches")
        .update({ countdown_sec: null, updated_at: nowIso() })
        .eq("id", match.id)
        .eq("status", "lobby");
      match.countdown_sec = null;
    }
    return;
  }

  const forceStartSec = Number(match.force_start_sec ?? 180);
  const nextCountdown = match.countdown_sec == null ? forceStartSec : Math.max(0, match.countdown_sec - 1);

  if (nextCountdown <= 0) {
    await safeTransition(supabase, match, "pre_start", {
      countdown_sec: Number(match.pre_start_sec ?? 30)
    });
    return;
  }

  await supabase
    .from("matches")
    .update({ countdown_sec: nextCountdown, updated_at: nowIso() })
    .eq("id", match.id)
    .eq("status", "lobby");

  match.countdown_sec = nextCountdown;
}

async function processPreStartMatch(supabase: any, match: MatchRow) {
  const remaining = match.countdown_sec == null ? Number(match.pre_start_sec ?? 30) : match.countdown_sec;
  const nextCountdown = Math.max(0, remaining - 1);

  if (nextCountdown > 0) {
    await supabase
      .from("matches")
      .update({ countdown_sec: nextCountdown, updated_at: nowIso() })
      .eq("id", match.id)
      .eq("status", "pre_start");
    match.countdown_sec = nextCountdown;
    return;
  }

  const startAt = nowIso();
  let chainStartTx: string;
  try {
    const chainResult = await startMatchOnChain({
      matchId: match.id,
      startedAt: startAt
    });
    chainStartTx = chainResult.txDigest;
  } catch (error) {
    await writeAuditLog(supabase, {
      matchId: match.id,
      eventType: "start_match_chain_failed",
      reasonCode: "START_MATCH_CHAIN_FAILED",
      severity: "critical",
      detail: {
        error: error instanceof Error ? error.message : "UNKNOWN_ERROR"
      }
    });
    return;
  }

  await safeTransition(supabase, match, "running", {
    start_at: startAt,
    start_tx: chainStartTx,
    countdown_sec: Number(match.duration_sec ?? 600)
  });
}

async function processRunningOrPanicMatch(supabase: any, match: MatchRow) {
  const nowMs = Date.now();
  const durationSec = Number(match.duration_sec ?? 600);
  const remainingSec = computeRemainingSec(match.start_at, durationSec, nowMs);

  if (remainingSec <= 0) {
    await safeTransition(supabase, match, "settling", {
      countdown_sec: 0
    });
    return;
  }

  if (match.status === "running" && remainingSec <= PANIC_THRESHOLD_SEC) {
    const switched = await safeTransition(supabase, match, "panic", {
      panic_at: nowIso(),
      countdown_sec: remainingSec
    });
    if (switched) {
      await broadcastPanicMode(supabase, match.id);
    }
    return;
  }

  await supabase
    .from("matches")
    .update({ countdown_sec: remainingSec, updated_at: nowIso() })
    .eq("id", match.id)
    .eq("status", match.status);

  match.countdown_sec = remainingSec;
}

async function processSettlingMatch(supabase: any, match: MatchRow) {
  const settlement = await triggerSettlement(match.id);
  if (!settlement.ok) {
    await writeAuditLog(supabase, {
      matchId: match.id,
      eventType: "settlement_trigger_failed",
      reasonCode: "SETTLEMENT_TRIGGER_FAILED",
      severity: "warning",
      detail: {
        error: settlement.error,
        detail: settlement.detail
      }
    });
    return;
  }

  const settlementTx = settlement.bill?.settlementTx ?? settlement.bill?.settlement_tx ?? null;

  await safeTransition(supabase, match, "settled", {
    countdown_sec: 0,
    end_at: nowIso(),
    end_tx: settlementTx
  });
}

async function processMatch(supabase: any, match: MatchRow) {
  if (match.status === "lobby") {
    await processLobbyMatch(supabase, match);
    return;
  }

  if (match.status === "pre_start") {
    await processPreStartMatch(supabase, match);
    return;
  }

  if (match.status === "running" || match.status === "panic") {
    await processRunningOrPanicMatch(supabase, match);
    return;
  }

  if (match.status === "settling") {
    await processSettlingMatch(supabase, match);
    return;
  }

  await writeAuditLog(supabase, {
    matchId: match.id,
    eventType: "state_transition_rejected",
    reasonCode: "INVALID_STATE_TRANSITION",
    severity: "warning",
    detail: {
      status: match.status,
      reason: "UNSUPPORTED_STATUS_IN_TICK"
    }
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { error: "METHOD_NOT_ALLOWED" });
  }

  try {
    const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));

    const { data: matches, error: matchError } = await supabase
      .from("matches")
      .select("id, status, start_rule_mode, min_teams, max_teams, min_players, force_start_sec, pre_start_sec, duration_sec, countdown_sec, start_at, panic_at, end_at, start_tx, end_tx")
      .in("status", ["lobby", "pre_start", "running", "panic", "settling"])
      .order("created_at", { ascending: true })
      .limit(200);

    if (matchError) {
      return jsonResponse(500, { error: "MATCH_LIST_FAILED", detail: matchError.message });
    }

    let processed = 0;
    const failed: Array<{ matchId: string; error: string }> = [];

    for (const match of matches ?? []) {
      try {
        await processMatch(supabase, match as MatchRow);
        processed += 1;
      } catch (error) {
        failed.push({
          matchId: String(match.id),
          error: error instanceof Error ? error.message : "UNKNOWN_ERROR"
        });
      }
    }

    return jsonResponse(200, {
      ok: true,
      processed,
      failed
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "MATCH_TICK_UNHANDLED",
      detail: error instanceof Error ? error.message : "UNKNOWN_ERROR"
    });
  }
});
