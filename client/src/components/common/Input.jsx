import React from 'react';
import './Input.css';

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  icon,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  const hasError = touched && error;

  return (
    <div className={`form-field ${hasError ? 'form-field--error' : ''} ${className}`}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {icon && <span className="form-input-icon">{icon}</span>}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`form-input ${icon ? 'form-input--with-icon' : ''}`}
          aria-describedby={hasError ? `${name}-error` : undefined}
          {...rest}
        />
      </div>
      {hasError && (
        <p className="form-error" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
      {helperText && !hasError && (
        <p className="form-helper">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
