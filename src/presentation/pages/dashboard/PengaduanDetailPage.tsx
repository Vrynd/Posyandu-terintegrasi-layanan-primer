/**
 * PengaduanDetailPage - Admin detail view for complaint
 * Full page view with complete information and actions
 * 
 * Route: /dashboard/pengaduan/:id
 */

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    Home, ChevronRight, ArrowLeft, Clock, User, 
    AlertTriangle, FileText, Image as ImageIcon, MessageSquare,
    Send, Loader2, RefreshCw, Bug, ChevronDown
} from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { usePengaduan } from '../../hooks/usePengaduan';
import { useAuth } from '../../hooks/useAuth';
import { 
    STATUS_OPTIONS, 
    KATEGORI_OPTIONS, 
    PRIORITAS_OPTIONS,
    type PengaduanStatus 
} from '../../../domain/entities/Pengaduan';
import { FullPageLoading } from '../../components/common';

export function PengaduanDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const {
        selectedPengaduan,
        isLoading,
        isSubmitting,
        fetchDetail,
        updateStatus,
        addResponse,
    } = usePengaduan();

    const [responseText, setResponseText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<PengaduanStatus | ''>('');

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
        navigate('/dashboard/pengaduan');
    };

    // Loading state
    if (isLoading) {
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
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Coba Lagi
                    </button>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    // Get info
    const kategoriInfo = KATEGORI_OPTIONS.find(k => k.id === selectedPengaduan.kategori);
    const prioritasInfo = PRIORITAS_OPTIONS.find(p => p.id === selectedPengaduan.prioritas);
    const statusInfo = STATUS_OPTIONS.find(s => s.id === selectedPengaduan.status);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header with Breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Detail Pengaduan</h1>
                    <p className="text-gray-500 text-sm mt-1">Tinjau dan tanggapi pengaduan</p>
                </div>
                <nav className="hidden md:flex items-center gap-2 text-sm">
                    <Link to="/dashboard" className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                        <Home className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <Link to="/dashboard/pengaduan" className="text-gray-500 hover:text-gray-700 transition-colors">
                        Pengaduan
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900 truncate max-w-[200px]">{selectedPengaduan.judul}</span>
                </nav>
            </div>

            {/* Back Button (Mobile) */}
            <button
                onClick={handleBack}
                className="md:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Kembali</span>
            </button>

            {/* ===== SECTION 1: INFORMASI PENGADUAN ===== */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-600">1</span>
                        </div>
                        Informasi Pengaduan
                    </h2>
                </div>
                
                {/* Section Content */}
                <div className="p-6">
                    {/* Title Row with Badges on Right */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{selectedPengaduan.judul}</h3>
                        
                        {/* Badges - Right side */}
                        <div className="flex flex-wrap gap-2 shrink-0">
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${statusInfo?.bgColor} ${statusInfo?.color}`}>
                                {statusInfo?.label}
                            </span>
                            <span className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600">
                                {kategoriInfo?.label}
                            </span>
                            <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${prioritasInfo?.color}`}>
                                Prioritas {prioritasInfo?.label}
                            </span>
                        </div>
                    </div>

                    {/* Meta Info Row */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>Pelapor: <span className="font-medium">{selectedPengaduan.user?.name || 'Tidak diketahui'}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>
                                {new Date(selectedPengaduan.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })} pukul {new Date(selectedPengaduan.created_at).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <span>{selectedPengaduan.responses.length} respon</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== SECTION 2: DETAIL MASALAH & RESPON ===== */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-600">2</span>
                        </div>
                        Detail Masalah & Respon
                    </h2>
                </div>
                
                {/* Section Content */}
                <div className="p-6">
                    {/* Deskripsi Masalah - Styled like Langkah Reproduksi */}
                    <div className="mb-6 bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-slate-600" />
                            <h4 className="font-semibold text-slate-800">Deskripsi Masalah</h4>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedPengaduan.deskripsi}</p>
                    </div>

                    {/* Langkah Reproduksi */}
                    {selectedPengaduan.langkah_reproduksi && (
                        <div className="mb-6 bg-amber-50 border border-amber-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                                <h4 className="font-semibold text-amber-800">Langkah Reproduksi</h4>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedPengaduan.langkah_reproduksi}</p>
                        </div>
                    )}

                    {/* Screenshots - Always show section */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                            <h4 className="font-semibold text-gray-900">
                                Screenshot {selectedPengaduan.images && selectedPengaduan.images.length > 0 ? `(${selectedPengaduan.images.length})` : ''}
                            </h4>
                        </div>
                        {selectedPengaduan.images && selectedPengaduan.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {selectedPengaduan.images.map((img, idx) => (
                                    <a
                                        key={idx}
                                        href={img}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block aspect-video bg-gray-100 rounded-xl overflow-hidden hover:opacity-90 hover:shadow-md transition-all ring-1 ring-gray-200"
                                    >
                                        <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <ImageIcon className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-gray-500 text-sm">Tidak ada screenshot yang dilampirkan</p>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-100 my-6" />

                    {/* Riwayat Respon */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-5 h-5 text-slate-600" />
                            <h4 className="font-semibold text-gray-900">Riwayat Respon</h4>
                        </div>

                        {selectedPengaduan.responses.length > 0 ? (
                            <div className="space-y-4">
                                {selectedPengaduan.responses.map((r) => (
                                    <div key={r.id} className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-semibold text-emerald-800">{r.admin.name}</span>
                                                    <span className="text-xs text-emerald-600 ml-1">• Admin</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(r.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}, {new Date(r.created_at).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 pl-10">{r.response}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-7 h-7 text-slate-400" />
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">Belum ada respon</h4>
                                <p className="text-gray-500 text-sm">Admin belum memberikan respon untuk pengaduan ini</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== SECTION 3: TINDAKAN ADMIN ===== */}
            {isAdmin && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {/* Section Header */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-600">3</span>
                            </div>
                            Tindakan Admin
                        </h2>
                    </div>
                    
                    {/* Section Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Update Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Update Status
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value as PengaduanStatus)}
                                            className="w-full appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-xl text-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none bg-white"
                                        >
                                            <option value="">Pilih status...</option>
                                            {STATUS_OPTIONS.map((s) => (
                                                <option key={s.id} value={s.id}>{s.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <button
                                        onClick={handleUpdateStatus}
                                        disabled={!selectedStatus || isSubmitting}
                                        className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>

                            {/* Tambah Respon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tambah Respon
                                </label>
                                <div className="flex gap-2">
                                    <textarea
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                        placeholder="Ketik respon Anda untuk pelapor..."
                                        rows={1}
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none"
                                    />
                                    <button
                                        onClick={handleAddResponse}
                                        disabled={isSubmitting || !responseText.trim()}
                                        className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors flex items-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        Kirim
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
