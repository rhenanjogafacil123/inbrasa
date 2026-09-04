(()=>{
  const links=[...document.querySelectorAll('.desktop-nav a,.mobile-menu a')];
  const sectionIds=['inicio','cardapio','sobre','combos','contato'];
  const sections=sectionIds.map(id=>document.getElementById(id)).filter(Boolean);

  function setActive(id){
    links.forEach(link=>{
      const active=link.getAttribute('href')===`#${id}`;
      link.classList.toggle('active',active);
      if(active) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
  }

  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      const visible=entries
        .filter(e=>e.isIntersecting)
        .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(visible?.target?.id) setActive(visible.target.id);
    },{rootMargin:'-24% 0px -58% 0px',threshold:[0,.08,.2,.4]});
    sections.forEach(section=>observer.observe(section));
  }

  links.forEach(link=>link.addEventListener('click',()=>{
    const id=link.getAttribute('href')?.replace('#','');
    if(id) setActive(id);
  }));
})();
