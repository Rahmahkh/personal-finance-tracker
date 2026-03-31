import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Icons = {
  profile: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  transactions: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  ),
  logout: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const Navbar = ({ onMenuToggle, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
        >
          <span className={`hamburger ${sidebarOpen ? 'hamburger--open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>
        <Link to="/" className="navbar-logo">
          <img src="/favicon.svg" alt="FinTrack" className="navbar-logo-icon" />
          <span className="navbar-logo-text">FinTrack</span>
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/transactions/add" className="navbar-add-btn">
          + Add Transaction
        </Link>

        <button className="navbar-theme-btn" onClick={toggle} aria-label="Toggle theme" title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
            </svg>
          )}
        </button>

        <div className="navbar-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="navbar-avatar">{initials}</div>
          <span className="navbar-username">{user?.name?.split(' ')[0]}</span>
          <svg className={`navbar-chevron ${dropdownOpen ? 'navbar-chevron--open' : ''}`} width="12" height="12" viewBox="0 0 12 12">
            <path fill="currentColor" d="M6 8L1 3h10z"/>
          </svg>

          {dropdownOpen && (
            <div className="navbar-dropdown">
              <div className="navbar-dropdown-header">
                <div className="navbar-avatar navbar-avatar--lg">{initials}</div>
                <div>
                  <p className="navbar-dropdown-name">{user?.name}</p>
                  <p className="navbar-dropdown-email">{user?.email}</p>
                </div>
              </div>
              <hr className="navbar-dropdown-divider" />
              <Link to="/profile" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                {Icons.profile} Profile Settings
              </Link>
              <Link to="/transactions" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                {Icons.transactions} My Transactions
              </Link>
              <hr className="navbar-dropdown-divider" />
              <button className="navbar-dropdown-item navbar-dropdown-item--danger" onClick={handleLogout}>
                {Icons.logout} Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {dropdownOpen && (
        <div className="navbar-overlay" onClick={() => setDropdownOpen(false)} />
      )}
    </header>
  );
};

export default Navbar;
