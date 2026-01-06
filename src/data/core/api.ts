/**
 * Axios API Configuration
 * Centralized API client with interceptors for authentication
 */

import axios from "axios";

// Token key for localStorage
export const TOKEN_KEY = "posyandu_auth_token";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Handle 401 Unauthorized - clear token
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }

    // 429 (Rate Limit) and 423 (Account Locked) are handled by the form's error display
    // No toast needed - error message will be shown in the red error box

    return Promise.reject(error);
  }
);

/**
 * Get the base URL for the API (without /api suffix)
 */
export const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Get storage URL for uploaded files
 * @param path - The path returned from API (e.g., "pengaduan/abc123.jpg")
 * @returns Full URL to the file
 */
export const getStorageUrl = (path: string): string => {
  if (!path) return '';
  // If already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${getBaseUrl()}/storage/${path}`;
};

export default api;
