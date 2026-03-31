import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const FEATURES = [
  {
    color: '#5b8ef7',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
    title: 'Smart Dashboard',
    desc: "Get a bird's-eye view of your finances with live charts and statistics.",
  },
  {
    color: '#34d399',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
    title: 'Track Transactions',
    desc: 'Log income and expenses with categories, dates, and notes.',
  },
  {
    color: '#f59e0b',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    title: 'Powerful Filters',
    desc: 'Search and filter by type, category, or date range in seconds.',
  },
  {
    color: '#10b981',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    title: 'Visual Analytics',
    desc: 'Understand your spending with beautiful interactive charts.',
  },
  {
    color: '#a78bfa',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    title: 'Secure & Private',
    desc: 'JWT authentication and bcrypt hashing keep your data safe.',
  },
  {
    color: '#f87171',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    title: 'Fully Responsive',
    desc: 'Works beautifully on desktop, tablet, and mobile.',
  },
];

const STEPS = [
  { step: '01', title: 'Create an account',    desc: 'Sign up in seconds, no credit card required.' },
  { step: '02', title: 'Add transactions',      desc: 'Log your income and expenses with rich details.' },
  { step: '03', title: 'See your insights',     desc: 'Watch your dashboard come alive with live statistics.' },
];

const LandingPage = () => {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="container landing-nav-inner">
          <div className="landing-nav-brand">
            <img src="/favicon.svg" alt="FinTrack" className="landing-nav-icon" />
            <span className="landing-nav-title">FinTrack</span>
          </div>
          <div className="landing-nav-links">
            <Link to="/login"    className="landing-nav-login">Sign In</Link>
            <Link to="/register" className="landing-nav-cta">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-badge">Personal Finance, Simplified</div>
          <h1 className="hero-heading">
            Take control of your<br />
            <span className="hero-heading-accent">financial future</span>
          </h1>
          <p className="hero-sub">
            Track income and expenses, visualize your spending, and build better
            financial habits, all in one beautiful dashboard.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-hero-primary">
              Start for Free →
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              Sign In
            </Link>
          </div>

          {/* Mock dashboard preview */}
          <div className="hero-preview">
            <div className="preview-card">
              <div className="preview-stats">
                <div className="preview-stat preview-stat--balance">
                  <span className="preview-stat-label">Balance</span>
                  <span className="preview-stat-value">$12,450</span>
                </div>
                <div className="preview-stat preview-stat--income">
                  <span className="preview-stat-label">Income</span>
                  <span className="preview-stat-value">$8,200</span>
                </div>
                <div className="preview-stat preview-stat--expense">
                  <span className="preview-stat-label">Expenses</span>
                  <span className="preview-stat-value">$3,750</span>
                </div>
              </div>
              <div className="preview-chart-bars">
                {[60, 45, 80, 55, 90, 70, 85, 65, 75, 50, 88, 72].map((h, i) => (
                  <div key={i} className="preview-bar-wrap">
                    <div className="preview-bar preview-bar--expense" style={{ height: `${h * 0.4}%` }} />
                    <div className="preview-bar preview-bar--income"  style={{ height: `${h * 0.6}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything you need</h2>
            <p className="section-sub">
              A complete toolkit to understand and manage your personal finances.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ color: f.color, background: `${f.color}18` }}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How it works</h2>
            <p className="section-sub">Up and running in under a minute.</p>
          </div>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div key={s.step} className="step-card">
                <div className="step-number">{s.step}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2 className="cta-title">Ready to take control?</h2>
          <p className="cta-sub">Join and start tracking your finances today. It's completely free.</p>
          <Link to="/register" className="btn-hero-primary">
            Create Your Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container landing-footer-inner">
          <div className="landing-nav-brand">
            <img src="/favicon.svg" alt="FinTrack" className="landing-nav-icon" />
            <span className="landing-nav-title">FinTrack</span>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} FinTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
