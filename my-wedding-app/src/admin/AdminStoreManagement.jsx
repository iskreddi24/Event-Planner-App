import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../styles/AdminStoreManagement.css";

// const socket = io("http://localhost:5000");

const AdminStoreManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch products initially
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Real-time updates from socket
  // useEffect(() => {
  //   socket.on("product-updated", (updatedProducts) => {
  //     setProducts(updatedProducts);
  //   });
  //   return () => socket.disconnect();
  // }, []);

  // Handle form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/api/products", formData);
      }
      setFormData({ name: "", description: "", price: "", imageUrl: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  // Edit handler
  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  };

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="admin-store-container">
      <h2>🛒 Store Management</h2>

      {/* Product form */}
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Product Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          placeholder="Image URL"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          placeholder="Price (₹)"
          onChange={handleChange}
          required
        />
        <button type="submit" className="add-btn">
          {editingId ? "Update Product" : "Add Product"} <FaPlus />
        </button>
      </form>

      {/* Product List */}
      <div className="product-list">
        {products.length === 0 ? (
          <p className="no-products">No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.imageUrl} alt={product.name} />
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <p className="price">₹{product.price}</p>
              <div className="actions">
                <button className="edit-btn" onClick={() => handleEdit(product)}>
                  <FaEdit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStoreManagement;
