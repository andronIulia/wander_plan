import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css';

const Profile = ({ onClose }) => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  
  const [savingProfile, setSavingProfile] = useState(false);
  

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.patch('/users/profile', { name });
      toast.success('Name updated!');
      
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
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
      </div>
    </div>
  );
};

export default Profile;
