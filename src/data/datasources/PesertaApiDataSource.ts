/**
 * Peserta API Datasource
 * Handles all API calls related to peserta (participants)
 */

import api from '../core/api';
import type { 
    ApiResponse, 
    CreatePesertaRequest, 
    PesertaDetail, 
    PesertaListResponse,
    GetPesertaParams,
    PesertaSummaryResponse,
    GetPesertaSummaryParams,
    BulkDeleteRequest,
    BulkDeleteResponse
} from '../models/PesertaApiTypes';

export class PesertaApiDataSource {
    /**
     * Get list of peserta with optional filters
     * GET /api/peserta
     */
    async getPeserta(params?: GetPesertaParams): Promise<ApiResponse<PesertaListResponse>> {
        const response = await api.get<ApiResponse<PesertaListResponse>>('/peserta', { params });
        return response.data;
    }

    /**
     * Get lightweight summary list (70% smaller payload)
     * GET /api/peserta/summary
     * Supports ETag caching - returns 304 if data unchanged
     */
    async getSummary(
        params?: GetPesertaSummaryParams, 
        etag?: string
    ): Promise<{ data: ApiResponse<PesertaSummaryResponse>; etag?: string; notModified: boolean }> {
        const headers: Record<string, string> = {};
        if (etag) {
            headers['If-None-Match'] = etag;
        }

        try {
            const response = await api.get<ApiResponse<PesertaSummaryResponse>>('/peserta/summary', { 
                params,
                headers,
                validateStatus: (status) => status === 200 || status === 304
            });

            if (response.status === 304) {
                return { 
                    data: { success: true }, 
                    notModified: true 
                };
            }

            return { 
                data: response.data, 
                etag: response.headers['etag'] as string | undefined,
                notModified: false 
            };
        } catch {
            // Fallback if ETag not supported
            const response = await api.get<ApiResponse<PesertaSummaryResponse>>('/peserta/summary', { params });
            return { data: response.data, notModified: false };
        }
    }

    /**
     * Get peserta detail by ID
     * GET /api/peserta/{id}
     */
    async getPesertaById(id: number): Promise<ApiResponse<PesertaDetail>> {
        const response = await api.get<ApiResponse<PesertaDetail>>(`/peserta/${id}`);
        return response.data;
    }

    /**
     * Create new peserta
     * POST /api/peserta
     */
    async createPeserta(data: CreatePesertaRequest): Promise<ApiResponse<PesertaDetail>> {
        const response = await api.post<ApiResponse<PesertaDetail>>('/peserta', data);
        return response.data;
    }

    /**
     * Update peserta
     * PUT /api/peserta/{id}
     */
    async updatePeserta(id: number, data: Partial<CreatePesertaRequest>): Promise<ApiResponse<PesertaDetail>> {
        const response = await api.put<ApiResponse<PesertaDetail>>(`/peserta/${id}`, data);
        return response.data;
    }

    /**
     * Delete peserta
     * DELETE /api/peserta/{id}
     */
    async deletePeserta(id: number): Promise<ApiResponse<{ success: boolean; message: string }>> {
        const response = await api.delete<ApiResponse<{ success: boolean; message: string }>>(`/peserta/${id}`);
        return response.data;
    }

    /**
     * Bulk delete multiple peserta
     * DELETE /api/peserta/bulk
     */
    async bulkDelete(request: BulkDeleteRequest): Promise<ApiResponse<BulkDeleteResponse>> {
        const response = await api.delete<ApiResponse<BulkDeleteResponse>>('/peserta/bulk', { 
            data: request 
        });
        return response.data;
    }

    /**
     * Get latest visit for a peserta
     * GET /api/peserta/{id}/latest-visit
     */
    async getLatestVisit(id: number): Promise<ApiResponse<any>> {
        const response = await api.get<ApiResponse<any>>(`/peserta/${id}/latest-visit`);
        return response.data;
    }
}

// Singleton instance
export const pesertaApiDataSource = new PesertaApiDataSource();

