// Index Modul Core
// Barrel export untuk semua utilities core

// API Client
export { default as api, TOKEN_KEY, getBaseUrl, getStorageUrl } from './api';

// Query Client & Keys
export { queryClient } from './queryClient';
export { queryKeys } from './queryKeys';
export type { QueryKeys } from './queryKeys';

// Konstanta
export {
    // Auth
    REFRESH_TOKEN_KEY,
    USER_KEY,
    // API
    DEFAULT_API_URL,
    API_TIMEOUT,
    DEFAULT_CONTENT_TYPE,
    // Query
    DEFAULT_STALE_TIME,
    DEFAULT_GC_TIME,
    SHORT_STALE_TIME,
    DEFAULT_QUERY_RETRY,
    DEFAULT_MUTATION_RETRY,
    // Paginasi
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
} from './constants';

// Error
export {
    ApiErrorCode,
    ApiError,
    createErrorFromStatus,
    createNetworkError,
    createTimeoutError,
    isApiError,
} from './errors';
export type { ApiErrorDetails } from './errors';
