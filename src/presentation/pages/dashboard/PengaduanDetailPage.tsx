/**
 * PengaduanDetailPage - Admin detail view for complaint
 * Refactored to use smaller components and UseCases via hook
 * 
 * Route: /dashboard/complaints/:id
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Bug } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { usePengaduan } from '../../hooks/usePengaduan';
import { useAuth } from '../../hooks/useAuth';
import type { PengaduanStatus } from '../../../domain/entities/Pengaduan';
import { FullPageLoading, ImageLightbox } from '../../components/common';
import { getStorageUrl } from '../../../data/core/api';
import { 
    PengaduanPageHeader, 
    PengaduanDetailSummary, 
    PengaduanDetailInfo, 
    PengaduanDetailResponses, 
    PengaduanAdminActions 
} from '../../components/pengaduan';

export function PengaduanDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const {
        selectedPengaduan,
        isLoadingDetail,
        isSubmitting,
        fetchDetail,
        updateStatus,
        addResponse,
    } = usePengaduan();

    const [responseText, setResponseText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<PengaduanStatus | ''>('');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [lightboxImages, setLightboxImages] = useState<string[]>([]);

    const openLightbox = (images: string[], index: number) => {
        setLightboxImages(images.map(img => getStorageUrl(img)));
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    // Fetch detail on mount
    useEffect(() => {
        if (id) {
            fetchDetail(parseInt(id));
        }
    }, [id, fetchDetail]);

    // Dynamic page title
    useDocumentTitle(selectedPengaduan?.judul ? `Pengaduan: ${selectedPengaduan.judul}` : 'Detail Pengaduan');

    // Handlers
    const handleUpdateStatus = async () => {
        if (!selectedPengaduan || !selectedStatus) return;
        const success = await updateStatus(selectedPengaduan.id, selectedStatus);
        if (success) setSelectedStatus('');
    };

    const handleAddResponse = async () => {
        if (!selectedPengaduan || !responseText.trim()) return;
        const success = await addResponse(selectedPengaduan.id, responseText);
        if (success) setResponseText('');
    };

    const handleBack = () => {
        navigate('/dashboard/complaints');
    };

    // Loading state
    if (isLoadingDetail) {
        return <FullPageLoading message="Memuat detail pengaduan..." />;
    }

    // Not found state
    if (!selectedPengaduan) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Pengaduan Tidak Ditemukan</h2>
                <p className="text-gray-500 mb-6">Data pengaduan dengan ID {id} tidak ditemukan.</p>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        Coba Lagi
                    </button>
                    <button onClick={handleBack} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <PengaduanPageHeader 
                    title="Detail Pengaduan" 
                    description="Tinjau dan tanggapi pengaduan"
                    breadcrumbs={[
                        { label: 'Complaints', path: '/dashboard/complaints' },
                        { label: selectedPengaduan.judul, isCurrent: true }
                    ]}
                />

                {/* Back Button (Mobile) */}
                <button onClick={handleBack} className="md:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Kembali</span>
                </button>

                {/* Content Sections */}
                <div className="space-y-4">
                    <PengaduanDetailSummary pengaduan={selectedPengaduan} />
                    
                    <PengaduanDetailInfo 
                        pengaduan={selectedPengaduan} 
                        onOpenLightbox={openLightbox} 
                    />

                    <PengaduanDetailResponses pengaduan={selectedPengaduan} />

                    {isAdmin && (
                        <PengaduanAdminActions 
                            selectedStatus={selectedStatus}
                            onStatusChange={setSelectedStatus}
                            onUpdateStatus={handleUpdateStatus}
                            responseText={responseText}
                            onResponseTextChange={setResponseText}
                            onAddResponse={handleAddResponse}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </div>
            </div>

            <ImageLightbox
                images={lightboxImages}
                initialIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
            />
        </>
    );
}
