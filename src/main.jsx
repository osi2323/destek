
import React, {useMemo, useState} from "react";
import { createRoot } from "react-dom/client";
import {
  ShieldCheck, Users, GraduationCap, Store, HeartHandshake, Landmark,
  ArrowRight, CheckCircle2, IdCard, FileCheck2, Home, UserRound, Info,
  BadgeCheck, RefreshCcw
} from "lucide-react";
import "./styles.css";

const cards = [
  {id:"aile", title:"Aile Destek Kartı", desc:"Hane bazlı sosyal destek başvurularının değerlendirilmesi için.", icon:Users},
  {id:"ogrenci", title:"Öğrenci Destek Kartı", desc:"Eğitimine devam eden öğrenciler için örnek destek programı.", icon:GraduationCap},
  {id:"55", title:"55 Yaş Üstü Destek Kartı", desc:"55 yaş ve üzeri vatandaşlar için örnek başvuru akışı.", icon:HeartHandshake},
  {id:"esnaf", title:"Esnaf Destek Kartı", desc:"Faaliyette bulunan küçük işletmeler ve esnaf için.", icon:Store},
  {id:"ev", title:"Ev Hanımları Destek Kartı", desc:"Ev içi emeğe yönelik örnek sosyal destek başvurusu.", icon:Home},
  {id:"emekli", title:"Emekli Destek Kartı", desc:"Emekliler için örnek destek başvuru programı.", icon:Landmark},
];

function rndCard(){
  let s="";
  for(let i=0;i<16;i++) s += Math.floor(Math.random()*10);
  return s.replace(/(\d{4})(?=\d)/g,"$1 ");
}

function App(){
  const [step,setStep]=useState(0);
  const [program,setProgram]=useState(null);
  const [form,setForm]=useState({name:"",surname:"",birth:"",city:"",district:"",phone:"",email:"",income:"",household:"",consent:false});
  const [request,setRequest]=useState({fullName:"",requestNo:""});
  const [error,setError]=useState("");
  const cardNo=useMemo(()=>rndCard(),[step===2]);

  const nextFromForm=()=>{
    if(!form.name || !form.surname || !form.birth || !form.city || !form.district || !form.phone || !form.consent){
      setError("Lütfen zorunlu alanları doldurun ve demo bilgilendirme onayını işaretleyin.");
      return;
    }
    setError("");
    setStep(2);
  };

  const finishRequest=()=>{
    if(!request.fullName.trim()){
      setError("Talep eden ad soyad alanı zorunludur.");
      return;
    }
    if(!/^\d{18}$/.test(request.requestNo)){
      setError("Talep numarası tam 18 haneli ve yalnızca rakamlardan oluşmalıdır.");
      return;
    }
    setError("");
    setStep(4);
  };

  return <div className="app">
    <div className="demoBar">DEMO PROTOTİP — RESMÎ KAMU HİZMETİ DEĞİLDİR — GERÇEK KİŞİSEL VERİ GİRMEYİN</div>
    <header className="header">
      <div className="brand">
        <div className="mark"><ShieldCheck size={28}/></div>
        <div>
          <strong>Sosyal Destek Kartları</strong>
          <span>Kurumsal Başvuru Prototipi</span>
        </div>
      </div>
      <div className="secure"><BadgeCheck size={18}/> Güvenli Demo Akışı</div>
    </header>

    <main className="container">
      {step===0 && <>
        <section className="hero">
          <div className="heroText">
            <span className="eyebrow">SOSYAL DESTEK PROGRAMLARI</span>
            <h1>Destek Kartları Başvuru Sistemi</h1>
            <p>Vatandaşların uygun destek programını seçerek örnek başvuru sürecini adım adım deneyimleyebilmesi için hazırlanmış sunum prototipidir.</p>
            <div className="notice"><Info size={20}/><span>Bu çalışma yalnızca proje sunumu içindir. Herhangi bir kamu kurumunu temsil etmez ve gerçek başvuru kabul etmez.</span></div>
          </div>
          <div className="heroPanel">
            <FileCheck2 size={38}/>
            <strong>Tek Noktadan Başvuru</strong>
            <p>Program seçimi, ön değerlendirme, kart ön izlemesi ve talep tamamlama akışı.</p>
          </div>
        </section>
        <h2 className="sectionTitle">Başvuru Türünü Seçin</h2>
        <div className="grid">
          {cards.map(c=>{
            const Icon=c.icon;
            return <button className="programCard" key={c.id} onClick={()=>{setProgram(c);setStep(1)}}>
              <div className="iconBox"><Icon size={24}/></div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <span>Başvuruya Başla <ArrowRight size={16}/></span>
            </button>
          })}
        </div>
      </>}

      {step===1 && <>
        <Progress current={1}/>
        <section className="panel">
          <div className="panelHead">
            <div><span className="eyebrow">ÖN BAŞVURU</span><h2>{program?.title}</h2></div>
            <button className="ghost" onClick={()=>setStep(0)}>Programı Değiştir</button>
          </div>
          <div className="infoStrip"><ShieldCheck size={20}/><span>Sunum demosu: Aşağıdaki alanlara gerçek kimlik, telefon veya adres bilgisi girmeyin.</span></div>
          <div className="formGrid">
            <Field label="Ad *" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Örn. Ahmet"/>
            <Field label="Soyad *" value={form.surname} onChange={v=>setForm({...form,surname:v})} placeholder="Örn. Yılmaz"/>
            <Field label="Doğum Tarihi *" type="date" value={form.birth} onChange={v=>setForm({...form,birth:v})}/>
            <Field label="İl *" value={form.city} onChange={v=>setForm({...form,city:v})} placeholder="Örn. Ankara"/>
            <Field label="İlçe *" value={form.district} onChange={v=>setForm({...form,district:v})} placeholder="Örn. Çankaya"/>
            <Field label="Telefon *" value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="Demo numara"/>
            <Field label="E-posta" type="email" value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="demo@example.com"/>
            <Field label="Aylık Hane Geliri" value={form.income} onChange={v=>setForm({...form,income:v})} placeholder="Örn. 25000"/>
            <Field label="Hane Kişi Sayısı" value={form.household} onChange={v=>setForm({...form,household:v})} placeholder="Örn. 4"/>
          </div>
          <label className="consent">
            <input type="checkbox" checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})}/>
            <span>Bu ekranın yalnızca proje demosu olduğunu, girdiğim bilgilerin gerçek başvuru oluşturmayacağını biliyorum.</span>
          </label>
          {error && <div className="error">{error}</div>}
          <div className="actions"><button className="primary" onClick={nextFromForm}>Ön Değerlendirmeyi Tamamla <ArrowRight size={18}/></button></div>
        </section>
      </>}

      {step===2 && <>
        <Progress current={2}/>
        <section className="panel approval">
          <div className="okCircle"><CheckCircle2 size={42}/></div>
          <span className="eyebrow">DEMO ÖN ONAY</span>
          <h2>Başvurunuz ön değerlendirmeye uygun görünüyor</h2>
          <p className="muted">Aşağıdaki kart yalnızca görsel ön izlemedir. Gerçek kart veya hak sahipliği oluşturmaz.</p>
          <div className="supportCard">
            <div className="cardTop">
              <div className="chip"></div>
              <span>DESTEK KARTI • DEMO</span>
            </div>
            <div className="cardNo">{cardNo}</div>
            <div className="cardBottom">
              <div><small>KART SAHİBİ</small><strong>{form.name.toUpperCase()} {form.surname.toUpperCase()}</strong></div>
              <div><small>PROGRAM</small><strong>{program?.title.replace(" Destek Kartı","")}</strong></div>
            </div>
          </div>
          <div className="actions center"><button className="primary" onClick={()=>{setRequest({...request,fullName:`${form.name} ${form.surname}`});setStep(3)}}>Başvurunu Tamamla <ArrowRight size={18}/></button></div>
        </section>
      </>}

      {step===3 && <>
        <Progress current={3}/>
        <section className="panel">
          <span className="eyebrow">TALEP SAYFASI</span>
          <h2>Talep doğrulama adımı</h2>
          <p className="muted">Sunum prototipinde kullanılmak üzere üç adet örnek görsel/logo alanı bulunmaktadır.</p>
          <div className="logoSlots">
            {[1,2,3].map(i=><div className="logoSlot" key={i}><IdCard size={30}/><span>Logo / Görsel {i}</span></div>)}
          </div>
          <div className="formGrid two">
            <Field label="Talep Eden Ad Soyad *" value={request.fullName} onChange={v=>setRequest({...request,fullName:v})} placeholder="Ad Soyad"/>
            <Field label="Talep Numarası *" value={request.requestNo} onChange={v=>setRequest({...request,requestNo:v.replace(/\D/g,"").slice(0,18)})} placeholder="Talep numarası" maxLength={18}/>
          </div>
          <div className="hint">Talep numarası 18 hane olmalıdır. Demo için örn: 123456789012345678</div>
          {error && <div className="error">{error}</div>}
          <div className="actions"><button className="primary" onClick={finishRequest}>Talebi Tamamla <CheckCircle2 size={18}/></button></div>
        </section>
      </>}

      {step===4 && <>
        <Progress current={4}/>
        <section className="panel final">
          <div className="okCircle"><CheckCircle2 size={42}/></div>
          <span className="eyebrow">DEMO TAMAMLANDI</span>
          <h2>Talep akışı başarıyla tamamlandı</h2>
          <p>Bu ekran yalnızca proje sunumu için hazırlanmıştır. Herhangi bir resmî kayıt veya başvuru oluşturulmamıştır.</p>
          <div className="summary">
            <div><span>Program</span><strong>{program?.title}</strong></div>
            <div><span>Başvuru Sahibi</span><strong>{request.fullName}</strong></div>
            <div><span>Demo Talep No</span><strong>{request.requestNo}</strong></div>
          </div>
          <button className="secondary" onClick={()=>{setStep(0);setProgram(null);setError("");setRequest({fullName:"",requestNo:""})}}><RefreshCcw size={18}/> Yeni Demo Başlat</button>
        </section>
      </>}
    </main>
    <footer>© 2026 Destek Kartları Proje Prototipi • Resmî kurum sitesi değildir.</footer>
  </div>
}

function Field({label,value,onChange,placeholder,type="text",maxLength}){
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}/></label>
}

function Progress({current}){
  const steps=["Başvuru","Ön Onay","Talep","Tamamlandı"];
  return <div className="progress">{steps.map((s,i)=><div className={"pItem "+(i+1<=current?"active":"")} key={s}><div>{i+1}</div><span>{s}</span></div>)}</div>
}

createRoot(document.getElementById("root")).render(<App/>);
