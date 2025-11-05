import React from "react";
import "../styles/About.css";

function AboutComp() {
  return (
    <div className="about-wrapper">
      {/* 🌸 Simple Banner Header */}
      <div className="about-banner">
        <h1>About JUEYM Events</h1>
        <p>Celebrating Every Moment — With Joy, Tradition & Care</p>
      </div>

      {/* Main About Content */}
      <div className="about-page">
        <p className="about-intro">
          We are a passionate organization dedicated to creating beautiful,
          stress-free memories for families and friends. Our mission is to
          provide valuable event services at a minimum cost, ensuring that
          everyone can celebrate their special moments without stress.
        </p>

        <section className="about-section about-mission">
          <h2 className="section-title">Our Mission</h2>
          <p>
            To bring joy and relief by organizing weddings, birthdays,
            anniversaries, and traditional functions with high-quality services
            at affordable prices. We handle every detail so you can focus on
            enjoying the celebration.
          </p>
        </section>

        <section className="about-section about-services">
          <h2 className="section-title">What We Provide</h2>
          <ul className="services-list">
            <li>🎉 Venue Decoration & Event Planning</li>
            <li>🍴 Delicious Catering Services</li>
            <li>📸 Professional Photography & Videography</li>
            <li>🎶 Music, Dance & Entertainment</li>
            <li>🦋 Personalized Themes & Creative Touches</li>
          </ul>
        </section>

        <section className="about-section about-values">
          <h2 className="section-title">Why Choose Us?</h2>
          <p className="value-statement">
            We believe that celebrations should be memorable, joyful, and
            budget-friendly. Our team combines creativity, tradition, and
            professionalism to make every event a success. With JUEYM, you don’t
            just plan — you create memories for a lifetime.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutComp;
