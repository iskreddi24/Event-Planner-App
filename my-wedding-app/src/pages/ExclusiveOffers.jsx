import React from "react";
import "../styles/ExclusiveOffers.css";

function ExclusiveOffers() {
    const offers = [
        { id: 1, title: "Wedding Package", discount: "25% Off", description: "Book your wedding event this month and save big!" },
        { id: 2, title: "Corporate Events", discount: "15% Off", description: "Special pricing for business and corporate bookings." },
        { id: 3, title: "Birthday Bash", discount: "20% Off", description: "Celebrate your special day with our best offers." },
    ];

    return (
        <div className="exclusive-offers-page">
            <h1 className="offers-title">🍾🎉🎊Exclusive Offers</h1>
            <p className="offers-subtitle">Grab exciting discounts on your next event booking!</p>

            <div className="offers-container">
                {offers.map((offer) => (
                    <div key={offer.id} className="offer-card">
                        <h2>{offer.title}</h2>
                        <p className="discount">{offer.discount}</p>
                        <p>{offer.description}</p>
                        <button className="book-btn">Book Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExclusiveOffers;
