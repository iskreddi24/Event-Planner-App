import React, { useState, useEffect } from "react";
import "../styles/ProductForm.css";

const ProductForm = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [toast, setToast] = useState(null);

  // 🪷 Default Wedding Categories
  const defaultCategories = [
    "Bangles",
    "Makeup Kits",
    "Wedding Sarees",
    "Bridal Jewellery",
    "Decor Items",
    "Lighting Accessories",
    "Groom Attire",
    "Photography Gear",
    "Gift Hampers",
    "Puja Essentials",
  ];

  // Load from localStorage
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
    setProducts(storedProducts);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("adminProducts", JSON.stringify(products));
  }, [products]);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      showToast("⚠️ Please fill in product name and price!", "error");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...products];
      updated[editingIndex] = formData;
      setProducts(updated);
      setEditingIndex(null);
      showToast("♻️ Product updated!", "success");
    } else {
      setProducts([...products, formData]);
      showToast("🆕 Product added!", "success");
    }

    setFormData({ name: "", category: "", price: "", stock: "", image: "" });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(products[index]);
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete this product?")) {
      setProducts(products.filter((_, i) => i !== index));
      showToast("🗑️ Product deleted!", "error");
    }
  };

  return (
    <div className="product-form-container">
      {/* Floating Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "25px",
            backgroundColor:
              toast.type === "success"
                ? "#2ecc71"
                : toast.type === "error"
                ? "#e74c3c"
                : "#3498db",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            fontWeight: "600",
            zIndex: 1000,
          }}
        >
          {toast.msg}
        </div>
      )}

      <h3>{editingIndex !== null ? "Edit Product" : "Add New Product"}</h3>

      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {defaultCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={formData.price}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />

        <button type="submit" className="btn-primary">
          {editingIndex !== null ? "Update Product" : "Add Product"}
        </button>
      </form>

      <hr />

      <h4>All Products</h4>
      <div className="product-list">
        {products.length === 0 ? (
          <p className="no-products">No products added yet.</p>
        ) : (
          products.map((p, index) => (
            <div key={index} className="product-item">
              <img src={p.image || "https://via.placeholder.com/80"} alt={p.name} />
              <div>
                <h5>{p.name}</h5>
                <p>
                  <strong>Category:</strong> {p.category || "—"}
                </p>
                <p>💰 ₹{p.price}</p>
                <p>📦 Stock: {p.stock || 0}</p>
              </div>
              <div className="actions">
                <button onClick={() => handleEdit(index)} className="btn-edit">
                  ✏️
                </button>
                <button onClick={() => handleDelete(index)} className="btn-delete">
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductForm;
