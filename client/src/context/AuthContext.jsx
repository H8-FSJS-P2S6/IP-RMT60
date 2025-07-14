import { createContext, useState, useEffect, useCallback } from "react";
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

  const login = (data) => {
    if (!data || !data.access_token) {
      console.error("Invalid login data");
      return;
    }

    const userData = data.user || {
      id: data.id,
      username: data.username || data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    // Set authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;

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

    // Pastikan data user lengkap dan valid
    if (!data.user) {
      console.error("User data missing in Google login response");
      return;
    }

    const userData = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      role: data.user.role,
      phoneNumber: data.user.phoneNumber,
      address: data.user.address
    };

    // Clear any existing user data
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    
    // Set new user data
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Update state
    setUser(userData);

    // Set authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
    
    console.log("Google login successful, user data:", userData);
    
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

// Export the AuthContext
export { AuthContext };
