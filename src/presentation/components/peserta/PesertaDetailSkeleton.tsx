/**
 * PesertaDetailSkeleton - Skeleton loading state matching PesertaDetailPage layout
 * Used when lazy-loading or fetching data for the Peserta Detail page
 */

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function PesertaDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header with Breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Skeleton width={150} height={28} />
                    <Skeleton width={240} height={16} className="mt-1" />
                </div>
                {/* Breadcrumb - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-2">
                    <Skeleton width={90} height={20} />
                    <Skeleton width={12} height={12} />
                    <Skeleton width={100} height={20} />
                    <Skeleton width={12} height={12} />
                    <Skeleton width={120} height={20} />
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="bg-linear-to-r from-slate-800 to-slate-900 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <Skeleton 
                        width={72} 
                        height={72} 
                        borderRadius={16} 
                        baseColor="#475569" 
                        highlightColor="#64748b" 
                    />
                    {/* Name and Badge */}
                    <div className="flex-1">
                        <Skeleton 
                            width={200} 
                            height={24} 
                            baseColor="#475569" 
                            highlightColor="#64748b" 
                        />
                        <div className="flex items-center gap-2 mt-2">
                            <Skeleton 
                                width={80} 
                                height={24} 
                                borderRadius={12} 
                                baseColor="#475569" 
                                highlightColor="#64748b" 
                            />
                            <Skeleton 
                                width={60} 
                                height={20} 
                                baseColor="#475569" 
                                highlightColor="#64748b" 
                            />
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Skeleton 
                            width={40} 
                            height={40} 
                            borderRadius={12} 
                            baseColor="#475569" 
                            highlightColor="#64748b" 
                        />
                        <Skeleton 
                            width={40} 
                            height={40} 
                            borderRadius={12} 
                            baseColor="#475569" 
                            highlightColor="#64748b" 
                        />
                    </div>
                </div>
            </div>

            {/* Info Cards Grid (3 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Data Pribadi Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton width={28} height={28} borderRadius={8} />
                        <Skeleton width={100} height={16} />
                    </div>
                    <div className="space-y-3">
                        <div>
                            <Skeleton width={30} height={10} className="mb-1" />
                            <Skeleton width="100%" height={18} />
                        </div>
                        <div>
                            <Skeleton width={80} height={10} className="mb-1" />
                            <Skeleton width="70%" height={18} />
                        </div>
                        <div>
                            <Skeleton width={90} height={10} className="mb-1" />
                            <Skeleton width="60%" height={18} />
                        </div>
                    </div>
                </div>

                {/* Kontak & Alamat Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton width={28} height={28} borderRadius={8} />
                        <Skeleton width={110} height={16} />
                    </div>
                    <div className="space-y-3">
                        <div>
                            <Skeleton width={55} height={10} className="mb-1" />
                            <Skeleton width="100%" height={18} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Skeleton width={20} height={10} className="mb-1" />
                                <Skeleton width="100%" height={18} />
                            </div>
                            <div>
                                <Skeleton width={25} height={10} className="mb-1" />
                                <Skeleton width="100%" height={18} />
                            </div>
                        </div>
                        <div>
                            <Skeleton width={50} height={10} className="mb-1" />
                            <Skeleton width="80%" height={18} />
                        </div>
                    </div>
                </div>

                {/* Status BPJS Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton width={28} height={28} borderRadius={8} />
                        <Skeleton width={80} height={16} />
                    </div>
                    <div className="space-y-3">
                        <div>
                            <Skeleton width={110} height={10} className="mb-1" />
                            <Skeleton width={80} height={18} />
                        </div>
                        <div>
                            <Skeleton width={80} height={10} className="mb-1" />
                            <Skeleton width="100%" height={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pemeriksaan Terakhir Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton width={28} height={28} borderRadius={8} />
                        <Skeleton width={150} height={18} />
                    </div>
                    <Skeleton width={160} height={40} borderRadius={12} />
                </div>
                <div className="mt-4 flex items-center gap-6">
                    <div>
                        <Skeleton width={60} height={10} className="mb-1" />
                        <Skeleton width={100} height={16} />
                    </div>
                    <div>
                        <Skeleton width={45} height={10} className="mb-1" />
                        <Skeleton width={50} height={16} />
                    </div>
                    <div>
                        <Skeleton width={50} height={10} className="mb-1" />
                        <Skeleton width={100} height={16} />
                    </div>
                </div>
            </div>
        </div>
    );
}
