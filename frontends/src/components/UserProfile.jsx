import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaGraduationCap, FaCog } from 'react-icons/fa';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'student',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      // Call API to update user profile
      await updateUserProfile(formData);
      setIsEditing(false);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setIsSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const navigateToSettings = (settingType) => {
    navigate(`/settings/${settingType}`);
  };

  if (!user) {
    return <div className="loading-profile">Loading user profile...</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        {!isEditing ? (
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
            disabled={isSaving}
          >
            Edit Profile
          </button>
        ) : (
          <button 
            className="cancel-button"
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-info">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser /> Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">
                  <FaGraduationCap /> Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
                <small>Role cannot be changed</small>
              </div>

              <button 
                type="submit" 
                className="save-button"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-item">
                <FaUser className="icon" />
                <div>
                  <h3>Name</h3>
                  <p>{user.name}</p>
                </div>
              </div>

              <div className="detail-item">
                <FaEnvelope className="icon" />
                <div>
                  <h3>Email</h3>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="detail-item">
                <FaGraduationCap className="icon" />
                <div>
                  <h3>Role</h3>
                  <p>{user.role === 'student' ? 'Student' : 
                     user.role === 'teacher' ? 'Teacher' : 'Administrator'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="settings-shortcuts">
          <h2>Settings</h2>
          <div className="settings-grid">
            <div 
              className="settings-card" 
              onClick={() => navigateToSettings('accessibility')}
            >
              <FaCog className="settings-icon" />
              <h3>Accessibility</h3>
              <p>Customize text-to-speech, display, and navigation options</p>
            </div>

            <div 
              className="settings-card" 
              onClick={() => navigateToSettings('cultural')}
            >
              <FaCog className="settings-icon" />
              <h3>Cultural Adaptation</h3>
              <p>Adjust content to match your cultural preferences</p>
            </div>

            <div 
              className="settings-card" 
              onClick={() => navigateToSettings('translation')}
            >
              <FaCog className="settings-icon" />
              <h3>Translation</h3>
              <p>Configure language and translation settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;