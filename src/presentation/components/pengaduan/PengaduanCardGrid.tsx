/**
 * PengaduanCardGrid Component
 * Compact card grid layout - mobile-first approach
 */

import { Bug, ChevronRight, Loader2, MessageSquare, Clock, User } from 'lucide-react';
import type { Pengaduan } from '../../../domain/entities/Pengaduan';
import { STATUS_OPTIONS, KATEGORI_OPTIONS } from '../../../domain/entities/Pengaduan';

interface Props {
    isLoading?: boolean;
    pengaduanList: Pengaduan[];
    onNavigate: (id: number) => void;
}

export function PengaduanCardGrid({ isLoading, pengaduanList, onNavigate }: Props) {
    const getStatusInfo = (status: string) => STATUS_OPTIONS.find(s => s.id === status);
    const getKategoriInfo = (kategori: string) => KATEGORI_OPTIONS.find(k => k.id === kategori);

    if (isLoading) {
        return (
            <div className="py-20 text-center">
                <Loader2 className="w-10 h-10 text-slate-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Memuat data pengaduan...</p>
            </div>
        );
    }

    if (pengaduanList.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bug className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-gray-600 font-semibold">Tidak ada pengaduan ditemukan</p>
                <p className="text-sm text-gray-400 mt-1">Coba ubah kata kunci pencarian atau filter</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pengaduanList.map((pengaduan) => {
                    const statusInfo = getStatusInfo(pengaduan.status);
                    const kategoriInfo = getKategoriInfo(pengaduan.kategori);

                    return (
                        <button
                            key={pengaduan.id}
                            onClick={() => onNavigate(pengaduan.id)}
                            className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:border-slate-300 transition-all group"
                        >
                            {/* Header: Status + Date */}
                            <div className="flex items-center justify-between mb-3">
                                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg ${statusInfo?.bgColor} ${statusInfo?.color}`}>
                                    {statusInfo?.label}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {new Date(pengaduan.created_at).toLocaleDateString('id-ID', { 
                                        day: 'numeric', 
                                        month: 'short', 
                                        year: 'numeric' 
                                    })}
                                </span>
                            </div>

                            {/* Title */}
                            <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-slate-700 transition-colors">
                                {pengaduan.judul}
                            </h4>

                            {/* Meta Row: Reporter + Category */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <span className="flex items-center gap-1 truncate">
                                    <User className="w-3.5 h-3.5 text-gray-400" />
                                    {pengaduan.user?.name || '-'}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span>{kategoriInfo?.label}</span>
                            </div>

                            {/* Footer: Response count + Arrow */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    {pengaduan.responses_count} respon
                                </span>
                                <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-slate-600" />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
