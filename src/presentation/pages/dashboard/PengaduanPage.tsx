/**
 * PengaduanPage - Role-based Complaint/Bug Report Page
 * Kader: Create complaints and view own history
 * Admin: Manage all complaints, respond, and update status
 * 
 * Refactored: Uses separated components for clean architecture
 */

import { useState, useEffect } from 'react';
import { Home, ChevronRight, Plus, List } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { usePengaduan } from '../../hooks/usePengaduan';
import { 
    PengaduanStatsCards,
    PengaduanToolbar,
    PengaduanList,
    PengaduanDetailPanel,
    PengaduanForm,
    PengaduanHistory
} from '../../components/pengaduan';

type TabType = 'create' | 'history';

export function PengaduanPage() {
    useDocumentTitle('Pengaduan');
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    
    const {
        pengaduanList,
        selectedPengaduan,
        stats,
        isLoading,
        isSubmitting,
        filters,
        setFilters,
        fetchDetail,
        fetchStats,
        createPengaduan,
        updateStatus,
        addResponse,
        clearSelectedPengaduan,
    } = usePengaduan();

    // Tab state (Kader only)
    const [activeTab, setActiveTab] = useState<TabType>('create');

    // Load stats for admin
    useEffect(() => {
        if (isAdmin) {
            fetchStats();
        }
    }, [isAdmin, fetchStats]);

    // Admin handlers
    const handleUpdateStatus = async (status: Parameters<typeof updateStatus>[1]) => {
        if (!selectedPengaduan) return false;
        return updateStatus(selectedPengaduan.id, status);
    };

    const handleAddResponse = async (response: string) => {
        if (!selectedPengaduan) return false;
        return addResponse(selectedPengaduan.id, response);
    };

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
                    <PengaduanStatsCards 
                        stats={stats} 
                        filters={filters} 
                        onFilterChange={setFilters} 
                    />
                )}

                {/* Toolbar */}
                <PengaduanToolbar
                    filters={filters}
                    onFilterChange={setFilters}
                    onResetFilter={() => setFilters({ ...filters, status: undefined })}
                    showResetButton={!!filters.status}
                />

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* List */}
                    <div className="lg:col-span-2">
                        <PengaduanList
                            pengaduanList={pengaduanList}
                            selectedPengaduan={selectedPengaduan}
                            isLoading={isLoading}
                            onSelect={fetchDetail}
                            showUserInfo={true}
                        />
                    </div>

                    {/* Detail Panel */}
                    <div className="lg:col-span-1">
                        <PengaduanDetailPanel
                            pengaduan={selectedPengaduan}
                            isSubmitting={isSubmitting}
                            onClose={clearSelectedPengaduan}
                            onUpdateStatus={handleUpdateStatus}
                            onAddResponse={handleAddResponse}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Render Kader View
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pengaduan Sistem</h1>
                    <p className="text-gray-500 text-sm mt-1">Laporkan bug atau masalah yang Anda temukan</p>
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

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'create'
                            ? 'bg-amber-500 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <Plus className="w-4 h-4" />
                    Buat Pengaduan
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'history'
                            ? 'bg-amber-500 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <List className="w-4 h-4" />
                    Riwayat Saya
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'create' ? (
                <PengaduanForm
                    userName={user?.name || 'User'}
                    isSubmitting={isSubmitting}
                    onSubmit={createPengaduan}
                    onSuccess={() => setActiveTab('history')}
                />
            ) : (
                <PengaduanHistory
                    pengaduanList={pengaduanList}
                    selectedPengaduan={selectedPengaduan}
                    isLoading={isLoading}
                    onSelect={fetchDetail}
                    onCloseDetail={clearSelectedPengaduan}
                    onCreateNew={() => setActiveTab('create')}
                />
            )}
        </div>
    );
}
