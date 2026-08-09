import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const products = [
  { name: 'Digital Thermometer', price: 249, category: 'Health Devices' },
  { name: 'Vitamin C Tablets', price: 199, category: 'Wellness' },
  { name: 'First Aid Kit', price: 499, category: 'First Aid' },
  { name: 'Hand Sanitizer', price: 129, category: 'Personal Care' }
];

function App() {
  return (
    <main>
      <header className="header">
        <div className="brand">🩺 AyushStore</div>
        <nav><a href="#products">Products</a><a href="#about">About</a><button>🛒 Cart</button></nav>
      </header>
      <section className="hero">
        <div><span className="badge">Trusted healthcare shopping</span><h1>Your health, delivered with care.</h1><p>Shop everyday healthcare, wellness and personal-care essentials from one simple online store.</p><a className="cta" href="#products">Shop Products →</a></div>
        <div className="hero-card">💊<strong>Healthcare essentials</strong><span>Simple. Reliable. Convenient.</span></div>
      </section>
      <section id="products" className="products"><h2>Popular Products</h2><div className="grid">{products.map(p => <article className="product" key={p.name}><div className="icon">{p.category === 'Health Devices' ? '🌡️' : p.category === 'First Aid' ? '🩹' : p.category === 'Wellness' ? '💊' : '🧴'}</div><small>{p.category}</small><h3>{p.name}</h3><b>₹{p.price}</b><button className="add">Add to cart</button></article>)}</div></section>
      <footer id="about">© 2026 AyushStore · Healthcare shopping demo</footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
