/**
 * PengaduanPage - Complaint List Page (Kader: own history, Admin: manage all)
 * Refactored for Clean Architecture and code reduction
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Filter } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { usePengaduan } from '../../hooks/usePengaduan';
import { 
    PengaduanStatsCards,
    PengaduanToolbar,
    PengaduanCardGrid,
    PengaduanFilterModal,
    PengaduanHistory,
    PengaduanKategoriModal,
    PengaduanPageHeader
} from '../../components/pengaduan';
import { Pagination } from '../../components/common';
import { KATEGORI_OPTIONS } from '../../../domain/entities/Pengaduan';

const ITEMS_PER_PAGE = 9;

export function PengaduanPage() {
    useDocumentTitle('Pengaduan');
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    
    const {
        pengaduanList,
        selectedPengaduan,
        stats,
        isLoading,
        isLoadingDetail,
        filters,
        setFilters,
        fetchDetail,
        fetchStats,
        clearSelectedPengaduan,
        lastPage: totalPages,
        total,
    } = usePengaduan();

    const currentPage = filters.page || 1;

    // Load stats on mount
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleCreateNew = () => {
        navigate('/dashboard/pengaduan/baru');
    };

    const setCurrentPage = (page: number) => {
        setFilters({ ...filters, page, per_page: ITEMS_PER_PAGE });
    };

    const commonHeaderProps = {
        title: isAdmin ? 'Kelola Pengaduan' : 'Pengaduan Saya',
        description: isAdmin ? 'Tinjau dan tanggapi pengaduan dari kader' : 'Riwayat pengaduan dan status',
        breadcrumbs: [{ label: 'Pengaduan', isCurrent: true }]
    };

    // Render Admin View
    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <PengaduanPageHeader {...commonHeaderProps} />

                <PengaduanStatsCards stats={stats} isLoading={!stats && isLoading} />

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <PengaduanToolbar
                            filters={filters}
                            onFilterChange={(newFilters) => {
                                setFilters({ ...newFilters, page: 1, per_page: ITEMS_PER_PAGE });
                            }}
                            onOpenFilterModal={() => setIsFilterModalOpen(true)}
                        />
                    </div>

                    {!isLoading && totalPages > 1 && pengaduanList.length > 0 && (
                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                            <p className="text-sm text-gray-600">
                                Menampilkan <span className="font-semibold text-slate-700">
                                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, total)}
                                </span> dari <span className="font-semibold text-slate-700">{total}</span> pengaduan
                            </p>
                        </div>
                    )}

                    <PengaduanCardGrid
                        pengaduanList={pengaduanList}
                        isLoading={isLoading}
                        onNavigate={(id) => navigate(`/dashboard/pengaduan/${id}`)}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrevPage={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        onNextPage={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        onGoToPage={setCurrentPage}
                    />
                </div>

                <PengaduanFilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    selectedStatus={filters.status}
                    selectedKategori={filters.kategori}
                    onApply={(status, kategori) => {
                        setFilters({ ...filters, status, kategori, page: 1 });
                    }}
                />
            </div>
        );
    }

    // Render Kader View
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <PengaduanPageHeader {...commonHeaderProps} />

            <PengaduanStatsCards stats={stats} isLoading={!stats && isLoading} />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan judul pengaduan..."
                            value={filters.search || ''}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-100 outline-none transition-all text-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsKategoriModalOpen(true)}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${
                            filters.kategori
                                ? 'border-slate-800 bg-slate-50 text-slate-800'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        <span>
                            {filters.kategori
                                ? KATEGORI_OPTIONS.find(k => k.id === filters.kategori)?.label
                                : 'Semua Kategori'
                            }
                        </span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <PengaduanHistory
                pengaduanList={pengaduanList}
                selectedPengaduan={selectedPengaduan}
                isLoading={isLoading}
                isLoadingDetail={isLoadingDetail}
                onSelect={fetchDetail}
                onCloseDetail={clearSelectedPengaduan}
                onCreateNew={handleCreateNew}
            />

            <PengaduanKategoriModal
                isOpen={isKategoriModalOpen}
                onClose={() => setIsKategoriModalOpen(false)}
                selectedKategori={filters.kategori}
                onApply={(kategori) => setFilters({ ...filters, kategori })}
            />
        </div>
    );
}
