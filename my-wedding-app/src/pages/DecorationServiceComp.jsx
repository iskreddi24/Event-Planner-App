import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DecorationServiceComp.css"; // Import the new CSS file

function DecorationServiceComp() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    eventType: "",
    theme: "",
    membersCount: "",
    date: "",
    location: "",
    budget: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [bookings, setBookings] = useState([]);

  // ✅ Fetch all previous bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/decoration");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/decoration", formData);
      setStatus("Booking created successfully!");
      setFormData({
        userName: "",
        email: "",
        phone: "",
        eventType: "",
        theme: "",
        membersCount: "",
        date: "",
        location: "",
        budget: "",
        message: "",
      });
      fetchBookings(); // refresh bookings
    } catch (err) {
      console.error("Error submitting form:", err);
      setStatus("Error submitting booking!");
    }
  };

  return (
    <div className="decoration-service-container">
      <div className="booking-form-card">
        <h2 className="form-title">Decoration Service Booking</h2>
        <form onSubmit={handleSubmit} className="booking-form-content">
          <input
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="form-input"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="form-input"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
            className="form-input"
          />
          <input
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            placeholder="Event Type (Birthday / Anniversary)"
            required
            className="form-input"
          />
          <input
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            placeholder="Theme"
            className="form-input"
          />
          <input
            name="membersCount"
            type="number"
            value={formData.membersCount}
            onChange={handleChange}
            placeholder="Number of Members"
            required
            className="form-input"
          />
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event Location"
            required
            className="form-input"
          />
          <input
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget"
            className="form-input"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Any special requests..."
            className="form-textarea"
          ></textarea>
          <button type="submit" className="submit-button">
            Book Decoration
          </button>
        </form>
        {status && (
          <p className={status.includes("Error") ? "status-message error" : "status-message success"}>
            {status}
          </p>
        )}
      </div>

      {/* ✅ Previous Bookings Section */}
      <div className="bookings-section">
        <h3 className="bookings-title">Previous Decoration Bookings</h3>
        <div className="bookings-list">
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <div key={b._id} className="booking-card">
                <p>
                  <strong>Name:</strong> {b.userName}
                </p>
                <p>
                  <strong>Event:</strong> {b.eventType}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(b.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Location:</strong> {b.location}
                </p>
                <p className={`booking-status status-${b.status ? b.status.toLowerCase() : 'pending'}`}>
                  <strong>Status:</strong> {b.status}
                </p>
              </div>
            ))
          ) : (
            <p className="no-bookings-message">No previous bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DecorationServiceComp;