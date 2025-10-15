import React from "react";
import "../../styles/Birthday.css"; 

import cake from "../../birthdayimg/cake.png";
import party from "../../birthdayimg/party.png";
import gifts from "../../birthdayimg/gifts.png";

function Birthday() {
    const steps = [
        { title: "Set the Foundation", desc: "Budget, guest list, and theme selection." },
        { title: "Pick Venue & Theme", desc: "Choose location, party style, and theme." },
        { title: "Plan Party Details", desc: "Invitations, food, decorations, and activities." },
        { title: "Add Fun Touches", desc: "Games, music, and personalized elements." },
        { title: "Finalize & Celebrate", desc: "Confirm everything and enjoy the party." }
    ];

    const gallery = [
        { img: cake, caption: "Birthday Cake" },
        { img: party, caption: "Birthday Party Setup" },
        { img: gifts, caption: "Gift Table" }
    ];

    return (
        <div className="event-page birthday-page">
            <h1 className="event-title">Birthday Celebrations 🎂</h1>
            <p className="event-intro">
                We organize amazing birthday parties with decorations, catering, music,
                and games to make the day memorable.
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
                <h2>Past Birthday Events</h2>
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

export default Birthday;