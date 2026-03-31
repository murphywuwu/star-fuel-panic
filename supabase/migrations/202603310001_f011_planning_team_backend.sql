-- F-011: standalone planning team backend mirror

create extension if not exists pgcrypto;

create table if not exists public.planning_teams (
  id uuid primary key default gen_random_uuid(),
  captain_wallet text not null,
  team_name text not null,
  max_members int not null default 3 check (max_members between 3 and 8),
  member_count int not null default 1 check (member_count >= 1),
  role_slots jsonb not null default '{"collector":1,"hauler":1,"escort":1}'::jsonb,
  runtime_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_planning_teams_created_at_desc on public.planning_teams(created_at desc);
create index if not exists idx_planning_teams_captain_wallet on public.planning_teams(captain_wallet);

create table if not exists public.planning_team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.planning_teams(id) on delete cascade,
  wallet_address text not null,
  role text not null check (role in ('collector', 'hauler', 'escort')),
  joined_at timestamptz not null default now(),
  runtime_payload jsonb not null default '{}'::jsonb,
  unique(team_id, wallet_address)
);

create index if not exists idx_planning_team_members_team_id on public.planning_team_members(team_id);
create index if not exists idx_planning_team_members_wallet on public.planning_team_members(wallet_address);

create table if not exists public.planning_team_applications (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.planning_teams(id) on delete cascade,
  applicant_wallet text not null,
  role text not null check (role in ('collector', 'hauler', 'escort')),
  status text not null check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  reviewed_by text,
  reason text,
  created_at timestamptz not null default now(),
  runtime_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_planning_team_applications_team_id on public.planning_team_applications(team_id);
create index if not exists idx_planning_team_applications_applicant_wallet on public.planning_team_applications(applicant_wallet);

create or replace function public.set_generic_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_planning_teams_updated_at on public.planning_teams;
create trigger trg_planning_teams_updated_at
before update on public.planning_teams
for each row
execute function public.set_generic_updated_at();

alter table public.planning_teams enable row level security;
alter table public.planning_team_members enable row level security;
alter table public.planning_team_applications enable row level security;

drop policy if exists "planning_teams_read" on public.planning_teams;
create policy "planning_teams_read" on public.planning_teams
for select to anon, authenticated
using (true);

drop policy if exists "planning_team_members_read" on public.planning_team_members;
create policy "planning_team_members_read" on public.planning_team_members
for select to anon, authenticated
using (true);

drop policy if exists "planning_team_applications_read" on public.planning_team_applications;
create policy "planning_team_applications_read" on public.planning_team_applications
for select to anon, authenticated
using (true);

drop policy if exists "planning_teams_service_role_write" on public.planning_teams;
create policy "planning_teams_service_role_write" on public.planning_teams
for all to service_role
using (true)
with check (true);

drop policy if exists "planning_team_members_service_role_write" on public.planning_team_members;
create policy "planning_team_members_service_role_write" on public.planning_team_members
for all to service_role
using (true)
with check (true);

drop policy if exists "planning_team_applications_service_role_write" on public.planning_team_applications;
create policy "planning_team_applications_service_role_write" on public.planning_team_applications
for all to service_role
using (true)
with check (true);
