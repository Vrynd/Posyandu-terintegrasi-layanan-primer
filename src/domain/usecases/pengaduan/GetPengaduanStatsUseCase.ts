/**
 * GetPengaduanStats UseCase
 * Retrieves statistics for complaints
 */

import { pengaduanRepository } from '../../../data/repositories/PengaduanRepositoryImpl';
import type { PengaduanStats } from '../../entities/Pengaduan';

export class GetPengaduanStatsUseCase {
    async execute(): Promise<PengaduanStats> {
        const response = await pengaduanRepository.getStats();
        
        if (!response.success) {
            throw new Error(response.message || 'Gagal memuat statistik pengaduan');
        }

        return response.data;
    }
}

export const getPengaduanStatsUseCase = new GetPengaduanStatsUseCase();
