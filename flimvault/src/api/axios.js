// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://s-movies-nlo8.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

//  Attach token automatically in every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

//  Handle 401 safely (don’t remove token for every API call)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    //  Remove token ONLY if /me endpoint fails
    if (
      status === 401 &&
      (url.includes("/api/auth/me") || url.includes("/me"))
    ) {
      localStorage.removeItem("token");
      console.warn("Unauthorized on /me — token removed");
    }

    return Promise.reject(error);
  },
);

export default API;
