import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmModal } from '../common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../utils/categories';
import { CATEGORY_ICONS } from '../../utils/categoryIcons';
import { useToast } from '../../context/ToastContext';
import { transactionService } from '../../services/transactionService';
import './TransactionItem.css';

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);

const TransactionItem = ({ transaction, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const { success, error }            = useToast();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await transactionService.delete(transaction._id);
      success('Transaction deleted');
      onDelete(transaction._id);
    } catch (err) {
      error(err?.response?.data?.message || 'Failed to delete transaction');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const color = CATEGORY_COLORS[transaction.category] || '#7a90b8';

  return (
    <>
      <div className="tx-item">
        <div
          className="tx-icon"
          style={{ color, background: `${color}18`, borderColor: `${color}28` }}
        >
          {CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS.Other}
        </div>

        <div className="tx-info">
          <p className="tx-title">{transaction.title}</p>
          <p className="tx-meta">
            <span className={`badge badge-${transaction.type}`}>
              {transaction.type}
            </span>
            <span className="tx-meta-sep">·</span>
            <span className="tx-category">{transaction.category}</span>
            <span className="tx-meta-sep">·</span>
            <span className="tx-date">{formatDate(transaction.date)}</span>
          </p>
          {transaction.description && (
            <p className="tx-desc">{transaction.description}</p>
          )}
        </div>

        <div className={`tx-amount ${transaction.type === 'income' ? 'tx-amount--income' : 'tx-amount--expense'}`}>
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </div>

        <div className="tx-actions">
          <Link
            to={`/transactions/edit/${transaction._id}`}
            className="tx-btn tx-btn--edit"
            title="Edit"
          >
            <EditIcon />
          </Link>
          <button
            className="tx-btn tx-btn--delete"
            onClick={() => setShowConfirm(true)}
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${transaction.title}"? This cannot be undone.`}
      />
    </>
  );
};

export default TransactionItem;
