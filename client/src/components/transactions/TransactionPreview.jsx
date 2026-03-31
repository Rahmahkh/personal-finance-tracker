import React from 'react';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/categories';
import './TransactionPreview.css';

const formatPreviewDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const TransactionPreview = ({ values }) => {
  const { type, amount, title, category, date, description } = values;
  const isExpense = type === 'expense';
  const hasAmount = amount && parseFloat(amount) > 0;
  const categoryColor = category ? CATEGORY_COLORS[category] : 'var(--text-muted)';

  return (
    <div className={`tx-preview ${isExpense ? 'tx-preview--expense' : 'tx-preview--income'}`}>
      <p className="tx-preview-heading">Live Preview</p>

      <div className="tx-preview-badge-row">
        <span className={`tx-preview-type-badge tx-preview-type-badge--${type}`}>
          {isExpense ? '↓ Expense' : '↑ Income'}
        </span>
      </div>

      <div className="tx-preview-amount">
        <span className="tx-preview-currency">$</span>
        <span className={`tx-preview-number ${isExpense ? 'tx-preview-number--expense' : 'tx-preview-number--income'}`}>
          {hasAmount ? parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
        </span>
      </div>

      <div className="tx-preview-divider" />

      <div className="tx-preview-details">
        <div className="tx-preview-row">
          <span className="tx-preview-icon">📝</span>
          <span className={`tx-preview-value ${!title ? 'tx-preview-value--empty' : ''}`}>
            {title || 'No title yet'}
          </span>
        </div>

        <div className="tx-preview-row">
          <span className="tx-preview-icon">
            {category ? CATEGORY_ICONS[category] || '🏷️' : '🏷️'}
          </span>
          <span
            className={`tx-preview-value ${!category ? 'tx-preview-value--empty' : ''}`}
            style={category ? { color: categoryColor, fontWeight: 600 } : {}}
          >
            {category || 'No category'}
          </span>
        </div>

        <div className="tx-preview-row">
          <span className="tx-preview-icon">📅</span>
          <span className="tx-preview-value">{formatPreviewDate(date)}</span>
        </div>

        {description && (
          <div className="tx-preview-row tx-preview-row--desc">
            <span className="tx-preview-icon">💬</span>
            <span className="tx-preview-value tx-preview-desc">{description}</span>
          </div>
        )}
      </div>

      {!hasAmount && !title && !category && (
        <p className="tx-preview-hint">Fill in the form to see a live preview</p>
      )}
    </div>
  );
};

export default TransactionPreview;
