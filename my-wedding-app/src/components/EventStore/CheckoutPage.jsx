import React, { useEffect, useState } from "react";
import "../../styles/CheckoutPage.css";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/common/Toast";
import { useToast } from "../../hooks/useToast";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigate = useNavigate();

  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
    const totalAmount = savedCart.reduce((acc, item) => acc + item.price, 0);
    setTotal(totalAmount);
  }, []);

  const handlePayment = () => {
    if (cartItems.length === 0) {
      showToast("⚠️ No items in your cart!", "error");
      return;
    }

    const order = {
      id: Date.now(),
      items: cartItems,
      total,
      paymentMethod,
      status: "Processing",
      createdAt: new Date().toLocaleString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(existingOrders));
    localStorage.removeItem("cart");

    showToast("Payment successful! Your order has been placed.", "success");

    setTimeout(() => navigate("/orders"), 2000);
  };

  return (
    <div className="checkout-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h2>💳 Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="empty-checkout">No items in cart. Add some products first.</p>
      ) : (
        <div className="checkout-content">
          {/* 🛍 Cart Items */}
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item._id || item.name} className="checkout-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <p className="total">Total: ₹{total}</p>

            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit / Debit Card
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                UPI / QR Pay
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
            </div>

            <button className="pay-btn" onClick={handlePayment}>
              Confirm & Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
