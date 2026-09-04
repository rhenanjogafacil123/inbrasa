(()=>{
  const root=document.documentElement;
  const hero=document.querySelector('.hero-stage');
  const slices=[...document.querySelectorAll('.burger-slice')];
  const header=document.querySelector('.topbar');
  const menuButton=document.querySelector('.menu-button');
  const mobileMenu=document.querySelector('.mobile-menu');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const ease=t=>1-Math.pow(1-t,3);

  const desktop={
    startY:[-95,-70,-42,-12,24,62,102],
    endY:[112,80,48,18,-16,-54,-94],
    startX:[16,-18,12,-10,10,-8,8],
    rot:[-2.2,2.4,-1.5,1.3,-1.8,1,-.8]
  };
  const mobile={
    startY:[-62,-45,-29,-8,16,40,68],
    endY:[72,50,30,10,-10,-34,-58],
    startX:[7,-8,6,-6,5,-4,4],
    rot:[-1.2,1.4,-.8,.8,-1,.6,-.5]
  };

  function updateHero(){
    if(!hero)return;
    const r=hero.getBoundingClientRect();
    const max=Math.max(1,hero.offsetHeight-innerHeight);
    const raw=clamp(-r.top/max,0,1);
    const p=ease(raw);
    root.style.setProperty('--progress',raw.toFixed(4));

    const cfg=innerWidth<=760?mobile:desktop;
    const scale=innerWidth<=760?1:Math.min(1.12,Math.max(.92,innerWidth/1400));

    slices.forEach((slice,i)=>{
      const y=(cfg.startY[i]+(cfg.endY[i]-cfg.startY[i])*p)*scale;
      const x=cfg.startX[i]*(1-p)*scale;
      const rot=cfg.rot[i]*(1-p);
      slice.style.transform=reduced?'none':`translate3d(${x}px,${y}px,0) rotate(${rot}deg)`;
      slice.style.opacity=(.72+raw*.28).toFixed(3);
    });

    header?.classList.toggle('scrolled',scrollY>28);
  }

  let ticking=false;
  function schedule(){
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(()=>{updateHero();ticking=false});
  }
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  updateHero();

  const emberRoot=document.querySelector('.embers');
  const count=innerWidth<=760?17:32;
  for(let i=0;i<count;i++){
    const e=document.createElement('i');
    e.className='ember';
    e.style.left=(42+Math.random()*62)+'%';
    e.style.bottom=(-8-Math.random()*18)+'%';
    e.style.width=e.style.height=(1.5+Math.random()*2.8)+'px';
    e.style.animationDuration=(4.8+Math.random()*6.2)+'s';
    e.style.animationDelay=(-Math.random()*10)+'s';
    e.style.setProperty('--drift',(-55+Math.random()*110)+'px');
    emberRoot?.appendChild(e);
  }

  menuButton?.addEventListener('click',()=>{
    const open=mobileMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded',String(open));
    mobileMenu.setAttribute('aria-hidden',String(!open));
    document.body.style.overflow=open?'hidden':'';
  });
  mobileMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mobileMenu.classList.remove('open');
    menuButton.setAttribute('aria-expanded','false');
    mobileMenu.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }));
})();