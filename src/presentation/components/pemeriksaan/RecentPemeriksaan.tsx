/**
 * RecentPemeriksaan Component
 * Displays recent pemeriksaan records in Kanban layout with pagination
 * Uses React Query for optimal caching
 */

import { useState, useMemo } from 'react';
import { Clock, ArrowRight, Calendar, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { kategoriConfig } from '../../constants/kategoriConfig';
import { useKunjunganList, usePesertaList } from '@/data/queries';
import type { KategoriKey } from '@/domain/entities/Peserta';

const ITEMS_PER_PAGE = 3;

function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('id-ID', { month: 'short' });
        const year = date.getFullYear();
        
        // Check if time is available (not midnight 00:00)
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const hasTime = hours !== 0 || minutes !== 0;
        
        if (hasTime) {
            const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            return `${day} ${month} ${year}, ${time}`;
        }
        
        return `${day} ${month} ${year}`;
    } catch {
        return dateString;
    }
}

export function RecentPemeriksaan() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    // Use React Query for caching - fetch both kunjungan and peserta
    const { data: kunjunganData, isLoading: isKunjunganLoading } = useKunjunganList({ limit: 15 });
    const { data: pesertaData, isLoading: isPesertaLoading } = usePesertaList({ limit: 100 });

    const isLoading = isKunjunganLoading || isPesertaLoading;

    // Merge kunjungan with peserta data and paginate
    const { paginatedItems, totalPages, totalItems } = useMemo(() => {
        const kunjunganList = kunjunganData?.data || [];
        const pesertaList = pesertaData?.data || [];

        // Create a map for quick peserta lookup
        const pesertaMap = new Map(pesertaList.map(p => [p.id, p]));

        // Sort by date descending and merge with peserta data
        const merged = [...kunjunganList]
            .sort((a, b) => 
                new Date(b.tanggal_kunjungan).getTime() - new Date(a.tanggal_kunjungan).getTime()
            )
            .map(item => {
                const peserta = pesertaMap.get(item.peserta_id);
                return {
                    ...item,
                    peserta_nama: peserta?.nama || `Peserta #${item.peserta_id}`,
                    peserta_kategori: peserta?.kategori || 'produktif'
                };
            });

        const totalItems = merged.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedItems = merged.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        return { paginatedItems, totalPages, totalItems };
    }, [kunjunganData, pesertaData, currentPage]);

    const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

    // Loading state
    if (isLoading) {
        return (
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-8">
                <div className="text-center">
                    <BeatLoader color="#3B82F6" size={10} margin={3} />
                    <p className="text-gray-500 text-sm mt-3">Memuat pemeriksaan terakhir...</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (totalItems === 0) {
        return (
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-8">
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ClipboardList className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Belum Ada Pemeriksaan</h3>
                    <p className="text-xs text-gray-500">
                        Lakukan pemeriksaan pertama untuk melihat data di sini.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Header - Without subtitle */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">Pemeriksaan Terakhir</h3>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                            {currentPage}/{totalPages}
                        </span>
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                )}
            </div>

            {/* Kanban Grid - 3 columns */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {paginatedItems.map((item) => {
                        const kategori = (item.peserta_kategori || 'produktif') as KategoriKey;
                        const config = kategoriConfig[kategori] || kategoriConfig.produktif;
                        const Icon = config.icon;

                        const handleClick = () => {
                            navigate(`/dashboard/examinations/${config.urlSlug}/${item.peserta_id}`);
                        };

                        return (
                            <div
                                key={item.id}
                                onClick={handleClick}
                                className="group bg-gray-50 border border-gray-100 hover:border-gray-300 rounded-xl p-4 cursor-pointer transition-colors"
                            >
                                {/* Top - Icon and Category Label */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 ${config.color}`} />
                                    </div>
                                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}>
                                        {config.label}
                                    </span>
                                </div>

                                {/* Name */}
                                <h4 className="text-sm font-semibold text-gray-900 truncate mb-2">
                                    {item.peserta_nama}
                                </h4>

                                {/* Info Row */}
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(item.tanggal_kunjungan)}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="font-medium text-gray-700">{item.berat_badan} kg</span>
                                </div>

                                {/* Bottom - Location & Arrow */}
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-400">
                                        {item.lokasi === 'posyandu' ? 'Posyandu' : 'Kunjungan Rumah'}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
