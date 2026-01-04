import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import type { KategoriKey } from '@/domain/entities/Peserta';
import type { SortType } from '@/presentation/hooks/usePesertaList';

interface PesertaListToolbarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedKategori: KategoriKey | null;
    onFilterChange: (kategori: KategoriKey | null) => void;
    selectedSort: SortType;
    onSortChange: (sort: SortType) => void;
    onAddPeserta: () => void;
    kategoriConfig: any;
    sortOptions: { value: SortType; label: string }[];
}

export function PesertaListToolbar({
    searchQuery,
    onSearchChange,
    selectedKategori,
    onFilterChange,
    selectedSort,
    onSortChange,
    onAddPeserta,
    kategoriConfig,
    sortOptions
}: PesertaListToolbarProps) {
    const kategoriKeys = Object.keys(kategoriConfig) as KategoriKey[];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="space-y-4">
                {/* Search Input + Add Button Row */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan NIK atau nama peserta..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                        />
                    </div>
                    <button
                        onClick={onAddPeserta}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Peserta Baru</span>
                    </button>
                </div>

                {/* Filters and Sorting Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Category Filter */}
                    <div className="relative flex-1">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={selectedKategori || 'all'}
                            onChange={(e) => onFilterChange(e.target.value === 'all' ? null : e.target.value as KategoriKey)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="all">Semua Kategori</option>
                            {kategoriKeys.map((key) => (
                                <option key={key} value={key}>
                                    {kategoriConfig[key].label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative flex-1">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={selectedSort}
                            onChange={(e) => onSortChange(e.target.value as SortType)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
