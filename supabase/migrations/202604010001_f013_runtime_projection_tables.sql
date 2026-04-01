-- F-013: Runtime projection tables for shared state between Web and Workers
-- This migration creates tables that replace local file-based runtime projections,
-- enabling deployment of Workers to Railway while Web runs on Vercel.

-- Network nodes projection (replaces networkNodes in runtime-projections.json)
create table if not exists public.network_nodes (
  object_id text primary key,
  solar_system_id bigint,
  solar_system_name text,
  name text not null,
  node_type text check (node_type in ('stargate', 'ssu', 'turret', 'unknown')),
  fill_ratio numeric(5, 4) not null default 0 check (fill_ratio >= 0 and fill_ratio <= 1),
  fuel_quantity bigint not null default 0,
  fuel_max_capacity bigint not null default 1,
  urgency text not null default 'safe' check (urgency in ('critical', 'warning', 'safe')),
  is_online boolean not null default false,
  is_public boolean not null default false,
  owner_address text,
  location_x numeric(20, 6),
  location_y numeric(20, 6),
  location_z numeric(20, 6),
  connected_gate_id text,
  runtime_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_network_nodes_solar_system on public.network_nodes(solar_system_id);
create index if not exists idx_network_nodes_urgency on public.network_nodes(urgency);
create index if not exists idx_network_nodes_is_online on public.network_nodes(is_online);
create index if not exists idx_network_nodes_fill_ratio on public.network_nodes(fill_ratio);

-- Solar systems cache (replaces solarSystemsCache in runtime-projections.json)
create table if not exists public.solar_systems_cache (
  system_id bigint primary key,
  system_name text not null,
  constellation_id bigint,
  constellation_name text,
  region_id bigint,
  region_name text,
  security_status numeric(5, 4),
  gate_links jsonb not null default '[]'::jsonb,
  node_count int not null default 0,
  online_node_count int not null default 0,
  urgent_node_count int not null default 0,
  is_selectable boolean not null default false,
  selectability_reason text,
  runtime_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_solar_systems_constellation on public.solar_systems_cache(constellation_id);
create index if not exists idx_solar_systems_is_selectable on public.solar_systems_cache(is_selectable);

-- Constellation summaries (replaces constellationSummaries in runtime-projections.json)
create table if not exists public.constellation_summaries (
  constellation_id bigint primary key,
  constellation_name text not null,
  region_id bigint,
  system_count int not null default 0,
  selectable_system_count int not null default 0,
  urgent_node_count int not null default 0,
  warning_node_count int not null default 0,
  sort_score numeric(10, 2) not null default 0,
  runtime_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_constellation_sort_score on public.constellation_summaries(sort_score desc);

-- Match scores (replaces matchScores in runtime-projections.json)
create table if not exists public.match_scores (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  wallet_address text not null,
  total_score bigint not null default 0,
  fuel_deposited bigint not null default 0,
  event_count int not null default 0,
  runtime_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(match_id, wallet_address)
);

create index if not exists idx_match_scores_match_id on public.match_scores(match_id);
create index if not exists idx_match_scores_team_id on public.match_scores(team_id);
create index if not exists idx_match_scores_total_score on public.match_scores(total_score desc);

-- Fuel events (replaces fuelEvents in runtime-projections.json)
create table if not exists public.fuel_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  event_id text not null,
  tx_digest text not null,
  sender_wallet text not null,
  team_id uuid references public.teams(id) on delete set null,
  assembly_id text not null,
  fuel_added bigint not null default 0,
  fuel_type_id int not null default 0,
  fuel_grade text not null default 'standard' check (fuel_grade in ('standard', 'premium', 'refined')),
  fuel_grade_bonus numeric(5, 4) not null default 1.0,
  urgency_weight numeric(5, 4) not null default 1.0,
  panic_multiplier numeric(5, 4) not null default 1.0,
  score_delta bigint not null default 0,
  chain_ts bigint not null,
  runtime_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(match_id, tx_digest, event_id)
);

create index if not exists idx_fuel_events_match_id on public.fuel_events(match_id);
create index if not exists idx_fuel_events_sender on public.fuel_events(sender_wallet);
create index if not exists idx_fuel_events_chain_ts on public.fuel_events(chain_ts desc);

-- Match stream events (replaces matchStreamEvents in runtime-projections.json)
create table if not exists public.match_stream_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_match_stream_events_match_id on public.match_stream_events(match_id);
create index if not exists idx_match_stream_events_type on public.match_stream_events(event_type);
create index if not exists idx_match_stream_events_created_at on public.match_stream_events(created_at desc);

-- Team payments (explicit table, previously embedded in team_payments array)
create table if not exists public.team_payments (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  wallet_address text not null,
  tx_digest text not null,
  amount numeric(20, 2) not null default 0,
  member_addresses text[] not null default '{}',
  runtime_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(team_id, tx_digest)
);

create index if not exists idx_team_payments_match_id on public.team_payments(match_id);
create index if not exists idx_team_payments_team_id on public.team_payments(team_id);

-- Match whitelists (separate from match_whitelist for runtime projection compatibility)
create table if not exists public.match_whitelists (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  wallet_address text not null,
  source_payment_tx text,
  runtime_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(match_id, wallet_address)
);

create index if not exists idx_match_whitelists_match_id on public.match_whitelists(match_id);

-- Worker health (replaces workerHealth in runtime-projections.json)
create table if not exists public.worker_health (
  worker text primary key,
  status text not null default 'starting' check (status in ('starting', 'healthy', 'degraded', 'stopped')),
  heartbeat_at timestamptz not null default now(),
  pid int,
  restart_count int not null default 0,
  detail text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Idempotency keys (replaces idempotencyKeys in runtime-projections.json)
create table if not exists public.idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  key text not null,
  request_hash text not null,
  status int not null default 200,
  body jsonb,
  headers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(scope, key)
);

create index if not exists idx_idempotency_keys_scope_key on public.idempotency_keys(scope, key);
create index if not exists idx_idempotency_keys_created_at on public.idempotency_keys(created_at);

-- Runtime metadata (replaces meta in runtime-projections.json)
create table if not exists public.runtime_meta (
  key text primary key,
  last_sync_at timestamptz,
  stale boolean not null default false,
  reason text,
  extra jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Insert default meta records
insert into public.runtime_meta (key, stale, reason) values
  ('nodes', false, null),
  ('solarSystems', false, null),
  ('constellations', false, null)
on conflict (key) do nothing;

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_network_nodes_updated_at on public.network_nodes;
create trigger trg_network_nodes_updated_at
before update on public.network_nodes
for each row execute function public.set_updated_at();

drop trigger if exists trg_solar_systems_cache_updated_at on public.solar_systems_cache;
create trigger trg_solar_systems_cache_updated_at
before update on public.solar_systems_cache
for each row execute function public.set_updated_at();

drop trigger if exists trg_constellation_summaries_updated_at on public.constellation_summaries;
create trigger trg_constellation_summaries_updated_at
before update on public.constellation_summaries
for each row execute function public.set_updated_at();

drop trigger if exists trg_match_scores_updated_at on public.match_scores;
create trigger trg_match_scores_updated_at
before update on public.match_scores
for each row execute function public.set_updated_at();

drop trigger if exists trg_worker_health_updated_at on public.worker_health;
create trigger trg_worker_health_updated_at
before update on public.worker_health
for each row execute function public.set_updated_at();

drop trigger if exists trg_runtime_meta_updated_at on public.runtime_meta;
create trigger trg_runtime_meta_updated_at
before update on public.runtime_meta
for each row execute function public.set_updated_at();

-- RLS policies
alter table public.network_nodes enable row level security;
alter table public.solar_systems_cache enable row level security;
alter table public.constellation_summaries enable row level security;
alter table public.match_scores enable row level security;
alter table public.fuel_events enable row level security;
alter table public.match_stream_events enable row level security;
alter table public.team_payments enable row level security;
alter table public.match_whitelists enable row level security;
alter table public.worker_health enable row level security;
alter table public.idempotency_keys enable row level security;
alter table public.runtime_meta enable row level security;

-- Read policies (public read for most tables)
create policy "network_nodes_read" on public.network_nodes for select to anon, authenticated using (true);
create policy "solar_systems_cache_read" on public.solar_systems_cache for select to anon, authenticated using (true);
create policy "constellation_summaries_read" on public.constellation_summaries for select to anon, authenticated using (true);
create policy "match_scores_read" on public.match_scores for select to anon, authenticated using (true);
create policy "fuel_events_read" on public.fuel_events for select to anon, authenticated using (true);
create policy "match_stream_events_read" on public.match_stream_events for select to anon, authenticated using (true);
create policy "team_payments_read" on public.team_payments for select to authenticated using (true);
create policy "match_whitelists_read" on public.match_whitelists for select to authenticated using (true);
create policy "worker_health_read" on public.worker_health for select to authenticated using (true);
create policy "runtime_meta_read" on public.runtime_meta for select to anon, authenticated using (true);

-- Service role write policies
create policy "network_nodes_service_write" on public.network_nodes for all to service_role using (true) with check (true);
create policy "solar_systems_cache_service_write" on public.solar_systems_cache for all to service_role using (true) with check (true);
create policy "constellation_summaries_service_write" on public.constellation_summaries for all to service_role using (true) with check (true);
create policy "match_scores_service_write" on public.match_scores for all to service_role using (true) with check (true);
create policy "fuel_events_service_write" on public.fuel_events for all to service_role using (true) with check (true);
create policy "match_stream_events_service_write" on public.match_stream_events for all to service_role using (true) with check (true);
create policy "team_payments_service_write" on public.team_payments for all to service_role using (true) with check (true);
create policy "match_whitelists_service_write" on public.match_whitelists for all to service_role using (true) with check (true);
create policy "worker_health_service_write" on public.worker_health for all to service_role using (true) with check (true);
create policy "idempotency_keys_service_write" on public.idempotency_keys for all to service_role using (true) with check (true);
create policy "runtime_meta_service_write" on public.runtime_meta for all to service_role using (true) with check (true);

-- Enable Realtime for key tables
alter publication supabase_realtime add table public.match_scores;
alter publication supabase_realtime add table public.fuel_events;
alter publication supabase_realtime add table public.match_stream_events;
alter publication supabase_realtime add table public.worker_health;
