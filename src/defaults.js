export const defaultSettings = {
  site_title: 'Sosyal Destek Kartları',
  site_subtitle: 'Kurumsal Başvuru Prototipi',
  demo_ribbon: { text:'RESMÎ KAMU HİZMETİ DEĞİLDİR — GERÇEK KİŞİSEL VERİ GİRMEYİN' },
  top_bar: { enabled:true, text:'Destek programlarını inceleyin ve uygun başvuru türünü seçin.' },
  header: { safe_text:'Güvenli demo akışı', logo_url:'', home_aria:'Ana sayfa' },
  home: {
    eyebrow:'SOSYAL DESTEK PROGRAMLARI',
    hero_title:'Destek Kartları Başvuru Sistemi',
    hero_text:'Uygun destek programını seçerek örnek başvuru sürecini adım adım inceleyin.',
    notice_text:'Bu çalışma proje sunumu içindir; herhangi bir kamu kurumunu temsil etmez ve gerçek başvuru kabul etmez.',
    side_title:'Tek Noktadan Başvuru',
    side_text:'Program seçimi, ön değerlendirme, kart ön izlemesi ve talep akışı.',
    programs_title:'Başvuru Türünü Seçin',
    program_button:'Başvuruya Başla'
  },
  preform: {
    eyebrow:'ÖN BAŞVURU',
    notice:'Bu proje demosunda gerçek T.C. kimlik veya iletişim bilgisi kullanmayın.',
    consent:'Bu prototipin demo olduğunu ve form bilgilerinin yalnızca proje akışını göstermek için kullanılacağını biliyorum.',
    back_button:'Geri', next_button:'Ön değerlendirmeyi tamamla',
    fields:{
      name:{label:'Ad',placeholder:'Adınızı girin',required:true,visible:true},
      surname:{label:'Soyad',placeholder:'Soyadınızı girin',required:true,visible:true},
      tc_no:{label:'T.C. Kimlik Numarası',placeholder:'11 haneli demo/test numarası',required:true,visible:true},
      birth:{label:'Doğum Tarihi',placeholder:'',required:true,visible:true},
      city:{label:'İl',placeholder:'İl',required:true,visible:true},
      district:{label:'İlçe',placeholder:'İlçe',required:true,visible:true},
      phone:{label:'Cep Telefonu',placeholder:'+90 (5XX) XXX XX XX',required:true,visible:true},
      email:{label:'E-posta',placeholder:'ornek@eposta.com',required:false,visible:true},
      income:{label:'Aylık Hane Geliri',placeholder:'Örn. 25000',required:false,visible:true},
      household:{label:'Hane Kişi Sayısı',placeholder:'Örn. 4',required:false,visible:true}
    }
  },
  steps: ['Başvuru','Ön Onay','Talep','Tamamlandı'],
  buttons:{ preapproval_back:'Geri', preapproval_next:'Başvurunu tamamla', request_back:'Geri', request_submit:'Talebi tamamla' },
  preapproval:{
    eyebrow:'DEMO ÖN ONAY', title:'Başvurunuz ön değerlendirmeye uygun görünüyor', text:'Kart aşağıda ön izleme olarak gösterilmektedir.',
    card_image_url:'', card_text_color:'#ffffff', card_title:'DESTEK KARTI • DEMO', holder_label:'KART SAHİBİ', program_label:'PROGRAM',
    card_number_label:'', image_width_hint:'1600 × 1000 px', image_ratio_hint:'8:5'
  },
  request_page:{
    eyebrow:'TALEP SAYFASI', title:'Talep doğrulama adımı',
    price_enabled:true, price_title:'Başvuru / Kart Bedeli', price_value:'0,00', price_currency:'₺', price_subtitle:'',
    logo_urls:['','','']
  },
  request_form: {
    full_name:{label:'Talep Eden Ad Soyad',placeholder:'Ad Soyad',required:true},
    request_no:{label:'Talep Numarası',placeholder:'18 haneli talep numarası',required:true,length:18},
    expiry:{label:'Ay / Yıl',placeholder:'AA/YY',required:true},
    tag_no:{label:'TAG',placeholder:'8 haneli TAG numarası',required:true,length:8}
  },
  final_page:{
    eyebrow:'BAŞVURU TAMAMLANDI', title:'Talebiniz başarıyla oluşturuldu', text:'Başvuru süreciniz tamamlandı. Bu ekran proje prototipine ait örnek sonuç sayfasıdır.',
    icon_url:'', icon_size:72, summary_title:'Başvuru Özeti', program_label:'Program', applicant_label:'Başvuru Sahibi', request_label:'Talep Numarası',
    home_button:'Ana Sayfaya Dön', back_button:'Talep Sayfasına Dön'
  },
  footer:{ text:'© 2026 Destek Kartları Proje Prototipi', subtext:'Resmî kurum sitesi değildir.' }
}

export const defaultPrograms = [
  ['Aile Destek Kartı','Hane bazlı sosyal destek başvurularının değerlendirilmesi için.','users'],
  ['Öğrenci Destek Kartı','Eğitimine devam eden öğrenciler için örnek destek programı.','graduation'],
  ['55 Yaş Üstü Destek Kartı','55 yaş ve üzeri kişiler için örnek destek başvurusu.','heart'],
  ['Esnaf Destek Kartı','Faaliyette bulunan küçük işletmeler ve esnaf için.','store'],
  ['Ev Hanımları Destek Kartı','Ev içi emeğe yönelik örnek sosyal destek başvurusu.','home'],
  ['Emekli Destek Kartı','Emekliler için örnek destek başvuru programı.','landmark']
].map((x,i)=>({id:`demo-${i+1}`,title:x[0],description:x[1],icon:x[2],card_image_url:'',card_text_color:'#ffffff',active:true,sort_order:i+1}))
