import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on component mount
  useEffect(() => {
    // Check localStorage on initial load
    checkAuthStatus();
  }, []);

  const isAuthenticated = !!user;
  // Tambahkan useEffect untuk auto-redirect admin
  useEffect(() => {
    // Jika sudah terautentikasi dan sebagai admin, check path saat ini
    if (isAuthenticated && user?.role === "Admin") {
      const currentPath = window.location.pathname;
      // Jika bukan di area admin, redirect
      if (!currentPath.startsWith("/admin")) {
        window.location.href = "/admin/dashboard";
      }
    }
  }, [isAuthenticated, user]);

  // Function to check auth status that can be reused
  const checkAuthStatus = () => {
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
  };

  const login = (userData, token) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    // Set authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);

    // Remove authorization header
    delete axios.defaults.headers.common["Authorization"];
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
