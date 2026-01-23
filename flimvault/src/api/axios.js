// src/api/axios.js
import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:8086",
  baseURL: "https://s-movies-nlo8.onrender.com",
  headers: { "Content-Type": "application/json" },
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// auto-remove invalid token
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      console.warn("Unauthorized — token removed");
    }
    return Promise.reject(error);
  },
);

export default API;
