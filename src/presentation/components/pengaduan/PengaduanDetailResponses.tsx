/**
 * PengaduanDetailResponses Component
 * Displays the history of admin responses for a complaint
 */

import { MessageSquare, User } from 'lucide-react';
import type { PengaduanDetail } from '../../../domain/entities/Pengaduan';

interface PengaduanDetailResponsesProps {
    pengaduan: PengaduanDetail;
}

export function PengaduanDetailResponses({ pengaduan }: PengaduanDetailResponsesProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-600">2</span>
                    </div>
                    Riwayat Respon
                </h2>
            </div>
            
            <div className="p-6">
                {pengaduan.responses.length > 0 ? (
                    <div className="space-y-4">
                        {pengaduan.responses.map((r) => (
                            <div key={r.id} className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-emerald-800">{r.admin.name}</span>
                                            <span className="text-xs text-emerald-600 ml-1">• Admin</span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(r.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}, {new Date(r.created_at).toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-700 pl-10">{r.response}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-7 h-7 text-slate-400" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Belum ada respon</h4>
                        <p className="text-gray-500 text-sm">Admin belum memberikan respon untuk pengaduan ini</p>
                    </div>
                )}
            </div>
        </div>
    );
}
