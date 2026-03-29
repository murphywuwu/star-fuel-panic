-- F-007 T-0734
-- Expand legacy lobby tables so current matchRuntime/teamRuntime state
-- can be mirrored into backend tables and hydrated back after process restart.

create extension if not exists pgcrypto;

alter table public.matches
  alter column mission_id drop not null;

alter table public.matches
  drop constraint if exists matches_status_check;

alter table public.matches
  add constraint matches_status_check
  check (status in ('draft', 'lobby', 'pre_start', 'prestart', 'running', 'panic', 'settling', 'settled', 'cancelled'));

alter table public.matches
  add column if not exists runtime_payload jsonb not null default '{}'::jsonb,
  add column if not exists creation_mode text check (creation_mode in ('free', 'precision')),
  add column if not exists solar_system_id bigint,
  add column if not exists sponsorship_fee numeric(20, 2) not null default 0,
  add column if not exists prize_pool numeric(20, 2) not null default 0,
  add column if not exists host_prize_pool numeric(20, 2) not null default 0,
  add column if not exists on_chain_id text,
  add column if not exists host_address text,
  add column if not exists created_by text,
  add column if not exists published_at timestamptz,
  add column if not exists publish_tx_digest text,
  add column if not exists publish_idempotency_key text;

create index if not exists idx_matches_creation_mode on public.matches(creation_mode);
create index if not exists idx_matches_solar_system_id on public.matches(solar_system_id);

alter table public.teams
  add column if not exists runtime_payload jsonb not null default '{}'::jsonb;

alter table public.team_members
  add column if not exists runtime_payload jsonb not null default '{}'::jsonb;

alter table public.settlements
  add column if not exists runtime_payload jsonb not null default '{}'::jsonb;
