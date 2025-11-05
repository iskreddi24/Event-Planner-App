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

  // Simulated fetch (replace with API later)
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
    setProducts(storedProducts);
  }, []);

  // Save to local storage (temporary)
  useEffect(() => {
    localStorage.setItem("adminProducts", JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      alert("Please fill in product name and price!");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...products];
      updated[editingIndex] = formData;
      setProducts(updated);
      setEditingIndex(null);
    } else {
      setProducts([...products, formData]);
    }

    setFormData({ name: "", category: "", price: "", stock: "", image: "" });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(products[index]);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="product-form-container">
      <h3>{editingIndex !== null ? "Edit Product" : "Add New Product"}</h3>

      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />
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
                <p>Category: {p.category}</p>
                <p>Price: ₹{p.price}</p>
                <p>Stock: {p.stock}</p>
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
