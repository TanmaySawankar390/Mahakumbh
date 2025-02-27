import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LandingPage = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = (role) => {
    loginWithRedirect({
      appState: { target: role === "user" ? "/dashboard" : "/admin-dashboard" },
    });
  };

  return (
    <div className="landing-page">
      <div className="landing-overlay"></div>
      <div className="landing-content">
        <div className="logo-container">
          <div className="logo-icon">🔮</div>
          <h1 className="font">SurakshaMitra</h1>
        </div>
        <h2>Discover Your Digital Presence</h2>
        <p>Unlock powerful insights about your online footprint with our secure platform.</p>

        <div className="features-container">
          <div className="feature">
            <div className="feature-icon">🌐</div>
            <h3>IP Tracking</h3>
            <p>Instantly discover your public IP address</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure Access</h3>
            <p>Enterprise-grade authentication</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🚀</div>
            <h3>Lightning Fast</h3>
            <p>Get results in milliseconds</p>
          </div>
        </div>

        <div className="login-options">
          <button onClick={() => handleLogin('user')} className="cta-button">
            Login as User
          </button>
          <button onClick={() => handleLogin('admin')} className="cta-button admin-button">
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
