/**
 * PengaduanToolbar - Search and filter toolbar for admin
 */

import { Search } from 'lucide-react';
import type { PengaduanKategori, PengaduanFilterParams } from '../../../domain/entities/Pengaduan';
import { KATEGORI_OPTIONS } from '../../../domain/entities/Pengaduan';

interface PengaduanToolbarProps {
    filters: PengaduanFilterParams;
    onFilterChange: (filters: PengaduanFilterParams) => void;
    onResetFilter: () => void;
    showResetButton: boolean;
}

export function PengaduanToolbar({ 
    filters, 
    onFilterChange, 
    onResetFilter,
    showResetButton 
}: PengaduanToolbarProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari pengaduan..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-amber-400 outline-none"
                            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                        />
                    </div>
                </div>
                <select
                    value={filters.kategori || ''}
                    onChange={(e) => onFilterChange({ 
                        ...filters, 
                        kategori: e.target.value as PengaduanKategori || undefined 
                    })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:border-amber-400 outline-none"
                >
                    <option value="">Semua Kategori</option>
                    {KATEGORI_OPTIONS.map((kategori) => (
                        <option key={kategori.id} value={kategori.id}>{kategori.label}</option>
                    ))}
                </select>
                {showResetButton && (
                    <button
                        onClick={onResetFilter}
                        className="px-4 py-2 text-sm text-amber-600 hover:text-amber-700"
                    >
                        Reset Filter
                    </button>
                )}
            </div>
        </div>
    );
}
