/**
 * PengaduanAdminActions Component
 * Admin-only actions for a complaint (Update Status, Add Response)
 */

import { ChevronDown, Send, Loader2 } from 'lucide-react';
import { STATUS_OPTIONS, type PengaduanStatus } from '../../../domain/entities/Pengaduan';

interface PengaduanAdminActionsProps {
    selectedStatus: PengaduanStatus | '';
    onStatusChange: (status: PengaduanStatus) => void;
    onUpdateStatus: () => void;
    responseText: string;
    onResponseTextChange: (text: string) => void;
    onAddResponse: () => void;
    isSubmitting: boolean;
}

export function PengaduanAdminActions({
    selectedStatus,
    onStatusChange,
    onUpdateStatus,
    responseText,
    onResponseTextChange,
    onAddResponse,
    isSubmitting
}: PengaduanAdminActionsProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-600">3</span>
                    </div>
                    Tindakan Admin
                </h2>
            </div>
            
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Update Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Update Status
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => onStatusChange(e.target.value as PengaduanStatus)}
                                    className="w-full appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-xl text-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none bg-white"
                                >
                                    <option value="">Pilih status...</option>
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s.id} value={s.id}>{s.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <button
                                onClick={onUpdateStatus}
                                disabled={!selectedStatus || isSubmitting}
                                className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    {/* Tambah Respon */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tambah Respon
                        </label>
                        <div className="flex gap-2">
                            <textarea
                                value={responseText}
                                onChange={(e) => onResponseTextChange(e.target.value)}
                                placeholder="Ketik respon Anda untuk pelapor..."
                                rows={1}
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none"
                            />
                            <button
                                onClick={onAddResponse}
                                disabled={isSubmitting || !responseText.trim()}
                                className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Kirim
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
