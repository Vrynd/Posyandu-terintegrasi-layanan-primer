/**
 * FilterModal Component
 */

import { X, Check, Filter as FilterIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { KategoriKey } from '../../../domain/entities/Peserta';
import type { KategoriConfig } from '../../constants/kategoriConfig';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedFilters: KategoriKey[];
    kategoriConfig: Record<KategoriKey, KategoriConfig>;
    onApply: (filters: KategoriKey[]) => void;
}

export function FilterModal({
    isOpen,
    onClose,
    selectedFilters,
    kategoriConfig,
    onApply,
}: Props) {
    const [tempFilters, setTempFilters] = useState<KategoriKey[]>(selectedFilters);

    // Sync with props when modal opens
    useEffect(() => {
        if (isOpen) {
            setTempFilters(selectedFilters);
        }
    }, [isOpen, selectedFilters]);

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

    const handleToggleFilter = (key: KategoriKey) => {
        setTempFilters(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    const handleSelectAll = () => {
        setTempFilters([]);
    };

    const handleApply = () => {
        onApply(tempFilters);
        onClose();
    };

    const hasChanges = JSON.stringify(tempFilters.sort()) !== JSON.stringify(selectedFilters.sort());

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Content */}
                <div className="text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                        <FilterIcon className="w-10 h-10 text-blue-600" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Filter Kategori
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-6">
                        Pilih kategori peserta yang ingin ditampilkan
                    </p>

                    {/* Filter Options */}
                    <div className="space-y-2 mb-6 text-left">
                        {/* All Categories */}
                        <button
                            onClick={handleSelectAll}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                                tempFilters.length === 0
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <span className={`text-sm font-medium ${
                                tempFilters.length === 0 ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                                Semua Kategori
                            </span>
                            {tempFilters.length === 0 && (
                                <Check className="w-5 h-5 text-blue-600" />
                            )}
                        </button>

                        {/* Individual Categories */}
                        {(Object.entries(kategoriConfig) as [KategoriKey, KategoriConfig][]).map(([key, config]) => {
                            const isSelected = tempFilters.includes(key);
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleToggleFilter(key)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                                        isSelected
                                            ? `border-${config.color.split('-')[1]}-500 ${config.bg}`
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${config.bg.replace('100', '500')}`} />
                                        <span className={`text-sm font-medium ${
                                            isSelected ? config.color : 'text-gray-700'
                                        }`}>
                                            {config.label}
                                        </span>
                                    </div>
                                    {isSelected && (
                                        <Check className={`w-5 h-5 ${config.color}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSelectAll}
                            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={!hasChanges}
                            className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-all ${
                                hasChanges
                                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
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
