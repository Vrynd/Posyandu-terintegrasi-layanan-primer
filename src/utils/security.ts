/**
 * Security Utilities
 * Functions to prevent XSS, SQL Injection, and validate user input
 */

/**
 * Pattern to detect potentially dangerous SQL injection characters
 */
const DANGEROUS_SQL_PATTERN = /['";\\-]{2}|\/\*|\*\/|[<>(){}[\]]/;

/**
 * Pattern for valid email format
 */
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Pattern for valid NIK (16 digits)
 */
const NIK_PATTERN = /^\d{16}$/;

/**
 * Pattern for valid name (letters and spaces only)
 */
const NAME_PATTERN = /^[a-zA-Z\s]+$/;

/**
 * Pattern for valid phone number
 */
const PHONE_PATTERN = /^[0-9+\-\s]+$/;

/**
 * HTML entities for XSS prevention
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Sanitize user input to prevent XSS attacks
 * Escapes HTML special characters
 */
export function sanitizeInput(input: string): string {
  return input.replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Check if input contains potentially dangerous SQL characters
 * @returns true if dangerous characters found
 */
export function containsDangerousChars(input: string): boolean {
  return DANGEROUS_SQL_PATTERN.test(input);
}

/**
 * Validate identifier format (email or NIK)
 * @returns object with isValid flag and type of identifier
 */
export function validateIdentifier(input: string): {
  isValid: boolean;
  type: 'email' | 'nik' | 'invalid';
  error?: string;
} {
  const trimmed = input.trim();

  // Check for dangerous characters first
  if (containsDangerousChars(trimmed)) {
    return {
      isValid: false,
      type: 'invalid',
      error: 'Input mengandung karakter tidak valid',
    };
  }

  // Check if it's a valid email
  if (EMAIL_PATTERN.test(trimmed)) {
    return { isValid: true, type: 'email' };
  }

  // Check if it's a valid NIK
  if (NIK_PATTERN.test(trimmed)) {
    return { isValid: true, type: 'nik' };
  }

  // If all digits but wrong length, give specific error
  if (/^\d+$/.test(trimmed)) {
    return {
      isValid: false,
      type: 'invalid',
      error: 'NIK harus 16 digit',
    };
  }

  return {
    isValid: false,
    type: 'invalid',
    error: 'Format email atau NIK tidak valid',
  };
}

/**
 * Validate name input
 * @returns object with isValid flag and optional error message
 */
export function validateName(input: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = input.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Nama wajib diisi' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Nama minimal 2 karakter' };
  }

  if (containsDangerousChars(trimmed)) {
    return { isValid: false, error: 'Nama mengandung karakter tidak valid' };
  }

  if (!NAME_PATTERN.test(trimmed)) {
    return { isValid: false, error: 'Nama hanya boleh mengandung huruf dan spasi' };
  }

  return { isValid: true };
}

/**
 * Validate email input
 */
export function validateEmail(input: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = input.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email wajib diisi' };
  }

  if (containsDangerousChars(trimmed)) {
    return { isValid: false, error: 'Email mengandung karakter tidak valid' };
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return { isValid: false, error: 'Format email tidak valid' };
  }

  return { isValid: true };
}

/**
 * Validate NIK input
 */
export function validateNIK(input: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = input.trim();

  if (!trimmed) {
    return { isValid: false, error: 'NIK wajib diisi' };
  }

  if (!NIK_PATTERN.test(trimmed)) {
    return { isValid: false, error: 'NIK harus 16 digit angka' };
  }

  return { isValid: true };
}

/**
 * Validate phone number input
 */
export function validatePhoneNumber(input: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = input.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Nomor telepon wajib diisi' };
  }

  if (containsDangerousChars(trimmed)) {
    return { isValid: false, error: 'Nomor telepon mengandung karakter tidak valid' };
  }

  if (!PHONE_PATTERN.test(trimmed)) {
    return { isValid: false, error: 'Format nomor telepon tidak valid' };
  }

  if (trimmed.length > 20) {
    return { isValid: false, error: 'Nomor telepon maksimal 20 karakter' };
  }

  return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
  };
} {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;

  if (!password) {
    return { isValid: false, error: 'Password wajib diisi', checks };
  }

  if (passedCount < 3) {
    return {
      isValid: false,
      error: 'Password harus memenuhi minimal 3 kriteria keamanan',
      checks,
    };
  }

  return { isValid: true, checks };
}

/**
 * Map technical/English error messages to user-friendly Indonesian messages
 * Uses partial matching (case-insensitive) so we don't need duplicate entries
 */
export function getUserFriendlyError(error: string): string {
  const errorMap: Record<string, string> = {
    // Network errors
    'Network Error': 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    'status code 500': 'Terjadi kesalahan server. Silakan coba lagi nanti.',
    'status code 502': 'Server sedang dalam pemeliharaan. Silakan coba lagi nanti.',
    'status code 503': 'Layanan tidak tersedia. Silakan coba lagi nanti.',
    'timeout': 'Server tidak merespons. Silakan coba lagi.',
    'aborted': 'Permintaan dibatalkan. Silakan coba lagi.',
    
    // Authentication errors (from Laravel backend)
    'invalid login credentials': 'Email atau password salah. Silakan periksa kembali.',
    'credentials do not match': 'Email atau password salah. Silakan periksa kembali.',
    'credentials are incorrect': 'Email atau password salah. Silakan periksa kembali.',
    'unauthorized': 'Sesi Anda telah berakhir. Silakan login kembali.',
    'unauthenticated': 'Sesi Anda telah berakhir. Silakan login kembali.',
    
    // Validation errors
    'email has already been taken': 'Email sudah digunakan. Gunakan email lain.',
    'nik has already been taken': 'NIK sudah terdaftar. Gunakan NIK lain.',
    'password confirmation does not match': 'Konfirmasi password tidak cocok.',
    
    // Rate limiting
    'too many attempts': 'Terlalu banyak percobaan. Silakan tunggu beberapa saat.',
  };

  // Check for partial match (case-insensitive)
  const lowerError = error.toLowerCase();
  for (const [key, value] of Object.entries(errorMap)) {
    if (lowerError.includes(key.toLowerCase())) {
      return value;
    }
  }

  return error;
}

