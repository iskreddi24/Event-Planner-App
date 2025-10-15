import React from "react";
import "../styles/About.css"; 

function AboutComp() {
  return (
    <div className="about-page">
      <h1 className="about-header">About JUEYM Events</h1>
      <p className="about-intro">
        We are a passionate organization dedicated to creating beautiful, 
        stress-free memories for families and friends. Our mission is to provide 
        valuable event services at a minimum cost, ensuring that everyone can 
        celebrate their special moments without stress.
      </p>

      {}
      <section className="about-section about-mission">
        <h2 className="section-title">Our Mission</h2>
        <p>
          To bring joy and relief by organizing weddings, birthdays, 
          anniversaries, and half saree functions with the highest quality 
          services at affordable prices. We manage all logistics so you can 
          focus on enjoying the celebration.
        </p>
      </section>

      {}
      <section className="about-section about-services">
        <h2 className="section-title">What We Provide</h2>
        <ul className="services-list">
          <li><span role="img" aria-label="party">🎉</span> Venue Decoration & Event Planning</li>
          <li><span role="img" aria-label="catering">🍴</span> Delicious Catering Services</li>
          <li><span role="img" aria-label="camera">📸</span> Professional Photography & Videography</li>
          <li><span role="img" aria-label="music">🎶</span> Music, Dance & Entertainment</li>
          <li><span role="img" aria-label="butterfly">🦋</span> Personalized Themes & Creative Touches</li>
        </ul>
      </section>

      {}
      <section className="about-section about-values">
        <h2 className="section-title">Why Choose Us?</h2>
        <p className="value-statement">
          We believe that celebrations should be memorable, joyful, and 
          **budget-friendly**. Our team combines creativity, tradition, and 
          professionalism to make every event a success. With us, you don’t just 
          get an event — you get memories for a lifetime at a minimum pay.
        </p>
      </section>
    </div>
  );
}

export default AboutComp;