import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  return (
    <span
      className={`spinner spinner--${size} spinner--${color} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
