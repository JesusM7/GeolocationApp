import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ error, show = true }) => {
  if (!show || !error) {
    return null;
  }

  return (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      <span className="error-text">{error}</span>
    </div>
  );
};

export default ErrorMessage; 