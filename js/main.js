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
    'Limpeza de Pele Personalizada': 'Limpeza profunda e personalizada para cada tipo de pele, com produtos selecionados e massagem facial relaxante.',
    'Reparação de Barreira Cutânea': 'Tratamentos nutritivos que restauram a barreira da pele, reduzindo vermelhidão e sensibilidade.',
    'Tratamentos Faciais com Peeling Químico': 'Peelings suaves a moderados para renovar a textura e o tom da pele.',
    'Acne / Cicatriz de Acne': 'Protocolos específicos para reduzir acne ativa e melhorar a aparência de cicatrizes.',
    'Manchas': 'Clareamento localizado e tratamentos para uniformizar o tom da pele.',
    'Rejuvenescimento': 'Séries de tratamentos para estimular colágeno e melhorar firmeza e luminosidade.',
    'Microagulhamento': 'Procedimento para estimular cicatrização regenerativa e renovação cutânea.',
    'Drenagem Linfática': 'Massagem suave para redução de retenção de líquidos e sensação de leveza.',
    'Massagem Relaxante': 'Técnicas relaxantes para aliviar tensão e estresse.',
    'Massagem Modeladora': 'Sessões focadas em contorno e modelagem corporal.',
    'Ventosaterapia': 'Terapia com ventosas para estimular circulação e aliviar pontos de tensão.',
    'Ultrassom': 'Tratamento não invasivo para melhora de textura e penetração de ativos.',
    'Corrente Russa': 'Estimulação elétrica localizada para tonificação muscular.'
  };

  let gallery = [];
  let currentIndex = 0;

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
    // img root
    candidates.push('img/' + trimmed);
    // root (already added)
    return candidates;
  }

  function openModal(title, images, desc){
    if(!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalTitle.textContent = title;
    modalDesc.textContent = desc || serviceDescriptions[title] || '';
    // build gallery entries with candidate lists
    gallery = (images && images.length ? images : [placeholder]).map(name=>({
      name,
      candidates: makeCandidates(name),
      attempt: 0,
      currentSrc: ''
    }));
    currentIndex = 0;
    renderGallery();
  }

  function closeModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
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

  if(prevBtn) prevBtn.addEventListener('click', ()=>{ currentIndex = (currentIndex-1+gallery.length)%gallery.length; renderGallery(); });
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ currentIndex = (currentIndex+1)%gallery.length; renderGallery(); });
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  // close on backdrop
  modal && modal.addEventListener('click', (e)=>{ if(e.target && e.target.dataset && e.target.dataset.close) closeModal(); });
  // esc key and arrows
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape') closeModal();
    if(e.key==='ArrowLeft') { currentIndex = (currentIndex-1+gallery.length)%gallery.length; renderGallery(); }
    if(e.key==='ArrowRight') { currentIndex = (currentIndex+1)%gallery.length; renderGallery(); }
  });

  // attach open handlers (support both legacy .service-item and new .service-card)
  const serviceItems = document.querySelectorAll('.service-item, .service-card');
  serviceItems.forEach(item=>{
    const openHandler = ()=>{
      const title = item.querySelector('span') ? item.querySelector('span').innerText.trim() : item.innerText.trim();
      const raw = item.dataset.images || '';
      const images = raw.split(',').map(s=>s.trim()).filter(Boolean);
      openModal(title, images, '');
    };
    item.addEventListener('click', openHandler);
    item.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); openHandler(); } });
  });

  // button-specific handler: open modal when pressing the 'CONHECER' button inside a card
  const knowButtons = document.querySelectorAll('.btn-know');
  knowButtons.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const card = btn.closest('.service-card') || btn.closest('.service-item');
      if(!card) return;
      const title = card.querySelector('h4 span') ? card.querySelector('h4 span').innerText.trim() : (card.querySelector('span') ? card.querySelector('span').innerText.trim() : 'Serviço');
      const raw = card.dataset.images || '';
      const images = raw.split(',').map(s=>s.trim()).filter(Boolean);
      openModal(title, images, '');
    });
    btn.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); btn.click(); } });
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
});
