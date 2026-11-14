(function(){
  try{if(localStorage.getItem('subDismissed'))return;}catch(e){}
  var shown=false;
  window.addEventListener('scroll',function(){
    if(shown)return;
    var pg=document.querySelector('.page.active');
    if(pg&&pg.id==='page-home'&&window.scrollY>window.innerHeight*0.4){
      var el=document.getElementById('sub-overlay');
      if(el){el.style.transform='translateY(0)';el.style.opacity='1';el.style.pointerEvents='auto';}
      shown=true;
    }
  },{passive:true});
})();

// Before & After slider
(function(){
  var cur=0;
  var slides=document.querySelectorAll('.ba-slide');
  var dots=document.querySelectorAll('.badd');
  function goTo(n){
    slides[cur].style.display='none';
    dots[cur].classList.remove('on');
    cur=(n+slides.length)%slides.length;
    slides[cur].style.display='block';
    dots[cur].classList.add('on');
  }
  window.baNav=function(dir){goTo(cur+dir);};
  window.baGo=function(n){goTo(n);};
})();

// Before & After page slider
var baPgIdx=0;
function baNavPg(d){baGoPg((baPgIdx+d+3)%3);}
function baGoPg(i){
  var slides=document.querySelectorAll('#page-ba .ba-slide-pg');
  var dots=document.querySelectorAll('#page-ba .badd');
  slides.forEach(function(s,idx){s.style.display=idx===i?'block':'none';});
  dots.forEach(function(d,idx){d.classList.toggle('on',idx===i);});
  baPgIdx=i;
}

/* ===== FILM PLAYER ===== */
var FP={
  scenes:[
    {dur:5,html:function(){return'<div class="fp-logo"><div class="fp-logotag">A film about how I work</div><div class="fp-logoname">Auto<span>mify</span></div><div class="fp-logotag" style="letter-spacing:3px;font-size:11px;margin-top:2px">The Automify Way &middot; How I Build</div></div>';}},
    {dur:7,html:function(){return'<div class="fp-eye">The reality</div><div class="fp-h">Most developers <span class="cy">take the brief</span> and disappear.</div><div class="fp-p">They ship what you asked for, not what you needed. By the time you realise the difference, they are already gone and you are left holding a product that almost works.</div>';}},
    {dur:7,html:function(){return'<div class="fp-eye">How I start</div><div class="fp-h">I spend the first<br><span class="pu">48 hours listening.</span></div><div class="fp-code"><span class="cm">// Day 1. No code yet.</span><br><span class="kw">const</span> <span class="fn">understand</span> = <span class="kw">async</span> (project) => {<br>&nbsp;&nbsp;<span class="kw">await</span> listen(project.realProblem)<br>&nbsp;&nbsp;<span class="kw">await</span> findWhat(project.clientMissed)<br>&nbsp;&nbsp;<span class="kw">return</span> <span class="st">"the full picture"</span><br>}</div>';}},
    {dur:7,html:function(){return'<div class="fp-eye">The architecture</div><div class="fp-h">I do not build <span class="cy">features.</span><br>I build <span class="cy">systems.</span></div><div class="fp-p">Every component has a reason. Every decision has a consequence I have already thought through. If a thing breaks six months from now, I want it to be obvious why and obvious how to fix it.</div>';}},
    {dur:9,html:function(){var ph=[['01','Discovery and scoping','I map every moving part before writing a single line.'],['02','Architecture blueprint','Systems that survive scale, not just the first week.'],['03','Build in tight layers','Each layer tested before the next one starts.'],['04','Quality without excuses','I test like I am the most impatient user alive.'],['05','Ship and stay present','Launch is where I pay closest attention.']];return'<div class="fp-eye">The process</div><div class="fp-h" style="font-size:clamp(24px,4vw,52px)">Seven steps. <span class="pu">Zero shortcuts.</span></div><div class="fp-phases">'+ph.map(function(p){return'<div class="fp-ph"><div class="fp-pn">'+p[0]+'</div><div class="fp-pt"><strong>'+p[1]+'</strong>'+p[2]+'</div></div>';}).join('')+'</div>';}},
    {dur:7,html:function(){return'<div class="fp-eye">The code</div><div class="fp-h">Clean enough that<br><span class="cy">future you</span> says thank you.</div><div class="fp-code"><span class="cm">// Not just for today. For the next two years.</span><br><span class="kw">function</span> <span class="fn">buildRight</span>(project) {<br>&nbsp;&nbsp;<span class="cm">// readable &gt; clever</span><br>&nbsp;&nbsp;<span class="cm">// documented &gt; assumed</span><br>&nbsp;&nbsp;<span class="cm">// tested &gt; hoped</span><br>&nbsp;&nbsp;<span class="kw">return</span> project.<span class="fn">scaleTo</span>(<span class="st">"10x users"</span>)<br>}';}},
    {dur:7,html:function(){return'<div class="fp-eye">The results</div><div class="fp-h">Numbers that<br><span class="pu">changed businesses.</span></div><div class="fp-stats"><div><div class="fp-sn" id="fpn1">0%</div><div class="fp-sl">User Retention Boost</div></div><div><div class="fp-sn" id="fpn2">0</div><div class="fp-sl">PageSpeed Score</div></div><div><div class="fp-sn" id="fpn3">0x</div><div class="fp-sl">Revenue Multiplier</div></div></div>';}},
    {dur:7,html:function(){return'<div class="fp-eye">The commitment</div><div class="fp-h">I ship.<br>Then I <span class="cy">stay.</span></div><div class="fp-p">Not a handoff. Not a hand-wave. I stay close after every delivery because the first 30 days after going live are where the real problems show up. I am there for them.</div>';}},
    {dur:8,html:function(){return'<div class="fp-eye">The Automify Way</div><div class="fp-h" style="font-size:clamp(24px,4vw,56px)">One developer.<br><span class="pu">Full ownership.</span><br>Zero excuses.</div><div class="fp-p">Not a team. Not an agency. One person who cares about your product the way you do, with the skills to prove it.</div>';}},
    {dur:9,html:function(){return'<div class="fp-logo"><div class="fp-logotag">Ready to build something real?</div><div class="fp-logoname" style="font-size:clamp(32px,5vw,64px);margin:8px 0">Your project.<br><span>My obsession.</span></div><button class="fp-cta-btn" onclick="openPopup()">Start Building With Me &#8594;</button><div class="fp-cta-sub">work.automifyco.com</div></div>';}}
  ],
  cur:0,playing:false,elapsed:0,raf:null,lastT:null,bgRaf:null,bgPts:[],
  get totalDur(){return this.scenes.reduce(function(a,s){return a+s.dur;},0);},
  init:function(){
    if(this._inited)return;this._inited=true;
    var self=this;
    // canvas bg
    var c=document.getElementById('film-bg');
    if(!c)return;
    var ctx=c.getContext('2d'),W,H,pts=this.bgPts;
    function resize(){W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;pts.length=0;for(var i=0;i<50;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.5+.5});}
    resize();
    function drawBg(){
      if(!document.getElementById('page-film').classList.contains('active')){self.bgRaf=null;return;}
      ctx.clearRect(0,0,W,H);
      ctx.strokeStyle='rgba(1,175,233,0.04)';ctx.lineWidth=1;
      for(var x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(var y=0;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      pts.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(1,175,233,.22)';ctx.fill();});
      for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<110){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle='rgba(1,175,233,'+(0.07*(1-d/110))+')';ctx.lineWidth=.5;ctx.stroke();}}
      self.bgRaf=requestAnimationFrame(drawBg);
    }
    if(!this.bgRaf)drawBg();
    // dots
    var $dots=document.getElementById('film-dots');
    $dots.innerHTML='';
    this.scenes.forEach(function(_,i){var d=document.createElement('button');d.className='fp-dot'+(i===0?' on':'');d.onclick=function(){self.goScene(i);};$dots.appendChild(d);});
    // play btn
    document.getElementById('film-play').onclick=function(){if(self.playing)self.pause();else{if(self.elapsed>=self.totalDur){self.elapsed=0;self.cur=0;self.renderScene(0);}self.play();}};
    this.renderScene(0);
    setTimeout(function(){self.play();},400);
  },
  startBg:function(){
    if(this.bgRaf)return;
    var self=this,c=document.getElementById('film-bg');
    if(!c)return;
    var ctx=c.getContext('2d'),W=c.width=c.offsetWidth,H=c.height=c.offsetHeight,pts=this.bgPts;
    function drawBg(){
      if(!document.getElementById('page-film').classList.contains('active')){self.bgRaf=null;return;}
      ctx.clearRect(0,0,W,H);
      ctx.strokeStyle='rgba(1,175,233,0.04)';ctx.lineWidth=1;
      for(var x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(var y=0;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      pts.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(1,175,233,.22)';ctx.fill();});
      for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<110){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle='rgba(1,175,233,'+(0.07*(1-d/110))+')';ctx.lineWidth=.5;ctx.stroke();}}
      self.bgRaf=requestAnimationFrame(drawBg);
    }
    drawBg();
  },
  countUp:function(id,target,suffix){
    var el=document.getElementById(id);if(!el)return;
    var val=0,step=Math.ceil(target/50);
    function t(){val=Math.min(val+step,target);el.textContent=val+suffix;if(val<target)setTimeout(t,16);}
    setTimeout(t,900);
  },
  renderScene:function(idx){
    var self=this,$s=document.getElementById('film-scene');
    $s.classList.add('fp-out');
    setTimeout(function(){
      $s.innerHTML=self.scenes[idx].html();
      $s.classList.remove('fp-out');
      requestAnimationFrame(function(){requestAnimationFrame(function(){
        $s.classList.add('fp-active');
        $s.querySelectorAll('.fp-ph').forEach(function(r,i){setTimeout(function(){r.style.opacity='1';r.style.transform='none';},550+i*110);});
        if(idx===6){self.countUp('fpn1',340,'%');self.countUp('fpn2',97,'');self.countUp('fpn3',3.1,'x');}
      });});
      self.updateDots();
    },320);
  },
  updateDots:function(){document.querySelectorAll('.fp-dot').forEach(function(d,i){d.classList.toggle('on',i===FP.cur);});},
  goScene:function(idx){var t=0;for(var i=0;i<idx;i++)t+=this.scenes[i].dur;this.elapsed=t;this.cur=idx;this.renderScene(idx);},
  tick:function(ts){
    if(!this.playing)return;
    if(this.lastT!==null){this.elapsed=Math.min(this.elapsed+(ts-this.lastT)/1000,this.totalDur);}
    this.lastT=ts;
    var bar=document.getElementById('film-prog-bar');if(bar)bar.style.width=(this.elapsed/this.totalDur*100)+'%';
    var tmr=document.getElementById('film-timer');if(tmr){var s=Math.floor(this.elapsed),m=Math.floor(s/60),ss=s%60;tmr.textContent=m+':'+(ss<10?'0':'')+ss;}
    var acc=0;for(var i=0;i<this.scenes.length;i++){acc+=this.scenes[i].dur;if(this.elapsed<acc){if(i!==this.cur){this.cur=i;this.renderScene(i);}break;}}
    if(this.elapsed>=this.totalDur){this.playing=false;this.setIcon(true);return;}
    var self=this;this.raf=requestAnimationFrame(function(t){self.tick(t);});
  },
  setIcon:function(isPlay){var ico=document.getElementById('film-play-ico');if(!ico)return;ico.innerHTML=isPlay?'<polygon points="0,0 10,6 0,12"/>':'<rect x="0" y="0" width="3.5" height="12"/><rect x="6.5" y="0" width="3.5" height="12"/>';},
  play:function(){this.playing=true;this.lastT=null;this.setIcon(false);var self=this;this.raf=requestAnimationFrame(function(t){self.tick(t);});this.startBg();AudioEngine.fadeIn();},
  pause:function(){this.playing=false;if(this.raf)cancelAnimationFrame(this.raf);this.setIcon(true);AudioEngine.fadeOut();}
};

/* ---- AUDIO ENGINE — clean ambient chord pad ---- */
var AudioEngine={
  _ctx:null,_master:null,_muted:false,_vol:0,_ready:false,
  _init:function(){
    if(this._ready)return;
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return;
    try{
      this._ctx=new AC();
      var c=this._ctx;

      /* master */
      this._master=c.createGain();
      this._master.gain.value=0;
      this._master.connect(c.destination);

      /* warm lowpass — keeps everything soft and non-harsh */
      var filt=c.createBiquadFilter();
      filt.type='lowpass';filt.frequency.value=1200;filt.Q.value=0.4;
      filt.connect(this._master);

      /* echo / space — simple feedback delay, no noise buffer */
      var dly=c.createDelay(2);dly.delayTime.value=0.72;
      var dlFb=c.createGain();dlFb.gain.value=0.28;
      var dlWet=c.createGain();dlWet.gain.value=0.22;
      dly.connect(dlFb);dlFb.connect(dly);
      dly.connect(dlWet);dlWet.connect(this._master);

      /* chord pad: A minor 7 — A C E G across two octaves
         All pure sines, pairs very slightly detuned for warmth */
      var pad=[
        [110,0.18],[110.3,0.18],   /* A2 pair */
        [130.8,0.13],[131.2,0.13], /* C3 pair */
        [164.8,0.10],[165.2,0.10], /* E3 pair */
        [196,0.07],[196.5,0.07],   /* G3 pair */
        [220,0.05],[220.4,0.05]    /* A3 pair */
      ];
      pad.forEach(function(n){
        var o=c.createOscillator();o.type='sine';o.frequency.value=n[0];
        var g=c.createGain();g.gain.value=n[1];
        o.connect(g);g.connect(filt);g.connect(dly);
        o.start();
      });

      /* very slow filter sweep — the music breathes */
      var lfo=c.createOscillator();lfo.type='sine';lfo.frequency.value=0.04;
      var lfoG=c.createGain();lfoG.gain.value=300;
      lfo.connect(lfoG);lfoG.connect(filt.frequency);lfo.start();

      /* occasional soft bell note — single sine, fades in and out cleanly */
      var bells=[261.6,329.6,392,440,523.25]; /* C4 E4 G4 A4 C5 */
      var self=this;
      (function bell(){
        try{
          if(!self._ctx)return;
          var note=bells[Math.floor(Math.random()*bells.length)];
          var bo=c.createOscillator();bo.type='sine';bo.frequency.value=note;
          var bg=c.createGain();bg.gain.value=0;
          bo.connect(bg);bg.connect(dlWet);bg.connect(this._master||self._master);
          var t=c.currentTime;
          bo.start(t);
          bg.gain.setValueAtTime(0,t);
          bg.gain.linearRampToValueAtTime(0.055,t+0.8);  /* soft attack */
          bg.gain.linearRampToValueAtTime(0.04,t+1.5);
          bg.gain.linearRampToValueAtTime(0,t+5);         /* long fade */
          bo.stop(t+5.1);
        }catch(e){}
        setTimeout(bell,5000+Math.random()*7000);
      }).call(self);

      this._ready=true;
    }catch(e){}
  },
  fadeIn:function(){
    this._init();
    if(!this._ready)return;
    if(this._ctx.state==='suspended')this._ctx.resume();
    if(this._muted)return;
    var g=this._master.gain,t=this._ctx.currentTime;
    g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);
    g.linearRampToValueAtTime(0.55,t+3);
    this._vol=0.55;
  },
  fadeOut:function(){
    if(!this._ready)return;
    var g=this._master.gain,t=this._ctx.currentTime;
    g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);
    g.linearRampToValueAtTime(0,t+2);
    this._vol=0;
  },
  toggleMute:function(btnId){
    if(!this._ready)this._init();
    this._muted=!this._muted;
    var btn=document.getElementById(btnId);
    if(btn)btn.classList.toggle('muted',this._muted);
    if(this._muted){
      var g=this._master.gain,t=this._ctx.currentTime;
      g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);
      g.linearRampToValueAtTime(0,t+0.5);
    }else{
      if(this._ctx&&this._ctx.state==='suspended')this._ctx.resume();
      var g2=this._master.gain,t2=this._ctx.currentTime;
      g2.cancelScheduledValues(t2);g2.setValueAtTime(g2.value,t2);
      g2.linearRampToValueAtTime(this._vol||0.55,t2+0.5);
    }
    var other=btnId==='film-mute'?'hp-mute':'film-mute';
    var ob=document.getElementById(other);
    if(ob)ob.classList.toggle('muted',this._muted);
  }
};

/* ---- HOMEPAGE INLINE FILM PLAYER ---- */
var HPF={
  scenes:[
    {dur:5,html:function(){return'<div class="hplt">A film about how I work</div><div class="hpln">Auto<span>mify</span></div><div class="hplt" style="margin-top:5px">The Automify Way &middot; How I Build</div>';}},
    {dur:8,html:function(){return'<div class="hpe">The Automify Way</div><div class="hph">One developer.<br><span class="pu2">Full ownership.</span><br>Zero excuses.</div><div class="hpp">Not a team. Not an agency. One person who cares about your product the way you do, with the skills to prove it.</div>';}},
    {dur:7,html:function(){return'<div class="hpe">The Problem</div><div class="hph">You have been burned by developers who ghost, deliver broken code, and disappear the moment they are paid.</div>';}},
    {dur:7,html:function(){return'<div class="hpe">What I Do Differently</div><div class="hph">I do not start coding on day one.</div><div class="hpp">Day one is for understanding your business, your users, your bottlenecks. The code comes after I know exactly what it needs to do.</div>';}},
    {dur:8,html:function(){return'<div class="hpe">The Build Process</div><div class="hpcd">01 &rarr; Audit + Architecture<br>02 &rarr; Sprint Planning<br>03 &rarr; Build in public<br>04 &rarr; QA + Edge Cases<br>05 &rarr; Launch + Handoff<br>06 &rarr; 90 Day Support</div>';}},
    {dur:7,html:function(){return'<div class="hpe">The Results</div><div class="hpsr"><div class="hpst"><div class="hpsn" id="hpn1">0%</div><div class="hpsl">Retention Boost</div></div><div class="hpst"><div class="hpsn" id="hpn2">0+</div><div class="hpsl">Projects Shipped</div></div><div class="hpst"><div class="hpsn" id="hpn3">0x</div><div class="hpsl">Revenue Avg</div></div></div>';}},
    {dur:6,html:function(){return'<div class="hpe">What I Build</div><div class="hph">SaaS Platforms &middot; AI Tools<br>E-commerce &middot; Automation<br>Dashboards &middot; APIs</div>';}},
    {dur:6,html:function(){return'<div class="hpe">My Promise</div><div class="hph">Your deadline is not a suggestion.<br>Your budget is not an estimate.<br>Your launch is not a maybe.</div>';}},
    {dur:7,html:function(){return'<div class="hpe">The Standard</div><div class="hph">I charge for results, not hours. If it does not work, I fix it. That is not a policy. That is just how I operate.</div>';}},
    {dur:6,html:function(){return'<div class="hplt">Ready to build something that lasts?</div><div class="hpln">Let\'s Talk</div><div class="hplt" style="margin-top:7px">work.automifyco.com</div>';}}
  ],
  playing:false,cur:0,elapsed:0,_raf:null,_last:null,
  get totalDur(){return this.scenes.reduce(function(a,s){return a+s.dur;},0);},
  start:function(){
    document.getElementById('hp-thumb').classList.add('hp-off');
    document.getElementById('hp-player').classList.add('hp-on');
    this.elapsed=0;this.cur=0;
    this.renderScene(0);
    this.play();
  },
  close:function(e){if(e)e.stopPropagation();
    this.pause();
    document.getElementById('hp-player').classList.remove('hp-on');
    document.getElementById('hp-thumb').classList.remove('hp-off');
    this.elapsed=0;this.cur=0;this.updateUI();
  },
  toggle:function(e){if(e)e.stopPropagation();
    if(this.playing)this.pause();else this.play();
  },
  play:function(){
    if(this.playing)return;
    this.playing=true;this.setIcon(false);
    this._last=performance.now();
    var self=this;
    this._raf=requestAnimationFrame(function(ts){self.tick(ts);});
    AudioEngine.fadeIn();
  },
  pause:function(){
    this.playing=false;this.setIcon(true);
    if(this._raf){cancelAnimationFrame(this._raf);this._raf=null;}
    AudioEngine.fadeOut();
  },
  tick:function(ts){
    if(!this.playing)return;
    var dt=(ts-this._last)/1000;this._last=ts;
    this.elapsed+=dt;
    if(this.elapsed>=this.totalDur){this.elapsed=this.totalDur;this.pause();this.updateUI();return;}
    var acc=0,idx=0;
    for(var i=0;i<this.scenes.length;i++){acc+=this.scenes[i].dur;if(this.elapsed<acc){idx=i;break;}}
    if(idx!==this.cur){this.cur=idx;this.renderScene(idx);}
    this.updateUI();
    var self=this;this._raf=requestAnimationFrame(function(ts){self.tick(ts);});
  },
  renderScene:function(idx){
    var sc=document.getElementById('hp-scene');if(!sc)return;
    sc.style.opacity='0';
    var html=this.scenes[idx].html;if(typeof html==='function')html=html();
    var self=this;
    setTimeout(function(){sc.innerHTML=html;sc.style.transition='opacity .5s';sc.style.opacity='1';
      if(idx===5){setTimeout(function(){self.cu('hpn1',340,'%');self.cu('hpn2',700,'+');self.cu('hpn3',3.1,'x');},200);}
    },280);
  },
  cu:function(id,target,sfx){
    var el=document.getElementById(id);if(!el)return;
    var v=0,dur=1200,step=16,fl=(target%1!==0);
    var t=setInterval(function(){v+=target*step/dur;if(v>=target){v=target;clearInterval(t);}
      el.textContent=(fl?v.toFixed(1):Math.floor(v))+sfx;
    },step);
  },
  updateUI:function(){
    var bar=document.getElementById('hp-pf'),tm=document.getElementById('hp-tm');
    if(bar)bar.style.width=(this.elapsed/this.totalDur*100)+'%';
    if(tm){var s=Math.floor(this.elapsed);tm.textContent=Math.floor(s/60)+':'+(s%60<10?'0':'')+(s%60);}
  },
  seek:function(e){
    var pw=document.getElementById('hp-pw');if(!pw)return;
    var r=pw.getBoundingClientRect();
    this.elapsed=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*this.totalDur;
    var acc=0,idx=0;
    for(var i=0;i<this.scenes.length;i++){acc+=this.scenes[i].dur;if(this.elapsed<acc){idx=i;break;}}
    this.cur=idx;this.renderScene(idx);this.updateUI();
  },
  setIcon:function(isPlay){
    var ico=document.getElementById('hp-pi');if(!ico)return;
    ico.innerHTML=isPlay?'<polygon points="0,0 10,6 0,12"/>':'<rect x="0" y="0" width="3.5" height="12"/><rect x="6.5" y="0" width="3.5" height="12"/>';
  }
};
