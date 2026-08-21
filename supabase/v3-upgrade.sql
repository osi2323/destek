-- DESTEK KARTLARI PRO V3 - mevcut Supabase projesi için yükseltme
-- Supabase > SQL Editor > New query > tamamını yapıştır > Run
-- Bu prototipte gerçek kişisel veri kullanmayın.

alter table public.applications add column if not exists tc_no text;
alter table public.applications add column if not exists birth_date date;
alter table public.applications add column if not exists city text;
alter table public.applications add column if not exists district text;
alter table public.applications add column if not exists phone text;
alter table public.applications add column if not exists email text;
alter table public.applications add column if not exists income text;
alter table public.applications add column if not exists household text;

-- Yapısal format kontrolleri (mevcut kayıtları bozmasın diye NOT VALID)
alter table public.applications drop constraint if exists applications_tc_no_format;
alter table public.applications add constraint applications_tc_no_format
  check (tc_no is null or tc_no ~ '^[0-9]{11}$') not valid;

notify pgrst, 'reload schema';
