import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionPreview from '../components/transactions/TransactionPreview';
import { transactionService } from '../services/transactionService';
import { useToast } from '../context/ToastContext';
import { formatDateInput } from '../utils/formatters';
import './TransactionFormPage.css';

const AddTransactionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const initialType = searchParams.get('type') === 'income' ? 'income' : 'expense';
  const [preview, setPreview] = useState({
    type: initialType, amount: '', title: '', category: '',
    date: formatDateInput(new Date()), description: '',
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await transactionService.create(values);
      success('Transaction added successfully!');
      setPreview({
        type: initialType, amount: '', title: '', category: '',
        date: formatDateInput(new Date()), description: '',
      });
      setFormKey(k => k + 1);
    } catch (err) {
      error(err?.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="form-page">
        <div className="form-page-header">
          <button className="form-page-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <h1 className="form-page-title">Add Transaction</h1>
            <p className="form-page-sub">Record a new income or expense entry</p>
          </div>
        </div>

        <div className="form-page-body">
          <div className="form-page-card">
            <TransactionForm
              key={formKey}
              initialValues={{ type: initialType }}
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel="Add Transaction"
              onValuesChange={setPreview}
            />
          </div>
          <TransactionPreview values={preview} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddTransactionPage;
