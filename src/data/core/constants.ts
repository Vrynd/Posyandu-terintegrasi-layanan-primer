// Konstanta Core
// Konfigurasi terpusat untuk data layer

// =====================
// Konstanta Autentikasi
// =====================

// Key penyimpanan token di localStorage
export const TOKEN_KEY = 'posyandu_auth_token';

// Key penyimpanan refresh token (untuk implementasi mendatang)
export const REFRESH_TOKEN_KEY = 'posyandu_refresh_token';

// Key penyimpanan data user di localStorage
export const USER_KEY = 'posyandu_user';

// ===============
// Konstanta API
// ===============

// URL default untuk API
export const DEFAULT_API_URL = 'http://localhost:8000/api';

// Timeout request dalam milliseconds
export const API_TIMEOUT = 30000; // 30 detik

// Content type default untuk request
export const DEFAULT_CONTENT_TYPE = 'application/json';

// =================
// Konstanta Query
// =================

// Waktu data dianggap fresh (stale time) dalam milliseconds
export const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 menit

// Waktu cache dihapus jika tidak dipakai (gc time) dalam milliseconds
export const DEFAULT_GC_TIME = 10 * 60 * 1000; // 10 menit

// Stale time untuk data yang sering berubah (pengaduan, dll)
export const SHORT_STALE_TIME = 30 * 1000; // 30 detik

// Jumlah retry default untuk queries
export const DEFAULT_QUERY_RETRY = 2;

// Jumlah retry default untuk mutations
export const DEFAULT_MUTATION_RETRY = 1;

// ====================
// Konstanta Paginasi
// ====================

// Jumlah item per halaman default
export const DEFAULT_PAGE_SIZE = 20;

// Jumlah maksimum item per halaman
export const MAX_PAGE_SIZE = 100;
