/**
 * PemeriksaanSkeleton - Skeleton loading state matching PemeriksaanPage layout
 * Used when lazy-loading the Pemeriksaan page during navigation or page refresh
 */

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function PemeriksaanSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Skeleton width={150} height={28} />
                    <Skeleton width={260} height={16} className="mt-1" />
                </div>
                {/* Breadcrumb - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-2">
                    <Skeleton width={90} height={20} />
                    <Skeleton width={12} height={12} />
                    <Skeleton width={100} height={20} />
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Toolbar Section */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Input */}
                        <Skeleton height={44} borderRadius={12} containerClassName="flex-1" />
                        {/* Filter Button */}
                        <Skeleton width={100} height={44} borderRadius={12} />
                        {/* Sort Button */}
                        <Skeleton width={110} height={44} borderRadius={12} />
                    </div>
                </div>

                {/* Empty State / Search Prompt */}
                <div className="p-12 flex flex-col items-center justify-center">
                    <Skeleton width={64} height={64} borderRadius={16} className="mb-4" />
                    <Skeleton width={220} height={18} className="mb-2" />
                    <Skeleton width={320} height={14} />
                </div>
            </div>

            {/* Recent Pemeriksaan Section */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mt-6">
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton width={24} height={24} borderRadius={6} />
                        <Skeleton width={160} height={20} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton width={30} height={16} />
                        <Skeleton width={32} height={32} borderRadius={8} />
                        <Skeleton width={32} height={32} borderRadius={8} />
                    </div>
                </div>

                {/* Recent Cards Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div 
                                key={i} 
                                className="p-4 rounded-2xl border border-gray-100 bg-white"
                            >
                                {/* Card Header: Icon + Badge */}
                                <div className="flex items-center justify-between mb-3">
                                    <Skeleton width={40} height={40} borderRadius={10} />
                                    <Skeleton width={80} height={24} borderRadius={12} />
                                </div>
                                
                                {/* Name */}
                                <Skeleton width={140} height={18} className="mb-2" />
                                
                                {/* Date and Weight */}
                                <div className="flex items-center gap-2 mb-2">
                                    <Skeleton width={100} height={14} />
                                    <Skeleton width={60} height={14} />
                                </div>
                                
                                {/* Location */}
                                <div className="flex items-center justify-between">
                                    <Skeleton width={70} height={12} />
                                    <Skeleton width={20} height={20} borderRadius={6} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
