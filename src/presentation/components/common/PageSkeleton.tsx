/**
 * PageSkeleton - Skeleton loading state for lazy-loaded pages
 * Uses react-loading-skeleton for smooth placeholder animation
 */

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * DashboardSkeleton - Mimics the structure of the dashboard page
 */
export function DashboardSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
            {/* Hero Section Skeleton */}
            <div className="rounded-2xl bg-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <Skeleton width={200} height={28} baseColor="#334155" highlightColor="#475569" />
                        <Skeleton width={160} height={16} baseColor="#334155" highlightColor="#475569" className="mt-1" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton width={40} height={40} borderRadius={12} baseColor="#334155" highlightColor="#475569" />
                        <Skeleton width={40} height={40} borderRadius={12} baseColor="#334155" highlightColor="#475569" />
                    </div>
                </div>
                <div className="flex gap-3 mt-4">
                    <Skeleton width={150} height={32} borderRadius={12} baseColor="#334155" highlightColor="#475569" />
                    <Skeleton width={100} height={32} borderRadius={12} baseColor="#334155" highlightColor="#475569" />
                    <Skeleton width={120} height={32} borderRadius={12} baseColor="#334155" highlightColor="#475569" />
                </div>
            </div>

            {/* Sasaran Cards Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="rounded-2xl bg-linear-to-br from-gray-200 to-gray-300 p-4">
                        <Skeleton width={40} height={40} borderRadius={12} />
                        <Skeleton width={60} height={36} className="mt-3" />
                        <Skeleton width={80} height={16} className="mt-1" />
                    </div>
                ))}
            </div>

            {/* Quick Actions & Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6">
                    <Skeleton width={120} height={24} className="mb-4" />
                    <div className="grid grid-cols-2 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} height={100} borderRadius={16} />
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl p-6">
                    <Skeleton width={180} height={24} className="mb-4" />
                    <Skeleton height={200} borderRadius={12} />
                </div>
            </div>
        </div>
    );
}

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
 */
export function PageSkeleton() {
    return <GenericPageSkeleton />;
}
