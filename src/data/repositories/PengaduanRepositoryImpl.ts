/**
 * Pengaduan Repository Implementation
 * Implementation of PengaduanRepository using API DataSource
 */

import type { PengaduanRepository } from '../../domain/repositories/PengaduanRepository';
import type { ApiResponse } from '../../domain/entities/User';
import type { 
    PengaduanDetail, 
    PengaduanStats, 
    CreatePengaduanParams, 
    PengaduanFilterParams, 
    PengaduanStatus,
    PaginatedPengaduan,
    CreateResponseParams
} from '../../domain/entities/Pengaduan';
import { pengaduanApiDataSource } from '../datasources/PengaduanApiDataSource';

export class PengaduanRepositoryImpl implements PengaduanRepository {
    async getPengaduan(params?: PengaduanFilterParams): Promise<ApiResponse<PaginatedPengaduan>> {
        return pengaduanApiDataSource.getList(params || {});
    }

    async getPengaduanById(id: number): Promise<ApiResponse<PengaduanDetail>> {
        return pengaduanApiDataSource.getDetail(id);
    }

    async getStats(): Promise<ApiResponse<PengaduanStats>> {
        return pengaduanApiDataSource.getStats();
    }

    async createPengaduan(data: CreatePengaduanParams): Promise<ApiResponse<{ id: number }>> {
        return pengaduanApiDataSource.create(data);
    }

    async updateStatus(id: number, status: PengaduanStatus): Promise<ApiResponse<{ message: string }>> {
        return pengaduanApiDataSource.updateStatus(id, status);
    }

    async addResponse(params: CreateResponseParams): Promise<ApiResponse<{ id: number }>> {
        return pengaduanApiDataSource.addResponse(params);
    }

    async deletePengaduan(id: number): Promise<ApiResponse<{ message: string }>> {
        return pengaduanApiDataSource.delete(id);
    }
}

// Singleton instance
export const pengaduanRepository = new PengaduanRepositoryImpl();
