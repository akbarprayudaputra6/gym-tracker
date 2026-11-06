import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_data");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("auth_token") || null,
  );
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/login", { email, password });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("auth_token", newToken);
      localStorage.setItem("user_data", JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login gagal. Periksa kembali email dan password.",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, passwordConfirmation) => {
    setLoading(true);
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("auth_token", newToken);
      localStorage.setItem("user_data", JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registrasi gagal. Periksa kembali inputan Anda.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      // Abaikan error logout dari server jika token sudah expired
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
