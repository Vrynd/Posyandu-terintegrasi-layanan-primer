/**
 * GetPengaduanDetail UseCase
 * Retrieves detail of a single complaint by ID
 */

import { pengaduanRepository } from '../../../data/repositories/PengaduanRepositoryImpl';
import type { PengaduanDetail } from '../../entities/Pengaduan';

export class GetPengaduanDetailUseCase {
    async execute(id: number): Promise<PengaduanDetail> {
        const response = await pengaduanRepository.getPengaduanById(id);
        
        if (!response.success) {
            throw new Error(response.message || 'Gagal memuat detail pengaduan');
        }

        return response.data;
    }
}

export const getPengaduanDetailUseCase = new GetPengaduanDetailUseCase();
