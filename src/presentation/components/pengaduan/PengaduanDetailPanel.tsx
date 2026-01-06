/**
 * PengaduanDetailPanel - Admin detail view with response form
 * Shows complete complaint information submitted by Kader
 */

import { useState } from 'react';
import { X, Send, Loader2, Eye, Clock, User, AlertTriangle, FileText, Image as ImageIcon, MessageSquare } from 'lucide-react';
import type { PengaduanDetail, PengaduanStatus } from '../../../domain/entities/Pengaduan';
import { STATUS_OPTIONS, KATEGORI_OPTIONS, PRIORITAS_OPTIONS } from '../../../domain/entities/Pengaduan';

interface PengaduanDetailPanelProps {
    pengaduan: PengaduanDetail | null;
    isSubmitting: boolean;
    onClose: () => void;
    onUpdateStatus: (status: PengaduanStatus) => Promise<boolean>;
    onAddResponse: (response: string) => Promise<boolean>;
}

export function PengaduanDetailPanel({ 
    pengaduan, 
    isSubmitting, 
    onClose, 
    onUpdateStatus, 
    onAddResponse 
}: PengaduanDetailPanelProps) {
    const [responseText, setResponseText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<PengaduanStatus | ''>('');

    const handleUpdateStatus = async () => {
        if (!selectedStatus) return;
        const success = await onUpdateStatus(selectedStatus);
        if (success) setSelectedStatus('');
    };

    const handleAddResponse = async () => {
        if (!responseText.trim()) return;
        const success = await onAddResponse(responseText);
        if (success) setResponseText('');
    };

    if (!pengaduan) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-gray-300" />
                </div>
                <p className="font-medium text-gray-600">Pilih pengaduan untuk melihat detail</p>
                <p className="text-sm text-gray-400 mt-1">Klik salah satu item di daftar</p>
            </div>
        );
    }

    const kategoriInfo = KATEGORI_OPTIONS.find(k => k.id === pengaduan.kategori);
    const prioritasInfo = PRIORITAS_OPTIONS.find(p => p.id === pengaduan.prioritas);
    const statusInfo = STATUS_OPTIONS.find(s => s.id === pengaduan.status);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-6">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Detail Pengaduan</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Content - Scrollable */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="p-5 space-y-5">
                    {/* Title & Status Badges */}
                    <div>
                        <h4 className="font-semibold text-gray-900 text-lg leading-tight mb-3">{pengaduan.judul}</h4>
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${statusInfo?.bgColor} ${statusInfo?.color}`}>
                                {statusInfo?.label}
                            </span>
                            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-600">
                                {kategoriInfo?.label}
                            </span>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${prioritasInfo?.color}`}>
                                {prioritasInfo?.label}
                            </span>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{pengaduan.user?.name || 'Tidak diketahui'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                                {new Date(pengaduan.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deskripsi Masalah</label>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{pengaduan.deskripsi}</p>
                    </div>

                    {/* Langkah Reproduksi */}
                    {pengaduan.langkah_reproduksi && (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                <label className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Langkah Reproduksi</label>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{pengaduan.langkah_reproduksi}</p>
                        </div>
                    )}

                    {/* Screenshots */}
                    {pengaduan.images && pengaduan.images.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <ImageIcon className="w-4 h-4 text-gray-500" />
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Screenshot ({pengaduan.images.length})
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {pengaduan.images.map((img, idx) => (
                                    <a 
                                        key={idx} 
                                        href={img} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block aspect-video bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity ring-1 ring-gray-200"
                                    >
                                        <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <hr className="border-gray-100" />

                    {/* Status Update */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Update Status
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as PengaduanStatus)}
                                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none"
                            >
                                <option value="">Pilih status baru...</option>
                                {STATUS_OPTIONS.map((statusItem) => (
                                    <option key={statusItem.id} value={statusItem.id}>{statusItem.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={!selectedStatus || isSubmitting}
                                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    {/* Responses History */}
                    {pengaduan.responses.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-gray-500" />
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Riwayat Respon ({pengaduan.responses.length})
                                </label>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {pengaduan.responses.map((r) => (
                                    <div key={r.id} className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold text-emerald-700">{r.admin.name}</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(r.created_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{r.response}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add Response */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Tambah Respon
                        </label>
                        <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Ketik respon untuk kader..."
                            rows={3}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none"
                        />
                        <button
                            onClick={handleAddResponse}
                            disabled={isSubmitting || !responseText.trim()}
                            className="w-full mt-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Kirim Respon
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

