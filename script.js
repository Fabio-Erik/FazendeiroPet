/* ========== UTIL: smooth scroll on menu click ========== */
function scrollToId(id){
  if(id === 'contact'){
    // small contact action: scroll to footer
    document.querySelector('footer').scrollIntoView({behavior:'smooth'});
    return;
  }
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

document.querySelectorAll('[data-target]').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const t = btn.dataset.target;
    // close mobile menu if open
    const mobile = document.getElementById('mobileMenu');
    if(mobile.style.display === 'block' || mobile.classList.contains('open')){
      mobile.classList.remove('open'); mobile.style.display='none';
    }
    scrollToId(t);
  });
});

/* mobile hamburger toggle */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', ()=>{
  if(mobileMenu.classList.contains('open')){
    mobileMenu.classList.remove('open'); mobileMenu.style.display='none'; mobileMenu.setAttribute('aria-hidden','true');
  } else {
    mobileMenu.classList.add('open'); mobileMenu.style.display='block'; mobileMenu.setAttribute('aria-hidden','false');
  }
});
/* click outside to close mobile */
mobileMenu.addEventListener('click', (e)=>{
  if(e.target === mobileMenu){
    mobileMenu.classList.remove('open'); mobileMenu.style.display='none'; mobileMenu.setAttribute('aria-hidden','true');
  }
});

/* ========== COUNTERS ========== */
function animateCounter(el, target, duration=1600){
  const start = 0;
  const diff = target - start;
  const stepTime = Math.max(Math.floor(duration / target), 6);
  let current = start;
  const timer = setInterval(()=>{
    current += Math.ceil(diff / (duration / 20));
    if(current >= target){
      current = target; clearInterval(timer);
    }
    el.textContent = current.toLocaleString();
  }, stepTime);
}
const procsEl = document.getElementById('count-procs');
const surgEl = document.getElementById('count-surgeries');
/* animate when section enters viewport */
let countersStarted = false;
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && !countersStarted){
      countersStarted = true;
      animateCounter(procsEl, 1000, 1800); // 0 -> 1.000
      animateCounter(surgEl, 500, 1600);   // 0 -> 500
      // add plus sign after animation completes (small timeout)
      setTimeout(()=>{ procsEl.textContent = '+' + procsEl.textContent; surgEl.textContent = '+' + surgEl.textContent  }, 1900);
    }
  });
},{threshold:0.35});
obs.observe(document.getElementById('inicio'));

/* ========== MAIN CAROUSEL (inicio) ========== */
function makeCarousel(carouselId, interval=3000, hasDots=true){
  const root = document.getElementById(carouselId);
  const imgs = Array.from(root.querySelectorAll('img'));
  let idx = 0;
  // dots
  let dotsContainer = null;
  if(hasDots){
    dotsContainer = root.querySelector('.dots') || document.createElement('div');
    if(!root.querySelector('.dots')){
      dotsContainer.className='dots';
      root.appendChild(dotsContainer);
    }
    imgs.forEach((_,i)=>{
      const dot = document.createElement('div'); dot.className='dot'; if(i===0) dot.classList.add('active');
      dot.addEventListener('click', ()=>{ show(i); reset(); });
      dotsContainer.appendChild(dot);
    });
  }
  function show(i){
    imgs.forEach((im, k)=> im.style.opacity = (k===i? '1' : '0'));
    if(dotsContainer){
      Array.from(dotsContainer.children).forEach((d,k)=> d.classList.toggle('active', k===i));
    }
    idx = i;
  }
  function next(){ show((idx+1)%imgs.length) }
  let tid = setInterval(next, interval);
  function reset(){ clearInterval(tid); tid = setInterval(next, interval); }
  return {show, next, reset};
}
const mainCar = makeCarousel('mainCarousel',3000,true);
const sc1 = makeCarousel('sobreCarousel1',3000,false);
const sc2 = makeCarousel('sobreCarousel2',3000, false);

/* ========== PROCEDIMENTOS: cards open modal overlay ========== */
const procCards = document.querySelectorAll('.proc-card');
const procOverlay = document.getElementById('procOverlay');
const procModalTitle = document.getElementById('procModalTitle');
const procModalBody = document.getElementById('procModalBody');
const procClose = document.getElementById('procClose');

procCards.forEach(card=>{
  card.addEventListener('click', ()=>{
    const title = card.dataset.title || card.innerText;
    const body = card.dataset.body || '';
    procModalTitle.textContent = title;
    procModalBody.textContent = body;
    procOverlay.classList.add('open');
    procOverlay.setAttribute('aria-hidden','false');
    // make body behind opaque (via overlay) — already darkened by overlay
  });
});
procClose.addEventListener('click', ()=>{ procOverlay.classList.remove('open'); procOverlay.setAttribute('aria-hidden','true') });
procOverlay.addEventListener('click', (e)=>{ if(e.target === procOverlay){ procOverlay.classList.remove('open'); procOverlay.setAttribute('aria-hidden','true') } });

/* ========== DEPOIMENTOS: grid items open gallery (gallery overlay) ========== */
const depoItems = Array.from(document.querySelectorAll('.depo-item'));
const gallery = document.getElementById('gallery');
const gImg = document.getElementById('gImg');
const gCaption = document.getElementById('gCaption');
const gClose = document.getElementById('gClose');
const gPrev = document.getElementById('gPrev'); const gNext = document.getElementById('gNext');

const depoImages = depoItems.map((it,idx)=> {
  const img = it.querySelector('img');
  return {src: img.src, alt: img.alt, idx: idx};
});

let gIdx = 0;
function openGallery(start){
  gIdx = start;
  gImg.src = depoImages[gIdx].src;
  gImg.alt = depoImages[gIdx].alt;
  gCaption.textContent = "";
  gallery.classList.add('open'); gallery.setAttribute('aria-hidden','false');
}
depoItems.forEach((it, i)=> it.addEventListener('click', ()=> openGallery(i)));

gClose.addEventListener('click', ()=>{ gallery.classList.remove('open'); gallery.setAttribute('aria-hidden','true') });
gallery.addEventListener('click', (e)=>{ if(e.target === gallery) { gallery.classList.remove('open'); gallery.setAttribute('aria-hidden','true') } });
gPrev.addEventListener('click', ()=> { gIdx = (gIdx-1+depoImages.length)%depoImages.length; openGallery(gIdx) });
gNext.addEventListener('click', ()=> { gIdx = (gIdx+1)%depoImages.length; openGallery(gIdx) });

/* keyboard support for gallery */
document.addEventListener('keydown', (e)=>{
  if(gallery.classList.contains('open')){
    if(e.key === 'ArrowLeft') gPrev.click();
    if(e.key === 'ArrowRight') gNext.click();
    if(e.key === 'Escape') gClose.click();
  }
});

/* ========== small accessibility improvements ========== */
/* Focus outline for keyboard users */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Tab') document.body.classList.add('show-focus');
});
procCards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.dataset.title || card.innerText;
    const body = card.dataset.body || '';

    procModalTitle.textContent = title;

    // transforma todo body em lista
    // separa por ';' ou por quebras de linha
    const items = body.split(/;|\n/).map(item => item.trim()).filter(item => item.length > 0);
    
    const ul = document.createElement('ul');
    items.forEach(i => {
      const li = document.createElement('li');
      li.textContent = i;
      ul.appendChild(li);
    });

    // limpa o modal e adiciona a lista
    procModalBody.innerHTML = '';
    procModalBody.appendChild(ul);

    procOverlay.classList.add('open');
    procOverlay.setAttribute('aria-hidden','false');
  });
});
procCards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.dataset.title || card.innerText;
    const body = card.dataset.body || '';
    const imgSrc = card.dataset.img || './imagens/default.png'; // você pode adicionar data-img no HTML para cada card

    procModalTitle.textContent = title;

    // cria a imagem
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = title;
    img.style.display = 'block';
    img.style.width = '200px';       // ajuste o tamanho
    img.style.height = 'auto';
    img.style.margin = '10px auto';  // centraliza e dá espaçamento

    // transforma body em lista
    const items = body.split(/;|\n/).map(item => item.trim()).filter(item => item.length > 0);
    const ul = document.createElement('ul');
    items.forEach(i => {
      const li = document.createElement('li');
      li.textContent = i;
      ul.appendChild(li);
    });

    // limpa modal e adiciona elementos: título já está, depois imagem, depois lista
    procModalBody.innerHTML = '';
    procModalBody.appendChild(img);
    procModalBody.appendChild(ul);

    procOverlay.classList.add('open');
    procOverlay.setAttribute('aria-hidden','false');
  });
});
