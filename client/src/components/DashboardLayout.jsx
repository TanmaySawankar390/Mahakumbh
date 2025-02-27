import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import LogoutButton from "./LogoutButton";
import UserLocationDisplay from "./UserLocationDisplay";
import UserIPFetcher from "./UserIPFetcher";
// import "/styles/Dashboard.css";

const DashboardLayout = () => {
  const [ip, setIp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const getUserIP = async () => {
    setLoading(true);
    setShowAnimation(true);
    setError(null);

    try {
      const response = await fetch("https://api64.ipify.org?format=json");
      const data = await response.json();
      setIp(data.ip);

      // Optional: Get location data based on IP
      try {
        const geoResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
        const geoData = await geoResponse.json();
        setLocation(geoData);
      } catch (geoErr) {
        console.log("Could not fetch location data using opitonal method");
      }
    } catch (err) {
      setError("Failed to fetch IP address");
    } finally {
      setLoading(false);

      // Keep animation visible for at least 1.5 seconds for effect
      setTimeout(() => {
        setShowAnimation(false);
      }, 1500);
    }
  };

  // Auto-fetch IP on component mount
  useEffect(() => {
    getUserIP();
  }, []);

  return (
    <div className="ip-fetcher-container">
      {/* Include UserIPFetcher with display:none to maintain data sending functionality */}
      <div style={{ display: "none" }}>
        <UserIPFetcher />
      </div>

      {/* Header with Logout Button */}
      <div className="ip-header">
        <h1>Suraksha Mitra</h1>
        <p>Discover your online footprint and digital identity</p>
        <div className="button-container">
          <Link to="/profile" className="profile-button">
            👤 Profile
          </Link>
          <Link to="/users" className="users-button">
            👥 All Users
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Location Display */}
      <UserLocationDisplay />

      {/* IP Card Section */}
      <div className="ip-card">
        <div className={`ip-visualization ${showAnimation ? "animating" : ""}`}>
          {showAnimation ? (
            <div className="radar-animation">
              <div className="radar-circle"></div>
              <div className="radar-sweep"></div>
            </div>
          ) : ip ? (
            <div className="ip-result">
              <div className="ip-globe">🌎</div>
              <div className="ip-address">{ip}</div>
            </div>
          ) : (
            <div className="ip-placeholder">
              <div className="ip-globe-placeholder">?</div>
            </div>
          )}
        </div>

        <button onClick={getUserIP} className="fetch-button" disabled={loading}>
          {loading ? "Discovering..." : "Reveal My Digital Identity"}
        </button>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {location && (
          <div className="location-info">
            <h3>Your Digital Footprint</h3>
            <div className="location-grid">
              <div className="location-item">
                <span className="location-label">City</span>
                <span className="location-value">
                  {location.city || "Unknown"}
                </span>
              </div>
              <div className="location-item">
                <span className="location-label">Region</span>
                <span className="location-value">
                  {location.region || "Unknown"}
                </span>
              </div>
              <div className="location-item">
                <span className="location-label">Country</span>
                <span className="location-value">
                  {location.country_name || "Unknown"}
                </span>
              </div>
              <div className="location-item">
                <span className="location-label">ISP</span>
                <span className="location-value">
                  {location.org || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
