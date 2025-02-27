import React, { useState, useEffect } from "react";

const UserLocationDisplay = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Unable to retrieve your location");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  }, []);

  return (
    <div className="location-display-card">
      <div className="location-display-header">
        <div className="location-icon">📍</div>
        <h3>Your Current Location</h3>
      </div>

      <div className="location-display-content">
        {loading ? (
          <div className="location-loading">
            <div className="location-spinner"></div>
            <p>Detecting your location...</p>
          </div>
        ) : error ? (
          <div className="location-error">
            <p>{error}</p>
          </div>
        ) : (
          <div className="location-coordinates">
            <div className="coordinate-item">
              <span className="coordinate-label">Latitude</span>
              <span className="coordinate-value">
                {location?.latitude.toFixed(6)}°
              </span>
            </div>
            <div className="coordinate-item">
              <span className="coordinate-label">Longitude</span>
              <span className="coordinate-value">
                {location?.longitude.toFixed(6)}°
              </span>
            </div>
            <a
              href={`https://maps.google.com/?q=${location?.latitude},${location?.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              View on Map
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLocationDisplay;
