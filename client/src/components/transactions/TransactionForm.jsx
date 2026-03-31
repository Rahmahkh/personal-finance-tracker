import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { transactionSchema } from '../../utils/validationSchemas';
import { getCategoriesForType } from '../../utils/categories';
import { formatDateInput } from '../../utils/formatters';
import Button from '../common/Button';
import './TransactionForm.css';

const TransactionForm = ({
  initialValues,
  onSubmit,
  loading = false,
  submitLabel = 'Save Transaction',
  onValuesChange,
}) => {
  const defaultValues = {
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: formatDateInput(new Date()),
    description: '',
    ...initialValues,
  };

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: transactionSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        amount: parseFloat(values.amount),
      });
    },
  });

  // Reset category when type changes so user picks a valid one
  useEffect(() => {
    formik.setFieldValue('category', '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.type]);

  useEffect(() => {
    if (onValuesChange) onValuesChange(formik.values);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);

  const categories = getCategoriesForType(formik.values.type);

  const field = (name) => ({
    name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
  });

  return (
    <form className="tx-form" onSubmit={formik.handleSubmit} noValidate>
      {/* Type toggle */}
      <div className="tx-form-field">
        <p className="tx-form-label">Transaction Type *</p>
        <div className="tx-type-toggle">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              className={`tx-type-btn tx-type-btn--${t} ${formik.values.type === t ? 'tx-type-btn--active' : ''}`}
              onClick={() => formik.setFieldValue('type', t)}
            >
              {t === 'income' ? 'Income' : 'Expense'}
            </button>
          ))}
        </div>
        {formik.touched.type && formik.errors.type && (
          <p className="tx-form-error">{formik.errors.type}</p>
        )}
      </div>

      {/* Title */}
      <div className="tx-form-field">
        <label className="tx-form-label" htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          className={`tx-form-input ${formik.touched.title && formik.errors.title ? 'tx-form-input--error' : ''}`}
          placeholder="e.g. Monthly Salary, Grocery Shopping"
          {...field('title')}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="tx-form-error">{formik.errors.title}</p>
        )}
      </div>

      {/* Amount + Category row */}
      <div className="tx-form-row">
        <div className="tx-form-field">
          <label className="tx-form-label" htmlFor="amount">Amount *</label>
          <div className="tx-amount-wrap">
            <span className="tx-amount-prefix">$</span>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              className={`tx-form-input tx-form-input--amount ${formik.touched.amount && formik.errors.amount ? 'tx-form-input--error' : ''}`}
              placeholder="0.00"
              {...field('amount')}
            />
          </div>
          {formik.touched.amount && formik.errors.amount && (
            <p className="tx-form-error">{formik.errors.amount}</p>
          )}
        </div>

        <div className="tx-form-field">
          <label className="tx-form-label" htmlFor="category">Category *</label>
          <select
            id="category"
            className={`tx-form-input ${formik.touched.category && formik.errors.category ? 'tx-form-input--error' : ''}`}
            {...field('category')}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="tx-form-error">{formik.errors.category}</p>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="tx-form-field">
        <label className="tx-form-label" htmlFor="date">Date *</label>
        <input
          id="date"
          type="date"
          className={`tx-form-input ${formik.touched.date && formik.errors.date ? 'tx-form-input--error' : ''}`}
          {...field('date')}
        />
        {formik.touched.date && formik.errors.date && (
          <p className="tx-form-error">{formik.errors.date}</p>
        )}
      </div>

      {/* Description */}
      <div className="tx-form-field">
        <label className="tx-form-label" htmlFor="description">
          Description <span className="tx-form-optional">(optional)</span>
        </label>
        <textarea
          id="description"
          className="tx-form-input tx-form-textarea"
          placeholder="Add a note or description..."
          {...field('description')}
          onChange={formik.handleChange}
        />
        {formik.touched.description && formik.errors.description && (
          <p className="tx-form-error">{formik.errors.description}</p>
        )}
      </div>

      <Button
        type="submit"
        variant={formik.values.type === 'income' ? 'secondary' : 'primary'}
        size="lg"
        loading={loading}
        fullWidth
      >
        {submitLabel}
      </Button>
    </form>
  );
};

export default TransactionForm;
