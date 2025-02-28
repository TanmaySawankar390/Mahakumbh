import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import LogoutButton from "./LogoutButton";
import UserLocationDisplay from "./UserLocationDisplay";
import UserIPFetcher from "./UserIPFetcher";
import { io } from "socket.io-client";

const DashboardLayout = () => {
  const [ip, setIp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

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
        console.log("Could not fetch location data using optional method");
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

  // Setup socket connection to backend (using port 3000)
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("connect", () => {
      console.log("Connected to backend via socket:", socket.id);
    });
    socket.on("alert", (data) => {
      console.log("Received alert via socket:", data);
      // Enhanced alert message combining alert text with dummy IP address
      setAlertMessage(`🚨 ${data.alert} [IP: ${data.ip}]`);
      // Clear alert after 5 seconds
      setTimeout(() => setAlertMessage(null), 5000);
    });

    // Cleanup on component unmount
    return () => socket.disconnect();
  }, []);

  // Auto-fetch IP on component mount
  useEffect(() => {
    getUserIP();
  }, []);

  return (
    <div className="ip-fetcher-container" style={{ padding: "1rem" }}>
      {/* Alert Banner */}
      {alertMessage && (
        <div
          className="alert-banner"
          style={{
            backgroundColor: "#ff4757",
            color: "white",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>🚨</span>
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Hidden IP fetcher for background functionality */}
      <div style={{ display: "none" }}>
        <UserIPFetcher />
      </div>

      {/* Header Content */}
      <div className="ip-header" style={{ marginBottom: "1rem" }}>
        <h1>Suraksha Mitra</h1>
        <p>Discover your online footprint and digital identity</p>
        <div className="button-container" style={{ marginTop: "0.5rem" }}>
          <Link
            to="/profile"
            className="profile-button"
            style={{
              marginRight: "1rem",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            👤 Profile
          </Link>
          <Link to="/admin-dashboard" className="admin-switch">
             
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Location Display */}
      <UserLocationDisplay />

      {/* IP Card Section */}
      <div
        className="ip-card"
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className={`ip-visualization ${showAnimation ? "animating" : ""}`}
          style={{ marginBottom: "1rem", textAlign: "center" }}
        >
          {showAnimation ? (
            <div className="radar-animation">
              <div
                className="radar-circle"
                style={{
                  margin: "0 auto",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "#f1f1f1",
                }}
              ></div>
              <div
                className="radar-sweep"
                style={{
                  margin: "0 auto",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "conic-gradient(#ff4757, transparent)",
                }}
              ></div>
            </div>
          ) : ip ? (
            <div className="ip-result" style={{ fontSize: "1.25rem" }}>
              <div className="ip-globe">🌎</div>
              <div className="ip-address">{ip}</div>
            </div>
          ) : (
            <div
              className="ip-placeholder"
              style={{ fontSize: "1.25rem", color: "#aaa" }}
            >
              <div className="ip-globe-placeholder">?</div>
            </div>
          )}
        </div>

        <button
          onClick={getUserIP}
          className="fetch-button"
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#1e90ff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Discovering..." : "Reveal My Digital Identity"}
        </button>

        {error && (
          <div
            className="error-message"
            style={{ color: "#ff4757", marginTop: "0.5rem" }}
          >
            <span>⚠️</span> {error}
          </div>
        )}

        {location && (
          <div className="location-info" style={{ marginTop: "1rem" }}>
            <h3>Your Digital Footprint</h3>
            <div
              className="location-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "0.5rem",
              }}
            >
              <div className="location-item">
                <span className="location-label" style={{ fontWeight: "bold" }}>
                  City:
                </span>
                <span className="location-value">
                  {location.city || "Unknown"}
                </span>
              </div>
              <div className="location-item">
                <span className="location-label" style={{ fontWeight: "bold" }}>
                  Region:
                </span>
                <span className="location-value">
                  {location.region || "Unknown"}
                </span>
              </div>
              <div className="location-item">
                <span className="location-label" style={{ fontWeight: "bold" }}>
                  Country:
                </span>
                <span className="location-value">
                  {location.country_name || "Unknown"}
                </span>
              </div>
              <div className="location-item">
                <span className="location-label" style={{ fontWeight: "bold" }}>
                  ISP:
                </span>
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
