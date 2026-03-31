import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../utils/categories';
import { CATEGORY_ICONS } from '../../utils/categoryIcons';
import EmptyState from '../common/EmptyState';
import './RecentTransactions.css';

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="recent-card">
      <div className="recent-header">
        <h3 className="recent-title">Recent Transactions</h3>
        <Link to="/transactions" className="recent-view-all">View All →</Link>
      </div>

      {!transactions || transactions.length === 0 ? (
        <EmptyState
          icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12h6M9 16h4"/>
            </svg>
          }
          title="No transactions yet"
          message="Start tracking your finances by adding your first transaction."
          action={
            <Link to="/transactions/add" className="btn btn-primary btn-sm">
              Add Transaction
            </Link>
          }
        />
      ) : (
        <div className="recent-list">
          {transactions.map((t) => {
            const color = CATEGORY_COLORS[t.category] || '#7a90b8';
            return (
              <div key={t._id} className="recent-item">
                <div
                  className="recent-item-icon"
                  style={{ color, background: `${color}18`, borderColor: `${color}28` }}
                >
                  {CATEGORY_ICONS[t.category] || CATEGORY_ICONS.Other}
                </div>
                <div className="recent-item-info">
                  <p className="recent-item-title">{t.title}</p>
                  <p className="recent-item-meta">
                    <span className="recent-item-category">{t.category}</span>
                    <span className="recent-item-dot">·</span>
                    <span className="recent-item-date">{formatDate(t.date)}</span>
                  </p>
                </div>
                <div className={`recent-item-amount ${t.type === 'income' ? 'amount--income' : 'amount--expense'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
