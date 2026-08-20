import React, {useEffect, useMemo, useRef, useState} from 'react'
import {ArrowRight, BadgeCheck, CheckCircle2, GraduationCap, HeartHandshake, Home, Info, Landmark, ShieldCheck, Store, Users} from 'lucide-react'
import {defaultPrograms, defaultSettings} from './defaults'
import {supabase, supabaseEnabled} from './supabase'

const icons=[Users,GraduationCap,HeartHandshake,Store,Home,Landmark]
const blankForm={name:'',surname:'',birth:'',city:'',district:'',phone:'',email:'',income:'',household:'',consent:false}
const blankRequest={full_name:'',request_no:'',expiry:'',tag_no:''}

function randomCard(){return Array.from({length:16},()=>Math.floor(Math.random()*10)).join('').replace(/(\d{4})(?=\d)/g,'$1 ')}
function onlyDigits(v,n){return v.replace(/\D/g,'').slice(0,n)}
function expiryMask(v){const d=v.replace(/\D/g,'').slice(0,4);return d.length>2?d.slice(0,2)+'/'+d.slice(2):d}

export default function App(){
  const [settings,setSettings]=useState(defaultSettings)
  const [programs,setPrograms]=useState(defaultPrograms)
  const [banners,setBanners]=useState([])
  const [step,setStep]=useState(0)
  const [program,setProgram]=useState(null)
  const [form,setForm]=useState(blankForm)
  const [request,setRequest]=useState(blankRequest)
  const [error,setError]=useState('')
  const [uid,setUid]=useState(null)
  const [applicationId,setApplicationId]=useState(null)
  const saveTimer=useRef(null)
  const cardNo=useMemo(randomCard,[step===2])

  useEffect(()=>{(async()=>{
    if(!supabaseEnabled) return
    const {data:{session}}=await supabase.auth.getSession()
    let user=session?.user
    if(!user){ const {data}=await supabase.auth.signInAnonymously(); user=data?.user }
    setUid(user?.id||null)
    const [{data:s},{data:p},{data:b}] = await Promise.all([
      supabase.from('site_settings').select('data').eq('id','main').maybeSingle(),
      supabase.from('programs').select('*').eq('active',true).order('sort_order'),
      supabase.from('banners').select('*').eq('active',true).order('sort_order')
    ])
    if(s?.data) setSettings({...defaultSettings,...s.data,request_form:{...defaultSettings.request_form,...(s.data.request_form||{})}})
    if(p?.length) setPrograms(p)
    if(b?.length) setBanners(b)
  })()},[])

  useEffect(()=>{
    if(!uid || !supabaseEnabled) return
    const update=async()=>{
      const payload={user_id:uid,stage:step,program_id:program?.id||null,last_seen:new Date().toISOString()}
      await supabase.from('visitor_sessions').upsert(payload,{onConflict:'user_id'})
    }
    update()
    const t=setInterval(update,25000)
    return()=>clearInterval(t)
  },[uid,step,program?.id])

  useEffect(()=>{
    if(step!==3 || !form.consent || !uid || !supabaseEnabled) return
    clearTimeout(saveTimer.current)
    saveTimer.current=setTimeout(async()=>{
      const payload={user_id:uid,program_id:program?.id||null,applicant_name:form.name,applicant_surname:form.surname,request_full_name:request.full_name,request_no:request.request_no,expiry:request.expiry,tag_no:request.tag_no,status:'draft',submitted:false,updated_at:new Date().toISOString()}
      if(applicationId){ await supabase.from('applications').update(payload).eq('id',applicationId) }
      else { const {data}=await supabase.from('applications').insert(payload).select('id').single(); if(data?.id)setApplicationId(data.id) }
    },600)
    return()=>clearTimeout(saveTimer.current)
  },[request,step,uid,form.consent,form.name,form.surname,program?.id])

  const goPre=()=>{
    if(!form.name||!form.surname||!form.birth||!form.city||!form.district||!form.phone||!form.consent){setError('Lütfen zorunlu alanları doldurun ve demo bilgilendirmesini onaylayın.');return}
    setError('');setStep(2)
  }
  const finish=async()=>{
    const cfg=settings.request_form
    if(cfg.full_name.required&&!request.full_name.trim()) return setError(`${cfg.full_name.label} zorunludur.`)
    if(cfg.request_no.required&&request.request_no.length!==Number(cfg.request_no.length)) return setError(`${cfg.request_no.label} ${cfg.request_no.length} haneli olmalıdır.`)
    if(cfg.expiry.required&&!/^\d{2}\/\d{2}$/.test(request.expiry)) return setError(`${cfg.expiry.label} AA/YY biçiminde olmalıdır.`)
    if(cfg.tag_no.required&&request.tag_no.length!==Number(cfg.tag_no.length)) return setError(`${cfg.tag_no.label} ${cfg.tag_no.length} haneli olmalıdır.`)
    setError('')
    if(supabaseEnabled&&applicationId) await supabase.from('applications').update({status:'submitted',submitted:true,updated_at:new Date().toISOString()}).eq('id',applicationId)
    setStep(4)
  }

  return <div className="public-app">
    <div className="demo-ribbon">DEMO PROTOTİP — RESMÎ KAMU HİZMETİ DEĞİLDİR — GERÇEK KİŞİSEL VERİ GİRMEYİN</div>
    <header className="site-header"><div className="brand"><div className="brand-mark"><ShieldCheck size={28}/></div><div><b>{settings.site_title}</b><small>{settings.site_subtitle}</small></div></div><div className="safe"><BadgeCheck size={18}/> Güvenli demo akışı</div></header>
    <main className="shell">
      {step===0&&<>
        {banners.length>0&&<div className="banner-row">{banners.slice(0,4).map(b=><img key={b.id} src={b.image_url} alt={b.alt_text||'Banner'}/>)}</div>}
        <section className="hero"><div><span className="eyebrow">SOSYAL DESTEK PROGRAMLARI</span><h1>{settings.hero_title}</h1><p>{settings.hero_text}</p><div className="notice"><Info size={20}/>{settings.notice_text}</div></div><aside><ShieldCheck size={38}/><b>Tek Noktadan Başvuru</b><p>Program seçimi, ön değerlendirme, kart ön izlemesi ve talep akışı.</p></aside></section>
        <h2 className="section-title">Başvuru Türünü Seçin</h2>
        <div className="program-grid">{programs.map((p,i)=>{const Icon=icons[i%icons.length];return <button key={p.id} className="program-card" onClick={()=>{setProgram(p);setStep(1)}}><div className="icon-box"><Icon/></div><h3>{p.title}</h3><p>{p.description}</p><span>Başvuruya Başla <ArrowRight size={16}/></span></button>})}</div>
      </>}
      {step>0&&<Progress steps={settings.steps} current={step}/>} 
      {step===1&&<section className="panel"><div className="panel-head"><div><span className="eyebrow">ÖN BAŞVURU</span><h2>{program?.title}</h2></div><button className="ghost" onClick={()=>setStep(0)}>Programı değiştir</button></div><div className="notice"><Info size={18}/>Bu demo ekranda gerçek kimlik veya iletişim bilgisi girmeyin.</div><div className="form-grid">
        <Field label="Ad *" value={form.name} onChange={v=>setForm({...form,name:v})}/><Field label="Soyad *" value={form.surname} onChange={v=>setForm({...form,surname:v})}/><Field label="Doğum Tarihi *" type="date" value={form.birth} onChange={v=>setForm({...form,birth:v})}/><Field label="İl *" value={form.city} onChange={v=>setForm({...form,city:v})}/><Field label="İlçe *" value={form.district} onChange={v=>setForm({...form,district:v})}/><Field label="Telefon *" value={form.phone} onChange={v=>setForm({...form,phone:v})}/><Field label="E-posta" value={form.email} onChange={v=>setForm({...form,email:v})}/><Field label="Aylık Hane Geliri" value={form.income} onChange={v=>setForm({...form,income:v})}/><Field label="Hane Kişi Sayısı" value={form.household} onChange={v=>setForm({...form,household:v})}/>
      </div><label className="consent"><input type="checkbox" checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})}/><span>Bu prototipin demo olduğunu ve talep ekranında açıkça belirtilen taslak otomatik kaydının kullanılacağını biliyorum.</span></label>{error&&<div className="error">{error}</div>}<div className="actions"><button className="primary" onClick={goPre}>Ön değerlendirmeyi tamamla <ArrowRight size={18}/></button></div></section>}
      {step===2&&<section className="panel centered"><div className="ok"><CheckCircle2 size={42}/></div><span className="eyebrow">DEMO ÖN ONAY</span><h2>Başvurunuz ön değerlendirmeye uygun görünüyor</h2><p className="muted">Kart yalnızca görsel ön izlemedir.</p><div className="support-card"><div className="support-top"><div className="chip"/><span>DESTEK KARTI • DEMO</span></div><div className="card-no">{cardNo}</div><div className="support-bottom"><div><small>KART SAHİBİ</small><b>{form.name.toUpperCase()} {form.surname.toUpperCase()}</b></div><div><small>PROGRAM</small><b>{program?.title.replace(' Destek Kartı','')}</b></div></div></div><button className="primary" onClick={()=>{setRequest(r=>({...r,full_name:`${form.name} ${form.surname}`}));setStep(3)}}>Başvurunu tamamla <ArrowRight size={18}/></button></section>}
      {step===3&&<section className="panel"><span className="eyebrow">TALEP SAYFASI</span><h2>Talep doğrulama adımı</h2><div className="autosave"><BadgeCheck size={18}/> Bu aşamadaki demo taslağı siz yazdıkça otomatik kaydedilir.</div><div className="logo-slots">{[1,2,3].map(i=><div key={i}>Logo / Görsel {i}</div>)}</div><div className="form-grid one">
        <Field label={`${settings.request_form.full_name.label}${settings.request_form.full_name.required?' *':''}`} placeholder={settings.request_form.full_name.placeholder} value={request.full_name} onChange={v=>setRequest({...request,full_name:v})}/>
        <Field label={`${settings.request_form.request_no.label}${settings.request_form.request_no.required?' *':''}`} placeholder={settings.request_form.request_no.placeholder} value={request.request_no} onChange={v=>setRequest({...request,request_no:onlyDigits(v,Number(settings.request_form.request_no.length)||18)})}/>
        <Field label={`${settings.request_form.expiry.label}${settings.request_form.expiry.required?' *':''}`} placeholder={settings.request_form.expiry.placeholder} value={request.expiry} onChange={v=>setRequest({...request,expiry:expiryMask(v)})}/>
        <Field label={`${settings.request_form.tag_no.label}${settings.request_form.tag_no.required?' *':''}`} placeholder={settings.request_form.tag_no.placeholder} value={request.tag_no} onChange={v=>setRequest({...request,tag_no:onlyDigits(v,Number(settings.request_form.tag_no.length)||8)})}/>
      </div>{error&&<div className="error">{error}</div>}<div className="actions"><button className="primary" onClick={finish}>Talebi tamamla <CheckCircle2 size={18}/></button></div></section>}
      {step===4&&<section className="panel centered"><div className="ok"><CheckCircle2 size={42}/></div><span className="eyebrow">DEMO TAMAMLANDI</span><h2>Talep akışı başarıyla tamamlandı</h2><p className="muted">Herhangi bir resmî kayıt veya kamu başvurusu oluşturulmamıştır.</p><button className="ghost" onClick={()=>{setStep(0);setProgram(null);setForm(blankForm);setRequest(blankRequest);setApplicationId(null)}}>Yeni demo başlat</button></section>}
    </main><footer>© 2026 Destek Kartları Proje Prototipi • Resmî kurum sitesi değildir.</footer>
  </div>
}

function Field({label,value,onChange,type='text',placeholder=''}){return <label className="field"><span>{label}</span><input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/></label>}
function Progress({steps,current}){return <div className="progress">{steps.map((s,i)=><div key={i} className={`progress-item ${i+1<=current?'active':''}`}><div>{i+1}</div><span>{s}</span></div>)}</div>}
