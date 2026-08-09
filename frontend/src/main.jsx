import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import './admin.css';

const seedProducts = [
  { id: 1, name: 'Digital Thermometer', price: 249, oldPrice: 299, category: 'Health Devices', icon: '🌡️', rating: 4.8, tag: 'Best Seller', stock: 24, image: '' },
  { id: 2, name: 'Vitamin C Tablets', price: 199, oldPrice: 249, category: 'Wellness', icon: '💊', rating: 4.7, tag: 'Popular', stock: 45, image: '' },
  { id: 3, name: 'First Aid Kit', price: 499, oldPrice: 599, category: 'First Aid', icon: '🩹', rating: 4.9, tag: 'Essential', stock: 18, image: '' },
  { id: 4, name: 'Hand Sanitizer', price: 129, oldPrice: 159, category: 'Personal Care', icon: '🧴', rating: 4.6, tag: 'Value Pack', stock: 70, image: '' },
  { id: 5, name: 'Pulse Oximeter', price: 899, oldPrice: 1099, category: 'Health Devices', icon: '🫀', rating: 4.8, tag: 'Trending', stock: 12, image: '' },
  { id: 6, name: 'Digital BP Monitor', price: 1499, oldPrice: 1799, category: 'Health Devices', icon: '🩺', rating: 4.9, tag: 'Top Rated', stock: 9, image: '' },
  { id: 7, name: 'Moisturizing Lotion', price: 279, oldPrice: 329, category: 'Personal Care', icon: '🧴', rating: 4.5, tag: 'New', stock: 32, image: '' },
  { id: 8, name: 'Electrolyte Powder', price: 149, oldPrice: 179, category: 'Wellness', icon: '🥤', rating: 4.7, tag: 'Everyday', stock: 55, image: '' }
];
const categories = ['All', 'Health Devices', 'Wellness', 'First Aid', 'Personal Care'];
const PRODUCTS_KEY = 'ayushstore_products_v2';
const PRESCRIPTIONS_KEY = 'ayushstore_prescriptions_v1';
const ORDERS_KEY = 'ayushstore_orders_v1';
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function ProductVisual({ product }) { return <div className="product-visual">{product.image ? <img className="product-photo" src={product.image} alt={product.name} /> : <span className="product-icon">{product.icon}</span>}<span className="tag">{product.tag}</span><button className="heart" type="button">♡</button></div>; }

function App() {
  const [products, setProducts] = useState(() => read(PRODUCTS_KEY, seedProducts));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [paid, setPaid] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [admin, setAdmin] = useState(window.location.hash === '#admin');
  const [customer, setCustomer] = useState({ name:'', email:'', address:'', city:'', pincode:'', card:'', expiry:'', cvv:'', cardName:'' });
  const [orderResult, setOrderResult] = useState(null);
  useEffect(() => save(PRODUCTS_KEY, products), [products]);
  useEffect(() => { const onHash = () => setAdmin(window.location.hash === '#admin'); window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash); }, []);
  const filtered = useMemo(() => products.filter(p => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase()) && p.stock > 0), [products, category, query]);
  const addToCart = p => setCart(items => { const found = items.find(i => i.id === p.id); return found ? items.map(i => i.id === p.id ? { ...i, qty: Math.min(i.qty + 1, p.stock) } : i) : [...items, { ...p, qty: 1 }]; });
  const changeQty = (id, amount) => setCart(items => items.map(i => i.id === id ? { ...i, qty: i.qty + amount } : i).filter(i => i.qty > 0));
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const subtotal = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const delivery = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + delivery;
  const update = e => setCustomer({ ...customer, [e.target.name]: e.target.value });
  const startCheckout = () => { setCartOpen(false); setCheckout(true); window.scrollTo(0,0); };
  const finishOrder = (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setProcessing(true);
    setTimeout(() => {
      const prescriptions = read(PRESCRIPTIONS_KEY, []);
      const pendingRx = prescriptions.find(r => r.orderId === null || r.orderId === undefined);
      const order = {
        id: `AY-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toLocaleString(),
        customer: { name: customer.name, email: customer.email, address: customer.address, city: customer.city, pincode: customer.pincode },
        items: cart.map(i => ({ id:i.id, name:i.name, price:i.price, qty:i.qty, image:i.image, icon:i.icon })),
        subtotal, delivery, total,
        paymentStatus: 'Paid (Demo)',
        orderStatus: 'New',
        prescriptionId: pendingRx?.id || null
      };
      if (pendingRx) save(PRESCRIPTIONS_KEY, prescriptions.map(r => r.id === pendingRx.id ? { ...r, orderId: order.id } : r));
      const orders = read(ORDERS_KEY, []);
      save(ORDERS_KEY, [order, ...orders]);
      setOrderResult(order);
      setProcessing(false);
      setPaid(true);
      setCart([]);
    }, 1200);
  };
  if (admin) return <Admin products={products} setProducts={setProducts} />;
  if (checkout) return <Checkout customer={customer} update={update} cart={cart} subtotal={subtotal} delivery={delivery} total={total} paid={paid} processing={processing} pay={finishOrder} order={orderResult} onBack={() => { setCheckout(false); setPaid(false); setOrderResult(null); }} />;

  return <div className="app">
    <div className="topbar">Free delivery on orders above ₹499 <span>•</span> Secure &amp; reliable healthcare shopping <a href="#admin">Admin Portal →</a></div>
    <header className="header"><a className="brand" href="#home"><span className="brand-mark">✚</span><span>Ayush<span>Store</span></span></a><div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search medicines, wellness & healthcare..." /></div><nav><a href="#products">Shop</a><a href="#why-us">Why us</a><a href="#about">About</a><button className="cart-btn" onClick={()=>setCartOpen(true)}>🛒 Cart {cartCount>0&&<b>{cartCount}</b>}</button></nav></header>
    <main id="home">
      <section className="hero"><div className="hero-copy"><div className="eyebrow">YOUR HEALTH, OUR PRIORITY</div><h1>Healthcare made <em>simple.</em></h1><p>Discover trusted wellness, personal care and everyday healthcare essentials, delivered right to your door.</p><div className="hero-actions"><a className="primary" href="#products">Explore products <span>→</span></a><a className="secondary" href="#why-us">Why AyushStore?</a></div><div className="trust"><span><strong>10,000+</strong> happy shoppers</span><span className="stars">★★★★★</span></div></div><div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="medicine-card"><span className="mini-badge">POPULAR</span><div className="medicine-icon">🩺</div><strong>Care at your fingertips</strong><small>Quality essentials, one place.</small></div></div></section>
      <section className="benefits" id="why-us"><div><span>✓</span><strong>Quality first</strong><small>Carefully selected essentials</small></div><div><span>🚚</span><strong>Quick delivery</strong><small>Convenient doorstep delivery</small></div><div><span>🔒</span><strong>Secure checkout</strong><small>Safe &amp; simple prototype checkout</small></div><div><span>💬</span><strong>Friendly support</strong><small>Prescription review available</small></div></section>
      <section className="products" id="products"><div className="section-head"><div><div className="eyebrow">SHOP ESSENTIALS</div><h2>Popular picks for you</h2><p>Products and inventory are managed from the admin portal.</p></div></div><div className="category-row">{categories.map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div><div className="grid">{filtered.map(p=><article className="product" key={p.id}><ProductVisual product={p}/><div className="product-info"><small>{p.category}</small><h3>{p.name}</h3><div className="rating">★ {p.rating} <span>(120+)</span></div><div className="price"><strong>₹{p.price}</strong><del>₹{p.oldPrice}</del></div><button className="add" onClick={()=>addToCart(p)}>Add to cart <span>+</span></button></div></article>)}</div>{filtered.length===0&&<div className="empty">No products in stock match your search.</div>}</section>
      <section className="promo"><div><div className="eyebrow">PRESCRIPTION SUPPORT</div><h2>Have a prescription?</h2><p>Upload it during checkout so the store team can review it alongside your demo order.</p><a className="primary" href="#products">Shop essentials →</a></div><div className="kit">📄　💊　🩺</div></section>
      <section className="about" id="about"><div className="about-icon">✚</div><div><div className="eyebrow">ABOUT AYUSHSTORE</div><h2>Good care starts with easy access.</h2><p>AyushStore is a prototype healthcare storefront with inventory, orders and prescription-review workflows.</p></div></section>
    </main>
    <footer><div className="footer-main"><div><a className="brand" href="#home"><span className="brand-mark">✚</span><span>Ayush<span>Store</span></span></a><p>Prototype healthcare shopping for everyday life.</p></div><div><strong>Shop</strong><a href="#products">Health Devices</a><a href="#products">Wellness</a><a href="#products">Personal Care</a></div><div><strong>Management</strong><a href="#admin">Admin Portal</a><a href="#products">Products</a></div></div><div className="footer-bottom">© 2026 AyushStore. Prototype only — not a licensed pharmacy.</div></footer>
    {cartOpen&&<div className="overlay" onClick={()=>setCartOpen(false)}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}><div className="cart-head"><div><div className="eyebrow">YOUR BAG</div><h2>Shopping cart</h2></div><button onClick={()=>setCartOpen(false)}>×</button></div>{cart.length===0?<div className="cart-empty"><div>🛒</div><h3>Your cart is empty</h3><p>Add a product to begin.</p></div>:<><div className="cart-items">{cart.map(i=><div className="cart-item" key={i.id}><div className="cart-item-icon">{i.image?<img src={i.image} alt=""/>:i.icon}</div><div className="cart-item-info"><strong>{i.name}</strong><small>₹{i.price}</small><div className="qty"><button onClick={()=>changeQty(i.id,-1)}>−</button><span>{i.qty}</span><button onClick={()=>changeQty(i.id,1)}>+</button></div></div></div>)}</div><div className="cart-total"><span>Subtotal</span><strong>₹{subtotal}</strong></div><button className="checkout" onClick={startCheckout}>Proceed to checkout →</button><small className="note">Prototype checkout only — no real payment is processed.</small></>}</aside></div>}
  </div>;
}

function PrescriptionUpload({ onUploaded }) {
  const [file,setFile]=useState(null), [preview,setPreview]=useState('');
  const choose=e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>2*1024*1024){alert('Please choose a file under 2 MB for this prototype.');return;}setFile(f);const r=new FileReader();r.onload=()=>setPreview(r.result);r.readAsDataURL(f);};
  const upload=()=>{if(!file)return;const item={id:`RX-${Date.now()}`,name:file.name,type:file.type,size:file.size,data:preview,status:'Pending review',uploadedAt:new Date().toLocaleString(),orderId:null};const list=read(PRESCRIPTIONS_KEY,[]);save(PRESCRIPTIONS_KEY,[item,...list]);onUploaded(item);};
  return <div className="prescription-box"><div className="rx-title">📄 <div><strong>Upload prescription</strong><small>JPG, PNG or PDF · max 2 MB</small></div></div><label className="file-picker"><input type="file" accept="image/*,.pdf" onChange={choose}/>{file?`Selected: ${file.name}`:'Choose prescription file'}</label>{preview&&file?.type.startsWith('image/')&&<img className="rx-preview" src={preview} alt="Prescription preview"/>}<button type="button" className="upload-rx" disabled={!file} onClick={upload}>{file?'Upload for review':'Select a file first'}</button><small className="rx-note">Prototype only. Do not upload real patient information to this demo.</small></div>;
}

function Checkout({customer,update,cart,subtotal,delivery,total,paid,processing,pay,order,onBack}) {
  const [rx,setRx]=useState(null);
  return <div className="checkout-page"><div className="checkout-top"><button className="back" onClick={onBack}>← Back to store</button><a className="brand" href="#"><span className="brand-mark">✚</span><span>Ayush<span>Store</span></span></a><div className="demo-pill">DEMO CHECKOUT · NO REAL CHARGE</div></div>{paid?<section className="success"><div className="success-icon">✓</div><div className="eyebrow">PAYMENT COMPLETE</div><h1>Order placed successfully!</h1><p>Your prototype purchase was simulated. No money was charged. The order is now visible in the Admin Portal.</p><div className="receipt"><div><span>Order ID</span><strong>{order?.id}</strong></div><div><span>Payment status</span><strong className="paid">● Paid (Demo)</strong></div><div><span>Order status</span><strong>New</strong></div><div><span>Prescription</span><strong>{order?.prescriptionId?'Uploaded · Pending review':'Not uploaded'}</strong></div><div><span>Amount</span><strong>₹{order?.total}</strong></div></div><button className="primary" onClick={onBack}>Continue shopping →</button></section>:<><div className="checkout-notice">🧪 <div><strong>This is a prototype transaction</strong><span>Use fictional details only. Orders and prescription metadata are saved locally in this browser.</span></div></div><div className="checkout-layout"><form className="checkout-form" onSubmit={pay}><div className="step"><span>1</span><div><h2>Contact &amp; delivery</h2><p>Where should we send your demo order?</p></div></div><div className="fields"><label>Full name<input required name="name" value={customer.name} onChange={update} placeholder="Demo Customer"/></label><label>Email<input required type="email" name="email" value={customer.email} onChange={update} placeholder="you@example.com"/></label><label className="wide">Address<input required name="address" value={customer.address} onChange={update} placeholder="123 Demo Street"/></label><label>City<input required name="city" value={customer.city} onChange={update} placeholder="New Delhi"/></label><label>PIN code<input required pattern="[0-9]{6}" maxLength="6" name="pincode" value={customer.pincode} onChange={update} placeholder="110001"/></label></div><div className="step payment-step"><span>2</span><div><h2>Prescription</h2><p>Optional prototype upload for admin review</p></div></div><PrescriptionUpload onUploaded={setRx}/><div className="step payment-step"><span>3</span><div><h2>Payment</h2><p>Fictional card details for the prototype</p></div></div><div className="test-card">🧪 Demo card: <strong>4242 4242 4242 4242</strong> · any future expiry · any 3-digit CVV</div><div className="fields"><label className="wide">Name on card<input required name="cardName" value={customer.cardName} onChange={update} placeholder="Demo Customer"/></label><label className="wide">Card number<input required inputMode="numeric" maxLength="19" name="card" value={customer.card} onChange={update} placeholder="4242 4242 4242 4242"/></label><label>Expiry<input required maxLength="5" name="expiry" value={customer.expiry} onChange={update} placeholder="12/30"/></label><label>CVV<input required maxLength="3" name="cvv" value={customer.cvv} onChange={update} placeholder="123"/></label></div><label className="checkbox"><input type="checkbox" required/> I understand this is a simulated prototype payment.</label><button className="pay-button" disabled={processing}>{processing?'Authorizing demo payment…':`Pay ₹${total} (Demo)`}</button></form><aside className="order-summary"><div className="summary-head"><h2>Your order</h2><span>{cart.reduce((s,i)=>s+i.qty,0)} items</span></div>{cart.map(i=><div className="summary-item" key={i.id}><span className="summary-icon">{i.image?<img src={i.image} alt=""/>:i.icon}</span><div><strong>{i.name}</strong><small>Qty {i.qty}</small></div><b>₹{i.price*i.qty}</b></div>)}<div className="summary-line"><span>Subtotal</span><span>₹{subtotal}</span></div><div className="summary-line"><span>Delivery</span><span>{delivery?'₹'+delivery:'Free'}</span></div><div className="summary-total"><span>Total</span><strong>₹{total}</strong></div><div className="secure-note">🔒 Prototype only · No card or prescription data is sent to a payment provider.</div></aside></div></>}</div>;
}

function Admin({products,setProducts}) {
  const [tab,setTab]=useState('inventory');
  const [editing,setEditing]=useState(null);
  const [draft,setDraft]=useState(null);
  const [rxs,setRxs]=useState(()=>read(PRESCRIPTIONS_KEY,[]));
  const [orders,setOrders]=useState(()=>read(ORDERS_KEY,[]));
  const edit=p=>{setEditing(p.id);setDraft({...p});};
  const image=e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>2*1024*1024){alert('Image must be under 2 MB.');return;}const r=new FileReader();r.onload=()=>setDraft({...draft,image:r.result});r.readAsDataURL(f);};
  const saveProduct=()=>{setProducts(ps=>ps.map(p=>p.id===draft.id?{...draft,price:Number(draft.price),oldPrice:Number(draft.oldPrice),stock:Number(draft.stock)}:p));setEditing(null);setDraft(null);};
  const add=()=>{const p={id:Date.now(),name:'New Product',price:0,oldPrice:0,category:'Wellness',icon:'💊',rating:5,tag:'New',stock:0,image:''};setProducts(ps=>[p,...ps]);edit(p);};
  const remove=id=>{if(confirm('Remove this product from inventory?'))setProducts(ps=>ps.filter(p=>p.id!==id));};
  const status=(id,value)=>{const list=rxs.map(r=>r.id===id?{...r,status:value}:r);setRxs(list);save(PRESCRIPTIONS_KEY,list);};
  const orderStatus=(id,value)=>{const list=orders.map(o=>o.id===id?{...o,orderStatus:value}:o);setOrders(list);save(ORDERS_KEY,list);};
  const refresh=()=>{setOrders(read(ORDERS_KEY,[]));setRxs(read(PRESCRIPTIONS_KEY,[]));};
  return <div className="admin-page"><header className="admin-header"><a className="brand" href="#home"><span className="brand-mark">✚</span><span>Ayush<span>Store</span></span></a><div><span className="admin-badge">ADMIN PORTAL</span><button className="store-link" onClick={refresh}>↻ Refresh</button><a className="store-link" href="#home">← View store</a></div></header><div className="admin-shell"><aside className="admin-nav"><button className={tab==='inventory'?'selected':''} onClick={()=>setTab('inventory')}>📦 Inventory</button><button className={tab==='orders'?'selected':''} onClick={()=>setTab('orders')}>🛒 Orders <b>{orders.filter(o=>o.orderStatus==='New').length}</b></button><button className={tab==='prescriptions'?'selected':''} onClick={()=>setTab('prescriptions')}>📄 Prescriptions <b>{rxs.filter(r=>r.status==='Pending review').length}</b></button><div className="admin-tip">Prototype admin tools<br/><small>Orders, inventory and prescriptions are saved in this browser.</small></div></aside><main className="admin-main">{tab==='inventory'?<Inventory products={products} editing={editing} draft={draft} setDraft={setDraft} edit={edit} image={image} saveProduct={saveProduct} add={add} remove={remove}/>:tab==='orders'?<OrderAdmin orders={orders} orderStatus={orderStatus}/>:<PrescriptionAdmin rxs={rxs} status={status}/>}</main></div></div>;
}

function Inventory({products,editing,draft,setDraft,edit,image,saveProduct,add,remove}) { return <><div className="admin-title"><div><div className="eyebrow">STORE MANAGEMENT</div><h1>Inventory</h1><p>Add products, update prices and stock, and upload product images.</p></div><button className="primary" onClick={add}>+ Add product</button></div><div className="inventory-stats"><div><strong>{products.length}</strong><span>Total products</span></div><div><strong>{products.reduce((s,p)=>s+Number(p.stock||0),0)}</strong><span>Units in stock</span></div><div><strong>{read(ORDERS_KEY,[]).length}</strong><span>Total orders</span></div></div><div className="inventory-table">{products.map(p=><div className="inventory-row" key={p.id}>{editing===p.id?<div className="edit-panel"><div className="edit-image">{draft.image?<img src={draft.image} alt=""/>:<span>{draft.icon}</span>}<label>Upload image<input type="file" accept="image/*" onChange={image}/></label></div><div className="edit-fields"><label>Product name<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label><label>Category<select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></label><label>Price (₹)<input type="number" value={draft.price} onChange={e=>setDraft({...draft,price:e.target.value})}/></label><label>Old price (₹)<input type="number" value={draft.oldPrice} onChange={e=>setDraft({...draft,oldPrice:e.target.value})}/></label><label>Stock<input type="number" value={draft.stock} onChange={e=>setDraft({...draft,stock:e.target.value})}/></label><label>Tag<input value={draft.tag} onChange={e=>setDraft({...draft,tag:e.target.value})}/></label><div className="edit-actions"><button className="primary" onClick={saveProduct}>Save changes</button><button className="secondary" onClick={()=>{setEditing(null);setDraft(null)}}>Cancel</button></div></div></div>:<><div className="inv-product">{p.image?<img src={p.image} alt=""/>:<span>{p.icon}</span>}<div><strong>{p.name}</strong><small>{p.category} · {p.tag}</small></div></div><div className="inv-price">₹{p.price}<small>₹{p.oldPrice}</small></div><div className={p.stock<10?'stock low':'stock'}>{p.stock} units</div><div className="row-actions"><button onClick={()=>edit(p)}>Edit</button><button className="danger" onClick={()=>remove(p.id)}>Delete</button></div></>}</div>)}</div></>; }

function OrderAdmin({orders,orderStatus}) { return <><div className="admin-title"><div><div className="eyebrow">STORE MANAGEMENT</div><h1>Orders</h1><p>Every completed prototype purchase appears here immediately after payment.</p></div></div>{orders.length===0?<div className="admin-empty"><div>🛒</div><h2>No orders yet</h2><p>Place a demo order from the storefront, then click Refresh in this portal.</p></div>:<div className="orders-list">{orders.map(o=><article className="order-card" key={o.id}><div className="order-card-head"><div><strong>{o.id}</strong><small>{o.createdAt}</small></div><span className={`order-status ${o.orderStatus?.toLowerCase().replace(/\s/g,'-')}`}>{o.orderStatus}</span></div><div className="order-customer"><strong>{o.customer.name}</strong><span>{o.customer.email}</span><span>{o.customer.city} · {o.customer.pincode}</span></div><div className="order-items">{o.items.map(i=><div key={i.id}><span>{i.image?<img src={i.image} alt=""/>:i.icon}</span><div><strong>{i.name}</strong><small>Qty {i.qty} × ₹{i.price}</small></div><b>₹{i.price*i.qty}</b></div>)}</div><div className="order-footer"><div><span>Payment</span><strong className="paid">● {o.paymentStatus}</strong>{o.prescriptionId&&<small>📄 Prescription attached</small>}</div><div><span>Total</span><strong>₹{o.total}</strong></div><label>Update status<select value={o.orderStatus} onChange={e=>orderStatus(o.id,e.target.value)}><option>New</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></label></div></article>)}</div>}</>; }

function PrescriptionAdmin({rxs,status}) { return <><div className="admin-title"><div><div className="eyebrow">PHARMACY WORKFLOW</div><h1>Prescription review</h1><p>Review uploaded prototype prescriptions and mark them as approved or rejected.</p></div></div>{rxs.length===0?<div className="admin-empty"><div>📄</div><h2>No prescriptions yet</h2><p>Uploaded prescriptions from checkout will appear here.</p></div>:<div className="rx-list">{rxs.map(r=><article className="rx-admin-card" key={r.id}><div className="rx-file">{r.type?.startsWith('image/')?<img src={r.data} alt="Prescription upload"/>:<div className="pdf-icon">PDF</div>}</div><div className="rx-admin-info"><div><span className="rx-id">{r.id}</span><span className={`rx-status ${r.status==='Approved'?'approved':r.status==='Rejected'?'rejected':''}`}>{r.status}</span></div><h3>{r.name}</h3><small>Uploaded {r.uploadedAt} · {(r.size/1024).toFixed(0)} KB {r.orderId&&`· Order ${r.orderId}`}</small><div className="rx-actions"><a className="secondary" href={r.data} target="_blank" rel="noreferrer">View file</a><button className="approve" onClick={()=>status(r.id,'Approved')}>✓ Approve</button><button className="reject" onClick={()=>status(r.id,'Rejected')}>Reject</button></div></div></article>)}</div>}</>; }

createRoot(document.getElementById('root')).render(<App />);
