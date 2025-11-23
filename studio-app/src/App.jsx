import React from 'react'

const Header = () => (
  <header className="border-b border-gray-100">
    <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      <div className="text-center">
        <div className="logo-title text-xl">Studio <span className="block font-semibold text-2xl">Leiliane Martins</span> <small className="text-gray-500">Estética</small></div>
      </div>
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <a href="#">Home</a>
        <a href="#services">Serviços</a>
        <a href="#about">Sobre</a>
        <a href="#blog">Blog</a>
        <a href="#contact">Contato</a>
      </nav>
      <div className="hidden md:flex gap-3">
        <button className="text-lg">🔍</button>
        <button className="text-lg">👤</button>
        <button className="text-lg">🛒</button>
      </div>
    </div>
  </header>
)

const Hero = () => (
  <section className="bg-white">
    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h3 className="script-font text-4xl text-primary-600">Bright Vibes</h3>
        <h1 className="logo-title text-5xl font-semibold mt-2">Collection</h1>
        <p className="text-gray-600 mt-4 max-w-md">Sofisticação & Conveniência — tratamentos e cuidados pensados para realçar sua beleza com delicadeza e precisão.</p>
        <div className="mt-6">
          <a href="#" className="inline-block bg-primary-600 text-gray-900 px-6 py-3 rounded-full font-semibold">Agende Agora</a>
        </div>
      </div>
      <div>
        <img className="w-full rounded-xl shadow-lg" src="https://images.unsplash.com/photo-1520975919848-9f3d4a0f7e5a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a4b3c0c" alt="hero" />
      </div>
    </div>
  </section>
)

const Categories = () => (
  <section className="py-8">
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex gap-6 justify-center">
        <div className="bg-primary-600/40 rounded-xl p-6 text-center w-56">Terapias Faciais</div>
        <div className="bg-primary-600/40 rounded-xl p-6 text-center w-56">Corpo & Spa</div>
        <div className="bg-primary-600/40 rounded-xl p-6 text-center w-56">Tratamentos Avançados</div>
      </div>
    </div>
  </section>
)

const products = [
  {title:'Peeling Suave', price:'R$ 180', img:'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8c3b7b'},
  {title:'Hidratação Profunda', price:'R$ 120', img:'https://images.unsplash.com/photo-1533777324565-a040eb52f4dd?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2e6a9b'},
  {title:'Microagulhamento', price:'R$ 420', img:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4b4f0f'},
  {title:'Design de Sobrancelhas', price:'R$ 60', img:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3b6e8a'},
  {title:'Massagem Relax', price:'R$ 160', img:'https://images.unsplash.com/photo-1603398938378-1a69d2cb0b29?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1c7e9a'},
  {title:'Limpeza de Pele', price:'R$ 90', img:'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0d5a7b'},
  {title:'Depilação Facial', price:'R$ 50', img:'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b3f1d'},
  {title:'Tratamento Iluminador', price:'R$ 230', img:'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0a2b7f'}
]

const Featured = () => (
  <section className="py-12 bg-gray-50">
    <div className="max-w-6xl mx-auto px-6">
      <h3 className="text-gray-500 uppercase tracking-wider">Destaques</h3>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p, i) => (
          <article key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img src={p.img} alt={p.title} className="w-full h-44 object-cover" />
            <div className="p-4">
              <h4 className="font-medium">{p.title}</h4>
              <div className="text-gray-500 mt-2">{p.price}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
)

const Subscribe = () => (
  <section className="py-12">
    <div className="max-w-6xl mx-auto px-6 bg-primary-600 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div>
        <h3 className="logo-title text-2xl">Assine e ganhe um desconto</h3>
        <p className="text-gray-700 mt-2">Receba novidades e ofertas exclusivas.</p>
      </div>
      <form className="flex gap-3 w-full sm:w-auto" onSubmit={(e)=>{e.preventDefault(); alert('Obrigado!')}}>
        <input required type="email" placeholder="Seu e-mail" className="rounded-full px-4 py-2" />
        <button className="bg-gray-900 text-white px-5 py-2 rounded-full">Inscrever</button>
      </form>
    </div>
  </section>
)

const Testimonials = () => (
  <section className="py-12">
    <div className="max-w-6xl mx-auto px-6">
      <h3 className="text-gray-500 uppercase tracking-wider">Avaliações</h3>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <blockquote className="bg-white p-6 rounded-xl shadow-sm">“Atendimento impecável e resultados excelentes.” <cite className="block mt-3 text-sm text-gray-500">— Maria</cite></blockquote>
        <blockquote className="bg-white p-6 rounded-xl shadow-sm">“Ambiente acolhedor e profissionais muito atenciosos.” <cite className="block mt-3 text-sm text-gray-500">— Ana</cite></blockquote>
        <blockquote className="bg-white p-6 rounded-xl shadow-sm">“Melhorei a autoestima depois do tratamento!” <cite className="block mt-3 text-sm text-gray-500">— Júlia</cite></blockquote>
      </div>
    </div>
  </section>
)

const Instagram = () => (
  <section className="py-12 bg-white">
    <div className="max-w-6xl mx-auto px-6">
      <h3 className="text-gray-500 uppercase tracking-wider">Stay In Touch</h3>
      <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-4">
        {Array.from({length:6}).map((_,i)=> (
          <img key={i} src={`https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=${i}`} alt={`insta-${i}`} className="w-full h-28 object-cover rounded-md" />
        ))}
      </div>
    </div>
  </section>
)

const Footer = () => (
  <footer className="border-t border-gray-100">
    <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-500">© Studio Leiliane Martins Estética — Todos os direitos reservados.</div>
  </footer>
)

export default function App(){
  return (
    <div className="min-h-screen font-sans bg-white text-gray-900">
      <Header />
      <main>
        <Hero />
        <Categories />
        <Featured />
        <Subscribe />
        <Testimonials />
        <Instagram />
      </main>
      <Footer />
    </div>
  )
}
