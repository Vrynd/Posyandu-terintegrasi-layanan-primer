/**
 * DeletePengaduan UseCase
 * Deletes a complaint (soft delete)
 */

import { pengaduanRepository } from '../../../data/repositories/PengaduanRepositoryImpl';

export class DeletePengaduanUseCase {
    async execute(id: number): Promise<boolean> {
        const response = await pengaduanRepository.deletePengaduan(id);
        
        if (!response.success) {
            throw new Error(response.message || 'Gagal menghapus pengaduan');
        }

        return true;
    }
}

export const deletePengaduanUseCase = new DeletePengaduanUseCase();
