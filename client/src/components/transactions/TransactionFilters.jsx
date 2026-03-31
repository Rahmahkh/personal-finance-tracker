import React from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/categories';
import './TransactionFilters.css';

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const TransactionFilters = ({ filters, onChange, onClear }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      onChange({ ...filters, type: value, category: '' });
    } else {
      onChange({ ...filters, [name]: value });
    }
  };

  const categories =
    filters.type === 'income'
      ? INCOME_CATEGORIES
      : filters.type === 'expense'
      ? EXPENSE_CATEGORIES
      : [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].filter(
          (c, i, arr) => arr.findIndex((x) => x.value === c.value) === i
        );

  const hasFilters = filters.search || filters.type || filters.category || filters.startDate || filters.endDate;

  return (
    <div className="filters">
      {/* Search */}
      <div className="filter-group filter-group--search">
        <div className="filter-search-wrap">
          <span className="filter-search-icon"><SearchIcon /></span>
          <input
            type="text"
            id="filter-search"
            name="search"
            aria-label="Search transactions"
            className="filter-search"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Type filter */}
      <div className="filter-group">
        <select
          id="filter-type"
          name="type"
          aria-label="Filter by type"
          className="filter-select"
          value={filters.type}
          onChange={handleChange}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Category filter */}
      <div className="filter-group">
        <select
          id="filter-category"
          name="category"
          aria-label="Filter by category"
          className="filter-select"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Date range */}
      <div className="filter-group filter-group--date">
        <span className="filter-date-icon"><CalendarIcon /></span>
        <input
          type="date"
          id="filter-startDate"
          name="startDate"
          aria-label="From date"
          className="filter-date"
          value={filters.startDate}
          onChange={handleChange}
        />
        <span className="filter-date-sep">–</span>
        <input
          type="date"
          id="filter-endDate"
          name="endDate"
          aria-label="To date"
          className="filter-date"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <button className="filter-clear" onClick={onClear} aria-label="Clear filters">
          <XIcon /> Clear
        </button>
      )}
    </div>
  );
};

export default TransactionFilters;
