import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { loginSchema } from '../utils/validationSchemas';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import './AuthPage.css';

const FEATURES = [
  { label: 'Live balance & spending analytics' },
  { label: 'Income & expense tracking' },
  { label: 'Category breakdowns with charts' },
  { label: 'Mobile-friendly dashboard' },
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

const LoginPage = () => {
  const { login }    = useAuth();
  const { error } = useToast();
  const navigate     = useNavigate();
  const location     = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await login(values.email, values.password);
        navigate(from, { replace: true });
      } catch (err) {
        error(err?.response?.data?.message || 'Invalid email or password');
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
          <div className="auth-left-badge">Personal Finance, Simplified</div>
          <h2 className="auth-left-heading">
            Track every dollar{' '}
            <span className="auth-left-heading-accent">Reach every goal</span>
          </h2>
          <p className="auth-left-sub">
            Join thousands who manage their finances smarter with FinTrack.
          </p>
          <div className="auth-features-list">
            {FEATURES.map((item) => (
              <div key={item.label} className="auth-feature-item">
                <span className="auth-feature-check"><CheckIcon /></span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="auth-preview-card">
            <div className="auth-preview-stats">
              <div className="auth-preview-stat">
                <span className="auth-preview-stat-label">Balance</span>
                <span className="auth-preview-stat-value auth-preview-stat-value--blue">$12,450</span>
              </div>
              <div className="auth-preview-stat">
                <span className="auth-preview-stat-label">Income</span>
                <span className="auth-preview-stat-value auth-preview-stat-value--green">+$8,200</span>
              </div>
              <div className="auth-preview-stat">
                <span className="auth-preview-stat-label">Expenses</span>
                <span className="auth-preview-stat-value auth-preview-stat-value--red">-$3,750</span>
              </div>
            </div>
            <div className="auth-preview-bars">
              {[55, 80, 45, 90, 65, 75, 50, 88].map((h, i) => (
                <div key={i} className="auth-preview-bar-wrap">
                  <div className="auth-preview-bar auth-preview-bar--expense" style={{ height: `${h * 0.38}%` }} />
                  <div className="auth-preview-bar auth-preview-bar--income"  style={{ height: `${h * 0.62}%` }} />
                </div>
              ))}
            </div>
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
            <h1 className="auth-form-title">Welcome back</h1>
            <p className="auth-form-sub">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Sign up free</Link>
            </p>
          </div>

          <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email address</label>
              <input type="email" autoComplete="email" placeholder="you@example.com" {...f('email')} />
              {formik.touched.email && formik.errors.email && (
                <p className="auth-error">{formik.errors.email}</p>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input type="password" autoComplete="current-password" placeholder="Enter your password" {...f('password')} />
              {formik.touched.password && formik.errors.password && (
                <p className="auth-error">{formik.errors.password}</p>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
              Sign In
            </Button>
          </form>

          <p className="auth-footer-note">
            By signing in, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
