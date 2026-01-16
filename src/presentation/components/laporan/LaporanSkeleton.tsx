/**
 * LaporanSkeleton - Skeleton loading state matching LaporanPage layout
 * Used when lazy-loading the Laporan page during navigation or page refresh
 */

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function LaporanSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Skeleton width={180} height={28} />
                    <Skeleton width={340} height={16} className="mt-1" />
                </div>
                {/* Breadcrumb - hidden on mobile */}
                <div className="hidden md:flex items-center gap-2">
                    <Skeleton width={90} height={20} />
                    <Skeleton width={12} height={12} />
                    <Skeleton width={70} height={20} />
                </div>
            </div>

            {/* Step 1: Pilih Jenis Laporan */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Skeleton width={24} height={24} borderRadius={6} />
                        <Skeleton width={140} height={18} />
                    </div>
                </div>

                {/* Report Type Cards (2 columns) */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Laporan Pemeriksaan Card */}
                        <div className="p-5 rounded-xl border-2 border-gray-200 bg-white">
                            <Skeleton width={48} height={48} borderRadius={12} className="mb-4" />
                            <Skeleton width={160} height={18} className="mb-2" />
                            <Skeleton width={200} height={14} className="mb-3" />
                            <div className="flex flex-wrap gap-2">
                                <Skeleton width={100} height={24} borderRadius={12} />
                                <Skeleton width={80} height={24} borderRadius={12} />
                                <Skeleton width={110} height={24} borderRadius={12} />
                                <Skeleton width={90} height={24} borderRadius={12} />
                            </div>
                        </div>

                        {/* Laporan Peserta Card */}
                        <div className="p-5 rounded-xl border-2 border-gray-200 bg-white">
                            <Skeleton width={48} height={48} borderRadius={12} className="mb-4" />
                            <Skeleton width={140} height={18} className="mb-2" />
                            <Skeleton width={180} height={14} className="mb-3" />
                            <div className="flex flex-wrap gap-2">
                                <Skeleton width={85} height={24} borderRadius={12} />
                                <Skeleton width={110} height={24} borderRadius={12} />
                                <Skeleton width={100} height={24} borderRadius={12} />
                                <Skeleton width={80} height={24} borderRadius={12} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 2: Pilih Periode & Unduh */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Skeleton width={24} height={24} borderRadius={6} />
                        <Skeleton width={160} height={18} />
                    </div>
                </div>

                {/* Period Selection */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Bulan Dropdown */}
                        <div>
                            <Skeleton width={50} height={12} className="mb-2" />
                            <Skeleton height={44} borderRadius={12} />
                        </div>

                        {/* Tahun Input */}
                        <div>
                            <Skeleton width={45} height={12} className="mb-2" />
                            <Skeleton height={44} borderRadius={12} />
                        </div>
                    </div>

                    {/* Download Button */}
                    <div className="flex justify-end mt-6">
                        <Skeleton width={150} height={44} borderRadius={12} />
                    </div>
                </div>
            </div>
        </div>
    );
}
