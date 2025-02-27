import React, { useState } from "react";

const UserIPFetcher = () => {
  const [ip, setIp] = useState(null);
  const [error, setError] = useState(null);
  
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
  
  return (
    <div style={{
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh", 
      background: "linear-gradient(to right, #FF8C00, #FFD700)", 
      padding: "20px", 
      color: "white"
    }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "16px", textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
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
          transition: "background 0.3s"
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#B91C1C"}
        onMouseOut={(e) => e.target.style.backgroundColor = "#DC2626"}
      >
        Get My IP Address
      </button>
      {ip && <p style={{ marginTop: "16px", fontSize: "1.25rem", fontWeight: "bold", backgroundColor: "white", color: "black", padding: "8px 16px", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>Your IP: {ip}</p>}
      {error && <p style={{ marginTop: "16px", fontSize: "1.25rem", fontWeight: "bold", backgroundColor: "#FFF3CD", color: "#856404", padding: "8px 16px", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>{error}</p>}
    </div>
  );
};

export default UserIPFetcher;
