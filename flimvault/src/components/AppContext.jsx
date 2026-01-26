import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import API from "../api/axios";
import { fetchMe } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Normalize backend response into your UI format
  const normalizeUser = (response) => {
    const src = response?.data ?? response ?? null;
    if (!src) return null;

    return {
      id: src.userID ?? src.id ?? null,
      username: src.username ?? "",
      userEmail: src.userEmail ?? src.email ?? "",
      fullName: src.fullName ?? "",
      address: src.address ?? "",
      countryCode: src.countryCode ?? "+91",
      phone: src.phone ?? "",
      token: localStorage.getItem("token"),
    };
  };

  //  Refresh user on app load (uses token automatically from axios interceptor)
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const res = await fetchMe();
      const normalized = normalizeUser(res);
      setUser(normalized);
      return normalized;
    } catch (err) {
      console.error("Auth refresh failed", err);
      localStorage.removeItem("token");
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setLoading(false);
    };
    init();
  }, [refreshUser]);

  //  LOGIN: Save token then fetch /me
  const login = async (token) => {
    if (!token) throw new Error("Token is required");

    localStorage.setItem("token", token);

    try {
      const res = await fetchMe();
      const normalized = normalizeUser(res);
      setUser(normalized);
      return normalized;
    } catch (err) {
      //  if /me fails, remove token
      console.error("Login success but /me failed", err);
      localStorage.removeItem("token");
      setUser(null);
      throw err;
    }
  };

  //  LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  //  REGISTER (OTP register API)
  const register = async (payload) => {
    return API.post("/api/auth/register", payload);
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
