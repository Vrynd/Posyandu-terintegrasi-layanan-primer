/**
 * GetPengaduanList UseCase
 * Retrieves list of complaints with optional filtering
 */

import { pengaduanRepository } from '../../../data/repositories/PengaduanRepositoryImpl';
import type { PengaduanFilterParams, Pengaduan } from '../../entities/Pengaduan';

export interface GetPengaduanListResult {
    data: Pengaduan[];
    total: number;
    current_page: number;
    last_page: number;
}

export class GetPengaduanListUseCase {
    async execute(params?: PengaduanFilterParams): Promise<GetPengaduanListResult> {
        const response = await pengaduanRepository.getPengaduan(params);
        
        if (!response.success) {
            throw new Error(response.message || 'Gagal memuat data pengaduan');
        }

        return {
            data: response.data.data,
            total: response.data.total,
            current_page: response.data.current_page,
            last_page: response.data.last_page
        };
    }
}

export const getPengaduanListUseCase = new GetPengaduanListUseCase();
