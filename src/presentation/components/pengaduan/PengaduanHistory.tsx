/**
 * PengaduanHistory - Kader's pengaduan history view
 */

import { Bug, Clock, MessageSquare, CheckCircle2, X } from 'lucide-react';
import type { Pengaduan, PengaduanDetail } from '../../../domain/entities/Pengaduan';
import { STATUS_OPTIONS } from '../../../domain/entities/Pengaduan';

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
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 mt-2">Memuat data...</p>
            </div>
        );
    }

    if (pengaduanList.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <Bug className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada pengaduan</p>
                <button
                    onClick={onCreateNew}
                    className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium"
                >
                    Buat Pengaduan Pertama
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {pengaduanList.map(pengaduan => {
                    const statusOpt = STATUS_OPTIONS.find((s) => s.id === pengaduan.status);
                    
                    return (
                        <div
                            key={pengaduan.id}
                            className="bg-white rounded-xl border border-gray-100 p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{pengaduan.judul}</h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{pengaduan.deskripsi}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusOpt?.bgColor} ${statusOpt?.color}`}>
                                    {statusOpt?.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(pengaduan.created_at).toLocaleDateString('id-ID')}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {pengaduan.responses_count} respon
                                </span>
                            </div>
                            
                            {pengaduan.responses_count > 0 && (
                                <button
                                    onClick={() => onSelect(pengaduan.id)}
                                    className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium"
                                >
                                    Lihat respon →
                                </button>
                            )}
                        </div>
                    );
                })}
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
