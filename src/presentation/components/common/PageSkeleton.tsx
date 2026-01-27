/**
 * PageSkeleton - Skeleton loading state for lazy-loaded pages
 * Routes to page-specific skeletons or uses generic fallback
 */

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PesertaSkeleton, PesertaAddSkeleton, PesertaDetailSkeleton } from '../peserta';
import { PemeriksaanSkeleton, PemeriksaanAddSkeleton } from '../pemeriksaan';
import { LaporanSkeleton } from '../laporan';
import { DashboardSkeleton } from '../dashboard/dashboard_skeleton';


/**
 * GenericPageSkeleton - General skeleton for other pages
 */
export function GenericPageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton width={200} height={28} />
                    <Skeleton width={300} height={16} className="mt-1" />
                </div>
                <Skeleton width={120} height={40} borderRadius={12} />
            </div>

            {/* Content Cards */}
            <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton width={200} height={40} borderRadius={12} />
                    <Skeleton width={150} height={40} borderRadius={12} />
                </div>

                {/* List Items */}
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100">
                            <Skeleton circle width={48} height={48} />
                            <div className="flex-1">
                                <Skeleton width="60%" height={20} />
                                <Skeleton width="40%" height={14} className="mt-1" />
                            </div>
                            <Skeleton width={80} height={32} borderRadius={8} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * PageSkeleton - Default export that can be used as Suspense fallback
 * Automatically detects route and shows appropriate skeleton
 */
export function PageSkeleton() {
    // Check current route for page-specific skeleton
    const pathname = window.location.pathname;
    
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
        return <DashboardSkeleton />;
    }
    
    if (pathname === '/dashboard/participants' || pathname === '/dashboard/participants/') {
        return <PesertaSkeleton />;
    }
    
    if (pathname.startsWith('/dashboard/participants/register')) {
        return <PesertaAddSkeleton />;
    }
    
    // Match /dashboard/participants/:category/:id pattern (detail page)
    if (/^\/dashboard\/participants\/[^/]+\/\d+/.test(pathname)) {
        return <PesertaDetailSkeleton />;
    }
    
    if (pathname === '/dashboard/examinations' || pathname === '/dashboard/examinations/') {
        return <PemeriksaanSkeleton />;
    }
    
    // Match /dashboard/examinations/:category/:id pattern
    if (/^\/dashboard\/examinations\/[^/]+\/\d+/.test(pathname)) {
        return <PemeriksaanAddSkeleton />;
    }
    
    if (pathname.startsWith('/dashboard/reports')) {
        return <LaporanSkeleton />;
    }
    
    return <GenericPageSkeleton />;
}
