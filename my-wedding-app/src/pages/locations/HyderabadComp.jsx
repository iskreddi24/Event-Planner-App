import React from "react";
import "../../styles/Location.css";

function HyderabadComp() {
    const halls = [
        { name: "Royal Grand Function Hall", location: "Madhapur, Hyderabad", capacity: "500 People", price: "₹50,000 per day", contact: "9876543210" },
        { name: "Pearl Banquet Hall", location: "Banjara Hills, Hyderabad", capacity: "300 People", price: "₹35,000 per day", contact: "9123456780" },
        { name: "Lake View Convention Center", location: "Hussain Sagar, Hyderabad", capacity: "1000 People", price: "₹1,20,000 per day", contact: "9988776655" },
        { name: "Green Leaf Gardens", location: "Kukatpally, Hyderabad", capacity: "800 People", price: "₹85,000 per day", contact: "9012345678" },
        { name: "Diamond Palace Function Hall", location: "Secunderabad, Hyderabad", capacity: "400 People", price: "₹45,000 per day", contact: "9098765432" },
    ];

    return (
        <div className="location-page">
            {}
            <h1 className="location-title hyderabad-color">Plan Your Events in Hyderabad 🏙️</h1>
            <p className="location-intro">
                We provide beautiful spaces for weddings, birthdays, and corporate
                events across Hyderabad. Choose from our listed venues:
            </p>
            <div className="hall-grid">
                {halls.map((hall, index) => (
                    <div key={index} className="hall-card hyderabad-card"> 
                        <h2 className="hall-name">{hall.name}</h2>
                        <p><b>Location:</b> {hall.location}</p>
                        <p><b>Capacity:</b> {hall.capacity}</p>
                        <p className="hall-price"><b>Price:</b> {hall.price}</p>
                        <p><b>Contact:</b> <span className="hall-contact">{hall.contact}</span></p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HyderabadComp;