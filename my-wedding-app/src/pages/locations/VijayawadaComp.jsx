import React from "react";
import "../../styles/Location.css"; 

function VijayawadaComp() {
    const halls = [
        { name: "Krishna River Convention Hall", location: "Kanaka Durga Varadhi, Vijayawada", capacity: "600 People", price: "₹55,000 per day", contact: "9845123456" },
        { name: "Diamond Banquet Hall", location: "Mogalrajpuram, Vijayawada", capacity: "400 People", price: "₹40,000 per day", contact: "9876123450" },
        { name: "River View Gardens", location: "Prakasam Barrage, Vijayawada", capacity: "900 People", price: "₹95,000 per day", contact: "9123456789" },
        { name: "Sri Durga Function Palace", location: "Benz Circle, Vijayawada", capacity: "500 People", price: "₹60,000 per day", contact: "9090909090" },
        { name: "Green Park Convention Center", location: "Gunadala, Vijayawada", capacity: "700 People", price: "₹80,000 per day", contact: "9012121212" },
    ];

    return (
        <div className="location-page">
            <h1 className="location-title vijayawada-color">Plan Your Events in Vijayawada ✨</h1>
            <p className="location-intro">
                Celebrate weddings, birthdays, and special occasions in beautiful spaces across Vijayawada. 
                Here are some top venues:
            </p>
            <div className="hall-grid">
                {halls.map((hall, index) => (
                    <div key={index} className="hall-card vijayawada-card">
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

export default VijayawadaComp;