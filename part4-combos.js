(()=>{
  const root=document.querySelector('.combo-showcase');
  if(!root)return;
  const items=[...root.querySelectorAll('[data-combo-reveal]')];
  if(!('IntersectionObserver' in window)){
    items.forEach(el=>el.classList.add('visible'));
    return;
  }
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  items.forEach(el=>io.observe(el));
})();
