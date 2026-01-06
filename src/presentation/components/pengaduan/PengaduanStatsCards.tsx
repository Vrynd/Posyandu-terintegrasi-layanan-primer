/**
 * PengaduanStatsCards - Admin statistics cards
 * Display-only stats cards with loading state using BeatLoader
 */

import { ClipboardList, Hourglass, Settings, BadgeCheck, XCircle } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import type { PengaduanStats } from '../../../domain/entities/Pengaduan';

interface PengaduanStatsCardsProps {
    stats: PengaduanStats | null;
    isLoading?: boolean;
}

export function PengaduanStatsCards({ stats, isLoading }: PengaduanStatsCardsProps) {
    // Show loading state with BeatLoader in each card
    if (isLoading || !stats) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {/* Total */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-slate-400">
                    <div className="w-11 h-11 bg-linear-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <div className="h-7 flex items-center"><BeatLoader color="#64748b" size={8} margin={2} /></div>
                        <p className="text-xs text-gray-500">Total</p>
                    </div>
                </div>
                {/* Menunggu */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-amber-400">
                    <div className="w-11 h-11 bg-linear-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                        <Hourglass className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <div className="h-7 flex items-center"><BeatLoader color="#f59e0b" size={8} margin={2} /></div>
                        <p className="text-xs text-gray-500">Menunggu</p>
                    </div>
                </div>
                {/* Diproses */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-blue-500">
                    <div className="w-11 h-11 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <div className="h-7 flex items-center"><BeatLoader color="#3b82f6" size={8} margin={2} /></div>
                        <p className="text-xs text-gray-500">Diproses</p>
                    </div>
                </div>
                {/* Selesai */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-green-500">
                    <div className="w-11 h-11 bg-linear-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <BadgeCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <div className="h-7 flex items-center"><BeatLoader color="#22c55e" size={8} margin={2} /></div>
                        <p className="text-xs text-gray-500">Selesai</p>
                    </div>
                </div>
                {/* Ditolak */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-red-500">
                    <div className="w-11 h-11 bg-linear-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <div className="h-7 flex items-center"><BeatLoader color="#ef4444" size={8} margin={2} /></div>
                        <p className="text-xs text-gray-500">Ditolak</p>
                    </div>
                </div>
            </div>
        );
    }

    const total = stats.pending + stats.in_progress + stats.resolved + stats.rejected;

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {/* Total */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-slate-400">
                <div className="w-11 h-11 bg-linear-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                </div>
            </div>
            {/* Menunggu */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-amber-400">
                <div className="w-11 h-11 bg-linear-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                    <Hourglass className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                    <p className="text-xs text-gray-500">Menunggu</p>
                </div>
            </div>
            {/* Diproses */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-blue-500">
                <div className="w-11 h-11 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.in_progress}</p>
                    <p className="text-xs text-gray-500">Diproses</p>
                </div>
            </div>
            {/* Selesai */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-green-500">
                <div className="w-11 h-11 bg-linear-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                    <p className="text-xs text-gray-500">Selesai</p>
                </div>
            </div>
            {/* Ditolak */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 border-l-4 border-l-red-500">
                <div className="w-11 h-11 bg-linear-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                    <p className="text-xs text-gray-500">Ditolak</p>
                </div>
            </div>
        </div>
    );
}
