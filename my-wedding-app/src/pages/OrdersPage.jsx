import React, { useEffect, useState } from "react";
import "../../src/styles/OrdersPage.css";

const statusSteps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

const OrderTimeline = ({ currentStatus }) => {
    const currentIndex = statusSteps.indexOf(currentStatus);

    return (
        <div className="timeline">
            {statusSteps.map((step, index) => (
                <div key={step} className="timeline-step">
                    <div
                        className={`circle ${index <= currentIndex ? "active" : ""
                            }`}
                    >
                        {index + 1}
                    </div>
                    <p className={`label ${index <= currentIndex ? "active" : ""}`}>
                        {step}
                    </p>
                    {index < statusSteps.length - 1 && (
                        <div
                            className={`bar ${index < currentIndex ? "active" : ""}`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        setOrders(savedOrders);
    }, []);

    const getNextStatus = (status) => {
        if (status === "Processing") return "Shipped";
        if (status === "Shipped") return "Out for Delivery";
        if (status === "Out for Delivery") return "Delivered";
        return "Delivered";
    };

    const handleTrackUpdate = (id) => {
        const updated = orders.map((o) =>
            o.id === id ? { ...o, status: getNextStatus(o.status) } : o
        );
        setOrders(updated);
        localStorage.setItem("orders", JSON.stringify(updated));
    };

    return (
        <div className="orders-container">
            <h2>📦 My Orders</h2>

            {orders.length === 0 ? (
                <p className="no-orders">You haven’t placed any orders yet.</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div className="order-card" key={order.id}>
                            <h3>Order #{order.id}</h3>
                            <p><strong>Placed:</strong> {order.createdAt}</p>
                            <p><strong>Payment:</strong> {order.paymentMethod}</p>
                            <p><strong>Total:</strong> ₹{order.total}</p>

                            {/* 🔥 Timeline Component */}
                            <OrderTimeline currentStatus={order.status} />

                            <div className="order-items">
                                {order.items.map((item) => (
                                    <div key={item._id} className="order-item">
                                        <img src={item.image} alt={item.name} />
                                        <div>
                                            <h4>{item.name}</h4>
                                            <p>₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {order.status !== "Delivered" && (
                                <button
                                    className="track-btn"
                                    onClick={() => handleTrackUpdate(order.id)}
                                >
                                    Update Tracking →
                                </button>
                            )}
                            <div className="progress-line">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(statusSteps.indexOf(order.status) / (statusSteps.length - 1)) * 100}%` }}
                                />
                            </div>

                        </div>

                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
