import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/FloatingCartButton.css";

const FloatingCartButton = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <button className="floating-cart" onClick={() => navigate("/cart")}>
      <FaShoppingCart size={20} />
      {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
    </button>
  );
};

export default FloatingCartButton;
