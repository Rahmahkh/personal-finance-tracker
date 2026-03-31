import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { registerSchema } from '../utils/validationSchemas';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import './AuthPage.css';

const FEATURES = [
  { label: 'Free forever, no credit card required' },
  { label: 'Secure JWT authentication' },
  { label: 'Real-time balance & analytics' },
  { label: 'Beautiful, mobile-friendly dashboard' },
];

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const RegisterPage = () => {
  const { register }        = useAuth();
  const { success, error }  = useToast();
  const navigate            = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await register(values.name, values.email, values.password);
        success('Account created! Welcome to FinTrack!');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        error(err?.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const f = (name) => ({
    name,
    id: name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    className: `auth-input ${formik.touched[name] && formik.errors[name] ? 'auth-input--error' : ''}`,
  });

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-panel auth-panel--left">
        <div className="auth-brand">
          <img src="/favicon.svg" alt="FinTrack" className="auth-brand-icon" />
          <span className="auth-brand-name">FinTrack</span>
        </div>

        <div className="auth-left-content">
          <div className="auth-left-badge">Join thousands of users</div>
          <h2 className="auth-left-heading">
            Your financial future<br/>
            <span className="auth-left-heading-accent">starts here.</span>
          </h2>
          <p className="auth-left-sub">
            FinTrack gives you the clarity and tools to manage your money with confidence.
          </p>
          <div className="auth-features-list">
            {FEATURES.map((item) => (
              <div key={item.label} className="auth-feature-item">
                <span className="auth-feature-check"><CheckIcon /></span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="auth-testimonial">
            <p className="auth-testimonial-text">
              "Finally a finance tracker that is clean, fast, and actually enjoyable to use."
            </p>
            <p className="auth-testimonial-author">— Portfolio Reviewer</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-panel auth-panel--right">
        <Link to="/" className="auth-back-link">
          <BackIcon /> Back to Home
        </Link>

        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Create your account</h1>
            <p className="auth-form-sub">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>

          <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="name">Full name</label>
              <input type="text" autoComplete="name" placeholder="John Doe" {...f('name')} />
              {formik.touched.name && formik.errors.name && (
                <p className="auth-error">{formik.errors.name}</p>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email address</label>
              <input type="email" autoComplete="email" placeholder="you@example.com" {...f('email')} />
              {formik.touched.email && formik.errors.email && (
                <p className="auth-error">{formik.errors.email}</p>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input type="password" autoComplete="new-password" placeholder="At least 6 characters" {...f('password')} />
              {formik.touched.password && formik.errors.password && (
                <p className="auth-error">{formik.errors.password}</p>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="confirmPassword">Confirm password</label>
              <input type="password" autoComplete="new-password" placeholder="Repeat your password" {...f('confirmPassword')} />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="auth-error">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
              Create Account
            </Button>
          </form>

          <p className="auth-footer-note">
            By registering, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
