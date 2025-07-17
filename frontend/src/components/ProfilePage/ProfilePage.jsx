import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

const emptyProfile = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

function ProfilePage() {
  const [profile, setProfile] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(emptyProfile);
  const token = localStorage.getItem('token');
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Load user details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setOriginalProfile(data);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleEdit = () => {
    setOriginalProfile(profile);
    setEditing(true);
    setSuccess(false);
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setEditing(false);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditing(false);
    setOriginalProfile(profile);
    const res = await fetch(`${API_BASE_URL}/api/auth/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });
    if (res.ok) {
      setSuccess(true);
    }
  };

  return (
    <div className="profile-page-container">
      <h2 className="profile-title">Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit} autoComplete="off">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            readOnly={!editing}
            required
            autoComplete="name"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={profile.email}
            readOnly
            required
            autoComplete="email"
          />
        </label>
        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            readOnly={!editing}
            required
            autoComplete="tel"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            readOnly={!editing}
            required
            autoComplete="new-password"
          />
        </label>
        <div className="profile-form-actions">
          {!editing ? (
            <button type="button" onClick={handleEdit} className="edit-btn">Edit</button>
          ) : (
            <>
              <button type="submit" className="save-btn">Update</button>
              <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
            </>
          )}
        </div>
        {success && <div className="profile-success">Profile updated successfully!</div>}
      </form>
    </div>
  );
}

export default ProfilePage; 