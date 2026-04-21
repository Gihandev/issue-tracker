import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// axios instance with base URL and JSON headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // Get token from Zustand store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
  }
  return config;
});


// Auto-logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) { 
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;