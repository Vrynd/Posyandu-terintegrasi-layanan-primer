/**
 * PesertaLastVisitCard Component
 * Displays the last examination information for a participant
 */

import { Calendar, MapPin, Stethoscope, ArrowRight } from 'lucide-react';
import { BeatLoader } from 'react-spinners';

interface PesertaLastVisitCardProps {
    lastVisit: any; // Using any for now to keep it flexible with existing API types
    isLoading: boolean;
    onNavigate: (skipToStep2: boolean) => void;
}

export function PesertaLastVisitCard({ 
    lastVisit, 
    isLoading, 
    onNavigate 
}: PesertaLastVisitCardProps) {
    return (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Pemeriksaan Terakhir</h3>
                </div>
            </div>
            <div className="p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-2">
                        <BeatLoader color="#3B82F6" size={8} margin={2} />
                    </div>
                ) : lastVisit ? (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-start gap-y-4 gap-x-6 sm:gap-8">
                            {/* Tanggal */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tanggal</p>
                                <div className="flex items-center gap-2 font-medium text-gray-900">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>{new Date(lastVisit.tanggal_kunjungan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                            {/* Waktu */}
                            {(() => {
                                const date = new Date(lastVisit.tanggal_kunjungan);
                                const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
                                if (hasTime) {
                                    return (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Waktu</p>
                                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                    <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2" />
                                                </svg>
                                                <span>{date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                            {/* Lokasi */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Lokasi</p>
                                <div className="flex items-center gap-2 font-medium text-gray-900">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{lastVisit.lokasi === 'posyandu' ? 'Posyandu' : 'Kunjungan Rumah'}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onNavigate(true)}
                            className="w-full cursor-pointer md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-linear-to-r from-slate-800 to-slate-900 text-white text-sm font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shrink-0"
                        >
                            <span>Lakukan Pemeriksaan</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">Belum ada data pemeriksaan untuk peserta ini.</p>
                        <button
                            onClick={() => onNavigate(false)}
                            className="w-full cursor-pointer sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-linear-to-r from-slate-800 to-slate-900 text-white text-sm font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all"
                        >
                            <span>Pemeriksaan Pertama</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
