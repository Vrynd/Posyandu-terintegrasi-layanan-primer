/**
 * UpdatePengaduanStatus UseCase
 * Updates the status of a complaint
 */

import { pengaduanRepository } from '../../../data/repositories/PengaduanRepositoryImpl';
import type { PengaduanStatus } from '../../entities/Pengaduan';

export class UpdatePengaduanStatusUseCase {
    async execute(id: number, status: PengaduanStatus): Promise<boolean> {
        const response = await pengaduanRepository.updateStatus(id, status);
        
        if (!response.success) {
            throw new Error(response.message || 'Gagal memperbarui status');
        }

        return true;
    }
}

export const updatePengaduanStatusUseCase = new UpdatePengaduanStatusUseCase();
