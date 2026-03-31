import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TransactionItem from '../components/transactions/TransactionItem';
import TransactionFilters from '../components/transactions/TransactionFilters';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { transactionService } from '../services/transactionService';
import { useToast } from '../context/ToastContext';
import './TransactionsPage.css';

const EMPTY_FILTERS = {
  search: '', type: '', category: '', startDate: '', endDate: '',
};

const TransactionsPage = () => {
  const { error }      = useToast();
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination]     = useState({});
  const [filters, setFilters]           = useState(EMPTY_FILTERS);
  const [page, setPage]                 = useState(1);
  const [loading, setLoading]           = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15, ...filters };
      // Remove empty params
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const res = await transactionService.getAll(params);
      setTransactions(res.data);
      setPagination(res.pagination);
    } catch {
      error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [page, filters, error]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t._id !== id));
    setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
  };

  return (
    <DashboardLayout>
      <div className="transactions-page">
        {/* Header */}
        <div className="transactions-header">
          <div>
            <h1 className="transactions-title">Transactions</h1>
            <p className="transactions-sub">
              {pagination.total != null ? `${pagination.total} transactions found` : 'All your income and expenses'}
            </p>
          </div>
          <Link to="/transactions/add">
            <Button variant="primary">+ Add Transaction</Button>
          </Link>
        </div>

        {/* Filters */}
        <TransactionFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {/* List */}
        {loading ? (
          <div className="transactions-loading">
            <Spinner size="lg" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="transactions-empty-wrap">
            <EmptyState
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                  <path d="M9 12h6M9 16h4"/>
                </svg>
              }
              title="No transactions found"
              message={
                Object.values(filters).some(Boolean)
                  ? 'Try adjusting your filters.'
                  : 'Start by adding your first transaction.'
              }
              action={
                !Object.values(filters).some(Boolean) && (
                  <Link to="/transactions/add">
                    <Button>Add Transaction</Button>
                  </Link>
                )
              }
            />
          </div>
        ) : (
          <>
            <div className="transactions-list">
              {transactions.map((t) => (
                <TransactionItem key={t._id} transaction={t} onDelete={handleDelete} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="transactions-pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pagination.pages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
