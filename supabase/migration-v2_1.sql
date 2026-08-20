-- DESTEK KARTLARI PRO V2.1 GÜNCELLEMESİ
-- Supabase > SQL Editor > New query > bu dosyanın tamamını çalıştırın.
-- Mevcut kayıtları silmez.

alter table public.applications add column if not exists applicant_phone text;
alter table public.applications add column if not exists applicant_tckn_masked text;
alter table public.applications add column if not exists displayed_price text;

-- Demo T.C. alanında tam kimlik numarası saklanmaz. Uygulama yalnızca maskeli değer gönderir.
-- Telefon, demo formdaki iletişim alanını admin tablosunda göstermek için tutulur.

notify pgrst, 'reload schema';
