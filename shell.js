/* ===== هيكل المنصة المشترك: سايدبار + شريط علوي + تحقق الجلسة. كل صفحة بتحمّل بياناتها هي بس ===== */
const ME=VU(),ME_ID=ME&&ME.id;let ADM=false,TCH=false,BANNED=false;
const nf=new Intl.NumberFormat('ar-EG');
const ERRM={locked:'الشات مقفول حاليًا',slow:'استنى ثانية بين الرسائل'};
const em=e=>ERRM[String(e&&e.message||e).trim()]||'حصل خطأ، جرّب تاني';
async function guard(fn){try{return await fn()}catch(e){toast(em(e),true)}}
const SK=(n,h)=>'<div class="cg">'+Array.from({length:n},()=>'<div class="sk" style="height:'+(h||240)+'px"></div>').join('')+'</div>';
const ic=p=>'<svg viewBox="0 0 24 24">'+p+'</svg>';
const ICON={
 courses:ic('<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5zM4 20.5A2.5 2.5 0 006.5 18"/>'),
 lives:ic('<circle cx="12" cy="12" r="3"/><path d="M6.3 6.3a8 8 0 000 11.4M17.7 6.3a8 8 0 010 11.4M3.5 3.5a12 12 0 000 17M20.5 3.5a12 12 0 010 17"/>'),
 questions:ic('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 115 .5c0 1.5-2.5 2-2.5 3.5M12 17h.01"/>'),
 chat:ic('<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/>'),
 admin:ic('<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
 teach:ic('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5M22 9v6"/>'),
 out:ic('<path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 17l-5-5 5-5M5 12h12"/>'),
 book:ic('<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z"/>'),
 play:ic('<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>'),
 ok:ic('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
 pct:ic('<path d="M19 5L5 19M7 7h.01M17 17h.01"/>')};
const NAVS=[['courses','الكورسات','courses'],['lives','اللايفات','lives'],['questions','الأسئلة','questions'],['chat','الشات','chat']];
const PG=document.body.dataset.p;
function pgHead(t,s,x){return `<div class="ph"><div><h1>${t}</h1>${s?`<p>${s}</p>`:''}</div>${x||''}</div>`}
function logout(){setVU(null);try{sessionStorage.clear()}catch(_){}location.replace(MAIN_VIBE)}
function buildShell(){const pg=document.getElementById('pg'),first=((ME.name||'').split(' ')[0])||'؟';
 const a=(k,t,h)=>`<a class="nv ${PG===k?'on':''}" href="${h}">${ICON[k]}<span>${t}</span>${k==='lives'?'<i class="dot" id="liveDot" hidden></i>':''}</a>`;
 const side=`<aside class="sb"><a href="courses" class="logo"><span class="logo-mark"></span><span>مجتمع الفايب كودينج</span></a>
  <span class="sb-l">التعلّم</span>${NAVS.map(([k,t,h])=>a(k,t,h)).join('')}
  <a class="nv ${PG==='teachers'?'on':''}" id="nTch" href="teachers" hidden>${ICON.teach}<span>صفحة المدرسين</span></a>
  <span class="sb-l" id="adL" hidden>الإدارة</span><a class="nv ${PG==='admin'?'on':''}" id="nAdm" href="admin-courses" hidden>${ICON.admin}<span>لوحة الإدارة</span></a>
  <div class="sb-u"><span class="av">${esc(first[0]||'؟')}</span><span><b>${esc(ME.name||'')}</b><small id="ur">عضو</small></span><button id="lo" aria-label="خروج" title="خروج">${ICON.out}</button></div></aside>`;
 const top=`<header class="tb"><a href="courses" class="logo"><span class="logo-mark"></span><span>الفايب كودينج</span></a><div style="display:flex;align-items:center;gap:10px"><span class="av">${esc(first[0]||'؟')}</span><button class="btn btn-o btn-s" id="lo2">خروج</button></div></header>`;
 const bn=`<nav class="bn">${NAVS.map(([k,t,h])=>`<a class="${PG===k?'on':''}" href="${h}">${ICON[k]}<span>${t}</span>${k==='lives'?'<i class="dot" id="liveDot2" hidden></i>':''}</a>`).join('')}<a id="bTch" class="${PG==='teachers'?'on':''}" href="teachers" hidden>${ICON.teach}<span>المدرسين</span></a><a id="bAdm" class="${PG==='admin'?'on':''}" href="admin-courses" hidden>${ICON.admin}<span>الإدارة</span></a></nav>`;
 const app=document.createElement('div');app.className='app';app.innerHTML=side+'<div class="mn">'+top+'</div>'+bn;
 app.querySelector('.mn').appendChild(pg);document.body.prepend(app);
 document.getElementById('lo').onclick=logout;document.getElementById('lo2').onclick=logout}
/* حالة العضو (حظر/أدمن) بتتحفظ 10 دقايق في الجلسة عشان مفيش طلبات زيادة مع كل صفحة */
async function loadMeta(){let m=null;try{m=JSON.parse(sessionStorage.getItem('vc_meta')||'null')}catch(_){}
 if(m&&m.id===ME_ID&&typeof m.tch==='boolean'&&Date.now()-m.t<6e5){ADM=m.adm;TCH=m.tch;BANNED=m.ban;return}
 try{const r=await vget('aa_vc_members?select=banned&user_id=eq.'+ME_ID);
  if(!r.length)await vpost('aa_vc_members?on_conflict=user_id',{user_id:ME_ID,name:ME.name||'عضو'},'resolution=ignore-duplicates,return=minimal');
  else BANNED=!!r[0].banned}catch(_){}
 try{ADM=await vrpc('vc_is_admin')===true}catch(_){}
 try{TCH=await vrpc('vc_is_teacher')===true}catch(_){}
 try{sessionStorage.setItem('vc_meta',JSON.stringify({id:ME_ID,adm:ADM,tch:TCH,ban:BANNED,t:Date.now()}))}catch(_){}}
function setLive(v){['liveDot','liveDot2'].forEach(i=>{const e=document.getElementById(i);if(e)e.hidden=!v});try{sessionStorage.setItem('vc_live',JSON.stringify({v:!!v,t:Date.now()}))}catch(_){}}
function liveCheck(){let m=null;try{m=JSON.parse(sessionStorage.getItem('vc_live')||'null')}catch(_){}
 if(m&&Date.now()-m.t<9e4){setLive(m.v);return}
 if(PG==='lives')return;
 vget('aa_vc_lives?select=status&status=eq.live&limit=1').then(r=>setLive(r.length)).catch(()=>{})}
/* تشغيل الصفحة: opts.admin لصفحات الإدارة */
async function run(fn,opts){opts=opts||{};
 if(!ME||!ME.token){location.replace('login');return}
 buildShell();await loadMeta();
 const pg=document.getElementById('pg');
 if(BANNED){pg.innerHTML='<div class="vc-er" style="background:#fef3f2;border:1px solid #fecdca;border-radius:14px;padding:14px 18px">تم حظر حسابك من المجتمع. تواصل مع الدعم لو ده خطأ.</div>';return}
 if(ADM){['nAdm','adL','bAdm'].forEach(i=>{const e=document.getElementById(i);if(e)e.hidden=false});const u=document.getElementById('ur');if(u)u.textContent='مدرّس'}
 else if(opts.admin){location.replace('courses');return}
 if((ADM||TCH)){['nTch','bTch'].forEach(i=>{const e=document.getElementById(i);if(e)e.hidden=false});const u=document.getElementById('ur');if(u&&!ADM)u.textContent='مدرّس'}
 else if(opts.teacher){location.replace('courses');return}
 liveCheck();await fn()}
