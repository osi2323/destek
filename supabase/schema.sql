-- DESTEK KARTLARI PROTOTIP - Supabase kurulumu
-- Bu şema demo/prototip içindir. Gerçek kamu/kimlik verisi için kullanılmamalıdır.

create extension if not exists pgcrypto;

create table if not exists public.site_settings (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text not null default 'users',
  card_image_url text default '',
  card_text_color text not null default '#ffffff',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  mobile_image_url text default '',
  alt_text text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.visitor_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  stage integer not null default 0 check(stage between 0 and 4),
  program_id uuid null references public.programs(id) on delete set null,
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid null references public.programs(id) on delete set null,
  applicant_name text,
  applicant_surname text,
  tc_no text,
  birth_date date,
  city text,
  district text,
  phone text,
  email text,
  income text,
  household text,
  request_full_name text,
  request_no text,
  expiry text,
  tag_no text,
  status text not null default 'draft',
  submitted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.admins where user_id=auth.uid());
$$;

grant execute on function public.is_admin() to authenticated;

alter table public.site_settings enable row level security;
alter table public.programs enable row level security;
alter table public.banners enable row level security;
alter table public.admins enable row level security;
alter table public.visitor_sessions enable row level security;
alter table public.applications enable row level security;

-- Public content may be read by anonymous/authenticated visitors.
create policy "settings read" on public.site_settings for select using (true);
create policy "programs read" on public.programs for select using (true);
create policy "banners read" on public.banners for select using (true);

-- Admin writes.
create policy "settings admin all" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "programs admin all" on public.programs for all using (public.is_admin()) with check (public.is_admin());
create policy "banners admin all" on public.banners for all using (public.is_admin()) with check (public.is_admin());
create policy "admins self read" on public.admins for select using (user_id=auth.uid() or public.is_admin());

-- Anonymous auth visitor may only manage its own session and own demo application.
create policy "session own read" on public.visitor_sessions for select using (user_id=auth.uid() or public.is_admin());
create policy "session own insert" on public.visitor_sessions for insert with check (user_id=auth.uid());
create policy "session own update" on public.visitor_sessions for update using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "session admin read" on public.visitor_sessions for select using (public.is_admin());

create policy "applications own read" on public.applications for select using (user_id=auth.uid() or public.is_admin());
create policy "applications own insert" on public.applications for insert with check (user_id=auth.uid());
create policy "applications own update" on public.applications for update using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "applications admin read" on public.applications for select using (public.is_admin());

-- Realtime tables
alter publication supabase_realtime add table public.visitor_sessions;
alter publication supabase_realtime add table public.applications;

-- Initial settings and programs
insert into public.site_settings(id,data) values ('main', '{
  "site_title":"Sosyal Destek Kartları",
  "site_subtitle":"Kurumsal Başvuru Prototipi",
  "hero_title":"Destek Kartları Başvuru Sistemi",
  "hero_text":"Uygun destek programını seçerek örnek başvuru sürecini adım adım inceleyin.",
  "notice_text":"Bu çalışma proje sunumu içindir; herhangi bir kamu kurumunu temsil etmez ve gerçek başvuru kabul etmez.",
  "steps":["Başvuru","Ön Onay","Talep","Tamamlandı"],
  "final_page":{"eyebrow":"BAŞVURU TAMAMLANDI","title":"Talebiniz başarıyla oluşturuldu","text":"Başvuru süreciniz tamamlandı. Bu ekran proje prototipine ait örnek sonuç sayfasıdır.","icon_url":"","icon_size":72,"summary_title":"Başvuru Özeti","home_button":"Ana Sayfaya Dön","back_button":"Talep Sayfasına Dön"},
  "request_form":{
    "full_name":{"label":"Talep Eden Ad Soyad","placeholder":"Ad Soyad","required":true},
    "request_no":{"label":"Talep Numarası","placeholder":"Talep numarası","required":true,"length":18},
    "expiry":{"label":"Ay / Yıl","placeholder":"AA/YY","required":true},
    "tag_no":{"label":"TAG","placeholder":"8 haneli TAG numarası","required":true,"length":8}
  }
}'::jsonb) on conflict(id) do nothing;

insert into public.programs(title,description,active,sort_order) values
('Aile Destek Kartı','Hane bazlı sosyal destek başvurularının değerlendirilmesi için.',true,1),
('Öğrenci Destek Kartı','Eğitimine devam eden öğrenciler için örnek destek programı.',true,2),
('55 Yaş Üstü Destek Kartı','55 yaş ve üzeri kişiler için örnek destek başvurusu.',true,3),
('Esnaf Destek Kartı','Faaliyette bulunan küçük işletmeler ve esnaf için.',true,4),
('Ev Hanımları Destek Kartı','Ev içi emeğe yönelik örnek sosyal destek başvurusu.',true,5),
('Emekli Destek Kartı','Emekliler için örnek destek başvuru programı.',true,6);

-- Storage bucket: Dashboard > Storage > New bucket > name: banners > Public bucket: ON
-- Admin kurulumu:
-- 1) Authentication > Users bölümünden e-posta/şifre kullanıcısı oluştur.
-- 2) Kullanıcının UUID'sini al.
-- 3) SQL Editor'da: insert into public.admins(user_id) values ('KULLANICI_UUID');

-- Banner Storage RLS (bucket'i Dashboard'dan public olarak oluşturduktan sonra)
create policy "banner public read" on storage.objects for select using (bucket_id='banners');
create policy "banner admin insert" on storage.objects for insert to authenticated with check (bucket_id='banners' and public.is_admin());
create policy "banner admin update" on storage.objects for update to authenticated using (bucket_id='banners' and public.is_admin()) with check (bucket_id='banners' and public.is_admin());
create policy "banner admin delete" on storage.objects for delete to authenticated using (bucket_id='banners' and public.is_admin());
