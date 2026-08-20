export const defaultSettings = {
  site_title: 'Sosyal Destek Kartları',
  site_subtitle: 'Kurumsal Başvuru Prototipi',
  hero_title: 'Destek Kartları Başvuru Sistemi',
  hero_text: 'Uygun destek programını seçerek örnek başvuru sürecini adım adım inceleyin.',
  notice_text: 'Bu çalışma proje sunumu içindir; herhangi bir kamu kurumunu temsil etmez ve gerçek başvuru kabul etmez.',
  steps: ['Başvuru', 'Ön Onay', 'Talep', 'Tamamlandı'],
  request_form: {
    full_name: { label:'Talep Eden Ad Soyad', placeholder:'Ad Soyad', required:true },
    request_no: { label:'Talep Numarası', placeholder:'Talep numarası', required:true, length:18 },
    expiry: { label:'Ay / Yıl', placeholder:'AA/YY', required:true },
    tag_no: { label:'TAG', placeholder:'8 haneli TAG numarası', required:true, length:8 }
  },
  request_price: { visible:true, label:'Başvuru / Kart Bedeli', value:'0,00', suffix:'₺', note:'Demo fiyat alanı — admin panelinden değiştirilebilir.' },
  final_screen: {
    eyebrow:'DEMO TAMAMLANDI',
    title:'Talep akışı başarıyla tamamlandı',
    text:'Herhangi bir resmî kayıt veya kamu başvurusu oluşturulmamıştır.',
    icon:'check',
    icon_tone:'success',
    button_text:'Yeni demo başlat'
  }
}

export const defaultPrograms = [
  ['Aile Destek Kartı','Hane bazlı sosyal destek başvurularının değerlendirilmesi için.'],
  ['Öğrenci Destek Kartı','Eğitimine devam eden öğrenciler için örnek destek programı.'],
  ['55 Yaş Üstü Destek Kartı','55 yaş ve üzeri kişiler için örnek destek başvurusu.'],
  ['Esnaf Destek Kartı','Faaliyette bulunan küçük işletmeler ve esnaf için.'],
  ['Ev Hanımları Destek Kartı','Ev içi emeğe yönelik örnek sosyal destek başvurusu.'],
  ['Emekli Destek Kartı','Emekliler için örnek destek başvuru programı.']
].map((x,i)=>({id:`demo-${i+1}`,title:x[0],description:x[1],active:true,sort_order:i+1}))
