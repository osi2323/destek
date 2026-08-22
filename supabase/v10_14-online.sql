-- DESTEK KARTLARI PRO V10.14
-- CANLI / ONLINE ZİYARETÇİ SİSTEMİ DÜZELTMESİ
-- Supabase > SQL Editor > New query > tamamını yapıştır > Run
-- Eski visitor_sessions tablosuna dokunmaz.

create table if not exists public.demo_live_sessions (
  id uuid primary key default gen_random_uuid(),
  session_token text not null unique,
  stage integer not null default 0 check(stage between 0 and 4),
  program_id uuid null references public.programs(id) on delete set null,
  path text,
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

alter table public.demo_live_sessions enable row level security;

drop policy if exists "demo live admin read" on public.demo_live_sessions;
drop policy if exists "demo live admin all" on public.demo_live_sessions;

create policy "demo live admin read"
on public.demo_live_sessions
for select
to authenticated
using (public.is_admin());

create policy "demo live admin all"
on public.demo_live_sessions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.touch_demo_live_session(
  p_session_token text,
  p_stage integer default 0,
  p_program_id uuid default null,
  p_path text default '/'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_session_token is null or length(trim(p_session_token)) < 8 then
    raise exception 'invalid live session token';
  end if;

  -- Eski kayıtları hafifçe temizle; tablo gereksiz büyümesin.
  delete from public.demo_live_sessions
  where last_seen < now() - interval '24 hours';

  insert into public.demo_live_sessions(
    session_token, stage, program_id, path, last_seen
  )
  values(
    trim(p_session_token),
    greatest(0,least(4,coalesce(p_stage,0))),
    p_program_id,
    left(coalesce(p_path,'/'),300),
    now()
  )
  on conflict (session_token)
  do update set
    stage=excluded.stage,
    program_id=excluded.program_id,
    path=excluded.path,
    last_seen=now();
end;
$$;

revoke all on function public.touch_demo_live_session(text,integer,uuid,text) from public;
grant execute on function public.touch_demo_live_session(text,integer,uuid,text) to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname='supabase_realtime'
      and schemaname='public'
      and tablename='demo_live_sessions'
  ) then
    alter publication supabase_realtime add table public.demo_live_sessions;
  end if;
end $$;

-- Migration sırasında gerçek heartbeat testi.
select public.touch_demo_live_session(
  'migration-test-live-v1014',
  0,
  null,
  '/migration-test'
);
delete from public.demo_live_sessions
where session_token='migration-test-live-v1014';

notify pgrst, 'reload schema';
