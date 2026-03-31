import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Spinner from '../components/common/Spinner';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import { formatCurrency } from '../utils/formatters';
import './TopSpendingPage.css';

const PERIODS = [
  { label: 'This Month',   key: 'month' },
  { label: 'Last 3 Months', key: '3months' },
  { label: 'This Year',    key: 'year' },
  { label: 'All Time',     key: 'all' },
];

const getDateRange = (key) => {
  const now = new Date();
  if (key === 'month') {
    return {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
      endDate:   new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
    };
  }
  if (key === '3months') {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 3);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate:   now.toISOString().split('T')[0],
    };
  }
  if (key === 'year') {
    return {
      startDate: `${now.getFullYear()}-01-01`,
      endDate:   `${now.getFullYear()}-12-31`,
    };
  }
  return { startDate: undefined, endDate: undefined };
};

const MEDALS = ['🥇', '🥈', '🥉'];

const TopSpendingPage = () => {
  const { error } = useToast();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod]   = useState('month');
  const [type, setType]       = useState('expense');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange(period);
      const result = await analyticsService.getCategoryBreakdown(type, startDate, endDate);
      setData(result);
    } catch {
      error('Failed to load spending data');
    } finally {
      setLoading(false);
    }
  }, [period, type, error]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const total = data.reduce((sum, d) => sum + d.total, 0);
  const max   = data[0]?.total || 1;

  return (
    <DashboardLayout>
      <div className="top-spending-page">

        {/* Header */}
        <div className="top-spending-header">
          <div>
            <h1 className="top-spending-title">Top Spending Categories</h1>
            <p className="top-spending-sub">See where your money goes most</p>
          </div>
        </div>

        {/* Filters */}
        <div className="top-spending-filters">
          <div className="ts-filter-group">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                className={`ts-filter-btn ${period === p.key ? 'ts-filter-btn--active' : ''}`}
                onClick={() => setPeriod(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="ts-type-toggle">
            <button
              className={`ts-type-btn ts-type-btn--expense ${type === 'expense' ? 'ts-type-btn--active-expense' : ''}`}
              onClick={() => setType('expense')}
            >
              ↓ Expenses
            </button>
            <button
              className={`ts-type-btn ts-type-btn--income ${type === 'income' ? 'ts-type-btn--active-income' : ''}`}
              onClick={() => setType('income')}
            >
              ↑ Income
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="ts-loading"><Spinner size="lg" /></div>
        ) : data.length === 0 ? (
          <div className="ts-empty">
            <span className="ts-empty-icon">📊</span>
            <p className="ts-empty-title">No data for this period</p>
            <p className="ts-empty-sub">Try selecting a different time range</p>
          </div>
        ) : (
          <div className="ts-body">
            {/* Summary bar */}
            <div className="ts-summary">
              <div className="ts-summary-item">
                <p className="ts-summary-label">Total {type === 'expense' ? 'Spent' : 'Earned'}</p>
                <p className={`ts-summary-value ts-summary-value--${type}`}>{formatCurrency(total)}</p>
              </div>
              <div className="ts-summary-item">
                <p className="ts-summary-label">Categories</p>
                <p className="ts-summary-value">{data.length}</p>
              </div>
              <div className="ts-summary-item">
                <p className="ts-summary-label">Transactions</p>
                <p className="ts-summary-value">{data.reduce((s, d) => s + d.count, 0)}</p>
              </div>
            </div>

            {/* Category list */}
            <div className="ts-list">
              {data.map((item, i) => {
                const color   = CATEGORY_COLORS[item.category] || '#7a90b8';
                const pct     = total > 0 ? (item.total / total) * 100 : 0;
                const barPct  = (item.total / max) * 100;
                const icon    = CATEGORY_ICONS[item.category] || '📌';
                const medal   = MEDALS[i] || null;

                return (
                  <div key={item.category} className="ts-item">
                    <div className="ts-item-rank">
                      {medal ? (
                        <span className="ts-medal">{medal}</span>
                      ) : (
                        <span className="ts-rank-num">#{i + 1}</span>
                      )}
                    </div>

                    <div className="ts-item-icon" style={{ color, background: `${color}18`, borderColor: `${color}28` }}>
                      {icon}
                    </div>

                    <div className="ts-item-info">
                      <div className="ts-item-top">
                        <span className="ts-item-name">{item.category}</span>
                        <span className="ts-item-count">{item.count} transaction{item.count !== 1 ? 's' : ''}</span>
                        <span className={`ts-item-amount ts-item-amount--${type}`}>
                          {type === 'income' ? '+' : '-'}{formatCurrency(item.total)}
                        </span>
                      </div>
                      <div className="ts-item-bar-wrap">
                        <div className="ts-item-bar-track">
                          <div
                            className="ts-item-bar-fill"
                            style={{ width: `${barPct}%`, background: color }}
                          />
                        </div>
                        <span className="ts-item-pct">{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TopSpendingPage;
