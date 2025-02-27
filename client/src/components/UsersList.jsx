import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./UsersList.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to format timestamps
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="users-list-container">
      <div className="users-header">
        <h1>User Management</h1>
        <p>All registered users in the system</p>
        <div className="button-container">
          <Link to="/dashboard" className="back-button">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span>⚠️</span> Error loading users: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>IP Address</th>
                <th>Location (Long, Lat)</th>
                <th>Call Permission</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.ipAddress}</td>
                    <td>
                      {user.location && user.location.coordinates
                        ? `${user.location.coordinates[0]}, ${user.location.coordinates[1]}`
                        : "Unknown"}
                    </td>
                    <td>
                      <span
                        className={`permission-badge ${
                          user.callPermission ? "allowed" : "denied"
                        }`}
                      >
                        {user.callPermission ? "Allowed" : "Denied"}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-users">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersList;
