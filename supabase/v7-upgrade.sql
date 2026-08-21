-- DESTEK KARTLARI PRO V7 UPGRADE
-- Supabase > SQL Editor > New query > Run
-- Mevcut kayıtları silmez.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  8388608,
  array['image/png','image/jpeg','image/webp','image/gif']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site assets public read" on storage.objects;
drop policy if exists "site assets admin insert" on storage.objects;
drop policy if exists "site assets admin update" on storage.objects;
drop policy if exists "site assets admin delete" on storage.objects;

create policy "site assets public read"
on storage.objects for select
using (bucket_id = 'site-assets');

create policy "site assets admin insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-assets' and public.is_admin());

create policy "site assets admin update"
on storage.objects for update
to authenticated
using (bucket_id = 'site-assets' and public.is_admin())
with check (bucket_id = 'site-assets' and public.is_admin());

create policy "site assets admin delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-assets' and public.is_admin());

notify pgrst, 'reload schema';
