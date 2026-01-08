/**
 * Pengaduan API Datasource
 * Handles API calls for pengaduan/complaints feature
 * Connected to Laravel backend API
 */

import api from '../core/api';
import type { ApiResponse } from '../../domain/entities/User';
import type {
    Pengaduan,
    PengaduanDetail,
    PengaduanStats,
    CreatePengaduanParams,
    CreateResponseParams,
    PengaduanFilterParams,
    PaginatedPengaduan,
    PengaduanStatus,
} from '../../domain/entities/Pengaduan';

// API Response structure for list endpoint (matches backend)
interface ListApiResponse {
    data: Pengaduan[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
    };
}

export class PengaduanApiDataSource {
    /**
     * Get list of pengaduan (filtered by role on backend)
     * Kader: only own complaints, Admin: all complaints
     */
    async getList(params?: PengaduanFilterParams): Promise<ApiResponse<PaginatedPengaduan>> {
        const response = await api.get<ListApiResponse>('/pengaduan', { params });
        
        // Transform response to match expected PaginatedPengaduan structure
        const { data, meta } = response.data;
        const lastPage = Math.ceil(meta.total / meta.per_page) || 1;
        
        return {
            success: true,
            message: 'Success',
            data: {
                data: data,
                current_page: meta.current_page,
                last_page: lastPage,
                per_page: meta.per_page,
                total: meta.total,
            },
        };
    }

    /**
     * Get pengaduan detail with responses
     */
    async getDetail(id: number): Promise<ApiResponse<PengaduanDetail>> {
        const response = await api.get<{ data: PengaduanDetail }>(`/pengaduan/${id}`);
        return {
            success: true,
            message: 'Success',
            data: response.data.data,
        };
    }

    /**
     * Create new pengaduan (Kader only)
     */
    async create(params: CreatePengaduanParams): Promise<ApiResponse<{ id: number }>> {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('kategori', params.kategori);
        formData.append('prioritas', params.prioritas);
        formData.append('judul', params.judul);
        formData.append('deskripsi', params.deskripsi);
        if (params.langkah_reproduksi) {
            formData.append('langkah_reproduksi', params.langkah_reproduksi);
        }
        if (params.browser_info) {
            formData.append('browser_info', params.browser_info);
        }
        if (params.images) {
            params.images.forEach((file) => {
                formData.append('images[]', file);
            });
        }

        const response = await api.post<{ success: boolean; data: { id: number } }>('/pengaduan', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        return {
            success: response.data.success,
            message: 'Pengaduan berhasil dikirim',
            data: response.data.data,
        };
    }

    /**
     * Update pengaduan status (Admin only)
     */
    async updateStatus(id: number, status: PengaduanStatus): Promise<ApiResponse<{ message: string }>> {
        try {
            const response = await api.put<{ success: boolean; message: string }>(`/pengaduan/${id}/status`, { status });
            return {
                success: response.data.success,
                message: response.data.message,
                data: { message: response.data.message },
            };
        } catch (error: unknown) {
            console.error('Update status API error:', error);
            // Handle axios error
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                throw new Error(axiosError.response?.data?.message || 'Gagal mengubah status');
            }
            throw error;
        }
    }

    /**
     * Add response to pengaduan (Admin only)
     */
    async addResponse(params: CreateResponseParams): Promise<ApiResponse<{ id: number }>> {
        const response = await api.post<{ success: boolean; message: string; data: { id: number } }>(
            `/pengaduan/${params.pengaduan_id}/response`,
            { response: params.response }
        );
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data,
        };
    }

    /**
     * Delete pengaduan (soft delete)
     */
    async delete(id: number): Promise<ApiResponse<{ message: string }>> {
        const response = await api.delete<{ success: boolean; message: string }>(`/pengaduan/${id}`);
        return {
            success: response.data.success,
            message: response.data.message,
            data: { message: response.data.message },
        };
    }

    /**
     * Get statistics (works for both Admin and Kader - filtered by role on backend)
     */
    async getStats(): Promise<ApiResponse<PengaduanStats>> {
        try {
            const response = await api.get<{ success?: boolean; data?: PengaduanStats } | PengaduanStats>('/pengaduan/stats');
            
            // Handle different response structures
            let statsData: PengaduanStats;
            
            if (response.data && 'data' in response.data && response.data.data) {
                // Structure: { success: true, data: { pending: 0, ... } }
                statsData = response.data.data;
            } else if (response.data && 'pending' in response.data) {
                // Structure: { pending: 0, in_progress: 0, ... }
                statsData = response.data as PengaduanStats;
            } else {
                // Fallback to empty stats
                console.warn('Unexpected stats response structure:', response.data);
                statsData = { pending: 0, in_progress: 0, resolved: 0, rejected: 0, total: 0 };
            }
            
            return {
                success: true,
                message: 'Success',
                data: statsData,
            };
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            // Return empty stats instead of failing
            return {
                success: true,
                message: 'No stats available',
                data: { pending: 0, in_progress: 0, resolved: 0, rejected: 0, total: 0 },
            };
        }
    }
}

// Singleton instance
export const pengaduanApiDataSource = new PengaduanApiDataSource();
