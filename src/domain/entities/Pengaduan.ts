/**
 * Pengaduan Entity Types
 * Represents complaint/bug report data structures
 */

// Category types for complaints
export type PengaduanKategori = 'error' | 'tampilan' | 'data' | 'performa' | 'lainnya';

// Priority levels
export type PengaduanPrioritas = 'rendah' | 'sedang' | 'tinggi';

// Status of complaint
export type PengaduanStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

/**
 * User summary for pengaduan
 */
export interface PengaduanUser {
    id: number;
    name: string;
    email: string;
}

/**
 * Main Pengaduan entity
 */
export interface Pengaduan {
    id: number;
    user_id: number;
    user?: PengaduanUser;
    kategori: PengaduanKategori;
    prioritas: PengaduanPrioritas;
    judul: string;
    deskripsi: string;
    langkah_reproduksi?: string;
    browser_info?: string;
    status: PengaduanStatus;
    images: string[];
    responses_count: number;
    created_at: string;
    updated_at: string;
}

/**
 * Response from admin
 */
export interface PengaduanResponse {
    id: number;
    pengaduan_id: number;
    admin_id: number;
    admin: PengaduanUser;
    response: string;
    created_at: string;
}

/**
 * Pengaduan with responses (detail view)
 */
export interface PengaduanDetail extends Pengaduan {
    responses: PengaduanResponse[];
}

/**
 * Statistics for admin dashboard
 */
export interface PengaduanStats {
    pending: number;
    in_progress: number;
    resolved: number;
    rejected: number;
    total: number;
}

/**
 * Notification data for banners
 */
export interface PengaduanNotification {
    // For Admin: count of new pending
    new_count?: number;
    message?: string;
    // For Kader: recently resolved complaints
    resolved?: Array<{
        id: number;
        judul: string;
        resolved_at: string;
    }>;
}

/**
 * Create pengaduan request params
 */
export interface CreatePengaduanParams {
    kategori: PengaduanKategori;
    prioritas: PengaduanPrioritas;
    judul: string;
    deskripsi: string;
    langkah_reproduksi?: string;
    browser_info?: string;
    images?: File[];
}

/**
 * Create response request params
 */
export interface CreateResponseParams {
    pengaduan_id: number;
    response: string;
}

/**
 * Filter params for listing
 */
export interface PengaduanFilterParams {
    page?: number;
    per_page?: number;
    status?: PengaduanStatus;
    kategori?: PengaduanKategori;
    search?: string;
}

/**
 * Paginated response
 */
export interface PaginatedPengaduan {
    data: Pengaduan[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// Helper constants
export const KATEGORI_OPTIONS: { id: PengaduanKategori; label: string; description: string }[] = [
    { id: 'error', label: 'Error / Crash', description: 'Aplikasi error atau tidak bisa diakses' },
    { id: 'tampilan', label: 'Tampilan', description: 'Masalah layout atau desain' },
    { id: 'data', label: 'Data', description: 'Data tidak tersimpan atau hilang' },
    { id: 'performa', label: 'Performa', description: 'Aplikasi lambat atau lag' },
    { id: 'lainnya', label: 'Lainnya', description: 'Masalah lainnya' },
];

export const PRIORITAS_OPTIONS: { id: PengaduanPrioritas; label: string; color: string; description: string }[] = [
    { id: 'rendah', label: 'Rendah', color: 'bg-green-100 text-green-700 border-green-200', description: 'Tidak mengganggu pekerjaan utama' },
    { id: 'sedang', label: 'Sedang', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', description: 'Menghambat sebagian pekerjaan' },
    { id: 'tinggi', label: 'Tinggi', color: 'bg-red-100 text-red-700 border-red-200', description: 'Tidak bisa bekerja sama sekali' },
];

export const STATUS_OPTIONS: { id: PengaduanStatus; label: string; color: string; bgColor: string }[] = [
    { id: 'pending', label: 'Menunggu', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    { id: 'in_progress', label: 'Diproses', color: 'text-blue-700', bgColor: 'bg-blue-100' },
    { id: 'resolved', label: 'Selesai', color: 'text-green-700', bgColor: 'bg-green-100' },
    { id: 'rejected', label: 'Ditolak', color: 'text-red-700', bgColor: 'bg-red-100' },
];
