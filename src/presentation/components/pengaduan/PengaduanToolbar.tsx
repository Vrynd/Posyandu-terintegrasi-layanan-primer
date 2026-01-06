/**
 * PengaduanToolbar - Search and filter toolbar for admin
 */

import { Search, ListFilter } from 'lucide-react';
import type { PengaduanFilterParams } from '../../../domain/entities/Pengaduan';

interface PengaduanToolbarProps {
    filters: PengaduanFilterParams;
    onFilterChange: (filters: PengaduanFilterParams) => void;
    onOpenFilterModal: () => void;
}

export function PengaduanToolbar({ 
    filters, 
    onFilterChange, 
    onOpenFilterModal
}: PengaduanToolbarProps) {
    const hasActiveFilters = !!filters.status || !!filters.kategori;

    return (
        <div className="flex flex-wrap gap-3">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari pengaduan..."
                        value={filters.search || ''}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none text-sm"
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                    />
                </div>
            </div>
            
            {/* Filter Button */}
            <button
                onClick={onOpenFilterModal}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${
                    hasActiveFilters
                        ? 'border-slate-800 bg-slate-50 text-slate-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
            >
                <ListFilter className="w-4 h-4" />
                <span>Filter</span>
                {hasActiveFilters && (
                    <span className="ml-1 px-1.5 py-0.5 bg-slate-800 text-white text-xs rounded">
                        {(filters.status ? 1 : 0) + (filters.kategori ? 1 : 0)}
                    </span>
                )}
            </button>
        </div>
    );
}
