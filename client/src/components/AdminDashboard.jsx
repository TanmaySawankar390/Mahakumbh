import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import LogoutButton from "./LogoutButton";
import UserLocationDisplay from "./UserLocationDisplay";

const AdminDashboard = () => {
  const [ip, setIp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  // New state for safe route information
  const [safeRoute, setSafeRoute] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState(null);

  // Fallback coordinates for Ghaziabad (the ones that work)
  const fallbackCoordinates = {
    latitude: 28.796606,
    longitude: 77.538270,
  };

  // Function to fetch the user's IP and location
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
        console.log("Raw geoData from ipapi:", geoData);
        // Explicitly convert latitude and longitude to numbers
        const lat = parseFloat(geoData.latitude);
        const lon = parseFloat(geoData.longitude);
        // Use fallback if the fetched location is not valid
        if (!lat || !lon) {
          setLocation(fallbackCoordinates);
        } else {
          setLocation({ ...geoData, latitude: lat, longitude: lon });
        }
      } catch (geoErr) {
        console.log("Could not fetch location data, using fallback");
        setLocation(fallbackCoordinates);
      }
    } catch (err) {
      setError("Failed to fetch IP address");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setShowAnimation(false);
      }, 1500);
    }
  };

  // Function to fetch safe route data from your backend API using fallback coordinates
  const fetchSafeRoute = async () => {
    // Always use fallback coordinates for this demo
    const lat = fallbackCoordinates.latitude;
    const lon = fallbackCoordinates.longitude;
    setLoadingRoute(true);
    setRouteError(null);
    try {
      const url = `http://localhost:5000/api/navigation/safeway?longitude=${lon}&latitude=${lat}`;
      console.log("Fetching safe route with fallback coordinates:", { longitude: lon, latitude: lat });
      const response = await fetch(url);
      const data = await response.json();
      console.log("Safe route API response:", data);
      if (response.ok) {
        setSafeRoute(data);
      } else {
        setRouteError(data.error || "Failed to fetch safe route");
      }
    } catch (err) {
      console.error("Error fetching safe route:", err);
      setRouteError("Error fetching safe route");
    } finally {
      setLoadingRoute(false);
    }
  };

  // Click handler for the Police Alert button
  const handlePoliceClick = () => {
    alert("Alert sent successfully");
  };

  // Auto-fetch IP on component mount
  useEffect(() => {
    getUserIP();
  }, []);

  // For demo, fetch safe route immediately (using fallback coordinates)
  useEffect(() => {
    fetchSafeRoute();
  }, []);

  return (
    <div className="ip-fetcher-container">
      {/* Header with additional navigation buttons */}
      <div className="ip-header">
        <h1>Mahakumbh Digital Presence</h1>
        <p>Discover your online footprint and digital identity</p>
        <div className="button-container">
          <Link to="/users" className="users-button">
            👥 All Users
          </Link>
          <button onClick={handlePoliceClick} className="police-button">
            🚓 Police Alert
          </button>
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

      {/* Safe Route / Area Information Section */}
      <div
  className="safe-route-info"
  style={{
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  }}
>
  <h3
    style={{
      fontSize: "1.5rem",
      color: "#333",
      borderBottom: "2px solid #007bff",
      paddingBottom: "10px",
      marginBottom: "20px",
    }}
  >
    Safe, Medium & Danger Areas
  </h3>
  {loadingRoute ? (
    <p style={{ color: "#555", fontSize: "1rem" }}>Loading safe route...</p>
  ) : routeError ? (
    <p style={{ color: "red", fontWeight: "bold" }}>
      Error: {routeError}
    </p>
  ) : safeRoute ? (
    <div>
      {/* Recommended Safe Zone Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th
              colSpan="2"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px 8px 0 0",
                textAlign: "left",
              }}
            >
              Recommended Safe Zone
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                fontWeight: "bold",
                width: "40%",
              }}
            >
              Camera Name
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {safeRoute.recommendedZone.cameraName}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                fontWeight: "bold",
              }}
            >
              Location
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {safeRoute.recommendedZone.location.coordinates.join(", ")}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                fontWeight: "bold",
              }}
            >
              Traffic Level
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {safeRoute.recommendedZone.traffic}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Nearby Areas Table */}
      <h4 style={{ marginBottom: "10px", color: "#007bff" }}>Nearby Areas</h4>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Camera Name
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Traffic Level
            </th>
          </tr>
        </thead>
        <tbody>
          {safeRoute.nearbyCameras.map((camera) => (
            <tr key={camera._id}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {camera.cameraName}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {camera.traffic}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p style={{ color: "#000" }}>No safe route data available.</p>
  )}
</div>

    </div>
  );
};

export default AdminDashboard;