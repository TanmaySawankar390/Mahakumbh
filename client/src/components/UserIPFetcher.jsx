import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const UserIPFetcher = () => {
  const [ip, setIp] = useState(null);
  const [error, setError] = useState(null);
  const { username } = useAuth();

  const getUserIP = async () => {
    try {
      const response = await fetch("https://api64.ipify.org?format=json");
      const data = await response.json();
      console.log("Fetched IP Address:", data.ip); // Console log the IP
      setIp(data.ip);
    } catch (err) {
      console.error("Error fetching IP:", err); // Log error to console
      setError("Failed to fetch IP address");
    }
  };

  useEffect(() => {
    const userData = {
      name: username || "Anonymous", // replace with actual data if available
      location: {
        type: "Point",
        coordinates: [-73.935242, 40.73061], // sample [longitude, latitude]
      },
      callPermission: false,
      ipAddress: ip, // sample IP address; replace if dynamic IP is available
    };

    fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        console.log("Raw response:", res);
        return res.json();
      })
      .then((data) => console.log("User data sent:", data))
      .catch((error) => console.error("Failed to send user data:", error));
  }, [username]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #FF8C00, #FFD700)",
        padding: "20px",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "16px",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        Mahakumbh IP Address Fetcher
      </h1>
      <button
        onClick={getUserIP}
        style={{
          padding: "12px 24px",
          backgroundColor: "#DC2626",
          color: "white",
          fontWeight: "bold",
          borderRadius: "9999px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          border: "none",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#B91C1C")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#DC2626")}
      >
        Get My IP Address
      </button>
      {ip && (
        <p
          style={{
            marginTop: "16px",
            fontSize: "1.25rem",
            fontWeight: "bold",
            backgroundColor: "white",
            color: "black",
            padding: "8px 16px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Your IP: {ip}
        </p>
      )}
      {error && (
        <p
          style={{
            marginTop: "16px",
            fontSize: "1.25rem",
            fontWeight: "bold",
            backgroundColor: "#FFF3CD",
            color: "#856404",
            padding: "8px 16px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default UserIPFetcher;
