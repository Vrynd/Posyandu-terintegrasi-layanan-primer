/**
 * PengaduanPage - Complaint List Page (Kader: own history, Admin: manage all)
 * Redesigned to match PesertaPage layout with slate theme
 */

import { useEffect, useState } from 'react';
import { Home, ChevronRight, Search, ChevronDown, ClipboardList, Hourglass, Settings, BadgeCheck, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { usePengaduan } from '../../hooks/usePengaduan';
import { 
    PengaduanStatsCards,
    PengaduanToolbar,
    PengaduanCardGrid,
    PengaduanFilterModal,
    PengaduanHistory,
    PengaduanKategoriModal
} from '../../components/pengaduan';
import { Pagination } from '../../components/common';
import { KATEGORI_OPTIONS } from '../../../domain/entities/Pengaduan';

// Pagination config
const ITEMS_PER_PAGE = 9;

export function PengaduanPage() {
    useDocumentTitle('Pengaduan');
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    const {
        pengaduanList,
        selectedPengaduan,
        stats,
        isLoading,
        filters,
        setFilters,
        fetchDetail,
        fetchStats,
        clearSelectedPengaduan,
    } = usePengaduan();

    // Load stats for admin
    useEffect(() => {
        if (isAdmin) {
            fetchStats();
        }
    }, [isAdmin, fetchStats]);

    const handleCreateNew = () => {
        navigate('/dashboard/pengaduan/baru');
    };

    // Pagination logic for admin view
    const totalPages = Math.ceil(pengaduanList.length / ITEMS_PER_PAGE);
    const paginatedList = pengaduanList.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Render Admin View
    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Pengaduan</h1>
                        <p className="text-gray-500 text-sm mt-1">Tinjau dan tanggapi pengaduan dari kader</p>
                    </div>
                    <nav className="hidden md:flex items-center gap-2 text-sm">
                        <Link to="/dashboard" className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                            <Home className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">Pengaduan</span>
                    </nav>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <PengaduanStatsCards stats={stats} />
                )}

                {/* Main Card */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {/* Toolbar Section */}
                    <div className="p-6 border-b border-gray-100">
                        <PengaduanToolbar
                            filters={filters}
                            onFilterChange={(newFilters) => {
                                setFilters(newFilters);
                                setCurrentPage(1);
                            }}
                            onOpenFilterModal={() => setIsFilterModalOpen(true)}
                        />
                    </div>

                    {/* Results Summary - only show when multiple pages */}
                    {!isLoading && totalPages > 1 && paginatedList.length > 0 && (
                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                            <p className="text-sm text-gray-600">
                                Menampilkan{' '}
                                <span className="font-semibold text-slate-700">
                                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, pengaduanList.length)}
                                </span>
                                {' '}dari <span className="font-semibold text-slate-700">{pengaduanList.length}</span> pengaduan
                            </p>
                        </div>
                    )}

                    {/* Card Grid View */}
                    <PengaduanCardGrid
                        pengaduanList={paginatedList}
                        isLoading={isLoading}
                        onNavigate={(id) => navigate(`/dashboard/pengaduan/${id}`)}
                    />

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrevPage={() => setCurrentPage(p => Math.max(1, p - 1))}
                        onNextPage={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        onGoToPage={setCurrentPage}
                    />
                </div>

                {/* Filter Modal */}
                <PengaduanFilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    selectedStatus={filters.status}
                    selectedKategori={filters.kategori}
                    onApply={(status, kategori) => {
                        setFilters({ ...filters, status, kategori });
                        setCurrentPage(1);
                    }}
                />
            </div>
        );
    }

    // Calculate stats for Kader view
    const kaderStats = {
        total: pengaduanList.length,
        menunggu: pengaduanList.filter(p => p.status === 'pending').length,
        diproses: pengaduanList.filter(p => p.status === 'in_progress').length,
        selesai: pengaduanList.filter(p => p.status === 'resolved').length,
    };

    // Render Kader View
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pengaduan Saya</h1>
                    <p className="text-gray-500 text-sm mt-1">Riwayat pengaduan dan status</p>
                </div>
                <nav className="hidden md:flex items-center gap-2 text-sm">
                    <Link to="/dashboard" className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                        <Home className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">Pengaduan</span>
                </nav>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Total */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-slate-400">
                    <div className="w-11 h-11 bg-linear-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{kaderStats.total}</p>
                        <p className="text-xs text-gray-500">Total Pengaduan</p>
                    </div>
                </div>
                {/* Menunggu */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-amber-400">
                    <div className="w-11 h-11 bg-linear-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                        <Hourglass className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{kaderStats.menunggu}</p>
                        <p className="text-xs text-gray-500">Menunggu</p>
                    </div>
                </div>
                {/* Diproses */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-blue-500">
                    <div className="w-11 h-11 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{kaderStats.diproses}</p>
                        <p className="text-xs text-gray-500">Diproses</p>
                    </div>
                </div>
                {/* Selesai */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-green-500">
                    <div className="w-11 h-11 bg-linear-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <BadgeCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{kaderStats.selesai}</p>
                        <p className="text-xs text-gray-500">Selesai</p>
                    </div>
                </div>
            </div>

            {/* Toolbar Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <div className="flex gap-3">
                    {/* Search Input */}
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
                    {/* Category Filter Button */}
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

            {/* History Results */}
            <PengaduanHistory
                pengaduanList={pengaduanList}
                selectedPengaduan={selectedPengaduan}
                isLoading={isLoading}
                onSelect={fetchDetail}
                onCloseDetail={clearSelectedPengaduan}
                onCreateNew={handleCreateNew}
            />

            {/* Category Filter Modal */}
            <PengaduanKategoriModal
                isOpen={isKategoriModalOpen}
                onClose={() => setIsKategoriModalOpen(false)}
                selectedKategori={filters.kategori}
                onApply={(kategori) => setFilters({ ...filters, kategori })}
            />
        </div>
    );
}
