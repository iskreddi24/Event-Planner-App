import React, { useEffect, useState } from "react";
import "./LogoIntro.css";
import brideImage from "../assets/bride.png";
import groomImage from "../assets/groom.png";

const LogoIntro = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="logo-intro">
      <div className="intro-content wedding-intro"> { }
        <button className="close-btn" onClick={() => setVisible(false)}>×</button>
        <img src={brideImage} alt="Bride" className="bride-img" />
        <img src={groomImage} alt="Groom" className="groom-img" />
        <span className="love-symbol">♥</span>
      </div>
    </div>
  );
};

export default LogoIntro;