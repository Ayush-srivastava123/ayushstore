import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './admin.css';

const initial = [
  { id: 1, name: 'Digital Thermometer', category: 'Health Devices', price: 249, stock: 42, sku: 'AYS-TH-001' },
  { id: 2, name: 'Vitamin C Tablets', category: 'Wellness', price: 199, stock: 18, sku: 'AYS-VT-002' },
  { id: 3, name: 'First Aid Kit', category: 'First Aid', price: 499, stock: 7, sku: 'AYS-FA-003' },
  { id: 4, name: 'Hand Sanitizer', category: 'Personal Care', price: 129, stock: 3, sku: 'AYS-HS-004' }
];

function Admin() {
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Wellness', price: '', stock: '', sku: '' });
  const filtered = useMemo(() => items.filter(x => `${x.name} ${x.category} ${x.sku}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const low = items.filter(x => x.stock < 10).length;
  const value = items.reduce((a, x) => a + x.price * x.stock, 0);

  function addProduct(e) {
    e.preventDefault();
    setItems([...items, { ...form, id: Date.now(), price: Number(form.price), stock: Number(form.stock) }]);
    setForm({ name: '', category: 'Wellness', price: '', stock: '', sku: '' }); setShowForm(false);
  }
  function remove(id) { setItems(items.filter(x => x.id !== id)); }
  function adjust(id, amount) { setItems(items.map(x => x.id === id ? { ...x, stock: Math.max(0, x.stock + amount) } : x)); }

  return <div className="admin-app">
    <aside><div className="admin-brand">🩺 AyushStore</div><div className="admin-label">ADMIN PORTAL</div><a className="active">📊 Dashboard</a><a>📦 Inventory</a><a>🧾 Orders</a><a>👥 Customers</a><a>⚙️ Settings</a><div className="admin-user"><b>Store Admin</b><span>Inventory Manager</span></div></aside>
    <section className="admin-main">
      <header><div><p className="eyebrow">ADMIN PORTAL</p><h1>Inventory Dashboard</h1><p className="muted">Manage your products and keep stock levels healthy.</p></div><button className="primary" onClick={() => setShowForm(true)}>＋ Add Product</button></header>
      <div className="stats"><div><span>Products</span><strong>{items.length}</strong><small>Active catalog items</small></div><div><span>Inventory Value</span><strong>₹{value.toLocaleString()}</strong><small>Current stock value</small></div><div className={low ? 'warning' : ''}><span>Low Stock</span><strong>{low}</strong><small>Items below 10 units</small></div><div><span>Orders Today</span><strong>12</strong><small>+18% from yesterday</small></div></div>
      <div className="toolbar"><input placeholder="Search products, SKU or category..." value={query} onChange={e => setQuery(e.target.value)} /><select><option>All categories</option><option>Wellness</option><option>First Aid</option><option>Personal Care</option><option>Health Devices</option></select></div>
      <div className="panel"><div className="panel-head"><div><h2>Inventory</h2><span>{filtered.length} products</span></div><button className="outline">Export CSV</button></div><div className="table-wrap"><table><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filtered.map(p => <tr key={p.id}><td><b>{p.name}</b></td><td>{p.sku}</td><td>{p.category}</td><td>₹{p.price}</td><td><div className="stock"><button onClick={() => adjust(p.id, -1)}>−</button><b>{p.stock}</b><button onClick={() => adjust(p.id, 1)}>＋</button></div></td><td><span className={p.stock < 10 ? 'pill low' : 'pill good'}>{p.stock < 10 ? 'Low stock' : 'In stock'}</span></td><td><button className="delete" onClick={() => remove(p.id)}>Delete</button></td></tr>)}</tbody></table></div></div>
    </section>
    {showForm && <div className="modal-bg"><form className="modal" onSubmit={addProduct}><button type="button" className="close" onClick={() => setShowForm(false)}>×</button><h2>Add Product</h2><p className="muted">Add a new item to your inventory.</p><label>Product name<input required value={form.name} onChange={e => setForm({...form,name:e.target.value})}/></label><label>Category<select value={form.category} onChange={e => setForm({...form,category:e.target.value})}><option>Wellness</option><option>First Aid</option><option>Personal Care</option><option>Health Devices</option></select></label><div className="two"><label>Price<input required type="number" min="0" value={form.price} onChange={e => setForm({...form,price:e.target.value})}/></label><label>Stock<input required type="number" min="0" value={form.stock} onChange={e => setForm({...form,stock:e.target.value})}/></label></div><label>SKU<input required value={form.sku} onChange={e => setForm({...form,sku:e.target.value})}/></label><button className="primary full">Add to Inventory</button></form></div>}
  </div>
}
createRoot(document.getElementById('root')).render(<Admin />);
