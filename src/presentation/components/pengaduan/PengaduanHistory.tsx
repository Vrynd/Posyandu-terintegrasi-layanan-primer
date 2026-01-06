/**
 * PengaduanHistory - Kader's pengaduan history view
 * Version 2: Card-based layout with color-coded priority strips
 */

import { Bug, Clock, MessageSquare, CheckCircle2, X, ChevronRight, Plus } from 'lucide-react';
import type { Pengaduan, PengaduanDetail } from '../../../domain/entities/Pengaduan';
import { STATUS_OPTIONS, KATEGORI_OPTIONS } from '../../../domain/entities/Pengaduan';

interface PengaduanHistoryProps {
    pengaduanList: Pengaduan[];
    selectedPengaduan: PengaduanDetail | null;
    isLoading: boolean;
    onSelect: (id: number) => void;
    onCloseDetail: () => void;
    onCreateNew: () => void;
}

export function PengaduanHistory({ 
    pengaduanList, 
    selectedPengaduan,
    isLoading,
    onSelect, 
    onCloseDetail,
    onCreateNew 
}: PengaduanHistoryProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <div className="w-10 h-10 border-4 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto" />
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

            {/* Detail Modal */}
            {selectedPengaduan && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Detail Pengaduan</h3>
                                <button onClick={onCloseDetail} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <h4 className="font-medium text-gray-900">{selectedPengaduan.judul}</h4>
                            <p className="text-sm text-gray-500 mt-2">{selectedPengaduan.deskripsi}</p>

                            {selectedPengaduan.responses.length > 0 && (
                                <div className="mt-6">
                                    <h5 className="text-sm font-medium text-gray-700 mb-3">Respon dari Admin</h5>
                                    <div className="space-y-3">
                                        {selectedPengaduan.responses.map((r) => (
                                            <div key={r.id} className="p-4 bg-green-50 border border-green-100 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-700">{r.admin.name}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{r.response}</p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {new Date(r.created_at).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
