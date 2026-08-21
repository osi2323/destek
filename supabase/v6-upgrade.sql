-- V6: Ön başvuru dinamik alanları ve Meslek alanı
-- Mevcut kayıtları silmez.
alter table public.applications add column if not exists profession text;
alter table public.applications add column if not exists custom_fields jsonb not null default '{}'::jsonb;
notify pgrst, 'reload schema';
