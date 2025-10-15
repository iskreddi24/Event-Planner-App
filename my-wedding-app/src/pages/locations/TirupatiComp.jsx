import React from "react";
import "../../styles/Location.css"; 

function TirupatiComp() {
    const halls = [
        { name: "Sri Venkateswara Convention Hall", location: "Alipiri Road, Tirupati", capacity: "800 People", price: "₹90,000 per day", contact: "9876541230" },
        { name: "Balaji Banquet Hall", location: "Tiruchanur Road, Tirupati", capacity: "400 People", price: "₹45,000 per day", contact: "9812345678" },
        { name: "Hillside Function Palace", location: "Kapila Theertham, Tirupati", capacity: "600 People", price: "₹70,000 per day", contact: "9098765432" },
        { name: "Mangalam Gardens", location: "Renigunta Road, Tirupati", capacity: "1000 People", price: "₹1,10,000 per day", contact: "9123456780" },
        { name: "Sri Padmavathi Palace", location: "Chandragiri, Tirupati", capacity: "500 People", price: "₹60,000 per day", contact: "9012123434" },
    ];

    return (
        <div className="location-page">
            <h1 className="location-title tirupati-color">Plan Your Events in Tirupati 🕉️</h1>
            <p className="location-intro">
                Tirupati offers divine and beautiful venues for weddings, receptions, and
                special occasions. Explore our top picks:
            </p>
            <div className="hall-grid">
                {halls.map((hall, index) => (
                    <div key={index} className="hall-card tirupati-card"> 
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

export default TirupatiComp;