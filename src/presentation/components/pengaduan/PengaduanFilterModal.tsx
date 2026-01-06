/**
 * PengaduanFilterModal Component - Filter modal for status and kategori
 */

import { X, Check, ListFilter } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { PengaduanStatus, PengaduanKategori } from '../../../domain/entities/Pengaduan';
import { STATUS_OPTIONS, KATEGORI_OPTIONS } from '../../../domain/entities/Pengaduan';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedStatus?: PengaduanStatus;
    selectedKategori?: PengaduanKategori;
    onApply: (status?: PengaduanStatus, kategori?: PengaduanKategori) => void;
}

export function PengaduanFilterModal({
    isOpen,
    onClose,
    selectedStatus,
    selectedKategori,
    onApply,
}: Props) {
    const [tempStatus, setTempStatus] = useState<PengaduanStatus | undefined>(selectedStatus);
    const [tempKategori, setTempKategori] = useState<PengaduanKategori | undefined>(selectedKategori);

    // Sync with props when modal opens
    useEffect(() => {
        if (isOpen) {
            setTempStatus(selectedStatus);
            setTempKategori(selectedKategori);
        }
    }, [isOpen, selectedStatus, selectedKategori]);

    // Close on ESC and handle body overflow
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleReset = () => {
        setTempStatus(undefined);
        setTempKategori(undefined);
    };

    const handleApply = () => {
        onApply(tempStatus, tempKategori);
        onClose();
    };

    const hasChanges = tempStatus !== selectedStatus || tempKategori !== selectedKategori;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
                {/* ===== HEADER ===== */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
                            <ListFilter className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Filter Pengaduan</h3>
                            <p className="text-xs text-gray-500">Filter berdasarkan status dan kategori</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* ===== CONTENT ===== */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                    {/* Status Filter */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Status</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {/* All Status Option */}
                            <button
                                onClick={() => setTempStatus(undefined)}
                                className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 transition-all text-left ${
                                    tempStatus === undefined
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                                    tempStatus === undefined
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'border-gray-300'
                                }`}>
                                    {tempStatus === undefined && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`text-sm font-medium ${
                                    tempStatus === undefined ? 'text-blue-700' : 'text-gray-700'
                                }`}>
                                    Semua Status
                                </span>
                            </button>
                            {STATUS_OPTIONS.map((status) => (
                                <button
                                    key={status.id}
                                    onClick={() => setTempStatus(status.id)}
                                    className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 transition-all text-left ${
                                        tempStatus === status.id
                                            ? 'border-slate-800 bg-slate-50'
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                                        tempStatus === status.id
                                            ? 'bg-slate-800 border-slate-800'
                                            : 'border-gray-300'
                                    }`}>
                                        {tempStatus === status.id && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className={`text-sm font-medium ${
                                        tempStatus === status.id ? 'text-slate-800' : 'text-gray-700'
                                    }`}>
                                        {status.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Kategori Filter */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Kategori</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {/* All Kategori Option */}
                            <button
                                onClick={() => setTempKategori(undefined)}
                                className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 transition-all text-left ${
                                    tempKategori === undefined
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                                    tempKategori === undefined
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'border-gray-300'
                                }`}>
                                    {tempKategori === undefined && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`text-sm font-medium ${
                                    tempKategori === undefined ? 'text-blue-700' : 'text-gray-700'
                                }`}>
                                    Semua Kategori
                                </span>
                            </button>
                            {KATEGORI_OPTIONS.map((kategori) => (
                                <button
                                    key={kategori.id}
                                    onClick={() => setTempKategori(kategori.id)}
                                    className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 transition-all text-left ${
                                        tempKategori === kategori.id
                                            ? 'border-slate-800 bg-slate-50'
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                                        tempKategori === kategori.id
                                            ? 'bg-slate-800 border-slate-800'
                                            : 'border-gray-300'
                                    }`}>
                                        {tempKategori === kategori.id && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className={`text-sm font-medium ${
                                        tempKategori === kategori.id ? 'text-slate-800' : 'text-gray-700'
                                    }`}>
                                        {kategori.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== FOOTER ===== */}
                <div className="px-5 py-4 border-t border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReset}
                            className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={!hasChanges}
                            className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-all ${
                                hasChanges
                                    ? 'bg-linear-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg shadow-slate-300'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Terapkan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
