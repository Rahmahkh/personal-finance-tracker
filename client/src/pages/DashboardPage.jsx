import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import Spinner from '../components/common/Spinner';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import useAuth from '../hooks/useAuth';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user }          = useAuth();
  const { error }         = useToast();
  const [summary, setSummary]   = useState(null);
  const [monthly, setMonthly]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sum, mon, cats] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getMonthly(new Date().getFullYear()),
          analyticsService.getCategoryBreakdown('expense'),
        ]);
        setSummary(sum);
        setMonthly(mon);
        setCategories(cats);
      } catch (err) {
        error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [error]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dashboard-loading">
          <Spinner size="lg" />
          <p>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout>
      <div className="dashboard-page-inner">
        {/* Welcome */}
        <div className="dashboard-welcome">
          <div>
            <h1 className="dashboard-welcome-title">
              {greeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="dashboard-welcome-sub">
              Here's a summary of your finances.
            </p>
          </div>
          <div className="dashboard-welcome-actions">
            <Link to="/transactions/add?type=income" className="dash-btn dash-btn--income">
              ↑ Add Income
            </Link>
            <Link to="/transactions/add?type=expense" className="dash-btn dash-btn--expense">
              ↓ Add Expense
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard
            title="Total Balance"
            amount={summary?.balance ?? 0}
            variant="balance"
          />
          <StatCard
            title="Total Income"
            amount={summary?.totalIncome ?? 0}
            variant="income"
          />
          <StatCard
            title="Total Expenses"
            amount={summary?.totalExpense ?? 0}
            variant="expense"
          />
          <StatCard
            title="Savings Rate"
            amount={
              summary?.totalIncome > 0
                ? Math.round(((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100)
                : 0
            }
            variant="savings"
            isPercent
          />
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <IncomeExpenseChart data={monthly} />
          <CategoryChart data={categories} />
        </div>

        {/* Recent transactions */}
        <RecentTransactions transactions={summary?.recentTransactions} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
