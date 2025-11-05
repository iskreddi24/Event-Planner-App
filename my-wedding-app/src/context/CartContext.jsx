import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add product
  const addToCart = (product) => {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      alert("Item already in cart!");
      return;
    }
    setCart([...cart, product]);
  };

  // Remove product
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // Clear all
  const clearCart = () => setCart([]);

  const getTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price || 0), 0);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, getTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
