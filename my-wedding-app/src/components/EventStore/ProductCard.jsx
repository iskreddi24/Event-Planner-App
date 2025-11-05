// src/components/EventStore/ProductCard.jsx
import React from "react";
import { useCart } from "../../context/CartContext";
import "../../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="wc-card">
      <div className="wc-media">
        <img src={product.image || "/images/placeholder.jpg"} alt={product.name} />
      </div>
      <div className="wc-info">
        <h4 className="wc-title">{product.name}</h4>
        {product?.category?.name && (
          <span className="wc-chip">{product.category.name}</span>
        )}
        <p className="wc-desc">{product.description}</p>
        <div className="wc-row">
          <div className="wc-price">₹{product.price?.toLocaleString()}</div>
          <button
            className="wc-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            title={product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
