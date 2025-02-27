import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const UserIPFetcher = () => {
  const [ip, setIp] = useState(null);
  const [dataSent, setDataSent] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    // Proceed only when Auth0 is not loading and user is authenticated
    if (isLoading || !isAuthenticated || dataSent) return;

    const fetchIPAndSendData = async () => {
      try {
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;
        setIp(userIP);

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
          coordinates = [-73.935242, 40.73061];
        }
        if (!coordinates) {
          coordinates = [-73.935242, 40.73061];
        }

        const normalizedUserId = user?.sub.includes("|")
          ? user.sub.split("|")[1]
          : user?.sub;

        const userData = {
          userid: normalizedUserId,
          name: user?.name || user?.email || "Anonymous User",
          location: {
            type: "Point",
            coordinates: coordinates,
            accuracy: locationAccuracy,
          },
          callPermission: false,
          ipAddress: userIP,
        };

        const response = await fetch("https://mahakumbh-5.onrender.com/api/users", {
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
  }, [isLoading, isAuthenticated, dataSent, user]);

  // Component renders nothing visibly
  return null;
};

export default UserIPFetcher;
