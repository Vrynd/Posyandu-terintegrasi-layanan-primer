/**
 * LaporanStatsSummary - Displays summary statistics for the selected period
 * Shows combined stats for both examinations and participants data
 * Appears before report type selection
 */

import { BarChart3, Users, MapPin, TrendingUp, Activity } from 'lucide-react';
import { usePesertaList, usePemeriksaanList } from '@/data/queries';
import { useMemo } from 'react';

interface LaporanStatsSummaryProps {
    month: number;
    year: number;
}

const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function LaporanStatsSummary({ month, year }: LaporanStatsSummaryProps) {
    // Fetch data directly using React Query
    const { data: pesertaResponse, isLoading: isPesertaLoading } = usePesertaList({ limit: 200 });
    const { data: pemeriksaanResponse, isLoading: isPemeriksaanLoading } = usePemeriksaanList({ limit: 200 });

    const isLoading = isPesertaLoading || isPemeriksaanLoading;

    // Process and filter data for the selected month/year
    const stats = useMemo(() => {
        // Extract arrays from API response
        const pesertaData = (pesertaResponse as any)?.data;
        const pesertaList = Array.isArray(pesertaData) ? pesertaData : pesertaData?.data || [];
        
        const pemeriksaanData = (pemeriksaanResponse as any)?.data;
        const kunjunganList = Array.isArray(pemeriksaanData) ? pemeriksaanData : pemeriksaanData?.data || [];

        // Filter kunjungan by month/year
        const filteredKunjungan = kunjunganList.filter((k: any) => {
            if (!k.tanggal_kunjungan) return false;
            const d = new Date(k.tanggal_kunjungan);
            return d.getMonth() + 1 === month && d.getFullYear() === year;
        });

        // Filter peserta with activity in this month
        const activePeserta = pesertaList.filter((p: any) => {
            if (!p.last_kunjungan_date) return false;
            const d = new Date(p.last_kunjungan_date);
            return d.getMonth() + 1 === month && d.getFullYear() === year;
        });

        // Calculate total peserta (all registered)
        const totalPeserta = pesertaList.length;
        const totalKunjungan = filteredKunjungan.length;

        // Count kunjungan by location
        const posyanduCount = filteredKunjungan.filter((k: any) => k.lokasi === 'posyandu').length;
        const rumahCount = filteredKunjungan.filter((k: any) => 
            k.lokasi === 'kunjungan_rumah' || k.lokasi === 'rumah'
        ).length;

        // Count peserta by category
        const kategoryCounts: Record<string, number> = {};
        pesertaList.forEach((p: any) => {
            const kat = getCategoryLabel(p.kategori);
            kategoryCounts[kat] = (kategoryCounts[kat] || 0) + 1;
        });

        // Find top category
        const topKategori = Object.entries(kategoryCounts)
            .sort((a, b) => b[1] - a[1])[0];
        const topKategoriPercent = topKategori && totalPeserta > 0
            ? Math.round((topKategori[1] / totalPeserta) * 100)
            : 0;

        return {
            totalPeserta,
            totalKunjungan,
            activePeserta: activePeserta.length,
            locationBreakdown: { posyandu: posyanduCount, rumah: rumahCount },
            topKategori: topKategori ? { name: topKategori[0], percent: topKategoriPercent } : null,
        };
    }, [pesertaResponse, pemeriksaanResponse, month, year]);

    // Show skeleton while loading
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4 animate-pulse">
                {/* Header skeleton */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gray-200" />
                        <div className="h-5 w-48 bg-gray-200 rounded" />
                    </div>
                </div>
                {/* Stats skeleton */}
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100 h-20" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const statItems = [
        { 
            icon: Users, 
            label: 'Total Peserta', 
            value: stats.totalPeserta.toString(),
            subtext: `${stats.activePeserta} aktif bulan ini`,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        { 
            icon: Activity, 
            label: 'Pemeriksaan Tercatat', 
            value: stats.totalKunjungan.toString(),
            subtext: stats.totalKunjungan > 0 ? 'di bulan ini' : 'belum ada data',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
        },
        { 
            icon: MapPin, 
            label: 'Lokasi Pemeriksaan', 
            value: `${stats.locationBreakdown.posyandu} / ${stats.locationBreakdown.rumah}`,
            subtext: 'Posyandu / Kunjungan Rumah',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        { 
            icon: TrendingUp, 
            label: 'Kategori Terbanyak', 
            value: stats.topKategori ? stats.topKategori.name : '-',
            subtext: stats.topKategori ? `${stats.topKategori.percent}% dari total` : 'belum ada data',
            color: 'text-amber-600',
            bgColor: 'bg-amber-50'
        },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
            {/* Header - match LaporanTypeSelection style */}
            <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    Ringkasan Data {monthNames[month - 1]} {year}
                </h2>
            </div>

            {/* Stats Grid */}
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statItems.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div 
                            key={index}
                            className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-6 h-6 rounded-md ${stat.bgColor} flex items-center justify-center`}>
                                    <Icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                                <span className="text-[13px] text-gray-500 font-normal tracking-wide">{stat.label}</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 ml-8">
                                {stat.value}
                            </p>
                            <p className="text-xs text-gray-400 ml-8">
                                {stat.subtext}
                            </p>
                        </div>
                    );
                })}
                </div>
            </div>
        </div>
    );
}

// Helper function
function getCategoryLabel(kategori: string): string {
    const labels: Record<string, string> = {
        bumil: 'Ibu Hamil',
        balita: 'Balita',
        remaja: 'Remaja',
        produktif: 'Produktif',
        lansia: 'Lansia'
    };
    return labels[kategori] || kategori || '-';
}
