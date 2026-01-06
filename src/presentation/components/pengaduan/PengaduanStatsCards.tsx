/**
 * PengaduanStatsCards - Admin statistics cards
 * Shows count of pengaduan by status
 */

import type { PengaduanStats, PengaduanFilterParams } from '../../../domain/entities/Pengaduan';
import { STATUS_OPTIONS } from '../../../domain/entities/Pengaduan';

interface PengaduanStatsCardsProps {
    stats: PengaduanStats;
    filters: PengaduanFilterParams;
    onFilterChange: (filters: PengaduanFilterParams) => void;
}

export function PengaduanStatsCards({ stats, filters, onFilterChange }: PengaduanStatsCardsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {STATUS_OPTIONS.map((statusOption) => (
                <button
                    key={statusOption.id}
                    onClick={() => onFilterChange({ ...filters, status: statusOption.id })}
                    className={`p-4 rounded-xl border transition-all ${
                        filters.status === statusOption.id 
                            ? 'border-amber-500 bg-amber-50' 
                            : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                >
                    <div className={`text-2xl font-bold ${statusOption.color}`}>
                        {stats[statusOption.id as keyof PengaduanStats]}
                    </div>
                    <div className="text-sm text-gray-500">{statusOption.label}</div>
                </button>
            ))}
        </div>
    );
}
