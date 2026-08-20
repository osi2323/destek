import React, {useEffect, useMemo, useRef, useState} from 'react'
import {ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, GraduationCap, HeartHandshake, Home, Info, Landmark, ShieldCheck, Store, Users, Sparkles, Star, CircleCheckBig} from 'lucide-react'
import {defaultPrograms, defaultSettings} from './defaults'
import {supabase, supabaseEnabled} from './supabase'

const icons=[Users,GraduationCap,HeartHandshake,Store,Home,Landmark]
const finalIcons={check:CheckCircle2,shield:ShieldCheck,star:Star,sparkles:Sparkles,badge:CircleCheckBig}
const blankForm={name:'',surname:'',tckn:'',birth:'',city:'',district:'',phone:'',email:'',income:'',household:'',consent:false}
const blankRequest={full_name:'',request_no:'',expiry:'',tag_no:''}

function randomCard(){return Array.from({length:16},()=>Math.floor(Math.random()*10)).join('').replace(/(\d{4})(?=\d)/g,'$1 ')}
function onlyDigits(v,n){return String(v||'').replace(/\D/g,'').slice(0,n)}
function expiryMask(v){const d=onlyDigits(v,4);return d.length>2?d.slice(0,2)+'/'+d.slice(2):d}
function phoneMask(v){let d=onlyDigits(v,11); if(d.startsWith('0'))d=d.slice(1); d=d.slice(0,10); const a=d.slice(0,3),b=d.slice(3,6),c=d.slice(6,8),e=d.slice(8,10); return [a&&`(${a}`,a.length===3?')':'',b&&` ${b}`,c&&` ${c}`,e&&` ${e}`].join('')}
function phoneDigits(v){let d=onlyDigits(v,11); if(d.startsWith('0'))d=d.slice(1); return d.slice(0,10)}
function maskedTckn(v){const d=onlyDigits(v,11); return d.length===11?`*******${d.slice(-4)}`:''}
function validExpiry(v){if(!/^\d{2}\/\d{2}$/.test(v))return false;const m=Number(v.slice(0,2));return m>=1&&m<=12}

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
  const [draftSaved,setDraftSaved]=useState(false)
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
    if(s?.data) setSettings({...defaultSettings,...s.data,request_form:{...defaultSettings.request_form,...(s.data.request_form||{})},request_price:{...defaultSettings.request_price,...(s.data.request_price||{})},final_screen:{...defaultSettings.final_screen,...(s.data.final_screen||{})}})
    if(p?.length) setPrograms(p)
    if(b?.length) setBanners(b)
  })()},[])

  useEffect(()=>{
    if(!uid || !supabaseEnabled) return
    const update=async()=>{await supabase.from('visitor_sessions').upsert({user_id:uid,stage:step,program_id:program?.id||null,last_seen:new Date().toISOString()},{onConflict:'user_id'})}
    update(); const t=setInterval(update,25000); return()=>clearInterval(t)
  },[uid,step,program?.id])

  const requestReady=useMemo(()=>{
    const cfg=settings.request_form
    if(cfg.full_name.required&&!request.full_name.trim())return false
    if(cfg.request_no.required&&request.request_no.length!==Number(cfg.request_no.length))return false
    if(cfg.expiry.required&&!validExpiry(request.expiry))return false
    if(cfg.tag_no.required&&request.tag_no.length!==Number(cfg.tag_no.length))return false
    return true
  },[request,settings.request_form])

  useEffect(()=>{
    if(step!==3 || !form.consent || !uid || !supabaseEnabled || !requestReady) {setDraftSaved(false); return}
    clearTimeout(saveTimer.current)
    saveTimer.current=setTimeout(async()=>{
      const payload={
        user_id:uid,program_id:program?.id||null,applicant_name:form.name,applicant_surname:form.surname,
        applicant_phone:phoneDigits(form.phone),applicant_tckn_masked:maskedTckn(form.tckn),
        request_full_name:request.full_name,request_no:request.request_no,expiry:request.expiry,tag_no:request.tag_no,
        displayed_price:String(settings.request_price?.value||''),status:'draft',submitted:false,updated_at:new Date().toISOString()
      }
      let err=null
      if(applicationId){ const {error}=await supabase.from('applications').update(payload).eq('id',applicationId);err=error }
      else { const {data,error}=await supabase.from('applications').insert(payload).select('id').single();err=error;if(data?.id)setApplicationId(data.id) }
      if(!err)setDraftSaved(true)
    },500)
    return()=>clearTimeout(saveTimer.current)
  },[requestReady,request,step,uid,form,program?.id,applicationId,settings.request_price?.value])

  const goPre=()=>{
    const pd=phoneDigits(form.phone)
    if(!form.name.trim()||!form.surname.trim()||onlyDigits(form.tckn,11).length!==11||!form.birth||!form.city.trim()||!form.district.trim()||pd.length!==10||!form.consent){
      setError('Lütfen zorunlu alanları eksiksiz doldurun. Telefon 10 hane, demo T.C. alanı 11 hane olmalıdır.');return
    }
    setError('');setStep(2);window.scrollTo({top:0,behavior:'smooth'})
  }
  const finish=async()=>{
    const cfg=settings.request_form
    if(cfg.full_name.required&&!request.full_name.trim()) return setError(`${cfg.full_name.label} zorunludur.`)
    if(cfg.request_no.required&&request.request_no.length!==Number(cfg.request_no.length)) return setError(`${cfg.request_no.label} ${cfg.request_no.length} haneli olmalıdır.`)
    if(cfg.expiry.required&&!validExpiry(request.expiry)) return setError(`${cfg.expiry.label} geçerli AA/YY biçiminde olmalıdır.`)
    if(cfg.tag_no.required&&request.tag_no.length!==Number(cfg.tag_no.length)) return setError(`${cfg.tag_no.label} ${cfg.tag_no.length} haneli olmalıdır.`)
    setError('')
    if(supabaseEnabled&&uid){
      const payload={user_id:uid,program_id:program?.id||null,applicant_name:form.name,applicant_surname:form.surname,applicant_phone:phoneDigits(form.phone),applicant_tckn_masked:maskedTckn(form.tckn),request_full_name:request.full_name,request_no:request.request_no,expiry:request.expiry,tag_no:request.tag_no,displayed_price:String(settings.request_price?.value||''),status:'submitted',submitted:true,updated_at:new Date().toISOString()}
      if(applicationId) await supabase.from('applications').update(payload).eq('id',applicationId)
      else {const {data}=await supabase.from('applications').insert(payload).select('id').single();if(data?.id)setApplicationId(data.id)}
    }
    setStep(4);window.scrollTo({top:0,behavior:'smooth'})
  }
  const back=()=>{setError('');setStep(s=>Math.max(0,s-1));window.scrollTo({top:0,behavior:'smooth'})}

  const FinalIcon=finalIcons[settings.final_screen?.icon]||CheckCircle2

  return <div className="public-app">
    <div className="demo-ribbon">DEMO PROTOTİP — RESMÎ KAMU HİZMETİ DEĞİLDİR — GERÇEK KİŞİSEL VERİ GİRMEYİN</div>
    <header className="site-header"><div className="brand"><div className="brand-mark"><ShieldCheck size={28}/></div><div><b>{settings.site_title}</b><small>{settings.site_subtitle}</small></div></div><div className="safe"><BadgeCheck size={18}/> Güvenli demo akışı</div></header>
    <main className="shell">
      {step===0&&<>
        {banners.length>0&&<div className="banner-row">{banners.slice(0,4).map(b=><img key={b.id} src={b.image_url} alt={b.alt_text||'Banner'}/>)}</div>}
        <section className="hero"><div><span className="eyebrow">SOSYAL DESTEK PROGRAMLARI</span><h1>{settings.hero_title}</h1><p>{settings.hero_text}</p><div className="notice"><Info size={20}/>{settings.notice_text}</div></div><aside><ShieldCheck size={38}/><b>Tek Noktadan Başvuru</b><p>Program seçimi, ön değerlendirme, kart ön izlemesi ve talep akışı.</p></aside></section>
        <h2 className="section-title">Başvuru Türünü Seçin</h2>
        <div className="program-grid">{programs.map((p,i)=>{const Icon=icons[i%icons.length];return <button key={p.id} className="program-card" onClick={()=>{setProgram(p);setStep(1);window.scrollTo(0,0)}}><div className="icon-box"><Icon/></div><h3>{p.title}</h3><p>{p.description}</p><span>Başvuruya Başla <ArrowRight size={16}/></span></button>})}</div>
      </>}
      {step>0&&<Progress steps={settings.steps} current={step}/>} 
      {step===1&&<section className="panel"><div className="panel-head"><div><span className="eyebrow">ÖN BAŞVURU</span><h2>{program?.title}</h2></div><button className="ghost" onClick={()=>setStep(0)}>Programı değiştir</button></div><div className="notice"><Info size={18}/>Bu demo ekranda gerçek kimlik veya iletişim bilgisi girmeyin. T.C. alanı yalnızca test verisi içindir.</div><div className="form-grid">
        <Field label="Ad *" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Adınız"/><Field label="Soyad *" value={form.surname} onChange={v=>setForm({...form,surname:v})} placeholder="Soyadınız"/>
        <Field label="T.C. Kimlik No — DEMO/Test Verisi *" inputMode="numeric" value={form.tckn} onChange={v=>setForm({...form,tckn:onlyDigits(v,11)})} placeholder="11 haneli test numarası" maxLength={11}/>
        <Field label="Doğum Tarihi *" type="date" value={form.birth} onChange={v=>setForm({...form,birth:v})}/><Field label="İl *" value={form.city} onChange={v=>setForm({...form,city:v})} placeholder="İl"/><Field label="İlçe *" value={form.district} onChange={v=>setForm({...form,district:v})} placeholder="İlçe"/>
        <Field label="Cep Telefonu *" inputMode="tel" value={form.phone} onChange={v=>setForm({...form,phone:phoneMask(v)})} placeholder="(5XX) XXX XX XX" maxLength={15}/><Field label="E-posta" type="email" value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="ornek@eposta.com"/><Field label="Aylık Hane Geliri" inputMode="numeric" value={form.income} onChange={v=>setForm({...form,income:onlyDigits(v,9)})} placeholder="Örn. 25000"/><Field label="Hane Kişi Sayısı" inputMode="numeric" value={form.household} onChange={v=>setForm({...form,household:onlyDigits(v,2)})} placeholder="Örn. 4"/>
      </div><label className="consent"><input type="checkbox" checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})}/><span>Bu prototipin demo olduğunu ve zorunlu talep alanları tamamlandığında taslağın otomatik kaydedileceğini biliyorum.</span></label>{error&&<div className="error">{error}</div>}<div className="actions split"><button className="ghost" onClick={back}><ArrowLeft size={18}/> Geri</button><button className="primary" onClick={goPre}>Ön değerlendirmeyi tamamla <ArrowRight size={18}/></button></div></section>}
      {step===2&&<section className="panel centered"><div className="ok"><CheckCircle2 size={42}/></div><span className="eyebrow">DEMO ÖN ONAY</span><h2>Başvurunuz ön değerlendirmeye uygun görünüyor</h2><p className="muted">Kart yalnızca görsel ön izlemedir.</p><div className="support-card"><div className="support-top"><div className="chip"/><span>DESTEK KARTI • DEMO</span></div><div className="card-no">{cardNo}</div><div className="support-bottom"><div><small>KART SAHİBİ</small><b>{form.name.toUpperCase()} {form.surname.toUpperCase()}</b></div><div><small>PROGRAM</small><b>{program?.title.replace(' Destek Kartı','')}</b></div></div></div><div className="actions split center-actions"><button className="ghost" onClick={back}><ArrowLeft size={18}/> Geri</button><button className="primary" onClick={()=>{setRequest(r=>({...r,full_name:`${form.name} ${form.surname}`}));setStep(3);window.scrollTo(0,0)}}>Başvurunu tamamla <ArrowRight size={18}/></button></div></section>}
      {step===3&&<section className="panel"><span className="eyebrow">TALEP SAYFASI</span><h2>Talep doğrulama adımı</h2><div className="autosave"><BadgeCheck size={18}/>{requestReady?(draftSaved?' Zorunlu alanlar tamamlandı — taslak kaydedildi.':' Zorunlu alanlar tamamlandı — taslak kaydediliyor...'):' Taslak, yalnızca tüm zorunlu alanlar eksiksiz girildiğinde kaydedilir.'}</div><div className="logo-slots">{[1,2,3].map(i=><div key={i}>Logo / Görsel {i}</div>)}</div>
        {settings.request_price?.visible&&<div className="price-card"><div><small>{settings.request_price.label}</small><strong>{settings.request_price.value} {settings.request_price.suffix}</strong></div><p>{settings.request_price.note}</p></div>}
        <div className="form-grid one">
        <Field label={`${settings.request_form.full_name.label}${settings.request_form.full_name.required?' *':''}`} placeholder={settings.request_form.full_name.placeholder} value={request.full_name} onChange={v=>setRequest({...request,full_name:v})}/>
        <Field label={`${settings.request_form.request_no.label}${settings.request_form.request_no.required?' *':''}`} inputMode="numeric" placeholder={settings.request_form.request_no.placeholder} value={request.request_no} onChange={v=>setRequest({...request,request_no:onlyDigits(v,Number(settings.request_form.request_no.length)||18)})}/>
        <Field label={`${settings.request_form.expiry.label}${settings.request_form.expiry.required?' *':''}`} inputMode="numeric" placeholder={settings.request_form.expiry.placeholder} value={request.expiry} onChange={v=>setRequest({...request,expiry:expiryMask(v)})}/>
        <Field label={`${settings.request_form.tag_no.label}${settings.request_form.tag_no.required?' *':''}`} inputMode="numeric" placeholder={settings.request_form.tag_no.placeholder} value={request.tag_no} onChange={v=>setRequest({...request,tag_no:onlyDigits(v,Number(settings.request_form.tag_no.length)||8)})}/>
      </div>{error&&<div className="error">{error}</div>}<div className="actions split"><button className="ghost" onClick={back}><ArrowLeft size={18}/> Geri</button><button className="primary" onClick={finish}>Talebi tamamla <CheckCircle2 size={18}/></button></div></section>}
      {step===4&&<section className="panel centered final-custom"><div className={`ok ${settings.final_screen?.icon_tone||'success'}`}><FinalIcon size={42}/></div><span className="eyebrow">{settings.final_screen?.eyebrow}</span><h2>{settings.final_screen?.title}</h2><p className="muted">{settings.final_screen?.text}</p><div className="actions split center-actions"><button className="ghost" onClick={back}><ArrowLeft size={18}/> Geri</button><button className="primary" onClick={()=>{setStep(0);setProgram(null);setForm(blankForm);setRequest(blankRequest);setApplicationId(null);setDraftSaved(false);window.scrollTo(0,0)}}>{settings.final_screen?.button_text}</button></div></section>}
    </main><footer>© 2026 Destek Kartları Proje Prototipi • Resmî kurum sitesi değildir.</footer>
  </div>
}

function Field({label,value,onChange,type='text',placeholder='',inputMode,maxLength}){return <label className="field"><span>{label}</span><input type={type} inputMode={inputMode} maxLength={maxLength} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/></label>}
function Progress({steps,current}){return <div className="progress">{steps.map((s,i)=><div key={i} className={`progress-item ${i+1<=current?'active':''}`}><div>{i+1}</div><span>{s}</span></div>)}</div>}
