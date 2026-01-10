/**
 * PesertaDetailPage - Detail halaman peserta
 * Menampilkan informasi lengkap peserta dengan aksi edit/hapus
 * 
 * Refactored to Clean Architecture:
 * - Uses usePesertaDetail hook for state & logic
 * - Uses separate components for UI sections
 */

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, User, AlertTriangle, RefreshCw, Calendar, MapPin, Stethoscope, ArrowRight } from 'lucide-react';
import { usePesertaDetail } from '../../hooks/usePesertaDetail';
import { useLatestVisit } from '@/data/queries';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
    PesertaProfileHeader,
    PesertaInfoCards,
    PesertaEditModal,
    PesertaDeleteModal,
} from '../../components/peserta';
import { FullPageLoading } from '../../components/common';
import { BeatLoader } from 'react-spinners';

export function PesertaDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        peserta,
        config,
        age,
        editForm,
        isLoading,
        isSaving,
        isDeleting,
        error,
        showDeleteConfirm,
        showEditModal,
        openEditModal,
        closeEditModal,
        handleEditChange,
        handleSaveEdit,
        openDeleteConfirm,
        closeDeleteConfirm,
        handleDelete,
        handleBack,
    } = usePesertaDetail(id);

    // Fetch last visit data for display
    const numericId = id ? parseInt(id, 10) : 0;
    const { data: lastVisit, isLoading: isLastVisitLoading } = useLatestVisit(numericId);

    // Navigation loading state
    const [isNavigating, setIsNavigating] = useState(false);

    const handleNavigateToPemeriksaan = (skipToStep2: boolean = false) => {
        setIsNavigating(true);
        const url = `/dashboard/examinations/${config?.urlSlug}/${id}${skipToStep2 ? '?step=2' : ''}`;
        // Small delay to show loading overlay
        setTimeout(() => navigate(url), 300);
    };

    // Dynamic page title
    useDocumentTitle(peserta?.nama ? `Detail: ${peserta.nama}` : 'Detail Peserta');

    // Saving state - full screen overlay
    if (isSaving) {
        return <FullPageLoading message="Menyimpan perubahan..." />;
    }

    // Navigating state - full screen overlay
    if (isNavigating) {
        return <FullPageLoading message="Memuat halaman pemeriksaan..." />;
    }

    // Deleting state - full screen overlay
    if (isDeleting) {
        return <FullPageLoading message="Menghapus peserta..." />;
    }

    // Loading state - full screen overlay like logout
    if (isLoading) {
        return <FullPageLoading message="Memuat data peserta..." />;
    }

    // Error state - show error message with retry button
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Gagal Memuat Data</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Coba Lagi
                    </button>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    // Not found state - only show after loading is complete
    if (!peserta || !config) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Peserta Tidak Ditemukan</h2>
                <p className="text-gray-500 mb-6">Data peserta dengan ID {id} tidak ditemukan.</p>
                <button
                    onClick={handleBack}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                    Kembali ke Daftar
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header with Breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Detail Peserta</h1>
                    <p className="text-gray-500 text-sm mt-1">Informasi lengkap peserta posyandu</p>
                </div>
                <nav className="flex items-center gap-2 text-sm">
                    <Link to="/dashboard" className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                        <Home className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <Link to="/dashboard/participants" className="text-gray-500 hover:text-gray-700 transition-colors">
                        Daftar Peserta
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{peserta.nama}</span>
                </nav>
            </div>

            {/* Profile Header */}
            <PesertaProfileHeader
                peserta={peserta}
                config={config}
                age={age}
                onEdit={openEditModal}
                onDelete={openDeleteConfirm}
            />

            {/* Info Cards */}
            <PesertaInfoCards peserta={peserta} />

            {/* Last Examination Card */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Pemeriksaan Terakhir</h3>
                    </div>
                </div>
                <div className="p-6">
                    {isLastVisitLoading ? (
                        <div className="flex items-center justify-center py-2">
                            <BeatLoader color="#3B82F6" size={8} margin={2} />
                        </div>
                    ) : lastVisit ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-8">
                                {/* Tanggal */}
                                <div>
                                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Tanggal</p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>{new Date(lastVisit.tanggal_kunjungan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                                {/* Waktu */}
                                {(() => {
                                    const date = new Date(lastVisit.tanggal_kunjungan);
                                    const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
                                    if (hasTime) {
                                        return (
                                            <div>
                                                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Waktu</p>
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                        <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2" />
                                                    </svg>
                                                    <span>{date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                                {/* Lokasi */}
                                <div>
                                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Lokasi</p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{lastVisit.lokasi === 'posyandu' ? 'Posyandu' : 'Kunjungan Rumah'}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleNavigateToPemeriksaan(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-slate-800 to-slate-900 text-white text-sm font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all"
                            >
                                <span>Lakukan Pemeriksaan</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Belum ada data pemeriksaan untuk peserta ini.</p>
                            <button
                                onClick={() => handleNavigateToPemeriksaan(false)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-slate-800 to-slate-900 text-white text-sm font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all"
                            >
                                <span>Pemeriksaan Pertama</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <PesertaDeleteModal
                isOpen={showDeleteConfirm}
                pesertaName={peserta.nama}
                onClose={closeDeleteConfirm}
                onConfirm={handleDelete}
            />

            {/* Edit Modal */}
            <PesertaEditModal
                isOpen={showEditModal}
                editForm={editForm}
                onClose={closeEditModal}
                onChange={handleEditChange}
                onSave={handleSaveEdit}
            />
        </div>
    );
}
