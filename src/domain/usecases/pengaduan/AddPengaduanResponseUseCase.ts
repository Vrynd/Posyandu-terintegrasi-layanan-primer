/**
 * AddPengaduanResponse UseCase
 * Adds a response to a complaint
 */

import { pengaduanRepository } from '../../../data/repositories/PengaduanRepositoryImpl';
import type { CreateResponseParams } from '../../entities/Pengaduan';

export class AddPengaduanResponseUseCase {
    async execute(params: CreateResponseParams): Promise<number> {
        const response = await pengaduanRepository.addResponse(params);
        
        if (!response.success) {
            throw new Error(response.message || 'Gagal mengirim respon');
        }

        return response.data.id;
    }
}

export const addPengaduanResponseUseCase = new AddPengaduanResponseUseCase();
