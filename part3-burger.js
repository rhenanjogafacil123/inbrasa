(()=>{
  const stage=document.querySelector('.burger-stage');
  const sticky=document.querySelector('.burger-sticky');
  const zone=document.querySelector('.burger-zone');
  const layers=[...document.querySelectorAll('.burger-layer')];
  if(!stage||!sticky||!layers.length)return;

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
  const smoother=t=>t*t*t*(t*(t*6-15)+10);

  const desktopCfg={
    endY:[188,132,82,35,-8,-76,-150],
    startX:[-14,18,-10,12,-8,4,0],
    startR:[-1.6,1.2,-.9,.6,-.45,.2,0],
    float:[7,11,8,7,6,3,2],
    drift:[3.2,5.4,4.1,3.8,3.1,1.7,.8]
  };
  const mobileCfg={
    endY:[145,105,64,25,-8,-58,-112],
    startX:[-8,10,-6,7,-5,2,0],
    startR:[-1,.8,-.6,.45,-.3,.12,0],
    float:[5,7,6,5,4,2,1.3],
    drift:[2.2,3.2,2.7,2.5,2,1.1,.5]
  };
  const phase=[0,.9,2.1,3.2,4.3,5.1,1.7];
  const speed=[.00072,.00088,.00076,.00082,.0007,.00058,.00048];

  let progress=0;
  let ticking=false;

  function measure(){
    const r=stage.getBoundingClientRect();
    const stickyH=sticky.offsetHeight||document.documentElement.clientHeight;
    const travel=Math.max(1,stage.offsetHeight-stickyH);
    const raw=clamp(-r.top/travel);
    progress=smoother(clamp((raw-.085)/.82));
    document.documentElement.style.setProperty('--burger-progress',progress.toFixed(4));
    stage.classList.toggle('is-assembled',progress>.965);
  }

  function render(now){
    const isMobile=innerWidth<=760;
    const cfg=isMobile?mobileCfg:desktopCfg;
    const settle=1-progress;
    const sizeScale=isMobile?Math.min(1,innerWidth/390):Math.min(1.06,Math.max(.92,innerWidth/1440));

    layers.forEach((layer,i)=>{
      const idleY=reduced?0:Math.sin(now*speed[i]+phase[i])*cfg.float[i]*settle;
      const idleX=reduced?0:Math.cos(now*(speed[i]*.78)+phase[i])*cfg.drift[i]*settle;
      const x=(cfg.startX[i]*settle+idleX)*sizeScale;
      const y=(cfg.endY[i]*progress+idleY)*sizeScale;
      const rot=cfg.startR[i]*settle;
      const scale=1+(i===5?.008:0)-progress*(i===5?.003:0);
      layer.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rot.toFixed(3)}deg) scale(${scale.toFixed(3)})`;
    });
    requestAnimationFrame(render);
  }

  function onScroll(){
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(()=>{measure();ticking=false});
  }

  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(measure,120),{passive:true});
  measure();
  requestAnimationFrame(render);

  if(zone&&!reduced&&!zone.querySelector('.scene-spark')){
    const count=innerWidth<=760?10:16;
    for(let i=0;i<count;i++){
      const spark=document.createElement('i');
      spark.className='scene-spark';
      spark.style.left=(16+Math.random()*72)+'%';
      spark.style.top=(23+Math.random()*66)+'%';
      spark.style.setProperty('--dur',(3.8+Math.random()*4.6)+'s');
      spark.style.setProperty('--delay',(-Math.random()*6)+'s');
      spark.style.setProperty('--dx',(-12+Math.random()*24)+'px');
      zone.appendChild(spark);
    }
  }
})();
