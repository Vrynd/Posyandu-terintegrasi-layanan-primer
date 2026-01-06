/**
 * PengaduanDetailSummary Component
 * Displays the summary section of a complaint (Title, Badges, Meta Info)
 */

import { User, Clock, MessageSquare } from 'lucide-react';
import { STATUS_OPTIONS, KATEGORI_OPTIONS, PRIORITAS_OPTIONS, type PengaduanDetail } from '../../../domain/entities/Pengaduan';

interface PengaduanDetailSummaryProps {
    pengaduan: PengaduanDetail;
}

export function PengaduanDetailSummary({ pengaduan }: PengaduanDetailSummaryProps) {
    const kategoriInfo = KATEGORI_OPTIONS.find(k => k.id === pengaduan.kategori);
    const prioritasInfo = PRIORITAS_OPTIONS.find(p => p.id === pengaduan.prioritas);
    const statusInfo = STATUS_OPTIONS.find(s => s.id === pengaduan.status);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
            <div className="p-6">
                {/* Title Row with Badges on Right */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{pengaduan.judul}</h3>
                    
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
                        <span>Pelapor: <span className="font-medium">{pengaduan.user?.name || 'Tidak diketahui'}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>
                            {new Date(pengaduan.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })} pukul {new Date(pengaduan.created_at).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span>{pengaduan.responses.length} respon</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
