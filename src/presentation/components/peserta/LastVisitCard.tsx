/**
 * LastVisitCard Component
 * Card to display the latest visit/kunjungan data
 * Style matches PesertaInfoCards
 */

import { Calendar, MapPin, FileText, Clock } from 'lucide-react';

interface LastVisitData {
    id?: number;
    tanggal_kunjungan?: string;
    lokasi_pemeriksaan?: string;
    kategori?: string;
    created_at?: string;
    data_kesehatan?: any;
}

interface Props {
    lastVisit: LastVisitData | null | undefined;
}

export function LastVisitCard({ lastVisit }: Props) {
    // Handle no data case
    if (!lastVisit || Object.keys(lastVisit).length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-amber-600" />
                        </div>
                        Kunjungan Terakhir
                    </h3>
                </div>
                <div className="p-5 text-center py-8">
                    <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Belum ada kunjungan</p>
                </div>
            </div>
        );
    }

    // Format date if available
    const formattedDate = lastVisit.tanggal_kunjungan
        ? new Date(lastVisit.tanggal_kunjungan).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        : '-';

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    Kunjungan Terakhir
                </h3>
            </div>
            <div className="p-5 space-y-4">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tanggal Kunjungan</p>
                    <p className="font-medium text-gray-900">{formattedDate}</p>
                </div>
                {lastVisit.lokasi_pemeriksaan && (
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Lokasi</p>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            <p className="font-medium text-gray-900">{lastVisit.lokasi_pemeriksaan}</p>
                        </div>
                    </div>
                )}
                {lastVisit.data_kesehatan && Object.keys(lastVisit.data_kesehatan).length > 0 && (
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Data Pemeriksaan</p>
                        <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
                            <p className="font-medium text-green-600 text-sm">✓ Tersedia</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
