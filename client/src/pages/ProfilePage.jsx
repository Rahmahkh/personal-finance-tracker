import React, { useState } from 'react';
import { useFormik } from 'formik';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import { profileSchema, changePasswordSchema } from '../utils/validationSchemas';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import useAuth from '../hooks/useAuth';
import { formatDate } from '../utils/formatters';
import './ProfilePage.css';

const IconPerson = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const IconWarning = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { success, error }           = useToast();
  const navigate                     = useNavigate();
  const [profileLoading, setProfileLoading]   = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const daysActive = user?.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt)) / 86400000)
    : 0;

  const profileFormik = useFormik({
    initialValues: { name: user?.name || '', email: user?.email || '' },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setProfileLoading(true);
      try {
        const updated = await userService.updateProfile(values);
        updateUser(updated);
        success('Profile updated successfully!');
      } catch (err) {
        error(err?.response?.data?.message || 'Failed to update profile');
      } finally {
        setProfileLoading(false);
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      setPasswordLoading(true);
      try {
        await userService.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        success('Password changed successfully!');
        resetForm();
      } catch (err) {
        error(err?.response?.data?.message || 'Failed to change password');
      } finally {
        setPasswordLoading(false);
      }
    },
  });

  const pf = (formik, name) => ({
    name, id: name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    className: `profile-input ${formik.touched[name] && formik.errors[name] ? 'profile-input--error' : ''}`,
  });

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <DashboardLayout>
      <div className="profile-page">
        <div className="profile-page-header">
          <h1 className="profile-title">Profile Settings</h1>
          <p className="profile-sub">Manage your account information</p>
        </div>

        <div className="profile-content">
          {/* Left: Avatar card */}
          <div className="profile-sidebar-card">
            <div className="profile-cover" />
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-large">{initials}</div>
            </div>
            <div className="profile-card-body">
              <h3 className="profile-name">{user?.name}</h3>
              <p className="profile-email">{user?.email}</p>
              <span className="profile-status-badge">● Active</span>

              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="profile-stat-value">{formatDate(user?.createdAt)}</span>
                  <span className="profile-stat-label">Member Since</span>
                </div>
                <div className="profile-stat-divider" />
                <div className="profile-stat">
                  <span className="profile-stat-value">{daysActive}</span>
                  <span className="profile-stat-label">Days Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Forms */}
          <div className="profile-forms">
            {/* Personal info */}
            <section className="profile-section">
              <h2 className="profile-section-title">
                <span className="profile-section-icon profile-section-icon--primary"><IconPerson /></span>
                Personal Information
              </h2>
              <form className="profile-form" onSubmit={profileFormik.handleSubmit} noValidate>
                <div className="profile-row">
                  <div className="profile-field">
                    <label className="profile-label" htmlFor="name">Full name</label>
                    <input type="text" autoComplete="name" {...pf(profileFormik, 'name')} />
                    {profileFormik.touched.name && profileFormik.errors.name && (
                      <p className="profile-error">{profileFormik.errors.name}</p>
                    )}
                  </div>
                  <div className="profile-field">
                    <label className="profile-label" htmlFor="email">Email address</label>
                    <input type="email" autoComplete="email" {...pf(profileFormik, 'email')} />
                    {profileFormik.touched.email && profileFormik.errors.email && (
                      <p className="profile-error">{profileFormik.errors.email}</p>
                    )}
                  </div>
                </div>
                <div className="profile-form-actions">
                  <Button type="submit" loading={profileLoading}>Save Changes</Button>
                </div>
              </form>
            </section>

            {/* Password */}
            <section className="profile-section">
              <h2 className="profile-section-title">
                <span className="profile-section-icon profile-section-icon--warning"><IconLock /></span>
                Change Password
              </h2>
              <form className="profile-form" onSubmit={passwordFormik.handleSubmit} noValidate>
                <div className="profile-field">
                  <label className="profile-label" htmlFor="currentPassword">Current password</label>
                  <input type="password" autoComplete="current-password" placeholder="Enter current password" {...pf(passwordFormik, 'currentPassword')} />
                  {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword && (
                    <p className="profile-error">{passwordFormik.errors.currentPassword}</p>
                  )}
                </div>
                <div className="profile-row">
                  <div className="profile-field">
                    <label className="profile-label" htmlFor="newPassword">New password</label>
                    <input type="password" autoComplete="new-password" placeholder="At least 6 characters" {...pf(passwordFormik, 'newPassword')} />
                    {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                      <p className="profile-error">{passwordFormik.errors.newPassword}</p>
                    )}
                  </div>
                  <div className="profile-field">
                    <label className="profile-label" htmlFor="confirmNewPassword">Confirm new password</label>
                    <input type="password" autoComplete="new-password" placeholder="Repeat new password" {...pf(passwordFormik, 'confirmNewPassword')} />
                    {passwordFormik.touched.confirmNewPassword && passwordFormik.errors.confirmNewPassword && (
                      <p className="profile-error">{passwordFormik.errors.confirmNewPassword}</p>
                    )}
                  </div>
                </div>
                <div className="profile-form-actions">
                  <Button type="submit" variant="outline" loading={passwordLoading}>Update Password</Button>
                </div>
              </form>
            </section>

            {/* Danger Zone */}
            <section className="profile-section profile-section--danger">
              <h2 className="profile-section-title profile-section-title--danger">
                <span className="profile-section-icon profile-section-icon--danger"><IconWarning /></span>
                Danger Zone
              </h2>
              <div className="danger-zone-body">
                <div>
                  <p className="danger-zone-label">Delete Account</p>
                  <p className="danger-zone-desc">Permanently delete your account and all associated data. This action cannot be undone.</p>
                </div>
                {!showDeleteConfirm ? (
                  <button className="danger-btn" onClick={() => setShowDeleteConfirm(true)}>
                    Delete Account
                  </button>
                ) : (
                  <div className="danger-confirm">
                    <p className="danger-confirm-text">Are you sure? This cannot be undone.</p>
                    <div className="danger-confirm-actions">
                      <button className="danger-btn" disabled={deleteLoading} onClick={async () => {
                        setDeleteLoading(true);
                        try {
                          await userService.deleteAccount();
                          logout();
                          navigate('/');
                        } catch (err) {
                          error(err?.response?.data?.message || 'Failed to delete account');
                          setDeleteLoading(false);
                        }
                      }}>{deleteLoading ? 'Deleting...' : 'Yes, Delete'}</button>
                      <button className="danger-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
