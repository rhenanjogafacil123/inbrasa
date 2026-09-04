(async()=>{
  const parts = Array.from({length:8},(_,i)=>`./assets/inbrasa-sprite-${i}.txt`);
  try{
    const data=(await Promise.all(parts.map(p=>fetch(p).then(r=>{if(!r.ok)throw new Error(r.status);return r.text()})))).join('');
    document.documentElement.style.setProperty('--sprite',`url("data:image/jpeg;base64,${data}")`);
  }catch(e){console.warn('In-Brasa sprite não carregou',e)}
})();

(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.hero-stage');
  const layers = [...document.querySelectorAll('.burger-layer')];
  const header = document.querySelector('.topbar');
  const menuBtn = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const desktop = {
    targetY: [-170,-113,-69,-28, 7, 63, 145],
    explodeY:[-305,-205,-128,-58, 18, 118, 255],
    x:[16,-25,23,-28,20,-10,12],
    r:[-2.5,3.3,-2.2,2.1,-4,1.4,-1.3],
    s:[1,1.02,.98,.98,.91,1.03,1]
  };
  const mobile = {
    targetY: [-114,-76,-45,-17, 8, 48, 100],
    explodeY:[-175,-118,-72,-31, 5, 72, 155],
    x:[7,-10,10,-12,8,-5,6],
    r:[-1.1,1.5,-1,1,-1.8,.8,-.7],
    s:[.98,1,.98,.96,.84,1,.98]
  };

  function clamp(n,a,b){ return Math.min(b,Math.max(a,n)); }
  function easeOutCubic(t){ return 1 - Math.pow(1-t,3); }
  function updateHero(){
    if(!hero) return;
    const rect = hero.getBoundingClientRect();
    const max = Math.max(1, hero.offsetHeight - innerHeight);
    const raw = clamp(-rect.top / max, 0, 1);
    const p = easeOutCubic(clamp(raw * 1.08,0,1));
    root.style.setProperty('--progress', raw.toFixed(4));

    const isMobile = innerWidth <= 760;
    const cfg = isMobile ? mobile : desktop;
    const base = isMobile ? Math.min(.86, innerWidth/440) : Math.min(1.22, Math.max(.98, innerWidth/1200));
    const spriteScale = 2.222;
    layers.forEach((el,i) => {
      const y = (cfg.explodeY[i] + (cfg.targetY[i]-cfg.explodeY[i])*p) * base;
      const x = cfg.x[i] * (1-p) * base;
      const r = cfg.r[i] * (1-p);
      const s = (cfg.s[i] + (1-cfg.s[i])*p) * base * spriteScale;
      const entry = clamp(raw*3.2 - i*.035,0,1);
      el.style.opacity = reduce ? 1 : (0.28 + entry*.72).toFixed(3);
      el.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotate(${r}deg) scale(${s})`;
    });
    header.classList.toggle('scrolled', scrollY > 30);
  }

  let ticking=false;
  function requestUpdate(){
    if(!ticking){
      requestAnimationFrame(()=>{ updateHero(); ticking=false; });
      ticking=true;
    }
  }
  addEventListener('scroll',requestUpdate,{passive:true});
  addEventListener('resize',requestUpdate,{passive:true});
  updateHero();

  const emberRoot = document.querySelector('.embers');
  const emberCount = innerWidth <= 760 ? 18 : 34;
  for(let i=0;i<emberCount;i++){
    const e=document.createElement('i');
    e.className='ember';
    e.style.left=(45+Math.random()*58)+'%';
    e.style.bottom=(-5-Math.random()*25)+'%';
    e.style.animationDuration=(4.5+Math.random()*7)+'s';
    e.style.animationDelay=(-Math.random()*10)+'s';
    e.style.setProperty('--drift',(-55+Math.random()*110)+'px');
    const size=1.5+Math.random()*2.5;
    e.style.width=size+'px'; e.style.height=size+'px';
    emberRoot.appendChild(e);
  }

  menuBtn?.addEventListener('click',()=>{
    const open=mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',String(open));
    mobileMenu.setAttribute('aria-hidden',String(!open));
    document.body.style.overflow=open?'hidden':'';
  });
  mobileMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
    mobileMenu.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }));
})();
