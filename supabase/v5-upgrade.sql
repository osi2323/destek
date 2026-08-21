-- DESTEK KARTLARI PRO V5 - mevcut Supabase projesi için yükseltme
-- Mevcut kayıtları silmez.

alter table public.programs add column if not exists card_image_url text default '';
alter table public.programs add column if not exists card_text_color text not null default '#ffffff';
alter table public.banners add column if not exists mobile_image_url text default '';

notify pgrst, 'reload schema';
