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


## V7 güncellemesi
- Ön başvuru sırası: Ad, Soyad, T.C. Demo No, Doğum Tarihi, Cep Telefonu, Meslek, İl, İlçe, gelir, hane.
- Telefon otomatik `0 (5XX) XXX XX XX` biçimindedir; fazla rakam kabul etmez ve 5 ile başlayan mobil numara doğrulanır.
- Admin > Ön Başvuru bölümünde her alan için `Form sırası` değiştirilebilir.
- Görsel yükleme hatası için yeni `site-assets` bucket ve RLS politikaları eklenmiştir.
- Supabase'de `supabase/v7-upgrade.sql` dosyasını bir kez çalıştırın.


## V8
- Ana sayfadaki hero kısa başlık, ana başlık, açıklama, bilgilendirme metni, sağ kart başlığı/açıklaması ve ikonları admin panelinden değiştirilebilir.
- Bilgilendirme kutusu ve sağ kart için özel ikon yüklenebilir.
- Footer artık dinamik blok sistemidir: yazı, logo/görsel, bağlantı, sıra, ekleme ve silme desteklenir.
- Footer değişiklikleri admin panelinde canlı ön izlenir.
- Ek SQL migration gerektirmez; ayarlar `site_settings.data` JSON alanında saklanır.


## V9 — Ön başvuru doğrulama
- Cep telefonu en fazla 10 ulusal hane kabul eder ve ekranda `0 (5XX) XXX XX XX` biçiminde maskelenir.
- T.C. demo/test alanı 11 haneyi geçemez; yapısal kontrol uygulanır.
- Sayısal alanlar yalnızca rakam kabul eder ve `max_length` sınırını geçemez.
- Metin alanları admin ayarındaki `max_length` değerini geçemez.
- Hatalar sayfa üstünde genel mesaj olarak değil, doğrudan yanlış alanın altında alan adıyla gösterilir.
- İlk hatalı alan otomatik olarak ekrana getirilir ve odaklanır.


## V9.1
- Ön onay kartında uygulamanın sonradan eklediği yapay chip/kare kaldırıldı; yüklenen kart görseli olduğu gibi görünür.
- Ön başvuru formuna İlçe'nin hemen altına zorunlu `Açık Adres` alanı eklendi.
- Adres alanı: mahalle/köy, cadde, sokak, bina ve daire bilgisi için 10–180 karakter.
- Eski Supabase site ayarlarında adres alanı yoksa uygulama otomatik olarak varsayılan adres alanını ekler; yeni SQL gerekmez.


## V10 — Kritik form düzeltmeleri
- Cep telefonu inputu yazma ve yapıştırma sırasında 10 ulusal haneye zorlanır; fazladan rakam state'e alınmaz.
- T.C. demo/test alanı yazma ve yapıştırma sırasında 11 haneye zorlanır.
- Hata mesajı alan başlığıyla birlikte `Hatalı girdiniz` şeklinde görünür.
- Ön onay kartında uygulama artık hiçbir rastgele/demo kart numarası üretmez veya yazmaz. Yüklenen görsel ne içeriyorsa yalnızca o görünür.


## V10.1 — Sistem alanları kesin kilit
- `phone` ve `tc_no` alanlarında artık Supabase'te eski/yanlış `type` kaydı bulunsa bile uygulama alan anahtarına göre kuralları zorunlu uygular.
- Cep telefonu yazma/yapıştırma/sürükle-bırak sırasında 10 ulusal haneden fazlasını kabul etmez ve `0 (5XX) XXX XX XX` formatlar.
- T.C. demo/test alanı 11 haneden fazlasını hiçbir giriş yönteminde kabul etmez.
- Ön onay ekranında uygulama tarafından üretilen kart numarası yoktur.


## V10.2 — Ön değerlendirme butonu düzeltmesi
- `Ön değerlendirmeyi tamamla` butonunu durduran JavaScript `effective is not defined` hatası giderildi.
- Doğrulama artık sistem alanlarının gerçek tipini (`tc_no`, `phone`, `birth` vb.) kullanır.
- Demo T.C. alanında gerçek bir kişiye ait geçerli kimlik numarası gerektirilmez; yalnızca 11 hane ve ilk hanenin 0 olmaması kontrol edilir.
- Telefon 5 ile başlayan 10 haneli mobil numara formatında doğrulanır.


## V10.3 — Taslak ve talep görselleri
- Talep sayfasındaki admin tarafından zorunlu yapılan alanların tamamı geçerli hale gelir gelmez yaklaşık 300 ms içinde Supabase `applications` tablosuna `draft` olarak kaydedilir.
- Taslak için anonim oturum eksikse uygulama yeniden anonim oturum açmayı dener.
- İlk taslak insert'inden sonra aynı kayıt güncellenir; her tuşta yeni satır oluşturulmaz.
- Admin Realtime aboneliği nedeniyle taslak kayıt `Başvurular / Taslaklar` ekranına otomatik düşer.
- Talep sayfasında yüklenmemiş logo/görsel alanları artık hiç render edilmez; boş kesik çizgili çerçeveler görünmez.


## V10.4 — Taslak kayıt sistemi kalıcı düzeltme
- Taslak ve `Talebi tamamla` artık anonim Supabase kullanıcı oturumuna bağımlı değildir.
- Tarayıcı başına üretilen rastgele `client_token` ile tek taslak satırı oluşturulur ve zorunlu talep alanları tamamlandıkça aynı satır güncellenir.
- Butona basıldığında aynı kayıt `submitted` durumuna geçirilir.
- Eski Supabase kurulumlarında eksik olabilecek `profession`, `custom_fields` ve `client_token` sütunları migration tarafından tamamlanır.
- Kurulum için `supabase/v10_4-upgrade.sql` dosyasını bir kez çalıştırmak zorunludur.


## V10.5 — Temiz taslak altyapısı
- Taslak sistemi eski `applications` tablosundaki geçmiş migration/constraint sorunlarından tamamen ayrıldı.
- Yeni `demo_applications` tablosu yalnızca `client_token + payload JSON + status` tutar.
- Talep sayfasındaki zorunlu alanlar tamamlanınca RPC aynı `client_token` satırını `draft` olarak upsert eder.
- `Talebi tamamla` aynı satırı `submitted` yapar.
- Admin paneli yeni tabloyu okuyup payload'ı mevcut kolon görünümüne dönüştürür.
- `v10_5-upgrade.sql` kendi içinde bir test kayıt oluşturup siler; SQL `Success` dönerse RPC de gerçekten çalışmış demektir.


## V10.6 — Referans görsele göre yeni ana sayfa
- Admin paneli ve çalışan Supabase/taslak sistemi korunmuştur.
- Ana sayfa referans taslağa yakın kırmızı/beyaz, kart tabanlı, responsive bir arayüze dönüştürülmüştür.
- Gerçek kurum logoları pakete eklenmemiştir. Referanstaki aynı üst konumlara admin panelinden iki ayrı logo yükleme alanı eklenmiştir.
- Hero ana görseli, hero kart görseli, her program için ayrı ana sayfa görseli ve alt promosyon görseli admin panelinden yüklenebilir.
- Ana başlıklar, CTA butonları, süreç adımları, istatistikler ve mobil alt menü yazıları admin panelinden düzenlenebilir.
- Yeni SQL migration gerekmez; tüm yeni ana sayfa alanları `site_settings.data` JSON içinde saklanır.
