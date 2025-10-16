// C:/Users/Siva Krishna Reddy/Desktop/WeddingPlannerPro/my-wedding-app/src/components/LogoIntro.jsx

import React, { useEffect, useState } from "react";
import "./LogoIntro.css";
// Make sure these paths are correct, likely "../assets/" as discussed
import brideImage from "../assets/bride.png";
import groomImage from "../assets/groom.png";

const LogoIntro = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Keep the intro visible for a bit longer to allow for animations
    const timer = setTimeout(() => setVisible(false), 6000); // Increased duration to match CSS fadeOut delay
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="logo-intro">
      <div className="intro-content wedding-intro"> {/* Added wedding-intro class */}
        <button className="close-btn" onClick={() => setVisible(false)}>×</button>
        <img src={brideImage} alt="Bride" className="bride-img" />
        <img src={groomImage} alt="Groom" className="groom-img" />
        <span className="love-symbol">♥</span>
      </div>
    </div>
  );
};

export default LogoIntro;