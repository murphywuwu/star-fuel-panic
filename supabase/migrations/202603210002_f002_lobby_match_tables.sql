-- F-002: lobby tables + whitelist + targets + audit logs
-- Covers TODO: T-0036 / T-0037 (and provides audit log table for T-0069).

create extension if not exists pgcrypto;

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  -- Attach FK in a later migration because this legacy file can run before
  -- `20260321_f001_missions.sql` on a fresh local bootstrap.
  mission_id uuid not null,
  status text not null default 'lobby' check (status in ('lobby', 'pre_start', 'running', 'panic', 'settling', 'settled')),
  start_rule_mode text not null default 'min_team_force_start' check (start_rule_mode in ('full_paid', 'min_team_force_start')),
  min_teams int not null default 1 check (min_teams >= 1),
  max_teams int not null default 10 check (max_teams >= min_teams),
  min_players int not null default 3 check (min_players >= 1),
  force_start_sec int not null default 180 check (force_start_sec >= 0),
  pre_start_sec int not null default 30 check (pre_start_sec >= 0),
  duration_sec int not null default 600 check (duration_sec > 0),
  countdown_sec int,
  entry_fee numeric(20, 2) not null default 0,
  platform_subsidy numeric(20, 2) not null default 0,
  start_at timestamptz,
  end_at timestamptz,
  panic_at timestamptz,
  start_tx text,
  end_tx text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_matches_status on public.matches(status);
create index if not exists idx_matches_mission_id on public.matches(mission_id);
create index if not exists idx_matches_created_at_desc on public.matches(created_at desc);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  captain_wallet text not null,
  team_name text not null,
  max_size int not null default 8 check (max_size between 3 and 8),
  role_slots text[] not null default '{collector,hauler,escort}',
  status text not null default 'forming' check (status in ('forming', 'locked', 'paid', 'ready')),
  paid_tx_digest text,
  paid_at timestamptz,
  total_score bigint not null default 0,
  rank int,
  prize_amount numeric(20, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_teams_match_id on public.teams(match_id);
create unique index if not exists idx_teams_match_name_uniq on public.teams(match_id, team_name);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  wallet_address text not null,
  role text not null check (role in ('collector', 'hauler', 'escort')),
  personal_score bigint not null default 0,
  prize_amount numeric(20, 2),
  joined_at timestamptz not null default now(),
  unique(team_id, wallet_address)
);

create index if not exists idx_team_members_team_id on public.team_members(team_id);
create index if not exists idx_team_members_wallet on public.team_members(wallet_address);

create table if not exists public.match_whitelist (
  match_id uuid not null references public.matches(id) on delete cascade,
  wallet_address text not null,
  tx_digest text,
  registered_by text,
  registered_at timestamptz not null default now(),
  primary key (match_id, wallet_address)
);

create index if not exists idx_match_whitelist_match_id on public.match_whitelist(match_id);

create table if not exists public.match_targets (
  match_id uuid not null references public.matches(id) on delete cascade,
  assembly_id text not null,
  created_at timestamptz not null default now(),
  primary key (match_id, assembly_id)
);

create index if not exists idx_match_targets_match_id on public.match_targets(match_id);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches(id) on delete set null,
  event_type text not null,
  reason_code text,
  severity text check (severity in ('info', 'warning', 'critical')),
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_match_id on public.audit_logs(match_id);
create index if not exists idx_audit_logs_event_type on public.audit_logs(event_type);
create index if not exists idx_audit_logs_created_at_desc on public.audit_logs(created_at desc);

create or replace function public.set_generic_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_matches_updated_at on public.matches;
create trigger trg_matches_updated_at
before update on public.matches
for each row
execute function public.set_generic_updated_at();

drop trigger if exists trg_teams_updated_at on public.teams;
create trigger trg_teams_updated_at
before update on public.teams
for each row
execute function public.set_generic_updated_at();

alter table public.matches enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.match_whitelist enable row level security;
alter table public.match_targets enable row level security;
alter table public.audit_logs enable row level security;

-- read policies

drop policy if exists "matches_read" on public.matches;
create policy "matches_read" on public.matches
for select to anon, authenticated
using (true);

drop policy if exists "teams_read" on public.teams;
create policy "teams_read" on public.teams
for select to anon, authenticated
using (true);

drop policy if exists "team_members_read" on public.team_members;
create policy "team_members_read" on public.team_members
for select to anon, authenticated
using (true);

drop policy if exists "match_whitelist_read" on public.match_whitelist;
create policy "match_whitelist_read" on public.match_whitelist
for select to authenticated
using (true);

drop policy if exists "match_targets_read" on public.match_targets;
create policy "match_targets_read" on public.match_targets
for select to anon, authenticated
using (true);

drop policy if exists "audit_logs_read" on public.audit_logs;
create policy "audit_logs_read" on public.audit_logs
for select to authenticated
using (true);

-- service role full write policies

drop policy if exists "matches_service_role_write" on public.matches;
create policy "matches_service_role_write" on public.matches
for all to service_role
using (true)
with check (true);

drop policy if exists "teams_service_role_write" on public.teams;
create policy "teams_service_role_write" on public.teams
for all to service_role
using (true)
with check (true);

drop policy if exists "team_members_service_role_write" on public.team_members;
create policy "team_members_service_role_write" on public.team_members
for all to service_role
using (true)
with check (true);

drop policy if exists "match_whitelist_service_role_write" on public.match_whitelist;
create policy "match_whitelist_service_role_write" on public.match_whitelist
for all to service_role
using (true)
with check (true);

drop policy if exists "match_targets_service_role_write" on public.match_targets;
create policy "match_targets_service_role_write" on public.match_targets
for all to service_role
using (true)
with check (true);

drop policy if exists "audit_logs_service_role_write" on public.audit_logs;
create policy "audit_logs_service_role_write" on public.audit_logs
for all to service_role
using (true)
with check (true);
