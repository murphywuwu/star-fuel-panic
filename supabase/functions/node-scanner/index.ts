// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";

type NetworkNodeSnapshot = {
  assemblyId: string;
  nodeName: string;
  fuelQuantity: number;
  fuelMaxCapacity: number;
  entryFee: number;
  minTeams: number;
  maxTeams?: number;
  minPlayers?: number;
};

type MissionUpsertRow = {
  assembly_id: string;
  node_name: string;
  fill_ratio: number;
  urgency: "critical" | "warning" | "safe";
  prize_pool: number;
  entry_fee: number;
  min_teams: number;
  max_teams: number;
  min_players: number;
  registered_teams: number;
  paid_teams: number;
  participating_teams: string[];
  countdown_sec: number | null;
  start_rule_mode: "full_paid" | "min_team_force_start";
  force_start_sec: number;
  status: "open";
  updated_at: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const DEFAULT_MAX_TEAMS = Number(Deno.env.get("DEFAULT_MAX_TEAMS") ?? "10");
const FORCE_START_SEC = Number(Deno.env.get("FORCE_START_SEC") ?? "180");

function normalizeFillRatio(quantity: number, capacity: number) {
  if (capacity <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(1, quantity / capacity));
}

function deriveUrgency(fillRatio: number): MissionUpsertRow["urgency"] {
  if (fillRatio < 0.2) {
    return "critical";
  }
  if (fillRatio < 0.5) {
    return "warning";
  }
  return "safe";
}

function computePrizePool(fillRatio: number, entryFee: number) {
  const emergencyWeight = 1 + (1 - fillRatio) * 2;
  return Math.round(entryFee * 12 * emergencyWeight);
}

function chooseMaxTeams(node: NetworkNodeSnapshot) {
  const missionMaxTeams = node.maxTeams ?? DEFAULT_MAX_TEAMS;
  return Math.max(node.minTeams, missionMaxTeams);
}

async function fetchNodeSnapshots(): Promise<NetworkNodeSnapshot[]> {
  const mockNodesEnv = Deno.env.get("MOCK_NODE_SNAPSHOTS");
  if (mockNodesEnv) {
    try {
      return JSON.parse(mockNodesEnv) as NetworkNodeSnapshot[];
    } catch {
      // Ignore parse errors and fallback to hardcoded snapshots.
    }
  }

  return [
    {
      assemblyId: "0x8a7f4b11",
      nodeName: "SSU-Frontier-7",
      fuelQuantity: 120,
      fuelMaxCapacity: 1000,
      entryFee: 100,
      minTeams: 1,
      maxTeams: 10,
      minPlayers: 3
    },
    {
      assemblyId: "0x918de320",
      nodeName: "Perimeter-4",
      fuelQuantity: 230,
      fuelMaxCapacity: 1000,
      entryFee: 90,
      minTeams: 2,
      maxTeams: 16,
      minPlayers: 3
    },
    {
      assemblyId: "0x6ea02c75",
      nodeName: "Gate-12",
      fuelQuantity: 360,
      fuelMaxCapacity: 1000,
      entryFee: 80,
      minTeams: 1,
      maxTeams: 6,
      minPlayers: 3
    }
  ];
}

function toMissionRows(nodes: NetworkNodeSnapshot[]): MissionUpsertRow[] {
  return nodes.map((node) => {
    const fillRatio = normalizeFillRatio(node.fuelQuantity, node.fuelMaxCapacity);
    const urgency = deriveUrgency(fillRatio);
    const maxTeams = chooseMaxTeams(node);
    const startRuleMode: MissionUpsertRow["start_rule_mode"] = maxTeams >= 10 ? "full_paid" : "min_team_force_start";

    return {
      assembly_id: node.assemblyId,
      node_name: node.nodeName,
      fill_ratio: fillRatio,
      urgency,
      prize_pool: computePrizePool(fillRatio, node.entryFee),
      entry_fee: node.entryFee,
      min_teams: Math.max(1, node.minTeams),
      max_teams: maxTeams,
      min_players: node.minPlayers ?? 3,
      registered_teams: 0,
      paid_teams: 0,
      participating_teams: [],
      countdown_sec: FORCE_START_SEC,
      start_rule_mode: startRuleMode,
      force_start_sec: FORCE_START_SEC,
      status: "open",
      updated_at: new Date().toISOString()
    };
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const nodes = await fetchNodeSnapshots();
    const missionRows = toMissionRows(nodes);

    const { error } = await supabase
      .from("missions")
      .upsert(missionRows, { onConflict: "assembly_id", ignoreDuplicates: false });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        scannedNodes: nodes.length,
        missionsUpserted: missionRows.length,
        maxTeamsPolicy: {
          default: DEFAULT_MAX_TEAMS,
          configurablePerMission: true
        }
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "node-scanner failed"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
