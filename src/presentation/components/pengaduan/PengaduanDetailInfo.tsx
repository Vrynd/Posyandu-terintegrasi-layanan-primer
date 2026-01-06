/**
 * PengaduanDetailInfo Component
 * Displays the main content of a complaint (Description, Steps, Images)
 */

import { FileText, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import type { PengaduanDetail } from '../../../domain/entities/Pengaduan';
import { getStorageUrl } from '../../../data/core/api';

interface PengaduanDetailInfoProps {
    pengaduan: PengaduanDetail;
    onOpenLightbox: (images: string[], index: number) => void;
}

export function PengaduanDetailInfo({ pengaduan, onOpenLightbox }: PengaduanDetailInfoProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-600">1</span>
                    </div>
                    Detail Masalah
                </h2>
            </div>
            
            {/* Section Content */}
            <div className="p-6">
                {/* Deskripsi Masalah */}
                <div className="mb-6 bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5 text-slate-600" />
                        <h4 className="font-semibold text-slate-800">Deskripsi Masalah</h4>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{pengaduan.deskripsi}</p>
                </div>

                {/* Langkah Reproduksi */}
                {pengaduan.langkah_reproduksi && (
                    <div className="mb-6 bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <h4 className="font-semibold text-amber-800">Langkah Reproduksi</h4>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{pengaduan.langkah_reproduksi}</p>
                    </div>
                )}

                {/* Screenshots */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <ImageIcon className="w-5 h-5 text-slate-600" />
                        <h4 className="font-semibold text-gray-900">
                            Screenshot {pengaduan.images && pengaduan.images.length > 0 ? `(${pengaduan.images.length})` : ''}
                        </h4>
                    </div>
                    {pengaduan.images && pengaduan.images.length > 0 ? (
                        <div className={`grid gap-2 ${
                            pengaduan.images.length === 1 ? 'grid-cols-1 max-w-md' :
                            pengaduan.images.length === 2 ? 'grid-cols-2' :
                            pengaduan.images.length === 3 ? 'grid-cols-3' :
                            'grid-cols-4'
                        }`}>
                            {pengaduan.images.map((img, idx) => {
                                const imageUrl = getStorageUrl(img);
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => onOpenLightbox(pengaduan.images, idx)}
                                        className="block aspect-video bg-gray-100 rounded-xl overflow-hidden hover:opacity-90 hover:ring-2 hover:ring-blue-400 transition-all cursor-zoom-in ring-1 ring-gray-200"
                                    >
                                        <img src={imageUrl} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ImageIcon className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-gray-500 text-sm">Tidak ada screenshot yang dilampirkan</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
