import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import DashboardPage      from './pages/DashboardPage';
import TransactionsPage   from './pages/TransactionsPage';
import AddTransactionPage from './pages/AddTransactionPage';
import EditTransactionPage from './pages/EditTransactionPage';
import ProfilePage        from './pages/ProfilePage';
import TopSpendingPage    from './pages/TopSpendingPage';

// Route Guards
import ProtectedRoute     from './components/common/ProtectedRoute';
import PublicRoute        from './components/common/PublicRoute';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            {/* Protected routes */}
            <Route path="/dashboard"           element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/transactions"        element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
            <Route path="/transactions/add"    element={<ProtectedRoute><AddTransactionPage /></ProtectedRoute>} />
            <Route path="/transactions/edit/:id" element={<ProtectedRoute><EditTransactionPage /></ProtectedRoute>} />
            <Route path="/profile"             element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/analytics"           element={<ProtectedRoute><TopSpendingPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
