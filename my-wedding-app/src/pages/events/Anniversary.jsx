import React from "react";
import "../../styles/Anniversary.css"; 
import cardev from "../../anniversaryimages/cardev.png";
import celeb from "../../anniversaryimages/celeb.png";
import event from "../../anniversaryimages/event.png";


function Anniversary() {
    const steps = [
        { title: "Set the Foundation", desc: "Budget, guest list, and date selection." },
        { title: "Select Venue & Theme", desc: "Choose location and event theme." },
        { title: "Plan Event Details", desc: "Invitations, food, décor, and entertainment." },
        { title: "Add Personal Touches", desc: "Special speeches, slideshow, and guest favors." },
        { title: "Finalize & Enjoy", desc: "Confirm everything and celebrate stress-free." }
    ];

    const gallery = [
        { img: cardev, caption: "Romantic Decor" },
        { img: event, caption: "Grand Celebration" },
        { img: celeb, caption: "Cozy Gathering" }
    ];

    return (
        <div className="event-page anniversary-page">
            <h1 className="event-title">Anniversary Functions 💍</h1>
            <p className="event-intro">
                We arrange beautiful anniversary celebrations with decoration, catering,
                and venue setup.
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
                <h2>Past Celebrations</h2>
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

export default Anniversary;