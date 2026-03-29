-- F-001: missions table + indexes + read-only RLS
-- Note: legacy migration filenames do not sort in dependency order, so
-- downstream FKs are attached in a later reconciliation migration.

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  assembly_id text not null unique,
  node_name text not null,
  fill_ratio numeric(5, 4) not null check (fill_ratio >= 0 and fill_ratio <= 1),
  urgency text not null check (urgency in ('critical', 'warning', 'safe')),
  prize_pool bigint not null default 0,
  entry_fee bigint not null default 0,
  min_teams int not null default 1 check (min_teams >= 1),
  max_teams int not null check (max_teams >= min_teams),
  min_players int not null default 3 check (min_players >= 1),
  registered_teams int not null default 0 check (registered_teams >= 0),
  paid_teams int not null default 0 check (paid_teams >= 0),
  participating_teams text[] not null default '{}',
  countdown_sec int,
  start_rule_mode text not null default 'min_team_force_start' check (start_rule_mode in ('full_paid', 'min_team_force_start')),
  force_start_sec int not null default 180 check (force_start_sec >= 0),
  status text not null default 'open' check (status in ('open', 'in_progress', 'settled', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_missions_status on public.missions(status);
create index if not exists idx_missions_urgency on public.missions(urgency);
create index if not exists idx_missions_created_at_desc on public.missions(created_at desc);
create index if not exists idx_missions_fill_ratio on public.missions(fill_ratio);
create index if not exists idx_missions_weighted_score on public.missions((prize_pool * (case urgency when 'critical' then 3 when 'warning' then 2 else 1 end)));

alter table public.missions enable row level security;

drop policy if exists "missions_public_read" on public.missions;
create policy "missions_public_read"
on public.missions
for select
to anon, authenticated
using (true);

drop policy if exists "missions_service_role_write" on public.missions;
create policy "missions_service_role_write"
on public.missions
for all
to service_role
using (true)
with check (true);
