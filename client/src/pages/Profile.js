import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css';

const Profile = ({ onClose }) => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.patch('/users/profile', { name });
      toast.success('Name updated!');
      // Refresh user in context by re-fetching
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    try {
      await api.patch('/users/password', passwords);
      toast.success('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Your profile</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Avatar placeholder */}
        <div className="profile-avatar">
          <span>{user?.name?.charAt(0).toUpperCase()}</span>
        </div>
        <p className="profile-email">{user?.email}</p>

        {/* Name form */}
        <form onSubmit={handleProfileSave} className="profile-section">
          <h3>Display name</h3>
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={savingProfile}>
            {savingProfile ? 'Saving…' : 'Save name'}
          </button>
        </form>

        <div className="profile-divider" />

        {/* Password form */}
        <form onSubmit={handlePasswordSave} className="profile-section">
          <h3>Change password</h3>
          <div className="form-group">
            <label>Current password</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>New password</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={savingPassword}>
            {savingPassword ? 'Updating…' : 'Change password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
