import React, { useState, useEffect } from "react";
import "../styles/BookingList.css";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  // Simulated fetch (replace with backend API later)
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("userBookings")) || [
      {
        id: 1,
        user: "John Doe",
        eventType: "Wedding",
        date: "2025-11-10",
        location: "Hyderabad",
        amount: "₹25,000",
        status: "Confirmed",
      },
      {
        id: 2,
        user: "Priya Sharma",
        eventType: "Birthday Party",
        date: "2025-11-15",
        location: "Secunderabad",
        amount: "₹10,000",
        status: "Pending",
      },
    ];
    setBookings(storedBookings);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: newStatus } : b
    );
    setBookings(updated);
    localStorage.setItem("userBookings", JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const filtered = bookings.filter((b) => b.id !== id);
      setBookings(filtered);
      localStorage.setItem("userBookings", JSON.stringify(filtered));
    }
  };

  return (
    <div className="booking-list-container">
      <h3>User Bookings</h3>

      {bookings.length === 0 ? (
        <p className="no-bookings">No bookings found.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Event Type</th>
              <th>Date</th>
              <th>Location</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.user}</td>
                <td>{b.eventType}</td>
                <td>{b.date}</td>
                <td>{b.location}</td>
                <td>{b.amount}</td>
                <td>
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="delete-btn"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingList;
