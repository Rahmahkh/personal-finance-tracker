import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import './StatCard.css';

const ICONS = {
  balance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 010-4h11v4"/>
      <path d="M3 5v14a2 2 0 002 2h16v-5"/>
      <path d="M18 12a2 2 0 000 4h3v-4h-3z"/>
    </svg>
  ),
  income: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  expense: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  savings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
};

const StatCard = ({ title, amount, variant = 'balance', trend, isPercent = false }) => {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card-header">
        <div className="stat-card-icon-wrap">
          {ICONS[variant] || ICONS.balance}
        </div>
        {trend !== undefined && (
          <span className={`stat-card-trend ${trend >= 0 ? 'stat-card-trend--up' : 'stat-card-trend--down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-card-body">
        <p className="stat-card-amount">
          {isPercent ? `${amount}%` : formatCurrency(amount)}
        </p>
        <p className="stat-card-title">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
