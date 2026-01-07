import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import Navigation from './Navigation';
import './UserProfile.css';

const UserProfile = () => {
  const { username } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    state: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfile({
          fullName: data.fullName || '',
          email: data.email || '',
          state: data.state || '',
          username: data.username || username
        });
      } catch (err) {
        // If profile not found, keep defaults
        console.error('Error fetching profile', err);
        setProfile({
          fullName: '',
          email: '',
          state: '',
          username
        });
      }
    };
    fetchProfile();
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updateData = {
        fullName: profile.fullName,
        email: profile.email,
        state: profile.state
      };

      await userService.updateProfile(updateData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <Navigation />

      <div className="profile-content">
        <div className="profile-card">
          <h2>Personal Information</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                disabled
                className="disabled-input"
              />
              <small className="form-hint">Username cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                required={isEditing}
                className={isEditing ? "form-input" : "disabled-input"}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                required={isEditing}
                className={isEditing ? "form-input" : "disabled-input"}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={profile.state}
                onChange={handleChange}
                disabled={!isEditing}
                required={isEditing}
                className={isEditing ? "form-input" : "disabled-input"}
                placeholder="Enter your state"
              />
            </div>

            <div className="form-actions">
              {!isEditing ? (
                <button type="button" onClick={handleEdit} className="edit-button">
                  Edit Profile
                </button>
              ) : (
                <>
                  <button type="button" onClick={handleCancel} className="cancel-button">
                    Cancel
                  </button>
                  <button type="submit" className="save-button" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

