// src/admin/AdminStoreManagement.jsx
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../styles/AdminStoreManagement.css";
import axiosClient from "../utils/axiosClient";

const AdminStoreManagement = () => {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "", image: "", category: ""
  });
  const [editingId, setEditingId] = useState(null);

  const loadAll = async () => {
    const [p, c] = await Promise.all([
      axiosClient.get("/store/products", { params: { limit: 100 } }),
      axiosClient.get("/store/categories"),
    ]);
    setProducts(p.data.items || []);
    setCats(c.data || []);
  };

  useEffect(() => { loadAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) || 0 };
    if (editingId) {
      await axiosClient.put(`/store/products/${editingId}`, payload);
    } else {
      await axiosClient.post("/store/products", payload);
    }
    setForm({ name: "", description: "", price: "", stock: "", image: "", category: "" });
    setEditingId(null);
    loadAll();
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name, description: p.description, price: p.price, stock: p.stock,
      image: p.image, category: p?.category?._id || ""
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await axiosClient.delete(`/store/products/${id}`);
    loadAll();
  };

  return (
    <div className="admin-store-container">
      <h2>🛒 Store Management</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <input name="name" placeholder="Product Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={(e)=>setForm({...form, image: e.target.value})} required />
        <select value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})}>
          <option value="">Select Category</option>
          {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input name="description" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} required />
        <input type="number" name="price" placeholder="Price (₹)" value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} required />
        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={(e)=>setForm({...form, stock: e.target.value})} />
        <button type="submit" className="add-btn">
          {editingId ? "Update Product" : "Add Product"} <FaPlus />
        </button>
      </form>

      <div className="product-list">
        {products.length === 0 ? (
          <p className="no-products">No products.</p>
        ) : (
          products.map((p) => (
            <div key={p._id} className="product-card">
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p className="muted">{p?.category?.name || "Uncategorized"}</p>
              <p>{p.description}</p>
              <p className="price">₹{p.price}</p>
              <div className="actions">
                <button className="edit-btn" onClick={() => handleEdit(p)}><FaEdit /></button>
                <button className="delete-btn" onClick={() => handleDelete(p._id)}><FaTrash /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStoreManagement;
