// Error Types
// Standardisasi error handling untuk data layer

// ==============
// Kode Error API
// ==============

// Menggunakan 'as const' pattern untuk type safety tanpa enum
export const ApiErrorCode = {
    // Error autentikasi
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
    
    // Error validasi
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    
    // Error resource
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    
    // Rate limiting
    RATE_LIMITED: 'RATE_LIMITED',
    
    // Error server
    SERVER_ERROR: 'SERVER_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    
    // Error jaringan
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT',
    
    // Tidak diketahui
    UNKNOWN: 'UNKNOWN',
} as const;

// Type untuk nilai ApiErrorCode
export type ApiErrorCode = typeof ApiErrorCode[keyof typeof ApiErrorCode];

// ==================
// Kelas Error Kustom
// ==================

export interface ApiErrorDetails {
    code: ApiErrorCode;
    message: string;
    status?: number;
    field?: string;
    errors?: Record<string, string[]>;
    originalError?: unknown;
}

// Kelas error kustom untuk API errors
// Menyediakan informasi error terstruktur yang konsisten
export class ApiError extends Error {
    public readonly code: ApiErrorCode;
    public readonly status?: number;
    public readonly field?: string;
    public readonly errors?: Record<string, string[]>;
    public readonly originalError?: unknown;

    constructor(details: ApiErrorDetails) {
        super(details.message);
        this.name = 'ApiError';
        this.code = details.code;
        this.status = details.status;
        this.field = details.field;
        this.errors = details.errors;
        this.originalError = details.originalError;

        // Menjaga stack trace yang benar di environment V8
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ErrorConstructor = Error as any;
        if (typeof ErrorConstructor.captureStackTrace === 'function') {
            ErrorConstructor.captureStackTrace(this, ApiError);
        }
    }

    // Cek apakah error adalah error autentikasi
    isAuthError(): boolean {
        const authCodes: ApiErrorCode[] = [
            ApiErrorCode.UNAUTHORIZED,
            ApiErrorCode.TOKEN_EXPIRED,
            ApiErrorCode.INVALID_CREDENTIALS,
        ];
        return authCodes.includes(this.code);
    }

    // Cek apakah error adalah error validasi
    isValidationError(): boolean {
        const validationCodes: ApiErrorCode[] = [
            ApiErrorCode.VALIDATION_ERROR,
            ApiErrorCode.INVALID_INPUT,
        ];
        return validationCodes.includes(this.code);
    }

    // Cek apakah error bisa di-retry
    isRetryable(): boolean {
        const retryableCodes: ApiErrorCode[] = [
            ApiErrorCode.NETWORK_ERROR,
            ApiErrorCode.TIMEOUT,
            ApiErrorCode.SERVICE_UNAVAILABLE,
        ];
        return retryableCodes.includes(this.code);
    }

    // Dapatkan pesan error yang user-friendly dalam Bahasa Indonesia
    getUserMessage(): string {
        switch (this.code) {
            case ApiErrorCode.UNAUTHORIZED:
                return 'Sesi Anda telah berakhir. Silakan login kembali.';
            case ApiErrorCode.FORBIDDEN:
                return 'Anda tidak memiliki akses untuk melakukan aksi ini.';
            case ApiErrorCode.INVALID_CREDENTIALS:
                return 'Email/NIK atau password salah.';
            case ApiErrorCode.ACCOUNT_LOCKED:
                return 'Akun Anda telah dikunci. Silakan hubungi administrator.';
            case ApiErrorCode.VALIDATION_ERROR:
                return 'Data yang dimasukkan tidak valid.';
            case ApiErrorCode.NOT_FOUND:
                return 'Data yang dicari tidak ditemukan.';
            case ApiErrorCode.RATE_LIMITED:
                return 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.';
            case ApiErrorCode.NETWORK_ERROR:
                return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
            case ApiErrorCode.TIMEOUT:
                return 'Permintaan memakan waktu terlalu lama. Silakan coba lagi.';
            case ApiErrorCode.SERVER_ERROR:
                return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
            default:
                return this.message || 'Terjadi kesalahan yang tidak diketahui.';
        }
    }
}

// ======================
// Fungsi Factory Error
// ======================

// Buat ApiError dari HTTP status code
export function createErrorFromStatus(
    status: number, 
    message?: string, 
    errors?: Record<string, string[]>,
    originalError?: unknown
): ApiError {
    let code: ApiErrorCode;
    
    switch (status) {
        case 400:
            code = ApiErrorCode.VALIDATION_ERROR;
            break;
        case 401:
            code = ApiErrorCode.UNAUTHORIZED;
            break;
        case 403:
            code = ApiErrorCode.FORBIDDEN;
            break;
        case 404:
            code = ApiErrorCode.NOT_FOUND;
            break;
        case 409:
            code = ApiErrorCode.CONFLICT;
            break;
        case 422:
            code = ApiErrorCode.VALIDATION_ERROR;
            break;
        case 423:
            code = ApiErrorCode.ACCOUNT_LOCKED;
            break;
        case 429:
            code = ApiErrorCode.RATE_LIMITED;
            break;
        case 500:
            code = ApiErrorCode.SERVER_ERROR;
            break;
        case 503:
            code = ApiErrorCode.SERVICE_UNAVAILABLE;
            break;
        default:
            code = status >= 500 ? ApiErrorCode.SERVER_ERROR : ApiErrorCode.UNKNOWN;
    }

    return new ApiError({
        code,
        message: message || `HTTP Error ${status}`,
        status,
        errors,
        originalError,
    });
}

// Buat error jaringan
export function createNetworkError(message?: string, originalError?: unknown): ApiError {
    return new ApiError({
        code: ApiErrorCode.NETWORK_ERROR,
        message: message || 'Terjadi kesalahan jaringan',
        originalError,
    });
}

// Buat error timeout
export function createTimeoutError(message?: string, originalError?: unknown): ApiError {
    return new ApiError({
        code: ApiErrorCode.TIMEOUT,
        message: message || 'Permintaan timeout',
        originalError,
    });
}

// Type guard untuk cek apakah error adalah ApiError
export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}
