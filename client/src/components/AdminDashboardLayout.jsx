import React, { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import UserLocationDisplay from "./UserLocationDisplay";

const DashboardLayout = () => {
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
        // You might want to use the fallback if the fetched location is off:
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
      {/* Header with Logout Button */}
      <div className="ip-header">
        <h1>Mahakumbh Digital Presence</h1>
        <p>Discover your online footprint and digital identity</p>
        <div className="logout-button-container">
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
      <div className="safe-route-info">
        <h3>Safe, Medium & Danger Areas</h3>
        {loadingRoute ? (
          <p>Loading safe route...</p>
        ) : routeError ? (
          <p className="error-message">Error: {routeError}</p>
        ) : safeRoute ? (
          <div>
            <p>
              <strong>Recommended Safe Zone:</strong>{" "}
              {safeRoute.recommendedZone.cameraName}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {safeRoute.recommendedZone.location.coordinates.join(", ")}
            </p>
            <p>
              <strong>Traffic Level:</strong> {safeRoute.recommendedZone.traffic}
            </p>
            <h4>Nearby Areas:</h4>
            <ul>
              {safeRoute.nearbyCameras.map((camera) => (
                <li key={camera._id}>
                  {camera.cameraName} - Traffic: {camera.traffic}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No safe route data available.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;


// import React, { useState, useEffect } from "react";
// import LogoutButton from "./LogoutButton";
// import UserLocationDisplay from "./UserLocationDisplay";

// const DashboardLayout = () => {
//   const [ip, setIp] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [showAnimation, setShowAnimation] = useState(false);

//   // State for safe route information
//   const [safeRoute, setSafeRoute] = useState(null);
//   const [loadingRoute, setLoadingRoute] = useState(false);
//   const [routeError, setRouteError] = useState(null);

//   // Fallback coordinates (used only if fetching location fails)
//   const fallbackCoordinates = {
//     latitude: 28.796606,
//     longitude: 77.538270,
//   };

//   // Function to fetch the user's IP and location
//   const getUserIP = async () => {
//     setLoading(true);
//     setShowAnimation(true);
//     setError(null);
//     try {
//       const response = await fetch("https://api64.ipify.org?format=json");
//       const data = await response.json();
//       setIp(data.ip);
//       // Try fetching geolocation based on IP
//       try {
//         const geoResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
//         const geoData = await geoResponse.json();
//         console.log("Raw geoData from ipapi:", geoData);
//         const lat = parseFloat(geoData.latitude);
//         const lon = parseFloat(geoData.longitude);
//         // Use the fetched values if valid, otherwise fallback
//         if (!lat || !lon) {
//           setLocation(fallbackCoordinates);
//         } else {
//           setLocation({ ...geoData, latitude: lat, longitude: lon });
//         }
//       } catch (geoErr) {
//         console.log("Could not fetch location data, using fallback");
//         setLocation(fallbackCoordinates);
//       }
//     } catch (err) {
//       setError("Failed to fetch IP address");
//     } finally {
//       setLoading(false);
//       setTimeout(() => setShowAnimation(false), 1500);
//     }
//   };

//   // Function to fetch safe route data from your backend API using the local location
//   const fetchSafeRoute = async () => {
//     // Use local location if available, otherwise fallback.
//     const lat = (location && location.latitude) || fallbackCoordinates.latitude;
//     const lon = (location && location.longitude) || fallbackCoordinates.longitude;
//     setLoadingRoute(true);
//     setRouteError(null);
//     try {
//       const url = `http://localhost:5000/api/navigation/safeway?longitude=${lon}&latitude=${lat}`;
//       console.log("Fetching safe route with coordinates:", { longitude: lon, latitude: lat });
//       const response = await fetch(url);
//       const data = await response.json();
//       console.log("Safe route API response:", data);
//       if (response.ok) {
//         setSafeRoute(data);
//       } else {
//         setRouteError(data.error || "Failed to fetch safe route");
//       }
//     } catch (err) {
//       console.error("Error fetching safe route:", err);
//       setRouteError("Error fetching safe route");
//     } finally {
//       setLoadingRoute(false);
//     }
//   };

//   // Auto-fetch IP on component mount
//   useEffect(() => {
//     getUserIP();
//   }, []);

//   // Once location is available (or updated), fetch safe route info
//   useEffect(() => {
//     if (location && location.latitude && location.longitude) {
//       fetchSafeRoute();
//     }
//   }, [location]);

//   return (
//     <div className="ip-fetcher-container">
//       {/* Header with Logout Button */}
//       <div className="ip-header">
//         <h1>Mahakumbh Digital Presence</h1>
//         <p>Discover your online footprint and digital identity</p>
//         <div className="logout-button-container">
//           <LogoutButton />
//         </div>
//       </div>

//       {/* Location Display */}
//       <UserLocationDisplay />

//       {/* IP Card Section */}
//       <div className="ip-card">
//         <div className={`ip-visualization ${showAnimation ? "animating" : ""}`}>
//           {showAnimation ? (
//             <div className="radar-animation">
//               <div className="radar-circle"></div>
//               <div className="radar-sweep"></div>
//             </div>
//           ) : ip ? (
//             <div className="ip-result">
//               <div className="ip-globe">🌎</div>
//               <div className="ip-address">{ip}</div>
//             </div>
//           ) : (
//             <div className="ip-placeholder">
//               <div className="ip-globe-placeholder">?</div>
//             </div>
//           )}
//         </div>

//         <button onClick={getUserIP} className="fetch-button" disabled={loading}>
//           {loading ? "Discovering..." : "Reveal My Digital Identity"}
//         </button>

//         {error && (
//           <div className="error-message">
//             <span>⚠️</span> {error}
//           </div>
//         )}

//         {location && (
//           <div className="location-info">
//             <h3>Your Digital Footprint</h3>
//             <div className="location-grid">
//               <div className="location-item">
//                 <span className="location-label">City</span>
//                 <span className="location-value">{location.city || "Unknown"}</span>
//               </div>
//               <div className="location-item">
//                 <span className="location-label">Region</span>
//                 <span className="location-value">{location.region || "Unknown"}</span>
//               </div>
//               <div className="location-item">
//                 <span className="location-label">Country</span>
//                 <span className="location-value">{location.country_name || "Unknown"}</span>
//               </div>
//               <div className="location-item">
//                 <span className="location-label">ISP</span>
//                 <span className="location-value">{location.org || "Unknown"}</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Safe Route / Area Information Section */}
//       <div className="safe-route-info">
//         <h3>Safe, Medium & Danger Areas</h3>
//         {loadingRoute ? (
//           <p>Loading safe route...</p>
//         ) : routeError ? (
//           <p className="error-message">Error: {routeError}</p>
//         ) : safeRoute ? (
//           <div>
//             <h4>Recommended Safe Zone</h4>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Camera Name</th>
//                   <th>Location</th>
//                   <th>Traffic Level</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>{safeRoute.recommendedZone.cameraName}</td>
//                   <td>{safeRoute.recommendedZone.location.coordinates.join(", ")}</td>
//                   <td>{safeRoute.recommendedZone.traffic}</td>
//                 </tr>
//               </tbody>
//             </table>
//             <h4>Nearby Areas</h4>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Camera Name</th>
//                   <th>Location</th>
//                   <th>Traffic Level</th>
//                   <th>Category</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeRoute.nearbyCameras.map((camera) => (
//                   <tr key={camera._id}>
//                     <td>{camera.cameraName}</td>
//                     <td>{camera.location.coordinates.join(", ")}</td>
//                     <td>{camera.traffic}</td>
//                     <td>{camera.trafficCategory || "N/A"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p>No safe route data available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
