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

  /* ---------------- NORMALIZE USER (MATCH BACKEND DTO) ---------------- */
  const normalizeUser = (response) => {
    const src = response?.data ?? response ?? null;
    if (!src) return null;

    return {
      id: src.id ?? null,
      userName: src.userName ?? "",
      userEmail: src.userEmail ?? "",
      fullName: src.fullName ?? "",
      address: src.address ?? "",
      countryCode: src.countryCode ?? "",
      phone: src.phone ?? "",
      role: src.role ?? "",
      token: localStorage.getItem("token"),
    };
  };

  /* ---------------- LOAD USER ON APP START ---------------- */
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const res = await fetchMe(); // GET /me
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

  /* ---------------- LOGIN ---------------- */
  const login = async (token) => {
    if (!token) throw new Error("Token is required");

    localStorage.setItem("token", token);

    const res = await fetchMe();
    const normalized = normalizeUser(res);
    setUser(normalized);

    return normalized;
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  /* ---------------- REGISTER ---------------- */
  const register = async (payload) => {
    // payload must match UserRequest DTO
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
