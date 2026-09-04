(()=>{
  const root=document.documentElement;
  const stage=document.querySelector('.burger-stage');
  const slices=[...document.querySelectorAll('.burger-slice')];
  const header=document.querySelector('.topbar');
  const menuButton=document.querySelector('.menu-button');
  const mobileMenu=document.querySelector('.mobile-menu');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const smooth=t=>t*t*(3-2*t);

  const desktop={
    endY:[118,84,54,22,-12,-52,-96],
    endX:[0,2,-3,2,-2,1,0],
    rot:[-1.2,.9,-.6,.5,-.5,.3,-.25]
  };
  const mobile={
    endY:[86,61,39,16,-9,-38,-72],
    endX:[0,1,-2,1,-1,1,0],
    rot:[-.7,.55,-.4,.35,-.35,.2,-.15]
  };

  function updateAssembly(){
    if(!stage)return;
    const r=stage.getBoundingClientRect();
    const travel=Math.max(1,stage.offsetHeight-innerHeight);

    /* Enquanto a segunda seção ainda está entrando na tela, progress fica em 0.
       A montagem só começa quando o topo da seção já encostou no topo da viewport. */
    const raw=clamp(-r.top/travel,0,1);
    const p=smooth(raw);
    root.style.setProperty('--progress',raw.toFixed(4));

    const cfg=innerWidth<=760?mobile:desktop;
    const viewportScale=innerWidth<=760?1:Math.min(1.08,Math.max(.94,innerWidth/1440));

    slices.forEach((slice,i)=>{
      const y=cfg.endY[i]*p*viewportScale;
      const x=cfg.endX[i]*p*viewportScale;
      const rot=cfg.rot[i]*p;
      slice.style.transform=reduced?'none':`translate3d(${x}px,${y}px,0) rotate(${rot}deg)`;
      slice.style.opacity='1';
    });

    header?.classList.toggle('scrolled',scrollY>28);
  }

  let ticking=false;
  function schedule(){
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(()=>{updateAssembly();ticking=false});
  }
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  updateAssembly();

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