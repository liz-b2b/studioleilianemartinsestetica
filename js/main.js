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
});
