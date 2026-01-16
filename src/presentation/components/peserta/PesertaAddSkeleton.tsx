/**
 * PesertaAddSkeleton - Skeleton loading state matching PesertaAddPage Step 1 (Kategori)
 * Used when lazy-loading the Add Peserta page
 */

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function PesertaAddSkeleton() {
    // Step indicator items
    const steps = [
        { label: 'Kategori', active: true },
        { label: 'Data Pribadi', active: false },
        { label: 'Alamat', active: false },
        { label: 'Konfirmasi', active: false },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Skeleton width={180} height={28} />
                    <Skeleton width={240} height={16} className="mt-1" />
                </div>
                {/* Breadcrumb - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-2">
                    <Skeleton width={90} height={20} />
                    <Skeleton width={12} height={12} />
                    <Skeleton width={100} height={20} />
                    <Skeleton width={12} height={12} />
                    <Skeleton width={80} height={20} />
                </div>
            </div>

            {/* Step Indicator */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
                <div className="flex items-center justify-between">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-center flex-1">
                            <div className="flex items-center gap-2">
                                {/* Step circle */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    step.active 
                                        ? 'bg-blue-600' 
                                        : 'bg-gray-100'
                                }`}>
                                    {step.active ? (
                                        <Skeleton width={16} height={16} baseColor="#3b82f6" highlightColor="#60a5fa" />
                                    ) : (
                                        <Skeleton width={16} height={16} />
                                    )}
                                </div>
                                <Skeleton width={70} height={14} />
                            </div>
                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className="flex-1 mx-3">
                                    <div className="h-0.5 bg-gray-200 rounded-full" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Selection Card (Step 1) */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
                {/* Card Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <Skeleton width={120} height={18} />
                    <Skeleton width={240} height={12} className="mt-1" />
                </div>

                {/* Category Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div 
                                key={i} 
                                className="flex flex-col items-start p-5 rounded-2xl border-2 border-gray-200 bg-white"
                            >
                                {/* Icon and checkbox row */}
                                <div className="flex items-center justify-between w-full mb-4">
                                    <Skeleton width={48} height={48} borderRadius={12} />
                                    <Skeleton width={20} height={20} circle />
                                </div>
                                {/* Label and description */}
                                <Skeleton width={90} height={16} className="mb-1" />
                                <Skeleton width={110} height={11} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4 flex items-center justify-between">
                <Skeleton width={80} height={40} borderRadius={12} />
                <Skeleton width={100} height={40} borderRadius={12} />
            </div>
        </div>
    );
}
