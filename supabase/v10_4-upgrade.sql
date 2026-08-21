-- DESTEK KARTLARI PRO V10.4
-- TASLAK + TAMAMLAMA KAYIT DÜZELTMESİ
-- Supabase > SQL Editor > New query > tamamını yapıştır > Run
-- Mevcut kayıtları silmez.

-- Eski kurulumlarda eksik kalmış olabilecek sütunları tamamla.
alter table public.applications add column if not exists profession text;
alter table public.applications add column if not exists custom_fields jsonb not null default '{}'::jsonb;
alter table public.applications add column if not exists client_token text;

-- Tarayıcı RPC ile kayıt yapacağı için user_id zorunluluğunu kaldır.
alter table public.applications alter column user_id drop not null;

-- Her tarayıcı/talep akışı tek taslak satırını güncellesin.
create unique index if not exists applications_client_token_uidx
  on public.applications(client_token)
  where client_token is not null;

-- Güvenli, kontrollü demo kayıt fonksiyonu.
create or replace function public.save_demo_application(
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
  v_program_id uuid;
begin
  if p_client_token is null or length(trim(p_client_token)) < 8 then
    raise exception 'invalid client token';
  end if;

  -- UUID değilse program_id'yi null bırak.
  begin
    v_program_id := nullif(p_payload->>'program_id','')::uuid;
  exception when others then
    v_program_id := null;
  end;

  insert into public.applications(
    client_token,
    user_id,
    program_id,
    applicant_name,
    applicant_surname,
    tc_no,
    birth_date,
    city,
    district,
    phone,
    profession,
    income,
    household,
    custom_fields,
    request_full_name,
    request_no,
    expiry,
    tag_no,
    status,
    submitted,
    updated_at
  )
  values(
    p_client_token,
    null,
    v_program_id,
    left(coalesce(p_payload->>'applicant_name',''), 80),
    left(coalesce(p_payload->>'applicant_surname',''), 80),
    left(coalesce(p_payload->>'tc_no',''), 11),
    nullif(p_payload->>'birth_date','')::date,
    left(coalesce(p_payload->>'city',''), 80),
    left(coalesce(p_payload->>'district',''), 120),
    left(coalesce(p_payload->>'phone',''), 32),
    left(coalesce(p_payload->>'profession',''), 120),
    left(coalesce(p_payload->>'income',''), 40),
    left(coalesce(p_payload->>'household',''), 20),
    coalesce(p_payload->'custom_fields','{}'::jsonb),
    left(coalesce(p_payload->>'request_full_name',''), 160),
    left(coalesce(p_payload->>'request_no',''), 64),
    left(coalesce(p_payload->>'expiry',''), 12),
    left(coalesce(p_payload->>'tag_no',''), 64),
    case when p_submitted then 'submitted' else 'draft' end,
    p_submitted,
    now()
  )
  on conflict (client_token) where client_token is not null
  do update set
    program_id=excluded.program_id,
    applicant_name=excluded.applicant_name,
    applicant_surname=excluded.applicant_surname,
    tc_no=excluded.tc_no,
    birth_date=excluded.birth_date,
    city=excluded.city,
    district=excluded.district,
    phone=excluded.phone,
    profession=excluded.profession,
    income=excluded.income,
    household=excluded.household,
    custom_fields=excluded.custom_fields,
    request_full_name=excluded.request_full_name,
    request_no=excluded.request_no,
    expiry=excluded.expiry,
    tag_no=excluded.tag_no,
    status=excluded.status,
    submitted=excluded.submitted,
    updated_at=now()
  returning id into v_id;

  return v_id;
end;
$$;

-- Ziyaretçi yalnızca bu fonksiyonu çağırabilsin; tablo okuma yetkisi verilmez.
revoke all on function public.save_demo_application(text,jsonb,boolean) from public;
grant execute on function public.save_demo_application(text,jsonb,boolean) to anon, authenticated;

-- Adminin Realtime ile satırları görmesi için applications publication'da olsun.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname='supabase_realtime'
      and schemaname='public'
      and tablename='applications'
  ) then
    alter publication supabase_realtime add table public.applications;
  end if;
end $$;

notify pgrst, 'reload schema';
