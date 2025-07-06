import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Function to check auth status that can be reused
  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    setAuthChecked(false);

    // Remove authorization header
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Set authorization header for all future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout(); // Clear invalid data
      }
    } else {
      setUser(null);
    }

    setLoading(false);
    setAuthChecked(true);
  }, [logout]);

  // Check if user is logged in on component mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const isAuthenticated = !!user;
  
  // Optimized admin redirect with debouncing
  useEffect(() => {
    if (!authChecked || loading) return;
    
    const timeoutId = setTimeout(() => {
      if (isAuthenticated && user?.role === "Admin") {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/admin")) {
          // Use replace instead of href to prevent throttling
          window.history.replaceState(null, "", "/admin/dashboard");
          window.location.reload();
        }
      }
    }, 100); // Debounce navigation

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, authChecked, loading]);

  const login = (userData, token) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    // Set authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Notify components about auth state change
    const event = new Event("authStateChanged");
    window.dispatchEvent(event);

    // Force re-render of components that depend on auth state
    setTimeout(() => {
      setAuthChecked(true);
    }, 50);
  };

  const googleLogin = (data) => {
    if (!data || !data.access_token) {
      console.error("Invalid Google login data");
      return;
    }

    const userData = {
      id: data.id,
      username: data.username || data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    // Set authorization header
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.access_token}`;
    
    // Force re-render of components that depend on auth state
    setTimeout(() => {
      setAuthChecked(true);
    }, 50);
  };

  const isAdmin = user?.role === "Admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        googleLogin,
        logout,
        isAuthenticated,
        isAdmin,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
