import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/NotFound.css"; 

function NotFound() {
  return (
    <div className="not-found-page">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Page Not Found</h2>
      <p className="not-found-message">
        Oops! The page you are looking for does not exist or may have been moved.
      </p>
      <Link to="/" className="not-found-link">
        Go to Home Page
      </Link>
    </div>
  );
}

export default NotFound;