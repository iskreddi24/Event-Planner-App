import React, { useEffect, useState } from "react";
import "../../styles/CheckoutPage.css";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
    const totalAmount = savedCart.reduce((acc, item) => acc + item.price, 0);
    setTotal(totalAmount);
  }, []);

  const handlePayment = () => {
    // simple mock payment
    setTimeout(() => {
      alert("✅ Payment successful! Your booking is confirmed.");
      localStorage.removeItem("cart");
      navigate("/");
    }, 1500);
  };

  return (
    <div className="checkout-container">
      <h2>💳 Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="empty-checkout">No items in cart. Add some products first.</p>
      ) : (
        <div className="checkout-content">
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item._id} className="checkout-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <p>Total: ₹{total}</p>

            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit/Debit Card
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
