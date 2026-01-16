/**
 * PemeriksaanAddSkeleton - Skeleton loading state matching PemeriksaanAddPage Step 1 (Verifikasi)
 * Used when lazy-loading the Pemeriksaan Add page during navigation or page refresh
 */

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function PemeriksaanAddSkeleton() {
    // Step indicator items
    const steps = [
        { label: 'Verifikasi', active: true },
        { label: 'Hasil Medis', active: false },
        { label: 'Waktu & Lokasi', active: false },
        { label: 'Konfirmasi', active: false },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Skeleton width={240} height={28} />
                    <div className="flex items-center gap-2 mt-1">
                        <Skeleton width={150} height={16} />
                        <Skeleton width={8} height={8} circle />
                        <Skeleton width={130} height={16} />
                    </div>
                </div>
                {/* Breadcrumb - hidden on mobile */}
                <div className="hidden md:flex items-center gap-2">
                    <Skeleton width={90} height={20} />
                    <Skeleton width={12} height={12} />
                    <Skeleton width={100} height={20} />
                    <Skeleton width={12} height={12} />
                    <Skeleton width={120} height={20} />
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
                                    step.active ? 'bg-blue-600' : 'bg-gray-100'
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

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Card Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <Skeleton width={180} height={18} />
                        <Skeleton width={280} height={12} className="mt-1" />
                    </div>
                </div>

                {/* Card Content - Step 1: Verifikasi Data Peserta */}
                <div className="p-6 space-y-4">
                    {/* Data Pribadi Section */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Skeleton width={32} height={32} borderRadius={8} />
                            <Skeleton width={100} height={16} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Nama Lengkap (2 cols) */}
                            <div className="md:col-span-2">
                                <Skeleton width={100} height={12} className="mb-1" />
                                <Skeleton height={42} borderRadius={8} />
                            </div>
                            {/* Kategori */}
                            <div>
                                <Skeleton width={60} height={12} className="mb-1" />
                                <Skeleton height={42} borderRadius={8} />
                            </div>
                            {/* NIK */}
                            <div>
                                <Skeleton width={30} height={12} className="mb-1" />
                                <Skeleton height={42} borderRadius={8} />
                            </div>
                            {/* Jenis Kelamin */}
                            <div>
                                <Skeleton width={90} height={12} className="mb-1" />
                                <Skeleton height={42} borderRadius={8} />
                            </div>
                            {/* Tanggal Lahir */}
                            <div>
                                <Skeleton width={85} height={12} className="mb-1" />
                                <Skeleton height={42} borderRadius={8} />
                            </div>
                            {/* Additional Field */}
                            <div>
                                <Skeleton width={110} height={12} className="mb-1" />
                                <Skeleton height={42} borderRadius={8} />
                            </div>
                            {/* Status BPJS */}
                            <div>
                                <Skeleton width={75} height={12} className="mb-1" />
                                <Skeleton height={42} borderRadius={8} />
                            </div>
                        </div>
                    </div>

                    {/* Alamat & Kontak Section */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Skeleton width={32} height={32} borderRadius={8} />
                            <Skeleton width={110} height={16} />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-3">
                                <div>
                                    <Skeleton width={50} height={12} className="mb-1" />
                                    <Skeleton height={42} borderRadius={8} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Skeleton width={20} height={12} className="mb-1" />
                                        <Skeleton height={42} borderRadius={8} />
                                    </div>
                                    <div>
                                        <Skeleton width={25} height={12} className="mb-1" />
                                        <Skeleton height={42} borderRadius={8} />
                                    </div>
                                </div>
                            </div>
                            {/* Right Column */}
                            <div>
                                <Skeleton width={100} height={12} className="mb-1" />
                                <Skeleton height={42} borderRadius={8} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 px-6 py-4 flex items-center justify-between">
                <Skeleton width={80} height={40} borderRadius={12} />
                <Skeleton width={100} height={40} borderRadius={12} />
            </div>
        </div>
    );
}
