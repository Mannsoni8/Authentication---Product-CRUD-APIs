import { createContext, useEffect, useState } from "react";
import {
  getMe,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../services/auth.service.js";

import { setAccessToken as setApiAccessToken } from "../services/api.js";


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);


  const login = async (credentials) => {
    const data = await loginUser(credentials);

    setUser(data.data.user);
    setAccessToken(data.accessToken);
    setApiAccessToken(data.accessToken);

    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);

    setUser(data.user);
    setAccessToken(data.accessToken);
    setApiAccessToken(data.accessToken);

    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      setApiAccessToken(null);
    }
  };

  const refresh = async () => {
    const data = await refreshAccessToken();

    setUser(data.data.user);
    setAccessToken(data.accessToken);
    setApiAccessToken(data.accessToken);

    return data;
  };


  const loadUser = async () => {
    try {
      // Check if we have a stored access token from a previous session
      const storedToken = sessionStorage.getItem("accessToken");

      if (storedToken) {
        setAccessToken(storedToken);
        setApiAccessToken(storedToken);
      }

      // Try to get current user
      const data = await getMe();
      setUser(data.user);
    } catch {
      try {
        // If getMe fails, try to refresh the token
        await refresh();
      } catch {
        // If refresh fails, clear auth state
        setUser(null);
        setAccessToken(null);
        setApiAccessToken(null);
        sessionStorage.removeItem("accessToken");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Store/clear access token in sessionStorage when it changes
  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
    } else {
      sessionStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        refresh,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

