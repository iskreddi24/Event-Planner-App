import React from "react";
import "../../styles/Wedding.css"; 

import mandap from "../../weddingimg/mandap.png";
import couple from "../../weddingimg/couple.png";
import decor from "../../weddingimg/decor.png";

function Wedding() {
    const steps = [
        { title: "Set the Foundation", desc: "Plan the budget, guest list, and wedding date." },
        { title: "Choose Venue & Theme", desc: "Select a traditional or modern venue with a wedding theme." },
        { title: "Plan Event Details", desc: "Invitations, catering, decorations, rituals, and photography." },
        { title: "Add Personal Touches", desc: "Couple’s entry, music, dance, and custom moments." },
        { title: "Finalize & Celebrate", desc: "Confirm all arrangements and enjoy the big day." }
    ];

    const gallery = [
        { img: mandap, caption: "Mandap Setup" },
        { img: couple, caption: "Wedding Rituals" },
        { img: decor, caption: "Beautiful Decorations" }
    ];

    return (
        <div className="event-page wedding-page">
            <h1 className="event-title">Wedding Functions 💒</h1>
            <p className="event-intro">
                We organize grand weddings with complete planning, including traditional rituals,
                decoration, catering, photography, and entertainment to make your special day unforgettable.
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
                <h2>Past Wedding Celebrations</h2>
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

export default Wedding;