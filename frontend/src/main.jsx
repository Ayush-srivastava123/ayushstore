import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const products = [
  { id: 1, name: 'Digital Thermometer', price: 249, oldPrice: 299, category: 'Health Devices', icon: '🌡️', rating: 4.8, tag: 'Best Seller' },
  { id: 2, name: 'Vitamin C Tablets', price: 199, oldPrice: 249, category: 'Wellness', icon: '💊', rating: 4.7, tag: 'Popular' },
  { id: 3, name: 'First Aid Kit', price: 499, oldPrice: 599, category: 'First Aid', icon: '🩹', rating: 4.9, tag: 'Essential' },
  { id: 4, name: 'Hand Sanitizer', price: 129, oldPrice: 159, category: 'Personal Care', icon: '🧴', rating: 4.6, tag: 'Value Pack' },
  { id: 5, name: 'Pulse Oximeter', price: 899, oldPrice: 1099, category: 'Health Devices', icon: '🫀', rating: 4.8, tag: 'Trending' },
  { id: 6, name: 'Digital BP Monitor', price: 1499, oldPrice: 1799, category: 'Health Devices', icon: '🩺', rating: 4.9, tag: 'Top Rated' },
  { id: 7, name: 'Moisturizing Lotion', price: 279, oldPrice: 329, category: 'Personal Care', icon: '🧴', rating: 4.5, tag: 'New' },
  { id: 8, name: 'Electrolyte Powder', price: 149, oldPrice: 179, category: 'Wellness', icon: '🥤', rating: 4.7, tag: 'Everyday' }
];

const categories = ['All', 'Health Devices', 'Wellness', 'First Aid', 'Personal Care'];

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => products.filter(p =>
    (category === 'All' || p.category === category) &&
    p.name.toLowerCase().includes(query.toLowerCase())
  ), [query, category]);

  const addToCart = (product) => setCart(items => {
    const found = items.find(item => item.id === product.id);
    return found ? items.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...items, { ...product, qty: 1 }];
  });
  const changeQty = (id, amount) => setCart(items => items.map(item => item.id === id ? { ...item, qty: item.qty + amount } : item).filter(item => item.qty > 0));
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="app">
      <div className="topbar">Free delivery on orders above ₹499 <span>•</span> Secure &amp; reliable healthcare shopping</div>
      <header className="header">
        <a className="brand" href="#home"><span className="brand-mark">✚</span><span>Ayush<span>Store</span></span></a>
        <div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search medicines, wellness & healthcare..." /><kbd>⌘ K</kbd></div>
        <nav><a href="#products">Shop</a><a href="#why-us">Why us</a><a href="#about">About</a><button className="cart-btn" onClick={() => setCartOpen(true)}>🛒 <span>Cart</span>{cartCount > 0 && <b>{cartCount}</b>}</button></nav>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy"><div className="eyebrow">YOUR HEALTH, OUR PRIORITY</div><h1>Healthcare made <em>simple.</em></h1><p>Discover trusted wellness, personal care and everyday healthcare essentials, delivered right to your door.</p><div className="hero-actions"><a className="primary" href="#products">Explore products <span>→</span></a><a className="secondary" href="#why-us">Why AyushStore?</a></div><div className="trust"><div className="avatars">👩🏻 👨🏽 👩🏾</div><span><strong>10,000+</strong> happy shoppers</span><span className="stars">★★★★★</span></div></div>
          <div className="hero-art"><div className="orb orb-one"></div><div className="orb orb-two"></div><div className="medicine-card"><span className="mini-badge">POPULAR</span><div className="medicine-icon">🩺</div><strong>Care at your fingertips</strong><small>Quality essentials, one place.</small></div><div className="float-card delivery">🚚 <span><strong>Fast delivery</strong><small>Across your city</small></span></div><div className="float-card secure">✓ <span><strong>Secure shopping</strong><small>Safe &amp; simple checkout</small></span></div></div>
        </section>

        <section className="benefits" id="why-us"><div><span>✓</span><strong>Quality first</strong><small>Carefully selected essentials</small></div><div><span>🚚</span><strong>Quick delivery</strong><small>Convenient doorstep delivery</small></div><div><span>🔒</span><strong>Secure checkout</strong><small>Your data stays protected</small></div><div><span>💬</span><strong>Friendly support</strong><small>We are here when you need us</small></div></section>

        <section className="products" id="products"><div className="section-head"><div><div className="eyebrow">SHOP ESSENTIALS</div><h2>Popular picks for you</h2><p>Everyday healthcare products, selected for convenience.</p></div><a href="#products">View all →</a></div><div className="category-row">{categories.map(c => <button className={category === c ? 'active' : ''} onClick={() => setCategory(c)} key={c}>{c}</button>)}</div><div className="grid">{filtered.map(p => <article className="product" key={p.id}><div className="product-visual"><span className="tag">{p.tag}</span><span className="product-icon">{p.icon}</span><button className="heart" aria-label="Save">♡</button></div><div className="product-info"><small>{p.category}</small><h3>{p.name}</h3><div className="rating">★ {p.rating} <span>(120+)</span></div><div className="price"><strong>₹{p.price}</strong><del>₹{p.oldPrice}</del></div><button className="add" onClick={() => addToCart(p)}>Add to cart <span>+</span></button></div></article>)}</div>{filtered.length === 0 && <div className="empty">No products found. Try another search.</div>}</section>

        <section className="promo"><div><div className="eyebrow">STAY READY</div><h2>Build your everyday care kit.</h2><p>From first aid to personal care, keep the essentials close when you need them.</p><a className="primary" href="#products">Shop essentials →</a></div><div className="kit">🩹　🌡️　🧴　💊</div></section>

        <section className="about" id="about"><div className="about-icon">✚</div><div><div className="eyebrow">ABOUT AYUSHSTORE</div><h2>Good care starts with easy access.</h2><p>AyushStore is designed to make everyday healthcare shopping clearer, faster and more convenient. Browse essentials, compare options and order with confidence.</p></div></section>
      </main>

      <footer><div className="footer-main"><div><a className="brand" href="#home"><span className="brand-mark">✚</span><span>Ayush<span>Store</span></span></a><p>Simple healthcare shopping for everyday life.</p></div><div><strong>Shop</strong><a href="#products">Health Devices</a><a href="#products">Wellness</a><a href="#products">Personal Care</a></div><div><strong>Help</strong><a href="#about">About us</a><a href="#why-us">Why us</a><a href="#products">Contact</a></div></div><div className="footer-bottom">© 2026 AyushStore. Demo e-commerce experience.</div></footer>

      {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={e => e.stopPropagation()}><div className="cart-head"><div><div className="eyebrow">YOUR BAG</div><h2>Shopping cart</h2></div><button onClick={() => setCartOpen(false)}>×</button></div>{cart.length === 0 ? <div className="cart-empty"><div>🛒</div><h3>Your cart is empty</h3><p>Add something you love from our essentials.</p><button className="primary" onClick={() => setCartOpen(false)}>Continue shopping</button></div> : <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><div className="cart-item-icon">{item.icon}</div><div className="cart-item-info"><strong>{item.name}</strong><small>₹{item.price}</small><div className="qty"><button onClick={() => changeQty(item.id, -1)}>−</button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)}>+</button></div></div></div>)}</div><div className="cart-total"><span>Subtotal</span><strong>₹{total}</strong></div><button className="checkout">Proceed to checkout →</button><small className="note">Checkout is a demo. Prescription medicines require appropriate verification and licensing.</small></>}</aside></div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
