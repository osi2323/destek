export const defaultSettings = {
  site_title: 'Sosyal Destek Kartları',
  site_subtitle: 'Kurumsal Başvuru Prototipi',
  demo_ribbon: { text:'RESMÎ KAMU HİZMETİ DEĞİLDİR — GERÇEK KİŞİSEL VERİ GİRMEYİN' },
  top_bar: { enabled:true, text:'Destek programlarını inceleyin ve uygun başvuru türünü seçin.' },
  header: { safe_text:'Güvenli demo akışı', logo_url:'', home_aria:'Ana sayfa' },
  home: {
    eyebrow:'DESTEK PROGRAMLARIMIZ',
    hero_title:'Size Uygun Destek Kartınızı Kolayca Alın!',
    hero_text:'İhtiyacınıza uygun destek programını seçin, bilgilerinizi girin ve başvuru akışını birkaç adımda tamamlayın.',
    notice_text:'Bu çalışma proje sunumu içindir; herhangi bir kamu kurumunu temsil etmez ve gerçek başvuru kabul etmez.',
    side_title:'Tek Kart, Tüm Destekler',
    side_text:'Destek seçeneklerinizi tek noktadan inceleyin ve size uygun programa başvurun.',
    side_icon_url:'',
    notice_icon_url:'',
    programs_title:'Size Uygun Kartı Seçin',
    programs_subtitle:'İhtiyacınıza özel destek programları burada.',
    program_button:'Başvuru Yap',
    header_left_logo_url:'',
    header_right_logo_url:'',
    hero_image_url:'',
    hero_card_image_url:'',
    hero_primary_button:'HEMEN BAŞVURU YAP',
    hero_secondary_button:'DESTEK KARTLARINI İNCELE',
    process_title:'Başvuru Süreci',
    process_items:[
      {title:'Kartınızı Seçin',text:'İhtiyacınıza uygun destek kartını seçin.'},
      {title:'Bilgilerinizi Girin',text:'Gerekli bilgileri eksiksiz doldurun.'},
      {title:'Ön Değerlendirme',text:'Başvurunuz ön değerlendirmeden geçsin.'},
      {title:'Başvuruyu Tamamlayın',text:'Talep adımını tamamlayın.'}
    ],
    program_images:{},
    stats:[
      {value:'6+',label:'Destek Programı'},
      {value:'Hızlı',label:'Başvuru Akışı'},
      {value:'Mobil',label:'Uyumlu Sistem'},
      {value:'7/24',label:'Proje Erişimi'}
    ],
    promo_title:'Tek Kart, Tüm Destekler!',
    promo_text:'Destek programlarını tek ekranda inceleyin ve uygun başvuru akışını başlatın.',
    promo_button:'HEMEN BAŞVURU YAP',
    promo_image_url:'',
    bottom_nav:['Ana Sayfa','Kartlar','Başvuru Yap','Başvuru Sorgula','İletişim']
  },
  preform: {
    eyebrow:'ÖN BAŞVURU',
    notice:'Bu proje demosunda gerçek T.C. kimlik veya iletişim bilgisi kullanmayın.',
    consent:'Bu prototipin demo olduğunu ve form bilgilerinin yalnızca proje akışını göstermek için kullanılacağını biliyorum.',
    back_button:'Geri', next_button:'Ön değerlendirmeyi tamamla',
    fields:{
      name:{label:'Ad',placeholder:'Adınızı girin',required:true,visible:true,type:'text',order:1,min_length:2,max_length:50},
      surname:{label:'Soyad',placeholder:'Soyadınızı girin',required:true,visible:true,type:'text',order:2,min_length:2,max_length:50},
      tc_no:{label:'T.C. Kimlik Numarası',placeholder:'11 haneli demo/test numarası',required:true,visible:true,type:'tc',order:3,min_length:11,max_length:11},
      birth:{label:'Doğum Tarihi',placeholder:'',required:true,visible:true,type:'date',order:4},
      phone:{label:'Cep Telefonu',placeholder:'0 (5XX) XXX XX XX',required:true,visible:true,type:'phone',order:5,min_length:10,max_length:10},
      profession:{label:'Meslek',placeholder:'Mesleğinizi yazın',required:false,visible:true,type:'text',order:6,min_length:2,max_length:80},
      city:{label:'İl',placeholder:'İl seçiniz / yazınız',required:true,visible:true,type:'text',order:7,min_length:2,max_length:40},
      district:{label:'İlçe',placeholder:'İlçe seçiniz / yazınız',required:true,visible:true,type:'text',order:8,min_length:2,max_length:50},
      address:{label:'Açık Adres',placeholder:'Mahalle / köy, cadde, sokak, bina ve daire bilgisi',required:true,visible:true,type:'text',order:9,min_length:10,max_length:180},
      income:{label:'Aylık Hane Geliri',placeholder:'Örn. 25000',required:false,visible:true,type:'number',max_length:9,order:10},
      household:{label:'Hane Kişi Sayısı',placeholder:'Örn. 4',required:false,visible:true,type:'number',max_length:2,order:11}
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
  footer:{
    text:'© 2026 Destek Kartları Proje Prototipi',
    subtext:'Resmî kurum sitesi değildir.',
    items:[
      {id:'f1',type:'text',title:'Destek Kartları',text:'Proje prototipi bilgilendirme alanı.',image_url:'',url:'',order:1},
      {id:'f2',type:'text',title:'Bilgilendirme',text:'Bu çalışma sunum amacıyla hazırlanmıştır.',image_url:'',url:'',order:2}
    ]
  }
}

export const defaultPrograms = [
  ['Aile Destek Kartı','Hane bazlı sosyal destek başvurularının değerlendirilmesi için.','users'],
  ['Öğrenci Destek Kartı','Eğitimine devam eden öğrenciler için örnek destek programı.','graduation'],
  ['55 Yaş Üstü Destek Kartı','55 yaş ve üzeri kişiler için örnek destek başvurusu.','heart'],
  ['Esnaf Destek Kartı','Faaliyette bulunan küçük işletmeler ve esnaf için.','store'],
  ['Ev Hanımları Destek Kartı','Ev içi emeğe yönelik örnek sosyal destek başvurusu.','home'],
  ['Emekli Destek Kartı','Emekliler için örnek destek başvuru programı.','landmark']
].map((x,i)=>({id:`demo-${i+1}`,title:x[0],description:x[1],icon:x[2],card_image_url:'',card_text_color:'#ffffff',active:true,sort_order:i+1}))
