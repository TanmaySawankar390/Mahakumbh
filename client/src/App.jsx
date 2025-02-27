import React from 'react';
import { Auth0Provider, useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import UserIPFetcher from './components/UserIPFetcher';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './components/LandingPage';
import './App.css';

// Protected route wrapper
const ProtectedRoute = ({ component, ...args }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Securely redirecting you to login...</p>
      </div>
    ),
  });
  return <Component {...args} />;
};

const App = () => {
  return (
    // <LogoutButton><LogoutButton/>
    <Auth0Provider
      domain="dev-npxp43tyv3lxsw60.jp.auth0.com"
      clientId="hGLiZ4PzvkAyqnA0tRBEpPqRd7NpxKdG"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Router>
        <AppContent />
      </Router>
      
    </Auth0Provider>
    
  );
};

const AppContent = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading the magic...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute 
              component={() => (
                <DashboardLayout>
                  <UserIPFetcher />
                </DashboardLayout>
              )} 
            />
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute 
              component={() => (
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              )} 
            />
          } 
        />
      </Routes>
    </div>
  );
};

export default App;