import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="profile-container">
      {/* Header with Dashboard and Logout buttons */}
      <div className="profile-header">
        <div className="profile-actions">
          <Link to="/dashboard" className="dashboard-button">🏠 Dashboard</Link>
          <LogoutButton />
        </div>
        
        <img src={user.picture} alt={user.name} className="profile-picture" />
        <h2>{user.name}</h2>
        <p className="email">{user.email}</p>
      </div>

      <div className="profile-details">
        <h3>Profile Information</h3>
        <div className="profile-info">
          <p><strong>Nickname:</strong> {user.nickname || 'Not provided'}</p>
          <p><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</p>
          <p><strong>Updated At:</strong> {new Date(user.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
