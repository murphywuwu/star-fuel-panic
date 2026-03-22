-- F-005 Settlement table
create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  gross_pool numeric(20, 2) not null default 0,
  platform_fee numeric(20, 2) not null default 0,
  payout_pool numeric(20, 2) not null default 0,
  result_hash text not null,
  commitment_tx text,
  settlement_tx text,
  status text not null default 'pending' check (status in ('pending', 'committed', 'settled', 'failed')),
  bill_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(match_id)
);

create index if not exists idx_settlements_status on public.settlements(status);

create or replace function public.set_settlements_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_settlements_updated_at on public.settlements;
create trigger trg_set_settlements_updated_at
before update on public.settlements
for each row
execute function public.set_settlements_updated_at();
