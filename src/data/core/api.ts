// Konfigurasi Axios API
// Client API terpusat dengan interceptors untuk autentikasi

import axios from "axios";
import { 
  TOKEN_KEY, 
  DEFAULT_API_URL, 
  API_TIMEOUT, 
  DEFAULT_CONTENT_TYPE 
} from "./constants";

// Re-export TOKEN_KEY untuk backward compatibility
export { TOKEN_KEY };

// Buat axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_URL,
  headers: {
    "Content-Type": DEFAULT_CONTENT_TYPE,
    Accept: "application/json",
  },
  timeout: API_TIMEOUT,
});

// Request interceptor - pasang Bearer token
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

// Response interceptor - tangani error umum
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Tangani 401 Unauthorized - hapus token
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }

    // 429 (Rate Limit) dan 423 (Account Locked) ditangani oleh form error display
    // Tidak perlu toast - pesan error akan ditampilkan di kotak error merah

    return Promise.reject(error);
  }
);

// Dapatkan base URL untuk API (tanpa suffix /api)
export const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
  return apiUrl.replace(/\/api$/, '');
};

// Dapatkan URL storage untuk file yang diupload
// path: path yang dikembalikan dari API (contoh: "pengaduan/abc123.jpg")
// returns: URL lengkap ke file
export const getStorageUrl = (path: string): string => {
  if (!path) return '';
  // Jika sudah URL lengkap, kembalikan apa adanya
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${getBaseUrl()}/storage/${path}`;
};

export default api;
