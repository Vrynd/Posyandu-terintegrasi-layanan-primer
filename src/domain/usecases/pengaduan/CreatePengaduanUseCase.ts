/**
 * CreatePengaduan UseCase
 * Handlers creation of a new complaint
 */

import { pengaduanRepository } from '../../../data/repositories/PengaduanRepositoryImpl';
import type { CreatePengaduanParams } from '../../entities/Pengaduan';

export class CreatePengaduanUseCase {
    async execute(params: CreatePengaduanParams): Promise<{ id: number }> {
        const response = await pengaduanRepository.createPengaduan(params);
        
        if (!response.success) {
            throw new Error(response.message || 'Gagal mengirim pengaduan');
        }

        return response.data;
    }
}

export const createPengaduanUseCase = new CreatePengaduanUseCase();
