/**
 * PengaduanList - List of pengaduan items
 * Used by both Admin and Kader views
 */

import { Loader2, Bug, Clock, MessageSquare } from 'lucide-react';
import type { Pengaduan, PengaduanDetail } from '../../../domain/entities/Pengaduan';
import { STATUS_OPTIONS, KATEGORI_OPTIONS } from '../../../domain/entities/Pengaduan';

interface PengaduanListProps {
    pengaduanList: Pengaduan[];
    selectedPengaduan: PengaduanDetail | null;
    isLoading: boolean;
    onSelect: (id: number) => void;
    showUserInfo?: boolean;
    emptyMessage?: string;
}

export function PengaduanList({ 
    pengaduanList, 
    selectedPengaduan, 
    isLoading, 
    onSelect,
    showUserInfo = true,
    emptyMessage = 'Tidak ada pengaduan'
}: PengaduanListProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
                <p className="text-gray-500 mt-2">Memuat data...</p>
            </div>
        );
    }

    if (pengaduanList.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <Bug className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {pengaduanList.map(pengaduan => {
                const statusOpt = STATUS_OPTIONS.find((s) => s.id === pengaduan.status);
                const kategoriOpt = KATEGORI_OPTIONS.find((k) => k.id === pengaduan.kategori);
                
                return (
                    <button
                        key={pengaduan.id}
                        onClick={() => onSelect(pengaduan.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                            selectedPengaduan?.id === pengaduan.id
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">{pengaduan.judul}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {showUserInfo && pengaduan.user?.name && `${pengaduan.user.name} • `}
                                    {kategoriOpt?.label}
                                </p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusOpt?.bgColor} ${statusOpt?.color}`}>
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
                    </button>
                );
            })}
        </div>
    );
}
