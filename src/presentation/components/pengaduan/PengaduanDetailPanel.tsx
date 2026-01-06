/**
 * PengaduanDetailPanel - Admin detail view with response form
 */

import { useState } from 'react';
import { X, Send, Loader2, Eye } from 'lucide-react';
import type { PengaduanDetail, PengaduanStatus } from '../../../domain/entities/Pengaduan';
import { STATUS_OPTIONS } from '../../../domain/entities/Pengaduan';

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
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Pilih pengaduan untuk melihat detail</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Detail Pengaduan</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="font-medium text-gray-900">{pengaduan.judul}</h4>
                    <p className="text-sm text-gray-500 mt-1">{pengaduan.deskripsi}</p>
                </div>

                {/* Status Update */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                    <div className="flex gap-2">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as PengaduanStatus)}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                            <option value="">Pilih status...</option>
                            {STATUS_OPTIONS.map((statusItem) => (
                                <option key={statusItem.id} value={statusItem.id}>{statusItem.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleUpdateStatus}
                            disabled={!selectedStatus || isSubmitting}
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            Update
                        </button>
                    </div>
                </div>

                {/* Responses */}
                {pengaduan.responses.length > 0 && (
                    <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Riwayat Respon</h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {pengaduan.responses.map((r) => (
                                <div key={r.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                                    <p className="text-gray-600">{r.response}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {r.admin.name} • {new Date(r.created_at).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add Response */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tambah Respon</label>
                    <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Tulis respon..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                    />
                    <button
                        onClick={handleAddResponse}
                        disabled={isSubmitting || !responseText.trim()}
                        className="w-full mt-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Kirim Respon
                    </button>
                </div>
            </div>
        </div>
    );
}
