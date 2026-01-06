/**
 * Pengaduan Repository Interface
 * Contract for complaint data operations
 */

import type { 
    PengaduanDetail, 
    PengaduanStats, 
    CreatePengaduanParams, 
    PengaduanFilterParams, 
    PengaduanStatus,
    PaginatedPengaduan,
    CreateResponseParams
} from '../entities/Pengaduan';

import type { ApiResponse } from '../entities/User';

export interface PengaduanRepository {
    /**
     * Get list of pengaduan with filters
     */
    getPengaduan(params?: PengaduanFilterParams): Promise<ApiResponse<PaginatedPengaduan>>;

    /**
     * Get pengaduan detail by ID
     */
    getPengaduanById(id: number): Promise<ApiResponse<PengaduanDetail>>;

    /**
     * Get statistics for pengaduan
     */
    getStats(): Promise<ApiResponse<PengaduanStats>>;

    /**
     * Create new pengaduan
     */
    createPengaduan(data: CreatePengaduanParams): Promise<ApiResponse<{ id: number }>>;

    /**
     * Update pengaduan status
     */
    updateStatus(id: number, status: PengaduanStatus): Promise<ApiResponse<{ message: string }>>;

    /**
     * Add response to pengaduan
     */
    addResponse(params: CreateResponseParams): Promise<ApiResponse<{ id: number }>>;

    /**
     * Delete pengaduan
     */
    deletePengaduan(id: number): Promise<ApiResponse<{ message: string }>>;
}
