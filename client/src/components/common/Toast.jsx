import React from 'react';
import './Toast.css';

const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

const Toast = ({ id, message, type = 'info', onClose }) => {
  return (
    <div className={`toast toast--${type}`} role="alert">
      <span className="toast-icon">{ICONS[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">×</button>
    </div>
  );
};

export default Toast;
