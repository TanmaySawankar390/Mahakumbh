import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const UserIPFetcher = () => {
  const [ip, setIp] = useState(null);
  const [dataSent, setDataSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  // Check what authentication data is actually available
  const determineUsername = () => {
    // Try all possible paths where username might be found
    if (auth?.username && auth.username !== "undefined") return auth.username;
    if (auth?.user?.name) return auth.user.name;
    if (auth?.user?.username) return auth.user.username;
    if (auth?.user?.email) return auth.user.email;
    if (auth?.currentUser?.displayName) return auth.currentUser.displayName;
    if (auth?.currentUser?.email) return auth.currentUser.email;
    return "Anonymous User";
  };

  useEffect(() => {
    // Check if auth context has loaded
    const authLoaded = auth !== undefined && auth !== null;
    setLoading(!authLoaded);
  }, [auth]);

  useEffect(() => {
    // Don't proceed if still loading or data already sent
    if (loading || dataSent) return;

    // Function to get user's IP and send data to backend
    const fetchIPAndSendData = async () => {
      try {
        // Get IP address
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;
        setIp(userIP);

        // Get geolocation using browser API
        let coordinates = null;
        let locationAccuracy = "low";

        try {
          if (navigator.geolocation) {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                enableHighAccuracy: true,
                maximumAge: 0,
              });
            });

            coordinates = [position.coords.longitude, position.coords.latitude];
            locationAccuracy = "high";
          }
        } catch (geoError) {
          // Fallback to approximate coordinates
          coordinates = [-73.935242, 40.73061];
        }

        // Ensure we have coordinates one way or another
        if (!coordinates) {
          coordinates = [-73.935242, 40.73061]; // Default coordinates
        }

        // Use our function to determine the username
        const actualUsername = determineUsername();

        // Prepare user data
        const userData = {
          name: actualUsername,
          location: {
            type: "Point",
            coordinates: coordinates,
            accuracy: locationAccuracy,
          },
          callPermission: false,
          ipAddress: userIP,
        };

        // Send data to backend
        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include",
        });

        if (response.ok) {
          setDataSent(true);
        }
      } catch (error) {
        console.error("Error in data collection process:", error.message);
      }
    };

    fetchIPAndSendData();
  }, [auth, dataSent, loading]);

  // Component renders nothing visibly
  return null;
};

export default UserIPFetcher;
