-- DESTEK KARTLARI PRO V4 - mevcut Supabase projesi için yükseltme
-- Mevcut kayıtları silmez.
alter table public.programs add column if not exists icon text not null default 'users';
notify pgrst, 'reload schema';
