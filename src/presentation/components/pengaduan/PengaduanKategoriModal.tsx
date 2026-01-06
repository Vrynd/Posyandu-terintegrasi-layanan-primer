/**
 * PengaduanKategoriModal - Category filter modal for Pengaduan list
 */

import { X, Check, Filter as FilterIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { PengaduanKategori } from '../../../domain/entities/Pengaduan';
import { KATEGORI_OPTIONS } from '../../../domain/entities/Pengaduan';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedKategori: PengaduanKategori | undefined;
    onApply: (kategori: PengaduanKategori | undefined) => void;
}

export function PengaduanKategoriModal({
    isOpen,
    onClose,
    selectedKategori,
    onApply,
}: Props) {
    const [tempKategori, setTempKategori] = useState<PengaduanKategori | undefined>(selectedKategori);

    // Sync with props when modal opens
    useEffect(() => {
        if (isOpen) {
            setTempKategori(selectedKategori);
        }
    }, [isOpen, selectedKategori]);

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

    const handleSelectAll = () => {
        setTempKategori(undefined);
    };

    const handleSelectKategori = (key: PengaduanKategori) => {
        setTempKategori(key);
    };

    const handleApply = () => {
        onApply(tempKategori);
        onClose();
    };

    const hasChanges = tempKategori !== selectedKategori;

    // Color mapping for kategori dots
    const dotColors: Record<PengaduanKategori, string> = {
        tampilan: 'bg-purple-500',
        data: 'bg-blue-500',
        performa: 'bg-amber-500',
        error: 'bg-red-500',
        lainnya: 'bg-gray-500',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
                            <FilterIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Filter Kategori</h3>
                            <p className="text-xs text-gray-500">Pilih kategori pengaduan</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {/* All Categories Option */}
                    <button
                        onClick={handleSelectAll}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all mb-4 ${
                            tempKategori === undefined
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${
                                tempKategori === undefined 
                                    ? 'bg-blue-500 border-blue-500' 
                                    : 'border-gray-300'
                            }`}>
                                {tempKategori === undefined && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm font-semibold ${
                                tempKategori === undefined ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                                Semua Kategori
                            </span>
                        </div>
                        <span className="text-xs text-gray-400">
                            {KATEGORI_OPTIONS.length} kategori
                        </span>
                    </button>

                    {/* Category List */}
                    <div className="space-y-2">
                        {KATEGORI_OPTIONS.map((option) => {
                            const isSelected = tempKategori === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelectKategori(option.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                                        isSelected
                                            ? 'border-slate-800 bg-slate-50'
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                                        isSelected 
                                            ? 'bg-slate-800 border-slate-800' 
                                            : 'border-gray-300'
                                    }`}>
                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${dotColors[option.id]}`} />
                                        <span className={`text-sm font-medium ${
                                            isSelected ? 'text-slate-800' : 'text-gray-700'
                                        }`}>
                                            {option.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSelectAll}
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
