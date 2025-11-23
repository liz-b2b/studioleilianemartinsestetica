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

  // attach open handlers
  const serviceItems = document.querySelectorAll('.service-item');
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
});
