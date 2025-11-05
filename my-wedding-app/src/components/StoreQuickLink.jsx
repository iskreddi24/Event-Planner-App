import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStore } from "react-icons/fa";
import "../styles/StoreQuickLink.css";

const StoreQuickLink = () => {
  const navigate = useNavigate();

  return (
    <div
      className="store-quicklink"
      onClick={() => navigate("/store")}
      title="Visit Store"
    >
      <FaStore className="store-icon" />
      <span className="store-text">Store</span>
    </div>
  );
};

export default StoreQuickLink;
