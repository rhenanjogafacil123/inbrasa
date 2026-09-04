(()=>{
  const root=document.documentElement;
  const stage=document.querySelector('.burger-stage');
  const sticky=document.querySelector('.burger-sticky');
  const canvas=document.querySelector('.burger-canvas');
  const slices=[...document.querySelectorAll('.burger-slice')];
  const header=document.querySelector('.topbar');
  const menuButton=document.querySelector('.menu-button');
  const mobileMenu=document.querySelector('.mobile-menu');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const smooth=t=>t*t*(3-2*t);
  const snap=n=>Math.round(n*4)/4;

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

  /* Safari/iPhone: evita clarões e tremidas quando as fatias se cruzam. */
  slices.forEach((slice,i)=>{
    slice.style.mixBlendMode='lighten';
    slice.style.zIndex=String(20-i);
    slice.style.backfaceVisibility='hidden';
    slice.style.webkitBackfaceVisibility='hidden';
    slice.style.perspective='1000px';
  });
  if(canvas){
    canvas.style.backfaceVisibility='hidden';
    canvas.style.webkitBackfaceVisibility='hidden';
    canvas.style.transformStyle='flat';
  }

  function updateAssembly(){
    if(!stage)return;
    const r=stage.getBoundingClientRect();

    /* Usa a altura REAL da área sticky, e não innerHeight.
       Isso impede o salto que o Safari causa ao esconder/mostrar a barra inferior. */
    const stickyHeight=sticky?.offsetHeight || document.documentElement.clientHeight;
    const travel=Math.max(1,stage.offsetHeight-stickyHeight);
    const raw=clamp(-r.top/travel,0,1);

    /* Pequena área morta no começo e no fim: o hambúrguer entra inteiro,
       monta com calma e termina estável antes de liberar a próxima seção. */
    const motion=clamp((raw-.055)/.89,0,1);
    const p=smooth(motion);
    root.style.setProperty('--progress',raw.toFixed(4));

    const cfg=innerWidth<=760?mobile:desktop;
    const viewportScale=innerWidth<=760?1:Math.min(1.08,Math.max(.94,innerWidth/1440));

    slices.forEach((slice,i)=>{
      const y=snap(cfg.endY[i]*p*viewportScale);
      const x=snap(cfg.endX[i]*p*viewportScale);
      const rot=snap(cfg.rot[i]*p);
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
  addEventListener('orientationchange',()=>setTimeout(updateAssembly,120),{passive:true});
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