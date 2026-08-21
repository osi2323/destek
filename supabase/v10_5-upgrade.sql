-- DESTEK KARTLARI PRO V10.5
-- TEMİZ TASLAK / TALEP KAYIT ALTYAPISI
-- Supabase > SQL Editor > New query > tamamını yapıştır > Run
-- Eski applications tablosuna dokunmaz.

create table if not exists public.demo_applications (
  id uuid primary key default gen_random_uuid(),
  client_token text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'draft'
    check (status in ('draft','submitted')),
  submitted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.demo_applications enable row level security;

-- Eski policy varsa temizle.
drop policy if exists "demo applications admin read" on public.demo_applications;
drop policy if exists "demo applications admin all" on public.demo_applications;

-- Ziyaretçi tabloya doğrudan erişmez. Admin okuyabilir.
create policy "demo applications admin read"
on public.demo_applications
for select
to authenticated
using (public.is_admin());

create policy "demo applications admin all"
on public.demo_applications
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Ziyaretçi sadece SECURITY DEFINER RPC ile kendi client_token kaydını upsert eder.
create or replace function public.save_demo_application_v2(
  p_client_token text,
  p_payload jsonb,
  p_submitted boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_client_token is null or length(trim(p_client_token)) < 8 then
    raise exception 'Geçersiz taslak anahtarı';
  end if;

  if p_payload is null then
    p_payload := '{}'::jsonb;
  end if;

  insert into public.demo_applications(
    client_token,
    payload,
    status,
    submitted,
    updated_at
  )
  values(
    trim(p_client_token),
    p_payload,
    case when p_submitted then 'submitted' else 'draft' end,
    p_submitted,
    now()
  )
  on conflict (client_token)
  do update set
    payload=excluded.payload,
    status=excluded.status,
    submitted=excluded.submitted,
    updated_at=now()
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.save_demo_application_v2(text,jsonb,boolean) from public;
grant execute on function public.save_demo_application_v2(text,jsonb,boolean) to anon, authenticated;

-- Realtime'e tek kez ekle.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname='supabase_realtime'
      and schemaname='public'
      and tablename='demo_applications'
  ) then
    alter publication supabase_realtime add table public.demo_applications;
  end if;
end $$;

-- RPC'nin gerçekten çalıştığını migration sırasında test et.
do $$
declare
  v_test uuid;
begin
  v_test := public.save_demo_application_v2(
    'migration-test-token-v105',
    '{"applicant_name":"TEST","request_no":"123456789012345678"}'::jsonb,
    false
  );
  delete from public.demo_applications where id=v_test;
end $$;

notify pgrst, 'reload schema';
