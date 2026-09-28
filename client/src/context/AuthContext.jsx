import { createContext, useEffect, useState } from "react";
import {
  getMe,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../services/auth.service";

import { setAccessToken as setApiAccessToken } from "../services/api";
import { getProductById } from "../../services/product.service";
import { addToCart } from "../../services/cart.service";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

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
    await logoutUser();

    setUser(null);
    setAccessToken(null);
    setApiAccessToken(null);
  };

  const refresh = async () => {
    const data = await refreshAccessToken();

    setUser(data.data.user);
    setAccessToken(data.accessToken);
    setApiAccessToken(data.accessToken);

    return data;
  };

  const handleAddToCart = async () => {
    try {
      setCartLoading(true);
      setCartMessage("");

      await addToCart(product._id, quantity);

      setCartMessage("Product added to cart successfully.");
    } catch (error) {
      setCartMessage(
        error.response?.data?.message || "Failed to add product to cart",
      );
    } finally {
      setCartLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const data = await getMe();

      setUser(data.user);
    } catch {
      try {
        await refresh();
      } catch {
        setUser(null);
        setAccessToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

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
