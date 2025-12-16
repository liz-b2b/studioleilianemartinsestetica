document.addEventListener('DOMContentLoaded', function(){
  // Newsletter form
  const form = document.getElementById('subscribe-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      if(!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
        alert('Por favor insira um e-mail válido.');
        return;
      }
      // aqui você integraria com um serviço real
      form.querySelector('.btn').textContent = 'Enviado';
      setTimeout(()=>{form.querySelector('.btn').textContent = 'Inscrever'},2000);
      alert('Obrigado! Verifique seu e-mail.');
      form.reset();
    });
  }

  // Simple image lazy loader (basic)
  const imgs = document.querySelectorAll('img');
  imgs.forEach(img=>{ if(img.complete) return; img.loading = 'lazy'; });

  /* Service modal logic */
  const modal = document.getElementById('service-modal');
  const modalTitle = modal && modal.querySelector('#modal-title');
  const modalDesc = modal && modal.querySelector('#modal-desc');
  const modalImg = modal && modal.querySelector('.modal-image');
  const thumbsArea = modal && modal.querySelector('.modal-thumbs');
  const prevBtn = modal && modal.querySelector('.media-prev');
  const nextBtn = modal && modal.querySelector('.media-next');
  const closeBtn = modal && modal.querySelector('.modal-close');

  const placeholder = 'https://placehold.co/1200x900/FDF9F8/C59A9A?text=Imagem+em+breve';

  const serviceDescriptions = {
    'Limpeza de Pele Personalizada': [
      'Elimina cravos e resíduos acumulados nos poros',
      'Reduz a oleosidade e previne o surgimento de acne',
      'Melhora textura e viço da pele',
      'Auxilia no rejuvenescimento',
      'Potencializa a absorção de produtos skincare'
    ],
    'Reparação de Barreira Cutânea': [
      'Hidratação intensa com produtos ricos em ceramidas, niacinamida, pantenol e ácido hialurônico',
      'Promove hidratação profunda da pele',
      'Melhora da elasticidade e firmeza',
      'Auxilia na uniformização do tom da pele',
      'Renova e devolve o viço natural da pele'
    ],
    'Tratamentos Faciais com Peeling Químico': [
      'Deixa a pele lisa, macia e uniforme',
      'Diminuição das linhas finas e rugas',
      'Trata manchas e melasmas, hiperpigmentações',
      'Trata acne ativa e melhora das cicatrizes da acne',
      'Diminui oleosidade da pele e a aparência dos poros',
      'Rejuvenesce a aparência geral da pele'
    ],
    'Acne / Cicatriz de Acne': 'Protocolos específicos para reduzir acne ativa e melhorar a aparência de cicatrizes.',
    'Manchas': 'Clareamento localizado e tratamentos para uniformizar o tom da pele.',
    'Rejuvenescimento': [
      'Melhora o viço e devolve o brilho natural da pele',
      'Aumenta a hidratação e a maciez do rosto',
      'Suaviza sinais de cansaço e aspecto opaco',
      'Deixa a pele mais firme e com aparência saudável'
    ],
    'Microagulhamento': [
      'Estimula a produção de colágeno e elastina',
      'Reduz linhas de expressão',
      'Melhora cicatrizes de acne e textura da pele',
      'Reduz aparência de poros dilatados',
      'Auxilia no tratamento de manchas e no rejuvenescimento geral'
    ],
    'Drenagem Linfática': [
      'Técnica de massagem suave que estimula o sistema linfático',
      'Promove a eliminação de líquidos e toxinas do organismo',
      'Reduz retenção de líquidos e inchaço',
      'Proporciona sensação de leveza e bem-estar'
    ],
    'Massagem Relaxante': [
      'Melhora a circulação sanguínea',
      'Alivia dores e tensões musculares',
      'Reduz o estresse e promove bem-estar físico e mental',
      'Contribui para mais qualidade de vida no dia a dia'
    ],
    'Massagem Modellatta': [
      'Equipamento de endermoterapia vibratória que potencializa resultados estéticos',
      'Promove estímulos mecânicos nos tecidos',
      'Aumenta a eficácia comparada à massagem modeladora manual',
      'Auxilia na tonificação e melhora do contorno'
    ],
    'Ventosaterapia': [
      'Técnica com copos de sucção que estimula a circulação',
      'Alivia tensões musculares e ajuda a reduzir dores',
      'Auxilia na liberação de toxinas e relaxamento profundo',
      'Proporciona sensação imediata de leveza e bem-estar'
    ],
    'Ultrassom': 'Tratamento não invasivo para melhora de textura e penetração de ativos.',
    'Corrente Russa': 'Estimulação elétrica localizada para tonificação muscular.'
  };

  
  // Helper to escape HTML when rendering lists in the modal
  function escapeHtml(str){
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  let gallery = [];
  let currentIndex = 0;
  // list of all service cards on the page (used to navigate between services when modal is open)
  const allServiceCards = Array.from(document.querySelectorAll('.service-card'));
  let activeServiceIndex = -1; // index into allServiceCards for currently open service
  let modalAutoplayTimer = null;
  // list of initialized carousel containers for page autoplay control
  const carouselsList = [];

  // Normalize image entries into candidate lists (try several possible paths)
  function makeCandidates(name){
    const trimmed = name.trim();
    const candidates = [];
    // raw name
    candidates.push(trimmed);
    // serviços folder (accented)
    candidates.push('serviços/' + trimmed);
    // servicos ascii
    candidates.push('servicos/' + trimmed);
    // img/servicos
    candidates.push('img/servicos/' + trimmed);
    // folder for estética facial (try both raw space and encoded space)
    candidates.push('img/estetica facial/' + trimmed);
    candidates.push('img/estetica%20facial/' + trimmed);
    // folder for estética corporal (try both raw space and encoded space)
    candidates.push('img/estetica corporal/' + trimmed);
    candidates.push('img/estetica%20corporal/' + trimmed);
    // img root
    candidates.push('img/' + trimmed);
    // root (already added)
    return candidates;
  }

  function openModal(title, images, desc){
    if(!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // pause page carousels autoplay when modal opens
    try{ stopCarouselsAutoplay(); }catch(e){}
    modalTitle.textContent = title;
    // If description is an array, render as bullet list; otherwise render plain text
    const raw = desc || serviceDescriptions[title] || '';
    if(Array.isArray(raw)){
      modalDesc.innerHTML = '<ul class="service-points">' + raw.map(item=>`<li>${escapeHtml(item)}</li>`).join('') + '</ul>';
    } else {
      modalDesc.textContent = raw;
    }
    // build gallery entries with candidate lists
    gallery = (images && images.length ? images : [placeholder]).map(name=>({
      name,
      candidates: makeCandidates(name),
      attempt: 0,
      currentSrc: ''
    }));
    currentIndex = 0;
    // set activeServiceIndex to the matching card if possible
    activeServiceIndex = allServiceCards.findIndex(c => (c.querySelector('h4 span') ? c.querySelector('h4 span').innerText.trim() : (c.querySelector('span') ? c.querySelector('span').innerText.trim() : '')) === title);
    renderGallery();
  }

  function closeModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // stop any modal autoplay when closing
    try{ if(modalAutoplayTimer) clearInterval(modalAutoplayTimer); modalAutoplayTimer = null; }catch(e){}
    // resume page carousels autoplay when modal closes
    try{ startCarouselsAutoplay(); }catch(e){}
  }

  function trySetImage(entry, imgEl){
    if(!entry || !imgEl) return;
    const tryNext = ()=>{
      if(entry.attempt >= entry.candidates.length){
        imgEl.src = placeholder;
        return;
      }
      const src = entry.candidates[entry.attempt++];
      imgEl.src = src;
    };
    // attach onerror to cycle candidates
    imgEl.onerror = function(){ tryNext(); };
    // initial attempt
    entry.attempt = 0;
    tryNext();
  }

  function renderGallery(){
    if(!modalImg) return;
    const entry = gallery[currentIndex];
    // fade-out before changing src for a smooth transition
    try{ modalImg.style.transition = 'opacity .36s ease'; modalImg.style.opacity = 0; }catch(e){}
    trySetImage(entry, modalImg);
    // thumbs
    if(thumbsArea){
      thumbsArea.innerHTML = '';
      gallery.forEach((ent, i)=>{
        const t = document.createElement('img');
        // set first candidate as thumb, with fallback handled by onerror
        t.src = ent.candidates && ent.candidates[0] ? ent.candidates[0] : placeholder;
        t.alt = '';
        if(i===currentIndex) t.classList.add('active');
        t.addEventListener('click', ()=>{ currentIndex=i; renderGallery(); });
        t.onerror = ()=>{ t.src = placeholder; };
        thumbsArea.appendChild(t);
      });
    }
  }

  // when image loads, fade it in
  if(modalImg){
    modalImg.onload = function(){ try{ modalImg.style.opacity = 1; }catch(e){} };
  }
  // navigate to next/previous service card (not just images)
  function goToService(index){
    if(!allServiceCards.length) return;
    const len = allServiceCards.length;
    const idx = ((index % len) + len) % len;
    const card = allServiceCards[idx];
    if(!card) return;
    // derive title/images and open modal for that service
    const title = card.querySelector('h4 span') ? card.querySelector('h4 span').innerText.trim() : (card.querySelector('span') ? card.querySelector('span').innerText.trim() : 'Serviço');
    const raw = card.dataset.images || '';
    const images = raw.split(',').map(s=>s.trim()).filter(Boolean);
    // set active index
    activeServiceIndex = idx;
    openModal(title, images, '');
  }

  function nextService(){ goToService(activeServiceIndex + 1); }
  function prevService(){ goToService(activeServiceIndex - 1); }

  function startModalAutoplay(){
    stopModalAutoplay();
    try{ const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(reduced) return; }catch(e){}
    modalAutoplayTimer = setInterval(()=>{ nextService(); }, 2000);
  }
  function stopModalAutoplay(){ if(modalAutoplayTimer){ clearInterval(modalAutoplayTimer); modalAutoplayTimer = null; } }

  if(prevBtn) prevBtn.addEventListener('click', ()=>{ prevService(); });
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ nextService(); });
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  // close on backdrop
  modal && modal.addEventListener('click', (e)=>{ if(e.target && e.target.dataset && e.target.dataset.close) closeModal(); });
  // esc key and arrows
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape') closeModal();
    if(e.key==='ArrowLeft') { prevService(); }
    if(e.key==='ArrowRight') { nextService(); }
  });

  // attach open handlers (support both legacy .service-item and new .service-card)
  const serviceItems = document.querySelectorAll('.service-item, .service-card');
  serviceItems.forEach(item=>{
    const openHandler = ()=>{
      const title = item.querySelector('span') ? item.querySelector('span').innerText.trim() : item.innerText.trim();
      const raw = item.dataset.images || '';
      const images = raw.split(',').map(s=>s.trim()).filter(Boolean);
      // set activeServiceIndex to this card
      activeServiceIndex = allServiceCards.indexOf(item.closest('.service-card'));
      openModal(title, images, '');
    };
    item.addEventListener('click', openHandler);
    item.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); openHandler(); } });
  });

  // Delegate clicks on any current or future '.btn-know' (handles cloned carousel items)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.btn-know');
    if(!btn) return;
    e.stopPropagation();
    const card = btn.closest('.service-card') || btn.closest('.service-item');
    if(!card) return;
    const title = card.querySelector('h4 span') ? card.querySelector('h4 span').innerText.trim() : (card.querySelector('span') ? card.querySelector('span').innerText.trim() : 'Serviço');
    const raw = card.dataset.images || '';
    const images = raw.split(',').map(s=>s.trim()).filter(Boolean);
    activeServiceIndex = allServiceCards.indexOf(card.closest('.service-card'));
    openModal(title, images, '');
  });
  // Keyboard support: trigger button when focused and Enter/Space pressed
  document.addEventListener('keydown', (e)=>{
    if((e.key==='Enter' || e.key===' ') && document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('btn-know')){
      e.preventDefault(); document.activeElement.click();
    }
  });

  /* --- Coupon toast notification logic --- */
  const notifBtn = document.getElementById('notif-btn');
  const couponToast = document.getElementById('coupon-toast');
  const toastClose = couponToast && couponToast.querySelector('.toast-close');
  const toastOpenCoupon = document.getElementById('toast-open-coupon');
  const promoBadge = document.querySelector('.promo-badge.coupon');

  function showToast(){
    if(!couponToast) return;
    couponToast.setAttribute('aria-hidden','false');
    // set expanded state on button
    if(notifBtn) notifBtn.setAttribute('aria-expanded','true');
    // auto-hide after 8s
    clearTimeout(couponToast._hideTimeout);
    couponToast._hideTimeout = setTimeout(hideToast, 8000);
  }
  function hideToast(){
    if(!couponToast) return;
    couponToast.setAttribute('aria-hidden','true');
    if(notifBtn) notifBtn.setAttribute('aria-expanded','false');
    clearTimeout(couponToast._hideTimeout);
  }

  if(notifBtn){
    notifBtn.addEventListener('click', (e)=>{ e.stopPropagation(); if(couponToast && couponToast.getAttribute('aria-hidden')==='false') hideToast(); else showToast(); });
  }
  if(toastClose) toastClose.addEventListener('click', hideToast);
  // clicking the toast CTA opens the coupon (or scrolls to promo badge)
  if(toastOpenCoupon){
    toastOpenCoupon.addEventListener('click', (e)=>{
      e.preventDefault();
      hideToast();
      if(promoBadge){
        // visually bump the promo badge and scroll into view
        promoBadge.scrollIntoView({behavior:'smooth',block:'center'});
        promoBadge.classList.add('promo-highlight');
        setTimeout(()=>promoBadge.classList.remove('promo-highlight'),2000);
        // if promo badge is a link, simulate click
        if(typeof promoBadge.click === 'function') promoBadge.click();
      }
    });
  }

  // show toast on page load after a short delay
  try{ const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(!reduced) setTimeout(showToast, 1200); else setTimeout(showToast, 800); }catch(e){}

  // hide toast when clicking outside
  document.addEventListener('click', (e)=>{ if(couponToast && couponToast.getAttribute('aria-hidden')==='false'){ const inside = couponToast.contains(e.target) || (notifBtn && notifBtn.contains(e.target)); if(!inside) hideToast(); } });

  // Coupon photo fallback: if image fails to load, replace with a background fallback
  document.querySelectorAll('.coupon-photo').forEach(img => {
    // try alternative candidate paths before falling back to default icon
    const candidates = [
      'img/fotonocupom.jpg',
      'img/FOTONOCUPOM.jpg',
      'FOTONOCUPOM.jpg',
      'fotonocupom.jpg'
    ];
    let attempts = 0;
    const handleError = ()=>{
      const right = img.closest('.coupon-right');
      if(!right) return;
      if(attempts < candidates.length){
        img.src = candidates[attempts++];
        return;
      }
      // no more candidates -> apply graceful background fallback
      img.style.display = 'none';
      right.classList.add('coupon-photo-missing');
      right.style.backgroundImage = 'url("img/icon-192.svg")';
      right.style.backgroundSize = 'cover';
      right.style.backgroundPosition = 'center';
      right.style.backgroundRepeat = 'no-repeat';
    };
    img.addEventListener('error', handleError);
    // also check if it has already failed to load
    if(img.complete && img.naturalWidth === 0){ handleError(); }
  });

  /* --- Mobile bottom nav active handling --- */
  (function(){
    const mobileNav = document.querySelector('.mobile-bottom-nav');
    if(!mobileNav) return;
    
    // Hide mobile nav on desktop screens (900px and above)
    function toggleMobileNav(){
      if(window.innerWidth >= 900){
        mobileNav.style.display = 'none';
        mobileNav.style.visibility = 'hidden';
        mobileNav.style.opacity = '0';
        mobileNav.style.pointerEvents = 'none';
      } else {
        mobileNav.style.display = 'flex';
        mobileNav.style.visibility = 'visible';
        mobileNav.style.opacity = '1';
        mobileNav.style.pointerEvents = 'auto';
      }
    }
    
    // Check on load and resize
    toggleMobileNav();
    window.addEventListener('resize', toggleMobileNav);
    const links = Array.from(mobileNav.querySelectorAll('a[href^="#"]'));

    function setActiveByHash(hash){
      if(!hash) hash = '#home';
      links.forEach(a=> a.classList.toggle('active', a.getAttribute('href')===hash));
    }

    // click -> set active immediately (allow default navigation)
    links.forEach(a=>{
      a.addEventListener('click', (e)=>{
        links.forEach(x=>x.classList.remove('active'));
        a.classList.add('active');
      });
    });

    // set initial active based on location.hash
    setTimeout(()=> setActiveByHash(location.hash || '#home'), 60);

    // update on hashchange (user navigated or clicked a link elsewhere)
    window.addEventListener('hashchange', ()=> setActiveByHash(location.hash || '#home'));

    // keep in sync while scrolling using IntersectionObserver (optional)
    try{
      const sections = Array.from(document.querySelectorAll('main section[id]'));
      if(sections.length){
        const io = new IntersectionObserver((entries)=>{
          entries.forEach(entry=>{
            if(entry.isIntersecting){
              const id = '#'+entry.target.id;
              setActiveByHash(id);
            }
          });
        },{threshold:0.55});
        sections.forEach(s=>io.observe(s));
      }
    }catch(e){/* ignore if IntersectionObserver unsupported */}
  })();

  /* --- Banner fade behavior (IntersectionObserver + scroll-fallback) ---
     - Never fully hide: min opacity 0.15
     - Transform when hidden: translateY(-10px) scale(0.995)
     - Transitions: transform 420ms cubic-bezier(.22,.9,.32,1), opacity 420ms ease
     - Use IntersectionObserver with thresholds and rootMargin to map intersectionRatio -> visual state
     - Fallback: detect scroll direction and throttle/raf updates
  */
  (function(){
    const banner = document.querySelector('.banner-cta');
    if(!banner) return;

    // Respect reduced motion
    try{ if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}

    // visual constants
    const MIN_OPACITY = 0.15;
    const MIN_SCALE = 0.995;
    const MAX_TRANSLATE = -10; // px upward when most hidden
    const TRANSITION = 'transform 420ms cubic-bezier(.22,.9,.32,1), opacity 420ms ease';

    banner.style.transition = TRANSITION;
    banner.style.zIndex = '999';
    banner.style.pointerEvents = 'auto';

    function setVisual(opacity, scale, translateY){
      // clamp
      const o = Math.max(MIN_OPACITY, Math.min(1, opacity));
      const s = Math.max(MIN_SCALE, Math.min(1, scale));
      const t = Math.max(MAX_TRANSLATE, Math.min(0, translateY));
      banner.style.opacity = String(o);
      banner.style.transform = `translateY(${t}px) scale(${s})`;
      if(o <= MIN_OPACITY + 0.01) banner.classList.add('banner--peek'); else banner.classList.remove('banner--peek');
    }

    function lerp(a,b,t){ return a + (b - a) * t; }

    function mapRatioToVisual(r){
      // r in [0,1]
      let opacity;
      if(r >= 0.6) opacity = 1;
      else if(r >= 0.35) opacity = lerp(0.6, 0.9, (r - 0.35) / (0.25));
      else if(r >= 0.15) opacity = lerp(0.25, 0.6, (r - 0.15) / (0.20));
      else opacity = MIN_OPACITY;

      // normalize opacity between MIN_OPACITY..1
      const norm = (opacity - MIN_OPACITY) / (1 - MIN_OPACITY || 1);
      const scale = lerp(MIN_SCALE, 1, norm);
      const translateY = lerp(MAX_TRANSLATE, 0, norm);
      return { opacity, scale, translateY };
    }

    // IntersectionObserver mode (preferred)
    const ioOptions = { root: null, rootMargin: '0px 0px -40% 0px', threshold: [0,0.15,0.35,0.6,1] };
    let usingIO = false;

    try{
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry => {
          usingIO = true;
          const r = entry.intersectionRatio;
          const vis = mapRatioToVisual(r);
          // apply; when fully in view, ensure full visible
          setVisual(vis.opacity, vis.scale, vis.translateY);
        });
      }, ioOptions);
      io.observe(banner);
    }catch(e){ usingIO = false; }

    // Fallback: direction-based scroll handling (throttled)
    let lastY = window.scrollY || 0;
    let ticking = false;
    let lastApply = performance.now();

    function handleScrollFallback(){
      const now = performance.now();
      if(now - lastApply < 120) return; // throttle ~120ms para melhor performance
      lastApply = now;
      const y = window.scrollY || 0;
      const direction = y > lastY ? 1 : (y < lastY ? -1 : 0);
      lastY = y;

      const rect = banner.getBoundingClientRect();
      const bannerTop = rect.top + window.scrollY;
      const bannerHeight = rect.height;

      // only start hiding if user scrolled well past the banner area
      const hideTrigger = bannerTop + bannerHeight + 120;
      if(direction === 1 && window.scrollY > hideTrigger){
        // progressive hide proportional to (scrollY - hideTrigger) upto some cap
        const extra = Math.min(520, window.scrollY - hideTrigger);
        const p = Math.min(1, extra / 520); // 0..1
        const vis = mapRatioToVisual(1 - p); // reduce ratio towards 0
        setVisual(vis.opacity, vis.scale, vis.translateY);
      } else if(direction === -1){
        // scrolling up -> reveal progressively based on distance to top
        const distFromTop = Math.max(0, window.scrollY);
        // compute ratio as proportion of how close to top we are relative to bannerTop
        const full = Math.max(1, bannerTop || 1);
        const r = Math.max(0, 1 - (distFromTop / full));
        const vis = mapRatioToVisual(r);
        setVisual(vis.opacity, vis.scale, vis.translateY);
      }
    }

    function onScroll(){ 
      if(!usingIO && !ticking){ 
        window.requestAnimationFrame(()=>{ 
          handleScrollFallback(); 
          ticking=false; 
        }); 
        ticking=true; 
      } 
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // ensure initial state
    // if IO used, observer will trigger; otherwise set to visible
    if(!usingIO) setVisual(1,1,0);
  })();

  /* --- Service Worker registration & PWA install prompt --- */
  // Register service worker for PWA functionality (requires HTTPS or localhost)
  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('/sw.js').then(reg=>{
        console.log('ServiceWorker registered:', reg.scope);
      }).catch(err=>{
        console.warn('ServiceWorker registration failed:', err);
      });
    });
  }

  // beforeinstallprompt handling: show a small install button when available
  let deferredInstallPrompt = null;
  const installBtn = document.createElement('button');
  installBtn.className = 'pwa-install-btn';
  installBtn.setAttribute('aria-hidden','true');
  installBtn.title = 'Instalar o app';
  installBtn.innerHTML = 'Instalar';
  installBtn.style.display = 'none';
  document.body.appendChild(installBtn);

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    deferredInstallPrompt = e;
    // show our custom install button
    installBtn.style.display = 'block';
    installBtn.setAttribute('aria-hidden','false');
  });

  installBtn.addEventListener('click', async () => {
    if(!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    // hide the button after choice
    installBtn.style.display = 'none';
    installBtn.setAttribute('aria-hidden','true');
    deferredInstallPrompt = null;
    console.log('PWA install choice:', choice && choice.outcome);
  });

  // hide the button if the app is already installed
  window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    installBtn.setAttribute('aria-hidden','true');
    deferredInstallPrompt = null;
  });

  // Carousel functionality
  function initCarousel(carouselContainer) {
    const track = carouselContainer.querySelector('.carousel-track');
    const items = Array.from(carouselContainer.querySelectorAll('.carousel-item'));
    const prevBtn = carouselContainer.querySelector('.carousel-prev');
    const nextBtn = carouselContainer.querySelector('.carousel-next');

    if (!track || !items.length) return;
    // ensure scrollable track - otimizado para performance
    track.style.overflowX = 'auto';
    track.style.scrollBehavior = 'auto';

    // viewport adaptation: force 1 item per view on narrow screens to avoid layout mismatch
    const mqMobile = window.matchMedia('(max-width:900px)');
    function applyMobileSizing() {
      if (mqMobile.matches) {
        Array.from(track.querySelectorAll('.carousel-item')).forEach(it => { it.style.flex = '0 0 100%'; });
        // smaller gap on mobile
        track.style.gap = '14px';
      } else {
        Array.from(track.querySelectorAll('.carousel-item')).forEach(it => { it.style.flex = ''; });
        track.style.gap = '';
      }
    }
    applyMobileSizing();
    mqMobile.addEventListener && mqMobile.addEventListener('change', () => { applyMobileSizing(); repositionToIndex(0); });

    // Implement an infinite loop by cloning ends
    let originalItems = Array.from(carouselContainer.querySelectorAll('.carousel-item'));
    let originalCount = originalItems.length;
    let clones = 0;

    function getGap() {
      try { const gap = getComputedStyle(track).gap; return gap ? parseFloat(gap) : 22; } catch (e) { return 22; }
    }

    function getItemWidth() {
      const node = track.querySelector('.carousel-item');
      if (!node) return 300;
      const rect = node.getBoundingClientRect();
      if (rect && rect.width > 0) return rect.width;
      return node.offsetWidth || (carouselContainer.clientWidth / 2) || 300;
    }

    function visibleCount() {
      const gap = getGap();
      const iw = getItemWidth();
      if (mqMobile.matches) return 1;
      return Math.max(1, Math.floor((track.clientWidth + gap) / (iw + gap)));
    }

    function setupLoop() {
      // remove previous clones if any
      Array.from(track.querySelectorAll('[data-clone]')).forEach(n => n.remove());
      originalItems = Array.from(carouselContainer.querySelectorAll('.carousel-item'));
      originalCount = originalItems.length;
      clones = Math.max(1, visibleCount());
      // clone last 'clones' to the start
      for (let i = 0; i < clones; i++){
        const node = originalItems[originalCount - 1 - i];
        if(!node) break;
        const c = node.cloneNode(true);
        c.setAttribute('data-clone','true');
        track.insertBefore(c, track.firstChild);
      }
      // clone first 'clones' to the end
      for (let i = 0; i < clones; i++){
        const node = originalItems[i];
        if(!node) break;
        const c = node.cloneNode(true);
        c.setAttribute('data-clone','true');
        track.appendChild(c);
      }
    }

    setupLoop();

    // refresh item list after cloning
    let allItems = Array.from(track.querySelectorAll('.carousel-item'));
    let currentIndex = 0; // index relative to original items

    function repositionToIndex(i, smooth = true){
      const gap = getGap();
      const iw = getItemWidth();
      // scroll to position that accounts for prepended clones
      const left = Math.round((i + clones) * (iw + gap));
      // sempre usar 'auto' para melhor performance durante scroll da página
      track.scrollTo({ left, behavior: 'auto' });
      currentIndex = ((i % originalCount) + originalCount) % originalCount;
    }

    // initially position to the real first item (after clones)
    setTimeout(()=>{ allItems = Array.from(track.querySelectorAll('.carousel-item')); repositionToIndex(0, false); }, 60);

    // next/prev handlers: move relative and let looping logic handle wrap
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); repositionToIndex(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); repositionToIndex(currentIndex + 1); });

    // keep index in sync when user scrolls (use debounce otimizado)
    let scrollTimer = null;
    let isScrolling = false;
    track.addEventListener('scroll', () => {
      if(isScrolling) return; // evita múltiplas execuções durante scroll
      isScrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const gap = getGap();
        const iw = getItemWidth();
        const rawIdx = Math.round(track.scrollLeft / (iw + gap));
        // if we're in the prepended clones area, jump to the equivalent real position
        if (rawIdx < clones) {
          const target = rawIdx + originalCount;
          track.scrollLeft = Math.round((target) * (iw + gap)); // jump without smooth
          currentIndex = ((target - clones) % originalCount + originalCount) % originalCount;
          isScrolling = false;
          return;
        }
        // if we're in the appended clones area, jump back to equivalent real position
        if (rawIdx >= clones + originalCount) {
          const target = rawIdx - originalCount;
          track.scrollLeft = Math.round((target) * (iw + gap));
          currentIndex = ((target - clones) % originalCount + originalCount) % originalCount;
          isScrolling = false;
          return;
        }
        // otherwise we are within the main range
        currentIndex = ((rawIdx - clones) % originalCount + originalCount) % originalCount;
        isScrolling = false;
      }, 150); // aumentado de 80ms para 150ms para melhor performance
    }, { passive: true });

    // adapt on resize: rebuild clones and reposition
    let resizeTimer = null;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(()=> { applyMobileSizing(); setupLoop(); allItems = Array.from(track.querySelectorAll('.carousel-item')); repositionToIndex(currentIndex, false); }, 160); });

    // autoplay control for this carousel: advance one logical index every 2s (otimizado)
    let autoTimer = null;
    let isPageScrolling = false;
    // detectar quando a página está sendo rolada
    window.addEventListener('scroll', () => {
      isPageScrolling = true;
      clearTimeout(window._scrollStopTimer);
      window._scrollStopTimer = setTimeout(() => { isPageScrolling = false; }, 300);
    }, { passive: true });
    
    function startAuto(){
      stopAuto();
      try{ const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(reduced) return; }catch(e){}
      autoTimer = setInterval(()=>{ 
        // pausar autoplay se a página estiver sendo rolada
        if(!isPageScrolling) {
          repositionToIndex(currentIndex + 1); 
        }
      }, 2500); // aumentado de 2000ms para 2500ms para reduzir frequência
    }
    function stopAuto(){ if(autoTimer){ clearInterval(autoTimer); autoTimer = null; } }
    // expose controls on container and register in the global list
    carouselContainer._startAutoplay = startAuto;
    carouselContainer._stopAutoplay = stopAuto;
    carouselsList.push(carouselContainer);
  }
  
  // Initialize all carousels
  const carousels = document.querySelectorAll('.carousel-container');
  carousels.forEach(carousel => {
    initCarousel(carousel);
  });

  // control helpers for all page carousels
  function startCarouselsAutoplay(){ try{ carouselsList.forEach(c=> c._startAutoplay && c._startAutoplay()); }catch(e){} }
  function stopCarouselsAutoplay(){ try{ carouselsList.forEach(c=> c._stopAutoplay && c._stopAutoplay()); }catch(e){} }

  // start autoplay by default (modal is closed on load)
  try{ startCarouselsAutoplay(); }catch(e){}

  /* --- Header hide-on-scroll behavior ---
     Smoothly hides the header while scrolling down and shows it again when
     scrolling up or when the hero section is mostly visible. The threshold
     uses the hero's bottom relative to the viewport (hide when bottom <= 60% viewport).
  */
  (function(){
    const header = document.querySelector('.site-header');
    const hero = document.querySelector('.hero');
    if(!header || !hero) return;

    let ticking = false;

    function updateHeader(){
      ticking = false;
      const rect = hero.getBoundingClientRect();
      const hideThreshold = window.innerHeight * 0.6; // when hero bottom <= 60% viewport
      if(rect.bottom <= hideThreshold){
        header.classList.add('site-header--hidden');
      } else {
        header.classList.remove('site-header--hidden');
      }
    }

    function onScroll(){
      if(!ticking){
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    // run once to set initial state — but avoid hiding header on first paint
    // if the user hasn't scrolled yet. This prevents the header from
    // disappearing when the hero layout places its bottom below the
    // threshold on initial load (common with negative margins).
    if (window.scrollY > 20) {
      updateHeader();
    } else {
      // ensure header is visible at first paint
      header.classList.remove('site-header--hidden');
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
  })();

  /* --- Scroll-based Reveal (IntersectionObserver + fallback) --- */
  (function(){
    // Respect reduce motion preference
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Elements to reveal: add or detect common blocks
    const nodes = Array.from(document.querySelectorAll('main > section, .carousel-item, .service-card, .feedback-card, .insta, .banner-card, .hero-card, .product, .contact-card'));
    if(!nodes.length) return;

    // Ensure reveal class present so CSS baseline applies
    nodes.forEach(n => { if(!n.classList.contains('reveal')) n.classList.add('reveal'); });

    const ioOptions = { root: null, rootMargin: '0px 0px -20% 0px', threshold: [0,0.15,0.35,0.6,1] };

    function mapRatioToVisual(r){
      // returns {opacity, translateY, scale}
      if(r >= 0.6) return { opacity: 1, translateY: 0, scale: 1 };
      if(r >= 0.35){
        const t = (r - 0.35) / (0.25); // 0..1
        const opacity = 0.7 + (0.95 - 0.7) * t;
        const translateY = 8 - (4 * t); // 8 -> 4
        const scale = 0.997 + (0.999 - 0.997) * t;
        return { opacity, translateY, scale };
      }
      if(r >= 0.15){
        const t = (r - 0.15) / (0.20);
        const opacity = 0.25 + (0.6 - 0.25) * t;
        const translateY = 14 - (6 * t); // 14 -> 8
        const scale = 0.995 + (0.002 * t);
        return { opacity, translateY, scale };
      }
      return { opacity: 0.15, translateY: 20, scale: 0.995 };
    }

    function applyVisual(el, v){
      // use rAF for smoother updates
      window.requestAnimationFrame(()=>{
        el.style.opacity = String(Math.max(0.15, Math.min(1, v.opacity)));
        el.style.transform = `translateY(${v.translateY}px) scale(${v.scale})`;
        if(v.opacity >= 0.999) el.classList.add('is-visible'); else el.classList.remove('is-visible');
      });
    }

    function initStagger(parent){
      const children = Array.from(parent.querySelectorAll('.reveal-item'));
      if(!children.length){
        // choose sensible internal items: immediate children of p-body or direct child cards
        const auto = Array.from(parent.querySelectorAll('.p-body > *, .carousel-item, .feedback-card, .insta'));
        auto.forEach((c,i)=>{ c.classList.add('reveal-item'); c.style.setProperty('--reveal-index', i); });
      } else {
        children.forEach((c,i)=> c.style.setProperty('--reveal-index', i));
      }
    }

    // apply stagger initialization
    nodes.forEach(n => initStagger(n));

    if('IntersectionObserver' in window && !prefersReduced){
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry => {
          const r = entry.intersectionRatio;
          const v = mapRatioToVisual(r);
          applyVisual(entry.target, v);

          // apply mask to carousel/feedback tracks inside this section
          const tracks = entry.target.querySelectorAll('.carousel-track, .feedback-viewport');
          tracks.forEach(t => {
            if(r > 0.15) t.classList.add('revealed-mask'); else t.classList.remove('revealed-mask');
          });

          // stagger children: set transition-delay from index
          const children = Array.from(entry.target.querySelectorAll('.reveal-item'));
          children.forEach((c, i)=>{
            const gap = 100; // ms
            const delay = `${i * gap}ms`;
            c.style.transitionDelay = delay;
          });
        });
      }, ioOptions);
      nodes.forEach(n => io.observe(n));
    } else {
      // Fallback: throttle scroll + compute approximate intersection ratio
      function computeAndApply(){
        nodes.forEach(n => {
          const rect = n.getBoundingClientRect();
          const vh = window.innerHeight || document.documentElement.clientHeight;
          const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
          const ratio = rect.height > 0 ? Math.max(0, Math.min(1, visible / rect.height)) : (visible > 0 ? 1 : 0);
          const v = mapRatioToVisual(ratio);
          applyVisual(n, v);
          const tracks = n.querySelectorAll('.carousel-track, .feedback-viewport');
          tracks.forEach(t => { if(ratio > 0.15) t.classList.add('revealed-mask'); else t.classList.remove('revealed-mask'); });
          const children = Array.from(n.querySelectorAll('.reveal-item'));
          children.forEach((c,i)=> c.style.transitionDelay = `${i * 100}ms`);
        });
      }
      let ticking = false;
      let lastScrollTime = 0;
      window.addEventListener('scroll', ()=>{
        const now = performance.now();
        if(!ticking && (now - lastScrollTime) > 100){
          window.requestAnimationFrame(()=>{ 
            computeAndApply(); 
            ticking = false; 
            lastScrollTime = performance.now();
          }); 
          ticking = true; 
        }
      }, { passive: true });
      window.addEventListener('resize', ()=>{ computeAndApply(); }, { passive: true });
      // initial
      computeAndApply();
    }
  })();

});
