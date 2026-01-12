/**
 * PesertaProfileHeader Component
 * Gradient header with avatar, name, category, and action buttons
 * Updated to support both camelCase (legacy) and snake_case (API) field names
 */

import { Edit2, Trash2 } from 'lucide-react';
import type { KategoriConfig } from '../../constants/kategoriConfig';

interface PesertaData {
    nama: string;
}

interface Props {
    peserta: PesertaData;
    config: KategoriConfig;
    age: number;
    onEdit: () => void;
    onDelete: () => void;
}

export function PesertaProfileHeader({ peserta, config, age, onEdit, onDelete }: Props) {
    const Icon = config.icon;

    return (
        <div className={`bg-linear-to-r ${config.gradient} rounded-2xl p-5 sm:p-6 text-white mb-6`}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold truncate">{peserta.nama}</h1>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
                            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/20 rounded-full text-[11px] sm:text-sm font-medium">
                                {config.label}
                            </span>
                            <span className="text-white/80 text-[11px] sm:text-sm">
                                {age} tahun
                            </span>
                        </div>
                    </div>
                </div>
                {/* Action buttons as icon buttons */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={onDelete}
                        title="Hapus"
                        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors shrink-0"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onEdit}
                        title="Edit Data"
                        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors shrink-0"
                    >
                        <Edit2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
