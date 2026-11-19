/* ============================================================
   Automify — App Logic
   ============================================================
   1. Supabase client setup
   2. Navigation router (fixed)
   3. Work grid + case study renderers
   4. Form submit handlers (all forms → Supabase)
   ============================================================ */

// ─────────────────────────────────────────────
// SUPABASE CLIENT
// ─────────────────────────────────────────────
var SUPA_URL  = 'https://gfdfogubtzppfmkyicaq.supabase.co';
var SUPA_KEY  = 'sb_publishable_CCPBYztjqYjJ95UeIuOTgw_pDOi9y1Z';
var supa;

(function initSupabase(){
  try {
    if(window.supabase && window.supabase.createClient){
      supa = window.supabase.createClient(SUPA_URL, SUPA_KEY);
      console.log('[Automify] Supabase ready');
    } else {
      // retry once SDK finishes loading
      window.addEventListener('load', function(){
        if(window.supabase && window.supabase.createClient){
          supa = window.supabase.createClient(SUPA_URL, SUPA_KEY);
          console.log('[Automify] Supabase ready (deferred)');
        }
      });
    }
  } catch(e){ console.warn('[Automify] Supabase init failed:', e); }
})();

// ─────────────────────────────────────────────
// PROJECT DATA
// ─────────────────────────────────────────────
var CS = {
  talentflow:{slug:'talentflow',num:'01',cat:'SaaS Platform',title:'TalentFlow HR Portal',client:'TalentFlow Inc',location:'United Kingdom',desc:'I rebuilt a broken HR system into a fully automated recruitment and onboarding platform that handles thousands of employees across five offices without a single spreadsheet.',s1:'312%',sl1:'faster onboarding',s2:'4,800+',sl2:'employees managed',s3:'$2.1M',sl3:'saved annually',tech:['React','Node.js','Supabase','PostgreSQL','Redis'],color:'linear-gradient(135deg,#0d2240,#1a3860)',color2:'#01afe9'},
  nexashop:{slug:'nexashop',num:'02',cat:'E-commerce Platform',title:'NexaShop Marketplace',client:'NexaShop Ltd',location:'Germany',desc:'A multi-vendor marketplace that went from crashing at 200 concurrent users to running 48,000 active vendors across six countries with 99.97 percent uptime since day one of launch.',s1:'48k+',sl1:'active vendors',s2:'99.97%',sl2:'uptime achieved',s3:'2.4s',sl3:'avg page load',tech:['Next.js','Node.js','Stripe','PostgreSQL','Redis'],color:'linear-gradient(135deg,#160d2a,#2a1550)',color2:'#7b2ff7'},
  finpulse:{slug:'finpulse',num:'03',cat:'Analytics Dashboard',title:'FinPulse Financial Dashboard',client:'FinPulse Corp',location:'United States',desc:'Finance teams were waiting 48 hours for data that was already two days old. I built a real-time analytics engine that delivers insights in 60 milliseconds, with live transaction feeds and intelligent anomaly detection.',s1:'60ms',sl1:'data delivery time',s2:'$4.2M',sl2:'transactions tracked daily',s3:'99.9%',sl3:'data accuracy',tech:['React','Python','FastAPI','Supabase','WebSockets'],color:'linear-gradient(135deg,#0a1a28,#102030)',color2:'#01afe9'},
  databridge:{slug:'databridge',num:'04',cat:'API Integration',title:'DataBridge Enterprise Hub',client:'DataBridge Solutions',location:'United States',desc:'53 disconnected data sources. Zero visibility across the business. I designed a central integration hub that connects every system in real time and eliminated the data silos that were costing the team 30 hours a week.',s1:'53',sl1:'systems connected',s2:'30hrs',sl2:'saved per week',s3:'99.95%',sl3:'sync reliability',tech:['Python','FastAPI','PostgreSQL','Redis','Docker'],color:'linear-gradient(135deg,#0a2010,#143020)',color2:'#22d675'},
  clearpath:{slug:'clearpath',num:'05',cat:'Legal Tech',title:'ClearPath Legal Workflow',client:'ClearPath Legal',location:'United Kingdom',desc:'Legal teams were drowning in manual document review and missed deadlines. I built an AI-powered workflow platform that automates the most time-consuming parts of legal work so the team could focus on the cases that actually matter.',s1:'78%',sl1:'less document handling',s2:'140+',sl2:'firms using platform',s3:'3.5hrs',sl3:'saved per case',tech:['React','Node.js','OpenAI','PostgreSQL','Supabase'],color:'linear-gradient(135deg,#1a1500,#302800)',color2:'#f59e0b'},
  staynow:{slug:'staynow',num:'06',cat:'Hospitality Platform',title:'StayNow Rental Marketplace',client:'StayNow Inc',location:'United Kingdom',desc:'Payments were failing silently. Listings took three minutes to load. I rebuilt the entire platform from the architecture up, turning a broken booking experience into the fastest-growing short-term rental site in Scotland.',s1:'340%',sl1:'booking increase',s2:'18,000+',sl2:'active listings',s3:'0.9s',sl3:'booking completion',tech:['Next.js','Node.js','Stripe','Supabase','PostgreSQL'],color:'linear-gradient(135deg,#1a0d08,#301808)',color2:'#f97316'},
  medtrack:{slug:'medtrack',num:'07',cat:'Healthcare SaaS',title:'MedTrack Patient Management',client:'MedTrack Health',location:'Africa',desc:'Nurses were spending two hours per shift just trying to find patient records. I gave those two hours back to patient care, across 85 hospitals, by building a secure patient management system that makes every record searchable in under two seconds.',s1:'420k+',sl1:'patient records secured',s2:'2hrs',sl2:'saved per nurse shift',s3:'85',sl3:'hospitals live',tech:['React','Node.js','PostgreSQL','Supabase','Redis'],color:'linear-gradient(135deg,#1a0a1a,#2a1030)',color2:'#a401e9'},
  edulaunch:{slug:'edulaunch',num:'08',cat:'EdTech Platform',title:'EduLaunch Learning Platform',client:'EduLaunch Inc',location:'Africa',desc:'Three universities needed to move their entire curriculum online in eight weeks. I built a learning platform that handled the transition for 32,000 students without a single lost grade, lost session, or failed submission.',s1:'32k+',sl1:'students onboarded',s2:'98.6%',sl2:'course completion rate',s3:'8wks',sl3:'full migration time',tech:['React','Node.js','Supabase','PostgreSQL','Redis'],color:'linear-gradient(135deg,#1a1500,#302800)',color2:'#eab308'},
  logiroute:{slug:'logiroute',num:'09',cat:'Logistics Platform',title:'LogiRoute Delivery System',client:'LogiRoute Global',location:'Europe',desc:'A logistics company was running its entire delivery network on WhatsApp messages and a spreadsheet. I replaced that with a live tracking platform that handles 2,400 daily deliveries across 11 countries with real-time driver updates.',s1:'2.4k',sl1:'daily deliveries tracked',s2:'31%',sl2:'faster delivery times',s3:'11',sl3:'countries live',tech:['React','Node.js','PostgreSQL','WebSockets','Redis'],color:'linear-gradient(135deg,#0a1828,#102030)',color2:'#3b82f6'},
  brandpulse:{slug:'brandpulse',num:'10',cat:'Marketing Analytics',title:'BrandPulse Analytics Suite',client:'BrandPulse Agency',location:'United States',desc:'A marketing agency was manually compiling 40-page reports that took two weeks to produce. I automated the entire reporting pipeline so the same reports now run themselves in four minutes, pulling live data from 24 connected sources.',s1:'24',sl1:'data sources connected',s2:'4min',sl2:'vs 2 weeks before',s3:'340%',sl3:'client retention increase',tech:['React','Python','FastAPI','PostgreSQL','Supabase'],color:'linear-gradient(135deg,#200a1a,#380c2a)',color2:'#ec4899'},
  propvault:{slug:'propvault',num:'11',cat:'Real Estate Platform',title:'PropVault Property Hub',client:'PropVault Realty',location:'United States',desc:'18,000 property listings and zero way to search them properly. Agents were phoning each other to find out what was available. I built a search engine that knows what a buyer wants before they finish typing.',s1:'18k+',sl1:'listings managed',s2:'73%',sl2:'faster property search',s3:'$12M+',sl3:'transactions processed',tech:['Next.js','Node.js','Google Maps API','Stripe','PostgreSQL'],color:'linear-gradient(135deg,#061a0a,#0d2a10)',color2:'#22c55e'},
  vaultpay:{slug:'vaultpay',num:'12',cat:'Payment Gateway',title:'VaultPay Gateway',client:'VaultPay Inc',location:'Singapore',desc:'$180 million moved through a system that had already failed three payment processors before I touched it. Every single transaction arrived. Zero chargebacks from technical errors. Not one.',s1:'$180M+',sl1:'processed safely',s2:'0.3s',sl2:'avg payment time',s3:'99.99%',sl3:'uptime',tech:['Node.js','Stripe','Plaid','PostgreSQL','Redis'],color:'linear-gradient(135deg,#1a1200,#2a1e00)',color2:'#f59e0b'},
  shopflow:{slug:'shopflow',num:'13',cat:'Retail Platform',title:'ShopFlow Inventory System',client:'ShopFlow Retail',location:'Canada',desc:'200,000 products across 14 warehouses. The team was manually counting stock on spreadsheets at 2am every Sunday. I ended that completely on the day we went live.',s1:'200k+',sl1:'SKUs tracked live',s2:'94%',sl2:'stock accuracy',s3:'6wk',sl3:'delivery time',tech:['React','Node.js','Supabase','Shopify API','PostgreSQL'],color:'linear-gradient(135deg,#001a1a,#002a2a)',color2:'#06b6d4'},
  pulsecrm:{slug:'pulsecrm',num:'14',cat:'CRM Platform',title:'PulseCRM Sales Hub',client:'PulseCRM',location:'Australia',desc:'The sales team had 900 leads in an Excel file and no idea which ones were ready to buy. Three months after I launched PulseCRM they had closed all 900 deals and were asking for more leads.',s1:'420%',sl1:'pipeline visibility',s2:'31%',sl2:'shorter sales cycle',s3:'900+',sl3:'deals closed',tech:['React','Node.js','PostgreSQL','Zapier','Twilio'],color:'linear-gradient(135deg,#1a0a1a,#2a1030)',color2:'#a855f7'},
  adaptai:{slug:'adaptai',num:'15',cat:'AI Platform',title:'AdaptAI Content Engine',client:'AdaptAI',location:'United States',desc:'One person. 4.2 million pieces of content per month. That was the brief. I did not ask if it was possible. I just made it happen and handed them the keys.',s1:'10x',sl1:'content output',s2:'87%',sl2:'cost reduction',s3:'4.2M',sl3:'pieces per month',tech:['Python','FastAPI','OpenAI','PostgreSQL','React'],color:'linear-gradient(135deg,#001a14,#002a20)',color2:'#10b981'},
  velo:{slug:'velo',num:'16',cat:'Last Mile Delivery',title:'Velo Delivery App',client:'Velo Logistics',location:'Nigeria',desc:'2,400 deliveries a day across 6 cities. Couriers were calling dispatch to find out where to go next. I ended that completely and gave every courier a system smarter than any dispatcher.',s1:'2.4k+',sl1:'daily deliveries',s2:'94%',sl2:'on-time rate',s3:'6',sl3:'cities live',tech:['React Native','Node.js','Google Maps API','PostgreSQL','WebSockets'],color:'linear-gradient(135deg,#061a0a,#0A0F1E)',color2:'#00E676'}
};

// ─────────────────────────────────────────────
// NAVIGATION HELPERS
// ─────────────────────────────────────────────

// Sections that live inside page-home (scroll-based nav)
var SCROLL_SECTIONS = ['services','process','recognition','faq','contact','ba','locations','clients','tbreak','apart'];

function go(page){
  window.location.hash = page;
}

// openPopup / closePopup / toggleNav / closeNav are defined in the
// inline <script> block inside index.html — do NOT redefine them here
// or the CSS .open-class animations break.

// ─────────────────────────────────────────────
// ROUTER (FIXED)
// ─────────────────────────────────────────────

function initReveal(){
  var pg = document.querySelector('.page.active');
  if(!pg) return;
  pg.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(function(el){
    el.classList.add('vis');
  });
}

function router(){
  var hash = (location.hash || '').replace(/^#\/?/,'').trim() || 'home';

  // --- Case studies ---
  if(hash.indexOf('cs-') === 0){
    var slug = hash.replace('cs-','');
    document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
    var csPg = document.getElementById('page-cs');
    if(csPg){
      csPg.classList.add('active');
      renderCS(slug);
    }
    window.scrollTo({top:0, behavior:'instant'});
    setTimeout(initReveal, 100);
    return;
  }

  // --- Sections inside page-home (scroll into view) ---
  if(SCROLL_SECTIONS.indexOf(hash) > -1){
    // Make sure page-home is active
    document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
    var homePg = document.getElementById('page-home');
    if(homePg) homePg.classList.add('active');
    // Scroll to section
    var target = document.getElementById(hash);
    if(target){
      setTimeout(function(){
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }, 50);
    }
    setTimeout(initReveal, 200);
    return;
  }

  // --- Standard page routing ---
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  var pname = hash;
  var pg = document.getElementById('page-' + pname);
  if(pg){ pg.classList.add('active'); }
  window.scrollTo({top:0, behavior:'instant'});
  setTimeout(initReveal, 100);

  if(pname === 'work'){
    renderWorkGrid();
    setTimeout(renderWorkGrid, 100);
  }
  if(pname === 'film'){
    setTimeout(function(){
      if(typeof FP !== 'undefined'){ FP.init(); FP.startBg(); }
    }, 150);
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', function(){
  router();
});

// ─────────────────────────────────────────────
// WORK GRID
// ─────────────────────────────────────────────

function renderWorkGrid(){
  var grid = document.getElementById('work-grid');
  if(!grid) return;
  if(grid.dataset.rendered === '1') return;
  grid.dataset.rendered = '1';

  var tfSvgEl  = document.querySelector('.wg .pc.wide .pscr svg');
  var cbSvgEl  = document.querySelector('.wg .pc.chatbridge .pscr svg');
  var fpSvgEl  = document.querySelector('.wg .pc.finpulse .pscr svg');
  var nsSvgEl  = document.querySelector('.wg .pc.nexashop .pscr svg');
  var cpSvgEl  = document.querySelector('.wg .pc.clearpath .pscr svg');
  var dbSvgEl  = document.querySelector('.wg .pc.databridge .pscr svg');
  var tfSvg = tfSvgEl ? tfSvgEl.outerHTML : '';
  var cbSvg = cbSvgEl ? cbSvgEl.outerHTML : '';
  var fpSvg = fpSvgEl ? fpSvgEl.outerHTML : '';
  var nsSvg = nsSvgEl ? nsSvgEl.outerHTML : '';
  var cpSvg = cpSvgEl ? cpSvgEl.outerHTML : '';
  var dbSvg = dbSvgEl ? dbSvgEl.outerHTML : '';

  var html = '';
  Object.keys(CS).forEach(function(k){
    var p = CS[k];
    html += '<div class="wcard" data-cat="'+p.cat+'" style="border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);transition:transform .3s,box-shadow .3s">';
    var previewBg = (p.slug==='talentflow'&&tfSvg)?'#f1f5f9':(p.slug==='databridge'&&cbSvg)?'#0a0f1e':(p.slug==='finpulse'&&fpSvg)?'#070d1a':(p.slug==='nexashop'&&nsSvg)?'#e8f0ff':(p.slug==='clearpath'&&cpSvg)?'#f0fdf8':(p.slug==='databridge'&&dbSvg)?'#f0f4f8':(p.slug==='staynow')?'#e8ecf8':(p.slug==='medtrack')?'#1a0d2e':(p.slug==='velo')?'#0A0F1E':(p.slug==='edulaunch')?'#fefce8':(p.slug==='logiroute')?'#0a1828':(p.slug==='brandpulse')?'#1a0515':(p.slug==='propvault')?'#f0fdf4':(p.slug==='vaultpay')?'#fffbeb':(p.slug==='pulsecrm')?'#faf5ff':(p.slug==='shopflow')?'#e0f7fa':p.color;
    html += '<div style="aspect-ratio:16/10;background:'+previewBg+';position:relative;overflow:hidden">';
    if(p.slug==='talentflow'&&tfSvg){ html+='<div style="position:absolute;inset:0;overflow:hidden">'+tfSvg+'</div>'; }
    else if(p.slug==='databridge'&&cbSvg){ html+='<div style="position:absolute;inset:0;overflow:hidden">'+cbSvg+'</div>'; }
    else if(p.slug==='finpulse'&&fpSvg){ html+='<div style="position:absolute;inset:0;overflow:hidden">'+fpSvg+'</div>'; }
    else if(p.slug==='nexashop'&&nsSvg){ html+='<div style="position:absolute;inset:0;overflow:hidden">'+nsSvg+'</div>'; }
    else if(p.slug==='clearpath'&&cpSvg){ html+='<div style="position:absolute;inset:0;overflow:hidden">'+cpSvg+'</div>'; }
    else if(p.slug==='staynow'){ html+='<img src="'+SN_IMG+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">'; }
    else if(p.slug==='medtrack'){ html+='<img src="'+MT_IMG+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">'; }
    else if(p.slug==='velo'){ html+='<img src="'+VL_IMG+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">'; }
    else if(p.slug==='edulaunch'){ html+='<img src="'+EL_IMG+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">'; }
    else if(p.slug==='logiroute'){ html+='<img src="'+LR_IMG+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">'; }
    else if(p.slug==='brandpulse'){ html+='<img src="'+BP_IMG+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">'; }
    else if(p.slug==='propvault'){ html+='<img src="'+PV_IMG+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">'; }
    else if(p.slug==='vaultpay'){ html+='<img src="'+VP_IMG+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">'; }
    else if(p.slug==='adaptai'){ html+='<img src="'+AD_IMG+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">'; }
    else if(p.slug==='pulsecrm'){ html+='<img src="'+PC_IMG+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">'; }
    else if(p.slug==='shopflow'){ html+='<img src="'+SF_IMG+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">'; }
    else {
      html += '<div style="position:absolute;inset:0;padding:20px 24px 16px;display:flex;flex-direction:column;gap:9px">';
      html += '<div style="display:flex;align-items:center;gap:6px"><div style="width:9px;height:9px;border-radius:50%;background:rgba(255,90,80,.75)"></div><div style="width:9px;height:9px;border-radius:50%;background:rgba(254,185,46,.75)"></div><div style="width:9px;height:9px;border-radius:50%;background:rgba(39,201,63,.75)"></div><div style="flex:1;height:12px;background:rgba(255,255,255,.07);border-radius:4px;margin-left:10px"></div></div>';
      html += '<div style="height:8px;background:rgba(255,255,255,.1);border-radius:3px;width:60%"></div>';
      html += '<div style="flex:1;background:rgba(255,255,255,.04);border-radius:10px;border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center"><div style="text-align:center;padding:16px"><div style="font-family:Syne,sans-serif;font-size:clamp(12px,1.4vw,15px);font-weight:700;color:rgba(255,255,255,.8);margin-bottom:5px">'+p.title+'</div><div style="font-size:10px;color:rgba(255,255,255,.3);letter-spacing:1.5px;text-transform:uppercase">Screenshot Placeholder</div></div></div>';
      html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px"><div style="height:26px;background:rgba(255,255,255,.06);border-radius:4px"></div><div style="height:26px;background:rgba(255,255,255,.04);border-radius:4px"></div><div style="height:26px;background:rgba(255,255,255,.08);border-radius:4px"></div></div>';
      html += '</div>';
    }
    html += '<div style="position:absolute;top:14px;right:16px;font-family:Syne,sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,.35)">'+p.num+'</div>';
    html += '<div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,'+p.color2+',#7b2ff7)"></div>';
    html += '</div>';
    html += '<div style="padding:24px 24px 20px">';
    html += '<div style="font-size:10px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:'+p.color2+';margin-bottom:10px">'+p.cat+'</div>';
    html += '<h3 style="font-family:Syne,sans-serif;font-size:clamp(17px,1.8vw,20px);font-weight:800;letter-spacing:-.4px;margin:0 0 10px;line-height:1.3">'+p.title+'</h3>';
    var sd = p.desc.length > 115 ? p.desc.substring(0,115)+'...' : p.desc;
    html += '<p style="color:rgba(255,255,255,.45);font-size:13.5px;line-height:1.75;margin-bottom:18px">'+sd+'</p>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;padding:14px 0;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:16px">';
    html += '<div style="text-align:center;padding-right:12px"><div style="font-family:Syne,sans-serif;font-size:17px;font-weight:800;color:'+p.color2+'">'+p.s1+'</div><div style="font-size:10px;color:rgba(255,255,255,.32);margin-top:3px;line-height:1.4">'+p.sl1+'</div></div>';
    html += '<div style="text-align:center;padding:0 8px;border-left:1px solid rgba(255,255,255,.06);border-right:1px solid rgba(255,255,255,.06)"><div style="font-family:Syne,sans-serif;font-size:17px;font-weight:800;color:'+p.color2+'">'+p.s2+'</div><div style="font-size:10px;color:rgba(255,255,255,.32);margin-top:3px;line-height:1.4">'+p.sl2+'</div></div>';
    html += '<div style="text-align:center;padding-left:12px"><div style="font-family:Syne,sans-serif;font-size:17px;font-weight:800;color:'+p.color2+'">'+p.s3+'</div><div style="font-size:10px;color:rgba(255,255,255,.32);margin-top:3px;line-height:1.4">'+p.sl3+'</div></div>';
    html += '</div>';
    html += '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:16px">';
    p.tech.forEach(function(t){ html += '<span style="font-size:10.5px;padding:3px 10px;border-radius:100px;border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.4)">'+t+'</span>'; });
    html += '</div>';
    html += '<button data-slug="cs-'+p.slug+'" data-col="'+p.color2+'" onclick="go(this.dataset.slug)" onmouseover="this.style.background=this.dataset.col;this.style.borderColor=this.dataset.col;this.style.color=\'#080f1e\'" onmouseout="this.style.cssText=\'width:100%;padding:13px;border-radius:11px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#fff;font-family:Syne,sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;letter-spacing:.4px\'" style="width:100%;padding:13px;border-radius:11px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#fff;font-family:Syne,sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;transition:all .22s;letter-spacing:.4px">View Case Study &#8594;</button>';
    html += '</div>';
    html += '</div>';
  });
  grid.innerHTML = html;
}

window.filterWork = function(el, cat){
  document.querySelectorAll('.wftab').forEach(function(t){ t.classList.remove('on'); });
  el.classList.add('on');
  document.querySelectorAll('.wcard').forEach(function(c){
    c.style.display = (cat === 'all' || c.dataset.cat.toLowerCase().indexOf(cat.toLowerCase()) > -1) ? '' : 'none';
  });
};

// ─────────────────────────────────────────────
// CASE STUDY RENDERER
// ─────────────────────────────────────────────

function renderCS(slug){
  var p = CS[slug]; if(!p) return;
  function el(id){ return document.getElementById(id); }
  if(el('cs-cat'))   el('cs-cat').textContent   = p.num+' — '+p.cat;
  if(el('cs-title')) el('cs-title').textContent = p.title;
  if(el('cs-loc'))   el('cs-loc').textContent   = p.client+' — '+p.location;
  if(el('cs-problem')) el('cs-problem').textContent = p.desc;
  if(el('cs-solution')) el('cs-solution').textContent = 'I rebuilt the architecture from the ground up, replacing every failing component with a system designed to scale. The result was a platform that handles real load, real users, and real business requirements without breaking.';
  if(el('cs-results-top')) el('cs-results-top').innerHTML = [
    '<div style="text-align:center;padding:28px;background:rgba(255,255,255,.04);border-radius:16px;border:1px solid rgba(255,255,255,.08)"><div style="font-family:Syne,sans-serif;font-size:36px;font-weight:800;color:'+p.color2+'">'+p.s1+'</div><div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:6px">'+p.sl1+'</div></div>',
    '<div style="text-align:center;padding:28px;background:rgba(255,255,255,.04);border-radius:16px;border:1px solid rgba(255,255,255,.08)"><div style="font-family:Syne,sans-serif;font-size:36px;font-weight:800;color:'+p.color2+'">'+p.s2+'</div><div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:6px">'+p.sl2+'</div></div>',
    '<div style="text-align:center;padding:28px;background:rgba(255,255,255,.04);border-radius:16px;border:1px solid rgba(255,255,255,.08)"><div style="font-family:Syne,sans-serif;font-size:36px;font-weight:800;color:'+p.color2+'">'+p.s3+'</div><div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:6px">'+p.sl3+'</div></div>'
  ].join('');

  if(el('cs-mockup-big')){
    var csmb;
    if(slug==='talentflow'){ var tfsvgEl=document.querySelector('.wg .pc.wide .pscr svg');var tfsvgStr=tfsvgEl?tfsvgEl.outerHTML:'';csmb='<div style="aspect-ratio:16/7;background:#f1f5f9;overflow:hidden;position:relative;border-radius:12px 12px 0 0">'+tfsvgStr+'<div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,'+p.color2+',#7b2ff7)"></div></div>';}
    else if(slug==='databridge'){ var cbsvgEl=document.querySelector('.wg .pc.chatbridge .pscr svg');var cbsvgStr=cbsvgEl?cbsvgEl.outerHTML:'';csmb='<div style="aspect-ratio:16/7;background:#0a0f1e;overflow:hidden;position:relative;border-radius:12px 12px 0 0">'+cbsvgStr+'<div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,'+p.color2+',#01afe9)"></div></div>';}
    else if(slug==='finpulse'){ var fpsvgEl=document.querySelector('.wg .pc.finpulse .pscr svg');var fpsvgStr=fpsvgEl?fpsvgEl.outerHTML:'';csmb='<div style="aspect-ratio:16/7;background:#070d1a;overflow:hidden;position:relative;border-radius:12px 12px 0 0">'+fpsvgStr+'<div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,'+p.color2+',#01afe9)"></div></div>';}
    else if(slug==='nexashop'){ var nssvgEl=document.querySelector('.wg .pc.nexashop .pscr svg');var nssvgStr=nssvgEl?nssvgEl.outerHTML:'';csmb='<div style="aspect-ratio:16/7;background:#e8f0ff;overflow:hidden;position:relative;border-radius:12px 12px 0 0">'+nssvgStr+'<div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#1a2f6e,#f5c518)"></div></div>';}
    else if(slug==='clearpath'){ var cpsvgEl=document.querySelector('.wg .pc.clearpath .pscr svg');var cpsvgStr=cpsvgEl?cpsvgEl.outerHTML:'';csmb='<div style="aspect-ratio:16/7;background:#f0fdf8;overflow:hidden;position:relative;border-radius:12px 12px 0 0">'+cpsvgStr+'<div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#064e3b,#10b981)"></div></div>';}
    else if(slug==='medtrack'){ csmb='<div style="aspect-ratio:16/7;background:#1a0d2e;overflow:hidden;position:relative;border-radius:12px 12px 0 0"><img src="'+MT_IMG+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#a401e9,#01afe9)"></div></div>';}
    else if(slug==='adaptai'){ csmb='<div style="aspect-ratio:16/7;background:#ecfdf5;overflow:hidden;position:relative;border-radius:12px 12px 0 0"><img src="'+AD_IMG+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#10b981,#06b6d4)"></div></div>';}
    else if(slug==='pulsecrm'){ csmb='<div style="aspect-ratio:16/7;background:#faf5ff;overflow:hidden;position:relative;border-radius:12px 12px 0 0"><img src="'+PC_IMG+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#a855f7,#7c3aed)"></div></div>';}
    else if(slug==='shopflow'){ csmb='<div style="aspect-ratio:16/7;background:#e0f7fa;overflow:hidden;position:relative;border-radius:12px 12px 0 0"><img src="'+SF_IMG+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#06b6d4,#0891b2)"></div></div>';}
    else if(slug==='vaultpay'){ csmb='<div style="aspect-ratio:16/7;background:#fffbeb;overflow:hidden;position:relative;border-radius:12px 12px 0 0"><img src="'+VP_IMG+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#f59e0b,#f97316)"></div></div>';}
    else if(slug==='propvault'){ csmb='<div style="aspect-ratio:16/7;background:#f0fdf4;overflow:hidden;position:relative;border-radius:12px 12px 0 0"><img src="'+PV_IMG+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#22c55e,#06b6d4)"></div></div>';}
    else if(slug==='brandpulse'){ csmb='<div style="aspect-ratio:16/7;background:#1a0515;overflow:hidden;position:relative;border-radius:12px 12px 0 0"><img src="'+BP_IMG+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#ec4899,#8b5cf6)"></div></div>';}
    else if(slug==='logiroute'){ csmb='<div style="aspect-ratio:16/7;background:#0a1828;overflow:hidden;position:relative;border-radius:12px 12px 0 0"><img src="'+LR_IMG+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#3b82f6,#06b6d4)"></div></div>';}
    else if(slug==='edulaunch'){ csmb='<div style="aspect-ratio:16/7;background:#fefce8;overflow:hidden;position:relative;border-radius:12px 12px 0 0"><img src="'+EL_IMG+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#eab308,#f97316)"></div></div>';}
    else if(slug==='velo'){ csmb='<div style="aspect-ratio:16/7;background:#0A0F1E;overflow:hidden;position:relative;border-radius:12px 12px 0 0"><img src="'+VL_IMG+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#00E676,#00BCD4)"></div></div>';}
    else if(slug==='staynow'){ csmb='<div style="aspect-ratio:16/7;background:#e8ecf8;overflow:hidden;position:relative;border-radius:12px 12px 0 0"><img src="'+SN_IMG+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#0d9488,#06b6d4)"></div></div>';}
    else { csmb='<div style="aspect-ratio:16/7;background:'+p.color+';display:flex;align-items:center;justify-content:center;position:relative"><div style="text-align:center"><div style="font-family:Syne,sans-serif;font-size:28px;font-weight:800;color:rgba(255,255,255,.9)">'+p.title+'</div><div style="font-size:14px;color:rgba(255,255,255,.4);margin-top:8px">Project Preview</div></div><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,'+p.color2+',#7b2ff7)"></div></div>';}
    el('cs-mockup-big').innerHTML = csmb;
  }
  if(el('cs-tech')) el('cs-tech').innerHTML = p.tech.map(function(t){ return '<span class="tag" style="font-size:13px;padding:8px 16px">'+t+'</span>'; }).join('');
}

// ─────────────────────────────────────────────
// SUPABASE FORM HELPERS
// ─────────────────────────────────────────────

function _val(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; }
function _clear(ids){ ids.forEach(function(id){ var el = document.getElementById(id); if(el) el.value = ''; }); }

function _btnState(btn, loading, msg){
  if(!btn) return;
  btn.disabled = loading;
  if(msg) btn.textContent = msg;
}

function _showSuccess(btn, msg){
  if(!btn) return;
  btn.textContent = msg || 'Sent!';
  btn.style.background = '#22d675';
  btn.style.color = '#000';
  btn.style.border = 'none';
  setTimeout(function(){
    btn.textContent = btn.dataset.originalText || 'Send';
    btn.style.background = '';
    btn.style.color = '';
    btn.style.border = '';
    btn.disabled = false;
  }, 4000);
}

function _showError(btn, msg){
  if(!btn) return;
  btn.textContent = msg || 'Something went wrong. Try again.';
  btn.style.background = '#e94501';
  btn.style.color = '#fff';
  setTimeout(function(){
    btn.textContent = btn.dataset.originalText || 'Send';
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
  }, 4000);
}

async function _insertLead(data){
  if(!supa) throw new Error('Supabase not ready');
  var result = await supa.from('leads').insert([data]);
  if(result.error) throw result.error;
  return result;
}

async function _insertSubscriber(email){
  if(!supa) throw new Error('Supabase not ready');
  var result = await supa.from('subscribers').insert([{email: email}]);
  if(result.error) throw result.error;
  return result;
}

// ─── POPUP FORM ───
window.submitPopupForm = async function(btn){
  if(!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
  var fname = _val('popup-fname');
  var lname = _val('popup-lname');
  var email = _val('popup-email');
  var msg   = _val('popup-message');
  if(!email){ alert('Please enter your email address.'); return; }
  _btnState(btn, true, 'Sending...');
  try {
    await _insertLead({ first_name: fname, last_name: lname, email: email, message: msg, source: 'popup' });
    _clear(['popup-fname','popup-lname','popup-email','popup-message']);
    _showSuccess(btn, 'Message sent. Watch your inbox.');
    setTimeout(closePopup, 3000);
  } catch(e){
    console.error('[Automify] popup form error:', e);
    _showError(btn, 'Could not send. Try again.');
  }
};

// ─── PCARD (HERO PROPOSAL) FORM ───
window.submitPcardForm = async function(btn){
  if(!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
  var fname = _val('pcard-fname');
  var lname = _val('pcard-lname');
  var email = _val('pcard-email');
  var msg   = _val('pcard-message');
  if(!email){ alert('Please enter your email address.'); return; }
  _btnState(btn, true, 'Sending...');
  try {
    await _insertLead({ first_name: fname, last_name: lname, email: email, message: msg, source: 'proposal' });
    _clear(['pcard-fname','pcard-lname','pcard-email','pcard-message']);
    _showSuccess(btn, 'Message sent. Watch your inbox.');
  } catch(e){
    console.error('[Automify] pcard form error:', e);
    _showError(btn, 'Could not send. Try again.');
  }
};

// ─── CONTACT FORM ───
window.submitContactForm = async function(btn){
  if(!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
  var fname   = _val('contact-fname');
  var lname   = _val('contact-lname');
  var email   = _val('contact-email');
  var phone   = _val('contact-phone');
  var company = _val('contact-company');
  var service = _val('contact-service');
  var msg     = _val('contact-message');
  var budget  = _val('contact-budget');
  if(!email){ alert('Please enter your email address.'); return; }
  _btnState(btn, true, 'Sending...');
  try {
    await _insertLead({ first_name: fname, last_name: lname, email: email, phone: phone, company: company, service: service, message: msg, budget: budget, source: 'contact' });
    _clear(['contact-fname','contact-lname','contact-email','contact-phone','contact-company','contact-message']);
    _showSuccess(btn, 'Message sent. I will respond within 24 hours.');
  } catch(e){
    console.error('[Automify] contact form error:', e);
    _showError(btn, 'Could not send. Try again.');
  }
};

// ─── ECAP SUBSCRIBE FORM ───
window.submitSubscribeForm = async function(btn){
  if(!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
  var email = _val('ecap-email');
  if(!email){ alert('Please enter your email address.'); return; }
  _btnState(btn, true, 'Subscribing...');
  try {
    await _insertSubscriber(email);
    _clear(['ecap-email']);
    _showSuccess(btn, 'Subscribed!');
  } catch(e){
    console.error('[Automify] subscribe error:', e);
    _showError(btn, 'Could not subscribe. Try again.');
  }
};

// ─── OVERLAY SUBSCRIBE FORM ───
window.submitOverlaySubscribe = async function(btn){
  if(!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
  var email = _val('sub-overlay-email');
  if(!email){ alert('Please enter your email address.'); return; }
  _btnState(btn, true, 'Subscribing...');
  try {
    await _insertSubscriber(email);
    _clear(['sub-overlay-email']);
    _showSuccess(btn, 'Subscribed!');
    setTimeout(function(){
      var ov = document.getElementById('sub-overlay');
      if(ov){ ov.style.transform='translateX(-50%) translateY(120px)'; ov.style.opacity='0'; ov.style.pointerEvents='none'; }
      try{ localStorage.setItem('subDismissed','1'); }catch(e){}
    }, 2500);
  } catch(e){
    console.error('[Automify] overlay subscribe error:', e);
    _showError(btn, 'Could not subscribe.');
  }
};

/* ===== END ROUTER ===== */
