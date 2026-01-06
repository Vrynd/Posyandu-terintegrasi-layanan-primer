/**
 * PengaduanHistory - Kader's pengaduan history view
 * Version 2: Card-based layout with color-coded priority strips
 */

import { useState } from 'react';
import { Bug, Clock, MessageSquare, CheckCircle2, X, ChevronRight, Plus } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import type { Pengaduan, PengaduanDetail } from '../../../domain/entities/Pengaduan';
import { STATUS_OPTIONS, KATEGORI_OPTIONS } from '../../../domain/entities/Pengaduan';
import { getStorageUrl } from '../../../data/core/api';
import { ImageLightbox } from '../common';

interface PengaduanHistoryProps {
    pengaduanList: Pengaduan[];
    selectedPengaduan: PengaduanDetail | null;
    isLoading: boolean;
    isLoadingDetail?: boolean;
    onSelect: (id: number) => void;
    onCloseDetail: () => void;
    onCreateNew: () => void;
}

export function PengaduanHistory({ 
    pengaduanList, 
    selectedPengaduan,
    isLoading,
    isLoadingDetail,
    onSelect, 
    onCloseDetail,
    onCreateNew 
}: PengaduanHistoryProps) {
    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [lightboxImages, setLightboxImages] = useState<string[]>([]);

    const openLightbox = (images: string[], index: number) => {
        setLightboxImages(images.map(img => getStorageUrl(img)));
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <BeatLoader color="#3B82F6" size={12} margin={4} />
                <p className="text-gray-500 mt-4">Memuat data pengaduan...</p>
            </div>
        );
    }

    if (pengaduanList.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bug className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-semibold text-gray-900">Belum ada pengaduan</p>
                <p className="text-sm text-gray-500 mt-1">Laporkan masalah yang Anda temui</p>
                <button
                    onClick={onCreateNew}
                    className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition-colors"
                >
                    Buat Pengaduan Pertama
                </button>
            </div>
        );
    }

    // Priority color mapping for left strip
    const getPriorityStrip = (prioritas: string) => {
        switch (prioritas) {
            case 'tinggi': return 'bg-red-500';
            case 'sedang': return 'bg-amber-500';
            case 'rendah': return 'bg-green-500';
            default: return 'bg-gray-300';
        }
    };

    return (
        <>
            {/* Card Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pengaduanList.map(pengaduan => {
                    const statusOpt = STATUS_OPTIONS.find((s) => s.id === pengaduan.status);
                    const kategoriOpt = KATEGORI_OPTIONS.find((k) => k.id === pengaduan.kategori);
                    
                    return (
                        <div
                            key={pengaduan.id}
                            onClick={() => onSelect(pengaduan.id)}
                                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:border-gray-200 transition-all"
                        >
                            {/* Priority Strip */}
                            <div className={`h-1 ${getPriorityStrip(pengaduan.prioritas)}`} />
                            
                            <div className="p-5">
                                {/* Header: Category + Status */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        {kategoriOpt?.label || pengaduan.kategori}
                                    </span>
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusOpt?.bgColor} ${statusOpt?.color}`}>
                                        {statusOpt?.label}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-slate-700 transition-colors">
                                    {pengaduan.judul}
                                </h3>

                                {/* Description Preview */}
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                    {pengaduan.deskripsi}
                                </p>

                                {/* Footer: Date + Responses */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(pengaduan.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            {pengaduan.responses_count}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-slate-600 transition-colors" />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Card */}
                <button
                    onClick={onCreateNew}
                    className="group bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center min-h-[200px] hover:border-slate-400 hover:bg-slate-50 transition-all"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-slate-100 flex items-center justify-center mb-3 transition-colors">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-slate-600" />
                    </div>
                    <p className="font-medium text-gray-500 group-hover:text-slate-700">Buat Pengaduan Baru</p>
                </button>
            </div>

            {/* Detail Modal - Opens immediately, shows loading inside */}
            {(selectedPengaduan || isLoadingDetail) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop with blur */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={!isLoadingDetail ? onCloseDetail : undefined}
                    />

                    {/* Modal - Wider for better content display */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        {/* ===== HEADER ===== */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-linear-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
                                    <Bug className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Detail Pengaduan</h3>
                                    <p className="text-xs text-gray-500">Lihat informasi lengkap pengaduan Anda</p>
                                </div>
                            </div>
                            <button
                                onClick={onCloseDetail}
                                disabled={isLoadingDetail}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* ===== CONTENT ===== */}
                        {isLoadingDetail ? (
                            /* Loading State Inside Modal */
                            <div className="flex-1 px-6 py-12 text-center">
                                <BeatLoader color="#3B82F6" size={14} margin={5} />
                                <p className="text-gray-500 mt-4">Memuat detail pengaduan...</p>
                            </div>
                        ) : selectedPengaduan ? (
                            /* Actual Content */
                            <div className="flex-1 overflow-y-auto px-6 py-5">
                            {/* Top Section: Title + Badges */}
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-5 border-b border-gray-100">
                                <div className="flex-1">
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedPengaduan.judul}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>
                                            {new Date(selectedPengaduan.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${STATUS_OPTIONS.find(s => s.id === selectedPengaduan.status)?.bgColor} ${STATUS_OPTIONS.find(s => s.id === selectedPengaduan.status)?.color}`}>
                                        {STATUS_OPTIONS.find(s => s.id === selectedPengaduan.status)?.label}
                                    </span>
                                    <span className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 whitespace-nowrap">
                                        {KATEGORI_OPTIONS.find(k => k.id === selectedPengaduan.kategori)?.label}
                                    </span>
                                    <span className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
                                        selectedPengaduan.prioritas === 'tinggi' ? 'bg-red-100 text-red-700' :
                                        selectedPengaduan.prioritas === 'sedang' ? 'bg-amber-100 text-amber-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        Prioritas {selectedPengaduan.prioritas.charAt(0).toUpperCase() + selectedPengaduan.prioritas.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="space-y-4 py-5">
                                {/* Description Section */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Deskripsi Masalah</label>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedPengaduan.deskripsi}</p>
                                </div>

                                {/* Reproduction Steps (if exists) */}
                                {selectedPengaduan.langkah_reproduksi && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Langkah Reproduksi</label>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedPengaduan.langkah_reproduksi}</p>
                                    </div>
                                )}

                                {/* Images (if exists) */}
                                {selectedPengaduan.images && selectedPengaduan.images.length > 0 && (
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Lampiran Gambar ({selectedPengaduan.images.length})</label>
                                        <div className={`grid gap-2 ${
                                            selectedPengaduan.images.length === 1 ? 'grid-cols-1' :
                                            selectedPengaduan.images.length === 2 ? 'grid-cols-2' :
                                            'grid-cols-3'
                                        }`}>
                                            {selectedPengaduan.images.map((img, idx) => {
                                                const imageUrl = getStorageUrl(img);
                                                return (
                                                    <button 
                                                        key={idx} 
                                                        onClick={() => openLightbox(selectedPengaduan.images, idx)}
                                                        className="block aspect-video bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 hover:ring-2 hover:ring-blue-400 transition-all cursor-zoom-in"
                                                    >
                                                        <img src={imageUrl} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Admin Responses */}
                            {selectedPengaduan.responses.length > 0 && (
                                <div className="pt-5 border-t border-gray-100">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                        Respon Admin ({selectedPengaduan.responses.length})
                                    </label>
                                    <div className="space-y-3">
                                        {selectedPengaduan.responses.map((r) => (
                                            <div key={r.id} className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center">
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-semibold text-emerald-800">{r.admin.name}</span>
                                                        <span className="text-xs text-emerald-600 ml-1">• Admin</span>
                                                    </div>
                                                    <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(r.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 leading-relaxed pl-9">{r.response}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        ) : null}

                        {/* ===== FOOTER ===== */}
                        {!isLoadingDetail && selectedPengaduan && (
                            <div className="px-6 py-4 border-t border-gray-100 bg-white shrink-0">
                                <button
                                    onClick={onCloseDetail}
                                    className="w-full py-3 px-4 bg-linear-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-slate-300"
                                >
                                    Tutup
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Lightbox for viewing images */}
            <ImageLightbox
                images={lightboxImages}
                initialIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
            />
        </>
    );
}
