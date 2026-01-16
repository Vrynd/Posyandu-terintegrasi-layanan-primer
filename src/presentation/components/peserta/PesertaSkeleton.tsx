/**
 * PesertaSkeleton - Skeleton loading state matching PesertaPage layout
 * Used when lazy-loading PesertaPage during navigation or page refresh
 */

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function PesertaSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Skeleton width={180} height={28} />
                    <Skeleton width={220} height={16} className="mt-1" />
                </div>
                {/* Breadcrumb - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-2">
                    <Skeleton width={90} height={20} />
                    <Skeleton width={12} height={12} />
                    <Skeleton width={100} height={20} />
                </div>
            </div>

            {/* Toolbar Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <div className="space-y-4">
                    {/* Search + Add Button Row */}
                    <div className="flex gap-3">
                        <Skeleton height={42} borderRadius={12} containerClassName="flex-1" />
                        <Skeleton width={140} height={42} borderRadius={12} />
                    </div>

                    {/* Filter Buttons Row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Skeleton height={42} borderRadius={12} containerClassName="flex-1" />
                        <Skeleton height={42} borderRadius={12} containerClassName="flex-1" />
                        <Skeleton height={42} borderRadius={12} containerClassName="flex-1" />
                    </div>
                </div>
            </div>

            {/* Results Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Results Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton width={24} height={24} />
                        <Skeleton width={110} height={20} />
                    </div>
                    <Skeleton width={160} height={16} />
                </div>

                {/* Peserta List Items */}
                <div className="divide-y divide-gray-100">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="px-6 py-4 flex items-center gap-4">
                            {/* Avatar/Icon */}
                            <Skeleton width={48} height={48} borderRadius={12} />
                            
                            {/* Info Grid */}
                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                                {/* Nama */}
                                <div>
                                    <Skeleton width={40} height={10} className="mb-1" />
                                    <Skeleton width={120} height={18} />
                                </div>
                                {/* NIK */}
                                <div>
                                    <Skeleton width={25} height={10} className="mb-1" />
                                    <Skeleton width={130} height={18} />
                                </div>
                                {/* Umur */}
                                <div className="hidden sm:block">
                                    <Skeleton width={35} height={10} className="mb-1" />
                                    <Skeleton width={60} height={18} />
                                </div>
                                {/* Kategori */}
                                <div className="hidden sm:block">
                                    <Skeleton width={55} height={10} className="mb-1" />
                                    <Skeleton width={100} height={24} borderRadius={12} />
                                </div>
                            </div>

                            {/* Arrow */}
                            <Skeleton width={24} height={24} borderRadius={6} />
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <Skeleton width={100} height={16} />
                    <div className="flex items-center gap-2">
                        <Skeleton width={36} height={36} borderRadius={8} />
                        <Skeleton width={80} height={20} />
                        <Skeleton width={36} height={36} borderRadius={8} />
                    </div>
                </div>
            </div>
        </div>
    );
}
