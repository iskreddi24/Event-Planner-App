import React from "react";
import "../../styles/HalfSaree.css"; 

import stage from "../../halfsareeimg/stage.png";
import tradition from "../../halfsareeimg/tradition.png";
import dance from "../../halfsareeimg/dance.png";

function HalfSaree() {
    const steps = [
        { title: "Set the Foundation", desc: "Plan budget, guest list, and date for the ceremony." },
        { title: "Choose Venue & Theme", desc: "Select a traditional or modern venue with a cultural theme." },
        { title: "Plan Event Details", desc: "Invitations, food, decoration, and rituals arrangements." },
        { title: "Cultural Touches", desc: "Include dance, music, and traditional customs for the girl." },
        { title: "Finalize & Celebrate", desc: "Confirm everything and enjoy the graceful function." }
    ];

    const gallery = [
        { img: stage, caption: "Traditional Stage Setup" },
        { img: tradition, caption: "Cultural Rituals" },
        { img: dance, caption: "Dance & Entertainment" }
    ];

    return (
        <div className="event-page halfsaree-page">
            <h1 className="event-title">Half Saree Functions 🥻</h1>
            <p className="event-intro">
                We organize elegant Half Saree functions with traditional rituals,
                decoration, catering, and entertainment to celebrate this special milestone.
            </p>

            <section className="steps">
                <h2>Our Planning Process</h2>
                <div className="steps-container">
                    {steps.map((step, index) => (
                        <div className="step-card" key={index}>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="gallery">
                <h2>Past Half Saree Celebrations</h2>
                <div className="gallery-container">
                    {gallery.map((item, index) => (
                        <div className="gallery-card" key={index}>
                            <img src={item.img} alt={item.caption} />
                            <p>{item.caption}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default HalfSaree;