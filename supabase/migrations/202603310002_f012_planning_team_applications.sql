-- F-012: standalone planning team applications

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

alter table public.planning_team_applications enable row level security;

drop policy if exists "planning_team_applications_read" on public.planning_team_applications;
create policy "planning_team_applications_read" on public.planning_team_applications
for select to anon, authenticated
using (true);

drop policy if exists "planning_team_applications_service_role_write" on public.planning_team_applications;
create policy "planning_team_applications_service_role_write" on public.planning_team_applications
for all to service_role
using (true)
with check (true);
