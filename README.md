# Destek Kartları Pro V4 — Demo / Sunum Prototipi

React + Vite + Supabase + Vercel yapısı. `/admin` e-posta/şifre ile Supabase Auth kullanır.

## Mevcut V2/V3 kurulumunu V4'e yükseltme
1. GitHub'daki proje dosyalarını bu paketle değiştirin.
2. Supabase > SQL Editor > `supabase/v4-upgrade.sql` dosyasını bir kez çalıştırın.
3. Vercel otomatik deploy etsin veya Redeploy yapın.

## Admin
`/admin`

Yeni yönetim alanları: Header/Footer/üst afiş, ana sayfa, ön başvuru alanları ve placeholder'ları, programlar ve ikonları, bannerlar, adım çubuğu ve geçiş butonları, ön onay kartı görseli, talep sayfası/fiyat/logolar/alan kuralları, son onay ekranı ve canlı ön izlemeler.

### Ön onay kartı görseli
Önerilen: **1600 × 1000 px (8:5)**. PNG/JPG/WebP. Kart üzerindeki ad-soyad, kart numarası ve program metni görselin üstüne dinamik olarak basılır.

### Güvenlik / sunum notu
Bu paket resmî kamu hizmeti değildir. Üstteki DEMO/RESMÎ DEĞİLDİR şeridi bilerek yönetim panelinden kaldırılamaz. Gerçek kişisel veri kullanmayın.


## V5 yükseltmesi
Mevcut Supabase projesinde `supabase/v5-upgrade.sql` dosyasını SQL Editor içinde bir kez çalıştırın. Program bazlı kart görselleri için önerilen ölçü 1600×1000 px (8:5). Banner ölçüleri: masaüstü 1600×500 px, mobil 1080×600 px.


## V6 güncellemesi
- Ön başvurudaki E-posta alanı kaldırıldı, varsayılan olarak Meslek alanı eklendi.
- Admin > Ön Başvuru bölümünden form alanı ekleme/silme, tür, zorunluluk ve görünürlük ayarı yapılabilir.
- Dinamik ek alanlar `applications.custom_fields` JSONB alanında saklanır.
- Önce Supabase SQL Editor'da `supabase/v6-upgrade.sql` dosyasını bir kez çalıştırın.
