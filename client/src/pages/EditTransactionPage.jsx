import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionPreview from '../components/transactions/TransactionPreview';
import Spinner from '../components/common/Spinner';
import { transactionService } from '../services/transactionService';
import { formatDateInput } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import './TransactionFormPage.css';

const EditTransactionPage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { success, error } = useToast();

  const [transaction, setTransaction] = useState(null);
  const [fetching, setFetching]       = useState(true);
  const [loading, setLoading]         = useState(false);
  const [preview, setPreview]         = useState({
    type: 'expense', amount: '', title: '', category: '',
    date: formatDateInput(new Date()), description: '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await transactionService.getById(id);
        const values = {
          ...data,
          date: formatDateInput(data.date),
          amount: data.amount.toString(),
        };
        setTransaction(values);
        setPreview(values);
      } catch {
        error('Transaction not found');
        navigate('/transactions');
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [id, error, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await transactionService.update(id, values);
      success('Transaction updated successfully!');
      navigate('/transactions');
    } catch (err) {
      error(err?.response?.data?.message || 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="form-page">
        <div className="form-page-header">
          <button className="form-page-back" onClick={() => navigate(-1)}>← Back</button>
          <div>
            <h1 className="form-page-title">Edit Transaction</h1>
            <p className="form-page-sub">Update the details of this transaction</p>
          </div>
        </div>

        <div className="form-page-body">
          <div className="form-page-card">
            {fetching ? (
              <div className="form-page-loading"><Spinner size="lg" /></div>
            ) : (
              <TransactionForm
                initialValues={transaction}
                onSubmit={handleSubmit}
                loading={loading}
                submitLabel="Save Changes"
                onValuesChange={setPreview}
              />
            )}
          </div>
          <TransactionPreview values={preview} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditTransactionPage;
