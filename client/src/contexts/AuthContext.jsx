import React, { createContext, useContext, useState } from "react";

// Create a context with default values.
const AuthContext = createContext({
  username: "",
  email: "",
  setAuth: () => {},
});

// Provider component that stores and updates auth state.
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ username: "", email: "" });

  return (
    <AuthContext.Provider value={{ ...auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing authentication context.
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
