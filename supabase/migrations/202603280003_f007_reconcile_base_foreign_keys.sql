-- Reconcile base foreign keys after legacy migrations have all created tables.
-- The original migration filenames do not sort in dependency order on a fresh
-- local bootstrap, so attach these constraints once `missions`, `matches`,
-- and `settlements` are guaranteed to exist.

do $$
begin
  if to_regclass('public.matches') is not null
     and to_regclass('public.missions') is not null
     and not exists (
       select 1
       from pg_constraint
       where conname = 'matches_mission_id_fkey'
         and conrelid = 'public.matches'::regclass
     ) then
    alter table public.matches
      add constraint matches_mission_id_fkey
      foreign key (mission_id) references public.missions(id) on delete cascade;
  end if;
end
$$;

do $$
begin
  if to_regclass('public.settlements') is not null
     and to_regclass('public.matches') is not null
     and not exists (
       select 1
       from pg_constraint
       where conname = 'settlements_match_id_fkey'
         and conrelid = 'public.settlements'::regclass
     ) then
    alter table public.settlements
      add constraint settlements_match_id_fkey
      foreign key (match_id) references public.matches(id) on delete cascade;
  end if;
end
$$;
