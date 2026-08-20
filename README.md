# Destek Kartları Pro V2

Sunum amaçlı, mobil uyumlu React + Vite + Supabase prototipi. Resmî kamu sitesi değildir ve gerçek kişisel veri toplamak için tasarlanmamıştır.

## Özellikler

- 6 başlangıç programı + admin panelinden ekle / düzenle / sil / aktif-pasif
- Ana sayfa metinlerini kod yazmadan düzenleme
- 4 banner'a kadar önerilen görsel alanı ve Supabase Storage yükleme
- Üstteki 4 adım yazısını admin panelinden değiştirme
- Talep ekranında Ad Soyad, Talep No, Ay/Yıl ve 8 haneli TAG alanı
- Talep alanlarının etiketi, placeholder'ı, zorunluluğu ve hane sayısını panelden değiştirme
- `/admin` yönetim paneli
- Supabase Auth ile admin girişi
- RLS ile ziyaretçi/admin veri ayrımı
- Anonim oturum bazlı ziyaretçi sayımı (IP kaydı yok)
- Canlı aktif ziyaretçi ve adım dağılımı
- Supabase Realtime ile admin ekranında güncelleme
- Açık bilgilendirme/onay sonrası talep taslağını yazarken otomatik kaydetme
- Admin içinde iframe canlı ön izleme

## 1. Lokal kurulum

```bash
npm install
cp .env.example .env
npm run dev
```

Windows'ta `.env.example` dosyasını kopyalayıp adını `.env` yapabilirsiniz.

## 2. Supabase

1. Yeni Supabase projesi oluşturun.
2. SQL Editor'a `supabase/schema.sql` dosyasının tamamını yapıştırıp çalıştırın.
3. Authentication > Providers/Settings bölümünden **Anonymous Sign-ins** özelliğini açın.
4. Authentication > Users bölümünden bir e-posta/şifre admin kullanıcısı oluşturun.
5. Kullanıcının UUID'sini alın ve SQL Editor'da çalıştırın:

```sql
insert into public.admins(user_id) values ('BURAYA_ADMIN_UUID');
```

6. Storage bölümünde `banners` adlı **public** bucket oluşturun.
7. Project Settings > API'den Project URL ve anon/public key'i alın.
8. `.env` içine yazın:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx
```

## 3. Admin girişi

Lokal: `http://localhost:5173/admin`

Vercel: `https://siteadresiniz.vercel.app/admin`

## 4. Vercel

GitHub reposunu Vercel'e bağlayın. Environment Variables bölümüne `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` ekleyin.

- Build Command: `npm run build`
- Output Directory: `dist`

`vercel.json` SPA route'larını `/admin` dahil çalıştırır.

## Gizlilik notu

IP adresi tutulmaz. Ziyaretçi sayımı Supabase Anonymous Auth ile üretilen kullanıcı/oturum kimliği üzerinden yapılır. Talep taslağı yalnızca kullanıcı demo bilgilendirmesini onayladıktan sonra otomatik kaydedilir.
